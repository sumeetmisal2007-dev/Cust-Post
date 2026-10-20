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
          light: "var(--color-brand-light)",
          dark: "var(--color-brand-dark)",
        },
        action: {
          DEFAULT: "var(--color-action)",
          hover: "var(--color-action-hover)",
        },
        earth: {
          DEFAULT: "var(--color-earth)",
          dark: "var(--color-earth-dark)",
          light: "var(--color-earth-light)",
          subtle: "var(--color-earth-subtle)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          light: "var(--color-accent-light)",
          soft: "var(--color-accent-soft)",
        },
        canvas: "var(--color-canvas)",
        surface: {
          DEFAULT: "var(--color-surface)",
          soft: "var(--color-surface-soft)",
        },
        mint: {
          DEFAULT: "var(--color-mint)",
          light: "var(--color-mint-light)",
        },
        ink: "var(--color-ink)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        border: {
          DEFAULT: "var(--color-border)",
          subtle: "var(--color-border-subtle)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          bg: "var(--color-warning-bg)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          bg: "var(--color-error-bg)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          bg: "var(--color-success-bg)",
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
  plugins: [],
};

export default config;
