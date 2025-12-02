import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SearchInput } from '@/ui/inputs';

/**
 * SearchInput is a dedicated search field component with built-in search icon and clear button.
 *
 * ## Features
 *
 * - **Built-in search icon**: MagnifyingGlass icon always displayed on the left
 * - **Clear button**: X icon appears when input has value, clears on click
 * - **Style variants**: Default (rounded corners) and Circled (pill-shaped)
 * - **Size variants**: SM (32px), MD (40px), LG (48px)
 * - **Search semantics**: Proper `type="search"` and `role="searchbox"` for accessibility
 *
 * ## When to Use
 *
 * Use SearchInput when:
 * - Building a search bar in a navigation or toolbar
 * - Creating a filter input for tables or lists
 * - Implementing command palette triggers
 * - Any search-specific input scenario
 *
 * For general text inputs, use TextInput instead.
 */
const meta = {
  title: 'Inputs/SearchInput',
  component: SearchInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description:
        'Size variant of the search input (32px, 40px, or 48px height)',
      table: {
        defaultValue: { summary: 'lg' },
      },
    },
    styleVariant: {
      control: 'select',
      options: ['default', 'circled'],
      description:
        'Border radius style: default (rounded-sm) or circled (pill-shaped)',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    error: {
      control: 'boolean',
      description: 'Error state - applies destructive border styling',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    onClear: {
      action: 'cleared',
      description: 'Callback fired when the clear button is clicked',
    },
    wrapperClassName: {
      control: 'text',
      description: 'Additional CSS classes for the wrapper element',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the input element',
    },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default SearchInput with LG size and default style variant.
 */
export const Default: Story = {
  args: {
    placeholder: 'Search...',
    size: 'lg',
    styleVariant: 'default',
  },
};

/**
 * Comparison of all three size variants: SM (32px), MD (40px), and LG (48px).
 */
export const Sizes: Story = {
  args: {
    placeholder: 'Size comparison',
  },
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Small (sm) - 32px</p>
        <SearchInput size="sm" placeholder="Small search" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Medium (md) - 40px</p>
        <SearchInput size="md" placeholder="Medium search" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Large (lg) - 48px - Default
        </p>
        <SearchInput size="lg" placeholder="Large search" />
      </div>
    </div>
  ),
};

/**
 * Comparison of style variants: Default (rounded-sm) and Circled (pill-shaped/rounded-full).
 */
export const StyleVariants: Story = {
  args: {
    placeholder: 'Style variants',
  },
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Default (rounded-sm)</p>
        <SearchInput styleVariant="default" placeholder="Default style" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Circled (rounded-full/pill)
        </p>
        <SearchInput styleVariant="circled" placeholder="Circled style" />
      </div>
    </div>
  ),
};

/**
 * Grid showing all visual states: Empty, Hover, Focus, Typing, Filled, Disabled.
 * Hover over inputs to see hover state, click to see focus state.
 */
export const AllStates: Story = {
  args: {
    placeholder: 'All states',
  },
  render: () => (
    <div className="grid w-[640px] grid-cols-2 gap-6">
      {/* Empty State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Empty (hover to see hover state)
        </p>
        <SearchInput placeholder="Search..." />
      </div>

      {/* Filled State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Filled (shows clear button)
        </p>
        <SearchInput defaultValue="Search results" />
      </div>

      {/* Disabled Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (empty)</p>
        <SearchInput disabled placeholder="Disabled search" />
      </div>

      {/* Disabled Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Disabled (filled, no clear button)
        </p>
        <SearchInput disabled defaultValue="Disabled with value" />
      </div>

      {/* Error Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (empty)</p>
        <SearchInput error placeholder="Error state" />
      </div>

      {/* Error Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (filled)</p>
        <SearchInput error defaultValue="Invalid search" />
      </div>
    </div>
  ),
};

/**
 * Demonstrates the clear button functionality with a controlled input.
 * Type in the input to see the clear button appear, then click it to clear.
 */
export const WithClearButton: Story = {
  args: {
    placeholder: 'Clear button demo',
  },
  render: function WithClearButtonStory() {
    const [value, setValue] = useState('Click the X to clear');

    return (
      <div className="w-[320px] space-y-4">
        <SearchInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue('')}
          placeholder="Type something..."
        />
        <p className="text-xs text-text-tertiary">
          Current value: &quot;{value}&quot;
        </p>
      </div>
    );
  },
};

/**
 * Comprehensive grid showing all size and style variant combinations.
 */
export const AllCombinations: Story = {
  args: {},
  render: () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-sm font-medium text-text-primary">
        All Size/Style/State Combinations
      </div>

      {/* Default Style */}
      <div className="space-y-4">
        <p className="text-xs font-medium text-text-tertiary">
          Default Style (rounded-sm)
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-xs text-text-tertiary">Small (sm)</p>
            <SearchInput size="sm" styleVariant="default" placeholder="Empty" />
            <SearchInput size="sm" styleVariant="default" defaultValue="Filled" />
            <SearchInput
              size="sm"
              styleVariant="default"
              disabled
              placeholder="Disabled"
            />
            <SearchInput
              size="sm"
              styleVariant="default"
              error
              placeholder="Error"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-text-tertiary">Medium (md)</p>
            <SearchInput size="md" styleVariant="default" placeholder="Empty" />
            <SearchInput size="md" styleVariant="default" defaultValue="Filled" />
            <SearchInput
              size="md"
              styleVariant="default"
              disabled
              placeholder="Disabled"
            />
            <SearchInput
              size="md"
              styleVariant="default"
              error
              placeholder="Error"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-text-tertiary">Large (lg)</p>
            <SearchInput size="lg" styleVariant="default" placeholder="Empty" />
            <SearchInput size="lg" styleVariant="default" defaultValue="Filled" />
            <SearchInput
              size="lg"
              styleVariant="default"
              disabled
              placeholder="Disabled"
            />
            <SearchInput
              size="lg"
              styleVariant="default"
              error
              placeholder="Error"
            />
          </div>
        </div>
      </div>

      {/* Circled Style */}
      <div className="space-y-4">
        <p className="text-xs font-medium text-text-tertiary">
          Circled Style (rounded-full)
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-xs text-text-tertiary">Small (sm)</p>
            <SearchInput size="sm" styleVariant="circled" placeholder="Empty" />
            <SearchInput size="sm" styleVariant="circled" defaultValue="Filled" />
            <SearchInput
              size="sm"
              styleVariant="circled"
              disabled
              placeholder="Disabled"
            />
            <SearchInput
              size="sm"
              styleVariant="circled"
              error
              placeholder="Error"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-text-tertiary">Medium (md)</p>
            <SearchInput size="md" styleVariant="circled" placeholder="Empty" />
            <SearchInput size="md" styleVariant="circled" defaultValue="Filled" />
            <SearchInput
              size="md"
              styleVariant="circled"
              disabled
              placeholder="Disabled"
            />
            <SearchInput
              size="md"
              styleVariant="circled"
              error
              placeholder="Error"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-text-tertiary">Large (lg)</p>
            <SearchInput size="lg" styleVariant="circled" placeholder="Empty" />
            <SearchInput size="lg" styleVariant="circled" defaultValue="Filled" />
            <SearchInput
              size="lg"
              styleVariant="circled"
              disabled
              placeholder="Disabled"
            />
            <SearchInput
              size="lg"
              styleVariant="circled"
              error
              placeholder="Error"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Demonstrates both controlled and uncontrolled input patterns.
 */
export const ControlledVsUncontrolled: Story = {
  args: {},
  render: function ControlledExample() {
    const [controlled, setControlled] = useState('');

    return (
      <div className="flex w-[320px] flex-col gap-8">
        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Uncontrolled (uses defaultValue)
          </p>
          <SearchInput
            defaultValue="Initial search"
            placeholder="Type to change..."
          />
          <p className="mt-2 text-xs text-text-tertiary">
            Value managed internally by the component
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Controlled (uses value + onChange)
          </p>
          <SearchInput
            value={controlled}
            onChange={(e) => setControlled(e.target.value)}
            onClear={() => setControlled('')}
            placeholder="Type here..."
          />
          <p className="mt-2 text-xs text-text-tertiary">
            Current value: &quot;{controlled}&quot;
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Real-world example: Navigation search bar, commonly found in app headers.
 */
export const RealWorldSearchBar: Story = {
  args: {},
  render: function NavbarSearchExample() {
    const [query, setQuery] = useState('');

    return (
      <div className="w-[600px] space-y-6">
        <p className="text-sm font-medium text-text-primary">
          Navbar Search Example
        </p>

        {/* Simulated navbar */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
          <div className="text-sm font-semibold">Logo</div>

          <div className="w-[280px]">
            <SearchInput
              size="sm"
              styleVariant="circled"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery('')}
              placeholder="Search products..."
              aria-label="Search products"
            />
          </div>

          <div className="flex gap-4 text-sm text-text-secondary">
            <span>Menu</span>
            <span>Account</span>
          </div>
        </div>

        <p className="text-xs text-text-tertiary">
          Circled style with SM size works well in navigation bars
        </p>
      </div>
    );
  },
};

/**
 * Real-world example: Table filter search, commonly used above data tables.
 */
export const RealWorldFilterSearch: Story = {
  args: {},
  render: function TableFilterExample() {
    const [filter, setFilter] = useState('');

    const mockData = [
      { id: 1, name: 'Apple iPhone 15', category: 'Electronics' },
      { id: 2, name: 'Samsung Galaxy S24', category: 'Electronics' },
      { id: 3, name: 'Nike Air Max', category: 'Footwear' },
      { id: 4, name: 'Sony WH-1000XM5', category: 'Electronics' },
      { id: 5, name: 'Adidas Ultraboost', category: 'Footwear' },
    ];

    const filteredData = mockData.filter(
      (item) =>
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.category.toLowerCase().includes(filter.toLowerCase())
    );

    return (
      <div className="w-[500px] space-y-4">
        <p className="text-sm font-medium text-text-primary">
          Table Filter Example
        </p>

        {/* Filter area */}
        <div className="flex items-center gap-4">
          <div className="w-[240px]">
            <SearchInput
              size="md"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onClear={() => setFilter('')}
              placeholder="Filter products..."
              aria-label="Filter products table"
            />
          </div>
          <span className="text-xs text-text-tertiary">
            {filteredData.length} of {mockData.length} items
          </span>
        </div>

        {/* Mock table */}
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-background-secondary">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Product</th>
                <th className="px-4 py-2 text-left font-medium">Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2 text-text-secondary">
                    {item.category}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-8 text-center text-text-tertiary"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
};

/**
 * Real-world example: Command palette trigger, a searchable modal opener.
 */
export const RealWorldCommandPalette: Story = {
  args: {},
  render: function CommandPaletteExample() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const commands = [
      { id: 1, name: 'New file', shortcut: 'Cmd+N' },
      { id: 2, name: 'Open settings', shortcut: 'Cmd+,' },
      { id: 3, name: 'Toggle dark mode', shortcut: 'Cmd+Shift+D' },
      { id: 4, name: 'View documentation', shortcut: 'Cmd+Shift+H' },
    ];

    const filteredCommands = commands.filter((cmd) =>
      cmd.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="w-[400px] space-y-4">
        <p className="text-sm font-medium text-text-primary">
          Command Palette Example
        </p>

        {/* Trigger button */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-2 text-sm text-text-tertiary hover:border-border-hover"
        >
          <span>Search commands...</span>
          <span className="text-xs">Cmd+K</span>
        </button>

        {/* Simulated palette modal */}
        {isOpen && (
          <div className="overflow-hidden rounded-lg border border-border bg-background shadow-lg">
            <div className="border-b border-border p-2">
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch('')}
                placeholder="Type a command..."
                aria-label="Search commands"
                autoFocus
              />
            </div>
            <div className="p-2">
              {filteredCommands.map((cmd) => (
                <div
                  key={cmd.id}
                  className="flex items-center justify-between rounded px-3 py-2 hover:bg-background-secondary"
                >
                  <span className="text-sm">{cmd.name}</span>
                  <span className="text-xs text-text-tertiary">
                    {cmd.shortcut}
                  </span>
                </div>
              ))}
              {filteredCommands.length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-text-tertiary">
                  No commands found
                </div>
              )}
            </div>
            <div className="border-t border-border p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSearch('');
                }}
                className="w-full rounded bg-background-secondary px-3 py-1.5 text-xs hover:bg-background-tertiary"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-text-tertiary">
          Click the trigger to open the command palette
        </p>
      </div>
    );
  },
};
