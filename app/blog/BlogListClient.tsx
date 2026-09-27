'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BlogPost, CMSStatus } from '@/types';
import { Calendar, User, ArrowRight, Wifi, WifiOff, Database, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

const POSTS_PER_PAGE = 6;

interface BlogListClientProps {
    initialPosts: BlogPost[];
    initialStatus: CMSStatus;
}

export default function BlogListClient({ initialPosts, initialStatus }: BlogListClientProps) {
    const [posts] = useState<BlogPost[]>(initialPosts);
    const [status] = useState<CMSStatus>(initialStatus);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Cambiar la búsqueda vuelve a la primera página
    const cambiarBusqueda = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
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

    return (
        <div className="bg-gray-50 dark:bg-black min-h-screen transition-colors">
            {/* HEADER & STATUS */}
            <div className="bg-puka-black text-white py-16">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <span className="text-puka-red font-bold tracking-wider uppercase text-sm mb-2 block">Academia Digital</span>
                            <h1 className="font-display font-bold text-4xl md:text-5xl">Blog & Educación</h1>
                        </div>

                        {/* HYBRID STATUS BANNER */}
                        <div className={`px-4 py-2 rounded-sm border flex items-center gap-3 text-xs font-mono backdrop-blur-sm ${status.isConnected
                                ? 'bg-green-900/30 border-green-500/50 text-green-100'
                                : 'bg-yellow-900/30 border-yellow-500/50 text-yellow-100'
                            }`}>
                            {status.isConnected ? <Wifi size={14} className="animate-pulse" /> : <WifiOff size={14} />}
                            <div>
                                <span className="block font-bold">SISTEMA HÍBRIDO: {status.isConnected ? 'EN LÍNEA' : 'MODO SEGURO (LOCAL)'}</span>
                                <span className="opacity-70">
                                    FUENTE: {status.source.toUpperCase()} {status.latency ? `(${status.latency}ms)` : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEARCH BAR */}
            <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">
                <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">

                    {/* Search Input */}
                    <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-sm shadow-lg flex items-center gap-4 border border-gray-100 dark:border-gray-700 transition-colors">
                        <Search className="text-gray-400" size={24} />
                        <input
                            type="text"
                            placeholder="Buscar artículos por tema o tecnología..."
                            value={searchQuery}
                            onChange={(e) => cambiarBusqueda(e.target.value)}
                            className="flex-1 outline-none text-lg text-puka-black dark:text-white placeholder-gray-400 bg-transparent"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => cambiarBusqueda('')}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors"
                                aria-label="Limpiar búsqueda"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                </div>

            </div>

            {/* CONTENT GRID */}
            <div id="blog-grid" className="container mx-auto px-4 md:px-6 py-16 scroll-mt-24">
                {filteredPosts.length > 0 ? (
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
                                            Leer Artículo <ArrowRight size={16} className="text-puka-red" />
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
                        <h3 className="font-display font-bold text-2xl mb-2 text-puka-black dark:text-white">Sin resultados</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">No encontramos artículos que coincidan con tu búsqueda.</p>

                        <button
                            onClick={() => cambiarBusqueda('')}
                            className="bg-puka-red text-white px-6 py-2 rounded-sm font-bold shadow-md hover:bg-red-700 transition-colors inline-flex items-center gap-2"
                        >
                            <X size={16} /> Limpiar búsqueda
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
