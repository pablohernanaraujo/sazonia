import { type App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { type Auth, getAuth } from 'firebase-admin/auth';
import { type Firestore, getFirestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';

/**
 * Check if Firebase Admin can be initialized
 * (all required environment variables are present)
 */
function canInitializeAdmin(): boolean {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
}

/**
 * Get or create the Firebase Admin app instance (singleton pattern)
 *
 * NOTE: Firebase Admin SDK cannot run in Edge runtime.
 * Use this only in:
 * - Server components (Node.js runtime)
 * - API routes (Node.js runtime)
 * - Server actions (Node.js runtime)
 *
 * For middleware (Edge runtime), only check cookie presence.
 * Full token verification must happen in Node.js runtime.
 */
function getFirebaseAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  if (!canInitializeAdmin()) {
    console.warn(
      'Firebase Admin SDK not initialized: missing environment variables'
    );
    return null;
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace escaped newlines in private key
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

// Lazy initialization - only initialize when accessed
let _app: App | null | undefined;
let _adminAuth: Auth | undefined;
let _adminDb: Firestore | undefined;
let _adminStorage: Storage | undefined;

function getApp(): App {
  if (_app === undefined) {
    _app = getFirebaseAdminApp();
  }
  if (!_app) {
    throw new Error(
      'Firebase Admin SDK not initialized. Check environment variables.'
    );
  }
  return _app;
}

/**
 * Firebase Admin Auth instance for server-side authentication
 */
export const adminAuth: Auth = new Proxy({} as Auth, {
  get(_, prop) {
    if (!_adminAuth) {
      _adminAuth = getAuth(getApp());
    }
    return Reflect.get(_adminAuth, prop);
  },
});

/**
 * Firebase Admin Firestore instance for server-side database operations
 */
export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(_, prop) {
    if (!_adminDb) {
      _adminDb = getFirestore(getApp());
    }
    return Reflect.get(_adminDb, prop);
  },
});

/**
 * Firebase Admin Storage instance for server-side file operations
 */
export const adminStorage: Storage = new Proxy({} as Storage, {
  get(_, prop) {
    if (!_adminStorage) {
      _adminStorage = getStorage(getApp());
    }
    return Reflect.get(_adminStorage, prop);
  },
});

/**
 * Firebase Admin App instance (getter function)
 */
export function getAdminApp(): App {
  return getApp();
}
