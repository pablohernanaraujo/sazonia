import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useState,
} from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon, type IconVariants } from '@/ui/icons';

/**
 * SearchInput wrapper variants for the container.
 *
 * Size variants:
 * - `sm`: Small (h-8, py-2 px-4, gap-3)
 * - `md`: Medium (h-10, py-2.5 px-4, gap-3)
 * - `lg`: Large (h-12, py-3 px-4, gap-3) - default
 *
 * Style variants:
 * - `default`: rounded-sm (6px)
 * - `circled`: rounded-full (pill-shaped)
 */
const searchInputWrapperVariants = cva(
  [
    'flex w-full items-center',
    'border bg-background',
    'transition-colors duration-150',
    // Focus-within for when input inside is focused
    'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
    // Disabled state handled via group
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-background-secondary has-[:disabled]:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 gap-3 px-4 py-2', // 32px height
        md: 'h-10 gap-3 px-4 py-2.5', // 40px height
        lg: 'h-12 gap-3 px-4 py-3', // 48px height
      },
      styleVariant: {
        default: 'rounded-sm',
        circled: 'rounded-full',
      },
      error: {
        true: 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20',
        false: 'border-border hover:border-border-hover',
      },
    },
    defaultVariants: {
      size: 'lg',
      styleVariant: 'default',
      error: false,
    },
  }
);

/**
 * SearchInput inner input element variants.
 *
 * Handles typography based on size:
 * - `sm`/`md`: 14px (text-sm), 20px line-height
 * - `lg`: 16px (text-base), 24px line-height
 */
const searchInputVariants = cva(
  [
    'w-full min-w-0 flex-1',
    'bg-transparent',
    'border-none outline-none',
    'text-text-primary',
    'placeholder:text-text-tertiary',
    'disabled:cursor-not-allowed disabled:text-text-tertiary',
    // Remove default search input styling
    '[&::-webkit-search-cancel-button]:hidden',
    '[&::-webkit-search-decoration]:hidden',
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

export type SearchInputWrapperVariants = VariantProps<
  typeof searchInputWrapperVariants
>;
export type SearchInputVariants = VariantProps<typeof searchInputVariants>;

export interface SearchInputProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'size' | 'type'
> {
  /**
   * Size variant of the search input
   * - `sm`: Small (32px height, compact)
   * - `md`: Medium (40px height)
   * - `lg`: Large (48px height) - default
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Style variant for border radius
   * - `default`: rounded-sm corners (6px)
   * - `circled`: pill-shaped, rounded-full
   * @default 'default'
   */
  styleVariant?: 'default' | 'circled';

  /**
   * Error state - applies destructive border color
   * @default false
   */
  error?: boolean;

  /**
   * Callback fired when the clear button is clicked.
   * Use this to handle clearing in controlled mode or to perform
   * additional actions when the input is cleared.
   */
  onClear?: () => void;

  /**
   * Additional CSS classes for the wrapper element
   */
  wrapperClassName?: string;
}

/**
 * SearchInput - A dedicated search field component with built-in search icon and clear button.
 *
 * Provides a styled search input optimized for search scenarios with:
 * - Built-in search icon (MagnifyingGlass)
 * - Clear button (X) when input has value
 * - Two style variants: default (rounded corners) and circled (pill-shaped)
 * - Proper search semantics (type="search", role="searchbox")
 *
 * @example
 * ```tsx
 * import { SearchInput } from '@/ui/inputs';
 *
 * // Basic usage
 * <SearchInput placeholder="Search..." />
 *
 * // Pill-shaped style
 * <SearchInput styleVariant="circled" placeholder="Search..." />
 *
 * // With size variant
 * <SearchInput size="sm" placeholder="Quick search" />
 *
 * // Controlled with clear callback
 * const [query, setQuery] = useState('');
 * <SearchInput
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   onClear={() => setQuery('')}
 *   placeholder="Search products..."
 * />
 *
 * // Uncontrolled with ref
 * const inputRef = useRef<HTMLInputElement>(null);
 * <SearchInput
 *   ref={inputRef}
 *   defaultValue="initial search"
 *   onClear={() => inputRef.current?.focus()}
 * />
 * ```
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      size = 'lg',
      styleVariant = 'default',
      error = false,
      onClear,
      wrapperClassName,
      className,
      disabled,
      value,
      defaultValue,
      onChange,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => {
    // Track internal value for uncontrolled mode to show/hide clear button
    const [internalValue, setInternalValue] = useState(
      () => (defaultValue as string) ?? ''
    );

    // Determine if controlled mode and pre-compute derived values
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const showClearButton = Boolean(currentValue) && !disabled;
    const iconSize = sizeToIconSize[size];

    // Pre-compute input props to reduce JSX complexity
    const inputProps = isControlled ? { value } : { defaultValue };
    const computedAriaInvalid = (ariaInvalid ?? error) || undefined;

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setInternalValue(e.target.value);
        }
        onChange?.(e);
      },
      [isControlled, onChange]
    );

    const handleClear = useCallback(() => {
      if (!isControlled) {
        setInternalValue('');
      }
      onClear?.();
    }, [isControlled, onClear]);

    return (
      <div
        className={cn(
          searchInputWrapperVariants({ size, styleVariant, error }),
          wrapperClassName
        )}
      >
        <Icon
          icon={MagnifyingGlass}
          size={iconSize}
          color="muted"
          aria-hidden={true}
        />
        <input
          ref={ref}
          type="search"
          role="searchbox"
          disabled={disabled}
          {...inputProps}
          onChange={handleChange}
          aria-invalid={computedAriaInvalid}
          className={cn(searchInputVariants({ size }), className)}
          {...props}
        />
        {showClearButton && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 text-text-tertiary transition-colors hover:text-text-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            aria-label="Clear search"
          >
            <Icon icon={X} size={iconSize} aria-hidden={true} />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { searchInputVariants, searchInputWrapperVariants };
