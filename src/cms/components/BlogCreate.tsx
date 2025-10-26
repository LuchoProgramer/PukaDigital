import React, { useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { createBlog } from "@/lib/firebase";
import { useTenant } from "@/context/TenantContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateSlug } from "../../utils/slugGenerator";
import { parseVideoUrl } from "@/utils/videoUtils";
import dynamic from "next/dynamic";

// Importar componentes UI mejorados
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingSpinner";
import { ErrorState } from "@/components/ui/EmptyState";
import { useNotifications, NotificationContainer } from "@/components/ui/Notification";
import { useFormValidation, commonRules } from "@/hooks/useFormValidation";
import { AutoSaveStatus } from "@/components/ui/AutoSaveStatus";
import { ShortcutHelp } from "@/components/ui/ShortcutHelp";
import { DragHandle, DropZoneIndicator, DragPreview } from "@/components/ui/DragHandle";
import { ContentStats } from "@/components/ui/ContentStats";
import { ContentTemplateButton } from "@/components/ui/ContentTemplates";

// Advanced UX Hooks
import { useAutoSave } from "@/hooks/useAutoSave";
import { useBlogEditorShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";

import { FiSave, FiPlus, FiTrash2, FiEye, FiEdit, FiImage, FiVideo, FiType, FiCheck, FiArrowLeft } from "react-icons/fi";

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
    const { tenant } = useTenant();
    const { notifications, removeNotification, showSuccess, showError, showWarning } = useNotifications();
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [imageAlt, setImageAlt] = useState<string>("");
    const [slugPreview, setSlugPreview] = useState<string>("");

    // Validación del formulario
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

    // Auto-generar slug cuando cambia el título
    React.useEffect(() => {
        if (validation.fields.title.value) {
            const slug = generateSlug(validation.fields.title.value);
            setSlugPreview(slug);
        } else {
            setSlugPreview('');
        }
    }, [validation.fields.title.value]);

    const handleAddText = () => {
        setBlocks([...blocks, { type: "text", content: "" }]);
    };

    const handleAddVideo = async (url: string) => {
        try {
            const parsedUrl = await parseVideoUrl(url);
            if (parsedUrl) {
                setBlocks([...blocks, { type: "video", src: parsedUrl }]);
                showSuccess("Video agregado", "El video se ha agregado exitosamente");
            } else {
                showError("URL inválida", "La URL proporcionada no es válida o no es compatible");
            }
        } catch (error) {
            console.error("Error procesando la URL del video:", error);
            showError("Error", "Ocurrió un error al procesar la URL del video");
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

    const handleApplyTemplate = (template: any) => {
        // Aplicar metadatos de la plantilla
        if (template.metadata?.suggestedTitle) {
            validation.updateField('title', template.metadata.suggestedTitle);
        }
        if (template.metadata?.suggestedExcerpt) {
            validation.updateField('excerpt', template.metadata.suggestedExcerpt);
        }
        
        // Aplicar bloques de la plantilla
        const newBlocks = template.blocks.map((block: any) => ({
            type: block.type,
            content: block.content || '',
            src: block.src || '',
            alt: block.alt || block.placeholder || ''
        }));
        
        setBlocks(newBlocks);
        autoSave.markAsChanged();
        showSuccess("Plantilla aplicada", "La plantilla se ha aplicado correctamente. Personaliza el contenido según tus necesidades.");
    };

    // Auto-save functionality (solo guardar borrador)
    const autoSave = useAutoSave({
        interval: 30000, // 30 segundos
        enabled: true,
        onSave: async (data) => {
            if (!tenant?.id || !validation.isFormValid || blocks.length === 0) {
                throw new Error("No se puede auto-guardar: datos incompletos");
            }

            // Verificar si ya existe un borrador con este título
            const existingDrafts = query(
                collection(db, "tenants", tenant.id, "blogs"),
                where("title", "==", validation.fields.title.value.trim()),
                where("status", "==", "draft")
            );
            
            const draftSnapshot = await getDocs(existingDrafts);
            
            if (draftSnapshot.empty) {
                // Crear nuevo borrador
                const firstImageBlock = blocks.find((block) => block.type === "image");
                const firstTextBlock = blocks.find((block) => block.type === "text");

                const featuredImage = firstImageBlock?.src || imageUrl || null;
                const alt = firstImageBlock?.alt || imageAlt || "Imagen del blog";
                const excerpt = firstTextBlock?.content?.replace(/<[^>]*>?/gm, "").substring(0, 160) + "..." || "No hay contenido disponible.";

                const blogData = {
                    title: validation.fields.title.value.trim(),
                    slug: generateSlug(validation.fields.title.value),
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
                    status: 'draft',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    tenantId: tenant.id
                };

                await createBlog(tenant.id, blogData);
            }
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
                // Activar auto-guardado manual
                autoSave.saveNow();
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
    React.useEffect(() => {
        autoSave.markAsChanged();
    }, [validation.fields.title.value, validation.fields.author.value, blocks, imageUrl, imageAlt]);

    // Obtener atajos para mostrar en la ayuda
    const shortcutHelp = shortcuts.getShortcutsHelp();

    // Drag and drop functionality
    const dragAndDrop = useDragAndDrop({
        items: blocks,
        onReorder: (newBlocks) => {
            setBlocks(newBlocks);
            autoSave.markAsChanged();
        },
        enabled: true
    });

    const checkSlugExists = async (slug: string): Promise<boolean> => {
        if (!tenant?.id) return false;
        
        const q = query(
            collection(db, "tenants", tenant.id, "blogs"), 
            where("slug", "==", slug)
        );
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tenant?.id) {
            showError("Error", "No hay tenant configurado");
            return;
        }

        if (!validation.validateAllFields()) {
            showError("Error de validación", "Por favor, corrige los errores en el formulario");
            return;
        }

        if (blocks.length === 0) {
            showError("Contenido requerido", "Agrega al menos un bloque de contenido");
            return;
        }

        setIsSubmitting(true);

        try {
            let slug = slugPreview;

            if (await checkSlugExists(slug)) {
                slug = `${slug}-${Date.now()}`;
                showWarning("Slug modificado", "El slug ya existía, se ha modificado automáticamente");
            }

            const firstImageBlock = blocks.find((block) => block.type === "image");
            const firstTextBlock = blocks.find((block) => block.type === "text");

            const image = firstImageBlock?.src || imageUrl || null;
            const alt = firstImageBlock?.alt || imageAlt || "Imagen del blog";
            const excerpt =
                firstTextBlock?.content?.replace(/<[^>]*>?/gm, "").substring(0, 100) + "..." || "No hay contenido disponible.";

            const blogData = {
                title: validation.fields.title.value.trim(),
                slug,
                blocks,
                image,
                alt,
                excerpt,
                content: blocks.map(block => block.content || '').join(' '),
                createdAt: new Date(),
                author: {
                    name: validation.fields.author.value.trim(),
                },
                tenantId: tenant.id,
            };

            await createBlog(tenant.id, blogData);

            showSuccess("Blog creado", "El blog se ha creado exitosamente");
            validation.resetForm();
            setBlocks([]);
            setImageUrl("");
            setImageAlt("");
        } catch (err: unknown) {
            console.error("Error al crear el blog:", err);
            if (err instanceof Error) {
                showError("Error al crear blog", `Hubo un error: ${err.message}`);
            } else {
                showError("Error", "Hubo un error al crear el blog");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <LoadingState 
                    title="Cargando editor"
                    description="Verificando permisos y configurando el editor..."
                    size="lg"
                />
            </div>
        );
    }
    
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
                <Card className="max-w-md w-full text-center">
                    <CardContent>
                        <div className="text-red-500 text-6xl mb-4">🚫</div>
                        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                            Acceso requerido
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Debes iniciar sesión para crear un blog.
                        </p>
                        <Button as={Link} href="/" fullWidth>
                            Ir a la página principal
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
                <Card className="max-w-md w-full text-center">
                    <CardContent>
                        <div className="text-orange-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">
                            Permisos insuficientes
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            No tienes permisos de administrador para crear blogs.
                        </p>
                        <Button as={Link} href="/" fullWidth>
                            Ir a la página principal
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!tenant) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
                <Card className="max-w-md w-full text-center">
                    <CardContent>
                        <div className="text-yellow-500 text-6xl mb-4">🏢</div>
                        <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
                            Sin tenant configurado
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            No hay tenant configurado para crear blogs.
                        </p>
                        <Button as={Link} href="/cms/blogs/dashboard" fullWidth>
                            Ir al Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Crear Nuevo Blog
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Crea contenido para tu tenant: <span className="font-semibold">{tenant.name}</span>
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <AutoSaveStatus 
                                    lastSaved={autoSave.lastSaved}
                                    isSaving={autoSave.isSaving}
                                    hasUnsavedChanges={autoSave.hasUnsavedChanges}
                                    error={autoSave.error}
                                    getLastSavedText={autoSave.getLastSavedText}
                                />
                                <ShortcutHelp shortcuts={shortcutHelp} />
                                <Button
                                    as={Link}
                                    href="/cms/blogs"
                                    variant="outline"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>

                        {/* Tenant Info Card */}
                        <Card className="mt-6">
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {tenant.name}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Tenant
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                                            {tenant.subscription}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Plan
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                            {slugPreview || 'slug-del-blog'}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Slug (URL)
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleCreate} className="space-y-8">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FiEdit className="text-blue-500" />
                                    Información Básica
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Input
                                    {...validation.getFieldProps('title')}
                                    label="Título del Blog"
                                    placeholder="Escribe un título atractivo para tu blog"
                                    helperText={`${validation.fields.title.value.length}/100 caracteres. Recomendado: 50-60 para SEO`}
                                    fullWidth
                                    required
                                />

                                <Input
                                    {...validation.getFieldProps('author')}
                                    label="Autor"
                                    placeholder="Nombre del autor del blog"
                                    fullWidth
                                    required
                                />

                                {/* Imagen principal */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Imagen Principal (Opcional)
                                    </label>
                                    <Card padding="sm" className="bg-gray-50 dark:bg-gray-700">
                                        <ImageUploader
                                            onUpload={(url: string, alt: string) => {
                                                setImageUrl(url);
                                                setImageAlt(alt);
                                            }}
                                            url={imageUrl}
                                            alt={imageAlt}
                                        />
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Content Statistics */}
                        <ContentStats 
                            blocks={blocks}
                            title={validation.fields.title.value}
                            excerpt={validation.fields.excerpt.value}
                        />

                        {/* Content Blocks */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-2">
                                        <FiType className="text-green-500" />
                                        Contenido del Blog
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <ContentTemplateButton 
                                            onSelectTemplate={handleApplyTemplate}
                                            variant="secondary"
                                            size="sm"
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleAddText}
                                            size="sm"
                                            leftIcon={<FiType />}
                                        >
                                            Texto
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                const url = prompt("Ingresa la URL del video (YouTube, Vimeo, etc.):");
                                                if (url) handleAddVideo(url);
                                            }}
                                            size="sm"
                                            variant="success"
                                            leftIcon={<FiVideo />}
                                        >
                                            Video
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {blocks.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                        <FiType className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                            Sin contenido
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                                            Agrega bloques de texto, imágenes o videos para crear tu contenido
                                        </p>
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                type="button"
                                                onClick={handleAddText}
                                                leftIcon={<FiType />}
                                            >
                                                Agregar Texto
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    const url = prompt("Ingresa la URL del video:");
                                                    if (url) handleAddVideo(url);
                                                }}
                                                variant="success"
                                                leftIcon={<FiVideo />}
                                            >
                                                Agregar Video
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {blocks.map((block, index) => (
                                            <div
                                                key={index}
                                                {...dragAndDrop.getDropProps(index)}
                                                className={`relative transition-all duration-200 ${
                                                    dragAndDrop.dragOverIndex === index 
                                                        ? 'transform scale-105 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-2' 
                                                        : ''
                                                }`}
                                            >
                                                <DropZoneIndicator 
                                                    isActive={dragAndDrop.dragOverIndex === index}
                                                    position="top"
                                                />
                                                
                                                <DragPreview isDragging={dragAndDrop.draggedItem?.index === index}>
                                                    <Card 
                                                        {...dragAndDrop.getDragProps(index, block.type, `block-${index}`)}
                                                        className={`relative transition-all duration-200 ${
                                                            dragAndDrop.draggedItem?.index === index 
                                                                ? 'shadow-lg border-blue-300' 
                                                                : 'hover:shadow-md'
                                                        }`}
                                                    >
                                                        <CardHeader>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-3">
                                                                    <DragHandle size="md" />
                                                                    {block.type === "text" && <><FiType /> Bloque de Texto {index + 1}</>}
                                                                    {block.type === "image" && <><FiImage /> Bloque de Imagen {index + 1}</>}
                                                                    {block.type === "video" && <><FiVideo /> Bloque de Video {index + 1}</>}
                                                                </span>
                                                        <Button
                                                            type="button"
                                                            onClick={() => handleRemoveBlock(index)}
                                                            size="sm"
                                                            variant="danger"
                                                            leftIcon={<FiTrash2 />}
                                                        >
                                                            Eliminar
                                                        </Button>
                                                    </div>
                                                </CardHeader>

                                                <CardContent>
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
                                                </CardContent>
                                            </Card>
                                                </DragPreview>
                                                
                                                <DropZoneIndicator 
                                                    isActive={dragAndDrop.dragOverIndex === index}
                                                    position="bottom"
                                                />
                                        </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Submit Actions */}
                        <Card>
                            <CardContent>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        as={Link}
                                        href="/cms/blogs"
                                        variant="outline"
                                        className="min-w-32"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        loading={isSubmitting}
                                        disabled={!validation.isFormValid || blocks.length === 0}
                                        leftIcon={<FiCheck />}
                                        className="min-w-32"
                                    >
                                        {isSubmitting ? "Creando..." : "Crear Blog"}
                                    </Button>
                                </div>
                                
                                {!validation.isFormValid && (
                                    <p className="text-center text-sm text-gray-500 mt-2">
                                        Completa todos los campos requeridos para continuar
                                    </p>
                                )}
                                
                                {blocks.length === 0 && validation.isFormValid && (
                                    <p className="text-center text-sm text-orange-600 dark:text-orange-400 mt-2">
                                        Agrega al menos un bloque de contenido
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>

            {/* Notificaciones */}
            <NotificationContainer
                notifications={notifications}
                onRemove={removeNotification}
                position="top-right"
            />
        </>
    );
};

export default BlogCreate;