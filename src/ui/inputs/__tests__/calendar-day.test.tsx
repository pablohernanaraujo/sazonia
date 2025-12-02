import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CalendarDay } from '../calendar-day';

describe('CalendarDay', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<CalendarDay day={15} />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toBeInTheDocument();
      expect(cell).toHaveTextContent('15');
    });

    it('renders correct day number', () => {
      render(<CalendarDay day={25} />);
      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('renders day of week text', () => {
      render(<CalendarDay day="Mo" dayType="dayOfWeek" />);
      expect(screen.getByText('Mo')).toBeInTheDocument();
    });

    it('renders as empty cell when type is empty', () => {
      render(<CalendarDay dayType="empty" />);
      const cell = screen.queryByRole('gridcell');
      expect(cell).not.toBeInTheDocument();
      // Empty cells render as div without text
      const container = document.querySelector('.size-\\[34px\\]');
      expect(container).toBeInTheDocument();
      expect(container).toBeEmptyDOMElement();
    });

    it('applies 34x34px fixed size', () => {
      render(<CalendarDay day={15} />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('size-[34px]');
    });
  });

  describe('Day Type Tests', () => {
    it('default type applies correct text color', () => {
      render(<CalendarDay day={15} dayType="default" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('text-text-primary');
    });

    it('today type applies brand text color', () => {
      render(<CalendarDay day={15} dayType="today" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('text-primary');
    });

    it('previousMonth type applies tertiary text color', () => {
      render(<CalendarDay day={28} dayType="previousMonth" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('text-text-tertiary');
    });

    it('nextMonth type applies tertiary text color', () => {
      render(<CalendarDay day={3} dayType="nextMonth" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('text-text-tertiary');
    });

    it('dayOfWeek type applies tertiary text color and medium weight', () => {
      render(<CalendarDay day="Tu" dayType="dayOfWeek" />);
      const header = screen.getByRole('columnheader');
      expect(header).toHaveClass('text-text-tertiary');
      expect(header).toHaveClass('font-medium');
      expect(header).toHaveClass('rounded-full');
    });

    it('isToday prop sets dayType to today', () => {
      render(<CalendarDay day={15} isToday />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('text-primary');
    });
  });

  describe('State Tests', () => {
    it('default state has no background (implicit)', () => {
      render(<CalendarDay day={15} state="default" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('rounded-sm');
      expect(cell).not.toHaveClass('bg-fill-primary');
      expect(cell).not.toHaveClass('bg-background-brand-secondary');
    });

    it('hovered state applies brand secondary background and border', () => {
      render(<CalendarDay day={15} state="hovered" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('bg-background-brand-secondary');
      expect(cell).toHaveClass('border');
      expect(cell).toHaveClass('border-border-brand');
    });

    it('selected state applies primary fill background and white text', () => {
      render(<CalendarDay day={15} state="selected" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('bg-fill-primary');
      expect(cell).toHaveClass('text-text-overlay-white');
    });

    it('disabled state applies secondary text color and cursor', () => {
      render(<CalendarDay day={15} state="disabled" disabled />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('text-text-secondary');
      expect(cell).toHaveClass('cursor-not-allowed');
      expect(cell).toBeDisabled();
    });

    it('multiSelectStart has left-rounded corners with primary fill', () => {
      render(<CalendarDay day={10} state="multiSelectStart" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('rounded-l-sm');
      expect(cell).toHaveClass('rounded-r-none');
      expect(cell).toHaveClass('bg-fill-primary');
      expect(cell).toHaveClass('text-text-overlay-white');
    });

    it('multiSelectCenter has no rounded corners with tertiary brand background', () => {
      render(<CalendarDay day={11} state="multiSelectCenter" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('rounded-none');
      expect(cell).toHaveClass('bg-background-brand-tertiary');
    });

    it('multiSelectEnd has right-rounded corners with primary fill', () => {
      render(<CalendarDay day={12} state="multiSelectEnd" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('rounded-r-sm');
      expect(cell).toHaveClass('rounded-l-none');
      expect(cell).toHaveClass('bg-fill-primary');
      expect(cell).toHaveClass('text-text-overlay-white');
    });
  });

  describe('Compound Variant Tests', () => {
    it('today + hovered applies brand text with hovered background', () => {
      render(<CalendarDay day={15} dayType="today" state="hovered" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('text-primary');
      expect(cell).toHaveClass('bg-background-brand-secondary');
    });

    it('today + selected applies white text with primary fill', () => {
      render(<CalendarDay day={15} dayType="today" state="selected" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('text-text-overlay-white');
      expect(cell).toHaveClass('bg-fill-primary');
    });

    it('today + multiSelectCenter keeps brand text with tertiary background', () => {
      render(<CalendarDay day={15} dayType="today" state="multiSelectCenter" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('text-primary');
      expect(cell).toHaveClass('bg-background-brand-tertiary');
    });

    it('today + disabled applies disabled styling', () => {
      render(<CalendarDay day={15} dayType="today" state="disabled" disabled />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('text-text-secondary');
    });

    it('isToday prop with selected state', () => {
      render(<CalendarDay day={15} isToday state="selected" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('text-text-overlay-white');
      expect(cell).toHaveClass('bg-fill-primary');
    });
  });

  describe('Interaction Tests', () => {
    it('click handler fires for interactive days', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<CalendarDay day={15} onClick={handleClick} />);
      await user.click(screen.getByRole('gridcell'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('click handler does not fire when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<CalendarDay day={15} onClick={handleClick} disabled />);
      await user.click(screen.getByRole('gridcell'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('click handler does not fire for empty cells', () => {
      const handleClick = vi.fn();

      render(<CalendarDay dayType="empty" onClick={handleClick} />);
      const cell = document.querySelector('.size-\\[34px\\]');
      fireEvent.click(cell!);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('click handler does not fire for dayOfWeek cells', () => {
      const handleClick = vi.fn();

      render(<CalendarDay day="Mo" dayType="dayOfWeek" onClick={handleClick} />);
      const header = screen.getByRole('columnheader');
      fireEvent.click(header);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('click handler does not fire when state is disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<CalendarDay day={15} state="disabled" onClick={handleClick} />);
      const cell = screen.getByRole('gridcell');

      // Even clicking won't work because disabled buttons prevent events
      await user.click(cell);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Interaction Tests', () => {
    it('Enter key triggers click', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<CalendarDay day={15} onClick={handleClick} />);
      const cell = screen.getByRole('gridcell');
      cell.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('Space key triggers click', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<CalendarDay day={15} onClick={handleClick} />);
      const cell = screen.getByRole('gridcell');
      cell.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('keyboard does not trigger click when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<CalendarDay day={15} onClick={handleClick} disabled />);
      const cell = screen.getByRole('gridcell');
      cell.focus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Tests', () => {
    it('sets aria-selected="true" when selected', () => {
      render(<CalendarDay day={15} state="selected" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-selected="true" for multiSelectStart', () => {
      render(<CalendarDay day={15} state="multiSelectStart" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-selected="true" for multiSelectCenter', () => {
      render(<CalendarDay day={15} state="multiSelectCenter" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-selected="true" for multiSelectEnd', () => {
      render(<CalendarDay day={15} state="multiSelectEnd" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-disabled="true" when disabled', () => {
      render(<CalendarDay day={15} disabled />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveAttribute('aria-disabled', 'true');
    });

    it('sets aria-current="date" when isToday is true', () => {
      render(<CalendarDay day={15} isToday />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveAttribute('aria-current', 'date');
    });

    it('sets aria-current="date" when dayType is today', () => {
      render(<CalendarDay day={15} dayType="today" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveAttribute('aria-current', 'date');
    });

    it('has role="gridcell" for day cells', () => {
      render(<CalendarDay day={15} />);
      expect(screen.getByRole('gridcell')).toBeInTheDocument();
    });

    it('has role="columnheader" for day of week headers', () => {
      render(<CalendarDay day="Mo" dayType="dayOfWeek" />);
      expect(screen.getByRole('columnheader')).toBeInTheDocument();
    });

    it('empty cells have no role', () => {
      render(<CalendarDay dayType="empty" />);
      expect(screen.queryByRole('gridcell')).not.toBeInTheDocument();
      expect(screen.queryByRole('columnheader')).not.toBeInTheDocument();
    });

    it('disabled cells have tabindex="-1"', () => {
      render(<CalendarDay day={15} disabled />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveAttribute('tabindex', '-1');
    });

    it('active cells are focusable (tabindex="0")', () => {
      render(<CalendarDay day={15} />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveAttribute('tabindex', '0');
    });

    it('accepts custom aria-label', () => {
      render(<CalendarDay day={15} aria-label="Select December 15th" />);
      const cell = screen.getByRole('gridcell', { name: 'Select December 15th' });
      expect(cell).toBeInTheDocument();
    });
  });

  describe('Ref and Props Tests', () => {
    it('forwards ref correctly to button', () => {
      const ref = { current: null };
      render(<CalendarDay ref={ref} day={15} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('forwards ref correctly to div for non-interactive cells', () => {
      const ref = { current: null };
      render(<CalendarDay ref={ref} day="Mo" dayType="dayOfWeek" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('merges custom className', () => {
      render(<CalendarDay day={15} className="custom-class mt-4" />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveClass('custom-class', 'mt-4');
    });

    it('passes through additional props', () => {
      render(<CalendarDay day={15} data-testid="test-day" />);
      expect(screen.getByTestId('test-day')).toBeInTheDocument();
    });

    it('has button type="button" by default', () => {
      render(<CalendarDay day={15} />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toHaveAttribute('type', 'button');
    });
  });

  describe('Edge Cases', () => {
    it('handles day number 0', () => {
      render(<CalendarDay day={0} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles day number 31', () => {
      render(<CalendarDay day={31} />);
      expect(screen.getByText('31')).toBeInTheDocument();
    });

    it('handles missing day prop', () => {
      render(<CalendarDay />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toBeInTheDocument();
      expect(cell).toBeEmptyDOMElement();
    });

    it('handles string day prop', () => {
      render(<CalendarDay day="15" />);
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('conflicting states - disabled prop wins over state', () => {
      render(<CalendarDay day={15} state="selected" disabled />);
      const cell = screen.getByRole('gridcell');
      expect(cell).toBeDisabled();
      expect(cell).toHaveAttribute('aria-disabled', 'true');
    });

    it('handles transition from enabled to disabled', () => {
      const { rerender } = render(<CalendarDay day={15} />);
      const cell = screen.getByRole('gridcell');

      expect(cell).not.toBeDisabled();

      rerender(<CalendarDay day={15} disabled />);
      expect(cell).toBeDisabled();
    });

    it('renders correctly with all props combined', () => {
      const handleClick = vi.fn();
      render(
        <CalendarDay
          day={20}
          dayType="today"
          state="selected"
          isToday
          onClick={handleClick}
          className="extra-class"
          aria-label="Today, December 20th"
        />
      );

      const cell = screen.getByRole('gridcell', { name: 'Today, December 20th' });
      expect(cell).toBeInTheDocument();
      expect(cell).toHaveClass('extra-class');
      expect(cell).toHaveAttribute('aria-current', 'date');
      expect(cell).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Element Type Tests', () => {
    it('renders as button for default day type', () => {
      render(<CalendarDay day={15} />);
      expect(screen.getByRole('gridcell').tagName).toBe('BUTTON');
    });

    it('renders as button for today day type', () => {
      render(<CalendarDay day={15} dayType="today" />);
      expect(screen.getByRole('gridcell').tagName).toBe('BUTTON');
    });

    it('renders as button for previousMonth day type', () => {
      render(<CalendarDay day={28} dayType="previousMonth" />);
      expect(screen.getByRole('gridcell').tagName).toBe('BUTTON');
    });

    it('renders as button for nextMonth day type', () => {
      render(<CalendarDay day={3} dayType="nextMonth" />);
      expect(screen.getByRole('gridcell').tagName).toBe('BUTTON');
    });

    it('renders as div for dayOfWeek type', () => {
      render(<CalendarDay day="Mo" dayType="dayOfWeek" />);
      expect(screen.getByRole('columnheader').tagName).toBe('DIV');
    });

    it('renders as div for empty type', () => {
      render(<CalendarDay dayType="empty" />);
      const cell = document.querySelector('.size-\\[34px\\]');
      expect(cell?.tagName).toBe('DIV');
    });
  });
});
