# Ui: DateInputFloatingLabel

## Component Description

DateInputFloatingLabel is an enhanced date input component that combines the floating label animation pattern with an integrated calendar picker. When the input is empty and unfocused, the label appears as placeholder text inside the input field. Upon focus or when the input has a value, the label smoothly animates to float above the input border. Users can either type a date in MM/DD/YYYY format or select a date from the calendar popover.

This component bridges the gap between `TextInputFloatingLabel` (floating label pattern) and `DateInput` (calendar picker functionality), providing a modern, space-efficient date input solution commonly seen in Material Design and modern form interfaces.

## User Story

As a form user
I want to enter dates using a floating label input with calendar picker
So that I can benefit from both keyboard input and visual calendar selection while maintaining a clean, modern interface

## Problem Statement

The current design system has separate components for:

1. `DateInput` - Date input with calendar but standard label positioning
2. `TextInputFloatingLabel` - Floating label pattern but for text only

There is no component that combines the floating label animation with date picker functionality. This gap prevents consistent UI patterns when forms mix floating label text inputs with date inputs.

## Solution Statement

Create `DateInputFloatingLabel` as a molecule component that:

1. Extends the floating label pattern from `TextInputFloatingLabel`
2. Integrates calendar picker functionality from `DateInput`
3. Supports all states: Empty, Hovered, Focused, Typing, Filled, Disabled, Disabled-Filled, Error, Error-Filled
4. Works with optional calendar popover that can be controlled or uncontrolled
5. Provides proper ARIA attributes for accessibility
6. Includes a companion `DateInputFloatingLabelField` organism for convenience

**Important Design Decisions:**

- **No `rightAddOn` prop**: Unlike `TextInputFloatingLabel`, this component does NOT support the `rightAddOn` prop. The calendar icon button permanently occupies the right slot as it is integral to the component's functionality. Only `leftAddOn` is supported for additional icons or content.

- **Molecule does NOT include Hint/ErrorMessage**: The standalone `DateInputFloatingLabel` molecule does NOT include `Hint` or `ErrorMessage` atoms. These are ONLY available through the `DateInputFloatingLabelField` organism wrapper. This maintains consistency with the dual-API pattern used across all input components.

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: DateInputFloatingLabel combines multiple atoms (input, label, calendar icon, floating label animation) with complex state logic for the calendar popover. It's more complex than a basic atom but doesn't compose multiple independent molecules, making it a molecule.

**Composition Requirements**:

- **Required Atoms**:
  - `Icon` from `@/ui/icons` - For calendar icon
  - `Calendar` from `@/ui/inputs` - For the calendar popover (this is a complex molecule used as a feature)
  - `CalendarBlank` from `@phosphor-icons/react` - Calendar icon
- **Required Molecules**: None (this is a standalone molecule)
- **Pattern References**:
  - `TextInputFloatingLabel` - Floating label animation and wrapper structure
  - `DateInput` - Calendar integration and date parsing/formatting logic

## Component Location

**Location**: `src/ui/inputs/date-input-floating-label.tsx`

**Category**: `inputs`

**Reasoning**: This component is a form input element for date selection, making it a natural fit in the `inputs` category alongside `DateInput`, `TextInput`, and `TextInputFloatingLabel`.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/date-input-floating-label.tsx
export {
  DateInputFloatingLabel,
  dateInputFloatingLabelWrapperVariants,
  floatingLabelVariants,
};
export type { DateInputFloatingLabelProps };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './date-input-floating-label';
export * from './date-input-floating-label-field';

// 3. Root barrel already exports from inputs (no change needed): src/ui/index.ts

// 4. Import usage (recommended):
import { DateInputFloatingLabel, DateInputFloatingLabelField } from '@/ui';

// 5. Import usage (alternative):
import { DateInputFloatingLabel } from '@/ui/inputs';
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/inputs/text-input-floating-label.tsx`** - Primary reference for floating label animation pattern
  - Copy CVA variants: `textInputFloatingLabelWrapperVariants`, `floatingLabelVariants`
  - Study autofill detection logic
  - Reference internal state management for focus/value tracking

- **`src/ui/inputs/date-input.tsx`** - Reference for calendar integration
  - Copy date parsing/formatting utilities: `parseMMDDYYYY`, `formatMMDDYYYY`
  - Study calendar popover positioning and click-outside handling
  - Reference controlled/uncontrolled value patterns

- **`src/ui/inputs/text-input-floating-label-field.tsx`** - Pattern for Field wrapper
  - Copy field composition with Hint and ErrorMessage
  - Reference ARIA attribute handling

- **`src/ui/inputs/calendar.tsx`** - Calendar component to integrate
  - Understand `CalendarSingleValue` type
  - Study `onChange` handler signature

- **`src/stories/inputs/text-input-floating-label.stories.tsx`** - Story patterns
  - Reference story organization and argTypes
  - Copy state demonstration patterns

- **`src/stories/inputs/date-input.stories.tsx`** - Story patterns for date inputs
  - Reference calendar open state stories
  - Copy constraint demonstration patterns

- **`src/ui/inputs/__tests__/text-input-floating-label.test.tsx`** - Test patterns (if exists)
- **`src/ui/inputs/__tests__/date-input.test.tsx`** - Test patterns for date functionality (if exists)

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/date-input-floating-label.tsx` (REQUIRED)
2. **Field wrapper**: `src/ui/inputs/date-input-floating-label-field.tsx` (REQUIRED)
3. **Test file**: `src/ui/inputs/__tests__/date-input-floating-label.test.tsx` (REQUIRED)
4. **Test file for field**: `src/ui/inputs/__tests__/date-input-floating-label-field.test.tsx` (REQUIRED)
5. **Story file**: `src/stories/inputs/date-input-floating-label.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Yes - Full width with calendar popover positioned below input
- **Tablet (md: 768px - 1023px)**: Yes - Same as desktop
- **Mobile (< 768px)**: Yes - Full width, calendar may need position adjustments

### Calendar Positioning Strategy

**Desktop/Tablet (768px+)**:

- Calendar popover appears below input, aligned to left edge
- Use `absolute` positioning with `top-full mt-1 left-0`
- z-index: `z-50` to ensure visibility above other content

**Mobile (< 768px)**:

- Same positioning as desktop for consistency
- Calendar component handles its own responsive width
- Consider adding `max-w-full` to prevent overflow on narrow screens

**Viewport Edge Handling**:

- If calendar would overflow bottom of viewport, position above input (`bottom-full mb-1`)
- This logic should be implemented using a simple viewport detection in useEffect

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1988-118194&m=dev
- Screenshot analyzed showing all 9 states:
  - Empty (with label as placeholder)
  - Hovered (border color change)
  - Focused (blue border, label floated in blue)
  - Typing (with placeholder visible and cursor)
  - Filled (value displayed, label floated in gray)
  - Disabled (gray background)
  - Disabled-Filled (gray background with value)
  - Error (red border, label in red)
  - Error-Filled (red border, value displayed, label in red)
  - Calendar open state (popover visible below input)

**Design Specifications**:

- Width: 230px (default, should be configurable via className)
- Border radius: 6px (`rounded-sm`)
- Border: 1px solid (default), 2px solid (focused/error)
- Padding: px-4 py-3.5 (16px horizontal, 14px vertical)
- Font size: 16px for value/placeholder, 12px for floating label
- Colors:
  - Default border: `border-border` (#d7dbdf)
  - Hover border: `border-border-hover` (#c1c8cd)
  - Focused border: `border-primary` (#3c61dd)
  - Error border: `border-destructive` (#e54d2e)
  - Label floating (focused): `text-primary` (#3c61dd)
  - Label floating (filled): `text-text-tertiary` (#889096)
  - Label error: `text-destructive` (#e54d2e)
  - Required indicator: `text-destructive` (#e54d2e)
- Calendar icon: 20px, positioned at right side

### Error State Visual Hierarchy

When the component is in error state:

- **Border**: Changes to `border-destructive` (#e54d2e) with 2px width
- **Floating Label**: Changes to `text-destructive` (#e54d2e) regardless of focus state
- **Label Position**: Remains floating if there is a value, even when unfocused
- **Calendar Icon**: Retains default color (not affected by error state)
- **Error takes precedence**: Error styling overrides focus styling via CVA compound variants

The error state should be visually consistent with `TextInputFloatingLabel` error behavior.

## Accessibility Requirements

### Required ARIA Attributes

**Input Element**:

```typescript
<input
  role="combobox"
  aria-haspopup="dialog"
  aria-expanded={isOpen}
  aria-invalid={error}
  aria-required={required}
  aria-describedby={hintId || errorId} // From Field wrapper
  aria-controls={calendarId} // ID of calendar popover
/>
```

**Calendar Icon Button**:

```typescript
<button
  type="button"
  aria-label="Choose date from calendar"
  aria-expanded={isOpen}
  tabIndex={-1} // Skip in tab order, input handles focus
/>
```

**Calendar Popover**:

```typescript
<div
  id={calendarId}
  role="dialog"
  aria-modal="false"
  aria-label="Choose date"
/>
```

### Keyboard Navigation

| Key                        | Action                                    | Component            |
| -------------------------- | ----------------------------------------- | -------------------- |
| `Tab`                      | Move to next focusable element            | Input                |
| `Escape`                   | Close calendar popover                    | Input/Calendar       |
| `Enter`                    | Confirm typed date / Select focused date  | Input/Calendar       |
| `Space`                    | Open calendar (on icon button if focused) | Icon Button          |
| `Arrow Up/Down/Left/Right` | Navigate calendar dates                   | Calendar (delegated) |
| `Page Up/Down`             | Navigate months                           | Calendar (delegated) |
| `Home/End`                 | Go to first/last day of week              | Calendar (delegated) |

**Note**: Arrow key navigation within the calendar is handled by the `Calendar` component itself.

### Screen Reader Announcements

The component should provide appropriate feedback to screen readers:

1. **Calendar Open**: When calendar opens, focus moves to calendar and screen reader announces "Choose date, dialog"
2. **Date Selection**: When a date is selected, announce "Selected [formatted date]"
3. **Calendar Close**: When calendar closes via Escape or selection, focus returns to input
4. **Validation Errors**: Error messages are announced via `aria-describedby` association (handled by Field wrapper)
5. **Required Field**: Required status announced via `aria-required` attribute

**Implementation Note**: Use `aria-live="polite"` region for date selection announcements if needed.

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/date-input-floating-label.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic component with empty state
2. **AllStates Story**: Grid showing all 9 visual states (Empty, Hovered, Focused, Typing, Filled, Disabled, Disabled-Filled, Error, Error-Filled)
3. **WithCalendarOpen Story**: Shows the calendar popover in open state
4. **WithAddons Story**: Demonstrates left add-on configurations
5. **WithHint Story**: Using Field wrapper with hint text
6. **WithError Story**: Using Field wrapper with error state
7. **FormIntegration Story**: Real-world form example
8. **Controlled Story**: Demonstrates controlled value pattern
9. **WithConstraints Story**: minDate/maxDate constraints
10. **AllCombinations Story**: Comprehensive grid of all state/addon combinations
11. **StandaloneVsField Story**: When to use which component

**Story Requirements**:

- Use `satisfies Meta<typeof DateInputFloatingLabel>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: "centered"`
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

**Example Structure**:

```typescript
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DateInputFloatingLabel, DateInputFloatingLabelField } from '@/ui/inputs';

const meta = {
  title: 'Inputs/DateInputFloatingLabel',
  component: DateInputFloatingLabel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The floating label text',
    },
    required: {
      control: 'boolean',
      description: 'Shows required indicator (*)',
    },
    error: {
      control: 'boolean',
      description: 'Error state - applies destructive styling',
    },
    // ... more argTypes
  },
} satisfies Meta<typeof DateInputFloatingLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Date',
    placeholder: 'MM/DD/YYYY',
  },
};
```

## Implementation Plan

### Phase 1: Foundation

1. Review and understand the existing `TextInputFloatingLabel` component architecture
2. Review and understand the existing `DateInput` component calendar integration
3. Copy and adapt date utility functions (`parseMMDDYYYY`, `formatMMDDYYYY`)
4. Plan the component props interface combining both patterns

### Phase 2: Core Implementation

1. Create `DateInputFloatingLabel` molecule component:
   - Adapt floating label wrapper variants from `TextInputFloatingLabel`
   - Adapt floating label variants with compound states
   - Integrate calendar popover from `DateInput`
   - Implement controlled/uncontrolled value patterns
   - Handle focus/blur for floating label animation
   - Handle calendar open/close states
   - Implement click-outside detection for calendar
   - Support left add-on slot (matching Figma design)

2. Create `DateInputFloatingLabelField` organism component:
   - Compose with `DateInputFloatingLabel`
   - Add `Hint` and `ErrorMessage` atoms
   - Handle ARIA associations

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add exports to `src/ui/inputs/index.ts` for both components
- Ensure named exports follow project conventions

**Storybook Documentation (REQUIRED):**

- Create `src/stories/inputs/date-input-floating-label.stories.tsx`
- Include all 11 required stories
- Configure comprehensive argTypes
- Add real-world form examples
- Demonstrate responsive behavior

## Step by Step Tasks

### 1. Research and Setup

- Read and analyze `TextInputFloatingLabel` component implementation
- Read and analyze `DateInput` component implementation
- Identify shared patterns and utilities to reuse
- Understand CVA variant patterns used in both components

### 2. Create DateInputFloatingLabel Component

- Create file `src/ui/inputs/date-input-floating-label.tsx`
- Copy and adapt date utility functions from `DateInput`
- Create CVA variants for wrapper (adapted from `TextInputFloatingLabel`)
- Create CVA variants for floating label with all compound states
- Define `DateInputFloatingLabelProps` interface (document `rightAddOn` omission in JSDoc)
- Implement forwardRef component with:
  - Internal refs for wrapper and input
  - Controlled/uncontrolled value state management
  - Controlled/uncontrolled open state management
  - Input text state for typing
  - Focus state for label animation
  - Autofill detection (from `TextInputFloatingLabel`) with CSS keyframes
  - Calendar popover rendering with proper positioning strategy
  - Click-outside handler
  - Keyboard event handlers (Escape, Enter)
  - Calendar icon click handler (with `tabIndex={-1}`)
  - Input change/blur handlers
- Implement ARIA attributes:
  - `role="combobox"` on input
  - `aria-haspopup="dialog"` on input
  - `aria-expanded` on input and button
  - `aria-invalid`, `aria-required` on input
  - `aria-controls` pointing to calendar ID
  - `aria-label` on calendar button and popover
  - `role="dialog"` on calendar popover

### 3. Create DateInputFloatingLabelField Component

- Create file `src/ui/inputs/date-input-floating-label-field.tsx`
- Define `DateInputFloatingLabelFieldProps` extending `DateInputFloatingLabelProps`
- Add hint, errorMessage, hintProps, errorProps
- Implement forwardRef component with:
  - Generated IDs for accessibility
  - Conditional hint/error rendering
  - ARIA associations

### 4. Create Unit Tests for DateInputFloatingLabel

- Create file `src/ui/inputs/__tests__/date-input-floating-label.test.tsx`
- Test rendering with default props
- Test floating label states (empty, focused, filled)
- Test required indicator rendering
- Test error state styling
- Test disabled state behavior
- Test calendar popover open/close
- Test date selection from calendar
- Test keyboard input parsing
- Test controlled vs uncontrolled modes
- Test left add-on rendering
- Test keyboard navigation (Escape closes, Enter confirms)
- Test click-outside closes calendar
- Test ARIA attributes

### 5. Create Unit Tests for DateInputFloatingLabelField

- Create file `src/ui/inputs/__tests__/date-input-floating-label-field.test.tsx`
- Test hint rendering
- Test error message rendering (replaces hint)
- Test ARIA associations
- Test generated IDs
- Test error state propagation

### 6. Create Storybook Stories

- Create file `src/stories/inputs/date-input-floating-label.stories.tsx`
- Implement Default story with basic props
- Implement AllStates story showing 9 visual states
- Implement WithCalendarOpen story
- Implement WithAddons story
- Implement WithHint story (Field wrapper)
- Implement WithError story (Field wrapper)
- Implement FormIntegration story
- Implement Controlled story
- Implement WithConstraints story
- Implement AllCombinations story
- Implement StandaloneVsField story
- Configure comprehensive argTypes
- Add autodocs tag

### 7. Update Barrel Exports

- Add exports to `src/ui/inputs/index.ts`:
  ```typescript
  export * from './date-input-floating-label';
  export * from './date-input-floating-label-field';
  ```

### 8. Validation Commands Execution

- Run `npm run type-check` - verify zero TypeScript errors
- Run `npm run lint` - verify zero ESLint errors
- Run `npm test -- date-input-floating-label` - verify all tests pass
- Run `npm run test:run` - verify no regressions
- Run `npm run build` - verify production build
- Run `npm run build-storybook` - verify Storybook builds

## Testing Strategy

### Unit Tests

**DateInputFloatingLabel Tests:**

- Renders with required `label` prop
- Floating label appears inline when empty and unfocused
- Floating label floats when input is focused
- Floating label floats when input has value
- Floating label stays floated on blur if value exists
- Required indicator (\*) renders when `required` prop is true
- Error state applies red border and red label
- Disabled state disables input and icon button
- Disabled state shows gray background
- Calendar popover opens on input focus
- Calendar popover opens on icon click
- Calendar popover closes on Escape key
- Calendar popover closes on click outside
- Selecting date from calendar updates input value
- Typing valid date updates calendar selection
- Invalid date input doesn't break component
- Left add-on renders correctly
- Forwards ref to input element

**Accessibility Tests (ARIA & Keyboard)**:

- Input has `role="combobox"` attribute
- Input has `aria-haspopup="dialog"` attribute
- Input has `aria-expanded` matching calendar open state
- Input has `aria-invalid` matching error prop
- Input has `aria-required` matching required prop
- Input has `aria-controls` pointing to calendar popover ID
- Calendar icon button has `aria-label="Choose date from calendar"`
- Calendar popover has `role="dialog"` and `aria-label="Choose date"`
- Escape key closes calendar and returns focus to input
- Enter key confirms date selection
- Tab navigation skips calendar icon button (tabIndex=-1)
- Focus management returns to input after calendar closes

**DateInputFloatingLabelField Tests:**

- Renders hint when provided and no error
- Renders error message when provided
- Error message replaces hint
- Generates unique IDs for accessibility
- ARIA describedby points to correct element
- Passes props through to DateInputFloatingLabel

### Edge Cases

- Empty string value vs null value
- Date at min/max boundaries
- Invalid date formats (e.g., 13/45/2024)
- Leap year handling (02/29)
- Browser autofill detection
- Rapid focus/blur cycles
- Calendar open while typing
- Value change while calendar is open
- Concurrent controlled value and text changes

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/inputs/` with proper TypeScript types
- ✅ Floating label animates from placeholder position to floating position
- ✅ All 9 visual states work correctly (Empty, Hovered, Focused, Typing, Filled, Disabled, Disabled-Filled, Error, Error-Filled)
- ✅ Calendar popover opens on focus or icon click
- ✅ Calendar popover closes on selection, Escape, or click outside
- ✅ Date can be typed manually in MM/DD/YYYY format
- ✅ Date can be selected from calendar picker
- ✅ Controlled and uncontrolled modes work correctly
- ✅ minDate/maxDate constraints are respected
- ✅ Component forwards refs correctly
- ✅ Left add-on slot is supported

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/date-input-floating-label.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **AllStates story with all 9 visual states**
- ✅ **WithCalendarOpen story**
- ✅ **WithAddons story**
- ✅ **WithHint and WithError stories (Field wrapper)**
- ✅ **FormIntegration story with real-world example**
- ✅ **Controlled story demonstrating value control**
- ✅ **AllCombinations comprehensive grid**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { DateInputFloatingLabel, DateInputFloatingLabelField } from '@/ui'`

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

3. **Run component tests**: `npm test -- date-input-floating-label`
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

### Implementation Notes

1. **Floating Label Animation**: Use CSS transitions with `transition-all duration-150 ease-out` for smooth animation. The label scales from `scale-100` (16px equivalent) to `scale-75` (12px equivalent) using `origin-left`.

2. **Calendar Integration**: Reuse the existing `Calendar` component from `@/ui/inputs`. Set `mode="single"`, `hideActions`, and `view="single-month"` for the popover.

3. **State Management**: The component has multiple overlapping states:
   - Focus state (controls label animation)
   - Value state (controlled/uncontrolled)
   - Open state (controls calendar visibility)
   - Input text state (allows typing invalid strings during input)

4. **Autofill Detection**: Copy the autofill detection logic from `TextInputFloatingLabel` using `:-webkit-autofill` pseudo-selector and animation events.

5. **Click Outside Detection**: Use `useEffect` with `mousedown` event listener on document, checking if click target is inside wrapper ref.

6. **Z-Index Layering**: The floating label needs z-index higher than the input border. The calendar popover needs z-index higher than surrounding content (z-50).

7. **Autofill Detection CSS**: Copy these keyframe animations from `TextInputFloatingLabel` to detect browser autofill:

   ```css
   @keyframes onAutoFillStart {
     from {
       /* empty */
     }
     to {
       /* empty */
     }
   }
   @keyframes onAutoFillCancel {
     from {
       /* empty */
     }
     to {
       /* empty */
     }
   }
   ```

   Then apply to input:

   ```css
   input:-webkit-autofill {
     animation-name: onAutoFillStart;
   }
   input:not(:-webkit-autofill) {
     animation-name: onAutoFillCancel;
   }
   ```

   Listen for `animationstart` events to detect autofill state changes.

8. **Props Interface JSDoc**: Document the `rightAddOn` omission clearly:
   ```typescript
   /**
    * DateInputFloatingLabel - A date input with floating label animation.
    *
    * @remarks
    * Unlike TextInputFloatingLabel, this component does NOT support `rightAddOn`.
    * The calendar icon button permanently occupies the right slot.
    * Use `leftAddOn` for additional icons or content.
    */
   ```

### Future Considerations

- Date range selection variant (if needed)
- Time picker integration (DateTimeInputFloatingLabel)
- Locale-aware date formatting
- Week start day configuration
