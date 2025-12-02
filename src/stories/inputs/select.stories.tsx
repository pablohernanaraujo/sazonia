import { useState } from 'react';
import { Globe, MapPin, User } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Icon } from '@/ui/icons';
import {
  ErrorMessage,
  Hint,
  InputLabel,
  Select,
  SelectContent,
  SelectField,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/ui/inputs';

/**
 * Select is a form input component that allows users to choose a single option
 * from a dropdown list of predefined options.
 *
 * ## Dual API Approach
 *
 * This package provides two components:
 *
 * 1. **Select** (compound components) - For maximum flexibility and custom layouts
 * 2. **SelectField** (wrapper) - For convenience in standard forms
 *
 * ## Features
 *
 * - **Size variants**: SM (32px), MD (40px), LG (48px)
 * - **Style variants**: Bordered (default), Borderless
 * - **Visual states**: Empty, Hover, Focus, Disabled, Error
 * - **Keyboard navigation**: Arrow keys, Enter, Escape, type-ahead search
 * - **Accessibility**: Full ARIA support, screen reader friendly
 *
 * ## When to Use Select vs SelectField
 *
 * Use **Select** (compound components) when:
 * - You need custom dropdown content (groups, separators, custom items)
 * - You want fine-grained control over composition
 * - You're building a non-standard select UI
 *
 * Use **SelectField** when:
 * - You have a standard form field with label, hint, and/or error
 * - You want automatic ID generation and ARIA associations
 * - You have a simple list of options
 */
const meta = {
  title: 'Inputs/Select',
  component: SelectTrigger,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the select trigger',
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
} satisfies Meta<typeof SelectTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample options for stories
const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
];

const categories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'books', label: 'Books' },
];

/**
 * Default Select with placeholder text.
 */
export const Default: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.value} value={country.value}>
              {country.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
        <Select size="sm">
          <SelectTrigger>
            <SelectValue placeholder="Small select" />
          </SelectTrigger>
          <SelectContent>
            {countries.slice(0, 3).map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Medium (md) - 40px</p>
        <Select size="md">
          <SelectTrigger>
            <SelectValue placeholder="Medium select" />
          </SelectTrigger>
          <SelectContent>
            {countries.slice(0, 3).map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Large (lg) - 48px - Default
        </p>
        <Select size="lg">
          <SelectTrigger>
            <SelectValue placeholder="Large select" />
          </SelectTrigger>
          <SelectContent>
            {countries.slice(0, 3).map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

/**
 * Grid showing all visual states: Empty, Focused (click), Disabled, Error.
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
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option..." />
          </SelectTrigger>
          <SelectContent>
            {countries.slice(0, 3).map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selected State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Selected</p>
        <Select defaultValue="us">
          <SelectTrigger>
            <SelectValue placeholder="Select option..." />
          </SelectTrigger>
          <SelectContent>
            {countries.slice(0, 3).map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Disabled Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (empty)</p>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Disabled select" />
          </SelectTrigger>
          <SelectContent>
            {countries.slice(0, 3).map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Disabled Selected */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (selected)</p>
        <Select disabled defaultValue="ca">
          <SelectTrigger>
            <SelectValue placeholder="Select option..." />
          </SelectTrigger>
          <SelectContent>
            {countries.slice(0, 3).map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Error Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (empty)</p>
        <Select>
          <SelectTrigger error>
            <SelectValue placeholder="Select option..." />
          </SelectTrigger>
          <SelectContent>
            {countries.slice(0, 3).map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Error Selected */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (selected)</p>
        <Select defaultValue="mx">
          <SelectTrigger error>
            <SelectValue placeholder="Select option..." />
          </SelectTrigger>
          <SelectContent>
            {countries.slice(0, 3).map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
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
        <Select>
          <SelectTrigger variant="borderless">
            <SelectValue placeholder="Select option..." />
          </SelectTrigger>
          <SelectContent>
            {countries.slice(0, 3).map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Borderless (selected)</p>
        <Select defaultValue="us">
          <SelectTrigger variant="borderless">
            <SelectValue placeholder="Select option..." />
          </SelectTrigger>
          <SelectContent>
            {countries.slice(0, 3).map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

/**
 * Select with left add-on slot for icons or text.
 */
export const WithLeftAddOn: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">With globe icon</p>
        <Select>
          <SelectTrigger
            leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
          >
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">With text prefix</p>
        <Select>
          <SelectTrigger
            leftAddOn={
              <span className="text-sm text-text-tertiary">Region:</span>
            }
          >
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="na">North America</SelectItem>
            <SelectItem value="eu">Europe</SelectItem>
            <SelectItem value="ap">Asia Pacific</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

/**
 * Demonstrates manual composition with InputLabel, Hint, and ErrorMessage atoms.
 * This pattern provides maximum flexibility for custom layouts.
 */
export const ManualComposition: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-8">
      {/* Basic with label */}
      <div>
        <p className="mb-3 text-xs text-text-tertiary">Basic composition</p>
        <InputLabel label="Country" htmlFor="country-basic" />
        <Select>
          <SelectTrigger id="country-basic">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* With hint */}
      <div>
        <p className="mb-3 text-xs text-text-tertiary">With hint</p>
        <InputLabel label="Country" htmlFor="country-hint" required />
        <Select>
          <SelectTrigger id="country-hint" aria-describedby="country-hint-text">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Hint id="country-hint-text">We&apos;ll use this for shipping</Hint>
      </div>

      {/* With error */}
      <div>
        <p className="mb-3 text-xs text-text-tertiary">With error</p>
        <InputLabel label="Country" htmlFor="country-error" required />
        <Select>
          <SelectTrigger
            id="country-error"
            error
            aria-invalid
            aria-describedby="country-error-text"
          >
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ErrorMessage id="country-error-text" text="Please select a country" />
      </div>
    </div>
  ),
};

// =============================================
// SelectField Stories (Convenience Wrapper)
// =============================================

/**
 * SelectField default example with label.
 */
export const FieldDefault: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <SelectField
        label="Country"
        placeholder="Select a country"
        options={countries}
      />
    </div>
  ),
};

/**
 * SelectField with hint text.
 */
export const FieldWithHint: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <SelectField
        label="Country"
        hint="We'll use this for shipping calculations"
        placeholder="Select a country"
        options={countries}
      />
    </div>
  ),
};

/**
 * SelectField with error state. Notice how the error replaces the hint.
 */
export const FieldWithError: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <SelectField
        label="Country"
        hint="We'll use this for shipping"
        error="Please select a country"
        placeholder="Select a country"
        options={countries}
      />
    </div>
  ),
};

/**
 * SelectField with all features: required indicator, help icon, and hint text.
 */
export const FieldFullFeatured: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <SelectField
        label="Category"
        labelProps={{
          required: true,
          showIcon: true,
          helpIconAriaLabel: 'Category selection help',
        }}
        hint="Choose the category that best describes your item"
        placeholder="Select a category"
        options={categories}
        leftAddOn={<Icon icon={MapPin} size="sm" color="muted" />}
      />
    </div>
  ),
};

/**
 * SelectField showing all three sizes and how they map to InputLabel sizes.
 */
export const FieldAllSizes: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-8">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Small (sm) - Label: sm, Hint: sm
        </p>
        <SelectField
          size="sm"
          label="Small field"
          labelProps={{ required: true }}
          hint="Small hint text"
          placeholder="Small select"
          options={countries.slice(0, 3)}
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Medium (md) - Label: sm, Hint: sm
        </p>
        <SelectField
          size="md"
          label="Medium field"
          labelProps={{ required: true }}
          hint="Medium hint text"
          placeholder="Medium select"
          options={countries.slice(0, 3)}
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Large (lg) - Label: md, Hint: md
        </p>
        <SelectField
          size="lg"
          label="Large field"
          labelProps={{ required: true }}
          hint="Large hint text"
          placeholder="Large select"
          options={countries.slice(0, 3)}
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
    const [controlled, setControlled] = useState<string>('');

    return (
      <div className="flex w-[320px] flex-col gap-8">
        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Uncontrolled (uses defaultValue)
          </p>
          <SelectField
            label="Uncontrolled select"
            defaultValue="us"
            hint="Initial value is 'United States'"
            placeholder="Select country"
            options={countries}
          />
        </div>

        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Controlled (uses value + onValueChange)
          </p>
          <SelectField
            label="Controlled select"
            value={controlled}
            onValueChange={setControlled}
            placeholder="Select country..."
            hint={`Current value: "${controlled || 'none'}"`}
            options={countries}
          />
        </div>
      </div>
    );
  },
};

/**
 * Select with many options demonstrating scroll behavior.
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
        <SelectField
          label="Large list"
          hint="50 options with scroll"
          placeholder="Select an option"
          options={manyOptions}
        />
      </div>
    );
  },
};

/**
 * Select with grouped options using SelectGroup and SelectLabel.
 */
export const WithGroups: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <InputLabel label="Location" htmlFor="grouped-select" />
      <Select>
        <SelectTrigger id="grouped-select">
          <SelectValue placeholder="Select a location" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
            <SelectItem value="mx">Mexico</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="de">Germany</SelectItem>
            <SelectItem value="fr">France</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Asia Pacific</SelectLabel>
            <SelectItem value="jp">Japan</SelectItem>
            <SelectItem value="au">Australia</SelectItem>
            <SelectItem value="nz">New Zealand</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

/**
 * Select with disabled options.
 */
export const WithDisabledOptions: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <SelectField
        label="Subscription tier"
        placeholder="Select a tier"
        options={[
          { value: 'free', label: 'Free' },
          { value: 'basic', label: 'Basic' },
          { value: 'pro', label: 'Pro (Coming Soon)', disabled: true },
          {
            value: 'enterprise',
            label: 'Enterprise (Coming Soon)',
            disabled: true,
          },
        ]}
      />
    </div>
  ),
};

// =============================================
// Real-World Examples
// =============================================

/**
 * Real-world form example using SelectField.
 */
export const FormIntegration: Story = {
  args: {},
  render: function FormExample() {
    const [country, setCountry] = useState<string>('');
    const [category, setCategory] = useState<string>('');

    return (
      <form className="w-[360px] space-y-5 rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold">Product Listing</h3>

        <SelectField
          label="Category"
          labelProps={{ required: true }}
          value={category}
          onValueChange={setCategory}
          placeholder="Select a category"
          options={categories}
          leftAddOn={<Icon icon={MapPin} size="sm" color="muted" />}
          error={category === '' ? undefined : undefined}
        />

        <SelectField
          label="Country of Origin"
          labelProps={{ required: true }}
          hint="Where was this product made?"
          value={country}
          onValueChange={setCountry}
          placeholder="Select a country"
          options={countries}
          leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
        />

        <SelectField
          label="Condition"
          placeholder="Select condition"
          options={[
            { value: 'new', label: 'New' },
            { value: 'like-new', label: 'Like New' },
            { value: 'good', label: 'Good' },
            { value: 'fair', label: 'Fair' },
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
 * User profile settings example.
 */
export const UserProfileExample: Story = {
  args: {},
  render: () => (
    <div className="w-[360px] space-y-5 rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold">Profile Settings</h3>

      <SelectField
        label="Language"
        placeholder="Select language"
        defaultValue="en"
        options={[
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Espa\u00f1ol' },
          { value: 'fr', label: 'Fran\u00e7ais' },
          { value: 'de', label: 'Deutsch' },
          { value: 'pt', label: 'Portugu\u00eas' },
        ]}
        leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
      />

      <SelectField
        label="Time Zone"
        placeholder="Select time zone"
        defaultValue="est"
        options={[
          { value: 'pst', label: 'Pacific Time (PT)' },
          { value: 'mst', label: 'Mountain Time (MT)' },
          { value: 'cst', label: 'Central Time (CT)' },
          { value: 'est', label: 'Eastern Time (ET)' },
          { value: 'utc', label: 'UTC' },
        ]}
      />

      <SelectField
        label="Notification Frequency"
        hint="How often should we send you updates?"
        placeholder="Select frequency"
        options={[
          { value: 'realtime', label: 'Real-time' },
          { value: 'daily', label: 'Daily digest' },
          { value: 'weekly', label: 'Weekly summary' },
          { value: 'never', label: 'Never' },
        ]}
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
            <Select size="sm">
              <SelectTrigger>
                <SelectValue placeholder="Empty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
              </SelectContent>
            </Select>
            <Select size="sm" defaultValue="us">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.slice(0, 3).map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select size="sm" disabled>
              <SelectTrigger>
                <SelectValue placeholder="Disabled" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
              </SelectContent>
            </Select>
            <Select size="sm">
              <SelectTrigger error>
                <SelectValue placeholder="Error" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Medium */}
          <div className="space-y-3">
            <p className="text-xs text-text-tertiary">Medium (md)</p>
            <Select size="md">
              <SelectTrigger>
                <SelectValue placeholder="Empty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
              </SelectContent>
            </Select>
            <Select size="md" defaultValue="ca">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.slice(0, 3).map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select size="md" disabled>
              <SelectTrigger>
                <SelectValue placeholder="Disabled" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
              </SelectContent>
            </Select>
            <Select size="md">
              <SelectTrigger error>
                <SelectValue placeholder="Error" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Large */}
          <div className="space-y-3">
            <p className="text-xs text-text-tertiary">Large (lg)</p>
            <Select size="lg">
              <SelectTrigger>
                <SelectValue placeholder="Empty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
              </SelectContent>
            </Select>
            <Select size="lg" defaultValue="mx">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.slice(0, 3).map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select size="lg" disabled>
              <SelectTrigger>
                <SelectValue placeholder="Disabled" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
              </SelectContent>
            </Select>
            <Select size="lg">
              <SelectTrigger error>
                <SelectValue placeholder="Error" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Borderless variants */}
      <div>
        <p className="mb-4 text-xs font-medium text-text-tertiary">Borderless</p>
        <div className="grid grid-cols-3 gap-6">
          {/* Small */}
          <div className="space-y-3">
            <p className="text-xs text-text-tertiary">Small (sm)</p>
            <Select size="sm">
              <SelectTrigger variant="borderless">
                <SelectValue placeholder="Empty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
              </SelectContent>
            </Select>
            <Select size="sm" defaultValue="us">
              <SelectTrigger variant="borderless">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.slice(0, 3).map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Medium */}
          <div className="space-y-3">
            <p className="text-xs text-text-tertiary">Medium (md)</p>
            <Select size="md">
              <SelectTrigger variant="borderless">
                <SelectValue placeholder="Empty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
              </SelectContent>
            </Select>
            <Select size="md" defaultValue="ca">
              <SelectTrigger variant="borderless">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.slice(0, 3).map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Large */}
          <div className="space-y-3">
            <p className="text-xs text-text-tertiary">Large (lg)</p>
            <Select size="lg">
              <SelectTrigger variant="borderless">
                <SelectValue placeholder="Empty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
              </SelectContent>
            </Select>
            <Select size="lg" defaultValue="mx">
              <SelectTrigger variant="borderless">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.slice(0, 3).map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Side-by-side comparison showing when to use Select vs SelectField.
 */
export const WhenToUseWhich: Story = {
  args: {},
  render: () => (
    <div className="grid w-[700px] grid-cols-2 gap-8">
      {/* Select (compound components) side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">
          Select (Compound Components)
        </h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for custom layouts, grouped options, or complex dropdowns
        </p>

        <div className="space-y-4">
          {/* Grouped options */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">Grouped options</p>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Americas</SelectLabel>
                  <SelectItem value="us">
                    <span className="flex items-center gap-2">
                      <Icon icon={User} size="sm" />
                      United States
                    </span>
                  </SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Europe</SelectLabel>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Custom label layout */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">Custom label layout</p>
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm font-medium">Priority</span>
              <a
                href="#"
                className="text-xs text-primary"
                onClick={(e) => e.preventDefault()}
              >
                Learn more
              </a>
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* SelectField side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">SelectField (Wrapper)</h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for standard form fields with labels
        </p>

        <div className="space-y-4">
          {/* Standard field */}
          <SelectField
            label="Country"
            labelProps={{ required: true }}
            hint="Select your country"
            placeholder="Select country"
            options={countries.slice(0, 4)}
          />

          {/* Field with error */}
          <SelectField
            label="Category"
            labelProps={{ required: true }}
            error="Please select a category"
            placeholder="Select category"
            options={categories.slice(0, 4)}
          />
        </div>
      </div>
    </div>
  ),
};
