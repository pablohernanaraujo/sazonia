'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  type DocumentData,
  onSnapshot,
  query,
  type QueryConstraint,
} from 'firebase/firestore';

import { getClientDb } from '@/lib/firebase/client';

interface UseCollectionOptions {
  constraints?: QueryConstraint[];
  enabled?: boolean;
}

interface UseCollectionResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for real-time collection listening with query constraints
 *
 * @param collectionName - The Firestore collection path
 * @param options - Query options including constraints and enabled flag
 * @returns Collection data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, loading, error } = useCollection<Post>("posts", {
 *   constraints: [where("published", "==", true), orderBy("createdAt", "desc")],
 *   enabled: !!user,
 * });
 * ```
 */
export function useCollection<T = DocumentData>(
  collectionName: string,
  options: UseCollectionOptions = {}
): UseCollectionResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { constraints = [], enabled = true } = options;

  // Memoize constraints to prevent unnecessary re-subscriptions
  const constraintsKey = useMemo(
    () => JSON.stringify(constraints.map((c) => c.toString())),
    [constraints]
  );

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    const collectionRef = collection(getClientDb(), collectionName);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, constraintsKey, enabled]);

  return { data, loading, error };
}
