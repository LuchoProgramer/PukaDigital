import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // PukaDigital Minimalist Palette (Apple-Style)
        'puka-red': '#D32F2F',        // Solo para acentos importantes
        'puka-black': '#000000',      // Texto principal
        'puka-white': '#FFFFFF',      // Fondos principales
        'puka-gray-light': '#F5F5F5', // Fondos secundarios
        'puka-gray-medium': '#9E9E9E', // Texto secundario
        'puka-gray-dark': '#424242',  // Texto de apoyo
        'puka-red-soft': '#FFEBEE',   // Fondos sutiles para destacar
        
        // Sistema de colores
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'pulse-gentle': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;