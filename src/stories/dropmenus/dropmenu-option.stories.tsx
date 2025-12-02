import {
  ArrowSquareOut,
  Copy,
  CreditCard,
  DownloadSimple,
  EnvelopeSimple,
  Gear,
  House,
  PencilSimple,
  Question,
  SignOut,
  Star,
  Trash,
  User,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DropmenuOption } from '@/ui/dropmenus';

/**
 * The DropmenuOption component is a menu item element for dropdown menus.
 *
 * ## Features
 * - **Size variants**: SM (6px vertical padding), MD (10px), LG (12px)
 * - **Visual states**: Default, hovered, pressed, focus, disabled
 * - **Add-ons**: Optional left icon and right text (shortcuts, counts)
 * - **Accessible**: Uses role="menuitem" and aria-disabled
 *
 * ## Usage in Dropdown Menus
 * ```tsx
 * import { DropmenuOption } from '@/ui/dropmenus';
 * import { PencilSimple, Trash, Copy } from '@phosphor-icons/react';
 *
 * <DropdownMenu>
 *   <DropdownMenuContent>
 *     <DropmenuOption
 *       label="Edit"
 *       showLeftAddOn
 *       leftIcon={PencilSimple}
 *       showRightAddOn
 *       rightText="⌘E"
 *     />
 *     <DropmenuOption
 *       label="Copy"
 *       showLeftAddOn
 *       leftIcon={Copy}
 *       showRightAddOn
 *       rightText="⌘C"
 *     />
 *     <DropmenuOption
 *       label="Delete"
 *       showLeftAddOn
 *       leftIcon={Trash}
 *     />
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
const meta = {
  title: 'Dropmenus/DropmenuOption',
  component: DropmenuOption,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant affecting padding and typography',
      table: {
        defaultValue: { summary: 'lg' },
      },
    },
    visualState: {
      control: 'select',
      options: ['default', 'hovered', 'pressed', 'focus'],
      description:
        'Visual state for Storybook demonstration (not for production)',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    label: {
      control: 'text',
      description: 'Option label text (required)',
    },
    showLeftAddOn: {
      control: 'boolean',
      description: 'Show left add-on slot',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    showRightAddOn: {
      control: 'boolean',
      description: 'Show right add-on slot',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    rightText: {
      control: 'text',
      description: 'Right add-on text (keyboard shortcut, count, etc.)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the option is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof DropmenuOption>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Default Story
// =============================================================================

/**
 * Default DropmenuOption with LG size and default state.
 */
export const Default: Story = {
  args: {
    label: 'Edit',
  },
};

// =============================================================================
// Size Variant Stories
// =============================================================================

/**
 * Small size variant (6px vertical padding, 14px font).
 */
export const SizeSmall: Story = {
  args: {
    label: 'Small option',
    size: 'sm',
  },
};

/**
 * Medium size variant (10px vertical padding, 14px font).
 */
export const SizeMedium: Story = {
  args: {
    label: 'Medium option',
    size: 'md',
  },
};

/**
 * Large size variant (12px vertical padding, 16px font) - default.
 */
export const SizeLarge: Story = {
  args: {
    label: 'Large option',
    size: 'lg',
  },
};

// =============================================================================
// State Stories
// =============================================================================

/**
 * Default visual state (no background).
 */
export const StateDefault: Story = {
  args: {
    label: 'Default state',
    visualState: 'default',
  },
};

/**
 * Hovered visual state (secondary background).
 */
export const StateHovered: Story = {
  args: {
    label: 'Hovered state',
    visualState: 'hovered',
  },
};

/**
 * Pressed visual state (tertiary background).
 */
export const StatePressed: Story = {
  args: {
    label: 'Pressed state',
    visualState: 'pressed',
  },
};

/**
 * Focus visual state (focus ring).
 */
export const StateFocus: Story = {
  args: {
    label: 'Focus state',
    visualState: 'focus',
  },
};

/**
 * Disabled state (muted colors, non-interactive).
 */
export const StateDisabled: Story = {
  args: {
    label: 'Disabled option',
    disabled: true,
  },
};

// =============================================================================
// Add-on Stories
// =============================================================================

/**
 * With left icon add-on.
 */
export const WithLeftIcon: Story = {
  args: {
    label: 'Edit',
    showLeftAddOn: true,
    leftIcon: PencilSimple,
  },
};

/**
 * With right text add-on (keyboard shortcut).
 */
export const WithRightText: Story = {
  args: {
    label: 'Copy',
    showRightAddOn: true,
    rightText: '⌘C',
  },
};

/**
 * With both left icon and right text add-ons.
 */
export const WithBothAddOns: Story = {
  args: {
    label: 'Duplicate',
    showLeftAddOn: true,
    leftIcon: Copy,
    showRightAddOn: true,
    rightText: '⌘D',
  },
};

/**
 * Without any add-ons (label only).
 */
export const WithoutAddOns: Story = {
  args: {
    label: 'Simple option',
  },
};

// =============================================================================
// Real-world Examples
// =============================================================================

/**
 * Action menu with edit, delete, and copy actions.
 */
export const ActionMenuExample: Story = {
  args: {
    label: 'Action menu',
  },
  render: () => (
    <div className="w-[200px] rounded-lg border border-border bg-white py-2 shadow-lg">
      <DropmenuOption
        label="Edit"
        showLeftAddOn
        leftIcon={PencilSimple}
        showRightAddOn
        rightText="⌘E"
      />
      <DropmenuOption
        label="Duplicate"
        showLeftAddOn
        leftIcon={Copy}
        showRightAddOn
        rightText="⌘D"
      />
      <DropmenuOption
        label="Delete"
        showLeftAddOn
        leftIcon={Trash}
        showRightAddOn
        rightText="⌫"
      />
    </div>
  ),
};

/**
 * Settings menu with icons and keyboard shortcuts.
 */
export const SettingsMenuExample: Story = {
  args: {
    label: 'Settings menu',
  },
  render: () => (
    <div className="w-[220px] rounded-lg border border-border bg-white py-2 shadow-lg">
      <DropmenuOption
        label="Preferences"
        showLeftAddOn
        leftIcon={Gear}
        showRightAddOn
        rightText="⌘,"
      />
      <DropmenuOption label="Account" showLeftAddOn leftIcon={User} />
      <DropmenuOption label="Billing" showLeftAddOn leftIcon={CreditCard} />
      <div className="my-1 h-px bg-border" />
      <DropmenuOption
        label="Help"
        showLeftAddOn
        leftIcon={Question}
        showRightAddOn
        rightText="⌘?"
      />
      <DropmenuOption label="Sign out" showLeftAddOn leftIcon={SignOut} />
    </div>
  ),
};

/**
 * User profile dropdown with account options.
 */
export const UserMenuExample: Story = {
  args: {
    label: 'User menu',
  },
  render: () => (
    <div className="w-[240px] rounded-lg border border-border bg-white py-2 shadow-lg">
      <div className="border-b border-border px-4 pt-1 pb-3">
        <p className="text-sm font-medium">John Doe</p>
        <p className="text-xs text-text-secondary">john@example.com</p>
      </div>
      <div className="py-1">
        <DropmenuOption label="View profile" showLeftAddOn leftIcon={User} />
        <DropmenuOption label="Dashboard" showLeftAddOn leftIcon={House} />
        <DropmenuOption
          label="Favorites"
          showLeftAddOn
          leftIcon={Star}
          showRightAddOn
          rightText="12"
        />
      </div>
      <div className="border-t border-border py-1">
        <DropmenuOption label="Settings" showLeftAddOn leftIcon={Gear} />
        <DropmenuOption
          label="Contact support"
          showLeftAddOn
          leftIcon={EnvelopeSimple}
        />
      </div>
      <div className="border-t border-border py-1">
        <DropmenuOption label="Sign out" showLeftAddOn leftIcon={SignOut} />
      </div>
    </div>
  ),
};

/**
 * File actions menu with download and share options.
 */
export const FileActionsExample: Story = {
  args: {
    label: 'File actions',
  },
  render: () => (
    <div className="w-[200px] rounded-lg border border-border bg-white py-2 shadow-lg">
      <DropmenuOption
        size="md"
        label="Open"
        showLeftAddOn
        leftIcon={ArrowSquareOut}
      />
      <DropmenuOption
        size="md"
        label="Download"
        showLeftAddOn
        leftIcon={DownloadSimple}
        showRightAddOn
        rightText="⌘S"
      />
      <DropmenuOption
        size="md"
        label="Rename"
        showLeftAddOn
        leftIcon={PencilSimple}
      />
      <div className="my-1 h-px bg-border" />
      <DropmenuOption
        size="md"
        label="Move to trash"
        showLeftAddOn
        leftIcon={Trash}
        disabled
      />
    </div>
  ),
};

// =============================================================================
// Comparison Stories
// =============================================================================

/**
 * Grid showing all three size variants.
 */
export const AllSizes: Story = {
  args: {
    label: 'All sizes',
  },
  render: () => (
    <div className="flex gap-8">
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">SM (6px py)</p>
        <div className="w-[200px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuOption
            size="sm"
            label="Small option"
            showLeftAddOn
            leftIcon={PencilSimple}
            showRightAddOn
            rightText="⌘E"
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">MD (10px py)</p>
        <div className="w-[200px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuOption
            size="md"
            label="Medium option"
            showLeftAddOn
            leftIcon={PencilSimple}
            showRightAddOn
            rightText="⌘E"
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">LG (12px py)</p>
        <div className="w-[200px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuOption
            size="lg"
            label="Large option"
            showLeftAddOn
            leftIcon={PencilSimple}
            showRightAddOn
            rightText="⌘E"
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Grid showing all five interactive states.
 */
export const AllStates: Story = {
  args: {
    label: 'All states',
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Default</p>
        <div className="w-[180px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuOption
            label="Default"
            visualState="default"
            showLeftAddOn
            leftIcon={PencilSimple}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Hovered</p>
        <div className="w-[180px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuOption
            label="Hovered"
            visualState="hovered"
            showLeftAddOn
            leftIcon={PencilSimple}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Pressed</p>
        <div className="w-[180px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuOption
            label="Pressed"
            visualState="pressed"
            showLeftAddOn
            leftIcon={PencilSimple}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Focus</p>
        <div className="w-[180px] rounded-lg border border-border bg-white p-1 shadow-sm">
          <DropmenuOption
            label="Focus"
            visualState="focus"
            showLeftAddOn
            leftIcon={PencilSimple}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Disabled</p>
        <div className="w-[180px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuOption
            label="Disabled"
            disabled
            showLeftAddOn
            leftIcon={PencilSimple}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Complete grid showing all size and state combinations.
 */
export const AllVariants: Story = {
  args: {
    label: 'All variants',
  },
  render: () => (
    <div className="space-y-8">
      {/* Header row */}
      <div className="grid grid-cols-6 gap-4">
        <div className="text-xs font-medium text-text-secondary">Size</div>
        <div className="text-xs font-medium text-text-secondary">Default</div>
        <div className="text-xs font-medium text-text-secondary">Hovered</div>
        <div className="text-xs font-medium text-text-secondary">Pressed</div>
        <div className="text-xs font-medium text-text-secondary">Focus</div>
        <div className="text-xs font-medium text-text-secondary">Disabled</div>
      </div>

      {/* SM row */}
      <div className="grid grid-cols-6 gap-4">
        <div className="flex items-center text-xs font-medium">SM</div>
        {(['default', 'hovered', 'pressed', 'focus'] as const).map((state) => (
          <div
            key={state}
            className={`w-[140px] rounded border border-border bg-white ${state === 'focus' ? 'p-1' : ''}`}
          >
            <DropmenuOption
              size="sm"
              label="Option"
              visualState={state}
              showLeftAddOn
              leftIcon={PencilSimple}
            />
          </div>
        ))}
        <div className="w-[140px] rounded border border-border bg-white">
          <DropmenuOption
            size="sm"
            label="Option"
            disabled
            showLeftAddOn
            leftIcon={PencilSimple}
          />
        </div>
      </div>

      {/* MD row */}
      <div className="grid grid-cols-6 gap-4">
        <div className="flex items-center text-xs font-medium">MD</div>
        {(['default', 'hovered', 'pressed', 'focus'] as const).map((state) => (
          <div
            key={state}
            className={`w-[140px] rounded border border-border bg-white ${state === 'focus' ? 'p-1' : ''}`}
          >
            <DropmenuOption
              size="md"
              label="Option"
              visualState={state}
              showLeftAddOn
              leftIcon={PencilSimple}
            />
          </div>
        ))}
        <div className="w-[140px] rounded border border-border bg-white">
          <DropmenuOption
            size="md"
            label="Option"
            disabled
            showLeftAddOn
            leftIcon={PencilSimple}
          />
        </div>
      </div>

      {/* LG row */}
      <div className="grid grid-cols-6 gap-4">
        <div className="flex items-center text-xs font-medium">LG</div>
        {(['default', 'hovered', 'pressed', 'focus'] as const).map((state) => (
          <div
            key={state}
            className={`w-[140px] rounded border border-border bg-white ${state === 'focus' ? 'p-1' : ''}`}
          >
            <DropmenuOption
              size="lg"
              label="Option"
              visualState={state}
              showLeftAddOn
              leftIcon={PencilSimple}
            />
          </div>
        ))}
        <div className="w-[140px] rounded border border-border bg-white">
          <DropmenuOption
            size="lg"
            label="Option"
            disabled
            showLeftAddOn
            leftIcon={PencilSimple}
          />
        </div>
      </div>
    </div>
  ),
};
