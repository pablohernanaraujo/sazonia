import { Chat, Gear, Pencil, Plus, Trash, X } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Fab } from '@/ui/buttons';

/**
 * The Fab (Floating Action Button) component is a circular button designed for
 * primary or secondary floating actions in the UI. It provides a prominent,
 * easily accessible call-to-action that typically appears in a fixed position.
 *
 * ## Features
 * - **2 Style Variants**: filled (with shadow), outline (with border)
 * - **2 Color Variants**: brand (primary blue), gray (neutral)
 * - **2 Size Variants**: md (56px), sm (48px)
 * - **Loading State**: Shows spinner and disables interaction
 * - **Disabled State**: Reduces opacity and prevents interaction
 *
 * ## Accessibility
 * - Focus indicators with color-matched rings
 * - Required `aria-label` for icon-only buttons
 * - Loading state sets `aria-busy="true"`
 * - Disabled state sets proper `disabled` and `aria-disabled` attributes
 *
 * ## Usage
 * FABs are commonly used for the most important action on a screen,
 * such as creating new content, composing messages, or triggering key workflows.
 */
const meta = {
  title: 'Buttons/Fab',
  component: Fab,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    icon: {
      description: 'The Phosphor icon component to render',
      control: false,
    },
    variant: {
      description: 'Visual style variant',
      control: 'select',
      options: ['filled', 'outline'],
    },
    size: {
      description: 'Size variant affecting dimensions',
      control: 'select',
      options: ['md', 'sm'],
    },
    color: {
      description: 'Color variant for semantic meaning',
      control: 'select',
      options: ['brand', 'gray'],
    },
    disabled: {
      description: 'Disables the button interaction',
      control: 'boolean',
    },
    loading: {
      description: 'Shows loading spinner and disables interaction',
      control: 'boolean',
    },
    'aria-label': {
      description: 'Accessible label (required for accessibility)',
      control: 'text',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
} satisfies Meta<typeof Fab>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default FAB with primary filled style and medium size.
 */
export const Default: Story = {
  args: {
    icon: Plus,
    'aria-label': 'Add new item',
  },
};

/**
 * Comparison of filled and outline variants.
 * Filled has a shadow for elevation, outline has a border.
 */
export const AllVariants: Story = {
  args: {
    icon: Plus,
    'aria-label': 'Add',
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <div className="text-center">
        <Fab icon={Plus} variant="filled" aria-label="Add (filled)" />
        <p className="mt-2 text-sm text-text-subtle">Filled</p>
      </div>
      <div className="text-center">
        <Fab
          icon={Plus}
          variant="outline"
          color="gray"
          aria-label="Add (outline)"
        />
        <p className="mt-2 text-sm text-text-subtle">Outline</p>
      </div>
    </div>
  ),
};

/**
 * Medium (56px) and Small (48px) size variants side by side.
 * Icon size remains consistent (24px) across both sizes.
 */
export const AllSizes: Story = {
  args: {
    icon: Plus,
    'aria-label': 'Add',
  },
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      <div className="text-center">
        <Fab icon={Plus} size="md" aria-label="Add (medium)" />
        <p className="mt-2 text-sm text-text-subtle">MD (56px)</p>
      </div>
      <div className="text-center">
        <Fab icon={Plus} size="sm" aria-label="Add (small)" />
        <p className="mt-2 text-sm text-text-subtle">SM (48px)</p>
      </div>
    </div>
  ),
};

/**
 * Brand (primary blue) and Gray (neutral) color variants.
 * Brand is typically used with filled, gray with outline.
 */
export const AllColors: Story = {
  args: {
    icon: Plus,
    'aria-label': 'Add',
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <div className="text-center">
        <Fab icon={Plus} color="brand" aria-label="Add (brand)" />
        <p className="mt-2 text-sm text-text-subtle">Brand</p>
      </div>
      <div className="text-center">
        <Fab icon={Plus} variant="outline" color="gray" aria-label="Add (gray)" />
        <p className="mt-2 text-sm text-text-subtle">Gray</p>
      </div>
    </div>
  ),
};

/**
 * Disabled state for both filled and outline variants.
 * Reduces opacity and prevents interaction.
 */
export const DisabledState: Story = {
  args: {
    icon: Plus,
    'aria-label': 'Add',
    disabled: true,
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <div className="text-center">
        <Fab icon={Plus} disabled aria-label="Disabled (filled)" />
        <p className="mt-2 text-sm text-text-subtle">Filled Disabled</p>
      </div>
      <div className="text-center">
        <Fab
          icon={Plus}
          variant="outline"
          color="gray"
          disabled
          aria-label="Disabled (outline)"
        />
        <p className="mt-2 text-sm text-text-subtle">Outline Disabled</p>
      </div>
    </div>
  ),
};

/**
 * Loading state with spinner animation.
 * Disables interaction and shows loading indicator.
 */
export const LoadingState: Story = {
  args: {
    icon: Plus,
    'aria-label': 'Loading',
    loading: true,
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <div className="text-center">
        <Fab icon={Plus} loading aria-label="Loading (filled)" />
        <p className="mt-2 text-sm text-text-subtle">Filled Loading</p>
      </div>
      <div className="text-center">
        <Fab
          icon={Plus}
          variant="outline"
          color="gray"
          loading
          aria-label="Loading (outline)"
        />
        <p className="mt-2 text-sm text-text-subtle">Outline Loading</p>
      </div>
    </div>
  ),
};

/**
 * All interactive states demonstration.
 * Shows default, hover (interact to see), focus, disabled, and loading states.
 */
export const AllStates: Story = {
  args: {
    icon: Plus,
    'aria-label': 'Add',
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Filled + Brand</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-center">
            <Fab icon={Plus} aria-label="Default" />
            <p className="mt-2 text-xs text-text-subtle">Default</p>
          </div>
          <div className="text-center">
            <Fab icon={Plus} disabled aria-label="Disabled" />
            <p className="mt-2 text-xs text-text-subtle">Disabled</p>
          </div>
          <div className="text-center">
            <Fab icon={Plus} loading aria-label="Loading" />
            <p className="mt-2 text-xs text-text-subtle">Loading</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Outline + Gray</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-center">
            <Fab
              icon={Plus}
              variant="outline"
              color="gray"
              aria-label="Default"
            />
            <p className="mt-2 text-xs text-text-subtle">Default</p>
          </div>
          <div className="text-center">
            <Fab
              icon={Plus}
              variant="outline"
              color="gray"
              disabled
              aria-label="Disabled"
            />
            <p className="mt-2 text-xs text-text-subtle">Disabled</p>
          </div>
          <div className="text-center">
            <Fab
              icon={Plus}
              variant="outline"
              color="gray"
              loading
              aria-label="Loading"
            />
            <p className="mt-2 text-xs text-text-subtle">Loading</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * FAB with different Phosphor icons.
 * Icon size is always 24px regardless of FAB size.
 */
export const WithCustomIcon: Story = {
  args: {
    icon: Plus,
    'aria-label': 'Add',
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Fab icon={Plus} aria-label="Add item" />
      <Fab icon={Pencil} aria-label="Edit" />
      <Fab icon={Chat} aria-label="Open chat" />
      <Fab icon={Gear} variant="outline" color="gray" aria-label="Settings" />
      <Fab icon={X} variant="outline" color="gray" aria-label="Close" />
      <Fab icon={Trash} aria-label="Delete" />
    </div>
  ),
};

/**
 * Real-world example showing FAB in a fixed position layout.
 * Typically positioned at bottom-right of the viewport.
 */
export const PositioningExample: Story = {
  args: {
    icon: Plus,
    'aria-label': 'Add',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="relative h-96 w-full bg-background-secondary p-4">
      <div className="mb-4 text-lg font-semibold">Content Area</div>
      <p className="text-text-subtle">
        The FAB is positioned at the bottom-right corner. In a real app, you would
        use fixed positioning relative to the viewport.
      </p>

      {/* Simulating fixed position within the story container */}
      <div className="absolute right-6 bottom-6">
        <Fab icon={Plus} aria-label="Create new" />
      </div>

      {/* Secondary action FAB */}
      <div className="absolute right-6 bottom-24">
        <Fab icon={Pencil} size="sm" aria-label="Quick edit" />
      </div>
    </div>
  ),
};

/**
 * Complete matrix showing all combinations of variant × size × color.
 */
export const CompleteMatrix: Story = {
  args: {
    icon: Plus,
    'aria-label': 'Add',
  },
  render: () => (
    <div className="space-y-12">
      {/* Filled + Brand */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Filled + Brand</h3>
        <div className="flex flex-wrap items-end gap-6">
          <div className="text-center">
            <Fab
              icon={Plus}
              variant="filled"
              color="brand"
              size="md"
              aria-label="MD"
            />
            <p className="mt-2 text-xs text-text-subtle">MD (56px)</p>
          </div>
          <div className="text-center">
            <Fab
              icon={Plus}
              variant="filled"
              color="brand"
              size="sm"
              aria-label="SM"
            />
            <p className="mt-2 text-xs text-text-subtle">SM (48px)</p>
          </div>
        </div>
      </div>

      {/* Outline + Gray */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Outline + Gray</h3>
        <div className="flex flex-wrap items-end gap-6">
          <div className="text-center">
            <Fab
              icon={Plus}
              variant="outline"
              color="gray"
              size="md"
              aria-label="MD"
            />
            <p className="mt-2 text-xs text-text-subtle">MD (56px)</p>
          </div>
          <div className="text-center">
            <Fab
              icon={Plus}
              variant="outline"
              color="gray"
              size="sm"
              aria-label="SM"
            />
            <p className="mt-2 text-xs text-text-subtle">SM (48px)</p>
          </div>
        </div>
      </div>

      {/* All variants with states */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">States Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 text-left">Variant</th>
                <th className="p-3 text-center">Default</th>
                <th className="p-3 text-center">Disabled</th>
                <th className="p-3 text-center">Loading</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-3">Filled + Brand (MD)</td>
                <td className="p-3 text-center">
                  <Fab icon={Plus} aria-label="Default" />
                </td>
                <td className="p-3 text-center">
                  <Fab icon={Plus} disabled aria-label="Disabled" />
                </td>
                <td className="p-3 text-center">
                  <Fab icon={Plus} loading aria-label="Loading" />
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3">Filled + Brand (SM)</td>
                <td className="p-3 text-center">
                  <Fab icon={Plus} size="sm" aria-label="Default" />
                </td>
                <td className="p-3 text-center">
                  <Fab icon={Plus} size="sm" disabled aria-label="Disabled" />
                </td>
                <td className="p-3 text-center">
                  <Fab icon={Plus} size="sm" loading aria-label="Loading" />
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3">Outline + Gray (MD)</td>
                <td className="p-3 text-center">
                  <Fab
                    icon={Plus}
                    variant="outline"
                    color="gray"
                    aria-label="Default"
                  />
                </td>
                <td className="p-3 text-center">
                  <Fab
                    icon={Plus}
                    variant="outline"
                    color="gray"
                    disabled
                    aria-label="Disabled"
                  />
                </td>
                <td className="p-3 text-center">
                  <Fab
                    icon={Plus}
                    variant="outline"
                    color="gray"
                    loading
                    aria-label="Loading"
                  />
                </td>
              </tr>
              <tr>
                <td className="p-3">Outline + Gray (SM)</td>
                <td className="p-3 text-center">
                  <Fab
                    icon={Plus}
                    variant="outline"
                    color="gray"
                    size="sm"
                    aria-label="Default"
                  />
                </td>
                <td className="p-3 text-center">
                  <Fab
                    icon={Plus}
                    variant="outline"
                    color="gray"
                    size="sm"
                    disabled
                    aria-label="Disabled"
                  />
                </td>
                <td className="p-3 text-center">
                  <Fab
                    icon={Plus}
                    variant="outline"
                    color="gray"
                    size="sm"
                    loading
                    aria-label="Loading"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ),
};
