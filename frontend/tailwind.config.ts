import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "0",
        md: "0",
        sm: "0",
        none: "0"
      },
      colors: {
        background: "#FFFFFF",
        foreground: "#000000",
        border: "#000000",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000"
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000"
        },
        primary: {
          DEFAULT: "#FF6B6B",
          foreground: "#000000"
        },
        secondary: {
          DEFAULT: "#4ECDC4",
          foreground: "#000000"
        },
        muted: {
          DEFAULT: "#F7F7F7",
          foreground: "#666666"
        },
        accent: {
          DEFAULT: "#FFE66D",
          foreground: "#000000"
        },
        destructive: {
          DEFAULT: "#FF6B6B",
          foreground: "#000000"
        },
        success: "#95E1D3",
        purple: "#A78BFA",
        pink: "#F9A8D4",
        input: "#000000",
        ring: "#000000",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        comic: ["Comic Sans MS", "Marker Felt", "cursive"],
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #000000",
        "brutal-sm": "2px 2px 0px 0px #000000",
        "brutal-lg": "6px 6px 0px 0px #000000",
        "brutal-xl": "8px 8px 0px 0px #000000",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-in": "bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "slide-up": "slideUp 0.3s ease-out",
        "pop": "pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
