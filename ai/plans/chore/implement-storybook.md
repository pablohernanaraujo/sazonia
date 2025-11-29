# Chore: Implement Storybook

## Chore Description

Implement Storybook for component development and documentation in the sazonia-web project. This will enable isolated component development, visual testing, and serve as a living documentation for the UI component library. Storybook will integrate with the existing Next.js 16, React 19, Tailwind CSS 4, and TypeScript setup.

## Relevant Files

Use these files to resolve the chore:

- `package.json` - Add Storybook dependencies and scripts
- `tsconfig.json` - May need updates for Storybook path resolution
- `src/app/globals.css` - Contains Tailwind CSS 4 configuration, needs to be imported in Storybook
- `src/app/layout.tsx` - Contains font configuration (Geist fonts) that stories may need
- `src/components/Button/Button.tsx` - Existing component to create first story for
- `src/components/firebase/FirebaseErrorBoundary.tsx` - Component that can have a story
- `.claude/rules/styling-guidelines.md` - Contains CVA patterns and styling conventions for stories
- `.claude/rules/accessibility-patterns.md` - Contains accessibility patterns to document in stories

### New Files

- `.storybook/main.ts` - Storybook main configuration file
- `.storybook/preview.tsx` - Storybook preview configuration with decorators
- `src/components/Button/Button.stories.tsx` - Example story file for Button component
- `src/components/firebase/FirebaseErrorBoundary.stories.tsx` - Example story for FirebaseErrorBoundary

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Install Storybook Dependencies

- Run `npx storybook@latest init --builder vite --skip-install` to initialize Storybook with Vite builder (better compatibility with existing Vitest setup)
- Add the following dev dependencies to package.json:
  - `@storybook/react-vite` - Storybook for React with Vite
  - `@storybook/addon-essentials` - Core addons (controls, actions, docs, viewport)
  - `@storybook/addon-interactions` - For interaction testing
  - `@storybook/addon-links` - For linking between stories
  - `@storybook/addon-a11y` - For accessibility testing (aligns with project accessibility patterns)
  - `@storybook/blocks` - For documentation blocks
  - `storybook` - Storybook CLI
- Run `npm install` to install dependencies

### Step 2: Configure Storybook Main Configuration

- Create `.storybook/main.ts` with the following configuration:
  - Set `framework` to `@storybook/react-vite`
  - Configure `stories` to match pattern `../src/**/*.stories.@(js|jsx|ts|tsx|mdx)`
  - Add addons: `@storybook/addon-essentials`, `@storybook/addon-a11y`, `@storybook/addon-interactions`, `@storybook/addon-links`
  - Configure `viteFinal` to extend Vite config with path aliases from tsconfig.json
  - Enable `docs` addon with `autodocs` set to `true`
  - Set `staticDirs` to include public folder if needed

### Step 3: Configure Storybook Preview

- Create `.storybook/preview.tsx` with:
  - Import `src/app/globals.css` for Tailwind CSS 4 styles
  - Configure default viewport settings
  - Add global decorators for:
    - Font wrapper (Geist fonts from layout.tsx)
    - Theme provider if needed
  - Set default parameters for docs, controls, and actions
  - Configure a11y addon parameters

### Step 4: Update package.json Scripts

- Add the following scripts:
  - `"storybook": "storybook dev -p 6006"` - Run Storybook dev server
  - `"build-storybook": "storybook build"` - Build static Storybook

### Step 5: Create Button Component Story

- Create `src/components/Button/Button.stories.tsx`:
  - Import Button component
  - Define metadata with title `Components/Button`
  - Create stories for:
    - `Default` - Basic button usage
    - `Disabled` - Button in disabled state
    - `WithOnClick` - Button with click handler demonstration
  - Add proper controls for all props (children, disabled, onClick)
  - Include accessibility documentation

### Step 6: Create FirebaseErrorBoundary Story

- Create `src/components/firebase/FirebaseErrorBoundary.stories.tsx`:
  - Import FirebaseErrorBoundary component
  - Define metadata with title `Components/Firebase/ErrorBoundary`
  - Create stories for:
    - `Default` - Normal rendering without errors
    - `WithError` - Simulated error state showing fallback UI
    - `WithCustomFallback` - Using custom fallback prop
  - Document the error handling behavior

### Step 7: Update TypeScript Configuration

- Update `tsconfig.json` if needed:
  - Ensure stories files are included in compilation
  - Verify path aliases work for Storybook

### Step 8: Run Validation Commands

- Execute all validation commands to ensure zero regressions

## Validation Commands

Execute every command to validate the chore is complete with zero regressions.

- Run `npm run type-check` to verify TypeScript compilation passes
- Run `npm run lint` to verify ESLint passes
- Run `npm run test:run` to verify existing tests still pass
- Run `npm run storybook -- --smoke-test` to verify Storybook builds correctly
- Run `npm run build-storybook` to verify static build works
- Run `npm run build` to verify Next.js build still passes

## Notes

- Storybook 8.x is the latest stable version and has excellent React 19 and Vite support
- Using Vite builder instead of Webpack for better performance and consistency with the existing Vitest setup
- The `@storybook/addon-a11y` addon aligns with the project's accessibility patterns documented in `.claude/rules/accessibility-patterns.md`
- Stories should follow the CVA (Class Variance Authority) patterns when documenting component variants as specified in `.claude/rules/styling-guidelines.md`
- Consider adding the `sazonia-storybook` skill for future story creation following project conventions
- The Button component is currently very basic; stories will help document expected behavior as it evolves
