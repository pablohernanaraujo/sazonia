import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { QuantityInputButton } from '@/ui/inputs';

/**
 * The QuantityInputButton is a standalone button component designed specifically
 * for quantity increment/decrement controls. It's an atomic primitive that can
 * be composed with other components (like a text input) to create full quantity
 * input controls.
 *
 * ## Features
 * - **2 Type Variants**: minus (left-positioned), plus (right-positioned)
 * - **3 Size Variants**: sm (32px), md (40px), lg (48px)
 * - **5 States**: default, hover, active, focus, disabled
 * - **Position-aware border radius**: left rounded for Minus, right rounded for Plus
 * - **Asymmetric borders**: Designed for seamless composition with input fields
 *
 * ## Accessibility
 * - Requires `aria-label` for screen reader support (icon-only buttons)
 * - Focus indicators with primary color ring
 * - Proper `type="button"` to prevent form submission
 * - `aria-disabled` attribute when disabled
 *
 * ## Border Pattern
 * The component uses an asymmetric border pattern for composition:
 * - `minus` type: Borders on left, top, bottom (no right border)
 * - `plus` type: Borders on right, top, bottom (no left border)
 *
 * This allows seamless composition with a centered input field.
 */
const meta = {
  title: 'Inputs/QuantityInputButton',
  component: QuantityInputButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['minus', 'plus'],
      description: 'Button type - determines icon and border radius position',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant affecting height and padding',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button interaction',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label (required for screen readers)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    onClick: {
      action: 'clicked',
      description: 'Click event handler',
    },
  },
} satisfies Meta<typeof QuantityInputButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default plus button with large size.
 */
export const Default: Story = {
  args: {
    type: 'plus',
    size: 'lg',
    'aria-label': 'Increase quantity',
  },
};

/**
 * Both button types displayed side by side: Minus (left) and Plus (right).
 */
export const AllTypes: Story = {
  args: {
    type: 'plus',
    'aria-label': 'Quantity button',
  },
  render: () => (
    <div className="flex gap-4">
      <div className="text-center">
        <QuantityInputButton type="minus" aria-label="Decrease quantity" />
        <p className="mt-2 text-sm text-text-subtle">Minus</p>
      </div>
      <div className="text-center">
        <QuantityInputButton type="plus" aria-label="Increase quantity" />
        <p className="mt-2 text-sm text-text-subtle">Plus</p>
      </div>
    </div>
  ),
};

/**
 * Comparison of all three sizes: SM (32px), MD (40px), LG (48px).
 */
export const AllSizes: Story = {
  args: {
    type: 'plus',
    'aria-label': 'Quantity button',
  },
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Plus Button Sizes
        </h3>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <QuantityInputButton type="plus" size="sm" aria-label="Small" />
            <p className="mt-2 text-xs text-text-subtle">SM (32px)</p>
          </div>
          <div className="text-center">
            <QuantityInputButton type="plus" size="md" aria-label="Medium" />
            <p className="mt-2 text-xs text-text-subtle">MD (40px)</p>
          </div>
          <div className="text-center">
            <QuantityInputButton type="plus" size="lg" aria-label="Large" />
            <p className="mt-2 text-xs text-text-subtle">LG (48px)</p>
          </div>
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Minus Button Sizes
        </h3>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <QuantityInputButton type="minus" size="sm" aria-label="Small" />
            <p className="mt-2 text-xs text-text-subtle">SM (32px)</p>
          </div>
          <div className="text-center">
            <QuantityInputButton type="minus" size="md" aria-label="Medium" />
            <p className="mt-2 text-xs text-text-subtle">MD (40px)</p>
          </div>
          <div className="text-center">
            <QuantityInputButton type="minus" size="lg" aria-label="Large" />
            <p className="mt-2 text-xs text-text-subtle">LG (48px)</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Visual demonstration of all interactive states.
 * Note: Hover and Active states can be seen by interacting with the buttons.
 */
export const AllStates: Story = {
  args: {
    type: 'plus',
    'aria-label': 'Quantity button',
  },
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-24 text-sm text-text-subtle">Default</div>
        <QuantityInputButton type="minus" aria-label="Default minus" />
        <QuantityInputButton type="plus" aria-label="Default plus" />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24 text-sm text-text-subtle">Disabled</div>
        <QuantityInputButton type="minus" disabled aria-label="Disabled minus" />
        <QuantityInputButton type="plus" disabled aria-label="Disabled plus" />
      </div>
      <p className="mt-4 text-xs text-text-secondary">
        * Hover, Active, and Focus states can be observed by interacting with the
        Default buttons
      </p>
    </div>
  ),
};

/**
 * Both button types in disabled state.
 */
export const Disabled: Story = {
  args: {
    type: 'plus',
    'aria-label': 'Quantity button',
  },
  render: () => (
    <div className="flex gap-4">
      <QuantityInputButton type="minus" disabled aria-label="Cannot decrease" />
      <QuantityInputButton type="plus" disabled aria-label="Cannot increase" />
    </div>
  ),
};

/**
 * Side-by-side comparison of Minus and Plus buttons in all sizes.
 */
export const TypeComparison: Story = {
  args: {
    type: 'plus',
    'aria-label': 'Quantity button',
  },
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Small (32px)
        </h3>
        <div className="flex items-center gap-2">
          <QuantityInputButton type="minus" size="sm" aria-label="Decrease" />
          <span className="px-4 text-sm">vs</span>
          <QuantityInputButton type="plus" size="sm" aria-label="Increase" />
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Medium (40px)
        </h3>
        <div className="flex items-center gap-2">
          <QuantityInputButton type="minus" size="md" aria-label="Decrease" />
          <span className="px-4 text-sm">vs</span>
          <QuantityInputButton type="plus" size="md" aria-label="Increase" />
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Large (48px)
        </h3>
        <div className="flex items-center gap-2">
          <QuantityInputButton type="minus" size="lg" aria-label="Decrease" />
          <span className="px-4 text-sm">vs</span>
          <QuantityInputButton type="plus" size="lg" aria-label="Increase" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Real-world example showing buttons flanking an input field.
 * Demonstrates the intended composition pattern with seamless borders.
 */
export const WithQuantityInput: Story = {
  args: {
    type: 'plus',
    'aria-label': 'Quantity button',
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">Large Size</h3>
        <div className="inline-flex items-center">
          <QuantityInputButton
            type="minus"
            size="lg"
            aria-label="Decrease quantity"
          />
          <input
            type="text"
            defaultValue="1"
            className="h-12 w-16 border-y border-border bg-background text-center text-base focus:ring-2 focus:ring-primary focus:outline-none"
            aria-label="Quantity"
          />
          <QuantityInputButton
            type="plus"
            size="lg"
            aria-label="Increase quantity"
          />
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">Medium Size</h3>
        <div className="inline-flex items-center">
          <QuantityInputButton
            type="minus"
            size="md"
            aria-label="Decrease quantity"
          />
          <input
            type="text"
            defaultValue="5"
            className="h-10 w-14 border-y border-border bg-background text-center text-base focus:ring-2 focus:ring-primary focus:outline-none"
            aria-label="Quantity"
          />
          <QuantityInputButton
            type="plus"
            size="md"
            aria-label="Increase quantity"
          />
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">Small Size</h3>
        <div className="inline-flex items-center">
          <QuantityInputButton
            type="minus"
            size="sm"
            aria-label="Decrease quantity"
          />
          <input
            type="text"
            defaultValue="10"
            className="h-8 w-12 border-y border-border bg-background text-center text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            aria-label="Quantity"
          />
          <QuantityInputButton
            type="plus"
            size="sm"
            aria-label="Increase quantity"
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Functional demo with working increment/decrement.
 */
export const InteractiveDemo: Story = {
  args: {
    type: 'plus',
    'aria-label': 'Quantity button',
  },
  render: function InteractiveDemoRender() {
    const [quantity, setQuantity] = useState(1);
    const min = 0;
    const max = 99;

    const decrease = () => setQuantity((prev) => Math.max(min, prev - 1));
    const increase = () => setQuantity((prev) => Math.min(max, prev + 1));

    return (
      <div className="space-y-4">
        <div className="inline-flex items-center">
          <QuantityInputButton
            type="minus"
            size="lg"
            aria-label="Decrease quantity"
            onClick={decrease}
            disabled={quantity <= min}
          />
          <input
            type="text"
            value={quantity}
            readOnly
            className="h-12 w-16 border-y border-border bg-background text-center text-base"
            aria-label="Current quantity"
          />
          <QuantityInputButton
            type="plus"
            size="lg"
            aria-label="Increase quantity"
            onClick={increase}
            disabled={quantity >= max}
          />
        </div>
        <p className="text-sm text-text-subtle">
          Range: {min} - {max} | Current: {quantity}
        </p>
      </div>
    );
  },
};

/**
 * Demonstrates proper aria-label usage with screen reader annotations.
 * Each button has a descriptive label explaining its action.
 */
export const AccessibilityExample: Story = {
  args: {
    type: 'plus',
    'aria-label': 'Quantity button',
  },
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Product Quantity (aria-label examples)
        </h3>
        <div className="inline-flex items-center">
          <QuantityInputButton
            type="minus"
            size="lg"
            aria-label="Decrease product quantity"
          />
          <input
            type="text"
            defaultValue="2"
            className="h-12 w-16 border-y border-border bg-background text-center text-base"
            aria-label="Product quantity"
          />
          <QuantityInputButton
            type="plus"
            size="lg"
            aria-label="Increase product quantity"
          />
        </div>
        <div className="mt-3 rounded bg-background-secondary p-3 text-xs text-text-subtle">
          <strong>Screen reader announces:</strong>
          <ul className="mt-1 list-disc pl-4">
            <li>Minus button: &quot;Decrease product quantity, button&quot;</li>
            <li>Input: &quot;Product quantity, 2, text&quot;</li>
            <li>Plus button: &quot;Increase product quantity, button&quot;</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Cart Item Quantity
        </h3>
        <div className="inline-flex items-center">
          <QuantityInputButton
            type="minus"
            size="md"
            aria-label="Remove one Blue T-Shirt from cart"
          />
          <input
            type="text"
            defaultValue="3"
            className="h-10 w-14 border-y border-border bg-background text-center text-base"
            aria-label="Blue T-Shirt quantity in cart"
          />
          <QuantityInputButton
            type="plus"
            size="md"
            aria-label="Add one more Blue T-Shirt to cart"
          />
        </div>
        <div className="mt-3 rounded bg-background-secondary p-3 text-xs text-text-subtle">
          <strong>Context-aware labels:</strong> Include product name for better
          UX
        </div>
      </div>
    </div>
  ),
};
