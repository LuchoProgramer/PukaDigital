import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc,
  addDoc,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SubscriptionPlan, UserRole } from '@/types';

const DEFAULT_TENANT_ID = 'default';

/**
 * Script de migración para convertir datos existentes a estructura multitenant
 * EJECUTAR SOLO UNA VEZ Y CON PRECAUCIÓN
 */

export const migrationScript = {
  // Paso 1: Crear tenant por defecto
  async createDefaultTenant(): Promise<void> {
    console.log('🚀 Creando tenant por defecto...');
    
    try {
      // Verificar si ya existe
      const tenantDoc = await getDoc(doc(db, 'tenants', DEFAULT_TENANT_ID));
      
      if (tenantDoc.exists()) {
        console.log('✅ Tenant por defecto ya existe');
        return;
      }

      // Crear tenant por defecto
      await setDoc(doc(db, 'tenants', DEFAULT_TENANT_ID), {
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
        adminUsers: [], // Se agregará en el siguiente paso
      });

      console.log('✅ Tenant por defecto creado');
    } catch (error) {
      console.error('❌ Error creando tenant por defecto:', error);
      throw error;
    }
  },

  // Paso 2: Migrar usuarios existentes
  async migrateUsers(): Promise<void> {
    console.log('🚀 Migrando usuarios existentes...');
    
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      let migratedCount = 0;
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        
        // Crear usuario en el tenant por defecto
        await setDoc(
          doc(db, 'tenants', DEFAULT_TENANT_ID, 'users', userDoc.id),
          {
            email: userData.email || 'unknown@email.com',
            name: userData.name || 'Usuario',
            role: userData.role === 'admin' ? UserRole.ADMIN : UserRole.EDITOR,
            tenantId: DEFAULT_TENANT_ID,
            createdAt: userData.createdAt || Timestamp.fromDate(new Date()),
            lastLoginAt: userData.lastLoginAt || null,
          }
        );
        
        migratedCount++;
      }
      
      console.log(`✅ ${migratedCount} usuarios migrados`);
    } catch (error) {
      console.error('❌ Error migrando usuarios:', error);
      throw error;
    }
  },

  // Paso 3: Migrar blogs existentes
  async migrateBlogs(): Promise<void> {
    console.log('🚀 Migrando blogs existentes...');
    
    try {
      const blogsSnapshot = await getDocs(collection(db, 'blogs'));
      let migratedCount = 0;
      
      for (const blogDoc of blogsSnapshot.docs) {
        const blogData = blogDoc.data();
        
        // Crear blog en el tenant por defecto
        await setDoc(
          doc(db, 'tenants', DEFAULT_TENANT_ID, 'blogs', blogDoc.id),
          {
            ...blogData,
            tenantId: DEFAULT_TENANT_ID,
            // Asegurar que tenga los campos necesarios
            author: blogData.author || {
              name: blogData.authorName || 'Autor Desconocido',
            },
            createdAt: blogData.createdAt || Timestamp.fromDate(new Date()),
          }
        );
        
        migratedCount++;
      }
      
      console.log(`✅ ${migratedCount} blogs migrados`);
    } catch (error) {
      console.error('❌ Error migrando blogs:', error);
      throw error;
    }
  },

  // Paso 4: Ejecutar migración completa
  async runFullMigration(): Promise<void> {
    console.log('🎯 Iniciando migración completa...');
    
    try {
      await this.createDefaultTenant();
      await this.migrateUsers();
      await this.migrateBlogs();
      
      console.log('🎉 ¡Migración completada exitosamente!');
      console.log('📝 Próximos pasos:');
      console.log('   1. Verificar que los datos migrados sean correctos');
      console.log('   2. Actualizar los componentes para usar la nueva estructura');
      console.log('   3. Limpiar colecciones antiguas (OPCIONAL)');
      
    } catch (error) {
      console.error('💥 Error en la migración:', error);
      throw error;
    }
  },

  // Función de rollback (emergencia)
  async rollback(): Promise<void> {
    console.log('⚠️  ROLLBACK: Eliminando tenant por defecto...');
    
    try {
      // Eliminar blogs del tenant
      const blogsSnapshot = await getDocs(
        collection(db, 'tenants', DEFAULT_TENANT_ID, 'blogs')
      );
      
      for (const blogDoc of blogsSnapshot.docs) {
        await deleteDoc(blogDoc.ref);
      }
      
      // Eliminar usuarios del tenant
      const usersSnapshot = await getDocs(
        collection(db, 'tenants', DEFAULT_TENANT_ID, 'users')
      );
      
      for (const userDoc of usersSnapshot.docs) {
        await deleteDoc(userDoc.ref);
      }
      
      // Eliminar tenant
      await deleteDoc(doc(db, 'tenants', DEFAULT_TENANT_ID));
      
      console.log('✅ Rollback completado');
      
    } catch (error) {
      console.error('❌ Error en rollback:', error);
      throw error;
    }
  },
};

// Para usar en consola del navegador o en una página de admin
export default migrationScript;