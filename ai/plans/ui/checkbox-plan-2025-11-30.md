# Ui: Checkbox

## Component Description

The Checkbox component is a fundamental form control that allows users to select one or more options from a set, or to toggle a single option on/off. It supports three visual states: unchecked, checked (with checkmark), and indeterminate (with minus icon for "partial" selection in hierarchical lists). The component follows the Glow UI design system with multiple sizes (SM, MD, LG), interactive states (Default, Hovered, Focused, Pressed, Disabled, Error), and proper accessibility support through Radix UI primitives.

## User Story

As a user
I want to select options using checkboxes
So that I can make multiple selections in forms, toggle settings, or indicate agreement to terms

## Problem Statement

The application needs a consistent, accessible checkbox component that matches the Glow UI design system. Currently, there's no reusable checkbox component in the design system, forcing developers to use native browser checkboxes or build custom solutions that may not align with the brand styling or accessibility requirements.

## Solution Statement

Implement a Checkbox component using Radix UI's Checkbox primitive for accessibility and keyboard support, styled with Class Variance Authority (CVA) for variant management. The component will support all states from the Figma design (Default, Hovered, Focused, Pressed, Disabled, Error), three sizes (SM/16px, MD/20px, LG/24px), and three checked states (unchecked, checked, indeterminate). It will integrate with the existing Icon component for check/minus indicators and follow established component patterns in the codebase.

## Atomic Design Classification

**Component Type**: Atom

**Reasoning**: The Checkbox is a fundamental, indivisible UI element that cannot be broken down further without losing its meaning. It serves as a basic building block that will be composed into larger molecules (e.g., checkbox with label, checkbox groups) and organisms (e.g., filter panels, settings sections).

**Composition Requirements**:

- **Required Atoms**: Icon from `@/ui/icons` (for check and minus indicators)
- **Status**: ✅ Base atom with Icon dependency for visual indicators

## Component Location

**Location**: `src/ui/inputs/checkbox.tsx`

**Category**: inputs

**Reasoning**: The Checkbox is a form input element that belongs alongside other input components like TextInput, Select, and other form controls. The `inputs` category already contains related components and maintains consistent organization for form-related UI elements.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/checkbox.tsx
export { Checkbox, checkboxVariants };
export type { CheckboxProps };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './checkbox';

// 3. Import usage (recommended):
import { Checkbox } from '@/ui';

// 4. Import usage (alternative):
import { Checkbox } from '@/ui/inputs';
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/buttons/button.tsx`** - Reference for CVA patterns, compound variants, TypeScript types, and component structure with forwardRef
- **`src/ui/buttons/__tests__/button.test.tsx`** - Reference for comprehensive testing patterns including variant tests, state tests, accessibility tests
- **`src/stories/buttons/button.stories.tsx`** - Reference for Storybook story structure, argTypes configuration, and story organization
- **`src/ui/icons/icon.tsx`** - Icon component to use for check and minus indicators
- **`src/ui/inputs/index.ts`** - Barrel file to update with checkbox export
- **`src/ui/index.ts`** - Root barrel file (already exports from inputs)
- **`src/lib/utils.ts`** - cn utility for className merging

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/checkbox.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/checkbox.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/checkbox.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: No - Checkbox sizes are fixed (SM: 16px, MD: 20px, LG: 24px)
- **Tablet (md: 768px - 1023px)**: No - Same fixed sizes
- **Mobile (< 768px)**: No - Same fixed sizes, touch targets are adequate at all sizes

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1940-123982&m=dev
- Design specifications extracted from Figma:

**Size Specifications**:

| Size | Dimensions | Icon Size | Border Radius    |
| ---- | ---------- | --------- | ---------------- |
| SM   | 16x16px    | 12px      | 4px (rounded-xs) |
| MD   | 20x20px    | 16px      | 4px (rounded-xs) |
| LG   | 24x24px    | 16px      | 4px (rounded-xs) |

**Color Specifications**:

| State    | Unchecked BG                             | Unchecked Border                       | Checked/Indeterminate BG                             | Icon Color |
| -------- | ---------------------------------------- | -------------------------------------- | ---------------------------------------------------- | ---------- |
| Default  | bg-surface-base-primary (#ffffff)        | border-base-primary (#d7dbdf)          | bg-fill-brand-primary (#3c61dd)                      | white      |
| Hovered  | bg-surface-base-primary_hover (#f9fafb)  | border-base-primary_hover (#c1c8cd)    | bg-fill-brand-primary_hover (#385bcc)                | white      |
| Focused  | bg-surface-base-primary_active (#f0f2f4) | border-base-primary_active (#889096)   | bg-fill-brand-primary_active (#3451b2)               | white      |
| Pressed  | bg-surface-base-primary (#ffffff) + ring | border-base-primary (#d7dbdf) + ring   | bg-fill-brand-primary (#3c61dd) + ring               | white      |
| Disabled | bg-surface-base-primary_active (#f0f2f4) | border-base-primary_disabled (#e0e3e6) | bg-fill-brand-primary_disabled (#8fa6ef) 50% opacity | white      |
| Error    | bg-surface-base-primary (#ffffff)        | border-danger-solid (#e54d2e)          | bg-fill-danger-primary (#e54d2e)                     | white      |

**Ring/Shadow for Pressed State**:

- Unchecked: `0px 0px 0px 3px var(--theme/base/300, #e6e8eb)`
- Checked/Indeterminate: `0px 0px 0px 3px var(--theme/brand/300, #d9e2fc)`

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/checkbox.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic checkbox with default props (unchecked, MD size)
2. **Checked States**: All three states - unchecked, checked, indeterminate
3. **Size Variants**: SM (16px), MD (20px), LG (24px)
4. **Interactive States**: Default, Hover (via CSS), Focus, Pressed, Disabled
5. **Error State**: Checkbox with error styling
6. **Disabled States**: Disabled in unchecked, checked, and indeterminate states
7. **WithLabel**: Checkbox composed with label text (common usage pattern)
8. **Controlled Example**: Checkbox with React state management
9. **Checkbox Group Example**: Multiple checkboxes for selection patterns
10. **AllVariants Grid**: Visual comparison showing all size × state × checked combinations

**Story Requirements**:

- Use `satisfies Meta<typeof Checkbox>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` for: checked, indeterminate, size, disabled, error, onCheckedChange
- Set `parameters.layout: "centered"`
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. **Install Radix UI Checkbox** (if not already installed):

   ```bash
   npm install @radix-ui/react-checkbox
   ```

2. **Research existing semantic color tokens** in `globals.css` to map Figma design tokens to existing project tokens:

   ```bash
   # Verify semantic color tokens exist
   grep -E "bg-fill-brand-primary|border-base-primary" src/app/globals.css
   ```

3. **Verify Phosphor Icons** are available:
   - `Check` icon from `@phosphor-icons/react`
   - `Minus` icon from `@phosphor-icons/react`

4. **Create checkbox variant definitions** using CVA with:
   - Size variants: `sm`, `md`, `lg`
   - State variants via data attributes: `data-state`, `data-disabled`, `data-error`

### Phase 2: Core Implementation

1. **Create Checkbox component** (`src/ui/inputs/checkbox.tsx`):
   - Use Radix UI `@radix-ui/react-checkbox` as the base primitive
   - Implement CVA variants for sizes and states
   - Integrate Icon component for check (Check icon) and minus (Minus icon) indicators
   - Support `checked`, `indeterminate`, `disabled`, `error` props
   - Forward ref for form integration
   - Expose `onCheckedChange` callback

2. **CRITICAL: Use Direct React Imports** (not namespace imports):

   ```typescript
   // ✅ CORRECT - Direct imports
   import { forwardRef, type ComponentPropsWithoutRef } from 'react';

   // ❌ WRONG - Namespace imports (only allowed in barrel files)
   import * as React from 'react';
   ```

3. **Create explicit Icon Size Map** (following Button pattern):

   ```typescript
   const checkboxIconSizeMap = {
     sm: 'xs',
     md: 'sm',
     lg: 'sm',
   } as const;

   type IconSize = (typeof checkboxIconSizeMap)[keyof typeof checkboxIconSizeMap];

   // Usage
   const iconSize = checkboxIconSizeMap[size ?? 'md'];
   ```

4. **Implement styling**:
   - Map Figma tokens to existing semantic color tokens
   - Use Tailwind data attribute variants: `data-[state=checked]:`, `data-[state=indeterminate]:`
   - Apply `focus-visible:ring-*` for keyboard focus state (matching Button pattern)
   - Apply `active:shadow-*` (box-shadow) for pressed/active state (NOT ring)

5. **Create comprehensive tests** (`src/ui/inputs/__tests__/checkbox.test.tsx`):
   - Rendering tests for all variants
   - State transition tests (unchecked ↔ checked ↔ indeterminate)
   - Disabled state tests
   - Error state tests
   - Keyboard interaction tests (Space key)
   - Focus management tests
   - Accessibility tests (aria attributes, role)
   - Form integration tests

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

1. Update `src/ui/inputs/index.ts` to export checkbox
2. Verify export through `src/ui/index.ts` (already re-exports inputs)

**Storybook Documentation (REQUIRED):**

1. Create `src/stories/inputs/checkbox.stories.tsx`
2. Configure all argTypes with descriptions
3. Implement all required stories (Default, Checked, Sizes, States, Error, Disabled, etc.)
4. Add real-world usage examples (forms, settings toggles, list selections)

## Step by Step Tasks

### Step 1: Verify Dependencies

- [ ] Check if `@radix-ui/react-checkbox` is installed
- [ ] If not installed, run: `npm install @radix-ui/react-checkbox`
- [ ] Verify Phosphor icons Check and Minus are available

### Step 2: Create Checkbox Component

- [ ] Create `src/ui/inputs/checkbox.tsx`
- [ ] **Use direct React imports** (not namespace): `import { forwardRef, type ComponentPropsWithoutRef } from 'react'`
- [ ] Define `checkboxIconSizeMap` const (following Button pattern):
  ```typescript
  const checkboxIconSizeMap = {
    sm: 'xs',
    md: 'sm',
    lg: 'sm',
  } as const;
  ```
- [ ] Define `checkboxVariants` using CVA with size variants (sm, md, lg)
- [ ] Define `CheckboxProps` interface extending Radix Checkbox props
- [ ] Implement base Checkbox component using Radix `Checkbox.Root`
- [ ] Add `Checkbox.Indicator` with Icon component for check/minus icons
- [ ] Pass `color={null}` to Icon to allow currentColor inheritance
- [ ] Apply styling for all states using data attributes:
  - Default (unchecked): white background, gray border
  - Checked: primary blue background, white check icon
  - Indeterminate: primary blue background, white minus icon
  - Hovered: slightly darker background/border (via CSS `:hover`)
  - Focused: `focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none`
  - Pressed/Active: `active:shadow-[0px_0px_0px_3px_var(--neutral-300)]` (box-shadow, NOT ring)
  - Disabled: muted colors, reduced opacity
  - Error: red border when unchecked, red background when checked
- [ ] Forward ref properly
- [ ] Set `displayName = 'Checkbox'`
- [ ] Export component, variants, and types

### Step 3: Create Unit Tests

- [ ] Create `src/ui/inputs/__tests__/checkbox.test.tsx`
- [ ] Write rendering tests:
  - Renders with default props
  - Renders unchecked state correctly
  - Renders checked state correctly
  - Renders indeterminate state correctly
- [ ] Write variant tests:
  - SM size applies correct classes
  - MD size applies correct classes
  - LG size applies correct classes
- [ ] Write state tests:
  - Disabled checkbox cannot be clicked
  - Error state shows error styling
  - Checked state change fires callback
- [ ] Write keyboard interaction tests:
  - Space key toggles checkbox
  - Disabled checkbox ignores keyboard
- [ ] Write accessibility tests:
  - Has correct role="checkbox"
  - Has aria-checked attribute
  - aria-checked="mixed" for indeterminate
  - aria-disabled for disabled state

### Step 4: Create Storybook Stories

- [ ] Create `src/stories/inputs/checkbox.stories.tsx`
- [ ] Define meta with title "Inputs/Checkbox"
- [ ] Configure argTypes for all props
- [ ] Create Default story
- [ ] Create CheckedStates story (unchecked, checked, indeterminate)
- [ ] Create AllSizes story (sm, md, lg)
- [ ] Create DisabledStates story
- [ ] Create ErrorState story
- [ ] Create WithLabel story (common composition pattern)
- [ ] Create ControlledExample story with useState
- [ ] Create CheckboxGroup story showing multiple checkboxes
- [ ] Create CompleteMatrix story showing all combinations

### Step 5: Update Barrel Exports

- [ ] Add `export * from './checkbox';` to `src/ui/inputs/index.ts`

### Step 6: Run Validation Commands

- [ ] Run `npm run type-check` - verify zero TypeScript errors
- [ ] Run `npm run lint` - verify zero ESLint errors
- [ ] Run `npm test -- checkbox` - verify all checkbox tests pass
- [ ] Run `npm run test:run` - verify no regressions in other tests
- [ ] Run `npm run build` - verify build succeeds
- [ ] Run `npm run build-storybook` - verify Storybook builds successfully

## Testing Strategy

### Unit Tests

1. **Rendering Tests**
   - Default unchecked state renders correctly
   - Checked state renders with check icon
   - Indeterminate state renders with minus icon
   - All size variants render correct dimensions

2. **Interaction Tests**
   - Click toggles checked state
   - Space key toggles checked state
   - onCheckedChange callback fires with correct value
   - Disabled checkbox does not respond to interactions

3. **State Tests**
   - Controlled checkbox reflects prop value
   - Disabled checkbox has correct attributes
   - Error state applies error styling
   - Focus state shows focus ring

4. **Accessibility Tests**
   - Has role="checkbox"
   - Has aria-checked (true/false/mixed)
   - Has aria-disabled when disabled
   - Keyboard focusable (unless disabled)

### Edge Cases

- Rapid clicking (debounce/throttle not needed but state consistency)
- Controlled vs uncontrolled usage
- Switching from checked to indeterminate programmatically
- Error state combined with disabled state
- Focus ring visibility during keyboard navigation
- Form submission includes correct value

## Acceptance Criteria

### Functional Requirements

- ✅ Checkbox renders in unchecked, checked, and indeterminate states
- ✅ Clicking toggles between unchecked and checked
- ✅ Indeterminate state requires programmatic control
- ✅ Three sizes work correctly: SM (16px), MD (20px), LG (24px)
- ✅ All interactive states work: Default, Hovered, Focused, Pressed, Disabled, Error
- ✅ Component forwards refs correctly
- ✅ onCheckedChange callback fires with correct value (boolean | 'indeterminate')
- ✅ Component integrates with Radix UI primitives for accessibility

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All rendering scenarios tested
- ✅ All interaction scenarios tested
- ✅ Accessibility tests passing
- ✅ Edge cases covered
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/checkbox.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **All variant stories implemented (sizes, checked states)**
- ✅ **All state stories implemented (hover, focus, disabled, error)**
- ✅ **Real-world examples (minimum 2-3 practical usage scenarios)**
- ✅ **Comparison story showing all variants together**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { Checkbox } from '@/ui'`

### Code Quality

- ✅ Zero TypeScript errors: `npm run type-check`
- ✅ Zero ESLint warnings: `npm run lint`
- ✅ Build succeeds: `npm run build`

## Validation Commands

Execute EVERY command below. All must pass with zero errors.

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- checkbox`
   - Expected: All checkbox tests pass with >90% coverage
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

### Implementation Notes

1. **Radix UI Checkbox** provides:
   - Built-in keyboard support (Space to toggle)
   - Proper ARIA attributes
   - Data attributes for styling (`data-state="checked|unchecked|indeterminate"`, `data-disabled`)
   - Controlled/uncontrolled modes

2. **Color Token Mapping**: The Figma design uses context-specific tokens. Map these to existing project tokens:
   - `bg-fill-brand-primary` → `bg-primary` or create new token
   - `border-base-primary` → `border-border` or similar
   - Check `globals.css` for exact semantic token names
   - **If token doesn't exist**: Create as semantic token, NOT raw color value

3. **Icon Component Integration**: Use the existing Icon component with Phosphor icons:
   - Check icon: `Check` from `@phosphor-icons/react`
   - Minus icon: `Minus` from `@phosphor-icons/react`
   - Pass `weight="bold"` for thicker stroke visibility
   - **Pass `color={null}`** to allow currentColor inheritance from parent text color

4. **Focus vs Pressed State Distinction** (from architectural review):
   - **Focus state** (keyboard navigation): Use `focus-visible:ring-*` utilities
     ```tsx
     focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none
     ```
   - **Pressed/Active state** (mouse/touch): Use `active:shadow-*` (box-shadow)
     ```tsx
     active:shadow-[0px_0px_0px_3px_var(--neutral-300)]
     data-[state=checked]:active:shadow-[0px_0px_0px_3px_var(--primary-300)]
     ```
   - **Rationale**: Ring is exclusively for focus in this project; pressed uses box-shadow

5. **Icon Size Mapping** (following Button pattern):

   ```typescript
   const checkboxIconSizeMap = {
     sm: 'xs', // 16px checkbox → 12px icon
     md: 'sm', // 20px checkbox → 16px icon
     lg: 'sm', // 24px checkbox → 16px icon
   } as const;

   type IconSize = (typeof checkboxIconSizeMap)[keyof typeof checkboxIconSizeMap];
   ```

6. **Direct React Imports**: Always use direct imports in component files:

   ```typescript
   // ✅ CORRECT
   import { forwardRef, type ComponentPropsWithoutRef } from 'react';

   // ❌ WRONG (only allowed in barrel files for Radix re-exports)
   import * as React from 'react';
   ```

### Future Considerations

1. **CheckboxGroup Component**: Consider creating a CheckboxGroup molecule for managing multiple related checkboxes with shared state
2. **CheckboxField Component**: Compose Checkbox with InputLabel and ErrorMessage for form field patterns (following TextInputField pattern)
3. **Dark Mode**: Current implementation is light mode only; token-based approach allows easy dark mode addition later

### Architectural Review Applied

This plan incorporates refinements from the architectural evaluation (`ai/agents/evaluations/checkbox-plan-2025-11-30.md`):

- ✅ Focus/Pressed state distinction clarified (ring for focus, box-shadow for pressed)
- ✅ Explicit icon size mapping const pattern added
- ✅ Direct React imports requirement documented
- ✅ Icon `color={null}` pattern for currentColor inheritance
- ✅ Semantic token creation guidance if tokens don't exist
