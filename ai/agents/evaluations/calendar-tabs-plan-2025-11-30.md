# Architectural Evaluation: CalendarTabs Component Plan

**Date**: 2025-11-30
**Component**: CalendarTabs
**Plan Location**: `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/ai/plans/ui/calendar-tabs-plan-2025-11-30.md`
**Evaluator**: UI/UX Architecture Agent

---

## Executive Summary

**Overall Architectural Alignment Score**: 7/10

The CalendarTabs plan demonstrates strong architectural alignment with the project's established patterns, particularly the ButtonGroup container component model. However, there are several critical issues and opportunities for improvement:

**Critical Issues Identified**: 2
**Recommendations**: 5
**Positive Patterns Observed**: 6

---

## 1. Atomic Design Classification Review

### Assessment: **CORRECT with Clarification**

**Classification**: Molecule ✅
**Reasoning Quality**: Strong ✅

The plan correctly identifies CalendarTabs as a Molecule because it:

- Composes multiple CalendarTab atoms into a functional unit
- Manages state and behavior for the composed atoms
- Provides layout and interaction patterns
- Does not compose other molecules (only atoms)

**Positive Pattern**: The classification reasoning is thorough and demonstrates understanding of atomic design principles. The comparison to ButtonGroup as a reference is appropriate.

**Clarification Needed**: While the classification is correct, the plan should explicitly address the difference between this molecule and the more manual composition pattern shown in the existing CalendarTab stories (lines 161-188, 421-441). The existing stories show developers manually creating tab groups with wrapper divs, whereas CalendarTabs will provide a structured, opinionated container. This is an architectural improvement that reduces boilerplate.

---

## 2. Component Composition Strategy Evaluation

### Assessment: **ARCHITECTURALLY FLAWED - CRITICAL ISSUE**

**Issue Severity**: HIGH 🔴

### Critical Problem: Prop Interface Design

The plan's proposed `CalendarTabsProps` interface (lines 272-282) has a fundamental architectural flaw:

```typescript
// ❌ PROBLEMATIC: From the plan
interface CalendarTabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  children: React.ReactNode; // <-- This is the problem
  className?: string;
  'aria-label'?: string;
}
```

**Why This is Wrong**:

1. **Expects Pre-composed Children**: This interface expects developers to manually compose `CalendarTab` children, which defeats the purpose of having a container component that manages composition.

2. **Doesn't Follow ButtonGroup Pattern**: The plan claims to follow ButtonGroup patterns but then diverges from it. ButtonGroup expects `ButtonGroupItem` children, not arbitrary items with values.

3. **Inconsistent with Reference Pattern**: ButtonGroup automatically calculates position variants (`first`, `middle`, `last`, `only`) for its children. CalendarTabs should similarly manage tab-specific concerns.

4. **Missing Data-Driven Approach**: For a preset list of date range options (Today, Yesterday, Last week, etc.), a data-driven approach would be more appropriate:

```typescript
// ✅ BETTER: Data-driven approach
interface CalendarTabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CalendarTabsProps {
  items: CalendarTabItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}
```

**Alternatively** (if children composition is desired):

```typescript
// ✅ ALTERNATIVE: Enhanced children composition
interface CalendarTabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  children:
    | React.ReactElement<CalendarTabProps>
    | React.ReactElement<CalendarTabProps>[];
  className?: string;
  'aria-label'?: string;
}
```

### Recommendation 1: Choose a Clear Composition Strategy

The plan should make an explicit architectural decision:

**Option A: Data-Driven Composition** (Recommended for this use case)

- Pros: Type-safe, less boilerplate, easier to manage preset items
- Cons: Less flexible for custom content
- Best for: Fixed sets of options (date presets)

**Option B: Children Composition**

- Pros: Maximum flexibility, familiar React pattern
- Cons: More boilerplate, type safety challenges
- Best for: Dynamic or custom tab content

Given that the plan explicitly states "preset time period options" (line 5) and lists 6 fixed presets (lines 475-480), **Option A (data-driven)** is architecturally superior for this use case.

---

## 3. Architectural Alignment with Project Patterns

### Assessment: **STRONG ALIGNMENT with Deviations**

**Score**: 8/10

### What the Plan Gets Right ✅

1. **Container Component Pattern**: Correctly identifies ButtonGroup as the reference pattern for container components (lines 79-83).

2. **CVA Usage**: Plans to use Class Variance Authority for variant management, consistent with project standards.

3. **ForwardRef Pattern**: Includes proper ref forwarding (line 283).

4. **Accessibility Foundation**: Plans for proper ARIA attributes (`role="tablist"`, `aria-orientation="vertical"`) following WAI-ARIA practices.

5. **Export Pattern**: Correctly follows the barrel export pattern (`src/ui/inputs/index.ts`).

6. **Testing Strategy**: Comprehensive test plan covering unit tests, accessibility, and edge cases.

### Critical Deviation: Vertical vs Horizontal Orientation 🔴

**Issue**: The plan states this component creates a "vertical list" (line 8) but **ButtonGroup only supports horizontal orientation**.

From ButtonGroup (line 88-90):

```typescript
/**
 * Orientation hint for future vertical support.
 * Currently only horizontal is implemented.
 * @default 'horizontal'
 */
orientation?: 'horizontal' | 'vertical';
```

**Architectural Implications**:

1. **No Vertical Implementation Exists**: ButtonGroup does not actually implement vertical orientation. The prop exists as a "hint for future support" but has no implementation.

2. **Different Layout Requirements**:
   - ButtonGroup uses `-ml-px` for border overlap (horizontal)
   - CalendarTabs needs `gap-1` (4px) for vertical spacing
   - Position variants (`first`, `middle`, `last`) may need different CSS for vertical layout

3. **Diverging Implementations**: CalendarTabs will be the first vertical container component, setting a precedent. This needs explicit architectural consideration.

### Recommendation 2: Explicitly Address Vertical Layout Architecture

The plan should:

1. **Document the Divergence**: Clearly state that CalendarTabs is implementing the first vertical container pattern in the design system.

2. **Define Vertical Container Standards**: Establish how vertical containers differ from horizontal ones:
   - Gap spacing instead of border overlap
   - Different position variant CSS if needed
   - Keyboard navigation differences (ArrowUp/Down vs ArrowLeft/Right)

3. **Consider Future Unification**: Should ButtonGroup be enhanced to support vertical orientation, or should vertical containers be a separate pattern? This affects design system consistency.

**Example Documentation**:

```typescript
/**
 * CalendarTabs - Vertical container component for CalendarTab items
 *
 * NOTE: This is the first vertical container in the design system.
 * Unlike ButtonGroup (horizontal), this uses:
 * - flex-col instead of inline-flex
 * - gap-1 (4px) instead of -ml-px border overlap
 * - ArrowUp/ArrowDown navigation instead of ArrowLeft/Right
 *
 * @see ButtonGroup for horizontal container pattern reference
 */
```

---

## 4. Design System Integration Approach

### Assessment: **CORRECT Category, Missing Integration Points**

**Category Placement**: ✅ Correct
**Integration Completeness**: ⚠️ Needs Enhancement

### Category Placement Analysis

**Location**: `src/ui/inputs/calendar-tabs.tsx` ✅

The plan correctly places CalendarTabs in the `inputs` category because:

1. It's a date/time selection component (user input)
2. It complements existing calendar components (CalendarTab, CalendarDay, CalendarHeader)
3. It follows the established pattern where container components live alongside their item components

**Validation**: Examining `src/ui/inputs/index.ts` shows:

- CalendarTab ✅ (atom)
- CalendarDay ✅ (atom)
- CalendarHeader ✅ (molecule/organism)
- CalendarTabs ⬅️ (molecule - correct placement)

### Missing Integration: CalendarHeader Relationship

**Issue**: The plan mentions CalendarHeader integration in "Future Considerations" (line 491) but doesn't address the architectural relationship.

From the plan's notes:

> "This component is designed to complement CalendarHeader in a full calendar/date picker implementation."

**Questions Not Addressed**:

1. Should CalendarTabs be composed within CalendarHeader?
2. Are they sibling components in a larger calendar system?
3. What's the data flow between CalendarTabs and CalendarHeader?

### Recommendation 3: Define Component Hierarchy in Calendar System

The plan should include a "Component Relationships" section:

```markdown
## Component Relationships

### Calendar System Hierarchy
```

DatePicker (future organism)
├── CalendarTabs (molecule) - Preset selection
├── CalendarHeader (molecule) - Month/year navigation
└── CalendarDay[] (atoms) - Individual dates

```

### Integration Points

1. **CalendarTabs → CalendarHeader**:
   - When preset selected, CalendarHeader updates to show range
   - One-way data flow via parent state management

2. **CalendarTabs as Standalone**:
   - Can be used independently for quick date range filtering
   - Common in analytics dashboards, reporting interfaces
```

This provides architectural clarity for future development.

---

## 5. Potential Architectural Issues and Improvements

### Issue 1: Keyboard Navigation Implementation Gap 🟡

**Severity**: MEDIUM

The plan includes keyboard navigation requirements (lines 296-301) but doesn't specify **focus management strategy**.

**Questions**:

1. Who manages tabIndex? The container or the tabs?
2. How is roving tabIndex implemented?
3. What happens when a disabled tab is skipped?

**Current CalendarTab Implementation**:

```typescript
// From calendar-tab.tsx line 114
tabIndex={disabled ? -1 : 0}
```

Each tab has `tabIndex={0}`, which means all tabs are in the tab order. For proper keyboard navigation, CalendarTabs should implement **roving tabIndex** pattern:

- Only the active (or first) tab has `tabIndex={0}`
- All other tabs have `tabIndex={-1}`
- Arrow keys move focus and update tabIndex

### Recommendation 4: Implement Roving TabIndex Pattern

```typescript
// Example implementation
const CalendarTabs = forwardRef<HTMLDivElement, CalendarTabsProps>(
  ({ value, onValueChange, children, ...props }, ref) => {
    const [focusedIndex, setFocusedIndex] = useState(0);

    const enhancedChildren = Children.map(children, (child, index) => {
      if (!isValidElement(child)) return child;

      return cloneElement(child, {
        tabIndex: index === focusedIndex ? 0 : -1,
        onFocus: () => setFocusedIndex(index),
        // ... other props
      });
    });

    // ... keyboard handler implementation
  }
);
```

This should be explicitly documented in the implementation plan.

### Issue 2: Controlled vs Uncontrolled State Pattern 🟡

**Severity**: MEDIUM

The plan mentions "controlled/uncontrolled modes" (line 249, 358) but doesn't specify the implementation pattern.

**ButtonGroup Pattern**: ButtonGroup does NOT manage selection state - it's a structural container only. Selection is managed via the `selected` prop on individual `ButtonGroupItem` components.

**CalendarTabs Pattern**: The plan proposes `value`/`onValueChange`/`defaultValue` props, which means CalendarTabs WILL manage selection state.

**Architectural Question**: Is this divergence intentional and justified?

**Pros of State Management in CalendarTabs**:

- Simpler API for common use case (single selection)
- Prevents invalid states (multiple tabs selected)
- Matches native `<select>` and `<input type="radio">` patterns

**Cons**:

- Diverges from ButtonGroup pattern
- More complex component implementation
- Less flexible (can't easily do multi-select if needed)

### Recommendation 5: Justify State Management Decision

The plan should include explicit rationale:

```markdown
## State Management Decision

**Decision**: CalendarTabs manages selection state internally (controlled/uncontrolled pattern)

**Rationale**:

1. Calendar tabs are always single-selection (unlike button groups which can have multiple selected)
2. Matches native form control patterns (`<select>`, `<input type="radio">`)
3. Prevents invalid UI states (multiple presets selected)
4. Simpler API for the 95% use case

**Trade-off Accepted**:

- Diverges from ButtonGroup (structural only) pattern
- CalendarTabs is more opinionated about behavior

**Alternative Considered and Rejected**:
Manual selection management like ButtonGroup was rejected because calendar preset selection is inherently single-choice and benefits from encapsulated state logic.
```

### Issue 3: CVA Variants Not Clearly Defined 🟡

**Severity**: LOW

The plan mentions "Create CVA variants" (line 228) but then states variants are "if needed for future extensibility."

**Question**: What variants does this component actually need?

Looking at the Figma design (lines 130-141), there's only one layout configuration:

- Flex column
- 4px gap
- Items-start alignment
- Content width

**Recommendation**: The plan should either:

1. State explicitly: "No CVA variants needed for v1" and use a simple base class
2. Define specific variants for future-proofing (e.g., `size`, `spacing`, `orientation`)

**Example**:

```typescript
const calendarTabsVariants = cva('flex items-start', {
  variants: {
    orientation: {
      vertical: 'flex-col gap-1',
      horizontal: 'flex-row gap-1', // Future
    },
    spacing: {
      compact: 'gap-0.5',
      default: 'gap-1',
      relaxed: 'gap-2',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    spacing: 'default',
  },
});
```

---

## 6. Positive Architectural Patterns Observed

The plan demonstrates several excellent architectural practices:

### 1. Comprehensive Testing Strategy ✅

Lines 348-393 outline a thorough testing approach covering:

- Rendering tests
- Selection state (controlled/uncontrolled)
- Disabled states
- Keyboard navigation
- Accessibility attributes
- Edge cases

**Strength**: This prevents architectural drift and ensures the component meets accessibility standards.

### 2. Accessibility-First Design ✅

The plan prioritizes accessibility:

- WAI-ARIA tablist pattern (lines 240-244)
- Keyboard navigation (lines 296-301, 494-499)
- Screen reader support (`aria-label`, `role` attributes)
- Focus management considerations

**Strength**: Accessibility is baked into the architecture from the start, not added later.

### 3. Storybook Integration ✅

Lines 150-220 detail comprehensive Storybook stories including:

- All state variants
- Real-world examples (Date Range Picker, Analytics Filter)
- Accessibility demo
- Complete matrix for visual regression testing

**Strength**: Documentation and visual testing are first-class concerns.

### 4. Clear File Organization ✅

The plan follows established conventions:

- Component in `src/ui/inputs/`
- Tests in `src/ui/inputs/__tests__/`
- Stories in `src/stories/inputs/`
- Barrel exports for clean imports

**Strength**: Consistent with project structure, easy to find and maintain.

### 5. Design-to-Code Fidelity ✅

Lines 119-148 reference Figma design with specific measurements:

- 4px gap (gap-1)
- 32px height (h-8)
- 6px border radius (rounded-sm)
- Inter Medium 14px/20px typography

**Strength**: Ensures pixel-perfect implementation matching design system.

### 6. Validation-First Approach ✅

Lines 440-469 require running 6 validation commands:

- Type check
- Lint
- Component tests
- Full test suite
- Build verification
- Storybook build

**Strength**: Quality gates prevent architectural violations from reaching production.

---

## 7. Design System Impact Assessment

### Impact Level: MEDIUM-HIGH

**Justification**:

1. **First Vertical Container Component**: Sets precedent for future vertical layouts
2. **Calendar System Evolution**: Part of larger calendar/date picker system
3. **Preset Pattern**: Establishes pattern for preset selection UIs
4. **State Management Precedent**: Diverges from ButtonGroup by managing selection state

### Recommendations for Design System Documentation

1. **Update Component Patterns Guide**: Add vertical container pattern documentation
2. **Calendar System Architecture**: Document the calendar component hierarchy
3. **Preset Selection Pattern**: Create reusable pattern for preset lists (beyond dates)
4. **State Management Guidelines**: Document when containers should manage state vs be structural only

---

## Final Recommendations

### Critical (Must Fix Before Implementation)

1. **Resolve Composition Strategy** (Issue 2.1): Choose between data-driven (`items` prop) or children composition, with clear rationale. Data-driven is recommended for preset lists.

2. **Define Vertical Container Standards** (Issue 3.2): Document how vertical containers differ from horizontal ones in the design system.

3. **Implement Roving TabIndex** (Issue 5.1): Specify focus management strategy for keyboard navigation.

### Important (Should Address)

4. **Document State Management Decision** (Issue 5.2): Justify divergence from ButtonGroup's structural-only pattern.

5. **Define Component Relationships** (Issue 4): Clarify how CalendarTabs fits into the broader calendar system architecture.

### Nice to Have

6. **Clarify CVA Variants** (Issue 5.3): Either remove variant planning or define specific variants needed.

7. **Add Architecture Section to Plan**: Include a new section documenting architectural decisions and trade-offs.

---

## Conclusion

The CalendarTabs plan demonstrates strong understanding of the project's architectural patterns and design system principles. The classification as a Molecule is correct, the category placement in `inputs` is appropriate, and the comprehensive testing and documentation strategy is exemplary.

However, there are **two critical architectural issues** that must be resolved before implementation:

1. **Composition Strategy Flaw**: The children-based prop interface doesn't align with the stated goal of managing preset date ranges.
2. **Vertical Container Precedent**: This is the first vertical container component and needs explicit architectural documentation.

With these issues addressed, CalendarTabs will be a valuable addition to the design system, establishing patterns for vertical containers and preset selection UIs that can be reused across the application.

**Revised Overall Score with Fixes**: 9/10

---

## Evaluation Metadata

**Files Reviewed**:

- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/ai/plans/ui/calendar-tabs-plan-2025-11-30.md`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/buttons/button-group.tsx`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/inputs/calendar-tab.tsx`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/stories/buttons/button-group.stories.tsx`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/stories/inputs/calendar-tab.stories.tsx`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/.claude/skills/sazonia-ui-components/SKILL.md`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/inputs/index.ts`

**Reference Patterns**:

- Container Component Pattern (ButtonGroup)
- Atom Component Pattern (CalendarTab)
- CVA Variant Pattern
- Barrel Export Pattern
- Storybook Documentation Pattern

**Architectural Principles Applied**:

- Atomic Design Methodology
- Single Responsibility Principle
- Separation of Concerns
- Composition over Inheritance
- WAI-ARIA Accessibility Patterns
- Controlled vs Uncontrolled Component Patterns
