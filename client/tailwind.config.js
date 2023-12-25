/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cursive: ["Sacramento", "cursive"],
      },
      fontSize: {
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["20px", "28px"],
        xl: ["24px", "32px"],
        big: ["26px", "34px"],
        bigger: ["28px", "36px"],
      },
      textColor: {
        primary: "#fcfcfc",
        dark: "#242424",
      },
      backgroundColor: {
        primary: "#fcfcfc",
        dark: "#242424",
      },
    },
  },
  plugins: [],
};
