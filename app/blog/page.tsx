import React from 'react';
import { HybridCMSService } from '@/lib/cms';
import BlogListClient from './BlogListClient';
import { Metadata } from 'next';

interface BlogPageProps {}

export const metadata: Metadata = {
  title: "Blog & Academia | Educación para la Libertad Digital",
  description: "Recursos gratuitos, guías y estrategias para dueños de negocios que quieren independencia digital. Marketing, Tecnología y Gestión Real.",
  openGraph: {
    title: "Blog & Academia | Educación para la Libertad Digital",
    description: "Recursos gratuitos, guías y estrategias para dueños de negocios que quieren independencia digital.",
    url: `https://pukadigital.com/blog`,
    siteName: 'PukaDigital',
    type: 'website'
  }
};

export default async function BlogPage() {
  // Fetch data on the server
  const { posts, status } = await HybridCMSService.getAllPosts();

  // JSON-LD Structured Data for Blog List
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "PukaDigital Blog - Academia Digital",
    "description": "Recursos gratuitos, guías y estrategias para dueños de negocios que quieren independencia digital.",
    "url": `https://pukadigital.com/blog`,
    "publisher": {
      "@type": "Organization",
      "name": "PukaDigital",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pukadigital.com/logo-Puka.svg"
      }
    },
    "inLanguage": "es-EC"
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
      />
    </>
  );
}