import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { SpinnerGapIcon } from '@phosphor-icons/react/dist/csr/SpinnerGap';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';
import {
  AppleLogo,
  FacebookLogo,
  GitHubLogo,
  GoogleLogo,
  MicrosoftLogo,
  TwitterLogo,
} from '@/ui/icons/brand-logos';

/**
 * Social OAuth provider types
 */
export type SocialProvider =
  | 'google'
  | 'apple'
  | 'facebook'
  | 'twitter'
  | 'github'
  | 'microsoft';

/**
 * Provider display names for button text
 */
export const providerNames: Record<SocialProvider, string> = {
  google: 'Google',
  apple: 'Apple',
  facebook: 'Facebook',
  twitter: 'Twitter',
  github: 'GitHub',
  microsoft: 'Microsoft',
};

/**
 * Provider logo components mapping
 */
const providerLogos = {
  google: GoogleLogo,
  apple: AppleLogo,
  facebook: FacebookLogo,
  twitter: TwitterLogo,
  github: GitHubLogo,
  microsoft: MicrosoftLogo,
} as const;

/**
 * ButtonSocial variant styles using CVA
 */
const buttonSocialVariants = cva(
  [
    'inline-flex items-center justify-center gap-2.5',
    'text-base leading-6 font-medium',
    'rounded-sm',
    'cursor-pointer',
    'transition-all duration-150',
    'focus-visible:outline-none',
    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-52',
  ],
  {
    variants: {
      variant: {
        filled: '',
        outline:
          'border-border-primary border bg-white text-text-primary hover:border-border-hover hover:bg-fill-secondary',
      },
      iconOnly: {
        true: 'p-3',
        false: 'w-[280px] px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'filled',
      iconOnly: false,
    },
  }
);

/**
 * Provider-specific filled variant styles
 */
const providerFilledStyles: Record<SocialProvider, string> = {
  google: 'bg-[#4285f4] text-white hover:bg-[#3367d6]',
  apple: 'bg-[#11181c] text-white hover:bg-[#000000]',
  facebook: 'bg-[#1877f2] text-white hover:bg-[#166fe5]',
  twitter: 'bg-[#1da1f2] text-white hover:bg-[#1a91da]',
  github: 'bg-[#11181c] text-white hover:bg-[#000000]',
  microsoft: 'bg-[#11181c] text-white hover:bg-[#000000]',
};

type ButtonSocialVariantProps = VariantProps<typeof buttonSocialVariants>;

/**
 * Base props for ButtonSocial
 */
type BaseButtonSocialProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children'
> &
  ButtonSocialVariantProps & {
    /**
     * The OAuth provider for branding
     */
    provider: SocialProvider;
    /**
     * Shows loading spinner and disables interaction
     */
    loading?: boolean;
  };

/**
 * Props for icon-only variant (requires aria-label)
 */
type IconOnlyButtonSocialProps = BaseButtonSocialProps & {
  iconOnly: true;
  'aria-label': string;
};

/**
 * Props for full button variant (aria-label optional)
 */
type FullButtonSocialProps = BaseButtonSocialProps & {
  iconOnly?: false;
  'aria-label'?: string;
};

export type ButtonSocialProps = IconOnlyButtonSocialProps | FullButtonSocialProps;

/**
 * ButtonSocial - A specialized authentication button for OAuth providers.
 *
 * Provides pre-styled buttons for popular OAuth providers including Google,
 * Apple, Facebook, Twitter, GitHub, and Microsoft. Each provider has branded
 * styling with support for both filled and outline variants.
 *
 * @example
 * ```tsx
 * import { ButtonSocial } from '@/ui';
 *
 * // Basic usage with filled style
 * <ButtonSocial provider="google" />
 *
 * // Outline variant
 * <ButtonSocial provider="apple" variant="outline" />
 *
 * // Icon-only (requires aria-label)
 * <ButtonSocial provider="github" iconOnly aria-label="Sign in with GitHub" />
 *
 * // With click handler
 * <ButtonSocial provider="facebook" onClick={handleSignIn} />
 *
 * // Loading state
 * <ButtonSocial provider="microsoft" loading />
 * ```
 */
export const ButtonSocial = forwardRef<HTMLButtonElement, ButtonSocialProps>(
  (
    {
      provider,
      variant = 'filled',
      iconOnly = false,
      loading = false,
      disabled,
      className,
      onClick,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ): React.ReactElement => {
    // Development warning for missing aria-label on icon-only buttons
    if (process.env.NODE_ENV === 'development' && iconOnly && !ariaLabel) {
      console.warn(
        `ButtonSocial: Icon-only button for "${provider}" requires an aria-label for accessibility`
      );
    }

    const isDisabled = disabled || loading;
    const LogoComponent = providerLogos[provider];
    const providerName = providerNames[provider];

    // Icon sizes: 20px with text, 24px icon-only
    const iconSize = iconOnly ? 24 : 20;

    // Handle click - prevent during loading
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
      if (loading) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        className={cn(
          buttonSocialVariants({ variant, iconOnly }),
          variant === 'filled' && providerFilledStyles[provider],
          className
        )}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <Icon
            icon={SpinnerGapIcon}
            size={iconOnly ? 'lg' : 'md'}
            color={null}
            className="animate-spin"
            aria-hidden
          />
        ) : (
          <LogoComponent width={iconSize} height={iconSize} />
        )}
        {!iconOnly && <span>Continue with {providerName}</span>}
      </button>
    );
  }
);

ButtonSocial.displayName = 'ButtonSocial';

export { buttonSocialVariants };
