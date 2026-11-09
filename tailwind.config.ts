import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        brand: {
          50: "#ECFDF3",
          100: "#D1FADF",
          200: "#A6F4C5",
          300: "#6CE9A6",
          400: "#32D583",
          500: "#12B76A",
          600: "#0F9D58",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        teal: { 500: "#0EA5A4", 600: "#0D9488", 700: "#0F766E" },
        rice: { 50: "#FFFBEB", 100: "#FEF3C7", 400: "#FACC15", 500: "#F5B700", 600: "#D99E00" },
        silt: { 500: "#F97316", 600: "#EA580C" },
        ink: "#0F172A",
        surface: "#F8FAF9",
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam)", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "0.875rem", "2xl": "1rem", "3xl": "1.5rem" },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(15, 23, 42, 0.08)",
        card: "0 1px 3px rgba(15,23,42,.06), 0 8px 24px -8px rgba(15,23,42,.10)",
      },
    },
  },
  plugins: [],
};

export default config;
