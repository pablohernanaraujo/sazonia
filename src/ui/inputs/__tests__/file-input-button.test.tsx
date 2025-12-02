import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FileInputButton } from '../file-input-button';

describe('FileInputButton', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<FileInputButton>Browse</FileInputButton>);
      const button = screen.getByRole('button', { name: 'Browse' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('renders children correctly', () => {
      render(<FileInputButton>Select File</FileInputButton>);
      expect(screen.getByText('Select File')).toBeInTheDocument();
    });

    it('renders without children', () => {
      render(<FileInputButton />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it('applies correct border radius (right corners only)', () => {
      render(<FileInputButton>Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-tr-sm');
      expect(button).toHaveClass('rounded-br-sm');
      expect(button).not.toHaveClass('rounded-tl-sm');
      expect(button).not.toHaveClass('rounded-bl-sm');
    });

    it('applies correct border pattern (no left border)', () => {
      render(<FileInputButton>Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border');
      expect(button).toHaveClass('border-l-0');
    });
  });

  describe('Size Variants', () => {
    it('applies sm size classes correctly', () => {
      render(<FileInputButton size="sm">Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-2.5');
      expect(button).toHaveClass('py-1.5');
      expect(button).toHaveClass('text-sm');
      expect(button).toHaveClass('leading-5');
      expect(button).toHaveClass('gap-1.5');
    });

    it('applies md size classes correctly', () => {
      render(<FileInputButton size="md">Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3');
      expect(button).toHaveClass('py-2.5');
      expect(button).toHaveClass('text-sm');
      expect(button).toHaveClass('leading-5');
      expect(button).toHaveClass('gap-2');
    });

    it('applies lg size classes correctly (default)', () => {
      render(<FileInputButton>Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3.5');
      expect(button).toHaveClass('py-3');
      expect(button).toHaveClass('text-base');
      expect(button).toHaveClass('leading-6');
      expect(button).toHaveClass('gap-2');
    });

    it('defaults to lg size when size is not specified', () => {
      render(<FileInputButton>Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3.5');
      expect(button).toHaveClass('py-3');
    });
  });

  describe('State Tests', () => {
    it('default state has correct styling', () => {
      render(<FileInputButton>Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-background');
      expect(button).toHaveClass('border-border');
      expect(button).toHaveClass('text-text-tertiary');
    });

    it('disabled state disables the button', () => {
      render(<FileInputButton disabled>Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('disabled state sets aria-disabled', () => {
      render(<FileInputButton disabled>Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('disabled state applies disabled styling classes', () => {
      render(<FileInputButton disabled>Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:opacity-52');
      expect(button).toHaveClass('disabled:cursor-not-allowed');
      expect(button).toHaveClass('disabled:bg-background-secondary');
      expect(button).toHaveClass('disabled:border-border-disabled');
      expect(button).toHaveClass('disabled:text-text-secondary');
    });

    it('error state applies destructive border', () => {
      render(<FileInputButton error>Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-destructive');
    });

    it('error state maintains destructive border on hover', () => {
      render(<FileInputButton error>Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:border-destructive');
    });

    it('error state changes focus ring to destructive', () => {
      render(<FileInputButton error>Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-destructive');
    });
  });

  describe('Interaction Tests', () => {
    it('onClick handler fires on click', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<FileInputButton onClick={handleClick}>Browse</FileInputButton>);
      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('onClick does not fire when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <FileInputButton onClick={handleClick} disabled>
          Browse
        </FileInputButton>
      );
      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('onClick does not fire when disabled (fireEvent)', () => {
      const handleClick = vi.fn();

      render(
        <FileInputButton onClick={handleClick} disabled>
          Browse
        </FileInputButton>
      );
      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('Enter key triggers click', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<FileInputButton onClick={handleClick}>Browse</FileInputButton>);
      screen.getByRole('button').focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('Space key triggers click', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<FileInputButton onClick={handleClick}>Browse</FileInputButton>);
      screen.getByRole('button').focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('keyboard does not work when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <FileInputButton onClick={handleClick} disabled>
          Browse
        </FileInputButton>
      );
      screen.getByRole('button').focus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Tests', () => {
    it('has correct button role', () => {
      render(<FileInputButton>Browse</FileInputButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has type="button" to prevent form submission', () => {
      render(<FileInputButton>Browse</FileInputButton>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('aria-disabled is not present when enabled', () => {
      render(<FileInputButton>Browse</FileInputButton>);
      expect(screen.getByRole('button')).not.toHaveAttribute('aria-disabled');
    });

    it('button is focusable when not disabled', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <input data-testid="input" />
          <FileInputButton>Browse</FileInputButton>
        </div>
      );

      await user.tab();
      await user.tab();

      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('has focus-visible ring classes', () => {
      render(<FileInputButton>Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-2');
      expect(button).toHaveClass('focus-visible:ring-primary');
      expect(button).toHaveClass('focus-visible:ring-offset-2');
      expect(button).toHaveClass('focus-visible:outline-none');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly to button element', () => {
      const ref = { current: null };
      render(<FileInputButton ref={ref}>Browse</FileInputButton>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('ref provides access to native button methods', () => {
      const ref = { current: null as HTMLButtonElement | null };
      render(<FileInputButton ref={ref}>Browse</FileInputButton>);
      expect(ref.current?.focus).toBeDefined();
      expect(ref.current?.click).toBeDefined();
    });
  });

  describe('Styling Tests', () => {
    it('merges custom className properly', () => {
      render(
        <FileInputButton className="custom-class mt-4">Browse</FileInputButton>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('mt-4');
    });

    it('preserves variant classes when merging custom className', () => {
      render(<FileInputButton className="custom-class">Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-tr-sm');
      expect(button).toHaveClass('rounded-br-sm');
      expect(button).toHaveClass('custom-class');
    });

    it('has transition classes for smooth state changes', () => {
      render(<FileInputButton>Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-colors');
      expect(button).toHaveClass('duration-150');
    });

    it('has font-medium class for typography', () => {
      render(<FileInputButton>Browse</FileInputButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('font-medium');
    });
  });

  describe('Edge Cases', () => {
    it('renders without onClick handler (should not error)', () => {
      expect(() => {
        render(<FileInputButton>Browse</FileInputButton>);
      }).not.toThrow();
    });

    it('handles very long text content', () => {
      const longText = 'Browse Files From Your Computer';
      render(<FileInputButton>{longText}</FileInputButton>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles additional HTML attributes via spread props', () => {
      render(
        <FileInputButton data-testid="file-browse" id="custom-id">
          Browse
        </FileInputButton>
      );
      const button = screen.getByTestId('file-browse');
      expect(button).toHaveAttribute('id', 'custom-id');
    });

    it('state transitions from enabled to disabled work correctly', () => {
      const { rerender } = render(<FileInputButton>Browse</FileInputButton>);
      const button = screen.getByRole('button');

      expect(button).not.toBeDisabled();
      expect(button).not.toHaveAttribute('aria-disabled');

      rerender(<FileInputButton disabled>Browse</FileInputButton>);
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('state transitions from non-error to error work correctly', () => {
      const { rerender } = render(<FileInputButton>Browse</FileInputButton>);
      const button = screen.getByRole('button');

      expect(button).not.toHaveClass('border-destructive');

      rerender(<FileInputButton error>Browse</FileInputButton>);
      expect(button).toHaveClass('border-destructive');
    });

    it('handles both error and disabled states simultaneously', () => {
      render(
        <FileInputButton error disabled>
          Browse
        </FileInputButton>
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('border-destructive');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
