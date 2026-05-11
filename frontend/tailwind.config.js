/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff0ff',
          100: '#dde0ff',
          200: '#c0c5ff',
          300: '#9aa0ff',
          400: '#706fff',
          500: '#4f3fff',
          600: '#2200ff',  // core electric blue (logo)
          700: '#1a00cc',
          800: '#1200a3',
          900: '#0d007a',
          950: '#070047',
        },
        electric: '#2200ff',   // exact logo blue
        ice: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7ff',
          300: '#a5bcff',
        },
        dark: {
          900: '#0a0a14',
          800: '#10101e',
          700: '#16162a',
          600: '#1e1e38',
          500: '#2a2a4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient':  'linear-gradient(135deg, #0a0a14 0%, #10101e 40%, #16162a 70%, #1e1e38 100%)',
        'brand-gradient': 'linear-gradient(135deg, #2200ff 0%, #4f3fff 50%, #706fff 100%)',
        'glow-gradient':  'radial-gradient(ellipse at center, rgba(34,0,255,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'brand':   '0 4px 24px rgba(34,0,255,0.35)',
        'brand-lg':'0 8px 40px rgba(34,0,255,0.25)',
        'card':    '0 2px 16px rgba(10,10,20,0.08)',
        'elegant': '0 8px 40px rgba(10,10,20,0.12)',
        'glow':    '0 0 40px rgba(34,0,255,0.2)',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease-out both',
        'fade-in': 'fadeIn 0.3s ease-out both',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
