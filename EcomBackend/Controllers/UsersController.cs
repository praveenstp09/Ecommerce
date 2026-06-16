using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebApplication2.Data;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/users/profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .Include(u => u.Addresses)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Phone,
                user.Avatar,
                user.Role,
                Addresses = user.Addresses.Select(a => new
                {
                    a.Id,
                    a.Label,
                    a.Name,
                    a.Phone,
                    a.Line1,
                    a.Line2,
                    a.City,
                    a.State,
                    a.Pincode,
                    a.IsDefault
                })
            });
        }

        public class UpdateProfileDto
        {
            public string Name { get; set; } = null!;
            public string Email { get; set; } = "";
            public string Avatar { get; set; } = "";
        }

        // PUT: api/users/profile
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.Name = dto.Name;
            user.Email = dto.Email;
            user.Avatar = dto.Avatar;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Profile updated successfully.", User = user });
        }

        // GET: api/users/addresses
        [HttpGet("addresses")]
        public async Task<IActionResult> GetAddresses()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var addresses = await _context.Addresses
                .Where(a => a.UserId == userId)
                .ToListAsync();

            return Ok(addresses);
        }

        public class AddressDto
        {
            public string Label { get; set; } = "Home";
            public string Name { get; set; } = null!;
            public string Phone { get; set; } = null!;
            public string Line1 { get; set; } = null!;
            public string Line2 { get; set; } = "";
            public string City { get; set; } = null!;
            public string State { get; set; } = null!;
            public string Pincode { get; set; } = null!;
            public bool IsDefault { get; set; }
        }

        // POST: api/users/addresses
        [HttpPost("addresses")]
        public async Task<IActionResult> AddAddress([FromBody] AddressDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // If this is set to default, unset other default addresses for this user
            if (dto.IsDefault)
            {
                var defaultAddresses = await _context.Addresses
                    .Where(a => a.UserId == userId && a.IsDefault)
                    .ToListAsync();
                foreach (var addr in defaultAddresses)
                {
                    addr.IsDefault = false;
                }
            }

            var address = new Address
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Label = dto.Label,
                Name = dto.Name,
                Phone = dto.Phone,
                Line1 = dto.Line1,
                Line2 = dto.Line2,
                City = dto.City,
                State = dto.State,
                Pincode = dto.Pincode,
                IsDefault = dto.IsDefault
            };

            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();

            return Ok(address);
        }

        // DELETE: api/users/addresses/{id}
        [HttpDelete("addresses/{id}")]
        public async Task<IActionResult> DeleteAddress(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var address = await _context.Addresses
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (address == null)
            {
                return NotFound("Address not found or unauthorized.");
            }

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Address deleted successfully." });
        }
    }
}
