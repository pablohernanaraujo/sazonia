'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  collection,
  type DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  startAfter,
} from 'firebase/firestore';

import { db } from '@/lib/firebase/client';

interface UsePaginatedCollectionOptions {
  pageSize?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  constraints?: QueryConstraint[];
  enabled?: boolean;
}

interface UsePaginatedCollectionResult<T> {
  data: T[];
  loading: boolean;
  loadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook for cursor-based pagination of Firestore collections
 *
 * @param collectionName - The Firestore collection path
 * @param options - Pagination options
 * @returns Paginated data, loading states, and pagination functions
 *
 * @example
 * ```tsx
 * const { data, loading, hasMore, loadMore } = usePaginatedCollection<Post>(
 *   "posts",
 *   {
 *     pageSize: 20,
 *     orderByField: "createdAt",
 *     orderDirection: "desc",
 *     constraints: [where("published", "==", true)],
 *   }
 * );
 * ```
 */
export function usePaginatedCollection<T = DocumentData>(
  collectionName: string,
  options: UsePaginatedCollectionOptions = {}
): UsePaginatedCollectionResult<T> {
  const {
    pageSize = 10,
    orderByField = 'createdAt',
    orderDirection = 'desc',
    constraints = [],
    enabled = true,
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(
    async (isInitial = false) => {
      if (!enabled) {
        setLoading(false);
        return;
      }

      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
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

        const lastDocument = snapshot.docs[snapshot.docs.length - 1] || null;
        setLastDoc(lastDocument);
        setHasMore(snapshot.docs.length === pageSize);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [
      collectionName,
      constraints,
      orderByField,
      orderDirection,
      pageSize,
      lastDoc,
      enabled,
    ]
  );

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    await fetchPage(false);
  }, [fetchPage, loadingMore, hasMore]);

  const refresh = useCallback(async () => {
    setLastDoc(null);
    setHasMore(true);
    setData([]);
    await fetchPage(true);
  }, [fetchPage]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchPage(true);
    } else {
      setLoading(false);
      setData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return {
    data,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
