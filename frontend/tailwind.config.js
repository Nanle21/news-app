/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './public/index.html'],
  theme: {
    extend: {},
  },
  darkMode: 'class', // Changed from 'media' to 'class' for manual control
  plugins: [],
};
