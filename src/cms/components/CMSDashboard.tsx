"use client";

import React from "react";
import Link from "next/link";
import { FiEdit, FiEye, FiPlusCircle } from "react-icons/fi";

const CMSDashboard: React.FC = () => {
    return (
        <div className="py-8 mt-8 min-h-screen bg-gray-light dark:bg-gray-veryDark p-6">
            {/* Título del Dashboard */}
            <header className="mb-8 flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl font-bold text-gray-dark dark:text-gray-light">
                    Panel de Control
                </h1>
                <p className="text-gray-dark dark:text-gray-light mt-2">
                    Administra tus blogs y configuraciones fácilmente.
                </p>
            </header>

            {/* Opciones principales */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Crear Blog */}
                <Link
                    href="/cms/blogs/create"
                    className="bg-primary dark:bg-primary-dark hover:bg-primary-light text-white p-6 rounded-lg shadow-md flex items-center space-x-4 transform transition-transform duration-300 hover:scale-105"
                >
                    <FiPlusCircle size={32} />
                    <span className="text-xl font-bold">Crear Blog</span>
                </Link>

                {/* Ver Blogs */}
                <Link
                    href="/cms/blogs"
                    className="bg-primary hover:bg-primary-light text-white p-6 rounded-lg shadow-md flex items-center space-x-4 transform transition-transform duration-300 hover:scale-105"
                >
                    <FiEye size={32} />
                    <span className="text-xl font-bold">Ver Blogs</span>
                </Link>

                {/* Editar Configuración */}
                <Link
                    href="/cms/settings"
                    className="bg-gray-dark hover:bg-gray text-white p-6 rounded-lg shadow-md flex items-center space-x-4 transform transition-transform duration-300 hover:scale-105"
                >
                    <FiEdit size={32} />
                    <span className="text-xl font-bold">Configuración</span>
                </Link>
            </section>

            {/* Resumen rápido */}
            <section className="mt-8">
                <h2 className="text-2xl font-bold text-gray-dark dark:text-gray-light mb-4">
                    Resumen
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Ejemplo: Número de Blogs */}
                    <div className="bg-gray-light dark:bg-gray-dark p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold text-gray-dark dark:text-gray-light">
                            Blogs publicados
                        </h3>
                        <p className="text-2xl font-bold text-primary dark:text-primary-light">
                            24
                        </p>
                    </div>

                    {/* Agrega otras tarjetas aquí */}
                </div>
            </section>
        </div>
    );
};

export default CMSDashboard;