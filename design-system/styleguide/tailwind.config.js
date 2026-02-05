/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "../../apps/web/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Main primary
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        
        // Accent colors
        emerald: {
          400: '#34d399', // Success/CTA
          500: '#10b981',
          600: '#059669',
        },
        
        // Dark theme
        dark: {
          900: '#0f0f17', // Darkest
          800: '#1a1a2e',
          700: '#16213e',
          600: '#1e3a8a',
        },
        
        // Semantic colors
        danger: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        
        warning: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(139, 92, 246, 0.5)',
        'glow-lg': '0 0 30px rgba(139, 92, 246, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
