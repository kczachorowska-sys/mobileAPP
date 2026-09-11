import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF8F5",
        cream: "#F5F0EB",
        charcoal: "#2C2C2C",
        "deep-brown": "#3E2723",
        "warm-brown": "#5D4037",
        olive: "#6B7B5E",
        "olive-light": "#8A9A7B",
        burgundy: "#722F37",
        "burgundy-light": "#8B3A42",
        sand: "#E8DDD3",
        "sand-dark": "#D4C5B5",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", '"Times New Roman"', "Times", "serif"],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
