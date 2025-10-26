import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';

// Interfaces
interface LazyLoadOptions {
  threshold?: number; // Umbral de intersección (0-1)
  rootMargin?: string; // Margen del root
  triggerOnce?: boolean; // Solo cargar una vez
  placeholder?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error }>;
  delay?: number; // Delay antes de cargar
}

interface LazyComponentState {
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
  Component: React.ComponentType<any> | null;
}

interface ChunkLoadInfo {
  name: string;
  size: number;
  loadTime: number;
  cached: boolean;
}

interface UseLazyLoadReturn {
  ref: React.RefObject<HTMLElement>;
  isVisible: boolean;
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
  load: () => Promise<void>;
}

interface UseDynamicImportReturn<T> {
  component: T | null;
  isLoading: boolean;
  error: Error | null;
  loadedChunks: ChunkLoadInfo[];
  load: () => Promise<void>;
  preload: () => Promise<void>;
}

// Hook para lazy loading con Intersection Observer
export const useLazyLoad = (
  importFunc: () => Promise<any>,
  options: LazyLoadOptions = {}
): UseLazyLoadReturn => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    delay = 0
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const ref = useRef<HTMLElement>(null);
  const hasTriggered = useRef(false);

  // Intersection Observer
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          if (triggerOnce && !hasTriggered.current) {
            hasTriggered.current = true;
            // Auto-load cuando se hace visible
            setTimeout(() => load(), delay);
          }
        } else {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  // Función de carga manual
  const load = useCallback(async () => {
    if (isLoaded || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const startTime = performance.now();
      await importFunc();
      const loadTime = performance.now() - startTime;
      
      console.log(`Lazy component loaded in ${loadTime.toFixed(2)}ms`);
      setIsLoaded(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Load failed');
      setError(error);
      console.error('Lazy load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [importFunc, isLoaded, isLoading]);

  return {
    ref,
    isVisible,
    isLoaded,
    isLoading,
    error,
    load
  };
};

// Hook para dynamic imports con métricas
export const useDynamicImport = <T = any>(
  importFunc: () => Promise<{ default: T }>,
  preload: boolean = false
): UseDynamicImportReturn<T> => {
  const [component, setComponent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loadedChunks, setLoadedChunks] = useState<ChunkLoadInfo[]>([]);
  const loadPromise = useRef<Promise<void> | null>(null);

  const trackChunkLoad = useCallback((name: string, size: number, loadTime: number, cached: boolean) => {
    setLoadedChunks(prev => [...prev, { name, size, loadTime, cached }]);
  }, []);

  const loadComponent = useCallback(async () => {
    if (component) return Promise.resolve();
    if (loadPromise.current) return loadPromise.current;

    setIsLoading(true);
    setError(null);

    loadPromise.current = (async () => {
      try {
        const startTime = performance.now();
        const moduleResult = await importFunc();
        const loadTime = performance.now() - startTime;
        
        // Simular información del chunk
        const chunkInfo: ChunkLoadInfo = {
          name: `dynamic-${Date.now()}`,
          size: Math.random() * 50000 + 10000, // 10-60KB simulado
          loadTime,
          cached: loadTime < 10 // Considerar cached si carga muy rápido
        };
        
        trackChunkLoad(chunkInfo.name, chunkInfo.size, chunkInfo.loadTime, chunkInfo.cached);
        setComponent(moduleResult.default);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Dynamic import failed');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    })();

    return loadPromise.current;
  }, [component, importFunc, trackChunkLoad]);

  const preloadComponent = useCallback(async () => {
    if (typeof window !== 'undefined') {
      // Preload sin setear el componente
      try {
        await importFunc();
      } catch (err) {
        console.warn('Preload failed:', err);
      }
    }
  }, [importFunc]);

  // Auto-preload si está habilitado
  useEffect(() => {
    if (preload && typeof window !== 'undefined') {
      // Delay para no interferir con la carga inicial
      const timer = setTimeout(preloadComponent, 2000);
      return () => clearTimeout(timer);
    }
  }, [preload, preloadComponent]);

  return {
    component,
    isLoading,
    error,
    loadedChunks,
    load: loadComponent,
    preload: preloadComponent
  };
};

// Preload de rutas importantes
export const preloadRoute = (routePath: string) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = routePath;
      document.head.appendChild(link);
    });
  }
};

// Hook para medir el impacto del code splitting
export const useCodeSplittingMetrics = () => {
  const [metrics, setMetrics] = useState({
    initialBundleSize: 0,
    asyncChunksLoaded: 0,
    totalSavings: 0,
    avgChunkLoadTime: 0
  });

  const trackChunkLoad = useCallback((size: number, loadTime: number) => {
    setMetrics(prev => ({
      ...prev,
      asyncChunksLoaded: prev.asyncChunksLoaded + 1,
      totalSavings: prev.totalSavings + size,
      avgChunkLoadTime: ((prev.avgChunkLoadTime * (prev.asyncChunksLoaded - 1)) + loadTime) / prev.asyncChunksLoaded
    }));
  }, []);

  const getEfficiencyScore = useCallback(() => {
    if (metrics.asyncChunksLoaded === 0) return 0;
    
    // Score basado en chunks cargados y tiempo promedio
    const chunkScore = Math.min(metrics.asyncChunksLoaded * 10, 50);
    const speedScore = metrics.avgChunkLoadTime < 100 ? 50 : Math.max(0, 50 - (metrics.avgChunkLoadTime - 100) / 10);
    
    return Math.round(chunkScore + speedScore);
  }, [metrics]);

  return {
    metrics,
    trackChunkLoad,
    getEfficiencyScore
  };
};