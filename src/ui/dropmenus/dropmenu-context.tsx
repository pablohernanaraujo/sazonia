'use client';

import { createContext, type ReactNode, useContext } from 'react';

/**
 * Size variants for Dropmenu components
 * - `sm`: Small (220px width)
 * - `md`: Medium (240px width)
 * - `lg`: Large (260px width, default)
 */
export type DropmenuSize = 'sm' | 'md' | 'lg';

interface DropmenuContextValue {
  size: DropmenuSize;
}

const DropmenuContext = createContext<DropmenuContextValue | null>(null);

/**
 * Hook to access the Dropmenu size from context.
 *
 * Returns the size from context if available, or falls back to 'lg'.
 * Logs a warning in development if used outside a Dropmenu component.
 *
 * @returns The current dropdown menu size
 */
export function useDropmenuSize(): DropmenuSize {
  const context = useContext(DropmenuContext);
  if (!context) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('useDropmenuSize must be used within a Dropmenu component');
    }
    return 'lg'; // safe default fallback
  }
  return context.size;
}

interface DropmenuProviderProps {
  size: DropmenuSize;
  children: ReactNode;
}

/**
 * Provider component for Dropmenu context.
 * Propagates size to all child Dropmenu components.
 */
export function DropmenuProvider({
  size,
  children,
}: DropmenuProviderProps): React.ReactElement {
  return (
    <DropmenuContext.Provider value={{ size }}>
      {children}
    </DropmenuContext.Provider>
  );
}

export { DropmenuContext };
