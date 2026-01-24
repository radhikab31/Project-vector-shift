module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backdropBlur: {
        xs: "2px",
      },
      colors: {
        glass: "rgba(255, 255, 255, 0.15)",
        glassDark: "rgba(0, 0, 0, 0.25)",
        accent: {
          DEFAULT: "#7c3aed", // purple-600
          soft: "#a78bfa", // purple-400
        },
        "dark-blue": '#1C2536',
      },
    },
  },
  plugins: [],
};
