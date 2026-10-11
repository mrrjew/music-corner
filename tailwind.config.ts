import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "action-primary": "var(--color-action-primary)",
        "accent-decorative": "var(--color-accent-decorative)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      spacing: {
        "1": "var(--spacing-1)",
        "2": "var(--spacing-2)",
        "3": "var(--spacing-3)",
        "4": "var(--spacing-4)",
        "6": "var(--spacing-6)",
        "8": "var(--spacing-8)",
        "12": "var(--spacing-12)",
        "section-sm": "var(--spacing-section-sm)",
        "section-md": "var(--spacing-section-md)",
        "section-lg": "var(--spacing-section-lg)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        card: "var(--radius-card)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      height: {
        button: "var(--height-button)",
        input: "var(--height-input)",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".display": {
          fontFamily: "var(--font-heading)",
          fontSize: "var(--font-size-display)",
          lineHeight: "var(--line-height-display)",
          fontWeight: "var(--font-weight-display)",
        },
        ".page-title": {
          fontFamily: "var(--font-heading)",
          fontSize: "var(--font-size-page-title)",
          lineHeight: "var(--line-height-page-title)",
          fontWeight: "var(--font-weight-page-title)",
        },
        ".section-title": {
          fontFamily: "var(--font-heading)",
          fontSize: "var(--font-size-section-title)",
          lineHeight: "var(--line-height-section-title)",
          fontWeight: "var(--font-weight-section-title)",
        },
        ".card-title": {
          fontFamily: "var(--font-heading)",
          fontSize: "var(--font-size-card-title)",
          lineHeight: "var(--line-height-card-title)",
          fontWeight: "var(--font-weight-card-title)",
        },
        ".subtitle": {
          fontFamily: "var(--font-heading)",
          fontSize: "var(--font-size-subtitle)",
          lineHeight: "var(--line-height-subtitle)",
          fontWeight: "var(--font-weight-subtitle)",
        },
        ".item": {
          fontFamily: "var(--font-heading)",
          fontSize: "var(--font-size-item)",
          lineHeight: "var(--line-height-item)",
          fontWeight: "var(--font-weight-item)",
        },
        ".small-heading": {
          fontFamily: "var(--font-heading)",
          fontSize: "var(--font-size-small-heading)",
          lineHeight: "var(--line-height-small-heading)",
          fontWeight: "var(--font-weight-small-heading)",
        },
        ".body-large": {
          fontFamily: "var(--font-body)",
          fontSize: "var(--font-size-body-large)",
          lineHeight: "var(--line-height-body-large)",
          fontWeight: "var(--font-weight-body-large)",
        },
        ".body": {
          fontFamily: "var(--font-body)",
          fontSize: "var(--font-size-body)",
          lineHeight: "var(--line-height-body)",
          fontWeight: "var(--font-weight-body)",
        },
        ".supporting": {
          fontFamily: "var(--font-body)",
          fontSize: "var(--font-size-supporting)",
          lineHeight: "var(--line-height-supporting)",
          fontWeight: "var(--font-weight-supporting)",
        },
        ".button": {
          fontFamily: "var(--font-heading)",
          fontSize: "var(--font-size-button)",
          lineHeight: "var(--line-height-button)",
          fontWeight: "var(--font-weight-button)",
        },
        ".form-label": {
          fontFamily: "var(--font-body)",
          fontSize: "var(--font-size-form-label)",
          lineHeight: "var(--line-height-form-label)",
          fontWeight: "var(--font-weight-form-label)",
        },
        ".meta": {
          fontFamily: "var(--font-body)",
          fontSize: "var(--font-size-meta)",
          lineHeight: "var(--line-height-meta)",
          fontWeight: "var(--font-weight-meta)",
        },
        ".caption": {
          fontFamily: "var(--font-body)",
          fontSize: "var(--font-size-caption)",
          lineHeight: "var(--line-height-caption)",
          fontWeight: "var(--font-weight-caption)",
          fontStyle: "italic",
        },
      });
    }),
  ],
};

export default config;
