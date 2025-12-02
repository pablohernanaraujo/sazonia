import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { type CalendarTabItem, CalendarTabs } from '@/ui/inputs';

/** Default preset items for date range selection */
const defaultPresetItems: CalendarTabItem[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last-week', label: 'Last week' },
  { value: 'last-month', label: 'Last month' },
  { value: 'last-year', label: 'Last year' },
  { value: 'all-time', label: 'All time' },
];

/**
 * CalendarTabs is a vertical container component that groups multiple CalendarTab
 * components into a cohesive list for quick date range selection.
 *
 * ## Features
 * - **Data-driven**: Pass an array of items instead of composing children
 * - **Vertical layout**: Flex column with 4px gap between items
 * - **Selection management**: Supports controlled and uncontrolled modes
 * - **Keyboard navigation**: Arrow Up/Down, Home/End, Enter/Space
 * - **Roving tabIndex**: Only one tab is focusable at a time
 * - **Accessibility**: Proper tablist/tab semantics with ARIA attributes
 *
 * ## Architectural Note
 * This is the **first vertical container component** in the design system.
 * Unlike ButtonGroup (horizontal), CalendarTabs uses:
 * - `flex-col` instead of `inline-flex`
 * - `gap-1` (4px) instead of `-ml-px` border overlap
 * - ArrowUp/ArrowDown navigation instead of ArrowLeft/Right
 *
 * ## Usage
 * Commonly used in date pickers, analytics dashboards, and reporting interfaces
 * where users need quick access to preset date ranges.
 */
const meta = {
  title: 'Inputs/CalendarTabs',
  component: CalendarTabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of tab items to render',
      control: 'object',
    },
    value: {
      control: 'select',
      options: [
        undefined,
        'today',
        'yesterday',
        'last-week',
        'last-month',
        'last-year',
        'all-time',
      ],
      description: 'Currently selected tab value (controlled mode)',
    },
    defaultValue: {
      control: 'select',
      options: [
        undefined,
        'today',
        'yesterday',
        'last-week',
        'last-month',
        'last-year',
        'all-time',
      ],
      description: 'Initial selected value (uncontrolled mode)',
    },
    onValueChange: {
      description: 'Callback fired when selection changes',
      action: 'valueChanged',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all tabs in the group',
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Layout orientation of the tabs',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the tablist',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the container',
    },
  },
  args: {
    items: defaultPresetItems,
    'aria-label': 'Date range presets',
  },
} satisfies Meta<typeof CalendarTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default CalendarTabs showing all preset date range options.
 * No selection by default - all tabs are in inactive state.
 */
export const Default: Story = {
  args: {},
};

/**
 * CalendarTabs with a pre-selected value.
 * The "Today" tab is shown in the active/selected state.
 */
export const WithSelection: Story = {
  args: {
    value: 'today',
  },
};

/**
 * CalendarTabs with custom (non-date) items.
 * Demonstrates the component's flexibility for different use cases.
 */
export const CustomItems: Story = {
  args: {
    items: [
      { value: 'q1', label: 'Q1 2024' },
      { value: 'q2', label: 'Q2 2024' },
      { value: 'q3', label: 'Q3 2024' },
      { value: 'q4', label: 'Q4 2024' },
    ],
    defaultValue: 'q1',
    'aria-label': 'Quarterly reports',
  },
};

/**
 * Interactive example with controlled state management.
 * Click tabs to see the selection change and the value displayed below.
 */
export const ControlledState: Story = {
  args: {
    items: defaultPresetItems,
  },
  render: function ControlledStateStory(args) {
    const [value, setValue] = useState<string>('today');

    return (
      <div className="space-y-4">
        <p className="text-sm text-text-subtle">
          Click tabs to change selection. Current selection is displayed below.
        </p>
        <CalendarTabs {...args} value={value} onValueChange={setValue} />
        <div className="rounded-md border border-border p-4">
          <p className="text-text-primary">
            Selected: <strong>{value}</strong>
          </p>
        </div>
      </div>
    );
  },
};

/**
 * CalendarTabs with some disabled options.
 * Yesterday and Last month tabs are disabled and cannot be selected.
 */
export const DisabledItems: Story = {
  args: {
    items: [
      { value: 'today', label: 'Today' },
      { value: 'yesterday', label: 'Yesterday', disabled: true },
      { value: 'last-week', label: 'Last week' },
      { value: 'last-month', label: 'Last month', disabled: true },
      { value: 'last-year', label: 'Last year' },
      { value: 'all-time', label: 'All time' },
    ],
    defaultValue: 'today',
  },
};

/**
 * All tabs disabled via the global `disabled` prop.
 */
export const AllDisabled: Story = {
  args: {
    items: defaultPresetItems,
    disabled: true,
    defaultValue: 'today',
  },
};

/**
 * Real-world example: Date Range Picker
 *
 * Shows CalendarTabs integrated with a date display, simulating how it would
 * appear in a date picker component. The selected preset updates the displayed
 * date range.
 */
export const RealWorldDatePicker: Story = {
  args: {
    items: defaultPresetItems,
  },
  render: function DatePickerStory(args) {
    const [selectedPreset, setSelectedPreset] = useState<string>('today');

    const getDateRange = (preset: string): { start: string; end: string } => {
      const today = new Date();
      const formatDate = (d: Date) =>
        d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

      switch (preset) {
        case 'today':
          return { start: formatDate(today), end: formatDate(today) };
        case 'yesterday': {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return { start: formatDate(yesterday), end: formatDate(yesterday) };
        }
        case 'last-week': {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return { start: formatDate(weekAgo), end: formatDate(today) };
        }
        case 'last-month': {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return { start: formatDate(monthAgo), end: formatDate(today) };
        }
        case 'last-year': {
          const yearAgo = new Date(today);
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          return { start: formatDate(yearAgo), end: formatDate(today) };
        }
        case 'all-time':
          return { start: 'Jan 1, 2020', end: formatDate(today) };
        default:
          return { start: '', end: '' };
      }
    };

    const range = getDateRange(selectedPreset);

    return (
      <div className="flex gap-6">
        <div className="rounded-lg border border-border bg-fill-secondary p-2">
          <CalendarTabs
            {...args}
            value={selectedPreset}
            onValueChange={setSelectedPreset}
          />
        </div>
        <div className="flex flex-col justify-center space-y-2">
          <h3 className="text-lg font-semibold text-text-primary">
            Selected Range
          </h3>
          <p className="text-sm text-text-subtle">
            {range.start} - {range.end}
          </p>
          <div className="mt-4 rounded-md border border-border p-3">
            <p className="text-xs text-text-subtle">Preset value:</p>
            <code className="text-sm text-primary">{selectedPreset}</code>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Real-world example: Analytics Filter
 *
 * Shows CalendarTabs in context of an analytics dashboard, filtering
 * data visualization by time period.
 */
export const RealWorldAnalyticsFilter: Story = {
  args: {
    items: defaultPresetItems,
  },
  render: function AnalyticsFilterStory(args) {
    const [period, setPeriod] = useState<string>('last-week');

    // Simulated analytics data based on selected period
    const getAnalyticsData = (p: string) => {
      const data: Record<
        string,
        { views: string; users: string; revenue: string }
      > = {
        today: { views: '1,234', users: '456', revenue: '$2,340' },
        yesterday: { views: '1,189', users: '423', revenue: '$2,156' },
        'last-week': { views: '8,567', users: '2,134', revenue: '$15,670' },
        'last-month': { views: '34,567', users: '8,934', revenue: '$67,890' },
        'last-year': { views: '456,789', users: '98,234', revenue: '$890,123' },
        'all-time': {
          views: '1,234,567',
          users: '234,567',
          revenue: '$2,345,678',
        },
      };
      return data[p] || data['today'];
    };

    const analytics = getAnalyticsData(period);

    return (
      <div className="w-[500px] rounded-lg border border-border bg-background p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            Analytics Dashboard
          </h2>
        </div>
        <div className="flex gap-4">
          <div className="rounded-md bg-fill-secondary p-2">
            <CalendarTabs {...args} value={period} onValueChange={setPeriod} />
          </div>
          <div className="flex-1 space-y-3">
            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-text-subtle">Page Views</p>
              <p className="text-2xl font-bold text-text-primary">
                {analytics.views}
              </p>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-text-subtle">Active Users</p>
              <p className="text-2xl font-bold text-text-primary">
                {analytics.users}
              </p>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-text-subtle">Revenue</p>
              <p className="text-2xl font-bold text-primary">
                {analytics.revenue}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Accessibility demonstration showing keyboard navigation.
 *
 * Instructions:
 * 1. Tab to focus the first tab
 * 2. Use Arrow Down/Up to navigate between tabs
 * 3. Use Home/End to jump to first/last tab
 * 4. Press Enter or Space to select the focused tab
 * 5. Disabled tabs are skipped during navigation
 */
export const AccessibilityDemo: Story = {
  args: {
    items: [
      { value: 'today', label: 'Today' },
      { value: 'yesterday', label: 'Yesterday', disabled: true },
      { value: 'last-week', label: 'Last week' },
      { value: 'last-month', label: 'Last month' },
      { value: 'last-year', label: 'Last year', disabled: true },
      { value: 'all-time', label: 'All time' },
    ],
  },
  render: function AccessibilityStory(args) {
    const [value, setValue] = useState<string | undefined>();

    return (
      <div className="space-y-4">
        <div className="rounded-md bg-fill-secondary p-4">
          <h3 className="mb-2 font-semibold text-text-primary">
            Keyboard Navigation
          </h3>
          <ul className="space-y-1 text-sm text-text-subtle">
            <li>
              <kbd className="rounded bg-background px-1">Tab</kbd> - Focus the
              tab group
            </li>
            <li>
              <kbd className="rounded bg-background px-1">Arrow Down/Up</kbd> -
              Navigate between tabs
            </li>
            <li>
              <kbd className="rounded bg-background px-1">Home</kbd> - Jump to
              first enabled tab
            </li>
            <li>
              <kbd className="rounded bg-background px-1">End</kbd> - Jump to last
              enabled tab
            </li>
            <li>
              <kbd className="rounded bg-background px-1">Enter/Space</kbd> -
              Select focused tab
            </li>
          </ul>
          <p className="mt-2 text-xs text-text-subtle italic">
            Note: Yesterday and Last year tabs are disabled and will be skipped.
          </p>
        </div>
        <div className="rounded-md bg-fill-secondary p-2">
          <CalendarTabs {...args} value={value} onValueChange={setValue} />
        </div>
        <div className="rounded-md border border-border p-4">
          <p className="text-sm text-text-subtle">
            Selected:{' '}
            <strong className="text-text-primary">{value || 'None'}</strong>
          </p>
          <p className="mt-2 text-xs text-text-subtle">
            ARIA attributes: role=&quot;tablist&quot;,
            aria-orientation=&quot;vertical&quot;, aria-selected on each tab
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Complete matrix showing all state combinations for visual regression testing.
 */
export const CompleteMatrix: Story = {
  args: {
    items: defaultPresetItems,
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          Selection States
        </h3>
        <div className="flex gap-8">
          <div>
            <p className="mb-2 text-sm text-text-subtle">No Selection</p>
            <div className="rounded-md bg-fill-secondary p-2">
              <CalendarTabs
                items={defaultPresetItems}
                aria-label="No selection"
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">First Selected</p>
            <div className="rounded-md bg-fill-secondary p-2">
              <CalendarTabs
                items={defaultPresetItems}
                value="today"
                aria-label="First selected"
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Middle Selected</p>
            <div className="rounded-md bg-fill-secondary p-2">
              <CalendarTabs
                items={defaultPresetItems}
                value="last-month"
                aria-label="Middle selected"
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Last Selected</p>
            <div className="rounded-md bg-fill-secondary p-2">
              <CalendarTabs
                items={defaultPresetItems}
                value="all-time"
                aria-label="Last selected"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          Disabled States
        </h3>
        <div className="flex gap-8">
          <div>
            <p className="mb-2 text-sm text-text-subtle">Some Items Disabled</p>
            <div className="rounded-md bg-fill-secondary p-2">
              <CalendarTabs
                items={[
                  { value: 'a', label: 'Enabled' },
                  { value: 'b', label: 'Disabled', disabled: true },
                  { value: 'c', label: 'Enabled' },
                ]}
                defaultValue="a"
                aria-label="Mixed disabled"
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">All Disabled</p>
            <div className="rounded-md bg-fill-secondary p-2">
              <CalendarTabs
                items={defaultPresetItems.slice(0, 3)}
                disabled
                defaultValue="today"
                aria-label="All disabled"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          Item Count Variations
        </h3>
        <div className="flex gap-8">
          <div>
            <p className="mb-2 text-sm text-text-subtle">Single Item</p>
            <div className="rounded-md bg-fill-secondary p-2">
              <CalendarTabs
                items={[{ value: 'only', label: 'Only Option' }]}
                defaultValue="only"
                aria-label="Single item"
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Two Items</p>
            <div className="rounded-md bg-fill-secondary p-2">
              <CalendarTabs
                items={defaultPresetItems.slice(0, 2)}
                defaultValue="today"
                aria-label="Two items"
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Many Items</p>
            <div className="rounded-md bg-fill-secondary p-2">
              <CalendarTabs
                items={[
                  { value: 'a', label: 'Item A' },
                  { value: 'b', label: 'Item B' },
                  { value: 'c', label: 'Item C' },
                  { value: 'd', label: 'Item D' },
                  { value: 'e', label: 'Item E' },
                  { value: 'f', label: 'Item F' },
                  { value: 'g', label: 'Item G' },
                  { value: 'h', label: 'Item H' },
                ]}
                defaultValue="a"
                aria-label="Many items"
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Empty</p>
            <div className="rounded-md bg-fill-secondary p-2">
              <CalendarTabs items={[]} aria-label="Empty" />
              <p className="p-2 text-xs text-text-subtle italic">No items</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          Content Variations
        </h3>
        <div className="flex gap-8">
          <div>
            <p className="mb-2 text-sm text-text-subtle">Short Labels</p>
            <div className="rounded-md bg-fill-secondary p-2">
              <CalendarTabs
                items={[
                  { value: 'a', label: 'Q1' },
                  { value: 'b', label: 'Q2' },
                  { value: 'c', label: 'Q3' },
                  { value: 'd', label: 'Q4' },
                ]}
                defaultValue="a"
                aria-label="Short labels"
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Long Labels</p>
            <div className="rounded-md bg-fill-secondary p-2">
              <CalendarTabs
                items={[
                  { value: 'a', label: 'First Quarter 2024' },
                  { value: 'b', label: 'Second Quarter 2024' },
                  { value: 'c', label: 'Third Quarter 2024' },
                ]}
                defaultValue="a"
                aria-label="Long labels"
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Numbers</p>
            <div className="rounded-md bg-fill-secondary p-2">
              <CalendarTabs
                items={[
                  { value: '2022', label: '2022' },
                  { value: '2023', label: '2023' },
                  { value: '2024', label: '2024' },
                ]}
                defaultValue="2024"
                aria-label="Numbers"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-text-primary">
          Orientation
        </h3>
        <div className="flex gap-8">
          <div>
            <p className="mb-2 text-sm text-text-subtle">Vertical (Default)</p>
            <div className="rounded-md bg-fill-secondary p-2">
              <CalendarTabs
                items={defaultPresetItems.slice(0, 3)}
                orientation="vertical"
                defaultValue="today"
                aria-label="Vertical"
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Horizontal</p>
            <div className="rounded-md bg-fill-secondary p-2">
              <CalendarTabs
                items={defaultPresetItems.slice(0, 3)}
                orientation="horizontal"
                defaultValue="today"
                aria-label="Horizontal"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Interactive playground with all controls available.
 */
export const Playground: Story = {
  args: {
    items: defaultPresetItems,
    value: undefined,
    defaultValue: 'today',
    disabled: false,
    orientation: 'vertical',
    'aria-label': 'Playground tabs',
  },
};
