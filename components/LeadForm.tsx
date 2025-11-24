'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import * as ga from '@/lib/analytics';
import { useTranslation } from '@/lib/i18n';

const LeadForm: React.FC<{ className?: string, title?: string }> = ({ 
  className = "", 
  title 
}) => {
  const { t } = useTranslation();
  
  // Use prop title if provided, otherwise fallback to translated default title
  const displayTitle = title || t('form.title');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // En una aplicación real, aquí iría la lógica de envío al servidor
    
    // Track Conversión
    ga.event({
      action: 'generate_lead',
      category: 'Form',
      label: displayTitle,
    });
    
    alert("¡Gracias! Hemos recibido tu solicitud. Te contactaremos pronto.");
  };

  return (
    <div className={`bg-white p-6 md:p-8 rounded-sm shadow-xl border-t-4 border-puka-red ${className}`}>
      <h3 className="font-display font-bold text-2xl mb-2 text-puka-black">{displayTitle}</h3>
      
      {/* Scarcity Trigger */}
      <div className="bg-orange-50 border border-orange-100 p-3 rounded-sm mb-6 flex gap-2 items-start">
        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0 animate-pulse" />
        <p className="text-xs text-orange-800 font-medium leading-tight">
          {t('form.scarcity')}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('form.business_name')}</label>
          <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-puka-red focus:bg-white transition-colors placeholder-gray-400" placeholder={t('form.business_placeholder')} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('form.your_name')}</label>
            <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-puka-red focus:bg-white transition-colors placeholder-gray-400" placeholder={t('form.name_placeholder')} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('form.whatsapp')}</label>
            <input type="tel" required className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-puka-red focus:bg-white transition-colors placeholder-gray-400" placeholder={t('form.whatsapp_placeholder')} />
          </div>
        </div>

        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('form.challenge')}</label>
           <select className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-puka-red focus:bg-white transition-colors text-gray-700">
             <option>{t('form.challenge_opt_1')}</option>
             <option>{t('form.challenge_opt_2')}</option>
             <option>{t('form.challenge_opt_3')}</option>
             <option>{t('form.challenge_opt_4')}</option>
             <option>{t('form.challenge_opt_5')}</option>
           </select>
        </div>

        <button type="submit" className="w-full bg-puka-red text-white font-bold text-lg py-4 rounded-sm hover:bg-red-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200 flex items-center justify-center gap-2">
          {t('form.submit')}
        </button>
        
        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-wide">
          <CheckCircle2 size={12} className="text-green-500" /> {t('form.no_commitment')}
          <span className="text-gray-300">|</span>
          <CheckCircle2 size={12} className="text-green-500" /> {t('form.secure_data')}
        </div>
      </form>
    </div>
  );
};

export default LeadForm;