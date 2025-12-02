'use client';

import type { ReactElement } from 'react';

import { FirebaseConnectionStatus } from '@/components/firebase';

export default function FirebaseStatusPage(): ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-8 dark:bg-black">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <FirebaseConnectionStatus />
      </div>
    </div>
  );
}
