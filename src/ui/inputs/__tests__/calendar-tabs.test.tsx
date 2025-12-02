import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { type CalendarTabItem, CalendarTabs } from '../calendar-tabs';

const defaultItems: CalendarTabItem[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last-week', label: 'Last week' },
  { value: 'last-month', label: 'Last month' },
  { value: 'last-year', label: 'Last year' },
  { value: 'all-time', label: 'All time' },
];

const mixedDisabledItems: CalendarTabItem[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday', disabled: true },
  { value: 'last-week', label: 'Last week' },
  { value: 'last-month', label: 'Last month', disabled: true },
  { value: 'last-year', label: 'Last year' },
];

describe('CalendarTabs', () => {
  describe('Rendering', () => {
    it('renders container with role="tablist"', () => {
      render(<CalendarTabs items={defaultItems} aria-label="Date presets" />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('renders CalendarTab for each item in items array', () => {
      render(<CalendarTabs items={defaultItems} aria-label="Date presets" />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(defaultItems.length);
    });

    it('renders correct labels from items configuration', () => {
      render(<CalendarTabs items={defaultItems} aria-label="Date presets" />);
      for (const item of defaultItems) {
        expect(screen.getByText(item.label)).toBeInTheDocument();
      }
    });

    it('applies className to container', () => {
      render(
        <CalendarTabs
          items={defaultItems}
          className="custom-class"
          aria-label="Date presets"
        />
      );
      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('custom-class');
    });

    it('forwards ref to container element', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <CalendarTabs ref={ref} items={defaultItems} aria-label="Date presets" />
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('role', 'tablist');
    });

    it('applies flex-col layout by default (vertical)', () => {
      render(<CalendarTabs items={defaultItems} aria-label="Date presets" />);
      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('flex-col');
      expect(tablist).toHaveClass('gap-1');
    });

    it('renders empty tablist when items array is empty', () => {
      render(<CalendarTabs items={[]} aria-label="Empty presets" />);
      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });

    it('renders single item correctly', () => {
      render(
        <CalendarTabs
          items={[{ value: 'only', label: 'Only' }]}
          aria-label="Single preset"
        />
      );
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(1);
      expect(screen.getByText('Only')).toBeInTheDocument();
    });
  });

  describe('Selection State - Controlled Mode', () => {
    it('controlled mode: value prop sets active tab', () => {
      render(
        <CalendarTabs
          items={defaultItems}
          value="yesterday"
          aria-label="Date presets"
        />
      );
      const yesterdayTab = screen.getByText('Yesterday');
      expect(yesterdayTab).toHaveAttribute('aria-selected', 'true');
      expect(yesterdayTab).toHaveClass('bg-background');
    });

    it('controlled mode: non-selected tabs are inactive', () => {
      render(
        <CalendarTabs
          items={defaultItems}
          value="yesterday"
          aria-label="Date presets"
        />
      );
      const todayTab = screen.getByText('Today');
      expect(todayTab).toHaveAttribute('aria-selected', 'false');
      expect(todayTab).not.toHaveClass('bg-background');
    });

    it('controlled mode: clicking tab triggers onValueChange with correct value', async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarTabs
          items={defaultItems}
          value="today"
          onValueChange={handleValueChange}
          aria-label="Date presets"
        />
      );

      await user.click(screen.getByText('Last week'));
      expect(handleValueChange).toHaveBeenCalledWith('last-week');
    });

    it('controlled mode: value that does not match any item shows no selection', () => {
      render(
        <CalendarTabs
          items={defaultItems}
          value="nonexistent"
          aria-label="Date presets"
        />
      );
      const tabs = screen.getAllByRole('tab');
      for (const tab of tabs) {
        expect(tab).toHaveAttribute('aria-selected', 'false');
      }
    });
  });

  describe('Selection State - Uncontrolled Mode', () => {
    it('uncontrolled mode: defaultValue sets initial active tab', () => {
      render(
        <CalendarTabs
          items={defaultItems}
          defaultValue="last-month"
          aria-label="Date presets"
        />
      );
      const lastMonthTab = screen.getByText('Last month');
      expect(lastMonthTab).toHaveAttribute('aria-selected', 'true');
    });

    it('uncontrolled mode: clicking tab updates selection', async () => {
      const user = userEvent.setup();

      render(
        <CalendarTabs
          items={defaultItems}
          defaultValue="today"
          aria-label="Date presets"
        />
      );

      const lastYearTab = screen.getByText('Last year');
      expect(lastYearTab).toHaveAttribute('aria-selected', 'false');

      await user.click(lastYearTab);
      expect(lastYearTab).toHaveAttribute('aria-selected', 'true');
    });

    it('uncontrolled mode: still calls onValueChange callback', async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarTabs
          items={defaultItems}
          defaultValue="today"
          onValueChange={handleValueChange}
          aria-label="Date presets"
        />
      );

      await user.click(screen.getByText('All time'));
      expect(handleValueChange).toHaveBeenCalledWith('all-time');
    });

    it('uncontrolled mode: no defaultValue means no initial selection', () => {
      render(<CalendarTabs items={defaultItems} aria-label="Date presets" />);
      const tabs = screen.getAllByRole('tab');
      for (const tab of tabs) {
        expect(tab).toHaveAttribute('aria-selected', 'false');
      }
    });
  });

  describe('Disabled State', () => {
    it('global disabled prop disables all tabs', () => {
      render(
        <CalendarTabs items={defaultItems} disabled aria-label="Date presets" />
      );
      const tabs = screen.getAllByRole('tab');
      for (const tab of tabs) {
        expect(tab).toBeDisabled();
      }
    });

    it('item-level disabled disables specific tabs', () => {
      render(
        <CalendarTabs items={mixedDisabledItems} aria-label="Date presets" />
      );

      expect(screen.getByText('Today')).not.toBeDisabled();
      expect(screen.getByText('Yesterday')).toBeDisabled();
      expect(screen.getByText('Last week')).not.toBeDisabled();
      expect(screen.getByText('Last month')).toBeDisabled();
      expect(screen.getByText('Last year')).not.toBeDisabled();
    });

    it('disabled tabs do not trigger onValueChange', async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarTabs
          items={mixedDisabledItems}
          onValueChange={handleValueChange}
          aria-label="Date presets"
        />
      );

      await user.click(screen.getByText('Yesterday'));
      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it('combination: global disabled + item disabled', () => {
      render(
        <CalendarTabs
          items={mixedDisabledItems}
          disabled
          aria-label="Date presets"
        />
      );
      const tabs = screen.getAllByRole('tab');
      for (const tab of tabs) {
        expect(tab).toBeDisabled();
      }
    });

    it('all items disabled means no selection possible', async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();
      const allDisabledItems: CalendarTabItem[] = [
        { value: 'a', label: 'A', disabled: true },
        { value: 'b', label: 'B', disabled: true },
      ];

      render(
        <CalendarTabs
          items={allDisabledItems}
          onValueChange={handleValueChange}
          aria-label="Date presets"
        />
      );

      await user.click(screen.getByText('A'));
      await user.click(screen.getByText('B'));
      expect(handleValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation - Roving TabIndex', () => {
    it('only focused tab has tabIndex={0}', () => {
      render(<CalendarTabs items={defaultItems} aria-label="Date presets" />);
      const tabs = screen.getAllByRole('tab');

      // First enabled tab should have tabIndex=0
      expect(tabs[0]).toHaveAttribute('tabindex', '0');

      // All others should have tabIndex=-1
      for (let i = 1; i < tabs.length; i++) {
        expect(tabs[i]).toHaveAttribute('tabindex', '-1');
      }
    });

    it('ArrowDown moves focus to next enabled tab', async () => {
      const user = userEvent.setup();

      render(<CalendarTabs items={defaultItems} aria-label="Date presets" />);
      const tabs = screen.getAllByRole('tab');

      tabs[0].focus();
      expect(tabs[0]).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(tabs[1]).toHaveFocus();
    });

    it('ArrowUp moves focus to previous enabled tab', async () => {
      const user = userEvent.setup();

      render(
        <CalendarTabs
          items={defaultItems}
          defaultValue="yesterday"
          aria-label="Date presets"
        />
      );
      const tabs = screen.getAllByRole('tab');

      tabs[1].focus();
      await user.keyboard('{ArrowUp}');
      expect(tabs[0]).toHaveFocus();
    });

    it('Home moves focus to first enabled tab', async () => {
      const user = userEvent.setup();

      render(<CalendarTabs items={defaultItems} aria-label="Date presets" />);
      const tabs = screen.getAllByRole('tab');

      tabs[3].focus();
      await user.keyboard('{Home}');
      expect(tabs[0]).toHaveFocus();
    });

    it('End moves focus to last enabled tab', async () => {
      const user = userEvent.setup();

      render(<CalendarTabs items={defaultItems} aria-label="Date presets" />);
      const tabs = screen.getAllByRole('tab');

      tabs[0].focus();
      await user.keyboard('{End}');
      expect(tabs[tabs.length - 1]).toHaveFocus();
    });

    it('Enter selects currently focused tab', async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarTabs
          items={defaultItems}
          onValueChange={handleValueChange}
          aria-label="Date presets"
        />
      );

      const tabs = screen.getAllByRole('tab');
      tabs[2].focus();
      await user.keyboard('{Enter}');

      expect(handleValueChange).toHaveBeenCalledWith('last-week');
    });

    it('Space selects currently focused tab', async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarTabs
          items={defaultItems}
          onValueChange={handleValueChange}
          aria-label="Date presets"
        />
      );

      const tabs = screen.getAllByRole('tab');
      tabs[4].focus();
      await user.keyboard(' ');

      expect(handleValueChange).toHaveBeenCalledWith('last-year');
    });

    it('navigation wraps around at end (ArrowDown)', async () => {
      const user = userEvent.setup();

      render(<CalendarTabs items={defaultItems} aria-label="Date presets" />);
      const tabs = screen.getAllByRole('tab');
      const lastIndex = tabs.length - 1;

      tabs[lastIndex].focus();
      await user.keyboard('{ArrowDown}');
      expect(tabs[0]).toHaveFocus();
    });

    it('navigation wraps around at start (ArrowUp)', async () => {
      const user = userEvent.setup();

      render(<CalendarTabs items={defaultItems} aria-label="Date presets" />);
      const tabs = screen.getAllByRole('tab');
      const lastIndex = tabs.length - 1;

      tabs[0].focus();
      await user.keyboard('{ArrowUp}');
      expect(tabs[lastIndex]).toHaveFocus();
    });

    it('disabled tabs are skipped during navigation', async () => {
      const user = userEvent.setup();

      render(
        <CalendarTabs items={mixedDisabledItems} aria-label="Date presets" />
      );
      const tabs = screen.getAllByRole('tab');

      // Start at Today (index 0)
      tabs[0].focus();
      expect(tabs[0]).toHaveFocus();

      // ArrowDown should skip Yesterday (disabled, index 1) and go to Last week (index 2)
      await user.keyboard('{ArrowDown}');
      expect(tabs[2]).toHaveFocus();

      // ArrowDown again should skip Last month (disabled, index 3) and go to Last year (index 4)
      await user.keyboard('{ArrowDown}');
      expect(tabs[4]).toHaveFocus();
    });

    it('disabled tab has tabIndex=-1', () => {
      render(
        <CalendarTabs items={mixedDisabledItems} aria-label="Date presets" />
      );
      const disabledTab = screen.getByText('Yesterday');
      expect(disabledTab).toHaveAttribute('tabindex', '-1');
    });

    it('all disabled means no keyboard navigation', async () => {
      const user = userEvent.setup();
      const allDisabledItems: CalendarTabItem[] = [
        { value: 'a', label: 'A', disabled: true },
        { value: 'b', label: 'B', disabled: true },
      ];

      render(<CalendarTabs items={allDisabledItems} aria-label="Date presets" />);

      // All tabs should have tabIndex=-1
      const tabs = screen.getAllByRole('tab');
      for (const tab of tabs) {
        expect(tab).toHaveAttribute('tabindex', '-1');
      }

      // Keyboard events should not crash
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowUp}');
    });
  });

  describe('Accessibility', () => {
    it('has role="tablist"', () => {
      render(<CalendarTabs items={defaultItems} aria-label="Date presets" />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('has aria-orientation="vertical" by default', () => {
      render(<CalendarTabs items={defaultItems} aria-label="Date presets" />);
      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('accepts and applies aria-label prop', () => {
      render(<CalendarTabs items={defaultItems} aria-label="Custom label" />);
      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-label', 'Custom label');
    });

    it('each CalendarTab has role="tab"', () => {
      render(<CalendarTabs items={defaultItems} aria-label="Date presets" />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(defaultItems.length);
    });

    it('active tab has aria-selected="true"', () => {
      render(
        <CalendarTabs
          items={defaultItems}
          value="today"
          aria-label="Date presets"
        />
      );
      const activeTab = screen.getByText('Today');
      expect(activeTab).toHaveAttribute('aria-selected', 'true');
    });

    it('inactive tabs have aria-selected="false"', () => {
      render(
        <CalendarTabs
          items={defaultItems}
          value="today"
          aria-label="Date presets"
        />
      );
      const inactiveTab = screen.getByText('Yesterday');
      expect(inactiveTab).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Ref and Props', () => {
    it('passes through data attributes', () => {
      render(
        <CalendarTabs
          items={defaultItems}
          data-testid="test-tabs"
          aria-label="Date presets"
        />
      );
      expect(screen.getByTestId('test-tabs')).toBeInTheDocument();
    });

    it('passes through id attribute', () => {
      render(
        <CalendarTabs
          items={defaultItems}
          id="my-tabs"
          aria-label="Date presets"
        />
      );
      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('id', 'my-tabs');
    });

    it('merges custom className with default styles', () => {
      render(
        <CalendarTabs
          items={defaultItems}
          className="custom-class mt-4"
          aria-label="Date presets"
        />
      );
      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveClass('custom-class', 'mt-4');
      expect(tablist).toHaveClass('flex', 'flex-col', 'gap-1');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty items array', () => {
      render(<CalendarTabs items={[]} aria-label="Empty" />);
      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
      expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });

    it('handles single item', () => {
      render(
        <CalendarTabs
          items={[{ value: 'only', label: 'Only Option' }]}
          aria-label="Single"
        />
      );
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(1);
      expect(tabs[0]).toHaveAttribute('tabindex', '0');
    });

    it('handles long text content in labels', () => {
      const longLabelItems: CalendarTabItem[] = [
        {
          value: 'long',
          label: 'This is a very long text label that might overflow',
        },
      ];
      render(<CalendarTabs items={longLabelItems} aria-label="Long text" />);
      expect(
        screen.getByText('This is a very long text label that might overflow')
      ).toBeInTheDocument();
    });

    it('handles rapid selection changes', async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarTabs
          items={defaultItems}
          defaultValue="today"
          onValueChange={handleValueChange}
          aria-label="Date presets"
        />
      );

      await user.click(screen.getByText('Yesterday'));
      await user.click(screen.getByText('Last week'));
      await user.click(screen.getByText('Last month'));

      expect(handleValueChange).toHaveBeenCalledTimes(3);
      expect(handleValueChange).toHaveBeenNthCalledWith(1, 'yesterday');
      expect(handleValueChange).toHaveBeenNthCalledWith(2, 'last-week');
      expect(handleValueChange).toHaveBeenNthCalledWith(3, 'last-month');
    });

    it('warns in development when duplicate values are provided', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const duplicateItems: CalendarTabItem[] = [
        { value: 'same', label: 'First' },
        { value: 'same', label: 'Second' },
      ];

      render(<CalendarTabs items={duplicateItems} aria-label="Duplicates" />);

      expect(consoleWarn).toHaveBeenCalledWith(
        'CalendarTabs: Duplicate values detected in items. Each item should have a unique value.'
      );

      consoleWarn.mockRestore();
    });
  });

  describe('Orientation', () => {
    it('supports horizontal orientation', () => {
      render(
        <CalendarTabs
          items={defaultItems}
          orientation="horizontal"
          aria-label="Date presets"
        />
      );
      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');
      expect(tablist).toHaveClass('flex-row');
    });

    it('uses ArrowLeft/ArrowRight for horizontal navigation', async () => {
      const user = userEvent.setup();

      render(
        <CalendarTabs
          items={defaultItems}
          orientation="horizontal"
          aria-label="Date presets"
        />
      );
      const tabs = screen.getAllByRole('tab');

      tabs[0].focus();
      await user.keyboard('{ArrowRight}');
      expect(tabs[1]).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(tabs[0]).toHaveFocus();
    });
  });

  describe('Display Name', () => {
    it('has correct display name', () => {
      expect(CalendarTabs.displayName).toBe('CalendarTabs');
    });
  });
});
