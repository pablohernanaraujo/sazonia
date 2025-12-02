# CalendarTab Component - Architectural Evaluation

**Evaluation Date:** 2025-11-30
**Plan Document:** `ai/plans/ui/calendar-tab-plan-2025-11-30.md`
**Evaluator:** React UI Architect Agent
**Component Location:** `src/ui/inputs/calendar-tab.tsx`

---

## Executive Summary

**Overall Architectural Alignment:** 7/10

The CalendarTab plan demonstrates a solid understanding of the project's design system patterns and component architecture. However, there are **critical architectural concerns** regarding the Atomic Design classification and component composition strategy that need immediate attention before implementation.

**Key Findings:**

- **Critical Issue:** Atomic Design classification is INCORRECT - this should be a **Molecule**, not an Atom
- **Critical Issue:** Component composition strategy is problematic - should not compose TextSm atom internally
- **Moderate Issue:** State management approach deviates from established calendar component patterns
- **Positive:** Excellent alignment with CVA patterns and accessibility standards
- **Positive:** Strong design token mapping and Figma specification adherence

---

## Detailed Architectural Assessment

### 1. Atomic Design Classification - CRITICAL ISSUE

**Finding:** The plan classifies CalendarTab as an **Atom**, but this is architecturally incorrect.

**Current Classification (INCORRECT):**

```
Component Type: Atom
Reasoning: CalendarTab is a simple, single-purpose UI element that displays text
and handles interactive states. It cannot be broken down further...
```

**Why This Is Wrong:**

The plan's own composition requirements contradict the Atom classification:

- **Required Atoms: TextSm from `@/ui/typography`**
- The plan explicitly states the component will "compose the TextSm typography component"
- By definition, an Atom cannot be composed of other atoms

**Correct Classification: MOLECULE**

**Evidence from Codebase:**

1. **ButtonGroupItem** (similar functionality, classified as Molecule by composition):
   - Composes Icon atom: `import { Icon } from '@/ui/icons'`
   - Line 91: `return <Icon icon={IconComponent} size={size} color={null} aria-hidden />;`
   - Uses renderIcon helper to compose Icon atoms

2. **CalendarHeader** (molecule in same category):
   - Composes Button atoms: `import { Button } from '@/ui/buttons'`
   - Composes Icon atoms: `import { Icon } from '@/ui/icons'`
   - Line 172: `<Icon icon={CaretDown} size="sm" color={null} aria-hidden />`

3. **True Atoms in the codebase** (for comparison):
   - TextSm, TextXs, TextMd - Pure typography with no composition
   - Icon - Renders single icon with size/color variants
   - CalendarDay - Renders day number/text with states (no atom composition)

**Architectural Pattern:**

```
Atom: Single element, no composition of other atoms
  ✓ TextSm - pure <p> with typography variants
  ✓ Icon - pure icon with size/color variants
  ✓ CalendarDay - pure <button> with day-specific states

Molecule: Composes multiple atoms into a functional unit
  ✓ ButtonGroupItem - composes Icon atoms
  ✓ CalendarHeader - composes Button + Icon atoms
  ✗ CalendarTab - should compose TextSm atom (if following plan)
```

**Recommendation:**

```markdown
## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: CalendarTab is a button-like interactive element that will compose
the TextSm typography atom for consistent text rendering. Following the established
pattern in ButtonGroupItem and CalendarHeader, any component that composes other
atoms is classified as a Molecule. CalendarTab serves a specific calendar navigation
purpose beyond basic button functionality.

**Composition Requirements**:

- **Composes Atoms**: TextSm from `@/ui/typography` for text content
- **Status**: This is a molecule that combines button interaction patterns with
  typography atoms for calendar-specific tab navigation.
```

**Impact:** HIGH - This affects how the component is documented, understood, and maintained within the design system hierarchy.

---

### 2. Component Composition Strategy - CRITICAL ISSUE

**Finding:** The plan proposes using TextSm internally, which contradicts established patterns for button-like components.

**Problematic Approach (from plan):**

```
Composition Requirements:
- Required Atoms: TextSm from `@/ui/typography` - For consistent typography
```

**Why This Is Architecturally Wrong:**

1. **No precedent in similar components:**
   - ButtonGroupItem does NOT compose Text atoms - uses direct className styling
   - Button component does NOT compose Text atoms - uses direct className styling
   - CalendarDay does NOT compose Text atoms - uses direct className styling

2. **Violates component encapsulation:**
   - Button-like components control ALL styling through CVA variants
   - Adding TextSm creates nested component dependency
   - Makes text styling split between CalendarTab and TextSm variants

3. **CVA pattern conflict:**

   ```typescript
   // WRONG - Split responsibility
   <button className={calendarTabVariants(...)}>
     <TextSm weight="medium">{children}</TextSm>
   </button>

   // RIGHT - Single responsibility (like ButtonGroupItem)
   <button className={calendarTabVariants({ ... })}>
     {children}
   </button>
   ```

**Evidence from CalendarDay (correct pattern):**

```typescript
// Line 53-61: Typography defined in CVA base styles
const calendarDayVariants = cva([
  'font-sans',
  'size-[34px]',
  'text-center text-xs leading-[18px]', // Typography in base
  'select-none',
  // ...
]);
```

**Evidence from ButtonGroupItem (correct pattern):**

```typescript
// Line 23-34: Typography in base styles
const buttonGroupItemVariants = cva([
  'inline-flex items-center justify-center gap-2',
  'font-medium', // Weight in base
  // Text size in size variants (line 38-40)
]);
```

**Evidence from CalendarHeader (where composition makes sense):**

```typescript
// Line 172: Icon composition for semantic icon elements
<Icon icon={CaretDown} size="sm" color={null} aria-hidden />

// Line 84-85: Typography INLINE in button styles
'text-sm leading-5 font-semibold text-text-primary',
```

**Correct Architectural Pattern:**

```typescript
// Button-like atoms/molecules should use direct typography classes
const calendarTabVariants = cva([
  'inline-flex items-center justify-center',
  'h-8 px-2 py-1.5 gap-1.5',
  'rounded-sm',
  'text-sm leading-5 font-medium',  // Typography INLINE
  'transition-colors duration-150',
  // ...
]);

// Simple rendering - no TextSm composition
export const CalendarTab = forwardRef<HTMLButtonElement, CalendarTabProps>(
  ({ children, active, disabled, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(calendarTabVariants({ active }), className)}
        disabled={disabled}
        {...props}
      >
        {children}  {/* No TextSm wrapper */}
      </button>
    );
  }
);
```

**Recommendation:**

Remove TextSm from composition requirements. Use direct Tailwind typography classes in CVA base styles following the ButtonGroupItem and CalendarDay patterns.

**Impact:** HIGH - Affects component architecture, maintainability, and consistency with project patterns.

---

### 3. State Management Approach - MODERATE ISSUE

**Finding:** The plan's state variant approach differs from CalendarDay's established pattern.

**Plan's Approach:**

```typescript
// Proposed state variant
state?: 'default' | 'hover' | 'focus' | 'pressed' | 'active' | 'activeFocus'
```

**CalendarDay's Pattern:**

```typescript
// Line 35-42: State + boolean flag pattern
state?: 'default' | 'hovered' | 'selected' | 'multiSelectStart' | ...
// Plus compound variants for combinations (lines 85-180)
```

**ButtonGroupItem's Pattern:**

```typescript
// Line 48-51: Boolean flag pattern
selected?: boolean
// States handled via CSS pseudo-classes (hover, focus, active)
```

**Architectural Analysis:**

The plan mixes two different state management patterns:

1. **Explicit state prop** (hover, focus, pressed) - typically handled by CSS pseudo-classes
2. **Active/selected state** - typically handled by boolean prop + compound variants

**Recommended Pattern (following ButtonGroupItem):**

```typescript
interface CalendarTabProps {
  children: React.ReactNode;
  active?: boolean; // For selected/active state
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const calendarTabVariants = cva(
  [
    'inline-flex items-center justify-center',
    // Base interactive states via pseudo-classes
    'hover:text-text-tertiary-hover hover:bg-background',
    'focus-visible:ring-primary-300 focus-visible:bg-background focus-visible:ring-2',
    'active:text-text-tertiary-active active:bg-background',
    // ...
  ],
  {
    variants: {
      active: {
        true: 'bg-background text-primary',
        false: 'text-text-tertiary',
      },
    },
    compoundVariants: [
      {
        active: true,
        className: 'focus-visible:text-primary', // Active + Focus
      },
    ],
  }
);
```

**Why This Is Better:**

1. **Consistency:** Matches ButtonGroupItem pattern (both are button-like selection elements)
2. **Simplicity:** CSS pseudo-classes handle hover/focus/pressed automatically
3. **Accessibility:** Browser handles focus states natively
4. **State management:** Only manage selected/active state, not transient interaction states

**Recommendation:**

Replace the explicit state variants with:

- CSS pseudo-classes for hover, focus, active (pressed)
- Boolean `active` prop for selected state
- Compound variants for active + focus combination

**Impact:** MODERATE - Affects API design and state management patterns, but can be adjusted without major architectural changes.

---

### 4. Design Token Mapping - POSITIVE

**Finding:** Excellent Figma-to-codebase token mapping with clear documentation.

**Strengths:**

1. **Comprehensive color mapping:**

   ```
   text-tertiary (#889096) → text-text-tertiary
   text-brand (#3c61dd) → text-primary
   bg-surface-base-primary (#fff) → bg-background or bg-white
   ```

2. **Identified token gaps:**
   - Explicitly noted hover/active variants need verification
   - Shows architectural awareness of design system completeness

3. **Spacing/sizing tokens:**
   - Correct mapping of radius, padding, gap to Tailwind utilities
   - Height: 32px → h-8 (correct)
   - Padding: 8px/6px → px-2 py-1.5 (correct)

**Minor Issue:**

The plan notes uncertainty about hover/active text color variants:

```
text-base-tertiary_hover (#7d868c) | Need to verify or create hover variant
text-base-tertiary_active (#697177) | Need to verify or create active variant
```

**Recommendation:**

These should be verified against `src/styles/` files or globals.css theme tokens. If missing, they should be added to the design system before implementation, not created ad-hoc in the component.

**Impact:** LOW - Minor documentation gap, not a blocking issue.

---

### 5. Accessibility Implementation - POSITIVE

**Finding:** Strong accessibility considerations with proper ARIA attributes.

**Strengths:**

1. **Semantic HTML:**
   - `role="tab"` for tab semantics
   - `aria-selected` for active state
   - `aria-disabled` for disabled state

2. **Keyboard navigation:**
   - `tabIndex` management mentioned
   - Focus-visible states defined

3. **State communication:**
   - Clear mapping of visual states to ARIA states
   - Proper disabled state handling

**Recommendation:**

Ensure implementation also includes:

- `aria-label` for icon-only tabs (if that use case exists)
- Proper focus management in tab lists (roving tabindex pattern if in TabGroup)
- Support for keyboard arrow navigation (if used in TabGroup context)

**Impact:** POSITIVE - No issues, good accessibility foundation.

---

### 6. Location and Export Pattern - POSITIVE

**Finding:** Correct location and export structure.

**Strengths:**

1. **Correct category:** `src/ui/inputs/` aligns with CalendarDay and CalendarHeader
2. **Proper barrel exports:** Follows established pattern
3. **Import path:** `import { CalendarTab } from '@/ui'` works correctly

**Architectural Justification:**

The `inputs` category makes sense for CalendarTab because:

- Calendar components are input-related (date selection)
- Consistent with CalendarDay and CalendarHeader location
- Part of the calendar widget family

**No issues found.**

---

### 7. CVA Patterns and Styling - POSITIVE

**Finding:** Excellent understanding of CVA patterns and variant structure.

**Strengths:**

1. **Base styles array format:**
   - Follows ButtonGroupItem and CalendarDay patterns
   - Good organization of classes

2. **Compound variants awareness:**
   - Correctly identifies active + focus combination
   - Understands variant composition

3. **Default variants:**
   - Properly specified in plan

**Minor Note:**

The plan should explicitly show disabled state handling in CVA:

```typescript
'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-52';
```

(Following ButtonGroupItem line 33)

**Impact:** POSITIVE - Strong CVA knowledge, minor documentation enhancement needed.

---

### 8. Testing Strategy - POSITIVE

**Finding:** Comprehensive testing approach covering all important scenarios.

**Strengths:**

1. **State coverage:** All visual states tested
2. **Interaction coverage:** Click, keyboard, disabled
3. **Accessibility coverage:** ARIA attributes, ref forwarding
4. **Edge cases:** Empty children, long text, rapid toggling

**Recommendation:**

Add one more test case:

- **Compound state test:** Active + disabled combination (should disabled win?)

**Impact:** POSITIVE - Thorough testing strategy.

---

### 9. Storybook Documentation - POSITIVE

**Finding:** Excellent story coverage with real-world examples.

**Strengths:**

1. **Comprehensive story list:**
   - All states covered
   - Real-world context examples (InCalendarContext, ViewSwitcherExample)
   - Complete matrix for visual comparison

2. **Interactive controls:**
   - Good argTypes coverage
   - Aligns with project standards

3. **Non-negotiable requirement:**
   - Correctly emphasized in plan

**No issues found.**

---

## Critical Issues Summary

### 1. Atomic Design Misclassification

**Severity:** CRITICAL
**Current:** Atom
**Correct:** Molecule
**Reason:** Component composes TextSm atom (per plan), violating Atom definition
**Action Required:** Update classification to Molecule in plan and implementation

### 2. Composition Strategy Error

**Severity:** CRITICAL
**Current:** Plans to compose TextSm atom internally
**Correct:** Use inline typography classes in CVA (like ButtonGroupItem)
**Reason:** No precedent in similar components; violates established patterns
**Action Required:** Remove TextSm composition, use direct typography classes

### 3. State Management Pattern Deviation

**Severity:** MODERATE
**Current:** Explicit state variants for hover/focus/pressed
**Correct:** CSS pseudo-classes + active boolean prop
**Reason:** Inconsistent with ButtonGroupItem pattern for similar components
**Action Required:** Refactor state approach to use pseudo-classes + active prop

---

## Recommendations

### Immediate (Before Implementation)

1. **Update Atomic Design Classification:**

   ```diff
   - **Component Type**: Atom
   + **Component Type**: Molecule
   ```

2. **Remove TextSm Composition:**

   ```diff
   - **Composition Requirements**:
   -   - **Required Atoms**: TextSm from `@/ui/typography`

   + **Composition Requirements**:
   +   - **None** - Uses inline typography classes in CVA base styles
   +   - Pattern follows ButtonGroupItem and CalendarDay approaches
   ```

3. **Refactor State Management:**

   ```diff
   - state?: 'default' | 'hover' | 'focus' | 'pressed' | 'active' | 'activeFocus'

   + active?: boolean
   + // hover, focus, pressed handled via CSS pseudo-classes
   ```

4. **Update Props Interface:**

   ```typescript
   interface CalendarTabProps {
     children: React.ReactNode;
     active?: boolean; // For selected state
     disabled?: boolean;
     className?: string;
     onClick?: () => void;
   }
   ```

5. **CVA Structure (Corrected):**
   ```typescript
   const calendarTabVariants = cva(
     [
       'inline-flex items-center justify-center',
       'h-8 gap-1.5 px-2 py-1.5',
       'rounded-sm',
       'text-sm leading-5 font-medium', // Typography inline
       'transition-colors duration-150',
       'hover:text-text-tertiary-hover',
       'focus-visible:ring-primary-300 focus-visible:bg-background focus-visible:ring-2',
       'active:text-text-tertiary-active active:bg-background',
       'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-52',
     ],
     {
       variants: {
         active: {
           true: 'bg-background text-primary',
           false: 'text-text-tertiary',
         },
       },
       compoundVariants: [
         {
           active: true,
           className: 'focus-visible:bg-background focus-visible:text-primary',
         },
       ],
       defaultVariants: {
         active: false,
       },
     }
   );
   ```

### Short-term (During Implementation)

1. Verify text color hover/active variants exist in theme tokens
2. Add comprehensive unit tests for active + disabled combinations
3. Document any deviations from ButtonGroupItem pattern with justification
4. Create Storybook stories showing CalendarTab in real calendar context

### Long-term (Post-Implementation)

1. Consider creating CalendarTabGroup molecule for grouped tab navigation
2. Evaluate if size variants are needed based on real usage
3. Monitor for potential icon support requirements (left/right icons like ButtonGroupItem)

---

## Positive Patterns Observed

1. **Excellent Figma specification analysis** - Clear token mapping with gaps identified
2. **Strong accessibility foundation** - Proper ARIA attributes and semantic HTML
3. **Comprehensive testing strategy** - Edge cases and state combinations covered
4. **Thorough Storybook documentation** - Real-world examples and complete state matrix
5. **Correct component location** - Aligns with calendar component family in `inputs/`
6. **Good CVA understanding** - Proper variant structure and compound variant usage
7. **Clear acceptance criteria** - Well-defined validation commands and requirements

---

## Architecture Compliance Score Breakdown

| Category                     | Score    | Notes                                                                |
| ---------------------------- | -------- | -------------------------------------------------------------------- |
| Atomic Design Classification | 2/10     | Critical error - should be Molecule, not Atom                        |
| Component Composition        | 3/10     | Critical error - should not compose TextSm                           |
| State Management             | 6/10     | Deviation from established patterns                                  |
| Design Token Mapping         | 9/10     | Excellent, minor gaps to verify                                      |
| Accessibility                | 10/10    | Strong ARIA and semantic HTML                                        |
| Location & Exports           | 10/10    | Correct category and barrel exports                                  |
| CVA Patterns                 | 9/10     | Strong understanding, minor enhancements                             |
| Testing Strategy             | 9/10     | Comprehensive, one additional test case                              |
| Storybook Documentation      | 10/10    | Excellent coverage and examples                                      |
| **Overall**                  | **7/10** | **Strong foundation with critical architectural corrections needed** |

---

## Final Verdict

**Recommendation:** REVISE BEFORE IMPLEMENTATION

The CalendarTab plan demonstrates strong technical knowledge and excellent attention to design system details. However, the **critical Atomic Design misclassification** and **composition strategy error** must be corrected before implementation to maintain architectural consistency with the project.

**Key Strengths:**

- Excellent Figma analysis and token mapping
- Strong accessibility and testing foundations
- Comprehensive Storybook documentation
- Good CVA pattern understanding

**Critical Blockers:**

- Incorrect Atomic Design classification (Atom → Molecule)
- Problematic composition strategy (remove TextSm composition)
- State management deviation (use pseudo-classes + active prop)

**Next Steps:**

1. Update plan document with corrected classification
2. Remove TextSm composition from requirements
3. Refactor state management to match ButtonGroupItem pattern
4. Proceed with implementation following corrected architecture

**Estimated Impact of Corrections:** 2-3 hours to revise plan and adjust implementation approach. The corrections prevent future architectural debt and ensure consistency with established patterns.

---

**Evaluation completed:** 2025-11-30
**Document saved to:** `ai/agents/evaluations/calendar-tab-plan-2025-11-30.md`
