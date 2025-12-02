import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon, type IconVariants } from '@/ui/icons';

/**
 * InputDropmenuSearch wrapper variants for the container.
 *
 * Size variants:
 * - `sm`: Small (py-2 px-3, 10px gap)
 * - `md`: Medium (py-2 px-3, 12px gap)
 * - `lg`: Large (py-3 px-4, 12px gap) - default
 */
const inputDropmenuSearchWrapperVariants = cva(
  [
    // Base styles
    'flex w-full items-center',
    'border-b border-border-secondary',
    'bg-transparent',
    'transition-colors duration-150',
    'focus-within:border-primary',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2.5 px-3 py-2', // 10px gap, 12px px, 8px py
        md: 'gap-3 px-3 py-2', // 12px gap, 12px px, 8px py
        lg: 'gap-3 px-4 py-3', // 12px gap, 16px px, 12px py
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

/**
 * InputDropmenuSearch input element variants.
 *
 * Handles typography based on size:
 * - `sm`/`md`: 14px (text-sm), 20px line-height
 * - `lg`: 16px (text-base), 24px line-height
 */
const inputDropmenuSearchInputVariants = cva(
  [
    'w-full min-w-0 flex-1',
    'bg-transparent',
    'border-none outline-none',
    'text-text-primary',
    'placeholder:text-text-tertiary',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm leading-5', // 14px/20px
        md: 'text-sm leading-5', // 14px/20px
        lg: 'text-base leading-6', // 16px/24px
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

/**
 * Maps size variant to Icon size
 * All sizes use 16px icon per Figma design
 */
const sizeToIconSize: Record<
  'sm' | 'md' | 'lg',
  NonNullable<IconVariants['size']>
> = {
  sm: 'sm', // 16px
  md: 'sm', // 16px
  lg: 'sm', // 16px
};

export type InputDropmenuSearchWrapperVariants = VariantProps<
  typeof inputDropmenuSearchWrapperVariants
>;
export type InputDropmenuSearchInputVariants = VariantProps<
  typeof inputDropmenuSearchInputVariants
>;

export interface InputDropmenuSearchProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'size'
> {
  /**
   * Size variant of the search input
   * @default 'lg'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether to show the search icon
   * @default true
   */
  showIcon?: boolean;

  /**
   * Additional CSS classes for the wrapper element
   */
  wrapperClassName?: string;
}

/**
 * InputDropmenuSearch - A specialized search input for dropdown menus.
 *
 * A minimal, borderless search field optimized for dropdown contexts with
 * a search icon and subtle bottom border. Designed to integrate seamlessly
 * into dropdown menus, comboboxes, and autocomplete components.
 *
 * This is a **standalone molecule** - it does NOT extend TextInput because:
 * - Different context: Optimized for dropdown menus, not general forms
 * - Simpler styling: Only bottom border, no full border or error states
 * - Reduced feature set: No left/right add-ons, no error states
 *
 * @example
 * ```tsx
 * import { InputDropmenuSearch } from '@/ui/inputs';
 *
 * // Basic usage
 * <InputDropmenuSearch placeholder="Search..." />
 *
 * // With size variant
 * <InputDropmenuSearch size="sm" placeholder="Search options" />
 *
 * // Without icon
 * <InputDropmenuSearch showIcon={false} placeholder="Filter..." />
 *
 * // Controlled
 * <InputDropmenuSearch
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   placeholder="Search..."
 * />
 *
 * // With accessibility label
 * <InputDropmenuSearch
 *   placeholder="Search countries..."
 *   aria-label="Search countries"
 * />
 * ```
 */
export const InputDropmenuSearch = forwardRef<
  HTMLInputElement,
  InputDropmenuSearchProps
>(
  (
    { size = 'lg', showIcon = true, wrapperClassName, className, ...props },
    ref
  ) => {
    const iconSize = sizeToIconSize[size];

    return (
      <div
        className={cn(
          inputDropmenuSearchWrapperVariants({ size }),
          wrapperClassName
        )}
      >
        {showIcon && (
          <Icon
            icon={MagnifyingGlass}
            size={iconSize}
            color="muted"
            aria-hidden={true}
          />
        )}
        <input
          ref={ref}
          type="search"
          role="searchbox"
          className={cn(inputDropmenuSearchInputVariants({ size }), className)}
          {...props}
        />
      </div>
    );
  }
);

InputDropmenuSearch.displayName = 'InputDropmenuSearch';

export { inputDropmenuSearchInputVariants, inputDropmenuSearchWrapperVariants };
