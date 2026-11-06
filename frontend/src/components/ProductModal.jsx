import React, { useState } from 'react';
import { X, Send, Plus, Minus, ShieldCheck, ShieldAlert, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import { openTelegramOrder, STORE_PHONE, TELEGRAM_USERNAME } from '../utils/telegram';

export default function ProductModal({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');

  if (!product) return null;

  const isOutOfStock = product.stockQuantity <= 0;
  const maxAvailable = Math.max(1, product.stockQuantity || 1);

  const increment = () => {
    if (quantity < maxAvailable) setQuantity((q) => q + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const subtotal = (Number(product.price) * quantity).toFixed(2);

  const handleOrder = () => {
    openTelegramOrder(product, quantity, customNote);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-750 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Image Left/Top */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-slate-950 relative overflow-hidden flex-shrink-0">
          <img
            src={product.imageUrl}
            alt={product.productName}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=800&auto=format&fit=crop&q=80';
            }}
          />
          {product.categoryName && (
            <span className="absolute bottom-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-950/90 text-emerald-400 border border-slate-750">
              {product.categoryName}
            </span>
          )}
        </div>

        {/* Modal Info Right/Bottom */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-2">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                  <ShieldAlert className="w-3.5 h-3.5" /> Out of Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {product.stockQuantity} units available
                </span>
              )}
              {product.productId && (
                <span className="text-[11px] text-slate-400 font-mono">
                  ID: #{product.productId}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {product.productName}
            </h2>

            {/* Price */}
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">USD</span>
            </div>

            {/* Description */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Product Details
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-h-36 overflow-y-auto pr-1">
                {product.description || 'Premium gear built to tactical standards.'}
              </p>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Quantity:</span>
                <div className="flex items-center gap-3 bg-slate-950 border border-slate-750 px-2 py-1 rounded-xl">
                  <button
                    onClick={decrement}
                    disabled={quantity <= 1}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white flex items-center justify-center transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-bold text-white text-sm w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increment}
                    disabled={quantity >= maxAvailable}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white flex items-center justify-center transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Optional note input */}
            <div className="mt-3">
              <input
                type="text"
                placeholder="Add special note/request (optional)..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Bottom Total & Order Button */}
          <div className="pt-3 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Order Subtotal:</span>
              <span className="font-mono font-bold text-emerald-400 text-base">
                ${subtotal}
              </span>
            </div>

            <button
              onClick={handleOrder}
              disabled={isOutOfStock}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg active:scale-95 ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/25'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>CHAT TO ORDER ON TELEGRAM</span>
            </button>

            <div className="text-[11px] text-center text-slate-400">
              Clicking will open Telegram chat with <strong className="text-sky-400">@{TELEGRAM_USERNAME}</strong> with your order ready.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

