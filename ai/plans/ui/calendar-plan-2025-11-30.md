# Ui: Calendar

> **Architectural Evaluation**: ✅ **APPROVED** (Score: 93/100)
>
> Evaluated: 2025-11-30 | Evaluator: UI/UX Architecture Agent
>
> See: `/ai/agents/evaluations/calendar-plan-2025-11-30.md`

## Component Description

The Calendar component is a comprehensive date selection interface that enables users to pick single dates or date ranges. It composes multiple atomic calendar components (CalendarDay, CalendarHeader, CalendarTab, CalendarTabs) into a cohesive, interactive calendar widget. The design supports both single-month and dual-month views, optional preset date range tabs, and both single-select and range-select modes.

The Calendar follows the Glow UI design system and provides a rich date selection experience with:

- Month/year navigation with dropdown selectors
- Day-of-week headers (Mo, Tu, We, Th, Fr, Sa, Su)
- Visual distinction for today, previous/next month days, and selected dates
- Date range selection with start/end highlights and in-range styling
- Optional preset tabs for quick range selection (Today, Yesterday, Last week, etc.)
- Clear and Apply action buttons for controlled selection workflows

## User Story

As a user
I want to select dates or date ranges from a visual calendar interface
So that I can efficiently choose specific dates for forms, filters, or scheduling features

## Problem Statement

Currently, the design system has foundational calendar atoms (CalendarDay, CalendarHeader, CalendarTab, CalendarTabs) but lacks a composed Calendar organism that combines these into a usable date picker. Users need a complete, accessible calendar component that handles:

- Month navigation and display
- Single date selection
- Date range selection
- Quick preset selection
- Apply/Clear workflow

## Solution Statement

Create a Calendar organism component that:

1. Composes existing CalendarDay, CalendarHeader, CalendarTab, and CalendarTabs atoms/molecules
2. Supports single-month and dual-month view modes
3. Implements single-select and range-select modes
4. Optionally displays preset date range tabs
5. Provides Clear and Apply action buttons
6. Handles all keyboard navigation and accessibility requirements
7. Uses controlled/uncontrolled patterns for flexible integration

## Atomic Design Classification

**Component Type**: Organism

**Reasoning**: The Calendar is an organism because it composes multiple molecules (CalendarHeader, CalendarTabs) and atoms (CalendarDay, Button) into a complex, self-contained UI section. It has its own internal state management, handles complex user interactions, and represents a distinct functional unit of the interface.

**Composition Requirements**:

- **Required Atoms**:
  - `CalendarDay` from `@/ui/inputs` - Individual day cells
  - `Button` from `@/ui/buttons` - Clear and Apply action buttons
  - `Icon` from `@/ui/icons` - For navigation icons (already used by CalendarHeader)

- **Required Molecules**:
  - `CalendarHeader` from `@/ui/inputs` - Month/year navigation header
  - `CalendarTabs` from `@/ui/inputs` - Preset date range tabs (optional)

## Component Location

**Location**: `src/ui/inputs/calendar.tsx`

**Category**: `inputs` - The Calendar is a form input component for date selection, fitting with other input components like text-input, number-input, and the existing calendar atoms.

**Reasoning**: The calendar-related components (CalendarDay, CalendarHeader, CalendarTab, CalendarTabs) are already in the inputs category. The Calendar organism logically belongs with these related components as a higher-level composition.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/calendar.tsx
export { Calendar, calendarVariants };
export type { CalendarProps, CalendarMode, CalendarValue };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './calendar';

// 3. Root barrel already exports inputs: src/ui/index.ts
export * from './inputs';

// 4. Import usage (recommended):
import { Calendar } from '@/ui';

// 5. Import usage (alternative):
import { Calendar } from '@/ui/inputs';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/inputs/calendar-day.tsx`** - CalendarDay atom for individual day cells
  - Study CVA patterns for variants and compound variants
  - Understand state management (selected, multiSelectStart/Center/End)
  - Reference accessibility patterns (aria-selected, aria-current)

- **`src/ui/inputs/calendar-header.tsx`** - CalendarHeader molecule for navigation
  - Two alignment variants: 'left' and 'center'
  - Month/year selectors with dropdown indicators
  - Previous/next navigation buttons

- **`src/ui/inputs/calendar-tabs.tsx`** - CalendarTabs for preset selection
  - Vertical container with roving tabIndex
  - Controlled/uncontrolled value patterns
  - Keyboard navigation (ArrowUp/Down, Home/End)

- **`src/ui/buttons/button.tsx`** - Button atom for Clear/Apply actions
  - Variant and color combinations for action styling
  - Plain variant for text-style buttons

- **`src/stories/inputs/calendar-day.stories.tsx`** - Story patterns for calendar components
  - Matrix displays for all variant combinations
  - Real-world calendar grid examples
  - Date range selection demonstration

- **`src/ui/inputs/__tests__/calendar-day.test.tsx`** - Testing patterns
  - Rendering tests for all variants
  - Accessibility tests (aria attributes)
  - Interaction tests (click, keyboard)

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/calendar.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/calendar.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/calendar.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required - Primary use case, full feature set
  - Single-month: ~270px width
  - Dual-month: ~664px width with gap between months
  - Optional preset tabs on left side

- **Tablet (md: 768px - 1023px)**: Optional - Component should remain functional
  - May need to stack dual-month vertically

- **Mobile (< 768px)**: Optional - Basic functionality
  - Single-month view recommended
  - Preset tabs could stack above calendar

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1931-110112&m=dev

**Design Specifications** (from Figma analysis):

**Container:**

- Background: `bg-white` (bg-surface-base-primary)
- Border: `border border-border` (border-base-primary, #d7dbdf)
- Border radius: `rounded-lg` (10px)
- Padding: `p-4` (16px)

**Layout Modes:**

1. **Single Month (2 months=False)**:
   - Width: 270px
   - Header: left-aligned with month/year selectors
   - 7-column grid of CalendarDay cells (34px each = 238px)

2. **Dual Month (2 months=True)**:
   - Width: 664px
   - Two month grids side by side with 24px gap
   - Headers: center-aligned with navigation on sides

3. **With Preset Tabs**:
   - Tabs column on left side
   - Tabs: Today, Yesterday, Last week, Last month, Last year, All time

**Day States:**

- Default: text-text-primary (#11181c)
- Today: text-primary (brand blue #3c61dd)
- Previous/Next Month: text-text-tertiary (#889096)
- Selected: bg-fill-primary text-white rounded-sm
- Range Start: bg-fill-primary text-white rounded-l-sm
- Range Center: bg-background-brand-tertiary (#f0f4ff)
- Range End: bg-fill-primary text-white rounded-r-sm
- Hovered: border border-border-brand bg-background-brand-secondary

**Action Buttons:**

- Clear: text-text-tertiary, plain button style
- Apply: text-primary (brand blue), plain button style
- Container: flex justify-between, pt-3

**Typography:**

- Month/Year selectors: text-sm font-semibold (14px, 600)
- Day numbers: text-xs font-normal (12px, 400)
- Day-of-week headers: text-xs font-medium (12px, 500)
- Action buttons: text-sm font-medium (14px, 500)

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/calendar.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic single-month calendar with default props
2. **SingleSelect Story**: Calendar configured for single date selection
3. **RangeSelect Story**: Calendar configured for date range selection
4. **DualMonth Story**: Two-month view for range selection
5. **WithPresets Story**: Calendar with preset date tabs
6. **ControlledValue Story**: Demonstrates controlled mode with external state
7. **DisabledDates Story**: Calendar with certain dates disabled
8. **TodayHighlight Story**: Shows today's date highlighted
9. **AllVariants Story**: Grid showing all mode/view combinations
10. **RealWorldDatePicker Story**: Complete integration example

**Story Requirements**:

- Use `satisfies Meta<typeof Calendar>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: 'centered'`
- Create interactive controls for mode, view, presets, etc.
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. **Type Definitions**

   Define types with discriminated union for type-safe mode/value handling:

   ```typescript
   export type CalendarMode = 'single' | 'range';
   export type CalendarView = 'single-month' | 'dual-month';

   // Type-safe value based on mode
   export type CalendarSingleValue = Date | null;
   export type CalendarRangeValue = {
     start: Date | null;
     end: Date | null;
   };

   // Discriminated union ensures correct value shape for each mode
   export type CalendarValue<M extends CalendarMode = CalendarMode> =
     M extends 'single' ? CalendarSingleValue : CalendarRangeValue;

   // Preset interface for quick date range selection
   export interface CalendarPreset {
     /** Unique identifier for the preset */
     id: string;
     /** Display label for the preset tab */
     label: string;
     /** Function that returns the date range for this preset (dynamic to ensure "Today" is always current) */
     getValue: () => CalendarRangeValue;
     /** Optional icon to display in the preset tab */
     icon?: ComponentType<IconProps>;
     /** Optional description for tooltips */
     description?: string;
   }

   // Generic props interface for type-safe mode handling
   export interface CalendarProps<M extends CalendarMode = 'single'>
     extends
       Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>,
       VariantProps<typeof calendarVariants> {
     /** Selection mode: single date or date range */
     mode?: M;
     /** View mode: single month or dual month display */
     view?: CalendarView;
     /** Controlled value (type depends on mode) */
     value?: CalendarValue<M>;
     /** Default value for uncontrolled mode */
     defaultValue?: CalendarValue<M>;
     /** Callback when selection changes */
     onChange?: (value: CalendarValue<M>) => void;
     /** Callback when Apply is clicked */
     onApply?: (value: CalendarValue<M>) => void;
     /** Callback when Clear is clicked */
     onClear?: () => void;
     /** Show preset tabs on the left side */
     showPresets?: boolean;
     /** Preset configurations (required when showPresets is true) */
     presets?: CalendarPreset[];
     /** Disabled dates (function or array) */
     disabledDates?: Date[] | ((date: Date) => boolean);
     /** Minimum selectable date */
     minDate?: Date;
     /** Maximum selectable date */
     maxDate?: Date;
   }
   ```

2. **Component Signature (forwardRef Pattern)**

   ```typescript
   export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
     (
       {
         mode = 'single',
         view = 'single-month',
         value,
         onChange,
         className,
         ...props
       },
       ref
     ) => {
       // Implementation
     }
   );

   Calendar.displayName = 'Calendar';
   ```

3. **Calendar Container CVA Variants**

   ```typescript
   const calendarVariants = cva(
     ['rounded-lg', 'border border-border', 'bg-white', 'p-4', 'shadow'],
     {
       variants: {
         view: {
           'single-month': 'w-[270px]',
           'dual-month': 'w-[664px]',
         },
       },
       defaultVariants: {
         view: 'single-month',
       },
     }
   );
   ```

4. **Date Utility Functions**

   Start with inline utilities (no external dependencies). Migrate to `date-fns` if international/timezone support is needed later.

   ```typescript
   // Inline utilities in calendar.tsx
   function getMonthDays(year: number, month: number): DayData[][] {
     const firstDay = new Date(year, month, 1);
     const lastDay = new Date(year, month + 1, 0);
     // Returns 2D array of weeks containing day data
   }

   function getWeekDayHeaders(): string[] {
     return ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
   }

   function isSameDay(date1: Date | null, date2: Date | null): boolean {
     if (!date1 || !date2) return false;
     return date1.toDateString() === date2.toDateString();
   }

   function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
     if (!start || !end) return false;
     return date >= start && date <= end;
   }

   function addMonths(date: Date, count: number): Date {
     const result = new Date(date);
     result.setMonth(result.getMonth() + count);
     return result;
   }

   function formatMonthYear(date: Date): string {
     return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
   }
   ```

   **Decision**: Start with inline utilities, migrate to library if:
   - Timezone support required
   - Locale-specific formatting needed
   - Complex date arithmetic (business days, DST handling)

### Phase 2: Core Implementation

1. **Internal Component: CalendarMonth**

   CalendarMonth is an internal helper component (not exported) that renders a single month grid:

   ```typescript
   interface CalendarMonthProps {
     /** Current month (0-11) */
     month: number;
     /** Current year */
     year: number;
     /** Header alignment based on view mode */
     headerAlign: 'left' | 'center';
     /** Currently selected dates */
     selectedDates: Date[];
     /** Range value for highlighting in-range days */
     rangeValue?: CalendarRangeValue;
     /** Disabled dates */
     disabledDates?: Date[] | ((date: Date) => boolean);
     /** Callback when a day is clicked */
     onDayClick: (date: Date) => void;
     /** Callback for month navigation */
     onNavigate: (direction: 'prev' | 'next') => void;
     /** Whether to show navigation buttons (false for right month in dual view) */
     showNavigation?: boolean;
   }

   function CalendarMonth({
     month,
     year,
     headerAlign,
     selectedDates,
     rangeValue,
     onDayClick,
     onNavigate,
     showNavigation = true,
   }: CalendarMonthProps) {
     const monthDays = getMonthDays(year, month);

     return (
       <div className="calendar-month">
         <CalendarHeader
           month={month}
           year={year}
           align={headerAlign}
           onPreviousClick={() => onNavigate('prev')}
           onNextClick={() => onNavigate('next')}
           showNavigation={showNavigation}
         />

         {/* Day of week headers */}
         <div role="row" className="grid grid-cols-7">
           {getWeekDayHeaders().map(day => (
             <CalendarDay key={day} dayType="dayOfWeek" day={day} />
           ))}
         </div>

         {/* Week rows */}
         {monthDays.map((week, idx) => (
           <div key={idx} role="row" className="grid grid-cols-7 gap-y-0.5">
             {week.map(dayData => (
               <CalendarDay
                 key={dayData.date?.toISOString() ?? dayData.day}
                 day={dayData.day}
                 dayType={dayData.type}
                 state={getDayState(dayData, selectedDates, rangeValue)}
                 onClick={() => dayData.date && onDayClick(dayData.date)}
               />
             ))}
           </div>
         ))}
       </div>
     );
   }
   ```

   **Responsibilities:**
   - Render CalendarHeader with appropriate alignment
   - Render day-of-week header row using CalendarDay with `dayType="dayOfWeek"`
   - Render 5-6 week rows with CalendarDay cells
   - Implement `role="grid"` for accessibility
   - Delegate state determination to parent Calendar

2. **Calendar Component Structure**

   ```tsx
   <div
     ref={ref}
     className={cn(calendarVariants({ view }), className)}
     {...props}
   >
     {/* Optional Presets */}
     {showPresets && (
       <CalendarTabs
         items={presets}
         value={activePreset}
         onChange={handlePresetChange}
       />
     )}

     {/* Calendar Content */}
     <div
       className={cn('calendar-content', view === 'dual-month' && 'flex gap-6')}
     >
       {/* First Month Grid */}
       <CalendarMonth
         month={displayedMonth}
         year={displayedYear}
         headerAlign={view === 'single-month' ? 'left' : 'center'}
         selectedDates={selectedDates}
         rangeValue={mode === 'range' ? internalValue : undefined}
         onDayClick={handleDayClick}
         onNavigate={handleNavigate}
       />

       {/* Second Month Grid (dual-month view) */}
       {view === 'dual-month' && (
         <CalendarMonth
           month={nextMonth}
           year={nextYear}
           headerAlign="center"
           selectedDates={selectedDates}
           rangeValue={mode === 'range' ? internalValue : undefined}
           onDayClick={handleDayClick}
           onNavigate={handleNavigate}
           showNavigation={false}
         />
       )}

       {/* Actions */}
       <div className="flex justify-between pt-3">
         <Button variant="plain" color="secondary" onClick={handleClear}>
           Clear
         </Button>
         <Button variant="plain" color="primary" onClick={handleApply}>
           Apply
         </Button>
       </div>
     </div>
   </div>
   ```

3. **State Management Strategy**

   **Controlled State (External):**
   - `value` - Selected date(s), controlled by parent
   - `onChange` - Callback when selection changes

   **Internal State:**
   - Displayed month/year (navigation state) - always internal
   - Hover state for range preview (ephemeral UI state)
   - Focus state for keyboard navigation (ephemeral UI state)

   **Pattern Implementation:**

   ```typescript
   // Use controlled/uncontrolled hook pattern
   const [internalValue, setInternalValue] = useControllableState({
     value,
     onChange,
     defaultValue,
   });

   // Internal navigation state (always uncontrolled)
   const [displayedMonth, setDisplayedMonth] = useState(() =>
     getInitialMonth(internalValue)
   );
   const [displayedYear, setDisplayedYear] = useState(() =>
     getInitialYear(internalValue)
   );

   // Ephemeral UI state
   const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
   const [focusedDate, setFocusedDate] = useState<Date | null>(null);
   ```

4. **Event Handlers**

   ```typescript
   function handleDayClick(date: Date) {
     if (mode === 'single') {
       // Single mode: clicking same date deselects, different date selects
       const newValue = isSameDay(date, internalValue as Date) ? null : date;
       setInternalValue(newValue);
     } else {
       // Range mode: two-click selection
       const range = internalValue as CalendarRangeValue;
       if (!range.start || range.end) {
         // First click or reset after complete range
         setInternalValue({ start: date, end: null });
       } else {
         // Second click - set end and auto-sort
         const [start, end] = [range.start, date].sort(
           (a, b) => a.getTime() - b.getTime()
         );
         setInternalValue({ start, end });
       }
     }
   }

   function handleNavigate(direction: 'prev' | 'next') {
     const delta = direction === 'prev' ? -1 : 1;
     const newDate = addMonths(new Date(displayedYear, displayedMonth), delta);
     setDisplayedMonth(newDate.getMonth());
     setDisplayedYear(newDate.getFullYear());
   }

   function handleClear() {
     setInternalValue(mode === 'single' ? null : { start: null, end: null });
     onClear?.();
   }

   function handleApply() {
     onApply?.(internalValue);
   }
   ```

5. **Keyboard Navigation (WAI-ARIA Calendar Pattern)**

   ```typescript
   function handleKeyDown(event: KeyboardEvent) {
     const { key, shiftKey } = event;

     switch (key) {
       case 'ArrowLeft':
         moveFocus(-1);
         break;
       case 'ArrowRight':
         moveFocus(1);
         break;
       case 'ArrowUp':
         moveFocus(-7);
         break;
       case 'ArrowDown':
         moveFocus(7);
         break;
       case 'Home':
         moveFocusToStartOfWeek();
         break;
       case 'End':
         moveFocusToEndOfWeek();
         break;
       case 'PageUp':
         if (shiftKey) {
           navigateYear(-1); // Shift + Page Up = previous year
         } else {
           navigateMonth(-1); // Page Up = previous month
         }
         break;
       case 'PageDown':
         if (shiftKey) {
           navigateYear(1); // Shift + Page Down = next year
         } else {
           navigateMonth(1); // Page Down = next month
         }
         break;
       case 'Enter':
       case ' ':
         if (focusedDate) {
           handleDayClick(focusedDate);
         }
         break;
     }
   }
   ```

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add `export * from './calendar'` to `src/ui/inputs/index.ts`
- Ensure Calendar is accessible via `import { Calendar } from '@/ui'`

**Storybook Documentation (REQUIRED):**

- Story file: `src/stories/inputs/calendar.stories.tsx`
- All mode/view combinations demonstrated
- Interactive controls for all configurable props
- Real-world usage examples with preset integration
- Accessibility demonstrations

## Step by Step Tasks

### 1. Create Date Utility Functions

- Create helper functions for date manipulation
- Keep utilities colocated within the calendar file or create separate if complex
- Include: getMonthDays, getWeekDayHeaders, isSameDay, isInRange, addMonths, formatMonthYear

### 2. Define TypeScript Interfaces

- Define `CalendarMode` type: 'single' | 'range'
- Define `CalendarView` type: 'single-month' | 'dual-month'
- Define `CalendarValue` discriminated union based on mode
- Define `CalendarPreset` interface for preset configuration
- Define `CalendarProps` with all configuration options
- Include proper JSDoc documentation for all types

### 3. Create CalendarMonth Internal Component

- Create internal `CalendarMonth` component for rendering a single month grid
- Compose CalendarHeader for navigation (respecting view alignment)
- Render day-of-week header row using CalendarDay with dayType="dayOfWeek"
- Render 5-6 week rows with CalendarDay cells
- Handle day click events with proper state determination
- Support month navigation callbacks

### 4. Implement Calendar Main Component

- Create main Calendar component with forwardRef
- Implement CVA variants for container styling
- Handle controlled/uncontrolled value pattern
- Manage internal display month state
- Render single or dual month view based on props
- Integrate CalendarTabs when showPresets is true
- Add Clear and Apply action buttons
- Wire up all event handlers

### 5. Implement Selection Logic

- Single-select mode: click sets value
- Range-select mode: first click sets start, second click sets end
- Handle range reversal when end is before start
- Clear selection functionality
- Apply selection callback

### 6. Implement Keyboard Navigation (WAI-ARIA Calendar Pattern)

- Arrow key navigation between days (left/right = ±1 day, up/down = ±7 days)
- Home/End for first/last day of week
- Page Up/Down for month navigation
- **Shift + Page Up/Down for year navigation** (WAI-ARIA best practice)
- Enter/Space for day selection
- Tab for focus management between sections
- Focus wrapping at month boundaries

### 7. Add Accessibility Features

**ARIA Structure:**

Calendar provides the grid container:

- `role="grid"` on the calendar grid
- `aria-labelledby` pointing to month/year label
- `aria-live="polite"` region for month changes

CalendarDay components provide the cells:

- `role="gridcell"` (already implemented)
- `role="columnheader"` for day-of-week (already implemented)
- `aria-selected`, `aria-current`, `aria-disabled` (already implemented)

Calendar is responsible for keyboard navigation between cells.

**Implementation:**

```tsx
<div role="grid" aria-labelledby="calendar-month-label" aria-label="Date picker">
  {/* Month label for screen readers */}
  <div id="calendar-month-label" className="sr-only">
    {formatMonthYear(new Date(displayedYear, displayedMonth))}
  </div>

  {/* Live region for announcements */}
  <div aria-live="polite" className="sr-only">
    {announcement}
  </div>

  {/* Calendar grid content */}
</div>
```

**Focus Management Strategy:**

1. **Initial Focus**: First selected day or today's date
2. **Grid Navigation**: Arrow keys move focus, wrapping at month boundaries
3. **Section Navigation**: Tab moves between:
   - Preset tabs (if shown)
   - Calendar header (month/year selectors)
   - Day grid
   - Clear/Apply buttons
4. **Focus Trap**: Dialog mode should trap focus within calendar

### 8. Create Comprehensive Unit Tests

- Test file: `src/ui/inputs/__tests__/calendar.test.tsx`
- Test rendering of single-month view
- Test rendering of dual-month view
- Test day selection in single mode
- Test range selection in range mode
- Test month navigation
- Test preset selection integration
- Test Clear and Apply buttons
- Test keyboard navigation
- Test accessibility attributes
- Test controlled/uncontrolled modes
- Target >90% coverage

### 9. Create Storybook Stories (REQUIRED)

- Create `src/stories/inputs/calendar.stories.tsx`
- Configure meta with comprehensive argTypes
- Create Default story with basic usage
- Create SingleSelect story for single date picking
- Create RangeSelect story for date range selection
- Create DualMonth story showing two-month view
- Create WithPresets story with preset tabs
- Create ControlledValue story demonstrating external state
- Create DisabledDates story with date restrictions
- Create AllVariants comparison grid
- Create RealWorldDatePicker integration example
- Add Playground story with all controls

### 10. Update Barrel Exports

- Add `export * from './calendar'` to `src/ui/inputs/index.ts`
- Verify export works via `import { Calendar } from '@/ui'`

### 11. Run Validation Commands

- Execute all validation commands in order
- Fix any issues that arise
- Ensure zero errors and full test coverage

## Testing Strategy

### Unit Tests

**Rendering Tests:**

- Calendar renders with default props
- Single-month view displays correctly
- Dual-month view displays two grids
- Header shows correct month/year
- Day-of-week headers render
- Action buttons render
- Preset tabs render when enabled

**Selection Tests:**

- Single mode: clicking day selects it
- Single mode: clicking same day deselects
- Range mode: clicking first day sets start
- Range mode: clicking second day sets end
- Range mode: end before start reverses range
- Clear button resets selection
- Apply button triggers callback with value

**Navigation Tests:**

- Previous month button decrements displayed month
- Next month button increments displayed month
- Month selector triggers callback
- Year selector triggers callback
- Dual-month navigates both months together

**Keyboard Tests:**

- Arrow keys move focus between days
- Home moves to start of week
- End moves to end of week
- Page Up goes to previous month
- Page Down goes to next month
- Shift + Page Up goes to previous year
- Shift + Page Down goes to next year
- Enter/Space selects focused day
- Focus wraps correctly at month boundaries

**Accessibility Tests:**

- Calendar has appropriate role
- Days have aria-selected when selected
- Today has aria-current="date"
- Disabled days have aria-disabled
- Month changes are announced

### Edge Cases

- Leap year February handling
- Month transitions at boundaries
- Empty cells at start/end of month
- Range spanning multiple months
- Today at month boundaries
- Min/max date restrictions
- Initial value outside displayed month

## Acceptance Criteria

### Functional Requirements

- ✅ Calendar implemented in `src/ui/inputs/calendar.tsx` with proper TypeScript types
- ✅ Single-month view displays correctly with navigation
- ✅ Dual-month view displays two adjacent months
- ✅ Single-select mode allows picking one date
- ✅ Range-select mode allows picking start and end dates
- ✅ Range selection shows proper visual states (start, center, end)
- ✅ Today's date is visually distinguished
- ✅ Previous/next month days are grayed out
- ✅ Month navigation works via buttons and selectors
- ✅ Preset tabs integrate correctly when enabled
- ✅ Clear button resets selection
- ✅ Apply button triggers callback
- ✅ Component forwards refs correctly
- ✅ Component follows design system patterns (CVA, semantic tokens)

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All rendering scenarios tested
- ✅ All selection modes tested
- ✅ All navigation methods tested
- ✅ Keyboard navigation tested
- ✅ Accessibility attributes tested
- ✅ Edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/calendar.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **SingleSelect story for single date mode**
- ✅ **RangeSelect story for date range mode**
- ✅ **DualMonth story for two-month view**
- ✅ **WithPresets story with preset tabs**
- ✅ **ControlledValue story demonstrating external state**
- ✅ **AllVariants comparison grid**
- ✅ **RealWorldDatePicker integration example**
- ✅ **Playground story with all interactive controls**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { Calendar } from '@/ui'`

### Code Quality

- ✅ Zero TypeScript errors: `npm run type-check`
- ✅ Zero ESLint warnings: `npm run lint`
- ✅ Build succeeds: `npm run build`

## Validation Commands

**Required Validation Commands for ALL Components** (execute in order):

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- calendar`
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

### Implementation Considerations

1. **Date Library**: Consider using native Date API for simplicity. If locale support or complex date math is needed, evaluate adding `date-fns` (tree-shakeable) vs implementing utilities manually.

2. **Performance**: For large date ranges, consider memoizing day cell calculations. The component should be efficient even when rapidly navigating months.

3. **Internationalization**: Current design uses English day abbreviations (Mo, Tu, etc.). Future enhancement could support Intl.DateTimeFormat for localized headers.

4. **Time Zones**: The component works with Date objects and should handle timezone-aware dates gracefully. Document any timezone assumptions.

5. **Integration Patterns**: The Calendar can be used standalone or composed into higher-level components like DatePicker (with popover trigger) or DateRangePicker (with dual inputs).

### Future Enhancements

- Month/Year picker views (grid of months, grid of years)
- Custom disabled date function
- Min/max date restrictions
- Week number display
- Custom day rendering slot
- Multiple date selection (not just range)
- Time selection integration

### Design System Alignment

- Uses existing semantic color tokens (fill-primary, background-brand-tertiary, etc.)
- Follows CVA pattern for variant composition
- Composes existing atoms (CalendarDay, Button) rather than recreating
- Maintains consistent 34px day cell size from CalendarDay
- Uses standard spacing tokens (gap-0.5 = 2px between week rows)
