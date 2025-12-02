# Ui: Select

## Component Description

The Select component is a form input that allows users to choose a single option from a dropdown list of predefined options. It provides a trigger button that displays the current selection (or placeholder text) and reveals a dropdown menu with selectable options when clicked.

Based on the Figma design, the Select component supports:

- **Three sizes**: SM (32px height), MD (40px height), LG (48px height)
- **Two style variants**: Bordered (with border) and Borderless (minimal style)
- **Multiple states**: Empty, Hovered, Focused/Open, Selected, Disabled, Disabled+Selected, Error, Error+Selected
- **Optional elements**: Left text add-on, Label, Hint text, Error message
- **Dropdown content**: Scrollable list of options with proper positioning

## User Story

As a form user
I want to select a single option from a predefined list
So that I can quickly and accurately provide input without typing

## Problem Statement

Forms frequently require users to select from a set of predefined options (country, category, status, etc.). Without a proper Select component, developers must create custom dropdown implementations that may have inconsistent styling, accessibility issues, or poor user experience.

## Solution Statement

Create a composable Select system that:

1. Provides a styled trigger button that matches the design system's input components
2. Uses **Radix UI Select primitives** for the dropdown structure with styling that **mirrors** `InputDropmenuContent` (same border, shadow, max-height patterns) - NOT component reuse
3. **Composes `DropmenuItem`** for individual options (reuse, not duplicate) via Radix's `asChild` pattern
4. Uses Radix UI Select primitive for proper accessibility, keyboard navigation, and focus management
5. Supports all required states (empty, selected, disabled, error) and variants (bordered, borderless)
6. Works seamlessly with `InputLabel`, `Hint`, and `ErrorMessage` atoms for form integration

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: Select is a form control that composes multiple atoms (InputLabel, Hint, ErrorMessage, Icon) and interacts with other molecules (DropmenuItem). It's more complex than an atom but doesn't constitute a full organism as it's a single form field, not a collection of related fields.

**Composition Requirements**:

- **Required Atoms**:
  - `Icon` from `@/ui/icons` - For chevron indicator
  - `InputLabel` from `@/ui/inputs` - For the label
  - `Hint` from `@/ui/inputs` - For helper text
  - `ErrorMessage` from `@/ui/inputs` - For error states
  - Typography components from `@/ui/typography` - For text styling

- **Required Molecules**:
  - `DropmenuItem` from `@/ui/inputs` - **Directly composed** for individual options via Radix `asChild` pattern (NOT duplicated)

- **Styling Reference** (NOT component reuse):
  - `InputDropmenuContent` styling patterns - SelectContent **mirrors** the same visual styling (border, shadow, max-height) but uses Radix Select primitives

- **External Dependencies**:
  - `@radix-ui/react-select` - For accessible select primitive

## Component Relationship Diagram

```
Select (Radix Root)
├── SelectTrigger (styled wrapper with CVA)
│   ├── leftAddOn (optional text/icon slot)
│   ├── SelectValue (Radix primitive - placeholder/value)
│   └── Icon (CaretDown chevron)
├── SelectContent (styled portal - mirrors InputDropmenuContent styling)
│   ├── SelectViewport (scrollable container)
│   └── SelectItem (Radix Item + DropmenuItem composition)
│       └── DropmenuItem (reused molecule via asChild)

SelectField (convenience wrapper)
├── InputLabel (reused atom)
├── Select (above structure)
├── Hint (reused atom) — shown when no error
└── ErrorMessage (reused atom) — replaces Hint when error exists
```

**Key Architecture Decisions:**

- `SelectContent` **mirrors** `InputDropmenuContent` styling (same CVA patterns) but uses **Radix primitives**
- `SelectItem` **composes** `DropmenuItem` via `asChild` pattern - no duplication of styling code
- `SelectField` follows `TextInputField` convenience wrapper pattern

## Component Location

**Location**: `src/ui/inputs/select.tsx`

**Category**: `inputs`

**Reasoning**: The Select component is a form input control, similar to TextInput, NumberInput, and other input components already in the `inputs` category. It allows users to input data by selecting from options, making it semantically an input component.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/select.tsx
export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  selectTriggerVariants,
};
export type { SelectProps, SelectTriggerProps, SelectItemProps };

// 2. Create field wrapper: src/ui/inputs/select-field.tsx
export { SelectField };
export type { SelectFieldProps };

// 3. Update category barrel: src/ui/inputs/index.ts
export * from './select';
export * from './select-field'; // ⚠️ Don't forget SelectField export!

// 4. Import usage (recommended):
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectField,
} from '@/ui';

// 5. Import usage (alternative):
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectField,
} from '@/ui/inputs';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/inputs/text-input.tsx`** - Reference for:
  - CVA variant patterns for size and error states
  - Wrapper and inner element variant separation
  - Props interface structure with add-ons

- **`src/ui/inputs/input-label.tsx`** - Reference for:
  - Size variant mapping (sm/md)
  - Required indicator pattern
  - Help icon integration

- **`src/ui/inputs/hint.tsx`** - Reference for:
  - Size-based typography component selection
  - Spacing patterns (pt-2)

- **`src/ui/inputs/error-message.tsx`** - Reference for:
  - Error state styling
  - Icon integration with WarningCircle
  - Aria role="alert" pattern

- **`src/ui/inputs/dropmenu-item.tsx`** - Reference for:
  - Option item styling and states
  - Selected state visual treatment (blue border, brand background)
  - Size-based typography and spacing

- **`src/ui/inputs/input-dropmenu.tsx`** - Reference for **styling patterns only** (NOT component reuse):
  - Dropdown container styling (border, shadow, max-height)
  - Size-based height variants
  - Scrollable content area patterns
  - ⚠️ Note: SelectContent will **mirror** these styles but use Radix Select primitives

- **`src/ui/icons/icon.tsx`** - Reference for:
  - Icon component usage
  - Size and color prop patterns

- **`src/stories/inputs/text-input.stories.tsx`** - Reference for:
  - Story structure and organization
  - ArgTypes configuration
  - State demonstration patterns

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/select.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/select.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/select.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
4. **Field wrapper component**: `src/ui/inputs/select-field.tsx` (REQUIRED - convenience wrapper)
5. **Field wrapper test**: `src/ui/inputs/__tests__/select-field.test.tsx` (REQUIRED)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required? Yes - Full width or constrained by parent
- **Tablet (md: 768px - 1023px)**: Required? Yes - Same as desktop, full width behavior
- **Mobile (< 768px)**: Required? Yes - Full width, touch-friendly tap targets maintained by size variants

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2010-128764&m=dev
- Node ID: 2010:128764

**Design Specifications**:

#### Size Variants (Bordered)

| Size | Trigger Height | Vertical Padding | Horizontal Padding | Font Size | Line Height | Gap  |
| ---- | -------------- | ---------------- | ------------------ | --------- | ----------- | ---- |
| SM   | 32px           | 6px (py-1.5)     | 12px (px-3)        | 14px      | 20px        | 12px |
| MD   | 40px           | 10px (py-2.5)    | 14px (px-3.5)      | 14px      | 20px        | 12px |
| LG   | 48px           | 12px (py-3)      | 16px (px-4)        | 16px      | 24px        | 12px |

#### Size Variants (Borderless)

| Size | Trigger Height | Vertical Padding | Horizontal Padding | Font Size | Line Height |
| ---- | -------------- | ---------------- | ------------------ | --------- | ----------- |
| SM   | 32px           | 6px (py-1.5)     | 16px (px-4)        | 14px      | 20px        |
| MD   | 40px           | 10px (py-2.5)    | 16px (px-4)        | 14px      | 20px        |
| LG   | 48px           | 12px (py-3)      | 16px (px-4)        | 16px      | 24px        |

#### Colors from Design

| Element             | State    | Color Token                    |
| ------------------- | -------- | ------------------------------ |
| Trigger Border      | Default  | `border-border` (#d7dbdf)      |
| Trigger Border      | Hover    | `border-border-hover`          |
| Trigger Border      | Focus    | `border-primary` (#3c61dd)     |
| Trigger Border      | Error    | `border-destructive` (#e54d2e) |
| Trigger Background  | Default  | `bg-background` (#ffffff)      |
| Trigger Background  | Disabled | `bg-background-secondary`      |
| Placeholder Text    | All      | `text-text-tertiary` (#889096) |
| Selected Value Text | Default  | `text-text-primary` (#11181c)  |
| Chevron Icon        | Default  | `text-text-tertiary` (#c1c8cd) |
| Label Text          | Default  | `text-text-primary` (#11181c)  |
| Hint Text           | Default  | `text-text-tertiary` (#889096) |
| Error Text          | Error    | `text-destructive` (#e54d2e)   |

#### Border & Effects

- Border radius: `rounded-sm` (6px)
- Focus ring: `ring-2 ring-primary/20`
- Dropdown shadow: `shadow-lg`
- Dropdown border: `border border-border-secondary`

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/select.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic Select with placeholder
2. **Sizes Story**: Side-by-side comparison of SM, MD, LG sizes
3. **AllStates Story**: Grid showing all states (Empty, Hovered, Focused, Selected, Disabled, DisabledSelected, Error, ErrorSelected)
4. **BorderlessVariant Story**: Borderless style demonstration
5. **WithLeftAddOn Story**: Select with text prefix
6. **ManualComposition Story**: Using Select with InputLabel, Hint, ErrorMessage atoms
7. **SelectFieldStory**: Convenience wrapper with label, hint, error
8. **ControlledVsUncontrolled Story**: Demonstrating both patterns
9. **WithManyOptions Story**: Scroll behavior with 20+ options
10. **AllCombinations Story**: Comprehensive grid of all size/state/variant combinations

**Story Requirements**:

- Use `satisfies Meta<typeof SelectTrigger>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: "centered"` for trigger-focused stories
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. **Install Radix UI Select** - Add `@radix-ui/react-select` dependency
2. **Create base component structure** - Set up the compound component pattern following Radix conventions
3. **Define CVA variants** - Create selectTriggerVariants for size, variant (bordered/borderless), and error states

### Phase 2: Core Implementation

1. **SelectTrigger Component**:
   - Styled trigger button with size variants
   - Support for bordered and borderless styles
   - Left add-on slot for text prefix
   - Chevron icon (CaretDown from Phosphor)
   - All visual states (hover, focus, disabled, error)

2. **SelectContent Component** (⚠️ IMPORTANT: Mirror styling, don't reuse component):
   - Uses **Radix Select primitives** for the dropdown structure
   - **Mirrors styling** from `InputDropmenuContent` (same border, shadow, max-height)
   - Do NOT import/reuse `InputDropmenuContent` component
   - Animation for open/close
   - Viewport constraints for scrolling

   ```typescript
   // ✅ CORRECT: Mirror styling patterns
   const selectContentVariants = cva(
     'overflow-clip rounded-sm border border-border-secondary bg-background shadow-lg',
     {
       variants: {
         size: {
           sm: 'max-h-[240px] w-[320px] max-w-[calc(100vw-2rem)]',
           md: 'max-h-[288px] w-[320px] max-w-[calc(100vw-2rem)]',
           lg: 'max-h-[344px] w-[320px] max-w-[calc(100vw-2rem)]',
         },
       },
       defaultVariants: { size: 'lg' },
     }
   );

   // ❌ WRONG: Don't reuse InputDropmenu components
   <SelectContent asChild>
     <InputDropmenuContent>...</InputDropmenuContent>  // NO!
   </SelectContent>
   ```

3. **SelectItem Component** (⚠️ IMPORTANT: Compose, don't duplicate):
   - **Compose `DropmenuItem` directly** using Radix's `asChild` pattern
   - Do NOT recreate CVA variants - reuse DropmenuItem's styling
   - Selected state managed by Radix (`data-state="checked"`)
   - Proper focus styling for keyboard navigation

   ```typescript
   // ✅ CORRECT: Compose DropmenuItem
   export const SelectItem = forwardRef<...>(({ label, value, ...props }, ref) => (
     <SelectPrimitive.Item ref={ref} value={value} asChild>
       <DropmenuItem label={label} selected={/* from data-state */} />
     </SelectPrimitive.Item>
   ));

   // ❌ WRONG: Don't duplicate styling
   const selectItemVariants = cva(...); // NO! Use DropmenuItem
   ```

4. **SelectValue Component**:
   - Placeholder text handling
   - Selected value display

5. **Supporting Components**:
   - SelectGroup - For grouping options
   - SelectLabel - For group labels
   - SelectSeparator - For visual separation

6. **SelectField Wrapper**:
   - Convenience component combining Select with InputLabel, Hint, ErrorMessage
   - Auto-generated IDs for accessibility
   - Size mapping to label/hint sizes

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

Update `src/ui/inputs/index.ts`:

```typescript
export * from './select';
export * from './select-field';
```

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/inputs/select.stories.tsx`
- All variant stories demonstrating size and style options
- Interactive controls for size, variant, error, disabled props
- Real-world usage examples (country selector, category picker)
- Comparison stories showing all combinations

## Step by Step Tasks

### 1. Install Dependencies

- Install `@radix-ui/react-select`:
  ```bash
  npm install @radix-ui/react-select
  ```
- Verify installation in package.json

### 2. Create SelectTrigger CVA Variants

- Create `selectTriggerVariants` with:
  - `size`: sm, md, lg (matching TextInput patterns)
  - `variant`: bordered (default), borderless
  - `error`: true, false
- Create `selectTriggerTextVariants` for value/placeholder text sizing

### 3. Create Select Component (`src/ui/inputs/select.tsx`)

- Implement compound components:
  - `Select` (root with context)
  - `SelectTrigger` (styled button with CVA variants)
  - `SelectValue` (placeholder/value display)
  - `SelectContent` (dropdown container)
  - `SelectViewport` (scrollable area)
  - `SelectItem` (individual options)
  - `SelectGroup`, `SelectLabel`, `SelectSeparator`
- Forward refs for all components
- Add proper TypeScript interfaces

### 4. Implement SelectTrigger States

- Default state with border-border
- Hover state with border-border-hover
- Focus state with border-primary and ring
- Disabled state with bg-background-secondary
- Error state with border-destructive

### 5. Implement SelectContent Styling

- Position with Radix portal
- Shadow and border styling
- Max-height with scroll
- Animation for enter/exit

### 6. Implement SelectItem Styling

- Match DropmenuItem patterns
- Selected indicator (checkmark)
- Focus visible ring
- Disabled styling

### 7. Create SelectField Wrapper (`src/ui/inputs/select-field.tsx`)

- Props: label, hint, error, required, showIcon, size
- Size mapping: sm/md → sm label, lg → md label
- Conditional hint vs error rendering
- Auto-generated IDs for aria associations

### 8. Create Unit Tests (`src/ui/inputs/__tests__/select.test.tsx`)

Test coverage for:

- Renders with placeholder
- Opens on click
- Selects option on click
- Keyboard navigation (arrow keys, enter, escape)
- Disabled state prevents interaction
- Error state applies correct styling
- All size variants render correctly
- Borderless variant renders correctly
- Left add-on renders
- Controlled value updates
- Accessibility: aria-expanded, aria-selected, role="listbox"

### 9. Create SelectField Unit Tests (`src/ui/inputs/__tests__/select-field.test.tsx`)

Test coverage for:

- Renders with label
- Renders with hint
- Renders error instead of hint when provided
- Required indicator shows
- Size variants apply correct label size

### 10. Create Storybook Stories (`src/stories/inputs/select.stories.tsx`)

- Default story
- Sizes comparison
- All states grid
- Borderless variant
- With left add-on
- Manual composition
- SelectField convenience wrapper
- Controlled vs uncontrolled
- Many options with scroll
- All combinations grid

### 11. Update Barrel Exports

Update `src/ui/inputs/index.ts`:

```typescript
export * from './select';
export * from './select-field';
```

### 12. Run Validation Commands

Execute all validation commands to ensure zero regressions.

## Testing Strategy

### Unit Tests

**SelectTrigger Tests**:

- Renders placeholder when no value
- Renders selected value when provided
- Applies size variant classes correctly
- Applies borderless variant correctly
- Applies error state styling
- Disabled state prevents focus
- Chevron icon renders
- Left add-on renders when provided

**Select Interaction Tests**:

- Opens dropdown on trigger click
- Closes dropdown on outside click
- Closes dropdown on Escape key
- Selects item on click
- Selects item on Enter key
- Arrow keys navigate options
- Tab moves focus appropriately
- Selected item has aria-selected="true"

**SelectContent Tests**:

- Renders in portal
- Applies max-height and scroll
- Position follows trigger

**SelectItem Tests**:

- Renders label text
- Shows check icon when selected
- Applies disabled styling
- Focus visible ring works

**SelectField Tests**:

- Renders InputLabel with correct props
- Renders Hint when provided
- Renders ErrorMessage when error provided
- Error replaces hint
- Associates label with trigger via htmlFor
- Associates hint/error via aria-describedby

### Edge Cases

- Empty options array
- Very long option text (truncation)
- Many options (50+) scroll behavior
- Rapid open/close interactions
- Value that doesn't match any option
- Programmatic value changes
- Form reset behavior
- Mobile touch interactions
- Focus trap within dropdown
- Screen reader announcements

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/inputs/` with proper TypeScript types
- ✅ All three size variants (sm, md, lg) work correctly
- ✅ Both style variants (bordered, borderless) work correctly
- ✅ All states render correctly: empty, selected, disabled, disabled+selected, error, error+selected
- ✅ Component forwards refs correctly
- ✅ Keyboard navigation works: Arrow keys, Enter, Escape, Tab
- ✅ Left add-on slot works
- ✅ Controlled and uncontrolled usage patterns work
- ✅ Integrates with InputLabel, Hint, ErrorMessage atoms

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions
- ✅ Accessibility tests for ARIA attributes and keyboard navigation

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/select.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **ALL size variant stories implemented (SM, MD, LG)**
- ✅ **ALL style variant stories implemented (Bordered, Borderless)**
- ✅ **ALL state stories implemented (Empty, Hovered, Focused, Selected, Disabled, Error)**
- ✅ **SelectField wrapper stories**
- ✅ **Real-world examples (minimum 2-3 practical usage scenarios)**
- ✅ **Comparison story showing all variants together**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { Select, SelectTrigger } from '@/ui'`

### Code Quality

- ✅ Zero TypeScript errors: `npm run type-check`
- ✅ Zero ESLint warnings: `npm run lint`
- ✅ Build succeeds: `npm run build`

## Validation Commands

⚠️ **CRITICAL**: Execute EVERY command below. All must pass with zero errors.

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- select`
   - Expected: All Select and SelectField tests pass with >90% coverage
   - Validates: Component functionality and edge cases

4. **Run full test suite**: `npm run test:run`
   - Expected: All tests pass with zero regressions
   - Validates: No breaking changes to existing components

5. **Build verification**: `npm run build`
   - Expected: Build completes successfully
   - Validates: Production bundle compatibility

6. **Storybook build** (REQUIRED): `npm run build-storybook`
   - Expected: Storybook builds successfully, all stories compile
   - Validates: Visual documentation is complete and error-free
   - Verify: Stories appear in build output with correct paths

**All 6 commands MUST pass before the component is considered complete.**

## Notes

### Design Decisions

1. **Radix UI Select vs Custom Implementation**: Using Radix UI Select provides:
   - Full keyboard navigation out of the box
   - Proper ARIA attributes and announcements
   - Focus management and trapping
   - Positioning logic for dropdown (portal-based)
   - Scrolling behavior for long lists
   - **Why not custom?** Building accessible select is complex - Radix handles edge cases (screen readers, mobile, RTL) that custom implementations often miss.

2. **Compound Component Pattern**: Following Radix's compound component pattern allows maximum flexibility while maintaining proper encapsulation. Users can compose Select, SelectTrigger, SelectContent, and SelectItem as needed.

3. **SelectContent: Mirror Styling, Not Component Reuse**:
   - ✅ `SelectContent` **mirrors** the visual styling of `InputDropmenuContent` (same border, shadow, max-height patterns)
   - ❌ `SelectContent` does **NOT** reuse `InputDropmenuContent` as a component
   - **Why?** Different primitives - InputDropmenu is standalone, Select uses Radix's portal-based positioning. Reusing the component would conflict with Radix's internal structure.

4. **SelectItem: Compose DropmenuItem via asChild**:
   - ✅ `SelectItem` **composes** `DropmenuItem` using Radix's `asChild` pattern
   - ❌ `SelectItem` does **NOT** duplicate `DropmenuItem`'s CVA variants
   - **Why?** Single source of truth for option styling. Changes to DropmenuItem automatically apply to SelectItem. Avoids code duplication and ensures visual consistency.

5. **Reuse of Existing Atoms**: The implementation leverages existing atoms (InputLabel, Hint, ErrorMessage, Icon) and styling patterns (from TextInput) to ensure consistency across the design system.

6. **Borderless Variant**: The borderless variant is useful for inline selection scenarios where the Select should blend into the surrounding UI without a visible border.

7. **Left Add-On Slot**: Included for API consistency with TextInput, even though less common for Select. Useful for currency symbols, icons, or text prefixes.

### Future Considerations

1. **Multi-Select**: The current plan is for single-select only. Multi-select would require a different component (likely using Radix Checkbox + Popover pattern).

2. **Searchable Select (Combobox)**: For searchable dropdowns, a separate Combobox component using `@radix-ui/react-combobox` would be more appropriate.

3. **Async Loading**: For options loaded from an API, consider adding loading state support in a future iteration.

4. **Custom Render Function**: Consider adding renderOption prop for custom option rendering (e.g., with avatars) in future versions.

### Dependencies Added

- `@radix-ui/react-select` - Required for accessible select primitive

### Reference Architecture: TextInput Parallelism

The Select component mirrors the TextInput architectural approach for consistency:

```
TextInput Architecture:
├── textInputWrapperVariants (CVA)
│   ├── size: sm/md/lg
│   └── error: true/false
├── textInputVariants (CVA - inner element)
│   └── size: sm/md/lg
└── Props
    ├── leftAddOn
    ├── rightAddOn
    └── wrapperClassName

TextInputField (Convenience Wrapper):
├── InputLabel
├── TextInput
├── Hint
└── ErrorMessage
```

```
Select Architecture (follows same pattern):
├── selectTriggerVariants (CVA)
│   ├── size: sm/md/lg
│   ├── variant: bordered/borderless
│   └── error: true/false
├── selectContentVariants (CVA - mirrors InputDropmenuContent)
│   └── size: sm/md/lg
├── SelectItem (Radix + DropmenuItem composition)
│   └── Reuses DropmenuItem styling
└── Props
    └── leftAddOn (optional)

SelectField (Convenience Wrapper - same pattern):
├── InputLabel
├── Select
├── Hint
└── ErrorMessage
```

This parallelism ensures:

- ✅ Consistent developer experience across input components
- ✅ Predictable API surface
- ✅ Maintainable codebase

---

**Architectural Evaluation Score:** 94.25/100 - APPROVED ✅
**Evaluation Date:** 2025-11-30
**Status:** Ready for implementation with clarifications applied
