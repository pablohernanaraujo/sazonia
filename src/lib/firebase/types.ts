import type { User } from 'firebase/auth';
import type { QueryConstraint, Timestamp } from 'firebase/firestore';

/**
 * Firebase User type re-exported for convenience
 */
export type FirebaseUser = User;

/**
 * Base interface for all Firestore documents
 * All documents should extend this interface
 */
export interface DocumentBase {
  id: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

/**
 * Generic type for a document with an ID
 */
export type DocumentWithId<T> = T & { id: string };

/**
 * Options for querying a collection
 */
export interface CollectionQueryOptions {
  constraints?: QueryConstraint[];
  enabled?: boolean;
}

/**
 * Options for paginated queries
 */
export interface PaginationOptions {
  pageSize?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  constraints?: QueryConstraint[];
}

/**
 * Result from a paginated query
 */
export interface PaginatedResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

/**
 * Common mutation hook result
 */
export interface MutationResult<TInput, TOutput = void> {
  mutate: (input: TInput) => Promise<TOutput>;
  loading: boolean;
  error: Error | null;
}

/**
 * Upload state for file uploads
 */
export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error' | 'paused';

/**
 * Progress information for file uploads
 */
export interface UploadProgress {
  progress: number;
  status: UploadStatus;
}

/**
 * Result from file upload hook
 */
export interface FileUploadResult {
  uploadFile: (file: File, path?: string) => Promise<string>;
  deleteFile: (url: string) => Promise<void>;
  progress: UploadProgress | null;
  error: Error | null;
  reset: () => void;
}

/**
 * Server session from verified session cookie
 */
export interface ServerSession {
  uid: string;
  email?: string;
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;
  customClaims?: Record<string, unknown>;
}

/**
 * Data for creating/updating documents with timestamps
 */
export interface WithTimestamps {
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

/**
 * Type helper to make all properties optional except id
 */
export type PartialWithId<T> = Partial<T> & { id: string };

/**
 * Type helper for document data without id (for creation)
 */
export type CreateData<T extends { id: string }> = Omit<T, 'id'>;

/**
 * Type helper for document data for updates (partial, without timestamps)
 */
export type UpdateData<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;
