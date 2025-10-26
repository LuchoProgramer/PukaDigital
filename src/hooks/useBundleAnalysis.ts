"use client";

import { useState, useEffect, useCallback } from 'react';

// Interfaces para análisis de bundle
interface BundleChunk {
  name: string;
  size: number;
  gzipSize?: number;
  modules: string[];
  loadTime?: number;
  isAsync: boolean;
  route?: string;
}

interface BundleAnalysis {
  totalSize: number;
  gzipSize: number;
  chunks: BundleChunk[];
  unusedCode: string[];
  duplicatedModules: string[];
  suggestions: BundleSuggestion[];
}

interface BundleSuggestion {
  type: 'code-split' | 'tree-shake' | 'lazy-load' | 'replace-library';
  priority: 'high' | 'medium' | 'low';
  description: string;
  estimatedSavings: number;
  implementation: string;
}

interface NetworkMetrics {
  downloadTime: number;
  parseTime: number;
  executionTime: number;
  memoryUsage: number;
}

interface UseBundleAnalysisReturn {
  analysis: BundleAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
  networkMetrics: NetworkMetrics | null;
  startAnalysis: () => Promise<void>;
  trackChunkLoad: (chunkName: string, loadTime: number) => void;
  getOptimizationScore: () => number;
  getSizeBreakdown: () => { labels: string[], data: number[] };
  exportReport: () => string;
}

export const useBundleAnalysis = (): UseBundleAnalysisReturn => {
  const [analysis, setAnalysis] = useState<BundleAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics | null>(null);
  const [chunkLoadTimes, setChunkLoadTimes] = useState<Map<string, number>>(new Map());

  // Simular análisis de bundle (en producción esto se conectaría con webpack-bundle-analyzer)
  const mockBundleData = useCallback((): BundleAnalysis => {
    const chunks: BundleChunk[] = [
      {
        name: 'main',
        size: 245000, // 245KB
        gzipSize: 85000, // 85KB
        modules: ['react', 'react-dom', 'next/app', 'app/layout'],
        isAsync: false,
        route: '/'
      },
      {
        name: 'cms',
        size: 180000, // 180KB
        gzipSize: 62000, // 62KB
        modules: ['ckeditor', 'firebase', 'cms/components'],
        isAsync: true,
        route: '/cms'
      },
      {
        name: 'admin',
        size: 120000, // 120KB
        gzipSize: 41000, // 41KB
        modules: ['admin/components', 'chart.js', 'admin/utils'],
        isAsync: true,
        route: '/admin'
      },
      {
        name: 'testing',
        size: 95000, // 95KB
        gzipSize: 32000, // 32KB
        modules: ['testing/components', 'performance-hooks'],
        isAsync: true,
        route: '/testing'
      },
      {
        name: 'vendor',
        size: 380000, // 380KB
        gzipSize: 125000, // 125KB
        modules: ['lodash', 'moment', 'chart.js', 'react-icons'],
        isAsync: false
      }
    ];

    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const gzipSize = chunks.reduce((sum, chunk) => sum + (chunk.gzipSize || 0), 0);

    const suggestions: BundleSuggestion[] = [
      {
        type: 'replace-library',
        priority: 'high',
        description: 'Reemplazar Moment.js con date-fns para reducir el bundle',
        estimatedSavings: 67000,
        implementation: 'npm uninstall moment && npm install date-fns'
      },
      {
        type: 'tree-shake',
        priority: 'medium',
        description: 'Optimizar imports de react-icons para tree shaking',
        estimatedSavings: 45000,
        implementation: 'Usar imports específicos: import { FiHome } from "react-icons/fi"'
      },
      {
        type: 'code-split',
        priority: 'medium',
        description: 'Implementar code splitting en rutas de admin',
        estimatedSavings: 35000,
        implementation: 'Usar dynamic imports con next/dynamic'
      },
      {
        type: 'lazy-load',
        priority: 'low',
        description: 'Lazy load de Chart.js en componentes de analytics',
        estimatedSavings: 28000,
        implementation: 'const Chart = dynamic(() => import("chart.js"))'
      }
    ];

    return {
      totalSize,
      gzipSize,
      chunks,
      unusedCode: [
        'lodash/isEmpty (no utilizado)',
        'moment/locale (locales no necesarios)',
        'react-icons/ai (íconos no utilizados)'
      ],
      duplicatedModules: [
        'react (versiones múltiples)',
        'lodash (duplicado en vendor y cms)'
      ],
      suggestions
    };
  }, []);

  // Métricas de red y rendimiento
  const measureNetworkMetrics = useCallback(async (): Promise<NetworkMetrics> => {
    const startTime = performance.now();
    
    // Simular medición de red
    const mockDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    
    await mockDelay(); // Simular tiempo de descarga
    const downloadTime = performance.now() - startTime;
    
    const parseTime = Math.random() * 50; // Tiempo de parsing simulado
    const executionTime = Math.random() * 100; // Tiempo de ejecución simulado
    
    // Memoria utilizada (si está disponible)
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    
    return {
      downloadTime,
      parseTime,
      executionTime,
      memoryUsage
    };
  }, []);

  // Iniciar análisis
  const startAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Simular tiempo de análisis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bundleData = mockBundleData();
      const metrics = await measureNetworkMetrics();
      
      setAnalysis(bundleData);
      setNetworkMetrics(metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error durante el análisis');
    } finally {
      setIsAnalyzing(false);
    }
  }, [mockBundleData, measureNetworkMetrics]);

  // Trackear tiempo de carga de chunks
  const trackChunkLoad = useCallback((chunkName: string, loadTime: number) => {
    setChunkLoadTimes(prev => new Map(prev.set(chunkName, loadTime)));
  }, []);

  // Calcular score de optimización
  const getOptimizationScore = useCallback((): number => {
    if (!analysis) return 0;
    
    let score = 100;
    
    // Penalizar por tamaño total
    if (analysis.totalSize > 1000000) score -= 30; // >1MB
    else if (analysis.totalSize > 500000) score -= 15; // >500KB
    
    // Penalizar por chunks síncronos grandes
    analysis.chunks.forEach(chunk => {
      if (!chunk.isAsync && chunk.size > 200000) {
        score -= 20;
      }
    });
    
    // Penalizar por código no utilizado
    score -= analysis.unusedCode.length * 5;
    
    // Penalizar por módulos duplicados
    score -= analysis.duplicatedModules.length * 10;
    
    return Math.max(0, Math.min(100, score));
  }, [analysis]);

  // Obtener breakdown de tamaños para gráficos
  const getSizeBreakdown = useCallback(() => {
    if (!analysis) return { labels: [], data: [] };
    
    const labels = analysis.chunks.map(chunk => chunk.name);
    const data = analysis.chunks.map(chunk => chunk.size / 1024); // KB
    
    return { labels, data };
  }, [analysis]);

  // Exportar reporte
  const exportReport = useCallback((): string => {
    if (!analysis) return '';
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalSize: `${(analysis.totalSize / 1024).toFixed(2)} KB`,
        gzipSize: `${(analysis.gzipSize / 1024).toFixed(2)} KB`,
        optimizationScore: `${getOptimizationScore()}/100`,
        chunksCount: analysis.chunks.length
      },
      chunks: analysis.chunks.map(chunk => ({
        name: chunk.name,
        size: `${(chunk.size / 1024).toFixed(2)} KB`,
        gzipSize: chunk.gzipSize ? `${(chunk.gzipSize / 1024).toFixed(2)} KB` : 'N/A',
        isAsync: chunk.isAsync,
        route: chunk.route || 'N/A'
      })),
      suggestions: analysis.suggestions.map(suggestion => ({
        type: suggestion.type,
        priority: suggestion.priority,
        description: suggestion.description,
        estimatedSavings: `${(suggestion.estimatedSavings / 1024).toFixed(2)} KB`,
        implementation: suggestion.implementation
      })),
      issues: {
        unusedCode: analysis.unusedCode,
        duplicatedModules: analysis.duplicatedModules
      },
      networkMetrics
    };
    
    return JSON.stringify(report, null, 2);
  }, [analysis, networkMetrics, getOptimizationScore]);

  // Auto-análisis en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Ejecutar análisis automático después de un tiempo
      const timer = setTimeout(() => {
        startAnalysis();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [startAnalysis]);

  return {
    analysis,
    isAnalyzing,
    error,
    networkMetrics,
    startAnalysis,
    trackChunkLoad,
    getOptimizationScore,
    getSizeBreakdown,
    exportReport
  };
};