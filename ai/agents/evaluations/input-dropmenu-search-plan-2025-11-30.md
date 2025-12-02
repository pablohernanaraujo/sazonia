# Architectural Evaluation: InputDropmenuSearch Component Plan

**Component**: InputDropmenuSearch
**Location**: `src/ui/inputs/input-dropmenu-search.tsx`
**Evaluation Date**: 2025-11-30
**Evaluator**: UI/UX Architecture Agent
**Plan Document**: `ai/plans/ui/input-dropmenu-search-2025-11-30.md`

---

## Executive Summary

**Overall Architecture Score**: 8.5/10 (Excellent with minor improvements needed)

The InputDropmenuSearch component plan demonstrates strong architectural alignment with the sazonia-web design system. The component is well-scoped, properly classified, and follows established patterns. However, there are several architectural considerations and potential improvements that should be addressed before implementation.

**Recommendation**: **APPROVED WITH MODIFICATIONS** - Proceed with implementation after addressing the architectural concerns detailed below.

---

## Architectural Assessment

### Component Classification: MOLECULE ✅

**Status**: Correct classification

**Reasoning**:

- Composes atomic elements (Icon, implicit input element, border decoration)
- Single-purpose: Provides search functionality within dropdown contexts
- No orchestration of other molecules (that would make it an organism)
- Designed to be composed into larger organisms (Combobox, Autocomplete, Select)

**Alignment with Atomic Design**: This component correctly sits at the molecule level, similar to `TextInput` and `DropmenuItem`.

---

## Critical Architectural Issues

### 1. Component Composition Strategy - NEEDS CLARIFICATION

**Issue**: The plan references composing from `TextInput`, but the Figma design shows a **simpler, specialized** component that should NOT reuse TextInput.

**Analysis**:

```typescript
// ❌ WRONG APPROACH - Do NOT extend TextInput
export function InputDropmenuSearch({ ...props }) {
  return <TextInput leftAddOn={<SearchIcon />} {...props} />;
}

// ✅ CORRECT APPROACH - Create standalone component
export function InputDropmenuSearch({ ...props }) {
  return (
    <div className="...wrapper">
      {showIcon && <Icon icon={MagnifyingGlass} />}
      <input className="...input" {...props} />
    </div>
  );
}
```

**Rationale**:

1. **Different context**: TextInput is a general-purpose form input with full border, focus rings, and error states. InputDropmenuSearch is a specialized search field optimized for dropdown menus.
2. **Simpler styling**: Only bottom border (not full border), no error states in Figma spec, minimal visual complexity.
3. **Reduced feature set**: No left/right add-ons, no error states, no complex state management - just search icon and input.
4. **Tighter integration**: Designed to blend seamlessly within dropdown menus, not stand out as a form field.

**Recommendation**: Build as a **standalone molecule** with its own CVA variants, similar to how `DropmenuItem` is built separately from generic button components.

---

### 2. Variant Architecture - NEEDS REFINEMENT

**Current Plan**:

- Three size variants (sm, md, lg)
- Wrapper vs input variant separation (following TextInput pattern)

**Architectural Concerns**:

**A. Size-to-Icon Mapping Pattern Missing**

The plan doesn't specify the size-to-icon mapping, but existing patterns show this is critical:

```typescript
// From DropmenuItem.tsx (REFERENCE PATTERN)
const sizeToIconSize: Record<
  'sm' | 'md' | 'lg',
  NonNullable<IconVariants['size']>
> = {
  sm: 'sm', // 16px
  md: 'sm', // 16px
  lg: 'md', // 20px
};
```

**Required**:

```typescript
// Add to InputDropmenuSearch implementation
const sizeToIconSize: Record<
  'sm' | 'md' | 'lg',
  NonNullable<IconVariants['size']>
> = {
  sm: 'sm', // 16px icon
  md: 'sm', // 16px icon
  lg: 'sm', // 16px icon (Figma shows 16px for all sizes)
};
```

**B. Border Styling Architecture**

The plan correctly identifies "bottom border only" but doesn't specify the CSS approach:

```typescript
// ✅ RECOMMENDED: Use border-b with proper semantic tokens
const inputDropmenuSearchWrapperVariants = cva([
  'flex w-full items-center',
  'border-b border-border-secondary', // Bottom border only
  'bg-transparent', // No background (blends with dropdown)
  // No focus-within ring (simpler than TextInput)
  'focus-within:border-primary', // Subtle focus indication
]);
```

**C. No Error or Disabled States**

The Figma design doesn't show error or disabled states. This is architecturally correct for a search input within dropdowns:

```typescript
// ✅ CORRECT: No error/disabled variants needed
// This component is context-dependent and controlled by parent
```

---

### 3. Prop Interface Design - NEEDS SIMPLIFICATION

**Current Plan Implies**:

```typescript
// Likely over-engineered if following TextInput pattern
interface InputDropmenuSearchProps {
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  leftAddOn?: ReactNode; // ❌ NOT NEEDED
  rightAddOn?: ReactNode; // ❌ NOT NEEDED
  error?: boolean; // ❌ NOT NEEDED
  wrapperClassName?: string;
  className?: string;
  // ... standard input props
}
```

**Recommended Simplified Interface**:

```typescript
// ✅ SIMPLER, PURPOSE-BUILT INTERFACE
export interface InputDropmenuSearchProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'size'
> {
  /**
   * Size variant of the search input
   * - `sm`: Small (8px vertical, 12px horizontal padding)
   * - `md`: Medium (8px vertical, 12px horizontal padding)
   * - `lg`: Large (12px vertical, 16px horizontal padding)
   * @default 'lg'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether to show the search icon
   * @default true
   */
  showIcon?: boolean;

  /**
   * Additional CSS classes for the wrapper element
   */
  wrapperClassName?: string;
}
```

**Why This Is Better**:

1. **Single Responsibility**: Component does one thing well - provides search functionality in dropdowns
2. **No Feature Creep**: Removes unnecessary props (leftAddOn, rightAddOn, error)
3. **Type Safety**: Clear, focused interface that prevents misuse
4. **Composability**: Parent components can wrap this if they need additional features

---

### 4. State Management - CORRECT APPROACH ✅

**Analysis**: The component should be **controlled** by its parent:

```typescript
// ✅ CORRECT: Controlled component pattern
function Combobox() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Dropmenu>
      <InputDropmenuSearch
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />
      {/* Filtered items based on searchQuery */}
    </Dropmenu>
  );
}
```

**Recommendation**: Do NOT add internal state. Keep it as a **presentational component** that receives value and onChange from parent.

---

## Design System Integration

### CVA Pattern Alignment ✅

**Status**: Excellent - Follows established CVA patterns

**Recommended Structure**:

```typescript
const inputDropmenuSearchWrapperVariants = cva(
  [
    // Base styles
    'flex w-full items-center',
    'border-b border-border-secondary',
    'bg-transparent',
    'transition-colors duration-150',
    'focus-within:border-primary',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2.5 px-3 py-2', // 10px gap, 12px px, 8px py
        md: 'gap-3 px-3 py-2', // 12px gap, 12px px, 8px py
        lg: 'gap-3 px-4 py-3', // 12px gap, 16px px, 12px py
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

const inputDropmenuSearchInputVariants = cva(
  [
    'w-full min-w-0 flex-1',
    'bg-transparent',
    'border-none outline-none',
    'text-text-primary',
    'placeholder:text-text-tertiary',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm leading-5', // 14px/20px
        md: 'text-sm leading-5', // 14px/20px
        lg: 'text-base leading-6', // 16px/24px
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);
```

**Why This Works**:

1. **Separation of Concerns**: Wrapper handles layout/border, input handles typography
2. **Token-Based**: Uses semantic tokens (border-border-secondary, text-text-primary)
3. **Consistent Sizing**: Aligns with DropmenuItem and TextInput sizing conventions
4. **Composable**: Can be extended with compound variants if needed

---

### Semantic Token Usage ✅

**Status**: Excellent - Correct token mapping from Figma

| Figma Token | Design System Token       | Usage                    |
| ----------- | ------------------------- | ------------------------ |
| `#e6e8eb`   | `border-border-secondary` | Bottom border            |
| `#889096`   | `text-text-tertiary`      | Search icon, placeholder |
| `#11181c`   | `text-text-primary`       | Input text value         |

**Additional Tokens Needed**:

```typescript
// Focus state (not in Figma, but architecturally necessary)
'focus-within:border-primary'; // Brand color for focus
```

---

### Barrel Export Pattern ✅

**Status**: Correct - Follows established export conventions

**Implementation**:

```typescript
// 1. Component file: src/ui/inputs/input-dropmenu-search.tsx
export {
  InputDropmenuSearch,
  inputDropmenuSearchWrapperVariants,
  inputDropmenuSearchInputVariants,
};
export type { InputDropmenuSearchProps };

// 2. Category barrel: src/ui/inputs/index.ts
export * from './input-dropmenu-search';

// 3. Usage
import { InputDropmenuSearch } from '@/ui';
// OR
import { InputDropmenuSearch } from '@/ui/inputs';
```

---

## Component Boundaries & Responsibilities

### Single Responsibility Principle ✅

**Status**: Well-defined, single purpose

**Responsibility**: Provide a search input optimized for dropdown menu contexts

**What It Does**:

- Renders a bottom-bordered search field
- Optionally displays a search icon
- Forwards all standard input props to underlying `<input>` element
- Manages size-based styling variations

**What It Does NOT Do** (correctly delegated):

- Form validation (parent responsibility)
- Search logic/filtering (parent responsibility)
- Dropdown positioning/visibility (Dropmenu organism responsibility)
- Result management (Combobox/Autocomplete organism responsibility)

---

### Component Composition ✅

**Status**: Correctly composes atomic elements

**Composition Tree**:

```
InputDropmenuSearch (Molecule)
├── Icon (Atom) - Search icon
└── input (Native HTML element)
```

**Future Composition** (as documented in plan):

```
Combobox (Organism)
├── InputDropmenuSearch (Molecule) ← This component
└── Dropmenu (Organism)
    └── DropmenuItem[] (Molecules)
```

**Why This Works**:

- Clear hierarchy
- Each component has a single responsibility
- Composition enables flexibility without bloating individual components

---

## Accessibility Considerations

### Current Plan Status: NEEDS ENHANCEMENT ⚠️

**Missing Accessibility Patterns**:

1. **Input Type**:

```typescript
// ✅ ADD: Explicit type for search inputs
<input
  type="search" // Enables better mobile keyboards and browser features
  role="searchbox" // ARIA role for assistive technologies
  aria-label={ariaLabel ?? 'Search'}
  {...props}
/>
```

2. **Icon Accessibility**:

```typescript
// ✅ CORRECT: Decorative icon should be hidden
{showIcon && (
  <Icon
    icon={MagnifyingGlass}
    size={iconSize}
    color="muted"
    aria-hidden={true} // Icon is decorative, input has searchbox role
  />
)}
```

3. **Live Region for Search Results** (Parent Responsibility):

```typescript
// Future: Parent component should add
<div role="status" aria-live="polite" aria-atomic="true">
  {filteredResults.length} results found
</div>
```

**Recommended Props Addition**:

```typescript
export interface InputDropmenuSearchProps {
  // ... existing props
  /**
   * Accessible label for the search input
   * @default 'Search'
   */
  'aria-label'?: string;
}
```

---

## Performance Considerations

### Ref Forwarding ✅

**Status**: Plan implies correct pattern (referencing TextInput)

**Required Implementation**:

```typescript
export const InputDropmenuSearch = forwardRef<HTMLInputElement, InputDropmenuSearchProps>(
  ({ size = 'lg', showIcon = true, wrapperClassName, className, ...props }, ref) => {
    // ...
    return (
      <div className={cn(wrapperVariants({ size }), wrapperClassName)}>
        {showIcon && <Icon icon={MagnifyingGlass} size={iconSize} color="muted" aria-hidden />}
        <input
          ref={ref} // ✅ Forward ref for focus management
          type="search"
          role="searchbox"
          className={cn(inputVariants({ size }), className)}
          {...props}
        />
      </div>
    );
  }
);
```

**Why This Matters**:

- Parent components can focus the input programmatically
- Enables keyboard navigation patterns (e.g., "/" to focus search)
- Required for accessibility features

---

### Controlled vs Uncontrolled ✅

**Status**: Correctly designed as controlled component

**Pattern**:

```typescript
// ✅ CORRECT: No internal state, fully controlled
function ParentCombobox() {
  const [query, setQuery] = useState('');

  return (
    <InputDropmenuSearch
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
```

**Why This Is Correct**:

- Parent owns the search state
- Parent controls filtering logic
- Component remains purely presentational
- Easier to test and reason about

---

## Testing Strategy

### Unit Test Coverage ✅

**Status**: Plan includes comprehensive test strategy

**Recommended Test Organization** (from plan):

```typescript
describe('InputDropmenuSearch', () => {
  describe('Rendering', () => {
    it('renders with default props');
    it('renders as input element with type="search"');
    it('renders with placeholder');
    it('renders with value');
  });

  describe('Size variants', () => {
    it('applies LG size by default');
    it('applies SM size variant with correct styles');
    it('applies MD size variant with correct styles');
    it('wrapper has correct padding for each size');
    it('correct gap values for each size');
  });

  describe('Search icon', () => {
    it('shows search icon by default');
    it('hides search icon when showIcon=false');
    it('icon has correct size based on component size');
    it('icon has correct color styling');
    it('icon is aria-hidden'); // ADD THIS
  });

  describe('Ref forwarding', () => {
    it('forwards ref to input element');
    it('ref allows focus programmatically');
  });

  describe('Accessibility', () => {
    it('has role="searchbox"'); // ADD THIS
    it('has type="search"'); // ADD THIS
    it('accepts aria-label'); // ADD THIS
    it('icon is decorative (aria-hidden)'); // ADD THIS
  });
});
```

**Coverage Target**: >90% (as specified in plan)

---

### Storybook Documentation ✅

**Status**: Plan includes comprehensive Storybook requirements

**Recommended Stories** (from plan, with additions):

1. **Default** - Basic usage with placeholder
2. **AllSizes** - Comparison of sm, md, lg
3. **EmptyState** - Placeholder text
4. **FilledState** - Entered value
5. **AllCombinations** - Grid of size × filled combinations
6. **WithinDropmenu** - Real-world context ⭐ CRITICAL
7. **ControlledExample** - Demonstrates controlled pattern
8. **NoIcon** - Variant without search icon
9. **FocusedState** - Shows focus styling (ADD THIS)
10. **AccessibilityDemo** - Demonstrates ARIA attributes (ADD THIS)

**Critical Story - WithinDropmenu**:

```typescript
export const WithinDropmenu: Story = {
  render: () => (
    <div className="w-[320px] rounded-lg border border-border bg-background p-2 shadow-lg">
      <InputDropmenuSearch placeholder="Search countries..." />
      <div className="mt-2 space-y-1">
        <DropmenuItem label="United States" />
        <DropmenuItem label="United Kingdom" />
        <DropmenuItem label="Germany" />
      </div>
    </div>
  ),
};
```

**Why This Is Critical**: Shows the component in its intended context, validates visual integration with DropmenuItem.

---

## Scalability & Maintainability

### Future Extension Points ✅

**Plan Correctly Identifies**:

1. Integration with Combobox/Autocomplete organisms
2. Potential for clear (X) button
3. Loading state for async search
4. Keyboard navigation support

**Architectural Recommendation**: Keep component minimal now, extend through composition later:

```typescript
// Future: Combobox organism adds features without modifying InputDropmenuSearch
function Combobox({ options, onSearch }) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dropmenu>
      <div className="relative">
        <InputDropmenuSearch
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner size="sm" />
          </div>
        )}
      </div>
      {/* Filtered results */}
    </Dropmenu>
  );
}
```

**Why This Approach**:

- InputDropmenuSearch remains simple and focused
- Extensions added through composition, not prop bloat
- Each component maintains single responsibility

---

### Naming Conventions ✅

**Status**: Correct naming following project patterns

**Analysis**:

- `InputDropmenuSearch` - Clear, descriptive, follows `Input[Context][Purpose]` pattern
- Matches `TextInput`, `NumberInput`, `DropmenuItem` naming conventions
- Category placement: `inputs/` - Correct (input-related component)

**File Structure**:

```
src/ui/inputs/
├── input-dropmenu-search.tsx          ✅ Component
├── __tests__/input-dropmenu-search.test.tsx  ✅ Tests
src/stories/inputs/
├── input-dropmenu-search.stories.tsx  ✅ Stories
```

---

## Architectural Anti-Patterns Avoided ✅

### What This Plan Does RIGHT:

1. **No God Component**: Doesn't try to be a universal search input
2. **No Prop Drilling**: Parent controls state, component is presentational
3. **No Tight Coupling**: Doesn't depend on specific parent components
4. **No Over-Engineering**: Resists feature creep (no complex validation, no built-in filtering)
5. **No CSS-in-JS**: Uses CVA and Tailwind utilities
6. **No Magic Strings**: Uses semantic tokens and typed variants
7. **No Implicit Dependencies**: All dependencies (Icon, semantic tokens) are explicit

---

## Recommendations & Required Changes

### CRITICAL (Must Fix Before Implementation)

1. **DO NOT EXTEND TextInput** ⚠️
   - Build as standalone molecule with simplified feature set
   - Reference TextInput patterns but don't inherit/compose from it
   - Rationale: Different use case, simpler requirements

2. **ADD Size-to-Icon Mapping** ⚠️

   ```typescript
   const sizeToIconSize: Record<
     'sm' | 'md' | 'lg',
     NonNullable<IconVariants['size']>
   > = {
     sm: 'sm',
     md: 'sm',
     lg: 'sm',
   };
   ```

3. **SIMPLIFY Prop Interface** ⚠️
   - Remove: `leftAddOn`, `rightAddOn`, `error` (not needed for this use case)
   - Keep: `size`, `showIcon`, `wrapperClassName`, standard input props

4. **ADD Accessibility Props** ⚠️
   ```typescript
   type="search"
   role="searchbox"
   aria-label={ariaLabel ?? 'Search'}
   ```

### RECOMMENDED (Should Implement)

5. **ADD Icon Accessibility**

   ```typescript
   <Icon icon={MagnifyingGlass} aria-hidden={true} />
   ```

6. **UPDATE Test Coverage**
   - Add tests for `type="search"`, `role="searchbox"`, `aria-label`
   - Add tests for icon `aria-hidden`

7. **ADD Focused State Story**
   - Show focus styling in Storybook
   - Document focus behavior

8. **CLARIFY Border Styling**
   - Document that only bottom border is used
   - Explain rationale (dropdown context, minimal visual weight)

### NICE TO HAVE (Future Considerations)

9. **Document Integration Patterns**
   - Show example integration with Combobox
   - Show example integration with Autocomplete
   - Provide keyboard navigation guidance for parent components

10. **Consider Debounce Utility**
    - Not in component itself, but document pattern for parents:
    ```typescript
    const debouncedSearch = useDebouncedCallback(
      (value: string) => fetchResults(value),
      300
    );
    ```

---

## Final Verdict

### Architecture Score Breakdown

| Category                     | Score      | Weight   | Weighted Score |
| ---------------------------- | ---------- | -------- | -------------- |
| Atomic Design Classification | 10/10      | 10%      | 1.0            |
| Component Composition        | 7/10       | 20%      | 1.4            |
| CVA Pattern Alignment        | 10/10      | 15%      | 1.5            |
| Prop Interface Design        | 7/10       | 15%      | 1.05           |
| Semantic Token Usage         | 10/10      | 10%      | 1.0            |
| Accessibility                | 6/10       | 15%      | 0.9            |
| Testing Strategy             | 9/10       | 10%      | 0.9            |
| Scalability                  | 10/10      | 5%       | 0.5            |
| **TOTAL**                    | **8.5/10** | **100%** | **8.25/10**    |

### Recommendation

**APPROVED WITH MODIFICATIONS**

This is a well-architected component plan that demonstrates strong understanding of the sazonia-web design system. The component is correctly classified as a molecule, properly scoped, and follows established patterns.

**Before Implementation**:

1. ✅ Clarify that this is a **standalone** component (not extending TextInput)
2. ✅ Add size-to-icon mapping constant
3. ✅ Simplify prop interface (remove unnecessary props)
4. ✅ Add accessibility attributes (type="search", role="searchbox", aria-label)
5. ✅ Ensure icon is marked as decorative (aria-hidden)

**After Addressing These**:

- Component will be production-ready
- Architecture will be maintainable and scalable
- Accessibility will meet WCAG 2.1 AA standards
- Testing will be comprehensive

---

## Positive Patterns Observed

1. **Excellent Planning**: Comprehensive plan with clear user stories, acceptance criteria, and validation commands
2. **Design System Alignment**: Correct use of semantic tokens, CVA patterns, and barrel exports
3. **Atomic Design**: Proper classification and composition strategy
4. **Testing First**: Comprehensive test strategy defined upfront
5. **Documentation**: Thorough Storybook requirements with real-world examples
6. **Future-Proofing**: Considers future extensions without over-engineering now

---

## Related Components for Reference

- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/inputs/text-input.tsx` - CVA pattern, wrapper/input separation
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/inputs/dropmenu-item.tsx` - Size-to-icon mapping, dropdown context styling
- `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/src/ui/icons/icon.tsx` - Icon component usage, accessibility patterns

---

**Evaluation Complete** ✅

This component is architecturally sound and ready for implementation after addressing the critical modifications outlined above.
