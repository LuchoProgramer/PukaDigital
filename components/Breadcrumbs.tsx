'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { getBreadcrumbSchema, type BreadcrumbItem } from '@/lib/schema';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs Component
 * - Visual breadcrumb navigation
 * - Schema.org BreadcrumbList structured data
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const schema = getBreadcrumbSchema(items);

  return (
    <>
      {/* Schema.org BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Visual Breadcrumbs */}
      <nav 
        aria-label="Breadcrumb" 
        className={`text-sm ${className}`}
      >
        <ol className="flex items-center flex-wrap gap-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;
            
            return (
              <li key={item.url} className="flex items-center">
                {index > 0 && (
                  <ChevronRight 
                    size={14} 
                    className="mx-1 text-gray-400 dark:text-gray-500" 
                  />
                )}
                
                {isLast ? (
                  <span 
                    className="text-gray-600 dark:text-gray-400 font-medium"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="text-gray-500 dark:text-gray-400 hover:text-puka-red dark:hover:text-puka-red transition-colors flex items-center gap-1"
                  >
                    {isFirst && <Home size={14} />}
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
