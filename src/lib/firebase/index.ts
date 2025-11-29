// Client SDK exports
export { auth, db, getClientApp, storage } from './client';

// Error handling
export {
  type FirebaseErrorCode,
  getFirebaseErrorMessage,
  isAuthError,
  isFirebaseError,
  isFirestoreError,
  isStorageError,
} from './errors';

// Types
export type {
  CollectionQueryOptions,
  CreateData,
  DocumentBase,
  DocumentWithId,
  FileUploadResult,
  FirebaseUser,
  MutationResult,
  PaginatedResult,
  PaginationOptions,
  PartialWithId,
  ServerSession,
  UpdateData,
  UploadProgress,
  UploadStatus,
  WithTimestamps,
} from './types';

// Client storage utilities
export {
  formatFileSize,
  generateUploadPath,
  getFileExtension,
  getStorageRef,
  isValidFileSize,
  isValidFileType,
} from './storage';
