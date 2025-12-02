import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ErrorMessage } from '../error-message';

describe('ErrorMessage', () => {
  describe('Rendering', () => {
    it('renders with required text prop', () => {
      render(<ErrorMessage text="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('renders as div element', () => {
      render(<ErrorMessage text="Error" />);
      const container = screen.getByRole('alert');
      expect(container.tagName).toBe('DIV');
    });

    it('renders empty text gracefully', () => {
      render(<ErrorMessage text="" />);
      const container = screen.getByRole('alert');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('applies MD size by default', () => {
      render(<ErrorMessage text="Error" />);
      const textSpan = screen.getByText('Error');
      expect(textSpan).toHaveClass('text-sm', 'leading-5');
    });

    it('applies SM size variant', () => {
      render(<ErrorMessage text="Error" size="sm" />);
      const textSpan = screen.getByText('Error');
      expect(textSpan).toHaveClass('text-xs');
    });

    it('applies MD size variant explicitly', () => {
      render(<ErrorMessage text="Error" size="md" />);
      const textSpan = screen.getByText('Error');
      expect(textSpan).toHaveClass('text-sm', 'leading-5');
    });

    it('applies correct typography classes for SM size', () => {
      render(<ErrorMessage text="Error" size="sm" />);
      const textSpan = screen.getByText('Error');
      expect(textSpan).toHaveClass('text-xs');
      expect(textSpan.className).toContain('leading-[18px]');
    });

    it('applies correct typography classes for MD size', () => {
      render(<ErrorMessage text="Error" size="md" />);
      const textSpan = screen.getByText('Error');
      expect(textSpan).toHaveClass('text-sm', 'leading-5');
    });
  });

  describe('Icon', () => {
    it('shows icon by default (showIcon=true)', () => {
      render(<ErrorMessage text="Error" />);
      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('hides icon when showIcon=false', () => {
      render(<ErrorMessage text="Error" showIcon={false} />);
      const icon = document.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });

    it('icon has destructive color class', () => {
      render(<ErrorMessage text="Error" />);
      const icon = document.querySelector('svg');
      expect(icon).toHaveClass('text-destructive');
    });

    it('icon is hidden from screen readers (aria-hidden)', () => {
      render(<ErrorMessage text="Error" />);
      const icon = document.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('applies smaller icon size for SM variant', () => {
      render(<ErrorMessage text="Error" size="sm" />);
      const icon = document.querySelector('svg');
      expect(icon).toHaveClass('size-[14px]');
    });

    it('uses default icon size for MD variant', () => {
      render(<ErrorMessage text="Error" size="md" />);
      const icon = document.querySelector('svg');
      expect(icon).toHaveClass('size-4'); // sm size = 16px
      expect(icon).not.toHaveClass('size-[14px]');
    });
  });

  describe('Styling', () => {
    it('text has destructive color class', () => {
      render(<ErrorMessage text="Error" />);
      const textSpan = screen.getByText('Error');
      expect(textSpan).toHaveClass('text-destructive');
    });

    it('text has font-medium weight', () => {
      render(<ErrorMessage text="Error" />);
      const textSpan = screen.getByText('Error');
      expect(textSpan).toHaveClass('font-medium');
    });

    it('container has correct spacing classes', () => {
      render(<ErrorMessage text="Error" />);
      const container = screen.getByRole('alert');
      expect(container).toHaveClass('flex', 'items-start', 'gap-1.5', 'pt-2');
    });
  });

  describe('Accessibility', () => {
    it('has role="alert" attribute', () => {
      render(<ErrorMessage text="Error" />);
      const container = screen.getByRole('alert');
      expect(container).toBeInTheDocument();
    });

    it('supports id prop for aria-describedby associations', () => {
      render(<ErrorMessage text="Error" id="email-error" />);
      const container = screen.getByRole('alert');
      expect(container).toHaveAttribute('id', 'email-error');
    });

    it('can be associated with input via aria-describedby', () => {
      render(
        <>
          <input id="email" aria-invalid="true" aria-describedby="email-error" />
          <ErrorMessage id="email-error" text="Email is required" />
        </>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveAttribute('id', 'email-error');
    });
  });

  describe('Composition', () => {
    it('merges custom className correctly', () => {
      render(<ErrorMessage text="Error" className="custom-class mt-4" />);
      const container = screen.getByRole('alert');
      expect(container).toHaveClass('custom-class', 'mt-4');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<ErrorMessage text="Error" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Edge cases', () => {
    it('handles very long error message text', () => {
      const longText = 'A'.repeat(500);
      render(<ErrorMessage text={longText} />);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles empty text prop', () => {
      render(<ErrorMessage text="" />);
      const container = screen.getByRole('alert');
      expect(container).toBeInTheDocument();
    });

    it('renders multiple ErrorMessage components', () => {
      render(
        <>
          <ErrorMessage text="Error 1" id="error-1" />
          <ErrorMessage text="Error 2" id="error-2" />
          <ErrorMessage text="Error 3" id="error-3" />
        </>
      );
      expect(screen.getAllByRole('alert')).toHaveLength(3);
      expect(screen.getByText('Error 1')).toBeInTheDocument();
      expect(screen.getByText('Error 2')).toBeInTheDocument();
      expect(screen.getByText('Error 3')).toBeInTheDocument();
    });

    it('renders with all props enabled', () => {
      render(
        <ErrorMessage
          size="sm"
          text="Complete error message"
          showIcon={true}
          id="complete-error"
          className="custom-class"
        />
      );

      // Container
      const container = screen.getByRole('alert');
      expect(container).toHaveAttribute('id', 'complete-error');
      expect(container).toHaveClass('custom-class');

      // Text
      const textSpan = screen.getByText('Complete error message');
      expect(textSpan).toHaveClass('text-xs');
      expect(textSpan).toHaveClass('text-destructive');

      // Icon
      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('size-[14px]');
    });

    it('renders with only required text prop', () => {
      render(<ErrorMessage text="Minimal error" />);
      const container = screen.getByRole('alert');
      expect(container).toBeInTheDocument();
      expect(screen.getByText('Minimal error')).toBeInTheDocument();
      expect(document.querySelector('svg')).toBeInTheDocument(); // Icon shown by default
    });
  });
});
