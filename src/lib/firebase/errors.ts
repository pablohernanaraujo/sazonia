import { FirebaseError } from 'firebase/app';

/**
 * Known Firebase error codes for type-safe error handling
 */
export type FirebaseErrorCode =
  // Auth errors
  | 'auth/email-already-in-use'
  | 'auth/invalid-credential'
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/too-many-requests'
  | 'auth/weak-password'
  | 'auth/requires-recent-login'
  | 'auth/popup-closed-by-user'
  | 'auth/operation-not-allowed'
  | 'auth/network-request-failed'
  // Firestore errors
  | 'permission-denied'
  | 'not-found'
  | 'unavailable'
  | 'already-exists'
  | 'resource-exhausted'
  | 'cancelled'
  | 'data-loss'
  | 'unknown'
  | 'invalid-argument'
  | 'deadline-exceeded'
  | 'aborted'
  | 'out-of-range'
  | 'unimplemented'
  | 'internal'
  | 'unauthenticated'
  // Storage errors
  | 'storage/unknown'
  | 'storage/object-not-found'
  | 'storage/bucket-not-found'
  | 'storage/project-not-found'
  | 'storage/quota-exceeded'
  | 'storage/unauthenticated'
  | 'storage/unauthorized'
  | 'storage/retry-limit-exceeded'
  | 'storage/invalid-checksum'
  | 'storage/canceled'
  | 'storage/invalid-event-name'
  | 'storage/invalid-url'
  | 'storage/invalid-argument'
  | 'storage/no-default-bucket'
  | 'storage/cannot-slice-blob'
  | 'storage/server-file-wrong-size'
  | string;

/**
 * User-friendly error messages mapped to Firebase error codes
 */
const errorMessages: Record<string, string> = {
  // Auth errors
  'auth/email-already-in-use': 'An account with this email already exists',
  'auth/invalid-credential': 'Invalid email or password',
  'auth/invalid-email': 'Invalid email address',
  'auth/user-disabled': 'This account has been disabled',
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/too-many-requests': 'Too many attempts. Please try again later',
  'auth/weak-password': 'Password is too weak. Use at least 6 characters',
  'auth/requires-recent-login': 'Please sign in again to complete this action',
  'auth/popup-closed-by-user': 'Sign-in popup was closed',
  'auth/operation-not-allowed': 'This sign-in method is not enabled',
  'auth/network-request-failed': 'Network error. Please check your connection',

  // Firestore errors
  'permission-denied': "You don't have permission to perform this action",
  'not-found': 'The requested resource was not found',
  unavailable: 'Service temporarily unavailable. Please try again',
  'already-exists': 'This resource already exists',
  'resource-exhausted': 'Quota exceeded. Please try again later',
  cancelled: 'Operation was cancelled',
  'data-loss': 'Unrecoverable data loss occurred',
  unknown: 'An unknown error occurred',
  'invalid-argument': 'Invalid data provided',
  'deadline-exceeded': 'Operation timed out. Please try again',
  aborted: 'Operation was aborted due to a conflict',
  'out-of-range': 'Value is out of valid range',
  unimplemented: 'This feature is not available',
  internal: 'An internal error occurred',
  unauthenticated: 'You must be signed in to perform this action',

  // Storage errors
  'storage/unknown': 'An unknown storage error occurred',
  'storage/object-not-found': 'File not found',
  'storage/bucket-not-found': 'Storage bucket not found',
  'storage/project-not-found': 'Project not found',
  'storage/quota-exceeded': 'Storage quota exceeded',
  'storage/unauthenticated': 'You must be signed in to upload files',
  'storage/unauthorized': "You don't have permission to access this file",
  'storage/retry-limit-exceeded': 'Upload failed. Please try again',
  'storage/canceled': 'Upload was cancelled',
  'storage/invalid-url': 'Invalid file URL',
  'storage/invalid-argument': 'Invalid file or path',
  'storage/no-default-bucket': 'No storage bucket configured',
  'storage/cannot-slice-blob': 'File could not be processed',
  'storage/server-file-wrong-size': 'File upload verification failed',
};

/**
 * Get a user-friendly error message from a Firebase error
 */
export function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return errorMessages[error.code] || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Type guard to check if an error is a Firebase error
 */
export function isFirebaseError(error: unknown): error is FirebaseError {
  return error instanceof FirebaseError;
}

/**
 * Check if the error is an auth-related error
 */
export function isAuthError(error: unknown): boolean {
  return isFirebaseError(error) && error.code.startsWith('auth/');
}

/**
 * Check if the error is a Firestore-related error
 */
export function isFirestoreError(error: unknown): boolean {
  if (!isFirebaseError(error)) return false;
  const firestoreCodes = [
    'permission-denied',
    'not-found',
    'unavailable',
    'already-exists',
    'resource-exhausted',
    'cancelled',
    'data-loss',
    'unknown',
    'invalid-argument',
    'deadline-exceeded',
    'aborted',
    'out-of-range',
    'unimplemented',
    'internal',
    'unauthenticated',
  ];
  return firestoreCodes.includes(error.code);
}

/**
 * Check if the error is a Storage-related error
 */
export function isStorageError(error: unknown): boolean {
  return isFirebaseError(error) && error.code.startsWith('storage/');
}
