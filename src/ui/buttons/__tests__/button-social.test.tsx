import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ButtonSocial,
  providerNames,
  type SocialProvider,
} from '../button-social';

const providers: SocialProvider[] = [
  'google',
  'apple',
  'facebook',
  'twitter',
  'github',
  'microsoft',
];

describe('ButtonSocial', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<ButtonSocial provider="google" />);
      const button = screen.getByRole('button', {
        name: 'Continue with Google',
      });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('renders correct text for each provider', () => {
      for (const provider of providers) {
        const { unmount } = render(<ButtonSocial provider={provider} />);
        expect(
          screen.getByText(`Continue with ${providerNames[provider]}`)
        ).toBeInTheDocument();
        unmount();
      }
    });

    it('renders provider logo', () => {
      render(<ButtonSocial provider="google" />);
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Provider Tests', () => {
    for (const provider of providers) {
      it(`renders ${provider} provider with correct logo and branding`, () => {
        const { container } = render(<ButtonSocial provider={provider} />);
        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
        expect(button?.querySelector('svg')).toBeInTheDocument();
        expect(
          screen.getByText(`Continue with ${providerNames[provider]}`)
        ).toBeInTheDocument();
      });
    }
  });

  describe('Variant Tests', () => {
    it('applies filled variant with provider brand colors', () => {
      render(<ButtonSocial provider="google" variant="filled" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-[#4285f4]');
      expect(button).toHaveClass('text-white');
    });

    it('applies outline variant classes', () => {
      render(<ButtonSocial provider="google" variant="outline" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border');
      expect(button).toHaveClass('bg-white');
      expect(button).toHaveClass('border-border-primary');
    });

    it('applies correct colors for each provider in filled variant', () => {
      const providerColors: Record<SocialProvider, string> = {
        google: 'bg-[#4285f4]',
        apple: 'bg-[#11181c]',
        facebook: 'bg-[#1877f2]',
        twitter: 'bg-[#1da1f2]',
        github: 'bg-[#11181c]',
        microsoft: 'bg-[#11181c]',
      };

      for (const provider of providers) {
        const { unmount } = render(
          <ButtonSocial provider={provider} variant="filled" />
        );
        expect(screen.getByRole('button')).toHaveClass(providerColors[provider]);
        unmount();
      }
    });
  });

  describe('Icon Only Tests', () => {
    it('renders icon-only button without text', () => {
      render(
        <ButtonSocial
          provider="google"
          iconOnly
          aria-label="Sign in with Google"
        />
      );
      const button = screen.getByRole('button', {
        name: 'Sign in with Google',
      });
      expect(button).toBeInTheDocument();
      expect(button.querySelector('svg')).toBeInTheDocument();
      expect(screen.queryByText('Continue with Google')).not.toBeInTheDocument();
    });

    it('icon-only button has correct padding', () => {
      render(
        <ButtonSocial
          provider="google"
          iconOnly
          aria-label="Sign in with Google"
        />
      );
      expect(screen.getByRole('button')).toHaveClass('p-3');
    });
  });

  describe('State Tests', () => {
    it('applies disabled state correctly', () => {
      render(<ButtonSocial provider="google" disabled />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('shows spinner during loading state', () => {
      render(<ButtonSocial provider="google" loading />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('click handlers fire correctly', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<ButtonSocial provider="google" onClick={handleClick} />);
      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('click handlers do not fire when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<ButtonSocial provider="google" onClick={handleClick} disabled />);
      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('click handlers do not fire during loading state', () => {
      const handleClick = vi.fn();

      render(<ButtonSocial provider="google" onClick={handleClick} loading />);
      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Ref Forwarding Tests', () => {
    it('forwards ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<ButtonSocial provider="google" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.tagName).toBe('BUTTON');
    });
  });

  describe('className Merging Tests', () => {
    it('merges custom className with variant classes', () => {
      const { container } = render(
        <ButtonSocial provider="google" className="custom-class" />
      );
      const button = container.querySelector('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('inline-flex');
    });

    it('allows width override via className', () => {
      render(<ButtonSocial provider="google" className="w-full" />);
      expect(screen.getByRole('button')).toHaveClass('w-full');
    });
  });

  describe('Focus Management Tests', () => {
    it('receives focus on tab navigation', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <input data-testid="input" />
          <ButtonSocial provider="google" />
        </div>
      );

      await user.tab();
      await user.tab();

      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('has focus-visible ring classes', () => {
      render(<ButtonSocial provider="google" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-2');
      expect(button).toHaveClass('focus-visible:ring-offset-2');
    });
  });

  describe('Keyboard Interaction Tests', () => {
    it('triggers click on Enter key press', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<ButtonSocial provider="google" onClick={handleClick} />);
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('triggers click on Space key press', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<ButtonSocial provider="google" onClick={handleClick} />);
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
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
      // Note: This test verifies the warning behavior when NODE_ENV === 'development'
      // In vitest, NODE_ENV is 'test' by default, so we need to temporarily override it
      vi.stubEnv('NODE_ENV', 'development');

      // @ts-expect-error Testing missing aria-label scenario
      render(<ButtonSocial provider="google" iconOnly />);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'ButtonSocial: Icon-only button for "google" requires an aria-label for accessibility'
      );

      vi.unstubAllEnvs();
    });

    it('icon-only button with aria-label does not warn', () => {
      render(
        <ButtonSocial
          provider="google"
          iconOnly
          aria-label="Sign in with Google"
        />
      );
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('has accessible name from text content', () => {
      render(<ButtonSocial provider="google" />);
      expect(
        screen.getByRole('button', { name: 'Continue with Google' })
      ).toBeInTheDocument();
    });

    it('has accessible name from aria-label', () => {
      render(
        <ButtonSocial
          provider="github"
          iconOnly
          aria-label="Sign in with GitHub"
        />
      );
      expect(
        screen.getByRole('button', { name: 'Sign in with GitHub' })
      ).toBeInTheDocument();
    });

    it('sets aria-busy during loading', () => {
      render(<ButtonSocial provider="google" loading />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('sets aria-disabled when disabled', () => {
      render(<ButtonSocial provider="google" disabled />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('loading state transition', () => {
      const { rerender } = render(<ButtonSocial provider="google" />);
      const button = screen.getByRole('button');

      expect(button).not.toBeDisabled();
      expect(button).not.toHaveAttribute('aria-busy');

      rerender(<ButtonSocial provider="google" loading />);
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('maintains button width in full mode', () => {
      render(<ButtonSocial provider="google" />);
      expect(screen.getByRole('button')).toHaveClass('w-[280px]');
    });

    it('icon-only does not have fixed width', () => {
      render(
        <ButtonSocial
          provider="google"
          iconOnly
          aria-label="Sign in with Google"
        />
      );
      expect(screen.getByRole('button')).not.toHaveClass('w-[280px]');
    });
  });
});
