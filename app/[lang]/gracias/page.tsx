'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Smartphone, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import * as ga from '@/lib/analytics';

const GraciasPage = () => {
    const { language } = useTranslation();
    const lang = language || 'es';

    useEffect(() => {
        // Trigger generic conversion event if needed, 
        // though usually the click itself was the conversion trigger.
        // This page serves as a "confirmation" and catch-all for pixels.
        if (typeof window !== 'undefined' && 'gtag' in window) {
            // Example: Force a page view event explicitly for "thank_you" virtual path
            // window.gtag('event', 'page_view', { page_path: '/thank-you' });
        }
    }, []);

    const WHATSAPP_NUMBER = '593964065880';
    const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-puka-red/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-puka-beige/20 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="max-w-xl w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl border border-gray-100 text-center relative z-10 animate-fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircle className="text-green-500" size={40} />
                </div>

                <h1 className="font-display font-black text-3xl md:text-5xl text-puka-black mb-6">
                    ¡Excelente Decisión!
                </h1>

                <p className="text-gray-500 text-lg md:text-xl font-medium mb-8 leading-relaxed">
                    Hemos abierto WhatsApp para conectarte con un asesor experto.<br />
                    <span className="text-sm text-gray-400">Si no se abrió automáticamente, haz clic abajo.</span>
                </p>

                <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black text-xl hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 transform hover:-translate-y-1 flex items-center justify-center gap-3 mb-8"
                >
                    <Smartphone size={24} />
                    ABRIR WHATSAPP AHORA
                </a>

                <div className="border-t border-gray-100 pt-8">
                    <p className="text-sm text-gray-400 mb-4">¿Quieres ver más casos de éxito mientras esperas?</p>
                    <Link
                        href={`/${lang}`}
                        className="inline-flex items-center gap-2 text-puka-black font-bold hover:text-puka-red transition-colors"
                    >
                        Volver al Inicio <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Style for simple animation */}
            <style jsx>{`
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default GraciasPage;
