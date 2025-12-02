# UI: CalendarDay

## Component Description

The CalendarDay component is a foundational building block for calendar and date picker interfaces. It represents an individual day cell within a calendar grid, supporting multiple visual states and day types to provide rich date selection experiences.

The component handles:

- **Day Types**: Default days, today indicator, previous/next month days (grayed out), day-of-week headers (Mo, Tu, etc.), and empty placeholder cells
- **Interactive States**: Default, hovered, selected, disabled, and multi-selection states (start, center, end of range)
- **Visual Feedback**: Clear distinction between current month, adjacent month days, today's date (brand-colored text), and selected states

This component is essential for building date pickers, calendar views, booking systems, and any date-related UI that requires selecting or displaying individual dates.

## User Story

As a **developer building date-related features**
I want to **have a reusable calendar day component with comprehensive state management**
So that **I can quickly build consistent, accessible date pickers and calendar views across the application**

## Problem Statement

The application lacks a standardized calendar day component for building date selection interfaces. Without this atomic component, developers would need to repeatedly implement day cells with various states, leading to inconsistent styling, accessibility gaps, and duplicated code across different calendar implementations.

## Solution Statement

Create a CalendarDay component as an atom in the design system that:

1. Implements all visual variants from the Glow UI Figma design
2. Uses CVA for type-safe variant management
3. Supports comprehensive state handling (hover, selected, disabled, multi-select)
4. Provides proper accessibility attributes
5. Is composable for building higher-level calendar components

## Atomic Design Classification

**Component Type**: Atom

**Reasoning**: CalendarDay is a fundamental, indivisible UI element that displays a single day within a calendar. It has no dependencies on other UI components - it only contains text and styling. It serves as the basic building block that will be composed into molecules (CalendarWeek) and organisms (Calendar, DatePicker).

**Composition Requirements**:

- **Status**: ✅ Base atom - no composition dependencies

The CalendarDay component:

- Uses only native HTML elements (`<button>`, `<div>`, `<span>`)
- Does not require Typography components (text is minimal - 1-2 characters)
- Does not require Icon components
- Is designed to be composed INTO higher-level components (CalendarWeek, CalendarMonth, DatePicker)

## Component Location

**Location**: `src/ui/inputs/calendar-day.tsx`

**Category**: `inputs`

**Reasoning**: The CalendarDay component belongs in the `inputs` category because:

1. It's primarily used for date input/selection functionality
2. It will be composed into DatePicker and DateRangePicker inputs
3. Other form-related input components already exist in this category (TextInput, NumberInput)
4. Calendar components are fundamentally input mechanisms for date selection

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/calendar-day.tsx
export { CalendarDay, calendarDayVariants };
export type { CalendarDayProps, CalendarDayType, CalendarDayState };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './calendar-day';

// 3. Root barrel already exports inputs: src/ui/index.ts
export * from './inputs';

// 4. Import usage (recommended):
import { CalendarDay } from '@/ui';

// 5. Import usage (alternative):
import { CalendarDay } from '@/ui/inputs';
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/buttons/button.tsx`** - Reference for:
  - CVA pattern with multiple variants and compound variants
  - forwardRef implementation
  - Click handler patterns
  - Disabled state handling
  - TypeScript type exports

- **`src/ui/inputs/text-input.tsx`** - Reference for:
  - Input category component structure
  - Wrapper variants pattern
  - Error state handling
  - Size variants implementation

- **`src/ui/buttons/__tests__/button.test.tsx`** - Reference for:
  - Comprehensive test structure
  - Variant testing patterns
  - State testing (disabled, loading)
  - Accessibility tests
  - Event handler tests

- **`src/stories/buttons/button.stories.tsx`** - Reference for:
  - Story structure with meta satisfies pattern
  - argTypes configuration
  - Matrix/comparison stories
  - Real-world example patterns

- **`src/app/globals.css`** - Reference for:
  - Design tokens (colors, borders, radius)
  - Semantic color mappings used in component

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/calendar-day.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/calendar-day.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/calendar-day.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
4. **Category barrel update**: `src/ui/inputs/index.ts` (add export)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: No specific changes - component size remains fixed
- **Tablet (md: 768px - 1023px)**: No specific changes
- **Mobile (< 768px)**: No specific changes - the 34px fixed size works across all breakpoints

The CalendarDay component has a fixed size (34x34px) as specified in the Figma design. Responsive behavior is handled at the calendar grid level, not the individual day cell.

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1029-28994&m=dev
- Design specifications extracted from Figma API

**Design Specifications from Figma**:

**Dimensions**:

- Fixed size: 34x34px (`size-[34px]`)

**Typography**:

- Font family: `font-sans` (Inter via `--font-sans: var(--font-inter)`)
- Font size: 12px (`text-xs`)
- Line height: 18px (`leading-[18px]`)
- Weight: Regular (400) for day numbers, Medium (500) for day-of-week headers
- Text alignment: Center

**Border Radius**:

- Default/Selected/Hovered: `rounded-sm` (6px)
- Day of week header: `rounded-full` (100px)
- Multi-select center: No border radius (connects visually)
- Multi-select start: `rounded-l-sm` (left corners only)
- Multi-select end: `rounded-r-sm` (right corners only)

**Color Tokens** (mapped to existing design system):

| State               | Background                      | Text Color                                       | Border                          |
| ------------------- | ------------------------------- | ------------------------------------------------ | ------------------------------- |
| Default             | transparent                     | `text-text-primary` (#11181C)                    | none                            |
| Today (default)     | transparent                     | `text-primary` (#3C61DD)                         | none                            |
| Previous/Next Month | transparent                     | `text-text-tertiary` (#889096)                   | none                            |
| Day of Week         | transparent                     | `text-text-tertiary` (#889096)                   | none                            |
| Disabled            | transparent                     | `text-text-secondary` (#C1C8CD)                  | none                            |
| Hovered             | `bg-background-brand-secondary` | `text-text-primary`                              | `border-border-brand-secondary` |
| Today + Hovered     | `bg-background-brand-secondary` | `text-primary`                                   | `border-border-brand-secondary` |
| Selected            | `bg-fill-primary`               | `text-text-overlay-white`                        | none                            |
| Today + Selected    | `bg-fill-primary`               | `text-text-overlay-white`                        | none                            |
| Multi-select Start  | `bg-fill-primary`               | `text-text-overlay-white`                        | none                            |
| Multi-select Center | `bg-background-brand-tertiary`  | `text-text-primary` or `text-primary` (if today) | none                            |
| Multi-select End    | `bg-fill-primary`               | `text-text-overlay-white`                        | none                            |
| Empty               | transparent                     | -                                                | none                            |

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/calendar-day.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic day with default props
2. **AllDayTypes**: Shows all day type variants (default, today, prev/next month, day of week, empty)
3. **AllStates**: Shows all interactive states (default, hovered, selected, disabled)
4. **MultiSelectStates**: Shows multi-selection states (start, center, end)
5. **TodayVariants**: Shows today's date in various states
6. **DisabledVariants**: Shows disabled state for different day types
7. **SizeComparison**: Shows the fixed 34px size in context
8. **CalendarWeekExample**: Real-world example showing days in a row
9. **CalendarMonthExample**: Real-world example showing a month grid
10. **DateRangeSelection**: Example showing multi-select range in context
11. **CompleteMatrix**: Visual grid of all dayType × state combinations

**Story Requirements**:

- Use `satisfies Meta<typeof CalendarDay>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` for dayType, state, day, isToday, disabled, onClick
- Set `parameters.layout: "centered"`
- Include interactive controls for all props
- Document each story with JSDoc comments

## Implementation Plan

### Phase 1: Foundation

1. **Research existing patterns**:
   - Review Button component for CVA patterns and click handling
   - Review TextInput for input category conventions
   - Understand design token usage in globals.css

2. **Define TypeScript types**:
   - `CalendarDayType`: 'default' | 'today' | 'previousMonth' | 'nextMonth' | 'dayOfWeek' | 'empty'
   - `CalendarDayState`: 'default' | 'hovered' | 'selected' | 'multiSelectStart' | 'multiSelectCenter' | 'multiSelectEnd' | 'disabled'
   - Props interface with proper type constraints

### Phase 2: Core Implementation

1. **Create CVA variants**:
   - Base styles: `'font-sans size-[34px] flex items-center justify-center text-xs leading-[18px] text-center'`
   - Day type variants (text colors)
   - State variants (backgrounds, borders, border-radius)
   - Compound variants for combined states (today + selected, today + hovered, etc.)

2. **Implement component logic**:
   - `forwardRef<HTMLElement, CalendarDayProps>` for polymorphic rendering (button or div)
   - Click handler with disabled state check
   - Proper aria attributes (aria-selected, aria-disabled, aria-current for today)
   - Keyboard accessibility (Enter/Space to select)

3. **Handle edge cases**:
   - Empty cells (no interaction, render as div)
   - Day of week headers (no interaction, render as div)
   - Disabled state (no click, visual indication)

### Phase 3: Design System Integration & Documentation

**Export Configuration**:

- Export component, variants, and types from `calendar-day.tsx`
- Add export to `src/ui/inputs/index.ts`
- Component accessible via `import { CalendarDay } from '@/ui'`

**Storybook Documentation (REQUIRED)**:

- Create comprehensive stories at `src/stories/inputs/calendar-day.stories.tsx`
- Include all day types, states, and combinations
- Provide real-world examples (week row, month grid, date range)
- Configure interactive controls for testing

## Step by Step Tasks

### 1. Create CalendarDay Component

- Create `src/ui/inputs/calendar-day.tsx`
- Define TypeScript types for `CalendarDayType` and `CalendarDayState`
- Implement CVA variants with all day types and states
- Handle compound variants for combined states (today+selected, today+hovered, etc.)
- Implement `forwardRef<HTMLElement, CalendarDayProps>` for polymorphic rendering
- Add click handler with disabled state check
- Add accessibility attributes (aria-selected, aria-disabled, aria-current)
- Export component, variants, and types

### 2. Update Barrel Export

- Add `export * from './calendar-day'` to `src/ui/inputs/index.ts`
- Verify import works via `import { CalendarDay } from '@/ui'`

### 3. Create Unit Tests

- Create `src/ui/inputs/__tests__/calendar-day.test.tsx`
- Test default rendering
- Test all day type variants render correctly
- Test all state variants apply correct classes
- Test compound variants (today + selected, today + hovered)
- Test click handler fires for interactive days
- Test click handler doesn't fire when disabled
- Test click handler doesn't fire for empty/dayOfWeek cells
- Test accessibility attributes (aria-selected, aria-disabled, aria-current)
- Test keyboard interaction (Enter/Space to select)
- Test ref forwarding
- Test custom className merging
- Test edge cases (missing props, null children)

### 4. Create Storybook Stories

- Create `src/stories/inputs/calendar-day.stories.tsx`
- Configure meta with title "Inputs/CalendarDay"
- Define argTypes for all props (dayType, state, day, isToday, disabled, onClick)
- Create Default story
- Create AllDayTypes story showing all type variants
- Create AllStates story showing all interactive states
- Create MultiSelectStates story showing range selection states
- Create TodayVariants story showing today in various states
- Create DisabledVariants story
- Create CalendarWeekExample showing a week row
- Create CalendarMonthExample showing a full month grid
- Create DateRangeSelection example
- Create CompleteMatrix showing all dayType × state combinations

### 5. Run Validation Commands

- Run `npm run type-check` - verify zero TypeScript errors
- Run `npm run lint` - verify zero ESLint errors
- Run `npm test -- calendar-day` - verify all tests pass
- Run `npm run test:run` - verify no regressions
- Run `npm run build` - verify production build succeeds
- Run `npm run build-storybook` - verify Storybook builds successfully

## Testing Strategy

### Unit Tests

**Rendering Tests**:

- Renders with default props
- Renders correct day number
- Renders day of week text (Mo, Tu, etc.)
- Renders as empty cell when type is 'empty'

**Day Type Tests**:

- Default type applies correct text color
- Today type applies brand text color
- Previous/next month applies tertiary text color
- Day of week applies tertiary text color with medium weight
- Empty type renders with no visible content

**State Tests**:

- Default state has no background
- Hovered state applies brand secondary background and border
- Selected state applies primary fill background and white text
- Disabled state applies secondary text color and disables interaction
- Multi-select start has left-rounded corners with primary fill
- Multi-select center has no rounded corners with tertiary brand background
- Multi-select end has right-rounded corners with primary fill

**Compound Variant Tests**:

- Today + hovered applies brand text with hovered background
- Today + selected applies white text with primary fill
- Today + multi-select center keeps brand text with tertiary background
- Today + disabled applies disabled styling

**Interaction Tests**:

- Click handler fires for interactive days
- Click handler doesn't fire when disabled
- Click handler doesn't fire for empty cells
- Click handler doesn't fire for dayOfWeek cells
- Enter key triggers click
- Space key triggers click

**Accessibility Tests**:

- aria-selected="true" when selected or in multi-select range
- aria-disabled="true" when disabled
- aria-current="date" when isToday is true
- role="gridcell" for day cells
- role="columnheader" for day of week headers
- No role for empty cells

**Ref and Props Tests**:

- Forwards ref correctly
- Merges custom className
- Passes through additional props

### Edge Cases

- Day number 0 or negative (should handle gracefully)
- Day number > 31 (edge case)
- Missing day prop (component should handle)
- Conflicting states (selected + disabled - disabled should win)
- Empty string for day prop
- Very long day number string (e.g., custom content)

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/inputs/calendar-day.tsx` with proper TypeScript types
- ✅ All 6 day type variants work correctly (default, today, previousMonth, nextMonth, dayOfWeek, empty)
- ✅ All 7 state variants work correctly (default, hovered, selected, multiSelectStart, multiSelectCenter, multiSelectEnd, disabled)
- ✅ Compound variants handle combined states (today + selected, today + hovered, etc.)
- ✅ Component forwards refs correctly
- ✅ Empty and dayOfWeek types render as non-interactive elements
- ✅ Component follows design system patterns (CVA, semantic tokens, forwardRef)

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All day type variants tested
- ✅ All state variants tested
- ✅ Compound variants tested
- ✅ Click handler tests (fires/doesn't fire appropriately)
- ✅ Accessibility tests (aria attributes, keyboard navigation)
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/calendar-day.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **AllDayTypes story showing all type variants**
- ✅ **AllStates story showing all interactive states**
- ✅ **MultiSelectStates story showing range selection**
- ✅ **TodayVariants story showing today in various states**
- ✅ **Real-world examples (CalendarWeekExample, CalendarMonthExample)**
- ✅ **CompleteMatrix story showing all combinations**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { CalendarDay } from '@/ui'`

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

3. **Run component tests**: `npm test -- calendar-day`
   - Expected: All CalendarDay tests pass with >90% coverage
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

### Design Token Mapping

The Figma design uses specific color tokens that map to the project's design system:

| Figma Token                                                               | Project Token                   |
| ------------------------------------------------------------------------- | ------------------------------- |
| `--context/text/base/primary/text-base-primary`                           | `text-text-primary`             |
| `--context/text/brand/text-brand`                                         | `text-primary`                  |
| `--context/text/base/tertiary/text-base-tertiary`                         | `text-text-tertiary`            |
| `--context/text/base/subtle/text-base-subtle`                             | `text-text-secondary`           |
| `--context/text/overlay-white/primary/text-overlay-w-primary`             | `text-text-overlay-white`       |
| `--context/background/surface/brand/secondary/bg-surface-brand-secondary` | `bg-background-brand-secondary` |
| `--context/background/surface/brand/tertiary/bg-surface-brand-tertiary`   | `bg-background-brand-tertiary`  |
| `--context/background/fill/brand/primary/bg-fill-brand-primary`           | `bg-fill-primary`               |
| `--context/border/brand/secondary/border-brand-secondary`                 | `border-border-brand-secondary` |
| `--radius-sm`                                                             | `rounded-sm` (6px)              |

### Future Considerations

1. **CalendarWeek Component**: Next molecule to build that composes 7 CalendarDay components
2. **CalendarMonth Component**: Organism that composes CalendarWeek components
3. **DatePicker Component**: Higher-level component with input field and calendar dropdown
4. **DateRangePicker Component**: For selecting date ranges using multi-select states
5. **Internationalization**: Day of week headers will need locale support (e.g., "Mo" → "Lu" for Spanish)

### Accessibility Notes

- The component should be used within a `role="grid"` container for proper calendar semantics
- Day cells should have `role="gridcell"`
- Day of week headers should have `role="columnheader"`
- The selected state should set `aria-selected="true"`
- Today's date should have `aria-current="date"`
- Disabled days should have `aria-disabled="true"` and `tabindex="-1"`

### Keyboard Navigation

Arrow key navigation (←/→/↑/↓) is handled by the **parent Calendar component**, not individual CalendarDay cells. This follows the WAI-ARIA grid pattern where the grid container manages focus movement. The CalendarDay component only handles Enter/Space key events for selection.

### Performance Considerations

- The component is lightweight with minimal DOM elements
- CVA variants are computed at build time
- No internal state - fully controlled component for optimal React performance
- Suitable for virtualized calendar implementations
