/**
 * SoftwareApplication Schemas for PukaDigital
 * Focused on Spanish-only MX (Machine Experience)
 */

const BASE_URL = 'https://pukadigital.com';

export const medicalSoftwareSchema = {
  "@type": "SoftwareApplication",
  "@id": `${BASE_URL}/#software-pukahealth`,
  "name": "PukaHealth - Sistema de Historias Clínicas",
  "description": "Plataforma digital de gestión de historias clínicas para consultorios y clínicas en Ecuador. Expedientes médicos, recetas y diagnósticos desde cualquier dispositivo.",
  "applicationCategory": "HealthApplication",
  "applicationSubCategory": "Gestión de expedientes médicos",
  "operatingSystem": "Web, iOS, Android",
  "inLanguage": "es-EC",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Demo gratuita disponible"
  },
  "featureList": [
    "Expedientes médicos digitales",
    "Historial de consultas y diagnósticos",
    "Recetas y órdenes médicas digitales",
    "Acceso multi-usuario y multi-sede",
    "Búsqueda instantánea de pacientes",
    "Respaldo automático en la nube",
    "Acceso desde cualquier dispositivo"
  ],
  "provider": { "@id": `${BASE_URL}/#organization` },
  "url": `${BASE_URL}/historias-clinicas`
};
