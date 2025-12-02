import {
  ArrowRight,
  Check,
  Download,
  Gear,
  Plus,
  Trash,
  Upload,
  X,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/ui/buttons';

/**
 * The Button component is a foundational interactive element for triggering
 * actions and events throughout the application.
 *
 * ## Features
 * - **4 Style Variants**: filled, outline, tinted, plain
 * - **3 Color Variants**: primary, secondary, danger
 * - **3 Size Variants**: sm, md, lg
 * - **Icon Support**: left, right, or icon-only
 * - **Loading State**: Shows spinner and disables interaction
 * - **Polymorphic**: Supports `asChild` and `href` props
 *
 * ## Accessibility
 * - Focus indicators with color-matched rings
 * - Icon-only buttons require `aria-label`
 * - Loading state sets `aria-busy="true"`
 * - Disabled state sets proper `disabled` and `aria-disabled` attributes
 */
const meta = {
  title: 'Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      description: 'Button text content',
      control: 'text',
    },
    variant: {
      description: 'Visual style variant',
      control: 'select',
      options: ['filled', 'outline', 'tinted', 'plain'],
    },
    color: {
      description: 'Color variant for semantic meaning',
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      description: 'Size variant affecting height and padding',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      description: 'Disables the button interaction',
      control: 'boolean',
    },
    loading: {
      description: 'Shows loading spinner and disables interaction',
      control: 'boolean',
    },
    href: {
      description: 'When provided, renders as Next.js Link for navigation',
      control: 'text',
    },
    asChild: {
      description: 'Merge props onto child element using Radix Slot',
      control: 'boolean',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
    'aria-label': {
      description: 'Accessible label (required for icon-only buttons)',
      control: 'text',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button with primary filled style.
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/**
 * All style variants displayed together: filled, outline, tinted, plain.
 */
export const AllStyles: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="filled">Filled</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="tinted">Tinted</Button>
      <Button variant="plain">Plain</Button>
    </div>
  ),
};

/**
 * All color variants: primary, secondary, danger.
 */
export const AllColors: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button color="primary">Primary</Button>
      <Button color="secondary">Secondary</Button>
      <Button color="danger">Danger</Button>
    </div>
  ),
};

/**
 * All size variants: sm (32px), md (40px), lg (48px).
 */
export const AllSizes: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

/**
 * Disabled state with reduced opacity and no interaction.
 */
export const DisabledState: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled>Disabled Filled</Button>
      <Button variant="outline" disabled>
        Disabled Outline
      </Button>
      <Button variant="tinted" disabled>
        Disabled Tinted
      </Button>
      <Button variant="plain" disabled>
        Disabled Plain
      </Button>
    </div>
  ),
};

/**
 * Loading state with spinner animation.
 */
export const LoadingState: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button loading>Loading...</Button>
      <Button variant="outline" loading>
        Processing
      </Button>
      <Button color="danger" loading>
        Deleting
      </Button>
    </div>
  ),
};

/**
 * Button with icon on the left side.
 */
export const WithLeftIcon: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button leftIcon={Plus}>Add Item</Button>
      <Button leftIcon={Download} variant="outline">
        Download
      </Button>
      <Button leftIcon={Trash} color="danger">
        Delete
      </Button>
    </div>
  ),
};

/**
 * Button with icon on the right side.
 */
export const WithRightIcon: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button rightIcon={ArrowRight}>Continue</Button>
      <Button rightIcon={Upload} variant="outline">
        Upload
      </Button>
      <Button rightIcon={Check} color="secondary">
        Confirm
      </Button>
    </div>
  ),
};

/**
 * Button with icons on both sides.
 */
export const WithBothIcons: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button leftIcon={Download} rightIcon={ArrowRight}>
        Download All
      </Button>
      <Button leftIcon={Gear} rightIcon={ArrowRight} variant="outline">
        Settings
      </Button>
    </div>
  ),
};

/**
 * Icon-only buttons require `aria-label` for accessibility.
 */
export const IconOnly: Story = {
  args: { leftIcon: Plus, 'aria-label': 'Add' },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button leftIcon={Plus} aria-label="Add new item" size="sm" />
      <Button leftIcon={Gear} aria-label="Settings" size="md" />
      <Button leftIcon={Trash} aria-label="Delete" size="lg" color="danger" />
      <Button leftIcon={X} aria-label="Close" variant="plain" color="secondary" />
    </div>
  ),
};

/**
 * Form action buttons - common pattern for form submissions.
 */
export const FormActions: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="flex gap-3">
      <Button type="submit">Submit</Button>
      <Button variant="outline" color="secondary">
        Cancel
      </Button>
    </div>
  ),
};

/**
 * Dialog action buttons with destructive option.
 */
export const DialogActions: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="flex gap-3">
      <Button variant="outline" color="secondary">
        Cancel
      </Button>
      <Button color="danger" leftIcon={Trash}>
        Delete
      </Button>
    </div>
  ),
};

/**
 * Button with `href` prop renders as Next.js Link for client-side navigation.
 */
export const WithHref: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button href="/dashboard">Go to Dashboard</Button>
      <Button href="/settings" leftIcon={Gear} variant="outline">
        Settings
      </Button>
      <Button href="/profile" rightIcon={ArrowRight} variant="tinted">
        View Profile
      </Button>
    </div>
  ),
};

/**
 * Using `asChild` to render as a custom element while preserving button styling.
 */
export const AsChildExample: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button asChild variant="outline">
        <a href="https://example.com" target="_blank" rel="noopener noreferrer">
          External Link
        </a>
      </Button>
      <Button asChild color="secondary">
        <span role="button" tabIndex={0}>
          Custom Element
        </span>
      </Button>
    </div>
  ),
};

/**
 * Complete variant matrix showing all style and color combinations.
 */
export const CompleteMatrix: Story = {
  args: { children: 'Button' },
  render: () => (
    <div className="space-y-8">
      {/* By Style */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Filled Variant</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="filled" color="primary">
            Primary
          </Button>
          <Button variant="filled" color="secondary">
            Secondary
          </Button>
          <Button variant="filled" color="danger">
            Danger
          </Button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Outline Variant</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" color="primary">
            Primary
          </Button>
          <Button variant="outline" color="secondary">
            Secondary
          </Button>
          <Button variant="outline" color="danger">
            Danger
          </Button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Tinted Variant</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="tinted" color="primary">
            Primary
          </Button>
          <Button variant="tinted" color="secondary">
            Secondary
          </Button>
          <Button variant="tinted" color="danger">
            Danger
          </Button>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Plain Variant</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="plain" color="primary">
            Primary
          </Button>
          <Button variant="plain" color="secondary">
            Secondary
          </Button>
          <Button variant="plain" color="danger">
            Danger
          </Button>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">All Sizes</h3>
        <div className="flex flex-wrap items-end gap-4">
          <div className="text-center">
            <Button size="sm">Small</Button>
            <p className="mt-1 text-xs text-text-subtle">32px</p>
          </div>
          <div className="text-center">
            <Button size="md">Medium</Button>
            <p className="mt-1 text-xs text-text-subtle">40px</p>
          </div>
          <div className="text-center">
            <Button size="lg">Large</Button>
            <p className="mt-1 text-xs text-text-subtle">48px</p>
          </div>
        </div>
      </div>

      {/* With Icons */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">With Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button leftIcon={Plus}>Left Icon</Button>
          <Button rightIcon={ArrowRight}>Right Icon</Button>
          <Button leftIcon={Download} rightIcon={Check}>
            Both Icons
          </Button>
          <Button leftIcon={Gear} aria-label="Settings" />
        </div>
      </div>

      {/* States */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">States</h3>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
      </div>
    </div>
  ),
};
