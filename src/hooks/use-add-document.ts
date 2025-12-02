'use client';

import { useCallback, useState } from 'react';
import {
  addDoc,
  collection,
  type DocumentData,
  serverTimestamp,
} from 'firebase/firestore';

import { getClientDb } from '@/lib/firebase/client';

interface UseAddDocumentResult<T> {
  addDocument: (
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<string>;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Hook for adding documents to a collection
 *
 * @param collectionName - The Firestore collection path
 * @returns Add function, loading state, and error
 *
 * @example
 * ```tsx
 * const { addDocument, loading, error } = useAddDocument<Post>("posts");
 *
 * const handleCreate = async () => {
 *   const id = await addDocument({ title: "New Post", content: "..." });
 * };
 * ```
 */
export function useAddDocument<T extends DocumentData = DocumentData>(
  collectionName: string
): UseAddDocumentResult<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addDocument = useCallback(
    async (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
      setLoading(true);
      setError(null);

      try {
        const docRef = await addDoc(collection(getClientDb(), collectionName), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return docRef.id;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { addDocument, loading, error, reset };
}
