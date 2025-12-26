import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HybridCMSService } from '@/lib/cms';
import { Calendar, User, ArrowLeft, Sparkles, Database } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import OptimizedImage from '@/components/OptimizedImage';
import Breadcrumbs from '@/components/Breadcrumbs';
import VideoTestimonial from '@/components/VideoTestimonial';
import { getArticleSchema, getBreadcrumbSchema, type SupportedLocale } from '@/lib/schema';
import BlogClientWrapper, { ShareButton } from './BlogClientWrapper';

interface BlogPostPageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

// Helper para traducciones mínimas en el servidor
const getT = (lang: string) => {
  const translations: any = {
    es: { back: 'Volver a la Academia', ai: 'GENERADO CON IA', related: 'Artículos Relacionados', cta_title: '¿Listo para dejar de depender de agencias?', cta_desc: 'Únete a nuestro programa de 3 meses y aprende a gestionar tu propia presencia digital.', cta_btn: 'Solicitar Entrevista Gratuita' },
    en: { back: 'Back to Academy', ai: 'GENERATED WITH AI', related: 'Related Articles', cta_title: 'Ready to stop depending on agencies?', cta_desc: 'Join our 3-month program and learn to manage your own digital presence.', cta_btn: 'Request Free Interview' },
    pt: { back: 'Voltar para a Academia', ai: 'GERADO COM IA', related: 'Artigos Relacionados', cta_title: 'Pronto para parar de depender de agências?', cta_desc: 'Junte-se ao nosso programa de 3 meses e aprenda a gerir a sua própria presença digital.', cta_btn: 'Solicitar Entrevista Gratuita' }
  };
  return translations[lang] || translations.es;
};

export async function generateStaticParams() {
  try {
    const { posts } = await HybridCMSService.getAllPosts();
    const locales = ['es', 'en', 'pt'];

    return posts.flatMap((post) =>
      locales.map((lang) => ({
        lang,
        slug: post.slug,
      }))
    );
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await HybridCMSService.getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Artículo no encontrado | PukaDigital',
      description: 'El artículo que buscas no está disponible.'
    };
  }

  return {
    title: `${post.title} | PukaDigital Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'PukaDigital'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, lang } = await params;
  const post = await HybridCMSService.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { posts: allPosts } = await HybridCMSService.getAllPosts();
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  const t = getT(lang);
  const supportedLang = lang as SupportedLocale;

  // Breadcrumbs data
  const breadcrumbItems = [
    { name: lang === 'es' ? 'Inicio' : lang === 'en' ? 'Home' : 'Início', url: `https://pukadigital.com/${lang}` },
    { name: 'Blog', url: `https://pukadigital.com/${lang}/blog` },
    { name: post.title, url: `https://pukadigital.com/${lang}/blog/${post.slug}` }
  ];

  // Article schema
  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    datePublished: post.date,
    author: post.author || 'Equipo PukaDigital',
    image: post.coverImage,
    lang: supportedLang
  });

  // Breadcrumb schema
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  return (
    <BlogClientWrapper post={post}>
      <div className="bg-gray-50 dark:bg-black min-h-screen transition-colors">
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        {/* HERO IMAGE */}
        <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
          <OptimizedImage
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Back Button & Breadcrumbs */}
          <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
            <Breadcrumbs
              items={breadcrumbItems}
              className="text-white/80 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white"
            />
            <Link
              href={`/${lang}/blog`}
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur text-puka-black dark:text-white px-4 py-2 rounded-sm shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all flex items-center gap-2 font-medium"
            >
              <ArrowLeft size={18} /> {t.back}
            </Link>
          </div>

          {/* Source Badge */}
          <div className="absolute top-6 right-6 z-20 flex gap-2">
            {post.source === 'ai' && (
              <span className="bg-purple-600 text-white text-xs font-bold px-3 py-2 rounded-sm shadow-lg flex items-center gap-1">
                <Sparkles size={14} /> {t.ai}
              </span>
            )}
            {post.source === 'cms' && (
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-sm shadow-lg flex items-center gap-1">
                <Database size={14} /> CMS
              </span>
            )}
            {post.source === 'local' && (
              <span className="bg-gray-800 text-white text-xs font-bold px-3 py-2 rounded-sm shadow-lg">
                LOCAL
              </span>
            )}
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto max-w-4xl">
              <span className="inline-block bg-puka-red text-white text-xs font-bold px-3 py-1 rounded-sm mb-4 uppercase tracking-wide">
                {post.category}
              </span>
              <h1 className="font-display font-bold text-3xl md:text-5xl text-white mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(post.date).toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                {post.author && (
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    {post.author}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <article className="container mx-auto max-w-4xl px-6 py-12">
          {/* Excerpt */}
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 font-medium border-l-4 border-puka-red pl-6 bg-gray-100 dark:bg-gray-900 p-6 rounded-sm">
            {post.excerpt}
          </p>

          {/* Share Button (Client side) */}
          <div className="flex justify-end mb-8">
            <ShareButton post={post} />
          </div>

          {/* Markdown Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-display prose-headings:font-bold prose-headings:text-puka-black dark:prose-headings:text-white
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
            prose-strong:text-puka-black dark:prose-strong:text-white prose-strong:font-bold
            prose-a:text-puka-red prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-puka-red prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-900 
            prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic
            prose-ul:list-disc prose-ul:pl-6
            prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-gray-700 dark:prose-li:text-gray-300
            prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
            ">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, href, children, ...props }) => {
                  if (href && (href.includes('youtube.com/watch?v=bSge9e1Se4w') || href.includes('youtu.be/bSge9e1Se4w'))) {
                    return (
                      <div className="my-8">
                        <VideoTestimonial
                          videoId="bSge9e1Se4w"
                          title="Testimonio Yadira Cristina Muñoz - PodoclinicEC"
                        />
                      </div>
                    );
                  }
                  return (
                    <a href={href} {...props} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  );
                },
                //@ts-ignore
                p: ({ node, children, ...props }) => {
                  return <div className="mb-6" {...props}>{children}</div>;
                }
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* CTA */}
          <div className="mt-16 bg-puka-black dark:bg-gray-900 text-white p-8 md:p-12 rounded-sm text-center">
            <h3 className="font-display font-bold text-2xl md:text-3xl mb-4">
              {t.cta_title}
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {t.cta_desc}
            </p>
            <Link
              href={`/${lang}/contacto`}
              className="inline-block bg-puka-red text-white px-8 py-4 rounded-sm font-bold hover:bg-red-700 transition-colors shadow-lg"
            >
              {t.cta_btn}
            </Link>
          </div>
        </article>

        {/* RELATED POSTS */}
        {relatedPosts.length > 0 && (
          <section className="container mx-auto max-w-6xl px-6 py-16 border-t border-gray-200 dark:border-gray-800">
            <h2 className="font-display font-bold text-3xl mb-8 text-puka-black dark:text-white">
              {t.related}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/${lang}/blog/${related.slug}`}
                  className="group"
                >
                  <div className="relative h-48 rounded-sm overflow-hidden mb-4">
                    <OptimizedImage
                      src={related.coverImage}
                      alt={related.title}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-puka-black text-xs font-bold px-2 py-1 rounded-sm uppercase">
                      {related.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-puka-black dark:text-white group-hover:text-puka-red transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {related.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </BlogClientWrapper>
  );
}
