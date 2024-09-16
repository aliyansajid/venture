import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        dark: {
          primary: "#000000",
          secondary: "#717171",
          tertiary: "#AFAFAF",
          disable: "#D8D8D8",
          informative: "#4976F4",
          positive: "#589E67",
          error: "#AF4B4B",
        },
        light: {
          primary: "#ffffff",
          secondary: "#F9F9F9",
          tertiary: "#F2F2F2",
          disable: "#D8D8D8",
          informative: "#4976F4",
          positive: "#589E67",
          error: "#AF4B4B",
        },
        border: {
          primary: "#E4E4E4",
          secondary: "#AFAFAF",
          tertiary: "#000000",
          informative: "#B6C8FB",
          positive: "#BCD8C2",
          error: "#DFB7B7",
          warning: "#EDD2B1",
        },
        background: {
          primary: "#ffffff",
          secondary: "#F9F9F9",
          tertiary: "#F2F2F2",
          blue: "#EDF2FE",
          green: "#EEF5F0",
          red: "#F7EDED",
          orange: "#FBF4EC",
          purple: "#F4EDF7",
          yellow: "#F7F7E8",
        },
        action: {
          primary: {
            base: "#000000",
            hover: "#717171",
            active: "#4B4B4B",
            disable: "#F9F9F9",
            selected: "#4B4B4B",
          },
          secondary: {
            base: "#ffffff",
            base2: "#F2F2F2",
            hover: "#E8E8E8",
            active: "#E4E4E4",
            disable: "#F9F9F9",
            selected: "#F2F2F2",
          },
          outline: {
            base: "#E4E4E4",
            base2: "#000000",
            hover: "#000000",
            active: "#717171",
            disable: "#F2F2F2",
            selected: "#AFAFAF",
          },
          destructive: {
            base: "#BF6F6F",
            hover: "#AF4B4B",
            active: "#8C3C3C",
            disable: "#AF4B4B",
            selected: "#EFDBDB",
          },
        },
        interaction: {
          primary: {
            base: "#000000",
            hover: "#717171",
            active: "#4B4B4B",
            disable: "#F9F9F9",
            selected: "#4B4B4B",
          },
          secondary: {
            base: "#FFFFFF",
            hover: "#F2F2F2",
            active: "#E4E4E4",
            disable: "#F9F9F9",
            selected: "#F2F2F2",
          },
          outline: {
            base: "#D8D8D8",
            hover: "#717171",
            active: "#000000",
            disable: "#E8E8E8",
            selected: "#AFAFAF",
          },
        },
        red: {
          base: "#AF4B4B",
          hover: "#8C3C3C",
          active: "#692D2D",
          disable: "#EFDBDB",
          selected: "#8C3C3C",
        },
        green: {
          base: "#589E67",
          hover: "#467E52",
          active: "#355F3E",
          disable: "#DEECE1",
          selected: "#467E52",
        },
        blue: {
          base: "#4976F4",
          hover: "#3759B7",
          active: "#253B7A",
          disable: "#DBE4FD",
          selected: "#3759B7",
        },
        yellow: {
          base: "#B1AB1D",
          hover: "#8E8917",
          active: "#6A6711",
          disable: "#EFEED2",
          selected: "#8E8917",
        },
        purple: {
          base: "#954BAF",
          hover: "#773C8C",
          active: "#592D69",
          disable: "#EADBEF",
          selected: "#773C8C",
        },
        orange: {
          base: "#D28E3D",
          hover: "#A87231",
          active: "#7E5525",
          disable: "#F6E8D8",
          selected: "#A87231",
        },
      },
    },
    keyframes: {
      "accordion-down": {
        from: { height: "0" },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: "0" },
      },
      "caret-blink": {
        "0%,70%,100%": { opacity: "1" },
        "20%,50%": { opacity: "0" },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      "caret-blink": "caret-blink 1.25s ease-out infinite",
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
