# CheckboxLabel Component Plan - Architectural Evaluation

**Component**: CheckboxLabel
**Plan File**: `ai/plans/ui/checkbox-label-plan-2025-12-01.md`
**Evaluation Date**: 2025-12-01
**Evaluator**: UI/UX Architecture Agent
**Figma Design**: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2044-140541

---

## Executive Summary

**Overall Architectural Alignment**: 65/100 - NEEDS SIGNIFICANT REVISION

The CheckboxLabel component plan demonstrates good understanding of CVA patterns, TypeScript conventions, and testing requirements. However, there is a **CRITICAL ARCHITECTURAL MISALIGNMENT** with the project's established composition patterns. The plan proposes creating CheckboxLabel as a standalone molecule component, but the codebase has already established a **dual API pattern** using the `-field` suffix for field composition wrappers.

**Critical Finding**: The project uses a **TextInputField**, **DateInputField**, **NumberInputField**, **ComboboxField**, **MultiselectField**, and **SelectField** pattern for composing form controls with labels/hints/errors. CheckboxLabel should follow this same pattern and be named **CheckboxField** to maintain architectural consistency.

**Recommendation**: REVISE plan to follow the established `-field` pattern before implementation.

---

## Detailed Evaluation

### 1. Atomic Design Classification: ARCHITECTURAL MISALIGNMENT

**Plan's Classification**: Molecule
**Plan's Reasoning**: "CheckboxLabel combines multiple atoms (Checkbox + typography elements) into a functional unit."

**Critical Issue**: The classification as "Molecule" is technically correct, but the **naming and architecture pattern is inconsistent** with the project's established conventions.

**Evidence from Codebase**:

The project has **11 `-field.tsx` wrapper components** in `src/ui/inputs/`:

```
src/ui/inputs/
├── text-input.tsx              (Atom: standalone input)
├── text-input-field.tsx        (Molecule: input + label + hint + error)
├── date-input.tsx              (Atom: standalone input)
├── date-input-field.tsx        (Molecule: input + label + hint + error)
├── number-input.tsx            (Atom: standalone input)
├── number-input-field.tsx      (Molecule: input + label + hint + error)
├── select.tsx                  (Atom: standalone select)
├── select-field.tsx            (Molecule: select + label + hint + error)
├── combobox.tsx                (Atom: standalone combobox)
├── combobox-field.tsx          (Molecule: combobox + label + hint + error)
├── multiselect.tsx             (Atom: standalone multiselect)
├── multiselect-field.tsx       (Molecule: multiselect + label + hint + error)
```

**Established Pattern**:

- **Base component** (e.g., `TextInput`) = Atom (standalone control)
- **Field wrapper** (e.g., `TextInputField`) = Molecule (control + label + hint + error)

**What the plan proposes**:

- `CheckboxLabel` = Molecule (checkbox + label + caption)

**What should be proposed** (to follow project patterns):

- `Checkbox` = Atom (standalone control) - ALREADY EXISTS ✅
- `CheckboxField` = Molecule (checkbox + label + hint + error)

**Why this matters**:

1. **Naming consistency** - All field wrappers use `-field` suffix
2. **Predictable API** - Developers know `*Field` components compose label/hint/error
3. **Import patterns** - `import { CheckboxField } from '@/ui'` matches `TextInputField`, `SelectField`, etc.
4. **Documentation clarity** - Storybook hierarchy shows clear atom vs. molecule distinction
5. **Future scalability** - What if we need `CheckboxGroup` or `CheckboxCard`? Current naming blocks the hierarchy

**Atomic Design Hierarchy (Corrected)**:

```
Atoms:
- Checkbox (standalone, already exists)
- InputLabel (label with required/help icon)
- Hint (helper text)
- ErrorMessage (error text with icon)

Molecules:
- CheckboxField (checkbox + InputLabel + Hint + ErrorMessage)  ← Should be this
- TextInputField (input + InputLabel + Hint + ErrorMessage)
- SelectField (select + InputLabel + Hint + ErrorMessage)

Organisms:
- CheckboxGroup (multiple CheckboxField components with shared state)
- Form (collection of field molecules)
```

**Score**: 3/10 - Classification is technically correct but naming/pattern is inconsistent

**Required Action**: Rename component to `CheckboxField` to match project conventions

---

### 2. Component Composition Strategy: CRITICAL ARCHITECTURAL DEVIATION

**Plan's Proposed Composition** (lines 19-24):

```typescript
// What the plan describes:
CheckboxLabel combines:
1. Checkbox atom (existing)
2. Label text (typography)
3. Caption text (typography, optional)
4. State propagation (disabled, error to both checkbox and label)
```

**Critical Issues**:

#### Issue 1: Missing Core Field Wrapper Elements

The plan's composition **only includes label and caption**, but the established `-field` pattern includes:

**TextInputField composition** (reference implementation):

```typescript
// src/ui/inputs/text-input-field.tsx (lines 1-182)
export interface TextInputFieldProps extends Omit<TextInputProps, 'error'> {
  // Field-level composition props
  label?: string;
  labelProps?: Partial<Omit<InputLabelProps, 'label' | 'htmlFor'>>;
  hint?: string;
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;
  error?: string;
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;
  containerClassName?: string;
}

// Composes:
// 1. InputLabel (with required, showIcon, description support)
// 2. TextInput (the base control)
// 3. Hint (helper text below input, hidden when error present)
// 4. ErrorMessage (error text, replaces hint when present)
```

**What CheckboxField should compose** (to match project pattern):

```typescript
export interface CheckboxFieldProps extends Omit<CheckboxProps, 'error'> {
  // Field-level composition props
  label?: string;
  labelProps?: Partial<Omit<InputLabelProps, 'label' | 'htmlFor'>>;
  hint?: string;
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;
  error?: string;
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;
  containerClassName?: string;
}

// Should compose:
// 1. InputLabel (or custom label for checkbox layout) ← Need to determine
// 2. Checkbox (the base control)
// 3. Hint (helper text below checkbox)
// 4. ErrorMessage (error text, replaces hint when error present)
```

**Key Difference**: The plan's "caption" is essentially what the project calls "hint" - optional helper text displayed below the field.

#### Issue 2: Label Architecture Incompatibility

**Plan's Label Approach** (lines 127-129):

```
Label: text-primary, no special styling
Caption: secondary text below label (when Hug=False)
```

**Project's InputLabel Component** (from `input-label.tsx`):

```typescript
export interface InputLabelProps {
  label: string;
  required?: boolean; // Red asterisk indicator
  showIcon?: boolean; // Help icon
  helpIconAriaLabel?: string;
  description?: string; // Text below label
  htmlFor?: string; // Associates with input
}

// Renders:
// <label htmlFor={htmlFor}>
//   <span>Label text {required && <span>*</span>}</span>
//   {showIcon && <Icon />}
//   {description && <span>{description}</span>}
// </label>
```

**Problem**: The plan proposes a **simple label string**, but the project's `InputLabel` component provides:

- Required field indicator (red asterisk)
- Help icon for tooltips
- Description text below label
- Proper `htmlFor` association

**Question**: Should CheckboxField use `InputLabel` component, or does checkbox layout require custom label structure?

**Checkbox Layout Consideration**:

Most input fields have this structure (vertical):

```
┌─────────────────────┐
│ Label *            ?│ ← InputLabel (above input)
├─────────────────────┤
│ [Text Input......] │ ← Input control
├─────────────────────┤
│ Hint text or error  │ ← Hint/ErrorMessage (below input)
└─────────────────────┘
```

But checkboxes typically have this structure (horizontal):

```
┌─────────────────────┐
│ [✓] Label text      │ ← Checkbox + label (inline)
│     Caption/hint    │ ← Caption below label (optional)
├─────────────────────┤
│ Error message       │ ← ErrorMessage (below checkbox)
└─────────────────────┘
```

**Architectural Decision Required**:

1. **Option A**: Use `InputLabel` positioned to the right of checkbox (unconventional)
2. **Option B**: Create custom label markup inside `CheckboxField` (diverges from `-field` pattern)
3. **Option C**: Use simple label string + create separate typography markup (plan's approach)

**Analysis of Checkbox in Other Design Systems**:

- **Radix UI Checkbox**: No label composition (developers compose manually)
- **Shadcn/ui**: Uses simple `<label>` wrapper with checkbox + text
- **Material-UI**: `FormControlLabel` component wraps control + label
- **Chakra UI**: `Checkbox` accepts `children` as label content

**Recommendation**: Use **Option C** (plan's approach) because:

- Checkbox label layout is fundamentally different from input labels
- Inline label is standard pattern for checkboxes
- InputLabel is designed for "label above input" pattern
- Custom label markup allows proper horizontal alignment

However, we should still support:

- `required` indicator (red asterisk)
- Caption text (hint) below label
- Error message below checkbox
- Proper `htmlFor` association

#### Issue 3: Missing Hint/Error Composition

**Plan's Composition** (lines 19-24):

- ✅ Checkbox atom
- ✅ Label text
- ✅ Caption text
- ❌ **Missing**: Hint component integration
- ❌ **Missing**: ErrorMessage component integration

**What the plan describes as "caption"** (line 129):

```
Caption font size: 14px (text-sm) for SM, 16px (text-base) for MD/LG
```

**This is actually the "hint" in project terminology**:

```typescript
// From TextInputField (line 28):
hint?: string;  // "Hint text displayed below the input"

// From plan (line 5):
caption?: string;  // "optional caption text"
```

**They're the same concept!** The plan just uses different terminology.

**Missing from plan**: Integration with existing `Hint` and `ErrorMessage` components.

**Evidence from TextInputField** (lines 162-175):

```typescript
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
```

**CheckboxField should follow the same pattern**:

```typescript
// After checkbox + label
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
```

**Score**: 4/10 - Composition concept is partially correct but doesn't align with `-field` pattern

**Required Actions**:

1. Rename "caption" to "hint" to match project terminology
2. Add `ErrorMessage` component integration
3. Follow TextInputField composition pattern
4. Support `labelProps`, `hintProps`, `errorProps` for prop passthrough

---

### 3. Architectural Alignment with Project Patterns: MODERATE ISSUES

#### CVA Pattern Usage: ✅ CORRECT

**Plan's CVA Approach** (lines 212-249):

The plan correctly identifies using CVA for size-based label styling:

```typescript
// Expected pattern:
const checkboxLabelVariants = cva('base classes', {
  variants: {
    size: {
      sm: 'label text-sm, gap-3',
      md: 'label text-base, gap-3',
      lg: 'label text-base, gap-3',
    },
  },
  defaultVariants: { size: 'md' },
});
```

**Comparison with TextInputField**:

TextInputField doesn't use CVA because it's a **composition wrapper**, not a styled primitive. It uses:

```typescript
// Constants for size mapping (lines 5-6):
const HINT_SIZE_MAP = { sm: 'sm', md: 'sm', lg: 'md' };
const INPUT_LABEL_SIZE_MAP = { sm: 'sm', md: 'sm', lg: 'md' };

// Applied in render (lines 138-139):
const labelSize = INPUT_LABEL_SIZE_MAP[size];
const hintSize = HINT_SIZE_MAP[size];
```

**Recommendation for CheckboxField**:

Since CheckboxField is a composition wrapper like TextInputField, it should:

1. **NOT use CVA** for the wrapper itself
2. **Use size mapping constants** to pass appropriate sizes to composed components
3. **Let composed components handle their own styling** via their CVA definitions

```typescript
// CheckboxField should use constants, not CVA:
const CHECKBOX_LABEL_SIZE_MAP = {
  sm: { gap: 'gap-3', labelSize: 'text-sm leading-5' },
  md: { gap: 'gap-3', labelSize: 'text-base leading-6' },
  lg: { gap: 'gap-3', labelSize: 'text-base leading-6' },
} as const;

const CHECKBOX_HINT_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;
```

**Score**: 6/10 - CVA pattern is correct but misapplied to a composition wrapper

#### TypeScript Patterns: ✅ CORRECT

**Plan's TypeScript Structure** (lines 242-246):

```typescript
export interface CheckboxLabelProps extends CheckboxProps {
  label: string;
  caption?: string;
  // ... other props
}
```

**This follows the correct pattern** from TextInputField:

```typescript
export interface TextInputFieldProps extends Omit<TextInputProps, 'error'> {
  label?: string;
  hint?: string;
  error?: string;
  // ... composition props
}
```

**Recommendation**: Should be:

```typescript
export interface CheckboxFieldProps extends Omit<CheckboxProps, 'error'> {
  // Field-level composition props
  label?: string;
  labelClassName?: string; // Custom styling for inline label
  hint?: string;
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;
  error?: string;
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;
  required?: boolean; // Shows asterisk in label
  containerClassName?: string;
}
```

**Score**: 8/10 - TypeScript pattern is mostly correct, needs prop passthrough support

#### forwardRef Pattern: ✅ CORRECT

**Plan's Ref Forwarding** (lines 247-249):

Plan correctly identifies forwarding ref to the Checkbox element.

**Comparison with TextInputField**:

```typescript
export const TextInputField = forwardRef<HTMLInputElement, TextInputFieldProps>(
  (props, ref) => {
    return (
      <div>
        <InputLabel {...labelProps} />
        <TextInput ref={ref} {...inputProps} />  {/* Ref forwarded here */}
        {hint && <Hint />}
      </div>
    );
  }
);
```

**CheckboxField should follow**:

```typescript
export const CheckboxField = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxFieldProps
>((props, ref) => {
  return (
    <div>
      <label>  {/* Wrapper for checkbox + label */}
        <Checkbox ref={ref} {...checkboxProps} />
        <span>{label}</span>
      </label>
      {hint && <Hint />}
      {error && <ErrorMessage />}
    </div>
  );
});
```

**Score**: 10/10 - Ref forwarding pattern is correct

---

### 4. Design System Integration Approach: NEEDS REVISION

#### Export Strategy: INCORRECT FILE NAME

**Plan's Export Pattern** (lines 49-63):

```typescript
// 1. Create component: src/ui/inputs/checkbox-label.tsx
export { CheckboxLabel, checkboxLabelVariants };
export type { CheckboxLabelProps };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './checkbox-label';

// 3. Import usage:
import { CheckboxLabel } from '@/ui';
```

**Project's Established Pattern**:

```
src/ui/inputs/
├── checkbox.tsx              ← Base atom
├── checkbox-field.tsx        ← Field wrapper (should be this)
├── text-input.tsx            ← Base atom
├── text-input-field.tsx      ← Field wrapper
├── select.tsx                ← Base atom
├── select-field.tsx          ← Field wrapper
```

**Correct Export Pattern** (to match project):

```typescript
// 1. Create component: src/ui/inputs/checkbox-field.tsx
export { CheckboxField };
export type { CheckboxFieldProps };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './checkbox';       // Already exists
export * from './checkbox-field'; // Add this

// 3. Import usage:
import { Checkbox, CheckboxField } from '@/ui';

// Usage:
// For custom layouts:
<Checkbox onChange={handleChange} />

// For standard form fields:
<CheckboxField
  label="Accept terms"
  hint="You must accept the terms to continue"
  error={errors.terms}
  required
/>
```

**Why this matters**:

1. **Predictable imports** - All field wrappers follow `*Field` naming
2. **Clear separation** - `Checkbox` = standalone, `CheckboxField` = with label/hint/error
3. **Documentation clarity** - Storybook shows `Checkbox` vs `CheckboxField` usage
4. **Future-proof** - Leaves room for `CheckboxGroup`, `CheckboxCard`, etc.

**Score**: 2/10 - Export strategy is correct pattern but wrong component name

**Required Action**: Rename all references from `CheckboxLabel` to `CheckboxField`

---

### 5. Label Click Interaction: ARCHITECTURAL CONCERN

**Plan's Label Association** (lines 245-246):

> "Ensure label click toggles checkbox (via htmlFor or wrapper label)"

**Critical Analysis**: How should the label be structured for proper click interaction?

**Option 1: htmlFor attribute** (plan mentions):

```typescript
// This is how InputLabel works:
<label htmlFor="checkbox-id">Label text</label>
<Checkbox id="checkbox-id" />
```

**Problem**: Checkbox and label are separate elements, won't achieve inline layout easily.

**Option 2: Wrapper label** (plan mentions):

```typescript
<label className="flex items-center gap-3">
  <Checkbox />
  <span>Label text</span>
</label>
```

**Advantage**: Clicking anywhere on label toggles checkbox (native browser behavior).

**Issue**: Radix Checkbox.Root is a `<button>` element, and nesting `<button>` inside `<label>` can cause issues.

**Radix Checkbox DOM structure**:

```html
<!-- Radix renders: -->
<button type="button" role="checkbox" data-state="checked">
  <span data-state="checked">
    <svg>...</svg>
    <!-- Check icon -->
  </span>
</button>
```

**HTML Specification**: Nesting `<button>` inside `<label>` is valid but can have unexpected behavior.

**Best Practice** (from Radix docs and Shadcn):

```typescript
// Wrap both checkbox and label in a container
<div className="flex items-center gap-3">
  <Checkbox id="terms" />
  <label
    htmlFor="terms"
    className="cursor-pointer text-sm leading-5"
  >
    Accept terms and conditions
  </label>
</div>
```

**Advantage**:

- Clear separation of concerns
- Explicit `htmlFor` association
- No nested interactive elements
- Easy to add hint/error below

**Recommendation**: Use wrapper `<div>` with explicit `htmlFor` association, not wrapper `<label>`.

**Score**: 6/10 - Identifies the need but doesn't specify the correct pattern

**Required Action**: Clarify label structure in plan to use `htmlFor` association, not wrapper label

---

### 6. Accessibility Integration: NEEDS ENHANCEMENT

**Plan's Accessibility** (lines 273-274):

> "Test accessibility (label association, aria attributes, role="checkbox")"

**What's Missing**: The plan doesn't specify how `aria-describedby` should work with hint/error messages.

**TextInputField Accessibility Pattern** (lines 121-134):

```typescript
// Generate unique IDs
const inputId = providedId ?? useId();
const hintId = `${inputId}-hint`;
const errorId = `${inputId}-error`;

// Build aria-describedby
const hasError = Boolean(error);
const hasHint = Boolean(hint) && !hasError;
const ariaDescribedBy =
  providedAriaDescribedBy ??
  (hasError ? errorId : hasHint ? hintId : undefined);

// Apply to input
<TextInput
  id={inputId}
  aria-describedby={ariaDescribedBy}
  aria-invalid={hasError || undefined}
  aria-required={required || undefined}
/>

// Hint with ID
{hasHint && <Hint id={hintId}>{hint}</Hint>}

// Error with ID and role="alert"
{hasError && <ErrorMessage id={errorId} text={error} />}
```

**CheckboxField should follow the same pattern**:

```typescript
const checkboxId = providedId ?? useId();
const hintId = `${checkboxId}-hint`;
const errorId = `${checkboxId}-error`;

<Checkbox
  id={checkboxId}
  aria-describedby={error ? errorId : hint ? hintId : undefined}
  aria-invalid={!!error || undefined}
  aria-required={required || undefined}
/>

<label htmlFor={checkboxId}>
  {label}
  {required && <span className="text-destructive">*</span>}
</label>

{hint && <Hint id={hintId}>{hint}</Hint>}
{error && <ErrorMessage id={errorId} text={error} />}
```

**Missing from plan**:

- ❌ `useId()` hook for ID generation
- ❌ `aria-describedby` pointing to hint or error
- ❌ `aria-invalid` when error is present
- ❌ `aria-required` when required is true
- ❌ Proper ID association between checkbox, label, hint, and error

**Score**: 4/10 - Mentions accessibility but missing critical ARIA implementation details

**Required Action**: Add detailed accessibility requirements matching TextInputField pattern

---

### 7. Size Variant Specifications: MINOR INCONSISTENCIES

**Plan's Size Specifications** (lines 112-118):

| Property                | Size SM          | Size MD          | Size LG          |
| ----------------------- | ---------------- | ---------------- | ---------------- |
| Checkbox size           | 16px (size-4)    | 20px (size-5)    | 24px (size-6)    |
| Gap (checkbox to label) | 12px (gap-3)     | 12px (gap-3)     | 12px (gap-3)     |
| Label font size         | 14px (text-sm)   | 16px (text-base) | 16px (text-base) |
| Label line height       | 20px (leading-5) | 24px (leading-6) | 24px (leading-6) |
| Caption font size       | 14px (text-sm)   | 16px (text-base) | 16px (text-base) |

**Analysis**:

✅ **Checkbox sizes** match existing Checkbox component (lines 66-68 of checkbox.tsx):

```typescript
size: {
  sm: 'size-4', // 16px
  md: 'size-5', // 20px
  lg: 'size-6', // 24px
},
```

✅ **Gap is consistent** across all sizes (gap-3 = 12px)

✅ **Typography scales appropriately** (SM uses text-sm, MD/LG use text-base)

**Comparison with Hint component**:

Hint component has size variants (sm, md):

- `sm`: text-sm (14px)
- `md`: text-base (16px)

**Size Mapping** (CheckboxField size → Hint size):

- CheckboxField SM → Hint sm (14px) ✅ Matches plan's "caption font size"
- CheckboxField MD → Hint sm (14px) ❌ Plan says "caption 16px" - inconsistent!
- CheckboxField LG → Hint md (16px) ✅ Matches plan's "caption font size"

**Issue**: The plan's MD size caption is 16px, but if we map MD → Hint sm, it would be 14px.

**Recommendation**: Use this mapping (matches TextInputField pattern):

```typescript
const CHECKBOX_HINT_SIZE_MAP = {
  sm: 'sm', // 14px
  md: 'sm', // 14px (not 16px as plan states)
  lg: 'md', // 16px
} as const;
```

**Score**: 7/10 - Size specifications are mostly correct but have minor hint size inconsistency

**Required Action**: Correct MD caption/hint size to 14px (text-sm) to match Hint component

---

## Critical Issues Summary

### Critical Issues (Must Fix Before Implementation)

#### 1. Component Naming Violation (CRITICAL)

**Issue**: Plan proposes `CheckboxLabel` but project uses `-field` suffix for composition wrappers.

**Impact**:

- Breaks naming consistency with 11 existing `*Field` components
- Confuses developer mental model (what's the difference between `CheckboxLabel` and `InputLabel`?)
- Blocks future naming (can't have `CheckboxLabel` + `CheckboxLabelGroup`)
- Diverges from established architectural pattern

**Evidence**:

```
Existing: TextInputField, SelectField, DateInputField, etc.
Proposed: CheckboxLabel ← Doesn't match pattern!
Should be: CheckboxField ← Matches pattern
```

**Solution**: Rename component from `CheckboxLabel` to `CheckboxField`

**Files to update**:

- Plan title and all references
- Component file name: `checkbox-field.tsx`
- Component export: `export const CheckboxField`
- Interface: `export interface CheckboxFieldProps`
- Test file: `checkbox-field.test.tsx`
- Story file: `checkbox-field.stories.tsx`

**Priority**: CRITICAL - Must fix before any implementation

---

#### 2. Missing Hint/ErrorMessage Composition (CRITICAL)

**Issue**: Plan only composes Checkbox + label + "caption", but project's `-field` pattern includes Hint + ErrorMessage components.

**Impact**:

- Inconsistent API with other `*Field` components
- Developers can't display error messages the standard way
- No hint text support (only "caption" which is not the same)
- Breaks form validation patterns

**Evidence from TextInputField**:

```typescript
// TextInputField API:
interface TextInputFieldProps {
  label?: string;
  hint?: string;        // Helper text (plan calls this "caption")
  error?: string;       // Error message (MISSING from plan!)
  hintProps?: Partial<HintProps>;
  errorProps?: Partial<ErrorMessageProps>;
}

// Renders:
<InputLabel />
<TextInput />
{hint && <Hint />}
{error && <ErrorMessage />}  // Replaces hint when error present
```

**What plan proposes**:

```typescript
// CheckboxLabel API (from plan):
interface CheckboxLabelProps {
  label: string;
  caption?: string; // This is actually "hint" in project terminology
  // Missing: error prop!
  // Missing: hintProps passthrough!
  // Missing: errorProps passthrough!
}
```

**Solution**: Add complete composition props matching TextInputField pattern:

```typescript
export interface CheckboxFieldProps extends Omit<CheckboxProps, 'error'> {
  // Field composition props
  label?: string;
  labelClassName?: string;
  hint?: string;  // Rename from "caption"
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;
  error?: string;  // Add this
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;
  required?: boolean;
  containerClassName?: string;
}

// Render:
<div className={containerClassName}>
  <div className="flex items-center gap-3">
    <Checkbox id={checkboxId} ref={ref} {...checkboxProps} />
    <label htmlFor={checkboxId}>
      {label}
      {required && <span className="text-destructive">*</span>}
    </label>
  </div>
  {error ? (
    <ErrorMessage id={errorId} text={error} {...errorProps} />
  ) : hint ? (
    <Hint id={hintId} {...hintProps}>{hint}</Hint>
  ) : null}
</div>
```

**Priority**: CRITICAL - Missing core field wrapper functionality

---

#### 3. Missing Accessibility Implementation (HIGH)

**Issue**: Plan mentions accessibility testing but doesn't specify how to implement proper ARIA associations.

**Impact**:

- Screen readers won't announce hint/error messages
- Form validation won't be accessible
- Missing required field indication
- No ID generation strategy

**Missing from plan**:

- `useId()` hook for generating unique IDs
- `aria-describedby` pointing to hint or error
- `aria-invalid` when error state
- `aria-required` for required checkboxes
- Proper ID linking between checkbox, label, hint, error

**Solution**: Add accessibility section to plan:

```typescript
import { forwardRef, useId } from 'react';

export const CheckboxField = forwardRef<HTMLElement, CheckboxFieldProps>(
  ({ label, hint, error, required, id: providedId, ...props }, ref) => {
    // Generate unique IDs
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
            aria-describedby={ariaDescribedBy}
            aria-invalid={hasError || undefined}
            aria-required={required || undefined}
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className="text-sm leading-5 cursor-pointer"
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
  }
);
```

**Priority**: HIGH - Critical for accessibility compliance

---

### Moderate Issues (Should Fix)

#### 4. CVA Misapplication (MODERATE)

**Issue**: Plan proposes using CVA variants for CheckboxField, but project's `-field` components use size mapping constants instead.

**Why this matters**: Field wrappers don't need CVA because they're composition components, not styled primitives. They map sizes to composed components.

**Solution**: Use size mapping constants (like TextInputField):

```typescript
// Don't use CVA for CheckboxField
// Instead, use size mapping:
const CHECKBOX_LABEL_SIZE_MAP = {
  sm: { gap: 'gap-3', fontSize: 'text-sm', lineHeight: 'leading-5' },
  md: { gap: 'gap-3', fontSize: 'text-base', lineHeight: 'leading-6' },
  lg: { gap: 'gap-3', fontSize: 'text-base', lineHeight: 'leading-6' },
} as const;

const CHECKBOX_HINT_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;
```

**Priority**: MODERATE - Affects implementation pattern but not functionality

---

#### 5. Label Structure Ambiguity (MODERATE)

**Issue**: Plan mentions "via htmlFor or wrapper label" but doesn't specify which approach to use.

**Recommendation**: Use explicit `htmlFor` association (not wrapper label):

```typescript
// ✅ Recommended (clear separation):
<div className="flex items-center gap-3">
  <Checkbox id={checkboxId} />
  <label htmlFor={checkboxId} className="cursor-pointer">
    {label}
  </label>
</div>

// ❌ Not recommended (nested button in label):
<label className="flex items-center gap-3">
  <Checkbox />  {/* Renders as <button>, nesting issue */}
  <span>{label}</span>
</label>
```

**Priority**: MODERATE - Affects implementation approach

---

## Positive Patterns & Architectural Strengths

### Excellent Design Decisions

1. **Comprehensive Planning** ✅
   - Detailed size specifications from Figma
   - Complete story requirements (10 stories)
   - Thorough testing strategy
   - Clear acceptance criteria

2. **Figma Alignment** ✅
   - Precise size mapping (16px, 20px, 24px)
   - Correct gap specification (12px consistent)
   - Accurate typography scales
   - State coverage (default, hover, focus, disabled, error)

3. **Testing Coverage** ✅
   - Size variant tests
   - State tests (disabled, error)
   - Interaction tests (click label, keyboard)
   - Accessibility tests
   - Edge cases identified

4. **Storybook Completeness** ✅
   - 10 comprehensive stories planned
   - Interactive controls configured
   - Real-world examples (CheckboxGroup, FormValidation)
   - Complete variant matrix

5. **TypeScript Patterns** ✅
   - Extends base Checkbox props
   - forwardRef usage
   - Type exports planned

6. **Ref Forwarding** ✅
   - Correctly identifies forwarding to Checkbox
   - Proper usage for form integration

---

## Recommended Revised Architecture

### File Structure

```
src/ui/inputs/
├── checkbox.tsx                      # Base atom (already exists)
├── checkbox-field.tsx                # NEW: Field wrapper (this component)
├── __tests__/
│   ├── checkbox.test.tsx            # Exists
│   └── checkbox-field.test.tsx      # NEW

src/stories/inputs/
├── checkbox.stories.tsx              # Exists
└── checkbox-field.stories.tsx        # NEW
```

### Component Interface (Revised)

````typescript
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

/**
 * CheckboxField - A complete checkbox form field with label, hint, and error message.
 *
 * This is a composition wrapper that combines:
 * - Checkbox (the base control)
 * - Label text with optional required indicator
 * - Hint text (helper text below checkbox)
 * - ErrorMessage (error text that replaces hint when present)
 *
 * Use this component for standard form fields. For custom layouts,
 * use the base `Checkbox` component with manual composition.
 *
 * @example
 * ```tsx
 * import { CheckboxField } from '@/ui';
 *
 * // Basic usage
 * <CheckboxField label="Accept terms" />
 *
 * // With required indicator
 * <CheckboxField label="Accept terms" required />
 *
 * // With hint text
 * <CheckboxField
 *   label="Subscribe to newsletter"
 *   hint="You can unsubscribe at any time"
 * />
 *
 * // With error message
 * <CheckboxField
 *   label="Accept terms"
 *   required
 *   error="You must accept the terms to continue"
 * />
 *
 * // Full featured
 * <CheckboxField
 *   size="lg"
 *   label="Accept privacy policy"
 *   required
 *   hint="Read our privacy policy"
 *   error={errors.privacy}
 *   checked={values.privacy}
 *   onCheckedChange={handleChange}
 * />
 * ```
 */
export const CheckboxField = forwardRef<
  React.ComponentRef<typeof Checkbox>,
  CheckboxFieldProps
>(
  (
    {
      // Field-level props
      label,
      labelClassName,
      hint,
      hintProps,
      error,
      errorProps,
      required = false,
      containerClassName,
      // Checkbox props
      size = 'md',
      id: providedId,
      'aria-describedby': providedAriaDescribedBy,
      ...checkboxProps
    },
    ref
  ) => {
    // Generate unique IDs using useId()
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

    // Get label and hint sizes for current checkbox size
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

CheckboxField.displayName = 'CheckboxField';
````

### Export Pattern

```typescript
// src/ui/inputs/index.ts
export * from './checkbox'; // Base atom
export * from './checkbox-field'; // Field wrapper
// ... other exports
```

### Usage Examples

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

// Custom layout (use base Checkbox instead)
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

---

## Validation Checklist

### Architectural Compliance

- [ ] ❌ Component named `CheckboxField` (not `CheckboxLabel`)
- [ ] ❌ File named `checkbox-field.tsx` (not `checkbox-label.tsx`)
- [ ] ✅ Extends base `CheckboxProps` correctly
- [ ] ❌ Includes `hint` prop (not just `caption`)
- [ ] ❌ Includes `error` prop with ErrorMessage integration
- [ ] ❌ Includes `hintProps` and `errorProps` for passthrough
- [ ] ❌ Uses `useId()` for ID generation
- [ ] ❌ Implements `aria-describedby` pointing to hint/error
- [ ] ❌ Uses size mapping constants (not CVA for wrapper)
- [ ] ✅ forwardRef pattern correctly applied
- [ ] ✅ displayName set
- [ ] ✅ TypeScript types properly structured
- [ ] ❌ Export pattern matches `-field` convention
- [ ] ✅ Comprehensive Storybook stories planned
- [ ] ✅ Testing strategy is thorough

### Pattern Alignment

- [ ] ❌ Matches TextInputField composition pattern
- [ ] ❌ Matches DateInputField composition pattern
- [ ] ❌ Matches SelectField composition pattern
- [ ] ❌ Uses established size mapping approach
- [ ] ❌ Follows hint/error replacement pattern
- [ ] ❌ Implements proper ARIA associations
- [ ] ✅ Follows Checkbox size specifications
- [ ] ✅ Uses semantic color tokens

### Design System Integration

- [ ] ❌ Component fits `-field` naming convention
- [ ] ✅ Component location correct (`src/ui/inputs/`)
- [ ] ❌ Export enables `import { CheckboxField } from '@/ui'`
- [ ] ✅ Size scale aligns with Checkbox atom
- [ ] ✅ Spacing uses project tokens (gap-3)
- [ ] ✅ Typography uses project tokens (text-sm, text-base)

---

## Conclusion

### Final Assessment: NEEDS SIGNIFICANT REVISION

**Overall Score**: 65/100

**Breakdown**:

- Atomic Design Classification: 3/10 (technically correct but wrong naming pattern)
- Component Composition: 4/10 (missing Hint/ErrorMessage integration)
- CVA Pattern Usage: 6/10 (CVA misapplied to composition wrapper)
- TypeScript Patterns: 8/10 (mostly correct, needs prop passthrough)
- forwardRef Usage: 10/10 (correct pattern)
- Export Patterns: 2/10 (wrong component name)
- Accessibility: 4/10 (mentioned but missing implementation)
- Size Specifications: 7/10 (correct but minor hint size issue)
- Testing Strategy: 10/10 (comprehensive and thorough)
- Storybook Coverage: 10/10 (excellent story planning)

**Critical Issues Preventing Implementation**:

1. **Component naming violation** - Must be `CheckboxField`, not `CheckboxLabel`
2. **Missing error composition** - No ErrorMessage integration
3. **Incomplete API** - Missing `hintProps`, `errorProps`, `required`
4. **No accessibility implementation** - Missing `useId()`, `aria-describedby`, `aria-invalid`
5. **Terminology mismatch** - "caption" should be "hint"

**Strengths to Preserve**:

1. ✅ Excellent Figma analysis and size specifications
2. ✅ Comprehensive testing strategy (>90% coverage)
3. ✅ Complete Storybook story planning (10 stories)
4. ✅ Correct ref forwarding approach
5. ✅ Thorough edge case identification
6. ✅ Clear acceptance criteria

**Required Actions Before Implementation**:

### Must Do (Critical)

1. **Rename component** from `CheckboxLabel` to `CheckboxField` throughout plan
2. **Add ErrorMessage composition** with error prop and errorProps passthrough
3. **Rename "caption"** to "hint" to match project terminology
4. **Add accessibility implementation** section with `useId()`, `aria-describedby`, `aria-invalid`, `aria-required`
5. **Add prop passthrough** support: `hintProps`, `errorProps`, `required`
6. **Revise CVA approach** to use size mapping constants instead
7. **Clarify label structure** to use `htmlFor` association (not wrapper label)

### Should Do (High Priority)

8. **Add size mapping constants** section to match TextInputField pattern
9. **Add hint/error replacement logic** (error replaces hint when present)
10. **Update import examples** to show `CheckboxField` naming
11. **Add reference to TextInputField** as the composition pattern to follow

### Nice to Have

12. **Add usage comparison** (when to use Checkbox vs CheckboxField)
13. **Add form library integration examples** (React Hook Form)
14. **Document migration path** from manual composition to CheckboxField

**Recommendation**: **DO NOT PROCEED** with implementation until plan is revised to align with established `-field` composition pattern. The component will not integrate properly with the existing design system architecture if implemented as currently specified.

**Next Steps**:

1. Revise plan to rename component to `CheckboxField`
2. Add complete Hint/ErrorMessage composition
3. Add accessibility implementation details
4. Review revised plan for architectural compliance
5. Proceed to implementation after approval

---

## Reviewer Notes

**Reviewed By**: UI/UX Architecture Agent
**Review Date**: 2025-12-01
**Status**: NEEDS REVISION ⚠️
**Next Steps**: Revise plan per critical issues, re-submit for architectural review
**Follow-up**: After revision, review updated plan before implementation begins

**Additional Context**:

The developer may not have been aware of the established `-field` pattern when creating this plan. The project has 11 existing field wrapper components that follow a consistent architecture. This review identifies those patterns and provides specific guidance for alignment.

The core concept of the component (checkbox with label and helper text) is sound and needed. The implementation strategy just needs to match the project's established conventions for composition wrappers.
