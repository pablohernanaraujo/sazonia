'use client';

import { useCallback, useState } from 'react';
import {
  doc,
  type DocumentData,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { getClientDb } from '@/lib/firebase/client';

interface UseUpdateDocumentResult<T> {
  updateDocument: (
    documentId: string,
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<void>;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Hook for updating documents in a collection
 *
 * @param collectionName - The Firestore collection path
 * @returns Update function, loading state, and error
 *
 * @example
 * ```tsx
 * const { updateDocument, loading, error } = useUpdateDocument<Post>("posts");
 *
 * const handleUpdate = async () => {
 *   await updateDocument(postId, { title: "Updated Title" });
 * };
 * ```
 */
export function useUpdateDocument<T extends DocumentData = DocumentData>(
  collectionName: string
): UseUpdateDocumentResult<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateDocument = useCallback(
    async (
      documentId: string,
      data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await updateDoc(doc(getClientDb(), collectionName, documentId), {
          ...data,
          updatedAt: serverTimestamp(),
        });
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

  return { updateDocument, loading, error, reset };
}
