/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // "./views/**/*.html", "./views/*.html",
    "./public/js/*.js",
    "./views/**/*.ejs",
    "./views/*.ejs",
  ],
  darkMode: "class",
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
