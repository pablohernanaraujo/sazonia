import {
  Buildings,
  Code,
  Flag,
  FolderSimple,
  Globe,
  MapPin,
  Tag,
  User,
  UsersThree,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DropmenuItem } from '@/ui/inputs';

/**
 * The DropmenuItem component is a selectable menu item for input-related dropdown menus.
 *
 * ## Features
 * - **Size variants**: SM, MD, LG with appropriate spacing and typography
 * - **Visual states**: Default, hovered, pressed, focus, disabled
 * - **Selection states**: Visual indication when selected (blue left border, brand background)
 * - **Checkbox**: Optional checkbox for multi-select scenarios
 * - **Caption**: Optional secondary text below the label
 * - **Add-ons**: Optional left icon and right text
 * - **Accessible**: Uses role="option", aria-selected, aria-checked
 *
 * ## When to use DropmenuItem vs DropmenuOption
 *
 * | DropmenuItem (inputs/) | DropmenuOption (dropmenus/) |
 * |------------------------|----------------------------|
 * | Select dropdowns | Action menus (Edit, Delete) |
 * | Multi-select with checkboxes | Navigation dropdowns |
 * | Autocomplete/Combobox | Context menus |
 * | Has selection state | No selection state |
 *
 * ## Usage
 * ```tsx
 * import { DropmenuItem } from '@/ui/inputs';
 *
 * // In a Select dropdown
 * <div role="listbox">
 *   <DropmenuItem label="Option 1" selected />
 *   <DropmenuItem label="Option 2" />
 * </div>
 *
 * // In a Multi-select
 * <div role="listbox" aria-multiselectable="true">
 *   <DropmenuItem label="Item 1" showCheckbox selected />
 *   <DropmenuItem label="Item 2" showCheckbox />
 * </div>
 * ```
 */
const meta = {
  title: 'Inputs/DropmenuItem',
  component: DropmenuItem,
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
    selected: {
      control: 'boolean',
      description: 'Whether this item is selected',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    showCheckbox: {
      control: 'boolean',
      description: 'Show checkbox for multi-select',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    caption: {
      control: 'text',
      description: 'Optional caption text below the label',
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
      description: 'Right add-on text (count, shortcut, etc.)',
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
} satisfies Meta<typeof DropmenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Default Story
// =============================================================================

/**
 * Default DropmenuItem with LG size and default state.
 */
export const Default: Story = {
  args: {
    label: 'United States',
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
 * Disabled state (muted colors, non-interactive).
 */
export const StateDisabled: Story = {
  args: {
    label: 'Disabled option',
    disabled: true,
  },
};

// =============================================================================
// Selection Stories
// =============================================================================

/**
 * Selected state with brand border and background.
 */
export const Selected: Story = {
  args: {
    label: 'Selected option',
    selected: true,
  },
};

/**
 * Unselected state (default).
 */
export const Unselected: Story = {
  args: {
    label: 'Unselected option',
    selected: false,
  },
};

/**
 * Selected and hovered state (darker brand background).
 */
export const SelectedHovered: Story = {
  args: {
    label: 'Selected + Hovered',
    selected: true,
    visualState: 'hovered',
  },
};

// =============================================================================
// Caption Stories
// =============================================================================

/**
 * With caption text for additional context.
 */
export const WithCaption: Story = {
  args: {
    label: 'React',
    caption: 'JavaScript library for building user interfaces',
  },
};

/**
 * Without caption (label only).
 */
export const WithoutCaption: Story = {
  args: {
    label: 'Simple option',
  },
};

/**
 * Selected with caption.
 */
export const SelectedWithCaption: Story = {
  args: {
    label: 'React',
    caption: 'Currently selected framework',
    selected: true,
  },
};

// =============================================================================
// Checkbox Stories
// =============================================================================

/**
 * With checkbox (for multi-select).
 */
export const WithCheckbox: Story = {
  args: {
    label: 'Option with checkbox',
    showCheckbox: true,
  },
};

/**
 * Checkbox checked (selected).
 */
export const WithCheckboxChecked: Story = {
  args: {
    label: 'Checked option',
    showCheckbox: true,
    selected: true,
  },
};

/**
 * Without checkbox (single select).
 */
export const WithoutCheckbox: Story = {
  args: {
    label: 'Option without checkbox',
    showCheckbox: false,
  },
};

/**
 * Checkbox disabled unchecked.
 */
export const CheckboxDisabledUnchecked: Story = {
  args: {
    label: 'Disabled unchecked',
    showCheckbox: true,
    disabled: true,
  },
};

/**
 * Checkbox disabled checked.
 */
export const CheckboxDisabledChecked: Story = {
  args: {
    label: 'Disabled checked',
    showCheckbox: true,
    selected: true,
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
    label: 'Documents',
    showLeftAddOn: true,
    leftIcon: FolderSimple,
  },
};

/**
 * With right text add-on (count).
 */
export const WithRightText: Story = {
  args: {
    label: 'Messages',
    showRightAddOn: true,
    rightText: '12',
  },
};

/**
 * With both left icon and right text add-ons.
 */
export const WithBothAddOns: Story = {
  args: {
    label: 'Projects',
    showLeftAddOn: true,
    leftIcon: FolderSimple,
    showRightAddOn: true,
    rightText: '24',
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
 * Country selector with flags.
 */
export const CountrySelectorExample: Story = {
  args: {
    label: 'Country selector',
  },
  render: () => (
    <div
      className="w-[280px] rounded-lg border border-border bg-white py-2 shadow-lg"
      role="listbox"
      aria-label="Select country"
    >
      <DropmenuItem
        label="United States"
        showLeftAddOn
        leftIcon={Flag}
        selected
      />
      <DropmenuItem label="Canada" showLeftAddOn leftIcon={Flag} />
      <DropmenuItem label="United Kingdom" showLeftAddOn leftIcon={Flag} />
      <DropmenuItem label="Germany" showLeftAddOn leftIcon={Flag} />
      <DropmenuItem label="France" showLeftAddOn leftIcon={Flag} />
    </div>
  ),
};

/**
 * User selector with avatars and emails.
 */
export const UserSelectorExample: Story = {
  args: {
    label: 'User selector',
  },
  render: () => (
    <div
      className="w-[320px] rounded-lg border border-border bg-white py-2 shadow-lg"
      role="listbox"
      aria-label="Select user"
    >
      <DropmenuItem
        label="John Doe"
        caption="john.doe@example.com"
        showLeftAddOn
        leftIcon={User}
        selected
      />
      <DropmenuItem
        label="Jane Smith"
        caption="jane.smith@example.com"
        showLeftAddOn
        leftIcon={User}
      />
      <DropmenuItem
        label="Bob Johnson"
        caption="bob.johnson@example.com"
        showLeftAddOn
        leftIcon={User}
      />
      <DropmenuItem
        label="Alice Williams"
        caption="alice.williams@example.com"
        showLeftAddOn
        leftIcon={User}
        disabled
      />
    </div>
  ),
};

/**
 * Category selector with icons.
 */
export const CategorySelectorExample: Story = {
  args: {
    label: 'Category selector',
  },
  render: () => (
    <div
      className="w-[260px] rounded-lg border border-border bg-white py-2 shadow-lg"
      role="listbox"
      aria-label="Select category"
    >
      <DropmenuItem
        label="Technology"
        showLeftAddOn
        leftIcon={Code}
        showRightAddOn
        rightText="142"
        selected
      />
      <DropmenuItem
        label="Business"
        showLeftAddOn
        leftIcon={Buildings}
        showRightAddOn
        rightText="89"
      />
      <DropmenuItem
        label="Design"
        showLeftAddOn
        leftIcon={Tag}
        showRightAddOn
        rightText="67"
      />
      <DropmenuItem
        label="Marketing"
        showLeftAddOn
        leftIcon={Globe}
        showRightAddOn
        rightText="45"
      />
    </div>
  ),
};

/**
 * Multi-select with checkboxes.
 */
export const MultiSelectExample: Story = {
  args: {
    label: 'Multi-select',
  },
  render: () => (
    <div
      className="w-[280px] rounded-lg border border-border bg-white py-2 shadow-lg"
      role="listbox"
      aria-multiselectable="true"
      aria-label="Select options"
    >
      <DropmenuItem label="React" showCheckbox selected />
      <DropmenuItem label="Vue" showCheckbox selected />
      <DropmenuItem label="Angular" showCheckbox />
      <DropmenuItem label="Svelte" showCheckbox />
      <DropmenuItem label="Solid" showCheckbox disabled />
    </div>
  ),
};

/**
 * Location selector with captions.
 */
export const LocationSelectorExample: Story = {
  args: {
    label: 'Location selector',
  },
  render: () => (
    <div
      className="w-[320px] rounded-lg border border-border bg-white py-2 shadow-lg"
      role="listbox"
      aria-label="Select location"
    >
      <DropmenuItem
        label="New York Office"
        caption="350 5th Avenue, New York, NY 10118"
        showLeftAddOn
        leftIcon={MapPin}
        selected
      />
      <DropmenuItem
        label="San Francisco Office"
        caption="100 Market Street, San Francisco, CA 94102"
        showLeftAddOn
        leftIcon={MapPin}
      />
      <DropmenuItem
        label="London Office"
        caption="1 Canada Square, London E14 5AB"
        showLeftAddOn
        leftIcon={MapPin}
      />
    </div>
  ),
};

/**
 * Team selector with member counts.
 */
export const TeamSelectorExample: Story = {
  args: {
    label: 'Team selector',
  },
  render: () => (
    <div
      className="w-[280px] rounded-lg border border-border bg-white py-2 shadow-lg"
      role="listbox"
      aria-label="Select team"
    >
      <DropmenuItem
        label="Engineering"
        caption="Product development team"
        showLeftAddOn
        leftIcon={UsersThree}
        showRightAddOn
        rightText="24"
        selected
      />
      <DropmenuItem
        label="Design"
        caption="UI/UX design team"
        showLeftAddOn
        leftIcon={UsersThree}
        showRightAddOn
        rightText="8"
      />
      <DropmenuItem
        label="Marketing"
        caption="Growth and branding"
        showLeftAddOn
        leftIcon={UsersThree}
        showRightAddOn
        rightText="12"
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
        <div className="w-[220px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuItem
            size="sm"
            label="Small option"
            showLeftAddOn
            leftIcon={FolderSimple}
            showRightAddOn
            rightText="12"
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">MD (10px py)</p>
        <div className="w-[220px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuItem
            size="md"
            label="Medium option"
            showLeftAddOn
            leftIcon={FolderSimple}
            showRightAddOn
            rightText="12"
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">LG (12px py)</p>
        <div className="w-[220px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuItem
            size="lg"
            label="Large option"
            showLeftAddOn
            leftIcon={FolderSimple}
            showRightAddOn
            rightText="12"
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Grid showing all interactive states.
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
          <DropmenuItem
            label="Default"
            visualState="default"
            showLeftAddOn
            leftIcon={FolderSimple}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Hovered</p>
        <div className="w-[180px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuItem
            label="Hovered"
            visualState="hovered"
            showLeftAddOn
            leftIcon={FolderSimple}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Pressed</p>
        <div className="w-[180px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuItem
            label="Pressed"
            visualState="pressed"
            showLeftAddOn
            leftIcon={FolderSimple}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Focus</p>
        <div className="w-[180px] rounded-lg border border-border bg-white p-1 shadow-sm">
          <DropmenuItem
            label="Focus"
            visualState="focus"
            showLeftAddOn
            leftIcon={FolderSimple}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Disabled</p>
        <div className="w-[180px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuItem
            label="Disabled"
            disabled
            showLeftAddOn
            leftIcon={FolderSimple}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Grid showing selected vs unselected states.
 */
export const SelectionStates: Story = {
  args: {
    label: 'Selection states',
  },
  render: () => (
    <div className="flex gap-8">
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Unselected</p>
        <div className="w-[200px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuItem
            label="Unselected"
            showLeftAddOn
            leftIcon={FolderSimple}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Selected</p>
        <div className="w-[200px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuItem
            label="Selected"
            selected
            showLeftAddOn
            leftIcon={FolderSimple}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">
          Selected + Hover
        </p>
        <div className="w-[200px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuItem
            label="Sel + Hover"
            selected
            visualState="hovered"
            showLeftAddOn
            leftIcon={FolderSimple}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Grid showing checkbox states.
 */
export const CheckboxStates: Story = {
  args: {
    label: 'Checkbox states',
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Unchecked</p>
        <div className="w-[180px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuItem label="Unchecked" showCheckbox />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Checked</p>
        <div className="w-[180px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuItem label="Checked" showCheckbox selected />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">
          Disabled Unchecked
        </p>
        <div className="w-[180px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuItem label="Disabled" showCheckbox disabled />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">
          Disabled Checked
        </p>
        <div className="w-[180px] rounded-lg border border-border bg-white shadow-sm">
          <DropmenuItem label="Disabled" showCheckbox selected disabled />
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
      <div className="grid grid-cols-7 gap-4">
        <div className="text-xs font-medium text-text-secondary">Size</div>
        <div className="text-xs font-medium text-text-secondary">Default</div>
        <div className="text-xs font-medium text-text-secondary">Hovered</div>
        <div className="text-xs font-medium text-text-secondary">Selected</div>
        <div className="text-xs font-medium text-text-secondary">Sel+Hover</div>
        <div className="text-xs font-medium text-text-secondary">Checkbox</div>
        <div className="text-xs font-medium text-text-secondary">Disabled</div>
      </div>

      {/* SM row */}
      <div className="grid grid-cols-7 gap-4">
        <div className="flex items-center text-xs font-medium">SM</div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="sm" label="Option" />
        </div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="sm" label="Option" visualState="hovered" />
        </div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="sm" label="Option" selected />
        </div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="sm" label="Option" selected visualState="hovered" />
        </div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="sm" label="Option" showCheckbox selected />
        </div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="sm" label="Option" disabled />
        </div>
      </div>

      {/* MD row */}
      <div className="grid grid-cols-7 gap-4">
        <div className="flex items-center text-xs font-medium">MD</div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="md" label="Option" />
        </div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="md" label="Option" visualState="hovered" />
        </div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="md" label="Option" selected />
        </div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="md" label="Option" selected visualState="hovered" />
        </div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="md" label="Option" showCheckbox selected />
        </div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="md" label="Option" disabled />
        </div>
      </div>

      {/* LG row */}
      <div className="grid grid-cols-7 gap-4">
        <div className="flex items-center text-xs font-medium">LG</div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="lg" label="Option" />
        </div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="lg" label="Option" visualState="hovered" />
        </div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="lg" label="Option" selected />
        </div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="lg" label="Option" selected visualState="hovered" />
        </div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="lg" label="Option" showCheckbox selected />
        </div>
        <div className="w-[130px] rounded border border-border bg-white">
          <DropmenuItem size="lg" label="Option" disabled />
        </div>
      </div>
    </div>
  ),
};
