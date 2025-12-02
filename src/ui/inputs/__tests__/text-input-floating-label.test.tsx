import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TextInputFloatingLabel } from '../text-input-floating-label';

describe('TextInputFloatingLabel', () => {
  describe('Rendering', () => {
    it('renders with label', () => {
      render(<TextInputFloatingLabel label="Email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders as input element', () => {
      render(<TextInputFloatingLabel label="Email" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.tagName).toBe('INPUT');
    });

    it('renders with value', () => {
      render(
        <TextInputFloatingLabel label="Email" defaultValue="test@example.com" />
      );
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });

    it('renders with type attribute', () => {
      render(
        <TextInputFloatingLabel
          label="Password"
          type="password"
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');
    });

    it('renders required indicator when required', () => {
      render(<TextInputFloatingLabel label="Email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('required')).toHaveClass('sr-only');
    });

    it('does not render required indicator when not required', () => {
      render(<TextInputFloatingLabel label="Email" />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('Floating label behavior', () => {
    it('label starts in placeholder position when empty', () => {
      render(<TextInputFloatingLabel label="Email" />);
      const label = screen.getByText('Email');
      expect(label).toHaveClass('top-1/2', '-translate-y-1/2', 'scale-100');
    });

    it('label floats when input has value', () => {
      render(
        <TextInputFloatingLabel label="Email" defaultValue="test@example.com" />
      );
      const label = screen.getByText('Email');
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('label floats on focus', async () => {
      const user = userEvent.setup();
      render(<TextInputFloatingLabel label="Email" data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);

      const label = screen.getByText('Email');
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('label returns to placeholder position on blur if empty', async () => {
      const user = userEvent.setup();
      render(<TextInputFloatingLabel label="Email" data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.tab(); // blur

      const label = screen.getByText('Email');
      expect(label).toHaveClass('top-1/2', '-translate-y-1/2', 'scale-100');
    });

    it('label stays floated on blur if has value', async () => {
      const user = userEvent.setup();
      render(<TextInputFloatingLabel label="Email" data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.type(input, 'test@example.com');
      await user.tab(); // blur

      const label = screen.getByText('Email');
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('label has background notch effect when floating', () => {
      render(<TextInputFloatingLabel label="Email" defaultValue="test" />);
      const label = screen.getByText('Email');
      expect(label).toHaveClass('bg-background', 'px-1');
    });
  });

  describe('Placeholder behavior', () => {
    it('does not show placeholder when label is not floating', () => {
      render(
        <TextInputFloatingLabel
          label="Email"
          placeholder="you@example.com"
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).not.toHaveAttribute('placeholder', 'you@example.com');
    });

    it('shows placeholder when focused (label is floating)', async () => {
      const user = userEvent.setup();
      render(
        <TextInputFloatingLabel
          label="Email"
          placeholder="you@example.com"
          data-testid="input"
        />
      );

      const input = screen.getByTestId('input');
      await user.click(input);

      expect(input).toHaveAttribute('placeholder', 'you@example.com');
    });

    it('shows placeholder when has value (label is floating)', () => {
      render(
        <TextInputFloatingLabel
          label="Email"
          placeholder="you@example.com"
          defaultValue="test"
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('placeholder', 'you@example.com');
    });
  });

  describe('Error state', () => {
    it('applies error styles when error is true', () => {
      const { container } = render(
        <TextInputFloatingLabel label="Email" error />
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('label has error color when error is true', () => {
      render(<TextInputFloatingLabel label="Email" error />);
      const label = screen.getByText('Email');
      expect(label).toHaveClass('text-destructive');
    });

    it('label has error color even when floating and focused', async () => {
      const user = userEvent.setup();
      render(<TextInputFloatingLabel label="Email" error data-testid="input" />);

      await user.click(screen.getByTestId('input'));

      const label = screen.getByText('Email');
      expect(label).toHaveClass('text-destructive');
    });

    it('sets aria-invalid when error is true', () => {
      render(<TextInputFloatingLabel label="Email" error data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid when error is false', () => {
      render(
        <TextInputFloatingLabel label="Email" error={false} data-testid="input" />
      );
      expect(screen.getByTestId('input')).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('Disabled state', () => {
    it('applies disabled attribute when disabled', () => {
      render(
        <TextInputFloatingLabel label="Email" disabled data-testid="input" />
      );
      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('wrapper has disabled background', () => {
      const { container } = render(
        <TextInputFloatingLabel label="Email" disabled />
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('bg-background-secondary');
    });

    it('label has disabled color', () => {
      render(<TextInputFloatingLabel label="Email" disabled />);
      const label = screen.getByText('Email');
      expect(label).toHaveClass('text-text-tertiary');
    });

    it('input has disabled cursor class', () => {
      render(
        <TextInputFloatingLabel label="Email" disabled data-testid="input" />
      );
      expect(screen.getByTestId('input')).toHaveClass(
        'disabled:cursor-not-allowed'
      );
    });
  });

  describe('Add-ons', () => {
    it('renders left add-on', () => {
      render(
        <TextInputFloatingLabel
          label="Email"
          leftAddOn={<span data-testid="left">@</span>}
        />
      );
      expect(screen.getByTestId('left')).toBeInTheDocument();
      expect(screen.getByText('@')).toBeInTheDocument();
    });

    it('renders right add-on', () => {
      render(
        <TextInputFloatingLabel
          label="Email"
          rightAddOn={<span data-testid="right">.com</span>}
        />
      );
      expect(screen.getByTestId('right')).toBeInTheDocument();
      expect(screen.getByText('.com')).toBeInTheDocument();
    });

    it('renders both add-ons', () => {
      render(
        <TextInputFloatingLabel
          label="Price"
          leftAddOn={<span data-testid="left">$</span>}
          rightAddOn={<span data-testid="right">USD</span>}
        />
      );
      expect(screen.getByTestId('left')).toBeInTheDocument();
      expect(screen.getByTestId('right')).toBeInTheDocument();
    });

    it('label adjusts position when left add-on is present', () => {
      render(<TextInputFloatingLabel label="Email" leftAddOn={<span>@</span>} />);
      const label = screen.getByText('Email');
      expect(label).toHaveClass('left-10');
    });

    it('add-ons have correct styling', () => {
      render(<TextInputFloatingLabel label="Price" leftAddOn={<span>$</span>} />);
      const addOnWrapper = screen.getByText('$').parentElement;
      expect(addOnWrapper).toHaveClass('text-text-tertiary', 'shrink-0');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<TextInputFloatingLabel label="Email" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLInputElement>();
      render(
        <TextInputFloatingLabel label="Email" ref={ref} data-testid="input" />
      );
      ref.current?.focus();
      expect(screen.getByTestId('input')).toHaveFocus();
    });
  });

  describe('Event handling', () => {
    it('calls onChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <TextInputFloatingLabel
          label="Email"
          onChange={handleChange}
          data-testid="input"
        />
      );

      await user.type(screen.getByTestId('input'), 'hello');
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(
        <TextInputFloatingLabel
          label="Email"
          onFocus={handleFocus}
          data-testid="input"
        />
      );

      await user.click(screen.getByTestId('input'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(
        <TextInputFloatingLabel
          label="Email"
          onBlur={handleBlur}
          data-testid="input"
        />
      );

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Controlled and uncontrolled modes', () => {
    it('works as uncontrolled with defaultValue', async () => {
      const user = userEvent.setup();
      render(
        <TextInputFloatingLabel
          label="Email"
          defaultValue="initial"
          data-testid="input"
        />
      );

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
        <TextInputFloatingLabel
          label="Email"
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
        <TextInputFloatingLabel
          label="Email"
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
      render(
        <TextInputFloatingLabel
          label="Email"
          className="custom-class"
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toHaveClass('custom-class');
    });

    it('merges wrapperClassName on wrapper', () => {
      const { container } = render(
        <TextInputFloatingLabel label="Email" wrapperClassName="wrapper-class" />
      );
      expect(container.firstChild).toHaveClass('wrapper-class');
    });

    it('preserves default classes when merging', () => {
      render(
        <TextInputFloatingLabel
          label="Email"
          className="custom-class"
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('custom-class');
      expect(input).toHaveClass('bg-transparent');
    });
  });

  describe('Label-input association', () => {
    it('label is associated with input via htmlFor/id', () => {
      render(<TextInputFloatingLabel label="Email" />);
      const input = screen.getByLabelText('Email');
      expect(input).toBeInTheDocument();
    });

    it('uses provided id', () => {
      render(
        <TextInputFloatingLabel
          label="Email"
          id="custom-id"
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toHaveAttribute('id', 'custom-id');
    });

    it('generates unique id when not provided', () => {
      render(<TextInputFloatingLabel label="Email" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.id).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('accepts aria-describedby', () => {
      render(
        <TextInputFloatingLabel
          label="Email"
          aria-describedby="help-text"
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-describedby',
        'help-text'
      );
    });

    it('sets aria-required when required', () => {
      render(
        <TextInputFloatingLabel label="Email" required data-testid="input" />
      );
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });

    it('required indicator has aria-hidden', () => {
      render(<TextInputFloatingLabel label="Email" required />);
      const asterisk = screen.getByText('*');
      expect(asterisk).toHaveAttribute('aria-hidden', 'true');
    });

    it('required has screen reader text', () => {
      render(<TextInputFloatingLabel label="Email" required />);
      const srText = screen.getByText('required');
      expect(srText).toHaveClass('sr-only');
    });
  });

  describe('Label color states', () => {
    it('has tertiary color when not floating, not error', () => {
      render(<TextInputFloatingLabel label="Email" />);
      const label = screen.getByText('Email');
      expect(label).toHaveClass('text-text-tertiary');
    });

    it('has primary color when floating and focused (not error)', async () => {
      const user = userEvent.setup();
      render(<TextInputFloatingLabel label="Email" data-testid="input" />);

      await user.click(screen.getByTestId('input'));

      const label = screen.getByText('Email');
      expect(label).toHaveClass('text-primary');
    });

    it('has tertiary color when floating but not focused (not error)', () => {
      render(<TextInputFloatingLabel label="Email" defaultValue="test" />);
      const label = screen.getByText('Email');
      expect(label).toHaveClass('text-text-tertiary');
    });

    it('has destructive color when error (regardless of other state)', () => {
      render(<TextInputFloatingLabel label="Email" error />);
      const label = screen.getByText('Email');
      expect(label).toHaveClass('text-destructive');
    });
  });

  describe('Edge cases', () => {
    it('handles empty placeholder', () => {
      render(
        <TextInputFloatingLabel
          label="Email"
          placeholder=""
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).not.toHaveAttribute('placeholder');
    });

    it('handles very long label', () => {
      const longLabel = 'A'.repeat(100);
      render(<TextInputFloatingLabel label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles disabled with error', () => {
      const { container } = render(
        <TextInputFloatingLabel
          label="Email"
          disabled
          error
          data-testid="input"
        />
      );
      const wrapper = container.firstChild;
      const input = screen.getByTestId('input');

      expect(input).toBeDisabled();
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('handles disabled with value', () => {
      render(
        <TextInputFloatingLabel
          label="Email"
          disabled
          defaultValue="test@example.com"
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toBeDisabled();
      expect(input).toHaveValue('test@example.com');

      // Label should be floating since there's a value
      const label = screen.getByText('Email');
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('handles complex add-on content', () => {
      render(
        <TextInputFloatingLabel
          label="Price"
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
        <TextInputFloatingLabel
          label="Email"
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

    it('handles whitespace-only value as having value', () => {
      render(<TextInputFloatingLabel label="Email" defaultValue="   " />);
      const label = screen.getByText('Email');
      // Whitespace is still a value, so label should float
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });
  });
});
