namespace WebApplication2.Models
{
    public class Address
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string UserId { get; set; } = null!;

        public string Label { get; set; } = "Home"; // e.g., "Home", "Work"
        public string Name { get; set; } = null!;
        public string Phone { get; set; } = null!;

        public string Line1 { get; set; } = null!;
        public string Line2 { get; set; } = "";
        public string City { get; set; } = null!;
        public string State { get; set; } = null!;
        public string Pincode { get; set; } = null!;

        public bool IsDefault { get; set; }

        public User User { get; set; } = null!;
    }
}
