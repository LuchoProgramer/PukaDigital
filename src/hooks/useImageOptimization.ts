import { useState, useEffect, useCallback, useRef } from 'react';

// Interfaces
interface ImageOptimizationOptions {
  quality?: number; // 1-100
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  sizes?: string; // Responsive sizes
  placeholder?: 'blur' | 'empty' | string;
  priority?: boolean; // Preload important images
  lazy?: boolean; // Lazy loading
  progressive?: boolean; // Progressive JPEG
  lossless?: boolean; // Lossless compression
  strip?: boolean; // Strip metadata
}

interface ResponsiveBreakpoint {
  width: number;
  quality?: number;
  format?: string;
}

interface ImageMetrics {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  loadTime: number;
  format: string;
  dimensions: { width: number; height: number };
  bandwidth: 'slow' | 'fast';
  devicePixelRatio: number;
}

interface UseImageOptimizationReturn {
  optimizedSrc: string;
  srcSet: string;
  sizes: string;
  isLoading: boolean;
  isLoaded: boolean;
  error: Error | null;
  metrics: ImageMetrics | null;
  placeholder: string;
  retry: () => void;
  updateOptions: (options: ImageOptimizationOptions) => void;
}

// Hook principal para optimización de imágenes
export const useImageOptimization = (
  originalSrc: string,
  options: ImageOptimizationOptions = {}
): UseImageOptimizationReturn => {
  const {
    quality = 80,
    format = 'auto',
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    placeholder = 'blur',
    priority = false,
    lazy = true,
    progressive = true,
    lossless = false,
    strip = true
  } = options;

  const [optimizedSrc, setOptimizedSrc] = useState<string>('');
  const [srcSet, setSrcSet] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [metrics, setMetrics] = useState<ImageMetrics | null>(null);
  const [placeholderData, setPlaceholderData] = useState<string>('');
  const optionsRef = useRef(options);

  // Detectar capacidades del navegador
  const [browserSupport, setBrowserSupport] = useState({
    webp: false,
    avif: false,
    lazyLoading: false
  });

  // Detectar conexión de red
  const [networkInfo, setNetworkInfo] = useState({
    effectiveType: '4g',
    downlink: 10,
    saveData: false
  });

  // Breakpoints responsivos por defecto
  const defaultBreakpoints: ResponsiveBreakpoint[] = [
    { width: 320, quality: 60 },
    { width: 640, quality: 70 },
    { width: 768, quality: 75 },
    { width: 1024, quality: 80 },
    { width: 1280, quality: 85 },
    { width: 1920, quality: 90 }
  ];

  // Detectar soporte del navegador
  useEffect(() => {
    const detectSupport = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');

      // Detectar WebP
      const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      
      // Detectar AVIF (más complejo)
      let avifSupported = false;
      try {
        const avifTest = new Image();
        avifSupported = await new Promise((resolve) => {
          avifTest.onload = () => resolve(true);
          avifTest.onerror = () => resolve(false);
          avifTest.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        });
      } catch (e) {
        avifSupported = false;
      }

      // Detectar lazy loading nativo
      const lazySupported = 'loading' in HTMLImageElement.prototype;

      setBrowserSupport({
        webp: webpSupported,
        avif: avifSupported,
        lazyLoading: lazySupported
      });
    };

    detectSupport();
  }, []);

  // Detectar información de red
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setNetworkInfo({
        effectiveType: connection.effectiveType || '4g',
        downlink: connection.downlink || 10,
        saveData: connection.saveData || false
      });

      const updateConnection = () => {
        setNetworkInfo({
          effectiveType: connection.effectiveType || '4g',
          downlink: connection.downlink || 10,
          saveData: connection.saveData || false
        });
      };

      connection.addEventListener('change', updateConnection);
      return () => connection.removeEventListener('change', updateConnection);
    }
  }, []);

  // Determinar el mejor formato basado en soporte del navegador y opciones
  const getBestFormat = useCallback((): string => {
    if (format !== 'auto') return format;

    // Si saveData está activado, usar JPEG para mejor compresión
    if (networkInfo.saveData) return 'jpg';

    // Priorizar AVIF si está soportado
    if (browserSupport.avif) return 'avif';
    
    // Fallback a WebP si está soportado
    if (browserSupport.webp) return 'webp';
    
    // Fallback final a JPEG
    return 'jpg';
  }, [format, browserSupport, networkInfo.saveData]);

  // Ajustar calidad basada en conexión de red
  const getOptimalQuality = useCallback((): number => {
    let adjustedQuality = quality;

    // Reducir calidad en conexiones lentas o con saveData
    if (networkInfo.saveData) {
      adjustedQuality = Math.max(40, quality - 30);
    } else if (networkInfo.effectiveType === 'slow-2g' || networkInfo.effectiveType === '2g') {
      adjustedQuality = Math.max(50, quality - 20);
    } else if (networkInfo.effectiveType === '3g') {
      adjustedQuality = Math.max(60, quality - 10);
    }

    return adjustedQuality;
  }, [quality, networkInfo]);

  // Generar URL optimizada usando Cloudinary
  const generateOptimizedUrl = useCallback((
    src: string, 
    width?: number, 
    customQuality?: number,
    customFormat?: string
  ): string => {
    if (!src || !src.includes('cloudinary.com')) {
      return src; // Retornar URL original si no es de Cloudinary
    }

    const baseUrl = src.split('/upload/')[0];
    const imagePath = src.split('/upload/')[1];
    
    const bestFormat = customFormat || getBestFormat();
    const optimalQuality = customQuality || getOptimalQuality();
    
    let transformations = [];
    
    // Ancho específico
    if (width) {
      transformations.push(`w_${width}`);
    }
    
    // Calidad
    transformations.push(`q_${optimalQuality}`);
    
    // Formato
    transformations.push(`f_${bestFormat}`);
    
    // Opciones avanzadas
    if (progressive && (bestFormat === 'jpg' || bestFormat === 'jpeg')) {
      transformations.push('fl_progressive');
    }
    
    if (lossless && (bestFormat === 'png' || bestFormat === 'webp')) {
      transformations.push('fl_lossy.false');
    }
    
    if (strip) {
      transformations.push('fl_strip_profile');
    }
    
    // Auto-orientación
    transformations.push('fl_getinfo');
    
    // Optimización automática
    transformations.push('fl_awebp');
    
    return `${baseUrl}/upload/${transformations.join(',')}/${imagePath}`;
  }, [getBestFormat, getOptimalQuality, progressive, lossless, strip]);

  // Generar srcSet responsivo
  const generateSrcSet = useCallback((src: string): string => {
    const bestFormat = getBestFormat();
    
    return defaultBreakpoints
      .map(breakpoint => {
        const optimizedUrl = generateOptimizedUrl(
          src, 
          breakpoint.width, 
          breakpoint.quality || getOptimalQuality(),
          bestFormat
        );
        return `${optimizedUrl} ${breakpoint.width}w`;
      })
      .join(', ');
  }, [generateOptimizedUrl, getBestFormat, getOptimalQuality]);

  // Generar placeholder
  const generatePlaceholder = useCallback(async (src: string): Promise<string> => {
    if (placeholder === 'empty') return '';
    if (placeholder.startsWith('data:image/')) return placeholder;
    
    if (placeholder === 'blur' && src.includes('cloudinary.com')) {
      // Generar placeholder difuminado de baja calidad
      const blurUrl = generateOptimizedUrl(src, 40, 20);
      return blurUrl;
    }
    
    return '';
  }, [placeholder, generateOptimizedUrl]);

  // Medir métricas de la imagen
  const measureImageMetrics = useCallback((src: string, startTime: number): Promise<ImageMetrics> => {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        const loadTime = performance.now() - startTime;
        
        // Estimar tamaños (en un escenario real, esto vendría del servidor)
        const estimatedOriginalSize = img.width * img.height * 3; // Aproximación RGB
        const compressionRatio = getOptimalQuality() / 100;
        const estimatedOptimizedSize = estimatedOriginalSize * compressionRatio;
        
        const metrics: ImageMetrics = {
          originalSize: estimatedOriginalSize,
          optimizedSize: estimatedOptimizedSize,
          compressionRatio: (1 - compressionRatio) * 100,
          loadTime,
          format: getBestFormat(),
          dimensions: { width: img.width, height: img.height },
          bandwidth: networkInfo.downlink > 5 ? 'fast' : 'slow',
          devicePixelRatio: window.devicePixelRatio || 1
        };
        
        resolve(metrics);
      };
      
      img.src = src;
    });
  }, [getBestFormat, getOptimalQuality, networkInfo.downlink]);

  // Función principal de optimización
  const optimizeImage = useCallback(async () => {
    if (!originalSrc) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const startTime = performance.now();
      
      // Generar URLs optimizadas
      const optimized = generateOptimizedUrl(originalSrc);
      const responsiveSrcSet = generateSrcSet(originalSrc);
      const placeholderUrl = await generatePlaceholder(originalSrc);
      
      setOptimizedSrc(optimized);
      setSrcSet(responsiveSrcSet);
      setPlaceholderData(placeholderUrl);
      
      // Medir métricas
      const imageMetrics = await measureImageMetrics(optimized, startTime);
      setMetrics(imageMetrics);
      
      setIsLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Image optimization failed'));
    } finally {
      setIsLoading(false);
    }
  }, [originalSrc, generateOptimizedUrl, generateSrcSet, generatePlaceholder, measureImageMetrics]);

  // Función de retry
  const retry = useCallback(() => {
    setError(null);
    optimizeImage();
  }, [optimizeImage]);

  // Actualizar opciones
  const updateOptions = useCallback((newOptions: ImageOptimizationOptions) => {
    optionsRef.current = { ...optionsRef.current, ...newOptions };
    optimizeImage();
  }, [optimizeImage]);

  // Ejecutar optimización cuando cambie la fuente o las opciones
  useEffect(() => {
    optimizeImage();
  }, [optimizeImage]);

  return {
    optimizedSrc,
    srcSet,
    sizes,
    isLoading,
    isLoaded,
    error,
    metrics,
    placeholder: placeholderData,
    retry,
    updateOptions
  };
};

// Hook para lazy loading de imágenes con Intersection Observer
export const useImageLazyLoading = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(img);
        }
      },
      { threshold }
    );

    observer.observe(img);

    return () => {
      observer.unobserve(img);
    };
  }, [threshold]);

  return { imgRef, isVisible };
};

// Hook para preload de imágenes críticas
export const useImagePreload = (src: string, priority: boolean = false) => {
  const [isPreloaded, setIsPreloaded] = useState(false);

  useEffect(() => {
    if (!src || !priority) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    
    link.onload = () => setIsPreloaded(true);
    
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [src, priority]);

  return isPreloaded;
};