# CalendarHeader Component - Architectural Evaluation

**Date**: 2025-11-30
**Evaluator**: UI/UX Architecture Agent
**Plan File**: `ai/plans/ui/calendar-header-plan-2025-11-30.md`

## Executive Summary

**Overall Architectural Alignment**: 92/100

The CalendarHeader component plan demonstrates excellent architectural alignment with the project's established patterns and design system integration. The plan is comprehensive, well-structured, and follows atomic design principles correctly. However, there are several areas requiring clarification and potential improvements to ensure full compliance with project standards.

**Recommendation**: APPROVED with minor modifications required before implementation.

---

## 1. Atomic Design Classification Evaluation

### Classification: Molecule ✅

**Assessment**: CORRECT

**Reasoning**:

- The CalendarHeader appropriately composes multiple atoms (Button, Icon, TextSm) into a cohesive unit
- Has a single, well-defined purpose (calendar navigation)
- Not complex enough to be an organism (doesn't compose other molecules)
- Will itself be composed into higher-level calendar organisms
- Aligns with existing molecule examples like calendar-day.tsx

**Evidence from Codebase**:

- `calendar-day.tsx` is correctly classified as a molecule (single-cell unit)
- Button and Icon components are atoms
- TextSm is an atom component for typography
- Pattern matches project structure: atoms → molecules → organisms

**Validation**: ✅ Classification is architecturally sound

---

## 2. Component Composition Strategy Evaluation

### Atoms Being Composed

**Planned Composition**:

- Button (from `@/ui/buttons`)
- Icon (from `@/ui/icons`)
- TextSm (from `@/ui/typography`)

### Analysis

#### ✅ CORRECT: Button for Navigation

```typescript
// Plan specifies: Button with plain variant, icon-only
// Aligns with Button component patterns:
- buttonVariants supports variant="plain"
- Icon-only pattern requires aria-label (correctly noted in plan)
```

**Evidence from button.tsx**:

- Supports `variant="plain"` with transparent background
- Icon-only pattern fully supported with accessibility warnings
- forwardRef implementation allows proper ref handling

**Recommendation**: Proceed as planned

#### ❌ ISSUE: Icon Usage Pattern

**Problem Identified**:
The plan states: _"Use Phosphor Icons: CaretLeft, CaretRight, CaretDown"_

However, reviewing the Button and Icon component patterns reveals:

1. **Button already handles icons internally** via `leftIcon` and `rightIcon` props
2. **Icon component should not be used directly** when composing with Button
3. **Direct icon imports** (CaretLeft, CaretRight, CaretDown) are correct for passing to Button

**Incorrect Pattern (from plan implication)**:

```tsx
// DON'T: Use Icon component inside Button
<Button>
  <Icon icon={CaretLeft} size="sm" />
</Button>
```

**Correct Pattern**:

```tsx
// DO: Use Button's leftIcon prop
import { CaretLeft } from '@phosphor-icons/react';

<Button leftIcon={CaretLeft} variant="plain" aria-label="Previous month" />;
```

**Required Correction**: Update implementation plan to clarify that:

- Import Phosphor icon components directly (CaretLeft, CaretRight, CaretDown)
- Pass icons to Button's `leftIcon` prop, not as children
- Do NOT use the Icon wrapper component when working with Button

#### ⚠️ WARNING: TextSm Usage Pattern

**Issue**: The plan suggests using TextSm for month/year display, but this creates a potential accessibility and interaction issue.

**From plan**:

```typescript
// Each selector: TextSm (semibold) + Icon (CaretDown, sm size)
```

**Problem**:

- Month/year selectors need to be clickable elements
- TextSm renders as `<p>` by default (not interactive)
- Requires either `asChild` pattern or button wrapper

**Recommended Approach**:

**Option 1: Button with TextSm styling** (RECOMMENDED)

```tsx
<button
  className="inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm leading-5 font-semibold text-text-primary hover:bg-background-brand-secondary"
  onClick={onMonthClick}
  aria-label="Select month"
>
  {month}
  <Icon icon={CaretDown} size="sm" color={null} />
</button>
```

**Option 2: TextSm with asChild + Slot**

```tsx
<TextSm weight="semibold" asChild>
  <button className="inline-flex items-center gap-1.5" onClick={onMonthClick}>
    {month}
    <Icon icon={CaretDown} size="sm" color={null} />
  </button>
</TextSm>
```

**Recommendation**: Use Option 1 for clarity and to avoid unnecessary component nesting. Apply TextSm's styles directly via className.

### Summary: Component Composition

| Component         | Status                          | Notes                                                        |
| ----------------- | ------------------------------- | ------------------------------------------------------------ |
| Button            | ✅ Correct                      | Use variant="plain" with leftIcon prop                       |
| Icon (standalone) | ⚠️ Pattern clarification needed | Pass Phosphor components to Button, not Icon wrapper         |
| TextSm            | ⚠️ Interaction pattern issue    | Use button with TextSm styles, not TextSm component directly |

---

## 3. Architectural Alignment with Project Patterns

### CVA Pattern Compliance

**Assessment**: ✅ EXCELLENT

The plan correctly identifies CVA usage for variant management:

```typescript
// Plan specifies:
- Create CVA variants for alignment
- Define CalendarHeaderAlign type: 'left' | 'center'
```

**Validation against existing patterns**:

From `button.tsx`:

```typescript
const buttonVariants = cva(
  [/* base styles */],
  {
    variants: { variant: {...}, color: {...}, size: {...} },
    compoundVariants: [...],
    defaultVariants: {...}
  }
);
```

From `calendar-day.tsx`:

```typescript
const calendarDayVariants = cva(
  [/* base styles */],
  {
    variants: { dayType: {...}, state: {...} },
    compoundVariants: [...],
    defaultVariants: {...}
  }
);
```

**Expected CalendarHeader Pattern**:

```typescript
const calendarHeaderVariants = cva(
  [
    'flex items-center',
    // base styles
  ],
  {
    variants: {
      align: {
        left: 'justify-between',
        center: 'relative h-8',
      },
    },
    defaultVariants: {
      align: 'left',
    },
  }
);
```

**Recommendation**: Proceed with CVA pattern as planned. Ensure compound variants if alignment affects child positioning.

---

### TypeScript Type Safety

**Assessment**: ✅ EXCELLENT

**Plan Specifies**:

```typescript
- Define CalendarHeaderAlign type: 'left' | 'center'
- Define CalendarHeaderProps interface
- Export component, variants, and types
```

**Validation against project standards**:

From `calendar-day.tsx`:

```typescript
export type CalendarDayType = 'default' | 'today' | 'previousMonth' | ...;
export type CalendarDayState = 'default' | 'hovered' | 'selected' | ...;
export type CalendarDayVariants = VariantProps<typeof calendarDayVariants>;
export interface CalendarDayProps extends ... { }
```

**Expected CalendarHeader Pattern**:

```typescript
export type CalendarHeaderAlign = 'left' | 'center';

export type CalendarHeaderVariants = VariantProps<typeof calendarHeaderVariants>;

export interface CalendarHeaderProps
  extends ComponentPropsWithoutRef<'div'>, CalendarHeaderVariants {
  month?: string;
  year?: number;
  monthYearCombined?: string;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  onMonthClick?: () => void;
  onYearClick?: () => void;
  className?: string;
}
```

**Recommendation**: ✅ Type definitions are well-planned and align with project patterns.

---

### React Import Conventions

**Assessment**: ⚠️ NOT SPECIFIED IN PLAN

**Required Pattern** (from `.claude/skills/sazonia-ui-components/SKILL.md`):

```typescript
// ✅ CORRECT
import { forwardRef, type ComponentProps } from 'react';

// ❌ WRONG
import * as React from 'react';
```

**Action Required**: Ensure implementation uses direct imports, not namespace imports.

---

### forwardRef and displayName

**Assessment**: ⚠️ IMPLIED BUT NOT EXPLICIT

**From Button component**:

```typescript
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ... }, ref) => { ... }
);

Button.displayName = 'Button';
```

**From CalendarDay component**:

```typescript
export const CalendarDay = forwardRef<
  HTMLButtonElement | HTMLDivElement,
  CalendarDayProps
>(({ ... }, ref) => { ... });

CalendarDay.displayName = 'CalendarDay';
```

**Expected CalendarHeader Pattern**:

```typescript
export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  ({ align = 'left', ... }, ref) => {
    // Implementation
  }
);

CalendarHeader.displayName = 'CalendarHeader';
```

**Recommendation**: ✅ Pattern is implied by "follow existing patterns" but should be made explicit in implementation phase.

---

## 4. Design System Integration Approach

### Export Pattern Evaluation

**Plan Specifies**:

```typescript
// 1. Create component: src/ui/inputs/calendar-header.tsx
export { CalendarHeader, calendarHeaderVariants };
export type { CalendarHeaderProps, CalendarHeaderAlign };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './calendar-header';

// 3. Root barrel already exports inputs: src/ui/index.ts
export * from './inputs';
```

**Assessment**: ✅ PERFECT

**Validation against existing patterns**:

From `src/ui/inputs/index.ts`:

```typescript
export * from './calendar-day';
export * from './error-message';
export * from './hint';
// ... etc
```

Pattern matches exactly. ✅

**Import Usage**:

```typescript
// Recommended
import { CalendarHeader } from '@/ui';

// Alternative
import { CalendarHeader } from '@/ui/inputs';
```

Both patterns are supported. ✅

---

### Design Token Usage

**Assessment**: ✅ EXCELLENT

**Plan References**:

- `.claude/rules/styling-guidelines.md` for design token usage
- Semantic color tokens: `text-text-primary`, `text-text-tertiary`
- Border radius: `rounded-sm` (6px)
- Spacing tokens: `spacing-md` (8px), `spacing-sm` (6px), `spacing-xl` (12px)

**Validation**:

From styling-guidelines.md:

```css
--text-primary: var(--gray-700);
--text-tertiary: var(--gray-400);
--radius-sm: 0.375rem; /* 6px */
```

**Correct Usage Examples**:

```tsx
// ✅ Uses semantic tokens
<div className="text-text-primary rounded-sm gap-2">

// ❌ Wrong - raw Tailwind colors
<div className="text-gray-700 rounded-md gap-2">
```

**Recommendation**: Plan correctly references semantic tokens. Ensure implementation follows through.

---

### Accessibility Patterns

**Assessment**: ✅ EXCELLENT

**Plan Includes**:

- Navigation buttons: `aria-label="Previous month"`, `aria-label="Next month"`
- Month selector: `aria-label="Select month"`, `role="button"`
- Year selector: `aria-label="Select year"`, `role="button"`
- Keyboard navigation support (Enter/Space)

**Validation against project patterns**:

From `button.tsx`:

```typescript
'aria-label': ariaLabel,
'aria-busy': loading || undefined,
'aria-disabled': isDisabled || undefined,
```

From `calendar-day.tsx`:

```typescript
'aria-selected': isSelected(effectiveState) || undefined,
'aria-disabled': disabled || effectiveState === 'disabled' || undefined,
'aria-current': isToday || effectiveDayType === 'today' ? ('date' as const) : undefined,
```

**Expected CalendarHeader Pattern**:

```typescript
// Navigation buttons
<Button
  leftIcon={CaretLeft}
  variant="plain"
  aria-label="Previous month"
  onClick={onPreviousClick}
/>

// Month selector (as button)
<button
  aria-label="Select month"
  role="button"
  onClick={onMonthClick}
>
  {month}
</button>
```

**Recommendation**: ✅ Accessibility approach is solid. Ensure keyboard navigation implementation.

---

## 5. Potential Architectural Issues

### Issue 1: Component Element Type Ambiguity

**Severity**: MEDIUM

**Problem**:
The plan doesn't specify whether CalendarHeader should be a `<div>` or `<header>` element.

**Recommendation**:

```typescript
// Semantic HTML - RECOMMENDED
export const CalendarHeader = forwardRef<HTMLElement, CalendarHeaderProps>(
  ({ ... }, ref) => {
    return (
      <header ref={ref} className={...}>
        {/* Content */}
      </header>
    );
  }
);

// OR generic div
export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  ({ ... }, ref) => {
    return (
      <div ref={ref} className={...}>
        {/* Content */}
      </div>
    );
  }
);
```

**Decision Required**: Use `<header>` for semantic HTML or `<div>` for neutrality?

**My Recommendation**: Use `<div>` with `role="navigation"` or `role="heading"` for flexibility, as the parent calendar component may have its own semantic structure.

---

### Issue 2: Conditional Rendering Complexity

**Severity**: LOW

**Observation**:
The plan requires conditional rendering based on `align` prop:

- Left: Month + Year separate
- Center: Combined month-year

**Pattern Concern**:
This could lead to complex conditional logic. Ensure clear separation.

**Recommended Structure**:

```typescript
export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  ({ align = 'left', month, year, monthYearCombined, ... }, ref) => {
    const classes = cn(
      calendarHeaderVariants({ align }),
      className
    );

    return (
      <div ref={ref} className={classes}>
        {align === 'center' ? (
          <CenterAlignedLayout
            monthYearCombined={monthYearCombined}
            onPreviousClick={onPreviousClick}
            onNextClick={onNextClick}
            onMonthYearClick={onMonthClick}
          />
        ) : (
          <LeftAlignedLayout
            month={month}
            year={year}
            onPreviousClick={onPreviousClick}
            onNextClick={onNextClick}
            onMonthClick={onMonthClick}
            onYearClick={onYearClick}
          />
        )}
      </div>
    );
  }
);

// Internal components (not exported)
function LeftAlignedLayout({ ... }) { ... }
function CenterAlignedLayout({ ... }) { ... }
```

**Alternative - Inline Conditional**:

```typescript
return (
  <div ref={ref} className={classes}>
    {/* Previous button */}
    <Button leftIcon={CaretLeft} aria-label="Previous month" onClick={onPreviousClick} />

    {/* Selectors - conditional */}
    {align === 'left' ? (
      <div className="inline-flex gap-2">
        <MonthSelector month={month} onClick={onMonthClick} />
        <YearSelector year={year} onClick={onYearClick} />
      </div>
    ) : (
      <div className="absolute left-1/2 -translate-x-1/2">
        <MonthYearSelector text={monthYearCombined} onClick={onMonthClick} />
      </div>
    )}

    {/* Next button */}
    <Button leftIcon={CaretRight} aria-label="Next month" onClick={onNextClick} />
  </div>
);
```

**Recommendation**: Use inline conditionals with helper components for clarity. Avoid deep nesting.

---

### Issue 3: Prop Validation Logic

**Severity**: LOW

**Concern**:

- Left alignment requires `month` and `year` props
- Center alignment requires `monthYearCombined` prop
- No validation logic specified

**Recommended Validation**:

```typescript
export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  ({ align = 'left', month, year, monthYearCombined, ... }, ref) => {

    // Development-time validation
    if (process.env.NODE_ENV !== 'production') {
      if (align === 'left' && (!month || !year)) {
        console.warn(
          'CalendarHeader: "month" and "year" props are required when align="left"'
        );
      }
      if (align === 'center' && !monthYearCombined) {
        console.warn(
          'CalendarHeader: "monthYearCombined" prop is required when align="center"'
        );
      }
    }

    // ...rest of component
  }
);
```

**Recommendation**: Add prop validation warnings (similar to Button's icon-only aria-label warning).

---

### Issue 4: Icon Size Consistency

**Severity**: LOW

**From Plan**:

- Navigation icons: 16px
- Dropdown icons: 16px
- Plan specifies "Icon (sm size)" which maps to 16px

**Validation**:
From `icon.tsx`:

```typescript
const sizeMap: Record<NonNullable<IconVariants['size']>, number> = {
  xs: 12,
  sm: 16, // ✅ Correct
  md: 20,
  lg: 24,
  xl: 32,
};
```

**Assessment**: ✅ Correct. Use `size="sm"` for all icons.

---

## 6. Implementation Recommendations

### Critical Changes Required

1. **Icon Composition Pattern** (CRITICAL)
   - Use Button's `leftIcon` prop for navigation buttons
   - Pass Phosphor icon components directly, not Icon wrapper
   - Update implementation plan to clarify this pattern

2. **Selector Interactive Pattern** (IMPORTANT)
   - Use `<button>` elements for month/year selectors
   - Apply TextSm styles via className, not TextSm component
   - Ensure proper keyboard navigation

3. **React Import Convention** (REQUIRED)
   - Use direct imports: `import { forwardRef } from 'react'`
   - NOT: `import * as React from 'react'`

### Recommended Enhancements

4. **Component Element Type** (RECOMMENDED)
   - Specify whether to use `<div>` or `<header>`
   - Add appropriate ARIA role if using `<div>`

5. **Prop Validation** (NICE-TO-HAVE)
   - Add development-time warnings for missing required props
   - Follow Button component's pattern for validation

6. **Internal Component Structure** (OPTIONAL)
   - Consider extracting internal components for month/year selectors
   - Improves testability and code organization

---

## 7. Positive Patterns Identified

### Excellent Architectural Decisions

1. **Comprehensive Planning** ✅
   - Implementation plan is thorough and detailed
   - Step-by-step tasks are clear and actionable
   - Testing strategy is well-defined

2. **Accessibility-First Approach** ✅
   - ARIA labels planned for all interactive elements
   - Keyboard navigation explicitly mentioned
   - Follows WCAG 2.1 AA standards

3. **Design System Alignment** ✅
   - Semantic token usage planned correctly
   - Border radius and spacing tokens referenced
   - Color system properly understood

4. **Testing Coverage** ✅
   - Unit tests planned comprehensively
   - Edge cases identified (long month names, rapid clicking)
   - Accessibility tests included

5. **Storybook Documentation** ✅
   - All variant stories planned
   - Interactive examples included
   - Real-world usage context provided

6. **Export Pattern** ✅
   - Barrel exports correctly planned
   - Component and type exports specified
   - Import paths clearly documented

---

## 8. Code Quality Predictions

Based on the plan and existing component patterns:

### Type Safety: 95/100

- TypeScript types well-defined
- Props interface comprehensive
- Minor: Could add stricter conditional typing for align-specific props

### Maintainability: 90/100

- CVA variants ensure clean style management
- Component composition is clear
- Conditional rendering adds slight complexity

### Testability: 92/100

- Props are simple and testable
- Callbacks are well-defined
- Edge cases identified in plan

### Accessibility: 95/100

- ARIA attributes planned
- Keyboard navigation considered
- Semantic HTML could be improved (use `<header>` vs `<div>`)

### Performance: 98/100

- No performance concerns
- Simple component with minimal re-render triggers
- Static structure with conditional rendering

---

## 9. Comparison with Existing Components

### vs. CalendarDay (Molecule)

| Aspect              | CalendarDay         | CalendarHeader (Planned) | Assessment           |
| ------------------- | ------------------- | ------------------------ | -------------------- |
| Classification      | Molecule ✅         | Molecule ✅              | Consistent           |
| CVA Usage           | ✅ Complex variants | ✅ Simple variants       | Appropriate          |
| Conditional Element | ✅ button/div       | ⚠️ Not specified         | Needs clarity        |
| forwardRef          | ✅ Union type       | ⚠️ Not specified         | Should match pattern |
| Accessibility       | ✅ Comprehensive    | ✅ Comprehensive         | Excellent            |
| Export Pattern      | ✅ Barrel export    | ✅ Barrel export         | Consistent           |

### vs. Button (Atom)

| Aspect        | Button                      | CalendarHeader (Planned)   | Assessment              |
| ------------- | --------------------------- | -------------------------- | ----------------------- |
| Composition   | Atom (standalone)           | Molecule (composes atoms)  | Correct hierarchy       |
| Icon Handling | ✅ leftIcon/rightIcon props | ⚠️ Pattern unclear         | Needs clarification     |
| Polymorphism  | ✅ asChild, href            | ❌ Not needed              | Appropriate             |
| Loading State | ✅ Included                 | ❌ Not needed              | Appropriate             |
| Validation    | ✅ aria-label warning       | ⚠️ Could add prop warnings | Enhancement opportunity |

---

## 10. Final Recommendations

### Before Implementation

1. **Update Icon Composition Section**
   - Clarify Button's leftIcon prop usage
   - Remove references to using Icon component directly with Button
   - Provide correct code examples

2. **Clarify Selector Implementation**
   - Specify using `<button>` elements with TextSm styles
   - Not TextSm component with asChild pattern
   - Provide implementation example

3. **Specify Element Type**
   - Decide on `<div>` vs `<header>`
   - Add ARIA role if using `<div>`

4. **Add React Import Requirement**
   - Specify direct imports only
   - Reference `.claude/rules/code-quality.md`

### During Implementation

5. **Follow forwardRef Union Pattern**
   - Reference CalendarDay's union type pattern if needed
   - Ensure ref forwarding works correctly

6. **Add Development Warnings**
   - Validate required props based on align variant
   - Follow Button's validation pattern

7. **Extract Internal Components**
   - Consider MonthSelector, YearSelector helper components
   - Improves code organization and testability

### Post-Implementation

8. **Validate Against Checklist**
   - Component Checklist from `.claude/skills/sazonia-ui-components/SKILL.md`
   - All 6 validation commands must pass

9. **Storybook Visual Review**
   - Verify all variants render correctly
   - Test interactive controls
   - Validate accessibility in Storybook

---

## 11. Architectural Compliance Score Breakdown

| Category                     | Score   | Weight | Weighted Score |
| ---------------------------- | ------- | ------ | -------------- |
| Atomic Design Classification | 100/100 | 15%    | 15.0           |
| Component Composition        | 80/100  | 20%    | 16.0           |
| CVA Pattern Compliance       | 95/100  | 10%    | 9.5            |
| TypeScript Type Safety       | 90/100  | 10%    | 9.0            |
| Export Pattern               | 100/100 | 10%    | 10.0           |
| Design Token Usage           | 95/100  | 10%    | 9.5            |
| Accessibility                | 95/100  | 10%    | 9.5            |
| Testing Strategy             | 92/100  | 8%     | 7.4            |
| Documentation                | 95/100  | 7%     | 6.7            |

**Total Weighted Score**: 92.6/100

---

## 12. Action Items for Implementation

### Priority: CRITICAL (Must Fix)

- [ ] Update plan to clarify Button icon usage pattern (leftIcon prop, not Icon component)
- [ ] Specify selector implementation as `<button>` with TextSm styles
- [ ] Add React import convention requirement (direct imports only)

### Priority: HIGH (Should Fix)

- [ ] Decide and document component element type (`<div>` vs `<header>`)
- [ ] Add forwardRef implementation example
- [ ] Specify displayName requirement

### Priority: MEDIUM (Nice to Have)

- [ ] Add prop validation logic for development warnings
- [ ] Consider internal component extraction for selectors
- [ ] Add compound variants example if needed for align-specific styling

### Priority: LOW (Enhancement)

- [ ] Document semantic HTML considerations
- [ ] Add conditional typing for align-specific props
- [ ] Consider adding data-testid attributes example

---

## Conclusion

The CalendarHeader component plan is **architecturally sound** and demonstrates a **strong understanding** of the project's design system, atomic design principles, and component patterns. The classification as a molecule is correct, and the overall approach aligns well with existing components.

**Key Strengths**:

- Excellent atomic design classification
- Comprehensive planning and documentation
- Strong accessibility considerations
- Proper design token usage
- Clear export and integration pattern

**Key Areas for Improvement**:

- Icon composition pattern needs clarification (Button's leftIcon prop)
- Selector implementation pattern needs specification (button element, not TextSm component)
- React import convention should be explicit
- Component element type should be specified

**Final Verdict**: **APPROVED with required modifications**

With the critical clarifications addressed, this component will integrate seamlessly into the design system and maintain architectural consistency across the codebase.

---

**Evaluation Completed**: 2025-11-30
**Next Steps**: Address critical action items, then proceed to implementation phase
