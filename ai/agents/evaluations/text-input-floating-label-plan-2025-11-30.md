# TextInputFloatingLabel Component Plan - Architectural Evaluation

**Date:** 2025-11-30
**Component:** TextInputFloatingLabel
**Evaluation Type:** Pre-Implementation Plan Review
**Evaluator:** UI/UX Architecture Agent

---

## Executive Summary

**Overall Assessment:** APPROVED WITH CRITICAL RECOMMENDATIONS

**Architectural Alignment Score:** 7.5/10

The TextInputFloatingLabel plan demonstrates solid understanding of the project's component patterns, CVA usage, and atomic design principles. However, there is a **critical architectural concern** regarding atomic design classification and component composition strategy that must be addressed before implementation.

**Critical Issue Identified:**
The plan classifies this as a "Molecule" and proposes creating a standalone component, but based on the existing architecture (TextInput + TextInputField pattern), this should be implemented as **two separate components** following the same separation of concerns.

---

## Architectural Assessment

### 1. Atomic Design Classification Analysis

**Current Plan Classification:** Molecule

**Architectural Concern:** PARTIALLY INCORRECT

#### The Issue

The plan correctly identifies that a floating label input is more complex than an atom, but it misses a crucial architectural pattern already established in the codebase:

**Existing Pattern:**

- `TextInput` (Molecule) - Standalone input with add-ons, NO label/hint/error
- `TextInputField` (Organism) - Composition wrapper that adds InputLabel, Hint, ErrorMessage

**Proposed Pattern in Plan:**

- `TextInputFloatingLabel` - Single component that combines everything

**What Should Actually Exist:**

1. `TextInputFloatingLabel` (Molecule) - Input with integrated floating label animation, add-ons support
2. `TextInputFloatingLabelField` (Organism) - Composition wrapper with Hint/ErrorMessage atoms

#### Why This Matters

The existing architecture deliberately separates:

- **Molecule (Input):** Core input functionality, visual states, add-ons
- **Organism (Field):** Composition layer that adds label, hint, error, accessibility wiring

This separation provides:

1. **Flexibility:** Users can compose manually when they need custom layouts (e.g., label with "Forgot password?" link)
2. **Reusability:** The input can be used standalone without label overhead
3. **Consistency:** All input patterns follow the same architecture
4. **Maintainability:** Changes to label/hint/error behavior happen in one place

#### Recommended Classification

**Component 1: TextInputFloatingLabel**

- **Type:** Molecule
- **Reasoning:** Combines multiple atoms (native input, floating label element, add-on containers) with complex state-based animation logic
- **Composition:** Input element + floating label + left/right add-ons
- **Does NOT include:** Hint, ErrorMessage (those are composed at the Field level)

**Component 2: TextInputFloatingLabelField**

- **Type:** Organism
- **Reasoning:** Composes the molecule with atoms (Hint, ErrorMessage) to create a complete form field
- **Composition:** TextInputFloatingLabel + Hint + ErrorMessage
- **Provides:** ID management, aria-describedby wiring, error state coordination

---

### 2. Component Composition Strategy

**Current Plan:** ✅ GOOD (but incomplete)

**Strengths:**

- Correctly identifies composition with Hint and ErrorMessage atoms
- Properly references existing typography atoms (TextSm, TextXs)
- Plans to use Icon atom for add-ons

**Critical Gap:**
The plan mentions composition with Hint/ErrorMessage but doesn't clearly separate the **standalone input component** from the **field wrapper component**.

**Recommended Architecture:**

```typescript
// FILE 1: src/ui/inputs/text-input-floating-label.tsx
// MOLECULE - Standalone input with floating label
export const TextInputFloatingLabel = forwardRef<HTMLInputElement, TextInputFloatingLabelProps>(
  ({ label, required, error, leftAddOn, rightAddOn, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = Boolean(props.value || props.defaultValue);
    const shouldFloat = isFocused || hasValue;

    return (
      <div className={wrapperVariants({ error })}>
        <label className={labelVariants({ floating: shouldFloat, error })}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
        <div className="flex items-center">
          {leftAddOn && <span>{leftAddOn}</span>}
          <input
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={inputVariants()}
            {...props}
          />
          {rightAddOn && <span>{rightAddOn}</span>}
        </div>
      </div>
    );
  }
);

// FILE 2: src/ui/inputs/text-input-floating-label-field.tsx
// ORGANISM - Complete field with hint/error composition
export const TextInputFloatingLabelField = forwardRef<HTMLInputElement, TextInputFloatingLabelFieldProps>(
  ({ label, hint, error, hintProps, errorProps, ...inputProps }, ref) => {
    const inputId = useId();
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col">
        <TextInputFloatingLabel
          ref={ref}
          id={inputId}
          label={label}
          error={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          aria-invalid={error ? true : undefined}
          {...inputProps}
        />
        {hint && !error && <Hint id={hintId} {...hintProps}>{hint}</Hint>}
        {error && <ErrorMessage id={errorId} text={error} {...errorProps} />}
      </div>
    );
  }
);
```

**Why Two Components:**

1. **Use Case 1 - Standalone (needs custom layout):**

   ```tsx
   <div className="flex items-center justify-between">
     <TextInputFloatingLabel label="Password" />
     <button type="button">Forgot password?</button>
   </div>
   ```

2. **Use Case 2 - Complete field (most common):**
   ```tsx
   <TextInputFloatingLabelField
     label="Email"
     hint="We'll never share your email"
     error={errors.email}
   />
   ```

---

### 3. Architectural Pattern Alignment

**CVA Usage:** ✅ EXCELLENT

The plan correctly identifies the need for CVA variants for:

- Wrapper (border, background, focus states)
- Floating label (position, color, size based on state)
- Input (typography, colors)

**Recommendation:** Add compound variants for the floating label state:

```typescript
const floatingLabelVariants = cva('absolute left-3 transition-all duration-150', {
  variants: {
    floating: {
      true: 'top-0 -translate-y-1/2 scale-75 bg-background px-1',
      false: 'top-1/2 -translate-y-1/2 scale-100',
    },
    error: {
      true: 'text-destructive',
      false: 'text-text-tertiary',
    },
    focused: {
      true: 'text-primary',
      false: '',
    },
  },
  compoundVariants: [
    {
      floating: true,
      error: false,
      focused: false,
      className: 'text-text-tertiary',
    },
    {
      floating: true,
      focused: true,
      className: 'text-primary',
    },
    {
      error: true,
      className: 'text-destructive', // Always destructive when error
    },
  ],
  defaultVariants: {
    floating: false,
    error: false,
    focused: false,
  },
});
```

**forwardRef Usage:** ✅ CORRECT

Plan correctly identifies the need for ref forwarding to the native input element.

**TypeScript Patterns:** ✅ EXCELLENT

Props extend `ComponentPropsWithoutRef<'input'>` - matches existing pattern.

---

### 4. Design System Integration

**Token Usage:** ✅ EXCELLENT

The plan correctly identifies all design tokens:

- Border radius: `--radius-sm` (6px)
- Spacing: `--spacing-3xl`, `--spacing-xxl`, `--spacing-lg`
- Colors: Semantic tokens (`text-base-primary`, `border-brand-solid`, etc.)
- Typography: Maps to existing atoms (TextSm, TextXs)

**Shadow Usage:** ⚠️ MISSING

The Figma design doesn't show shadows, but consider if focus state should include a subtle shadow for depth:

```typescript
focus-within:shadow-md
```

**Animation Performance:** ✅ EXCELLENT

Plan correctly identifies CSS transitions with GPU-accelerated transforms:

- `transform: translateY() scale()` ✅
- `transition-all duration-150` ✅
- Background clipping for "notch" effect ✅

---

### 5. State Management Architecture

**Current Plan:** ✅ GOOD (needs clarification)

**States Identified:** All 9 states from Figma correctly identified

**State Management Approach:**

The plan should clarify that state detection needs:

```typescript
const [isFocused, setIsFocused] = useState(false);
const hasValue = Boolean(props.value || props.defaultValue);
const shouldFloat = isFocused || hasValue || Boolean(props.placeholder);
```

**Critical: Autofill Detection**

The plan mentions autofill in "Notes" but doesn't provide implementation strategy. This is CRITICAL for the floating label pattern:

```typescript
// Add to component
useEffect(() => {
  if (!ref.current) return;

  // Detect autofill via :autofill pseudo-class
  const checkAutofill = () => {
    const autofilled = ref.current?.matches(':-webkit-autofill');
    setIsAutofilled(autofilled);
  };

  checkAutofill();

  // Some browsers delay autofill
  const timer = setTimeout(checkAutofill, 500);

  return () => clearTimeout(timer);
}, []);

const shouldFloat = isFocused || hasValue || isAutofilled;
```

---

### 6. Accessibility Architecture

**Current Plan:** ✅ GOOD

**Correctly Identifies:**

- `aria-invalid` for error states
- `aria-describedby` linking to hint/error
- `aria-required` for required fields
- Label association via `htmlFor`/`id`

**Recommendations:**

1. **Required Indicator Semantics:**

   ```tsx
   {
     required && (
       <>
         <span aria-hidden="true" className="text-destructive">
           *
         </span>
         <span className="sr-only">required</span>
       </>
     );
   }
   ```

2. **Label Always Visible (even when floating):**
   The floating label must maintain its semantic association. The plan correctly handles this by keeping the `<label>` element, not replacing it with a `<span>`.

3. **Error Announcement:**
   ```tsx
   <ErrorMessage
     id={errorId}
     text={error}
     role="alert" // Automatically added by ErrorMessage component
   />
   ```

---

## Critical Issues (Must Fix Before Implementation)

### Issue 1: Missing Field Wrapper Component

**Severity:** CRITICAL

**Problem:** Plan proposes a single component but should follow the established pattern of separate Input and Field components.

**Impact:**

- Breaks architectural consistency
- Reduces flexibility for custom layouts
- Creates maintenance debt

**Solution:**
Create TWO components:

1. `TextInputFloatingLabel` (Molecule) - Just the input with floating label
2. `TextInputFloatingLabelField` (Organism) - Composition with Hint/ErrorMessage

**Files to Create:**

```
src/ui/inputs/text-input-floating-label.tsx        (Molecule)
src/ui/inputs/text-input-floating-label-field.tsx  (Organism)
src/ui/inputs/__tests__/text-input-floating-label.test.tsx
src/ui/inputs/__tests__/text-input-floating-label-field.test.tsx
src/stories/inputs/text-input-floating-label.stories.tsx
```

### Issue 2: Autofill Detection Strategy Not Defined

**Severity:** HIGH

**Problem:** Browser autofill can pre-fill inputs before React hydration, causing the label to overlap the autofilled value.

**Impact:** Poor UX when browsers autofill forms

**Solution:** Add autofill detection logic:

```typescript
const [isAutofilled, setIsAutofilled] = useState(false);

useEffect(() => {
  if (!inputRef.current) return;

  const checkAutofill = () => {
    const matches = inputRef.current?.matches(':-webkit-autofill');
    setIsAutofilled(matches);
  };

  // Check immediately
  checkAutofill();

  // Check after browsers typically autofill
  const timer = setTimeout(checkAutofill, 500);

  // Listen for animation (some browsers fire this on autofill)
  inputRef.current.addEventListener('animationstart', (e) => {
    if (e.animationName === 'onAutoFillStart') {
      setIsAutofilled(true);
    }
  });

  return () => clearTimeout(timer);
}, []);
```

Plus CSS:

```css
@keyframes onAutoFillStart {
  from {
    /*empty*/
  }
  to {
    /*empty*/
  }
}

input:-webkit-autofill {
  animation-name: onAutoFillStart;
}
```

### Issue 3: Label Background "Notch" Effect Not Fully Specified

**Severity:** MEDIUM

**Problem:** Plan mentions "background clip to create notch effect" but doesn't specify the implementation.

**Impact:** Floating label may not have proper background, causing overlap with border

**Solution:** Specify the exact implementation:

```typescript
const floatingLabelVariants = cva(
  'absolute left-3 px-1 transition-all duration-150',
  {
    variants: {
      floating: {
        true: 'top-0 -translate-y-1/2 scale-75 bg-background',
        false: 'top-1/2 -translate-y-1/2 scale-100 bg-transparent',
      },
    },
  }
);
```

The `bg-background px-1` creates the "notch" by adding white background with padding that overlaps the border.

---

## Recommendations (Should Implement)

### 1. Add Size Variants (Future Enhancement)

**Priority:** LOW (can be added later)

The existing TextInput has `sm`, `md`, `lg` size variants. Consider adding size support to TextInputFloatingLabel for consistency:

```typescript
variants: {
  size: {
    sm: 'text-sm', // Label 10px when floating
    md: 'text-sm', // Label 12px when floating
    lg: 'text-base', // Label 12px when floating
  }
}
```

However, the Figma design only shows one size (16px → 12px), so this can be deferred to a future iteration.

### 2. Improve Label Animation Easing

**Priority:** MEDIUM

The plan specifies `transition-all duration-150` but doesn't specify easing. Material Design uses a specific easing curve for floating labels:

```css
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
```

Recommended:

```typescript
className = 'transition-all duration-150 ease-out';
```

### 3. Consider Placeholder Interaction

**Priority:** MEDIUM

The plan doesn't clarify how placeholder interacts with the floating label. Recommendation:

**When label is NOT floating:** No placeholder shown (label acts as placeholder)
**When label IS floating:** Show placeholder inside input

```typescript
<input
  placeholder={shouldFloat ? props.placeholder : undefined}
  {...props}
/>
```

### 4. Add Controlled/Uncontrolled Mode Examples

**Priority:** HIGH (for Storybook)

The plan mentions a "Controlled" story but doesn't specify implementation. Add clear examples:

```tsx
// Controlled
const [value, setValue] = useState('');
<TextInputFloatingLabel
  label="Email"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// Uncontrolled
<TextInputFloatingLabel
  label="Email"
  defaultValue="user@example.com"
/>
```

---

## Positive Patterns (Excellent Work)

### 1. Comprehensive State Coverage ✅

The plan identifies all 9 visual states from Figma:

- Empty, Hovered, Focused, Typing, Filled
- Disabled, Disabled-Filled
- Error, Error-Filled

This demonstrates thorough design analysis.

### 2. Proper Token Usage ✅

The plan correctly maps all Figma specifications to design tokens:

- Colors → Semantic tokens (not raw colors)
- Spacing → CSS variables
- Border radius → `--radius-sm`
- Typography → Existing atoms (TextSm, TextXs)

### 3. Animation Performance Awareness ✅

The plan specifically calls out GPU-accelerated transforms and CSS transitions, demonstrating understanding of performance best practices.

### 4. Accessibility Considerations ✅

The plan includes:

- ARIA attributes (aria-invalid, aria-describedby, aria-required)
- Semantic HTML (proper `<label>` element)
- Required indicator accessibility

### 5. Comprehensive Testing Strategy ✅

The plan includes:

- Unit tests with 90% coverage target
- Edge case identification (autofill, long text, etc.)
- Accessibility testing

### 6. Complete Storybook Documentation ✅

The plan specifies 8 required stories covering:

- Default state
- All visual states
- Add-on variations
- Hint/Error integration
- Form integration
- Controlled/Uncontrolled modes
- Comprehensive combinations

---

## Implementation Priority & Sequence

### Phase 1: Core Components (CRITICAL)

1. ✅ Create `TextInputFloatingLabel` component (Molecule)
   - Wrapper with CVA variants
   - Floating label logic with state management
   - Add-on support (left/right)
   - Autofill detection
   - Ref forwarding

2. ✅ Create `TextInputFloatingLabelField` component (Organism)
   - Composition wrapper
   - ID management with useId()
   - Aria-describedby wiring
   - Hint/ErrorMessage integration

### Phase 2: Testing (CRITICAL)

3. ✅ Unit tests for `TextInputFloatingLabel`
   - Rendering tests
   - State transition tests (empty → focused → filled)
   - Autofill detection test
   - Add-on rendering
   - Accessibility tests

4. ✅ Unit tests for `TextInputFloatingLabelField`
   - Composition tests
   - Hint/Error conditional rendering
   - ARIA wiring tests

### Phase 3: Documentation (REQUIRED)

5. ✅ Storybook stories
   - Default
   - AllStates (9 states)
   - WithAddons
   - WithHint
   - WithError
   - FormIntegration
   - Controlled
   - AllCombinations

6. ✅ Update barrel exports
   - Add to `src/ui/inputs/index.ts`
   - Verify root barrel export

### Phase 4: Validation (REQUIRED)

7. ✅ Run all validation commands
   - `npm run type-check`
   - `npm run lint`
   - `npm test -- text-input-floating-label`
   - `npm run test:run`
   - `npm run build`
   - `npm run build-storybook`

---

## Architecture Compliance Checklist

### Component Structure

- ✅ Component in correct category (`src/ui/inputs/`)
- ✅ File name is kebab-case
- ✅ Uses direct React imports (not namespace)
- ✅ Uses `forwardRef` for ref forwarding
- ✅ Sets `displayName` for debugging
- ⚠️ **CRITICAL:** Split into TWO components (Input + Field)

### Props & Types

- ✅ Props extend `ComponentPropsWithoutRef<'input'>`
- ✅ Variants defined with CVA
- ✅ Props include `VariantProps<typeof variants>`
- ✅ TypeScript types exported
- ✅ No `any` types used

### Styling

- ✅ Uses `cn()` to merge className
- ✅ Default variants specified
- ✅ Semantic color tokens (not raw colors)
- ✅ Design system tokens (spacing, radius)
- ✅ GPU-accelerated animations

### Accessibility

- ✅ ARIA attributes when needed
- ✅ Semantic HTML elements
- ✅ Keyboard navigation support
- ✅ Focus states defined

### Integration

- ✅ Added to category barrel export
- ✅ Added to root barrel export
- ✅ Storybook stories created
- ✅ Unit tests created

---

## Final Recommendation

**APPROVED FOR IMPLEMENTATION WITH CRITICAL MODIFICATIONS**

The TextInputFloatingLabel plan is well-researched and demonstrates strong understanding of the project's architecture. However, it MUST be modified to follow the established Input/Field pattern before implementation.

### Required Changes:

1. **Split into TWO components:**
   - `TextInputFloatingLabel` (Molecule)
   - `TextInputFloatingLabelField` (Organism)

2. **Add autofill detection logic** to prevent label overlap

3. **Clarify label background "notch" implementation**

4. **Add placeholder interaction logic**

### Optional Enhancements:

1. Add size variants (deferred to future)
2. Improve animation easing curve
3. Add comprehensive Storybook examples

### Estimated Complexity:

- **Original Plan:** 6-8 hours
- **With Required Changes:** 8-10 hours (due to two-component architecture)

### Risk Assessment:

- **Technical Risk:** LOW (well-defined pattern exists)
- **UX Risk:** MEDIUM (autofill detection must work perfectly)
- **Maintenance Risk:** LOW (follows established patterns)

---

## Questions for Clarification

1. **Autofill Behavior:** Should the label stay floated after autofill, or return to placeholder position if user clears the autofilled value?

2. **Placeholder Text:** Should placeholder be visible when label is in the non-floating state, or only when floating?

3. **Size Variants:** Does the Figma design include multiple sizes, or just the one shown (16px → 12px)?

4. **Error State Animation:** Should the label animate to red immediately on error, or only after user interaction?

5. **RTL Support:** Does the project need RTL (right-to-left) language support for the floating label?

---

## Conclusion

The TextInputFloatingLabel plan is architecturally sound but requires a critical modification to align with the established Input/Field separation pattern. With the recommended changes, this component will:

- Maintain architectural consistency with existing input patterns
- Provide flexibility for custom layouts
- Follow atomic design principles correctly
- Integrate seamlessly with the design system
- Support all required accessibility standards

**Implementation should proceed with the two-component architecture.**
