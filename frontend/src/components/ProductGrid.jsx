import React from 'react';
import ProductCard from './ProductCard';
import { SlidersHorizontal, PackageX, RotateCcw, ShieldCheck } from 'lucide-react';

export default function ProductGrid({
  products = [],
  loading = false,
  onViewDetails,
  inStockOnly,
  onToggleInStock,
  sortBy,
  onSortChange,
  activeCategoryName,
  totalCount,
  onResetFilters,
  hasActiveFilters
}) {
  return (
    <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Section Header & Filter Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-[0.12em]">
              GEAR CATALOG
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.025em] text-white mt-1">
            {activeCategoryName ? `${activeCategoryName}` : 'All Gears & Accessories'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse high-grade tactical and everyday carry essentials. Click "CHAT TO ORDER" to place your order via Telegram.
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* In Stock Only Toggle */}
          <button
            onClick={() => onToggleInStock(!inStockOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
              inStockOnly
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>In Stock Only</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="newest">Sort: Newest Arrival</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters button if any filter applied */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 flex items-center gap-1 transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Result Count Status */}
      <div className="py-3 flex items-center justify-between text-xs text-slate-400">
        <span>Showing <strong className="text-emerald-400">{products.length}</strong> {products.length === 1 ? 'item' : 'items'}</span>
        <span className="text-slate-400 hidden sm:inline">Direct Telegram Order Available</span>
      </div>

      {/* Loading Skeleton State */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 pt-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-slate-900/60 rounded-2xl border border-slate-800 p-3 sm:p-4 animate-pulse space-y-3">
              <div className="aspect-square bg-slate-800 rounded-xl"></div>
              <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              <div className="h-3 bg-slate-800 rounded w-1/2"></div>
              <div className="h-8 bg-slate-800 rounded mt-4"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80 my-6 max-w-xl mx-auto px-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500 mb-4">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No products found</h3>
          <p className="text-sm text-slate-400 mb-6">
            We couldn't find any gear matching your current search or filter criteria.
          </p>
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition"
          >
            Clear Filters & View All
          </button>
        </div>
      ) : (
        /* Product Cards Grid: 4 cards desktop / 3 tablet / 2 mobile */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 pt-2">
          {products.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </section>
  );
}

