"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from 'react';

// Hook para debounce
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para throttle
const useThrottle = <T extends any[]>(
  callback: (...args: T) => void,
  delay: number
): ((...args: T) => void) => {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args: T) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

// Hook para memoización profunda
const useDeepMemo = <T>(value: T, deps: React.DependencyList): T => {
  const ref = useRef<T>(value);
  const depsRef = useRef(deps);

  return useMemo(() => {
    // Comparación profunda simple
    const hasChanged = deps.some((dep, index) => {
      return dep !== depsRef.current[index];
    });

    if (hasChanged) {
      ref.current = value;
      depsRef.current = deps;
    }

    return ref.current;
  }, deps);
};

// Hook para lazy loading de imágenes
const useLazyImage = (src: string, rootMargin = '50px') => {
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    
    if (imageRef && imageSrc !== src) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          },
          { rootMargin }
        );
        observer.observe(imageRef);
      } else {
        // Fallback para navegadores antiguos
        setImageSrc(src);
      }
    }

    return () => {
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef!);
      }
    };
  }, [imageRef, imageSrc, rootMargin, src]);

  return { imageSrc, setImageRef };
};

// Hook para cache con TTL
interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

const useCache = <T>(defaultTTL: number = 5 * 60 * 1000) => {
  const cache = useRef<Map<string, CacheItem<T>>>(new Map());

  const set = useCallback((key: string, value: T, ttl: number = defaultTTL) => {
    cache.current.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }, [defaultTTL]);

  const get = useCallback((key: string): T | undefined => {
    const item = cache.current.get(key);
    
    if (!item) return undefined;
    
    // Verificar si el item ha expirado
    if (Date.now() - item.timestamp > item.ttl) {
      cache.current.delete(key);
      return undefined;
    }
    
    return item.value;
  }, []);

  const has = useCallback((key: string): boolean => {
    const item = cache.current.get(key);
    
    if (!item) return false;
    
    // Verificar si el item ha expirado
    if (Date.now() - item.timestamp > item.ttl) {
      cache.current.delete(key);
      return false;
    }
    
    return true;
  }, []);

  const clear = useCallback(() => {
    cache.current.clear();
  }, []);

  const remove = useCallback((key: string) => {
    cache.current.delete(key);
  }, []);

  // Limpiar items expirados
  const cleanExpired = useCallback(() => {
    const now = Date.now();
    const entries = Array.from(cache.current.entries());
    for (const [key, item] of entries) {
      if (now - item.timestamp > item.ttl) {
        cache.current.delete(key);
      }
    }
  }, []);

  return {
    set,
    get,
    has,
    clear,
    remove,
    cleanExpired,
    size: () => cache.current.size
  };
};

// Hook para performance monitoring
const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = Date.now() - startTime.current;
    renderTimes.current.push(renderTime);

    // Mantener solo los últimos 100 renders
    if (renderTimes.current.length > 100) {
      renderTimes.current.shift();
    }

    startTime.current = Date.now();
  });

  const getMetrics = useCallback(() => {
    const times = renderTimes.current;
    const avgRenderTime = times.length > 0 
      ? times.reduce((sum, time) => sum + time, 0) / times.length 
      : 0;
    
    const maxRenderTime = times.length > 0 ? Math.max(...times) : 0;
    const minRenderTime = times.length > 0 ? Math.min(...times) : 0;

    return {
      componentName,
      renderCount: renderCount.current,
      avgRenderTime: Math.round(avgRenderTime * 100) / 100,
      maxRenderTime,
      minRenderTime,
      totalRenders: renderCount.current
    };
  }, [componentName]);

  const logMetrics = useCallback(() => {
    const metrics = getMetrics();
    console.group(`🔥 Performance Metrics: ${componentName}`);
    console.log(`Renders: ${metrics.totalRenders}`);
    console.log(`Avg render time: ${metrics.avgRenderTime}ms`);
    console.log(`Max render time: ${metrics.maxRenderTime}ms`);
    console.log(`Min render time: ${metrics.minRenderTime}ms`);
    console.groupEnd();
  }, [componentName, getMetrics]);

  return {
    getMetrics,
    logMetrics,
    renderCount: renderCount.current
  };
};

// Hook para optimización de re-renders
const useRenderOptimization = <T extends Record<string, any>>(
  props: T,
  compareKeys?: (keyof T)[]
) => {
  const prevProps = useRef<T>(props);
  const renderCount = useRef(0);

  const hasChanged = useMemo(() => {
    renderCount.current += 1;
    
    if (!compareKeys) {
      // Comparar todas las keys
      const currentKeys = Object.keys(props);
      const prevKeys = Object.keys(prevProps.current);
      
      if (currentKeys.length !== prevKeys.length) {
        prevProps.current = props;
        return true;
      }
      
      for (const key of currentKeys) {
        if (props[key] !== prevProps.current[key]) {
          prevProps.current = props;
          return true;
        }
      }
      
      return false;
    } else {
      // Comparar solo las keys especificadas
      for (const key of compareKeys) {
        if (props[key] !== prevProps.current[key]) {
          prevProps.current = props;
          return true;
        }
      }
      
      return false;
    }
  }, [props, compareKeys]);

  return {
    hasChanged,
    renderCount: renderCount.current,
    shouldUpdate: hasChanged
  };
};

export {
  useDebounce,
  useThrottle,
  useDeepMemo,
  useLazyImage,
  useCache,
  usePerformanceMonitor,
  useRenderOptimization
};