"use client";

import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  // Escuchar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Crear o actualizar documento de usuario
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Crear nuevo usuario
        await setDoc(userRef, {
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'Usuario',
          role: 'admin', // Por defecto admin para migration
          createdAt: new Date(),
          lastLoginAt: new Date(),
        });
        console.log('✅ Usuario creado en Firestore');
      } else {
        // Actualizar last login
        await setDoc(userRef, {
          lastLoginAt: new Date(),
        }, { merge: true });
        console.log('✅ Usuario actualizado en Firestore');
      }

      console.log('🎉 Login exitoso:', firebaseUser.email);
      
      // Redirigir a migración después de un breve delay
      setTimeout(() => {
        router.push('/admin/simple-migration');
      }, 1000);

    } catch (error: any) {
      console.error('❌ Error en login:', error);
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('✅ Logout exitoso');
    } catch (error: any) {
      console.error('❌ Error en logout:', error);
      setError(error.message || 'Error al cerrar sesión');
    }
  };

  // Redirigir automáticamente si ya está autenticado
  useEffect(() => {
    if (user && !loading) {
      console.log('👤 Usuario ya autenticado:', user.email);
      // Pequeño delay para que el usuario vea el estado
      setTimeout(() => {
        router.push('/admin/simple-migration');
      }, 2000);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            🔐 Login Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Inicia sesión para ejecutar la migración multitenant
          </p>
        </div>

        {/* Estado del usuario */}
        {user ? (
          <div className="space-y-6">
            {/* Usuario autenticado */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-200">
                    ✅ Autenticado
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admin/simple-migration')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                🚀 Ir a Migración
              </button>
              
              <button
                onClick={() => router.push('/cms/blogs/dashboard')}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                📊 Ir al Dashboard
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                🚪 Cerrar Sesión
              </button>
            </div>

            {/* Auto-redirect notice */}
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ⏱️ Serás redirigido automáticamente a la migración en 2 segundos...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* No autenticado */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-200 text-center">
                ⚠️ Necesitas iniciar sesión para continuar
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  ❌ {error}
                </p>
              </div>
            )}

            {/* Botón de login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isSigningIn}
              className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
            >
              {isSigningIn ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continuar con Google</span>
                </>
              )}
            </button>

            {/* Info adicional */}
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Se creará automáticamente un usuario admin para la migración
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;