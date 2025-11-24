export enum ProductTier {
  PYME = 'PYME',
  CRECIMIENTO = 'CRECIMIENTO',
  CORPORATIVO = 'CORPORATIVO'
}

export interface NavItem {
  label: string;
  path: string;
}

export interface Testimonial {
  author: string;
  business: string;
  quote: string;
  metric: string;
}

export interface PricingPlan {
  title: string;
  price: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string; // Markdown content
  coverImage: string;
  date: string;
  category: string;
  slug: string;
  source: 'local' | 'cms' | 'ai';
  author?: string;
}

export interface CMSStatus {
  isConnected: boolean;
  source: 'hybrid' | 'local-fallback';
  latency?: number;
}

// Analytics Global Definition
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
    dataLayer: any[];
  }
}