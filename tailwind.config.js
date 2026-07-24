/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#e95420',
      },
      fontFamily: {
        sans: ['"Ubuntu Mono"', 'monospace'],
        mono: ['"Ubuntu Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
