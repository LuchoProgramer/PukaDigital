'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BlogPost, CMSStatus } from '@/types';
import { HybridCMSService } from '@/lib/cms';
import { Calendar, User, ArrowRight, Wifi, WifiOff, Database, Search, X, Sparkles, Bot, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '@/components/SEO';
import OptimizedImage from '@/components/OptimizedImage';
import { useTranslation } from '@/lib/i18n';

const POSTS_PER_PAGE = 6;

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [status, setStatus] = useState<CMSStatus>({ isConnected: false, source: 'local-fallback' });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // AI Generator State
  const [showGenerator, setShowGenerator] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchContent = async () => {
      const { posts, status } = await HybridCMSService.getAllPosts();
      setPosts(posts);
      setStatus(status);
      setLoading(false);
    };

    fetchContent();
  }, []);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleGeneratePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic }),
      });
      
      if (!response.ok) throw new Error('Failed to generate post');
      
      const generated = await response.json();
      
      const newPost: BlogPost = {
        id: `ai-${Date.now()}`,
        title: generated.title,
        excerpt: generated.excerpt,
        content: generated.content,
        // Using Pollinations.ai for dynamic image generation based on the prompt
        coverImage: `https://image.pollinations.ai/prompt/${encodeURIComponent(generated.imagePrompt)}?width=800&height=600&nologo=true`,
        date: new Date().toISOString(),
        category: generated.category,
        slug: generated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        source: 'ai',
        author: 'Puka AI'
      };

      setPosts(prev => [newPost, ...prev]);
      setShowGenerator(false);
      setAiTopic('');
      setSearchQuery(''); // Clear search to show the new post at top
      setCurrentPage(1); // Ensure we are on the first page
    } catch (error) {
      console.error("Error generating post:", error);
      alert("Hubo un error generando el contenido. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top of grid
    const gridElement = document.getElementById('blog-grid');
    if (gridElement) {
        gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter Logic
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // JSON-LD Structured Data for Blog List
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "PukaDigital Blog - Academia Digital",
    "description": "Recursos gratuitos, guías y estrategias para dueños de negocios que quieren independencia digital. Marketing, Tecnología y Gestión Real.",
    "url": "https://pukadigital.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "PukaDigital",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pukadigital.com/logo-Puka.svg"
      }
    },
    "inLanguage": "es-ES"
  };

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen transition-colors">
      <SEO 
        title="Blog & Academia | Educación para la Libertad Digital"
        description="Recursos gratuitos, guías y estrategias para dueños de negocios que quieren dejar de depender de terceros. Marketing, Tecnología y Gestión Real."
      />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* HEADER & STATUS */}
      <div className="bg-puka-black text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <span className="text-puka-red font-bold tracking-wider uppercase text-sm mb-2 block">{t('blog.badge')}</span>
              <h1 className="font-display font-bold text-4xl md:text-5xl">{t('blog.title')}</h1>
            </div>
            
            {/* HYBRID STATUS BANNER */}
            <div className={`px-4 py-2 rounded-sm border flex items-center gap-3 text-xs font-mono backdrop-blur-sm ${
              status.isConnected 
                ? 'bg-green-900/30 border-green-500/50 text-green-100' 
                : 'bg-yellow-900/30 border-yellow-500/50 text-yellow-100'
            }`}>
              {status.isConnected ? <Wifi size={14} className="animate-pulse" /> : <WifiOff size={14} />}
              <div>
                <span className="block font-bold">SISTEMA HÍBRIDO: {status.isConnected ? t('blog.status_online') : t('blog.status_fallback')}</span>
                <span className="opacity-70">
                  {t('blog.status_source')}: {status.source.toUpperCase()} {status.latency ? `(${status.latency}ms)` : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR & AI TOOL SECTION */}
      <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          
          {/* Search Input */}
          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-sm shadow-lg flex items-center gap-4 border border-gray-100 dark:border-gray-700 transition-colors">
            <Search className="text-gray-400" size={24} />
            <input 
              type="text"
              placeholder={t('blog.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-lg text-puka-black dark:text-white placeholder-gray-400 bg-transparent"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* AI Toggle Button */}
          <button 
            onClick={() => setShowGenerator(!showGenerator)}
            className={`px-6 py-4 rounded-sm shadow-lg font-bold flex items-center gap-2 transition-all ${
              showGenerator 
                ? 'bg-puka-black text-white ring-2 ring-puka-red' 
                : 'bg-white dark:bg-gray-800 text-puka-red hover:bg-red-50 dark:hover:bg-gray-700'
            }`}
          >
            <Sparkles size={20} className={isGenerating ? "animate-spin" : ""} />
            <span className="whitespace-nowrap">{t('blog.create_ai')}</span>
          </button>
        </div>

        {/* AI Generator Panel */}
        {showGenerator && (
          <div className="max-w-4xl mx-auto mt-4 bg-white dark:bg-gray-800 rounded-sm shadow-xl border-l-4 border-puka-red p-6 animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full hidden md:block">
                <Bot className="text-puka-red" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1 text-puka-black dark:text-white">{t('blog.ai_panel_title')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t('blog.ai_panel_desc')}
                </p>
                <form onSubmit={handleGeneratePost} className="flex gap-3">
                  <input 
                    type="text" 
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder={t('blog.ai_input')}
                    className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-sm focus:outline-none focus:border-puka-red transition-colors text-puka-black dark:text-white"
                    disabled={isGenerating}
                  />
                  <button 
                    type="submit" 
                    disabled={isGenerating || !aiTopic.trim()}
                    className="bg-puka-red text-white px-6 py-2 rounded-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> {t('blog.ai_generating')}
                      </>
                    ) : (
                      <>{t('blog.ai_btn')}</>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CONTENT GRID */}
      <div id="blog-grid" className="container mx-auto px-4 md:px-6 py-16 scroll-mt-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 h-96 rounded-sm animate-pulse shadow-sm">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 w-full" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/3" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <article key={post.id} className="bg-white dark:bg-gray-900 rounded-sm shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                  <Link href={`/blog/${post.slug}`} className="relative h-48 overflow-hidden block">
                    <OptimizedImage 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 z-20">
                      {post.source === 'cms' && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm flex items-center gap-1 shadow-sm">
                          <Database size={10} /> CMS
                        </span>
                      )}
                      {post.source === 'local' && (
                        <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm">
                          LOCAL
                        </span>
                      )}
                      {post.source === 'ai' && (
                        <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm flex items-center gap-1">
                          <Sparkles size={10} /> IA GENERADO
                        </span>
                      )}
                    </div>
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-white/90 backdrop-blur text-puka-black text-xs font-bold px-3 py-1 rounded-sm shadow-sm uppercase tracking-wide">
                        {post.category}
                      </span>
                    </div>
                  </Link>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(post.date).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                      {post.author && (
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          {post.author}
                        </div>
                      )}
                    </div>

                    <Link href={`/blog/${post.slug}`} className="block">
                      <h3 className="font-display font-bold text-xl mb-3 leading-tight text-puka-black dark:text-white group-hover:text-puka-red transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
                      {post.excerpt}
                    </p>

                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="text-puka-black dark:text-white font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all mt-auto"
                    >
                      {t('blog.read_article')} <ArrowRight size={16} className="text-puka-red" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-16 animate-in slide-in-from-bottom-2">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-puka-black dark:text-white"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-2 font-display font-bold text-sm text-gray-600 dark:text-gray-400">
                  <span className="bg-puka-black dark:bg-white text-white dark:text-puka-black w-8 h-8 flex items-center justify-center rounded-sm">
                    {currentPage}
                  </span>
                  <span className="opacity-50">/</span>
                  <span>{totalPages}</span>
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-puka-black dark:text-white"
                  aria-label="Siguiente página"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="font-display font-bold text-2xl mb-2 text-puka-black dark:text-white">{t('blog.no_results')}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{t('blog.no_results_desc')}</p>
            
            <button 
              onClick={() => {
                setSearchQuery('');
                setShowGenerator(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-puka-red text-white px-6 py-2 rounded-sm font-bold shadow-md hover:bg-red-700 transition-colors inline-flex items-center gap-2"
            >
              <Sparkles size={16} /> {t('blog.try_ai')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;