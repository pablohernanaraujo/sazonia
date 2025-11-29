# ESLint Extended Configuration Plan - Evaluation

## Overall Assessment

**Status: NEEDS CHANGES**

The plan provides a solid foundation for extending ESLint configuration but contains several critical and major issues that must be addressed before implementation. The plan demonstrates good understanding of the ESLint flat config format and covers most necessary plugins, but lacks important details for Next.js 15, React 19, and Vitest compatibility.

---

## Detailed Findings

### 1. Completeness

**Rating: 6/10 - Incomplete**

#### Missing Elements

1. **No actual ESLint configuration code provided**
   - Step 3 describes what the configuration should do but does not include the actual `eslint.config.mjs` content
   - Without the actual config, it is impossible to verify rule correctness

2. **Missing `prettier-plugin-tailwindcss` installation**
   - The `.prettierrc` references `prettier-plugin-tailwindcss` but Step 1 does not install it
   - **Fix**: Add to installation command:

   ```bash
   npm install -D prettier-plugin-tailwindcss
   ```

3. **Missing Vitest globals configuration**
   - The plan mentions "Jest globals" but the project uses Vitest with `globals: true`
   - The tsconfig.json already includes `vitest/globals` types, but ESLint needs proper configuration
   - Current config uses `globals.jest` which is incorrect for Vitest

4. **Missing eslint-plugin-react installation**
   - The plan mentions `react/react-in-jsx-scope` rule but does not install `eslint-plugin-react`
   - Note: This rule is unnecessary with React 17+ JSX transform

5. **No ignores pattern for `.storybook` directory**
   - The `.storybook` directory may need special handling or inclusion in ignores

#### Adequate Coverage

- Dependencies list is mostly complete
- Prettier configuration is well-defined
- lint-staged update is appropriate
- Validation commands are comprehensive

---

### 2. Correctness

**Rating: 5/10 - Several Issues**

#### Rule Conflicts Identified

1. **`object-property-newline` vs Prettier - CRITICAL**
   - The plan notes this potential conflict but does not provide a solution
   - Setting `allowAllPropertiesOnSameLine: false` will conflict with Prettier
   - **Recommendation**: Remove this rule entirely or let Prettier handle object formatting
   - `eslint-config-prettier` disables conflicting ESLint rules, but custom rules added after may still conflict

2. **`max-len` vs Prettier**
   - Prettier handles line length formatting
   - ESLint `max-len` rule can cause conflicts and false positives (e.g., long import paths, URLs)
   - **Recommendation**: Remove `max-len` rule; rely on Prettier's `printWidth`

3. **`arrow-body-style` potential conflict**
   - This can conflict with Prettier in some edge cases
   - **Recommendation**: If using `eslint-config-prettier`, verify this rule is disabled or test thoroughly

#### Configuration Issues

4. **Missing rule specification**
   - The plan mentions enabling rules but does not specify error levels (error vs warn)
   - Complexity rules (`max-depth`, `max-params`, `max-statements`) should start as warnings

5. **`import/*` rules require resolver configuration**
   - `eslint-plugin-import` needs resolver configuration for TypeScript:

   ```javascript
   settings: {
     'import/resolver': {
       typescript: true,
       node: true,
     },
   }
   ```

   - Missing `eslint-import-resolver-typescript` package

6. **Duplicate `react/react-in-jsx-scope` mentioned**
   - The plan notes duplication but this rule should be disabled entirely (React 17+ does not require React in scope)

---

### 3. Next.js 15 and React 19 Compatibility

**Rating: 7/10 - Minor Issues**

#### Compatibility Concerns

1. **Next.js built-in ESLint rules**
   - The current config correctly uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
   - The plan mentions using `FlatCompat` for `next/core-web-vitals`, but the current config already uses the native flat config support
   - **Recommendation**: Keep the current approach with `eslint-config-next` native flat configs instead of using `FlatCompat`

2. **React 19 Compiler compatibility**
   - Project uses `babel-plugin-react-compiler` (React 19 compiler)
   - The `react-hooks/exhaustive-deps` rule may have different behavior with the compiler
   - Some files already have `// eslint-disable-next-line react-hooks/exhaustive-deps` comments that may need review

3. **Server Components consideration**
   - The plan does not address Server Component vs Client Component linting
   - Consider adding rules to enforce `'use client'` directive where needed

#### Positive Aspects

- TypeScript parser configuration with project reference is correct
- React Hooks plugin is appropriate for React 19

---

### 4. Testing Impact

**Rating: 4/10 - Significant Issues**

#### Critical Issues

1. **Wrong test globals - CRITICAL**
   - Current config uses `globals.jest` but project uses Vitest
   - The plan mentions "Jest globals" which is incorrect
   - **Fix**: Use Vitest globals:

   ```javascript
   import globals from 'globals';

   // For test files
   {
     files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
     languageOptions: {
       globals: {
         ...globals.node,
         // Vitest globals (describe, it, expect, vi, etc.)
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
   }
   ```

   - Alternatively, consider using `eslint-plugin-vitest` for proper Vitest support

2. **Test file patterns incomplete**
   - Pattern `**/*.test.{ts,tsx}` is correct
   - Missing `**/*.spec.{ts,tsx}` pattern mentioned in vitest.config.ts
   - Missing setup files pattern: `vitest.setup.tsx`, `src/test-utils.tsx`

3. **Missing eslint-plugin-vitest recommendation**
   - Consider adding `eslint-plugin-vitest` for Vitest-specific rules:
   ```bash
   npm install -D eslint-plugin-vitest
   ```

#### Test-Specific Rules Needed

4. **Relaxed rules for test files**
   - `@typescript-eslint/explicit-function-return-type` should be disabled in tests
   - `max-statements` should be relaxed or disabled in tests
   - `unicorn/filename-case` may need exceptions for test files

---

### 5. Storybook Compatibility

**Rating: 8/10 - Good**

#### Positive Aspects

1. Current config already includes `eslint-plugin-storybook` with flat config
2. Plan mentions preserving Storybook rules

#### Minor Issues

1. **Story file patterns**
   - Ensure `**/*.stories.{ts,tsx}` files have appropriate rule relaxations
   - Stories often need different rules (e.g., no explicit return types for meta objects)

2. **Missing relaxations for story files**
   ```javascript
   {
     files: ['**/*.stories.{ts,tsx}'],
     rules: {
       '@typescript-eslint/explicit-function-return-type': 'off',
       'import/no-default-export': 'off', // Stories require default export
     },
   }
   ```

---

### 6. Potential Issues

#### Critical Issues

| Issue                                     | Description                                      | Impact                           |
| ----------------------------------------- | ------------------------------------------------ | -------------------------------- |
| Vitest vs Jest globals                    | Config uses Jest globals but project uses Vitest | Linting errors in test files     |
| object-property-newline conflict          | Will conflict with Prettier formatting           | Constant reformatting conflicts  |
| Missing eslint-import-resolver-typescript | Import rules will not work with TypeScript paths | False positives on import errors |
| No actual config provided                 | Cannot validate the actual implementation        | Unknown implementation issues    |

#### Major Issues

| Issue                                     | Description                                             | Impact                         |
| ----------------------------------------- | ------------------------------------------------------- | ------------------------------ |
| unicorn/filename-case                     | Many files use PascalCase (Button.tsx, AuthContext.tsx) | Requires renaming 15+ files    |
| explicit-function-return-type strict mode | `allowHigherOrderFunctions: false` is very strict       | Significant refactoring needed |
| Missing prettier-plugin-tailwindcss       | Plugin referenced but not installed                     | Prettier will fail             |
| max-len rule                              | Conflicts with Prettier handling                        | Duplicate warnings             |

#### Minor Issues

| Issue                          | Description                             | Impact                              |
| ------------------------------ | --------------------------------------- | ----------------------------------- |
| React 17+ JSX transform        | react/react-in-jsx-scope is unnecessary | Noise in config                     |
| Type-aware linting performance | Can be slow on large codebases          | Developer experience                |
| Missing .storybook handling    | Directory not in ignores                | May lint config files unnecessarily |

---

### 7. Recommendations

#### Critical Fixes Required

1. **Provide the actual ESLint configuration**

   Create a complete `eslint.config.mjs` file. Here is a recommended structure:

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
   import tseslint from 'typescript-eslint';

   export default defineConfig([
     // Next.js configs (already flat config compatible)
     ...nextVitals,
     ...nextTs,

     // Storybook
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
     ]),

     // Main configuration
     {
       files: ['**/*.{ts,tsx}'],
       plugins: {
         prettier,
         'simple-import-sort': simpleImportSort,
         unicorn,
       },
       rules: {
         // Prettier
         'prettier/prettier': 'error',

         // Import sorting
         'simple-import-sort/imports': 'error',
         'simple-import-sort/exports': 'error',

         // Code quality (start as warnings)
         'max-depth': ['warn', 3],
         'max-params': ['warn', 3],
         complexity: ['warn', 10],

         // Unicorn (selective)
         'unicorn/prefer-node-protocol': 'error',
         'unicorn/no-null': 'off', // React uses null frequently
         // Note: unicorn/filename-case omitted - see recommendation below
       },
     },

     // TypeScript-specific rules
     {
       files: ['**/*.{ts,tsx}'],
       rules: {
         '@typescript-eslint/no-unused-vars': [
           'error',
           {
             argsIgnorePattern: '^_',
             varsIgnorePattern: '^_',
           },
         ],
         '@typescript-eslint/no-explicit-any': 'warn',
         // Start with more lenient return type rules
         '@typescript-eslint/explicit-function-return-type': [
           'warn',
           {
             allowExpressions: true,
             allowTypedFunctionExpressions: true,
             allowHigherOrderFunctions: true, // Changed from false
           },
         ],
       },
     },

     // Test files
     {
       files: [
         '**/*.test.{ts,tsx}',
         '**/*.spec.{ts,tsx}',
         'vitest.setup.tsx',
         'src/test-utils.tsx',
       ],
       languageOptions: {
         globals: {
           ...globals.node,
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
         '@typescript-eslint/explicit-function-return-type': 'off',
         'max-statements': 'off',
       },
     },

     // Story files
     {
       files: ['**/*.stories.{ts,tsx}'],
       rules: {
         '@typescript-eslint/explicit-function-return-type': 'off',
       },
     },
   ]);
   ```

2. **Add missing dependencies**

   Update Step 1 installation command:

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
     eslint-config-prettier
   ```

3. **Remove conflicting rules**

   Remove from configuration:
   - `object-property-newline` (conflicts with Prettier)
   - `max-len` (Prettier handles this)
   - `react/react-in-jsx-scope` (unnecessary with React 17+)

4. **Fix Vitest globals**

   Replace `globals.jest` with Vitest globals as shown above. Consider adding `eslint-plugin-vitest` for additional Vitest-specific rules.

#### Major Recommendations

5. **Reconsider `unicorn/filename-case`**

   Current project has PascalCase component files which is a React convention:
   - `Button.tsx`
   - `AuthContext.tsx`
   - `FirebaseErrorBoundary.tsx`

   Options:
   - **Option A (Recommended)**: Disable the rule entirely
   - **Option B**: Use with exceptions:
     ```javascript
     'unicorn/filename-case': ['error', {
       cases: {
         kebabCase: true,
         pascalCase: true, // Allow for React components
       },
       ignore: [
         /\.stories\.tsx$/,
         /\.test\.tsx$/,
       ],
     }],
     ```

6. **Relax `explicit-function-return-type`**

   The strict setting (`allowHigherOrderFunctions: false`) will require significant refactoring. Start with:

   ```javascript
   '@typescript-eslint/explicit-function-return-type': ['warn', {
     allowExpressions: true,
     allowTypedFunctionExpressions: true,
     allowHigherOrderFunctions: true,
     allowConciseArrowFunctionExpressionsStartingWithVoid: true,
   }],
   ```

7. **Add eslint-plugin-vitest**

   For better Vitest integration:

   ```bash
   npm install -D eslint-plugin-vitest
   ```

   Then add to config:

   ```javascript
   import vitest from 'eslint-plugin-vitest';

   // In test files config
   {
     files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
     plugins: { vitest },
     rules: {
       ...vitest.configs.recommended.rules,
     },
   }
   ```

#### Minor Recommendations

8. **Add complexity rule as warning first**

   Start with warnings and increase to errors after codebase compliance:

   ```javascript
   complexity: ['warn', 10],
   'max-depth': ['warn', 3],
   'max-params': ['warn', 3],
   'max-statements': ['warn', 15], // More lenient than 12
   ```

9. **Consider type-aware linting performance**

   Type-aware linting (rules using `parserOptions.project`) can be slow. Consider:
   - Using `TIMING=1 npx eslint .` to measure
   - Caching with `--cache` flag
   - Selective type-aware rules only where needed

10. **Add script for auto-fix**

    Add to package.json:

    ```json
    {
      "scripts": {
        "lint:fix": "eslint --fix ."
      }
    }
    ```

---

## Issues Summary

### Critical (Must Fix Before Implementation)

1. [ ] Provide complete `eslint.config.mjs` content
2. [ ] Fix Vitest globals (replace Jest with Vitest)
3. [ ] Remove `object-property-newline` rule (Prettier conflict)
4. [ ] Add `prettier-plugin-tailwindcss` to installation

### Major (Should Fix)

5. [ ] Add `eslint-import-resolver-typescript` for TypeScript path resolution
6. [ ] Decide on `unicorn/filename-case` strategy (disable or allow PascalCase)
7. [ ] Relax `explicit-function-return-type` for higher-order functions
8. [ ] Add test file and story file rule relaxations
9. [ ] Remove `max-len` rule (use Prettier's printWidth)

### Minor (Nice to Have)

10. [ ] Add `eslint-plugin-vitest` for better test support
11. [ ] Start complexity rules as warnings
12. [ ] Add `lint:fix` script to package.json
13. [ ] Document type-aware linting performance considerations

---

## Final Verdict

**Status: NEEDS CHANGES**

The plan cannot be implemented as-is due to:

1. **Missing actual configuration code** - The plan describes what should be done but does not provide the implementation
2. **Critical compatibility issues** - Vitest vs Jest globals mismatch will break test file linting
3. **Rule conflicts** - `object-property-newline` will conflict with Prettier causing constant formatting issues
4. **Missing dependencies** - `prettier-plugin-tailwindcss` and `eslint-import-resolver-typescript` are required but not listed

### Action Items

1. **Before Implementation**: Update the plan with:
   - Complete `eslint.config.mjs` file content
   - Fixed dependency list
   - Corrected Vitest configuration
   - Removed conflicting rules

2. **During Implementation**:
   - Run ESLint with `--fix` to auto-correct issues
   - Address filename-case violations (rename or disable rule)
   - Add return types incrementally (start as warnings)

3. **After Implementation**:
   - Run full validation suite (`npm run lint && npm run type-check && npm run test:run && npm run build`)
   - Monitor for Prettier/ESLint conflicts
   - Measure performance impact with `TIMING=1`

---

_Evaluation completed: 2025-01-29_
_Evaluator: Next.js Testing Architect Agent_
