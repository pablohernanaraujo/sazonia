'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { Auth, User, UserCredential } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Lazily import Firebase auth to avoid SSR issues
 */
async function getFirebaseAuth() {
  const { auth } = await import('@/lib/firebase/client');
  return auth;
}

async function getFirebaseAuthMethods() {
  const firebaseAuth = await import('firebase/auth');
  return firebaseAuth;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authRef = useRef<Auth | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initAuth() {
      try {
        const auth = await getFirebaseAuth();
        const { onAuthStateChanged } = await getFirebaseAuthMethods();
        authRef.current = auth;

        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          setUser(currentUser);
          setLoading(false);

          // Sync session with server
          if (currentUser) {
            try {
              const idToken = await currentUser.getIdToken();
              await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
              });
            } catch (error) {
              console.error('Failed to sync session:', error);
            }
          }
        });
      } catch (error) {
        console.error('Failed to initialize Firebase Auth:', error);
        setLoading(false);
      }
    }

    initAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const auth = await getFirebaseAuth();
    const { signInWithEmailAndPassword } = await getFirebaseAuthMethods();
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const auth = await getFirebaseAuth();
    const { createUserWithEmailAndPassword } = await getFirebaseAuthMethods();
    return createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const signOut = useCallback(async () => {
    const auth = await getFirebaseAuth();
    const { signOut: firebaseSignOut } = await getFirebaseAuthMethods();
    await firebaseSignOut(auth);
    await fetch('/api/auth/session', { method: 'DELETE' });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const auth = await getFirebaseAuth();
    const { signInWithPopup, GoogleAuthProvider } =
      await getFirebaseAuthMethods();
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const auth = await getFirebaseAuth();
    const { sendPasswordResetEmail } = await getFirebaseAuthMethods();
    return sendPasswordResetEmail(auth, email);
  }, []);

  const updateUserProfile = useCallback(
    async (data: { displayName?: string; photoURL?: string }) => {
      const auth = await getFirebaseAuth();
      const { updateProfile } = await getFirebaseAuthMethods();
      if (!auth.currentUser) {
        throw new Error('No user logged in');
      }
      await updateProfile(auth.currentUser, data);
      // Force refresh user state
      setUser({ ...auth.currentUser });
    },
    []
  );

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access the auth context
 * Must be used within an AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
