"use client";

import React, { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useTenant } from "@/context/TenantContext";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db, updateBlog } from "@/lib/firebase";
import { parseVideoUrl } from "@/utils/videoUtils";
import { generateSlug } from "@/utils/slugGenerator";
import dynamic from "next/dynamic";

// UI Components
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useNotifications, NotificationContainer } from "@/components/ui/Notification";
import { useFormValidation, commonRules } from "@/hooks/useFormValidation";
import { AutoSaveStatus } from "@/components/ui/AutoSaveStatus";
import { ShortcutHelp } from "@/components/ui/ShortcutHelp";

// Advanced UX Hooks
import { useAutoSave } from "@/hooks/useAutoSave";
import { useBlogEditorShortcuts } from "@/hooks/useKeyboardShortcuts";

// Icons
import { 
    FiSave, 
    FiPlus, 
    FiTrash2, 
    FiImage, 
    FiVideo, 
    FiType, 
    FiArrowLeft, 
    FiClock, 
    FiUser, 
    FiEdit3, 
    FiInfo, 
    FiCalendar, 
    FiLink, 
    FiAlertTriangle, 
    FiLock, 
    FiShield 
} from "react-icons/fi";

// Dynamic imports
const RichTextEditor = dynamic(() => import("@/cms/RichTextEditor"), { ssr: false });
const ImageUploader = dynamic(() => import("@/cms/ImageUploader"), { ssr: false });
const OptimizedImage = dynamic(() => import("@/components/ui/OptimizedImage"), { ssr: false });

interface Block {
    type: "text" | "image" | "video";
    content?: string;
    src?: string;
    alt?: string;
}

interface BlogEditProps {
    params: {
        id: string;
    };
}

const BlogEdit = ({ params }: BlogEditProps) => {
    const { user, isAdmin, loading } = useAdminAuth();
    const { tenant } = useTenant();
    const router = useRouter();
    const { id } = params;
    const { notifications, removeNotification, showSuccess, showError } = useNotifications();

    // State
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageAlt, setImageAlt] = useState<string>("");
    const [originalSlug, setOriginalSlug] = useState<string>("");
    const [createdAt, setCreatedAt] = useState<Date | null>(null);
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

    // Form validation
    const validation = useFormValidation(
        {
            title: '',
            author: ''
        },
        {
            title: commonRules.title,
            author: commonRules.authorName
        }
    );

    // Auto-generate slug
    const [slugPreview, setSlugPreview] = useState<string>("");
    useEffect(() => {
        if (validation.fields.title.value) {
            const slug = generateSlug(validation.fields.title.value);
            setSlugPreview(slug);
        } else {
            setSlugPreview('');
        }
    }, [validation.fields.title.value]);

    // Handlers
    const handleAddText = () => {
        setBlocks([...blocks, { type: "text", content: "" }]);
    };

    const handleAddVideo = async (url: string) => {
        const parsedVideo = await parseVideoUrl(url);
        if (parsedVideo) {
            setBlocks([...blocks, { type: "video", src: url }]);
        } else {
            showError("URL de video no válida");
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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tenant?.id) {
            setError("No hay tenant configurado");
            showError("No hay tenant configurado");
            return;
        }

        if (!validation.isFormValid || blocks.length === 0) {
            let errorMessages: string[] = [];
            
            Object.entries(validation.fields).forEach(([fieldName, field]) => {
                if (field.error) {
                    errorMessages.push(`${fieldName}: ${field.error}`);
                }
            });
            
            if (blocks.length === 0) {
                errorMessages.push("Agrega al menos un bloque de contenido");
            }
            
            if (errorMessages.length > 0) {
                setError(errorMessages.join(', '));
                showError("Por favor, corrige los errores en el formulario");
            }
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const firstImageBlock = blocks.find((block) => block.type === "image");
            const firstTextBlock = blocks.find((block) => block.type === "text");

            const featuredImage = firstImageBlock?.src || imageUrl || null;
            const alt = firstImageBlock?.alt || imageAlt || "Imagen del blog";
            const excerpt = firstTextBlock?.content?.replace(/<[^>]*>?/gm, "").substring(0, 160) + "..." || "No hay contenido disponible.";

            const updatedData = {
                title: validation.fields.title.value.trim(),
                blocks,
                featuredImage,
                alt,
                excerpt,
                content: blocks.map(block => block.content || '').join(' '),
                author: {
                    name: validation.fields.author.value.trim(),
                    email: user?.email || '',
                    uid: user?.uid || ''
                },
                updatedAt: new Date(),
            };

            await updateBlog(tenant.id, id, updatedData);
            autoSave.markAsSaved(); // Marcar como guardado
            showSuccess("Blog actualizado exitosamente");
            router.push('/cms/blogs');
        } catch (error) {
            console.error("Error al actualizar el blog:", error);
            setError("Error al actualizar el blog");
            showError("Error al actualizar el blog");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-save functionality
    const autoSave = useAutoSave({
        interval: 30000, // 30 segundos
        enabled: true,
        onSave: async (data) => {
            if (!tenant?.id || !validation.isFormValid || blocks.length === 0) {
                throw new Error("No se puede auto-guardar: datos incompletos");
            }

            const firstImageBlock = blocks.find((block) => block.type === "image");
            const firstTextBlock = blocks.find((block) => block.type === "text");

            const featuredImage = firstImageBlock?.src || imageUrl || null;
            const alt = firstImageBlock?.alt || imageAlt || "Imagen del blog";
            const excerpt = firstTextBlock?.content?.replace(/<[^>]*>?/gm, "").substring(0, 160) + "..." || "No hay contenido disponible.";

            const updatedData = {
                title: validation.fields.title.value.trim(),
                blocks,
                featuredImage,
                alt,
                excerpt,
                content: blocks.map(block => block.content || '').join(' '),
                author: {
                    name: validation.fields.author.value.trim(),
                    email: user?.email || '',
                    uid: user?.uid || ''
                },
                updatedAt: new Date(),
                status: 'draft' // Auto-guardado siempre como borrador
            };

            await updateBlog(tenant.id, id, updatedData);
        },
        getData: () => ({
            title: validation.fields.title.value,
            author: validation.fields.author.value,
            blocks,
            imageUrl,
            imageAlt
        }),
        isValid: () => {
            return validation.fields.title.value.trim() !== '' && 
                   validation.fields.author.value.trim() !== '' && 
                   blocks.length > 0;
        }
    });

    // Keyboard shortcuts
    const shortcuts = useBlogEditorShortcuts({
        onSave: () => {
            if (validation.isFormValid && blocks.length > 0) {
                handleUpdate(new Event('submit') as any);
            }
        },
        onAddText: handleAddText,
        onAddImage: () => {
            // Simular click en botón de imagen
            const imageInput = document.createElement('input');
            imageInput.type = 'file';
            imageInput.accept = 'image/*';
            imageInput.click();
        },
        onAddVideo: async () => {
            const url = prompt("Ingresa la URL del video (YouTube, Vimeo, etc.):");
            if (url) await handleAddVideo(url);
        },
        enabled: true
    });

    // Marcar cambios cuando se modifica algo
    useEffect(() => {
        if (!isLoading) {
            autoSave.markAsChanged();
        }
    }, [validation.fields.title.value, validation.fields.author.value, blocks, imageUrl, imageAlt]);

    // Obtener atajos para mostrar en la ayuda
    const shortcutHelp = shortcuts.getShortcutsHelp();

    // Load blog data
    useEffect(() => {
        const fetchBlog = async () => {
            if (!tenant?.id) {
                setError("No hay tenant configurado");
                setIsLoading(false);
                return;
            }

            try {
                const blogDoc = await getDoc(doc(db, "tenants", tenant.id, "blogs", id));
                if (blogDoc.exists()) {
                    const blogData = blogDoc.data();
                    validation.updateField('title', blogData.title || "");
                    validation.updateField('author', blogData.author?.name || "");
                    setBlocks(blogData.blocks || []);
                    setImageUrl(blogData.featuredImage || blogData.image || "");
                    setImageAlt(blogData.alt || "");
                    setOriginalSlug(blogData.slug || "");
                    setCreatedAt(blogData.createdAt?.toDate() || null);
                    setUpdatedAt(blogData.updatedAt?.toDate() || null);
                } else {
                    setError("El blog no existe.");
                    showError("Blog no encontrado");
                }
            } catch (err: unknown) {
                console.error("Error al cargar el blog:", err);
                if (err instanceof Error) {
                    setError(`Error al cargar el blog: ${err.message}`);
                } else {
                    setError("Error al cargar el blog.");
                }
                showError("Error al cargar el blog");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlog();
    }, [tenant?.id, id]);

    // Loading and error states
    if (loading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Cargando editor de blog...</p>
                </div>
            </div>
        );
    }
    
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="p-8 text-center">
                    <FiLock className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Acceso Requerido
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Debes iniciar sesión para editar blogs.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/')}
                    >
                        Ir a la página principal
                    </Button>
                </Card>
            </div>
        );
    }
    
    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="p-8 text-center">
                    <FiShield className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Permisos Insuficientes
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        No tienes permisos de administrador para editar blogs.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/')}
                    >
                        Ir a la página principal
                    </Button>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                    <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error</h3>
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/cms/blogs/dashboard')}
                    >
                        Volver al Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <NotificationContainer notifications={notifications} onRemove={removeNotification} />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Editar Blog
                            </h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                Modifica el contenido y actualiza tu blog
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Auto-save status */}
                            <AutoSaveStatus
                                lastSaved={autoSave.lastSaved}
                                isSaving={autoSave.isSaving}
                                hasUnsavedChanges={autoSave.hasUnsavedChanges}
                                error={autoSave.error}
                                getLastSavedText={autoSave.getLastSavedText}
                            />
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => router.push('/cms/blogs')}
                            >
                                <FiArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Button>
                        </div>
                    </div>

                    {/* Tenant Info */}
                    {tenant && (
                        <Card className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <div className="flex items-center">
                                <FiInfo className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                                <div className="text-sm text-blue-800 dark:text-blue-200">
                                    <span className="font-medium">Tenant:</span> {tenant.name}
                                    {tenant.domain && (
                                        <>
                                            {" • "}
                                            <span className="font-medium">Dominio:</span> {tenant.domain}
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Blog Metadata */}
                    {(createdAt || updatedAt) && (
                        <Card className="mt-4 p-4 bg-gray-50 dark:bg-gray-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                                {createdAt && (
                                    <div className="flex items-center">
                                        <FiCalendar className="h-4 w-4 mr-2" />
                                        <span className="font-medium">Creado:</span>
                                        <span className="ml-1">{createdAt.toLocaleDateString()}</span>
                                    </div>
                                )}
                                {updatedAt && (
                                    <div className="flex items-center">
                                        <FiClock className="h-4 w-4 mr-2" />
                                        <span className="font-medium">Actualizado:</span>
                                        <span className="ml-1">{updatedAt.toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleUpdate} className="space-y-6">
                    {/* Información Básica */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <FiEdit3 className="h-5 w-5 mr-2" />
                                Información Básica
                            </h2>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Título */}
                                <div className="lg:col-span-2">
                                    <Input
                                        label="Título del Blog"
                                        placeholder="Ingresa un título atractivo para tu blog"
                                        required
                                        {...validation.getFieldProps('title')}
                                    />
                                    
                                    {/* Slug Preview */}
                                    {slugPreview && (
                                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                <FiLink className="h-4 w-4 mr-2" />
                                                <span className="font-medium">URL:</span>
                                                <span className="ml-2 font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded">
                                                    /blog/{slugPreview}
                                                </span>
                                            </div>
                                            {originalSlug && originalSlug !== slugPreview && (
                                                <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center">
                                                    <FiAlertTriangle className="h-3 w-3 mr-1" />
                                                    Cambiar el título modificará la URL del blog
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Autor */}
                                <div>
                                    <Input
                                        label="Autor"
                                        placeholder="Nombre del autor"
                                        required
                                        {...validation.getFieldProps('author')}
                                    />
                                </div>

                                {/* Imagen Principal */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Imagen Principal
                                    </label>
                                    <ImageUploader
                                        onUpload={(url: string, alt: string) => {
                                            setImageUrl(url);
                                            setImageAlt(alt);
                                        }}
                                        url={imageUrl}
                                        alt={imageAlt}
                                    />
                                    {imageUrl && (
                                        <div className="mt-4 space-y-3">
                                            <Input
                                                label="Texto alternativo"
                                                placeholder="Describe la imagen para accesibilidad"
                                                value={imageAlt}
                                                onChange={(e) => setImageAlt(e.target.value)}
                                            />
                                            
                                            {/* Preview optimizado */}
                                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Vista previa optimizada
                                                </label>
                                                <div className="max-w-md">
                                                    <OptimizedImage
                                                        src={imageUrl}
                                                        alt={imageAlt || "Imagen del blog"}
                                                        quality={80}
                                                        format="auto"
                                                        priority={false}
                                                        lazy={false}
                                                        showMetrics={true}
                                                        aspectRatio="16/9"
                                                        className="rounded border"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Esta vista muestra cómo se optimizará la imagen en el sitio web
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Bloques de Contenido */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <FiEdit3 className="h-5 w-5 mr-2" />
                                Contenido del Blog
                            </h2>

                            {/* Botones para agregar bloques */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleAddText}
                                >
                                    <FiPlus className="h-4 w-4 mr-2" />
                                    Agregar Texto
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={async () => {
                                        const url = prompt("Ingresa la URL del video (YouTube, Vimeo, etc.):");
                                        if (url) await handleAddVideo(url);
                                    }}
                                >
                                    <FiVideo className="h-4 w-4 mr-2" />
                                    Agregar Video
                                </Button>
                            </div>

                            {/* Lista de Bloques */}
                            {blocks.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                                    <FiEdit3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        Sin contenido
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Agrega bloques de texto o video para crear tu blog.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {blocks.map((block, index) => (
                                        <Card key={index} className="p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize flex items-center">
                                                    {block.type === 'text' && <FiType className="h-4 w-4 mr-2" />}
                                                    {block.type === 'image' && <FiImage className="h-4 w-4 mr-2" />}
                                                    {block.type === 'video' && <FiVideo className="h-4 w-4 mr-2" />}
                                                    Bloque {block.type}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleRemoveBlock(index)}
                                                >
                                                    <FiTrash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Contenido del bloque */}
                                            {block.type === "text" && (
                                                <RichTextEditor
                                                    value={block.content || ""}
                                                    onChange={(content) => handleBlockChange(index, { ...block, content })}
                                                />
                                            )}

                                            {block.type === "image" && (
                                                <ImageUploader
                                                    onUpload={(url: string, alt: string) => handleBlockChange(index, { ...block, src: url, alt })}
                                                    url={block.src || ""}
                                                    alt={block.alt || ""}
                                                />
                                            )}

                                            {block.type === "video" && block.src && (
                                                <div className="aspect-video">
                                                    <iframe
                                                        src={block.src}
                                                        className="w-full h-full rounded"
                                                        frameBorder="0"
                                                        allowFullScreen
                                                        title={`Video ${index + 1}`}
                                                    />
                                                </div>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Botón de envío */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={isSubmitting}
                            disabled={!validation.isFormValid || blocks.length === 0}
                        >
                            <FiSave className="h-5 w-5 mr-2" />
                            {isSubmitting ? 'Actualizando...' : 'Actualizar Blog'}
                        </Button>
                    </div>
                </form>
            </div>
            
            {/* Keyboard shortcuts help */}
            <ShortcutHelp shortcuts={shortcutHelp} />
        </div>
    );
};

export default BlogEdit;