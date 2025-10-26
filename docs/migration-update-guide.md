# 🔄 Migration & Update Guide

Comprehensive guide for migrating data, updating the CMS, and handling version upgrades.

## 📋 Table of Contents

1. [Migration Overview](#migration-overview)
2. [Data Migration](#data-migration)
3. [Version Updates](#version-updates)
4. [Feature Upgrades](#feature-upgrades)
5. [Database Schema Changes](#database-schema-changes)
6. [Rollback Procedures](#rollback-procedures)
7. [Best Practices](#best-practices)

---

## 🌟 Migration Overview

### Migration Philosophy

Our migration system follows these principles:

- **Zero Downtime**: Migrations run without interrupting service
- **Reversible**: All migrations can be rolled back safely
- **Incremental**: Changes are applied in small, manageable steps
- **Validated**: All migrations include validation and testing
- **Logged**: Complete audit trail of all changes

### Migration Types

```typescript
enum MigrationType {
  DATA_STRUCTURE = 'data_structure',    // Schema changes
  CONTENT_MIGRATION = 'content_migration', // Moving/transforming content
  FEATURE_UPGRADE = 'feature_upgrade',   // Adding new features
  SECURITY_UPDATE = 'security_update',   // Security enhancements
  PERFORMANCE = 'performance',           // Performance optimizations
  CLEANUP = 'cleanup'                    // Removing deprecated data
}

interface Migration {
  id: string;
  version: string;
  type: MigrationType;
  description: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
  validate: () => Promise<boolean>;
  dependencies: string[];
  estimatedTime: number; // in minutes
}
```

---

## 📊 Data Migration

### Legacy Blog Migration

Migration from single-tenant to multi-tenant architecture:

```typescript
// src/lib/migrations/001-multitenant-migration.ts
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

interface LegacyBlog {
  id: string;
  title: string;
  content: string;
  createdAt: any;
  author?: string;
}

interface MultitenantBlog extends LegacyBlog {
  tenantId: string;
  author: {
    name: string;
    email: string;
    uid: string;
  };
  excerpt: string;
  slug: string;
  status: 'draft' | 'published';
}

export class MultitenantMigration {
  private defaultTenantId = 'default';
  private defaultAuthor = {
    name: 'Legacy User',
    email: 'legacy@system.com',
    uid: 'legacy-user'
  };

  async up(): Promise<void> {
    console.log('🚀 Starting multitenant migration...');
    
    try {
      // 1. Get all legacy blogs
      const legacyBlogs = await this.getLegacyBlogs();
      console.log(`📊 Found ${legacyBlogs.length} legacy blogs`);

      // 2. Create default tenant if not exists
      await this.createDefaultTenant();

      // 3. Migrate each blog
      const migrated = [];
      const errors = [];

      for (const blog of legacyBlogs) {
        try {
          const migratedBlog = await this.migrateBlog(blog);
          migrated.push(migratedBlog);
          console.log(`✅ Migrated: ${blog.title}`);
        } catch (error) {
          errors.push({ blog: blog.id, error: error.message });
          console.error(`❌ Failed to migrate: ${blog.title}`, error);
        }
      }

      // 4. Update metadata
      await this.updateMigrationMetadata({
        totalBlogs: legacyBlogs.length,
        migratedBlogs: migrated.length,
        errors: errors.length,
        completedAt: new Date()
      });

      console.log(`🎉 Migration completed: ${migrated.length}/${legacyBlogs.length} blogs migrated`);
      
      if (errors.length > 0) {
        console.warn(`⚠️  ${errors.length} blogs had errors:`, errors);
      }

    } catch (error) {
      console.error('💥 Migration failed:', error);
      throw error;
    }
  }

  async down(): Promise<void> {
    console.log('🔄 Rolling back multitenant migration...');
    
    try {
      // 1. Get all migrated blogs
      const migratedBlogs = await this.getMigratedBlogs();
      
      // 2. Convert back to legacy format
      for (const blog of migratedBlogs) {
        await this.revertBlog(blog);
      }
      
      // 3. Remove tenant structure
      await this.removeTenantStructure();
      
      console.log('✅ Rollback completed');
    } catch (error) {
      console.error('💥 Rollback failed:', error);
      throw error;
    }
  }

  private async getLegacyBlogs(): Promise<LegacyBlog[]> {
    const blogsRef = collection(db, 'blogs');
    const snapshot = await getDocs(blogsRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LegacyBlog[];
  }

  private async createDefaultTenant(): Promise<void> {
    const tenantRef = doc(db, 'tenants', this.defaultTenantId);
    
    await setDoc(tenantRef, {
      name: 'Default Tenant',
      createdAt: new Date(),
      plan: 'FREE',
      users: [{
        email: this.defaultAuthor.email,
        name: this.defaultAuthor.name,
        role: 'admin',
        addedAt: new Date()
      }]
    });
  }

  private async migrateBlog(legacyBlog: LegacyBlog): Promise<MultitenantBlog> {
    const slug = this.generateSlug(legacyBlog.title);
    const excerpt = this.generateExcerpt(legacyBlog.content);
    
    const migratedBlog: MultitenantBlog = {
      ...legacyBlog,
      tenantId: this.defaultTenantId,
      author: this.defaultAuthor,
      excerpt,
      slug,
      status: 'published'
    };

    // Save to new location
    const newBlogRef = doc(db, 'tenants', this.defaultTenantId, 'blogs', legacyBlog.id);
    await setDoc(newBlogRef, migratedBlog);

    return migratedBlog;
  }

  private async revertBlog(blog: MultitenantBlog): Promise<void> {
    // Restore to legacy format
    const legacyBlog: LegacyBlog = {
      id: blog.id,
      title: blog.title,
      content: blog.content,
      createdAt: blog.createdAt,
      author: blog.author.name
    };

    // Save to legacy location
    const legacyRef = doc(db, 'blogs', blog.id);
    await setDoc(legacyRef, legacyBlog);

    // Remove from new location
    const newRef = doc(db, 'tenants', blog.tenantId, 'blogs', blog.id);
    await deleteDoc(newRef);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private generateExcerpt(content: string, maxLength: number = 160): string {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  }

  private async updateMigrationMetadata(metadata: any): Promise<void> {
    const metaRef = doc(db, 'system', 'migration-001');
    await setDoc(metaRef, metadata);
  }

  private async getMigratedBlogs(): Promise<MultitenantBlog[]> {
    const blogsRef = collection(db, 'tenants', this.defaultTenantId, 'blogs');
    const snapshot = await getDocs(blogsRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MultitenantBlog[];
  }

  private async removeTenantStructure(): Promise<void> {
    // Remove tenant document
    const tenantRef = doc(db, 'tenants', this.defaultTenantId);
    await deleteDoc(tenantRef);
  }

  async validate(): Promise<boolean> {
    try {
      // Validate migration was successful
      const legacyBlogs = await this.getLegacyBlogs();
      const migratedBlogs = await this.getMigratedBlogs();
      
      console.log(`Validation: ${legacyBlogs.length} legacy, ${migratedBlogs.length} migrated`);
      
      return migratedBlogs.length > 0;
    } catch (error) {
      console.error('Validation failed:', error);
      return false;
    }
  }
}
```

### Content Structure Migration

Migrating to new content block structure:

```typescript
// src/lib/migrations/002-content-blocks-migration.ts
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';

interface LegacyBlogContent {
  content: string;
  featuredImage?: string;
}

interface ModernBlogContent {
  content: string;
  blocks: ContentBlock[];
  featuredImage?: string;
}

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video';
  content?: string;
  src?: string;
  alt?: string;
  order: number;
}

export class ContentBlocksMigration {
  async up(): Promise<void> {
    console.log('🚀 Starting content blocks migration...');
    
    const tenants = await this.getAllTenants();
    
    for (const tenant of tenants) {
      await this.migrateTenantBlogs(tenant.id);
    }
    
    console.log('✅ Content blocks migration completed');
  }

  private async migrateTenantBlogs(tenantId: string): Promise<void> {
    const blogsRef = collection(db, 'tenants', tenantId, 'blogs');
    const snapshot = await getDocs(blogsRef);
    
    for (const blogDoc of snapshot.docs) {
      const blog = blogDoc.data() as LegacyBlogContent;
      
      if (!blog.blocks) {
        const blocks = this.convertContentToBlocks(blog.content, blog.featuredImage);
        
        await updateDoc(blogDoc.ref, {
          blocks,
          migratedToBlocks: true,
          migratedAt: new Date()
        });
        
        console.log(`✅ Migrated blog: ${blogDoc.id}`);
      }
    }
  }

  private convertContentToBlocks(content: string, featuredImage?: string): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    let order = 0;

    // Add featured image as first block if exists
    if (featuredImage) {
      blocks.push({
        id: `block-${order}`,
        type: 'image',
        src: featuredImage,
        alt: 'Featured image',
        order: order++
      });
    }

    // Convert content to text blocks
    // Split by paragraphs and headings
    const sections = content.split(/(<h[1-6][^>]*>.*?<\/h[1-6]>|<p[^>]*>.*?<\/p>)/gi);
    
    for (const section of sections) {
      if (section.trim()) {
        blocks.push({
          id: `block-${order}`,
          type: 'text',
          content: section.trim(),
          order: order++
        });
      }
    }

    return blocks;
  }

  private async getAllTenants(): Promise<{ id: string }[]> {
    const tenantsRef = collection(db, 'tenants');
    const snapshot = await getDocs(tenantsRef);
    
    return snapshot.docs.map(doc => ({ id: doc.id }));
  }

  async down(): Promise<void> {
    console.log('🔄 Rolling back content blocks migration...');
    
    const tenants = await this.getAllTenants();
    
    for (const tenant of tenants) {
      await this.revertTenantBlogs(tenant.id);
    }
    
    console.log('✅ Content blocks rollback completed');
  }

  private async revertTenantBlogs(tenantId: string): Promise<void> {
    const blogsRef = collection(db, 'tenants', tenantId, 'blogs');
    const snapshot = await getDocs(blogsRef);
    
    for (const blogDoc of snapshot.docs) {
      const blog = blogDoc.data();
      
      if (blog.migratedToBlocks) {
        await updateDoc(blogDoc.ref, {
          blocks: null,
          migratedToBlocks: null,
          migratedAt: null
        });
      }
    }
  }

  async validate(): Promise<boolean> {
    try {
      const tenants = await this.getAllTenants();
      
      for (const tenant of tenants) {
        const blogsRef = collection(db, 'tenants', tenant.id, 'blogs');
        const snapshot = await getDocs(blogsRef);
        
        for (const blogDoc of snapshot.docs) {
          const blog = blogDoc.data();
          
          if (!blog.blocks && blog.content) {
            console.warn(`Blog ${blogDoc.id} not migrated to blocks`);
            return false;
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Validation failed:', error);
      return false;
    }
  }
}
```

---

## 🔄 Version Updates

### Automated Update System

```typescript
// src/lib/updates/UpdateManager.ts
interface UpdateInfo {
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  features: FeatureUpdate[];
  breaking: BreakingChange[];
  security: SecurityUpdate[];
}

interface FeatureUpdate {
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  optional: boolean;
}

interface BreakingChange {
  component: string;
  description: string;
  migration: string;
  automated: boolean;
}

export class UpdateManager {
  async checkForUpdates(): Promise<UpdateInfo> {
    const currentVersion = await this.getCurrentVersion();
    const latestVersion = await this.getLatestVersion();
    
    const updateInfo: UpdateInfo = {
      currentVersion,
      latestVersion,
      updateAvailable: this.compareVersions(latestVersion, currentVersion) > 0,
      features: await this.getFeatureUpdates(currentVersion, latestVersion),
      breaking: await this.getBreakingChanges(currentVersion, latestVersion),
      security: await this.getSecurityUpdates(currentVersion, latestVersion)
    };
    
    return updateInfo;
  }

  async performUpdate(targetVersion: string, options: UpdateOptions = {}): Promise<UpdateResult> {
    console.log(`🚀 Starting update to version ${targetVersion}...`);
    
    try {
      // 1. Pre-update validation
      await this.validateUpdatePreconditions();
      
      // 2. Create backup
      if (options.createBackup !== false) {
        await this.createBackup();
      }
      
      // 3. Run migrations
      const migrations = await this.getMigrationsForUpdate(targetVersion);
      await this.runMigrations(migrations);
      
      // 4. Update version
      await this.updateVersion(targetVersion);
      
      // 5. Post-update validation
      await this.validateUpdate();
      
      console.log(`✅ Update to ${targetVersion} completed successfully`);
      
      return {
        success: true,
        version: targetVersion,
        migrationsRun: migrations.length,
        backupCreated: options.createBackup !== false
      };
      
    } catch (error) {
      console.error('💥 Update failed:', error);
      
      // Attempt rollback
      if (options.autoRollback !== false) {
        await this.rollbackUpdate();
      }
      
      return {
        success: false,
        error: error.message,
        rollbackPerformed: options.autoRollback !== false
      };
    }
  }

  private async runMigrations(migrations: Migration[]): Promise<void> {
    console.log(`📦 Running ${migrations.length} migrations...`);
    
    for (const migration of migrations) {
      console.log(`🔄 Running migration: ${migration.id}`);
      
      try {
        // Check dependencies
        await this.validateDependencies(migration);
        
        // Run migration
        await migration.up();
        
        // Validate result
        const isValid = await migration.validate();
        if (!isValid) {
          throw new Error(`Migration ${migration.id} validation failed`);
        }
        
        // Mark as completed
        await this.markMigrationCompleted(migration);
        
        console.log(`✅ Migration ${migration.id} completed`);
        
      } catch (error) {
        console.error(`❌ Migration ${migration.id} failed:`, error);
        throw error;
      }
    }
  }

  private async createBackup(): Promise<string> {
    console.log('💾 Creating backup...');
    
    const backupId = `backup-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    // Export all data
    const tenants = await this.exportAllTenants();
    const system = await this.exportSystemData();
    
    const backup = {
      id: backupId,
      timestamp,
      version: await this.getCurrentVersion(),
      data: {
        tenants,
        system
      }
    };
    
    // Store backup
    await this.storeBackup(backup);
    
    console.log(`✅ Backup created: ${backupId}`);
    return backupId;
  }

  private async rollbackUpdate(): Promise<void> {
    console.log('🔄 Rolling back update...');
    
    try {
      const latestBackup = await this.getLatestBackup();
      if (!latestBackup) {
        throw new Error('No backup available for rollback');
      }
      
      await this.restoreFromBackup(latestBackup.id);
      
      console.log('✅ Rollback completed');
    } catch (error) {
      console.error('💥 Rollback failed:', error);
      throw error;
    }
  }
}

interface UpdateOptions {
  createBackup?: boolean;
  autoRollback?: boolean;
  skipValidation?: boolean;
}

interface UpdateResult {
  success: boolean;
  version?: string;
  migrationsRun?: number;
  backupCreated?: boolean;
  error?: string;
  rollbackPerformed?: boolean;
}
```

### Version Compatibility

```typescript
// src/lib/updates/VersionCompatibility.ts
export class VersionCompatibility {
  private compatibilityMatrix = {
    '1.0.0': {
      migrations: ['001-multitenant'],
      breaking: [],
      deprecated: []
    },
    '1.1.0': {
      migrations: ['002-content-blocks'],
      breaking: [],
      deprecated: ['legacy-editor']
    },
    '2.0.0': {
      migrations: ['003-performance-optimization', '004-new-auth'],
      breaking: ['auth-api-change', 'content-structure'],
      deprecated: ['old-image-api']
    }
  };

  async getUpdatePath(from: string, to: string): Promise<UpdateStep[]> {
    const fromIndex = this.getVersionIndex(from);
    const toIndex = this.getVersionIndex(to);
    
    if (fromIndex >= toIndex) {
      return []; // No update needed or downgrade not supported
    }
    
    const versions = this.getSortedVersions();
    const updatePath = versions.slice(fromIndex + 1, toIndex + 1);
    
    return updatePath.map(version => ({
      version,
      migrations: this.compatibilityMatrix[version].migrations,
      breaking: this.compatibilityMatrix[version].breaking,
      deprecated: this.compatibilityMatrix[version].deprecated
    }));
  }

  canUpdateDirectly(from: string, to: string): boolean {
    const majorFrom = this.getMajorVersion(from);
    const majorTo = this.getMajorVersion(to);
    
    // Can't skip major versions
    return Math.abs(majorTo - majorFrom) <= 1;
  }

  getRequiredMigrations(from: string, to: string): string[] {
    const updatePath = this.getUpdatePath(from, to);
    return updatePath.flatMap(step => step.migrations);
  }

  private getMajorVersion(version: string): number {
    return parseInt(version.split('.')[0]);
  }
}

interface UpdateStep {
  version: string;
  migrations: string[];
  breaking: string[];
  deprecated: string[];
}
```

---

## 🚀 Feature Upgrades

### Advanced Features Migration

```typescript
// src/lib/migrations/003-advanced-features-migration.ts
export class AdvancedFeaturesMigration {
  async up(): Promise<void> {
    console.log('🚀 Installing advanced features...');
    
    // 1. Add performance tracking to existing blogs
    await this.addPerformanceTracking();
    
    // 2. Enable virtual scrolling for large lists
    await this.enableVirtualScrolling();
    
    // 3. Setup image optimization
    await this.setupImageOptimization();
    
    // 4. Install bundle optimization
    await this.installBundleOptimization();
    
    // 5. Setup production monitoring
    await this.setupProductionMonitoring();
    
    console.log('✅ Advanced features migration completed');
  }

  private async addPerformanceTracking(): Promise<void> {
    // Add performance tracking preferences to all tenants
    const tenants = await this.getAllTenants();
    
    for (const tenant of tenants) {
      await updateDoc(doc(db, 'tenants', tenant.id), {
        settings: {
          ...tenant.settings,
          performance: {
            enableTracking: true,
            enableVirtualScroll: true,
            enableImageOptimization: true,
            enableBundleOptimization: true
          }
        }
      });
    }
  }

  private async enableVirtualScrolling(): Promise<void> {
    // Add virtual scroll preferences for users
    const tenants = await this.getAllTenants();
    
    for (const tenant of tenants) {
      const users = await this.getTenantUsers(tenant.id);
      
      for (const user of users) {
        await setDoc(doc(db, 'tenants', tenant.id, 'userPreferences', user.uid), {
          listView: {
            enableVirtualScroll: true,
            itemsPerPage: 50,
            enableInfiniteScroll: true
          }
        }, { merge: true });
      }
    }
  }

  private async setupImageOptimization(): Promise<void> {
    // Update all existing images to use optimization
    const tenants = await this.getAllTenants();
    
    for (const tenant of tenants) {
      const blogs = await this.getTenantBlogs(tenant.id);
      
      for (const blog of blogs) {
        if (blog.blocks) {
          const optimizedBlocks = await this.optimizeImageBlocks(blog.blocks);
          
          await updateDoc(doc(db, 'tenants', tenant.id, 'blogs', blog.id), {
            blocks: optimizedBlocks,
            imageOptimizationEnabled: true
          });
        }
      }
    }
  }

  private async optimizeImageBlocks(blocks: ContentBlock[]): Promise<ContentBlock[]> {
    return blocks.map(block => {
      if (block.type === 'image' && block.src) {
        // Add optimization parameters to existing images
        const optimizedSrc = this.addOptimizationParams(block.src);
        
        return {
          ...block,
          src: optimizedSrc,
          optimized: true,
          formats: ['webp', 'avif', 'jpg'],
          sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        };
      }
      
      return block;
    });
  }

  private addOptimizationParams(src: string): string {
    if (src.includes('cloudinary.com')) {
      // Add Cloudinary optimization parameters
      const parts = src.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/f_auto,q_auto,dpr_auto/${parts[1]}`;
      }
    }
    
    return src;
  }

  async down(): Promise<void> {
    console.log('🔄 Rolling back advanced features...');
    
    // Remove advanced features settings
    const tenants = await this.getAllTenants();
    
    for (const tenant of tenants) {
      await updateDoc(doc(db, 'tenants', tenant.id), {
        'settings.performance': null
      });
    }
    
    console.log('✅ Advanced features rollback completed');
  }

  async validate(): Promise<boolean> {
    try {
      const tenants = await this.getAllTenants();
      
      for (const tenant of tenants) {
        const tenantDoc = await getDoc(doc(db, 'tenants', tenant.id));
        const settings = tenantDoc.data()?.settings;
        
        if (!settings?.performance?.enableTracking) {
          console.warn(`Tenant ${tenant.id} missing performance settings`);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Validation failed:', error);
      return false;
    }
  }
}
```

---

## 🗄️ Database Schema Changes

### Schema Evolution

```typescript
// src/lib/migrations/004-schema-evolution.ts
interface SchemaChange {
  collection: string;
  field: string;
  type: 'add' | 'remove' | 'modify' | 'rename';
  oldField?: string;
  newField?: string;
  defaultValue?: any;
  required?: boolean;
}

export class SchemaEvolutionMigration {
  private schemaChanges: SchemaChange[] = [
    {
      collection: 'tenants/{tenantId}/blogs',
      field: 'seo',
      type: 'add',
      defaultValue: {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
        canonicalUrl: ''
      }
    },
    {
      collection: 'tenants/{tenantId}/blogs',
      field: 'status',
      type: 'modify',
      defaultValue: 'published'
    },
    {
      collection: 'tenants/{tenantId}/blogs',
      field: 'author',
      type: 'modify',
      // Convert string to object
    },
    {
      collection: 'tenants',
      field: 'subscription',
      type: 'add',
      defaultValue: {
        plan: 'FREE',
        startDate: null,
        endDate: null,
        features: []
      }
    }
  ];

  async up(): Promise<void> {
    console.log('🚀 Starting schema evolution...');
    
    for (const change of this.schemaChanges) {
      await this.applySchemaChange(change);
    }
    
    console.log('✅ Schema evolution completed');
  }

  private async applySchemaChange(change: SchemaChange): Promise<void> {
    console.log(`📝 Applying schema change: ${change.collection}.${change.field}`);
    
    switch (change.type) {
      case 'add':
        await this.addField(change);
        break;
      case 'remove':
        await this.removeField(change);
        break;
      case 'modify':
        await this.modifyField(change);
        break;
      case 'rename':
        await this.renameField(change);
        break;
    }
  }

  private async addField(change: SchemaChange): Promise<void> {
    const collections = await this.getMatchingCollections(change.collection);
    
    for (const collectionPath of collections) {
      const docs = await getDocs(collection(db, collectionPath));
      
      for (const docSnapshot of docs.docs) {
        const data = docSnapshot.data();
        
        if (!(change.field in data)) {
          await updateDoc(docSnapshot.ref, {
            [change.field]: change.defaultValue
          });
        }
      }
    }
  }

  private async modifyField(change: SchemaChange): Promise<void> {
    if (change.field === 'author') {
      await this.migrateAuthorField();
    } else if (change.field === 'status') {
      await this.migrateStatusField();
    }
  }

  private async migrateAuthorField(): Promise<void> {
    const tenants = await this.getAllTenants();
    
    for (const tenant of tenants) {
      const blogsRef = collection(db, 'tenants', tenant.id, 'blogs');
      const snapshot = await getDocs(blogsRef);
      
      for (const docSnapshot of snapshot.docs) {
        const blog = docSnapshot.data();
        
        if (typeof blog.author === 'string') {
          // Convert string author to object
          const authorObject = {
            name: blog.author,
            email: 'unknown@system.com',
            uid: 'legacy-user'
          };
          
          await updateDoc(docSnapshot.ref, {
            author: authorObject
          });
        }
      }
    }
  }

  private async migrateStatusField(): Promise<void> {
    const tenants = await this.getAllTenants();
    
    for (const tenant of tenants) {
      const blogsRef = collection(db, 'tenants', tenant.id, 'blogs');
      const snapshot = await getDocs(blogsRef);
      
      for (const docSnapshot of snapshot.docs) {
        const blog = docSnapshot.data();
        
        if (!blog.status) {
          // Default to published for existing blogs
          await updateDoc(docSnapshot.ref, {
            status: 'published'
          });
        }
      }
    }
  }

  private async getMatchingCollections(pattern: string): Promise<string[]> {
    if (pattern.includes('{tenantId}')) {
      const tenants = await this.getAllTenants();
      return tenants.map(tenant => 
        pattern.replace('{tenantId}', tenant.id)
      );
    }
    
    return [pattern];
  }

  async down(): Promise<void> {
    console.log('🔄 Rolling back schema changes...');
    
    // Reverse the changes
    const reversedChanges = [...this.schemaChanges].reverse();
    
    for (const change of reversedChanges) {
      await this.reverseSchemaChange(change);
    }
    
    console.log('✅ Schema rollback completed');
  }

  private async reverseSchemaChange(change: SchemaChange): Promise<void> {
    switch (change.type) {
      case 'add':
        await this.removeField({ ...change, type: 'remove' });
        break;
      case 'remove':
        await this.addField({ ...change, type: 'add' });
        break;
      case 'rename':
        await this.renameField({
          ...change,
          oldField: change.newField,
          newField: change.oldField
        });
        break;
      // modify changes are harder to reverse automatically
    }
  }
}
```

---

## ↩️ Rollback Procedures

### Automated Rollback System

```typescript
// src/lib/rollback/RollbackManager.ts
export class RollbackManager {
  async rollbackToVersion(targetVersion: string): Promise<RollbackResult> {
    console.log(`🔄 Rolling back to version ${targetVersion}...`);
    
    try {
      // 1. Validate rollback is possible
      await this.validateRollback(targetVersion);
      
      // 2. Find backup for target version
      const backup = await this.findBackupForVersion(targetVersion);
      if (!backup) {
        throw new Error(`No backup found for version ${targetVersion}`);
      }
      
      // 3. Create checkpoint before rollback
      const checkpointId = await this.createCheckpoint();
      
      // 4. Restore from backup
      await this.restoreFromBackup(backup.id);
      
      // 5. Run reverse migrations if needed
      const reverseMigrations = await this.getReverseMigrations(targetVersion);
      await this.runReverseMigrations(reverseMigrations);
      
      // 6. Update version
      await this.updateVersion(targetVersion);
      
      // 7. Validate rollback
      await this.validateRollbackComplete(targetVersion);
      
      console.log(`✅ Rollback to ${targetVersion} completed successfully`);
      
      return {
        success: true,
        version: targetVersion,
        checkpointId,
        migrationsReverted: reverseMigrations.length
      };
      
    } catch (error) {
      console.error('💥 Rollback failed:', error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  async rollbackMigration(migrationId: string): Promise<void> {
    console.log(`🔄 Rolling back migration: ${migrationId}`);
    
    const migration = await this.getMigration(migrationId);
    if (!migration) {
      throw new Error(`Migration ${migrationId} not found`);
    }
    
    // Check if migration can be rolled back
    if (!migration.down) {
      throw new Error(`Migration ${migrationId} does not support rollback`);
    }
    
    // Create checkpoint
    const checkpointId = await this.createCheckpoint();
    
    try {
      // Run rollback
      await migration.down();
      
      // Mark as reverted
      await this.markMigrationReverted(migrationId);
      
      console.log(`✅ Migration ${migrationId} rolled back successfully`);
      
    } catch (error) {
      console.error(`💥 Migration rollback failed:`, error);
      
      // Restore checkpoint
      await this.restoreCheckpoint(checkpointId);
      
      throw error;
    }
  }

  private async createCheckpoint(): Promise<string> {
    const checkpointId = `checkpoint-${Date.now()}`;
    
    // Export current state
    const currentState = await this.exportCurrentState();
    
    // Store checkpoint
    await this.storeCheckpoint(checkpointId, currentState);
    
    return checkpointId;
  }

  private async validateRollback(targetVersion: string): Promise<void> {
    const currentVersion = await this.getCurrentVersion();
    
    // Can't rollback to same or newer version
    if (this.compareVersions(targetVersion, currentVersion) >= 0) {
      throw new Error(`Cannot rollback to version ${targetVersion} from ${currentVersion}`);
    }
    
    // Check if data would be lost
    const dataLossRisk = await this.assessDataLossRisk(targetVersion);
    if (dataLossRisk.high) {
      throw new Error(`Rollback to ${targetVersion} would cause data loss: ${dataLossRisk.details}`);
    }
  }

  private async assessDataLossRisk(targetVersion: string): Promise<DataLossRisk> {
    const currentVersion = await this.getCurrentVersion();
    const changes = await this.getChanges(targetVersion, currentVersion);
    
    const risk: DataLossRisk = {
      high: false,
      medium: false,
      details: []
    };
    
    // Check for destructive changes
    for (const change of changes) {
      if (change.type === 'schema_remove_field') {
        risk.high = true;
        risk.details.push(`Field ${change.field} will be permanently lost`);
      }
      
      if (change.type === 'data_migration') {
        risk.medium = true;
        risk.details.push(`Data transformation may not be fully reversible`);
      }
    }
    
    return risk;
  }
}

interface RollbackResult {
  success: boolean;
  version?: string;
  checkpointId?: string;
  migrationsReverted?: number;
  error?: string;
}

interface DataLossRisk {
  high: boolean;
  medium: boolean;
  details: string[];
}
```

---

## 💡 Best Practices

### Migration Best Practices

#### 1. **Always Create Backups**
```typescript
// Before any migration
const backupId = await createBackup();
console.log(`Backup created: ${backupId}`);

try {
  await runMigration();
} catch (error) {
  await restoreFromBackup(backupId);
  throw error;
}
```

#### 2. **Use Transactions for Atomic Operations**
```typescript
import { runTransaction } from 'firebase/firestore';

await runTransaction(db, async (transaction) => {
  // All operations within this block are atomic
  const blogRef = doc(db, 'tenants', tenantId, 'blogs', blogId);
  const blog = await transaction.get(blogRef);
  
  transaction.update(blogRef, {
    migrated: true,
    migratedAt: new Date()
  });
});
```

#### 3. **Validate Before and After**
```typescript
// Pre-migration validation
const isValid = await validatePreconditions();
if (!isValid) {
  throw new Error('Pre-migration validation failed');
}

await runMigration();

// Post-migration validation
const isComplete = await validateMigrationComplete();
if (!isComplete) {
  await rollback();
  throw new Error('Post-migration validation failed');
}
```

#### 4. **Use Feature Flags for Gradual Rollouts**
```typescript
const featureFlags = {
  enableVirtualScroll: process.env.FEATURE_VIRTUAL_SCROLL === 'true',
  enableImageOptimization: process.env.FEATURE_IMAGE_OPT === 'true',
  enableBundleOptimization: process.env.FEATURE_BUNDLE_OPT === 'true'
};

// Gradual feature activation
if (featureFlags.enableVirtualScroll) {
  await enableVirtualScrollForTenant(tenantId);
}
```

#### 5. **Monitor and Log Everything**
```typescript
const migrationLogger = {
  info: (message: string, data?: any) => {
    console.log(`[MIGRATION] ${message}`, data);
    // Also log to external service
  },
  error: (message: string, error: any) => {
    console.error(`[MIGRATION ERROR] ${message}`, error);
    // Send to error tracking service
  }
};

await migration.up();
migrationLogger.info('Migration completed', { migrationId: migration.id });
```

### Deployment Strategy

#### Blue-Green Deployment
```bash
# 1. Deploy to staging environment
npm run deploy:staging

# 2. Run migration on staging
npm run migrate:staging

# 3. Validate staging
npm run validate:staging

# 4. Deploy to production
npm run deploy:production

# 5. Run migration on production
npm run migrate:production

# 6. Switch traffic to new version
npm run switch:production
```

#### Rolling Updates
```typescript
// Update tenants in batches
const tenants = await getAllTenants();
const batchSize = 10;

for (let i = 0; i < tenants.length; i += batchSize) {
  const batch = tenants.slice(i, i + batchSize);
  
  await Promise.all(
    batch.map(tenant => updateTenant(tenant.id))
  );
  
  // Monitor for issues
  await monitorBatch(batch);
  
  // Wait before next batch
  await new Promise(resolve => setTimeout(resolve, 5000));
}
```

This comprehensive migration and update guide ensures safe, reliable upgrades while maintaining data integrity and system availability.