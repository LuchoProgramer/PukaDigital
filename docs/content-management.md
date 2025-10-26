# 📝 Content Management Guide

Complete guide for creating, editing, and managing content in Puka Digital CMS.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Creating Blog Posts](#creating-blog-posts)
3. [Rich Text Editor](#rich-text-editor)
4. [Media Management](#media-management)
5. [SEO Optimization](#seo-optimization)
6. [Content Organization](#content-organization)
7. [Publishing Workflow](#publishing-workflow)
8. [Best Practices](#best-practices)

---

## 🚀 Getting Started

### Accessing the CMS

1. **Login**: Navigate to `/admin/login` and sign in with Google
2. **CMS Interface**: Access the main CMS at `/cms`
3. **Dashboard**: View your content overview and statistics

### CMS Interface Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CMS Dashboard                        │
├─────────────────┬───────────────────────────────────────┤
│   Navigation    │            Main Content Area          │
│                 │                                       │
│ • Dashboard     │  ┌─ Blog Statistics ─┐                │
│ • Blogs         │  │ Total: 12 blogs   │                │
│   - All Blogs   │  │ Published: 10     │                │
│   - Create New  │  │ Drafts: 2         │                │
│   - Drafts      │  └───────────────────┘                │
│ • Media         │                                       │
│ • Settings      │  ┌─ Recent Blogs ──────────────────┐  │
│ • Users         │  │ • Getting Started with Next.js  │  │
│                 │  │ • SEO Best Practices           │  │
│                 │  │ • Content Marketing Tips       │  │
│                 │  └─────────────────────────────────┘  │
└─────────────────┴───────────────────────────────────────┘
```

---

## ✍️ Creating Blog Posts

### Step 1: Create New Blog

1. Navigate to `/cms/blogs/create`
2. Or click "Create New Blog" from the dashboard
3. You'll see the blog creation interface

### Step 2: Fill Basic Information

```typescript
interface BlogForm {
  title: string;           // Required: Blog title
  excerpt: string;         // Required: Short description
  content: string;         // Required: Main content
  featuredImage?: string;  // Optional: Main image
  alt?: string;           // Optional: Image alt text
  status: 'draft' | 'published';
}
```

#### Title Guidelines
- **Length**: 50-60 characters for SEO
- **Keywords**: Include primary keywords naturally
- **Clarity**: Make it clear and compelling
- **Uniqueness**: Ensure uniqueness within your tenant

#### Excerpt Best Practices
- **Length**: 150-160 characters
- **Purpose**: Summarize the main value
- **Keywords**: Include relevant keywords
- **Call to Action**: Entice readers to continue

### Step 3: Add Content with Rich Editor

The CMS uses CKEditor 5 with custom blocks for flexible content creation.

#### Available Content Blocks

1. **Text Block**: Rich text with formatting
2. **Image Block**: Optimized images with captions
3. **Video Block**: Embedded videos (YouTube, Vimeo, TikTok)
4. **Code Block**: Syntax-highlighted code (future feature)
5. **Quote Block**: Styled blockquotes (future feature)

---

## 📝 Rich Text Editor

### Toolbar Features

```
┌─────────────────────────────────────────────────────────┐
│ [B] [I] [U] │ [H1][H2][H3] │ [•][1.] │ [🔗] [📷] [📹] │
└─────────────────────────────────────────────────────────┘
```

#### Formatting Options
- **Bold**: Ctrl+B / Cmd+B
- **Italic**: Ctrl+I / Cmd+I
- **Underline**: Ctrl+U / Cmd+U
- **Headings**: H1, H2, H3, H4, H5, H6
- **Lists**: Bulleted and numbered
- **Links**: Internal and external linking

#### Advanced Features
- **Tables**: Create and edit tables
- **Blockquotes**: Styled quote blocks
- **Code Snippets**: Inline code formatting
- **Special Characters**: Insert symbols and emojis

### Content Structure Best Practices

```html
<!-- Recommended blog structure -->
<h1>Main Title (Auto-generated from title field)</h1>

<p>Opening paragraph that hooks the reader...</p>

<h2>Section 1: Introduction</h2>
<p>Content for section 1...</p>

<h3>Subsection 1.1</h3>
<p>More detailed content...</p>

<h2>Section 2: Main Content</h2>
<p>Main value content...</p>

<h2>Conclusion</h2>
<p>Summary and call to action...</p>
```

### Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Bold | Ctrl+B | Cmd+B |
| Italic | Ctrl+I | Cmd+I |
| Underline | Ctrl+U | Cmd+U |
| Link | Ctrl+K | Cmd+K |
| Save Draft | Ctrl+S | Cmd+S |
| Heading 1 | Ctrl+Alt+1 | Cmd+Alt+1 |
| Heading 2 | Ctrl+Alt+2 | Cmd+Alt+2 |
| Bulleted List | Ctrl+Shift+8 | Cmd+Shift+8 |
| Numbered List | Ctrl+Shift+7 | Cmd+Shift+7 |

---

## 🖼️ Media Management

### Image Upload Process

1. **Click Image Button** in editor or use Image Block
2. **Select Upload Method**:
   - Drag & drop files
   - Click to browse files
   - Paste from clipboard (Ctrl+V / Cmd+V)

3. **Image Processing**: Automatic optimization via Cloudinary
   - Format conversion (WebP, AVIF)
   - Compression and quality optimization
   - Multiple size generation

### Supported Image Formats

- **JPEG/JPG**: Best for photos
- **PNG**: Best for graphics with transparency
- **WebP**: Modern format with excellent compression
- **SVG**: Vector graphics (limited support)
- **GIF**: Animated images (up to 10MB)

### Image Optimization

```typescript
// Automatic transformations applied
const imageTransformations = {
  format: 'auto',           // Auto-select best format
  quality: 'auto:best',     // Optimize quality
  fetch_format: 'auto',     // Browser-specific formats
  dpr: 'auto',             // Device pixel ratio
  responsive: true,         // Generate multiple sizes
  secure: true             // HTTPS delivery
};
```

### Video Embedding

#### Supported Platforms
- **YouTube**: Full video and shorts support
- **Vimeo**: Standard and premium videos
- **TikTok**: TikTok videos and compilations
- **Wistia**: Business video platform (future)
- **Loom**: Screen recordings (future)

#### Video Block Usage
1. Click "Add Video Block"
2. Paste video URL
3. Video automatically embeds with responsive player
4. Configure player options (autoplay, controls, etc.)

#### Video URL Examples
```
YouTube: https://www.youtube.com/watch?v=VIDEO_ID
YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
Vimeo: https://vimeo.com/VIDEO_ID
TikTok: https://www.tiktok.com/@user/video/VIDEO_ID
```

---

## 🔍 SEO Optimization

### Automatic SEO Features

The CMS automatically optimizes content for search engines:

#### Meta Tags Generation
```html
<!-- Auto-generated meta tags -->
<title>Blog Title | Your Site Name</title>
<meta name="description" content="Blog excerpt...">
<meta name="keywords" content="extracted,keywords,from,content">

<!-- Open Graph tags -->
<meta property="og:title" content="Blog Title">
<meta property="og:description" content="Blog excerpt...">
<meta property="og:image" content="featured-image-url">
<meta property="og:type" content="article">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Blog Title">
<meta name="twitter:description" content="Blog excerpt...">
<meta name="twitter:image" content="featured-image-url">
```

#### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Blog Title",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "datePublished": "2025-01-15T10:00:00Z",
  "dateModified": "2025-01-15T12:00:00Z",
  "image": "featured-image-url",
  "publisher": {
    "@type": "Organization",
    "name": "Your Organization"
  }
}
```

### SEO Best Practices

#### 1. Title Optimization
- **Length**: 50-60 characters
- **Keywords**: Include primary keyword early
- **Uniqueness**: Each blog should have unique title
- **Readability**: Clear and compelling

#### 2. Excerpt/Meta Description
- **Length**: 150-160 characters
- **Keywords**: Include related keywords
- **Value Proposition**: Clearly state the benefit
- **Call to Action**: Encourage clicks

#### 3. Content Structure
- **Headings**: Use H1, H2, H3 hierarchy
- **Keywords**: Natural keyword distribution
- **Internal Links**: Link to related content
- **External Links**: Link to authoritative sources

#### 4. Image SEO
- **Alt Text**: Descriptive alt text for all images
- **File Names**: Use descriptive file names
- **Image Size**: Optimize for web (Cloudinary handles this)
- **Captions**: Add relevant captions

### SEO Checklist

```typescript
interface SEOChecklist {
  title: {
    length: boolean;        // 50-60 characters
    keywords: boolean;      // Contains primary keyword
    unique: boolean;        // Unique within site
  };
  excerpt: {
    length: boolean;        // 150-160 characters
    compelling: boolean;    // Entices clicks
    keywords: boolean;      // Contains keywords
  };
  content: {
    structure: boolean;     // Proper heading hierarchy
    length: boolean;        // Minimum 300 words
    keywords: boolean;      // Natural keyword usage
    links: boolean;         // Internal/external links
  };
  media: {
    altText: boolean;       // All images have alt text
    optimization: boolean;  // Images optimized
    captions: boolean;      // Relevant captions
  };
}
```

---

## 📁 Content Organization

### Categories and Tags (Future Feature)

```typescript
interface ContentOrganization {
  categories: Category[];   // Hierarchical organization
  tags: Tag[];             // Flexible labeling
  series: Series[];        // Multi-part content
  collections: Collection[]; // Curated groups
}

interface Category {
  id: string;
  name: string;
  slug: string;
  parent?: string;         // For nested categories
  description?: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;          // For visual organization
}
```

### Content Search and Filtering

#### Available Filters
- **Status**: Draft, Published, Archived
- **Author**: Filter by content creator
- **Date Range**: Created or modified dates
- **Content Type**: Blog, Page, News (future)

#### Search Functionality
```typescript
// Search across multiple fields
const searchContent = async (query: string) => {
  const results = await searchBlogs(tenantId, query, {
    fields: ['title', 'excerpt', 'content'],
    limit: 20,
    filters: {
      status: 'published',
      author: currentUser.uid
    }
  });
  
  return results;
};
```

---

## 🚀 Publishing Workflow

### Content Lifecycle

```
Draft → Review → Published → Archived
  ↑        ↓         ↓
  └── Edit ←── Update ←┘
```

### Status Types

#### 1. **Draft**
- Work in progress
- Not visible to public
- Can be edited by author and editors
- Auto-saved every 30 seconds

#### 2. **Published**
- Live content visible to public
- Available via API endpoints
- Indexed by search engines
- Can be updated (creates new version)

#### 3. **Archived**
- Removed from public view
- Preserved for historical purposes
- Can be restored to published status
- SEO redirects maintained

### Publishing Process

```typescript
const publishBlog = async (blogId: string) => {
  try {
    // Validate content
    const validation = await validateBlogContent(blogId);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Update status
    await updateBlog(tenantId, blogId, {
      status: 'published',
      publishedAt: new Date(),
      updatedAt: new Date()
    });
    
    // Trigger SEO indexing (future)
    await requestIndexing(blogUrl);
    
    console.log('Blog published successfully');
  } catch (error) {
    console.error('Publishing failed:', error);
  }
};
```

### Content Validation

```typescript
interface ContentValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const validateBlogContent = (blog: Blog): ContentValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields
  if (!blog.title?.trim()) errors.push('Title is required');
  if (!blog.excerpt?.trim()) errors.push('Excerpt is required');
  if (!blog.content?.trim()) errors.push('Content is required');
  
  // SEO validations
  if (blog.title && blog.title.length > 60) {
    warnings.push('Title is longer than 60 characters');
  }
  
  if (blog.excerpt && blog.excerpt.length > 160) {
    warnings.push('Excerpt is longer than 160 characters');
  }
  
  // Content quality
  if (blog.content && blog.content.length < 300) {
    warnings.push('Content is shorter than recommended (300+ words)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
```

---

## 💡 Best Practices

### Content Creation

#### 1. **Planning Your Content**
- Define clear objectives
- Research your audience
- Plan content structure
- Prepare supporting media

#### 2. **Writing Guidelines**
- **Voice**: Maintain consistent brand voice
- **Tone**: Match your audience expectations
- **Structure**: Use clear headings and paragraphs
- **Value**: Always provide value to readers

#### 3. **Content Length**
- **Minimum**: 300 words for SEO
- **Optimal**: 1,500-2,500 words for comprehensive coverage
- **Maximum**: No limit, but prioritize quality over quantity

### Media Best Practices

#### Image Guidelines
- **Resolution**: Minimum 1200px width for featured images
- **Format**: Use JPEG for photos, PNG for graphics
- **Size**: Under 5MB (Cloudinary will optimize)
- **Alt Text**: Always provide descriptive alt text

#### Video Guidelines
- **Platform**: Use established platforms (YouTube, Vimeo)
- **Quality**: Minimum 720p resolution
- **Length**: Keep engaging throughout
- **Captions**: Always include closed captions

### Performance Optimization

#### Content Performance
```typescript
// Monitor content performance
const trackContentMetrics = {
  loadTime: 'Time to first contentful paint',
  engagement: 'Time on page, scroll depth',
  conversions: 'Goal completions from content',
  social: 'Shares, likes, comments'
};
```

#### Technical Performance
- **Images**: Automatic Cloudinary optimization
- **Caching**: Browser and CDN caching
- **Compression**: Gzip compression enabled
- **Lazy Loading**: Images load as needed

### Accessibility

#### Content Accessibility
- **Headings**: Proper heading hierarchy (H1 → H2 → H3)
- **Alt Text**: Descriptive text for all images
- **Links**: Descriptive link text (avoid "click here")
- **Color**: Sufficient color contrast

#### Technical Accessibility
- **Keyboard Navigation**: All features keyboard accessible
- **Screen Readers**: Semantic HTML structure
- **Focus Management**: Clear focus indicators
- **ARIA Labels**: Proper ARIA attributes

### Content Maintenance

#### Regular Tasks
- **Review Old Content**: Update outdated information
- **Check Links**: Verify all links still work
- **Update Images**: Replace low-quality images
- **SEO Audit**: Review and improve SEO elements

#### Content Lifecycle Management
```typescript
const contentMaintenanceTasks = {
  monthly: [
    'Review top-performing content',
    'Update outdated information',
    'Check for broken links',
    'Optimize underperforming content'
  ],
  quarterly: [
    'Comprehensive SEO audit',
    'Content gap analysis',
    'Competitor content review',
    'Strategy refinement'
  ],
  annually: [
    'Complete content inventory',
    'Archive outdated content',
    'Platform migration planning',
    'ROI analysis'
  ]
};
```

---

Remember: Great content is the foundation of successful digital marketing. Focus on providing value to your audience, and the technical aspects will enhance that value!