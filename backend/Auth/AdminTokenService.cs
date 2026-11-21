using System.Security.Cryptography;
using System.Text;

namespace CoolMes.Api.Auth;

/// <summary>
/// Checks the admin password and issues / validates signed admin session tokens.
///
/// Configuration (environment variables win over appsettings):
///   ADMIN_PASSWORD      or Admin:Password     - required, the admin login password
///   ADMIN_TOKEN_SECRET  or Admin:TokenSecret  - recommended, long random string used to sign tokens
///   Admin:TokenHours                          - optional, session length (default 8 hours)
///
/// Token format: base64url("admin.{expiryUnixSeconds}") + "." + base64url(HMAC-SHA256 signature).
/// The signing key is derived from the secret AND the password, so changing the password
/// immediately logs out every existing admin session.
/// </summary>
public class AdminTokenService
{
    private readonly byte[] _signingKey;
    private readonly byte[]? _passwordHash;
    private readonly TimeSpan _lifetime;

    public AdminTokenService(IConfiguration config, ILogger<AdminTokenService> logger)
    {
        var password = FirstNonEmpty(config["ADMIN_PASSWORD"], config["Admin:Password"]);
        var secret = FirstNonEmpty(config["ADMIN_TOKEN_SECRET"], config["Admin:TokenSecret"]);

        byte[] secretBytes;
        if (secret is null)
        {
            secretBytes = RandomNumberGenerator.GetBytes(32);
            logger.LogWarning("ADMIN_TOKEN_SECRET is not set. Using a random secret, so admin sessions end whenever the API restarts.");
        }
        else
        {
            secretBytes = Encoding.UTF8.GetBytes(secret);
        }

        if (password is null)
        {
            logger.LogWarning("ADMIN_PASSWORD is not set. Admin login is disabled until it is configured.");
        }
        else
        {
            _passwordHash = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        }

        _signingKey = HMACSHA256.HashData(secretBytes, Encoding.UTF8.GetBytes("coolmes-admin:" + (password ?? string.Empty)));

        var hours = config.GetValue<double?>("Admin:TokenHours") ?? 8;
        _lifetime = TimeSpan.FromHours(hours > 0 ? hours : 8);
    }

    /// <summary>True when an admin password has been configured on the server.</summary>
    public bool IsConfigured => _passwordHash is not null;

    /// <summary>Constant-time password check (does not leak timing information).</summary>
    public bool CheckPassword(string? candidate)
    {
        if (_passwordHash is null || string.IsNullOrEmpty(candidate)) return false;
        var candidateHash = SHA256.HashData(Encoding.UTF8.GetBytes(candidate));
        return CryptographicOperations.FixedTimeEquals(candidateHash, _passwordHash);
    }

    public (string Token, DateTimeOffset ExpiresAt) CreateToken()
    {
        var expiresAt = DateTimeOffset.UtcNow.Add(_lifetime);
        var payloadPart = Base64UrlEncode(Encoding.UTF8.GetBytes($"admin.{expiresAt.ToUnixTimeSeconds()}"));
        var signaturePart = Base64UrlEncode(Sign(payloadPart));
        return ($"{payloadPart}.{signaturePart}", expiresAt);
    }

    public bool ValidateToken(string? token)
    {
        if (!IsConfigured || string.IsNullOrWhiteSpace(token)) return false;

        var parts = token.Split('.');
        if (parts.Length != 2) return false;

        var providedSignature = Base64UrlDecode(parts[1]);
        if (providedSignature is null || !CryptographicOperations.FixedTimeEquals(Sign(parts[0]), providedSignature))
            return false;

        var payloadBytes = Base64UrlDecode(parts[0]);
        if (payloadBytes is null) return false;

        var fields = Encoding.UTF8.GetString(payloadBytes).Split('.');
        if (fields.Length != 2 || fields[0] != "admin" || !long.TryParse(fields[1], out var expiresUnix))
            return false;

        return DateTimeOffset.UtcNow.ToUnixTimeSeconds() < expiresUnix;
    }

    private byte[] Sign(string data) => HMACSHA256.HashData(_signingKey, Encoding.UTF8.GetBytes(data));

    private static string? FirstNonEmpty(params string?[] values) =>
        values.FirstOrDefault(v => !string.IsNullOrWhiteSpace(v))?.Trim();

    private static string Base64UrlEncode(byte[] bytes) =>
        Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    private static byte[]? Base64UrlDecode(string text)
    {
        var base64 = text.Replace('-', '+').Replace('_', '/');
        base64 = base64.PadRight(base64.Length + (4 - base64.Length % 4) % 4, '=');
        try
        {
            return Convert.FromBase64String(base64);
        }
        catch (FormatException)
        {
            return null;
        }
    }
}
