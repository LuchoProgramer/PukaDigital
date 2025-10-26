import { renderHook, act } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { useKeyboardShortcuts, useBlogEditorShortcuts } from '@/hooks/useKeyboardShortcuts';

// Mock para detectar plataforma
Object.defineProperty(window.navigator, 'platform', {
  writable: true,
  value: 'MacIntel'
});

describe('useKeyboardShortcuts Hook', () => {
  let mockOnSave: jest.Mock;
  let mockOnUndo: jest.Mock;
  let mockOnRedo: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSave = jest.fn();
    mockOnUndo = jest.fn();
    mockOnRedo = jest.fn();
  });

  afterEach(() => {
    // Limpiar event listeners
    document.removeEventListener('keydown', () => {});
  });

  it('should detect Mac platform correctly', () => {
    const { result } = renderHook(() => useKeyboardShortcuts({
      shortcuts: [
        { key: 's', cmd: true, action: mockOnSave, description: 'Save' }
      ],
      enabled: true
    }));

    expect(result.current.getShortcutsHelp()).toEqual([
      expect.objectContaining({
        key: expect.stringContaining('⌘'),
        description: 'Save'
      })
    ]);
  });

  it('should trigger save action on Cmd+S (Mac)', () => {
    renderHook(() => useKeyboardShortcuts({
      shortcuts: [
        { key: 's', cmd: true, action: mockOnSave, description: 'Save' }
      ],
      enabled: true
    }));

    // Simular Cmd+S en Mac
    fireEvent.keyDown(document, {
      key: 's',
      metaKey: true,
      preventDefault: jest.fn()
    });

    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('should trigger save action on Ctrl+S (Windows/Linux)', () => {
    // Cambiar plataforma a Windows
    Object.defineProperty(window.navigator, 'platform', {
      writable: true,
      value: 'Win32'
    });

    renderHook(() => useKeyboardShortcuts({
      shortcuts: [
        { key: 's', ctrl: true, action: mockOnSave, description: 'Save' }
      ],
      enabled: true
    }));

    fireEvent.keyDown(document, {
      key: 's',
      ctrlKey: true,
      preventDefault: jest.fn()
    });

    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('should not trigger when disabled', () => {
    renderHook(() => useKeyboardShortcuts({
      shortcuts: [
        { key: 's', cmd: true, action: mockOnSave, description: 'Save' }
      ],
      enabled: false
    }));

    fireEvent.keyDown(document, {
      key: 's',
      metaKey: true,
      preventDefault: jest.fn()
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should not trigger when focus is on input field', () => {
    // Crear un input y darle foco
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    renderHook(() => useKeyboardShortcuts({
      shortcuts: [
        { key: 's', cmd: true, action: mockOnSave, description: 'Save' }
      ],
      enabled: true
    }));

    fireEvent.keyDown(input, {
      key: 's',
      metaKey: true,
      preventDefault: jest.fn()
    });

    expect(mockOnSave).not.toHaveBeenCalled();

    // Limpiar
    document.body.removeChild(input);
  });

  it('should handle multiple shortcuts correctly', () => {
    renderHook(() => useKeyboardShortcuts({
      shortcuts: [
        { key: 's', cmd: true, action: mockOnSave, description: 'Save' },
        { key: 'z', cmd: true, action: mockOnUndo, description: 'Undo' },
        { key: 'z', cmd: true, shift: true, action: mockOnRedo, description: 'Redo' }
      ],
      enabled: true
    }));

    // Probar save
    fireEvent.keyDown(document, {
      key: 's',
      metaKey: true,
      preventDefault: jest.fn()
    });

    // Probar undo
    fireEvent.keyDown(document, {
      key: 'z',
      metaKey: true,
      preventDefault: jest.fn()
    });

    // Probar redo
    fireEvent.keyDown(document, {
      key: 'z',
      metaKey: true,
      shiftKey: true,
      preventDefault: jest.fn()
    });

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnUndo).toHaveBeenCalledTimes(1);
    expect(mockOnRedo).toHaveBeenCalledTimes(1);
  });
});

describe('useBlogEditorShortcuts Hook', () => {
  let mockOnSave: jest.Mock;
  let mockOnAddText: jest.Mock;
  let mockOnAddImage: jest.Mock;
  let mockOnAddVideo: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSave = jest.fn();
    mockOnAddText = jest.fn();
    mockOnAddImage = jest.fn();
    mockOnAddVideo = jest.fn();
  });

  it('should provide blog-specific shortcuts', () => {
    const { result } = renderHook(() => useBlogEditorShortcuts({
      onSave: mockOnSave,
      onAddText: mockOnAddText,
      onAddImage: mockOnAddImage,
      onAddVideo: mockOnAddVideo,
      enabled: true
    }));

    const shortcuts = result.current.getShortcutsHelp();
    
    expect(shortcuts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: expect.stringContaining('⌘'),
          description: expect.stringContaining('Guardar')
        }),
        expect.objectContaining({
          key: expect.stringContaining('⌘'),
          description: expect.stringContaining('texto')
        }),
        expect.objectContaining({
          key: expect.stringContaining('⌘'),
          description: expect.stringContaining('imagen')
        }),
        expect.objectContaining({
          key: expect.stringContaining('⌘'),
          description: expect.stringContaining('video')
        })
      ])
    );
  });

  it('should trigger add text on Cmd+Shift+T', () => {
    renderHook(() => useBlogEditorShortcuts({
      onSave: mockOnSave,
      onAddText: mockOnAddText,
      onAddImage: mockOnAddImage,
      onAddVideo: mockOnAddVideo,
      enabled: true
    }));

    fireEvent.keyDown(document, {
      key: 't',
      metaKey: true,
      shiftKey: true,
      preventDefault: jest.fn()
    });

    expect(mockOnAddText).toHaveBeenCalledTimes(1);
  });

  it('should trigger add image on Cmd+Shift+I', () => {
    renderHook(() => useBlogEditorShortcuts({
      onSave: mockOnSave,
      onAddText: mockOnAddText,
      onAddImage: mockOnAddImage,
      onAddVideo: mockOnAddVideo,
      enabled: true
    }));

    fireEvent.keyDown(document, {
      key: 'i',
      metaKey: true,
      shiftKey: true,
      preventDefault: jest.fn()
    });

    expect(mockOnAddImage).toHaveBeenCalledTimes(1);
  });

  it('should trigger add video on Cmd+Shift+V', () => {
    renderHook(() => useBlogEditorShortcuts({
      onSave: mockOnSave,
      onAddText: mockOnAddText,
      onAddImage: mockOnAddImage,
      onAddVideo: mockOnAddVideo,
      enabled: true
    }));

    fireEvent.keyDown(document, {
      key: 'v',
      metaKey: true,
      shiftKey: true,
      preventDefault: jest.fn()
    });

    expect(mockOnAddVideo).toHaveBeenCalledTimes(1);
  });

  it('should provide correct shortcuts for Windows platform', () => {
    // Cambiar plataforma a Windows
    Object.defineProperty(window.navigator, 'platform', {
      writable: true,
      value: 'Win32'
    });

    const { result } = renderHook(() => useBlogEditorShortcuts({
      onSave: mockOnSave,
      onAddText: mockOnAddText,
      onAddImage: mockOnAddImage,
      onAddVideo: mockOnAddVideo,
      enabled: true
    }));

    const shortcuts = result.current.getShortcutsHelp();
    
    // En Windows debería mostrar Ctrl en lugar de ⌘
    expect(shortcuts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: expect.stringContaining('Ctrl'),
          description: expect.stringContaining('Guardar')
        })
      ])
    );
  });
});