// lib/cms-api.ts - Cliente para consumir tu CMS desde otros sitios

interface CMSConfig {
  tenantId: string;
  apiUrl?: string; // URL de tu CMS (opcional si usas Firebase directamente)
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  alt?: string;
  slug: string;
  author: {
    name: string;
  };
  createdAt: Date;
  blocks: Array<{
    type: 'text' | 'image' | 'video';
    content?: string;
    src?: string;
    alt?: string;
  }>;
}

class CMSClient {
  private tenantId: string;
  private apiUrl: string;

  constructor(config: CMSConfig) {
    this.tenantId = config.tenantId;
    this.apiUrl = config.apiUrl || 'https://tu-cms-domain.com/api';
  }

  // Método 1: Si usas Firebase directamente (mismo proyecto)
  async getBlogsDirect(limit = 10): Promise<BlogPost[]> {
    try {
      // Importar Firebase solo en el cliente
      const { initializeApp } = await import('firebase/app');
      const { getFirestore, collection, getDocs, query, orderBy, limit: limitQuery } = await import('firebase/firestore');
      
      const app = initializeApp({
        // Tu configuración de Firebase
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
      
      const db = getFirestore(app);
      
      const blogsQuery = query(
        collection(db, 'tenants', this.tenantId, 'blogs'),
        orderBy('createdAt', 'desc'),
        limitQuery(limit)
      );
      
      const snapshot = await getDocs(blogsQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as BlogPost[];
      
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  }

  // Método 2: A través de API REST
  async getBlogs(limit = 10): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${this.apiUrl}/tenants/${this.tenantId}/blogs?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.blogs || [];
      
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  }

  // Obtener blog por slug
  async getBlogBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await fetch(`${this.apiUrl}/tenants/${this.tenantId}/blogs/slug/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.blog || null;
      
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  }

  // Buscar blogs
  async searchBlogs(searchTerm: string): Promise<BlogPost[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}/tenants/${this.tenantId}/blogs/search?q=${encodeURIComponent(searchTerm)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.blogs || [];
      
    } catch (error) {
      console.error('Error searching blogs:', error);
      return [];
    }
  }

  // Obtener configuración del tenant
  async getTenantSettings() {
    try {
      const response = await fetch(`${this.apiUrl}/tenants/${this.tenantId}/settings`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('Error fetching tenant settings:', error);
      return null;
    }
  }
}

export { CMSClient, type BlogPost, type CMSConfig };