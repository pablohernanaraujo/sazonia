# Vitest Implementation Plan Evaluation

**Evaluated by:** nextjs-testing-architect
**Date:** 2025-11-29
**Plan File:** `ai/plans/chore/implement-vitest.md`
**Overall Rating:** 6.5/10

---

## Executive Summary

The plan provides a solid foundation for setting up Vitest in a Next.js 16 + React 19 + TypeScript project. However, there are several **critical issues** that need to be addressed before implementation, particularly regarding missing dependencies, the example test approach, and incomplete mock configurations.

---

## 1. Completeness Assessment

### What the Plan Covers Well

- Core dependency installation
- Vitest configuration structure
- Setup file creation
- NPM scripts
- Basic Next.js mocking considerations
- Coverage configuration mention

### Missing Elements

| Missing Item                           | Importance | Recommendation                                                         |
| -------------------------------------- | ---------- | ---------------------------------------------------------------------- |
| `vite-tsconfig-paths` plugin           | **High**   | Required for proper path alias resolution in Vitest                    |
| Coverage provider installation         | Medium     | `@vitest/coverage-v8` should be in Step 1, not just mentioned in Notes |
| React Compiler compatibility           | **High**   | The project uses `babel-plugin-react-compiler` - needs consideration   |
| ESLint integration for testing globals | Medium     | ESLint 9 flat config needs `globals` for `describe`, `it`, `expect`    |
| Type definitions for jest-dom          | Medium     | Proper type augmentation needed                                        |

---

## 2. Technical Issues

### Issue 1: Path Alias Resolution (Critical)

The plan mentions configuring path aliases but does not include `vite-tsconfig-paths` plugin, which is the standard solution:

```typescript
// Plan suggests manually configuring, but should use:
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // ...
});
```

**Missing dependency:** `npm install -D vite-tsconfig-paths`

### Issue 2: React 19 + Testing Library Version

The plan correctly mentions needing `@testing-library/react@16+`, but React Testing Library v16 is still evolving for React 19 support. The implementation should verify the latest stable version at implementation time.

### Issue 3: Example Test Will Fail

The plan suggests testing the `Home` component from `src/app/page.tsx`. However, this component:

- Uses `next/image` (requires mocking)
- Is a **Server Component** by default in Next.js 16 App Router

The example test will fail immediately without proper setup. A better first test would be a simple utility function or a Client Component.

### Issue 4: TypeScript Types for Globals

When `globals: true` is configured in Vitest, TypeScript needs to know about `describe`, `it`, `expect`:

```typescript
// vitest.setup.ts or a separate types file
/// <reference types="vitest/globals" />
```

Or in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

---

## 3. Best Practices Evaluation

### Good Practices in the Plan

- Separating `vitest.config.ts` and `vitest.setup.ts`
- Including `@testing-library/user-event`
- Mentioning coverage configuration
- Acknowledging Server Component testing limitations

### Missing Best Practices

#### 1. Test Isolation

The setup file should include automatic cleanup:

```typescript
// vitest.setup.ts
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

#### 2. Consistent Mock Pattern

The plan should include a standard mock file structure:

```
src/
  __mocks__/
    next/
      navigation.ts
      image.tsx
      link.tsx
```

#### 3. Test Co-location vs Centralized

The plan mentions both approaches but should recommend one. For Next.js App Router, **co-location** is generally preferred:

```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
```

---

## 4. Potential Issues

### Issue 1: Server Component Testing (High Risk)

The `Home` component in `src/app/page.tsx` is a Server Component. React Testing Library cannot directly test Server Components. The plan acknowledges this in Notes but the example test contradicts it.

**Recommendation:** Create a separate Client Component for the example test or test a utility function.

### Issue 2: Next.js Image Component Mock

Testing components with `next/image` requires a mock. The plan should provide the actual mock implementation:

```typescript
// vitest.setup.ts or __mocks__/next/image.tsx
import { vi } from 'vitest'

vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))
```

### Issue 3: React Compiler Compatibility

The project uses `babel-plugin-react-compiler`. This may affect how components behave in tests. The plan should acknowledge this and recommend testing with the compiler disabled initially or ensuring proper configuration.

### Issue 4: ESLint 9 Flat Config

The project uses ESLint 9 with flat config. If `globals: true` is enabled in Vitest, ESLint needs to be configured:

```javascript
// eslint.config.mjs
import globals from 'globals';

export default [
  // ...
  {
    files: ['**/*.test.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
```

---

## 5. Recommended Improvements

### High Priority

1. **Add `vite-tsconfig-paths` to dependencies (Step 1)**

   ```bash
   npm install -D vite-tsconfig-paths
   ```

2. **Add `@vitest/coverage-v8` to dependencies (Step 1)**

   ```bash
   npm install -D @vitest/coverage-v8
   ```

3. **Create a Better Example Test**
   Instead of testing the Server Component `Home`, create:
   - A simple utility function test
   - A simple Client Component test

   ```typescript
   // src/__tests__/example.test.ts
   import { describe, it, expect } from 'vitest';

   function sum(a: number, b: number): number {
     return a + b;
   }

   describe('Example Test Suite', () => {
     it('should add two numbers', () => {
       expect(sum(1, 2)).toBe(3);
     });
   });
   ```

4. **Provide Complete Mock Implementations**
   Include actual code for Next.js mocks, not just mentions.

### Medium Priority

5. **Add TypeScript Configuration for Test Types**
   Include Vitest globals and jest-dom types in the TypeScript configuration.

6. **Add ESLint Configuration for Test Files**
   Ensure ESLint recognizes test globals.

7. **Create Test Utilities with Providers Pattern**

   ```typescript
   // src/test-utils.tsx
   import { render, RenderOptions } from '@testing-library/react'
   import { ReactElement } from 'react'

   function AllTheProviders({ children }: { children: React.ReactNode }) {
     return (
       // Add providers here (theme, auth, etc.)
       <>{children}</>
     )
   }

   const customRender = (
     ui: ReactElement,
     options?: Omit<RenderOptions, 'wrapper'>
   ) => render(ui, { wrapper: AllTheProviders, ...options })

   export * from '@testing-library/react'
   export { customRender as render }
   ```

### Low Priority

8. **Consider happy-dom as Alternative**
   The plan mentions `happy-dom` in the dependencies list but uses `jsdom`. Choose one and be consistent. `happy-dom` is faster but has some compatibility differences.

9. **Add CI-Specific Configuration**
   ```typescript
   // vitest.config.ts
   export default defineConfig({
     test: {
       // ...
       reporters: process.env.CI ? ['json', 'github-actions'] : ['default'],
     },
   });
   ```

---

## 6. Order of Operations

### Current Order Issues

| Step                          | Issue                              | Recommendation      |
| ----------------------------- | ---------------------------------- | ------------------- |
| Step 2 before Step 4          | Config depends on TS understanding | Move Step 4 earlier |
| Step 6 tests Server Component | Will fail                          | Change example test |
| Step 7 marked optional        | Should be required for scalability | Make required       |

### Recommended Order

1. **Install ALL dependencies** (including `vite-tsconfig-paths`, `@vitest/coverage-v8`)
2. **Update TypeScript configuration** (add types for vitest/globals, jest-dom)
3. **Create Vitest configuration file**
4. **Create Vitest setup file** (with mocks and cleanup)
5. **Update ESLint configuration** (for test globals)
6. **Add NPM scripts**
7. **Create test utilities file** (custom render with providers)
8. **Create example test** (utility function first, then simple component)
9. **Run validation commands**

---

## 7. Corrected Configuration Examples

### vitest.config.ts

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
  },
});
```

### vitest.setup.ts

```typescript
/// <reference types="vitest/globals" />

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Automatic cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) => {
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
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: any }) => {
    return <a href={href} {...props}>{children}</a>
  },
}))
```

---

## 8. Summary Table

| Category            | Rating     | Notes                                       |
| ------------------- | ---------- | ------------------------------------------- |
| Completeness        | 7/10       | Missing key dependencies and configurations |
| Technical Accuracy  | 6/10       | Path aliases and example test issues        |
| Best Practices      | 7/10       | Good foundation, missing some patterns      |
| Potential Issues    | 5/10       | Server Component testing conflict           |
| Order of Operations | 7/10       | Minor reordering needed                     |
| **Overall**         | **6.5/10** | Solid foundation, needs refinement          |

---

## Action Items

- [ ] Add `vite-tsconfig-paths` to Step 1 dependencies
- [ ] Add `@vitest/coverage-v8` to Step 1 dependencies
- [ ] Change example test from Server Component to utility function
- [ ] Include complete mock implementations in Step 3
- [ ] Add TypeScript type configuration for test globals
- [ ] Update ESLint configuration for test files
- [ ] Reorder steps as recommended
- [ ] Make Step 7 (test utilities) required instead of optional
