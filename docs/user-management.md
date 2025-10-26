# 👥 User Management Guide

Complete guide for managing users and permissions in Puka Digital CMS.

## 📋 Table of Contents

1. [User Roles & Permissions](#user-roles--permissions)
2. [Adding Users](#adding-users)
3. [Managing User Roles](#managing-user-roles)
4. [User Authentication](#user-authentication)
5. [Tenant Management](#tenant-management)
6. [Security Best Practices](#security-best-practices)
7. [Troubleshooting](#troubleshooting)

---

## 🎭 User Roles & Permissions

### Available Roles

#### 🔴 **Admin**
- **Full Access**: Complete control over the tenant
- **Permissions**:
  - Create, edit, delete all blogs
  - Manage all users (add, remove, change roles)
  - Access tenant settings
  - View analytics and reports
  - Manage integrations
  - Export/import data

#### 🟡 **Editor**
- **Content Management**: Create and manage content
- **Permissions**:
  - Create, edit, delete blogs
  - Upload and manage media
  - Access CMS interface
  - View other users (read-only)
  - Cannot manage users or settings

#### 🟢 **Viewer**
- **Read-Only Access**: View content and basic information
- **Permissions**:
  - View published blogs
  - Access basic CMS interface
  - View own profile
  - Cannot create, edit, or delete content

### Permission Matrix

| Feature | Admin | Editor | Viewer |
|---------|-------|--------|--------|
| **Content Management** | | | |
| Create blogs | ✅ | ✅ | ❌ |
| Edit own blogs | ✅ | ✅ | ❌ |
| Edit all blogs | ✅ | ✅ | ❌ |
| Delete blogs | ✅ | ✅ | ❌ |
| Publish/unpublish | ✅ | ✅ | ❌ |
| **Media Management** | | | |
| Upload images | ✅ | ✅ | ❌ |
| Upload videos | ✅ | ✅ | ❌ |
| Manage media library | ✅ | ✅ | ❌ |
| **User Management** | | | |
| View users | ✅ | ✅ (read-only) | ✅ (own profile) |
| Add users | ✅ | ❌ | ❌ |
| Remove users | ✅ | ❌ | ❌ |
| Change user roles | ✅ | ❌ | ❌ |
| **Settings** | | | |
| Tenant settings | ✅ | ❌ | ❌ |
| Integration settings | ✅ | ❌ | ❌ |
| Export data | ✅ | ❌ | ❌ |

---

## 👤 Adding Users

### Method 1: Admin Panel (Recommended)

1. **Access Admin Panel**
   ```
   Navigate to: /admin/tenants
   Login with admin credentials
   ```

2. **Add New User**
   - Click "Add User" button
   - Enter user email address
   - Enter user's full name
   - Select appropriate role
   - Click "Add User"

3. **User Notification**
   - User receives email invitation (future feature)
   - User can sign in with Google using the provided email
   - User automatically gets access to the tenant

### Method 2: Programmatic (API)

```typescript
// Using the tenant service
import { addUserToTenant } from '@/lib/tenantService';

const addUser = async () => {
  try {
    await addUserToTenant('your-tenant-id', {
      email: 'newuser@company.com',
      name: 'New User',
      role: 'editor'
    });
    
    console.log('User added successfully');
  } catch (error) {
    console.error('Error adding user:', error);
  }
};
```

### Method 3: Bulk Import (CSV)

```typescript
// Bulk user import functionality
const importUsers = async (csvData: string) => {
  const users = parseCSV(csvData); // Parse CSV data
  
  for (const user of users) {
    await addUserToTenant(tenantId, {
      email: user.email,
      name: user.name,
      role: user.role || 'viewer'
    });
  }
};

// CSV Format:
// email,name,role
// john@company.com,John Doe,editor
// jane@company.com,Jane Smith,viewer
```

---

## 🔄 Managing User Roles

### Changing User Roles

#### Via Admin Panel
1. Navigate to `/admin/tenants`
2. Find the user in the users list
3. Click on the role dropdown
4. Select new role
5. Confirm the change

#### Programmatically
```typescript
import { updateUserRole } from '@/lib/tenantService';

const changeUserRole = async (userEmail: string, newRole: UserRole) => {
  try {
    await updateUserRole(tenantId, userEmail, newRole);
    console.log(`User role updated to ${newRole}`);
  } catch (error) {
    console.error('Error updating user role:', error);
  }
};
```

### Role Transition Guidelines

#### **Viewer → Editor**
- User gains content creation abilities
- No additional setup required
- User can immediately start creating content

#### **Editor → Admin**
- User gains user management abilities
- User gains access to tenant settings
- Consider training on admin responsibilities

#### **Admin → Editor/Viewer**
- Ensure at least one admin remains
- User loses management privileges immediately
- Content access remains based on new role

### Bulk Role Updates

```typescript
const bulkUpdateRoles = async (updates: Array<{email: string, role: UserRole}>) => {
  const results = await Promise.allSettled(
    updates.map(update => 
      updateUserRole(tenantId, update.email, update.role)
    )
  );
  
  // Handle results
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`✅ Updated ${updates[index].email}`);
    } else {
      console.error(`❌ Failed to update ${updates[index].email}:`, result.reason);
    }
  });
};
```

---

## 🔐 User Authentication

### Authentication Flow

1. **User Access**: User visits CMS interface
2. **Login Redirect**: Redirected to `/admin/login` if not authenticated
3. **Google Auth**: User signs in with Google account
4. **Tenant Check**: System verifies user belongs to tenant
5. **Role Assignment**: User gets permissions based on role
6. **CMS Access**: User can access CMS features based on role

### Adding Authentication to New Components

```typescript
// Using the auth hook
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/context/TenantContext';

const ProtectedComponent = () => {
  const { user, loading } = useAuth();
  const { currentTenant, userRole } = useTenant();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <div>Please sign in to access this feature.</div>;
  }
  
  if (userRole !== 'admin') {
    return <div>Admin access required.</div>;
  }
  
  return <div>Admin content here</div>;
};
```

### Role-Based Component Rendering

```typescript
// RoleGuard component
interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  allowedRoles, 
  children, 
  fallback 
}) => {
  const { userRole } = useTenant();
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return fallback || <div>Access denied</div>;
  }
  
  return <>{children}</>;
};

// Usage
<RoleGuard allowedRoles={['admin', 'editor']}>
  <CreateBlogButton />
</RoleGuard>
```

---

## 🏢 Tenant Management

### Creating New Tenants

```typescript
import { createTenant } from '@/lib/tenantService';

const createNewTenant = async () => {
  const tenant = await createTenant({
    name: "Marketing Team",
    domain: "marketing.company.com", // Optional
    plan: "PRO",
    adminEmail: "admin@company.com",
    adminName: "Admin User"
  });
  
  console.log('Tenant created:', tenant.id);
};
```

### Tenant Settings Management

```typescript
// Update tenant settings
const updateTenantSettings = async (settings: TenantSettings) => {
  try {
    await updateDoc(doc(db, 'tenants', tenantId), {
      settings: settings,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating settings:', error);
  }
};

// Example settings
const newSettings: TenantSettings = {
  branding: {
    logo: "https://cloudinary.com/logo.png",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b"
  },
  features: {
    commentsEnabled: true,
    seoOptimization: true,
    customDomains: true
  },
  limits: {
    maxBlogs: 1000,
    maxUsers: 20,
    storageLimit: 10 * 1024 * 1024 * 1024 // 10GB
  }
};
```

### Multi-Tenant User Access

```typescript
// User with access to multiple tenants
interface UserTenantAccess {
  userId: string;
  tenants: Array<{
    tenantId: string;
    role: UserRole;
    addedAt: Date;
  }>;
}

// Switch between tenants
const switchTenant = async (tenantId: string) => {
  const { switchTenant } = useTenant();
  await switchTenant(tenantId);
  
  // Redirect to tenant-specific dashboard
  router.push(`/cms?tenant=${tenantId}`);
};
```

---

## 🛡️ Security Best Practices

### Password and Account Security

1. **Google Authentication Only**
   - No password management required
   - Leverage Google's security measures
   - Two-factor authentication handled by Google

2. **Regular Access Reviews**
   ```typescript
   // Get user activity report
   const getUserActivity = async (tenantId: string) => {
     const users = await getTenantUsers(tenantId);
     
     return users.map(user => ({
       email: user.email,
       role: user.role,
       lastLogin: user.lastLoginAt,
       daysInactive: user.lastLoginAt 
         ? Math.floor((Date.now() - user.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24))
         : null
     }));
   };
   ```

3. **Inactive User Management**
   ```typescript
   // Remove inactive users (90+ days)
   const removeInactiveUsers = async (tenantId: string) => {
     const users = await getUserActivity(tenantId);
     const inactiveUsers = users.filter(user => 
       user.daysInactive && user.daysInactive > 90
     );
     
     for (const user of inactiveUsers) {
       if (user.role !== 'admin') { // Keep admins
         await removeUserFromTenant(tenantId, user.email);
       }
     }
   };
   ```

### Role Assignment Guidelines

1. **Principle of Least Privilege**
   - Start with Viewer role
   - Upgrade only when necessary
   - Regular role reviews

2. **Admin Role Restrictions**
   - Minimum 1, maximum 3 admins per tenant
   - Document admin responsibilities
   - Regular admin access reviews

3. **Temporary Access**
   ```typescript
   // Temporary role elevation
   const grantTemporaryAccess = async (
     userEmail: string, 
     temporaryRole: UserRole, 
     durationHours: number
   ) => {
     // Grant temporary role
     await updateUserRole(tenantId, userEmail, temporaryRole);
     
     // Schedule role reversion
     setTimeout(async () => {
       await updateUserRole(tenantId, userEmail, 'viewer');
     }, durationHours * 60 * 60 * 1000);
   };
   ```

### Audit Logging

```typescript
// Log user actions
interface AuditLog {
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

const logUserAction = async (log: AuditLog) => {
  await addDoc(collection(db, `tenants/${tenantId}/audit_logs`), {
    ...log,
    timestamp: serverTimestamp()
  });
};

// Usage
await logUserAction({
  userId: user.uid,
  action: 'blog_created',
  resource: `blog:${blogId}`,
  metadata: { title: blogTitle }
});
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **User Can't Access CMS**

**Symptoms**: User signed in but gets "Access Denied"

**Solutions**:
```typescript
// Check if user exists in tenant
const checkUserAccess = async (userEmail: string) => {
  const tenantDoc = await getDoc(doc(db, 'tenants', tenantId));
  const users = tenantDoc.data()?.users || [];
  
  const userExists = users.some(u => u.email === userEmail);
  console.log('User exists in tenant:', userExists);
  
  if (!userExists) {
    console.log('Add user to tenant first');
  }
};
```

#### 2. **Role Changes Not Taking Effect**

**Symptoms**: User role updated but permissions unchanged

**Solutions**:
```typescript
// Force re-authentication
const forceReauth = () => {
  signOut(auth).then(() => {
    window.location.reload();
  });
};

// Or refresh user context
const { refreshUser } = useTenant();
await refreshUser();
```

#### 3. **Multiple Admin Requirement**

**Symptoms**: Cannot change last admin's role

**Solutions**:
```typescript
const canChangeAdminRole = (userEmail: string) => {
  const admins = users.filter(u => u.role === 'admin');
  
  if (admins.length === 1 && admins[0].email === userEmail) {
    throw new Error('Cannot remove the last admin. Add another admin first.');
  }
  
  return true;
};
```

#### 4. **Bulk Operations Failing**

**Symptoms**: Some users in bulk operation fail

**Solutions**:
```typescript
const safeBulkOperation = async (operations: Array<() => Promise<void>>) => {
  const results = [];
  
  for (const operation of operations) {
    try {
      await operation();
      results.push({ success: true });
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }
  
  return results;
};
```

### Debug Tools

#### User Debug Panel
```typescript
// Add to admin panel for debugging
const UserDebugPanel = ({ userEmail }: { userEmail: string }) => {
  const [debugInfo, setDebugInfo] = useState(null);
  
  const checkUser = async () => {
    const info = {
      firebaseUser: await getUser(userEmail),
      tenantUser: await getTenantUser(tenantId, userEmail),
      permissions: await getUserPermissions(userEmail)
    };
    setDebugInfo(info);
  };
  
  return (
    <div className="border p-4 rounded">
      <button onClick={checkUser}>Debug User: {userEmail}</button>
      {debugInfo && (
        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      )}
    </div>
  );
};
```

#### Permission Checker
```typescript
const checkPermission = (user: TenantUser, action: string, resource: string) => {
  const permissions = {
    admin: ['*:*'],
    editor: ['blog:*', 'media:*'],
    viewer: ['blog:read', 'media:read']
  };
  
  const userPermissions = permissions[user.role] || [];
  const hasPermission = userPermissions.some(perm => 
    perm === '*:*' || 
    perm === `${resource}:*` || 
    perm === `${resource}:${action}`
  );
  
  console.log(`User ${user.email} ${hasPermission ? 'CAN' : 'CANNOT'} ${action} ${resource}`);
  return hasPermission;
};
```

---

Remember: Always test user management changes in a development environment before applying them to production!