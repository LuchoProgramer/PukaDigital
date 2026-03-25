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
  ];

  // Páginas de productos específicos (Landing Pages)
  const productPages = [
    { path: '/agentes-ia', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/salud', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/desarrollo-web-pymes', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/ledgerxpertz', priority: 0.9, changeFreq: 'weekly' as const },
  ];

  // Casos de estudio
  const caseStudyPages = [
    { path: '/casos/podoclinicec-cristina-munoz', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/casos/healppypets-carla-tutistar', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/casos/hotel-eudiq-cafeteria-viviantes', priority: 0.8, changeFreq: 'monthly' as const },
  ];

  // Páginas Legales
  const legalPages = [
    { path: '/legal/terminos', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/legal/politica-de-privacidad', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/legal/cookies', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/legal/garantia', priority: 0.5, changeFreq: 'monthly' as const },
  ];

  const allStaticRoutes = [...staticPages, ...productPages, ...caseStudyPages, ...legalPages];

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
