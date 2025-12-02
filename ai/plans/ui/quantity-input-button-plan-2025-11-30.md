# Ui: QuantityInputButton

## Component Description

The QuantityInputButton is a standalone button component designed specifically for quantity increment/decrement controls. It provides visual feedback for plus (+) and minus (-) operations in quantity selectors, shopping carts, and similar number input scenarios. This is an **atomic primitive** that can be composed with other components (like a text input) to create full quantity input controls.

Key characteristics from the Figma design:

- Two types: **Minus** (left-positioned) and **Plus** (right-positioned)
- Three sizes: **SM** (32px height), **MD** (40px height), **LG** (48px height)
- Five states: **Default**, **Hovered**, **Active**, **Focused**, **Disabled**
- Position-aware border radius (left rounded for Minus, right rounded for Plus)
- Uses Plus and Minus icons from Phosphor Icons

## User Story

As a user interacting with quantity controls
I want clearly visible increment and decrement buttons
So that I can easily adjust quantities with visual feedback on my actions

## Problem Statement

The current design system lacks a specialized button component for quantity input controls. While `NumberInput` has internal stepper buttons, there's a need for a standalone quantity button that can be used in different contexts like:

- Inline quantity selectors with a centered input field
- Shopping cart quantity adjusters
- Custom composed number inputs

## Solution Statement

Create a `QuantityInputButton` component as an atom that:

1. Provides plus and minus button variants with appropriate icons
2. Supports three sizes (sm, md, lg) matching the design system
3. Handles all interactive states (default, hover, active, focus, disabled)
4. Applies position-aware border radius (left for minus, right for plus)
5. Uses semantic design tokens from the existing Sazonia design system
6. Integrates seamlessly with the Icon component from `@/ui/icons`

## Atomic Design Classification

**Component Type**: Atom

**Reasoning**: QuantityInputButton is a fundamental, indivisible UI element that cannot be broken down further. It represents a single interactive control (a button) with a specific purpose (increment/decrement). It will be used as a building block for higher-level molecules like a full "QuantityInput" component that combines two QuantityInputButtons with an input field.

**Composition Requirements**:

- **Required Atoms**:
  - `Icon` from `@/ui/icons` - For rendering Plus and Minus icons

- **Status**: This is a base atom that composes only with the Icon atom.

## Component Location

**Location**: `src/ui/inputs/quantity-input-button.tsx`

**Category**: `inputs` - This component is part of the inputs category as it's specifically designed for quantity input interactions. It logically belongs with other input-related components like `NumberInput`, `TextInput`, etc.

**Reasoning**: While it could be considered a button, its specific purpose for quantity manipulation and its expected composition with input fields makes the `inputs` category more appropriate. This aligns with keeping related components together for discoverability.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/quantity-input-button.tsx
export { QuantityInputButton, quantityInputButtonVariants };
export type { QuantityInputButtonProps };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './quantity-input-button';

// 3. Import usage (recommended):
import { QuantityInputButton } from '@/ui';

// 4. Import usage (alternative):
import { QuantityInputButton } from '@/ui/inputs';
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/buttons/button.tsx`** - Reference for:
  - CVA pattern implementation with variants
  - forwardRef pattern with proper TypeScript typing
  - Icon integration with the Icon component
  - State handling (disabled, hover, active, focus)

- **`src/ui/buttons/button-group-item.tsx`** - Reference for:
  - Position-aware border radius pattern (`first`, `last`, `middle`, `only`)
  - Similar size variants (sm, md, lg)
  - Icon rendering helper function pattern

- **`src/ui/icons/icon.tsx`** - Reference for:
  - How to use the Icon component
  - Icon size mapping (sm, md, lg maps to 16px, 20px, 24px)
  - Passing `color={null}` to inherit parent color

- **`src/ui/inputs/number-input.tsx`** - Reference for:
  - Stepper button implementation pattern
  - State handling for increment/decrement
  - Integration with the inputs category

- **`src/stories/buttons/button.stories.tsx`** - Reference for:
  - Storybook story structure with `satisfies Meta<typeof Component>`
  - Comprehensive argTypes configuration
  - Story organization pattern (Default, AllVariants, States, Examples)

- **`src/stories/inputs/number-input.stories.tsx`** - Reference for:
  - Input component story patterns
  - State demonstration stories

- **`src/ui/buttons/__tests__/button.test.tsx`** - Reference for:
  - Testing patterns for button components
  - Accessibility testing
  - State testing

- **`src/app/globals.css`** - Reference for:
  - Design tokens (colors, border radius, etc.)
  - Semantic color mappings

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/quantity-input-button.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/quantity-input-button.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/quantity-input-button.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
4. **Update barrel**: `src/ui/inputs/index.ts` - Add export for new component

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required - Primary use case, all sizes available
- **Tablet (md: 768px - 1023px)**: No specific changes needed - Component works at all breakpoints
- **Mobile (< 768px)**: No specific changes needed - Touch-friendly by default with adequate hit targets

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1183-44236&m=dev
- Component set with all variant combinations visible

**Design Specifications from Figma**:

#### Colors (mapped to Sazonia design tokens):

- **Background Default**: `bg-background` (#ffffff)
- **Background Hover**: `bg-background-secondary` (#f9fafb)
- **Background Active**: `bg-background-tertiary` (#f0f2f4)
- **Border Default**: `border-border` (#d7dbdf)
- **Border Active/Hover**: `border-border-hover` (#c1c8cd)
- **Border Disabled**: `border-border-disabled` (#e0e3e6)
- **Icon Default**: `text-text-tertiary` (#889096)
- **Icon Hover**: `text-text-subtle` (#697177)
- **Icon Active/Focused**: `text-text-subtle` (#697177)
- **Icon Disabled**: `text-text-secondary` (#c1c8cd)

#### Sizes:

- **SM**: height 32px, padding x: 10px, padding y: 8px, icon 16px
- **MD**: height 40px, padding x: 12px, padding y: 10px, icon 20px
- **LG**: height 48px, padding x: 16px, padding y: 14px, icon 20px

#### Border Radius:

- **Minus type (left)**: `rounded-l-sm` (6px on left corners)
- **Plus type (right)**: `rounded-r-sm` (6px on right corners)

#### Border Pattern:

- **Minus type**: `border-l border-t border-b` (no right border)
- **Plus type**: `border-r border-t border-b` (no left border)

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/quantity-input-button.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic plus button with default (LG) size
2. **AllTypes**: Grid showing Minus and Plus types side by side
3. **AllSizes**: Comparison of SM, MD, LG sizes for both types
4. **AllStates**: Visual demonstration of Default, Hovered, Active, Focused, Disabled states
5. **Disabled**: Both types in disabled state
6. **TypeComparison**: Side-by-side comparison of Minus and Plus in all sizes
7. **WithQuantityInput**: Real-world example showing buttons flanking an input (demonstrating intended use)
8. **InteractiveDemo**: Functional demo with working increment/decrement
9. **AccessibilityExample** (Recommended): Demonstrate proper aria-label usage with screen reader annotations

**Story Requirements**:

- Use `satisfies Meta<typeof QuantityInputButton>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: "centered"`
- Create interactive controls for type, size, and disabled props
- Include JSDoc-style comments explaining each story's purpose

**Example Structure**:

```typescript
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QuantityInputButton } from '@/ui/inputs';

const meta = {
  title: 'Inputs/QuantityInputButton',
  component: QuantityInputButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['minus', 'plus'],
      description: 'Button type - determines icon and border radius position',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant affecting height and padding',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button interaction',
    },
  },
} satisfies Meta<typeof QuantityInputButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { type: 'plus', size: 'lg' },
};
```

## Implementation Plan

### Phase 1: Foundation

1. Create the component file with CVA variants
2. Define TypeScript interfaces for props
3. Map Figma design tokens to Sazonia semantic tokens
4. Implement the base button structure with Icon integration

### Phase 2: Core Implementation

1. Implement all CVA variants:
   - `type`: minus, plus (controls icon and border radius position)
   - `size`: sm, md, lg (controls height, padding, icon size)
2. Implement state styles:
   - Default, Hover, Active, Focus, Disabled
3. Add proper accessibility attributes:
   - `aria-label` for screen readers
   - `type="button"` to prevent form submission
   - Focus visible ring for keyboard navigation
4. Implement forwardRef for ref forwarding

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

1. Export component, variants, and types from `quantity-input-button.tsx`
2. Update `src/ui/inputs/index.ts` to export the new component
3. Verify component is accessible via `@/ui/inputs` and `@/ui`

**Storybook Documentation (REQUIRED):**

- Create `src/stories/inputs/quantity-input-button.stories.tsx`
- Story file location: `src/stories/inputs/quantity-input-button.stories.tsx`
- All variant stories: Default, AllTypes, AllSizes, TypeComparison
- State stories: AllStates, Disabled
- Interactive controls for type, size, disabled
- Real-world usage example: WithQuantityInput showing composition pattern

## Step by Step Tasks

### Step 1: Create Component File Structure

- Create `src/ui/inputs/quantity-input-button.tsx`
- Import dependencies: React, forwardRef, CVA, cn utility, Icon component, Phosphor icons (Plus, Minus)
- Add **JSDoc documentation** with border pattern rationale:
  ````typescript
  /**
   * QuantityInputButton - A specialized button for quantity increment/decrement controls.
   *
   * **Important Design Decision:**
   * This button uses an asymmetric border pattern:
   * - `minus` type: Borders on left, top, bottom (no right border)
   * - `plus` type: Borders on right, top, bottom (no left border)
   *
   * This design allows seamless composition with a centered input field:
   * ```
   * [Minus Button][Text Input][Plus Button]
   *        ↑            ↑           ↑
   *   No right border   Full border   No left border
   * ```
   * When composed, borders align perfectly without doubling or gaps.
   *
   * @example
   * ```tsx
   * <div className="inline-flex">
   *   <QuantityInputButton type="minus" aria-label="Decrease quantity" />
   *   <input type="text" className="border-y border-l-0 border-r-0" />
   *   <QuantityInputButton type="plus" aria-label="Increase quantity" />
   * </div>
   * ```
   */
  ````
- Define TypeScript interfaces for props with **type as REQUIRED** (not optional):

  ```typescript
  type BaseQuantityInputButtonProps = Omit<
    ComponentPropsWithoutRef<'button'>,
    'aria-label'
  > &
    VariantProps<typeof quantityInputButtonVariants> & {
      /** Required: Button type determines icon (Plus/Minus) and border radius position */
      type: 'minus' | 'plus';
      /** Required for accessibility: Describes the button action for screen readers */
      'aria-label': string;
      className?: string;
    };

  export type QuantityInputButtonProps = BaseQuantityInputButtonProps;
  ```

### Step 2: Implement CVA Variants

- Define `quantityInputButtonVariants` with base styles including **explicit interactive state classes**:

  ```typescript
  const quantityInputButtonVariants = cva(
    [
      // Layout & cursor
      'inline-flex items-center justify-center',
      'cursor-pointer',

      // Default state colors
      'border border-border',
      'bg-background',
      'text-text-tertiary',

      // Transition
      'transition-colors duration-150',

      // Hover state
      'hover:bg-background-secondary',
      'hover:border-border-hover',
      'hover:text-text-subtle',

      // Active state
      'active:bg-background-tertiary',
      'active:text-text-subtle',

      // Focus state
      'focus-visible:ring-2 focus-visible:ring-primary',
      'focus-visible:ring-offset-2 focus-visible:outline-none',

      // Disabled state
      'disabled:border-border-disabled disabled:bg-background',
      'disabled:text-text-secondary disabled:opacity-52',
      'disabled:pointer-events-none',
    ],
    {
      variants: {
        type: {
          minus: 'rounded-l-sm border-t border-r-0 border-b border-l',
          plus: 'rounded-r-sm border-t border-r border-b border-l-0',
        },
        size: {
          sm: 'h-8 px-2.5 py-2 text-sm',
          md: 'h-10 px-3 py-2.5 text-base',
          lg: 'h-12 px-4 py-3.5 text-base', // py-3.5 = 14px per Figma spec
        },
      },
      defaultVariants: {
        size: 'lg',
        // NOTE: No default for 'type' - must be explicitly specified
      },
    }
  );
  ```

- Add `type` variant: `minus`, `plus` (**REQUIRED prop, no default**)
- Add `size` variant: `sm`, `md`, `lg`
- Map colors to Sazonia semantic tokens
- Include compound variants for type + position styling

### Step 3: Implement Component Logic

- Create forwardRef component `QuantityInputButton`
- Destructure props: type, size, disabled, className, onClick, etc.
- Integrate Icon component with proper size mapping
- Add proper button attributes (type="button", aria-label)
- Apply CVA classes via cn() utility

### Step 4: Add Accessibility Features

- Add `aria-label` prop (**REQUIRED** for meaningful button description)
- Implement **development-time warning** for missing aria-label:

  ```typescript
  function warnIfMissingAriaLabel(ariaLabel: string | undefined): void {
    if (process.env.NODE_ENV !== 'production' && !ariaLabel) {
      console.warn(
        'QuantityInputButton: Icon-only buttons require an aria-label for screen reader accessibility. ' +
          'Example: <QuantityInputButton type="plus" aria-label="Increase quantity" />'
      );
    }
  }

  // Use in component
  export const QuantityInputButton = forwardRef<
    HTMLButtonElement,
    QuantityInputButtonProps
  >(({ 'aria-label': ariaLabel, ...props }, ref) => {
    warnIfMissingAriaLabel(ariaLabel);
    // ... component logic
  });
  ```

- Implement focus-visible ring using Tailwind
- Ensure disabled state prevents interaction
- Add `aria-disabled` attribute when disabled

### Step 5: Create Unit Tests

- Create `src/ui/inputs/__tests__/quantity-input-button.test.tsx`
- Test rendering with different types (minus, plus)
- Test rendering with different sizes (sm, md, lg)
- Test disabled state
- Test click handlers
- Test accessibility attributes
- Test ref forwarding
- Test className merging

### Step 6: Create Storybook Stories

- Create `src/stories/inputs/quantity-input-button.stories.tsx`
- Define meta configuration with argTypes
- Create Default story
- Create AllTypes story showing minus and plus
- Create AllSizes story with SM, MD, LG comparison
- Create AllStates story demonstrating interactive states
- Create Disabled story
- Create TypeComparison story
- Create WithQuantityInput real-world example
- Create InteractiveDemo with state management

### Step 7: Update Barrel Export

- Add `export * from './quantity-input-button';` to `src/ui/inputs/index.ts`

### Step 8: Run Validation Commands

- Run `npm run type-check` - expect zero errors
- Run `npm run lint` - expect zero errors
- Run `npm test -- quantity-input-button` - expect all tests pass
- Run `npm run test:run` - expect all tests pass with zero regressions
- Run `npm run build` - expect successful build
- Run `npm run build-storybook` - expect successful Storybook build

## Testing Strategy

### Unit Tests

**Core Rendering Tests:**

- Renders plus type with Plus icon
- Renders minus type with Minus icon
- Applies correct border radius for plus type (right corners)
- Applies correct border radius for minus type (left corners)
- Renders at sm/md/lg sizes with correct dimensions

**State Tests:**

- Default state has correct background and border colors
- Disabled state prevents click events
- Disabled state applies disabled styling
- Focus state shows focus ring

**Accessibility Tests:**

- Has required aria-label attribute
- Has type="button" attribute
- Has aria-disabled when disabled
- Forwards ref correctly

**Interaction Tests:**

- Calls onClick handler when clicked
- Does not call onClick when disabled

**Styling Tests:**

- Merges custom className properly
- Applies hover styles (test via data-testid or computed styles)

### Edge Cases

- Rendering without onClick handler (should not error)
- Rendering with custom aria-label
- Rendering with additional HTML attributes (spread props)
- Rendering inside a button group context
- Rendering with zero padding (ensure icon is centered)

### Additional Tests (from Evaluation Recommendations)

- **Ref Forwarding Test:** Verify ref correctly forwards to button element
- **Icon Size Mapping Test:** Verify correct icon sizes for each button size (sm→16px, md→20px, lg→20px)
- **Type Safety Test:** Verify TypeScript prevents invalid type values
- **Composition Test:** Test rendering within a quantity input group layout
- **Dev Warning Test:** Verify console.warn is called when aria-label is missing (dev mode only)

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/inputs/` with proper TypeScript types
- ✅ Both `minus` and `plus` types render correctly with appropriate icons
- ✅ All three sizes (sm, md, lg) render with correct dimensions
- ✅ Component forwards refs correctly using forwardRef
- ✅ Component follows design system patterns (CVA, semantic tokens)
- ✅ Click handler fires correctly when not disabled
- ✅ Disabled state prevents all interactions

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/quantity-input-button.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **AllTypes story showing minus and plus variants**
- ✅ **AllSizes story showing sm, md, lg variants**
- ✅ **AllStates story demonstrating Default, Hover, Active, Focused, Disabled**
- ✅ **Real-world example: WithQuantityInput composition pattern**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`) - if applicable
- ✅ Component can be imported via `import { QuantityInputButton } from '@/ui/inputs'`

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

3. **Run component tests**: `npm test -- quantity-input-button`
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

### Design Decisions

1. **Position in inputs category**: Despite being a button, the component's specific purpose for quantity manipulation places it logically with input components.

2. **Standalone vs Integrated**: This component is intentionally standalone (not integrated into NumberInput) to allow for flexible composition patterns like:
   - Custom quantity inputs with different layouts
   - Inline cart quantity adjusters
   - Stepper controls in modals/dialogs

3. **Icon Size Mapping**: The icon sizes are mapped to match the Figma design:
   - SM: 16px (Icon size "sm")
   - MD: 20px (Icon size "md")
   - LG: 20px (Icon size "md") - Note: LG uses same icon size as MD per design

4. **Border Pattern**: The component uses a unique border pattern where Minus has no right border and Plus has no left border, designed for seamless composition with an input field between them.

### Future Considerations

- This component could be composed with TextInput to create a full `QuantitySelector` molecule
- Consider adding a `standalone` variant that includes full border radius for independent use
- May need RTL support in the future (flip border radius positions)

### Dependencies

- `@phosphor-icons/react` - For Plus and Minus icons (already installed)
- `class-variance-authority` - For variant management (already installed)
- `@radix-ui/react-slot` - Not needed for this simple button component

---

## Evaluation Applied

**Evaluation Document:** `/ai/agents/evaluations/quantity-input-button-plan-2025-11-30.md`
**Evaluation Score:** 9.5/10 - Excellent
**Status:** Approved with Recommendations

### Applied Recommendations

The following recommendations from the architectural evaluation have been incorporated into this plan:

#### 1. ✅ Explicitly Define Interactive State Classes (Must Fix)

- Added complete CVA base styles array with explicit hover, active, focus, and disabled state classes
- Location: Step 2 - Implement CVA Variants

#### 2. ✅ Make `type` Prop Required (Should Fix)

- Removed default variant for `type` prop
- Updated TypeScript interface to make `type: 'minus' | 'plus'` required
- Location: Step 1 - TypeScript interfaces, Step 2 - CVA defaultVariants

#### 3. ✅ Correct LG Size Padding Y (Should Fix)

- Changed from `py-3` (12px) to `py-3.5` (14px) to match Figma specification
- Location: Step 2 - CVA size variants

#### 4. ✅ Add Development-Time Warning for Missing aria-label (Should Fix)

- Added `warnIfMissingAriaLabel()` function pattern
- Warns developers in non-production builds when aria-label is missing
- Location: Step 4 - Add Accessibility Features

#### 5. ✅ Document Border Pattern Rationale in JSDoc (Should Fix)

- Added comprehensive JSDoc documentation explaining the asymmetric border pattern
- Includes ASCII diagram showing composition with input field
- Includes usage example
- Location: Step 1 - Create Component File Structure

### Additional Testing Enhancements

Added recommended test scenarios from evaluation:

- Ref forwarding verification
- Icon size mapping per button size
- TypeScript type safety validation
- Composition context testing
- Development warning verification

### Additional Storybook Story

Added recommended story:

- **AccessibilityExample**: Demonstrates proper aria-label usage with screen reader annotations
