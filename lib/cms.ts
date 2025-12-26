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
   * Optimizado para Server Components: Consulta directa en servidor, Proxy en cliente.
   */
  static async getAllPosts(): Promise<{ posts: BlogPost[], status: CMSStatus }> {
    const startTime = performance.now();

    // Configuración
    const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://pukapresscms.vercel.app';
    const TENANT_ID = process.env.NEXT_PUBLIC_CMS_TENANT_ID || 'pukadigital';

    try {
      let blogsRaw: any[] = [];

      // 1. Si estamos en el servidor, consultamos directo al CMS para evitar líos de URL/CORS
      if (typeof window === 'undefined') {
        const url = `${CMS_URL}/api/blogs?tenant=${TENANT_ID}&limit=50`;
        const response = await fetch(url, {
          next: { revalidate: 300 }
        });

        if (response.ok) {
          const data = await response.json();
          blogsRaw = data.blogs || [];
        } else {
          throw new Error(`Direct CMS Error: ${response.status}`);
        }
      }
      // 2. Si estamos en el cliente, usamos el proxy
      else {
        const PROXY_URL = '/api/cms-proxy';
        const response = await fetch(PROXY_URL);
        if (response.ok) {
          const data = await response.json();
          blogsRaw = data.blogs || [];
        }
      }

      // Mapear al formato de PukaDigital
      const formattedCmsPosts = blogsRaw.map(p => this.mapCMSToBlogPost(p));
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
      console.warn('⚠️ CMS Fallback Activo:', error);
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

    // 2. Buscar en CMS
    try {
      const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://pukapresscms.vercel.app';
      const TENANT_ID = process.env.NEXT_PUBLIC_CMS_TENANT_ID || 'pukadigital';
      const isByCmsId = slug.startsWith('cms-');
      const param = isByCmsId ? `id=${slug.replace('cms-', '')}` : `slug=${slug}`;

      let blogRaw: any = null;

      // Servidor: Directo
      if (typeof window === 'undefined') {
        const url = `${CMS_URL}/api/blogs?tenant=${TENANT_ID}&${param}`;
        const response = await fetch(url, { next: { revalidate: 300 } });
        if (response.ok) {
          const data = await response.json();
          blogRaw = data.blogs?.[0] || (data.id ? data : null);
        }
      }
      // Cliente: Proxy
      else {
        const response = await fetch(`/api/cms-proxy?${param}`);
        if (response.ok) {
          const data = await response.json();
          blogRaw = data.blogs?.[0] || (data.id ? data : null);
        }
      }

      if (blogRaw) {
        return this.mapCMSToBlogPost(blogRaw);
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