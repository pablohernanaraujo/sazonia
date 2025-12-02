import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DropmenuDivider } from '@/ui/dropmenus';

/**
 * The DropmenuDivider component provides a visual separator for dropdown menus.
 *
 * ## Features
 * - 1px horizontal line with tertiary fill color
 * - 2px vertical padding for proper spacing
 * - Full width to match parent container
 * - Lightweight and purely presentational
 *
 * ## Accessibility
 * - Add `role="separator"` for screen reader support
 * - Use `aria-orientation="horizontal"` for explicit orientation
 *
 * ## Usage
 * ```tsx
 * <DropmenuItem>Edit</DropmenuItem>
 * <DropmenuItem>Copy</DropmenuItem>
 * <DropmenuDivider />
 * <DropmenuItem>Delete</DropmenuItem>
 * ```
 */
const meta = {
  title: 'Dropmenus/DropmenuDivider',
  component: DropmenuDivider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      description: 'Additional CSS classes for customization',
      control: 'text',
    },
    role: {
      description: 'ARIA role for accessibility (use "separator")',
      control: 'text',
    },
  },
} satisfies Meta<typeof DropmenuDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default divider with standard 240px container width.
 * Shows the basic appearance of the divider.
 */
export const Default: Story = {
  render: () => (
    <div className="border-border-primary w-60 rounded-lg border bg-background p-1">
      <DropmenuDivider />
    </div>
  ),
};

/**
 * Shows the divider at different container widths.
 * The divider stretches to fill its parent container.
 */
export const WidthVariations: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm text-text-secondary">Width: 160px</p>
        <div className="border-border-primary w-40 rounded-lg border bg-background p-1">
          <DropmenuDivider />
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-secondary">Width: 240px (default)</p>
        <div className="border-border-primary w-60 rounded-lg border bg-background p-1">
          <DropmenuDivider />
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-secondary">Width: 320px</p>
        <div className="border-border-primary w-80 rounded-lg border bg-background p-1">
          <DropmenuDivider />
        </div>
      </div>
    </div>
  ),
};

/**
 * Real-world example showing the divider between menu items.
 * Demonstrates the typical use case in a dropdown menu.
 */
export const InMenuContext: Story = {
  render: () => (
    <div className="border-border-primary w-60 rounded-lg border bg-background py-1 shadow-lg">
      <div className="cursor-pointer px-3 py-2 text-sm hover:bg-fill-secondary">
        Edit
      </div>
      <div className="cursor-pointer px-3 py-2 text-sm hover:bg-fill-secondary">
        Copy
      </div>
      <div className="cursor-pointer px-3 py-2 text-sm hover:bg-fill-secondary">
        Paste
      </div>
      <DropmenuDivider />
      <div className="text-text-danger cursor-pointer px-3 py-2 text-sm hover:bg-fill-secondary">
        Delete
      </div>
    </div>
  ),
};

/**
 * Shows multiple dividers separating different groups of menu items.
 * Useful for organizing complex menus with many options.
 */
export const MultipleDividers: Story = {
  render: () => (
    <div className="border-border-primary w-60 rounded-lg border bg-background py-1 shadow-lg">
      <div className="cursor-pointer px-3 py-2 text-sm hover:bg-fill-secondary">
        New File
      </div>
      <div className="cursor-pointer px-3 py-2 text-sm hover:bg-fill-secondary">
        New Folder
      </div>
      <DropmenuDivider />
      <div className="cursor-pointer px-3 py-2 text-sm hover:bg-fill-secondary">
        Cut
      </div>
      <div className="cursor-pointer px-3 py-2 text-sm hover:bg-fill-secondary">
        Copy
      </div>
      <div className="cursor-pointer px-3 py-2 text-sm hover:bg-fill-secondary">
        Paste
      </div>
      <DropmenuDivider />
      <div className="cursor-pointer px-3 py-2 text-sm hover:bg-fill-secondary">
        Select All
      </div>
      <DropmenuDivider />
      <div className="text-text-danger cursor-pointer px-3 py-2 text-sm hover:bg-fill-secondary">
        Delete
      </div>
    </div>
  ),
};

/**
 * Demonstrates className customization for the divider.
 * Shows how to override or extend default styles.
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm text-text-secondary">Default styling</p>
        <div className="border-border-primary w-60 rounded-lg border bg-background p-1">
          <DropmenuDivider />
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-secondary">Custom padding (py-2)</p>
        <div className="border-border-primary w-60 rounded-lg border bg-background p-1">
          <DropmenuDivider className="py-2" />
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-secondary">Custom margin (mx-4)</p>
        <div className="border-border-primary w-60 rounded-lg border bg-background p-1">
          <DropmenuDivider className="mx-4" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Shows the divider on a dark background to verify visibility.
 * The divider should remain visible against different backgrounds.
 */
export const DarkBackground: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm text-text-secondary">
          Light background (default)
        </p>
        <div className="border-border-primary w-60 rounded-lg border bg-background py-1">
          <div className="px-3 py-2 text-sm">Menu Item 1</div>
          <DropmenuDivider />
          <div className="px-3 py-2 text-sm">Menu Item 2</div>
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-secondary">Dark background</p>
        <div className="border-border-primary w-60 rounded-lg border bg-gray-800 py-1">
          <div className="px-3 py-2 text-sm text-white">Menu Item 1</div>
          <DropmenuDivider className="bg-gray-800" />
          <div className="px-3 py-2 text-sm text-white">Menu Item 2</div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Demonstrates proper accessibility implementation.
 * Shows how to add role and aria attributes for screen readers.
 */
export const Accessibility: Story = {
  render: () => (
    <div className="border-border-primary w-60 rounded-lg border bg-background py-1 shadow-lg">
      <div className="cursor-pointer px-3 py-2 text-sm hover:bg-fill-secondary">
        Edit
      </div>
      <div className="cursor-pointer px-3 py-2 text-sm hover:bg-fill-secondary">
        Copy
      </div>
      <DropmenuDivider role="separator" aria-orientation="horizontal" />
      <div className="text-text-danger cursor-pointer px-3 py-2 text-sm hover:bg-fill-secondary">
        Delete
      </div>
      <p className="mt-4 px-3 py-2 text-xs text-text-secondary">
        This divider has role=&quot;separator&quot; and
        aria-orientation=&quot;horizontal&quot; for screen reader support.
      </p>
    </div>
  ),
};
