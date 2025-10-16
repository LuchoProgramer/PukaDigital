"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

interface Blog {
    id: string;
    title: string;
    image?: string;
}

const BlogList: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const blogsSnapshot = await getDocs(collection(db, "blogs"));
                const blogsData = blogsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Blog[];
                setBlogs(blogsData);
            } catch (error) {
                console.error("Error al obtener los blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleDelete = async (id: string) => {
        // Verifica si window está definido antes de usarlo
        if (
            typeof window !== "undefined" &&
            !window.confirm("¿Estás seguro de que deseas eliminar este blog?")
        ) {
            return;
        }

        try {
            await deleteDoc(doc(db, "blogs", id));
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
            alert("Blog eliminado");
        } catch (error) {
            console.error("Error al eliminar el blog:", error);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <p>Cargando blogs...</p>
            </div>
        );
    }

    return (
        <div className="py-12 mt-10 max-w-5xl mx-auto p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-lg md:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                Lista de Blogs
            </h2>
            {/* Tabla para pantallas medianas o más grandes */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border border-gray-300 dark:border-gray-700 table-auto md:table-fixed">
                    <thead className="bg-gray-300 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                                Título
                            </th>
                            <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                                Imagen
                            </th>
                            <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900">
                        {blogs.map((blog) => (
                            <tr
                                key={blog.id}
                                className="border-b border-gray-300 dark:border-gray-700"
                            >
                                <td className="px-4 py-2 text-gray-800 dark:text-gray-200 text-sm md:text-base">
                                    {blog.title}
                                </td>
                                <td className="px-4 py-2">
                                    {blog.image ? (
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    ) : (
                                        <span className="text-gray-500">Sin imagen</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                                    <button
                                        onClick={() => router.push(`/cms/blogs/edit/${blog.id}`)}
                                        className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 text-xs md:text-sm rounded"
                                    >
                                        <AiOutlineEdit size={16} />
                                        <span>Editar</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="flex items-center space-x-1 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 text-xs md:text-sm rounded"
                                    >
                                        <AiOutlineDelete size={16} />
                                        <span>Eliminar</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Vista como lista para pantallas pequeñas */}
            <div className="block md:hidden">
                {blogs.map((blog) => (
                    <div
                        key={blog.id}
                        className="border-b border-gray-300 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 rounded-lg mb-4"
                    >
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                            {blog.title}
                        </h3>
                        <div className="flex items-center mt-2">
                            {blog.image ? (
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            ) : (
                                <span className="text-gray-500">Sin imagen</span>
                            )}
                        </div>
                        <div className="flex space-x-2 mt-4">
                            <button
                                onClick={() => router.push(`/cms/blogs/edit/${blog.id}`)}
                                className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 text-xs rounded"
                            >
                                <AiOutlineEdit size={16} />
                                <span>Editar</span>
                            </button>
                            <button
                                onClick={() => handleDelete(blog.id)}
                                className="flex items-center space-x-1 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 text-xs rounded"
                            >
                                <AiOutlineDelete size={16} />
                                <span>Eliminar</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogList;