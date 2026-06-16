using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication2.Data;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize] <-- We will uncomment this at the end when you re-enable your security!
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        // A temporary DTO so we can test without needing a Token right now
        public class AddToCartRequest
        {
            public string UserId { get; set; } = null!;
            public string ProductId { get; set; } = null!;
            public int Quantity { get; set; }
        }

        // POST: api/cart/add
        [HttpPost("add")]
        public async Task<IActionResult> AddItem([FromBody] AddToCartRequest request)
        {
            // 1. Find the user's cart (Remember, we automatically created a blank cart during Login!)
            var cart = await _context.Carts
                .Include(c => c.Items) // We must include Items so EF Core knows what's already inside
                .FirstOrDefaultAsync(c => c.UserId == request.UserId);

            if (cart == null)
            {
                return NotFound(new { Message = "Cart not found for this user." });
            }

            // 2. Check if this exact product is already in the cart
            var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);

            if (existingItem != null)
            {
                // If it's already there, just increase the quantity!
                existingItem.Quantity += request.Quantity;
            }
            else
            {
                // If it's not there, add it as a brand new CartItem
                var newItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };
                _context.CartItems.Add(newItem);
            }

            // 3. Save everything to your live Somee Database
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Product added to cart successfully!" });
        }

        // GET: api/cart/{userId}
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(string userId)
        {
            // Fetch the cart AND include the Product details for each item
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound(new { Message = "Cart not found." });
            }

            // Format the data nicely so the frontend can easily display it
            var cartDetails = new
            {
                CartId = cart.Id,
                TotalItems = cart.Items.Sum(i => i.Quantity),
                // Calculate total price dynamically
                TotalPrice = cart.Items.Sum(i => i.Quantity * i.Product.Price),
                Items = cart.Items.Select(i => new
                {
                    i.ProductId,
                    i.Product.Name,
                    i.Product.ImageUrl,
                    i.Quantity,
                    i.Product.Price,
                    SubTotal = i.Quantity * i.Product.Price
                })
            };

             return Ok(cartDetails);
        }

        // A DTO for update request
        public class UpdateCartRequest
        {
            public string UserId { get; set; } = null!;
            public string ProductId { get; set; } = null!;
            public int Quantity { get; set; }
        }

        // PUT: api/cart/update
        [HttpPut("update")]
        public async Task<IActionResult> UpdateQuantity([FromBody] UpdateCartRequest request)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == request.UserId);

            if (cart == null)
            {
                return NotFound(new { Message = "Cart not found." });
            }

            var item = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);
            if (item != null)
            {
                if (request.Quantity <= 0)
                {
                    _context.CartItems.Remove(item);
                }
                else
                {
                    item.Quantity = request.Quantity;
                }
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Cart item updated successfully." });
            }

            return NotFound(new { Message = "Item not found in cart." });
        }

        // DELETE: api/cart/remove
        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveItem([FromQuery] string userId, [FromQuery] string productId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound(new { Message = "Cart not found." });
            }

            var item = cart.Items.FirstOrDefault(i => i.ProductId == productId);
            if (item != null)
            {
                _context.CartItems.Remove(item);
                await _context.SaveChangesAsync();
                return Ok(new { Message = "Item removed from cart." });
            }

            return NotFound(new { Message = "Item not found in cart." });
        }

        // DELETE: api/cart/clear/{userId}
        [HttpDelete("clear/{userId}")]
        public async Task<IActionResult> ClearCart(string userId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound(new { Message = "Cart not found." });
            }

            _context.CartItems.RemoveRange(cart.Items);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Cart cleared successfully." });
        }
    }
}