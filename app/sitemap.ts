import { MetadataRoute } from 'next'
import { HybridCMSService } from '@/lib/cms'
import { i18n } from '@/i18n.config'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pukadigital.com'
  
  // Get all blog posts dynamically
  const { posts } = await HybridCMSService.getAllPosts();
  
  // Páginas estáticas para cada idioma
  const staticPages = ['', '/productos', '/demos', '/blog', '/contacto'];
  
  // Generar URLs para cada idioma
  const staticUrls: MetadataRoute.Sitemap = [];
  
  for (const locale of i18n.locales) {
    for (const page of staticPages) {
      staticUrls.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: page === '' ? 1.0 : 0.8,
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
