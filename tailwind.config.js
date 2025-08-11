/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#330F65',
        brand: {
          DEFAULT: '#2563eb',   // blu primario
          60: '#3b82f6',        // hover
          20: '#bfdbfe',        // tint
        },
      },
    },
  },
  plugins: [],
}
