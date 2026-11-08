import React, { useState } from 'react';
import { Search, Send, Shield, Phone, Menu, X, Sparkles } from 'lucide-react';
import { TELEGRAM_USERNAME, STORE_PHONE, openGeneralTelegram } from '../utils/telegram';
import logoImg from '../assets/picture/logo.png';

export default function Header({ 
  searchTerm, 
  onSearchChange, 
  categories = [], 
  selectedCategory, 
  onSelectCategory,
  isLiveApi
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass-chrome">
      {/* Top micro bar for quick contact info */}
      <div className="bg-[#F5F5F7] px-4 py-1.5 text-xs border-b border-black/[0.06] text-[#6E6E73]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#1D1D1F] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D1D1F]"></span>
              គុណភាព ទំនុកចិត្ត សេវាកម្ម
            </span>
            <span className="hidden sm:inline-block text-black/15">|</span>
            <a 
              href={`tel:${STORE_PHONE.replace(/\s+/g, '')}`} 
              className="hidden sm:flex items-center gap-1 hover:text-[#000000] transition"
            >
              <Phone className="w-3 h-3 text-[#1D1D1F]" />
              <span>Call: {STORE_PHONE}</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openGeneralTelegram}
              className="hover:text-[#000000] flex items-center gap-1 transition text-[#1D1D1F] font-medium"
            >
              <Send className="w-3 h-3 text-[#1D1D1F]" />
              <span>@{TELEGRAM_USERNAME}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main header navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onSelectCategory(null)}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#F5F5F7] border border-black/[0.08] p-1 transition flex items-center justify-center overflow-hidden">
              <img 
                src={logoImg} 
                alt="COOL MES Logo" 
                className="w-full h-full rounded-full object-contain group-hover:scale-105 transition duration-300" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                  COOL<span> MES</span>
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.08]">
                  GEARS
                </span>
              </div>
              <p className="text-[11px] text-[#6E6E73] font-normal tracking-normal">
                Tactical & EDC Accessories
              </p>
            </div>
          </div>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-xl mx-2 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search titanium tools, bags, watches, phone cases..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-14 py-2.5 bg-[#F5F5F7] border border-black/[0.06] rounded-full text-sm text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:bg-white focus:border-black/25 focus:ring-4 focus:ring-black/[0.04] transition"
              />
              <Search className="w-4 h-4 text-[#6E6E73] absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-black/[0.06] text-[#1D1D1F] hover:bg-black/[0.12] px-2 py-0.5 rounded-full transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* CHAT TO ORDER Primary CTA Button */}
            <button
              onClick={openGeneralTelegram}
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#1D1D1F] hover:bg-[#000000] text-white font-medium text-xs sm:text-sm shadow-apple transition group"
            >
              <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition duration-300" />
              <span className="tracking-tight">Chat to Order</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-full transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search gear and accessories..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F5F5F7] border border-black/[0.06] rounded-full text-sm text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:bg-white focus:border-black/25"
            />
            <Search className="w-4 h-4 text-[#6E6E73] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="border-t border-black/[0.06] overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap">
          <span className="text-[#6E6E73] text-xs font-medium tracking-tight hidden lg:flex items-center gap-1 pr-2">
            Categories
          </span>

          {/* All Products pill */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-4 py-1.5 rounded-full font-medium transition ${
              selectedCategory === null
                ? 'bg-[#1D1D1F] text-white'
                : 'text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]'
            }`}
          >
            All Products
          </button>

          {/* Dynamic categories */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.categoryId;
            return (
              <button
                key={cat.categoryId}
                onClick={() => onSelectCategory(cat.categoryId)}
                className={`px-4 py-1.5 rounded-full font-medium transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1D1D1F] text-white'
                    : 'text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]'
                }`}
              >
                <span>{cat.categoryName}</span>
                {cat.productCount > 0 && (
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-black/[0.06] text-[#6E6E73]'
                  }`}>
                    {cat.productCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/[0.06] bg-white px-4 py-4 space-y-3 animate-fadeIn">
          <div className="p-3.5 bg-[#F5F5F7] rounded-2xl border border-black/[0.06]">
            <p className="text-xs text-[#6E6E73] mb-1">Direct Contact</p>
            <p className="text-sm font-semibold text-[#1D1D1F]">Phone: {STORE_PHONE}</p>
            <p className="text-sm font-medium text-[#1D1D1F]">Telegram: @{TELEGRAM_USERNAME}</p>
          </div>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openGeneralTelegram();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#1D1D1F] text-white font-medium text-sm"
          >
            <Send className="w-4 h-4" />
            <span>Chat on Telegram</span>
          </button>
        </div>
      )}
    </header>
  );
}
