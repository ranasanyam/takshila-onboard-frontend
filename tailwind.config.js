/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xxs: '350px',
        xs: '480px',
        sm: '640px',
        md: '768px',
        md1: '820px',
        lg: '1024px',
        xl: '1440px'
      }
    },
  },
  plugins: [],
}

