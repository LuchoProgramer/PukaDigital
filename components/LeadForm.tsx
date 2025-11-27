'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Use prop title if provided, otherwise fallback to translated default title
  const displayTitle = title || t('form.title');

  // Track scarcity indicator view
  useEffect(() => {
    ga.trackCuposDisponiblesVisto(5, 2);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Track Conversión CRÍTICA con todos los datos
      await ga.trackSolicitarEntrevista({
        business_name: businessName,
        user_name: userName,
        whatsapp: whatsapp,
        growth_blocker: growthBlocker || 'no_selection',
      });
      
      // Send lead to email
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          userName,
          whatsapp,
          growthBlocker,
          source: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar');
      }

      setSubmitStatus('success');
      
      // Reset form after success
      setBusinessName('');
      setUserName('');
      setWhatsapp('');
      setGrowthBlocker('');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success message
  if (submitStatus === 'success') {
    return (
      <div className={`bg-white p-6 md:p-8 rounded-sm shadow-xl border-t-4 border-green-500 ${className}`}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h3 className="font-display font-bold text-2xl mb-2 text-puka-black">
            ¡Solicitud Recibida!
          </h3>
          <p className="text-gray-600 mb-4">
            Te contactaremos en menos de 2 horas por WhatsApp.
          </p>
          <button 
            onClick={() => setSubmitStatus('idle')}
            className="text-puka-red font-medium hover:underline"
          >
            Enviar otra solicitud
          </button>
        </div>
      </div>
    );
  }

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

        {/* Error message */}
        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm">
            Hubo un error al enviar. Por favor intenta de nuevo o escríbenos directamente por WhatsApp.
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-puka-red text-white font-bold text-lg py-4 rounded-sm hover:bg-red-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Enviando...
            </>
          ) : (
            t('form.submit')
          )}
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