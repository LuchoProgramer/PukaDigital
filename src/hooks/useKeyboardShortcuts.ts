"use client";

import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  cmd?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
  target?: HTMLElement | Document;
}

export const useKeyboardShortcuts = ({
  shortcuts,
  enabled = true,
  target
}: UseKeyboardShortcutsOptions) => {
  const shortcutsRef = useRef(shortcuts);
  const enabledRef = useRef(enabled);

  // Actualizar refs cuando cambien las props
  useEffect(() => {
    shortcutsRef.current = shortcuts;
    enabledRef.current = enabled;
  }, [shortcuts, enabled]);

  const handleKeyDown = useCallback((event: Event) => {
    const keyboardEvent = event as KeyboardEvent;
    if (!enabledRef.current) return;

    // No procesar atajos si el foco está en un input, textarea o elemento editable
    const activeElement = document.activeElement;
    const isInputFocused = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.getAttribute('contenteditable') === 'true' ||
      activeElement.classList.contains('ck-editor__editable') // CKEditor
    );

    // Permitir solo algunos atajos específicos en inputs
    const allowedInInputs = ['s', 'z', 'y']; // Save, Undo, Redo
    if (isInputFocused && !allowedInInputs.includes(keyboardEvent.key.toLowerCase())) {
      return;
    }

    for (const shortcut of shortcutsRef.current) {
      const isCtrlMatch = shortcut.ctrl ? keyboardEvent.ctrlKey : !keyboardEvent.ctrlKey;
      const isCmdMatch = shortcut.cmd ? keyboardEvent.metaKey : !keyboardEvent.metaKey;
      const isAltMatch = shortcut.alt ? keyboardEvent.altKey : !keyboardEvent.altKey;
      const isShiftMatch = shortcut.shift ? keyboardEvent.shiftKey : !keyboardEvent.shiftKey;
      const isKeyMatch = keyboardEvent.key.toLowerCase() === shortcut.key.toLowerCase();

      // En macOS, Cmd+key es equivalente a Ctrl+key en Windows/Linux
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isModifierMatch = isMac 
        ? (shortcut.ctrl || shortcut.cmd) ? keyboardEvent.metaKey : !keyboardEvent.metaKey
        : isCtrlMatch && isCmdMatch;

      if (isKeyMatch && isModifierMatch && isAltMatch && isShiftMatch) {
        if (shortcut.preventDefault !== false) {
          keyboardEvent.preventDefault();
          keyboardEvent.stopPropagation();
        }
        
        shortcut.action();
        break;
      }
    }
  }, []);

  useEffect(() => {
    const targetElement = target || document;
    
    if (enabled) {
      targetElement.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      targetElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled, target]);

  // Función para obtener el texto descriptivo del atajo
  const getShortcutText = useCallback((shortcut: KeyboardShortcut): string => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const parts: string[] = [];

    if (shortcut.ctrl || shortcut.cmd) {
      parts.push(isMac ? '⌘' : 'Ctrl');
    }
    
    if (shortcut.alt) {
      parts.push(isMac ? '⌥' : 'Alt');
    }
    
    if (shortcut.shift) {
      parts.push(isMac ? '⇧' : 'Shift');
    }
    
    parts.push(shortcut.key.toUpperCase());
    
    return parts.join(' + ');
  }, []);

  // Función para mostrar ayuda de atajos
  const getShortcutsHelp = useCallback(() => {
    return shortcuts.map(shortcut => ({
      key: getShortcutText(shortcut),
      description: shortcut.description
    }));
  }, [shortcuts, getShortcutText]);

  return {
    getShortcutText,
    getShortcutsHelp
  };
};

// Hook simplificado para atajos de blog editor
export const useBlogEditorShortcuts = ({
  onSave,
  onBold,
  onItalic,
  onUndo,
  onRedo,
  onAddText,
  onAddImage,
  onAddVideo,
  onPreview,
  enabled = true
}: {
  onSave?: () => void;
  onBold?: () => void;
  onItalic?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onAddText?: () => void;
  onAddImage?: () => void;
  onAddVideo?: () => void;
  onPreview?: () => void;
  enabled?: boolean;
}) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 's',
      ctrl: true,
      action: onSave || (() => {}),
      description: 'Guardar blog',
      preventDefault: true
    },
    {
      key: 'b',
      ctrl: true,
      action: onBold || (() => {}),
      description: 'Texto en negrita'
    },
    {
      key: 'i',
      ctrl: true,
      action: onItalic || (() => {}),
      description: 'Texto en cursiva'
    },
    {
      key: 'z',
      ctrl: true,
      action: onUndo || (() => {}),
      description: 'Deshacer'
    },
    {
      key: 'y',
      ctrl: true,
      action: onRedo || (() => {}),
      description: 'Rehacer'
    },
    {
      key: 't',
      ctrl: true,
      shift: true,
      action: onAddText || (() => {}),
      description: 'Agregar bloque de texto'
    },
    {
      key: 'i',
      ctrl: true,
      shift: true,
      action: onAddImage || (() => {}),
      description: 'Agregar imagen'
    },
    {
      key: 'v',
      ctrl: true,
      shift: true,
      action: onAddVideo || (() => {}),
      description: 'Agregar video'
    },
    {
      key: 'p',
      ctrl: true,
      shift: true,
      action: onPreview || (() => {}),
      description: 'Vista previa'
    }
  ].filter(shortcut => shortcut.action !== (() => {}));

  return useKeyboardShortcuts({
    shortcuts,
    enabled
  });
};

export default useKeyboardShortcuts;