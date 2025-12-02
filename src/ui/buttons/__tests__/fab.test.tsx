import { Chat, Pencil, Plus } from '@phosphor-icons/react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Fab } from '../fab';

describe('Fab', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Fab icon={Plus} aria-label="Add item" />);
      const button = screen.getByRole('button', { name: 'Add item' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('renders icon correctly', () => {
      render(<Fab icon={Plus} aria-label="Add item" />);
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('applies correct circular shape classes', () => {
      render(<Fab icon={Plus} aria-label="Add item" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-full');
      expect(button).toHaveClass('aspect-square');
    });

    it('applies correct default variant classes', () => {
      render(<Fab icon={Plus} aria-label="Add item" />);
      const button = screen.getByRole('button');
      // Default is filled, md, brand
      expect(button).toHaveClass('bg-fill-primary');
      expect(button).toHaveClass('size-14'); // md = 56px
      expect(button).toHaveClass('shadow-lg');
    });
  });

  describe('Variant Tests', () => {
    describe('Style variants', () => {
      it('applies filled variant classes', () => {
        render(<Fab icon={Plus} variant="filled" aria-label="Add item" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('shadow-lg');
        expect(button).toHaveClass('bg-fill-primary');
      });

      it('applies outline variant classes', () => {
        render(
          <Fab icon={Plus} variant="outline" color="gray" aria-label="Add" />
        );
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-transparent');
        expect(button).toHaveClass('border');
        expect(button).toHaveClass('border-border');
      });
    });

    describe('Size variants', () => {
      it('applies md size classes', () => {
        render(<Fab icon={Plus} size="md" aria-label="Add" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('size-14'); // 56px
        expect(button).toHaveClass('p-4');
      });

      it('applies sm size classes', () => {
        render(<Fab icon={Plus} size="sm" aria-label="Add" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('size-12'); // 48px
        expect(button).toHaveClass('p-3');
      });
    });

    describe('Color variants', () => {
      it('applies brand color classes', () => {
        render(<Fab icon={Plus} color="brand" aria-label="Add" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-fill-primary');
        expect(button).toHaveClass('text-text-overlay-white');
      });

      it('applies gray color classes with outline variant', () => {
        render(
          <Fab icon={Plus} variant="outline" color="gray" aria-label="Add" />
        );
        const button = screen.getByRole('button');
        expect(button).toHaveClass('border-border');
        expect(button).toHaveClass('text-text-subtle');
      });
    });

    describe('Compound variants', () => {
      it('applies filled + brand classes correctly', () => {
        render(
          <Fab icon={Plus} variant="filled" color="brand" aria-label="Add" />
        );
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-fill-primary');
        expect(button).toHaveClass('shadow-lg');
        expect(button).toHaveClass('text-text-overlay-white');
      });

      it('applies outline + gray classes correctly', () => {
        render(
          <Fab icon={Plus} variant="outline" color="gray" aria-label="Add" />
        );
        const button = screen.getByRole('button');
        expect(button).toHaveClass('border-border');
        expect(button).toHaveClass('text-text-subtle');
        expect(button).toHaveClass('bg-transparent');
      });
    });
  });

  describe('Icon Tests', () => {
    it('icon renders with correct size (lg for all FAB sizes)', () => {
      render(<Fab icon={Plus} aria-label="Add" />);
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toHaveClass('size-6'); // lg = 24px
    });

    it('icon size is consistent across md FAB size', () => {
      render(<Fab icon={Plus} size="md" aria-label="Add" />);
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toHaveClass('size-6'); // lg = 24px
    });

    it('icon size is consistent across sm FAB size', () => {
      render(<Fab icon={Plus} size="sm" aria-label="Add" />);
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toHaveClass('size-6'); // lg = 24px, same for all sizes
    });

    it('icon has aria-hidden attribute', () => {
      render(<Fab icon={Plus} aria-label="Add" />);
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders different icons correctly', () => {
      const { rerender } = render(<Fab icon={Plus} aria-label="Add" />);
      expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();

      rerender(<Fab icon={Pencil} aria-label="Edit" />);
      expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();

      rerender(<Fab icon={Chat} aria-label="Chat" />);
      expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Focus Ring Tests', () => {
    it('focus ring color matches brand color variant', () => {
      render(<Fab icon={Plus} color="brand" aria-label="Add" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-primary');
    });

    it('focus ring color matches gray color variant', () => {
      render(<Fab icon={Plus} variant="outline" color="gray" aria-label="Add" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-border');
    });

    it('has focus-visible ring classes', () => {
      render(<Fab icon={Plus} aria-label="Add" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-2');
      expect(button).toHaveClass('focus-visible:ring-offset-2');
    });
  });

  describe('State Tests', () => {
    it('applies disabled state correctly', () => {
      render(<Fab icon={Plus} disabled aria-label="Add" />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveClass('disabled:pointer-events-none');
    });

    it('shows spinner during loading state', () => {
      render(<Fab icon={Plus} loading aria-label="Loading" />);
      const button = screen.getByRole('button');
      expect(button.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('loading state disables button', () => {
      render(<Fab icon={Plus} loading aria-label="Loading" />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('loading spinner replaces icon', () => {
      render(<Fab icon={Plus} loading aria-label="Loading" />);
      const button = screen.getByRole('button');
      // Should only have one SVG (the spinner)
      const icons = button.querySelectorAll('svg');
      expect(icons).toHaveLength(1);
      expect(button.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('click handlers fire correctly', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Fab icon={Plus} onClick={handleClick} aria-label="Add" />);
      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('click handlers do not fire when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Fab icon={Plus} onClick={handleClick} disabled aria-label="Add" />);
      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('click handlers do not fire during loading state', () => {
      const handleClick = vi.fn();

      render(
        <Fab icon={Plus} onClick={handleClick} loading aria-label="Loading" />
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Interaction Tests', () => {
    it('triggers click on Enter key press', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Fab icon={Plus} onClick={handleClick} aria-label="Add" />);
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('triggers click on Space key press', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Fab icon={Plus} onClick={handleClick} aria-label="Add" />);
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Fab icon={Plus} onClick={handleClick} disabled aria-label="Add" />);
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
          <Fab icon={Plus} aria-label="Add" />
        </div>
      );

      await user.tab();
      await user.tab();

      expect(screen.getByRole('button')).toHaveFocus();
    });
  });

  describe('Accessibility Tests', () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('warns in development for missing aria-label', () => {
      // @ts-expect-error Testing missing aria-label scenario
      render(<Fab icon={Plus} />);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Fab: aria-label is required for accessibility'
      );
    });

    it('does not warn when aria-label is provided', () => {
      render(<Fab icon={Plus} aria-label="Add item" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('has accessible name from aria-label', () => {
      render(<Fab icon={Plus} aria-label="Create new item" />);
      expect(
        screen.getByRole('button', { name: 'Create new item' })
      ).toBeInTheDocument();
    });

    it('aria-busy is set during loading state', () => {
      render(<Fab icon={Plus} loading aria-label="Loading" />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('aria-disabled is set when disabled', () => {
      render(<Fab icon={Plus} disabled aria-label="Disabled" />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('merges custom className', () => {
      render(<Fab icon={Plus} className="custom-class mt-4" aria-label="Add" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class', 'mt-4');
    });

    it('handles very long aria-label text', () => {
      const longLabel = 'A'.repeat(100);
      render(<Fab icon={Plus} aria-label={longLabel} />);
      expect(screen.getByRole('button', { name: longLabel })).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Fab ref={ref} icon={Plus} aria-label="Add" />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('loading state transition', () => {
      const { rerender } = render(<Fab icon={Plus} aria-label="Add" />);
      const button = screen.getByRole('button');

      expect(button).not.toBeDisabled();
      expect(button).not.toHaveAttribute('aria-busy');

      rerender(<Fab icon={Plus} loading aria-label="Add" />);
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('all variant+color+size combinations render correctly', () => {
      const variants = ['filled', 'outline'] as const;
      const colors = ['brand', 'gray'] as const;
      const sizes = ['md', 'sm'] as const;

      for (const variant of variants) {
        for (const color of colors) {
          for (const size of sizes) {
            const { unmount } = render(
              <Fab
                icon={Plus}
                variant={variant}
                color={color}
                size={size}
                aria-label={`${variant}-${color}-${size}`}
              />
            );
            expect(
              screen.getByRole('button', {
                name: `${variant}-${color}-${size}`,
              })
            ).toBeInTheDocument();
            unmount();
          }
        }
      }
    });
  });
});
