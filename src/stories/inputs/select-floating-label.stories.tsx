import { useState } from 'react';
import { Globe, MapPin, User } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Icon } from '@/ui/icons';
import {
  SelectFloatingLabel,
  SelectFloatingLabelField,
  SelectItem,
} from '@/ui/inputs';

/**
 * SelectFloatingLabel is an enhanced select/dropdown component that features a floating
 * label animation pattern. When the select is empty, the label appears as placeholder
 * text inside the trigger. Upon focus or when a value is selected, the label smoothly
 * animates to float above the input border.
 *
 * ## Dual API Approach
 *
 * This package provides two components:
 *
 * 1. **SelectFloatingLabel** (molecule) - Standalone select with floating label
 * 2. **SelectFloatingLabelField** (organism) - Wrapper with hint/error composition
 *
 * ## Features
 *
 * - **Floating label animation**: Label smoothly transitions from placeholder to floating position
 * - **Visual states**: Empty, Hovered, Focused-Open, Selected-Open, Selected, Disabled, Error
 * - **Add-ons**: Left slot for icons or text
 * - **Radix UI**: Built on accessible Radix Select primitive
 *
 * ## When to Use SelectFloatingLabel vs SelectFloatingLabelField
 *
 * Use **SelectFloatingLabel** when:
 * - You need custom layout (e.g., select alongside other elements)
 * - You want to compose hint/error manually
 * - You need the select without additional wrapper elements
 *
 * Use **SelectFloatingLabelField** when:
 * - You have a standard form field with hint and/or error
 * - You want automatic ID generation and ARIA associations
 * - You want the convenience of an options array API
 */
const meta = {
  title: 'Inputs/SelectFloatingLabel',
  component: SelectFloatingLabel,
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
      description: 'Additional CSS classes for the trigger element',
    },
    value: {
      control: 'text',
      description: 'Controlled value',
    },
    defaultValue: {
      control: 'text',
      description: 'Default value for uncontrolled mode',
    },
  },
} satisfies Meta<typeof SelectFloatingLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
];

/**
 * Default SelectFloatingLabel in empty state.
 * Click the select to see the label float animation and open the dropdown.
 */
export const Default: Story = {
  args: {
    label: 'Country',
  },
  render: (args) => (
    <div className="w-[320px]">
      <SelectFloatingLabel {...args}>
        {countryOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectFloatingLabel>
    </div>
  ),
};

/**
 * Grid showing all 9 visual states from the Figma design:
 * Empty, Hovered, Focused-Open, Selected-Open, Selected, Disabled, Disabled-Selected, Error, Error-Selected
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
        <SelectFloatingLabel label="Country">
          {countryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectFloatingLabel>
      </div>

      {/* Focused/Open State - Simulated with description */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Focused - Open (click to see)
        </p>
        <SelectFloatingLabel label="Country">
          {countryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectFloatingLabel>
      </div>

      {/* Selected State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Selected</p>
        <SelectFloatingLabel label="Country" defaultValue="us">
          {countryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectFloatingLabel>
      </div>

      {/* Disabled Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (empty)</p>
        <SelectFloatingLabel label="Country" disabled>
          {countryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectFloatingLabel>
      </div>

      {/* Disabled Selected */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (selected)</p>
        <SelectFloatingLabel label="Country" disabled defaultValue="ca">
          {countryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectFloatingLabel>
      </div>

      {/* Error Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (empty)</p>
        <SelectFloatingLabel label="Country" error>
          {countryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectFloatingLabel>
      </div>

      {/* Error Selected */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (selected)</p>
        <SelectFloatingLabel label="Country" error defaultValue="mx">
          {countryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectFloatingLabel>
      </div>

      {/* With Required Indicator */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Required</p>
        <SelectFloatingLabel label="Country" required>
          {countryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectFloatingLabel>
      </div>
    </div>
  ),
};

/**
 * SelectFloatingLabel with left add-on (icon).
 */
export const WithLeftAddOn: Story = {
  args: {
    label: 'With left add-on',
  },
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Globe icon</p>
        <SelectFloatingLabel
          label="Country"
          leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
        >
          {countryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectFloatingLabel>
      </div>

      <div>
        <p className="mb-2 text-xs text-text-tertiary">Map pin icon</p>
        <SelectFloatingLabel
          label="Location"
          leftAddOn={<Icon icon={MapPin} size="sm" color="muted" />}
        >
          <SelectItem value="ny">New York</SelectItem>
          <SelectItem value="la">Los Angeles</SelectItem>
          <SelectItem value="ch">Chicago</SelectItem>
        </SelectFloatingLabel>
      </div>

      <div>
        <p className="mb-2 text-xs text-text-tertiary">With selected value</p>
        <SelectFloatingLabel
          label="Country"
          leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
          defaultValue="uk"
        >
          {countryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectFloatingLabel>
      </div>
    </div>
  ),
};

// =============================================
// SelectFloatingLabelField Stories (Organism)
// =============================================

/**
 * SelectFloatingLabelField with hint text.
 * The hint provides additional context below the select.
 */
export const WithHint: Story = {
  args: {
    label: 'With hint',
  },
  render: () => (
    <div className="w-[320px]">
      <SelectFloatingLabelField
        label="Country"
        hint="Select your country of residence"
        options={countryOptions}
      />
    </div>
  ),
};

/**
 * SelectFloatingLabelField with error state.
 * Notice how the error message replaces the hint and applies error styling.
 */
export const WithError: Story = {
  args: {
    label: 'With error',
  },
  render: () => (
    <div className="w-[320px]">
      <SelectFloatingLabelField
        label="Country"
        hint="Select your country"
        errorMessage="Please select a country"
        options={countryOptions}
      />
    </div>
  ),
};

/**
 * SelectFloatingLabel with many options to demonstrate scroll behavior.
 */
export const WithManyOptions: Story = {
  args: {
    label: 'With many options',
  },
  render: () => {
    const manyOptions = [
      'Afghanistan',
      'Albania',
      'Algeria',
      'Andorra',
      'Angola',
      'Argentina',
      'Armenia',
      'Australia',
      'Austria',
      'Azerbaijan',
      'Bahamas',
      'Bahrain',
      'Bangladesh',
      'Barbados',
      'Belarus',
      'Belgium',
      'Belize',
      'Benin',
      'Bhutan',
      'Bolivia',
      'Brazil',
      'Brunei',
      'Bulgaria',
      'Cambodia',
      'Cameroon',
      'Canada',
      'Chile',
      'China',
      'Colombia',
      'Croatia',
      'Cuba',
      'Cyprus',
      'Denmark',
      'Ecuador',
      'Egypt',
      'Estonia',
      'Ethiopia',
      'Finland',
      'France',
      'Germany',
      'Greece',
      'Hungary',
      'Iceland',
      'India',
      'Indonesia',
      'Ireland',
      'Israel',
      'Italy',
      'Japan',
      'Kenya',
    ].map((name) => ({
      value: name.toLowerCase().replace(/\s+/g, '-'),
      label: name,
    }));

    return (
      <div className="w-[320px]">
        <SelectFloatingLabelField
          label="Country"
          hint="Scroll to see more options"
          options={manyOptions}
        />
      </div>
    );
  },
};

/**
 * Demonstrates both controlled and uncontrolled select patterns.
 */
export const ControlledVsUncontrolled: Story = {
  args: {
    label: 'Controlled example',
  },
  render: function ControlledExample() {
    const [controlled, setControlled] = useState('');

    return (
      <div className="flex w-[320px] flex-col gap-8">
        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Uncontrolled (uses defaultValue)
          </p>
          <SelectFloatingLabelField
            label="Uncontrolled select"
            defaultValue="us"
            hint="Selection managed internally"
            options={countryOptions}
          />
        </div>

        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Controlled (uses value + onValueChange)
          </p>
          <SelectFloatingLabelField
            label="Controlled select"
            value={controlled}
            onValueChange={setControlled}
            hint={`Current value: "${controlled || '(none)'}"`}
            options={countryOptions}
          />
        </div>
      </div>
    );
  },
};

/**
 * Real-world form example using SelectFloatingLabelField components.
 * Demonstrates a typical address form with floating label selects.
 */
export const FormIntegration: Story = {
  args: {
    label: 'Form example',
  },
  render: function FormExample() {
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');

    const usStates = [
      { value: 'ca', label: 'California' },
      { value: 'ny', label: 'New York' },
      { value: 'tx', label: 'Texas' },
      { value: 'fl', label: 'Florida' },
      { value: 'wa', label: 'Washington' },
    ];

    return (
      <form className="w-[360px] space-y-5 rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold">Shipping Address</h3>

        <SelectFloatingLabelField
          label="Country"
          required
          value={country}
          onValueChange={setCountry}
          leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
          options={countryOptions}
        />

        <SelectFloatingLabelField
          label="State / Province"
          required
          value={state}
          onValueChange={setState}
          disabled={country !== 'us'}
          hint={country !== 'us' ? 'Select United States first' : undefined}
          leftAddOn={<Icon icon={MapPin} size="sm" color="muted" />}
          options={usStates}
        />

        <SelectFloatingLabelField
          label="Preferred contact method"
          hint="How should we reach you?"
          options={[
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Phone' },
            { value: 'sms', label: 'SMS' },
          ]}
        />

        <button
          type="submit"
          className="w-full rounded-sm bg-primary py-2.5 text-white hover:bg-primary-hover"
          onClick={(e) => e.preventDefault()}
        >
          Continue to Payment
        </button>
      </form>
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
      <div className="text-sm font-medium text-text-primary">
        All State Combinations
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Without Add-ons */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">No Add-ons</p>
          <SelectFloatingLabel label="Empty">
            {countryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectFloatingLabel>
          <SelectFloatingLabel label="Selected" defaultValue="us">
            {countryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectFloatingLabel>
          <SelectFloatingLabel label="Required" required>
            {countryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectFloatingLabel>
          <SelectFloatingLabel label="Disabled" disabled>
            {countryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectFloatingLabel>
          <SelectFloatingLabel
            label="Disabled Selected"
            disabled
            defaultValue="ca"
          >
            {countryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectFloatingLabel>
          <SelectFloatingLabel label="Error" error>
            {countryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectFloatingLabel>
          <SelectFloatingLabel label="Error Selected" error defaultValue="mx">
            {countryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectFloatingLabel>
        </div>

        {/* With Left Add-on */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Left Add-on</p>
          <SelectFloatingLabel
            label="Empty"
            leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
          >
            {countryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectFloatingLabel>
          <SelectFloatingLabel
            label="Selected"
            defaultValue="us"
            leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
          >
            {countryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectFloatingLabel>
          <SelectFloatingLabel
            label="Required"
            required
            leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
          >
            {countryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectFloatingLabel>
          <SelectFloatingLabel
            label="Disabled"
            disabled
            leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
          >
            {countryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectFloatingLabel>
          <SelectFloatingLabel
            label="Disabled Selected"
            disabled
            defaultValue="ca"
            leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
          >
            {countryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectFloatingLabel>
          <SelectFloatingLabel
            label="Error"
            error
            leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
          >
            {countryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectFloatingLabel>
          <SelectFloatingLabel
            label="Error Selected"
            error
            defaultValue="mx"
            leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
          >
            {countryOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectFloatingLabel>
        </div>

        {/* Field variants with hint/error */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">
            Field (with hint/error)
          </p>
          <SelectFloatingLabelField
            label="With Hint"
            hint="Select an option"
            options={countryOptions}
          />
          <SelectFloatingLabelField
            label="With Error"
            errorMessage="Required field"
            options={countryOptions}
          />
          <SelectFloatingLabelField
            label="Selected + Hint"
            defaultValue="us"
            hint="Good choice!"
            options={countryOptions}
          />
          <SelectFloatingLabelField
            label="Selected + Error"
            defaultValue="mx"
            errorMessage="Invalid selection"
            options={countryOptions}
          />
          <SelectFloatingLabelField
            label="Required + Hint"
            required
            hint="This field is required"
            options={countryOptions}
          />
          <SelectFloatingLabelField
            label="Disabled + Hint"
            disabled
            hint="Not available"
            options={countryOptions}
          />
          <SelectFloatingLabelField
            label="Disabled Selected"
            disabled
            defaultValue="ca"
            hint="Locked value"
            options={countryOptions}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Side-by-side comparison showing when to use SelectFloatingLabel vs SelectFloatingLabelField.
 */
export const StandaloneVsField: Story = {
  args: {
    label: 'Standalone vs Field',
  },
  render: () => (
    <div className="grid w-[700px] grid-cols-2 gap-8">
      {/* SelectFloatingLabel side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">
          SelectFloatingLabel (Standalone)
        </h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for custom layouts or when composing manually
        </p>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs text-text-tertiary">Basic select</p>
            <SelectFloatingLabel label="Country">
              {countryOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectFloatingLabel>
          </div>

          <div>
            <p className="mb-2 text-xs text-text-tertiary">With icon</p>
            <SelectFloatingLabel
              label="Location"
              leftAddOn={<Icon icon={MapPin} size="sm" color="muted" />}
            >
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectFloatingLabel>
          </div>

          <div>
            <p className="mb-2 text-xs text-text-tertiary">Custom composition</p>
            <div className="flex flex-col gap-1">
              <SelectFloatingLabel
                label="Assignee"
                leftAddOn={<Icon icon={User} size="sm" color="muted" />}
              >
                <SelectItem value="me">Me</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectFloatingLabel>
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-xs text-primary hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Manage team members
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SelectFloatingLabelField side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">
          SelectFloatingLabelField (Wrapper)
        </h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for standard form fields with hint/error
        </p>

        <div className="space-y-4">
          <SelectFloatingLabelField
            label="Country"
            required
            hint="Where do you live?"
            leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
            options={countryOptions}
          />

          <SelectFloatingLabelField
            label="Language"
            required
            errorMessage="Please select a language"
            options={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Demonstrates the floating label animation in action.
 * Click each select to see the label animate to the floating position.
 */
export const AnimationDemo: Story = {
  args: {
    label: 'Animation demo',
  },
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-sm text-text-primary">
          Click each select to see the floating label animation
        </p>
      </div>

      <SelectFloatingLabel label="First select">
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
      </SelectFloatingLabel>

      <SelectFloatingLabel label="Second select">
        <SelectItem value="1">Option 1</SelectItem>
        <SelectItem value="2">Option 2</SelectItem>
      </SelectFloatingLabel>

      <SelectFloatingLabel
        label="With icon"
        leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
      >
        {countryOptions.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectFloatingLabel>
    </div>
  ),
};
