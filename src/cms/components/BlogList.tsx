"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useTenant } from "@/context/TenantContext";
import { useRouter } from "next/navigation";
import { getBlogs, deleteBlog } from "@/lib/firebase";
import { Blog } from "@/types";

// Importar componentes UI mejorados
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingSpinner";
import { ErrorState, NoDataState } from "@/components/ui/EmptyState";
import { useNotifications, NotificationContainer } from "@/components/ui/Notification";
import { AutoSaveStatus } from "@/components/ui/AutoSaveStatus";
import { ShortcutHelp } from "@/components/ui/ShortcutHelp";

// Hooks avanzados
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAutoSave } from "@/hooks/useAutoSave";

import { 
  FiEdit, FiTrash2, FiEye, FiImage, FiCalendar, FiUser, FiPlus, FiRefreshCw,
  FiSearch, FiFilter, FiChevronDown, FiGrid, FiList, FiCheckSquare, FiSquare,
  FiMoreHorizontal, FiCopy, FiDownload, FiShare2, FiSettings, FiCommand
} from "react-icons/fi";

// Tipos para filtros y ordenamiento
type SortOption = 'newest' | 'oldest' | 'title' | 'author';
type ViewMode = 'grid' | 'list';
type FilterOption = 'all' | 'recent' | 'drafts' | 'published';

interface BlogListState {
  searchTerm: string;
  sortBy: SortOption;
  filterBy: FilterOption;
  viewMode: ViewMode;
  selectedBlogs: Set<string>;
  showBulkActions: boolean;
}

const BlogList: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [deletingId, setDeletingId] = useState<string>("");
    const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
    
    // Estado avanzado para funcionalidades UX
    const [listState, setListState] = useState<BlogListState>({
      searchTerm: '',
      sortBy: 'newest',
      filterBy: 'all',
      viewMode: 'grid',
      selectedBlogs: new Set(),
      showBulkActions: false
    });

    const { tenant } = useTenant();
    const router = useRouter();
    const { notifications, removeNotification, showSuccess, showError } = useNotifications();

    // Auto-save para configuración de vista
    const { saveNow, isSaving, hasUnsavedChanges, lastSaved } = useAutoSave({
      onSave: useCallback(async () => {
        // Guardar preferencias en localStorage
        localStorage.setItem('blogListPreferences', JSON.stringify({
          sortBy: listState.sortBy,
          filterBy: listState.filterBy,
          viewMode: listState.viewMode
        }));
      }, [listState]),
      getData: useCallback(() => listState, [listState]),
      interval: 2000, // Guardar cada 2 segundos
      enabled: true
    });

    // Funciones para manejar acciones
    const handleCreateNew = useCallback(() => {
      router.push('/cms/blogs/create');
    }, [router]);

    const handleRefresh = useCallback(() => {
      fetchBlogs();
    }, []);

    const handleSearch = useCallback((term: string) => {
      setListState(prev => ({ ...prev, searchTerm: term }));
    }, []);

    const handleToggleView = useCallback(() => {
      setListState(prev => ({ 
        ...prev, 
        viewMode: prev.viewMode === 'grid' ? 'list' : 'grid' 
      }));
      saveNow();
    }, [saveNow]);

    const handleSelectAll = useCallback(() => {
      const allIds = new Set(blogs.map(blog => blog.id).filter(Boolean) as string[]);
      setListState(prev => ({
        ...prev,
        selectedBlogs: prev.selectedBlogs.size === allIds.size ? new Set() : allIds,
        showBulkActions: prev.selectedBlogs.size !== allIds.size
      }));
    }, [blogs]);

    const handleToggleSelect = useCallback((blogId: string) => {
      setListState(prev => {
        const newSelected = new Set(prev.selectedBlogs);
        if (newSelected.has(blogId)) {
          newSelected.delete(blogId);
        } else {
          newSelected.add(blogId);
        }
        return {
          ...prev,
          selectedBlogs: newSelected,
          showBulkActions: newSelected.size > 0
        };
      });
    }, []);

    const handleBulkDelete = useCallback(async () => {
      if (listState.selectedBlogs.size === 0) return;
      
      const confirmMessage = `¿Estás seguro de que deseas eliminar ${listState.selectedBlogs.size} blog(s)?`;
      if (!confirm(confirmMessage)) return;

      try {
        const deletePromises = Array.from(listState.selectedBlogs).map(blogId => 
          deleteBlog(tenant?.id || '', blogId)
        );
        
        await Promise.all(deletePromises);
        
        setBlogs(prev => prev.filter(blog => !listState.selectedBlogs.has(blog.id || '')));
        setListState(prev => ({ 
          ...prev, 
          selectedBlogs: new Set(), 
          showBulkActions: false 
        }));
        
        showSuccess("Blogs eliminados", `${listState.selectedBlogs.size} blog(s) eliminados exitosamente`);
      } catch (error) {
        showError("Error", "No se pudieron eliminar algunos blogs");
      }
    }, [listState.selectedBlogs, tenant?.id, showSuccess, showError]);

    // Configurar keyboard shortcuts
    useKeyboardShortcuts({
      shortcuts: [
        { key: 'n', cmd: true, action: handleCreateNew, description: 'Crear nuevo blog' },
        { key: 'r', cmd: true, action: handleRefresh, description: 'Actualizar lista' },
        { key: 'f', cmd: true, action: () => document.getElementById('search-input')?.focus(), description: 'Buscar blogs' },
        { key: 'a', cmd: true, action: handleSelectAll, description: 'Seleccionar todos' },
        { key: 'v', cmd: true, action: handleToggleView, description: 'Cambiar vista' },
        { key: '/', action: () => setShowShortcuts(true), description: 'Mostrar atajos' },
        { key: 'Escape', action: () => setShowShortcuts(false), description: 'Cerrar ayuda' }
      ],
      enabled: true
    });

    // Shortcut adicional para eliminar cuando hay selección
    useKeyboardShortcuts({
      shortcuts: [
        { key: 'Delete', action: handleBulkDelete, description: 'Eliminar seleccionados' }
      ],
      enabled: listState.selectedBlogs.size > 0
    });

    // Cargar preferencias guardadas al inicializar
    useEffect(() => {
      const savedPrefs = localStorage.getItem('blogListPreferences');
      if (savedPrefs) {
        try {
          const prefs = JSON.parse(savedPrefs);
          setListState(prev => ({
            ...prev,
            sortBy: prefs.sortBy || 'newest',
            filterBy: prefs.filterBy || 'all',
            viewMode: prefs.viewMode || 'grid'
          }));
        } catch (error) {
          console.warn('Error loading blog list preferences:', error);
        }
      }
    }, []);

    // Blogs filtrados y ordenados
    const filteredAndSortedBlogs = useMemo(() => {
      let filtered = [...blogs];

      // Aplicar filtro de búsqueda
      if (listState.searchTerm) {
        const searchLower = listState.searchTerm.toLowerCase();
        filtered = filtered.filter(blog => 
          blog.title.toLowerCase().includes(searchLower) ||
          blog.excerpt?.toLowerCase().includes(searchLower) ||
          blog.author?.name.toLowerCase().includes(searchLower)
        );
      }

      // Aplicar filtro por categoría
      switch (listState.filterBy) {
        case 'recent':
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          filtered = filtered.filter(blog => 
            blog.createdAt && new Date(blog.createdAt) > weekAgo
          );
          break;
        case 'drafts':
          // En el futuro cuando tengamos status de draft
          break;
        case 'published':
          // En el futuro cuando tengamos status de published
          break;
        case 'all':
        default:
          // Mostrar todos
          break;
      }

      // Aplicar ordenamiento
      switch (listState.sortBy) {
        case 'newest':
          filtered.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
          break;
        case 'oldest':
          filtered.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateA - dateB;
          });
          break;
        case 'title':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'author':
          filtered.sort((a, b) => {
            const authorA = a.author?.name || '';
            const authorB = b.author?.name || '';
            return authorA.localeCompare(authorB);
          });
          break;
        default:
          break;
      }

      return filtered;
    }, [blogs, listState.searchTerm, listState.filterBy, listState.sortBy]);

    const fetchBlogs = async () => {
        if (!tenant?.id) {
            setError("No hay tenant seleccionado");
            setLoading(false);
            return;
        }

        try {
            setError("");
            setLoading(true);
            const blogsData = await getBlogs(tenant.id, 50);
            setBlogs(blogsData);
        } catch (error) {
            console.error("Error al obtener los blogs:", error);
            setError("Error al cargar los blogs");
            showError("Error al cargar blogs", "No se pudieron cargar los blogs. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [tenant]);

    const handleDelete = async (id: string, title: string) => {
        if (!tenant?.id) {
            showError("Error", "No hay tenant seleccionado");
            return;
        }

        if (!confirm(`¿Estás seguro de que deseas eliminar "${title}"?`)) {
            return;
        }

        setDeletingId(id);

        try {
            await deleteBlog(tenant.id, id);
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
            showSuccess("Blog eliminado", `"${title}" ha sido eliminado exitosamente`);
        } catch (error) {
            console.error("Error al eliminar el blog:", error);
            showError("Error al eliminar", "No se pudo eliminar el blog. Inténtalo de nuevo.");
        } finally {
            setDeletingId("");
        }
    };

    const handleEdit = (id?: string) => {
        if (!id) return;
        router.push(`/cms/blogs/edit/${id}`);
    };

    const handleView = (slug: string) => {
        // En el futuro, esto podría abrir una vista previa o ir al blog público
        router.push(`/blog/${slug}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
                <LoadingState 
                    title="Cargando blogs"
                    description="Obteniendo la lista de blogs de tu tenant..."
                    size="lg"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
                <ErrorState 
                    title="Error al cargar blogs"
                    description={error}
                    onRetry={fetchBlogs}
                />
            </div>
        );
    }

    if (!tenant) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
                <ErrorState 
                    title="Sin tenant configurado"
                    description="No hay tenant configurado para mostrar blogs"
                />
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Lista de Blogs
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Administra el contenido de tu tenant: <span className="font-semibold">{tenant.name}</span>
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleRefresh}
                                    variant="outline"
                                    leftIcon={<FiRefreshCw />}
                                    disabled={loading}
                                >
                                    Actualizar
                                </Button>
                                <Button
                                    onClick={handleCreateNew}
                                    leftIcon={<FiPlus />}
                                >
                                    Crear Blog
                                </Button>
                                <Button
                                    onClick={() => setShowShortcuts(true)}
                                    variant="outline"
                                    leftIcon={<FiCommand />}
                                    size="sm"
                                >
                                    Atajos
                                </Button>
                            </div>
                        </div>

                        {/* Barra de búsqueda y controles */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-6">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="search-input"
                                        placeholder="Buscar blogs por título, contenido o autor..."
                                        value={listState.searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {/* Filtro */}
                                <div className="relative">
                                    <select 
                                        value={listState.filterBy}
                                        onChange={(e) => setListState(prev => ({ 
                                          ...prev, 
                                          filterBy: e.target.value as FilterOption 
                                        }))}
                                        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">Todos</option>
                                        <option value="recent">Recientes (7 días)</option>
                                        <option value="published">Publicados</option>
                                        <option value="drafts">Borradores</option>
                                    </select>
                                    <FiFilter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                </div>

                                {/* Ordenamiento */}
                                <div className="relative">
                                    <select 
                                        value={listState.sortBy}
                                        onChange={(e) => setListState(prev => ({ 
                                          ...prev, 
                                          sortBy: e.target.value as SortOption 
                                        }))}
                                        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="newest">Más reciente</option>
                                        <option value="oldest">Más antiguo</option>
                                        <option value="title">Título (A-Z)</option>
                                        <option value="author">Autor</option>
                                    </select>
                                    <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                </div>

                                {/* Vista */}
                                <Button
                                    onClick={handleToggleView}
                                    variant="outline"
                                    size="sm"
                                    leftIcon={listState.viewMode === 'grid' ? <FiList /> : <FiGrid />}
                                >
                                    {listState.viewMode === 'grid' ? 'Lista' : 'Grid'}
                                </Button>
                            </div>
                        </div>

                        {/* Acciones masivas */}
                        {listState.showBulkActions && (
                            <Card className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Button
                                                onClick={handleSelectAll}
                                                variant="outline"
                                                size="sm"
                                                leftIcon={
                                                  listState.selectedBlogs.size === blogs.length ? 
                                                    <FiCheckSquare /> : <FiSquare />
                                                }
                                            >
                                                {listState.selectedBlogs.size === blogs.length ? 
                                                  'Deseleccionar todos' : 'Seleccionar todos'}
                                            </Button>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {listState.selectedBlogs.size} blog(s) seleccionado(s)
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleBulkDelete}
                                                variant="danger"
                                                size="sm"
                                                leftIcon={<FiTrash2 />}
                                                disabled={listState.selectedBlogs.size === 0}
                                            >
                                                Eliminar seleccionados
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                leftIcon={<FiCopy />}
                                                disabled={listState.selectedBlogs.size === 0}
                                            >
                                                Duplicar
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                leftIcon={<FiDownload />}
                                                disabled={listState.selectedBlogs.size === 0}
                                            >
                                                Exportar
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Auto-save status */}
                        <div className="mt-4">
                            <AutoSaveStatus
                                isSaving={isSaving}
                                hasUnsavedChanges={hasUnsavedChanges}
                                lastSaved={lastSaved}
                                error={null}
                                getLastSavedText={() => lastSaved ? `Guardado ${lastSaved.toLocaleTimeString()}` : 'Nunca guardado'}
                                className="text-xs"
                            />
                        </div>

                        {/* Stats Card */}
                        <Card className="mt-6">
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <div className="text-center p-4">
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {filteredAndSortedBlogs.length}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {listState.searchTerm || listState.filterBy !== 'all' ? 'Filtrados' : 'Total blogs'}
                                        </div>
                                    </div>
                                    <div className="text-center p-4">
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {blogs.length}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Total de blogs
                                        </div>
                                    </div>
                                    <div className="text-center p-4">
                                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                            {listState.selectedBlogs.size}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Seleccionados
                                        </div>
                                    </div>
                                    <div className="text-center p-4">
                                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                            {tenant?.subscription || 'FREE'}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Plan actual
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Content */}
                    {filteredAndSortedBlogs.length === 0 ? (
                        listState.searchTerm || listState.filterBy !== 'all' ? (
                            <div className="text-center py-12">
                                <FiSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No se encontraron blogs
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    No hay blogs que coincidan con tu búsqueda o filtros.
                                </p>
                                <Button
                                    onClick={() => setListState(prev => ({ 
                                      ...prev, 
                                      searchTerm: '', 
                                      filterBy: 'all' 
                                    }))}
                                    variant="outline"
                                >
                                    Limpiar filtros
                                </Button>
                            </div>
                        ) : (
                            <NoDataState
                                resource="blogs"
                                description="Aún no has creado ningún blog en este tenant. Comienza creando tu primer blog para compartir contenido."
                                onCreateNew={handleCreateNew}
                                createLabel="Crear primer blog"
                            />
                        )
                    ) : (
                        <div className={
                          listState.viewMode === 'grid' 
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "space-y-4"
                        }>
                            {filteredAndSortedBlogs.map((blog) => (
                                <Card 
                                    key={blog.id} 
                                    className={`
                                        hover:shadow-lg transition-all duration-200 cursor-pointer
                                        ${listState.selectedBlogs.has(blog.id || '') ? 
                                          'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                                        }
                                        ${listState.viewMode === 'list' ? 'flex flex-row' : ''}
                                    `}
                                    onClick={() => blog.id && handleToggleSelect(blog.id)}
                                >
                                    {/* Checkbox de selección */}
                                    <div className={`
                                        absolute top-3 left-3 z-10
                                        ${listState.viewMode === 'list' ? 'relative top-0 left-0 m-4' : ''}
                                    `}>
                                        <div 
                                            className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                blog.id && handleToggleSelect(blog.id);
                                            }}
                                        >
                                            {listState.selectedBlogs.has(blog.id || '') && (
                                                <FiCheckSquare className="h-3 w-3 text-blue-600" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Blog Image */}
                                    <div className={`
                                        ${listState.viewMode === 'grid' ? 
                                          'aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden' :
                                          'w-48 h-32 bg-gray-200 dark:bg-gray-700 rounded-l-lg overflow-hidden flex-shrink-0'
                                        }
                                    `}>
                                        {blog.image ? (
                                            <img
                                                src={blog.image}
                                                alt={blog.alt || blog.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FiImage className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Blog Content */}
                                    <CardContent className={listState.viewMode === 'list' ? 'flex-1' : ''}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                                                {blog.title}
                                            </h3>
                                            
                                            {/* Quick actions menu */}
                                            <div className="ml-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Aquí iría el menú de acciones rápidas
                                                    }}
                                                >
                                                    <FiMoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                            {blog.excerpt || 'Sin descripción disponible'}
                                        </p>

                                        {/* Blog Meta */}
                                        <div className={`space-y-2 mb-4 ${listState.viewMode === 'list' ? 'flex space-y-0 space-x-4' : ''}`}>
                                            {blog.author && (
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                    <FiUser className="h-3 w-3 mr-1" />
                                                    {blog.author.name}
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                <FiCalendar className="h-3 w-3 mr-1" />
                                                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Fecha no disponible'}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className={`flex gap-2 ${listState.viewMode === 'list' ? 'mt-auto' : ''}`}>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleView(blog.slug);
                                                }}
                                                leftIcon={<FiEye />}
                                                className="flex-1"
                                            >
                                                Ver
                                            </Button>
                                            
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(blog.id);
                                                }}
                                                leftIcon={<FiEdit />}
                                                disabled={!blog.id}
                                                className="flex-1"
                                            >
                                                Editar
                                            </Button>
                                            
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    blog.id && handleDelete(blog.id, blog.title);
                                                }}
                                                leftIcon={<FiTrash2 />}
                                                loading={deletingId === blog.id}
                                                disabled={!blog.id}
                                            >
                                                {deletingId === blog.id ? '' : ''}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Notificaciones */}
            <NotificationContainer
                notifications={notifications}
                onRemove={removeNotification}
                position="top-right"
            />

            {/* Ayuda de atajos de teclado */}
            {showShortcuts && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Atajos de Teclado</h3>
                            <Button
                                onClick={() => setShowShortcuts(false)}
                                variant="outline"
                                size="sm"
                            >
                                ✕
                            </Button>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Crear nuevo blog</span>
                                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">⌘+N</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Actualizar lista</span>
                                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">⌘+R</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Buscar blogs</span>
                                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">⌘+F</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Seleccionar todos</span>
                                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">⌘+A</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Cambiar vista</span>
                                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">⌘+V</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Eliminar seleccionados</span>
                                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Delete</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Mostrar atajos</span>
                                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">/</kbd>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BlogList;