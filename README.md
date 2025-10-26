# 🚀 Puka Digital - Multitenant Headless CMS

A modern, scalable multitenant headless CMS built with Next.js, TypeScript, and Firebase. Perfect for marketing teams managing content across multiple projects and websites.

## ✨ Features

### 🏢 **Multitenant Architecture**
- Complete tenant isolation with `/tenants/{tenantId}/` structure
- Role-based access control (Admin, Editor, Viewer)
- Subscription plans (FREE, STARTER, PRO, ENTERPRISE)
- User management per tenant

### 📝 **Content Management**
- Rich text editing with CKEditor 5
- Image upload with Cloudinary integration
- Video embedding (YouTube, Vimeo, TikTok)
- SEO optimization tools
- Automatic slug generation
- Real-time preview

### 🔐 **Authentication & Security**
- Firebase Authentication with Google login
- Tenant-specific user permissions
- Secure Firestore rules with tenant isolation
- CORS-enabled API endpoints

### 🌐 **API & Integration**
- RESTful APIs for external consumption
- Multiple integration patterns (Next.js, React, Vanilla JS)
- Real-time data synchronization
- Webhook support ready

### 🎨 **User Experience**
- Dark/Light mode support
- Responsive design with Tailwind CSS
- Intuitive CMS interface
- Real-time collaboration ready

## �️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Firebase/Firestore, Firebase Auth
- **Storage**: Cloudinary
- **Editor**: CKEditor 5
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/LuchoProgramer/pukadigital.git
cd pukadigital
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# CMS Configuration
NEXT_PUBLIC_CMS_URL=http://localhost:3000
NEXT_PUBLIC_TENANT_ID=default
```

### 3. Firebase Setup
1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication with Google provider
3. Create Firestore database
4. Deploy security rules from `firestore-final.rules`

### 4. Run Development Server
```bash
npm run dev
```

### 5. Initial Setup
1. Visit `http://localhost:3000/admin/login` to authenticate
2. Access `http://localhost:3000/admin/migration` to create default tenant
3. Start using the CMS at `http://localhost:3000/cms`

## 📚 Documentation

### 🏗️ **Architecture**
- [Multitenant Structure](./docs/architecture.md)
- [Database Schema](./docs/database-schema.md)
- [Security Model](./docs/security.md)

### 🔧 **Development**
- [API Reference](./docs/api-reference.md)
- [Integration Guide](./cms-integration-examples/integration-guide.md)
- [Deployment Guide](./docs/deployment.md)

### 👥 **Usage**
- [Admin Panel Guide](./docs/admin-guide.md)
- [Content Management](./docs/content-management.md)
- [User Management](./docs/user-management.md)

## 🌐 API Endpoints

### Authentication Required
- `GET /cms/*` - CMS Interface
- `POST /api/blogs` - Create blog
- `PUT /api/blogs/{id}` - Update blog
- `DELETE /api/blogs/{id}` - Delete blog

### Public APIs
- `GET /api/tenants/{tenantId}/blogs` - List blogs
- `GET /api/tenants/{tenantId}/blogs/{slug}` - Get blog by slug
- `GET /api/tenants/{tenantId}/search` - Search blogs

## 🔗 Integration Examples

### Next.js Integration
```typescript
import { cmsClient } from '@/lib/cms-client';

export default async function BlogPage() {
  const { blogs } = await cmsClient.getBlogs(10);
  
  return (
    <div>
      {blogs.map(blog => (
        <article key={blog.id}>
          <h2>{blog.title}</h2>
          <p>{blog.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### React Hook
```typescript
import { useBlogs } from '@/hooks/useCMS';

function BlogList() {
  const { blogs, loading, error } = useBlogs(10);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {blogs.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
```

### Vanilla JavaScript
```javascript
const cmsClient = new SimpleCMSClient('https://your-cms.com', 'your-tenant');
const blogs = await cmsClient.getBlogs(10);
```

## 🏢 Multitenant Usage

### Creating Tenants
```typescript
import { createTenant } from '@/lib/tenantService';

const tenant = await createTenant({
  name: "Marketing Team",
  domain: "marketing.company.com",
  plan: "PRO",
  adminEmail: "admin@company.com"
});
```

### Managing Users
```typescript
import { addUserToTenant } from '@/lib/tenantService';

await addUserToTenant(tenantId, {
  email: "editor@company.com",
  role: "editor",
  name: "Content Editor"
});
```

## � Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Environment Variables for Production
```env
# Add to Vercel environment variables
NEXT_PUBLIC_FIREBASE_API_KEY=prod_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=prod_project_id
NEXT_PUBLIC_CMS_URL=https://your-cms-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@pukadigital.com
- 📖 Documentation: [docs.pukadigital.com](https://docs.pukadigital.com)
- 🐛 Issues: [GitHub Issues](https://github.com/LuchoProgramer/pukadigital/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/LuchoProgramer/pukadigital/discussions)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [CKEditor](https://ckeditor.com/) - Rich text editor
- [Cloudinary](https://cloudinary.com/) - Media management

---

Made with ❤️ by [Luis Viteri](https://github.com/LuchoProgramer)