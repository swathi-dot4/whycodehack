/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            50: '#ecfdf5',
            100: '#d1fae5',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
          },
          sky: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
          },
          smoke: '#f8fafc',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
