import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Hint } from '@/ui/inputs';

/**
 * The Hint component provides contextual helper text below form inputs.
 *
 * ## Features
 * - Two size variants: **sm** (12px) and **md** (14px)
 * - Muted text color for non-intrusive guidance
 * - Consistent 8px top padding for spacing from inputs
 * - Composes from Text components for typography consistency
 *
 * ## Accessibility
 * - Use `aria-describedby` on the input to associate the hint
 * - Use `aria-live="polite"` for dynamic hint content (errors)
 * - The hint renders as a `<span>` element
 *
 * ## Usage
 * ```tsx
 * <label htmlFor="email">Email</label>
 * <input id="email" aria-describedby="email-hint" />
 * <Hint id="email-hint">We'll never share your email</Hint>
 * ```
 */
const meta = {
  title: 'Inputs/Hint',
  component: Hint,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      description: 'Size variant - sm (12px) or md (14px)',
      control: 'radio',
      options: ['sm', 'md'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    children: {
      description: 'The hint text content',
      control: 'text',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
    id: {
      description: 'ID for aria-describedby association',
      control: 'text',
    },
  },
} satisfies Meta<typeof Hint>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Hint with MD size.
 * This is the standard size for most form fields.
 */
export const Default: Story = {
  args: {
    children: 'This is a helpful hint below the input field.',
  },
};

/**
 * Size comparison showing both SM (12px) and MD (14px) variants side by side.
 */
export const Sizes: Story = {
  args: {
    children: 'Hint text',
  },
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-sm font-medium">Size: SM (12px/18px)</p>
        <Hint size="sm">This is a small hint with 12px font size.</Hint>
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">Size: MD (14px/20px)</p>
        <Hint size="md">This is a medium hint with 14px font size.</Hint>
      </div>
    </div>
  ),
};

/**
 * Demonstrates text wrapping behavior with long content.
 * The hint will wrap naturally within its container.
 */
export const LongText: Story = {
  args: {
    children: 'Long hint text',
  },
  render: () => (
    <div className="max-w-sm">
      <Hint>
        This is a longer hint that demonstrates how the text wraps when the
        content exceeds the container width. The hint should maintain proper line
        height and spacing even with multiple lines of text. This helps users
        understand complex requirements or provides detailed formatting
        instructions.
      </Hint>
    </div>
  ),
};

/**
 * Real-world example showing proper integration with a form input.
 * Note the use of `aria-describedby` for accessibility.
 */
export const WithFormField: Story = {
  args: {
    children: 'Form field hint',
  },
  render: () => (
    <div className="w-72">
      <label htmlFor="email" className="mb-1 block text-sm font-medium">
        Email address
      </label>
      <input
        id="email"
        type="email"
        aria-describedby="email-hint"
        placeholder="you@example.com"
        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <Hint id="email-hint">We&apos;ll never share your email with anyone.</Hint>
    </div>
  ),
};

/**
 * Example with multiple hints for complex forms.
 * Shows password field with multiple requirement hints.
 */
export const MultipleHints: Story = {
  args: {
    children: 'Multiple hints',
  },
  render: () => (
    <div className="w-72">
      <label htmlFor="password" className="mb-1 block text-sm font-medium">
        Password
      </label>
      <input
        id="password"
        type="password"
        aria-describedby="password-hint-1 password-hint-2"
        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <div className="flex flex-col">
        <Hint id="password-hint-1" size="sm">
          Must be at least 8 characters
        </Hint>
        <Hint id="password-hint-2" size="sm">
          Include uppercase, lowercase, and numbers
        </Hint>
      </div>
    </div>
  ),
};

/**
 * Grid showing all size variants together for visual comparison.
 */
export const AllVariants: Story = {
  args: {
    children: 'All variants',
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Size Variants</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="rounded border p-4">
            <p className="mb-2 text-xs text-gray-500">size=&quot;sm&quot;</p>
            <Hint size="sm">Small hint text (12px)</Hint>
          </div>
          <div className="rounded border p-4">
            <p className="mb-2 text-xs text-gray-500">
              size=&quot;md&quot; (default)
            </p>
            <Hint size="md">Medium hint text (14px)</Hint>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Demonstrates proper accessibility patterns with aria-describedby.
 * Screen readers will announce the hint when the input is focused.
 */
export const Accessibility: Story = {
  args: {
    children: 'Accessibility hint',
  },
  render: () => (
    <div className="space-y-6">
      <div className="w-72">
        <h3 className="mb-4 text-lg font-semibold">Static Hint</h3>
        <label htmlFor="username" className="mb-1 block text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          type="text"
          aria-describedby="username-hint"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        <Hint id="username-hint">Only letters, numbers, and underscores.</Hint>
      </div>

      <div className="w-72">
        <h3 className="mb-4 text-lg font-semibold">
          Dynamic Hint (with aria-live)
        </h3>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          aria-describedby="phone-hint"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        <Hint id="phone-hint" aria-live="polite">
          Format: (555) 555-5555
        </Hint>
        <p className="mt-2 text-xs text-gray-500">
          Note: Use aria-live=&quot;polite&quot; for hints that may change
          dynamically
        </p>
      </div>
    </div>
  ),
};
