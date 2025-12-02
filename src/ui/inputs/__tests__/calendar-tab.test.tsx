import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CalendarTab } from '../calendar-tab';

describe('CalendarTab', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<CalendarTab>Month</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toBeInTheDocument();
      expect(tab).toHaveTextContent('Month');
    });

    it('renders children content correctly', () => {
      render(<CalendarTab>2024</CalendarTab>);
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('renders as button element', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab.tagName).toBe('BUTTON');
    });

    it('has type="button" attribute', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveAttribute('type', 'button');
    });

    it('applies fixed height (h-8 = 32px)', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('h-8');
    });

    it('applies horizontal padding (px-2)', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('px-2');
    });

    it('applies vertical padding (py-1.5)', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('py-1.5');
    });

    it('applies border radius (rounded-sm = 6px)', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('rounded-sm');
    });

    it('applies typography classes', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('text-sm');
      expect(tab).toHaveClass('leading-5');
      expect(tab).toHaveClass('font-medium');
    });
  });

  describe('State Tests', () => {
    it('default state has tertiary text color', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('text-text-tertiary');
    });

    it('default state has no background (transparent)', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).not.toHaveClass('bg-background');
    });

    it('active state has background color', () => {
      render(<CalendarTab active>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('bg-background');
    });

    it('active state has primary text color', () => {
      render(<CalendarTab active>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('text-primary');
    });

    it('active=false explicitly sets inactive styling', () => {
      render(<CalendarTab active={false}>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('text-text-tertiary');
      expect(tab).not.toHaveClass('bg-background');
    });
  });

  describe('Disabled State Tests', () => {
    it('disabled state applies opacity', () => {
      render(<CalendarTab disabled>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('disabled:opacity-52');
    });

    it('disabled state applies cursor-not-allowed', () => {
      render(<CalendarTab disabled>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('disabled:cursor-not-allowed');
    });

    it('disabled state applies pointer-events-none', () => {
      render(<CalendarTab disabled>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('disabled:pointer-events-none');
    });

    it('disabled button is actually disabled', () => {
      render(<CalendarTab disabled>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toBeDisabled();
    });

    it('disabled + active combination renders correctly', () => {
      render(
        <CalendarTab active disabled>
          Tab
        </CalendarTab>
      );
      const tab = screen.getByRole('tab');
      expect(tab).toBeDisabled();
      expect(tab).toHaveClass('bg-background');
      expect(tab).toHaveClass('text-primary');
    });
  });

  describe('CSS Pseudo-Class Style Tests', () => {
    it('has hover text color style class', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('hover:text-text-tertiary-hover');
    });

    it('has focus-visible background style class', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('focus-visible:bg-background');
    });

    it('has focus-visible ring style class', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('focus-visible:ring-2');
      expect(tab).toHaveClass('focus-visible:ring-primary-300');
    });

    it('has focus-visible outline-none style class', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('focus-visible:outline-none');
    });

    it('has active (pressed) background style class', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('active:bg-background');
    });

    it('has active (pressed) text color style class', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('active:text-text-tertiary-active');
    });

    it('has transition for color changes', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('transition-colors');
      expect(tab).toHaveClass('duration-150');
    });
  });

  describe('Active State Compound Variants', () => {
    it('active tab keeps primary color on hover', () => {
      render(<CalendarTab active>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('hover:text-primary');
    });

    it('active tab keeps primary color on focus', () => {
      render(<CalendarTab active>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('focus-visible:text-primary');
    });
  });

  describe('Interaction Tests', () => {
    it('click handler fires when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<CalendarTab onClick={handleClick}>Tab</CalendarTab>);
      await user.click(screen.getByRole('tab'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('click handler does NOT fire when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarTab onClick={handleClick} disabled>
          Tab
        </CalendarTab>
      );
      await user.click(screen.getByRole('tab'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('keyboard Enter triggers click', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<CalendarTab onClick={handleClick}>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      tab.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('keyboard Space triggers click', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<CalendarTab onClick={handleClick}>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      tab.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('keyboard does not trigger click when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <CalendarTab onClick={handleClick} disabled>
          Tab
        </CalendarTab>
      );
      const tab = screen.getByRole('tab');
      tab.focus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Tests', () => {
    it('has role="tab"', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      expect(screen.getByRole('tab')).toBeInTheDocument();
    });

    it('sets aria-selected="true" when active', () => {
      render(<CalendarTab active>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-selected="false" when not active', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveAttribute('aria-selected', 'false');
    });

    it('sets aria-disabled="true" when disabled', () => {
      render(<CalendarTab disabled>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not set aria-disabled when not disabled', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).not.toHaveAttribute('aria-disabled');
    });

    it('has tabIndex="0" when enabled', () => {
      render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveAttribute('tabindex', '0');
    });

    it('has tabIndex="-1" when disabled', () => {
      render(<CalendarTab disabled>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveAttribute('tabindex', '-1');
    });

    it('can receive focus via keyboard', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button>Before</button>
          <CalendarTab>Tab</CalendarTab>
          <button>After</button>
        </div>
      );

      await user.tab();
      expect(screen.getByText('Before')).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('tab')).toHaveFocus();

      await user.tab();
      expect(screen.getByText('After')).toHaveFocus();
    });

    it('cannot receive focus when disabled', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button>Before</button>
          <CalendarTab disabled>Tab</CalendarTab>
          <button>After</button>
        </div>
      );

      await user.tab();
      expect(screen.getByText('Before')).toHaveFocus();

      await user.tab();
      expect(screen.getByText('After')).toHaveFocus();
    });
  });

  describe('Ref and Props Tests', () => {
    it('forwards ref correctly', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<CalendarTab ref={ref}>Tab</CalendarTab>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('merges custom className', () => {
      render(<CalendarTab className="custom-class mt-4">Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('custom-class', 'mt-4');
    });

    it('custom className can override default styles', () => {
      render(<CalendarTab className="bg-red-500">Tab</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toHaveClass('bg-red-500');
    });

    it('passes through data attributes', () => {
      render(<CalendarTab data-testid="test-tab">Tab</CalendarTab>);
      expect(screen.getByTestId('test-tab')).toBeInTheDocument();
    });

    it('passes through id attribute', () => {
      render(<CalendarTab id="my-tab">Tab</CalendarTab>);
      expect(screen.getByRole('tab')).toHaveAttribute('id', 'my-tab');
    });

    it('passes through aria-controls', () => {
      render(<CalendarTab aria-controls="panel-1">Tab</CalendarTab>);
      expect(screen.getByRole('tab')).toHaveAttribute('aria-controls', 'panel-1');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(<CalendarTab>{''}</CalendarTab>);
      const tab = screen.getByRole('tab');
      expect(tab).toBeInTheDocument();
    });

    it('handles long text content', () => {
      const longText = 'This is a very long text that might overflow';
      render(<CalendarTab>{longText}</CalendarTab>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles number children', () => {
      render(<CalendarTab>{2024}</CalendarTab>);
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('handles JSX children', () => {
      render(
        <CalendarTab>
          <span data-testid="inner-span">Content</span>
        </CalendarTab>
      );
      expect(screen.getByTestId('inner-span')).toBeInTheDocument();
    });

    it('handles rapid active state toggling', () => {
      const { rerender } = render(<CalendarTab active={false}>Tab</CalendarTab>);
      let tab = screen.getByRole('tab');
      expect(tab).toHaveClass('text-text-tertiary');

      rerender(<CalendarTab active>Tab</CalendarTab>);
      tab = screen.getByRole('tab');
      expect(tab).toHaveClass('text-primary');

      rerender(<CalendarTab active={false}>Tab</CalendarTab>);
      tab = screen.getByRole('tab');
      expect(tab).toHaveClass('text-text-tertiary');

      rerender(<CalendarTab active>Tab</CalendarTab>);
      tab = screen.getByRole('tab');
      expect(tab).toHaveClass('text-primary');
    });

    it('handles transition from enabled to disabled', () => {
      const { rerender } = render(<CalendarTab>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');

      expect(tab).not.toBeDisabled();

      rerender(<CalendarTab disabled>Tab</CalendarTab>);
      expect(tab).toBeDisabled();
    });

    it('handles transition from disabled to enabled', () => {
      const { rerender } = render(<CalendarTab disabled>Tab</CalendarTab>);
      const tab = screen.getByRole('tab');

      expect(tab).toBeDisabled();

      rerender(<CalendarTab>Tab</CalendarTab>);
      expect(tab).not.toBeDisabled();
    });

    it('renders correctly with all props combined', () => {
      const handleClick = vi.fn();
      render(
        <CalendarTab
          active
          onClick={handleClick}
          className="extra-class"
          id="combined-tab"
          aria-controls="combined-panel"
          data-testid="combined-test"
        >
          Combined Tab
        </CalendarTab>
      );

      const tab = screen.getByTestId('combined-test');
      expect(tab).toBeInTheDocument();
      expect(tab).toHaveClass('extra-class');
      expect(tab).toHaveClass('bg-background');
      expect(tab).toHaveClass('text-primary');
      expect(tab).toHaveAttribute('id', 'combined-tab');
      expect(tab).toHaveAttribute('aria-controls', 'combined-panel');
      expect(tab).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Display Name', () => {
    it('has correct display name', () => {
      expect(CalendarTab.displayName).toBe('CalendarTab');
    });
  });
});
