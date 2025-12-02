import {
  type ComponentPropsWithoutRef,
  type ComponentType,
  forwardRef,
  type ReactNode,
} from 'react';
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

/**
 * ButtonGroupItem variant styles using Class Variance Authority (CVA).
 *
 * Implements all variants from the Glow UI Figma design:
 * - Sizes: sm (32px), md (40px), lg (48px)
 * - Positions: first, middle, last (controls border radius)
 * - States: default, hover, focus, active, selected, disabled
 *
 * CRITICAL: Border radius is ONLY applied via position variants, NOT in base styles.
 */
const buttonGroupItemVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'cursor-pointer',
    'font-medium',
    'border border-border',
    'bg-background',
    'text-text-tertiary',
    'transition-colors duration-150',
    'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-background disabled:text-text-secondary disabled:opacity-52',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-3 py-2 text-sm',
        md: 'h-10 px-3.5 py-2.5 text-base',
        lg: 'h-12 px-4 py-3 text-base',
      },
      position: {
        first: 'rounded-l-sm',
        middle: '',
        last: 'rounded-r-sm',
        only: 'rounded-sm',
      },
      selected: {
        true: 'bg-fill-tertiary text-text-subtle',
        false: '',
      },
    },
    compoundVariants: [
      // Hover states (not selected)
      {
        selected: false,
        className: 'hover:border-border-hover hover:text-text-subtle',
      },
    ],
    defaultVariants: {
      size: 'md',
      position: 'middle',
      selected: false,
    },
  }
);

/**
 * Icon size mapping to match Icon component's size variants
 */
const buttonGroupItemIconSizeMap = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

type IconSize =
  (typeof buttonGroupItemIconSizeMap)[keyof typeof buttonGroupItemIconSizeMap];

type ButtonGroupItemVariantProps = VariantProps<typeof buttonGroupItemVariants>;

/**
 * Renders an icon with proper size and color inheritance
 */
function renderIcon(
  IconComponent: ComponentType<PhosphorIconProps> | undefined,
  size: IconSize
): React.ReactElement | null {
  if (!IconComponent) return null;
  // Pass color={null} to allow icons to inherit button text color via currentColor
  return <Icon icon={IconComponent} size={size} color={null} aria-hidden />;
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
      'ButtonGroupItem: Icon-only buttons require an aria-label for accessibility'
    );
  }
}

/**
 * Icon-only button props - requires aria-label for accessibility
 */
type IconOnlyProps = {
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
type BaseButtonGroupItemProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'aria-label'
> &
  ButtonGroupItemVariantProps & {
    /**
     * Additional CSS classes
     */
    className?: string;
  };

export type ButtonGroupItemProps = BaseButtonGroupItemProps &
  (IconOnlyProps | TextButtonProps);

/**
 * ButtonGroupItem - An individual interactive element for use within a ButtonGroup.
 *
 * Represents a single selectable option in a segmented control pattern,
 * commonly used for toggling between views, filtering options, or
 * selecting mutually exclusive choices.
 *
 * Implements all variants from the Glow UI Figma design:
 * - **Sizes**: sm (32px), md (40px), lg (48px)
 * - **Positions**: first, middle, last (controls border radius)
 * - **States**: default, hover, focus, active, selected, disabled
 *
 * Supports:
 * - Icon placement (left, right, or icon-only)
 * - Selected state with `aria-pressed`
 * - Position-aware border radius for grouped buttons
 *
 * @example
 * ```tsx
 * import { ButtonGroupItem } from '@/ui';
 * import { List, GridFour } from '@phosphor-icons/react';
 *
 * // Basic usage in a group
 * <div className="inline-flex">
 *   <ButtonGroupItem position="first" selected>List</ButtonGroupItem>
 *   <ButtonGroupItem position="middle" className="-ml-px">Cards</ButtonGroupItem>
 *   <ButtonGroupItem position="last" className="-ml-px">Grid</ButtonGroupItem>
 * </div>
 *
 * // With icons
 * <ButtonGroupItem leftIcon={List} position="first">List View</ButtonGroupItem>
 *
 * // Icon-only (requires aria-label)
 * <ButtonGroupItem leftIcon={GridFour} aria-label="Grid view" position="last" />
 * ```
 */
export const ButtonGroupItem = forwardRef<
  HTMLButtonElement,
  ButtonGroupItemProps
>(
  (
    {
      className,
      size,
      position,
      selected,
      disabled,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      children,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ): React.ReactElement => {
    warnIfMissingAriaLabel(children, ariaLabel);

    const iconSize = buttonGroupItemIconSizeMap[size ?? 'md'];
    const isIconOnly = Boolean(!children && LeftIcon);

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          buttonGroupItemVariants({ size, position, selected }),
          isIconOnly && 'aspect-square px-0',
          className
        )}
        aria-label={ariaLabel}
        aria-pressed={selected ?? undefined}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {renderIcon(LeftIcon, iconSize)}
        {children}
        {renderIcon(RightIcon, iconSize)}
      </button>
    );
  }
);

ButtonGroupItem.displayName = 'ButtonGroupItem';

export { buttonGroupItemVariants };
