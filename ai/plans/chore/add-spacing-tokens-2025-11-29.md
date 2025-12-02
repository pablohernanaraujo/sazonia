# Chore: Add Spacing Tokens to Design System

## Chore Description

Add spacing variables from the Glow UI design system to `src/styles/spacing.css`. The spacing scale is based on multiples of 2 pixels and follows the Glow UI naming convention (spacing-none, spacing-xxs, spacing-xs, etc.). These tokens will be used for paddings and gaps throughout the application, ensuring consistency with the Figma design.

Source: [Figma Glow UI - Spacing Variables](https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=41903-77261&m=dev)

The spacing scale from Figma is:

| Token Name   | Pixel Size | Rem Size |
| ------------ | ---------- | -------- |
| spacing-none | 0px        | 0rem     |
| spacing-xxs  | 2px        | 0.125rem |
| spacing-xs   | 4px        | 0.25rem  |
| spacing-sm   | 6px        | 0.375rem |
| spacing-md   | 8px        | 0.5rem   |
| spacing-lg   | 10px       | 0.625rem |
| spacing-xl   | 12px       | 0.75rem  |
| spacing-xxl  | 14px       | 0.875rem |
| spacing-3xl  | 16px       | 1rem     |
| spacing-4xl  | 18px       | 1.125rem |
| spacing-5xl  | 20px       | 1.25rem  |
| spacing-6xl  | 24px       | 1.5rem   |
| spacing-7xl  | 28px       | 1.75rem  |
| spacing-8xl  | 32px       | 2rem     |
| spacing-9xl  | 36px       | 2.25rem  |
| spacing-10xl | 40px       | 2.5rem   |
| spacing-11xl | 48px       | 3rem     |
| spacing-12xl | 56px       | 3.5rem   |
| spacing-13xl | 64px       | 4rem     |
| spacing-14xl | 80px       | 5rem     |
| spacing-15xl | 96px       | 6rem     |

## Relevant Files

Use these files to resolve the chore:

- `src/styles/index.css` - Main style aggregator file that imports all token files. Need to uncomment/add the spacing.css import.
- `src/styles/colors.css` - Reference file showing the established pattern for CSS token files (organization, comments, documentation).
- `.claude/rules/styling-guidelines.md` - Contains the Tailwind CSS 4 styling conventions and design token documentation patterns.

### New Files

- `src/styles/spacing.css` - New file to create containing all spacing CSS custom properties.

## Step by Step Tasks

### Step 1: Create the spacing.css file

- Create a new file at `src/styles/spacing.css`
- Follow the same documentation pattern as `colors.css`:
  - Add header comment with title, source reference (Figma Glow UI Pro 1.8), and description
  - Document the base unit (2px) and the naming convention
- Define all spacing CSS custom properties in `:root` selector using rem values:
  ```css
  :root {
    --spacing-none: 0rem;
    --spacing-xxs: 0.125rem; /* 2px */
    --spacing-xs: 0.25rem; /* 4px */
    --spacing-sm: 0.375rem; /* 6px */
    --spacing-md: 0.5rem; /* 8px */
    --spacing-lg: 0.625rem; /* 10px */
    --spacing-xl: 0.75rem; /* 12px */
    --spacing-xxl: 0.875rem; /* 14px */
    --spacing-3xl: 1rem; /* 16px */
    --spacing-4xl: 1.125rem; /* 18px */
    --spacing-5xl: 1.25rem; /* 20px */
    --spacing-6xl: 1.5rem; /* 24px */
    --spacing-7xl: 1.75rem; /* 28px */
    --spacing-8xl: 2rem; /* 32px */
    --spacing-9xl: 2.25rem; /* 36px */
    --spacing-10xl: 2.5rem; /* 40px */
    --spacing-11xl: 3rem; /* 48px */
    --spacing-12xl: 3.5rem; /* 56px */
    --spacing-13xl: 4rem; /* 64px */
    --spacing-14xl: 5rem; /* 80px */
    --spacing-15xl: 6rem; /* 96px */
  }
  ```

### Step 2: Update the style aggregator to import spacing.css

- Edit `src/styles/index.css`
- Uncomment or add the import for spacing.css:
  ```css
  @import './spacing.css';
  ```
- Ensure the import is in the correct position (after colors.css, following the file's documented architecture)

### Step 3: Run Validation Commands

- Run TypeScript type-check to ensure no type errors
- Run the build to verify CSS is properly processed
- Run linting to ensure code style compliance

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

- `npm run typecheck` - Verify no TypeScript errors were introduced
- `npm run lint` - Ensure code follows linting rules
- `npm run build` - Ensure the project builds successfully with the new CSS

## Notes

- The spacing scale uses a base unit of 2px with incremental steps
- Values are provided in rem (assuming 1rem = 16px) for better accessibility and scalability
- The naming convention follows semantic sizing (xxs, xs, sm, md, lg, xl, xxl) then numeric (3xl-15xl)
- These tokens can be used directly via CSS `var(--spacing-*)` or integrated into Tailwind CSS 4 theme configuration if needed in the future
- The existing codebase uses Tailwind's default spacing scale (p-4, gap-2, etc.). These custom tokens provide additional flexibility for design system alignment but don't replace Tailwind's utilities
