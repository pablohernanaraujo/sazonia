import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  CalendarDay,
  type CalendarDayState,
  type CalendarDayType,
} from '@/ui/inputs';

/**
 * The CalendarDay component is a foundational building block for calendar interfaces.
 * It represents an individual day cell within a calendar grid, supporting multiple
 * visual states and day types for rich date selection experiences.
 *
 * ## Features
 * - **6 Day Types**: default, today, previousMonth, nextMonth, dayOfWeek, empty
 * - **7 States**: default, hovered, selected, multiSelectStart, multiSelectCenter, multiSelectEnd, disabled
 * - **Fixed Size**: 34x34px as per design specifications
 * - **Accessible**: Proper ARIA attributes and keyboard support
 *
 * ## Usage
 * This component should be composed into higher-level calendar components
 * like CalendarWeek, CalendarMonth, and DatePicker.
 */
const meta = {
  title: 'Inputs/CalendarDay',
  component: CalendarDay,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    day: {
      description: 'Day number (1-31) or text (Mo, Tu, etc.)',
      control: { type: 'text' },
    },
    dayType: {
      description: 'Visual type variant of the day cell',
      control: 'select',
      options: [
        'default',
        'today',
        'previousMonth',
        'nextMonth',
        'dayOfWeek',
        'empty',
      ],
    },
    state: {
      description: 'Interactive state of the day cell',
      control: 'select',
      options: [
        'default',
        'hovered',
        'selected',
        'multiSelectStart',
        'multiSelectCenter',
        'multiSelectEnd',
        'disabled',
      ],
    },
    isToday: {
      description: "Whether this day is today's date",
      control: 'boolean',
    },
    disabled: {
      description: 'Disables the day cell interaction',
      control: 'boolean',
    },
    onClick: {
      description: 'Click handler for day selection',
      action: 'clicked',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
    'aria-label': {
      description: 'Accessible label for the day',
      control: 'text',
    },
  },
} satisfies Meta<typeof CalendarDay>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default day cell with standard styling.
 */
export const Default: Story = {
  args: {
    day: 15,
  },
};

/**
 * All day type variants displayed together.
 */
export const AllDayTypes: Story = {
  args: { day: 15 },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="text-center">
        <CalendarDay day={15} dayType="default" />
        <p className="mt-2 text-xs text-text-subtle">Default</p>
      </div>
      <div className="text-center">
        <CalendarDay day={20} dayType="today" />
        <p className="mt-2 text-xs text-text-subtle">Today</p>
      </div>
      <div className="text-center">
        <CalendarDay day={28} dayType="previousMonth" />
        <p className="mt-2 text-xs text-text-subtle">Prev Month</p>
      </div>
      <div className="text-center">
        <CalendarDay day={3} dayType="nextMonth" />
        <p className="mt-2 text-xs text-text-subtle">Next Month</p>
      </div>
      <div className="text-center">
        <CalendarDay day="Mo" dayType="dayOfWeek" />
        <p className="mt-2 text-xs text-text-subtle">Day of Week</p>
      </div>
      <div className="text-center">
        <CalendarDay dayType="empty" />
        <p className="mt-2 text-xs text-text-subtle">Empty</p>
      </div>
    </div>
  ),
};

/**
 * All interactive state variants displayed together.
 */
export const AllStates: Story = {
  args: { day: 15 },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="text-center">
        <CalendarDay day={15} state="default" />
        <p className="mt-2 text-xs text-text-subtle">Default</p>
      </div>
      <div className="text-center">
        <CalendarDay day={15} state="hovered" />
        <p className="mt-2 text-xs text-text-subtle">Hovered</p>
      </div>
      <div className="text-center">
        <CalendarDay day={15} state="selected" />
        <p className="mt-2 text-xs text-text-subtle">Selected</p>
      </div>
      <div className="text-center">
        <CalendarDay day={15} state="disabled" disabled />
        <p className="mt-2 text-xs text-text-subtle">Disabled</p>
      </div>
    </div>
  ),
};

/**
 * Multi-selection states for date range selection.
 */
export const MultiSelectStates: Story = {
  args: { day: 15 },
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 text-sm font-medium text-text-primary">
          Range Selection States
        </h4>
        <div className="flex items-center">
          <CalendarDay day={10} state="multiSelectStart" />
          <CalendarDay day={11} state="multiSelectCenter" />
          <CalendarDay day={12} state="multiSelectCenter" />
          <CalendarDay day={13} state="multiSelectCenter" />
          <CalendarDay day={14} state="multiSelectEnd" />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-medium text-text-primary">
          Individual States
        </h4>
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-center">
            <CalendarDay day={10} state="multiSelectStart" />
            <p className="mt-2 text-xs text-text-subtle">Start</p>
          </div>
          <div className="text-center">
            <CalendarDay day={12} state="multiSelectCenter" />
            <p className="mt-2 text-xs text-text-subtle">Center</p>
          </div>
          <div className="text-center">
            <CalendarDay day={14} state="multiSelectEnd" />
            <p className="mt-2 text-xs text-text-subtle">End</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Today's date in various interactive states.
 */
export const TodayVariants: Story = {
  args: { day: 20 },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="text-center">
        <CalendarDay day={20} dayType="today" state="default" />
        <p className="mt-2 text-xs text-text-subtle">Default</p>
      </div>
      <div className="text-center">
        <CalendarDay day={20} dayType="today" state="hovered" />
        <p className="mt-2 text-xs text-text-subtle">Hovered</p>
      </div>
      <div className="text-center">
        <CalendarDay day={20} dayType="today" state="selected" />
        <p className="mt-2 text-xs text-text-subtle">Selected</p>
      </div>
      <div className="text-center">
        <CalendarDay day={20} dayType="today" state="multiSelectCenter" />
        <p className="mt-2 text-xs text-text-subtle">In Range</p>
      </div>
      <div className="text-center">
        <CalendarDay day={20} dayType="today" state="disabled" disabled />
        <p className="mt-2 text-xs text-text-subtle">Disabled</p>
      </div>
    </div>
  ),
};

/**
 * Disabled state variations for different day types.
 */
export const DisabledVariants: Story = {
  args: { day: 15 },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="text-center">
        <CalendarDay day={15} state="disabled" disabled />
        <p className="mt-2 text-xs text-text-subtle">Default</p>
      </div>
      <div className="text-center">
        <CalendarDay day={20} dayType="today" state="disabled" disabled />
        <p className="mt-2 text-xs text-text-subtle">Today</p>
      </div>
      <div className="text-center">
        <CalendarDay day={28} dayType="previousMonth" state="disabled" disabled />
        <p className="mt-2 text-xs text-text-subtle">Prev Month</p>
      </div>
      <div className="text-center">
        <CalendarDay day={3} dayType="nextMonth" state="disabled" disabled />
        <p className="mt-2 text-xs text-text-subtle">Next Month</p>
      </div>
    </div>
  ),
};

/**
 * Fixed size comparison showing the 34px cell size.
 */
export const SizeComparison: Story = {
  args: { day: 15 },
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center border border-dashed border-border-brand p-1">
          <CalendarDay day={15} />
        </div>
        <p className="mt-2 text-xs text-text-subtle">34x34px</p>
      </div>
      <div className="text-center">
        <div className="inline-flex items-center justify-center border border-dashed border-border-brand p-1">
          <CalendarDay day={15} state="selected" />
        </div>
        <p className="mt-2 text-xs text-text-subtle">Selected</p>
      </div>
      <div className="text-center">
        <div className="inline-flex items-center justify-center border border-dashed border-border-brand p-1">
          <CalendarDay day="We" dayType="dayOfWeek" />
        </div>
        <p className="mt-2 text-xs text-text-subtle">Header</p>
      </div>
    </div>
  ),
};

/**
 * Real-world example showing a week row with day-of-week headers.
 */
export const CalendarWeekExample: Story = {
  args: { day: 15 },
  render: () => (
    <div className="space-y-2">
      {/* Day of week headers */}
      <div className="flex">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
          <CalendarDay key={day} day={day} dayType="dayOfWeek" />
        ))}
      </div>

      {/* Week with various day types */}
      <div className="flex">
        <CalendarDay day={29} dayType="previousMonth" />
        <CalendarDay day={30} dayType="previousMonth" />
        <CalendarDay day={1} />
        <CalendarDay day={2} />
        <CalendarDay day={3} dayType="today" />
        <CalendarDay day={4} />
        <CalendarDay day={5} />
      </div>
    </div>
  ),
};

/**
 * Real-world example showing a complete month grid.
 */
export const CalendarMonthExample: Story = {
  args: { day: 15 },
  render: () => {
    const weeks = [
      [
        { day: 28, type: 'previousMonth' as CalendarDayType },
        { day: 29, type: 'previousMonth' as CalendarDayType },
        { day: 30, type: 'previousMonth' as CalendarDayType },
        { day: 1, type: 'default' as CalendarDayType },
        { day: 2, type: 'default' as CalendarDayType },
        { day: 3, type: 'default' as CalendarDayType },
        { day: 4, type: 'default' as CalendarDayType },
      ],
      [
        { day: 5, type: 'default' as CalendarDayType },
        { day: 6, type: 'default' as CalendarDayType },
        { day: 7, type: 'default' as CalendarDayType },
        { day: 8, type: 'default' as CalendarDayType },
        { day: 9, type: 'default' as CalendarDayType },
        { day: 10, type: 'default' as CalendarDayType },
        { day: 11, type: 'default' as CalendarDayType },
      ],
      [
        { day: 12, type: 'default' as CalendarDayType },
        { day: 13, type: 'default' as CalendarDayType },
        { day: 14, type: 'default' as CalendarDayType },
        { day: 15, type: 'today' as CalendarDayType },
        { day: 16, type: 'default' as CalendarDayType },
        { day: 17, type: 'default' as CalendarDayType },
        { day: 18, type: 'default' as CalendarDayType },
      ],
      [
        { day: 19, type: 'default' as CalendarDayType },
        { day: 20, type: 'default' as CalendarDayType },
        { day: 21, type: 'default' as CalendarDayType },
        { day: 22, type: 'default' as CalendarDayType },
        { day: 23, type: 'default' as CalendarDayType },
        { day: 24, type: 'default' as CalendarDayType },
        { day: 25, type: 'default' as CalendarDayType },
      ],
      [
        { day: 26, type: 'default' as CalendarDayType },
        { day: 27, type: 'default' as CalendarDayType },
        { day: 28, type: 'default' as CalendarDayType },
        { day: 29, type: 'default' as CalendarDayType },
        { day: 30, type: 'default' as CalendarDayType },
        { day: 1, type: 'nextMonth' as CalendarDayType },
        { day: 2, type: 'nextMonth' as CalendarDayType },
      ],
    ];

    return (
      <div
        className="inline-block rounded-md border border-border p-3"
        role="grid"
        aria-label="November 2024"
      >
        <div className="mb-3 text-center font-medium text-text-primary">
          November 2024
        </div>

        {/* Day of week headers */}
        <div className="flex" role="row">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
            <CalendarDay key={day} day={day} dayType="dayOfWeek" />
          ))}
        </div>

        {/* Calendar weeks */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex" role="row">
            {week.map((dayData, dayIndex) => (
              <CalendarDay
                key={`${weekIndex}-${dayIndex}`}
                day={dayData.day}
                dayType={dayData.type}
              />
            ))}
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Date range selection example showing multi-select states in context.
 */
export const DateRangeSelection: Story = {
  args: { day: 15 },
  render: () => {
    const rangeStart = 12;
    const rangeEnd = 18;

    const getState = (day: number): CalendarDayState => {
      if (day === rangeStart) return 'multiSelectStart';
      if (day === rangeEnd) return 'multiSelectEnd';
      if (day > rangeStart && day < rangeEnd) return 'multiSelectCenter';
      return 'default';
    };

    return (
      <div
        className="inline-block rounded-md border border-border p-3"
        role="grid"
        aria-label="Date range: Dec 12-18"
      >
        <div className="mb-3 text-center font-medium text-text-primary">
          Select Date Range: Dec 12 - Dec 18
        </div>

        {/* Day of week headers */}
        <div className="flex" role="row">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
            <CalendarDay key={day} day={day} dayType="dayOfWeek" />
          ))}
        </div>

        {/* Week 1 */}
        <div className="flex" role="row">
          {[9, 10, 11, 12, 13, 14, 15].map((day) => (
            <CalendarDay
              key={day}
              day={day}
              state={getState(day)}
              dayType={day === 15 ? 'today' : 'default'}
            />
          ))}
        </div>

        {/* Week 2 */}
        <div className="flex" role="row">
          {[16, 17, 18, 19, 20, 21, 22].map((day) => (
            <CalendarDay key={day} day={day} state={getState(day)} />
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Complete matrix showing all dayType and state combinations.
 */
export const CompleteMatrix: Story = {
  args: { day: 15 },
  render: () => {
    const dayTypes: CalendarDayType[] = [
      'default',
      'today',
      'previousMonth',
      'nextMonth',
    ];
    const states: CalendarDayState[] = [
      'default',
      'hovered',
      'selected',
      'disabled',
    ];

    return (
      <div className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-text-primary">
            Day Types x States
          </h3>
          <div className="overflow-x-auto">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left text-sm font-medium text-text-subtle">
                    Type / State
                  </th>
                  {states.map((state) => (
                    <th
                      key={state}
                      className="p-2 text-center text-sm font-medium text-text-subtle capitalize"
                    >
                      {state}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dayTypes.map((dayType) => (
                  <tr key={dayType}>
                    <td className="p-2 text-sm text-text-subtle capitalize">
                      {dayType === 'previousMonth'
                        ? 'Prev Month'
                        : dayType === 'nextMonth'
                          ? 'Next Month'
                          : dayType}
                    </td>
                    {states.map((state) => (
                      <td key={state} className="p-2 text-center">
                        <div className="inline-flex items-center justify-center">
                          <CalendarDay
                            day={15}
                            dayType={dayType}
                            state={state}
                            disabled={state === 'disabled'}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-text-primary">
            Multi-Select States
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <CalendarDay day={10} state="multiSelectStart" />
              <p className="mt-2 text-xs text-text-subtle">Start</p>
            </div>
            <div className="text-center">
              <CalendarDay day={11} state="multiSelectCenter" />
              <p className="mt-2 text-xs text-text-subtle">Center</p>
            </div>
            <div className="text-center">
              <CalendarDay day={12} dayType="today" state="multiSelectCenter" />
              <p className="mt-2 text-xs text-text-subtle">Today in Range</p>
            </div>
            <div className="text-center">
              <CalendarDay day={13} state="multiSelectEnd" />
              <p className="mt-2 text-xs text-text-subtle">End</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-text-primary">
            Non-Interactive Types
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <CalendarDay day="Mo" dayType="dayOfWeek" />
              <p className="mt-2 text-xs text-text-subtle">Day of Week</p>
            </div>
            <div className="text-center">
              <CalendarDay day="Tu" dayType="dayOfWeek" />
              <p className="mt-2 text-xs text-text-subtle">Day of Week</p>
            </div>
            <div className="text-center">
              <CalendarDay dayType="empty" />
              <p className="mt-2 text-xs text-text-subtle">Empty</p>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Interactive playground with all controls.
 */
export const Playground: Story = {
  args: {
    day: 15,
    dayType: 'default',
    state: 'default',
    isToday: false,
    disabled: false,
  },
};
