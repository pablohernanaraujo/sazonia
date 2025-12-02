import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CalendarTab } from '@/ui/inputs';

/**
 * The CalendarTab component is a navigation/selection element designed for calendar interfaces.
 * It serves as a tab-style control for switching between different views or time periods
 * within calendar widgets, such as toggling between day/week/month views or selecting
 * year/month modes.
 *
 * ## Features
 * - **6 Visual States**: Default, Hover, Focus, Pressed, Active, Active+Focus
 * - **Fixed Size**: 32px height with 8px/6px padding as per design specifications
 * - **Border Radius**: 6px (rounded-sm)
 * - **Typography**: Inter Medium, 14px/20px
 * - **Accessible**: Proper ARIA attributes (role="tab", aria-selected) and keyboard support
 *
 * ## States
 * - **Default**: Tertiary text, transparent background
 * - **Hover**: Darker tertiary text (CSS :hover)
 * - **Focus**: White background with primary-300 ring (CSS :focus-visible)
 * - **Pressed**: White background with active tertiary text (CSS :active)
 * - **Active**: White background with primary/brand text
 * - **Active + Focus**: White background with primary text and focus ring
 * - **Disabled**: 52% opacity, non-interactive
 *
 * ## Usage
 * This component should be composed into higher-level calendar components
 * like CalendarHeader, DatePicker, or view-switching tab groups.
 */
const meta = {
  title: 'Inputs/CalendarTab',
  component: CalendarTab,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      description: 'Tab content (text or JSX)',
      control: { type: 'text' },
    },
    active: {
      description: 'Whether the tab is in the active/selected state',
      control: 'boolean',
    },
    disabled: {
      description: 'Disables the tab interaction',
      control: 'boolean',
    },
    onClick: {
      description: 'Click handler for tab selection',
      action: 'clicked',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
} satisfies Meta<typeof CalendarTab>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default CalendarTab with standard styling.
 * Shows the inactive state with tertiary text color.
 */
export const Default: Story = {
  args: {
    children: 'Month',
  },
};

/**
 * Active/selected CalendarTab with primary styling.
 * Shows the active state with white background and brand text color.
 */
export const ActiveState: Story = {
  args: {
    children: 'Month',
    active: true,
  },
};

/**
 * All visual states displayed together for comparison.
 * Note: Hover, Focus, and Pressed states are handled via CSS pseudo-classes.
 */
export const AllStates: Story = {
  args: { children: 'Tab' },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="text-center">
        <CalendarTab>Month</CalendarTab>
        <p className="mt-2 text-xs text-text-subtle">Default</p>
      </div>
      <div className="text-center">
        <CalendarTab active>Month</CalendarTab>
        <p className="mt-2 text-xs text-text-subtle">Active</p>
      </div>
      <div className="text-center">
        <CalendarTab disabled>Month</CalendarTab>
        <p className="mt-2 text-xs text-text-subtle">Disabled</p>
      </div>
      <div className="text-center">
        <CalendarTab active disabled>
          Month
        </CalendarTab>
        <p className="mt-2 text-xs text-text-subtle">Active + Disabled</p>
      </div>
    </div>
  ),
};

/**
 * Focus states demonstration.
 * Tab the focused element to see the focus ring in action.
 */
export const FocusStates: Story = {
  args: { children: 'Tab' },
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-text-subtle">
        Use Tab key to navigate and see focus ring styles
      </p>
      <div className="flex items-center gap-4">
        <CalendarTab>Default Focus</CalendarTab>
        <CalendarTab active>Active Focus</CalendarTab>
      </div>
    </div>
  ),
};

/**
 * Disabled state variations.
 */
export const DisabledState: Story = {
  args: { children: 'Disabled' },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="text-center">
        <CalendarTab disabled>Month</CalendarTab>
        <p className="mt-2 text-xs text-text-subtle">Disabled Default</p>
      </div>
      <div className="text-center">
        <CalendarTab active disabled>
          Month
        </CalendarTab>
        <p className="mt-2 text-xs text-text-subtle">Disabled Active</p>
      </div>
    </div>
  ),
};

/**
 * Real-world example showing CalendarTab in a calendar header context.
 * Demonstrates month/year toggle pattern commonly used in date pickers.
 */
export const InCalendarContext: Story = {
  args: { children: 'Tab' },
  render: function InCalendarContextStory() {
    const [view, setView] = useState<'month' | 'year'>('month');

    return (
      <div className="space-y-4">
        <p className="text-sm text-text-subtle">
          Click tabs to switch between Month and Year views
        </p>
        <div className="inline-flex gap-1 rounded-md bg-fill-secondary p-1">
          <CalendarTab active={view === 'month'} onClick={() => setView('month')}>
            Month
          </CalendarTab>
          <CalendarTab active={view === 'year'} onClick={() => setView('year')}>
            Year
          </CalendarTab>
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="text-text-primary">
            Current view:{' '}
            <strong>{view === 'month' ? 'Month View' : 'Year View'}</strong>
          </p>
        </div>
      </div>
    );
  },
};

/**
 * View switcher example with multiple options.
 * Shows a common pattern for calendar view selection (Day/Week/Month/Year).
 */
export const ViewSwitcherExample: Story = {
  args: { children: 'Tab' },
  render: function ViewSwitcherStory() {
    const [activeView, setActiveView] = useState('month');
    const views = ['Day', 'Week', 'Month', 'Year'];

    return (
      <div className="space-y-4">
        <p className="text-sm text-text-subtle">Calendar view switcher pattern</p>
        <div className="inline-flex gap-1 rounded-md bg-fill-secondary p-1">
          {views.map((view) => (
            <CalendarTab
              key={view}
              active={activeView === view.toLowerCase()}
              onClick={() => setActiveView(view.toLowerCase())}
            >
              {view}
            </CalendarTab>
          ))}
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="text-text-primary">
            Selected:{' '}
            <strong>
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)} View
            </strong>
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Year selector example showing numeric content.
 * Demonstrates using CalendarTab for year selection in a date picker.
 */
export const YearSelectorExample: Story = {
  args: { children: '2024' },
  render: function YearSelectorStory() {
    const [selectedYear, setSelectedYear] = useState(2024);
    const years = [2022, 2023, 2024, 2025, 2026];

    return (
      <div className="space-y-4">
        <p className="text-sm text-text-subtle">
          Year selector pattern for date pickers
        </p>
        <div className="inline-flex flex-wrap gap-1 rounded-md bg-fill-secondary p-1">
          {years.map((year) => (
            <CalendarTab
              key={year}
              active={selectedYear === year}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </CalendarTab>
          ))}
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="text-text-primary">
            Selected year: <strong>{selectedYear}</strong>
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Month selector example with abbreviated month names.
 * Shows CalendarTab usage for month selection grids.
 */
export const MonthSelectorExample: Story = {
  args: { children: 'Jan' },
  render: function MonthSelectorStory() {
    const [selectedMonth, setSelectedMonth] = useState('Nov');
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

    return (
      <div className="space-y-4">
        <p className="text-sm text-text-subtle">Month selector grid pattern</p>
        <div className="inline-grid grid-cols-4 gap-1 rounded-md bg-fill-secondary p-1">
          {months.map((month) => (
            <CalendarTab
              key={month}
              active={selectedMonth === month}
              onClick={() => setSelectedMonth(month)}
            >
              {month}
            </CalendarTab>
          ))}
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="text-text-primary">
            Selected month: <strong>{selectedMonth}</strong>
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Complete state matrix showing all state combinations.
 * Useful for visual regression testing and design review.
 */
export const CompleteMatrix: Story = {
  args: { children: 'Tab' },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          State Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left text-sm font-medium text-text-subtle">
                  Variant
                </th>
                <th className="p-2 text-center text-sm font-medium text-text-subtle">
                  Enabled
                </th>
                <th className="p-2 text-center text-sm font-medium text-text-subtle">
                  Disabled
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 text-sm text-text-subtle">
                  Default (Inactive)
                </td>
                <td className="p-2 text-center">
                  <CalendarTab>Month</CalendarTab>
                </td>
                <td className="p-2 text-center">
                  <CalendarTab disabled>Month</CalendarTab>
                </td>
              </tr>
              <tr>
                <td className="p-2 text-sm text-text-subtle">
                  Active (Selected)
                </td>
                <td className="p-2 text-center">
                  <CalendarTab active>Month</CalendarTab>
                </td>
                <td className="p-2 text-center">
                  <CalendarTab active disabled>
                    Month
                  </CalendarTab>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          Content Variations
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-center">
            <CalendarTab>M</CalendarTab>
            <p className="mt-2 text-xs text-text-subtle">Single char</p>
          </div>
          <div className="text-center">
            <CalendarTab>Mo</CalendarTab>
            <p className="mt-2 text-xs text-text-subtle">Two chars</p>
          </div>
          <div className="text-center">
            <CalendarTab>Month</CalendarTab>
            <p className="mt-2 text-xs text-text-subtle">Word</p>
          </div>
          <div className="text-center">
            <CalendarTab>2024</CalendarTab>
            <p className="mt-2 text-xs text-text-subtle">Number</p>
          </div>
          <div className="text-center">
            <CalendarTab>November</CalendarTab>
            <p className="mt-2 text-xs text-text-subtle">Long text</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          Interactive States (via CSS)
        </h3>
        <p className="mb-4 text-sm text-text-subtle">
          Hover, focus, and press states are handled via CSS pseudo-classes.
          Interact with these tabs to see the transitions.
        </p>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <CalendarTab>Hover me</CalendarTab>
            <p className="mt-2 text-xs text-text-subtle">
              Default (hover for darker text)
            </p>
          </div>
          <div className="text-center">
            <CalendarTab active>Focus me</CalendarTab>
            <p className="mt-2 text-xs text-text-subtle">
              Active (focus for ring)
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          In Context - Tab Group Container
        </h3>
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex gap-1 rounded-md bg-fill-secondary p-1">
              <CalendarTab active>Month</CalendarTab>
              <CalendarTab>Year</CalendarTab>
            </div>
            <p className="mt-2 text-xs text-text-subtle">Standard 2-tab group</p>
          </div>
          <div className="text-center">
            <div className="inline-flex gap-1 rounded-md bg-fill-secondary p-1">
              <CalendarTab>Day</CalendarTab>
              <CalendarTab active>Week</CalendarTab>
              <CalendarTab>Month</CalendarTab>
              <CalendarTab>Year</CalendarTab>
            </div>
            <p className="mt-2 text-xs text-text-subtle">4-tab view switcher</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Size comparison showing the fixed 32px height.
 */
export const SizeComparison: Story = {
  args: { children: 'Tab' },
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center border border-dashed border-border-brand p-1">
          <CalendarTab>Month</CalendarTab>
        </div>
        <p className="mt-2 text-xs text-text-subtle">h-8 (32px)</p>
      </div>
      <div className="text-center">
        <div className="inline-flex items-center justify-center border border-dashed border-border-brand p-1">
          <CalendarTab active>Month</CalendarTab>
        </div>
        <p className="mt-2 text-xs text-text-subtle">Active state</p>
      </div>
      <div className="text-center">
        <div className="inline-flex items-center justify-center border border-dashed border-border-brand p-1">
          <CalendarTab>2024</CalendarTab>
        </div>
        <p className="mt-2 text-xs text-text-subtle">Number content</p>
      </div>
    </div>
  ),
};

/**
 * Accessibility demonstration showing keyboard navigation.
 */
export const AccessibilityDemo: Story = {
  args: { children: 'Tab' },
  render: function AccessibilityStory() {
    const [activeIndex, setActiveIndex] = useState(0);
    const tabs = ['First', 'Second', 'Third'];

    return (
      <div className="space-y-4">
        <p className="text-sm text-text-subtle">
          Use Tab key for navigation, Enter/Space to select. ARIA attributes are
          automatically managed.
        </p>
        <div
          role="tablist"
          aria-label="Demo tabs"
          className="inline-flex gap-1 rounded-md bg-fill-secondary p-1"
        >
          {tabs.map((tab, index) => (
            <CalendarTab
              key={tab}
              active={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              aria-controls={`panel-${index}`}
            >
              {tab}
            </CalendarTab>
          ))}
        </div>
        {tabs.map((tab, index) => (
          <div
            key={tab}
            id={`panel-${index}`}
            role="tabpanel"
            aria-labelledby={`tab-${index}`}
            hidden={activeIndex !== index}
            className="rounded-md border border-border p-4"
          >
            <p className="text-text-primary">Content for {tab} tab</p>
            <p className="mt-2 text-sm text-text-subtle">
              aria-selected: {activeIndex === index ? 'true' : 'false'}
            </p>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Interactive playground with all controls.
 */
export const Playground: Story = {
  args: {
    children: 'Month',
    active: false,
    disabled: false,
  },
};
