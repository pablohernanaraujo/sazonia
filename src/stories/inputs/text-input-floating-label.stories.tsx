import { useState } from 'react';
import {
  EnvelopeSimple,
  Eye,
  EyeSlash,
  Lock,
  MagnifyingGlass,
  User,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Icon } from '@/ui/icons';
import { TextInputFloatingLabel, TextInputFloatingLabelField } from '@/ui/inputs';

/**
 * TextInputFloatingLabel is an enhanced text input component that features a floating
 * label animation pattern. When the input is empty, the label appears as placeholder
 * text inside the input field. Upon focus or when the input has a value, the label
 * smoothly animates to float above the input border.
 *
 * ## Dual API Approach
 *
 * This package provides two components:
 *
 * 1. **TextInputFloatingLabel** (molecule) - Standalone input with floating label
 * 2. **TextInputFloatingLabelField** (organism) - Wrapper with hint/error composition
 *
 * ## Features
 *
 * - **Floating label animation**: Label smoothly transitions from placeholder to floating position
 * - **Visual states**: Empty, Hovered, Focused, Typing, Filled, Disabled, Error
 * - **Add-ons**: Left and right slots for icons, text, or custom content
 * - **Autofill detection**: Label stays floated when browser autofills the input
 *
 * ## When to Use TextInputFloatingLabel vs TextInputFloatingLabelField
 *
 * Use **TextInputFloatingLabel** when:
 * - You need custom layout (e.g., input alongside other elements)
 * - You want to compose hint/error manually
 * - You need the input without additional wrapper elements
 *
 * Use **TextInputFloatingLabelField** when:
 * - You have a standard form field with hint and/or error
 * - You want automatic ID generation and ARIA associations
 * - You want the convenience of a single component
 */
const meta = {
  title: 'Inputs/TextInputFloatingLabel',
  component: TextInputFloatingLabel,
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
    },
    leftAddOn: {
      control: false,
      description: 'Content to render on the left side (prefix)',
    },
    rightAddOn: {
      control: false,
      description: 'Content to render on the right side (suffix)',
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
} satisfies Meta<typeof TextInputFloatingLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default TextInputFloatingLabel in empty state.
 * Click the input to see the label float animation.
 */
export const Default: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
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
        <TextInputFloatingLabel label="Email" placeholder="you@example.com" />
      </div>

      {/* Focused State - Simulated with description */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Focused (click input to see)
        </p>
        <TextInputFloatingLabel label="Email" placeholder="you@example.com" />
      </div>

      {/* Filled State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Filled</p>
        <TextInputFloatingLabel label="Email" defaultValue="user@example.com" />
      </div>

      {/* Disabled Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (empty)</p>
        <TextInputFloatingLabel label="Email" disabled />
      </div>

      {/* Disabled Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (filled)</p>
        <TextInputFloatingLabel
          label="Email"
          disabled
          defaultValue="disabled@example.com"
        />
      </div>

      {/* Error Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (empty)</p>
        <TextInputFloatingLabel label="Email" error />
      </div>

      {/* Error Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (filled)</p>
        <TextInputFloatingLabel
          label="Email"
          error
          defaultValue="invalid-email"
        />
      </div>

      {/* With Required Indicator */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Required</p>
        <TextInputFloatingLabel label="Email" required />
      </div>
    </div>
  ),
};

/**
 * TextInputFloatingLabel with various add-on configurations: icons, text prefixes/suffixes.
 */
export const WithAddons: Story = {
  args: {
    label: 'With add-ons',
  },
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      {/* Search icon */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Left icon (search)</p>
        <TextInputFloatingLabel
          label="Search"
          leftAddOn={<Icon icon={MagnifyingGlass} size="sm" color="muted" />}
        />
      </div>

      {/* Email icon */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Left icon (email)</p>
        <TextInputFloatingLabel
          label="Email address"
          leftAddOn={<Icon icon={EnvelopeSimple} size="sm" color="muted" />}
          placeholder="you@example.com"
        />
      </div>

      {/* Password with right icon */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Right icon (password)</p>
        <TextInputFloatingLabel
          label="Password"
          type="password"
          rightAddOn={<Icon icon={Eye} size="sm" color="muted" />}
        />
      </div>

      {/* Both add-ons */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Both add-ons</p>
        <TextInputFloatingLabel
          label="Username"
          leftAddOn={<Icon icon={User} size="sm" color="muted" />}
          rightAddOn={<span className="text-sm text-text-tertiary">.com</span>}
        />
      </div>

      {/* Text prefix */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Text prefix</p>
        <TextInputFloatingLabel
          label="Website"
          leftAddOn={<span className="text-sm text-text-tertiary">https://</span>}
        />
      </div>

      {/* Text suffix */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Text suffix</p>
        <TextInputFloatingLabel
          label="Price"
          rightAddOn={<span className="text-sm text-text-tertiary">USD</span>}
          type="number"
        />
      </div>
    </div>
  ),
};

// =============================================
// TextInputFloatingLabelField Stories (Organism)
// =============================================

/**
 * TextInputFloatingLabelField with hint text.
 * The hint provides additional context below the input.
 */
export const WithHint: Story = {
  args: {
    label: 'Email address',
  },
  render: () => (
    <div className="w-[320px]">
      <TextInputFloatingLabelField
        label="Email address"
        hint="We'll never share your email with anyone."
        placeholder="you@example.com"
      />
    </div>
  ),
};

/**
 * TextInputFloatingLabelField with error state.
 * Notice how the error message replaces the hint and applies error styling.
 */
export const WithError: Story = {
  args: {
    label: 'Email address',
  },
  render: () => (
    <div className="w-[320px]">
      <TextInputFloatingLabelField
        label="Email address"
        hint="We'll never share your email."
        errorMessage="Please enter a valid email address."
        defaultValue="invalid-email"
      />
    </div>
  ),
};

/**
 * Real-world form example using TextInputFloatingLabelField components.
 * Demonstrates a typical sign-up form with floating labels.
 */
export const FormIntegration: Story = {
  args: {
    label: 'Form example',
  },
  render: function FormExample() {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <form className="w-[360px] space-y-5 rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold">Create Account</h3>

        <TextInputFloatingLabelField
          label="Full name"
          required
          placeholder="John Doe"
          autoComplete="name"
          leftAddOn={<Icon icon={User} size="sm" color="muted" />}
        />

        <TextInputFloatingLabelField
          label="Email address"
          required
          hint="We'll send a verification email"
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          leftAddOn={<Icon icon={EnvelopeSimple} size="sm" color="muted" />}
        />

        <TextInputFloatingLabelField
          label="Password"
          required
          hint="At least 8 characters"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          leftAddOn={<Icon icon={Lock} size="sm" color="muted" />}
          rightAddOn={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon
                icon={showPassword ? EyeSlash : Eye}
                size="sm"
                color="muted"
                className="cursor-pointer hover:text-text-primary"
              />
            </button>
          }
        />

        <button
          type="submit"
          className="w-full rounded-sm bg-primary py-2.5 text-white hover:bg-primary-hover"
          onClick={(e) => e.preventDefault()}
        >
          Create Account
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
    const [controlled, setControlled] = useState('');

    return (
      <div className="flex w-[320px] flex-col gap-8">
        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Uncontrolled (uses defaultValue)
          </p>
          <TextInputFloatingLabelField
            label="Uncontrolled input"
            defaultValue="Initial value"
            hint="Type to change - value managed internally"
          />
        </div>

        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Controlled (uses value + onChange)
          </p>
          <TextInputFloatingLabelField
            label="Controlled input"
            value={controlled}
            onChange={(e) => setControlled(e.target.value)}
            placeholder="Type here..."
            hint={`Current value: "${controlled}"`}
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
          <TextInputFloatingLabel label="Empty" />
          <TextInputFloatingLabel label="Filled" defaultValue="Value" />
          <TextInputFloatingLabel label="Required" required />
          <TextInputFloatingLabel label="Disabled" disabled />
          <TextInputFloatingLabel
            label="Disabled Filled"
            disabled
            defaultValue="Value"
          />
          <TextInputFloatingLabel label="Error" error />
          <TextInputFloatingLabel
            label="Error Filled"
            error
            defaultValue="Invalid"
          />
        </div>

        {/* With Left Add-on */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Left Add-on</p>
          <TextInputFloatingLabel
            label="Empty"
            leftAddOn={<Icon icon={EnvelopeSimple} size="sm" color="muted" />}
          />
          <TextInputFloatingLabel
            label="Filled"
            defaultValue="Value"
            leftAddOn={<Icon icon={EnvelopeSimple} size="sm" color="muted" />}
          />
          <TextInputFloatingLabel
            label="Required"
            required
            leftAddOn={<Icon icon={EnvelopeSimple} size="sm" color="muted" />}
          />
          <TextInputFloatingLabel
            label="Disabled"
            disabled
            leftAddOn={<Icon icon={EnvelopeSimple} size="sm" color="muted" />}
          />
          <TextInputFloatingLabel
            label="Disabled Filled"
            disabled
            defaultValue="Value"
            leftAddOn={<Icon icon={EnvelopeSimple} size="sm" color="muted" />}
          />
          <TextInputFloatingLabel
            label="Error"
            error
            leftAddOn={<Icon icon={EnvelopeSimple} size="sm" color="muted" />}
          />
          <TextInputFloatingLabel
            label="Error Filled"
            error
            defaultValue="Invalid"
            leftAddOn={<Icon icon={EnvelopeSimple} size="sm" color="muted" />}
          />
        </div>

        {/* With Both Add-ons */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Both Add-ons</p>
          <TextInputFloatingLabel
            label="Empty"
            leftAddOn={<Icon icon={Lock} size="sm" color="muted" />}
            rightAddOn={<Icon icon={Eye} size="sm" color="muted" />}
          />
          <TextInputFloatingLabel
            label="Filled"
            defaultValue="Value"
            leftAddOn={<Icon icon={Lock} size="sm" color="muted" />}
            rightAddOn={<Icon icon={Eye} size="sm" color="muted" />}
          />
          <TextInputFloatingLabel
            label="Required"
            required
            leftAddOn={<Icon icon={Lock} size="sm" color="muted" />}
            rightAddOn={<Icon icon={Eye} size="sm" color="muted" />}
          />
          <TextInputFloatingLabel
            label="Disabled"
            disabled
            leftAddOn={<Icon icon={Lock} size="sm" color="muted" />}
            rightAddOn={<Icon icon={Eye} size="sm" color="muted" />}
          />
          <TextInputFloatingLabel
            label="Disabled Filled"
            disabled
            defaultValue="Value"
            leftAddOn={<Icon icon={Lock} size="sm" color="muted" />}
            rightAddOn={<Icon icon={Eye} size="sm" color="muted" />}
          />
          <TextInputFloatingLabel
            label="Error"
            error
            leftAddOn={<Icon icon={Lock} size="sm" color="muted" />}
            rightAddOn={<Icon icon={Eye} size="sm" color="muted" />}
          />
          <TextInputFloatingLabel
            label="Error Filled"
            error
            defaultValue="Invalid"
            leftAddOn={<Icon icon={Lock} size="sm" color="muted" />}
            rightAddOn={<Icon icon={Eye} size="sm" color="muted" />}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Side-by-side comparison showing when to use TextInputFloatingLabel vs TextInputFloatingLabelField.
 */
export const StandaloneVsField: Story = {
  args: {
    label: 'Standalone vs Field',
  },
  render: () => (
    <div className="grid w-[700px] grid-cols-2 gap-8">
      {/* TextInputFloatingLabel side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">
          TextInputFloatingLabel (Standalone)
        </h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for custom layouts or when composing manually
        </p>

        <div className="space-y-4">
          {/* Search example */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">Standalone search</p>
            <TextInputFloatingLabel
              label="Search"
              leftAddOn={<Icon icon={MagnifyingGlass} size="sm" color="muted" />}
            />
          </div>

          {/* Custom layout example */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">
              Custom composition (label with link)
            </p>
            <div className="flex flex-col gap-1">
              <TextInputFloatingLabel
                label="Password"
                type="password"
                leftAddOn={<Icon icon={Lock} size="sm" color="muted" />}
              />
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-xs text-primary hover:underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TextInputFloatingLabelField side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">
          TextInputFloatingLabelField (Wrapper)
        </h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for standard form fields with hint/error
        </p>

        <div className="space-y-4">
          {/* Standard field */}
          <TextInputFloatingLabelField
            label="Email"
            required
            hint="We'll never share this"
            placeholder="you@example.com"
            leftAddOn={<Icon icon={EnvelopeSimple} size="sm" color="muted" />}
          />

          {/* Field with error */}
          <TextInputFloatingLabelField
            label="Username"
            required
            errorMessage="Username already taken"
            defaultValue="johndoe"
            leftAddOn={<Icon icon={User} size="sm" color="muted" />}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Demonstrates the floating label animation in action.
 * Click the input to see the label animate to the floating position.
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
            Click each input to see the floating label animation
          </p>
        </div>

        <TextInputFloatingLabel label="First name" placeholder="John" />

        <TextInputFloatingLabel label="Last name" placeholder="Doe" />

        <TextInputFloatingLabel
          label="Email address"
          placeholder="you@example.com"
          leftAddOn={<Icon icon={EnvelopeSimple} size="sm" color="muted" />}
        />
      </div>
    );
  },
};
