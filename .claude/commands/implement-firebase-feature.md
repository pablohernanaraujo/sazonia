# Implement Firebase Feature

Implement a Firebase feature following SSR and client patterns for Next.js App Router.

## Instructions

When implementing a Firebase feature, follow these steps:

### 1. Analyze Requirements

First, understand what needs to be built:

- What data collections are needed?
- What authentication is required?
- Is real-time data needed?
- What security rules apply?

### 2. Design Data Model

Create TypeScript interfaces for Firestore documents:

```typescript
// src/types/firebase/[feature].ts
export interface Document {
  id: string;
  // fields...
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Implement Server Layer

For data that needs SSR:

```typescript
// src/lib/firebase/[feature]-server.ts
import { adminDb } from './admin';
import { getServerSession } from './auth-server';

export async function getDocuments() {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const snapshot = await adminDb
    .collection('documents')
    .where('userId', '==', session.uid)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
```

### 4. Implement Server Actions

For mutations:

```typescript
// src/app/[feature]/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase/admin';
import { getServerSession } from '@/lib/firebase/auth-server';
import { FieldValue } from 'firebase-admin/firestore';

export async function createDocument(data: CreateInput) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  await adminDb.collection('documents').add({
    ...data,
    userId: session.uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  revalidatePath('/[feature]');
}
```

### 5. Implement Client Hooks

For real-time data:

```typescript
// src/hooks/use[Feature].ts
'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useDocuments() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'documents'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return { data, loading };
}
```

### 6. Create Server Component

For initial data load:

```typescript
// src/app/[feature]/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/firebase/auth-server";
import { getDocuments } from "@/lib/firebase/[feature]-server";
import { DocumentsList } from "./components/DocumentsList";

export default async function FeaturePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const documents = await getDocuments();

  return <DocumentsList initialData={documents} />;
}
```

### 7. Create Client Component

With hydration and real-time updates:

```typescript
// src/app/[feature]/components/DocumentsList.tsx
"use client";

import { useDocuments } from "@/hooks/use[Feature]";

interface Props {
  initialData: Document[];
}

export function DocumentsList({ initialData }: Props) {
  const { data, loading } = useDocuments();

  // Use real-time data after hydration, initial for SSR
  const documents = loading ? initialData : data;

  return (
    <ul>
      {documents.map((doc) => (
        <li key={doc.id}>{doc.title}</li>
      ))}
    </ul>
  );
}
```

### 8. Write Security Rules

```javascript
// firestore.rules
match /documents/{docId} {
  allow read: if request.auth != null
    && resource.data.userId == request.auth.uid;

  allow create: if request.auth != null
    && request.resource.data.userId == request.auth.uid
    && request.resource.data.keys().hasAll(['title', 'content', 'userId']);

  allow update: if request.auth != null
    && resource.data.userId == request.auth.uid
    && request.resource.data.userId == resource.data.userId;

  allow delete: if request.auth != null
    && resource.data.userId == request.auth.uid;
}
```

### 9. Add Firestore Indexes

If using compound queries, add to `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "documents",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

### 10. Test the Implementation

- [ ] Server component renders with data
- [ ] Client component shows real-time updates
- [ ] Create/Update/Delete work via server actions
- [ ] Security rules block unauthorized access
- [ ] Error states handled gracefully
- [ ] Loading states shown appropriately

## File Structure

After implementation, you should have:

```
src/
├── app/
│   └── [feature]/
│       ├── page.tsx              # Server component
│       ├── actions.ts            # Server actions
│       └── components/
│           └── [Component].tsx   # Client components
├── hooks/
│   └── use[Feature].ts           # Real-time hooks
├── lib/
│   └── firebase/
│       ├── admin.ts              # Admin SDK (if new)
│       ├── client.ts             # Client SDK (if new)
│       ├── auth-server.ts        # Auth utilities (if new)
│       └── [feature]-server.ts   # Feature server queries
└── types/
    └── firebase/
        └── [feature].ts          # TypeScript types
```

## Related Resources

- `.claude/skills/firebase-ssr-patterns/SKILL.md`
- `.claude/skills/firebase-client-patterns/SKILL.md`
- `.claude/rules/firebase-security.md`
- `.claude/agents/firebase-architecture.md`
