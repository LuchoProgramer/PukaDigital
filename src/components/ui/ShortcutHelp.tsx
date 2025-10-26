"use client";

import React, { useState } from 'react';
import { FiCommand, FiX, FiHelpCircle } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface ShortcutHelpProps {
  shortcuts: Array<{
    key: string;
    description: string;
  }>;
  className?: string;
}

export const ShortcutHelp: React.FC<ShortcutHelpProps> = ({ 
  shortcuts, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (shortcuts.length === 0) return null;

  return (
    <>
      {/* Botón para abrir ayuda */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-40 shadow-lg ${className}`}
        title="Atajos de teclado"
      >
        <FiCommand className="h-4 w-4 mr-2" />
        Atajos
      </Button>

      {/* Modal de ayuda */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full max-h-[80vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FiCommand className="h-5 w-5 mr-2 text-blue-500" />
                  Atajos de Teclado
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <FiX className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    <kbd className="px-3 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-2 text-xs text-gray-600 dark:text-gray-400">
                  <FiHelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Los atajos funcionan cuando no estás escribiendo en un campo de texto. 
                    Algunos atajos como <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+S</kbd> funcionan en cualquier momento.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ShortcutHelp;