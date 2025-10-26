"use client";

import React, { useCallback, useMemo, useState } from 'react';
import { Blog } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useVirtualScroll } from '@/hooks/useVirtualScroll';
import { usePerformanceMonitor, useDebounce, useCache } from '@/hooks/usePerformance';
import { 
  FiEdit, FiTrash2, FiEye, FiImage, FiCalendar, FiUser, 
  FiCheckSquare, FiSquare 
} from 'react-icons/fi';

interface VirtualizedBlogListProps {
  blogs: Blog[];
  onEdit: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  onView: (slug: string) => void;
  onToggleSelect: (id: string) => void;
  selectedBlogs: Set<string>;
  viewMode: 'grid' | 'list';
  loading?: boolean;
  deletingId?: string;
}

const VirtualizedBlogList: React.FC<VirtualizedBlogListProps> = ({
  blogs,
  onEdit,
  onDelete,
  onView,
  onToggleSelect,
  selectedBlogs,
  viewMode,
  loading = false,
  deletingId = ''
}) => {
  // Performance monitoring
  const { logMetrics } = usePerformanceMonitor('VirtualizedBlogList');

  // Cache para blog cards renderizadas
  const cache = useCache<React.ReactElement>(2 * 60 * 1000); // 2 minutos

  // Configuración de virtualización
  const itemHeight = viewMode === 'grid' ? 300 : 150;
  const containerHeight = 600; // Altura del contenedor visible

  // Virtual scrolling
  const { virtualItems, scrollElementProps, containerProps } = useVirtualScroll(
    blogs,
    {
      itemHeight,
      containerHeight,
      overscan: 3 // Renderizar 3 items extra fuera del viewport
    }
  );

  // Función memoizada para renderizar blog card
  const renderBlogCard = useCallback((blog: Blog, index: number) => {
    const cacheKey = `blog-${blog.id}-${viewMode}-${selectedBlogs.has(blog.id || '')}`;
    
    // Verificar cache primero
    const cachedCard = cache.get(cacheKey);
    if (cachedCard) {
      return cachedCard;
    }

    const isSelected = selectedBlogs.has(blog.id || '');
    const isDeleting = deletingId === blog.id;

    const card = (
      <Card 
        className={`
          hover:shadow-lg transition-all duration-200 cursor-pointer h-full
          ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}
          ${viewMode === 'list' ? 'flex flex-row' : ''}
        `}
        onClick={() => blog.id && onToggleSelect(blog.id)}
      >
        {/* Checkbox de selección */}
        <div className={`
          absolute top-3 left-3 z-10
          ${viewMode === 'list' ? 'relative top-0 left-0 m-4' : ''}
        `}>
          <div 
            className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              blog.id && onToggleSelect(blog.id);
            }}
          >
            {isSelected && (
              <FiCheckSquare className="h-3 w-3 text-blue-600" />
            )}
          </div>
        </div>

        {/* Blog Image */}
        <div className={`
          ${viewMode === 'grid' ? 
            'aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden' :
            'w-48 h-32 bg-gray-200 dark:bg-gray-700 rounded-l-lg overflow-hidden flex-shrink-0'
          }
        `}>
          {blog.image ? (
            <img
              src={blog.image}
              alt={blog.alt || blog.title}
              className="w-full h-full object-cover"
              loading="lazy" // Lazy loading nativo
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiImage className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Blog Content */}
        <CardContent className={viewMode === 'list' ? 'flex-1' : ''}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
              {blog.title}
            </h3>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {blog.excerpt || 'Sin descripción disponible'}
          </p>

          {/* Blog Meta */}
          <div className={`space-y-2 mb-4 ${viewMode === 'list' ? 'flex space-y-0 space-x-4' : ''}`}>
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
          <div className={`flex gap-2 ${viewMode === 'list' ? 'mt-auto' : ''}`}>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onView(blog.slug);
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
                blog.id && onEdit(blog.id);
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
                blog.id && onDelete(blog.id, blog.title);
              }}
              leftIcon={<FiTrash2 />}
              loading={isDeleting}
              disabled={!blog.id}
            >
              {isDeleting ? '' : ''}
            </Button>
          </div>
        </CardContent>
      </Card>
    );

    // Guardar en cache
    cache.set(cacheKey, card);
    return card;
  }, [viewMode, selectedBlogs, deletingId, onToggleSelect, onView, onEdit, onDelete, cache]);

  // Componente de item virtual memoizado
  const VirtualItem = React.memo<{ 
    index: number; 
    item: Blog; 
    style: React.CSSProperties 
  }>(({ index, item, style }) => {
    return (
      <div style={style} className="px-2 py-2">
        {renderBlogCard(item, index)}
      </div>
    );
  });

  VirtualItem.displayName = 'VirtualItem';

  // Log metrics en desarrollo
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const timer = setTimeout(logMetrics, 5000);
      return () => clearTimeout(timer);
    }
  }, [logMetrics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <FiImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No hay blogs para mostrar
        </h3>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Información de performance en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-xs">
          📊 Renderizando {virtualItems.length} de {blogs.length} items | 
          Altura del contenedor: {containerHeight}px | 
          Items en caché: {cache.size()}
        </div>
      )}

      {/* Contenedor virtualizado */}
      <div {...scrollElementProps}>
        <div {...containerProps}>
          {virtualItems.map(({ index, item, style }) => (
            <VirtualItem
              key={item.id || index}
              index={index}
              item={item}
              style={style}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(VirtualizedBlogList);