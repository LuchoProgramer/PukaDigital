"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import AdvancedFeaturesTestPanel from '@/components/testing/AdvancedFeaturesTestPanel';
import PerformanceOptimizationTest from '@/components/testing/PerformanceOptimizationTest';
import BundleOptimizationTest from '@/components/testing/BundleOptimizationTest';
import BlogListAdvancedTest from '@/components/testing/BlogListAdvancedTest';
import ImageOptimizationTest from '@/components/testing/ImageOptimizationTest';
import ProductionPerformanceTest from '@/components/testing/ProductionPerformanceTest';
import { 
  FiCheckCircle, 
  FiPlay, 
  FiEdit, 
  FiPlus, 
  FiSave, 
  FiCommand, 
  FiMove, 
  FiBarChart, 
  FiFileText,
  FiGrid,
  FiArrowRight,
  FiZap,
  FiPackage,
  FiImage,
  FiActivity
} from 'react-icons/fi';

export default function TestingPage() {
  const [activeTest, setActiveTest] = useState<string>('overview');

  const features = [
    {
      name: 'Auto-save',
      description: 'Guardado automático cada 30 segundos',
      icon: <FiSave className="text-blue-500" />,
      status: 'implemented'
    },
    {
      name: 'Keyboard Shortcuts',
      description: 'Atajos de teclado para operaciones rápidas',
      icon: <FiCommand className="text-green-500" />,
      status: 'implemented'
    },
    {
      name: 'Drag & Drop',
      description: 'Reordenamiento visual de bloques de contenido',
      icon: <FiMove className="text-purple-500" />,
      status: 'implemented'
    },
    {
      name: 'Content Statistics',
      description: 'Métricas en tiempo real y sugerencias SEO',
      icon: <FiBarChart className="text-orange-500" />,
      status: 'implemented'
    },
    {
      name: 'Content Templates',
      description: 'Plantillas predefinidas para diferentes tipos de contenido',
      icon: <FiFileText className="text-pink-500" />,
      status: 'implemented'
    },
    {
      name: 'Bundle Optimization',
      description: 'Análisis de bundle, code splitting y optimizaciones de carga',
      icon: <FiPackage className="text-purple-500" />,
      status: 'implemented'
    },
    {
      name: 'Performance Optimization',
      description: 'Virtualización, caching y optimizaciones de rendimiento',
      icon: <FiBarChart className="text-yellow-500" />,
      status: 'implemented'
    },
    {
      name: 'Image Optimization',
      description: 'Optimización automática de imágenes con WebP/AVIF y lazy loading',
      icon: <FiImage className="text-indigo-500" />,
      status: 'implemented'
    },
    {
      name: 'Production Performance Testing',
      description: 'Core Web Vitals monitoring y métricas de usuarios reales',
      icon: <FiActivity className="text-red-500" />,
      status: 'implemented'
    }
  ];

  const renderTestContent = () => {
    switch (activeTest) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {feature.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {feature.description}
                        </p>
                        <div className="mt-3">
                          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            <FiCheckCircle className="h-3 w-3" />
                            {feature.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Test Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => setActiveTest('advanced')}
                leftIcon={<FiPlay />}
              >
                Test Advanced Features
              </Button>
              <Button 
                onClick={() => setActiveTest('performance')}
                leftIcon={<FiZap />}
                variant="outline"
              >
                Test Performance
              </Button>
              <Button 
                onClick={() => setActiveTest('bundle')}
                leftIcon={<FiPackage />}
                variant="outline"
              >
                Test Bundle Optimization
              </Button>
              <Button 
                onClick={() => setActiveTest('images')}
                leftIcon={<FiImage />}
                variant="outline"
              >
                Test Image Optimization
              </Button>
              <Button 
                onClick={() => setActiveTest('production')}
                leftIcon={<FiActivity />}
                variant="outline"
              >
                Test Production Performance
              </Button>
              <Button 
                onClick={() => setActiveTest('bloglist')}
                leftIcon={<FiGrid />}
                variant="outline"
              >
                Test BlogList Features
              </Button>
              <Link href="/testing/integration">
                <Button variant="outline" leftIcon={<FiArrowRight />}>
                  Integration Tests
                </Button>
              </Link>
            </div>
          </div>
        );
      case 'advanced':
        return <AdvancedFeaturesTestPanel />;
      case 'performance':
        return <PerformanceOptimizationTest />;
      case 'bundle':
        return <BundleOptimizationTest />;
      case 'images':
        return <ImageOptimizationTest />;
      case 'production':
        return <ProductionPerformanceTest />;
      case 'bloglist':
        return <BlogListAdvancedTest />;
      default:
        return <div>Test no encontrado</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Testing Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Validación y testing de funcionalidades avanzadas del CMS
              </p>
            </div>

            {/* Navigation */}
            <div className="flex gap-2">
              <Button 
                onClick={() => setActiveTest('overview')}
                variant={activeTest === 'overview' ? 'primary' : 'outline'}
                size="sm"
              >
                Overview
              </Button>
              <Button 
                onClick={() => setActiveTest('advanced')}
                variant={activeTest === 'advanced' ? 'primary' : 'outline'}
                size="sm"
              >
                Advanced Tests
              </Button>
              <Button 
                onClick={() => setActiveTest('performance')}
                variant={activeTest === 'performance' ? 'primary' : 'outline'}
                size="sm"
              >
                Performance Tests
              </Button>
              <Button 
                onClick={() => setActiveTest('bundle')}
                variant={activeTest === 'bundle' ? 'primary' : 'outline'}
                size="sm"
              >
                Bundle Tests
              </Button>
              <Button 
                onClick={() => setActiveTest('images')}
                variant={activeTest === 'images' ? 'primary' : 'outline'}
                size="sm"
              >
                Image Tests
              </Button>
              <Button 
                onClick={() => setActiveTest('production')}
                variant={activeTest === 'production' ? 'primary' : 'outline'}
                size="sm"
              >
                Production Tests
              </Button>
              <Button 
                onClick={() => setActiveTest('bloglist')}
                variant={activeTest === 'bloglist' ? 'primary' : 'outline'}
                size="sm"
              >
                BlogList Tests
              </Button>
            </div>
          </div>
        </div>

        {/* Test Content */}
        {renderTestContent()}
      </div>
    </div>
  );
}