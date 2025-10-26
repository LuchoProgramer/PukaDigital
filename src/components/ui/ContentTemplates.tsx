"use client";

import React, { useState } from 'react';
import { FiFileText, FiList, FiBookOpen, FiTrendingUp, FiHelpCircle, FiX } from 'react-icons/fi';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  blocks: Array<{
    type: 'text' | 'image' | 'video';
    content?: string;
    placeholder?: string;
  }>;
  metadata?: {
    suggestedTitle?: string;
    suggestedExcerpt?: string;
  };
}

const templates: ContentTemplate[] = [
  {
    id: 'blog-post',
    name: 'Post de Blog Estándar',
    description: 'Estructura básica para un artículo de blog con introducción, desarrollo y conclusión',
    icon: <FiBookOpen className="w-5 h-5" />,
    blocks: [
      {
        type: 'text',
        content: '<h2>Introducción</h2><p>Comienza con un gancho que capture la atención del lector...</p>'
      },
      {
        type: 'image',
        placeholder: 'Imagen destacada relacionada con el tema'
      },
      {
        type: 'text',
        content: '<h2>Desarrollo Principal</h2><p>Desarrolla tu idea principal aquí. Proporciona ejemplos, datos o historias...</p>'
      },
      {
        type: 'text',
        content: '<h2>Puntos Clave</h2><ul><li>Punto importante 1</li><li>Punto importante 2</li><li>Punto importante 3</li></ul>'
      },
      {
        type: 'text',
        content: '<h2>Conclusión</h2><p>Resume los puntos principales y proporciona una llamada a la acción...</p>'
      }
    ],
    metadata: {
      suggestedTitle: 'Título Descriptivo del Artículo',
      suggestedExcerpt: 'Una breve descripción que resuma el contenido principal del artículo para atraer a los lectores.'
    }
  },
  {
    id: 'tutorial',
    name: 'Tutorial Paso a Paso',
    description: 'Guía estructurada para enseñar algo específico con pasos claros',
    icon: <FiList className="w-5 h-5" />,
    blocks: [
      {
        type: 'text',
        content: '<h2>¿Qué vas a aprender?</h2><p>En este tutorial aprenderás...</p>'
      },
      {
        type: 'text',
        content: '<h2>Antes de comenzar</h2><p>Requisitos previos y herramientas necesarias...</p>'
      },
      {
        type: 'text',
        content: '<h2>Paso 1: [Nombre del paso]</h2><p>Descripción detallada del primer paso...</p>'
      },
      {
        type: 'image',
        placeholder: 'Captura de pantalla o imagen del paso 1'
      },
      {
        type: 'text',
        content: '<h2>Paso 2: [Nombre del paso]</h2><p>Descripción detallada del segundo paso...</p>'
      },
      {
        type: 'text',
        content: '<h2>Conclusión y próximos pasos</h2><p>¡Felicitaciones! Has completado el tutorial...</p>'
      }
    ],
    metadata: {
      suggestedTitle: 'Cómo [Hacer algo específico]: Guía Paso a Paso',
      suggestedExcerpt: 'Tutorial completo que te enseñará paso a paso cómo lograr [objetivo específico] de manera sencilla.'
    }
  },
  {
    id: 'case-study',
    name: 'Caso de Estudio',
    description: 'Análisis detallado de un proyecto, estrategia o resultado específico',
    icon: <FiTrendingUp className="w-5 h-5" />,
    blocks: [
      {
        type: 'text',
        content: '<h2>Resumen Ejecutivo</h2><p>Breve descripción del caso y resultados principales...</p>'
      },
      {
        type: 'text',
        content: '<h2>El Desafío</h2><p>¿Cuál era el problema o situación inicial?</p>'
      },
      {
        type: 'text',
        content: '<h2>Estrategia y Enfoque</h2><p>¿Qué estrategia se implementó para resolver el desafío?</p>'
      },
      {
        type: 'image',
        placeholder: 'Gráfico o imagen que ilustre la estrategia'
      },
      {
        type: 'text',
        content: '<h2>Implementación</h2><p>Cómo se ejecutó la estrategia paso a paso...</p>'
      },
      {
        type: 'text',
        content: '<h2>Resultados y Métricas</h2><p>Datos específicos y métricas del éxito...</p>'
      },
      {
        type: 'text',
        content: '<h2>Lecciones Aprendidas</h2><p>¿Qué aprendimos de este caso?</p>'
      }
    ],
    metadata: {
      suggestedTitle: 'Caso de Estudio: [Resultado específico logrado]',
      suggestedExcerpt: 'Análisis detallado de cómo logramos [resultado específico] y las estrategias que funcionaron.'
    }
  },
  {
    id: 'faq',
    name: 'Preguntas Frecuentes',
    description: 'Formato de preguntas y respuestas para temas comunes',
    icon: <FiHelpCircle className="w-5 h-5" />,
    blocks: [
      {
        type: 'text',
        content: '<h2>Introducción</h2><p>Aquí encontrarás respuestas a las preguntas más frecuentes sobre...</p>'
      },
      {
        type: 'text',
        content: '<h3>¿Pregunta frecuente número 1?</h3><p>Respuesta detallada y útil...</p>'
      },
      {
        type: 'text',
        content: '<h3>¿Pregunta frecuente número 2?</h3><p>Respuesta detallada y útil...</p>'
      },
      {
        type: 'text',
        content: '<h3>¿Pregunta frecuente número 3?</h3><p>Respuesta detallada y útil...</p>'
      },
      {
        type: 'text',
        content: '<h2>¿No encontraste tu respuesta?</h2><p>Si tienes otras preguntas, no dudes en contactarnos...</p>'
      }
    ],
    metadata: {
      suggestedTitle: 'Preguntas Frecuentes sobre [Tema]',
      suggestedExcerpt: 'Respuestas claras a las preguntas más comunes sobre [tema específico].'
    }
  }
];

interface ContentTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: ContentTemplate) => void;
}

export const ContentTemplateModal: React.FC<ContentTemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FiFileText className="text-blue-500" />
            Plantillas de Contenido
          </h2>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            leftIcon={<FiX />}
          >
            Cerrar
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:border-blue-300 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base">
                    <div className="text-blue-500">
                      {template.icon}
                    </div>
                    {template.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    {template.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Incluye {template.blocks.length} bloques:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.blocks.map((block, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            block.type === 'text' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : block.type === 'image'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          }`}
                        >
                          {block.type === 'text' ? 'Texto' : block.type === 'image' ? 'Imagen' : 'Video'}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => {
                      onSelectTemplate(template);
                      onClose();
                    }}
                    size="sm"
                    className="w-full"
                  >
                    Usar esta plantilla
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ContentTemplateButtonProps {
  onSelectTemplate: (template: ContentTemplate) => void;
  className?: string;
  variant?: 'primary' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const ContentTemplateButton: React.FC<ContentTemplateButtonProps> = ({
  onSelectTemplate,
  className = '',
  variant = 'outline',
  size = 'sm'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={variant}
        size={size}
        leftIcon={<FiFileText />}
        className={className}
      >
        Usar Plantilla
      </Button>
      
      <ContentTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectTemplate={onSelectTemplate}
      />
    </>
  );
};

export default ContentTemplateButton;