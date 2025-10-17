"use client";

import React, { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
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
    const { user, isAdmin, loading } = useAdminAuth();
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

    if (loading) {
        return <div className="text-center py-12">Cargando autenticación...</div>;
    }
    if (!user) {
        return <div className="text-center py-12 text-red-500">Debes iniciar sesión para editar un blog.</div>;
    }
    if (!isAdmin) {
        return <div className="text-center py-12 text-red-500">No tienes permisos de administrador para editar blogs.</div>;
    }
    // ...existing code...
    return (
        <div className="py-12 mt-6 max-w-4xl mx-auto p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                Editar Blog
            </h2>
            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
            <form onSubmit={handleSubmit}>
            </form>
        </div>
    );
};

export default BlogEdit;