import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { Minus, Plus } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

/**
 * QuantityInputButton - A specialized button for quantity increment/decrement controls.
 *
 * **Important Design Decision:**
 * This button uses an asymmetric border pattern:
 * - `minus` type: Borders on left, top, bottom (no right border)
 * - `plus` type: Borders on right, top, bottom (no left border)
 *
 * This design allows seamless composition with a centered input field:
 * ```
 * [Minus Button][Text Input][Plus Button]
 *        ↑            ↑           ↑
 *   No right border   Full border   No left border
 * ```
 * When composed, borders align perfectly without doubling or gaps.
 *
 * @example
 * ```tsx
 * <div className="inline-flex">
 *   <QuantityInputButton type="minus" aria-label="Decrease quantity" />
 *   <input type="text" className="border-y border-l-0 border-r-0" />
 *   <QuantityInputButton type="plus" aria-label="Increase quantity" />
 * </div>
 * ```
 */

/**
 * QuantityInputButton variant styles using Class Variance Authority (CVA).
 *
 * Implements all variants from the Glow UI Figma design:
 * - Types: minus (left), plus (right)
 * - Sizes: sm (32px), md (40px), lg (48px)
 * - States: default, hover, active, focus, disabled
 */
const quantityInputButtonVariants = cva(
  [
    // Layout & cursor
    'inline-flex items-center justify-center',
    'cursor-pointer',

    // Default state colors
    'border border-border',
    'bg-background',
    'text-text-tertiary',

    // Transition
    'transition-colors duration-150',

    // Hover state
    'hover:bg-background-secondary',
    'hover:border-border-hover',
    'hover:text-text-subtle',

    // Active state
    'active:bg-background-tertiary',
    'active:text-text-subtle',

    // Focus state
    'focus-visible:ring-2 focus-visible:ring-primary',
    'focus-visible:ring-offset-2 focus-visible:outline-none',

    // Disabled state
    'disabled:border-border-disabled disabled:bg-background',
    'disabled:text-text-secondary disabled:opacity-52',
    'disabled:pointer-events-none',
  ],
  {
    variants: {
      type: {
        minus: 'rounded-l-sm border-t border-r-0 border-b border-l',
        plus: 'rounded-r-sm border-t border-r border-b border-l-0',
      },
      size: {
        sm: 'h-8 px-2.5 py-2 text-sm',
        md: 'h-10 px-3 py-2.5 text-base',
        lg: 'h-12 px-4 py-3.5 text-base',
      },
    },
    defaultVariants: {
      size: 'lg',
      // NOTE: No default for 'type' - must be explicitly specified
    },
  }
);

/**
 * Icon size mapping based on button size
 * - SM: 16px (Icon size "sm")
 * - MD: 20px (Icon size "md")
 * - LG: 20px (Icon size "md") - Note: LG uses same icon size as MD per design
 */
const iconSizeMap = {
  sm: 'sm',
  md: 'md',
  lg: 'md',
} as const;

type IconSize = (typeof iconSizeMap)[keyof typeof iconSizeMap];

/**
 * Warns in development mode if aria-label is missing
 */
function warnIfMissingAriaLabel(ariaLabel: string | undefined): void {
  if (process.env.NODE_ENV !== 'production' && !ariaLabel) {
    console.warn(
      'QuantityInputButton: Icon-only buttons require an aria-label for screen reader accessibility. ' +
        'Example: <QuantityInputButton type="plus" aria-label="Increase quantity" />'
    );
  }
}

/**
 * Base props for QuantityInputButton
 */
type BaseQuantityInputButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'type' | 'aria-label'
> &
  Omit<VariantProps<typeof quantityInputButtonVariants>, 'type'> & {
    /** Required: Button type determines icon (Plus/Minus) and border radius position */
    type: 'minus' | 'plus';
    /** Required for accessibility: Describes the button action for screen readers */
    'aria-label': string;
    /** Additional CSS classes */
    className?: string;
  };

export type QuantityInputButtonProps = BaseQuantityInputButtonProps;

/**
 * QuantityInputButton - An atomic button component for quantity controls.
 *
 * Designed specifically for quantity increment/decrement scenarios such as:
 * - Shopping cart quantity adjusters
 * - Inline quantity selectors
 * - Custom composed number inputs
 *
 * Implements all variants from the Glow UI Figma design:
 * - **Types**: minus (left-positioned), plus (right-positioned)
 * - **Sizes**: sm (32px), md (40px), lg (48px)
 * - **States**: default, hover, active, focus, disabled
 *
 * @example
 * ```tsx
 * import { QuantityInputButton } from '@/ui/inputs';
 *
 * // Basic usage
 * <QuantityInputButton type="minus" aria-label="Decrease quantity" />
 * <QuantityInputButton type="plus" aria-label="Increase quantity" />
 *
 * // With size variants
 * <QuantityInputButton type="plus" size="sm" aria-label="Add" />
 *
 * // Disabled state
 * <QuantityInputButton type="minus" disabled aria-label="Cannot decrease" />
 *
 * // Composed with input
 * <div className="inline-flex">
 *   <QuantityInputButton type="minus" aria-label="Decrease" onClick={handleDecrease} />
 *   <input type="text" value={quantity} className="border-y w-12 text-center" />
 *   <QuantityInputButton type="plus" aria-label="Increase" onClick={handleIncrease} />
 * </div>
 * ```
 */
export const QuantityInputButton = forwardRef<
  HTMLButtonElement,
  QuantityInputButtonProps
>(
  (
    { type, size, disabled, className, 'aria-label': ariaLabel, ...props },
    ref
  ): React.ReactElement => {
    warnIfMissingAriaLabel(ariaLabel);

    const iconSize: IconSize = iconSizeMap[size ?? 'lg'];
    const IconComponent = type === 'plus' ? Plus : Minus;

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(quantityInputButtonVariants({ type, size }), className)}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        {...props}
      >
        <Icon icon={IconComponent} size={iconSize} color={null} aria-hidden />
      </button>
    );
  }
);

QuantityInputButton.displayName = 'QuantityInputButton';

export { quantityInputButtonVariants };
