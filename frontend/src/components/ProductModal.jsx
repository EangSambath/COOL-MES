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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/30 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl glass-sheet animate-sheetIn rounded-3xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-black/[0.08] text-[#1D1D1F] flex items-center justify-center border border-black/[0.06] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Image Left/Top */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-[#F5F5F7] relative overflow-hidden flex-shrink-0">
          <img
            src={product.imageUrl}
            alt={product.productName}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=800&auto=format&fit=crop&q=80';
            }}
          />
          {product.categoryName && (
            <span className="absolute bottom-3 left-3 text-[11px] font-semibold px-3 py-1 rounded-full bg-white/90 text-[#1D1D1F] border border-black/[0.06] backdrop-blur-md">
              {product.categoryName}
            </span>
          )}
        </div>

        {/* Modal Info Right/Bottom */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col justify-between space-y-4 bg-white">
          <div>
            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-2">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#F5F5F7] text-[#6E6E73] border border-black/[0.06]">
                  <ShieldAlert className="w-3.5 h-3.5" /> Out of Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.06]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {product.stockQuantity} units available
                </span>
              )}
              {product.productId && (
                <span className="text-[11px] text-[#6E6E73] tabular-nums">
                  ID: #{product.productId}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#1D1D1F] leading-[1.12]">
              {product.productName}
            </h2>

            {/* Price */}
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1D1F] tabular-nums">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className="text-xs text-[#6E6E73]">USD</span>
            </div>

            {/* Description */}
            <div className="mt-4 pt-3 border-t border-black/[0.06]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] mb-1">
                Product Details
              </h4>
              <p className="text-xs sm:text-sm text-[#6E6E73] leading-relaxed max-h-36 overflow-y-auto pr-1">
                {product.description || 'Premium gear built to tactical standards.'}
              </p>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="mt-4 pt-3 border-t border-black/[0.06] flex items-center justify-between">
                <span className="text-xs font-medium text-[#1D1D1F]">Quantity</span>
                <div className="flex items-center gap-3 bg-[#F5F5F7] border border-black/[0.06] px-2 py-1 rounded-full">
                  <button
                    onClick={decrement}
                    disabled={quantity <= 1}
                    className="w-7 h-7 rounded-full bg-white hover:bg-black/[0.06] disabled:opacity-30 text-[#1D1D1F] flex items-center justify-center border border-black/[0.06] transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="tabular-nums font-semibold text-[#1D1D1F] text-sm w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increment}
                    disabled={quantity >= maxAvailable}
                    className="w-7 h-7 rounded-full bg-white hover:bg-black/[0.06] disabled:opacity-30 text-[#1D1D1F] flex items-center justify-center border border-black/[0.06] transition"
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
                className="w-full text-xs bg-[#F5F5F7] border border-black/[0.06] rounded-xl px-3.5 py-2.5 text-[#1D1D1F] placeholder-[#6E6E73] focus:outline-none focus:bg-white focus:border-black/25 transition"
              />
            </div>
          </div>

          {/* Bottom Total & Order Button */}
          <div className="pt-3 border-t border-black/[0.06] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#6E6E73]">
              <span>Order Subtotal</span>
              <span className="tabular-nums font-semibold text-[#1D1D1F] text-base">
                ${subtotal}
              </span>
            </div>

            <button
              onClick={handleOrder}
              disabled={isOutOfStock}
              className={`w-full py-3 px-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition shadow-apple ${
                isOutOfStock
                  ? 'bg-[#F5F5F7] text-[#6E6E73] cursor-not-allowed border border-black/[0.06]'
                  : 'bg-[#1D1D1F] hover:bg-[#000000] text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Order on Telegram</span>
            </button>

            <div className="text-[11px] text-center text-[#6E6E73]">
              Opens Telegram chat with <strong className="text-[#1D1D1F]">@{TELEGRAM_USERNAME}</strong> with your order ready.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
