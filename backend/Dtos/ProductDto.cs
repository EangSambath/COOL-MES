using System.ComponentModel.DataAnnotations;

namespace CoolMes.Api.Dtos;

public class ProductDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public bool InStock => StockQuantity > 0;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateProductDto
{
    [Required(ErrorMessage = "Product name is required")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Product name must be between 2 and 200 characters")]
    public string ProductName { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required(ErrorMessage = "Price is required")]
    [Range(0.01, 1000000.00, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Image URL is required")]
    [Url(ErrorMessage = "Please provide a valid image URL")]
    public string ImageUrl { get; set; } = string.Empty;

    [Range(0, 100000, ErrorMessage = "Stock quantity must be non-negative")]
    public int StockQuantity { get; set; } = 0;

    [Required(ErrorMessage = "Category ID is required")]
    public int CategoryId { get; set; }
}

public class UpdateProductDto
{
    [Required(ErrorMessage = "Product name is required")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Product name must be between 2 and 200 characters")]
    public string ProductName { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required(ErrorMessage = "Price is required")]
    [Range(0.01, 1000000.00, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Image URL is required")]
    [Url(ErrorMessage = "Please provide a valid image URL")]
    public string ImageUrl { get; set; } = string.Empty;

    [Range(0, 100000, ErrorMessage = "Stock quantity must be non-negative")]
    public int StockQuantity { get; set; } = 0;

    [Required(ErrorMessage = "Category ID is required")]
    public int CategoryId { get; set; }
}

public class UpdateStockDto
{
    [Range(0, 100000, ErrorMessage = "Stock quantity must be non-negative")]
    public int StockQuantity { get; set; }
}

public class ProductQueryParams
{
    public string? Search { get; set; }
    public int? CategoryId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? InStockOnly { get; set; }
    public string? SortBy { get; set; } // "price_asc", "price_desc", "name_asc", "name_desc", "newest"
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}

public class PagedResult<T>
{
    public IEnumerable<T> Items { get; set; } = new List<T>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / (PageSize > 0 ? PageSize : 1));
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;
}

