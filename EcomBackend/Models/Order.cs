namespace WebApplication2.Models
{
    
        public class Order
        {
            public string Id { get; set; } = Guid.NewGuid().ToString();

            public string UserId { get; set; } = null!;

            public DateTime OrderDate { get; set; } = DateTime.UtcNow;

            // Always use decimal for currency
            public decimal TotalAmount { get; set; }

            // e.g., "Pending", "Processing", "Shipped", "Delivered", "Cancelled"
            public string OrderStatus { get; set; } = "Pending";

            // e.g., "Pending", "Paid", "Failed", "Refunded"
            public string PaymentStatus { get; set; } = "Pending";

            // It's often smart to store the shipping address directly on the order 
            // in case the user deletes/changes their main address later.
            public string ShippingAddress { get; set; } = null!;

            // Navigation
            public User User { get; set; } = null!;
            public List<OrderItem> Items { get; set; } = new();
        }
    
}
