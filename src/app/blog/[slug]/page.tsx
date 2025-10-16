import Head from 'next/head'; // Importa Head de esta manera
import React from 'react';
import { Metadata } from "next";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Blog } from "@/types";
import Comments from "@/components/blogs/Comments";

// Función para obtener un blog por su "slug" desde Firebase
const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
    try {
        const blogsRef = collection(db, "blogs");
        const q = query(blogsRef, where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const blogDoc = querySnapshot.docs[0];
            const data = blogDoc.data() as Blog;
            return { ...data, id: blogDoc.id };
        }

        return null;
    } catch (error) {
        console.error("Error al obtener el blog:", error);
        return null;
    }
};

// Ajuste para trabajar con Next.js App Router y el tipo correcto para rutas dinámicas
export interface BlogDetailPageProps {
    params: Promise<{ slug: string }>;
}

// Función para obtener los metadatos de forma dinámica
export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
    const { slug } = await params; // Obtener el slug de la promesa

    const blog = await getBlogBySlug(slug);
    if (!blog) {
        return { title: "Blog no encontrado", description: "El blog solicitado no existe." };
    }

    return {
        title: `${blog.title} - Blog de Luis Viteri`,
        description: blog.excerpt || "Lee este interesante artículo en mi blog de desarrollo web.",
        openGraph: {
            title: blog.title,
            description: blog.excerpt || "Lee este interesante artículo en mi blog de desarrollo web.",
            images: [blog.image || "/default-blog-image.jpg"],
            url: `https://luchodev.netlify.app/blog/${slug}`,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description: blog.excerpt || "Lee este interesante artículo en mi blog de desarrollo web.",
            images: [blog.image || "/default-blog-image.jpg"],
        },
    };
}

// Componente de la página dinámica
const BlogDetail = async ({ params }: BlogDetailPageProps) => {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        return (
            <p className="text-center mt-6 text-red-500 dark:text-red-400">
                No se encontró un blog con este slug.
            </p>
        );
    }

    // Generar el Schema Markup dinámico
    const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "image": blog.image,
        "datePublished": blog.createdAt instanceof Date
            ? blog.createdAt.toISOString()
            : new Date().toISOString(),
        "author": {
            "@type": "Person",
            "name": "Luis Viteri" // Tu nombre como autor
        },
        "description": blog.excerpt,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://luchodev.netlify.app/blog/${slug}`
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-10 mt-12 mb-8">
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
                />
            </Head>

            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
                {blog.title}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 text-center">
                Por Luis Viteri
            </p>

            <div className="space-y-6">
                {blog.blocks.map((block, index) => {
                    if (block.type === "text") {
                        return (
                            <div
                                key={index}
                                className="prose prose-lg dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: block.content || "" }}
                            />
                        );
                    }
                    if (block.type === "image") {
                        return (
                            <div key={index} className="flex justify-center">
                                {block.src && (
                                    <img
                                        src={block.src}
                                        alt={block.alt || `Imagen del blog ${index}`}
                                        className="rounded-lg shadow-md"
                                    />
                                )}
                            </div>
                        );
                    }
                    if (block.type === "video") {
                        return (
                            <div key={index} className="relative" style={{ paddingTop: "56.25%" }}>
                                {block.src && (
                                    <iframe
                                        src={block.src}
                                        title={`Video ${index}`}
                                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            <div className="author-bio mt-8 border-t border-gray-200 pt-4 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">
                    Escrito por <strong>Luis Viteri</strong>, desarrollador web Full-Stack. Puedes encontrarme en{" "}
                    <a href="https://www.linkedin.com/in/luisviteri/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Linkedin
                    </a>{" "}
                    y{" "}
                    <a href="https://github.com/LuchoProgramer" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        GitHub
                    </a>
                    .
                </p>
            </div>

            <Comments blogId={blog.id} />
        </div>
    );
};

export default BlogDetail;