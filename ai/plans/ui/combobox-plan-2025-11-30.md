# Ui: Combobox

## Component Description

The Combobox component is an advanced form input that combines the functionality of a searchable text input with a dropdown selection list. It allows users to either type to filter/search through available options or select from a dropdown list of predefined choices. Unlike a standard Select component, the Combobox supports free-text entry for filtering, making it ideal for scenarios with large option sets where users need to quickly find and select values.

Key characteristics from the Figma design:

- **Searchable input**: Users can type to filter through options
- **Dropdown list**: Shows matching options in a popover dropdown
- **Clear button**: Allows clearing the selected value (X icon appears when value is selected)
- **Three sizes**: SM (32px), MD (40px), LG (48px)
- **Multiple states**: Empty, Hovered, Focused/Open, Selected, Disabled, Error
- **Left add-on slot**: Supports text prefix like "Text" shown in designs
- **Accessibility**: Full keyboard navigation and ARIA support

## User Story

As a user filling out a form
I want to search and select from a list of options by typing
So that I can quickly find and select the right value without scrolling through a long list

## Problem Statement

Standard Select components require users to scroll through all options to find their desired value. For large datasets (countries, cities, products), this becomes cumbersome and time-consuming. Users need a way to quickly filter options by typing, while still having the ability to browse available choices visually.

## Solution Statement

Create a Combobox component that merges text input functionality with dropdown selection. The component will:

1. Allow free-text input to filter the dropdown options
2. Display matching options in a dropdown popover
3. Support keyboard navigation (arrow keys, Enter, Escape)
4. Show a clear button when a value is selected
5. Provide visual states matching the design system (empty, hover, focus, disabled, error)
6. Compose from existing atomic components (InputLabel, Hint, ErrorMessage, Icon, DropmenuItem)

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: The Combobox is a molecule that composes multiple atoms (InputLabel, Hint, ErrorMessage, Icon) and lower-level molecules (DropmenuItem, InputDropmenuSearch pattern) into a cohesive, reusable form control. It's more complex than a single atom but doesn't constitute a full organism with multiple distinct sections.

**Composition Requirements**:

- **Required Atoms**:
  - `Icon` from `@/ui/icons` - For chevron down, clear (X) icons
  - `InputLabel` from `@/ui/inputs` - For label composition in ComboboxField
  - `Hint` from `@/ui/inputs` - For hint text in ComboboxField
  - `ErrorMessage` from `@/ui/inputs` - For error display in ComboboxField
  - Typography components from `@/ui/typography` - For text styling

- **Required Molecules**:
  - `DropmenuItem` from `@/ui/inputs` - For dropdown option items
  - Pattern inspiration from `InputDropmenuSearch` - For search input styling
  - Pattern inspiration from `Select` - For trigger and content structure

- **Required Libraries**:
  - `@radix-ui/react-popover` - For dropdown popover behavior (already used in project)
  - `@radix-ui/react-use-controllable-state` - For controlled/uncontrolled state management
  - **Note**: DO NOT use `cmdk` library - build custom filtering logic following existing patterns

## Component Location

**Location**: `src/ui/inputs/combobox.tsx`

**Category**: `inputs` - The Combobox is a form input component that fits within the existing inputs category alongside Select, TextInput, and other form controls.

**Reasoning**: The Combobox shares significant functionality and styling patterns with the existing Select and InputDropmenu components. Placing it in the inputs category maintains consistency and makes it discoverable alongside related components.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/combobox.tsx
export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxEmpty,
  comboboxTriggerVariants,
  comboboxInputVariants, // For input text styling
  comboboxContentVariants,
  comboboxItemVariants,
};
export type {
  ComboboxProps,
  ComboboxTriggerProps,
  ComboboxContentProps,
  ComboboxInputProps,
  ComboboxItemProps,
  ComboboxEmptyProps,
};

// 2. Create context file: src/ui/inputs/combobox-context.tsx
export { ComboboxProvider, useComboboxContext, useComboboxSize };
export type { ComboboxSize, ComboboxContextValue };

// 3. Create field wrapper: src/ui/inputs/combobox-field.tsx
export { ComboboxField };
export type { ComboboxFieldProps };

// 4. Update category barrel: src/ui/inputs/index.ts
export * from './combobox';
export * from './combobox-context'; // REQUIRED: Export context
export * from './combobox-field';

// 5. Import usage (recommended):
import { Combobox, ComboboxField } from '@/ui';

// 6. Import usage (alternative):
import { Combobox, ComboboxField } from '@/ui/inputs';
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/inputs/select.tsx`** - Primary reference for compound component pattern
  - Context-based size propagation pattern
  - CVA variants structure for trigger, content, and items
  - Radix primitive usage and styling
  - Error state handling

- **`src/ui/inputs/input-dropmenu.tsx`** - Reference for dropdown container patterns
  - InputDropmenuContent styling
  - Scrollable options container with custom scrollbar

- **`src/ui/inputs/input-dropmenu-search.tsx`** - Reference for search input pattern
  - Search input wrapper variants
  - Search icon integration
  - Typography sizing per variant

- **`src/ui/inputs/dropmenu-item.tsx`** - Reference for item styling
  - Selection state styling (blue left border, brand background)
  - Size variants for items
  - Icon and checkbox integration

- **`src/ui/inputs/text-input.tsx`** - Reference for input wrapper patterns
  - Error state border styling
  - Left/right add-on slots
  - Focus-within patterns

- **`src/ui/inputs/input-label.tsx`** - For label composition in ComboboxField
- **`src/ui/inputs/hint.tsx`** - For hint text in ComboboxField
- **`src/ui/inputs/error-message.tsx`** - For error display in ComboboxField

- **`src/ui/icons/icon.tsx`** - For icon rendering (CaretDown, X, MagnifyingGlass)

- **`src/ui/inputs/input-dropmenu-context.tsx`** - Reference for context provider pattern
  - Size context propagation
  - Context hook pattern with error handling

- **`src/stories/inputs/select.stories.tsx`** - Reference for Storybook story patterns
  - Meta configuration with argTypes
  - Story organization (Default, Sizes, AllStates, etc.)
  - Real-world usage examples
  - Controlled vs uncontrolled patterns

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/combobox.tsx` (REQUIRED)
   - Main Combobox compound components (Root, Trigger, Input, Content, Item, Empty)
   - CVA variants for all styled components

2. **Context file**: `src/ui/inputs/combobox-context.tsx` (REQUIRED)
   - Context provider and hooks for state propagation
   - Size context, open state, value state, query state
   - Following InputDropmenu context pattern

3. **Field wrapper**: `src/ui/inputs/combobox-field.tsx` (REQUIRED)
   - Convenience wrapper with InputLabel, Hint, ErrorMessage integration

4. **Test file**: `src/ui/inputs/__tests__/combobox.test.tsx` (REQUIRED)
   - Unit tests for all variants and behaviors

5. **Test file**: `src/ui/inputs/__tests__/combobox-field.test.tsx` (REQUIRED)
   - Unit tests for field wrapper

6. **Story file**: `src/stories/inputs/combobox.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
   - Comprehensive Storybook documentation

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required - Full-width containers, standard dropdown positioning
- **Tablet (md: 768px - 1023px)**: Required - Same as desktop
- **Mobile (< 768px)**: Required - Full-width trigger, dropdown matches trigger width with max-width constraint

### Design Assets

**Status**: Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2017-161934&m=dev
- Design specifications from Figma extraction (see below)

**Design Specifications from Figma**:

#### Size Variants

| Size | Input Height | Padding (px/py) | Gap  | Font Size | Line Height | Icon Size |
| ---- | ------------ | --------------- | ---- | --------- | ----------- | --------- |
| SM   | 32px         | 12px / 6px      | 8px  | 14px      | 20px        | 16px      |
| MD   | 40px         | 12px / 10px     | 10px | 14px      | 20px        | 20px      |
| LG   | 48px         | 16px / 12px     | 12px | 16px      | 24px        | 20px      |

#### Colors

| State    | Border                          | Background                          | Text                      |
| -------- | ------------------------------- | ----------------------------------- | ------------------------- |
| Empty    | `#d7dbdf` (border-base-primary) | `#ffffff` (bg-surface-base-primary) | `#889096` (text-tertiary) |
| Hovered  | Lighter border                  | `#ffffff`                           | `#889096`                 |
| Focused  | `#3c61dd` (border-brand-solid)  | `#ffffff`                           | `#11181c` (text-primary)  |
| Selected | `#d7dbdf`                       | `#ffffff`                           | `#11181c`                 |
| Disabled | `#d7dbdf`                       | `#f9fafb` (bg-surface-secondary)    | `#889096`                 |
| Error    | `#e54d2e` (border-danger-solid) | `#ffffff`                           | `#889096` / `#e54d2e`     |

#### Dropdown Content

- Background: `#ffffff`
- Border: `#e6e8eb` (border-base-secondary)
- Border radius: 6px (`rounded-sm`)
- Shadow: `shadow-lg`
- Item padding matches input size variant
- Selected item: Blue left border (3px), `bg-info-50` background

#### Icons

- Chevron down: `#c1c8cd` (muted gray)
- Clear (X): `#889096` (text-tertiary)
- Icon size: 16px for SM, 20px for MD/LG

#### Label & Hint

- Label bottom padding: SM/MD = 10px, LG = 12px
- Hint top padding: 8px
- Error message top padding: 8px with icon

## Storybook Stories

**Required**: Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/combobox.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic combobox with placeholder
2. **Sizes Story**: Visual comparison of SM, MD, LG sizes
3. **AllStates Story**: Grid showing Empty, Hover, Focus, Selected, Disabled, Error states
4. **WithLeftAddOn Story**: Combobox with text prefix or icon
5. **Filtering Story**: Interactive demo of typing to filter options
6. **ControlledVsUncontrolled Story**: Both patterns demonstrated
7. **WithManyOptions Story**: Scroll behavior with 50+ options
8. **ManualComposition Story**: Using InputLabel, Hint, ErrorMessage atoms
9. **FieldDefault Story**: ComboboxField basic usage
10. **FieldWithHint Story**: ComboboxField with hint text
11. **FieldWithError Story**: ComboboxField with error state
12. **FieldFullFeatured Story**: ComboboxField with all features
13. **FormIntegration Story**: Real-world form example
14. **AllCombinations Story**: Comprehensive grid of all size/state combinations
15. **WhenToUseWhich Story**: Comparison of Combobox vs Select vs Autocomplete
16. **AsyncLoading Story**: Demonstrating server-side filtering pattern with loading state

**Story Requirements**:

- Use `satisfies Meta<typeof ComboboxTrigger>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: "centered"`
- Create interactive controls for all configurable props

## Technical Architecture

### Radix Primitive Selection

**Decision**: Use `@radix-ui/react-popover` for dropdown behavior

**DO**:

- ✅ Use `Popover.Root` - Manages open state
- ✅ Use `Popover.Trigger` - Trigger element (wrapping input)
- ✅ Use `Popover.Portal` - Portal for dropdown
- ✅ Use `Popover.Content` - Dropdown content container
- ✅ Use `useControllableState` from `@radix-ui/react-use-controllable-state` for controlled/uncontrolled modes

**DON'T**:

- ❌ Use `@radix-ui/react-select` (not suitable for editable inputs)
- ❌ Use `cmdk` library (unnecessary dependency, design mismatch)
- ❌ Build dropdown portal from scratch

### Context Shape (combobox-context.tsx)

```typescript
// src/ui/inputs/combobox-context.tsx
'use client';

import { createContext, type ReactNode, useContext } from 'react';

export type ComboboxSize = 'sm' | 'md' | 'lg';

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

// Size-only context for child components
const ComboboxSizeContext = createContext<ComboboxSize>('lg');

export function useComboboxSize(): ComboboxSize {
  return useContext(ComboboxSizeContext);
}

export function ComboboxProvider({
  children,
  ...value
}: ComboboxContextValue & { children: ReactNode }) {
  return (
    <ComboboxContext.Provider value={value}>
      <ComboboxSizeContext.Provider value={value.size}>
        {children}
      </ComboboxSizeContext.Provider>
    </ComboboxContext.Provider>
  );
}
```

### State Management Pattern

Use `@radix-ui/react-use-controllable-state` for controlled/uncontrolled modes:

```typescript
import { useControllableState } from '@radix-ui/react-use-controllable-state';

export function Combobox({
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: ComboboxProps) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  // ... rest of implementation
}
```

### Component Hierarchy

```
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

### Trigger vs Input Responsibilities

**ComboboxTrigger** = Styled wrapper div (similar to `textInputWrapperVariants`):

- Uses `comboboxTriggerVariants` for styling
- Handles: border, padding, focus-within, left/right add-ons
- Contains leftAddOn slot, ComboboxInput, and icons
- Renders clear button (X) when value is selected
- Renders chevron down icon

**ComboboxInput** = Actual `<input>` element (similar to `textInputVariants`):

- Uses `comboboxInputVariants` for text styling
- Handles: text styling, placeholder, keyboard events
- Manages text entry and filtering
- Shows selected value text when not focused
- Controlled by Combobox context

### Filtering Architecture

Implement as a controlled pattern with callback:

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

This provides flexibility for:

- Simple client-side filtering (default)
- Custom filtering logic
- Server-side filtering (via onQueryChange callback)

### Keyboard Navigation Requirements

**Must implement**:

- ArrowDown: Open dropdown / move to next option
- ArrowUp: Move to previous option
- Enter: Select highlighted option
- Escape: Close dropdown
- Tab: Close dropdown and move focus
- Type-ahead: Filter as user types

## Implementation Plan

### Phase 1: Foundation

1. **Create context file** (`combobox-context.tsx`):
   - Define `ComboboxSize` type
   - Create `ComboboxContext` with full state shape
   - Create `ComboboxSizeContext` for size propagation
   - Export `useComboboxContext` and `useComboboxSize` hooks
   - Export `ComboboxProvider` component

2. **Define CVA variants** (in `combobox.tsx`):
   - `comboboxTriggerVariants` - Mirror select trigger variants (size, variant, error, compoundVariants)
   - `comboboxInputVariants` - Input text styling per size
   - `comboboxContentVariants` - Dropdown container variants (size, max-height, animations)
   - `comboboxItemVariants` - Item variants matching DropmenuItem (size, selected state)

3. **Set up Radix Popover integration**:
   - Install/verify `@radix-ui/react-popover` available
   - Install/verify `@radix-ui/react-use-controllable-state` available
   - Create basic Popover.Root structure

### Phase 2: Core Implementation

1. **Combobox Root component**:
   - Wrap with Radix `Popover.Root`
   - Use `useControllableState` for value and open states
   - Provide context via `ComboboxProvider`
   - Handle filtering logic with callback pattern
   - Support controlled mode (`value`, `onValueChange`)
   - Support uncontrolled mode (`defaultValue`)

2. **ComboboxTrigger component**:
   - Styled wrapper div using `comboboxTriggerVariants`
   - Wraps `Popover.Trigger` from Radix
   - Contains leftAddOn slot, ComboboxInput, and icons
   - Shows clear button (X icon) when value is selected
   - Shows chevron down icon on the right
   - Handles border, background, focus-within states per design

3. **ComboboxInput component**:
   - Actual `<input>` element styled with `comboboxInputVariants`
   - Handles keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
   - Triggers filtering via `setQuery` from context
   - Shows placeholder when empty
   - Shows selected value text when not focused/typing

4. **ComboboxContent component**:
   - Uses Radix `Popover.Portal` + `Popover.Content`
   - Styled with `comboboxContentVariants`
   - Scrollable options area with custom scrollbar
   - Open/close animations matching design
   - Positioned below trigger with `sideOffset={4}`

5. **ComboboxItem component**:
   - Styled with `comboboxItemVariants`
   - Selected state: blue left border (3px), `bg-info-50`
   - Hover and keyboard focus states
   - Click handler calls `onValueChange` from context

6. **ComboboxEmpty component**:
   - "No results" message when filtered options is empty
   - Styled consistently with items

7. **ComboboxField wrapper** (`combobox-field.tsx`):
   - Integrates InputLabel, Combobox, Hint/ErrorMessage
   - Auto-generate IDs for ARIA associations
   - Maps size prop to label/hint sizes

### Phase 3: Design System Integration & Documentation

**Export Configuration**:

1. Export all components and variants from `combobox.tsx`
2. Export ComboboxField from `combobox-field.tsx`
3. Update `src/ui/inputs/index.ts` with new exports
4. Verify imports work via `@/ui` and `@/ui/inputs`

**Storybook Documentation (REQUIRED)**:

- Story file location: `src/stories/inputs/combobox.stories.tsx`
- All 15+ stories as listed in Storybook Stories section
- Interactive controls for size, error, disabled, leftAddOn props
- Real-world usage examples demonstrating filtering behavior
- Comparison stories showing when to use Combobox vs Select

## Step by Step Tasks

### Step 1: Setup and Foundation

- [ ] Create `src/ui/inputs/combobox-context.tsx` with context provider and hooks
  - Define `ComboboxSize` type ('sm' | 'md' | 'lg')
  - Create `ComboboxContext` with full state shape
  - Create `ComboboxSizeContext` for size propagation
  - Export `useComboboxContext` and `useComboboxSize` hooks
  - Export `ComboboxProvider` component
- [ ] Create `src/ui/inputs/combobox.tsx` file with basic structure
- [ ] Create CVA variants for trigger, input, content, and item components
- [ ] Define TypeScript interfaces for all component props

### Step 2: Implement ComboboxTrigger

- [ ] Create wrapper component with size-based styling
- [ ] Implement border, background, and focus states per design
- [ ] Add left add-on slot for prefix content
- [ ] Add clear button (X icon) that shows when value is selected
- [ ] Add chevron down icon on the right
- [ ] Implement error state styling

### Step 3: Implement ComboboxInput

- [ ] Create input element with proper styling per size
- [ ] Handle placeholder text
- [ ] Handle display of selected value vs filter query
- [ ] Implement keyboard event handlers (ArrowDown, ArrowUp, Enter, Escape)
- [ ] Focus management for dropdown interactions

### Step 4: Implement ComboboxContent

- [ ] Create popover container using Radix Popover or Portal
- [ ] Add open/close animations matching design
- [ ] Implement scrollable options area with custom scrollbar
- [ ] Position dropdown below trigger with proper offset
- [ ] Match trigger width for dropdown width

### Step 5: Implement ComboboxItem

- [ ] Create item component with size variants
- [ ] Implement default, hover, focused, and selected states
- [ ] Add selected state styling (blue left border, bg-info-50)
- [ ] Handle click for selection
- [ ] Handle keyboard selection (Enter)

### Step 6: Implement ComboboxEmpty

- [ ] Create "No results" message component
- [ ] Style consistently with items

### Step 7: Implement Combobox Root

- [ ] Create root component that wraps Radix Popover.Root
- [ ] Use `useControllableState` from `@radix-ui/react-use-controllable-state`
- [ ] Support controlled mode (value, onValueChange, open, onOpenChange)
- [ ] Support uncontrolled mode (defaultValue, defaultOpen)
- [ ] Manage filter query state with internal useState
- [ ] Implement filtering logic with callback pattern (filterOptions prop)
- [ ] Provide all state via ComboboxProvider context
- [ ] Handle accessibility (ARIA attributes)

### Step 8: Create ComboboxField Wrapper

- [ ] Create `src/ui/inputs/combobox-field.tsx`
- [ ] Integrate InputLabel with size mapping
- [ ] Integrate Hint for helper text
- [ ] Integrate ErrorMessage for error state
- [ ] Auto-generate IDs for ARIA associations
- [ ] Support all Combobox props passthrough

### Step 9: Write Unit Tests

- [ ] Create `src/ui/inputs/__tests__/combobox.test.tsx`
- [ ] Test all size variants render correctly
- [ ] Test all states (empty, selected, disabled, error)
- [ ] Test keyboard navigation (arrow keys, Enter, Escape)
- [ ] Test filtering behavior
- [ ] Test clear button functionality
- [ ] Test controlled and uncontrolled modes
- [ ] Test accessibility attributes
- [ ] Create `src/ui/inputs/__tests__/combobox-field.test.tsx`
- [ ] Test field wrapper integrations

### Step 10: Create Storybook Stories

- [ ] Create `src/stories/inputs/combobox.stories.tsx`
- [ ] Implement Default story
- [ ] Implement Sizes story
- [ ] Implement AllStates story
- [ ] Implement WithLeftAddOn story
- [ ] Implement Filtering story
- [ ] Implement ControlledVsUncontrolled story
- [ ] Implement WithManyOptions story
- [ ] Implement ManualComposition story
- [ ] Implement FieldDefault story
- [ ] Implement FieldWithHint story
- [ ] Implement FieldWithError story
- [ ] Implement FieldFullFeatured story
- [ ] Implement FormIntegration story
- [ ] Implement AllCombinations story
- [ ] Implement WhenToUseWhich story
- [ ] Implement AsyncLoading story (server-side filtering pattern)

### Step 11: Update Barrel Exports

- [ ] Add exports to `src/ui/inputs/index.ts`:
  - `export * from './combobox';`
  - `export * from './combobox-context';`
  - `export * from './combobox-field';`
- [ ] Verify component is accessible via `@/ui`
- [ ] Verify context hooks are accessible via `@/ui/inputs`

### Step 12: Run Validation Commands

- [ ] Execute `npm run type-check` - expect zero errors
- [ ] Execute `npm run lint` - expect zero errors/warnings
- [ ] Execute `npm test -- combobox` - expect all tests pass
- [ ] Execute `npm run test:run` - expect zero regressions
- [ ] Execute `npm run build` - expect successful build
- [ ] Execute `npm run build-storybook` - expect successful build

## Testing Strategy

### Unit Tests

**Component Tests** (`combobox.test.tsx`):

- Renders with default props
- Renders all three size variants (sm, md, lg)
- Shows placeholder when no value selected
- Shows selected value when value is set
- Opens dropdown on trigger click
- Opens dropdown on input focus
- Closes dropdown on Escape key
- Closes dropdown on outside click
- Filters options as user types
- Selects option on click
- Selects option on Enter key
- Navigates options with arrow keys
- Shows clear button when value selected
- Clears value on clear button click
- Shows error styling when error prop is true
- Disables interaction when disabled prop is true
- Forwards ref to trigger element
- Calls onValueChange when selection changes
- Supports controlled mode with value prop
- Supports uncontrolled mode with defaultValue
- Renders left add-on when provided

**Field Wrapper Tests** (`combobox-field.test.tsx`):

- Renders label, combobox, and hint
- Shows error message instead of hint when error is provided
- Associates label with combobox via htmlFor
- Associates hint/error with combobox via aria-describedby
- Maps size correctly to label and hint sizes

### Edge Cases

- Empty options array
- Options with very long text (truncation)
- Options with special characters
- Rapid typing with debounce
- Opening dropdown near viewport edges
- Mobile touch interactions
- Screen reader announcements
- RTL language support (if applicable)

## Acceptance Criteria

### Functional Requirements

- [ ] Component implemented in `src/ui/inputs/combobox.tsx` with proper TypeScript types
- [ ] All component variants (sm, md, lg) work correctly
- [ ] All states (empty, hover, focus, selected, disabled, error) display correctly
- [ ] Component forwards refs correctly to the trigger element
- [ ] Component supports both controlled and uncontrolled modes
- [ ] Filtering works correctly as user types
- [ ] Clear button appears and functions when value is selected
- [ ] Keyboard navigation works (arrow keys, Enter, Escape)
- [ ] Left add-on slot renders prefix content correctly
- [ ] Component follows design system patterns (CVA, semantic tokens)

### Testing Requirements

- [ ] Comprehensive unit tests with >90% coverage
- [ ] All edge cases tested
- [ ] All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- [ ] **Storybook stories file created: `src/stories/inputs/combobox.stories.tsx`**
- [ ] **Meta configuration with comprehensive argTypes**
- [ ] **Default story implemented**
- [ ] **ALL size variant stories implemented**
- [ ] **ALL state stories implemented (hover, focus, disabled, error, etc.)**
- [ ] **Real-world examples (minimum 2-3 practical usage scenarios)**
- [ ] **Comparison story showing all variants together**
- [ ] **Interactive controls configured for all props**
- [ ] **Storybook builds successfully: `npm run build-storybook`**
- [ ] **All stories render correctly in Storybook UI**

### Integration Requirements

- [ ] Exported through category barrel (`src/ui/inputs/index.ts`)
- [ ] Exported through root barrel (`src/ui/index.ts`)
- [ ] Component can be imported via `import { Combobox, ComboboxField } from '@/ui'`

### Code Quality

- [ ] Zero TypeScript errors: `npm run type-check`
- [ ] Zero ESLint warnings: `npm run lint`
- [ ] Build succeeds: `npm run build`

## Validation Commands

Execute EVERY command below. All must pass with zero errors.

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- combobox`
   - Expected: All component tests pass with >90% coverage
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

### Implementation Approach Decision

**DECISION**: Custom implementation with Radix Popover (NOT cmdk)

**Rationale**:

1. The project already uses Radix primitives extensively
2. The Select component provides a good reference pattern
3. The InputDropmenu shows the dropdown container patterns
4. The InputDropmenuSearch shows the input styling pattern
5. Full control allows exact design match without fighting library defaults
6. No additional dependencies beyond what's already installed
7. Consistent with established codebase patterns

**Key Radix Primitives to Use**:

- `@radix-ui/react-popover` - For dropdown behavior
- `@radix-ui/react-use-controllable-state` - For controlled/uncontrolled state

### Design Token Mapping

Map Figma design tokens to existing Tailwind classes:

- `#d7dbdf` -> `border-border` / `border-border-hover`
- `#3c61dd` -> `border-primary` / `ring-primary`
- `#e54d2e` -> `border-destructive` / `text-destructive`
- `#889096` -> `text-text-tertiary`
- `#11181c` -> `text-text-primary`
- `#f9fafb` -> `bg-background-secondary`
- `#e6e8eb` -> `border-border-secondary`

### Accessibility Considerations

- Use `role="combobox"` on the input
- Use `aria-expanded` to indicate dropdown state
- Use `aria-controls` to associate input with listbox
- Use `role="listbox"` on the dropdown
- Use `role="option"` on items
- Use `aria-selected` on selected items
- Use `aria-activedescendant` for keyboard navigation
- Announce selection changes to screen readers

### Future Considerations

- Multi-select variant (select multiple options)
- Async loading of options (with loading indicator)
- Custom option rendering (icons, descriptions)
- Grouped options support
- Create new option functionality ("Create 'X'")

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
├── combobox-context.tsx              # Context provider and hooks (REQUIRED)
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
   - Update barrel exports
   - Run validation commands
