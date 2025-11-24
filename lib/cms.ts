import { BlogPost, CMSStatus } from '../types';
import { LOCAL_POSTS } from '../data/localPosts';

// Configuración (Idealmente vendría de process.env)
const CMS_CONFIG = {
  baseUrl: 'http://localhost:3000/api/public/pukadigital/posts', // Tu URL de CMS
  timeout: 3000, // 3 segundos máximo de espera antes de usar fallback
};

export class HybridCMSService {
  
  /**
   * Obtiene todos los posts combinando CMS y Local
   */
  static async getAllPosts(): Promise<{ posts: BlogPost[], status: CMSStatus }> {
    const startTime = performance.now();
    
    try {
      // 1. Intentar conectar con el CMS
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CMS_CONFIG.timeout);

      const response = await fetch(CMS_CONFIG.baseUrl, {
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`CMS Error: ${response.status}`);
      }

      const cmsPosts: BlogPost[] = await response.json();
      
      // Marcar origen
      const taggedCmsPosts = cmsPosts.map(p => ({ ...p, source: 'cms' as const }));

      const endTime = performance.now();

      return {
        posts: [...taggedCmsPosts, ...LOCAL_POSTS], // Estrategia: Mostrar ambos o priorizar CMS
        status: {
          isConnected: true,
          source: 'hybrid',
          latency: Math.round(endTime - startTime)
        }
      };

    } catch (error) {
      console.warn('⚠️ CMS no disponible o timeout. Activando Fallback Local.', error);
      
      return {
        posts: LOCAL_POSTS,
        status: {
          isConnected: false,
          source: 'local-fallback',
          latency: 0
        }
      };
    }
  }

  /**
   * Obtiene un post específico por slug
   */
  static async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    // Primero buscar en local para velocidad instantánea
    const localPost = LOCAL_POSTS.find(p => p.slug === slug);
    if (localPost) return localPost;

    // Si no está en local, intentar buscar en CMS
    try {
      const response = await fetch(`${CMS_CONFIG.baseUrl}?slug=${slug}`);
      if (response.ok) {
        const posts = await response.json();
        if (posts.length > 0) return { ...posts[0], source: 'cms' };
      }
    } catch (e) {
      return undefined;
    }
  }
}