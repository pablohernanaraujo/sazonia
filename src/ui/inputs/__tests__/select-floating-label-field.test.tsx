import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SelectItem } from '../select';
import { SelectFloatingLabelField } from '../select-floating-label-field';

const defaultOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
];

describe('SelectFloatingLabelField', () => {
  describe('Rendering', () => {
    it('renders with label', () => {
      render(
        <SelectFloatingLabelField label="Country" options={defaultOptions} />
      );
      expect(screen.getByText('Country')).toBeInTheDocument();
    });

    it('renders options from options array', async () => {
      const user = userEvent.setup();
      render(
        <SelectFloatingLabelField label="Country" options={defaultOptions} />
      );

      await user.click(screen.getByRole('combobox'));

      expect(
        screen.getByRole('option', { name: 'United States' })
      ).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Canada' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Mexico' })).toBeInTheDocument();
    });

    it('renders children instead of options when provided', async () => {
      const user = userEvent.setup();
      render(
        <SelectFloatingLabelField label="Country">
          <SelectItem value="custom">Custom Option</SelectItem>
        </SelectFloatingLabelField>
      );

      await user.click(screen.getByRole('combobox'));

      expect(
        screen.getByRole('option', { name: 'Custom Option' })
      ).toBeInTheDocument();
    });

    it('renders hint when provided', () => {
      render(
        <SelectFloatingLabelField
          label="Country"
          hint="Select your country"
          options={defaultOptions}
        />
      );
      expect(screen.getByText('Select your country')).toBeInTheDocument();
    });

    it('renders error message when provided', () => {
      render(
        <SelectFloatingLabelField
          label="Country"
          errorMessage="Please select a country"
          options={defaultOptions}
        />
      );
      expect(screen.getByText('Please select a country')).toBeInTheDocument();
    });

    it('error message replaces hint', () => {
      render(
        <SelectFloatingLabelField
          label="Country"
          hint="Select your country"
          errorMessage="Please select a country"
          options={defaultOptions}
        />
      );
      expect(screen.queryByText('Select your country')).not.toBeInTheDocument();
      expect(screen.getByText('Please select a country')).toBeInTheDocument();
    });
  });

  describe('Error state propagation', () => {
    it('applies error styling when errorMessage is provided', () => {
      const { container } = render(
        <SelectFloatingLabelField
          label="Country"
          errorMessage="Error"
          options={defaultOptions}
        />
      );
      const wrapper = container.querySelector('.relative');
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('applies error styling when error prop is true', () => {
      const { container } = render(
        <SelectFloatingLabelField
          label="Country"
          error
          options={defaultOptions}
        />
      );
      const wrapper = container.querySelector('.relative');
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('error message has role="alert"', () => {
      render(
        <SelectFloatingLabelField
          label="Country"
          errorMessage="Error message"
          options={defaultOptions}
        />
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('ARIA associations', () => {
    it('associates hint with select via aria-describedby', () => {
      render(
        <SelectFloatingLabelField
          label="Country"
          hint="Select your country"
          options={defaultOptions}
        />
      );

      const trigger = screen.getByRole('combobox');
      const hintId = trigger.getAttribute('aria-describedby');
      expect(hintId).toBeTruthy();

      const hint = screen.getByText('Select your country');
      expect(hint.closest('[id]')?.getAttribute('id')).toBe(hintId);
    });

    it('associates error message with select via aria-describedby', () => {
      render(
        <SelectFloatingLabelField
          label="Country"
          errorMessage="Please select a country"
          options={defaultOptions}
        />
      );

      const trigger = screen.getByRole('combobox');
      const errorId = trigger.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();

      const error = screen.getByRole('alert');
      expect(error.getAttribute('id')).toBe(errorId);
    });

    it('allows overriding aria-describedby', () => {
      render(
        <SelectFloatingLabelField
          label="Country"
          hint="Hint"
          aria-describedby="custom-id"
          options={defaultOptions}
        />
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger.getAttribute('aria-describedby')).toBe('custom-id');
    });
  });

  describe('ID handling', () => {
    it('auto-generates ID when not provided', () => {
      render(
        <SelectFloatingLabelField
          label="Country"
          hint="Hint"
          options={defaultOptions}
        />
      );

      const trigger = screen.getByRole('combobox');
      const ariaDescribedBy = trigger.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toBeTruthy();
    });

    it('uses provided id', () => {
      render(
        <SelectFloatingLabelField
          label="Country"
          id="custom-select"
          hint="Hint"
          options={defaultOptions}
        />
      );

      const hint = screen.getByText('Hint');
      expect(hint.closest('[id]')?.getAttribute('id')).toBe('custom-select-hint');
    });
  });

  describe('Options array handling', () => {
    it('renders disabled options correctly', async () => {
      const user = userEvent.setup();
      const optionsWithDisabled = [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada', disabled: true },
        { value: 'mx', label: 'Mexico' },
      ];

      render(
        <SelectFloatingLabelField label="Country" options={optionsWithDisabled} />
      );

      await user.click(screen.getByRole('combobox'));

      const disabledOption = screen.getByRole('option', { name: 'Canada' });
      expect(disabledOption).toHaveAttribute('data-disabled');
    });

    it('handles empty options array', async () => {
      const user = userEvent.setup();
      render(<SelectFloatingLabelField label="Country" options={[]} />);

      await user.click(screen.getByRole('combobox'));
      // Should open without error
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('Passthrough props', () => {
    it('passes required prop to SelectFloatingLabel', () => {
      render(
        <SelectFloatingLabelField
          label="Country"
          required
          options={defaultOptions}
        />
      );
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('passes disabled prop to SelectFloatingLabel', () => {
      render(
        <SelectFloatingLabelField
          label="Country"
          disabled
          options={defaultOptions}
        />
      );
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('passes leftAddOn prop to SelectFloatingLabel', () => {
      render(
        <SelectFloatingLabelField
          label="Country"
          leftAddOn={<span data-testid="addon">🌍</span>}
          options={defaultOptions}
        />
      );
      expect(screen.getByTestId('addon')).toBeInTheDocument();
    });

    it('passes defaultValue to SelectFloatingLabel', () => {
      render(
        <SelectFloatingLabelField
          label="Country"
          defaultValue="ca"
          options={defaultOptions}
        />
      );
      expect(screen.getByRole('combobox')).toHaveTextContent('Canada');
    });

    it('passes onValueChange to SelectFloatingLabel', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SelectFloatingLabelField
          label="Country"
          onValueChange={handleChange}
          options={defaultOptions}
        />
      );

      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'Mexico' }));

      expect(handleChange).toHaveBeenCalledWith('mx');
    });
  });

  describe('Container styling', () => {
    it('applies containerClassName to wrapper', () => {
      const { container } = render(
        <SelectFloatingLabelField
          label="Country"
          containerClassName="custom-container"
          options={defaultOptions}
        />
      );
      expect(container.firstChild).toHaveClass('custom-container');
    });

    it('container has flex-col layout', () => {
      const { container } = render(
        <SelectFloatingLabelField label="Country" options={defaultOptions} />
      );
      expect(container.firstChild).toHaveClass('flex', 'flex-col');
    });
  });

  describe('Hint and Error props', () => {
    it('applies hintProps to Hint component', () => {
      render(
        <SelectFloatingLabelField
          label="Country"
          hint="Hint text"
          hintProps={{ className: 'custom-hint' }}
          options={defaultOptions}
        />
      );
      const hint = screen.getByText('Hint text');
      expect(hint).toHaveClass('custom-hint');
    });

    it('applies errorProps to ErrorMessage component', () => {
      render(
        <SelectFloatingLabelField
          label="Country"
          errorMessage="Error text"
          errorProps={{ showIcon: false }}
          options={defaultOptions}
        />
      );
      // Should not have the error icon
      const errorContainer = screen.getByRole('alert');
      expect(errorContainer.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to select trigger', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <SelectFloatingLabelField
          label="Country"
          ref={ref}
          options={defaultOptions}
        />
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <SelectFloatingLabelField
          label="Country"
          ref={ref}
          options={defaultOptions}
        />
      );
      ref.current?.focus();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });
  });

  describe('Controlled mode', () => {
    it('works as controlled with value and onValueChange', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { rerender } = render(
        <SelectFloatingLabelField
          label="Country"
          value="us"
          onValueChange={handleChange}
          options={defaultOptions}
        />
      );

      expect(screen.getByRole('combobox')).toHaveTextContent('United States');

      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'Canada' }));

      expect(handleChange).toHaveBeenCalledWith('ca');

      rerender(
        <SelectFloatingLabelField
          label="Country"
          value="ca"
          onValueChange={handleChange}
          options={defaultOptions}
        />
      );

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveTextContent('Canada');
      });
    });
  });

  describe('Edge cases', () => {
    it('handles both options and children (options take precedence)', async () => {
      const user = userEvent.setup();
      render(
        <SelectFloatingLabelField label="Country" options={defaultOptions}>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectFloatingLabelField>
      );

      await user.click(screen.getByRole('combobox'));

      // Options array should be rendered
      expect(
        screen.getByRole('option', { name: 'United States' })
      ).toBeInTheDocument();
      // Custom child should not be rendered when options are provided
      expect(
        screen.queryByRole('option', { name: 'Custom' })
      ).not.toBeInTheDocument();
    });

    it('handles special characters in options', async () => {
      const user = userEvent.setup();
      const specialOptions = [
        { value: 'special', label: 'Option with "quotes" & <special> chars' },
      ];

      render(<SelectFloatingLabelField label="Test" options={specialOptions} />);

      await user.click(screen.getByRole('combobox'));
      expect(
        screen.getByRole('option', {
          name: 'Option with "quotes" & <special> chars',
        })
      ).toBeInTheDocument();
    });
  });
});
