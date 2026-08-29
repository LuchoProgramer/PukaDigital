import { MetadataRoute } from 'next'
import { HybridCMSService } from '@/lib/cms'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pukadigital.com'

  // Get all blog posts dynamically
  const { posts } = await HybridCMSService.getAllPosts();

  // Páginas estáticas principales
  const staticPages = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/productos', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/demos', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/blog', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/contacto', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/nosotros', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/casos', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/preguntas-frecuentes', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/cuanto-cuesta-publicidad-google-ecuador', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/cuanto-cuesta-una-landing-page', priority: 0.9, changeFreq: 'weekly' as const },
  ];

  // Páginas de productos específicos (Landing Pages)
  const productPages = [
    { path: '/agencia', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/agentes-ia', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/salud', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/desarrollo-web-pymes', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/ledgerxpertz', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/pukahealth', priority: 0.9, changeFreq: 'weekly' as const },
  ];

  // Casos de estudio
  const caseStudyPages = [
    { path: '/casos/podoclinicec-cristina-munoz', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/casos/healppypets-carla-tutistar', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/casos/hotel-eudiq-cafeteria-viviantes', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/casos/la-huequita-quitena-yanett-sarango', priority: 0.8, changeFreq: 'monthly' as const },
  ];

  // Las páginas legales se excluyen del sitemap: llevan noindex desde app/legal/layout.tsx
  // (acumulaban 271 impresiones y 0 clics en posiciones 41+, GSC may–ago 2026).

  const allStaticRoutes = [...staticPages, ...productPages, ...caseStudyPages];

  const staticUrls: MetadataRoute.Sitemap = allStaticRoutes.map(page => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));

  // URLs de posts del blog
  const blogPostUrls: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...blogPostUrls]
}
