import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CheckCircle,
  Gear,
  Heart,
  House,
  Info,
  MagnifyingGlass,
  Plus,
  Spinner,
  Star,
  User,
  Warning,
  X,
  XCircle,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Icon } from '@/ui/icons';

/**
 * The Icon component is a wrapper for [Phosphor Icons](https://phosphoricons.com/)
 * that provides standardized sizing, color variants, and accessibility features.
 *
 * ## Features
 * - **Consistent sizing**: Predefined size variants (xs, sm, md, lg, xl)
 * - **Weight variants**: thin, light, regular, bold, fill, duotone
 * - **Color integration**: Works with the semantic color system
 * - **Accessibility**: Built-in aria-hidden/aria-label support
 * - **Tree-shaking**: Only imported icons are bundled
 *
 * ## Usage
 *
 * ```tsx
 * import { Icon, House, User } from '@/ui/icons';
 *
 * // Using the Icon wrapper for consistent sizing
 * <Icon icon={House} size="lg" />
 *
 * // Direct Phosphor import for simple cases
 * import { Bell } from '@phosphor-icons/react';
 * <Bell size={24} weight="bold" />
 * ```
 *
 * ## Accessibility
 * - **Decorative icons**: Use default behavior (aria-hidden="true")
 * - **Meaningful icons**: Provide `aria-label` for screen readers
 * - Icons in buttons: The button should have accessible text
 */
const meta: Meta<typeof Icon> = {
  title: 'Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      description: 'The Phosphor icon component to render',
      control: false,
    },
    size: {
      description: 'Icon size variant',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    weight: {
      description: 'Icon weight/style variant',
      control: 'select',
      options: ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'],
      table: {
        defaultValue: { summary: 'regular' },
      },
    },
    color: {
      description: 'Color variant from the semantic color system',
      control: 'select',
      options: [
        'default',
        'muted',
        'primary',
        'secondary',
        'destructive',
        'success',
        'warning',
        'info',
      ],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
    'aria-label': {
      description: 'Accessible label (use when icon conveys meaning)',
      control: 'text',
    },
  },
  args: {
    icon: House,
    size: 'md',
    weight: 'regular',
    color: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Icon with House icon.
 */
export const Default: Story = {
  args: {
    icon: House,
  },
};

/**
 * All available size variants from xs (12px) to xl (32px).
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-2">
        <Icon icon={House} size="xs" />
        <span className="text-xs text-text-secondary">xs (12px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={House} size="sm" />
        <span className="text-xs text-text-secondary">sm (16px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={House} size="md" />
        <span className="text-xs text-text-secondary">md (20px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={House} size="lg" />
        <span className="text-xs text-text-secondary">lg (24px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={House} size="xl" />
        <span className="text-xs text-text-secondary">xl (32px)</span>
      </div>
    </div>
  ),
};

/**
 * All weight variants showing the same icon in different styles.
 */
export const Weights: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Heart} size="lg" weight="thin" />
        <span className="text-xs text-text-secondary">thin</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Heart} size="lg" weight="light" />
        <span className="text-xs text-text-secondary">light</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Heart} size="lg" weight="regular" />
        <span className="text-xs text-text-secondary">regular</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Heart} size="lg" weight="bold" />
        <span className="text-xs text-text-secondary">bold</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Heart} size="lg" weight="fill" />
        <span className="text-xs text-text-secondary">fill</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Heart} size="lg" weight="duotone" />
        <span className="text-xs text-text-secondary">duotone</span>
      </div>
    </div>
  ),
};

/**
 * Color variants using the semantic color system.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Star} size="lg" color="default" />
        <span className="text-xs text-text-secondary">default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Star} size="lg" color="muted" />
        <span className="text-xs text-text-secondary">muted</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Star} size="lg" color="primary" />
        <span className="text-xs text-text-secondary">primary</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Star} size="lg" color="secondary" />
        <span className="text-xs text-text-secondary">secondary</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Star} size="lg" color="destructive" />
        <span className="text-xs text-text-secondary">destructive</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Star} size="lg" color="success" />
        <span className="text-xs text-text-secondary">success</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Star} size="lg" color="warning" />
        <span className="text-xs text-text-secondary">warning</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Star} size="lg" color="info" />
        <span className="text-xs text-text-secondary">info</span>
      </div>
    </div>
  ),
};

/**
 * Icons can inherit color from their parent by not specifying a color variant
 * and using custom className with text color utilities.
 */
export const InheritedColors: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        Icons inherit color from parent when using `className` with no color
        variant:
      </p>
      <div className="flex gap-6">
        <span className="flex items-center gap-2 text-primary">
          <Icon
            icon={Star}
            size="md"
            color={undefined}
            className="text-inherit"
          />
          Primary text
        </span>
        <span className="flex items-center gap-2 text-destructive">
          <Icon
            icon={Warning}
            size="md"
            color={undefined}
            className="text-inherit"
          />
          Destructive text
        </span>
        <span className="flex items-center gap-2 text-success">
          <Icon
            icon={Check}
            size="md"
            color={undefined}
            className="text-inherit"
          />
          Success text
        </span>
      </div>
    </div>
  ),
};

/**
 * Common icon use cases in UI patterns.
 */
export const UseCases: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-text-secondary">Navigation</p>
        <div className="flex items-center gap-4">
          <button className="hover:bg-surface-secondary flex items-center gap-2 rounded-md px-3 py-2 transition-colors">
            <Icon icon={ArrowLeft} size="sm" />
            Back
          </button>
          <button className="hover:bg-surface-secondary flex items-center gap-2 rounded-md px-3 py-2 transition-colors">
            Next
            <Icon icon={ArrowRight} size="sm" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-text-secondary">Action Buttons</p>
        <div className="flex items-center gap-2">
          <button className="text-primary-foreground flex items-center gap-2 rounded-md bg-primary px-4 py-2">
            <Icon icon={Plus} size="sm" />
            Add Item
          </button>
          <button className="hover:bg-surface-secondary flex items-center gap-2 rounded-md border border-border px-4 py-2">
            <Icon icon={Gear} size="sm" />
            Settings
          </button>
          <button className="flex items-center gap-2 rounded-md px-4 py-2 text-destructive hover:bg-destructive/10">
            <Icon icon={X} size="sm" />
            Cancel
          </button>
        </div>
      </div>

      {/* Form inputs */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-text-secondary">Form Inputs</p>
        <div className="bg-surface flex items-center gap-2 rounded-md border border-border px-3 py-2">
          <Icon icon={MagnifyingGlass} size="sm" color="muted" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Status indicators */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-text-secondary">
          Status Indicators
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Icon icon={CheckCircle} size="md" color="success" />
            <span>Operation completed successfully</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon={Warning} size="md" color="warning" />
            <span>Warning: This action cannot be undone</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon={XCircle} size="md" color="destructive" />
            <span>Error: Something went wrong</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon={Info} size="md" color="info" />
            <span>Information: New features available</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Demonstrates proper accessibility patterns for icons.
 */
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-text-secondary">
          Decorative Icons (aria-hidden)
        </p>
        <p className="text-xs text-text-secondary">
          Icons next to text are decorative and hidden from screen readers.
        </p>
        <button className="text-primary-foreground flex items-center gap-2 rounded-md bg-primary px-4 py-2">
          <Icon icon={Plus} size="sm" />
          Add Item
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-text-secondary">
          Meaningful Icons (aria-label)
        </p>
        <p className="text-xs text-text-secondary">
          Icon-only buttons need aria-label to convey meaning.
        </p>
        <div className="flex gap-2">
          <button
            className="hover:bg-surface-secondary rounded-md p-2"
            aria-label="Close dialog"
          >
            <Icon icon={X} size="md" aria-hidden />
          </button>
          <button
            className="hover:bg-surface-secondary rounded-md p-2"
            aria-label="User profile"
          >
            <Icon icon={User} size="md" aria-hidden />
          </button>
          <button
            className="hover:bg-surface-secondary relative rounded-md p-2"
            aria-label="Notifications (3 unread)"
          >
            <Icon icon={Bell} size="md" aria-hidden />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-destructive" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-text-secondary">
          Standalone Meaningful Icons
        </p>
        <p className="text-xs text-text-secondary">
          When an icon alone conveys meaning, provide an aria-label.
        </p>
        <div className="flex items-center gap-4">
          <Icon
            icon={CheckCircle}
            size="lg"
            color="success"
            aria-label="Verified"
          />
          <Icon icon={Warning} size="lg" color="warning" aria-label="Warning" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Common icon set showcasing frequently used icons.
 */
export const IconShowcase: Story = {
  render: () => {
    const icons = [
      { icon: House, name: 'House' },
      { icon: User, name: 'User' },
      { icon: Bell, name: 'Bell' },
      { icon: Gear, name: 'Gear' },
      { icon: MagnifyingGlass, name: 'MagnifyingGlass' },
      { icon: Heart, name: 'Heart' },
      { icon: Star, name: 'Star' },
      { icon: Check, name: 'Check' },
      { icon: X, name: 'X' },
      { icon: Plus, name: 'Plus' },
      { icon: ArrowLeft, name: 'ArrowLeft' },
      { icon: ArrowRight, name: 'ArrowRight' },
      { icon: Warning, name: 'Warning' },
      { icon: Info, name: 'Info' },
      { icon: CheckCircle, name: 'CheckCircle' },
      { icon: XCircle, name: 'XCircle' },
    ];

    return (
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          Browse more icons at{' '}
          <a
            href="https://phosphoricons.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            phosphoricons.com
          </a>
        </p>
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
          {icons.map(({ icon: IconComp, name }) => (
            <div
              key={name}
              className="hover:bg-surface-secondary flex flex-col items-center gap-2 rounded-lg p-3 transition-colors"
            >
              <Icon icon={IconComp} size="lg" />
              <span className="text-[10px] text-text-secondary">{name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Loading spinner animation example.
 */
export const LoadingSpinner: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Spinner} size="lg" className="animate-spin" />
        <span className="text-xs text-text-secondary">Spinner</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <button
          disabled
          className="text-primary-foreground flex items-center gap-2 rounded-md bg-primary/50 px-4 py-2"
        >
          <Icon icon={Spinner} size="sm" className="animate-spin" />
          Loading...
        </button>
        <span className="text-xs text-text-secondary">In button</span>
      </div>
    </div>
  ),
};
