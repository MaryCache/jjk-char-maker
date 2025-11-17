/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,ts,js,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jp: ['"Noto Serif JP"', "serif"],
        sans: ['"Noto Serif JP"', "system-ui", "sans-serif"],
      },
      colors: {
        ink: 'var(--ink)',
        panel: 'var(--panel)',
        line: 'var(--line)',
        gold: 'var(--gold)',
        'gold-2': 'var(--gold-2)'
      },
      boxShadow: {
        wafu: "0 1px 0 0 rgba(255,255,255,.03) inset, 0 0 0 1px rgba(0,0,0,.35) inset",
      },
      borderRadius: {
        'xl': '14px',
      }
    },
  },
  plugins: [],
};
