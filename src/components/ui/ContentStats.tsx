"use client";

import React from 'react';
import { FiFileText, FiImage, FiVideo, FiClock, FiEye } from 'react-icons/fi';

interface ContentStatsProps {
  blocks: Array<{
    type: 'text' | 'image' | 'video';
    content?: string;
    src?: string;
  }>;
  title: string;
  excerpt: string;
  className?: string;
}

export const ContentStats: React.FC<ContentStatsProps> = ({
  blocks,
  title,
  excerpt,
  className = ''
}) => {
  // Calcular estadísticas
  const textBlocks = blocks.filter(block => block.type === 'text');
  const imageBlocks = blocks.filter(block => block.type === 'image');
  const videoBlocks = blocks.filter(block => block.type === 'video');
  
  // Contar palabras
  const titleWords = title.trim().split(/\s+/).filter(word => word.length > 0).length;
  const excerptWords = excerpt.trim().split(/\s+/).filter(word => word.length > 0).length;
  const contentWords = textBlocks.reduce((total, block) => {
    const text = block.content?.replace(/<[^>]*>/g, '') || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    return total + words;
  }, 0);
  
  const totalWords = titleWords + excerptWords + contentWords;
  
  // Estimar tiempo de lectura (250 palabras por minuto promedio)
  const readingTime = Math.max(1, Math.ceil(totalWords / 250));
  
  // Calcular progreso del contenido (basado en mejores prácticas SEO)
  const getContentProgress = () => {
    let score = 0;
    let maxScore = 100;
    
    // Título (20 puntos)
    if (title.length >= 30 && title.length <= 60) score += 20;
    else if (title.length > 0) score += 10;
    
    // Excerpt (15 puntos)
    if (excerpt.length >= 120 && excerpt.length <= 160) score += 15;
    else if (excerpt.length > 0) score += 7;
    
    // Contenido (40 puntos)
    if (totalWords >= 300) score += 40;
    else if (totalWords >= 150) score += 20;
    else if (totalWords > 0) score += 10;
    
    // Imágenes (15 puntos)
    if (imageBlocks.length >= 1) score += 15;
    
    // Estructura de contenido (10 puntos)
    if (blocks.length >= 3) score += 10;
    else if (blocks.length >= 2) score += 5;
    
    return Math.min(score, maxScore);
  };
  
  const progress = getContentProgress();
  const progressColor = progress >= 80 ? 'text-green-600' : progress >= 60 ? 'text-yellow-600' : 'text-red-600';
  const progressBgColor = progress >= 80 ? 'bg-green-600' : progress >= 60 ? 'bg-yellow-600' : 'bg-red-600';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Estadísticas del Contenido
        </h3>
        <div className={`text-sm font-medium ${progressColor}`}>
          {progress}% Completo
        </div>
      </div>
      
      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${progressBgColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Estadísticas en grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <FiFileText className="text-blue-500" />
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {totalWords.toLocaleString()}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Palabras
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <FiClock className="text-green-500" />
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {readingTime} min
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Lectura
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <FiImage className="text-purple-500" />
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {imageBlocks.length}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Imágenes
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <FiVideo className="text-red-500" />
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {videoBlocks.length}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Videos
            </div>
          </div>
        </div>
      </div>
      
      {/* Sugerencias de mejora */}
      {progress < 100 && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Sugerencias para mejorar:
          </div>
          <div className="space-y-1 text-xs">
            {title.length === 0 && (
              <div className="text-amber-600">• Agrega un título</div>
            )}
            {title.length > 0 && (title.length < 30 || title.length > 60) && (
              <div className="text-amber-600">• Título óptimo: 30-60 caracteres</div>
            )}
            {excerpt.length === 0 && (
              <div className="text-amber-600">• Agrega una descripción</div>
            )}
            {excerpt.length > 0 && (excerpt.length < 120 || excerpt.length > 160) && (
              <div className="text-amber-600">• Descripción óptima: 120-160 caracteres</div>
            )}
            {totalWords < 300 && (
              <div className="text-amber-600">• Agrega más contenido (mínimo 300 palabras)</div>
            )}
            {imageBlocks.length === 0 && (
              <div className="text-amber-600">• Agrega al menos una imagen</div>
            )}
            {blocks.length < 3 && (
              <div className="text-amber-600">• Agrega más bloques de contenido</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentStats;