/** @type {import('tailwindcss').Config} */

const appleSans = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"SF Pro Display"',
  '"SF Pro Text"',
  'Inter',
  'sans-serif',
];

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          white: '#FFFFFF',
          gray: '#F5F5F7',
          'gray-hover': '#EBEBED',
          black: '#1D1D1F',
          pure: '#000000',
          muted: '#6E6E73',
          subtle: '#86868B',
        },
        brand: {
          50: '#f5f5f7',
          100: '#e8e8ed',
          500: '#1d1d1f',
          600: '#000000',
        },
        telegram: {
          DEFAULT: '#0071E3',
          hover: '#0077ED',
        }
      },
      fontFamily: {
        sans: appleSans,
        mono: appleSans,
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        apple: '0 2px 8px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.04)',
        'apple-lg': '0 4px 12px rgba(0, 0, 0, 0.06), 0 20px 44px rgba(0, 0, 0, 0.08)',
        'apple-modal': '0 12px 32px rgba(0, 0, 0, 0.12), 0 32px 80px rgba(0, 0, 0, 0.16)',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.22, 1, 0.36, 1)',
        apple: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        DEFAULT: '320ms',
      },
      transitionProperty: {
        DEFAULT:
          'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, translate, scale, rotate, filter, backdrop-filter',
      },
    },
  },
  plugins: [],
}
