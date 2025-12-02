'use client';

import { createContext, type ReactNode, useContext } from 'react';

/**
 * Size variants for Combobox components
 * - `sm`: Small (32px height)
 * - `md`: Medium (40px height)
 * - `lg`: Large (48px height, default)
 */
export type ComboboxSize = 'sm' | 'md' | 'lg';

export interface ComboboxContextValue {
  /** Size variant for all Combobox components */
  size: ComboboxSize;
  /** Whether the dropdown is open */
  open: boolean;
  /** Function to set the open state */
  setOpen: (open: boolean) => void;
  /** The currently selected value */
  value: string;
  /** Function to change the selected value */
  onValueChange: (value: string) => void;
  /** The current search query */
  query: string;
  /** Function to update the search query */
  setQuery: (query: string) => void;
  /** The currently highlighted item index for keyboard navigation */
  highlightedIndex: number;
  /** Function to update the highlighted index */
  setHighlightedIndex: (index: number) => void;
  /** Whether the combobox is disabled */
  disabled: boolean;
  /** Whether the combobox has an error */
  error: boolean;
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

/**
 * Hook to access the full Combobox context.
 *
 * Returns the complete context value including open state, value, query, etc.
 * Throws an error in development if used outside a Combobox component.
 *
 * @returns The complete Combobox context value
 */
export function useComboboxContext(): ComboboxContextValue {
  const context = useContext(ComboboxContext);
  if (!context) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('useComboboxContext must be used within a Combobox component');
    }
    throw new Error('useComboboxContext must be used within Combobox');
  }
  return context;
}

/**
 * Size-only context for child components that only need size information.
 */
const ComboboxSizeContext = createContext<ComboboxSize>('lg');

/**
 * Hook to access only the Combobox size from context.
 *
 * Returns the size from context if available, or falls back to 'lg'.
 * This is a lightweight hook for components that only need size information.
 *
 * @returns The current Combobox size
 */
export function useComboboxSize(): ComboboxSize {
  return useContext(ComboboxSizeContext);
}

interface ComboboxProviderProps extends ComboboxContextValue {
  children: ReactNode;
}

/**
 * Provider component for Combobox context.
 * Propagates size and state to all child Combobox components.
 */
export function ComboboxProvider({
  children,
  ...value
}: ComboboxProviderProps): React.ReactElement {
  return (
    <ComboboxContext.Provider value={value}>
      <ComboboxSizeContext.Provider value={value.size}>
        {children}
      </ComboboxSizeContext.Provider>
    </ComboboxContext.Provider>
  );
}

export { ComboboxContext };
