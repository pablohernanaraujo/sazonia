import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  MultiselectBadge,
  MultiselectContent,
  MultiselectTag,
} from '@/ui/inputs';

/**
 * The MultiselectContent component displays selected items in a multiselect input
 * as removable tags or static badges.
 *
 * ## Features
 * - **Variants**: Tags (removable) or Badges (read-only)
 * - **Size variants**: SM and MD sizes for different contexts
 * - **Flexible layout**: Wraps to multiple rows when space is limited
 * - **Accessible**: Uses role="listbox" with aria-multiselectable, role="option" for items
 * - **Removal support**: Click X or press Enter/Space to remove tags
 *
 * ## Sub-components
 * - `MultiselectTag`: Individual removable tag with X icon
 * - `MultiselectBadge`: Individual non-removable badge (read-only)
 * - `MultiselectContent`: Container that renders collection of tags or badges
 *
 * ## Usage
 * ```tsx
 * import { MultiselectContent } from '@/ui/inputs';
 *
 * // Tags variant (removable)
 * <MultiselectContent
 *   items={[
 *     { label: 'React', value: 'react' },
 *     { label: 'TypeScript', value: 'ts' },
 *   ]}
 *   onRemove={(value) => handleRemove(value)}
 * />
 *
 * // Badges variant (read-only)
 * <MultiselectContent
 *   variant="badges"
 *   items={[
 *     { label: 'React', value: 'react' },
 *     { label: 'TypeScript', value: 'ts' },
 *   ]}
 * />
 * ```
 */
const meta = {
  title: 'Inputs/MultiselectContent',
  component: MultiselectContent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['tags', 'badges'],
      description: 'Display variant (tags = removable, badges = read-only)',
      table: {
        defaultValue: { summary: 'tags' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant for items',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Gap between items',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    truncate: {
      control: 'boolean',
      description: 'Whether to truncate long labels',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether all items are disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    items: {
      control: 'object',
      description: 'Array of selected items to display',
    },
    onRemove: {
      action: 'removed',
      description: 'Callback when a tag is removed (tags variant only)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof MultiselectContent>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Default Story
// =============================================================================

/**
 * Default MultiselectContent with 2 tags.
 */
export const Default: Story = {
  args: {
    items: [
      { label: 'United States', value: 'us' },
      { label: 'Canada', value: 'ca' },
    ],
  },
};

// =============================================================================
// Variant Stories
// =============================================================================

/**
 * Tags variant - removable with X icon (default).
 */
export const VariantTags: Story = {
  args: {
    variant: 'tags',
    items: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'Next.js', value: 'nextjs' },
    ],
  },
};

/**
 * Badges variant - non-removable, compact display.
 */
export const VariantBadges: Story = {
  args: {
    variant: 'badges',
    items: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'Next.js', value: 'nextjs' },
    ],
  },
};

// =============================================================================
// Count Stories
// =============================================================================

/**
 * Single tag/badge.
 */
export const SingleItem: Story = {
  args: {
    items: [{ label: 'React', value: 'react' }],
  },
};

/**
 * Two tags (default example).
 */
export const TwoItems: Story = {
  args: {
    items: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'ts' },
    ],
  },
};

/**
 * Three tags.
 */
export const ThreeItems: Story = {
  args: {
    items: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'Next.js', value: 'nextjs' },
    ],
  },
};

/**
 * Six tags (demonstrates multi-row wrapping).
 */
export const SixItems: Story = {
  args: {
    items: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'Next.js', value: 'nextjs' },
      { label: 'Tailwind CSS', value: 'tailwind' },
      { label: 'Storybook', value: 'storybook' },
      { label: 'Vitest', value: 'vitest' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Many tags (overflow scenario with 12+ items).
 */
export const ManyItems: Story = {
  args: {
    items: [
      { label: 'JavaScript', value: 'js' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'React', value: 'react' },
      { label: 'Vue', value: 'vue' },
      { label: 'Angular', value: 'angular' },
      { label: 'Svelte', value: 'svelte' },
      { label: 'Node.js', value: 'nodejs' },
      { label: 'Python', value: 'python' },
      { label: 'Go', value: 'go' },
      { label: 'Rust', value: 'rust' },
      { label: 'Java', value: 'java' },
      { label: 'C#', value: 'csharp' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

// =============================================================================
// Size Stories
// =============================================================================

/**
 * Small size variant.
 */
export const SizeSmall: Story = {
  args: {
    size: 'sm',
    items: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'Next.js', value: 'nextjs' },
    ],
  },
};

/**
 * Medium size variant (default).
 */
export const SizeMedium: Story = {
  args: {
    size: 'md',
    items: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'Next.js', value: 'nextjs' },
    ],
  },
};

// =============================================================================
// State Stories
// =============================================================================

/**
 * Default interactive state.
 */
export const StateDefault: Story = {
  args: {
    items: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'ts' },
    ],
  },
};

/**
 * All items disabled.
 */
export const StateDisabled: Story = {
  args: {
    disabled: true,
    items: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'ts' },
    ],
  },
};

/**
 * Mixed enabled/disabled items.
 */
export const StateMixed: Story = {
  args: {
    items: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript (disabled)', value: 'ts', disabled: true },
      { label: 'Next.js', value: 'nextjs' },
    ],
  },
};

// =============================================================================
// Truncation Stories
// =============================================================================

/**
 * Long labels without truncation.
 */
export const LongLabelsNoTruncate: Story = {
  args: {
    truncate: false,
    items: [
      { label: 'United States of America', value: 'us' },
      { label: 'United Kingdom of Great Britain', value: 'uk' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

/**
 * Long labels with truncation enabled.
 */
export const LongLabelsTruncate: Story = {
  args: {
    truncate: true,
    items: [
      { label: 'United States of America', value: 'us' },
      { label: 'United Kingdom of Great Britain', value: 'uk' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-[200px]">
        <Story />
      </div>
    ),
  ],
};

// =============================================================================
// Real-world Examples
// =============================================================================

/**
 * Country multiselect.
 */
export const CountryMultiselect: Story = {
  args: {
    items: [
      { label: 'United States', value: 'us' },
      { label: 'Canada', value: 'ca' },
      { label: 'Mexico', value: 'mx' },
      { label: 'Brazil', value: 'br' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-[320px] rounded-lg border border-border bg-white p-3">
        <Story />
      </div>
    ),
  ],
};

/**
 * Skills/tags selector.
 */
export const SkillsSelector: Story = {
  args: {
    items: [
      { label: 'JavaScript', value: 'js' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'React', value: 'react' },
      { label: 'Node.js', value: 'nodejs' },
      { label: 'GraphQL', value: 'graphql' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-[380px] rounded-lg border border-border bg-white p-3">
        <p className="mb-2 text-sm font-medium text-text-primary">
          Selected Skills
        </p>
        <Story />
      </div>
    ),
  ],
};

/**
 * User assignment selector.
 */
export const UserAssignment: Story = {
  args: {
    items: [
      { label: 'John Doe', value: 'john' },
      { label: 'Jane Smith', value: 'jane' },
      { label: 'Bob Johnson', value: 'bob' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-[300px] rounded-lg border border-border bg-white p-3">
        <p className="mb-2 text-sm font-medium text-text-primary">
          Assigned Users
        </p>
        <Story />
      </div>
    ),
  ],
};

/**
 * Category filter (using badges).
 */
export const CategoryFilter: Story = {
  args: {
    variant: 'badges',
    items: [
      { label: 'Technology', value: 'tech' },
      { label: 'Design', value: 'design' },
      { label: 'Business', value: 'business' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-[300px] rounded-lg border border-border bg-white p-3">
        <p className="mb-2 text-sm font-medium text-text-primary">
          Active Filters
        </p>
        <Story />
      </div>
    ),
  ],
};

// =============================================================================
// Comparison Stories
// =============================================================================

/**
 * Tags vs Badges comparison.
 */
export const TagsVsBadges: Story = {
  args: {
    items: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'ts' },
    ],
  },
  render: () => (
    <div className="flex gap-8">
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">
          Tags (removable)
        </p>
        <div className="rounded-lg border border-border bg-white p-3">
          <MultiselectContent
            variant="tags"
            items={[
              { label: 'React', value: 'react' },
              { label: 'TypeScript', value: 'ts' },
              { label: 'Next.js', value: 'nextjs' },
            ]}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">
          Badges (read-only)
        </p>
        <div className="rounded-lg border border-border bg-white p-3">
          <MultiselectContent
            variant="badges"
            items={[
              { label: 'React', value: 'react' },
              { label: 'TypeScript', value: 'ts' },
              { label: 'Next.js', value: 'nextjs' },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * All sizes comparison.
 */
export const AllSizes: Story = {
  args: {
    items: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'ts' },
    ],
  },
  render: () => (
    <div className="flex gap-8">
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">SM Tags</p>
        <div className="rounded-lg border border-border bg-white p-3">
          <MultiselectContent
            variant="tags"
            size="sm"
            items={[
              { label: 'React', value: 'react' },
              { label: 'TypeScript', value: 'ts' },
            ]}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">MD Tags</p>
        <div className="rounded-lg border border-border bg-white p-3">
          <MultiselectContent
            variant="tags"
            size="md"
            items={[
              { label: 'React', value: 'react' },
              { label: 'TypeScript', value: 'ts' },
            ]}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">SM Badges</p>
        <div className="rounded-lg border border-border bg-white p-3">
          <MultiselectContent
            variant="badges"
            size="sm"
            items={[
              { label: 'React', value: 'react' },
              { label: 'TypeScript', value: 'ts' },
            ]}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">MD Badges</p>
        <div className="rounded-lg border border-border bg-white p-3">
          <MultiselectContent
            variant="badges"
            size="md"
            items={[
              { label: 'React', value: 'react' },
              { label: 'TypeScript', value: 'ts' },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * All variants grid.
 */
export const AllVariants: Story = {
  args: {
    items: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'ts' },
    ],
  },
  render: () => (
    <div className="space-y-8">
      {/* Tags Section */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-text-primary">
          Tags Variant
        </h3>
        <div className="flex flex-wrap gap-6">
          <div className="space-y-2">
            <p className="text-xs font-medium text-text-secondary">Default</p>
            <div className="rounded-lg border border-border bg-white p-3">
              <MultiselectContent
                variant="tags"
                items={[
                  { label: 'React', value: 'react' },
                  { label: 'TypeScript', value: 'ts' },
                ]}
              />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-text-secondary">Disabled</p>
            <div className="rounded-lg border border-border bg-white p-3">
              <MultiselectContent
                variant="tags"
                disabled
                items={[
                  { label: 'React', value: 'react' },
                  { label: 'TypeScript', value: 'ts' },
                ]}
              />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-text-secondary">Small Size</p>
            <div className="rounded-lg border border-border bg-white p-3">
              <MultiselectContent
                variant="tags"
                size="sm"
                items={[
                  { label: 'React', value: 'react' },
                  { label: 'TypeScript', value: 'ts' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-text-primary">
          Badges Variant
        </h3>
        <div className="flex flex-wrap gap-6">
          <div className="space-y-2">
            <p className="text-xs font-medium text-text-secondary">Default</p>
            <div className="rounded-lg border border-border bg-white p-3">
              <MultiselectContent
                variant="badges"
                items={[
                  { label: 'React', value: 'react' },
                  { label: 'TypeScript', value: 'ts' },
                ]}
              />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-text-secondary">Small Size</p>
            <div className="rounded-lg border border-border bg-white p-3">
              <MultiselectContent
                variant="badges"
                size="sm"
                items={[
                  { label: 'React', value: 'react' },
                  { label: 'TypeScript', value: 'ts' },
                ]}
              />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-text-secondary">Many Items</p>
            <div className="w-[200px] rounded-lg border border-border bg-white p-3">
              <MultiselectContent
                variant="badges"
                items={[
                  { label: 'React', value: 'react' },
                  { label: 'TypeScript', value: 'ts' },
                  { label: 'Next.js', value: 'nextjs' },
                  { label: 'Tailwind', value: 'tailwind' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// =============================================================================
// Individual Sub-component Stories
// =============================================================================

/**
 * MultiselectTag - Individual removable tag.
 */
export const IndividualTag: StoryObj<typeof MultiselectTag> = {
  render: () => (
    <div className="flex gap-4">
      <MultiselectTag label="Default Tag" value="default" />
      <MultiselectTag label="Small Tag" value="small" size="sm" />
      <MultiselectTag
        label="Disabled Tag"
        value="disabled"
        disabled
        onRemove={() => {}}
      />
    </div>
  ),
};

/**
 * MultiselectBadge - Individual non-removable badge.
 */
export const IndividualBadge: StoryObj<typeof MultiselectBadge> = {
  render: () => (
    <div className="flex gap-4">
      <MultiselectBadge label="Default Badge" />
      <MultiselectBadge label="Small Badge" size="sm" />
      <MultiselectBadge label="Another Badge" />
    </div>
  ),
};
