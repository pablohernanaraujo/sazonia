import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { InputLabel } from '@/ui/inputs';

/**
 * The InputLabel component provides consistent labeling for form input fields.
 *
 * ## Features
 * - **Size variants**: SM (14px) and MD (16px) label text sizes
 * - **Required indicator**: Red asterisk to indicate required fields
 * - **Help icon**: Optional question mark icon for tooltips/additional info
 * - **Description text**: Optional helper text below the label
 *
 * ## Accessibility
 * - Uses semantic `<label>` element
 * - Supports `htmlFor` attribute for input association
 * - Help icon includes proper aria-label
 * - Description has ID for aria-describedby pattern
 *
 * ## Usage with Inputs
 * ```tsx
 * <InputLabel
 *   label="Email"
 *   required
 *   description="We'll never share your email"
 *   htmlFor="email"
 * />
 * <input id="email" type="email" aria-required="true" aria-describedby="email-description" />
 * ```
 */
const meta = {
  title: 'Inputs/InputLabel',
  component: InputLabel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant of the label (sm: 14px, md: 16px)',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    label: {
      control: 'text',
      description: 'The label text content (required)',
    },
    required: {
      control: 'boolean',
      description: 'Shows required indicator (red asterisk)',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    showIcon: {
      control: 'boolean',
      description: 'Shows help icon for tooltips',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    helpIconAriaLabel: {
      control: 'text',
      description:
        'Custom aria-label for the help icon (default: "Help for {label}")',
    },
    description: {
      control: 'text',
      description: 'Optional description text below the label',
    },
    htmlFor: {
      control: 'text',
      description: 'ID of the associated input element for accessibility',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof InputLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default InputLabel with MD size and required indicator.
 */
export const Default: Story = {
  args: {
    label: 'Email address',
    required: true,
  },
};

/**
 * Comparison of SM and MD size variants.
 */
export const Sizes: Story = {
  args: {
    label: 'Size comparison',
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-xs text-text-secondary">Small (sm)</p>
        <InputLabel size="sm" label="Small Label" required />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-secondary">Medium (md)</p>
        <InputLabel size="md" label="Medium Label" required />
      </div>
    </div>
  ),
};

/**
 * Labels with and without required indicator.
 */
export const Required: Story = {
  args: {
    label: 'Required comparison',
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-secondary">Optional field</p>
        <InputLabel label="Email address" required={false} />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-secondary">Required field</p>
        <InputLabel label="Email address" required />
      </div>
    </div>
  ),
};

/**
 * Label with help icon displayed.
 */
export const WithIcon: Story = {
  args: {
    label: 'Password',
    showIcon: true,
    helpIconAriaLabel: 'Password requirements help',
  },
};

/**
 * Label with description text below.
 */
export const WithDescription: Story = {
  args: {
    label: 'Email address',
    description: "We'll never share your email with anyone else.",
    htmlFor: 'email',
  },
};

/**
 * Label with all features enabled: required indicator, help icon, and description.
 */
export const FullFeatures: Story = {
  args: {
    label: 'Password',
    required: true,
    showIcon: true,
    helpIconAriaLabel: 'Password format requirements',
    description: 'Must be at least 8 characters with one number',
    htmlFor: 'password',
  },
};

/**
 * Visual grid showing all possible size and feature combinations.
 */
export const AllCombinations: Story = {
  args: {
    label: 'All combinations',
  },
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      {/* SM variants */}
      <div className="space-y-6 rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold">Small (sm)</h3>
        <InputLabel size="sm" label="Basic label" />
        <InputLabel size="sm" label="Required field" required />
        <InputLabel size="sm" label="With icon" showIcon />
        <InputLabel
          size="sm"
          label="With description"
          description="Helper text goes here"
        />
        <InputLabel
          size="sm"
          label="All features"
          required
          showIcon
          description="Complete label example"
        />
      </div>

      {/* MD variants */}
      <div className="space-y-6 rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold">Medium (md)</h3>
        <InputLabel size="md" label="Basic label" />
        <InputLabel size="md" label="Required field" required />
        <InputLabel size="md" label="With icon" showIcon />
        <InputLabel
          size="md"
          label="With description"
          description="Helper text goes here"
        />
        <InputLabel
          size="md"
          label="All features"
          required
          showIcon
          description="Complete label example"
        />
      </div>
    </div>
  ),
};

/**
 * Real-world example showing InputLabel with actual input elements.
 */
export const FormIntegration: Story = {
  args: {
    label: 'Form integration',
  },
  render: () => (
    <form className="w-[320px] space-y-4">
      <div>
        <InputLabel
          label="Email"
          required
          description="We'll send a confirmation email"
          htmlFor="demo-email"
        />
        <input
          id="demo-email"
          type="email"
          placeholder="you@example.com"
          aria-required="true"
          aria-describedby="demo-email-description"
          className="border-input mt-0 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <div>
        <InputLabel
          label="Password"
          required
          showIcon
          helpIconAriaLabel="Password security requirements"
          description="At least 8 characters, one number"
          htmlFor="demo-password"
        />
        <input
          id="demo-password"
          type="password"
          placeholder="Enter password"
          aria-required="true"
          aria-describedby="demo-password-description"
          className="border-input mt-0 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <div>
        <InputLabel label="Phone (optional)" htmlFor="demo-phone" />
        <input
          id="demo-phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          className="border-input mt-0 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>
    </form>
  ),
};

/**
 * Demonstration of proper accessibility with htmlFor/id association.
 * Click on any label to focus its associated input.
 */
export const Accessibility: Story = {
  args: {
    label: 'Accessibility demo',
  },
  render: () => (
    <div className="w-[320px] space-y-6">
      <div className="rounded-lg border border-border p-4">
        <p className="mb-4 text-xs text-text-secondary">
          Click the label text to focus the input (accessibility feature)
        </p>
        <InputLabel
          label="Username"
          required
          description="Choose a unique username"
          htmlFor="a11y-username"
        />
        <input
          id="a11y-username"
          type="text"
          aria-required="true"
          aria-describedby="a11y-username-description"
          className="border-input w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      <div className="text-xs text-text-secondary">
        <p className="font-medium">Accessibility notes:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Label uses htmlFor to associate with input</li>
          <li>Input uses aria-required for required fields</li>
          <li>Input uses aria-describedby for description</li>
          <li>Help icon has aria-label for screen readers</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Small size variant examples in a form context.
 */
export const SmallSizeForm: Story = {
  args: {
    label: 'Small form example',
    size: 'sm',
  },
  render: () => (
    <form className="w-[280px] space-y-3">
      <div>
        <InputLabel
          size="sm"
          label="First name"
          required
          htmlFor="sm-first-name"
        />
        <input
          id="sm-first-name"
          type="text"
          className="border-input w-full rounded border bg-background px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>
      <div>
        <InputLabel size="sm" label="Last name" required htmlFor="sm-last-name" />
        <input
          id="sm-last-name"
          type="text"
          className="border-input w-full rounded border bg-background px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>
      <div>
        <InputLabel size="sm" label="Nickname" htmlFor="sm-nickname" />
        <input
          id="sm-nickname"
          type="text"
          className="border-input w-full rounded border bg-background px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>
    </form>
  ),
};
