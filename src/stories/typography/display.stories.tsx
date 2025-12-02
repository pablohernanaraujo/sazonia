import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  DisplayLg,
  DisplayMd,
  DisplaySm,
  DisplayXl,
  DisplayXs,
  DisplayXxl,
} from '@/ui/typography';

/**
 * The Display components provide large, impactful text for heroes and marketing:
 * - **DisplayXxl**: Extra extra large (80px/100px)
 * - **DisplayXl**: Extra large (72px/90px)
 * - **DisplayLg**: Large (64px/80px)
 * - **DisplayMd**: Medium (56px/70px)
 * - **DisplaySm**: Small (48px/60px)
 * - **DisplayXs**: Extra small (40px/50px)
 *
 * Display text uses regular weight (400) for visual impact and does not
 * support weight variants. These are typically used for hero sections,
 * landing pages, and marketing content.
 *
 * ## Accessibility
 * - Uses `<span>` element by default (non-semantic)
 * - Use `as="h1"` or `as="h2"` for semantic heading structure
 * - Large text sizes improve readability
 * - Color variants maintain WCAG contrast requirements
 */
const meta: Meta<typeof DisplayMd> = {
  title: 'Typography/Display',
  component: DisplayMd,
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'The display text content',
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
      description: 'The HTML element to render as',
      control: 'select',
      options: ['span', 'h1', 'h2', 'div', 'p'],
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
 * Default DisplayMd with regular weight.
 */
export const Default: Story = {
  args: {
    children: 'Display Text',
  },
};

/**
 * All display sizes from XXL to XS.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          DisplayXxl (80px/100px)
        </p>
        <DisplayXxl>XXL</DisplayXxl>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          DisplayXl (72px/90px)
        </p>
        <DisplayXl>XL Display</DisplayXl>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          DisplayLg (64px/80px)
        </p>
        <DisplayLg>Large Display</DisplayLg>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          DisplayMd (56px/70px)
        </p>
        <DisplayMd>Medium Display</DisplayMd>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          DisplaySm (48px/60px)
        </p>
        <DisplaySm>Small Display</DisplaySm>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          DisplayXs (40px/50px)
        </p>
        <DisplayXs>Extra Small Display</DisplayXs>
      </div>
    </div>
  ),
};

/**
 * Color variants on display text.
 */
export const Colors: Story = {
  render: () => (
    <div className="space-y-4">
      <DisplaySm color="default">Default</DisplaySm>
      <DisplaySm color="muted">Muted</DisplaySm>
      <DisplaySm color="primary">Primary</DisplaySm>
      <DisplaySm color="secondary">Secondary</DisplaySm>
      <DisplaySm color="destructive">Destructive</DisplaySm>
      <DisplaySm color="success">Success</DisplaySm>
      <DisplaySm color="warning">Warning</DisplaySm>
      <DisplaySm color="info">Info</DisplaySm>
    </div>
  ),
};

/**
 * Hero section example with display text.
 */
export const HeroExample: Story = {
  render: () => (
    <section className="to-muted/20 bg-gradient-to-br from-background px-8 py-20 text-center">
      <DisplayLg as="h1" className="mb-4">
        Build faster.
      </DisplayLg>
      <DisplayMd color="primary" className="mb-8">
        Ship with confidence.
      </DisplayMd>
      <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
        The modern component library for React applications. Type-safe,
        accessible, and beautiful out of the box.
      </p>
    </section>
  ),
};

/**
 * Landing page marketing section.
 */
export const MarketingSection: Story = {
  render: () => (
    <div className="space-y-16 py-12">
      <div className="text-center">
        <DisplayXs color="muted" className="mb-2 block">
          Introducing
        </DisplayXs>
        <DisplayXl as="h1">Sazonia UI</DisplayXl>
      </div>

      <div className="grid grid-cols-3 gap-8 text-center">
        <div>
          <DisplaySm color="primary">50+</DisplaySm>
          <p className="text-lg text-muted-foreground">Components</p>
        </div>
        <div>
          <DisplaySm color="success">100%</DisplaySm>
          <p className="text-lg text-muted-foreground">Accessible</p>
        </div>
        <div>
          <DisplaySm color="info">0</DisplaySm>
          <p className="text-lg text-muted-foreground">Dependencies</p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Display as semantic heading.
 */
export const AsHeading: Story = {
  render: () => (
    <div className="space-y-6">
      <DisplayLg as="h1">This is an H1 heading</DisplayLg>
      <DisplayMd as="h2">This is an H2 heading</DisplayMd>
      <p className="text-base text-muted-foreground">
        Use the `as` prop to add semantic meaning to display text.
      </p>
    </div>
  ),
};

/**
 * Composition with child element using asChild.
 */
export const AsChild: Story = {
  render: () => (
    <DisplayMd asChild color="primary">
      <a href="#" className="transition-all hover:underline">
        Clickable Display Text
      </a>
    </DisplayMd>
  ),
};

/**
 * Responsive display text example (resize viewport to see).
 */
export const ResponsiveText: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Resize viewport to see responsive breakpoints in action:
      </p>
      {/* Mobile: DisplayXs, Tablet: DisplaySm, Desktop: DisplayMd */}
      <DisplayXs className="block md:hidden">Mobile</DisplayXs>
      <DisplaySm className="hidden md:block lg:hidden">Tablet</DisplaySm>
      <DisplayMd className="hidden lg:block">Desktop</DisplayMd>
    </div>
  ),
};

/**
 * Display text with gradient styling (custom className).
 */
export const GradientText: Story = {
  render: () => (
    <DisplayLg className="bg-gradient-to-r from-primary via-info to-success bg-clip-text text-transparent">
      Gradient Display
    </DisplayLg>
  ),
};
