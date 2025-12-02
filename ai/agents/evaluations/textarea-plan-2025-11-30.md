# Textarea Component Plan - Architectural Evaluation

**Date:** 2025-11-30
**Evaluator:** UI/UX Architecture Agent
**Plan Document:** `ai/plans/ui/textarea-plan-2025-11-30.md`

## Executive Summary

**Overall Architectural Alignment:** ✅ EXCELLENT (95/100)

The Textarea component plan demonstrates exceptional architectural alignment with the sazonia-web design system patterns. The plan follows the established TextInput pattern precisely, maintains consistency with existing input components, and adheres to all core architectural principles including CVA patterns, forwardRef usage, and proper composition strategies.

**Key Strengths:**

- Perfect replication of TextInput's dual-API pattern
- Strong adherence to atomic design principles
- Comprehensive file structure matching project conventions
- Excellent barrel export strategy
- Thorough testing and validation planning

**Minor Improvements:**

- Consider extracting shared size mapping constants
- Add explicit migration guide for developers
- Document accessibility edge cases more thoroughly

---

## 1. Atomic Design Classification

### Classification: **Molecule** ✅ CORRECT

**Reasoning:**

The "Molecule" classification is architecturally sound for the following reasons:

1. **Composition from Atoms:**
   - Uses typography tokens (text-sm, text-base) as foundational atoms
   - TextareaField composes InputLabel, Hint, and ErrorMessage atoms
   - Inherits styling patterns from existing design system atoms

2. **Multiple Visual States:**
   - 9 distinct states (empty, hovered, focused, typing, filled, disabled, disabled-filled, error, error-filled)
   - State management adds complexity beyond simple atoms

3. **Building Block Role:**
   - Serves as a reusable building block for form organisms
   - Integrates into larger form contexts while maintaining independence

4. **Comparison with TextInput:**
   ```
   TextInput (Molecule) ← Textarea follows same classification
   ├── Input element with wrapper
   ├── Multiple visual states
   ├── CVA variant management
   └── Composes with atoms (InputLabel, Hint, ErrorMessage)
   ```

**Architectural Alignment:** The classification matches TextInput perfectly, ensuring consistency across the input component family.

---

## 2. Component Composition Strategy

### Dual API Approach: **Textarea + TextareaField** ✅ HIGHLY APPROPRIATE

**Pattern Analysis:**

The plan follows the exact pattern established by TextInput:

```typescript
// Pattern 1: Standalone Textarea (Maximum Flexibility)
<Textarea
  placeholder="Enter description"
  size="lg"
  error={Boolean(errors.description)}
/>

// Pattern 2: TextareaField (Convenience Wrapper)
<TextareaField
  label="Description"
  hint="Enter a detailed description"
  error={errors.description}
  placeholder="Enter description"
/>
```

**Architectural Benefits:**

1. **Separation of Concerns:**
   - `Textarea`: Pure presentation component
   - `TextareaField`: Composition + accessibility layer
   - Clear boundary between styling and form field logic

2. **Flexibility Gradient:**

   ```
   High Flexibility          High Convenience
   ├─────────────────────────┼─────────────────────────┤
   Textarea (standalone)     TextareaField (composed)

   Use when:                 Use when:
   - Custom layouts needed   - Standard form fields
   - Complex label comp      - Quick implementation
   - Manual ARIA control     - Consistent patterns
   ```

3. **Composition Over Inheritance:**
   - No inheritance hierarchies
   - Atoms composed into molecules
   - Follows React composition patterns

4. **Developer Experience:**
   - Beginners default to `TextareaField` (simple, works out-of-box)
   - Advanced users drop to `Textarea` for custom layouts
   - Both approaches feel natural

**Comparison with Alternatives:**

| Approach                                    | Pros                | Cons                              | Verdict              |
| ------------------------------------------- | ------------------- | --------------------------------- | -------------------- |
| **Single Component with Conditional Props** | Simpler API surface | Prop explosion, complexity hidden | ❌ Less maintainable |
| **Only Standalone Component**               | Maximum flexibility | Repetitive boilerplate            | ❌ Poor DX           |
| **Only Field Component**                    | Consistent patterns | No escape hatch                   | ❌ Inflexible        |
| **Dual API (Current)**                      | Best of both worlds | Slightly more files               | ✅ **OPTIMAL**       |

**Architectural Validation:** This is the correct pattern for sazonia-web's design system.

---

## 3. Architectural Alignment with Project Patterns

### CVA, forwardRef, and Composition Patterns: ✅ EXCELLENT

**3.1 CVA Pattern Compliance**

The plan correctly mirrors TextInput's CVA structure:

```typescript
// ✅ Correct Pattern (from plan)
const textareaWrapperVariants = cva(
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
        md: 'gap-2.5 px-3 py-2.5',
        lg: 'gap-3 px-4 py-3',
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
```

**Architectural Strengths:**

1. **Base Classes Array:** Clean separation of static styles
2. **Variant Structure:** Matches TextInput's size/error pattern exactly
3. **Default Variants:** Consistent defaults (lg, false)
4. **Modern CSS Patterns:** Uses `focus-within:` and `has-[:disabled]:`
5. **Semantic Tokens:** Uses design system tokens (`border-border`, `bg-background`)

**3.2 forwardRef Pattern Compliance**

The plan specifies correct ref forwarding:

```typescript
// ✅ Correct Pattern
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ size = 'lg', error = false, wrapperClassName, className, ...props }, ref) => (
    <div className={cn(textareaWrapperVariants({ size, error }), wrapperClassName)}>
      <textarea
        ref={ref}
        className={cn(textareaVariants({ size }), className)}
        aria-invalid={error || undefined}
        {...props}
      />
    </div>
  )
);

Textarea.displayName = 'Textarea';
```

**Architectural Strengths:**

1. **Correct Ref Type:** `HTMLTextAreaElement` (not `HTMLInputElement`)
2. **displayName Set:** Required for React DevTools debugging
3. **Prop Destructuring:** Extracts CVA variants before spreading
4. **Ref Forwarding:** Passes ref to native textarea element
5. **ARIA Attributes:** Handles `aria-invalid` based on error state

**3.3 Composition Pattern Compliance**

The TextareaField composition mirrors TextInputField perfectly:

```typescript
// ✅ Correct Pattern
export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, labelProps, hint, hintProps, error, errorProps, containerClassName, size = 'lg', ...textareaProps }, ref) => {
    const generatedId = useId();
    const inputId = textareaProps.id ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const hasError = Boolean(error);
    const hasHint = Boolean(hint) && !hasError;

    const ariaDescribedBy = textareaProps['aria-describedby'] ?? (hasError ? errorId : hasHint ? hintId : undefined);

    return (
      <div className={cn('flex flex-col', containerClassName)}>
        {label && <InputLabel label={label} htmlFor={inputId} size={INPUT_LABEL_SIZE_MAP[size]} {...labelProps} />}
        <Textarea ref={ref} id={inputId} size={size} error={hasError} aria-describedby={ariaDescribedBy} {...textareaProps} />
        {hasHint && <Hint id={hintId} size={HINT_SIZE_MAP[size]} {...hintProps}>{hint}</Hint>}
        {hasError && error && <ErrorMessage id={errorId} text={error} size={HINT_SIZE_MAP[size]} {...errorProps} />}
      </div>
    );
  }
);
```

**Architectural Strengths:**

1. **useId() Hook:** Automatic ID generation for accessibility
2. **ARIA Association:** Correct `aria-describedby` linking
3. **Size Mapping:** Reuses INPUT_LABEL_SIZE_MAP and HINT_SIZE_MAP constants
4. **Conditional Rendering:** Error replaces hint (prevents visual clutter)
5. **Props Forwarding:** Passes labelProps, hintProps, errorProps to atoms

**Critical Architectural Decision - Size Mapping:**

The plan correctly identifies reusing the existing size mapping:

```typescript
// From TextInputField (REUSE THESE)
const INPUT_LABEL_SIZE_MAP = {
  sm: 'sm', // Not applicable to Textarea (only md, lg)
  md: 'sm',
  lg: 'md',
} as const;

const HINT_SIZE_MAP = {
  sm: 'sm', // Not applicable to Textarea (only md, lg)
  md: 'sm',
  lg: 'md',
} as const;
```

**Recommendation:** Extract these constants to a shared location for better maintainability:

```typescript
// ✅ IMPROVEMENT: Create shared constants file
// src/ui/inputs/constants.ts
export const INPUT_LABEL_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

export const HINT_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

// Import in both TextInputField and TextareaField
import { INPUT_LABEL_SIZE_MAP, HINT_SIZE_MAP } from './constants';
```

**3.4 TypeScript Type Safety**

The plan demonstrates excellent type safety:

```typescript
// ✅ Correct Type Patterns
export interface TextareaProps
  extends
    Omit<ComponentPropsWithoutRef<'textarea'>, 'size'>,
    Omit<TextareaWrapperVariants, 'error'> {
  size?: 'md' | 'lg';
  error?: boolean;
  wrapperClassName?: string;
}

export interface TextareaFieldProps extends Omit<TextareaProps, 'error'> {
  label?: string;
  labelProps?: Partial<Omit<InputLabelProps, 'label' | 'htmlFor'>>;
  hint?: string;
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;
  error?: string; // Note: string instead of boolean
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;
  containerClassName?: string;
}
```

**Architectural Strengths:**

1. **Extends Native Props:** `ComponentPropsWithoutRef<'textarea'>` ensures all textarea attributes work
2. **Omits Conflicts:** Removes native 'size' attribute to avoid conflicts with CVA variant
3. **Error Type Difference:** `Textarea.error` is boolean, `TextareaField.error` is string (correct!)
4. **Props Exclusion:** Uses `Omit` to prevent prop collision (label, htmlFor, id, etc.)
5. **Partial Props:** Allows partial override of child component props

---

## 4. Design System Integration Approach

### Barrel Exports and Import Patterns: ✅ CORRECT

**4.1 Export Strategy**

The plan follows sazonia-web's established export pattern:

```typescript
// ✅ Step 1: Component exports (src/ui/inputs/textarea.tsx)
export { Textarea, textareaVariants, textareaWrapperVariants };
export type { TextareaProps };

// ✅ Step 2: Field exports (src/ui/inputs/textarea-field.tsx)
export { TextareaField };
export type { TextareaFieldProps };

// ✅ Step 3: Category barrel (src/ui/inputs/index.ts)
export * from './textarea';
export * from './textarea-field';

// ✅ Step 4: Root barrel (src/ui/index.ts) - Already exports inputs
export * from './inputs';
```

**Import Patterns Supported:**

```typescript
// ✅ RECOMMENDED: Import from root
import { Textarea, TextareaField } from '@/ui';

// ✅ ALSO VALID: Import from category
import { Textarea, TextareaField } from '@/ui/inputs';

// ❌ AVOID: Direct file imports
import { Textarea } from '@/ui/inputs/textarea';
```

**Architectural Benefits:**

1. **Tree-Shaking:** Next.js 15 optimizes bundling automatically
2. **Consistent Imports:** Same pattern as Button, TextInput, etc.
3. **Single Source of Truth:** Root barrel provides unified API
4. **Refactoring Safety:** Internal paths can change without breaking imports

**4.2 File Naming Convention**

The plan follows kebab-case convention:

```
✅ CORRECT
src/ui/inputs/textarea.tsx
src/ui/inputs/textarea-field.tsx
src/ui/inputs/__tests__/textarea.test.tsx
src/ui/inputs/__tests__/textarea-field.test.tsx
src/stories/inputs/textarea.stories.tsx
```

This matches the project's file naming standards from `code-quality.md`:

> All files must use kebab-case (enforced by ESLint `unicorn/filename-case`)

**4.3 Storybook Integration**

The plan correctly identifies all required story files:

```typescript
// ✅ CORRECT: Single story file covering both components
// src/stories/inputs/textarea.stories.tsx
export default {
  title: 'Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Textarea>;

// 14+ stories covering:
// - Standalone Textarea variants
// - TextareaField compositions
// - Real-world usage examples
// - Comparison stories (WhenToUseWhich)
```

**Architectural Strengths:**

1. **Comprehensive Coverage:** 14+ stories cover all use cases
2. **autodocs Tag:** Automatic documentation generation
3. **Meta Type Safety:** `satisfies Meta<typeof Textarea>`
4. **Real-World Examples:** FormIntegration story shows practical usage
5. **Decision Guide:** WhenToUseWhich helps developers choose correct component

---

## 5. Architectural Issues and Improvements

### Critical Issues: ⚠️ NONE

No critical architectural issues identified. The plan is production-ready.

### Recommendations for Excellence

#### 5.1 Extract Shared Constants (Priority: MEDIUM)

**Current State:**

Size mapping constants duplicated across TextInputField and TextareaField.

**Recommended Improvement:**

```typescript
// ✅ CREATE: src/ui/inputs/constants.ts
export const INPUT_LABEL_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

export const HINT_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

export type InputSize = keyof typeof INPUT_LABEL_SIZE_MAP;

// ✅ UPDATE: src/ui/inputs/index.ts
export * from './constants';

// ✅ USAGE: src/ui/inputs/textarea-field.tsx
import { INPUT_LABEL_SIZE_MAP, HINT_SIZE_MAP } from './constants';
```

**Benefits:**

- Single source of truth for size mapping
- Easier to maintain consistency
- TypeScript autocomplete for valid sizes
- Future components can reuse constants

#### 5.2 Add Migration Guide (Priority: LOW)

**Current State:**

Plan assumes developers understand when to use Textarea vs TextareaField.

**Recommended Addition:**

Add a "Migration from TextInput" section to the plan:

````markdown
## Migration Guide

### When to Use Textarea

Replace TextInput with Textarea when:

- ✅ User needs to enter multi-line text (comments, descriptions, messages)
- ✅ Content may exceed 100 characters
- ✅ Line breaks are meaningful in the content
- ✅ User should see multiple lines at once

Keep TextInput when:

- ❌ Single-line input is sufficient (name, email, URL)
- ❌ Validation requires specific format (no line breaks)
- ❌ Add-ons (leftAddOn, rightAddOn) are needed (Textarea doesn't support these)

### Migration Examples

**Before (TextInput):**

```tsx
<TextInputField label="Email" placeholder="you@example.com" />
```
````

**After (Textarea):**

```tsx
<TextareaField label="Message" placeholder="Enter your message" rows={4} />
```

````

#### 5.3 Document Accessibility Edge Cases (Priority: LOW)

**Current State:**

Plan mentions ARIA attributes but doesn't cover edge cases.

**Recommended Addition:**

Add an "Accessibility Edge Cases" section:

```markdown
## Accessibility Edge Cases

### Character Count Announcements

If implementing character counter:

```tsx
<TextareaField
  label="Bio"
  hint={`${value.length}/${maxLength} characters`}
  aria-describedby={`bio-hint bio-char-count`}
  aria-live="polite" // Announces count changes
  maxLength={maxLength}
/>
````

### Screen Reader Testing

- ✅ Label announces on focus
- ✅ Hint announces after label (via aria-describedby)
- ✅ Error announces and replaces hint
- ✅ Required state announces (via aria-required)
- ✅ Character limits announce (via aria-live)

### Keyboard Navigation

- ✅ Tab: Move focus to textarea
- ✅ Shift+Tab: Move focus away
- ✅ Ctrl+A: Select all text (native)
- ✅ Ctrl+Z: Undo (native)
- ✅ No custom keyboard handlers needed

````

#### 5.4 Add CSS Specificity Notes (Priority: LOW)

**Current State:**

Plan doesn't mention how Textarea fits into CSS cascade layers.

**Recommended Addition:**

```markdown
## CSS Architecture Notes

### Cascade Layer Position

Textarea components use the **utilities** layer for maximum specificity:

```css
/* From globals.css */
@layer vendor, base, components, utilities;

/* CVA variants automatically placed in utilities layer */
````

### Overriding Styles

```tsx
// ✅ Utilities win over wrapper base classes
<Textarea className="bg-primary-50" />
// bg-primary-50 overrides textareaWrapperVariants bg-background

// ✅ wrapperClassName for container overrides
<Textarea wrapperClassName="shadow-lg" />
// Adds shadow to wrapper div

// ❌ Don't use !important
<Textarea className="!bg-red-500" /> // Code smell
```

```

---

## 6. Positive Architectural Patterns

### Strengths Worth Highlighting

1. **Pattern Consistency:** The plan achieves near-perfect consistency with TextInput, making the component family predictable and learnable.

2. **Accessibility First:** ARIA attributes, ID generation, and screen reader support are baked into the design, not added as afterthoughts.

3. **Comprehensive Testing Strategy:** The plan includes unit tests for both components, edge cases, and integration scenarios.

4. **Storybook Excellence:** 14+ stories provide visual documentation, usage examples, and decision guidance.

5. **Validation Rigor:** The plan requires 6 validation commands (type-check, lint, test, build, storybook-build) before completion.

6. **TypeScript Safety:** Strong typing prevents common mistakes (e.g., error being boolean vs string in different components).

7. **Future-Proof Design:** The dual API pattern provides flexibility for future enhancements (character counter, auto-resize, markdown preview).

---

## 7. Comparison with Best Practices

### Industry Standards Alignment

| Pattern | Sazonia Implementation | Industry Best Practice | Verdict |
|---------|------------------------|------------------------|---------|
| **Component API** | Dual API (standalone + composed) | shadcn/ui, Radix UI patterns | ✅ Matches |
| **Ref Forwarding** | forwardRef to native element | React docs recommendation | ✅ Matches |
| **Variant Management** | CVA with TypeScript types | Modern component libraries | ✅ Matches |
| **Accessibility** | ARIA attributes, useId() | WCAG 2.1 AA standards | ✅ Matches |
| **Composition** | Atoms → Molecules → Organisms | Atomic Design methodology | ✅ Matches |
| **File Organization** | Category-based with barrels | Next.js + TypeScript conventions | ✅ Matches |

**Verdict:** The Textarea plan aligns with industry best practices across all dimensions.

---

## 8. Risk Assessment

### Implementation Risks: LOW

| Risk Category | Likelihood | Impact | Mitigation |
|---------------|------------|--------|------------|
| **Breaking Changes** | Low | Medium | Follows existing patterns exactly |
| **Accessibility Issues** | Low | High | Comprehensive ARIA implementation |
| **Type Safety** | Low | Medium | Strong TypeScript types |
| **Performance** | Low | Low | No complex logic, native element |
| **Maintenance Burden** | Low | Low | Consistent with existing components |

**Overall Risk:** ✅ LOW - Safe to implement

---

## 9. Final Recommendations

### Must Have (Before Implementation)

1. ✅ **Implement exactly as planned** - No changes needed to core architecture
2. ✅ **Follow validation checklist** - All 6 commands must pass
3. ✅ **Create all test files** - Unit tests for both components

### Should Have (Nice to Have)

1. 🔄 **Extract size mapping constants** to `src/ui/inputs/constants.ts`
2. 🔄 **Add migration guide** to plan document
3. 🔄 **Document accessibility edge cases** (character count, screen readers)

### Could Have (Future Enhancements)

1. 💡 **Character counter variant** - Optional prop for max length display
2. 💡 **Auto-resize variant** - Grows with content (like GitHub comments)
3. 💡 **Markdown preview variant** - Split pane with live preview
4. 💡 **Rich text toolbar** - Basic formatting buttons (bold, italic, link)

---

## 10. Conclusion

**Architectural Verdict:** ✅ **APPROVED FOR IMPLEMENTATION**

The Textarea component plan is architecturally sound and ready for implementation. It demonstrates:

- **Excellent pattern consistency** with TextInput
- **Correct atomic design classification** as a Molecule
- **Appropriate dual API strategy** (Textarea + TextareaField)
- **Perfect alignment** with CVA, forwardRef, and composition patterns
- **Correct barrel export strategy** and import patterns
- **Comprehensive testing and validation** planning

**Score Breakdown:**

- Atomic Design Classification: 100/100
- Component Composition: 95/100 (minor constant extraction opportunity)
- Architectural Alignment: 100/100
- Design System Integration: 100/100
- Documentation Quality: 90/100 (could add migration guide)

**Overall Score:** 95/100 - EXCELLENT

**Next Steps:**

1. Implement the components following the plan
2. Consider extracting shared constants to reduce duplication
3. Run all validation commands before considering complete
4. Update this evaluation if implementation reveals new insights

---

**Evaluation Completed:** 2025-11-30
**Agent:** UI/UX Architecture Agent
**Status:** ✅ APPROVED
```
