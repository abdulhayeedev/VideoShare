import { color } from "chart.js/helpers";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customGray: "#F8F8F9",
        lightGray: "#E1E1E1",
        primary: "#A280FF",
        customBlack: '#00000070'
      },
      spacing: {
        4.5: "18px",
        6.5: "26px",
        7.5: "30px",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        "fa-brands": ["Font Awesome 5 Brands", "sans-serif"],
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
    function ({ matchUtilities }) {
      matchUtilities(
        {
          "text-custom": (value) => ({
            color: value,
          }),
        },
        { value: {} }
      );
    },
  ],
};
