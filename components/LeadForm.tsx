'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import * as ga from '@/lib/analytics';
import { useTranslation } from '@/lib/i18n';

const LeadForm: React.FC<{ className?: string, title?: string }> = ({ 
  className = "", 
  title 
}) => {
  const { t } = useTranslation();
  
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [userName, setUserName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [growthBlocker, setGrowthBlocker] = useState('');
  
  // Use prop title if provided, otherwise fallback to translated default title
  const displayTitle = title || t('form.title');

  // Track scarcity indicator view
  useEffect(() => {
    ga.trackCuposDisponiblesVisto(5, 2);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track Conversión CRÍTICA con todos los datos
    await ga.trackSolicitarEntrevista({
      business_name: businessName,
      user_name: userName,
      whatsapp: whatsapp,
      growth_blocker: growthBlocker || t('form.challenge_opt_1'),
    });
    
    alert("¡Gracias! Hemos recibido tu solicitud. Te contactaremos pronto.");
    
    // Reset form
    setBusinessName('');
    setUserName('');
    setWhatsapp('');
    setGrowthBlocker('');
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
          <input 
            type="text" 
            required 
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-puka-red focus:bg-white transition-colors placeholder-gray-400" 
            placeholder={t('form.business_placeholder')} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('form.your_name')}</label>
            <input 
              type="text" 
              required 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-puka-red focus:bg-white transition-colors placeholder-gray-400" 
              placeholder={t('form.name_placeholder')} 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('form.whatsapp')}</label>
            <input 
              type="tel" 
              required 
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-puka-red focus:bg-white transition-colors placeholder-gray-400" 
              placeholder={t('form.whatsapp_placeholder')} 
            />
          </div>
        </div>

        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('form.challenge')}</label>
           <select 
             value={growthBlocker}
             onChange={(e) => setGrowthBlocker(e.target.value)}
             className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-puka-red focus:bg-white transition-colors text-gray-700"
           >
             <option value="">{t('form.challenge_opt_1')}</option>
             <option value="no_web">{t('form.challenge_opt_2')}</option>
             <option value="no_clients">{t('form.challenge_opt_3')}</option>
             <option value="no_time">{t('form.challenge_opt_4')}</option>
             <option value="other">{t('form.challenge_opt_5')}</option>
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