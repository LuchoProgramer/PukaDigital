# Puka Digital - Multitenant Headless CMS

A modern, scalable multitenant headless CMS built with Next.js, TypeScript, and Firebase. Perfect for marketing teams managing content across multiple projects and websites.

## Project Overview

This is a production-ready multitenant CMS that allows multiple organizations to manage their content independently while sharing the same codebase and infrastructure.

### Key Features
- **Multitenant Architecture**: Complete tenant isolation with role-based access control
- **Rich Content Editor**: CKEditor 5 with custom blocks for flexible content creation
- **Media Management**: Cloudinary integration for optimized image and video handling
- **RESTful APIs**: Public APIs for content consumption by external websites
- **Authentication**: Firebase Auth with Google login and tenant-specific permissions
- **SEO Optimized**: Automatic meta tags, structured data, and optimization tools

### Tech Stack
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS
- Backend: Firebase/Firestore, Firebase Auth
- Storage: Cloudinary
- Editor: CKEditor 5
- Deployment: Vercel-ready

## Architecture

### Multitenant Structure
```
/tenants/{tenantId}/blogs/{blogId}
/tenants/{tenantId}/users/{userId}
```

### User Roles
- **Admin**: Full tenant management and user control
- **Editor**: Content creation and management
- **Viewer**: Read-only access to content

### API Endpoints
- `GET /api/tenants/{tenantId}/blogs` - List blogs
- `GET /api/tenants/{tenantId}/blogs/{slug}` - Get blog by slug
- `GET /api/tenants/{tenantId}/search` - Search blogs

## Development Guidelines

### File Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable React components
- `src/context/` - React contexts for global state
- `src/lib/` - Utilities and Firebase services
- `src/cms/` - CMS-specific components
- `docs/` - Comprehensive documentation

### Key Services
- `tenantService.ts` - Tenant and user management
- `firebase.ts` - Blog CRUD operations with multitenant support
- `migration.ts` - Safe data migration tools

### Security
- Firestore security rules enforce tenant isolation
- Role-based access control at application level
- CORS-enabled APIs for external integration

## Current Status

✅ **Completed Features:**
- Complete multitenant architecture implementation
- User authentication with Google OAuth
- Rich content management with CKEditor 5
- Image/video upload and optimization
- Role-based access control (Admin, Editor, Viewer)
- Public REST APIs for content consumption
- Tenant management panel
- Data migration tools
- Comprehensive documentation

✅ **Successfully Migrated:**
- 1 admin user (luchoviteri1990@gmail.com)
- 4 blog posts to multitenant structure
- All CMS components updated for multitenant operation

## Integration Examples

The CMS can be integrated into any website using:

1. **Next.js/React**: TypeScript client with hooks and components
2. **Vanilla JavaScript**: Simple client for any website
3. **REST API**: Direct HTTP calls for any platform
4. **WordPress**: PHP integration examples

## Documentation

Complete documentation available in the project:
- [API Reference](../docs/api-reference.md)
- [Architecture Overview](../docs/architecture.md)
- [Deployment Guide](../docs/deployment.md)
- [User Management](../docs/user-management.md)
- [Content Management](../docs/content-management.md)
- [Integration Guide](../cms-integration-examples/integration-guide.md)

## Quick Start

1. Clone and install dependencies
2. Configure Firebase and Cloudinary
3. Run migration to create default tenant
4. Start creating content at `/cms`
5. Consume content via APIs or integration examples

This CMS is production-ready and actively powers content across multiple websites and marketing teams.