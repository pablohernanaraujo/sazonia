# Architectural Evaluation: SelectFloatingLabel Component Plan

**Date**: 2025-11-30
**Component**: SelectFloatingLabel
**Plan Location**: `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/ai/plans/ui/select-floating-label-plan-2025-11-30.md`
**Evaluator**: UI/UX Architecture Agent

---

## Executive Summary

**Overall Architectural Alignment Score**: 9.5/10

The SelectFloatingLabel plan demonstrates exceptional architectural alignment with the project's established patterns, particularly the floating label pattern from TextInputFloatingLabel and the Radix Select integration from the existing Select component. This is a well-thought-out plan that correctly composes existing patterns into a cohesive, reusable component.

**Critical Issues Identified**: 0
**Recommendations**: 3 (minor enhancements)
**Positive Patterns Observed**: 9

---

## 1. Atomic Design Classification Review

### Assessment: **CORRECT**

**Classification**: Molecule ✅
**Reasoning Quality**: Excellent ✅

The plan correctly identifies SelectFloatingLabel as a Molecule because it:

- Combines multiple atoms (Icon for chevron, typography for label/text)
- Integrates complex interactive behavior (Radix Select primitive + floating label animation)
- Does not compose other molecules (only atoms and primitives)
- Has a single, focused purpose (select input with floating label)

**Positive Pattern**: The distinction between the standalone molecule (SelectFloatingLabel) and the organism variant (SelectFloatingLabelField that adds Hint and ErrorMessage) demonstrates excellent understanding of atomic design progression. This matches the established pattern from TextInputFloatingLabel/TextInputFloatingLabelField.

**Architecture Validation**: ✅

```
SelectFloatingLabel (Molecule)
├── Icon (Atom) - CaretDown chevron
├── Floating Label (Typography/Atom)
├── Radix Select Primitive (External)
└── Value Display (Typography/Atom)

SelectFloatingLabelField (Organism)
├── SelectFloatingLabel (Molecule)
├── Hint (Atom)
└── ErrorMessage (Atom)
```

---

## 2. Component Composition Strategy Evaluation

### Assessment: **ARCHITECTURALLY EXCELLENT**

**Composition Pattern**: Hybrid Reference Pattern ✅
**Rationale**: Strong ✅
**Implementation Clarity**: Excellent ✅

### Strengths of the Composition Strategy

#### 1. Correct Pattern Synthesis

The plan synthesizes two established patterns perfectly:

**From TextInputFloatingLabel** (lines 90-100):

- `floatingLabelVariants` CVA structure
- Focus/blur state management with `isFocused`
- `shouldFloat` logic based on focus + value state
- Wrapper variants for border/focus states
- Autofill detection pattern
- Left/right add-on support

**From Select** (lines 96-101):

- Radix Select primitive integration
- `SelectSizeContext` for size propagation (though may not need full context for floating variant)
- Trigger/Content/Item compound components
- Size-responsive variants (sm/md/lg)
- Error state styling

**Architectural Excellence**: The plan doesn't just reference these patterns - it identifies the specific architectural elements to reuse (CVA variants, state management, compound variants) and clearly maps how they'll be adapted for the new component.

#### 2. State Management Design

The plan correctly identifies the two critical state variables needed (lines 486-492):

```typescript
// From the plan's "Design Patterns to Follow"
const [isOpen, setIsOpen] = useState(false); // Radix onOpenChange
const [hasValue, setHasValue] = useState(false); // Value detection

const shouldFloat = isOpen || hasValue; // Simple, clear logic
```

**Why This is Correct**:

1. **isOpen**: Radix Select provides `onOpenChange` callback - the plan correctly leverages this
2. **hasValue**: Controlled via `value`/`onValueChange` props - follows React patterns
3. **shouldFloat logic**: Label floats when dropdown opens OR when value selected
4. This matches TextInputFloatingLabel's pattern but adapts for select-specific behavior

#### 3. Compound Variants for Label States

The plan references TextInputFloatingLabel's compound variant pattern (lines 496-502):

```typescript
compoundVariants: [
  { floating: true, focused: true, error: false, className: 'text-primary' },
  {
    floating: true,
    focused: false,
    error: false,
    className: 'text-text-tertiary',
  },
  { error: true, className: 'text-destructive' },
];
```

**Architectural Validation**: ✅ This handles all 9 visual states mentioned in the plan:

1. Empty (not floating, not focused, no error) → text-text-tertiary
2. Hovered (CSS hover, no state change needed)
3. Focused-Open (floating: true, focused: true) → text-primary
4. Selected-Open (floating: true, focused: true, hasValue) → text-primary
5. Selected (floating: true, focused: false, hasValue) → text-text-tertiary
6. Disabled (disabled variant) → text-text-tertiary
7. Disabled-Selected (disabled + hasValue) → text-text-tertiary
8. Error (error: true) → text-destructive
9. Error-Selected (error: true + hasValue) → text-destructive

#### 4. Field Component Pattern

The SelectFloatingLabelField pattern (lines 300-310) follows the established Field organism pattern from SelectField and TextInputFloatingLabelField:

**Consistency Check**: ✅

```typescript
// SelectFloatingLabelField should compose:
1. SelectFloatingLabel (the molecule)
2. Hint (when hint provided and no error)
3. ErrorMessage (when error provided, replaces hint)
4. Auto-generate IDs for ARIA associations (aria-describedby)
5. Support options array for convenience
```

This matches:

- `SelectField` composition pattern (lines 206-262 of select-field.tsx)
- `TextInputFloatingLabelField` composition pattern (lines 86-142 of text-input-floating-label-field.tsx)

**Architectural Consistency Score**: 10/10

---

## 3. Architectural Alignment with Project Patterns

### Assessment: **EXCEPTIONAL ALIGNMENT**

**Score**: 10/10

### CVA Pattern Alignment ✅

**Pattern Observed**: The plan specifies two CVA definitions (lines 68-71):

1. `selectFloatingLabelWrapperVariants` - For the container (border, background, focus states)
2. `floatingLabelSelectVariants` - For the label animation and color states

**Validation Against TextInputFloatingLabel**:

```typescript
// From text-input-floating-label.tsx
textInputFloatingLabelWrapperVariants (lines 18-44)
floatingLabelVariants (lines 55-119)
```

**Alignment**: ✅ Perfect match. The plan follows the exact two-variant pattern:

- Wrapper handles structural states (error, disabled, focus)
- Label handles position/animation states (floating, colors)

### Radix UI Integration Pattern ✅

**Pattern Observed**: The plan references Radix Select integration (lines 96-101, 504):

- `Select.Root` for context provider
- `Select.Trigger` for the clickable button
- `Select.Portal`, `Select.Content`, `Select.Viewport` for dropdown
- `onOpenChange` for state tracking

**Validation Against Select Component**:

```typescript
// From select.tsx
Select (Root) - lines 192-204
SelectTrigger - lines 235-282
SelectContent - lines 325-378
```

**Alignment**: ✅ The plan correctly understands the Radix compound component pattern and knows which primitives to use.

### TypeScript Pattern Alignment ✅

**Expected Pattern from SKILL.md**:

```typescript
export interface ComponentProps
  extends
    ComponentPropsWithoutRef<'element'>,
    VariantProps<typeof componentVariants> {
  // Custom props
}

export const Component = forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, ...props }, ref) => {
    // Implementation
  }
);

Component.displayName = 'Component';
```

**Plan Adherence**: The plan explicitly mentions (lines 283-293):

- `SelectFloatingLabelProps` interface extending Radix types + VariantProps
- `forwardRef` for ref forwarding
- `displayName` setting
- Export of component, variants, and types

**Alignment**: ✅ Perfect adherence to project TypeScript patterns.

### Barrel Export Pattern ✅

**Plan Specification** (lines 66-84):

```typescript
// 1. Create component: src/ui/inputs/select-floating-label.tsx
export {
  SelectFloatingLabel,
  selectFloatingLabelWrapperVariants,
  floatingLabelSelectVariants,
};
export type { SelectFloatingLabelProps };

// 2. Create field component: src/ui/inputs/select-floating-label-field.tsx
export { SelectFloatingLabelField };
export type { SelectFloatingLabelFieldProps };

// 3. Update category barrel: src/ui/inputs/index.ts
export * from './select-floating-label';
export * from './select-floating-label-field';

// 4. Import usage:
import { SelectFloatingLabel, SelectFloatingLabelField } from '@/ui/inputs';
import { SelectFloatingLabel, SelectFloatingLabelField } from '@/ui';
```

**Validation Against Project Pattern**: ✅

- Matches the pattern from select.tsx (exports component + variants + types)
- Follows category barrel export pattern (inputs/index.ts)
- Supports both category and root imports
- Exports both molecule and field organism

### React Import Convention ✅

**SKILL.md Requirement** (lines 62-84):

> All UI components must use direct imports from React, NOT namespace imports.

**Plan Adherence**:

- The plan references TextInputFloatingLabel (lines 1-8) which uses direct imports:
  ```typescript
  import { forwardRef, useEffect, useId, useRef, useState } from 'react';
  ```

**Validation**: ✅ While not explicitly stated in the plan, the reference patterns all use direct imports, ensuring consistency.

---

## 4. Design System Integration Approach

### Assessment: **CORRECT and WELL-INTEGRATED**

**Category Placement**: ✅ Correct
**Export Strategy**: ✅ Correct
**Integration Completeness**: ✅ Excellent

### Category Placement Analysis

**Location**: `src/ui/inputs/select-floating-label.tsx` ✅

**Reasoning from Plan** (lines 60-64):

> This component belongs in the inputs category because it's a form input element that allows users to select from a list of options. It follows the same pattern as other input components like TextInputFloatingLabel and Select that already exist in this category.

**Architectural Validation**:

1. **Semantic Correctness**: Select is a form input → `inputs` category ✅
2. **Pattern Consistency**: Other floating label inputs are in `inputs/` ✅
   - `text-input-floating-label.tsx` ✅
   - `textarea-floating-label.tsx` ✅
3. **Variant Relationship**: Lives alongside related components ✅
   - `select.tsx` (base select)
   - `select-field.tsx` (field wrapper)
   - `select-floating-label.tsx` (floating label variant) ← New
   - `select-floating-label-field.tsx` (field wrapper) ← New

**Category Decision Score**: 10/10

### File Structure Integration

**Planned Files** (lines 127-143):

```
src/ui/inputs/
├── select-floating-label.tsx              (molecule)
├── select-floating-label-field.tsx        (organism)
├── __tests__/select-floating-label.test.tsx
├── __tests__/select-floating-label-field.test.tsx
└── index.ts                               (barrel export)

src/stories/inputs/
└── select-floating-label.stories.tsx      (Storybook)
```

**Validation Against Project Structure**: ✅

- Component files in `src/ui/inputs/` ✅
- Tests in `src/ui/inputs/__tests__/` ✅
- Stories in `src/stories/inputs/` ✅
- Follows kebab-case naming ✅

### Design System Relationships

**Component Ecosystem**:

```
Select Family:
├── Select (base) - Standard select with label above
├── SelectField - Select + InputLabel + Hint + ErrorMessage
├── SelectFloatingLabel (new) - Select with floating label animation
└── SelectFloatingLabelField (new) - SelectFloatingLabel + Hint + ErrorMessage

Floating Label Family:
├── TextInputFloatingLabel - Text input with floating label
├── TextInputFloatingLabelField - Text input field wrapper
├── TextareaFloatingLabel - Textarea with floating label
├── TextareaFloatingLabelField - Textarea field wrapper
├── SelectFloatingLabel (new) - Select with floating label
└── SelectFloatingLabelField (new) - Select field wrapper
```

**Integration Impact**: This component completes the floating label pattern across all major input types (text, textarea, select). Excellent design system completeness.

---

## 5. Potential Architectural Issues and Improvements

### Minor Recommendation 1: Clarify Size Handling (Non-Critical)

**Observation**: The plan references Select's size variants (sm/md/lg) but doesn't explicitly address how size affects the floating label component.

**Select Pattern** (from select.tsx lines 19-26):

```typescript
type SelectSize = 'sm' | 'md' | 'lg';
const SelectSizeContext = createContext<SelectSize>('lg');
```

**Question**: Should SelectFloatingLabel:

1. **Use SelectSizeContext** (like SelectTrigger does)?
2. **Have its own size prop** that maps to appropriate dimensions?
3. **Be fixed at one size** to match the Figma design?

**From the plan's design specs** (lines 164-169):

```
- Container width: 320px (default, full width when in form)
- Padding: px-4 (16px), py-3.5 (14px)
- Label (inline): text-base (16px)
- Label (floating): text-xs (12px)
```

**Recommendation**: The plan should explicitly state size handling approach:

**Option A** (Recommended): Fixed size matching Figma

```typescript
// SelectFloatingLabel is fixed at one size to match design
const selectFloatingLabelWrapperVariants = cva([
  'relative flex items-center',
  'px-4 py-3.5', // Fixed padding
  'rounded-sm border',
]);
```

**Option B**: Size variants like Select

```typescript
variants: {
  size: {
    sm: 'px-3 py-1.5',
    md: 'px-3.5 py-2.5',
    lg: 'px-4 py-3.5',  // Default
  }
}
```

**Impact if not addressed**: Implementation ambiguity, potential inconsistency with design.

**Severity**: LOW (design specs suggest fixed size)

### Minor Recommendation 2: Specify SelectItem Styling Strategy (Non-Critical)

**Observation**: The plan mentions creating SelectFloatingLabelItem (lines 296-299) but then suggests reusing SelectItem from existing Select.

**Question**: Should SelectFloatingLabel:

1. **Reuse SelectItem unchanged** (simpler, consistent)
2. **Create SelectFloatingLabelItem wrapper** (more control, potential customization)
3. **Export SelectItem directly** from the module (convenience)

**From existing Select pattern**:

```typescript
// select.tsx exports SelectItem
export const SelectItem = forwardRef<...>((props, ref) => {
  // Implementation
});
```

**Recommendation**: Clarify the item strategy:

**Option A** (Recommended): Reuse SelectItem

```typescript
// In select-floating-label.tsx
// No SelectFloatingLabelItem needed - use SelectItem from select.tsx

// Usage:
import { SelectFloatingLabel } from '@/ui/inputs';
import { SelectItem } from '@/ui/inputs'; // From existing Select
```

**Option B**: Re-export for convenience

```typescript
// In select-floating-label.tsx
export { SelectItem } from './select';

// Usage:
import { SelectFloatingLabel, SelectItem } from '@/ui/inputs';
```

**Architectural Principle**: DRY (Don't Repeat Yourself). Reusing SelectItem maintains consistency and reduces maintenance burden.

**Impact if not addressed**: Minor implementation inconsistency, potential duplication.

**Severity**: LOW

### Minor Recommendation 3: Document Autofill Detection Strategy (Enhancement)

**Observation**: TextInputFloatingLabel has sophisticated autofill detection (lines 245-297 of text-input-floating-label.tsx):

- Checks `:-webkit-autofill` selector
- Listens for animation events
- Falls back gracefully for Firefox
- Auto-floats label when autofilled

**Question**: Does SelectFloatingLabel need autofill detection?

**Analysis**:

- Native `<select>` elements can be autofilled (e.g., country, state fields)
- Radix Select uses a custom trigger button, not native `<select>`
- Browser autofill may not work with custom select implementations

**Recommendation**: The plan should explicitly address this:

```markdown
## Autofill Handling

**Decision**: Autofill detection is NOT implemented for SelectFloatingLabel.

**Rationale**:

1. Radix Select uses custom trigger (button), not native <select>
2. Browsers do not autofill custom select implementations
3. Autofill detection logic from TextInputFloatingLabel is specific to native inputs
4. If autofill is needed, it should be implemented at the form library level (e.g., React Hook Form) via controlled `value` prop

**Alternative Considered**: Adding autofill detection was considered but rejected as browsers don't autofill Radix Select primitives.
```

**Impact if not addressed**: No functional impact, but clarifies architectural decision.

**Severity**: VERY LOW (documentation enhancement)

---

## 6. Positive Architectural Patterns Observed

The plan demonstrates numerous excellent architectural practices:

### 1. Comprehensive State Management Documentation ✅

**Lines 486-492**: The plan explicitly documents the state logic:

```typescript
// State Management
const isOpen = ...;      // Whether dropdown is open
const hasValue = ...;    // Whether value is selected
shouldFloat = isOpen || hasValue;  // Clear floating logic
```

**Strength**: This prevents implementation confusion and ensures the floating label behavior is predictable and testable.

### 2. Detailed Design Specifications from Figma ✅

**Lines 160-198**: The plan includes pixel-perfect design specifications:

- Exact spacing (px-4, py-3.5, gap-2.5)
- Precise colors with semantic token mapping (#d7dbdf → border-border)
- Typography scale (text-base, text-xs, leading values)
- Animation timing (duration-150, ease-out)
- Transform values (scale-75, -translate-y-1/2)

**Strength**: Eliminates guesswork during implementation, ensures design system fidelity.

### 3. Comprehensive Visual State Coverage ✅

**Lines 9-19**: The plan documents all 9 visual states with clear descriptions:

1. Empty
2. Hovered
3. Focused - Open
4. Selected - Open
5. Selected
6. Disabled
7. Disabled - Selected
8. Error
9. Error - Selected

**Strength**: Ensures all edge cases are designed and tested, prevents "forgotten states" bugs.

### 4. Accessibility-First Planning ✅

**Lines 386-388, 420**: The plan includes comprehensive accessibility testing:

- Correct ARIA attributes (role="combobox", aria-expanded, aria-haspopup)
- Keyboard navigation (Enter, Escape, arrows)
- Screen reader announcements
- ARIA associations (describedby for hint/error)
- Focus management

**Strength**: Accessibility is architected from the start, not retrofitted.

### 5. Dual API Pattern (Molecule + Field) ✅

**Lines 38, 300-310**: The plan correctly implements the dual API pattern:

- **SelectFloatingLabel**: Standalone molecule for custom layouts
- **SelectFloatingLabelField**: Organism with hint/error for standard forms

**Strength**: Provides flexibility (standalone) while optimizing for common case (field wrapper).

**Validation**: This matches established patterns:

- TextInputFloatingLabel / TextInputFloatingLabelField ✅
- Select / SelectField ✅
- TextInput / TextInputField ✅

### 6. Comprehensive Testing Strategy ✅

**Lines 369-411**: The plan outlines thorough testing:

- **Functional**: Rendering, floating logic, controlled/uncontrolled
- **States**: All 9 visual states
- **Accessibility**: ARIA, keyboard navigation, screen readers
- **Edge Cases**: Long labels, many options, RTL, rapid toggling
- **Field Wrapper**: Hint/error integration, ARIA associations

**Strength**: Testing is architectural, not just implementation. Covers user flows, accessibility, and edge cases.

### 7. Storybook Integration as Documentation ✅

**Lines 199-227**: Required Storybook stories include:

1. Default
2. AllStates (visual regression)
3. WithLeftAddOn
4. WithHint
5. WithError
6. WithManyOptions
7. ControlledVsUncontrolled
8. FormIntegration
9. AllCombinations
10. StandaloneVsField

**Strength**: Storybook serves as living documentation, visual testing, and design system showcase.

### 8. Validation-First Approach ✅

**Lines 453-482**: The plan requires 6 validation commands:

1. `npm run type-check` - Type safety
2. `npm run lint` - Code quality
3. `npm test -- select-floating-label` - Component tests
4. `npm run test:run` - No regressions
5. `npm run build` - Production build
6. `npm run build-storybook` - Documentation build

**Strength**: Quality gates prevent architectural violations from merging.

### 9. Clear Implementation Phases ✅

**Lines 228-366**: The plan breaks implementation into logical phases:

1. **Phase 1**: Study existing patterns (research)
2. **Phase 2**: Core implementation (molecule + field)
3. **Phase 3**: Integration (exports, Storybook, tests)

**Strength**: Reduces cognitive load, enables incremental progress tracking.

---

## 7. Design System Impact Assessment

### Impact Level: MEDIUM-HIGH

**Justification**:

1. **Completes Floating Label Pattern**: Extends floating label pattern to all major input types
   - TextInput ✅
   - Textarea ✅
   - Select ✅ (this component)

2. **Enhances Form Consistency**: Enables forms to use floating labels across all input types, creating visual consistency

3. **Radix Integration Precedent**: Demonstrates how to combine Radix primitives with custom animation patterns

4. **No Breaking Changes**: Additive only - doesn't modify existing Select or SelectField

### Design System Evolution

**Before**:

```tsx
// Mixed label patterns in forms
<TextInputFloatingLabel label="Email" />
<TextareaFloatingLabel label="Message" />
<Select>  {/* Different label pattern */}
  <SelectTrigger>...</SelectTrigger>
</Select>
```

**After**:

```tsx
// Consistent floating label pattern
<TextInputFloatingLabel label="Email" />
<TextareaFloatingLabel label="Message" />
<SelectFloatingLabel label="Country" />  {/* Consistent! */}
```

### Recommendations for Design System Documentation

1. **Update Floating Label Pattern Guide**: Document the complete floating label pattern across inputs
2. **Add Radix + Animation Guide**: Document how to integrate Radix primitives with custom animations
3. **Form Consistency Examples**: Show forms using consistent floating label pattern
4. **Migration Guide**: Help teams migrate from Select to SelectFloatingLabel when appropriate

---

## 8. Component Architecture Decision Documentation

The plan excels at documenting architectural decisions:

### Documented Decisions ✅

1. **State Management** (lines 486-492): Explicit state variables and logic
2. **Floating Logic** (lines 491): Clear formula for when label floats
3. **CVA Pattern** (lines 495-502): Compound variants for state combinations
4. **Radix Integration** (line 504): Using `onOpenChange` for open state tracking
5. **Dual API** (lines 38, 300-310): Molecule vs Organism reasoning
6. **File Organization** (lines 127-143): Clear file structure
7. **Design Fidelity** (lines 160-198): Exact design token mapping

### Undocumented Decisions (Minor)

As noted in Recommendations 1-3:

1. Size handling strategy (fixed vs variants)
2. SelectItem reuse vs custom wrapper
3. Autofill detection (not applicable)

**Impact**: These are minor implementation details that can be decided during implementation without affecting architecture.

---

## Final Recommendations

### None Critical - Plan is Ready for Implementation

The SelectFloatingLabel plan is architecturally sound and ready for implementation with only minor clarifications needed during development.

### Optional Enhancements (Non-Blocking)

1. **Add Size Handling Section** (Recommendation 1): Clarify if fixed size or size variants. Suggest fixed size based on Figma specs.

2. **Clarify SelectItem Strategy** (Recommendation 2): Explicitly state that SelectItem from Select will be reused (DRY principle).

3. **Document Autofill Decision** (Recommendation 3): Add brief note that autofill detection is not applicable to Radix Select.

### Pre-Implementation Checklist

Before starting implementation, verify:

- [ ] Figma design link accessible (line 158)
- [ ] All referenced components exist (Icon, Hint, ErrorMessage, Select)
- [ ] CVA and Radix dependencies installed (line 516)
- [ ] Storybook configured for inputs category

**All items expected to be satisfied** ✅

---

## Conclusion

The SelectFloatingLabel plan demonstrates **exceptional architectural quality** and is one of the strongest component plans reviewed. It:

1. **Correctly classifies** the component as a Molecule with clear reasoning
2. **Properly composes** existing patterns (TextInputFloatingLabel + Select) without duplication
3. **Perfectly aligns** with project patterns (CVA, Radix, TypeScript, barrel exports)
4. **Integrates seamlessly** into the design system (correct category, export strategy)
5. **Addresses accessibility** from the architectural level
6. **Provides comprehensive documentation** (Storybook, tests, validation)
7. **Completes a design pattern** (floating labels across all input types)

**Critical Issues**: 0
**Architectural Flaws**: 0
**Blocking Issues**: 0

**Final Score**: 9.5/10

The 0.5 deduction is solely for minor documentation enhancements (size handling, SelectItem strategy, autofill note) that can be addressed during implementation without impacting architecture.

**Recommendation**: **APPROVE FOR IMPLEMENTATION**

This plan is ready to be implemented. The three minor recommendations are optional enhancements that can be addressed during code review or added to the implementation as clarifications arise.

---

## Evaluation Metadata

**Files Reviewed**:

- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/ai/plans/ui/select-floating-label-plan-2025-11-30.md`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/inputs/text-input-floating-label.tsx`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/inputs/select.tsx`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/inputs/select-field.tsx`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/inputs/text-input-floating-label-field.tsx`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/inputs/index.ts`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/.claude/skills/sazonia-ui-components/SKILL.md`

**Reference Patterns**:

- Floating Label Pattern (TextInputFloatingLabel)
- Radix Select Integration (Select)
- Field Wrapper Pattern (SelectField, TextInputFloatingLabelField)
- CVA Variant Pattern
- Dual API Pattern (Molecule + Organism)
- Barrel Export Pattern

**Architectural Principles Applied**:

- Atomic Design Methodology
- Composition over Inheritance
- DRY (Don't Repeat Yourself)
- Single Responsibility Principle
- Progressive Enhancement
- Accessibility First
- Type Safety
- Design System Consistency

**Design Tokens Validated**:

- Spacing: px-4 (16px), py-3.5 (14px), gap-2.5 (10px)
- Border radius: rounded-sm (6px)
- Colors: border-border, border-hover, primary, destructive, text-tertiary
- Typography: text-base (16px), text-xs (12px), font-medium
- Transitions: duration-150, ease-out
- Transforms: scale-75, -translate-y-1/2
