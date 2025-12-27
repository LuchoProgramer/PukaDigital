export interface Ally {
    slug: string;
    clientName: string;
    business: string;
    industry: string;
    city: string;
    status: 'completed' | 'in-progress' | 'just-started' | 'graduated';
    statusLabel: string;
    statusEmoji: string;
    photo: string | null;
    emoji?: string;
    website: string;
    highlight: string;
    testimonialQuote?: string;
    currentPhase?: string;
    metrics?: {
        conversionsAds?: number;
        conversionsOrganic?: number;
        reviewsBefore?: number;
        reviewsAfter?: number;
        customLabel?: string;
        customValue?: string;
    };
}

export const allies: Ally[] = [
    {
        slug: 'podoclinicec-cristina-munoz',
        clientName: 'Yadira Cristina Muñoz',
        business: 'PodoclinicEC',
        industry: 'Podología',
        city: 'Quito Norte',
        status: 'graduated',
        statusLabel: 'Graduada 2 Dic 2025',
        statusEmoji: '✅',
        photo: 'https://res.cloudinary.com/dltfsttr7/image/upload/v1759895245/IMG_6853_f0skfi.jpg',
        website: 'https://podoclinicec.com',
        highlight: '53 conversiones/mes',
        testimonialQuote: 'Nunca había tenido presencia digital. Con Puka, en 3 meses pasé de 3 reseñas en Google a 15.',
        metrics: {
            conversionsAds: 33,
            conversionsOrganic: 20,
            reviewsBefore: 3,
            reviewsAfter: 15,
        },
    },
    {
        slug: 'healppypets-carla-tutistar',
        clientName: 'Carla Vanesa Tutistar',
        business: 'HealppyPets',
        industry: 'Veterinaria',
        city: 'Quito',
        status: 'in-progress',
        statusLabel: 'Mes 2 de 3',
        statusEmoji: '🟡',
        photo: null,
        emoji: '🐕',
        website: 'https://healppypets.com',
        highlight: 'Web + Chatbot + Google Business',
        currentPhase: 'Configurando campañas Google Ads',
    },
    {
        slug: 'hotel-eudiq-cafeteria-viviantes',
        clientName: 'Eudalia Jadán & Diego Quezada',
        business: 'Hotel Eudiq + Cafetería Viviantes',
        industry: 'Hotelería & Gastronomía',
        city: 'Loja',
        status: 'just-started',
        statusLabel: 'Semana 2',
        statusEmoji: '🟢',
        photo: null,
        emoji: '🏨',
        website: 'https://hoteleudiq.com',
        highlight: 'Sistema completo en construcción',
        currentPhase: 'Web SEO + Analytics + Blog',
    },
    {
        slug: 'la-huequita-quitena-yanett-sarango',
        clientName: 'Yanett Susana Sarango',
        business: 'Licorería La Huequita Quiteña',
        industry: 'Comercio & Licores',
        city: 'Quito',
        status: 'just-started',
        statusLabel: 'Día 1',
        statusEmoji: '🟢',
        photo: null,
        emoji: '🍷',
        website: 'https://pukadigital.com',
        highlight: 'Control de Inventario LedgerXpertz',
        currentPhase: 'Implementación de Inventario y Utilidades',
    },
];
