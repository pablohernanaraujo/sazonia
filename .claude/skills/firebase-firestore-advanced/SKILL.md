---
name: firebase-firestore-advanced
description: Advanced Firestore patterns including complex queries, aggregations, transactions, batch operations, offline support, and data modeling. Use when working with complex Firestore operations, data denormalization, subcollections, or performance optimization.
---

# Advanced Firestore Patterns

This Skill covers advanced Firestore patterns for complex applications, including data modeling, aggregations, transactions, and performance optimization.

## When to Use This Skill

- Designing complex data models
- Implementing aggregation queries
- Working with transactions and batches
- Optimizing query performance
- Handling offline-first scenarios
- Implementing full-text search alternatives

## Data Modeling Patterns

### Pattern 1: Denormalization for Read Performance

**Problem:** Multiple reads needed to display a list item.

**Solution:** Denormalize frequently-read data.

```typescript
// Instead of:
interface Post {
  id: string;
  title: string;
  authorId: string; // Requires separate read for author name
}

// Use:
interface Post {
  id: string;
  title: string;
  authorId: string;
  authorName: string; // Denormalized
  authorAvatar: string; // Denormalized
}

// Update denormalized data when source changes
export async function updateUserName(userId: string, newName: string) {
  const batch = adminDb.batch();

  // Update user document
  batch.update(adminDb.collection('users').doc(userId), { name: newName });

  // Update all posts by this user
  const posts = await adminDb
    .collection('posts')
    .where('authorId', '==', userId)
    .get();

  posts.docs.forEach((doc) => {
    batch.update(doc.ref, { authorName: newName });
  });

  await batch.commit();
}
```

### Pattern 2: Subcollections vs Root Collections

**Use Subcollections When:**

- Data is hierarchical (comments on posts)
- You always query within parent context
- Data should be deleted with parent

```typescript
// Subcollection structure
// posts/{postId}/comments/{commentId}

async function getComments(postId: string) {
  return adminDb
    .collection('posts')
    .doc(postId)
    .collection('comments')
    .orderBy('createdAt', 'desc')
    .get();
}

// Cascade delete with parent
async function deletePostWithComments(postId: string) {
  const batch = adminDb.batch();

  // Delete all comments
  const comments = await adminDb
    .collection('posts')
    .doc(postId)
    .collection('comments')
    .get();

  comments.docs.forEach((doc) => batch.delete(doc.ref));

  // Delete post
  batch.delete(adminDb.collection('posts').doc(postId));

  await batch.commit();
}
```

**Use Root Collections When:**

- Data needs to be queried across parents
- Data has independent lifecycle
- Collection groups are needed

```typescript
// Root collection structure
// comments/{commentId} with postId field

async function getUserComments(userId: string) {
  // Can query across all posts
  return adminDb
    .collection('comments')
    .where('authorId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
}
```

### Pattern 3: Collection Group Queries

Query across all subcollections with the same name:

```typescript
// Structure: posts/{postId}/comments/{commentId}

// Query all comments by a user across all posts
async function getAllUserComments(userId: string) {
  return adminDb
    .collectionGroup('comments')
    .where('authorId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();
}
```

**Required Index:**

```json
{
  "indexes": [],
  "fieldOverrides": [
    {
      "collectionGroup": "comments",
      "fieldPath": "authorId",
      "indexes": [{ "queryScope": "COLLECTION_GROUP" }]
    }
  ]
}
```

## Advanced Query Patterns

### Pattern 4: Compound Queries

```typescript
// Multiple where clauses
async function getFilteredPosts(
  category: string,
  status: string,
  minLikes: number
) {
  return adminDb
    .collection('posts')
    .where('category', '==', category)
    .where('status', '==', status)
    .where('likes', '>=', minLikes)
    .orderBy('likes', 'desc')
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();
}
```

**Required Index:**

```json
{
  "collectionGroup": "posts",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "category", "order": "ASCENDING" },
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "likes", "order": "DESCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

### Pattern 5: Array Queries

```typescript
interface Post {
  id: string;
  title: string;
  tags: string[];
}

// Find posts with a specific tag
async function getPostsByTag(tag: string) {
  return adminDb.collection('posts').where('tags', 'array-contains', tag).get();
}

// Find posts with any of multiple tags
async function getPostsByAnyTag(tags: string[]) {
  return adminDb
    .collection('posts')
    .where('tags', 'array-contains-any', tags.slice(0, 10)) // Max 10
    .get();
}
```

### Pattern 6: In Queries

```typescript
// Get multiple documents by ID
async function getPostsByIds(postIds: string[]) {
  // Split into chunks of 30 (Firestore limit)
  const chunks = [];
  for (let i = 0; i < postIds.length; i += 30) {
    chunks.push(postIds.slice(i, i + 30));
  }

  const results = await Promise.all(
    chunks.map((chunk) =>
      adminDb.collection('posts').where('__name__', 'in', chunk).get()
    )
  );

  return results.flatMap((snapshot) =>
    snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  );
}

// Query by multiple field values
async function getPostsByAuthors(authorIds: string[]) {
  return adminDb
    .collection('posts')
    .where('authorId', 'in', authorIds.slice(0, 30)) // Max 30
    .get();
}
```

## Aggregation Patterns

### Pattern 7: Aggregation Queries (Firebase v9.6+)

```typescript
import {
  getCountFromServer,
  getAggregateFromServer,
  sum,
  average,
} from 'firebase/firestore';

// Count documents
async function getPostCount(userId: string) {
  const coll = collection(db, 'posts');
  const q = query(coll, where('authorId', '==', userId));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

// Sum and average
async function getPostStats(userId: string) {
  const coll = collection(db, 'posts');
  const q = query(coll, where('authorId', '==', userId));
  const snapshot = await getAggregateFromServer(q, {
    totalLikes: sum('likes'),
    avgLikes: average('likes'),
  });
  return snapshot.data();
}
```

### Pattern 8: Distributed Counters

For high-write counters (likes, views):

```typescript
// Structure: posts/{postId}/counters/{shardId}

const NUM_SHARDS = 10;

// Initialize counter shards
async function initializeCounter(postId: string) {
  const batch = adminDb.batch();

  for (let i = 0; i < NUM_SHARDS; i++) {
    const shardRef = adminDb
      .collection('posts')
      .doc(postId)
      .collection('counters')
      .doc(i.toString());

    batch.set(shardRef, { count: 0 });
  }

  await batch.commit();
}

// Increment counter (random shard)
async function incrementCounter(postId: string) {
  const shardId = Math.floor(Math.random() * NUM_SHARDS).toString();
  const shardRef = adminDb
    .collection('posts')
    .doc(postId)
    .collection('counters')
    .doc(shardId);

  await shardRef.update({
    count: FieldValue.increment(1),
  });
}

// Get total count
async function getCount(postId: string) {
  const shards = await adminDb
    .collection('posts')
    .doc(postId)
    .collection('counters')
    .get();

  return shards.docs.reduce((total, doc) => total + doc.data().count, 0);
}
```

## Transaction Patterns

### Pattern 9: Read-Modify-Write Transaction

```typescript
async function likePost(postId: string, userId: string) {
  return adminDb.runTransaction(async (transaction) => {
    const postRef = adminDb.collection('posts').doc(postId);
    const likeRef = adminDb
      .collection('posts')
      .doc(postId)
      .collection('likes')
      .doc(userId);

    const [postDoc, likeDoc] = await Promise.all([
      transaction.get(postRef),
      transaction.get(likeRef),
    ]);

    if (!postDoc.exists) {
      throw new Error('Post not found');
    }

    if (likeDoc.exists) {
      // Unlike
      transaction.delete(likeRef);
      transaction.update(postRef, {
        likeCount: FieldValue.increment(-1),
      });
      return { liked: false };
    } else {
      // Like
      transaction.set(likeRef, {
        userId,
        createdAt: FieldValue.serverTimestamp(),
      });
      transaction.update(postRef, {
        likeCount: FieldValue.increment(1),
      });
      return { liked: true };
    }
  });
}
```

### Pattern 10: Multi-Document Transaction

```typescript
async function transferItem(
  itemId: string,
  fromUserId: string,
  toUserId: string
) {
  return adminDb.runTransaction(async (transaction) => {
    const itemRef = adminDb.collection('items').doc(itemId);
    const fromInventoryRef = adminDb
      .collection('users')
      .doc(fromUserId)
      .collection('inventory')
      .doc(itemId);
    const toInventoryRef = adminDb
      .collection('users')
      .doc(toUserId)
      .collection('inventory')
      .doc(itemId);

    const itemDoc = await transaction.get(itemRef);
    const fromInventoryDoc = await transaction.get(fromInventoryRef);

    if (!itemDoc.exists) {
      throw new Error('Item not found');
    }

    if (!fromInventoryDoc.exists) {
      throw new Error("You don't own this item");
    }

    // Update item owner
    transaction.update(itemRef, { ownerId: toUserId });

    // Remove from sender's inventory
    transaction.delete(fromInventoryRef);

    // Add to receiver's inventory
    transaction.set(toInventoryRef, {
      itemId,
      acquiredAt: FieldValue.serverTimestamp(),
    });

    return { success: true };
  });
}
```

## Batch Operations

### Pattern 11: Bulk Write Operations

```typescript
async function bulkCreatePosts(
  userId: string,
  posts: Array<{ title: string; content: string }>
) {
  // Firestore batch limit is 500 operations
  const BATCH_SIZE = 500;
  const results: string[] = [];

  for (let i = 0; i < posts.length; i += BATCH_SIZE) {
    const batch = adminDb.batch();
    const chunk = posts.slice(i, i + BATCH_SIZE);

    chunk.forEach((post) => {
      const docRef = adminDb.collection('posts').doc();
      batch.set(docRef, {
        ...post,
        userId,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      results.push(docRef.id);
    });

    await batch.commit();
  }

  return results;
}
```

### Pattern 12: Bulk Delete with Batching

```typescript
async function deleteCollection(collectionPath: string, batchSize = 500) {
  const collectionRef = adminDb.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise<void>((resolve, reject) => {
    deleteQueryBatch(query, resolve, reject);
  });
}

async function deleteQueryBatch(
  query: FirebaseFirestore.Query,
  resolve: () => void,
  reject: (error: Error) => void
) {
  const snapshot = await query.get();

  if (snapshot.size === 0) {
    resolve();
    return;
  }

  const batch = adminDb.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  // Recurse for next batch
  process.nextTick(() => {
    deleteQueryBatch(query, resolve, reject);
  });
}
```

## Offline Support (Client)

### Pattern 13: Offline Persistence

```typescript
// src/lib/firebase/client.ts
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
} from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
}).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open
    console.warn('Persistence failed: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // Browser doesn't support
    console.warn('Persistence not supported');
  }
});

export { db };
```

### Pattern 14: Pending Writes Detection

```typescript
'use client';

import { useEffect, useState } from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export function useDocumentsWithPendingStatus(userId: string) {
  const [docs, setDocs] = useState([]);
  const [hasPendingWrites, setHasPendingWrites] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'documents'), where('userId', '==', userId));

    const unsubscribe = onSnapshot(
      q,
      { includeMetadataChanges: true },
      (snapshot) => {
        setDocs(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            _pending: doc.metadata.hasPendingWrites,
          }))
        );

        setHasPendingWrites(
          snapshot.docs.some((doc) => doc.metadata.hasPendingWrites)
        );
      }
    );

    return unsubscribe;
  }, [userId]);

  return { docs, hasPendingWrites };
}
```

## Search Patterns

### Pattern 15: Prefix Search (Autocomplete)

```typescript
// For prefix search on a field
async function searchByPrefix(field: string, prefix: string) {
  const end =
    prefix.slice(0, -1) +
    String.fromCharCode(prefix.charCodeAt(prefix.length - 1) + 1);

  return adminDb
    .collection('users')
    .where(field, '>=', prefix)
    .where(field, '<', end)
    .limit(10)
    .get();
}

// Usage
const results = await searchByPrefix('name', 'Joh');
// Matches: John, Johnny, Johanna
```

### Pattern 16: Full-Text Search with Trigrams

```typescript
// Generate trigrams for a string
function generateTrigrams(text: string): string[] {
  const normalized = text.toLowerCase().trim();
  const trigrams: string[] = [];

  for (let i = 0; i <= normalized.length - 3; i++) {
    trigrams.push(normalized.slice(i, i + 3));
  }

  return [...new Set(trigrams)];
}

// Store trigrams when creating/updating
async function createSearchableDocument(data: { title: string }) {
  const trigrams = generateTrigrams(data.title);

  await adminDb.collection('documents').add({
    ...data,
    _trigrams: trigrams,
    createdAt: FieldValue.serverTimestamp(),
  });
}

// Search using array-contains-any
async function searchDocuments(searchTerm: string) {
  const trigrams = generateTrigrams(searchTerm).slice(0, 10);

  if (trigrams.length === 0) return [];

  const snapshot = await adminDb
    .collection('documents')
    .where('_trigrams', 'array-contains-any', trigrams)
    .limit(20)
    .get();

  // Score results by matching trigrams
  return snapshot.docs
    .map((doc) => {
      const data = doc.data();
      const matchCount = trigrams.filter((t) =>
        data._trigrams.includes(t)
      ).length;
      return {
        id: doc.id,
        ...data,
        _score: matchCount / trigrams.length,
      };
    })
    .sort((a, b) => b._score - a._score);
}
```

## Performance Tips

1. **Index Strategy**: Create composite indexes for all compound queries
2. **Query Limits**: Always use `limit()` to prevent large reads
3. **Selective Fields**: Use field masks in Admin SDK when possible
4. **Cursor Pagination**: Use `startAfter()` instead of `offset()`
5. **Denormalize**: Duplicate data to avoid joins
6. **Batch Reads**: Use `getAll()` for multiple documents
7. **Cache Results**: Leverage Next.js caching with `revalidatePath`

## Related Resources

- `.claude/skills/firebase-ssr-patterns/SKILL.md` - Server patterns
- `.claude/skills/firebase-client-patterns/SKILL.md` - Client patterns
- `.claude/rules/firebase-security.md` - Security rules
- Firestore docs: https://firebase.google.com/docs/firestore
