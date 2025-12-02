import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { HINT_SIZE_MAP, INPUT_LABEL_SIZE_MAP } from '../constants';
import { TextInputField } from '../text-input-field';

describe('TextInputField', () => {
  describe('Rendering', () => {
    it('renders input element', () => {
      render(<TextInputField placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders without label when not provided', () => {
      render(<TextInputField placeholder="Enter text" />);
      const input = screen.queryByRole('textbox');
      expect(input?.closest('label')).not.toBeInTheDocument();
    });

    it('renders without hint when not provided', () => {
      render(<TextInputField />);
      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('aria-describedby');
    });

    it('renders without error when not provided', () => {
      render(<TextInputField />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Label rendering', () => {
    it('renders InputLabel when label prop is provided', () => {
      render(<TextInputField label="Email address" />);
      expect(screen.getByText('Email address')).toBeInTheDocument();
    });

    it('label is associated with input via htmlFor/id', () => {
      render(<TextInputField label="Email" />);
      const label = screen.getByText('Email').closest('label');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for');
      expect(input).toHaveAttribute('id');
      expect(label?.getAttribute('for')).toBe(input.getAttribute('id'));
    });

    it('uses provided id for label association', () => {
      render(<TextInputField label="Email" id="custom-id" />);
      const label = screen.getByText('Email').closest('label');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for', 'custom-id');
      expect(input).toHaveAttribute('id', 'custom-id');
    });

    it('passes through labelProps', () => {
      render(
        <TextInputField
          label="Email"
          labelProps={{ required: true, showIcon: true }}
        />
      );
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('Size mapping', () => {
    it('maps sm input size to sm label size', () => {
      render(<TextInputField label="Label" size="sm" />);
      const label = screen.getByText('Label').closest('label');
      expect(label).toHaveClass('pb-2.5');
    });

    it('maps md input size to sm label size', () => {
      render(<TextInputField label="Label" size="md" />);
      const label = screen.getByText('Label').closest('label');
      expect(label).toHaveClass('pb-2.5');
    });

    it('maps lg input size to md label size', () => {
      render(<TextInputField label="Label" size="lg" />);
      const label = screen.getByText('Label').closest('label');
      expect(label).toHaveClass('pb-3');
    });

    it('exports INPUT_LABEL_SIZE_MAP constant', () => {
      expect(INPUT_LABEL_SIZE_MAP).toEqual({
        sm: 'sm',
        md: 'sm',
        lg: 'md',
      });
    });

    it('exports HINT_SIZE_MAP constant', () => {
      expect(HINT_SIZE_MAP).toEqual({
        sm: 'sm',
        md: 'sm',
        lg: 'md',
      });
    });
  });

  describe('Hint rendering', () => {
    it('renders Hint when hint prop is provided', () => {
      render(<TextInputField hint="Helper text" />);
      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });

    it('hint has correct ID for aria-describedby', () => {
      render(<TextInputField hint="Helper text" id="my-input" />);
      const hint = screen.getByText('Helper text');
      expect(hint).toHaveAttribute('id', 'my-input-hint');
    });

    it('input has aria-describedby pointing to hint', () => {
      render(<TextInputField hint="Helper text" id="my-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'my-input-hint');
    });

    it('passes through hintProps', () => {
      render(
        <TextInputField
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
      render(<TextInputField error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('error has correct ID for aria-describedby', () => {
      render(<TextInputField error="Error text" id="my-input" />);
      const error = screen.getByRole('alert');
      expect(error).toHaveAttribute('id', 'my-input-error');
    });

    it('input has aria-describedby pointing to error', () => {
      render(<TextInputField error="Error text" id="my-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'my-input-error');
    });

    it('input has aria-invalid when error is present', () => {
      render(<TextInputField error="Error text" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('passes through errorProps', () => {
      render(
        <TextInputField error="Error text" errorProps={{ showIcon: false }} />
      );
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  describe('Error/Hint precedence', () => {
    it('hides hint when error is present', () => {
      render(<TextInputField hint="Helper text" error="Error text" />);
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
      expect(screen.getByText('Error text')).toBeInTheDocument();
    });

    it('shows hint when error is empty string', () => {
      render(<TextInputField hint="Helper text" error="" />);
      expect(screen.getByText('Helper text')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('aria-describedby points to error when both hint and error provided', () => {
      render(
        <TextInputField hint="Helper text" error="Error text" id="my-input" />
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'my-input-error');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to underlying input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<TextInputField ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLInputElement>();
      render(<TextInputField ref={ref} />);
      ref.current?.focus();
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });

  describe('Props passthrough', () => {
    it('passes size prop to TextInput', () => {
      render(<TextInputField size="sm" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('text-sm');
    });

    it('passes placeholder to TextInput', () => {
      render(<TextInputField placeholder="Enter email" />);
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    });

    it('passes disabled to TextInput', () => {
      render(<TextInputField disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('passes leftAddOn to TextInput', () => {
      render(<TextInputField leftAddOn={<span data-testid="addon">$</span>} />);
      expect(screen.getByTestId('addon')).toBeInTheDocument();
    });

    it('passes rightAddOn to TextInput', () => {
      render(
        <TextInputField rightAddOn={<span data-testid="addon">.00</span>} />
      );
      expect(screen.getByTestId('addon')).toBeInTheDocument();
    });
  });

  describe('aria-required', () => {
    it('sets aria-required when labelProps.required is true', () => {
      render(<TextInputField label="Email" labelProps={{ required: true }} />);
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });

    it('does not set aria-required when required is false', () => {
      render(<TextInputField label="Email" labelProps={{ required: false }} />);
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-required');
    });
  });

  describe('containerClassName', () => {
    it('applies containerClassName to wrapper div', () => {
      const { container } = render(
        <TextInputField containerClassName="custom-container" />
      );
      expect(container.firstChild).toHaveClass('custom-container');
    });

    it('preserves default flex-col class', () => {
      const { container } = render(
        <TextInputField containerClassName="custom-container" />
      );
      expect(container.firstChild).toHaveClass('flex', 'flex-col');
    });
  });

  describe('ID generation', () => {
    it('generates unique ID when not provided', () => {
      render(<TextInputField label="Field 1" />);
      render(<TextInputField label="Field 2" />);

      const inputs = screen.getAllByRole('textbox');
      const ids = inputs.map((input) => input.getAttribute('id'));

      // Both should have IDs
      expect(ids[0]).toBeTruthy();
      expect(ids[1]).toBeTruthy();

      // IDs should be different
      expect(ids[0]).not.toBe(ids[1]);
    });

    it('uses provided ID over generated one', () => {
      render(<TextInputField id="custom-id" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Custom aria-describedby', () => {
    it('uses provided aria-describedby over generated one', () => {
      render(
        <TextInputField
          hint="Helper text"
          aria-describedby="custom-description"
        />
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
      render(<TextInputField onChange={handleChange} />);

      await user.type(screen.getByRole('textbox'), 'hello');
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<TextInputField onFocus={handleFocus} />);

      await user.click(screen.getByRole('textbox'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<TextInputField onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('handles empty label string (does not render label)', () => {
      render(<TextInputField label="" />);
      // Should not find any label element wrapping the input
      const input = screen.getByRole('textbox');
      expect(input.closest('label')).not.toBeInTheDocument();
    });

    it('handles very long label text', () => {
      const longLabel = 'A'.repeat(200);
      render(<TextInputField label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles very long error text', () => {
      const longError = 'B'.repeat(500);
      render(<TextInputField error={longError} />);
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it('renders all features together', () => {
      render(
        <TextInputField
          label="Email"
          labelProps={{
            required: true,
            showIcon: true,
            description: 'Your email',
          }}
          hint="We will never share your email"
          placeholder="you@example.com"
          size="lg"
        />
      );

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByText('Your email')).toBeInTheDocument();
      expect(
        screen.getByText('We will never share your email')
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    });

    it('handles error state with all features', () => {
      render(
        <TextInputField
          label="Email"
          labelProps={{ required: true }}
          hint="Hidden hint"
          error="Invalid email format"
          placeholder="you@example.com"
        />
      );

      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.queryByText('Hidden hint')).not.toBeInTheDocument();
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
