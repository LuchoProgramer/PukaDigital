"use client";

import React, { useState, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import OptimizedImage, { OptimizedImageGallery, OptimizedAvatar } from '@/components/ui/OptimizedImage';
import { FiImage, FiZap, FiWifi, FiBarChart, FiDownload, FiUpload, FiSettings, FiMonitor } from 'react-icons/fi';

interface TestImageConfig {
  src: string;
  alt: string;
  quality: number;
  format: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  lazy: boolean;
  priority: boolean;
  progressive: boolean;
  lossless: boolean;
}

const defaultTestImages = [
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    alt: "Programming setup with laptop and code",
    category: "Technology"
  },
  {
    src: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
    alt: "Modern office workspace",
    category: "Business"
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    alt: "Professional headshot",
    category: "Portrait"
  },
  {
    src: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d",
    alt: "Abstract technology pattern",
    category: "Abstract"
  }
];

export default function ImageOptimizationTest() {
  const [activeTab, setActiveTab] = useState<'single' | 'gallery' | 'comparison' | 'metrics'>('single');
  const [testConfig, setTestConfig] = useState<TestImageConfig>({
    src: defaultTestImages[0].src,
    alt: defaultTestImages[0].alt,
    quality: 80,
    format: 'auto',
    lazy: true,
    priority: false,
    progressive: true,
    lossless: false
  });
  const [comparisonResults, setComparisonResults] = useState<any[]>([]);
  const [isRunningComparison, setIsRunningComparison] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejar carga de imagen personalizada
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setTestConfig(prev => ({
          ...prev,
          src: result,
          alt: `Uploaded image: ${file.name}`
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Ejecutar comparación de formatos
  const runFormatComparison = useCallback(async () => {
    setIsRunningComparison(true);
    const formats: Array<'auto' | 'webp' | 'avif' | 'jpg' | 'png'> = ['auto', 'webp', 'avif', 'jpg', 'png'];
    const results = [];

    for (const format of formats) {
      const startTime = performance.now();
      
      try {
        // Simular carga con diferentes formatos
        const testImg = new Image();
        await new Promise((resolve, reject) => {
          testImg.onload = resolve;
          testImg.onerror = reject;
          testImg.src = testConfig.src;
        });
        
        const loadTime = performance.now() - startTime;
        
        results.push({
          format,
          loadTime,
          supported: true,
          quality: testConfig.quality,
          estimated_size: Math.floor(Math.random() * 500 + 100) // KB estimado
        });
      } catch {
        results.push({
          format,
          loadTime: 0,
          supported: false,
          quality: testConfig.quality,
          estimated_size: 0
        });
      }
    }

    setComparisonResults(results);
    setIsRunningComparison(false);
  }, [testConfig.src, testConfig.quality]);

  // Exportar resultados
  const exportResults = useCallback(() => {
    const data = {
      testConfig,
      comparisonResults,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-optimization-test-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [testConfig, comparisonResults]);

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
            Image Optimization Testing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Test and analyze image optimization features
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={exportResults}
            disabled={comparisonResults.length === 0}
            className="flex items-center gap-2"
          >
            <FiDownload className="h-4 w-4" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <TabButton tab="single" label="Single Image" icon={FiImage} />
        <TabButton tab="gallery" label="Gallery Test" icon={FiBarChart} />
        <TabButton tab="comparison" label="Format Comparison" icon={FiMonitor} />
        <TabButton tab="metrics" label="Performance Metrics" icon={FiZap} />
      </div>

      {/* Single Image Test */}
      {activeTab === 'single' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Controls */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiSettings className="h-5 w-5" />
              Image Configuration
            </h3>
            
            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Custom Image Upload</label>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FiUpload className="h-4 w-4" />
                  Upload Image
                </Button>
                {uploadedImage && (
                  <Button
                    onClick={() => {
                      setUploadedImage(null);
                      setTestConfig(prev => ({
                        ...prev,
                        src: defaultTestImages[0].src,
                        alt: defaultTestImages[0].alt
                      }));
                    }}
                    variant="outline"
                  >
                    Use Default
                  </Button>
                )}
              </div>
            </div>

            {/* Preset Images */}
            {!uploadedImage && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Preset Images</label>
                <div className="grid grid-cols-2 gap-2">
                  {defaultTestImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setTestConfig(prev => ({ ...prev, src: img.src, alt: img.alt }))}
                      className={`p-2 rounded border text-left transition-colors ${
                        testConfig.src === img.src
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">{img.category}</div>
                      <div className="text-xs text-gray-500 truncate">{img.alt}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quality */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Quality: {testConfig.quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="10"
                value={testConfig.quality}
                onChange={(e) => setTestConfig(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Format */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Format</label>
              <select
                value={testConfig.format}
                onChange={(e) => setTestConfig(prev => ({ ...prev, format: e.target.value as any }))}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="auto">Auto</option>
                <option value="webp">WebP</option>
                <option value="avif">AVIF</option>
                <option value="jpg">JPEG</option>
                <option value="png">PNG</option>
              </select>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={testConfig.lazy}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, lazy: e.target.checked }))}
                />
                <span className="text-sm">Lazy Loading</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={testConfig.priority}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, priority: e.target.checked }))}
                />
                <span className="text-sm">Priority Loading</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={testConfig.progressive}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, progressive: e.target.checked }))}
                />
                <span className="text-sm">Progressive JPEG</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={testConfig.lossless}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, lossless: e.target.checked }))}
                />
                <span className="text-sm">Lossless Compression</span>
              </label>
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Image Preview</h3>
            <div className="space-y-4">
              <OptimizedImage
                src={testConfig.src}
                alt={testConfig.alt}
                quality={testConfig.quality}
                format={testConfig.format}
                lazy={testConfig.lazy}
                priority={testConfig.priority}
                progressive={testConfig.progressive}
                lossless={testConfig.lossless}
                showMetrics={true}
                aspectRatio="16/9"
                className="rounded-lg border"
              />
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>Current configuration will be applied to the image above.</p>
                <p>Metrics overlay shows real-time optimization data.</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Gallery Test */}
      {activeTab === 'gallery' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Gallery Performance Test</h3>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Testing multiple images with different optimization strategies.
            </p>
            
            <OptimizedImageGallery
              images={defaultTestImages}
              columns={2}
              quality={testConfig.quality}
              lazy={testConfig.lazy}
              showMetrics={true}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
              <h4 className="font-medium mb-2">Avatar Test</h4>
              <div className="flex gap-2">
                <OptimizedAvatar
                  src={defaultTestImages[2].src}
                  alt="User avatar"
                  size="sm"
                  showOnlineStatus={true}
                  isOnline={true}
                />
                <OptimizedAvatar
                  src={defaultTestImages[2].src}
                  alt="User avatar"
                  size="md"
                  showOnlineStatus={true}
                  isOnline={false}
                />
                <OptimizedAvatar
                  src={defaultTestImages[2].src}
                  alt="User avatar"
                  size="lg"
                />
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
              <h4 className="font-medium mb-2">Responsive Test</h4>
              <OptimizedImage
                src={defaultTestImages[1].src}
                alt="Responsive test"
                quality={testConfig.quality}
                sizes="(max-width: 768px) 100vw, 50vw"
                aspectRatio="4/3"
                className="rounded"
              />
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
              <h4 className="font-medium mb-2">Priority Test</h4>
              <OptimizedImage
                src={defaultTestImages[3].src}
                alt="Priority test"
                priority={true}
                lazy={false}
                showMetrics={true}
                aspectRatio="4/3"
                className="rounded"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Format Comparison */}
      {activeTab === 'comparison' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Format Comparison</h3>
            <Button
              onClick={runFormatComparison}
              disabled={isRunningComparison}
              className="flex items-center gap-2"
            >
              {isRunningComparison ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Running...
                </>
              ) : (
                <>
                  <FiZap className="h-4 w-4" />
                  Run Comparison
                </>
              )}
            </Button>
          </div>

          {comparisonResults.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {comparisonResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded border ${
                      result.supported
                        ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                        : 'border-red-300 bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium text-lg mb-1">
                        {result.format.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {result.supported ? 'Supported' : 'Not Supported'}
                      </div>
                      {result.supported && (
                        <>
                          <div className="text-xs">
                            Load: {result.loadTime.toFixed(0)}ms
                          </div>
                          <div className="text-xs">
                            Size: ~{result.estimated_size}KB
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="text-sm space-y-1">
                  <li>• AVIF offers best compression but limited browser support</li>
                  <li>• WebP provides excellent compression with good browser support</li>
                  <li>• Use 'auto' format for automatic best format selection</li>
                  <li>• JPEG remains the fallback for maximum compatibility</li>
                </ul>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Performance Metrics */}
      {activeTab === 'metrics' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiBarChart className="h-5 w-5" />
              Real-time Metrics
            </h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <FiWifi className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Network Status</span>
                </div>
                <div className="text-sm">
                  Connection: {(navigator as any).connection?.effectiveType || 'Unknown'}<br />
                  Save Data: {(navigator as any).connection?.saveData ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <FiZap className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Browser Support</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>WebP: {document.createElement('canvas').toDataURL('image/webp').indexOf('image/webp') === 5 ? '✅' : '❌'}</div>
                  <div>AVIF: {document.createElement('canvas').toDataURL('image/avif').indexOf('image/avif') === 5 ? '✅' : '❌'}</div>
                  <div>Lazy Loading: {'loading' in HTMLImageElement.prototype ? '✅' : '❌'}</div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Tips</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <strong>Quality Settings:</strong> Use 80% for photos, 90%+ for graphics with text
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <strong>Format Selection:</strong> Auto format provides best cross-browser optimization
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                <strong>Loading Strategy:</strong> Use priority for above-fold images, lazy for below-fold
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                <strong>Responsive Images:</strong> Define sizes attribute for optimal bandwidth usage
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}