'use client';

import { useCallback, useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';

import { getClientDb } from '@/lib/firebase/client';

interface UseDeleteDocumentResult {
  deleteDocument: (documentId: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Hook for deleting documents from a collection
 *
 * @param collectionName - The Firestore collection path
 * @returns Delete function, loading state, and error
 *
 * @example
 * ```tsx
 * const { deleteDocument, loading, error } = useDeleteDocument("posts");
 *
 * const handleDelete = async () => {
 *   await deleteDocument(postId);
 * };
 * ```
 */
export function useDeleteDocument(
  collectionName: string
): UseDeleteDocumentResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteDocument = useCallback(
    async (documentId: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await deleteDoc(doc(getClientDb(), collectionName, documentId));
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

  return { deleteDocument, loading, error, reset };
}
