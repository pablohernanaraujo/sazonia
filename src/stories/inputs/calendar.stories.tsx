import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Calendar,
  type CalendarPreset,
  type CalendarRangeValue,
  type CalendarSingleValue,
} from '@/ui/inputs';

/**
 * The Calendar component is a comprehensive date selection interface that enables
 * users to pick single dates or date ranges. It composes multiple atomic calendar
 * components (CalendarDay, CalendarHeader, CalendarTab, CalendarTabs) into a
 * cohesive, interactive calendar widget.
 *
 * ## Features
 * - **Two Modes**: Single date selection or date range selection
 * - **Two Views**: Single-month or dual-month display
 * - **Preset Support**: Optional preset tabs for quick range selection
 * - **Full Accessibility**: WAI-ARIA compliant with keyboard navigation
 * - **Controlled/Uncontrolled**: Flexible state management patterns
 *
 * ## Usage
 * ```tsx
 * import { Calendar } from '@/ui';
 *
 * // Single date selection
 * <Calendar mode="single" onChange={(date) => console.log(date)} />
 *
 * // Date range selection
 * <Calendar mode="range" view="dual-month" onChange={(range) => console.log(range)} />
 * ```
 */
const meta = {
  title: 'Inputs/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    mode: {
      description: 'Selection mode: single date or date range',
      control: 'select',
      options: ['single', 'range'],
      table: {
        defaultValue: { summary: 'single' },
      },
    },
    view: {
      description: 'View mode: single month or dual month display',
      control: 'select',
      options: ['single-month', 'dual-month'],
      table: {
        defaultValue: { summary: 'single-month' },
      },
    },
    showPresets: {
      description:
        'Show preset tabs for quick date range selection (range mode only)',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    hideActions: {
      description: 'Hide the Clear and Apply action buttons',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    minDate: {
      description: 'Minimum selectable date',
      control: 'date',
    },
    maxDate: {
      description: 'Maximum selectable date',
      control: 'date',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
    onChange: {
      description: 'Callback when selection changes',
      action: 'changed',
    },
    onApply: {
      description: 'Callback when Apply button is clicked',
      action: 'applied',
    },
    onClear: {
      description: 'Callback when Clear button is clicked',
      action: 'cleared',
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Default Story
// ============================================================================

/**
 * Default calendar with single date selection and single-month view.
 */
export const Default: Story = {
  args: {
    mode: 'single',
    view: 'single-month',
  },
};

// ============================================================================
// Single Select Story
// ============================================================================

/**
 * Calendar configured for single date selection.
 * Click on any day to select it. Click again to deselect.
 */
export const SingleSelect: Story = {
  args: {
    mode: 'single',
    view: 'single-month',
  },
  render: function SingleSelectStory(args) {
    const [selectedDate, setSelectedDate] = useState<CalendarSingleValue>(null);

    return (
      <div className="space-y-4">
        <Calendar
          {...args}
          value={selectedDate}
          onChange={(value) => setSelectedDate(value as CalendarSingleValue)}
          onApply={(value) => {
            console.log('Applied:', value);
            alert(`Selected: ${(value as Date)?.toLocaleDateString() ?? 'None'}`);
          }}
        />
        <p className="text-sm text-text-subtle">
          Selected: {selectedDate?.toLocaleDateString() ?? 'None'}
        </p>
      </div>
    );
  },
};

// ============================================================================
// Range Select Story
// ============================================================================

/**
 * Calendar configured for date range selection.
 * Click once to set the start date, click again to set the end date.
 * The range is automatically sorted if end is before start.
 */
export const RangeSelect: Story = {
  args: {
    mode: 'range',
    view: 'single-month',
  },
  render: function RangeSelectStory(args) {
    const [dateRange, setDateRange] = useState<CalendarRangeValue>({
      start: null,
      end: null,
    });

    return (
      <div className="space-y-4">
        <Calendar
          {...args}
          value={dateRange}
          onChange={(value) => setDateRange(value as CalendarRangeValue)}
          onApply={(value) => {
            const range = value as CalendarRangeValue;
            console.log('Applied:', range);
            alert(
              `Range: ${range.start?.toLocaleDateString() ?? 'None'} - ${range.end?.toLocaleDateString() ?? 'None'}`
            );
          }}
        />
        <p className="text-sm text-text-subtle">
          Range: {dateRange.start?.toLocaleDateString() ?? 'None'} -{' '}
          {dateRange.end?.toLocaleDateString() ?? 'None'}
        </p>
      </div>
    );
  },
};

// ============================================================================
// Dual Month Story
// ============================================================================

/**
 * Two-month view for easier date range selection.
 * Shows the current month and the next month side by side.
 */
export const DualMonth: Story = {
  args: {
    mode: 'range',
    view: 'dual-month',
  },
  render: function DualMonthStory(args) {
    const [dateRange, setDateRange] = useState<CalendarRangeValue>({
      start: null,
      end: null,
    });

    return (
      <div className="space-y-4">
        <Calendar
          {...args}
          value={dateRange}
          onChange={(value) => setDateRange(value as CalendarRangeValue)}
        />
        <p className="text-sm text-text-subtle">
          Range: {dateRange.start?.toLocaleDateString() ?? 'None'} -{' '}
          {dateRange.end?.toLocaleDateString() ?? 'None'}
        </p>
      </div>
    );
  },
};

// ============================================================================
// With Presets Story
// ============================================================================

/**
 * Calendar with preset date range tabs for quick selection.
 * Presets are only shown in range mode.
 */
export const WithPresets: Story = {
  args: {
    mode: 'range',
    view: 'single-month',
    showPresets: true,
  },
  render: function WithPresetsStory(args) {
    const [dateRange, setDateRange] = useState<CalendarRangeValue>({
      start: null,
      end: null,
    });

    // Helper functions for preset ranges
    const getToday = (): CalendarRangeValue => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return { start: today, end: today };
    };

    const getYesterday = (): CalendarRangeValue => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      return { start: yesterday, end: yesterday };
    };

    const getLastWeek = (): CalendarRangeValue => {
      const end = new Date();
      end.setHours(0, 0, 0, 0);
      const start = new Date(end);
      start.setDate(start.getDate() - 7);
      return { start, end };
    };

    const getLastMonth = (): CalendarRangeValue => {
      const end = new Date();
      end.setHours(0, 0, 0, 0);
      const start = new Date(end);
      start.setMonth(start.getMonth() - 1);
      return { start, end };
    };

    const getLastYear = (): CalendarRangeValue => {
      const end = new Date();
      end.setHours(0, 0, 0, 0);
      const start = new Date(end);
      start.setFullYear(start.getFullYear() - 1);
      return { start, end };
    };

    const presets: CalendarPreset[] = [
      { id: 'today', label: 'Today', getValue: getToday },
      { id: 'yesterday', label: 'Yesterday', getValue: getYesterday },
      { id: 'last-week', label: 'Last week', getValue: getLastWeek },
      { id: 'last-month', label: 'Last month', getValue: getLastMonth },
      { id: 'last-year', label: 'Last year', getValue: getLastYear },
    ];

    return (
      <div className="space-y-4">
        <Calendar
          {...args}
          presets={presets}
          value={dateRange}
          onChange={(value) => setDateRange(value as CalendarRangeValue)}
        />
        <p className="text-sm text-text-subtle">
          Range: {dateRange.start?.toLocaleDateString() ?? 'None'} -{' '}
          {dateRange.end?.toLocaleDateString() ?? 'None'}
        </p>
      </div>
    );
  },
};

// ============================================================================
// Controlled Value Story
// ============================================================================

/**
 * Demonstrates controlled mode with external state management.
 * The parent component manages the selected value.
 */
export const ControlledValue: Story = {
  args: {
    mode: 'single',
    view: 'single-month',
  },
  render: function ControlledValueStory(args) {
    const [selectedDate, setSelectedDate] = useState<CalendarSingleValue>(
      new Date()
    );

    const handleReset = () => setSelectedDate(null);
    const handleSetToday = () => setSelectedDate(new Date());
    const handleSetNextWeek = () => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setSelectedDate(nextWeek);
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="rounded bg-fill-secondary px-3 py-1 text-sm"
          >
            Reset
          </button>
          <button
            onClick={handleSetToday}
            className="rounded bg-fill-secondary px-3 py-1 text-sm"
          >
            Set Today
          </button>
          <button
            onClick={handleSetNextWeek}
            className="rounded bg-fill-secondary px-3 py-1 text-sm"
          >
            Set Next Week
          </button>
        </div>

        <Calendar
          {...args}
          value={selectedDate}
          onChange={(value) => setSelectedDate(value as CalendarSingleValue)}
        />

        <p className="text-sm text-text-subtle">
          Controlled value: {selectedDate?.toLocaleDateString() ?? 'None'}
        </p>
      </div>
    );
  },
};

// ============================================================================
// Disabled Dates Story
// ============================================================================

/**
 * Calendar with certain dates disabled.
 * Demonstrates min/max date restrictions and custom disabled dates function.
 */
export const DisabledDates: Story = {
  args: {
    mode: 'single',
    view: 'single-month',
  },
  render: function DisabledDatesStory(args) {
    const [selectedDate, setSelectedDate] = useState<CalendarSingleValue>(null);

    // Disable weekends
    const isWeekend = (date: Date) => {
      const day = date.getDay();
      return day === 0 || day === 6;
    };

    // Min date: today
    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0);

    // Max date: 30 days from now
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);

    return (
      <div className="space-y-4">
        <div className="text-sm text-text-subtle">
          <p>Weekends are disabled.</p>
          <p>Only dates within the next 30 days are selectable.</p>
        </div>

        <Calendar
          {...args}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={isWeekend}
          value={selectedDate}
          onChange={(value) => setSelectedDate(value as CalendarSingleValue)}
        />

        <p className="text-sm text-text-subtle">
          Selected: {selectedDate?.toLocaleDateString() ?? 'None'}
        </p>
      </div>
    );
  },
};

// ============================================================================
// Today Highlight Story
// ============================================================================

/**
 * Shows today's date highlighted with brand color.
 */
export const TodayHighlight: Story = {
  args: {
    mode: 'single',
    view: 'single-month',
  },
  render: function TodayHighlightStory(args) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-text-subtle">
          Today&apos;s date is highlighted in blue.
        </p>
        <Calendar {...args} />
      </div>
    );
  },
};

// ============================================================================
// All Variants Story
// ============================================================================

/**
 * Grid showing all mode/view combinations for comparison.
 */
export const AllVariants: Story = {
  args: {},
  render: function AllVariantsStory() {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-text-primary">
            Single Mode - Single Month
          </h3>
          <Calendar mode="single" view="single-month" />
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-text-primary">
            Range Mode - Single Month
          </h3>
          <Calendar mode="range" view="single-month" />
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-text-primary">
            Range Mode - Dual Month
          </h3>
          <Calendar mode="range" view="dual-month" />
        </div>
      </div>
    );
  },
};

// ============================================================================
// Real World Date Picker Story
// ============================================================================

/**
 * Complete integration example showing how the Calendar might be used
 * in a real-world date picker component with form integration.
 */
export const RealWorldDatePicker: Story = {
  args: {},
  render: function RealWorldDatePickerStory() {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleApply = (value: unknown) => {
      const range = value as CalendarRangeValue;
      setStartDate(range.start);
      setEndDate(range.end);
      setIsSubmitted(true);
    };

    const handleClear = () => {
      setStartDate(null);
      setEndDate(null);
      setIsSubmitted(false);
    };

    const presets: CalendarPreset[] = [
      {
        id: 'today',
        label: 'Today',
        getValue: () => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return { start: today, end: today };
        },
      },
      {
        id: 'this-week',
        label: 'This week',
        getValue: () => {
          const end = new Date();
          end.setHours(0, 0, 0, 0);
          const start = new Date(end);
          // Go to Monday of this week
          const dayOfWeek = start.getDay();
          const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
          start.setDate(start.getDate() + diff);
          return { start, end };
        },
      },
      {
        id: 'this-month',
        label: 'This month',
        getValue: () => {
          const end = new Date();
          end.setHours(0, 0, 0, 0);
          const start = new Date(end.getFullYear(), end.getMonth(), 1);
          return { start, end };
        },
      },
    ];

    return (
      <div className="max-w-md space-y-6">
        <div>
          <h3 className="mb-2 font-medium text-text-primary">
            Select Date Range
          </h3>
          <p className="text-sm text-text-subtle">
            Choose a date range for your booking or report.
          </p>
        </div>

        <Calendar
          mode="range"
          view="single-month"
          showPresets
          presets={presets}
          value={{ start: startDate, end: endDate }}
          onChange={(value) => {
            const range = value as CalendarRangeValue;
            setStartDate(range.start);
            setEndDate(range.end);
            setIsSubmitted(false);
          }}
          onApply={handleApply}
          onClear={handleClear}
        />

        {isSubmitted && startDate && endDate && (
          <div className="rounded-md bg-background-brand-tertiary p-4">
            <p className="font-medium text-text-primary">Selection confirmed!</p>
            <p className="text-sm text-text-subtle">
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </p>
            <p className="mt-1 text-xs text-text-subtle">
              {Math.ceil(
                (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
              ) + 1}{' '}
              day(s) selected
            </p>
          </div>
        )}
      </div>
    );
  },
};

// ============================================================================
// Playground Story
// ============================================================================

/**
 * Interactive playground with all controls.
 * Use the Storybook controls panel to experiment with different configurations.
 */
export const Playground: Story = {
  args: {
    mode: 'single',
    view: 'single-month',
    showPresets: false,
    hideActions: false,
  },
  render: function PlaygroundStory(args) {
    const [value, setValue] = useState<CalendarSingleValue | CalendarRangeValue>(
      args.mode === 'single' ? null : { start: null, end: null }
    );

    const presets: CalendarPreset[] = [
      {
        id: 'today',
        label: 'Today',
        getValue: () => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return { start: today, end: today };
        },
      },
      {
        id: 'last-week',
        label: 'Last week',
        getValue: () => {
          const end = new Date();
          end.setHours(0, 0, 0, 0);
          const start = new Date(end);
          start.setDate(start.getDate() - 7);
          return { start, end };
        },
      },
      {
        id: 'last-month',
        label: 'Last month',
        getValue: () => {
          const end = new Date();
          end.setHours(0, 0, 0, 0);
          const start = new Date(end);
          start.setMonth(start.getMonth() - 1);
          return { start, end };
        },
      },
    ];

    return (
      <div className="space-y-4">
        <Calendar
          {...args}
          presets={presets}
          value={value}
          onChange={(newValue) => setValue(newValue as typeof value)}
        />
        <div className="text-sm text-text-subtle">
          <p>Current value:</p>
          <pre className="mt-1 rounded bg-fill-tertiary p-2 text-xs">
            {JSON.stringify(
              value,
              (key, val) =>
                val instanceof Date ? val.toLocaleDateString() : val,
              2
            )}
          </pre>
        </div>
      </div>
    );
  },
};
