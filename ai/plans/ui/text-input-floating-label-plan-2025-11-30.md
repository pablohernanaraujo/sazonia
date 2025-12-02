# Ui: TextInputFloatingLabel

## Component Description

TextInputFloatingLabel is an enhanced text input component that features a floating label animation pattern. When the input is empty, the label appears as placeholder text inside the input field. Upon focus or when the input has a value, the label smoothly animates to float above the input border, creating a modern and space-efficient form field design.

This component is commonly used in Material Design and modern UI systems to provide clear visual feedback while maximizing form density. The floating label pattern helps users understand what information is expected while maintaining context even after the input is filled.

## User Story

As a **form designer/developer**
I want to **use text inputs with floating labels**
So that **I can create modern, space-efficient forms that provide clear context about each field while reducing vertical space usage**

## Problem Statement

Standard text inputs with labels above require more vertical space and can feel disconnected from their inputs. When forms have many fields, this leads to long, scrollable forms that feel cumbersome. Additionally, traditional placeholder text disappears when users start typing, removing context about what the field is for.

## Solution Statement

Implement TWO components following the established Input/Field pattern:

1. **TextInputFloatingLabel (Molecule)** - Standalone input with integrated floating label animation and add-ons support. Does NOT include Hint/ErrorMessage - those are composed at the Field level.

2. **TextInputFloatingLabelField (Organism)** - Composition wrapper that combines the molecule with Hint/ErrorMessage atoms, providing ID management and aria-describedby wiring.

This separation provides:

- **Flexibility:** Users can compose manually when they need custom layouts (e.g., label with "Forgot password?" link)
- **Reusability:** The input can be used standalone without label overhead
- **Consistency:** All input patterns follow the same architecture (TextInput/TextInputField pattern)
- **Maintainability:** Changes to label/hint/error behavior happen in one place

## Atomic Design Classification

### Component 1: TextInputFloatingLabel

**Component Type**: Molecule

**Reasoning**: Combines multiple atoms (native input, floating label element, add-on containers) with complex state-based animation logic. More complex than a single atom due to the floating label behavior and state management.

**Composition**: Input element + floating label + left/right add-ons

**Does NOT include**: Hint, ErrorMessage (those are composed at the Field level)

### Component 2: TextInputFloatingLabelField

**Component Type**: Organism

**Reasoning**: Composes the molecule with atoms (Hint, ErrorMessage) to create a complete form field.

**Composition**: TextInputFloatingLabel + Hint + ErrorMessage

**Provides**: ID management, aria-describedby wiring, error state coordination

### Composition Requirements

- **Required Atoms**:
  - `TextSm`, `TextXs` from `@/ui/typography` - For label and hint text typography
  - `Icon` from `@/ui/icons` - For optional add-on icons
  - `Hint` from `@/ui/inputs` - For hint text (used in Field wrapper)
  - `ErrorMessage` from `@/ui/inputs` - For error messages (used in Field wrapper)

## Component Location

**Molecule Location**: `src/ui/inputs/text-input-floating-label.tsx`
**Organism Location**: `src/ui/inputs/text-input-floating-label-field.tsx`

**Category**: `inputs`

**Reasoning**: These components are form input elements that belong in the inputs category alongside TextInput, TextInputField, InputLabel, Hint, and ErrorMessage. They follow the same Input/Field separation pattern.

**Export Pattern**:

```typescript
// 1. Create molecule: src/ui/inputs/text-input-floating-label.tsx
export {
  TextInputFloatingLabel,
  textInputFloatingLabelVariants,
  floatingLabelVariants,
};
export type { TextInputFloatingLabelProps };

// 2. Create organism: src/ui/inputs/text-input-floating-label-field.tsx
export { TextInputFloatingLabelField };
export type { TextInputFloatingLabelFieldProps };

// 3. Update category barrel: src/ui/inputs/index.ts
export * from './text-input-floating-label';
export * from './text-input-floating-label-field';

// 4. Root barrel already exports inputs: src/ui/index.ts (no changes needed)
export * from './inputs';

// 5. Import usage (recommended):
import { TextInputFloatingLabel, TextInputFloatingLabelField } from '@/ui';

// 6. Import usage (alternative):
import { TextInputFloatingLabel, TextInputFloatingLabelField } from '@/ui/inputs';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/inputs/text-input.tsx`** - Primary reference for input patterns, CVA variants, add-on handling, and prop structure. The floating label version will follow similar patterns.

- **`src/ui/inputs/text-input-field.tsx`** - **CRITICAL REFERENCE** for how to compose inputs with labels, hints, and error messages. The floating label Field component MUST follow this exact pattern.

- **`src/ui/inputs/input-label.tsx`** - Reference for label typography and required indicator styling.

- **`src/ui/inputs/hint.tsx`** - Atom for hint text, will be composed in the field wrapper.

- **`src/ui/inputs/error-message.tsx`** - Atom for error messages, will be composed in the field wrapper.

- **`src/ui/typography/text.tsx`** - Reference for text component composition patterns.

- **`src/stories/inputs/text-input.stories.tsx`** (CRITICAL REFERENCE) - Complete reference for story structure, argTypes configuration, state demonstrations, and form integration examples.

- **`src/ui/inputs/__tests__/text-input.test.tsx`** - Reference for testing patterns, edge cases, and accessibility testing.

### New Files (ALL are REQUIRED)

1. **Molecule file**: `src/ui/inputs/text-input-floating-label.tsx` (REQUIRED)
2. **Organism file**: `src/ui/inputs/text-input-floating-label-field.tsx` (REQUIRED)
3. **Molecule test file**: `src/ui/inputs/__tests__/text-input-floating-label.test.tsx` (REQUIRED)
4. **Organism test file**: `src/ui/inputs/__tests__/text-input-floating-label-field.test.tsx` (REQUIRED)
5. **Story file**: `src/stories/inputs/text-input-floating-label.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Architecture Reference Implementation

### TextInputFloatingLabel (Molecule)

```typescript
// FILE: src/ui/inputs/text-input-floating-label.tsx
// MOLECULE - Standalone input with floating label

import { forwardRef, useState, useEffect, useRef, useId, ComponentPropsWithoutRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Wrapper variants
const textInputFloatingLabelVariants = cva(
  'relative flex items-center rounded-sm border transition-colors',
  {
    variants: {
      error: {
        true: 'border-2 border-danger-solid',
        false: 'border border-base-primary hover:border-base-primary_hover focus-within:border-2 focus-within:border-brand-solid',
      },
      disabled: {
        true: 'bg-surface-base-secondary cursor-not-allowed',
        false: 'bg-surface-base-primary',
      },
    },
    defaultVariants: {
      error: false,
      disabled: false,
    },
  }
);

// Floating label variants with compound variants
const floatingLabelVariants = cva(
  'absolute left-3 px-1 transition-all duration-150 ease-out pointer-events-none',
  {
    variants: {
      floating: {
        true: 'top-0 -translate-y-1/2 scale-75 bg-background text-xs font-medium',
        false: 'top-1/2 -translate-y-1/2 scale-100 bg-transparent text-base font-normal',
      },
      error: {
        true: 'text-danger',
        false: 'text-text-tertiary',
      },
      focused: {
        true: '',
        false: '',
      },
      disabled: {
        true: 'text-text-tertiary',
        false: '',
      },
    },
    compoundVariants: [
      // When floating and focused (not error), use brand color
      {
        floating: true,
        focused: true,
        error: false,
        className: 'text-brand-solid',
      },
      // Error always takes precedence
      {
        error: true,
        className: 'text-danger',
      },
    ],
    defaultVariants: {
      floating: false,
      error: false,
      focused: false,
      disabled: false,
    },
  }
);

export interface TextInputFloatingLabelProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size'>,
    VariantProps<typeof textInputFloatingLabelVariants> {
  /** The floating label text */
  label: string;
  /** Shows required indicator (*) */
  required?: boolean;
  /** Error state - shows destructive styling */
  error?: boolean;
  /** Left add-on element (icon, text, etc.) */
  leftAddOn?: React.ReactNode;
  /** Right add-on element (icon, text, etc.) */
  rightAddOn?: React.ReactNode;
}

export const TextInputFloatingLabel = forwardRef<HTMLInputElement, TextInputFloatingLabelProps>(
  ({ label, required, error, disabled, leftAddOn, rightAddOn, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isAutofilled, setIsAutofilled] = useState(false);
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;
    const inputId = useId();

    const hasValue = Boolean(props.value || props.defaultValue);
    const shouldFloat = isFocused || hasValue || isAutofilled || Boolean(props.placeholder);

    // Autofill detection
    useEffect(() => {
      if (!inputRef.current) return;

      const checkAutofill = () => {
        const matches = inputRef.current?.matches(':-webkit-autofill');
        setIsAutofilled(Boolean(matches));
      };

      // Check immediately
      checkAutofill();

      // Check after browsers typically autofill
      const timer = setTimeout(checkAutofill, 500);

      // Listen for animation (some browsers fire this on autofill)
      const handleAnimationStart = (e: AnimationEvent) => {
        if (e.animationName === 'onAutoFillStart') {
          setIsAutofilled(true);
        }
      };

      inputRef.current.addEventListener('animationstart', handleAnimationStart);

      return () => {
        clearTimeout(timer);
        inputRef.current?.removeEventListener('animationstart', handleAnimationStart);
      };
    }, [inputRef]);

    return (
      <div
        className={cn(
          textInputFloatingLabelVariants({ error, disabled }),
          className
        )}
      >
        {/* Floating Label */}
        <label
          htmlFor={props.id || inputId}
          className={floatingLabelVariants({
            floating: shouldFloat,
            error,
            focused: isFocused,
            disabled,
          })}
        >
          {label}
          {required && (
            <>
              <span aria-hidden="true" className="text-danger ml-0.5">*</span>
              <span className="sr-only">required</span>
            </>
          )}
        </label>

        {/* Input Container */}
        <div className="flex items-center w-full px-4 py-3.5 gap-2.5">
          {leftAddOn && <span className="flex-shrink-0">{leftAddOn}</span>}
          <input
            ref={inputRef}
            id={props.id || inputId}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            // Only show placeholder when floating
            placeholder={shouldFloat ? props.placeholder : undefined}
            className={cn(
              'flex-1 bg-transparent outline-none text-base text-text-primary',
              'placeholder:text-text-tertiary',
              'disabled:cursor-not-allowed disabled:text-text-tertiary'
            )}
            aria-invalid={error ? true : undefined}
            aria-required={required ? true : undefined}
            {...props}
          />
          {rightAddOn && <span className="flex-shrink-0">{rightAddOn}</span>}
        </div>
      </div>
    );
  }
);

TextInputFloatingLabel.displayName = 'TextInputFloatingLabel';

export { textInputFloatingLabelVariants, floatingLabelVariants };
```

### TextInputFloatingLabelField (Organism)

```typescript
// FILE: src/ui/inputs/text-input-floating-label-field.tsx
// ORGANISM - Complete field with hint/error composition

import { forwardRef, useId } from 'react';
import { TextInputFloatingLabel, type TextInputFloatingLabelProps } from './text-input-floating-label';
import { Hint, type HintProps } from './hint';
import { ErrorMessage, type ErrorMessageProps } from './error-message';

export interface TextInputFloatingLabelFieldProps extends TextInputFloatingLabelProps {
  /** Hint text displayed below the input */
  hint?: string;
  /** Error message displayed below the input (replaces hint when present) */
  errorMessage?: string;
  /** Additional props for the Hint component */
  hintProps?: Omit<HintProps, 'children'>;
  /** Additional props for the ErrorMessage component */
  errorProps?: Omit<ErrorMessageProps, 'text'>;
}

export const TextInputFloatingLabelField = forwardRef<HTMLInputElement, TextInputFloatingLabelFieldProps>(
  ({ hint, errorMessage, hintProps, errorProps, ...inputProps }, ref) => {
    const inputId = useId();
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const hasError = Boolean(errorMessage);
    const describedBy = hasError ? errorId : hint ? hintId : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <TextInputFloatingLabel
          ref={ref}
          id={inputProps.id || inputId}
          error={hasError}
          aria-describedby={describedBy}
          {...inputProps}
        />
        {hint && !hasError && (
          <Hint id={hintId} {...hintProps}>
            {hint}
          </Hint>
        )}
        {hasError && (
          <ErrorMessage id={errorId} text={errorMessage} {...errorProps} />
        )}
      </div>
    );
  }
);

TextInputFloatingLabelField.displayName = 'TextInputFloatingLabelField';
```

### Use Case Examples

```tsx
// Use Case 1 - Standalone (needs custom layout)
<div className="flex items-center justify-between gap-2">
  <TextInputFloatingLabel label="Password" type="password" />
  <button type="button" className="text-sm text-brand">Forgot password?</button>
</div>

// Use Case 2 - Complete field (most common)
<TextInputFloatingLabelField
  label="Email"
  hint="We'll never share your email"
  errorMessage={errors.email}
/>
```

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required - Full width support (320px default from Figma)
- **Tablet (md: 768px - 1023px)**: Required - Same behavior, responsive width
- **Mobile (< 768px)**: Required - Same behavior, full-width default

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1985-109598&m=dev
- Screenshot: Captured showing all states

### Design Specifications

#### States (from Figma):

1. **Empty**: Label as placeholder inside input, border `border-base-primary` (#d7dbdf)
2. **Hovered**: Border `border-base-primary_hover` (#c1c8cd)
3. **Focused**: Floating label with brand color (#3c61dd), 2px border, input shows placeholder with cursor
4. **Typing**: Floating label with brand color, user input visible
5. **Filled**: Floating label in tertiary color (#889096), 1px border
6. **Disabled**: Secondary background (#f9fafb), tertiary label color
7. **Disabled - Filled**: Same as disabled but with value shown
8. **Error**: Floating label in danger color (#e54d2e), 2px danger border (#e54d2e)
9. **Error - Filled**: Same as error but with value shown

#### Typography:

- **Label (floating)**: 12px Inter Medium, line-height 18px
- **Label (inline/placeholder)**: 16px Inter Regular, line-height 24px
- **Input value**: 16px Inter Regular, line-height 24px
- **Required asterisk**: 14px Inter Medium, danger color

#### Spacing:

- **Input padding**: px-16px (--spacing-3xl), py-14px (--spacing-xxl)
- **Gap between elements**: 10px (--spacing-lg)
- **Border radius**: 6px (--radius-sm)
- **Floating label position**: left-12px, top-0, px-4px

#### Colors:

- **Label (normal floating)**: text-base-tertiary (#889096)
- **Label (focused)**: border-brand-solid (#3c61dd)
- **Label (error)**: text-danger (#e54d2e)
- **Input text**: text-base-primary (#11181c)
- **Placeholder**: text-base-tertiary (#889096)
- **Border (default)**: border-base-primary (#d7dbdf)
- **Border (hover)**: border-base-primary_hover (#c1c8cd)
- **Border (focus)**: border-brand-solid (#3c61dd) - 2px
- **Border (error)**: border-danger-solid (#e54d2e) - 2px
- **Background**: bg-surface-base-primary (#ffffff)
- **Background (disabled)**: bg-surface-base-secondary (#f9fafb)

### Label Background "Notch" Effect

When the label floats, it needs a background to "cut through" the border. The implementation:

```typescript
floating: {
  true: 'top-0 -translate-y-1/2 scale-75 bg-background px-1', // bg-background + px-1 creates the notch
  false: 'top-1/2 -translate-y-1/2 scale-100 bg-transparent',
}
```

The `bg-background px-1` creates the "notch" by adding white background with padding that overlaps the border.

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/text-input-floating-label.stories.tsx`

**Required Stories**:

1. **Default Story**: Empty state with label as placeholder
2. **AllStates Story**: Grid showing all 9 visual states (Empty, Hovered, Focused, Typing, Filled, Disabled, Disabled-Filled, Error, Error-Filled)
3. **WithAddons Story**: Examples with left/right add-ons (icons, text)
4. **WithHint Story**: Input with hint text below (using Field component)
5. **WithError Story**: Input with error message below (using Field component)
6. **FormIntegration Story**: Real-world form example with multiple floating label inputs
7. **Controlled Story**: Demonstrates controlled vs uncontrolled usage
8. **AllCombinations Story**: Comprehensive grid showing all state combinations
9. **StandaloneVsField Story**: Demonstrates use cases for both components

**Story Requirements**:

- Use `satisfies Meta<typeof TextInputFloatingLabel>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set appropriate `parameters.layout` (centered)
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation (Molecule)

1. Analyze the existing TextInput component to understand the base patterns
2. Define the CVA variants for the floating label wrapper and input states
3. Create TypeScript interfaces for the component props
4. Implement the floating label animation logic using CSS transitions
5. Implement autofill detection logic

### Phase 2: Molecule Implementation

1. Create the `TextInputFloatingLabel` component with:
   - Wrapper container with position relative for floating label positioning
   - Floating label element with absolute positioning and background "notch"
   - Native input element with transparent background
   - Add-on support (left/right)
   - State management for focus, filled, autofill states
   - Autofill detection using CSS animation trick

2. Implement state-based styling with CVA compound variants:
   - Empty: Label inside input
   - Focused/Filled: Label floats above with animation
   - Error: Destructive colors (takes precedence)
   - Disabled: Muted styling

3. Handle the label animation:
   - Use CSS transforms for smooth animation: `transform: translateY() scale()`
   - Transition timing: `transition-all duration-150 ease-out`
   - Background "notch": `bg-background px-1`

### Phase 3: Organism Implementation

1. Create `TextInputFloatingLabelField` component:
   - Composition wrapper using TextInputFloatingLabel
   - ID management with `useId()`
   - Conditional Hint/ErrorMessage rendering
   - aria-describedby wiring

### Phase 4: Design System Integration & Documentation

**Export Configuration:**

- Export molecule from `src/ui/inputs/text-input-floating-label.tsx`
- Export organism from `src/ui/inputs/text-input-floating-label-field.tsx`
- Add to barrel export in `src/ui/inputs/index.ts`
- Components available via `import { TextInputFloatingLabel, TextInputFloatingLabelField } from '@/ui'`

**Storybook Documentation (REQUIRED):**

- Create comprehensive stories in `src/stories/inputs/text-input-floating-label.stories.tsx`
- Document all 9 states from Figma design
- Show add-on variations
- Demonstrate both standalone and field patterns
- Include interactive controls for all props

## Step by Step Tasks

### 1. Research and Setup

- Review the Figma design specifications carefully
- Study the existing TextInput and TextInputField component implementations
- Understand the CVA variant patterns used in the codebase
- Identify CSS transition approach for floating label animation

### 2. Create Molecule Component File

- Create `src/ui/inputs/text-input-floating-label.tsx`
- Define TypeScript interfaces for props:
  - `TextInputFloatingLabelProps` extending native input props
  - Support for: label, required, error, disabled, leftAddOn, rightAddOn
- Create CVA variants for:
  - Wrapper (border, background, focus states)
  - Floating label (position, color, size based on state) with compound variants
  - Input (typography, colors)

### 3. Implement Molecule Core Logic

- Create the component structure:
  ```
  <div> (wrapper - relative positioned, CVA variants)
    <label> (floating label - absolute positioned, CVA variants)
    <div> (input container - flex)
      {leftAddOn}
      <input>
      {rightAddOn}
    </div>
  </div>
  ```
- Implement state detection:
  - Internal state for focus tracking
  - Check for value to determine "filled" state
  - Autofill detection with CSS animation trick
- Implement placeholder interaction:
  - Only show placeholder when label is floating

### 4. Implement Autofill Detection

Add CSS for autofill detection:

```css
/* Add to globals.css or component styles */
@keyframes onAutoFillStart {
  from {
    /* empty */
  }
  to {
    /* empty */
  }
}

input:-webkit-autofill {
  animation-name: onAutoFillStart;
}
```

Implement detection in component:

```typescript
useEffect(() => {
  const checkAutofill = () => {
    const matches = inputRef.current?.matches(':-webkit-autofill');
    setIsAutofilled(Boolean(matches));
  };
  // Check immediately and after delay
  checkAutofill();
  const timer = setTimeout(checkAutofill, 500);
  // Listen for animation
  inputRef.current?.addEventListener('animationstart', handleAnimationStart);
  return () => {
    /* cleanup */
  };
}, []);
```

### 5. Create Organism Component File

- Create `src/ui/inputs/text-input-floating-label-field.tsx`
- Define TypeScript interfaces:
  - `TextInputFloatingLabelFieldProps` extending molecule props
  - Add: hint, errorMessage, hintProps, errorProps
- Implement composition:
  - Wrap TextInputFloatingLabel
  - Add ID management with useId()
  - Conditionally render Hint/ErrorMessage
  - Wire aria-describedby

### 6. Implement Visual States

**For Molecule:**

- Empty state: Label as placeholder (inside input area)
- Hovered state: Darker border
- Focused state: Brand border, floating label with brand color
- Typing state: Same as focused but with cursor
- Filled state: Floating label in muted color
- Disabled states: Secondary background, muted label
- Error states: Destructive colors for border and label

**For Organism:**

- Inherit all molecule states
- Add hint rendering (when no error)
- Add error message rendering (replaces hint)

### 7. Create Unit Tests for Molecule

- Create `src/ui/inputs/__tests__/text-input-floating-label.test.tsx`
- Test rendering:
  - Default props
  - With label, placeholder
  - With value (label floats)
- Test state variants:
  - Empty state (label inside)
  - Focused state (label floats)
  - Filled state (label stays floated)
  - Error state (destructive styles)
  - Disabled state (disabled attribute, styling)
- Test add-ons:
  - Left add-on renders
  - Right add-on renders
  - Both add-ons render
- Test ref forwarding
- Test event handling (onChange, onFocus, onBlur)
- Test accessibility (aria-invalid, aria-required)
- Test className merging

### 8. Create Unit Tests for Organism

- Create `src/ui/inputs/__tests__/text-input-floating-label-field.test.tsx`
- Test composition:
  - Renders TextInputFloatingLabel
  - Renders Hint when provided
  - Renders ErrorMessage when error
  - ErrorMessage replaces Hint
- Test ARIA wiring:
  - aria-describedby links to hint
  - aria-describedby links to error when error
- Test ID management:
  - Generated IDs are unique
  - Custom ID is used when provided

### 9. Create Storybook Stories

- Create `src/stories/inputs/text-input-floating-label.stories.tsx`
- Configure meta with comprehensive argTypes
- Create all required stories:
  - Default
  - AllStates
  - WithAddons
  - WithHint (Field)
  - WithError (Field)
  - FormIntegration
  - Controlled
  - AllCombinations
  - StandaloneVsField

### 10. Update Barrel Exports

- Add export to `src/ui/inputs/index.ts`:
  ```typescript
  export * from './text-input-floating-label';
  export * from './text-input-floating-label-field';
  ```

### 11. Run Validation Commands

- Execute all validation commands (see below)
- Fix any issues that arise
- Ensure zero errors before completion

## Testing Strategy

### Unit Tests for Molecule

1. **Rendering tests**:
   - Renders with default props
   - Renders with label, placeholder, value
   - Renders floating label in correct state based on focus/value
   - Renders add-ons correctly
   - Label background has "notch" effect when floating

2. **State tests**:
   - Label position changes on focus
   - Label stays floated when filled
   - Label floats when autofilled (mock test)
   - Error styles applied correctly
   - Disabled styles applied correctly
   - Label color changes based on state (focused=brand, error=danger, filled=tertiary)

3. **Interaction tests**:
   - onChange fires when typing
   - onFocus fires and label floats
   - onBlur fires and label returns if empty
   - Works in controlled and uncontrolled modes
   - Placeholder only shows when label is floating

4. **Accessibility tests**:
   - aria-invalid set when error
   - aria-required set when required
   - Label properly associated with input via htmlFor/id
   - Required indicator has aria-hidden and sr-only text

### Unit Tests for Organism

1. **Composition tests**:
   - Renders TextInputFloatingLabel
   - Passes all props to molecule
   - Renders Hint when hint prop provided
   - Renders ErrorMessage when errorMessage prop provided
   - ErrorMessage replaces Hint when both provided

2. **ARIA wiring tests**:
   - aria-describedby points to hint ID when hint shown
   - aria-describedby points to error ID when error shown
   - IDs are unique per instance

3. **Integration tests**:
   - Error state propagates to molecule
   - All molecule props work through field

### Edge Cases

1. Very long label text (truncation)
2. Very long placeholder text
3. Empty value vs whitespace value
4. Focus then immediate blur
5. Disabled with value
6. Error with value
7. Add-ons with error state
8. RTL support (if applicable)
9. Autofill browser behavior
10. Password manager interaction
11. Controlled with empty string vs undefined
12. Both hint and errorMessage provided

## Acceptance Criteria

### Functional Requirements

**Molecule (TextInputFloatingLabel):**

- ✅ Component implemented in `src/ui/inputs/text-input-floating-label.tsx`
- ✅ All 9 visual states from Figma work correctly
- ✅ Floating label animation smooth and performant (CSS transitions)
- ✅ Label background "notch" effect when floating
- ✅ Left and right add-ons supported
- ✅ Required indicator (\*) displayed correctly with accessibility
- ✅ Component forwards ref to input element
- ✅ Works in controlled and uncontrolled modes
- ✅ Autofill detection keeps label floated
- ✅ Placeholder only shows when label is floating

**Organism (TextInputFloatingLabelField):**

- ✅ Component implemented in `src/ui/inputs/text-input-floating-label-field.tsx`
- ✅ Composes TextInputFloatingLabel correctly
- ✅ Renders Hint atom when hint prop provided
- ✅ Renders ErrorMessage atom when errorMessage prop provided
- ✅ ErrorMessage replaces Hint when both provided
- ✅ ID management with useId()
- ✅ aria-describedby wiring to hint/error

### Testing Requirements

- ✅ Comprehensive unit tests for molecule with >90% coverage
- ✅ Comprehensive unit tests for organism with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/text-input-floating-label.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **AllStates story showing all 9 visual states**
- ✅ **WithAddons story with various add-on configurations**
- ✅ **WithHint and WithError stories (using Field component)**
- ✅ **FormIntegration story with real-world example**
- ✅ **AllCombinations comprehensive grid**
- ✅ **StandaloneVsField story showing both patterns**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Both components exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Both components exported through root barrel (`src/ui/index.ts`)
- ✅ Components can be imported via `import { TextInputFloatingLabel, TextInputFloatingLabelField } from '@/ui'`

### Code Quality

- ✅ Zero TypeScript errors: `npm run type-check`
- ✅ Zero ESLint warnings: `npm run lint`
- ✅ Build succeeds: `npm run build`

## Validation Commands

⚠️ **CRITICAL**: Execute EVERY command below. All must pass with zero errors.

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across components, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run molecule tests**: `npm test -- text-input-floating-label.test`
   - Expected: All molecule tests pass with >90% coverage
   - Validates: Molecule functionality and edge cases

4. **Run organism tests**: `npm test -- text-input-floating-label-field.test`
   - Expected: All organism tests pass with >90% coverage
   - Validates: Organism composition and ARIA wiring

5. **Run full test suite**: `npm run test:run`
   - Expected: All tests pass with zero regressions
   - Validates: No breaking changes to existing components

6. **Build verification**: `npm run build`
   - Expected: Build completes successfully
   - Validates: Production bundle compatibility

7. **Storybook build** (REQUIRED): `npm run build-storybook`
   - Expected: Storybook builds successfully, all stories compile
   - Validates: Visual documentation is complete and error-free
   - Verify: Stories appear in build output with correct paths

**All 7 commands MUST pass before the components are considered complete.**

## Notes

### Animation Implementation

The floating label animation should use CSS transitions for smooth performance. Key considerations:

1. **Transform-based animation**: Use `transform: translateY() scale()` for GPU-accelerated animation
2. **Transition timing**: Use `transition-all duration-150 ease-out` for snappy, natural feel
3. **Label background "notch"**: Use `bg-background px-1` when floating to create the cut-through effect

### Browser Autofill Handling (CRITICAL)

Browser autofill can pre-fill inputs before React hydration. Implementation strategy:

1. **CSS Animation Detection**:

```css
@keyframes onAutoFillStart {
  from {
    /* empty */
  }
  to {
    /* empty */
  }
}

input:-webkit-autofill {
  animation-name: onAutoFillStart;
}
```

2. **JavaScript Detection**:

```typescript
useEffect(() => {
  const checkAutofill = () => {
    const matches = inputRef.current?.matches(':-webkit-autofill');
    setIsAutofilled(Boolean(matches));
  };

  checkAutofill();
  const timer = setTimeout(checkAutofill, 500);

  inputRef.current?.addEventListener('animationstart', (e) => {
    if (e.animationName === 'onAutoFillStart') {
      setIsAutofilled(true);
    }
  });

  return () => clearTimeout(timer);
}, []);
```

### Placeholder Interaction

When label is NOT floating: No placeholder shown (label acts as placeholder)
When label IS floating: Show placeholder inside input

```typescript
<input
  placeholder={shouldFloat ? props.placeholder : undefined}
  {...props}
/>
```

### Accessibility Considerations

1. The label must always be associated with the input via `htmlFor`/`id`
2. When floating, the label retains its semantic meaning (it's still a `<label>` element)
3. Required indicator implementation:
   ```tsx
   {
     required && (
       <>
         <span aria-hidden="true" className="text-danger ml-0.5">
           *
         </span>
         <span className="sr-only">required</span>
       </>
     );
   }
   ```
4. Error messages linked via `aria-describedby` in Field component
5. Error messages use `role="alert"` (from ErrorMessage component)

### Questions Resolved from Evaluation

1. **Autofill Behavior:** Label stays floated after autofill. If user clears the autofilled value, label returns to placeholder position (standard focus/value detection handles this).

2. **Placeholder Text:** Placeholder is ONLY visible when label is in the floating state. When label is not floating, it acts as the placeholder.

3. **Size Variants:** Deferred to future enhancement. Current implementation uses single size from Figma (16px → 12px).

4. **Error State Animation:** Label changes to red immediately when error prop is set. No delay or animation required for color change.

5. **RTL Support:** Deferred to future enhancement if needed.

### Why Two Components?

Following the established `TextInput` / `TextInputField` pattern provides:

1. **Flexibility**: Standalone molecule for custom layouts
2. **Consistency**: Same architecture as existing input components
3. **Reusability**: Molecule usable without Field overhead
4. **Separation of Concerns**: Input logic separate from form field composition
