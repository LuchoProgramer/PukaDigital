"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import RichTextEditor from "@/cms/RichTextEditor";
import ImageUploader from "@/cms/ImageUploader";
import VideoEmbedder from "@/cms/VideoEmbedder";

interface Block {
    type: "text" | "image" | "video";
    content?: string;
    src?: string;
    alt?: string;
}

interface BlogEditProps {
    params: { id: string };
}

const BlogEdit = ({ params }: BlogEditProps) => {
    const router = useRouter();
    const { id } = params;

    const [title, setTitle] = useState<string>("");
    const [author, setAuthor] = useState<string>(""); // Estado para el autor
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageAlt, setImageAlt] = useState<string>("");

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const blogDoc = await getDoc(doc(db, "blogs", id));
                if (blogDoc.exists()) {
                    const blogData = blogDoc.data();
                    setTitle(blogData.title || "");
                    setAuthor(blogData.author?.name || ""); // Obtener el nombre del autor
                    setBlocks(blogData.blocks || []);
                } else {
                    setError("El blog no existe.");
                }
            } catch (err: unknown) {
                console.error("Error al cargar el blog:", err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Error al cargar el blog.");
                }
            }
        };

        fetchBlog();
    }, [id]);

    const handleAddText = () => {
        setBlocks([...blocks, { type: "text", content: "" }]);
    };

    const handleAddImage = (url: string, alt: string) => {
        setBlocks([...blocks, { type: "image", src: url, alt }]);
    };

    const handleAddVideo = (url: string) => {
        setBlocks([...blocks, { type: "video", src: url }]);
    };

    const handleBlockChange = (index: number, updatedBlock: Block) => {
        const updatedBlocks = [...blocks];
        updatedBlocks[index] = updatedBlock;
        setBlocks(updatedBlocks);
    };

    const handleRemoveBlock = (index: number) => {
        setBlocks(blocks.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || blocks.length === 0 || !author.trim()) {
            setError("Por favor, completa todos los campos y agrega al menos un bloque.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            await updateDoc(doc(db, "blogs", id), {
                title: title.trim(),
                blocks,
                author: { name: author.trim() }, // Actualizar el autor
                updatedAt: new Date(),
            });

            alert("Blog actualizado exitosamente");
            router.push(`/blog/${id}`);
        } catch (err: unknown) {
            console.error("Error al actualizar el blog:", err);
            if (err instanceof Error) {
                setError(`Hubo un error al actualizar el blog: ${err.message}`);
            } else {
                setError("Hubo un error al actualizar el blog.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="py-12 mt-6 max-w-4xl mx-auto p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                Editar Blog
            </h2>
            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label
                        htmlFor="title"
                        className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                    >
                        Título
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Título del blog"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
                        required
                    />
                </div>

                <div className="mb-6"> {/* Campo de entrada para el autor */}
                    <label
                        htmlFor="author"
                        className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                    >
                        Autor
                    </label>
                    <input
                        id="author"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Nombre del autor"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
                        required
                    />
                </div>

                <div className="mb-6 space-y-4">
                    {blocks.map((block, index) => (
                        <div
                            key={index}
                            className="relative p-8 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700"
                        >
                            <button
                                type="button"
                                onClick={() => handleRemoveBlock(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10"
                            >
                                X
                            </button>
                            {block.type === "text" && (
                                <RichTextEditor
                                    value={block.content || ""}
                                    onChange={(content) =>
                                        handleBlockChange(index, { ...block, content })
                                    }
                                />
                            )}
                            {block.type === "image" && (
                                <div>
                                    <img
                                        src={block.src || ""}
                                        alt={block.alt || "Imagen"}
                                        className="max-w-full h-auto rounded"
                                    />
                                    <input
                                        type="text"
                                        value={block.alt || ""}
                                        onChange={(e) =>
                                            handleBlockChange(index, { ...block, alt: e.target.value })
                                        }
                                        placeholder="Descripción de la imagen"
                                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            )}
                            {block.type === "video" && (
                                <iframe
                                    src={block.src || ""}
                                    className="w-full h-auto rounded"
                                    allowFullScreen
                                    title={`Video ${index}`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        type="button"
                        onClick={handleAddText}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Agregar Texto
                    </button>
                    <ImageUploader
                        url={imageUrl}
                        alt={imageAlt}
                        onUpload={(url: string, alt: string) => {
                            setImageUrl(url);
                            setImageAlt(alt);
                            handleAddImage(url, alt);
                        }}
                    />
                    <VideoEmbedder onEmbed={handleAddVideo} />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-6 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                        }`}
                >
                    {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </button>
            </form>
        </div>
    );
};

export default BlogEdit;