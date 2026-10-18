import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--color-brand)",
          light: "#00B890",
        },
        action: {
          DEFAULT: "var(--color-action)",
          hover: "#004D3B",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          light: "#FBD17E",
        },
        canvas: "var(--color-canvas)",
        surface: "var(--color-surface)",
        mint: "var(--color-mint)",
        ink: "var(--color-ink)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        warning: {
          DEFAULT: "var(--color-warning)",
          bg: "#FEF7EE",
        },
        error: {
          DEFAULT: "var(--color-error)",
          bg: "#FDF2F2",
        },
      },
      fontFamily: {
        display: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        panel: "var(--radius-panel)",
        card: "var(--radius-card)",
        control: "var(--radius-control)",
      },
      maxWidth: {
        content: "var(--content-max)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
