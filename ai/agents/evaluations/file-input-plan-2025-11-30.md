# FileInput Component Plan - Architectural Evaluation

**Date**: 2025-11-30
**Component**: FileInput (Molecule)
**Plan File**: `/ai/plans/ui/file-input-plan-2025-11-30.md`
**Evaluator**: UI/UX Architecture Agent

---

## Executive Summary

**Overall Architectural Alignment**: ✅ Excellent (9/10)

The FileInput plan demonstrates strong architectural alignment with the sazonia-web design system patterns. The component is properly classified as a molecule, follows CVA patterns, and composes existing atoms correctly. However, there is a critical architectural issue: the plan attempts to compose atoms that are designed to be standalone, rather than following the established field pattern.

**Key Strengths**:

- Correct atomic design classification
- Proper CVA variant structure
- Comprehensive state management planning
- Excellent accessibility considerations
- Thorough documentation approach

**Critical Issue Identified**:

- ❌ **Composition Pattern Mismatch**: The plan proposes composing standalone atoms (InputLabel, Hint, ErrorMessage) directly, but the codebase has an established **Field pattern** for this (see TextInputField, NumberInputField)

---

## 1. Atomic Design Classification Evaluation

### Classification: Molecule ✅

**Assessment**: **CORRECT**

The plan correctly classifies FileInput as a molecule-level component.

**Rationale**:

- Composes multiple atoms: InputLabel, Hint, ErrorMessage, FileInputButton
- Represents a single, functional unit (file selection)
- Provides a complete, reusable form field pattern
- Not complex enough to be an organism (no business logic, state coordination)

**Comparison with Similar Components**:

| Component           | Classification | Atoms Composed                                  | Purpose                     |
| ------------------- | -------------- | ----------------------------------------------- | --------------------------- |
| TextInputField      | Molecule       | InputLabel, Hint, ErrorMessage, TextInput       | Complete text input field   |
| NumberInputField    | Molecule       | InputLabel, Hint, ErrorMessage, NumberInput     | Complete number input field |
| FileInput (Planned) | Molecule       | InputLabel, Hint, ErrorMessage, FileInputButton | Complete file input field   |

**Alignment**: Perfect alignment with existing molecule patterns.

---

## 2. Component Composition Strategy Evaluation

### Composition Approach: Partial Mismatch ⚠️

**Assessment**: **NEEDS REVISION**

The plan proposes composing atoms directly, which is architecturally valid but inconsistent with the established codebase pattern.

### Current Plan Composition:

```
FileInput (Molecule)
├── InputLabel (Atom)
├── Display Area (Custom styled div)
├── FileInputButton (Atom)
├── Hint (Atom)
└── ErrorMessage (Atom)
```

### Issue: Missing "Field" Pattern

**Observation**: The codebase has a clear pattern:

1. **Standalone Input Components** (atoms/simple molecules):
   - `TextInput` - Just the input control with add-ons
   - `NumberInput` - Just the input control with stepper
   - `FileInputButton` - Just the button control

2. **Field Wrapper Components** (molecules):
   - `TextInputField` - Composes TextInput + InputLabel + Hint + ErrorMessage
   - `NumberInputField` - Composes NumberInput + InputLabel + Hint + ErrorMessage
   - `FileInputField` - Should compose FileInput + InputLabel + Hint + ErrorMessage

### Recommended Architecture:

The plan should be split into TWO components:

#### Component 1: `FileInput` (Atom/Simple Molecule)

Just the file input control itself:

```
FileInput
├── Display Area (styled div showing filename/placeholder)
├── FileInputButton (Browse/Remove/Cancel button)
└── Hidden native input element
```

**Props**: size, error, disabled, value, onChange, onRemove, onCancel, className, wrapperClassName

**Ref**: Forwards to native file input

**Responsibility**: Visual file input control only (like TextInput)

#### Component 2: `FileInputField` (Molecule)

The complete form field composition:

```
FileInputField
├── InputLabel (when label provided)
├── FileInput (the control)
├── Hint (when hint provided, no error)
└── ErrorMessage (when error provided)
```

**Props**: All FileInput props + label, labelProps, hint, hintProps, error, errorProps, containerClassName

**Ref**: Forwards to FileInput's ref

**Responsibility**: Form field composition with accessibility linking (like TextInputField)

### Why This Matters:

1. **Consistency**: TextInputField and NumberInputField follow this exact pattern
2. **Composability**: Users can use FileInput standalone for custom layouts
3. **Reusability**: FileInput can be reused in complex scenarios where InputLabel needs custom content
4. **Separation of Concerns**: FileInput focuses on input control, FileInputField focuses on form field composition

**Example Use Cases**:

```tsx
// Use FileInput directly for custom layouts
<div>
  <div className="flex items-center justify-between">
    <InputLabel label="Resume" htmlFor="resume" />
    <button>Clear</button>
  </div>
  <FileInput id="resume" />
</div>

// Use FileInputField for standard form fields
<FileInputField
  label="Resume"
  hint="PDF or Word document"
  error={errors.resume}
/>
```

---

## 3. Architectural Pattern Alignment

### CVA Pattern Alignment: ✅ Excellent

**Assessment**: **CORRECT**

The plan follows CVA patterns correctly:

```typescript
// From plan
const fileInputWrapperVariants = cva(
  [...baseClasses],
  {
    variants: {
      size: { sm: ..., md: ..., lg: ... },
      error: { true: ..., false: ... }
    },
    defaultVariants: { size: 'lg', error: false }
  }
);
```

**Strengths**:

- Uses CVA for styling variants
- Defines clear size variants (sm, md, lg)
- Includes error state variant
- Sets appropriate default variants
- Follows the exact pattern from TextInput, NumberInput

**Comparison with TextInput**:

| Aspect           | TextInput  | FileInput (Planned) | Alignment |
| ---------------- | ---------- | ------------------- | --------- |
| CVA usage        | ✅         | ✅                  | Perfect   |
| Size variants    | sm, md, lg | sm, md, lg          | Perfect   |
| Error variant    | boolean    | boolean             | Perfect   |
| Wrapper variants | Separate   | Separate            | Perfect   |
| Input variants   | Separate   | Separate            | Perfect   |

### forwardRef Pattern: ✅ Correct

**Assessment**: **CORRECT**

The plan specifies using forwardRef to forward ref to the native file input element, which is the correct pattern.

```typescript
// Correct pattern from plan
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ size, error, ... }, ref) => {
    return (
      <div className={wrapperStyles}>
        <input ref={ref} type="file" ... />
      </div>
    );
  }
);
```

**Alignment**: Matches TextInput, NumberInput, FileInputButton patterns perfectly.

### Size Mapping Pattern: ✅ Correct

**Assessment**: **CORRECT**

If following the Field pattern recommendation, the plan should include size mapping like TextInputField:

```typescript
const INPUT_LABEL_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

const HINT_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;
```

This is already established in TextInputField and should be reused.

---

## 4. Design System Integration

### Semantic Tokens: ✅ Excellent

**Assessment**: **CORRECT**

The plan uses semantic design tokens correctly:

**Colors**:

- ✅ `border-border` (not raw colors)
- ✅ `border-border-hover`
- ✅ `border-primary` (focus state)
- ✅ `border-destructive` (error state)
- ✅ `bg-background`, `bg-background-secondary`
- ✅ `text-text-primary`, `text-text-tertiary`

**Spacing**:

- ✅ Uses Tailwind spacing scale (px-4, py-3, gap-3)
- ✅ Consistent with TextInput sizing

**Border Radius**:

- ✅ `rounded-sm` (6px) for lg/md
- ✅ `rounded-xs` (4px) for sm
- ✅ Matches design system guidelines

**Typography**:

- ✅ `text-base leading-6` for lg
- ✅ `text-sm leading-5` for sm/md
- ✅ Consistent with Typography system

### Shadow Usage: ✅ Correct

**Assessment**: **CORRECT**

The plan specifies error shadow correctly:

```css
/* From plan */
shadow-[0px_0px_0px_3px_#fdd8d3]
```

**Recommendation**: Consider using a semantic shadow token instead:

```tsx
// Better approach
className="shadow-destructive-ring"

// In globals.css
@theme inline {
  --shadow-destructive-ring: 0px 0px 0px 3px #fdd8d3;
}
```

This is a minor suggestion for better token consistency.

### State Management: ✅ Excellent

**Assessment**: **CORRECT**

The plan correctly identifies all necessary states:

| State     | Visual Treatment                      | Button Text | Notes                |
| --------- | ------------------------------------- | ----------- | -------------------- |
| Empty     | Placeholder, default border           | Browse      | Initial state        |
| Uploading | File name, spinner                    | Cancel      | Active upload        |
| Uploaded  | File name + size                      | Remove      | Success state        |
| Disabled  | Gray bg, opacity                      | Disabled    | Interaction blocked  |
| Error     | Destructive border + shadow + message | Browse      | Validation failure   |
| Hover     | Darker border                         | -           | Interactive feedback |
| Focus     | Primary border + ring                 | -           | Keyboard navigation  |

**Alignment**: Matches TextInput state progression perfectly.

---

## 5. Accessibility Evaluation

### ARIA Attributes: ✅ Excellent

**Assessment**: **CORRECT**

The plan includes proper ARIA attributes:

```typescript
// From plan specifications
- aria-describedby (links to hint or error)
- aria-invalid (when error state)
- aria-label (for screen readers)
- role="alert" (for ErrorMessage)
```

**Strengths**:

- Proper aria-describedby linking
- Correct aria-invalid usage
- Screen reader support via sr-only pattern
- Error announcement via role="alert"

**Comparison with TextInputField**:

| ARIA Attribute   | TextInputField | FileInput (Planned) | Alignment  |
| ---------------- | -------------- | ------------------- | ---------- |
| aria-describedby | ✅             | ✅                  | Perfect    |
| aria-invalid     | ✅             | ✅                  | Perfect    |
| aria-required    | ✅             | ⚠️ Missing          | Should add |
| role="alert"     | ✅             | ✅                  | Perfect    |

**Recommendation**: Add `aria-required` support when label has required prop.

### Keyboard Navigation: ✅ Excellent

**Assessment**: **CORRECT**

The plan supports keyboard navigation:

- Browse button triggers file input via click
- Focus management preserved
- Hidden input remains keyboard accessible via sr-only

---

## 6. Architectural Issues & Improvements

### Critical Issue: Component Split Needed ❌

**Issue**: The plan proposes creating a single `FileInput` component that includes both the input control AND the field composition (label, hint, error).

**Impact**:

- Inconsistent with TextInputField/NumberInputField pattern
- Reduces composability
- Violates single responsibility principle

**Recommendation**: Split into TWO components:

1. **FileInput** (src/ui/inputs/file-input.tsx)
   - Just the input control (display + button + native input)
   - Props: size, error, disabled, value, onChange, onRemove, onCancel
   - Ref: native file input

2. **FileInputField** (src/ui/inputs/file-input-field.tsx)
   - Composition wrapper
   - Props: FileInput props + label, labelProps, hint, hintProps, error, errorProps
   - Ref: forwards to FileInput

**Code Example**:

```typescript
// file-input.tsx
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ size, error, value, onChange, ... }, ref) => {
    return (
      <div className={wrapperVariants({ size, error })}>
        <div className={displayVariants({ size })}>
          {value?.name || placeholder}
        </div>
        <FileInputButton size={size} error={error}>
          {getButtonText(value)}
        </FileInputButton>
        <input ref={ref} type="file" className="sr-only" ... />
      </div>
    );
  }
);

// file-input-field.tsx
export const FileInputField = forwardRef<HTMLInputElement, FileInputFieldProps>(
  ({ label, hint, error, labelProps, hintProps, errorProps, ...inputProps }, ref) => {
    const generatedId = useId();
    const inputId = inputProps.id ?? generatedId;

    return (
      <div className="flex flex-col">
        {label && <InputLabel label={label} htmlFor={inputId} {...labelProps} />}
        <FileInput ref={ref} id={inputId} error={Boolean(error)} {...inputProps} />
        {hint && !error && <Hint>{hint}</Hint>}
        {error && <ErrorMessage text={error} {...errorProps} />}
      </div>
    );
  }
);
```

### Minor Issue: Display Area Implementation ⚠️

**Issue**: The plan doesn't specify whether the display area should be a styled div or should reuse TextInput styling.

**Recommendation**:

- DO NOT reuse TextInput component (it's an input element, not a display)
- Create custom CVA variants for the display area that MATCH TextInput styling
- This maintains visual consistency while preserving semantic HTML

```typescript
// Correct approach
const fileInputDisplayVariants = cva(
  [
    'min-w-0 flex-1',
    'bg-transparent',
    'text-text-primary',
    'truncate', // For long file names
  ],
  {
    variants: {
      size: {
        sm: 'text-sm leading-5',
        md: 'text-sm leading-5',
        lg: 'text-base leading-6',
      },
      hasValue: {
        true: 'text-text-primary',
        false: 'text-text-tertiary', // Placeholder color
      },
    },
  }
);
```

### Minor Issue: State Type Definition ⚠️

**Issue**: The plan mentions a `state` prop: `'empty' | 'uploading' | 'uploaded' | 'disabled' | 'error'`

**Problem**: This is redundant and conflicts with controlled props.

**Recommendation**: Remove the `state` prop. State should be derived from:

- `value` (determines empty/uploading/uploaded)
- `disabled` prop (determines disabled)
- `error` prop (determines error)

```typescript
// BAD - state prop
<FileInput state="uploading" value={file} />

// GOOD - derived state
<FileInput value={{ name: 'file.pdf', progress: 50 }} />

// Component derives: isUploading = value && value.progress !== undefined
```

---

## 7. Testing Strategy Evaluation

### Test Coverage: ✅ Excellent

**Assessment**: **CORRECT**

The plan includes comprehensive test coverage:

- Rendering tests (all states)
- Size variant tests
- Interaction tests (onChange, onRemove, onCancel)
- Accessibility tests (ARIA attributes)
- Ref forwarding tests
- Edge cases (long file names, file size formatting)

**Alignment**: Matches TextInputField test strategy.

---

## 8. Storybook Documentation

### Story Coverage: ✅ Excellent

**Assessment**: **CORRECT**

The plan includes 14 comprehensive stories:

- Default, AllSizes, AllStates
- WithLabel, WithHint, WithError
- UploadingState, UploadedState
- DisabledStates, ErrorStates
- CompleteMatrix (size × state grid)
- InteractiveDemo (functional)
- FormIntegration
- AccessibilityExample

**Strength**: Very thorough documentation approach.

**Recommendation**: If splitting into FileInput + FileInputField:

- Create stories for both components
- FileInput stories: Focus on input control variations
- FileInputField stories: Focus on form field compositions

---

## 9. File Organization Evaluation

### File Structure: ✅ Correct

**Assessment**: **CORRECT**

The plan specifies correct file locations:

- Component: `src/ui/inputs/file-input.tsx`
- Tests: `src/ui/inputs/__tests__/file-input.test.tsx`
- Stories: `src/stories/inputs/file-input.stories.tsx`

**If Following Recommendation** (add these files):

- Component: `src/ui/inputs/file-input-field.tsx`
- Tests: `src/ui/inputs/__tests__/file-input-field.test.tsx`
- Stories: `src/stories/inputs/file-input-field.stories.tsx`

### Barrel Exports: ✅ Correct

**Assessment**: **CORRECT**

The plan correctly specifies barrel export updates:

```typescript
// src/ui/inputs/index.ts
export * from './file-input';
export * from './file-input-field'; // Add if following recommendation
```

---

## 10. API Design Evaluation

### Props Interface: ⚠️ Needs Refinement

**Current Plan**:

```typescript
interface FileInputProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  value?: FileInputValue;
  placeholder?: string;
  onChange?: (file: File) => void;
  onRemove?: () => void;
  onCancel?: () => void;
}
```

**Issue**: Mixes input control props with field composition props.

**Recommended Split**:

```typescript
// FileInput - Just the control
interface FileInputProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'size' | 'type' | 'onChange' | 'value'
> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean; // Boolean, not string
  value?: FileInputValue;
  placeholder?: string;
  onChange?: (file: File | null) => void;
  onRemove?: () => void;
  onCancel?: () => void;
  wrapperClassName?: string;
}

// FileInputField - Complete form field
interface FileInputFieldProps extends Omit<FileInputProps, 'error'> {
  label?: string;
  labelProps?: Partial<Omit<InputLabelProps, 'label' | 'htmlFor'>>;
  hint?: string;
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;
  error?: string; // String for message
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;
  containerClassName?: string;
}
```

**Rationale**: Matches TextInputField API exactly.

### FileInputValue Type: ✅ Correct

**Assessment**: **CORRECT**

The plan proposes:

```typescript
type FileInputValue = {
  name: string;
  size?: string; // "2.5 MB"
  progress?: number; // 0-100 for uploading
};
```

**Strengths**:

- Clear structure
- Supports all states (uploaded, uploading)
- Size is formatted string (good for display)

**Minor Suggestion**: Consider adding `file` property for the actual File object:

```typescript
type FileInputValue = {
  name: string;
  size?: string;
  progress?: number;
  file?: File; // Actual File object
};
```

---

## 11. Implementation Recommendations

### Priority 1: Critical - Component Split

**Action**: Split the plan into two component plans:

1. **FileInput Plan** (standalone control)
   - Focus: Input control only (display + button + native input)
   - Location: `src/ui/inputs/file-input.tsx`
   - Atoms composed: FileInputButton only
   - Classification: Atom or Simple Molecule

2. **FileInputField Plan** (form field composition)
   - Focus: Complete form field
   - Location: `src/ui/inputs/file-input-field.tsx`
   - Molecules composed: FileInput + InputLabel + Hint + ErrorMessage
   - Classification: Molecule

### Priority 2: High - Remove State Prop

**Action**: Remove the `state` prop from the API. State should be derived from:

- `value` prop (determines empty/uploading/uploaded)
- `disabled` prop
- `error` prop

### Priority 3: Medium - Add aria-required

**Action**: Add aria-required support in FileInputField when labelProps.required is true:

```typescript
<FileInput
  aria-required={labelProps?.required || undefined}
  ...
/>
```

### Priority 4: Low - Semantic Shadow Token

**Action**: Consider adding semantic token for error shadow instead of hardcoded value:

```css
/* src/styles/shadows.css */
--shadow-destructive-ring: 0px 0px 0px 3px #fdd8d3;
```

---

## 12. Positive Architectural Patterns

### Excellent Decisions:

1. ✅ **Correct atomic classification** (Molecule)
2. ✅ **CVA usage** for styling variants
3. ✅ **forwardRef** for ref forwarding
4. ✅ **Size variants** matching design system (sm, md, lg)
5. ✅ **Semantic tokens** usage throughout
6. ✅ **Comprehensive state coverage** (empty, uploading, uploaded, disabled, error)
7. ✅ **Accessibility-first approach** (ARIA attributes, keyboard navigation)
8. ✅ **Thorough testing strategy** (>90% coverage goal)
9. ✅ **Excellent Storybook documentation** (14 stories planned)
10. ✅ **Proper file organization** (component, tests, stories)

---

## 13. Comparison with Existing Patterns

### TextInputField Pattern Analysis:

| Aspect            | TextInputField                       | FileInput (Planned)             | Recommendation                        |
| ----------------- | ------------------------------------ | ------------------------------- | ------------------------------------- |
| Component split   | TextInput + TextInputField           | FileInput only                  | Split into FileInput + FileInputField |
| Label composition | TextInputField composes InputLabel   | FileInput composes InputLabel   | Move to FileInputField                |
| Hint composition  | TextInputField composes Hint         | FileInput composes Hint         | Move to FileInputField                |
| Error composition | TextInputField composes ErrorMessage | FileInput composes ErrorMessage | Move to FileInputField                |
| Size mapping      | Uses INPUT_LABEL_SIZE_MAP            | Not specified                   | Add to FileInputField                 |
| ARIA linking      | useId() for unique IDs               | Not specified                   | Add to FileInputField                 |
| Ref forwarding    | Forwards to TextInput                | Forwards to native input        | Correct                               |

**Conclusion**: The plan should closely mirror TextInputField's architecture.

---

## 14. Final Recommendations

### Must Fix:

1. **Split into two components**: FileInput (control) + FileInputField (composition)
   - Reason: Consistency with TextInputField/NumberInputField pattern
   - Impact: High - Affects entire component architecture

2. **Remove state prop**: Derive state from value/disabled/error
   - Reason: Simplifies API, prevents conflicts
   - Impact: Medium - Affects API design

### Should Fix:

3. **Add aria-required support**: In FileInputField
   - Reason: Accessibility completeness
   - Impact: Low - Small addition

4. **Clarify display area implementation**: Custom CVA variants, not TextInput reuse
   - Reason: Semantic HTML, styling consistency
   - Impact: Medium - Affects implementation approach

### Nice to Have:

5. **Consider semantic shadow token**: For error ring shadow
   - Reason: Token consistency
   - Impact: Low - Minor improvement

6. **Add file property to FileInputValue**: For accessing File object
   - Reason: Developer convenience
   - Impact: Low - Optional enhancement

---

## 15. Architectural Score Breakdown

| Category                  | Score | Weight | Weighted Score |
| ------------------------- | ----- | ------ | -------------- |
| Atomic Classification     | 10/10 | 15%    | 1.5            |
| Component Composition     | 6/10  | 20%    | 1.2            |
| CVA Pattern Alignment     | 10/10 | 15%    | 1.5            |
| Design System Integration | 9/10  | 15%    | 1.35           |
| Accessibility             | 9/10  | 10%    | 0.9            |
| Testing Strategy          | 10/10 | 10%    | 1.0            |
| Documentation             | 10/10 | 5%     | 0.5            |
| API Design                | 7/10  | 10%    | 0.7            |

**Total Weighted Score**: 8.65/10

**Grade**: B+ (Very Good, with one critical pattern issue)

---

## Conclusion

The FileInput plan demonstrates **excellent architectural thinking** with proper atomic classification, CVA usage, accessibility considerations, and comprehensive documentation. The plan shows deep understanding of the design system and follows most established patterns correctly.

However, there is **one critical architectural inconsistency**: the plan proposes creating a single FileInput component that combines both the input control and field composition, which conflicts with the established TextInputField/NumberInputField pattern in the codebase.

### Recommended Action Plan:

1. **Revise the plan** to split into FileInput (control) + FileInputField (composition)
2. **Follow TextInputField** as the reference architecture
3. **Remove the state prop** in favor of derived state
4. **Add aria-required** support for completeness
5. **Proceed with implementation** using the revised architecture

Once revised, this component will be a **perfect addition** to the design system, maintaining architectural consistency and providing a complete, accessible file input solution.

---

## References

**Existing Patterns**:

- `/src/ui/inputs/text-input.tsx` - Standalone input control
- `/src/ui/inputs/text-input-field.tsx` - Form field composition
- `/src/ui/inputs/number-input.tsx` - Another standalone control example
- `/src/ui/inputs/file-input-button.tsx` - Atom being composed

**Design System Documentation**:

- `/.claude/skills/sazonia-ui-components/SKILL.md` - Component patterns
- `/.claude/rules/styling-guidelines.md` - Design tokens and styling

**Similar Evaluations**:

- `/ai/agents/evaluations/text-input-plan-2025-11-30.md` (if exists)
- `/ai/agents/evaluations/number-input-plan-2025-11-30.md` (if exists)
