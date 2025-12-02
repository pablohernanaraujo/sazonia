# Code Quality Guidelines

This document outlines the ESLint and Prettier configuration and coding standards for sazonia-web.

## Prettier Configuration

Prettier ensures consistent code formatting across the project.

### Configuration File

```json
// .prettierrc
{
  "endOfLine": "auto",
  "printWidth": 82,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/app/globals.css",
  "tailwindFunctions": ["cva", "cn"]
}
```

### Key Formatting Rules

**Line Length:**

- Maximum line width: 82 characters
- Prettier will automatically wrap longer lines

**Quotes:**

- Single quotes for strings: `'hello'`
- Double quotes only in JSX attributes

**Semicolons:**

- Always use semicolons at the end of statements

**Trailing Commas:**

- Use trailing commas in ES5-compatible positions (objects, arrays)
- Helps with cleaner git diffs

**Arrow Functions:**

- Always use parentheses around parameters: `(x) => x * 2`

**Bracket Spacing:**

- Spaces inside object literals: `{ foo: 'bar' }`

### Tailwind CSS Integration

Prettier automatically sorts Tailwind classes using `prettier-plugin-tailwindcss`:

```tsx
// Before formatting
<div className="p-4 flex bg-white items-center rounded-lg shadow">

// After formatting (automatically sorted)
<div className="flex items-center rounded-lg bg-white p-4 shadow">
```

**Custom Functions:**

- `cva()` - Class Variance Authority patterns
- `cn()` - Utility for conditional class merging

Both functions have their class arguments sorted by Prettier.

## ESLint Configuration

ESLint enforces code quality and consistency rules.

### Architecture

The ESLint config uses flat config format (ESLint 9+):

```
eslint.config.mjs
├── Next.js configs (core-web-vitals, typescript)
├── Storybook recommended rules
├── Global ignores
├── Main TS/TSX configuration
│   ├── Prettier integration
│   ├── Import sorting
│   ├── Code complexity rules
│   └── Unicorn rules
├── TypeScript-specific rules
├── React Hooks rules
├── React rules
├── Test files configuration
├── Story files configuration
└── Config files
```

### Import Sorting

Imports are automatically sorted into groups:

```typescript
// Group 1: Side effects (e.g., polyfills)
import './polyfill';

// Group 2: External modules (React first, then alphabetically)
import React from 'react';
import { useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Group 3: Absolute imports
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

// Group 4: Relative imports
import { helper } from './helper';
import styles from './styles.module.css';
```

**Rules:**

- `simple-import-sort/imports`: Enforces import order
- `simple-import-sort/exports`: Enforces export order

### Code Complexity Rules

These rules help maintain readable, maintainable code:

| Rule                   | Limit | Description                   |
| ---------------------- | ----- | ----------------------------- |
| `complexity`           | 15    | Maximum cyclomatic complexity |
| `max-depth`            | 3     | Maximum nesting depth         |
| `max-nested-callbacks` | 3     | Maximum callback nesting      |
| `max-params`           | 5     | Maximum function parameters   |

**Example - Complexity:**

```typescript
// BAD - complexity > 10
function processData(data: Data): Result {
  if (data.type === 'a') {
    if (data.subtype === 'a1') {
      /* ... */
    } else if (data.subtype === 'a2') {
      /* ... */
    }
    // ... many more branches
  }
  // ... many more branches
}

// GOOD - Extract into smaller functions
function processTypeA(data: Data): Result {
  /* ... */
}
function processTypeB(data: Data): Result {
  /* ... */
}

function processData(data: Data): Result {
  switch (data.type) {
    case 'a':
      return processTypeA(data);
    case 'b':
      return processTypeB(data);
    default:
      throw new Error('Unknown type');
  }
}
```

**Example - Max Depth:**

```typescript
// BAD - depth > 3
function processItems(items: Item[]): void {
  for (const item of items) {
    // depth 1
    if (item.active) {
      // depth 2
      if (item.type === 'special') {
        // depth 3
        if (item.valid) {
          // depth 4 - TOO DEEP
          // ...
        }
      }
    }
  }
}

// GOOD - Use early returns
function processItems(items: Item[]): void {
  for (const item of items) {
    if (!item.active) continue;
    if (item.type !== 'special') continue;
    if (!item.valid) continue;
    // Process item
  }
}
```

**Example - Max Params:**

```typescript
// BAD - more than 5 params
function createUser(
  name: string,
  email: string,
  age: number,
  role: string,
  department: string,
  managerId: string
): User {
  /* ... */
}

// GOOD - Use options object
interface CreateUserOptions {
  name: string;
  email: string;
  age: number;
  role: string;
  department: string;
  managerId: string;
}

function createUser(options: CreateUserOptions): User {
  /* ... */
}

// ALSO GOOD - 5 params or fewer is acceptable
function updateUserRole(
  userId: string,
  role: string,
  department: string,
  updatedBy: string,
  reason: string
): User {
  /* ... */
}
```

### Arrow Function Style

Arrow functions should use concise body when possible:

```typescript
// BAD - unnecessary block body
const double = (x: number): number => {
  return x * 2;
};

// GOOD - concise body
const double = (x: number): number => x * 2;

// GOOD - block body when needed
const process = (x: number): number => {
  const validated = validate(x);
  return validated * 2;
};
```

### Unicorn Rules

Selected unicorn rules for cleaner code:

**Array Methods:**

```typescript
// BAD - forEach
items.forEach((item) => process(item));

// GOOD - for...of
for (const item of items) {
  process(item);
}

// BAD - traditional for loop
for (let i = 0; i < items.length; i++) {
  process(items[i]);
}

// GOOD - for...of with index if needed
for (const [index, item] of items.entries()) {
  process(item, index);
}
```

**Modern Array Methods:**

```typescript
// BAD
const hasActive = items.filter((i) => i.active).length > 0;

// GOOD
const hasActive = items.some((i) => i.active);

// BAD
const found = items.filter((i) => i.id === id)[0];

// GOOD
const found = items.find((i) => i.id === id);

// BAD
const nested = items.map((i) => i.children).reduce((a, b) => a.concat(b), []);

// GOOD
const nested = items.flatMap((i) => i.children);
```

**String Methods:**

```typescript
// BAD
str.substr(0, 5);
str.substring(0, 5);

// GOOD
str.slice(0, 5);

// BAD
str.indexOf('test') !== -1;

// GOOD
str.includes('test');

// BAD
str.indexOf('test') === 0;

// GOOD
str.startsWith('test');
```

**File Naming:**

All files must use kebab-case:

```
// GOOD
src/components/ui/button.tsx
src/hooks/use-auth.ts
src/lib/firebase-client.ts

// BAD
src/components/ui/Button.tsx
src/hooks/useAuth.ts
src/lib/firebaseClient.ts
```

### TypeScript Rules

**Unused Variables:**

```typescript
// GOOD - prefix with underscore for intentionally unused
function handler(_event: Event, data: Data): void {
  console.log(data);
}

// GOOD - destructure and ignore
const { usedProp, ...rest } = object;
const _unused = rest; // Explicitly mark as unused
```

**Explicit Return Types:**

```typescript
// Required for exported functions
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Optional for inline/arrow functions in components
const handleClick = () => {
  // Return type inferred
};

// Optional for higher-order functions
const withLogging = <T>(fn: () => T) => {
  console.log('Calling function');
  return fn();
};
```

**Avoid `any`:**

```typescript
// BAD
function process(data: any): any {
  /* ... */
}

// GOOD - use specific types
function process(data: ProcessInput): ProcessOutput {
  /* ... */
}

// GOOD - use generics when needed
function process<T extends ProcessableData>(data: T): ProcessResult<T> {
  /* ... */
}

// OK - rest args can use any
function log(...args: any[]): void {
  console.log(...args);
}
```

### React Rules

**Hooks Rules:**

```typescript
// ERROR - hooks must be called at top level
function Component(): JSX.Element {
  if (condition) {
    const [state] = useState(); // BAD - conditional hook
  }

  return <div />;
}

// GOOD
function Component(): JSX.Element {
  const [state] = useState();

  if (condition) {
    // Use state here
  }

  return <div />;
}
```

**Exhaustive Dependencies:**

```typescript
// WARNING - missing dependency
useEffect(() => {
  fetchData(userId);
}, []); // userId is missing

// GOOD
useEffect(() => {
  fetchData(userId);
}, [userId]);

// GOOD - if intentionally omitting, disable with comment
useEffect(() => {
  // Only run once on mount
  initializeApp();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

### Test File Rules

Test files have relaxed rules:

- No explicit return types required
- `any` type allowed
- No max-statements limit
- No max-nested-callbacks limit

```typescript
// In *.test.tsx files
describe('Component', () => {
  it('should render correctly', () => {
    // Complex setup allowed
    const mockData: any = {
      /* ... */
    };

    // Deep nesting allowed in tests
    expect(result).toMatchObject({
      nested: {
        deeply: {
          value: 'test',
        },
      },
    });
  });
});
```

### Story File Rules

Story files have relaxed rules:

- No explicit return types required
- Default exports allowed (required by Storybook)

```typescript
// In *.stories.tsx files
export default {
  title: 'Components/Button',
  component: Button,
} satisfies Meta<typeof Button>;

export const Primary = {
  args: {
    variant: 'primary',
  },
};
```

## Running Linting

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix

# Type check
npm run type-check
```

## Pre-commit Hooks

lint-staged runs on commit:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["prettier --write", "eslint --fix"],
    "*.{js,jsx,mjs,cjs}": ["prettier --write", "eslint --fix"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

This ensures all committed code is properly formatted and linted.

## Best Practices Summary

1. **Use single quotes** for strings
2. **Always use semicolons** at end of statements
3. **Keep functions simple** (max 15 complexity, 5 params)
4. **Use modern array methods** (some, find, flatMap, includes)
5. **Use kebab-case** for file names
6. **Sort imports** into logical groups
7. **Add explicit return types** to exported functions
8. **Avoid `any`** - use specific types or generics
9. **Let Prettier sort** Tailwind classes
10. **Use for...of** instead of forEach or traditional loops
