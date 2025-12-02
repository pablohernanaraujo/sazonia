import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { NumberInputField } from '../number-input-field';

describe('NumberInputField', () => {
  describe('Rendering', () => {
    it('renders input element', () => {
      render(<NumberInputField placeholder="Enter number" />);
      expect(screen.getByPlaceholderText('Enter number')).toBeInTheDocument();
    });

    it('renders as number input type', () => {
      render(<NumberInputField data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'number');
    });

    it('renders stepper buttons', () => {
      render(<NumberInputField />);
      expect(screen.getByLabelText('Increment value')).toBeInTheDocument();
      expect(screen.getByLabelText('Decrement value')).toBeInTheDocument();
    });

    it('renders without label when not provided', () => {
      render(<NumberInputField placeholder="Enter number" />);
      const input = screen.getByRole('spinbutton');
      expect(input?.closest('label')).not.toBeInTheDocument();
    });

    it('renders without hint when not provided', () => {
      render(<NumberInputField />);
      const input = screen.getByRole('spinbutton');
      expect(input).not.toHaveAttribute('aria-describedby');
    });

    it('renders without error when not provided', () => {
      render(<NumberInputField />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Label rendering', () => {
    it('renders InputLabel when label prop is provided', () => {
      render(<NumberInputField label="Quantity" />);
      expect(screen.getByText('Quantity')).toBeInTheDocument();
    });

    it('label is associated with input via htmlFor/id', () => {
      render(<NumberInputField label="Quantity" />);
      const label = screen.getByText('Quantity').closest('label');
      const input = screen.getByRole('spinbutton');

      expect(label).toHaveAttribute('for');
      expect(input).toHaveAttribute('id');
      expect(label?.getAttribute('for')).toBe(input.getAttribute('id'));
    });

    it('uses provided id for label association', () => {
      render(<NumberInputField label="Quantity" id="custom-id" />);
      const label = screen.getByText('Quantity').closest('label');
      const input = screen.getByRole('spinbutton');

      expect(label).toHaveAttribute('for', 'custom-id');
      expect(input).toHaveAttribute('id', 'custom-id');
    });

    it('passes through labelProps', () => {
      render(
        <NumberInputField
          label="Quantity"
          labelProps={{ required: true, showIcon: true }}
        />
      );
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('Size mapping', () => {
    it('maps sm input size to sm label size', () => {
      render(<NumberInputField label="Label" size="sm" />);
      const label = screen.getByText('Label').closest('label');
      expect(label).toHaveClass('pb-2.5');
    });

    it('maps md input size to sm label size', () => {
      render(<NumberInputField label="Label" size="md" />);
      const label = screen.getByText('Label').closest('label');
      expect(label).toHaveClass('pb-2.5');
    });

    it('maps lg input size to md label size', () => {
      render(<NumberInputField label="Label" size="lg" />);
      const label = screen.getByText('Label').closest('label');
      expect(label).toHaveClass('pb-3');
    });
  });

  describe('Hint rendering', () => {
    it('renders Hint when hint prop is provided', () => {
      render(<NumberInputField hint="Enter a value between 1 and 100" />);
      expect(
        screen.getByText('Enter a value between 1 and 100')
      ).toBeInTheDocument();
    });

    it('hint has correct ID for aria-describedby', () => {
      render(<NumberInputField hint="Helper text" id="my-input" />);
      const hint = screen.getByText('Helper text');
      expect(hint).toHaveAttribute('id', 'my-input-hint');
    });

    it('input has aria-describedby pointing to hint', () => {
      render(<NumberInputField hint="Helper text" id="my-input" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('aria-describedby', 'my-input-hint');
    });

    it('passes through hintProps', () => {
      render(
        <NumberInputField
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
      render(<NumberInputField error="Value must be at least 1" />);
      expect(screen.getByText('Value must be at least 1')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('error has correct ID for aria-describedby', () => {
      render(<NumberInputField error="Error text" id="my-input" />);
      const error = screen.getByRole('alert');
      expect(error).toHaveAttribute('id', 'my-input-error');
    });

    it('input has aria-describedby pointing to error', () => {
      render(<NumberInputField error="Error text" id="my-input" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('aria-describedby', 'my-input-error');
    });

    it('input has aria-invalid when error is present', () => {
      render(<NumberInputField error="Error text" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('passes through errorProps', () => {
      render(
        <NumberInputField error="Error text" errorProps={{ showIcon: false }} />
      );
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  describe('Error/Hint precedence', () => {
    it('hides hint when error is present', () => {
      render(<NumberInputField hint="Helper text" error="Error text" />);
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
      expect(screen.getByText('Error text')).toBeInTheDocument();
    });

    it('shows hint when error is empty string', () => {
      render(<NumberInputField hint="Helper text" error="" />);
      expect(screen.getByText('Helper text')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('aria-describedby points to error when both hint and error provided', () => {
      render(
        <NumberInputField hint="Helper text" error="Error text" id="my-input" />
      );
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('aria-describedby', 'my-input-error');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to underlying input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<NumberInputField ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLInputElement>();
      render(<NumberInputField ref={ref} />);
      ref.current?.focus();
      expect(screen.getByRole('spinbutton')).toHaveFocus();
    });
  });

  describe('Props passthrough', () => {
    it('passes size prop to NumberInput', () => {
      render(<NumberInputField size="sm" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveClass('text-sm');
    });

    it('passes placeholder to NumberInput', () => {
      render(<NumberInputField placeholder="0" />);
      expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
    });

    it('passes disabled to NumberInput', () => {
      render(<NumberInputField disabled />);
      expect(screen.getByRole('spinbutton')).toBeDisabled();
    });

    it('passes leftAddOn to NumberInput', () => {
      render(<NumberInputField leftAddOn={<span data-testid="addon">$</span>} />);
      expect(screen.getByTestId('addon')).toBeInTheDocument();
    });

    it('passes min/max/step to NumberInput', () => {
      render(<NumberInputField min={0} max={100} step={5} data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
      expect(input).toHaveAttribute('step', '5');
    });
  });

  describe('aria-required', () => {
    it('sets aria-required when labelProps.required is true', () => {
      render(
        <NumberInputField label="Quantity" labelProps={{ required: true }} />
      );
      expect(screen.getByRole('spinbutton')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });

    it('does not set aria-required when required is false', () => {
      render(
        <NumberInputField label="Quantity" labelProps={{ required: false }} />
      );
      expect(screen.getByRole('spinbutton')).not.toHaveAttribute('aria-required');
    });
  });

  describe('containerClassName', () => {
    it('applies containerClassName to wrapper div', () => {
      const { container } = render(
        <NumberInputField containerClassName="custom-container" />
      );
      expect(container.firstChild).toHaveClass('custom-container');
    });

    it('preserves default flex-col class', () => {
      const { container } = render(
        <NumberInputField containerClassName="custom-container" />
      );
      expect(container.firstChild).toHaveClass('flex', 'flex-col');
    });
  });

  describe('ID generation', () => {
    it('generates unique ID when not provided', () => {
      render(<NumberInputField label="Field 1" />);
      render(<NumberInputField label="Field 2" />);

      const inputs = screen.getAllByRole('spinbutton');
      const ids = inputs.map((input) => input.getAttribute('id'));

      // Both should have IDs
      expect(ids[0]).toBeTruthy();
      expect(ids[1]).toBeTruthy();

      // IDs should be different
      expect(ids[0]).not.toBe(ids[1]);
    });

    it('uses provided ID over generated one', () => {
      render(<NumberInputField id="custom-id" />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Custom aria-describedby', () => {
    it('uses provided aria-describedby over generated one', () => {
      render(
        <NumberInputField
          hint="Helper text"
          aria-describedby="custom-description"
        />
      );
      expect(screen.getByRole('spinbutton')).toHaveAttribute(
        'aria-describedby',
        'custom-description'
      );
    });
  });

  describe('Event handling', () => {
    it('calls onChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<NumberInputField onChange={handleChange} />);

      await user.type(screen.getByRole('spinbutton'), '123');
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<NumberInputField onFocus={handleFocus} />);

      await user.click(screen.getByRole('spinbutton'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<NumberInputField onBlur={handleBlur} />);

      const input = screen.getByRole('spinbutton');
      await user.click(input);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Stepper functionality', () => {
    it('increments value when increment button clicked', async () => {
      const user = userEvent.setup();
      render(<NumberInputField defaultValue={5} data-testid="input" />);

      await user.click(screen.getByLabelText('Increment value'));
      expect(screen.getByTestId('input')).toHaveValue(6);
    });

    it('decrements value when decrement button clicked', async () => {
      const user = userEvent.setup();
      render(<NumberInputField defaultValue={5} data-testid="input" />);

      await user.click(screen.getByLabelText('Decrement value'));
      expect(screen.getByTestId('input')).toHaveValue(4);
    });
  });

  describe('Edge cases', () => {
    it('handles empty label string (does not render label)', () => {
      render(<NumberInputField label="" />);
      const input = screen.getByRole('spinbutton');
      expect(input.closest('label')).not.toBeInTheDocument();
    });

    it('handles very long label text', () => {
      const longLabel = 'A'.repeat(200);
      render(<NumberInputField label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles very long error text', () => {
      const longError = 'B'.repeat(500);
      render(<NumberInputField error={longError} />);
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it('renders all features together', () => {
      render(
        <NumberInputField
          label="Quantity"
          labelProps={{
            required: true,
            showIcon: true,
            description: 'Amount needed',
          }}
          hint="Enter a value between 1 and 100"
          placeholder="0"
          size="lg"
          min={1}
          max={100}
          leftAddOn={<span>Qty:</span>}
        />
      );

      expect(screen.getByText('Quantity')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByText('Amount needed')).toBeInTheDocument();
      expect(
        screen.getByText('Enter a value between 1 and 100')
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
      expect(screen.getByText('Qty:')).toBeInTheDocument();
    });

    it('handles error state with all features', () => {
      render(
        <NumberInputField
          label="Quantity"
          labelProps={{ required: true }}
          hint="Hidden hint"
          error="Value must be at least 1"
          placeholder="0"
        />
      );

      expect(screen.getByText('Quantity')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.queryByText('Hidden hint')).not.toBeInTheDocument();
      expect(screen.getByText('Value must be at least 1')).toBeInTheDocument();
      expect(screen.getByRole('spinbutton')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });
  });
});
