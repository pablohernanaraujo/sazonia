'use client';

import type { ReactElement } from 'react';

import { type ConnectionStatus, useFirebaseConnection } from '@/hooks';

interface StatusIndicatorProps {
  label: string;
  status: ConnectionStatus;
  error: string | null;
  lastChecked: Date | null;
}

function StatusIndicator({
  label,
  status,
  error,
  lastChecked,
}: StatusIndicatorProps): ReactElement {
  const statusConfig = {
    checking: {
      color: 'bg-yellow-500',
      text: 'Checking...',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    connected: {
      color: 'bg-green-500',
      text: 'Connected',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    error: {
      color: 'bg-red-500',
      text: 'Error',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    offline: {
      color: 'bg-gray-500',
      text: 'Offline',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`rounded-lg border p-3 ${config.bgColor} ${config.borderColor}`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`h-3 w-3 rounded-full ${config.color} ${status === 'checking' ? 'animate-pulse' : ''}`}
        />
        <span className="font-medium text-gray-900">{label}</span>
        <span className={`text-sm ${config.textColor}`}>{config.text}</span>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {lastChecked && (
        <p className="mt-1 text-xs text-gray-500">
          Last checked: {lastChecked.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}

interface FirebaseConnectionStatusProps {
  showRefreshButton?: boolean;
  className?: string;
}

export function FirebaseConnectionStatus({
  showRefreshButton = true,
  className = '',
}: FirebaseConnectionStatusProps): ReactElement {
  const { client, server, checkConnection, isFullyConnected } =
    useFirebaseConnection();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Firebase Connection Status
        </h3>
        {isFullyConnected && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            All Systems Operational
          </span>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatusIndicator
          label="Client (Firestore)"
          status={client.status}
          error={client.error}
          lastChecked={client.lastChecked}
        />
        <StatusIndicator
          label="Server (Admin SDK)"
          status={server.status}
          error={server.error}
          lastChecked={server.lastChecked}
        />
      </div>

      {showRefreshButton && (
        <button
          onClick={checkConnection}
          disabled={client.status === 'checking' || server.status === 'checking'}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {client.status === 'checking' || server.status === 'checking'
            ? 'Checking...'
            : 'Refresh Status'}
        </button>
      )}
    </div>
  );
}
