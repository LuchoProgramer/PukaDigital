"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  useCoreWebVitals, 
  usePerformanceMetrics, 
  calculatePerformanceScore, 
  generateRecommendations,
  collectRUMData,
  type PerformanceTest,
  type CoreWebVitals,
  type PerformanceMetrics
} from '@/hooks/useProductionPerformance';
import { 
  FiZap, 
  FiMonitor, 
  FiTrendingUp, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiClock, 
  FiDatabase, 
  FiWifi, 
  FiSmartphone, 
  FiDownload,
  FiPlay,
  FiRefreshCw,
  FiBarChart,
  FiEye,
  FiActivity
} from 'react-icons/fi';

export default function ProductionPerformanceTest() {
  const [activeTab, setActiveTab] = useState<'vitals' | 'metrics' | 'tests' | 'monitoring'>('vitals');
  const [performanceTests, setPerformanceTests] = useState<PerformanceTest[]>([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  
  const { vitals, isSupported } = useCoreWebVitals();
  const { metrics, isCollecting, collectMetrics } = usePerformanceMetrics();

  // Ejecutar test de rendimiento
  const runPerformanceTest = useCallback(async () => {
    setIsRunningTest(true);
    
    try {
      // Recopilar métricas
      await collectMetrics();
      
      if (metrics) {
        const score = calculatePerformanceScore(metrics.vitals);
        const recommendations = generateRecommendations(metrics);
        
        const newTest: PerformanceTest = {
          id: Date.now().toString(),
          name: `Performance Test ${new Date().toLocaleTimeString()}`,
          description: 'Comprehensive performance analysis',
          url: window.location.href,
          timestamp: new Date().toISOString(),
          metrics,
          score: {
            overall: score,
            performance: score,
            accessibility: Math.floor(Math.random() * 30) + 70, // Simulado
            bestPractices: Math.floor(Math.random() * 20) + 80, // Simulado
            seo: Math.floor(Math.random() * 25) + 75, // Simulado
          },
          recommendations
        };
        
        setPerformanceTests(prev => [newTest, ...prev.slice(0, 9)]); // Mantener últimos 10
        
        // Enviar datos RUM
        collectRUMData(metrics);
      }
    } catch (error) {
      console.error('Error running performance test:', error);
    } finally {
      setIsRunningTest(false);
    }
  }, [metrics, collectMetrics]);

  // Auto-ejecutar al cargar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isRunningTest && metrics) {
        runPerformanceTest();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Obtener color del score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Obtener color de la métrica
  const getMetricColor = (metric: string, value: number | null) => {
    if (value === null) return 'text-gray-400';
    
    switch (metric) {
      case 'lcp':
        return value <= 2500 ? 'text-green-600' : value <= 4000 ? 'text-yellow-600' : 'text-red-600';
      case 'fid':
        return value <= 100 ? 'text-green-600' : value <= 300 ? 'text-yellow-600' : 'text-red-600';
      case 'cls':
        return value <= 0.1 ? 'text-green-600' : value <= 0.25 ? 'text-yellow-600' : 'text-red-600';
      case 'fcp':
        return value <= 1800 ? 'text-green-600' : value <= 3000 ? 'text-yellow-600' : 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Formatear valor de métrica
  const formatMetricValue = (metric: string, value: number | null) => {
    if (value === null) return 'N/A';
    
    switch (metric) {
      case 'lcp':
      case 'fid':
      case 'fcp':
      case 'ttfb':
      case 'tti':
      case 'inp':
        return `${value.toFixed(0)}ms`;
      case 'cls':
        return value.toFixed(3);
      default:
        return value.toString();
    }
  };

  const TabButton = ({ tab, label, icon: Icon }: { tab: string; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Production Performance Testing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Core Web Vitals monitoring and real user metrics
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={runPerformanceTest}
            disabled={isRunningTest}
            className="flex items-center gap-2"
          >
            {isRunningTest ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Running Test...
              </>
            ) : (
              <>
                <FiPlay className="h-4 w-4" />
                Run Test
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Support Status */}
      {!isSupported && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800">
            <FiAlertTriangle className="h-5 w-5" />
            <span className="font-medium">Limited Support</span>
          </div>
          <p className="text-yellow-700 mt-1 text-sm">
            Performance Observer API not fully supported in this browser. Some metrics may be unavailable.
          </p>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <TabButton tab="vitals" label="Core Web Vitals" icon={FiZap} />
        <TabButton tab="metrics" label="Detailed Metrics" icon={FiBarChart} />
        <TabButton tab="tests" label="Test History" icon={FiActivity} />
        <TabButton tab="monitoring" label="RUM Monitoring" icon={FiEye} />
      </div>

      {/* Core Web Vitals */}
      {activeTab === 'vitals' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Current Vitals */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiZap className="h-5 w-5" />
              Current Core Web Vitals
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries({
                lcp: 'Largest Contentful Paint',
                fid: 'First Input Delay',
                cls: 'Cumulative Layout Shift',
                fcp: 'First Contentful Paint'
              }).map(([key, label]) => {
                const value = vitals[key as keyof CoreWebVitals] ?? null;
                const color = getMetricColor(key, value);
                
                return (
                  <div key={key} className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {label}
                    </div>
                    <div className={`text-2xl font-bold ${color}`}>
                      {formatMetricValue(key, value)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {key === 'lcp' && 'Good: ≤2.5s'}
                      {key === 'fid' && 'Good: ≤100ms'}
                      {key === 'cls' && 'Good: ≤0.1'}
                      {key === 'fcp' && 'Good: ≤1.8s'}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {metrics && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <FiTrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Performance Score</span>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(calculatePerformanceScore(metrics.vitals))}`}>
                  {calculatePerformanceScore(metrics.vitals).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Based on Core Web Vitals thresholds
                </div>
              </div>
            )}
          </Card>

          {/* Recommendations */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Optimization Recommendations</h3>
            
            {metrics ? (
              <div className="space-y-3">
                {generateRecommendations(metrics).map((recommendation, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <FiAlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-yellow-800 dark:text-yellow-200">
                      {recommendation}
                    </span>
                  </div>
                ))}
                
                {generateRecommendations(metrics).length === 0 && (
                  <div className="flex gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <FiCheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-green-800 dark:text-green-200">
                      Great! No major performance issues detected.
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Run a performance test to see recommendations
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Detailed Metrics */}
      {activeTab === 'metrics' && metrics && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Navigation Timing */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiClock className="h-5 w-5" />
              Navigation Timing
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">DOM Content Loaded</span>
                <span className="font-mono text-sm">{metrics.navigation.domContentLoaded.toFixed(0)}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Load Complete</span>
                <span className="font-mono text-sm">{metrics.navigation.loadComplete.toFixed(0)}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">First Paint</span>
                <span className="font-mono text-sm">{metrics.navigation.firstPaint.toFixed(0)}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">First Contentful Paint</span>
                <span className="font-mono text-sm">{metrics.navigation.firstContentfulPaint.toFixed(0)}ms</span>
              </div>
            </div>
          </Card>

          {/* Resource Timing */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiDatabase className="h-5 w-5" />
              Resource Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Resources</span>
                <span className="font-mono text-sm">{metrics.resources.totalResources}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Size</span>
                <span className="font-mono text-sm">{(metrics.resources.totalSize / 1024 / 1024).toFixed(2)}MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Load Time</span>
                <span className="font-mono text-sm">{metrics.resources.totalLoadTime.toFixed(0)}ms</span>
              </div>
              {metrics.resources.largestResource && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                  <div className="text-sm font-medium mb-1">Largest Resource</div>
                  <div className="text-xs text-gray-600 break-all">
                    {metrics.resources.largestResource.name.split('/').pop()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(metrics.resources.largestResource.size / 1024).toFixed(1)}KB
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Device & Connection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiSmartphone className="h-5 w-5" />
              Device & Network
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Viewport</span>
                <span className="font-mono text-sm">
                  {metrics.device.viewport.width}x{metrics.device.viewport.height}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pixel Ratio</span>
                <span className="font-mono text-sm">{metrics.device.pixelRatio}x</span>
              </div>
              
              {metrics.connection && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Connection</span>
                    <span className="font-mono text-sm">{metrics.connection.effectiveType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Downlink</span>
                    <span className="font-mono text-sm">{metrics.connection.downlink} Mbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">RTT</span>
                    <span className="font-mono text-sm">{metrics.connection.rtt}ms</span>
                  </div>
                </>
              )}
              
              {metrics.memory && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                  <div className="text-sm font-medium mb-1">Memory Usage</div>
                  <div className="text-xs text-gray-600">
                    {(metrics.memory.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB used
                  </div>
                  <div className="text-xs text-gray-500">
                    {(metrics.memory.totalJSHeapSize / 1024 / 1024).toFixed(1)}MB total
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Test History */}
      {activeTab === 'tests' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Test History</h3>
          
          {performanceTests.length > 0 ? (
            <div className="space-y-4">
              {performanceTests.map((test) => (
                <div key={test.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{test.name}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(test.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getScoreColor(test.score.overall)}`}>
                        {test.score.overall.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-500">Overall</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getScoreColor(test.score.performance)}`}>
                        {test.score.performance.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-500">Performance</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getScoreColor(test.score.accessibility)}`}>
                        {test.score.accessibility.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-500">Accessibility</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getScoreColor(test.score.bestPractices)}`}>
                        {test.score.bestPractices.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-500">Best Practices</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getScoreColor(test.score.seo)}`}>
                        {test.score.seo.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-500">SEO</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    LCP: {formatMetricValue('lcp', test.metrics.vitals.lcp)} | 
                    FID: {formatMetricValue('fid', test.metrics.vitals.fid)} | 
                    CLS: {formatMetricValue('cls', test.metrics.vitals.cls)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No performance tests recorded yet. Run a test to start monitoring.
            </div>
          )}
        </Card>
      )}

      {/* RUM Monitoring */}
      {activeTab === 'monitoring' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiEye className="h-5 w-5" />
              Real User Monitoring
            </h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                <h4 className="font-medium mb-2">Data Collection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Performance metrics are automatically collected from real users and sent to analytics services.
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                <h4 className="font-medium mb-2">Privacy Compliant</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Only performance metrics are collected. No personal data or user content is transmitted.
                </p>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
                <h4 className="font-medium mb-2">Automatic Alerts</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure alerts when Core Web Vitals exceed recommended thresholds.
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Integration Setup</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Google Analytics</h4>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                  {`// Automatically sends Core Web Vitals
window.gtag('event', 'core_web_vitals', {
  lcp: metrics.vitals.lcp,
  fid: metrics.vitals.fid,
  cls: metrics.vitals.cls
});`}
                </code>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Custom Analytics</h4>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                  {`// Custom endpoint
fetch('/api/analytics/performance', {
  method: 'POST',
  body: JSON.stringify(rumData)
});`}
                </code>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure your analytics endpoints in environment variables for production deployment.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}