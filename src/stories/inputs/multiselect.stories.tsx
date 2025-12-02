import { useState } from 'react';
import { Globe, MapPin, Tag, Users } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Icon } from '@/ui/icons';
import {
  ErrorMessage,
  Hint,
  InputLabel,
  Multiselect,
  MultiselectField,
  type MultiselectOption,
  MultiselectOptionItem,
  MultiselectOptions,
  MultiselectPopoverContent,
  MultiselectSearch,
  MultiselectTrigger,
  MultiselectValue,
} from '@/ui/inputs';

/**
 * Multiselect is a form input component that allows users to select multiple options
 * from a dropdown list. Selected values are displayed as removable tags.
 *
 * ## Dual API Approach
 *
 * This package provides two components:
 *
 * 1. **Multiselect** (compound components) - For maximum flexibility and custom layouts
 * 2. **MultiselectField** (wrapper) - For convenience in standard forms
 *
 * ## Features
 *
 * - **Size variants**: SM (32px), MD (40px), LG (48px)
 * - **Style variants**: Bordered (default), Borderless
 * - **Visual states**: Empty, Selected, Hover, Focus, Disabled, Error
 * - **Search filtering**: Built-in search to filter options
 * - **Keyboard navigation**: Tab, Enter, Space, Escape support
 * - **Accessibility**: Full ARIA support, screen reader friendly
 *
 * ## When to Use Multiselect vs MultiselectField
 *
 * Use **Multiselect** (compound components) when:
 * - You need custom dropdown content or option rendering
 * - You want fine-grained control over composition
 * - You're building a non-standard multiselect UI
 *
 * Use **MultiselectField** when:
 * - You have a standard form field with label, hint, and/or error
 * - You want automatic ID generation and ARIA associations
 * - You have a simple list of options
 */
const meta = {
  title: 'Inputs/Multiselect',
  component: MultiselectTrigger,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the multiselect trigger',
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
    error: {
      control: 'boolean',
      description: 'Error state - applies destructive border styling',
      table: {
        defaultValue: { summary: 'false' },
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
} satisfies Meta<typeof MultiselectTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample options for stories
const countries: MultiselectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
];

const categories: MultiselectOption[] = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'books', label: 'Books' },
];

const skills: MultiselectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'aws', label: 'AWS' },
  { value: 'docker', label: 'Docker' },
];

/**
 * Default Multiselect with placeholder text.
 */
export const Default: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <Multiselect options={countries}>
        <MultiselectTrigger>
          <MultiselectValue placeholder="Select countries" />
        </MultiselectTrigger>
        <MultiselectPopoverContent>
          <MultiselectSearch placeholder="Search countries..." />
          <MultiselectOptions />
        </MultiselectPopoverContent>
      </Multiselect>
    </div>
  ),
};

/**
 * Comparison of all three size variants: SM, MD, and LG.
 */
export const Sizes: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Small (sm) - 32px</p>
        <Multiselect size="sm" options={countries.slice(0, 4)}>
          <MultiselectTrigger>
            <MultiselectValue placeholder="Small multiselect" />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Medium (md) - 40px</p>
        <Multiselect size="md" options={countries.slice(0, 4)}>
          <MultiselectTrigger>
            <MultiselectValue placeholder="Medium multiselect" />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Large (lg) - 48px - Default
        </p>
        <Multiselect size="lg" options={countries.slice(0, 4)}>
          <MultiselectTrigger>
            <MultiselectValue placeholder="Large multiselect" />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>
    </div>
  ),
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
        <p className="mb-2 text-xs text-text-tertiary">Empty</p>
        <Multiselect options={countries.slice(0, 4)}>
          <MultiselectTrigger>
            <MultiselectValue placeholder="Select options..." />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>

      {/* Selected State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Selected</p>
        <Multiselect options={countries} defaultValue={['us', 'ca']}>
          <MultiselectTrigger>
            <MultiselectValue placeholder="Select options..." />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>

      {/* Disabled Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (empty)</p>
        <Multiselect options={countries.slice(0, 4)} disabled>
          <MultiselectTrigger>
            <MultiselectValue placeholder="Disabled multiselect" />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>

      {/* Disabled Selected */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (selected)</p>
        <Multiselect
          options={countries}
          defaultValue={['us', 'ca', 'mx']}
          disabled
        >
          <MultiselectTrigger>
            <MultiselectValue placeholder="Select options..." />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>

      {/* Error Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (empty)</p>
        <Multiselect options={countries.slice(0, 4)}>
          <MultiselectTrigger error>
            <MultiselectValue placeholder="Select options..." />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>

      {/* Error Selected */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (selected)</p>
        <Multiselect options={countries} defaultValue={['us']}>
          <MultiselectTrigger error>
            <MultiselectValue placeholder="Select options..." />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>
    </div>
  ),
};

/**
 * Demonstrates the search filtering functionality.
 */
export const WithSearch: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <p className="mb-4 text-sm text-text-secondary">
        Click to open and type to filter options
      </p>
      <Multiselect options={countries}>
        <MultiselectTrigger>
          <MultiselectValue placeholder="Search and select countries" />
        </MultiselectTrigger>
        <MultiselectPopoverContent>
          <MultiselectSearch placeholder="Type to search..." />
          <MultiselectOptions emptyText="No countries match your search" />
        </MultiselectPopoverContent>
      </Multiselect>
    </div>
  ),
};

/**
 * Multiselect with many options demonstrating scroll behavior.
 */
export const WithManyOptions: Story = {
  args: {},
  render: () => {
    const manyOptions: MultiselectOption[] = Array.from(
      { length: 50 },
      (_, i) => ({
        value: `option-${i + 1}`,
        label: `Option ${i + 1}`,
      })
    );

    return (
      <div className="w-[320px]">
        <MultiselectField
          label="Large list"
          hint="50 options with scroll"
          placeholder="Select options"
          options={manyOptions}
        />
      </div>
    );
  },
};

/**
 * Borderless style variant - minimal style without border.
 */
export const BorderlessVariant: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Borderless (empty)</p>
        <Multiselect options={countries.slice(0, 4)}>
          <MultiselectTrigger variant="borderless">
            <MultiselectValue placeholder="Select options..." />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Borderless (selected)</p>
        <Multiselect options={countries} defaultValue={['us', 'ca']}>
          <MultiselectTrigger variant="borderless">
            <MultiselectValue placeholder="Select options..." />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>
    </div>
  ),
};

/**
 * Multiselect with left add-on slot for icons or text.
 */
export const WithLeftAddOn: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">With globe icon</p>
        <Multiselect options={countries}>
          <MultiselectTrigger
            leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
          >
            <MultiselectValue placeholder="Select countries" />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">With tag icon</p>
        <Multiselect options={skills}>
          <MultiselectTrigger
            leftAddOn={<Icon icon={Tag} size="sm" color="muted" />}
          >
            <MultiselectValue placeholder="Select skills" />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>
    </div>
  ),
};

/**
 * Demonstrates manual composition with InputLabel, Hint, and ErrorMessage atoms.
 */
export const ManualComposition: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-8">
      {/* Basic with label */}
      <div>
        <p className="mb-3 text-xs text-text-tertiary">Basic composition</p>
        <InputLabel label="Countries" htmlFor="countries-basic" />
        <Multiselect options={countries}>
          <MultiselectTrigger id="countries-basic">
            <MultiselectValue placeholder="Select countries" />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>

      {/* With hint */}
      <div>
        <p className="mb-3 text-xs text-text-tertiary">With hint</p>
        <InputLabel label="Countries" htmlFor="countries-hint" required />
        <Multiselect options={countries}>
          <MultiselectTrigger
            id="countries-hint"
            aria-describedby="countries-hint-text"
          >
            <MultiselectValue placeholder="Select countries" />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
        <Hint id="countries-hint-text">Select all applicable countries</Hint>
      </div>

      {/* With error */}
      <div>
        <p className="mb-3 text-xs text-text-tertiary">With error</p>
        <InputLabel label="Countries" htmlFor="countries-error" required />
        <Multiselect options={countries}>
          <MultiselectTrigger
            id="countries-error"
            error
            aria-invalid
            aria-describedby="countries-error-text"
          >
            <MultiselectValue placeholder="Select countries" />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
        <ErrorMessage
          id="countries-error-text"
          text="Please select at least one country"
        />
      </div>
    </div>
  ),
};

// =============================================
// MultiselectField Stories (Convenience Wrapper)
// =============================================

/**
 * MultiselectField default example with label.
 */
export const FieldDefault: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <MultiselectField
        label="Countries"
        placeholder="Select countries"
        options={countries}
      />
    </div>
  ),
};

/**
 * MultiselectField with hint text.
 */
export const FieldWithHint: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <MultiselectField
        label="Countries"
        hint="Select all countries where you operate"
        placeholder="Select countries"
        options={countries}
      />
    </div>
  ),
};

/**
 * MultiselectField with error state. Notice how the error replaces the hint.
 */
export const FieldWithError: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <MultiselectField
        label="Countries"
        hint="Select at least one country"
        error="Please select at least one country"
        placeholder="Select countries"
        options={countries}
      />
    </div>
  ),
};

/**
 * MultiselectField with all features: required indicator, help icon, and hint.
 */
export const FieldFullFeatured: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <MultiselectField
        label="Skills"
        labelProps={{
          required: true,
          showIcon: true,
          helpIconAriaLabel: 'Skills selection help',
        }}
        hint="Choose all skills that apply to this role"
        placeholder="Select skills"
        options={skills}
        leftAddOn={<Icon icon={Tag} size="sm" color="muted" />}
      />
    </div>
  ),
};

/**
 * MultiselectField showing all three sizes and how they map to InputLabel sizes.
 */
export const FieldAllSizes: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-8">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Small (sm) - Label: sm, Hint: sm
        </p>
        <MultiselectField
          size="sm"
          label="Small field"
          labelProps={{ required: true }}
          hint="Small hint text"
          placeholder="Small multiselect"
          options={countries.slice(0, 4)}
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Medium (md) - Label: sm, Hint: sm
        </p>
        <MultiselectField
          size="md"
          label="Medium field"
          labelProps={{ required: true }}
          hint="Medium hint text"
          placeholder="Medium multiselect"
          options={countries.slice(0, 4)}
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Large (lg) - Label: md, Hint: md
        </p>
        <MultiselectField
          size="lg"
          label="Large field"
          labelProps={{ required: true }}
          hint="Large hint text"
          placeholder="Large multiselect"
          options={countries.slice(0, 4)}
        />
      </div>
    </div>
  ),
};

/**
 * Demonstrates both controlled and uncontrolled patterns.
 */
export const ControlledVsUncontrolled: Story = {
  args: {},
  render: function ControlledExample() {
    const [controlled, setControlled] = useState<string[]>([]);

    return (
      <div className="flex w-[320px] flex-col gap-8">
        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Uncontrolled (uses defaultValue)
          </p>
          <MultiselectField
            label="Uncontrolled multiselect"
            defaultValue={['us', 'ca']}
            hint="Initial values are US and Canada"
            placeholder="Select countries"
            options={countries}
          />
        </div>

        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Controlled (uses value + onValueChange)
          </p>
          <MultiselectField
            label="Controlled multiselect"
            value={controlled}
            onValueChange={setControlled}
            placeholder="Select countries..."
            hint={`Selected: ${controlled.length === 0 ? 'none' : controlled.join(', ')}`}
            options={countries}
          />
        </div>
      </div>
    );
  },
};

/**
 * Demonstrates different display modes for selected values.
 */
export const ValueDisplayModes: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Tags mode (default) - maxDisplayTags: 3
        </p>
        <Multiselect
          options={countries}
          defaultValue={['us', 'ca', 'mx', 'uk', 'de']}
        >
          <MultiselectTrigger>
            <MultiselectValue placeholder="Select countries" maxDisplayTags={3} />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Tags mode - maxDisplayTags: 1
        </p>
        <Multiselect options={countries} defaultValue={['us', 'ca', 'mx']}>
          <MultiselectTrigger>
            <MultiselectValue placeholder="Select countries" maxDisplayTags={1} />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Count mode - shows &quot;N selected&quot;
        </p>
        <Multiselect
          options={countries}
          defaultValue={['us', 'ca', 'mx', 'uk', 'de']}
        >
          <MultiselectTrigger>
            <MultiselectValue
              placeholder="Select countries"
              displayMode="count"
            />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectSearch />
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      </div>
    </div>
  ),
};

/**
 * Multiselect with disabled options.
 */
export const WithDisabledOptions: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <MultiselectField
        label="Subscription regions"
        placeholder="Select regions"
        options={[
          { value: 'na', label: 'North America' },
          { value: 'eu', label: 'Europe' },
          { value: 'apac', label: 'Asia Pacific (Coming Soon)', disabled: true },
          {
            value: 'latam',
            label: 'Latin America (Coming Soon)',
            disabled: true,
          },
        ]}
      />
    </div>
  ),
};

/**
 * Custom option rendering example.
 */
export const CustomRenderOption: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <Multiselect options={countries}>
        <MultiselectTrigger>
          <MultiselectValue placeholder="Select countries" />
        </MultiselectTrigger>
        <MultiselectPopoverContent>
          <MultiselectSearch />
          <MultiselectOptions
            renderOption={(option, isSelected) => (
              <div
                className={`flex items-center gap-3 px-4 py-3 ${
                  isSelected ? 'bg-info-50' : ''
                }`}
              >
                <span className="text-lg">
                  {option.value === 'us' && '\u{1F1FA}\u{1F1F8}'}
                  {option.value === 'ca' && '\u{1F1E8}\u{1F1E6}'}
                  {option.value === 'mx' && '\u{1F1F2}\u{1F1FD}'}
                  {option.value === 'uk' && '\u{1F1EC}\u{1F1E7}'}
                  {option.value === 'de' && '\u{1F1E9}\u{1F1EA}'}
                  {option.value === 'fr' && '\u{1F1EB}\u{1F1F7}'}
                  {option.value === 'jp' && '\u{1F1EF}\u{1F1F5}'}
                  {option.value === 'au' && '\u{1F1E6}\u{1F1FA}'}
                </span>
                <span>{option.label}</span>
                {isSelected && (
                  <span className="text-info-500 ml-auto">\u{2713}</span>
                )}
              </div>
            )}
          />
        </MultiselectPopoverContent>
      </Multiselect>
    </div>
  ),
};

/**
 * Using MultiselectOptionItem for custom dropdown content.
 */
export const WithCustomItems: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <Multiselect options={[]}>
        <MultiselectTrigger>
          <MultiselectValue placeholder="Select team members" />
        </MultiselectTrigger>
        <MultiselectPopoverContent>
          <MultiselectSearch />
          <MultiselectOptions>
            <MultiselectOptionItem value="john">
              John Doe (Admin)
            </MultiselectOptionItem>
            <MultiselectOptionItem value="jane">
              Jane Smith (Editor)
            </MultiselectOptionItem>
            <MultiselectOptionItem value="bob" disabled>
              Bob Wilson (Inactive)
            </MultiselectOptionItem>
            <MultiselectOptionItem value="alice">
              Alice Brown (Viewer)
            </MultiselectOptionItem>
          </MultiselectOptions>
        </MultiselectPopoverContent>
      </Multiselect>
    </div>
  ),
};

// =============================================
// Real-World Examples
// =============================================

/**
 * Real-world form example using MultiselectField.
 */
export const FormIntegration: Story = {
  args: {},
  render: function FormExample() {
    const [skills, setSkills] = useState<string[]>([]);
    const [regions, setRegions] = useState<string[]>([]);

    const allSkills: MultiselectOption[] = [
      { value: 'react', label: 'React' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'nextjs', label: 'Next.js' },
      { value: 'nodejs', label: 'Node.js' },
      { value: 'python', label: 'Python' },
      { value: 'graphql', label: 'GraphQL' },
    ];

    const allRegions: MultiselectOption[] = [
      { value: 'na', label: 'North America' },
      { value: 'eu', label: 'Europe' },
      { value: 'apac', label: 'Asia Pacific' },
      { value: 'latam', label: 'Latin America' },
    ];

    return (
      <form className="w-[360px] space-y-5 rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold">Job Posting</h3>

        <MultiselectField
          label="Required Skills"
          labelProps={{ required: true }}
          value={skills}
          onValueChange={setSkills}
          placeholder="Select required skills"
          options={allSkills}
          leftAddOn={<Icon icon={Tag} size="sm" color="muted" />}
          hint="Choose all skills required for this position"
        />

        <MultiselectField
          label="Target Regions"
          labelProps={{ required: true }}
          hint="Where should this job be posted?"
          value={regions}
          onValueChange={setRegions}
          placeholder="Select regions"
          options={allRegions}
          leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
        />

        <MultiselectField
          label="Team Members"
          placeholder="Assign team members"
          options={[
            { value: 'john', label: 'John Doe' },
            { value: 'jane', label: 'Jane Smith' },
            { value: 'bob', label: 'Bob Wilson' },
          ]}
          leftAddOn={<Icon icon={Users} size="sm" color="muted" />}
        />

        <button
          type="submit"
          className="w-full rounded-sm bg-primary py-2.5 text-white hover:bg-primary-hover"
          onClick={(e) => e.preventDefault()}
        >
          Create Job Posting
        </button>
      </form>
    );
  },
};

/**
 * User preferences settings example.
 */
export const UserPreferencesExample: Story = {
  args: {},
  render: () => (
    <div className="w-[360px] space-y-5 rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold">Notification Preferences</h3>

      <MultiselectField
        label="Email Notifications"
        placeholder="Select notification types"
        defaultValue={['marketing', 'product']}
        options={[
          { value: 'marketing', label: 'Marketing updates' },
          { value: 'product', label: 'Product announcements' },
          { value: 'security', label: 'Security alerts' },
          { value: 'billing', label: 'Billing notifications' },
          { value: 'tips', label: 'Tips & tutorials' },
        ]}
      />

      <MultiselectField
        label="Interests"
        hint="Help us personalize your experience"
        placeholder="Select your interests"
        options={[
          { value: 'tech', label: 'Technology' },
          { value: 'design', label: 'Design' },
          { value: 'business', label: 'Business' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'startup', label: 'Startups' },
        ]}
        leftAddOn={<Icon icon={MapPin} size="sm" color="muted" />}
      />

      <MultiselectField
        label="Languages"
        placeholder="Select preferred languages"
        defaultValue={['en']}
        options={[
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Espa\u00f1ol' },
          { value: 'fr', label: 'Fran\u00e7ais' },
          { value: 'de', label: 'Deutsch' },
          { value: 'pt', label: 'Portugu\u00eas' },
          { value: 'ja', label: '\u65e5\u672c\u8a9e' },
        ]}
        leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
      />
    </div>
  ),
};

/**
 * Comprehensive grid showing all size/variant combinations.
 */
export const AllCombinations: Story = {
  args: {},
  render: () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-sm font-medium text-text-primary">
        All Size/Variant Combinations
      </div>

      {/* Bordered variants */}
      <div>
        <p className="mb-4 text-xs font-medium text-text-tertiary">Bordered</p>
        <div className="grid grid-cols-3 gap-6">
          {/* Small */}
          <div className="space-y-3">
            <p className="text-xs text-text-tertiary">Small (sm)</p>
            <Multiselect size="sm" options={countries.slice(0, 3)}>
              <MultiselectTrigger>
                <MultiselectValue placeholder="Empty" />
              </MultiselectTrigger>
              <MultiselectPopoverContent>
                <MultiselectOptions />
              </MultiselectPopoverContent>
            </Multiselect>
            <Multiselect
              size="sm"
              options={countries}
              defaultValue={['us', 'ca']}
            >
              <MultiselectTrigger>
                <MultiselectValue placeholder="Empty" />
              </MultiselectTrigger>
              <MultiselectPopoverContent>
                <MultiselectOptions />
              </MultiselectPopoverContent>
            </Multiselect>
            <Multiselect size="sm" options={countries.slice(0, 3)} disabled>
              <MultiselectTrigger>
                <MultiselectValue placeholder="Disabled" />
              </MultiselectTrigger>
              <MultiselectPopoverContent>
                <MultiselectOptions />
              </MultiselectPopoverContent>
            </Multiselect>
            <Multiselect size="sm" options={countries.slice(0, 3)}>
              <MultiselectTrigger error>
                <MultiselectValue placeholder="Error" />
              </MultiselectTrigger>
              <MultiselectPopoverContent>
                <MultiselectOptions />
              </MultiselectPopoverContent>
            </Multiselect>
          </div>

          {/* Medium */}
          <div className="space-y-3">
            <p className="text-xs text-text-tertiary">Medium (md)</p>
            <Multiselect size="md" options={countries.slice(0, 3)}>
              <MultiselectTrigger>
                <MultiselectValue placeholder="Empty" />
              </MultiselectTrigger>
              <MultiselectPopoverContent>
                <MultiselectOptions />
              </MultiselectPopoverContent>
            </Multiselect>
            <Multiselect
              size="md"
              options={countries}
              defaultValue={['us', 'ca']}
            >
              <MultiselectTrigger>
                <MultiselectValue placeholder="Empty" />
              </MultiselectTrigger>
              <MultiselectPopoverContent>
                <MultiselectOptions />
              </MultiselectPopoverContent>
            </Multiselect>
            <Multiselect size="md" options={countries.slice(0, 3)} disabled>
              <MultiselectTrigger>
                <MultiselectValue placeholder="Disabled" />
              </MultiselectTrigger>
              <MultiselectPopoverContent>
                <MultiselectOptions />
              </MultiselectPopoverContent>
            </Multiselect>
            <Multiselect size="md" options={countries.slice(0, 3)}>
              <MultiselectTrigger error>
                <MultiselectValue placeholder="Error" />
              </MultiselectTrigger>
              <MultiselectPopoverContent>
                <MultiselectOptions />
              </MultiselectPopoverContent>
            </Multiselect>
          </div>

          {/* Large */}
          <div className="space-y-3">
            <p className="text-xs text-text-tertiary">Large (lg)</p>
            <Multiselect size="lg" options={countries.slice(0, 3)}>
              <MultiselectTrigger>
                <MultiselectValue placeholder="Empty" />
              </MultiselectTrigger>
              <MultiselectPopoverContent>
                <MultiselectOptions />
              </MultiselectPopoverContent>
            </Multiselect>
            <Multiselect
              size="lg"
              options={countries}
              defaultValue={['us', 'ca']}
            >
              <MultiselectTrigger>
                <MultiselectValue placeholder="Empty" />
              </MultiselectTrigger>
              <MultiselectPopoverContent>
                <MultiselectOptions />
              </MultiselectPopoverContent>
            </Multiselect>
            <Multiselect size="lg" options={countries.slice(0, 3)} disabled>
              <MultiselectTrigger>
                <MultiselectValue placeholder="Disabled" />
              </MultiselectTrigger>
              <MultiselectPopoverContent>
                <MultiselectOptions />
              </MultiselectPopoverContent>
            </Multiselect>
            <Multiselect size="lg" options={countries.slice(0, 3)}>
              <MultiselectTrigger error>
                <MultiselectValue placeholder="Error" />
              </MultiselectTrigger>
              <MultiselectPopoverContent>
                <MultiselectOptions />
              </MultiselectPopoverContent>
            </Multiselect>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Side-by-side comparison showing when to use Multiselect vs MultiselectField.
 */
export const WhenToUseWhich: Story = {
  args: {},
  render: () => (
    <div className="grid w-[700px] grid-cols-2 gap-8">
      {/* Multiselect (compound components) side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">
          Multiselect (Compound Components)
        </h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for custom layouts, custom options, or complex dropdowns
        </p>

        <div className="space-y-4">
          {/* Custom options */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">
              Custom option rendering
            </p>
            <Multiselect options={countries.slice(0, 4)}>
              <MultiselectTrigger>
                <MultiselectValue placeholder="Select countries" />
              </MultiselectTrigger>
              <MultiselectPopoverContent>
                <MultiselectOptions
                  renderOption={(opt, isSelected) => (
                    <div className="flex items-center gap-2 px-3 py-2">
                      <span>{isSelected ? '\u{2705}' : '\u{2B1C}'}</span>
                      <span>{opt.label}</span>
                    </div>
                  )}
                />
              </MultiselectPopoverContent>
            </Multiselect>
          </div>

          {/* Custom label layout */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">Custom label layout</p>
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm font-medium">Tags</span>
              <a
                href="#"
                className="text-xs text-primary"
                onClick={(e) => e.preventDefault()}
              >
                Manage tags
              </a>
            </div>
            <Multiselect options={skills.slice(0, 5)}>
              <MultiselectTrigger>
                <MultiselectValue placeholder="Select tags" />
              </MultiselectTrigger>
              <MultiselectPopoverContent>
                <MultiselectSearch />
                <MultiselectOptions />
              </MultiselectPopoverContent>
            </Multiselect>
          </div>
        </div>
      </div>

      {/* MultiselectField side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">MultiselectField (Wrapper)</h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for standard form fields with labels
        </p>

        <div className="space-y-4">
          {/* Standard field */}
          <MultiselectField
            label="Countries"
            labelProps={{ required: true }}
            hint="Select all applicable"
            placeholder="Select countries"
            options={countries.slice(0, 4)}
          />

          {/* Field with error */}
          <MultiselectField
            label="Categories"
            labelProps={{ required: true }}
            error="Please select at least one category"
            placeholder="Select categories"
            options={categories.slice(0, 4)}
          />
        </div>
      </div>
    </div>
  ),
};
