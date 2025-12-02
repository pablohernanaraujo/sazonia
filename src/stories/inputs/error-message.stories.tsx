import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ErrorMessage } from '@/ui/inputs';

/**
 * The ErrorMessage component displays form validation error messages with optional icon.
 *
 * ## Features
 * - **Size variants**: SM (12px) and MD (14px) text sizes
 * - **Alert icon**: Optional filled warning circle icon in destructive color
 * - **Accessible**: Uses `role="alert"` for screen reader announcements
 *
 * ## Accessibility
 * - Uses `role="alert"` for immediate screen reader announcements
 * - Supports `id` prop for `aria-describedby` associations
 * - Icon is decorative (`aria-hidden`)
 *
 * ## Usage with Inputs
 * ```tsx
 * <input
 *   aria-invalid="true"
 *   aria-describedby="email-error"
 * />
 * <ErrorMessage
 *   id="email-error"
 *   text="Email is required"
 * />
 * ```
 */
const meta = {
  title: 'Inputs/ErrorMessage',
  component: ErrorMessage,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant of the error message (sm: 12px, md: 14px)',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    text: {
      control: 'text',
      description: 'The error message text content (required)',
    },
    showIcon: {
      control: 'boolean',
      description: 'Shows the alert circle icon',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    id: {
      control: 'text',
      description: 'Optional ID for ARIA associations (aria-describedby pattern)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default ErrorMessage with MD size and icon visible.
 */
export const Default: Story = {
  args: {
    text: 'This field is required',
  },
};

/**
 * Comparison of SM and MD size variants.
 */
export const Sizes: Story = {
  args: {
    text: 'Size comparison',
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-secondary">Small (sm)</p>
        <ErrorMessage size="sm" text="This field is required" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-secondary">Medium (md)</p>
        <ErrorMessage size="md" text="This field is required" />
      </div>
    </div>
  ),
};

/**
 * Error message with icon displayed (default behavior).
 */
export const WithIcon: Story = {
  args: {
    text: 'Invalid email format',
    showIcon: true,
  },
};

/**
 * Error message without icon.
 */
export const WithoutIcon: Story = {
  args: {
    text: 'Password is too short',
    showIcon: false,
  },
};

/**
 * Visual grid showing all size and icon combinations.
 */
export const AllCombinations: Story = {
  args: {
    text: 'All combinations',
  },
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      {/* With Icon */}
      <div className="space-y-4 rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold">With Icon</h3>
        <div>
          <p className="text-xs text-text-secondary">Small (sm)</p>
          <ErrorMessage size="sm" text="Error message" showIcon />
        </div>
        <div>
          <p className="text-xs text-text-secondary">Medium (md)</p>
          <ErrorMessage size="md" text="Error message" showIcon />
        </div>
      </div>

      {/* Without Icon */}
      <div className="space-y-4 rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold">Without Icon</h3>
        <div>
          <p className="text-xs text-text-secondary">Small (sm)</p>
          <ErrorMessage size="sm" text="Error message" showIcon={false} />
        </div>
        <div>
          <p className="text-xs text-text-secondary">Medium (md)</p>
          <ErrorMessage size="md" text="Error message" showIcon={false} />
        </div>
      </div>
    </div>
  ),
};

/**
 * Real-world example showing ErrorMessage with form inputs.
 */
export const FormIntegration: Story = {
  args: {
    text: 'Form integration',
  },
  render: () => (
    <form className="w-[320px] space-y-4">
      <div>
        <label
          htmlFor="demo-email"
          className="block pb-2 text-sm font-medium text-text-primary"
        >
          Email <span className="text-destructive">*</span>
        </label>
        <input
          id="demo-email"
          type="email"
          placeholder="you@example.com"
          aria-invalid="true"
          aria-describedby="demo-email-error"
          className="w-full rounded-md border border-destructive bg-background px-3 py-2 text-sm placeholder:text-text-secondary focus:ring-2 focus:ring-destructive focus:outline-none"
        />
        <ErrorMessage
          id="demo-email-error"
          text="Please enter a valid email address"
        />
      </div>

      <div>
        <label
          htmlFor="demo-password"
          className="block pb-2 text-sm font-medium text-text-primary"
        >
          Password <span className="text-destructive">*</span>
        </label>
        <input
          id="demo-password"
          type="password"
          placeholder="Enter password"
          aria-invalid="true"
          aria-describedby="demo-password-error"
          className="w-full rounded-md border border-destructive bg-background px-3 py-2 text-sm placeholder:text-text-secondary focus:ring-2 focus:ring-destructive focus:outline-none"
        />
        <ErrorMessage
          id="demo-password-error"
          text="Password must be at least 8 characters"
        />
      </div>
    </form>
  ),
};

/**
 * Demonstration of long error message text handling.
 */
export const LongText: Story = {
  args: {
    text: 'This is a very long error message that demonstrates how the component handles text that wraps to multiple lines. The error message should remain readable and properly aligned with the icon.',
  },
};

/**
 * Multiple error messages in a form context.
 */
export const MultipleErrors: Story = {
  args: {
    text: 'Multiple errors',
  },
  render: () => (
    <div className="w-[320px] space-y-4">
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">Registration Form Errors</h3>
        <div className="space-y-1">
          <ErrorMessage text="Username is already taken" />
          <ErrorMessage text="Email format is invalid" />
          <ErrorMessage text="Password must contain at least one number" />
          <ErrorMessage text="Please accept the terms and conditions" />
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">Small Size Errors</h3>
        <div className="space-y-1">
          <ErrorMessage size="sm" text="Username is required" />
          <ErrorMessage size="sm" text="Email is required" />
          <ErrorMessage size="sm" text="Password is required" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Demonstration of proper accessibility with id and aria-describedby.
 */
export const Accessibility: Story = {
  args: {
    text: 'Accessibility demo',
  },
  render: () => (
    <div className="w-[320px] space-y-6">
      <div className="rounded-lg border border-border p-4">
        <p className="mb-4 text-xs text-text-secondary">
          The error message is announced by screen readers via
          role=&quot;alert&quot;
        </p>
        <label
          htmlFor="a11y-username"
          className="block pb-2 text-sm font-medium text-text-primary"
        >
          Username <span className="text-destructive">*</span>
        </label>
        <input
          id="a11y-username"
          type="text"
          aria-invalid="true"
          aria-describedby="a11y-username-error"
          className="w-full rounded-md border border-destructive bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-destructive focus:outline-none"
        />
        <ErrorMessage id="a11y-username-error" text="Username is required" />
      </div>

      <div className="text-xs text-text-secondary">
        <p className="font-medium">Accessibility notes:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>ErrorMessage uses role=&quot;alert&quot; for announcements</li>
          <li>Input uses aria-describedby to link to error</li>
          <li>Input uses aria-invalid=&quot;true&quot; for error state</li>
          <li>Icon is decorative (aria-hidden)</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Small size variant examples in a compact form context.
 */
export const SmallSizeForm: Story = {
  args: {
    text: 'Small form example',
    size: 'sm',
  },
  render: () => (
    <form className="w-[280px] space-y-3">
      <div>
        <label
          htmlFor="sm-first-name"
          className="block pb-2 text-sm font-medium text-text-primary"
        >
          First name <span className="text-destructive">*</span>
        </label>
        <input
          id="sm-first-name"
          type="text"
          aria-invalid="true"
          aria-describedby="sm-first-name-error"
          className="w-full rounded border border-destructive bg-background px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-destructive focus:outline-none"
        />
        <ErrorMessage size="sm" id="sm-first-name-error" text="Required" />
      </div>
      <div>
        <label
          htmlFor="sm-last-name"
          className="block pb-2 text-sm font-medium text-text-primary"
        >
          Last name <span className="text-destructive">*</span>
        </label>
        <input
          id="sm-last-name"
          type="text"
          aria-invalid="true"
          aria-describedby="sm-last-name-error"
          className="w-full rounded border border-destructive bg-background px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-destructive focus:outline-none"
        />
        <ErrorMessage size="sm" id="sm-last-name-error" text="Required" />
      </div>
      <div>
        <label
          htmlFor="sm-email"
          className="block pb-2 text-sm font-medium text-text-primary"
        >
          Email <span className="text-destructive">*</span>
        </label>
        <input
          id="sm-email"
          type="email"
          aria-invalid="true"
          aria-describedby="sm-email-error"
          className="w-full rounded border border-destructive bg-background px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-destructive focus:outline-none"
        />
        <ErrorMessage size="sm" id="sm-email-error" text="Invalid email" />
      </div>
    </form>
  ),
};
