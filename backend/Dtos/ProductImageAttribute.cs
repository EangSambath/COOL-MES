using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace CoolMes.Api.Dtos;

/// <summary>
/// Accepts only safe product image values:
///   - http(s) links           e.g. https://images.example.com/item.jpg
///   - site-relative paths     e.g. /picture/item.webp (files in frontend/public)
///   - uploaded pictures       data:image/(png|jpeg|webp|gif|avif);base64,... (max ~2 MB)
/// Rejects anything else (javascript:, data:image/svg+xml, random text, ...).
/// </summary>
public sealed class ProductImageAttribute : ValidationAttribute
{
    public const int MaxLength = 2_000_000;

    private static readonly Regex DataUrlPattern = new(
        @"^data:image/(png|jpe?g|webp|gif|avif);base64,[A-Za-z0-9+/]+=*$",
        RegexOptions.IgnoreCase | RegexOptions.CultureInvariant,
        TimeSpan.FromSeconds(1));

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        // Empty values are handled by [Required]
        if (value is not string raw || string.IsNullOrWhiteSpace(raw))
            return ValidationResult.Success;

        var text = raw.Trim();

        if (text.Length > MaxLength)
            return new ValidationResult("The picture is too large. Please upload a smaller image.");

        if (text.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
        {
            return DataUrlPattern.IsMatch(text)
                ? ValidationResult.Success
                : new ValidationResult("Uploaded picture must be a PNG, JPEG, WEBP, GIF or AVIF image.");
        }

        if (text.StartsWith('/') && !text.StartsWith("//"))
            return ValidationResult.Success;

        if (Uri.TryCreate(text, UriKind.Absolute, out var uri) &&
            (uri.Scheme == Uri.UriSchemeHttps || uri.Scheme == Uri.UriSchemeHttp))
            return ValidationResult.Success;

        return new ValidationResult("Image must be an http(s) link, a site path like /picture/item.webp, or an uploaded picture.");
    }
}
