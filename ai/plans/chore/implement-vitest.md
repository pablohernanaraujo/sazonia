# Chore: Implement Vitest Testing Framework

## Chore Description

Configure and set up Vitest as the testing framework for the sazonia-web Next.js 16 application. This implementation will establish the foundation for unit testing React components, utility functions, and hooks across the codebase. The setup will integrate with the existing TypeScript configuration, React 19, and Tailwind CSS 4 stack, focusing on testing Client Components, utility functions, and hooks (Server Components cannot be directly tested with React Testing Library).

## Relevant Files

Use these files to resolve the chore:

- `package.json` - Add vitest and related testing dependencies
- `tsconfig.json` - Reference for TypeScript configuration to ensure vitest config aligns with existing paths and compiler options; add test type definitions
- `eslint.config.mjs` - Update ESLint 9 flat config to recognize test globals

### New Files

- `vitest.config.ts` - Main Vitest configuration file at project root
- `vitest.setup.ts` - Test setup file for global configurations, jest-dom matchers, mocks, and cleanup
- `src/test-utils.tsx` - Custom render function with providers pattern for reusable test utilities
- `src/__tests__/example.test.ts` - Example utility function test to validate the setup works correctly
- `src/__tests__/example-component.test.tsx` - Example Client Component test to validate React Testing Library integration

## Step by Step Tasks

### Step 1: Install ALL Vitest and Testing Dependencies

Install all required dependencies in a single step:

```bash
npm install -D vitest @vitest/ui @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react vite-tsconfig-paths jsdom
```

Dependencies breakdown:

- `vitest` - Core testing framework
- `@vitest/ui` - Visual test runner interface
- `@vitest/coverage-v8` - Code coverage provider (required for coverage reports)
- `@testing-library/react` - React Testing Library (use v16+ for React 19 support)
- `@testing-library/jest-dom` - Custom DOM matchers (e.g., `toBeInTheDocument()`)
- `@testing-library/user-event` - User interaction simulation
- `@vitejs/plugin-react` - Vite React plugin for JSX support
- `vite-tsconfig-paths` - **Critical**: Required for proper path alias resolution (`@/*`)
- `jsdom` - DOM environment for testing

### Step 2: Update TypeScript Configuration

Update `tsconfig.json` to include test type definitions:

- Add `"vitest/globals"` to `compilerOptions.types` array for global `describe`, `it`, `expect`
- Add `"@testing-library/jest-dom"` to `compilerOptions.types` array for jest-dom matchers
- Ensure test files are included in compilation

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

### Step 3: Create Vitest Configuration File

Create `vitest.config.ts` at the project root with the following configuration:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/**/*.d.ts',
        'src/**/index.ts',
      ],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    reporters: process.env.CI ? ['json', 'github-actions'] : ['default'],
  },
});
```

Key configuration points:

- Use `vite-tsconfig-paths` plugin for automatic path alias resolution
- Use `jsdom` environment (consistent choice over `happy-dom`)
- Enable globals for cleaner test syntax
- Configure coverage with v8 provider
- Add CI-specific reporters for GitHub Actions integration

### Step 4: Create Vitest Setup File

Create `vitest.setup.ts` at the project root with complete mock implementations:

```typescript
/// <reference types="vitest/globals" />

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Automatic cleanup after each test for proper test isolation
afterEach(() => {
  cleanup()
})

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  },
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
    return <a href={href} {...props}>{children}</a>
  },
}))
```

### Step 5: Update ESLint Configuration for Test Files

Update `eslint.config.mjs` to recognize test globals with ESLint 9 flat config:

```javascript
import globals from 'globals';

export default [
  // ... existing config
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
```

Note: The `globals` package should already be available as a transitive dependency, but install if needed: `npm install -D globals`

### Step 6: Add NPM Scripts

Add the following scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:run": "vitest run"
  }
}
```

Script purposes:

- `test` - Run tests in watch mode (development)
- `test:ui` - Launch visual test interface
- `test:coverage` - Run tests once with coverage report
- `test:run` - Run tests once without watch (CI environments)

### Step 7: Create Test Utilities File

Create `src/test-utils.tsx` for custom render functions with providers pattern:

```typescript
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    // Add providers here as needed (theme, auth, etc.)
    <>{children}</>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from testing-library
export * from '@testing-library/react'

// Override render with custom render
export { customRender as render }
```

Usage in tests:

```typescript
// Import from test-utils instead of @testing-library/react
import { render, screen } from '@/test-utils';
```

### Step 8: Create Example Tests

#### Example 1: Utility Function Test

Create `src/__tests__/example.test.ts` to validate basic Vitest setup:

```typescript
import { describe, it, expect } from 'vitest';

// Example utility function
function sum(a: number, b: number): number {
  return a + b;
}

describe('Example Test Suite', () => {
  it('should add two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('should handle negative numbers', () => {
    expect(sum(-1, 1)).toBe(0);
  });
});
```

#### Example 2: Client Component Test

Create a simple Client Component for testing, then create `src/__tests__/example-component.test.tsx`:

First, create `src/components/Button/Button.tsx`:

```typescript
'use client'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export function Button({ children, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
```

Then create the test `src/components/Button/Button.test.tsx` (co-located):

```typescript
import { render, screen } from '@/test-utils'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick} disabled>Click me</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).not.toHaveBeenCalled()
  })
})
```

### Step 9: Run Validation Commands

Execute all validation commands to ensure the setup is complete:

```bash
# Run all tests
npm run test:run

# Verify TypeScript compilation with test files
npx tsc --noEmit

# Verify ESLint passes
npm run lint

# Verify production build succeeds
npm run build
```

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

- `npm run test:run` - Run all tests to verify Vitest is configured correctly and tests pass
- `npm run test:ui` - Verify Vitest UI launches correctly (manual verification)
- `npm run test:coverage` - Verify coverage reports are generated
- `npm run lint` - Verify ESLint passes with no errors
- `npm run build` - Verify Next.js production build succeeds
- `npx tsc --noEmit` - Verify TypeScript compilation succeeds with test files included

## Notes

### React 19 Compatibility

- Use `@testing-library/react@16+` which has React 19 support
- Verify the latest stable version at implementation time as the library is still evolving

### Next.js 16 + Server Components

- **Server Components cannot be directly tested with React Testing Library**
- Focus on testing Client Components (marked with `'use client'`), utility functions, and hooks
- The example tests use utility functions and Client Components to avoid this limitation

### React Compiler Consideration

- The project uses `babel-plugin-react-compiler` which may affect component behavior in tests
- If issues arise, consider testing with the compiler disabled initially
- Monitor for any unexpected behavior during test runs

### Test File Organization

- **Recommended**: Co-location pattern - place test files next to their source files:
  ```
  src/
    components/
      Button/
        Button.tsx
        Button.test.tsx
  ```
- Alternative: Centralized `__tests__` directories for integration tests

### Mocking Next.js Modules

Complete mocks are provided in `vitest.setup.ts` for:

- `next/navigation` (useRouter, usePathname, useSearchParams, useParams)
- `next/image` (Image component → standard `<img>`)
- `next/link` (Link component → standard `<a>`)

### Future Expansion

This setup provides the foundation. Additional utilities can be added as needed:

- MSW (Mock Service Worker) for API mocking
- Custom hooks testing utilities with `@testing-library/react-hooks`
- Snapshot testing for component output
