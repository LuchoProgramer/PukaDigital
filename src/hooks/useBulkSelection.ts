"use client";

import { useState, useCallback, useMemo } from 'react';

interface UseBulkSelectionOptions<T> {
  items: T[];
  getId: (item: T) => string;
  onSelectionChange?: (selectedIds: Set<string>) => void;
}

export const useBulkSelection = <T>({
  items,
  getId,
  onSelectionChange
}: UseBulkSelectionOptions<T>) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // IDs de todos los elementos disponibles
  const allIds = useMemo(() => {
    return new Set(items.map(getId).filter(Boolean));
  }, [items, getId]);

  // Elementos seleccionados
  const selectedItems = useMemo(() => {
    return items.filter(item => selectedIds.has(getId(item)));
  }, [items, selectedIds, getId]);

  // Verificar si todos están seleccionados
  const isAllSelected = useMemo(() => {
    return allIds.size > 0 && selectedIds.size === allIds.size;
  }, [allIds, selectedIds]);

  // Verificar si algunos están seleccionados
  const isSomeSelected = useMemo(() => {
    return selectedIds.size > 0 && selectedIds.size < allIds.size;
  }, [allIds, selectedIds]);

  // Alternar selección de un elemento
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  }, [onSelectionChange]);

  // Seleccionar todos
  const selectAll = useCallback(() => {
    const newSelection = new Set(allIds);
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  }, [allIds, onSelectionChange]);

  // Deseleccionar todos
  const selectNone = useCallback(() => {
    const newSelection = new Set<string>();
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  }, [onSelectionChange]);

  // Alternar selección de todos
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      selectNone();
    } else {
      selectAll();
    }
  }, [isAllSelected, selectAll, selectNone]);

  // Seleccionar múltiples elementos
  const selectMultiple = useCallback((ids: string[]) => {
    setSelectedIds(prev => {
      const newSelection = new Set(prev);
      ids.forEach(id => newSelection.add(id));
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  }, [onSelectionChange]);

  // Deseleccionar múltiples elementos
  const deselectMultiple = useCallback((ids: string[]) => {
    setSelectedIds(prev => {
      const newSelection = new Set(prev);
      ids.forEach(id => newSelection.delete(id));
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  }, [onSelectionChange]);

  // Invertir selección
  const invertSelection = useCallback(() => {
    setSelectedIds(prev => {
      const newSelection = new Set<string>();
      allIds.forEach(id => {
        if (!prev.has(id)) {
          newSelection.add(id);
        }
      });
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  }, [allIds, onSelectionChange]);

  // Resetear selección
  const resetSelection = useCallback(() => {
    selectNone();
  }, [selectNone]);

  // Verificar si un elemento está seleccionado
  const isSelected = useCallback((id: string) => {
    return selectedIds.has(id);
  }, [selectedIds]);

  return {
    selectedIds,
    selectedItems,
    selectedCount: selectedIds.size,
    totalCount: allIds.size,
    isAllSelected,
    isSomeSelected,
    isSelected,
    toggleSelection,
    selectAll,
    selectNone,
    toggleSelectAll,
    selectMultiple,
    deselectMultiple,
    invertSelection,
    resetSelection
  };
};

export default useBulkSelection;