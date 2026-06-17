using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApplication2.Data;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // DTO for the incoming request
        public class LoginDto
        {
            public string Phone { get; set; } = null!;
            public string Otp { get; set; } = null!;
        }

        public class RegisterDto
        {
            public string Phone { get; set; } = null!;
            public string Name { get; set; } = null!;
            public string Email { get; set; } = "";
        }

        [HttpGet("check-phone")]
        public async Task<IActionResult> CheckPhone([FromQuery] string phone)
        {
            var exists = await _context.Users.AnyAsync(u => u.Phone == phone);
            return Ok(new { Exists = exists });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Phone) || string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { Message = "Phone and Name are required." });
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Phone == request.Phone);
            if (existingUser != null)
            {
                return BadRequest(new { Message = "User already exists." });
            }

            var user = new User
            {
                Phone = request.Phone,
                Name = request.Name,
                Email = request.Email ?? "",
                Role = "customer"
            };

            // Automatically create an empty Cart for the new user!
            user.Cart = new Cart { UserId = user.Id };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Registration successful" });
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] LoginDto request)
        {
            // 1. Hardcoded OTP Check
            if (request.Otp != "0000")
            {
                return Unauthorized(new { Message = "Invalid OTP." });
            }

            // 2. Look for the user in the database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Phone == request.Phone);

            // 3. If user doesn't exist, require registration
            if (user == null)
            {
                return NotFound(new { Message = "User not registered. Please sign up first." });
            }

            // 4. Generate the JWT Token
            var token = GenerateJwtToken(user);

            // 5. Set the token in an HttpOnly cookie
            Response.Cookies.Append("token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // Allow HTTP on localhost
                SameSite = SameSiteMode.Lax, // Lax is sufficient for localhost cross-port requests
                Expires = DateTime.UtcNow.AddDays(7)
            });

            // 6. Return token and user data
            return Ok(new
            {
                Token = token,
                Message = "Login successful",
                UserId = user.Id,
                Role = user.Role
            });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));

            // Put useful user info into the token payload
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim("Phone", user.Phone),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7), // Token lasts for 7 days
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}