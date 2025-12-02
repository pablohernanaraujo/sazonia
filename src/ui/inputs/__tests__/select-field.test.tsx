import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SelectField, type SelectOption } from '../select-field';

const mockOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', disabled: true },
];

describe('SelectField', () => {
  describe('Rendering', () => {
    it('renders with placeholder', () => {
      render(
        <SelectField placeholder="Select an option" options={mockOptions} />
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(
        <SelectField
          label="Category"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByText('Category')).toBeInTheDocument();
    });

    it('renders with hint', () => {
      render(
        <SelectField
          label="Category"
          hint="Choose your category"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByText('Choose your category')).toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(
        <SelectField
          label="Category"
          error="Please select a category"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByText('Please select a category')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('error replaces hint', () => {
      render(
        <SelectField
          label="Category"
          hint="Choose your category"
          error="Please select a category"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByText('Please select a category')).toBeInTheDocument();
      expect(screen.queryByText('Choose your category')).not.toBeInTheDocument();
    });
  });

  describe('Label Props', () => {
    it('shows required indicator', () => {
      render(
        <SelectField
          label="Category"
          labelProps={{ required: true }}
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('shows help icon', () => {
      render(
        <SelectField
          label="Category"
          labelProps={{ showIcon: true }}
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByLabelText('Help for Category')).toBeInTheDocument();
    });

    it('passes custom aria label to help icon', () => {
      render(
        <SelectField
          label="Category"
          labelProps={{ showIcon: true, helpIconAriaLabel: 'Category info' }}
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByLabelText('Category info')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies SM size', () => {
      render(
        <SelectField
          size="sm"
          label="Category"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('combobox')).toHaveClass('h-8');
    });

    it('applies MD size', () => {
      render(
        <SelectField
          size="md"
          label="Category"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('combobox')).toHaveClass('h-10');
    });

    it('applies LG size by default', () => {
      render(
        <SelectField
          label="Category"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('combobox')).toHaveClass('h-12');
    });

    it('maps SM input size to SM label size', () => {
      render(
        <SelectField
          size="sm"
          label="Category"
          placeholder="Select"
          options={mockOptions}
        />
      );
      // SM label has pb-2.5
      const label = screen.getByText('Category').closest('label');
      expect(label).toHaveClass('pb-2.5');
    });

    it('maps LG input size to MD label size', () => {
      render(
        <SelectField
          size="lg"
          label="Category"
          placeholder="Select"
          options={mockOptions}
        />
      );
      // MD label has pb-3
      const label = screen.getByText('Category').closest('label');
      expect(label).toHaveClass('pb-3');
    });
  });

  describe('Style Variants', () => {
    it('applies bordered variant by default', () => {
      render(<SelectField placeholder="Select" options={mockOptions} />);
      expect(screen.getByRole('combobox')).toHaveClass('border');
    });

    it('applies borderless variant', () => {
      render(
        <SelectField
          variant="borderless"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('combobox')).not.toHaveClass('border');
    });
  });

  describe('Error State', () => {
    it('applies error styling', () => {
      render(
        <SelectField
          error="Error message"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('combobox')).toHaveClass('border-destructive');
    });

    it('sets aria-invalid when error is present', () => {
      render(
        <SelectField
          error="Error message"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('does not set aria-invalid without error', () => {
      render(<SelectField placeholder="Select" options={mockOptions} />);
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      render(<SelectField disabled placeholder="Select" options={mockOptions} />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });

  describe('Left Add-on', () => {
    it('renders left add-on', () => {
      render(
        <SelectField
          leftAddOn={<span data-testid="addon">$</span>}
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByTestId('addon')).toBeInTheDocument();
    });
  });

  describe('Options', () => {
    it('renders all options', async () => {
      const user = userEvent.setup();
      render(<SelectField placeholder="Select" options={mockOptions} />);

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(
        screen.getByRole('option', { name: 'Option 1' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Option 2' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Option 3' })
      ).toBeInTheDocument();
    });

    it('marks disabled options', async () => {
      const user = userEvent.setup();
      render(<SelectField placeholder="Select" options={mockOptions} />);

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByRole('option', { name: 'Option 3' })).toHaveAttribute(
        'aria-disabled',
        'true'
      );
    });

    it('supports custom render function', async () => {
      const user = userEvent.setup();
      render(
        <SelectField
          placeholder="Select"
          options={mockOptions}
          renderOption={(option) => (
            <span data-testid={`custom-${option.value}`}>
              Custom: {option.label}
            </span>
          )}
        />
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByTestId('custom-option1')).toBeInTheDocument();
      expect(screen.getByText('Custom: Option 1')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('calls onValueChange when option is selected', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SelectField
          placeholder="Select"
          options={mockOptions}
          onValueChange={handleChange}
        />
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Option 1' }));

      expect(handleChange).toHaveBeenCalledWith('option1');
    });

    it('displays selected value', async () => {
      const user = userEvent.setup();
      render(<SelectField placeholder="Select" options={mockOptions} />);

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Option 2' }));

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });
    });

    it('works with controlled value', () => {
      render(
        <SelectField value="option2" placeholder="Select" options={mockOptions} />
      );
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('works with defaultValue', () => {
      render(
        <SelectField
          defaultValue="option1"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to trigger', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <SelectField ref={ref} placeholder="Select" options={mockOptions} />
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Accessibility', () => {
    it('associates label with trigger via htmlFor', () => {
      render(
        <SelectField
          label="Category"
          placeholder="Select"
          options={mockOptions}
        />
      );
      const trigger = screen.getByRole('combobox');
      const label = screen.getByText('Category').closest('label');
      expect(label).toHaveAttribute('for', trigger.id);
    });

    it('associates error with trigger via aria-describedby', () => {
      render(
        <SelectField
          error="Error message"
          placeholder="Select"
          options={mockOptions}
        />
      );
      const trigger = screen.getByRole('combobox');
      const errorId = trigger.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(screen.getByRole('alert')).toHaveAttribute('id', errorId);
    });

    it('associates hint with trigger via aria-describedby', () => {
      render(
        <SelectField
          hint="Help text"
          placeholder="Select"
          options={mockOptions}
        />
      );
      const trigger = screen.getByRole('combobox');
      const describedBy = trigger.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(screen.getByText('Help text')).toHaveAttribute('id', describedBy);
    });

    it('sets aria-required when required', () => {
      render(
        <SelectField
          label="Category"
          labelProps={{ required: true }}
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });
  });

  describe('className Merging', () => {
    it('merges containerClassName', () => {
      const { container } = render(
        <SelectField
          containerClassName="custom-container"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(container.firstChild).toHaveClass('custom-container');
    });

    it('merges triggerClassName', () => {
      render(
        <SelectField
          triggerClassName="custom-trigger"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('combobox')).toHaveClass('custom-trigger');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', async () => {
      const user = userEvent.setup();
      render(<SelectField placeholder="Select" options={[]} />);

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    it('handles options with special characters', async () => {
      const user = userEvent.setup();
      render(
        <SelectField
          placeholder="Select"
          options={[{ value: 'special', label: '<script>alert("xss")</script>' }]}
        />
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Should render as text, not execute
      expect(
        screen.getByRole('option', { name: '<script>alert("xss")</script>' })
      ).toBeInTheDocument();
    });
  });
});
