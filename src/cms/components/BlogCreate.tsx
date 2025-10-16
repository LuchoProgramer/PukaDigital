import React, { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { generateSlug } from "../../utils/slugGenerator";
import { parseVideoUrl } from "../../utils/videoUtils";
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

    return (
        <div className="py-12 mt-6 max-w-4xl mx-auto p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Crear Nuevo Blog</h2>
            {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
            <form onSubmit={handleCreate}>
                <div className="mb-6">
                    <label htmlFor="title" className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
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

                <div className="mb-6">
                    <label htmlFor="author" className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
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
                            className="relative border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 w-full"
                        >
                            <button
                                type="button"
                                onClick={() => handleRemoveBlock(index)}
                                className="absolute top-0 right-0 m-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs z-10"
                            >
                                X
                            </button>

                            <div className="p-4">
                                {block.type === "text" && (
                                    <div className="w-full">
                                        <RichTextEditor
                                            value={block.content || ""}
                                            onChange={(content) => handleBlockChange(index, { ...block, content })}
                                        />
                                    </div>
                                )}
                                {block.type === "image" && (
                                    <img
                                        src={block.src || ""}
                                        alt={block.alt || "Imagen"}
                                        className="max-w-full h-40 object-contain rounded"
                                    />
                                )}
                                {block.type === "video" && (
                                    <iframe
                                        src={block.src || ""}
                                        className="w-full h-40 rounded"
                                        allowFullScreen
                                        title={`Video ${index}`}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex-1 flex flex-col justify-between items-center">
                        <div className="h-10 w-full bg-transparent"></div>
                        <button
                            type="button"
                            onClick={handleAddText}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-center"
                        >
                            Agregar Texto
                        </button>
                    </div>
                    <div className="flex-1">
                        <ImageUploader
                            url={imageUrl}
                            alt={imageAlt}
                            onUpload={(url: string, alt: string) => {
                                setImageUrl(url);
                                setImageAlt(alt);
                                setBlocks((prevBlocks) => [...prevBlocks, { type: "image", src: url, alt }]);
                            }}
                        />
                    </div>
                    <div className="flex-1">
                        <VideoEmbedder onEmbed={handleAddVideo} />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-6 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                        }`}
                >
                    {isSubmitting ? "Guardando..." : "Crear Blog"}
                </button>
            </form>
        </div>
    );
};

export default BlogCreate;