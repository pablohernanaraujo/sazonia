import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { QuantityInputButton } from '../quantity-input-button';

describe('QuantityInputButton', () => {
  describe('Rendering', () => {
    it('renders plus type with Plus icon', () => {
      render(<QuantityInputButton type="plus" aria-label="Increase quantity" />);
      const button = screen.getByRole('button', { name: 'Increase quantity' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('renders minus type with Minus icon', () => {
      render(<QuantityInputButton type="minus" aria-label="Decrease quantity" />);
      const button = screen.getByRole('button', { name: 'Decrease quantity' });
      expect(button).toBeInTheDocument();
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('applies correct border radius for plus type (right corners)', () => {
      render(<QuantityInputButton type="plus" aria-label="Increase" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-r-sm');
      expect(button).not.toHaveClass('rounded-l-sm');
    });

    it('applies correct border radius for minus type (left corners)', () => {
      render(<QuantityInputButton type="minus" aria-label="Decrease" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-l-sm');
      expect(button).not.toHaveClass('rounded-r-sm');
    });

    it('applies correct border pattern for plus type (no left border)', () => {
      render(<QuantityInputButton type="plus" aria-label="Increase" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-r');
      expect(button).toHaveClass('border-t');
      expect(button).toHaveClass('border-b');
      expect(button).toHaveClass('border-l-0');
    });

    it('applies correct border pattern for minus type (no right border)', () => {
      render(<QuantityInputButton type="minus" aria-label="Decrease" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-l');
      expect(button).toHaveClass('border-t');
      expect(button).toHaveClass('border-b');
      expect(button).toHaveClass('border-r-0');
    });
  });

  describe('Size Variants', () => {
    it('renders at sm size with correct dimensions', () => {
      render(<QuantityInputButton type="plus" size="sm" aria-label="Add" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8');
      expect(button).toHaveClass('px-2.5');
      expect(button).toHaveClass('py-2');
    });

    it('renders at md size with correct dimensions', () => {
      render(<QuantityInputButton type="plus" size="md" aria-label="Add" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10');
      expect(button).toHaveClass('px-3');
      expect(button).toHaveClass('py-2.5');
    });

    it('renders at lg size with correct dimensions (default)', () => {
      render(<QuantityInputButton type="plus" aria-label="Add" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12');
      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-3.5');
    });

    it('defaults to lg size when size is not specified', () => {
      render(<QuantityInputButton type="minus" aria-label="Remove" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12');
    });
  });

  describe('State Tests', () => {
    it('default state has correct background and border colors', () => {
      render(<QuantityInputButton type="plus" aria-label="Add" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-background');
      expect(button).toHaveClass('border-border');
      expect(button).toHaveClass('text-text-tertiary');
    });

    it('disabled state prevents click events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <QuantityInputButton
          type="plus"
          aria-label="Add"
          disabled
          onClick={handleClick}
        />
      );

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('disabled state applies disabled styling', () => {
      render(<QuantityInputButton type="plus" aria-label="Add" disabled />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-52');
      expect(button).toHaveClass('disabled:pointer-events-none');
      expect(button).toHaveClass('disabled:border-border-disabled');
    });

    it('has focus-visible ring styles', () => {
      render(<QuantityInputButton type="plus" aria-label="Add" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-2');
      expect(button).toHaveClass('focus-visible:ring-primary');
      expect(button).toHaveClass('focus-visible:ring-offset-2');
    });
  });

  describe('Accessibility Tests', () => {
    it('has required aria-label attribute', () => {
      render(<QuantityInputButton type="plus" aria-label="Increase quantity" />);
      expect(
        screen.getByRole('button', { name: 'Increase quantity' })
      ).toBeInTheDocument();
    });

    it('has type="button" attribute to prevent form submission', () => {
      render(<QuantityInputButton type="plus" aria-label="Add" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('has aria-disabled when disabled', () => {
      render(<QuantityInputButton type="plus" aria-label="Add" disabled />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    it('icon has aria-hidden for screen readers', () => {
      render(<QuantityInputButton type="plus" aria-label="Add" />);
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Interaction Tests', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <QuantityInputButton type="plus" aria-label="Add" onClick={handleClick} />
      );

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn();

      render(
        <QuantityInputButton
          type="minus"
          aria-label="Remove"
          disabled
          onClick={handleClick}
        />
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('triggers on Enter key', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <QuantityInputButton type="plus" aria-label="Add" onClick={handleClick} />
      );

      screen.getByRole('button').focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('triggers on Space key', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <QuantityInputButton
          type="minus"
          aria-label="Remove"
          onClick={handleClick}
        />
      );

      screen.getByRole('button').focus();
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly to button element', () => {
      const ref = { current: null };
      render(<QuantityInputButton ref={ref} type="plus" aria-label="Add" />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('ref provides access to native button methods', () => {
      const ref = { current: null as HTMLButtonElement | null };
      render(<QuantityInputButton ref={ref} type="plus" aria-label="Add" />);
      expect(ref.current?.focus).toBeDefined();
      expect(ref.current?.click).toBeDefined();
    });
  });

  describe('Styling Tests', () => {
    it('merges custom className properly', () => {
      render(
        <QuantityInputButton
          type="plus"
          aria-label="Add"
          className="custom-class mt-4"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('mt-4');
    });

    it('preserves variant classes when merging custom className', () => {
      render(
        <QuantityInputButton
          type="plus"
          aria-label="Add"
          className="custom-class"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-r-sm');
      expect(button).toHaveClass('custom-class');
    });

    it('has transition classes for smooth state changes', () => {
      render(<QuantityInputButton type="plus" aria-label="Add" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-colors');
      expect(button).toHaveClass('duration-150');
    });
  });

  describe('Edge Cases', () => {
    it('renders without onClick handler (should not error)', () => {
      expect(() => {
        render(<QuantityInputButton type="plus" aria-label="Add" />);
      }).not.toThrow();
    });

    it('handles additional HTML attributes via spread props', () => {
      render(
        <QuantityInputButton
          type="plus"
          aria-label="Add"
          data-testid="quantity-plus"
          id="custom-id"
        />
      );
      const button = screen.getByTestId('quantity-plus');
      expect(button).toHaveAttribute('id', 'custom-id');
    });

    it('renders both types correctly in composition', () => {
      render(
        <div>
          <QuantityInputButton type="minus" aria-label="Decrease" />
          <QuantityInputButton type="plus" aria-label="Increase" />
        </div>
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveClass('rounded-l-sm');
      expect(buttons[1]).toHaveClass('rounded-r-sm');
    });
  });

  describe('Development Warning', () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('warns when aria-label is missing', () => {
      // @ts-expect-error Testing missing aria-label scenario
      render(<QuantityInputButton type="plus" />);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('aria-label')
      );
    });

    it('does not warn when aria-label is provided', () => {
      render(<QuantityInputButton type="plus" aria-label="Add item" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });
});
