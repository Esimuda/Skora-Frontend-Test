/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Skora Brand Colors - Deep Teal & Warm Amber theme
        primary: {
          50: '#e6f7f7',
          100: '#b3e9e8',
          200: '#80dad9',
          300: '#4dccca',
          400: '#1abebb',
          500: '#0f9d99', // Main teal
          600: '#0c7d7a',
          700: '#095e5b',
          800: '#063e3c',
          900: '#031f1e',
        },
        secondary: {
          50: '#fff8e6',
          100: '#ffedb3',
          200: '#ffe180',
          300: '#ffd64d',
          400: '#ffcb1a',
          500: '#f0b000', // Warm amber
          600: '#c08d00',
          700: '#906a00',
          800: '#604700',
          900: '#302300',
        },
        accent: {
          50: '#fef2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f98080',
          500: '#ef4444', // Alert red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        // Distinctive font pairings - avoiding generic choices
        display: ['Outfit', 'system-ui', 'sans-serif'], // Modern geometric for headings
        body: ['DM Sans', 'system-ui', 'sans-serif'], // Clean readable for content
        mono: ['JetBrains Mono', 'monospace'], // For numbers/codes
      },
      boxShadow: {
        'skora-sm': '0 2px 8px rgba(15, 157, 153, 0.08)',
        'skora': '0 4px 16px rgba(15, 157, 153, 0.12)',
        'skora-lg': '0 8px 32px rgba(15, 157, 153, 0.16)',
        'skora-xl': '0 16px 48px rgba(15, 157, 153, 0.2)',
        'warm': '0 4px 16px rgba(240, 176, 0, 0.12)',
      },
      animation: {
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
