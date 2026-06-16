namespace WebApplication2.Models
{
   
        public class OrderItem
        {
            public string Id { get; set; } = Guid.NewGuid().ToString();

            public string OrderId { get; set; } = null!;
            public string ProductId { get; set; } = null!;

            public int Quantity { get; set; }

            // CRITICAL: Store the price at the time of purchase.
            // If the product price goes up tomorrow, this order's total shouldn't change.
            public decimal UnitPrice { get; set; }

            public string SelectedColor { get; set; } = "";
            public string SelectedSize { get; set; } = "";

            // Navigation
            public Order Order { get; set; } = null!;
            public Product Product { get; set; } = null!;
        }
    
}
