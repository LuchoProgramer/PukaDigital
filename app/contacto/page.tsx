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

const Contact: React.FC = () => {
  const { t } = useTranslation();

  const handleWhatsAppClick = () => {
    ga.trackWhatsAppDirectoClick('contact_page');
  };

  return (
    <div className="py-20 bg-white dark:bg-gray-900 transition-colors">
      <SEO 
        title="Contacto | Recupera el Control de tu Negocio"
        description="Agenda una asesoría gratuita. Sin vendedores insistentes. Solo una charla honesta sobre cómo lograr tu independencia tecnológica."
      />
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div>
            <span className="text-puka-red font-bold tracking-wider uppercase text-sm mb-2 block">{t('contact.badge')}</span>
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-6 text-puka-black dark:text-white">{t('contact.title')}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-12">
              {t('contact.desc')} <span className="font-semibold text-puka-black dark:text-white">{t('contact.desc_highlight')}</span> {t('contact.desc_end')}
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
                <div className="bg-puka-beige p-3 rounded-sm group-hover:bg-puka-red transition-colors">
                  <MessageCircle size={24} className="text-puka-black group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-puka-black dark:text-white">{t('contact.whatsapp_title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">{t('contact.whatsapp_desc')}</p>
                  <span className="text-puka-red font-bold group-hover:underline">{CONTACT.whatsappDisplay} &rarr;</span>
                </div>
              </a>

              {/* Email */}
              <a 
                href={`mailto:${CONTACT.email}`}
                className="flex items-start gap-4 group cursor-pointer"
              >
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-sm group-hover:bg-puka-red transition-colors">
                  <Mail size={24} className="text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-puka-black dark:text-white">{t('contact.email_title')}</h3>
                  <p className="text-puka-red font-medium group-hover:underline">{CONTACT.email}</p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-sm">
                  <MapPin size={24} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-puka-black dark:text-white">Ubicación</h3>
                  <p className="text-gray-600 dark:text-gray-400">{CONTACT.location}</p>
                </div>
              </div>

              {/* Response time */}
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-sm">
                  <Clock size={24} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-puka-black dark:text-white">Tiempo de respuesta</h3>
                  <p className="text-gray-600 dark:text-gray-400">Menos de 2 horas en horario laboral</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Reused */}
          <div>
             <LeadForm />
             <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 max-w-md mx-auto">
                {t('contact.privacy')}
              </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;