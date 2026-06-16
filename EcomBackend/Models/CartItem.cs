namespace WebApplication2.Models
{
        public class CartItem
        {
            public string Id { get; set; } = Guid.NewGuid().ToString();

            public string CartId { get; set; } = null!;
            public string ProductId { get; set; } = null!;

            public int Quantity { get; set; }

            public string SelectedColor { get; set; } = "";
            public string SelectedSize { get; set; } = "";

            // Navigation
            public Cart Cart { get; set; } = null!;

            // ADD THIS: So you can load Product details in the Cart
            public Product Product { get; set; } = null!;
        }
    
}
