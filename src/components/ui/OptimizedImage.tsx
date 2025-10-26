"use client";

import React, { useState, useCallback, forwardRef } from 'react';
import { useImageOptimization, useImageLazyLoading, useImagePreload } from '@/hooks/useImageOptimization';
import { FiImage, FiAlertTriangle, FiRefreshCw, FiZap, FiWifi } from 'react-icons/fi';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError' | 'onLoad' | 'src'> {
  src: string;
  alt: string;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  sizes?: string;
  priority?: boolean;
  lazy?: boolean;
  progressive?: boolean;
  lossless?: boolean;
  strip?: boolean;
  placeholder?: 'blur' | 'empty' | string;
  showMetrics?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  fallbackSrc?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  aspectRatio?: string;
  blurDataURL?: string;
}

const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(({
  src,
  alt,
  quality = 80,
  format = 'auto',
  sizes,
  priority = false,
  lazy = true,
  progressive = true,
  lossless = false,
  strip = true,
  placeholder = 'blur',
  showMetrics = false,
  onLoad,
  onError,
  fallbackSrc,
  objectFit = 'cover',
  aspectRatio,
  blurDataURL,
  className = '',
  style,
  ...props
}, ref) => {
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Optimización de imagen
  const {
    optimizedSrc,
    srcSet,
    isLoading,
    isLoaded,
    error,
    metrics,
    placeholder: generatedPlaceholder,
    retry,
    updateOptions
  } = useImageOptimization(src, {
    quality,
    format,
    sizes,
    priority,
    lazy,
    progressive,
    lossless,
    strip,
    placeholder
  });

  // Lazy loading
  const { imgRef, isVisible } = useImageLazyLoading(0.1);

  // Preload para imágenes prioritarias
  const isPreloaded = useImagePreload(optimizedSrc, priority);

  // Determinar fuente a mostrar
  const finalSrc = imageError && fallbackSrc ? fallbackSrc : optimizedSrc;
  const shouldLoad = priority || !lazy || isVisible;

  // Manejar errores de carga
  const handleImageError = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    if (onError && error) {
      onError(error);
    }
    
    // Auto-retry limitado
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setImageError(false);
        retry();
      }, 1000 * (retryCount + 1));
    }
  }, [error, onError, retryCount, retry]);

  // Manejar carga exitosa
  const handleImageLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(false);
    setRetryCount(0);
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  // Estilos del contenedor
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
    aspectRatio: aspectRatio || 'auto',
    ...style
  };

  // Estilos de la imagen
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    transition: 'opacity 0.3s ease-in-out, filter 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
    filter: isLoading ? 'blur(5px)' : 'none'
  };

  // Placeholder styles
  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit,
    opacity: isLoaded ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
    filter: 'blur(10px)',
    transform: 'scale(1.1)'
  };

  return (
    <div 
      className={`relative ${className}`} 
      style={containerStyle}
    >
      {/* Placeholder */}
      {(generatedPlaceholder || blurDataURL) && !isLoaded && (
        <img
          src={blurDataURL || generatedPlaceholder}
          alt=""
          style={placeholderStyle}
          aria-hidden="true"
        />
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-500">Optimizando...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
          <div className="text-center p-4">
            <FiAlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600 dark:text-red-400 mb-2">
              Error al cargar imagen
            </p>
            <button
              onClick={() => {
                setImageError(false);
                retry();
              }}
              className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition-colors"
            >
              <FiRefreshCw className="inline h-3 w-3 mr-1" />
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Main image */}
      {shouldLoad && finalSrc && (
        <img
          ref={(node) => {
            if (ref) {
              if (typeof ref === 'function') {
                ref(node);
              } else {
                ref.current = node;
              }
            }
            if (lazy) {
              (imgRef as React.MutableRefObject<HTMLImageElement | null>).current = node;
            }
          }}
          src={finalSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          style={imageStyle}
          loading={lazy && !priority ? 'lazy' : 'eager'}
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...props}
        />
      )}

      {/* Priority indicator */}
      {priority && showMetrics && (
        <div className="absolute top-2 left-2 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <FiZap className="h-3 w-3" />
          Priority
        </div>
      )}

      {/* Metrics overlay */}
      {showMetrics && metrics && isLoaded && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs p-2 rounded max-w-48">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Formato:</span>
              <span className="font-mono">{metrics.format.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Compresión:</span>
              <span className="font-mono">{metrics.compressionRatio.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Carga:</span>
              <span className="font-mono">{metrics.loadTime.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Tamaño:</span>
              <span className="font-mono">{(metrics.optimizedSize / 1024).toFixed(1)}KB</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Red:</span>
              <div className="flex items-center gap-1">
                <FiWifi className={`h-3 w-3 ${metrics.bandwidth === 'fast' ? 'text-green-400' : 'text-yellow-400'}`} />
                <span className="font-mono text-xs">{metrics.bandwidth}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility improvements */}
      <div className="sr-only">
        {isLoading && "Imagen cargando..."}
        {error && "Error al cargar imagen"}
        {isLoaded && `Imagen cargada: ${alt}`}
      </div>
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Componente de galería optimizada
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  columns?: number;
  gap?: number;
  quality?: number;
  lazy?: boolean;
  showMetrics?: boolean;
}

export const OptimizedImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = 3,
  gap = 16,
  quality = 75,
  lazy = true,
  showMetrics = false
}) => {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
  };

  return (
    <div style={gridStyle} className="w-full">
      {images.map((image, index) => (
        <div key={index} className="relative">
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            quality={quality}
            lazy={lazy && index > 2} // Primeras 3 imágenes no lazy
            priority={index < 2} // Primeras 2 imágenes priority
            showMetrics={showMetrics}
            aspectRatio="1"
            className="rounded-lg overflow-hidden"
          />
          {image.caption && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

// Avatar optimizado
interface OptimizedAvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}

export const OptimizedAvatar: React.FC<OptimizedAvatarProps> = ({
  src,
  alt,
  size = 'md',
  fallback,
  showOnlineStatus = false,
  isOnline = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const sizePx = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96
  };

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden`}>
      <OptimizedImage
        src={src}
        alt={alt}
        quality={90}
        format="webp"
        priority={true}
        lazy={false}
        objectFit="cover"
        aspectRatio="1"
        fallbackSrc={fallback}
        className="rounded-full"
        sizes={`${sizePx[size]}px`}
      />
      
      {showOnlineStatus && (
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`} />
      )}
    </div>
  );
};

export default OptimizedImage;