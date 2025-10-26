import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getTenantUser } from "@/lib/tenantService";
import { TenantUser, UserRole } from "@/types";

interface UseAdminAuthProps {
  tenantId?: string;
}

export function useAdminAuth(props?: UseAdminAuthProps) {
  const [user, setUser] = useState<User | null>(null);
  const [tenantUser, setTenantUser] = useState<TenantUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        if (props?.tenantId) {
          try {
            const tenantUserData = await getTenantUser(props.tenantId, firebaseUser.uid);
            setTenantUser(tenantUserData);
            
            // Verificar si es admin del tenant
            const isUserAdmin = tenantUserData?.role === UserRole.ADMIN || 
                               tenantUserData?.role === UserRole.SUPER_ADMIN;
            setIsAdmin(isUserAdmin);
          } catch (error) {
            console.error('Error checking tenant user:', error);
            setTenantUser(null);
            setIsAdmin(false);
          }
        } else {
          // Si no hay tenantId específico, permitir acceso básico al usuario autenticado
          // Esto es útil para casos como el panel de administración general
          setTenantUser(null);
          setIsAdmin(true); // Permitir acceso básico a usuarios autenticados
        }
      } else {
        setTenantUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, [props?.tenantId]);

  return { user, tenantUser, isAdmin, loading };
}
