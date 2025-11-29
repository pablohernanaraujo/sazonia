---
name: firebase-client-patterns
description: Implement Firebase client-side patterns for React/Next.js applications. Use when working with Firebase Authentication client, Firestore real-time listeners, Firebase Storage uploads, client-side queries, or React hooks for Firebase.
---

# Firebase Client Patterns for React/Next.js

This Skill helps you implement Firebase in client-side contexts with React and Next.js, covering Firebase client SDK, authentication flows, real-time listeners, and React hooks.

## When to Use This Skill

- Initializing Firebase Client SDK
- User authentication (sign in, sign up, sign out)
- Real-time data listeners
- Client-side Firestore queries
- File uploads to Firebase Storage
- Custom React hooks for Firebase
- Auth state management

## Core Principles

### 1. Technology Stack

**Client-Side:**

- **Firebase JS SDK v9+**: Modular, tree-shakeable
- **React 18+/19+**: Hooks and Suspense
- **Next.js App Router**: Client components
- **Context API**: Global auth state

### 2. Modular vs Compat SDK

Always use the modular SDK (v9+) for better bundle size:

```typescript
// ✅ Modular (recommended)
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// ❌ Compat (deprecated)
import firebase from 'firebase/app';
firebase.auth().signInWithEmailAndPassword();
```

## Setup Patterns

### Pattern 1: Firebase Client Initialization

**Create Client Instance (Singleton):**

```typescript
// src/lib/firebase/client.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApps()[0];
  }
  return initializeApp(firebaseConfig);
}

const app = getFirebaseApp();

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export { app };
```

**Key Points:**

- Use `NEXT_PUBLIC_` prefix for client environment variables
- Use singleton pattern to prevent multiple initializations
- Export typed instances

### Pattern 2: Auth Context Provider

**Create Auth Context:**

```typescript
// src/contexts/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  type User,
  type UserCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      // Sync session with server
      if (user) {
        const idToken = await user.getIdToken();
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
      }
    });

    return unsubscribe;
  }, []);

  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    await fetch("/api/auth/session", { method: "DELETE" });
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!auth.currentUser) throw new Error("No user logged in");
    await updateProfile(auth.currentUser, data);
    // Force refresh user state
    setUser({ ...auth.currentUser });
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

**Setup in Layout:**

```typescript
// src/app/layout.tsx
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### Pattern 3: Authentication Components

**Sign In Form:**

```typescript
// src/components/auth/SignInForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FirebaseError } from "firebase/app";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/invalid-credential":
            setError("Invalid email or password");
            break;
          case "auth/user-disabled":
            setError("This account has been disabled");
            break;
          case "auth/too-many-requests":
            setError("Too many attempts. Please try again later");
            break;
          default:
            setError("An error occurred. Please try again");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError("Failed to sign in with Google");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full border py-2 rounded hover:bg-gray-50"
      >
        Sign in with Google
      </button>
    </form>
  );
}
```

**Sign Up Form:**

```typescript
// src/components/auth/SignUpForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FirebaseError } from "firebase/app";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, updateUserProfile } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/email-already-in-use":
            setError("An account with this email already exists");
            break;
          case "auth/invalid-email":
            setError("Invalid email address");
            break;
          case "auth/weak-password":
            setError("Password is too weak");
            break;
          default:
            setError("An error occurred. Please try again");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
```

### Pattern 4: Protected Client Components

**Auth Guard Component:**

```typescript
// src/components/auth/AuthGuard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return fallback || <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
```

**Usage:**

```typescript
// src/app/dashboard/page.tsx
"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardContent } from "./DashboardContent";

export default function DashboardPage() {
  return (
    <AuthGuard fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </AuthGuard>
  );
}
```

### Pattern 5: Firestore Real-time Listeners

**Custom Hook for Collection:**

```typescript
// src/hooks/useCollection.ts
'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  limit,
  type Query,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

interface UseCollectionOptions {
  constraints?: QueryConstraint[];
  enabled?: boolean;
}

export function useCollection<T = DocumentData>(
  collectionName: string,
  options: UseCollectionOptions = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { constraints = [], enabled = true } = options;

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Collection listener error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, JSON.stringify(constraints), enabled]);

  return { data, loading, error };
}

// Example usage with constraints
export function useUserDocuments(userId: string | undefined) {
  return useCollection<{ id: string; title: string; createdAt: Date }>(
    'documents',
    {
      constraints: [
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(20),
      ],
      enabled: !!userId,
    }
  );
}
```

**Custom Hook for Single Document:**

```typescript
// src/hooks/useDocument.ts
'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export function useDocument<T = DocumentData>(
  collectionName: string,
  documentId: string | undefined
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, collectionName, documentId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Document listener error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, documentId]);

  return { data, loading, error };
}
```

**Usage in Component:**

```typescript
// src/components/DocumentsList.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUserDocuments } from "@/hooks/useCollection";

export function DocumentsList() {
  const { user } = useAuth();
  const { data: documents, loading, error } = useUserDocuments(user?.uid);

  if (loading) return <div>Loading documents...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!documents.length) return <div>No documents found</div>;

  return (
    <ul>
      {documents.map((doc) => (
        <li key={doc.id}>{doc.title}</li>
      ))}
    </ul>
  );
}
```

### Pattern 6: Firestore Mutations

**Custom Hook for Mutations:**

```typescript
// src/hooks/useFirestoreMutation.ts
'use client';

import { useState, useCallback } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export function useAddDocument(collectionName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addDocument = useCallback(
    async (data: DocumentData) => {
      setLoading(true);
      setError(null);

      try {
        const docRef = await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return docRef.id;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  return { addDocument, loading, error };
}

export function useUpdateDocument(collectionName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateDocument = useCallback(
    async (documentId: string, data: Partial<DocumentData>) => {
      setLoading(true);
      setError(null);

      try {
        await updateDoc(doc(db, collectionName, documentId), {
          ...data,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  return { updateDocument, loading, error };
}

export function useDeleteDocument(collectionName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteDocument = useCallback(
    async (documentId: string) => {
      setLoading(true);
      setError(null);

      try {
        await deleteDoc(doc(db, collectionName, documentId));
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  return { deleteDocument, loading, error };
}
```

### Pattern 7: Firebase Storage Uploads

**File Upload Hook:**

```typescript
// src/hooks/useFileUpload.ts
'use client';

import { useState, useCallback } from 'react';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from '@/lib/firebase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UploadProgress {
  progress: number;
  state: 'running' | 'paused' | 'success' | 'error' | 'canceled';
}

interface UseFileUploadResult {
  uploadFile: (file: File, path?: string) => Promise<string>;
  deleteFile: (url: string) => Promise<void>;
  progress: UploadProgress | null;
  error: Error | null;
}

export function useFileUpload(): UseFileUploadResult {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = useCallback(
    async (file: File, customPath?: string): Promise<string> => {
      if (!user) {
        throw new Error('Must be logged in to upload files');
      }

      const path = customPath || `users/${user.uid}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);

      return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress({
              progress,
              state: snapshot.state as UploadProgress['state'],
            });
          },
          (err) => {
            setError(err);
            setProgress({ progress: 0, state: 'error' });
            reject(err);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setProgress({ progress: 100, state: 'success' });
            resolve(downloadURL);
          }
        );
      });
    },
    [user]
  );

  const deleteFile = useCallback(async (url: string) => {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  }, []);

  return { uploadFile, deleteFile, progress, error };
}
```

**Upload Component:**

```typescript
// src/components/FileUpload.tsx
"use client";

import { useState, useRef } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
}

export function FileUpload({
  onUpload,
  accept = "image/*",
  maxSize = 5,
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, progress } = useFileUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    try {
      const url = await uploadFile(file);
      onUpload(url);
    } catch (err) {
      setError("Failed to upload file");
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="px-4 py-2 border rounded hover:bg-gray-50"
      >
        Choose File
      </button>

      {progress && progress.state === "running" && (
        <div className="w-full bg-gray-200 rounded">
          <div
            className="bg-blue-600 h-2 rounded transition-all"
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
```

### Pattern 8: Optimistic Updates

**Optimistic Update Pattern:**

```typescript
// src/hooks/useOptimisticDocument.ts
'use client';

import { useState, useCallback } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export function useOptimisticUpdate<T extends { id: string }>(
  collectionName: string
) {
  const [optimisticData, setOptimisticData] = useState<Partial<T> | null>(null);

  const updateWithOptimism = useCallback(
    async (documentId: string, updates: Partial<T>, currentData: T) => {
      // Apply optimistic update immediately
      setOptimisticData(updates);

      try {
        await updateDoc(doc(db, collectionName, documentId), {
          ...updates,
          updatedAt: serverTimestamp(),
        });
        // Clear optimistic data on success (real data will come from listener)
        setOptimisticData(null);
      } catch (error) {
        // Revert on failure
        setOptimisticData(null);
        throw error;
      }
    },
    [collectionName]
  );

  const getMergedData = useCallback(
    (realData: T | null): T | null => {
      if (!realData) return null;
      if (!optimisticData) return realData;
      return { ...realData, ...optimisticData };
    },
    [optimisticData]
  );

  return { updateWithOptimism, getMergedData, isPending: !!optimisticData };
}
```

### Pattern 9: Pagination

**Paginated Collection Hook:**

```typescript
// src/hooks/usePaginatedCollection.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  collection,
  query,
  getDocs,
  startAfter,
  limit,
  orderBy,
  type QueryConstraint,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

interface UsePaginatedCollectionOptions {
  pageSize?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  constraints?: QueryConstraint[];
}

export function usePaginatedCollection<T = DocumentData>(
  collectionName: string,
  options: UsePaginatedCollectionOptions = {}
) {
  const {
    pageSize = 10,
    orderByField = 'createdAt',
    orderDirection = 'desc',
    constraints = [],
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(
    async (isInitial = false) => {
      if (loading || (!hasMore && !isInitial)) return;

      setLoading(true);
      setError(null);

      try {
        const collectionRef = collection(db, collectionName);
        const queryConstraints: QueryConstraint[] = [
          ...constraints,
          orderBy(orderByField, orderDirection),
          limit(pageSize),
        ];

        if (!isInitial && lastDoc) {
          queryConstraints.push(startAfter(lastDoc));
        }

        const q = query(collectionRef, ...queryConstraints);
        const snapshot = await getDocs(q);

        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];

        if (isInitial) {
          setData(docs);
        } else {
          setData((prev) => [...prev, ...docs]);
        }

        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === pageSize);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [
      collectionName,
      constraints,
      orderByField,
      orderDirection,
      pageSize,
      lastDoc,
      hasMore,
      loading,
    ]
  );

  const loadMore = useCallback(() => fetchPage(false), [fetchPage]);

  const refresh = useCallback(() => {
    setLastDoc(null);
    setHasMore(true);
    setData([]);
    fetchPage(true);
  }, [fetchPage]);

  // Initial fetch
  useEffect(() => {
    fetchPage(true);
  }, []);

  return { data, loading, error, hasMore, loadMore, refresh };
}
```

**Infinite Scroll Component:**

```typescript
// src/components/InfiniteScrollList.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePaginatedCollection } from "@/hooks/usePaginatedCollection";
import { where } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

export function InfiniteScrollList() {
  const { user } = useAuth();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, loading, hasMore, loadMore } = usePaginatedCollection(
    "documents",
    {
      pageSize: 20,
      constraints: user ? [where("userId", "==", user.uid)] : [],
    }
  );

  useEffect(() => {
    if (!loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <div>
      <ul>
        {data.map((item: any) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>

      <div ref={loadMoreRef} className="h-10">
        {loading && <p>Loading more...</p>}
        {!hasMore && <p>No more items</p>}
      </div>
    </div>
  );
}
```

### Pattern 10: Error Handling

**Firebase Error Handler:**

```typescript
// src/lib/firebase/errors.ts
import { FirebaseError } from 'firebase/app';

export type FirebaseErrorCode =
  | 'auth/email-already-in-use'
  | 'auth/invalid-credential'
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/too-many-requests'
  | 'auth/weak-password'
  | 'permission-denied'
  | 'not-found'
  | 'unavailable'
  | string;

const errorMessages: Record<string, string> = {
  'auth/email-already-in-use': 'An account with this email already exists',
  'auth/invalid-credential': 'Invalid email or password',
  'auth/invalid-email': 'Invalid email address',
  'auth/user-disabled': 'This account has been disabled',
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/too-many-requests': 'Too many attempts. Please try again later',
  'auth/weak-password': 'Password is too weak',
  'permission-denied': "You don't have permission to perform this action",
  'not-found': 'The requested resource was not found',
  unavailable: 'Service temporarily unavailable. Please try again',
};

export function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return errorMessages[error.code] || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

export function isFirebaseError(error: unknown): error is FirebaseError {
  return error instanceof FirebaseError;
}
```

**Error Boundary for Firebase:**

```typescript
// src/components/FirebaseErrorBoundary.tsx
"use client";

import { Component, type ReactNode } from "react";
import { getFirebaseErrorMessage } from "@/lib/firebase/errors";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class FirebaseErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <p className="text-red-600">
            {getFirebaseErrorMessage(this.state.error)}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Environment Variables

Required client-side environment variables:

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Client Checklist

When implementing Firebase client-side:

- [ ] Initialize Firebase with singleton pattern
- [ ] Create AuthContext with all auth methods
- [ ] Handle loading states during auth checks
- [ ] Implement proper error handling with Firebase codes
- [ ] Use real-time listeners for live data
- [ ] Clean up listeners in useEffect
- [ ] Implement file upload with progress tracking
- [ ] Handle pagination for large datasets
- [ ] Sync session cookies with server
- [ ] Use optimistic updates for better UX

## Best Practices

1. **Modular SDK**: Always use v9+ modular imports
2. **Singleton**: Initialize Firebase once
3. **Loading States**: Always handle loading during auth
4. **Cleanup**: Unsubscribe from listeners
5. **Error Handling**: Map Firebase errors to user-friendly messages
6. **Type Safety**: Define TypeScript interfaces for documents
7. **Optimistic Updates**: Update UI before server confirms

## Anti-Patterns to Avoid

❌ **Using Firebase in server components**

```typescript
// WRONG in server component
import { auth } from '@/lib/firebase/client';
// Use Admin SDK for server-side
```

❌ **Not cleaning up listeners**

```typescript
useEffect(() => {
  onSnapshot(doc, callback); // Memory leak!
  // Always return unsubscribe
}, []);
```

❌ **Importing entire Firebase**

```typescript
// WRONG - imports everything
import firebase from 'firebase/app';

// CORRECT - tree-shakeable
import { getAuth } from 'firebase/auth';
```

❌ **Not checking isLoaded/user before operations**

```typescript
// WRONG
const { user } = useAuth();
await addDoc(collection(db, 'posts'), { userId: user.uid }); // Crash if null!
```

## Additional Resources

- See `.claude/skills/firebase-ssr-patterns/SKILL.md` for server-side patterns
- See `.claude/rules/firebase-security.md` for security rules
- Firebase JS SDK docs: https://firebase.google.com/docs/web/setup
