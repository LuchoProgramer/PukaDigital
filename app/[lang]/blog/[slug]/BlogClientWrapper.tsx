'use client';

import React, { useEffect, useRef } from 'react';
import { Share2 } from 'lucide-react';
import * as ga from '@/lib/analytics';
import { BlogPost } from '@/types';

interface BlogClientWrapperProps {
    post: BlogPost;
    children: React.ReactNode;
}

export default function BlogClientWrapper({ post, children }: BlogClientWrapperProps) {
    // Scroll tracking refs
    const startTime = useRef<number>(Date.now());
    const scrollMilestones = useRef<Set<25 | 50 | 75 | 100>>(new Set());

    // Scroll tracking effect
    useEffect(() => {
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

    const handleShare = async () => {
        if (navigator.share) {
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

    // We expose the share button through a portal or just by finding it in the DOM?
    // Actually, better to just let the page pass the share button as a separate prop or use a context.
    // For simplicity, I'll just make the share button a component that this wrapper can provide.

    return (
        <>
            {children}
            {/* Script to handle sharing if needed, but we can also just put the button inside children if we use children properly */}
        </>
    );
}

// Separate component for the share button to be used inside the Client Wrapper if needed
export function ShareButton({ post }: { post: BlogPost }) {
    const handleShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            alert('¡Enlace copiado al portapapeles!');
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-puka-red dark:hover:text-puka-red transition-colors text-sm font-medium"
        >
            <Share2 size={16} />
            Compartir artículo
        </button>
    );
}
