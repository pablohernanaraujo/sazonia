import {
  type ComponentPropsWithoutRef,
  type ComponentType,
  forwardRef,
} from 'react';
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';
import { CircleNotch } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

/**
 * FAB (Floating Action Button) variant styles using Class Variance Authority (CVA).
 *
 * Implements all variants from the Glow UI Figma design:
 * - Variants: filled, outline
 * - Colors: brand, gray
 * - Sizes: md (56px), sm (48px)
 */
const fabVariants = cva(
  [
    'inline-flex items-center justify-center',
    'aspect-square rounded-full',
    'cursor-pointer transition-all duration-150',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-52',
    'active:shadow-none',
  ],
  {
    variants: {
      variant: {
        filled: 'shadow-lg',
        outline: 'border bg-transparent',
      },
      size: {
        md: 'size-14 p-4', // 56px total (16px padding + 24px icon)
        sm: 'size-12 p-3', // 48px total (12px padding + 24px icon)
      },
      color: {
        brand: '',
        gray: '',
      },
    },
    compoundVariants: [
      // Filled + Brand
      {
        variant: 'filled',
        color: 'brand',
        className:
          'bg-fill-primary text-text-overlay-white hover:bg-fill-primary-hover active:bg-fill-primary-active',
      },
      // Outline + Gray
      {
        variant: 'outline',
        color: 'gray',
        className:
          'border-border text-text-subtle hover:border-border-hover hover:bg-background-secondary active:border-border-active active:bg-background-tertiary',
      },
      // Focus ring colors
      {
        color: 'brand',
        className: 'focus-visible:ring-primary',
      },
      {
        color: 'gray',
        className: 'focus-visible:ring-border',
      },
    ],
    defaultVariants: {
      variant: 'filled',
      size: 'md',
      color: 'brand',
    },
  }
);

type FabVariantProps = VariantProps<typeof fabVariants>;

/**
 * Base FAB props using ComponentPropsWithoutRef for proper typing
 */
type BaseFabProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'aria-label'
> &
  FabVariantProps & {
    /**
     * The Phosphor icon component to render
     */
    icon: ComponentType<PhosphorIconProps>;
    /**
     * Shows loading spinner and disables interaction
     */
    loading?: boolean;
    /**
     * Additional CSS classes
     */
    className?: string;
  };

export type FabProps = BaseFabProps & {
  /**
   * Accessible label for the button (required for accessibility)
   */
  'aria-label': string;
  /**
   * Children are not allowed - FAB is icon-only
   */
  children?: never;
};

/**
 * Warns in development mode if aria-label is missing
 */
function warnIfMissingAriaLabel(ariaLabel: string | undefined): void {
  if (process.env.NODE_ENV !== 'production' && !ariaLabel) {
    console.warn('Fab: aria-label is required for accessibility');
  }
}

/**
 * Fab (Floating Action Button) - A circular button for primary floating actions.
 *
 * Implements all variants from the Glow UI Figma design:
 * - **Variants**: filled (with shadow), outline (with border)
 * - **Colors**: brand (primary blue), gray (neutral)
 * - **Sizes**: md (56px), sm (48px)
 *
 * Supports:
 * - Icon-only display (no text)
 * - Loading state with spinner
 * - Disabled state
 * - Full keyboard and accessibility support
 *
 * @example
 * ```tsx
 * import { Fab } from '@/ui';
 * import { Plus, Pencil, Chat } from '@phosphor-icons/react';
 *
 * // Basic usage
 * <Fab icon={Plus} aria-label="Create new item" />
 *
 * // With variants
 * <Fab icon={Pencil} variant="outline" color="gray" aria-label="Edit" />
 *
 * // Different sizes
 * <Fab icon={Chat} size="sm" aria-label="Open chat" />
 *
 * // Loading state
 * <Fab icon={Plus} loading aria-label="Creating..." />
 *
 * // Disabled state
 * <Fab icon={Plus} disabled aria-label="Cannot create" />
 * ```
 */
export const Fab = forwardRef<HTMLButtonElement, FabProps>(
  (
    {
      icon,
      variant,
      size,
      color,
      loading = false,
      disabled,
      className,
      'aria-label': ariaLabel,
      onClick,
      ...props
    },
    ref
  ): React.ReactElement => {
    warnIfMissingAriaLabel(ariaLabel);

    const isDisabled = disabled || loading;

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
        className={cn(fabVariants({ variant, size, color }), className)}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <Icon
            icon={CircleNotch}
            size="lg"
            color={null}
            className="animate-spin"
            aria-hidden
          />
        ) : (
          <Icon icon={icon} size="lg" color={null} aria-hidden />
        )}
      </button>
    );
  }
);

Fab.displayName = 'Fab';

export { fabVariants };
