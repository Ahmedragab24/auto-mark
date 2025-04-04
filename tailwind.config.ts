import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import tailwindScrollbar from "tailwind-scrollbar";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        h1: [
          "56px",
          {
            lineHeight: "1.2",
          },
        ],
        h2: [
          "48px",
          {
            lineHeight: "1.3",
          },
        ],
        h3: [
          "40px",
          {
            lineHeight: "1.3",
          },
        ],
        h4: [
          "32px",
          {
            lineHeight: "1.4",
          },
        ],
        h5: [
          "24px",
          {
            lineHeight: "1.5",
          },
        ],
        h6: [
          "20px",
          {
            lineHeight: "1.5",
          },
        ],
        bodyXL: [
          "18px",
          {
            lineHeight: "1.6",
          },
        ],
        bodyL: [
          "16px",
          {
            lineHeight: "1.6",
          },
        ],
        bodyM: [
          "14px",
          {
            lineHeight: "1.6",
          },
        ],
        bodyS: [
          "12px",
          {
            lineHeight: "1.6",
          },
        ],
      },
      fontWeight: {
        semibold: "600",
        medium: "500",
        regular: "400",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(180deg, rgba(251, 251, 251, 0) 10.52%, #FFCCCC 800.09%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate, tailwindScrollbar],
} satisfies Config;
