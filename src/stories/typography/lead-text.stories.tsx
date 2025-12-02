import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LeadTextMd, LeadTextSm, LeadTextXs } from '@/ui/typography';

/**
 * The Lead Text components provide emphasized paragraph text at three sizes:
 * - **LeadTextXs**: Extra small lead (18px/26px)
 * - **LeadTextSm**: Small lead (20px/28px)
 * - **LeadTextMd**: Medium lead (24px/32px)
 *
 * Lead text is typically used for introductory paragraphs, article summaries,
 * or any content that needs visual emphasis larger than body text.
 *
 * ## Accessibility
 * - Uses semantic `<p>` element by default
 * - Larger text sizes improve readability
 * - Supports custom elements via `as` prop for proper semantics
 */
const meta: Meta<typeof LeadTextMd> = {
  title: 'Typography/LeadText',
  component: LeadTextMd,
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
      options: ['p', 'span', 'div', 'blockquote'],
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
 * Default LeadTextMd with regular weight.
 */
export const Default: Story = {
  args: {
    children: 'This is lead text for introductory content and summaries.',
  },
};

/**
 * All lead text sizes displayed together for comparison.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <LeadTextXs>LeadTextXs - Extra small lead text (18px/26px)</LeadTextXs>
      <LeadTextSm>LeadTextSm - Small lead text (20px/28px)</LeadTextSm>
      <LeadTextMd>LeadTextMd - Medium lead text (24px/32px)</LeadTextMd>
    </div>
  ),
};

/**
 * All weight variants demonstrated.
 */
export const Weights: Story = {
  render: () => (
    <div className="space-y-4">
      <LeadTextMd weight="regular">Regular weight (400)</LeadTextMd>
      <LeadTextMd weight="medium">Medium weight (500)</LeadTextMd>
      <LeadTextMd weight="semibold">Semibold weight (600)</LeadTextMd>
      <LeadTextMd weight="bold">Bold weight (700)</LeadTextMd>
    </div>
  ),
};

/**
 * All color variants demonstrated.
 */
export const Colors: Story = {
  render: () => (
    <div className="space-y-3">
      <LeadTextSm color="default">Default - Primary text color</LeadTextSm>
      <LeadTextSm color="muted">Muted - Secondary/subtle text</LeadTextSm>
      <LeadTextSm color="primary">Primary - Brand color</LeadTextSm>
      <LeadTextSm color="secondary">Secondary - Secondary brand</LeadTextSm>
      <LeadTextSm color="destructive">Destructive - Error/danger</LeadTextSm>
      <LeadTextSm color="success">Success - Success state</LeadTextSm>
      <LeadTextSm color="warning">Warning - Warning state</LeadTextSm>
      <LeadTextSm color="info">Info - Informational</LeadTextSm>
    </div>
  ),
};

/**
 * Real-world usage example with article introduction.
 */
export const ArticleIntro: Story = {
  render: () => (
    <article className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold">Building Design Systems</h1>
      <LeadTextMd color="muted">
        A comprehensive guide to creating consistent, scalable, and accessible
        design systems that empower teams to build better products faster.
      </LeadTextMd>
      <p className="text-base">
        Design systems have become essential for modern product development...
      </p>
    </article>
  ),
};

/**
 * Lead text as a blockquote.
 */
export const AsBlockquote: Story = {
  render: () => (
    <LeadTextSm
      as="blockquote"
      color="muted"
      className="border-l-4 border-primary pl-4 italic"
    >
      "The best design systems are those that make the right choice the easy
      choice."
    </LeadTextSm>
  ),
};

/**
 * Composition with child element using asChild.
 */
export const AsChild: Story = {
  render: () => (
    <LeadTextSm asChild weight="medium" color="primary">
      <a href="#" className="underline hover:no-underline">
        Read the full story
      </a>
    </LeadTextSm>
  ),
};

/**
 * Combining weight and color variants.
 */
export const CombinedVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <LeadTextXs weight="semibold" color="primary">
        Semibold primary extra small lead
      </LeadTextXs>
      <LeadTextSm weight="bold" color="muted">
        Bold muted small lead
      </LeadTextSm>
      <LeadTextMd weight="medium" color="success">
        Medium success medium lead
      </LeadTextMd>
    </div>
  ),
};
