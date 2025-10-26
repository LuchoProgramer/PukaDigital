"use client";

import { useState, useCallback, useRef } from 'react';

interface DragItem {
  index: number;
  type: string;
  id?: string;
}

interface UseDragAndDropProps<T> {
  items: T[];
  onReorder: (newItems: T[]) => void;
  enabled?: boolean;
}

interface UseDragAndDropReturn {
  draggedItem: DragItem | null;
  dragOverIndex: number | null;
  isDragging: boolean;
  handleDragStart: (e: React.DragEvent, index: number, type: string, id?: string) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, dropIndex: number) => void;
  handleDragEnd: () => void;
  getDragProps: (index: number, type: string, id?: string) => {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: () => void;
    className?: string;
  };
  getDropProps: (index: number) => {
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    className?: string;
  };
}

export function useDragAndDrop<T>({
  items,
  onReorder,
  enabled = true
}: UseDragAndDropProps<T>): UseDragAndDropReturn {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const handleDragStart = useCallback((
    e: React.DragEvent,
    index: number,
    type: string,
    id?: string
  ) => {
    if (!enabled) return;

    const dragItem: DragItem = { index, type, id };
    setDraggedItem(dragItem);
    
    // Configurar datos de transferencia
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(dragItem));
    
    // Añadir clase al elemento siendo arrastrado
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  }, [enabled]);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    if (!enabled || !draggedItem) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Solo actualizar si es diferente del índice actual
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  }, [enabled, draggedItem, dragOverIndex]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!enabled) return;

    dragCounter.current--;
    
    // Solo limpiar si salimos completamente del área de drop
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  }, [enabled]);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    if (!enabled || !draggedItem) return;

    e.preventDefault();
    
    const sourceIndex = draggedItem.index;
    
    // Si se suelta en la misma posición, no hacer nada
    if (sourceIndex === dropIndex) {
      setDraggedItem(null);
      setDragOverIndex(null);
      dragCounter.current = 0;
      return;
    }

    // Crear nueva lista reordenada
    const newItems = [...items];
    const [movedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(dropIndex, 0, movedItem);

    // Notificar el cambio
    onReorder(newItems);
    
    // Limpiar estado
    setDraggedItem(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  }, [enabled, draggedItem, items, onReorder]);

  const handleDragEnd = useCallback(() => {
    // Limpiar estilos y estado
    setDraggedItem(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
    
    // Restaurar opacidad de todos los elementos
    const dragElements = document.querySelectorAll('[draggable="true"]');
    dragElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.opacity = '';
      }
    });
  }, []);

  const getDragProps = useCallback((index: number, type: string, id?: string) => ({
    draggable: enabled,
    onDragStart: (e: React.DragEvent) => handleDragStart(e, index, type, id),
    onDragEnd: handleDragEnd,
    className: draggedItem?.index === index ? 'opacity-50' : ''
  }), [enabled, handleDragStart, handleDragEnd, draggedItem]);

  const getDropProps = useCallback((index: number) => ({
    onDragOver: (e: React.DragEvent) => {
      dragCounter.current++;
      handleDragOver(e, index);
    },
    onDragLeave: handleDragLeave,
    onDrop: (e: React.DragEvent) => handleDrop(e, index),
    className: dragOverIndex === index ? 'border-blue-500 border-2 border-dashed bg-blue-50' : ''
  }), [handleDragOver, handleDragLeave, handleDrop, dragOverIndex]);

  return {
    draggedItem,
    dragOverIndex,
    isDragging: draggedItem !== null,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    getDragProps,
    getDropProps
  };
}

export default useDragAndDrop;