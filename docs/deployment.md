# 🚀 Deployment Guide

Complete guide for deploying Puka Digital CMS to production.

## 📋 Table of Contents

1. [Pre-deployment Checklist](#pre-deployment-checklist)
2. [Vercel Deployment (Recommended)](#vercel-deployment)
3. [Netlify Deployment](#netlify-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Firebase Setup](#firebase-setup)
7. [Domain & SSL](#domain--ssl)
8. [Performance Optimization](#performance-optimization)
9. [Monitoring & Logging](#monitoring--logging)
10. [Backup & Recovery](#backup--recovery)

---

## ✅ Pre-deployment Checklist

### Code Preparation
- [ ] All features tested locally
- [ ] TypeScript compilation successful (`npm run build`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Environment variables documented
- [ ] Security rules updated in Firebase
- [ ] Database indexes created

### Firebase Configuration
- [ ] Production Firebase project created
- [ ] Authentication providers configured
- [ ] Firestore database created
- [ ] Security rules deployed
- [ ] Billing account setup (if using paid features)

### External Services
- [ ] Cloudinary account configured
- [ ] Upload presets created
- [ ] Domain purchased (if using custom domain)
- [ ] SSL certificates ready

---

## 🚀 Vercel Deployment (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments and excellent performance.

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy from Local Machine

```bash
# Navigate to project directory
cd pukadigital

# Deploy to Vercel
vercel

# Follow the prompts:
# ? Set up and deploy "~/pukadigital"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Team]
# ? Link to existing project? [y/N] n
# ? What's your project's name? pukadigital-cms
# ? In which directory is your code located? ./
```

### 4. Configure Environment Variables

Add environment variables in Vercel dashboard:

```bash
# Go to Vercel dashboard > Your Project > Settings > Environment Variables
# Add all production environment variables (see Environment Configuration section)
```

### 5. Custom Domain Setup

```bash
# In Vercel dashboard > Your Project > Settings > Domains
# Add your custom domain: cms.yourdomain.com
# Follow DNS configuration instructions
```

### 6. GitHub Integration (Recommended)

```bash
# Connect your GitHub repository for automatic deployments
# In Vercel dashboard > Your Project > Settings > Git
# Connect to GitHub repository
```

### 7. Deploy Production

```bash
# Deploy production version
vercel --prod

# Or use GitHub integration for automatic deployments
git push origin main
```

---

## 🌐 Netlify Deployment

Alternative deployment option with excellent features.

### 1. Build Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_TELEMETRY_DISABLED = "1"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

### 3. Environment Variables

```bash
# Set environment variables
netlify env:set NEXT_PUBLIC_FIREBASE_API_KEY "your_api_key"
netlify env:set NEXT_PUBLIC_FIREBASE_PROJECT_ID "your_project_id"
# Add all other environment variables
```

---

## 🐳 Docker Deployment

For containerized deployments on AWS, Google Cloud, or self-hosted servers.

### 1. Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set permissions for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Create Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  cms:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
      - NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
      # Add all environment variables
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - cms
    restart: unless-stopped
```

### 3. Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream cms {
        server cms:3000;
    }

    server {
        listen 80;
        server_name your-cms-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-cms-domain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        location / {
            proxy_pass http://cms;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 4. Deploy

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f cms
```

---

## 🔧 Environment Configuration

### Production Environment Variables

Create `.env.production` or configure in your deployment platform:

```env
# Firebase Configuration (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=prod_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-prod-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-prod-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-prod-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Cloudinary Configuration (Production)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_prod_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_prod_upload_preset

# CMS Configuration (Production)
NEXT_PUBLIC_CMS_URL=https://cms.yourdomain.com
NEXT_PUBLIC_TENANT_ID=default

# Security (Production)
NEXTAUTH_SECRET=your_super_secret_key_here
NEXTAUTH_URL=https://cms.yourdomain.com

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token

# Error Tracking (Optional)
SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/

# Performance Monitoring
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

### Environment-Specific Configurations

```typescript
// src/lib/config.ts
const config = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    firebase: {
      // Development Firebase config
    }
  },
  production: {
    apiUrl: 'https://cms.yourdomain.com/api',
    firebase: {
      // Production Firebase config
    }
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

---

## 🔥 Firebase Setup

### 1. Create Production Project

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Create new project (or use console)
firebase projects:create your-prod-project-id
```

### 2. Configure Authentication

```bash
# Enable Google authentication
# Go to Firebase Console > Authentication > Sign-in method
# Enable Google provider
# Add authorized domains: your-cms-domain.com
```

### 3. Setup Firestore

```bash
# Initialize Firestore
firebase firestore:indexes

# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

### 4. Firebase Configuration

```javascript
// firebase.json
{
  "firestore": {
    "rules": "firestore-final.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 5. Security Rules Deployment

```bash
# Deploy production security rules
firebase deploy --only firestore:rules --project your-prod-project-id
```

---

## 🌐 Domain & SSL

### 1. Domain Configuration

For Vercel:
```bash
# Add domain in Vercel dashboard
# Add these DNS records:
# Type: CNAME, Name: cms, Value: cname.vercel-dns.com
# Type: A, Name: @, Value: 76.76.19.61 (or current Vercel IP)
```

For custom SSL:
```bash
# Use Let's Encrypt for free SSL
certbot --nginx -d cms.yourdomain.com
```

### 2. Subdomain Strategy

```bash
# Recommended subdomain structure:
# cms.yourdomain.com - CMS interface
# api.yourdomain.com - API endpoints (optional)
# cdn.yourdomain.com - Static assets (optional)
```

---

## ⚡ Performance Optimization

### 1. Next.js Configuration

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
  // Enable static exports for better performance
  output: 'standalone',
};

export default nextConfig;
```

### 2. Image Optimization

```typescript
// src/lib/cloudinary.ts
export const getOptimizedImageUrl = (
  publicId: string,
  width: number,
  height: number,
  quality: number = 80
) => {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_fill,q_${quality},f_auto/${publicId}`;
};
```

### 3. Caching Strategy

```typescript
// src/lib/cache.ts
export const cacheConfig = {
  blogs: {
    revalidate: 300, // 5 minutes
    tags: ['blogs']
  },
  tenants: {
    revalidate: 3600, // 1 hour
    tags: ['tenants']
  }
};
```

---

## 📊 Monitoring & Logging

### 1. Error Tracking with Sentry

```bash
# Install Sentry
npm install @sentry/nextjs

# Configure Sentry
# Create sentry.client.config.js and sentry.server.config.js
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### 2. Analytics Setup

```typescript
// src/lib/analytics.ts
import { Analytics } from '@vercel/analytics/react';

export const trackEvent = (name: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    // Google Analytics
    window.gtag?.('event', name, properties);
    
    // Mixpanel
    window.mixpanel?.track(name, properties);
  }
};
```

### 3. Health Checks

```typescript
// src/app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkFirestore(),
      storage: await checkCloudinary(),
      auth: await checkAuth()
    }
  };
  
  return Response.json(health);
}
```

---

## 💾 Backup & Recovery

### 1. Firestore Backup

```bash
# Setup automated backups in Firebase Console
# Or use Cloud Scheduler + Cloud Functions

# Manual backup
gcloud firestore export gs://your-backup-bucket/$(date +%Y-%m-%d)
```

### 2. Media Backup

```bash
# Cloudinary has built-in redundancy
# Optionally sync to additional storage

# Example: Sync to AWS S3
aws s3 sync cloudinary-backup s3://your-backup-bucket/media
```

### 3. Code Backup

```bash
# Ensure code is backed up in Git
# Use multiple remotes for redundancy
git remote add backup-origin https://github.com/backup-account/pukadigital.git
git push backup-origin main
```

---

## 🔄 Deployment Pipeline

### 1. GitHub Actions (Recommended)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 2. Manual Deployment Checklist

- [ ] Test all features in staging
- [ ] Update environment variables
- [ ] Deploy database changes
- [ ] Deploy application code
- [ ] Update DNS if needed
- [ ] Test deployment
- [ ] Monitor for errors
- [ ] Update documentation

---

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build
   ```

2. **Environment Variables Not Loading**
   ```bash
   # Check variable names (must start with NEXT_PUBLIC_ for client-side)
   # Verify in deployment platform dashboard
   ```

3. **Firebase Connection Issues**
   ```bash
   # Verify project ID and API keys
   # Check authentication domain
   # Ensure billing is enabled for production
   ```

4. **Image Loading Issues**
   ```bash
   # Add domain to next.config.mjs images.domains
   # Check Cloudinary configuration
   ```

Remember to always test your deployment in a staging environment before deploying to production!