---
name: firebase-ssr-patterns
description: Implement Firebase Server-Side Rendering patterns for Next.js App Router. Use when working with Firebase Authentication SSR, Firestore server queries, Firebase Admin SDK, server actions with Firebase, or data fetching in server components.
---

# Firebase SSR Patterns for Next.js

This Skill helps you implement Firebase in server-side contexts with Next.js App Router, covering Firebase Admin SDK, server components, server actions, and middleware integration.

## When to Use This Skill

- Initializing Firebase Admin SDK
- Server-side authentication verification
- Fetching Firestore data in server components
- Server actions with Firebase
- Middleware authentication
- Managing cookies for session persistence
- Server-side data validation

## Core Principles

### 1. Technology Stack

**Server-Side:**

- **Firebase Admin SDK**: Server-side operations
- **Next.js 15+**: App Router with server components
- **Service Account**: Server authentication
- **Cookies**: Session management

### 2. Firebase Admin vs Client SDK

| Aspect  | Admin SDK               | Client SDK              |
| ------- | ----------------------- | ----------------------- |
| Where   | Server only             | Client only             |
| Auth    | Service account         | User credentials        |
| Rules   | Bypasses security rules | Respects security rules |
| Package | `firebase-admin`        | `firebase`              |

## Setup Patterns

### Pattern 1: Firebase Admin Initialization

**Create Admin Instance (Singleton):**

```typescript
// src/lib/firebase/admin.ts
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Option 1: Using service account JSON file
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
  );

  return initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const app = getFirebaseAdminApp();

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export const adminStorage = getStorage(app);
```

**Alternative with Individual Env Vars:**

```typescript
// src/lib/firebase/admin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace escaped newlines in private key
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminApp = getFirebaseAdminApp();
```

**Key Points:**

- Use singleton pattern to prevent multiple initializations
- Store credentials in environment variables
- Never expose service account in client code
- Handle private key newline escaping

### Pattern 2: Server Component Authentication

**Verify Session in Server Component:**

```typescript
// src/lib/firebase/auth-server.ts
import { cookies } from 'next/headers';
import { adminAuth } from './admin';

export async function getServerSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('__session')?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true // Check if revoked
    );
    return decodedClaims;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getServerSession();

  if (!session) {
    return null;
  }

  try {
    const user = await adminAuth.getUser(session.uid);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      customClaims: user.customClaims,
    };
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
}
```

**Protected Server Component:**

```typescript
// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/firebase/auth-server";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <h1>Welcome, {user.displayName || user.email}</h1>
      <p>Your UID: {user.uid}</p>
    </div>
  );
}
```

### Pattern 3: Session Cookie Management

**Create Session Cookie API Route:**

```typescript
// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';

// Session duration: 5 days
const SESSION_DURATION = 60 * 60 * 24 * 5 * 1000;

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token required' }, { status: 400 });
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Only allow recent sign-ins (within 5 minutes)
    const authTime = decodedToken.auth_time * 1000;
    if (Date.now() - authTime > 5 * 60 * 1000) {
      return NextResponse.json(
        { error: 'Recent sign-in required' },
        { status: 401 }
      );
    }

    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('__session');

  return NextResponse.json({ success: true });
}
```

### Pattern 4: Firestore Server Queries

**Server Component Data Fetching:**

```typescript
// src/lib/firebase/firestore-server.ts
import { adminDb } from './admin';
import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase-admin/firestore';

// Type-safe document converter
function converter<T extends DocumentData>() {
  return {
    toFirestore: (data: T) => data,
    fromFirestore: (snap: QueryDocumentSnapshot): T => {
      const data = snap.data();
      // Convert Timestamps to Dates
      return convertTimestamps(data) as T;
    },
  };
}

function convertTimestamps(obj: DocumentData): DocumentData {
  const result: DocumentData = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Timestamp) {
      result[key] = value.toDate();
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = convertTimestamps(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

// Example: Get user's documents
export async function getUserDocuments(userId: string) {
  const snapshot = await adminDb
    .collection('documents')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Example: Get single document
export async function getDocument(id: string) {
  const doc = await adminDb.collection('documents').doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
}
```

**Use in Server Component:**

```typescript
// src/app/documents/page.tsx
import { getCurrentUser } from "@/lib/firebase/auth-server";
import { getUserDocuments } from "@/lib/firebase/firestore-server";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const documents = await getUserDocuments(user.uid);

  return (
    <div>
      <h1>Your Documents</h1>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>{doc.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Pattern 5: Server Actions with Firebase

**Create Document Server Action:**

```typescript
// src/app/documents/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase/admin';
import { getServerSession } from '@/lib/firebase/auth-server';
import { FieldValue } from 'firebase-admin/firestore';

interface CreateDocumentInput {
  title: string;
  content: string;
}

export async function createDocument(data: CreateDocumentInput) {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const docRef = await adminDb.collection('documents').add({
    ...data,
    userId: session.uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  revalidatePath('/documents');

  return { id: docRef.id };
}

export async function deleteDocument(documentId: string) {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  // Verify ownership
  const doc = await adminDb.collection('documents').doc(documentId).get();

  if (!doc.exists || doc.data()?.userId !== session.uid) {
    throw new Error('Document not found or unauthorized');
  }

  await adminDb.collection('documents').doc(documentId).delete();

  revalidatePath('/documents');
}

export async function updateDocument(
  documentId: string,
  data: Partial<CreateDocumentInput>
) {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  const docRef = adminDb.collection('documents').doc(documentId);
  const doc = await docRef.get();

  if (!doc.exists || doc.data()?.userId !== session.uid) {
    throw new Error('Document not found or unauthorized');
  }

  await docRef.update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });

  revalidatePath('/documents');
  revalidatePath(`/documents/${documentId}`);
}
```

### Pattern 6: Middleware Authentication

**Firebase Auth Middleware:**

```typescript
// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings'];

// Routes only for unauthenticated users
const authRoutes = ['/auth/login', '/auth/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value;

  // Check if route requires auth
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
```

**Note:** For full token verification in middleware, consider using Edge-compatible JWT verification or call an API route.

### Pattern 7: Custom Claims (Roles/Permissions)

**Set Custom Claims (Server Action):**

```typescript
// src/app/admin/actions.ts
'use server';

import { adminAuth } from '@/lib/firebase/admin';
import { getServerSession } from '@/lib/firebase/auth-server';

export async function setUserRole(userId: string, role: string) {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  // Verify admin has permission
  const adminUser = await adminAuth.getUser(session.uid);
  if (adminUser.customClaims?.role !== 'admin') {
    throw new Error('Only admins can set roles');
  }

  await adminAuth.setCustomUserClaims(userId, { role });

  return { success: true };
}
```

**Check Claims in Server Component:**

```typescript
// src/app/admin/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/firebase/auth-server";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.customClaims?.role !== "admin") {
    redirect("/");
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Admin content */}
    </div>
  );
}
```

### Pattern 8: Batch Operations

**Server-Side Batch Write:**

```typescript
// src/lib/firebase/batch-operations.ts
import { adminDb } from './admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function createMultipleDocuments(
  userId: string,
  items: Array<{ title: string; content: string }>
) {
  const batch = adminDb.batch();
  const collectionRef = adminDb.collection('documents');

  const docRefs = items.map((item) => {
    const docRef = collectionRef.doc();
    batch.set(docRef, {
      ...item,
      userId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return docRef.id;
  });

  await batch.commit();

  return docRefs;
}

export async function deleteUserData(userId: string) {
  const batch = adminDb.batch();

  // Delete user's documents
  const docsSnapshot = await adminDb
    .collection('documents')
    .where('userId', '==', userId)
    .get();

  docsSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
}
```

### Pattern 9: Transactions

**Server-Side Transaction:**

```typescript
// src/lib/firebase/transactions.ts
import { adminDb } from './admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function transferCredits(
  fromUserId: string,
  toUserId: string,
  amount: number
) {
  return adminDb.runTransaction(async (transaction) => {
    const fromRef = adminDb.collection('users').doc(fromUserId);
    const toRef = adminDb.collection('users').doc(toUserId);

    const fromDoc = await transaction.get(fromRef);
    const toDoc = await transaction.get(toRef);

    if (!fromDoc.exists || !toDoc.exists) {
      throw new Error('User not found');
    }

    const fromCredits = fromDoc.data()?.credits || 0;

    if (fromCredits < amount) {
      throw new Error('Insufficient credits');
    }

    transaction.update(fromRef, {
      credits: FieldValue.increment(-amount),
      updatedAt: FieldValue.serverTimestamp(),
    });

    transaction.update(toRef, {
      credits: FieldValue.increment(amount),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { success: true };
  });
}
```

### Pattern 10: Storage Server Operations

**Generate Signed URLs:**

```typescript
// src/lib/firebase/storage-server.ts
import { adminStorage } from './admin';

export async function getSignedDownloadUrl(
  filePath: string,
  expiresInMinutes = 60
) {
  const bucket = adminStorage.bucket();
  const file = bucket.file(filePath);

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + expiresInMinutes * 60 * 1000,
  });

  return url;
}

export async function getSignedUploadUrl(
  filePath: string,
  contentType: string,
  expiresInMinutes = 15
) {
  const bucket = adminStorage.bucket();
  const file = bucket.file(filePath);

  const [url] = await file.getSignedUrl({
    action: 'write',
    expires: Date.now() + expiresInMinutes * 60 * 1000,
    contentType,
  });

  return url;
}

export async function deleteFile(filePath: string) {
  const bucket = adminStorage.bucket();
  await bucket.file(filePath).delete();
}
```

## Environment Variables

Required environment variables for Firebase Admin:

```bash
# .env.local
# Option 1: Full service account JSON
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"..."}'

# Option 2: Individual values
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Shared with client
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

## SSR Checklist

When implementing Firebase SSR:

- [ ] Initialize Admin SDK with singleton pattern
- [ ] Store credentials securely in environment variables
- [ ] Implement session cookie for auth persistence
- [ ] Create auth verification utilities
- [ ] Handle Timestamp conversions for serialization
- [ ] Use server actions for mutations
- [ ] Implement proper error handling
- [ ] Add role-based access with custom claims
- [ ] Use batch operations for multiple writes
- [ ] Generate signed URLs for protected storage access

## Best Practices

1. **Singleton Initialization**: Always use singleton pattern for Admin SDK
2. **Session Cookies**: Prefer session cookies over ID tokens for SSR
3. **Type Conversions**: Convert Firestore Timestamps for serialization
4. **Error Boundaries**: Handle Firebase errors gracefully
5. **Caching**: Leverage Next.js caching with `revalidatePath`
6. **Security**: Never expose service account credentials
7. **Transactions**: Use transactions for atomic operations

## Anti-Patterns to Avoid

❌ **Importing Admin SDK in client code**

```typescript
// NEVER do this in client components
import { adminAuth } from '@/lib/firebase/admin'; // WRONG!
```

❌ **Not handling Timestamp serialization**

```typescript
// This will fail in React Server Components
return { createdAt: doc.data().createdAt }; // Timestamp is not serializable
```

❌ **Multiple Admin initializations**

```typescript
// WRONG - creates multiple instances
export function getDb() {
  const app = initializeApp(config); // Creates new app each time
  return getFirestore(app);
}
```

❌ **Storing ID tokens in cookies directly**

```typescript
// WRONG - ID tokens expire in 1 hour
cookies.set('token', idToken); // Use session cookies instead
```

## Additional Resources

- See `.claude/skills/firebase-client-patterns/SKILL.md` for client-side patterns
- See `.claude/rules/firebase-security.md` for security rules
- Firebase Admin SDK docs: https://firebase.google.com/docs/admin/setup
