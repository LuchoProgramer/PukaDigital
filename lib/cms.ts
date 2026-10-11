import { BlogPost, CMSStatus } from '@/types';
import { LOCAL_POSTS } from '../data/localPosts';
import { estaPublicado } from './cmsPublicado';

export interface BloqueCMS {
  type?: string;
  style?: string;
  content?: string;
  url?: string;
  src?: string;
  alt?: string;
  caption?: string;
}

export function bloqueAMarkdown(block: BloqueCMS): string {
  if (block.type === 'image') {
    const imgSrc = block.url || block.src || '';
    if (!imgSrc) return '';
    const caption = block.caption
      ? `<figcaption class="text-center text-sm text-gray-500 mt-2 italic">${block.caption}</figcaption>`
      : '';
    return `\n<figure class="my-8">\n<img src="${imgSrc}" alt="${block.alt || 'Imagen'}" class="max-w-full h-auto rounded-lg mx-auto shadow-sm" />\n${caption}\n</figure>\n`;
  }

  if (block.type === 'video') {
    const videoSrc = block.url || block.src || '';
    return videoSrc ? `\n${videoSrc}\n` : '';
  }

  const content = block.content || '';

  switch (block.style) {
    case 'heading': {
      const texto = content.replace(/[\r\n]+/g, ' ').trim();
      if (!texto) return '';
      if (texto.startsWith('#')) return texto;
      return `## ${texto}`;
    }
    case 'subheading': {
      const texto = content.replace(/[\r\n]+/g, ' ').trim();
      if (!texto) return '';
      if (texto.startsWith('#')) return texto;
      return `### ${texto}`;
    }
    case 'list-bullet': {
      const lineas = content
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 0);
      return lineas.map(l => `- ${l}`).join('\n');
    }
    case 'list-number': {
      const lineas = content
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 0);
      return lineas.map(l => `1. ${l}`).join('\n');
    }
    case 'quote': {
      return `<blockquote>${content}</blockquote>`;
    }
    case 'callout': {
      return `<aside class="callout">${content}</aside>`;
    }
    case 'paragraph':
    case 'code':
    default: {
      return content;
    }
  }
}

export interface FaqBlog {
  pregunta: string;
  respuesta: string;
}

function limpiarTextoPlano(texto: string): string {
  return texto
    .replace(/<\/(?:p|div|li|h[1-6]|tr|blockquote|aside)>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`#]/g, '')
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extraerFaqs(blocks: BloqueCMS[]): FaqBlog[] {
  let enSeccionFaq = false;
  let preguntaActual: string | null = null;
  let partesRespuesta: string[] = [];
  const pares: FaqBlog[] = [];

  function guardarPreguntaActual() {
    if (preguntaActual) {
      const respuesta = partesRespuesta.filter(Boolean).join(' ').trim();
      if (respuesta.length > 0) {
        pares.push({ pregunta: preguntaActual, respuesta });
      }
    }
    preguntaActual = null;
    partesRespuesta = [];
  }

  for (const block of blocks) {
    const esEncabezado = block.style === 'heading' || block.style === 'subheading';

    if (!enSeccionFaq) {
      if (esEncabezado) {
        const cleanText = (block.content || '').replace(/^#+\s*/, '').trim();
        const norm = cleanText.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        if (norm.includes('preguntas frecuentes') || norm === 'faq' || norm === 'faqs') {
          enSeccionFaq = true;
        }
      }
    } else {
      if (esEncabezado) {
        const cleanText = (block.content || '')
          .replace(/^#+\s*/, '')
          .replace(/[\r\n]+/g, ' ')
          .trim();

        if (cleanText.endsWith('?')) {
          guardarPreguntaActual();
          preguntaActual = cleanText;
        } else {
          guardarPreguntaActual();
          enSeccionFaq = false;
        }
      } else {
        if (preguntaActual && block.type !== 'image' && block.type !== 'video') {
          const plano = limpiarTextoPlano(block.content || '');
          if (plano) {
            partesRespuesta.push(plano);
          }
        }
      }
    }
  }

  guardarPreguntaActual();

  return pares.length >= 2 ? pares : [];
}

/**
 * Mapea un post del CMS al formato BlogPost de PukaDigital
 */
export function mapearPostCMS(cmsPost: any): BlogPost {
  // Convertir bloques a Markdown para que sea compatible con el renderizador de PukaDigital
  const content = cmsPost.blocks?.map((block: BloqueCMS) => bloqueAMarkdown(block)).join('\n\n') || '';

  // Extraer excerpt del primer bloque de texto si no tiene
  const firstTextBlock = cmsPost.blocks?.find((b: any) => b.type === 'text');
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').replace(/[#*`]/g, '').trim();
  const rawExcerpt = cmsPost.excerpt || (firstTextBlock?.content?.substring(0, 300) + '...') || '';
  const excerpt = stripHtml(rawExcerpt);
  const faqs = extraerFaqs(cmsPost.blocks || []);

  return {
    id: `cms-${cmsPost.id}`,
    title: cmsPost.title,
    excerpt: excerpt,
    content: content,
    coverImage: cmsPost.image || cmsPost.blocks?.find((b: any) => b.type === 'image')?.url || cmsPost.blocks?.find((b: any) => b.type === 'image')?.src || 'https://pukadigital.com/og-image.jpg',
    coverImageAlt: cmsPost.alt || cmsPost.title,
    date: cmsPost.createdAt || new Date().toISOString(),
    dateModified: cmsPost.updatedAt || undefined,
    category: cmsPost.category || 'General',
    slug: cmsPost.slug || cmsPost.id,
    source: 'cms' as const,
    author: cmsPost.author?.name || 'Equipo PukaDigital',
    metaTitle: cmsPost.metaTitle || undefined,
    metaDescription: cmsPost.metaDescription || undefined,
    tags: Array.isArray(cmsPost.tags) && cmsPost.tags.length > 0 ? cmsPost.tags : undefined,
    faqs: faqs.length > 0 ? faqs : undefined,
  };
}

export class HybridCMSService {


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
      const formattedCmsPosts = blogsRaw.filter(estaPublicado).map(p => this.mapCMSToBlogPost(p));
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
          // Si la API devuelve un objeto directo (por id), usarlo; si devuelve array, buscar por slug exacto
          if (data.id) {
            blogRaw = data;
          } else if (Array.isArray(data.blogs)) {
            blogRaw = isByCmsId
              ? data.blogs[0] || null
              : data.blogs.find((b: any) => b.slug === slug) || data.blogs[0] || null;
          }
        }
      }
      // Cliente: Proxy
      else {
        const response = await fetch(`/api/cms-proxy?${param}`);
        if (response.ok) {
          const data = await response.json();
          if (data.id) {
            blogRaw = data;
          } else if (Array.isArray(data.blogs)) {
            blogRaw = isByCmsId
              ? data.blogs[0] || null
              : data.blogs.find((b: any) => b.slug === slug) || null;
          }
        }
      }

      if (blogRaw && estaPublicado(blogRaw)) {
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
    return mapearPostCMS(cmsPost);
  }
}