"use client";

import React from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useTenant } from '@/context/TenantContext';
import Link from 'next/link';

const AuthDebugPage: React.FC = () => {
  const { tenant } = useTenant();
  const { user, isAdmin, loading } = useAdminAuth({ tenantId: tenant?.id });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          🔍 Debug de Autenticación
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estado del Usuario */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">👤 Usuario Firebase</h2>
            {user ? (
              <div className="space-y-2">
                <p><strong>UID:</strong> {user.uid}</p>
                <p><strong>Email:</strong> {user.email || 'No email'}</p>
                <p><strong>Display Name:</strong> {user.displayName || 'No name'}</p>
                <p><strong>Email Verified:</strong> {user.emailVerified ? '✅' : '❌'}</p>
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                  <p className="text-green-800 dark:text-green-200">✅ Usuario autenticado en Firebase</p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <p className="text-red-800 dark:text-red-200">❌ No hay usuario autenticado en Firebase</p>
              </div>
            )}
          </div>

          {/* Estado del Tenant */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">🏢 Tenant Actual</h2>
            {tenant ? (
              <div className="space-y-2">
                <p><strong>ID:</strong> {tenant.id}</p>
                <p><strong>Nombre:</strong> {tenant.name}</p>
                <p><strong>Dominio:</strong> {tenant.domain || 'No configurado'}</p>
                <p><strong>Plan:</strong> {tenant.subscription}</p>
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                  <p className="text-green-800 dark:text-green-200">✅ Tenant cargado correctamente</p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                <p className="text-yellow-800 dark:text-yellow-200">⚠️ No hay tenant cargado</p>
              </div>
            )}
          </div>

          {/* Estado de Permisos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">🔐 Permisos</h2>
            <div className="space-y-2">
              <p><strong>Es Admin:</strong> {isAdmin ? '✅ Sí' : '❌ No'}</p>
              <p><strong>Hook Loading:</strong> {loading ? '⏳ Cargando' : '✅ Cargado'}</p>
            </div>
            
            {isAdmin ? (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                <p className="text-green-800 dark:text-green-200">✅ Tienes permisos de administrador</p>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <p className="text-red-800 dark:text-red-200">❌ No tienes permisos de administrador</p>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">🔧 Acciones</h2>
            <div className="space-y-3">
              <Link
                href="/admin/login"
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded"
              >
                🔐 Ir a Login
              </Link>
              <Link
                href="/cms/blogs/dashboard"
                className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-2 px-4 rounded"
              >
                📊 Intentar Dashboard
              </Link>
              <Link
                href="/admin/tenants"
                className="block w-full bg-purple-500 hover:bg-purple-600 text-white text-center py-2 px-4 rounded"
              >
                🏢 Panel de Tenants
              </Link>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">📋 Información del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">URLs Disponibles:</h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• /admin/login - Página de login</li>
                <li>• /cms/blogs/dashboard - Dashboard principal</li>
                <li>• /admin/tenants - Panel de administración</li>
                <li>• /admin/debug - Esta página</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Estado esperado:</h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Usuario autenticado con Google</li>
                <li>• Tenant "default" cargado</li>
                <li>• Permisos de admin habilitados</li>
                <li>• Acceso al dashboard permitido</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugPage;