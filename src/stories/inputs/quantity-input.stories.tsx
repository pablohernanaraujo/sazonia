import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { QuantityInput } from '@/ui/inputs';

/**
 * The QuantityInput is a specialized form control component designed for adjusting
 * numeric quantities through increment/decrement buttons. It combines a centered
 * text input with flanking minus and plus buttons.
 *
 * ## Features
 * - **3 Size Variants**: sm (32px), md (40px), lg (48px)
 * - **6 States**: default, hover, focus, typing, disabled, error
 * - **Form Integration**: Label, hint text, and error message support
 * - **Keyboard Navigation**: ArrowUp/Down, Home/End
 * - **Controlled & Uncontrolled**: Supports both modes
 *
 * ## Composition
 * This is a **molecule** component that composes:
 * - `QuantityInputButton` - Plus/minus buttons
 * - `InputLabel` - Optional label with required indicator
 * - `Hint` - Optional helper text
 * - `ErrorMessage` - Error state feedback
 *
 * ## Accessibility
 * - `role="spinbutton"` on input
 * - `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
 * - `aria-invalid` in error state
 * - `aria-describedby` links to hint/error
 * - Descriptive aria-labels on buttons
 */
const meta = {
  title: 'Inputs/QuantityInput',
  component: QuantityInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant affecting height and width',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input and buttons',
    },
    error: {
      control: 'boolean',
      description: 'Error state - applies destructive styling',
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
    },
    value: {
      control: 'number',
      description: 'Current value (controlled mode)',
    },
    defaultValue: {
      control: 'number',
      description: 'Default value (uncontrolled mode)',
    },
    label: {
      control: 'text',
      description: 'Label text for the input',
    },
    required: {
      control: 'boolean',
      description: 'Shows required indicator in label',
    },
    showLabelIcon: {
      control: 'boolean',
      description: 'Shows help icon next to label',
    },
    labelDescription: {
      control: 'text',
      description: 'Description text below the label',
    },
    hint: {
      control: 'text',
      description: 'Hint text displayed below the input',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message displayed when error is true',
    },
    decreaseAriaLabel: {
      control: 'text',
      description: 'Aria-label for the minus button',
    },
    increaseAriaLabel: {
      control: 'text',
      description: 'Aria-label for the plus button',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the input',
    },
    wrapperClassName: {
      control: 'text',
      description: 'Additional CSS classes for the wrapper',
    },
  },
} satisfies Meta<typeof QuantityInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default quantity input with large size.
 */
export const Default: Story = {
  args: {
    defaultValue: 1,
    min: 0,
    max: 99,
  },
};

/**
 * Comparison of all three sizes: SM (32px), MD (40px), LG (48px).
 */
export const AllSizes: Story = {
  args: {
    defaultValue: 1,
  },
  render: () => (
    <div className="space-y-6">
      <div className="flex items-end gap-6">
        <div className="text-center">
          <QuantityInput size="sm" defaultValue={1} />
          <p className="mt-2 text-xs text-text-subtle">SM (32px)</p>
        </div>
        <div className="text-center">
          <QuantityInput size="md" defaultValue={1} />
          <p className="mt-2 text-xs text-text-subtle">MD (40px)</p>
        </div>
        <div className="text-center">
          <QuantityInput size="lg" defaultValue={1} />
          <p className="mt-2 text-xs text-text-subtle">LG (48px)</p>
        </div>
      </div>
    </div>
  ),
};

/**
 * Visual demonstration of all interactive states.
 * Note: Hover and Focus states can be seen by interacting with the inputs.
 */
export const AllStates: Story = {
  args: {
    defaultValue: 1,
  },
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-24 text-sm text-text-subtle">Default</div>
        <QuantityInput defaultValue={1} />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24 text-sm text-text-subtle">Disabled</div>
        <QuantityInput defaultValue={1} disabled />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24 text-sm text-text-subtle">Error</div>
        <QuantityInput defaultValue={1} error />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24 text-sm text-text-subtle">At Min (0)</div>
        <QuantityInput value={0} min={0} />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24 text-sm text-text-subtle">At Max (99)</div>
        <QuantityInput value={99} max={99} />
      </div>
      <p className="mt-4 text-xs text-text-secondary">
        * Hover and Focus states can be observed by interacting with the Default
        input
      </p>
    </div>
  ),
};

/**
 * Quantity input with label configuration options.
 */
export const WithLabel: Story = {
  args: {
    defaultValue: 1,
    label: 'Quantity',
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">Basic Label</h3>
        <QuantityInput label="Quantity" defaultValue={1} />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Required Label
        </h3>
        <QuantityInput label="Quantity" required defaultValue={1} />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          With Help Icon
        </h3>
        <QuantityInput label="Quantity" showLabelIcon defaultValue={1} />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          With Description
        </h3>
        <QuantityInput
          label="Quantity"
          labelDescription="How many items would you like?"
          defaultValue={1}
        />
      </div>
    </div>
  ),
};

/**
 * Quantity input with hint text displayed below.
 */
export const WithHint: Story = {
  args: {
    defaultValue: 1,
    label: 'Quantity',
    hint: 'Maximum 10 items per order',
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          With Hint Text
        </h3>
        <QuantityInput
          label="Quantity"
          hint="Maximum 10 items per order"
          defaultValue={1}
          max={10}
        />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Small Size with Hint
        </h3>
        <QuantityInput
          size="sm"
          label="Qty"
          hint="Max 5 per customer"
          defaultValue={1}
          max={5}
        />
      </div>
    </div>
  ),
};

/**
 * Quantity input in error state with error message.
 */
export const WithError: Story = {
  args: {
    defaultValue: 15,
    error: true,
    errorMessage: 'Quantity exceeds available stock (10)',
    label: 'Quantity',
    max: 10,
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">Error State</h3>
        <QuantityInput
          label="Quantity"
          error
          errorMessage="Quantity exceeds available stock (10)"
          defaultValue={15}
          max={10}
        />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Error Without Message
        </h3>
        <QuantityInput label="Quantity" error defaultValue={1} />
      </div>
    </div>
  ),
};

/**
 * Complete form field with label, input, and hint/error message.
 */
export const WithAllFeatures: Story = {
  args: {
    defaultValue: 1,
    label: 'Quantity',
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Normal State (Label + Hint)
        </h3>
        <QuantityInput
          label="Order Quantity"
          required
          showLabelIcon
          labelDescription="Select how many you want to order"
          hint="Maximum 10 items per order"
          defaultValue={1}
          min={1}
          max={10}
        />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Error State (Label + Error)
        </h3>
        <QuantityInput
          label="Order Quantity"
          required
          showLabelIcon
          labelDescription="Select how many you want to order"
          error
          errorMessage="Quantity exceeds maximum limit of 10"
          defaultValue={15}
          min={1}
          max={10}
        />
      </div>
    </div>
  ),
};

/**
 * E-commerce product quantity selector scenario.
 */
export const ProductQuantitySelector: Story = {
  args: {
    defaultValue: 1,
    min: 1,
    max: 10,
    label: 'Quantity',
    hint: 'In stock: 10 available',
  },
  render: function ProductQuantitySelectorRender() {
    const [quantity, setQuantity] = useState(1);
    const inStock = 10;

    return (
      <div className="w-64 rounded-lg border border-border p-4">
        <h3 className="mb-2 text-lg font-semibold text-text-primary">
          Wireless Mouse
        </h3>
        <p className="mb-4 text-2xl font-bold text-text-primary">$49.99</p>
        <QuantityInput
          label="Quantity"
          hint={`In stock: ${inStock} available`}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
          max={inStock}
        />
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            Subtotal: ${(49.99 * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    );
  },
};

/**
 * Shopping cart item with quantity control.
 */
export const CartItemQuantity: Story = {
  args: {
    defaultValue: 2,
  },
  render: function CartItemQuantityRender() {
    const [quantity, setQuantity] = useState(2);
    const price = 29.99;

    return (
      <div className="w-80 rounded-lg border border-border p-4">
        <div className="flex gap-4">
          <div className="h-20 w-20 rounded bg-background-secondary" />
          <div className="flex-1">
            <h4 className="font-medium text-text-primary">Blue T-Shirt</h4>
            <p className="text-sm text-text-secondary">Size: M</p>
            <p className="mt-1 font-semibold text-text-primary">
              ${price.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <QuantityInput
            size="sm"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
            max={99}
            decreaseAriaLabel="Remove one Blue T-Shirt"
            increaseAriaLabel="Add one more Blue T-Shirt"
          />
          <span className="font-semibold text-text-primary">
            ${(price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    );
  },
};

/**
 * Inventory management scenario with larger quantities.
 */
export const InventoryAdjustment: Story = {
  args: {
    defaultValue: 100,
    step: 10,
  },
  render: function InventoryAdjustmentRender() {
    const [stock, setStock] = useState(100);

    return (
      <div className="w-72 space-y-4 rounded-lg border border-border p-4">
        <h3 className="font-semibold text-text-primary">Adjust Inventory</h3>
        <div className="rounded bg-background-secondary p-3">
          <p className="text-sm text-text-secondary">Product SKU</p>
          <p className="font-mono text-text-primary">WH-1234-BLU</p>
        </div>
        <QuantityInput
          label="Stock Quantity"
          required
          hint="Adjust in increments of 10"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          min={0}
          max={1000}
          step={10}
        />
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">New total:</span>
          <span className="font-medium text-text-primary">{stock} units</span>
        </div>
      </div>
    );
  },
};

/**
 * Fully interactive demo with working increment/decrement.
 */
export const InteractiveDemo: Story = {
  args: {
    defaultValue: 1,
    min: 0,
    max: 99,
  },
  render: function InteractiveDemoRender() {
    const [quantity, setQuantity] = useState(1);
    const min = 0;
    const max = 99;

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <QuantityInput
            label="Quantity"
            hint={`Range: ${min} - ${max}`}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={min}
            max={max}
          />
          <div className="rounded bg-background-secondary p-3 text-sm">
            <p className="text-text-secondary">
              Current value: <span className="font-medium">{quantity}</span>
            </p>
            <p className="mt-1 text-text-secondary">
              Try: Click buttons, type directly, use ArrowUp/Down keys, or
              Home/End
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded border border-border px-3 py-1.5 text-sm hover:bg-background-secondary"
            onClick={() => setQuantity(min)}
          >
            Set to Min
          </button>
          <button
            type="button"
            className="rounded border border-border px-3 py-1.5 text-sm hover:bg-background-secondary"
            onClick={() => setQuantity(max)}
          >
            Set to Max
          </button>
          <button
            type="button"
            className="rounded border border-border px-3 py-1.5 text-sm hover:bg-background-secondary"
            onClick={() => setQuantity(50)}
          >
            Set to 50
          </button>
        </div>
      </div>
    );
  },
};

/**
 * Demonstrates all sizes with labels for form context.
 */
export const SizesWithLabels: Story = {
  args: {
    defaultValue: 1,
    label: 'Quantity',
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Small (SM) - 32px height
        </h3>
        <QuantityInput
          size="sm"
          label="Quantity"
          hint="Compact form fields"
          defaultValue={1}
        />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Medium (MD) - 40px height
        </h3>
        <QuantityInput
          size="md"
          label="Quantity"
          hint="Standard form fields"
          defaultValue={1}
        />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Large (LG) - 48px height (default)
        </h3>
        <QuantityInput
          size="lg"
          label="Quantity"
          hint="Prominent form fields"
          defaultValue={1}
        />
      </div>
    </div>
  ),
};

/**
 * Demonstrates keyboard navigation features.
 */
export const KeyboardNavigation: Story = {
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
  },
  render: () => (
    <div className="space-y-4">
      <QuantityInput
        label="Test Keyboard Navigation"
        hint="Focus the input and try the keyboard shortcuts"
        defaultValue={50}
        min={0}
        max={100}
      />
      <div className="rounded bg-background-secondary p-4 text-sm">
        <h4 className="mb-2 font-medium text-text-primary">
          Keyboard Shortcuts:
        </h4>
        <ul className="space-y-1 text-text-secondary">
          <li>
            <kbd className="rounded bg-background px-1.5 py-0.5">Arrow Up</kbd> -
            Increment by step
          </li>
          <li>
            <kbd className="rounded bg-background px-1.5 py-0.5">Arrow Down</kbd>{' '}
            - Decrement by step
          </li>
          <li>
            <kbd className="rounded bg-background px-1.5 py-0.5">Home</kbd> - Jump
            to minimum (0)
          </li>
          <li>
            <kbd className="rounded bg-background px-1.5 py-0.5">End</kbd> - Jump
            to maximum (100)
          </li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * Custom step values for different use cases.
 */
export const CustomStepValues: Story = {
  args: {
    defaultValue: 0,
    step: 5,
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Step: 1 (Default)
        </h3>
        <QuantityInput
          label="Units"
          hint="Increment by 1"
          defaultValue={0}
          step={1}
        />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">Step: 5</h3>
        <QuantityInput
          label="Items (5-pack)"
          hint="Increment by 5"
          defaultValue={0}
          step={5}
        />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">Step: 10</h3>
        <QuantityInput
          label="Bulk Order"
          hint="Increment by 10"
          defaultValue={0}
          step={10}
        />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Step: 0.25 (Decimal)
        </h3>
        <QuantityInput
          label="Weight (kg)"
          hint="Increment by 0.25"
          defaultValue={1}
          step={0.25}
          min={0}
        />
      </div>
    </div>
  ),
};
