'use client';

import React from 'react';
import { Mail, MessageCircle, MapPin, Clock } from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import SEO from '@/components/SEO';
import { useTranslation } from '@/lib/i18n';
import * as ga from '@/lib/analytics';

// Contact info centralized
const CONTACT = {
  whatsapp: 'https://wa.me/593964065880',
  whatsappDisplay: '+593 96 406 5880',
  email: 'luis.viteri@pukadigital.com',
  location: 'Quito, Carcelén, Ecuador'
};

// Glass design tokens
const glass = {
  card: {
    background: 'rgba(255,255,255,0.70)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.80)',
    borderTop: '2px solid rgba(255,255,255,0.95)',
    borderRadius: '20px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  iconContainer: {
    background: 'rgba(255,255,255,0.70)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.80)',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexShrink: 0,
  },
  formWrapper: {
    background: 'rgba(255,255,255,0.60)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.80)',
    borderRadius: '20px',
    padding: '4px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
  },
};

const Contact: React.FC = () => {
  const { t } = useTranslation();

  const handleWhatsAppClick = () => {
    ga.trackWhatsAppDirectoClick('contact_page');
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        color: '#111827',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
      }}
    >
      <SEO
        title="Contacto | Recupera el Control de tu Negocio"
        description="Agenda una asesoría gratuita. Sin vendedores insistentes. Solo una charla honesta sobre cómo lograr tu independencia tecnológica."
      />

      {/* Pastel orbes — depth for glass blur */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {/* Rojo — bottom left */}
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '500px',
          height: '500px',
          background: 'rgba(199,23,30,0.06)',
          borderRadius: '50%',
          filter: 'blur(140px)',
        }} />
        {/* Azul — top right */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '600px',
          height: '600px',
          background: 'rgba(30,60,199,0.05)',
          borderRadius: '50%',
          filter: 'blur(150px)',
        }} />
        {/* Púrpura — center */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '40%',
          width: '350px',
          height: '350px',
          background: 'rgba(120,20,180,0.04)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          transform: 'translate(-50%, -50%)',
        }} />
      </div>

      {/* Content */}
      <div className="py-20 relative" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact Info — glass card */}
            <div style={glass.card} className="p-8 md:p-10">
              <span className="text-puka-red font-bold tracking-wider uppercase text-sm mb-2 block">
                {t('contact.badge')}
              </span>
              <h1
                className="font-display font-bold text-4xl md:text-5xl mb-6"
                style={{ color: '#111827' }}
              >
                {t('contact.title')}
              </h1>
              <p className="text-lg mb-12" style={{ color: '#4B5563' }}>
                {t('contact.desc')}{' '}
                <span className="font-semibold" style={{ color: '#111827' }}>
                  {t('contact.desc_highlight')}
                </span>{' '}
                {t('contact.desc_end')}
              </p>

              <div className="space-y-8">
                {/* WhatsApp */}
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  <div
                    style={glass.iconContainer}
                    className="group-hover:bg-puka-red transition-colors"
                  >
                    <MessageCircle size={24} style={{ color: '#111827' }} className="group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: '#111827' }}>
                      {t('contact.whatsapp_title')}
                    </h3>
                    <p className="mb-1" style={{ color: '#4B5563' }}>
                      {t('contact.whatsapp_desc')}
                    </p>
                    <span className="text-puka-red font-bold group-hover:underline">
                      {CONTACT.whatsappDisplay} &rarr;
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  <div style={glass.iconContainer} className="group-hover:bg-puka-red transition-colors">
                    <Mail size={24} style={{ color: '#6B7280' }} className="group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: '#111827' }}>
                      {t('contact.email_title')}
                    </h3>
                    <p className="text-puka-red font-medium group-hover:underline">
                      {CONTACT.email}
                    </p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div style={glass.iconContainer}>
                    <MapPin size={24} style={{ color: '#6B7280' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: '#111827' }}>
                      Ubicaci&oacute;n
                    </h3>
                    <p style={{ color: '#4B5563' }}>{CONTACT.location}</p>
                  </div>
                </div>

                {/* Response time */}
                <div className="flex items-start gap-4">
                  <div style={glass.iconContainer}>
                    <Clock size={24} style={{ color: '#6B7280' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: '#111827' }}>
                      Tiempo de respuesta
                    </h3>
                    <p style={{ color: '#4B5563' }}>Menos de 2 horas en horario laboral</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form — glass wrapper around LeadForm */}
            <div>
              <div style={glass.formWrapper}>
                <LeadForm />
              </div>
              <p className="text-xs text-center mt-4 max-w-md mx-auto" style={{ color: '#9CA3AF' }}>
                {t('contact.privacy')}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
