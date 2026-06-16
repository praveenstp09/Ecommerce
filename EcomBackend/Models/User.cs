using System.Net;

namespace WebApplication2.Models
{
    public class User
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string Name { get; set; } = null!;
        public string Email { get; set; } = "";
        public string Phone { get; set; } = null!;
        public string Avatar { get; set; } = "";
        public string Role { get; set; } = "customer";

        // Navigation
        public List<Address> Addresses { get; set; } = new();
        public Cart? Cart { get; set; }
        public List<Order> Orders { get; set; } = new();
    }
}
