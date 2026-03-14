/**
 * SoftwareApplication Schemas for PukaDigital
 * Focused on Spanish-only MX (Machine Experience)
 */

const BASE_URL = 'https://pukadigital.com';

export const medicalSoftwareSchema = {
  "@type": "SoftwareApplication",
  "@id": `${BASE_URL}/#software-hc`,
  "name": "Sistema de Historias Clínicas PukaDigital",
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
