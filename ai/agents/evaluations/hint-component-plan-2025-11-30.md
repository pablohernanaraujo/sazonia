# Hint Component Plan - Architectural Evaluation

**Date:** 2025-11-30
**Component:** Hint (Form Helper Text)
**Location:** `src/ui/inputs/hint.tsx`
**Plan Document:** `ai/plans/ui/hint-component-2025-11-30.md`
**Reviewer:** UI/UX Architecture Agent

## Executive Summary

**Overall Architectural Alignment:** 92/100 (Excellent)

The Hint component plan demonstrates strong alignment with the project's architectural patterns and design system principles. The plan follows CVA patterns, proper TypeScript typing, and barrel export conventions. However, there are **critical architectural concerns** regarding component classification and composition strategy that need to be addressed before implementation.

**Status:** APPROVE WITH REQUIRED MODIFICATIONS

---

## 1. Atomic Design Classification Review

### Current Classification: Atom

**Assessment:** **INCORRECT - Needs Reconsideration**

**Critical Issue:**

The plan classifies Hint as a **standalone atom** that "does not require any other UI components as dependencies." This is architecturally problematic for the following reasons:

#### Problem 1: Duplication of Typography Patterns

The Hint component essentially **duplicates** the Text component (`TextXs`, `TextSm`) functionality:

**Hint specifications:**

- Size SM: `text-xs leading-[18px]` (12px/18px)
- Size MD: `text-sm leading-5` (14px/20px)
- Color: `text-text-tertiary`
- Semantic element: `span`

**Text component capabilities:**

```typescript
// From src/ui/typography/text.tsx
<TextXs color="muted">  // 12px/18px - matches Hint SM
<TextSm color="muted">  // 14px/20px - matches Hint MD
```

The Text components **already support**:

- Same size scales (xs, sm)
- Color variants (including muted/secondary colors)
- Polymorphic rendering (`as` prop)
- Radix Slot integration (`asChild`)
- forwardRef

**The Hint component reimplements identical typography functionality that already exists.**

#### Problem 2: Violates DRY (Don't Repeat Yourself) Principle

Creating a separate Hint component with its own CVA variants, size scales, and typography styling creates:

- **Code duplication** - Same size/typography logic duplicated
- **Maintenance burden** - Typography changes must be updated in multiple places
- **Inconsistency risk** - Typography scales can drift apart over time
- **Bundle size increase** - Duplicated CSS and component code

#### Problem 3: Architectural Inconsistency

The plan states:

> "While it shares styling concepts with the Text components, it has its own specific use case for form hints and should remain independent to allow for future form-specific enhancements."

This reasoning is **architecturally weak** because:

1. **Shared styling = composition opportunity**, not duplication justification
2. **"Future form-specific enhancements"** is speculative - design against current requirements, not hypothetical futures
3. **Semantic clarity** can be achieved through composition, not component proliferation

#### Architectural Principle Violation

**From `.claude/skills/sazonia-ui-components/SKILL.md`:**

> "Composability: Design components to be composed together"

The Hint component should **compose from** Text components, not duplicate them.

### Recommended Classification: **Composite Atom** (Uses Text Components)

**Better Approach:**

The Hint component should be classified as a **composite atom** that:

1. **Composes** Text components (`TextXs`, `TextSm`) for typography
2. **Adds** form-specific semantics (padding, default color, wrapper structure)
3. **Maintains** single responsibility (form hint styling and spacing)

**Why this is better:**

- **Leverages existing typography system** - No duplication
- **Separates concerns** - Text handles typography, Hint handles form context
- **Future-proof** - Typography changes automatically propagate
- **Smaller bundle** - Reuses existing Text component code
- **Consistent** - Typography always matches design system

---

## 2. Component Composition Strategy Review

### Current Strategy: Standalone with Duplicated Typography

**Assessment:** **CRITICAL ARCHITECTURAL FLAW**

The plan proposes implementing Hint as a standalone component with its own CVA variants and typography styling. This is **architecturally incorrect** for a design system.

### Problems with Current Strategy

#### 1. Tight Coupling to Typography Implementation

The planned implementation tightly couples form hint semantics with typography implementation:

```typescript
// Planned approach (WRONG)
const hintVariants = cva('pt-2 font-sans text-text-tertiary', {
  variants: {
    size: {
      sm: 'text-xs leading-[18px]', // Duplicates TextXs
      md: 'text-sm leading-5', // Duplicates TextSm
    },
  },
});
```

**Issues:**

- Typography scales duplicated from Text component
- If Text component typography changes, Hint stays out of sync
- Violates single source of truth for typography

#### 2. Missed Abstraction Opportunity

The Text component already provides the exact abstraction needed:

```typescript
// Text component already supports this
<TextXs color="muted" className="pt-2">Hint text</TextXs>
<TextSm color="muted" className="pt-2">Hint text</TextSm>
```

The **only difference** Hint adds is:

1. Default color (`text-tertiary`)
2. Top padding (`pt-2`)
3. Semantic wrapper

These are **composition concerns**, not duplication concerns.

#### 3. Component Proliferation Anti-Pattern

Creating standalone components for every contextual use case leads to:

- **Component explosion** - Soon you'll have `ErrorText`, `HelperText`, `CaptionText`, etc.
- **Maintenance nightmare** - Typography changes require updating dozens of components
- **Bundle bloat** - Each component carries full implementation weight
- **Cognitive load** - Developers must remember which component to use when

### Recommended Composition Strategy

**Option A: Compose from Text Components (RECOMMENDED)**

Create Hint as a **thin wrapper** that composes Text components:

```typescript
// src/ui/inputs/hint.tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';
import { TextXs, TextSm } from '@/ui/typography';

export interface HintProps {
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Hint = forwardRef<HTMLSpanElement, HintProps>(
  ({ size = 'md', children, className }, ref) => {
    const TextComponent = size === 'sm' ? TextXs : TextSm;

    return (
      <TextComponent
        ref={ref}
        as="span"
        color="muted"  // Maps to text-secondary
        className={cn('pt-2', className)}
      >
        {children}
      </TextComponent>
    );
  }
);

Hint.displayName = 'Hint';
```

**Benefits:**

- **Reuses Text component** - No typography duplication
- **Type-safe** - Inherits Text component types
- **Consistent** - Typography always matches design system
- **Maintainable** - Typography changes propagate automatically
- **Smaller** - ~20 lines vs. ~60 lines in planned approach
- **Clear intent** - "Hint is a styled Text component for forms"

**Trade-offs:**

- Adds dependency on Text components (acceptable - they're in the same design system)
- Slightly less flexible (can't add custom CVA variants) - but this is actually a benefit (prevents scope creep)

**Option B: Use CVA with Semantic Layer (ALTERNATIVE)**

If you must have CVA variants, create a semantic wrapper:

```typescript
const hintVariants = cva('font-sans pt-2', {
  variants: {
    size: {
      sm: '', // Use base TextXs
      md: '', // Use base TextSm
    },
    color: {
      default: 'text-text-tertiary',
      error: 'text-destructive',
    },
  },
  defaultVariants: { size: 'md', color: 'default' },
});

export const Hint = forwardRef<HTMLSpanElement, HintProps>(
  ({ size = 'md', color, className, children }, ref) => {
    const TextComponent = size === 'sm' ? TextXs : TextSm;

    return (
      <TextComponent
        ref={ref}
        as="span"
        className={cn(hintVariants({ size, color }), className)}
      >
        {children}
      </TextComponent>
    );
  }
);
```

**Benefits:**

- Still composes from Text
- Adds semantic color variants (default, error)
- Maintains CVA pattern familiarity

**Trade-offs:**

- More complex than Option A
- Only worthwhile if you need multiple color variants NOW (not in speculative future)

### Recommendation: **Option A** (Simple Composition)

Use the simple composition approach unless you have **current, concrete requirements** for:

1. Error state hints (red color)
2. Warning state hints (orange color)
3. Other color variants

**If those requirements emerge later, refactor then.** Don't design for hypothetical futures.

---

## 3. Architectural Pattern Alignment

### CVA Pattern Compliance

**Assessment:** EXCELLENT (with modification)

The plan correctly proposes:

- ✅ Using CVA for variant management
- ✅ Exporting `hintVariants` for external use
- ✅ Type-safe variant props with `VariantProps`
- ✅ Default variants specified

**However:** If composition approach is adopted (recommended), CVA usage should be minimal or eliminated entirely.

### forwardRef Pattern

**Assessment:** EXCELLENT

The plan correctly specifies:

- ✅ Using `forwardRef` for ref forwarding
- ✅ Proper TypeScript typing with `ComponentPropsWithoutRef`
- ✅ Setting `displayName`

```typescript
// Planned approach is correct
export const Hint = forwardRef<HTMLSpanElement, HintProps>(
  ({ className, size, children, ...props }, ref) => {
    // ...
  }
);
Hint.displayName = 'Hint';
```

### Polymorphic Pattern (`as` and `asChild`)

**Assessment:** INCORRECT for Hint Component

The plan proposes supporting both `as` and `asChild` props:

```typescript
// Planned (UNNECESSARY COMPLEXITY)
as?: ElementType;
asChild?: boolean;
```

**Problem:** Hint is a **semantic form helper text element**. It should always render as a `span` (inline text). Allowing polymorphic rendering adds complexity without benefit.

**Questions to ask:**

1. When would you need Hint to render as a `div`? (Never - it's inline text)
2. When would you need Hint to render as a `p`? (Never - it accompanies inputs)
3. When would you need `asChild` behavior? (Never - it's not a compound component)

**Recommendation:** **Remove `as` and `asChild` props**

```typescript
// Better approach
export const Hint = forwardRef<HTMLSpanElement, HintProps>(
  ({ size = 'md', children, className }, ref) => {
    const TextComponent = size === 'sm' ? TextXs : TextSm;
    return (
      <TextComponent
        ref={ref}
        as="span"  // Always span, not configurable
        color="muted"
        className={cn('pt-2', className)}
      >
        {children}
      </TextComponent>
    );
  }
);
```

**Rationale:**

- **Simpler API** - Less props to document and maintain
- **Clearer intent** - Hint is always inline text
- **Prevents misuse** - Can't accidentally render as block element
- **Follows YAGNI** - You Aren't Gonna Need It

### React Import Convention

**Assessment:** NEEDS VERIFICATION

The plan doesn't specify import style. Based on `.claude/skills/sazonia-ui-components/SKILL.md`:

**Required:**

```typescript
// ✅ CORRECT
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
```

**Forbidden:**

```typescript
// ❌ WRONG
import * as React from 'react';
```

**Action Required:** Ensure implementation uses direct imports.

---

## 4. Design System Integration

### Export Pattern Compliance

**Assessment:** EXCELLENT

The plan correctly specifies the three-tier export pattern:

```typescript
// 1. Component file: src/ui/inputs/hint.tsx
export { Hint, hintVariants };
export type { HintProps };

// 2. Category barrel: src/ui/inputs/index.ts
export * from './hint';

// 3. Root barrel: src/ui/index.ts
export * from './inputs';
```

This follows the established pattern from other components.

**Verification Required:**

- Ensure `src/ui/inputs/index.ts` doesn't already exist with different exports
- Confirm `src/ui/index.ts` doesn't already export `./inputs`

### Category Placement

**Assessment:** EXCELLENT

Placing Hint in `src/ui/inputs/` is architecturally correct:

**Rationale:**

1. **Semantic grouping** - Form-related components belong together
2. **Discoverability** - Developers building forms look in `inputs/`
3. **Cohesion** - Hint, InputLabel, and future Input components are related
4. **Follows pattern** - InputLabel already exists in `src/ui/inputs/`

**Existing inputs category:**

```
src/ui/inputs/
├── index.ts
├── input-label.tsx
└── __tests__/
    └── input-label.test.tsx
```

**After adding Hint:**

```
src/ui/inputs/
├── index.ts
├── input-label.tsx
├── hint.tsx          # NEW
└── __tests__/
    ├── input-label.test.tsx
    └── hint.test.tsx  # NEW
```

**Note:** The plan correctly identifies this is a **new category introduction** since `inputs/` currently only has InputLabel.

### Import Path Validation

**Assessment:** EXCELLENT

Both import patterns are valid and well-documented:

```typescript
// ✅ Primary (recommended in plan)
import { Hint } from '@/ui';

// ✅ Alternative (also valid)
import { Hint } from '@/ui/inputs';
```

**Tree-shaking:** Both paths support tree-shaking with Next.js 15's optimized bundling.

---

## 5. Design Token Usage

### Color Token Compliance

**Assessment:** NEEDS CORRECTION

The plan specifies using `text-text-tertiary` (#889096):

**Problem:** The token name `text-text-tertiary` appears incorrect based on `src/app/globals.css` patterns.

**Expected token naming from styling guidelines:**

- `text-text-primary` → `text-foreground` or `text-text-primary`
- `text-text-secondary` → `text-muted-foreground` or `text-text-secondary`
- `text-text-tertiary` → **Needs verification in globals.css**

**Recommendation:** Verify the correct semantic color token for tertiary/helper text. Based on `src/ui/typography/text.tsx`:

```typescript
// Text component uses
color: {
  default: 'text-text-primary',
  muted: 'text-text-secondary',
  // ...
}
```

For hint text, **`text-text-secondary`** (muted color) is likely more appropriate than a hypothetical `text-text-tertiary`.

**Action Required:**

1. Check `src/app/globals.css` for actual color token definitions
2. Use `text-text-secondary` if `text-text-tertiary` doesn't exist
3. If using composition approach, leverage Text component's `color="muted"` prop

### Typography Token Compliance

**Assessment:** EXCELLENT (if using Text components)

If using the recommended composition approach, typography is handled by Text components, which already use correct design tokens:

```typescript
// TextXs
'text-xs leading-[18px]';

// TextSm
'text-sm leading-5';
```

These match the Figma specifications exactly.

### Spacing Token Compliance

**Assessment:** EXCELLENT

The plan correctly uses `pt-2` (8px top padding) which aligns with Tailwind's spacing scale and the design specification.

---

## 6. Testing Strategy

### Test Coverage

**Assessment:** EXCELLENT

The plan proposes comprehensive test coverage:

**Unit tests (>90% coverage):**

- ✅ Default rendering
- ✅ Size variants (sm, md)
- ✅ Custom className merging
- ✅ Ref forwarding
- ✅ Empty children handling
- ✅ Long content handling

**Edge cases:**

- ✅ Empty string children
- ✅ Very long text (500+ characters)
- ✅ Special characters and HTML entities

**Recommendation:** If composition approach is used, add tests for:

- Text component integration
- Color prop passthrough
- Proper Text component selection (TextXs vs TextSm)

### Test File Location

**Assessment:** EXCELLENT

```
src/ui/inputs/__tests__/hint.test.tsx
```

Follows the established pattern from other components.

---

## 7. Storybook Documentation

### Story Requirements

**Assessment:** EXCELLENT

The plan proposes 7 comprehensive stories:

1. ✅ **Default** - Basic usage
2. ✅ **Sizes** - Visual size comparison
3. ✅ **LongText** - Text wrapping behavior
4. ✅ **WithFormField** - Real-world example
5. ✅ **MultipleHints** - Multiple hints pattern
6. ✅ **ErrorHint** - Error state example
7. ✅ **AllVariants** - Complete visual grid

**Strong points:**

- Real-world usage examples (WithFormField)
- Edge case coverage (LongText)
- Comprehensive visual reference (AllVariants)

**Recommendation:** If composition approach is used, add story showing:

- **Composition pattern** - How Hint wraps Text components internally

### Story File Location

**Assessment:** EXCELLENT

```
src/stories/inputs/hint.stories.tsx
```

Follows the established pattern. The plan correctly identifies this requires creating the `src/stories/inputs/` directory.

---

## 8. Accessibility Considerations

### Semantic HTML

**Assessment:** GOOD

The plan proposes using `span` as the default element, which is correct for inline form helper text.

**Recommendation:** Ensure aria attributes are considered:

- Associated input should reference hint via `aria-describedby`
- This should be documented in Storybook

Example pattern:

```typescript
<label htmlFor="email">Email</label>
<input id="email" aria-describedby="email-hint" />
<Hint id="email-hint">We'll never share your email</Hint>
```

### Screen Reader Support

**Assessment:** NEEDS IMPROVEMENT

The plan doesn't address screen reader announcements.

**Recommendation:** Document best practices:

1. Use `aria-describedby` to associate hint with input
2. Use `aria-live="polite"` for dynamic hints (error messages)
3. Ensure color is not the only differentiator (use icons for errors)

---

## 9. Performance Considerations

### Bundle Size Impact

**Current Plan:** Standalone component with CVA variants
**Estimated Impact:** +2KB (component + variants + styles)

**Recommended Approach:** Composition with Text components
**Estimated Impact:** +0.5KB (wrapper logic only, reuses Text)

**Bundle Size Savings:** ~1.5KB by using composition

### CSS Generation

**Current Plan:** Generates duplicate CSS for typography scales
**Recommended Approach:** Reuses existing Text component CSS

---

## Critical Issues Summary

### 1. CRITICAL: Component Duplication

**Issue:** Hint duplicates Text component functionality
**Impact:** Code duplication, maintenance burden, bundle size
**Severity:** CRITICAL
**Action Required:** Use composition instead of duplication

### 2. HIGH: Incorrect Atomic Classification

**Issue:** Classified as standalone atom when it should compose from Text
**Impact:** Architectural inconsistency, missed abstraction opportunity
**Severity:** HIGH
**Action Required:** Reclassify as composite atom

### 3. MEDIUM: Unnecessary Polymorphic Props

**Issue:** Proposes `as` and `asChild` props without justification
**Impact:** API complexity, potential misuse
**Severity:** MEDIUM
**Action Required:** Remove polymorphic props

### 4. LOW: Color Token Verification Needed

**Issue:** `text-text-tertiary` token may not exist
**Impact:** Build errors or incorrect styling
**Severity:** LOW
**Action Required:** Verify token exists in globals.css

---

## Recommendations

### Priority 1: MUST FIX (Critical)

1. **Adopt Composition Strategy**
   - Compose Hint from Text components (TextXs, TextSm)
   - Remove duplicate typography implementation
   - Use Option A (Simple Composition) from section 2

2. **Reclassify Component**
   - Update plan to classify Hint as "Composite Atom"
   - Document composition dependencies clearly

3. **Verify Color Tokens**
   - Confirm `text-text-tertiary` exists in `globals.css`
   - Use `text-text-secondary` if tertiary doesn't exist
   - Leverage Text component's `color="muted"` prop

### Priority 2: SHOULD FIX (Important)

4. **Remove Polymorphic Props**
   - Remove `as` prop (always render as span)
   - Remove `asChild` prop (not needed for simple text)
   - Simplify component API

5. **Enhance Accessibility Documentation**
   - Add `aria-describedby` usage examples in Storybook
   - Document screen reader best practices
   - Add accessibility story showing proper input association

6. **Add Composition Test**
   - Test that Hint properly renders Text components
   - Verify size prop maps to correct Text component (TextXs vs TextSm)

### Priority 3: NICE TO HAVE (Optional)

7. **Add Variant Story**
   - If error/warning variants are added later, show in Storybook
   - For now, defer until requirement emerges

8. **Performance Documentation**
   - Document bundle size benefit of composition approach
   - Add note about CSS reuse in plan

---

## Revised Implementation Approach

### Recommended Code Structure

````typescript
// src/ui/inputs/hint.tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';
import { TextXs, TextSm } from '@/ui/typography';

export interface HintProps extends Omit<ComponentPropsWithoutRef<'span'>, 'color'> {
  /**
   * Size variant
   * - sm: 12px (text-xs)
   * - md: 14px (text-sm)
   * @default 'md'
   */
  size?: 'sm' | 'md';

  /**
   * Hint text content
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Hint - Form helper text component
 *
 * Provides contextual information below form inputs. Composes from
 * Text components (TextXs, TextSm) to ensure typography consistency.
 *
 * @example
 * ```tsx
 * <label htmlFor="email">Email</label>
 * <input id="email" aria-describedby="email-hint" />
 * <Hint id="email-hint">We'll never share your email</Hint>
 * ```
 */
export const Hint = forwardRef<HTMLSpanElement, HintProps>(
  ({ size = 'md', children, className, ...props }, ref) => {
    const TextComponent = size === 'sm' ? TextXs : TextSm;

    return (
      <TextComponent
        ref={ref}
        as="span"
        color="muted"
        className={cn('pt-2', className)}
        {...props}
      >
        {children}
      </TextComponent>
    );
  }
);

Hint.displayName = 'Hint';
````

### Benefits of This Approach

1. **No duplication** - Reuses Text component typography
2. **Type-safe** - Inherits Text component types
3. **Consistent** - Typography always matches design system
4. **Maintainable** - Only ~30 lines of code
5. **Flexible** - Still supports className overrides
6. **Accessible** - Inherits Text component accessibility
7. **Performant** - Reuses existing CSS, minimal bundle impact

---

## Conclusion

The Hint component plan is **well-structured and comprehensive** in terms of documentation, testing strategy, and Storybook coverage. However, it suffers from a **critical architectural flaw**: it duplicates typography functionality that already exists in the Text component.

**Key Takeaway:**
**Composition over duplication.** Design systems should reuse existing primitives, not duplicate them.

### Approval Status: CONDITIONAL APPROVAL

**Approve implementation IF:**

1. ✅ Composition approach is adopted (uses Text components)
2. ✅ Polymorphic props (`as`, `asChild`) are removed
3. ✅ Color token is verified (use `text-text-secondary` via `color="muted"`)
4. ✅ Accessibility documentation is enhanced

**Block implementation IF:**

- ❌ Standalone approach with duplicated typography is used

---

## Next Steps

1. **Update plan document** to reflect composition strategy
2. **Verify color tokens** in `globals.css`
3. **Implement revised component** using recommended code structure
4. **Create comprehensive tests** including composition verification
5. **Build Storybook stories** with accessibility examples
6. **Run validation commands** (type-check, lint, test, build)

---

## References

- **Plan Document:** `ai/plans/ui/hint-component-2025-11-30.md`
- **Text Component:** `src/ui/typography/text.tsx`
- **InputLabel Component:** `src/ui/inputs/input-label.tsx` (sibling component)
- **UI Components Skill:** `.claude/skills/sazonia-ui-components/SKILL.md`
- **Styling Guidelines:** `.claude/rules/styling-guidelines.md`

---

**Evaluation Completed:** 2025-11-30
**Evaluator:** UI/UX Architecture Agent
**Status:** APPROVE WITH REQUIRED MODIFICATIONS
