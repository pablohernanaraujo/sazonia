# Ui: Floating Action Button (FAB)

## Component Description

The Floating Action Button (FAB) is a circular button component designed for primary or secondary floating actions in the UI. It provides a prominent, easily accessible call-to-action that typically appears in a fixed position on the screen. FABs are commonly used for the most important action on a screen, such as creating new content, composing messages, or triggering key workflows.

The component supports two visual variants (filled and outline), two sizes (MD and SM), two color schemes (brand/primary and gray), and multiple interactive states (default, hover, focused, pressed, disabled, and loading).

## User Story

As a user of the application
I want to see a floating action button for primary actions
So that I can quickly access the most important functionality on any screen

## Problem Statement

The design system needs a dedicated FAB component that differs from the standard Button in its circular shape, elevation (shadow), and intended use as a floating overlay element. Currently, there's no component optimized for this specific interaction pattern.

## Solution Statement

Create a `Fab` (Floating Action Button) component that:

- Follows the Glow UI Figma design specifications exactly
- Provides circular button styling with appropriate shadows for elevation
- Supports filled (primary brand color) and outline (gray) variants
- Offers MD (56px) and SM (48px) size variants
- Handles all interactive states: default, hover, focus, pressed, disabled, loading
- Integrates seamlessly with Phosphor Icons
- Composes from existing Icon component for consistent icon rendering
- Maintains full accessibility compliance

## Atomic Design Classification

**Component Type**: Atom

**Reasoning**: The FAB is an atom-level component - a primitive interactive element with a singular purpose (action trigger). Like the Button component, FAB uses the Icon component internally as an implementation detail, not as compositional architecture. The component serves as a foundational building block that cannot be broken down further while maintaining its function.

Both Button and FAB follow identical composition patterns (button container + Icon component), and Button is classified as an Atom. FAB should maintain this architectural consistency.

**Composition Dependencies**:

- **Icon Component**: Used internally for icon rendering and loading spinner (implementation detail, not compositional relationship)
- **Status**: ✅ Base atom with internal Icon usage for rendering

## Component Location

**Location**: `src/ui/buttons/fab.tsx`

**Category**: `buttons`

**Reasoning**: The FAB is fundamentally a button component with specialized styling for floating actions. It belongs in the `buttons` category alongside `Button`, `ButtonGroup`, and `ButtonGroupItem`. This maintains organizational consistency and allows users to import all button-related components from the same location.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/buttons/fab.tsx
export { Fab, fabVariants };
export type { FabProps };

// 2. Update category barrel: src/ui/buttons/index.ts
export * from './fab';

// 3. Root barrel already exports buttons (no changes needed): src/ui/index.ts
// export * from './buttons'; (already exists)

// 4. Import usage (recommended):
import { Fab } from '@/ui';

// 5. Import usage (alternative):
import { Fab } from '@/ui/buttons';
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/buttons/button.tsx`** - Primary reference for CVA patterns, variant structure, icon handling, loading states, and TypeScript types. The FAB follows similar patterns but with circular styling.

- **`src/ui/icons/icon.tsx`** - Icon component used for rendering the icon content. FAB will use this component for consistent icon sizing and styling.

- **`src/stories/buttons/button.stories.tsx`** - Reference for Storybook story structure, argTypes configuration, and story organization patterns.

- **`src/ui/buttons/__tests__/button.test.tsx`** - Reference for comprehensive test patterns including variant tests, state tests, icon tests, keyboard interaction, and accessibility tests.

- **`src/app/globals.css`** - Design tokens and color mappings. Note the `--color-fill-primary`, `--color-border`, shadow tokens, and `--radius-full` for circular shapes.

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/buttons/fab.tsx` (REQUIRED)
2. **Test file**: `src/ui/buttons/__tests__/fab.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/buttons/fab.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
4. **Category barrel update**: `src/ui/buttons/index.ts` (add export)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Yes - FAB displays normally
- **Tablet (md: 768px - 1023px)**: Yes - FAB displays normally
- **Mobile (< 768px)**: Yes - FAB displays normally (commonly used on mobile)

Note: FAB sizing is fixed (MD: 56px, SM: 48px) and does not change based on viewport. Responsive behavior is typically handled by the container that positions the FAB (e.g., fixed bottom-right positioning).

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1902-179058&m=dev

**Design Specifications from Figma**:

#### Variant Options

1. **Filled** (default)
   - Brand color solid background
   - White icon color
   - Subtle drop shadow (`shadow-lg`)

2. **Outline**
   - White/transparent background
   - Gray border
   - Gray icon color
   - No shadow by default

#### Size Variants

1. **MD (Medium)** - 56px total
   - Padding: 16px (`--spacing-3xl`)
   - Icon: 24px
   - Total: 16 + 24 + 16 = 56px

2. **SM (Small)** - 48px total
   - Padding: 12px (`--spacing-xl`)
   - Icon: 24px
   - Total: 12 + 24 + 12 = 48px

#### Color Variants

1. **Brand** (primary blue)
   - Filled: `bg-fill-primary` (#3c61dd)
   - Hover: `bg-fill-primary-hover` (#385bcc)
   - Active/Pressed: `bg-fill-primary-active` (#3451b2)
   - Disabled: `bg-fill-primary-disabled` (#8fa6ef)
   - Focus ring: brand/300 (#d9e2fc)

2. **Gray** (outline only)
   - Background: white
   - Border: `border-border` (#d7dbdf)
   - Hover border: `border-border-hover` (#c1c8cd)
   - Active border: `border-border-active` (#889096)
   - Disabled border: `border-border-disabled` (#e0e3e6)
   - Icon: `text-text-subtle` (#889096)

#### States

| State    | Filled Brand                        | Outline Gray                                     |
| -------- | ----------------------------------- | ------------------------------------------------ |
| Default  | `bg-fill-primary`, shadow-lg        | `bg-background`, `border-border`                 |
| Hover    | `bg-fill-primary-hover`             | `bg-background-secondary`, `border-border-hover` |
| Focus    | Focus ring (3px brand/300)          | Focus ring                                       |
| Pressed  | `bg-fill-primary-active`, no shadow | `bg-background-tertiary`, `border-border-active` |
| Disabled | `bg-fill-primary-disabled`          | `border-border-disabled`, muted icon             |
| Loading  | Default bg, spinner                 | Default bg/border, spinner                       |

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/buttons/fab.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic FAB with default props (filled, MD, brand, default state)
2. **AllVariants Story**: Comparison of filled vs outline variants
3. **AllSizes Story**: MD and SM sizes side by side
4. **AllColors Story**: Brand (filled) and Gray (outline) colors
5. **AllStates Story**: Default, hover, focus, pressed, disabled, loading states
6. **DisabledState Story**: Disabled variants for both variant types
7. **LoadingState Story**: Loading state with spinner for both variant types
8. **WithCustomIcon Story**: FAB with different Phosphor icons
9. **PositioningExample Story**: Real-world example showing FAB in fixed position
10. **CompleteMatrix Story**: All combinations of variant × size × color

**Story Requirements**:

- Use `satisfies Meta<typeof Fab>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout` to `"centered"` for most stories
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. Study existing Button component patterns (`src/ui/buttons/button.tsx`)
2. Analyze Figma design specifications for exact values
3. Map Figma design tokens to existing Tailwind classes
4. Plan CVA variants structure for variant, size, color, and state

### Phase 2: Core Implementation

1. Create `src/ui/buttons/fab.tsx` with:
   - CVA variants for `variant` (filled, outline) - **IMPORTANT**: Use `variant` prop name for consistency with Button component
   - CVA variants for `size` (md, sm)
   - CVA variants for `color` (brand, gray)
   - Compound variants for variant+color combinations
   - State handling (hover, focus, active, disabled, loading)
   - Icon rendering using Icon component
   - Loading spinner integration
   - Proper TypeScript types and JSDoc documentation

2. Implement accessibility features:
   - Required `aria-label` for icon-only buttons
   - `aria-busy` during loading state
   - `aria-disabled` when disabled
   - Focus management and keyboard support

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add `export * from './fab';` to `src/ui/buttons/index.ts`
- Verify FAB is accessible via `import { Fab } from '@/ui'`

**Storybook Documentation (REQUIRED):**

- Create `src/stories/buttons/fab.stories.tsx`
- All variant stories to demonstrate variant, size, color options
- State stories for interactive states
- Real-world positioning example
- Complete matrix showing all combinations
- Interactive controls for live manipulation

## Step by Step Tasks

### Step 1: Research and Setup

- Review Button component implementation for patterns
- Review Icon component for icon rendering approach
- Identify all CSS tokens needed from globals.css
- Create test file structure

### Step 2: Implement FAB Component

- Create `src/ui/buttons/fab.tsx`
- Define `fabVariants` using CVA with:
  - Base classes: `inline-flex items-center justify-center rounded-full aspect-square cursor-pointer transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-52 active:shadow-none`
  - `variant` variants: filled, outline (use `variant` prop name for consistency with Button)
  - `size` variants: md (`size-14 p-4` = 56px), sm (`size-12 p-3` = 48px)
  - `color` variants: brand, gray
  - Compound variants for variant+color combinations
  - **Focus ring color compound variants**: brand → `focus-visible:ring-primary`, gray → `focus-visible:ring-border`
- Implement FabProps interface with:
  - `icon` (required): ComponentType<PhosphorIconProps>
  - `variant`: 'filled' | 'outline' (default: 'filled')
  - `size`: 'md' | 'sm' (default: 'md')
  - `color`: 'brand' | 'gray' (default: 'brand')
  - `loading`: boolean (default: false)
  - `disabled`: boolean
  - `aria-label`: string (required - enforced at type level)
  - `children`: never (explicitly prevent children)
  - Standard button props (onClick, onKeyDown, etc.)
- Implement loading state with CircleNotch spinner
- Add development warning for missing aria-label
- Export component and variants

**Icon Rendering Implementation**:

- Use Icon component with `size="lg"` (24px) for all FAB sizes
- Pass `color={null}` to allow currentColor inheritance from button text color
- Loading spinner uses same size as content icon
- Both icon and spinner are `aria-hidden` (FAB's aria-label provides context)

```typescript
{loading ? (
  <Icon
    icon={CircleNotch}
    size="lg"
    color={null}
    className="animate-spin"
    aria-hidden
  />
) : (
  <Icon
    icon={icon}
    size="lg"
    color={null}
    aria-hidden
  />
)}
```

### Step 2.5: Type Safety

Implement type-safe props following Button's pattern:

```typescript
type BaseFabProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'aria-label'
> &
  VariantProps<typeof fabVariants> & {
    icon: ComponentType<PhosphorIconProps>;
    loading?: boolean;
    className?: string;
  };

export type FabProps = BaseFabProps & {
  'aria-label': string; // Required at type level
  children?: never; // Explicitly prevent children
};

export const Fab = forwardRef<HTMLButtonElement, FabProps>(
  (
    {
      icon,
      variant,
      size,
      color,
      loading,
      disabled,
      className,
      'aria-label': ariaLabel,
      onClick,
      ...props
    },
    ref
  ) => {
    // Implementation
  }
);

Fab.displayName = 'Fab';
```

### Step 3: Update Barrel Exports

- Add `export * from './fab';` to `src/ui/buttons/index.ts`
- Verify import works from `@/ui` and `@/ui/buttons`

### Step 4: Create Unit Tests

- Create `src/ui/buttons/__tests__/fab.test.tsx`
- Implement rendering tests for default props
- Test all variant classes (filled, outline)
- Test all size classes (md, sm)
- Test all color classes (brand, gray)
- Test icon size consistency (24px/lg for all FAB sizes)
- Test focus ring color matches color variant
- Test compound variants (filled+brand, outline+gray)
- Test state handling (disabled, loading)
- Test icon rendering
- Test loading spinner visibility
- Test accessibility (aria-label required, aria-busy, aria-disabled)
- Test keyboard interaction (Enter, Space)
- Test focus management
- Test click handlers with various states

### Step 5: Create Storybook Stories (REQUIRED)

- Create `src/stories/buttons/fab.stories.tsx`
- Configure meta with component, title, tags, argTypes
- Implement Default story
- Implement AllVariants story (filled vs outline)
- Implement AllSizes story (md vs sm)
- Implement AllColors story (brand vs gray)
- Implement DisabledState story
- Implement LoadingState story
- Implement AllStates story (complete state showcase)
- Implement WithCustomIcon story (various icons)
- Implement PositioningExample story (real-world fixed position)
- Implement CompleteMatrix story (all combinations)

### Step 6: Run Validation Commands

- Execute `npm run type-check` - expect zero errors
- Execute `npm run lint` - expect zero errors/warnings
- Execute `npm test -- fab` - expect all tests pass
- Execute `npm run test:run` - expect all tests pass
- Execute `npm run build` - expect build success
- Execute `npm run build-storybook` - expect storybook builds

## Testing Strategy

### Unit Tests

1. **Rendering Tests**
   - Renders with default props
   - Renders icon correctly
   - Applies correct circular shape classes

2. **Variant Tests**
   - Variant options (filled, outline) apply correct classes
   - Size variants (md, sm) apply correct dimension classes
   - Color variants (brand, gray) apply correct color classes
   - Compound variants apply correct combined styles
   - Focus ring color matches color variant (brand → primary, gray → border)

3. **State Tests**
   - Disabled state applies correct attributes and classes
   - Loading state shows spinner and disables button
   - Click handlers fire correctly
   - Click handlers don't fire when disabled/loading

4. **Icon Tests**
   - Icon renders with correct size (24px/lg for all FAB sizes)
   - Spinner replaces icon during loading
   - Icon inherits correct color from parent (via currentColor with color={null})
   - Icon uses `aria-hidden` attribute

5. **Accessibility Tests**
   - Warns when aria-label is missing
   - aria-label provides accessible name
   - aria-busy set during loading
   - aria-disabled set when disabled
   - Focus ring visible on focus-visible

6. **Keyboard Tests**
   - Enter triggers click
   - Space triggers click
   - No action when disabled

### Edge Cases

- Very long aria-label text
- Custom className merging
- Ref forwarding works correctly
- All variant+color+size combinations render correctly
- Loading state transition (before/after)
- Focus styles match color variant

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/buttons/fab.tsx` with proper TypeScript types
- ✅ All variant options work correctly (filled, outline)
- ✅ All size variants work correctly (md: 56px, sm: 48px)
- ✅ All color variants work correctly (brand, gray)
- ✅ Component forwards refs correctly
- ✅ Loading state shows spinner and disables interaction
- ✅ Disabled state prevents interaction and applies visual styling
- ✅ Component follows design system patterns (CVA, semantic tokens)

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/buttons/fab.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **ALL variant stories implemented (variant, size, color)**
- ✅ **ALL state stories implemented (hover, focus, disabled, loading)**
- ✅ **Real-world examples (positioning example)**
- ✅ **Comparison story showing all variants together**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/buttons/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { Fab } from '@/ui'`

### Code Quality

- ✅ Zero TypeScript errors: `npm run type-check`
- ✅ Zero ESLint warnings: `npm run lint`
- ✅ Build succeeds: `npm run build`

## Validation Commands

⚠️ **CRITICAL**: Execute EVERY command below. All must pass with zero errors.

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- fab`
   - Expected: All FAB tests pass with >90% coverage
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

### Design Decisions

1. **Naming**: Using `Fab` instead of `FloatingActionButton` for brevity, following common industry convention (Material Design, etc.)

2. **Variant Prop Naming**: Using `variant` prop (not `style`) for API consistency with the Button component. Both components are in the `src/ui/buttons/` category and should share API conventions. Different components can have different variant values - the prop name should be consistent across the button family.

3. **Color-Variant Relationship**: Following Figma design where:
   - `brand` color is primarily used with `filled` variant
   - `gray` color is primarily used with `outline` variant
   - CVA compound variants define valid combinations; future expansion is possible

4. **Shadow Handling**:
   - Filled variant has `shadow-lg` by default
   - Pressed state removes shadow via `active:shadow-none` for "pressed in" effect
   - Outline variant has no shadow

5. **Icon Size**: Fixed at 24px (`size="lg"` on Icon component) regardless of FAB size (matches Figma). Uses `color={null}` to allow currentColor inheritance.

6. **Circular Shape**: Uses `rounded-full aspect-square` in base classes to ensure perfect circle regardless of content.

7. **Type Safety**: `aria-label` is required at the type level (not just runtime warning) to enforce accessibility.

### CVA Variant Structure

```typescript
const fabVariants = cva(
  [
    // Base classes
    'inline-flex items-center justify-center',
    'aspect-square rounded-full', // Circular shape
    'cursor-pointer transition-all duration-150',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-52',
    'active:shadow-none', // Pressed state removes shadow
  ],
  {
    variants: {
      variant: {
        // NOT "style" - consistency with Button
        filled: 'shadow-lg',
        outline: 'border bg-transparent',
      },
      size: {
        md: 'size-14 p-4', // 56px total (16px padding + 24px icon)
        sm: 'size-12 p-3', // 48px total (12px padding + 24px icon)
      },
      color: {
        brand: '',
        gray: '',
      },
    },
    compoundVariants: [
      // Filled + Brand
      {
        variant: 'filled',
        color: 'brand',
        className:
          'bg-fill-primary text-white hover:bg-fill-primary-hover active:bg-fill-primary-active',
      },
      // Outline + Gray
      {
        variant: 'outline',
        color: 'gray',
        className:
          'border-border text-text-subtle hover:border-border-hover hover:bg-background-secondary active:border-border-active active:bg-background-tertiary',
      },
      // Focus ring colors
      {
        color: 'brand',
        className: 'focus-visible:ring-primary',
      },
      {
        color: 'gray',
        className: 'focus-visible:ring-border',
      },
    ],
    defaultVariants: {
      variant: 'filled',
      size: 'md',
      color: 'brand',
    },
  }
);
```

### Future Considerations

- **Extended FAB**: Could add variant with label text beside icon
- **Speed Dial**: Could compose multiple FABs for expandable action menu
- **Position utilities**: Could add optional positioning wrapper component
- **Animation**: Could add enter/exit animations for visibility changes
- **Additional Color-Variant Combinations**: Design may add `outline + brand` or `filled + gray` in the future; compound variants structure supports this
