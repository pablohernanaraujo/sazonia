import {
  Buildings,
  Flag,
  FolderSimple,
  Globe,
  MapPin,
  Tag,
  User,
  UsersThree,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  DropmenuItem,
  InputDropmenu,
  InputDropmenuContent,
  InputDropmenuOptions,
  InputDropmenuSearch,
} from '@/ui/inputs';

/**
 * The InputDropmenu is a composite dropdown container component for form input scenarios.
 *
 * ## Features
 * - **Size variants**: SM (240px), MD (288px), LG (344px) height with fixed 320px width
 * - **Context-based sizing**: Size propagates to all children via React context
 * - **Search integration**: Built-in search input at the top
 * - **Custom scrollbar**: Styled scrollbar for the options list
 * - **Accessible**: Uses role="listbox", role="option", and proper ARIA attributes
 *
 * ## When to use InputDropmenu vs Dropmenu
 *
 * | InputDropmenu (inputs/) | Dropmenu (dropmenus/) |
 * |-------------------------|----------------------|
 * | Select dropdowns | Action menus (Edit, Delete) |
 * | Combobox/Autocomplete | Navigation dropdowns |
 * | Search + select | Context menus |
 * | Form input scenarios | Quick actions |
 *
 * ## Composition
 *
 * ```tsx
 * <InputDropmenu size="lg">
 *   <InputDropmenuContent>
 *     <InputDropmenuSearch placeholder="Search..." />
 *     <InputDropmenuOptions>
 *       <DropmenuItem label="Option 1" />
 *       <DropmenuItem label="Option 2" />
 *     </InputDropmenuOptions>
 *   </InputDropmenuContent>
 * </InputDropmenu>
 * ```
 */
const meta = {
  title: 'Inputs/InputDropmenu',
  component: InputDropmenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description:
        'Size variant affecting container height and child component sizing',
      table: {
        defaultValue: { summary: 'lg' },
        type: { summary: "'sm' | 'md' | 'lg'" },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the wrapper',
    },
  },
} satisfies Meta<typeof InputDropmenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Default Story
// =============================================================================

/**
 * Default InputDropmenu with LG size and simple options.
 */
export const Default: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent>
        <InputDropmenuSearch placeholder="Search..." size={args.size} />
        <InputDropmenuOptions>
          <DropmenuItem label="Option 1" size={args.size} />
          <DropmenuItem label="Option 2" size={args.size} />
          <DropmenuItem label="Option 3" size={args.size} />
          <DropmenuItem label="Option 4" size={args.size} />
          <DropmenuItem label="Option 5" size={args.size} />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

// =============================================================================
// Size Variant Stories
// =============================================================================

/**
 * Small size variant (240px height).
 * Compact container for limited space scenarios.
 */
export const SizeSmall: Story = {
  args: {
    size: 'sm',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent>
        <InputDropmenuSearch placeholder="Search options..." size={args.size} />
        <InputDropmenuOptions>
          <DropmenuItem label="Small Option 1" size={args.size} />
          <DropmenuItem label="Small Option 2" size={args.size} />
          <DropmenuItem label="Small Option 3" size={args.size} />
          <DropmenuItem label="Small Option 4" size={args.size} />
          <DropmenuItem label="Small Option 5" size={args.size} />
          <DropmenuItem label="Small Option 6" size={args.size} />
          <DropmenuItem label="Small Option 7" size={args.size} />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

/**
 * Medium size variant (288px height).
 * Balanced container for most use cases.
 */
export const SizeMedium: Story = {
  args: {
    size: 'md',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent>
        <InputDropmenuSearch placeholder="Search options..." size={args.size} />
        <InputDropmenuOptions>
          <DropmenuItem label="Medium Option 1" size={args.size} />
          <DropmenuItem label="Medium Option 2" size={args.size} />
          <DropmenuItem label="Medium Option 3" size={args.size} />
          <DropmenuItem label="Medium Option 4" size={args.size} />
          <DropmenuItem label="Medium Option 5" size={args.size} />
          <DropmenuItem label="Medium Option 6" size={args.size} />
          <DropmenuItem label="Medium Option 7" size={args.size} />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

/**
 * Large size variant (344px height) - default.
 * Full-size container with more visible options.
 */
export const SizeLarge: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent>
        <InputDropmenuSearch placeholder="Search options..." size={args.size} />
        <InputDropmenuOptions>
          <DropmenuItem label="Large Option 1" size={args.size} />
          <DropmenuItem label="Large Option 2" size={args.size} />
          <DropmenuItem label="Large Option 3" size={args.size} />
          <DropmenuItem label="Large Option 4" size={args.size} />
          <DropmenuItem label="Large Option 5" size={args.size} />
          <DropmenuItem label="Large Option 6" size={args.size} />
          <DropmenuItem label="Large Option 7" size={args.size} />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

// =============================================================================
// Template Stories
// =============================================================================

/**
 * Simple text options template.
 * Basic list without icons or additional metadata.
 */
export const TemplateOptions: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent>
        <InputDropmenuSearch placeholder="Search..." size={args.size} />
        <InputDropmenuOptions>
          <DropmenuItem label="React" size={args.size} />
          <DropmenuItem label="Vue" size={args.size} />
          <DropmenuItem label="Angular" size={args.size} />
          <DropmenuItem label="Svelte" size={args.size} />
          <DropmenuItem label="Solid" size={args.size} />
          <DropmenuItem label="Preact" size={args.size} />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

/**
 * User selector template with avatars and emails.
 * Shows user name with email as caption.
 */
export const TemplateUsers: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent>
        <InputDropmenuSearch placeholder="Search users..." size={args.size} />
        <InputDropmenuOptions>
          <DropmenuItem
            label="John Doe"
            caption="john.doe@example.com"
            showLeftAddOn
            leftIcon={User}
            size={args.size}
          />
          <DropmenuItem
            label="Jane Smith"
            caption="jane.smith@example.com"
            showLeftAddOn
            leftIcon={User}
            size={args.size}
          />
          <DropmenuItem
            label="Bob Johnson"
            caption="bob.johnson@example.com"
            showLeftAddOn
            leftIcon={User}
            size={args.size}
          />
          <DropmenuItem
            label="Alice Williams"
            caption="alice.williams@example.com"
            showLeftAddOn
            leftIcon={User}
            size={args.size}
          />
          <DropmenuItem
            label="Charlie Brown"
            caption="charlie.brown@example.com"
            showLeftAddOn
            leftIcon={User}
            size={args.size}
          />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

/**
 * Country selector template with flags.
 * Shows country names with flag icons.
 */
export const TemplateCountry: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent>
        <InputDropmenuSearch placeholder="Search countries..." size={args.size} />
        <InputDropmenuOptions>
          <DropmenuItem
            label="United States"
            showLeftAddOn
            leftIcon={Flag}
            showRightAddOn
            rightText="US"
            size={args.size}
          />
          <DropmenuItem
            label="Canada"
            showLeftAddOn
            leftIcon={Flag}
            showRightAddOn
            rightText="CA"
            size={args.size}
          />
          <DropmenuItem
            label="United Kingdom"
            showLeftAddOn
            leftIcon={Flag}
            showRightAddOn
            rightText="UK"
            size={args.size}
          />
          <DropmenuItem
            label="Germany"
            showLeftAddOn
            leftIcon={Flag}
            showRightAddOn
            rightText="DE"
            size={args.size}
          />
          <DropmenuItem
            label="France"
            showLeftAddOn
            leftIcon={Flag}
            showRightAddOn
            rightText="FR"
            size={args.size}
          />
          <DropmenuItem
            label="Japan"
            showLeftAddOn
            leftIcon={Flag}
            showRightAddOn
            rightText="JP"
            size={args.size}
          />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

/**
 * Language selector template.
 * Shows language names with globe icon.
 */
export const TemplateLanguages: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent>
        <InputDropmenuSearch placeholder="Search languages..." size={args.size} />
        <InputDropmenuOptions>
          <DropmenuItem
            label="English"
            caption="Native"
            showLeftAddOn
            leftIcon={Globe}
            size={args.size}
          />
          <DropmenuItem
            label="Spanish"
            caption="Español"
            showLeftAddOn
            leftIcon={Globe}
            size={args.size}
          />
          <DropmenuItem
            label="French"
            caption="Français"
            showLeftAddOn
            leftIcon={Globe}
            size={args.size}
          />
          <DropmenuItem
            label="German"
            caption="Deutsch"
            showLeftAddOn
            leftIcon={Globe}
            size={args.size}
          />
          <DropmenuItem
            label="Japanese"
            caption="日本語"
            showLeftAddOn
            leftIcon={Globe}
            size={args.size}
          />
          <DropmenuItem
            label="Korean"
            caption="한국어"
            showLeftAddOn
            leftIcon={Globe}
            size={args.size}
          />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

// =============================================================================
// State Stories
// =============================================================================

/**
 * With a pre-selected item.
 * Shows single selection state.
 */
export const WithSelectedItem: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent>
        <InputDropmenuSearch placeholder="Search..." size={args.size} />
        <InputDropmenuOptions>
          <DropmenuItem label="Option 1" size={args.size} />
          <DropmenuItem label="Option 2" size={args.size} selected />
          <DropmenuItem label="Option 3" size={args.size} />
          <DropmenuItem label="Option 4" size={args.size} />
          <DropmenuItem label="Option 5" size={args.size} />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

/**
 * Multi-select mode with checkboxes.
 * Shows checkbox selection for multiple items.
 */
export const WithMultipleSelected: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent>
        <InputDropmenuSearch placeholder="Search..." size={args.size} />
        <InputDropmenuOptions>
          <DropmenuItem label="React" showCheckbox selected size={args.size} />
          <DropmenuItem label="Vue" showCheckbox selected size={args.size} />
          <DropmenuItem label="Angular" showCheckbox size={args.size} />
          <DropmenuItem label="Svelte" showCheckbox size={args.size} />
          <DropmenuItem label="Solid" showCheckbox size={args.size} />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

/**
 * With some disabled items.
 * Shows disabled state for unavailable options.
 */
export const WithDisabledItems: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent>
        <InputDropmenuSearch placeholder="Search..." size={args.size} />
        <InputDropmenuOptions>
          <DropmenuItem label="Available Option 1" size={args.size} />
          <DropmenuItem label="Disabled Option" size={args.size} disabled />
          <DropmenuItem label="Available Option 2" size={args.size} />
          <DropmenuItem label="Disabled Option 2" size={args.size} disabled />
          <DropmenuItem label="Available Option 3" size={args.size} />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

/**
 * With search input showing placeholder.
 * Demonstrates search functionality area.
 */
export const WithSearch: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent>
        <InputDropmenuSearch
          placeholder="Type to filter options..."
          size={args.size}
        />
        <InputDropmenuOptions>
          <DropmenuItem label="Apple" size={args.size} />
          <DropmenuItem label="Banana" size={args.size} />
          <DropmenuItem label="Cherry" size={args.size} />
          <DropmenuItem label="Date" size={args.size} />
          <DropmenuItem label="Elderberry" size={args.size} />
          <DropmenuItem label="Fig" size={args.size} />
          <DropmenuItem label="Grape" size={args.size} />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

// =============================================================================
// Real-world Examples
// =============================================================================

/**
 * Complete country selector example.
 * Production-ready country picker with flags and codes.
 */
export const CountrySelectorExample: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent aria-label="Select a country">
        <InputDropmenuSearch
          placeholder="Search countries..."
          size={args.size}
          aria-label="Search countries"
        />
        <InputDropmenuOptions>
          <DropmenuItem
            label="United States"
            showLeftAddOn
            leftIcon={Flag}
            showRightAddOn
            rightText="+1"
            selected
            size={args.size}
          />
          <DropmenuItem
            label="Canada"
            showLeftAddOn
            leftIcon={Flag}
            showRightAddOn
            rightText="+1"
            size={args.size}
          />
          <DropmenuItem
            label="United Kingdom"
            showLeftAddOn
            leftIcon={Flag}
            showRightAddOn
            rightText="+44"
            size={args.size}
          />
          <DropmenuItem
            label="Germany"
            showLeftAddOn
            leftIcon={Flag}
            showRightAddOn
            rightText="+49"
            size={args.size}
          />
          <DropmenuItem
            label="France"
            showLeftAddOn
            leftIcon={Flag}
            showRightAddOn
            rightText="+33"
            size={args.size}
          />
          <DropmenuItem
            label="Australia"
            showLeftAddOn
            leftIcon={Flag}
            showRightAddOn
            rightText="+61"
            size={args.size}
          />
          <DropmenuItem
            label="Japan"
            showLeftAddOn
            leftIcon={Flag}
            showRightAddOn
            rightText="+81"
            size={args.size}
          />
          <DropmenuItem
            label="Brazil"
            showLeftAddOn
            leftIcon={Flag}
            showRightAddOn
            rightText="+55"
            size={args.size}
          />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

/**
 * User picker with avatars example.
 * Production-ready user selector with emails.
 */
export const UserSelectorExample: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent aria-label="Select a user">
        <InputDropmenuSearch
          placeholder="Search by name or email..."
          size={args.size}
          aria-label="Search users"
        />
        <InputDropmenuOptions>
          <DropmenuItem
            label="John Doe"
            caption="john.doe@company.com"
            showLeftAddOn
            leftIcon={User}
            selected
            size={args.size}
          />
          <DropmenuItem
            label="Jane Smith"
            caption="jane.smith@company.com"
            showLeftAddOn
            leftIcon={User}
            size={args.size}
          />
          <DropmenuItem
            label="Bob Johnson"
            caption="bob.johnson@company.com"
            showLeftAddOn
            leftIcon={User}
            size={args.size}
          />
          <DropmenuItem
            label="Alice Williams"
            caption="alice.williams@company.com"
            showLeftAddOn
            leftIcon={User}
            disabled
            size={args.size}
          />
          <DropmenuItem
            label="Charlie Brown"
            caption="charlie.brown@company.com"
            showLeftAddOn
            leftIcon={User}
            size={args.size}
          />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

/**
 * Language picker example.
 * Production-ready language selector.
 */
export const LanguageSelectorExample: Story = {
  args: {
    size: 'md',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent aria-label="Select a language">
        <InputDropmenuSearch
          placeholder="Search languages..."
          size={args.size}
          aria-label="Search languages"
        />
        <InputDropmenuOptions>
          <DropmenuItem
            label="English (US)"
            caption="Default"
            showLeftAddOn
            leftIcon={Globe}
            selected
            size={args.size}
          />
          <DropmenuItem
            label="English (UK)"
            showLeftAddOn
            leftIcon={Globe}
            size={args.size}
          />
          <DropmenuItem
            label="Spanish"
            caption="Español"
            showLeftAddOn
            leftIcon={Globe}
            size={args.size}
          />
          <DropmenuItem
            label="French"
            caption="Français"
            showLeftAddOn
            leftIcon={Globe}
            size={args.size}
          />
          <DropmenuItem
            label="German"
            caption="Deutsch"
            showLeftAddOn
            leftIcon={Globe}
            size={args.size}
          />
          <DropmenuItem
            label="Portuguese"
            caption="Português"
            showLeftAddOn
            leftIcon={Globe}
            size={args.size}
          />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

/**
 * Category picker with counts example.
 * Shows categories with item counts.
 */
export const CategorySelectorExample: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent aria-label="Select a category">
        <InputDropmenuSearch
          placeholder="Search categories..."
          size={args.size}
          aria-label="Search categories"
        />
        <InputDropmenuOptions>
          <DropmenuItem
            label="Technology"
            showLeftAddOn
            leftIcon={Tag}
            showRightAddOn
            rightText="142"
            selected
            size={args.size}
          />
          <DropmenuItem
            label="Business"
            showLeftAddOn
            leftIcon={Buildings}
            showRightAddOn
            rightText="89"
            size={args.size}
          />
          <DropmenuItem
            label="Design"
            showLeftAddOn
            leftIcon={FolderSimple}
            showRightAddOn
            rightText="67"
            size={args.size}
          />
          <DropmenuItem
            label="Marketing"
            showLeftAddOn
            leftIcon={Globe}
            showRightAddOn
            rightText="45"
            size={args.size}
          />
          <DropmenuItem
            label="Engineering"
            showLeftAddOn
            leftIcon={UsersThree}
            showRightAddOn
            rightText="234"
            size={args.size}
          />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

/**
 * Location selector with addresses.
 * Office locations with full addresses.
 */
export const LocationSelectorExample: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent aria-label="Select a location">
        <InputDropmenuSearch
          placeholder="Search locations..."
          size={args.size}
          aria-label="Search locations"
        />
        <InputDropmenuOptions>
          <DropmenuItem
            label="New York Office"
            caption="350 5th Avenue, New York, NY 10118"
            showLeftAddOn
            leftIcon={MapPin}
            selected
            size={args.size}
          />
          <DropmenuItem
            label="San Francisco Office"
            caption="100 Market Street, San Francisco, CA 94102"
            showLeftAddOn
            leftIcon={MapPin}
            size={args.size}
          />
          <DropmenuItem
            label="London Office"
            caption="1 Canada Square, London E14 5AB"
            showLeftAddOn
            leftIcon={MapPin}
            size={args.size}
          />
          <DropmenuItem
            label="Tokyo Office"
            caption="1-7-1 Konan, Minato-ku, Tokyo"
            showLeftAddOn
            leftIcon={MapPin}
            size={args.size}
          />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};

// =============================================================================
// Comparison Stories
// =============================================================================

/**
 * Side-by-side size comparison.
 * Shows all three sizes for visual comparison.
 */
export const AllSizes: Story = {
  args: {
    size: 'lg',
    children: null,
  },
  render: () => (
    <div className="flex gap-8">
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">SM (240px)</p>
        <InputDropmenu size="sm">
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." size="sm" />
            <InputDropmenuOptions>
              <DropmenuItem label="Option 1" size="sm" />
              <DropmenuItem label="Option 2" size="sm" selected />
              <DropmenuItem label="Option 3" size="sm" />
              <DropmenuItem label="Option 4" size="sm" />
              <DropmenuItem label="Option 5" size="sm" />
              <DropmenuItem label="Option 6" size="sm" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">MD (288px)</p>
        <InputDropmenu size="md">
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." size="md" />
            <InputDropmenuOptions>
              <DropmenuItem label="Option 1" size="md" />
              <DropmenuItem label="Option 2" size="md" selected />
              <DropmenuItem label="Option 3" size="md" />
              <DropmenuItem label="Option 4" size="md" />
              <DropmenuItem label="Option 5" size="md" />
              <DropmenuItem label="Option 6" size="md" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">LG (344px)</p>
        <InputDropmenu size="lg">
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." size="lg" />
            <InputDropmenuOptions>
              <DropmenuItem label="Option 1" size="lg" />
              <DropmenuItem label="Option 2" size="lg" selected />
              <DropmenuItem label="Option 3" size="lg" />
              <DropmenuItem label="Option 4" size="lg" />
              <DropmenuItem label="Option 5" size="lg" />
              <DropmenuItem label="Option 6" size="lg" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      </div>
    </div>
  ),
};

/**
 * All template types in a grid.
 * Shows different use case templates side by side.
 */
export const AllTemplates: Story = {
  args: {
    size: 'md',
    children: null,
  },
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Simple Options</p>
        <InputDropmenu size="md">
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." size="md" />
            <InputDropmenuOptions>
              <DropmenuItem label="React" size="md" selected />
              <DropmenuItem label="Vue" size="md" />
              <DropmenuItem label="Angular" size="md" />
              <DropmenuItem label="Svelte" size="md" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Users</p>
        <InputDropmenu size="md">
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search users..." size="md" />
            <InputDropmenuOptions>
              <DropmenuItem
                label="John Doe"
                caption="john@example.com"
                showLeftAddOn
                leftIcon={User}
                selected
                size="md"
              />
              <DropmenuItem
                label="Jane Smith"
                caption="jane@example.com"
                showLeftAddOn
                leftIcon={User}
                size="md"
              />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Countries</p>
        <InputDropmenu size="md">
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search countries..." size="md" />
            <InputDropmenuOptions>
              <DropmenuItem
                label="United States"
                showLeftAddOn
                leftIcon={Flag}
                showRightAddOn
                rightText="US"
                selected
                size="md"
              />
              <DropmenuItem
                label="Canada"
                showLeftAddOn
                leftIcon={Flag}
                showRightAddOn
                rightText="CA"
                size="md"
              />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Multi-select</p>
        <InputDropmenu size="md">
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." size="md" />
            <InputDropmenuOptions>
              <DropmenuItem label="Option 1" showCheckbox selected size="md" />
              <DropmenuItem label="Option 2" showCheckbox selected size="md" />
              <DropmenuItem label="Option 3" showCheckbox size="md" />
              <DropmenuItem label="Option 4" showCheckbox size="md" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      </div>
    </div>
  ),
};

/**
 * Selection states comparison.
 * Shows unselected, selected, and multi-select states.
 */
export const SelectionStates: Story = {
  args: {
    size: 'sm',
    children: null,
  },
  render: () => (
    <div className="flex gap-8">
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Unselected</p>
        <InputDropmenu size="sm">
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." size="sm" />
            <InputDropmenuOptions>
              <DropmenuItem label="Option 1" size="sm" />
              <DropmenuItem label="Option 2" size="sm" />
              <DropmenuItem label="Option 3" size="sm" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Single Select</p>
        <InputDropmenu size="sm">
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." size="sm" />
            <InputDropmenuOptions>
              <DropmenuItem label="Option 1" size="sm" />
              <DropmenuItem label="Option 2" size="sm" selected />
              <DropmenuItem label="Option 3" size="sm" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-text-secondary">Multi-Select</p>
        <InputDropmenu size="sm">
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." size="sm" />
            <InputDropmenuOptions>
              <DropmenuItem label="Option 1" showCheckbox selected size="sm" />
              <DropmenuItem label="Option 2" showCheckbox selected size="sm" />
              <DropmenuItem label="Option 3" showCheckbox size="sm" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      </div>
    </div>
  ),
};

/**
 * Scrolling behavior demonstration.
 * Shows scrollbar with many options.
 */
export const ScrollingBehavior: Story = {
  args: {
    size: 'md',
    children: null,
  },
  render: (args) => (
    <InputDropmenu {...args}>
      <InputDropmenuContent>
        <InputDropmenuSearch placeholder="Search options..." size={args.size} />
        <InputDropmenuOptions>
          {Array.from({ length: 20 }, (_, i) => (
            <DropmenuItem
              key={i}
              label={`Option ${i + 1}`}
              size={args.size}
              selected={i === 0}
            />
          ))}
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};
