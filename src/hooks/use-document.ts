'use client';

import { useEffect, useMemo, useReducer } from 'react';
import { doc, type DocumentData, onSnapshot } from 'firebase/firestore';

import { db } from '@/lib/firebase/client';

interface UseDocumentOptions {
  enabled?: boolean;
}

interface UseDocumentResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

type State<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

type Action<T> =
  | { type: 'START' }
  | { type: 'SUCCESS'; payload: T | null }
  | { type: 'ERROR'; payload: Error };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'START':
      return { ...state, loading: true, error: null };
    case 'SUCCESS':
      return { data: action.payload, loading: false, error: null };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

/**
 * Hook for real-time single document listening
 *
 * @param collectionName - The Firestore collection path
 * @param documentId - The document ID to listen to
 * @param options - Options including enabled flag
 * @returns Document data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, loading, error } = useDocument<User>("users", userId, {
 *   enabled: !!userId,
 * });
 * ```
 */
export function useDocument<T = DocumentData>(
  collectionName: string,
  documentId: string | undefined,
  options: UseDocumentOptions = {}
): UseDocumentResult<T> {
  const { enabled = true } = options;
  const shouldSubscribe = !!(documentId && enabled);

  const [state, dispatch] = useReducer(reducer<T>, {
    data: null,
    loading: shouldSubscribe,
    error: null,
  });

  useEffect(() => {
    if (!shouldSubscribe) {
      return;
    }

    dispatch({ type: 'START' });

    const docRef = doc(db, collectionName, documentId!);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          dispatch({
            type: 'SUCCESS',
            payload: { id: snapshot.id, ...snapshot.data() } as T,
          });
        } else {
          dispatch({ type: 'SUCCESS', payload: null });
        }
      },
      (err) => {
        console.error('Document listener error:', err);
        dispatch({ type: 'ERROR', payload: err });
      }
    );

    return unsubscribe;
  }, [collectionName, documentId, shouldSubscribe]);

  // Derive effective values based on subscription state
  const effectiveData = useMemo(
    () => (shouldSubscribe ? state.data : null),
    [shouldSubscribe, state.data]
  );

  const effectiveLoading = useMemo(
    () => (shouldSubscribe ? state.loading : false),
    [shouldSubscribe, state.loading]
  );

  return { data: effectiveData, loading: effectiveLoading, error: state.error };
}
