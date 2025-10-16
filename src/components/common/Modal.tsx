"use client";

import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    // Cerrar el modal al presionar "Escape"
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
        }
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    // Cerrar el modal al hacer click fuera de su contenido
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
            role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
        >
            {/* Contenedor del Modal */}
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 transform transition-transform duration-300"
                role="document"
            >
                {/* Botón de cerrar */}
                <div className="flex justify-end p-2">
                    <button
                        onClick={onClose}
                        aria-label="Cerrar modal"
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                        <FiX size={24} />
                    </button>
                </div>
                {/* Contenido del Modal */}
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;