import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CheckboxField } from '@/ui/inputs';

/**
 * CheckboxField is a composite form field that combines a Checkbox input with an associated label,
 * optional hint text, and error message display.
 *
 * ## Features
 *
 * - **Three sizes**: SM, MD, LG - matching the Checkbox component
 * - **Complete accessibility**: Proper label association, ARIA attributes, keyboard support
 * - **Hint/Error support**: Helper text that is replaced by error message when validation fails
 * - **Required indicator**: Red asterisk for required fields
 *
 * ## Usage
 *
 * ```tsx
 * import { CheckboxField } from '@/ui';
 *
 * // Basic usage
 * <CheckboxField label="Accept terms" />
 *
 * // With hint
 * <CheckboxField
 *   label="Subscribe to newsletter"
 *   hint="You can unsubscribe at any time"
 * />
 *
 * // With error
 * <CheckboxField
 *   label="Accept terms"
 *   required
 *   error="You must accept the terms"
 * />
 * ```
 */
const meta = {
  title: 'Inputs/CheckboxField',
  component: CheckboxField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The label text displayed next to the checkbox',
    },
    hint: {
      control: 'text',
      description:
        'Helper text displayed below the checkbox (hidden when error present)',
    },
    error: {
      control: 'text',
      description: 'Error message displayed below the checkbox (replaces hint)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the checkbox and label',
      table: { defaultValue: { summary: 'md' } },
    },
    checked: {
      control: 'select',
      options: [true, false, 'indeterminate'],
      description: 'The controlled checked state',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in indeterminate state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Shows required indicator and sets aria-required',
    },
    onCheckedChange: {
      action: 'checked changed',
      description: 'Callback fired when the checked state changes',
      table: {
        type: { summary: '(checked: boolean | "indeterminate") => void' },
      },
    },
  },
} satisfies Meta<typeof CheckboxField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default checkbox field in unchecked state with MD size.
 */
export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

/**
 * All three size variants: SM, MD, LG.
 */
export const AllSizes: Story = {
  args: {
    label: 'Size comparison',
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-text-tertiary">
          SM (16px checkbox)
        </span>
        <CheckboxField size="sm" label="Small checkbox field" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-text-tertiary">
          MD (20px checkbox)
        </span>
        <CheckboxField size="md" label="Medium checkbox field" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-text-tertiary">
          LG (24px checkbox)
        </span>
        <CheckboxField size="lg" label="Large checkbox field" />
      </div>
    </div>
  ),
};

/**
 * Unchecked, Checked, and Indeterminate states for each size.
 */
export const CheckedStates: Story = {
  args: {
    label: 'State comparison',
  },
  render: () => (
    <div className="flex flex-col gap-8">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-4">
          <span className="text-xs font-medium text-text-tertiary uppercase">
            {size} Size
          </span>
          <div className="flex flex-col gap-3">
            <CheckboxField size={size} label="Unchecked state" checked={false} />
            <CheckboxField size={size} label="Checked state" checked />
            <CheckboxField
              size={size}
              label="Indeterminate state"
              indeterminate
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Checkbox field with helper text.
 */
export const WithHint: Story = {
  args: {
    label: 'Subscribe to newsletter',
    hint: 'You can unsubscribe at any time from your account settings.',
  },
};

/**
 * Checkbox field with error message (hint replaced).
 */
export const WithError: Story = {
  args: {
    label: 'Accept terms and conditions',
    error: 'You must accept the terms to continue',
  },
};

/**
 * Demonstrates how error replaces hint when present.
 */
export const WithHintAndError: Story = {
  args: {
    label: 'Hint and error demo',
  },
  render: function WithHintAndErrorExample() {
    const [showError, setShowError] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <CheckboxField
          label="Accept terms and conditions"
          hint="Please read the terms before accepting"
          error={showError ? 'You must accept the terms to continue' : undefined}
        />
        <button
          type="button"
          className="w-fit rounded-sm bg-fill-tertiary px-3 py-1.5 text-sm text-text-primary hover:bg-fill-tertiary-hover"
          onClick={() => setShowError(!showError)}
        >
          {showError ? 'Clear error' : 'Show error'}
        </button>
        <p className="text-xs text-text-tertiary">
          {showError
            ? 'Error message replaces hint text'
            : 'Hint text visible when no error'}
        </p>
      </div>
    );
  },
};

/**
 * Required checkbox with red asterisk indicator.
 */
export const RequiredField: Story = {
  args: {
    label: 'I agree to the privacy policy',
    required: true,
    hint: 'Required for account creation',
  },
};

/**
 * Disabled checkboxes in various states.
 */
export const DisabledStates: Story = {
  args: {
    label: 'Disabled states',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <CheckboxField label="Disabled unchecked" disabled />
      <CheckboxField label="Disabled checked" disabled checked />
      <CheckboxField label="Disabled indeterminate" disabled indeterminate />
      <CheckboxField
        label="Disabled with hint"
        disabled
        hint="This option is currently unavailable"
      />
    </div>
  ),
};

/**
 * Interactive controlled checkbox example.
 */
export const ControlledExample: Story = {
  args: {
    label: 'Controlled example',
  },
  render: function ControlledCheckboxField() {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <CheckboxField
          label="Controlled checkbox field"
          checked={checked}
          onCheckedChange={(value) => setChecked(value === true)}
          hint="Click the checkbox or use the button below"
        />
        <p className="text-sm text-text-tertiary">
          Current state: <strong>{checked ? 'Checked' : 'Unchecked'}</strong>
        </p>
        <button
          type="button"
          className="rounded-sm bg-fill-tertiary px-3 py-1.5 text-sm text-text-primary hover:bg-fill-tertiary-hover"
          onClick={() => setChecked(!checked)}
        >
          Toggle programmatically
        </button>
      </div>
    );
  },
};

/**
 * Multiple checkbox fields in a form group.
 */
export const CheckboxGroupExample: Story = {
  args: {
    label: 'Group example',
  },
  render: function CheckboxGroupExampleRender() {
    const [notifications, setNotifications] = useState({
      email: true,
      sms: false,
      push: true,
    });

    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-text-primary">
          Notification preferences:
        </p>
        <div className="flex flex-col gap-3">
          <CheckboxField
            label="Email notifications"
            hint="Receive updates via email"
            checked={notifications.email}
            onCheckedChange={(checked) =>
              setNotifications((prev) => ({ ...prev, email: checked === true }))
            }
          />
          <CheckboxField
            label="SMS notifications"
            hint="Receive text messages for urgent alerts"
            checked={notifications.sms}
            onCheckedChange={(checked) =>
              setNotifications((prev) => ({ ...prev, sms: checked === true }))
            }
          />
          <CheckboxField
            label="Push notifications"
            hint="Receive browser push notifications"
            checked={notifications.push}
            onCheckedChange={(checked) =>
              setNotifications((prev) => ({ ...prev, push: checked === true }))
            }
          />
        </div>
        <p className="text-xs text-text-tertiary">
          Selected:{' '}
          {Object.entries(notifications)
            .filter(([, v]) => v)
            .map(([k]) => k)
            .join(', ') || 'None'}
        </p>
      </div>
    );
  },
};

/**
 * Form validation example with required checkbox and error display.
 */
export const FormValidationExample: Story = {
  args: {
    label: 'Form validation example',
  },
  render: function FormValidationExampleRender() {
    const [agreed, setAgreed] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const showError = submitted && !agreed;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      if (agreed) {
        alert('Form submitted successfully!');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="w-[320px] space-y-4">
        <CheckboxField
          label="I agree to the Terms of Service and Privacy Policy"
          required
          hint="Please read our terms before accepting"
          error={
            showError ? 'You must agree to the terms to continue' : undefined
          }
          checked={agreed}
          onCheckedChange={(value) => {
            setAgreed(value === true);
            if (submitted) setSubmitted(false);
          }}
        />

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
 * Complete matrix showing all size × state × checked combinations.
 */
export const CompleteMatrix: Story = {
  args: {
    label: 'Matrix view',
  },
  render: () => (
    <div className="space-y-8">
      <div className="text-sm font-medium text-text-primary">
        Complete Size × State Matrix
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse text-left text-xs">
          <thead>
            <tr>
              <th className="border border-border p-2">Size / State</th>
              <th className="border border-border p-2">Default</th>
              <th className="border border-border p-2">Checked</th>
              <th className="border border-border p-2">Indeterminate</th>
              <th className="border border-border p-2">Disabled</th>
              <th className="border border-border p-2">Error</th>
              <th className="border border-border p-2">Required</th>
            </tr>
          </thead>
          <tbody>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <tr key={size}>
                <td className="border border-border p-2 align-top font-medium">
                  {size.toUpperCase()}
                </td>
                <td className="border border-border p-3 align-top">
                  <CheckboxField size={size} label="Label" />
                </td>
                <td className="border border-border p-3 align-top">
                  <CheckboxField size={size} label="Label" checked />
                </td>
                <td className="border border-border p-3 align-top">
                  <CheckboxField size={size} label="Label" indeterminate />
                </td>
                <td className="border border-border p-3 align-top">
                  <CheckboxField size={size} label="Label" disabled checked />
                </td>
                <td className="border border-border p-3 align-top">
                  <CheckboxField size={size} label="Label" error="Error text" />
                </td>
                <td className="border border-border p-3 align-top">
                  <CheckboxField size={size} label="Label" required />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-tertiary">
        Hover over checkboxes to see hover state. Click to see focus/pressed
        states.
      </p>
    </div>
  ),
};

/**
 * Checkbox field with all features combined.
 */
export const FullFeatured: Story = {
  args: {
    label: 'Subscribe to premium features',
    hint: 'Get early access to new features and priority support',
    required: true,
    size: 'lg',
  },
};
