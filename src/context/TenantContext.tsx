"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { Tenant, TenantUser } from '@/types';

interface TenantContextType {
  tenant: Tenant | null;
  tenantUser: TenantUser | null;
  isLoading: boolean;
  error: string | null;
  switchTenant: (tenantId: string) => Promise<void>;
  createTenant: (tenantData: Partial<Tenant>) => Promise<string>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
  tenantId?: string; // Para subdominios o parámetros de URL
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ 
  children, 
  tenantId 
}) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenantUser, setTenantUser] = useState<TenantUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Escuchar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  // Obtener tenant por defecto o del parámetro
  const getCurrentTenantId = (): string => {
    // Si se pasa tenantId como prop (subdomain, etc.)
    if (tenantId) return tenantId;
    
    // Por ahora, usar un tenant por defecto
    // Más adelante esto vendrá del subdomain o localStorage
    return 'default';
  };

  const loadTenant = async (targetTenantId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const tenantDoc = await getDoc(doc(db, 'tenants', targetTenantId));
      
      if (!tenantDoc.exists()) {
        throw new Error(`Tenant ${targetTenantId} not found`);
      }

      const rawData = tenantDoc.data();
      const tenantData: Tenant = { 
        id: tenantDoc.id, 
        ...rawData,
        // Convertir Timestamp a Date
        createdAt: rawData?.createdAt?.toDate ? rawData.createdAt.toDate() : new Date(),
      } as Tenant;
      
      setTenant(tenantData);

      // Cargar información del usuario en este tenant
      if (user) {
        const userDoc = await getDoc(
          doc(db, 'tenants', targetTenantId, 'users', user.uid)
        );
        
        if (userDoc.exists()) {
          setTenantUser({ 
            id: userDoc.id, 
            ...userDoc.data() 
          } as TenantUser);
        } else {
          setTenantUser(null);
        }
      }

    } catch (err) {
      console.error('Error loading tenant:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const switchTenant = async (newTenantId: string) => {
    await loadTenant(newTenantId);
  };

  const createTenant = async (tenantData: Partial<Tenant>): Promise<string> => {
    // Implementar creación de tenant
    // Por ahora, retornar un placeholder
    throw new Error('createTenant not implemented yet');
  };

  // Cargar tenant inicial
  useEffect(() => {
    const currentTenantId = getCurrentTenantId();
    loadTenant(currentTenantId);
  }, [user, tenantId]);

  const value: TenantContextType = {
    tenant,
    tenantUser,
    isLoading,
    error,
    switchTenant,
    createTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export { TenantContext };