import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    // Add providers here as needed (theme, auth, etc.)
    <>{children}</>
  );
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render with custom render
export { customRender as render };
