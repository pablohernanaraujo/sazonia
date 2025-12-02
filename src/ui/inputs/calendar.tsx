import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Button } from '@/ui/buttons';

import {
  CalendarDay,
  type CalendarDayState,
  type CalendarDayType,
} from './calendar-day';
import { CalendarHeader } from './calendar-header';
import { type CalendarTabItem, CalendarTabs } from './calendar-tabs';

// ============================================================================
// Date Utility Functions
// ============================================================================

/**
 * Day-of-week headers starting from Monday.
 */
const WEEK_DAY_HEADERS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;

/**
 * Month names for formatting.
 */
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/**
 * Short month names for header display.
 */
const MONTH_SHORT_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/**
 * Data structure for a single day cell in the calendar grid.
 */
interface DayData {
  /** Day number to display */
  day: number;
  /** The full Date object for this day */
  date: Date;
  /** Visual type of the day */
  type: CalendarDayType;
  /** Whether this is today's date */
  isToday: boolean;
}

/**
 * Checks if two dates are the same day (ignoring time).
 */
function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return date1.toDateString() === date2.toDateString();
}

/**
 * Checks if a date falls within a range (inclusive).
 */
function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
}

/**
 * Adds months to a date, returning a new Date object.
 */
function addMonths(date: Date, count: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + count);
  return result;
}

/**
 * Gets the number of days in a month.
 */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Gets the day of week (0-6, Monday = 0, Sunday = 6) for a given date.
 */
function getDayOfWeek(date: Date): number {
  const day = date.getDay();
  // Convert Sunday (0) to 6, and shift other days back by 1
  return day === 0 ? 6 : day - 1;
}

/**
 * Map of keyboard keys to date offset calculation functions.
 * Returns the new date based on the key pressed.
 */
type KeyNavigationHandler = (
  date: Date,
  shiftKey: boolean
) => Date | null | 'select';

const keyNavigationHandlers: Record<string, KeyNavigationHandler> = {
  ArrowLeft: (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    return newDate;
  },
  ArrowRight: (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  },
  ArrowUp: (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 7);
    return newDate;
  },
  ArrowDown: (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 7);
    return newDate;
  },
  Home: (date) => {
    const newDate = new Date(date);
    const dayOfWeek = getDayOfWeek(date);
    newDate.setDate(newDate.getDate() - dayOfWeek);
    return newDate;
  },
  End: (date) => {
    const newDate = new Date(date);
    const daysToSunday = 6 - getDayOfWeek(date);
    newDate.setDate(newDate.getDate() + daysToSunday);
    return newDate;
  },
  PageUp: (date, shiftKey) => {
    if (shiftKey) {
      const newDate = new Date(date);
      newDate.setFullYear(newDate.getFullYear() - 1);
      return newDate;
    }
    return addMonths(date, -1);
  },
  PageDown: (date, shiftKey) => {
    if (shiftKey) {
      const newDate = new Date(date);
      newDate.setFullYear(newDate.getFullYear() + 1);
      return newDate;
    }
    return addMonths(date, 1);
  },
  Enter: () => 'select',
  ' ': () => 'select',
};

/**
 * Generates the day data for a calendar month grid.
 * Returns a 2D array of weeks (each week is 7 days).
 */
function getMonthDays(year: number, month: number): DayData[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1);
  const daysInMonth = getDaysInMonth(year, month);
  const startDayOfWeek = getDayOfWeek(firstDay);

  // Get previous month's last days to fill the first week
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const weeks: DayData[][] = [];
  let currentWeek: DayData[] = [];

  // Add days from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(prevYear, prevMonth, day);
    currentWeek.push({
      day,
      date,
      type: 'previousMonth',
      isToday: isSameDay(date, today),
    });
  }

  // Add days from current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isToday = isSameDay(date, today);

    currentWeek.push({
      day,
      date,
      type: isToday ? 'today' : 'default',
      isToday,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Add days from next month to complete the last week
  if (currentWeek.length > 0) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    let nextDay = 1;

    while (currentWeek.length < 7) {
      const date = new Date(nextYear, nextMonth, nextDay);
      currentWeek.push({
        day: nextDay,
        date,
        type: 'nextMonth',
        isToday: isSameDay(date, today),
      });
      nextDay++;
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

/**
 * Formats a month and year for display.
 */
function formatMonthYear(month: number, year: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Calendar selection mode.
 * - `single`: Select a single date
 * - `range`: Select a date range (start and end)
 */
export type CalendarMode = 'single' | 'range';

/**
 * Calendar view mode.
 * - `single-month`: Display one month
 * - `dual-month`: Display two adjacent months
 */
export type CalendarView = 'single-month' | 'dual-month';

/**
 * Value type for single date selection.
 */
export type CalendarSingleValue = Date | null;

/**
 * Value type for date range selection.
 */
export interface CalendarRangeValue {
  start: Date | null;
  end: Date | null;
}

/**
 * Type-safe value based on selection mode.
 */
export type CalendarValue<M extends CalendarMode = CalendarMode> =
  M extends 'single' ? CalendarSingleValue : CalendarRangeValue;

/**
 * Preset configuration for quick date range selection.
 */
export interface CalendarPreset {
  /** Unique identifier for the preset */
  id: string;
  /** Display label for the preset tab */
  label: string;
  /** Function that returns the date range for this preset */
  getValue: () => CalendarRangeValue;
}

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * Calendar container variant styles using Class Variance Authority (CVA).
 */
const calendarVariants = cva(
  ['rounded-lg', 'border border-border', 'bg-white', 'p-4', 'shadow-sm'],
  {
    variants: {
      view: {
        'single-month': 'w-[270px]',
        'dual-month': 'w-fit',
      },
    },
    defaultVariants: {
      view: 'single-month',
    },
  }
);

export type CalendarVariants = VariantProps<typeof calendarVariants>;

// ============================================================================
// Props Interface
// ============================================================================

export interface CalendarProps
  extends
    Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'>,
    CalendarVariants {
  /**
   * Selection mode: single date or date range.
   * @default 'single'
   */
  mode?: CalendarMode;
  /**
   * View mode: single month or dual month display.
   * @default 'single-month'
   */
  view?: CalendarView;
  /**
   * Controlled value. Type depends on mode:
   * - single mode: Date | null
   * - range mode: { start: Date | null, end: Date | null }
   */
  value?: CalendarValue;
  /**
   * Default value for uncontrolled mode.
   */
  defaultValue?: CalendarValue;
  /**
   * Callback when selection changes.
   */
  onChange?: (value: CalendarValue) => void;
  /**
   * Callback when Apply button is clicked.
   */
  onApply?: (value: CalendarValue) => void;
  /**
   * Callback when Clear button is clicked.
   */
  onClear?: () => void;
  /**
   * Show preset tabs on the left side (only applies to range mode).
   * @default false
   */
  showPresets?: boolean;
  /**
   * Preset configurations for quick range selection.
   * Required when showPresets is true.
   */
  presets?: CalendarPreset[];
  /**
   * Dates to disable. Can be an array of dates or a function.
   */
  disabledDates?: Date[] | ((date: Date) => boolean);
  /**
   * Minimum selectable date.
   */
  minDate?: Date;
  /**
   * Maximum selectable date.
   */
  maxDate?: Date;
  /**
   * Hide the action buttons (Clear and Apply).
   * @default false
   */
  hideActions?: boolean;
}

// ============================================================================
// Day State Helper Functions
// ============================================================================

/**
 * Gets the day state for single selection mode.
 */
function getSingleModeState(
  date: Date,
  value: CalendarSingleValue
): CalendarDayState | null {
  if (isSameDay(date, value)) {
    return 'selected';
  }
  return null;
}

/**
 * Gets the day state for range selection mode with completed range.
 */
function getRangeModeState(
  date: Date,
  start: Date | null,
  end: Date | null
): CalendarDayState | null {
  if (isSameDay(date, start)) {
    if (isSameDay(start, end)) {
      return 'selected';
    }
    return 'multiSelectStart';
  }
  if (isSameDay(date, end)) {
    return 'multiSelectEnd';
  }
  if (start && end && isInRange(date, start, end)) {
    return 'multiSelectCenter';
  }
  return null;
}

/**
 * Gets the day state for hover preview in range mode.
 */
function getHoverPreviewState(
  date: Date,
  start: Date,
  hoverDate: Date
): CalendarDayState | null {
  const [previewStart, previewEnd] =
    start <= hoverDate ? [start, hoverDate] : [hoverDate, start];

  if (isSameDay(date, previewStart) && !isSameDay(date, start)) {
    return 'multiSelectStart';
  }
  if (isSameDay(date, previewEnd)) {
    return 'multiSelectEnd';
  }
  if (isInRange(date, previewStart, previewEnd)) {
    return 'multiSelectCenter';
  }
  return null;
}

/**
 * Gets default value based on mode.
 */
function getDefaultCalendarValue(
  mode: CalendarMode,
  defaultValue?: CalendarValue
): CalendarValue {
  if (defaultValue !== undefined) return defaultValue;
  return mode === 'single' ? null : { start: null, end: null };
}

/**
 * Gets initial month/year based on current value.
 */
function getInitialMonthYear(
  mode: CalendarMode,
  currentValue: CalendarValue
): { month: number; year: number } {
  const today = new Date();
  let initialDate = today;

  if (mode === 'single' && currentValue) {
    initialDate = currentValue as Date;
  } else if (mode === 'range') {
    const rangeValue = currentValue as CalendarRangeValue;
    if (rangeValue?.start) {
      initialDate = rangeValue.start;
    }
  }

  return {
    month: initialDate.getMonth(),
    year: initialDate.getFullYear(),
  };
}

/**
 * Handles single mode day click - toggles selection.
 */
function handleSingleModeClick(
  date: Date,
  currentValue: CalendarSingleValue
): CalendarSingleValue {
  return isSameDay(date, currentValue) ? null : date;
}

/**
 * Handles range mode day click - manages two-click selection.
 */
function handleRangeModeClick(
  date: Date,
  rangeValue: CalendarRangeValue | null
): CalendarRangeValue {
  const start = rangeValue?.start ?? null;
  const end = rangeValue?.end ?? null;

  if (!start || end) {
    // First click or reset after complete range
    return { start: date, end: null };
  }

  // Second click - set end and auto-sort
  const [sortedStart, sortedEnd] = start <= date ? [start, date] : [date, start];
  return { start: sortedStart, end: sortedEnd };
}

/**
 * Finds a preset by ID and returns its value.
 */
function findPresetValue(
  presets: CalendarPreset[],
  presetId: string
): CalendarRangeValue | null {
  const preset = presets.find((p) => p.id === presetId);
  return preset ? preset.getValue() : null;
}

/**
 * Gets the empty value based on mode.
 */
function getEmptyValue(mode: CalendarMode): CalendarValue {
  return mode === 'single' ? null : { start: null, end: null };
}

type CalendarViewState = 'days' | 'months' | 'years';

/**
 * Gets today's date normalized to midnight.
 */
function getTodayNormalized(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Toggles between days and months view.
 */
function toggleMonthsView(current: CalendarViewState): CalendarViewState {
  return current === 'months' ? 'days' : 'months';
}

/**
 * Toggles between days and years view.
 */
function toggleYearsView(current: CalendarViewState): CalendarViewState {
  return current === 'years' ? 'days' : 'years';
}

// ============================================================================
// Internal Components
// ============================================================================

interface CalendarMonthGridProps {
  month: number;
  year: number;
  headerAlign: 'left' | 'center';
  mode: CalendarMode;
  value: CalendarValue;
  hoverDate: Date | null;
  disabledDates?: Date[] | ((date: Date) => boolean);
  minDate?: Date;
  maxDate?: Date;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date | null) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  showNavigation?: boolean;
  onMonthClick?: () => void;
  onYearClick?: () => void;
  focusedDate: Date | null;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

/**
 * Internal component that renders a single month grid.
 */
function CalendarMonthGrid({
  month,
  year,
  headerAlign,
  mode,
  value,
  hoverDate,
  disabledDates,
  minDate,
  maxDate,
  onDayClick,
  onDayHover,
  onNavigate,
  showNavigation = true,
  onMonthClick,
  onYearClick,
  focusedDate,
  onKeyDown,
}: CalendarMonthGridProps): React.ReactElement {
  const monthDays = useMemo(() => getMonthDays(year, month), [year, month]);

  /**
   * Checks if a date is disabled.
   */
  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      if (!disabledDates) return false;
      if (Array.isArray(disabledDates)) {
        return disabledDates.some((d) => isSameDay(d, date));
      }
      return disabledDates(date);
    },
    [disabledDates, minDate, maxDate]
  );

  /**
   * Determines the visual state of a day cell.
   */
  const getDayState = useCallback(
    (dayData: DayData): CalendarDayState => {
      const { date } = dayData;

      if (isDateDisabled(date)) {
        return 'disabled';
      }

      if (mode === 'single') {
        return (
          getSingleModeState(date, value as CalendarSingleValue) ?? 'default'
        );
      }

      const rangeValue = value as CalendarRangeValue;
      const { start, end } = rangeValue;

      // Check completed range state
      const rangeState = getRangeModeState(date, start, end);
      if (rangeState) {
        return rangeState;
      }

      // Check hover preview state
      if (start && !end && hoverDate) {
        const hoverState = getHoverPreviewState(date, start, hoverDate);
        if (hoverState) {
          return hoverState;
        }
      }

      return 'default';
    },
    [mode, value, hoverDate, isDateDisabled]
  );

  return (
    <div className="calendar-month">
      {/* Header */}
      <CalendarHeader
        align={headerAlign}
        month={headerAlign === 'left' ? MONTH_SHORT_NAMES[month] : undefined}
        year={headerAlign === 'left' ? year : undefined}
        monthYearCombined={
          headerAlign === 'center' ? formatMonthYear(month, year) : undefined
        }
        onPreviousClick={showNavigation ? () => onNavigate('prev') : undefined}
        onNextClick={showNavigation ? () => onNavigate('next') : undefined}
        onMonthClick={onMonthClick}
        onYearClick={onYearClick}
        className="mb-2"
      />

      {/* Day grid */}
      <div
        role="grid"
        aria-label={formatMonthYear(month, year)}
        onKeyDown={onKeyDown}
      >
        {/* Day of week headers */}
        <div role="row" className="grid grid-cols-7">
          {WEEK_DAY_HEADERS.map((day) => (
            <CalendarDay key={day} day={day} dayType="dayOfWeek" />
          ))}
        </div>

        {/* Week rows */}
        {monthDays.map((week, weekIndex) => (
          <div key={weekIndex} role="row" className="grid grid-cols-7">
            {week.map((dayData) => {
              const state = getDayState(dayData);
              const isFocused = isSameDay(dayData.date, focusedDate);

              return (
                <CalendarDay
                  key={dayData.date.toISOString()}
                  day={dayData.day}
                  dayType={dayData.type}
                  state={state}
                  isToday={dayData.isToday}
                  disabled={state === 'disabled'}
                  tabIndex={isFocused ? 0 : -1}
                  onClick={() => onDayClick(dayData.date)}
                  onMouseEnter={() => onDayHover(dayData.date)}
                  onMouseLeave={() => onDayHover(null)}
                  aria-label={dayData.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Month Picker Component
// ============================================================================

interface MonthPickerProps {
  year: number;
  selectedMonth: number;
  onMonthSelect: (month: number) => void;
  onYearChange: (delta: number) => void;
}

/**
 * Internal component for month selection grid.
 */
function MonthPicker({
  year,
  selectedMonth,
  onMonthSelect,
  onYearChange,
}: MonthPickerProps): React.ReactElement {
  return (
    <div className="month-picker">
      {/* Year navigation header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onYearChange(-1)}
          className="rounded-sm p-1.5 text-text-secondary hover:bg-background-secondary hover:text-text-primary"
          aria-label="Previous year"
        >
          ←
        </button>
        <span className="text-sm font-semibold text-text-primary">{year}</span>
        <button
          type="button"
          onClick={() => onYearChange(1)}
          className="rounded-sm p-1.5 text-text-secondary hover:bg-background-secondary hover:text-text-primary"
          aria-label="Next year"
        >
          →
        </button>
      </div>

      {/* Month grid - 3 columns x 4 rows */}
      <div className="grid grid-cols-3 gap-1">
        {MONTH_SHORT_NAMES.map((monthName, index) => {
          const isSelected = index === selectedMonth;
          return (
            <button
              key={monthName}
              type="button"
              onClick={() => onMonthSelect(index)}
              className={cn(
                'rounded-sm px-2 py-2 text-sm transition-colors',
                isSelected
                  ? 'bg-background-brand-primary text-white'
                  : 'text-text-primary hover:bg-background-secondary'
              )}
              aria-label={MONTH_NAMES[index]}
              aria-pressed={isSelected}
            >
              {monthName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Year Picker Component
// ============================================================================

interface YearPickerProps {
  selectedYear: number;
  onYearSelect: (year: number) => void;
  minYear?: number;
  maxYear?: number;
}

/**
 * Internal component for year selection grid.
 */
function YearPicker({
  selectedYear,
  onYearSelect,
  minYear,
  maxYear,
}: YearPickerProps): React.ReactElement {
  // Show 12 years centered around the selected year
  const startYear = selectedYear - 5;
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);

  const handleDecadeChange = (delta: number): void => {
    onYearSelect(selectedYear + delta * 10);
  };

  return (
    <div className="year-picker">
      {/* Decade navigation header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => handleDecadeChange(-1)}
          className="rounded-sm p-1.5 text-text-secondary hover:bg-background-secondary hover:text-text-primary"
          aria-label="Previous decade"
        >
          ←
        </button>
        <span className="text-sm font-semibold text-text-primary">
          {years[0]} - {years[years.length - 1]}
        </span>
        <button
          type="button"
          onClick={() => handleDecadeChange(1)}
          className="rounded-sm p-1.5 text-text-secondary hover:bg-background-secondary hover:text-text-primary"
          aria-label="Next decade"
        >
          →
        </button>
      </div>

      {/* Year grid - 3 columns x 4 rows */}
      <div className="grid grid-cols-3 gap-1">
        {years.map((year) => {
          const isSelected = year === selectedYear;
          const isDisabled =
            (minYear !== undefined && year < minYear) ||
            (maxYear !== undefined && year > maxYear);

          return (
            <button
              key={year}
              type="button"
              onClick={() => !isDisabled && onYearSelect(year)}
              disabled={isDisabled}
              className={cn(
                'rounded-sm px-2 py-2 text-sm transition-colors',
                isSelected
                  ? 'bg-background-brand-primary text-white'
                  : isDisabled
                    ? 'cursor-not-allowed text-text-tertiary'
                    : 'text-text-primary hover:bg-background-secondary'
              )}
              aria-pressed={isSelected}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Calendar - A comprehensive date selection interface.
 *
 * Enables users to pick single dates or date ranges with support for:
 * - Single-month and dual-month views
 * - Single-select and range-select modes
 * - Optional preset date range tabs
 * - Clear and Apply action buttons
 * - Full keyboard navigation (WAI-ARIA Calendar Pattern)
 *
 * @example
 * ```tsx
 * import { Calendar } from '@/ui';
 *
 * // Basic single date selection
 * <Calendar
 *   mode="single"
 *   value={selectedDate}
 *   onChange={setSelectedDate}
 * />
 *
 * // Date range selection with dual-month view
 * <Calendar
 *   mode="range"
 *   view="dual-month"
 *   value={dateRange}
 *   onChange={setDateRange}
 * />
 *
 * // With preset tabs
 * <Calendar
 *   mode="range"
 *   showPresets
 *   presets={[
 *     { id: 'today', label: 'Today', getValue: () => ({ start: new Date(), end: new Date() }) },
 *     { id: 'week', label: 'This week', getValue: () => getThisWeekRange() },
 *   ]}
 * />
 * ```
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      mode = 'single',
      view = 'single-month',
      value: controlledValue,
      defaultValue,
      onChange,
      onApply,
      onClear,
      showPresets = false,
      presets = [],
      disabledDates,
      minDate,
      maxDate,
      hideActions = false,
      className,
      ...props
    },
    ref
    // eslint-disable-next-line complexity
  ) => {
    const gridRef = useRef<HTMLDivElement>(null);

    // ========================================================================
    // State Management
    // ========================================================================

    // Determine if controlled
    const isControlled = controlledValue !== undefined;

    // Internal value state for uncontrolled mode
    const [internalValue, setInternalValue] = useState<CalendarValue>(() =>
      getDefaultCalendarValue(mode, defaultValue)
    );

    // Current value based on controlled/uncontrolled mode
    const currentValue = isControlled ? controlledValue : internalValue;

    // Displayed month/year state (navigation)
    const [displayedMonth, setDisplayedMonth] = useState(
      () => getInitialMonthYear(mode, currentValue).month
    );
    const [displayedYear, setDisplayedYear] = useState(
      () => getInitialMonthYear(mode, currentValue).year
    );

    // Hover state for range preview
    const [hoverDate, setHoverDate] = useState<Date | null>(null);

    // Focused date for keyboard navigation
    const [focusedDate, setFocusedDate] = useState<Date | null>(
      getTodayNormalized
    );

    // Active preset for preset tabs
    const [activePreset, setActivePreset] = useState<string | undefined>();

    // View state for month/year picker
    const [viewState, setViewState] = useState<CalendarViewState>('days');

    // ========================================================================
    // Handlers
    // ========================================================================

    /**
     * Updates the value in controlled or uncontrolled mode.
     */
    const updateValue = useCallback(
      (newValue: CalendarValue) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
        // Clear active preset when manually selecting dates
        setActivePreset(undefined);
      },
      [isControlled, onChange]
    );

    /**
     * Handles clicking on a day.
     */
    const handleDayClick = useCallback(
      (date: Date) => {
        const newValue =
          mode === 'single'
            ? handleSingleModeClick(date, currentValue as CalendarSingleValue)
            : handleRangeModeClick(date, currentValue as CalendarRangeValue);
        updateValue(newValue);
        setFocusedDate(date);
      },
      [mode, currentValue, updateValue]
    );

    /**
     * Handles month navigation.
     */
    const handleNavigate = useCallback(
      (direction: 'prev' | 'next') => {
        const delta = direction === 'prev' ? -1 : 1;
        const newDate = addMonths(new Date(displayedYear, displayedMonth), delta);
        setDisplayedMonth(newDate.getMonth());
        setDisplayedYear(newDate.getFullYear());
      },
      [displayedMonth, displayedYear]
    );

    /**
     * Handles clearing the selection.
     */
    const handleClear = useCallback(() => {
      updateValue(getEmptyValue(mode));
      setActivePreset(undefined);
      onClear?.();
    }, [mode, updateValue, onClear]);

    /**
     * Handles applying the selection.
     */
    const handleApply = useCallback(() => {
      onApply?.(currentValue!);
    }, [currentValue, onApply]);

    /**
     * Handles preset tab selection.
     */
    const handlePresetChange = useCallback(
      (presetId: string) => {
        const rangeValue = findPresetValue(presets, presetId);
        if (!rangeValue) return;

        updateValue(rangeValue);
        setActivePreset(presetId);

        // Navigate to show the start date
        if (rangeValue.start) {
          setDisplayedMonth(rangeValue.start.getMonth());
          setDisplayedYear(rangeValue.start.getFullYear());
        }
      },
      [presets, updateValue]
    );

    /**
     * Handles month selector click - opens month picker.
     */
    const handleMonthClick = useCallback(() => {
      setViewState(toggleMonthsView);
    }, []);

    /**
     * Handles year selector click - opens year picker.
     */
    const handleYearClick = useCallback(() => {
      setViewState(toggleYearsView);
    }, []);

    /**
     * Handles month selection from month picker.
     */
    const handleMonthSelect = useCallback((month: number) => {
      setDisplayedMonth(month);
      setViewState('days');
    }, []);

    /**
     * Handles year selection from year picker.
     */
    const handleYearSelect = useCallback((year: number) => {
      setDisplayedYear(year);
      setViewState('days');
    }, []);

    /**
     * Handles year change in month picker.
     */
    const handleYearChangeInMonthPicker = useCallback((delta: number) => {
      setDisplayedYear((current) => current + delta);
    }, []);

    /**
     * Handles keyboard navigation (WAI-ARIA Calendar Pattern).
     */
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (!focusedDate) return;

        const handler = keyNavigationHandlers[event.key];
        if (!handler) return;

        event.preventDefault();
        const result = handler(focusedDate, event.shiftKey);

        if (result === 'select') {
          handleDayClick(focusedDate);
          return;
        }

        if (result) {
          setFocusedDate(result);

          // Update displayed month if focus moves outside current view
          if (
            result.getMonth() !== displayedMonth ||
            result.getFullYear() !== displayedYear
          ) {
            setDisplayedMonth(result.getMonth());
            setDisplayedYear(result.getFullYear());
          }
        }
      },
      [focusedDate, displayedMonth, displayedYear, handleDayClick]
    );

    // ========================================================================
    // Computed Values
    // ========================================================================

    // Calculate next month for dual-month view
    const nextMonth = useMemo(() => {
      const next = addMonths(new Date(displayedYear, displayedMonth), 1);
      return { month: next.getMonth(), year: next.getFullYear() };
    }, [displayedMonth, displayedYear]);

    // Convert presets to CalendarTabItem format
    const presetItems: CalendarTabItem[] = useMemo(
      () =>
        presets.map((preset) => ({
          value: preset.id,
          label: preset.label,
        })),
      [presets]
    );

    // ========================================================================
    // Render
    // ========================================================================

    const showPresetsPanel =
      showPresets && mode === 'range' && presets.length > 0;

    return (
      <div
        ref={ref}
        className={cn(
          calendarVariants({ view }),
          showPresetsPanel && 'flex w-fit gap-4',
          className
        )}
        {...props}
      >
        {/* Preset Tabs */}
        {showPresetsPanel && (
          <div className="border-r border-border pr-4">
            <CalendarTabs
              items={presetItems}
              value={activePreset}
              onValueChange={handlePresetChange}
              aria-label="Date range presets"
            />
          </div>
        )}

        {/* Calendar Content */}
        <div
          ref={gridRef}
          className={cn(
            'calendar-content',
            view === 'dual-month' && viewState === 'days' && 'flex gap-6'
          )}
        >
          {/* Month Picker View */}
          {viewState === 'months' && (
            <MonthPicker
              year={displayedYear}
              selectedMonth={displayedMonth}
              onMonthSelect={handleMonthSelect}
              onYearChange={handleYearChangeInMonthPicker}
            />
          )}

          {/* Year Picker View */}
          {viewState === 'years' && (
            <YearPicker
              selectedYear={displayedYear}
              onYearSelect={handleYearSelect}
              minYear={minDate?.getFullYear()}
              maxYear={maxDate?.getFullYear()}
            />
          )}

          {/* Days View - First Month */}
          {viewState === 'days' && (
            <>
              <CalendarMonthGrid
                month={displayedMonth}
                year={displayedYear}
                headerAlign={view === 'single-month' ? 'left' : 'center'}
                mode={mode}
                value={currentValue!}
                hoverDate={hoverDate}
                disabledDates={disabledDates}
                minDate={minDate}
                maxDate={maxDate}
                onDayClick={handleDayClick}
                onDayHover={setHoverDate}
                onNavigate={handleNavigate}
                showNavigation={view === 'single-month'}
                onMonthClick={handleMonthClick}
                onYearClick={handleYearClick}
                focusedDate={focusedDate}
                onKeyDown={handleKeyDown}
              />

              {/* Second Month (dual-month view) */}
              {view === 'dual-month' && (
                <>
                  {/* Navigation buttons in center for dual-month */}
                  <div className="flex flex-col items-center justify-start pt-1">
                    <Button
                      variant="plain"
                      color="secondary"
                      size="sm"
                      aria-label="Previous month"
                      onClick={() => handleNavigate('prev')}
                      className="mb-1"
                    >
                      ←
                    </Button>
                    <Button
                      variant="plain"
                      color="secondary"
                      size="sm"
                      aria-label="Next month"
                      onClick={() => handleNavigate('next')}
                    >
                      →
                    </Button>
                  </div>

                  <CalendarMonthGrid
                    month={nextMonth.month}
                    year={nextMonth.year}
                    headerAlign="center"
                    mode={mode}
                    value={currentValue!}
                    hoverDate={hoverDate}
                    disabledDates={disabledDates}
                    minDate={minDate}
                    maxDate={maxDate}
                    onDayClick={handleDayClick}
                    onDayHover={setHoverDate}
                    onNavigate={handleNavigate}
                    showNavigation={false}
                    focusedDate={focusedDate}
                    onKeyDown={handleKeyDown}
                  />
                </>
              )}
            </>
          )}

          {/* Action Buttons */}
          {!hideActions && viewState === 'days' && (
            <div className="mt-3 flex justify-between border-t border-border pt-3">
              <Button
                variant="plain"
                color="secondary"
                size="sm"
                onClick={handleClear}
              >
                Clear
              </Button>
              <Button
                variant="plain"
                color="primary"
                size="sm"
                onClick={handleApply}
              >
                Apply
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';

export { calendarVariants };
