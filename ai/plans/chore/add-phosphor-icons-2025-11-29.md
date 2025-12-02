# Chore: Add Phosphor Icons Library

## Chore Description

Add the @phosphor-icons/react icon library to the project as the standard icon solution. Phosphor Icons is a flexible, consistent icon family with multiple weights (thin, light, regular, bold, fill, duotone) that integrates seamlessly with React applications. This chore involves installing the package, creating a wrapper component for consistent usage patterns, and documenting the icon usage guidelines.

## Relevant Files

Use these files to resolve the chore:

- `package.json` - Add the @phosphor-icons/react dependency
- `.claude/rules/styling-guidelines.md` - Document icon usage patterns and guidelines (reference for styling conventions)
- `src/ui/index.ts` - Update barrel export to include the new Icon component
- `src/lib/utils.ts` - Contains the `cn` utility function for class composition

### New Files

- `src/ui/icons/index.ts` - Barrel export for icon utilities and re-exports
- `src/ui/icons/icon.tsx` - Icon wrapper component with standardized props and sizes
- `src/stories/icons/icons.stories.tsx` - Storybook documentation showcasing icon usage

## Step by Step Tasks

### Step 1: Install @phosphor-icons/react Package

- Run `npm install @phosphor-icons/react` to add the dependency
- Verify the package is added to `package.json` dependencies

### Step 2: Create Icon Wrapper Component

- Create the `src/ui/icons/` directory structure
- Create `src/ui/icons/icon.tsx` with a generic Icon component that:
  - Accepts a Phosphor icon as a prop
  - Provides standardized size variants (xs, sm, md, lg, xl) mapped to pixel sizes
  - Supports weight variants (thin, light, regular, bold, fill, duotone)
  - Uses CVA (class-variance-authority) for variant management
  - Integrates with the project's semantic color system
  - Supports className prop for additional customization via `cn()`

Icon size mapping:

- `xs`: 12px (0.75rem)
- `sm`: 16px (1rem)
- `md`: 20px (1.25rem) - default
- `lg`: 24px (1.5rem)
- `xl`: 32px (2rem)

### Step 3: Create Barrel Export for Icons

- Create `src/ui/icons/index.ts` that:
  - Exports the Icon wrapper component
  - Re-exports commonly used icons from @phosphor-icons/react for convenience
  - Exports icon types for TypeScript usage

### Step 4: Update Main UI Barrel Export

- Update `src/ui/index.ts` to export from the new icons module
- Ensure proper tree-shaking by using named exports

### Step 5: Create Storybook Documentation

- Create `src/stories/icons/icons.stories.tsx` with:
  - A showcase of all icon sizes
  - A showcase of all icon weights
  - Examples of icons with different colors using semantic tokens
  - Interactive controls for size and weight
  - Code examples showing proper usage patterns
  - Accessibility notes (aria-label, role="img" when needed)

### Step 6: Run Validation Commands

- Run all validation commands to ensure zero regressions

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

- `npm run type-check` - Verify TypeScript compilation with no errors
- `npm run lint` - Ensure code passes ESLint rules
- `npm run test:run` - Run all tests to ensure no regressions
- `npm run build` - Verify production build succeeds
- `npm run build-storybook` - Verify Storybook build succeeds

## Notes

- Phosphor Icons supports tree-shaking, so only imported icons are bundled
- Use named imports for individual icons: `import { House, User } from '@phosphor-icons/react'`
- The wrapper component is optional for simple use cases - direct imports work fine
- Consider using the wrapper for consistent sizing across the application
- Phosphor Icons are designed to work at any size and automatically scale
- All icons support `aria-hidden="true"` by default - add `aria-label` when icon conveys meaning
- Icons should use `currentColor` for fill to inherit text color from parent
