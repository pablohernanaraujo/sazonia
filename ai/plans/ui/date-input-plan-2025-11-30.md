# Ui: DateInput

## Component Description

DateInput is a specialized form input component that combines a text input field with an integrated calendar popover for date selection. Users can either manually type a date in MM/DD/YYYY format or click/focus the input to open a calendar picker for visual date selection. The component supports multiple states (empty, filled, hover, focus, disabled, error), three size variants (sm, md, lg), and includes optional label, hint text, and error message sub-components.

This component provides a complete date selection experience with both keyboard input and mouse-based calendar navigation, following established patterns from the Glow UI design system.

## User Story

As a user filling out a form
I want to select a date using either direct keyboard input or a visual calendar picker
So that I can quickly and accurately enter date values with confidence

## Problem Statement

Forms requiring date input need a user-friendly component that:

- Allows direct keyboard entry for power users who know the date format
- Provides a visual calendar picker for users who prefer point-and-click selection
- Handles validation and error states consistently with other form inputs
- Maintains accessibility standards for date selection
- Integrates seamlessly with the existing input component ecosystem

## Solution Statement

Create a DateInput molecule component that composes existing atoms (InputLabel, TextInput, Hint, ErrorMessage, Calendar, Icon) into a cohesive date selection interface. The component will:

- Extend the TextInput pattern with a calendar icon as rightAddOn
- Open a Calendar popover on input focus or icon click
- Sync the selected calendar date with the text input value
- Format dates in MM/DD/YYYY format with configurable locale support
- Handle all visual states (empty, hovered, focused, typing, filled, disabled, error) as shown in Figma
- Support controlled and uncontrolled patterns

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: DateInput combines multiple atomic components (InputLabel, TextInput, Hint, ErrorMessage, Calendar, Icon) into a cohesive, reusable form input. It orchestrates the interaction between a text input and a calendar picker, making it more complex than a single atom but not as structural as an organism.

**Composition Requirements**:

- **Required Atoms**:
  - `InputLabel` from `@/ui/inputs` - For the field label
  - `TextInput` from `@/ui/inputs` - For the date input field
  - `Hint` from `@/ui/inputs` - For hint text below the input
  - `ErrorMessage` from `@/ui/inputs` - For error messages
  - `Icon` from `@/ui/icons` - For the calendar icon (CalendarBlank from @phosphor-icons/react)

- **Required Molecules**:
  - `Calendar` from `@/ui/inputs` - For the date picker popover

## Component Location

**Location**: `src/ui/inputs/date-input.tsx`

**Category**: inputs

**Reasoning**: DateInput is a specialized form input component that belongs in the inputs category alongside TextInput, NumberInput, and other form control components. It follows the same dual-API pattern (standalone + field wrapper) established by TextInput.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/date-input.tsx
export { DateInput, dateInputVariants };
export type { DateInputProps };

// 2. Create field wrapper: src/ui/inputs/date-input-field.tsx
export { DateInputField };
export type { DateInputFieldProps };

// 3. Update category barrel: src/ui/inputs/index.ts
export * from './date-input';
export * from './date-input-field';

// 4. Import usage (recommended):
import { DateInput, DateInputField } from '@/ui';
import { DateInput, DateInputField } from '@/ui/inputs';
```

## Props Interface Design

### DateInput Props

```typescript
import { ComponentPropsWithoutRef } from 'react';
import { VariantProps } from 'class-variance-authority';

// DateInput Props - Standalone component
export interface DateInputProps
  extends
    Omit<
      ComponentPropsWithoutRef<'input'>,
      'size' | 'value' | 'defaultValue' | 'onChange' | 'type'
    >,
    VariantProps<typeof dateInputWrapperVariants> {
  // Size variants (from TextInput pattern)
  size?: 'sm' | 'md' | 'lg';

  // Error state
  error?: boolean;

  // Date value (controlled mode)
  value?: Date | null;

  // Default date value (uncontrolled mode)
  defaultValue?: Date | null;

  // Change handler - receives Date object or null
  onChange?: (date: Date | null) => void;

  // Popover control (controlled)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Calendar constraints
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[] | ((date: Date) => boolean);

  // Add-ons (leftAddOn supported, rightAddOn reserved for calendar icon)
  leftAddOn?: React.ReactNode;

  // Wrapper styling
  wrapperClassName?: string;

  // Note: rightAddOn is reserved for calendar icon (not user-configurable)
}
```

### DateInputField Props

```typescript
import { InputLabelProps } from './input-label';
import { HintProps } from './hint';
import { ErrorMessageProps } from './error-message';

// DateInputField Props - Convenience wrapper with label/hint/error
export interface DateInputFieldProps extends Omit<DateInputProps, 'error'> {
  // Label configuration
  label?: string;
  labelProps?: Partial<Omit<InputLabelProps, 'children' | 'htmlFor'>>;

  // Hint configuration
  hint?: string;
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;

  // Error configuration (presence indicates error state)
  error?: string;
  errorProps?: Partial<Omit<ErrorMessageProps, 'children' | 'id'>>;

  // Container styling
  containerClassName?: string;
}
```

## Focus Management Specification

### Focus Flow

1. **User focuses input** → Input receives focus, calendar opens (if not already open)
2. **User clicks calendar icon** → Input receives focus, calendar toggles open/close
3. **User selects date from calendar** → Input retains focus, calendar closes, date is inserted
4. **User presses Escape** → Calendar closes, input retains focus
5. **User clicks outside** → Calendar closes, focus moves to clicked element
6. **User tabs away** → Calendar closes, focus moves to next focusable element

### Keyboard Support

| Key                               | Action                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------ |
| `Tab`                             | Navigate between input and calendar icon (calendar stays open if already open) |
| `Escape`                          | Close calendar, return focus to input                                          |
| `Enter` (in input)                | If valid date typed, close calendar; otherwise no action                       |
| `Enter` (on calendar icon)        | Toggle calendar open/close                                                     |
| `Space` (on calendar icon)        | Toggle calendar open/close                                                     |
| `Arrow keys` (when calendar open) | Navigate calendar grid (focus moves into calendar)                             |
| `Enter` (in calendar grid)        | Select focused date, close calendar                                            |

### Focus Trap Behavior

- Focus is NOT trapped in calendar popover
- User can tab between input → calendar icon → calendar grid → outside
- Calendar closes when focus leaves the component entirely

## Date Validation Specification

### Date Format

- **Format**: `MM/DD/YYYY` (e.g., "03/15/2024")
- **Placeholder**: "MM/DD/YYYY"

### Validation Triggers

- `onBlur`: Validate and format when input loses focus
- `onChange`: Validate as user types (debounced 300ms for performance)

### Validation Behavior

#### Invalid Input Handling

1. Keep invalid string in input (don't clear automatically)
2. Don't update Calendar display to invalid date
3. Don't call `onChange` callback with invalid date
4. Input shows current typed value, calendar shows last valid date

#### Valid Input Handling

1. Parse string to Date object
2. Update Calendar display to show selected date
3. Call `onChange(date)` with Date object
4. Format and display as MM/DD/YYYY

### Date Utilities (to be created)

```typescript
// src/ui/inputs/date-input.tsx (internal utilities)

/**
 * Parse MM/DD/YYYY string to Date object
 * @returns Date object or null if invalid
 */
function parseMMDDYYYY(value: string): Date | null {
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;

  const [, month, day, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  // Validate the parsed date is actually valid (handles edge cases like 02/31)
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }

  return date;
}

/**
 * Format Date object to MM/DD/YYYY string
 */
function formatMMDDYYYY(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${month}/${day}/${year}`;
}

/**
 * Check if string is valid MM/DD/YYYY format and represents valid date
 */
function isValidMMDDYYYY(value: string): boolean {
  return parseMMDDYYYY(value) !== null;
}
```

## Calendar Integration Strategy

### Props Mapping

DateInput should forward these props to Calendar:

| DateInput Prop  | Calendar Prop   | Notes                                |
| --------------- | --------------- | ------------------------------------ |
| `value`         | `value`         | Current selected date                |
| `onChange`      | `onChange`      | Date selection handler               |
| `minDate`       | `minDate`       | Earliest selectable date             |
| `maxDate`       | `maxDate`       | Latest selectable date               |
| `disabledDates` | `disabledDates` | Array or function for disabled dates |

### Fixed Calendar Props

These Calendar props should always be set by DateInput:

```typescript
<Calendar
  mode="single"           // Always single date selection
  hideActions={true}      // No Clear/Apply buttons, immediate selection
  view="single-month"     // Always single month view
  value={selectedDate}
  onChange={handleDateSelect}
  minDate={minDate}
  maxDate={maxDate}
  disabledDates={disabledDates}
/>
```

### Selection Behavior

- When user clicks a date in Calendar, immediately:
  1. Update input value with formatted date
  2. Call `onChange(selectedDate)`
  3. Close calendar popover
  4. Return focus to input

## Popover Positioning Strategy

### Default Positioning

- **Position**: Below input, aligned to left edge
- **CSS**: `absolute`, `top-[calc(100%+8px)]`, `left-0`
- **z-index**: `z-50` (above most content, below modals)

### Viewport Boundary Detection

1. **Bottom overflow**: If calendar extends below viewport → Flip to position above input
2. **Right overflow**: If calendar extends right of viewport → Align to right edge of input
3. **Top overflow** (when flipped): If not enough space above → Keep below, allow scroll

### Responsive Behavior

| Breakpoint          | Behavior                                     |
| ------------------- | -------------------------------------------- |
| Desktop (≥1024px)   | Standard popover below input                 |
| Tablet (768-1023px) | Same as desktop, may adjust width            |
| Mobile (<768px)     | Full-width popover OR centered modal overlay |

### CSS Structure

```typescript
// Wrapper structure
<div className="relative">
  <TextInput ... />

  {isOpen && (
    <div
      className={cn(
        "absolute z-50 top-[calc(100%+8px)] left-0",
        "bg-background border border-border rounded-lg shadow-lg",
        // Animation classes
        "animate-in fade-in-0 zoom-in-95"
      )}
    >
      <Calendar ... />
    </div>
  )}
</div>
```

### Animation

- **Enter**: `fade-in-0 zoom-in-95` (100ms)
- **Exit**: `fade-out-0 zoom-out-95` (75ms)
- Use Tailwind CSS animation utilities

## Accessibility Specification

### ARIA Structure

```tsx
<div className="relative">
  {/* Main input container */}
  <div
    role="combobox"
    aria-expanded={isOpen}
    aria-haspopup="dialog"
    aria-controls={calendarId}
  >
    <input
      type="text"
      aria-label={label || "Date"}
      aria-describedby={ariaDescribedBy}
      aria-invalid={hasError}
      placeholder="MM/DD/YYYY"
      value={inputValue}
      onChange={handleInputChange}
    />

    <button
      type="button"
      aria-label="Choose date from calendar"
      aria-expanded={isOpen}
      aria-controls={calendarId}
      onClick={toggleCalendar}
      tabIndex={-1} // Accessible via input, not separate tab stop
    >
      <Icon icon={CalendarBlank} />
    </button>
  </div>

  {/* Calendar popover */}
  {isOpen && (
    <div
      id={calendarId}
      role="dialog"
      aria-modal="false"
      aria-label="Choose date"
    >
      <Calendar ... />
    </div>
  )}
</div>
```

### Screen Reader Announcements

- When date is selected: Announce "Date selected: [formatted date]" via `aria-live="polite"` region
- When calendar opens: Announce "Calendar opened, use arrow keys to navigate"
- When calendar closes: Announce "Calendar closed"

### Focus Indicators

- Clear focus ring on input (matches TextInput styling)
- Calendar icon button has visible focus state
- Calendar grid cells have visible focus indicators

### Color Contrast

- All text meets WCAG 2.1 AA contrast requirements (4.5:1 for normal text)
- Error states use sufficient contrast
- Focus indicators are clearly visible

## Performance Considerations

### Conditional Rendering

```typescript
// Only render Calendar when popover is open
{isOpen && (
  <div className="popover">
    <Calendar ... />
  </div>
)}
```

### Memoization

```typescript
// Memoize date parsing/formatting functions
const formattedDate = useMemo(
  () => (value ? formatMMDDYYYY(value) : ''),
  [value]
);

// Memoize onChange handler
const handleDateSelect = useCallback(
  (date: Date | null) => {
    onChange?.(date);
    setIsOpen(false);
  },
  [onChange]
);
```

### Debouncing

```typescript
// Debounce onChange for typed input to avoid excessive re-renders
const debouncedValidation = useMemo(
  () =>
    debounce((value: string) => {
      const parsed = parseMMDDYYYY(value);
      if (parsed) {
        onChange?.(parsed);
      }
    }, 300),
  [onChange]
);
```

### Event Listener Cleanup

```typescript
// Clean up click-outside listener when popover closes
useEffect(() => {
  if (!isOpen) return;

  const handleClickOutside = (event: MouseEvent) => {
    if (!wrapperRef.current?.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [isOpen]);
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/inputs/text-input.tsx`** - Primary reference for input structure, CVA variants, size/error patterns
- **`src/ui/inputs/text-input-field.tsx`** - Reference for field wrapper pattern with label/hint/error composition
- **`src/ui/inputs/calendar.tsx`** - Calendar component to be used in popover
- **`src/ui/inputs/input-label.tsx`** - Label atom for field composition
- **`src/ui/inputs/hint.tsx`** - Hint atom for field composition
- **`src/ui/inputs/error-message.tsx`** - Error atom for field composition
- **`src/ui/inputs/constants.ts`** - Size mapping constants
- **`src/ui/icons/icon.tsx`** - Icon component for calendar icon
- **`src/stories/inputs/text-input.stories.tsx`** - Story patterns and structure reference
- **`src/stories/inputs/calendar.stories.tsx`** - Calendar story patterns

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/date-input.tsx` (REQUIRED)
2. **Field wrapper file**: `src/ui/inputs/date-input-field.tsx` (REQUIRED)
3. **Test file**: `src/ui/inputs/__tests__/date-input.test.tsx` (REQUIRED)
4. **Field test file**: `src/ui/inputs/__tests__/date-input-field.test.tsx` (REQUIRED)
5. **Story file**: `src/stories/inputs/date-input.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required - Full calendar popover displays below input
- **Tablet (md: 768px - 1023px)**: Required - Same as desktop, popover may need positioning adjustments
- **Mobile (< 768px)**: Required - Consider full-width popover or modal presentation

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1988-118007&m=dev
- Screenshot reviewed showing all states and sizes

**Design Specifications**:

**States** (from Figma):

- **Empty**: Placeholder "MM/DD/YYYY", border-border, calendar icon in muted color
- **Hovered**: border-border-hover on the input wrapper
- **Focused**: border-primary, ring-2 ring-primary/20, calendar popover visible
- **Typing**: Same as focused, cursor visible in input
- **Filled**: Date value displayed, primary text color
- **Disabled**: bg-background-secondary, cursor-not-allowed, muted text/icon
- **Disabled-Filled**: Same as disabled with date value shown
- **Error**: border-destructive, error message below with WarningCircle icon
- **Error-Filled**: Same as error with date value shown

**Size Variants** (matching TextInput):

- **sm**: py-1.5 px-3, gap-2, text-sm, icon 16px
- **md**: py-2.5 px-3.5, gap-2.5, text-sm, icon 16px
- **lg**: py-3 px-4, gap-3, text-base, icon 20px (default)

**Colors**:

- Text prefix ("Text"): text-text-tertiary (#889096)
- Placeholder: text-text-tertiary (#889096)
- Filled value: text-text-primary (#11181c)
- Calendar icon: text-text-tertiary (muted state), changes to text-text-secondary on hover
- Border default: border-border (#d7dbdf)
- Border focused: border-primary (#3c61dd)
- Border error: border-destructive (#e54d2e)

**Typography**:

- Label: font-medium, text-md (16px) for lg, text-sm (14px) for sm/md
- Input text: font-normal, text-md for lg, text-sm for sm/md
- Hint: font-normal, text-sm (14px), text-text-tertiary
- Error: font-medium, text-sm (14px), text-destructive

**Spacing**:

- Label to input: pb-3 (12px) for lg, pb-2.5 (10px) for sm/md
- Input to hint/error: pt-2 (8px)
- Calendar icon padding from edge: included in input padding

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/date-input.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic DateInput with placeholder
2. **Sizes Story**: Visual comparison of sm, md, lg sizes
3. **AllStates Story**: Grid showing Empty, Filled, Disabled, Disabled-Filled, Error, Error-Filled states
4. **WithCalendarOpen Story**: Shows the component with calendar popover visible
5. **WithLabel Story**: Basic with InputLabel above
6. **WithHint Story**: With hint text below
7. **WithError Story**: Error state with error message
8. **FieldDefault Story**: DateInputField basic example
9. **FieldWithHint Story**: DateInputField with hint
10. **FieldWithError Story**: DateInputField with error
11. **FieldAllSizes Story**: DateInputField in all sizes
12. **Controlled Story**: Demonstrates controlled value pattern
13. **FormIntegration Story**: Real-world form example
14. **AllCombinations Story**: Comprehensive grid of all size/state combinations

**Story Requirements**:

- Use `satisfies Meta<typeof DateInput>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: "centered"` for individual component stories
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. **Research existing patterns**: Study TextInput, TextInputField, and Calendar implementations
2. **Define component API**: Design props interface following established patterns
3. **Create CVA variants**: Define size and error variants matching TextInput

### Phase 2: Core Implementation

1. **DateInput component**:
   - Create wrapper using TextInput with calendar icon rightAddOn
   - Implement popover/dropdown for Calendar using CSS positioning
   - Handle date formatting (MM/DD/YYYY)
   - Sync input value with calendar selection
   - Manage open/close state for calendar

2. **DateInputField wrapper**:
   - Compose with InputLabel, Hint, ErrorMessage
   - Follow TextInputField pattern for ID generation and ARIA

3. **Date utilities**:
   - Format date to MM/DD/YYYY string
   - Parse MM/DD/YYYY string to Date
   - Validate date format

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

```typescript
// src/ui/inputs/index.ts - Add exports:
export * from './date-input';
export * from './date-input-field';
```

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/inputs/date-input.stories.tsx`
- All variant stories covering sizes, states, and field wrapper
- Interactive controls for size, error, disabled, value, etc.
- Real-world form integration examples
- Responsive behavior demonstrations

## Step by Step Tasks

### Task 1: Create DateInput Core Component

- Create `src/ui/inputs/date-input.tsx`
- Define `DateInputProps` interface extending TextInput patterns
- Create `dateInputWrapperVariants` and `dateInputVariants` CVA definitions
- Implement basic DateInput with:
  - TextInput as base with calendar icon rightAddOn
  - Calendar popover positioned below input
  - Open/close state management (controlled via open prop or internal state)
  - Date value formatting (MM/DD/YYYY)
  - Integration between input changes and calendar selection

### Task 2: Implement Popover Positioning

- Use CSS positioning for calendar dropdown (absolute positioned relative to wrapper)
- Add close-on-click-outside behavior
- Add close-on-escape behavior
- Handle z-index for proper layering
- Consider boundary detection for viewport edges

### Task 3: Implement Date Synchronization

- Create utility functions for date parsing/formatting
- Sync typed input value to calendar display
- Sync calendar selection to input value
- Handle invalid date input gracefully
- Support controlled (value/onChange) and uncontrolled (defaultValue) patterns

### Task 4: Create DateInputField Wrapper

- Create `src/ui/inputs/date-input-field.tsx`
- Compose DateInput with InputLabel, Hint, ErrorMessage
- Follow TextInputField pattern exactly
- Use ID generation with useId()
- Wire up ARIA associations (aria-describedby, aria-invalid)

### Task 5: Write Unit Tests for DateInput

- Create `src/ui/inputs/__tests__/date-input.test.tsx`
- Test rendering with default props
- Test all size variants
- Test error state styling
- Test disabled state
- Test calendar open/close behavior
- Test date selection updates input value
- Test manual input updates calendar
- Test invalid date input handling
- Test keyboard navigation (Tab, Escape, Enter)
- Test accessibility (ARIA attributes)

### Task 6: Write Unit Tests for DateInputField

- Create `src/ui/inputs/__tests__/date-input-field.test.tsx`
- Test label rendering
- Test hint rendering
- Test error message rendering (replaces hint)
- Test ARIA associations
- Test all size variants with label/hint

### Task 7: Create Storybook Stories

- Create `src/stories/inputs/date-input.stories.tsx`
- Implement all required stories:
  - Default
  - Sizes (sm, md, lg comparison)
  - AllStates (grid of all states)
  - WithCalendarOpen (calendar visible)
  - WithLabel (manual composition)
  - WithHint
  - WithError
  - FieldDefault
  - FieldWithHint
  - FieldWithError
  - FieldAllSizes
  - Controlled (value + onChange)
  - FormIntegration (real form example)
  - AllCombinations (comprehensive grid)
- Configure argTypes for all props
- Add JSDoc documentation

### Task 8: Update Barrel Exports

- Update `src/ui/inputs/index.ts` to export:
  - `DateInput`, `dateInputVariants`, `DateInputProps`
  - `DateInputField`, `DateInputFieldProps`

### Task 9: Run Validation Commands

- Execute all validation commands to ensure zero errors
- Fix any issues discovered during validation

## Testing Strategy

### Unit Tests

**DateInput tests:**

- Renders with default props
- Renders all size variants correctly
- Applies error styling when error prop is true
- Renders disabled state correctly
- Opens calendar on input focus
- Opens calendar on calendar icon click
- Closes calendar on outside click
- Closes calendar on Escape key
- Updates input value when date selected from calendar
- Updates calendar when valid date typed in input
- Handles invalid date input gracefully (doesn't crash)
- Formats date as MM/DD/YYYY
- Supports controlled value prop
- Supports uncontrolled defaultValue prop
- Forwards ref correctly
- Applies custom className
- Renders leftAddOn (text prefix) when provided
- Has correct ARIA attributes

**DateInputField tests:**

- Renders label when provided
- Renders hint when provided (and no error)
- Renders error message when provided (replaces hint)
- Generates unique IDs with useId
- Associates label with input via htmlFor
- Sets aria-describedby to error ID when error present
- Sets aria-describedby to hint ID when hint present (no error)
- Sets aria-invalid when error present
- Maps sizes correctly (sm/md -> label sm, lg -> label md)

### Edge Cases

- Empty string value
- Invalid date format entered
- Date out of range (minDate/maxDate if supported)
- Rapid open/close of calendar
- Focus management when calendar opens/closes
- Mobile touch interactions
- Keyboard-only navigation
- Screen reader announcement of selected date
- Calendar positioning near viewport edges

## Acceptance Criteria

### Functional Requirements

- ✅ DateInput renders with calendar icon in rightAddOn position
- ✅ Calendar popover opens on input focus or icon click
- ✅ Calendar popover closes on outside click or Escape key
- ✅ Selected date in calendar updates input value in MM/DD/YYYY format
- ✅ Typed date in input syncs with calendar display
- ✅ All size variants (sm, md, lg) render correctly
- ✅ All states (empty, filled, disabled, error) work as designed
- ✅ Component supports both controlled and uncontrolled patterns
- ✅ DateInputField composes correctly with label, hint, error
- ✅ Component forwards refs correctly
- ✅ Component is accessible (ARIA attributes, keyboard navigation)

### Testing Requirements

- ✅ DateInput unit tests with >90% coverage
- ✅ DateInputField unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/date-input.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **ALL size stories implemented (sm, md, lg)**
- ✅ **ALL state stories implemented (empty, filled, disabled, error)**
- ✅ **WithCalendarOpen story showing popover**
- ✅ **Field wrapper stories (FieldDefault, FieldWithHint, FieldWithError)**
- ✅ **Real-world examples (FormIntegration)**
- ✅ **Comprehensive AllCombinations grid**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { DateInput, DateInputField } from '@/ui'`

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

3. **Run component tests**: `npm test -- date-input`
   - Expected: All DateInput and DateInputField tests pass with >90% coverage
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

### Implementation Considerations

1. **Popover Strategy**: The calendar popover should use CSS absolute positioning relative to the input wrapper, not a portal-based solution. This keeps the implementation simple and avoids z-index complexity. Consider using a small utility hook for click-outside detection.

2. **Date Formatting**: Use a simple date formatting approach without external libraries. The MM/DD/YYYY format is standard and can be implemented with basic Date methods.

3. **Controlled vs Uncontrolled**: Follow the React pattern where `value` prop makes it controlled and `defaultValue` makes it uncontrolled. The Calendar component already supports this pattern.

4. **Calendar Integration**: The existing Calendar component is designed for single-date selection with `mode="single"`. Use `hideActions={true}` to remove Clear/Apply buttons since selection is immediate.

5. **Text Prefix**: The Figma design shows an optional "Text" prefix in the input. This can be achieved via the `leftAddOn` prop inherited from TextInput patterns.

6. **Focus Management**: When the calendar opens, focus should remain on the input so keyboard users can type. When a date is selected from the calendar, focus should return to the input.

### Future Enhancements (Not in Scope)

- **Date range input**: Use Calendar directly with `mode="range"` for date ranges
- **Custom date formats**: Currently fixed to MM/DD/YYYY; consider migration to date-fns if i18n becomes a requirement
- **Portal-based popover**: If overflow issues arise frequently in complex layouts (modals, tables with overflow:hidden), consider migrating to Radix UI Popover or Headless UI Popover
- **Timezone support**: Not supported in v1; would require external library
- **Time picker integration**: Could be added as DateTimePicker in future iteration
- **Localization of month/day names**: Requires i18n library integration

### Migration Path Notes

**Date Library Migration (if needed)**:

- Current: Native Date object with simple parsing/formatting
- Future: date-fns or dayjs for i18n and complex date operations
- Migration would affect: `parseMMDDYYYY`, `formatMMDDYYYY`, `isValidMMDDYYYY`

**Portal Migration (if needed)**:

- Current: CSS absolute positioning
- Future: Radix UI Popover primitive
- Migration would fix: overflow:hidden parent issues, z-index complexity

### Dependencies

No new dependencies required. All functionality can be built using:

- Existing Calendar component
- Existing TextInput patterns
- Phosphor Icons (CalendarBlank)
- CVA for variants
- Native Date object for parsing/formatting
