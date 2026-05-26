import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-delay-1": "fadeIn 0.6s ease-out 0.1s forwards",
        "fade-in-delay-2": "fadeIn 0.6s ease-out 0.2s forwards",
        "fade-in-delay-3": "fadeIn 0.6s ease-out 0.3s forwards",
        "fade-in-delay-4": "fadeIn 0.6s ease-out 0.4s forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "typing": "typing 0.8s steps(1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        typing: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
      },
      colors: {
        glass: {
          10: "rgba(255, 255, 255, 0.1)",
          20: "rgba(255, 255, 255, 0.2)",
          30: "rgba(255, 255, 255, 0.3)",
        },
        "event-green": "#10b981",
        "event-purple": "#8b5cf6",
        "event-yellow": "#f59e0b",
        "event-pink": "#ec4899",
        "event-cyan": "#06b6d4",
        "event-red": "#ef4444",
        "event-blue": "#3b82f6",
      },
    },
  },
  plugins: [],
};
export default config;
