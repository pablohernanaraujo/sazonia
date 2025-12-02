import { useState } from 'react';
import { Globe, MagnifyingGlass, MapPin, User } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Icon } from '@/ui/icons';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxField,
  ComboboxInput,
  ComboboxItem,
  type ComboboxOption,
  ComboboxTrigger,
  ErrorMessage,
  Hint,
  InputLabel,
} from '@/ui/inputs';

/**
 * Combobox is an advanced form input that combines the functionality of a searchable
 * text input with a dropdown selection list. It allows users to either type to filter
 * through available options or select from a dropdown list of predefined choices.
 *
 * ## Dual API Approach
 *
 * This package provides two components:
 *
 * 1. **Combobox** (compound components) - For maximum flexibility and custom layouts
 * 2. **ComboboxField** (wrapper) - For convenience in standard forms
 *
 * ## Features
 *
 * - **Searchable input**: Users can type to filter through options
 * - **Size variants**: SM (32px), MD (40px), LG (48px)
 * - **Style variants**: Bordered (default), Borderless
 * - **Visual states**: Empty, Hover, Focus, Disabled, Error
 * - **Clear button**: Allows clearing the selected value
 * - **Keyboard navigation**: Arrow keys, Enter, Escape
 * - **Accessibility**: Full ARIA support, screen reader friendly
 *
 * ## When to Use Combobox vs Select
 *
 * Use **Combobox** when:
 * - You have a large list of options (10+)
 * - Users benefit from searching/filtering options
 * - Options are dynamic or loaded from a server
 *
 * Use **Select** when:
 * - You have a small list of options (< 10)
 * - All options should be visible at once
 * - No filtering is needed
 */
const meta = {
  title: 'Inputs/Combobox',
  component: ComboboxTrigger,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the combobox trigger',
      table: {
        defaultValue: { summary: 'lg' },
      },
    },
    variant: {
      control: 'select',
      options: ['bordered', 'borderless'],
      description: 'Style variant',
      table: {
        defaultValue: { summary: 'bordered' },
      },
    },
    showClear: {
      control: 'boolean',
      description: 'Whether to show the clear button when a value is selected',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    leftAddOn: {
      control: false,
      description: 'Content to render on the left side (prefix)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ComboboxTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample options for stories
const countries: ComboboxOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
];

const categories: ComboboxOption[] = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'books', label: 'Books' },
];

// Helper for filtering
const filterCountries = (options: ComboboxOption[], query: string) => {
  if (!query) return options;
  const lowerQuery = query.toLowerCase();
  return options.filter((opt) => opt.label.toLowerCase().includes(lowerQuery));
};

/**
 * Default Combobox with placeholder text.
 */
export const Default: Story = {
  args: {},
  render: function DefaultStory() {
    const [query, setQuery] = useState('');
    const filtered = filterCountries(countries, query);

    return (
      <div className="w-[320px]">
        <Combobox onQueryChange={setQuery}>
          <ComboboxTrigger>
            <ComboboxInput
              placeholder="Search countries..."
              options={countries}
              filteredOptions={filtered}
            />
          </ComboboxTrigger>
          <ComboboxContent>
            {filtered.length === 0 ? (
              <ComboboxEmpty>No countries found</ComboboxEmpty>
            ) : (
              filtered.map((country, index) => (
                <ComboboxItem
                  key={country.value}
                  value={country.value}
                  index={index}
                >
                  {country.label}
                </ComboboxItem>
              ))
            )}
          </ComboboxContent>
        </Combobox>
      </div>
    );
  },
};

/**
 * Comparison of all three size variants: SM, MD, and LG.
 */
export const Sizes: Story = {
  args: {},
  render: function SizesStory() {
    const [query, setQuery] = useState('');
    const filtered = filterCountries(countries, query);

    return (
      <div className="flex w-[320px] flex-col gap-6">
        <div>
          <p className="mb-2 text-xs text-text-tertiary">Small (sm) - 32px</p>
          <Combobox size="sm" onQueryChange={setQuery}>
            <ComboboxTrigger>
              <ComboboxInput
                placeholder="Small combobox"
                options={countries}
                filteredOptions={filtered}
              />
            </ComboboxTrigger>
            <ComboboxContent>
              {filtered.slice(0, 5).map((country, index) => (
                <ComboboxItem
                  key={country.value}
                  value={country.value}
                  index={index}
                >
                  {country.label}
                </ComboboxItem>
              ))}
            </ComboboxContent>
          </Combobox>
        </div>
        <div>
          <p className="mb-2 text-xs text-text-tertiary">Medium (md) - 40px</p>
          <Combobox size="md" onQueryChange={setQuery}>
            <ComboboxTrigger>
              <ComboboxInput
                placeholder="Medium combobox"
                options={countries}
                filteredOptions={filtered}
              />
            </ComboboxTrigger>
            <ComboboxContent>
              {filtered.slice(0, 5).map((country, index) => (
                <ComboboxItem
                  key={country.value}
                  value={country.value}
                  index={index}
                >
                  {country.label}
                </ComboboxItem>
              ))}
            </ComboboxContent>
          </Combobox>
        </div>
        <div>
          <p className="mb-2 text-xs text-text-tertiary">
            Large (lg) - 48px - Default
          </p>
          <Combobox size="lg" onQueryChange={setQuery}>
            <ComboboxTrigger>
              <ComboboxInput
                placeholder="Large combobox"
                options={countries}
                filteredOptions={filtered}
              />
            </ComboboxTrigger>
            <ComboboxContent>
              {filtered.slice(0, 5).map((country, index) => (
                <ComboboxItem
                  key={country.value}
                  value={country.value}
                  index={index}
                >
                  {country.label}
                </ComboboxItem>
              ))}
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
    );
  },
};

/**
 * Grid showing all visual states: Empty, Selected, Disabled, Error.
 */
export const AllStates: Story = {
  args: {},
  render: () => (
    <div className="grid w-[640px] grid-cols-2 gap-6">
      {/* Empty State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Empty (click for focus state)
        </p>
        <ComboboxField
          placeholder="Search countries..."
          options={countries.slice(0, 5)}
        />
      </div>

      {/* Selected State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Selected</p>
        <ComboboxField
          defaultValue="us"
          placeholder="Search countries..."
          options={countries.slice(0, 5)}
        />
      </div>

      {/* Disabled Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (empty)</p>
        <ComboboxField
          disabled
          placeholder="Disabled combobox"
          options={countries.slice(0, 5)}
        />
      </div>

      {/* Disabled Selected */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (selected)</p>
        <ComboboxField
          disabled
          defaultValue="ca"
          placeholder="Search countries..."
          options={countries.slice(0, 5)}
        />
      </div>

      {/* Error Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (empty)</p>
        <ComboboxField
          error
          placeholder="Search countries..."
          options={countries.slice(0, 5)}
        />
      </div>

      {/* Error Selected */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (selected)</p>
        <ComboboxField
          error
          defaultValue="mx"
          placeholder="Search countries..."
          options={countries.slice(0, 5)}
        />
      </div>
    </div>
  ),
};

/**
 * Combobox with left add-on slot for icons or text.
 */
export const WithLeftAddOn: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">With globe icon</p>
        <ComboboxField
          leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
          placeholder="Search countries..."
          options={countries}
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">With search icon</p>
        <ComboboxField
          leftAddOn={<Icon icon={MagnifyingGlass} size="sm" color="muted" />}
          placeholder="Search..."
          options={categories}
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">With text prefix</p>
        <ComboboxField
          leftAddOn={<span className="text-sm text-text-tertiary">Country:</span>}
          placeholder="Select country"
          options={countries}
        />
      </div>
    </div>
  ),
};

/**
 * Interactive demo of typing to filter options.
 */
export const Filtering: Story = {
  args: {},
  render: function FilteringStory() {
    const [value, setValue] = useState<string>('');
    const [query, setQuery] = useState('');

    return (
      <div className="w-[320px] space-y-4">
        <ComboboxField
          label="Country"
          hint={query ? `Filtering for: "${query}"` : 'Start typing to filter'}
          placeholder="Search countries..."
          options={countries}
          value={value}
          onValueChange={setValue}
          onQueryChange={setQuery}
        />
        <p className="text-sm text-text-secondary">Selected: {value || 'None'}</p>
      </div>
    );
  },
};

/**
 * Demonstrates both controlled and uncontrolled patterns.
 */
export const ControlledVsUncontrolled: Story = {
  args: {},
  render: function ControlledExample() {
    const [controlled, setControlled] = useState<string>('');

    return (
      <div className="flex w-[320px] flex-col gap-8">
        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Uncontrolled (uses defaultValue)
          </p>
          <ComboboxField
            label="Uncontrolled combobox"
            defaultValue="us"
            hint="Initial value is 'United States'"
            placeholder="Search countries..."
            options={countries}
          />
        </div>

        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Controlled (uses value + onValueChange)
          </p>
          <ComboboxField
            label="Controlled combobox"
            value={controlled}
            onValueChange={setControlled}
            placeholder="Search countries..."
            hint={`Current value: "${controlled || 'none'}"`}
            options={countries}
          />
        </div>
      </div>
    );
  },
};

/**
 * Combobox with many options demonstrating scroll behavior.
 */
export const WithManyOptions: Story = {
  args: {},
  render: () => {
    const manyOptions = Array.from({ length: 50 }, (_, i) => ({
      value: `option-${i + 1}`,
      label: `Option ${i + 1}`,
    }));

    return (
      <div className="w-[320px]">
        <ComboboxField
          label="Large list"
          hint="50 options with scroll - type to filter"
          placeholder="Search options..."
          options={manyOptions}
        />
      </div>
    );
  },
};

/**
 * Demonstrates manual composition with InputLabel, Hint, and ErrorMessage atoms.
 * This pattern provides maximum flexibility for custom layouts.
 */
export const ManualComposition: Story = {
  args: {},
  render: function ManualCompositionStory() {
    const [query, setQuery] = useState('');
    const filtered = filterCountries(countries, query);

    return (
      <div className="flex w-[320px] flex-col gap-8">
        {/* Basic with label */}
        <div>
          <p className="mb-3 text-xs text-text-tertiary">Basic composition</p>
          <InputLabel label="Country" htmlFor="country-basic" />
          <Combobox onQueryChange={setQuery}>
            <ComboboxTrigger>
              <ComboboxInput
                id="country-basic"
                placeholder="Search countries..."
                options={countries}
                filteredOptions={filtered}
              />
            </ComboboxTrigger>
            <ComboboxContent>
              {filtered.map((c, i) => (
                <ComboboxItem key={c.value} value={c.value} index={i}>
                  {c.label}
                </ComboboxItem>
              ))}
            </ComboboxContent>
          </Combobox>
        </div>

        {/* With hint */}
        <div>
          <p className="mb-3 text-xs text-text-tertiary">With hint</p>
          <InputLabel label="Country" htmlFor="country-hint" required />
          <Combobox onQueryChange={setQuery}>
            <ComboboxTrigger>
              <ComboboxInput
                id="country-hint"
                placeholder="Search countries..."
                options={countries}
                filteredOptions={filtered}
                aria-describedby="country-hint-text"
              />
            </ComboboxTrigger>
            <ComboboxContent>
              {filtered.map((c, i) => (
                <ComboboxItem key={c.value} value={c.value} index={i}>
                  {c.label}
                </ComboboxItem>
              ))}
            </ComboboxContent>
          </Combobox>
          <Hint id="country-hint-text">Start typing to filter</Hint>
        </div>

        {/* With error */}
        <div>
          <p className="mb-3 text-xs text-text-tertiary">With error</p>
          <InputLabel label="Country" htmlFor="country-error" required />
          <Combobox error onQueryChange={setQuery}>
            <ComboboxTrigger>
              <ComboboxInput
                id="country-error"
                placeholder="Search countries..."
                options={countries}
                filteredOptions={filtered}
                aria-invalid
                aria-describedby="country-error-text"
              />
            </ComboboxTrigger>
            <ComboboxContent>
              {filtered.map((c, i) => (
                <ComboboxItem key={c.value} value={c.value} index={i}>
                  {c.label}
                </ComboboxItem>
              ))}
            </ComboboxContent>
          </Combobox>
          <ErrorMessage id="country-error-text" text="Please select a country" />
        </div>
      </div>
    );
  },
};

// =============================================
// ComboboxField Stories (Convenience Wrapper)
// =============================================

/**
 * ComboboxField default example with label.
 */
export const FieldDefault: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <ComboboxField
        label="Country"
        placeholder="Search countries..."
        options={countries}
      />
    </div>
  ),
};

/**
 * ComboboxField with hint text.
 */
export const FieldWithHint: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <ComboboxField
        label="Country"
        hint="Start typing to filter the list"
        placeholder="Search countries..."
        options={countries}
      />
    </div>
  ),
};

/**
 * ComboboxField with error state. Notice how the error replaces the hint.
 */
export const FieldWithError: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <ComboboxField
        label="Country"
        hint="Start typing to filter"
        errorMessage="Please select a country"
        placeholder="Search countries..."
        options={countries}
      />
    </div>
  ),
};

/**
 * ComboboxField with all features: required indicator, help icon, and hint text.
 */
export const FieldFullFeatured: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <ComboboxField
        label="Category"
        labelProps={{
          required: true,
          showIcon: true,
          helpIconAriaLabel: 'Category selection help',
        }}
        hint="Type to search or select from the list"
        placeholder="Search categories..."
        options={categories}
        leftAddOn={<Icon icon={MapPin} size="sm" color="muted" />}
      />
    </div>
  ),
};

/**
 * Real-world form example using ComboboxField.
 */
export const FormIntegration: Story = {
  args: {},
  render: function FormExample() {
    const [country, setCountry] = useState<string>('');
    const [category, setCategory] = useState<string>('');

    return (
      <form className="w-[360px] space-y-5 rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold">Product Listing</h3>

        <ComboboxField
          label="Category"
          labelProps={{ required: true }}
          value={category}
          onValueChange={setCategory}
          placeholder="Search categories..."
          options={categories}
          leftAddOn={<Icon icon={MapPin} size="sm" color="muted" />}
        />

        <ComboboxField
          label="Country of Origin"
          labelProps={{ required: true }}
          hint="Where was this product made?"
          value={country}
          onValueChange={setCountry}
          placeholder="Search countries..."
          options={countries}
          leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
        />

        <ComboboxField
          label="Manufacturer"
          placeholder="Search manufacturers..."
          options={[
            { value: 'apple', label: 'Apple Inc.' },
            { value: 'samsung', label: 'Samsung Electronics' },
            { value: 'sony', label: 'Sony Corporation' },
            { value: 'lg', label: 'LG Electronics' },
            { value: 'microsoft', label: 'Microsoft Corporation' },
          ]}
        />

        <button
          type="submit"
          className="w-full rounded-sm bg-primary py-2.5 text-white hover:bg-primary-hover"
          onClick={(e) => e.preventDefault()}
        >
          Create Listing
        </button>
      </form>
    );
  },
};

/**
 * Comprehensive grid showing all size/state combinations.
 */
export const AllCombinations: Story = {
  args: {},
  render: () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-sm font-medium text-text-primary">
        All Size/State Combinations
      </div>

      {/* Size variants */}
      <div className="grid grid-cols-3 gap-6">
        {/* Small */}
        <div className="space-y-3">
          <p className="text-xs text-text-tertiary">Small (sm)</p>
          <ComboboxField
            size="sm"
            placeholder="Empty"
            options={countries.slice(0, 3)}
          />
          <ComboboxField
            size="sm"
            defaultValue="us"
            placeholder="Search..."
            options={countries.slice(0, 3)}
          />
          <ComboboxField
            size="sm"
            disabled
            placeholder="Disabled"
            options={countries.slice(0, 3)}
          />
          <ComboboxField
            size="sm"
            error
            placeholder="Error"
            options={countries.slice(0, 3)}
          />
        </div>

        {/* Medium */}
        <div className="space-y-3">
          <p className="text-xs text-text-tertiary">Medium (md)</p>
          <ComboboxField
            size="md"
            placeholder="Empty"
            options={countries.slice(0, 3)}
          />
          <ComboboxField
            size="md"
            defaultValue="ca"
            placeholder="Search..."
            options={countries.slice(0, 3)}
          />
          <ComboboxField
            size="md"
            disabled
            placeholder="Disabled"
            options={countries.slice(0, 3)}
          />
          <ComboboxField
            size="md"
            error
            placeholder="Error"
            options={countries.slice(0, 3)}
          />
        </div>

        {/* Large */}
        <div className="space-y-3">
          <p className="text-xs text-text-tertiary">Large (lg)</p>
          <ComboboxField
            size="lg"
            placeholder="Empty"
            options={countries.slice(0, 3)}
          />
          <ComboboxField
            size="lg"
            defaultValue="mx"
            placeholder="Search..."
            options={countries.slice(0, 3)}
          />
          <ComboboxField
            size="lg"
            disabled
            placeholder="Disabled"
            options={countries.slice(0, 3)}
          />
          <ComboboxField
            size="lg"
            error
            placeholder="Error"
            options={countries.slice(0, 3)}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Side-by-side comparison showing when to use Combobox vs Select.
 */
export const WhenToUseWhich: Story = {
  args: {},
  render: () => (
    <div className="grid w-[700px] grid-cols-2 gap-8">
      {/* Combobox side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">Combobox (Searchable)</h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for large lists (10+), dynamic/async options, or when filtering is
          needed
        </p>

        <div className="space-y-4">
          <ComboboxField
            label="Country (12 options)"
            hint="Type to filter the long list"
            placeholder="Search countries..."
            options={countries}
            leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
          />

          <ComboboxField
            label="User"
            hint="Search users from database"
            placeholder="Search users..."
            options={[
              { value: '1', label: 'John Smith' },
              { value: '2', label: 'Jane Doe' },
              { value: '3', label: 'Bob Johnson' },
              { value: '4', label: 'Alice Williams' },
              { value: '5', label: 'Charlie Brown' },
            ]}
            leftAddOn={<Icon icon={User} size="sm" color="muted" />}
          />
        </div>
      </div>

      {/* Info side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">Key Differences</h3>
        <div className="space-y-3 text-sm text-text-secondary">
          <div>
            <strong className="text-text-primary">Combobox:</strong>
            <ul className="mt-1 ml-4 list-disc space-y-1 text-xs">
              <li>Text input for filtering</li>
              <li>Clear button to reset</li>
              <li>Best for 10+ options</li>
              <li>Supports async loading</li>
              <li>Users can type to search</li>
            </ul>
          </div>
          <div>
            <strong className="text-text-primary">Select:</strong>
            <ul className="mt-1 ml-4 list-disc space-y-1 text-xs">
              <li>Click to open dropdown</li>
              <li>Shows all options at once</li>
              <li>Best for &lt;10 options</li>
              <li>Supports option groups</li>
              <li>No filtering needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Demonstrating server-side filtering pattern with loading state.
 * In a real app, you would debounce the query and fetch from an API.
 */
export const AsyncLoading: Story = {
  args: {},
  render: function AsyncLoadingStory() {
    const [_query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<ComboboxOption[]>(countries);

    // Simulate async search
    const handleQueryChange = (newQuery: string) => {
      setQuery(newQuery);
      setLoading(true);

      // Simulate API delay
      setTimeout(() => {
        const filtered = countries.filter((c) =>
          c.label.toLowerCase().includes(newQuery.toLowerCase())
        );
        setResults(filtered);
        setLoading(false);
      }, 500);
    };

    return (
      <div className="w-[320px] space-y-4">
        <p className="text-sm text-text-secondary">
          This demonstrates async filtering. In production, debounce the query and
          fetch from your API.
        </p>

        <div>
          <InputLabel label="Country (Async)" htmlFor="async-combobox" />
          <Combobox onQueryChange={handleQueryChange}>
            <ComboboxTrigger>
              <ComboboxInput
                id="async-combobox"
                placeholder="Search countries..."
                options={countries}
                filteredOptions={results}
              />
            </ComboboxTrigger>
            <ComboboxContent>
              {loading ? (
                <div className="py-3 text-center text-sm text-text-tertiary">
                  Loading...
                </div>
              ) : results.length === 0 ? (
                <ComboboxEmpty>No countries found</ComboboxEmpty>
              ) : (
                results.map((c, i) => (
                  <ComboboxItem key={c.value} value={c.value} index={i}>
                    {c.label}
                  </ComboboxItem>
                ))
              )}
            </ComboboxContent>
          </Combobox>
          <Hint>{loading ? 'Searching...' : `${results.length} results`}</Hint>
        </div>

        <div className="rounded bg-background-secondary p-3 text-xs">
          <strong>Implementation notes:</strong>
          <ul className="mt-1 list-inside list-disc space-y-1 text-text-secondary">
            <li>Debounce query changes (300-500ms)</li>
            <li>Show loading indicator during fetch</li>
            <li>Cache results to reduce API calls</li>
            <li>Handle errors gracefully</li>
          </ul>
        </div>
      </div>
    );
  },
};

/**
 * ComboboxField showing all three sizes with their label mappings.
 */
export const FieldAllSizes: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-8">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Small (sm) - Label: sm, Hint: sm
        </p>
        <ComboboxField
          size="sm"
          label="Small field"
          labelProps={{ required: true }}
          hint="Small hint text"
          placeholder="Search..."
          options={countries.slice(0, 3)}
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Medium (md) - Label: sm, Hint: sm
        </p>
        <ComboboxField
          size="md"
          label="Medium field"
          labelProps={{ required: true }}
          hint="Medium hint text"
          placeholder="Search..."
          options={countries.slice(0, 3)}
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Large (lg) - Label: md, Hint: md
        </p>
        <ComboboxField
          size="lg"
          label="Large field"
          labelProps={{ required: true }}
          hint="Large hint text"
          placeholder="Search..."
          options={countries.slice(0, 3)}
        />
      </div>
    </div>
  ),
};
