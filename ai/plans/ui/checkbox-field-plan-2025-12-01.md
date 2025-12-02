# Ui: CheckboxField

## Component Description

CheckboxField is a composite form field that combines a Checkbox input with an associated label, optional hint text, and error message display. This component provides a complete, accessible checkbox field following the established `-field` composition pattern used throughout the design system. It supports three sizes (SM, MD, LG) and multiple states (Default, Hovered, Focused, Disabled, Error).

## User Story

As a **form designer**
I want to **use a pre-composed checkbox field with label, hint, and error support**
So that **I can quickly build consistent, accessible forms that match other field components like TextInputField and SelectField**

## Problem Statement

Currently, developers must manually compose the `Checkbox` component with label, hint, and error message elements, managing spacing, alignment, state propagation, and accessibility attributes manually. This leads to inconsistent implementations and potential accessibility issues when proper ARIA associations are not configured.

## Solution Statement

Create a `CheckboxField` molecule component that:

1. Follows the established `-field` composition pattern (like TextInputField, SelectField)
2. Composes the existing `Checkbox` atom with label, Hint, and ErrorMessage components
3. Handles proper label-input association for accessibility (clicking label toggles checkbox)
4. Implements complete ARIA associations (aria-describedby, aria-invalid, aria-required)
5. Provides consistent spacing and typography across all size variants
6. Propagates state styling (disabled, error) to all composed elements
7. Supports hint text that is replaced by error message when validation fails

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: CheckboxField combines multiple atoms (Checkbox + label + Hint + ErrorMessage) into a functional unit that serves as a complete form field. It follows the same composition pattern as TextInputField, SelectField, and other `-field` components.

**Composition Requirements**:

- **Required Atoms**:
  - `Checkbox` from `@/ui/inputs/checkbox` - The checkbox input control
  - `Hint` from `@/ui/inputs/hint` - Helper text below the field
  - `ErrorMessage` from `@/ui/inputs/error-message` - Error text when validation fails
  - Typography styles (text classes) - For label text rendering

- **Required Molecules**: None - This is a molecule itself

**Atomic Design Hierarchy**:

```
Atoms:
- Checkbox (standalone, already exists)
- Hint (helper text, already exists)
- ErrorMessage (error text with icon, already exists)

Molecules:
- CheckboxField (checkbox + label + Hint + ErrorMessage) ← This component
- TextInputField (input + InputLabel + Hint + ErrorMessage)
- SelectField (select + InputLabel + Hint + ErrorMessage)

Organisms:
- CheckboxGroup (multiple CheckboxField components with shared state)
- Form (collection of field molecules)
```

## Component Location

**Location**: `src/ui/inputs/checkbox-field.tsx`

**Category**: `inputs` - Form input components

**Reasoning**: The CheckboxField follows the established `-field` naming convention used by all form field composition wrappers in the project: TextInputField, SelectField, DateInputField, NumberInputField, ComboboxField, MultiselectField, etc.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/checkbox-field.tsx
export { CheckboxField };
export type { CheckboxFieldProps };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './checkbox-field';

// 3. Import usage (recommended):
import { CheckboxField } from '@/ui';

// 4. Import usage (alternative):
import { CheckboxField } from '@/ui/inputs';

// 5. Usage comparison:
// For custom layouts, use base Checkbox:
<Checkbox onChange={handleChange} />

// For standard form fields, use CheckboxField:
<CheckboxField
  label="Accept terms"
  hint="You must accept the terms to continue"
  error={errors.terms}
  required
/>
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/inputs/checkbox.tsx`** - The Checkbox atom component to compose from
  - Study size variants (sm, md, lg), state handling
  - Understand Radix UI Checkbox primitive usage

- **`src/ui/inputs/text-input-field.tsx`** - **PRIMARY REFERENCE** for composition pattern
  - Study the complete `-field` composition architecture
  - Reference hint/error replacement logic
  - Copy accessibility patterns (useId, aria-describedby, aria-invalid)
  - Reference size mapping constants approach

- **`src/ui/inputs/hint.tsx`** - Hint component for helper text
  - Study size variants and props interface

- **`src/ui/inputs/error-message.tsx`** - ErrorMessage component for validation errors
  - Study size variants and props interface

- **`src/ui/inputs/__tests__/checkbox.test.tsx`** - Testing patterns for checkbox
  - Reference test structure and coverage approach

- **`src/ui/inputs/__tests__/text-input-field.test.tsx`** - Testing patterns for field wrappers
  - Reference accessibility testing patterns
  - Study hint/error testing approach

- **`src/stories/inputs/checkbox.stories.tsx`** - Storybook patterns
  - Reference story structure and argTypes configuration

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/checkbox-field.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/checkbox-field.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/checkbox-field.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: No - Component is self-contained, no desktop-specific styles
- **Tablet (md: 768px - 1023px)**: No - Same rendering as desktop
- **Mobile (< 768px)**: No - Same rendering as other breakpoints

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2044-140541&m=dev
- Screenshot: Provided from Figma showing complete variant matrix

### Size Specifications

| Property                | Size SM          | Size MD          | Size LG          |
| ----------------------- | ---------------- | ---------------- | ---------------- |
| Checkbox size           | 16px (size-4)    | 20px (size-5)    | 24px (size-6)    |
| Gap (checkbox to label) | 12px (gap-3)     | 12px (gap-3)     | 12px (gap-3)     |
| Label font size         | 14px (text-sm)   | 16px (text-base) | 16px (text-base) |
| Label line height       | 20px (leading-5) | 24px (leading-6) | 24px (leading-6) |
| Hint/Error font size    | 14px (Hint sm)   | 14px (Hint sm)   | 16px (Hint md)   |

### Size Mapping Constants (NOT CVA)

Following the TextInputField pattern, CheckboxField uses size mapping constants instead of CVA:

```typescript
/**
 * Size mapping for checkbox label typography.
 * Maps CheckboxField sizes to label styling.
 */
const CHECKBOX_LABEL_SIZE_MAP = {
  sm: { gap: 'gap-3', fontSize: 'text-sm', lineHeight: 'leading-5' },
  md: { gap: 'gap-3', fontSize: 'text-base', lineHeight: 'leading-6' },
  lg: { gap: 'gap-3', fontSize: 'text-base', lineHeight: 'leading-6' },
} as const;

/**
 * Size mapping for hint/error messages.
 * Maps CheckboxField sizes to Hint/ErrorMessage sizes.
 */
const CHECKBOX_HINT_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;
```

### States

- **Default**: Label text-primary, checkbox default styling
- **Hovered**: Checkbox hover state, label unchanged
- **Focused**: Checkbox focus ring, label unchanged
- **Disabled**: Label text-secondary-disabled, checkbox disabled, hint disabled
- **Error**: Label text-primary, checkbox error state (red border), ErrorMessage replaces Hint

### Layout Structure

```
┌─────────────────────────────────────┐
│ [✓] Label text *                    │ ← Checkbox + label (inline, flex items-center)
├─────────────────────────────────────┤
│     Hint text or Error message      │ ← Hint (hidden when error) or ErrorMessage
└─────────────────────────────────────┘
```

**Label Association**: Use explicit `htmlFor` attribute (NOT wrapper label) to avoid nested interactive elements issue with Radix Checkbox button.

## Component Interface

```typescript
import { forwardRef, useId } from 'react';
import { Checkbox, type CheckboxProps } from './checkbox';
import { Hint, type HintProps } from './hint';
import { ErrorMessage, type ErrorMessageProps } from './error-message';
import { cn } from '@/lib/utils';

export interface CheckboxFieldProps extends Omit<CheckboxProps, 'error'> {
  /**
   * Label text displayed next to the checkbox.
   */
  label: string;

  /**
   * Additional CSS classes for the label element.
   */
  labelClassName?: string;

  /**
   * Hint text displayed below the checkbox.
   * Hidden when an error message is present.
   */
  hint?: string;

  /**
   * Additional props to pass to the Hint component.
   * Excludes `children` and `id` which are handled internally.
   */
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;

  /**
   * Error message displayed below the checkbox.
   * When provided, replaces the hint text.
   */
  error?: string;

  /**
   * Additional props to pass to the ErrorMessage component.
   * Excludes `text` and `id` which are handled internally.
   */
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;

  /**
   * Shows required indicator (red asterisk) in the label.
   * Also sets aria-required on the checkbox.
   */
  required?: boolean;

  /**
   * Additional CSS classes for the field container.
   */
  containerClassName?: string;
}
```

## Accessibility Implementation

### Required ARIA Attributes

Following the TextInputField accessibility pattern:

```typescript
export const CheckboxField = forwardRef<
  React.ComponentRef<typeof Checkbox>,
  CheckboxFieldProps
>(({ label, hint, error, required, id: providedId, ...props }, ref) => {
  // Generate unique IDs using useId()
  const generatedId = useId();
  const checkboxId = providedId ?? generatedId;
  const hintId = `${checkboxId}-hint`;
  const errorId = `${checkboxId}-error`;

  // Determine aria-describedby
  const hasError = Boolean(error);
  const hasHint = Boolean(hint) && !hasError;
  const ariaDescribedBy = hasError ? errorId : hasHint ? hintId : undefined;

  return (
    <div>
      <div className="flex items-center gap-3">
        <Checkbox
          id={checkboxId}
          ref={ref}
          error={hasError}
          aria-describedby={ariaDescribedBy}
          aria-invalid={hasError || undefined}
          aria-required={required || undefined}
          {...props}
        />
        <label
          htmlFor={checkboxId}
          className="cursor-pointer text-sm leading-5"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </label>
      </div>
      {hasHint && <Hint id={hintId}>{hint}</Hint>}
      {hasError && <ErrorMessage id={errorId} text={error} />}
    </div>
  );
});
```

### Accessibility Checklist

- ✅ `useId()` for generating unique IDs
- ✅ `htmlFor` association between label and checkbox
- ✅ `aria-describedby` pointing to hint or error
- ✅ `aria-invalid` when error state
- ✅ `aria-required` when required
- ✅ Required indicator with `aria-hidden="true"`
- ✅ Error message replaces hint (single describedby target)

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/checkbox-field.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic checkbox with label (MD size, unchecked)
2. **AllSizes**: SM, MD, LG size variants side by side
3. **CheckedStates**: Unchecked, Checked, Indeterminate for each size
4. **WithHint**: Checkbox with label and hint text
5. **WithError**: Checkbox with error message (hint replaced)
6. **WithHintAndError**: Shows hint/error replacement behavior
7. **RequiredField**: Checkbox with required indicator (red asterisk)
8. **DisabledStates**: Disabled in unchecked, checked, indeterminate states
9. **ControlledExample**: Interactive controlled component demo
10. **CheckboxGroupExample**: Multiple checkboxes in a form group
11. **FormValidationExample**: Form with required checkbox and error display
12. **CompleteMatrix**: Full matrix showing all size × state × checked combinations

**Story Requirements**:

- Use `satisfies Meta<typeof CheckboxField>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` for: label, hint, error, size, checked, indeterminate, disabled, required, onCheckedChange
- Set `parameters.layout: "centered"` for most stories
- Create interactive controls for all configurable props

**Example Structure**:

```typescript
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CheckboxField } from '@/ui/inputs';

const meta = {
  title: 'Inputs/CheckboxField',
  component: CheckboxField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The label text displayed next to the checkbox',
    },
    hint: {
      control: 'text',
      description:
        'Helper text displayed below the checkbox (hidden when error present)',
    },
    error: {
      control: 'text',
      description: 'Error message displayed below the checkbox (replaces hint)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the checkbox and label',
      table: { defaultValue: { summary: 'md' } },
    },
    checked: {
      control: 'select',
      options: [true, false, 'indeterminate'],
      description: 'The controlled checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Shows required indicator and sets aria-required',
    },
  },
} satisfies Meta<typeof CheckboxField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Accept terms and conditions' },
};

export const WithHint: Story = {
  args: {
    label: 'Subscribe to newsletter',
    hint: 'You can unsubscribe at any time',
  },
};

export const WithError: Story = {
  args: {
    label: 'Accept terms and conditions',
    required: true,
    error: 'You must accept the terms to continue',
  },
};

export const RequiredField: Story = {
  args: {
    label: 'I agree to the privacy policy',
    required: true,
    hint: 'Required for account creation',
  },
};
```

## Implementation Plan

### Phase 1: Foundation

1. Create the component file with proper TypeScript interfaces
2. Import required dependencies (Checkbox, Hint, ErrorMessage, useId, forwardRef)
3. Define size mapping constants (NOT CVA - following TextInputField pattern)
4. Set up basic component structure with forwardRef

### Phase 2: Core Implementation

1. Implement ID generation with useId()
2. Implement checkbox + label inline layout with htmlFor association
3. Implement hint/error composition with replacement logic
4. Implement required indicator with aria-hidden
5. Implement all ARIA attributes (aria-describedby, aria-invalid, aria-required)
6. Implement size-based styling using size mapping constants
7. Forward refs correctly to the underlying Checkbox

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Export from `src/ui/inputs/checkbox-field.tsx`
- Add to barrel export in `src/ui/inputs/index.ts`
- Verify import from `@/ui` works correctly

**Storybook Documentation (REQUIRED):**

- Create comprehensive stories file at `src/stories/inputs/checkbox-field.stories.tsx`
- Include all 12 required stories covering variants, states, and real-world examples
- Configure argTypes for interactive controls
- Add JSDoc documentation to meta for autodocs

## Step by Step Tasks

### 1. Create CheckboxField Component

- Create `src/ui/inputs/checkbox-field.tsx`
- Import dependencies: `forwardRef`, `useId`, `Checkbox`, `Hint`, `ErrorMessage`, `cn`
- Define `CheckboxFieldProps` interface extending `Omit<CheckboxProps, 'error'>`
- Add field-level props: `label`, `labelClassName`, `hint`, `hintProps`, `error`, `errorProps`, `required`, `containerClassName`
- Define size mapping constants `CHECKBOX_LABEL_SIZE_MAP` and `CHECKBOX_HINT_SIZE_MAP`
- Implement component with forwardRef pattern

### 2. Implement Accessibility

- Generate unique IDs using `useId()` hook
- Calculate `hasError` and `hasHint` booleans
- Build `ariaDescribedBy` value (errorId when error, hintId when hint, undefined otherwise)
- Apply `aria-describedby`, `aria-invalid`, `aria-required` to Checkbox
- Use `htmlFor` on label element pointing to checkboxId

### 3. Implement Layout Structure

- Container: `<div className={cn('flex flex-col', containerClassName)}>`
- Checkbox + Label row: `<div className={cn('flex items-center', labelStyles.gap)}>`
- Checkbox with ref forwarding and ARIA attributes
- Label with `htmlFor`, typography classes, required indicator
- Hint/Error section: Conditional render based on hasHint/hasError

### 4. Implement Size Variants

- SM: Checkbox size sm, label text-sm leading-5, Hint size sm
- MD: Checkbox size md, label text-base leading-6, Hint size sm
- LG: Checkbox size lg, label text-base leading-6, Hint size md
- Gap between checkbox and label: gap-3 (12px) for all sizes

### 5. Implement State Styling

- Default: Label text-text-primary
- Disabled: Label with disabled styling (propagate from checkbox), pass disabled to Hint
- Error: Pass `error={hasError}` to Checkbox, render ErrorMessage instead of Hint

### 6. Create Unit Tests

- Create `src/ui/inputs/__tests__/checkbox-field.test.tsx`
- Test rendering with label text
- Test rendering with hint text
- Test rendering with error message
- Test hint/error replacement behavior
- Test all size variants apply correct classes
- Test disabled state applies to checkbox, label, and hint
- Test error state applies to checkbox and shows ErrorMessage
- Test required indicator renders and has aria-hidden
- Test clicking label toggles checkbox (htmlFor association)
- Test keyboard interaction (Space key)
- Test accessibility (aria-describedby, aria-invalid, aria-required)
- Test ref forwarding
- Test custom className merging (containerClassName, labelClassName)
- Test hintProps and errorProps passthrough

### 7. Create Storybook Stories

- Create `src/stories/inputs/checkbox-field.stories.tsx`
- Implement Default story
- Implement AllSizes story
- Implement CheckedStates story
- Implement WithHint story
- Implement WithError story
- Implement WithHintAndError story (demonstrates replacement)
- Implement RequiredField story
- Implement DisabledStates story
- Implement ControlledExample story
- Implement CheckboxGroupExample story
- Implement FormValidationExample story
- Implement CompleteMatrix story
- Configure argTypes for all props

### 8. Update Barrel Exports

- Add `export * from './checkbox-field';` to `src/ui/inputs/index.ts`
- Verify component exports correctly

### 9. Run Validation Commands

- Execute all validation commands listed below
- Fix any issues that arise
- Ensure all tests pass with >90% coverage

## Testing Strategy

### Unit Tests

- **Rendering tests**: Verify label, hint, error, checkbox render correctly
- **Composition tests**: Verify Hint/ErrorMessage components are used correctly
- **Size variant tests**: Verify correct classes for sm, md, lg
- **State tests**: disabled, error state propagation to all elements
- **Interaction tests**: Click on label toggles checkbox, keyboard support
- **Accessibility tests**:
  - aria-describedby points to correct element (hint or error)
  - aria-invalid set when error present
  - aria-required set when required
  - htmlFor associates label with checkbox
- **Ref forwarding tests**: Verify ref is forwarded to checkbox element
- **Prop merging tests**: Custom className merges correctly
- **Prop passthrough tests**: hintProps and errorProps pass through correctly

### Edge Cases

- Label with very long text (should wrap properly)
- Hint with multi-line text
- Error message with very long text
- Indeterminate state with label
- Required checkbox with error state
- Combining disabled + error states
- Empty label string (edge case handling)
- Hint to error transition (hint disappears, error appears)
- Custom aria-describedby provided (should use provided value)

## Acceptance Criteria

### Functional Requirements

- ✅ Component renders checkbox with label text
- ✅ Component optionally renders hint below checkbox
- ✅ Component renders error message that replaces hint when present
- ✅ All size variants (sm, md, lg) work correctly
- ✅ Clicking label toggles checkbox (htmlFor association)
- ✅ Disabled state applies to checkbox, label, and hint
- ✅ Error state applies to checkbox and shows ErrorMessage
- ✅ Required indicator (red asterisk) renders when required=true
- ✅ Component forwards refs correctly
- ✅ Component follows `-field` composition pattern

### Accessibility Requirements

- ✅ Uses `useId()` for generating unique IDs
- ✅ Label has `htmlFor` pointing to checkbox ID
- ✅ Checkbox has `aria-describedby` pointing to hint or error ID
- ✅ Checkbox has `aria-invalid` when error is present
- ✅ Checkbox has `aria-required` when required is true
- ✅ Required indicator has `aria-hidden="true"`

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All accessibility attributes tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/checkbox-field.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **ALL variant stories implemented (sizes, states)**
- ✅ **WithHint and WithError stories for hint/error composition**
- ✅ **RequiredField story for required indicator**
- ✅ **Real-world examples (CheckboxGroup, FormValidation)**
- ✅ **CompleteMatrix story showing all combinations**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`) - already re-exports inputs
- ✅ Component can be imported via `import { CheckboxField } from '@/ui'`
- ✅ Follows same pattern as TextInputField, SelectField, etc.

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

3. **Run component tests**: `npm test -- checkbox-field`
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

## Reference Implementation

The following is the recommended implementation based on TextInputField patterns:

```typescript
// src/ui/inputs/checkbox-field.tsx
import { forwardRef, useId } from 'react';
import { Checkbox, type CheckboxProps } from './checkbox';
import { Hint, type HintProps } from './hint';
import { ErrorMessage, type ErrorMessageProps } from './error-message';
import { cn } from '@/lib/utils';

/**
 * Size mapping for checkbox label typography.
 * Maps CheckboxField sizes to label styling.
 */
const CHECKBOX_LABEL_SIZE_MAP = {
  sm: { gap: 'gap-3', fontSize: 'text-sm', lineHeight: 'leading-5' },
  md: { gap: 'gap-3', fontSize: 'text-base', lineHeight: 'leading-6' },
  lg: { gap: 'gap-3', fontSize: 'text-base', lineHeight: 'leading-6' },
} as const;

/**
 * Size mapping for hint/error messages.
 * Maps CheckboxField sizes to Hint/ErrorMessage sizes.
 */
const CHECKBOX_HINT_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

export interface CheckboxFieldProps
  extends Omit<CheckboxProps, 'error'> {
  label: string;
  labelClassName?: string;
  hint?: string;
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;
  error?: string;
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;
  required?: boolean;
  containerClassName?: string;
}

/**
 * CheckboxField - A complete checkbox form field with label, hint, and error message.
 *
 * Follows the established `-field` composition pattern used by TextInputField,
 * SelectField, and other form field components.
 *
 * @example
 * // Basic usage
 * <CheckboxField label="Accept terms" />
 *
 * // With hint
 * <CheckboxField
 *   label="Subscribe to newsletter"
 *   hint="You can unsubscribe at any time"
 * />
 *
 * // With error
 * <CheckboxField
 *   label="Accept terms"
 *   required
 *   error="You must accept the terms"
 * />
 */
export const CheckboxField = forwardRef<
  React.ComponentRef<typeof Checkbox>,
  CheckboxFieldProps
>(
  (
    {
      label,
      labelClassName,
      hint,
      hintProps,
      error,
      errorProps,
      required = false,
      containerClassName,
      size = 'md',
      id: providedId,
      disabled,
      'aria-describedby': providedAriaDescribedBy,
      ...checkboxProps
    },
    ref
  ) => {
    // Generate unique IDs
    const generatedId = useId();
    const checkboxId = providedId ?? generatedId;
    const hintId = `${checkboxId}-hint`;
    const errorId = `${checkboxId}-error`;

    // Determine which ID to use for aria-describedby
    const hasError = Boolean(error);
    const hasHint = Boolean(hint) && !hasError;

    // Build aria-describedby value
    const ariaDescribedBy =
      providedAriaDescribedBy ??
      (hasError ? errorId : hasHint ? hintId : undefined);

    // Get sizes for current checkbox size
    const labelStyles = CHECKBOX_LABEL_SIZE_MAP[size];
    const hintSize = CHECKBOX_HINT_SIZE_MAP[size];

    return (
      <div className={cn('flex flex-col', containerClassName)}>
        {/* Checkbox + Label Row */}
        <div className={cn('flex items-center', labelStyles.gap)}>
          <Checkbox
            ref={ref}
            id={checkboxId}
            size={size}
            disabled={disabled}
            error={hasError}
            aria-describedby={ariaDescribedBy}
            aria-invalid={hasError || undefined}
            aria-required={required || undefined}
            {...checkboxProps}
          />
          <label
            htmlFor={checkboxId}
            className={cn(
              'cursor-pointer font-sans font-normal text-text-primary',
              disabled && 'cursor-not-allowed text-text-secondary',
              labelStyles.fontSize,
              labelStyles.lineHeight,
              labelClassName
            )}
          >
            {label}
            {required && (
              <span
                className="ml-0.5 text-sm leading-5 text-destructive"
                aria-hidden="true"
              >
                *
              </span>
            )}
          </label>
        </div>

        {/* Hint or Error Message */}
        {hasHint && (
          <Hint id={hintId} size={hintSize} disabled={disabled} {...hintProps}>
            {hint}
          </Hint>
        )}

        {hasError && error && (
          <ErrorMessage
            id={errorId}
            text={error}
            size={hintSize}
            {...errorProps}
          />
        )}
      </div>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';
```

## Usage Examples

```typescript
// Simple checkbox with label
<CheckboxField label="Remember me" />

// Required checkbox with hint
<CheckboxField
  label="I accept the terms and conditions"
  required
  hint="Please read the full terms before accepting"
/>

// Checkbox with error (form validation)
<CheckboxField
  label="I accept the terms"
  required
  error={errors.terms ? "You must accept the terms" : undefined}
  checked={form.values.terms}
  onCheckedChange={(checked) => form.setFieldValue('terms', checked)}
/>

// Different sizes
<CheckboxField size="sm" label="Small checkbox" />
<CheckboxField size="md" label="Medium checkbox" />
<CheckboxField size="lg" label="Large checkbox" />

// Custom layout (use base Checkbox instead of CheckboxField)
<div className="flex items-start gap-3">
  <Checkbox id="newsletter" size="lg" />
  <div className="flex-1">
    <label htmlFor="newsletter" className="font-medium">
      Subscribe to newsletter
    </label>
    <p className="text-sm text-text-secondary">
      Get weekly updates about new features, tips, and best practices.
    </p>
  </div>
</div>
```

## Notes

- This component follows the established `-field` naming convention (TextInputField, SelectField, etc.)
- The component does NOT manage its own state - it should be a controlled component like the base Checkbox
- Use `htmlFor` association (not wrapper label) to avoid nested interactive elements with Radix Checkbox button
- The gap between checkbox and label is consistent at 12px (gap-3) across all sizes based on Figma
- Error message replaces hint when present (only one is shown at a time)
- The required indicator uses `aria-hidden="true"` since the requirement is communicated via `aria-required`
- Reference TextInputField for any implementation questions - this component should follow the same patterns
