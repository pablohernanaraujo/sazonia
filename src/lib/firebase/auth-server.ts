import { cookies } from 'next/headers';

import { adminAuth } from './admin';
import type { ServerSession } from './types';

/**
 * Session cookie name - Firebase Hosting reserved cookie name
 * that passes through CDN
 */
const SESSION_COOKIE_NAME = '__session';

/**
 * Verify the session cookie and return the decoded claims
 * Returns null if no session cookie or verification fails
 *
 * Use this for lightweight session checks in server components
 */
export async function getServerSession(): Promise<ServerSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true // Check if token has been revoked
    );

    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      emailVerified: decodedClaims.email_verified ?? false,
      displayName: decodedClaims.name,
      photoURL: decodedClaims.picture,
      customClaims: decodedClaims,
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

/**
 * Get the full user data for the current session
 * Returns null if no valid session or user not found
 *
 * Use this when you need complete user information including
 * custom claims and user metadata
 */
export async function getCurrentUser(): Promise<ServerSession | null> {
  const session = await getServerSession();

  if (!session) {
    return null;
  }

  try {
    const user = await adminAuth.getUser(session.uid);
    return {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: user.photoURL,
      customClaims: user.customClaims,
    };
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
}

/**
 * Check if the current session has a specific custom claim
 */
export async function hasCustomClaim(
  claim: string,
  value?: unknown
): Promise<boolean> {
  const session = await getServerSession();

  if (!session?.customClaims) {
    return false;
  }

  if (value === undefined) {
    return claim in session.customClaims;
  }

  return session.customClaims[claim] === value;
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  return hasCustomClaim('role', role);
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}
