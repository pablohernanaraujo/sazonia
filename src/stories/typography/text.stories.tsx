import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextMd, TextSm, TextXs } from '@/ui/typography';

/**
 * The Text components provide body text styling at three sizes:
 * - **TextXs**: Extra small (12px/18px)
 * - **TextSm**: Small (14px/20px)
 * - **TextMd**: Medium/Base (16px/24px)
 *
 * All text components support weight and color variants, as well as
 * polymorphic rendering via `as` and `asChild` props.
 *
 * ## Accessibility
 * - Uses semantic `<p>` element by default
 * - Color variants maintain WCAG contrast requirements
 * - Supports custom elements via `as` prop for proper semantics
 */
const meta: Meta<typeof TextMd> = {
  title: 'Typography/Text',
  component: TextMd,
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'The text content to display',
      control: 'text',
    },
    weight: {
      description: 'The font weight variant',
      control: 'select',
      options: ['regular', 'medium', 'semibold', 'bold'],
    },
    color: {
      description: 'The text color variant',
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
    },
    as: {
      description: 'The HTML element to render as',
      control: 'select',
      options: ['p', 'span', 'div', 'label'],
    },
    asChild: {
      description: 'Merge props onto child element',
      control: 'boolean',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default TextMd with regular weight.
 */
export const Default: Story = {
  args: {
    children: 'This is default medium text with regular weight.',
  },
};

/**
 * All text sizes displayed together for comparison.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <TextXs>TextXs - Extra small text (12px/18px)</TextXs>
      <TextSm>TextSm - Small text (14px/20px)</TextSm>
      <TextMd>TextMd - Medium/base text (16px/24px)</TextMd>
    </div>
  ),
};

/**
 * All weight variants demonstrated.
 */
export const Weights: Story = {
  render: () => (
    <div className="space-y-4">
      <TextMd weight="regular">Regular weight (400)</TextMd>
      <TextMd weight="medium">Medium weight (500)</TextMd>
      <TextMd weight="semibold">Semibold weight (600)</TextMd>
      <TextMd weight="bold">Bold weight (700)</TextMd>
    </div>
  ),
};

/**
 * All color variants demonstrated.
 */
export const Colors: Story = {
  render: () => (
    <div className="space-y-2">
      <TextMd color="default">Default - Primary text color</TextMd>
      <TextMd color="muted">Muted - Secondary/subtle text</TextMd>
      <TextMd color="primary">Primary - Brand color</TextMd>
      <TextMd color="secondary">Secondary - Secondary brand</TextMd>
      <TextMd color="destructive">Destructive - Error/danger</TextMd>
      <TextMd color="success">Success - Success state</TextMd>
      <TextMd color="warning">Warning - Warning state</TextMd>
      <TextMd color="info">Info - Informational</TextMd>
    </div>
  ),
};

/**
 * Text rendered as inline span element.
 */
export const AsSpan: Story = {
  args: {
    children: 'This text is rendered as a span element.',
    as: 'span',
  },
};

/**
 * Composition with child element using asChild.
 */
export const AsChild: Story = {
  render: () => (
    <TextMd asChild weight="medium" color="primary">
      <a href="#" className="underline">
        This is a link styled as TextMd
      </a>
    </TextMd>
  ),
};

/**
 * Combining weight and color variants.
 */
export const CombinedVariants: Story = {
  render: () => (
    <div className="space-y-2">
      <TextSm weight="bold" color="primary">
        Bold primary small text
      </TextSm>
      <TextMd weight="semibold" color="muted">
        Semibold muted medium text
      </TextMd>
      <TextXs weight="medium" color="destructive">
        Medium destructive extra small text
      </TextXs>
    </div>
  ),
};

/**
 * Long text content example.
 */
export const LongContent: Story = {
  render: () => (
    <div className="max-w-prose">
      <TextMd>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </TextMd>
    </div>
  ),
};
