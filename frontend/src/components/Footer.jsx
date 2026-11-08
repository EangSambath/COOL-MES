import React from 'react';
import { Shield, Phone, Send, ExternalLink, Heart } from 'lucide-react';
import { STORE_PHONE, TELEGRAM_USERNAME, openGeneralTelegram } from '../utils/telegram';
import logoImg from '../assets/picture/logo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F5F5F7] border-t border-black/[0.06] text-[#6E6E73] mt-16">
      {/* Upper features highlights */}
      <div className="border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center text-[#1D1D1F] shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1D1D1F]">Military-Grade Build</h4>
              <p className="text-xs text-[#6E6E73]">Titanium, 1000D Cordura & alloy materials</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center text-[#1D1D1F] shadow-sm">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1D1D1F]">Telegram 1-on-1 Order</h4>
              <p className="text-xs text-[#6E6E73]">Direct order confirmation & prompt response</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center text-[#1D1D1F] shadow-sm">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1D1D1F]">Dedicated Support</h4>
              <p className="text-xs text-[#6E6E73]">Call 097 4835 492 anytime</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center text-[#1D1D1F] shadow-sm">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1D1D1F]">Fast Local Delivery</h4>
              <p className="text-xs text-[#6E6E73]">Safe packaging and doorstep shipment</p>
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
              <div className="w-10 h-10 rounded-full bg-white border border-black/[0.08] p-1 flex items-center justify-center overflow-hidden shadow-sm">
                <img src={logoImg} alt="COOL MES Logo" className="w-full h-full rounded-full object-contain" />
              </div>
              <span className="text-xl font-semibold text-[#1D1D1F] tracking-tight">
                COOL<span> MES</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed">
              COOL MES is your premier destination for high-performance EDC (Everyday Carry) gear, tactical backpacks, durable outdoor watches, and rugged tech accessories. Built for creators, adventurers, and everyday readiness.
            </p>
            <div className="text-xs text-[#6E6E73]">
              Store: COOL MES • Gear & Accessories
            </div>
          </div>

          {/* Section 2: Contact Us */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">
              Contact Us
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6E73]">
              Have questions about product availability or custom orders? Reach out directly:
            </p>
            <div className="space-y-2.5 text-xs sm:text-sm">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-black/[0.06] flex items-center justify-center text-[#1D1D1F] shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs text-[#6E6E73] block">Phone Call / SMS:</span>
                  <a 
                    href={`tel:${STORE_PHONE.replace(/\s+/g, '')}`} 
                    className="font-semibold text-[#1D1D1F] hover:text-[#000000] transition"
                  >
                    {STORE_PHONE}
                  </a>
                </div>
              </div>

              {/* Telegram */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-black/[0.06] flex items-center justify-center text-[#1D1D1F] shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs text-[#6E6E73] block">Direct Telegram:</span>
                  <a 
                    href={`https://t.me/${TELEGRAM_USERNAME}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-semibold text-[#1D1D1F] hover:text-[#000000] transition"
                  >
                    @{TELEGRAM_USERNAME}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Social Media */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F]">
              Follow Our Channels
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6E73]">
              Catch our latest product drops, EDC loadouts, and tactical accessory reviews:
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Telegram */}
              <a
                href={`https://t.me/${TELEGRAM_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-black/[0.06] hover:border-black/20 text-[#1D1D1F] transition group shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center group-hover:scale-105 transition">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-semibold block text-[#1D1D1F]">Telegram</span>
                  <span className="text-[10px] text-[#6E6E73]">@{TELEGRAM_USERNAME}</span>
                </div>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@eangsambath"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-black/[0.06] hover:border-black/20 text-[#1D1D1F] transition group shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center group-hover:scale-105 transition">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.34 6.34 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.28 8.28 0 0 0 4.88 1.58V6.82a4.84 4.84 0 0 1-1.1-.13z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <span className="text-xs font-semibold block text-[#1D1D1F]">TikTok</span>
                  <span className="text-[10px] text-[#6E6E73]">@eangsambath</span>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/eangsambath"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-black/[0.06] hover:border-black/20 text-[#1D1D1F] transition group shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center group-hover:scale-105 transition">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <span className="text-xs font-semibold block text-[#1D1D1F]">Instagram</span>
                  <span className="text-[10px] text-[#6E6E73]">@eangsambath</span>
                </div>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-black/[0.06] hover:border-black/20 text-[#1D1D1F] transition group shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center group-hover:scale-105 transition">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <span className="text-xs font-semibold block text-[#1D1D1F]">Facebook</span>
                  <span className="text-[10px] text-[#6E6E73]">COOL MES</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Notice */}
        <div className="mt-12 pt-6 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E6E73]">
          <p>© {currentYear} COOL MES. All rights reserved. Gear & Accessories Store.</p>
          <div className="flex items-center gap-1.5 text-[#6E6E73]">
            <span>Telegram-Powered Ordering</span>
            <span>•</span>
            <span className="text-[#1D1D1F] font-medium">@eangsambath</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
