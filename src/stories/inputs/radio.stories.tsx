import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Radio, RadioGroup } from '@/ui/inputs';

/**
 * Radio is a form control that allows users to select one option from a set of
 * mutually exclusive choices.
 *
 * ## Features
 *
 * - **Two states**: Unchecked, Checked (with inner circle indicator)
 * - **Size variants**: SM (16px), MD (20px), LG (24px)
 * - **Interactive states**: Default, Hover, Focus, Pressed, Disabled, Error
 * - **Accessibility**: Built on Radix UI for proper ARIA attributes and keyboard support
 * - **Group management**: RadioGroup component for managing selection state
 *
 * ## Usage
 *
 * ```tsx
 * import { Radio, RadioGroup } from '@/ui';
 *
 * // Basic usage
 * <RadioGroup defaultValue="option1">
 *   <Radio value="option1" />
 *   <Radio value="option2" />
 * </RadioGroup>
 *
 * // Controlled
 * const [value, setValue] = useState('option1');
 * <RadioGroup value={value} onValueChange={setValue}>
 *   <Radio value="option1" />
 *   <Radio value="option2" />
 * </RadioGroup>
 *
 * // With labels
 * <RadioGroup defaultValue="option1">
 *   <label className="flex items-center gap-2">
 *     <Radio value="option1" />
 *     Option 1
 *   </label>
 * </RadioGroup>
 * ```
 */
const meta = {
  title: 'Inputs/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    value: 'option1',
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'The value of this radio item (required)',
      table: {
        type: { summary: 'string' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the radio',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio is disabled',
    },
    error: {
      control: 'boolean',
      description: 'Whether the radio is in error state',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default radio in unchecked state with MD size.
 * Radio must be used within a RadioGroup.
 */
export const Default: Story = {
  args: {
    value: 'option1',
  },
  render: (args) => (
    <RadioGroup defaultValue="">
      <Radio {...args} />
    </RadioGroup>
  ),
};

/**
 * Radio in checked state.
 */
export const Checked: Story = {
  args: {
    value: 'option1',
  },
  render: (args) => (
    <RadioGroup defaultValue="option1">
      <Radio {...args} />
    </RadioGroup>
  ),
};

/**
 * All three size variants: SM (16px), MD (20px), LG (24px).
 */
export const AllSizes: Story = {
  args: {
    value: 'option1',
  },
  render: () => (
    <div className="flex items-end gap-8">
      <div className="flex flex-col items-center gap-2">
        <RadioGroup defaultValue="option1">
          <Radio size="sm" value="option1" />
        </RadioGroup>
        <span className="text-xs text-text-tertiary">SM (16px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <RadioGroup defaultValue="option1">
          <Radio size="md" value="option1" />
        </RadioGroup>
        <span className="text-xs text-text-tertiary">MD (20px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <RadioGroup defaultValue="option1">
          <Radio size="lg" value="option1" />
        </RadioGroup>
        <span className="text-xs text-text-tertiary">LG (24px)</span>
      </div>
    </div>
  ),
};

/**
 * Both checked states: Unchecked and Checked.
 */
export const CheckedStates: Story = {
  args: {
    value: 'option1',
  },
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <RadioGroup defaultValue="">
          <Radio value="option1" />
        </RadioGroup>
        <span className="text-xs text-text-tertiary">Unchecked</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <RadioGroup defaultValue="option1">
          <Radio value="option1" />
        </RadioGroup>
        <span className="text-xs text-text-tertiary">Checked</span>
      </div>
    </div>
  ),
};

/**
 * Disabled radio states.
 */
export const DisabledState: Story = {
  args: {
    value: 'option1',
  },
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <RadioGroup defaultValue="">
          <Radio value="option1" disabled />
        </RadioGroup>
        <span className="text-xs text-text-tertiary">Disabled Unchecked</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <RadioGroup defaultValue="option1">
          <Radio value="option1" disabled />
        </RadioGroup>
        <span className="text-xs text-text-tertiary">Disabled Checked</span>
      </div>
    </div>
  ),
};

/**
 * Error state radios - useful for form validation.
 */
export const ErrorState: Story = {
  args: {
    value: 'option1',
  },
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <RadioGroup defaultValue="">
          <Radio value="option1" error />
        </RadioGroup>
        <span className="text-xs text-text-tertiary">Error Unchecked</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <RadioGroup defaultValue="option1">
          <Radio value="option1" error />
        </RadioGroup>
        <span className="text-xs text-text-tertiary">Error Checked</span>
      </div>
    </div>
  ),
};

/**
 * RadioGroup with multiple options - the most common usage pattern.
 */
export const WithLabels: Story = {
  args: {
    value: 'option1',
  },
  render: () => (
    <RadioGroup defaultValue="option2">
      <label className="flex cursor-pointer items-center gap-3">
        <Radio value="option1" />
        <span className="text-sm text-text-primary">First option</span>
      </label>
      <label className="flex cursor-pointer items-center gap-3">
        <Radio value="option2" />
        <span className="text-sm text-text-primary">Second option</span>
      </label>
      <label className="flex cursor-not-allowed items-center gap-3">
        <Radio value="option3" disabled />
        <span className="text-sm text-text-tertiary">Disabled option</span>
      </label>
    </RadioGroup>
  ),
};

/**
 * Horizontal layout using orientation prop.
 */
export const HorizontalLayout: Story = {
  args: {
    value: 'option1',
  },
  render: () => (
    <RadioGroup orientation="horizontal" defaultValue="option1">
      <label className="flex cursor-pointer items-center gap-2">
        <Radio value="option1" />
        <span className="text-sm text-text-primary">Option 1</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2">
        <Radio value="option2" />
        <span className="text-sm text-text-primary">Option 2</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2">
        <Radio value="option3" />
        <span className="text-sm text-text-primary">Option 3</span>
      </label>
    </RadioGroup>
  ),
};

/**
 * Controlled RadioGroup with React state.
 */
export const RadioGroupControlled: Story = {
  args: {
    value: 'option1',
  },
  render: function ControlledRadioGroup() {
    const [value, setValue] = useState('option1');

    return (
      <div className="flex flex-col items-center gap-4">
        <RadioGroup value={value} onValueChange={setValue}>
          <label className="flex cursor-pointer items-center gap-3">
            <Radio value="option1" />
            <span className="text-sm text-text-primary">Option 1</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <Radio value="option2" />
            <span className="text-sm text-text-primary">Option 2</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <Radio value="option3" />
            <span className="text-sm text-text-primary">Option 3</span>
          </label>
        </RadioGroup>
        <p className="text-xs text-text-tertiary">
          Selected: <strong>{value}</strong>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-sm bg-fill-tertiary px-3 py-1.5 text-sm text-text-primary hover:bg-fill-tertiary-hover"
            onClick={() => setValue('option1')}
          >
            Select Option 1
          </button>
          <button
            type="button"
            className="rounded-sm bg-fill-tertiary px-3 py-1.5 text-sm text-text-primary hover:bg-fill-tertiary-hover"
            onClick={() => setValue('option2')}
          >
            Select Option 2
          </button>
        </div>
      </div>
    );
  },
};

/**
 * Uncontrolled RadioGroup with defaultValue.
 */
export const RadioGroupUncontrolled: Story = {
  args: {
    value: 'option1',
  },
  render: () => (
    <RadioGroup defaultValue="option2" name="uncontrolled-radio-group">
      <label className="flex cursor-pointer items-center gap-3">
        <Radio value="option1" />
        <span className="text-sm text-text-primary">Option 1</span>
      </label>
      <label className="flex cursor-pointer items-center gap-3">
        <Radio value="option2" />
        <span className="text-sm text-text-primary">Option 2 (default)</span>
      </label>
      <label className="flex cursor-pointer items-center gap-3">
        <Radio value="option3" />
        <span className="text-sm text-text-primary">Option 3</span>
      </label>
    </RadioGroup>
  ),
};

/**
 * Form integration example with validation.
 */
export const FormIntegration: Story = {
  args: {
    value: 'option1',
  },
  render: function FormExample() {
    const [value, setValue] = useState<string>('');
    const [submitted, setSubmitted] = useState(false);
    const showError = submitted && !value;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      if (value) {
        alert(`Form submitted with: ${value}`);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="w-[320px] space-y-4">
        <fieldset>
          <legend className="mb-3 text-sm font-medium text-text-primary">
            Select your preferred contact method:
          </legend>
          <RadioGroup
            value={value}
            onValueChange={(v) => {
              setValue(v);
              if (submitted) setSubmitted(false);
            }}
            name="contact-method"
          >
            <label className="flex cursor-pointer items-center gap-3">
              <Radio value="email" error={showError} />
              <span className="text-sm text-text-primary">Email</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <Radio value="phone" error={showError} />
              <span className="text-sm text-text-primary">Phone</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <Radio value="sms" error={showError} />
              <span className="text-sm text-text-primary">SMS</span>
            </label>
          </RadioGroup>
          {showError && (
            <p className="mt-2 text-xs text-destructive">
              Please select a contact method
            </p>
          )}
        </fieldset>

        <button
          type="submit"
          className="w-full rounded-sm bg-fill-primary py-2.5 text-sm text-text-overlay-white hover:bg-fill-primary-hover"
        >
          Submit
        </button>
      </form>
    );
  },
};

/**
 * Complete matrix showing all size × state combinations.
 */
export const CompleteMatrix: Story = {
  args: {
    value: 'option1',
  },
  render: () => (
    <div className="space-y-8">
      <div className="text-sm font-medium text-text-primary">
        Complete Size × State Matrix
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse text-center text-xs">
          <thead>
            <tr>
              <th className="border border-border p-2">Size / State</th>
              <th className="border border-border p-2">Default</th>
              <th className="border border-border p-2">Checked</th>
              <th className="border border-border p-2">Disabled</th>
              <th className="border border-border p-2">Disabled Checked</th>
              <th className="border border-border p-2">Error</th>
              <th className="border border-border p-2">Error Checked</th>
            </tr>
          </thead>
          <tbody>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <tr key={size}>
                <td className="border border-border p-2 font-medium">
                  {size.toUpperCase()}
                </td>
                <td className="border border-border p-3">
                  <div className="flex justify-center">
                    <RadioGroup defaultValue="">
                      <Radio size={size} value="option" />
                    </RadioGroup>
                  </div>
                </td>
                <td className="border border-border p-3">
                  <div className="flex justify-center">
                    <RadioGroup defaultValue="option">
                      <Radio size={size} value="option" />
                    </RadioGroup>
                  </div>
                </td>
                <td className="border border-border p-3">
                  <div className="flex justify-center">
                    <RadioGroup defaultValue="">
                      <Radio size={size} value="option" disabled />
                    </RadioGroup>
                  </div>
                </td>
                <td className="border border-border p-3">
                  <div className="flex justify-center">
                    <RadioGroup defaultValue="option">
                      <Radio size={size} value="option" disabled />
                    </RadioGroup>
                  </div>
                </td>
                <td className="border border-border p-3">
                  <div className="flex justify-center">
                    <RadioGroup defaultValue="">
                      <Radio size={size} value="option" error />
                    </RadioGroup>
                  </div>
                </td>
                <td className="border border-border p-3">
                  <div className="flex justify-center">
                    <RadioGroup defaultValue="option">
                      <Radio size={size} value="option" error />
                    </RadioGroup>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-tertiary">
        Hover over radios to see hover state. Click to see focus/pressed states.
      </p>
    </div>
  ),
};

/**
 * Interactive playground with all controls.
 */
export const Playground: Story = {
  args: {
    value: 'option1',
    size: 'md',
    disabled: false,
    error: false,
  },
  render: (args) => (
    <RadioGroup defaultValue="option1">
      <label className="flex cursor-pointer items-center gap-3">
        <Radio {...args} value="option1" />
        <span className="text-sm text-text-primary">Option 1</span>
      </label>
      <label className="flex cursor-pointer items-center gap-3">
        <Radio {...args} value="option2" />
        <span className="text-sm text-text-primary">Option 2</span>
      </label>
      <label className="flex cursor-pointer items-center gap-3">
        <Radio {...args} value="option3" />
        <span className="text-sm text-text-primary">Option 3</span>
      </label>
    </RadioGroup>
  ),
};

/**
 * Real-world example: Subscription tier selection.
 */
export const SubscriptionTiers: Story = {
  args: {
    value: 'option1',
  },
  render: function SubscriptionExample() {
    const [tier, setTier] = useState('pro');

    const tiers = [
      {
        value: 'free',
        name: 'Free',
        price: '$0/mo',
        features: '5 projects, 1GB storage',
      },
      {
        value: 'pro',
        name: 'Pro',
        price: '$19/mo',
        features: 'Unlimited projects, 100GB storage',
      },
      {
        value: 'enterprise',
        name: 'Enterprise',
        price: 'Custom',
        features: 'Custom features, dedicated support',
      },
    ];

    return (
      <RadioGroup
        value={tier}
        onValueChange={setTier}
        className="w-[320px] gap-3"
      >
        {tiers.map((t) => (
          <label
            key={t.value}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              tier === t.value
                ? 'border-fill-primary bg-background-secondary'
                : 'border-border hover:border-border-hover'
            }`}
          >
            <Radio value={t.value} className="mt-0.5" />
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-text-primary">
                  {t.name}
                </span>
                <span className="text-sm text-text-secondary">{t.price}</span>
              </div>
              <p className="mt-1 text-xs text-text-tertiary">{t.features}</p>
            </div>
          </label>
        ))}
      </RadioGroup>
    );
  },
};
