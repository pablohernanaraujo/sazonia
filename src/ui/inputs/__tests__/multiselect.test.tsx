import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Multiselect,
  MultiselectOptionItem,
  MultiselectOptions,
  MultiselectPopoverContent,
  MultiselectSearch,
  MultiselectTrigger,
  MultiselectValue,
} from '../multiselect';

// Sample options for tests
const sampleOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany', disabled: true },
];

// Helper function to render a basic Multiselect
function renderMultiselect(
  props: {
    options?: typeof sampleOptions;
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'bordered' | 'borderless';
    error?: boolean;
    placeholder?: string;
    leftAddOn?: React.ReactNode;
    showSearch?: boolean;
  } = {}
) {
  const {
    options = sampleOptions,
    value,
    defaultValue,
    onValueChange,
    disabled,
    size,
    variant,
    error,
    placeholder = 'Select options',
    leftAddOn,
    showSearch = true,
  } = props;

  return render(
    <Multiselect
      options={options}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      size={size}
    >
      <MultiselectTrigger
        data-testid="multiselect-trigger"
        variant={variant}
        error={error}
        leftAddOn={leftAddOn}
      >
        <MultiselectValue placeholder={placeholder} />
      </MultiselectTrigger>
      <MultiselectPopoverContent>
        {showSearch && <MultiselectSearch placeholder="Search..." />}
        <MultiselectOptions />
      </MultiselectPopoverContent>
    </Multiselect>
  );
}

// Helper to get the trigger element
function getTrigger(): HTMLElement {
  return screen.getByTestId('multiselect-trigger');
}

describe('Multiselect', () => {
  describe('Rendering', () => {
    it('renders with placeholder', () => {
      renderMultiselect({ placeholder: 'Choose options' });
      expect(getTrigger()).toBeInTheDocument();
      expect(screen.getByText('Choose options')).toBeInTheDocument();
    });

    it('renders with default values', () => {
      renderMultiselect({ defaultValue: ['us', 'ca'] });
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });

    it('renders trigger as button', () => {
      renderMultiselect();
      expect(getTrigger()).toBeInTheDocument();
    });
  });

  describe('Opening/Closing', () => {
    it('opens dropdown on click', async () => {
      const user = userEvent.setup();
      renderMultiselect();

      const trigger = getTrigger();
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('closes dropdown on outside click', async () => {
      const user = userEvent.setup({ pointerEventsCheck: 0 });
      renderMultiselect();

      // Open
      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Press Escape instead of clicking outside
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('closes dropdown on Escape key', async () => {
      const user = userEvent.setup();
      renderMultiselect();

      // Open
      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Press Escape
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('Selection', () => {
    it('selects option on click', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderMultiselect({ onValueChange: handleChange });

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: /United States/i }));

      expect(handleChange).toHaveBeenCalledWith(['us']);
    });

    it('selects multiple options', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderMultiselect({ onValueChange: handleChange });

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: /United States/i }));
      expect(handleChange).toHaveBeenCalledWith(['us']);

      await user.click(screen.getByRole('option', { name: /Canada/i }));
      expect(handleChange).toHaveBeenCalledWith(['us', 'ca']);
    });

    it('deselects option on second click', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderMultiselect({ defaultValue: ['us'], onValueChange: handleChange });

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Click to deselect
      await user.click(screen.getByRole('option', { name: /United States/i }));

      expect(handleChange).toHaveBeenCalledWith([]);
    });

    it('does not close dropdown after selection', async () => {
      const user = userEvent.setup();
      renderMultiselect();

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: /United States/i }));

      // Dropdown should remain open for multi-selection
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('updates displayed tags after selection', async () => {
      const user = userEvent.setup();
      renderMultiselect();

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: /United States/i }));

      // Close the dropdown
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.getByText('United States')).toBeInTheDocument();
      });
    });
  });

  describe('Tag Removal', () => {
    it('removes tag via X button', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderMultiselect({
        defaultValue: ['us', 'ca'],
        onValueChange: handleChange,
      });

      // Find and click the remove button for United States
      const removeButton = screen.getByLabelText('Remove United States');
      await user.click(removeButton);

      expect(handleChange).toHaveBeenCalledWith(['ca']);
    });

    it('clears all selections via clear button', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderMultiselect({
        defaultValue: ['us', 'ca', 'mx'],
        onValueChange: handleChange,
      });

      // Find and click the clear all button
      const clearButton = screen.getByLabelText('Clear all selections');
      await user.click(clearButton);

      expect(handleChange).toHaveBeenCalledWith([]);
    });
  });

  describe('Search Filtering', () => {
    it('filters options based on search input', async () => {
      const user = userEvent.setup();
      renderMultiselect();

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'United');

      // Only United States and United Kingdom should match
      expect(
        screen.getByRole('option', { name: /United States/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: /United Kingdom/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('option', { name: /Canada/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('option', { name: /Mexico/i })
      ).not.toBeInTheDocument();
    });

    it('shows empty text when no options match', async () => {
      const user = userEvent.setup();
      renderMultiselect();

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'zzzzz');

      expect(screen.getByText('No options found')).toBeInTheDocument();
    });

    it('clears search on dropdown close', async () => {
      const user = userEvent.setup();
      renderMultiselect();

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'United');

      // Close the dropdown
      await user.keyboard('{Escape}');

      // Reopen
      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Search should be cleared, all options visible
      expect(screen.getAllByRole('option').length).toBeGreaterThan(2);
    });
  });

  describe('Keyboard Navigation', () => {
    it('selects option on Enter key', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderMultiselect({ onValueChange: handleChange });

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Focus first option and press Enter
      const firstOption = screen.getByRole('option', { name: /United States/i });
      firstOption.focus();
      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalledWith(['us']);
    });

    it('selects option on Space key', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderMultiselect({ onValueChange: handleChange });

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Focus first option and press Space
      const firstOption = screen.getByRole('option', { name: /United States/i });
      firstOption.focus();
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalledWith(['us']);
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute when disabled', () => {
      renderMultiselect({ disabled: true });
      expect(getTrigger()).toBeDisabled();
    });

    it('prevents opening when disabled', async () => {
      const user = userEvent.setup();
      renderMultiselect({ disabled: true });

      await user.click(getTrigger());

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('hides clear button when disabled', () => {
      renderMultiselect({ disabled: true, defaultValue: ['us', 'ca'] });
      expect(
        screen.queryByLabelText('Clear all selections')
      ).not.toBeInTheDocument();
    });

    it('prevents tag removal when disabled', () => {
      renderMultiselect({ disabled: true, defaultValue: ['us'] });
      // Tag should be visible but without remove button
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(
        screen.queryByLabelText('Remove United States')
      ).not.toBeInTheDocument();
    });

    it('does not select disabled options', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderMultiselect({ onValueChange: handleChange });

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Try to click disabled option
      const disabledOption = screen.getByRole('option', { name: /Germany/i });
      await user.click(disabledOption);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Size Variants', () => {
    it('applies SM size variant', () => {
      renderMultiselect({ size: 'sm' });
      const trigger = getTrigger();
      expect(trigger).toHaveClass('min-h-8', 'px-3', 'py-1.5');
    });

    it('applies MD size variant', () => {
      renderMultiselect({ size: 'md' });
      const trigger = getTrigger();
      expect(trigger).toHaveClass('min-h-10', 'px-3.5', 'py-2');
    });

    it('applies LG size variant by default', () => {
      renderMultiselect();
      const trigger = getTrigger();
      expect(trigger).toHaveClass('min-h-12', 'px-4', 'py-2.5');
    });

    it('propagates size to options', async () => {
      const user = userEvent.setup();
      renderMultiselect({ size: 'sm' });

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveClass('text-sm', 'leading-5');
    });
  });

  describe('Style Variants', () => {
    it('applies bordered variant by default', () => {
      renderMultiselect();
      expect(getTrigger()).toHaveClass('border');
    });

    it('applies borderless variant', () => {
      renderMultiselect({ variant: 'borderless' });
      expect(getTrigger()).not.toHaveClass('border');
    });
  });

  describe('Error State', () => {
    it('applies error styling when error is true', () => {
      renderMultiselect({ error: true });
      expect(getTrigger()).toHaveClass('border-destructive');
    });

    it('does not apply error styling when error is false', () => {
      renderMultiselect({ error: false });
      expect(getTrigger()).not.toHaveClass('border-destructive');
    });
  });

  describe('Left Add-on', () => {
    it('renders left add-on', () => {
      renderMultiselect({ leftAddOn: <span data-testid="left-addon">$</span> });
      expect(screen.getByTestId('left-addon')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to trigger element', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <Multiselect options={sampleOptions}>
          <MultiselectTrigger ref={ref}>
            <MultiselectValue placeholder="Select" />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <Multiselect options={sampleOptions}>
          <MultiselectTrigger ref={ref}>
            <MultiselectValue placeholder="Select" />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      );
      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });

  describe('Controlled Mode', () => {
    it('displays controlled values', () => {
      renderMultiselect({ value: ['us', 'ca'] });
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });

    it('calls onValueChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderMultiselect({ value: ['us'], onValueChange: handleChange });

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: /Canada/i }));

      expect(handleChange).toHaveBeenCalledWith(['us', 'ca']);
    });
  });

  describe('MultiselectValue Display', () => {
    it('shows placeholder when empty', () => {
      renderMultiselect({ placeholder: 'Pick options' });
      expect(screen.getByText('Pick options')).toBeInTheDocument();
    });

    it('shows tags for selected values', () => {
      renderMultiselect({ defaultValue: ['us', 'ca', 'mx'] });
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('Mexico')).toBeInTheDocument();
    });

    it('shows +N more when exceeding maxDisplayTags', () => {
      render(
        <Multiselect
          options={sampleOptions}
          defaultValue={['us', 'ca', 'mx', 'uk']}
        >
          <MultiselectTrigger>
            <MultiselectValue placeholder="Select" maxDisplayTags={2} />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      );

      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });

    it('shows count when displayMode is count', () => {
      render(
        <Multiselect options={sampleOptions} defaultValue={['us', 'ca', 'mx']}>
          <MultiselectTrigger>
            <MultiselectValue placeholder="Select" displayMode="count" />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      );

      expect(screen.getByText('3 selected')).toBeInTheDocument();
    });
  });

  describe('MultiselectOptionItem (Custom)', () => {
    it('renders custom items', async () => {
      const user = userEvent.setup();
      render(
        <Multiselect options={sampleOptions}>
          <MultiselectTrigger data-testid="multiselect-trigger">
            <MultiselectValue placeholder="Select" />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectOptions>
              <MultiselectOptionItem value="custom1">
                Custom Option 1
              </MultiselectOptionItem>
              <MultiselectOptionItem value="custom2">
                Custom Option 2
              </MultiselectOptionItem>
            </MultiselectOptions>
          </MultiselectPopoverContent>
        </Multiselect>
      );

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByText('Custom Option 1')).toBeInTheDocument();
      expect(screen.getByText('Custom Option 2')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes on listbox', async () => {
      const user = userEvent.setup();
      renderMultiselect();

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('options have aria-selected', async () => {
      const user = userEvent.setup();
      renderMultiselect({ defaultValue: ['us'] });

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const selectedOption = screen.getByRole('option', {
        name: /United States/i,
      });
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');

      const unselectedOption = screen.getByRole('option', { name: /Canada/i });
      expect(unselectedOption).toHaveAttribute('aria-selected', 'false');
    });

    it('disabled options have aria-disabled', async () => {
      const user = userEvent.setup();
      renderMultiselect();

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const disabledOption = screen.getByRole('option', { name: /Germany/i });
      expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', async () => {
      const user = userEvent.setup();
      renderMultiselect({ options: [] });

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByText('No options found')).toBeInTheDocument();
      });
    });

    it('handles very long option text', async () => {
      const user = userEvent.setup();
      const longText = 'A'.repeat(200);
      renderMultiselect({
        options: [{ value: 'long', label: longText }],
      });

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByRole('option', { name: longText })).toBeInTheDocument();
    });

    it('handles rapid selection changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      renderMultiselect({ onValueChange: handleChange });

      await user.click(getTrigger());
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Rapidly click multiple options
      await user.click(screen.getByRole('option', { name: /United States/i }));
      await user.click(screen.getByRole('option', { name: /Canada/i }));
      await user.click(screen.getByRole('option', { name: /Mexico/i }));

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleChange).toHaveBeenLastCalledWith(['us', 'ca', 'mx']);
    });
  });

  describe('className Merging', () => {
    it('merges custom className on trigger', () => {
      render(
        <Multiselect options={sampleOptions}>
          <MultiselectTrigger
            data-testid="multiselect-trigger"
            className="custom-trigger-class"
          >
            <MultiselectValue placeholder="Select" />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      );
      expect(getTrigger()).toHaveClass('custom-trigger-class');
    });

    it('preserves default classes when merging', () => {
      render(
        <Multiselect options={sampleOptions}>
          <MultiselectTrigger
            data-testid="multiselect-trigger"
            className="custom-class"
          >
            <MultiselectValue placeholder="Select" />
          </MultiselectTrigger>
          <MultiselectPopoverContent>
            <MultiselectOptions />
          </MultiselectPopoverContent>
        </Multiselect>
      );
      const trigger = getTrigger();
      expect(trigger).toHaveClass('custom-class');
      expect(trigger).toHaveClass('bg-background');
    });
  });
});
