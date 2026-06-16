using Microsoft.EntityFrameworkCore;
using WebApplication2.Models; // Ensure this matches your namespace

namespace WebApplication2.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Address> Addresses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Product>().Property(p => p.Price).HasPrecision(18, 2);
            modelBuilder.Entity<Order>().Property(o => o.TotalAmount).HasPrecision(18, 2);
            modelBuilder.Entity<OrderItem>().Property(oi => oi.UnitPrice).HasPrecision(18, 2);

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = "admin-1234-abcd", // Use a hardcoded string for seeded IDs
                    Name = "System Admin",
                    Email = "admin@yourstore.com",
                    Phone = "9999999999",
                    Avatar = "",
                    Role = "admin" // Overriding the default "customer"
                }
            );
        }
    }
}