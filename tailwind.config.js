/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cinzel Decorative"', 'Cinzel', 'Georgia', 'serif'],
        body: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(220, 38, 38, 0.15)',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fog-drift-a': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.35' },
          '50%': { transform: 'translate(4%, -3%) scale(1.08)', opacity: '0.55' },
        },
        'fog-drift-b': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1.05)', opacity: '0.25' },
          '50%': { transform: 'translate(-5%, 4%) scale(1)', opacity: '0.45' },
        },
        'fog-drift-c': {
          '0%, 100%': { transform: 'translate(0, 0)', opacity: '0.2' },
          '50%': { transform: 'translate(3%, 5%)', opacity: '0.35' },
        },
        'blood-pulse': {
          '0%, 100%': { opacity: '0.25', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.06)' },
        },
        'rune-spin': {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
        'rune-spin-reverse': {
          '0%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        'fog-drift-a': 'fog-drift-a 28s ease-in-out infinite',
        'fog-drift-b': 'fog-drift-b 36s ease-in-out infinite',
        'fog-drift-c': 'fog-drift-c 44s ease-in-out infinite',
        'blood-pulse': 'blood-pulse 8s ease-in-out infinite',
        'rune-spin': 'rune-spin 120s linear infinite',
        'rune-spin-reverse': 'rune-spin-reverse 180s linear infinite',
      },
    },
  },
  plugins: [],
};
