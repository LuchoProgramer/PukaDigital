import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

const ToggleDarkMode = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
            className="ml-4 focus:outline-none text-xl transition-transform duration-300 ease-in-out"
        >
            {isDark ? (
                <FiSun className="text-yellow-400 transform rotate-0 transition duration-300 ease-in-out" />
            ) : (
                <FiMoon className="text-blue-800 transform rotate-180 transition duration-300 ease-in-out" />
            )}
        </button>
    );
};

export default ToggleDarkMode;
