# 📡 API Reference

Complete reference for Puka Digital CMS REST APIs.

## Base URL

```
Production: https://your-cms-domain.com/api
Development: http://localhost:3000/api
```

## Authentication

### Required Headers
```http
Authorization: Bearer <firebase-jwt-token>
Content-Type: application/json
```

### Authentication Flow
1. Sign in with Firebase Auth
2. Get ID token: `await user.getIdToken()`
3. Include token in Authorization header

---

## 📝 Blogs API

### Get All Blogs
Retrieve paginated list of blogs for a tenant.

```http
GET /api/tenants/{tenantId}/blogs
```

**Parameters:**
- `tenantId` (string, required): Tenant identifier
- `limit` (number, optional): Number of blogs to return (default: 10, max: 100)

**Example Request:**
```bash
curl "https://your-cms.com/api/tenants/default/blogs?limit=20"
```

**Example Response:**
```json
{
  "success": true,
  "blogs": [
    {
      "id": "blog-123",
      "title": "Getting Started with Next.js",
      "content": "<p>Complete blog content...</p>",
      "excerpt": "Learn how to build modern web applications...",
      "slug": "getting-started-with-nextjs",
      "featuredImage": "https://res.cloudinary.com/...",
      "alt": "Next.js tutorial",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z",
      "tenantId": "default",
      "author": {
        "name": "Luis Viteri",
        "email": "luis@example.com"
      },
      "blocks": [
        {
          "type": "text",
          "content": "<p>Introduction paragraph...</p>"
        },
        {
          "type": "image",
          "src": "https://res.cloudinary.com/...",
          "alt": "Tutorial screenshot"
        }
      ]
    }
  ],
  "count": 1,
  "tenantId": "default"
}
```

### Get Blog by Slug
Retrieve a specific blog by its slug.

```http
GET /api/tenants/{tenantId}/blogs/{slug}
```

**Parameters:**
- `tenantId` (string, required): Tenant identifier
- `slug` (string, required): Blog slug

**Example Request:**
```bash
curl "https://your-cms.com/api/tenants/default/blogs/getting-started-with-nextjs"
```

**Example Response:**
```json
{
  "success": true,
  "blog": {
    "id": "blog-123",
    "title": "Getting Started with Next.js",
    "content": "<p>Complete blog content...</p>",
    "excerpt": "Learn how to build modern web applications...",
    "slug": "getting-started-with-nextjs",
    "featuredImage": "https://res.cloudinary.com/...",
    "alt": "Next.js tutorial",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z",
    "tenantId": "default",
    "author": {
      "name": "Luis Viteri",
      "email": "luis@example.com"
    }
  },
  "tenantId": "default"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Blog not found"
}
```

### Search Blogs
Search blogs by title and content.

```http
GET /api/tenants/{tenantId}/search
```

**Parameters:**
- `tenantId` (string, required): Tenant identifier
- `q` (string, required): Search query
- `limit` (number, optional): Number of results (default: 10, max: 50)

**Example Request:**
```bash
curl "https://your-cms.com/api/tenants/default/search?q=nextjs&limit=5"
```

**Example Response:**
```json
{
  "success": true,
  "blogs": [
    {
      "id": "blog-123",
      "title": "Getting Started with Next.js",
      "excerpt": "Learn how to build modern web applications...",
      "slug": "getting-started-with-nextjs",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "count": 1,
  "searchTerm": "nextjs",
  "tenantId": "default"
}
```

---

## 🏢 Tenants API (Protected)

### Create Tenant
Create a new tenant with admin user.

```http
POST /api/tenants
```

**Required Headers:**
```http
Authorization: Bearer <firebase-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Marketing Team",
  "domain": "marketing.company.com",
  "plan": "PRO",
  "adminEmail": "admin@company.com",
  "adminName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "tenant": {
    "id": "tenant-456",
    "name": "Marketing Team",
    "domain": "marketing.company.com",
    "plan": "PRO",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "users": [
      {
        "email": "admin@company.com",
        "name": "John Doe",
        "role": "admin"
      }
    ]
  }
}
```

### Get Tenant Details
Retrieve tenant information and users.

```http
GET /api/tenants/{tenantId}
```

**Required Headers:**
```http
Authorization: Bearer <firebase-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "tenant": {
    "id": "tenant-456",
    "name": "Marketing Team",
    "domain": "marketing.company.com",
    "plan": "PRO",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "users": [
      {
        "email": "admin@company.com",
        "name": "John Doe",
        "role": "admin"
      }
    ]
  }
}
```

---

## 👥 User Management API (Protected)

### Add User to Tenant
Add a user to a tenant with specific role.

```http
POST /api/tenants/{tenantId}/users
```

**Required Headers:**
```http
Authorization: Bearer <firebase-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "editor@company.com",
  "name": "Content Editor",
  "role": "editor"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User added successfully",
  "user": {
    "email": "editor@company.com",
    "name": "Content Editor",
    "role": "editor",
    "addedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### Remove User from Tenant
Remove a user from a tenant.

```http
DELETE /api/tenants/{tenantId}/users/{userEmail}
```

**Required Headers:**
```http
Authorization: Bearer <firebase-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "User removed successfully"
}
```

---

## 📊 Blog Management API (Protected)

### Create Blog
Create a new blog post.

```http
POST /api/tenants/{tenantId}/blogs
```

**Required Headers:**
```http
Authorization: Bearer <firebase-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Getting Started with Next.js",
  "content": "<p>Complete blog content...</p>",
  "excerpt": "Learn how to build modern web applications...",
  "featuredImage": "https://res.cloudinary.com/...",
  "alt": "Next.js tutorial",
  "blocks": [
    {
      "type": "text",
      "content": "<p>Introduction paragraph...</p>"
    },
    {
      "type": "image",
      "src": "https://res.cloudinary.com/...",
      "alt": "Tutorial screenshot"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "blog": {
    "id": "blog-789",
    "title": "Getting Started with Next.js",
    "slug": "getting-started-with-nextjs",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### Update Blog
Update an existing blog post.

```http
PUT /api/tenants/{tenantId}/blogs/{blogId}
```

**Required Headers:**
```http
Authorization: Bearer <firebase-jwt-token>
Content-Type: application/json
```

**Request Body:** Same as Create Blog

**Response:**
```json
{
  "success": true,
  "blog": {
    "id": "blog-789",
    "title": "Getting Started with Next.js (Updated)",
    "slug": "getting-started-with-nextjs",
    "updatedAt": "2025-01-15T11:00:00.000Z"
  }
}
```

### Delete Blog
Delete a blog post.

```http
DELETE /api/tenants/{tenantId}/blogs/{blogId}
```

**Required Headers:**
```http
Authorization: Bearer <firebase-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

## 🚨 Error Responses

### Common Error Codes

#### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request parameters",
  "message": "Tenant ID is required"
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Insufficient permissions for this operation"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "error": "Not found",
  "message": "Blog not found"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## 🔧 Rate Limiting

- **Public APIs**: 100 requests per minute per IP
- **Authenticated APIs**: 1000 requests per minute per user
- **Search API**: 50 requests per minute per IP

Rate limit headers included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642608000
```

---

## 📝 Data Types

### Blog Object
```typescript
interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  alt?: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  tenantId: string;
  author: {
    name: string;
    email: string;
  };
  blocks?: ContentBlock[];
}
```

### Content Block Object
```typescript
interface ContentBlock {
  type: 'text' | 'image' | 'video';
  content?: string; // For text blocks
  src?: string;     // For image/video blocks
  alt?: string;     // For image blocks
}
```

### Tenant Object
```typescript
interface Tenant {
  id: string;
  name: string;
  domain?: string;
  plan: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
  createdAt: string; // ISO 8601
  users: TenantUser[];
}
```

### Tenant User Object
```typescript
interface TenantUser {
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  addedAt?: string; // ISO 8601
}
```

---

## 🌐 CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS) with the following configuration:

- **Allowed Origins**: Configurable per environment
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization

For production, specify allowed origins in environment variables:
```env
CORS_ALLOWED_ORIGINS=https://yoursite.com,https://anotherdomain.com
```