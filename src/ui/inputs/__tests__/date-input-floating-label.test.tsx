import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DateInputFloatingLabel } from '../date-input-floating-label';

describe('DateInputFloatingLabel', () => {
  describe('Rendering', () => {
    it('renders with label', () => {
      render(<DateInputFloatingLabel label="Date" />);
      expect(screen.getByLabelText('Date')).toBeInTheDocument();
    });

    it('renders as input element with combobox role', () => {
      render(<DateInputFloatingLabel label="Date" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.tagName).toBe('INPUT');
      expect(input).toHaveAttribute('role', 'combobox');
    });

    it('renders calendar icon button', () => {
      render(<DateInputFloatingLabel label="Date" />);
      expect(
        screen.getByRole('button', { name: 'Choose date from calendar' })
      ).toBeInTheDocument();
    });

    it('renders with value', () => {
      render(
        <DateInputFloatingLabel
          label="Date"
          defaultValue={new Date(2024, 2, 15)}
        />
      );
      expect(screen.getByDisplayValue('03/15/2024')).toBeInTheDocument();
    });

    it('renders required indicator when required', () => {
      render(<DateInputFloatingLabel label="Date" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('required')).toHaveClass('sr-only');
    });

    it('does not render required indicator when not required', () => {
      render(<DateInputFloatingLabel label="Date" />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('Floating label behavior', () => {
    it('label starts in placeholder position when empty', () => {
      render(<DateInputFloatingLabel label="Date" />);
      const label = screen.getByText('Date');
      expect(label).toHaveClass('top-1/2', '-translate-y-1/2', 'scale-100');
    });

    it('label floats when input has value', () => {
      render(
        <DateInputFloatingLabel
          label="Date"
          defaultValue={new Date(2024, 2, 15)}
        />
      );
      const label = screen.getByText('Date');
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('label floats on focus', async () => {
      const user = userEvent.setup();
      render(<DateInputFloatingLabel label="Date" data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);

      const label = screen.getByText('Date');
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('label returns to placeholder position on blur if empty', async () => {
      const user = userEvent.setup();
      render(<DateInputFloatingLabel label="Date" data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      // Press Escape to close calendar, then tab to blur
      await user.keyboard('{Escape}');
      await user.tab();

      const label = screen.getByText('Date');
      expect(label).toHaveClass('top-1/2', '-translate-y-1/2', 'scale-100');
    });

    it('label stays floated on blur if has value', async () => {
      const user = userEvent.setup();
      render(<DateInputFloatingLabel label="Date" data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.type(input, '03/15/2024');
      await user.keyboard('{Escape}');
      await user.tab();

      const label = screen.getByText('Date');
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('label has background notch effect when floating', () => {
      render(
        <DateInputFloatingLabel
          label="Date"
          defaultValue={new Date(2024, 2, 15)}
        />
      );
      const label = screen.getByText('Date');
      expect(label).toHaveClass('bg-background', 'px-1');
    });
  });

  describe('Placeholder behavior', () => {
    it('does not show placeholder when label is not floating', () => {
      render(
        <DateInputFloatingLabel
          label="Date"
          placeholder="MM/DD/YYYY"
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).not.toHaveAttribute('placeholder', 'MM/DD/YYYY');
    });

    it('shows placeholder when focused (label is floating)', async () => {
      const user = userEvent.setup();
      render(
        <DateInputFloatingLabel
          label="Date"
          placeholder="MM/DD/YYYY"
          data-testid="input"
        />
      );

      const input = screen.getByTestId('input');
      await user.click(input);

      expect(input).toHaveAttribute('placeholder', 'MM/DD/YYYY');
    });

    it('shows placeholder when has value (label is floating)', () => {
      render(
        <DateInputFloatingLabel
          label="Date"
          placeholder="MM/DD/YYYY"
          defaultValue={new Date(2024, 2, 15)}
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('placeholder', 'MM/DD/YYYY');
    });
  });

  describe('Error state', () => {
    it('applies error styles when error is true', () => {
      const { container } = render(<DateInputFloatingLabel label="Date" error />);
      const wrapper = container.querySelector('.relative > div');
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('label has error color when error is true', () => {
      render(<DateInputFloatingLabel label="Date" error />);
      const label = screen.getByText('Date');
      expect(label).toHaveClass('text-destructive');
    });

    it('label has error color even when floating and focused', async () => {
      const user = userEvent.setup();
      render(<DateInputFloatingLabel label="Date" error data-testid="input" />);

      await user.click(screen.getByTestId('input'));

      const label = screen.getByText('Date');
      expect(label).toHaveClass('text-destructive');
    });

    it('sets aria-invalid when error is true', () => {
      render(<DateInputFloatingLabel label="Date" error data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid when error is false', () => {
      render(
        <DateInputFloatingLabel label="Date" error={false} data-testid="input" />
      );
      expect(screen.getByTestId('input')).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('Disabled state', () => {
    it('applies disabled attribute when disabled', () => {
      render(
        <DateInputFloatingLabel label="Date" disabled data-testid="input" />
      );
      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('wrapper has disabled background', () => {
      const { container } = render(
        <DateInputFloatingLabel label="Date" disabled />
      );
      const wrapper = container.querySelector('.relative > div');
      expect(wrapper).toHaveClass('bg-background-secondary');
    });

    it('label has disabled color', () => {
      render(<DateInputFloatingLabel label="Date" disabled />);
      const label = screen.getByText('Date');
      expect(label).toHaveClass('text-text-tertiary');
    });

    it('calendar icon button is disabled', () => {
      render(<DateInputFloatingLabel label="Date" disabled />);
      expect(
        screen.getByRole('button', { name: 'Choose date from calendar' })
      ).toBeDisabled();
    });

    it('does not open calendar when disabled', async () => {
      const user = userEvent.setup();
      render(
        <DateInputFloatingLabel label="Date" disabled data-testid="input" />
      );

      await user.click(screen.getByTestId('input'));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Add-ons', () => {
    it('renders left add-on', () => {
      render(
        <DateInputFloatingLabel
          label="Date"
          leftAddOn={<span data-testid="left">Icon</span>}
        />
      );
      expect(screen.getByTestId('left')).toBeInTheDocument();
      expect(screen.getByText('Icon')).toBeInTheDocument();
    });

    it('label adjusts position when left add-on is present', () => {
      render(
        <DateInputFloatingLabel label="Date" leftAddOn={<span>Icon</span>} />
      );
      const label = screen.getByText('Date');
      expect(label).toHaveClass('left-10');
    });

    it('add-on has correct styling', () => {
      render(
        <DateInputFloatingLabel label="Date" leftAddOn={<span>Icon</span>} />
      );
      const addOnWrapper = screen.getByText('Icon').parentElement;
      expect(addOnWrapper).toHaveClass('text-text-tertiary', 'shrink-0');
    });
  });

  describe('Calendar popover', () => {
    it('opens calendar on input focus', async () => {
      const user = userEvent.setup();
      render(<DateInputFloatingLabel label="Date" data-testid="input" />);

      await user.click(screen.getByTestId('input'));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('opens calendar on icon click', async () => {
      const user = userEvent.setup();
      render(<DateInputFloatingLabel label="Date" />);

      await user.click(
        screen.getByRole('button', { name: 'Choose date from calendar' })
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('closes calendar on Escape key', async () => {
      const user = userEvent.setup();
      render(<DateInputFloatingLabel label="Date" data-testid="input" />);

      await user.click(screen.getByTestId('input'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes calendar on click outside', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <DateInputFloatingLabel label="Date" data-testid="input" />
          <button data-testid="outside">Outside</button>
        </div>
      );

      await user.click(screen.getByTestId('input'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByTestId('outside'));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('calendar has proper ARIA attributes', async () => {
      const user = userEvent.setup();
      render(<DateInputFloatingLabel label="Date" data-testid="input" />);

      await user.click(screen.getByTestId('input'));

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Choose date');
      expect(dialog).toHaveAttribute('aria-modal', 'false');
    });

    it('updates aria-expanded on input based on calendar state', async () => {
      const user = userEvent.setup();
      render(<DateInputFloatingLabel label="Date" data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-expanded', 'false');

      await user.click(input);
      expect(input).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Escape}');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Date selection', () => {
    it('updates input value when date is typed', async () => {
      const user = userEvent.setup();
      render(<DateInputFloatingLabel label="Date" data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.type(input, '03/15/2024');

      expect(input).toHaveValue('03/15/2024');
    });

    it('calls onChange when valid date is typed', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <DateInputFloatingLabel
          label="Date"
          onChange={handleChange}
          data-testid="input"
        />
      );

      const input = screen.getByTestId('input');
      await user.type(input, '03/15/2024');

      expect(handleChange).toHaveBeenCalledWith(expect.any(Date));
      expect(handleChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          getFullYear: expect.any(Function),
        })
      );
    });

    it('does not call onChange for invalid date format', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <DateInputFloatingLabel
          label="Date"
          onChange={handleChange}
          data-testid="input"
        />
      );

      const input = screen.getByTestId('input');
      await user.type(input, 'invalid');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('formats date on blur', async () => {
      const user = userEvent.setup();
      render(<DateInputFloatingLabel label="Date" data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.type(input, '3/5/2024');
      await user.keyboard('{Escape}');
      await user.tab();

      expect(input).toHaveValue('03/05/2024');
    });
  });

  describe('Controlled mode', () => {
    it('uses controlled value', () => {
      render(
        <DateInputFloatingLabel
          label="Date"
          value={new Date(2024, 2, 15)}
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toHaveValue('03/15/2024');
    });

    it('updates when controlled value changes', () => {
      const { rerender } = render(
        <DateInputFloatingLabel
          label="Date"
          value={new Date(2024, 2, 15)}
          data-testid="input"
        />
      );

      expect(screen.getByTestId('input')).toHaveValue('03/15/2024');

      rerender(
        <DateInputFloatingLabel
          label="Date"
          value={new Date(2024, 5, 20)}
          data-testid="input"
        />
      );

      expect(screen.getByTestId('input')).toHaveValue('06/20/2024');
    });

    it('handles null controlled value', () => {
      render(
        <DateInputFloatingLabel label="Date" value={null} data-testid="input" />
      );
      expect(screen.getByTestId('input')).toHaveValue('');
    });

    it('controlled open state works', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();
      render(
        <DateInputFloatingLabel
          label="Date"
          open={true}
          onOpenChange={handleOpenChange}
          data-testid="input"
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Focus the input first, then press Escape
      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{Escape}');
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Uncontrolled mode', () => {
    it('uses defaultValue', () => {
      render(
        <DateInputFloatingLabel
          label="Date"
          defaultValue={new Date(2024, 2, 15)}
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toHaveValue('03/15/2024');
    });

    it('allows typing to change value', async () => {
      const user = userEvent.setup();
      render(
        <DateInputFloatingLabel
          label="Date"
          defaultValue={new Date(2024, 2, 15)}
          data-testid="input"
        />
      );

      const input = screen.getByTestId('input');
      await user.clear(input);
      await user.type(input, '06/20/2024');

      expect(input).toHaveValue('06/20/2024');
    });
  });

  describe('Date constraints', () => {
    it('respects minDate constraint', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const minDate = new Date(2024, 2, 15);
      render(
        <DateInputFloatingLabel
          label="Date"
          minDate={minDate}
          onChange={handleChange}
          data-testid="input"
        />
      );

      const input = screen.getByTestId('input');
      await user.type(input, '03/01/2024'); // Before minDate

      // Should not trigger onChange for date before minDate
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('respects maxDate constraint', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const maxDate = new Date(2024, 2, 15);
      render(
        <DateInputFloatingLabel
          label="Date"
          maxDate={maxDate}
          onChange={handleChange}
          data-testid="input"
        />
      );

      const input = screen.getByTestId('input');
      await user.type(input, '03/31/2024'); // After maxDate

      // Should not trigger onChange for date after maxDate
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<DateInputFloatingLabel label="Date" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLInputElement>();
      render(
        <DateInputFloatingLabel label="Date" ref={ref} data-testid="input" />
      );
      ref.current?.focus();
      expect(screen.getByTestId('input')).toHaveFocus();
    });
  });

  describe('Event handling', () => {
    it('calls onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(
        <DateInputFloatingLabel
          label="Date"
          onFocus={handleFocus}
          data-testid="input"
        />
      );

      await user.click(screen.getByTestId('input'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(
        <DateInputFloatingLabel
          label="Date"
          onBlur={handleBlur}
          data-testid="input"
        />
      );

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{Escape}');
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('calls onKeyDown on key press', async () => {
      const user = userEvent.setup();
      const handleKeyDown = vi.fn();
      render(
        <DateInputFloatingLabel
          label="Date"
          onKeyDown={handleKeyDown}
          data-testid="input"
        />
      );

      await user.click(screen.getByTestId('input'));
      await user.keyboard('{Enter}');
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('input has combobox role', () => {
      render(<DateInputFloatingLabel label="Date" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('role', 'combobox');
    });

    it('input has aria-haspopup dialog', () => {
      render(<DateInputFloatingLabel label="Date" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-haspopup',
        'dialog'
      );
    });

    it('input has aria-controls pointing to calendar', async () => {
      const user = userEvent.setup();
      render(
        <DateInputFloatingLabel label="Date" id="test" data-testid="input" />
      );

      await user.click(screen.getByTestId('input'));

      const input = screen.getByTestId('input');
      const dialog = screen.getByRole('dialog');
      expect(input).toHaveAttribute('aria-controls', dialog.id);
    });

    it('calendar icon button has aria-label', () => {
      render(<DateInputFloatingLabel label="Date" />);
      expect(
        screen.getByRole('button', { name: 'Choose date from calendar' })
      ).toBeInTheDocument();
    });

    it('calendar icon button has tabIndex -1', () => {
      render(<DateInputFloatingLabel label="Date" />);
      expect(
        screen.getByRole('button', { name: 'Choose date from calendar' })
      ).toHaveAttribute('tabindex', '-1');
    });

    it('accepts aria-describedby', () => {
      render(
        <DateInputFloatingLabel
          label="Date"
          aria-describedby="help-text"
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-describedby',
        'help-text'
      );
    });

    it('sets aria-required when required', () => {
      render(
        <DateInputFloatingLabel label="Date" required data-testid="input" />
      );
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });

    it('required indicator has aria-hidden', () => {
      render(<DateInputFloatingLabel label="Date" required />);
      const asterisk = screen.getByText('*');
      expect(asterisk).toHaveAttribute('aria-hidden', 'true');
    });

    it('required has screen reader text', () => {
      render(<DateInputFloatingLabel label="Date" required />);
      const srText = screen.getByText('required');
      expect(srText).toHaveClass('sr-only');
    });
  });

  describe('Label color states', () => {
    it('has tertiary color when not floating, not error', () => {
      render(<DateInputFloatingLabel label="Date" />);
      const label = screen.getByText('Date');
      expect(label).toHaveClass('text-text-tertiary');
    });

    it('has primary color when floating and focused (not error)', async () => {
      const user = userEvent.setup();
      render(<DateInputFloatingLabel label="Date" data-testid="input" />);

      await user.click(screen.getByTestId('input'));

      const label = screen.getByText('Date');
      expect(label).toHaveClass('text-primary');
    });

    it('has tertiary color when floating but not focused (not error)', () => {
      render(
        <DateInputFloatingLabel
          label="Date"
          defaultValue={new Date(2024, 2, 15)}
        />
      );
      const label = screen.getByText('Date');
      expect(label).toHaveClass('text-text-tertiary');
    });

    it('has destructive color when error (regardless of other state)', () => {
      render(<DateInputFloatingLabel label="Date" error />);
      const label = screen.getByText('Date');
      expect(label).toHaveClass('text-destructive');
    });
  });

  describe('className merging', () => {
    it('merges custom className on input', () => {
      render(
        <DateInputFloatingLabel
          label="Date"
          className="custom-class"
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toHaveClass('custom-class');
    });

    it('merges wrapperClassName on wrapper', () => {
      const { container } = render(
        <DateInputFloatingLabel label="Date" wrapperClassName="wrapper-class" />
      );
      const wrapper = container.querySelector('.relative > div');
      expect(wrapper).toHaveClass('wrapper-class');
    });

    it('preserves default classes when merging', () => {
      render(
        <DateInputFloatingLabel
          label="Date"
          className="custom-class"
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('custom-class');
      expect(input).toHaveClass('bg-transparent');
    });
  });

  describe('Label-input association', () => {
    it('label is associated with input via htmlFor/id', () => {
      render(<DateInputFloatingLabel label="Date" />);
      const input = screen.getByLabelText('Date');
      expect(input).toBeInTheDocument();
    });

    it('uses provided id', () => {
      render(
        <DateInputFloatingLabel label="Date" id="custom-id" data-testid="input" />
      );
      expect(screen.getByTestId('input')).toHaveAttribute('id', 'custom-id');
    });

    it('generates unique id when not provided', () => {
      render(<DateInputFloatingLabel label="Date" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.id).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('handles empty string value', () => {
      render(
        <DateInputFloatingLabel label="Date" value={null} data-testid="input" />
      );
      expect(screen.getByTestId('input')).toHaveValue('');
    });

    it('handles invalid date formats gracefully', async () => {
      const user = userEvent.setup();
      render(<DateInputFloatingLabel label="Date" data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.type(input, '13/45/2024'); // Invalid date

      // Should still allow typing but not parse to date
      expect(input).toHaveValue('13/45/2024');
    });

    it('handles leap year dates', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <DateInputFloatingLabel
          label="Date"
          onChange={handleChange}
          data-testid="input"
        />
      );

      const input = screen.getByTestId('input');
      await user.type(input, '02/29/2024'); // 2024 is a leap year

      expect(handleChange).toHaveBeenCalled();
    });

    it('handles invalid leap year date', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <DateInputFloatingLabel
          label="Date"
          onChange={handleChange}
          data-testid="input"
        />
      );

      const input = screen.getByTestId('input');
      await user.type(input, '02/29/2023'); // 2023 is not a leap year

      // Should not trigger onChange for invalid date
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('handles disabled with error', () => {
      const { container } = render(
        <DateInputFloatingLabel label="Date" disabled error data-testid="input" />
      );
      const wrapper = container.querySelector('.relative > div');
      const input = screen.getByTestId('input');

      expect(input).toBeDisabled();
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('handles disabled with value', () => {
      render(
        <DateInputFloatingLabel
          label="Date"
          disabled
          defaultValue={new Date(2024, 2, 15)}
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toBeDisabled();
      expect(input).toHaveValue('03/15/2024');

      // Label should be floating since there's a value
      const label = screen.getByText('Date');
      expect(label).toHaveClass('top-0', '-translate-y-1/2', 'scale-75');
    });

    it('passes through additional HTML attributes', () => {
      render(
        <DateInputFloatingLabel
          label="Date"
          data-testid="input"
          name="date"
          autoComplete="bday"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('name', 'date');
      expect(input).toHaveAttribute('autocomplete', 'bday');
    });
  });
});
