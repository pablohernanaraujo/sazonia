import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';
import { type Firestore, getFirestore } from 'firebase/firestore';
import { type FirebaseStorage, getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Check if Firebase can be initialized
 * (API key is present - minimum requirement)
 */
function canInitializeFirebase(): boolean {
  return !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
}

/**
 * Get or create the Firebase app instance (singleton pattern)
 */
function getFirebaseApp(): FirebaseApp | null {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  if (!canInitializeFirebase()) {
    return null;
  }

  return initializeApp(firebaseConfig);
}

// Lazy initialization
let _app: FirebaseApp | null | undefined;
let _auth: Auth | undefined;
let _db: Firestore | undefined;
let _storage: FirebaseStorage | undefined;

function getApp(): FirebaseApp {
  if (_app === undefined) {
    _app = getFirebaseApp();
  }
  if (!_app) {
    throw new Error(
      'Firebase not initialized. Check NEXT_PUBLIC_FIREBASE_* environment variables.'
    );
  }
  return _app;
}

/**
 * Firebase Auth instance for client-side authentication
 */
export const auth: Auth = new Proxy({} as Auth, {
  get(_, prop) {
    if (!_auth) {
      _auth = getAuth(getApp());
    }
    return Reflect.get(_auth, prop);
  },
});

/**
 * Firestore database instance for client-side operations
 */
export const db: Firestore = new Proxy({} as Firestore, {
  get(_, prop) {
    if (!_db) {
      _db = getFirestore(getApp());
    }
    return Reflect.get(_db, prop);
  },
});

/**
 * Firebase Storage instance for file uploads
 */
export const storage: FirebaseStorage = new Proxy({} as FirebaseStorage, {
  get(_, prop) {
    if (!_storage) {
      _storage = getStorage(getApp());
    }
    return Reflect.get(_storage, prop);
  },
});

/**
 * Firebase App instance (getter function)
 */
export function getClientApp(): FirebaseApp {
  return getApp();
}
