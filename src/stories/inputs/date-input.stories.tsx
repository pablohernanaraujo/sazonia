import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  DateInput,
  DateInputField,
  ErrorMessage,
  Hint,
  InputLabel,
} from '@/ui/inputs';

/**
 * DateInput is a specialized form input component that combines a text input field
 * with an integrated calendar popover for date selection.
 *
 * ## Dual API Approach
 *
 * This package provides two components:
 *
 * 1. **DateInput** (standalone) - For maximum flexibility and custom layouts
 * 2. **DateInputField** (wrapper) - For convenience in standard forms
 *
 * ## Features
 *
 * - **Size variants**: SM (compact), MD (default), LG (comfortable)
 * - **Visual states**: Default, Hover, Focus, Disabled, Error
 * - **Date selection**: Manual keyboard input or calendar picker
 * - **Format**: MM/DD/YYYY
 * - **Constraints**: minDate, maxDate, disabledDates support
 *
 * ## When to Use DateInput vs DateInputField
 *
 * Use **DateInput** when:
 * - You need custom layout (e.g., inline with other inputs)
 * - You want to control popover behavior precisely
 * - You need fine-grained control over composition
 *
 * Use **DateInputField** when:
 * - You have a standard form field with label, hint, and/or error
 * - You want automatic ID generation and ARIA associations
 * - You want the convenience of a single component
 */
const meta = {
  title: 'Inputs/DateInput',
  component: DateInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the input',
      table: {
        defaultValue: { summary: 'lg' },
      },
    },
    error: {
      control: 'boolean',
      description: 'Error state - applies destructive border styling',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      table: {
        defaultValue: { summary: 'MM/DD/YYYY' },
      },
    },
    value: {
      control: false,
      description: 'Controlled date value (Date object or null)',
    },
    defaultValue: {
      control: false,
      description: 'Default date value for uncontrolled mode',
    },
    onChange: {
      control: false,
      description: 'Callback when date changes - receives Date or null',
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state for calendar popover',
    },
    onOpenChange: {
      control: false,
      description: 'Callback when calendar open state changes',
    },
    minDate: {
      control: false,
      description: 'Minimum selectable date',
    },
    maxDate: {
      control: false,
      description: 'Maximum selectable date',
    },
    disabledDates: {
      control: false,
      description: 'Dates to disable - array or function',
    },
    leftAddOn: {
      control: false,
      description: 'Content to render on the left side (prefix)',
    },
    wrapperClassName: {
      control: 'text',
      description: 'Additional CSS classes for the wrapper element',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the input element',
    },
  },
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================
// Basic Stories
// =============================================

/**
 * Default DateInput with LG size and placeholder text.
 */
export const Default: Story = {
  args: {
    placeholder: 'MM/DD/YYYY',
    size: 'lg',
  },
};

/**
 * Comparison of all three size variants: SM, MD, and LG.
 */
export const Sizes: Story = {
  args: {
    placeholder: 'Size comparison',
  },
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Small (sm)</p>
        <DateInput size="sm" placeholder="MM/DD/YYYY" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Medium (md)</p>
        <DateInput size="md" placeholder="MM/DD/YYYY" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Large (lg) - Default</p>
        <DateInput size="lg" placeholder="MM/DD/YYYY" />
      </div>
    </div>
  ),
};

/**
 * Grid showing all visual states: Empty, Filled, Disabled, Disabled-Filled,
 * Error, and Error-Filled.
 */
export const AllStates: Story = {
  args: {
    placeholder: 'All states',
  },
  render: () => (
    <div className="grid w-[640px] grid-cols-2 gap-6">
      {/* Empty State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Empty (hover to see hover state)
        </p>
        <DateInput placeholder="MM/DD/YYYY" />
      </div>

      {/* Filled State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Filled</p>
        <DateInput defaultValue={new Date(2024, 2, 15)} />
      </div>

      {/* Disabled Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (empty)</p>
        <DateInput disabled placeholder="MM/DD/YYYY" />
      </div>

      {/* Disabled Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (filled)</p>
        <DateInput disabled defaultValue={new Date(2024, 2, 15)} />
      </div>

      {/* Error Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (empty)</p>
        <DateInput error placeholder="MM/DD/YYYY" />
      </div>

      {/* Error Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (filled)</p>
        <DateInput error defaultValue={new Date(2024, 2, 15)} />
      </div>
    </div>
  ),
};

/**
 * Shows the component with calendar popover visible (click input to open).
 */
export const WithCalendarOpen: Story = {
  args: {},
  render: function CalendarOpenStory() {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div className="h-[400px] w-[320px]">
        <p className="mb-2 text-xs text-text-tertiary">
          Calendar popover opens on focus or icon click
        </p>
        <DateInput
          placeholder="MM/DD/YYYY"
          open={isOpen}
          onOpenChange={setIsOpen}
        />
      </div>
    );
  },
};

// =============================================
// Manual Composition Stories
// =============================================

/**
 * DateInput with InputLabel above (manual composition).
 */
export const WithLabel: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <InputLabel label="Date of birth" htmlFor="date-label" />
      <DateInput id="date-label" placeholder="MM/DD/YYYY" />
    </div>
  ),
};

/**
 * DateInput with hint text below.
 */
export const WithHint: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <InputLabel label="Event date" htmlFor="date-hint" required />
      <DateInput
        id="date-hint"
        placeholder="MM/DD/YYYY"
        aria-describedby="date-hint-text"
      />
      <Hint id="date-hint-text">Select a date within the next 30 days</Hint>
    </div>
  ),
};

/**
 * DateInput with error state and error message.
 */
export const WithError: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <InputLabel label="Date of birth" htmlFor="date-error" required />
      <DateInput
        id="date-error"
        placeholder="MM/DD/YYYY"
        error
        aria-invalid
        aria-describedby="date-error-text"
        defaultValue={new Date(2025, 0, 1)}
      />
      <ErrorMessage id="date-error-text" text="Date cannot be in the future" />
    </div>
  ),
};

/**
 * DateInput with left add-on (text prefix).
 */
export const WithLeftAddOn: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <p className="mb-2 text-xs text-text-tertiary">With text prefix</p>
      <DateInput
        leftAddOn={<span className="text-sm text-text-tertiary">Date:</span>}
        placeholder="MM/DD/YYYY"
      />
    </div>
  ),
};

// =============================================
// DateInputField Stories (Convenience Wrapper)
// =============================================

/**
 * DateInputField default example with label.
 */
export const FieldDefault: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <DateInputField label="Date of birth" placeholder="MM/DD/YYYY" />
    </div>
  ),
};

/**
 * DateInputField with hint text.
 */
export const FieldWithHint: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <DateInputField
        label="Event date"
        hint="Select a date within the next 30 days"
        placeholder="MM/DD/YYYY"
      />
    </div>
  ),
};

/**
 * DateInputField with error state. Notice how the error replaces the hint.
 */
export const FieldWithError: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <DateInputField
        label="Date of birth"
        hint="Enter your date of birth"
        error="Date cannot be in the future"
        placeholder="MM/DD/YYYY"
        defaultValue={new Date(2025, 0, 1)}
      />
    </div>
  ),
};

/**
 * DateInputField with all features: required indicator, help icon, and hint text.
 */
export const FieldFullFeatured: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <DateInputField
        label="Appointment date"
        labelProps={{
          required: true,
          showIcon: true,
          helpIconAriaLabel: 'Date selection info',
        }}
        hint="Select an available appointment date"
        placeholder="MM/DD/YYYY"
        minDate={new Date()}
      />
    </div>
  ),
};

/**
 * DateInputField showing all three sizes and how they map to InputLabel sizes.
 */
export const FieldAllSizes: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-8">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Small (sm) - Label: sm, Hint: sm
        </p>
        <DateInputField
          size="sm"
          label="Small field"
          labelProps={{ required: true }}
          hint="Small hint text"
          placeholder="MM/DD/YYYY"
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Medium (md) - Label: sm, Hint: sm
        </p>
        <DateInputField
          size="md"
          label="Medium field"
          labelProps={{ required: true }}
          hint="Medium hint text"
          placeholder="MM/DD/YYYY"
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Large (lg) - Label: md, Hint: md
        </p>
        <DateInputField
          size="lg"
          label="Large field"
          labelProps={{ required: true }}
          hint="Large hint text"
          placeholder="MM/DD/YYYY"
        />
      </div>
    </div>
  ),
};

// =============================================
// Integration Stories
// =============================================

/**
 * Demonstrates controlled value pattern.
 */
export const Controlled: Story = {
  args: {},
  render: function ControlledStory() {
    const [date, setDate] = useState<Date | null>(new Date(2024, 2, 15));

    return (
      <div className="flex w-[320px] flex-col gap-4">
        <DateInputField
          label="Selected date"
          value={date}
          onChange={setDate}
          placeholder="MM/DD/YYYY"
        />
        <div className="rounded-sm border border-border bg-background-secondary p-3">
          <p className="text-sm text-text-secondary">
            Current value:{' '}
            <span className="font-mono text-text-primary">
              {date ? date.toLocaleDateString() : 'null'}
            </span>
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              className="rounded-sm bg-primary px-3 py-1 text-xs text-white"
              onClick={() => setDate(new Date())}
            >
              Set Today
            </button>
            <button
              type="button"
              className="rounded-sm border border-border px-3 py-1 text-xs"
              onClick={() => setDate(null)}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Real-world form example using DateInputField for convenience.
 */
export const FormIntegration: Story = {
  args: {},
  render: function FormExample() {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    return (
      <form className="w-[400px] space-y-5 rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold">Book Appointment</h3>

        <DateInputField
          label="Start date"
          labelProps={{ required: true }}
          hint="First available date"
          placeholder="MM/DD/YYYY"
          value={startDate}
          onChange={setStartDate}
          minDate={new Date()}
        />

        <DateInputField
          label="End date"
          labelProps={{ required: true }}
          hint="Must be after start date"
          placeholder="MM/DD/YYYY"
          value={endDate}
          onChange={setEndDate}
          minDate={startDate ?? new Date()}
          error={
            endDate && startDate && endDate < startDate
              ? 'End date must be after start date'
              : undefined
          }
        />

        <button
          type="submit"
          className="w-full rounded-sm bg-primary py-2.5 text-white hover:bg-primary-hover"
          onClick={(e) => e.preventDefault()}
        >
          Book Appointment
        </button>
      </form>
    );
  },
};

/**
 * DateInput with date constraints (minDate and maxDate).
 */
export const WithConstraints: Story = {
  args: {},
  render: function ConstraintsStory() {
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return (
      <div className="w-[320px]">
        <DateInputField
          label="Select a date this month"
          hint={`Available: ${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`}
          placeholder="MM/DD/YYYY"
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
    );
  },
};

/**
 * Comprehensive grid showing all size/state combinations.
 */
export const AllCombinations: Story = {
  args: {},
  render: () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-sm font-medium text-text-primary">
        All Size/State Combinations
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Small column */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Small (sm)</p>
          <DateInput size="sm" placeholder="Empty" />
          <DateInput size="sm" defaultValue={new Date(2024, 2, 15)} />
          <DateInput size="sm" disabled placeholder="Disabled" />
          <DateInput size="sm" disabled defaultValue={new Date(2024, 2, 15)} />
          <DateInput size="sm" error placeholder="Error" />
          <DateInput size="sm" error defaultValue={new Date(2024, 2, 15)} />
        </div>

        {/* Medium column */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Medium (md)</p>
          <DateInput size="md" placeholder="Empty" />
          <DateInput size="md" defaultValue={new Date(2024, 2, 15)} />
          <DateInput size="md" disabled placeholder="Disabled" />
          <DateInput size="md" disabled defaultValue={new Date(2024, 2, 15)} />
          <DateInput size="md" error placeholder="Error" />
          <DateInput size="md" error defaultValue={new Date(2024, 2, 15)} />
        </div>

        {/* Large column */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Large (lg)</p>
          <DateInput size="lg" placeholder="Empty" />
          <DateInput size="lg" defaultValue={new Date(2024, 2, 15)} />
          <DateInput size="lg" disabled placeholder="Disabled" />
          <DateInput size="lg" disabled defaultValue={new Date(2024, 2, 15)} />
          <DateInput size="lg" error placeholder="Error" />
          <DateInput size="lg" error defaultValue={new Date(2024, 2, 15)} />
        </div>
      </div>
    </div>
  ),
};

/**
 * Side-by-side comparison showing when to use DateInput vs DateInputField.
 */
export const WhenToUseWhich: Story = {
  args: {},
  render: () => (
    <div className="grid w-[700px] grid-cols-2 gap-8">
      {/* DateInput side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">DateInput (Standalone)</h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for custom layouts or date inputs without labels
        </p>

        <div className="space-y-4">
          {/* Inline example */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">Inline date picker</p>
            <DateInput placeholder="MM/DD/YYYY" />
          </div>

          {/* With prefix */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">With prefix text</p>
            <DateInput
              leftAddOn={
                <span className="text-sm text-text-tertiary">Date:</span>
              }
              placeholder="MM/DD/YYYY"
            />
          </div>
        </div>
      </div>

      {/* DateInputField side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">DateInputField (Wrapper)</h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for standard form fields with labels
        </p>

        <div className="space-y-4">
          {/* Standard field */}
          <DateInputField
            label="Event date"
            labelProps={{ required: true }}
            hint="Select your preferred date"
            placeholder="MM/DD/YYYY"
          />

          {/* Field with error */}
          <DateInputField
            label="Date of birth"
            labelProps={{ required: true }}
            error="Date is required"
          />
        </div>
      </div>
    </div>
  ),
};
