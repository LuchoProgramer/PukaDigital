/**
 * Production Performance Testing & Core Web Vitals Monitoring
 * Comprehensive performance testing suite for production environment
 */

"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

// Core Web Vitals metrics interface
export interface CoreWebVitals {
  // First Contentful Paint
  fcp: number | null;
  // Largest Contentful Paint
  lcp: number | null;
  // First Input Delay
  fid: number | null;
  // Cumulative Layout Shift
  cls: number | null;
  // Time to First Byte
  ttfb: number | null;
  // Time to Interactive
  tti: number | null;
  // Interaction to Next Paint
  inp: number | null;
}

export interface PerformanceMetrics {
  // Core Web Vitals
  vitals: CoreWebVitals;
  // Navigation timing
  navigation: {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    firstContentfulPaint: number;
  };
  // Resource timing
  resources: {
    totalResources: number;
    totalSize: number;
    totalLoadTime: number;
    largestResource: {
      name: string;
      size: number;
      duration: number;
    } | null;
  };
  // Memory usage (if available)
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  // Connection info
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
  // Device info
  device: {
    pixelRatio: number;
    viewport: {
      width: number;
      height: number;
    };
    userAgent: string;
  };
}

export interface PerformanceTest {
  id: string;
  name: string;
  description: string;
  url: string;
  timestamp: string;
  metrics: PerformanceMetrics;
  score: {
    overall: number;
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  recommendations: string[];
}

// Performance observer for Core Web Vitals
class PerformanceObserver {
  private observers: Map<string, PerformanceObserver> = new Map();
  private metrics: Partial<CoreWebVitals> = {};
  private callbacks: ((metrics: Partial<CoreWebVitals>) => void)[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    if (typeof window === 'undefined') return;

    // LCP Observer
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new window.PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.updateMetric('lcp', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer not supported:', e);
      }

      // FID Observer
      try {
        const fidObserver = new window.PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            this.updateMetric('fid', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observer not supported:', e);
      }

      // CLS Observer
      try {
        let clsValue = 0;
        const clsObserver = new window.PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.updateMetric('cls', clsValue);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS observer not supported:', e);
      }

      // INP Observer (experimental)
      try {
        const inpObserver = new window.PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (entry.duration) {
              this.updateMetric('inp', entry.duration);
            }
          });
        });
        inpObserver.observe({ entryTypes: ['event'] });
      } catch (e) {
        console.warn('INP observer not supported:', e);
      }
    }

    // Navigation timing for FCP and TTFB
    this.collectNavigationTimings();
  }

  private collectNavigationTimings() {
    if (typeof window === 'undefined') return;

    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationTiming) {
      // TTFB
      const ttfb = navigationTiming.responseStart - navigationTiming.requestStart;
      this.updateMetric('ttfb', ttfb);
    }

    // FCP from paint timing
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      this.updateMetric('fcp', fcpEntry.startTime);
    }
  }

  private updateMetric(key: keyof CoreWebVitals, value: number) {
    this.metrics[key] = value;
    this.notifyCallbacks();
  }

  private notifyCallbacks() {
    this.callbacks.forEach(callback => callback(this.metrics));
  }

  public subscribe(callback: (metrics: Partial<CoreWebVitals>) => void) {
    this.callbacks.push(callback);
    // Immediately call with current metrics
    callback(this.metrics);
    
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  public getMetrics(): Partial<CoreWebVitals> {
    return { ...this.metrics };
  }
}

// Singleton instance
let performanceObserverInstance: PerformanceObserver | null = null;

// Hook for Core Web Vitals monitoring
export function useCoreWebVitals() {
  const [vitals, setVitals] = useState<Partial<CoreWebVitals>>({});
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsSupported('PerformanceObserver' in window);

    if (!performanceObserverInstance) {
      performanceObserverInstance = new PerformanceObserver();
    }

    const unsubscribe = performanceObserverInstance.subscribe(setVitals);
    return unsubscribe;
  }, []);

  return { vitals, isSupported };
}

// Hook for comprehensive performance metrics
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const { vitals } = useCoreWebVitals();

  const collectMetrics = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setIsCollecting(true);

    try {
      // Navigation timing
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');

      const navigation = {
        domContentLoaded: navigationTiming?.domContentLoadedEventEnd - navigationTiming?.startTime || 0,
        loadComplete: navigationTiming?.loadEventEnd - navigationTiming?.startTime || 0,
        firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      };

      // Resource timing
      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const totalSize = resourceEntries.reduce((total, entry) => total + (entry.transferSize || 0), 0);
      const totalLoadTime = resourceEntries.reduce((total, entry) => total + entry.duration, 0);
      
      const largestResource = resourceEntries.reduce((largest, entry) => {
        const size = entry.transferSize || 0;
        if (!largest || size > largest.size) {
          return {
            name: entry.name,
            size,
            duration: entry.duration
          };
        }
        return largest;
      }, null as { name: string; size: number; duration: number } | null);

      const resources = {
        totalResources: resourceEntries.length,
        totalSize,
        totalLoadTime,
        largestResource
      };

      // Memory usage (Chrome only)
      const memory = (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      } : undefined;

      // Connection info
      const connection = (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt,
        saveData: (navigator as any).connection.saveData,
      } : undefined;

      // Device info
      const device = {
        pixelRatio: window.devicePixelRatio,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        userAgent: navigator.userAgent,
      };

      const completeMetrics: PerformanceMetrics = {
        vitals: {
          fcp: vitals.fcp || null,
          lcp: vitals.lcp || null,
          fid: vitals.fid || null,
          cls: vitals.cls || null,
          ttfb: vitals.ttfb || null,
          tti: vitals.tti || null,
          inp: vitals.inp || null,
        },
        navigation,
        resources,
        memory,
        connection,
        device,
      };

      setMetrics(completeMetrics);
    } catch (error) {
      console.error('Error collecting performance metrics:', error);
    } finally {
      setIsCollecting(false);
    }
  }, [vitals]);

  return { metrics, isCollecting, collectMetrics };
}

// Performance scoring utility
export function calculatePerformanceScore(vitals: CoreWebVitals): number {
  const scores = [];
  
  // LCP scoring (Good: ≤2.5s, Needs Improvement: ≤4s, Poor: >4s)
  if (vitals.lcp !== null) {
    if (vitals.lcp <= 2500) scores.push(100);
    else if (vitals.lcp <= 4000) scores.push(75);
    else scores.push(25);
  }
  
  // FID scoring (Good: ≤100ms, Needs Improvement: ≤300ms, Poor: >300ms)
  if (vitals.fid !== null) {
    if (vitals.fid <= 100) scores.push(100);
    else if (vitals.fid <= 300) scores.push(75);
    else scores.push(25);
  }
  
  // CLS scoring (Good: ≤0.1, Needs Improvement: ≤0.25, Poor: >0.25)
  if (vitals.cls !== null) {
    if (vitals.cls <= 0.1) scores.push(100);
    else if (vitals.cls <= 0.25) scores.push(75);
    else scores.push(25);
  }
  
  // FCP scoring (Good: ≤1.8s, Needs Improvement: ≤3s, Poor: >3s)
  if (vitals.fcp !== null) {
    if (vitals.fcp <= 1800) scores.push(100);
    else if (vitals.fcp <= 3000) scores.push(75);
    else scores.push(25);
  }
  
  return scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0;
}

// Performance recommendations generator
export function generateRecommendations(metrics: PerformanceMetrics): string[] {
  const recommendations: string[] = [];
  
  if (metrics.vitals.lcp && metrics.vitals.lcp > 2500) {
    recommendations.push('Optimize Largest Contentful Paint by reducing server response times and optimizing critical resources');
  }
  
  if (metrics.vitals.fid && metrics.vitals.fid > 100) {
    recommendations.push('Reduce First Input Delay by minimizing JavaScript execution time and using web workers');
  }
  
  if (metrics.vitals.cls && metrics.vitals.cls > 0.1) {
    recommendations.push('Improve Cumulative Layout Shift by adding size attributes to images and reserving space for dynamic content');
  }
  
  if (metrics.vitals.fcp && metrics.vitals.fcp > 1800) {
    recommendations.push('Optimize First Contentful Paint by reducing resource load times and eliminating render-blocking resources');
  }
  
  if (metrics.resources.totalSize > 3 * 1024 * 1024) { // 3MB
    recommendations.push('Reduce total page size by optimizing images, minifying resources, and implementing code splitting');
  }
  
  if (metrics.resources.largestResource && metrics.resources.largestResource.size > 1024 * 1024) { // 1MB
    recommendations.push(`Optimize large resource: ${metrics.resources.largestResource.name} (${(metrics.resources.largestResource.size / 1024 / 1024).toFixed(2)}MB)`);
  }
  
  if (metrics.memory && metrics.memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
    recommendations.push('Monitor memory usage - high JavaScript heap size detected');
  }
  
  return recommendations;
}

// Real User Monitoring (RUM) data collection
export function collectRUMData(metrics: PerformanceMetrics): void {
  if (typeof window === 'undefined') return;
  
  // Send to analytics service (implementation depends on your analytics provider)
  const rumData = {
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    vitals: metrics.vitals,
    connection: metrics.connection,
    device: metrics.device,
    score: calculatePerformanceScore(metrics.vitals),
  };
  
  // Example: Send to Google Analytics
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'core_web_vitals', {
      event_category: 'performance',
      event_label: window.location.pathname,
      custom_map: {
        lcp: metrics.vitals.lcp,
        fid: metrics.vitals.fid,
        cls: metrics.vitals.cls,
        fcp: metrics.vitals.fcp,
      },
    });
  }
  
  // Example: Send to custom analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rumData),
    }).catch(error => {
      console.warn('Failed to send RUM data:', error);
    });
  }
}