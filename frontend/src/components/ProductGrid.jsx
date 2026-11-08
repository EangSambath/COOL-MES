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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-black/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#6E6E73] uppercase tracking-[0.12em]">
              GEAR CATALOG
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.025em] text-[#1D1D1F] mt-1">
            {activeCategoryName ? `${activeCategoryName}` : 'All Gears & Accessories'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
            Browse high-grade tactical and everyday carry essentials. Select any item to order directly via Telegram.
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* In Stock Only Toggle */}
          <button
            onClick={() => onToggleInStock(!inStockOnly)}
            className={`px-3.5 py-2 rounded-full text-xs font-medium border flex items-center gap-1.5 transition ${
              inStockOnly
                ? 'bg-[#1D1D1F] border-[#1D1D1F] text-white'
                : 'bg-[#F5F5F7] border-black/[0.06] text-[#1D1D1F] hover:bg-black/[0.06]'
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
              className="appearance-none bg-[#F5F5F7] border border-black/[0.06] rounded-full px-4 py-2 pr-8 text-xs font-medium text-[#1D1D1F] focus:outline-none focus:border-black/25 cursor-pointer"
            >
              <option value="newest">Sort: Newest Arrival</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#6E6E73] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters button if any filter applied */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-3 py-2 rounded-full text-xs font-medium text-[#6E6E73] hover:text-[#1D1D1F] bg-[#F5F5F7] hover:bg-black/[0.08] flex items-center gap-1 transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Result Count Status */}
      <div className="py-3 flex items-center justify-between text-xs text-[#6E6E73]">
        <span>Showing <strong className="text-[#1D1D1F] font-semibold">{products.length}</strong> {products.length === 1 ? 'item' : 'items'}</span>
        <span className="text-[#6E6E73] hidden sm:inline">Direct Telegram Order Available</span>
      </div>

      {/* Loading Skeleton State */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[#F5F5F7] rounded-3xl border border-black/[0.06] p-4 animate-pulse space-y-3">
              <div className="aspect-square bg-black/[0.05] rounded-2xl"></div>
              <div className="h-4 bg-black/[0.06] rounded-full w-3/4"></div>
              <div className="h-3 bg-black/[0.05] rounded-full w-1/2"></div>
              <div className="h-8 bg-black/[0.06] rounded-full mt-4"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center bg-[#F5F5F7] rounded-3xl border border-black/[0.06] my-6 max-w-xl mx-auto px-6">
          <div className="w-14 h-14 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center mx-auto text-[#6E6E73] mb-4">
            <PackageX className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">No products found</h3>
          <p className="text-sm text-[#6E6E73] mb-6">
            We couldn't find any gear matching your current search or filter criteria.
          </p>
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded-full bg-[#1D1D1F] text-white font-medium text-xs hover:bg-[#000000] transition"
          >
            Clear Filters & View All
          </button>
        </div>
      ) : (
        /* Product Cards Grid: 4 cards desktop / 3 tablet / 2 mobile */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
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
