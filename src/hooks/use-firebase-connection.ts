'use client';

import { useCallback, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

import { getClientDb } from '@/lib/firebase/client';

export type ConnectionStatus = 'checking' | 'connected' | 'error' | 'offline';

interface ConnectionInfo {
  status: ConnectionStatus;
  error: string | null;
  lastChecked: Date | null;
}

interface FirebaseConnectionState {
  client: ConnectionInfo;
  server: ConnectionInfo;
}

interface UseFirebaseConnectionReturn extends FirebaseConnectionState {
  checkConnection: () => void;
  isFullyConnected: boolean;
}

async function testClientConnection(): Promise<ConnectionInfo> {
  try {
    const testRef = doc(getClientDb(), '_health', 'ping');
    await getDoc(testRef);
    return {
      status: 'connected',
      error: null,
      lastChecked: new Date(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Permission denied means we connected successfully but rules blocked access
    // This is expected behavior - the connection itself is working
    const isPermissionError =
      errorMessage.includes('permission') ||
      errorMessage.includes('PERMISSION_DENIED');

    if (isPermissionError) {
      return {
        status: 'connected',
        error: null,
        lastChecked: new Date(),
      };
    }

    const isOffline =
      typeof navigator !== 'undefined' &&
      (!navigator.onLine ||
        errorMessage.includes('offline') ||
        errorMessage.includes('network'));

    return {
      status: isOffline ? 'offline' : 'error',
      error: errorMessage,
      lastChecked: new Date(),
    };
  }
}

async function testServerConnection(): Promise<ConnectionInfo> {
  try {
    const response = await fetch('/api/firebase/status');
    const data = await response.json();

    if (response.ok && data.connected) {
      return {
        status: 'connected',
        error: null,
        lastChecked: new Date(),
      };
    }
    return {
      status: 'error',
      error: data.error || 'Server Firebase connection failed',
      lastChecked: new Date(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

    return {
      status: isOffline ? 'offline' : 'error',
      error: errorMessage,
      lastChecked: new Date(),
    };
  }
}

export function useFirebaseConnection(): UseFirebaseConnectionReturn {
  const [state, setState] = useState<FirebaseConnectionState>({
    client: { status: 'checking', error: null, lastChecked: null },
    server: { status: 'checking', error: null, lastChecked: null },
  });
  const [checkTrigger, setCheckTrigger] = useState(0);

  const checkConnection = useCallback(() => {
    setCheckTrigger((prev) => prev + 1);
  }, []);

  // Run connection checks when triggered
  useEffect(() => {
    let cancelled = false;

    async function runChecks(): Promise<void> {
      setState((prev) => ({
        client: { ...prev.client, status: 'checking', error: null },
        server: { ...prev.server, status: 'checking', error: null },
      }));

      const [clientResult, serverResult] = await Promise.all([
        testClientConnection(),
        testServerConnection(),
      ]);

      if (!cancelled) {
        setState({ client: clientResult, server: serverResult });
      }
    }

    void runChecks();

    return () => {
      cancelled = true;
    };
  }, [checkTrigger]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = (): void => {
      setCheckTrigger((prev) => prev + 1);
    };

    const handleOffline = (): void => {
      setState((prev) => ({
        client: { ...prev.client, status: 'offline' },
        server: { ...prev.server, status: 'offline' },
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isFullyConnected =
    state.client.status === 'connected' && state.server.status === 'connected';

  return {
    ...state,
    checkConnection,
    isFullyConnected,
  };
}
