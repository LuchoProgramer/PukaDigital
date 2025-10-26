import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import useAutoSave from '@/hooks/useAutoSave';

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  updateBlog: jest.fn(),
  createBlog: jest.fn()
}));

describe('useAutoSave Hook', () => {
  let mockOnSave: jest.Mock;
  let mockGetData: jest.Mock;
  let mockIsValid: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    mockOnSave = jest.fn().mockResolvedValue(undefined);
    mockGetData = jest.fn().mockReturnValue({ title: 'Test', content: 'Test content' });
    mockIsValid = jest.fn().mockReturnValue(true);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAutoSave({
      interval: 1000,
      enabled: true,
      onSave: mockOnSave,
      getData: mockGetData,
      isValid: mockIsValid
    }));

    expect(result.current.lastSaved).toBeNull();
    expect(result.current.isSaving).toBe(false);
    expect(result.current.hasUnsavedChanges).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should mark as changed when markAsChanged is called', () => {
    const { result } = renderHook(() => useAutoSave({
      interval: 1000,
      enabled: true,
      onSave: mockOnSave,
      getData: mockGetData,
      isValid: mockIsValid
    }));

    act(() => {
      result.current.markAsChanged();
    });

    expect(result.current.hasUnsavedChanges).toBe(true);
  });

  it('should trigger auto-save after interval', async () => {
    const { result } = renderHook(() => useAutoSave({
      interval: 1000,
      enabled: true,
      onSave: mockOnSave,
      getData: mockGetData,
      isValid: mockIsValid
    }));

    // Marcar como cambiado
    act(() => {
      result.current.markAsChanged();
    });

    // Avanzar tiempo
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({ title: 'Test', content: 'Test content' });
    });
  });

  it('should not auto-save when disabled', async () => {
    const { result } = renderHook(() => useAutoSave({
      interval: 1000,
      enabled: false,
      onSave: mockOnSave,
      getData: mockGetData,
      isValid: mockIsValid
    }));

    act(() => {
      result.current.markAsChanged();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should not auto-save when data is invalid', async () => {
    mockIsValid.mockReturnValue(false);

    const { result } = renderHook(() => useAutoSave({
      interval: 1000,
      enabled: true,
      onSave: mockOnSave,
      getData: mockGetData,
      isValid: mockIsValid
    }));

    act(() => {
      result.current.markAsChanged();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should handle save errors gracefully', async () => {
    const errorMessage = 'Save failed';
    mockOnSave.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAutoSave({
      interval: 1000,
      enabled: true,
      onSave: mockOnSave,
      getData: mockGetData,
      isValid: mockIsValid
    }));

    act(() => {
      result.current.markAsChanged();
    });

    await act(async () => {
      const success = await result.current.saveNow();
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.isSaving).toBe(false);
  });

  it('should provide correct time since last save', () => {
    const { result } = renderHook(() => useAutoSave({
      interval: 1000,
      enabled: true,
      onSave: mockOnSave,
      getData: mockGetData,
      isValid: mockIsValid
    }));

    // Simular que se guardó hace 30 segundos
    const thirtySecondsAgo = new Date(Date.now() - 30000);
    
    act(() => {
      result.current.markAsSaved();
    });

    // Mock Date.now para simular tiempo transcurrido
    const originalDateNow = Date.now;
    Date.now = jest.fn(() => thirtySecondsAgo.getTime() + 30000);

    const timeSinceLastSave = result.current.getTimeSinceLastSave();
    expect(timeSinceLastSave).toBeGreaterThanOrEqual(29000);
    expect(timeSinceLastSave).toBeLessThanOrEqual(31000);

    // Restaurar Date.now
    Date.now = originalDateNow;
  });

  it('should provide user-friendly last saved text', () => {
    const { result } = renderHook(() => useAutoSave({
      interval: 1000,
      enabled: true,
      onSave: mockOnSave,
      getData: mockGetData,
      isValid: mockIsValid
    }));

    // Sin guardado previo
    expect(result.current.getLastSavedText()).toBe('Nunca guardado');

    // Simular guardado reciente
    act(() => {
      result.current.markAsSaved();
    });

    const lastSavedText = result.current.getLastSavedText();
    expect(lastSavedText).toContain('Guardado recientemente');
  });

  it('should handle manual save correctly', async () => {
    const { result } = renderHook(() => useAutoSave({
      interval: 1000,
      enabled: true,
      onSave: mockOnSave,
      getData: mockGetData,
      isValid: mockIsValid
    }));

    act(() => {
      result.current.markAsChanged();
    });

    let saveSuccess: boolean = false;
    await act(async () => {
      saveSuccess = await result.current.saveNow();
    });

    expect(saveSuccess).toBe(true);
    expect(mockOnSave).toHaveBeenCalledWith({ title: 'Test', content: 'Test content' });
    expect(result.current.hasUnsavedChanges).toBe(false);
    expect(result.current.lastSaved).toBeTruthy();
  });
});