export const MOCK_CATEGORIES = [
  { categoryId: 1, categoryName: "Tactical & EDC", description: "Everyday carry essentials, multi-tools, tactical pens, and compact survival gear.", productCount: 4 },
  { categoryId: 2, categoryName: "Bags & Backpacks", description: "Heavy-duty tactical backpacks, sleek sling bags, and modular pouches.", productCount: 3 },
  { categoryId: 3, categoryName: "Watches & Bands", description: "Rugged outdoor watches, military-grade timepieces, and durable nylon straps.", productCount: 3 },
  { categoryId: 4, categoryName: "Tech Accessories", description: "Armored phone cases, magnetic mounts, rugged power banks, and organizer pouches.", productCount: 3 },
  { categoryId: 5, categoryName: "Outdoor & Survival", description: "Campcraft tools, water filtration, firestarters, and outdoor survival kits.", productCount: 3 },
];

export const MOCK_PRODUCTS = [
  // Tactical & EDC
  {
    productId: 1,
    productName: "Titanium EDC Pocket Multi-Tool",
    description: "Precision machined Grade 5 titanium multi-tool featuring 14 integrated tools including bottle opener, pry bar, hex wrenches, and screwdriver bits.",
    price: 38.00,
    imageUrl: "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 25,
    inStock: true,
    categoryId: 1,
    categoryName: "Tactical & EDC"
  },
  {
    productId: 2,
    productName: "Tactical Aerospace Aluminum Pen",
    description: "Hard anodized aircraft-grade aluminum tactical pen with tungsten carbide glass breaker tip and smooth Parker-compatible ink cartridge.",
    price: 22.50,
    imageUrl: "https://images.unsplash.com/photo-1585336261026-70e60fa225eb?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 40,
    inStock: true,
    categoryId: 1,
    categoryName: "Tactical & EDC"
  },
  {
    productId: 3,
    productName: "Compact LED Rechargeable EDC Flashlight",
    description: "Ultra-bright 1200 lumen pocket flashlight with magnetic base, Type-C quick charging, IPX8 waterproof rating, and 5 lighting modes.",
    price: 32.00,
    imageUrl: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 18,
    inStock: true,
    categoryId: 1,
    categoryName: "Tactical & EDC"
  },
  {
    productId: 4,
    productName: "Carbon Fiber Minimalist RFID Wallet",
    description: "Real 3K carbon fiber slim cardholder with integrated RFID blocking shield and matte black tactical money clip.",
    price: 28.00,
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 35,
    inStock: true,
    categoryId: 1,
    categoryName: "Tactical & EDC"
  },

  // Bags & Backpacks
  {
    productId: 5,
    productName: "MOLLE Tactical Assault Backpack 35L",
    description: "Water-resistant 1000D Cordura nylon modular backpack featuring laser-cut MOLLE webbing, padded laptop sleeve, and ergonomic airflow back panel.",
    price: 58.00,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 15,
    inStock: true,
    categoryId: 2,
    categoryName: "Bags & Backpacks"
  },
  {
    productId: 6,
    productName: "EDC Waterproof Crossbody Sling Pack",
    description: "Weatherproof sling bag with quick-release magnetic buckle, hidden security pocket, and organized compartments for iPad, wallet, and gear.",
    price: 39.00,
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 22,
    inStock: true,
    categoryId: 2,
    categoryName: "Bags & Backpacks"
  },
  {
    productId: 7,
    productName: "Modular Tech & Gear Organizer Pouch",
    description: "Heavy-duty zippered electronics organizer pouch designed for charging cables, power banks, SSDs, and EDC accessories.",
    price: 19.50,
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 50,
    inStock: true,
    categoryId: 2,
    categoryName: "Bags & Backpacks"
  },

  // Watches & Bands
  {
    productId: 8,
    productName: "Tactical Stealth Sport Chrono Watch",
    description: "50-meter waterproof military digital watch with shock-resistant matte casing, LED EL backlight, countdown timer, and dual time zones.",
    price: 45.00,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 12,
    inStock: true,
    categoryId: 3,
    categoryName: "Watches & Bands"
  },
  {
    productId: 9,
    productName: "Ballistic Nylon NATO Watch Band 22mm",
    description: "High-tensile premium woven ballistic nylon watch strap with PVD matte black stainless steel buckle and hardware.",
    price: 14.00,
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 60,
    inStock: true,
    categoryId: 3,
    categoryName: "Watches & Bands"
  },
  {
    productId: 10,
    productName: "Rugged Paracord Survival Watch Strap",
    description: "Handwoven 550 military-spec paracord survival band with quick-release buckle and integrated emergency whistle.",
    price: 16.50,
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 28,
    inStock: true,
    categoryId: 3,
    categoryName: "Watches & Bands"
  },

  // Tech Accessories
  {
    productId: 11,
    productName: "Armored MagSafe Rugged Phone Case",
    description: "Drop-tested military standard shockproof case with reinforced TPU corner bumpers and strong N52 neodymium magnetic ring.",
    price: 24.00,
    imageUrl: "https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 45,
    inStock: true,
    categoryId: 4,
    categoryName: "Tech Accessories"
  },
  {
    productId: 12,
    productName: "20,000mAh Solar Rugged Power Bank",
    description: "Shockproof and dustproof outdoor portable charger with dual USB-C PD 30W output, solar recharging panel, and emergency SOS strobe.",
    price: 42.00,
    imageUrl: "https://images.unsplash.com/photo-1609592426034-75053c82ef94?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 20,
    inStock: true,
    categoryId: 4,
    categoryName: "Tech Accessories"
  },
  {
    productId: 13,
    productName: "Magnetic Air Vent Heavy-Duty Car Mount",
    description: "CNC aluminum mechanical car mount with auto-clamping mechanism and 360-degree rotation ball head.",
    price: 18.00,
    imageUrl: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 30,
    inStock: true,
    categoryId: 4,
    categoryName: "Tech Accessories"
  },

  // Outdoor & Survival
  {
    productId: 14,
    productName: "Ultralight Pure Titanium Outdoor Flask",
    description: "Food-grade corrosion-resistant pure titanium hip flask (200ml) with funnel, odorless and lightweight for hiking.",
    price: 36.00,
    imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 14,
    inStock: true,
    categoryId: 5,
    categoryName: "Outdoor & Survival"
  },
  {
    productId: 15,
    productName: "Magnesium Ferro Rod Fire Starter Kit",
    description: "Heavy duty 1/2 inch thick ferrocerium fire starter producing 5,500°F sparks in all weather conditions, paired with a multi-purpose striker.",
    price: 12.00,
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 75,
    inStock: true,
    categoryId: 5,
    categoryName: "Outdoor & Survival"
  },
  {
    productId: 16,
    productName: "Vacuum Insulated Stainless Steel Thermal Flask 1L",
    description: "Double-wall vacuum insulation keeps drinks cold for 24h or hot for 12h. Leak-proof tactical paracord carry handle included.",
    price: 29.00,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
    stockQuantity: 32,
    inStock: true,
    categoryId: 5,
    categoryName: "Outdoor & Survival"
  }
];

export const HERO_SLIDES = [
  {
    id: 1,
    title: "TACTICAL & EDC ESSENTIALS",
    subtitle: "Engineered for durability, precision, and peak performance in every situation.",
    tag: "NEW ARRIVALS 2026",
    badge: "Grade 5 Titanium & Aerospace Aluminum",
    imageUrl: "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=1600&auto=format&fit=crop&q=85",
    ctaText: "Explore EDC Gear"
  },
  {
    id: 2,
    title: "HEAVY-DUTY TACTICAL BAGS",
    subtitle: "Cordura 1000D water-resistant modular packs built for rigorous adventures.",
    tag: "BEST SELLER",
    badge: "MOLLE System Compatible",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1600&auto=format&fit=crop&q=85",
    ctaText: "Shop Backpacks"
  },
  {
    id: 3,
    title: "MILITARY-GRADE TIMEPIECES",
    subtitle: "50-meter water resistance, shockproof composite frames, ballistic NATO bands.",
    tag: "FEATURED GEAR",
    badge: "Built for Extreme Elements",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&auto=format&fit=crop&q=85",
    ctaText: "View Watches"
  },
  {
    id: 4,
    title: "RUGGED TECH ACCESSORIES",
    subtitle: "Armored MagSafe cases, solar power banks, and heavy-duty magnetic mounts.",
    tag: "TOUGH PROTECTION",
    badge: "Drop-Tested Military Spec",
    imageUrl: "https://images.unsplash.com/photo-1609592426034-75053c82ef94?w=1600&auto=format&fit=crop&q=85",
    ctaText: "Explore Tech Gear"
  },
  {
    id: 5,
    title: "OUTDOOR SURVIVAL HARDWARE",
    subtitle: "Ferro rods, titanium flasks, and emergency gear ready whenever you head into the wild.",
    tag: "WILDERNESS READY",
    badge: "Ultra-Light & Weatherproof",
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&auto=format&fit=crop&q=85",
    ctaText: "Shop Survival Gear"
  },
  {
    id: 6,
    title: "ORDER DIRECTLY ON TELEGRAM",
    subtitle: "Chat 1-on-1 with @eangsambath for instant answers, fast delivery, and personal service.",
    tag: "FAST & DIRECT",
    badge: "No Complex Signups Needed",
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&auto=format&fit=crop&q=85",
    ctaText: "Chat with Us"
  }
];

