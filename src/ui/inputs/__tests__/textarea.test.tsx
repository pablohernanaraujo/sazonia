import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Textarea } from '../textarea';

describe('Textarea', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Textarea placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders as textarea element', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('renders with value', () => {
      render(<Textarea defaultValue="Hello" />);
      expect(screen.getByDisplayValue('Hello')).toBeInTheDocument();
    });

    it('renders with rows attribute', () => {
      render(<Textarea rows={6} data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('rows', '6');
    });
  });

  describe('Size variants', () => {
    it('applies LG size by default', () => {
      render(<Textarea data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('text-base', 'leading-6');
    });

    it('applies MD size variant', () => {
      render(<Textarea size="md" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('text-sm', 'leading-5');
    });

    it('applies LG size variant explicitly', () => {
      render(<Textarea size="lg" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('text-base', 'leading-6');
    });

    it('wrapper has correct padding for MD size', () => {
      const { container } = render(<Textarea size="md" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('py-2.5', 'px-3', 'gap-2.5');
    });

    it('wrapper has correct padding for LG size', () => {
      const { container } = render(<Textarea size="lg" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('py-3', 'px-4', 'gap-3');
    });
  });

  describe('Error state', () => {
    it('applies error styles when error is true', () => {
      const { container } = render(<Textarea error />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('does not apply error styles when error is false', () => {
      const { container } = render(<Textarea error={false} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('border-border');
      expect(wrapper).not.toHaveClass('border-destructive');
    });

    it('sets aria-invalid when error is true', () => {
      render(<Textarea error data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('does not set aria-invalid when error is false', () => {
      render(<Textarea error={false} data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).not.toHaveAttribute('aria-invalid');
    });

    it('respects explicit aria-invalid over error prop', () => {
      render(
        <Textarea error={false} aria-invalid="true" data-testid="textarea" />
      );
      expect(screen.getByTestId('textarea')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });
  });

  describe('Disabled state', () => {
    it('applies disabled attribute when disabled', () => {
      render(<Textarea disabled data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toBeDisabled();
    });

    it('wrapper has disabled styling', () => {
      const { container } = render(<Textarea disabled />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('has-[:disabled]:bg-background-secondary');
    });

    it('textarea has disabled cursor class', () => {
      render(<Textarea disabled data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveClass(
        'disabled:cursor-not-allowed'
      );
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to textarea element', () => {
      const ref = createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} data-testid="textarea" />);
      ref.current?.focus();
      expect(screen.getByTestId('textarea')).toHaveFocus();
    });
  });

  describe('Event handling', () => {
    it('calls onChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Textarea onChange={handleChange} data-testid="textarea" />);

      await user.type(screen.getByTestId('textarea'), 'hello');
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<Textarea onFocus={handleFocus} data-testid="textarea" />);

      await user.click(screen.getByTestId('textarea'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<Textarea onBlur={handleBlur} data-testid="textarea" />);

      const textarea = screen.getByTestId('textarea');
      await user.click(textarea);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Controlled and uncontrolled modes', () => {
    it('works as uncontrolled with defaultValue', async () => {
      const user = userEvent.setup();
      render(<Textarea defaultValue="initial" data-testid="textarea" />);

      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveValue('initial');

      await user.clear(textarea);
      await user.type(textarea, 'updated');
      expect(textarea).toHaveValue('updated');
    });

    it('works as controlled with value and onChange', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { rerender } = render(
        <Textarea
          value="controlled"
          onChange={handleChange}
          data-testid="textarea"
        />
      );

      expect(screen.getByTestId('textarea')).toHaveValue('controlled');

      await user.type(screen.getByTestId('textarea'), 'x');
      expect(handleChange).toHaveBeenCalled();

      // Value doesn't change without rerender in controlled mode
      rerender(
        <Textarea
          value="new value"
          onChange={handleChange}
          data-testid="textarea"
        />
      );
      expect(screen.getByTestId('textarea')).toHaveValue('new value');
    });
  });

  describe('className merging', () => {
    it('merges custom className on textarea', () => {
      render(<Textarea className="custom-class" data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveClass('custom-class');
    });

    it('merges wrapperClassName on wrapper', () => {
      const { container } = render(<Textarea wrapperClassName="wrapper-class" />);
      expect(container.firstChild).toHaveClass('wrapper-class');
    });

    it('preserves default classes when merging', () => {
      render(<Textarea className="custom-class" data-testid="textarea" />);
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('custom-class');
      expect(textarea).toHaveClass('bg-transparent');
    });
  });

  describe('Accessibility', () => {
    it('accepts aria-describedby', () => {
      render(<Textarea aria-describedby="help-text" data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute(
        'aria-describedby',
        'help-text'
      );
    });

    it('accepts aria-label', () => {
      render(<Textarea aria-label="Message" data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute(
        'aria-label',
        'Message'
      );
    });

    it('accepts aria-required', () => {
      render(<Textarea aria-required="true" data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });
  });

  describe('Resize behavior', () => {
    it('has resize-y class by default', () => {
      render(<Textarea data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveClass('resize-y');
    });
  });

  describe('Edge cases', () => {
    it('handles empty placeholder', () => {
      render(<Textarea placeholder="" data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveAttribute('placeholder', '');
    });

    it('handles very long placeholder', () => {
      const longPlaceholder = 'A'.repeat(200);
      render(<Textarea placeholder={longPlaceholder} />);
      expect(screen.getByPlaceholderText(longPlaceholder)).toBeInTheDocument();
    });

    it('handles disabled with error', () => {
      const { container } = render(
        <Textarea disabled error data-testid="textarea" />
      );
      const wrapper = container.firstChild;
      const textarea = screen.getByTestId('textarea');

      expect(textarea).toBeDisabled();
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('handles multiline content', async () => {
      const user = userEvent.setup();
      render(<Textarea data-testid="textarea" />);

      const textarea = screen.getByTestId('textarea');
      await user.type(textarea, 'Line 1{enter}Line 2{enter}Line 3');
      expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3');
    });

    it('handles very long text content', () => {
      const longContent = 'A'.repeat(5000);
      render(<Textarea defaultValue={longContent} data-testid="textarea" />);
      expect(screen.getByTestId('textarea')).toHaveValue(longContent);
    });

    it('passes through additional HTML attributes', () => {
      render(
        <Textarea
          data-testid="textarea"
          name="message"
          autoComplete="off"
          maxLength={500}
        />
      );
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('name', 'message');
      expect(textarea).toHaveAttribute('autocomplete', 'off');
      expect(textarea).toHaveAttribute('maxlength', '500');
    });
  });
});
