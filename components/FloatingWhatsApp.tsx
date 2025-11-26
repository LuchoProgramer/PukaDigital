'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import * as ga from '@/lib/analytics';
import { useTranslation } from '@/lib/i18n';

// WhatsApp number centralized
const WHATSAPP_NUMBER = '593964065880';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

const FloatingWhatsApp: React.FC = () => {
  const { t } = useTranslation();

  const handleClick = () => {
    ga.event({
      action: 'click_whatsapp',
      category: 'Contact',
      label: 'Floating Widget',
    });
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 group">
      {/* Pulse Effect Ring - Changed to Puka Red */}
      <div className="absolute inset-0 bg-puka-red rounded-full opacity-20 animate-[ping_2s_ease-in-out_infinite] group-hover:animate-none"></div>
      
      <a 
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        // Changed Gradient to Red scale (from dark red to Puka red) and Shadows to Red
        className="relative flex items-center gap-0 bg-gradient-to-tr from-[#900f14] to-puka-red text-white p-0 rounded-full shadow-[0_4px_14px_rgba(199,23,30,0.4)] hover:shadow-[0_6px_20px_rgba(199,23,30,0.6)] transform hover:-translate-y-1 transition-all duration-300 overflow-hidden pr-0 group-hover:pr-6 md:pr-0 md:group-hover:pr-6 h-14"
        aria-label="Chat en WhatsApp"
      >
        {/* Icon Container */}
        <div className="w-14 h-14 flex items-center justify-center relative z-10 shrink-0">
          <MessageCircle size={28} fill="white" className="text-white drop-shadow-sm" />
          
          {/* Notification Badge - Changed to White for contrast on Red button */}
          <div className="absolute top-3 right-3 w-3.5 h-3.5 bg-white border-2 border-puka-red rounded-full flex items-center justify-center animate-bounce duration-1000">
             {/* Tiny dot purely visual */}
          </div>
        </div>

        {/* Text Reveal - Hidden on Mobile default, expands on Desktop Hover */}
        <div className="max-w-0 group-hover:max-w-xs transition-[max-width] duration-500 ease-in-out whitespace-nowrap overflow-hidden">
          <div className="flex flex-col leading-tight pl-1">
             <span className="font-display font-bold text-sm">
               {t('nav.contact') || 'Hablemos'}
             </span>
             {/* Changed text color to red-100 to match the red button theme */}
             <span className="text-[10px] text-red-100 opacity-90 font-medium">
               Respuesta inmediata
             </span>
          </div>
        </div>
      </a>

      {/* Mobile Badge Counter (External) - Changed to White bg with Red text for contrast */}
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-puka-red text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-gray-100 shadow-sm pointer-events-none">
        1
      </div>
    </div>
  );
};

export default FloatingWhatsApp;