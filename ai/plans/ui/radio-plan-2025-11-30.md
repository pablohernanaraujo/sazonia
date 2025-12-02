# UI: Radio

## Component Description

The Radio component is a selection control that allows users to select one option from a set of mutually exclusive choices. Unlike checkboxes, radios are designed for single-selection scenarios where only one option can be active at a time within a group. The component provides visual feedback for various states including checked/unchecked, hover, focus, pressed, disabled, and error states, with three size variants (sm, md, lg) to accommodate different UI contexts.

**Architectural Decision**: This component uses `@radix-ui/react-radio-group` to maintain consistency with the Checkbox component architecture (which uses `@radix-ui/react-checkbox`). This ensures:

- Consistent data attribute patterns (`data-[state=checked]`) across form controls
- Unified ARIA implementation patterns
- Automatic state management via Radix primitives
- Consistent API patterns for controlled/uncontrolled usage

## User Story

As a **user**
I want to **select a single option from a group of choices**
So that **I can make clear, unambiguous selections in forms and settings**

## Problem Statement

The application needs a consistent, accessible, and visually appealing way for users to make single selections from mutually exclusive options. Without a standardized Radio component, developers may create inconsistent implementations that vary in accessibility, styling, and behavior across the application.

## Solution Statement

Create a comprehensive Radio component following the Glow UI design system specifications. The component will:

- Support three sizes (sm: 16px, md: 20px, lg: 24px)
- Handle all interactive states (default, hovered, focused, pressed, disabled, error)
- Use semantic color tokens for brand consistency
- Provide full accessibility through proper ARIA attributes
- Support both controlled and uncontrolled usage patterns
- Include a RadioGroup compound component for managing groups of radios
- Use Radix UI Radio Group primitive for consistency with Checkbox architecture

## Atomic Design Classification

**Component Type**: Atom

**Reasoning**: The Radio is a fundamental, indivisible UI element that cannot be broken down into smaller meaningful components. It represents a single interactive selection control that serves as a building block for more complex form patterns (molecules like RadioGroup with labels, organisms like settings panels).

**Composition Requirements**:

- **Status**: Base atom - no composition dependencies from lower-level UI components
- **Note**: May optionally be composed with `InputLabel` and `Hint`/`ErrorMessage` atoms when used in form contexts, but the base Radio component stands alone

## Component Location

**Location**: `src/ui/inputs/radio.tsx`

**Category**: `inputs`

**Reasoning**: The Radio belongs in the inputs category alongside other form controls (checkbox, text-input, select, etc.). It follows the same interaction patterns as other selection inputs and will often be used in conjunction with labels and form fields.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/radio.tsx
export { Radio, radioVariants };
export type { RadioProps };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './radio';

// 3. Root barrel already exports from inputs

// 4. Import usage (recommended):
import { Radio } from '@/ui';

// 5. Import usage (alternative):
import { Radio } from '@/ui/inputs';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/inputs/checkbox.tsx`** - PRIMARY REFERENCE for Radix primitive integration, CVA pattern with data attributes, and TypeScript types (Radio should mirror this architecture closely)
- **`src/ui/buttons/button.tsx`** - Reference for CVA pattern implementation, variant organization, compound variants, and TypeScript types
- **`src/ui/buttons/__tests__/button.test.tsx`** - Reference for comprehensive testing patterns including state tests, accessibility tests, and keyboard interaction tests
- **`src/stories/buttons/button.stories.tsx`** - Reference for Storybook story structure, argTypes configuration, and variant documentation
- **`src/ui/inputs/index.ts`** - Barrel file to update with Radio export
- **`src/app/globals.css`** - Design tokens reference for semantic colors (brand primary, destructive, border colors)
- **`.claude/rules/styling-guidelines.md`** - Tailwind CSS 4 patterns and semantic color usage

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/radio.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/radio.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/radio.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: No - component size is fixed per variant, not responsive
- **Tablet (md: 768px - 1023px)**: No - same as desktop
- **Mobile (< 768px)**: No - same as desktop

The Radio component uses fixed sizes (sm: 16px, md: 20px, lg: 24px) that remain consistent across all breakpoints. The containing layout handles responsive behavior.

### Design Assets

**Status**: Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2044-143497&m=dev

**Design Specifications Extracted from Figma**:

| Property     | Unchecked                                      | Checked                                        |
| ------------ | ---------------------------------------------- | ---------------------------------------------- |
| **Base**     | White bg, gray border (#d7dbdf)                | Brand primary bg (#3c61dd), white inner circle |
| **Hover**    | Gray border darker (#c1c8cd)                   | Brand hover (#385bcc)                          |
| **Pressed**  | Light gray bg (#f0f2f4), dark border (#889096) | Brand active (#3451b2)                         |
| **Focused**  | Standard border + 3px brand ring (#d9e2fc)     | Brand bg + 3px ring shadow                     |
| **Disabled** | Light bg (#f0f2f4), light border (#e0e3e6)     | Muted brand (#8fa6ef)                          |
| **Error**    | White bg, destructive border (#e54d2e)         | Destructive bg (#e54d2e)                       |

**Size Specifications**:

- **SM**: 16px diameter, inner circle ~5.3px (33.33%)
- **MD**: 20px diameter, inner circle ~6.6px (33.33%)
- **LG**: 24px diameter, inner circle ~8px (33.33%)

**Visual Details**:

- Border radius: `rounded-full` (9999px)
- Transition: smooth color transitions (150ms)
- Inner circle: positioned at 33.33% inset from edges when checked
- Focus ring: Use `focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none` pattern (consistent with Checkbox)
  - **IMPORTANT**: Use `focus-visible:` NOT `focus:` to ensure ring only appears on keyboard navigation

## Storybook Stories

**Required**: Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/radio.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic Radio in a RadioGroup with no selection
2. **Checked Story**: RadioGroup with defaultValue showing selected state
3. **All Sizes**: sm, md, lg size comparison in RadioGroups
4. **All States**: Default, Hovered, Focused, Pressed, Disabled, Error
5. **Checked States**: All states while checked
6. **Error State**: RadioGroup with error prop applied
7. **Disabled State**: RadioGroup disabled, individual Radio disabled
8. **Interactive Playground**: Fully controllable RadioGroup with all args
9. **RadioGroup Controlled**: Controlled state with value/onValueChange
10. **RadioGroup Uncontrolled**: Using defaultValue prop
11. **With Labels**: Radio items integrated with InputLabel component
12. **Horizontal Layout**: RadioGroup with orientation="horizontal"
13. **Form Integration**: RadioGroup with name prop for form submission
14. **Complete Matrix**: Visual grid of all size/state combinations

**Story Requirements**:

- Use `satisfies Meta<typeof Radio>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for both Radio and RadioGroup props
- Set `parameters.layout: "centered"` for individual radio stories
- Create interactive controls for `disabled`, `size`, `error`, `value` (on RadioGroup)
- Include JSDoc-style comments explaining each story's purpose
- Demonstrate both controlled (`value`/`onValueChange`) and uncontrolled (`defaultValue`) patterns

## Implementation Plan

### Phase 0: Dependencies

1. **Install Radix Radio Group**
   ```bash
   npm install @radix-ui/react-radio-group
   ```
   This maintains consistency with the existing Checkbox component which uses `@radix-ui/react-checkbox`.

### Phase 1: Foundation

1. **Research and Analysis**
   - Review Figma design specifications in detail
   - **Review `src/ui/inputs/checkbox.tsx` as the primary architectural reference**
   - Map Figma color tokens to existing semantic colors in globals.css
   - Understand the inner circle indicator implementation (use `RadioGroup.Indicator` similar to `Checkbox.Indicator`)
   - Determine if existing focus ring patterns match Figma specs (use `focus-visible:` pattern)

2. **Token Mapping**
   - Map `bg-fill-brand-primary` to `--color-fill-primary` (#3c61dd)
   - Map `bg-fill-brand-primary_hover` to `--color-fill-primary-hover` (#385bcc)
   - Map `bg-fill-brand-primary_active` to `--color-fill-primary-active` (#3451b2)
   - Map `bg-fill-brand-primary_disabled` to `--color-fill-primary-disabled` (#8fa6ef)
   - Map `border-base-primary` to `--color-border` (#d7dbdf)
   - Map `border-danger-solid` to `--color-destructive` (#e54d2e)
   - Map focus ring to use `--color-primary` with opacity

### Phase 2: Core Implementation

1. **Create Radio Component (using Radix Radio Group)**
   - Import `@radix-ui/react-radio-group` primitives
   - Implement CVA variants for size (sm, md, lg)
   - Use `data-[state=checked]` for checked state styling (consistent with Checkbox)
   - Implement state variants (default, hover, focus, active, disabled, error)
   - Create inner circle indicator using `RadioGroup.Indicator` component (similar to Checkbox.Indicator)
   - Support both controlled (`value` prop on RadioGroup) and uncontrolled (`defaultValue`) modes
   - Forward ref properly to the Radix primitive element
   - **Add `displayName = 'Radio'`** for better debugging

2. **Create RadioGroup Component**
   - Wrap `RadioGroup.Root` with consistent styling
   - Manage group state via Radix's built-in state management
   - Pass error state context to child Radio items
   - Forward ref to RadioGroup.Root
   - **Add `displayName = 'RadioGroup'`** for better debugging

3. **Implement Visual States (using data attributes)**
   - Unchecked states: `border-border bg-background` with state variations
   - Checked states: `data-[state=checked]:bg-fill-primary` with white inner circle
   - Disabled states: `disabled:opacity-52 disabled:cursor-not-allowed`
   - Error states: `border-destructive` / `data-[state=checked]:bg-destructive`
   - Focus states: `focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none`
   - Pressed states: `active:shadow-[0px_0px_0px_3px_#e6e8eb]` (unchecked) / `active:shadow-[0px_0px_0px_3px_#d9e2fc]` (checked)

4. **Accessibility Implementation (via Radix)**
   - Radix automatically provides `role="radio"` and `aria-checked`
   - Radix automatically provides `role="radiogroup"` on RadioGroup
   - Support `aria-describedby` for error messages
   - Keyboard navigation handled automatically by Radix (Arrow keys, Space)
   - Focus management handled by Radix

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

1. Export `Radio`, `RadioGroup`, and `radioVariants` from `src/ui/inputs/radio.tsx`
2. Export types: `RadioProps`, `RadioGroupProps`
3. Add export to `src/ui/inputs/index.ts` barrel file
4. Components will be available via `import { Radio, RadioGroup } from '@/ui'`

**Storybook Documentation (REQUIRED):**

- Story file: `src/stories/inputs/radio.stories.tsx`
- Comprehensive argTypes for all props (checked, disabled, size, error, value, name)
- Stories for all states, sizes, and combinations
- Real-world examples showing radio groups in forms
- Interactive playground for testing combinations

## Step by Step Tasks

### Step 0: Install Radix Radio Group

- Run `npm install @radix-ui/react-radio-group`
- Verify installation in package.json

### Step 1: Research Existing Patterns

- **Read `src/ui/inputs/checkbox.tsx` as the primary reference** for Radix integration patterns
- Read button.tsx to understand CVA pattern usage
- Verify semantic color token availability in globals.css

### Step 2: Create Radio Component File

- Create `src/ui/inputs/radio.tsx`
- Import required dependencies:
  ```typescript
  import { type ComponentPropsWithoutRef, forwardRef } from 'react';
  import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
  import { cva, type VariantProps } from 'class-variance-authority';
  import { cn } from '@/lib/utils';
  ```
- Define `RadioProps` interface extending Radix `RadioGroup.Item` props:
  ```typescript
  export interface RadioProps
    extends
      Omit<ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'children'>,
      VariantProps<typeof radioVariants> {
    error?: boolean;
  }
  ```
- Define `RadioGroupProps` interface extending Radix `RadioGroup.Root` props:
  ```typescript
  export interface RadioGroupProps extends ComponentPropsWithoutRef<
    typeof RadioGroupPrimitive.Root
  > {
    error?: boolean;
  }
  ```
- Create `radioVariants` using CVA with:
  - Base styles (inline-flex, cursor-pointer, transition, rounded-full)
  - Size variants (sm: size-4, md: size-5, lg: size-6)
  - Use `data-[state=checked]` patterns for checked states (consistent with Checkbox)
- Create inner circle indicator using `RadioGroupPrimitive.Indicator`
- Implement Radio component with forwardRef
- Implement RadioGroup component with forwardRef
- Add `displayName` to both components
- Export components, variants, and types

### Step 3: Create Unit Tests

- Create `src/ui/inputs/__tests__/radio.test.tsx`
- Test rendering with default props
- Test all size variants (sm, md, lg)
- Test checked/unchecked states via `data-state` attribute (Radix pattern)
- Test disabled state (pointer-events, styling, `data-disabled` attribute)
- Test error state styling
- Test RadioGroup value change functionality
- Test keyboard interaction (Arrow keys for group navigation, Space to select - handled by Radix)
- Test ref forwarding to Radix primitive
- Test accessibility (role="radio", aria-checked - automatically provided by Radix)
- Test RadioGroup accessibility (role="radiogroup")
- Test form integration (name, value props on RadioGroup)
- Test className merging
- Test controlled vs uncontrolled mode via RadioGroup `value`/`defaultValue`

### Step 4: Create Storybook Stories

- Create `src/stories/inputs/radio.stories.tsx`
- Configure meta with title "Inputs/Radio"
- Add comprehensive argTypes with descriptions for both Radio and RadioGroup props
- Create Default story (unchecked Radio in a RadioGroup)
- Create Checked story (RadioGroup with defaultValue set)
- Create AllSizes story showing sm/md/lg comparison
- Create AllStates story (default, hover, focus, pressed, disabled, error)
- Create CheckedStates story showing all states while checked
- Create ErrorState story (with error prop)
- Create DisabledState story (disabled on RadioGroup or individual Radio items)
- Create RadioGroupControlled story demonstrating controlled state management
- Create RadioGroupUncontrolled story with defaultValue
- Create WithLabel story using InputLabel component
- Create HorizontalLayout story using RadioGroup orientation="horizontal"
- Create FormIntegration story with name prop for form submission
- Create CompleteMatrix story with all size/state combinations

### Step 5: Update Barrel Exports

- Add `export * from './radio';` to `src/ui/inputs/index.ts`

### Step 6: Run Validation Commands

- Execute `npm run type-check` - expect zero errors
- Execute `npm run lint` - expect zero errors/warnings
- Execute `npm test -- radio` - expect all tests pass
- Execute `npm run test:run` - expect zero regressions
- Execute `npm run build` - expect success
- Execute `npm run build-storybook` - expect success

## Testing Strategy

### Unit Tests

| Test Category        | Tests                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| **Rendering**        | Default props, className merging                                                                          |
| **Size Variants**    | sm (16px), md (20px), lg (24px) class application                                                         |
| **States**           | checked (`data-state="checked"`), unchecked (`data-state="unchecked"`), disabled (`data-disabled`), error |
| **Interactions**     | RadioGroup value change, keyboard Arrow keys navigation (Radix handles)                                   |
| **Accessibility**    | `role="radio"`, `aria-checked`, `role="radiogroup"` (Radix provides automatically)                        |
| **Form Integration** | name prop on RadioGroup, value prop on Radio items                                                        |
| **Ref Forwarding**   | ref points to Radix primitive element                                                                     |
| **Styling**          | Correct classes applied for each variant/state combo via data attributes                                  |
| **RadioGroup**       | `value`/`onValueChange` controlled mode, `defaultValue` uncontrolled mode                                 |

### Edge Cases

- Radio without RadioGroup wrapper (should still render but won't have group behavior)
- RadioGroup with single Radio item
- Rapidly clicking disabled radio (no state change)
- Focus management when disabled (Radix handles)
- Very long labels next to radio (handled by parent layout)
- RadioGroup controlled vs uncontrolled mode (`value` vs `defaultValue`)
- RadioGroup with `onValueChange` handler
- Radio with onFocus/onBlur handlers
- Changing RadioGroup value programmatically
- RadioGroup with `required` prop for form validation

## Acceptance Criteria

### Functional Requirements

- Components implemented in `src/ui/inputs/radio.tsx` with proper TypeScript types
- Both `Radio` and `RadioGroup` components exported
- All three size variants (sm, md, lg) work correctly
- Checked/unchecked states render appropriately via `data-state` attribute
- Disabled state prevents interaction and applies muted styling
- Error state applies destructive border/background colors
- Focus state shows proper ring indicator using `focus-visible:` pattern
- Components forward refs correctly to Radix primitive elements
- RadioGroup supports controlled (`value`) and uncontrolled (`defaultValue`) modes
- Components follow CVA patterns consistent with Checkbox component
- `displayName` set on both components
- Uses `@radix-ui/react-radio-group` for consistency with Checkbox architecture

### Testing Requirements

- Comprehensive unit tests with >90% coverage
- All interaction states tested (RadioGroup value change, keyboard navigation)
- Accessibility attributes tested (`role="radio"`, `role="radiogroup"`, `aria-checked`)
- Form integration tested via RadioGroup `name` prop
- Controlled and uncontrolled RadioGroup modes tested
- All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- **Storybook stories file created: `src/stories/inputs/radio.stories.tsx`**
- **Meta configuration with comprehensive argTypes**
- **Default story implemented**
- **All size stories implemented (sm, md, lg)**
- **All state stories implemented (default, hover, focus, pressed, disabled, error)**
- **Real-world examples (RadioGroup with labels, form integration)**
- **Comparison story showing all variants together**
- **Interactive controls configured for all props**
- **Storybook builds successfully: `npm run build-storybook`**
- **All stories render correctly in Storybook UI**

### Integration Requirements

- Exported through category barrel (`src/ui/inputs/index.ts`)
- Exported through root barrel (`src/ui/index.ts`)
- Components can be imported via `import { Radio, RadioGroup } from '@/ui'`

### Code Quality

- Zero TypeScript errors: `npm run type-check`
- Zero ESLint warnings: `npm run lint`
- Build succeeds: `npm run build`

## Validation Commands

**CRITICAL**: Execute EVERY command below. All must pass with zero errors.

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- radio`
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

The Figma design uses Glow UI-specific tokens that need to be mapped to the existing semantic color system:

| Figma Token                      | Project Token           |
| -------------------------------- | ----------------------- |
| `bg-fill-brand-primary`          | `fill-primary`          |
| `bg-fill-brand-primary_hover`    | `fill-primary-hover`    |
| `bg-fill-brand-primary_active`   | `fill-primary-active`   |
| `bg-fill-brand-primary_disabled` | `fill-primary-disabled` |
| `border-base-primary`            | `border`                |
| `border-base-primary_hover`      | `border-hover`          |
| `border-base-primary_disabled`   | `border-disabled`       |
| `border-danger-solid`            | `destructive`           |
| `bg-fill-danger-primary`         | `destructive`           |

### Implementation Considerations

1. **Inner Circle Indicator**: The checked state shows a white inner circle at 33.33% inset. Using Radix, implement via `RadioGroupPrimitive.Indicator`:

   ```tsx
   <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
     <div className="size-1/3 rounded-full bg-text-overlay-white" />
   </RadioGroupPrimitive.Indicator>
   ```

   This mirrors the Checkbox pattern using `CheckboxPrimitive.Indicator`.

2. **Focus Ring**: Use `focus-visible:` pattern consistent with Checkbox:

   ```tsx
   'focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none';
   ```

   **NOT** `focus:ring-*` - this ensures ring only appears on keyboard navigation.

3. **Radix Primitives**: Use `@radix-ui/react-radio-group` for:
   - Automatic ARIA attributes (`role="radio"`, `aria-checked`, `role="radiogroup"`)
   - Built-in keyboard navigation (Arrow keys, Space)
   - Data attribute state management (`data-state="checked"`, `data-state="unchecked"`)
   - Controlled/uncontrolled patterns via `value`/`defaultValue`

4. **RadioGroup Component**: Included in this implementation (not a future enhancement):
   - Wraps `RadioGroupPrimitive.Root`
   - Manages name prop for form submission
   - Controls value state
   - Provides `orientation` prop for horizontal/vertical layout

### Reference Implementation Pattern

```typescript
// src/ui/inputs/radio.tsx
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const radioVariants = cva(
  [
    // Base styles
    'inline-flex items-center justify-center',
    'shrink-0',
    'rounded-full',
    'border',
    'transition-colors duration-150',
    'cursor-pointer',
    // Focus state (keyboard navigation)
    'focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none',
    // Disabled state
    'disabled:cursor-not-allowed disabled:opacity-52',
    // Unchecked default state
    'border-border bg-background',
    // Unchecked hover
    'hover:border-border-hover hover:bg-background-secondary',
    // Pressed/active state
    'active:shadow-[0px_0px_0px_3px_#e6e8eb]',
    // Checked states (using Radix data attributes)
    'data-[state=checked]:border-fill-primary data-[state=checked]:bg-fill-primary',
    'data-[state=checked]:hover:border-fill-primary-hover data-[state=checked]:hover:bg-fill-primary-hover',
    'data-[state=checked]:active:shadow-[0px_0px_0px_3px_#d9e2fc]',
    // Disabled checked
    'data-[state=checked]:disabled:border-fill-primary-disabled data-[state=checked]:disabled:bg-fill-primary-disabled',
    // Disabled unchecked
    'disabled:border-border-disabled disabled:bg-background-tertiary',
  ],
  {
    variants: {
      size: {
        sm: 'size-4', // 16px
        md: 'size-5', // 20px
        lg: 'size-6', // 24px
      },
      error: {
        true: [
          'border-destructive',
          'hover:border-destructive-hover',
          'data-[state=checked]:border-destructive data-[state=checked]:bg-destructive',
          'data-[state=checked]:hover:border-destructive-hover data-[state=checked]:hover:bg-destructive-hover',
        ],
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
    },
  }
);

export interface RadioProps
  extends Omit<ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'children'>,
    VariantProps<typeof radioVariants> {
  error?: boolean;
}

export const Radio = forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioProps
>(({ className, size, error, disabled, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    disabled={disabled}
    className={cn(radioVariants({ size, error }), className)}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <div className="size-1/3 rounded-full bg-text-overlay-white" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));

Radio.displayName = 'Radio';

export interface RadioGroupProps
  extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  error?: boolean;
}

export const RadioGroup = forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn('flex flex-col gap-2', className)}
    {...props}
  />
));

RadioGroup.displayName = 'RadioGroup';

export { radioVariants };
```

**Usage Example**:

```tsx
import { Radio, RadioGroup } from '@/ui';

// Controlled usage
const [value, setValue] = useState('option1');

<RadioGroup value={value} onValueChange={setValue}>
  <label className="flex items-center gap-2">
    <Radio value="option1" />
    Option 1
  </label>
  <label className="flex items-center gap-2">
    <Radio value="option2" />
    Option 2
  </label>
</RadioGroup>

// Uncontrolled usage
<RadioGroup defaultValue="option1" name="my-radio-group">
  <Radio value="option1" />
  <Radio value="option2" />
</RadioGroup>
```

### Future Enhancements

- `RadioField` molecule combining Radio + InputLabel + Hint/ErrorMessage
- Animation for state transitions (scale/opacity on check)
- Custom icons/indicators for checked state
