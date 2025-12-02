import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type KeyboardEvent,
} from 'react';
import { X } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';
import { TextSm, TextXs } from '@/ui/typography';

/**
 * MultiselectTag size variants:
 * - `sm`: Small (12px font, 6px horizontal padding, 2px vertical padding)
 * - `md`: Medium (14px font, 8px horizontal padding, 2px vertical padding)
 */
const multiselectTagVariants = cva(
  [
    'flex max-w-full items-center gap-1 rounded-full bg-background-tertiary transition-colors',
    'focus-within:ring-2 focus-within:ring-border-brand',
  ],
  {
    variants: {
      size: {
        sm: 'px-1.5 py-0.5', // 6px px, 2px py
        md: 'px-2 py-0.5', // 8px px, 2px py
      },
      truncate: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      truncate: false,
    },
  }
);

/**
 * MultiselectBadge size variants:
 * - `sm`: Small (4px horizontal padding, 2px vertical padding)
 * - `md`: Medium (6px horizontal padding, 2px vertical padding)
 */
const multiselectBadgeVariants = cva(
  'bg-primary-500 flex items-center rounded-sm text-white transition-colors',
  {
    variants: {
      size: {
        sm: 'px-1 py-0.5', // 4px px, 2px py
        md: 'px-1.5 py-0.5', // 6px px, 2px py
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * MultiselectContent container variants
 */
const multiselectContentVariants = cva('flex flex-wrap gap-1', {
  variants: {
    gap: {
      sm: 'gap-0.5',
      md: 'gap-1',
      lg: 'gap-1.5',
    },
  },
  defaultVariants: {
    gap: 'md',
  },
});

export type MultiselectTagVariants = VariantProps<typeof multiselectTagVariants>;
export type MultiselectBadgeVariants = VariantProps<
  typeof multiselectBadgeVariants
>;
export type MultiselectContentVariants = VariantProps<
  typeof multiselectContentVariants
>;

/**
 * Represents a single item in a multiselect
 */
export interface MultiselectItem {
  /**
   * Display label for the item
   */
  label: string;
  /**
   * Unique value identifier
   */
  value: string;
  /**
   * Whether this item is disabled
   * @default false
   */
  disabled?: boolean;
}

export interface MultiselectTagProps
  extends
    Omit<ComponentPropsWithoutRef<'div'>, 'children'>,
    MultiselectTagVariants {
  /**
   * The label text to display
   */
  label: string;
  /**
   * The value identifier for this tag
   */
  value: string;
  /**
   * Callback when the remove button is clicked
   */
  onRemove?: (value: string) => void;
  /**
   * Whether the tag is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * MultiselectTag - An individual removable tag for multiselect inputs.
 *
 * Displays a label with an X (close) icon button for removal. Used within
 * MultiselectContent or standalone for custom implementations.
 *
 * @example
 * ```tsx
 * import { MultiselectTag } from '@/ui/inputs';
 *
 * <MultiselectTag
 *   label="United States"
 *   value="us"
 *   onRemove={(value) => handleRemove(value)}
 * />
 * ```
 */
export const MultiselectTag = forwardRef<HTMLDivElement, MultiselectTagProps>(
  (
    {
      label,
      value,
      size = 'md',
      truncate = false,
      onRemove,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const LabelComponent = size === 'sm' ? TextXs : TextSm;

    const handleRemove = (): void => {
      if (!disabled && onRemove) {
        onRemove(value);
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
      if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
        event.preventDefault();
        onRemove?.(value);
      }
    };

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={true}
        aria-disabled={disabled || undefined}
        className={cn(
          multiselectTagVariants({ size, truncate }),
          disabled && 'opacity-50',
          className
        )}
        {...props}
      >
        <LabelComponent
          as="span"
          weight="medium"
          className={cn(
            'text-text-primary',
            truncate && 'truncate',
            disabled && 'text-text-tertiary'
          )}
        >
          {label}
        </LabelComponent>
        <button
          type="button"
          aria-label={`Remove ${label}`}
          disabled={disabled}
          onClick={handleRemove}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full transition-colors',
            'hover:bg-background-secondary focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:outline-none',
            disabled && 'cursor-not-allowed'
          )}
        >
          <Icon
            icon={X}
            size="sm"
            weight="light"
            className={cn('text-text-primary', disabled && 'text-text-tertiary')}
            aria-hidden
          />
        </button>
      </div>
    );
  }
);

MultiselectTag.displayName = 'MultiselectTag';

export interface MultiselectBadgeProps
  extends
    Omit<ComponentPropsWithoutRef<'div'>, 'children'>,
    MultiselectBadgeVariants {
  /**
   * The label text to display
   */
  label: string;
}

/**
 * MultiselectBadge - A non-removable badge for displaying selected values.
 *
 * Used for read-only display of selections, typically in compact views
 * or when removal is handled through other means.
 *
 * @example
 * ```tsx
 * import { MultiselectBadge } from '@/ui/inputs';
 *
 * <MultiselectBadge label="React" />
 * <MultiselectBadge label="TypeScript" size="sm" />
 * ```
 */
export const MultiselectBadge = forwardRef<HTMLDivElement, MultiselectBadgeProps>(
  ({ label, size = 'md', className, ...props }, ref) => (
    <div
      ref={ref}
      role="option"
      aria-selected={true}
      className={cn(multiselectBadgeVariants({ size }), className)}
      {...props}
    >
      <TextXs as="span" weight="medium" className="text-white">
        {label}
      </TextXs>
    </div>
  )
);

MultiselectBadge.displayName = 'MultiselectBadge';

export interface MultiselectContentProps
  extends
    Omit<ComponentPropsWithoutRef<'div'>, 'children'>,
    MultiselectContentVariants {
  /**
   * Array of selected items to display
   */
  items: MultiselectItem[];
  /**
   * Display variant
   * - `tags`: Removable tags with X icon (default)
   * - `badges`: Non-removable compact badges
   * @default 'tags'
   */
  variant?: 'tags' | 'badges';
  /**
   * Size variant for items
   * @default 'md'
   */
  size?: 'sm' | 'md';
  /**
   * Whether to truncate long labels
   * @default false
   */
  truncate?: boolean;
  /**
   * Callback when a tag is removed (only applies to 'tags' variant)
   */
  onRemove?: (value: string) => void;
  /**
   * Whether all items are disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * MultiselectContent - Container for displaying selected multiselect values.
 *
 * Renders a collection of removable tags or static badges based on the variant.
 * Supports wrapping to multiple rows when space is limited.
 *
 * @example
 * ```tsx
 * import { MultiselectContent } from '@/ui/inputs';
 *
 * // Tags variant (removable)
 * <MultiselectContent
 *   variant="tags"
 *   items={[
 *     { label: 'United States', value: 'us' },
 *     { label: 'Canada', value: 'ca' },
 *   ]}
 *   onRemove={(value) => handleRemove(value)}
 * />
 *
 * // Badges variant (read-only)
 * <MultiselectContent
 *   variant="badges"
 *   items={[
 *     { label: 'React', value: 'react' },
 *     { label: 'TypeScript', value: 'ts' },
 *   ]}
 * />
 * ```
 */
export const MultiselectContent = forwardRef<
  HTMLDivElement,
  MultiselectContentProps
>(
  (
    {
      items,
      variant = 'tags',
      size = 'md',
      truncate = false,
      gap = 'md',
      onRemove,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    if (!items || items.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="listbox"
        aria-multiselectable={true}
        className={cn(multiselectContentVariants({ gap }), className)}
        {...props}
      >
        {variant === 'tags'
          ? items.map((item) => (
              <MultiselectTag
                key={item.value}
                label={item.label}
                value={item.value}
                size={size}
                truncate={truncate}
                onRemove={onRemove}
                disabled={disabled || item.disabled}
              />
            ))
          : items.map((item) => (
              <MultiselectBadge key={item.value} label={item.label} size={size} />
            ))}
      </div>
    );
  }
);

MultiselectContent.displayName = 'MultiselectContent';

export {
  multiselectBadgeVariants,
  multiselectContentVariants,
  multiselectTagVariants,
};
