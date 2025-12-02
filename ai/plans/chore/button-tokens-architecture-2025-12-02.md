# Chore: Button Component Tokens Architecture

## Chore Description

Migrate the Button component to use a 3-layer token architecture following the design system standards. This involves creating:

1. **Semantic tokens layer** - Maps core/primitive tokens to semantic intent (e.g., `--surface`, `--brand`, `--text-default`)
2. **Component tokens layer** - Button-specific tokens that reference semantic tokens (e.g., `--button-bg`, `--button-fg`, `--button-radius`)
3. **Update Button component** - Use CSS variables instead of hardcoded Tailwind classes for themeable properties

The goal is to enable global theming by changing semantic tokens without modifying individual components, while maintaining Tailwind v4 compatibility.

## Relevant Files

Use these files to resolve the chore:

### Existing Files to Modify

- `src/styles/index.css` - Style aggregator that imports all token files. Need to add imports for new semantic and component token layers.
- `src/app/globals.css` - Contains `@theme` for Tailwind v4 utilities. Will remain as-is for build-time utilities; runtime tokens go in separate files.
- `src/ui/buttons/button.tsx` - The Button component that will consume the new component tokens via CSS variables.
- `src/ui/buttons/__tests__/button.test.tsx` - Tests may need updates if class names change.
- `.claude/rules/styling-guidelines.md` - May need documentation updates to reflect the new token architecture.

### Reference Files (Read Only)

- `src/styles/colors.css` - Core/primitive color tokens (already exists, properly uses `:root`).
- `src/styles/border-radius.css` - Core border radius tokens.
- `src/styles/shadows.css` - Core shadow tokens.
- `src/styles/spacing.css` - Core spacing tokens.

### New Files

- `src/styles/tokens/semantic/theme-light.css` - Semantic tokens for light theme mapping core tokens to intent.
- `src/styles/tokens/components/button.css` - Button component tokens that reference semantic tokens.

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create the tokens directory structure

Create the new directory structure for the 3-layer token architecture:

- Create `src/styles/tokens/` directory
- Create `src/styles/tokens/semantic/` subdirectory
- Create `src/styles/tokens/components/` subdirectory

### Step 2: Create semantic theme tokens file

Create `src/styles/tokens/semantic/theme-light.css` with semantic mappings:

```css
/**
 * Semantic Theme Tokens - Light Mode
 * Maps core primitive tokens to semantic intent.
 * Components reference these tokens for consistent theming.
 */

:root {
  /* ============================================
   * SURFACE - Background contexts
   * ============================================ */
  --surface-primary: var(--bg-surface-base-primary);
  --surface-secondary: var(--bg-surface-base-secondary);
  --surface-tertiary: var(--bg-surface-base-tertiary);

  /* ============================================
   * BRAND - Primary brand colors
   * ============================================ */
  --brand-fill: var(--bg-fill-brand-primary);
  --brand-fill-hover: var(--bg-fill-brand-primary-hover);
  --brand-fill-active: var(--bg-fill-brand-primary-active);
  --brand-text: var(--text-semantic-brand);

  /* ============================================
   * SECONDARY - Neutral fill colors
   * ============================================ */
  --secondary-fill: var(--bg-fill-base-secondary);
  --secondary-fill-hover: var(--bg-fill-base-secondary-hover);
  --secondary-fill-active: var(--bg-fill-base-secondary-active);

  /* ============================================
   * TERTIARY - Subtle fill colors
   * ============================================ */
  --tertiary-fill: var(--bg-fill-base-tertiary);
  --tertiary-fill-hover: var(--bg-fill-base-tertiary-hover);
  --tertiary-fill-active: var(--bg-fill-base-tertiary-active);

  /* ============================================
   * DANGER - Destructive actions
   * ============================================ */
  --danger-fill: var(--text-semantic-danger);
  --danger-fill-hover: var(--text-semantic-danger-hover);
  --danger-fill-active: var(--text-semantic-danger-active);
  --danger-text: var(--text-semantic-danger);

  /* ============================================
   * TEXT - Content text
   * ============================================ */
  --text-primary: var(--text-base-primary);
  --text-secondary: var(--text-base-secondary);
  --text-overlay-white: var(--text-overlay-w-primary);

  /* ============================================
   * BORDER - Component borders
   * ============================================ */
  --border-default: var(--border-base-primary);
  --border-brand: var(--border-brand-primary);
  --border-danger: var(--text-semantic-danger);

  /* ============================================
   * FOCUS - Focus ring colors
   * ============================================ */
  --focus-ring-brand: var(--bg-fill-brand-primary);
  --focus-ring-secondary: var(--text-base-secondary);
  --focus-ring-danger: var(--text-semantic-danger);
}
```

### Step 3: Create button component tokens file

Create `src/styles/tokens/components/button.css` with button-specific tokens:

```css
/**
 * Button Component Tokens
 * References semantic tokens for consistent theming.
 * Use these tokens in Button component styles.
 */

:root {
  /* ============================================
   * BUTTON - Layout tokens
   * ============================================ */
  --button-border-radius: var(--radius-sm);
  --button-gap: 0.5rem;

  /* ============================================
   * BUTTON - Size tokens (height, padding)
   * ============================================ */
  --button-height-sm: 2rem;
  --button-height-md: 2.5rem;
  --button-height-lg: 3rem;

  --button-padding-x-sm: 0.75rem;
  --button-padding-y-sm: 0.5rem;
  --button-padding-x-md: 0.875rem;
  --button-padding-y-md: 0.625rem;
  --button-padding-x-lg: 0.875rem;
  --button-padding-y-lg: 0.75rem;

  /* ============================================
   * BUTTON FILLED PRIMARY - Brand button
   * ============================================ */
  --button-filled-primary-bg: var(--brand-fill);
  --button-filled-primary-bg-hover: var(--brand-fill-hover);
  --button-filled-primary-bg-active: var(--brand-fill-active);
  --button-filled-primary-text: var(--text-overlay-white);

  /* ============================================
   * BUTTON FILLED SECONDARY - Neutral button
   * ============================================ */
  --button-filled-secondary-bg: var(--secondary-fill);
  --button-filled-secondary-bg-hover: var(--secondary-fill-hover);
  --button-filled-secondary-bg-active: var(--secondary-fill-active);
  --button-filled-secondary-text: var(--text-primary);

  /* ============================================
   * BUTTON FILLED DANGER - Destructive button
   * ============================================ */
  --button-filled-danger-bg: var(--danger-fill);
  --button-filled-danger-bg-hover: var(--danger-fill-hover);
  --button-filled-danger-bg-active: var(--danger-fill-active);
  --button-filled-danger-text: var(--text-overlay-white);

  /* ============================================
   * BUTTON OUTLINE PRIMARY - Brand outline
   * ============================================ */
  --button-outline-primary-border: var(--border-brand);
  --button-outline-primary-text: var(--brand-text);
  --button-outline-primary-bg-hover: rgba(60, 97, 221, 0.1);
  --button-outline-primary-bg-active: rgba(60, 97, 221, 0.2);

  /* ============================================
   * BUTTON OUTLINE SECONDARY - Neutral outline
   * ============================================ */
  --button-outline-secondary-border: var(--border-default);
  --button-outline-secondary-text: var(--text-primary);
  --button-outline-secondary-bg-hover: var(--secondary-fill);
  --button-outline-secondary-bg-active: var(--secondary-fill-hover);

  /* ============================================
   * BUTTON OUTLINE DANGER - Destructive outline
   * ============================================ */
  --button-outline-danger-border: var(--border-danger);
  --button-outline-danger-text: var(--danger-text);
  --button-outline-danger-bg-hover: rgba(229, 77, 46, 0.1);
  --button-outline-danger-bg-active: rgba(229, 77, 46, 0.2);

  /* ============================================
   * BUTTON TINTED PRIMARY - Brand tinted
   * ============================================ */
  --button-tinted-primary-bg: rgba(60, 97, 221, 0.1);
  --button-tinted-primary-bg-hover: rgba(60, 97, 221, 0.2);
  --button-tinted-primary-bg-active: rgba(60, 97, 221, 0.3);
  --button-tinted-primary-text: var(--brand-text);

  /* ============================================
   * BUTTON TINTED SECONDARY - Neutral tinted
   * ============================================ */
  --button-tinted-secondary-bg: var(--tertiary-fill);
  --button-tinted-secondary-bg-hover: var(--tertiary-fill-hover);
  --button-tinted-secondary-bg-active: var(--tertiary-fill-active);
  --button-tinted-secondary-text: var(--text-primary);

  /* ============================================
   * BUTTON TINTED DANGER - Destructive tinted
   * ============================================ */
  --button-tinted-danger-bg: rgba(229, 77, 46, 0.1);
  --button-tinted-danger-bg-hover: rgba(229, 77, 46, 0.2);
  --button-tinted-danger-bg-active: rgba(229, 77, 46, 0.3);
  --button-tinted-danger-text: var(--danger-text);

  /* ============================================
   * BUTTON PLAIN PRIMARY - Brand plain
   * ============================================ */
  --button-plain-primary-text: var(--brand-text);
  --button-plain-primary-bg-hover: rgba(60, 97, 221, 0.1);
  --button-plain-primary-bg-active: rgba(60, 97, 221, 0.2);

  /* ============================================
   * BUTTON PLAIN SECONDARY - Neutral plain
   * ============================================ */
  --button-plain-secondary-text: var(--text-primary);
  --button-plain-secondary-bg-hover: var(--tertiary-fill);
  --button-plain-secondary-bg-active: var(--tertiary-fill-hover);

  /* ============================================
   * BUTTON PLAIN DANGER - Destructive plain
   * ============================================ */
  --button-plain-danger-text: var(--danger-text);
  --button-plain-danger-bg-hover: rgba(229, 77, 46, 0.1);
  --button-plain-danger-bg-active: rgba(229, 77, 46, 0.2);

  /* ============================================
   * BUTTON - Focus ring tokens
   * ============================================ */
  --button-focus-ring-primary: var(--focus-ring-brand);
  --button-focus-ring-secondary: var(--focus-ring-secondary);
  --button-focus-ring-danger: var(--focus-ring-danger);

  /* ============================================
   * BUTTON - Disabled state
   * ============================================ */
  --button-disabled-opacity: 0.52;
}
```

### Step 4: Update styles index to import new token files

Update `src/styles/index.css` to import the new semantic and component token files:

```css
/**
 * Sazonia Design System - Style Aggregator
 *
 * This file serves as the single entry point for all design tokens.
 * Import this file in globals.css to access all theme variables.
 *
 * Architecture (3 Layers):
 * 1. Core/Primitives: Raw color, spacing, radius, shadow, blur values
 * 2. Semantic: Maps primitives to intent (surface, brand, text, etc.)
 * 3. Components: Component-specific tokens referencing semantic layer
 */

/* ============================================
 * LAYER 1: Core/Primitive Tokens
 * ============================================ */

/* Color tokens from Glow UI design system */
@import './colors.css';

/* Spacing tokens from Glow UI design system */
@import './spacing.css';

/* Border radius tokens from Glow UI design system */
@import './border-radius.css';

/* Shadow effect tokens from Glow UI design system */
@import './shadows.css';

/* Blur effect tokens from Glow UI design system */
@import './blur.css';

/* ============================================
 * LAYER 2: Semantic Tokens
 * ============================================ */

/* Light theme semantic tokens */
@import './tokens/semantic/theme-light.css';

/* ============================================
 * LAYER 3: Component Tokens
 * ============================================ */

/* Button component tokens */
@import './tokens/components/button.css';

/* Future component token imports:
 * @import './tokens/components/input.css';
 * @import './tokens/components/card.css';
 */
```

### Step 5: Update Button component to use CSS custom properties

Modify `src/ui/buttons/button.tsx` to use the new CSS custom properties in the CVA variants. The key changes are:

1. Update the `buttonVariants` CVA configuration to use CSS variables
2. Keep the Tailwind classes for layout, typography, and transitions
3. Use `[property:var(--token)]` syntax for themeable properties

Update the compound variants to use arbitrary properties with CSS variables:

```typescript
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-[var(--button-gap)]',
    'cursor-pointer',
    'font-medium',
    'rounded-[var(--button-border-radius)]',
    'transition-colors duration-150',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-[var(--button-disabled-opacity)]',
  ],
  {
    variants: {
      variant: {
        filled: '',
        outline: 'border bg-transparent',
        tinted: '',
        plain: 'bg-transparent',
      },
      color: {
        primary: '',
        secondary: '',
        danger: '',
      },
      size: {
        sm: 'h-[var(--button-height-sm)] px-[var(--button-padding-x-sm)] py-[var(--button-padding-y-sm)] text-sm',
        md: 'h-[var(--button-height-md)] px-[var(--button-padding-x-md)] py-[var(--button-padding-y-md)] text-base',
        lg: 'h-[var(--button-height-lg)] px-[var(--button-padding-x-lg)] py-[var(--button-padding-y-lg)] text-base',
      },
    },
    compoundVariants: [
      // Filled + Primary
      {
        variant: 'filled',
        color: 'primary',
        className:
          'bg-[var(--button-filled-primary-bg)] text-[var(--button-filled-primary-text)] hover:bg-[var(--button-filled-primary-bg-hover)] active:bg-[var(--button-filled-primary-bg-active)]',
      },
      // Filled + Secondary
      {
        variant: 'filled',
        color: 'secondary',
        className:
          'bg-[var(--button-filled-secondary-bg)] text-[var(--button-filled-secondary-text)] hover:bg-[var(--button-filled-secondary-bg-hover)] active:bg-[var(--button-filled-secondary-bg-active)]',
      },
      // Filled + Danger
      {
        variant: 'filled',
        color: 'danger',
        className:
          'bg-[var(--button-filled-danger-bg)] text-[var(--button-filled-danger-text)] hover:bg-[var(--button-filled-danger-bg-hover)] active:bg-[var(--button-filled-danger-bg-active)]',
      },
      // Outline + Primary
      {
        variant: 'outline',
        color: 'primary',
        className:
          'border-[var(--button-outline-primary-border)] text-[var(--button-outline-primary-text)] hover:bg-[var(--button-outline-primary-bg-hover)] active:bg-[var(--button-outline-primary-bg-active)]',
      },
      // Outline + Secondary
      {
        variant: 'outline',
        color: 'secondary',
        className:
          'border-[var(--button-outline-secondary-border)] text-[var(--button-outline-secondary-text)] hover:bg-[var(--button-outline-secondary-bg-hover)] active:bg-[var(--button-outline-secondary-bg-active)]',
      },
      // Outline + Danger
      {
        variant: 'outline',
        color: 'danger',
        className:
          'border-[var(--button-outline-danger-border)] text-[var(--button-outline-danger-text)] hover:bg-[var(--button-outline-danger-bg-hover)] active:bg-[var(--button-outline-danger-bg-active)]',
      },
      // Tinted + Primary
      {
        variant: 'tinted',
        color: 'primary',
        className:
          'bg-[var(--button-tinted-primary-bg)] text-[var(--button-tinted-primary-text)] hover:bg-[var(--button-tinted-primary-bg-hover)] active:bg-[var(--button-tinted-primary-bg-active)]',
      },
      // Tinted + Secondary
      {
        variant: 'tinted',
        color: 'secondary',
        className:
          'bg-[var(--button-tinted-secondary-bg)] text-[var(--button-tinted-secondary-text)] hover:bg-[var(--button-tinted-secondary-bg-hover)] active:bg-[var(--button-tinted-secondary-bg-active)]',
      },
      // Tinted + Danger
      {
        variant: 'tinted',
        color: 'danger',
        className:
          'bg-[var(--button-tinted-danger-bg)] text-[var(--button-tinted-danger-text)] hover:bg-[var(--button-tinted-danger-bg-hover)] active:bg-[var(--button-tinted-danger-bg-active)]',
      },
      // Plain + Primary
      {
        variant: 'plain',
        color: 'primary',
        className:
          'text-[var(--button-plain-primary-text)] hover:bg-[var(--button-plain-primary-bg-hover)] active:bg-[var(--button-plain-primary-bg-active)]',
      },
      // Plain + Secondary
      {
        variant: 'plain',
        color: 'secondary',
        className:
          'text-[var(--button-plain-secondary-text)] hover:bg-[var(--button-plain-secondary-bg-hover)] active:bg-[var(--button-plain-secondary-bg-active)]',
      },
      // Plain + Danger
      {
        variant: 'plain',
        color: 'danger',
        className:
          'text-[var(--button-plain-danger-text)] hover:bg-[var(--button-plain-danger-bg-hover)] active:bg-[var(--button-plain-danger-bg-active)]',
      },
      // Focus ring colors based on color variant
      {
        color: 'primary',
        className: 'focus-visible:ring-[var(--button-focus-ring-primary)]',
      },
      {
        color: 'secondary',
        className: 'focus-visible:ring-[var(--button-focus-ring-secondary)]',
      },
      {
        color: 'danger',
        className: 'focus-visible:ring-[var(--button-focus-ring-danger)]',
      },
    ],
    defaultVariants: {
      variant: 'filled',
      color: 'primary',
      size: 'md',
    },
  }
);
```

### Step 6: Update Button tests to use CSS variable assertions

Modify `src/ui/buttons/__tests__/button.test.tsx` to test for CSS variable-based classes instead of hardcoded Tailwind classes:

- Update class assertions that check for specific color classes like `bg-fill-primary` to check for `bg-[var(--button-filled-primary-bg)]`
- Update border class assertions similarly
- The test structure remains the same, only the expected class names change

Key test updates:

- Line 26: `bg-fill-primary` → Check for CSS variable pattern
- Line 35: Same for filled variant
- Line 43: Border checks for outline variant
- Line 62-73: Color variant checks

### Step 7: Run validation commands

Execute all validation commands to ensure the changes work correctly with zero regressions.

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

- Run TypeScript type checking to ensure no type errors:

  ```bash
  npm run typecheck
  ```

- Run the linter to check for any code quality issues:

  ```bash
  npm run lint
  ```

- Run all Button-related tests to validate no regressions:

  ```bash
  npm run test -- src/ui/buttons/__tests__/button.test.tsx
  ```

- Run all tests to ensure no regressions across the codebase:

  ```bash
  npm run test
  ```

- Run the build to ensure production build succeeds:

  ```bash
  npm run build
  ```

- Start Storybook and visually verify Button component renders correctly (manual check):
  ```bash
  npm run storybook
  ```

## Notes

### Token Architecture Benefits

- **Global theming**: Change semantic tokens to update all components at once
- **Component isolation**: Each component has its own token namespace
- **Tailwind v4 compatibility**: `@theme` remains for build-time utilities; runtime theming uses CSS variables
- **Maintainability**: Clear separation of concerns between core, semantic, and component layers

### Migration Considerations

- The Button component currently uses Tailwind utility classes directly (e.g., `bg-fill-primary`)
- After migration, it will use CSS custom property syntax (e.g., `bg-[var(--button-filled-primary-bg)]`)
- Tests will need to be updated to check for the new class name patterns
- Storybook stories should continue to work without changes

### Future Extensibility

- To add dark mode: Create `src/styles/tokens/semantic/theme-dark.css` with `[data-theme="dark"]` selector
- To add new brand theme: Create new semantic file (e.g., `theme-brand-acme.css`)
- To add tokens for other components: Create files in `src/styles/tokens/components/`

### Important Caveats

1. The rgba() values in button tokens (for tinted variants) use hardcoded hex values - this is intentional because CSS `var()` cannot be used inside rgba() function. For full theming support, consider using CSS `color-mix()` in the future.

2. The import order in `src/styles/index.css` is critical: core → semantic → components. This ensures proper variable resolution.

3. Some tests check for specific class names - these will need to be updated to match the new CSS variable syntax.
