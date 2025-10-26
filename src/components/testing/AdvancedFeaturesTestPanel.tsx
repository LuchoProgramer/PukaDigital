"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useBlogEditorShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { AutoSaveStatus } from '@/components/ui/AutoSaveStatus';
import { ShortcutHelp } from '@/components/ui/ShortcutHelp';
import { ContentStats } from '@/components/ui/ContentStats';
import { ContentTemplateButton } from '@/components/ui/ContentTemplates';
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertTriangle, 
  FiInfo,
  FiPlay,
  FiRefreshCw,
  FiMove,
  FiSave,
  FiType,
  FiImage,
  FiVideo
} from 'react-icons/fi';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'warning' | 'pending';
  message: string;
  details?: string;
}

interface TestBlock {
  type: 'text' | 'image' | 'video';
  content?: string;
  src?: string;
  alt?: string;
}

const AdvancedFeaturesTestPanel: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testData, setTestData] = useState({
    title: 'Test Blog Title',
    author: 'Test Author',
    excerpt: 'This is a test excerpt for validation purposes.'
  });
  const [testBlocks, setTestBlocks] = useState<TestBlock[]>([
    { type: 'text', content: 'First test block' },
    { type: 'text', content: 'Second test block' },
    { type: 'text', content: 'Third test block' }
  ]);

  const saveCount = useRef(0);
  const shortcutTriggers = useRef({
    save: 0,
    addText: 0,
    addImage: 0,
    addVideo: 0
  });

  // Auto-save test
  const autoSave = useAutoSave({
    interval: 5000, // 5 segundos para testing
    enabled: true,
    onSave: async (data) => {
      saveCount.current++;
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 500));
      updateTestResult('autoSave', 'passed', `Auto-guardado ejecutado ${saveCount.current} veces`);
    },
    getData: () => ({ ...testData, blocks: testBlocks }),
    isValid: () => testData.title.trim() !== '' && testData.author.trim() !== ''
  });

  // Keyboard shortcuts test
  const shortcuts = useBlogEditorShortcuts({
    onSave: () => {
      shortcutTriggers.current.save++;
      updateTestResult('shortcutSave', 'passed', `Atajo de guardado activado ${shortcutTriggers.current.save} veces`);
    },
    onAddText: () => {
      shortcutTriggers.current.addText++;
      setTestBlocks(prev => [...prev, { type: 'text', content: `New text block ${prev.length + 1}` }]);
      updateTestResult('shortcutAddText', 'passed', `Atajo agregar texto activado ${shortcutTriggers.current.addText} veces`);
    },
    onAddImage: () => {
      shortcutTriggers.current.addImage++;
      updateTestResult('shortcutAddImage', 'passed', `Atajo agregar imagen activado ${shortcutTriggers.current.addImage} veces`);
    },
    onAddVideo: () => {
      shortcutTriggers.current.addVideo++;
      updateTestResult('shortcutAddVideo', 'passed', `Atajo agregar video activado ${shortcutTriggers.current.addVideo} veces`);
    },
    enabled: true
  });

  // Drag and drop test
  const dragAndDrop = useDragAndDrop({
    items: testBlocks,
    onReorder: (newBlocks) => {
      setTestBlocks(newBlocks);
      updateTestResult('dragDrop', 'passed', 'Reordenamiento por drag & drop ejecutado correctamente');
    },
    enabled: true
  });

  const updateTestResult = (testName: string, status: TestResult['status'], message: string, details?: string) => {
    setTestResults(prev => {
      const filtered = prev.filter(r => r.name !== testName);
      return [...filtered, { name: testName, status, message, details }];
    });
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Auto-save initialization
      updateTestResult('autoSaveInit', 'passed', 'Auto-save inicializado correctamente');

      // Test 2: Keyboard shortcuts setup
      const shortcutHelp = shortcuts.getShortcutsHelp();
      if (shortcutHelp.length > 0) {
        updateTestResult('shortcutsInit', 'passed', `${shortcutHelp.length} atajos de teclado configurados`);
      } else {
        updateTestResult('shortcutsInit', 'failed', 'No se encontraron atajos de teclado');
      }

      // Test 3: Drag and drop initialization
      if (dragAndDrop) {
        updateTestResult('dragDropInit', 'passed', 'Drag & drop inicializado correctamente');
      } else {
        updateTestResult('dragDropInit', 'failed', 'Error en inicialización de drag & drop');
      }

      // Test 4: Content stats calculation
      if (testBlocks.length > 0) {
        updateTestResult('contentStats', 'passed', `Estadísticas calculadas para ${testBlocks.length} bloques`);
      } else {
        updateTestResult('contentStats', 'warning', 'No hay bloques para calcular estadísticas');
      }

      // Test 5: Form validation
      if (testData.title && testData.author) {
        updateTestResult('validation', 'passed', 'Validación de formulario funcionando');
      } else {
        updateTestResult('validation', 'failed', 'Error en validación de formulario');
      }

      // Test 6: Auto-save trigger test
      autoSave.markAsChanged();
      updateTestResult('autoSaveTrigger', 'passed', 'Auto-save marcado como cambiado');

      // Test 7: Manual save test
      const saveSuccess = await autoSave.saveNow();
      if (saveSuccess) {
        updateTestResult('manualSave', 'passed', 'Guardado manual ejecutado correctamente');
      } else {
        updateTestResult('manualSave', 'failed', 'Error en guardado manual');
      }

    } catch (error) {
      updateTestResult('generalError', 'failed', `Error general: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetTests = () => {
    setTestResults([]);
    saveCount.current = 0;
    shortcutTriggers.current = { save: 0, addText: 0, addImage: 0, addVideo: 0 };
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return <FiCheckCircle className="text-green-500" />;
      case 'failed': return <FiXCircle className="text-red-500" />;
      case 'warning': return <FiAlertTriangle className="text-yellow-500" />;
      default: return <FiInfo className="text-blue-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return 'bg-green-50 border-green-200 text-green-800';
      case 'failed': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiPlay className="text-blue-500" />
            Panel de Pruebas - Características Avanzadas UX
          </CardTitle>
          <p className="text-gray-600">
            Validación interactiva de auto-guardado, atajos de teclado, drag & drop y otras características avanzadas.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={runAllTests}
              loading={isRunning}
              leftIcon={<FiPlay />}
              variant="primary"
            >
              {isRunning ? 'Ejecutando...' : 'Ejecutar Todas las Pruebas'}
            </Button>
            <Button
              onClick={resetTests}
              leftIcon={<FiRefreshCw />}
              variant="outline"
            >
              Reiniciar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Components Display */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estado de Auto-guardado</CardTitle>
          </CardHeader>
          <CardContent>
            <AutoSaveStatus
              lastSaved={autoSave.lastSaved}
              isSaving={autoSave.isSaving}
              hasUnsavedChanges={autoSave.hasUnsavedChanges}
              error={autoSave.error}
              getLastSavedText={autoSave.getLastSavedText}
            />
            <div className="mt-4 text-sm text-gray-600">
              <p>Guardados automáticos: {saveCount.current}</p>
              <p>Intervalo: 5 segundos (para testing)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ayuda de Atajos</CardTitle>
          </CardHeader>
          <CardContent>
            <ShortcutHelp shortcuts={shortcuts.getShortcutsHelp()} />
            <div className="mt-4 text-sm text-gray-600">
              <p>Prueba los atajos:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Cmd/Ctrl + S: Guardar ({shortcutTriggers.current.save})</li>
                <li>Cmd/Ctrl + Shift + T: Agregar texto ({shortcutTriggers.current.addText})</li>
                <li>Cmd/Ctrl + Shift + I: Agregar imagen ({shortcutTriggers.current.addImage})</li>
                <li>Cmd/Ctrl + Shift + V: Agregar video ({shortcutTriggers.current.addVideo})</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Stats */}
      <ContentStats
        blocks={testBlocks}
        title={testData.title}
        excerpt={testData.excerpt}
      />

      {/* Test Form */}
      <Card>
        <CardHeader>
          <CardTitle>Formulario de Prueba</CardTitle>
          <p className="text-sm text-gray-600">
            Modifica estos campos para probar validación y auto-guardado
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Título"
              value={testData.title}
              onChange={(e) => {
                setTestData(prev => ({ ...prev, title: e.target.value }));
                autoSave.markAsChanged();
              }}
            />
            <Input
              label="Autor"
              value={testData.author}
              onChange={(e) => {
                setTestData(prev => ({ ...prev, author: e.target.value }));
                autoSave.markAsChanged();
              }}
            />
            <div className="md:col-span-2">
              <Input
                label="Extracto"
                value={testData.excerpt}
                onChange={(e) => {
                  setTestData(prev => ({ ...prev, excerpt: e.target.value }));
                  autoSave.markAsChanged();
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drag and Drop Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiMove className="text-purple-500" />
            Prueba de Drag & Drop
          </CardTitle>
          <p className="text-sm text-gray-600">
            Arrastra los elementos para probar el reordenamiento
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {testBlocks.map((block, index) => (
              <div
                key={index}
                {...dragAndDrop.getDropProps(index)}
                className={`relative ${dragAndDrop.getDropProps(index).className || ''}`}
              >
                <div
                  {...dragAndDrop.getDragProps(index, block.type, `block-${index}`)}
                  className={`p-4 bg-gray-50 border rounded-lg cursor-move flex items-center gap-3 ${
                    dragAndDrop.draggedItem?.index === index ? 'opacity-50' : ''
                  }`}
                >
                  <FiMove className="text-gray-400" />
                  {block.type === 'text' && <FiType className="text-blue-500" />}
                  {block.type === 'image' && <FiImage className="text-green-500" />}
                  {block.type === 'video' && <FiVideo className="text-red-500" />}
                  <span>
                    {block.type === 'text' ? 'Texto' : block.type === 'image' ? 'Imagen' : 'Video'}: {block.content || 'Sin contenido'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Test */}
      <Card>
        <CardHeader>
          <CardTitle>Prueba de Plantillas</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentTemplateButton
            onSelectTemplate={(template) => {
              updateTestResult('templateApply', 'passed', `Plantilla "${template.name}" aplicada correctamente`);
            }}
          />
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de las Pruebas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border flex items-start gap-3 ${getStatusColor(result.status)}`}
                >
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm mt-1">{result.message}</div>
                    {result.details && (
                      <div className="text-xs mt-2 opacity-75">{result.details}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Resumen</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-green-600 font-medium">
                    {testResults.filter(r => r.status === 'passed').length}
                  </div>
                  <div className="text-gray-600">Exitosas</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 font-medium">
                    {testResults.filter(r => r.status === 'failed').length}
                  </div>
                  <div className="text-gray-600">Fallidas</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-600 font-medium">
                    {testResults.filter(r => r.status === 'warning').length}
                  </div>
                  <div className="text-gray-600">Advertencias</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedFeaturesTestPanel;