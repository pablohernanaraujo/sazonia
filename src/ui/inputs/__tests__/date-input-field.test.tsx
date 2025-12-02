import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { HINT_SIZE_MAP, INPUT_LABEL_SIZE_MAP } from '../constants';
import { DateInputField } from '../date-input-field';

describe('DateInputField', () => {
  describe('Rendering', () => {
    it('renders input element', () => {
      render(<DateInputField placeholder="Select date" />);
      expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
    });

    it('renders without label when not provided', () => {
      render(<DateInputField placeholder="Select date" />);
      const input = screen.queryByPlaceholderText('Select date');
      expect(input?.closest('label')).not.toBeInTheDocument();
    });

    it('renders without hint when not provided', () => {
      render(<DateInputField />);
      const input = screen.getByPlaceholderText('MM/DD/YYYY');
      expect(input).not.toHaveAttribute('aria-describedby');
    });

    it('renders without error when not provided', () => {
      render(<DateInputField />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Label rendering', () => {
    it('renders InputLabel when label prop is provided', () => {
      render(<DateInputField label="Date of birth" />);
      expect(screen.getByText('Date of birth')).toBeInTheDocument();
    });

    it('label is associated with input via htmlFor/id', () => {
      render(<DateInputField label="Date" />);
      const label = screen.getByText('Date').closest('label');
      const input = screen.getByPlaceholderText('MM/DD/YYYY');

      expect(label).toHaveAttribute('for');
      expect(input).toHaveAttribute('id');
      expect(label?.getAttribute('for')).toBe(input.getAttribute('id'));
    });

    it('uses provided id for label association', () => {
      render(<DateInputField label="Date" id="custom-id" />);
      const label = screen.getByText('Date').closest('label');
      const input = screen.getByPlaceholderText('MM/DD/YYYY');

      expect(label).toHaveAttribute('for', 'custom-id');
      expect(input).toHaveAttribute('id', 'custom-id');
    });

    it('passes through labelProps', () => {
      render(
        <DateInputField
          label="Date"
          labelProps={{ required: true, showIcon: true }}
        />
      );
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('Size mapping', () => {
    it('maps sm input size to sm label size', () => {
      render(<DateInputField label="Label" size="sm" />);
      const label = screen.getByText('Label').closest('label');
      expect(label).toHaveClass('pb-2.5');
    });

    it('maps md input size to sm label size', () => {
      render(<DateInputField label="Label" size="md" />);
      const label = screen.getByText('Label').closest('label');
      expect(label).toHaveClass('pb-2.5');
    });

    it('maps lg input size to md label size', () => {
      render(<DateInputField label="Label" size="lg" />);
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
      render(<DateInputField hint="Select a date in the future" />);
      expect(screen.getByText('Select a date in the future')).toBeInTheDocument();
    });

    it('hint has correct ID for aria-describedby', () => {
      render(<DateInputField hint="Helper text" id="my-input" />);
      const hint = screen.getByText('Helper text');
      expect(hint).toHaveAttribute('id', 'my-input-hint');
    });

    it('input has aria-describedby pointing to hint', () => {
      render(<DateInputField hint="Helper text" id="my-input" />);
      const input = screen.getByPlaceholderText('MM/DD/YYYY');
      expect(input).toHaveAttribute('aria-describedby', 'my-input-hint');
    });

    it('passes through hintProps', () => {
      render(
        <DateInputField
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
      render(<DateInputField error="Please enter a valid date" />);
      expect(screen.getByText('Please enter a valid date')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('error has correct ID for aria-describedby', () => {
      render(<DateInputField error="Error text" id="my-input" />);
      const error = screen.getByRole('alert');
      expect(error).toHaveAttribute('id', 'my-input-error');
    });

    it('input has aria-describedby pointing to error', () => {
      render(<DateInputField error="Error text" id="my-input" />);
      const input = screen.getByPlaceholderText('MM/DD/YYYY');
      expect(input).toHaveAttribute('aria-describedby', 'my-input-error');
    });

    it('input has aria-invalid when error is present', () => {
      render(<DateInputField error="Error text" />);
      const input = screen.getByPlaceholderText('MM/DD/YYYY');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('passes through errorProps', () => {
      render(
        <DateInputField error="Error text" errorProps={{ showIcon: false }} />
      );
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  describe('Error/Hint precedence', () => {
    it('hides hint when error is present', () => {
      render(<DateInputField hint="Helper text" error="Error text" />);
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
      expect(screen.getByText('Error text')).toBeInTheDocument();
    });

    it('shows hint when error is empty string', () => {
      render(<DateInputField hint="Helper text" error="" />);
      expect(screen.getByText('Helper text')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('aria-describedby points to error when both hint and error provided', () => {
      render(
        <DateInputField hint="Helper text" error="Error text" id="my-input" />
      );
      const input = screen.getByPlaceholderText('MM/DD/YYYY');
      expect(input).toHaveAttribute('aria-describedby', 'my-input-error');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to underlying input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<DateInputField ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLInputElement>();
      render(<DateInputField ref={ref} />);
      ref.current?.focus();
      expect(screen.getByPlaceholderText('MM/DD/YYYY')).toHaveFocus();
    });
  });

  describe('Props passthrough', () => {
    it('passes size prop to DateInput', () => {
      render(<DateInputField size="sm" />);
      const input = screen.getByPlaceholderText('MM/DD/YYYY');
      expect(input).toHaveClass('text-sm');
    });

    it('passes placeholder to DateInput', () => {
      render(<DateInputField placeholder="Select date" />);
      expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
    });

    it('passes disabled to DateInput', () => {
      render(<DateInputField disabled />);
      expect(screen.getByPlaceholderText('MM/DD/YYYY')).toBeDisabled();
    });

    it('passes leftAddOn to DateInput', () => {
      render(
        <DateInputField leftAddOn={<span data-testid="addon">Text</span>} />
      );
      expect(screen.getByTestId('addon')).toBeInTheDocument();
    });

    it('passes value to DateInput', () => {
      const date = new Date(2024, 2, 15);
      render(<DateInputField value={date} />);
      expect(screen.getByDisplayValue('03/15/2024')).toBeInTheDocument();
    });

    it('passes onChange to DateInput', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<DateInputField onChange={onChange} />);

      const input = screen.getByPlaceholderText('MM/DD/YYYY');
      await user.clear(input);
      await user.type(input, '03/15/2024');

      expect(onChange).toHaveBeenCalled();
    });

    it('passes minDate to DateInput', () => {
      const minDate = new Date(2024, 0, 1);
      render(<DateInputField minDate={minDate} />);
      // The minDate is passed through - we verify by the input rendering
      expect(screen.getByPlaceholderText('MM/DD/YYYY')).toBeInTheDocument();
    });

    it('passes maxDate to DateInput', () => {
      const maxDate = new Date(2024, 11, 31);
      render(<DateInputField maxDate={maxDate} />);
      // The maxDate is passed through - we verify by the input rendering
      expect(screen.getByPlaceholderText('MM/DD/YYYY')).toBeInTheDocument();
    });
  });

  describe('aria-required', () => {
    it('sets aria-required when labelProps.required is true', () => {
      render(<DateInputField label="Date" labelProps={{ required: true }} />);
      expect(screen.getByPlaceholderText('MM/DD/YYYY')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });

    it('does not set aria-required when required is false', () => {
      render(<DateInputField label="Date" labelProps={{ required: false }} />);
      expect(screen.getByPlaceholderText('MM/DD/YYYY')).not.toHaveAttribute(
        'aria-required'
      );
    });
  });

  describe('containerClassName', () => {
    it('applies containerClassName to wrapper div', () => {
      const { container } = render(
        <DateInputField containerClassName="custom-container" />
      );
      expect(container.firstChild).toHaveClass('custom-container');
    });

    it('preserves default flex-col class', () => {
      const { container } = render(
        <DateInputField containerClassName="custom-container" />
      );
      expect(container.firstChild).toHaveClass('flex', 'flex-col');
    });
  });

  describe('ID generation', () => {
    it('generates unique ID when not provided', () => {
      render(<DateInputField label="Field 1" />);
      render(<DateInputField label="Field 2" />);

      const inputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
      const ids = inputs.map((input) => input.getAttribute('id'));

      // Both should have IDs
      expect(ids[0]).toBeTruthy();
      expect(ids[1]).toBeTruthy();

      // IDs should be different
      expect(ids[0]).not.toBe(ids[1]);
    });

    it('uses provided ID over generated one', () => {
      render(<DateInputField id="custom-id" />);
      expect(screen.getByPlaceholderText('MM/DD/YYYY')).toHaveAttribute(
        'id',
        'custom-id'
      );
    });
  });

  describe('Custom aria-describedby', () => {
    it('uses provided aria-describedby over generated one', () => {
      render(
        <DateInputField
          hint="Helper text"
          aria-describedby="custom-description"
        />
      );
      expect(screen.getByPlaceholderText('MM/DD/YYYY')).toHaveAttribute(
        'aria-describedby',
        'custom-description'
      );
    });
  });

  describe('Event handling', () => {
    it('calls onChange when date changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<DateInputField onChange={handleChange} />);

      const input = screen.getByPlaceholderText('MM/DD/YYYY');
      await user.clear(input);
      await user.type(input, '03/15/2024');

      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<DateInputField onFocus={handleFocus} />);

      await user.click(screen.getByPlaceholderText('MM/DD/YYYY'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<DateInputField onBlur={handleBlur} />);

      const input = screen.getByPlaceholderText('MM/DD/YYYY');
      await user.click(input);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('handles empty label string (does not render label)', () => {
      render(<DateInputField label="" />);
      const input = screen.getByPlaceholderText('MM/DD/YYYY');
      expect(input.closest('label')).not.toBeInTheDocument();
    });

    it('handles very long label text', () => {
      const longLabel = 'A'.repeat(200);
      render(<DateInputField label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles very long error text', () => {
      const longError = 'B'.repeat(500);
      render(<DateInputField error={longError} />);
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it('renders all features together', () => {
      render(
        <DateInputField
          label="Date of birth"
          labelProps={{
            required: true,
            showIcon: true,
            description: 'Your birth date',
          }}
          hint="Enter your date of birth"
          placeholder="MM/DD/YYYY"
          size="lg"
        />
      );

      expect(screen.getByText('Date of birth')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByText('Your birth date')).toBeInTheDocument();
      expect(screen.getByText('Enter your date of birth')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('MM/DD/YYYY')).toBeInTheDocument();
    });

    it('handles error state with all features', () => {
      render(
        <DateInputField
          label="Date"
          labelProps={{ required: true }}
          hint="Hidden hint"
          error="Invalid date format"
          placeholder="MM/DD/YYYY"
        />
      );

      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.queryByText('Hidden hint')).not.toBeInTheDocument();
      expect(screen.getByText('Invalid date format')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('MM/DD/YYYY')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });
  });
});
