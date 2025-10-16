"use client";

import React, { useEffect, useState } from 'react';
import { Blog } from '../../types'; // Asegúrate de importar correctamente el tipo Blog
import BlogCard from './BlogCard';
import { getBlogs } from '../../lib/firebase';

const Blogs: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]); // Aquí estamos usando Blog[] como tipo
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const blogsList = await getBlogs();
                // Si el tipo ya está bien definido, no necesitas transformar las propiedades image y alt
                // Asegúrate que image y alt estén correctamente asignados cuando los blogs se obtienen
                const blogsWithImage = blogsList.map(blog => ({
                    ...blog,
                    image: blog.image ?? undefined, // Asegurando que image sea string | undefined
                    alt: blog.alt ?? undefined, // Asegurando que alt sea string | undefined
                }));
                setBlogs(blogsWithImage);
            } catch (error) {
                console.error('Error al cargar los blogs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="py-20 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
                Blog Posts
            </h2>
            {loading ? (
                <p className="text-center text-gray-600 dark:text-gray-400">Cargando blogs...</p>
            ) : blogs.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">
                    No hay blogs disponibles en este momento.
                </p>
            ) : (
                <div className="flex flex-wrap justify-center gap-6">
                    {blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blogs;