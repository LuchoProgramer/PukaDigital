# 🚀 Integración del CMS Multitenant

## 📋 Índice
1. [API Endpoints Disponibles](#api-endpoints)
2. [Integración con Next.js](#nextjs)
3. [Integración con React](#react)
4. [Integración con Vanilla JavaScript](#vanilla-js)
5. [Integración con WordPress](#wordpress)
6. [Configuración de CORS](#cors)

---

## 🔌 API Endpoints Disponibles

### Base URL
```
https://tu-cms-domain.com/api
```

### Endpoints

#### 1. Obtener todos los blogs
```
GET /api/tenants/{tenantId}/blogs?limit=10
```

#### 2. Obtener blog específico por slug
```
GET /api/tenants/{tenantId}/blogs/{slug}
```

#### 3. Buscar blogs
```
GET /api/tenants/{tenantId}/search?q=termino&limit=10
```

---

## ⚡ Integración con Next.js

### 1. Cliente personalizado
```typescript
// lib/cms-client.ts
interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface CMSResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class CMSClient {
  private baseUrl: string;
  private tenantId: string;

  constructor(baseUrl: string, tenantId: string) {
    this.baseUrl = baseUrl;
    this.tenantId = tenantId;
  }

  async getBlogs(limit: number = 10): Promise<CMSResponse<Blog[]>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/tenants/${this.tenantId}/blogs?limit=${limit}`,
        {
          next: { revalidate: 300 } // Revalidar cada 5 minutos
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: data.blogs
      };
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getBlogBySlug(slug: string): Promise<CMSResponse<Blog>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/tenants/${this.tenantId}/blogs/${slug}`,
        {
          next: { revalidate: 300 }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: data.blog
      };
    } catch (error) {
      console.error('Error fetching blog:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async searchBlogs(query: string, limit: number = 10): Promise<CMSResponse<Blog[]>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/tenants/${this.tenantId}/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        {
          next: { revalidate: 60 } // Búsquedas se revalidan cada minuto
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: data.blogs
      };
    } catch (error) {
      console.error('Error searching blogs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Exportar instancia configurada
export const cmsClient = new CMSClient(
  process.env.NEXT_PUBLIC_CMS_URL || 'https://tu-cms-domain.com',
  process.env.NEXT_PUBLIC_TENANT_ID || 'default'
);
```

### 2. Página de blog
```typescript
// app/blog/page.tsx
import { cmsClient } from '@/lib/cms-client';
import Link from 'next/link';
import Image from 'next/image';

export default async function BlogPage() {
  const response = await cmsClient.getBlogs(20);
  
  if (!response.success || !response.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
        <p className="text-red-600">Error loading blogs: {response.error}</p>
      </div>
    );
  }

  const blogs = response.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <article key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {blog.featuredImage && (
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
            )}
            
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                <Link 
                  href={`/blog/${blog.slug}`}
                  className="hover:text-blue-600"
                >
                  {blog.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {blog.excerpt}
              </p>
              
              <div className="text-sm text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString()}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
```

### 3. Página individual de blog
```typescript
// app/blog/[slug]/page.tsx
import { cmsClient } from '@/lib/cms-client';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const response = await cmsClient.getBlogBySlug(params.slug);
  
  if (!response.success || !response.data) {
    notFound();
  }

  const blog = response.data;

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        
        <div className="text-gray-600 mb-6">
          Publicado el {new Date(blog.createdAt).toLocaleDateString()}
        </div>
        
        {blog.featuredImage && (
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            width={800}
            height={400}
            className="w-full h-96 object-cover rounded-lg"
          />
        )}
      </header>
      
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  );
}

// Generar metadatos dinámicos
export async function generateMetadata({ params }: BlogPageProps) {
  const response = await cmsClient.getBlogBySlug(params.slug);
  
  if (!response.success || !response.data) {
    return {
      title: 'Blog no encontrado',
    };
  }

  const blog = response.data;

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  };
}
```

---

## ⚛️ Integración con React

### 1. Hook personalizado
```typescript
// hooks/useCMS.ts
import { useState, useEffect } from 'react';

const CMS_BASE_URL = process.env.REACT_APP_CMS_URL || 'https://tu-cms-domain.com';
const TENANT_ID = process.env.REACT_APP_TENANT_ID || 'default';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseBlogsResult {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBlogs(limit: number = 10): UseBlogsResult {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${CMS_BASE_URL}/api/tenants/${TENANT_ID}/blogs?limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        throw new Error(data.error || 'Failed to fetch blogs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [limit]);

  return {
    blogs,
    loading,
    error,
    refetch: fetchBlogs
  };
}

export function useBlog(slug: string) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `${CMS_BASE_URL}/api/tenants/${TENANT_ID}/blogs/${slug}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setBlog(data.blog);
        } else {
          throw new Error(data.error || 'Failed to fetch blog');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  return { blog, loading, error };
}
```

### 2. Componente de lista de blogs
```jsx
// components/BlogList.jsx
import React from 'react';
import { useBlogs } from '../hooks/useCMS';

export default function BlogList() {
  const { blogs, loading, error, refetch } = useBlogs(10);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading blogs</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={refetch}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm font-medium"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <article key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {blog.featuredImage && (
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
          )}
          
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2 line-clamp-2">
              <a 
                href={`/blog/${blog.slug}`}
                className="hover:text-blue-600"
              >
                {blog.title}
              </a>
            </h2>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {blog.excerpt}
            </p>
            
            <div className="text-sm text-gray-500">
              {new Date(blog.createdAt).toLocaleDateString()}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
```

---

## 🌐 Integración con Vanilla JavaScript

### 1. Cliente simple
```javascript
// js/cms-client.js
class SimpleCMSClient {
  constructor(baseUrl, tenantId) {
    this.baseUrl = baseUrl;
    this.tenantId = tenantId;
  }

  async getBlogs(limit = 10) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/tenants/${this.tenantId}/blogs?limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.success ? data.blogs : [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  }

  async getBlogBySlug(slug) {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/tenants/${this.tenantId}/blogs/${slug}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.success ? data.blog : null;
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  }
}

// Inicializar cliente
const cmsClient = new SimpleCMSClient(
  'https://tu-cms-domain.com',
  'default'
);
```

### 2. Renderizado de blogs
```javascript
// js/blog-renderer.js
async function renderBlogs() {
  const container = document.getElementById('blog-container');
  
  // Mostrar loading
  container.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Cargando blogs...</p>
    </div>
  `;

  try {
    const blogs = await cmsClient.getBlogs(6);
    
    if (blogs.length === 0) {
      container.innerHTML = '<p>No hay blogs disponibles.</p>';
      return;
    }

    const blogsHTML = blogs.map(blog => `
      <article class="blog-card">
        ${blog.featuredImage ? `
          <img src="${blog.featuredImage}" alt="${blog.title}" class="blog-image">
        ` : ''}
        
        <div class="blog-content">
          <h2 class="blog-title">
            <a href="/blog/${blog.slug}">${blog.title}</a>
          </h2>
          
          <p class="blog-excerpt">${blog.excerpt}</p>
          
          <div class="blog-meta">
            ${new Date(blog.createdAt).toLocaleDateString()}
          </div>
        </div>
      </article>
    `).join('');

    container.innerHTML = `
      <div class="blog-grid">
        ${blogsHTML}
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="error">
        <p>Error cargando blogs: ${error.message}</p>
        <button onclick="renderBlogs()">Intentar de nuevo</button>
      </div>
    `;
  }
}

// Renderizar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', renderBlogs);
```

### 3. CSS básico
```css
/* css/blog-styles.css */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.blog-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
}

.blog-card:hover {
  transform: translateY(-2px);
}

.blog-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.blog-content {
  padding: 1.5rem;
}

.blog-title a {
  color: #333;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

.blog-title a:hover {
  color: #3b82f6;
}

.blog-excerpt {
  color: #666;
  margin: 1rem 0;
  line-height: 1.6;
}

.blog-meta {
  color: #999;
  font-size: 0.875rem;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
}

.error button {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}
```

---

## 🔧 Configuración de CORS

Para producción, necesitas configurar CORS apropiadamente:

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Lista de dominios permitidos
  const allowedOrigins = [
    'https://tu-sitio-web.com',
    'https://otro-sitio.com',
    'http://localhost:3000', // Para desarrollo
  ];

  const origin = request.headers.get('origin');
  
  // Verificar si el origen está permitido
  if (origin && allowedOrigins.includes(origin)) {
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

---

## 📱 Ejemplo de Uso en HTML Simple

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Blog</title>
    <link rel="stylesheet" href="css/blog-styles.css">
</head>
<body>
    <header>
        <h1>Mi Blog</h1>
    </header>
    
    <main>
        <div id="blog-container">
            <!-- Los blogs se cargarán aquí -->
        </div>
    </main>
    
    <script src="js/cms-client.js"></script>
    <script src="js/blog-renderer.js"></script>
</body>
</html>
```

Con esta documentación tienes todo lo necesario para integrar tu CMS multitenant en cualquier tipo de sitio web. ¿Quieres que profundice en alguna integración específica o tienes alguna pregunta sobre la implementación?