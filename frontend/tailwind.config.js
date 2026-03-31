/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#f6b8d3',
          blue: '#a9cbea',
          green: '#bfe6ae',
          yellow: '#ffe993',
          purple: '#c8b2f2',
          peach: '#ffc9a3',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.10)',
        glass: '0 8px 32px rgba(31, 41, 55, 0.18)',
        elevated: '0 16px 40px rgba(0,0,0,0.16)',
        glow: '0 0 0 3px rgba(200, 178, 242, 0.25)',
      },
      backdropBlur: {
        xs: '2px'
      },
    },
    container: {
      center: true,
      padding: '1rem',
    },
  },
  plugins: [],
};
