/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  plugins: [require("daisyui"), require("tailwind-scrollbar")],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "bg-card": "url('/src/images/background.jpg')",
      },

      fontFamily: {
        inter: ["Inter", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        lexend: ["Lexend", "sans-serif"],
        nunito: ["Nunito Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },

      colors: {
        green: "#50C759",
        greenlight: "#4EC957 ",
      },

      screens: {
        laptop: { min: "1320px", max: "1536px" },
        pc: { min: "1850px" },
        pcSm: { min: "1500px", max: "1849px" },
        tablet: { min: "801px", max: "1200px" },
        ipad: { min: "451px", max: "800px" },
        mobile: { max: "450px" },
      },
    },
  },
});
