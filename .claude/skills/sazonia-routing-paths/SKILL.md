---
name: sazonia-routing-paths
description: Generate type-safe route paths using createPaths utility for Next.js 15 App Router. Use when creating new routes, route groups, working with dynamic paths, navigation, or setting up type-safe routing for features.
---

# Sazonia Type-Safe Routing

This Skill helps you create type-safe routes using the `createPaths` utility for Next.js 15 App Router, ensuring compile-time safety for navigation and preventing broken links.

## When to Use This Skill

- Creating new routes with dynamic segments
- Setting up type-safe navigation paths
- Organizing route groups with `(routes)`
- Creating nested routes with parameters
- Centralizing route definitions for features
- Generating breadcrumbs from routes

## Core Principles

### 1. Next.js 15 App Router Structure

```
src/app/
├── (home)/                    # Route group
│   ├── (routes)/
│   │   ├── layout.tsx
│   │   └── page.tsx          # /
│   └── paths.ts              # Home paths
├── profile/
│   ├── (routes)/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # /profile
│   │   ├── purchases/
│   │   │   ├── page.tsx      # /profile/purchases
│   │   │   └── [id]/
│   │   │       └── page.tsx  # /profile/purchases/:id
│   │   └── security/
│   │       └── page.tsx      # /profile/security
│   └── paths.ts              # Profile paths
└── paths.ts                  # Central registry
```

**Key principles:**

- Each feature has its own `paths.ts`
- Root `paths.ts` aggregates all feature paths
- Use `(routes)` folder to group route files
- Dynamic segments use `[param]` syntax

### 2. The createPaths Utility

Located at `src/lib/createPaths.ts`:

```typescript
export function createPaths<T extends Record<string, string>>(paths: T): T {
  return paths;
}
```

**Benefits:**

- Type-safe path definitions
- Autocomplete for all routes
- Compile-time error checking
- Centralized path management

## Implementation Patterns

### Pattern 1: Simple Static Routes

**Feature paths.ts:**

```typescript
// src/app/auth/paths.ts
import { createPaths } from '@/lib/createPaths';

export const authPaths = createPaths({
  root: '/auth',
  callback: '/auth/callback',
  signout: '/auth/signout',
} as const);
```

**Usage:**

```typescript
import { authPaths } from "@/app/auth/paths";

// In a component
<Link href={authPaths.root}>Sign In</Link>

// In a redirect
redirect(authPaths.callback);

// In navigation
router.push(authPaths.signout);
```

### Pattern 2: Dynamic Routes with Parameters

**Feature paths.ts:**

```typescript
// src/app/items/paths.tsx
import { createPaths } from '@/lib/createPaths';

export const itemsPaths = createPaths({
  root: '/items',
  item: (id: string) => `/items/${id}`,
  edit: (id: string) => `/items/${id}/edit`,
  reviews: (id: string) => `/items/${id}/reviews`,
} as const);
```

**Usage:**

```typescript
import { itemsPaths } from "@/app/items/paths";

// Navigate to specific item
<Link href={itemsPaths.item("123")}>View Item</Link>

// Navigate to edit page
router.push(itemsPaths.edit(item.id));

// Type-safe parameters
const path = itemsPaths.item(itemId);  // TypeScript knows itemId must be string
```

### Pattern 3: Nested Routes with Multiple Parameters

**Feature paths.ts:**

```typescript
// src/app/profile/paths.ts
import { createPaths } from '@/lib/createPaths';

export const profilePaths = createPaths({
  root: '/profile',

  // Personal info
  personalInfo: '/profile/personal-info',

  // Addresses
  addresses: '/profile/addresses',
  newAddress: '/profile/addresses/new-address',
  editAddress: (id: string) => `/profile/addresses/${id}/edit`,

  // Purchases
  purchases: '/profile/purchases',
  purchase: (id: string) => `/profile/purchases/${id}`,
  purchaseReview: (id: string) => `/profile/purchases/${id}/review`,

  // Security
  security: '/profile/security',

  // Publications
  publications: '/profile/publications',
  publication: (id: string) => `/profile/publications/${id}`,
  editPublication: (id: string) => `/profile/publications/${id}/edit`,

  // Sales
  sales: '/profile/sales',
  sale: (id: string) => `/profile/sales/${id}`,
  saleDetails: (saleId: string, itemId: string) =>
    `/profile/sales/${saleId}/items/${itemId}`,
} as const);
```

**Usage:**

```typescript
import { profilePaths } from "@/app/profile/paths";

// Simple static routes
<Link href={profilePaths.purchases}>My Purchases</Link>

// Single parameter
<Link href={profilePaths.purchase(purchaseId)}>View Purchase</Link>

// Multiple parameters
<Link href={profilePaths.saleDetails(saleId, itemId)}>
  View Sale Item
</Link>
```

### Pattern 4: Routes with Query Parameters

**Feature paths.ts:**

```typescript
// src/app/search/paths.ts
import { createPaths } from '@/lib/createPaths';

export const searchPaths = createPaths({
  root: '/search',
  query: (q: string) => `/search?q=${encodeURIComponent(q)}`,
  category: (category: string, q?: string) => {
    const params = new URLSearchParams();
    params.append('category', category);
    if (q) params.append('q', q);
    return `/search?${params.toString()}`;
  },
  advanced: (filters: {
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters.q) params.append('q', filters.q);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice));
    return `/search?${params.toString()}`;
  },
} as const);
```

**Usage:**

```typescript
import { searchPaths } from "@/app/search/paths";

// Simple query
<Link href={searchPaths.query("laptops")}>Search Laptops</Link>

// Category with query
router.push(searchPaths.category("electronics", "laptop"));

// Advanced filters
const path = searchPaths.advanced({
  q: "laptop",
  category: "electronics",
  minPrice: 500,
  maxPrice: 2000,
});
router.push(path);
```

### Pattern 5: Authentication-Based Routes

**Feature paths.ts:**

```typescript
// src/app/auth/paths.ts
import { createPaths } from '@/lib/createPaths';

export const authPaths = createPaths({
  root: '/auth',

  // Strategy-based routes
  strategy: (strategy: 'email' | 'phone') => `/auth/${strategy}`,
  verify: (strategy: 'email' | 'phone') => `/auth/${strategy}/verify`,

  // OAuth callbacks
  callback: '/auth/callback',

  // Sign out
  signout: '/auth/signout',

  // With redirect
  withRedirect: (returnUrl: string) =>
    `/auth?redirect=${encodeURIComponent(returnUrl)}`,
} as const);
```

**Usage:**

```typescript
import { authPaths } from "@/app/auth/paths";

// Navigate to email auth
<Link href={authPaths.strategy("email")}>Sign in with Email</Link>

// Navigate to phone verification
router.push(authPaths.verify("phone"));

// Redirect after auth
const path = authPaths.withRedirect("/profile/purchases");
router.push(path);
```

### Pattern 6: Central Path Registry

**Root paths.ts:**

```typescript
// src/app/paths.ts
import { createPaths } from '@/lib/createPaths';
import { authPaths } from './auth/paths';
import { profilePaths } from './profile/paths';
import { itemsPaths } from './items/paths';
import { searchPaths } from './search/paths';

// App-wide paths
export const appPaths = createPaths({
  home: '/',
  notFound: '/404',
  error: '/error',

  // Feature paths
  auth: authPaths,
  profile: profilePaths,
  items: itemsPaths,
  search: searchPaths,
} as const);
```

**Usage:**

```typescript
import { appPaths } from "@/app/paths";

// Access nested paths
<Link href={appPaths.profile.purchases}>My Purchases</Link>

// Navigate to item
router.push(appPaths.items.item(itemId));

// Navigate to auth
<Link href={appPaths.auth.root}>Sign In</Link>
```

## Route Groups Pattern

### Using (routes) for Organization

```
app/profile/
├── (routes)/              # Route group (doesn't affect URL)
│   ├── layout.tsx        # Shared layout
│   ├── page.tsx          # /profile
│   ├── purchases/
│   │   └── page.tsx      # /profile/purchases
│   └── security/
│       └── page.tsx      # /profile/security
├── components/           # Feature components
├── hooks/                # Feature hooks
├── services/             # API services
└── paths.ts             # Path definitions
```

**Benefits:**

- Separates route files from feature code
- Cleaner directory structure
- Doesn't affect URL structure
- Shared layouts for route groups

## Implementation Steps

### Step 1: Create Feature Paths

```bash
# Create paths file for feature
touch src/app/[feature]/paths.ts
```

### Step 2: Define Routes

```typescript
// src/app/[feature]/paths.ts
import { createPaths } from "@/lib/createPaths";

export const [feature]Paths = createPaths({
  root: "/[feature]",
  // Add more routes...
} as const);
```

### Step 3: Add to Central Registry

```typescript
// src/app/paths.ts
import { [feature]Paths } from "./[feature]/paths";

export const appPaths = createPaths({
  // ... existing paths
  [feature]: [feature]Paths,
} as const);
```

### Step 4: Use in Components

```typescript
import { appPaths } from "@/app/paths";
// or
import { [feature]Paths } from "@/app/[feature]/paths";

// Use type-safe paths
<Link href={appPaths.[feature].root}>Navigate</Link>
```

## Advanced Patterns

### Pattern: Breadcrumb Generation

```typescript
// src/lib/findBreadcrumbs.ts
import { appPaths } from '@/app/paths';

export interface Breadcrumb {
  label: string;
  href: string;
}

export function generateBreadcrumbs(pathname: string): Breadcrumb[] {
  const breadcrumbs: Breadcrumb[] = [{ label: 'Home', href: appPaths.home }];

  if (pathname.startsWith('/profile')) {
    breadcrumbs.push({
      label: 'Profile',
      href: appPaths.profile.root,
    });

    if (pathname.includes('/purchases')) {
      breadcrumbs.push({
        label: 'Purchases',
        href: appPaths.profile.purchases,
      });
    }
  }

  return breadcrumbs;
}
```

### Pattern: Active Link Detection

```typescript
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { profilePaths } from "@/app/profile/paths";

export function ProfileNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav>
      <Link
        href={profilePaths.purchases}
        className={isActive(profilePaths.purchases) ? "active" : ""}
      >
        Purchases
      </Link>
      <Link
        href={profilePaths.security}
        className={isActive(profilePaths.security) ? "active" : ""}
      >
        Security
      </Link>
    </nav>
  );
}
```

### Pattern: Prefixed Paths Helper

```typescript
// src/lib/prefixPaths.ts
export function prefixPaths<T extends Record<string, string | Function>>(
  prefix: string,
  paths: T
): T {
  return Object.entries(paths).reduce((acc, [key, value]) => {
    if (typeof value === 'function') {
      acc[key] = (...args: any[]) => `${prefix}${value(...args)}`;
    } else {
      acc[key] = `${prefix}${value}`;
    }
    return acc;
  }, {} as T);
}
```

**Usage:**

```typescript
import { prefixPaths } from '@/lib/prefixPaths';

const apiPaths = prefixPaths('/api', {
  users: '/users',
  user: (id: string) => `/users/${id}`,
});

// Results in:
// apiPaths.users -> "/api/users"
// apiPaths.user("123") -> "/api/users/123"
```

## Checklist for Routing Setup

When creating or reviewing routing implementation:

- [ ] Created `paths.ts` in feature directory
- [ ] Used `createPaths` utility
- [ ] Used `as const` for type inference
- [ ] Dynamic routes use function syntax
- [ ] Query parameters properly encoded
- [ ] Added to central `appPaths` registry
- [ ] Route groups use `(routes)` folder
- [ ] File structure matches URL structure
- [ ] Type-safe parameters for dynamic routes
- [ ] Paths tested with navigation
- [ ] No hardcoded paths in components

## Best Practices

1. **Centralize paths**: Always define paths in `paths.ts` files
2. **Type safety**: Use `as const` for proper type inference
3. **Functions for dynamic routes**: Use functions for routes with parameters
4. **Encode URIs**: Use `encodeURIComponent` for query parameters
5. **Single source of truth**: Import from `paths.ts`, never hardcode
6. **Organize by feature**: Each feature has its own paths file
7. **Route groups**: Use `(routes)` to organize route files
8. **Consistent naming**: Use consistent naming conventions

## Anti-Patterns to Avoid

❌ **Hardcoded paths in components**

```typescript
<Link href="/profile/purchases">Purchases</Link>  // Wrong!
// Should use: <Link href={profilePaths.purchases}>
```

❌ **String interpolation for dynamic routes**

```typescript
<Link href={`/items/${id}`}>Item</Link>  // Wrong!
// Should use: <Link href={itemsPaths.item(id)}>
```

❌ **Missing as const**

```typescript
export const paths = createPaths({
  root: '/auth',
}); // Missing 'as const'
```

❌ **Not encoding query parameters**

```typescript
const path = `/search?q=${query}`; // Wrong!
// Should use: `/search?q=${encodeURIComponent(query)}`
```

❌ **Direct path objects instead of functions**

```typescript
export const paths = createPaths({
  item: `/items/${id}`, // Wrong! 'id' not in scope
});
// Should be: item: (id: string) => `/items/${id}`
```

❌ **Duplicating paths**

```typescript
// In component A
const PROFILE_PATH = '/profile';

// In component B
const PROFILE_URL = '/profile';

// Should use centralized: profilePaths.root
```

## Navigation Examples

### Using Next.js Link

```typescript
import Link from "next/link";
import { appPaths } from "@/app/paths";

<Link href={appPaths.profile.root}>Profile</Link>
<Link href={appPaths.items.item(itemId)}>View Item</Link>
```

### Using Next.js Router

```typescript
"use client";

import { useRouter } from "next/navigation";
import { appPaths } from "@/app/paths";

export function Component() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(appPaths.profile.purchases);
  };

  return <button onClick={handleNavigate}>Go to Purchases</button>;
}
```

### Using Next.js redirect (Server)

```typescript
import { redirect } from "next/navigation";
import { appPaths } from "@/app/paths";

export default function Page() {
  const user = getUser();

  if (!user) {
    redirect(appPaths.auth.root);
  }

  return <div>Protected content</div>;
}
```

## Additional Resources

For more details:

- See `.claude/rules/routing-and-paths.md` for complete routing patterns
- See `src/lib/createPaths.ts` for the utility implementation
- See `src/lib/prefixPaths.ts` for path prefixing helper
- See existing feature paths for examples
