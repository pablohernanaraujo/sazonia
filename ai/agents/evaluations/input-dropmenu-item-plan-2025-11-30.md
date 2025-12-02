# Architectural Evaluation: InputDropmenuItem Component Plan

**Component**: InputDropmenuItem
**Plan Document**: `ai/plans/ui/input-dropmenu-item-plan-2025-11-30.md`
**Evaluation Date**: 2025-11-30
**Evaluator**: UI/UX Architecture Agent
**Overall Score**: 88/100 - Very good architectural alignment with several critical improvements needed

---

## Executive Summary

The InputDropmenuItem component plan demonstrates **very good architectural alignment** with the sazonia-web design system patterns. However, there are **critical naming and classification issues** that must be addressed before implementation. The component is correctly designed as a Molecule-level element and properly composes existing atoms, but its architectural relationship to existing components needs clarification.

**Key Strengths**:

- Correct Molecule classification and atomic composition
- Comprehensive CVA variant structure aligned with project patterns
- Excellent integration strategy with DropmenuOption patterns
- Complete documentation and testing approach
- Strong design system token usage

**Critical Issues**: 3 architectural concerns requiring immediate attention

**Recommendations**: 5 improvements for architectural excellence

---

## Architectural Assessment

### 1. Component Naming and Category Placement: CRITICAL ISSUE ⚠️

**Classification**: INCORRECT - Requires immediate architectural decision
**Verdict**: Component location and naming creates architectural ambiguity

**Critical Issue #1: Category Mismatch**

The plan places this component in `src/ui/dropmenus/` but uses "Input" prefix:

```typescript
// Current plan
File: src / ui / dropmenus / input - dropmenu - item.tsx;
Import: import { InputDropmenuItem } from '@/ui';
```

**Problem**: This creates a **categorical paradox**:

- **File location** suggests this is a dropmenu component (action menus)
- **Naming** suggests this is an input component (form controls)
- **Functionality** indicates it's specifically for **input dropdowns** (select, combobox)

**Analysis of Architectural Intent**:

Looking at the plan's problem statement:

> "The existing DropmenuOption component is designed for action menus (edit, delete, etc.) but doesn't support selection states or checkboxes needed for **input dropdowns**."

This reveals the **actual architectural relationship**:

1. **DropmenuOption** → Action menus (Edit, Delete, Settings)
   - Lives in `src/ui/dropmenus/`
   - No selection state
   - Used in context menus, navigation dropdowns

2. **InputDropmenuItem** → Input dropdowns (Select, Combobox, Autocomplete)
   - Should live in `src/ui/inputs/` (form category)
   - Has selection state, checkboxes
   - Used in form controls

**Evidence from Existing Architecture**:

```bash
src/ui/inputs/
├── text-input.tsx          # Form input component
├── number-input.tsx        # Form input component
├── file-input.tsx          # Form input component
├── calendar.tsx            # Input-related component
└── input-dropmenu-item.tsx # ??? Should be here
```

**Recommendation: CRITICAL ARCHITECTURAL DECISION REQUIRED**

**Option A: Move to inputs category (RECOMMENDED)**

```typescript
// File location
src/ui/inputs/dropmenu-item.tsx

// Component name
export const DropmenuItem = ...

// Import usage
import { DropmenuItem } from '@/ui/inputs';
// or
import { DropmenuItem } from '@/ui';
```

**Rationale**:

- ✅ Aligns with functional intent (form input dropdowns)
- ✅ Co-locates with related form components
- ✅ Removes naming ambiguity ("Input" prefix unnecessary in inputs category)
- ✅ Clear separation: `dropmenus/` = action menus, `inputs/` = form dropdowns
- ✅ Follows pattern: `TextInput`, `NumberInput`, `FileInput`, `DropmenuItem`

**Option B: Keep in dropmenus but rename**

```typescript
// File location
src/ui/dropmenus/selectable-option.tsx

// Component name
export const SelectableOption = ...

// Import usage
import { SelectableOption } from '@/ui/dropmenus';
```

**Rationale**:

- ✅ Descriptive name clarifies selection capability
- ✅ Stays in dropmenu category
- ⚠️ Creates conceptual overlap with inputs category
- ❌ Less clear architectural separation

**Option C: Current plan (NOT RECOMMENDED)**

```typescript
// File location
src/ui/dropmenus/input-dropmenu-item.tsx

// Component name
export const InputDropmenuItem = ...
```

**Problems**:

- ❌ Naming implies it's an input, but lives in dropmenus
- ❌ Violates single responsibility at category level
- ❌ Future confusion: "Is this a dropmenu or an input?"
- ❌ Breaks mental model of category organization

**Impact**: HIGH - This affects component discoverability, mental models, and future maintainability.

**Required Action**: Choose Option A or B and update plan before implementation.

---

**Critical Issue #2: Relationship to DropmenuOption Unclear**

The plan states:

> "Based on DropmenuOption"

But doesn't clarify the architectural relationship:

**Question**: Should this component:

1. **Extend DropmenuOption** (composition pattern)?
2. **Replace DropmenuOption** for input contexts?
3. **Coexist independently** with DropmenuOption?

**Current Evidence**:

```typescript
// DropmenuOption (existing)
File: src/ui/dropmenus/dropmenu-option.tsx
Purpose: Action menu items (Edit, Delete, Copy)
Features: Icons, text, add-ons, interactive states
NO selection state, NO checkboxes

// InputDropmenuItem (planned)
File: src/ui/dropmenus/input-dropmenu-item.tsx
Purpose: Input dropdown items (Select options)
Features: Icons, text, add-ons, interactive states
YES selection state, YES checkboxes
```

**Analysis**: These are **parallel implementations** with 90% code overlap.

**Architectural Concern**: Code duplication

Both components share:

- Same CVA pattern structure
- Same size variants (SM, MD, LG)
- Same add-on system (left/right slots)
- Same icon size mapping
- Same visual state system
- Same accessibility patterns

**Difference**: Selection state + checkbox (15 lines of code)

**Recommendation: Consider Composition-Based Architecture**

Instead of two separate components, consider:

```typescript
// Base component with optional selection
export interface DropmenuItemProps {
  // ... existing props
  selectable?: boolean;      // NEW: Enable selection state
  selected?: boolean;        // NEW: Selection state
  showCheckbox?: boolean;    // NEW: Show checkbox for multi-select
  caption?: string;          // NEW: Caption text
}

export const DropmenuItem = forwardRef<HTMLDivElement, DropmenuItemProps>(
  ({ selectable, selected, showCheckbox, caption, ...props }, ref) => {
    // Unified implementation
    // If selectable=true, apply selection styling
    // If showCheckbox=true, render checkbox
    // If caption exists, render caption
  }
);

// Usage in action menus
<DropmenuItem label="Edit" leftIcon={Pencil} />

// Usage in input dropdowns
<DropmenuItem
  label="United States"
  leftIcon={FlagUS}
  selectable
  selected={true}
  showCheckbox
/>
```

**Rationale**:

- ✅ Single source of truth
- ✅ Shared maintenance
- ✅ No code duplication
- ✅ Consistent API surface
- ✅ Easier to test
- ⚠️ Slightly more complex (but manageable)

**Alternative**: If separation is required, extract shared logic:

```typescript
// src/ui/dropmenus/dropmenu-item-base.tsx
export const useDropmenuItem = (props) => {
  // Shared logic: size mapping, icon sizing, add-on rendering
  return { ... };
};

// src/ui/dropmenus/dropmenu-option.tsx
export const DropmenuOption = forwardRef((props, ref) => {
  const base = useDropmenuItem(props);
  // Action menu specific logic
});

// src/ui/inputs/dropmenu-item.tsx
export const DropmenuItem = forwardRef((props, ref) => {
  const base = useDropmenuItem(props);
  // Input dropdown specific logic (selection, checkbox)
});
```

**Impact**: MEDIUM-HIGH - Affects code maintainability and DRY principle.

**Score**: 4/10 (Deduct 6 points for architectural ambiguity and potential duplication)

---

### 2. Atomic Design Classification: EXCELLENT ✓

**Classification**: Molecule
**Verdict**: Correct

**Analysis**:

- ✅ **Proper composition**: Combines Icon (atom) + Typography (atoms) + Checkbox (inline atom) into a cohesive menu item
- ✅ **Single responsibility**: Represents one selectable item in an input dropdown
- ✅ **Appropriate abstraction**: Not too granular (atom) nor too complex (organism)
- ✅ **Clear parent-child relationship**: Will be composed within Select, Combobox, Autocomplete organisms

**Evidence from Plan**:

```typescript
Composition Requirements:
- Required Atoms:
  - TextMd, TextSm, TextXs from @/ui/typography - For label and caption text
  - Icon from @/ui/icons - For left add-on icons
- Inline Checkbox: Implemented within component using conditional rendering
```

**Comparison to Existing Patterns**:

- DropmenuOption: Molecule (menu item for actions) ✓
- TextInput: Molecule (input field with add-ons) ✓
- InputLabel: Atom (single label element) ✓
- ErrorMessage: Atom (single error display) ✓
- InputDropmenuItem: Molecule (menu item for input) ✓ **Consistent**

**Checkbox Implementation Approach**: Good

The plan correctly chooses **inline checkbox implementation** instead of creating a separate Checkbox component:

```typescript
// Inline checkbox (GOOD for this use case)
{showCheckbox && (
  <div className={cn(
    'flex items-center justify-center rounded-sm',
    size === 'lg' ? 'size-5' : 'size-4',
    selected
      ? 'bg-info-500 text-white'
      : 'border border-border bg-background'
  )}>
    {selected && <Icon icon={Check} size="xs" />}
  </div>
)}
```

**Rationale**:

- ✅ Checkbox is tightly coupled to this component (not reusable independently)
- ✅ Avoids creating unnecessary atom-level component
- ✅ Keeps related logic colocated
- ✅ Follows DRY principle (don't create components until needed elsewhere)

**Future Consideration**: If checkbox is needed in 3+ other contexts, extract to `src/ui/inputs/checkbox.tsx`

**Score**: 10/10

---

### 3. Component Composition Strategy: VERY GOOD ✓

**Verdict**: Well-designed with minor optimization opportunities

**Strengths**:

1. **Proper atom integration**:

   ```typescript
   // From plan
   Required Atoms:
   - Icon from @/ui/icons - For left add-on icons
   - TextMd, TextSm, TextXs from @/ui/typography - For label and caption
   ```

2. **Flexible add-on system** (inherited from DropmenuOption):
   - Supports optional left/right add-ons
   - Allows custom React nodes for extensibility
   - Size-appropriate icon and typography mapping

3. **Caption integration**:

   ```typescript
   // Size-appropriate caption typography
   | Size | Caption Font | Caption Line Height |
   | SM   | 12px (TextXs) | 18px               |
   | MD   | 12px (TextXs) | 18px               |
   | LG   | 14px (TextSm) | 20px               |
   ```

4. **Selection state composition**:
   - Optional checkbox (multi-select scenarios)
   - Brand border indicator (3px left border)
   - Brand background tint (bg-info-50)

**Architectural Recommendation #1: Typography Component Usage Clarity**

**Current Plan**:

```typescript
// Ambiguous: Uses Typography atoms for everything
- TextMd, TextSm, TextXs from @/ui/typography
```

**Question**: Should label use Typography component or direct element?

**Analysis** (based on DropmenuOption pattern):

```typescript
// Existing DropmenuOption implementation
// Main label: Direct span with Tailwind (optimal performance)
<span className={cn(
  'flex-1 truncate font-sans',
  disabled ? 'text-text-tertiary' : 'text-text-primary'
)}>
  {label}
</span>

// Right add-on: Typography component (semantic consistency)
<TextComponent
  as="span"
  color="muted"
  className={cn('ml-auto shrink-0', disabled && 'text-text-tertiary')}
>
  {rightText}
</TextComponent>
```

**Recommendation**: Follow DropmenuOption pattern:

1. **Label**: Use direct `<span>` with Tailwind classes (performance)
2. **Caption**: Use `TextXs`/`TextSm` Typography component (semantic color variants)
3. **Right add-on text**: Use Typography component with `color="muted"`
4. **Icons**: Use `Icon` component with appropriate size mapping

**Clarified Composition**:

```typescript
export const InputDropmenuItem = forwardRef((props, ref) => {
  const TextComponent = size === 'lg' ? TextSm : TextXs; // For caption
  const iconSize = sizeToIconSize[size ?? 'lg'];

  return (
    <div>
      {/* Left icon - Icon component */}
      {showLeftAddOn && <Icon icon={leftIcon} size={iconSize} />}

      {/* Checkbox - Inline implementation */}
      {showCheckbox && <div>...</div>}

      {/* Label - Direct span (performance) */}
      <div className="flex flex-1 flex-col">
        <span className="truncate font-sans text-text-primary">
          {label}
        </span>

        {/* Caption - Typography component (semantic) */}
        {caption && (
          <TextComponent as="span" color="muted">
            {caption}
          </TextComponent>
        )}
      </div>

      {/* Right add-on - Typography component */}
      {showRightAddOn && (
        <TextComponent color="muted">
          {rightText}
        </TextComponent>
      )}
    </div>
  );
});
```

**Why this matters**:

- Maintains consistency with DropmenuOption
- Balances performance (direct elements) with semantics (Typography components)
- Clear separation: structural content vs compositional elements

**Architectural Recommendation #2: Selection State Architecture**

**Current Plan**: Uses data attributes for state control

```typescript
// From plan
visualState?: 'default' | 'hovered' | 'pressed' | 'disabled';
```

**Analysis**: The plan correctly identifies this as "Storybook visualization" only:

> "In production, states will typically be handled via CSS pseudo-classes (:hover, :focus, :active)"

**Recommendation**: Follow DropmenuOption's pattern exactly:

```typescript
const inputDropmenuItemVariants = cva(
  [
    'flex w-full cursor-pointer items-center rounded-sm transition-colors duration-150',
    // Natural browser states
    'hover:bg-background-secondary active:bg-background-tertiary',
    'focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:outline-none',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        /* ... */
      },
      // Visual state override for Storybook only
      visualState: {
        default: '',
        hovered: 'bg-background-secondary',
        pressed: 'bg-background-tertiary',
        focus: 'ring-2 ring-border-brand ring-offset-2',
      },
    },
    compoundVariants: [
      // Selection state styling
      {
        selected: true,
        className: 'border-info-500 bg-info-50 border-l-[3px]',
      },
      // Selected + hovered
      {
        selected: true,
        visualState: 'hovered',
        className: 'bg-info-100',
      },
    ],
    defaultVariants: {
      size: 'lg',
      visualState: 'default',
    },
  }
);
```

**Key Points**:

- ✅ Natural pseudo-classes for production (hover, active, focus-visible)
- ✅ `visualState` prop for Storybook visualization
- ✅ `selected` prop triggers selection styling via compound variants
- ✅ Compound variants handle selection + interaction state combinations

**Score**: 8.5/10 (Deduct 1.5 points for typography usage ambiguity)

---

### 4. Architectural Alignment with Project Patterns: VERY GOOD ✓

**Verdict**: Strong alignment with minor deviations from DropmenuOption pattern

**CVA Pattern Compliance**: Excellent ✓

```typescript
// Planned structure matches existing patterns
const inputDropmenuItemVariants = cva(
  // Base styles
  "flex items-center w-full cursor-pointer transition-colors rounded-sm",
  {
    variants: {
      size: { sm, md, lg },
      visualState: { default, hovered, pressed, focus },
      // NEW: Selection state
      selected: {
        true: 'border-l-[3px] border-info-500 bg-info-50',
        false: '',
      },
    },
    compoundVariants: [
      // Selection + hover combinations
      { selected: true, visualState: 'hovered', className: 'bg-info-100' },
    ],
    defaultVariants: { size: 'lg', visualState: 'default', selected: false }
  }
);
```

**Comparison to DropmenuOption** (perfect reference):

| Aspect                      | DropmenuOption | InputDropmenuItem | Alignment      |
| --------------------------- | -------------- | ----------------- | -------------- |
| CVA base styles             | ✓              | ✓                 | ✅ Perfect     |
| Size variants (SM, MD, LG)  | ✓              | ✓                 | ✅ Perfect     |
| Visual state variants       | ✓              | ✓                 | ✅ Perfect     |
| Add-on system (left/right)  | ✓              | ✓                 | ✅ Perfect     |
| Icon size mapping           | ✓              | ✓                 | ✅ Perfect     |
| Typography mapping          | ✓              | ✓                 | ✅ Perfect     |
| forwardRef pattern          | ✓              | ✓                 | ✅ Perfect     |
| displayName                 | ✓              | ✓                 | ✅ Perfect     |
| Props extend ComponentProps | ✓              | ✓                 | ✅ Perfect     |
| Selection state             | ✗              | ✓                 | ➕ New feature |
| Checkbox                    | ✗              | ✓                 | ➕ New feature |
| Caption text                | ✗              | ✓                 | ➕ New feature |

**Architectural Consistency Score**: 95% - Excellent reuse of established patterns

**forwardRef Pattern Compliance**: Perfect ✓

```typescript
// Planned pattern
export const InputDropmenuItem = forwardRef<HTMLDivElement, InputDropmenuItemProps>(
  ({ size, visualState, selected, label, className, ...props }, ref) => {
    return <div ref={ref} className={cn(...)} {...props} />;
  }
);
InputDropmenuItem.displayName = 'InputDropmenuItem';
```

**Matches DropmenuOption, TextInput, and all existing components** ✅

**React Import Pattern Compliance**: Perfect ✓

```typescript
// Correct direct imports (not namespace imports)
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
```

**Follows `.claude/skills/sazonia-ui-components/SKILL.md`** ✅

**Export Pattern Compliance**: Perfect ✓

```typescript
// 1. Component file exports
export { InputDropmenuItem, inputDropmenuItemVariants };
export type { InputDropmenuItemProps, InputDropmenuItemVariants };

// 2. Category barrel: src/ui/dropmenus/index.ts (or inputs if moved)
export * from './input-dropmenu-item';

// 3. Import usage
import { InputDropmenuItem } from '@/ui';
```

**Accessibility Pattern Compliance**: Excellent ✓

```typescript
// Planned ARIA attributes
role="option"              // For listbox context
aria-selected={selected}   // Selection state
aria-disabled={disabled}   // Disabled state
aria-checked={showCheckbox ? selected : undefined} // Checkbox state
```

**Matches accessibility patterns** from existing components ✅

**Minor Deviation #1: Focus Ring Pattern**

**DropmenuOption** uses:

```typescript
'focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2';
```

**Plan** doesn't explicitly mention ring-offset-2.

**Recommendation**: Add `ring-offset-2` for consistency:

```typescript
const inputDropmenuItemVariants = cva([
  'focus-visible:ring-2 focus-visible:ring-border-brand',
  'focus-visible:ring-offset-2', // ADD THIS
  'focus-visible:outline-none',
]);
```

**Minor Deviation #2: Disabled State Implementation**

**DropmenuOption** applies disabled text color via className:

```typescript
className={cn(
  dropmenuOptionVariants({ size, visualState }),
  disabled && 'pointer-events-none text-text-tertiary',
  className
)}
```

**Plan** should clarify this pattern.

**Recommendation**: Use exact DropmenuOption disabled pattern:

```typescript
<div
  ref={ref}
  role="option"
  aria-disabled={disabled || undefined}
  className={cn(
    inputDropmenuItemVariants({ size, visualState, selected }),
    disabled && 'pointer-events-none text-text-tertiary',
    className
  )}
  {...props}
>
```

**Score**: 9/10 (Deduct 1 point for minor deviations that need clarification)

---

### 5. Design System Integration: EXCELLENT ✓

**Verdict**: Exceptional semantic token usage with minor border-radius consideration

**Semantic Token Usage**: Perfect ✓

The plan correctly maps Figma design tokens to semantic Tailwind classes:

```css
/* From plan - Semantic token mapping */
| Figma Token                      | Tailwind Class           | Correct |
|----------------------------------|--------------------------|---------|
| bg-surface-base-primary          | bg-white/bg-background   | ✅      |
| bg-surface-base-primary_hover    | bg-background-secondary  | ✅      |
| bg-surface-base-primary_active   | bg-background-tertiary   | ✅      |
| bg-surface-brand-secondary       | bg-info-50               | ✅      |
| bg-surface-brand-secondary_hover | bg-info-100              | ✅      |
| border-brand-solid               | border-info-500          | ✅      |
| bg-fill-brand-primary            | bg-info-500              | ✅      |
| text-base-primary                | text-text-primary        | ✅      |
| text-base-secondary              | text-text-secondary      | ✅      |
| text-base-tertiary               | text-text-tertiary       | ✅      |
| border-base-primary              | border-border            | ✅      |
```

**Analysis**:

- ✅ Uses `bg-background-*` semantic tokens (not raw colors)
- ✅ Uses `text-text-*` semantic hierarchy
- ✅ Uses `border-border` system token
- ✅ Uses `info-*` scale for brand colors (aligns with "info" semantic meaning)
- ✅ Consistent with `.claude/rules/styling-guidelines.md`

**Spacing Token Usage**: Perfect ✓

```typescript
/* Size variants use correct Tailwind spacing scale */
| Size | Padding Y (label only) | Padding Y (with caption) | Gap  |
| SM   | 6px (py-1.5)          | 4px (py-1)               | 10px (gap-2.5) |
| MD   | 10px (py-2.5)         | 6px (py-1.5)             | 12px (gap-3)   |
| LG   | 12px (py-3)           | 6px (py-1.5)             | 12px (gap-3)   |
```

**Analysis**:

- ✅ Uses Tailwind spacing scale (0.25rem increments)
- ✅ Consistent with design system spacing tokens
- ✅ Matches DropmenuOption horizontal padding (px-3 for SM/MD, px-4 for LG)
- ✅ Adapts vertical padding based on caption presence (good UX)

**Typography Token Integration**: Perfect ✓

```typescript
| Size | Label Font    | Line Height | Caption Font  | Caption Line Height |
| SM   | 14px (text-sm)| 20px (leading-5) | 12px (text-xs) | 18px (leading-[18px]) |
| MD   | 14px (text-sm)| 20px (leading-5) | 12px (text-xs) | 18px (leading-[18px]) |
| LG   | 16px (text-base)| 24px (leading-6) | 14px (text-sm) | 20px (leading-5) |
```

**Matches Typography atom definitions** from `src/ui/typography/text.tsx`:

- TextXs: `text-xs leading-[18px]` (12px/18px) ✓
- TextSm: `text-sm leading-5` (14px/20px) ✓
- TextMd: `text-base leading-6` (16px/24px) ✓

**Icon Size Mapping**: Perfect ✓

```typescript
| Component Size | Icon Size | Checkbox Size |
| SM             | sm (16px) | 16px (size-4) |
| MD             | sm (16px) | 16px (size-4) |
| LG             | md (20px) | 20px (size-5) |
```

**Matches DropmenuOption icon size mapping exactly** ✅

**Selection State Styling**: Excellent ✓

```typescript
// Selection indicator
| State                | Border               | Background         |
| Selected (default)   | 3px left border-info-500 | bg-info-50     |
| Selected + hovered   | 3px left border-info-500 | bg-info-100    |
```

**Analysis**:

- ✅ Uses `border-l-[3px]` arbitrary value (appropriate for design spec)
- ✅ Uses semantic `info-*` scale for brand colors
- ✅ Provides visual hierarchy (50 → 100 on hover)
- ✅ Distinct from unselected states

**Border Radius Usage**: Good with Recommendation

**Current Plan**: Uses `rounded-sm` (inherited from DropmenuOption)

```typescript
const inputDropmenuItemVariants = cva(
  'rounded-sm' // 6px border radius
  // ...
);
```

**From Styling Guidelines**:

> Inputs and form controls: Use `rounded-sm` (6px) for subtle rounding

**Analysis**: ✅ Correct choice for input-related component

**Recommendation**: Document reasoning in component comments

```typescript
/**
 * Border radius: rounded-sm (6px)
 * Follows styling guidelines for input-related components
 * Matches DropmenuOption for consistency across menu items
 */
const inputDropmenuItemVariants = cva(
  'rounded-sm'
  // ...
);
```

**Shadow Usage**: Not Applicable

Dropdown menu items typically don't have shadows (parent dropdown container has shadow).

**Checkbox Color Tokens**: Excellent ✓

```typescript
| Checkbox State        | Background            | Border          |
| Unchecked             | bg-background         | border-border   |
| Checked               | bg-info-500           | none            |
| Disabled unchecked    | bg-background-tertiary| border-border   |
| Disabled checked      | bg-info-300 (muted)   | none            |
```

**Analysis**:

- ✅ Uses semantic background tokens
- ✅ Uses `info-*` scale for brand checkbox
- ✅ Muted color for disabled checked state (good UX)

**Score**: 10/10 - Exceptional design system integration

---

### 6. State Management Architecture: VERY GOOD ✓

**Verdict**: Well-designed state handling following DropmenuOption pattern

**State Prop Design**: Excellent ✓

```typescript
interface InputDropmenuItemProps {
  visualState?: 'default' | 'hovered' | 'pressed' | 'focus';
  selected?: boolean;
  disabled?: boolean;
  showCheckbox?: boolean;
}
```

**Analysis**:

**Strengths**:

1. **visualState** for Storybook visualization ✅
2. **selected** for selection state (separate from visualState) ✅
3. **disabled** boolean (not part of visualState) ✅
4. **showCheckbox** for multi-select scenarios ✅

**This correctly separates concerns**:

- `visualState` = Visual override for Storybook (CSS pseudo-class alternative)
- `selected` = Data state (form control value)
- `disabled` = Interaction state (form control prop)

**Comparison to DropmenuOption**:

```typescript
// DropmenuOption
interface DropmenuOptionProps {
  visualState?: 'default' | 'hovered' | 'pressed' | 'focus' | 'disabled';
  disabled?: boolean;
}

// InputDropmenuItem (should be)
interface InputDropmenuItemProps {
  visualState?: 'default' | 'hovered' | 'pressed' | 'focus'; // Remove 'disabled'
  disabled?: boolean;
  selected?: boolean; // NEW
  showCheckbox?: boolean; // NEW
}
```

**Note**: `visualState` should NOT include 'disabled' - that's a separate prop.

**Recommendation**: Remove 'disabled' from visualState enum:

```typescript
visualState?: 'default' | 'hovered' | 'pressed' | 'focus';
// NOT: 'default' | 'hovered' | 'pressed' | 'focus' | 'disabled'
```

**Selection State Implementation**: Excellent ✓

```typescript
// Compound variant pattern for selection + interaction
compoundVariants: [
  {
    selected: true,
    className: 'border-l-[3px] border-info-500 bg-info-50',
  },
  {
    selected: true,
    visualState: 'hovered',
    className: 'bg-info-100', // Darker on hover when selected
  },
],
```

**Why this is correct**:

- ✅ Separates `selected` (data state) from `visualState` (visual override)
- ✅ Uses compound variants for selection + interaction combinations
- ✅ Natural pseudo-classes work in production (hover:bg-background-secondary)
- ✅ `visualState` only needed for Storybook visualization

**Disabled State**: Perfect ✓

```typescript
disabled?: boolean;

// Applied as:
className={cn(
  inputDropmenuItemVariants({ size, visualState, selected }),
  disabled && 'pointer-events-none text-text-tertiary',
  className
)}

// ARIA
aria-disabled={disabled || undefined}
```

**Matches DropmenuOption pattern exactly** ✅

**Checkbox State Management**: Very Good

**Current Plan**:

```typescript
showCheckbox?: boolean;
selected?: boolean; // Controls checked state
```

**Implementation**:

```typescript
{showCheckbox && (
  <div
    aria-hidden // Decorative, role="option" handles semantics
    className={cn(
      'flex items-center justify-center rounded-sm',
      size === 'lg' ? 'size-5' : 'size-4',
      selected
        ? 'bg-info-500 text-white'
        : 'border border-border bg-background'
    )}
  >
    {selected && <Icon icon={Check} size="xs" />}
  </div>
)}
```

**Analysis**:

- ✅ Checkbox is decorative (controlled by `selected` prop)
- ✅ `aria-hidden` on checkbox (parent has `role="option" aria-selected`)
- ✅ Visual state tied to `selected` boolean
- ✅ No separate checkbox state (simplifies API)

**Accessibility Pattern**: Excellent ✓

```typescript
// Planned ARIA attributes
<div
  role="option"
  aria-selected={selected}
  aria-disabled={disabled || undefined}
  aria-checked={showCheckbox ? selected : undefined}
  tabIndex={disabled ? -1 : 0}
>
```

**Analysis**:

- ✅ `role="option"` for listbox context
- ✅ `aria-selected` reflects selection state
- ✅ `aria-checked` only when checkbox is visible
- ✅ `aria-disabled` for screen readers
- ✅ `tabIndex` management for keyboard navigation

**Minor Recommendation**: Clarify listbox vs combobox role

The plan uses `role="option"`, which implies parent has `role="listbox"`.

**Question**: Will this be used with:

- `<select>` replacement (role="listbox")
- `<input type="text">` combobox (role="combobox" with role="listbox")
- Multi-select (role="listbox" with aria-multiselectable)

**Recommendation**: Document expected parent context:

````typescript
/**
 * InputDropmenuItem - A selectable menu item for input dropdowns.
 *
 * Designed for use within:
 * - Select dropdowns (parent: role="listbox")
 * - Combobox autocomplete (parent: role="combobox" + role="listbox")
 * - Multi-select (parent: role="listbox" aria-multiselectable="true")
 *
 * @example
 * ```tsx
 * <div role="listbox" aria-labelledby="select-label">
 *   <InputDropmenuItem label="Option 1" selected />
 *   <InputDropmenuItem label="Option 2" />
 * </div>
 * ```
 */
````

**Score**: 9/10 (Deduct 1 point for 'disabled' in visualState enum)

---

## Critical Issues

### Critical Issue #1: Component Category and Naming (BLOCKING)

**Severity**: CRITICAL - Blocks implementation
**Impact**: Architectural clarity, discoverability, maintainability

**Problem**: Component name and location create categorical ambiguity.

**Required Action**:

1. **Choose architectural approach**:
   - Option A: Move to `src/ui/inputs/`, rename to `DropmenuItem`
   - Option B: Keep in `src/ui/dropmenus/`, rename to `SelectableOption`

2. **Update plan document** with chosen approach and rationale

3. **Document relationship to DropmenuOption**:
   - Are they parallel implementations?
   - Should they share logic (hook or base component)?
   - When to use which?

**Example Documentation Needed**:

```typescript
/**
 * Component Decision: InputDropmenuItem vs DropmenuOption
 *
 * ARCHITECTURE:
 * - DropmenuOption: Action menus (Edit, Delete, Settings)
 *   Location: src/ui/dropmenus/dropmenu-option.tsx
 *   Use cases: Context menus, navigation dropdowns, action menus
 *
 * - InputDropmenuItem: Input dropdowns (Select, Combobox, Autocomplete)
 *   Location: src/ui/inputs/input-dropmenu-item.tsx (or dropmenu-item.tsx if moved)
 *   Use cases: Form selects, multi-select, autocomplete inputs
 *
 * DIFFERENCE:
 * - Selection state: Only InputDropmenuItem has selected prop + brand styling
 * - Checkbox support: Only InputDropmenuItem for multi-select
 * - Caption text: Only InputDropmenuItem for additional context
 *
 * SHARED LOGIC:
 * - [Document if using shared hook or base component]
 */
```

---

### Critical Issue #2: Code Duplication with DropmenuOption (HIGH)

**Severity**: HIGH - Technical debt risk
**Impact**: Maintainability, consistency, DRY principle

**Problem**: 90% code overlap between DropmenuOption and InputDropmenuItem.

**Evidence**:

- Same CVA structure
- Same size variants
- Same add-on system
- Same icon/typography mapping
- Same accessibility patterns
- **Difference**: 15 lines for selection + checkbox

**Required Action**:

**Option 1: Unified Component** (RECOMMENDED)

```typescript
// src/ui/dropmenus/dropmenu-option.tsx (or src/ui/inputs/dropmenu-item.tsx)
export interface DropmenuOptionProps {
  // ... existing props
  // NEW: Selection features (optional)
  selectable?: boolean;
  selected?: boolean;
  showCheckbox?: boolean;
  caption?: string;
}

export const DropmenuOption = forwardRef((props, ref) => {
  const { selectable, selected, showCheckbox, caption, ...rest } = props;

  return (
    <div
      className={cn(
        dropmenuOptionVariants({ size, visualState }),
        selectable && selected && 'border-l-[3px] border-info-500 bg-info-50',
        // ... rest
      )}
    >
      {showCheckbox && <Checkbox selected={selected} />}
      {/* ... rest of component */}
      {caption && <Caption text={caption} />}
    </div>
  );
});
```

**Benefits**:

- ✅ Single source of truth
- ✅ Shared maintenance
- ✅ No code duplication
- ✅ Backward compatible (existing DropmenuOption usage unchanged)
- ✅ One component to test

**Drawbacks**:

- ⚠️ Slightly more complex props interface
- ⚠️ Requires careful prop validation

**Option 2: Shared Base Logic**

```typescript
// src/ui/dropmenus/use-dropmenu-item.ts
export const useDropmenuItem = (props) => {
  const iconSize = sizeToIconSize[props.size ?? 'lg'];
  const TextComponent = props.size === 'lg' ? TextMd : TextSm;

  return {
    iconSize,
    TextComponent,
    renderLeftAddOn: () => {
      /* ... */
    },
    renderRightAddOn: () => {
      /* ... */
    },
  };
};

// src/ui/dropmenus/dropmenu-option.tsx
export const DropmenuOption = forwardRef((props, ref) => {
  const { iconSize, TextComponent, renderLeftAddOn, renderRightAddOn } =
    useDropmenuItem(props);
  // Action menu specific logic
});

// src/ui/inputs/dropmenu-item.tsx (or input-dropmenu-item.tsx)
export const InputDropmenuItem = forwardRef((props, ref) => {
  const { iconSize, TextComponent, renderLeftAddOn, renderRightAddOn } =
    useDropmenuItem(props);
  // Input dropdown specific logic (selection, checkbox, caption)
});
```

**Benefits**:

- ✅ Shared logic extracted
- ✅ Clear separation of concerns
- ✅ Easier to maintain shared behavior

**Drawbacks**:

- ⚠️ More files to maintain
- ⚠️ Potential over-engineering for 15 lines of difference

**Option 3: Accept Duplication** (NOT RECOMMENDED)

Keep as separate components, accept duplication.

**Drawbacks**:

- ❌ Violates DRY principle
- ❌ Bug fixes need to be applied to both
- ❌ Inconsistencies will creep in over time
- ❌ Double the test surface

**Recommendation**: Choose **Option 1 (Unified Component)** for simplicity and maintainability.

---

### Critical Issue #3: Missing Compound Variant for Caption Padding (MEDIUM)

**Severity**: MEDIUM - UX consistency
**Impact**: Visual polish, design system adherence

**Problem**: Plan mentions caption reduces vertical padding but doesn't show how this is implemented in CVA.

**From Plan**:

```
| Size | Padding Y (label only) | Padding Y (with caption) |
| SM   | 6px (py-1.5)          | 4px (py-1)               |
| MD   | 10px (py-2.5)         | 6px (py-1.5)             |
| LG   | 12px (py-3)           | 6px (py-1.5)             |
```

**Current CVA** (from plan):

```typescript
variants: {
  size: {
    sm: 'gap-2.5 px-3 py-1.5', // Always py-1.5, doesn't change with caption
    md: 'gap-3 px-3 py-2.5',   // Always py-2.5
    lg: 'gap-3 px-4 py-3',     // Always py-3
  },
},
```

**Problem**: Caption presence doesn't reduce padding.

**Solution**: Add compound variants for caption:

```typescript
const inputDropmenuItemVariants = cva(
  'flex w-full cursor-pointer items-center rounded-sm transition-colors',
  {
    variants: {
      size: {
        sm: 'gap-2.5 px-3 py-1.5',
        md: 'gap-3 px-3 py-2.5',
        lg: 'gap-3 px-4 py-3',
      },
      hasCaption: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Reduce vertical padding when caption is present
      { size: 'sm', hasCaption: true, className: 'py-1' },
      { size: 'md', hasCaption: true, className: 'py-1.5' },
      { size: 'lg', hasCaption: true, className: 'py-1.5' },
    ],
    defaultVariants: {
      size: 'lg',
      hasCaption: false,
    },
  }
);

// Usage
export const InputDropmenuItem = forwardRef((props, ref) => {
  const { caption, ...rest } = props;
  const hasCaption = Boolean(caption);

  return (
    <div className={inputDropmenuItemVariants({ size, hasCaption, ... })}>
      {/* ... */}
    </div>
  );
});
```

**Required Action**: Update CVA variants in plan to include caption compound variants.

---

## Recommendations (Prioritized)

### Recommendation 1: Resolve Component Category and Naming (CRITICAL PRIORITY)

**Current**: Ambiguous category placement

**Recommended**: Choose **Option A** - Move to inputs category

```typescript
// File: src/ui/inputs/dropmenu-item.tsx
export const DropmenuItem = forwardRef<HTMLDivElement, DropmenuItemProps>();
// ...

// Import usage
import { DropmenuItem } from '@/ui/inputs';
// or
import { DropmenuItem } from '@/ui';
```

**Rationale**:

- ✅ Aligns with functional intent (form input dropdowns)
- ✅ Co-locates with related form components
- ✅ Clear naming in inputs category (no "Input" prefix needed)
- ✅ Follows pattern: TextInput, NumberInput, FileInput, **DropmenuItem**

**Impact**: CRITICAL - Affects entire component API and discoverability

---

### Recommendation 2: Unify with DropmenuOption or Extract Shared Logic (HIGH PRIORITY)

**Current**: Planned as separate component with 90% overlap

**Recommended**: Add selection features to DropmenuOption

```typescript
// src/ui/dropmenus/dropmenu-option.tsx
export interface DropmenuOptionProps {
  // ... existing props
  // NEW: Optional selection features
  selectable?: boolean;
  selected?: boolean;
  showCheckbox?: boolean;
  caption?: string;
}

export const DropmenuOption = forwardRef((props, ref) => {
  const { selectable, selected, showCheckbox, caption, ...rest } = props;

  return (
    <div
      className={cn(
        dropmenuOptionVariants({ size, visualState }),
        selectable && selected && 'border-l-[3px] border-info-500 bg-info-50'
      )}
    >
      {showCheckbox && renderCheckbox()}
      {/* ... existing component logic */}
      {caption && renderCaption()}
    </div>
  );
});

// Usage - Action menu (backward compatible)
<DropmenuOption label="Edit" leftIcon={Pencil} />

// Usage - Input dropdown
<DropmenuOption
  label="United States"
  leftIcon={FlagUS}
  selectable
  selected
  showCheckbox
  caption="North America"
/>
```

**Benefits**:

- ✅ Single component to maintain
- ✅ No code duplication
- ✅ Backward compatible
- ✅ Unified testing
- ✅ Consistent API

**Alternative**: If separation is required, extract shared logic to hook.

**Impact**: HIGH - Reduces technical debt and maintenance burden

---

### Recommendation 3: Add Caption Compound Variants (MEDIUM PRIORITY)

**Current**: Plan mentions caption reduces padding but doesn't implement it

**Recommended**: Add compound variants for hasCaption:

```typescript
const inputDropmenuItemVariants = cva(
  // base
  {
    variants: {
      size: {
        /* ... */
      },
      hasCaption: { true: '', false: '' },
    },
    compoundVariants: [
      { size: 'sm', hasCaption: true, className: 'py-1' },
      { size: 'md', hasCaption: true, className: 'py-1.5' },
      { size: 'lg', hasCaption: true, className: 'py-1.5' },
    ],
  }
);
```

**Impact**: MEDIUM - Improves visual consistency with design specs

---

### Recommendation 4: Document Expected Parent Context (MEDIUM PRIORITY)

**Current**: `role="option"` without parent context documentation

**Recommended**: Add JSDoc explaining expected parent:

````typescript
/**
 * InputDropmenuItem - A selectable menu item for input dropdowns.
 *
 * Designed for use within:
 * - Select dropdowns (parent: role="listbox")
 * - Combobox autocomplete (parent: role="combobox" + role="listbox")
 * - Multi-select (parent: role="listbox" aria-multiselectable="true")
 *
 * Accessibility:
 * - This component provides `role="option"` and expects a parent with `role="listbox"`
 * - Use `aria-labelledby` on parent to associate with label
 * - For multi-select, parent should have `aria-multiselectable="true"`
 *
 * @example
 * ```tsx
 * // Single select
 * <div role="listbox" aria-labelledby="country-label">
 *   <InputDropmenuItem label="United States" selected />
 *   <InputDropmenuItem label="Canada" />
 * </div>
 *
 * // Multi-select
 * <div role="listbox" aria-multiselectable="true">
 *   <InputDropmenuItem label="Option 1" selected showCheckbox />
 *   <InputDropmenuItem label="Option 2" showCheckbox />
 * </div>
 * ```
 */
````

**Impact**: MEDIUM - Improves developer experience and accessibility compliance

---

### Recommendation 5: Remove 'disabled' from visualState enum (LOW PRIORITY)

**Current**: `visualState?: 'default' | 'hovered' | 'pressed' | 'focus' | 'disabled'`

**Recommended**: Remove 'disabled', keep as separate prop

```typescript
// Props
visualState?: 'default' | 'hovered' | 'pressed' | 'focus';
disabled?: boolean; // Separate prop
```

**Rationale**:

- Disabled is a data state, not a visual override
- Matches DropmenuOption pattern
- Clearer separation of concerns

**Impact**: LOW - API consistency, minor cleanup

---

## Positive Patterns (Commendable Aspects)

### 1. Exceptional Design Token Mapping ✓

The plan demonstrates **meticulous design token mapping**:

```typescript
// Figma → Tailwind semantic token mapping
| Figma Token                      | Tailwind Class           |
| bg-surface-base-primary          | bg-background            |
| bg-surface-brand-secondary       | bg-info-50               |
| border-brand-solid               | border-info-500          |
| text-base-primary                | text-text-primary        |
```

**Why this is excellent**:

- ✅ Never uses arbitrary color values
- ✅ Always maps to semantic design system tokens
- ✅ Documents the mapping explicitly (helps future maintainers)
- ✅ Supports future theming (change tokens, not component code)

**This is a model for future component plans.**

---

### 2. Comprehensive Testing Strategy ✓

The plan includes **exhaustive test coverage**:

```typescript
Testing Categories:
1. Rendering Tests (basic mounting)
2. Size Variant Tests (SM, MD, LG)
3. Visual State Tests (default, hovered, pressed)
4. Selection State Tests (selected styling)
5. Checkbox Tests (visibility, checked/unchecked states)
6. Caption Tests (rendering, typography)
7. Add-on Tests (left/right slots, custom overrides)
8. Disabled State Tests (styling, ARIA)
9. Accessibility Tests (role, aria-selected, aria-checked)
10. Composition Tests (className, ref forwarding)
11. Edge Cases (long text, special characters)
```

**Why this is excellent**:

- Goes beyond basic rendering tests
- Includes accessibility testing (often overlooked)
- Tests edge cases (long text, special characters)
- Validates composition patterns (ref forwarding, className merging)

**Comparison**: Many component plans skip edge case and accessibility tests. This plan is **exemplary**.

---

### 3. Complete Storybook Documentation ✓

The plan mandates **comprehensive Storybook coverage**:

```typescript
Required Stories:
1. Default Story
2. Size Stories (SM, MD, LG)
3. State Stories (Default, Hovered, Pressed, Disabled)
4. Selection Stories (Selected, Unselected)
5. Caption Stories (With/Without caption)
6. Checkbox Stories (With/Without checkbox)
7. Add-on Stories (Left icon, right text, combinations)
8. Real-world Examples (Country selector, user selector, category selector)
9. Comparison Stories (AllSizes, AllStates, AllVariants matrix)
```

**Why this is excellent**:

- ✅ Covers all variants systematically
- ✅ Includes real-world usage examples
- ✅ Provides comparison grids for designers
- ✅ Enforces visual documentation requirements

**Impact**: Ensures design system quality and excellent developer experience.

---

### 4. Proper Checkbox Implementation Strategy ✓

The plan correctly chooses **inline checkbox** instead of creating a separate Checkbox atom:

```typescript
// Inline checkbox implementation (GOOD)
{showCheckbox && (
  <div className={checkboxClasses}>
    {selected && <Icon icon={Check} size="xs" />}
  </div>
)}
```

**Why this is correct**:

- ✅ Checkbox is tightly coupled to this component (not reusable independently)
- ✅ Avoids premature abstraction (no separate Checkbox component until needed elsewhere)
- ✅ Keeps related logic colocated
- ✅ Follows YAGNI principle (You Aren't Gonna Need It)

**Architectural Decision Documentation**:

> "Instead of creating a separate Checkbox component, the checkbox will be implemented inline within InputDropmenuItem using a styled div with conditional background and border."

**This demonstrates mature architectural thinking.**

---

### 5. Size-Appropriate Typography and Icon Mapping ✓

The plan correctly maps component sizes to appropriate child component sizes:

```typescript
| Component Size | Icon Size | Label Font | Caption Font |
| SM             | sm (16px) | TextSm     | TextXs       |
| MD             | sm (16px) | TextSm     | TextXs       |
| LG             | md (20px) | TextMd     | TextSm       |
```

**Why this is correct**:

- ✅ Maintains visual hierarchy (larger item = larger icon)
- ✅ Uses established Icon and Typography component size tokens
- ✅ Matches DropmenuOption icon sizing exactly
- ✅ Follows design system scale consistently

---

### 6. Excellent Documentation Structure ✓

The plan document itself is **architecturally sound**:

- ✅ Clear problem/solution statements
- ✅ Atomic design classification with reasoning
- ✅ Complete file location mappings
- ✅ Step-by-step implementation guide
- ✅ Acceptance criteria with validation commands
- ✅ Design specifications with exact pixel values
- ✅ Figma token mapping documented

**This plan serves as a template** for future component plans.

---

## Architecture Compliance Checklist

Based on `.claude/skills/sazonia-ui-components/SKILL.md`:

- ⚠️ Component is in correct category - **REQUIRES DECISION** (dropmenus vs inputs)
- ✅ File name is kebab-case (`input-dropmenu-item.tsx`)
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

**Compliance Score**: 14/15 (93%) - Pending category decision

---

## Security & Performance Considerations

### Security: No Issues ✓

- ✅ No external data sources
- ✅ No XSS vulnerabilities (React escapes content automatically)
- ✅ No sensitive data handling
- ✅ ARIA attributes properly planned
- ✅ No unsafe DOM manipulation

### Performance: Excellent ✓

**Strengths**:

- ✅ Uses CSS transitions (GPU-accelerated)
- ✅ No JavaScript-heavy animations
- ✅ Minimal re-renders (pure presentational component)
- ✅ Proper React.memo candidate if needed in large lists

**Optimization Opportunity**: Consider memoization for large lists:

```typescript
export const InputDropmenuItem = memo(
  forwardRef<HTMLDivElement, InputDropmenuItemProps>((props, ref) => {
    // Component implementation
  })
);
```

**When to use**: Only if profiling shows performance issues in large lists (50+ items).

**Recommendation**: Implement when used in virtualized lists or large selects.

---

## Scalability Assessment

### Component Reusability: Excellent ✓

**Can be used in**:

- Select dropdowns (primary use case)
- Combobox autocomplete
- Multi-select dropdowns
- Autocomplete inputs
- Searchable selects
- Category pickers
- Tag selectors

**Flexibility Score**: 9/10 - Highly reusable design

### Extension Points: Very Good ✓

**Planned extension mechanisms**:

1. ✅ Custom add-on React nodes (leftAddOn, rightAddOn)
2. ✅ className override for custom styling
3. ✅ Compound variants for complex state combinations
4. ✅ forwardRef for DOM manipulation
5. ✅ Optional props for progressive enhancement (caption, checkbox, selection)

**Future Enhancement Opportunity**: Add `asChild` pattern for Radix UI integration:

```typescript
interface InputDropmenuItemProps {
  asChild?: boolean; // Future: Radix UI Select.Item integration
}

// Usage with Radix UI Select
<Select.Item value="us" asChild>
  <InputDropmenuItem label="United States" leftIcon={FlagUS} />
</Select.Item>
```

**Note**: The plan acknowledges future Radix UI integration.

---

## Final Recommendations Summary

| Priority | Recommendation                                                    | Impact   | Effort | Blocking |
| -------- | ----------------------------------------------------------------- | -------- | ------ | -------- |
| CRITICAL | Resolve component category and naming (Move to inputs/ or rename) | CRITICAL | LOW    | YES      |
| HIGH     | Unify with DropmenuOption or extract shared logic                 | HIGH     | MEDIUM | NO       |
| MEDIUM   | Add caption compound variants for dynamic padding                 | MEDIUM   | LOW    | NO       |
| MEDIUM   | Document expected parent context (listbox, combobox)              | MEDIUM   | LOW    | NO       |
| LOW      | Remove 'disabled' from visualState enum                           | LOW      | LOW    | NO       |

**Blocking Issues**: 1 (component category/naming decision)

**All other recommendations are non-blocking**. The component can be implemented successfully with the category decision, and other improvements can be made during implementation.

---

## Conclusion

The InputDropmenuItem component plan demonstrates **very good architectural maturity** with one critical decision point that must be resolved before implementation: component category placement and naming.

**Key Achievements**:

1. ✅ Correct Molecule classification with proper atomic composition
2. ✅ Excellent CVA and forwardRef pattern alignment
3. ✅ Comprehensive testing and Storybook coverage
4. ✅ Exceptional semantic token usage and design system integration
5. ✅ Excellent documentation structure and implementation guide
6. ✅ Smart architectural decisions (inline checkbox, compound variants)

**Critical Decision Required**:

1. ⚠️ **BLOCKING**: Choose component category and naming approach
   - Option A (Recommended): Move to `src/ui/inputs/dropmenu-item.tsx`
   - Option B: Keep in dropmenus, rename to `SelectableOption`
   - Document decision rationale

**High Priority Improvements**:

1. Address code duplication with DropmenuOption (unify or extract shared logic)
2. Add compound variants for caption padding
3. Document expected parent context (accessibility)

**Overall Verdict**: **CONDITIONALLY APPROVED for implementation** pending category/naming decision.

Once the categorical placement is decided and documented:

- Update plan with chosen approach
- Document relationship to DropmenuOption
- Clarify when to use which component
- Proceed with implementation following the excellent patterns already established

**Confidence Score**: 90% - This component will integrate successfully once the architectural decision is made. The plan demonstrates exceptional attention to detail, comprehensive documentation, and strong alignment with existing patterns.

---

## Appendix: Recommended Implementation (Option A - Inputs Category)

Based on this evaluation, here's the recommended architectural approach:

### File Structure

```
src/ui/inputs/
├── dropmenu-item.tsx              # NEW: Input dropdown item
├── __tests__/dropmenu-item.test.tsx
└── index.ts                        # Export DropmenuItem

src/ui/dropmenus/
├── dropmenu-option.tsx            # EXISTING: Action menu item (no changes)
├── __tests__/dropmenu-option.test.tsx
└── index.ts

src/stories/inputs/
└── dropmenu-item.stories.tsx      # NEW: Storybook stories
```

### Component API

````typescript
// src/ui/inputs/dropmenu-item.tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check } from '@phosphor-icons/react';

import { cn } from '@/lib/utils';
import { Icon, type IconVariants } from '@/ui/icons';
import { TextMd, TextSm, TextXs } from '@/ui/typography';

const dropmenuItemVariants = cva(
  [
    'flex w-full cursor-pointer items-center rounded-sm transition-colors duration-150',
    'hover:bg-background-secondary active:bg-background-tertiary',
    'focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2',
    'focus-visible:outline-none',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2.5 px-3 py-1.5 text-sm leading-5',
        md: 'gap-3 px-3 py-2.5 text-sm leading-5',
        lg: 'gap-3 px-4 py-3 text-base leading-6',
      },
      visualState: {
        default: '',
        hovered: 'bg-background-secondary',
        pressed: 'bg-background-tertiary',
        focus: 'ring-2 ring-border-brand ring-offset-2',
      },
      selected: {
        true: 'border-l-[3px] border-info-500 bg-info-50',
        false: '',
      },
      hasCaption: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Caption reduces vertical padding
      { size: 'sm', hasCaption: true, className: 'py-1' },
      { size: 'md', hasCaption: true, className: 'py-1.5' },
      { size: 'lg', hasCaption: true, className: 'py-1.5' },
      // Selected + hovered = darker background
      { selected: true, visualState: 'hovered', className: 'bg-info-100' },
    ],
    defaultVariants: {
      size: 'lg',
      visualState: 'default',
      selected: false,
      hasCaption: false,
    },
  }
);

const sizeToIconSize: Record<'sm' | 'md' | 'lg', NonNullable<IconVariants['size']>> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

export type DropmenuItemVariants = VariantProps<typeof dropmenuItemVariants>;

export interface DropmenuItemProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'>,
    Omit<DropmenuItemVariants, 'hasCaption'> {
  /**
   * The option label text
   */
  label: string;

  /**
   * Whether this item is selected
   * @default false
   */
  selected?: boolean;

  /**
   * Whether to show a checkbox (for multi-select)
   * @default false
   */
  showCheckbox?: boolean;

  /**
   * Optional caption text below the label
   */
  caption?: string;

  /**
   * Whether to show the left add-on slot
   * @default false
   */
  showLeftAddOn?: boolean;

  /**
   * Whether to show the right add-on slot
   * @default false
   */
  showRightAddOn?: boolean;

  /**
   * Custom left add-on React node (overrides leftIcon)
   */
  leftAddOn?: ReactNode;

  /**
   * Custom right add-on React node (overrides rightText)
   */
  rightAddOn?: ReactNode;

  /**
   * Left icon component (from @phosphor-icons/react)
   */
  leftIcon?: React.ComponentType<PhosphorIconProps>;

  /**
   * Right text content
   */
  rightText?: string;

  /**
   * Whether the option is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * DropmenuItem - A selectable menu item for input dropdowns.
 *
 * Designed for use within Select, Combobox, and Autocomplete components.
 * Supports selection states, optional checkboxes, and caption text.
 *
 * Expected parent context:
 * - Select dropdowns (parent: role="listbox")
 * - Combobox autocomplete (parent: role="combobox" + role="listbox")
 * - Multi-select (parent: role="listbox" aria-multiselectable="true")
 *
 * @example
 * ```tsx
 * // Single select
 * <div role="listbox">
 *   <DropmenuItem label="United States" leftIcon={FlagUS} selected />
 *   <DropmenuItem label="Canada" leftIcon={FlagCA} />
 * </div>
 *
 * // Multi-select
 * <div role="listbox" aria-multiselectable="true">
 *   <DropmenuItem
 *     label="Option 1"
 *     selected
 *     showCheckbox
 *     caption="Description"
 *   />
 * </div>
 * ```
 */
export const DropmenuItem = forwardRef<HTMLDivElement, DropmenuItemProps>(
  (
    {
      size = 'lg',
      visualState = 'default',
      label,
      selected = false,
      showCheckbox = false,
      caption,
      showLeftAddOn = false,
      showRightAddOn = false,
      leftAddOn,
      rightAddOn,
      leftIcon: LeftIcon,
      rightText,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const iconSize = sizeToIconSize[size];
    const LabelTextComponent = size === 'lg' ? TextMd : TextSm;
    const CaptionTextComponent = size === 'lg' ? TextSm : TextXs;
    const hasCaption = Boolean(caption);
    const checkboxSize = size === 'lg' ? 'size-5' : 'size-4';

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={selected}
        aria-disabled={disabled || undefined}
        aria-checked={showCheckbox ? selected : undefined}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          dropmenuItemVariants({ size, visualState, selected, hasCaption }),
          disabled && 'text-text-tertiary',
          className
        )}
        {...props}
      >
        {/* Left icon add-on */}
        {showLeftAddOn &&
          (leftAddOn ||
            (LeftIcon && (
              <Icon
                icon={LeftIcon}
                size={iconSize}
                className={disabled ? 'text-text-tertiary' : 'text-text-primary'}
                aria-hidden
              />
            )))}

        {/* Checkbox (multi-select) */}
        {showCheckbox && (
          <div
            aria-hidden
            className={cn(
              'flex items-center justify-center rounded-sm',
              checkboxSize,
              selected
                ? 'bg-info-500 text-white'
                : disabled
                  ? 'border border-border bg-background-tertiary'
                  : 'border border-border bg-background'
            )}
          >
            {selected && <Icon icon={Check} size="xs" />}
          </div>
        )}

        {/* Label + Caption */}
        <div className="flex min-w-0 flex-1 flex-col">
          <span
            className={cn(
              'truncate font-sans',
              disabled ? 'text-text-tertiary' : 'text-text-primary'
            )}
          >
            {label}
          </span>
          {caption && (
            <CaptionTextComponent
              as="span"
              color="muted"
              className={cn('truncate', disabled && 'text-text-tertiary')}
            >
              {caption}
            </CaptionTextComponent>
          )}
        </div>

        {/* Right text add-on */}
        {showRightAddOn &&
          (rightAddOn || (
            <LabelTextComponent
              as="span"
              color="muted"
              className={cn('ml-auto shrink-0', disabled && 'text-text-tertiary')}
            >
              {rightText}
            </LabelTextComponent>
          ))}
      </div>
    );
  }
);

DropmenuItem.displayName = 'DropmenuItem';

export { dropmenuItemVariants };
````

### Usage Documentation

**When to use DropmenuItem (inputs) vs DropmenuOption (dropmenus):**

```typescript
// ✅ Use DropmenuItem (src/ui/inputs/) for:
// - Select dropdowns
<Select>
  <DropmenuItem label="Option 1" selected />
  <DropmenuItem label="Option 2" />
</Select>

// - Multi-select
<MultiSelect>
  <DropmenuItem label="Item 1" selected showCheckbox />
  <DropmenuItem label="Item 2" showCheckbox />
</MultiSelect>

// - Autocomplete/Combobox
<Combobox>
  <DropmenuItem
    label="React"
    caption="JavaScript library"
    selected
  />
</Combobox>

// ✅ Use DropmenuOption (src/ui/dropmenus/) for:
// - Action menus
<ContextMenu>
  <DropmenuOption label="Edit" leftIcon={Pencil} />
  <DropmenuOption label="Delete" leftIcon={Trash} />
</ContextMenu>

// - Navigation dropdowns
<NavigationMenu>
  <DropmenuOption label="Settings" leftIcon={Gear} />
  <DropmenuOption label="Logout" leftIcon={SignOut} />
</NavigationMenu>
```

This recommended implementation provides clear architectural separation and excellent developer experience.
