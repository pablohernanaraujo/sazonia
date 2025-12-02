import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { H1, H2, H3, H4, H5, H6, Subtitle } from '@/ui/typography';

/**
 * The Heading components provide semantic heading elements with consistent styling:
 * - **H1**: Main page title (40px/50px, bold)
 * - **H2**: Section title (32px/40px, bold)
 * - **H3**: Subsection title (24px/32px, bold)
 * - **H4**: Topic title (20px/28px, bold)
 * - **H5**: Subtopic title (18px/26px, bold)
 * - **H6**: Detail title (16px/24px, bold)
 * - **Subtitle**: Section subtitle (14px/20px, semibold, uppercase)
 *
 * Headings enforce bold weight for visual consistency and do not support
 * weight variants. Use the `as` prop to override the semantic element
 * when needed for visual vs semantic mismatch.
 *
 * ## Accessibility
 * - Uses semantic heading elements by default (h1-h6)
 * - Maintains proper heading hierarchy for screen readers
 * - Subtitle uses `<span>` by default (use `as` for heading semantics)
 * - Color variants maintain WCAG contrast requirements
 */
const meta: Meta<typeof H1> = {
  title: 'Typography/Headings',
  component: H1,
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'The heading text content',
      control: 'text',
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
      description: 'The HTML element to render as (for semantic override)',
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div'],
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
 * Default H1 heading.
 */
export const Default: Story = {
  args: {
    children: 'Main Page Title',
  },
};

/**
 * Complete heading hierarchy from H1 to H6.
 */
export const Hierarchy: Story = {
  render: () => (
    <div className="space-y-4">
      <H1>H1 - Main Title (40px)</H1>
      <H2>H2 - Section Title (32px)</H2>
      <H3>H3 - Subsection Title (24px)</H3>
      <H4>H4 - Topic Title (20px)</H4>
      <H5>H5 - Subtopic Title (18px)</H5>
      <H6>H6 - Detail Title (16px)</H6>
    </div>
  ),
};

/**
 * Subtitle component demonstration.
 */
export const SubtitleStory: Story = {
  name: 'Subtitle',
  render: () => (
    <div className="space-y-6">
      <div>
        <Subtitle>Section Subtitle</Subtitle>
        <H2>Featured Articles</H2>
      </div>
      <div>
        <Subtitle color="primary">Category</Subtitle>
        <H3>Design Systems</H3>
      </div>
      <div>
        <Subtitle color="muted">Published Date</Subtitle>
        <p className="text-base">November 29, 2025</p>
      </div>
    </div>
  ),
};

/**
 * Color variants on headings.
 */
export const Colors: Story = {
  render: () => (
    <div className="space-y-3">
      <H3 color="default">Default - Primary text color</H3>
      <H3 color="muted">Muted - Secondary/subtle text</H3>
      <H3 color="primary">Primary - Brand color</H3>
      <H3 color="secondary">Secondary - Secondary brand</H3>
      <H3 color="destructive">Destructive - Error/danger</H3>
      <H3 color="success">Success - Success state</H3>
      <H3 color="warning">Warning - Warning state</H3>
      <H3 color="info">Info - Informational</H3>
    </div>
  ),
};

/**
 * Using `as` prop for visual vs semantic mismatch.
 * This is useful when you want H1 styling but H2 semantics.
 */
export const SemanticOverride: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="mb-1 text-sm text-muted-foreground">
          H1 styling, H2 semantics:
        </p>
        <H1 as="h2">Styled as H1, Semantic H2</H1>
      </div>
      <div>
        <p className="mb-1 text-sm text-muted-foreground">
          H2 styling, H3 semantics:
        </p>
        <H2 as="h3">Styled as H2, Semantic H3</H2>
      </div>
    </div>
  ),
};

/**
 * Proper heading hierarchy in a page layout.
 * Demonstrates accessible heading structure.
 */
export const AccessibleHierarchy: Story = {
  render: () => (
    <article className="max-w-2xl space-y-6">
      <header>
        <Subtitle color="muted">Documentation</Subtitle>
        <H1>Getting Started with Typography</H1>
        <p className="text-lg text-muted-foreground">
          Learn how to use the typography system effectively.
        </p>
      </header>

      <section className="space-y-4">
        <H2>Installation</H2>
        <p className="text-base">First, install the required dependencies...</p>

        <H3>Package Manager</H3>
        <p className="text-base">You can use npm, yarn, or pnpm.</p>

        <H4>npm</H4>
        <p className="text-sm text-muted-foreground">npm install @/ui</p>
      </section>

      <section className="space-y-4">
        <H2>Usage</H2>
        <p className="text-base">Import the components you need...</p>
      </section>
    </article>
  ),
};

/**
 * Headings with asChild for link composition.
 */
export const AsChild: Story = {
  render: () => (
    <div className="space-y-4">
      <H2 asChild>
        <a href="#" className="hover:underline">
          Clickable Section Title
        </a>
      </H2>
      <H3 asChild color="primary">
        <a href="#" className="hover:underline">
          Another Clickable Title
        </a>
      </H3>
    </div>
  ),
};

/**
 * Subtitle with different semantic elements.
 */
export const SubtitleVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="mb-1 text-sm text-muted-foreground">
          Default (span element):
        </p>
        <Subtitle>Default Subtitle</Subtitle>
      </div>
      <div>
        <p className="mb-1 text-sm text-muted-foreground">
          As h6 element for semantics:
        </p>
        <Subtitle as="h6">Semantic Subtitle</Subtitle>
      </div>
      <div>
        <p className="mb-1 text-sm text-muted-foreground">With color variant:</p>
        <Subtitle color="primary">Primary Subtitle</Subtitle>
      </div>
    </div>
  ),
};
