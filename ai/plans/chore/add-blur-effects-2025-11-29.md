# Chore: Add Blur Effects to Styles

## Chore Description

Add blur effect design tokens from the Glow UI design system (Figma) to the Sazonia web application's styling system. The blur effects include 4 different blur variants that need to be implemented as CSS custom properties and exposed to Tailwind CSS 4 utilities for backdrop blur effects.

The blur effects from Figma include:

- **blur-sm**: `4px` - Small blur for subtle glassmorphism effects
- **blur-md**: `8px` - Medium blur, default for most backdrop blur use cases
- **blur-lg**: `12px` - Large blur for more pronounced glass effects
- **blur-xl**: `20px` - Extra large blur for heavy glassmorphism overlays

These tokens will be used primarily with `backdrop-filter: blur()` for creating glassmorphism and frosted glass UI effects, commonly combined with semi-transparent background overlays.

## Relevant Files

Use these files to resolve the chore:

- `src/styles/index.css` - Style aggregator that imports all token files. Needs to import the new blur tokens file.
- `src/app/globals.css` - Main CSS file that exposes tokens to Tailwind via `@theme inline`. Needs to add blur token mappings for Tailwind utilities.
- `.claude/rules/styling-guidelines.md` - Contains styling documentation. Needs to be updated with blur usage guidelines.

### New Files

- `src/styles/blur.css` - New file to create containing all blur effect CSS custom properties following the same pattern as `colors.css`, `spacing.css`, `border-radius.css`, and `shadows.css`.

## Step by Step Tasks

### Step 1: Create the Blur Tokens File

- Create new file `src/styles/blur.css`
- Add file header documentation explaining the blur system
- Define all 4 blur CSS custom properties in `:root`:
  - `--blur-none: 0;`
  - `--blur-sm: 4px;`
  - `--blur-md: 8px;`
  - `--blur-lg: 12px;`
  - `--blur-xl: 20px;`
- Follow the documentation style from `shadows.css` with usage examples
- Include comments explaining each blur level's intended use case

### Step 2: Import Blur Tokens in Index File

- Edit `src/styles/index.css`
- Add import statement `@import './blur.css';` after the shadows import
- Update the file header documentation to include blur effects in the architecture list

### Step 3: Expose Blur Tokens to Tailwind

- Edit `src/app/globals.css`
- Add blur token mappings inside the `@theme inline` block
- Use the Tailwind v4 syntax for blur utilities:
  - `--blur-none: var(--blur-none);`
  - `--blur-sm: var(--blur-sm);`
  - `--blur-md: var(--blur-md);`
  - `--blur-lg: var(--blur-lg);`
  - `--blur-xl: var(--blur-xl);`
- This will generate Tailwind utilities like `blur-sm`, `blur-md`, `backdrop-blur-sm`, `backdrop-blur-md`, etc.

### Step 4: Update Styling Guidelines Documentation

- Edit `.claude/rules/styling-guidelines.md`
- Add a new "## Blur Effects" section after the "## Shadows" section
- Include the following content:
  - Blur scale table with token names, CSS variables, and pixel values
  - Usage examples in TSX showing backdrop-blur usage
  - Usage guidelines for when to use each blur level
  - Glassmorphism pattern example combining blur with semi-transparent backgrounds
  - Accessibility considerations (ensure text remains readable over blurred backgrounds)
  - Browser support notes (webkit prefix for Safari)

### Step 5: Run Validation Commands

- Run build to ensure no compilation errors
- Run lint to ensure code quality
- Run type check to ensure TypeScript validity

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

- `npm run build` - Verify the application builds successfully with the new blur tokens
- `npm run lint` - Verify no linting errors in the CSS files
- `npm run type-check` - Verify TypeScript types are valid (if applicable)

## Notes

- The blur tokens are primarily intended for use with `backdrop-filter: blur()` for glassmorphism effects
- Common pattern is to combine blur with semi-transparent white overlay: `bg-white/18 backdrop-blur-md`
- Safari requires `-webkit-backdrop-filter` prefix, but Tailwind handles this automatically
- When using blur effects, ensure sufficient color contrast for accessibility (WCAG 2.1 AA compliance)
- Blur effects are GPU-accelerated, but heavy usage can impact performance on lower-end devices
- Consider using `motion-reduce:backdrop-blur-none` for users who prefer reduced motion
- The blur scale aligns with common glassmorphism patterns seen in modern UI design (macOS, iOS, Windows 11)
- These tokens can also be used with regular `filter: blur()` for element blurring, not just backdrop blur
