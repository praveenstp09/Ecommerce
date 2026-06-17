using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication2.Data;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Dependency Injection: This brings your database connection into the controller
        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] string? search = null)
        {
            IQueryable<Product> query = _context.Products;

            if (!string.IsNullOrEmpty(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(p => 
                    p.Name.ToLower().Contains(lowerSearch) || 
                    p.Brand.ToLower().Contains(lowerSearch) || 
                    p.Description.ToLower().Contains(lowerSearch) ||
                    p.TagsJson.ToLower().Contains(lowerSearch)
                );
            }

            var products = await query.ToListAsync();
            return Ok(products);
        }

        // GET: api/products/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(string id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound("Product not found.");
            }

            return Ok(product);
        }

        // POST: api/products
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            // Ensure a new ID is generated
            product.Id = Guid.NewGuid().ToString();

            // Add the product to the EF Core context
            _context.Products.Add(product);

            // Save it to the Somee database!
            await _context.SaveChangesAsync();

            // Return a 201 Created response
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
    }
}