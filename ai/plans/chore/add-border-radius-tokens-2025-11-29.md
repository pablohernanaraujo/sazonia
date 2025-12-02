# Chore: Add Border Radius Tokens to Styles

## Chore Description

Add border radius design tokens from the Glow UI Figma design system to the project's styles directory. The tokens should follow the existing pattern used for spacing and color tokens, using CSS custom properties that can be consumed by Tailwind CSS 4's theme system.

The border radius scale from Figma includes 11 values:

- `radius-none`: 0px
- `radius-xxs`: 2px
- `radius-xs`: 4px
- `radius-sm`: 6px
- `radius-md`: 8px
- `radius-lg`: 10px
- `radius-xl`: 12px
- `radius-2xl`: 14px
- `radius-3xl`: 16px
- `radius-4xl`: 18px
- `radius-full`: 999px

## Relevant Files

Use these files to resolve the chore:

- `src/styles/index.css` - The main style aggregator file that imports all token files. Needs to be updated to import the new border-radius.css file.
- `src/styles/spacing.css` - Reference file showing the existing token pattern with CSS custom properties in `:root`. The border radius tokens should follow the same documentation and naming convention pattern.
- `src/app/globals.css` - The main Tailwind CSS 4 configuration file that imports the styles/index.css. May need to add `--radius-*` mappings in `@theme inline` to expose tokens to Tailwind utilities.
- `.claude/rules/styling-guidelines.md` - The styling guidelines documentation that mentions border radius usage. Should be updated to document the new design tokens.

### New Files

- `src/styles/border-radius.css` - New file containing all border radius CSS custom properties following the same pattern as `spacing.css`.

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create border-radius.css token file

- Create a new file at `src/styles/border-radius.css`
- Follow the documentation pattern from `spacing.css`:
  - Add a header comment explaining the source (Figma Glow UI Pro 1.8)
  - Document the naming convention
  - Provide usage examples
- Define the border radius tokens in `:root`:
  ```css
  --radius-none: 0;
  --radius-xxs: 0.125rem; /* 2px */
  --radius-xs: 0.25rem; /* 4px */
  --radius-sm: 0.375rem; /* 6px */
  --radius-md: 0.5rem; /* 8px */
  --radius-lg: 0.625rem; /* 10px */
  --radius-xl: 0.75rem; /* 12px */
  --radius-2xl: 0.875rem; /* 14px */
  --radius-3xl: 1rem; /* 16px */
  --radius-4xl: 1.125rem; /* 18px */
  --radius-full: 999px;
  ```

### Step 2: Update index.css to import border-radius.css

- Edit `src/styles/index.css`
- Add `@import './border-radius.css';` after the spacing.css import
- Update the header comment to include border radius in the architecture list

### Step 3: Add Tailwind theme mappings in globals.css

- Edit `src/app/globals.css`
- Add `--radius-*` variables inside `@theme inline` to expose them to Tailwind utilities:
  ```css
  /* Border Radius */
  --radius-none: var(--radius-none);
  --radius-xxs: var(--radius-xxs);
  --radius-xs: var(--radius-xs);
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);
  --radius-2xl: var(--radius-2xl);
  --radius-3xl: var(--radius-3xl);
  --radius-4xl: var(--radius-4xl);
  --radius-full: var(--radius-full);
  ```

### Step 4: Update styling-guidelines.md documentation

- Edit `.claude/rules/styling-guidelines.md`
- Find the "Border Radius" section (around line 1657)
- Replace the generic Tailwind defaults documentation with the new Glow UI design tokens
- Document each token with its pixel value and usage guidelines
- Show examples of how to use the new tokens with Tailwind classes (e.g., `rounded-md`, `rounded-xl`)

### Step 5: Run Validation Commands

Execute all validation commands to ensure the chore is complete with zero regressions.

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

- `npm run lint` - Verify no linting errors in the codebase
- `npm run build` - Ensure the project builds successfully with the new CSS tokens
- `npm run test` - Run tests to verify no regressions

## Notes

- The border radius tokens use rem units for consistency with the spacing tokens, except for `radius-full` which uses pixels (999px) to ensure a fully circular border radius regardless of element size.
- The naming convention matches the Figma design system exactly for consistency between design and development.
- These tokens integrate with Tailwind CSS 4's `@theme inline` directive, which means they'll be available as utility classes like `rounded-md`, `rounded-xl`, etc.
- The token values are based on a 2px base unit with incremental steps, similar to the spacing scale.
