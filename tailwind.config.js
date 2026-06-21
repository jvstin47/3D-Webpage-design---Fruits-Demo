/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orchard: {
          lightest: '#f0f7f0',
          light: '#e8f3e8',
          default: '#7ebc89',
          dark: '#2c5530',
          wood: '#8b5a2b',
          stone: '#b0a899',
          text: '#2d3748',
          accent: '#d4772c',
          warmWhite: '#fefcf8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 25px rgba(0, 0, 0, 0.08)',
        'glow-green': '0 0 20px rgba(126, 188, 137, 0.3)',
        'glow-accent': '0 0 20px rgba(212, 119, 44, 0.3)',
      }
    },
  },
  plugins: [],
}
