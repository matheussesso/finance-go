/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A1A1A",
        secondary: "#2A2A2A",
        accent: "#4F46E5", // Indigo-600 premium
      }
    },
  },
  plugins: [],
}
