import {
  type DocumentData,
  FieldValue,
  type QueryDocumentSnapshot,
  Timestamp,
  type WriteBatch,
} from 'firebase-admin/firestore';

import { adminDb } from './admin';

/**
 * Convert a Firestore Timestamp to a JavaScript Date
 */
export function timestampToDate(timestamp: Timestamp): Date {
  return timestamp.toDate();
}

/**
 * Convert a JavaScript Date to a Firestore Timestamp
 */
export function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

/**
 * Recursively convert all Timestamps in an object to Dates
 * Useful for serializing Firestore documents for React Server Components
 */
export function convertTimestamps<T extends DocumentData>(obj: T): T {
  const result: DocumentData = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Timestamp) {
      result[key] = value.toDate();
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        item instanceof Timestamp
          ? item.toDate()
          : item && typeof item === 'object'
            ? convertTimestamps(item)
            : item
      );
    } else if (value && typeof value === 'object') {
      result[key] = convertTimestamps(value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

/**
 * Type-safe document converter for Firestore
 */
export function createConverter<T extends DocumentData>() {
  return {
    toFirestore: (data: T): DocumentData => data,
    fromFirestore: (snap: QueryDocumentSnapshot): T => {
      const data = snap.data();
      return convertTimestamps(data) as T;
    },
  };
}

/**
 * Get a document by ID with automatic timestamp conversion
 */
export async function getDocument<T extends DocumentData>(
  collectionPath: string,
  documentId: string
): Promise<(T & { id: string }) | null> {
  const doc = await adminDb.collection(collectionPath).doc(documentId).get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data();
  return {
    id: doc.id,
    ...convertTimestamps(data as T),
  };
}

/**
 * Get multiple documents by IDs
 */
export async function getDocuments<T extends DocumentData>(
  collectionPath: string,
  documentIds: string[]
): Promise<(T & { id: string })[]> {
  if (documentIds.length === 0) {
    return [];
  }

  const refs = documentIds.map((id) =>
    adminDb.collection(collectionPath).doc(id)
  );

  const docs = await adminDb.getAll(...refs);

  return docs
    .filter((doc) => doc.exists)
    .map((doc) => ({
      id: doc.id,
      ...convertTimestamps(doc.data() as T),
    }));
}

/**
 * Create a new document with server timestamps
 */
export async function createDocument<T extends DocumentData>(
  collectionPath: string,
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const docRef = await adminDb.collection(collectionPath).add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Update a document with server timestamp
 */
export async function updateDocument<T extends DocumentData>(
  collectionPath: string,
  documentId: string,
  data: Partial<Omit<T, 'id' | 'createdAt'>>
): Promise<void> {
  await adminDb
    .collection(collectionPath)
    .doc(documentId)
    .update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
}

/**
 * Delete a document
 */
export async function deleteDocument(
  collectionPath: string,
  documentId: string
): Promise<void> {
  await adminDb.collection(collectionPath).doc(documentId).delete();
}

/**
 * Batch write helper
 * Returns a batch and commit function for atomic operations
 */
export function createBatch(): {
  batch: WriteBatch;
  commit: () => Promise<void>;
} {
  const batch = adminDb.batch();
  return {
    batch,
    commit: async () => {
      await batch.commit();
    },
  };
}

/**
 * Batch create multiple documents
 */
export async function batchCreate<T extends DocumentData>(
  collectionPath: string,
  documents: Array<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<string[]> {
  const BATCH_SIZE = 500;
  const results: string[] = [];

  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batch = adminDb.batch();
    const chunk = documents.slice(i, i + BATCH_SIZE);

    for (const doc of chunk) {
      const docRef = adminDb.collection(collectionPath).doc();
      batch.set(docRef, {
        ...doc,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      results.push(docRef.id);
    }

    await batch.commit();
  }

  return results;
}

/**
 * Batch delete multiple documents
 */
export async function batchDelete(
  collectionPath: string,
  documentIds: string[]
): Promise<void> {
  const BATCH_SIZE = 500;

  for (let i = 0; i < documentIds.length; i += BATCH_SIZE) {
    const batch = adminDb.batch();
    const chunk = documentIds.slice(i, i + BATCH_SIZE);

    for (const id of chunk) {
      batch.delete(adminDb.collection(collectionPath).doc(id));
    }

    await batch.commit();
  }
}

/**
 * Run a transaction
 */
export async function runTransaction<T>(
  handler: (transaction: FirebaseFirestore.Transaction) => Promise<T>
): Promise<T> {
  return adminDb.runTransaction(handler);
}

/**
 * Query helper for common query patterns
 */
export async function queryDocuments<T extends DocumentData>(
  collectionPath: string,
  options: {
    where?: Array<{
      field: string;
      operator: FirebaseFirestore.WhereFilterOp;
      value: unknown;
    }>;
    orderBy?: { field: string; direction?: 'asc' | 'desc' };
    limit?: number;
    startAfter?: unknown;
  } = {}
): Promise<(T & { id: string })[]> {
  let query: FirebaseFirestore.Query = adminDb.collection(collectionPath);

  if (options.where) {
    for (const condition of options.where) {
      query = query.where(condition.field, condition.operator, condition.value);
    }
  }

  if (options.orderBy) {
    query = query.orderBy(
      options.orderBy.field,
      options.orderBy.direction || 'asc'
    );
  }

  if (options.startAfter !== undefined) {
    query = query.startAfter(options.startAfter);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const snapshot = await query.get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data() as T),
  }));
}
