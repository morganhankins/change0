/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FEF3C7',
        amber: { DEFAULT: '#F59E0B', dark: '#D97706' },
        terracotta: '#DC6B4A',
        wood: '#92400E',
        emerald: '#10B981',
        'near-black': '#1C1917',
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
