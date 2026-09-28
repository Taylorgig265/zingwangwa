import type { Config } from "tailwindcss";

/**
 * Zingwangwa Street Foods — Brand System
 * Burnt Sienna #BF4C00 · Honeycomb Yellow #FFBE00 · Cacao Brown #7C2B00 · Pure White
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          burnt: "#BF4C00",
          honey: "#FFBE00",
          cacao: "#7C2B00",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        // Display font: headlines, logo lockup, section titles, CTAs ONLY — never body copy.
        display: ["var(--font-display)", "cursive"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        bloom: "0 12px 40px -8px rgba(191, 76, 0, 0.45)",
        card: "0 6px 24px -6px rgba(124, 43, 0, 0.25)",
      },
      keyframes: {
        "honey-shimmer": {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "logo-bob": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "steam-rise": {
          "0%": { opacity: "0", transform: "translateY(6px) scaleX(1)" },
          "30%": { opacity: "0.9" },
          "100%": { opacity: "0", transform: "translateY(-22px) scaleX(1.4)" },
        },
        "flame-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "honey-shimmer": "honey-shimmer 1.4s linear infinite",
        "logo-bob": "logo-bob 3s ease-in-out infinite",
        "steam-rise": "steam-rise 1.6s ease-out infinite",
        "flame-shift": "flame-shift 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
