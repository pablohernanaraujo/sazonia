import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TextareaFloatingLabel } from '../textarea-floating-label';

describe('TextareaFloatingLabel', () => {
  describe('Rendering', () => {
    it('renders with label', () => {
      render(<TextareaFloatingLabel label="Description" />);
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('renders as textarea element', () => {
      render(
        <TextareaFloatingLabel label="Description" data-testid="textarea" />
      );
      const textarea = screen.getByTestId('textarea');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('renders with value', () => {
      render(
        <TextareaFloatingLabel
          label="Description"
          defaultValue="Some text content"
        />
      );
      expect(screen.getByDisplayValue('Some text content')).toBeInTheDocument();
    });

    it('renders with rows attribute', () => {
      render(
        <TextareaFloatingLabel
          label="Description"
          rows={6}
          data-testid="textarea"
        />
      );
      expect(screen.getByTestId('textarea')).toHaveAttribute('rows', '6');
    });

    it('renders with default rows of 4', () => {
      render(
        <TextareaFloatingLabel label="Description" data-testid="textarea" />
      );
      expect(screen.getByTestId('textarea')).toHaveAttribute('rows', '4');
    });

    it('renders required indicator when required', () => {
      render(<TextareaFloatingLabel label="Description" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('required')).toHaveClass('sr-only');
    });

    it('does not render required indicator when not required', () => {
      render(<TextareaFloatingLabel label="Description" />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('Floating label behavior', () => {
    it('label starts in placeholder position when empty', () => {
      render(<TextareaFloatingLabel label="Description" />);
      const label = screen.getByText('Description');
      expect(label).toHaveClass('top-3.5', 'scale-100');
    });

    it('label floats when textarea has value', () => {
      render(
        <TextareaFloatingLabel
          label="Description"
          defaultValue="Some text content"
        />
      );
      const label = screen.getByText('Description');
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('label floats on focus', async () => {
      const user = userEvent.setup();
      render(
        <TextareaFloatingLabel label="Description" data-testid="textarea" />
      );

      const textarea = screen.getByTestId('textarea');
      await user.click(textarea);

      const label = screen.getByText('Description');
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('label returns to placeholder position on blur if empty', async () => {
      const user = userEvent.setup();
      render(
        <TextareaFloatingLabel label="Description" data-testid="textarea" />
      );

      const textarea = screen.getByTestId('textarea');
      await user.click(textarea);
      await user.tab(); // blur

      const label = screen.getByText('Description');
      expect(label).toHaveClass('top-3.5', 'scale-100');
    });

    it('label stays floated on blur if has value', async () => {
      const user = userEvent.setup();
      render(
        <TextareaFloatingLabel label="Description" data-testid="textarea" />
      );

      const textarea = screen.getByTestId('textarea');
      await user.click(textarea);
      await user.type(textarea, 'Some text content');
      await user.tab(); // blur

      const label = screen.getByText('Description');
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('label has background notch effect when floating', () => {
      render(<TextareaFloatingLabel label="Description" defaultValue="test" />);
      const label = screen.getByText('Description');
      expect(label).toHaveClass('bg-background', 'px-1');
    });
  });

  describe('Placeholder behavior', () => {
    it('does not show placeholder when label is not floating', () => {
      render(
        <TextareaFloatingLabel
          label="Description"
          placeholder="Enter description..."
          data-testid="textarea"
        />
      );
      const textarea = screen.getByTestId('textarea');
      expect(textarea).not.toHaveAttribute('placeholder', 'Enter description...');
    });

    it('shows placeholder when focused (label is floating)', async () => {
      const user = userEvent.setup();
      render(
        <TextareaFloatingLabel
          label="Description"
          placeholder="Enter description..."
          data-testid="textarea"
        />
      );

      const textarea = screen.getByTestId('textarea');
      await user.click(textarea);

      expect(textarea).toHaveAttribute('placeholder', 'Enter description...');
    });

    it('shows placeholder when has value (label is floating)', () => {
      render(
        <TextareaFloatingLabel
          label="Description"
          placeholder="Enter description..."
          defaultValue="test"
          data-testid="textarea"
        />
      );
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('placeholder', 'Enter description...');
    });
  });

  describe('Error state', () => {
    it('applies error styles when error is true', () => {
      const { container } = render(
        <TextareaFloatingLabel label="Description" error />
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('label has error color when error is true', () => {
      render(<TextareaFloatingLabel label="Description" error />);
      const label = screen.getByText('Description');
      expect(label).toHaveClass('text-destructive');
    });

    it('label has error color even when floating and focused', async () => {
      const user = userEvent.setup();
      render(
        <TextareaFloatingLabel label="Description" error data-testid="textarea" />
      );

      await user.click(screen.getByTestId('textarea'));

      const label = screen.getByText('Description');
      expect(label).toHaveClass('text-destructive');
    });

    it('sets aria-invalid when error is true', () => {
      render(
        <TextareaFloatingLabel label="Description" error data-testid="textarea" />
      );
      expect(screen.getByTestId('textarea')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('does not set aria-invalid when error is false', () => {
      render(
        <TextareaFloatingLabel
          label="Description"
          error={false}
          data-testid="textarea"
        />
      );
      expect(screen.getByTestId('textarea')).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('Disabled state', () => {
    it('applies disabled attribute when disabled', () => {
      render(
        <TextareaFloatingLabel
          label="Description"
          disabled
          data-testid="textarea"
        />
      );
      expect(screen.getByTestId('textarea')).toBeDisabled();
    });

    it('wrapper has disabled background', () => {
      const { container } = render(
        <TextareaFloatingLabel label="Description" disabled />
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('bg-background-secondary');
    });

    it('label has disabled color', () => {
      render(<TextareaFloatingLabel label="Description" disabled />);
      const label = screen.getByText('Description');
      expect(label).toHaveClass('text-text-tertiary');
    });

    it('textarea has disabled cursor class', () => {
      render(
        <TextareaFloatingLabel
          label="Description"
          disabled
          data-testid="textarea"
        />
      );
      expect(screen.getByTestId('textarea')).toHaveClass(
        'disabled:cursor-not-allowed'
      );
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to textarea element', () => {
      const ref = createRef<HTMLTextAreaElement>();
      render(<TextareaFloatingLabel label="Description" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLTextAreaElement>();
      render(
        <TextareaFloatingLabel
          label="Description"
          ref={ref}
          data-testid="textarea"
        />
      );
      ref.current?.focus();
      expect(screen.getByTestId('textarea')).toHaveFocus();
    });
  });

  describe('Event handling', () => {
    it('calls onChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <TextareaFloatingLabel
          label="Description"
          onChange={handleChange}
          data-testid="textarea"
        />
      );

      await user.type(screen.getByTestId('textarea'), 'hello');
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(
        <TextareaFloatingLabel
          label="Description"
          onFocus={handleFocus}
          data-testid="textarea"
        />
      );

      await user.click(screen.getByTestId('textarea'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(
        <TextareaFloatingLabel
          label="Description"
          onBlur={handleBlur}
          data-testid="textarea"
        />
      );

      const textarea = screen.getByTestId('textarea');
      await user.click(textarea);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Controlled and uncontrolled modes', () => {
    it('works as uncontrolled with defaultValue', async () => {
      const user = userEvent.setup();
      render(
        <TextareaFloatingLabel
          label="Description"
          defaultValue="initial"
          data-testid="textarea"
        />
      );

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
        <TextareaFloatingLabel
          label="Description"
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
        <TextareaFloatingLabel
          label="Description"
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
      render(
        <TextareaFloatingLabel
          label="Description"
          className="custom-class"
          data-testid="textarea"
        />
      );
      expect(screen.getByTestId('textarea')).toHaveClass('custom-class');
    });

    it('merges wrapperClassName on wrapper', () => {
      const { container } = render(
        <TextareaFloatingLabel
          label="Description"
          wrapperClassName="wrapper-class"
        />
      );
      expect(container.firstChild).toHaveClass('wrapper-class');
    });

    it('preserves default classes when merging', () => {
      render(
        <TextareaFloatingLabel
          label="Description"
          className="custom-class"
          data-testid="textarea"
        />
      );
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('custom-class');
      expect(textarea).toHaveClass('bg-transparent');
    });
  });

  describe('Label-textarea association', () => {
    it('label is associated with textarea via htmlFor/id', () => {
      render(<TextareaFloatingLabel label="Description" />);
      const textarea = screen.getByLabelText('Description');
      expect(textarea).toBeInTheDocument();
    });

    it('uses provided id', () => {
      render(
        <TextareaFloatingLabel
          label="Description"
          id="custom-id"
          data-testid="textarea"
        />
      );
      expect(screen.getByTestId('textarea')).toHaveAttribute('id', 'custom-id');
    });

    it('generates unique id when not provided', () => {
      render(
        <TextareaFloatingLabel label="Description" data-testid="textarea" />
      );
      const textarea = screen.getByTestId('textarea');
      expect(textarea.id).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('accepts aria-describedby', () => {
      render(
        <TextareaFloatingLabel
          label="Description"
          aria-describedby="help-text"
          data-testid="textarea"
        />
      );
      expect(screen.getByTestId('textarea')).toHaveAttribute(
        'aria-describedby',
        'help-text'
      );
    });

    it('sets aria-required when required', () => {
      render(
        <TextareaFloatingLabel
          label="Description"
          required
          data-testid="textarea"
        />
      );
      expect(screen.getByTestId('textarea')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });

    it('required indicator has aria-hidden', () => {
      render(<TextareaFloatingLabel label="Description" required />);
      const asterisk = screen.getByText('*');
      expect(asterisk).toHaveAttribute('aria-hidden', 'true');
    });

    it('required has screen reader text', () => {
      render(<TextareaFloatingLabel label="Description" required />);
      const srText = screen.getByText('required');
      expect(srText).toHaveClass('sr-only');
    });
  });

  describe('Label color states', () => {
    it('has tertiary color when not floating, not error', () => {
      render(<TextareaFloatingLabel label="Description" />);
      const label = screen.getByText('Description');
      expect(label).toHaveClass('text-text-tertiary');
    });

    it('has primary color when floating and focused (not error)', async () => {
      const user = userEvent.setup();
      render(
        <TextareaFloatingLabel label="Description" data-testid="textarea" />
      );

      await user.click(screen.getByTestId('textarea'));

      const label = screen.getByText('Description');
      expect(label).toHaveClass('text-primary');
    });

    it('has tertiary color when floating but not focused (not error)', () => {
      render(<TextareaFloatingLabel label="Description" defaultValue="test" />);
      const label = screen.getByText('Description');
      expect(label).toHaveClass('text-text-tertiary');
    });

    it('has destructive color when error (regardless of other state)', () => {
      render(<TextareaFloatingLabel label="Description" error />);
      const label = screen.getByText('Description');
      expect(label).toHaveClass('text-destructive');
    });
  });

  describe('Edge cases', () => {
    it('handles empty placeholder', () => {
      render(
        <TextareaFloatingLabel
          label="Description"
          placeholder=""
          data-testid="textarea"
        />
      );
      const textarea = screen.getByTestId('textarea');
      expect(textarea).not.toHaveAttribute('placeholder');
    });

    it('handles very long label', () => {
      const longLabel = 'A'.repeat(100);
      render(<TextareaFloatingLabel label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles disabled with error', () => {
      const { container } = render(
        <TextareaFloatingLabel
          label="Description"
          disabled
          error
          data-testid="textarea"
        />
      );
      const wrapper = container.firstChild;
      const textarea = screen.getByTestId('textarea');

      expect(textarea).toBeDisabled();
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('handles disabled with value', () => {
      render(
        <TextareaFloatingLabel
          label="Description"
          disabled
          defaultValue="Some content"
          data-testid="textarea"
        />
      );
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toBeDisabled();
      expect(textarea).toHaveValue('Some content');

      // Label should be floating since there's a value
      const label = screen.getByText('Description');
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('passes through additional HTML attributes', () => {
      render(
        <TextareaFloatingLabel
          label="Description"
          data-testid="textarea"
          name="description"
          maxLength={500}
        />
      );
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('name', 'description');
      expect(textarea).toHaveAttribute('maxlength', '500');
    });

    it('handles whitespace-only value as having value', () => {
      render(<TextareaFloatingLabel label="Description" defaultValue="   " />);
      const label = screen.getByText('Description');
      // Whitespace is still a value, so label should float
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('textarea is resizable by default', () => {
      render(
        <TextareaFloatingLabel label="Description" data-testid="textarea" />
      );
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('resize-y');
    });
  });
});
