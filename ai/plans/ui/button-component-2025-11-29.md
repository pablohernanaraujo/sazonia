# UI: Button

## Component Description

The Button component is a foundational interactive element for triggering actions and events throughout the application. Based on the Glow UI design system, it provides a comprehensive set of variants covering different visual styles (filled, outline, tinted, plain), semantic colors (primary, secondary, danger), sizes (sm, md, lg), and states (default, hover, focus, active, disabled, loading). The component supports both text+icon combinations and icon-only buttons, making it versatile for various UI contexts from form submissions to navigation actions.

## User Story

As a developer
I want to use a consistent, accessible Button component with multiple variants
So that I can build cohesive user interfaces with proper interactive states and visual hierarchy

## Problem Statement

The application needs a foundational button component that:

- Provides consistent styling across the application
- Supports multiple visual variants for different use cases (primary actions, secondary actions, destructive operations)
- Handles all interactive states properly (hover, focus, active, disabled, loading)
- Maintains accessibility standards (WCAG 2.1 AA compliance)
- Supports polymorphic rendering for use with routing libraries
- Integrates seamlessly with the existing design token system

## Solution Statement

Create a comprehensive Button component using Class Variance Authority (CVA) that:

- Implements all variants from the Glow UI Figma design (filled, outline, tinted, plain styles)
- Uses semantic color tokens from the existing design system
- Provides three sizes (sm, md, lg) with appropriate typography and spacing
- Supports icon placement (left, right, or icon-only)
- Includes loading state with spinner animation (using `CircleNotch` from Phosphor Icons with `animate-spin`)
- Supports polymorphic rendering via `asChild` prop using Radix UI Slot
- Supports `href` prop for automatic Next.js Link integration (optimized client-side navigation)
- Forwards refs correctly for form integration
- Enforces accessibility via TypeScript conditional types for icon-only buttons

## Atomic Design Classification

**Component Type**: Atom

**Reasoning**: The Button is a fundamental UI building block that cannot be broken down further into smaller functional components. It is the smallest interactive element that performs a single action. Buttons are composed by higher-level components (molecules, organisms) but do not compose other atoms themselves.

**Composition Requirements**:

- **Required Atoms**:
  - `Icon` from `@/ui/icons` - For rendering icons within buttons
  - Typography tokens from design system - For consistent text styling
- **Required Molecules**: None (this is a base atom)
- **Required Organisms**: None (this is a base atom)

**Status**: Base atom - composes with Icon atom for icon buttons

## Component Location

**Location**: `src/ui/buttons/button.tsx`

**Category**: `buttons`

**Reasoning**: Buttons are interactive controls that warrant their own category. This follows the pattern of grouping related components (typography, icons) and allows for future button-related components (ButtonGroup, IconButton, ToggleButton) to be organized together.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/buttons/button.tsx
export { Button, buttonVariants };
export type { ButtonProps };

// 2. Create category barrel: src/ui/buttons/index.ts
export * from './button';

// 3. Update root barrel: src/ui/index.ts
export * from './buttons';

// 4. Import usage (recommended):
import { Button } from '@/ui';

// 5. Import usage (alternative):
import { Button } from '@/ui/buttons';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/typography/text.tsx`** - Reference for CVA pattern, polymorphic rendering with `asChild`, forwardRef pattern, and variant structure
- **`src/ui/icons/icon.tsx`** - Reference for icon integration and size mappings
- **`src/ui/typography/__tests__/text.test.tsx`** - Reference for comprehensive test patterns including variant testing, ref forwarding, and asChild behavior
- **`src/stories/typography/text.stories.tsx`** - Reference for Storybook story structure, argTypes configuration, and variant demonstrations
- **`src/app/globals.css`** - Contains semantic color tokens (`--color-primary`, `--color-fill-primary`, etc.) that should be used for button styling
- **`src/lib/utils.ts`** - Contains `cn()` utility for class merging

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/buttons/button.tsx` (REQUIRED)
2. **Test file**: `src/ui/buttons/__tests__/button.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/buttons/button.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
4. **Category barrel**: `src/ui/buttons/index.ts` (REQUIRED - new category)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: No - Button sizes are fixed, not responsive by default
- **Tablet (md: 768px - 1023px)**: No - Same as desktop
- **Mobile (< 768px)**: No - Same as desktop (developers can apply responsive classes via className)

### Design Assets

**Status**: Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1902-151171&m=dev
- Design specifications extracted from Figma:

**Button Variants Matrix**:

| Style   | Description                                               |
| ------- | --------------------------------------------------------- |
| Filled  | Solid background color (primary action)                   |
| Outline | Border only, transparent background (secondary action)    |
| Tinted  | Light tinted background with colored text (subtle action) |
| Plain   | No background/border, text only (tertiary action)         |

| Color                  | Use Case                             |
| ---------------------- | ------------------------------------ |
| Primary (Blue #3C61DD) | Main actions, CTAs                   |
| Secondary (Gray)       | Secondary/alternative actions        |
| Danger (Red #E54D2E)   | Destructive actions (delete, remove) |

| Size | Height | Padding X | Padding Y | Font Size | Icon Size | Icon Variant |
| ---- | ------ | --------- | --------- | --------- | --------- | ------------ |
| SM   | 32px   | 12px      | 8px       | 14px      | 16px      | `sm`         |
| MD   | 40px   | 14px      | 10px      | 16px      | 20px      | `md`         |
| LG   | 48px   | 14px      | 12px      | 16px      | 24px      | `lg`         |

**Note**: Icon sizes now correctly map to the Icon component's size variants (`sm`=16px, `md`=20px, `lg`=24px) for consistency.

**Interactive States**:

- Default: Base appearance
- Hover: Darker shade (700 level for filled)
- Focus: Focus ring (2px offset ring)
- Active: Darkest shade (900 level for filled)
- Disabled: 52% opacity, pointer-events-none
- Loading: Spinner replaces content, disabled interaction

**Border Radius**: 6px (`rounded-sm` token)

## Storybook Stories

**Required**: Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/buttons/button.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic button with default props (filled, primary, md)
2. **Variant Stories**:
   - AllStyles: Grid showing filled, outline, tinted, plain
   - AllColors: Grid showing primary, secondary, danger
   - AllSizes: Grid showing sm, md, lg
3. **State Stories**:
   - Hover state (interaction)
   - Focus state (keyboard navigation)
   - Disabled state
   - Loading state
4. **Icon Stories**:
   - WithLeftIcon
   - WithRightIcon
   - WithBothIcons
   - IconOnly
5. **Real-world Examples**:
   - FormActions: Submit/Cancel button pair
   - DialogActions: Confirm/Cancel with danger button
   - NavigationButton: Button with `href` prop (Next.js Link integration)
   - AsChildExample: Button with custom element via `asChild`
6. **Comparison Story**: Complete variant matrix showing all combinations

**Story Requirements**:

- Use `satisfies Meta<typeof Button>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: "centered"`
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. Create the `src/ui/buttons/` directory structure
2. Define the CVA variants based on Figma specifications
3. Map Figma design tokens to existing CSS variables in `globals.css`
4. Create TypeScript interfaces for props

### Phase 2: Core Implementation

1. Implement the Button component with all variants using CVA
2. Add polymorphic rendering support via Radix UI Slot (`asChild` prop)
3. Add `href` prop support with automatic Next.js Link wrapping for optimized navigation
4. Implement loading state with `CircleNotch` spinner from Phosphor Icons
5. Add icon slot support (left, right, icon-only) with correct size mapping
6. Ensure proper ref forwarding using `ComponentPropsWithoutRef<'button'>`
7. Apply accessibility attributes (disabled states, aria-busy for loading)
8. Implement TypeScript conditional types to enforce `aria-label` on icon-only buttons
9. Add compound variants for focus ring colors that match button colors

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

1. Create barrel file `src/ui/buttons/index.ts`
2. Update root barrel `src/ui/index.ts` to export buttons category
3. Verify imports work: `import { Button } from '@/ui'`

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/buttons/button.stories.tsx`
- All variant stories demonstrating filled, outline, tinted, plain styles
- All color stories for primary, secondary, danger
- All size stories for sm, md, lg
- State stories for disabled, loading, focus
- Icon combination stories
- Real-world usage examples (form buttons, dialog actions)
- Complete variant matrix comparison story

## Step by Step Tasks

### 1. Create Directory Structure

- Create `src/ui/buttons/` directory
- Create `src/ui/buttons/__tests__/` directory
- Create `src/stories/buttons/` directory

### 2. Implement Button Component

- Create `src/ui/buttons/button.tsx` with:
  - Import dependencies: `cva`, `Slot`, `cn`, `Icon`, `Link` from `next/link`, `CircleNotch` from `@phosphor-icons/react`
  - Define `buttonVariants` with CVA covering:
    - Base styles (inline-flex, items-center, justify-center, gap, font-medium, transition)
    - `variant`: filled, outline, tinted, plain
    - `color`: primary, secondary, danger
    - `size`: sm, md, lg
    - Compound variants for variant+color combinations
    - Compound variants for focus ring colors matching button colors:
      ```typescript
      compoundVariants: [
        { color: 'primary', className: 'focus-visible:ring-primary' },
        { color: 'danger', className: 'focus-visible:ring-destructive' },
        { color: 'secondary', className: 'focus-visible:ring-secondary' },
      ];
      ```
  - Define TypeScript types with conditional enforcement for icon-only accessibility:

    ```typescript
    import { type ComponentPropsWithoutRef, forwardRef } from 'react';

    // Icon size mapping for correct sizes
    const buttonIconSizeMap = {
      sm: 'sm', // 16px
      md: 'md', // 20px
      lg: 'lg', // 24px
    } as const;

    // Conditional types for icon-only accessibility enforcement
    type IconOnlyButtonProps = {
      leftIcon: ComponentType<PhosphorIconProps>;
      rightIcon?: never;
      children?: never;
      'aria-label': string; // Required for icon-only
    };

    type TextButtonProps = {
      leftIcon?: ComponentType<PhosphorIconProps>;
      rightIcon?: ComponentType<PhosphorIconProps>;
      children: React.ReactNode;
      'aria-label'?: string; // Optional when text is present
    };

    // Base props using ComponentPropsWithoutRef (not ButtonHTMLAttributes)
    type BaseButtonProps = ComponentPropsWithoutRef<'button'> &
      VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
        loading?: boolean;
        href?: string; // When provided, renders as Next.js Link
      };

    export type ButtonProps = BaseButtonProps &
      (IconOnlyButtonProps | TextButtonProps);
    ```

  - Implement `Button` component with:
    - forwardRef pattern
    - `href` prop support: when provided, wrap with Next.js `Link` for optimized navigation
    - asChild support via Slot (takes precedence over href)
    - Loading state with `CircleNotch` spinner and `animate-spin`
    - Icon slots (leftIcon, rightIcon) with correct size mapping
    - Proper disabled handling
    - Development warning for missing `aria-label` on icon-only buttons:
      ```typescript
      if (process.env.NODE_ENV === 'development') {
        if (!children && !ariaLabel) {
          console.warn(
            'Button: Icon-only buttons require an aria-label for accessibility'
          );
        }
      }
      ```
  - Export component, variants, and types

### 3. Create Barrel Export Files

- Create `src/ui/buttons/index.ts`:
  ```typescript
  export * from './button';
  ```
- Update `src/ui/index.ts` to add:
  ```typescript
  export * from './buttons';
  ```

### 4. Implement Unit Tests

- Create `src/ui/buttons/__tests__/button.test.tsx` with:
  - Default rendering tests
  - Variant class application tests (filled, outline, tinted, plain)
  - Color class application tests (primary, secondary, danger)
  - Size class application tests (sm, md, lg)
  - Disabled state tests
  - Loading state tests (spinner visible, disabled interaction, click handlers prevented)
  - Icon rendering tests (left, right, both, icon-only)
  - asChild behavior tests (renders as custom element)
  - **href prop tests** (renders as Next.js Link, navigation works)
  - Ref forwarding tests
  - Click handler tests
  - Accessibility attribute tests
  - **Keyboard interaction tests** (Enter key, Space key triggers click)
  - **Focus management tests** (receives focus on tab navigation)
  - **Form integration tests** (type="submit" behavior, form submission when disabled)

### 5. Create Storybook Stories (REQUIRED)

- Create `src/stories/buttons/button.stories.tsx` with:
  - Meta configuration with comprehensive argTypes
  - Default story with basic usage
  - AllStyles story showing filled/outline/tinted/plain
  - AllColors story showing primary/secondary/danger
  - AllSizes story showing sm/md/lg
  - DisabledState story
  - LoadingState story with spinner
  - WithLeftIcon story
  - WithRightIcon story
  - WithBothIcons story
  - IconOnly story with aria-label
  - FormActions example (Submit + Cancel)
  - DialogActions example (Confirm + Delete)
  - **WithHref story** showing Button with `href` prop (Next.js Link integration)
  - AsChild example using asChild with custom element
  - CompleteMatrix story showing all variant combinations

### 6. Run Validation Commands

- Execute type checking: `npm run type-check`
- Execute linting: `npm run lint`
- Execute component tests: `npm test -- button`
- Execute full test suite: `npm run test:run`
- Execute build: `npm run build`
- Execute Storybook build: `npm run build-storybook`

## Testing Strategy

### Unit Tests

1. **Rendering Tests**
   - Renders with default props
   - Renders children correctly
   - Applies correct default variant classes

2. **Variant Tests**
   - Each style variant (filled, outline, tinted, plain) applies correct classes
   - Each color variant (primary, secondary, danger) applies correct classes
   - Each size variant (sm, md, lg) applies correct classes

3. **State Tests**
   - Disabled button has correct attributes and classes
   - Loading button shows spinner and is disabled
   - Click handlers fire correctly
   - Click handlers don't fire when disabled
   - **Click handlers don't fire during loading state**

4. **Icon Tests**
   - Left icon renders correctly
   - Right icon renders correctly
   - Icon-only button renders correctly
   - Icon size matches button size (using correct `buttonIconSizeMap`)

5. **Polymorphic Tests**
   - asChild renders child element
   - asChild preserves button styling on child
   - Ref forwarding works correctly

6. **Navigation Tests (NEW)**
   - Button with `href` renders as Next.js Link
   - `href` prop enables client-side navigation
   - Button without `href` renders as native button
   - `asChild` takes precedence over `href`

7. **Keyboard Interaction Tests (NEW)**
   - Triggers click on Enter key press
   - Triggers click on Space key press
   - Does not trigger click when disabled

8. **Focus Management Tests (NEW)**
   - Receives focus on tab navigation
   - Shows focus ring on keyboard focus (focus-visible)
   - Focus ring color matches button color variant

9. **Form Integration Tests (NEW)**
   - Button with `type="submit"` submits parent form
   - Disabled button does not submit form
   - Button with `type="button"` does not submit form

### Edge Cases

- Empty children with icon-only mode
- Very long text content (overflow handling)
- Multiple rapid clicks
- Loading state transition
- Custom className merging
- Icon-only without aria-label warning (dev console warning)
- **Spinner visibility during loading**
- **Button remaining disabled during loading**

## Acceptance Criteria

### Functional Requirements

- Component implemented in `src/ui/buttons/` with proper TypeScript types
- All 4 style variants work correctly (filled, outline, tinted, plain)
- All 3 color variants work correctly (primary, secondary, danger)
- All 3 size variants work correctly (sm, md, lg)
- Component forwards refs correctly using `ComponentPropsWithoutRef<'button'>`
- Component supports polymorphic rendering with asChild
- **Component supports `href` prop for automatic Next.js Link integration**
- Loading state shows `CircleNotch` spinner with `animate-spin` and disables interaction
- Icon slots work (leftIcon, rightIcon, icon-only) with correct size mapping
- Component follows design system patterns (CVA, Slot, semantic tokens)
- **TypeScript enforces `aria-label` on icon-only buttons via conditional types**
- **Focus ring color matches button color variant via compound variants**

### Testing Requirements

- Comprehensive unit tests with >90% coverage
- All variant combinations tested
- All interactive states tested
- **Keyboard interaction tests (Enter, Space key presses)**
- **Form integration tests (submit behavior)**
- **Navigation tests (href prop with Next.js Link)**
- All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- **Storybook stories file created: `src/stories/buttons/button.stories.tsx`**
- **Meta configuration with comprehensive argTypes**
- **Default story implemented**
- **ALL style variant stories implemented (filled, outline, tinted, plain)**
- **ALL color variant stories implemented (primary, secondary, danger)**
- **ALL size variant stories implemented (sm, md, lg)**
- **State stories implemented (disabled, loading)**
- **Icon stories implemented (left, right, both, icon-only)**
- **Real-world examples (minimum 4: form actions, dialog actions, navigation with href, asChild)**
- **Complete matrix story showing all variant combinations**
- **Interactive controls configured for all props**
- **Storybook builds successfully: `npm run build-storybook`**
- **All stories render correctly in Storybook UI**

### Integration Requirements

- Exported through category barrel (`src/ui/buttons/index.ts`)
- Exported through root barrel (`src/ui/index.ts`)
- Component can be imported via `import { Button } from '@/ui'`

### Code Quality

- Zero TypeScript errors: `npm run type-check`
- Zero ESLint warnings: `npm run lint`
- Build succeeds: `npm run build`

## Validation Commands

Execute EVERY command below **in this order** (fast feedback first). All must pass with zero errors.

1. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

2. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

3. **Run component tests**: `npm test -- button`
   - Expected: All component tests pass with >90% coverage
   - Validates: Component functionality and edge cases

4. **Run full test suite**: `npm run test:run`
   - Expected: All tests pass with zero regressions
   - Validates: No breaking changes to existing components

5. **Build verification**: `npm run build`
   - Expected: Build completes successfully
   - Validates: Production bundle compatibility

6. **Storybook build** (REQUIRED): `npm run build-storybook`
   - Expected: Storybook builds successfully, all stories compile
   - Validates: Visual documentation is complete and error-free
   - Verify: Stories appear in build output with correct paths

**All 6 commands MUST pass before the component is considered complete.**

## Notes

### Design Token Mapping

From Figma analysis, map to existing CSS variables in `globals.css`:

| Button Element      | CSS Variable                                             |
| ------------------- | -------------------------------------------------------- |
| Primary Fill BG     | `--color-fill-primary` / `bg-fill-primary`               |
| Primary Fill Hover  | `--color-fill-primary-hover` / `bg-fill-primary-hover`   |
| Primary Fill Active | `--color-fill-primary-active` / `bg-fill-primary-active` |
| Primary Text        | `--color-text-overlay-white` / white                     |
| Danger Fill BG      | `--color-destructive`                                    |
| Border Radius       | `--radius-sm` (6px)                                      |
| Focus Ring          | `ring-2 ring-primary ring-offset-2`                      |

### Loading Spinner

Use `CircleNotch` from `@phosphor-icons/react` with `animate-spin` class:

```typescript
import { CircleNotch } from '@phosphor-icons/react';

// In Button component:
{loading && (
  <Icon
    icon={CircleNotch}
    size={buttonIconSizeMap[size ?? 'md']}
    className="animate-spin"
  />
)}
```

The spinner should:

- Match the icon size for the button size (using `buttonIconSizeMap`)
- Use `animate-spin` Tailwind utility for rotation animation
- Inherit color from button variant (currentColor)
- Replace content or appear alongside it based on variant

### Navigation with `href` Prop

When the `href` prop is provided, the Button automatically renders as a Next.js `Link` component for optimized client-side navigation:

```typescript
import Link from 'next/link';

// Implementation logic:
const ButtonContent = (/* ... */) => { /* render button content */ };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ href, asChild, ...props }, ref) => {
    // asChild takes precedence over href
    if (asChild) {
      return <Slot ref={ref} {...buttonProps}>{/* content */}</Slot>;
    }

    // href renders as Next.js Link
    if (href) {
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={cn(buttonVariants({ variant, color, size }), className)}
          {...anchorProps}
        >
          <ButtonContent />
        </Link>
      );
    }

    // Default: native button
    return <button ref={ref} {...buttonProps}><ButtonContent /></button>;
  }
);
```

**Benefits**:

- Automatic prefetching for better performance
- Client-side navigation without full page reload
- Maintains all button styling and variants
- Preserves accessibility attributes

**Usage Examples**:

```tsx
// As navigation button
<Button href="/dashboard">Go to Dashboard</Button>

// With icon
<Button href="/settings" leftIcon={Gear}>Settings</Button>

// External link (use asChild for external)
<Button asChild>
  <a href="https://external.com" target="_blank" rel="noopener">External</a>
</Button>
```

### Accessibility Considerations

- All buttons should have visible focus indicators (focus-visible ring with color matching variant)
- Loading buttons should have `aria-busy="true"`
- Icon-only buttons must have `aria-label` for screen readers (enforced via TypeScript types)
- Disabled buttons should have `aria-disabled="true"` in addition to `disabled` attribute
- Color contrast must meet WCAG 2.1 AA requirements (already handled by design tokens)
- Development warning for missing `aria-label` on icon-only buttons

### Future Considerations

- ButtonGroup component for grouped actions
- Split button for dropdown actions
- Toggle button variant
- Ghost variant (similar to plain but with hover background)

---

## Changelog (Evaluation Recommendations Applied)

**Date**: 2025-11-29

The following changes were applied based on the architectural evaluation (`ai/agents/evaluations/button-component-plan-2025-11-29.md`):

### High Priority (Applied)

1. **Icon-only Accessibility Enforcement** ✅
   - Added TypeScript conditional types (`IconOnlyButtonProps` | `TextButtonProps`) to enforce `aria-label` on icon-only buttons
   - Added development warning for missing `aria-label`

2. **TypeScript Props Pattern** ✅
   - Changed from `ButtonHTMLAttributes` to `ComponentPropsWithoutRef<'button'>` for consistency with Text and Icon components

3. **Icon Size Mapping Correction** ✅
   - Fixed LG button icon size from 20px (`md`) to 24px (`lg`) to match Icon component's size variants

### Medium Priority (Applied)

4. **Focus Ring Variants** ✅
   - Added compound variants for focus ring colors matching button colors (primary, danger, secondary)

5. **Loading Spinner Specification** ✅
   - Specified `CircleNotch` from Phosphor Icons with `animate-spin` class
   - Added `buttonIconSizeMap` for correct spinner sizing

6. **Keyboard Tests** ✅
   - Added keyboard interaction tests (Enter, Space key presses)
   - Added focus management tests

### Low Priority (Applied)

7. **Form Integration Tests** ✅
   - Added tests for button behavior in form context (`type="submit"`, disabled submission)

8. **Validation Command Order** ✅
   - Reordered validation commands for fast feedback first (lint → type-check → tests → build → storybook)

### Additional Enhancement (User Request)

9. **`href` Prop with Next.js Link** ✅
   - Added `href` prop support for automatic Next.js Link integration
   - Benefits: prefetching, client-side navigation, no full page reload
   - `asChild` takes precedence over `href` for custom element rendering
   - Added navigation tests and stories for `href` functionality
