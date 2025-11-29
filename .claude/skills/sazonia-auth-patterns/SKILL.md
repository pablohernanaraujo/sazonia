---
name: sazonia-auth-patterns
description: Implement Clerk authentication patterns for protected routes, user sessions, and auth state management. Use when working with authentication, protected pages, user sessions, Clerk integration, auth middleware, or user identity management.
---

# Sazonia Authentication Patterns

This Skill helps you implement authentication using Clerk in sazonia-web, covering server-side and client-side authentication, protected routes, and token management.

## When to Use This Skill

- Implementing authentication in pages
- Creating protected routes
- Accessing user session data
- Setting up auth middleware
- Injecting auth tokens in API calls
- Managing user identity

## Core Principles

### 1. Authentication Stack

**Technologies:**

- **Clerk**: Authentication and user management
- **Next.js 15**: App Router with server/client components
- **Middleware**: Route protection
- **Axios Interceptors**: Token injection

### 2. Server vs Client Authentication

**Server Components**: Use `auth()` from `@clerk/nextjs/server`
**Client Components**: Use `useAuth()` from `@clerk/nextjs`

## Authentication Patterns

### Pattern 1: Server Component Authentication

**Protected Server Component:**

```typescript
// src/app/profile/(routes)/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { appPaths } from "@/app/paths";

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect(appPaths.auth.root);
  }

  // User is authenticated, fetch user data
  const userData = await getUserData(userId);

  return (
    <div>
      <h1>Welcome, {userData.name}</h1>
    </div>
  );
}
```

**Key Points:**

- Import `auth` from `@clerk/nextjs/server`
- Must `await auth()` to get session
- Check `userId` for authentication
- Use `redirect()` for unauthenticated users

### Pattern 2: Client Component Authentication

**Protected Client Component:**

```typescript
// src/app/profile/components/ProfileSettings.tsx
"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { appPaths } from "@/app/paths";

export function ProfileSettings() {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(appPaths.auth.root);
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId || !user) {
    return null;
  }

  return (
    <div>
      <h2>Settings for {user.firstName}</h2>
    </div>
  );
}
```

**Key Points:**

- Import `useAuth` and `useUser` from `@clerk/nextjs`
- Check `isLoaded` before checking auth state
- Use `useEffect` for redirects in client components
- Handle loading state while checking auth

### Pattern 3: Middleware for Route Protection

**Auth Middleware:**

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes (accessible without auth)
const isPublicRoute = createRouteMatcher([
  '/',
  '/auth(.*)',
  '/items(.*)',
  '/search(.*)',
  '/api/health',
]);

export default clerkMiddleware((auth, req) => {
  // Protect all routes that are not public
  if (!isPublicRoute(req)) {
    auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
```

**Key Points:**

- Use `clerkMiddleware` from `@clerk/nextjs/server`
- Define public routes with `createRouteMatcher`
- Call `auth().protect()` for protected routes
- Configure matcher to skip static files

### Pattern 4: Accessing User Data

**In Server Component:**

```typescript
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function UserProfile() {
  // Option 1: Get userId only
  const { userId } = await auth();

  // Option 2: Get full user object
  const user = await currentUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
      <p>Name: {user.firstName} {user.lastName}</p>
      <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
```

**In Client Component:**

```typescript
"use client";

import { useUser } from "@clerk/nextjs";

export function UserProfile() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Not signed in</div>;

  return (
    <div>
      <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
      <p>Name: {user.firstName} {user.lastName}</p>
    </div>
  );
}
```

### Pattern 5: Token Injection in API Calls

**Axios Interceptor Setup:**

```typescript
// src/hooks/useAxiosAuthInterceptor.ts
'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { api } from '@/api';

export function useAxiosAuthInterceptor() {
  const { getToken } = useAuth();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      async (config) => {
        const token = await getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [getToken]);
}
```

**Usage in Layout:**

```typescript
"use client";

import { useAxiosAuthInterceptor } from "@/hooks/useAxiosAuthInterceptor";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAxiosAuthInterceptor();
  return <>{children}</>;
}
```

### Pattern 6: Sign In/Out Actions

**Sign Out Button:**

```typescript
"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/ui";
import { appPaths } from "@/app/paths";

export function SignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push(appPaths.home);
  };

  return (
    <Button onClick={handleSignOut} variant="ghost">
      Sign Out
    </Button>
  );
}
```

**Sign In Link:**

```typescript
import Link from "next/link";
import { Button } from "@/ui";
import { appPaths } from "@/app/paths";

export function SignInButton() {
  return (
    <Button asChild>
      <Link href={appPaths.auth.root}>Sign In</Link>
    </Button>
  );
}
```

### Pattern 7: Conditional Rendering Based on Auth

**Show/Hide Based on Auth Status:**

```typescript
"use client";

import { useAuth } from "@clerk/nextjs";
import { SignInButton } from "./sign-in-button";
import { UserMenu } from "./user-menu";

export function AuthNav() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="h-10 w-10 animate-pulse bg-gray-200 rounded" />;
  }

  return (
    <div>
      {isSignedIn ? <UserMenu /> : <SignInButton />}
    </div>
  );
}
```

### Pattern 8: Custom Claims and Metadata

**Reading Custom Metadata:**

```typescript
"use client";

import { useUser } from "@clerk/nextjs";

export function UserRole() {
  const { user } = useUser();

  const role = user?.publicMetadata?.role as string | undefined;
  const isAdmin = role === "admin";

  if (isAdmin) {
    return <div>Admin Dashboard Access</div>;
  }

  return <div>User Dashboard</div>;
}
```

**Updating User Metadata:**

```typescript
"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/ui";

export function UpdateProfileButton() {
  const { user } = useUser();

  const handleUpdate = async () => {
    await user?.update({
      unsafeMetadata: {
        preferences: {
          theme: "dark",
          notifications: true,
        },
      },
    });
  };

  return <Button onClick={handleUpdate}>Save Preferences</Button>;
}
```

### Pattern 9: Auth Loading States

**Proper Loading State Handling:**

```typescript
"use client";

import { useAuth, useUser } from "@clerk/nextjs";

export function UserDashboard() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();

  // Wait for both auth and user to load
  if (!authLoaded || !userLoaded) {
    return <DashboardSkeleton />;
  }

  // Handle not signed in
  if (!isSignedIn || !user) {
    return <SignInPrompt />;
  }

  // Render dashboard
  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
    </div>
  );
}
```

### Pattern 10: Server Actions with Auth

**Protected Server Action:**

```typescript
// src/app/profile/actions.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;

  // Update profile in database
  await updateUserProfile(userId, { name });

  // Revalidate the profile page
  revalidatePath('/profile');

  return { success: true };
}
```

## Authentication Checklist

When implementing authentication:

- [ ] Import correct auth utilities (server vs client)
- [ ] Check `isLoaded` before checking auth state (client)
- [ ] Handle loading states during auth checks
- [ ] Use `redirect()` in server components
- [ ] Use `useRouter()` in client components
- [ ] Protect routes with middleware
- [ ] Inject tokens in API calls
- [ ] Handle sign out properly
- [ ] Show appropriate loading states
- [ ] Handle unauthenticated states gracefully

## Best Practices

1. **Server-First**: Prefer server component auth when possible
2. **Loading States**: Always handle `isLoaded` state
3. **Middleware Protection**: Use middleware for route-level protection
4. **Token Injection**: Automatically inject tokens in API calls
5. **Type Safety**: Type custom metadata properly
6. **Error Handling**: Handle auth errors gracefully
7. **Redirects**: Use appropriate redirect methods (server vs client)

## Anti-Patterns to Avoid

❌ **Not checking isLoaded**

```typescript
const { userId } = useAuth();
if (!userId) return <SignIn />;  // Wrong! Check isLoaded first
```

❌ **Wrong import for server components**

```typescript
import { useAuth } from '@clerk/nextjs'; // Wrong in server component!
// Use: import { auth } from "@clerk/nextjs/server";
```

❌ **Not awaiting auth() in server**

```typescript
const { userId } = auth(); // Wrong! Must await
// Correct: const { userId } = await auth();
```

❌ **Manual token management**

```typescript
const token = localStorage.getItem('token'); // Wrong!
// Use Clerk's getToken() method
```

## Additional Resources

For more details:

- See `.claude/rules/authentication-patterns.md` for complete auth patterns
- See Clerk documentation: https://clerk.com/docs
- See existing auth implementations in `src/app/auth/`
