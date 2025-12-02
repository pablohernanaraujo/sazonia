import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CalendarHeader } from '../calendar-header';

describe('CalendarHeader', () => {
  describe('Rendering - Left Alignment', () => {
    it('renders with default (left) alignment', () => {
      render(<CalendarHeader month="Mar" year={2025} />);

      expect(screen.getByText('Mar')).toBeInTheDocument();
      expect(screen.getByText('2025')).toBeInTheDocument();
    });

    it('renders month selector with correct text', () => {
      render(<CalendarHeader month="December" year={2025} />);

      expect(screen.getByText('December')).toBeInTheDocument();
    });

    it('renders year selector with correct text', () => {
      render(<CalendarHeader month="Jan" year={2024} />);

      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('renders navigation buttons', () => {
      render(<CalendarHeader month="Mar" year={2025} />);

      expect(
        screen.getByRole('button', { name: 'Previous month' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Next month' })
      ).toBeInTheDocument();
    });

    it('renders month and year selectors with correct aria-labels', () => {
      render(<CalendarHeader month="Mar" year={2025} />);

      expect(
        screen.getByRole('button', { name: 'Select month' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Select year' })
      ).toBeInTheDocument();
    });
  });

  describe('Rendering - Center Alignment', () => {
    it('renders with center alignment', () => {
      render(<CalendarHeader align="center" monthYearCombined="June 2022" />);

      expect(screen.getByText('June 2022')).toBeInTheDocument();
    });

    it('renders combined month-year selector with correct aria-label', () => {
      render(<CalendarHeader align="center" monthYearCombined="June 2022" />);

      expect(
        screen.getByRole('button', { name: 'Select month and year' })
      ).toBeInTheDocument();
    });

    it('renders navigation buttons in center alignment', () => {
      render(<CalendarHeader align="center" monthYearCombined="June 2022" />);

      expect(
        screen.getByRole('button', { name: 'Previous month' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Next month' })
      ).toBeInTheDocument();
    });

    it('applies center-specific layout classes', () => {
      const { container } = render(
        <CalendarHeader align="center" monthYearCombined="June 2022" />
      );

      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass('relative');
      expect(header).toHaveClass('h-8');
      expect(header).toHaveClass('justify-center');
    });

    it('applies absolute positioning to navigation buttons', () => {
      render(<CalendarHeader align="center" monthYearCombined="June 2022" />);

      const prevButton = screen.getByRole('button', { name: 'Previous month' });
      const nextButton = screen.getByRole('button', { name: 'Next month' });

      expect(prevButton).toHaveClass('absolute', 'left-0');
      expect(nextButton).toHaveClass('absolute', 'right-0');
    });

    it('applies fixed width to combined selector', () => {
      render(<CalendarHeader align="center" monthYearCombined="June 2022" />);

      const selector = screen.getByRole('button', {
        name: 'Select month and year',
      });
      expect(selector).toHaveClass('w-[140px]');
    });
  });

  describe('Interaction Tests', () => {
    it('calls onPreviousClick when previous button is clicked', async () => {
      const handlePreviousClick = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarHeader
          month="Mar"
          year={2025}
          onPreviousClick={handlePreviousClick}
        />
      );

      await user.click(screen.getByRole('button', { name: 'Previous month' }));

      expect(handlePreviousClick).toHaveBeenCalledTimes(1);
    });

    it('calls onNextClick when next button is clicked', async () => {
      const handleNextClick = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarHeader month="Mar" year={2025} onNextClick={handleNextClick} />
      );

      await user.click(screen.getByRole('button', { name: 'Next month' }));

      expect(handleNextClick).toHaveBeenCalledTimes(1);
    });

    it('calls onMonthClick when month selector is clicked', async () => {
      const handleMonthClick = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarHeader month="Mar" year={2025} onMonthClick={handleMonthClick} />
      );

      await user.click(screen.getByRole('button', { name: 'Select month' }));

      expect(handleMonthClick).toHaveBeenCalledTimes(1);
    });

    it('calls onYearClick when year selector is clicked', async () => {
      const handleYearClick = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarHeader month="Mar" year={2025} onYearClick={handleYearClick} />
      );

      await user.click(screen.getByRole('button', { name: 'Select year' }));

      expect(handleYearClick).toHaveBeenCalledTimes(1);
    });

    it('calls onMonthClick for combined selector in center alignment', async () => {
      const handleMonthClick = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarHeader
          align="center"
          monthYearCombined="June 2022"
          onMonthClick={handleMonthClick}
        />
      );

      await user.click(
        screen.getByRole('button', { name: 'Select month and year' })
      );

      expect(handleMonthClick).toHaveBeenCalledTimes(1);
    });

    it('handles missing callbacks without throwing', async () => {
      const user = userEvent.setup();

      render(<CalendarHeader month="Mar" year={2025} />);

      // Should not throw when clicking without callbacks
      await expect(
        user.click(screen.getByRole('button', { name: 'Previous month' }))
      ).resolves.not.toThrow();

      await expect(
        user.click(screen.getByRole('button', { name: 'Next month' }))
      ).resolves.not.toThrow();

      await expect(
        user.click(screen.getByRole('button', { name: 'Select month' }))
      ).resolves.not.toThrow();

      await expect(
        user.click(screen.getByRole('button', { name: 'Select year' }))
      ).resolves.not.toThrow();
    });
  });

  describe('Keyboard Interaction Tests', () => {
    it('Enter key triggers navigation button click', async () => {
      const handlePreviousClick = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarHeader
          month="Mar"
          year={2025}
          onPreviousClick={handlePreviousClick}
        />
      );

      const prevButton = screen.getByRole('button', { name: 'Previous month' });
      prevButton.focus();
      await user.keyboard('{Enter}');

      expect(handlePreviousClick).toHaveBeenCalledTimes(1);
    });

    it('Space key triggers selector button click', async () => {
      const handleMonthClick = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarHeader month="Mar" year={2025} onMonthClick={handleMonthClick} />
      );

      const monthSelector = screen.getByRole('button', { name: 'Select month' });
      monthSelector.focus();
      await user.keyboard(' ');

      expect(handleMonthClick).toHaveBeenCalledTimes(1);
    });

    it('Tab key navigates through all interactive elements in left alignment', async () => {
      const user = userEvent.setup();

      render(<CalendarHeader month="Mar" year={2025} />);

      // Start with first element
      await user.tab();
      expect(screen.getByRole('button', { name: 'Select month' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Select year' })).toHaveFocus();

      await user.tab();
      expect(
        screen.getByRole('button', { name: 'Previous month' })
      ).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Next month' })).toHaveFocus();
    });

    it('Tab key navigates through all interactive elements in center alignment', async () => {
      const user = userEvent.setup();

      render(<CalendarHeader align="center" monthYearCombined="June 2022" />);

      // Start with first element
      await user.tab();
      expect(
        screen.getByRole('button', { name: 'Previous month' })
      ).toHaveFocus();

      await user.tab();
      expect(
        screen.getByRole('button', { name: 'Select month and year' })
      ).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Next month' })).toHaveFocus();
    });
  });

  describe('Accessibility Tests', () => {
    it('all buttons have accessible names', () => {
      render(<CalendarHeader month="Mar" year={2025} />);

      const buttons = screen.getAllByRole('button');
      for (const button of buttons) {
        expect(button).toHaveAccessibleName();
      }
    });

    it('buttons are keyboard focusable', () => {
      render(<CalendarHeader month="Mar" year={2025} />);

      const buttons = screen.getAllByRole('button');
      for (const button of buttons) {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      }
    });

    it('buttons have type="button" to prevent form submission', () => {
      render(<CalendarHeader month="Mar" year={2025} />);

      const monthSelector = screen.getByRole('button', { name: 'Select month' });
      const yearSelector = screen.getByRole('button', { name: 'Select year' });

      expect(monthSelector).toHaveAttribute('type', 'button');
      expect(yearSelector).toHaveAttribute('type', 'button');
    });
  });

  describe('Styling Tests', () => {
    it('applies custom className', () => {
      const { container } = render(
        <CalendarHeader month="Mar" year={2025} className="custom-class mt-4" />
      );

      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass('custom-class', 'mt-4');
    });

    it('applies flexbox styles for left alignment', () => {
      const { container } = render(<CalendarHeader month="Mar" year={2025} />);

      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass('flex', 'items-center', 'justify-between');
    });

    it('selectors have hover state styles', () => {
      render(<CalendarHeader month="Mar" year={2025} />);

      const monthSelector = screen.getByRole('button', { name: 'Select month' });
      expect(monthSelector).toHaveClass('hover:bg-background-brand-secondary');
    });

    it('selectors have focus visible ring styles', () => {
      render(<CalendarHeader month="Mar" year={2025} />);

      const monthSelector = screen.getByRole('button', { name: 'Select month' });
      expect(monthSelector).toHaveClass('focus-visible:ring-2');
      expect(monthSelector).toHaveClass('focus-visible:ring-primary');
    });

    it('selectors have correct typography', () => {
      render(<CalendarHeader month="Mar" year={2025} />);

      const monthSelector = screen.getByRole('button', { name: 'Select month' });
      expect(monthSelector).toHaveClass('text-sm', 'font-semibold', 'leading-5');
    });

    it('selectors have correct text color', () => {
      render(<CalendarHeader month="Mar" year={2025} />);

      const monthSelector = screen.getByRole('button', { name: 'Select month' });
      expect(monthSelector).toHaveClass('text-text-primary');
    });
  });

  describe('Ref and Props Tests', () => {
    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<CalendarHeader ref={ref} month="Mar" year={2025} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('passes through additional props', () => {
      render(
        <CalendarHeader month="Mar" year={2025} data-testid="calendar-header" />
      );

      expect(screen.getByTestId('calendar-header')).toBeInTheDocument();
    });

    it('passes through aria props', () => {
      render(
        <CalendarHeader
          month="Mar"
          year={2025}
          aria-label="Calendar navigation"
        />
      );

      expect(
        screen.getByRole('generic', { name: 'Calendar navigation' })
      ).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long month names', () => {
      render(<CalendarHeader month="September" year={2025} />);

      expect(screen.getByText('September')).toBeInTheDocument();
    });

    it('handles four-digit years', () => {
      render(<CalendarHeader month="Jan" year={2025} />);

      expect(screen.getByText('2025')).toBeInTheDocument();
    });

    it('handles year 0', () => {
      render(<CalendarHeader month="Jan" year={0} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles empty month string', () => {
      render(<CalendarHeader month="" year={2025} />);

      const monthSelector = screen.getByRole('button', { name: 'Select month' });
      // Button should exist but not have month text visible
      expect(monthSelector).toBeInTheDocument();
    });

    it('handles empty monthYearCombined string', () => {
      render(<CalendarHeader align="center" monthYearCombined="" />);

      const selector = screen.getByRole('button', {
        name: 'Select month and year',
      });
      expect(selector).toBeInTheDocument();
    });

    it('handles very long monthYearCombined string', () => {
      render(
        <CalendarHeader align="center" monthYearCombined="September 2025" />
      );

      expect(screen.getByText('September 2025')).toBeInTheDocument();
    });

    it('handles rapid clicking on navigation', async () => {
      const handlePreviousClick = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarHeader
          month="Mar"
          year={2025}
          onPreviousClick={handlePreviousClick}
        />
      );

      const prevButton = screen.getByRole('button', { name: 'Previous month' });

      // Rapid clicks
      await user.click(prevButton);
      await user.click(prevButton);
      await user.click(prevButton);

      expect(handlePreviousClick).toHaveBeenCalledTimes(3);
    });

    it('renders correctly with all props', () => {
      const handlePreviousClick = vi.fn();
      const handleNextClick = vi.fn();
      const handleMonthClick = vi.fn();
      const handleYearClick = vi.fn();

      render(
        <CalendarHeader
          month="March"
          year={2025}
          onPreviousClick={handlePreviousClick}
          onNextClick={handleNextClick}
          onMonthClick={handleMonthClick}
          onYearClick={handleYearClick}
          className="custom-header"
          data-testid="full-header"
        />
      );

      expect(screen.getByTestId('full-header')).toBeInTheDocument();
      expect(screen.getByTestId('full-header')).toHaveClass('custom-header');
      expect(screen.getByText('March')).toBeInTheDocument();
      expect(screen.getByText('2025')).toBeInTheDocument();
    });
  });

  describe('Icon Rendering Tests', () => {
    it('renders dropdown chevron icons in selectors', () => {
      render(<CalendarHeader month="Mar" year={2025} />);

      // Check that CaretDown icons are rendered (they have aria-hidden)
      const hiddenIcons = document.querySelectorAll('[aria-hidden="true"]');
      // Should have 2 dropdown icons for month and year selectors
      expect(hiddenIcons.length).toBeGreaterThanOrEqual(2);
    });

    it('renders dropdown chevron in center-aligned selector', () => {
      render(<CalendarHeader align="center" monthYearCombined="June 2022" />);

      const hiddenIcons = document.querySelectorAll('[aria-hidden="true"]');
      // Should have at least 1 dropdown icon for combined selector
      expect(hiddenIcons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Element Type Tests', () => {
    it('renders as div container', () => {
      const { container } = render(<CalendarHeader month="Mar" year={2025} />);

      expect(container.firstChild?.nodeName).toBe('DIV');
    });

    it('selectors render as button elements', () => {
      render(<CalendarHeader month="Mar" year={2025} />);

      const monthSelector = screen.getByRole('button', { name: 'Select month' });
      const yearSelector = screen.getByRole('button', { name: 'Select year' });

      expect(monthSelector.tagName).toBe('BUTTON');
      expect(yearSelector.tagName).toBe('BUTTON');
    });
  });

  describe('Alignment Switching', () => {
    it('re-renders correctly when alignment changes', () => {
      const { rerender } = render(<CalendarHeader month="Mar" year={2025} />);

      // Initially left-aligned
      expect(screen.getByText('Mar')).toBeInTheDocument();
      expect(screen.getByText('2025')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Select month' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Select year' })
      ).toBeInTheDocument();

      // Switch to center-aligned
      rerender(<CalendarHeader align="center" monthYearCombined="June 2022" />);

      expect(screen.getByText('June 2022')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Select month and year' })
      ).toBeInTheDocument();
      // Month and year selectors should no longer exist
      expect(
        screen.queryByRole('button', { name: 'Select month' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Select year' })
      ).not.toBeInTheDocument();
    });
  });
});
