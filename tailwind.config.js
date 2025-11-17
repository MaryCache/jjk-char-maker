/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  theme: {
    extend: {
      fontFamily: {
        jp: ['"Noto Serif JP"', "serif"],
        sans: ['"Noto Serif JP"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
