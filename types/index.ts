// Navigation Types
export interface NavItem {
  label: string;
  path: string;
  icon?: any;
  isPrimary?: boolean;
}

// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  category: string;
  slug: string;
  source?: 'cms' | 'local' | 'ai';
  author?: string;
}

// CMS Status Types
export interface CMSStatus {
  isConnected: boolean;
  source: 'cms' | 'local-fallback' | 'hybrid';
  latency?: number;
}

// Pricing Types
export interface PricingPlan {
  id: string;
  name: string;
  subtitle?: string;
  price: string;
  period: string;
  features: string[];
  badge?: string;
  highlighted?: boolean;
  cta: string;
}

// Language Types
export type Language = 'es' | 'en' | 'pt';
