const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    fontFamily: {
      sans: ["Source Sans Pro", ...defaultTheme.fontFamily.sans],
      serif: ["Source Serif Pro", ...defaultTheme.fontFamily.sans],
      display: ["Raleway", ...defaultTheme.fontFamily.sans]
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#fff",
      black: "#000",
      textBlack: "#1e1f26",
      partner: "#ffcc00",
      primary: {
        50: "#fff4eb",
        100: "#ffd1ad",
        200: "#ffae70",
        300: "#ff8b33", // gradient start
        400: "#f56a00", // gradient end
        500: "#c25400",
        600: "#8f3e00"
      },
      secondary: {
        50: "#ebfdff",
        100: "#adf7ff",
        200: "#70f1ff",
        300: "#33ebff",
        400: "#00dcf5",
        500: "#00aec2", // gradient start
        600: "#00818f" // gradient end: #0c7f8c
      },
      smart: {
        50: "#ebf8ff",
        100: "#ade4ff",
        200: "#70cfff",
        300: "#33bbff",
        400: "#00a3f5",
        500: "#0081c2",
        600: "#005f8f"
      },
      green: {
        50: "#ecfef7",
        100: "#b2fbde",
        200: "#77f8c4",
        300: "#3df5ab",
        400: "#0ce990",
        500: "#05bd73",
        600: "#008f55"
      },
      yellow: {
        50: "#fff9ea",
        100: "#ffe8ad",
        200: "#ffd670",
        300: "#ffc533",
        400: "#f5af00",
        500: "#c28b00",
        600: "#8f6600"
      },
      red: {
        50: "#feecec",
        100: "#fbb2b2",
        200: "#f87777",
        300: "#f53d3d",
        400: "#e90c0c",
        500: "#bd0505",
        600: "#8f0000"
      },
      blue: {
        50: "#eaf4ff",
        100: "#add3ff",
        200: "#70b3ff",
        300: "#3392ff",
        400: "#0072f5",
        500: "#005ac2",
        600: "#00438f"
      },
      grey: {
        50: "#f4f4f5",
        100: "#d4d5d8",
        200: "#b4b5bb",
        300: "#94959e",
        400: "#747681",
        500: "#575a6b",
        600: "#3d4052",
        700: "#1E1F26"
      }
    },
    screens: {
      sm: "360px",
      md: "480px",
      lg: "600px",
      xl: "840px",
      "2xl": "1080px",
      "3xl": "1200px"
    },
    fontSize: {
      xs: "0.5rem",
      sm: "0.75rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
      "4xl": "2.5rem",
      "5xl": "3rem",
      "6xl": "3.5rem",
      "7xl": "4rem",
      "8xl": "5rem"
    },
    boxShadow: {
      b: "inset 1px 1px 1px rgba(0, 0, 0, 0.25)",
      f1: "0px 1px 2px rgba(0, 0, 0, 0.25)",
      f2: "0px 2px 4px rgba(0, 0, 0, 0.25)",
      f3: "0px 4px 8px rgba(0, 0, 0, 0.25)",
      f4: "0px 8px 16px rgba(0, 0, 0, 0.25)",
      outline: "0 0 0 3px rgba(0, 114, 240, 0.5)",
      none: "none"
    },
    extend: {
      maxWidth: {
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%"
      },
      lineHeight: {
        none: "1",
        tight: "1.1",
        snug: "1.15",
        normal: "1.25",
        relaxed: "1.33",
        loose: "1.5"
      },
      animation: {
        pulse: "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      keyframes: {
        pulse: {
          "50%": { opacity: ".2" }
        }
      }
    }
  },
  darkMode: false
};
