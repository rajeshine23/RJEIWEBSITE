import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ivory: "#FAF6EF",
          champagne: "#E8D8C5",
          gold: "#B08D57",
          "gold-light": "#C8A97E",
          "gold-dark": "#8C6D3B",
          maroon: "#641F2B",
          "maroon-dark": "#4B141E",
          "maroon-light": "#822938",
          espresso: "#30231E",
          "espresso-light": "#4A3831",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        editorial: "0 4px 20px -2px rgba(48, 35, 30, 0.08)",
        luxury: "0 10px 30px -5px rgba(48, 35, 30, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
