import { useRef, useState } from 'react';
import { Check, FolderSimple, User } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Icon } from '@/ui/icons';
import { DropmenuItem, InputDropmenuSearch } from '@/ui/inputs';

/**
 * InputDropmenuSearch is a specialized search input component designed for use
 * within dropdown menus. It provides a minimal, borderless search interface with
 * a search icon and subtle bottom border separator.
 *
 * ## Key Features
 *
 * - **Search icon**: MagnifyingGlass icon on the left for visual affordance
 * - **Bottom border only**: Designed to blend with dropdown menus
 * - **Three sizes**: SM, MD, LG matching dropdown item sizes
 * - **Accessible**: `type="search"`, `role="searchbox"`, proper ARIA support
 *
 * ## When to Use
 *
 * Use this component when:
 * - Building dropdown menus with filterable options
 * - Creating autocomplete or combobox components
 * - Implementing searchable select inputs
 *
 * ## Architectural Note
 *
 * This is a **standalone molecule** - it does NOT extend TextInput because:
 * - Optimized for dropdown context (different styling)
 * - Simpler feature set (no error states, no add-ons)
 * - Bottom border only (not full border)
 */
const meta = {
  title: 'Inputs/InputDropmenuSearch',
  component: InputDropmenuSearch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the search input',
      table: { defaultValue: { summary: 'lg' } },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when empty',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show the search icon',
      table: { defaultValue: { summary: 'true' } },
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
} satisfies Meta<typeof InputDropmenuSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default InputDropmenuSearch with LG size and placeholder.
 */
export const Default: Story = {
  args: {
    placeholder: 'Search',
    size: 'lg',
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
 * Comparison of all three size variants: SM, MD, and LG.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Small (sm)</p>
        <InputDropmenuSearch size="sm" placeholder="Search (SM)" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Medium (md)</p>
        <InputDropmenuSearch size="md" placeholder="Search (MD)" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Large (lg) - Default</p>
        <InputDropmenuSearch size="lg" placeholder="Search (LG)" />
      </div>
    </div>
  ),
};

/**
 * Shows the empty state with placeholder text.
 */
export const EmptyState: Story = {
  args: {
    placeholder: 'Search countries...',
    size: 'lg',
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <p className="mb-2 text-xs text-text-tertiary">
          Empty - showing placeholder
        </p>
        <Story />
      </div>
    ),
  ],
};

/**
 * Shows the filled state with an entered value.
 */
export const FilledState: Story = {
  args: {
    defaultValue: 'United States',
    size: 'lg',
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <p className="mb-2 text-xs text-text-tertiary">
          Filled - showing entered value
        </p>
        <Story />
      </div>
    ),
  ],
};

/**
 * Grid showing all size × filled combinations for visual comparison.
 */
export const AllCombinations: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-sm font-medium text-text-primary">
        All Size/State Combinations
      </div>
      <div className="grid grid-cols-3 gap-6">
        {/* Small column */}
        <div className="w-[220px] space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Small (sm)</p>
          <InputDropmenuSearch size="sm" placeholder="Empty" />
          <InputDropmenuSearch size="sm" defaultValue="Filled" />
        </div>

        {/* Medium column */}
        <div className="w-[220px] space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Medium (md)</p>
          <InputDropmenuSearch size="md" placeholder="Empty" />
          <InputDropmenuSearch size="md" defaultValue="Filled" />
        </div>

        {/* Large column */}
        <div className="w-[220px] space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Large (lg)</p>
          <InputDropmenuSearch size="lg" placeholder="Empty" />
          <InputDropmenuSearch size="lg" defaultValue="Filled" />
        </div>
      </div>
    </div>
  ),
};

/**
 * ⭐ CRITICAL: Real-world example showing the search input within a dropdown menu context.
 * This demonstrates the primary use case for this component.
 */
export const WithinDropmenu: Story = {
  render: function WithinDropmenuExample() {
    const [query, setQuery] = useState('');
    const countries = [
      'United States',
      'United Kingdom',
      'Canada',
      'Australia',
      'Germany',
      'France',
      'Japan',
      'Brazil',
    ];

    const filteredCountries = countries.filter((country) =>
      country.toLowerCase().includes(query.toLowerCase())
    );

    return (
      <div className="w-[320px] rounded-lg border border-border bg-background shadow-lg">
        <InputDropmenuSearch
          placeholder="Search countries..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search countries"
        />
        <div className="max-h-[240px] overflow-y-auto py-1">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <DropmenuItem
                key={country}
                label={country}
                selected={country === 'United States'}
              />
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-text-tertiary">
              No countries found
            </div>
          )}
        </div>
      </div>
    );
  },
};

/**
 * Demonstrates the controlled input pattern with React state.
 */
export const ControlledExample: Story = {
  render: function ControlledExampleStory() {
    const [value, setValue] = useState('');

    return (
      <div className="w-[320px] space-y-4">
        <InputDropmenuSearch
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type to search..."
        />
        <div className="rounded border border-border bg-background-secondary p-3">
          <p className="text-xs text-text-tertiary">Current value:</p>
          <p className="text-sm font-medium text-text-primary">
            {value || '(empty)'}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Variant without the search icon.
 */
export const NoIcon: Story = {
  args: {
    showIcon: false,
    placeholder: 'Filter options...',
    size: 'lg',
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <p className="mb-2 text-xs text-text-tertiary">Without search icon</p>
        <Story />
      </div>
    ),
  ],
};

/**
 * Demonstrates focus styling - click the input to see the border change.
 * The wrapper gets `border-primary` color when the input is focused.
 */
export const FocusedState: Story = {
  render: function FocusedStateExample() {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="w-[320px] space-y-4">
        <div>
          <p className="mb-2 text-xs text-text-tertiary">
            Click the input to see focus styling
          </p>
          <InputDropmenuSearch
            ref={inputRef}
            placeholder="Click me to focus..."
          />
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="rounded bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-hover"
        >
          Focus programmatically
        </button>
        <p className="text-xs text-text-tertiary">
          Note: On focus, the bottom border changes to the primary color
          (focus-within:border-primary)
        </p>
      </div>
    );
  },
};

/**
 * Demonstrates the accessibility attributes of the component.
 * Includes `type="search"`, `role="searchbox"`, and `aria-label`.
 */
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div className="text-sm font-medium text-text-primary">
        Accessibility Features
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs text-text-tertiary">
            With aria-label (inspect in DevTools)
          </p>
          <InputDropmenuSearch
            placeholder="Search users..."
            aria-label="Search users by name"
          />
        </div>

        <div>
          <p className="mb-2 text-xs text-text-tertiary">
            With aria-describedby (inspect in DevTools)
          </p>
          <InputDropmenuSearch
            placeholder="Search products..."
            aria-describedby="search-help"
          />
          <p id="search-help" className="mt-1 text-xs text-text-tertiary">
            Type to filter the list of products
          </p>
        </div>
      </div>

      <div className="rounded border border-border bg-background-secondary p-4">
        <p className="mb-2 text-sm font-medium text-text-primary">
          Built-in Accessibility:
        </p>
        <ul className="space-y-1 text-xs text-text-secondary">
          <li>
            • <code className="text-primary">type=&quot;search&quot;</code> -
            Semantic search input
          </li>
          <li>
            • <code className="text-primary">role=&quot;searchbox&quot;</code> -
            ARIA role for screen readers
          </li>
          <li>
            • <code className="text-primary">aria-hidden=&quot;true&quot;</code> -
            Icon is decorative
          </li>
          <li>• Supports aria-label and aria-describedby</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Example showing the component in a multi-select dropdown context
 * with checkboxes for multiple selection.
 */
export const MultiSelectDropdown: Story = {
  render: function MultiSelectExample() {
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<string[]>(['React']);

    const frameworks = [
      { name: 'React', caption: 'JavaScript library for UIs' },
      { name: 'Vue', caption: 'Progressive JS framework' },
      { name: 'Angular', caption: 'Platform for web apps' },
      { name: 'Svelte', caption: 'Compile-time framework' },
      { name: 'Next.js', caption: 'React framework for production' },
    ];

    const filteredFrameworks = frameworks.filter((fw) =>
      fw.name.toLowerCase().includes(query.toLowerCase())
    );

    const toggleSelection = (name: string) => {
      setSelected((prev) =>
        prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
      );
    };

    return (
      <div className="w-[320px] rounded-lg border border-border bg-background shadow-lg">
        <InputDropmenuSearch
          size="md"
          placeholder="Search frameworks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="max-h-[280px] overflow-y-auto py-1">
          {filteredFrameworks.map((fw) => (
            <DropmenuItem
              key={fw.name}
              size="md"
              label={fw.name}
              caption={fw.caption}
              showCheckbox
              selected={selected.includes(fw.name)}
              onClick={() => toggleSelection(fw.name)}
            />
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Example showing the component in a single-select dropdown with icons.
 */
export const SingleSelectWithIcons: Story = {
  render: function SingleSelectExample() {
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState('Documents');

    const items = [
      { name: 'Documents', icon: FolderSimple },
      { name: 'Profile', icon: User },
      { name: 'Tasks', icon: Check },
    ];

    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
      <div className="w-[280px] rounded-lg border border-border bg-background shadow-lg">
        <InputDropmenuSearch
          size="sm"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="py-1">
          {filteredItems.map((item) => (
            <DropmenuItem
              key={item.name}
              size="sm"
              label={item.name}
              showLeftAddOn
              leftAddOn={
                <Icon
                  icon={item.icon}
                  size="sm"
                  className="text-text-secondary"
                />
              }
              selected={selected === item.name}
              onClick={() => setSelected(item.name)}
            />
          ))}
        </div>
      </div>
    );
  },
};
