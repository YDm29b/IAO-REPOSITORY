/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#040711',
          50: '#f0f3fa',
          100: '#dbe2f3',
          200: '#b8c5e6',
          300: '#8ca1d4',
          400: '#647ebf',
          500: '#4661a7',
          600: '#344b8b',
          700: '#2a3a71',
          800: '#1c264a',
          900: '#0b1124',
          950: '#050711',
        },
        gold: {
          100: '#fdf8ea',
          200: '#faecc8',
          300: '#f4dc9e',
          400: '#eac56a',
          500: '#d4af37', // Warm brass gold
          600: '#b89126',
          700: '#926f1a',
          800: '#755619',
          900: '#614619',
        },
        celestial: {
          cyan: '#7ecbf7',
          blue: '#2c5282',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}
