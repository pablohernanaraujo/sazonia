import { Bell, House, Star } from '@phosphor-icons/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Icon } from '../icon';

describe('Icon', () => {
  it('renders with default props', () => {
    render(<Icon icon={House} data-testid="icon" />);
    const element = screen.getByTestId('icon');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('svg');
  });

  it('applies default size (md - 20px)', () => {
    render(<Icon icon={House} data-testid="icon" />);
    const element = screen.getByTestId('icon');
    expect(element).toHaveClass('size-5');
  });

  it('applies default color (text-text-primary)', () => {
    render(<Icon icon={House} data-testid="icon" />);
    const element = screen.getByTestId('icon');
    expect(element).toHaveClass('text-text-primary');
  });

  describe('size variants', () => {
    it('applies xs size (12px)', () => {
      render(<Icon icon={House} size="xs" data-testid="icon" />);
      expect(screen.getByTestId('icon')).toHaveClass('size-3');
    });

    it('applies sm size (16px)', () => {
      render(<Icon icon={House} size="sm" data-testid="icon" />);
      expect(screen.getByTestId('icon')).toHaveClass('size-4');
    });

    it('applies md size (20px)', () => {
      render(<Icon icon={House} size="md" data-testid="icon" />);
      expect(screen.getByTestId('icon')).toHaveClass('size-5');
    });

    it('applies lg size (24px)', () => {
      render(<Icon icon={House} size="lg" data-testid="icon" />);
      expect(screen.getByTestId('icon')).toHaveClass('size-6');
    });

    it('applies xl size (32px)', () => {
      render(<Icon icon={House} size="xl" data-testid="icon" />);
      expect(screen.getByTestId('icon')).toHaveClass('size-8');
    });
  });

  describe('color variants (aligned with typography)', () => {
    it('applies default color', () => {
      render(<Icon icon={Star} color="default" data-testid="icon" />);
      expect(screen.getByTestId('icon')).toHaveClass('text-text-primary');
    });

    it('applies muted color', () => {
      render(<Icon icon={Star} color="muted" data-testid="icon" />);
      expect(screen.getByTestId('icon')).toHaveClass('text-text-secondary');
    });

    it('applies primary color', () => {
      render(<Icon icon={Star} color="primary" data-testid="icon" />);
      expect(screen.getByTestId('icon')).toHaveClass('text-primary');
    });

    it('applies secondary color', () => {
      render(<Icon icon={Star} color="secondary" data-testid="icon" />);
      expect(screen.getByTestId('icon')).toHaveClass('text-secondary');
    });

    it('applies destructive color', () => {
      render(<Icon icon={Star} color="destructive" data-testid="icon" />);
      expect(screen.getByTestId('icon')).toHaveClass('text-destructive');
    });

    it('applies success color', () => {
      render(<Icon icon={Star} color="success" data-testid="icon" />);
      expect(screen.getByTestId('icon')).toHaveClass('text-success');
    });

    it('applies warning color', () => {
      render(<Icon icon={Star} color="warning" data-testid="icon" />);
      expect(screen.getByTestId('icon')).toHaveClass('text-warning');
    });

    it('applies info color', () => {
      render(<Icon icon={Star} color="info" data-testid="icon" />);
      expect(screen.getByTestId('icon')).toHaveClass('text-info');
    });
  });

  describe('weight variants', () => {
    it('uses regular weight by default', () => {
      render(<Icon icon={House} data-testid="icon" />);
      // Phosphor applies weight internally, we just verify component renders
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('accepts different weight values', () => {
      const weights = [
        'thin',
        'light',
        'regular',
        'bold',
        'fill',
        'duotone',
      ] as const;

      for (const weight of weights) {
        const { unmount } = render(
          <Icon icon={House} weight={weight} data-testid="icon" />
        );
        expect(screen.getByTestId('icon')).toBeInTheDocument();
        unmount();
      }
    });
  });

  describe('accessibility', () => {
    it('is hidden from screen readers by default (decorative)', () => {
      render(<Icon icon={House} data-testid="icon" />);
      expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true');
    });

    it('has aria-label and role="img" when label is provided', () => {
      render(<Icon icon={Bell} aria-label="Notifications" data-testid="icon" />);
      const element = screen.getByTestId('icon');
      expect(element).toHaveAttribute('aria-label', 'Notifications');
      expect(element).toHaveAttribute('role', 'img');
      expect(element).not.toHaveAttribute('aria-hidden');
    });

    it('respects explicit aria-hidden prop', () => {
      render(<Icon icon={House} aria-hidden={false} data-testid="icon" />);
      expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('className and customization', () => {
    it('merges custom className', () => {
      render(
        <Icon icon={House} className="custom-class mt-4" data-testid="icon" />
      );
      const element = screen.getByTestId('icon');
      expect(element).toHaveClass('custom-class', 'mt-4');
    });

    it('applies base classes', () => {
      render(<Icon icon={House} data-testid="icon" />);
      const element = screen.getByTestId('icon');
      expect(element).toHaveClass('inline-flex', 'shrink-0');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Icon icon={House} ref={ref} data-testid="icon" />);
      expect(ref.current).toBeInstanceOf(SVGSVGElement);
    });
  });

  describe('different icon components', () => {
    it('renders different Phosphor icons', () => {
      const { rerender } = render(<Icon icon={House} data-testid="icon" />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();

      rerender(<Icon icon={Star} data-testid="icon" />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();

      rerender(<Icon icon={Bell} data-testid="icon" />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });
});
