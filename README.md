# COOL MES — E-commerce Web Application

A modern, responsive e-commerce web application specializing in tactical gears and everyday carry (EDC) accessories, powered by **ASP.NET Core Web API (.NET 8 LTS)**, **PostgreSQL**, and **React.js (Vite + Tailwind CSS)**.

Orders are placed directly through **Telegram (@eangsambath)** with pre-filled product details.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Axios
- **Backend**: ASP.NET Core Web API (.NET 8 LTS), Entity Framework Core
- **Database**: PostgreSQL
- **Ordering Channel**: Telegram Direct Integration (`https://t.me/eangsambath`)

---

## 🚀 Quick Start Guide

### 1. Start the Backend (.NET 8 Web API)

1. Open `backend/appsettings.json` and configure your PostgreSQL password:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Database=CoolMesDb;Username=postgres;Password=YOUR_POSTGRES_PASSWORD"
   }
   ```
2. Run the API from the `backend/` directory:
   ```powershell
   cd backend
   dotnet run
   ```
3. Backend runs on **`http://localhost:5000`** with Swagger documentation.
   - On startup, it automatically creates `CoolMesDb` and seeds 5 categories and 16 tactical products.

### 2. Start the Frontend (React.js)

1. Open a new terminal and navigate to `frontend/`:
   ```powershell
   cd frontend
   npm run dev
   ```
2. Open your browser at **`http://localhost:5173`**.

---

## 📱 Features

1. **Header & Navigation**:
   - Modern tactical brand logo (`COOL.MES`).
   - Real-time product search by keyword.
   - "CHAT TO ORDER" fast button leading directly to Telegram.
   - Dynamic category navigation bar with live product counts.
   - API status indicator (Live .NET 8 API vs. Demo fallback).

2. **Hero Carousel**:
   - 6 promotional tactical slides with high-res imagery.
   - Auto-play with pause-on-hover, navigation arrows, and pagination dots.
   - Action buttons ("Explore Gear", "Telegram @eangsambath").

3. **Product Catalog Grid**:
   - Responsive layout: 4 cards on desktop, 3 on tablet, 2 on mobile.
   - Live category filtering, stock availability toggle, and price/name sorting.
   - Stock status indicators ("In Stock", "Low Stock", "Out of Stock").
   - Instant "CHAT TO ORDER" button on every card.

4. **Product Details Modal**:
   - High-definition image preview.
   - Full description and specifications.
   - Interactive quantity selector (+ / -) with automatic total price calculation.
   - Optional special note/request field.
   - One-click Telegram order generation.

5. **Telegram Ordering System**:
   - Pre-formats a clean, structured order message:
     ```text
     🛒 NEW ORDER INQUIRY - COOL MES
     ━━━━━━━━━━━━━━━━━━━━━
     📦 Product: Titanium EDC Pocket Multi-Tool
     🏷️ Price: $38.00
     🔢 Quantity: 2 unit(s)
     💰 Subtotal: $76.00
     🆔 Product ID: #1
     📁 Category: Tactical & EDC
     ━━━━━━━━━━━━━━━━━━━━━
     👋 Hello Sambath! I'm interested in ordering this product from COOL MES...
     ```
   - Redirects customer straight to `https://t.me/eangsambath`.

6. **Footer Section**:
   - Store details & philosophy.
   - Contact info: Phone `097 4835 492`, Telegram `@eangsambath`.
   - Social channels: Telegram, TikTok, Instagram, Facebook.

