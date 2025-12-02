import { NextResponse } from 'next/server';

import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // Test Firestore connection by reading a non-existent document
    const testRef = adminDb.collection('_health').doc('ping');
    await testRef.get();

    const latency = Date.now() - startTime;

    return NextResponse.json({
      connected: true,
      latency,
      timestamp: new Date().toISOString(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    console.error('[Firebase Status] Server connection error:', errorMessage);

    return NextResponse.json(
      {
        connected: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
