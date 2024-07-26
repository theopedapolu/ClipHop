/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
    fontFamily : {
      'lato':['Lato','sans-serif'],
      'openSans': ['Open Sans', 'sans-serif'],
      'poppins': ['Poppins'],
    }
  },

  plugins: [],
}

