/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        magenta: "#e3007f",
        blue: "#00a0e8", 
        yellow: "#ffef00",
        dark: "#1e1e1e",
        light: "#f9f9f9",
      },
    },
  },
  plugins: [],
}