export const TELEGRAM_USERNAME = 'eangsambath';
export const STORE_PHONE = '097 4835 492';
export const STORE_NAME = 'COOL MES';

/**
 * Builds direct Telegram chat URL with pre-filled message
 */
export function buildTelegramUrl(message = '') {
  const base = `https://t.me/${TELEGRAM_USERNAME}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates structured product ordering message for Telegram
 */
export function buildOrderMessage(product, quantity = 1, customNote = '') {
  const total = (Number(product.price || 0) * quantity).toFixed(2);
  
  let msg = `🛒 *NEW ORDER INQUIRY - ${STORE_NAME}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📦 *Product:* ${product.productName}\n`;
  msg += `🏷️ *Price:* $${Number(product.price).toFixed(2)}\n`;
  msg += `🔢 *Quantity:* ${quantity} unit(s)\n`;
  msg += `💰 *Subtotal:* $${total}\n`;
  if (product.productId) {
    msg += `🆔 *Product ID:* #${product.productId}\n`;
  }
  if (product.categoryName) {
    msg += `📁 *Category:* ${product.categoryName}\n`;
  }
  if (customNote) {
    msg += `📝 *Note:* ${customNote}\n`;
  }
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `👋 Hello Sambath! I'm interested in ordering this product from COOL MES. Please confirm availability and payment/delivery details.`;

  return msg;
}

/**
 * Generates general contact message
 */
export function buildGeneralContactMessage() {
  return `👋 Hello COOL MES! I would like to inquire about your gears and accessories store.`;
}

/**
 * Opens Telegram URL in a new window/tab safely
 */
export function openTelegramOrder(product, quantity = 1, customNote = '') {
  const message = buildOrderMessage(product, quantity, customNote);
  const url = buildTelegramUrl(message);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function openGeneralTelegram() {
  const url = buildTelegramUrl(buildGeneralContactMessage());
  window.open(url, '_blank', 'noopener,noreferrer');
}

