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
        statusLabel: 'Autogestión desde Dic 2025',
        statusEmoji: '✅',
        photo: 'https://res.cloudinary.com/dltfsttr7/image/upload/v1759895245/IMG_6853_f0skfi.jpg',
        website: 'https://podoclinicec.com',
        highlight: '371 conversiones a $2,52',
        // Cita textual de Cristina. Se prefiere esta a la de las reseñas porque no
        // caduca con el conteo de Google. Cifras verificadas al 2026-08-28.
        testimonialQuote: 'Lo que más me sorprendió es que estoy logrando mi objetivo: hacer crecer Podoclinic. Antes tenía 20 pacientes al mes, ahora tengo 3 a 4 diarios.',
        metrics: {
            conversionsAds: 371,
            conversionsOrganic: 281,
            reviewsBefore: 3,
            reviewsAfter: 56,
        },
    },
    {
        slug: 'healppypets-carla-tutistar',
        clientName: 'Carla Vanesa Tutistar',
        business: 'HealppyPets',
        industry: 'Veterinaria',
        city: 'Quito',
        status: 'in-progress',
        statusLabel: 'Mes 2: Posicionamiento',
        statusEmoji: '🟡',
        photo: null,
        emoji: '🐕',
        website: 'https://healppypets.com',
        highlight: 'Top 3 Google | Top 1 ChatGPT',
        currentPhase: 'SEO Orgánico Dominante (Ads Pendiente)',
        metrics: {
            customLabel: 'Ranking ChatGPT (Carcelén)',
            customValue: '#1',
        }
    },
    {
        slug: 'hotel-eudiq-cafeteria-viviantes',
        clientName: 'Eudalia Jadán & Diego Quezada',
        business: 'Hotel Eudiq + Cafetería Viviantes',
        industry: 'Hotelería & Gastronomía',
        city: 'Loja',
        status: 'in-progress',
        statusLabel: 'Inicio Ads: 7 Ene 2026',
        statusEmoji: '🚀',
        photo: null,
        emoji: '🏨',
        website: 'https://hoteleudiq.com',
        highlight: 'Campaña Google Ads Activa',
        currentPhase: 'Fase de Aprendizaje y Optimización',
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
