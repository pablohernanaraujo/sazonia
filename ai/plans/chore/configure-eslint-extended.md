# Chore: Configure ESLint Extended

## Chore Description

Configure ESLint with an extended ruleset that includes Prettier integration, TypeScript-ESLint rules, import sorting, React Hooks validation, and Unicorn best practices. The configuration uses ESLint flat config format, extending Next.js core-web-vitals rules while adding custom plugins for code quality, maintainability, and consistency.

The new configuration enforces:

- Prettier formatting as ESLint errors
- Import sorting with `simple-import-sort` (grouping side effects, react, external, absolute, relative)
- TypeScript strict rules (explicit return types, no unused vars, no explicit any)
- React Hooks rules of hooks and exhaustive deps
- Code complexity limits (max-depth: 3, max-params: 3, complexity: 10)
- Unicorn best practices (prefer modern array methods)
- Consistent code style (arrow-body-style)

## Relevant Files

Use these files to resolve the chore:

- `eslint.config.mjs` - Current ESLint flat config file that will be replaced with the new extended configuration
- `package.json` - Contains project dependencies; new ESLint plugins must be added as devDependencies
- `tsconfig.json` - TypeScript configuration referenced by `@typescript-eslint/parser` for type-aware linting (already configured with `vitest/globals` types)

### New Files

- `.prettierrc` - Prettier configuration file to ensure consistent formatting settings between ESLint and Prettier

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Install Required Dependencies

Install all the ESLint plugins and related packages required by the new configuration:

```bash
npm install -D \
  @eslint/eslintrc \
  eslint-plugin-prettier \
  eslint-plugin-simple-import-sort \
  eslint-plugin-unicorn \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-import \
  eslint-import-resolver-typescript \
  prettier \
  prettier-plugin-tailwindcss \
  eslint-config-prettier \
  eslint-plugin-vitest
```

**Package purposes:**

- `@eslint/eslintrc` - FlatCompat for extending legacy configs (if needed)
- `eslint-plugin-prettier` - Runs Prettier as an ESLint rule
- `eslint-plugin-simple-import-sort` - Import and export sorting
- `eslint-plugin-unicorn` - Various best practice rules
- `@typescript-eslint/parser` - TypeScript parser for ESLint
- `@typescript-eslint/eslint-plugin` - TypeScript-specific linting rules
- `eslint-plugin-import` - Import/export linting rules
- `eslint-import-resolver-typescript` - Resolves TypeScript path aliases (`@/*`)
- `prettier` - Prettier formatter
- `prettier-plugin-tailwindcss` - Tailwind class sorting for Prettier
- `eslint-config-prettier` - Disables ESLint rules that conflict with Prettier
- `eslint-plugin-vitest` - Vitest-specific linting rules

### Step 2: Create Prettier Configuration

Create `.prettierrc` file in the project root:

```json
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

### Step 3: Update ESLint Configuration

Replace the contents of `eslint.config.mjs` with the following configuration:

```javascript
// eslint.config.mjs
import storybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import vitest from 'eslint-plugin-vitest';

const eslintConfig = defineConfig([
  // Next.js configs (already flat config compatible)
  ...nextVitals,
  ...nextTs,

  // Storybook ESLint rules
  ...storybook.configs['flat/recommended'],

  // Global ignores
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'storybook-static/**',
    'coverage/**',
    'node_modules/**',
    'public/**',
  ]),

  // Main configuration for all TS/TSX files
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      prettier,
      'simple-import-sort': simpleImportSort,
      unicorn,
    },
    rules: {
      // Prettier - format as ESLint errors
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // Import sorting
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'], // side effects
            ['^react', '^@?\\w'], // external modules (react first)
            ['^'], // absolute imports
            ['^\\.'], // relative imports
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // Code quality (start as warnings, increase to errors after compliance)
      complexity: ['warn', { max: 10 }],
      'max-depth': ['warn', { max: 3 }],
      'max-nested-callbacks': ['warn', { max: 3 }],
      'max-params': ['warn', { max: 3 }],

      // Console statements
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

      // Arrow functions
      'arrow-body-style': ['error', 'as-needed'],

      // Unicorn rules (selective - avoiding overly strict rules)
      'unicorn/no-array-for-each': 'error',
      'unicorn/no-array-reduce': 'warn',
      'unicorn/no-for-loop': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/no-null': 'off', // React uses null frequently
      'unicorn/no-useless-undefined': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/prefer-array-flat': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/prefer-array-index-of': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-number-properties': 'error',
      'unicorn/prefer-optional-catch-binding': 'error',
      'unicorn/prefer-set-has': 'error',
      'unicorn/prefer-string-slice': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/prefer-string-trim-start-end': 'error',
      'unicorn/prefer-ternary': 'warn',
      'unicorn/throw-new-error': 'error',
      // Note: unicorn/filename-case disabled - React convention uses PascalCase for components
    },
  },

  // TypeScript-specific rules
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Disable rules that conflict with TypeScript
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-empty-function': 'off',

      // Unused variables - allow underscore prefix for intentionally unused
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'none',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Explicit any - warn to encourage proper typing
      '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],

      // Explicit return types - lenient settings for better DX
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        },
      ],
    },
  },

  // React Hooks rules (already included via next config, but explicit for clarity)
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // React rules
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-children-prop': 'off',
      'react/no-array-index-key': 'off',
      'react/no-unstable-nested-components': 'off',
      'react/no-unknown-property': 'off',
    },
  },

  // Test files configuration
  {
    files: [
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      'vitest.setup.tsx',
      'src/test-utils.tsx',
    ],
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        // Vitest globals
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        test: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    rules: {
      // Vitest recommended rules
      ...vitest.configs.recommended.rules,
      // Relax rules for test files
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'max-statements': 'off',
      'max-nested-callbacks': 'off',
    },
  },

  // Story files configuration
  {
    files: ['**/*.stories.{ts,tsx}'],
    rules: {
      // Stories often have complex meta objects without explicit return types
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Stories may need default exports
      'import/no-default-export': 'off',
    },
  },

  // Config files (mjs, cjs, js)
  {
    files: ['*.config.{js,mjs,cjs,ts}', '.storybook/**/*.{js,ts}'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);

export default eslintConfig;
```

### Step 4: Update lint-staged Configuration

Update `package.json` lint-staged configuration to run Prettier before ESLint:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["prettier --write", "eslint --fix"],
    "*.{js,jsx,mjs,cjs}": ["prettier --write", "eslint --fix"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

### Step 5: Add lint:fix Script

Add a convenience script to `package.json`:

```json
{
  "scripts": {
    "lint:fix": "eslint --fix ."
  }
}
```

### Step 6: Run Initial Lint and Fix

Run the linter to identify and auto-fix issues:

```bash
# Auto-fix what can be fixed
npm run lint:fix

# Run lint to see remaining issues
npm run lint
```

### Step 7: Manually Address Remaining Issues

After auto-fix, manually address any remaining issues:

1. **Import ordering** - Should be auto-fixed by simple-import-sort
2. **Explicit return types** - Add return types to functions where warned (or adjust rule if too strict)
3. **Complexity warnings** - Refactor complex functions if needed

### Step 8: Run Validation Commands

Execute all validation commands to ensure zero regressions.

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

```bash
# Verify ESLint configuration is valid and no lint errors remain
npm run lint

# Run TypeScript type checking
npm run type-check

# Run tests to verify no regressions
npm run test:run

# Run Next.js build
npm run build

# Verify ESLint config is applied correctly (optional - for debugging)
npx eslint --print-config src/app/page.tsx
```

## Notes

### Rules NOT Included (from original request)

The following rules from the original request were intentionally excluded due to conflicts or issues:

1. **`object-property-newline`** - Conflicts with Prettier formatting. Let Prettier handle object formatting.

2. **`max-len`** - Conflicts with Prettier's `printWidth`. Removed to avoid duplicate warnings.

3. **`unicorn/filename-case`** - React convention uses PascalCase for component files (e.g., `Button.tsx`). Disabled to avoid renaming 15+ files.

4. **`padding-line-between-statements`** - Can be handled by Prettier or removed for simplicity.

5. **`import/newline-after-import`** and **`import/extensions`** - Require additional eslint-plugin-import configuration. simple-import-sort handles most import concerns.

### Key Differences from Original Request

1. **Vitest instead of Jest** - The project uses Vitest, so globals are configured for Vitest (`vi`, `describe`, `it`, etc.)

2. **PascalCase allowed** - React component files conventionally use PascalCase, so `unicorn/filename-case` is disabled.

3. **Relaxed `explicit-function-return-type`** - `allowHigherOrderFunctions: true` to reduce friction with React patterns (HOCs, hooks, etc.)

4. **Complexity rules as warnings** - Start as `warn` instead of `error` to allow gradual compliance.

5. **Preserved Next.js native flat config** - Uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` directly instead of FlatCompat.

### Performance Considerations

Type-aware linting (rules using `parserOptions.project`) can slow down linting. To measure:

```bash
TIMING=1 npx eslint .
```

To improve performance:

- Use `--cache` flag: `eslint --cache .`
- Add `"lint": "eslint --cache ."` to package.json

### Future Improvements

1. **Enable complexity rules as errors** - After codebase compliance, change from `warn` to `error`
2. **Consider `unicorn/filename-case`** - If team agrees to kebab-case, enable with migration script
3. **Add more Vitest rules** - `eslint-plugin-vitest` has additional rules for test quality
