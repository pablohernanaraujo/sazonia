# Ui: MultiselectContent

## Component Description

The MultiselectContent component displays selected items in a multiselect input as removable tags or badges. It provides visual representation of selected options with the ability to remove individual selections. This component is essential for multiselect form controls where users need to see their current selections clearly and have the ability to manage them.

The component supports two display variants:

1. **Tags**: Pill-shaped elements with neutral gray background, label text, and an X (close) icon for removal. Tags wrap to multiple rows when space is limited.
2. **Badges**: Compact elements with brand/primary background and white text, without close icons (suitable for read-only display).

## User Story

As a form user
I want to see my selected options clearly displayed as removable tags
So that I can review and modify my selections easily without reopening the dropdown

## Problem Statement

When users select multiple options from a dropdown, they need clear visual feedback of their selections. Without a dedicated component to display these selections, users may struggle to:

- See all their current selections at a glance
- Remove individual selections without navigating back to the dropdown
- Understand the relationship between displayed tags and available options

## Solution Statement

Create a MultiselectContent component that:

- Displays selected items as removable tags or static badges
- Supports multiple rows for many selections (wrapping behavior)
- Provides clear removal interaction via X icon on tags
- Uses consistent styling aligned with the design system
- Integrates seamlessly with Select, Combobox, and Input components

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: MultiselectContent is a molecule because it combines multiple atoms (Typography for labels, Icon for close button) into a functional unit that represents selected values. It does not stand alone as a complete input but serves as a building block for organisms like Multiselect or Combobox.

**Composition Requirements**:

- **Required Atoms**:
  - `Typography` from `@/ui/typography` - For tag/badge label text (TextSm, TextXs)
  - `Icon` from `@/ui/icons` - For the X (close) icon on removable tags
- **Required Libraries**:
  - `@phosphor-icons/react` - X icon for close functionality (XmarkSmall or X)
  - `class-variance-authority` - For variant management

## Component Location

**Location**: `src/ui/inputs/multiselect-content.tsx`

**Category**: inputs

**Reasoning**: This component is directly related to input functionality, specifically for multiselect form controls. It lives alongside other input-related components like `dropmenu-item.tsx`, `select.tsx`, and `input-dropmenu.tsx`. The inputs category contains all form-related UI components in this design system.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/multiselect-content.tsx
export {
  MultiselectContent,
  MultiselectTag,
  MultiselectBadge,
  multiselectContentVariants,
  multiselectTagVariants,
  multiselectBadgeVariants,
};
export type {
  MultiselectContentProps,
  MultiselectTagProps,
  MultiselectBadgeProps,
  MultiselectItem,
};

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './multiselect-content';

// 3. Root barrel already exports from inputs: src/ui/index.ts
// (No changes needed if inputs is already exported)

// 4. Import usage (recommended):
import { MultiselectContent, MultiselectTag } from '@/ui';

// 5. Import usage (alternative):
import { MultiselectContent } from '@/ui/inputs';
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/inputs/dropmenu-item.tsx`** - Similar CVA pattern with size variants, good reference for styling approach and TypeScript types
- **`src/ui/icons/icon.tsx`** - Icon component wrapper for Phosphor icons, used for close button
- **`src/ui/typography/text.tsx`** - Typography components for label text (TextSm, TextXs)
- **`src/stories/inputs/dropmenu-item.stories.tsx`** - Comprehensive story structure reference with variants, states, and real-world examples
- **`src/lib/utils.ts`** - cn() utility for class merging

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/multiselect-content.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/multiselect-content.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/multiselect-content.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
4. **Update barrel**: `src/ui/inputs/index.ts` (add export)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required - Default layout with horizontal tag arrangement
- **Tablet (md: 768px - 1023px)**: Required - Same behavior, may wrap earlier
- **Mobile (< 768px)**: Required - Tags wrap naturally to multiple rows

The component uses flexbox with `flex-wrap` to handle responsive behavior automatically.

### Design Assets

**Status**: Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=4519-230839&m=dev
- Screenshots: Visual reference captured from Figma

**Design Specifications from Figma**:

**Tags Variant (removable)**:

- Background: `bg-background-tertiary` (#f0f2f4)
- Border radius: `rounded-full` (999px)
- Padding: `px-2 py-0.5` (8px horizontal, 2px vertical)
- Gap between label and icon: `gap-1` (4px)
- Gap between tags: `gap-1` (4px)
- Font: Inter Medium, 14px, leading-5 (text-sm/medium)
- Text color: `text-text-primary` (#11181c)
- Close icon: 16px X icon, same text color

**Badges Variant (non-removable)**:

- Background: `bg-primary-500` (#3c61dd brand blue) - **Note: Use explicit shade, not `bg-primary`**
- Border radius: `rounded-sm` (6px)
- Padding: `px-1.5 py-0.5` (6px horizontal, 2px vertical)
- Font: Inter Medium, 12px, leading-[18px] (text-xs/medium)
- Text color: `text-white` (#ffffff)
- No close icon

**Layout (Multiple tags)**:

- Gap between tags: `gap-1` (4px)
- Row gap for wrapping: `gap-1.5` (6px) - based on 6 tags example showing multi-row

**Size Variants** (CVA pattern):

- **SM size**:
  - Tags: `px-1.5 py-0.5` with TextXs (12px font)
  - Badges: `px-1 py-0.5` with TextXs (12px font)
- **MD size** (default):
  - Tags: `px-2 py-0.5` with TextSm (14px font)
  - Badges: `px-1.5 py-0.5` with TextXs (12px font)

**Truncation Support** (for long labels):

- Add `max-w-full` to prevent layout breaking
- Optional `truncate` variant for text-overflow: ellipsis

## Storybook Stories

**Required**: Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/multiselect-content.stories.tsx`

**Required Stories**:

1. **Default Story**: MultiselectContent with 2 tags (default state)
2. **Variant Stories**:
   - Tags variant (removable) - default
   - Badges variant (non-removable)
3. **Count Stories**:
   - Single tag/badge
   - Two tags (default)
   - Three tags
   - Six tags (multi-row)
   - Many tags (overflow scenario)
4. **State Stories**:
   - Default
   - With removal handler
   - Disabled (non-interactive)
5. **Size Stories** (if applicable):
   - SM (smaller text)
   - MD (default)
6. **Real-world Examples**:
   - Country multiselect
   - Skills/tags selector
   - User assignment selector
   - Category filter
7. **Comparison Stories**:
   - All variants side by side
   - Tags vs Badges comparison

**Story Requirements**:

- Use `satisfies Meta<typeof MultiselectContent>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: 'centered'`
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. **Research existing patterns**: Review `dropmenu-item.tsx` for CVA patterns and `icon.tsx` for Phosphor icon usage
2. **Define types**: Create TypeScript interfaces for props and item data structure
3. **Set up CVA variants**: Define variants for display type (tags/badges), size, and states

### Phase 2: Core Implementation

1. **Create MultiselectTag sub-component**:
   - Renders individual removable tag
   - Accepts label, value, onRemove callback
   - Uses Typography (TextSm) + Icon (X)
   - Handles click on X for removal

2. **Create MultiselectBadge sub-component**:
   - Renders non-removable badge
   - Accepts label
   - Uses Typography (TextXs)
   - No interaction handlers

3. **Create MultiselectContent container**:
   - Renders collection of tags or badges
   - Accepts items array with labels and values
   - Handles layout with flex-wrap
   - Delegates removal to onRemove callback

4. **Implement accessibility**:
   - ARIA attributes: `role="option"`, `aria-selected={true}`
   - **MultiselectTag**: Add `aria-label={`Remove ${label}`}` to remove button
   - **MultiselectBadge**: Add `aria-readonly={true}` to indicate non-interactive
   - Keyboard support for removal (Enter/Space on X)
   - Focus management with `tabIndex` handling for disabled state
   - Icon marked as `aria-hidden` (decorative)

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Export component, variants, and types from `multiselect-content.tsx`
- Update `src/ui/inputs/index.ts` to include new exports
- Verify imports work via `@/ui` and `@/ui/inputs`

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/inputs/multiselect-content.stories.tsx`
- Create all variant stories (tags, badges)
- Create count stories (1, 2, 3, 6, many items)
- Configure argTypes for items, variant, size, onRemove
- Create real-world examples (country selector, skills picker)
- Add responsive behavior demonstration

## Step by Step Tasks

### 1. Set Up Foundation

- Read existing `dropmenu-item.tsx` to understand CVA patterns
- Read existing `icon.tsx` to understand Phosphor icon usage
- Review `text.tsx` for Typography components

### 2. Create Type Definitions

- Define `MultiselectItem` interface with label, value, and optional disabled
- Define `MultiselectTagProps` for individual tag
- Define `MultiselectBadgeProps` for individual badge
- Define `MultiselectContentProps` for container

### 3. Implement CVA Variants

- Create `multiselectTagVariants` with size variants (sm/md):
  ```typescript
  const multiselectTagVariants = cva(
    'flex max-w-full items-center gap-1 rounded-full bg-background-tertiary transition-colors',
    {
      variants: {
        size: {
          sm: 'px-1.5 py-0.5',
          md: 'px-2 py-0.5',
        },
        truncate: {
          true: '',
          false: '',
        },
      },
      defaultVariants: { size: 'md', truncate: false },
    }
  );
  ```
- Create `multiselectBadgeVariants` with size variants (sm/md):
  ```typescript
  const multiselectBadgeVariants = cva(
    'bg-primary-500 flex items-center rounded-sm text-white transition-colors',
    {
      variants: {
        size: {
          sm: 'px-1 py-0.5',
          md: 'px-1.5 py-0.5',
        },
      },
      defaultVariants: { size: 'md' },
    }
  );
  ```
- Create `multiselectContentVariants` for container layout

### 4. Build MultiselectTag Component

- Create forwardRef component accepting label, value, size, truncate, onRemove, disabled
- Implement layout: label text + X icon button
- Apply styling: bg-background-tertiary, rounded-full, padding based on size variant
- Use conditional Typography: `size === 'sm' ? TextXs : TextSm`
- Add click handler for X icon
- Add keyboard support (Enter/Space)
- **Enhanced ARIA attributes**:
  - Container: `role="option"`, `aria-selected={true}`, `aria-disabled={disabled}`
  - Remove button: `type="button"`, `aria-label={\`Remove ${label}\`}`, `disabled={disabled}`
  - Icon: `aria-hidden` (decorative)
- Add `tabIndex={disabled ? -1 : 0}` for focus management
- Add focus-visible styles on remove button: `focus-visible:ring-2 focus-visible:ring-border-brand`

### 5. Build MultiselectBadge Component

- Create forwardRef component accepting label, size
- Apply styling: `bg-primary-500`, rounded-sm, padding based on size variant, text-white
- Use TextXs for label (badges are always compact)
- No interaction handlers needed
- **Enhanced ARIA attributes**:
  - `role="option"`
  - `aria-selected={true}`
  - `aria-readonly={true}` - **indicates non-interactive badge**

### 6. Build MultiselectContent Container

- Create forwardRef component accepting items array, variant, onRemove
- Implement flex container with gap-1 and flex-wrap
- Conditionally render Tag or Badge based on variant
- Pass onRemove callback to tags
- Add container ARIA attributes

### 7. Create Unit Tests

- Test MultiselectTag rendering with label
- Test MultiselectTag click handler triggers onRemove
- Test MultiselectTag keyboard accessibility (Enter/Space)
- Test MultiselectTag size variants (sm/md)
- Test MultiselectTag truncate variant
- Test MultiselectBadge rendering with label
- Test MultiselectBadge size variants (sm/md)
- Test MultiselectContent renders correct number of items
- Test MultiselectContent with tags variant
- Test MultiselectContent with badges variant
- Test empty state handling
- Test disabled state
- **Test enhanced ARIA attributes**:
  - MultiselectTag: `aria-label` on remove button
  - MultiselectBadge: `aria-readonly={true}`
  - Both: `role="option"`, `aria-selected`

### 8. Create Storybook Stories (REQUIRED)

- Create meta configuration with argTypes
- Create Default story
- Create Tags variant story
- Create Badges variant story
- Create single/multiple item count stories
- Create size variant stories (SM, MD)
- Create truncation story (long labels)
- Create state stories (default, disabled)
- Create real-world examples (country selector, skills picker)
- Create comparison story showing all variants

### 9. Update Barrel Exports

- Add export to `src/ui/inputs/index.ts`
- Verify import from `@/ui/inputs` works
- Verify import from `@/ui` works

### 10. Run Validation Commands

- Execute `npm run type-check` - expect zero errors
- Execute `npm run lint` - expect zero warnings
- Execute `npm test -- multiselect-content` - expect all tests pass
- Execute `npm run test:run` - expect zero regressions
- Execute `npm run build` - expect success
- Execute `npm run build-storybook` - expect success

## Testing Strategy

### Unit Tests

- **MultiselectTag**:
  - Renders with label text
  - Calls onRemove with value when X clicked
  - Handles keyboard navigation (Enter/Space on X)
  - Applies disabled styles when disabled
  - Has correct ARIA attributes (`role="option"`, `aria-selected`)
  - Remove button has `aria-label="Remove {label}"` (accessibility enhancement)
  - Supports size variants (sm/md)
  - Supports truncation for long labels

- **MultiselectBadge**:
  - Renders with label text
  - Does not render close button
  - Has correct ARIA attributes (`role="option"`, `aria-selected`, `aria-readonly`)
  - Supports size variants (sm/md)

- **MultiselectContent**:
  - Renders empty state gracefully
  - Renders correct number of items
  - Renders tags when variant="tags"
  - Renders badges when variant="badges"
  - Passes onRemove callback to children
  - Wraps items correctly in multi-row layout

### Edge Cases

- Empty items array (should render nothing or placeholder)
- Single item (should render without gap issues)
- Very long label text (should truncate or handle gracefully)
- Many items (20+) should wrap correctly
- Rapid removal clicks (debouncing if needed)
- Disabled items within the collection
- Mixed enabled/disabled items

## Acceptance Criteria

### Functional Requirements

- MultiselectContent implemented in `src/ui/inputs/` with proper TypeScript types
- All component variants work correctly (tags, badges)
- Component forwards refs correctly
- onRemove callback fires with correct value when X clicked
- Component follows design system patterns (CVA, polymorphic components, semantic tokens)
- Tags wrap to multiple rows when container is narrow

### Testing Requirements

- Comprehensive unit tests with >90% coverage
- All edge cases tested
- All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- Storybook stories file created: `src/stories/inputs/multiselect-content.stories.tsx`
- Meta configuration with comprehensive argTypes
- Default story implemented
- ALL variant stories implemented (tags, badges)
- Count stories implemented (1, 2, 3, 6 items)
- Real-world examples (minimum 2-3 practical usage scenarios)
- Comparison story showing all variants together
- Interactive controls configured for all props
- Storybook builds successfully: `npm run build-storybook`
- All stories render correctly in Storybook UI

### Integration Requirements

- Exported through category barrel (`src/ui/inputs/index.ts`)
- Exported through root barrel (`src/ui/index.ts`)
- Component can be imported via `import { MultiselectContent } from '@/ui'`

### Code Quality

- Zero TypeScript errors: `npm run type-check`
- Zero ESLint warnings: `npm run lint`
- Build succeeds: `npm run build`

## Validation Commands

**CRITICAL**: Execute EVERY command below. All must pass with zero errors.

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- multiselect-content`
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

### Sub-components vs Single Component

The implementation includes three related components:

1. `MultiselectTag` - Individual removable tag (can be used standalone)
2. `MultiselectBadge` - Individual non-removable badge (can be used standalone)
3. `MultiselectContent` - Container that renders collection of tags/badges

This approach allows flexibility for consumers to use either the container or individual items.

### Relationship to Multiselect Input

This component is designed to be used within a future Multiselect input component. The `MultiselectContent` renders the selected values area, while the full Multiselect would combine this with:

- An input trigger
- A dropdown (InputDropmenu)
- State management for selections

### Icon Choice

Use the X icon from Phosphor Icons (`@phosphor-icons/react`). The specific icon should be:

- `X` with weight="light" - for a subtle, clean close action
- Size: 16px (size-4) to match the design

### Color Tokens

Ensure using the correct semantic color tokens:

- `bg-background-tertiary` for tag background (not raw gray values)
- `text-text-primary` for tag text
- `bg-primary-500` for badge background (explicit brand blue shade) - **NOT `bg-primary`**
- `text-white` for badge text

### Future Considerations

- Consider adding a `maxVisibleTags` prop to limit displayed tags with "+N more" indicator
- Consider adding animation for tag addition/removal
- May need to integrate with form libraries (react-hook-form) in the future

---

## Architectural Evaluation Integration

**Evaluation Score: 9.2/10** ✅

The following recommendations from the architectural evaluation have been integrated into this plan:

### P1 - High Priority (Applied)

1. **Color Token Shading**: Changed `bg-primary` to `bg-primary-500` for explicit brand blue shade
2. **Enhanced Accessibility Labels**:
   - Added `aria-label={\`Remove ${label}\`}` to remove button in MultiselectTag
   - Added `aria-readonly={true}` to MultiselectBadge
   - Added `aria-hidden` to decorative icons
   - Added `tabIndex` handling for disabled state

### P2 - Medium Priority (Applied)

3. **Size Variants**: Added detailed CVA specifications for sm/md sizes:
   - Tags: sm (px-1.5 py-0.5, TextXs) / md (px-2 py-0.5, TextSm)
   - Badges: sm (px-1 py-0.5) / md (px-1.5 py-0.5)
4. **Truncation Support**: Added `max-w-full` and optional `truncate` variant for long labels

### P3 - Future Enhancements (Documented)

5. Enter/exit animations (documented in Future Considerations)
6. `maxVisibleTags` prop (documented in Future Considerations)

### Validation Checklist from Evaluation

- [x] Atomic design classification correct (Molecule)
- [x] Component location appropriate (`src/ui/inputs/`)
- [x] Uses explicit color shade (`bg-primary-500`)
- [x] Enhanced accessibility labels specified
- [x] Size variants documented (sm/md)
- [x] Truncation support specified
- [x] CVA pattern with detailed examples
- [x] Testing strategy includes new variants
- [x] Storybook stories include size and truncation variants

**Source**: `ai/agents/evaluations/multiselect-content-plan-2025-11-30.md`
