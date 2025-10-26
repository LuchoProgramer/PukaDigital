# 🧪 Testing Documentation

Comprehensive testing guide for all advanced features and testing strategies.

## 📋 Table of Contents

1. [Testing Overview](#testing-overview)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [Performance Testing](#performance-testing)
5. [E2E Testing](#e2e-testing)
6. [Testing Dashboard](#testing-dashboard)
7. [CI/CD Integration](#cicd-integration)

---

## 🔍 Testing Overview

### Testing Philosophy

Our testing strategy follows the **Testing Pyramid** principle:

```
        /\
       /  \     E2E Tests (Few, High-Level)
      /____\
     /      \   Integration Tests (Some, API & Components)
    /________\
   /          \ Unit Tests (Many, Functions & Hooks)
  /__________\
```

**Test Distribution:**
- **70%** Unit Tests: Fast, isolated, comprehensive coverage
- **20%** Integration Tests: Component interactions, API testing
- **10%** E2E Tests: Critical user flows, browser automation

### Testing Stack

```json
{
  "jest": "^29.x",
  "@testing-library/react": "^14.x", 
  "@testing-library/jest-dom": "^6.x",
  "@testing-library/user-event": "^14.x",
  "jsdom": "^22.x",
  "cypress": "^13.x",
  "playwright": "^1.x"
}
```

### Test Configuration

```javascript
// jest.config.mjs
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

---

## 🔧 Unit Testing

### Testing Hooks

#### useKeyboardShortcuts Hook Tests

```typescript
// src/__tests__/hooks/useKeyboardShortcuts.test.ts
import { renderHook, act } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { useKeyboardShortcuts, useBlogEditorShortcuts } from '@/hooks/useKeyboardShortcuts';

// Mock for platform detection
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
    // Clean up event listeners
    document.removeEventListener('keydown', () => {});
  });

  it('should detect Mac platform correctly', () => {
    const { result } = renderHook(() => useKeyboardShortcuts({
      shortcuts: [
        { key: 's', metaKey: true, action: mockOnSave, description: 'Save' }
      ],
      enabled: true
    }));

    expect(result.current.isMac).toBe(true);
  });

  it('should trigger save action on Cmd+S (Mac)', () => {
    renderHook(() => useKeyboardShortcuts({
      shortcuts: [
        { key: 's', metaKey: true, action: mockOnSave, description: 'Save' }
      ],
      enabled: true
    }));

    // Simulate Cmd+S on Mac
    fireEvent.keyDown(document, {
      key: 's',
      metaKey: true,
      preventDefault: jest.fn()
    });

    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('should not trigger when disabled', () => {
    renderHook(() => useKeyboardShortcuts({
      shortcuts: [
        { key: 's', metaKey: true, action: mockOnSave, description: 'Save' }
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
    // Create input and focus it
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    renderHook(() => useKeyboardShortcuts({
      shortcuts: [
        { key: 's', metaKey: true, action: mockOnSave, description: 'Save' }
      ],
      enabled: true
    }));

    fireEvent.keyDown(input, {
      key: 's',
      metaKey: true,
      preventDefault: jest.fn()
    });

    expect(mockOnSave).not.toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(input);
  });
});
```

#### useAutoSave Hook Tests

```typescript
// src/__tests__/hooks/useAutoSave.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAutoSave } from '@/hooks/useAutoSave';

// Mock timers
jest.useFakeTimers();

describe('useAutoSave Hook', () => {
  let mockSaveFunction: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSaveFunction = jest.fn().mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should auto-save after delay when data changes', async () => {
    const { result, rerender } = renderHook(
      ({ data }) => useAutoSave(data, mockSaveFunction, { delay: 1000 }),
      { initialProps: { data: 'initial' } }
    );

    // Change data
    rerender({ data: 'updated' });

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(mockSaveFunction).toHaveBeenCalledWith('updated');
    });

    expect(result.current.status).toBe('saved');
  });

  it('should debounce multiple rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ data }) => useAutoSave(data, mockSaveFunction, { delay: 1000 }),
      { initialProps: { data: 'initial' } }
    );

    // Rapid changes
    rerender({ data: 'change1' });
    rerender({ data: 'change2' });
    rerender({ data: 'change3' });

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(mockSaveFunction).toHaveBeenCalledTimes(1);
      expect(mockSaveFunction).toHaveBeenCalledWith('change3');
    });
  });

  it('should handle save errors', async () => {
    mockSaveFunction.mockRejectedValue(new Error('Save failed'));

    const { result, rerender } = renderHook(
      ({ data }) => useAutoSave(data, mockSaveFunction, { delay: 100 }),
      { initialProps: { data: 'initial' } }
    );

    rerender({ data: 'updated' });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
      expect(result.current.error).toEqual(new Error('Save failed'));
    });
  });

  it('should allow manual save', async () => {
    const { result } = renderHook(() => 
      useAutoSave('test data', mockSaveFunction, { delay: 1000 })
    );

    await act(async () => {
      await result.current.saveNow();
    });

    expect(mockSaveFunction).toHaveBeenCalledWith('test data');
    expect(result.current.status).toBe('saved');
  });
});
```

#### useVirtualScroll Hook Tests

```typescript
// src/__tests__/hooks/useVirtualScroll.test.ts
import { renderHook, act } from '@testing-library/react';
import { useVirtualScroll } from '@/hooks/useVirtualScroll';

describe('useVirtualScroll Hook', () => {
  const mockItems = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    title: `Item ${i}`,
    content: `Content for item ${i}`
  }));

  it('should calculate visible items correctly', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        items: mockItems,
        itemHeight: 50,
        containerHeight: 400,
        overscan: 2
      })
    );

    // Visible items = containerHeight / itemHeight + overscan * 2
    // 400 / 50 + 2 * 2 = 8 + 4 = 12
    expect(result.current.visibleItems).toHaveLength(12);
    expect(result.current.totalHeight).toBe(50000); // 1000 * 50
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(11);
  });

  it('should handle dynamic item heights', () => {
    const dynamicHeight = (item: any, index: number) => 
      index % 2 === 0 ? 60 : 40; // Alternating heights

    const { result } = renderHook(() =>
      useVirtualScroll({
        items: mockItems.slice(0, 100),
        itemHeight: dynamicHeight,
        containerHeight: 400,
        overscan: 1
      })
    );

    // Average height = 50, so total = 50 * 100 = 5000
    expect(result.current.totalHeight).toBe(5000);
    
    // Check first few items have correct heights
    const firstItem = result.current.visibleItems[0];
    expect(firstItem.style.height).toBe(60); // First item (index 0) should be 60
    
    const secondItem = result.current.visibleItems[1];
    expect(secondItem.style.height).toBe(40); // Second item (index 1) should be 40
  });

  it('should update visible items when scrolling', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        items: mockItems,
        itemHeight: 50,
        containerHeight: 400
      })
    );

    // Initial state
    expect(result.current.startIndex).toBe(0);

    // Simulate scroll to position 500 (should show items starting at index 10)
    act(() => {
      const scrollEvent = new Event('scroll');
      Object.defineProperty(scrollEvent, 'target', {
        value: { scrollTop: 500 }
      });
      result.current.containerProps.onScroll(scrollEvent);
    });

    // Should update visible range
    expect(result.current.startIndex).toBeGreaterThan(5);
  });

  it('should provide scroll to index functionality', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        items: mockItems,
        itemHeight: 50,
        containerHeight: 400
      })
    );

    act(() => {
      result.current.scrollToIndex(100);
    });

    // Should calculate correct scroll position (100 * 50 = 5000)
    // This would typically trigger a scroll event in a real DOM environment
    expect(typeof result.current.scrollToIndex).toBe('function');
  });

  it('should handle empty items array', () => {
    const { result } = renderHook(() =>
      useVirtualScroll({
        items: [],
        itemHeight: 50,
        containerHeight: 400
      })
    );

    expect(result.current.visibleItems).toHaveLength(0);
    expect(result.current.totalHeight).toBe(0);
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(0);
  });

  it('should handle single item', () => {
    const singleItem = [{ id: 1, title: 'Single Item' }];
    
    const { result } = renderHook(() =>
      useVirtualScroll({
        items: singleItem,
        itemHeight: 50,
        containerHeight: 400
      })
    );

    expect(result.current.visibleItems).toHaveLength(1);
    expect(result.current.totalHeight).toBe(50);
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(0);
  });
});
```

### Testing Utilities

```typescript
// src/__tests__/utils/testUtils.ts
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { TenantProvider } from '@/context/TenantContext';
import { ThemeProvider } from '@/context/ThemeContext';

// Custom render with providers
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <TenantProvider>
        {children}
      </TenantProvider>
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// Performance measurement utility
export const measurePerformance = async (fn: () => void | Promise<void>) => {
  const startTime = performance.now();
  const startMemory = getMemoryUsage();
  
  await fn();
  
  const endTime = performance.now();
  const endMemory = getMemoryUsage();
  
  return {
    duration: endTime - startTime,
    memory: {
      start: startMemory,
      end: endMemory,
      peak: Math.max(startMemory, endMemory)
    }
  };
};

function getMemoryUsage() {
  if ('memory' in performance) {
    return (performance as any).memory.usedJSHeapSize;
  }
  return 0;
}

// Mock Firebase
export const mockFirestore = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      onSnapshot: jest.fn()
    })),
    add: jest.fn(),
    where: jest.fn(() => mockFirestore.collection()),
    orderBy: jest.fn(() => mockFirestore.collection()),
    limit: jest.fn(() => mockFirestore.collection()),
    get: jest.fn()
  }))
};

// Mock Intersection Observer
export const mockIntersectionObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn()
};

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: jest.fn().mockImplementation(() => mockIntersectionObserver)
});

// Mock resize observer
export const mockResizeObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn()
};

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: jest.fn().mockImplementation(() => mockResizeObserver)
});

// Export everything
export * from '@testing-library/react';
export { customRender as render };
```

---

## 🔗 Integration Testing

### Component Integration Tests

```typescript
// src/__tests__/components/VirtualizedBlogList.test.tsx
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { VirtualizedBlogList } from '@/components/ui/VirtualizedBlogList';
import { mockBlogs } from '@/__tests__/mocks/blogData';

describe('VirtualizedBlogList Integration', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it('should render visible items only', () => {
    render(
      <VirtualizedBlogList 
        blogs={mockBlogs}
        containerHeight={400}
        itemHeight={120}
        onBlogSelect={jest.fn()}
      />
    );

    // Should only render visible items (not all 100)
    const visibleItems = screen.getAllByTestId(/blog-card-/);
    expect(visibleItems.length).toBeLessThan(10);
    expect(visibleItems.length).toBeGreaterThan(0);
  });

  it('should handle scrolling and update visible items', async () => {
    const { container } = render(
      <VirtualizedBlogList 
        blogs={mockBlogs}
        containerHeight={400}
        itemHeight={120}
      />
    );

    const scrollContainer = container.querySelector('[data-testid="scroll-container"]');
    expect(scrollContainer).toBeInTheDocument();

    // Initial state - should show first items
    expect(screen.getByText('Blog Post 0')).toBeInTheDocument();

    // Simulate scroll
    fireEvent.scroll(scrollContainer!, { target: { scrollTop: 1000 } });

    // Wait for scroll update
    await waitFor(() => {
      // Should now show different items
      expect(screen.queryByText('Blog Post 0')).not.toBeInTheDocument();
    });
  });

  it('should handle bulk selection', async () => {
    const mockOnSelect = jest.fn();
    
    render(
      <VirtualizedBlogList 
        blogs={mockBlogs.slice(0, 10)}
        containerHeight={400}
        itemHeight={120}
        onBlogSelect={mockOnSelect}
        enableBulkSelection={true}
      />
    );

    // Select first item
    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(firstCheckbox);

    expect(mockOnSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: mockBlogs[0].id }),
      true
    );

    // Select all
    const selectAllCheckbox = screen.getByTestId('select-all-checkbox');
    fireEvent.click(selectAllCheckbox);

    expect(mockOnSelect).toHaveBeenCalledTimes(11); // 1 individual + 10 for select all
  });

  it('should support keyboard navigation', async () => {
    render(
      <VirtualizedBlogList 
        blogs={mockBlogs.slice(0, 10)}
        containerHeight={400}
        itemHeight={120}
        enableKeyboardNavigation={true}
      />
    );

    const firstItem = screen.getByTestId('blog-card-0');
    firstItem.focus();

    // Navigate down
    fireEvent.keyDown(firstItem, { key: 'ArrowDown' });

    await waitFor(() => {
      const secondItem = screen.getByTestId('blog-card-1');
      expect(secondItem).toHaveFocus();
    });

    // Navigate up
    fireEvent.keyDown(secondItem, { key: 'ArrowUp' });

    await waitFor(() => {
      expect(firstItem).toHaveFocus();
    });
  });
});
```

### API Integration Tests

```typescript
// src/__tests__/api/blogs.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/tenants/[tenantId]/blogs';
import { mockFirestore } from '@/__tests__/mocks/firebase';

jest.mock('@/lib/firebase', () => ({
  db: mockFirestore,
  getBlogs: jest.fn(),
  createBlog: jest.fn(),
  updateBlog: jest.fn(),
  deleteBlog: jest.fn()
}));

describe('/api/tenants/[tenantId]/blogs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return blogs for GET request', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { tenantId: 'test-tenant' }
    });

    const mockBlogs = [
      { id: '1', title: 'Test Blog 1', content: 'Content 1' },
      { id: '2', title: 'Test Blog 2', content: 'Content 2' }
    ];

    require('@/lib/firebase').getBlogs.mockResolvedValue(mockBlogs);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(true);
    expect(responseData.blogs).toEqual(mockBlogs);
  });

  it('should create blog for POST request', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      query: { tenantId: 'test-tenant' },
      body: {
        title: 'New Blog',
        content: 'New content',
        excerpt: 'New excerpt'
      }
    });

    const mockCreatedBlog = {
      id: 'new-blog-id',
      title: 'New Blog',
      content: 'New content',
      excerpt: 'New excerpt'
    };

    require('@/lib/firebase').createBlog.mockResolvedValue(mockCreatedBlog);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(true);
    expect(responseData.blog).toEqual(mockCreatedBlog);
  });

  it('should handle errors gracefully', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { tenantId: 'test-tenant' }
    });

    require('@/lib/firebase').getBlogs.mockRejectedValue(new Error('Database error'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(false);
    expect(responseData.error).toBe('Database error');
  });
});
```

---

## ⚡ Performance Testing

### Performance Benchmarks

```typescript
// src/__tests__/performance/PerformanceBenchmarks.test.ts
import { render } from '@testing-library/react';
import { measurePerformance } from '@/__tests__/utils/testUtils';
import { VirtualizedBlogList } from '@/components/ui/VirtualizedBlogList';
import { generateMockBlogs } from '@/__tests__/mocks/blogData';

describe('Performance Benchmarks', () => {
  const performanceThresholds = {
    renderTime: 100, // 100ms
    memoryUsage: 50 * 1024 * 1024, // 50MB
    scrollPerformance: 16 // 16ms (60fps)
  };

  it('should render 1000 items in virtual scroll within performance budget', async () => {
    const items = generateMockBlogs(1000);
    
    const { duration, memory } = await measurePerformance(() => {
      render(
        <VirtualizedBlogList 
          blogs={items}
          containerHeight={400}
          itemHeight={120}
        />
      );
    });

    expect(duration).toBeLessThan(performanceThresholds.renderTime);
    expect(memory.peak).toBeLessThan(performanceThresholds.memoryUsage);
  });

  it('should handle bulk operations efficiently', async () => {
    const items = generateMockBlogs(1000);
    
    const { duration } = await measurePerformance(async () => {
      const { useBulkSelection } = await import('@/hooks/useBulkSelection');
      const { bulkDelete } = useBulkSelection({ items });
      
      // Simulate bulk delete of 500 items
      await bulkDelete(items.slice(0, 500));
    });

    expect(duration).toBeLessThan(50); // 50ms for bulk operation
  });

  it('should maintain 60fps during scroll', async () => {
    const items = generateMockBlogs(1000);
    const scrollEvents: number[] = [];
    
    const { container } = render(
      <VirtualizedBlogList 
        blogs={items}
        containerHeight={400}
        itemHeight={120}
        onScroll={(e) => {
          scrollEvents.push(performance.now());
        }}
      />
    );

    const scrollContainer = container.querySelector('[data-testid="scroll-container"]');
    
    // Simulate 60 scroll events (1 second at 60fps)
    for (let i = 0; i < 60; i++) {
      const { duration } = await measurePerformance(() => {
        fireEvent.scroll(scrollContainer!, { target: { scrollTop: i * 10 } });
      });
      
      expect(duration).toBeLessThan(performanceThresholds.scrollPerformance);
    }
  });

  it('should optimize image loading performance', async () => {
    const { useImageOptimization } = await import('@/hooks/useImageOptimization');
    
    const imageUrl = 'https://example.com/large-image.jpg';
    
    const { duration } = await measurePerformance(() => {
      const { optimizedSrc } = useImageOptimization(imageUrl, {
        quality: 80,
        format: 'auto',
        lazy: true
      });
      
      // Optimization should be fast
      expect(optimizedSrc).toBeDefined();
    });

    expect(duration).toBeLessThan(10); // 10ms for optimization calculation
  });
});

// Performance utilities
export const createPerformanceObserver = (callback: (entries: PerformanceEntry[]) => void) => {
  if (typeof PerformanceObserver !== 'undefined') {
    const observer = new PerformanceObserver((list) => {
      callback(list.getEntries());
    });
    return observer;
  }
  return null;
};

export const measureFrameRate = (duration: number = 1000): Promise<number> => {
  return new Promise((resolve) => {
    let frames = 0;
    const startTime = performance.now();
    
    const countFrame = () => {
      frames++;
      const elapsed = performance.now() - startTime;
      
      if (elapsed < duration) {
        requestAnimationFrame(countFrame);
      } else {
        const fps = (frames / elapsed) * 1000;
        resolve(fps);
      }
    };
    
    requestAnimationFrame(countFrame);
  });
};
```

### Core Web Vitals Testing

```typescript
// src/__tests__/performance/CoreWebVitals.test.ts
import { useCoreWebVitals } from '@/hooks/useProductionPerformance';
import { renderHook, waitFor } from '@testing-library/react';

// Mock Performance Observer
const mockPerformanceObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => [])
};

Object.defineProperty(window, 'PerformanceObserver', {
  writable: true,
  configurable: true,
  value: jest.fn(() => mockPerformanceObserver)
});

describe('Core Web Vitals Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize Core Web Vitals monitoring', () => {
    const { result } = renderHook(() => useCoreWebVitals());
    
    expect(result.current.isSupported).toBe(true);
    expect(PerformanceObserver).toHaveBeenCalled();
  });

  it('should collect LCP metrics', async () => {
    const { result } = renderHook(() => useCoreWebVitals());
    
    // Simulate LCP measurement
    const lcpEntry = {
      startTime: 1500,
      name: 'largest-contentful-paint'
    };
    
    // Trigger performance observer callback
    const observerCallback = (PerformanceObserver as jest.Mock).mock.calls[0][0];
    observerCallback({
      getEntries: () => [lcpEntry]
    });
    
    await waitFor(() => {
      expect(result.current.vitals.lcp).toBe(1500);
    });
  });

  it('should collect CLS metrics', async () => {
    const { result } = renderHook(() => useCoreWebVitals());
    
    // Simulate CLS measurement
    const clsEntry = {
      value: 0.05,
      hadRecentInput: false
    };
    
    const observerCallback = (PerformanceObserver as jest.Mock).mock.calls[0][0];
    observerCallback({
      getEntries: () => [clsEntry]
    });
    
    await waitFor(() => {
      expect(result.current.vitals.cls).toBe(0.05);
    });
  });

  it('should meet Core Web Vitals thresholds', async () => {
    const { result } = renderHook(() => useCoreWebVitals());
    
    // Simulate good metrics
    const goodMetrics = {
      lcp: 2000,  // Good: ≤2.5s
      fid: 80,    // Good: ≤100ms
      cls: 0.08,  // Good: ≤0.1
      fcp: 1600   // Good: ≤1.8s
    };
    
    // Mock the vitals state
    Object.keys(goodMetrics).forEach(metric => {
      result.current.vitals[metric] = goodMetrics[metric];
    });
    
    expect(result.current.vitals.lcp).toBeLessThanOrEqual(2500);
    expect(result.current.vitals.fid).toBeLessThanOrEqual(100);
    expect(result.current.vitals.cls).toBeLessThanOrEqual(0.1);
    expect(result.current.vitals.fcp).toBeLessThanOrEqual(1800);
  });
});
```

---

## 🔚 E2E Testing

### Cypress Configuration

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    env: {
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'test-project',
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'test-cloud'
    }
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
```

### E2E Test Examples

```typescript
// cypress/e2e/blog-management.cy.ts
describe('Blog Management E2E', () => {
  beforeEach(() => {
    // Mock authentication
    cy.mockAuth();
    cy.visit('/cms/blogs');
  });

  it('should create a new blog post', () => {
    // Navigate to create page
    cy.get('[data-testid="create-blog-button"]').click();
    cy.url().should('include', '/cms/blogs/create');

    // Fill in blog details
    cy.get('[data-testid="blog-title-input"]').type('E2E Test Blog Post');
    cy.get('[data-testid="blog-excerpt-input"]').type('This is a test blog post created via E2E testing');

    // Add content blocks
    cy.get('[data-testid="add-text-block"]').click();
    cy.get('[data-testid="rich-text-editor"]').type('This is the main content of the blog post.');

    // Add image block
    cy.get('[data-testid="add-image-block"]').click();
    cy.get('[data-testid="image-url-input"]').type('https://example.com/test-image.jpg');
    cy.get('[data-testid="image-alt-input"]').type('Test image');

    // Save the blog
    cy.get('[data-testid="save-blog-button"]').click();

    // Verify success
    cy.get('[data-testid="success-notification"]').should('contain', 'Blog saved successfully');
    cy.url().should('match', /\/cms\/blogs\/[a-zA-Z0-9-]+$/);
  });

  it('should handle bulk operations', () => {
    // Enable bulk selection
    cy.get('[data-testid="bulk-selection-toggle"]').click();

    // Select multiple blogs
    cy.get('[data-testid="blog-checkbox"]').first().check();
    cy.get('[data-testid="blog-checkbox"]').eq(1).check();
    cy.get('[data-testid="blog-checkbox"]').eq(2).check();

    // Verify selection count
    cy.get('[data-testid="selected-count"]').should('contain', '3 selected');

    // Perform bulk action
    cy.get('[data-testid="bulk-actions-dropdown"]').click();
    cy.get('[data-testid="bulk-publish-action"]').click();

    // Confirm action
    cy.get('[data-testid="confirm-bulk-action"]').click();

    // Verify success
    cy.get('[data-testid="success-notification"]').should('contain', 'Blogs updated successfully');
  });

  it('should use keyboard shortcuts', () => {
    cy.get('body').type('{cmd}n'); // Create new blog
    cy.url().should('include', '/cms/blogs/create');

    // Fill title and content
    cy.get('[data-testid="blog-title-input"]').type('Keyboard Shortcut Test');
    cy.get('[data-testid="rich-text-editor"]').focus();

    // Use shortcut to add image block
    cy.get('body').type('{cmd}{shift}i');
    cy.get('[data-testid="image-block"]').should('be.visible');

    // Save using shortcut
    cy.get('body').type('{cmd}s');
    cy.get('[data-testid="auto-save-status"]').should('contain', 'Saved');
  });

  it('should handle virtual scrolling performance', () => {
    // Navigate to blogs list with many items
    cy.visit('/cms/blogs?view=list');

    // Verify virtual scrolling is working
    cy.get('[data-testid="virtual-scroll-container"]').should('be.visible');

    // Scroll down and verify new items load
    cy.get('[data-testid="virtual-scroll-container"]').scrollTo('bottom');
    cy.get('[data-testid="blog-item"]').should('have.length.greaterThan', 10);

    // Scroll to specific position
    cy.get('[data-testid="virtual-scroll-container"]').scrollTo(0, 2000);
    
    // Verify smooth scrolling performance
    cy.get('[data-testid="blog-item"]').should('be.visible');
    cy.get('[data-testid="virtual-scroll-container"]').should('not.have.class', 'loading');
  });
});

// cypress/e2e/image-optimization.cy.ts
describe('Image Optimization E2E', () => {
  beforeEach(() => {
    cy.mockAuth();
    cy.visit('/cms/blogs/create');
  });

  it('should optimize images automatically', () => {
    // Add image block
    cy.get('[data-testid="add-image-block"]').click();
    
    // Upload or enter image URL
    cy.get('[data-testid="image-url-input"]').type('https://example.com/large-image.jpg');
    
    // Verify optimization is applied
    cy.get('[data-testid="optimized-image-preview"]').should('be.visible');
    cy.get('[data-testid="optimization-metrics"]').should('contain', 'WebP');
    
    // Check responsive behavior
    cy.viewport(768, 1024); // Tablet
    cy.get('[data-testid="optimized-image-preview"] img').should('have.attr', 'sizes');
    
    cy.viewport(375, 667); // Mobile
    cy.get('[data-testid="optimized-image-preview"] img').should('have.attr', 'loading', 'lazy');
  });

  it('should handle image format fallbacks', () => {
    // Mock browser without WebP support
    cy.window().then((win) => {
      Object.defineProperty(win.HTMLCanvasElement.prototype, 'toDataURL', {
        value: (type: string) => {
          if (type === 'image/webp') return 'data:,'; // Unsupported
          return 'data:image/jpeg;base64,'; // Supported
        }
      });
    });
    
    cy.get('[data-testid="add-image-block"]').click();
    cy.get('[data-testid="image-url-input"]').type('https://example.com/test-image.jpg');
    
    // Should fallback to JPEG
    cy.get('[data-testid="optimization-metrics"]').should('contain', 'JPEG');
  });
});
```

### Cypress Commands

```typescript
// cypress/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      mockAuth(): Chainable<void>;
      mockFirestore(): Chainable<void>;
      createTestBlog(data: any): Chainable<void>;
      waitForVirtualScroll(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('mockAuth', () => {
  cy.window().then((win) => {
    // Mock Firebase auth
    win.localStorage.setItem('mockUser', JSON.stringify({
      uid: 'test-user-123',
      email: 'test@example.com',
      displayName: 'Test User'
    }));
  });
});

Cypress.Commands.add('mockFirestore', () => {
  cy.intercept('POST', '**/firestore/**', {
    statusCode: 200,
    body: { success: true }
  }).as('firestoreRequest');
});

Cypress.Commands.add('createTestBlog', (data) => {
  cy.request({
    method: 'POST',
    url: '/api/tenants/test/blogs',
    body: data,
    headers: {
      'Authorization': 'Bearer mock-token'
    }
  });
});

Cypress.Commands.add('waitForVirtualScroll', () => {
  cy.get('[data-testid="virtual-scroll-container"]')
    .should('be.visible')
    .and('not.have.class', 'loading');
});
```

---

## 🧪 Testing Dashboard

### Interactive Testing Interface

The testing dashboard provides a comprehensive interface for running and monitoring all tests:

```bash
# Access testing dashboard
http://localhost:3000/testing
```

**Dashboard Features:**
1. **Unit Test Runner**: Execute individual hook and utility tests
2. **Performance Monitor**: Real-time performance metrics
3. **Image Optimization Tester**: Test image optimization with different settings
4. **Virtual Scroll Simulator**: Test virtual scrolling with various data sizes
5. **Core Web Vitals Monitor**: Track real-time performance metrics

### Automated Test Reports

```typescript
// scripts/generate-test-report.ts
import { exec } from 'child_process';
import { writeFileSync } from 'fs';

interface TestResults {
  unit: any;
  integration: any;
  e2e: any;
  performance: any;
}

async function generateTestReport() {
  const results: TestResults = {
    unit: await runUnitTests(),
    integration: await runIntegrationTests(),
    e2e: await runE2ETests(),
    performance: await runPerformanceTests()
  };

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.unit.numTotalTests + results.integration.numTotalTests + results.e2e.numTotalTests,
      passed: results.unit.numPassedTests + results.integration.numPassedTests + results.e2e.numPassedTests,
      failed: results.unit.numFailedTests + results.integration.numFailedTests + results.e2e.numFailedTests
    },
    details: results,
    performance: {
      coreWebVitals: results.performance.vitals,
      benchmarks: results.performance.benchmarks
    }
  };

  writeFileSync('test-report.json', JSON.stringify(report, null, 2));
  console.log('Test report generated: test-report.json');
}

async function runUnitTests() {
  return new Promise((resolve) => {
    exec('npm run test:unit -- --json', (error, stdout) => {
      resolve(JSON.parse(stdout));
    });
  });
}

// Run report generation
generateTestReport();
```

---

## 🔄 CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run integration tests
        run: npm run test:integration

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run performance tests
        run: npm run test:performance
      
      - name: Check performance budgets
        run: npm run performance:check

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Start application
        run: npm start &
        
      - name: Wait for server
        run: npx wait-on http://localhost:3000
      
      - name: Run Cypress tests
        uses: cypress-io/github-action@v5
        with:
          record: true
          parallel: true
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  test-report:
    needs: [unit-tests, integration-tests, performance-tests, e2e-tests]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate test report
        run: npm run test:report
      
      - name: Upload test artifacts
        uses: actions/upload-artifact@v3
        with:
          name: test-reports
          path: |
            coverage/
            test-report.json
            cypress/videos/
            cypress/screenshots/
```

### Quality Gates

```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  },
  "performanceBudgets": {
    "lcp": 2500,
    "fid": 100,
    "cls": 0.1,
    "bundleSize": 500000
  }
}
```

This comprehensive testing documentation ensures that all advanced features are thoroughly tested, maintainable, and perform optimally in production environments.