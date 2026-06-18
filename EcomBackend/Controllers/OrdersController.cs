using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication2.Data;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/orders
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var orderDetails = orders.Select(o => new
            {
                o.Id,
                o.UserId,
                o.ShippingAddress,
                o.OrderDate,
                OrderStatus = o.OrderStatus,
                PaymentStatus = o.PaymentStatus,
                o.TotalAmount,
                Items = o.Items.Select(i => new
                {
                    i.ProductId,
                    i.Product.Name,
                    i.Product.ImageUrl,
                    i.Quantity,
                    i.UnitPrice,
                    SubTotal = i.Quantity * i.UnitPrice
                })
            });

            return Ok(orderDetails);
        }

        public class UpdateStatusDto
        {
            public string OrderStatus { get; set; } = null!;
            public string PaymentStatus { get; set; } = null!;
        }

        // PUT: api/orders/{id}/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateOrderStatus(string id, [FromBody] UpdateStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound("Order not found.");
            }

            order.OrderStatus = dto.OrderStatus;
            order.PaymentStatus = dto.PaymentStatus;

            await _context.SaveChangesAsync();
            return Ok(order);
        }

        // Temporary DTO for testing without a token
        public class CheckoutRequest
        {
            public string UserId { get; set; } = null!;
            public string ShippingAddress { get; set; } = null!;
        }

        // POST: api/orders/checkout
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
        {
            // 1. Get the user's cart and all the products inside it
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == request.UserId);

            if (cart == null || !cart.Items.Any())
            {
                return BadRequest(new { Message = "Cart is empty. Cannot place order." });
            }

            // 2. Create the main Order record
            var order = new Order
            {
                UserId = request.UserId,
                ShippingAddress = request.ShippingAddress,
                OrderDate = DateTime.UtcNow,
                OrderStatus = "Pending",
                PaymentStatus = "Pending",
                TotalAmount = cart.Items.Sum(i => i.Quantity * i.Product.Price)
            };

            _context.Orders.Add(order);

            // 3. Create the individual Order Items
            foreach (var item in cart.Items)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    // CRITICAL: We save the price *at this exact moment*
                    UnitPrice = item.Product.Price
                };
                _context.OrderItems.Add(orderItem);
            }

            // 4. Empty the user's cart now that the order is placed
            _context.CartItems.RemoveRange(cart.Items);

            // 5. Save all these changes to the Somee database in one transaction!
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Order placed successfully!",
                OrderId = order.Id,
                TotalCharged = order.TotalAmount
            });
        }

        // GET: api/orders/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserOrders(string userId)
        {
            var orders = await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var orderDetails = orders.Select(o => new
            {
                o.Id,
                o.UserId,
                o.ShippingAddress,
                o.OrderDate,
                OrderStatus = o.OrderStatus,
                PaymentStatus = o.PaymentStatus,
                o.TotalAmount,
                Items = o.Items.Select(i => new
                {
                    i.ProductId,
                    i.Product.Name,
                    i.Product.ImageUrl,
                    i.Quantity,
                    i.UnitPrice,
                    SubTotal = i.Quantity * i.UnitPrice
                })
            });

            return Ok(orderDetails);
        }
    }
}