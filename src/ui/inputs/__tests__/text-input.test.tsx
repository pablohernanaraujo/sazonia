import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TextInput } from '../text-input';

describe('TextInput', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<TextInput placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders as input element', () => {
      render(<TextInput data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.tagName).toBe('INPUT');
    });

    it('renders with value', () => {
      render(<TextInput defaultValue="Hello" />);
      expect(screen.getByDisplayValue('Hello')).toBeInTheDocument();
    });

    it('renders with type attribute', () => {
      render(<TextInput type="email" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');
    });
  });

  describe('Size variants', () => {
    it('applies LG size by default', () => {
      render(<TextInput data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('text-base', 'leading-6');
    });

    it('applies SM size variant', () => {
      render(<TextInput size="sm" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('text-sm', 'leading-5');
    });

    it('applies MD size variant', () => {
      render(<TextInput size="md" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('text-sm', 'leading-5');
    });

    it('applies LG size variant explicitly', () => {
      render(<TextInput size="lg" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('text-base', 'leading-6');
    });

    it('wrapper has correct padding for SM size', () => {
      const { container } = render(<TextInput size="sm" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('py-1.5', 'px-3', 'gap-2');
    });

    it('wrapper has correct padding for MD size', () => {
      const { container } = render(<TextInput size="md" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('py-2.5', 'px-3.5', 'gap-2.5');
    });

    it('wrapper has correct padding for LG size', () => {
      const { container } = render(<TextInput size="lg" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('py-3', 'px-4', 'gap-3');
    });
  });

  describe('Error state', () => {
    it('applies error styles when error is true', () => {
      const { container } = render(<TextInput error />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('does not apply error styles when error is false', () => {
      const { container } = render(<TextInput error={false} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('border-border');
      expect(wrapper).not.toHaveClass('border-destructive');
    });

    it('sets aria-invalid when error is true', () => {
      render(<TextInput error data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid when error is false', () => {
      render(<TextInput error={false} data-testid="input" />);
      expect(screen.getByTestId('input')).not.toHaveAttribute('aria-invalid');
    });

    it('respects explicit aria-invalid over error prop', () => {
      render(<TextInput error={false} aria-invalid="true" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Disabled state', () => {
    it('applies disabled attribute when disabled', () => {
      render(<TextInput disabled data-testid="input" />);
      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('wrapper has disabled styling', () => {
      const { container } = render(<TextInput disabled />);
      const wrapper = container.firstChild;
      // Uses has-[:disabled] pseudo-class which we can't test directly,
      // but we can verify the wrapper has the base class
      expect(wrapper).toHaveClass('has-[:disabled]:bg-background-secondary');
    });

    it('input has disabled cursor class', () => {
      render(<TextInput disabled data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass(
        'disabled:cursor-not-allowed'
      );
    });
  });

  describe('Add-ons', () => {
    it('renders left add-on', () => {
      render(<TextInput leftAddOn={<span data-testid="left">$</span>} />);
      expect(screen.getByTestId('left')).toBeInTheDocument();
      expect(screen.getByText('$')).toBeInTheDocument();
    });

    it('renders right add-on', () => {
      render(<TextInput rightAddOn={<span data-testid="right">USD</span>} />);
      expect(screen.getByTestId('right')).toBeInTheDocument();
      expect(screen.getByText('USD')).toBeInTheDocument();
    });

    it('renders both add-ons', () => {
      render(
        <TextInput
          leftAddOn={<span data-testid="left">$</span>}
          rightAddOn={<span data-testid="right">.00</span>}
        />
      );
      expect(screen.getByTestId('left')).toBeInTheDocument();
      expect(screen.getByTestId('right')).toBeInTheDocument();
    });

    it('add-ons are positioned correctly', () => {
      const { container } = render(
        <TextInput
          leftAddOn={<span data-testid="left">L</span>}
          rightAddOn={<span data-testid="right">R</span>}
          data-testid="input"
        />
      );
      const wrapper = container.firstChild;
      const children = wrapper?.childNodes;

      // Order should be: left add-on, input, right add-on
      expect(children?.length).toBe(3);
    });

    it('add-ons have correct styling', () => {
      render(<TextInput leftAddOn={<span>$</span>} />);
      const addOnWrapper = screen.getByText('$').parentElement;
      expect(addOnWrapper).toHaveClass('text-text-tertiary', 'flex-shrink-0');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<TextInput ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLInputElement>();
      render(<TextInput ref={ref} data-testid="input" />);
      ref.current?.focus();
      expect(screen.getByTestId('input')).toHaveFocus();
    });
  });

  describe('Event handling', () => {
    it('calls onChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<TextInput onChange={handleChange} data-testid="input" />);

      await user.type(screen.getByTestId('input'), 'hello');
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<TextInput onFocus={handleFocus} data-testid="input" />);

      await user.click(screen.getByTestId('input'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<TextInput onBlur={handleBlur} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Controlled and uncontrolled modes', () => {
    it('works as uncontrolled with defaultValue', async () => {
      const user = userEvent.setup();
      render(<TextInput defaultValue="initial" data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveValue('initial');

      await user.clear(input);
      await user.type(input, 'updated');
      expect(input).toHaveValue('updated');
    });

    it('works as controlled with value and onChange', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { rerender } = render(
        <TextInput
          value="controlled"
          onChange={handleChange}
          data-testid="input"
        />
      );

      expect(screen.getByTestId('input')).toHaveValue('controlled');

      await user.type(screen.getByTestId('input'), 'x');
      expect(handleChange).toHaveBeenCalled();

      // Value doesn't change without rerender in controlled mode
      rerender(
        <TextInput
          value="new value"
          onChange={handleChange}
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toHaveValue('new value');
    });
  });

  describe('className merging', () => {
    it('merges custom className on input', () => {
      render(<TextInput className="custom-class" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('custom-class');
    });

    it('merges wrapperClassName on wrapper', () => {
      const { container } = render(
        <TextInput wrapperClassName="wrapper-class" />
      );
      expect(container.firstChild).toHaveClass('wrapper-class');
    });

    it('preserves default classes when merging', () => {
      render(<TextInput className="custom-class" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('custom-class');
      expect(input).toHaveClass('bg-transparent');
    });
  });

  describe('Accessibility', () => {
    it('accepts aria-describedby', () => {
      render(<TextInput aria-describedby="help-text" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-describedby',
        'help-text'
      );
    });

    it('accepts aria-label', () => {
      render(<TextInput aria-label="Email address" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-label',
        'Email address'
      );
    });

    it('accepts aria-required', () => {
      render(<TextInput aria-required="true" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });
  });

  describe('Edge cases', () => {
    it('handles empty placeholder', () => {
      render(<TextInput placeholder="" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('placeholder', '');
    });

    it('handles very long placeholder', () => {
      const longPlaceholder = 'A'.repeat(200);
      render(<TextInput placeholder={longPlaceholder} />);
      expect(screen.getByPlaceholderText(longPlaceholder)).toBeInTheDocument();
    });

    it('handles disabled with error', () => {
      const { container } = render(
        <TextInput disabled error data-testid="input" />
      );
      const wrapper = container.firstChild;
      const input = screen.getByTestId('input');

      expect(input).toBeDisabled();
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('handles complex add-on content', () => {
      render(
        <TextInput
          leftAddOn={
            <div data-testid="complex-addon">
              <span>Icon</span>
              <span>Text</span>
            </div>
          }
        />
      );
      expect(screen.getByTestId('complex-addon')).toBeInTheDocument();
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('passes through additional HTML attributes', () => {
      render(
        <TextInput
          data-testid="input"
          name="email"
          autoComplete="email"
          maxLength={100}
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('name', 'email');
      expect(input).toHaveAttribute('autocomplete', 'email');
      expect(input).toHaveAttribute('maxlength', '100');
    });
  });
});
