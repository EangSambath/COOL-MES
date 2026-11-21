using CoolMes.Api.Auth;
using CoolMes.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CoolMes.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AdminTokenService _tokens;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AdminTokenService tokens, ILogger<AuthController> logger)
    {
        _tokens = tokens;
        _logger = logger;
    }

    /// <summary>
    /// Admin login. Returns a token to send as "Authorization: Bearer {token}".
    /// Limited to 5 attempts per minute per IP address.
    /// </summary>
    [HttpPost("login")]
    [EnableRateLimiting(RateLimitPolicies.Login)]
    public ActionResult<LoginResponseDto> Login([FromBody] LoginRequestDto dto)
    {
        if (!_tokens.IsConfigured)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new
            {
                message = "Admin login is not set up on the server yet. Set the ADMIN_PASSWORD environment variable and restart the API."
            });
        }

        if (!_tokens.CheckPassword(dto.Password))
        {
            _logger.LogWarning("Failed admin login attempt from {Ip}", HttpContext.Connection.RemoteIpAddress);
            return Unauthorized(new { message = "Incorrect password. Please try again." });
        }

        var (token, expiresAt) = _tokens.CreateToken();
        _logger.LogInformation("Admin logged in from {Ip}", HttpContext.Connection.RemoteIpAddress);

        return Ok(new LoginResponseDto { Token = token, ExpiresAt = expiresAt });
    }

    /// <summary>Returns 200 when the admin token is still valid, otherwise 401.</summary>
    [HttpGet("verify")]
    [Authorize]
    public IActionResult Verify() => Ok(new { valid = true });
}

public static class RateLimitPolicies
{
    public const string Login = "login";
}
