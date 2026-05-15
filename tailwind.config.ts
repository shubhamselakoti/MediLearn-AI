/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-dm-sans)", "sans-serif"],
      syne: ["var(--font-syne)", "sans-serif"],
    },
    extend: {
      colors: {
        accent: "#4f7fff",
        "accent-2": "#6b96ff",
        green: { DEFAULT: "#22d07a" },
        red: { DEFAULT: "#ff5b7a" },
        yellow: { DEFAULT: "#ffc93c" },
        purple: { DEFAULT: "#a78bfa" },
        cyan: { DEFAULT: "#38bdf8" },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        skeleton: "skeleton 1.5s ease infinite",
        "page-in": "page-in 0.3s cubic-bezier(0.4,0,0.2,1) forwards",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        skeleton: {
          "0%": { backgroundPosition: "200%" },
          "100%": { backgroundPosition: "-200%" },
        },
        "page-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
