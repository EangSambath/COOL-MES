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
      className="group relative bg-slate-900 rounded-3xl border border-white/10 hover:border-white/20 shadow-apple hover:shadow-apple-lg hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 active:duration-100 transition-[transform,box-shadow,border-color] duration-500 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
        <img
          src={product.imageUrl}
          alt={product.productName}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            // Fallback image if broken
            e.target.src = 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          {/* Category Tag */}
          {product.categoryName && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-950/80 text-emerald-400 border border-slate-750 backdrop-blur-sm">
              {product.categoryName}
            </span>
          )}

          {/* Stock Status Badge */}
          {isOutOfStock ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-950/90 text-rose-400 border border-rose-800 backdrop-blur-sm flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-950/90 text-amber-400 border border-amber-800 backdrop-blur-sm flex items-center gap-1">
              Low: {product.stockQuantity} left
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/90 text-emerald-400 border border-emerald-800 backdrop-blur-sm flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> In Stock
            </span>
          )}
        </div>

        {/* Hover Quick View Overlay for Desktop */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold backdrop-blur shadow-lg border border-slate-700">
            <Eye className="w-3.5 h-3.5 text-emerald-400" /> View Details
          </span>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Product Name */}
          <h3 className="font-semibold tracking-tight text-slate-100 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors">
            {product.productName}
          </h3>

          {/* Short Description */}
          <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description || 'Premium tactical gear and EDC everyday carry accessory.'}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Price</span>
            <div className="text-base sm:text-lg font-semibold text-slate-100 tracking-tight tabular-nums">
              ${Number(product.price).toFixed(2)}
            </div>
          </div>

          {/* CHAT TO ORDER Action */}
          <button
            onClick={handleOrderClick}
            disabled={isOutOfStock}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/20 hover:shadow-sky-500/30'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>CHAT TO ORDER</span>
          </button>
        </div>
      </div>
    </div>
  );
}

