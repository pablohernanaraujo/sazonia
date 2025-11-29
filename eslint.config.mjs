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
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
        },
      ],
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
