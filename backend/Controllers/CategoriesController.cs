using CoolMes.Api.Data;
using CoolMes.Api.Dtos;
using CoolMes.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace CoolMes.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    public const string CacheKey = "coolmes_categories_list";

    private readonly AppDbContext _context;
    private readonly ILogger<CategoriesController> _logger;
    private readonly IMemoryCache _cache;

    public CategoriesController(AppDbContext context, ILogger<CategoriesController> logger, IMemoryCache cache)
    {
        _context = context;
        _logger = logger;
        _cache = cache;
    }

    /// <summary>
    /// Get all categories with product counts (served from in-memory cache after first load)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        if (_cache.TryGetValue(CacheKey, out List<CategoryDto>? cachedCategories) && cachedCategories != null)
        {
            return Ok(cachedCategories);
        }

        var categories = await _context.Categories
            .AsNoTracking()
            .Select(c => new CategoryDto
            {
                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName,
                Description = c.Description,
                ProductCount = c.Products.Count
            })
            .OrderBy(c => c.CategoryName)
            .ToListAsync();

        _cache.Set(CacheKey, categories, TimeSpan.FromHours(6));

        return Ok(categories);
    }

    /// <summary>
    /// Get a single category by ID
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryDto>> GetCategory(int id)
    {
        var category = await _context.Categories
            .Where(c => c.CategoryId == id)
            .Select(c => new CategoryDto
            {
                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName,
                Description = c.Description,
                ProductCount = c.Products.Count
            })
            .FirstOrDefaultAsync();

        if (category == null)
        {
            return NotFound(new { message = $"Category with ID {id} was not found." });
        }

        return Ok(category);
    }

    /// <summary>
    /// Create a new category (admin only)
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var exists = await _context.Categories
            .AnyAsync(c => c.CategoryName.ToLower() == dto.CategoryName.Trim().ToLower());

        if (exists)
        {
            return Conflict(new { message = $"Category '{dto.CategoryName}' already exists." });
        }

        var category = new Category
        {
            CategoryName = dto.CategoryName.Trim(),
            Description = dto.Description?.Trim()
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        _cache.Remove(CacheKey);

        _logger.LogInformation("Admin created category {CategoryId} '{CategoryName}'", category.CategoryId, category.CategoryName);

        var result = new CategoryDto
        {
            CategoryId = category.CategoryId,
            CategoryName = category.CategoryName,
            Description = category.Description,
            ProductCount = 0
        };

        return CreatedAtAction(nameof(GetCategory), new { id = category.CategoryId }, result);
    }

    /// <summary>
    /// Update an existing category (admin only)
    /// </summary>
    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<ActionResult<CategoryDto>> UpdateCategory(int id, [FromBody] UpdateCategoryDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            return NotFound(new { message = $"Category with ID {id} was not found." });
        }

        var nameExists = await _context.Categories
            .AnyAsync(c => c.CategoryId != id && c.CategoryName.ToLower() == dto.CategoryName.Trim().ToLower());

        if (nameExists)
        {
            return Conflict(new { message = $"Another category named '{dto.CategoryName}' already exists." });
        }

        category.CategoryName = dto.CategoryName.Trim();
        category.Description = dto.Description?.Trim();

        await _context.SaveChangesAsync();
        _cache.Remove(CacheKey);

        _logger.LogInformation("Admin updated category {CategoryId} '{CategoryName}'", category.CategoryId, category.CategoryName);

        var productCount = await _context.Products.CountAsync(p => p.CategoryId == id);

        var result = new CategoryDto
        {
            CategoryId = category.CategoryId,
            CategoryName = category.CategoryName,
            Description = category.Description,
            ProductCount = productCount
        };

        return Ok(result);
    }

    /// <summary>
    /// Delete a category (admin only)
    /// </summary>
    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.CategoryId == id);

        if (category == null)
        {
            return NotFound(new { message = $"Category with ID {id} was not found." });
        }

        if (category.Products.Any())
        {
            return BadRequest(new
            {
                message = $"Cannot delete category '{category.CategoryName}' because it contains {category.Products.Count} products. Move or delete the products first."
            });
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        _cache.Remove(CacheKey);

        _logger.LogInformation("Admin deleted category {CategoryId} '{CategoryName}'", category.CategoryId, category.CategoryName);

        return Ok(new { message = $"Category '{category.CategoryName}' deleted successfully." });
    }
}

