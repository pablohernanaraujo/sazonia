import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DropmenuHeader } from '@/ui/dropmenus';

/**
 * The DropmenuHeader component provides section headers for dropdown menus.
 *
 * ## Features
 * - **Size variants**: SM (12px) and MD (14px) font sizes with matching padding
 * - **Consistent styling**: Medium weight, secondary text color
 * - **Flexible width**: Adapts to parent container width
 *
 * ## Usage in Dropdown Menus
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuContent>
 *     <DropmenuHeader label="Actions" />
 *     <DropdownMenuItem>Edit</DropdownMenuItem>
 *     <DropdownMenuItem>Delete</DropdownMenuItem>
 *
 *     <DropmenuHeader label="Settings" />
 *     <DropdownMenuItem>Preferences</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
const meta = {
  title: 'Dropmenus/DropmenuHeader',
  component: DropmenuHeader,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant affecting padding and typography',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    label: {
      control: 'text',
      description: 'Header label text (required)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof DropmenuHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default DropmenuHeader with MD size.
 */
export const Default: Story = {
  args: {
    label: 'Header',
  },
};

/**
 * Comparison of SM and MD size variants.
 */
export const Sizes: Story = {
  args: {
    label: 'Size comparison',
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="w-[200px] rounded-lg border border-border bg-white shadow-md">
        <p className="px-4 pt-4 text-xs text-text-secondary">Size: SM</p>
        <DropmenuHeader size="sm" label="Header" />
      </div>
      <div className="w-[200px] rounded-lg border border-border bg-white shadow-md">
        <p className="px-4 pt-4 text-xs text-text-secondary">Size: MD</p>
        <DropmenuHeader size="md" label="Header" />
      </div>
    </div>
  ),
};

/**
 * Examples with different label text lengths.
 */
export const CustomLabels: Story = {
  args: {
    label: 'Custom labels',
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-[200px] rounded-lg border border-border bg-white shadow-md">
        <DropmenuHeader label="Short" />
      </div>
      <div className="w-[200px] rounded-lg border border-border bg-white shadow-md">
        <DropmenuHeader label="Medium Length" />
      </div>
      <div className="w-[200px] rounded-lg border border-border bg-white shadow-md">
        <DropmenuHeader label="A Very Long Header Text" />
      </div>
      <div className="w-[200px] rounded-lg border border-border bg-white shadow-md">
        <DropmenuHeader label="Actions" />
      </div>
      <div className="w-[200px] rounded-lg border border-border bg-white shadow-md">
        <DropmenuHeader label="Settings" />
      </div>
    </div>
  ),
};

/**
 * Component shown within a simulated dropdown container with menu items.
 */
export const InDropdownContext: Story = {
  args: {
    label: 'Dropdown context',
  },
  render: () => (
    <div className="w-[200px] rounded-lg border border-border bg-white py-2 shadow-lg">
      <DropmenuHeader label="Actions" />
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Edit</div>
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Duplicate</div>
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Delete</div>

      <DropmenuHeader label="Settings" />
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Preferences</div>
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Account</div>
    </div>
  ),
};

/**
 * Small size dropdown context.
 */
export const SmallDropdownContext: Story = {
  args: {
    label: 'Small dropdown',
    size: 'sm',
  },
  render: () => (
    <div className="w-[200px] rounded-lg border border-border bg-white py-1.5 shadow-lg">
      <DropmenuHeader size="sm" label="Actions" />
      <div className="px-3 py-1.5 text-xs hover:bg-neutral-100">Edit</div>
      <div className="px-3 py-1.5 text-xs hover:bg-neutral-100">Duplicate</div>
      <div className="px-3 py-1.5 text-xs hover:bg-neutral-100">Delete</div>

      <DropmenuHeader size="sm" label="Settings" />
      <div className="px-3 py-1.5 text-xs hover:bg-neutral-100">Preferences</div>
      <div className="px-3 py-1.5 text-xs hover:bg-neutral-100">Account</div>
    </div>
  ),
};

/**
 * Grid showing all size variants with various labels.
 */
export const AllVariants: Story = {
  args: {
    label: 'All variants',
  },
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      {/* SM variants */}
      <div className="space-y-4 rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold">Small (sm)</h3>
        <div className="w-[200px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuHeader size="sm" label="Header" />
        </div>
        <div className="w-[200px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuHeader size="sm" label="Actions" />
        </div>
        <div className="w-[200px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuHeader size="sm" label="Settings & Preferences" />
        </div>
      </div>

      {/* MD variants */}
      <div className="space-y-4 rounded-lg border border-border p-4">
        <h3 className="text-sm font-semibold">Medium (md)</h3>
        <div className="w-[200px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuHeader size="md" label="Header" />
        </div>
        <div className="w-[200px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuHeader size="md" label="Actions" />
        </div>
        <div className="w-[200px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuHeader size="md" label="Settings & Preferences" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Side-by-side comparison of SM and MD sizes.
 */
export const SizeComparison: Story = {
  args: {
    label: 'Comparison',
  },
  render: () => (
    <div className="flex gap-8">
      <div className="w-[200px] rounded-lg border border-border bg-white shadow-md">
        <p className="bg-neutral-50 px-4 py-2 text-xs font-medium text-text-secondary">
          SM (12px / 12px padding)
        </p>
        <DropmenuHeader size="sm" label="Header" />
        <div className="h-8 border-t border-border" />
      </div>
      <div className="w-[200px] rounded-lg border border-border bg-white shadow-md">
        <p className="bg-neutral-50 px-4 py-2 text-xs font-medium text-text-secondary">
          MD (14px / 16px padding)
        </p>
        <DropmenuHeader size="md" label="Header" />
        <div className="h-8 border-t border-border" />
      </div>
    </div>
  ),
};

/**
 * Example of a user menu dropdown with headers.
 */
export const UserMenuExample: Story = {
  args: {
    label: 'User menu',
  },
  render: () => (
    <div className="w-[220px] rounded-lg border border-border bg-white py-2 shadow-lg">
      <div className="border-b border-border px-4 pb-3">
        <p className="text-sm font-medium">John Doe</p>
        <p className="text-xs text-text-secondary">john@example.com</p>
      </div>

      <DropmenuHeader label="Account" />
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Profile</div>
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Settings</div>
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Billing</div>

      <DropmenuHeader label="Support" />
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Help Center</div>
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Contact Us</div>

      <div className="mt-2 border-t border-border pt-2">
        <div className="hover:bg-destructive-50 px-4 py-2 text-sm text-destructive">
          Sign Out
        </div>
      </div>
    </div>
  ),
};

/**
 * Example of a context menu with action groups.
 */
export const ContextMenuExample: Story = {
  args: {
    label: 'Context menu',
  },
  render: () => (
    <div className="w-[180px] rounded-lg border border-border bg-white py-1 shadow-lg">
      <DropmenuHeader size="sm" label="Edit" />
      <div className="flex items-center justify-between px-3 py-1.5 text-xs hover:bg-neutral-100">
        <span>Cut</span>
        <span className="text-text-secondary">⌘X</span>
      </div>
      <div className="flex items-center justify-between px-3 py-1.5 text-xs hover:bg-neutral-100">
        <span>Copy</span>
        <span className="text-text-secondary">⌘C</span>
      </div>
      <div className="flex items-center justify-between px-3 py-1.5 text-xs hover:bg-neutral-100">
        <span>Paste</span>
        <span className="text-text-secondary">⌘V</span>
      </div>

      <DropmenuHeader size="sm" label="View" />
      <div className="flex items-center justify-between px-3 py-1.5 text-xs hover:bg-neutral-100">
        <span>Zoom In</span>
        <span className="text-text-secondary">⌘+</span>
      </div>
      <div className="flex items-center justify-between px-3 py-1.5 text-xs hover:bg-neutral-100">
        <span>Zoom Out</span>
        <span className="text-text-secondary">⌘-</span>
      </div>
    </div>
  ),
};
