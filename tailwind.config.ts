import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'puka-red': '#C7171E',
        'puka-black': '#000000',
        'puka-beige': '#EBDFC9',
      },
      fontFamily: {
        // 'sans' apuntaba a --font-inter, que en realidad era Geist Mono: todo
        // lo que llevaba font-sans se renderizaba monoespaciado, incluido el
        // div raíz de la home y de /agencia.
        'display': ['var(--font-display-marca)', 'system-ui', 'sans-serif'],
        'sans': ['var(--font-sans-marca)', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-mono-marca)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
