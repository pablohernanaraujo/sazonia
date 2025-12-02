import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SelectItem } from '../select';
import { SelectFloatingLabel } from '../select-floating-label';

const TestOptions = () => (
  <>
    <SelectItem value="us">United States</SelectItem>
    <SelectItem value="ca">Canada</SelectItem>
    <SelectItem value="mx">Mexico</SelectItem>
  </>
);

describe('SelectFloatingLabel', () => {
  describe('Rendering', () => {
    it('renders with label', () => {
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );
      expect(screen.getByText('Country')).toBeInTheDocument();
    });

    it('renders as combobox element', () => {
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders required indicator when required', () => {
      render(
        <SelectFloatingLabel label="Country" required>
          <TestOptions />
        </SelectFloatingLabel>
      );
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('required')).toHaveClass('sr-only');
    });

    it('does not render required indicator when not required', () => {
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('renders left add-on', () => {
      render(
        <SelectFloatingLabel
          label="Country"
          leftAddOn={<span data-testid="left-addon">🌍</span>}
        >
          <TestOptions />
        </SelectFloatingLabel>
      );
      expect(screen.getByTestId('left-addon')).toBeInTheDocument();
    });

    it('renders chevron icon', () => {
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );
      // CaretDown icon should be present
      const trigger = screen.getByRole('combobox');
      expect(trigger.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Floating label behavior', () => {
    it('label starts in placeholder position when empty', () => {
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );
      const label = screen.getByText('Country');
      expect(label).toHaveClass('top-1/2', '-translate-y-1/2', 'scale-100');
    });

    it('label floats when value is selected', () => {
      render(
        <SelectFloatingLabel label="Country" defaultValue="us">
          <TestOptions />
        </SelectFloatingLabel>
      );
      const label = screen.getByText('Country');
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('label floats when dropdown opens', async () => {
      const user = userEvent.setup();
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      const label = screen.getByText('Country');
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('label returns to placeholder position when dropdown closes and no value', async () => {
      const user = userEvent.setup();
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      // Close by pressing Escape
      await user.keyboard('{Escape}');

      await waitFor(() => {
        const label = screen.getByText('Country');
        expect(label).toHaveClass('top-1/2', '-translate-y-1/2', 'scale-100');
      });
    });

    it('label stays floated after selecting a value and closing', async () => {
      const user = userEvent.setup();
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      // Select an option
      const option = screen.getByRole('option', { name: 'United States' });
      await user.click(option);

      await waitFor(() => {
        const label = screen.getByText('Country');
        expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
      });
    });

    it('label has background notch effect when floating', () => {
      render(
        <SelectFloatingLabel label="Country" defaultValue="us">
          <TestOptions />
        </SelectFloatingLabel>
      );
      const label = screen.getByText('Country');
      expect(label).toHaveClass('bg-background', 'px-1');
    });
  });

  describe('Error state', () => {
    it('applies error styles when error is true', () => {
      const { container } = render(
        <SelectFloatingLabel label="Country" error>
          <TestOptions />
        </SelectFloatingLabel>
      );
      const wrapper = container.querySelector('.relative');
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('label has error color when error is true', () => {
      render(
        <SelectFloatingLabel label="Country" error>
          <TestOptions />
        </SelectFloatingLabel>
      );
      const label = screen.getByText('Country');
      expect(label).toHaveClass('text-destructive');
    });

    it('label has error color even when floating and open', async () => {
      const user = userEvent.setup();
      render(
        <SelectFloatingLabel label="Country" error>
          <TestOptions />
        </SelectFloatingLabel>
      );

      await user.click(screen.getByRole('combobox'));

      const label = screen.getByText('Country');
      expect(label).toHaveClass('text-destructive');
    });

    it('sets aria-invalid when error is true', () => {
      render(
        <SelectFloatingLabel label="Country" error>
          <TestOptions />
        </SelectFloatingLabel>
      );
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('does not set aria-invalid when error is false', () => {
      render(
        <SelectFloatingLabel label="Country" error={false}>
          <TestOptions />
        </SelectFloatingLabel>
      );
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('Disabled state', () => {
    it('applies disabled attribute when disabled', () => {
      render(
        <SelectFloatingLabel label="Country" disabled>
          <TestOptions />
        </SelectFloatingLabel>
      );
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('wrapper has disabled background', () => {
      const { container } = render(
        <SelectFloatingLabel label="Country" disabled>
          <TestOptions />
        </SelectFloatingLabel>
      );
      const wrapper = container.querySelector('.relative');
      expect(wrapper).toHaveClass('bg-background-secondary');
    });

    it('label has disabled color', () => {
      render(
        <SelectFloatingLabel label="Country" disabled>
          <TestOptions />
        </SelectFloatingLabel>
      );
      const label = screen.getByText('Country');
      expect(label).toHaveClass('text-text-tertiary');
    });
  });

  describe('Add-ons', () => {
    it('renders left add-on', () => {
      render(
        <SelectFloatingLabel
          label="Country"
          leftAddOn={<span data-testid="left">🌍</span>}
        >
          <TestOptions />
        </SelectFloatingLabel>
      );
      expect(screen.getByTestId('left')).toBeInTheDocument();
    });

    it('label adjusts position when left add-on is present', () => {
      render(
        <SelectFloatingLabel label="Country" leftAddOn={<span>🌍</span>}>
          <TestOptions />
        </SelectFloatingLabel>
      );
      const label = screen.getByText('Country');
      expect(label).toHaveClass('left-10');
    });

    it('add-ons have correct styling', () => {
      render(
        <SelectFloatingLabel
          label="Country"
          leftAddOn={<span data-testid="left">🌍</span>}
        >
          <TestOptions />
        </SelectFloatingLabel>
      );
      const addOnWrapper = screen.getByTestId('left').parentElement;
      expect(addOnWrapper).toHaveClass('text-text-tertiary', 'flex-shrink-0');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to trigger element', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <SelectFloatingLabel label="Country" ref={ref}>
          <TestOptions />
        </SelectFloatingLabel>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <SelectFloatingLabel label="Country" ref={ref}>
          <TestOptions />
        </SelectFloatingLabel>
      );
      ref.current?.focus();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });
  });

  describe('Event handling', () => {
    it('calls onValueChange when selection changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SelectFloatingLabel label="Country" onValueChange={handleChange}>
          <TestOptions />
        </SelectFloatingLabel>
      );

      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'Canada' }));

      expect(handleChange).toHaveBeenCalledWith('ca');
    });

    it('calls onOpenChange when dropdown opens', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();
      render(
        <SelectFloatingLabel label="Country" onOpenChange={handleOpenChange}>
          <TestOptions />
        </SelectFloatingLabel>
      );

      await user.click(screen.getByRole('combobox'));
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    it('calls onOpenChange when dropdown closes', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();
      render(
        <SelectFloatingLabel label="Country" onOpenChange={handleOpenChange}>
          <TestOptions />
        </SelectFloatingLabel>
      );

      await user.click(screen.getByRole('combobox'));
      await user.keyboard('{Escape}');

      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Controlled and uncontrolled modes', () => {
    it('works as uncontrolled with defaultValue', async () => {
      const user = userEvent.setup();
      render(
        <SelectFloatingLabel label="Country" defaultValue="us">
          <TestOptions />
        </SelectFloatingLabel>
      );

      expect(screen.getByRole('combobox')).toHaveTextContent('United States');

      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'Canada' }));

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveTextContent('Canada');
      });
    });

    it('works as controlled with value and onValueChange', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { rerender } = render(
        <SelectFloatingLabel
          label="Country"
          value="us"
          onValueChange={handleChange}
        >
          <TestOptions />
        </SelectFloatingLabel>
      );

      expect(screen.getByRole('combobox')).toHaveTextContent('United States');

      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'Canada' }));

      expect(handleChange).toHaveBeenCalledWith('ca');

      // Value doesn't change without rerender in controlled mode
      rerender(
        <SelectFloatingLabel
          label="Country"
          value="mx"
          onValueChange={handleChange}
        >
          <TestOptions />
        </SelectFloatingLabel>
      );

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveTextContent('Mexico');
      });
    });
  });

  describe('Keyboard navigation', () => {
    it('opens dropdown with Enter key', async () => {
      const user = userEvent.setup();
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );

      const trigger = screen.getByRole('combobox');
      trigger.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('opens dropdown with Space key', async () => {
      const user = userEvent.setup();
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );

      const trigger = screen.getByRole('combobox');
      trigger.focus();
      await user.keyboard(' ');

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('closes dropdown with Escape key', async () => {
      const user = userEvent.setup();
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );

      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('navigates options with arrow keys', async () => {
      const user = userEvent.setup();
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );

      await user.click(screen.getByRole('combobox'));
      await user.keyboard('{ArrowDown}');

      // Options should be visible and navigation should work
      const options = screen.getAllByRole('option');
      expect(options.length).toBe(3);
    });
  });

  describe('className merging', () => {
    it('merges custom className on trigger', () => {
      render(
        <SelectFloatingLabel label="Country" className="custom-class">
          <TestOptions />
        </SelectFloatingLabel>
      );
      expect(screen.getByRole('combobox')).toHaveClass('custom-class');
    });

    it('merges wrapperClassName on wrapper', () => {
      const { container } = render(
        <SelectFloatingLabel label="Country" wrapperClassName="wrapper-class">
          <TestOptions />
        </SelectFloatingLabel>
      );
      const wrapper = container.querySelector('.relative');
      expect(wrapper).toHaveClass('wrapper-class');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );

      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      // Radix Select uses aria-autocomplete="none" instead of aria-haspopup="listbox"
      expect(trigger).toHaveAttribute('aria-autocomplete', 'none');
    });

    it('aria-expanded updates when dropdown opens', async () => {
      const user = userEvent.setup();
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );

      const trigger = screen.getByRole('combobox');
      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('sets aria-required when required', () => {
      render(
        <SelectFloatingLabel label="Country" required>
          <TestOptions />
        </SelectFloatingLabel>
      );
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });

    it('required indicator has aria-hidden', () => {
      render(
        <SelectFloatingLabel label="Country" required>
          <TestOptions />
        </SelectFloatingLabel>
      );
      const asterisk = screen.getByText('*');
      expect(asterisk).toHaveAttribute('aria-hidden', 'true');
    });

    it('required has screen reader text', () => {
      render(
        <SelectFloatingLabel label="Country" required>
          <TestOptions />
        </SelectFloatingLabel>
      );
      const srText = screen.getByText('required');
      expect(srText).toHaveClass('sr-only');
    });
  });

  describe('Label color states', () => {
    it('has tertiary color when not floating, not error', () => {
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );
      const label = screen.getByText('Country');
      expect(label).toHaveClass('text-text-tertiary');
    });

    it('has primary color when floating and open (not error)', async () => {
      const user = userEvent.setup();
      render(
        <SelectFloatingLabel label="Country">
          <TestOptions />
        </SelectFloatingLabel>
      );

      await user.click(screen.getByRole('combobox'));

      const label = screen.getByText('Country');
      expect(label).toHaveClass('text-primary');
    });

    it('has tertiary color when floating but not open (not error)', () => {
      render(
        <SelectFloatingLabel label="Country" defaultValue="us">
          <TestOptions />
        </SelectFloatingLabel>
      );
      const label = screen.getByText('Country');
      expect(label).toHaveClass('text-text-tertiary');
    });

    it('has destructive color when error (regardless of other state)', () => {
      render(
        <SelectFloatingLabel label="Country" error>
          <TestOptions />
        </SelectFloatingLabel>
      );
      const label = screen.getByText('Country');
      expect(label).toHaveClass('text-destructive');
    });
  });

  describe('Edge cases', () => {
    it('handles very long label', () => {
      const longLabel = 'A'.repeat(100);
      render(
        <SelectFloatingLabel label={longLabel}>
          <TestOptions />
        </SelectFloatingLabel>
      );
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles disabled with error', () => {
      const { container } = render(
        <SelectFloatingLabel label="Country" disabled error>
          <TestOptions />
        </SelectFloatingLabel>
      );
      const wrapper = container.querySelector('.relative');
      const trigger = screen.getByRole('combobox');

      expect(trigger).toBeDisabled();
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('handles disabled with value', () => {
      render(
        <SelectFloatingLabel label="Country" disabled defaultValue="us">
          <TestOptions />
        </SelectFloatingLabel>
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveTextContent('United States');

      // Label should be floating since there's a value
      const label = screen.getByText('Country');
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('handles complex add-on content', () => {
      render(
        <SelectFloatingLabel
          label="Country"
          leftAddOn={
            <div data-testid="complex-addon">
              <span>Icon</span>
              <span>Text</span>
            </div>
          }
        >
          <TestOptions />
        </SelectFloatingLabel>
      );
      expect(screen.getByTestId('complex-addon')).toBeInTheDocument();
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('handles empty options', async () => {
      const user = userEvent.setup();
      render(
        <SelectFloatingLabel label="Country">{/* Empty */}</SelectFloatingLabel>
      );

      await user.click(screen.getByRole('combobox'));
      // Should open without error
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('handles many options', async () => {
      const user = userEvent.setup();
      const manyOptions = Array.from({ length: 50 }, (_, i) => (
        <SelectItem key={i} value={`option-${i}`}>
          Option {i + 1}
        </SelectItem>
      ));

      render(
        <SelectFloatingLabel label="Country">{manyOptions}</SelectFloatingLabel>
      );

      await user.click(screen.getByRole('combobox'));

      // Should render all options
      expect(screen.getAllByRole('option')).toHaveLength(50);
    });
  });
});
