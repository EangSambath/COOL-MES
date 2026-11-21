using System.Threading.RateLimiting;
using CoolMes.Api.Auth;
using CoolMes.Api.Controllers;
using CoolMes.Api.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Bind to Render's PORT environment variable if provided
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

// Swagger is a developer tool: on in Development, off in production unless EnableSwagger=true
var enableSwagger = builder.Environment.IsDevelopment() || builder.Configuration.GetValue<bool>("EnableSwagger");

// 1. Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "COOL MES - E-Commerce Web API (.NET 8 LTS)",
        Version = "v1",
        Description = "Backend API for COOL MES Gears & Accessories Store (Telegram: @eangsambath). " +
                      "To call admin endpoints: POST /api/auth/login, then click Authorize and paste the token."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        Description = "Admin token from POST /api/auth/login"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
            Array.Empty<string>()
        }
    });
});

// 2. Register PostgreSQL Database Context (supports both Key=Value and Render's postgres:// URL)
var rawConnectionString =
    Environment.GetEnvironmentVariable("DATABASE_URL") ??
    builder.Configuration.GetConnectionString("DefaultConnection") ??
    string.Empty;

var connectionString = NormalizePostgresConnectionString(rawConnectionString);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 3. Admin authentication: POST /api/auth/login returns a signed token.
//    Every create / update / delete endpoint requires "Authorization: Bearer {token}".
builder.Services.AddSingleton<AdminTokenService>();
builder.Services
    .AddAuthentication(AdminTokenAuthenticationHandler.SchemeName)
    .AddScheme<AuthenticationSchemeOptions, AdminTokenAuthenticationHandler>(AdminTokenAuthenticationHandler.SchemeName, _ => { });
builder.Services.AddAuthorization();

// 4. Brute-force protection: max 5 login attempts per minute per IP address
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, cancellationToken) =>
    {
        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            message = "Too many login attempts. Please wait one minute and try again."
        }, cancellationToken);
    };
    options.AddPolicy(RateLimitPolicies.Login, httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
});

// 5. Hosting platforms like Render put a proxy in front of the API.
//    This makes RemoteIpAddress the real visitor IP (needed for the login rate limit).
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// 6. CORS: local dev servers + the deployed frontend(s) listed in FRONTEND_URL (comma-separated)
var allowedOrigins = new List<string>
{
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000"
};

var frontendUrl = builder.Configuration["FRONTEND_URL"];
if (!string.IsNullOrWhiteSpace(frontendUrl))
{
    foreach (var origin in frontendUrl.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
    {
        allowedOrigins.Add(origin.TrimEnd('/'));
    }
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
                !string.IsNullOrWhiteSpace(origin) &&
                allowedOrigins.Contains(origin.TrimEnd('/'), StringComparer.OrdinalIgnoreCase))
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// 7. Auto-seed Database on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        logger.LogInformation("Checking database and applying seed data if needed...");
        await DbInitializer.SeedAsync(context);
        logger.LogInformation("Database initialization completed successfully.");
    }
    catch (Exception ex)
    {
        logger.LogWarning("Could not connect to PostgreSQL database or seed data: {Message}. Please verify your connection string.", ex.Message);
    }
}

// 8. Configure the HTTP request pipeline
app.UseForwardedHeaders();

if (enableSwagger)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "COOL MES API v1");
        c.RoutePrefix = string.Empty; // Serves Swagger UI directly at / and /index.html
    });
    app.MapGet("/swagger", () => Results.Redirect("/"));
}
else
{
    app.MapGet("/", () => Results.Ok(new
    {
        name = "COOL MES API",
        status = "running"
    }));
}
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.UseRateLimiter();

app.MapControllers();

app.Run();

// Helper: Converts Render/Railway postgres:// or postgresql:// URI into Npgsql key-value connection string
static string NormalizePostgresConnectionString(string input)
{
    if (string.IsNullOrWhiteSpace(input))
        return input;

    var trimmed = input.Trim();
    if (!trimmed.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) &&
        !trimmed.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
    {
        return trimmed;
    }

    var uri = new Uri(trimmed);
    var userInfo = uri.UserInfo.Split(':', 2);
    var username = Uri.UnescapeDataString(userInfo[0]);
    var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : string.Empty;
    var database = uri.AbsolutePath.TrimStart('/');

    var builder = new NpgsqlConnectionStringBuilder
    {
        Host = uri.Host,
        Port = uri.Port > 0 ? uri.Port : 5432,
        Username = username,
        Password = password,
        Database = database,
        SslMode = SslMode.Prefer
    };

    return builder.ToString();
}
