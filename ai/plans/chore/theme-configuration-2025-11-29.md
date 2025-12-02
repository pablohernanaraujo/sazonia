# Chore: Theme Configuration with Modular CSS Architecture

## Status: COMPLETED

**Completed:** 2025-11-29
**Evaluation:** 9/10 - See `ai/agents/evaluations/theme-configuration-2025-11-29.md`

## Chore Description

Configure a modular theme system for the application by creating a `src/styles` folder with separate CSS files for different design tokens. This follows Tailwind CSS v4's CSS-first configuration approach. The initial focus is on colors, with the architecture designed to incrementally add spacing, typography, and other token files over time.

The goal is to:

1. Create `src/styles/` folder structure
2. Start with `colors.css` containing all color variables from Figma (Glow UI design system)
3. Set up `globals.css` to import from the styles folder
4. Ensure the architecture supports incremental addition of `spacing.css`, `typography.css`, etc.

## Relevant Files

Use these files to resolve the chore:

- `.claude/rules/styling-guidelines.md` - Contains the Tailwind CSS 4 styling conventions, semantic color system, and CSS architecture patterns. Critical for understanding the expected token structure.
- `src/app/globals.css` - Current global CSS file that needs to be refactored to import from the new styles folder.
- `src/app/layout.tsx` - Application layout that imports globals.css. May need to verify the import path still works.
- `package.json` - Contains Tailwind CSS v4 dependency information.

### New Files

- `src/styles/colors.css` - New file containing all color variables (base colors, semantic colors, context colors for text/icons from Figma)
- `src/styles/index.css` - Main entry point that aggregates all style files (colors, and future spacing/typography)

## Step by Step Tasks

### Step 1: Create the styles folder structure [COMPLETED]

- [x] Create the `src/styles/` directory
- [x] This will house all modular theme CSS files

### Step 2: Create colors.css with Glow UI design tokens [COMPLETED]

- [x] Create `src/styles/colors.css`
- [x] Add base/primitive color palette (Theme/Base colors from Figma)
- [x] Add context colors for text & icons with all states (primary, secondary, tertiary, subtle, overlay, brand, semantic colors)
- [x] Add context colors for backgrounds and borders
- [x] Use CSS custom properties following Tailwind CSS 4 patterns
- [x] Organize colors in logical groups with comments

The colors from Figma include:

- **Text Base**: primary (#11181c), secondary (#697177), tertiary (#889096), subtle (#c1c8cd) with hover/active/disabled states
- **Text Overlay White**: primary (#ffffff) with states, secondary (#ffffff63) with states
- **Text Overlay Black**: primary (#000000) with states, secondary (#00000070) with states
- **Text Semantic**: brand (#3c61dd), success (#45a557), warning (#ff9f1a), danger (#e54d2e), additional (#8e4ec6) with states
- **Background Surface Base**: primary (#ffffff), secondary (#f9fafb)
- **Border Base**: primary (#d7dbdf), secondary (#e6e8eb), overlay-b-primary (#00000024)

### Step 3: Create index.css as the aggregator [COMPLETED]

- [x] Create `src/styles/index.css`
- [x] Import `colors.css`
- [x] Add placeholder comments for future imports (spacing.css, typography.css, animations.css)
- [x] This file serves as the single entry point for all theme styles

### Step 4: Update globals.css to use the new structure [COMPLETED]

- [x] Modify `src/app/globals.css` to import from `../styles/index.css`
- [x] Keep `@import "tailwindcss"` as the first import
- [x] Move any existing color definitions to colors.css
- [x] Keep `@theme inline {}` for Tailwind-specific mappings that reference the CSS variables
- [x] Maintain existing `@media (prefers-color-scheme: dark)` block
- [x] Keep body styles and font configuration

### Step 5: Update @theme inline block to use CSS variables [COMPLETED]

- [x] Update the `@theme inline` block in globals.css to reference CSS variables from colors.css
- [x] Map semantic tokens like `--color-background`, `--color-foreground`, `--color-primary` to the new CSS variables
- [x] Ensure Tailwind utility classes (bg-_, text-_, border-\*) use the new token system

### Step 6: Verify the build and development server [COMPLETED]

- [x] Run `npm run dev` to verify no CSS errors
- [x] Run `npm run build` to ensure production build works
- [x] Check that the application renders correctly with the new color system

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

| Command              | Result                                            |
| -------------------- | ------------------------------------------------- |
| `npm run build`      | PASS - Compiled successfully                      |
| `npm run type-check` | PASS - No TypeScript errors                       |
| `npm run test:run`   | PASS - 103 tests passed                           |
| `npm run lint`       | 32 pre-existing errors (unrelated to CSS changes) |

## Implementation Results

### Files Created

1. **`src/styles/colors.css`**
   - Contains all Glow UI design tokens organized by context
   - Text colors: base, overlay white, overlay black, semantic
   - Background colors: surface primary/secondary
   - Border colors: base primary/secondary, overlay
   - All colors include state variants: default, hover, active, disabled

2. **`src/styles/index.css`**
   - Aggregator file that imports `colors.css`
   - Includes placeholder comments for future token files

### Files Modified

1. **`src/app/globals.css`**
   - Added import for `../styles/index.css`
   - Updated `@theme inline` block to use CSS variables from colors.css
   - Maintained existing dark mode media query
   - Maintained existing body styles

### Color Token Mapping

| Tailwind Utility   | CSS Variable          | Glow UI Token                       |
| ------------------ | --------------------- | ----------------------------------- |
| `bg-background`    | `--color-background`  | `--bg-surface-primary` (#ffffff)    |
| `text-foreground`  | `--color-foreground`  | `--text-base-primary` (#11181c)     |
| `text-primary`     | `--color-primary`     | `--text-semantic-brand` (#3c61dd)   |
| `text-success`     | `--color-success`     | `--text-semantic-success` (#45a557) |
| `text-warning`     | `--color-warning`     | `--text-semantic-warning` (#ff9f1a) |
| `text-destructive` | `--color-destructive` | `--text-semantic-danger` (#e54d2e)  |
| `border-border`    | `--color-border`      | `--border-base-primary` (#d7dbdf)   |

## Notes

- **Tailwind CSS v4 Pattern**: Uses `@theme inline {}` for theme configuration in CSS, no `tailwind.config.js`
- **Import Order Matters**: Tailwind CSS must be imported before custom styles for proper cascade
- **Incremental Approach**: Start with colors.css only. Spacing, typography, and other tokens will be added in future chores.
- **Semantic Tokens**: Follow the pattern of raw colors → semantic mappings → context-specific usage
- **Dark Mode Ready**: The architecture should support dark mode when needed (currently light-only)
- **Glow UI Design System**: Color tokens are sourced from Figma Glow UI Pro 1.8 design system

## Future Improvements (from Evaluation)

### Medium Priority

1. **Add spacing.css** - Create spacing tokens following the same pattern
2. **Add typography.css** - Extract typography variables to separate file
3. **Add dark mode tokens** - Currently using hardcoded hex values in dark mode media query

### Low Priority

1. **Add CSS comments** - Document which Tailwind utilities each token maps to
2. **Add hover/active/disabled background variants** - Currently only text colors have state variants

## Architecture Notes

The implemented architecture supports:

- **Incremental token addition**: New token files can be added to `index.css`
- **Rebranding**: Change color mappings without touching component code
- **Dark mode**: Infrastructure ready for dark mode token expansion
- **Tailwind integration**: Utilities like `bg-background`, `text-foreground` work correctly
