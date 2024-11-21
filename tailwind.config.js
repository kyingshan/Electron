/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx,html,css}'],
  theme: {
    extend: {
      animation: {
        spin: 'spin 3s linear infinite', // Custom spin animation
      },
    },
  },
  plugins: [],
}


