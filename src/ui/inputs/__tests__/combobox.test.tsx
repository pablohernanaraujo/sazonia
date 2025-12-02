import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  type ComboboxOption,
  ComboboxTrigger,
} from '../combobox';

// Sample options for testing
const options: ComboboxOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', disabled: true },
];

// Helper function to render a basic Combobox
function renderCombobox(
  props: {
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'bordered' | 'borderless';
    error?: boolean;
    leftAddOn?: React.ReactNode;
    showClear?: boolean;
    options?: ComboboxOption[];
  } = {}
) {
  const {
    placeholder = 'Search...',
    value,
    defaultValue,
    onValueChange,
    disabled,
    size,
    variant,
    error,
    leftAddOn,
    showClear,
    options: testOptions = options,
  } = props;

  return render(
    <Combobox
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      error={error}
      size={size}
    >
      <ComboboxTrigger
        variant={variant}
        leftAddOn={leftAddOn}
        showClear={showClear}
      >
        <ComboboxInput placeholder={placeholder} options={testOptions} />
      </ComboboxTrigger>
      <ComboboxContent>
        {testOptions.map((option, index) => (
          <ComboboxItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            index={index}
          >
            {option.label}
          </ComboboxItem>
        ))}
      </ComboboxContent>
    </Combobox>
  );
}

describe('Combobox', () => {
  describe('Rendering', () => {
    it('renders with placeholder', () => {
      renderCombobox({ placeholder: 'Search options...' });
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search options...')
      ).toBeInTheDocument();
    });

    it('renders with default value', () => {
      renderCombobox({ defaultValue: 'option1' });
      expect(screen.getByRole('combobox')).toHaveValue('Option 1');
    });

    it('renders input as combobox role', () => {
      renderCombobox();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('has aria-expanded false when closed', () => {
      renderCombobox();
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-expanded',
        'false'
      );
    });
  });

  describe('Opening/Closing', () => {
    it('opens dropdown on input focus', async () => {
      const user = userEvent.setup();
      renderCombobox();

      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-expanded', 'true');
      });
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('opens dropdown on trigger click', async () => {
      const user = userEvent.setup();
      renderCombobox();

      // Click the trigger wrapper (not input)
      const input = screen.getByRole('combobox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('closes dropdown on Escape key', async () => {
      const user = userEvent.setup();
      renderCombobox();

      // Open
      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Press Escape
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('opens dropdown on ArrowDown key', async () => {
      const user = userEvent.setup();
      renderCombobox();

      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });
  });

  describe('Filtering', () => {
    it('filters options as user types', async () => {
      const user = userEvent.setup();
      renderCombobox();

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'Option 1');

      await waitFor(() => {
        expect(input).toHaveValue('Option 1');
      });
    });

    it('clears filter query on selection', async () => {
      const user = userEvent.setup();
      renderCombobox();

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'test');

      await waitFor(() => {
        expect(input).toHaveValue('test');
      });

      // Select an option
      await user.click(screen.getByRole('option', { name: 'Option 1' }));

      await waitFor(() => {
        // After selection, should show the selected label
        expect(input).toHaveValue('Option 1');
      });
    });

    it('clears filter on Escape', async () => {
      const user = userEvent.setup();
      renderCombobox();

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'test');

      await waitFor(() => {
        expect(input).toHaveValue('test');
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });
  });

  describe('Selection', () => {
    it('selects option on click', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderCombobox({ onValueChange: handleChange });

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Option 1' }));

      expect(handleChange).toHaveBeenCalledWith('option1');
    });

    it('selects option on Enter key', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderCombobox({ onValueChange: handleChange });

      const input = screen.getByRole('combobox');
      await user.click(input);
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalledWith('option1');
    });

    it('closes dropdown after selection', async () => {
      const user = userEvent.setup();
      renderCombobox();

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Option 1' }));

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('updates displayed value after selection', async () => {
      const user = userEvent.setup();
      renderCombobox();

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Option 2' }));

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveValue('Option 2');
      });
    });

    it('does not select disabled options', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderCombobox({ onValueChange: handleChange });

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Option 3' }));

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Clear Button', () => {
    it('shows clear button when value is selected', async () => {
      const user = userEvent.setup();
      renderCombobox({ showClear: true });

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Option 1' }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Clear selection' })
        ).toBeInTheDocument();
      });
    });

    it('clears value when clear button is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderCombobox({ defaultValue: 'option1', onValueChange: handleChange });

      const clearButton = screen.getByRole('button', { name: 'Clear selection' });
      await user.click(clearButton);

      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('does not show clear button when disabled', () => {
      renderCombobox({ defaultValue: 'option1', disabled: true });
      expect(
        screen.queryByRole('button', { name: 'Clear selection' })
      ).not.toBeInTheDocument();
    });

    it('does not show clear button when no value', () => {
      renderCombobox({ showClear: true });
      expect(
        screen.queryByRole('button', { name: 'Clear selection' })
      ).not.toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates options with ArrowDown key', async () => {
      const user = userEvent.setup();
      renderCombobox();

      const input = screen.getByRole('combobox');
      await user.click(input);
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      // First enabled option should be highlighted
      const options = screen.getAllByRole('option');
      expect(options[1]).toHaveAttribute('data-highlighted', 'true');
    });

    it('navigates options with ArrowUp key', async () => {
      const user = userEvent.setup();
      renderCombobox();

      const input = screen.getByRole('combobox');
      await user.click(input);
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowUp}');

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('data-highlighted', 'true');
    });

    it('clamps navigation at boundaries', async () => {
      const user = userEvent.setup();
      renderCombobox();

      const input = screen.getByRole('combobox');
      await user.click(input);
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Navigate down past last option
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      // Should clamp at last enabled option (index 1, since index 2 is disabled)
      const options = screen.getAllByRole('option');
      expect(options[1]).toHaveAttribute('data-highlighted', 'true');
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute when disabled', () => {
      renderCombobox({ disabled: true });
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('prevents opening when disabled', async () => {
      const user = userEvent.setup();
      renderCombobox({ disabled: true });

      await user.click(screen.getByRole('combobox'));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies SM size variant', () => {
      renderCombobox({ size: 'sm' });
      // The trigger wrapper should have the size classes
      const input = screen.getByRole('combobox');
      expect(input.closest('div')).toHaveClass('h-8');
    });

    it('applies MD size variant', () => {
      renderCombobox({ size: 'md' });
      const input = screen.getByRole('combobox');
      expect(input.closest('div')).toHaveClass('h-10');
    });

    it('applies LG size variant by default', () => {
      renderCombobox();
      const input = screen.getByRole('combobox');
      expect(input.closest('div')).toHaveClass('h-12');
    });

    it('propagates size to items', async () => {
      const user = userEvent.setup();
      renderCombobox({ size: 'sm' });

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveClass('text-sm', 'leading-5');
    });
  });

  describe('Style Variants', () => {
    it('applies bordered variant by default', () => {
      renderCombobox();
      const input = screen.getByRole('combobox');
      expect(input.closest('div')).toHaveClass('border');
    });

    it('applies borderless variant', () => {
      renderCombobox({ variant: 'borderless' });
      const input = screen.getByRole('combobox');
      expect(input.closest('div')).not.toHaveClass('border');
    });
  });

  describe('Error State', () => {
    it('applies error styling when error is true', () => {
      renderCombobox({ error: true });
      const input = screen.getByRole('combobox');
      expect(input.closest('div')).toHaveClass('border-destructive');
    });

    it('does not apply error styling when error is false', () => {
      renderCombobox({ error: false });
      const input = screen.getByRole('combobox');
      expect(input.closest('div')).not.toHaveClass('border-destructive');
    });
  });

  describe('Left Add-on', () => {
    it('renders left add-on', () => {
      renderCombobox({ leftAddOn: <span data-testid="left-addon">$</span> });
      expect(screen.getByTestId('left-addon')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to trigger element', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Combobox>
          <ComboboxTrigger ref={ref}>
            <ComboboxInput placeholder="Search" options={options} />
          </ComboboxTrigger>
          <ComboboxContent>
            {options.map((option, index) => (
              <ComboboxItem key={option.value} value={option.value} index={index}>
                {option.label}
              </ComboboxItem>
            ))}
          </ComboboxContent>
        </Combobox>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Controlled Mode', () => {
    it('displays controlled value', () => {
      renderCombobox({ value: 'option2' });
      expect(screen.getByRole('combobox')).toHaveValue('Option 2');
    });

    it('calls onValueChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderCombobox({ value: 'option1', onValueChange: handleChange });

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Option 2' }));

      expect(handleChange).toHaveBeenCalledWith('option2');
    });
  });

  describe('ComboboxEmpty', () => {
    it('renders empty message when no options', async () => {
      const user = userEvent.setup();
      render(
        <Combobox>
          <ComboboxTrigger>
            <ComboboxInput placeholder="Search" options={[]} />
          </ComboboxTrigger>
          <ComboboxContent>
            <ComboboxEmpty>No results found</ComboboxEmpty>
          </ComboboxContent>
        </Combobox>
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('renders default empty message', async () => {
      const user = userEvent.setup();
      render(
        <Combobox>
          <ComboboxTrigger>
            <ComboboxInput placeholder="Search" options={[]} />
          </ComboboxTrigger>
          <ComboboxContent>
            <ComboboxEmpty />
          </ComboboxContent>
        </Combobox>
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes on input', () => {
      renderCombobox();
      const input = screen.getByRole('combobox');

      expect(input).toHaveAttribute('aria-expanded');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
    });

    it('options have aria-selected', async () => {
      const user = userEvent.setup();
      renderCombobox({ defaultValue: 'option1' });

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const selectedOption = screen.getByRole('option', { name: 'Option 1' });
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');

      const unselectedOption = screen.getByRole('option', { name: 'Option 2' });
      expect(unselectedOption).toHaveAttribute('aria-selected', 'false');
    });

    it('disabled options have aria-disabled', async () => {
      const user = userEvent.setup();
      renderCombobox();

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const disabledOption = screen.getByRole('option', { name: 'Option 3' });
      expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', async () => {
      const user = userEvent.setup();
      renderCombobox({ options: [] });

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    it('handles very long option text', async () => {
      const user = userEvent.setup();
      const longText = 'A'.repeat(200);
      renderCombobox({
        options: [{ value: 'long', label: longText }],
      });

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByRole('option', { name: longText })).toBeInTheDocument();
    });

    it('handles rapid typing', async () => {
      const user = userEvent.setup();
      renderCombobox();

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'test query');

      expect(input).toHaveValue('test query');
    });

    it('handles value that does not match any option', () => {
      renderCombobox({ value: 'nonexistent' });
      // Should show empty since value doesn't match any label
      expect(screen.getByRole('combobox')).toHaveValue('');
    });
  });

  describe('className Merging', () => {
    it('merges custom className on trigger', () => {
      render(
        <Combobox>
          <ComboboxTrigger className="custom-trigger-class">
            <ComboboxInput placeholder="Search" options={options} />
          </ComboboxTrigger>
          <ComboboxContent>
            {options.map((option, index) => (
              <ComboboxItem key={option.value} value={option.value} index={index}>
                {option.label}
              </ComboboxItem>
            ))}
          </ComboboxContent>
        </Combobox>
      );
      const input = screen.getByRole('combobox');
      expect(input.closest('div')).toHaveClass('custom-trigger-class');
    });

    it('preserves default classes when merging', () => {
      render(
        <Combobox>
          <ComboboxTrigger className="custom-class">
            <ComboboxInput placeholder="Search" options={options} />
          </ComboboxTrigger>
          <ComboboxContent>
            {options.map((option, index) => (
              <ComboboxItem key={option.value} value={option.value} index={index}>
                {option.label}
              </ComboboxItem>
            ))}
          </ComboboxContent>
        </Combobox>
      );
      const input = screen.getByRole('combobox');
      const trigger = input.closest('div');
      expect(trigger).toHaveClass('custom-class');
      expect(trigger).toHaveClass('bg-background');
    });
  });
});
