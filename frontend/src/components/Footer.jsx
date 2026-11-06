import React from 'react';
import { Shield, Phone, Send, ExternalLink, Heart } from 'lucide-react';
import { STORE_PHONE, TELEGRAM_USERNAME, openGeneralTelegram } from '../utils/telegram';
import logoImg from '../assets/picture/logo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-850 text-slate-400 mt-16">
      {/* Upper features highlights */}
      <div className="border-b border-slate-850/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Military-Grade Build</h4>
              <p className="text-xs text-slate-400">Titanium, 1000D Cordura & alloy materials</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Telegram 1-on-1 Order</h4>
              <p className="text-xs text-slate-400">Direct order confirmation & prompt response</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dedicated Support</h4>
              <p className="text-xs text-slate-400">Call 097 4835 492 anytime</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fast Local Delivery</h4>
              <p className="text-xs text-slate-400">Safe packaging and doorstep shipment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Section 1: Store Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-750 p-1 flex items-center justify-center overflow-hidden">
                <img src={logoImg} alt="COOL MES Logo" className="w-full h-full rounded-full object-contain" />
              </div>
              <span className="text-xl font-black text-white font-mono tracking-wider">
                COOL<span className="text-emerald-400"> MES</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              COOL MES is your premier destination for high-performance EDC (Everyday Carry) gear, tactical backpacks, durable outdoor watches, and rugged tech accessories. Built for creators, adventurers, and everyday readiness.
            </p>
            <div className="text-xs text-slate-400 font-mono">
              Store: COOL MES • Gear & Accessories
            </div>
          </div>

          {/* Section 2: Contact Us */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-emerald-400 pl-2.5">
              Contact Us
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Have questions about product availability or custom orders? Reach out directly:
            </p>
            <div className="space-y-2.5 text-xs sm:text-sm">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Phone Call / SMS:</span>
                  <a 
                    href={`tel:${STORE_PHONE.replace(/\s+/g, '')}`} 
                    className="font-bold text-white hover:text-emerald-400 transition"
                  >
                    {STORE_PHONE}
                  </a>
                </div>
              </div>

              {/* Telegram */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Direct Telegram:</span>
                  <a 
                    href={`https://t.me/${TELEGRAM_USERNAME}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-bold text-sky-400 hover:text-sky-300 transition"
                  >
                    @{TELEGRAM_USERNAME}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Social Media */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-sky-400 pl-2.5">
              Follow Our Channels
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Catch our latest product drops, EDC loadouts, and tactical accessory reviews:
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Telegram */}
              <a
                href={`https://t.me/${TELEGRAM_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500 hover:bg-sky-500/10 text-slate-200 transition group"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block text-white">Telegram</span>
                  <span className="text-[10px] text-slate-400">@{TELEGRAM_USERNAME}</span>
                </div>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@eangsambath"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500 hover:bg-rose-500/10 text-slate-200 transition group"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.34 6.34 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.28 8.28 0 0 0 4.88 1.58V6.82a4.84 4.84 0 0 1-1.1-.13z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block text-white">TikTok</span>
                  <span className="text-[10px] text-slate-400">@eangsambath</span>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/eangsambath"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500 hover:bg-pink-500/10 text-slate-200 transition group"
              >
                <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block text-white">Instagram</span>
                  <span className="text-[10px] text-slate-400">@eangsambath</span>
                </div>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-blue-500/10 text-slate-200 transition group"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block text-white">Facebook</span>
                  <span className="text-[10px] text-slate-400">COOL MES</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Notice */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} COOL MES. All rights reserved. Gear & Accessories Store.</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Telegram-Powered Ordering</span>
            <span>•</span>
            <span className="text-sky-400">@eangsambath</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

