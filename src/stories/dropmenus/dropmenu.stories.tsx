import {
  ArrowSquareOut,
  Copy,
  Gear,
  House,
  Link as LinkIcon,
  PencilSimple,
  SignOut,
  Star,
  TelegramLogo,
  Trash,
  TwitterLogo,
  User,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Dropmenu,
  DropmenuContent,
  DropmenuDivider,
  DropmenuFooter,
  DropmenuHeader,
  DropmenuOption,
} from '@/ui/dropmenus';

/**
 * The Dropmenu component is a composite dropdown menu container that orchestrates
 * its atomic sub-components (DropmenuHeader, DropmenuOption, DropmenuFooter, DropmenuDivider)
 * into a cohesive, reusable dropdown panel.
 *
 * ## Features
 * - **Size variants**: SM (220px), MD (240px), LG (260px) - propagated to all children via context
 * - **Consistent styling**: Border, shadow, rounded corners
 * - **Compound pattern**: Uses Dropmenu + DropmenuContent for flexibility
 * - **Accessible**: Uses role="menu" with aria-orientation="vertical"
 *
 * ## Usage
 * ```tsx
 * import {
 *   Dropmenu,
 *   DropmenuContent,
 *   DropmenuHeader,
 *   DropmenuOption,
 *   DropmenuDivider,
 *   DropmenuFooter,
 * } from '@/ui/dropmenus';
 *
 * <Dropmenu size="md">
 *   <DropmenuContent>
 *     <DropmenuHeader label="Actions" />
 *     <DropmenuOption label="Edit" showLeftAddOn leftIcon={PencilSimple} />
 *     <DropmenuOption label="Delete" showLeftAddOn leftIcon={Trash} />
 *     <DropmenuDivider />
 *     <DropmenuFooter>More options...</DropmenuFooter>
 *   </DropmenuContent>
 * </Dropmenu>
 * ```
 */
const meta = {
  title: 'Dropmenus/Dropmenu',
  component: Dropmenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant affecting container width and children sizing',
      table: {
        defaultValue: { summary: 'lg' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Dropmenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Default Story
// =============================================================================

/**
 * Default Dropmenu with header, options, and footer.
 * Uses LG size (260px width) by default.
 */
export const Default: Story = {
  args: {
    size: 'lg',
    children: null, // Placeholder, render provides actual content
  },
  render: (args) => (
    <Dropmenu {...args}>
      <DropmenuContent>
        <DropmenuHeader label="Actions" size={args.size} />
        <DropmenuOption
          label="Edit"
          size={args.size}
          showLeftAddOn
          leftIcon={PencilSimple}
        />
        <DropmenuOption
          label="Duplicate"
          size={args.size}
          showLeftAddOn
          leftIcon={Copy}
        />
        <DropmenuOption
          label="Delete"
          size={args.size}
          showLeftAddOn
          leftIcon={Trash}
        />
        <DropmenuDivider />
        <DropmenuFooter size={args.size}>3 items selected</DropmenuFooter>
      </DropmenuContent>
    </Dropmenu>
  ),
};

// =============================================================================
// Size Variant Stories
// =============================================================================

/**
 * Small size variant (220px width).
 * Compact layout for tight spaces.
 */
export const SizeSmall: Story = {
  args: {
    size: 'sm',
    children: null,
  },
  render: (args) => (
    <Dropmenu {...args}>
      <DropmenuContent>
        <DropmenuHeader label="Actions" size={args.size} />
        <DropmenuOption
          label="Edit"
          size={args.size}
          showLeftAddOn
          leftIcon={PencilSimple}
        />
        <DropmenuOption
          label="Duplicate"
          size={args.size}
          showLeftAddOn
          leftIcon={Copy}
        />
        <DropmenuOption
          label="Delete"
          size={args.size}
          showLeftAddOn
          leftIcon={Trash}
        />
      </DropmenuContent>
    </Dropmenu>
  ),
};

/**
 * Medium size variant (240px width).
 * Balanced layout for general use.
 */
export const SizeMedium: Story = {
  args: {
    size: 'md',
    children: null,
  },
  render: (args) => (
    <Dropmenu {...args}>
      <DropmenuContent>
        <DropmenuHeader label="Actions" size={args.size} />
        <DropmenuOption
          label="Edit"
          size={args.size}
          showLeftAddOn
          leftIcon={PencilSimple}
        />
        <DropmenuOption
          label="Duplicate"
          size={args.size}
          showLeftAddOn
          leftIcon={Copy}
        />
        <DropmenuOption
          label="Delete"
          size={args.size}
          showLeftAddOn
          leftIcon={Trash}
        />
      </DropmenuContent>
    </Dropmenu>
  ),
};

/**
 * Large size variant (260px width) - default.
 * Spacious layout for comfortable interaction.
 */
export const SizeLarge: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <Dropmenu {...args}>
      <DropmenuContent>
        <DropmenuHeader label="Actions" size={args.size} />
        <DropmenuOption
          label="Edit"
          size={args.size}
          showLeftAddOn
          leftIcon={PencilSimple}
        />
        <DropmenuOption
          label="Duplicate"
          size={args.size}
          showLeftAddOn
          leftIcon={Copy}
        />
        <DropmenuOption
          label="Delete"
          size={args.size}
          showLeftAddOn
          leftIcon={Trash}
        />
      </DropmenuContent>
    </Dropmenu>
  ),
};

// =============================================================================
// Template Stories
// =============================================================================

/**
 * Default list template with header, multiple options, and footer.
 * Common pattern for contextual menus.
 */
export const DefaultListTemplate: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <Dropmenu {...args}>
      <DropmenuContent>
        <DropmenuHeader label="File Actions" size={args.size} />
        <DropmenuOption label="Open" size={args.size} />
        <DropmenuOption label="Open in new tab" size={args.size} />
        <DropmenuOption label="Download" size={args.size} />
        <DropmenuDivider />
        <DropmenuOption label="Rename" size={args.size} />
        <DropmenuOption label="Move to..." size={args.size} />
        <DropmenuDivider />
        <DropmenuFooter size={args.size}>Selected: document.pdf</DropmenuFooter>
      </DropmenuContent>
    </Dropmenu>
  ),
};

/**
 * Share menu template with social platform options.
 * Used for sharing content to various platforms.
 */
export const ShareMenuTemplate: Story = {
  args: {
    size: 'md',
    children: null,
  },
  render: (args) => (
    <Dropmenu {...args}>
      <DropmenuContent>
        <DropmenuHeader label="Share" size={args.size} />
        <DropmenuOption
          label="Twitter"
          size={args.size}
          showLeftAddOn
          leftIcon={TwitterLogo}
        />
        <DropmenuOption
          label="Telegram"
          size={args.size}
          showLeftAddOn
          leftIcon={TelegramLogo}
        />
        <DropmenuDivider />
        <DropmenuOption
          label="Copy link"
          size={args.size}
          showLeftAddOn
          leftIcon={LinkIcon}
        />
      </DropmenuContent>
    </Dropmenu>
  ),
};

/**
 * Action menu template with icons and keyboard shortcuts.
 * Common pattern for edit/action menus.
 */
export const ActionMenuTemplate: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <Dropmenu {...args}>
      <DropmenuContent>
        <DropmenuOption
          label="Edit"
          size={args.size}
          showLeftAddOn
          leftIcon={PencilSimple}
          showRightAddOn
          rightText="⌘E"
        />
        <DropmenuOption
          label="Duplicate"
          size={args.size}
          showLeftAddOn
          leftIcon={Copy}
          showRightAddOn
          rightText="⌘D"
        />
        <DropmenuOption
          label="Open in new tab"
          size={args.size}
          showLeftAddOn
          leftIcon={ArrowSquareOut}
          showRightAddOn
          rightText="⌘⏎"
        />
        <DropmenuDivider />
        <DropmenuOption
          label="Delete"
          size={args.size}
          showLeftAddOn
          leftIcon={Trash}
          showRightAddOn
          rightText="⌫"
        />
      </DropmenuContent>
    </Dropmenu>
  ),
};

/**
 * User profile menu template with avatar section, navigation, and logout.
 * Used for account dropdowns and user menus.
 */
export const UserProfileTemplate: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <Dropmenu {...args}>
      <DropmenuContent>
        {/* User info section */}
        <div className="border-b border-border-secondary px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fill-secondary">
              <User size={20} className="text-text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">John Doe</p>
              <p className="text-xs text-text-secondary">john@example.com</p>
            </div>
          </div>
        </div>
        {/* Navigation section */}
        <DropmenuOption
          label="View profile"
          size={args.size}
          showLeftAddOn
          leftIcon={User}
        />
        <DropmenuOption
          label="Dashboard"
          size={args.size}
          showLeftAddOn
          leftIcon={House}
        />
        <DropmenuOption
          label="Favorites"
          size={args.size}
          showLeftAddOn
          leftIcon={Star}
          showRightAddOn
          rightText="12"
        />
        <DropmenuDivider />
        {/* Settings section */}
        <DropmenuOption
          label="Settings"
          size={args.size}
          showLeftAddOn
          leftIcon={Gear}
        />
        <DropmenuDivider />
        {/* Logout */}
        <DropmenuOption
          label="Sign out"
          size={args.size}
          showLeftAddOn
          leftIcon={SignOut}
        />
      </DropmenuContent>
    </Dropmenu>
  ),
};

// =============================================================================
// Comparison Stories
// =============================================================================

/**
 * Side-by-side comparison of all three size variants.
 */
export const AllSizes: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: () => (
    <div className="flex gap-8">
      {/* Small */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">SM (220px)</p>
        <Dropmenu size="sm">
          <DropmenuContent>
            <DropmenuHeader label="Actions" size="sm" />
            <DropmenuOption
              label="Edit"
              size="sm"
              showLeftAddOn
              leftIcon={PencilSimple}
            />
            <DropmenuOption
              label="Delete"
              size="sm"
              showLeftAddOn
              leftIcon={Trash}
            />
          </DropmenuContent>
        </Dropmenu>
      </div>
      {/* Medium */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">MD (240px)</p>
        <Dropmenu size="md">
          <DropmenuContent>
            <DropmenuHeader label="Actions" size="md" />
            <DropmenuOption
              label="Edit"
              size="md"
              showLeftAddOn
              leftIcon={PencilSimple}
            />
            <DropmenuOption
              label="Delete"
              size="md"
              showLeftAddOn
              leftIcon={Trash}
            />
          </DropmenuContent>
        </Dropmenu>
      </div>
      {/* Large */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">LG (260px)</p>
        <Dropmenu size="lg">
          <DropmenuContent>
            <DropmenuHeader label="Actions" size="lg" />
            <DropmenuOption
              label="Edit"
              size="lg"
              showLeftAddOn
              leftIcon={PencilSimple}
            />
            <DropmenuOption
              label="Delete"
              size="lg"
              showLeftAddOn
              leftIcon={Trash}
            />
          </DropmenuContent>
        </Dropmenu>
      </div>
    </div>
  ),
};

/**
 * Grid showing all template variations for quick visual comparison.
 */
export const AllTemplates: Story = {
  args: {
    size: 'md',
    children: null,
  },
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      {/* Default List */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Default List</p>
        <Dropmenu size="md">
          <DropmenuContent>
            <DropmenuHeader label="File Actions" size="md" />
            <DropmenuOption label="Open" size="md" />
            <DropmenuOption label="Download" size="md" />
            <DropmenuDivider />
            <DropmenuFooter size="md">document.pdf</DropmenuFooter>
          </DropmenuContent>
        </Dropmenu>
      </div>

      {/* Share Menu */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Share Menu</p>
        <Dropmenu size="md">
          <DropmenuContent>
            <DropmenuHeader label="Share" size="md" />
            <DropmenuOption
              label="Twitter"
              size="md"
              showLeftAddOn
              leftIcon={TwitterLogo}
            />
            <DropmenuOption
              label="Copy link"
              size="md"
              showLeftAddOn
              leftIcon={LinkIcon}
            />
          </DropmenuContent>
        </Dropmenu>
      </div>

      {/* Action Menu */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Action Menu</p>
        <Dropmenu size="md">
          <DropmenuContent>
            <DropmenuOption
              label="Edit"
              size="md"
              showLeftAddOn
              leftIcon={PencilSimple}
              showRightAddOn
              rightText="⌘E"
            />
            <DropmenuOption
              label="Delete"
              size="md"
              showLeftAddOn
              leftIcon={Trash}
              showRightAddOn
              rightText="⌫"
            />
          </DropmenuContent>
        </Dropmenu>
      </div>

      {/* User Profile */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">User Profile</p>
        <Dropmenu size="md">
          <DropmenuContent>
            <DropmenuOption
              label="Profile"
              size="md"
              showLeftAddOn
              leftIcon={User}
            />
            <DropmenuOption
              label="Settings"
              size="md"
              showLeftAddOn
              leftIcon={Gear}
            />
            <DropmenuDivider />
            <DropmenuOption
              label="Sign out"
              size="md"
              showLeftAddOn
              leftIcon={SignOut}
            />
          </DropmenuContent>
        </Dropmenu>
      </div>
    </div>
  ),
};
