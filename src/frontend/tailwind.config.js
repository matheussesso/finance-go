/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Allows toggling theme via 'dark' class in HTML
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#FFFFFF",
          dark: "#0F0F13"
        },
        secondary: {
          light: "#F3F4F6", // gray-100
          dark: "#141416"
        },
        accent: {
          DEFAULT: "#4F46E5", // Indigo-600
          hover: "#6366F1",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
