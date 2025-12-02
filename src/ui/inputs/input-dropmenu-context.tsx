'use client';

import { createContext, type ReactNode, useContext } from 'react';

/**
 * Size variants for InputDropmenu components
 * - `sm`: Small (240px height)
 * - `md`: Medium (288px height)
 * - `lg`: Large (344px height, default)
 */
export type InputDropmenuSize = 'sm' | 'md' | 'lg';

interface InputDropmenuContextValue {
  size: InputDropmenuSize;
}

const InputDropmenuContext = createContext<InputDropmenuContextValue | null>(
  null
);

/**
 * Hook to access the InputDropmenu size from context.
 *
 * Returns the size from context if available, or falls back to 'lg'.
 * Logs a warning in development if used outside an InputDropmenu component.
 *
 * @returns The current input dropdown menu size
 */
export function useInputDropmenuSize(): InputDropmenuSize {
  const context = useContext(InputDropmenuContext);
  if (!context) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'useInputDropmenuSize must be used within an InputDropmenu component'
      );
    }
    return 'lg'; // safe default fallback
  }
  return context.size;
}

interface InputDropmenuProviderProps {
  size: InputDropmenuSize;
  children: ReactNode;
}

/**
 * Provider component for InputDropmenu context.
 * Propagates size to all child InputDropmenu components.
 */
export function InputDropmenuProvider({
  size,
  children,
}: InputDropmenuProviderProps): React.ReactElement {
  return (
    <InputDropmenuContext.Provider value={{ size }}>
      {children}
    </InputDropmenuContext.Provider>
  );
}

export { InputDropmenuContext };
