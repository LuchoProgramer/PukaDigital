'use client';

import React from 'react';
import * as ga from '@/lib/analytics';
import { useTranslation } from '@/lib/i18n';

// WhatsApp number centralized
const WHATSAPP_NUMBER = '593964065880';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const FloatingWhatsApp: React.FC = () => {
  const { t } = useTranslation();

  const handleClick = () => {
    ga.trackWhatsAppDirectoClick('float');
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
        // Button is now White with Puka Red border/details
        className="relative flex items-center gap-0 bg-white dark:bg-gray-900 text-puka-red p-0 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-800 hover:shadow-[0_6px_20px_rgba(227,6,19,0.2)] transform hover:-translate-y-1 transition-all duration-300 overflow-hidden pr-0 group-hover:pr-6 md:pr-0 md:group-hover:pr-6 h-14"
        aria-label="Chat en WhatsApp"
      >
        {/* Icon Container */}
        <div className="w-14 h-14 flex items-center justify-center relative z-10 shrink-0">
          <WhatsAppIcon size={30} className="text-puka-red drop-shadow-sm" />

          {/* Notification Badge - Red with white dot */}
          <div className="absolute top-3 right-3 w-3.5 h-3.5 bg-puka-red border-2 border-white rounded-full flex items-center justify-center animate-bounce duration-1000">
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Text Reveal */}
        <div className="max-w-0 group-hover:max-w-xs transition-[max-width] duration-500 ease-in-out whitespace-nowrap overflow-hidden">
          <div className="flex flex-col leading-tight pl-1">
            <span className="font-display font-bold text-sm text-puka-black dark:text-white">
              {t('nav.contact') || 'Hablemos'}
            </span>
            <span className="text-[10px] text-puka-red opacity-90 font-medium">
              Respuesta inmediata
            </span>
          </div>
        </div>
      </a>

      {/* Mobile Badge Counter (External) - Red background with White text */}
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-puka-red text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm pointer-events-none">
        1
      </div>
    </div>
  );
};

export default FloatingWhatsApp;