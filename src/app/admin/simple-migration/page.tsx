"use client";

import React, { useState } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { SubscriptionPlan, UserRole } from '@/types';

const SimpleMigrationPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [step, setStep] = useState<'idle' | 'tenant' | 'users' | 'blogs' | 'complete'>('idle');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const createTenantManually = async () => {
    try {
      addLog('🏢 Creando tenant manualmente...');
      
      // Verificar si ya existe
      const tenantDoc = await getDoc(doc(db, 'tenants', 'default'));
      if (tenantDoc.exists()) {
        addLog('✅ Tenant ya existe');
        return;
      }

      const tenantData = {
        name: 'PukaDigital',
        domain: 'pukadigital.com',
        branding: {
          primaryColor: '#3B82F6',
          secondaryColor: '#1E40AF',
          fontFamily: 'Inter',
        },
        settings: {
          siteName: 'PukaDigital Blog',
          description: 'Blog de PukaDigital - Marketing Digital y Tecnología',
          defaultAuthor: 'PukaDigital Team',
        },
        subscription: SubscriptionPlan.PRO,
        createdAt: Timestamp.fromDate(new Date()),
        adminUsers: user ? [user.uid] : [],
      };

      await setDoc(doc(db, 'tenants', 'default'), tenantData);
      addLog('✅ Tenant creado exitosamente');
      
    } catch (error) {
      addLog(`❌ Error creando tenant: ${error}`);
      throw error;
    }
  };

  const checkPermissions = async () => {
    addLog('🔐 Verificando permisos...');
    
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    
    addLog(`👤 Usuario: ${user.email}`);
    
    // Verificar si puede escribir en users
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        addLog(`👑 Rol actual: ${userData.role || 'No definido'}`);
        
        if (userData.role !== 'admin') {
          addLog('⚠️ Advertencia: No eres admin, pero continuaremos...');
        }
      }
    } catch (error) {
      addLog(`⚠️ No se pudo verificar rol: ${error}`);
    }
  };

  const runStep = async (stepName: 'tenant' | 'users' | 'blogs') => {
    setStep(stepName);
    
    try {
      switch (stepName) {
        case 'tenant':
          await createTenantManually();
          break;
          
        case 'users':
          addLog('👥 Migrando usuarios...');
          const usersSnapshot = await getDocs(collection(db, 'users'));
          let userCount = 0;
          
          for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            await setDoc(
              doc(db, 'tenants', 'default', 'users', userDoc.id),
              {
                email: userData.email || 'unknown@email.com',
                name: userData.name || 'Usuario',
                role: userData.role === 'admin' ? UserRole.ADMIN : UserRole.EDITOR,
                tenantId: 'default',
                createdAt: userData.createdAt || Timestamp.fromDate(new Date()),
              }
            );
            userCount++;
          }
          addLog(`✅ ${userCount} usuarios migrados`);
          break;
          
        case 'blogs':
          addLog('📝 Migrando blogs...');
          const blogsSnapshot = await getDocs(collection(db, 'blogs'));
          let blogCount = 0;
          
          for (const blogDoc of blogsSnapshot.docs) {
            const blogData = blogDoc.data();
            await setDoc(
              doc(db, 'tenants', 'default', 'blogs', blogDoc.id),
              {
                ...blogData,
                tenantId: 'default',
                author: blogData.author || { name: 'Autor Desconocido' },
                createdAt: blogData.createdAt || Timestamp.fromDate(new Date()),
              }
            );
            blogCount++;
          }
          addLog(`✅ ${blogCount} blogs migrados`);
          break;
      }
    } catch (error) {
      addLog(`❌ Error en paso ${stepName}: ${error}`);
      throw error;
    }
  };

  const runFullMigration = async () => {
    setIsRunning(true);
    setLogs([]);
    
    try {
      await checkPermissions();
      await runStep('tenant');
      await runStep('users');
      await runStep('blogs');
      
      setStep('complete');
      addLog('🎉 ¡Migración completada exitosamente!');
      
    } catch (error) {
      addLog(`💥 Error fatal: ${error}`);
      setStep('idle');
    } finally {
      setIsRunning(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
            🔐 Autenticación Requerida
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Debes iniciar sesión para ejecutar la migración.
          </p>
          <a href="/cms/blogs/dashboard" className="bg-blue-500 text-white px-6 py-3 rounded-lg">
            Ir al Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            🔄 Migración Simplificada
          </h1>

          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              👤 Usuario: <strong>{user.email}</strong>
            </p>
            
            <div className="flex gap-4 mb-6">
              <button
                onClick={runFullMigration}
                disabled={isRunning}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {isRunning ? '🔄 Ejecutando...' : '🚀 Migración Completa'}
              </button>
              
              <button
                onClick={() => runStep('tenant')}
                disabled={isRunning}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
              >
                Solo Tenant
              </button>
              
              <button
                onClick={() => runStep('users')}
                disabled={isRunning}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg disabled:opacity-50"
              >
                Solo Usuarios
              </button>
              
              <button
                onClick={() => runStep('blogs')}
                disabled={isRunning}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50"
              >
                Solo Blogs
              </button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${step === 'tenant' || step === 'users' || step === 'blogs' || step === 'complete' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Tenant</span>
              
              <div className={`w-4 h-4 rounded-full ${step === 'users' || step === 'blogs' || step === 'complete' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Usuarios</span>
              
              <div className={`w-4 h-4 rounded-full ${step === 'blogs' || step === 'complete' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Blogs</span>
              
              <div className={`w-4 h-4 rounded-full ${step === 'complete' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Completo</span>
            </div>
          </div>

          {/* Logs */}
          {logs.length > 0 && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              <h3 className="text-white mb-2">📋 Logs:</h3>
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleMigrationPage;