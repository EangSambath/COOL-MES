import React from 'react';
import { Send, Eye, ShieldAlert, CheckCircle2, PackageCheck } from 'lucide-react';
import { openTelegramOrder } from '../utils/telegram';

export default function ProductCard({ product, onViewDetails }) {
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  const handleOrderClick = (e) => {
    e.stopPropagation();
    openTelegramOrder(product, 1);
  };

  return (
    <div 
      onClick={() => onViewDetails(product)}
      className="group relative apple-card flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        <img
          src={product.imageUrl}
          alt={product.productName}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-apple"
          onError={(e) => {
            // Fallback image if broken
            e.target.src = 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1 pointer-events-none">
          {/* Category Tag */}
          {product.categoryName && (
            <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-[#1D1D1F] border border-black/[0.06] backdrop-blur-md">
              {product.categoryName}
            </span>
          )}

          {/* Stock Status Badge */}
          {isOutOfStock ? (
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/90 text-[#6E6E73] border border-black/[0.08] backdrop-blur-md flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/90 text-[#1D1D1F] border border-black/[0.08] backdrop-blur-md flex items-center gap-1">
              {product.stockQuantity} left
            </span>
          ) : (
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/90 text-[#1D1D1F] border border-black/[0.06] backdrop-blur-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]"></span> In Stock
            </span>
          )}
        </div>

        {/* Hover Quick View Overlay for Desktop */}
        <div className="absolute inset-0 bg-black/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-[#1D1D1F] text-xs font-medium backdrop-blur-md shadow-apple border border-black/[0.08]">
            <Eye className="w-3.5 h-3.5 text-[#1D1D1F]" /> Quick View
          </span>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Product Name */}
          <h3 className="font-semibold tracking-tight text-[#1D1D1F] text-sm sm:text-base leading-snug line-clamp-2">
            {product.productName}
          </h3>

          {/* Short Description */}
          <p className="mt-1.5 text-xs text-[#6E6E73] line-clamp-2 leading-relaxed">
            {product.description || 'Premium tactical gear and EDC everyday carry accessory.'}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <span className="text-[10px] text-[#6E6E73] uppercase tracking-wider block font-medium">Price</span>
            <div className="text-base sm:text-lg font-semibold text-[#1D1D1F] tracking-tight tabular-nums">
              ${Number(product.price).toFixed(2)}
            </div>
          </div>

          {/* CHAT TO ORDER Action */}
          <button
            onClick={handleOrderClick}
            disabled={isOutOfStock}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition ${
              isOutOfStock
                ? 'bg-black/[0.06] text-[#6E6E73] cursor-not-allowed'
                : 'bg-[#1D1D1F] hover:bg-[#000000] text-white'
            }`}
          >
            <Send className="w-3 h-3" />
            <span>Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
