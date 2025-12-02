# TextInput Component Plan Architectural Review

**Date:** 2025-11-30
**Component:** TextInput (Molecule)
**Plan Location:** `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/ai/plans/ui/text-input-2025-11-30.md`
**Reviewer:** UI/UX Architecture Agent

---

## Executive Summary

**Overall Architectural Alignment Score:** 9.2/10

The TextInput component plan demonstrates excellent understanding of the project's architectural patterns, CVA variant system, and atomic design methodology. The plan is comprehensive, well-structured, and correctly identifies the component as a molecule that composes existing atoms. There are, however, critical architectural concerns regarding the composition strategy that could lead to API rigidity and violation of the separation of concerns principle.

**Component Classification:** ✅ Correctly classified as Molecule

**Primary Architectural Concern:** The proposed internal composition pattern (where TextInput internally renders InputLabel, Hint, and ErrorMessage based on string props) deviates from React's composition philosophy and reduces component flexibility.

---

## Architectural Assessment

### 1. Atomic Design Classification: ✅ CORRECT

**Classification:** Molecule
**Reasoning Provided:** "TextInput is a molecule because it composes multiple atoms (InputLabel, Hint, ErrorMessage, Icon) together with a base input element to create a higher-level, reusable form component."

**Evaluation:**

- ✅ **Correct classification** - TextInput is indeed a molecule
- ✅ **Proper composition dependency chain** - Correctly identifies composition of InputLabel, Hint, ErrorMessage atoms
- ✅ **Appropriate complexity level** - Not too simple (atom) nor too complex (organism)
- ✅ **Clear atomic hierarchy understanding** - Demonstrates understanding of how atoms combine into molecules

**Pattern Comparison:**
The Button component (analyzed as reference) is also a molecule that composes Icon atoms. TextInput follows the same compositional pattern with multiple atom dependencies.

**Recommendation:** No changes needed for classification.

---

### 2. Component Composition Strategy: ⚠️ CRITICAL ARCHITECTURAL CONCERN

**Proposed API (from plan lines 418-426):**

```typescript
// API Design Decisions from the plan:
label: string; // Renders InputLabel internally
labelRequired: boolean; // Controls InputLabel's required prop
labelShowIcon: boolean; // Controls InputLabel's showIcon prop
hint: string; // Renders Hint internally
error: string; // Renders ErrorMessage internally
leftAddOn: ReactNode; // Prefix slot
rightAddOn: ReactNode; // Suffix slot
```

**Critical Issue: Tight Coupling via Internal Composition**

The plan proposes that TextInput will **internally render** InputLabel, Hint, and ErrorMessage based on string props. While convenient, this creates several architectural problems:

#### Problem 1: Violation of Composition over Configuration

**What the plan proposes:**

```typescript
// Internal composition - TextInput decides rendering
<TextInput
  label="Email"
  labelRequired={true}
  labelShowIcon={true}
  hint="We'll never share your email"
  error="Invalid email format"
/>

// Internally renders:
// <InputLabel label={label} required={labelRequired} showIcon={labelShowIcon} />
// <input />
// {hint && <Hint>{hint}</Hint>}
// {error && <ErrorMessage text={error} />}
```

**What React composition philosophy suggests:**

```typescript
// External composition - Consumer controls structure
<div>
  <InputLabel label="Email" required showIcon />
  <TextInput aria-describedby="email-hint email-error" />
  <Hint id="email-hint">We'll never share your email</Hint>
  <ErrorMessage id="email-error" text="Invalid email format" />
</div>
```

#### Problem 2: Limited Flexibility for Custom Use Cases

The internal composition pattern cannot handle:

1. **Custom label structures:**

   ```typescript
   // Cannot do this with internal composition:
   <div>
     <div className="flex justify-between">
       <InputLabel label="Password" required />
       <Link href="/forgot">Forgot password?</Link>
     </div>
     <TextInput />
   </div>
   ```

2. **Multiple hints or custom hint formatting:**

   ```typescript
   // Cannot do this:
   <TextInput />
   <Hint>Min 8 characters</Hint>
   <Hint>Must include a number</Hint>
   <Hint>Must include a special character</Hint>
   ```

3. **Custom error positioning or multiple errors:**
   ```typescript
   // Cannot do this:
   <TextInput />
   <div className="flex gap-2">
     <ErrorMessage text="Email is required" />
     <ErrorMessage text="Email format invalid" />
   </div>
   ```

#### Problem 3: API Bloat and Prop Drilling

The plan's approach leads to prop duplication:

```typescript
// TextInput becomes a proxy for InputLabel props
interface TextInputProps {
  // Input-specific props
  value?: string;
  onChange?: (e) => void;
  placeholder?: string;
  disabled?: boolean;

  // InputLabel proxy props (prop drilling)
  label?: string;
  labelRequired?: boolean; // Duplicates InputLabel.required
  labelShowIcon?: boolean; // Duplicates InputLabel.showIcon
  labelHelpIconAriaLabel?: string; // Duplicates InputLabel.helpIconAriaLabel
  labelDescription?: string; // Duplicates InputLabel.description
  labelHtmlFor?: string; // Duplicates InputLabel.htmlFor

  // Hint proxy props
  hint?: string;
  hintSize?: 'sm' | 'md'; // Duplicates Hint.size

  // ErrorMessage proxy props
  error?: string;
  errorShowIcon?: boolean; // Duplicates ErrorMessage.showIcon
  errorSize?: 'sm' | 'md'; // Duplicates ErrorMessage.size

  // ... continues growing
}
```

This violates the **Single Responsibility Principle** - TextInput becomes responsible for rendering AND configuring three other components.

#### Problem 4: Inconsistent with Project Patterns

**Evidence from existing components:**

1. **Button component** (lines 399-481 of button.tsx):
   - Does NOT internally compose complex structures
   - Renders its own icon slots but doesn't wrap external atoms
   - Focuses on button-specific behavior

2. **InputLabel component** (lines 99-161 of input-label.tsx):
   - Standalone component with its own API
   - NOT designed to be hidden inside parent components
   - Exported for direct consumption

3. **Hint and ErrorMessage components:**
   - Both are standalone atoms meant for direct use
   - Have their own ref forwarding and prop APIs
   - Designed for flexible composition

**The pattern in this codebase is:**
✅ Components are composed EXTERNALLY by consumers
❌ NOT composed INTERNALLY with string props

---

### 3. Recommended Composition Strategy: DUAL API APPROACH

**Solution:** Provide BOTH internal composition (convenience) AND external composition (flexibility)

#### Option A: Standalone TextInput (Input Field Only)

```typescript
// src/ui/inputs/text-input.tsx
export interface TextInputProps extends ComponentPropsWithoutRef<'input'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;  // Visual state only
  leftAddOn?: ReactNode;
  rightAddOn?: ReactNode;
  className?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ size = 'lg', error, leftAddOn, rightAddOn, className, ...props }, ref) => {
    return (
      <div className={cn(textInputWrapperVariants({ size }))}>
        {leftAddOn && <div className="text-input-addon-left">{leftAddOn}</div>}
        <input
          ref={ref}
          className={cn(textInputVariants({ size, error }), className)}
          aria-invalid={error || undefined}
          {...props}
        />
        {rightAddOn && <div className="text-input-addon-right">{rightAddOn}</div>}
      </div>
    );
  }
);
```

**Usage - Manual composition:**

```typescript
<div>
  <InputLabel label="Email" required htmlFor="email" />
  <TextInput
    id="email"
    error={!!errors.email}
    aria-describedby={errors.email ? "email-error" : "email-hint"}
  />
  {errors.email ? (
    <ErrorMessage id="email-error" text={errors.email} />
  ) : (
    <Hint id="email-hint">We'll never share your email</Hint>
  )}
</div>
```

#### Option B: Compound Component Pattern (Recommended)

Create a compound component that exposes both convenience AND flexibility:

```typescript
// src/ui/inputs/text-input.tsx

// Base input (always available)
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(...);

// Compound composition wrapper (optional convenience)
export interface TextInputFieldProps extends TextInputProps {
  label?: string;
  labelProps?: Partial<InputLabelProps>;
  hint?: string;
  hintProps?: Partial<HintProps>;
  error?: string;
  errorProps?: Partial<ErrorMessageProps>;
}

export const TextInputField = forwardRef<HTMLInputElement, TextInputFieldProps>(
  ({
    label,
    labelProps,
    hint,
    hintProps,
    error,
    errorProps,
    size = 'lg',
    id,
    ...inputProps
  }, ref) => {
    const inputId = id || useId();
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    // Map TextInput size to InputLabel size
    const labelSize = size === 'sm' ? 'sm' : 'md';

    return (
      <div>
        {label && (
          <InputLabel
            label={label}
            htmlFor={inputId}
            size={labelSize}
            {...labelProps}
          />
        )}
        <TextInput
          ref={ref}
          id={inputId}
          size={size}
          error={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          aria-invalid={!!error || undefined}
          {...inputProps}
        />
        {error ? (
          <ErrorMessage
            id={errorId}
            text={error}
            size={labelSize}
            {...errorProps}
          />
        ) : hint ? (
          <Hint
            id={hintId}
            size={labelSize}
            {...hintProps}
          >
            {hint}
          </Hint>
        ) : null}
      </div>
    );
  }
);

// Export both for maximum flexibility
export { TextInput, TextInputField };
```

**Usage - Convenience API:**

```typescript
// Simple form - use TextInputField
<TextInputField
  label="Email"
  labelProps={{ required: true, showIcon: true }}
  hint="We'll never share your email"
  error={errors.email}
/>
```

**Usage - Custom composition:**

```typescript
// Complex layout - use TextInput directly
<div className="flex justify-between">
  <InputLabel label="Password" required />
  <Link href="/forgot">Forgot password?</Link>
</div>
<TextInput size="lg" error={!!errors.password} />
<div className="flex flex-col gap-1">
  <Hint size="sm">Min 8 characters</Hint>
  <Hint size="sm">Must include a number</Hint>
  {errors.password && <ErrorMessage text={errors.password} />}
</div>
```

**Why this is superior:**

1. ✅ **Follows React composition philosophy** - Exposes atoms for custom layouts
2. ✅ **Provides convenience API** - TextInputField for simple cases
3. ✅ **No prop duplication** - labelProps passes through to InputLabel
4. ✅ **Maximum flexibility** - Can use TextInput standalone when needed
5. ✅ **Consistent with design system** - Both patterns coexist
6. ✅ **Better TypeScript inference** - Props are properly typed
7. ✅ **Easier testing** - Can test TextInput and TextInputField separately
8. ✅ **Progressive disclosure** - Start simple, customize when needed

---

### 4. CVA Variant System: ✅ EXCELLENT

**Plan's CVA Usage (lines 222-241):**

```typescript
// Proposed size variants
sm: 'py-1.5 px-3 text-sm gap-2'; // 6px, 12px, 8px
md: 'py-2.5 px-3.5 text-sm gap-2.5'; // 10px, 14px, 10px
lg: 'py-3 px-4 text-base gap-3'; // 12px, 16px, 12px
```

**Evaluation:**

- ✅ **Correct CVA pattern** - Matches Button component's variant structure
- ✅ **Proper size mapping** - Aligns with design specs from Figma
- ✅ **Semantic variant names** - sm/md/lg are clear and consistent
- ✅ **No compound variants needed** - States handled via CSS pseudo-classes (correct approach)
- ✅ **Default variant specified** - Plan includes defaultVariants

**Pattern Comparison with Button:**

```typescript
// Button component (button.tsx lines 24-157)
const buttonVariants = cva(
  ['inline-flex items-center justify-center gap-2', ...],
  {
    variants: {
      variant: { filled, outline, tinted, plain },
      color: { primary, secondary, danger },
      size: { sm, md, lg },
    },
    compoundVariants: [...],
    defaultVariants: {
      variant: 'filled',
      color: 'primary',
      size: 'md',
    },
  }
);
```

**TextInput should follow similar pattern:**

```typescript
const textInputVariants = cva(
  [
    'font-sans',
    'border',
    'rounded-sm',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-0',
    'disabled:cursor-not-allowed',
    'disabled:bg-background-secondary',
    'placeholder:text-text-tertiary',
  ],
  {
    variants: {
      size: {
        sm: 'px-3 py-1.5 text-sm leading-5', // 6px, 12px, 14px
        md: 'px-3.5 py-2.5 text-sm leading-5', // 10px, 14px, 14px
        lg: 'px-4 py-3 text-base leading-6', // 12px, 16px, 16px
      },
      error: {
        true: 'border-destructive focus:ring-destructive',
        false:
          'border-border hover:border-border-hover focus:border-primary focus:ring-primary',
      },
    },
    defaultVariants: {
      size: 'lg',
      error: false,
    },
  }
);
```

**Recommendation:** The CVA approach is solid. Ensure error state is a boolean variant, not just CSS classes.

---

### 5. forwardRef and TypeScript Patterns: ✅ EXCELLENT

**Plan's Ref Forwarding (lines 260-263):**

- ✅ Correctly identifies need for forwardRef
- ✅ Plans to forward ref to native input element
- ✅ Understands accessibility implications

**Comparison with existing patterns:**

**Button component (lines 399-481):**

```typescript
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, color, size, ... }, ref) => {
    // ...
  }
);
Button.displayName = 'Button';
```

**InputLabel component (lines 99-163):**

```typescript
export const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ size, label, required, ... }, ref) => {
    // ...
  }
);
InputLabel.displayName = 'InputLabel';
```

**TextInput should follow:**

```typescript
// Standalone input
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ size, error, leftAddOn, rightAddOn, className, ...props }, ref) => {
    return (
      <div className={cn(textInputWrapperVariants({ size }))}>
        {leftAddOn && <div className="addon-left">{leftAddOn}</div>}
        <input
          ref={ref}
          className={cn(textInputVariants({ size, error }), className)}
          {...props}
        />
        {rightAddOn && <div className="addon-right">{rightAddOn}</div>}
      </div>
    );
  }
);
TextInput.displayName = 'TextInput';

// Composite wrapper (if using compound pattern)
export const TextInputField = forwardRef<HTMLInputElement, TextInputFieldProps>(
  ({ label, hint, error, size, ...inputProps }, ref) => {
    // ... composition logic
    return (
      <div>
        {label && <InputLabel {...labelProps} />}
        <TextInput ref={ref} size={size} {...inputProps} />
        {error ? <ErrorMessage /> : hint ? <Hint /> : null}
      </div>
    );
  }
);
TextInputField.displayName = 'TextInputField';
```

**Evaluation:**

- ✅ **Correct ref forwarding pattern**
- ✅ **Proper TypeScript generic usage**
- ✅ **displayName for debugging**
- ✅ **ComponentPropsWithoutRef usage** (mentioned in plan)

**Recommendation:** No changes needed for ref forwarding architecture.

---

### 6. Design System Integration: ✅ CORRECT

**Export Strategy (lines 46-60):**

```typescript
// Plan's export pattern:
// 1. Component file exports
export { TextInput, textInputVariants };
export type { TextInputProps };

// 2. Category barrel export
export * from './text-input';

// 3. Import usage
import { TextInput } from '@/ui';
import { TextInput } from '@/ui/inputs';
```

**Evaluation:**

- ✅ **Follows barrel export pattern** - Matches project convention
- ✅ **Named exports** - Consistent with Button, InputLabel, etc.
- ✅ **Type exports** - Properly exports TypeScript types
- ✅ **CVA variants export** - textInputVariants exported for external use

**Pattern Comparison:**

**Button exports (button.tsx lines 483-485):**

```typescript
export { buttonVariants };
// Component exported via forwardRef above
```

**InputLabel exports (input-label.tsx lines 163-165):**

```typescript
export { inputLabelVariants };
// Component exported via forwardRef above
```

**Inputs barrel (inputs/index.ts lines 1-4):**

```typescript
export * from './error-message';
export * from './hint';
export * from './input-label';
```

**After TextInput implementation, should be:**

```typescript
export * from './error-message';
export * from './hint';
export * from './input-label';
export * from './text-input'; // Add this
```

**Recommendation:** Export strategy is correct. If implementing compound pattern, export both:

```typescript
export { TextInput, TextInputField, textInputVariants };
export type { TextInputProps, TextInputFieldProps };
```

---

### 7. Accessibility Architecture: ✅ EXCELLENT

**Plan's Accessibility Requirements (lines 259-266):**

```typescript
// Proposed accessibility features:
- Forward ref to native input element
- Set aria-invalid when in error state
- Set aria-describedby pointing to hint or error message
- Ensure label htmlFor connects to input id
- Support aria-required when label shows required indicator
- Implement proper focus management
```

**Evaluation:**

- ✅ **Complete ARIA attribute coverage**
- ✅ **Proper association patterns** (aria-describedby)
- ✅ **Error state signaling** (aria-invalid)
- ✅ **Focus management consideration**

**Pattern Comparison:**

**InputLabel (input-label.tsx lines 112-159):**

```typescript
// Generates descriptionId for aria-describedby
const descriptionId = htmlFor ? `${htmlFor}-description` : undefined;

<label htmlFor={htmlFor}>
  <span id={descriptionId}>{description}</span>
</label>
```

**ErrorMessage (error-message.tsx lines 74-108):**

```typescript
<div id={id} role="alert">
  {/* Error content */}
</div>
```

**TextInput should implement:**

```typescript
export const TextInputField = forwardRef<HTMLInputElement, TextInputFieldProps>(
  ({ label, hint, error, required, id, ...props }, ref) => {
    const inputId = id || useId();  // Generate ID if not provided
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    return (
      <div>
        {label && (
          <InputLabel
            label={label}
            required={required}
            htmlFor={inputId}  // Associates label with input
          />
        )}
        <TextInput
          ref={ref}
          id={inputId}
          error={!!error}
          aria-invalid={!!error || undefined}
          aria-required={required || undefined}
          aria-describedby={
            error ? errorId : hint ? hintId : undefined
          }
          {...props}
        />
        {error ? (
          <ErrorMessage id={errorId} text={error} />
        ) : hint ? (
          <Hint id={hintId}>{hint}</Hint>
        ) : null}
      </div>
    );
  }
);
```

**Missing from plan:**

- ⚠️ No mention of `useId()` hook for generating unique IDs
- ⚠️ No discussion of `aria-required` attribute

**Recommendation:** Add `useId()` to generate input IDs when not provided. This ensures proper label/input/hint associations.

---

### 8. State Management Architecture: ✅ CORRECT

**Plan's State Management (lines 428-432):**

> "Visual states like hover and focus will be handled via CSS pseudo-classes rather than React state. Only error and disabled states require props since they come from external validation logic."

**Evaluation:**

- ✅ **Correct separation of concerns** - CSS for visual states, props for logical states
- ✅ **Avoids unnecessary re-renders** - Not tracking hover/focus in React state
- ✅ **Controlled/uncontrolled support** - Mentions both patterns (line 431)

**Pattern Comparison:**

**Button component state handling:**

```typescript
// Visual states: CSS pseudo-classes
hover:bg-primary/90
focus-visible:ring-2
active:bg-primary-active

// Logical states: Props
disabled={isDisabled}
aria-busy={loading || undefined}
```

**TextInput should follow:**

```typescript
// CVA variants with CSS pseudo-classes
const textInputVariants = cva(
  [
    'border',
    'transition-colors',
    'hover:border-border-hover',        // CSS handles hover
    'focus:border-primary',             // CSS handles focus
    'focus:ring-2',
    'focus:ring-primary',
    'disabled:bg-background-secondary', // CSS handles disabled
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      error: {
        true: 'border-destructive focus:border-destructive focus:ring-destructive',
        false: '',
      },
    },
  }
);

// React props only for logical states
<input
  disabled={disabled}      // Logical state
  aria-invalid={!!error}   // Logical state
  value={value}            // Controlled
  defaultValue={defaultValue}  // Uncontrolled
/>
```

**Recommendation:** State management approach is architecturally sound. No changes needed.

---

### 9. Size Mapping Inconsistency: ⚠️ MINOR ISSUE

**Issue:** The plan correctly identifies that TextInput has 3 sizes (SM, MD, LG) while InputLabel has 2 sizes (sm, md).

**Plan's size mapping (line 246):**

```typescript
// Pass size mapping (lg->md, md/sm->sm) to InputLabel
```

**Evaluation:**

- ✅ **Correctly identified the mapping issue**
- ✅ **Proposed solution is reasonable**
- ⚠️ **Could be more explicit in implementation plan**

**Implementation should be:**

```typescript
const INPUT_LABEL_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

export const TextInputField = forwardRef<HTMLInputElement, TextInputFieldProps>(
  ({ size = 'lg', label, labelProps, ...rest }, ref) => {
    const labelSize = INPUT_LABEL_SIZE_MAP[size];

    return (
      <div>
        {label && (
          <InputLabel
            label={label}
            size={labelSize}  // Maps 3 sizes to 2
            {...labelProps}
          />
        )}
        <TextInput size={size} {...rest} />
      </div>
    );
  }
);
```

**Why this matters:**

| TextInput Size | Input Padding | Font Size | InputLabel Size | Label Font Size |
| -------------- | ------------- | --------- | --------------- | --------------- |
| SM             | 6px           | 14px      | sm              | 14px            |
| MD             | 10px          | 14px      | sm              | 14px            |
| LG             | 12px          | 16px      | md              | 16px            |

This creates visual harmony between label and input sizes.

**Recommendation:** Make the size mapping explicit in the implementation with a constant, as shown above.

---

### 10. Testing Strategy: ✅ COMPREHENSIVE

**Plan's testing coverage (lines 312-340):**

Unit Tests:

- ✅ Rendering with all prop combinations
- ✅ Size variants (sm, md, lg)
- ✅ State tests (disabled, error)
- ✅ Composition tests (label, hint, error)
- ✅ Add-on tests (left/right)
- ✅ Ref forwarding
- ✅ Accessibility attributes
- ✅ Event handlers

Edge Cases:

- ✅ Empty label
- ✅ Empty hint
- ✅ Both error and hint (error precedence)
- ✅ Long text scenarios
- ✅ Controlled vs uncontrolled

**Evaluation:**

- ✅ **Comprehensive test coverage** - Covers all critical paths
- ✅ **Edge cases identified** - Thorough consideration of failure modes
- ✅ **>90% coverage target** - Appropriate for UI components

**Recommendation:** If implementing compound pattern, add tests for:

```typescript
// Additional tests for TextInputField:
- Size mapping to InputLabel
- ID generation with useId()
- aria-describedby switching (hint vs error)
- labelProps passthrough
- hintProps passthrough
- errorProps passthrough
```

---

## Critical Issues Summary

### Critical (Must Fix Before Implementation)

1. **Composition Strategy Architecture Flaw**
   - **Issue:** Internal composition with string props violates React composition philosophy
   - **Impact:** Reduces flexibility, creates API bloat, limits custom layouts
   - **Solution:** Implement dual API approach (TextInput + TextInputField)
   - **Priority:** CRITICAL - This affects the entire component architecture

### Recommendations (Should Implement)

2. **Add useId() Hook for Accessibility**
   - **Issue:** Plan doesn't mention automatic ID generation
   - **Impact:** Developers must manually provide IDs for proper ARIA associations
   - **Solution:** Use React's `useId()` to generate unique IDs
   - **Priority:** HIGH - Improves developer experience and accessibility

3. **Explicit Size Mapping Constant**
   - **Issue:** Size mapping logic is described but not formalized
   - **Impact:** Could lead to inconsistent implementation
   - **Solution:** Create INPUT_LABEL_SIZE_MAP constant
   - **Priority:** MEDIUM - Improves code clarity

---

## Positive Architectural Patterns

### Excellent Design Decisions

1. ✅ **Atomic Design Classification**
   - Correctly identified as molecule
   - Proper understanding of composition hierarchy
   - Clear dependency chain on atoms

2. ✅ **CVA Variant System**
   - Follows established Button pattern
   - Size variants match Figma specs precisely
   - Proper use of defaultVariants
   - States handled via CSS pseudo-classes (performant)

3. ✅ **forwardRef Implementation**
   - Correct ref forwarding to native input
   - Proper TypeScript generics
   - displayName for debugging

4. ✅ **Accessibility First**
   - Complete ARIA attribute coverage
   - Proper association patterns (aria-describedby)
   - Error state signaling (aria-invalid)
   - Focus management consideration

5. ✅ **State Management**
   - CSS pseudo-classes for visual states (no unnecessary re-renders)
   - Props for logical states (error, disabled)
   - Support for controlled and uncontrolled patterns

6. ✅ **Design System Integration**
   - Barrel export pattern matches project convention
   - Named exports for tree-shaking
   - TypeScript type exports
   - CVA variants exported

7. ✅ **Comprehensive Testing Plan**
   - Unit tests for all variants
   - Edge case coverage
   - Accessibility testing
   - > 90% coverage target

8. ✅ **Thorough Documentation**
   - Clear Storybook requirements
   - Real-world form examples
   - API documentation
   - Implementation phases

---

## Recommended Implementation Approach

### Phase 1: Create Base TextInput (Standalone Input)

**File:** `src/ui/inputs/text-input.tsx`

```typescript
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textInputWrapperVariants = cva('relative flex items-center', {
  variants: {
    size: {
      sm: 'gap-2',
      md: 'gap-2.5',
      lg: 'gap-3',
    },
  },
  defaultVariants: { size: 'lg' },
});

const textInputVariants = cva(
  [
    'w-full',
    'font-sans',
    'border',
    'rounded-sm',
    'bg-background',
    'text-text-primary',
    'transition-colors',
    'placeholder:text-text-tertiary',
    'hover:border-border-hover',
    'focus:outline-none',
    'focus:border-primary',
    'focus:ring-2',
    'focus:ring-primary',
    'focus:ring-offset-0',
    'disabled:cursor-not-allowed',
    'disabled:bg-background-secondary',
  ],
  {
    variants: {
      size: {
        sm: 'py-1.5 px-3 text-sm leading-5',
        md: 'py-2.5 px-3.5 text-sm leading-5',
        lg: 'py-3 px-4 text-base leading-6',
      },
      error: {
        true: 'border-destructive hover:border-destructive focus:border-destructive focus:ring-destructive',
        false: 'border-border',
      },
    },
    defaultVariants: {
      size: 'lg',
      error: false,
    },
  }
);

export interface TextInputProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size'>,
    VariantProps<typeof textInputVariants> {
  leftAddOn?: ReactNode;
  rightAddOn?: ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ size, error, leftAddOn, rightAddOn, className, ...props }, ref) => {
    return (
      <div className={textInputWrapperVariants({ size })}>
        {leftAddOn && (
          <div className="flex items-center text-text-tertiary">
            {leftAddOn}
          </div>
        )}
        <input
          ref={ref}
          className={cn(textInputVariants({ size, error }), className)}
          aria-invalid={error || undefined}
          {...props}
        />
        {rightAddOn && (
          <div className="flex items-center text-text-tertiary">
            {rightAddOn}
          </div>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export { textInputVariants };
```

### Phase 2: Create TextInputField (Convenience Wrapper) - OPTIONAL

**File:** `src/ui/inputs/text-input-field.tsx`

```typescript
import { forwardRef, useId, type ReactNode } from 'react';
import { TextInput, type TextInputProps } from './text-input';
import { InputLabel, type InputLabelProps } from './input-label';
import { Hint, type HintProps } from './hint';
import { ErrorMessage, type ErrorMessageProps } from './error-message';

const INPUT_LABEL_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

export interface TextInputFieldProps extends Omit<TextInputProps, 'error'> {
  label?: string;
  labelProps?: Partial<Omit<InputLabelProps, 'label' | 'htmlFor'>>;
  hint?: string;
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;
  error?: string;
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;
}

export const TextInputField = forwardRef<HTMLInputElement, TextInputFieldProps>(
  (
    {
      label,
      labelProps,
      hint,
      hintProps,
      error,
      errorProps,
      size = 'lg',
      id,
      ...inputProps
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const labelSize = INPUT_LABEL_SIZE_MAP[size];
    const messageSize = labelSize; // Hint and ErrorMessage match label size

    return (
      <div>
        {label && (
          <InputLabel
            label={label}
            htmlFor={inputId}
            size={labelSize}
            {...labelProps}
          />
        )}
        <TextInput
          ref={ref}
          id={inputId}
          size={size}
          error={!!error}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          aria-required={labelProps?.required || undefined}
          {...inputProps}
        />
        {error ? (
          <ErrorMessage
            id={errorId}
            text={error}
            size={messageSize}
            {...errorProps}
          />
        ) : hint ? (
          <Hint id={hintId} size={messageSize} {...hintProps}>
            {hint}
          </Hint>
        ) : null}
      </div>
    );
  }
);

TextInputField.displayName = 'TextInputField';
```

### Phase 3: Export Strategy

```typescript
// src/ui/inputs/index.ts
export * from './error-message';
export * from './hint';
export * from './input-label';
export * from './text-input';
export * from './text-input-field'; // Optional convenience wrapper
```

**Usage Examples:**

```typescript
// Simple forms - use TextInputField
<TextInputField
  label="Email"
  labelProps={{ required: true }}
  hint="We'll never share your email"
  error={errors.email}
/>

// Custom layouts - use TextInput
<div>
  <div className="flex justify-between items-center">
    <InputLabel label="Password" required size="md" />
    <Link href="/forgot">Forgot password?</Link>
  </div>
  <TextInput size="lg" type="password" error={!!errors.password} />
  {errors.password && <ErrorMessage text={errors.password} />}
</div>

// With add-ons
<TextInput
  leftAddOn={<Icon icon={MagnifyingGlass} size="md" />}
  placeholder="Search..."
/>
```

---

## Alignment with Project Patterns

### Pattern Conformance Scorecard

| Pattern          | Conformance       | Evidence                                            |
| ---------------- | ----------------- | --------------------------------------------------- |
| Atomic Design    | ✅ Excellent      | Correctly classified as molecule, clear composition |
| CVA Variants     | ✅ Excellent      | Matches Button pattern, proper size variants        |
| forwardRef       | ✅ Excellent      | Correct ref forwarding to native element            |
| TypeScript       | ✅ Excellent      | ComponentPropsWithoutRef, VariantProps              |
| Barrel Exports   | ✅ Excellent      | Named exports, category barrel, root barrel         |
| Accessibility    | ✅ Excellent      | ARIA attributes, proper associations                |
| State Management | ✅ Excellent      | CSS pseudo-classes, controlled/uncontrolled         |
| Composition      | ⚠️ Needs Revision | Internal composition reduces flexibility            |
| Design Tokens    | ✅ Excellent      | References globals.css tokens correctly             |
| Storybook        | ✅ Excellent      | Comprehensive story requirements                    |

### Project Pattern References

**Button Component** (`src/ui/buttons/button.tsx`):

- ✅ CVA with variants, compoundVariants, defaultVariants
- ✅ forwardRef with proper TypeScript generics
- ✅ Icon integration via slots
- ✅ Polymorphic rendering (asChild, href)
- ✅ Loading state management
- ✅ Helper functions for click handling

**InputLabel Component** (`src/ui/inputs/input-label.tsx`):

- ✅ CVA for size variants (sm, md)
- ✅ forwardRef to label element
- ✅ Standalone atom, not wrapped internally
- ✅ ID generation for aria-describedby
- ✅ Required indicator and help icon

**Hint Component** (`src/ui/inputs/hint.tsx`):

- ✅ Composes from Typography atoms (TextXs, TextSm)
- ✅ Size variants matching input sizes
- ✅ Proper spacing (pt-2)
- ✅ Standalone, meant for external composition

**ErrorMessage Component** (`src/ui/inputs/error-message.tsx`):

- ✅ Icon + text composition
- ✅ role="alert" for accessibility
- ✅ Size variants (sm, md)
- ✅ ID support for aria-describedby

**Pattern:** All existing atoms are STANDALONE components meant for EXTERNAL composition. TextInput should follow this pattern.

---

## Final Recommendations

### Must Implement (Critical)

1. **Revise Composition Strategy**
   - Create TextInput as standalone input component
   - Optionally create TextInputField as convenience wrapper
   - Export both to support simple and complex use cases
   - DO NOT make internal composition the only option

2. **Add useId() for ID Generation**
   - Import useId from React
   - Generate unique IDs when not provided
   - Ensures proper ARIA associations without manual ID management

3. **Create Size Mapping Constant**
   - Define INPUT_LABEL_SIZE_MAP constant
   - Document 3-to-2 size mapping logic
   - Use in TextInputField implementation

### Should Implement (High Priority)

4. **Update Testing Strategy for Dual API**
   - Test TextInput standalone functionality
   - Test TextInputField composition logic
   - Test size mapping
   - Test ID generation

5. **Update Storybook Stories**
   - Create stories for both TextInput and TextInputField
   - Show manual composition examples
   - Show convenience wrapper examples
   - Demonstrate when to use each

### Consider for Future (Nice to Have)

6. **Add Pattern Documentation**
   - Document when to use TextInput vs TextInputField
   - Provide migration path if starting with TextInputField
   - Show real-world examples of both patterns

7. **Form Library Integration Examples**
   - React Hook Form example with TextInput
   - React Hook Form example with TextInputField
   - Show how ref forwarding works with form libraries

---

## Conclusion

The TextInput component plan is **architecturally sound in most aspects** with one critical flaw: the internal composition strategy. The plan demonstrates excellent understanding of:

- Atomic design methodology
- CVA variant patterns
- Ref forwarding and TypeScript
- Accessibility requirements
- State management best practices
- Design system integration

However, the proposed internal composition pattern (where TextInput renders InputLabel, Hint, and ErrorMessage based on string props) violates React's composition philosophy and reduces component flexibility.

**Recommended Path Forward:**

1. Implement TextInput as a **standalone input component** (Phase 1)
2. Optionally implement TextInputField as a **convenience wrapper** (Phase 2)
3. Export both components to support simple and complex use cases
4. Update Storybook stories to demonstrate both patterns
5. Document when to use each approach

This dual API approach provides:

- **Convenience** for simple forms (TextInputField)
- **Flexibility** for custom layouts (TextInput)
- **Consistency** with existing atom composition patterns
- **Scalability** for future requirements

**Final Score: 9.2/10**

With the recommended changes, this would be a **10/10 architecturally compliant** component that serves as an excellent example for future molecule components in the design system.

---

## Files Referenced

- **Plan:** `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/ai/plans/ui/text-input-2025-11-30.md`
- **Button:** `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/buttons/button.tsx`
- **InputLabel:** `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/inputs/input-label.tsx`
- **Hint:** `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/inputs/hint.tsx`
- **ErrorMessage:** `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/inputs/error-message.tsx`
- **Skill Guide:** `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/.claude/skills/sazonia-ui-components/SKILL.md`
