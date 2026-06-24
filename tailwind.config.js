/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./i18n/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: "#F5F5F3", // warm off-white paper
        ink: "#161615", // near-black charcoal
        graphite: "#2A2A28", // secondary dark
        mist: "#E4E3DE", // light gray
        ash: "#8A8A84", // muted text
        blueprint: {
          DEFAULT: "#3E5C76", // restrained accent
          soft: "#7FA3C4", // accent on dark surfaces
        },
        line: "rgba(22, 22, 21, 0.12)", // hairline rule
        "line-strong": "rgba(22, 22, 21, 0.22)", // stronger divider
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        annotation: "0.18em",
      },
      maxWidth: {
        site: "1480px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
