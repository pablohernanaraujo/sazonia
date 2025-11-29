import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { adminAuth } from '@/lib/firebase/admin';

/**
 * Session cookie name - Firebase Hosting reserved cookie name
 */
const SESSION_COOKIE_NAME = '__session';

/**
 * Session duration: 5 days in milliseconds
 */
const SESSION_DURATION = 60 * 60 * 24 * 5 * 1000;

/**
 * Maximum age for the ID token to be considered recent (5 minutes)
 */
const MAX_TOKEN_AGE = 5 * 60 * 1000;

/**
 * POST /api/auth/session
 * Creates a session cookie from a Firebase ID token
 */
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token required' }, { status: 400 });
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Only allow recent sign-ins (within 5 minutes)
    const authTime = decodedToken.auth_time * 1000;
    if (Date.now() - authTime > MAX_TOKEN_AGE) {
      return NextResponse.json(
        { error: 'Recent sign-in required' },
        { status: 401 }
      );
    }

    // Create session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000, // Convert to seconds
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/session
 * Clears the session cookie
 */
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  return NextResponse.json({ success: true });
}
