/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '90%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        pop: 'pop 0.5s ease-out forwards',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(1, 0.03, 0, 1)',
        // 'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
