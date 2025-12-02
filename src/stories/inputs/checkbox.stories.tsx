import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Checkbox } from '@/ui/inputs';

/**
 * Checkbox is a form control that allows users to select one or more options.
 *
 * ## Features
 *
 * - **Three states**: Unchecked, Checked (with checkmark), Indeterminate (with minus icon)
 * - **Size variants**: SM (16px), MD (20px), LG (24px)
 * - **Interactive states**: Default, Hover, Focus, Pressed, Disabled, Error
 * - **Accessibility**: Built on Radix UI for proper ARIA attributes and keyboard support
 *
 * ## Usage
 *
 * ```tsx
 * import { Checkbox } from '@/ui';
 *
 * // Basic usage
 * <Checkbox />
 *
 * // Controlled
 * const [checked, setChecked] = useState(false);
 * <Checkbox checked={checked} onCheckedChange={setChecked} />
 *
 * // With label (compose with label element)
 * <label className="flex items-center gap-2">
 *   <Checkbox />
 *   Accept terms and conditions
 * </label>
 * ```
 */
const meta = {
  title: 'Inputs/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'select',
      options: [true, false, 'indeterminate'],
      description: 'The controlled checked state of the checkbox',
      table: {
        type: { summary: 'boolean | "indeterminate"' },
      },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'The default checked state for uncontrolled usage',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in indeterminate state',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the checkbox',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    error: {
      control: 'boolean',
      description: 'Whether the checkbox is in error state',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    onCheckedChange: {
      action: 'checked changed',
      description: 'Callback fired when the checked state changes',
      table: {
        type: { summary: '(checked: boolean | "indeterminate") => void' },
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default checkbox in unchecked state with MD size.
 */
export const Default: Story = {
  args: {},
};

/**
 * All three checked states: Unchecked, Checked, and Indeterminate.
 */
export const CheckedStates: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Checkbox checked={false} />
        <span className="text-xs text-text-tertiary">Unchecked</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox checked />
        <span className="text-xs text-text-tertiary">Checked</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox indeterminate />
        <span className="text-xs text-text-tertiary">Indeterminate</span>
      </div>
    </div>
  ),
};

/**
 * All three size variants: SM (16px), MD (20px), LG (24px).
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      <div className="flex flex-col items-center gap-2">
        <Checkbox size="sm" checked />
        <span className="text-xs text-text-tertiary">SM (16px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox size="md" checked />
        <span className="text-xs text-text-tertiary">MD (20px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox size="lg" checked />
        <span className="text-xs text-text-tertiary">LG (24px)</span>
      </div>
    </div>
  ),
};

/**
 * Disabled checkboxes in all checked states.
 */
export const DisabledStates: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Checkbox disabled />
        <span className="text-xs text-text-tertiary">Disabled Unchecked</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox disabled checked />
        <span className="text-xs text-text-tertiary">Disabled Checked</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox disabled indeterminate />
        <span className="text-xs text-text-tertiary">Disabled Indeterminate</span>
      </div>
    </div>
  ),
};

/**
 * Error state checkboxes - useful for form validation.
 */
export const ErrorState: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Checkbox error />
        <span className="text-xs text-text-tertiary">Error Unchecked</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox error checked />
        <span className="text-xs text-text-tertiary">Error Checked</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox error indeterminate />
        <span className="text-xs text-text-tertiary">Error Indeterminate</span>
      </div>
    </div>
  ),
};

/**
 * Checkbox composed with a label - the most common usage pattern.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer items-center gap-3">
        <Checkbox />
        <span className="text-sm text-text-primary">
          Accept terms and conditions
        </span>
      </label>
      <label className="flex cursor-pointer items-center gap-3">
        <Checkbox defaultChecked />
        <span className="text-sm text-text-primary">Subscribe to newsletter</span>
      </label>
      <label className="flex cursor-not-allowed items-center gap-3">
        <Checkbox disabled checked />
        <span className="text-sm text-text-tertiary">
          Required option (disabled)
        </span>
      </label>
    </div>
  ),
};

/**
 * Controlled checkbox with React state.
 */
export const ControlledExample: Story = {
  render: function ControlledCheckbox() {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <label className="flex cursor-pointer items-center gap-3">
          <Checkbox
            checked={checked}
            onCheckedChange={(value) => setChecked(value === true)}
          />
          <span className="text-sm text-text-primary">Controlled checkbox</span>
        </label>
        <p className="text-xs text-text-tertiary">
          Current state: <strong>{checked ? 'Checked' : 'Unchecked'}</strong>
        </p>
        <button
          type="button"
          className="rounded-sm bg-fill-tertiary px-3 py-1.5 text-sm text-text-primary hover:bg-fill-tertiary-hover"
          onClick={() => setChecked(!checked)}
        >
          Toggle programmatically
        </button>
      </div>
    );
  },
};

/**
 * Multiple checkboxes for selection patterns.
 */
export const CheckboxGroup: Story = {
  render: function CheckboxGroupExample() {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const items = [
      { id: 'react', label: 'React' },
      { id: 'vue', label: 'Vue' },
      { id: 'angular', label: 'Angular' },
      { id: 'svelte', label: 'Svelte' },
    ];

    const handleChange = (id: string, checked: boolean) => {
      setSelectedItems((prev) =>
        checked ? [...prev, id] : prev.filter((item) => item !== id)
      );
    };

    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-text-primary">
          Select your favorite frameworks:
        </p>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-3"
            >
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onCheckedChange={(checked) =>
                  handleChange(item.id, checked === true)
                }
              />
              <span className="text-sm text-text-primary">{item.label}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-text-tertiary">
          Selected:{' '}
          {selectedItems.length === 0 ? 'None' : selectedItems.join(', ')}
        </p>
      </div>
    );
  },
};

/**
 * "Select All" pattern using indeterminate state.
 */
export const SelectAllPattern: Story = {
  render: function SelectAllExample() {
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
    const allSelected = selectedItems.size === items.length;
    const someSelected = selectedItems.size > 0 && !allSelected;

    const handleSelectAll = (checked: boolean | 'indeterminate') => {
      if (checked === true) {
        setSelectedItems(new Set(items));
      } else {
        setSelectedItems(new Set());
      }
    };

    const handleItemChange = (item: string, checked: boolean) => {
      setSelectedItems((prev) => {
        const next = new Set(prev);
        if (checked) {
          next.add(item);
        } else {
          next.delete(item);
        }
        return next;
      });
    };

    return (
      <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
        {/* Select All */}
        <label className="flex cursor-pointer items-center gap-3 border-b border-border-secondary pb-3">
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm font-medium text-text-primary">
            Select All
          </span>
        </label>

        {/* Individual items */}
        <div className="flex flex-col gap-2 pl-2">
          {items.map((item) => (
            <label key={item} className="flex cursor-pointer items-center gap-3">
              <Checkbox
                size="sm"
                checked={selectedItems.has(item)}
                onCheckedChange={(checked) =>
                  handleItemChange(item, checked === true)
                }
              />
              <span className="text-sm text-text-primary">{item}</span>
            </label>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Complete matrix showing all size × state × checked combinations.
 */
export const CompleteMatrix: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-sm font-medium text-text-primary">
        Complete Size × State × Checked Matrix
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse text-center text-xs">
          <thead>
            <tr>
              <th className="border border-border p-2">Size / State</th>
              <th className="border border-border p-2">Default</th>
              <th className="border border-border p-2">Checked</th>
              <th className="border border-border p-2">Indeterminate</th>
              <th className="border border-border p-2">Disabled</th>
              <th className="border border-border p-2">Disabled Checked</th>
              <th className="border border-border p-2">Error</th>
              <th className="border border-border p-2">Error Checked</th>
            </tr>
          </thead>
          <tbody>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <tr key={size}>
                <td className="border border-border p-2 font-medium">
                  {size.toUpperCase()}
                </td>
                <td className="border border-border p-3">
                  <div className="flex justify-center">
                    <Checkbox size={size} />
                  </div>
                </td>
                <td className="border border-border p-3">
                  <div className="flex justify-center">
                    <Checkbox size={size} checked />
                  </div>
                </td>
                <td className="border border-border p-3">
                  <div className="flex justify-center">
                    <Checkbox size={size} indeterminate />
                  </div>
                </td>
                <td className="border border-border p-3">
                  <div className="flex justify-center">
                    <Checkbox size={size} disabled />
                  </div>
                </td>
                <td className="border border-border p-3">
                  <div className="flex justify-center">
                    <Checkbox size={size} disabled checked />
                  </div>
                </td>
                <td className="border border-border p-3">
                  <div className="flex justify-center">
                    <Checkbox size={size} error />
                  </div>
                </td>
                <td className="border border-border p-3">
                  <div className="flex justify-center">
                    <Checkbox size={size} error checked />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-tertiary">
        Hover over checkboxes to see hover state. Click to see focus/pressed
        states.
      </p>
    </div>
  ),
};

/**
 * Form integration example with validation.
 */
export const FormIntegration: Story = {
  render: function FormExample() {
    const [agreed, setAgreed] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const showError = submitted && !agreed;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      if (agreed) {
        alert('Form submitted successfully!');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="w-[320px] space-y-4">
        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox
              checked={agreed}
              onCheckedChange={(value) => {
                setAgreed(value === true);
                if (submitted) setSubmitted(false);
              }}
              error={showError}
              className="mt-0.5"
            />
            <span className="text-sm text-text-primary">
              I agree to the{' '}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {showError && (
            <p className="mt-1.5 pl-8 text-xs text-destructive">
              You must agree to the terms to continue
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-sm bg-fill-primary py-2.5 text-sm text-text-overlay-white hover:bg-fill-primary-hover"
        >
          Submit
        </button>
      </form>
    );
  },
};
