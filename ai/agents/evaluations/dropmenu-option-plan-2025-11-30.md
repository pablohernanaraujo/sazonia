# Architectural Evaluation: DropmenuOption Component Plan

**Component**: DropmenuOption
**Plan Document**: `ai/plans/ui/dropmenu-option-plan-2025-11-30.md`
**Evaluation Date**: 2025-11-30
**Evaluator**: UI/UX Architecture Agent
**Overall Score**: 92/100 - Excellent architectural alignment with minor improvements needed

---

## Executive Summary

The DropmenuOption component plan demonstrates **excellent architectural alignment** with the sazonia-web design system patterns. The plan correctly identifies this as a Molecule-level component, follows established CVA patterns, and properly composes existing atoms (Icon, Typography). The implementation strategy is sound and well-documented.

**Key Strengths**:

- Correct atomic design classification (Molecule)
- Proper composition of Icon and Typography atoms
- Comprehensive CVA variant structure
- Complete documentation and testing strategy
- Excellent alignment with existing dropmenu components

**Critical Issues**: None identified

**Recommendations**: 4 minor improvements for architectural excellence

---

## Architectural Assessment

### 1. Atomic Design Classification: EXCELLENT ✓

**Classification**: Molecule
**Verdict**: Correct

**Analysis**:

- **Proper composition**: Combines Icon (atom) + Typography (atom) into a cohesive menu item
- **Single responsibility**: Represents one menu option with optional add-ons
- **Appropriate abstraction**: Not too granular (atom) nor too complex (organism)
- **Clear parent-child relationship**: Will be composed within dropmenu organisms/templates

**Evidence from Plan**:

```
Composition Requirements:
- Required Atoms:
  - Icon from @/ui/icons - For left/right icon add-ons
  - TextSm, TextMd from @/ui/typography - For option label and text add-ons
```

**Comparison to Existing Patterns**:

- DropmenuHeader: Molecule (divider/label in menu) ✓
- DropmenuDivider: Atom (single-element separator) ✓
- DropmenuFooter: Molecule (footer with actions/text) ✓
- DropmenuOption: Molecule (menu item) ✓ **Consistent**

**Score**: 10/10

---

### 2. Component Composition Strategy: VERY GOOD ✓

**Verdict**: Well-designed with one architectural recommendation

**Strengths**:

1. **Proper atom integration**:

   ```typescript
   // Plan correctly identifies composition pattern
   Required Atoms:
   - Icon from @/ui/icons - For left/right icon add-ons
   - TextSm, TextMd from @/ui/typography
   ```

2. **Flexible add-on system**:
   - Supports optional left/right add-ons
   - Allows custom React nodes for extensibility
   - Default placeholders for common cases

3. **Size-appropriate typography mapping**:
   ```
   | Size | Font Size | Icon Size |
   | SM   | 14px      | 16px (sm) |
   | MD   | 14px      | 16px (sm) |
   | LG   | 16px      | 20px (md) |
   ```

**Architectural Concerns**:

**CONCERN #1: Typography Component Selection**

**Issue**: The plan uses `TextSm` and `TextMd` for labels, but the pattern suggests using Typography components for **add-ons** (right text), not the main label.

**Current Plan**:

```typescript
// From implementation plan
<div className="flex-1 overflow-hidden">
  <span>{label}</span>  // Direct span, not Typography component
</div>
```

**Analysis**: Looking at the Figma specs:

- Label text: Primary text, always visible, core content
- Right add-on text: Secondary text (text-text-subtle), optional metadata

**Recommendation**: The plan should clarify:

1. **Label**: Use direct `<span>` with Tailwind classes (as currently planned) ✓
2. **Right add-on text**: Use `TextSm`/`TextMd` Typography component with `color="muted"`
3. **Left/right icons**: Use `Icon` component with appropriate size mapping

**Why this matters**:

- Maintains clear separation between structural content (label) and compositional elements (add-ons)
- Follows the pattern established in Button component where text content is direct, but icons use Icon component
- Typography components add overhead for simple labels

**Score**: 8/10 (Deduct 2 points for ambiguity in composition strategy)

---

### 3. Architectural Alignment with Project Patterns: EXCELLENT ✓

**Verdict**: Exceptional alignment with established patterns

**CVA Pattern Compliance**: Perfect ✓

The plan follows the exact CVA pattern used across the codebase:

```typescript
// Planned structure matches existing patterns perfectly
const dropmenuOptionVariants = cva(
  // Base styles
  "flex items-center w-full cursor-pointer transition-colors",
  {
    variants: {
      size: { sm, md, lg },
      state: { default, hovered, pressed, focus, disabled }
    },
    compoundVariants: [
      // State + size combinations for backgrounds
    ],
    defaultVariants: { size: 'lg', state: 'default' }
  }
);
```

**Comparison to DropmenuHeader**:

```typescript
// Existing pattern from dropmenu-header.tsx
const dropmenuHeaderVariants = cva(
  'w-full pb-0 font-sans font-medium text-text-secondary',
  {
    variants: {
      size: {
        sm: 'px-3 pt-3 text-xs leading-[18px]',
        md: 'px-4 pt-4 text-sm leading-5',
      },
    },
    defaultVariants: { size: 'md' },
  }
);
```

**Alignment Score**:

- ✓ Uses CVA for variant management
- ✓ Base styles define common behavior
- ✓ Size variants for responsive scaling
- ✓ Compound variants for complex state combinations
- ✓ Default variants specified
- ✓ Exports both component and variants

**forwardRef Pattern Compliance**: Perfect ✓

```typescript
// Planned pattern
export const DropmenuOption = forwardRef<HTMLDivElement, DropmenuOptionProps>(
  ({ size, state, label, className, ...props }, ref) => {
    return <div ref={ref} className={cn(...)} {...props} />;
  }
);
DropmenuOption.displayName = 'DropmenuOption';
```

**Matches established pattern** from DropmenuHeader, Button, Icon, Typography.

**React Import Pattern Compliance**: Perfect ✓

```typescript
// Correct direct imports (not namespace imports)
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
```

**Follows skill guidelines** from `.claude/skills/sazonia-ui-components/SKILL.md`:

- ✓ Direct imports from 'react' (not `import * as React`)
- ✓ Type-only imports for types

**Export Pattern Compliance**: Perfect ✓

```typescript
// Planned barrel export pattern
// 1. Component file exports
export { DropmenuOption, dropmenuOptionVariants };
export type { DropmenuOptionProps };

// 2. Category barrel: src/ui/dropmenus/index.ts
export * from './dropmenu-option';

// 3. Import usage
import { DropmenuOption } from '@/ui';
```

**Matches exact pattern** from skill guidelines.

**Score**: 10/10

---

### 4. Design System Integration: VERY GOOD ✓

**Verdict**: Excellent token usage with one design token concern

**Semantic Token Usage**: Excellent ✓

The plan correctly uses semantic color tokens:

```css
/* State Backgrounds - Semantic tokens */
| State    | Background Color                    |
| Default  | bg-background (#ffffff)             |
| Hovered  | bg-background-secondary (#f9fafb)   |
| Pressed  | bg-background-tertiary (#f0f2f4)    |
| Focus    | shadow-[0_0_0_3px_#d9e2fc]          |
| Disabled | bg-background + text-text-tertiary  |

/* Text Colors - Semantic tokens */
| Default  | text-text-primary (#11181c)         |
| Disabled | text-text-tertiary (#889096)        |

/* Add-on Text */
| Right text | text-text-subtle (#697177)        |
```

**Analysis**:

- ✓ Uses `bg-background-*` semantic tokens (not raw colors)
- ✓ Uses `text-text-*` semantic hierarchy
- ✓ Consistent with styling guidelines

**Spacing Token Usage**: Perfect ✓

```typescript
/* Size variants use correct Tailwind spacing scale */
| Size | Padding X | Padding Y | Gap  |
| SM   | 12px (px-3) | 6px (py-1.5) | 10px (gap-2.5) |
| MD   | 12px (px-3) | 10px (py-2.5) | 12px (gap-3) |
| LG   | 16px (px-4) | 12px (py-3) | 12px (gap-3) |
```

**Analysis**:

- ✓ Uses Tailwind spacing scale (0.25rem increments)
- ✓ Consistent with design system spacing tokens
- ✓ Matches existing component patterns

**Typography Token Integration**: Very Good

The plan maps to Typography components correctly:

```typescript
| Size | Font Size | Line Height | Component |
| SM   | 14px      | 20px        | TextSm    |
| MD   | 14px      | 20px        | TextSm    |
| LG   | 16px      | 24px        | TextMd    |
```

**Matches Typography atom definitions** from `src/ui/typography/text.tsx`:

- TextSm: `text-sm leading-5` (14px/20px) ✓
- TextMd: `text-base leading-6` (16px/24px) ✓

**Border Radius Usage**: Perfect ✓

The plan doesn't explicitly mention border-radius, but interactive menu items typically have subtle rounding:

**Recommendation**: Consider adding `rounded-sm` (6px) for subtle rounding on hover/focus states, consistent with styling guidelines for interactive elements.

**Shadow Usage**: Good, but clarification needed

**Issue**: The plan specifies focus shadow as:

```css
focus: shadow-[0_0_0_3px_#d9e2fc];
```

**Analysis**:

- Uses **arbitrary value** instead of semantic token
- Color `#d9e2fc` appears to be brand-300 (purple light)
- Should use semantic focus ring pattern from design system

**Recommendation**: Use the standard focus-visible pattern from styling guidelines:

```typescript
focus-visible:ring-2
focus-visible:ring-border-brand
focus-visible:ring-offset-2
```

**From `src/app/globals.css`**:

```css
--color-border-brand: /* brand focus color */;
```

**Why this matters**:

- Maintains consistency with other interactive components
- Uses semantic tokens (supports theme changes)
- Follows accessibility best practices for focus indicators

**Score**: 8/10 (Deduct 2 points for hardcoded focus shadow color)

---

### 5. State Management Architecture: EXCELLENT ✓

**Verdict**: Well-designed state handling with proper separation

**State Prop Design**: Good with recommendation

The plan includes a `state` prop for explicit state control:

```typescript
interface DropmenuOptionProps {
  state?: 'default' | 'hovered' | 'pressed' | 'focus' | 'disabled';
  disabled?: boolean;
}
```

**Analysis**:

**Strengths**:

- Useful for Storybook visualization
- Allows controlled state for testing
- Clear state enumeration

**Architectural Concern**:

The plan notes:

> "The state prop is useful for Storybook visualization but in production, states will typically be handled via CSS pseudo-classes (:hover, :focus, :active) and the disabled prop"

**This is correct**, but the implementation needs clarity:

**Recommendation**:

```typescript
// Production usage - pseudo-classes handle states automatically
<div
  className="hover:bg-background-secondary active:bg-background-tertiary"
  disabled={isDisabled}
>

// Storybook usage - explicit state prop for visualization
<div data-state="hovered" className="data-[state=hovered]:bg-background-secondary">
```

**Better approach**: Use `data-*` attributes for explicit state control:

```typescript
const dropmenuOptionVariants = cva(
  "transition-colors hover:bg-background-secondary active:bg-background-tertiary",
  {
    variants: {
      state: {
        default: '',
        hovered: 'data-[state=hovered]:bg-background-secondary',
        pressed: 'data-[state=pressed]:bg-background-tertiary',
        // ...
      }
    }
  }
);

// Usage
<div data-state={state} className={cn(dropmenuOptionVariants({ state }))} />
```

**Why this matters**:

- Maintains natural browser behavior (hover/focus/active)
- Allows override for Storybook/testing via data attributes
- Follows Radix UI patterns (data-state attributes)

**Disabled State**: Perfect ✓

```typescript
disabled?: boolean;
// Applied as:
// - pointer-events-none (prevents interaction)
// - text-text-tertiary (muted text color)
// - aria-disabled="true" (accessibility)
```

**Score**: 9/10 (Deduct 1 point for state prop implementation clarity)

---

## Critical Issues

**None identified** - This component plan has no blocking architectural issues.

---

## Recommendations (Prioritized)

### Recommendation 1: Clarify Focus State Pattern (HIGH PRIORITY)

**Current Plan**:

```css
focus: shadow-[0_0_0_3px_#d9e2fc];
```

**Recommended**:

```typescript
const dropmenuOptionVariants = cva(
  'focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:outline-none'
  // ...
);
```

**Rationale**:

- Uses semantic `border-brand` token
- Follows established focus pattern from Button component
- Maintains accessibility compliance
- Supports future theming

**Impact**: Medium - Ensures consistency across all interactive components

---

### Recommendation 2: Clarify Typography Usage in Composition (MEDIUM PRIORITY)

**Current Plan**: Ambiguous about when to use Typography components vs direct elements

**Recommended Clarification**:

```typescript
// Main label - Use direct span with Tailwind (optimal for performance)
<span className="text-sm leading-5 text-text-primary">
  {label}
</span>

// Right add-on text - Use Typography component (for semantic consistency)
{showRightAddOn && (
  <TextSm color="muted" className="ml-auto">
    {rightText}
  </TextSm>
)}

// Icons - Use Icon component (required for size/color management)
{showLeftAddOn && (
  <Icon icon={leftIcon} size={iconSize} />
)}
```

**Rationale**:

- **Label**: Direct elements avoid unnecessary component overhead
- **Add-ons**: Typography components provide semantic color variants
- **Icons**: Icon component required for size mapping consistency
- Matches pattern from Button component (direct text, Icon components for icons)

**Impact**: Medium - Improves clarity and performance

---

### Recommendation 3: Use Data Attributes for State Control (MEDIUM PRIORITY)

**Current Plan**: Uses `state` prop but unclear how it integrates with pseudo-classes

**Recommended Pattern**:

```typescript
const dropmenuOptionVariants = cva(
  [
    'flex w-full cursor-pointer items-center',
    'transition-colors duration-150',
    // Natural browser states
    'hover:bg-background-secondary',
    'active:bg-background-tertiary',
    'focus-visible:ring-2 focus-visible:ring-border-brand',
  ],
  {
    variants: {
      // Explicit state override for Storybook/testing
      visualState: {
        default: '',
        hovered: 'bg-background-secondary',
        pressed: 'bg-background-tertiary',
        focus: 'ring-2 ring-border-brand',
      },
    },
  }
);

export interface DropmenuOptionProps {
  /**
   * Visual state override (for Storybook/testing only)
   * In production, use natural hover/focus/active states
   */
  visualState?: 'default' | 'hovered' | 'pressed' | 'focus';
  disabled?: boolean;
}
```

**Usage**:

```tsx
// Production - natural states work automatically
<DropmenuOption label="Edit" />

// Storybook - explicit state visualization
<DropmenuOption label="Edit" visualState="hovered" />
```

**Rationale**:

- Separates "visual state for display" from "interaction state"
- Natural pseudo-classes remain functional
- Explicit override for documentation/testing
- Prevents confusion about state management

**Impact**: Low-Medium - Improves developer experience and testing

---

### Recommendation 4: Add Border Radius for Polish (LOW PRIORITY)

**Current Plan**: No mention of border-radius

**Recommended Addition**:

```typescript
const dropmenuOptionVariants = cva([
  'flex w-full cursor-pointer items-center',
  'rounded-sm', // 6px border radius
  'transition-colors duration-150',
  // ...
]);
```

**Rationale**:

- Styling guidelines recommend `rounded-sm` (6px) for inputs and subtle elements
- Adds visual polish on hover/focus states
- Matches design system patterns for interactive elements
- Subtle enough not to conflict with dropdown container

**Impact**: Low - Aesthetic improvement, follows design system conventions

---

## Positive Patterns (Commendable Aspects)

### 1. Comprehensive Testing Strategy ✓

The plan includes **exceptional test coverage**:

```typescript
Testing Strategy:
- Rendering Tests (basic component mounting)
- Size Variant Tests (SM, MD, LG)
- State Variant Tests (all 5 states)
- Add-on Tests (visibility, custom add-ons)
- Composition Tests (className, ref forwarding)
- Accessibility Tests (aria-disabled, screen readers)
- Edge Cases (long text, special characters, unicode)
```

**Why this is excellent**:

- Goes beyond basic rendering tests
- Includes accessibility testing
- Tests edge cases (long text, special characters)
- Validates composition patterns (className merging, ref forwarding)

**Comparison**: Many component plans skip edge case testing. This plan is **exemplary**.

---

### 2. Complete Storybook Documentation ✓

The plan mandates **comprehensive Storybook coverage**:

```typescript
Required Stories:
1. Default Story
2. Variant Stories (3 size variants)
3. State Stories (5 states)
4. Add-on Stories (4 combinations)
5. Real-world Examples (3 scenarios)
6. Comparison Stories (AllSizes, AllStates, AllVariants)
```

**Why this is excellent**:

- Covers all variants systematically
- Includes real-world usage examples
- Provides comparison grids for designers
- Enforces visual documentation requirements

**Impact**: Ensures design system quality and developer experience.

---

### 3. Proper Size-to-Icon Mapping ✓

The plan correctly maps component sizes to Icon component sizes:

```typescript
| Component Size | Icon Size | Typography |
| SM             | sm (16px) | TextSm     |
| MD             | sm (16px) | TextSm     |
| LG             | md (20px) | TextMd     |
```

**Why this is correct**:

- Matches visual hierarchy (larger option = larger icon)
- Uses established Icon component size tokens
- Maintains consistency with Button component icon sizing
- Follows design system scale

---

### 4. Excellent Documentation Structure ✓

The plan document itself is **architecturally sound**:

- Clear problem/solution statements
- Atomic design classification with reasoning
- Complete file location mappings
- Step-by-step implementation guide
- Acceptance criteria with validation commands
- Design specifications with exact pixel values

**This plan serves as a template** for future component plans.

---

## Architecture Compliance Checklist

Based on `.claude/skills/sazonia-ui-components/SKILL.md`:

- ✅ Component is in correct category (`src/ui/dropmenus/`)
- ✅ File name is kebab-case (`dropmenu-option.tsx`)
- ✅ Uses direct React imports (not namespace)
- ✅ Uses `forwardRef` for ref forwarding
- ✅ Sets `displayName` for debugging
- ✅ Props extend `ComponentPropsWithoutRef<"div">`
- ✅ Variants defined with CVA
- ✅ Props include `VariantProps<typeof variants>`
- ✅ Uses `cn()` to merge className
- ✅ Default variants specified
- ✅ Added to category barrel export
- ✅ Added to root barrel export
- ✅ TypeScript types exported
- ✅ No `any` types used
- ✅ Accessible (ARIA attributes planned)

**Compliance Score**: 15/15 (100%)

---

## Security & Performance Considerations

### Security: No Issues ✓

- No external data sources
- No XSS vulnerabilities (React escapes content automatically)
- No sensitive data handling
- ARIA attributes properly planned

### Performance: Excellent ✓

**Strengths**:

- Uses CSS transitions (GPU-accelerated)
- No JavaScript-heavy animations
- Minimal re-renders (pure presentational component)
- Proper React.memo candidate if needed

**Recommendation**: Consider memoization if used in large lists:

```typescript
export const DropmenuOption = memo(
  forwardRef<HTMLDivElement, DropmenuOptionProps>(/* ... */)
);
```

**Only if profiling shows performance issues** in large menus (50+ items).

---

## Scalability Assessment

### Component Reusability: Excellent ✓

**Can be used in**:

- Dropdown menus (primary use case)
- Context menus
- Select dropdowns
- Autocomplete results
- Command palettes

**Flexibility Score**: 9/10 - Highly reusable design

### Extension Points: Very Good ✓

**Planned extension mechanisms**:

1. Custom add-on React nodes (leftAddOn, rightAddOn)
2. className override for custom styling
3. Compound variants for complex state combinations
4. forwardRef for DOM manipulation

**One improvement**: Consider adding `asChild` pattern for Radix UI integration:

```typescript
interface DropmenuOptionProps {
  asChild?: boolean; // Future: Radix UI DropdownMenu.Item integration
}
```

**Note**: The plan acknowledges this: "Consider adding asChild pattern in future for Radix UI integration"

---

## Final Recommendations Summary

| Priority | Recommendation                                                 | Impact | Effort |
| -------- | -------------------------------------------------------------- | ------ | ------ |
| HIGH     | Use semantic focus-visible pattern instead of hardcoded shadow | Medium | Low    |
| MEDIUM   | Clarify Typography usage (direct span vs component)            | Medium | Low    |
| MEDIUM   | Use data attributes for state control clarity                  | Medium | Low    |
| LOW      | Add rounded-sm for visual polish                               | Low    | Low    |

**All recommendations are non-blocking**. The component can be implemented successfully as planned, with these improvements enhancing consistency and maintainability.

---

## Conclusion

The DropmenuOption component plan demonstrates **exceptional architectural maturity**. It correctly applies atomic design principles, follows established CVA patterns, and integrates seamlessly with the design system.

**Key Achievements**:

1. ✅ Correct Molecule classification with clear atom composition
2. ✅ Perfect CVA and forwardRef pattern alignment
3. ✅ Comprehensive testing and Storybook coverage
4. ✅ Proper semantic token usage
5. ✅ Excellent documentation structure

**Minor Improvements**:

1. Clarify focus state pattern (use semantic tokens)
2. Clarify Typography component usage in composition
3. Add data attribute pattern for state control
4. Consider border-radius for visual polish

**Overall Verdict**: **APPROVED for implementation** with minor recommendations to enhance consistency.

**Confidence Score**: 95% - This component will integrate smoothly into the design system and serve as a solid foundation for dropdown menu interactions.

---

## Appendix: Code Example (Recommended Implementation)

Based on this evaluation, here's the recommended implementation approach:

```typescript
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';
import { TextSm, TextMd } from '@/ui/typography';

const dropmenuOptionVariants = cva(
  [
    'flex w-full items-center cursor-pointer',
    'rounded-sm', // Subtle rounding
    'transition-colors duration-150',
    // Natural browser states
    'hover:bg-background-secondary',
    'active:bg-background-tertiary',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand',
    'disabled:pointer-events-none disabled:text-text-tertiary',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2.5 px-3 py-1.5 text-sm leading-5',
        md: 'gap-3 px-3 py-2.5 text-sm leading-5',
        lg: 'gap-3 px-4 py-3 text-base leading-6',
      },
      // Visual state override for Storybook/testing
      visualState: {
        default: '',
        hovered: 'bg-background-secondary',
        pressed: 'bg-background-tertiary',
        focus: 'ring-2 ring-border-brand',
      },
    },
    defaultVariants: {
      size: 'lg',
      visualState: 'default',
    },
  }
);

const iconSizeMap = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

export interface DropmenuOptionProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'>,
    VariantProps<typeof dropmenuOptionVariants> {
  label: string;
  leftIcon?: typeof PhosphorIcon;
  rightText?: string;
  showLeftAddOn?: boolean;
  showRightAddOn?: boolean;
  leftAddOn?: ReactNode;
  rightAddOn?: ReactNode;
  disabled?: boolean;
}

export const DropmenuOption = forwardRef<HTMLDivElement, DropmenuOptionProps>(
  (
    {
      size = 'lg',
      visualState,
      label,
      leftIcon,
      rightText,
      showLeftAddOn = false,
      showRightAddOn = false,
      leftAddOn,
      rightAddOn,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const iconSize = iconSizeMap[size ?? 'lg'];
    const TextComponent = size === 'lg' ? TextMd : TextSm;

    return (
      <div
        ref={ref}
        aria-disabled={disabled || undefined}
        className={cn(dropmenuOptionVariants({ size, visualState }), className)}
        {...props}
      >
        {/* Left add-on */}
        {showLeftAddOn &&
          (leftAddOn || (leftIcon && <Icon icon={leftIcon} size={iconSize} />))}

        {/* Label */}
        <span className="flex-1 overflow-hidden text-ellipsis text-text-primary">
          {label}
        </span>

        {/* Right add-on */}
        {showRightAddOn &&
          (rightAddOn || (
            <TextComponent color="muted" className="ml-auto">
              {rightText}
            </TextComponent>
          ))}
      </div>
    );
  }
);

DropmenuOption.displayName = 'DropmenuOption';

export { dropmenuOptionVariants };
```

**Key Implementation Details**:

1. Uses semantic focus pattern (`focus-visible:ring-border-brand`)
2. Direct `<span>` for label, Typography component for right text
3. `visualState` prop for Storybook, natural pseudo-classes for production
4. `rounded-sm` for subtle polish
5. Proper icon size mapping
6. ARIA attributes for accessibility

This implementation balances architectural excellence with pragmatic design decisions.
