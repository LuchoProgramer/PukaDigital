'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import * as ga from '@/lib/analytics';

const StickyMobileCTA: React.FC = () => {
  
  const handleWhatsAppClick = () => {
    ga.event({
      action: 'click_whatsapp',
      category: 'Contact',
      label: 'Sticky Mobile Bar',
    });
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 md:hidden z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] pb-safe">
      <div className="flex gap-3">
        <Link 
          to="/contacto"
          className="flex-[2] bg-puka-red text-white font-bold py-3.5 px-4 rounded-sm text-center shadow-md active:scale-95 transition-transform flex items-center justify-center text-sm uppercase tracking-wide"
        >
          Independízate
        </Link>
        <a 
          href="https://wa.me/" 
          target="_blank" 
          rel="noreferrer"
          onClick={handleWhatsAppClick}
          className="flex-1 bg-[#25D366] text-white p-3 rounded-sm flex items-center justify-center active:scale-95 transition-transform shadow-md"
          aria-label="WhatsApp"
        >
          <MessageCircle size={28} fill="white" className="text-[#25D366]" />
        </a>
      </div>
    </div>
  );
};

export default StickyMobileCTA;