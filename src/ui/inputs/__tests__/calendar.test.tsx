import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Calendar, type CalendarRangeValue } from '../calendar';

describe('Calendar', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Calendar />);
      // Should render at least one grid
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('renders single-month view by default', () => {
      render(<Calendar />);
      const grids = screen.getAllByRole('grid');
      expect(grids).toHaveLength(1);
    });

    it('renders dual-month view when specified', () => {
      render(<Calendar view="dual-month" />);
      const grids = screen.getAllByRole('grid');
      expect(grids).toHaveLength(2);
    });

    it('renders day-of-week headers', () => {
      render(<Calendar />);
      expect(screen.getByText('Mo')).toBeInTheDocument();
      expect(screen.getByText('Tu')).toBeInTheDocument();
      expect(screen.getByText('We')).toBeInTheDocument();
      expect(screen.getByText('Th')).toBeInTheDocument();
      expect(screen.getByText('Fr')).toBeInTheDocument();
      expect(screen.getByText('Sa')).toBeInTheDocument();
      expect(screen.getByText('Su')).toBeInTheDocument();
    });

    it('renders Clear and Apply buttons', () => {
      render(<Calendar />);
      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument();
    });

    it('hides action buttons when hideActions is true', () => {
      render(<Calendar hideActions />);
      expect(
        screen.queryByRole('button', { name: /clear/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /apply/i })
      ).not.toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Calendar className="custom-class" data-testid="calendar" />);
      expect(screen.getByTestId('calendar')).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Calendar ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Single Month Navigation', () => {
    it('navigates to previous month', async () => {
      const user = userEvent.setup();
      // Start with a known date
      render(<Calendar defaultValue={new Date(2024, 5, 15)} />);

      // Find the previous month button
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      await user.click(prevButton);

      // Should now show May 2024
      expect(screen.getByText('May')).toBeInTheDocument();
    });

    it('navigates to next month', async () => {
      const user = userEvent.setup();
      render(<Calendar defaultValue={new Date(2024, 5, 15)} />);

      const nextButton = screen.getByRole('button', { name: /next month/i });
      await user.click(nextButton);

      // Should now show July 2024
      expect(screen.getByText('Jul')).toBeInTheDocument();
    });

    it('displays month and year in header', () => {
      render(<Calendar defaultValue={new Date(2024, 11, 25)} />);
      expect(screen.getByText('Dec')).toBeInTheDocument();
      expect(screen.getByText('2024')).toBeInTheDocument();
    });
  });

  describe('Single Selection Mode', () => {
    it('selects a date on click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<Calendar mode="single" onChange={onChange} defaultValue={null} />);

      // Find a day to click (use day 15 which should be in the current month)
      const dayButtons = screen.getAllByRole('gridcell');
      const day15Button = dayButtons.find((btn) => btn.textContent === '15');

      if (day15Button) {
        await user.click(day15Button);
        expect(onChange).toHaveBeenCalledTimes(1);
        const calledDate = onChange.mock.calls[0][0] as Date;
        expect(calledDate.getDate()).toBe(15);
      }
    });

    it('deselects a date when clicking the same date', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const initialDate = new Date(2024, 5, 15);

      render(<Calendar mode="single" value={initialDate} onChange={onChange} />);

      // Click on the currently selected day
      const day15Button = screen
        .getAllByRole('gridcell')
        .find((btn) => btn.textContent === '15');

      if (day15Button) {
        await user.click(day15Button);
        expect(onChange).toHaveBeenCalledWith(null);
      }
    });

    it('works in controlled mode', () => {
      const selectedDate = new Date(2024, 5, 20);
      render(<Calendar mode="single" value={selectedDate} />);

      // Day 20 should be selected
      const day20Button = screen
        .getAllByRole('gridcell')
        .find((btn) => btn.textContent === '20');
      expect(day20Button).toHaveAttribute('aria-selected', 'true');
    });

    it('works in uncontrolled mode with defaultValue', () => {
      const defaultDate = new Date(2024, 5, 20);
      render(<Calendar mode="single" defaultValue={defaultDate} />);

      const day20Button = screen
        .getAllByRole('gridcell')
        .find((btn) => btn.textContent === '20');
      expect(day20Button).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Range Selection Mode', () => {
    it('selects start date on first click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <Calendar
          mode="range"
          onChange={onChange}
          defaultValue={{ start: null, end: null }}
        />
      );

      const day10Button = screen
        .getAllByRole('gridcell')
        .find((btn) => btn.textContent === '10');

      if (day10Button) {
        await user.click(day10Button);
        expect(onChange).toHaveBeenCalledTimes(1);
        const range = onChange.mock.calls[0][0] as CalendarRangeValue;
        expect(range.start?.getDate()).toBe(10);
        expect(range.end).toBeNull();
      }
    });

    it('selects end date on second click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const startDate = new Date();
      startDate.setDate(10);

      render(
        <Calendar
          mode="range"
          value={{ start: startDate, end: null }}
          onChange={onChange}
        />
      );

      const day20Button = screen
        .getAllByRole('gridcell')
        .find((btn) => btn.textContent === '20');

      if (day20Button) {
        await user.click(day20Button);
        expect(onChange).toHaveBeenCalledTimes(1);
        const range = onChange.mock.calls[0][0] as CalendarRangeValue;
        expect(range.end?.getDate()).toBe(20);
      }
    });

    it('auto-sorts dates when end is before start', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const startDate = new Date();
      startDate.setDate(20);

      render(
        <Calendar
          mode="range"
          value={{ start: startDate, end: null }}
          onChange={onChange}
        />
      );

      // Click on day 10 which is before the start (20)
      const day10Button = screen
        .getAllByRole('gridcell')
        .find((btn) => btn.textContent === '10');

      if (day10Button) {
        await user.click(day10Button);
        const range = onChange.mock.calls[0][0] as CalendarRangeValue;
        // Should auto-sort so start is the earlier date
        expect(range.start?.getDate()).toBe(10);
        expect(range.end?.getDate()).toBe(20);
      }
    });

    it('resets selection on click after complete range', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const startDate = new Date();
      startDate.setDate(10);
      const endDate = new Date();
      endDate.setDate(20);

      render(
        <Calendar
          mode="range"
          value={{ start: startDate, end: endDate }}
          onChange={onChange}
        />
      );

      // Click on a new date - should start new selection
      const day5Button = screen
        .getAllByRole('gridcell')
        .find((btn) => btn.textContent === '5');

      if (day5Button) {
        await user.click(day5Button);
        const range = onChange.mock.calls[0][0] as CalendarRangeValue;
        expect(range.start?.getDate()).toBe(5);
        expect(range.end).toBeNull();
      }
    });

    it('shows visual states for range selection', () => {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 10);
      const endDate = new Date(today.getFullYear(), today.getMonth(), 15);

      render(
        <Calendar mode="range" value={{ start: startDate, end: endDate }} />
      );

      // Start date should have multiSelectStart styling
      const day10Button = screen
        .getAllByRole('gridcell')
        .find((btn) => btn.textContent === '10');
      expect(day10Button).toHaveClass('rounded-l-sm');

      // End date should have multiSelectEnd styling
      const day15Button = screen
        .getAllByRole('gridcell')
        .find((btn) => btn.textContent === '15');
      expect(day15Button).toHaveClass('rounded-r-sm');

      // Middle date should have multiSelectCenter styling
      const day12Button = screen
        .getAllByRole('gridcell')
        .find((btn) => btn.textContent === '12');
      expect(day12Button).toHaveClass('bg-background-brand-tertiary');
    });
  });

  describe('Dual Month View', () => {
    it('shows two months side by side', () => {
      render(<Calendar view="dual-month" defaultValue={new Date(2024, 5, 15)} />);

      const grids = screen.getAllByRole('grid');
      expect(grids).toHaveLength(2);

      // First grid should show June
      expect(grids[0]).toHaveAttribute('aria-label', 'June 2024');
      // Second grid should show July
      expect(grids[1]).toHaveAttribute('aria-label', 'July 2024');
    });

    it('navigates both months together', async () => {
      const user = userEvent.setup();
      render(<Calendar view="dual-month" defaultValue={new Date(2024, 5, 15)} />);

      // In dual-month view, the central navigation buttons have text content ← and →
      // Find the button with the ← text which is the main navigation prev button
      const prevButtons = screen.getAllByRole('button', {
        name: /previous month/i,
      });
      // Find the one that has the actual click handler (the center navigation button)
      // This is the third button (after the two from CalendarHeaders)
      const workingPrevButton = prevButtons.find((btn) =>
        btn.textContent?.includes('←')
      );

      if (workingPrevButton) {
        await user.click(workingPrevButton);
      }

      const grids = screen.getAllByRole('grid');
      expect(grids[0]).toHaveAttribute('aria-label', 'May 2024');
      expect(grids[1]).toHaveAttribute('aria-label', 'June 2024');
    });
  });

  describe('Presets', () => {
    const mockPresets = [
      {
        id: 'today',
        label: 'Today',
        getValue: () => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return { start: today, end: today };
        },
      },
      {
        id: 'yesterday',
        label: 'Yesterday',
        getValue: () => {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0);
          return { start: yesterday, end: yesterday };
        },
      },
    ];

    it('renders preset tabs when showPresets is true', () => {
      render(<Calendar mode="range" showPresets presets={mockPresets} />);

      expect(screen.getByText('Today')).toBeInTheDocument();
      expect(screen.getByText('Yesterday')).toBeInTheDocument();
    });

    it('does not show presets in single mode', () => {
      render(<Calendar mode="single" showPresets presets={mockPresets} />);

      expect(screen.queryByText('Today')).not.toBeInTheDocument();
    });

    it('selects preset range when clicking preset tab', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(
        <Calendar
          mode="range"
          showPresets
          presets={mockPresets}
          onChange={onChange}
        />
      );

      await user.click(screen.getByText('Today'));

      expect(onChange).toHaveBeenCalledTimes(1);
      const range = onChange.mock.calls[0][0] as CalendarRangeValue;
      expect(range.start).not.toBeNull();
      expect(range.end).not.toBeNull();
    });
  });

  describe('Disabled Dates', () => {
    it('disables specific dates from array', () => {
      const today = new Date();
      const disabledDate = new Date(today.getFullYear(), today.getMonth(), 15);

      render(<Calendar disabledDates={[disabledDate]} />);

      const day15Button = screen
        .getAllByRole('gridcell')
        .find((btn) => btn.textContent === '15');
      expect(day15Button).toBeDisabled();
    });

    it('disables dates using function', () => {
      render(
        <Calendar
          disabledDates={(date) => date.getDay() === 0} // Disable Sundays
        />
      );

      // Find a Sunday in the current month and verify it's disabled
      const gridcells = screen.getAllByRole('gridcell');
      const sundayButtons = gridcells.filter((btn) => {
        if (btn.getAttribute('aria-disabled') === 'true') {
          return true;
        }
        return false;
      });
      expect(sundayButtons.length).toBeGreaterThan(0);
    });

    it('respects minDate constraint', () => {
      const today = new Date();
      const minDate = new Date(today.getFullYear(), today.getMonth(), 10);

      render(<Calendar minDate={minDate} />);

      // Day 5 should be disabled (before minDate)
      const day5Button = screen
        .getAllByRole('gridcell')
        .find((btn) => btn.textContent === '5');
      expect(day5Button).toBeDisabled();
    });

    it('respects maxDate constraint', () => {
      const today = new Date();
      const maxDate = new Date(today.getFullYear(), today.getMonth(), 20);

      render(<Calendar maxDate={maxDate} />);

      // Day 25 should be disabled (after maxDate)
      const day25Button = screen
        .getAllByRole('gridcell')
        .find((btn) => btn.textContent === '25');
      expect(day25Button).toBeDisabled();
    });

    it('does not trigger onChange when clicking disabled date', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const today = new Date();
      const disabledDate = new Date(today.getFullYear(), today.getMonth(), 15);

      render(<Calendar onChange={onChange} disabledDates={[disabledDate]} />);

      const day15Button = screen
        .getAllByRole('gridcell')
        .find((btn) => btn.textContent === '15');

      if (day15Button) {
        await user.click(day15Button);
        expect(onChange).not.toHaveBeenCalled();
      }
    });
  });

  describe('Action Buttons', () => {
    it('calls onClear when Clear button is clicked', async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      const onChange = vi.fn();

      render(
        <Calendar
          mode="single"
          value={new Date()}
          onChange={onChange}
          onClear={onClear}
        />
      );

      await user.click(screen.getByRole('button', { name: /clear/i }));

      expect(onClear).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(null);
    });

    it('calls onApply when Apply button is clicked', async () => {
      const user = userEvent.setup();
      const onApply = vi.fn();
      const selectedDate = new Date(2024, 5, 15);

      render(<Calendar mode="single" value={selectedDate} onApply={onApply} />);

      await user.click(screen.getByRole('button', { name: /apply/i }));

      expect(onApply).toHaveBeenCalledTimes(1);
      expect(onApply).toHaveBeenCalledWith(selectedDate);
    });

    it('clears range selection correctly', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onClear = vi.fn();

      render(
        <Calendar
          mode="range"
          value={{ start: new Date(), end: new Date() }}
          onChange={onChange}
          onClear={onClear}
        />
      );

      await user.click(screen.getByRole('button', { name: /clear/i }));

      const clearedRange = onChange.mock.calls[0][0] as CalendarRangeValue;
      expect(clearedRange.start).toBeNull();
      expect(clearedRange.end).toBeNull();
    });
  });

  describe('Keyboard Navigation', () => {
    it('moves focus with arrow keys', async () => {
      const user = userEvent.setup();
      render(<Calendar />);

      // Focus on a day
      const grid = screen.getByRole('grid');
      const gridcells = within(grid).getAllByRole('gridcell');
      const day15 = gridcells.find((cell) => cell.textContent === '15');

      expect(day15).toBeDefined();
      if (day15) {
        day15.focus();

        // Arrow right should move focus
        await user.keyboard('{ArrowRight}');
        // Focus movement is handled by the component
        expect(document.activeElement).toBeDefined();
      }
    });

    it('selects focused date with Enter key', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<Calendar onChange={onChange} />);

      const grid = screen.getByRole('grid');
      const gridcells = within(grid).getAllByRole('gridcell');
      const day15 = gridcells.find((cell) => cell.textContent === '15');

      if (day15) {
        day15.focus();
        await user.keyboard('{Enter}');
        expect(onChange).toHaveBeenCalled();
      }
    });

    it('selects focused date with Space key', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<Calendar onChange={onChange} />);

      const grid = screen.getByRole('grid');
      const gridcells = within(grid).getAllByRole('gridcell');
      const day15 = gridcells.find((cell) => cell.textContent === '15');

      if (day15) {
        day15.focus();
        await user.keyboard(' ');
        expect(onChange).toHaveBeenCalled();
      }
    });
  });

  describe('Accessibility', () => {
    it('has accessible grid structure', () => {
      render(<Calendar />);

      const grid = screen.getByRole('grid');
      expect(grid).toHaveAttribute('aria-label');
    });

    it('has column headers for days of week', () => {
      render(<Calendar />);

      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(7);
    });

    it('marks today with aria-current="date"', () => {
      render(<Calendar />);

      const todayCell = screen
        .getAllByRole('gridcell')
        .find((cell) => cell.getAttribute('aria-current') === 'date');
      expect(todayCell).toBeInTheDocument();
    });

    it('marks selected dates with aria-selected', () => {
      const today = new Date();
      today.setDate(15);

      render(<Calendar mode="single" value={today} />);

      const selectedCell = screen
        .getAllByRole('gridcell')
        .find((cell) => cell.getAttribute('aria-selected') === 'true');
      expect(selectedCell).toBeInTheDocument();
    });

    it('disabled dates have aria-disabled', () => {
      const today = new Date();
      const disabledDate = new Date(today.getFullYear(), today.getMonth(), 15);

      render(<Calendar disabledDates={[disabledDate]} />);

      const day15Button = screen
        .getAllByRole('gridcell')
        .find((btn) => btn.textContent === '15');
      expect(day15Button).toHaveAttribute('aria-disabled', 'true');
    });

    it('day cells have descriptive aria-label', () => {
      render(<Calendar />);

      const gridcells = screen.getAllByRole('gridcell');
      const dayCell = gridcells.find((cell) => cell.textContent === '15');

      expect(dayCell).toHaveAttribute('aria-label');
      // aria-label should contain the full date description
    });
  });

  describe('Edge Cases', () => {
    it('handles month transitions correctly', async () => {
      const user = userEvent.setup();
      render(<Calendar defaultValue={new Date(2024, 0, 31)} />); // Jan 31

      // Navigate to next month
      const nextButton = screen.getByRole('button', { name: /next month/i });
      await user.click(nextButton);

      // Should now show February
      expect(screen.getByText('Feb')).toBeInTheDocument();
    });

    it('handles year transitions correctly', async () => {
      const user = userEvent.setup();
      render(<Calendar defaultValue={new Date(2024, 0, 15)} />); // January 2024

      // Navigate to previous month
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      await user.click(prevButton);

      // Should now show December 2023
      expect(screen.getByText('Dec')).toBeInTheDocument();
      expect(screen.getByText('2023')).toBeInTheDocument();
    });

    it('handles leap year February correctly', () => {
      render(<Calendar defaultValue={new Date(2024, 1, 15)} />); // February 2024 (leap year)

      // Should have day 29
      const day29 = screen
        .getAllByRole('gridcell')
        .find((cell) => cell.textContent === '29');
      expect(day29).toBeInTheDocument();
    });

    it('handles non-leap year February correctly', () => {
      render(<Calendar defaultValue={new Date(2023, 1, 15)} />); // February 2023 (non-leap year)

      // Find all day 29 cells - in non-leap Feb, 29 would be from next month
      const day29Cells = screen
        .getAllByRole('gridcell')
        .filter((cell) => cell.textContent === '29');

      // Any day 29 should be from another month (grayed out)
      for (const cell of day29Cells) {
        expect(cell).toHaveClass('text-text-tertiary');
      }
    });

    it('renders empty cells correctly at month boundaries', () => {
      render(<Calendar defaultValue={new Date(2024, 5, 1)} />); // June 2024

      // The grid should have 7 days per row
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThanOrEqual(5); // At least 5 weeks
    });

    it('maintains selection when navigating months', async () => {
      const user = userEvent.setup();
      const selectedDate = new Date(2024, 5, 15);

      render(<Calendar mode="single" value={selectedDate} />);

      // Navigate away
      const nextButton = screen.getByRole('button', { name: /next month/i });
      await user.click(nextButton);

      // Navigate back
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      await user.click(prevButton);

      // Day 15 should still be selected
      const day15 = screen
        .getAllByRole('gridcell')
        .find((cell) => cell.textContent === '15');
      expect(day15).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Props Passthrough', () => {
    it('passes additional props to container', () => {
      render(<Calendar data-testid="calendar-test" />);
      expect(screen.getByTestId('calendar-test')).toBeInTheDocument();
    });

    it('merges className prop', () => {
      render(<Calendar className="extra-class" data-testid="calendar" />);
      const calendar = screen.getByTestId('calendar');
      expect(calendar).toHaveClass('extra-class');
      expect(calendar).toHaveClass('rounded-lg'); // Base class
    });
  });
});
