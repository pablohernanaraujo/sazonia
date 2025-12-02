# Architectural Evaluation: Floating Action Button (FAB) Plan

**Component**: Floating Action Button (FAB)
**Plan File**: `ai/plans/ui/floating-action-button-2025-11-30.md`
**Evaluation Date**: 2025-11-30
**Evaluator**: UI/UX Architecture Agent

---

## Executive Summary

**Overall Alignment Score**: 8.5/10

The FAB component plan demonstrates strong architectural alignment with the project's established patterns and design system principles. The plan correctly identifies composition dependencies, follows CVA variant patterns, and adheres to the barrel export conventions. However, there are several opportunities for improvement in atomic design classification, variant structure, and architectural consistency with existing button components.

---

## 1. Atomic Design Classification Correctness

**Score**: 7/10

### Analysis

**Classification**: The plan classifies FAB as a **Molecule**

**Reasoning Provided**:

- Combines Icon component (atom) with circular button container
- Includes optional loading spinner (uses Icon component)

### Critical Issues

#### Issue 1: Inconsistent Classification Logic

The plan's classification as a "molecule" is **architecturally questionable** when compared to the existing Button component pattern:

**Button Component Reality**:

- Located at `src/ui/buttons/button.tsx`
- Also uses Icon component for left/right icons
- Also includes loading spinner using Icon + CircleNotch
- Classified implicitly as an **Atom** (base interactive element)

**FAB Component as Described**:

- Located at `src/ui/buttons/fab.tsx`
- Uses Icon component for icon rendering
- Includes loading spinner using Icon + CircleNotch
- Classified as **Molecule**

**The Inconsistency**: If FAB is a molecule because it "combines Icon with a button container," then Button should also be classified as a molecule using the same logic. Both components have identical composition patterns.

### Recommendation

**FAB should be classified as an Atom, not a Molecule**, for the following reasons:

1. **Single Responsibility**: FAB is a primitive interactive element with a singular purpose - a clickable action trigger
2. **Compositional Equivalence**: FAB's composition pattern (button + icon) is identical to Button's pattern
3. **Not Composed FROM Other Molecules**: FAB doesn't compose ButtonGroup or other molecules; it uses Icon (an atom) just like Button does
4. **Atomic Design Principles**: Atoms are basic building blocks that can't be broken down further while maintaining their function. FAB fits this definition.

**Correct Classification**:

```
Component Type: Atom
Reasoning: FAB is a primitive interactive element that renders a single icon
within a circular button container. While it uses the Icon component
internally, this is implementation detail, not compositional architecture.
The component serves as a foundational building block, identical in
architectural role to the Button component.
```

### Positive Aspects

- The plan correctly identifies that FAB uses the Icon component
- The composition dependencies are accurately listed
- The reasoning shows thought about component relationships

---

## 2. Component Composition Strategy

**Score**: 9/10

### Analysis

The composition strategy is **architecturally sound** with one area for improvement.

### Strengths

1. **Icon Component Reuse**: Correctly identifies using the existing `Icon` component from `@/ui/icons` for:
   - Primary icon rendering
   - Loading spinner (CircleNotch)
   - Consistent sizing via Icon's size variants

2. **Inheritance from Button Patterns**: The plan references Button component patterns:
   - Loading state handling
   - Disabled state management
   - Icon rendering approach
   - Click handler pattern with loading prevention

3. **No Unnecessary Dependencies**: Doesn't introduce new dependencies where existing patterns work

### Area for Improvement

#### Missing: Icon Size Consistency Pattern

**Issue**: The plan states "Icon Size: Fixed at 24px regardless of FAB size" (line 456), but this **contradicts** the Icon component's size variant system.

**Icon Component Reality** (`src/ui/icons/icon.tsx`):

```typescript
const sizeMap: Record<NonNullable<IconVariants['size']>, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24, // ← FAB should use this
  xl: 32,
};
```

**Button Component Pattern** (`src/ui/buttons/button.tsx`, lines 162-166):

```typescript
const buttonIconSizeMap = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

// Later used as:
const iconSize = buttonIconSizeMap[size ?? 'md'];
```

**Recommendation**:

FAB should follow the **exact same pattern** as Button for icon size mapping:

```typescript
// In fab.tsx
const fabIconSizeMap = {
  sm: 'lg', // FAB sm (48px) → Icon lg (24px)
  md: 'lg', // FAB md (56px) → Icon lg (24px)
} as const;
```

This maintains architectural consistency while achieving the design requirement of 24px icons.

### Verdict

The composition strategy is excellent, but needs to explicitly follow Button's icon size mapping pattern to maintain architectural consistency across the button category.

---

## 3. Architectural Alignment with Project Patterns

**Score**: 9/10

### Analysis

The plan demonstrates **strong architectural alignment** with established patterns.

### Strengths

#### 3.1 CVA Pattern Compliance ✅

The plan correctly follows the CVA (Class Variance Authority) pattern used throughout the project:

**Alignment with Button Component**:

- Base classes for foundational styles
- Separate `variants` object for each dimension (style, size, color)
- `compoundVariants` for style+color combinations
- `defaultVariants` specification

**Example from Plan** (lines 252-257):

```typescript
// Proposed structure matches Button's approach
- style variants: filled, outline
- size variants: md, sm
- color variants: brand, gray
- compound variants for style+color+state combinations
```

#### 3.2 File Organization ✅

**Location**: `src/ui/buttons/fab.tsx` - **Correct**

This follows the established pattern:

- Button components in `src/ui/buttons/`
- Specialized button variants (ButtonGroup, ButtonGroupItem) in same category
- FAB is a button variant, so placement is architecturally appropriate

#### 3.3 Barrel Export Pattern ✅

**Export Strategy** (lines 59-75): **Perfect**

```typescript
// 1. Component exports
export { Fab, fabVariants };
export type { FabProps };

// 2. Category barrel: src/ui/buttons/index.ts
export * from './fab';

// 3. Import usage
import { Fab } from '@/ui'; // ✅ Recommended
import { Fab } from '@/ui/buttons'; // ✅ Also valid
```

This **exactly matches** the pattern from `.claude/skills/sazonia-ui-components/SKILL.md`.

#### 3.4 TypeScript Pattern Alignment ✅

The plan follows the project's TypeScript patterns:

**Button Component Pattern**:

```typescript
export type ButtonProps = BaseButtonProps &
  (IconOnlyButtonProps | TextButtonProps);
```

**Proposed FAB Pattern** (lines 258-269):

```typescript
// FabProps interface with:
// - icon (required)
// - style, size, color variants
// - loading, disabled states
// - aria-label (required)
// - Standard button props
```

**Recommendation**: FAB should use similar union type pattern:

```typescript
type BaseFabProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'aria-label'
> &
  VariantProps<typeof fabVariants> & {
    loading?: boolean;
    className?: string;
  };

export type FabProps = BaseFabProps & {
  icon: ComponentType<PhosphorIconProps>;
  'aria-label': string;
  children?: never;
};
```

This enforces "icon-only" nature and required `aria-label` at the type level.

#### 3.5 State Management Pattern ✅

**Loading State Pattern** (from Button):

```typescript
function createClickHandler(
  loading: boolean,
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined
): (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void {
  return (e) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e as React.MouseEvent<HTMLButtonElement>);
  };
}
```

The plan correctly identifies this pattern should be reused for FAB (line 255).

#### 3.6 Accessibility Pattern ✅

**Warning Pattern** (from Button, lines 241-250):

```typescript
function warnIfMissingAriaLabel(
  children: ReactNode,
  ariaLabel: string | undefined
): void {
  if (process.env.NODE_ENV !== 'production' && !children && !ariaLabel) {
    console.warn(
      'Button: Icon-only buttons require an aria-label for accessibility'
    );
  }
}
```

The plan correctly includes development warning for missing `aria-label` (line 268).

### Areas for Improvement

#### Issue 1: Missing forwardRef Implementation Detail

The plan mentions ref forwarding (line 371) but doesn't explicitly show the `forwardRef` wrapper pattern. Should include:

```typescript
export const Fab = forwardRef<HTMLButtonElement, FabProps>(
  (
    { icon: IconComponent, style, size, color, loading, disabled, ...props },
    ref
  ) => {
    // Implementation
  }
);

Fab.displayName = 'Fab';
```

#### Issue 2: Missing Reference to Button's Helper Functions

The plan should explicitly state: **"Reuse Button's helper functions"**:

- `warnIfMissingAriaLabel()` - Can use directly or adapt
- `createClickHandler()` - Reuse for loading state handling
- `getCommonButtonProps()` - May adapt for FAB-specific props

This would improve code reuse and architectural consistency.

---

## 4. Design System Integration Approach

**Score**: 10/10

### Analysis

The design system integration approach is **exemplary**.

### Strengths

#### 4.1 Design Token Mapping ✅

**Semantic Token Usage** (lines 145-160):

The plan correctly maps Figma design to existing CSS custom properties:

```
Brand Color:
- Default: bg-fill-primary (#3c61dd)
- Hover: bg-fill-primary-hover (#385bcc)
- Active: bg-fill-primary-active (#3451b2)
- Disabled: bg-fill-primary-disabled (#8fa6ef)
- Focus ring: brand/300 (#d9e2fc)

Gray Color:
- Border: border-border (#d7dbdf)
- Border hover: border-border-hover (#c1c8cd)
- Border active: border-border-active (#889096)
- Disabled: border-border-disabled (#e0e3e6)
```

**Verified Against** `src/app/globals.css`:

```css
--color-fill-primary: #3c61dd;          ✅ Matches
--color-fill-primary-hover: #385bcc;    ✅ Matches
--color-fill-primary-active: #3451b2;   ✅ Matches
--color-fill-primary-disabled: #8fa6ef; ✅ Matches
--color-border: #d7dbdf;                ✅ Matches
--color-border-hover: #c1c8cd;          ✅ Matches
```

**All mappings are correct** - no hardcoded colors.

#### 4.2 Shadow Token Usage ✅

**Shadow Implementation** (lines 124, 168):

```
- Filled style: shadow-lg by default
- Pressed state: removes shadow for "pressed in" effect
```

This follows Tailwind's shadow utility pattern and maintains consistency with the design system.

#### 4.3 Border Radius Token ✅

**Circular Shape** (plan references `--radius-full` on line 92):

```
Base classes should include: rounded-full
```

This uses Tailwind's `rounded-full` utility, which is the standard approach for circular elements.

#### 4.4 Spacing Token Mapping ✅

**Padding Calculations** (lines 134-143):

```
MD: Padding 16px (--spacing-3xl) + Icon 24px = 56px total
SM: Padding 12px (--spacing-xl) + Icon 24px = 48px total
```

While the plan references spacing tokens, the implementation should use Tailwind utilities:

```typescript
size: {
  md: 'p-4',  // 16px padding → 56px total with 24px icon
  sm: 'p-3',  // 12px padding → 48px total with 24px icon
}
```

#### 4.5 Export Integration ✅

The barrel export pattern (lines 59-75) is **perfect** and follows the design system's import conventions exactly as specified in `.claude/skills/sazonia-ui-components/SKILL.md`.

### Verdict

Design system integration is architecturally flawless. The plan demonstrates deep understanding of:

- Semantic token usage
- Barrel export conventions
- Design-to-code token mapping
- Consistency with existing patterns

---

## 5. CVA Variant Structure

**Score**: 7.5/10

### Analysis

The proposed CVA variant structure is functional but has **architectural inconsistencies** with the Button component pattern.

### Proposed Structure (from plan)

```typescript
variants: {
  style: {
    filled: '...',
    outline: '...',
  },
  size: {
    md: '...',
    sm: '...',
  },
  color: {
    brand: '...',
    gray: '...',
  },
}
```

### Critical Issues

#### Issue 1: Variant Naming Inconsistency

**Problem**: FAB uses `style` prop, Button uses `variant` prop

**Button Component** (`src/ui/buttons/button.tsx`, line 36):

```typescript
variants: {
  variant: {
    filled: '...',
    outline: '...',
    tinted: '...',
    plain: '...',
  },
  // ...
}
```

**FAB Plan** (line 253):

```typescript
variants: {
  style: {  // ← Different prop name
    filled: '...',
    outline: '...',
  },
  // ...
}
```

**Architectural Impact**:

- **API Inconsistency**: Users must remember `variant` for Button but `style` for FAB
- **Cognitive Load**: Increases mental model complexity
- **Future Maintenance**: Makes it harder to share utilities between button types

**Plan's Justification** (line 442):

> "Using `style` instead of `variant` to avoid confusion with the Button component's `variant` prop"

**Counter-argument**: This justification is flawed because:

1. The API surface matters more than internal naming
2. Button and FAB are both in `src/ui/buttons/` - they should share API conventions
3. `variant` is the standard CVA pattern throughout the codebase
4. Different components can have different variant values - the prop name should be consistent

**Recommendation**: Use `variant` prop name for consistency:

```typescript
// ✅ Correct approach
variants: {
  variant: {
    filled: '...',
    outline: '...',
  },
  // ...
}

// Usage:
<Fab variant="filled" size="md" color="brand" />
<Button variant="filled" size="md" color="primary" />
//       ^^^^^^^^ Same prop name across button family
```

#### Issue 2: Color Variant Scope Limitation

**Problem**: The plan couples `color` to `style` too tightly

**Plan's Design Decision** (lines 446-450):

> "Color-Style Relationship: Following Figma design where:
>
> - `brand` color only makes sense with `filled` style
> - `gray` color only makes sense with `outline` style"

**Architectural Concern**: This creates unnecessary constraints:

1. **Future Scalability**: What if design adds "outline + brand" or "filled + gray"?
2. **Design System Evolution**: Locking color to style prevents natural design evolution
3. **Compound Variants Can Handle This**: CVA's compound variants are designed exactly for this

**Better Approach**: Define variants independently, use compound variants for valid combinations:

```typescript
variants: {
  variant: {
    filled: 'shadow-lg',
    outline: 'border bg-transparent',
  },
  size: {
    md: 'size-14 p-4',  // 56px
    sm: 'size-12 p-3',  // 48px
  },
  color: {
    brand: '',
    gray: '',
  },
},
compoundVariants: [
  // Valid combinations
  {
    variant: 'filled',
    color: 'brand',
    className: 'bg-fill-primary text-white hover:bg-fill-primary-hover',
  },
  {
    variant: 'outline',
    color: 'gray',
    className: 'border-border text-text-subtle hover:border-border-hover',
  },
  // Could add more in future:
  // { variant: 'filled', color: 'gray', className: '...' },
  // { variant: 'outline', color: 'brand', className: '...' },
],
defaultVariants: {
  variant: 'filled',
  size: 'md',
  color: 'brand',
},
```

This approach:

- Maintains current design requirements
- Allows future expansion
- Follows Button's compound variant pattern
- Makes invalid combinations explicit (absence from compound variants)

#### Issue 3: Missing Circular Shape in Base Classes

**Critical Omission**: The plan mentions circular shape but doesn't show it in CVA base classes

**Required Base Classes**:

```typescript
const fabVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-full', // ← Critical for circular shape
    'aspect-square', // ← Ensures perfect circle
    'cursor-pointer',
    'font-medium',
    'transition-all duration-150', // 'all' for shadow transitions
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-52',
  ],
  {
    variants: {
      /* ... */
    },
  }
);
```

**Why `aspect-square` is critical**:

- Ensures width = height regardless of content
- Prevents oval shapes from padding variations
- Mirrors Button's `aspect-square` for icon-only buttons (line 302)

### Positive Aspects

1. **Compound Variants Planned**: The plan correctly identifies need for compound variants (line 257)
2. **State Handling**: Interactive states (hover, focus, active, disabled, loading) are comprehensively planned
3. **Default Variants**: Plan includes default variants (lines 261-263)
4. **Loading State Integration**: Loading state variant approach matches Button pattern

---

## 6. Potential Architectural Issues and Improvements

### Critical Issues

#### Issue 6.1: Potential Type Safety Gap

**Problem**: Icon-only buttons MUST have `aria-label`, but TypeScript might not enforce this

**Button's Approach** (lines 314-329):

```typescript
type IconOnlyButtonProps = {
  leftIcon: ComponentType<PhosphorIconProps>;
  rightIcon?: never;
  children?: never;
  'aria-label': string; // ← Required
};

type TextButtonProps = {
  leftIcon?: ComponentType<PhosphorIconProps>;
  rightIcon?: ComponentType<PhosphorIconProps>;
  children: ReactNode;
  'aria-label'?: string; // ← Optional
};

export type ButtonProps = BaseButtonProps &
  (IconOnlyButtonProps | TextButtonProps);
```

**Recommendation**: FAB should follow this exact pattern:

```typescript
type BaseFabProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'aria-label'
> &
  VariantProps<typeof fabVariants> & {
    loading?: boolean;
    className?: string;
  };

// FAB is ALWAYS icon-only, so no union needed - but keep pattern consistent
export type FabProps = BaseFabProps & {
  icon: ComponentType<PhosphorIconProps>;
  'aria-label': string; // ← Required at type level
  children?: never; // ← Explicitly prevent children
};
```

#### Issue 6.2: Missing Focus Ring Color Variants

**Problem**: Plan doesn't specify focus ring color based on color variant

**Button Pattern** (lines 138-149):

```typescript
compoundVariants: [
  // ...
  {
    color: 'primary',
    className: 'focus-visible:ring-primary',
  },
  {
    color: 'danger',
    className: 'focus-visible:ring-destructive',
  },
];
```

**Recommendation**: FAB should have:

```typescript
compoundVariants: [
  // ... style+color variants ...

  // Focus ring colors
  {
    color: 'brand',
    className: 'focus-visible:ring-primary',
  },
  {
    color: 'gray',
    className: 'focus-visible:ring-border',
  },
];
```

#### Issue 6.3: Shadow Removal on Active State

**Problem**: Plan states "Pressed state removes shadow for 'pressed in' effect" but doesn't show how

**Implementation Gap**: CVA doesn't have built-in active state variant

**Solutions**:

**Option 1: Pseudo-class in base classes**

```typescript
const fabVariants = cva(
  [
    'inline-flex items-center justify-center rounded-full',
    'active:shadow-none', // ← Removes shadow on :active
    // ...
  ],
  {
    variants: {
      variant: {
        filled: 'shadow-lg',
        outline: '',
      },
    },
  }
);
```

**Option 2: Compound variant for filled + pressed**

```typescript
compoundVariants: [
  {
    variant: 'filled',
    className: 'active:shadow-none',
  },
];
```

**Recommendation**: Use Option 1 (simpler, works for all filled variants).

### Recommendations

#### Recommendation 6.1: Explicit Icon Color Inheritance

**Issue**: Plan mentions "Icon inherits color from parent" (line 340) but doesn't show implementation

**Button Pattern** (line 201):

```typescript
<Icon icon={LeftIcon} size={iconSize} color={null} aria-hidden />
//                                     ^^^^^^^^^^^
//                                     Prevents Icon's default color,
//                                     allows inheritance via currentColor
```

**FAB Implementation**:

```typescript
<Icon
  icon={icon}
  size="lg"        // Always 24px
  color={null}     // ← Critical: allows currentColor inheritance
  aria-hidden      // FAB has aria-label on button, icon is decorative
/>
```

**Why this matters**:

- Icon component defaults to `color="default"` (text-text-primary)
- FAB needs icon color to match button text color (white for filled, gray for outline)
- `color={null}` removes Icon's color class, allowing CSS `currentColor` to work

#### Recommendation 6.2: Loading State Spinner Size

**Consistency Check**: Ensure loading spinner uses same size as icon

**Button Pattern** (lines 196-205):

```typescript
if (loading) {
  return (
    <Icon
      icon={CircleNotch}
      size={iconSize}  // ← Same size mapping as content icon
      color={null}
      className="animate-spin"
      aria-hidden
    />
  );
}
```

**FAB should use**:

```typescript
{loading ? (
  <Icon
    icon={CircleNotch}
    size="lg"              // 24px, same as content icon
    color={null}
    className="animate-spin"
    aria-hidden
  />
) : (
  <Icon
    icon={icon}
    size="lg"
    color={null}
    aria-hidden
  />
)}
```

#### Recommendation 6.3: Consider asChild for Polymorphism

**Observation**: Button supports `asChild` prop for polymorphic rendering (line 407)

**Question**: Should FAB support this?

**Analysis**:

- **Use Case**: Rendering FAB as a Link for navigation actions
  ```tsx
  <Fab asChild icon={Plus} aria-label="Create new">
    <Link href="/create">Create</Link>
  </Fab>
  ```
- **Design Intent**: FABs typically trigger actions (POST/PUT), not navigation (GET)
- **Recommendation**: **Omit `asChild` from initial implementation**
  - Keeps FAB simpler
  - Aligns with typical FAB usage patterns
  - Can be added later if use case emerges

**If added, follow Button's exact pattern**:

```typescript
const Comp = asChild ? Slot : 'button';
return <Comp {...props} />;
```

#### Recommendation 6.4: Test File Structure

**Plan's Test Requirements** (lines 319-362): ✅ Comprehensive

The test strategy is excellent. One addition:

**Add Test for Icon Size Consistency**:

```typescript
it('renders icon at 24px (lg size) for all FAB sizes', () => {
  const { rerender } = render(
    <Fab icon={Plus} size="md" aria-label="Add" />
  );

  // Icon should have size-6 class (24px) for MD FAB
  expect(screen.getByRole('button').querySelector('svg')).toHaveClass('size-6');

  rerender(<Fab icon={Plus} size="sm" aria-label="Add" />);

  // Icon should still have size-6 class (24px) for SM FAB
  expect(screen.getByRole('button').querySelector('svg')).toHaveClass('size-6');
});
```

This validates the design requirement of consistent 24px icons.

#### Recommendation 6.5: Storybook Positioning Example

**Plan Includes** (line 189): "PositioningExample Story - Real-world example showing FAB in fixed position"

**Enhancement**: Make this a template story users can copy:

```typescript
export const PositioningExample: Story = {
  args: {
    icon: Plus,
    'aria-label': 'Create new item',
  },
  decorators: [
    (Story) => (
      <div className="relative h-96 bg-background-secondary rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold">Page Content</h3>
          <p className="text-text-secondary">
            Scroll to see FAB in fixed position
          </p>
        </div>

        {/* FAB positioned bottom-right */}
        <div className="fixed bottom-6 right-6">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};
```

**Why**: Provides copy-paste template for common FAB usage pattern.

---

## Summary of Architectural Issues

### Critical Issues (Must Fix)

| Issue                                                   | Severity | Impact                                 | Recommendation                                   |
| ------------------------------------------------------- | -------- | -------------------------------------- | ------------------------------------------------ |
| Inconsistent variant prop naming (`style` vs `variant`) | High     | API inconsistency across button family | Use `variant` prop name to match Button          |
| Atomic design misclassification                         | Medium   | Conceptual clarity                     | Reclassify as Atom, not Molecule                 |
| Missing circular shape base classes                     | High     | Visual incorrectness                   | Add `rounded-full aspect-square` to base classes |
| Icon size mapping pattern deviation                     | Medium   | Architectural consistency              | Use Button's icon size mapping pattern           |

### Recommendations (Should Fix)

| Recommendation                                     | Priority | Benefit                   |
| -------------------------------------------------- | -------- | ------------------------- |
| Add focus ring color compound variants             | High     | Accessibility consistency |
| Implement shadow removal on active state           | High     | Design compliance         |
| Add explicit icon color inheritance (color={null}) | High     | Visual correctness        |
| Enforce aria-label at type level                   | Medium   | Type safety               |
| Decouple color from style variants                 | Medium   | Future scalability        |
| Add icon size consistency test                     | Low      | Regression prevention     |

---

## Positive Patterns Observed

1. **Comprehensive Planning**: The plan is exceptionally detailed with all required files, tests, and stories
2. **Design Token Mapping**: Perfect mapping from Figma to existing CSS custom properties
3. **Barrel Export Pattern**: Flawless adherence to project's export conventions
4. **Test Strategy**: Thorough test coverage including edge cases
5. **Accessibility Consideration**: Required aria-label and development warnings
6. **Loading State Pattern**: Correctly follows Button's loading state approach
7. **Documentation**: Excellent inline documentation and JSDoc comments planned
8. **Validation Commands**: Complete validation command checklist

---

## Recommended Plan Updates

### 1. Update Atomic Design Classification

**Current** (lines 31-48):

```markdown
## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: The FAB is a molecule because it combines multiple atoms:

1. The Icon component (atom) for rendering icons
2. A circular button container (atom-level styling)
3. Optional loading spinner (uses Icon component)
```

**Recommended**:

```markdown
## Atomic Design Classification

**Component Type**: Atom

**Reasoning**: The FAB is an atom-level component - a primitive interactive
element with a singular purpose (action trigger). Like the Button component,
FAB uses the Icon component internally as an implementation detail, not as
compositional architecture. The component serves as a foundational building
block that cannot be broken down further while maintaining its function.

**Composition Dependencies**:

- **Icon Component**: Used internally for icon rendering and loading spinner
  (implementation detail, not compositional relationship)
```

### 2. Update Variant Structure

**Add to Implementation Plan** (before line 252):

````markdown
### Critical: Variant Naming Consistency

**IMPORTANT**: Use `variant` prop name (not `style`) for consistency with Button:

```typescript
const fabVariants = cva(
  [
    // Base classes
    'inline-flex items-center justify-center',
    'aspect-square rounded-full', // Circular shape
    'cursor-pointer transition-all duration-150',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-52',
    'active:shadow-none', // Pressed state removes shadow
  ],
  {
    variants: {
      variant: {
        // ← NOT "style"
        filled: 'shadow-lg',
        outline: 'border bg-transparent',
      },
      size: {
        md: 'size-14 p-4', // 56px total (16px padding + 24px icon)
        sm: 'size-12 p-3', // 48px total (12px padding + 24px icon)
      },
      color: {
        brand: '',
        gray: '',
      },
    },
    compoundVariants: [
      // Filled + Brand
      {
        variant: 'filled',
        color: 'brand',
        className:
          'bg-fill-primary text-white hover:bg-fill-primary-hover active:bg-fill-primary-active',
      },
      // Outline + Gray
      {
        variant: 'outline',
        color: 'gray',
        className:
          'border-border text-text-subtle hover:border-border-hover hover:bg-background-secondary active:border-border-active active:bg-background-tertiary',
      },
      // Focus ring colors
      {
        color: 'brand',
        className: 'focus-visible:ring-primary',
      },
      {
        color: 'gray',
        className: 'focus-visible:ring-border',
      },
    ],
    defaultVariants: {
      variant: 'filled',
      size: 'md',
      color: 'brand',
    },
  }
);
```
````

````

### 3. Update Icon Rendering Implementation

**Add to Step 2** (after line 269):

```markdown
**Icon Rendering Implementation**:
- Use Icon component with `size="lg"` (24px) for all FAB sizes
- Pass `color={null}` to allow currentColor inheritance
- Loading spinner uses same size as content icon
- Both icon and spinner are `aria-hidden` (FAB's aria-label provides context)

```typescript
{loading ? (
  <Icon
    icon={CircleNotch}
    size="lg"
    color={null}
    className="animate-spin"
    aria-hidden
  />
) : (
  <Icon
    icon={icon}
    size="lg"
    color={null}
    aria-hidden
  />
)}
````

````

### 4. Update Props Interface

**Update Step 2** (lines 258-269):

```markdown
- Implement FabProps interface with:
  - `icon` (required): ComponentType<PhosphorIconProps>
  - `variant`: 'filled' | 'outline' (default: 'filled')  ← Changed from "style"
  - `size`: 'md' | 'sm' (default: 'md')
  - `color`: 'brand' | 'gray' (default: 'brand')
  - `loading`: boolean (default: false)
  - `disabled`: boolean
  - `aria-label`: string (required - enforced at type level)
  - `children`: never (explicitly prevent children)
  - Standard button props (onClick, onKeyDown, etc.)
````

### 5. Add Type Safety Section

**Add new section after "Step 2: Implement FAB Component"**:

````markdown
### Step 2.5: Type Safety

Implement type-safe props following Button's pattern:

```typescript
type BaseFabProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'aria-label'
> &
  VariantProps<typeof fabVariants> & {
    icon: ComponentType<PhosphorIconProps>;
    loading?: boolean;
    className?: string;
  };

export type FabProps = BaseFabProps & {
  'aria-label': string; // Required at type level
  children?: never; // Explicitly prevent children
};

export const Fab = forwardRef<HTMLButtonElement, FabProps>(
  (
    {
      icon,
      variant,
      size,
      color,
      loading,
      disabled,
      className,
      'aria-label': ariaLabel,
      onClick,
      ...props
    },
    ref
  ) => {
    // Implementation
  }
);

Fab.displayName = 'Fab';
```
````

```

---

## Final Verdict

### Overall Assessment

The FAB component plan is **architecturally sound with room for improvement**. The plan demonstrates:

**Strengths**:
- Excellent understanding of design system integration
- Comprehensive test and documentation strategy
- Correct barrel export patterns
- Strong accessibility considerations
- Thorough validation checklist

**Areas Requiring Correction**:
- Atomic design classification should be Atom, not Molecule
- Variant prop naming must use `variant` (not `style`) for consistency
- Base classes must include `rounded-full aspect-square`
- Icon size mapping should follow Button's pattern explicitly
- Focus ring colors need compound variants

**Recommendation**: **Approve with required changes**

The plan provides an excellent foundation. With the corrections outlined above, the FAB component will maintain architectural consistency with the existing button family while meeting all design requirements.

---

## Action Items for Implementation

1. **Update plan document**:
   - [ ] Change Atomic Design classification from Molecule to Atom
   - [ ] Change `style` prop to `variant` prop throughout
   - [ ] Add `rounded-full aspect-square` to base classes
   - [ ] Add icon size mapping pattern (use `lg` for all sizes)
   - [ ] Add focus ring color compound variants
   - [ ] Add `active:shadow-none` for pressed state

2. **During implementation**:
   - [ ] Use `forwardRef` with proper displayName
   - [ ] Enforce aria-label at type level with union types
   - [ ] Pass `color={null}` to Icon component
   - [ ] Add focus ring color test cases
   - [ ] Add icon size consistency test

3. **Before marking complete**:
   - [ ] Verify variant prop naming matches Button
   - [ ] Verify circular shape renders correctly
   - [ ] Verify icon color inheritance works
   - [ ] Verify all 6 validation commands pass

---

## Files Referenced

- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/ai/plans/ui/floating-action-button-2025-11-30.md`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/buttons/button.tsx`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/icons/icon.tsx`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/buttons/index.ts`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/app/globals.css`
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/.claude/skills/sazonia-ui-components/SKILL.md`

---

**Evaluation Complete**
```
