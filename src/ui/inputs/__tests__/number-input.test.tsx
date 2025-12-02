import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { NumberInput } from '../number-input';

describe('NumberInput', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<NumberInput placeholder="Enter number" />);
      expect(screen.getByPlaceholderText('Enter number')).toBeInTheDocument();
    });

    it('renders as input element with type number', () => {
      render(<NumberInput data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.tagName).toBe('INPUT');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('renders with value', () => {
      render(<NumberInput defaultValue={42} />);
      expect(screen.getByDisplayValue('42')).toBeInTheDocument();
    });

    it('renders stepper buttons', () => {
      render(<NumberInput />);
      expect(screen.getByLabelText('Increment value')).toBeInTheDocument();
      expect(screen.getByLabelText('Decrement value')).toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('applies LG size by default', () => {
      render(<NumberInput data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('text-base', 'leading-6');
    });

    it('applies SM size variant', () => {
      render(<NumberInput size="sm" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('text-sm', 'leading-5');
    });

    it('applies MD size variant', () => {
      render(<NumberInput size="md" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('text-sm', 'leading-5');
    });

    it('applies LG size variant explicitly', () => {
      render(<NumberInput size="lg" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('text-base', 'leading-6');
    });

    it('wrapper has correct padding for SM size', () => {
      const { container } = render(<NumberInput size="sm" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('py-1.5', 'pl-3', 'pr-1', 'gap-2');
    });

    it('wrapper has correct padding for MD size', () => {
      const { container } = render(<NumberInput size="md" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('py-2.5', 'pl-3.5', 'pr-1', 'gap-2.5');
    });

    it('wrapper has correct padding for LG size', () => {
      const { container } = render(<NumberInput size="lg" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('py-3', 'pl-4', 'pr-1', 'gap-3');
    });
  });

  describe('Error state', () => {
    it('applies error styles when error is true', () => {
      const { container } = render(<NumberInput error />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('does not apply error styles when error is false', () => {
      const { container } = render(<NumberInput error={false} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('border-border');
      expect(wrapper).not.toHaveClass('border-destructive');
    });

    it('sets aria-invalid when error is true', () => {
      render(<NumberInput error data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid when error is false', () => {
      render(<NumberInput error={false} data-testid="input" />);
      expect(screen.getByTestId('input')).not.toHaveAttribute('aria-invalid');
    });

    it('respects explicit aria-invalid over error prop', () => {
      render(
        <NumberInput error={false} aria-invalid="true" data-testid="input" />
      );
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Disabled state', () => {
    it('applies disabled attribute when disabled', () => {
      render(<NumberInput disabled data-testid="input" />);
      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('disables stepper buttons when input is disabled', () => {
      render(<NumberInput disabled />);
      expect(screen.getByLabelText('Increment value')).toBeDisabled();
      expect(screen.getByLabelText('Decrement value')).toBeDisabled();
    });

    it('wrapper has disabled styling', () => {
      const { container } = render(<NumberInput disabled />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('has-[:disabled]:bg-background-secondary');
    });

    it('input has disabled cursor class', () => {
      render(<NumberInput disabled data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass(
        'disabled:cursor-not-allowed'
      );
    });
  });

  describe('Left Add-on', () => {
    it('renders left add-on', () => {
      render(<NumberInput leftAddOn={<span data-testid="left">$</span>} />);
      expect(screen.getByTestId('left')).toBeInTheDocument();
      expect(screen.getByText('$')).toBeInTheDocument();
    });

    it('add-on has correct styling', () => {
      render(<NumberInput leftAddOn={<span>$</span>} />);
      const addOnWrapper = screen.getByText('$').parentElement;
      expect(addOnWrapper).toHaveClass('text-text-tertiary', 'shrink-0');
    });
  });

  describe('Stepper functionality', () => {
    it('increments value when increment button is clicked', async () => {
      const user = userEvent.setup();
      render(<NumberInput defaultValue={5} data-testid="input" />);

      await user.click(screen.getByLabelText('Increment value'));
      expect(screen.getByTestId('input')).toHaveValue(6);
    });

    it('decrements value when decrement button is clicked', async () => {
      const user = userEvent.setup();
      render(<NumberInput defaultValue={5} data-testid="input" />);

      await user.click(screen.getByLabelText('Decrement value'));
      expect(screen.getByTestId('input')).toHaveValue(4);
    });

    it('respects step value for increment', async () => {
      const user = userEvent.setup();
      render(<NumberInput defaultValue={0} step={5} data-testid="input" />);

      await user.click(screen.getByLabelText('Increment value'));
      expect(screen.getByTestId('input')).toHaveValue(5);
    });

    it('respects step value for decrement', async () => {
      const user = userEvent.setup();
      render(<NumberInput defaultValue={10} step={5} data-testid="input" />);

      await user.click(screen.getByLabelText('Decrement value'));
      expect(screen.getByTestId('input')).toHaveValue(5);
    });

    it('handles decimal step values correctly', async () => {
      const user = userEvent.setup();
      render(<NumberInput defaultValue={0.1} step={0.1} data-testid="input" />);

      await user.click(screen.getByLabelText('Increment value'));
      // Should be 0.2, not 0.20000000000000001
      expect(screen.getByTestId('input')).toHaveValue(0.2);
    });
  });

  describe('Min/Max bounds', () => {
    it('does not increment beyond max', async () => {
      const user = userEvent.setup();
      render(<NumberInput defaultValue={10} max={10} data-testid="input" />);

      await user.click(screen.getByLabelText('Increment value'));
      expect(screen.getByTestId('input')).toHaveValue(10);
    });

    it('does not decrement below min', async () => {
      const user = userEvent.setup();
      render(<NumberInput defaultValue={0} min={0} data-testid="input" />);

      await user.click(screen.getByLabelText('Decrement value'));
      expect(screen.getByTestId('input')).toHaveValue(0);
    });

    it('disables increment button when at max', () => {
      render(<NumberInput value={10} max={10} />);
      expect(screen.getByLabelText('Increment value')).toBeDisabled();
    });

    it('disables decrement button when at min', () => {
      render(<NumberInput value={0} min={0} />);
      expect(screen.getByLabelText('Decrement value')).toBeDisabled();
    });

    it('enables both buttons when value is between min and max', () => {
      render(<NumberInput value={5} min={0} max={10} />);
      expect(screen.getByLabelText('Increment value')).not.toBeDisabled();
      expect(screen.getByLabelText('Decrement value')).not.toBeDisabled();
    });
  });

  describe('Keyboard navigation', () => {
    it('increments with ArrowUp', async () => {
      const user = userEvent.setup();
      render(<NumberInput defaultValue={5} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{ArrowUp}');
      expect(input).toHaveValue(6);
    });

    it('decrements with ArrowDown', async () => {
      const user = userEvent.setup();
      render(<NumberInput defaultValue={5} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      expect(input).toHaveValue(4);
    });

    it('increments by 10*step with PageUp', async () => {
      const user = userEvent.setup();
      render(<NumberInput defaultValue={5} step={1} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{PageUp}');
      expect(input).toHaveValue(15);
    });

    it('decrements by 10*step with PageDown', async () => {
      const user = userEvent.setup();
      render(<NumberInput defaultValue={50} step={1} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{PageDown}');
      expect(input).toHaveValue(40);
    });

    it('sets value to min with Home key', async () => {
      const user = userEvent.setup();
      render(
        <NumberInput defaultValue={50} min={0} max={100} data-testid="input" />
      );

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{Home}');
      expect(input).toHaveValue(0);
    });

    it('sets value to max with End key', async () => {
      const user = userEvent.setup();
      render(
        <NumberInput defaultValue={50} min={0} max={100} data-testid="input" />
      );

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{End}');
      expect(input).toHaveValue(100);
    });

    it('respects bounds with PageUp', async () => {
      const user = userEvent.setup();
      render(
        <NumberInput defaultValue={95} max={100} step={1} data-testid="input" />
      );

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{PageUp}');
      expect(input).toHaveValue(100);
    });

    it('respects bounds with PageDown', async () => {
      const user = userEvent.setup();
      render(
        <NumberInput defaultValue={5} min={0} step={1} data-testid="input" />
      );

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{PageDown}');
      expect(input).toHaveValue(0);
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<NumberInput ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLInputElement>();
      render(<NumberInput ref={ref} data-testid="input" />);
      ref.current?.focus();
      expect(screen.getByTestId('input')).toHaveFocus();
    });
  });

  describe('Event handling', () => {
    it('calls onChange when value changes via typing', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<NumberInput onChange={handleChange} data-testid="input" />);

      await user.type(screen.getByTestId('input'), '123');
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onChange when stepper is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <NumberInput
          defaultValue={5}
          onChange={handleChange}
          data-testid="input"
        />
      );

      await user.click(screen.getByLabelText('Increment value'));
      // onChange is triggered via synthetic event
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<NumberInput onFocus={handleFocus} data-testid="input" />);

      await user.click(screen.getByTestId('input'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<NumberInput onBlur={handleBlur} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Controlled and uncontrolled modes', () => {
    it('works as uncontrolled with defaultValue', async () => {
      const user = userEvent.setup();
      render(<NumberInput defaultValue={10} data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveValue(10);

      await user.click(screen.getByLabelText('Increment value'));
      expect(input).toHaveValue(11);
    });

    it('works as controlled with value and onChange', async () => {
      const handleChange = vi.fn();
      const { rerender } = render(
        <NumberInput value={10} onChange={handleChange} data-testid="input" />
      );

      expect(screen.getByTestId('input')).toHaveValue(10);

      // Simulate clicking increment
      fireEvent.click(screen.getByLabelText('Increment value'));

      // Rerender with new value to simulate controlled update
      rerender(
        <NumberInput value={11} onChange={handleChange} data-testid="input" />
      );
      expect(screen.getByTestId('input')).toHaveValue(11);
    });
  });

  describe('className merging', () => {
    it('merges custom className on input', () => {
      render(<NumberInput className="custom-class" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('custom-class');
    });

    it('merges wrapperClassName on wrapper', () => {
      const { container } = render(
        <NumberInput wrapperClassName="wrapper-class" />
      );
      expect(container.firstChild).toHaveClass('wrapper-class');
    });

    it('preserves default classes when merging', () => {
      render(<NumberInput className="custom-class" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('custom-class');
      expect(input).toHaveClass('bg-transparent');
    });
  });

  describe('Accessibility', () => {
    it('accepts aria-describedby', () => {
      render(<NumberInput aria-describedby="help-text" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-describedby',
        'help-text'
      );
    });

    it('accepts aria-label', () => {
      render(<NumberInput aria-label="Quantity" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-label',
        'Quantity'
      );
    });

    it('accepts aria-required', () => {
      render(<NumberInput aria-required="true" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });

    it('stepper buttons have aria-labels', () => {
      render(<NumberInput />);
      expect(screen.getByLabelText('Increment value')).toBeInTheDocument();
      expect(screen.getByLabelText('Decrement value')).toBeInTheDocument();
    });

    it('stepper buttons have tabIndex -1 to prevent keyboard trap', () => {
      render(<NumberInput />);
      expect(screen.getByLabelText('Increment value')).toHaveAttribute(
        'tabindex',
        '-1'
      );
      expect(screen.getByLabelText('Decrement value')).toHaveAttribute(
        'tabindex',
        '-1'
      );
    });
  });

  describe('Edge cases', () => {
    it('handles empty input (starts at 0 for increment)', async () => {
      const user = userEvent.setup();
      render(<NumberInput data-testid="input" />);

      await user.click(screen.getByLabelText('Increment value'));
      expect(screen.getByTestId('input')).toHaveValue(1);
    });

    it('handles value of 0 (falsy but valid)', () => {
      render(<NumberInput value={0} data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveValue(0);
    });

    it('handles negative numbers when allowed', async () => {
      const user = userEvent.setup();
      render(<NumberInput defaultValue={0} min={-10} data-testid="input" />);

      await user.click(screen.getByLabelText('Decrement value'));
      expect(screen.getByTestId('input')).toHaveValue(-1);
    });

    it('handles disabled with error', () => {
      const { container } = render(
        <NumberInput disabled error data-testid="input" />
      );
      const wrapper = container.firstChild;
      const input = screen.getByTestId('input');

      expect(input).toBeDisabled();
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('handles complex add-on content', () => {
      render(
        <NumberInput
          leftAddOn={
            <div data-testid="complex-addon">
              <span>Qty:</span>
            </div>
          }
        />
      );
      expect(screen.getByTestId('complex-addon')).toBeInTheDocument();
      expect(screen.getByText('Qty:')).toBeInTheDocument();
    });

    it('passes through additional HTML attributes', () => {
      render(
        <NumberInput data-testid="input" name="quantity" autoComplete="off" />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('name', 'quantity');
      expect(input).toHaveAttribute('autocomplete', 'off');
    });

    it('hides native number input spinners', () => {
      render(<NumberInput data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('[appearance:textfield]');
      expect(input).toHaveClass('[&::-webkit-outer-spin-button]:appearance-none');
      expect(input).toHaveClass('[&::-webkit-inner-spin-button]:appearance-none');
    });
  });
});
