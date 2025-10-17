import React, { useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { db } from "../../lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { generateSlug } from "../../utils/slugGenerator";
import { parseVideoUrl } from "@/utils/videoUtils";
import dynamic from "next/dynamic";

const ImageUploader = dynamic(() => import("../ImageUploader"), { ssr: false });
const VideoEmbedder = dynamic(() => import("../VideoEmbedder"), { ssr: false });
const RichTextEditor = dynamic(() => import("../RichTextEditor"), { ssr: false });

interface Block {
    type: "text" | "image" | "video";
    content?: string;
    src?: string;
    alt?: string;
}

const BlogCreate: React.FC = () => {
    const { user, isAdmin, loading } = useAdminAuth();
    const [title, setTitle] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageAlt, setImageAlt] = useState<string>("");

    const handleAddText = () => {
        setBlocks([...blocks, { type: "text", content: "" }]);
    };

    const handleAddVideo = async (url: string) => {
        try {
            const parsedUrl = await parseVideoUrl(url);
            if (parsedUrl) {
                setBlocks([...blocks, { type: "video", src: parsedUrl }]);
            } else {
                alert("La URL proporcionada no es válida o no es compatible.");
            }
        } catch (error) {
            console.error("Error procesando la URL del video:", error);
            alert("Ocurrió un error al procesar la URL del video.");
        }
    };

    const handleBlockChange = (index: number, updatedBlock: Block) => {
        const updatedBlocks = [...blocks];
        updatedBlocks[index] = updatedBlock;
        setBlocks(updatedBlocks);
    };

    const handleRemoveBlock = (index: number) => {
        setBlocks(blocks.filter((_, i) => i !== index));
    };

    const checkSlugExists = async (slug: string): Promise<boolean> => {
        const q = query(collection(db, "blogs"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || blocks.length === 0 || !author.trim()) {
            setError("Por favor, completa todos los campos y agrega al menos un bloque.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            let slug = generateSlug(title);

            if (await checkSlugExists(slug)) {
                slug = `${slug}-${Date.now()}`;
            }

            const firstImageBlock = blocks.find((block) => block.type === "image");
            const firstTextBlock = blocks.find((block) => block.type === "text");

            const image = firstImageBlock?.src || null;
            const excerpt =
                firstTextBlock?.content?.replace(/<[^>]*>?/gm, "").substring(0, 100) + "..." || "No hay contenido disponible.";

            await addDoc(collection(db, "blogs"), {
                title: title.trim(),
                slug,
                blocks,
                image,
                excerpt,
                createdAt: new Date(),
                author: {
                    name: author.trim(),
                },
            });

            alert("Blog creado exitosamente");
            setTitle("");
            setAuthor(""); // Limpiar el campo del autor
            setBlocks([]);
            setImageUrl("");
            setImageAlt("");
        } catch (err: unknown) {
            console.error("Error al crear el blog:", err);
            if (err instanceof Error) {
                setError(`Hubo un error al crear el blog: ${err.message}`);
            } else {
                setError("Hubo un error al crear el blog.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Cargando autenticación...</div>;
    }
    if (!user) {
        return (
            <div className="text-center py-12 text-red-500">
                Debes iniciar sesión para crear un blog.<br />
                <Link href="/" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Ir a la página principal</Link>
            </div>
        );
    }
    if (!isAdmin) {
        return (
            <div className="text-center py-12 text-red-500">
                No tienes permisos de administrador para crear blogs.<br />
                <Link href="/" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Ir a la página principal</Link>
            </div>
        );
    }
    // ...existing code...
    return (
        <div className="py-12 mt-6 max-w-4xl mx-auto p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Crear Nuevo Blog</h2>
            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
            <form onSubmit={handleCreate}>
                {/* ...existing code... */}
                {/* El resto del formulario permanece igual */}
                {/* ...existing code... */}
            </form>
        </div>
    // ...existing code...
    );
};

export default BlogCreate;