import { useState } from 'react';
import { CalendarCheck, CalendarDots, Clock } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Icon } from '@/ui/icons';
import { DateInputFloatingLabel, DateInputFloatingLabelField } from '@/ui/inputs';

/**
 * DateInputFloatingLabel is an enhanced date input component that combines the floating
 * label animation pattern with an integrated calendar picker. When the input is empty
 * and unfocused, the label appears as placeholder text inside the input field. Upon
 * focus or when the input has a value, the label smoothly animates to float above
 * the input border.
 *
 * ## Dual API Approach
 *
 * This package provides two components:
 *
 * 1. **DateInputFloatingLabel** (molecule) - Standalone input with floating label and calendar
 * 2. **DateInputFloatingLabelField** (organism) - Wrapper with hint/error composition
 *
 * ## Features
 *
 * - **Floating label animation**: Label smoothly transitions from placeholder to floating position
 * - **Calendar picker**: Integrated calendar popover for visual date selection
 * - **Keyboard input**: Type dates in MM/DD/YYYY format
 * - **Visual states**: Empty, Hovered, Focused, Typing, Filled, Disabled, Error
 * - **Date constraints**: minDate, maxDate, disabledDates support
 *
 * ## Important Note
 *
 * Unlike `TextInputFloatingLabel`, this component does NOT support `rightAddOn`.
 * The calendar icon button permanently occupies the right slot. Only `leftAddOn`
 * is supported for additional icons or content.
 *
 * ## When to Use DateInputFloatingLabel vs DateInputFloatingLabelField
 *
 * Use **DateInputFloatingLabel** when:
 * - You need custom layout (e.g., input alongside other elements)
 * - You want to compose hint/error manually
 * - You need the input without additional wrapper elements
 *
 * Use **DateInputFloatingLabelField** when:
 * - You have a standard form field with hint and/or error
 * - You want automatic ID generation and ARIA associations
 * - You want the convenience of a single component
 */
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
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: 'boolean',
      description: 'Error state - applies destructive styling',
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
      description: 'Placeholder text (only visible when label is floating)',
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
      description:
        'Content to render on the left side (prefix). Note: rightAddOn is not supported - calendar icon is always shown.',
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
} satisfies Meta<typeof DateInputFloatingLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================
// Basic Stories
// =============================================

/**
 * Default DateInputFloatingLabel in empty state.
 * Click the input to see the label float animation and calendar popover.
 */
export const Default: Story = {
  args: {
    label: 'Date',
    placeholder: 'MM/DD/YYYY',
  },
};

/**
 * Grid showing all 9 visual states from the Figma design:
 * Empty, Hovered, Focused, Typing, Filled, Disabled, Disabled-Filled, Error, Error-Filled
 */
export const AllStates: Story = {
  args: {
    label: 'All states',
  },
  render: () => (
    <div className="grid w-[700px] grid-cols-2 gap-6">
      {/* Empty State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Empty (hover to see hover state)
        </p>
        <DateInputFloatingLabel label="Date" placeholder="MM/DD/YYYY" />
      </div>

      {/* Focused State - Simulated with description */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Focused (click input to see)
        </p>
        <DateInputFloatingLabel label="Date" placeholder="MM/DD/YYYY" />
      </div>

      {/* Filled State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Filled</p>
        <DateInputFloatingLabel
          label="Date"
          defaultValue={new Date(2024, 2, 15)}
        />
      </div>

      {/* Disabled Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (empty)</p>
        <DateInputFloatingLabel label="Date" disabled />
      </div>

      {/* Disabled Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (filled)</p>
        <DateInputFloatingLabel
          label="Date"
          disabled
          defaultValue={new Date(2024, 2, 15)}
        />
      </div>

      {/* Error Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (empty)</p>
        <DateInputFloatingLabel label="Date" error />
      </div>

      {/* Error Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (filled)</p>
        <DateInputFloatingLabel
          label="Date"
          error
          defaultValue={new Date(2024, 2, 15)}
        />
      </div>

      {/* With Required Indicator */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Required</p>
        <DateInputFloatingLabel label="Date" required />
      </div>
    </div>
  ),
};

/**
 * Shows the component with calendar popover visible.
 * Click the input or calendar icon to toggle the popover.
 */
export const WithCalendarOpen: Story = {
  args: {
    label: 'Date',
  },
  render: function CalendarOpenStory() {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <div className="h-[400px] w-[320px]">
        <p className="mb-2 text-xs text-text-tertiary">
          Calendar popover opens on focus or icon click
        </p>
        <DateInputFloatingLabel
          label="Date"
          placeholder="MM/DD/YYYY"
          open={isOpen}
          onOpenChange={setIsOpen}
        />
      </div>
    );
  },
};

/**
 * DateInputFloatingLabel with left add-on configurations.
 * Note: rightAddOn is not supported - the calendar icon occupies that slot.
 */
export const WithAddons: Story = {
  args: {
    label: 'With add-ons',
  },
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      {/* Calendar icon */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Left icon (calendar)</p>
        <DateInputFloatingLabel
          label="Event Date"
          leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
        />
      </div>

      {/* Clock icon */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Left icon (clock)</p>
        <DateInputFloatingLabel
          label="Deadline"
          leftAddOn={<Icon icon={Clock} size="sm" color="muted" />}
        />
      </div>

      {/* Dots icon */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Left icon (dots)</p>
        <DateInputFloatingLabel
          label="Schedule"
          leftAddOn={<Icon icon={CalendarDots} size="sm" color="muted" />}
        />
      </div>

      {/* Text prefix */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Text prefix</p>
        <DateInputFloatingLabel
          label="Start Date"
          leftAddOn={<span className="text-sm text-text-tertiary">From:</span>}
        />
      </div>
    </div>
  ),
};

// =============================================
// DateInputFloatingLabelField Stories (Organism)
// =============================================

/**
 * DateInputFloatingLabelField with hint text.
 * The hint provides additional context below the input.
 */
export const WithHint: Story = {
  args: {
    label: 'Date of birth',
  },
  render: () => (
    <div className="w-[320px]">
      <DateInputFloatingLabelField
        label="Date of birth"
        hint="Enter in MM/DD/YYYY format"
        placeholder="MM/DD/YYYY"
      />
    </div>
  ),
};

/**
 * DateInputFloatingLabelField with error state.
 * Notice how the error message replaces the hint and applies error styling.
 */
export const WithError: Story = {
  args: {
    label: 'Date of birth',
  },
  render: () => (
    <div className="w-[320px]">
      <DateInputFloatingLabelField
        label="Date of birth"
        hint="Enter in MM/DD/YYYY format"
        errorMessage="Please select a date in the past"
        defaultValue={new Date(2025, 5, 15)}
      />
    </div>
  ),
};

/**
 * Real-world form example using DateInputFloatingLabelField components.
 * Demonstrates a typical booking form with floating label date inputs.
 */
export const FormIntegration: Story = {
  args: {
    label: 'Form example',
  },
  render: function FormExample() {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [birthDate, setBirthDate] = useState<Date | null>(null);

    const today = new Date();

    return (
      <form className="w-[380px] space-y-5 rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold">Book Your Stay</h3>

        <DateInputFloatingLabelField
          label="Check-in date"
          required
          hint="Select arrival date"
          value={startDate}
          onChange={setStartDate}
          minDate={today}
          leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
        />

        <DateInputFloatingLabelField
          label="Check-out date"
          required
          hint="Must be after check-in"
          value={endDate}
          onChange={setEndDate}
          minDate={startDate ?? today}
          errorMessage={
            endDate && startDate && endDate <= startDate
              ? 'Check-out must be after check-in'
              : undefined
          }
        />

        <DateInputFloatingLabelField
          label="Date of birth"
          required
          hint="Must be 18 or older to book"
          value={birthDate}
          onChange={setBirthDate}
          maxDate={
            new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
          }
        />

        <button
          type="submit"
          className="w-full rounded-sm bg-primary py-2.5 text-white hover:bg-primary-hover"
          onClick={(e) => e.preventDefault()}
        >
          Book Now
        </button>
      </form>
    );
  },
};

/**
 * Demonstrates both controlled and uncontrolled input patterns.
 */
export const Controlled: Story = {
  args: {
    label: 'Controlled example',
  },
  render: function ControlledExample() {
    const [date, setDate] = useState<Date | null>(new Date(2024, 2, 15));

    return (
      <div className="flex w-[320px] flex-col gap-8">
        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Uncontrolled (uses defaultValue)
          </p>
          <DateInputFloatingLabelField
            label="Uncontrolled date"
            defaultValue={new Date(2024, 0, 1)}
            hint="Type or pick to change - value managed internally"
          />
        </div>

        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Controlled (uses value + onChange)
          </p>
          <DateInputFloatingLabelField
            label="Controlled date"
            value={date}
            onChange={setDate}
            hint={`Current: ${date ? date.toLocaleDateString() : 'null'}`}
          />
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
 * DateInputFloatingLabel with date constraints (minDate and maxDate).
 */
export const WithConstraints: Story = {
  args: {
    label: 'Date',
  },
  render: function ConstraintsStory() {
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return (
      <div className="flex w-[320px] flex-col gap-8">
        <div>
          <p className="mb-2 text-xs text-text-tertiary">Only dates this month</p>
          <DateInputFloatingLabelField
            label="Select a date"
            hint={`${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>

        <div>
          <p className="mb-2 text-xs text-text-tertiary">Future dates only</p>
          <DateInputFloatingLabelField
            label="Appointment date"
            hint="Select a future date"
            minDate={today}
          />
        </div>

        <div>
          <p className="mb-2 text-xs text-text-tertiary">Past dates only</p>
          <DateInputFloatingLabelField
            label="Birth date"
            hint="Date must be in the past"
            maxDate={today}
          />
        </div>
      </div>
    );
  },
};

/**
 * Comprehensive grid showing all combinations of states with add-ons.
 */
export const AllCombinations: Story = {
  args: {
    label: 'All combinations',
  },
  render: () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-sm font-medium text-text-primary">
        All State Combinations
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Without Add-ons */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">No Add-ons</p>
          <DateInputFloatingLabel label="Empty" />
          <DateInputFloatingLabel
            label="Filled"
            defaultValue={new Date(2024, 2, 15)}
          />
          <DateInputFloatingLabel label="Required" required />
          <DateInputFloatingLabel label="Disabled" disabled />
          <DateInputFloatingLabel
            label="Disabled Filled"
            disabled
            defaultValue={new Date(2024, 2, 15)}
          />
          <DateInputFloatingLabel label="Error" error />
          <DateInputFloatingLabel
            label="Error Filled"
            error
            defaultValue={new Date(2024, 2, 15)}
          />
        </div>

        {/* With Left Add-on */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Left Add-on</p>
          <DateInputFloatingLabel
            label="Empty"
            leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
          />
          <DateInputFloatingLabel
            label="Filled"
            defaultValue={new Date(2024, 2, 15)}
            leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
          />
          <DateInputFloatingLabel
            label="Required"
            required
            leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
          />
          <DateInputFloatingLabel
            label="Disabled"
            disabled
            leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
          />
          <DateInputFloatingLabel
            label="Disabled Filled"
            disabled
            defaultValue={new Date(2024, 2, 15)}
            leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
          />
          <DateInputFloatingLabel
            label="Error"
            error
            leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
          />
          <DateInputFloatingLabel
            label="Error Filled"
            error
            defaultValue={new Date(2024, 2, 15)}
            leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
          />
        </div>

        {/* Different Icons */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">
            Different Icons
          </p>
          <DateInputFloatingLabel
            label="Event"
            leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
          />
          <DateInputFloatingLabel
            label="Deadline"
            leftAddOn={<Icon icon={Clock} size="sm" color="muted" />}
          />
          <DateInputFloatingLabel
            label="Schedule"
            leftAddOn={<Icon icon={CalendarDots} size="sm" color="muted" />}
          />
          <DateInputFloatingLabel
            label="Text Prefix"
            leftAddOn={<span className="text-sm text-text-tertiary">Date:</span>}
          />
          <DateInputFloatingLabel
            label="Required Event"
            required
            leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
          />
          <DateInputFloatingLabel
            label="Error Event"
            error
            leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
          />
          <DateInputFloatingLabel
            label="Disabled Event"
            disabled
            leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Side-by-side comparison showing when to use DateInputFloatingLabel vs DateInputFloatingLabelField.
 */
export const StandaloneVsField: Story = {
  args: {
    label: 'Standalone vs Field',
  },
  render: () => (
    <div className="grid w-[700px] grid-cols-2 gap-8">
      {/* DateInputFloatingLabel side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">
          DateInputFloatingLabel (Standalone)
        </h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for custom layouts or when composing manually
        </p>

        <div className="space-y-4">
          {/* Basic example */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">Standalone picker</p>
            <DateInputFloatingLabel label="Select date" />
          </div>

          {/* Custom layout example */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">
              Custom composition (with external hint)
            </p>
            <div className="flex flex-col gap-1">
              <DateInputFloatingLabel
                label="Check-in"
                leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
              />
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-xs text-primary hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  View availability
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DateInputFloatingLabelField side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">
          DateInputFloatingLabelField (Wrapper)
        </h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for standard form fields with hint/error
        </p>

        <div className="space-y-4">
          {/* Standard field */}
          <DateInputFloatingLabelField
            label="Event date"
            required
            hint="Select your preferred date"
            leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
          />

          {/* Field with error */}
          <DateInputFloatingLabelField
            label="Deadline"
            required
            errorMessage="Date must be in the future"
            defaultValue={new Date(2020, 0, 1)}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Demonstrates the floating label animation in action.
 * Click the input to see the label animate to the floating position
 * while the calendar popover opens.
 */
export const AnimationDemo: Story = {
  args: {
    label: 'Animation demo',
  },
  render: function AnimationDemoComponent() {
    return (
      <div className="flex w-[320px] flex-col gap-6">
        <div>
          <p className="mb-2 text-sm text-text-primary">
            Click each input to see the floating label animation and calendar
          </p>
        </div>

        <DateInputFloatingLabel label="Start date" placeholder="MM/DD/YYYY" />

        <DateInputFloatingLabel label="End date" placeholder="MM/DD/YYYY" />

        <DateInputFloatingLabel
          label="Special date"
          placeholder="MM/DD/YYYY"
          leftAddOn={<Icon icon={CalendarCheck} size="sm" color="muted" />}
        />
      </div>
    );
  },
};
