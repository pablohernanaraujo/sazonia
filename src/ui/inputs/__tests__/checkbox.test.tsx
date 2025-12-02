import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '../checkbox';

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    it('renders unchecked state correctly', () => {
      render(<Checkbox checked={false} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
      expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    });

    it('renders checked state correctly', () => {
      render(<Checkbox checked />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
      expect(checkbox).toHaveAttribute('data-state', 'checked');
      // Check icon should be visible
      expect(checkbox.querySelector('svg')).toBeInTheDocument();
    });

    it('renders indeterminate state correctly', () => {
      render(<Checkbox indeterminate />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
      // Minus icon should be visible
      expect(checkbox.querySelector('svg')).toBeInTheDocument();
    });

    it('renders indeterminate state when checked="indeterminate"', () => {
      render(<Checkbox checked="indeterminate" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
    });
  });

  describe('Size Variants', () => {
    it('applies sm size classes', () => {
      render(<Checkbox size="sm" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('size-4');
    });

    it('applies md size classes (default)', () => {
      render(<Checkbox size="md" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('size-5');
    });

    it('applies lg size classes', () => {
      render(<Checkbox size="lg" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('size-6');
    });

    it('defaults to md size when not specified', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('size-5');
    });
  });

  describe('State Tests', () => {
    it('disabled checkbox cannot be clicked', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Checkbox disabled onCheckedChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toBeDisabled();
      await user.click(checkbox);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('disabled checkbox has correct attributes', () => {
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
      expect(checkbox).toHaveAttribute('data-disabled', '');
    });

    it('error state applies error styling', () => {
      render(<Checkbox error />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('border-destructive');
    });

    it('checked state change fires callback', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Checkbox onCheckedChange={handleChange} />);
      await user.click(screen.getByRole('checkbox'));

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('unchecking fires callback with false', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Checkbox checked onCheckedChange={handleChange} />);
      await user.click(screen.getByRole('checkbox'));

      expect(handleChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Keyboard Interaction', () => {
    it('Space key toggles checkbox', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Checkbox onCheckedChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      checkbox.focus();
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('disabled checkbox ignores keyboard', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Checkbox disabled onCheckedChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      checkbox.focus();
      await user.keyboard(' ');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('can be focused via tab', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <input data-testid="input" />
          <Checkbox data-testid="checkbox" />
        </div>
      );

      await user.tab();
      await user.tab();

      expect(screen.getByRole('checkbox')).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has role="checkbox"', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('has aria-checked=false for unchecked', () => {
      render(<Checkbox checked={false} />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'aria-checked',
        'false'
      );
    });

    it('has aria-checked=true for checked', () => {
      render(<Checkbox checked />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'aria-checked',
        'true'
      );
    });

    it('has aria-checked=mixed for indeterminate', () => {
      render(<Checkbox indeterminate />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'aria-checked',
        'mixed'
      );
    });

    it('has data-disabled when disabled', () => {
      render(<Checkbox disabled />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-disabled', '');
    });

    it('supports aria-label', () => {
      render(<Checkbox aria-label="Accept terms and conditions" />);
      expect(
        screen.getByRole('checkbox', { name: 'Accept terms and conditions' })
      ).toBeInTheDocument();
    });

    it('supports aria-labelledby', () => {
      render(
        <>
          <label id="terms-label">Accept terms</label>
          <Checkbox aria-labelledby="terms-label" />
        </>
      );
      expect(
        screen.getByRole('checkbox', { name: 'Accept terms' })
      ).toBeInTheDocument();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works as controlled component', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      const { rerender } = render(
        <Checkbox checked={false} onCheckedChange={handleChange} />
      );

      await user.click(screen.getByRole('checkbox'));
      expect(handleChange).toHaveBeenCalledWith(true);

      // State doesn't change until parent updates prop
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'aria-checked',
        'false'
      );

      // Simulate parent updating
      rerender(<Checkbox checked={true} onCheckedChange={handleChange} />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'aria-checked',
        'true'
      );
    });

    it('works as uncontrolled component', async () => {
      const user = userEvent.setup();

      render(<Checkbox defaultChecked={false} />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-checked', 'false');

      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('respects defaultChecked initial value', () => {
      render(<Checkbox defaultChecked />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'aria-checked',
        'true'
      );
    });
  });

  describe('Edge Cases', () => {
    it('merges custom className', () => {
      render(<Checkbox className="custom-class mt-4" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('custom-class', 'mt-4');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Checkbox ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('indeterminate prop takes precedence over checked', () => {
      render(<Checkbox checked indeterminate />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
      expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
    });

    it('transitions between states correctly', () => {
      const { rerender } = render(<Checkbox checked={false} />);

      // Unchecked → Checked
      rerender(<Checkbox checked={true} />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'data-state',
        'checked'
      );

      // Checked → Indeterminate
      rerender(<Checkbox indeterminate />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'data-state',
        'indeterminate'
      );

      // Indeterminate → Unchecked
      rerender(<Checkbox checked={false} />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'data-state',
        'unchecked'
      );
    });

    it('error state combined with disabled', () => {
      render(<Checkbox error disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('border-destructive');
      expect(checkbox).toBeDisabled();
    });

    it('supports required prop', () => {
      render(<Checkbox required />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });
  });

  describe('Focus Management', () => {
    it('has focus-visible ring classes', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('focus-visible:ring-2');
      expect(checkbox).toHaveClass('focus-visible:outline-none');
    });

    it('can receive focus programmatically', () => {
      render(<Checkbox data-testid="checkbox" />);
      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      expect(checkbox).toHaveFocus();
    });

    it('disabled checkbox cannot receive focus via tab', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <input data-testid="input" />
          <Checkbox disabled data-testid="checkbox" />
          <button data-testid="button">Button</button>
        </div>
      );

      await user.tab(); // Focus input
      await user.tab(); // Should skip checkbox, focus button

      expect(screen.getByTestId('button')).toHaveFocus();
    });
  });
});
