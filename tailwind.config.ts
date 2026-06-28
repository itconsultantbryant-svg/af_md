import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#080E1A",
          darker: "#0D1525",
          navy: "#1A3C6E",
          blue: "#1E3A5F",
          gold: "#D4A017",
          "gold-light": "#F0C040",
          muted: "#8899BB",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #D4A017 0%, #F0C040 50%, #D4A017 100%)",
        "navy-gradient":
          "linear-gradient(135deg, #080E1A 0%, #1A3C6E 100%)",
        "glow-gold":
          "radial-gradient(ellipse at center, rgba(212,160,23,0.2) 0%, transparent 70%)",
        "glow-blue":
          "radial-gradient(ellipse at center, rgba(30,58,95,0.8) 0%, transparent 70%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "spin-slow": "spin 25s linear infinite",
        shimmer: "shimmer 2s linear infinite",
        scroll: "scroll 30s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212,160,23,0.2)" },
          "50%": { boxShadow: "0 0 50px rgba(212,160,23,0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
