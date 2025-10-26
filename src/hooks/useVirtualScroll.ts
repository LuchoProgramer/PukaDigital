"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // Número de items extra a renderizar fuera del viewport
  estimatedItemHeight?: number; // Para items de altura variable
}

interface VirtualScrollResult<T> {
  virtualItems: Array<{
    index: number;
    item: T;
    style: React.CSSProperties;
  }>;
  totalHeight: number;
  scrollElementProps: {
    ref: React.RefObject<HTMLDivElement>;
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    style: React.CSSProperties;
  };
  containerProps: {
    style: React.CSSProperties;
  };
}

export const useVirtualScroll = <T>(
  items: T[],
  options: VirtualScrollOptions
): VirtualScrollResult<T> => {
  const {
    itemHeight,
    containerHeight,
    overscan = 5,
    estimatedItemHeight = itemHeight
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Calcular qué items son visibles
  const virtualItems = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    // Agregar overscan
    const startIndex = Math.max(0, visibleStart - overscan);
    const endIndex = Math.min(items.length - 1, visibleEnd + overscan);

    const virtualItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      virtualItems.push({
        index: i,
        item: items[i],
        style: {
          position: 'absolute' as const,
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight,
        },
      });
    }

    return virtualItems;
  }, [items, scrollTop, itemHeight, containerHeight, overscan]);

  // Altura total del contenedor virtual
  const totalHeight = items.length * itemHeight;

  // Handler del scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Props para el elemento de scroll
  const scrollElementProps = {
    ref: scrollElementRef,
    onScroll: handleScroll,
    style: {
      height: containerHeight,
      overflow: 'auto' as const,
    },
  };

  // Props para el contenedor interno
  const containerProps = {
    style: {
      height: totalHeight,
      position: 'relative' as const,
    },
  };

  return {
    virtualItems,
    totalHeight,
    scrollElementProps,
    containerProps,
  };
};

// Hook para virtualization con altura variable
export const useVariableVirtualScroll = <T>(
  items: T[],
  getItemHeight: (index: number, item: T) => number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [itemHeights, setItemHeights] = useState<Map<number, number>>(new Map());
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Memoizar las alturas y posiciones
  const { itemPositions, totalHeight } = useMemo(() => {
    const positions = new Map<number, number>();
    let currentPosition = 0;

    for (let i = 0; i < items.length; i++) {
      positions.set(i, currentPosition);
      const height = itemHeights.get(i) || getItemHeight(i, items[i]);
      currentPosition += height;
    }

    return {
      itemPositions: positions,
      totalHeight: currentPosition,
    };
  }, [items, itemHeights, getItemHeight]);

  // Encontrar qué items son visibles
  const virtualItems = useMemo(() => {
    const visibleItems = [];
    
    for (let i = 0; i < items.length; i++) {
      const itemTop = itemPositions.get(i) || 0;
      const itemHeight = itemHeights.get(i) || getItemHeight(i, items[i]);
      const itemBottom = itemTop + itemHeight;

      // Verificar si el item está en el viewport (con overscan)
      const viewportTop = scrollTop - (overscan * 50); // Estimación para overscan
      const viewportBottom = scrollTop + containerHeight + (overscan * 50);

      if (itemBottom >= viewportTop && itemTop <= viewportBottom) {
        visibleItems.push({
          index: i,
          item: items[i],
          style: {
            position: 'absolute' as const,
            top: itemTop,
            left: 0,
            right: 0,
            height: itemHeight,
          },
        });
      }
    }

    return visibleItems;
  }, [items, itemPositions, itemHeights, scrollTop, containerHeight, overscan, getItemHeight]);

  // Actualizar altura de un item
  const updateItemHeight = useCallback((index: number, height: number) => {
    setItemHeights(prev => {
      const newHeights = new Map(prev);
      newHeights.set(index, height);
      return newHeights;
    });
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    virtualItems,
    totalHeight,
    updateItemHeight,
    scrollElementProps: {
      ref: scrollElementRef,
      onScroll: handleScroll,
      style: {
        height: containerHeight,
        overflow: 'auto' as const,
      },
    },
    containerProps: {
      style: {
        height: totalHeight,
        position: 'relative' as const,
      },
    },
  };
};

export default useVirtualScroll;