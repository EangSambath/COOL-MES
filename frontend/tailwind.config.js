/** @type {import('tailwindcss').Config} */

// Apple system font stack (SF Pro on Apple devices, Inter/Segoe elsewhere)
const appleSans = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"SF Pro Display"',
  '"SF Pro Text"',
  'Inter',
  '"Segoe UI"',
  'system-ui',
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
        // Apple dark-mode system grays (replaces the default slate scale app-wide)
        slate: {
          50: '#f5f5f7',
          100: '#f5f5f7',
          200: '#d2d2d7',
          300: '#c7c7cc',
          400: '#a1a1a6',
          500: '#8e8e93',
          600: '#636366',
          700: '#48484a',
          750: '#3a3a3c',
          800: '#2c2c2e',
          850: '#242426',
          900: '#1c1c1e',
          950: '#000000',
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
        tactical: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        telegram: {
          DEFAULT: '#229ED9',
          hover: '#1e8bc2',
        }
      },
      fontFamily: {
        sans: appleSans,
        // Apple doesn't use monospace for UI chrome; numerals are tabular via CSS instead
        mono: appleSans,
      },
      // Continuous, softer corners (16px–24px range for cards and sheets)
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      // Soft, layered ambient shadows
      boxShadow: {
        md: '0 1px 2px rgba(0,0,0,0.30), 0 4px 12px rgba(0,0,0,0.25)',
        xl: '0 2px 4px rgba(0,0,0,0.20), 0 12px 32px rgba(0,0,0,0.35)',
        '2xl': '0 2px 6px rgba(0,0,0,0.25), 0 28px 80px rgba(0,0,0,0.55)',
        apple: '0 1px 2px rgba(0,0,0,0.35), 0 6px 20px rgba(0,0,0,0.28)',
        'apple-lg': '0 2px 4px rgba(0,0,0,0.25), 0 20px 50px rgba(0,0,0,0.50)',
      },
      // Default easing for every `transition` utility: a critically damped,
      // no-overshoot curve (Apple's sheet/drawer curve) instead of CSS `ease`.
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.32, 0.72, 0, 1)',
        apple: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      // Include individual transform properties so press-scale animates too
      transitionProperty: {
        DEFAULT:
          'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, translate, scale, rotate, filter, backdrop-filter',
      },
    },
  },
  plugins: [],
}
