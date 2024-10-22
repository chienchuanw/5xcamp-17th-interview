/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "primary-gray": "#EDEDED",
      },
      fontSize: {
        "web-title": "14px",
        "web-note": "12px",
        "web-button": "10px",
      }
    },
  },
  plugins: [],
}

