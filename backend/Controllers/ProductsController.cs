using System.Linq.Expressions;
using CoolMes.Api.Data;
using CoolMes.Api.Dtos;
using CoolMes.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CoolMes.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private const int DefaultPageSize = 12;
    private const int MaxPageSize = 100;
    private const int MaxPage = 100_000; // keeps (page - 1) * pageSize far away from int overflow

    // One place that turns a Product row into the JSON shape the frontend uses.
    // EF Core translates this into SQL, so only the needed columns are read.
    private static readonly Expression<Func<Product, ProductDto>> ToDtoExpression = p => new ProductDto
    {
        ProductId = p.ProductId,
        ProductName = p.ProductName,
        Description = p.Description,
        Price = p.Price,
        ImageUrl = p.ImageUrl,
        StockQuantity = p.StockQuantity,
        CategoryId = p.CategoryId,
        CategoryName = p.Category != null ? p.Category.CategoryName : string.Empty,
        CreatedAt = p.CreatedAt,
        UpdatedAt = p.UpdatedAt
    };

    private static readonly Func<Product, ProductDto> ToDto = ToDtoExpression.Compile();

    private readonly AppDbContext _context;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(AppDbContext context, ILogger<ProductsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get paginated and filtered products list
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetProducts([FromQuery] ProductQueryParams query)
    {
        IQueryable<Product> productQuery = _context.Products.AsNoTracking();

        // 1. Search by name or description
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchTerm = query.Search.Trim().ToLower();
            productQuery = productQuery.Where(p =>
                p.ProductName.ToLower().Contains(searchTerm) ||
                (p.Description != null && p.Description.ToLower().Contains(searchTerm)));
        }

        // 2. Filter by category
        if (query.CategoryId.HasValue && query.CategoryId.Value > 0)
        {
            productQuery = productQuery.Where(p => p.CategoryId == query.CategoryId.Value);
        }

        // 3. Filter by price range
        if (query.MinPrice.HasValue)
        {
            productQuery = productQuery.Where(p => p.Price >= query.MinPrice.Value);
        }

        if (query.MaxPrice.HasValue)
        {
            productQuery = productQuery.Where(p => p.Price <= query.MaxPrice.Value);
        }

        // 4. Filter by stock status
        if (query.InStockOnly == true)
        {
            productQuery = productQuery.Where(p => p.StockQuantity > 0);
        }

        // 5. Sorting (ProductId as a tie-breaker keeps page order stable)
        productQuery = query.SortBy?.ToLower() switch
        {
            "price_asc" => productQuery.OrderBy(p => p.Price).ThenBy(p => p.ProductId),
            "price_desc" => productQuery.OrderByDescending(p => p.Price).ThenBy(p => p.ProductId),
            "name_asc" => productQuery.OrderBy(p => p.ProductName).ThenBy(p => p.ProductId),
            "name_desc" => productQuery.OrderByDescending(p => p.ProductName).ThenBy(p => p.ProductId),
            "oldest" => productQuery.OrderBy(p => p.CreatedAt).ThenBy(p => p.ProductId),
            _ => productQuery.OrderByDescending(p => p.CreatedAt).ThenByDescending(p => p.ProductId) // default newest
        };

        var totalCount = await productQuery.CountAsync();

        var page = Math.Clamp(query.Page, 1, MaxPage);
        var pageSize = query.PageSize > 0 ? Math.Min(query.PageSize, MaxPageSize) : DefaultPageSize;

        var items = await productQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(ToDtoExpression)
            .ToListAsync();

        return Ok(new PagedResult<ProductDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        });
    }

    /// <summary>
    /// Get all products without pagination (useful for fast client-side filters)
    /// </summary>
    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts()
    {
        var products = await _context.Products
            .AsNoTracking()
            .OrderByDescending(p => p.CreatedAt)
            .Select(ToDtoExpression)
            .ToListAsync();

        return Ok(products);
    }

    /// <summary>
    /// Get top featured products
    /// </summary>
    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetFeaturedProducts([FromQuery] int limit = 8)
    {
        var effectiveLimit = Math.Clamp(limit, 1, 24);

        var products = await _context.Products
            .AsNoTracking()
            .Where(p => p.StockQuantity > 0)
            .OrderByDescending(p => p.CreatedAt)
            .Take(effectiveLimit)
            .Select(ToDtoExpression)
            .ToListAsync();

        return Ok(products);
    }

    /// <summary>
    /// Get a single product by ID
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _context.Products
            .AsNoTracking()
            .Where(p => p.ProductId == id)
            .Select(ToDtoExpression)
            .FirstOrDefaultAsync();

        if (product == null)
        {
            return NotFound(new { message = $"Product with ID {id} was not found." });
        }

        return Ok(product);
    }

    /// <summary>
    /// Create a new product (admin only)
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var category = await _context.Categories.FindAsync(dto.CategoryId);
        if (category == null)
        {
            return BadRequest(new { message = $"Category with ID {dto.CategoryId} does not exist." });
        }

        var product = new Product
        {
            ProductName = dto.ProductName.Trim(),
            Description = dto.Description?.Trim(),
            Price = dto.Price,
            ImageUrl = dto.ImageUrl.Trim(),
            StockQuantity = dto.StockQuantity,
            CategoryId = dto.CategoryId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Admin created product {ProductId} '{ProductName}'", product.ProductId, product.ProductName);

        var result = ToDto(product);
        result.CategoryName = category.CategoryName;

        return CreatedAtAction(nameof(GetProduct), new { id = product.ProductId }, result);
    }

    /// <summary>
    /// Update an existing product (admin only)
    /// </summary>
    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<ProductDto>> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = $"Product with ID {id} was not found." });
        }

        var category = await _context.Categories.FindAsync(dto.CategoryId);
        if (category == null)
        {
            return BadRequest(new { message = $"Category with ID {dto.CategoryId} does not exist." });
        }

        product.ProductName = dto.ProductName.Trim();
        product.Description = dto.Description?.Trim();
        product.Price = dto.Price;
        product.ImageUrl = dto.ImageUrl.Trim();
        product.StockQuantity = dto.StockQuantity;
        product.CategoryId = dto.CategoryId;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Admin updated product {ProductId} '{ProductName}'", product.ProductId, product.ProductName);

        var result = ToDto(product);
        result.CategoryName = category.CategoryName;

        return Ok(result);
    }

    /// <summary>
    /// Update stock quantity for a product (admin only)
    /// </summary>
    [HttpPatch("{id:int}/stock")]
    [Authorize]
    public async Task<ActionResult> UpdateStock(int id, [FromBody] UpdateStockDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = $"Product with ID {id} was not found." });
        }

        product.StockQuantity = dto.StockQuantity;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Admin set stock of product {ProductId} to {Stock}", product.ProductId, product.StockQuantity);

        return Ok(new
        {
            message = "Stock updated successfully.",
            productId = product.ProductId,
            stockQuantity = product.StockQuantity,
            inStock = product.StockQuantity > 0
        });
    }

    /// <summary>
    /// Delete a product (admin only)
    /// </summary>
    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = $"Product with ID {id} was not found." });
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Admin deleted product {ProductId} '{ProductName}'", product.ProductId, product.ProductName);

        return Ok(new { message = $"Product '{product.ProductName}' deleted successfully." });
    }
}
