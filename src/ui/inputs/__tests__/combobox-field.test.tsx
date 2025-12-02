import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { type ComboboxOption } from '../combobox';
import { ComboboxField } from '../combobox-field';

// Sample options for testing
const options: ComboboxOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom', disabled: true },
];

describe('ComboboxField', () => {
  describe('Rendering', () => {
    it('renders with label', () => {
      render(
        <ComboboxField
          label="Country"
          placeholder="Search countries..."
          options={options}
        />
      );

      expect(screen.getByText('Country')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search countries...')
      ).toBeInTheDocument();
    });

    it('renders without label', () => {
      render(
        <ComboboxField placeholder="Search countries..." options={options} />
      );

      expect(screen.queryByRole('label')).not.toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search countries...')
      ).toBeInTheDocument();
    });

    it('renders with hint', () => {
      render(
        <ComboboxField
          label="Country"
          hint="Select your country of residence"
          placeholder="Search..."
          options={options}
        />
      );

      expect(
        screen.getByText('Select your country of residence')
      ).toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(
        <ComboboxField
          label="Country"
          errorMessage="Please select a country"
          placeholder="Search..."
          options={options}
        />
      );

      expect(screen.getByText('Please select a country')).toBeInTheDocument();
    });

    it('hides hint when error message is present', () => {
      render(
        <ComboboxField
          label="Country"
          hint="Select your country"
          errorMessage="Please select a country"
          placeholder="Search..."
          options={options}
        />
      );

      expect(screen.queryByText('Select your country')).not.toBeInTheDocument();
      expect(screen.getByText('Please select a country')).toBeInTheDocument();
    });

    it('renders with required indicator', () => {
      render(
        <ComboboxField
          label="Country"
          labelProps={{ required: true }}
          placeholder="Search..."
          options={options}
        />
      );

      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies SM size', () => {
      render(
        <ComboboxField
          label="Country"
          size="sm"
          placeholder="Search..."
          options={options}
        />
      );

      const input = screen.getByRole('combobox');
      expect(input.closest('div')).toHaveClass('h-8');
    });

    it('applies MD size', () => {
      render(
        <ComboboxField
          label="Country"
          size="md"
          placeholder="Search..."
          options={options}
        />
      );

      const input = screen.getByRole('combobox');
      expect(input.closest('div')).toHaveClass('h-10');
    });

    it('applies LG size by default', () => {
      render(
        <ComboboxField
          label="Country"
          placeholder="Search..."
          options={options}
        />
      );

      const input = screen.getByRole('combobox');
      expect(input.closest('div')).toHaveClass('h-12');
    });
  });

  describe('Filtering', () => {
    it('filters options as user types', async () => {
      const user = userEvent.setup();
      render(
        <ComboboxField
          label="Country"
          placeholder="Search..."
          options={options}
        />
      );

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'United');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Should show matching options
      expect(
        screen.getByRole('option', { name: 'United States' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'United Kingdom' })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('option', { name: 'Canada' })
      ).not.toBeInTheDocument();
    });

    it('shows empty message when no options match', async () => {
      const user = userEvent.setup();
      render(
        <ComboboxField
          label="Country"
          placeholder="Search..."
          options={options}
          emptyMessage="No countries found"
        />
      );

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'xyz');

      await waitFor(() => {
        expect(screen.getByText('No countries found')).toBeInTheDocument();
      });
    });

    it('supports custom filter function', async () => {
      const user = userEvent.setup();
      const customFilter = vi.fn((opts: ComboboxOption[], query: string) =>
        opts.filter((opt) => opt.value.includes(query.toLowerCase()))
      );

      render(
        <ComboboxField
          label="Country"
          placeholder="Search..."
          options={options}
          filterOptions={customFilter}
        />
      );

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'ca');

      expect(customFilter).toHaveBeenCalled();
    });
  });

  describe('Selection', () => {
    it('selects option on click', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <ComboboxField
          label="Country"
          placeholder="Search..."
          options={options}
          onValueChange={handleChange}
        />
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Canada' }));

      expect(handleChange).toHaveBeenCalledWith('ca');
    });

    it('updates displayed value after selection', async () => {
      const user = userEvent.setup();
      render(
        <ComboboxField
          label="Country"
          placeholder="Search..."
          options={options}
        />
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Mexico' }));

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveValue('Mexico');
      });
    });

    it('does not select disabled options', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <ComboboxField
          label="Country"
          placeholder="Search..."
          options={options}
          onValueChange={handleChange}
        />
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'United Kingdom' }));

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Controlled Mode', () => {
    it('displays controlled value', () => {
      render(
        <ComboboxField
          label="Country"
          value="ca"
          placeholder="Search..."
          options={options}
        />
      );

      expect(screen.getByRole('combobox')).toHaveValue('Canada');
    });

    it('calls onValueChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <ComboboxField
          label="Country"
          value="us"
          onValueChange={handleChange}
          placeholder="Search..."
          options={options}
        />
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Mexico' }));

      expect(handleChange).toHaveBeenCalledWith('mx');
    });
  });

  describe('Error State', () => {
    it('applies error styling when error prop is true', () => {
      render(
        <ComboboxField
          label="Country"
          error
          placeholder="Search..."
          options={options}
        />
      );

      const input = screen.getByRole('combobox');
      expect(input.closest('div')).toHaveClass('border-destructive');
    });

    it('applies error styling when errorMessage is provided', () => {
      render(
        <ComboboxField
          label="Country"
          errorMessage="Required field"
          placeholder="Search..."
          options={options}
        />
      );

      const input = screen.getByRole('combobox');
      expect(input.closest('div')).toHaveClass('border-destructive');
    });
  });

  describe('Disabled State', () => {
    it('disables combobox when disabled prop is true', () => {
      render(
        <ComboboxField
          label="Country"
          disabled
          placeholder="Search..."
          options={options}
        />
      );

      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('prevents opening when disabled', async () => {
      const user = userEvent.setup();
      render(
        <ComboboxField
          label="Country"
          disabled
          placeholder="Search..."
          options={options}
        />
      );

      await user.click(screen.getByRole('combobox'));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Left Add-on', () => {
    it('renders left add-on', () => {
      render(
        <ComboboxField
          label="Country"
          leftAddOn={<span data-testid="flag-icon">flag</span>}
          placeholder="Search..."
          options={options}
        />
      );

      expect(screen.getByTestId('flag-icon')).toBeInTheDocument();
    });
  });

  describe('Clear Button', () => {
    it('shows clear button when value is selected', async () => {
      const user = userEvent.setup();
      render(
        <ComboboxField
          label="Country"
          placeholder="Search..."
          options={options}
        />
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Canada' }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Clear selection' })
        ).toBeInTheDocument();
      });
    });

    it('can be hidden via showClear prop', async () => {
      const user = userEvent.setup();
      render(
        <ComboboxField
          label="Country"
          placeholder="Search..."
          options={options}
          showClear={false}
        />
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Canada' }));

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveValue('Canada');
      });

      expect(
        screen.queryByRole('button', { name: 'Clear selection' })
      ).not.toBeInTheDocument();
    });
  });

  describe('Custom Rendering', () => {
    it('supports custom option rendering', async () => {
      const user = userEvent.setup();
      render(
        <ComboboxField
          label="Country"
          placeholder="Search..."
          options={options}
          renderOption={(option) => (
            <span data-testid={`custom-${option.value}`}>
              {option.label} (custom)
            </span>
          )}
        />
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByTestId('custom-us')).toBeInTheDocument();
      expect(screen.getByText('United States (custom)')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('associates label with combobox', () => {
      render(
        <ComboboxField
          label="Country"
          placeholder="Search..."
          options={options}
        />
      );

      const input = screen.getByRole('combobox');
      const inputId = input.getAttribute('id');

      expect(screen.getByText('Country').closest('label')).toHaveAttribute(
        'for',
        inputId
      );
    });

    it('associates hint with combobox via aria-describedby', () => {
      render(
        <ComboboxField
          label="Country"
          hint="Select your country"
          placeholder="Search..."
          options={options}
        />
      );

      const input = screen.getByRole('combobox');
      const describedById = input.getAttribute('aria-describedby');
      const hint = screen.getByText('Select your country');

      expect(describedById).toBe(hint.getAttribute('id'));
    });

    it('associates error with combobox via aria-describedby', () => {
      render(
        <ComboboxField
          label="Country"
          errorMessage="Required field"
          placeholder="Search..."
          options={options}
        />
      );

      const input = screen.getByRole('combobox');
      const describedById = input.getAttribute('aria-describedby');
      // The ErrorMessage component renders with role="alert"
      const error = screen.getByRole('alert');

      expect(describedById).toBe(error.getAttribute('id'));
    });

    it('sets aria-invalid when error is present', () => {
      render(
        <ComboboxField
          label="Country"
          errorMessage="Required field"
          placeholder="Search..."
          options={options}
        />
      );

      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('sets aria-required when required', () => {
      render(
        <ComboboxField
          label="Country"
          labelProps={{ required: true }}
          placeholder="Search..."
          options={options}
        />
      );

      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });
  });

  describe('Query Change Callback', () => {
    it('calls onQueryChange when user types', async () => {
      const user = userEvent.setup();
      const handleQueryChange = vi.fn();
      render(
        <ComboboxField
          label="Country"
          placeholder="Search..."
          options={options}
          onQueryChange={handleQueryChange}
        />
      );

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'can');

      expect(handleQueryChange).toHaveBeenCalledWith('c');
      expect(handleQueryChange).toHaveBeenCalledWith('ca');
      expect(handleQueryChange).toHaveBeenCalledWith('can');
    });
  });

  describe('Container className', () => {
    it('applies containerClassName to wrapper', () => {
      render(
        <ComboboxField
          label="Country"
          placeholder="Search..."
          options={options}
          containerClassName="custom-container"
        />
      );

      const container = screen.getByText('Country').closest('div.flex.flex-col');
      expect(container).toHaveClass('custom-container');
    });
  });
});
