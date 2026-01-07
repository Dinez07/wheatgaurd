import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // AgriTech specific colors
        leaf: {
          50: "hsl(120, 40%, 96%)",
          100: "hsl(120, 35%, 90%)",
          200: "hsl(120, 30%, 80%)",
          300: "hsl(120, 35%, 65%)",
          400: "hsl(123, 40%, 50%)",
          500: "hsl(123, 47%, 33%)",
          600: "hsl(123, 50%, 28%)",
          700: "hsl(123, 55%, 22%)",
          800: "hsl(123, 60%, 16%)",
          900: "hsl(123, 65%, 10%)",
        },
        wheat: {
          50: "hsl(45, 100%, 96%)",
          100: "hsl(45, 95%, 90%)",
          200: "hsl(45, 90%, 80%)",
          300: "hsl(45, 92%, 70%)",
          400: "hsl(45, 97%, 58%)",
          500: "hsl(45, 90%, 50%)",
          600: "hsl(42, 85%, 45%)",
          700: "hsl(38, 80%, 38%)",
          800: "hsl(35, 75%, 30%)",
          900: "hsl(30, 70%, 22%)",
        },
        sky: {
          50: "hsl(196, 100%, 97%)",
          100: "hsl(196, 95%, 92%)",
          200: "hsl(196, 90%, 84%)",
          300: "hsl(196, 88%, 74%)",
          400: "hsl(196, 92%, 64%)",
          500: "hsl(196, 85%, 52%)",
          600: "hsl(196, 80%, 42%)",
          700: "hsl(196, 75%, 32%)",
          800: "hsl(196, 70%, 24%)",
          900: "hsl(196, 65%, 16%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(46, 125, 50, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(46, 125, 50, 0.5)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      backgroundImage: {
        'hero-pattern': 'radial-gradient(circle at 20% 80%, rgba(46, 125, 50, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(251, 192, 45, 0.08) 0%, transparent 50%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
