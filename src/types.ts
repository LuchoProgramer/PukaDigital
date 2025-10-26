export type Block =
  | { type: 'text'; content?: string }
  | { type: 'image'; src?: string; alt?: string }
  | { type: 'video'; src?: string };

export interface Blog {
  id?: string;
  title: string;
  content?: string;
  createdAt?: Date | null;
  slug: string;
  image?: string | null;
  alt?: string | null;
  excerpt?: string;
  blocks: Block[];
  tenantId?: string; // Para multitenant
  author?: {
    name: string;
    userId?: string;
  };
}

// Nuevas interfaces para multitenant
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  customDomain?: string;
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
  };
  settings: {
    siteName: string;
    description: string;
    defaultAuthor: string;
  };
  subscription: SubscriptionPlan;
  createdAt: Date;
  adminUsers: string[]; // UIDs de usuarios admin
}

export interface TenantUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export enum SubscriptionPlan {
  FREE = 'free',
  STARTER = 'starter', 
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export enum UserRole {
  VIEWER = 'viewer',
  EDITOR = 'editor', 
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

