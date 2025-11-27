'use client';

import React, { useEffect, useState, use, useRef } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogPost } from '@/types';
import { HybridCMSService } from '@/lib/cms';
import { Calendar, User, ArrowLeft, Share2, Sparkles, Database } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SEO from '@/components/SEO';
import OptimizedImage from '@/components/OptimizedImage';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useTranslation } from '@/lib/i18n';
import { getArticleSchema, getBreadcrumbSchema, type SupportedLocale } from '@/lib/schema';
import * as ga from '@/lib/analytics';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();
  
  // Scroll tracking refs
  const startTime = useRef<number>(Date.now());
  const scrollMilestones = useRef<Set<25 | 50 | 75 | 100>>(new Set());

  // Scroll tracking effect
  useEffect(() => {
    if (!post) return;
    
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (window.scrollY / scrollHeight) * 100;
      const timeOnPage = Math.round((Date.now() - startTime.current) / 1000);
      
      const milestones: (25 | 50 | 75 | 100)[] = [25, 50, 75, 100];
      for (const milestone of milestones) {
        if (scrollPercent >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone);
          
          // Determine article category
          const category = post.category?.toLowerCase().includes('precio') ? 'precios' 
            : post.category?.toLowerCase().includes('automat') ? 'automatizacion'
            : post.category?.toLowerCase().includes('caso') ? 'casos_exito'
            : 'general';
          
          ga.trackBlogArticleLectura(
            post.title,
            category as 'precios' | 'automatizacion' | 'casos_exito' | 'general',
            milestone,
            timeOnPage
          );
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  useEffect(() => {
    const fetchPost = async () => {
      const { posts } = await HybridCMSService.getAllPosts();
      const foundPost = posts.find(p => p.slug === resolvedParams.slug);
      
      if (!foundPost) {
        setLoading(false);
        return;
      }

      setPost(foundPost);

      // Get related posts from same category
      const related = posts
        .filter(p => p.id !== foundPost.id && p.category === foundPost.category)
        .slice(0, 3);
      setRelatedPosts(related);
      setLoading(false);
    };

    fetchPost();
  }, [resolvedParams.slug]);

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-puka-red border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  // Generate JSON-LD structured data for SEO
  const wordCount = post.content?.split(/\s+/).filter(Boolean).length || 0;
  const lang = (language || 'es') as SupportedLocale;
  
  // Breadcrumbs data
  const breadcrumbItems = [
    { name: lang === 'es' ? 'Inicio' : lang === 'en' ? 'Home' : 'Início', url: `https://pukadigital.com/${lang}` },
    { name: 'Blog', url: `https://pukadigital.com/${lang}/blog` },
    { name: post.title, url: `https://pukadigital.com/${lang}/blog/${post.slug}` }
  ];
  
  // Article schema from centralized lib
  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    datePublished: post.date,
    author: post.author || 'Equipo PukaDigital',
    image: post.coverImage,
    lang
  });

  // Breadcrumb schema
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://pukadigital.com/${lang}/blog/${post.slug}#blogposting`,
    "headline": post.title,
    "description": post.excerpt,
    "image": {
      "@type": "ImageObject",
      "url": post.coverImage,
      "width": 1200,
      "height": 630
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": post.source === 'ai' ? "Organization" : "Person",
      "name": post.author || "Equipo PukaDigital",
      "url": "https://pukadigital.com"
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://pukadigital.com/#organization",
      "name": "PukaDigital",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pukadigital.com/logo-Puka.svg",
        "width": 512,
        "height": 512
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://pukadigital.com/${lang}/blog/${post.slug}`
    },
    "articleSection": post.category,
    "keywords": `${post.category}, independencia digital, pymes ecuador, marketing digital, transformación digital, LATAM, democratización digital, chatbot ia, sistema erp`,
    "wordCount": wordCount,
    "inLanguage": lang === 'es' ? 'es-EC' : lang === 'en' ? 'en-US' : 'pt-BR',
    "isPartOf": {
      "@type": "Blog",
      "@id": `https://pukadigital.com/${lang}/blog#blog`,
      "name": "PukaDigital Blog",
      "description": "Recursos gratuitos sobre independencia digital para PYMEs"
    },
    "about": {
      "@type": "Thing",
      "name": "Independencia Digital",
      "description": "Educación tecnológica para PYMEs en Ecuador y Latinoamérica"
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen transition-colors">
      <SEO 
        title={`${post.title} | PukaDigital Blog`}
        description={post.excerpt}
      />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Breadcrumb Schema */}
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
            href="/blog"
            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur text-puka-black dark:text-white px-4 py-2 rounded-sm shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all flex items-center gap-2 font-medium"
          >
            <ArrowLeft size={18} /> {t('blog.back')}
          </Link>
        </div>

        {/* Source Badge */}
        <div className="absolute top-6 right-6 z-20 flex gap-2">
          {post.source === 'ai' && (
            <span className="bg-purple-600 text-white text-xs font-bold px-3 py-2 rounded-sm shadow-lg flex items-center gap-1">
              <Sparkles size={14} /> GENERADO CON IA
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
                {new Date(post.date).toLocaleDateString('es-ES', { 
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

        {/* Share Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-puka-red dark:hover:text-puka-red transition-colors text-sm font-medium"
          >
            <Share2 size={16} />
            Compartir artículo
          </button>
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
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-puka-black dark:bg-gray-900 text-white p-8 md:p-12 rounded-sm text-center">
          <h3 className="font-display font-bold text-2xl md:text-3xl mb-4">
            ¿Listo para dejar de depender de agencias?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Únete a nuestro programa de 3 meses y aprende a gestionar tu propia presencia digital.
          </p>
          <Link 
            href="/contacto"
            className="inline-block bg-puka-red text-white px-8 py-4 rounded-sm font-bold hover:bg-red-700 transition-colors shadow-lg"
          >
            Solicitar Entrevista Gratuita
          </Link>
        </div>
      </article>

      {/* RELATED POSTS */}
      {relatedPosts.length > 0 && (
        <section className="container mx-auto max-w-6xl px-6 py-16 border-t border-gray-200 dark:border-gray-800">
          <h2 className="font-display font-bold text-3xl mb-8 text-puka-black dark:text-white">
            Artículos Relacionados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((related) => (
              <Link 
                key={related.id} 
                href={`/blog/${related.slug}`}
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
  );
}
