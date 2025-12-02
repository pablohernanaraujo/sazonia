# UI: Multiselect

## Component Description

The Multiselect component is a form input that allows users to select multiple options from a dropdown list. Unlike a standard Select that allows only a single selection, Multiselect displays selected values as removable tags within the trigger area and provides a searchable dropdown with multi-selection capabilities. This component is essential for scenarios like tag selection, category filtering, multi-country selection, or any use case where users need to choose more than one option from a predefined list.

## User Story

As a **form user**
I want to **select multiple options from a dropdown and see my selections as removable tags**
So that **I can efficiently make and modify multi-value selections without navigating away from the form**

## Problem Statement

Forms often require users to select multiple values from a predefined list (e.g., selecting multiple countries, categories, or tags). The existing Select component only supports single selection. Users need a dedicated Multiselect component that:

- Displays selected values as easily removable tags
- Supports searching/filtering through options
- Provides clear visual feedback for selection state
- Handles various states (empty, selected, disabled, error)
- Works seamlessly with form validation

## Solution Statement

Create a comprehensive Multiselect component system using Radix UI Popover primitives combined with existing atoms (InputLabel, Hint, ErrorMessage, MultiselectContent). The component will follow the established dual-API pattern:

1. **Multiselect** (compound components) - For maximum flexibility and custom implementations
2. **MultiselectField** (wrapper) - For convenience in standard forms with automatic ARIA associations

The implementation will leverage the already-implemented `MultiselectContent` component (tags with X icons) and compose with `InputDropmenu` patterns for the dropdown options.

## Atomic Design Classification

**Component Type**: Organism

**Reasoning**: The Multiselect is a complex, self-contained UI component that:

- Combines multiple molecules (InputLabel + Input trigger + Dropdown + MultiselectContent)
- Has its own internal state management (open/closed, selected values)
- Provides complete user interaction patterns (click, keyboard navigation, filtering)
- Is reusable across different form contexts without modification

**Composition Requirements**:

- **Required Atoms**:
  - `Icon` from `@/ui/icons` - For chevron and clear icons
  - `TextSm`, `TextXs` from `@/ui/typography` - For text content

- **Required Molecules**:
  - `InputLabel` from `@/ui/inputs` - For field labels (in MultiselectField)
  - `Hint` from `@/ui/inputs` - For helper text (in MultiselectField)
  - `ErrorMessage` from `@/ui/inputs` - For validation errors (in MultiselectField)
  - `MultiselectContent` / `MultiselectTag` from `@/ui/inputs` - For displaying selected values
  - `DropmenuItem` from `@/ui/inputs` - For option items in dropdown
  - `InputDropmenuSearch` from `@/ui/inputs` - For search functionality
  - `InputDropmenuOptions` from `@/ui/inputs` - For scrollable options container

## Component Location

**Location**: `src/ui/inputs/multiselect.tsx`

**Category**: inputs

**Reasoning**: The Multiselect is a form input component that allows users to select values from options. It belongs in the `inputs` category alongside Select, TextInput, and other form input components. It follows the same patterns as the existing Select component.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/multiselect.tsx
export {
  Multiselect,
  MultiselectTrigger,
  MultiselectValue,
  MultiselectContent,
  MultiselectItem,
  multiselectTriggerVariants,
};
export type {
  MultiselectProps,
  MultiselectTriggerProps,
  MultiselectValueProps,
  MultiselectContentProps,
  MultiselectItemProps,
  MultiselectOption,
};

// 2. Create field wrapper: src/ui/inputs/multiselect-field.tsx
export { MultiselectField };
export type { MultiselectFieldProps };

// 3. Update category barrel: src/ui/inputs/index.ts
export * from './multiselect';
export * from './multiselect-field';

// 4. Import usage (recommended):
import { Multiselect, MultiselectField } from '@/ui';
import { Multiselect, MultiselectField } from '@/ui/inputs';
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/inputs/select.tsx`** (PRIMARY REFERENCE)
  - Same compound component pattern with context for size propagation
  - CVA variants for trigger, content, and items
  - Radix UI integration approach

- **`src/ui/inputs/select-field.tsx`** (FIELD WRAPPER REFERENCE)
  - Composition pattern with InputLabel, Hint, ErrorMessage
  - ARIA association patterns and ID generation
  - Size mapping from constants

- **`src/ui/inputs/multiselect-content.tsx`** (EXISTING - REUSE)
  - `MultiselectTag` component for removable tags
  - `MultiselectContent` for displaying selected items
  - Already implemented and tested

- **`src/ui/inputs/input-dropmenu.tsx`** (DROPDOWN REFERENCE)
  - `InputDropmenuContent` for dropdown container
  - `InputDropmenuOptions` for scrollable options
  - Size variants and context patterns

- **`src/ui/inputs/input-dropmenu-search.tsx`** (SEARCH REFERENCE)
  - Search input pattern for filtering options
  - Focus management within dropdown

- **`src/ui/inputs/dropmenu-item.tsx`** (OPTION ITEM REFERENCE)
  - Item styling with hover/focus states
  - Size variants matching other components

- **`src/ui/inputs/constants.ts`**
  - `INPUT_LABEL_SIZE_MAP` and `HINT_SIZE_MAP` for size consistency
  - `InputSize` type

- **`src/stories/inputs/select.stories.tsx`** (STORY REFERENCE)
  - Comprehensive story patterns including all states
  - Dual API documentation approach
  - Real-world examples

- **`src/stories/inputs/multiselect-content.stories.tsx`** (STORY REFERENCE)
  - Existing stories for MultiselectContent/Tag

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/multiselect.tsx` (REQUIRED)
   - Main Multiselect compound components

2. **Field wrapper file**: `src/ui/inputs/multiselect-field.tsx` (REQUIRED)
   - Convenience wrapper with label, hint, error

3. **Test file**: `src/ui/inputs/__tests__/multiselect.test.tsx` (REQUIRED)
   - Unit tests for Multiselect compound components

4. **Field test file**: `src/ui/inputs/__tests__/multiselect-field.test.tsx` (REQUIRED)
   - Unit tests for MultiselectField wrapper

5. **Story file**: `src/stories/inputs/multiselect.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
   - Comprehensive Storybook documentation

## Style & Design Requirements

### Responsive Design

Based on the Figma designs and existing Select patterns:

- **Desktop (lg: 1024px+)**: Required - Full component with all features
- **Tablet (md: 768px - 1023px)**: Required - Same as desktop, dropdown may adjust width
- **Mobile (< 768px)**: Required - Full-width triggers, dropdown uses `max-w-[calc(100vw-2rem)]`

### Design Assets

**Status**: Provided via Figma

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2014-140734&m=dev
- Component name in Figma: "Multiselect"

**Design Specifications from Figma**:

**Sizes** (matching Select):

- **SM**: 32px height (h-8), text-sm, py-1.5 px-3
- **MD**: 40px height (h-10), text-sm, py-2.5 px-3.5
- **LG**: 48px height (h-12), text-base, py-3 px-4 (default)

**States**:

- **Empty**: Placeholder text, default border
- **Hovered**: Border color change on hover
- **Focused/Open**: Primary border color (#3c61dd), dropdown visible
- **Selected**: Tags displayed within trigger
- **Typing-Selected-Open**: Search input active with tags visible
- **Disabled**: Gray background, muted text, no interaction
- **Disabled-Selected**: Shows tags but grayed out
- **Error**: Red border (#e60000), error styling
- **Error-Selected**: Shows tags with error border

**Visual Elements**:

- Trigger: White background, rounded-sm (6px), border
- Tags: Gray background (#f0f2f4), rounded-full, X icon to remove
- Dropdown: White background, border-border-secondary (#e6e8eb), shadow-lg
- Options: 48px height for LG, hover/focus background change
- Selected indicator: Left border accent (#3c61dd/info-500)
- Clear all icon (X): Appears when values selected
- Chevron icon: Down arrow, rotates when open

**Typography**:

- Label: Inter Medium, 16px (LG) / 14px (SM/MD)
- Placeholder: Inter Regular, text-text-tertiary
- Tags: Inter Medium, 14px
- Options: Inter Regular, 16px (LG) / 14px (SM/MD)
- Hint: Inter Regular, 14px, text-text-tertiary

**Spacing**:

- Label to trigger: 12px (LG) / 10px (SM/MD)
- Trigger to hint: 8px
- Tag gap: 4px
- Dropdown padding: 4px vertical
- Option padding: 12px vertical, 16px horizontal (LG)

## Storybook Stories

**Required**: Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/multiselect.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic Multiselect with placeholder
2. **Sizes Story**: SM, MD, LG comparison
3. **AllStates Story**: Empty, Selected, Disabled, Error in grid layout
4. **WithSearch Story**: Filterable options demonstration
5. **WithManyOptions Story**: Scrollable list with 50+ options
6. **FieldDefault Story**: MultiselectField basic usage
7. **FieldWithHint Story**: Field with hint text
8. **FieldWithError Story**: Field with error message
9. **FieldFullFeatured Story**: All features (required, icon, hint)
10. **ControlledVsUncontrolled Story**: Demonstrating both patterns
11. **MaxSelections Story**: Limiting number of selections
12. **CustomRenderOption Story**: Custom option rendering
13. **FormIntegration Story**: Real-world form example
14. **AllCombinations Story**: Grid of all size/state combinations

**Story Requirements**:

- Use `satisfies Meta<typeof MultiselectTrigger>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions
- Set `parameters.layout: 'centered'`
- Create interactive controls for configurable props
- Include JSDoc-style documentation explaining dual API

## Implementation Plan

### Phase 1: Foundation

1. **Create Multiselect context** for size propagation (similar to Select)
2. **Define CVA variants** for trigger, content, and items matching existing patterns
3. **Set up TypeScript interfaces** for all component props and options

### Phase 2: Core Implementation

1. **MultiselectTrigger** - The clickable area showing selected tags or placeholder
   - Uses Radix Popover.Trigger
   - Displays MultiselectTag components for selections
   - Shows clear-all button when items selected
   - Chevron icon that rotates on open

2. **MultiselectContent** - The dropdown container
   - Uses Radix Popover.Content with Portal
   - Contains search input and options
   - Handles keyboard navigation

3. **MultiselectItem** - Individual selectable option
   - Checkbox-style selection (can toggle)
   - Shows check mark when selected
   - Keyboard accessible

4. **MultiselectValue** - Displays placeholder or selection summary
   - Shows "X selected" or placeholder when closed with many items

5. **MultiselectField** - Convenience wrapper
   - Composes Multiselect with InputLabel, Hint, ErrorMessage
   - Automatic ID generation and ARIA associations

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add exports to `src/ui/inputs/index.ts`
- Export all components, variants, and types

**Storybook Documentation (REQUIRED):**

- Story file: `src/stories/inputs/multiselect.stories.tsx`
- All variant stories demonstrating sizes and states
- Interactive controls for all props
- Real-world usage examples (tag selection, country picker)
- Documentation of both compound components and field wrapper

## Step by Step Tasks

### Step 1: Create MultiselectContext

- Create `src/ui/inputs/multiselect-context.tsx` (if needed, or inline in multiselect.tsx)
- Define `MultiselectSize` type: `'sm' | 'md' | 'lg'`
- Create context provider for size propagation
- Create `useMultiselectSize()` hook

### Step 2: Define CVA Variants

- Create `multiselectTriggerVariants` matching Select trigger (size, variant, error)
- Create `multiselectContentVariants` for dropdown (size-based heights)
- Create `multiselectItemVariants` for options (matching DropmenuItem)
- Export variant types

### Step 3: Implement Multiselect Root Component

- Create `Multiselect` component as context provider
- Accept `size`, `value`, `onValueChange`, `disabled` props
- Use `@radix-ui/react-popover` for dropdown behavior
- Manage open/closed state internally

### Step 4: Implement MultiselectTrigger

- Create forwardRef component with CVA variants
- Display MultiselectTag components for selected values
- Show placeholder when no selections
- Include clear-all X button (appears when values exist)
- Include chevron icon with rotation animation
- Handle click to toggle dropdown
- Support keyboard navigation (Enter/Space to open)

### Step 5: Implement MultiselectSearch (Optional Internal Component)

- Reuse or adapt `InputDropmenuSearch` pattern
- Filter options based on search query
- Maintain focus within dropdown
- Clear search on close

### Step 6: Implement MultiselectContent

- Use Radix Popover.Content with Portal
- Apply CVA variants for sizing
- Include search input area
- Scrollable options container with custom scrollbar
- Animation classes for open/close

### Step 7: Implement MultiselectItem

- Checkbox-style toggle behavior (not radio)
- Visual indicator when selected (checkmark)
- Hover and focus states
- Keyboard accessible (Space/Enter to toggle)
- Support disabled state per item

### Step 8: Implement MultiselectValue

- Display component for trigger area
- Show placeholder when empty
- Show tag count summary when many selections
- Configurable max visible tags

### Step 9: Create MultiselectField Wrapper

- Create `src/ui/inputs/multiselect-field.tsx`
- Compose Multiselect with InputLabel, Hint, ErrorMessage
- Use `useId()` for automatic ARIA associations
- Map sizes using constants (INPUT_LABEL_SIZE_MAP, HINT_SIZE_MAP)
- Support controlled and uncontrolled patterns

### Step 10: Write Unit Tests for Multiselect

- Create `src/ui/inputs/__tests__/multiselect.test.tsx`
- Test rendering with placeholder
- Test selecting/deselecting items
- Test tag removal via X button
- Test clear all functionality
- Test search filtering
- Test keyboard navigation
- Test disabled state
- Test error state styling
- Test size variants
- Test max selections limit (if implemented)

### Step 11: Write Unit Tests for MultiselectField

- Create `src/ui/inputs/__tests__/multiselect-field.test.tsx`
- Test rendering with label
- Test hint text display
- Test error message display (replaces hint)
- Test ARIA associations
- Test disabled propagation
- Test all size variants

### Step 12: Update Barrel Exports

- Add `export * from './multiselect';` to `src/ui/inputs/index.ts`
- Add `export * from './multiselect-field';` to `src/ui/inputs/index.ts`
- Verify exports work via `import { Multiselect } from '@/ui/inputs'`

### Step 13: Create Storybook Stories

- Create `src/stories/inputs/multiselect.stories.tsx`
- Implement Default story
- Implement Sizes story (SM, MD, LG comparison)
- Implement AllStates story (grid of all states)
- Implement WithSearch story
- Implement WithManyOptions story
- Implement FieldDefault, FieldWithHint, FieldWithError stories
- Implement ControlledVsUncontrolled story
- Implement FormIntegration story
- Implement AllCombinations story
- Implement WhenToUseWhich story (Multiselect vs MultiselectField)

### Step 14: Run Validation Commands

Execute all validation commands to ensure zero regressions:

1. `npm run type-check`
2. `npm run lint`
3. `npm test -- multiselect`
4. `npm run test:run`
5. `npm run build`
6. `npm run build-storybook`

## Testing Strategy

### Unit Tests

**Multiselect Component Tests:**

- Renders with default placeholder
- Opens dropdown on trigger click
- Displays options in dropdown
- Selects item on click (adds tag)
- Deselects item on click (removes tag)
- Removes tag via X button
- Clears all selections via clear button
- Filters options based on search
- Closes dropdown on outside click
- Closes dropdown on Escape key
- Navigates options with arrow keys
- Selects focused option with Enter/Space
- Applies disabled state (no interaction)
- Applies error styling
- Renders correct size variants
- Forwards ref correctly

**MultiselectField Component Tests:**

- Renders label when provided
- Associates label with trigger (htmlFor)
- Renders hint text
- Renders error message (hides hint)
- Applies error styling to trigger when error present
- Sets aria-describedby correctly
- Sets aria-invalid when error present
- Maps sizes correctly (lg->md label, sm/md->sm label)
- Propagates disabled state

### Edge Cases

- Empty options array
- Single option selection
- Maximum selections limit
- Very long option labels (truncation)
- Very long tag labels (truncation in trigger)
- Many selected items (overflow handling)
- Search with no results
- Rapid selection/deselection
- Focus trap within dropdown
- Tab navigation behavior
- Screen reader announcements

## Acceptance Criteria

### Functional Requirements

- [ ] Multiselect opens dropdown on trigger click
- [ ] Options can be selected/deselected by clicking
- [ ] Selected items appear as removable tags in trigger
- [ ] Tags can be removed via X icon
- [ ] Clear all button removes all selections
- [ ] Search input filters options
- [ ] Keyboard navigation works (arrows, Enter, Escape)
- [ ] Component supports controlled mode (value/onValueChange)
- [ ] Component supports uncontrolled mode (defaultValue)
- [ ] Disabled state prevents all interaction
- [ ] Error state applies destructive border styling
- [ ] All three sizes (sm, md, lg) render correctly
- [ ] Component forwards refs correctly

### Testing Requirements

- [ ] Comprehensive unit tests with >90% coverage
- [ ] All edge cases tested
- [ ] All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- [ ] Storybook stories file created: `src/stories/inputs/multiselect.stories.tsx`
- [ ] Meta configuration with comprehensive argTypes
- [ ] Default story implemented
- [ ] ALL size stories implemented (SM, MD, LG)
- [ ] ALL state stories implemented (Empty, Selected, Disabled, Error)
- [ ] WithSearch story demonstrating filtering
- [ ] WithManyOptions story with scrollable list
- [ ] MultiselectField stories (Default, Hint, Error, FullFeatured)
- [ ] ControlledVsUncontrolled story
- [ ] FormIntegration real-world example
- [ ] AllCombinations comprehensive grid
- [ ] Interactive controls configured for all props
- [ ] Storybook builds successfully: `npm run build-storybook`
- [ ] All stories render correctly in Storybook UI

### Integration Requirements

- [ ] Exported through category barrel (`src/ui/inputs/index.ts`)
- [ ] Exported through root barrel (`src/ui/index.ts` - if exists)
- [ ] Component can be imported via `import { Multiselect } from '@/ui'`
- [ ] Component can be imported via `import { Multiselect } from '@/ui/inputs'`

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

3. **Run component tests**: `npm test -- multiselect`
   - Expected: All multiselect tests pass with >90% coverage
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

**All 6 commands MUST pass before the component is considered complete.**

## Notes

### Technical Decisions

1. **Radix UI Popover vs Custom Dropdown**: Using Radix Popover provides accessible dropdown behavior, focus management, and portal rendering out of the box.

2. **Reusing MultiselectContent**: The existing `MultiselectContent` and `MultiselectTag` components handle tag display and removal. The new Multiselect will compose with these rather than duplicating code.

3. **Search Integration**: The search functionality will be built into MultiselectContent similar to how InputDropmenuSearch works, allowing users to filter long option lists.

4. **State Management**: The component will support both controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) patterns, matching React form conventions.

### Future Considerations

- **Async Loading**: Future enhancement could support loading options asynchronously with loading states
- **Virtualization**: For very large option lists (1000+), consider integrating @tanstack/virtual
- **Groups**: Similar to SelectGroup, MultiselectGroup could organize options
- **Create New Option**: Allow users to create new options on-the-fly (combobox pattern)

### Dependencies

- `@radix-ui/react-popover` - For dropdown behavior
- `@phosphor-icons/react` - For icons (CaretDown, X, Check)
- `class-variance-authority` - For variant management
- Existing components from `@/ui/inputs` and `@/ui/icons`
