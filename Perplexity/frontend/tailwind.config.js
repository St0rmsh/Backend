/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0a0e27',
        'secondary': '#10172a',
        'tertiary': '#1a2847',
        'accent': '#2563eb',
        'accent-light': '#3b82f6',
        'accent-dark': '#1e40af',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'slideIn': 'slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fadeIn': 'fadeIn 0.5s ease-out',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glow': '0 0 30px rgba(37, 99, 235, 0.4)',
        'glow-sm': '0 0 15px rgba(37, 99, 235, 0.2)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 16px 48px rgba(37, 99, 235, 0.2)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
