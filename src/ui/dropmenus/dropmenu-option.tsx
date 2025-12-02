import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react';
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon, type IconVariants } from '@/ui/icons';
import { TextMd, TextSm } from '@/ui/typography';

/**
 * DropmenuOption size variants:
 * - `sm`: Small (14px font, 6px vertical padding, 12px horizontal padding, 10px gap)
 * - `md`: Medium (14px font, 10px vertical padding, 12px horizontal padding, 12px gap)
 * - `lg`: Large (16px font, 12px vertical padding, 16px horizontal padding, 12px gap)
 */
const dropmenuOptionVariants = cva(
  [
    'flex w-full cursor-pointer items-center rounded-sm transition-colors duration-150',
    'hover:bg-background-secondary active:bg-background-tertiary',
    'focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:outline-none',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2.5 px-3 py-1.5 text-sm leading-5', // 10px gap, 12px px, 6px py, 14px/20px font
        md: 'gap-3 px-3 py-2.5 text-sm leading-5', // 12px gap, 12px px, 10px py, 14px/20px font
        lg: 'gap-3 px-4 py-3 text-base leading-6', // 12px gap, 16px px, 12px py, 16px/24px font
      },
      visualState: {
        default: '',
        hovered: 'bg-background-secondary',
        pressed: 'bg-background-tertiary',
        focus: 'ring-2 ring-border-brand ring-offset-2',
      },
    },
    defaultVariants: {
      size: 'lg',
      visualState: 'default',
    },
  }
);

/**
 * Maps size variant to Icon size
 */
const sizeToIconSize: Record<
  'sm' | 'md' | 'lg',
  NonNullable<IconVariants['size']>
> = {
  sm: 'sm', // 16px
  md: 'sm', // 16px
  lg: 'md', // 20px
};

export type DropmenuOptionVariants = VariantProps<typeof dropmenuOptionVariants>;

export interface DropmenuOptionProps
  extends
    Omit<ComponentPropsWithoutRef<'div'>, 'children'>,
    DropmenuOptionVariants {
  /**
   * The option label text
   */
  label: string;
  /**
   * Whether to show the left add-on slot
   * @default false
   */
  showLeftAddOn?: boolean;
  /**
   * Whether to show the right add-on slot
   * @default false
   */
  showRightAddOn?: boolean;
  /**
   * Custom left add-on React node (overrides leftIcon)
   */
  leftAddOn?: ReactNode;
  /**
   * Custom right add-on React node (overrides rightText)
   */
  rightAddOn?: ReactNode;
  /**
   * Left icon component (from @phosphor-icons/react)
   * Used when showLeftAddOn is true and no custom leftAddOn is provided
   */
  leftIcon?: React.ComponentType<PhosphorIconProps>;
  /**
   * Right text content
   * Used when showRightAddOn is true and no custom rightAddOn is provided
   */
  rightText?: string;
  /**
   * Whether the option is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * DropmenuOption - A menu item element for dropdown menus.
 *
 * Displays an option label with optional left and right add-ons (icons or text).
 * Provides visual feedback for interactive states (default, hovered, pressed, focus, disabled)
 * and supports three size variants (SM, MD, LG).
 *
 * @example
 * ```tsx
 * import { DropmenuOption } from '@/ui/dropmenus';
 * import { Pencil, Trash, Copy } from '@phosphor-icons/react';
 *
 * // Basic usage
 * <DropmenuOption label="Edit" />
 *
 * // With left icon
 * <DropmenuOption
 *   label="Edit"
 *   showLeftAddOn
 *   leftIcon={Pencil}
 * />
 *
 * // With right text (shortcut)
 * <DropmenuOption
 *   label="Copy"
 *   showRightAddOn
 *   rightText="⌘C"
 * />
 *
 * // With both add-ons
 * <DropmenuOption
 *   label="Delete"
 *   showLeftAddOn
 *   leftIcon={Trash}
 *   showRightAddOn
 *   rightText="⌫"
 * />
 *
 * // Disabled state
 * <DropmenuOption label="Unavailable" disabled />
 * ```
 */
/**
 * Renders the left add-on slot content
 */
function renderLeftAddOn(
  showLeftAddOn: boolean,
  leftAddOn: ReactNode,
  LeftIcon: React.ComponentType<PhosphorIconProps> | undefined,
  iconSize: NonNullable<IconVariants['size']>,
  disabled: boolean
): ReactNode {
  if (!showLeftAddOn) return null;
  if (leftAddOn) return leftAddOn;
  if (!LeftIcon) return null;

  return (
    <Icon
      icon={LeftIcon}
      size={iconSize}
      className={disabled ? 'text-text-tertiary' : 'text-text-primary'}
      aria-hidden
    />
  );
}

/**
 * Renders the right add-on slot content
 */
function renderRightAddOn(
  showRightAddOn: boolean,
  rightAddOn: ReactNode,
  rightText: string | undefined,
  TextComponent: typeof TextMd | typeof TextSm,
  disabled: boolean
): ReactNode {
  if (!showRightAddOn) return null;
  if (rightAddOn) return rightAddOn;

  return (
    <TextComponent
      as="span"
      color="muted"
      className={cn('ml-auto shrink-0', disabled && 'text-text-tertiary')}
    >
      {rightText}
    </TextComponent>
  );
}

export const DropmenuOption = forwardRef<HTMLDivElement, DropmenuOptionProps>(
  (
    {
      size = 'lg',
      visualState = 'default',
      label,
      showLeftAddOn = false,
      showRightAddOn = false,
      leftAddOn,
      rightAddOn,
      leftIcon: LeftIcon,
      rightText,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const resolvedSize = size ?? 'lg';
    const iconSize = sizeToIconSize[resolvedSize];
    const TextComponent = resolvedSize === 'lg' ? TextMd : TextSm;

    return (
      <div
        ref={ref}
        role="menuitem"
        aria-disabled={disabled || undefined}
        className={cn(
          dropmenuOptionVariants({ size, visualState }),
          disabled && 'pointer-events-none text-text-tertiary',
          className
        )}
        {...props}
      >
        {renderLeftAddOn(showLeftAddOn, leftAddOn, LeftIcon, iconSize, disabled)}

        <span
          className={cn(
            'flex-1 truncate font-sans',
            disabled ? 'text-text-tertiary' : 'text-text-primary'
          )}
        >
          {label}
        </span>

        {renderRightAddOn(
          showRightAddOn,
          rightAddOn,
          rightText,
          TextComponent,
          disabled
        )}
      </div>
    );
  }
);

DropmenuOption.displayName = 'DropmenuOption';

export { dropmenuOptionVariants };
