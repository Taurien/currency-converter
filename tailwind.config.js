/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // => @media (max-width: 639px) { ... }
      // 'sm': {'max': '639px'},
      'mobile': {'max': '769px'},
      // => @media (min-width: px) { ... }
      'desktop': '768px',
    },
    extend: {
      fontFamily: {
        'work_sans': ['Work Sans', 'sans-serif'],
      },
      backgroundImage: {
        'world-dots': "url('~/public/world-dots.svg')",
      },
    },
  },
  plugins: [],
}
