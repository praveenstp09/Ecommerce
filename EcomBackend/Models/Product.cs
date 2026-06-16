namespace WebApplication2.Models
{
    public class Product
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string Name { get; set; } = null!;
        public string Description { get; set; } = "";

        public decimal Price { get; set; }
        public int StockQuantity { get; set; }

        public string ImageUrl { get; set; } = "";

        public string Brand { get; set; } = "";
        public string Category { get; set; } = "";
        public string Subcategory { get; set; } = "";
        public double Rating { get; set; }
        public int ReviewCount { get; set; }
        public string Badge { get; set; } = "";
        public int Discount { get; set; }
        public bool FreeShipping { get; set; }
        public bool Trending { get; set; }
        public bool Featured { get; set; }
        
        public string ImagesJson { get; set; } = "[]";
        public string SpecificationsJson { get; set; } = "{}";
        public string FeaturesJson { get; set; } = "[]";
        public string TagsJson { get; set; } = "[]";

        // Navigation (Optional: If you want to see which carts/orders contain this product)
        public List<CartItem> CartItems { get; set; } = new();
        public List<OrderItem> OrderItems { get; set; } = new();
    }
}
