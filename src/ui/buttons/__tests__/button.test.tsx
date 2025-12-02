import { ArrowRight, Gear, Plus } from '@phosphor-icons/react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Button } from '../button';

describe('Button', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('renders children correctly', () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    it('applies correct default variant classes', () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole('button');
      // Default is filled, primary, md - uses CSS variable tokens
      expect(button).toHaveClass('bg-[var(--button-filled-primary-bg)]');
      expect(button).toHaveClass('h-[var(--button-height-md)]');
    });
  });

  describe('Variant Tests', () => {
    describe('Style variants', () => {
      it('applies filled variant classes', () => {
        render(<Button variant="filled">Filled</Button>);
        expect(screen.getByRole('button')).toHaveClass(
          'bg-[var(--button-filled-primary-bg)]'
        );
      });

      it('applies outline variant classes', () => {
        render(<Button variant="outline">Outline</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-transparent');
        expect(button).toHaveClass('border');
        expect(button).toHaveClass(
          'border-[var(--button-outline-primary-border)]'
        );
      });

      it('applies tinted variant classes', () => {
        render(<Button variant="tinted">Tinted</Button>);
        expect(screen.getByRole('button')).toHaveClass(
          'bg-[var(--button-tinted-primary-bg)]'
        );
      });

      it('applies plain variant classes', () => {
        render(<Button variant="plain">Plain</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-transparent');
        expect(button).toHaveClass('text-[var(--button-plain-primary-text)]');
      });
    });

    describe('Color variants', () => {
      it('applies primary color classes', () => {
        render(<Button color="primary">Primary</Button>);
        expect(screen.getByRole('button')).toHaveClass(
          'bg-[var(--button-filled-primary-bg)]'
        );
      });

      it('applies secondary color classes', () => {
        render(<Button color="secondary">Secondary</Button>);
        expect(screen.getByRole('button')).toHaveClass(
          'bg-[var(--button-filled-secondary-bg)]'
        );
      });

      it('applies danger color classes', () => {
        render(<Button color="danger">Danger</Button>);
        expect(screen.getByRole('button')).toHaveClass(
          'bg-[var(--button-filled-danger-bg)]'
        );
      });
    });

    describe('Size variants', () => {
      it('applies sm size classes', () => {
        render(<Button size="sm">Small</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('h-[var(--button-height-sm)]');
        expect(button).toHaveClass('text-sm');
      });

      it('applies md size classes', () => {
        render(<Button size="md">Medium</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('h-[var(--button-height-md)]');
        expect(button).toHaveClass('text-base');
      });

      it('applies lg size classes', () => {
        render(<Button size="lg">Large</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('h-[var(--button-height-lg)]');
        expect(button).toHaveClass('text-base');
      });
    });

    describe('Compound variants', () => {
      it('applies outline + danger classes correctly', () => {
        render(
          <Button variant="outline" color="danger">
            Delete
          </Button>
        );
        const button = screen.getByRole('button');
        expect(button).toHaveClass(
          'border-[var(--button-outline-danger-border)]'
        );
        expect(button).toHaveClass('text-[var(--button-outline-danger-text)]');
      });

      it('applies tinted + secondary classes correctly', () => {
        render(
          <Button variant="tinted" color="secondary">
            Secondary
          </Button>
        );
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-[var(--button-tinted-secondary-bg)]');
      });
    });
  });

  describe('State Tests', () => {
    it('applies disabled state correctly', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveClass('disabled:pointer-events-none');
    });

    it('shows spinner and disables interaction when loading', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
      // Spinner should be visible (CircleNotch icon)
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('click handlers fire correctly', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);
      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('click handlers do not fire when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );
      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('click handlers do not fire during loading state', async () => {
      const handleClick = vi.fn();

      render(
        <Button onClick={handleClick} loading>
          Loading
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Icon Tests', () => {
    it('renders left icon correctly', () => {
      render(<Button leftIcon={Plus}>Add Item</Button>);
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('renders right icon correctly', () => {
      render(<Button rightIcon={ArrowRight}>Continue</Button>);
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('renders both icons correctly', () => {
      render(
        <Button leftIcon={Plus} rightIcon={ArrowRight}>
          Action
        </Button>
      );
      const button = screen.getByRole('button');
      const icons = button.querySelectorAll('svg');
      expect(icons).toHaveLength(2);
    });

    it('renders icon-only button correctly', () => {
      render(<Button leftIcon={Plus} aria-label="Add new item" />);
      const button = screen.getByRole('button', { name: 'Add new item' });
      expect(button).toBeInTheDocument();
      expect(button.querySelector('svg')).toBeInTheDocument();
      expect(button).toHaveClass('aspect-square');
    });

    it('hides icons during loading state and shows spinner', () => {
      render(
        <Button leftIcon={Plus} loading>
          Loading
        </Button>
      );
      const button = screen.getByRole('button');
      // Should only have the spinner, not the Plus icon
      const icons = button.querySelectorAll('svg');
      expect(icons).toHaveLength(1);
      expect(button.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });

  describe('Polymorphic Tests', () => {
    it('renders child element with asChild', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveClass('inline-flex');
    });

    it('preserves button styling on child element', () => {
      render(
        <Button asChild variant="outline" color="danger">
          <a href="/delete">Delete</a>
        </Button>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveClass('border-[var(--button-outline-danger-border)]');
      expect(link).toHaveClass('text-[var(--button-outline-danger-text)]');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Button ref={ref}>Test</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Navigation Tests (href prop)', () => {
    it('renders as Next.js Link when href is provided', () => {
      render(<Button href="/dashboard">Dashboard</Button>);
      const link = screen.getByRole('link', { name: 'Dashboard' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/dashboard');
    });

    it('applies button styling to link', () => {
      render(
        <Button href="/settings" variant="outline">
          Settings
        </Button>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveClass('border');
      expect(link).toHaveClass('border-[var(--button-outline-primary-border)]');
    });

    it('renders as native button when disabled with href', () => {
      render(
        <Button href="/dashboard" disabled>
          Dashboard
        </Button>
      );
      // When disabled, href is ignored and renders as button
      const button = screen.getByRole('button', { name: 'Dashboard' });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    it('renders as native button when no href', () => {
      render(<Button>No href</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('asChild takes precedence over href', () => {
      render(
        <Button asChild href="/should-be-ignored">
          <span>Custom Element</span>
        </Button>
      );
      // Should render as span, not link
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('Keyboard Interaction Tests', () => {
    it('triggers click on Enter key press', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Press Enter</Button>);
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('triggers click on Space key press', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Press Space</Button>);
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
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
          <Button>Focus me</Button>
        </div>
      );

      await user.tab();
      await user.tab();

      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('has focus-visible ring classes', () => {
      render(<Button>Focus</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-2');
      expect(button).toHaveClass('focus-visible:ring-offset-2');
    });

    it('focus ring color matches primary variant', () => {
      render(<Button color="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass(
        'focus-visible:ring-[var(--button-focus-ring-primary)]'
      );
    });

    it('focus ring color matches danger variant', () => {
      render(<Button color="danger">Danger</Button>);
      expect(screen.getByRole('button')).toHaveClass(
        'focus-visible:ring-[var(--button-focus-ring-danger)]'
      );
    });

    it('focus ring color matches secondary variant', () => {
      render(<Button color="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass(
        'focus-visible:ring-[var(--button-focus-ring-secondary)]'
      );
    });
  });

  describe('Form Integration Tests', () => {
    it('button with type="submit" submits parent form', async () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      const user = userEvent.setup();

      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit</Button>
        </form>
      );

      await user.click(screen.getByRole('button'));
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('disabled button does not submit form', async () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      const user = userEvent.setup();

      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit" disabled>
            Submit
          </Button>
        </form>
      );

      await user.click(screen.getByRole('button'));
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('button with type="button" does not submit form', async () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      const user = userEvent.setup();

      render(
        <form onSubmit={handleSubmit}>
          <Button type="button">Cancel</Button>
        </form>
      );

      await user.click(screen.getByRole('button'));
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('merges custom className', () => {
      render(<Button className="custom-class mt-4">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class', 'mt-4');
    });

    it('handles very long text content', () => {
      const longText = 'A'.repeat(100);
      render(<Button>{longText}</Button>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('loading state transition', () => {
      const { rerender } = render(<Button>Submit</Button>);
      const button = screen.getByRole('button');

      expect(button).not.toBeDisabled();
      expect(button).not.toHaveAttribute('aria-busy');

      rerender(<Button loading>Submit</Button>);
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
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
      render(<Button leftIcon={Plus} />);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Button: Icon-only buttons require an aria-label for accessibility'
      );
    });

    it('icon-only button with aria-label does not warn', () => {
      render(<Button leftIcon={Plus} aria-label="Add item" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('has accessible name from children', () => {
      render(<Button>Click me</Button>);
      expect(
        screen.getByRole('button', { name: 'Click me' })
      ).toBeInTheDocument();
    });

    it('has accessible name from aria-label', () => {
      render(<Button leftIcon={Gear} aria-label="Settings" />);
      expect(
        screen.getByRole('button', { name: 'Settings' })
      ).toBeInTheDocument();
    });
  });
});
