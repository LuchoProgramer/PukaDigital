import { MetadataRoute } from 'next'
import { HybridCMSService } from '@/lib/cms'
import { i18n } from '@/i18n.config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pukadigital.com'

  // Get all blog posts dynamically
  const { posts } = await HybridCMSService.getAllPosts();

  // Páginas estáticas principales para cada idioma
  const staticPages = [
    { path: '', priority: 1.0, changeFreq: 'weekly' as const },
    { path: '/productos', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/demos', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/blog', priority: 0.8, changeFreq: 'daily' as const },
    { path: '/contacto', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/nosotros', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/casos', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/preguntas-frecuentes', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/cuanto-cuesta-publicidad-google-ecuador', priority: 0.9, changeFreq: 'weekly' as const },
  ];

  // Páginas de productos específicos
  const productPages = [
    { path: '/chatbot-ia-whatsapp', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/desarrollo-web-pymes', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/sistema-erp-cloud', priority: 0.9, changeFreq: 'weekly' as const },
  ];

  // Casos de estudio (actualizados frecuentemente mientras están en progreso)
  const caseStudyPages = [
    { path: '/casos/podoclinicec-cristina-munoz', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/casos/healppypets-carla-tutistar', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/casos/hotel-eudiq-cafeteria-viviantes', priority: 0.8, changeFreq: 'weekly' as const },
  ];

  // Generar URLs para páginas estáticas en cada idioma
  const staticUrls: MetadataRoute.Sitemap = [];

  for (const locale of i18n.locales) {
    // Páginas principales
    for (const page of staticPages) {
      staticUrls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      });
    }

    // Páginas de productos
    for (const page of productPages) {
      staticUrls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      });
    }

    // Casos de estudio
    for (const page of caseStudyPages) {
      staticUrls.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      });
    }
  }

  // URLs de posts del blog para cada idioma
  const blogPostUrls: MetadataRoute.Sitemap = posts.flatMap(post =>
    i18n.locales.map(locale => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...staticUrls, ...blogPostUrls]
}
