"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import VirtualizedBlogList from '@/components/VirtualizedBlogList';
import { usePerformanceMonitor, useDebounce, useCache } from '@/hooks/usePerformance';
import { useVirtualScroll } from '@/hooks/useVirtualScroll';
import { Blog } from '@/types';
import { 
  FiZap, FiActivity, FiDatabase, FiCpu, FiMonitor, 
  FiPlay, FiPause, FiRefreshCw, FiSettings, FiBarChart
} from 'react-icons/fi';

// Mock data para testing
const generateMockBlogs = (count: number): Blog[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `blog-${index + 1}`,
    title: `Blog Post ${index + 1}: ${
      ['Advanced React Patterns', 'Next.js Performance', 'TypeScript Tips', 
       'UI/UX Best Practices', 'Web Performance', 'Modern CSS'][index % 6]
    }`,
    content: `<p>Este es el contenido del blog ${index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`,
    excerpt: `Resumen del blog ${index + 1}. Una descripción breve y concisa del contenido.`,
    slug: `blog-post-${index + 1}`,
    image: index % 3 === 0 ? `https://picsum.photos/400/200?random=${index}` : undefined,
    alt: `Imagen del blog ${index + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    blocks: [],
    author: {
      name: ['Luis Viteri', 'María García', 'Carlos López', 'Ana Martínez'][index % 4],
      userId: `user-${index % 4 + 1}`
    }
  }));
};

interface PerformanceTestResult {
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'poor';
  description: string;
}

const PerformanceOptimizationTest: React.FC = () => {
  const [blogCount, setBlogCount] = useState(100);
  const [blogs, setBlogs] = useState<Blog[]>(() => generateMockBlogs(100));
  const [selectedBlogs, setSelectedBlogs] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isVirtualized, setIsVirtualized] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [performanceResults, setPerformanceResults] = useState<PerformanceTestResult[]>([]);

  // Performance monitoring
  const { getMetrics, logMetrics } = usePerformanceMonitor('PerformanceTest');
  
  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Cache para resultados de búsqueda
  const searchCache = useCache<Blog[]>(60000); // 1 minuto

  // Filtrar blogs con cache
  const filteredBlogs = useMemo(() => {
    if (!debouncedSearchTerm) return blogs;

    const cacheKey = `search-${debouncedSearchTerm}-${blogs.length}`;
    const cached = searchCache.get(cacheKey);
    if (cached) return cached;

    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    searchCache.set(cacheKey, filtered);
    return filtered;
  }, [blogs, debouncedSearchTerm, searchCache]);

  // Handlers optimizados
  const handleToggleSelect = useCallback((blogId: string) => {
    setSelectedBlogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blogId)) {
        newSet.delete(blogId);
      } else {
        newSet.add(blogId);
      }
      return newSet;
    });
  }, []);

  const handleEdit = useCallback((id: string) => {
    console.log('Editing blog:', id);
  }, []);

  const handleDelete = useCallback((id: string, title: string) => {
    console.log('Deleting blog:', id, title);
  }, []);

  const handleView = useCallback((slug: string) => {
    console.log('Viewing blog:', slug);
  }, []);

  // Generar nueva cantidad de blogs
  const generateBlogs = useCallback((count: number) => {
    const start = performance.now();
    const newBlogs = generateMockBlogs(count);
    const end = performance.now();
    
    setBlogs(newBlogs);
    setBlogCount(count);
    setSelectedBlogs(new Set());
    
    console.log(`Generated ${count} blogs in ${(end - start).toFixed(2)}ms`);
  }, []);

  // Ejecutar test de performance
  const runPerformanceTest = useCallback(() => {
    setIsMonitoring(true);
    
    const tests: PerformanceTestResult[] = [];
    
    // Test 1: Tiempo de renderizado
    const renderStart = performance.now();
    setTimeout(() => {
      const renderTime = performance.now() - renderStart;
      tests.push({
        name: 'Render Time',
        value: renderTime,
        unit: 'ms',
        status: renderTime < 16 ? 'excellent' : renderTime < 50 ? 'good' : renderTime < 100 ? 'warning' : 'poor',
        description: 'Tiempo para renderizar la lista completa'
      });
    }, 0);

    // Test 2: Memoria utilizada
    if ((performance as any).memory) {
      const memoryUsed = (performance as any).memory.usedJSHeapSize / 1024 / 1024;
      tests.push({
        name: 'Memory Usage',
        value: memoryUsed,
        unit: 'MB',
        status: memoryUsed < 50 ? 'excellent' : memoryUsed < 100 ? 'good' : memoryUsed < 200 ? 'warning' : 'poor',
        description: 'Memoria JavaScript utilizada'
      });
    }

    // Test 3: Métricas del componente
    const metrics = getMetrics();
    tests.push({
      name: 'Render Count',
      value: metrics.totalRenders,
      unit: 'renders',
      status: metrics.totalRenders < 10 ? 'excellent' : metrics.totalRenders < 25 ? 'good' : metrics.totalRenders < 50 ? 'warning' : 'poor',
      description: 'Número total de re-renderizados'
    });

    tests.push({
      name: 'Avg Render Time',
      value: metrics.avgRenderTime,
      unit: 'ms',
      status: metrics.avgRenderTime < 5 ? 'excellent' : metrics.avgRenderTime < 16 ? 'good' : metrics.avgRenderTime < 50 ? 'warning' : 'poor',
      description: 'Tiempo promedio de renderizado'
    });

    // Test 4: Items en cache
    tests.push({
      name: 'Cache Efficiency',
      value: searchCache.size(),
      unit: 'items',
      status: searchCache.size() > 0 ? 'excellent' : 'warning',
      description: 'Elementos en caché de búsqueda'
    });

    setTimeout(() => {
      setPerformanceResults(tests);
      setIsMonitoring(false);
    }, 1000);
  }, [getMetrics, searchCache]);

  const getStatusColor = (status: PerformanceTestResult['status']) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: PerformanceTestResult['status']) => {
    switch (status) {
      case 'excellent': return '🟢';
      case 'good': return '🔵';
      case 'warning': return '🟡';
      case 'poor': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiZap className="text-yellow-500" />
            Performance Optimization Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Testing de optimizaciones de rendimiento y virtualización
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={runPerformanceTest}
            disabled={isMonitoring}
            leftIcon={isMonitoring ? <FiActivity className="animate-pulse" /> : <FiPlay />}
          >
            {isMonitoring ? 'Monitoreando...' : 'Test Performance'}
          </Button>
          <Button
            onClick={logMetrics}
            variant="outline"
            leftIcon={<FiBarChart />}
          >
            Log Métricas
          </Button>
        </div>
      </div>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiSettings />
            Configuración de Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cantidad de Blogs</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={blogCount}
                  onChange={(e) => setBlogCount(parseInt(e.target.value) || 100)}
                  min="10"
                  max="10000"
                  className="flex-1"
                />
                <Button
                  onClick={() => generateBlogs(blogCount)}
                  size="sm"
                  leftIcon={<FiRefreshCw />}
                >
                  Generar
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Modo de Vista</label>
              <Button
                onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
                variant="outline"
                className="w-full"
              >
                {viewMode === 'grid' ? 'Grid View' : 'List View'}
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Virtualización</label>
              <Button
                onClick={() => setIsVirtualized(!isVirtualized)}
                variant={isVirtualized ? "primary" : "outline"}
                className="w-full"
              >
                {isVirtualized ? 'Activada' : 'Desactivada'}
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Búsqueda</label>
              <Input
                placeholder="Buscar blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Results */}
      {performanceResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiMonitor />
              Resultados de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {performanceResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{result.name}</h3>
                    <span className="text-2xl">{getStatusIcon(result.status)}</span>
                  </div>
                  <div className={`text-2xl font-bold ${getStatusColor(result.status)}`}>
                    {result.value.toFixed(2)} {result.unit}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {result.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-blue-600">
                {filteredBlogs.length}
              </div>
              <div className="text-sm text-gray-600">
                Blogs Mostrados
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-green-600">
                {selectedBlogs.size}
              </div>
              <div className="text-sm text-gray-600">
                Seleccionados
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-purple-600">
                {isVirtualized ? 'ON' : 'OFF'}
              </div>
              <div className="text-sm text-gray-600">
                Virtualización
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-orange-600">
                {searchCache.size()}
              </div>
              <div className="text-sm text-gray-600">
                Cache Items
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog List */}
      {isVirtualized ? (
        <VirtualizedBlogList
          blogs={filteredBlogs}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onToggleSelect={handleToggleSelect}
          selectedBlogs={selectedBlogs}
          viewMode={viewMode}
        />
      ) : (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
          {filteredBlogs.map((blog) => (
            <Card key={blog.id} className="hover:shadow-lg transition-shadow">
              <CardContent>
                <h3 className="font-semibold mb-2">{blog.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{blog.excerpt}</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(blog.id!)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleView(blog.slug)}>
                    Ver
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformanceOptimizationTest;