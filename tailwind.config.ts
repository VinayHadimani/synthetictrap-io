import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        // ===== DARK FORENSIC SYSTEM (dashboard + marketplace) =====
        trap: {
          DEFAULT: "hsl(0 84% 60%)",
          dark: "hsl(0 72% 50%)",
        },
        honeypot: {
          DEFAULT: "hsl(142 71% 45%)",
          dark: "hsl(142 71% 35%)",
        },

        // ===== CREAM ISLAND SYSTEM (landing page only) =====
        cream: {
          DEFAULT: "#FFF0DF",
          surface: "#FFF0D8",
        },
        ink: {
          DEFAULT: "#292524",
          deep: "#1C1917",
        },
        violet: {
          deep: "#301860",
          mid: "#4830A8",
        },
        coral: "#FF6900",
        lilac: "#EFABFB",
        "coral-soft": "#F5D0FE",
      },
      fontSize: {
        "display-lg": ["96px", { lineHeight: "1", letterSpacing: "-2.4px", fontWeight: "700" }],
        "headline-md": ["30px", { lineHeight: "1.2", letterSpacing: "-0.4px", fontWeight: "700" }],
      },
      spacing: {
        "island-sm": "12px",
        "island-md": "20px",
        "island-lg": "56px",
      },
      borderRadius: {
        "island-control": "8px",
        "island-button": "12px",
        "island-card": "16px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "fade-in": "fadeIn 0.3s cubic-bezier(0, 0, 0.2, 1) both",
        "slide-in-top": "slideInTop 0.3s cubic-bezier(0, 0, 0.2, 1) both",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px hsl(0 84% 60% / 0.5)" },
          "100%": { boxShadow: "0 0 25px hsl(0 84% 60% / 0.9)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInTop: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
