import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TextareaField } from '../textarea-field';

describe('TextareaField', () => {
  describe('Rendering', () => {
    it('renders textarea element', () => {
      render(<TextareaField placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders without label when not provided', () => {
      render(<TextareaField placeholder="Enter text" />);
      const textarea = screen.queryByRole('textbox');
      expect(textarea?.closest('label')).not.toBeInTheDocument();
    });

    it('renders without hint when not provided', () => {
      render(<TextareaField />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).not.toHaveAttribute('aria-describedby');
    });

    it('renders without error when not provided', () => {
      render(<TextareaField />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Label rendering', () => {
    it('renders InputLabel when label prop is provided', () => {
      render(<TextareaField label="Description" />);
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('label is associated with textarea via htmlFor/id', () => {
      render(<TextareaField label="Message" />);
      const label = screen.getByText('Message').closest('label');
      const textarea = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for');
      expect(textarea).toHaveAttribute('id');
      expect(label?.getAttribute('for')).toBe(textarea.getAttribute('id'));
    });

    it('uses provided id for label association', () => {
      render(<TextareaField label="Message" id="custom-id" />);
      const label = screen.getByText('Message').closest('label');
      const textarea = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for', 'custom-id');
      expect(textarea).toHaveAttribute('id', 'custom-id');
    });

    it('passes through labelProps', () => {
      render(
        <TextareaField
          label="Message"
          labelProps={{ required: true, showIcon: true }}
        />
      );
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('Size mapping', () => {
    it('maps md textarea size to sm label size', () => {
      render(<TextareaField label="Label" size="md" />);
      const label = screen.getByText('Label').closest('label');
      expect(label).toHaveClass('pb-2.5');
    });

    it('maps lg textarea size to md label size', () => {
      render(<TextareaField label="Label" size="lg" />);
      const label = screen.getByText('Label').closest('label');
      expect(label).toHaveClass('pb-3');
    });
  });

  describe('Hint rendering', () => {
    it('renders Hint when hint prop is provided', () => {
      render(<TextareaField hint="Helper text" />);
      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });

    it('hint has correct ID for aria-describedby', () => {
      render(<TextareaField hint="Helper text" id="my-textarea" />);
      const hint = screen.getByText('Helper text');
      expect(hint).toHaveAttribute('id', 'my-textarea-hint');
    });

    it('textarea has aria-describedby pointing to hint', () => {
      render(<TextareaField hint="Helper text" id="my-textarea" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby', 'my-textarea-hint');
    });

    it('passes through hintProps', () => {
      render(
        <TextareaField
          hint="Helper text"
          hintProps={{ className: 'custom-hint-class' }}
        />
      );
      const hint = screen.getByText('Helper text');
      expect(hint).toHaveClass('custom-hint-class');
    });
  });

  describe('Error rendering', () => {
    it('renders ErrorMessage when error prop is provided', () => {
      render(<TextareaField error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('error has correct ID for aria-describedby', () => {
      render(<TextareaField error="Error text" id="my-textarea" />);
      const error = screen.getByRole('alert');
      expect(error).toHaveAttribute('id', 'my-textarea-error');
    });

    it('textarea has aria-describedby pointing to error', () => {
      render(<TextareaField error="Error text" id="my-textarea" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby', 'my-textarea-error');
    });

    it('textarea has aria-invalid when error is present', () => {
      render(<TextareaField error="Error text" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('passes through errorProps', () => {
      render(
        <TextareaField error="Error text" errorProps={{ showIcon: false }} />
      );
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  describe('Error/Hint precedence', () => {
    it('hides hint when error is present', () => {
      render(<TextareaField hint="Helper text" error="Error text" />);
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
      expect(screen.getByText('Error text')).toBeInTheDocument();
    });

    it('shows hint when error is empty string', () => {
      render(<TextareaField hint="Helper text" error="" />);
      expect(screen.getByText('Helper text')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('aria-describedby points to error when both hint and error provided', () => {
      render(
        <TextareaField hint="Helper text" error="Error text" id="my-textarea" />
      );
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby', 'my-textarea-error');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to underlying textarea element', () => {
      const ref = createRef<HTMLTextAreaElement>();
      render(<TextareaField ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLTextAreaElement>();
      render(<TextareaField ref={ref} />);
      ref.current?.focus();
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });

  describe('Props passthrough', () => {
    it('passes size prop to Textarea', () => {
      render(<TextareaField size="md" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('text-sm');
    });

    it('passes placeholder to Textarea', () => {
      render(<TextareaField placeholder="Enter message" />);
      expect(screen.getByPlaceholderText('Enter message')).toBeInTheDocument();
    });

    it('passes disabled to Textarea', () => {
      render(<TextareaField disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('passes rows to Textarea', () => {
      render(<TextareaField rows={6} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6');
    });
  });

  describe('aria-required', () => {
    it('sets aria-required when labelProps.required is true', () => {
      render(<TextareaField label="Message" labelProps={{ required: true }} />);
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });

    it('does not set aria-required when required is false', () => {
      render(<TextareaField label="Message" labelProps={{ required: false }} />);
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-required');
    });
  });

  describe('containerClassName', () => {
    it('applies containerClassName to wrapper div', () => {
      const { container } = render(
        <TextareaField containerClassName="custom-container" />
      );
      expect(container.firstChild).toHaveClass('custom-container');
    });

    it('preserves default flex-col class', () => {
      const { container } = render(
        <TextareaField containerClassName="custom-container" />
      );
      expect(container.firstChild).toHaveClass('flex', 'flex-col');
    });
  });

  describe('ID generation', () => {
    it('generates unique ID when not provided', () => {
      render(<TextareaField label="Field 1" />);
      render(<TextareaField label="Field 2" />);

      const textareas = screen.getAllByRole('textbox');
      const ids = textareas.map((textarea) => textarea.getAttribute('id'));

      // Both should have IDs
      expect(ids[0]).toBeTruthy();
      expect(ids[1]).toBeTruthy();

      // IDs should be different
      expect(ids[0]).not.toBe(ids[1]);
    });

    it('uses provided ID over generated one', () => {
      render(<TextareaField id="custom-id" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Custom aria-describedby', () => {
    it('uses provided aria-describedby over generated one', () => {
      render(
        <TextareaField hint="Helper text" aria-describedby="custom-description" />
      );
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        'custom-description'
      );
    });
  });

  describe('Event handling', () => {
    it('calls onChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<TextareaField onChange={handleChange} />);

      await user.type(screen.getByRole('textbox'), 'hello');
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<TextareaField onFocus={handleFocus} />);

      await user.click(screen.getByRole('textbox'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<TextareaField onBlur={handleBlur} />);

      const textarea = screen.getByRole('textbox');
      await user.click(textarea);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('handles empty label string (does not render label)', () => {
      render(<TextareaField label="" />);
      // Should not find any label element wrapping the textarea
      const textarea = screen.getByRole('textbox');
      expect(textarea.closest('label')).not.toBeInTheDocument();
    });

    it('handles very long label text', () => {
      const longLabel = 'A'.repeat(200);
      render(<TextareaField label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles very long error text', () => {
      const longError = 'B'.repeat(500);
      render(<TextareaField error={longError} />);
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it('renders all features together', () => {
      render(
        <TextareaField
          label="Feedback"
          labelProps={{
            required: true,
            showIcon: true,
            description: 'Your feedback',
          }}
          hint="Maximum 500 characters"
          placeholder="Enter your feedback..."
          size="lg"
          rows={4}
        />
      );

      expect(screen.getByText('Feedback')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByText('Your feedback')).toBeInTheDocument();
      expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Enter your feedback...')
      ).toBeInTheDocument();
    });

    it('handles error state with all features', () => {
      render(
        <TextareaField
          label="Message"
          labelProps={{ required: true }}
          hint="Hidden hint"
          error="Please enter a message"
          placeholder="Enter message..."
        />
      );

      expect(screen.getByText('Message')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.queryByText('Hidden hint')).not.toBeInTheDocument();
      expect(screen.getByText('Please enter a message')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('handles multiline content', async () => {
      const user = userEvent.setup();
      render(<TextareaField />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Line 1{enter}Line 2{enter}Line 3');
      expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3');
    });
  });
});
