import React from 'react';
import { HybridCMSService } from '@/lib/cms';
import BlogListClient from './BlogListClient';
import { Metadata } from 'next';

interface BlogPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;

  const titles: any = {
    es: "Blog & Academia | Educación para la Libertad Digital",
    en: "Blog & Academy | Education for Digital Freedom",
    pt: "Blog & Academia | Educação para a Liberdade Digital"
  };

  const descriptions: any = {
    es: "Recursos gratuitos, guías y estrategias para dueños de negocios que quieren independencia digital. Marketing, Tecnología y Gestión Real.",
    en: "Free resources, guides and strategies for business owners who want digital independence. Marketing, Technology and Real Management.",
    pt: "Recursos gratuitos, guias e estratégias para proprietários de negócios que desejam independência digital. Marketing, Tecnologia e Gestão Real."
  };

  return {
    title: titles[lang] || titles.es,
    description: descriptions[lang] || descriptions.es,
    openGraph: {
      title: titles[lang] || titles.es,
      description: descriptions[lang] || descriptions.es,
      url: `https://pukadigital.com/${lang}/blog`,
      siteName: 'PukaDigital',
      type: 'website'
    }
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  // Fetch data on the server
  const { posts, status } = await HybridCMSService.getAllPosts();

  // JSON-LD Structured Data for Blog List
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "PukaDigital Blog - Academia Digital",
    "description": "Recursos gratuitos, guías y estrategias para dueños de negocios que quieren independencia digital.",
    "url": `https://pukadigital.com/${lang}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": "PukaDigital",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pukadigital.com/logo-Puka.svg"
      }
    },
    "inLanguage": lang === 'es' ? 'es-ES' : lang === 'en' ? 'en-US' : 'pt-BR'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogListClient
        initialPosts={posts}
        initialStatus={status}
        lang={lang}
      />
    </>
  );
}