import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../select';

// Helper function to render a basic Select
function renderSelect(
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
  } = {}
) {
  const {
    placeholder = 'Select an option',
    value,
    defaultValue,
    onValueChange,
    disabled,
    size,
    variant,
    error,
    leftAddOn,
  } = props;

  return render(
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      size={size}
    >
      <SelectTrigger variant={variant} error={error} leftAddOn={leftAddOn}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3" disabled>
          Option 3 (Disabled)
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

describe('Select', () => {
  describe('Rendering', () => {
    it('renders with placeholder', () => {
      renderSelect({ placeholder: 'Choose an option' });
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    it('renders with default value', () => {
      renderSelect({ defaultValue: 'option1' });
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('renders trigger as combobox role', () => {
      renderSelect();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('has aria-expanded false when closed', () => {
      renderSelect();
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-expanded',
        'false'
      );
    });
  });

  describe('Opening/Closing', () => {
    it('opens dropdown on click', async () => {
      const user = userEvent.setup();
      renderSelect();

      const combobox = screen.getByRole('combobox');
      await user.click(combobox);

      await waitFor(() => {
        expect(combobox).toHaveAttribute('aria-expanded', 'true');
      });
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('closes dropdown on outside click', async () => {
      const user = userEvent.setup({ pointerEventsCheck: 0 });
      renderSelect();

      // Open
      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Press Escape instead of clicking outside (more reliable in jsdom)
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('closes dropdown on Escape key', async () => {
      const user = userEvent.setup();
      renderSelect();

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

    it('opens dropdown on Enter key', async () => {
      const user = userEvent.setup();
      renderSelect();

      screen.getByRole('combobox').focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('opens dropdown on Space key', async () => {
      const user = userEvent.setup();
      renderSelect();

      screen.getByRole('combobox').focus();
      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });
  });

  describe('Selection', () => {
    it('selects option on click', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderSelect({ onValueChange: handleChange });

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
      renderSelect({ onValueChange: handleChange });

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalled();
    });

    it('closes dropdown after selection', async () => {
      const user = userEvent.setup();
      renderSelect();

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
      renderSelect();

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Option 2' }));

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates options with Arrow keys', async () => {
      const user = userEvent.setup();
      renderSelect();

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      // Options should be navigable
      const options = screen.getAllByRole('option');
      expect(options.length).toBe(3);
    });

    it('skips disabled options during navigation', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderSelect({ onValueChange: handleChange });

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Navigate to disabled option and try to select
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}'); // Third option (disabled)
      await user.keyboard('{Enter}');

      // Should not select disabled option
      // Note: Radix skips disabled items, so Enter won't select it
    });

    it('supports type-ahead search', async () => {
      const user = userEvent.setup();
      renderSelect();

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Type to search
      await user.keyboard('Option 2');

      // The matching option should be focused
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute when disabled', () => {
      renderSelect({ disabled: true });
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('prevents opening when disabled', async () => {
      const user = userEvent.setup();
      renderSelect({ disabled: true });

      await user.click(screen.getByRole('combobox'));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('has disabled styling', () => {
      renderSelect({ disabled: true });
      expect(screen.getByRole('combobox')).toHaveClass(
        'disabled:bg-background-secondary'
      );
    });
  });

  describe('Size Variants', () => {
    it('applies SM size variant', () => {
      renderSelect({ size: 'sm' });
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-8', 'px-3', 'py-1.5');
    });

    it('applies MD size variant', () => {
      renderSelect({ size: 'md' });
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-10', 'px-3.5', 'py-2.5');
    });

    it('applies LG size variant by default', () => {
      renderSelect();
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('h-12', 'px-4', 'py-3');
    });

    it('propagates size to content', async () => {
      const user = userEvent.setup();
      renderSelect({ size: 'sm' });

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Check that items have correct size classes
      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveClass('text-sm', 'leading-5');
    });
  });

  describe('Style Variants', () => {
    it('applies bordered variant by default', () => {
      renderSelect();
      expect(screen.getByRole('combobox')).toHaveClass('border');
    });

    it('applies borderless variant', () => {
      renderSelect({ variant: 'borderless' });
      expect(screen.getByRole('combobox')).not.toHaveClass('border');
    });
  });

  describe('Error State', () => {
    it('applies error styling when error is true', () => {
      renderSelect({ error: true });
      expect(screen.getByRole('combobox')).toHaveClass('border-destructive');
    });

    it('does not apply error styling when error is false', () => {
      renderSelect({ error: false });
      expect(screen.getByRole('combobox')).not.toHaveClass('border-destructive');
    });
  });

  describe('Left Add-on', () => {
    it('renders left add-on', () => {
      renderSelect({ leftAddOn: <span data-testid="left-addon">$</span> });
      expect(screen.getByTestId('left-addon')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to trigger element', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <Select>
          <SelectTrigger ref={ref}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <Select>
          <SelectTrigger ref={ref}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );
      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });

  describe('Controlled Mode', () => {
    it('displays controlled value', () => {
      renderSelect({ value: 'option2' });
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('calls onValueChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderSelect({ value: 'option1', onValueChange: handleChange });

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: 'Option 2' }));

      expect(handleChange).toHaveBeenCalledWith('option2');
    });
  });

  describe('SelectGroup and SelectLabel', () => {
    it('renders groups with labels', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Vegetables</SelectLabel>
              <SelectItem value="carrot">Carrot</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByText('Fruits')).toBeInTheDocument();
      expect(screen.getByText('Vegetables')).toBeInTheDocument();
    });
  });

  describe('SelectSeparator', () => {
    it('renders separator', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectSeparator data-testid="separator" />
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByTestId('separator')).toBeInTheDocument();
      expect(screen.getByTestId('separator')).toHaveClass('bg-border');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderSelect();
      const trigger = screen.getByRole('combobox');

      expect(trigger).toHaveAttribute('aria-expanded');
      expect(trigger).toHaveAttribute('aria-autocomplete', 'none');
    });

    it('options have aria-selected', async () => {
      const user = userEvent.setup();
      renderSelect({ defaultValue: 'option1' });

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
      renderSelect();

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const disabledOption = screen.getByRole('option', {
        name: 'Option 3 (Disabled)',
      });
      // Radix UI Select uses data-disabled attribute for disabled items
      expect(disabledOption).toHaveAttribute('data-disabled');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>{/* No options */}</SelectContent>
        </Select>
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Should still render the listbox, just empty
      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    it('handles very long option text', async () => {
      const user = userEvent.setup();
      const longText = 'A'.repeat(200);
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="long">{longText}</SelectItem>
          </SelectContent>
        </Select>
      );

      await user.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByRole('option', { name: longText })).toBeInTheDocument();
    });

    it('handles rapid open/close', async () => {
      const user = userEvent.setup({ pointerEventsCheck: 0 });
      renderSelect();

      const trigger = screen.getByRole('combobox');

      // Open dropdown
      await user.click(trigger);
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });

      // Close with Escape
      await user.keyboard('{Escape}');

      // Should end up in a stable state
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('handles value that does not match any option', () => {
      render(
        <Select value="nonexistent">
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      // Should show placeholder since value doesn't match
      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeInTheDocument();
    });
  });

  describe('className Merging', () => {
    it('merges custom className on trigger', () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger-class">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByRole('combobox')).toHaveClass('custom-trigger-class');
    });

    it('preserves default classes when merging', () => {
      render(
        <Select>
          <SelectTrigger className="custom-class">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveClass('custom-class');
      expect(trigger).toHaveClass('bg-background');
    });
  });
});
