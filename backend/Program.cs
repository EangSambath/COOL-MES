using CoolMes.Api.Data;
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

// 1. Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "COOL MES - E-Commerce Web API (.NET 8 LTS)",
        Version = "v1",
        Description = "Backend API for COOL MES Gears & Accessories Store (Telegram: @eangsambath)"
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

// 3. Configure CORS (Allow React Frontend Vite / Dev & Vercel Deployed servers)
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
            {
                if (string.IsNullOrWhiteSpace(origin)) return false;
                var normalized = origin.TrimEnd('/');
                if (allowedOrigins.Contains(normalized, StringComparer.OrdinalIgnoreCase))
                    return true;
                // Also allow Vercel preview & production subdomains if FRONTEND_URL is not yet set
                if (Uri.TryCreate(normalized, UriKind.Absolute, out var uri) &&
                    uri.Host.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase))
                    return true;
                return false;
            })
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// 4. Auto-seed Database on startup
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

// 5. Configure the HTTP request pipeline (Swagger enabled in both Dev & Render so root URL works)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "COOL MES API v1");
    c.RoutePrefix = string.Empty; // Loads Swagger directly at root
});
app.MapGet("/swagger", () => Results.Redirect("/"));
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

app.UseCors("AllowFrontend");

app.UseAuthorization();

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
