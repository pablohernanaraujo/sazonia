import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { QuantityInput } from '../quantity-input';

describe('QuantityInput', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<QuantityInput data-testid="input" />);
      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('renders as input element with type number', () => {
      render(<QuantityInput data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.tagName).toBe('INPUT');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('renders with defaultValue', () => {
      render(<QuantityInput defaultValue={42} data-testid="input" />);
      expect(screen.getByDisplayValue('42')).toBeInTheDocument();
    });

    it('renders both quantity buttons', () => {
      render(<QuantityInput />);
      expect(screen.getByLabelText('Decrease quantity')).toBeInTheDocument();
      expect(screen.getByLabelText('Increase quantity')).toBeInTheDocument();
    });

    it('renders with role spinbutton', () => {
      render(<QuantityInput data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('role', 'spinbutton');
    });

    it('renders custom aria labels for buttons', () => {
      render(
        <QuantityInput
          decreaseAriaLabel="Remove item"
          increaseAriaLabel="Add item"
        />
      );
      expect(screen.getByLabelText('Remove item')).toBeInTheDocument();
      expect(screen.getByLabelText('Add item')).toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('applies LG size by default', () => {
      render(<QuantityInput data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('h-12', 'w-16', 'text-base', 'leading-6');
    });

    it('applies SM size variant', () => {
      render(<QuantityInput size="sm" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('h-8', 'w-10', 'text-sm', 'leading-5');
    });

    it('applies MD size variant', () => {
      render(<QuantityInput size="md" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('h-10', 'w-12', 'text-sm', 'leading-5');
    });

    it('applies LG size variant explicitly', () => {
      render(<QuantityInput size="lg" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('h-12', 'w-16', 'text-base', 'leading-6');
    });
  });

  describe('Label rendering', () => {
    it('renders label when provided', () => {
      render(<QuantityInput label="Quantity" />);
      expect(screen.getByText('Quantity')).toBeInTheDocument();
    });

    it('renders label with required indicator', () => {
      render(<QuantityInput label="Quantity" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('label is associated with input via htmlFor', () => {
      render(<QuantityInput label="Quantity" id="qty" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('id', 'qty');
      const label = screen.getByText('Quantity').closest('label');
      expect(label).toHaveAttribute('for', 'qty');
    });

    it('renders label description when provided', () => {
      render(<QuantityInput label="Quantity" labelDescription="Enter amount" />);
      expect(screen.getByText('Enter amount')).toBeInTheDocument();
    });
  });

  describe('Hint rendering', () => {
    it('renders hint when provided', () => {
      render(<QuantityInput hint="Maximum 10 items" />);
      expect(screen.getByText('Maximum 10 items')).toBeInTheDocument();
    });

    it('hint has correct id for aria-describedby', () => {
      render(<QuantityInput hint="Maximum 10" id="qty" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-describedby', 'qty-hint');
      expect(screen.getByText('Maximum 10')).toHaveAttribute('id', 'qty-hint');
    });

    it('does not render hint when in error state', () => {
      render(<QuantityInput hint="Maximum 10" error errorMessage="Error" />);
      expect(screen.queryByText('Maximum 10')).not.toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('renders error message when error is true and message provided', () => {
      render(<QuantityInput error errorMessage="Invalid quantity" />);
      expect(screen.getByText('Invalid quantity')).toBeInTheDocument();
    });

    it('applies error styles when error is true', () => {
      render(<QuantityInput error data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('border-destructive');
    });

    it('sets aria-invalid when error is true', () => {
      render(<QuantityInput error data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('error message has correct id for aria-describedby', () => {
      render(
        <QuantityInput error errorMessage="Error" id="qty" data-testid="input" />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-describedby', 'qty-error');
    });

    it('respects explicit aria-invalid over error prop', () => {
      render(
        <QuantityInput error={false} aria-invalid="true" data-testid="input" />
      );
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Disabled state', () => {
    it('applies disabled attribute when disabled', () => {
      render(<QuantityInput disabled data-testid="input" />);
      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('disables both buttons when input is disabled', () => {
      render(<QuantityInput disabled />);
      expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
      expect(screen.getByLabelText('Increase quantity')).toBeDisabled();
    });

    it('input has disabled styling', () => {
      render(<QuantityInput disabled data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('disabled:cursor-not-allowed');
      expect(input).toHaveClass('disabled:bg-background-secondary');
    });
  });

  describe('Button functionality', () => {
    it('increments value when plus button is clicked', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={5} data-testid="input" />);

      await user.click(screen.getByLabelText('Increase quantity'));
      expect(screen.getByTestId('input')).toHaveValue(6);
    });

    it('decrements value when minus button is clicked', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={5} data-testid="input" />);

      await user.click(screen.getByLabelText('Decrease quantity'));
      expect(screen.getByTestId('input')).toHaveValue(4);
    });

    it('respects step value for increment', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={0} step={5} data-testid="input" />);

      await user.click(screen.getByLabelText('Increase quantity'));
      expect(screen.getByTestId('input')).toHaveValue(5);
    });

    it('respects step value for decrement', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={10} step={5} data-testid="input" />);

      await user.click(screen.getByLabelText('Decrease quantity'));
      expect(screen.getByTestId('input')).toHaveValue(5);
    });

    it('handles decimal step values correctly', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={0.1} step={0.1} data-testid="input" />);

      await user.click(screen.getByLabelText('Increase quantity'));
      // Should be 0.2, not 0.20000000000000001
      expect(screen.getByTestId('input')).toHaveValue(0.2);
    });
  });

  describe('Min/Max bounds', () => {
    it('does not increment beyond max', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={10} max={10} data-testid="input" />);

      await user.click(screen.getByLabelText('Increase quantity'));
      expect(screen.getByTestId('input')).toHaveValue(10);
    });

    it('does not decrement below min', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={0} min={0} data-testid="input" />);

      await user.click(screen.getByLabelText('Decrease quantity'));
      expect(screen.getByTestId('input')).toHaveValue(0);
    });

    it('disables increment button when at max', () => {
      render(<QuantityInput value={10} max={10} />);
      expect(screen.getByLabelText('Increase quantity')).toBeDisabled();
    });

    it('disables decrement button when at min', () => {
      render(<QuantityInput value={0} min={0} />);
      expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
    });

    it('enables both buttons when value is between min and max', () => {
      render(<QuantityInput value={5} min={0} max={10} />);
      expect(screen.getByLabelText('Increase quantity')).not.toBeDisabled();
      expect(screen.getByLabelText('Decrease quantity')).not.toBeDisabled();
    });

    it('sets aria-valuemin when min is provided', () => {
      render(<QuantityInput min={0} data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-valuemin', '0');
    });

    it('sets aria-valuemax when max is provided', () => {
      render(<QuantityInput max={100} data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-valuemax', '100');
    });

    it('sets aria-valuenow with current value', () => {
      render(<QuantityInput value={5} data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-valuenow', '5');
    });
  });

  describe('Keyboard navigation', () => {
    it('increments with ArrowUp', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={5} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{ArrowUp}');
      expect(input).toHaveValue(6);
    });

    it('decrements with ArrowDown', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={5} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      expect(input).toHaveValue(4);
    });

    it('sets value to min with Home key', async () => {
      const user = userEvent.setup();
      render(
        <QuantityInput defaultValue={50} min={0} max={100} data-testid="input" />
      );

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{Home}');
      expect(input).toHaveValue(0);
    });

    it('sets value to max with End key', async () => {
      const user = userEvent.setup();
      render(
        <QuantityInput defaultValue={50} min={0} max={100} data-testid="input" />
      );

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{End}');
      expect(input).toHaveValue(100);
    });

    it('does not navigate with Home if min is undefined', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={50} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{Home}');
      // Value should remain unchanged (native behavior may occur)
      expect(input).toHaveValue(50);
    });

    it('does not navigate with End if max is undefined', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={50} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{End}');
      // Value should remain unchanged (native behavior may occur)
      expect(input).toHaveValue(50);
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<QuantityInput ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLInputElement>();
      render(<QuantityInput ref={ref} data-testid="input" />);
      ref.current?.focus();
      expect(screen.getByTestId('input')).toHaveFocus();
    });

    it('ref allows value access', () => {
      const ref = createRef<HTMLInputElement>();
      render(<QuantityInput ref={ref} defaultValue={42} />);
      expect(ref.current?.value).toBe('42');
    });
  });

  describe('Event handling', () => {
    it('calls onChange when value changes via typing', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<QuantityInput onChange={handleChange} data-testid="input" />);

      await user.type(screen.getByTestId('input'), '123');
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onChange when button is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <QuantityInput
          defaultValue={5}
          onChange={handleChange}
          data-testid="input"
        />
      );

      await user.click(screen.getByLabelText('Increase quantity'));
      // onChange is triggered via synthetic event
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<QuantityInput onFocus={handleFocus} data-testid="input" />);

      await user.click(screen.getByTestId('input'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<QuantityInput onBlur={handleBlur} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Controlled and uncontrolled modes', () => {
    it('works as uncontrolled with defaultValue', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={10} data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveValue(10);

      await user.click(screen.getByLabelText('Increase quantity'));
      expect(input).toHaveValue(11);
    });

    it('works as controlled with value and onChange', async () => {
      const handleChange = vi.fn();
      const { rerender } = render(
        <QuantityInput value={10} onChange={handleChange} data-testid="input" />
      );

      expect(screen.getByTestId('input')).toHaveValue(10);

      // Simulate clicking increment
      fireEvent.click(screen.getByLabelText('Increase quantity'));

      // Rerender with new value to simulate controlled update
      rerender(
        <QuantityInput value={11} onChange={handleChange} data-testid="input" />
      );
      expect(screen.getByTestId('input')).toHaveValue(11);
    });
  });

  describe('Blur behavior', () => {
    it('clamps value to min on blur when empty', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={5} min={1} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.clear(input);
      await user.tab();

      expect(input).toHaveValue(1);
    });

    it('clamps value to 0 on blur when empty and no min', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={5} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.clear(input);
      await user.tab();

      expect(input).toHaveValue(0);
    });

    it('clamps value to max on blur when exceeding', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={5} max={10} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.clear(input);
      await user.type(input, '100');
      await user.tab();

      expect(input).toHaveValue(10);
    });

    it('clamps value to min on blur when below', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={5} min={0} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.clear(input);
      await user.type(input, '-5');
      await user.tab();

      expect(input).toHaveValue(0);
    });
  });

  describe('className merging', () => {
    it('merges custom className on input', () => {
      render(<QuantityInput className="custom-class" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('custom-class');
    });

    it('merges wrapperClassName on wrapper', () => {
      const { container } = render(
        <QuantityInput wrapperClassName="wrapper-class" />
      );
      expect(container.firstChild).toHaveClass('wrapper-class');
    });

    it('preserves default classes when merging', () => {
      render(<QuantityInput className="custom-class" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('custom-class');
      expect(input).toHaveClass('text-center');
    });
  });

  describe('Accessibility', () => {
    it('accepts aria-describedby and combines with hint/error', () => {
      render(
        <QuantityInput
          aria-describedby="custom-help"
          hint="Hint text"
          id="qty"
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-describedby',
        'custom-help qty-hint'
      );
    });

    it('accepts aria-label', () => {
      render(<QuantityInput aria-label="Product quantity" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-label',
        'Product quantity'
      );
    });

    it('buttons have proper aria-labels', () => {
      render(<QuantityInput />);
      expect(screen.getByLabelText('Decrease quantity')).toBeInTheDocument();
      expect(screen.getByLabelText('Increase quantity')).toBeInTheDocument();
    });

    it('error message has role alert', () => {
      render(<QuantityInput error errorMessage="Error text" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles empty input (starts at min or 0 for increment)', async () => {
      const user = userEvent.setup();
      render(<QuantityInput data-testid="input" />);

      // With no min, internal value starts at 0
      await user.click(screen.getByLabelText('Increase quantity'));
      expect(screen.getByTestId('input')).toHaveValue(1);
    });

    it('handles value of 0 (falsy but valid)', () => {
      render(<QuantityInput value={0} data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveValue(0);
    });

    it('handles negative numbers when allowed', async () => {
      const user = userEvent.setup();
      render(<QuantityInput defaultValue={0} min={-10} data-testid="input" />);

      await user.click(screen.getByLabelText('Decrease quantity'));
      expect(screen.getByTestId('input')).toHaveValue(-1);
    });

    it('handles disabled with error', () => {
      render(<QuantityInput disabled error data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toBeDisabled();
      expect(input).toHaveClass('border-destructive');
    });

    it('passes through additional HTML attributes', () => {
      render(
        <QuantityInput data-testid="input" name="quantity" autoComplete="off" />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('name', 'quantity');
      expect(input).toHaveAttribute('autocomplete', 'off');
    });

    it('hides native number input spinners', () => {
      render(<QuantityInput data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('[appearance:textfield]');
      expect(input).toHaveClass('[&::-webkit-outer-spin-button]:appearance-none');
      expect(input).toHaveClass('[&::-webkit-inner-spin-button]:appearance-none');
    });

    it('handles rapid clicking on buttons', async () => {
      const user = userEvent.setup({ delay: null });
      render(<QuantityInput defaultValue={0} data-testid="input" />);

      const incrementButton = screen.getByLabelText('Increase quantity');
      await user.click(incrementButton);
      await user.click(incrementButton);
      await user.click(incrementButton);

      expect(screen.getByTestId('input')).toHaveValue(3);
    });

    it('handles label with all features', () => {
      render(
        <QuantityInput
          label="Quantity"
          required
          showLabelIcon
          labelDescription="Enter the quantity"
        />
      );
      expect(screen.getByText('Quantity')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('Enter the quantity')).toBeInTheDocument();
    });
  });

  describe('Size-based child component mapping', () => {
    it('uses sm label size for sm input', () => {
      const { container } = render(<QuantityInput size="sm" label="Quantity" />);
      const label = container.querySelector('label');
      expect(label).toHaveClass('pb-2.5'); // sm size
    });

    it('uses sm label size for md input', () => {
      const { container } = render(<QuantityInput size="md" label="Quantity" />);
      const label = container.querySelector('label');
      expect(label).toHaveClass('pb-2.5'); // sm size
    });

    it('uses md label size for lg input', () => {
      const { container } = render(<QuantityInput size="lg" label="Quantity" />);
      const label = container.querySelector('label');
      expect(label).toHaveClass('pb-3'); // md size
    });
  });
});
