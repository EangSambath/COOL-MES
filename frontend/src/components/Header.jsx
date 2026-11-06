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
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top micro bar for quick contact info */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-850 text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              គុណភាព ទំនុកចិត្ត សេវាកម្ម
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <a 
              href={`tel:${STORE_PHONE.replace(/\s+/g, '')}`} 
              className="hidden sm:flex items-center gap-1 hover:text-slate-200 transition"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Call: {STORE_PHONE}</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* <span className="text-slate-500 hidden md:inline">
              Backend Status:
            </span> */}
            {/* <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
              isLiveApi ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLiveApi ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              {isLiveApi ? 'Live API (.NET 8)' : 'Demo Mode'}
            </span> */}
            <button
              onClick={openGeneralTelegram}
              className="hover:text-sky-400 flex items-center gap-1 transition text-slate-300"
            >
              <Send className="w-3 h-3 text-sky-400" />
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
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 border border-slate-750 p-1 shadow-lg shadow-emerald-500/10 group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/30 transition flex items-center justify-center overflow-hidden">
              <img 
                src={logoImg} 
                alt="COOL MES Logo" 
                className="w-full h-full rounded-full object-contain group-hover:scale-105 transition duration-300" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-white font-mono">
                  COOL<span className="text-emerald-400"> MES</span>
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  GEARS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
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
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-750 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-800 text-slate-400 hover:text-white px-1.5 py-0.5 rounded"
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
              className="flex items-center gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition active:scale-95 group"
            >
              <Send className="w-4 h-4 fill-white/20 group-hover:rotate-12 transition duration-300" />
              <span className="tracking-wide">CHAT TO ORDER</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
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
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="border-t border-slate-800/80 bg-slate-900/60 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider hidden lg:flex items-center gap-1 pr-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Categories:
          </span>

          {/* All Products pill */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              selectedCategory === null
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{cat.categoryName}</span>
                {cat.productCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
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
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-3">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 mb-1">Direct Contact:</p>
            <p className="text-sm font-semibold text-white">Phone: {STORE_PHONE}</p>
            <p className="text-sm font-semibold text-sky-400">Telegram: @{TELEGRAM_USERNAME}</p>
          </div>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openGeneralTelegram();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500 text-white font-semibold text-sm"
          >
            <Send className="w-4 h-4" />
            <span>Chat on Telegram</span>
          </button>
        </div>
      )}
    </header>
  );
}

