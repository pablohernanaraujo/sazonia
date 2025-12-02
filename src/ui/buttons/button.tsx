import {
  type ComponentPropsWithoutRef,
  type ComponentType,
  forwardRef,
  type ReactNode,
} from 'react';
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';
import { CircleNotch } from '@phosphor-icons/react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

/**
 * Button variant styles using Class Variance Authority (CVA).
 *
 * Implements all variants from the Glow UI Figma design:
 * - Styles: filled, outline, tinted, plain
 * - Colors: primary, secondary, danger
 * - Sizes: sm, md, lg
 *
 * Uses CSS custom properties from the 3-layer token architecture:
 * - Core tokens: Raw values (colors, spacing, radius)
 * - Semantic tokens: Intent-based mappings (brand, danger, surface)
 * - Component tokens: Button-specific tokens (--button-*)
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-[var(--button-gap)]',
    'cursor-pointer',
    'font-medium',
    'rounded-[var(--button-border-radius)]',
    'transition-colors duration-150',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-[var(--button-disabled-opacity)]',
  ],
  {
    variants: {
      variant: {
        filled: '',
        outline: 'border bg-transparent',
        tinted: '',
        plain: 'bg-transparent',
      },
      color: {
        primary: '',
        secondary: '',
        danger: '',
      },
      size: {
        sm: 'h-[var(--button-height-sm)] px-[var(--button-padding-x-sm)] py-[var(--button-padding-y-sm)] text-sm',
        md: 'h-[var(--button-height-md)] px-[var(--button-padding-x-md)] py-[var(--button-padding-y-md)] text-base',
        lg: 'h-[var(--button-height-lg)] px-[var(--button-padding-x-lg)] py-[var(--button-padding-y-lg)] text-base',
      },
    },
    compoundVariants: [
      // Filled + Primary
      {
        variant: 'filled',
        color: 'primary',
        className:
          'bg-[var(--button-filled-primary-bg)] text-[var(--button-filled-primary-text)] hover:bg-[var(--button-filled-primary-bg-hover)] active:bg-[var(--button-filled-primary-bg-active)]',
      },
      // Filled + Secondary
      {
        variant: 'filled',
        color: 'secondary',
        className:
          'bg-[var(--button-filled-secondary-bg)] text-[var(--button-filled-secondary-text)] hover:bg-[var(--button-filled-secondary-bg-hover)] active:bg-[var(--button-filled-secondary-bg-active)]',
      },
      // Filled + Danger
      {
        variant: 'filled',
        color: 'danger',
        className:
          'bg-[var(--button-filled-danger-bg)] text-[var(--button-filled-danger-text)] hover:bg-[var(--button-filled-danger-bg-hover)] active:bg-[var(--button-filled-danger-bg-active)]',
      },
      // Outline + Primary
      {
        variant: 'outline',
        color: 'primary',
        className:
          'border-[var(--button-outline-primary-border)] text-[var(--button-outline-primary-text)] hover:bg-[var(--button-outline-primary-bg-hover)] active:bg-[var(--button-outline-primary-bg-active)]',
      },
      // Outline + Secondary
      {
        variant: 'outline',
        color: 'secondary',
        className:
          'border-[var(--button-outline-secondary-border)] text-[var(--button-outline-secondary-text)] hover:bg-[var(--button-outline-secondary-bg-hover)] active:bg-[var(--button-outline-secondary-bg-active)]',
      },
      // Outline + Danger
      {
        variant: 'outline',
        color: 'danger',
        className:
          'border-[var(--button-outline-danger-border)] text-[var(--button-outline-danger-text)] hover:bg-[var(--button-outline-danger-bg-hover)] active:bg-[var(--button-outline-danger-bg-active)]',
      },
      // Tinted + Primary
      {
        variant: 'tinted',
        color: 'primary',
        className:
          'bg-[var(--button-tinted-primary-bg)] text-[var(--button-tinted-primary-text)] hover:bg-[var(--button-tinted-primary-bg-hover)] active:bg-[var(--button-tinted-primary-bg-active)]',
      },
      // Tinted + Secondary
      {
        variant: 'tinted',
        color: 'secondary',
        className:
          'bg-[var(--button-tinted-secondary-bg)] text-[var(--button-tinted-secondary-text)] hover:bg-[var(--button-tinted-secondary-bg-hover)] active:bg-[var(--button-tinted-secondary-bg-active)]',
      },
      // Tinted + Danger
      {
        variant: 'tinted',
        color: 'danger',
        className:
          'bg-[var(--button-tinted-danger-bg)] text-[var(--button-tinted-danger-text)] hover:bg-[var(--button-tinted-danger-bg-hover)] active:bg-[var(--button-tinted-danger-bg-active)]',
      },
      // Plain + Primary
      {
        variant: 'plain',
        color: 'primary',
        className:
          'text-[var(--button-plain-primary-text)] hover:bg-[var(--button-plain-primary-bg-hover)] active:bg-[var(--button-plain-primary-bg-active)]',
      },
      // Plain + Secondary
      {
        variant: 'plain',
        color: 'secondary',
        className:
          'text-[var(--button-plain-secondary-text)] hover:bg-[var(--button-plain-secondary-bg-hover)] active:bg-[var(--button-plain-secondary-bg-active)]',
      },
      // Plain + Danger
      {
        variant: 'plain',
        color: 'danger',
        className:
          'text-[var(--button-plain-danger-text)] hover:bg-[var(--button-plain-danger-bg-hover)] active:bg-[var(--button-plain-danger-bg-active)]',
      },
      // Focus ring colors based on color variant
      {
        color: 'primary',
        className: 'focus-visible:ring-[var(--button-focus-ring-primary)]',
      },
      {
        color: 'secondary',
        className: 'focus-visible:ring-[var(--button-focus-ring-secondary)]',
      },
      {
        color: 'danger',
        className: 'focus-visible:ring-[var(--button-focus-ring-danger)]',
      },
    ],
    defaultVariants: {
      variant: 'filled',
      color: 'primary',
      size: 'md',
    },
  }
);

/**
 * Icon size mapping to match Icon component's size variants
 */
const buttonIconSizeMap = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

type IconSize = (typeof buttonIconSizeMap)[keyof typeof buttonIconSizeMap];

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

/**
 * Props for button content rendering
 */
interface ButtonContentProps {
  loading: boolean;
  iconSize: IconSize;
  leftIcon?: ComponentType<PhosphorIconProps>;
  rightIcon?: ComponentType<PhosphorIconProps>;
  children?: ReactNode;
}

/**
 * Renders the left side icon (or spinner during loading)
 */
function LeftIconOrSpinner({
  loading,
  iconSize,
  leftIcon: LeftIcon,
}: Pick<
  ButtonContentProps,
  'loading' | 'iconSize' | 'leftIcon'
>): React.ReactElement | null {
  // Icons inherit color from button's text color via currentColor
  // We pass color={null} to prevent Icon's default color class
  if (loading) {
    return (
      <Icon
        icon={CircleNotch}
        size={iconSize}
        color={null}
        className="animate-spin"
        aria-hidden
      />
    );
  }
  if (LeftIcon) {
    return <Icon icon={LeftIcon} size={iconSize} color={null} aria-hidden />;
  }
  return null;
}

/**
 * Renders the internal content of the button (icons and text)
 */
function ButtonContent({
  loading,
  iconSize,
  leftIcon,
  rightIcon: RightIcon,
  children,
}: ButtonContentProps): React.ReactElement {
  return (
    <>
      <LeftIconOrSpinner
        loading={loading}
        iconSize={iconSize}
        leftIcon={leftIcon}
      />
      {children}
      {!loading && RightIcon && (
        <Icon icon={RightIcon} size={iconSize} color={null} aria-hidden />
      )}
    </>
  );
}

/**
 * Warns in development mode if icon-only button is missing aria-label
 */
function warnIfMissingAriaLabel(
  children: ReactNode,
  ariaLabel: string | undefined
): void {
  if (process.env.NODE_ENV !== 'production' && !children && !ariaLabel) {
    console.warn(
      'Button: Icon-only buttons require an aria-label for accessibility'
    );
  }
}

/**
 * Creates click handler that prevents clicks during loading state
 */
function createClickHandler(
  loading: boolean,
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined
): (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void {
  return (e) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e as React.MouseEvent<HTMLButtonElement>);
  };
}

/**
 * Options for computing common button props
 */
interface CommonButtonPropsOptions {
  variant: ButtonVariantProps['variant'];
  color: ButtonVariantProps['color'];
  size: ButtonVariantProps['size'];
  isIconOnly: boolean;
  loading: boolean;
  isDisabled: boolean;
  ariaLabel: string | undefined;
  className: string | undefined;
}

/**
 * Computes common props for all button render modes
 */
function getCommonButtonProps(
  options: CommonButtonPropsOptions
): Record<string, unknown> {
  const {
    variant,
    color,
    size,
    isIconOnly,
    loading,
    isDisabled,
    ariaLabel,
    className,
  } = options;

  return {
    className: cn(
      buttonVariants({ variant, color, size }),
      isIconOnly && 'aspect-square px-0',
      className
    ),
    'aria-label': ariaLabel,
    'aria-busy': loading || undefined,
    'aria-disabled': isDisabled || undefined,
  };
}

/**
 * Icon-only button props - requires aria-label for accessibility
 */
type IconOnlyButtonProps = {
  leftIcon: ComponentType<PhosphorIconProps>;
  rightIcon?: never;
  children?: never;
  'aria-label': string;
};

/**
 * Text button props - aria-label is optional when text is present
 */
type TextButtonProps = {
  leftIcon?: ComponentType<PhosphorIconProps>;
  rightIcon?: ComponentType<PhosphorIconProps>;
  children: ReactNode;
  'aria-label'?: string;
};

/**
 * Base button props using ComponentPropsWithoutRef for proper typing
 */
type BaseButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'aria-label'
> &
  ButtonVariantProps & {
    /**
     * When true, merges props onto child element (uses Radix Slot)
     */
    asChild?: boolean;
    /**
     * Shows loading spinner and disables interaction
     */
    loading?: boolean;
    /**
     * When provided, renders as Next.js Link for client-side navigation
     */
    href?: string;
    /**
     * Additional CSS classes
     */
    className?: string;
  };

export type ButtonProps = BaseButtonProps &
  (IconOnlyButtonProps | TextButtonProps);

/**
 * Button - A comprehensive button component with multiple variants.
 *
 * Implements all variants from the Glow UI Figma design:
 * - **Styles**: filled, outline, tinted, plain
 * - **Colors**: primary, secondary, danger
 * - **Sizes**: sm, md, lg
 *
 * Supports:
 * - Icon placement (left, right, or icon-only)
 * - Loading state with spinner
 * - Polymorphic rendering via `asChild`
 * - Next.js Link integration via `href`
 *
 * @example
 * ```tsx
 * import { Button } from '@/ui';
 * import { Plus, ArrowRight } from '@phosphor-icons/react';
 *
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // With variants
 * <Button variant="outline" color="danger">Delete</Button>
 *
 * // With icons
 * <Button leftIcon={Plus}>Add Item</Button>
 * <Button rightIcon={ArrowRight}>Continue</Button>
 *
 * // Icon-only (requires aria-label)
 * <Button leftIcon={Plus} aria-label="Add new item" />
 *
 * // Loading state
 * <Button loading>Processing...</Button>
 *
 * // As navigation link
 * <Button href="/dashboard">Go to Dashboard</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      color,
      size,
      asChild = false,
      loading = false,
      disabled,
      href,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      children,
      'aria-label': ariaLabel,
      onClick,
      ...props
    },
    ref
  ): React.ReactElement => {
    warnIfMissingAriaLabel(children, ariaLabel);

    const isDisabled = disabled || loading;
    const iconSize = buttonIconSizeMap[size ?? 'md'];
    const isIconOnly = Boolean(!children && LeftIcon);

    const contentProps: ButtonContentProps = {
      loading,
      iconSize,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      children,
    };

    const commonProps = getCommonButtonProps({
      variant,
      color,
      size,
      isIconOnly,
      loading,
      isDisabled,
      ariaLabel,
      className,
    });

    const handleClick = createClickHandler(loading, onClick);
    const content = <ButtonContent {...contentProps} />;

    if (asChild) {
      return (
        <Slot ref={ref} {...commonProps} {...props}>
          {children}
        </Slot>
      );
    }

    if (href && !isDisabled) {
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...commonProps}
          onClick={handleClick}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        {...commonProps}
        onClick={handleClick}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants };
