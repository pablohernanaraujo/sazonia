import { useState } from 'react';
import {
  EnvelopeSimple,
  Eye,
  EyeSlash,
  Lock,
  MagnifyingGlass,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Icon } from '@/ui/icons';
import {
  ErrorMessage,
  Hint,
  InputLabel,
  TextInput,
  TextInputField,
} from '@/ui/inputs';

/**
 * TextInput is a standalone form text input component that provides styled text input
 * fields with support for add-ons (prefix/suffix elements) and multiple visual states.
 *
 * ## Dual API Approach
 *
 * This package provides two components:
 *
 * 1. **TextInput** (standalone) - For maximum flexibility and custom layouts
 * 2. **TextInputField** (wrapper) - For convenience in standard forms
 *
 * ## Features
 *
 * - **Size variants**: SM (compact), MD (default), LG (comfortable)
 * - **Visual states**: Default, Hover, Focus, Disabled, Error
 * - **Add-ons**: Left and right slots for icons, text, or custom content
 * - **Composition**: Works with InputLabel, Hint, ErrorMessage atoms
 *
 * ## When to Use TextInput vs TextInputField
 *
 * Use **TextInput** when:
 * - You need custom layout (e.g., label with "Forgot password?" link)
 * - You're building a search bar without label
 * - You need fine-grained control over composition
 *
 * Use **TextInputField** when:
 * - You have a standard form field with label, hint, and/or error
 * - You want automatic ID generation and ARIA associations
 * - You want the convenience of a single component
 */
const meta = {
  title: 'Inputs/TextInput',
  component: TextInput,
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
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default TextInput with LG size and placeholder text.
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter your email',
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
        <TextInput size="sm" placeholder="Small input" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Medium (md)</p>
        <TextInput size="md" placeholder="Medium input" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Large (lg) - Default</p>
        <TextInput size="lg" placeholder="Large input" />
      </div>
    </div>
  ),
};

/**
 * Grid showing all visual states: Empty, Hovered (use mouse), Focused (click input),
 * Disabled, Disabled with value, Error, and Error with value.
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
        <TextInput placeholder="Enter text..." />
      </div>

      {/* Filled State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Filled</p>
        <TextInput defaultValue="Filled input value" />
      </div>

      {/* Disabled Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (empty)</p>
        <TextInput disabled placeholder="Disabled input" />
      </div>

      {/* Disabled Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (filled)</p>
        <TextInput disabled defaultValue="Disabled with value" />
      </div>

      {/* Error Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (empty)</p>
        <TextInput error placeholder="Error state" />
      </div>

      {/* Error Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (filled)</p>
        <TextInput error defaultValue="Invalid value" />
      </div>
    </div>
  ),
};

/**
 * TextInput with various add-on configurations: icons, text prefixes/suffixes.
 */
export const WithAddons: Story = {
  args: {
    placeholder: 'With add-ons',
  },
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      {/* Search icon */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Left icon (search)</p>
        <TextInput
          leftAddOn={<Icon icon={MagnifyingGlass} size="sm" color="muted" />}
          placeholder="Search..."
        />
      </div>

      {/* Right icon */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Right icon</p>
        <TextInput
          rightAddOn={<Icon icon={Eye} size="sm" color="muted" />}
          placeholder="Enter password"
          type="password"
        />
      </div>

      {/* Text prefix */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Text prefix</p>
        <TextInput
          leftAddOn={<span className="text-sm text-text-tertiary">https://</span>}
          placeholder="example.com"
        />
      </div>

      {/* Text suffix */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Text suffix</p>
        <TextInput
          rightAddOn={<span className="text-sm text-text-tertiary">.com</span>}
          placeholder="username"
        />
      </div>

      {/* Both add-ons */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Both add-ons</p>
        <TextInput
          leftAddOn={<span className="text-sm text-text-tertiary">$</span>}
          rightAddOn={<span className="text-sm text-text-tertiary">USD</span>}
          placeholder="0.00"
          type="number"
        />
      </div>
    </div>
  ),
};

/**
 * Demonstrates manual composition with InputLabel, Hint, and ErrorMessage atoms.
 * This pattern provides maximum flexibility for custom layouts.
 */
export const ManualComposition: Story = {
  args: {
    placeholder: 'Manual composition',
  },
  render: () => (
    <div className="flex w-[320px] flex-col gap-8">
      {/* Basic with label */}
      <div>
        <p className="mb-3 text-xs text-text-tertiary">Basic composition</p>
        <InputLabel label="Email address" htmlFor="email-basic" />
        <TextInput id="email-basic" placeholder="you@example.com" />
      </div>

      {/* With hint */}
      <div>
        <p className="mb-3 text-xs text-text-tertiary">With hint</p>
        <InputLabel label="Email address" htmlFor="email-hint" required />
        <TextInput
          id="email-hint"
          placeholder="you@example.com"
          aria-describedby="email-hint-text"
        />
        <Hint id="email-hint-text">We&apos;ll never share your email</Hint>
      </div>

      {/* With error */}
      <div>
        <p className="mb-3 text-xs text-text-tertiary">With error</p>
        <InputLabel label="Email address" htmlFor="email-error" required />
        <TextInput
          id="email-error"
          placeholder="you@example.com"
          error
          aria-invalid
          aria-describedby="email-error-text"
          defaultValue="invalid-email"
        />
        <ErrorMessage
          id="email-error-text"
          text="Please enter a valid email address"
        />
      </div>
    </div>
  ),
};

/**
 * Demonstrates a custom layout with label and "Forgot password?" link -
 * a common pattern that requires manual composition.
 */
export const CustomLayout: Story = {
  args: {
    placeholder: 'Custom layout',
  },
  render: () => (
    <div className="w-[320px]">
      <div className="flex items-center justify-between pb-2.5">
        <label
          htmlFor="password-custom"
          className="font-medium text-text-primary"
        >
          Password
          <span className="ml-0.5 text-destructive">*</span>
        </label>
        <a
          href="#"
          className="text-sm text-primary hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          Forgot password?
        </a>
      </div>
      <TextInput
        id="password-custom"
        type="password"
        placeholder="Enter your password"
        rightAddOn={
          <Icon icon={Eye} size="sm" color="muted" className="cursor-pointer" />
        }
      />
      <Hint>At least 8 characters</Hint>
    </div>
  ),
};

// =============================================
// TextInputField Stories (Convenience Wrapper)
// =============================================

/**
 * TextInputField default example with label.
 */
export const FieldDefault: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <TextInputField label="Email address" placeholder="you@example.com" />
    </div>
  ),
};

/**
 * TextInputField with hint text.
 */
export const FieldWithHint: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <TextInputField
        label="Email address"
        hint="We'll never share your email with anyone."
        placeholder="you@example.com"
      />
    </div>
  ),
};

/**
 * TextInputField with error state. Notice how the error replaces the hint.
 */
export const FieldWithError: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <TextInputField
        label="Email address"
        hint="We'll never share your email."
        error="Please enter a valid email address."
        placeholder="you@example.com"
        defaultValue="invalid-email"
      />
    </div>
  ),
};

/**
 * TextInputField with all features: required indicator, help icon, and hint text.
 */
export const FieldFullFeatured: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <TextInputField
        label="Password"
        labelProps={{
          required: true,
          showIcon: true,
          helpIconAriaLabel: 'Password requirements',
        }}
        hint="Must be at least 8 characters with one number"
        placeholder="Enter password"
        type="password"
        rightAddOn={<Icon icon={Eye} size="sm" color="muted" />}
      />
    </div>
  ),
};

/**
 * TextInputField showing all three sizes and how they map to InputLabel sizes.
 */
export const FieldAllSizes: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-8">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Small (sm) - Label: sm, Hint: sm
        </p>
        <TextInputField
          size="sm"
          label="Small field"
          labelProps={{ required: true }}
          hint="Small hint text"
          placeholder="Small input"
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Medium (md) - Label: sm, Hint: sm
        </p>
        <TextInputField
          size="md"
          label="Medium field"
          labelProps={{ required: true }}
          hint="Medium hint text"
          placeholder="Medium input"
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Large (lg) - Label: md, Hint: md
        </p>
        <TextInputField
          size="lg"
          label="Large field"
          labelProps={{ required: true }}
          hint="Large hint text"
          placeholder="Large input"
        />
      </div>
    </div>
  ),
};

// =============================================
// Integration Stories
// =============================================

/**
 * Real-world form example using TextInputField for convenience.
 */
export const FormIntegration: Story = {
  args: {},
  render: function FormExample() {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <form className="w-[360px] space-y-5 rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold">Create Account</h3>

        <TextInputField
          label="Full name"
          labelProps={{ required: true }}
          placeholder="John Doe"
          autoComplete="name"
        />

        <TextInputField
          label="Email address"
          labelProps={{ required: true }}
          hint="We'll send a verification email"
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          leftAddOn={<Icon icon={EnvelopeSimple} size="sm" color="muted" />}
        />

        <TextInputField
          label="Password"
          labelProps={{ required: true }}
          hint="At least 8 characters"
          placeholder="Create a password"
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
export const ControlledVsUncontrolled: Story = {
  args: {},
  render: function ControlledExample() {
    const [controlled, setControlled] = useState('');

    return (
      <div className="flex w-[320px] flex-col gap-8">
        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Uncontrolled (uses defaultValue)
          </p>
          <TextInputField
            label="Uncontrolled input"
            defaultValue="Initial value"
            hint="Type to change - value managed internally"
          />
        </div>

        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Controlled (uses value + onChange)
          </p>
          <TextInputField
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
          <TextInput size="sm" placeholder="Empty" />
          <TextInput size="sm" defaultValue="Filled" />
          <TextInput size="sm" disabled placeholder="Disabled" />
          <TextInput size="sm" disabled defaultValue="Disabled filled" />
          <TextInput size="sm" error placeholder="Error" />
          <TextInput size="sm" error defaultValue="Error filled" />
        </div>

        {/* Medium column */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Medium (md)</p>
          <TextInput size="md" placeholder="Empty" />
          <TextInput size="md" defaultValue="Filled" />
          <TextInput size="md" disabled placeholder="Disabled" />
          <TextInput size="md" disabled defaultValue="Disabled filled" />
          <TextInput size="md" error placeholder="Error" />
          <TextInput size="md" error defaultValue="Error filled" />
        </div>

        {/* Large column */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Large (lg)</p>
          <TextInput size="lg" placeholder="Empty" />
          <TextInput size="lg" defaultValue="Filled" />
          <TextInput size="lg" disabled placeholder="Disabled" />
          <TextInput size="lg" disabled defaultValue="Disabled filled" />
          <TextInput size="lg" error placeholder="Error" />
          <TextInput size="lg" error defaultValue="Error filled" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Side-by-side comparison showing when to use TextInput vs TextInputField.
 */
export const WhenToUseWhich: Story = {
  args: {},
  render: () => (
    <div className="grid w-[700px] grid-cols-2 gap-8">
      {/* TextInput side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">TextInput (Standalone)</h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for custom layouts or inputs without labels
        </p>

        <div className="space-y-4">
          {/* Search example */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">Search (no label)</p>
            <TextInput
              leftAddOn={<Icon icon={MagnifyingGlass} size="sm" color="muted" />}
              placeholder="Search..."
            />
          </div>

          {/* Custom layout */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">Custom label layout</p>
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm font-medium">Password</span>
              <a
                href="#"
                className="text-xs text-primary"
                onClick={(e) => e.preventDefault()}
              >
                Forgot?
              </a>
            </div>
            <TextInput placeholder="Enter password" type="password" />
          </div>
        </div>
      </div>

      {/* TextInputField side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">TextInputField (Wrapper)</h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for standard form fields with labels
        </p>

        <div className="space-y-4">
          {/* Standard field */}
          <TextInputField
            label="Email"
            labelProps={{ required: true }}
            hint="We'll never share this"
            placeholder="you@example.com"
          />

          {/* Field with error */}
          <TextInputField
            label="Username"
            labelProps={{ required: true }}
            error="Username already taken"
            defaultValue="johndoe"
          />
        </div>
      </div>
    </div>
  ),
};
