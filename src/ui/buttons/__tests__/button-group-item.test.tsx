import { CaretLeft, CaretRight, GridFour, List } from '@phosphor-icons/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ButtonGroupItem } from '../button-group-item';

describe('ButtonGroupItem', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<ButtonGroupItem>Option</ButtonGroupItem>);
      const button = screen.getByRole('button', { name: 'Option' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('renders children correctly', () => {
      render(<ButtonGroupItem>Test Option</ButtonGroupItem>);
      expect(screen.getByText('Test Option')).toBeInTheDocument();
    });

    it('applies correct default variant classes', () => {
      render(<ButtonGroupItem>Test</ButtonGroupItem>);
      const button = screen.getByRole('button');
      // Default is md size, middle position
      expect(button).toHaveClass('h-10');
      expect(button).toHaveClass('bg-background');
      expect(button).toHaveClass('border-border');
      expect(button).toHaveClass('text-text-tertiary');
    });
  });

  describe('Size Variants', () => {
    it('applies sm size classes', () => {
      render(<ButtonGroupItem size="sm">Small</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8');
      expect(button).toHaveClass('text-sm');
    });

    it('applies md size classes', () => {
      render(<ButtonGroupItem size="md">Medium</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10');
      expect(button).toHaveClass('text-base');
    });

    it('applies lg size classes', () => {
      render(<ButtonGroupItem size="lg">Large</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12');
      expect(button).toHaveClass('text-base');
    });
  });

  describe('Position Variants', () => {
    it('applies first position classes (rounded left only)', () => {
      render(<ButtonGroupItem position="first">First</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-l-sm');
      expect(button).not.toHaveClass('rounded-r-sm');
    });

    it('applies middle position classes (no rounding)', () => {
      render(<ButtonGroupItem position="middle">Middle</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('rounded-l-sm');
      expect(button).not.toHaveClass('rounded-r-sm');
    });

    it('applies last position classes (rounded right only)', () => {
      render(<ButtonGroupItem position="last">Last</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('rounded-l-sm');
      expect(button).toHaveClass('rounded-r-sm');
    });

    it('base styles do NOT include border radius', () => {
      // Default position is 'middle' which should have no border radius
      render(<ButtonGroupItem>Default</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('rounded-sm');
      expect(button).not.toHaveClass('rounded-l-sm');
      expect(button).not.toHaveClass('rounded-r-sm');
    });
  });

  describe('Selected State', () => {
    it('applies selected state classes', () => {
      render(<ButtonGroupItem selected>Selected</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-fill-tertiary');
      expect(button).toHaveClass('text-text-subtle');
    });

    it('sets aria-pressed="true" when selected', () => {
      render(<ButtonGroupItem selected>Selected</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('sets aria-pressed="false" when not selected', () => {
      render(<ButtonGroupItem selected={false}>Not Selected</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Disabled State', () => {
    it('applies disabled state correctly', () => {
      render(<ButtonGroupItem disabled>Disabled</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('applies disabled styling classes', () => {
      render(<ButtonGroupItem disabled>Disabled</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:opacity-52');
      expect(button).toHaveClass('disabled:pointer-events-none');
      expect(button).toHaveClass('disabled:cursor-not-allowed');
    });

    it('click handlers do not fire when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <ButtonGroupItem onClick={handleClick} disabled>
          Disabled
        </ButtonGroupItem>
      );
      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Icon Tests', () => {
    it('renders left icon correctly', () => {
      render(<ButtonGroupItem leftIcon={List}>List View</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('renders right icon correctly', () => {
      render(<ButtonGroupItem rightIcon={CaretRight}>Next</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('renders both icons correctly', () => {
      render(
        <ButtonGroupItem leftIcon={CaretLeft} rightIcon={CaretRight}>
          Navigate
        </ButtonGroupItem>
      );
      const button = screen.getByRole('button');
      const icons = button.querySelectorAll('svg');
      expect(icons).toHaveLength(2);
    });

    it('renders icon-only button correctly', () => {
      render(<ButtonGroupItem leftIcon={GridFour} aria-label="Grid view" />);
      const button = screen.getByRole('button', { name: 'Grid view' });
      expect(button).toBeInTheDocument();
      expect(button.querySelector('svg')).toBeInTheDocument();
      expect(button).toHaveClass('aspect-square');
    });

    it('icon-only applies px-0 for square aspect ratio', () => {
      render(<ButtonGroupItem leftIcon={List} aria-label="List view" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-0');
    });

    it('icons are marked as aria-hidden', () => {
      render(<ButtonGroupItem leftIcon={List}>List View</ButtonGroupItem>);
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Click Handler Tests', () => {
    it('click handlers fire correctly', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<ButtonGroupItem onClick={handleClick}>Click me</ButtonGroupItem>);
      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('passes event to click handler', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<ButtonGroupItem onClick={handleClick}>Click me</ButtonGroupItem>);
      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'click' })
      );
    });
  });

  describe('Keyboard Interaction Tests', () => {
    it('triggers click on Enter key press', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <ButtonGroupItem onClick={handleClick}>Press Enter</ButtonGroupItem>
      );
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('triggers click on Space key press', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <ButtonGroupItem onClick={handleClick}>Press Space</ButtonGroupItem>
      );
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <ButtonGroupItem onClick={handleClick} disabled>
          Disabled
        </ButtonGroupItem>
      );
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Focus Management Tests', () => {
    it('receives focus on tab navigation', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <input data-testid="input" />
          <ButtonGroupItem>Focus me</ButtonGroupItem>
        </div>
      );

      await user.tab();
      await user.tab();

      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('has focus-visible ring classes', () => {
      render(<ButtonGroupItem>Focus</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-2');
      expect(button).toHaveClass('focus-visible:ring-offset-2');
    });

    it('has focus ring color class', () => {
      render(<ButtonGroupItem>Focus</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-primary');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<ButtonGroupItem ref={ref}>Test</ButtonGroupItem>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('className Merging', () => {
    it('merges custom className', () => {
      render(
        <ButtonGroupItem className="custom-class mt-4">Test</ButtonGroupItem>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class', 'mt-4');
    });

    it('allows negative margin for border overlap', () => {
      render(<ButtonGroupItem className="-ml-px">Test</ButtonGroupItem>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('-ml-px');
    });
  });

  describe('Edge Cases', () => {
    it('handles very long text content', () => {
      const longText = 'A'.repeat(100);
      render(<ButtonGroupItem>{longText}</ButtonGroupItem>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('state transitions work correctly', () => {
      const { rerender } = render(
        <ButtonGroupItem selected={false}>Item</ButtonGroupItem>
      );
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button).not.toHaveClass('bg-fill-tertiary');

      rerender(<ButtonGroupItem selected>Item</ButtonGroupItem>);
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(button).toHaveClass('bg-fill-tertiary');
    });

    it('position changes at runtime', () => {
      const { rerender } = render(
        <ButtonGroupItem position="first">Item</ButtonGroupItem>
      );
      const button = screen.getByRole('button');

      expect(button).toHaveClass('rounded-l-sm');

      rerender(<ButtonGroupItem position="last">Item</ButtonGroupItem>);
      expect(button).toHaveClass('rounded-r-sm');
      expect(button).not.toHaveClass('rounded-l-sm');
    });
  });

  describe('Accessibility', () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('warns in development for icon-only without aria-label', () => {
      // @ts-expect-error Testing missing aria-label scenario
      render(<ButtonGroupItem leftIcon={List} />);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'ButtonGroupItem: Icon-only buttons require an aria-label for accessibility'
      );
    });

    it('icon-only button with aria-label does not warn', () => {
      render(<ButtonGroupItem leftIcon={List} aria-label="List view" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('has accessible name from children', () => {
      render(<ButtonGroupItem>Option One</ButtonGroupItem>);
      expect(
        screen.getByRole('button', { name: 'Option One' })
      ).toBeInTheDocument();
    });

    it('has accessible name from aria-label', () => {
      render(<ButtonGroupItem leftIcon={GridFour} aria-label="Grid view" />);
      expect(
        screen.getByRole('button', { name: 'Grid view' })
      ).toBeInTheDocument();
    });
  });

  describe('Group Simulation', () => {
    it('multiple items can be rendered together', () => {
      render(
        <div className="inline-flex">
          <ButtonGroupItem position="first">Left</ButtonGroupItem>
          <ButtonGroupItem position="middle" className="-ml-px">
            Center
          </ButtonGroupItem>
          <ButtonGroupItem position="last" className="-ml-px">
            Right
          </ButtonGroupItem>
        </div>
      );

      expect(screen.getByRole('button', { name: 'Left' })).toHaveClass(
        'rounded-l-sm'
      );
      expect(screen.getByRole('button', { name: 'Center' })).toHaveClass(
        '-ml-px'
      );
      expect(screen.getByRole('button', { name: 'Right' })).toHaveClass(
        'rounded-r-sm'
      );
    });

    it('only one item shows selected state', () => {
      render(
        <div className="inline-flex">
          <ButtonGroupItem position="first" selected>
            Left
          </ButtonGroupItem>
          <ButtonGroupItem position="middle" className="-ml-px">
            Center
          </ButtonGroupItem>
          <ButtonGroupItem position="last" className="-ml-px">
            Right
          </ButtonGroupItem>
        </div>
      );

      expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      expect(screen.getByRole('button', { name: 'Center' })).not.toHaveAttribute(
        'aria-pressed'
      );
      expect(screen.getByRole('button', { name: 'Right' })).not.toHaveAttribute(
        'aria-pressed'
      );
    });
  });
});
