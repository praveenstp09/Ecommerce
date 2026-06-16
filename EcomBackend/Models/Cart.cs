namespace WebApplication2.Models
{
    public class Cart
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string UserId { get; set; } = null!;

        // Navigation
        public User User { get; set; } = null!;

        public List<CartItem> Items { get; set; } = new();
    }
}
