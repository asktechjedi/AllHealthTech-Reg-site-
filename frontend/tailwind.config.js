/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Eventor Primary Colors - Rich Blue
        eventor: {
          primary: '#2563EB',
          'primary-hover': '#1D4ED8',
          'primary-light': '#3B82F6',
          'primary-pale': '#DBEAFE',
          'primary-dark': '#1E40AF',
          // Bright System - Rich Backgrounds
          'dark-900': '#F8FAFC',
          'dark-800': '#FFFFFF',
          'dark-700': '#E2E8F0',
          'dark-600': '#CBD5E1',
          // Neutral System - Enhanced Contrast
          white: '#0F172A',
          'gray-100': '#1E293B',
          'gray-300': '#334155',
          'gray-500': '#64748B',
          'gray-700': '#CBD5E1',
          // Accent Colors - Vibrant
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
        // Legacy brand colors for backward compatibility
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        accent: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        electric: '#0066FF',   // Updated to Eventor primary
        ice: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
        },
        dark: {
          900: '#F0F4FF',  // Updated to Eventor bright
          800: '#FFFFFF',  // Updated to Eventor bright
          700: '#E8F0FF',  // Updated to Eventor bright
          600: '#D4E4FF',  // Updated to Eventor bright
          500: '#64748b',
        },
        success: {
          500: '#28A745',  // Updated to Eventor success
          600: '#1e7e34',
        },
        warning: {
          500: '#FFC107',  // Updated to Eventor warning
          600: '#e0a800',
        },
        error: {
          500: '#DC3545',  // Updated to Eventor error
          600: '#c82333',
        },
      },
      fontFamily: {
        // Eventor Typography System
        'outfit': ['Outfit', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'primary': ['Outfit', 'system-ui', 'sans-serif'],
        'secondary': ['Inter', 'system-ui', 'sans-serif'],
        // Legacy font for backward compatibility
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Eventor Type Scale
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'base': ['1rem', { lineHeight: '1.6rem' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
        '5xl': ['3rem', { lineHeight: '1.2' }],         // 48px
        '6xl': ['3.75rem', { lineHeight: '1.2' }],      // 60px
        '7xl': ['4.5rem', { lineHeight: '1.1' }],       // 72px
      },
      fontWeight: {
        // Eventor Font Weights
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      spacing: {
        // Eventor Spacing System (8px grid)
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
      },
      borderRadius: {
        // Eventor Border Radius
        'sm': '0.375rem',   // 6px
        'md': '0.5rem',     // 8px
        'lg': '0.75rem',    // 12px
        'xl': '1rem',       // 16px
        '2xl': '1.5rem',    // 24px
      },
      backgroundImage: {
        // Eventor Gradients - Rich Theme
        'eventor-hero': 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #F5F3FF 100%)',
        'eventor-primary': 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
        'eventor-dark': 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        'eventor-light': 'linear-gradient(135deg, #FFFFFF 0%, #EEF2FF 50%, #FFFFFF 100%)',
        'eventor-blue-light': 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
        'eventor-radial': 'radial-gradient(ellipse at top, #EEF2FF 0%, #E0E7FF 50%, #FFFFFF 100%)',
        'eventor-glow': 'radial-gradient(ellipse at center, rgba(37,99,235,0.15) 0%, transparent 70%)',
        // Legacy gradients for backward compatibility
        'hero-gradient': 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #F5F3FF 100%)',
        'brand-gradient': 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #2563EB 100%)',
        'accent-gradient': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        'glow-gradient': 'radial-gradient(ellipse at center, rgba(37,99,235,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        // Eventor Shadow System
        'eventor-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'eventor-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'eventor-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'eventor-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'eventor-blue': '0 4px 14px 0 rgba(0, 102, 255, 0.15)',
        'eventor-blue-lg': '0 10px 25px 0 rgba(0, 102, 255, 0.2)',
        // Legacy shadows for backward compatibility
        'brand': '0 4px 14px 0 rgba(0, 102, 255, 0.15)',
        'brand-lg': '0 10px 25px 0 rgba(0, 102, 255, 0.2)',
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
        'elegant': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'glow': '0 0 40px rgba(0, 102, 255, 0.15)',
        'soft': '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
      },
      animation: {
        // Eventor Animations
        'eventor-fade-up': 'eventor-fade-up 0.6s ease-out both',
        'eventor-fade-in': 'eventor-fade-in 0.6s ease-out both',
        'eventor-slide-up': 'eventor-slide-up 0.6s ease-out both',
        'eventor-slide-in': 'eventor-slide-in 0.4s ease-out both',
        'eventor-scale-in': 'eventor-scale-in 0.6s ease-out both',
        'eventor-pulse': 'eventor-pulse 2s ease-in-out infinite',
        'eventor-bounce': 'eventor-bounce 1s infinite',
        // Legacy animations for backward compatibility
        'fade-up': 'fadeUp 0.4s ease-out both',
        'fade-in': 'fadeIn 0.3s ease-out both',
        'slide-in': 'slideIn 0.3s ease-out both',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        // Eventor Keyframes
        'eventor-fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'eventor-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'eventor-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'eventor-slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'eventor-scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'eventor-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'eventor-bounce': {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
          '70%': { transform: 'translate3d(0, -4px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        },
        // Legacy keyframes for backward compatibility
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        'eventor': '20px',
      },
      transitionTimingFunction: {
        'eventor-fast': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'eventor-normal': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'eventor-slow': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'eventor-fast': '150ms',
        'eventor-normal': '300ms',
        'eventor-slow': '500ms',
      },
    },
  },
  plugins: [],
}
