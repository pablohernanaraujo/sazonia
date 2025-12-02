# NumberInput Component Plan Architectural Review

**Date:** 2025-11-30
**Component:** NumberInput (Molecule)
**Plan Location:** `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/ai/plans/ui/number-input-plan-2025-11-30.md`
**Reviewer:** UI/UX Architecture Agent

---

## Executive Summary

**Overall Architectural Alignment Score:** 9.5/10

The NumberInput component plan demonstrates exceptional architectural planning with near-perfect alignment to established project patterns. The plan correctly follows the dual API approach (NumberInput + NumberInputField) established by TextInput, properly classifies the component as a molecule, and shows excellent understanding of CVA variants, accessibility, and design system integration. There are minor improvements regarding the stepper control architecture and a critical consideration about the wrapper element structure that should be addressed.

**Component Classification:** ✅ Correctly classified as Molecule

**Primary Strengths:**

- Excellent use of the dual API pattern (NumberInput + NumberInputField)
- Comprehensive keyboard accessibility planning (ArrowUp/Down, PageUp/Down, Home/End)
- Proper extension of TextInput architectural patterns
- Thorough consideration of min/max/step constraints

**Primary Concern:** The stepper control implementation details need architectural clarity to avoid wrapper nesting issues.

---

## Architectural Assessment

### 1. Atomic Design Classification: ✅ CORRECT

**Classification:** Molecule
**Reasoning Provided:** "NumberInput is a molecule because it composes multiple atoms (Icon, InputLabel, Hint, ErrorMessage) into a more complex, reusable form control."

**Evaluation:**

- ✅ **Correct classification** - NumberInput is properly classified as a molecule
- ✅ **Proper composition chain** - Correctly identifies composition of Icon atoms for stepper chevrons
- ✅ **Extends existing molecule** - Builds upon TextInput (molecule) + adds stepper control
- ✅ **Appropriate complexity level** - Not too simple (atom) nor too complex (organism)
- ✅ **Clear dependency understanding** - InputLabel, Hint, ErrorMessage atoms for NumberInputField

**Pattern Comparison:**

```
TextInput (Molecule)           NumberInput (Molecule)
├── Icon (optional add-ons)    ├── Icon (stepper chevrons) ✅
├── InputLabel (via Field)     ├── InputLabel (via Field) ✅
├── Hint (via Field)           ├── Hint (via Field) ✅
└── ErrorMessage (via Field)   └── ErrorMessage (via Field) ✅
                               └── NEW: Stepper control (CaretUp, CaretDown)
```

**Recommendation:** Classification is perfect. No changes needed.

---

### 2. Component Composition Strategy: ✅ EXCELLENT

**Proposed Structure (from plan):**

**File 1:** `src/ui/inputs/number-input.tsx` - Standalone NumberInput
**File 2:** `src/ui/inputs/number-input-field.tsx` - Convenience wrapper

This follows the **dual API pattern** established by TextInput/TextInputField.

**Evaluation:**

✅ **Follows established pattern perfectly**

```typescript
// Pattern established by TextInput
TextInput.tsx           → Standalone input component
TextInputField.tsx      → Convenience wrapper with label/hint/error

// NumberInput follows the same pattern
NumberInput.tsx         → Standalone number input with stepper
NumberInputField.tsx    → Convenience wrapper with label/hint/error
```

✅ **Proper separation of concerns**

- NumberInput: Handles numeric input + stepper logic
- NumberInputField: Handles composition with label/hint/error atoms

✅ **Maximum flexibility**

```typescript
// Simple forms - use NumberInputField
<NumberInputField
  label="Quantity"
  labelProps={{ required: true }}
  hint="Minimum order: 1"
  min={1}
  max={100}
  step={1}
/>

// Custom layouts - use NumberInput directly
<div className="flex justify-between items-center">
  <InputLabel label="Price" required />
  <span className="text-text-tertiary">USD</span>
</div>
<NumberInput
  leftAddOn="$"
  min={0}
  step={0.01}
  error={!!errors.price}
/>
{errors.price && <ErrorMessage text={errors.price} />}
```

**Comparison with TextInput implementation:**

| Aspect               | TextInput                     | NumberInput Plan                     | Alignment |
| -------------------- | ----------------------------- | ------------------------------------ | --------- |
| Dual API             | ✅ TextInput + TextInputField | ✅ NumberInput + NumberInputField    | Perfect   |
| Standalone component | ✅ Focuses on input only      | ✅ Focuses on number input + stepper | Perfect   |
| Convenience wrapper  | ✅ Composes atoms externally  | ✅ Composes atoms externally         | Perfect   |
| Size mapping         | ✅ INPUT_LABEL_SIZE_MAP       | ✅ Same mapping planned              | Perfect   |
| ID generation        | ✅ useId() in Field           | ✅ useId() in Field                  | Perfect   |
| ARIA associations    | ✅ aria-describedby           | ✅ aria-describedby                  | Perfect   |

**Recommendation:** Composition strategy is architecturally perfect. No changes needed.

---

### 3. Stepper Control Architecture: ⚠️ CRITICAL DESIGN DECISION NEEDED

The plan mentions creating a "stepper control" but lacks architectural clarity on how it integrates with the existing TextInput wrapper structure.

**Critical Issue: Wrapper Element Structure**

TextInput has this structure:

```typescript
// TextInput.tsx (lines 163-196)
<div className={textInputWrapperVariants({ size, error })}>  // Wrapper with border
  {leftAddOn && <span>{leftAddOn}</span>}
  <input />
  {rightAddOn && <span>{rightAddOn}</span>}
</div>
```

The plan suggests NumberInput will use stepper as `rightAddOn`, but the stepper needs:

1. **Interactive buttons** (click handlers)
2. **Internal border** between up/down buttons
3. **Unique styling** (border-radius, padding)

**Problem: Stepper cannot be treated as a simple add-on**

```typescript
// ❌ This approach won't work well:
<NumberInput rightAddOn={<StepperButtons />} />

// Because TextInput's rightAddOn is just a <span> with text-tertiary color
// It doesn't support complex interactive elements with borders
```

**Recommended Architecture: Internal Stepper Component**

NumberInput should have its own wrapper structure, NOT reuse TextInput's wrapper:

```typescript
// ✅ Recommended: NumberInput.tsx
const numberInputWrapperVariants = cva(
  [
    'flex w-full items-center',
    'rounded-sm border',
    'bg-background',
    'transition-colors duration-150',
    'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-background-secondary',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2 pl-3 pr-1', // Right padding reduced for stepper
        md: 'gap-2.5 pl-3.5 pr-1',
        lg: 'gap-3 pl-4 pr-1',
      },
      error: {
        true: 'border-destructive focus-within:border-destructive',
        false: 'border-border hover:border-border-hover',
      },
    },
  }
);

const stepperButtonVariants = cva(
  [
    'flex items-center justify-center',
    'text-text-secondary',
    'transition-colors',
    'hover:bg-fill-tertiary',
    'active:bg-fill-tertiary-hover',
    'disabled:opacity-52 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-6', // Half of input height minus padding
        md: 'h-5 w-6',
        lg: 'h-6 w-7',
      },
    },
  }
);

// Internal stepper component
function NumberInputStepper({
  size,
  disabled,
  onIncrement,
  onDecrement,
  canIncrement,
  canDecrement,
}: StepperProps) {
  return (
    <div className="flex flex-col border-l border-border">
      <button
        type="button"
        className={cn(stepperButtonVariants({ size }))}
        onClick={onIncrement}
        disabled={disabled || !canIncrement}
        aria-label="Increment value"
        tabIndex={-1} // Prevent tab focus, use arrow keys instead
      >
        <Icon icon={CaretUp} size="xs" color={null} />
      </button>
      <button
        type="button"
        className={cn(stepperButtonVariants({ size }), 'border-t border-border')}
        onClick={onDecrement}
        disabled={disabled || !canDecrement}
        aria-label="Decrement value"
        tabIndex={-1}
      >
        <Icon icon={CaretDown} size="xs" color={null} />
      </button>
    </div>
  );
}

// Main component
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ size = 'lg', error, leftAddOn, min, max, step = 1, value, onChange, ...props }, ref) => {
    const handleIncrement = () => {
      // Increment logic with min/max bounds
    };

    const handleDecrement = () => {
      // Decrement logic with min/max bounds
    };

    return (
      <div className={cn(numberInputWrapperVariants({ size, error }))}>
        {leftAddOn && <span className="text-text-tertiary">{leftAddOn}</span>}
        <input
          ref={ref}
          type="number"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className={cn(numberInputVariants({ size }))}
          {...props}
        />
        <NumberInputStepper
          size={size}
          disabled={props.disabled}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          canIncrement={value !== undefined && max !== undefined ? value < max : true}
          canDecrement={value !== undefined && min !== undefined ? value > min : true}
        />
      </div>
    );
  }
);
```

**Why this approach is superior:**

1. ✅ **Dedicated wrapper variants** - NumberInput controls its own padding/spacing
2. ✅ **Internal stepper component** - Encapsulated, not exposed as prop
3. ✅ **Proper border handling** - Stepper has left border, buttons have top border
4. ✅ **Disabled state propagation** - Stepper buttons can be individually disabled
5. ✅ **Size-aware stepper** - Button sizes scale with input size
6. ✅ **Accessibility** - tabIndex={-1} prevents keyboard trap, arrow keys increment/decrement
7. ✅ **Code reuse** - Still uses textInputVariants for the input element styling

**Alternative Approach: Extend TextInput via Composition**

If you want to maximize code reuse:

```typescript
// ❌ Less recommended but possible:
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ size, error, leftAddOn, min, max, step, value, onChange, ...props }, ref) => {
    // Use TextInput but override rightAddOn
    return (
      <div className="relative">
        <TextInput
          ref={ref}
          type="number"
          size={size}
          error={error}
          leftAddOn={leftAddOn}
          rightAddOn={
            <NumberInputStepper
              size={size}
              disabled={props.disabled}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          }
          wrapperClassName="pr-1" // Override padding for stepper
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          {...props}
        />
      </div>
    );
  }
);
```

**Why this is less ideal:**

- ❌ Couples NumberInput to TextInput implementation details
- ❌ Requires wrapperClassName overrides (hacky)
- ❌ TextInput's rightAddOn wasn't designed for complex interactive elements
- ❌ Harder to maintain if TextInput changes

**Recommendation:**
Use the **dedicated wrapper approach** (Option 1). Create `numberInputWrapperVariants` specific to NumberInput that accounts for the stepper control. This maintains architectural independence while reusing `textInputVariants` for the actual input element styling.

**Action Required:**

- Update the implementation plan to specify the wrapper architecture
- Create `NumberInputStepper` as an internal component (not exported)
- Do NOT use TextInput's `rightAddOn` for the stepper control

---

### 4. CVA Variant System: ✅ EXCELLENT

**Plan's CVA Usage (lines 267-290):**

The plan correctly identifies the need for CVA variants matching TextInput's pattern.

**Expected Implementation:**

```typescript
const numberInputWrapperVariants = cva(
  [
    'flex w-full items-center',
    'rounded-sm border',
    'bg-background',
    'transition-colors duration-150',
    'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-background-secondary',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2 pr-1 pl-3', // Adjusted for stepper
        md: 'gap-2.5 pr-1 pl-3.5',
        lg: 'gap-3 pr-1 pl-4',
      },
      error: {
        true: 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20',
        false: 'border-border hover:border-border-hover',
      },
    },
    defaultVariants: {
      size: 'lg',
      error: false,
    },
  }
);

const numberInputVariants = cva(
  [
    'w-full min-w-0 flex-1',
    'bg-transparent',
    'border-none outline-none',
    'text-text-primary',
    'placeholder:text-text-tertiary',
    'disabled:cursor-not-allowed disabled:text-text-tertiary',
    // Hide native number input spinners
    '[appearance:textfield]',
    '[&::-webkit-outer-spin-button]:appearance-none',
    '[&::-webkit-inner-spin-button]:appearance-none',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm leading-5',
        md: 'text-sm leading-5',
        lg: 'text-base leading-6',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

const stepperButtonVariants = cva(
  [
    'flex items-center justify-center',
    'text-text-secondary',
    'transition-colors',
    'hover:bg-fill-tertiary',
    'active:bg-fill-tertiary-hover',
    'focus-visible:outline-none',
    'focus-visible:bg-fill-tertiary',
    'disabled:opacity-52',
    'disabled:cursor-not-allowed',
    'disabled:hover:bg-transparent',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-6', // Based on input height
        md: 'h-5 w-6',
        lg: 'h-6 w-7',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);
```

**Evaluation:**

- ✅ **Correct pattern** - Matches TextInput's CVA structure
- ✅ **Native spinner hiding** - `[appearance:textfield]` and webkit pseudo-elements
- ✅ **Size variants** - Same sm/md/lg as TextInput
- ✅ **Error state variant** - Boolean variant for error styling
- ✅ **Stepper button variants** - NEW, properly sized and styled
- ✅ **Focus-within** - Wrapper uses focus-within for input focus state

**Comparison with TextInput:**

| Aspect           | TextInput                   | NumberInput                             | Alignment |
| ---------------- | --------------------------- | --------------------------------------- | --------- |
| Wrapper variants | ✅ textInputWrapperVariants | ✅ numberInputWrapperVariants           | Perfect   |
| Input variants   | ✅ textInputVariants        | ✅ numberInputVariants + spinner hiding | Enhanced  |
| Size variants    | ✅ sm, md, lg               | ✅ sm, md, lg                           | Perfect   |
| Error variant    | ✅ boolean                  | ✅ boolean                              | Perfect   |
| Default size     | ✅ lg                       | ✅ lg                                   | Perfect   |
| Additional       | -                           | ✅ stepperButtonVariants                | Necessary |

**Recommendation:** CVA approach is architecturally perfect. The addition of `stepperButtonVariants` is necessary and well-designed.

---

### 5. Keyboard Accessibility: ✅ EXCEPTIONAL

The plan demonstrates **outstanding keyboard accessibility planning** that exceeds typical component requirements.

**Plan's Keyboard Support (lines 289, 360-361, 434-435):**

```typescript
// Proposed keyboard handlers:
ArrowUp     → Increment by step
ArrowDown   → Decrement by step
PageUp      → Increment by step * 10
PageDown    → Decrement by step * 10
Home        → Set to min value
End         → Set to max value
```

**Evaluation:**

- ✅ **Complete keyboard coverage** - All expected keys supported
- ✅ **Semantic key behavior** - Arrow keys for small changes, Page keys for large changes
- ✅ **Boundary keys** - Home/End for min/max (excellent UX)
- ✅ **ARIA attributes planned** - aria-valuemin, aria-valuemax, aria-valuenow (lines 331)
- ✅ **Stepper button tabIndex** - Should use tabIndex={-1} to prevent keyboard trap

**Recommended Implementation:**

```typescript
const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, min, max, step = 1, disabled, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      const currentValue = parseFloat(value?.toString() || '0');
      let newValue: number | undefined;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newValue = Math.min(currentValue + step, max ?? Infinity);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newValue = Math.max(currentValue - step, min ?? -Infinity);
          break;
        case 'PageUp':
          e.preventDefault();
          newValue = Math.min(currentValue + step * 10, max ?? Infinity);
          break;
        case 'PageDown':
          e.preventDefault();
          newValue = Math.max(currentValue - step * 10, min ?? -Infinity);
          break;
        case 'Home':
          if (min !== undefined) {
            e.preventDefault();
            newValue = min;
          }
          break;
        case 'End':
          if (max !== undefined) {
            e.preventDefault();
            newValue = max;
          }
          break;
      }

      if (newValue !== undefined && onChange) {
        const syntheticEvent = {
          target: { value: newValue.toString() },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }

      // Call original onKeyDown if provided
      props.onKeyDown?.(e);
    };

    return (
      <div className={numberInputWrapperVariants({ size, error })}>
        {leftAddOn && <span>{leftAddOn}</span>}
        <input
          ref={ref}
          type="number"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          {...props}
        />
        <NumberInputStepper
          size={size}
          disabled={disabled}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      </div>
    );
  }
);
```

**Accessibility Best Practices:**

1. ✅ **preventDefault() on arrow keys** - Prevents page scroll while incrementing
2. ✅ **Bounds checking** - Ensures values stay within min/max
3. ✅ **Optional Home/End** - Only works if min/max are defined
4. ✅ **ARIA attributes** - Announces value range to screen readers
5. ✅ **Stepper tabIndex={-1}** - Keyboard users use arrow keys, not tab to buttons
6. ✅ **Disabled state** - Keyboard handlers respect disabled prop

**Comparison with Industry Standards:**

| Feature               | MDN Spec       | NumberInput Plan | Alignment |
| --------------------- | -------------- | ---------------- | --------- |
| ArrowUp/Down          | ✅ Required    | ✅ Planned       | Perfect   |
| PageUp/Down           | ✅ Recommended | ✅ Planned       | Exceeds   |
| Home/End              | ✅ Optional    | ✅ Planned       | Exceeds   |
| aria-valuemin/max/now | ✅ Required    | ✅ Planned       | Perfect   |
| Step increment        | ✅ Required    | ✅ Planned       | Perfect   |

**Recommendation:** Keyboard accessibility is exceptional. This exceeds standard requirements and provides excellent UX. No changes needed.

---

### 6. NumberInputField Wrapper: ✅ EXCELLENT

The plan correctly identifies the need for a convenience wrapper following the TextInputField pattern.

**Expected Structure (from plan):**

```typescript
// src/ui/inputs/number-input-field.tsx
export interface NumberInputFieldProps extends Omit<NumberInputProps, 'error'> {
  label?: string;
  labelProps?: Partial<Omit<InputLabelProps, 'label' | 'htmlFor'>>;
  hint?: string;
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;
  error?: string;
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;
  containerClassName?: string;
}

export const NumberInputField = forwardRef<HTMLInputElement, NumberInputFieldProps>(
  ({
    label,
    labelProps,
    hint,
    hintProps,
    error,
    errorProps,
    containerClassName,
    size = 'lg',
    id: providedId,
    'aria-describedby': providedAriaDescribedBy,
    ...inputProps
  }, ref) => {
    const generatedId = useId();
    const inputId = providedId ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const hasError = Boolean(error);
    const hasHint = Boolean(hint) && !hasError;

    const ariaDescribedBy =
      providedAriaDescribedBy ??
      (hasError ? errorId : hasHint ? hintId : undefined);

    const labelSize = INPUT_LABEL_SIZE_MAP[size];
    const hintSize = HINT_SIZE_MAP[size];

    return (
      <div className={cn('flex flex-col', containerClassName)}>
        {label && (
          <InputLabel
            label={label}
            htmlFor={inputId}
            size={labelSize}
            {...labelProps}
          />
        )}

        <NumberInput
          ref={ref}
          id={inputId}
          size={size}
          error={hasError}
          aria-describedby={ariaDescribedBy}
          aria-invalid={hasError || undefined}
          aria-required={labelProps?.required || undefined}
          {...inputProps}
        />

        {hasHint && (
          <Hint id={hintId} size={hintSize} {...hintProps}>
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
```

**Evaluation:**

- ✅ **Perfect 1:1 match with TextInputField** - Same structure, same patterns
- ✅ **useId() for ID generation** - Automatic unique IDs
- ✅ **Size mapping** - INPUT_LABEL_SIZE_MAP and HINT_SIZE_MAP
- ✅ **ARIA associations** - aria-describedby points to hint or error
- ✅ **Error replaces hint** - Correct priority
- ✅ **Props passthrough** - labelProps, hintProps, errorProps
- ✅ **Type safety** - Omits conflicting props

**Comparison with TextInputField:**

```typescript
// TextInputField implementation (lines 122-199 of text-input-field.tsx)
// NumberInput should follow EXACTLY the same pattern

✅ Same interface structure
✅ Same useId() usage
✅ Same size mapping
✅ Same ARIA associations
✅ Same hint/error logic
✅ Same props passthrough pattern
```

**Recommendation:** NumberInputField architecture is perfect. Follow the TextInputField implementation exactly, just swap TextInput for NumberInput.

---

### 7. Design System Integration: ✅ EXCELLENT

**Export Strategy (lines 46-84):**

```typescript
// 1. Component file: src/ui/inputs/number-input.tsx
export { NumberInput, numberInputVariants };
export type { NumberInputProps };

// 2. Wrapper file: src/ui/inputs/number-input-field.tsx
export { NumberInputField };
export type { NumberInputFieldProps };

// 3. Category barrel: src/ui/inputs/index.ts
export * from './number-input';
export * from './number-input-field';

// 4. Usage
import { NumberInput, NumberInputField } from '@/ui';
import { NumberInput, NumberInputField } from '@/ui/inputs';
```

**Evaluation:**

- ✅ **Correct barrel pattern** - Matches TextInput/TextInputField
- ✅ **Named exports** - Consistent with all UI components
- ✅ **Type exports** - TypeScript types properly exported
- ✅ **CVA variants export** - numberInputVariants exported for external use
- ✅ **Both import paths** - Works via @/ui and @/ui/inputs

**Pattern Comparison:**

| Component   | Primary Export | Type Export         | Variants Export        | Wrapper Export      |
| ----------- | -------------- | ------------------- | ---------------------- | ------------------- |
| Button      | ✅ Button      | ✅ ButtonProps      | ✅ buttonVariants      | -                   |
| TextInput   | ✅ TextInput   | ✅ TextInputProps   | ✅ textInputVariants   | ✅ TextInputField   |
| NumberInput | ✅ NumberInput | ✅ NumberInputProps | ✅ numberInputVariants | ✅ NumberInputField |

**Recommendation:** Export strategy is perfect. No changes needed.

---

### 8. State Management and Value Handling: ✅ CORRECT

**Plan's State Management (controlled/uncontrolled support):**

The plan correctly identifies support for both controlled and uncontrolled patterns (line 431).

**Expected Implementation:**

```typescript
export interface NumberInputProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  leftAddOn?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  // Inherits value, defaultValue, onChange from input props
}

// Controlled usage
const [quantity, setQuantity] = useState(1);
<NumberInput
  value={quantity}
  onChange={(e) => setQuantity(parseFloat(e.target.value))}
  min={1}
  max={100}
/>

// Uncontrolled usage
<NumberInput defaultValue={1} min={1} max={100} />
```

**Evaluation:**

- ✅ **Extends ComponentPropsWithoutRef<'input'>** - Inherits value/defaultValue/onChange
- ✅ **No internal state** - Component is controlled by parent or browser
- ✅ **onChange compatibility** - Works with React Hook Form, Formik, etc.
- ✅ **Increment/decrement helpers** - Internal handlers modify value via onChange callback

**Critical Implementation Detail: Stepper Click Handlers**

When stepper buttons are clicked, they must trigger onChange:

```typescript
const handleIncrement = () => {
  if (disabled || !onChange) return;

  const currentValue = parseFloat(value?.toString() || '0');
  const newValue = Math.min(currentValue + step, max ?? Infinity);

  // Create synthetic event to match React's ChangeEvent signature
  const syntheticEvent = {
    target: { value: newValue.toString() },
    currentTarget: inputRef.current,
  } as React.ChangeEvent<HTMLInputElement>;

  onChange(syntheticEvent);
};

const handleDecrement = () => {
  if (disabled || !onChange) return;

  const currentValue = parseFloat(value?.toString() || '0');
  const newValue = Math.max(currentValue - step, min ?? -Infinity);

  const syntheticEvent = {
    target: { value: newValue.toString() },
    currentTarget: inputRef.current,
  } as React.ChangeEvent<HTMLInputElement>;

  onChange(syntheticEvent);
};
```

**Why this matters:**

- ✅ Works with React Hook Form's `register()` function
- ✅ Works with controlled components
- ✅ Triggers form validation on increment/decrement
- ✅ Maintains value in parent component state

**Recommendation:** State management approach is correct. Ensure stepper buttons create synthetic ChangeEvents to trigger onChange callback.

---

### 9. Testing Strategy: ✅ COMPREHENSIVE

**Plan's Testing Requirements (lines 409-460):**

**Unit Tests:**

- ✅ Rendering with all prop combinations
- ✅ Size variants (sm, md, lg)
- ✅ State tests (disabled, error)
- ✅ Increment/decrement button clicks
- ✅ Min/max boundary enforcement
- ✅ Step value changes
- ✅ Keyboard navigation (ArrowUp/Down, PageUp/Down, Home/End)
- ✅ Controlled vs uncontrolled
- ✅ Ref forwarding
- ✅ ARIA attributes

**Edge Cases:**

- ✅ Value of 0 (falsy but valid)
- ✅ Negative numbers
- ✅ Decimal values (step=0.1)
- ✅ Very large numbers
- ✅ Empty input (null/undefined)
- ✅ Non-numeric paste
- ✅ Min > Max handling
- ✅ Step larger than (max - min)

**Evaluation:**

- ✅ **Comprehensive coverage** - All critical paths tested
- ✅ **Edge cases identified** - Thorough consideration of failure modes
- ✅ **Accessibility testing** - ARIA attributes and keyboard navigation
- ✅ **Integration testing** - NumberInputField composition
- ✅ **>90% coverage target** - Appropriate for UI components

**Additional Test Cases to Consider:**

```typescript
// 1. Stepper button disabled states
test('increment button disabled when value equals max', () => {
  render(<NumberInput value={100} max={100} />);
  const incrementButton = screen.getByLabelText('Increment value');
  expect(incrementButton).toBeDisabled();
});

test('decrement button disabled when value equals min', () => {
  render(<NumberInput value={0} min={0} />);
  const decrementButton = screen.getByLabelText('Decrement value');
  expect(decrementButton).toBeDisabled();
});

// 2. Keyboard event propagation
test('does not prevent default for non-arrow keys', () => {
  const { container } = render(<NumberInput />);
  const input = container.querySelector('input');
  const event = new KeyboardEvent('keydown', { key: 'Tab' });
  const spy = jest.spyOn(event, 'preventDefault');
  input.dispatchEvent(event);
  expect(spy).not.toHaveBeenCalled();
});

// 3. onChange synthetic event structure
test('stepper click triggers onChange with correct event structure', () => {
  const handleChange = jest.fn();
  render(<NumberInput value={5} onChange={handleChange} />);
  const incrementButton = screen.getByLabelText('Increment value');
  fireEvent.click(incrementButton);

  expect(handleChange).toHaveBeenCalledWith(
    expect.objectContaining({
      target: expect.objectContaining({
        value: '6',
      }),
    })
  );
});

// 4. Floating point precision
test('handles decimal step values correctly', () => {
  const handleChange = jest.fn();
  render(<NumberInput value={0.1} step={0.1} onChange={handleChange} />);
  const incrementButton = screen.getByLabelText('Increment value');
  fireEvent.click(incrementButton);

  expect(handleChange).toHaveBeenCalledWith(
    expect.objectContaining({
      target: expect.objectContaining({
        value: '0.2', // Should handle floating point correctly
      }),
    })
  );
});
```

**Recommendation:** Testing strategy is excellent. Consider adding the additional test cases above for stepper button states and event handling.

---

### 10. Storybook Documentation: ✅ EXCELLENT

**Plan's Storybook Requirements (lines 231-262):**

**Required Stories:**

1. ✅ Default - Basic NumberInput
2. ✅ Sizes - SM, MD, LG comparison
3. ✅ AllStates - Grid of all visual states
4. ✅ WithPrefix - Text prefix examples
5. ✅ MinMaxBounds - Constraint demonstrations
6. ✅ StepValues - Custom step values
7. ✅ ManualComposition - NumberInput + atoms
8. ✅ FieldDefault - NumberInputField basic
9. ✅ FieldWithHint - Field with hint
10. ✅ FieldWithError - Field with error
11. ✅ FieldFullFeatured - All features
12. ✅ FormIntegration - Real-world form example
13. ✅ AllCombinations - Grid of size/state combinations
14. ✅ KeyboardNavigation - Interactive demo

**Evaluation:**

- ✅ **Comprehensive story coverage** - 14 stories cover all use cases
- ✅ **Pattern consistency** - Matches TextInput story structure
- ✅ **Interactive examples** - KeyboardNavigation story for accessibility demo
- ✅ **Real-world scenarios** - FormIntegration shows practical usage
- ✅ **Visual regression testing** - AllStates and AllCombinations for visual QA

**Comparison with TextInput Stories:**

| Story Type       | TextInput | NumberInput Plan                                | Alignment |
| ---------------- | --------- | ----------------------------------------------- | --------- |
| Default          | ✅        | ✅                                              | Perfect   |
| Sizes            | ✅        | ✅                                              | Perfect   |
| AllStates        | ✅        | ✅                                              | Perfect   |
| With Add-ons     | ✅        | ✅ WithPrefix                                   | Enhanced  |
| Field Variants   | ✅        | ✅ Field\* stories                              | Perfect   |
| Form Integration | ✅        | ✅                                              | Perfect   |
| Additional       | -         | ✅ MinMaxBounds, StepValues, KeyboardNavigation | Enhanced  |

**Recommended Story Enhancement:**

Add a story demonstrating the stepper control's visual states:

```typescript
export const StepperStates: StoryObj<typeof NumberInput> = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-text-tertiary mb-2">Normal</p>
        <NumberInput value={5} min={0} max={10} />
      </div>
      <div>
        <p className="text-sm text-text-tertiary mb-2">At Min (decrement disabled)</p>
        <NumberInput value={0} min={0} max={10} />
      </div>
      <div>
        <p className="text-sm text-text-tertiary mb-2">At Max (increment disabled)</p>
        <NumberInput value={10} min={0} max={10} />
      </div>
    </div>
  ),
};
```

**Recommendation:** Storybook plan is excellent. Consider adding the StepperStates story to showcase disabled button states.

---

## Critical Issues Summary

### Critical (Must Address Before Implementation)

1. **Stepper Control Architecture**
   - **Issue:** Plan lacks clarity on whether to extend TextInput or create independent wrapper
   - **Impact:** Could lead to fragile implementation if using TextInput's rightAddOn incorrectly
   - **Solution:** Create dedicated `numberInputWrapperVariants` and internal `NumberInputStepper` component
   - **Priority:** CRITICAL - This affects the entire component structure
   - **Rationale:** TextInput's rightAddOn is designed for simple text/icons, not complex interactive controls with borders

### Recommendations (Should Implement)

2. **Export Internal Stepper Component (No)**
   - **Issue:** Should `NumberInputStepper` be exported or kept internal?
   - **Impact:** If exported, creates API surface that may change; if internal, more flexible
   - **Solution:** Keep `NumberInputStepper` as internal component, not exported from barrel
   - **Priority:** HIGH - Affects public API surface
   - **Rationale:** Stepper is tightly coupled to NumberInput, no use case for standalone usage

3. **Native Spinner Hiding CSS**
   - **Issue:** Plan mentions hiding native spinners (line 544) but doesn't specify approach
   - **Impact:** Native spinners could appear alongside custom stepper
   - **Solution:** Add CSS to numberInputVariants:
     ```typescript
     '[appearance:textfield]', // Firefox
     '[&::-webkit-outer-spin-button]:appearance-none', // Chrome/Safari
     '[&::-webkit-inner-spin-button]:appearance-none',
     ```
   - **Priority:** HIGH - Visual consistency requirement

4. **Stepper Button Focus Management**
   - **Issue:** Stepper buttons could create keyboard trap if tabbable
   - **Impact:** Poor keyboard accessibility
   - **Solution:** Add `tabIndex={-1}` to stepper buttons, rely on arrow key handlers
   - **Priority:** HIGH - Accessibility requirement
   - **Rationale:** Users should increment via arrow keys, not tab to stepper buttons

---

## Positive Architectural Patterns

### Excellent Design Decisions

1. ✅ **Dual API Pattern**
   - Correctly follows TextInput/TextInputField pattern
   - Provides both standalone and convenience wrapper
   - Maximum flexibility for simple and complex use cases

2. ✅ **Keyboard Accessibility**
   - Comprehensive keyboard support (Arrow, Page, Home, End keys)
   - ARIA attributes (aria-valuemin, aria-valuemax, aria-valuenow)
   - Exceeds standard accessibility requirements

3. ✅ **CVA Variant System**
   - Consistent with TextInput variant structure
   - Size variants (sm, md, lg)
   - Error state variant
   - Additional stepperButtonVariants for stepper control

4. ✅ **Composition Strategy**
   - NumberInputField composes InputLabel, NumberInput, Hint, ErrorMessage
   - External composition (not internal)
   - Props passthrough (labelProps, hintProps, errorProps)

5. ✅ **Size Mapping**
   - Correctly identifies INPUT_LABEL_SIZE_MAP need
   - Maps 3 input sizes to 2 label sizes
   - Visual harmony between input and label

6. ✅ **State Management**
   - Controlled and uncontrolled support
   - No internal state (stateless component)
   - Works with React Hook Form, Formik, etc.

7. ✅ **Testing Strategy**
   - Comprehensive unit test coverage
   - Edge case identification
   - Accessibility testing
   - > 90% coverage target

8. ✅ **Storybook Documentation**
   - 14 comprehensive stories
   - Interactive examples
   - Real-world form integration
   - Visual regression testing (AllStates, AllCombinations)

9. ✅ **Design System Integration**
   - Barrel export pattern
   - Named exports
   - Type exports
   - Works via @/ui and @/ui/inputs

10. ✅ **Ref Forwarding**
    - forwardRef to native input element
    - Proper TypeScript generics
    - displayName for debugging

---

## Alignment with Project Patterns

### Pattern Conformance Scorecard

| Pattern                       | Conformance      | Evidence                                            |
| ----------------------------- | ---------------- | --------------------------------------------------- |
| Atomic Design                 | ✅ Excellent     | Correctly classified as molecule, extends TextInput |
| Dual API (Standalone + Field) | ✅ Excellent     | NumberInput + NumberInputField pattern              |
| CVA Variants                  | ✅ Excellent     | Matches TextInput, adds stepperButtonVariants       |
| forwardRef                    | ✅ Excellent     | Correct ref forwarding to native element            |
| TypeScript                    | ✅ Excellent     | ComponentPropsWithoutRef, VariantProps              |
| Barrel Exports                | ✅ Excellent     | Named exports, category barrel                      |
| Accessibility                 | ✅ Exceptional   | ARIA attributes, keyboard nav exceeds standards     |
| State Management              | ✅ Excellent     | Controlled/uncontrolled, stateless component        |
| Composition                   | ✅ Excellent     | External composition via NumberInputField           |
| Design Tokens                 | ✅ Excellent     | Semantic tokens, matches TextInput                  |
| Storybook                     | ✅ Excellent     | 14 comprehensive stories                            |
| Stepper Architecture          | ⚠️ Needs Clarity | Should be internal component, not rightAddOn        |

### Comparison with TextInput Implementation

| Aspect           | TextInput                             | NumberInput Plan                          | Alignment    |
| ---------------- | ------------------------------------- | ----------------------------------------- | ------------ |
| File structure   | text-input.tsx + text-input-field.tsx | number-input.tsx + number-input-field.tsx | ✅ Perfect   |
| Wrapper variants | textInputWrapperVariants              | numberInputWrapperVariants                | ✅ Perfect   |
| Input variants   | textInputVariants                     | numberInputVariants + spinner hiding      | ✅ Enhanced  |
| Size variants    | sm, md, lg                            | sm, md, lg                                | ✅ Perfect   |
| Error variant    | boolean                               | boolean                                   | ✅ Perfect   |
| Add-ons          | leftAddOn, rightAddOn                 | leftAddOn + stepper (internal)            | ⚠️ Different |
| Field wrapper    | useId(), size mapping, ARIA           | Same pattern                              | ✅ Perfect   |
| forwardRef       | ✅                                    | ✅                                        | ✅ Perfect   |
| TypeScript       | ComponentPropsWithoutRef              | ComponentPropsWithoutRef                  | ✅ Perfect   |
| Exports          | Named exports                         | Named exports                             | ✅ Perfect   |

**Key Difference:**

- TextInput has generic `rightAddOn` prop
- NumberInput has **dedicated stepper control** (not exposed as prop)
- This is architecturally correct - stepper is integral to NumberInput

---

## Recommended Implementation Approach

### Phase 1: Create NumberInput Component

**File:** `src/ui/inputs/number-input.tsx`

```typescript
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { CaretUp, CaretDown } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

// Wrapper variants (modified from TextInput to accommodate stepper)
const numberInputWrapperVariants = cva(
  [
    'flex w-full items-center',
    'rounded-sm border',
    'bg-background',
    'transition-colors duration-150',
    'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-background-secondary',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2 pl-3 pr-1',    // Reduced right padding for stepper
        md: 'gap-2.5 pl-3.5 pr-1',
        lg: 'gap-3 pl-4 pr-1',
      },
      error: {
        true: 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20',
        false: 'border-border hover:border-border-hover',
      },
    },
    defaultVariants: {
      size: 'lg',
      error: false,
    },
  }
);

// Input variants (reuse TextInput pattern + hide native spinners)
const numberInputVariants = cva(
  [
    'w-full min-w-0 flex-1',
    'bg-transparent',
    'border-none outline-none',
    'text-text-primary',
    'placeholder:text-text-tertiary',
    'disabled:cursor-not-allowed disabled:text-text-tertiary',
    // Hide native number input spinners
    '[appearance:textfield]',
    '[&::-webkit-outer-spin-button]:appearance-none',
    '[&::-webkit-inner-spin-button]:appearance-none',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm leading-5',
        md: 'text-sm leading-5',
        lg: 'text-base leading-6',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

// Stepper button variants
const stepperButtonVariants = cva(
  [
    'flex items-center justify-center',
    'text-text-secondary',
    'transition-colors',
    'hover:bg-fill-tertiary',
    'active:bg-fill-tertiary-hover',
    'focus-visible:outline-none',
    'focus-visible:bg-fill-tertiary',
    'disabled:opacity-52',
    'disabled:cursor-not-allowed',
    'disabled:hover:bg-transparent',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-6',
        md: 'h-5 w-6',
        lg: 'h-6 w-7',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

// Internal stepper component (NOT exported)
interface NumberInputStepperProps {
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  canIncrement: boolean;
  canDecrement: boolean;
}

function NumberInputStepper({
  size,
  disabled,
  onIncrement,
  onDecrement,
  canIncrement,
  canDecrement,
}: NumberInputStepperProps) {
  return (
    <div className="flex flex-col border-l border-border">
      <button
        type="button"
        className={cn(stepperButtonVariants({ size }))}
        onClick={onIncrement}
        disabled={disabled || !canIncrement}
        aria-label="Increment value"
        tabIndex={-1}
      >
        <Icon icon={CaretUp} size="xs" color={null} />
      </button>
      <button
        type="button"
        className={cn(stepperButtonVariants({ size }), 'border-t border-border')}
        onClick={onDecrement}
        disabled={disabled || !canDecrement}
        aria-label="Decrement value"
        tabIndex={-1}
      >
        <Icon icon={CaretDown} size="xs" color={null} />
      </button>
    </div>
  );
}

export interface NumberInputProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type'>,
    Omit<VariantProps<typeof numberInputWrapperVariants>, 'error'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  leftAddOn?: ReactNode;
  wrapperClassName?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      size = 'lg',
      error = false,
      leftAddOn,
      wrapperClassName,
      className,
      disabled,
      min,
      max,
      step = 1,
      value,
      onChange,
      onKeyDown,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => {
    const currentValue = value !== undefined ? parseFloat(value.toString()) : undefined;

    const canIncrement =
      currentValue !== undefined && max !== undefined
        ? currentValue < max
        : true;

    const canDecrement =
      currentValue !== undefined && min !== undefined
        ? currentValue > min
        : true;

    const createSyntheticEvent = (newValue: number): React.ChangeEvent<HTMLInputElement> => {
      return {
        target: { value: newValue.toString() },
      } as React.ChangeEvent<HTMLInputElement>;
    };

    const handleIncrement = () => {
      if (disabled || !onChange) return;
      const current = currentValue ?? 0;
      const newValue = Math.min(current + step, max ?? Infinity);
      onChange(createSyntheticEvent(newValue));
    };

    const handleDecrement = () => {
      if (disabled || !onChange) return;
      const current = currentValue ?? 0;
      const newValue = Math.max(current - step, min ?? -Infinity);
      onChange(createSyntheticEvent(newValue));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      const current = currentValue ?? 0;
      let newValue: number | undefined;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newValue = Math.min(current + step, max ?? Infinity);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newValue = Math.max(current - step, min ?? -Infinity);
          break;
        case 'PageUp':
          e.preventDefault();
          newValue = Math.min(current + step * 10, max ?? Infinity);
          break;
        case 'PageDown':
          e.preventDefault();
          newValue = Math.max(current - step * 10, min ?? -Infinity);
          break;
        case 'Home':
          if (min !== undefined) {
            e.preventDefault();
            newValue = min;
          }
          break;
        case 'End':
          if (max !== undefined) {
            e.preventDefault();
            newValue = max;
          }
          break;
      }

      if (newValue !== undefined && onChange) {
        onChange(createSyntheticEvent(newValue));
      }

      onKeyDown?.(e);
    };

    return (
      <div className={cn(numberInputWrapperVariants({ size, error }), wrapperClassName)}>
        {leftAddOn && (
          <span className="flex-shrink-0 text-text-tertiary">{leftAddOn}</span>
        )}
        <input
          ref={ref}
          type="number"
          disabled={disabled}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
          aria-invalid={ariaInvalid ?? (error ? true : undefined)}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          className={cn(numberInputVariants({ size }), className)}
          {...props}
        />
        <NumberInputStepper
          size={size}
          disabled={disabled}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          canIncrement={canIncrement}
          canDecrement={canDecrement}
        />
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { numberInputVariants, numberInputWrapperVariants };
```

### Phase 2: Create NumberInputField Wrapper

**File:** `src/ui/inputs/number-input-field.tsx`

Follow the **exact same pattern** as TextInputField (lines 1-204 of text-input-field.tsx), just replace:

- `TextInput` → `NumberInput`
- `TextInputProps` → `NumberInputProps`
- `TextInputFieldProps` → `NumberInputFieldProps`

### Phase 3: Export Configuration

```typescript
// src/ui/inputs/index.ts
export * from './error-message';
export * from './hint';
export * from './input-label';
export * from './text-input';
export * from './text-input-field';
export * from './number-input'; // Add this
export * from './number-input-field'; // Add this
```

---

## Final Recommendations

### Must Implement (Critical)

1. **Create Dedicated Wrapper Variants**
   - Create `numberInputWrapperVariants` (do NOT reuse TextInput wrapper)
   - Adjust right padding to accommodate stepper control
   - Maintain all other styling from textInputWrapperVariants

2. **Stepper as Internal Component**
   - Create `NumberInputStepper` function component
   - Do NOT export from module (internal only)
   - Use tabIndex={-1} to prevent keyboard trap
   - Disable buttons when at min/max boundaries

3. **Hide Native Spinners**
   - Add `[appearance:textfield]` to numberInputVariants
   - Add webkit pseudo-element selectors for Chrome/Safari
   - Ensure only custom stepper is visible

4. **Keyboard Event Handlers**
   - Implement ArrowUp/Down for step increment/decrement
   - Implement PageUp/Down for step \* 10
   - Implement Home/End for min/max (when defined)
   - Call preventDefault() on arrow keys to prevent scroll

### Should Implement (High Priority)

5. **Stepper Click Handlers**
   - Create synthetic ChangeEvent when stepper buttons clicked
   - Ensure event structure matches React's ChangeEvent
   - Trigger onChange callback with synthetic event
   - Works with React Hook Form, Formik, etc.

6. **ARIA Attributes**
   - Add aria-valuemin, aria-valuemax, aria-valuenow
   - Announce current value to screen readers
   - Add aria-label to stepper buttons

7. **Comprehensive Testing**
   - Test stepper button disabled states
   - Test keyboard navigation
   - Test min/max boundaries
   - Test controlled vs uncontrolled
   - Test decimal step values
   - Test negative numbers

### Consider for Future (Nice to Have)

8. **Press-and-Hold for Continuous Increment**
   - Hold mouse button on stepper for continuous change
   - Accelerate increment speed after delay
   - Out of scope for initial implementation

9. **Touch-Friendly Stepper Buttons**
   - Ensure minimum 44px touch target on mobile
   - Consider larger stepper buttons on small screens
   - Already planned in responsive design section

---

## Conclusion

The NumberInput component plan is **architecturally excellent** with one critical clarification needed regarding the stepper control implementation. The plan demonstrates:

- ✅ Perfect understanding of dual API pattern (NumberInput + NumberInputField)
- ✅ Exceptional keyboard accessibility (exceeds standard requirements)
- ✅ Correct atomic design classification (molecule)
- ✅ Comprehensive testing strategy
- ✅ Excellent Storybook documentation
- ✅ Proper CVA variant usage
- ✅ Correct state management approach

**Critical Clarification Needed:**

The stepper control should be implemented as an **internal component** with dedicated wrapper variants, NOT as a `rightAddOn` prop to TextInput. This ensures:

- Proper border and spacing control
- Interactive button elements
- Independent disabled states
- Cleaner architecture

**Recommended Path Forward:**

1. Create `numberInputWrapperVariants` (dedicated, not reusing TextInput)
2. Create `NumberInputStepper` as internal component (not exported)
3. Implement keyboard handlers (ArrowUp/Down, PageUp/Down, Home/End)
4. Hide native spinners with CSS
5. Create NumberInputField following TextInputField pattern exactly
6. Create comprehensive Storybook stories (14 stories)
7. Write unit tests with >90% coverage

**Final Score: 9.5/10**

With the stepper architecture clarification, this becomes a **10/10 architecturally compliant** component that extends the design system perfectly and serves as an excellent example of molecule composition with interactive controls.

---

## Files Referenced

- **Plan:** `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/ai/plans/ui/number-input-plan-2025-11-30.md`
- **TextInput:** `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/inputs/text-input.tsx`
- **TextInputField:** `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/inputs/text-input-field.tsx`
- **Button:** `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/buttons/button.tsx`
- **InputLabel:** `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/inputs/input-label.tsx`
- **TextInput Evaluation:** `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/ai/agents/evaluations/text-input-plan-2025-11-30.md`

---

**Document Version:** 1.0
**Review Date:** 2025-11-30
**Next Review:** After implementation completion
