import { type ComponentType, forwardRef } from 'react';
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Icon size variants mapped to pixel/rem values:
 * - `xs`: 12px (0.75rem) - Inline icons, badges
 * - `sm`: 16px (1rem) - Small buttons, form inputs
 * - `md`: 20px (1.25rem) - Default, buttons, navigation
 * - `lg`: 24px (1.5rem) - Headers, feature icons
 * - `xl`: 32px (2rem) - Hero sections, large features
 */
const iconVariants = cva('inline-flex shrink-0', {
  variants: {
    size: {
      xs: 'size-3', // 12px
      sm: 'size-4', // 16px
      md: 'size-5', // 20px
      lg: 'size-6', // 24px
      xl: 'size-8', // 32px
    },
    color: {
      default: 'text-text-primary',
      muted: 'text-text-secondary',
      primary: 'text-primary',
      secondary: 'text-secondary',
      destructive: 'text-destructive',
      success: 'text-success',
      warning: 'text-warning',
      info: 'text-info',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
  },
});

/**
 * Icon weight types matching Phosphor Icons weights
 */
export type IconWeight =
  | 'thin'
  | 'light'
  | 'regular'
  | 'bold'
  | 'fill'
  | 'duotone';

/**
 * Size mappings for numeric pixel values (used by Phosphor's size prop)
 */
const sizeMap: Record<NonNullable<IconVariants['size']>, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export type IconVariants = VariantProps<typeof iconVariants>;

export interface IconProps extends IconVariants {
  /**
   * The Phosphor icon component to render
   */
  icon: ComponentType<PhosphorIconProps>;
  /**
   * Icon weight variant
   * @default 'regular'
   */
  weight?: IconWeight;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Accessible label for the icon (required when icon conveys meaning)
   * When provided, sets aria-label and role="img"
   */
  'aria-label'?: string;
  /**
   * Whether the icon is purely decorative
   * @default true (when aria-label is not provided)
   */
  'aria-hidden'?: boolean;
}

/**
 * Icon - A wrapper component for Phosphor Icons with standardized sizes and variants.
 *
 * Provides consistent sizing and styling across the application while maintaining
 * full flexibility of Phosphor Icons.
 *
 * @example
 * ```tsx
 * import { Icon } from '@/ui/icons';
 * import { House, User, Bell } from '@phosphor-icons/react';
 *
 * // Basic usage
 * <Icon icon={House} />
 *
 * // With size and weight
 * <Icon icon={User} size="lg" weight="bold" />
 *
 * // With color variant
 * <Icon icon={Bell} color="primary" />
 *
 * // With accessibility label (for meaningful icons)
 * <Icon icon={Bell} aria-label="Notifications" />
 * ```
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      icon: IconComponent,
      size = 'md',
      weight = 'regular',
      color,
      className,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      ...props
    },
    ref
  ) => {
    // Determine accessibility props
    const hasLabel = Boolean(ariaLabel);
    const accessibilityProps = hasLabel
      ? { 'aria-label': ariaLabel, role: 'img' as const }
      : { 'aria-hidden': ariaHidden ?? true };

    return (
      <IconComponent
        ref={ref}
        size={sizeMap[size ?? 'md']}
        weight={weight}
        className={cn(iconVariants({ size, color }), className)}
        {...accessibilityProps}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

export { iconVariants };
