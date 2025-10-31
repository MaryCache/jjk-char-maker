/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  theme: {
    extend: {
      fontFamily: {
        jp: ['"Noto Sans JP"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
