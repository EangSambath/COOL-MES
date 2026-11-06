using CoolMes.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CoolMes.Api.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Ensure database tables exist
        await context.Database.EnsureCreatedAsync();

        // Check if categories already exist
        if (await context.Categories.AnyAsync())
        {
            return; // DB has already been seeded
        }

        var categories = new List<Category>
        {
            new Category
            {
                CategoryName = "Tactical & EDC",
                Description = "Everyday carry essentials, multi-tools, tactical pens, and compact survival gear."
            },
            new Category
            {
                CategoryName = "Bags & Backpacks",
                Description = "Heavy-duty tactical backpacks, sleek sling bags, and modular pouches."
            },
            new Category
            {
                CategoryName = "Watches & Bands",
                Description = "Rugged outdoor watches, military-grade timepieces, and durable nylon straps."
            },
            new Category
            {
                CategoryName = "Tech Accessories",
                Description = "Armored phone cases, magnetic mounts, rugged power banks, and organizer pouches."
            },
            new Category
            {
                CategoryName = "Outdoor & Survival",
                Description = "Campcraft tools, water filtration, firestarters, and outdoor survival kits."
            }
        };

        await context.Categories.AddRangeAsync(categories);
        await context.SaveChangesAsync();

        var edcCat = categories[0].CategoryId;
        var bagsCat = categories[1].CategoryId;
        var watchCat = categories[2].CategoryId;
        var techCat = categories[3].CategoryId;
        var outdoorCat = categories[4].CategoryId;

        var products = new List<Product>
        {
            // Tactical & EDC
            new Product
            {
                ProductName = "Titanium EDC Pocket Multi-Tool",
                Description = "Precision machined Grade 5 titanium multi-tool featuring 14 integrated tools including bottle opener, pry bar, hex wrenches, and screwdriver bits.",
                Price = 38.00m,
                ImageUrl = "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 25,
                CategoryId = edcCat
            },
            new Product
            {
                ProductName = "Tactical Aerospace Aluminum Pen",
                Description = "Hard anodized aircraft-grade aluminum tactical pen with tungsten carbide glass breaker tip and smooth Parker-compatible ink cartridge.",
                Price = 22.50m,
                ImageUrl = "https://images.unsplash.com/photo-1585336261026-70e60fa225eb?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 40,
                CategoryId = edcCat
            },
            new Product
            {
                ProductName = "Compact LED Rechargeable EDC Flashlight",
                Description = "Ultra-bright 1200 lumen pocket flashlight with magnetic base, Type-C quick charging, IPX8 waterproof rating, and 5 lighting modes.",
                Price = 32.00m,
                ImageUrl = "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 18,
                CategoryId = edcCat
            },
            new Product
            {
                ProductName = "Carbon Fiber Minimalist RFID Wallet",
                Description = "Real 3K carbon fiber slim cardholder with integrated RFID blocking shield and matte black tactical money clip.",
                Price = 28.00m,
                ImageUrl = "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 35,
                CategoryId = edcCat
            },

            // Bags & Backpacks
            new Product
            {
                ProductName = "MOLLE Tactical Assault Backpack 35L",
                Description = "Water-resistant 1000D Cordura nylon modular backpack featuring laser-cut MOLLE webbing, padded laptop sleeve, and ergonomic airflow back panel.",
                Price = 58.00m,
                ImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 15,
                CategoryId = bagsCat
            },
            new Product
            {
                ProductName = "EDC Waterproof Crossbody Sling Pack",
                Description = "Weatherproof sling bag with quick-release magnetic buckle, hidden security pocket, and organized compartments for iPad, wallet, and gear.",
                Price = 39.00m,
                ImageUrl = "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 22,
                CategoryId = bagsCat
            },
            new Product
            {
                ProductName = "Modular Tech & Gear Organizer Pouch",
                Description = "Heavy-duty zippered electronics organizer pouch designed for charging cables, power banks, SSDs, and EDC accessories.",
                Price = 19.50m,
                ImageUrl = "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 50,
                CategoryId = bagsCat
            },

            // Watches & Bands
            new Product
            {
                ProductName = "Tactical Stealth Sport Chrono Watch",
                Description = "50-meter waterproof military digital watch with shock-resistant matte casing, LED EL backlight, countdown timer, and dual time zones.",
                Price = 45.00m,
                ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 12,
                CategoryId = watchCat
            },
            new Product
            {
                ProductName = "Ballistic Nylon NATO Watch Band 22mm",
                Description = "High-tensile premium woven ballistic nylon watch strap with PVD matte black stainless steel buckle and hardware.",
                Price = 14.00m,
                ImageUrl = "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 60,
                CategoryId = watchCat
            },
            new Product
            {
                ProductName = "Rugged Paracord Survival Watch Strap",
                Description = "Handwoven 550 military-spec paracord survival band with quick-release buckle and integrated emergency whistle.",
                Price = 16.50m,
                ImageUrl = "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 28,
                CategoryId = watchCat
            },

            // Tech Accessories
            new Product
            {
                ProductName = "Armored MagSafe Rugged Phone Case",
                Description = "Drop-tested military standard shockproof case with reinforced TPU corner bumpers and strong N52 neodymium magnetic ring.",
                Price = 24.00m,
                ImageUrl = "https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 45,
                CategoryId = techCat
            },
            new Product
            {
                ProductName = "20,000mAh Solar Rugged Power Bank",
                Description = "Shockproof and dustproof outdoor portable charger with dual USB-C PD 30W output, solar recharging panel, and emergency SOS strobe.",
                Price = 42.00m,
                ImageUrl = "https://images.unsplash.com/photo-1609592426034-75053c82ef94?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 20,
                CategoryId = techCat
            },
            new Product
            {
                ProductName = "Magnetic Air Vent Heavy-Duty Car Mount",
                Description = "CNC aluminum mechanical car mount with auto-clamping mechanism and 360-degree rotation ball head.",
                Price = 18.00m,
                ImageUrl = "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 30,
                CategoryId = techCat
            },

            // Outdoor & Survival
            new Product
            {
                ProductName = "Ultralight Pure Titanium Outdoor Flask",
                Description = "Food-grade corrosion-resistant pure titanium hip flask (200ml) with funnel, odorless and lightweight for hiking.",
                Price = 36.00m,
                ImageUrl = "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 14,
                CategoryId = outdoorCat
            },
            new Product
            {
                ProductName = "Magnesium Ferro Rod Fire Starter Kit",
                Description = "Heavy duty 1/2 inch thick ferrocerium fire starter producing 5,500°F sparks in all weather conditions, paired with a multi-purpose striker.",
                Price = 12.00m,
                ImageUrl = "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 75,
                CategoryId = outdoorCat
            },
            new Product
            {
                ProductName = "Vacuum Insulated Stainless Steel Thermal Flask 1L",
                Description = "Double-wall vacuum insulation keeps drinks cold for 24h or hot for 12h. Leak-proof tactical paracord carry handle included.",
                Price = 29.00m,
                ImageUrl = "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
                StockQuantity = 32,
                CategoryId = outdoorCat
            }
        };

        await context.Products.AddRangeAsync(products);
        await context.SaveChangesAsync();
    }
}

