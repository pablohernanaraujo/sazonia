import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react';
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react';
import { Check } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon, type IconVariants } from '@/ui/icons';
import { TextSm, TextXs } from '@/ui/typography';

/**
 * DropmenuItem size variants:
 * - `sm`: Small (14px font, 6px vertical padding, 12px horizontal padding, 10px gap)
 * - `md`: Medium (14px font, 10px vertical padding, 12px horizontal padding, 12px gap)
 * - `lg`: Large (16px font, 12px vertical padding, 16px horizontal padding, 12px gap)
 *
 * With caption, vertical padding is reduced:
 * - SM: 4px, MD: 6px, LG: 6px
 */
const dropmenuItemVariants = cva(
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
      selected: {
        true: 'border-info-500 bg-info-50 border-l-[3px]',
        false: '',
      },
      hasCaption: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Caption reduces vertical padding
      { size: 'sm', hasCaption: true, className: 'py-1' },
      { size: 'md', hasCaption: true, className: 'py-1.5' },
      { size: 'lg', hasCaption: true, className: 'py-1.5' },
      // Selected + hovered = darker background
      { selected: true, visualState: 'hovered', className: 'bg-info-100' },
    ],
    defaultVariants: {
      size: 'lg',
      visualState: 'default',
      selected: false,
      hasCaption: false,
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

/**
 * Maps size variant to checkbox size class
 */
const sizeToCheckboxSize: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'size-4', // 16px
  md: 'size-4', // 16px
  lg: 'size-5', // 20px
};

type ResolvedSize = 'sm' | 'md' | 'lg';
type CaptionComponentType = typeof TextSm | typeof TextXs;

/**
 * Gets the caption component based on size
 */
const getCaptionComponent = (size: ResolvedSize): CaptionComponentType =>
  size === 'lg' ? TextSm : TextXs;

/**
 * Gets the checkbox background class based on state
 */
const getCheckboxBackgroundClass = (
  selected: boolean,
  disabled: boolean
): string => {
  if (selected) {
    return disabled ? 'bg-info-300' : 'bg-info-500';
  }
  return disabled
    ? 'border border-border bg-background-tertiary'
    : 'border border-border bg-background';
};

/**
 * Gets text color class based on disabled state
 */
const getTextColorClass = (
  disabled: boolean,
  variant: 'primary' | 'secondary'
): string => {
  if (disabled) return 'text-text-tertiary';
  return variant === 'primary' ? 'text-text-primary' : 'text-text-secondary';
};

/**
 * Internal checkbox indicator component
 */
interface CheckboxIndicatorProps {
  selected: boolean;
  disabled: boolean;
  checkboxSize: string;
  resolvedSize: ResolvedSize;
}

const CheckboxIndicator = ({
  selected,
  disabled,
  checkboxSize,
  resolvedSize,
}: CheckboxIndicatorProps): ReactNode => {
  const checkIconSize = resolvedSize === 'lg' ? 'size-3.5' : 'size-3';

  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-sm transition-colors',
        checkboxSize,
        getCheckboxBackgroundClass(selected, disabled)
      )}
    >
      {selected && (
        <Check weight="bold" className={cn(checkIconSize, 'text-white')} />
      )}
    </span>
  );
};

/**
 * Internal left add-on slot component
 */
interface LeftAddOnSlotProps {
  leftAddOn?: ReactNode;
  LeftIcon?: React.ComponentType<PhosphorIconProps>;
  iconSize: NonNullable<IconVariants['size']>;
  disabled: boolean;
}

const LeftAddOnSlot = ({
  leftAddOn,
  LeftIcon,
  iconSize,
  disabled,
}: LeftAddOnSlotProps): ReactNode => {
  if (leftAddOn) return leftAddOn;
  if (!LeftIcon) return null;

  return (
    <Icon
      icon={LeftIcon}
      size={iconSize}
      className={getTextColorClass(disabled, 'primary')}
      aria-hidden
    />
  );
};

/**
 * Internal right add-on slot component
 */
interface RightAddOnSlotProps {
  rightAddOn?: ReactNode;
  rightText?: string;
  disabled: boolean;
  CaptionComponent: CaptionComponentType;
}

const RightAddOnSlot = ({
  rightAddOn,
  rightText,
  disabled,
  CaptionComponent,
}: RightAddOnSlotProps): ReactNode => {
  if (rightAddOn) return rightAddOn;

  return (
    <CaptionComponent
      as="span"
      color="muted"
      className={cn('ml-auto shrink-0', disabled && 'text-text-tertiary')}
    >
      {rightText}
    </CaptionComponent>
  );
};

/**
 * Internal main content component (label + caption)
 */
interface MainContentProps {
  label: string;
  caption?: string;
  disabled: boolean;
  CaptionComponent: CaptionComponentType;
}

const MainContent = ({
  label,
  caption,
  disabled,
  CaptionComponent,
}: MainContentProps): ReactNode => (
  <div className="flex min-w-0 flex-1 flex-col">
    <span
      className={cn('truncate font-sans', getTextColorClass(disabled, 'primary'))}
    >
      {label}
    </span>
    {caption && (
      <CaptionComponent
        as="span"
        className={cn('truncate', getTextColorClass(disabled, 'secondary'))}
      >
        {caption}
      </CaptionComponent>
    )}
  </div>
);

/**
 * Gets aria-checked value for checkbox mode
 */
const getAriaChecked = (
  showCheckbox: boolean,
  selected: boolean
): boolean | undefined => (showCheckbox ? selected : undefined);

export type DropmenuItemVariants = VariantProps<typeof dropmenuItemVariants>;

export interface DropmenuItemProps
  extends
    Omit<ComponentPropsWithoutRef<'div'>, 'children'>,
    Omit<DropmenuItemVariants, 'hasCaption'> {
  /**
   * The option label text
   */
  label: string;
  /**
   * Whether this item is selected
   * @default false
   */
  selected?: boolean;
  /**
   * Whether to show a checkbox (for multi-select)
   * @default false
   */
  showCheckbox?: boolean;
  /**
   * Optional caption text below the label
   */
  caption?: string;
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
 * DropmenuItem - A selectable menu item element for input-related dropdown menus.
 *
 * Unlike DropmenuOption (for action menus), this component supports:
 * - Selection states with visual indication (blue left border, brand background)
 * - Optional checkbox for multi-select scenarios
 * - Caption text for additional context
 * - Left and right add-ons (icons, text)
 *
 * Designed for use within Select, Combobox, and Autocomplete components.
 *
 * @example
 * ```tsx
 * import { DropmenuItem } from '@/ui/inputs';
 * import { Flag, User, FolderSimple } from '@phosphor-icons/react';
 *
 * // Basic usage
 * <DropmenuItem label="United States" />
 *
 * // Selected state
 * <DropmenuItem label="United States" selected />
 *
 * // With checkbox (multi-select)
 * <DropmenuItem label="Option 1" showCheckbox selected />
 *
 * // With caption
 * <DropmenuItem
 *   label="React"
 *   caption="JavaScript library for building user interfaces"
 * />
 *
 * // With left icon
 * <DropmenuItem
 *   label="Documents"
 *   showLeftAddOn
 *   leftIcon={FolderSimple}
 * />
 *
 * // Full example
 * <DropmenuItem
 *   label="John Doe"
 *   caption="john@example.com"
 *   showLeftAddOn
 *   leftIcon={User}
 *   showCheckbox
 *   selected
 * />
 * ```
 */
export const DropmenuItem = forwardRef<HTMLDivElement, DropmenuItemProps>(
  (
    {
      size = 'lg',
      visualState = 'default',
      selected = false,
      label,
      showCheckbox = false,
      caption,
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
    const CaptionComponent = getCaptionComponent(resolvedSize);

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={selected}
        aria-disabled={disabled || undefined}
        aria-checked={getAriaChecked(showCheckbox, selected)}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          dropmenuItemVariants({
            size,
            visualState,
            selected,
            hasCaption: Boolean(caption),
          }),
          disabled && 'pointer-events-none text-text-tertiary',
          className
        )}
        {...props}
      >
        {showCheckbox && (
          <CheckboxIndicator
            selected={selected}
            disabled={disabled}
            checkboxSize={sizeToCheckboxSize[resolvedSize]}
            resolvedSize={resolvedSize}
          />
        )}
        {showLeftAddOn && (
          <LeftAddOnSlot
            leftAddOn={leftAddOn}
            LeftIcon={LeftIcon}
            iconSize={sizeToIconSize[resolvedSize]}
            disabled={disabled}
          />
        )}
        <MainContent
          label={label}
          caption={caption}
          disabled={disabled}
          CaptionComponent={CaptionComponent}
        />
        {showRightAddOn && (
          <RightAddOnSlot
            rightAddOn={rightAddOn}
            rightText={rightText}
            disabled={disabled}
            CaptionComponent={CaptionComponent}
          />
        )}
      </div>
    );
  }
);

DropmenuItem.displayName = 'DropmenuItem';

export { dropmenuItemVariants };
