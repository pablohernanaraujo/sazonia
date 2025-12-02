# Chore: Add Shadow Effects to Styles

## Chore Description

Add shadow effect design tokens from the Glow UI design system (Figma) to the Sazonia web application's styling system. The shadow effects include 8 different shadow variants that need to be implemented as CSS custom properties and exposed to Tailwind CSS 4 utilities.

The shadow effects from Figma include:

- **shadow-xs**: `0px 1px 2px 0px rgba(0,0,0,0.05)` - Extra small, subtle shadow
- **shadow-sm**: `0px 1px 3px 0px rgba(0,0,0,0.1)` - Small shadow
- **shadow-md**: `0px 4px 6px -1px rgba(0,0,0,0.08)` - Medium shadow
- **shadow-lg**: `0px 10px 15px -3px rgba(0,0,0,0.08)` - Large shadow
- **shadow-xl**: `0px 20px 25px -5px rgba(0,0,0,0.08)` - Extra large shadow
- **shadow-2xl**: `0px 25px 50px -12px rgba(0,0,0,0.18)` - 2x large shadow
- **shadow-inner**: `inset 0px 2px 4px 0px rgba(0,0,0,0.06)` - Inner shadow
- **shadow-soft**: `0px 10px 15px -3px rgba(0,0,0,0.04)` - Soft, diffused shadow

## Relevant Files

Use these files to resolve the chore:

- `src/styles/index.css` - Style aggregator that imports all token files. Needs to import the new shadow tokens file.
- `src/app/globals.css` - Main CSS file that exposes tokens to Tailwind via `@theme inline`. Needs to add shadow token mappings for Tailwind utilities.
- `.claude/rules/styling-guidelines.md` - Contains styling documentation. Needs to be updated with shadow usage guidelines.

### New Files

- `src/styles/shadows.css` - New file to create containing all shadow effect CSS custom properties following the same pattern as `colors.css`, `spacing.css`, and `border-radius.css`.

## Step by Step Tasks

### Step 1: Create the Shadow Tokens File

- Create new file `src/styles/shadows.css`
- Add file header documentation explaining the shadow system
- Define all 8 shadow CSS custom properties in `:root`:
  - `--shadow-xs: 0px 1px 2px 0px rgba(0,0,0,0.05);`
  - `--shadow-sm: 0px 1px 3px 0px rgba(0,0,0,0.1);`
  - `--shadow-md: 0px 4px 6px -1px rgba(0,0,0,0.08);`
  - `--shadow-lg: 0px 10px 15px -3px rgba(0,0,0,0.08);`
  - `--shadow-xl: 0px 20px 25px -5px rgba(0,0,0,0.08);`
  - `--shadow-2xl: 0px 25px 50px -12px rgba(0,0,0,0.18);`
  - `--shadow-inner: inset 0px 2px 4px 0px rgba(0,0,0,0.06);`
  - `--shadow-soft: 0px 10px 15px -3px rgba(0,0,0,0.04);`
  - `--shadow-none: none;` (for completeness)
- Follow the documentation style from `border-radius.css` with usage examples

### Step 2: Import Shadow Tokens in Index File

- Edit `src/styles/index.css`
- Add import statement `@import './shadows.css';` after the border-radius import
- Update the file header documentation to include shadows in the architecture list

### Step 3: Expose Shadow Tokens to Tailwind

- Edit `src/app/globals.css`
- Add shadow token mappings inside the `@theme inline` block
- Use the Tailwind v4 syntax for box-shadow utilities:
  - `--shadow-xs: var(--shadow-xs);`
  - `--shadow-sm: var(--shadow-sm);`
  - `--shadow-md: var(--shadow-md);`
  - `--shadow-lg: var(--shadow-lg);`
  - `--shadow-xl: var(--shadow-xl);`
  - `--shadow-2xl: var(--shadow-2xl);`
  - `--shadow-inner: var(--shadow-inner);`
  - `--shadow-soft: var(--shadow-soft);`
  - `--shadow-none: var(--shadow-none);`
- This will generate Tailwind utilities like `shadow-xs`, `shadow-sm`, etc.

### Step 4: Update Styling Guidelines Documentation

- Edit `.claude/rules/styling-guidelines.md`
- Replace the existing "Shadows" section (currently references Tailwind defaults) with the new Glow UI shadow tokens
- Add a comprehensive section similar to "Border Radius" that includes:
  - Shadow scale table with token names, CSS variables, and values
  - Usage examples in TSX
  - Usage guidelines for when to use each shadow level
  - Transition/animation considerations for shadows

### Step 5: Run Validation Commands

- Run build to ensure no compilation errors
- Run lint to ensure code quality
- Run type check to ensure TypeScript validity

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

- `npm run build` - Verify the application builds successfully with the new shadow tokens
- `npm run lint` - Verify no linting errors in the CSS files
- `npm run type-check` - Verify TypeScript types are valid (if applicable)

## Notes

- The shadow tokens follow the same naming convention as Tailwind's default shadows but with custom Glow UI values
- The `shadow-soft` variant is a custom addition not in Tailwind defaults - provides a more diffused, subtle shadow for delicate UI elements
- The `shadow-inner` uses the `inset` keyword and should be applied with care as it creates a pressed/embedded effect
- All shadows use RGBA values for the black color to ensure consistency and allow for proper transparency
- Consider that shadows may need to be adjusted for dark mode in the future (currently the project uses light mode exclusively)
- The shadow tokens integrate with Tailwind's responsive and state variants (e.g., `hover:shadow-lg`, `sm:shadow-md`)
