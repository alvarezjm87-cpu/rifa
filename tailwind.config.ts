import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Quicksand", "system-ui", "sans-serif"],
        display: ["Fredoka", "Quicksand", "sans-serif"],
        hand: ["Caveat", "cursive"],
      },
      colors: {
        school: {
          blue: "#38bdf8",
          blueDark: "#0284c7",
          yellow: "#fef08a",
          amber: "#f59e0b",
          coral: "#fb7185",
          purple: "#c084fc",
          mint: "#34d399",
          mintDark: "#059669",
          paper: "#fffdf9",
        },
      },
    },
  },
  plugins: [],
};
export default config;
