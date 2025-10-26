"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useBundleAnalysis } from '@/hooks/useBundleAnalysis';
import { useCodeSplittingMetrics } from '@/hooks/useLazyLoad';
import { 
  FiPackage, FiZap, FiTrendingDown, FiTrendingUp, FiDownload, 
  FiCpu, FiHardDrive, FiWifi, FiBarChart, FiTarget, 
  FiCheckCircle, FiAlertTriangle, FiInfo, FiRefreshCw,
  FiEye, FiCode, FiLayers, FiSettings
} from 'react-icons/fi';

interface BundleOptimizationTestProps {}

const BundleOptimizationTest: React.FC<BundleOptimizationTestProps> = () => {
  const { 
    analysis, 
    isAnalyzing, 
    error, 
    networkMetrics, 
    startAnalysis, 
    getOptimizationScore,
    getSizeBreakdown,
    exportReport
  } = useBundleAnalysis();
  
  const { 
    metrics: splittingMetrics, 
    getEfficiencyScore 
  } = useCodeSplittingMetrics();

  const [selectedTab, setSelectedTab] = useState<'overview' | 'chunks' | 'suggestions' | 'metrics'>('overview');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Calcular métricas derivadas
  const optimizationScore = getOptimizationScore();
  const efficiencyScore = getEfficiencyScore();
  const sizeBreakdown = getSizeBreakdown();

  const formatSize = (bytes: number): string => {
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <FiCheckCircle className="text-green-500" />;
    if (score >= 60) return <FiAlertTriangle className="text-yellow-500" />;
    return <FiAlertTriangle className="text-red-500" />;
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Auto-iniciar análisis
  useEffect(() => {
    if (!analysis && !isAnalyzing) {
      startAnalysis();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiPackage className="text-blue-500" />
            Bundle Optimization Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Análisis detallado del bundle y optimizaciones recomendadas
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={startAnalysis}
            disabled={isAnalyzing}
            leftIcon={isAnalyzing ? <FiRefreshCw className="animate-spin" /> : <FiZap />}
          >
            {isAnalyzing ? 'Analizando...' : 'Ejecutar Análisis'}
          </Button>
          {analysis && (
            <Button
              onClick={() => {
                const report = exportReport();
                const blob = new Blob([report], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `bundle-analysis-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              variant="outline"
              leftIcon={<FiDownload />}
            >
              Exportar Reporte
            </Button>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent>
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <FiAlertTriangle />
              <span>Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <Card>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Analizando estructura del bundle...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {analysis && !isAnalyzing && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Bundle Total</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatSize(analysis.totalSize)}
                    </p>
                  </div>
                  <FiHardDrive className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Gzip: {formatSize(analysis.gzipSize)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Optimization Score</p>
                    <p className={`text-2xl font-bold ${getScoreColor(optimizationScore)}`}>
                      {optimizationScore}/100
                    </p>
                  </div>
                  {getScoreIcon(optimizationScore)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {optimizationScore >= 80 ? 'Excelente' : optimizationScore >= 60 ? 'Bueno' : 'Necesita mejoras'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Chunks</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analysis.chunks.length}
                    </p>
                  </div>
                  <FiLayers className="h-8 w-8 text-purple-500" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {analysis.chunks.filter(c => c.isAsync).length} async
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sugerencias</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analysis.suggestions.length}
                    </p>
                  </div>
                  <FiTarget className="h-8 w-8 text-orange-500" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {analysis.suggestions.filter(s => s.priority === 'high').length} alta prioridad
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <Card>
            <CardHeader>
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                {[
                  { id: 'overview', label: 'Overview', icon: FiEye },
                  { id: 'chunks', label: 'Chunks', icon: FiLayers },
                  { id: 'suggestions', label: 'Optimizaciones', icon: FiSettings },
                  { id: 'metrics', label: 'Métricas', icon: FiBarChart }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      selectedTab === tab.id
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent>
              {/* Overview Tab */}
              {selectedTab === 'overview' && (
                <div className="space-y-6">
                  {/* Size Distribution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FiBarChart />
                      Distribución de Tamaño
                    </h3>
                    <div className="space-y-2">
                      {analysis.chunks.map((chunk, index) => {
                        const percentage = (chunk.size / analysis.totalSize) * 100;
                        return (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-24 text-sm font-medium text-gray-600">
                              {chunk.name}
                            </div>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full ${
                                  chunk.isAsync ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="w-20 text-sm text-gray-600 text-right">
                              {formatSize(chunk.size)}
                            </div>
                            <div className="w-12 text-xs text-gray-500 text-right">
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Issues */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FiAlertTriangle />
                      Problemas Detectados
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                        <CardContent>
                          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                            Código No Utilizado
                          </h4>
                          <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                            {analysis.unusedCode.slice(0, 3).map((item, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                                {item}
                              </li>
                            ))}
                            {analysis.unusedCode.length > 3 && (
                              <li className="text-xs text-yellow-600">
                                +{analysis.unusedCode.length - 3} más...
                              </li>
                            )}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                        <CardContent>
                          <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                            Módulos Duplicados
                          </h4>
                          <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                            {analysis.duplicatedModules.slice(0, 3).map((item, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                                {item}
                              </li>
                            ))}
                            {analysis.duplicatedModules.length > 3 && (
                              <li className="text-xs text-red-600">
                                +{analysis.duplicatedModules.length - 3} más...
                              </li>
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* Chunks Tab */}
              {selectedTab === 'chunks' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiLayers />
                    Análisis de Chunks
                  </h3>
                  <div className="space-y-3">
                    {analysis.chunks.map((chunk, index) => (
                      <Card key={index} className={`border ${chunk.isAsync ? 'border-green-200' : 'border-blue-200'}`}>
                        <CardContent>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {chunk.name}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                chunk.isAsync 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {chunk.isAsync ? 'Async' : 'Sync'}
                              </span>
                              {chunk.route && (
                                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                  {chunk.route}
                                </span>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowDetails(showDetails === chunk.name ? null : chunk.name)}
                            >
                              {showDetails === chunk.name ? 'Ocultar' : 'Detalles'}
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Tamaño:</span>
                              <div className="font-semibold">{formatSize(chunk.size)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Gzip:</span>
                              <div className="font-semibold">
                                {chunk.gzipSize ? formatSize(chunk.gzipSize) : 'N/A'}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Módulos:</span>
                              <div className="font-semibold">{chunk.modules.length}</div>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">% Total:</span>
                              <div className="font-semibold">
                                {((chunk.size / analysis.totalSize) * 100).toFixed(1)}%
                              </div>
                            </div>
                          </div>

                          {showDetails === chunk.name && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <h5 className="font-medium mb-2">Módulos incluidos:</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {chunk.modules.map((module, moduleIndex) => (
                                  <div
                                    key={moduleIndex}
                                    className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                                  >
                                    {module}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions Tab */}
              {selectedTab === 'suggestions' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiSettings />
                    Optimizaciones Recomendadas
                  </h3>
                  <div className="space-y-4">
                    {analysis.suggestions
                      .sort((a, b) => {
                        const priorityOrder = { high: 3, medium: 2, low: 1 };
                        return priorityOrder[b.priority] - priorityOrder[a.priority];
                      })
                      .map((suggestion, index) => (
                        <Card key={index} className="border-l-4 border-l-blue-500">
                          <CardContent>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                                  {suggestion.priority.toUpperCase()}
                                </div>
                                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  {suggestion.type}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-green-600">
                                  -{formatSize(suggestion.estimatedSavings)}
                                </div>
                                <div className="text-xs text-gray-500">ahorro estimado</div>
                              </div>
                            </div>
                            
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              {suggestion.description}
                            </h4>
                            
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Implementación:
                              </div>
                              <code className="text-sm font-mono text-gray-900 dark:text-gray-100">
                                {suggestion.implementation}
                              </code>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {/* Metrics Tab */}
              {selectedTab === 'metrics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiBarChart />
                    Métricas de Performance
                  </h3>
                  
                  {networkMetrics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card>
                        <CardContent>
                          <div className="flex items-center gap-3">
                            <FiDownload className="h-6 w-6 text-blue-500" />
                            <div>
                              <div className="text-sm text-gray-600">Download Time</div>
                              <div className="font-semibold">
                                {networkMetrics.downloadTime.toFixed(2)}ms
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent>
                          <div className="flex items-center gap-3">
                            <FiCpu className="h-6 w-6 text-green-500" />
                            <div>
                              <div className="text-sm text-gray-600">Parse Time</div>
                              <div className="font-semibold">
                                {networkMetrics.parseTime.toFixed(2)}ms
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent>
                          <div className="flex items-center gap-3">
                            <FiZap className="h-6 w-6 text-yellow-500" />
                            <div>
                              <div className="text-sm text-gray-600">Execution Time</div>
                              <div className="font-semibold">
                                {networkMetrics.executionTime.toFixed(2)}ms
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent>
                          <div className="flex items-center gap-3">
                            <FiHardDrive className="h-6 w-6 text-purple-500" />
                            <div>
                              <div className="text-sm text-gray-600">Memory Usage</div>
                              <div className="font-semibold">
                                {formatSize(networkMetrics.memoryUsage)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Code Splitting Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FiLayers />
                        Code Splitting Efficiency
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4">
                          <div className={`text-3xl font-bold ${getScoreColor(efficiencyScore)}`}>
                            {efficiencyScore}
                          </div>
                          <div className="text-sm text-gray-600">Efficiency Score</div>
                        </div>
                        <div className="text-center p-4">
                          <div className="text-3xl font-bold text-blue-600">
                            {splittingMetrics.asyncChunksLoaded}
                          </div>
                          <div className="text-sm text-gray-600">Chunks Loaded</div>
                        </div>
                        <div className="text-center p-4">
                          <div className="text-3xl font-bold text-green-600">
                            {formatSize(splittingMetrics.totalSavings)}
                          </div>
                          <div className="text-sm text-gray-600">Total Savings</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default BundleOptimizationTest;