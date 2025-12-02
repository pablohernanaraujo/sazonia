import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CalendarDay } from '@/ui/inputs/calendar-day';
import {
  CalendarHeader,
  type CalendarHeaderAlign,
} from '@/ui/inputs/calendar-header';

/**
 * The CalendarHeader component is a navigation control for calendar interfaces
 * that displays the current month/year and provides navigation buttons to move
 * between months.
 *
 * ## Features
 * - **2 Alignment Variants**: left (default) and center
 * - **Navigation Buttons**: Previous/next month with chevron icons
 * - **Selector Buttons**: Clickable month/year with dropdown indicators
 * - **Accessible**: Proper ARIA labels and keyboard support
 *
 * ## Usage
 * Use CalendarHeader as part of a calendar component to provide temporal
 * context and navigation controls for date selection interfaces.
 */
const meta = {
  title: 'Inputs/CalendarHeader',
  component: CalendarHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    align: {
      control: 'select',
      options: ['left', 'center'],
      description: 'Layout alignment variant',
      table: {
        defaultValue: { summary: 'left' },
      },
    },
    month: {
      control: 'text',
      description: 'Month name or abbreviation (for left alignment)',
    },
    year: {
      control: 'number',
      description: 'Year to display (for left alignment)',
    },
    monthYearCombined: {
      control: 'text',
      description: 'Combined month-year text (for center alignment)',
    },
    onPreviousClick: {
      action: 'previous clicked',
      description: 'Callback when previous month button is clicked',
    },
    onNextClick: {
      action: 'next clicked',
      description: 'Callback when next month button is clicked',
    },
    onMonthClick: {
      action: 'month clicked',
      description: 'Callback when month selector is clicked',
    },
    onYearClick: {
      action: 'year clicked',
      description: 'Callback when year selector is clicked',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof CalendarHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default calendar header with left alignment showing month and year selectors.
 */
export const Default: Story = {
  args: {
    month: 'Mar',
    year: 2025,
  },
};

/**
 * Explicit left-aligned variant with separate month and year selectors.
 */
export const AlignLeft: Story = {
  args: {
    align: 'left',
    month: 'Mar',
    year: 2025,
  },
};

/**
 * Center-aligned variant with combined month-year selector.
 */
export const AlignCenter: Story = {
  args: {
    align: 'center',
    monthYearCombined: 'June 2022',
  },
};

/**
 * Different month and year values to demonstrate flexibility.
 */
export const WithCustomMonthYear: Story = {
  args: {
    month: 'December',
    year: 2024,
  },
};

/**
 * Side-by-side comparison of both alignment variants.
 */
export const AllVariants: Story = {
  args: { month: 'Mar', year: 2025 },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-sm font-medium text-text-secondary">
          Align=Left (Default)
        </p>
        <div className="w-[320px] rounded-md border border-border p-3">
          <CalendarHeader align="left" month="Mar" year={2025} />
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-text-secondary">
          Align=Center
        </p>
        <div className="w-[320px] rounded-md border border-border p-3">
          <CalendarHeader align="center" monthYearCombined="June 2022" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Interactive example demonstrating month navigation.
 */
export const InteractiveNavigation: Story = {
  args: { month: 'Mar', year: 2025 },
  render: function InteractiveNavigationStory() {
    const months = [
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
    ];
    const [monthIndex, setMonthIndex] = useState(2); // March
    const [year, setYear] = useState(2025);

    const handlePrevious = () => {
      if (monthIndex === 0) {
        setMonthIndex(11);
        setYear((y) => y - 1);
      } else {
        setMonthIndex((m) => m - 1);
      }
    };

    const handleNext = () => {
      if (monthIndex === 11) {
        setMonthIndex(0);
        setYear((y) => y + 1);
      } else {
        setMonthIndex((m) => m + 1);
      }
    };

    return (
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          Click the navigation buttons to change months
        </p>
        <div className="w-[320px] rounded-md border border-border p-3">
          <CalendarHeader
            month={months[monthIndex]}
            year={year}
            onPreviousClick={handlePrevious}
            onNextClick={handleNext}
            onMonthClick={() =>
              alert(`Month selector clicked: ${months[monthIndex]}`)
            }
            onYearClick={() => alert(`Year selector clicked: ${year}`)}
          />
        </div>
      </div>
    );
  },
};

/**
 * Interactive example with center alignment.
 */
export const InteractiveCenterAlignment: Story = {
  args: { monthYearCombined: 'June 2022' },
  render: function InteractiveCenterStory() {
    const months = [
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
    ];
    const [monthIndex, setMonthIndex] = useState(5); // June
    const [year, setYear] = useState(2022);

    const handlePrevious = () => {
      if (monthIndex === 0) {
        setMonthIndex(11);
        setYear((y) => y - 1);
      } else {
        setMonthIndex((m) => m - 1);
      }
    };

    const handleNext = () => {
      if (monthIndex === 11) {
        setMonthIndex(0);
        setYear((y) => y + 1);
      } else {
        setMonthIndex((m) => m + 1);
      }
    };

    return (
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          Click the navigation buttons to change months
        </p>
        <div className="w-[320px] rounded-md border border-border p-3">
          <CalendarHeader
            align="center"
            monthYearCombined={`${months[monthIndex]} ${year}`}
            onPreviousClick={handlePrevious}
            onNextClick={handleNext}
            onMonthClick={() =>
              alert(`Selector clicked: ${months[monthIndex]} ${year}`)
            }
          />
        </div>
      </div>
    );
  },
};

/**
 * Real-world example showing header above a calendar grid.
 */
export const InCalendarContext: Story = {
  args: { month: 'Nov', year: 2024 },
  render: () => (
    <div
      className="inline-block w-[280px] rounded-md border border-border p-3"
      role="application"
      aria-label="Calendar"
    >
      {/* Calendar Header */}
      <CalendarHeader month="Nov" year={2024} />

      {/* Day of week headers */}
      <div className="mt-3 flex" role="row">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
          <CalendarDay key={day} day={day} dayType="dayOfWeek" />
        ))}
      </div>

      {/* Calendar weeks */}
      <div className="flex" role="row">
        <CalendarDay day={28} dayType="previousMonth" />
        <CalendarDay day={29} dayType="previousMonth" />
        <CalendarDay day={30} dayType="previousMonth" />
        <CalendarDay day={31} dayType="previousMonth" />
        <CalendarDay day={1} />
        <CalendarDay day={2} />
        <CalendarDay day={3} />
      </div>
      <div className="flex" role="row">
        <CalendarDay day={4} />
        <CalendarDay day={5} />
        <CalendarDay day={6} />
        <CalendarDay day={7} />
        <CalendarDay day={8} />
        <CalendarDay day={9} />
        <CalendarDay day={10} />
      </div>
      <div className="flex" role="row">
        <CalendarDay day={11} />
        <CalendarDay day={12} />
        <CalendarDay day={13} />
        <CalendarDay day={14} />
        <CalendarDay day={15} dayType="today" />
        <CalendarDay day={16} />
        <CalendarDay day={17} />
      </div>
      <div className="flex" role="row">
        <CalendarDay day={18} />
        <CalendarDay day={19} />
        <CalendarDay day={20} state="selected" />
        <CalendarDay day={21} />
        <CalendarDay day={22} />
        <CalendarDay day={23} />
        <CalendarDay day={24} />
      </div>
      <div className="flex" role="row">
        <CalendarDay day={25} />
        <CalendarDay day={26} />
        <CalendarDay day={27} />
        <CalendarDay day={28} />
        <CalendarDay day={29} />
        <CalendarDay day={30} />
        <CalendarDay day={1} dayType="nextMonth" />
      </div>
    </div>
  ),
};

/**
 * Calendar context with center-aligned header.
 */
export const InCalendarContextCentered: Story = {
  args: { monthYearCombined: 'November 2024' },
  render: () => (
    <div
      className="inline-block w-[280px] rounded-md border border-border p-3"
      role="application"
      aria-label="Calendar"
    >
      {/* Calendar Header - Center Aligned */}
      <CalendarHeader align="center" monthYearCombined="November 2024" />

      {/* Day of week headers */}
      <div className="mt-3 flex" role="row">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
          <CalendarDay key={day} day={day} dayType="dayOfWeek" />
        ))}
      </div>

      {/* Calendar weeks */}
      <div className="flex" role="row">
        <CalendarDay day={28} dayType="previousMonth" />
        <CalendarDay day={29} dayType="previousMonth" />
        <CalendarDay day={30} dayType="previousMonth" />
        <CalendarDay day={31} dayType="previousMonth" />
        <CalendarDay day={1} />
        <CalendarDay day={2} />
        <CalendarDay day={3} />
      </div>
      <div className="flex" role="row">
        <CalendarDay day={4} />
        <CalendarDay day={5} />
        <CalendarDay day={6} />
        <CalendarDay day={7} />
        <CalendarDay day={8} />
        <CalendarDay day={9} />
        <CalendarDay day={10} />
      </div>
      <div className="flex" role="row">
        <CalendarDay day={11} />
        <CalendarDay day={12} />
        <CalendarDay day={13} />
        <CalendarDay day={14} />
        <CalendarDay day={15} dayType="today" />
        <CalendarDay day={16} />
        <CalendarDay day={17} />
      </div>
    </div>
  ),
};

/**
 * Different month formats to show flexibility.
 */
export const MonthFormats: Story = {
  args: { month: 'Mar', year: 2025 },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-sm font-medium text-text-secondary">
          Abbreviated Month
        </p>
        <div className="w-[320px] rounded-md border border-border p-3">
          <CalendarHeader month="Mar" year={2025} />
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-text-secondary">
          Full Month Name
        </p>
        <div className="w-[320px] rounded-md border border-border p-3">
          <CalendarHeader month="March" year={2025} />
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-text-secondary">
          Long Month Name (September)
        </p>
        <div className="w-[320px] rounded-md border border-border p-3">
          <CalendarHeader month="September" year={2025} />
        </div>
      </div>
    </div>
  ),
};

/**
 * Complete matrix showing both alignments with various states.
 */
export const CompleteMatrix: Story = {
  args: { month: 'Mar', year: 2025 },
  render: () => {
    const alignments: CalendarHeaderAlign[] = ['left', 'center'];

    return (
      <div className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-text-primary">
            Alignment Variants
          </h3>
          <div className="space-y-6">
            {alignments.map((align) => (
              <div key={align}>
                <p className="mb-2 text-sm font-medium text-text-secondary capitalize">
                  {align} Alignment
                </p>
                <div className="w-[320px] rounded-md border border-border p-3">
                  {align === 'left' ? (
                    <CalendarHeader align={align} month="March" year={2025} />
                  ) : (
                    <CalendarHeader
                      align={align}
                      monthYearCombined="March 2025"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-text-primary">
            Width Variations
          </h3>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-text-secondary">
                320px Container (Figma spec)
              </p>
              <div className="w-[320px] rounded-md border border-border p-3">
                <CalendarHeader month="Mar" year={2025} />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-text-secondary">
                Full Width Container
              </p>
              <div className="w-full max-w-md rounded-md border border-border p-3">
                <CalendarHeader month="Mar" year={2025} />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-text-secondary">
                Narrow Container (280px)
              </p>
              <div className="w-[280px] rounded-md border border-border p-3">
                <CalendarHeader month="Mar" year={2025} />
              </div>
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
    align: 'left',
    month: 'Mar',
    year: 2025,
    monthYearCombined: 'March 2025',
  },
  render: (args) => (
    <div className="w-[320px] rounded-md border border-border p-3">
      {args.align === 'left' ? (
        <CalendarHeader
          align={args.align}
          month={args.month}
          year={args.year}
          onPreviousClick={args.onPreviousClick}
          onNextClick={args.onNextClick}
          onMonthClick={args.onMonthClick}
          onYearClick={args.onYearClick}
          className={args.className}
        />
      ) : (
        <CalendarHeader
          align={args.align}
          monthYearCombined={args.monthYearCombined}
          onPreviousClick={args.onPreviousClick}
          onNextClick={args.onNextClick}
          onMonthClick={args.onMonthClick}
          className={args.className}
        />
      )}
    </div>
  ),
};
