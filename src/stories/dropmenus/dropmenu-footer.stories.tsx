import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DropmenuFooter, DropmenuHeader } from '@/ui/dropmenus';

/**
 * The DropmenuFooter component provides a footer section for dropdown menus.
 *
 * ## Features
 * - **Size variants**: SM (12px) and MD (14px) font sizes with matching padding
 * - **Consistent styling**: Normal weight, secondary text color, secondary background
 * - **Fixed width**: 200px to match standard dropdown widths
 *
 * ## Usage in Dropdown Menus
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuContent>
 *     <DropmenuHeader label="Actions" />
 *     <DropdownMenuItem>Edit</DropdownMenuItem>
 *     <DropdownMenuItem>Delete</DropdownMenuItem>
 *     <DropmenuFooter>Version 1.0.0</DropmenuFooter>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
const meta = {
  title: 'Dropmenus/DropmenuFooter',
  component: DropmenuFooter,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md'],
      description: 'Size variant - sm (12px) or md (14px)',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    children: {
      control: 'text',
      description: 'Footer content (text or React nodes)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof DropmenuFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default DropmenuFooter with MD size.
 */
export const Default: Story = {
  args: {
    children: 'Footer',
  },
};

/**
 * Small size variant with 12px font and tighter padding.
 */
export const SM: Story = {
  args: {
    children: 'Footer',
    size: 'sm',
  },
};

/**
 * Medium size variant with 14px font (default).
 */
export const MD: Story = {
  args: {
    children: 'Footer',
    size: 'md',
  },
};

/**
 * Side-by-side comparison of SM and MD size variants.
 */
export const Sizes: Story = {
  args: {
    children: 'Size comparison',
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="rounded-lg border border-border bg-white shadow-md">
        <p className="px-4 pt-4 text-xs text-text-secondary">Size: SM</p>
        <DropmenuFooter size="sm">Footer</DropmenuFooter>
      </div>
      <div className="rounded-lg border border-border bg-white shadow-md">
        <p className="px-4 pt-4 text-xs text-text-secondary">Size: MD</p>
        <DropmenuFooter size="md">Footer</DropmenuFooter>
      </div>
    </div>
  ),
};

/**
 * Demonstrates text wrapping behavior with long content.
 */
export const LongText: Story = {
  args: {
    children:
      'This is a very long footer text that demonstrates how the component handles text wrapping when content exceeds the container width',
  },
};

/**
 * Shows DropmenuFooter alongside DropmenuHeader in a dropdown context.
 */
export const WithDropmenuHeader: Story = {
  args: {
    children: 'With header',
  },
  render: () => (
    <div className="w-[200px] rounded-lg border border-border bg-white shadow-md">
      <DropmenuHeader label="Menu Title" />
      <div className="px-4 py-2 text-sm">Menu content here...</div>
      <DropmenuFooter>Footer text</DropmenuFooter>
    </div>
  ),
};

/**
 * Grid showing all size options together.
 */
export const AllVariants: Story = {
  args: {
    children: 'All variants',
  },
  render: () => (
    <div className="flex gap-4">
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">SM</p>
        <DropmenuFooter size="sm">Footer SM</DropmenuFooter>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">MD</p>
        <DropmenuFooter size="md">Footer MD</DropmenuFooter>
      </div>
    </div>
  ),
};

/**
 * Demonstrates className merging capability.
 */
export const CustomClassName: Story = {
  args: {
    children: 'Custom styled footer',
    className: 'rounded-b-lg',
  },
};

/**
 * Complete dropdown example with header, content, and footer.
 */
export const CompleteDropdown: Story = {
  args: {
    children: 'Complete dropdown',
  },
  render: () => (
    <div className="w-[200px] overflow-hidden rounded-lg border border-border bg-white shadow-lg">
      <DropmenuHeader label="Actions" />
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Edit</div>
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Duplicate</div>
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Delete</div>
      <DropmenuFooter>v1.0.0</DropmenuFooter>
    </div>
  ),
};

/**
 * Small dropdown example with matching SM sizes.
 */
export const SmallDropdown: Story = {
  args: {
    children: 'Small dropdown',
  },
  render: () => (
    <div className="w-[200px] overflow-hidden rounded-lg border border-border bg-white shadow-lg">
      <DropmenuHeader size="sm" label="Actions" />
      <div className="px-3 py-1.5 text-xs hover:bg-neutral-100">Edit</div>
      <div className="px-3 py-1.5 text-xs hover:bg-neutral-100">Duplicate</div>
      <div className="px-3 py-1.5 text-xs hover:bg-neutral-100">Delete</div>
      <DropmenuFooter size="sm">v1.0.0</DropmenuFooter>
    </div>
  ),
};

/**
 * Footer with React node children (links).
 */
export const WithLinks: Story = {
  args: {
    children: 'With links',
  },
  render: () => (
    <div className="w-[200px] overflow-hidden rounded-lg border border-border bg-white shadow-lg">
      <DropmenuHeader label="Help" />
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Documentation</div>
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Support</div>
      <DropmenuFooter>
        <a href="#" className="text-primary hover:underline">
          Privacy Policy
        </a>
      </DropmenuFooter>
    </div>
  ),
};

/**
 * User menu example with footer showing version.
 */
export const UserMenuExample: Story = {
  args: {
    children: 'User menu',
  },
  render: () => (
    <div className="w-[220px] overflow-hidden rounded-lg border border-border bg-white shadow-lg">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-medium">John Doe</p>
        <p className="text-xs text-text-secondary">john@example.com</p>
      </div>

      <DropmenuHeader label="Account" />
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Profile</div>
      <div className="px-4 py-2 text-sm hover:bg-neutral-100">Settings</div>

      <div className="border-t border-border">
        <div className="hover:bg-destructive-50 px-4 py-2 text-sm text-destructive">
          Sign Out
        </div>
      </div>

      <DropmenuFooter className="w-[220px]">App v2.1.0</DropmenuFooter>
    </div>
  ),
};
