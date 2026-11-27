
/**
 * ============================================================
 * EMS KENYA — TAILWIND CSS CONFIGURATION
 * Professional White Theme | Emergency Red Branding
 * ============================================================
 */

/** @type {import('tailwindcss').Config} */
export default {
  // ==========================================================
  // CONTENT SCANNING
  // ==========================================================

  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],

  // ==========================================================
  // THEME CONFIGURATION
  // ==========================================================

  theme: {
    extend: {
      // ========================================================
      // COLOUR SYSTEM
      // ========================================================

      colors: {
        emergency: {
          DEFAULT: '#FF3B30',
          red: '#FF3B30',
          dark: '#CC0000',
          orange: '#FF6B35',
          light: '#FFF1F0',
          hover: '#E52E25'
        },

        ems: {
          // Backgrounds
          black: '#FFFFFF',
          dark: '#F8FAFC',
          card: '#FFFFFF',
          surface: '#F1F5F9',
          'surface-hover': '#E2E8F0',

          // Borders
          border: '#E5E7EB',
          'border-light': '#F1F5F9',
          'border-dark': '#CBD5E1',

          // Typography
          muted: '#64748B',
          light: '#64748B',
          white: '#1F2937',
          'text-primary': '#1F2937',
          'text-secondary': '#64748B',
          'text-light': '#94A3B8',

          // Status colours
          success: '#16A34A',
          'success-light': '#DCFCE7',

          warning: '#D97706',
          'warning-light': '#FEF3C7',

          info: '#2563EB',
          'info-light': '#DBEAFE',

          danger: '#DC2626',
          'danger-light': '#FEE2E2'
        }
      },

      // ========================================================
      // TYPOGRAPHY
      // ========================================================

      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        '3xs': ['0.5625rem', { lineHeight: '0.75rem' }]
      },

      // ========================================================
      // BORDER RADIUS
      // ========================================================

      borderRadius: {
        'ems-sm': '8px',
        'ems-md': '12px',
        'ems-lg': '16px',
        'ems-xl': '24px'
      },

      // ========================================================
      // BOX SHADOWS
      // ========================================================

      boxShadow: {
        'ems-sm': '0 1px 2px rgba(15, 23, 42, 0.05)',
        'ems-md': '0 4px 12px rgba(15, 23, 42, 0.08)',
        'ems-lg': '0 10px 30px rgba(15, 23, 42, 0.10)',
        'ems-xl': '0 20px 40px rgba(15, 23, 42, 0.12)',
        'emergency': '0 4px 14px rgba(255, 59, 48, 0.20)'
      },

      // ========================================================
      // ANIMATIONS
      // ========================================================

      animation: {
        'pulse-red': 'pulse-red 1.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.25s ease-out',
        'spin-slow': 'spin 3s linear infinite'
      },

      // ========================================================
      // KEYFRAMES
      // ========================================================

      keyframes: {
        'pulse-red': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(255, 59, 48, 0.4)'
          },
          '50%': {
            boxShadow: '0 0 0 20px rgba(255, 59, 48, 0)'
          }
        },

        'slide-up': {
          from: {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },

        'fade-in': {
          from: {
            opacity: '0'
          },
          to: {
            opacity: '1'
          }
        },

        'fade-in-up': {
          from: {
            opacity: '0',
            transform: 'translateY(24px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },

        'slide-down': {
          from: {
            opacity: '0',
            transform: 'translateY(-12px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },

        'scale-in': {
          from: {
            opacity: '0',
            transform: 'scale(0.95)'
          },
          to: {
            opacity: '1',
            transform: 'scale(1)'
          }
        }
      },

      // ========================================================
      // LAYOUT
      // ========================================================

      maxWidth: {
        'ems-container': '1440px'
      },

      minHeight: {
        'screen-safe': '100vh'
      },

      // ========================================================
      // TRANSITIONS
      // ========================================================

      transitionDuration: {
        '250': '250ms',
        '350': '350ms'
      }
    }
  },

  // ==========================================================
  // PLUGINS
  // ==========================================================

  plugins: []
};