import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  addDoc,
  query,
  where,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tenant, TenantUser, SubscriptionPlan, UserRole } from '@/types';

// Crear un nuevo tenant
export const createTenant = async (
  adminUserId: string,
  tenantData: {
    name: string;
    domain: string;
    adminEmail: string;
    adminName: string;
  }
): Promise<string> => {
  try {
    // Verificar que el dominio no exista
    const existingTenant = await getTenantByDomain(tenantData.domain);
    if (existingTenant) {
      throw new Error('Domain already exists');
    }

    // Crear documento de tenant
    const tenantDoc = await addDoc(collection(db, 'tenants'), {
      name: tenantData.name,
      domain: tenantData.domain,
      branding: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        fontFamily: 'Inter',
      },
      settings: {
        siteName: tenantData.name,
        description: `Blog de ${tenantData.name}`,
        defaultAuthor: tenantData.adminName,
      },
      subscription: SubscriptionPlan.FREE,
      createdAt: Timestamp.fromDate(new Date()),
      adminUsers: [adminUserId],
    });

    // Crear usuario admin en el tenant
    await setDoc(
      doc(db, 'tenants', tenantDoc.id, 'users', adminUserId),
      {
        email: tenantData.adminEmail,
        name: tenantData.adminName,
        role: UserRole.ADMIN,
        tenantId: tenantDoc.id,
        createdAt: Timestamp.fromDate(new Date()),
      }
    );

    return tenantDoc.id;
  } catch (error) {
    console.error('Error creating tenant:', error);
    throw error;
  }
};

// Obtener tenant por ID
export const getTenantById = async (tenantId: string): Promise<Tenant | null> => {
  try {
    const tenantDoc = await getDoc(doc(db, 'tenants', tenantId));
    
    if (!tenantDoc.exists()) {
      return null;
    }

    return {
      id: tenantDoc.id,
      ...tenantDoc.data(),
      createdAt: tenantDoc.data().createdAt?.toDate(),
    } as Tenant;
  } catch (error) {
    console.error('Error getting tenant:', error);
    throw error;
  }
};

// Obtener tenant por dominio
export const getTenantByDomain = async (domain: string): Promise<Tenant | null> => {
  try {
    const q = query(
      collection(db, 'tenants'),
      where('domain', '==', domain)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const tenantDoc = querySnapshot.docs[0];
    return {
      id: tenantDoc.id,
      ...tenantDoc.data(),
      createdAt: tenantDoc.data().createdAt?.toDate(),
    } as Tenant;
  } catch (error) {
    console.error('Error getting tenant by domain:', error);
    throw error;
  }
};

// Actualizar tenant
export const updateTenant = async (
  tenantId: string, 
  updates: Partial<Tenant>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'tenants', tenantId), updates);
  } catch (error) {
    console.error('Error updating tenant:', error);
    throw error;
  }
};

// Agregar usuario a tenant
export const addUserToTenant = async (
  tenantId: string,
  userId: string,
  userData: {
    email: string;
    name: string;
    role: UserRole;
  }
): Promise<void> => {
  try {
    await setDoc(
      doc(db, 'tenants', tenantId, 'users', userId),
      {
        ...userData,
        tenantId,
        createdAt: Timestamp.fromDate(new Date()),
      }
    );
  } catch (error) {
    console.error('Error adding user to tenant:', error);
    throw error;
  }
};

// Obtener usuario de tenant
export const getTenantUser = async (
  tenantId: string, 
  userId: string
): Promise<TenantUser | null> => {
  try {
    const userDoc = await getDoc(
      doc(db, 'tenants', tenantId, 'users', userId)
    );
    
    if (!userDoc.exists()) {
      return null;
    }

    return {
      id: userDoc.id,
      ...userDoc.data(),
      createdAt: userDoc.data().createdAt?.toDate(),
      lastLoginAt: userDoc.data().lastLoginAt?.toDate(),
    } as TenantUser;
  } catch (error) {
    console.error('Error getting tenant user:', error);
    throw error;
  }
};

// Listar usuarios de tenant
export const getTenantUsers = async (tenantId: string): Promise<TenantUser[]> => {
  try {
    const usersSnapshot = await getDocs(
      collection(db, 'tenants', tenantId, 'users')
    );
    
    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastLoginAt: doc.data().lastLoginAt?.toDate(),
    })) as TenantUser[];
  } catch (error) {
    console.error('Error getting tenant users:', error);
    throw error;
  }
};

// Verificar si usuario es admin del tenant
export const isUserTenantAdmin = async (
  tenantId: string, 
  userId: string
): Promise<boolean> => {
  try {
    const tenantUser = await getTenantUser(tenantId, userId);
    return tenantUser?.role === UserRole.ADMIN || tenantUser?.role === UserRole.SUPER_ADMIN;
  } catch (error) {
    console.error('Error checking tenant admin:', error);
    return false;
  }
};

// Eliminar usuario de tenant
export const removeUserFromTenant = async (
  tenantId: string,
  userId: string
): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'tenants', tenantId, 'users', userId));
  } catch (error) {
    console.error('Error removing user from tenant:', error);
    throw error;
  }
};