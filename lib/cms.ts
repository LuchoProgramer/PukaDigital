import { BlogPost, CMSStatus } from '@/types';
import { LOCAL_POSTS } from '../data/localPosts';

export class HybridCMSService {

  /**
   * Obtiene la URL base interna para peticiones del servidor o relativa para el cliente
   */
  private static getBaseUrl(): string {
    if (typeof window !== 'undefined') {
      return ''; // Relativa en el cliente: /api/cms-proxy
    }

    // En el servidor
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }

    return 'http://localhost:3000';
  }

  /**
   * Obtiene todos los posts combinando CMS y Local
   * Optimizado para Server Components
   */
  static async getAllPosts(): Promise<{ posts: BlogPost[], status: CMSStatus }> {
    const startTime = performance.now();
    const PROXY_URL = `${this.getBaseUrl()}/api/cms-proxy`;

    try {
      // 1. Intentar conectar con el CMS vía Proxy
      const response = await fetch(PROXY_URL, {
        next: { revalidate: 300 } // Revalidar cada 5 minutos
      });

      if (!response.ok) {
        throw new Error(`CMS Proxy Error: ${response.status}`);
      }

      const data = await response.json();
      const cmsPosts: any[] = data.blogs || [];

      // Mapear al formato de PukaDigital
      const formattedCmsPosts = cmsPosts.map(p => this.mapCMSToBlogPost(p));

      const endTime = performance.now();

      return {
        posts: [...formattedCmsPosts, ...LOCAL_POSTS],
        status: {
          isConnected: true,
          source: 'hybrid',
          latency: Math.round(endTime - startTime)
        }
      };

    } catch (error) {
      console.warn('⚠️ CMS no disponible. Usando Fallback Local.', error);

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
   * Obtiene un post específico por slug (o id si empieza por cms-)
   */
  static async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    // 1. Buscar en local primero
    const localPost = LOCAL_POSTS.find(p => p.slug === slug);
    if (localPost) return { ...localPost, source: 'local' };

    // 2. Buscar en CMS vía Proxy
    try {
      const PROXY_URL = `${this.getBaseUrl()}/api/cms-proxy`;

      // Si el slug contiene el ID (ej: cms-123), buscamos por ID
      const queryParam = slug.startsWith('cms-')
        ? `id=${slug.replace('cms-', '')}`
        : `slug=${slug}`;

      const response = await fetch(`${PROXY_URL}?${queryParam}`, {
        next: { revalidate: 300 }
      });

      if (response.ok) {
        const data = await response.json();
        const blogs = data.blogs || [];
        if (blogs.length > 0) {
          return this.mapCMSToBlogPost(blogs[0]);
        }
        // Si no es un array pero es un objeto (busqueda directa por ID)
        if (data && !data.blogs && data.id) {
          return this.mapCMSToBlogPost(data);
        }
      }
    } catch (e) {
      console.error("Error fetching post from CMS:", e);
    }

    return undefined;
  }

  /**
   * Mapea un post del CMS al formato BlogPost de PukaDigital
   */
  private static mapCMSToBlogPost(cmsPost: any): BlogPost {
    // Convertir bloques a Markdown para que sea compatible con el renderizador de PukaDigital
    const content = cmsPost.blocks?.map((block: any) => {
      if (block.type === 'text') {
        // Asegurarse de que el texto no rompa el markdown
        return block.content;
      }
      if (block.type === 'image') {
        return `\n![${block.alt || 'Imagen'}](${block.src})\n`;
      }
      if (block.type === 'video') {
        // El renderizador de PukaDigital detecta URLs de YouTube
        return `\n${block.src}\n`;
      }
      return '';
    }).join('\n\n') || '';

    // Extraer excerpt del primer bloque de texto si no tiene
    const firstTextBlock = cmsPost.blocks?.find((b: any) => b.type === 'text');
    const excerpt = cmsPost.excerpt || (firstTextBlock?.content?.substring(0, 160).replace(/[#*`]/g, '') + '...') || '';

    return {
      id: `cms-${cmsPost.id}`,
      title: cmsPost.title,
      excerpt: excerpt,
      content: content,
      coverImage: cmsPost.blocks?.find((b: any) => b.type === 'image')?.src || 'https://pukadigital.com/og-image.jpg', // Placeholder
      date: cmsPost.createdAt || new Date().toISOString(),
      category: cmsPost.category || 'General',
      slug: cmsPost.slug || cmsPost.id,
      source: 'cms',
      author: cmsPost.author?.name || 'Equipo PukaDigital'
    };
  }
}