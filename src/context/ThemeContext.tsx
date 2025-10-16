"use client";

import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";

// Define el tipo del contexto
interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
}

// Contexto con valor inicial
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Proveedor del tema
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setIsDark(storedTheme === "dark");
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setIsDark(prefersDark);
        }
    }, []);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }, [isDark]);

    const toggleTheme = () => setIsDark((prev) => !prev);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook personalizado para consumir el contexto
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme debe usarse dentro de ThemeProvider");
    }
    return context;
};

// Exportación nombrada de ThemeContext
export { ThemeContext };