"use client";

import React, { useState } from 'react';
import { migrationScript } from '@/lib/migration';

const MigrationPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const runMigration = async () => {
    setIsRunning(true);
    setStatus('running');
    setLogs([]);
    
    try {
      addLog('🎯 Iniciando migración a estructura multitenant...');
      
      // Paso 1: Crear tenant por defecto
      addLog('📋 Paso 1: Creando tenant por defecto...');
      await migrationScript.createDefaultTenant();
      addLog('✅ Tenant por defecto creado');
      
      // Paso 2: Migrar usuarios
      addLog('👥 Paso 2: Migrando usuarios...');
      await migrationScript.migrateUsers();
      addLog('✅ Usuarios migrados');
      
      // Paso 3: Migrar blogs
      addLog('📝 Paso 3: Migrando blogs...');
      await migrationScript.migrateBlogs();
      addLog('✅ Blogs migrados');
      
      addLog('🎉 ¡Migración completada exitosamente!');
      addLog('📝 Los datos originales se mantienen intactos como respaldo');
      setStatus('success');
      
    } catch (error) {
      addLog(`❌ Error en la migración: ${error}`);
      setStatus('error');
      console.error('Migration error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runRollback = async () => {
    if (!confirm('⚠️ ¿Estás seguro de que quieres hacer rollback? Esto eliminará todos los datos migrados.')) {
      return;
    }
    
    setIsRunning(true);
    setLogs([]);
    
    try {
      addLog('⚠️ Ejecutando rollback...');
      await migrationScript.rollback();
      addLog('✅ Rollback completado');
      setStatus('idle');
    } catch (error) {
      addLog(`❌ Error en rollback: ${error}`);
      console.error('Rollback error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            🔄 Migración a Multitenant
          </h1>

          {/* Información */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
              ℹ️ ¿Qué hace esta migración?
            </h2>
            <ul className="text-blue-700 dark:text-blue-300 space-y-2">
              <li>• Crea un tenant por defecto llamado "PukaDigital"</li>
              <li>• Mueve todos los usuarios existentes al nuevo tenant</li>
              <li>• Mueve todos los blogs existentes al nuevo tenant</li>
              <li>• <strong>NO elimina</strong> los datos originales (están seguros)</li>
              <li>• Puedes hacer rollback si algo sale mal</li>
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={runMigration}
              disabled={isRunning || status === 'success'}
              className={`px-6 py-3 rounded-lg font-semibold ${
                status === 'success'
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50'
              }`}
            >
              {isRunning ? '🔄 Migrando...' : status === 'success' ? '✅ Migrado' : '🚀 Ejecutar Migración'}
            </button>

            {status === 'success' && (
              <button
                onClick={runRollback}
                disabled={isRunning}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {isRunning ? '🔄 Haciendo rollback...' : '⚠️ Rollback'}
              </button>
            )}
          </div>

          {/* Status indicator */}
          {status !== 'idle' && (
            <div className={`mb-6 p-4 rounded-lg ${
              status === 'running' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              status === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              'bg-red-50 border-red-200 text-red-800'
            }`}>
              {status === 'running' && '🔄 Migración en progreso...'}
              {status === 'success' && '✅ Migración completada exitosamente'}
              {status === 'error' && '❌ Error en la migración'}
            </div>
          )}

          {/* Logs */}
          {logs.length > 0 && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              <h3 className="text-white mb-2">📋 Logs de migración:</h3>
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          )}

          {/* Próximos pasos */}
          {status === 'success' && (
            <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                🎉 ¡Migración Completada!
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Próximos pasos:
              </p>
              <ol className="text-green-700 dark:text-green-300 space-y-2">
                <li>1. Actualizar los componentes para usar la nueva estructura</li>
                <li>2. Probar que todo funciona correctamente</li>
                <li>3. Crear interfaces de administración de tenants</li>
                <li>4. (Opcional) Limpiar datos antiguos después de confirmar que todo funciona</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MigrationPage;