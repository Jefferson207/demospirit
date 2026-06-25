import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#080806",
        charcoal: "#151511",
        gold: "#C99A3A",
        "gold-soft": "#F2D487",
        turquoise: "#22C7C8",
        emerald: "#0F8F6C",
        ivory: "#FFFDF6"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"]
      },
      boxShadow: {
        premium: "0 24px 80px rgba(8, 8, 6, 0.14)",
        glow: "0 0 34px rgba(201, 154, 58, 0.38)"
      },
      backgroundImage: {
        "andean-pattern":
          "linear-gradient(135deg, rgba(201,154,58,.18) 25%, transparent 25%), linear-gradient(225deg, rgba(34,199,200,.15) 25%, transparent 25%), linear-gradient(45deg, rgba(15,143,108,.12) 25%, transparent 25%)"
      }
    }
  },
  plugins: []
};

export default config;
