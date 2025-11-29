# Chore: Implement Husky Git Hooks

## Chore Description

Implement Husky to enforce code quality checks before commits and pushes. This setup uses a **tiered approach** for optimal performance:

- **Pre-commit (fast, <15 seconds)**: Runs lint-staged (only on staged files) and type-checking
- **Pre-push (comprehensive)**: Runs full test suite and build validation

This approach prevents broken code from being committed while maintaining developer productivity by keeping commit times fast.

### Quality Checks Overview

| Hook       | Command              | Purpose                |
| ---------- | -------------------- | ---------------------- |
| pre-commit | `npx lint-staged`    | Lint only staged files |
| pre-commit | `npm run type-check` | TypeScript validation  |
| pre-push   | `npm run test:run`   | Full test suite        |
| pre-push   | `npm run build`      | Build validation       |

## Relevant Files

Use these files to resolve the chore:

- `package.json` - Contains existing npm scripts (`test:run`, `lint`, `build`). Will need to add `type-check` script, Husky-related scripts (`prepare`), and lint-staged configuration
- `tsconfig.json` - Used by TypeScript for type-checking. Already configured with `noEmit: true` which is suitable for type-check script
- `eslint.config.mjs` - ESLint configuration already set up and working with Next.js
- `vitest.config.ts` - Vitest configuration already set up for running tests
- `.gitignore` - May need to verify Husky directory handling (Husky directories are typically tracked)

### New Files

- `.husky/pre-commit` - Pre-commit hook script that runs fast quality checks (lint-staged + type-check)
- `.husky/pre-push` - Pre-push hook for comprehensive validation (tests + build)

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add type-check script to package.json

- Add a `type-check` script to `package.json` that runs TypeScript compiler without emitting files
- The script should be: `"type-check": "tsc --noEmit"`
- This script uses the existing `tsconfig.json` which already has `noEmit: true`

### Step 2: Update test:run script with --passWithNoTests

- Modify the `test:run` script to include `--passWithNoTests` flag
- This prevents failures when there are no test files matching the changed code
- Updated script: `"test:run": "vitest run --passWithNoTests"`

### Step 3: Install Husky and lint-staged as dev dependencies

- Run `npm install --save-dev husky lint-staged`
- This installs Husky v9.x (latest version) and lint-staged for optimized linting

### Step 4: Add Husky prepare script to package.json

- Add the `prepare` script to `package.json`: `"prepare": "husky || true"`
- The `|| true` ensures the script doesn't fail in non-Git environments (CI systems, zip downloads)
- This script runs automatically after `npm install` to set up Husky

### Step 5: Add lint-staged configuration to package.json

- Add the following lint-staged configuration to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix"],
    "*.{json,md,css}": ["prettier --write --ignore-unknown"]
  }
}
```

- This runs ESLint with auto-fix only on staged TypeScript files
- Prettier formatting is optional (remove if Prettier is not installed)

### Step 6: Initialize Husky

- Run `npx husky init` to initialize Husky in the project
- This creates the `.husky` directory and sets up Git hooks
- Alternatively, run `npm run prepare` after adding the prepare script

### Step 7: Create pre-commit hook (fast checks)

- Create/modify `.husky/pre-commit` file with the following content:
  ```bash
  npx lint-staged
  npm run type-check
  ```
- This hook runs only fast checks to keep commit times under 15 seconds
- lint-staged only processes staged files, making it very fast

### Step 8: Create pre-push hook (comprehensive checks)

- Create `.husky/pre-push` file with the following content:
  ```bash
  npm run test:run
  npm run build
  ```
- This hook runs comprehensive validation before pushing
- Tests and build are slower but only run when pushing to remote

### Step 9: Make hooks executable

- Run the following commands to ensure hooks are executable:
  ```bash
  chmod +x .husky/pre-commit
  chmod +x .husky/pre-push
  ```
- This is necessary for Git to execute the hooks (Unix/macOS only, Windows handles this automatically)

### Step 10: Verify Git hooks are properly configured

- Check that `.git/config` or Git hooks path is set to use Husky hooks
- Husky v9 uses the `core.hooksPath` Git config to point to `.husky`

### Step 11: Run Validation Commands

- Execute all validation commands to ensure the setup is correct and all checks pass

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

```bash
# Verify type-check script works
npm run type-check

# Verify all quality check scripts work
npm run test:run
npm run lint
npm run build

# Verify Husky is installed and configured
cat package.json | grep -A 1 '"prepare"'

# Verify lint-staged configuration exists
cat package.json | grep -A 5 '"lint-staged"'

# Verify .husky directory exists with both hooks
ls -la .husky/

# Verify pre-commit hook content
echo "=== pre-commit hook ==="
cat .husky/pre-commit

# Verify pre-push hook content
echo "=== pre-push hook ==="
cat .husky/pre-push

# Verify hooks are executable
test -x .husky/pre-commit && echo "pre-commit is executable" || echo "pre-commit is NOT executable"
test -x .husky/pre-push && echo "pre-push is executable" || echo "pre-push is NOT executable"

# Test the pre-commit hook by running it directly (should be fast)
time ./.husky/pre-commit

# Test the pre-push hook by running it directly
./.husky/pre-push
```

## Performance Comparison

### Before (Original Plan - All in pre-commit)

| Check            | Estimated Time     |
| ---------------- | ------------------ |
| test:run         | 5-30 seconds       |
| lint (all files) | 3-20 seconds       |
| type-check       | 5-15 seconds       |
| build            | 15-60 seconds      |
| **Total**        | **28-125 seconds** |

### After (Optimized - Tiered Approach)

| Hook                 | Check       | Estimated Time    |
| -------------------- | ----------- | ----------------- |
| pre-commit           | lint-staged | 1-3 seconds       |
| pre-commit           | type-check  | 5-15 seconds      |
| **Pre-commit Total** |             | **6-18 seconds**  |
| pre-push             | test:run    | 5-30 seconds      |
| pre-push             | build       | 15-60 seconds     |
| **Pre-push Total**   |             | **20-90 seconds** |

## Emergency Bypass

In rare cases where you need to bypass hooks (urgent hotfixes, work-in-progress commits):

```bash
# Bypass pre-commit hook only
git commit --no-verify -m "WIP: urgent fix"

# Bypass pre-push hook only
git push --no-verify
```

**Warning**: Use `--no-verify` sparingly. All bypassed commits should pass CI checks.

## CI/CD Considerations

- The `prepare` script uses `|| true` to handle CI environments gracefully
- CI systems should run their own validation pipeline, not rely on Git hooks
- Husky automatically detects CI environments and skips hook installation

## Notes

- Husky v9 uses a simplified setup compared to older versions - no need for `.husky/_/husky.sh` or complex configurations
- The `prepare` script ensures Husky is set up automatically for all team members after they run `npm install`
- lint-staged dramatically improves performance by only linting staged files instead of the entire codebase
- The tiered approach (fast pre-commit, comprehensive pre-push) balances code quality with developer productivity
- All scripts should already be working: `test:run`, `lint`, and `build` are confirmed in `package.json`; only `type-check` needs to be added

## Future Improvements

Consider these additions as the project grows:

1. **commitlint** - Enforce conventional commit messages:

   ```bash
   npm install --save-dev @commitlint/cli @commitlint/config-conventional
   ```

2. **Prettier** - Add consistent code formatting (if not already installed):

   ```bash
   npm install --save-dev prettier eslint-config-prettier
   ```

3. **Parallel execution** - Run independent checks in parallel using `concurrently`:
   ```bash
   npm install --save-dev concurrently
   ```
