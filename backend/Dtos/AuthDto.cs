using System.ComponentModel.DataAnnotations;

namespace CoolMes.Api.Dtos;

public class LoginRequestDto
{
    [Required(ErrorMessage = "Password is required")]
    [MaxLength(200)]
    public string Password { get; set; } = string.Empty;
}

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public DateTimeOffset ExpiresAt { get; set; }
}
