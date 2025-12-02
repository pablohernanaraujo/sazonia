import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  ErrorMessage,
  Hint,
  InputLabel,
  NumberInput,
  NumberInputField,
} from '@/ui/inputs';

/**
 * NumberInput is a specialized form input component for numeric data entry with
 * increment/decrement stepper controls.
 *
 * ## Dual API Approach
 *
 * This package provides two components:
 *
 * 1. **NumberInput** (standalone) - For maximum flexibility and custom layouts
 * 2. **NumberInputField** (wrapper) - For convenience in standard forms
 *
 * ## Features
 *
 * - **Size variants**: SM (compact), MD (default), LG (comfortable)
 * - **Visual states**: Default, Hover, Focus, Disabled, Error
 * - **Stepper controls**: Built-in increment/decrement buttons
 * - **Min/Max bounds**: Configurable value constraints
 * - **Step values**: Custom increment amounts (including decimals)
 * - **Keyboard navigation**: ArrowUp/Down, PageUp/Down, Home/End
 * - **Add-ons**: Left slot for icons or text prefixes
 *
 * ## When to Use NumberInput vs NumberInputField
 *
 * Use **NumberInput** when:
 * - You need custom layout around the input
 * - You're building inline numeric controls
 * - You need fine-grained control over composition
 *
 * Use **NumberInputField** when:
 * - You have a standard form field with label, hint, and/or error
 * - You want automatic ID generation and ARIA associations
 * - You want the convenience of a single component
 */
const meta = {
  title: 'Inputs/NumberInput',
  component: NumberInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the input',
      table: {
        defaultValue: { summary: 'lg' },
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
    min: {
      control: 'number',
      description: 'Minimum allowed value',
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value',
    },
    step: {
      control: 'number',
      description: 'Step value for increment/decrement',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    leftAddOn: {
      control: false,
      description: 'Content to render on the left side (prefix)',
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
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default NumberInput with LG size and placeholder text.
 */
export const Default: Story = {
  args: {
    placeholder: '0',
    size: 'lg',
  },
};

/**
 * Comparison of all three size variants: SM, MD, and LG.
 */
export const Sizes: Story = {
  args: {
    placeholder: '0',
  },
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Small (sm)</p>
        <NumberInput size="sm" placeholder="0" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Medium (md)</p>
        <NumberInput size="md" placeholder="0" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Large (lg) - Default</p>
        <NumberInput size="lg" placeholder="0" />
      </div>
    </div>
  ),
};

/**
 * Grid showing all visual states: Empty, Hovered (use mouse), Focused (click input),
 * Disabled, Disabled with value, Error, and Error with value.
 */
export const AllStates: Story = {
  args: {
    placeholder: '0',
  },
  render: () => (
    <div className="grid w-[640px] grid-cols-2 gap-6">
      {/* Empty State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Empty (hover to see hover state)
        </p>
        <NumberInput placeholder="0" />
      </div>

      {/* Filled State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Filled</p>
        <NumberInput defaultValue={42} />
      </div>

      {/* Disabled Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (empty)</p>
        <NumberInput disabled placeholder="0" />
      </div>

      {/* Disabled Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (filled)</p>
        <NumberInput disabled defaultValue={42} />
      </div>

      {/* Error Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (empty)</p>
        <NumberInput error placeholder="0" />
      </div>

      {/* Error Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (filled)</p>
        <NumberInput error defaultValue={-5} />
      </div>
    </div>
  ),
};

/**
 * NumberInput with various text prefix configurations.
 */
export const WithPrefix: Story = {
  args: {
    placeholder: '0',
  },
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Currency prefix ($)</p>
        <NumberInput
          leftAddOn={<span className="text-sm text-text-tertiary">$</span>}
          placeholder="0.00"
          step={0.01}
          min={0}
        />
      </div>

      <div>
        <p className="mb-2 text-xs text-text-tertiary">Quantity prefix</p>
        <NumberInput
          leftAddOn={<span className="text-sm text-text-tertiary">Qty:</span>}
          placeholder="0"
          min={0}
        />
      </div>

      <div>
        <p className="mb-2 text-xs text-text-tertiary">Price prefix</p>
        <NumberInput
          leftAddOn={<span className="text-sm text-text-tertiary">Price:</span>}
          placeholder="0.00"
          step={0.01}
          min={0}
        />
      </div>

      <div>
        <p className="mb-2 text-xs text-text-tertiary">Percentage prefix</p>
        <NumberInput
          leftAddOn={<span className="text-sm text-text-tertiary">%</span>}
          placeholder="0"
          min={0}
          max={100}
        />
      </div>
    </div>
  ),
};

/**
 * Demonstrates min/max boundary constraints and how the stepper respects them.
 */
export const MinMaxBounds: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Min: 0, Max: 10</p>
        <NumberInput defaultValue={5} min={0} max={10} />
        <p className="mt-1 text-xs text-text-tertiary">
          Try clicking increment at 10 or decrement at 0
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs text-text-tertiary">Min: -5, Max: 5</p>
        <NumberInput defaultValue={0} min={-5} max={5} />
        <p className="mt-1 text-xs text-text-tertiary">
          Supports negative numbers
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs text-text-tertiary">At minimum (0)</p>
        <NumberInput defaultValue={0} min={0} max={100} />
        <p className="mt-1 text-xs text-text-tertiary">
          Decrement button is disabled
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs text-text-tertiary">At maximum (100)</p>
        <NumberInput defaultValue={100} min={0} max={100} />
        <p className="mt-1 text-xs text-text-tertiary">
          Increment button is disabled
        </p>
      </div>
    </div>
  ),
};

/**
 * Demonstrates different step values for fine or coarse increment control.
 */
export const StepValues: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Step: 1 (default)</p>
        <NumberInput defaultValue={5} step={1} />
      </div>

      <div>
        <p className="mb-2 text-xs text-text-tertiary">Step: 0.1 (decimal)</p>
        <NumberInput defaultValue={0.5} step={0.1} />
        <p className="mt-1 text-xs text-text-tertiary">
          Try incrementing - handles floating point precision
        </p>
      </div>

      <div>
        <p className="mb-2 text-xs text-text-tertiary">Step: 0.01 (cents)</p>
        <NumberInput
          leftAddOn={<span className="text-sm text-text-tertiary">$</span>}
          defaultValue={9.99}
          step={0.01}
          min={0}
        />
      </div>

      <div>
        <p className="mb-2 text-xs text-text-tertiary">Step: 10 (large)</p>
        <NumberInput defaultValue={50} step={10} min={0} max={100} />
      </div>

      <div>
        <p className="mb-2 text-xs text-text-tertiary">Step: 5</p>
        <NumberInput defaultValue={0} step={5} min={0} max={100} />
        <p className="mt-1 text-xs text-text-tertiary">
          PageUp/PageDown jumps by 50 (step × 10)
        </p>
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
        <InputLabel label="Quantity" htmlFor="qty-basic" />
        <NumberInput id="qty-basic" placeholder="0" min={0} />
      </div>

      {/* With hint */}
      <div>
        <p className="mb-3 text-xs text-text-tertiary">With hint</p>
        <InputLabel label="Quantity" htmlFor="qty-hint" required />
        <NumberInput
          id="qty-hint"
          placeholder="0"
          min={1}
          max={100}
          aria-describedby="qty-hint-text"
        />
        <Hint id="qty-hint-text">Enter a value between 1 and 100</Hint>
      </div>

      {/* With error */}
      <div>
        <p className="mb-3 text-xs text-text-tertiary">With error</p>
        <InputLabel label="Quantity" htmlFor="qty-error" required />
        <NumberInput
          id="qty-error"
          placeholder="0"
          error
          aria-invalid
          aria-describedby="qty-error-text"
          defaultValue={-5}
        />
        <ErrorMessage id="qty-error-text" text="Value must be at least 0" />
      </div>
    </div>
  ),
};

// =============================================
// NumberInputField Stories (Convenience Wrapper)
// =============================================

/**
 * NumberInputField default example with label.
 */
export const FieldDefault: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <NumberInputField label="Quantity" placeholder="0" />
    </div>
  ),
};

/**
 * NumberInputField with hint text.
 */
export const FieldWithHint: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <NumberInputField
        label="Quantity"
        hint="Enter a value between 1 and 100"
        placeholder="0"
        min={1}
        max={100}
      />
    </div>
  ),
};

/**
 * NumberInputField with error state. Notice how the error replaces the hint.
 */
export const FieldWithError: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <NumberInputField
        label="Quantity"
        hint="Enter a value between 1 and 100"
        error="Value must be at least 1"
        placeholder="0"
        defaultValue={0}
        min={1}
        max={100}
      />
    </div>
  ),
};

/**
 * NumberInputField with all features: required indicator, help icon, prefix, and hint text.
 */
export const FieldFullFeatured: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <NumberInputField
        label="Price"
        labelProps={{
          required: true,
          showIcon: true,
          helpIconAriaLabel: 'Price information',
        }}
        hint="Enter the price in dollars"
        placeholder="0.00"
        leftAddOn={<span className="text-sm text-text-tertiary">$</span>}
        step={0.01}
        min={0}
      />
    </div>
  ),
};

/**
 * Real-world form example using NumberInputField for convenience.
 */
export const FormIntegration: Story = {
  args: {},
  render: function FormExample() {
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(9.99);

    const total = (quantity * price).toFixed(2);

    return (
      <form className="w-[360px] space-y-5 rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold">Order Details</h3>

        <NumberInputField
          label="Quantity"
          labelProps={{ required: true }}
          hint="Maximum 10 items per order"
          placeholder="1"
          min={1}
          max={10}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
        />

        <NumberInputField
          label="Price per item"
          labelProps={{ required: true }}
          leftAddOn={<span className="text-sm text-text-tertiary">$</span>}
          placeholder="0.00"
          step={0.01}
          min={0}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value) || 0)}
        />

        <div className="border-t border-border pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>${total}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-sm bg-primary py-2.5 text-white hover:bg-primary-hover"
          onClick={(e) => e.preventDefault()}
        >
          Add to Cart
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

      {/* Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Small column */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Small (sm)</p>
          <NumberInput size="sm" placeholder="Empty" />
          <NumberInput size="sm" defaultValue={42} />
          <NumberInput size="sm" disabled placeholder="Disabled" />
          <NumberInput size="sm" disabled defaultValue={42} />
          <NumberInput size="sm" error placeholder="Error" />
          <NumberInput size="sm" error defaultValue={-5} />
        </div>

        {/* Medium column */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Medium (md)</p>
          <NumberInput size="md" placeholder="Empty" />
          <NumberInput size="md" defaultValue={42} />
          <NumberInput size="md" disabled placeholder="Disabled" />
          <NumberInput size="md" disabled defaultValue={42} />
          <NumberInput size="md" error placeholder="Error" />
          <NumberInput size="md" error defaultValue={-5} />
        </div>

        {/* Large column */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Large (lg)</p>
          <NumberInput size="lg" placeholder="Empty" />
          <NumberInput size="lg" defaultValue={42} />
          <NumberInput size="lg" disabled placeholder="Disabled" />
          <NumberInput size="lg" disabled defaultValue={42} />
          <NumberInput size="lg" error placeholder="Error" />
          <NumberInput size="lg" error defaultValue={-5} />
        </div>
      </div>
    </div>
  ),
};

/**
 * Interactive demonstration of keyboard navigation controls.
 */
export const KeyboardNavigation: Story = {
  args: {},
  render: function KeyboardDemo() {
    const [value, setValue] = useState(50);
    const [lastAction, setLastAction] = useState('');

    return (
      <div className="w-[400px] space-y-4">
        <h3 className="text-lg font-semibold">Keyboard Navigation Demo</h3>

        <div className="rounded-lg border border-border p-4">
          <NumberInputField
            label="Focus input and try keyboard controls"
            labelProps={{ required: true }}
            hint="Value range: 0 - 100, Step: 1"
            min={0}
            max={100}
            step={1}
            value={value}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              setValue(newValue);
              setLastAction(`Value changed to ${newValue}`);
            }}
          />
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">Keyboard shortcuts:</p>
          <ul className="space-y-1 text-text-secondary">
            <li>
              <kbd className="rounded bg-fill-secondary px-1.5 py-0.5">↑</kbd>{' '}
              ArrowUp: Increment by step (1)
            </li>
            <li>
              <kbd className="rounded bg-fill-secondary px-1.5 py-0.5">↓</kbd>{' '}
              ArrowDown: Decrement by step (1)
            </li>
            <li>
              <kbd className="rounded bg-fill-secondary px-1.5 py-0.5">
                Page Up
              </kbd>{' '}
              : Increment by step × 10 (10)
            </li>
            <li>
              <kbd className="rounded bg-fill-secondary px-1.5 py-0.5">
                Page Down
              </kbd>{' '}
              : Decrement by step × 10 (10)
            </li>
            <li>
              <kbd className="rounded bg-fill-secondary px-1.5 py-0.5">Home</kbd>{' '}
              : Jump to min (0)
            </li>
            <li>
              <kbd className="rounded bg-fill-secondary px-1.5 py-0.5">End</kbd> :
              Jump to max (100)
            </li>
          </ul>
        </div>

        {lastAction && (
          <div className="rounded bg-fill-tertiary px-3 py-2 text-sm text-text-secondary">
            Last action: {lastAction}
          </div>
        )}
      </div>
    );
  },
};

/**
 * Demonstrates stepper control visual states (at min, at max, normal).
 */
export const StepperStates: Story = {
  args: {},
  render: () => (
    <div className="flex w-[480px] flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="mb-2 text-xs text-text-tertiary">Normal</p>
          <NumberInput defaultValue={5} min={0} max={10} />
          <p className="mt-1 text-xs text-text-tertiary">Both buttons enabled</p>
        </div>
        <div>
          <p className="mb-2 text-xs text-text-tertiary">At Min</p>
          <NumberInput defaultValue={0} min={0} max={10} />
          <p className="mt-1 text-xs text-text-tertiary">Decrement disabled</p>
        </div>
        <div>
          <p className="mb-2 text-xs text-text-tertiary">At Max</p>
          <NumberInput defaultValue={10} min={0} max={10} />
          <p className="mt-1 text-xs text-text-tertiary">Increment disabled</p>
        </div>
      </div>
    </div>
  ),
};
