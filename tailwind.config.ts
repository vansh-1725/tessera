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
        // Tessera Brand Colors
        obsidian: "#0A0E1A",
        void: "#060912",
        "tessera-blue": "#2A6FDB",
        "mosaic-cyan": "#00D4FF",
        "slate-surface": "#161D30",
        "slate-border": "#1e2a45",
        "slate-muted": "#3D4F72",
        "slate-text": "#94A3C4",
        "slate-bright": "#F0F4FF",
        "amber-tile": "#F5A623",
        "emerald-tile": "#10D98A",
        "rose-tile": "#FF4D6D",
        "violet-tile": "#8B5CF6",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        sans: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-core": "linear-gradient(135deg, #2A6FDB 0%, #00D4FF 100%)",
        "gradient-mosaic": "linear-gradient(135deg, #2A6FDB 0%, #8B5CF6 50%, #00D4FF 100%)",
        "gradient-dark": "linear-gradient(135deg, #0A0E1A 0%, #161D30 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "tile-pulse": "tilePulse 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        tilePulse: {
          "0%, 100%": { opacity: "0.9" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
