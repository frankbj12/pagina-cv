/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./script.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "ui-sans-serif", "sans-serif"]
      },
      colors: {
        ink: "#080b12",
        panel: "#101620",
        accent: "#8bffbf",
        muted: "#98a2b3"
      },
      boxShadow: {
        glow: "0 0 60px rgba(139,255,191,.12)"
      }
    }
  },
  plugins: []
};
