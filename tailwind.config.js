/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        kid: {
          coral: '#FF6B6B',
          yellow: '#FFD93D',
          mint: '#6BCB77',
          blue: '#4D96FF',
          purple: '#9B51E0',
          bg: '#F8F9FD'
        }
      },
      fontFamily: {
        arabic: ['"Traditional Arabic"', '"Amiri"', '"Scheherazade New"', 'system-ui', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        kid: ['"Fredoka"', '"Comic Sans MS"', '"Quicksand"', 'sans-serif']
      },
      animation: {
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pop': 'pop 0.3s ease-out'
      },
      keyframes: {
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-4%)' },
          '50%': { transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 12px rgba(34, 197, 94, 0.6))' },
          '50%': { opacity: 0.8, filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.2))' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
