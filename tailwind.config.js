/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0061FF",
        "cloud-blue": "rgba(0, 97, 255, 0.1)",
        "ghost-white": "rgba(0, 97, 255, 0.04)",
        black: "#191D31",
        gray: "#8C8E98",
        "dark-gray": "#666876",
        white: "#FFFFFF",
      },
      fontFamily: {
        rubik: ["Rubik_400Regular"],
        "rubik-bold": ["Rubik_700Bold"],
        "rubik-medium": ["Rubik_500Medium"],
        "rubik-light": ["Rubik_300Light"],
      }
    },
  },
  plugins: [],
}
