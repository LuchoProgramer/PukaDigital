'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Loader2, ArrowRight, Sparkles, MessageCircle, AlertCircle, Phone, Building2, User, Mail } from 'lucide-react';
import * as ga from '@/lib/analytics';
import { useTranslation } from '@/lib/i18n';

// WhatsApp number for fallback
const WHATSAPP_NUMBER = '593964065880';

const LeadForm: React.FC<{ className?: string, title?: string }> = ({
  className = "",
  title
}) => {
  const { t } = useTranslation();

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [growthBlocker, setGrowthBlocker] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Validation state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Use prop title if provided, otherwise fallback to translated default title
  const displayTitle = title || t('form.title');

  // Load saved data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('leadFormDraft');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.businessName) setBusinessName(data.businessName);
        if (data.userName) setUserName(data.userName);
        if (data.email) setEmail(data.email);
        if (data.whatsapp) setWhatsapp(data.whatsapp);
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  // Save draft to localStorage
  useEffect(() => {
    if (businessName || userName || whatsapp || email) {
      localStorage.setItem('leadFormDraft', JSON.stringify({ businessName, userName, whatsapp, email }));
    }
  }, [businessName, userName, whatsapp, email]);

  // Track scarcity indicator view
  useEffect(() => {
    ga.trackCuposDisponiblesVisto(5, 2);
  }, []);

  // Format WhatsApp number (add Ecuador code if needed)
  const formatWhatsApp = useCallback((value: string) => {
    // Remove all non-digits
    let digits = value.replace(/\D/g, '');

    // If starts with 0, assume Ecuador and replace with 593
    if (digits.startsWith('0')) {
      digits = '593' + digits.slice(1);
    }

    // Format for display
    if (digits.length >= 3) {
      if (digits.startsWith('593')) {
        // Ecuador format: +593 99 123 4567
        const parts = ['+593'];
        const rest = digits.slice(3);
        if (rest.length > 0) parts.push(rest.slice(0, 2));
        if (rest.length > 2) parts.push(rest.slice(2, 5));
        if (rest.length > 5) parts.push(rest.slice(5, 9));
        return parts.join(' ');
      }
    }

    return value;
  }, []);

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setWhatsapp(formatted);
  };

  // Validation
  const isValidPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidName = (name: string) => name.trim().length >= 2;
  const isValidBusiness = (business: string) => business.trim().length >= 2;

  const getFieldError = (field: string): string | null => {
    if (!touched[field]) return null;

    switch (field) {
      case 'businessName':
        return !isValidBusiness(businessName) ? 'Ingresa el nombre de tu negocio' : null;
      case 'userName':
        return !isValidName(userName) ? 'Ingresa tu nombre' : null;
      case 'email':
        return !isValidEmail(email) ? 'Ingresa un correo válido' : null;
      case 'whatsapp':
        return !isValidPhone(whatsapp) ? 'Ingresa un número válido' : null;
      default:
        return null;
    }
  };

  const isFormValid = isValidBusiness(businessName) && isValidName(userName) && isValidPhone(whatsapp) && isValidEmail(email);

  // Calculate form progress
  const progress = [
    isValidBusiness(businessName),
    isValidName(userName),
    isValidEmail(email),
    isValidPhone(whatsapp),
    growthBlocker !== '',
  ].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ businessName: true, userName: true, whatsapp: true, email: true });

    if (!isFormValid) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Track Conversión CRÍTICA con todos los datos
      await ga.trackSolicitarEntrevista({
        business_name: businessName,
        user_name: userName,
        whatsapp: whatsapp.replace(/\D/g, ''),
        growth_blocker: growthBlocker || 'no_selection',
      });

      // Send lead to email
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          userName,
          email,
          whatsapp: whatsapp.replace(/\D/g, ''),
          growthBlocker,
          source: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar');
      }

      // Clear draft from localStorage on success
      localStorage.removeItem('leadFormDraft');

      setSubmitStatus('success');

      // Reset form after success
      setBusinessName('');
      setUserName('');
      setEmail('');
      setWhatsapp('');
      setGrowthBlocker('');
      setTouched({});

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate WhatsApp fallback link
  const getWhatsAppFallbackLink = () => {
    const message = encodeURIComponent(
      `🔴 Hola! Quiero aplicar al programa de Independencia Digital.\n\n` +
      `📍 Negocio: ${businessName}\n` +
      `👤 Nombre: ${userName}\n` +
      `📧 Email: ${email}\n` +
      `📱 WhatsApp: ${whatsapp}\n` +
      `🎯 Reto: ${growthBlocker || 'No especificado'}`
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  };

  // Success state with animation
  if (submitStatus === 'success') {
    return (
      <div className={`bg-white p-6 md:p-8 rounded-sm shadow-xl border-t-4 border-green-500 overflow-hidden relative ${className}`}>
        {/* Confetti-like decorations */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-ping" />
          <div className="absolute top-8 right-8 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="absolute bottom-12 left-12 w-2 h-2 bg-puka-red rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
          <div className="absolute top-16 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>

        <div className="text-center py-6 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-[bounce_1s_ease-in-out]">
            <CheckCircle2 size={40} className="text-white" />
          </div>

          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <Sparkles size={14} />
            Paso 1 completado
          </div>

          <h3 className="font-display font-bold text-2xl mb-2 text-puka-black">
            ¡Excelente decisión!
          </h3>

          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Tu solicitud está en camino. Te contactaremos en <span className="font-bold text-puka-black">menos de 2 horas</span> por WhatsApp.
          </p>

          <div className="bg-gray-50 p-4 rounded-sm mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Próximo paso</p>
            <p className="text-sm text-gray-700">
              📱 Revisa tu WhatsApp - te enviaremos un mensaje para agendar tu entrevista gratuita.
            </p>
          </div>

          <button
            onClick={() => setSubmitStatus('idle')}
            className="text-gray-400 text-sm hover:text-puka-red transition-colors"
          >
            ¿Necesitas enviar otra solicitud?
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-6 md:p-8 rounded-sm shadow-xl border-t-4 border-puka-red ${className}`}>
      <h3 className="font-display font-bold text-2xl mb-2 text-puka-black">{displayTitle}</h3>

      {/* Progress indicator */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${step <= progress ? 'bg-puka-red' : 'bg-gray-200'
              }`}
          />
        ))}
      </div>

      {/* Scarcity Trigger */}
      <div className="bg-orange-50 border border-orange-100 p-3 rounded-sm mb-6 flex gap-2 items-start">
        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0 animate-pulse" />
        <p className="text-xs text-orange-800 font-medium leading-tight">
          {t('form.scarcity')}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Business Name - Floating Label */}
        <div className="relative">
          <div className={`absolute left-4 transition-all duration-200 pointer-events-none ${focusedField === 'businessName' || businessName
            ? 'top-1 text-[10px] text-puka-red font-bold uppercase tracking-wider'
            : 'top-3.5 text-gray-400 text-sm'
            }`}>
            <span className="flex items-center gap-1">
              <Building2 size={focusedField === 'businessName' || businessName ? 10 : 14} />
              {t('form.business_name')}
            </span>
          </div>
          <input
            type="text"
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            onFocus={() => setFocusedField('businessName')}
            onBlur={() => { setFocusedField(null); setTouched(t => ({ ...t, businessName: true })); }}
            className={`w-full bg-gray-50 border rounded-sm px-4 pt-6 pb-2 focus:outline-none focus:bg-white transition-all ${getFieldError('businessName')
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-200 focus:border-puka-red'
              }`}
          />
          {getFieldError('businessName') && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {getFieldError('businessName')}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Name - Floating Label */}
          <div className="relative">
            <div className={`absolute left-4 transition-all duration-200 pointer-events-none ${focusedField === 'userName' || userName
              ? 'top-1 text-[10px] text-puka-red font-bold uppercase tracking-wider'
              : 'top-3.5 text-gray-400 text-sm'
              }`}>
              <span className="flex items-center gap-1">
                <User size={focusedField === 'userName' || userName ? 10 : 14} />
                {t('form.your_name')}
              </span>
            </div>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onFocus={() => setFocusedField('userName')}
              onBlur={() => { setFocusedField(null); setTouched(t => ({ ...t, userName: true })); }}
              className={`w-full bg-gray-50 border rounded-sm px-4 pt-6 pb-2 focus:outline-none focus:bg-white transition-all ${getFieldError('userName')
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-200 focus:border-puka-red'
                }`}
            />
            {getFieldError('userName') && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {getFieldError('userName')}
              </p>
            )}
          </div>

          {/* Email - Floating Label */}
          <div className="relative">
            <div className={`absolute left-4 transition-all duration-200 pointer-events-none ${focusedField === 'email' || email
              ? 'top-1 text-[10px] text-puka-red font-bold uppercase tracking-wider'
              : 'top-3.5 text-gray-400 text-sm'
              }`}>
              <span className="flex items-center gap-1">
                <Mail size={focusedField === 'email' || email ? 10 : 14} />
                {t('form.email')}
              </span>
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => { setFocusedField(null); setTouched(t => ({ ...t, email: true })); }}
              className={`w-full bg-gray-50 border rounded-sm px-4 pt-6 pb-2 focus:outline-none focus:bg-white transition-all ${getFieldError('email')
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-200 focus:border-puka-red'
                }`}
            />
            {getFieldError('email') && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {getFieldError('email')}
              </p>
            )}
            {email && isValidEmail(email) && (
              <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                <CheckCircle2 size={12} /> Email válido
              </p>
            )}
          </div>
        </div>

        {/* WhatsApp - Floating Label with auto-format */}
        <div className="relative">
          <div className={`absolute left-4 transition-all duration-200 pointer-events-none ${focusedField === 'whatsapp' || whatsapp
            ? 'top-1 text-[10px] text-puka-red font-bold uppercase tracking-wider'
            : 'top-3.5 text-gray-400 text-sm'
            }`}>
            <span className="flex items-center gap-1">
              <Phone size={focusedField === 'whatsapp' || whatsapp ? 10 : 14} />
              {t('form.whatsapp')}
            </span>
          </div>
          <input
            type="tel"
            required
            value={whatsapp}
            onChange={handleWhatsAppChange}
            onFocus={() => setFocusedField('whatsapp')}
            onBlur={() => { setFocusedField(null); setTouched(t => ({ ...t, whatsapp: true })); }}
            placeholder={focusedField === 'whatsapp' ? '0999123456' : ''}
            className={`w-full bg-gray-50 border rounded-sm px-4 pt-6 pb-2 focus:outline-none focus:bg-white transition-all ${getFieldError('whatsapp')
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-200 focus:border-puka-red'
              }`}
          />
          {getFieldError('whatsapp') && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {getFieldError('whatsapp')}
            </p>
          )}
          {whatsapp && isValidPhone(whatsapp) && (
            <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
              <CheckCircle2 size={12} /> Número válido
            </p>
          )}
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

        {/* Error message with WhatsApp fallback */}
        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-sm">
            <p className="text-red-700 text-sm mb-3 flex items-center gap-2">
              <AlertCircle size={16} />
              Hubo un error al enviar. Intenta de nuevo o usa WhatsApp:
            </p>
            <a
              href={getWhatsAppFallbackLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={16} />
              Enviar por WhatsApp
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className={`w-full text-white font-bold text-lg py-4 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : isFormValid
              ? 'bg-puka-red hover:bg-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              : 'bg-gray-300 cursor-not-allowed'
            }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Enviando tu solicitud...
            </>
          ) : (
            <>
              {t('form.submit')}
              <ArrowRight size={18} className={isFormValid ? 'animate-[pulse_2s_infinite]' : ''} />
            </>
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