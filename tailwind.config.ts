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
        bg: {
          primary: "#F8FAFC",
          secondary: "#F1F5F9",
          card: "#FFFFFF",
        },
        synta: {
          blue: "#2563EB",
          "blue-dim": "#1D4ED8",
          "blue-light": "#3B82F6",
          "blue-bg": "#EFF6FF",
          teal: "#0891B2",
          "teal-bg": "#F0F9FF",
        },
        border: {
          DEFAULT: "#E2E8F0",
          strong: "#CBD5E1",
        },
        content: {
          primary: "#0F172A",
          secondary: "#475569",
          muted: "#94A3B8",
        },
        status: {
          danger: "#DC2626",
          "danger-bg": "#FEF2F2",
          warning: "#D97706",
          "warning-bg": "#FFFBEB",
          success: "#059669",
          "success-bg": "#F0FDF4",
        },
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
        blue: "0 4px 14px rgba(37,99,235,0.2)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
