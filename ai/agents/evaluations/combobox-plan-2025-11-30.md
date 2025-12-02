# Combobox Component Architectural Evaluation

**Date**: 2025-11-30
**Component**: Combobox (Input Component)
**Plan Location**: `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/ai/plans/ui/combobox-plan-2025-11-30.md`
**Evaluator**: UI/UX Architecture Agent

---

## Executive Summary

**Overall Architectural Alignment**: 8.5/10

The Combobox plan demonstrates strong alignment with the project's established architectural patterns, particularly in its use of CVA variants, compound component composition, and Radix UI integration. However, there are several critical architectural decisions that need refinement before implementation to ensure consistency with existing patterns and avoid future technical debt.

**Classification**: Molecule (Correct)

**Recommendation**: **APPROVE with required modifications** - The plan is architecturally sound but requires specific pattern adjustments to match the established codebase conventions.

---

## 1. Atomic Design Classification Assessment

### Rating: ✅ CORRECT

**Classification**: Molecule

**Reasoning**: The plan correctly classifies Combobox as a **Molecule**. This is appropriate because:

1. **Composes multiple atoms**: Uses Icon, InputLabel, Hint, ErrorMessage
2. **Composes lower-level molecules**: Uses DropmenuItem pattern
3. **Single cohesive purpose**: Provides searchable selection functionality
4. **Not complex enough for organism**: Doesn't contain multiple distinct sections or sub-systems

**Evidence from codebase**:

- `Select` (reference component) is a molecule with similar complexity
- `InputDropmenu` is a molecule with comparable composition
- Both use compound component patterns with context propagation

**Positive observation**: The plan demonstrates clear understanding of atomic design hierarchy and correctly positions Combobox at the same level as Select and InputDropmenu.

---

## 2. Component Composition Strategy

### Rating: ⚠️ NEEDS REFINEMENT

### 2.1 Correct Composition Choices

**Atoms to reuse** (Correct):

- ✅ `Icon` from `@/ui/icons` - For CaretDown, X (clear), MagnifyingGlass
- ✅ `InputLabel` from `@/ui/inputs` - For ComboboxField wrapper
- ✅ `Hint` from `@/ui/inputs` - For helper text in ComboboxField
- ✅ `ErrorMessage` from `@/ui/inputs` - For error display in ComboboxField

**Molecules to reference** (Correct):

- ✅ `DropmenuItem` styling patterns - For item selection states
- ✅ `Select` compound component pattern - For context and structure
- ✅ `InputDropmenuSearch` input styling - For search input wrapper

### 2.2 Critical Architecture Issue: Component Structure Pattern

**ISSUE**: The plan proposes a structure that differs from the established Select pattern

**Plan proposes**:

```typescript
<Combobox>
  <ComboboxTrigger>
    <ComboboxInput />  // Input inside trigger
  </ComboboxTrigger>
  <ComboboxContent>
    <ComboboxItem />
  </ComboboxContent>
</Combobox>
```

**However, examining the existing `Select` component reveals**:

- Select uses Radix Select primitive directly
- Context propagation for size (SelectSizeContext)
- Compound components with clear separation

**RECOMMENDATION**: The plan should use **Radix Popover** (not Select primitive) as the foundation, similar to how InputDropmenu works, but with additional input management:

```typescript
// Recommended structure based on existing patterns
<Combobox open={open} onOpenChange={setOpen}>
  <ComboboxTrigger>  // Uses Radix Popover.Trigger
    <ComboboxInput />  // Input element with keyboard handling
  </ComboboxTrigger>
  <ComboboxContent>  // Uses Radix Popover.Content
    <ComboboxItem />
  </ComboboxContent>
</Combobox>
```

**Rationale**:

1. **Select primitive is NOT appropriate** - Radix Select is designed for non-editable dropdowns
2. **Popover primitive is correct** - Combobox needs an editable input, which Radix Popover supports
3. **Existing precedent**: InputDropmenu already uses a similar pattern (though without Radix)

### 2.3 Context Propagation Pattern

**ISSUE**: The plan mentions `ComboboxSizeContext` but doesn't detail the pattern

**Required pattern** (based on Select.tsx):

```typescript
// Must follow this exact pattern from select.tsx
type ComboboxSize = 'sm' | 'md' | 'lg';

const ComboboxSizeContext = createContext<ComboboxSize>('lg');

function useComboboxSize(): ComboboxSize {
  return useContext(ComboboxSizeContext);
}

// In root component
export function Combobox({ size = 'lg', children, ...props }) {
  return (
    <ComboboxSizeContext.Provider value={size}>
      {/* Radix Popover.Root */}
    </ComboboxSizeContext.Provider>
  );
}

// In child components
const contextSize = useComboboxSize();
const size = propSize ?? contextSize;
```

**Critical**: This pattern is established across Select and InputDropmenu. Do NOT deviate.

---

## 3. Architectural Alignment with Project Patterns

### Rating: ⚠️ NEEDS ADJUSTMENTS

### 3.1 CVA Pattern Compliance ✅

**Status**: CORRECT

The plan correctly proposes CVA variants following the established pattern:

- `comboboxTriggerVariants` - Matches selectTriggerVariants structure
- `comboboxContentVariants` - Matches selectContentVariants structure
- `comboboxItemVariants` - Matches selectItemVariants structure

**Evidence from select.tsx**:

```typescript
const selectTriggerVariants = cva([...], {
  variants: {
    size: { sm: ..., md: ..., lg: ... },
    variant: { bordered: ..., borderless: ... },
    error: { true: ..., false: ... },
  },
  compoundVariants: [...],
  defaultVariants: { size: 'lg', variant: 'bordered', error: false },
});
```

**Recommendation**: Follow this EXACT pattern for comboboxTriggerVariants.

### 3.2 Radix UI Integration ⚠️

**CRITICAL ISSUE**: Plan mentions "evaluate if Radix Popover is sufficient"

**Decision MUST be**: Use **@radix-ui/react-popover**

**Rationale**:

1. **Precedent**: Select uses `@radix-ui/react-select`
2. **Pattern consistency**: All dropdown-style components use Radix primitives
3. **Accessibility**: Radix provides ARIA attributes and keyboard navigation out of the box
4. **Maintenance**: Using battle-tested primitives reduces custom implementation burden

**Required Radix components**:

- `Popover.Root` - Manages open state
- `Popover.Trigger` - Trigger element (wrapping input)
- `Popover.Portal` - Portal for dropdown
- `Popover.Content` - Dropdown content container

**Example pattern from select.tsx**:

```typescript
import * as PopoverPrimitive from '@radix-ui/react-popover';

export const ComboboxContent = forwardRef<...>((props, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      sideOffset={4}
      className={cn(comboboxContentVariants({ size }), className)}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
```

### 3.3 Compound Component Pattern ✅

**Status**: CORRECT

The plan correctly proposes compound components:

- Combobox (root)
- ComboboxTrigger
- ComboboxInput
- ComboboxContent
- ComboboxItem
- ComboboxEmpty
- ComboboxField (wrapper)

This matches the Select pattern:

- Select (root)
- SelectTrigger
- SelectValue
- SelectContent
- SelectItem
- SelectField (wrapper)

**Positive**: Clean separation of concerns, composable, testable.

### 3.4 File Organization ❌

**ISSUE**: Missing context file

**Plan proposes**:

- `src/ui/inputs/combobox.tsx`
- `src/ui/inputs/combobox-field.tsx`

**REQUIRED** (based on InputDropmenu pattern):

- `src/ui/inputs/combobox.tsx` - Main component file
- `src/ui/inputs/combobox-field.tsx` - Field wrapper
- **`src/ui/inputs/combobox-context.tsx`** - Context provider (MISSING)

**Evidence**: InputDropmenu has `input-dropmenu-context.tsx` for size propagation.

**Recommendation**: Create separate context file following this pattern:

```typescript
// src/ui/inputs/combobox-context.tsx
'use client';

import { createContext, type ReactNode, useContext } from 'react';

export type ComboboxSize = 'sm' | 'md' | 'lg';

interface ComboboxContextValue {
  size: ComboboxSize;
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  onValueChange: (value: string) => void;
  // Add other shared state here
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

export function useComboboxContext(): ComboboxContextValue {
  const context = useContext(ComboboxContext);
  if (!context) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('useComboboxContext must be used within a Combobox component');
    }
    throw new Error('useComboboxContext must be used within Combobox');
  }
  return context;
}

export function ComboboxProvider({ children, ...value }: ComboboxContextValue & { children: ReactNode }) {
  return <ComboboxContext.Provider value={value}>{children}</ComboboxContext.Provider>;
}
```

---

## 4. Design System Integration

### Rating: ⚠️ NEEDS CORRECTIONS

### 4.1 Export Pattern Assessment

**Plan proposes**:

```typescript
// 1. Export from combobox.tsx
export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxEmpty,
  comboboxTriggerVariants,
  comboboxContentVariants,
  comboboxItemVariants,
};

// 2. Export from combobox-field.tsx
export { ComboboxField };

// 3. Update inputs/index.ts
export * from './combobox';
export * from './combobox-field';
```

**ISSUE**: Missing context exports

**REQUIRED** (based on existing patterns):

```typescript
// src/ui/inputs/combobox.tsx
export {
  Combobox,
  ComboboxTrigger,
  ComboboxInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxEmpty,
  comboboxTriggerVariants,
  comboboxContentVariants,
  comboboxInputVariants, // ADD THIS
  comboboxItemVariants,
};
export type {
  ComboboxProps,
  ComboboxTriggerProps,
  ComboboxInputProps,
  ComboboxContentProps,
  ComboboxItemProps,
  ComboboxEmptyProps,
};

// src/ui/inputs/combobox-context.tsx
export {
  ComboboxProvider,
  useComboboxContext,
  useComboboxSize, // ADD THIS
};
export type { ComboboxSize, ComboboxContextValue };

// src/ui/inputs/combobox-field.tsx
export { ComboboxField };
export type { ComboboxFieldProps };

// src/ui/inputs/index.ts
export * from './combobox';
export * from './combobox-context'; // ADD THIS
export * from './combobox-field';
```

**Evidence**: InputDropmenu exports context separately:

```typescript
export * from './input-dropmenu-context';
```

### 4.2 Barrel File Integration ✅

**Status**: CORRECT

The plan correctly identifies barrel file updates:

- Update `src/ui/inputs/index.ts` with new exports
- Imports work via `@/ui` and `@/ui/inputs`

This follows the established pattern from the sazonia-ui-components skill.

---

## 5. Critical Architectural Issues

### Issue 1: State Management Pattern Incomplete

**Problem**: The plan doesn't specify how controlled/uncontrolled modes are implemented

**Required pattern** (from Select):

```typescript
// Controlled mode
<Combobox value={value} onValueChange={setValue}>

// Uncontrolled mode
<Combobox defaultValue="initial">
```

**Implementation requirement**: Use `@radix-ui/react-use-controllable-state` or implement similar pattern:

```typescript
import { useControllableState } from '@radix-ui/react-use-controllable-state';

export function Combobox({
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  // ... rest of implementation
}
```

### Issue 2: Input vs. Trigger Responsibility Unclear

**Problem**: The plan places `ComboboxInput` inside `ComboboxTrigger` but doesn't clarify responsibility boundaries

**Recommended pattern**:

```typescript
// ComboboxTrigger = Wrapper with border, background, add-ons
// ComboboxInput = Actual input element inside trigger

<ComboboxTrigger>
  {leftAddOn && <span>{leftAddOn}</span>}
  <ComboboxInput />  // This is the actual <input> element
  <Icon icon={CaretDown} />
</ComboboxTrigger>
```

**Clarification needed**:

- ComboboxTrigger = styled wrapper (similar to textInputWrapperVariants)
- ComboboxInput = the `<input>` element (similar to textInputVariants)
- Trigger handles: border, padding, focus-within, left/right add-ons
- Input handles: text styling, placeholder, keyboard events

### Issue 3: Filtering Logic Not Architected

**Problem**: Plan mentions "filtering logic" but doesn't specify the architecture

**Recommendation**: Implement as a controlled pattern with callback:

```typescript
export interface ComboboxProps {
  // ... other props
  filterOptions?: (options: Option[], query: string) => Option[];
  onQueryChange?: (query: string) => void;
}

// Default implementation
const defaultFilterOptions = (options: Option[], query: string) => {
  const lowerQuery = query.toLowerCase();
  return options.filter((opt) => opt.label.toLowerCase().includes(lowerQuery));
};

// Usage in component
const filteredOptions = filterOptions
  ? filterOptions(options, query)
  : defaultFilterOptions(options, query);
```

**Rationale**: This provides flexibility for:

- Simple client-side filtering (default)
- Custom filtering logic
- Server-side filtering (via onQueryChange callback)

### Issue 4: `cmdk` Library Decision Pending

**Problem**: Plan lists this as "evaluate cmdk vs custom"

**DECISION REQUIRED**: DO NOT use `cmdk`

**Rationale**:

1. **Unnecessary dependency**: The project has established patterns for building these components
2. **Design mismatch**: cmdk has opinionated styling that differs from the design system
3. **Existing patterns**: Select and InputDropmenu provide all the necessary patterns
4. **Control**: Custom implementation ensures exact design match

**Recommendation**: Build custom using:

- Radix Popover for dropdown behavior
- Custom filtering logic (as outlined above)
- Existing input patterns from TextInput and InputDropmenuSearch

---

## 6. Positive Patterns Identified

### 6.1 Comprehensive Planning ✅

The plan demonstrates excellent forethought:

- Detailed size specifications from Figma
- Complete state enumeration
- Accessibility considerations
- Test coverage planning
- Storybook story planning

### 6.2 Design Token Mapping ✅

The plan correctly maps Figma tokens to Tailwind classes:

- `#d7dbdf` → `border-border`
- `#3c61dd` → `border-primary`
- `#e54d2e` → `border-destructive`

This follows the established pattern from other input components.

### 6.3 Accessibility Awareness ✅

The plan mentions correct ARIA attributes:

- `role="combobox"` on input
- `aria-expanded` for dropdown state
- `aria-controls` for association
- `role="listbox"` on dropdown
- `role="option"` on items

**Enhancement needed**: Reference the existing ARIA implementation from Select and DropmenuItem for consistency.

### 6.4 Field Wrapper Pattern ✅

The plan correctly proposes `ComboboxField` as a convenience wrapper, matching:

- SelectField pattern
- TextInputField pattern
- Integration with InputLabel, Hint, ErrorMessage
- Auto-generated IDs for ARIA associations

This is architecturally sound and follows the established convention.

---

## 7. Implementation Recommendations

### 7.1 CRITICAL: Radix Primitive Selection

**DO**:

- ✅ Use `@radix-ui/react-popover` for dropdown behavior
- ✅ Use `Popover.Root`, `Popover.Trigger`, `Popover.Content`, `Popover.Portal`
- ✅ Use `useControllableState` for controlled/uncontrolled modes

**DON'T**:

- ❌ Use `@radix-ui/react-select` (not suitable for editable inputs)
- ❌ Use `cmdk` library (unnecessary dependency)
- ❌ Build dropdown portal from scratch (use Radix)

### 7.2 File Structure

**Required files**:

1. `src/ui/inputs/combobox.tsx` - Main components (Combobox, Trigger, Input, Content, Item, Empty)
2. `src/ui/inputs/combobox-context.tsx` - Context provider and hooks
3. `src/ui/inputs/combobox-field.tsx` - Field wrapper with label/hint/error
4. `src/ui/inputs/__tests__/combobox.test.tsx` - Component tests
5. `src/ui/inputs/__tests__/combobox-field.test.tsx` - Field wrapper tests
6. `src/stories/inputs/combobox.stories.tsx` - Storybook stories

### 7.3 Component Architecture

```typescript
// Recommended component hierarchy

// ROOT: Manages state and provides context
Combobox (Popover.Root + Context Provider)
├─ ComboboxTrigger (Popover.Trigger + styled wrapper)
│  ├─ leftAddOn slot
│  ├─ ComboboxInput (<input> element)
│  └─ Icons (clear, chevron)
└─ ComboboxContent (Popover.Portal + Popover.Content)
   ├─ ComboboxItem (option items)
   └─ ComboboxEmpty (no results)

// FIELD WRAPPER: Convenience component
ComboboxField
├─ InputLabel
├─ Combobox (full composition above)
└─ Hint | ErrorMessage
```

### 7.4 Context Shape

**Required context values**:

```typescript
interface ComboboxContextValue {
  // Size propagation
  size: ComboboxSize;

  // State management
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  onValueChange: (value: string) => void;

  // Query/filtering
  query: string;
  setQuery: (query: string) => void;

  // Keyboard navigation
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
}
```

### 7.5 CVA Variants Reference

**Base on these patterns**:

From `select.tsx`:

- Trigger variants (size, variant, error, compoundVariants)
- Content variants (size, max-height, animations)
- Item variants (size, selected state with blue left border)

From `text-input.tsx`:

- Wrapper variants (focus-within, error states)
- Input variants (typography by size)

From `input-dropmenu-search.tsx`:

- Search wrapper variants (bottom border, focus-within)
- Icon sizing by variant

### 7.6 Keyboard Navigation Requirements

**Must implement**:

- ArrowDown: Open dropdown / move to next option
- ArrowUp: Move to previous option
- Enter: Select highlighted option
- Escape: Close dropdown
- Tab: Close dropdown and move focus
- Type-ahead: Filter as user types

**Reference**: Check SelectItem implementation for keyboard event handling patterns.

---

## 8. Required Pattern Corrections

### Correction 1: Add Context File

**Before** (plan):

- combobox.tsx
- combobox-field.tsx

**After** (required):

- combobox.tsx
- **combobox-context.tsx** (ADD THIS)
- combobox-field.tsx

### Correction 2: Specify Radix Primitive

**Before** (plan):

> "Decide between using `cmdk` library or building custom filtering logic"

**After** (required):

> "Use @radix-ui/react-popover for dropdown behavior with custom filtering logic"

### Correction 3: Define State Management

**Before** (plan):

> "Support controlled and uncontrolled modes"

**After** (required):

> "Use @radix-ui/react-use-controllable-state for controlled/uncontrolled modes following Select pattern"

### Correction 4: Clarify Trigger/Input Relationship

**Before** (plan):

> "ComboboxTrigger component: Contains input element and icons"

**After** (required):

```
ComboboxTrigger: Styled wrapper div (border, background, padding, focus-within)
  - Renders leftAddOn, ComboboxInput, icons
  - Uses comboboxTriggerVariants (like textInputWrapperVariants)

ComboboxInput: Actual <input> element
  - Uses comboboxInputVariants (like textInputVariants)
  - Handles keyboard events and text entry
  - Controlled by Combobox context
```

---

## 9. Testing Strategy Review

### Current Plan Assessment: ✅ SOLID

The plan's testing strategy is comprehensive:

- Component tests for all variants
- Keyboard navigation tests
- Controlled/uncontrolled mode tests
- Accessibility attribute tests
- Edge case tests

**Enhancement recommendations**:

1. **Add integration tests**:
   - Test ComboboxField wrapper integration
   - Test with real form libraries (react-hook-form)

2. **Add visual regression tests**:
   - Storybook interaction tests
   - Screenshot comparison for all states

3. **Add a11y tests**:
   - Use @testing-library/jest-dom for ARIA assertions
   - Test screen reader announcements

---

## 10. Storybook Requirements Review

### Current Plan Assessment: ✅ EXCELLENT

The plan specifies 15 comprehensive stories covering:

- Basic functionality
- All size/state combinations
- Real-world examples
- Comparison with Select/Autocomplete

**This is exactly right** and matches the existing Select stories pattern.

**Additional story recommendation**:

- Add "Async Loading" story demonstrating server-side filtering pattern

---

## 11. Final Recommendations

### Must-Fix Before Implementation (Critical)

1. ❌ **Add combobox-context.tsx file** to file structure
2. ❌ **Specify Radix Popover** as the primitive (remove cmdk consideration)
3. ❌ **Define state management pattern** using useControllableState
4. ❌ **Clarify Trigger vs Input responsibilities** in component structure
5. ❌ **Add context exports** to barrel file plan

### Should-Fix Before Implementation (Important)

1. ⚠️ Define filtering architecture (callback pattern recommended above)
2. ⚠️ Specify keyboard navigation implementation details
3. ⚠️ Add context shape to plan documentation
4. ⚠️ Reference SelectItem for selection state styling

### Nice-to-Have Enhancements

1. 💡 Add async loading story to Storybook plan
2. 💡 Consider adding "create new option" functionality architecture (for future)
3. 💡 Document performance considerations for large option lists
4. 💡 Add accessibility testing to test plan

---

## 12. Architectural Compliance Checklist

Based on `.claude/skills/sazonia-ui-components/SKILL.md`:

- ✅ Component in correct category (`src/ui/inputs/`)
- ✅ File names are kebab-case
- ⚠️ Uses direct React imports (verify in implementation)
- ✅ Uses `forwardRef` for ref forwarding
- ✅ Sets `displayName` for debugging
- ✅ Props extend `ComponentPropsWithoutRef`
- ✅ Variants defined with CVA
- ✅ Props include `VariantProps<typeof variants>`
- ✅ Uses `cn()` to merge className
- ✅ Default variants specified
- ✅ Added to category barrel export
- ✅ Added to root barrel export
- ✅ TypeScript types exported
- ✅ Accessible (ARIA attributes specified)
- ❌ **Context file missing from plan** (MUST ADD)

---

## 13. Conclusion

### Overall Assessment

The Combobox plan is **architecturally sound in concept** but requires **specific pattern refinements** to ensure consistency with the established codebase. The plan author demonstrates a strong understanding of:

- Atomic design principles
- Component composition patterns
- CVA variant systems
- Accessibility requirements
- Testing best practices

### Critical Success Factors

**For successful implementation**:

1. **Use Radix Popover** - Not cmdk, not Select primitive
2. **Add context file** - Following InputDropmenu pattern
3. **Follow Select patterns exactly** - For size context, compound components, CVA variants
4. **Implement state management** - Using useControllableState pattern
5. **Separate Trigger and Input concerns** - Clear architectural boundaries

### Approval Status

**APPROVED with REQUIRED MODIFICATIONS**

The plan may proceed to implementation **after addressing the Critical must-fix items** listed in Section 11. The implementation team should reference:

- `src/ui/inputs/select.tsx` - For compound component pattern
- `src/ui/inputs/input-dropmenu.tsx` - For dropdown container patterns
- `src/ui/inputs/text-input.tsx` - For input wrapper patterns
- `src/ui/inputs/input-dropmenu-context.tsx` - For context pattern

### Risk Assessment

**LOW RISK** if modifications are implemented
**MEDIUM RISK** if plan proceeds without context file
**HIGH RISK** if cmdk library is used or wrong Radix primitive is chosen

---

## Appendix A: Reference Components

### Primary References (Must Follow)

1. `src/ui/inputs/select.tsx` - Compound component, context, CVA variants
2. `src/ui/inputs/input-dropmenu.tsx` - Dropdown container patterns
3. `src/ui/inputs/text-input.tsx` - Input wrapper patterns

### Secondary References (Styling Inspiration)

4. `src/ui/inputs/input-dropmenu-search.tsx` - Search input styling
5. `src/ui/inputs/dropmenu-item.tsx` - Item selection states

### Context Pattern Reference

6. `src/ui/inputs/input-dropmenu-context.tsx` - Context provider pattern

### Field Wrapper Reference

7. `src/ui/inputs/select-field.tsx` - Field composition pattern

---

## Appendix B: Revised File Structure

```
src/ui/inputs/
├── combobox.tsx                      # Main component (Root, Trigger, Input, Content, Item, Empty)
├── combobox-context.tsx              # Context provider and hooks (ADD THIS)
├── combobox-field.tsx                # Field wrapper with label/hint/error
├── __tests__/
│   ├── combobox.test.tsx            # Component tests
│   └── combobox-field.test.tsx      # Field wrapper tests
└── index.ts                          # Barrel exports (update)

src/stories/inputs/
└── combobox.stories.tsx              # Storybook documentation
```

---

## Appendix C: Recommended Implementation Order

1. **Phase 1: Foundation**
   - Create `combobox-context.tsx` with context and hooks
   - Define CVA variants in `combobox.tsx`
   - Set up basic Radix Popover integration

2. **Phase 2: Core Components**
   - Implement Combobox root with context provider
   - Implement ComboboxTrigger wrapper
   - Implement ComboboxInput element
   - Implement basic open/close behavior

3. **Phase 3: Dropdown & Items**
   - Implement ComboboxContent with Radix Portal
   - Implement ComboboxItem with selection states
   - Implement ComboboxEmpty component
   - Add filtering logic

4. **Phase 4: Keyboard & Accessibility**
   - Implement keyboard navigation
   - Add ARIA attributes
   - Test with screen readers

5. **Phase 5: Field Wrapper**
   - Implement ComboboxField
   - Integrate InputLabel, Hint, ErrorMessage
   - Auto-generate IDs

6. **Phase 6: Polish & Documentation**
   - Write comprehensive tests
   - Create all Storybook stories
   - Update documentation
   - Run validation commands

---

**Evaluation completed**: 2025-11-30
**Next step**: Implementation team should review this evaluation and update the plan with required modifications before beginning development.
