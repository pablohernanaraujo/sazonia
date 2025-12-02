'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CaretDown, X } from '@phosphor-icons/react';
import * as Popover from '@radix-ui/react-popover';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

import {
  ComboboxProvider,
  type ComboboxSize,
  useComboboxContext,
  useComboboxSize,
} from './combobox-context';

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * ComboboxTrigger wrapper variants for the container that holds the input and icons.
 *
 * Size variants:
 * - `sm`: Small (32px height, py-1.5 px-3)
 * - `md`: Medium (40px height, py-2.5 px-3.5)
 * - `lg`: Large (48px height, py-3 px-4) - default
 *
 * Style variants:
 * - `bordered`: With border (default)
 * - `borderless`: Without border
 */
const comboboxTriggerVariants = cva(
  [
    'flex w-full items-center',
    'rounded-sm',
    'bg-background',
    'transition-colors duration-150',
    'focus-within:ring-2 focus-within:ring-primary/20',
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-background-secondary',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 gap-2 px-3 py-1.5',
        md: 'h-10 gap-2.5 px-3.5 py-2.5',
        lg: 'h-12 gap-3 px-4 py-3',
      },
      variant: {
        bordered: 'border',
        borderless: '',
      },
      error: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Bordered + no error
      {
        variant: 'bordered',
        error: false,
        className:
          'border-border focus-within:border-primary hover:border-border-hover',
      },
      // Bordered + error
      {
        variant: 'bordered',
        error: true,
        className:
          'border-destructive focus-within:border-destructive focus-within:ring-destructive/20 hover:border-destructive',
      },
    ],
    defaultVariants: {
      size: 'lg',
      variant: 'bordered',
      error: false,
    },
  }
);

/**
 * ComboboxInput text variants for value/placeholder sizing.
 */
const comboboxInputVariants = cva(
  [
    'w-full min-w-0 flex-1',
    'bg-transparent',
    'border-none outline-none',
    'text-text-primary',
    'placeholder:text-text-tertiary',
    'disabled:cursor-not-allowed disabled:text-text-tertiary',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm leading-5',
        md: 'text-sm leading-5',
        lg: 'text-base leading-6',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

/**
 * ComboboxContent container variants mirroring Select content styling.
 */
const comboboxContentVariants = cva(
  [
    'overflow-hidden rounded-sm border border-border-secondary bg-background shadow-lg',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  ],
  {
    variants: {
      size: {
        sm: 'max-h-[240px]',
        md: 'max-h-[288px]',
        lg: 'max-h-[344px]',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

/**
 * ComboboxItem variants matching Select/DropmenuItem styling.
 */
const comboboxItemVariants = cva(
  [
    'relative flex w-full cursor-pointer items-center rounded-sm transition-colors duration-150 select-none',
    'outline-none',
    'hover:bg-background-secondary',
    'focus:bg-background-secondary',
    'data-[disabled]:pointer-events-none data-[disabled]:text-text-tertiary',
    'data-[highlighted]:bg-background-secondary',
    'data-[state=checked]:border-info-500 data-[state=checked]:bg-info-50 data-[state=checked]:border-l-[3px]',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2.5 px-3 py-1.5 text-sm leading-5',
        md: 'gap-3 px-3 py-2.5 text-sm leading-5',
        lg: 'gap-3 px-4 py-3 text-base leading-6',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

export type ComboboxTriggerVariants = VariantProps<
  typeof comboboxTriggerVariants
>;
export type ComboboxInputVariants = VariantProps<typeof comboboxInputVariants>;
export type ComboboxContentVariants = VariantProps<
  typeof comboboxContentVariants
>;
export type ComboboxItemVariants = VariantProps<typeof comboboxItemVariants>;

// ============================================================================
// Option Type
// ============================================================================

export interface ComboboxOption {
  /** The value of the option (used for selection) */
  value: string;
  /** The display label for the option */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
}

// ============================================================================
// Combobox Root
// ============================================================================

export interface ComboboxProps {
  /**
   * Size variant for all Combobox components
   * @default 'lg'
   */
  size?: ComboboxSize;
  /**
   * The controlled value of the combobox
   */
  value?: string;
  /**
   * The default value for uncontrolled mode
   */
  defaultValue?: string;
  /**
   * Callback when the value changes
   */
  onValueChange?: (value: string) => void;
  /**
   * The controlled open state
   */
  open?: boolean;
  /**
   * The default open state for uncontrolled mode
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Callback when the open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Callback when the search query changes (for async filtering)
   */
  onQueryChange?: (query: string) => void;
  /**
   * Whether the combobox is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the combobox has an error
   * @default false
   */
  error?: boolean;
  /**
   * Children elements
   */
  children: ReactNode;
}

/**
 * Combobox - Root component that provides context for the combobox dropdown.
 *
 * @example
 * ```tsx
 * <Combobox size="lg">
 *   <ComboboxTrigger>
 *     <ComboboxInput placeholder="Search..." />
 *   </ComboboxTrigger>
 *   <ComboboxContent>
 *     <ComboboxItem value="option1">Option 1</ComboboxItem>
 *     <ComboboxItem value="option2">Option 2</ComboboxItem>
 *     <ComboboxEmpty>No results found</ComboboxEmpty>
 *   </ComboboxContent>
 * </Combobox>
 * ```
 */
export function Combobox({
  size = 'lg',
  value: valueProp,
  defaultValue = '',
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onQueryChange,
  disabled = false,
  error = false,
  children,
}: ComboboxProps): React.ReactElement {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const [query, setQueryInternal] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Handle query changes with optional callback
  const setQuery = useCallback(
    (newQuery: string) => {
      setQueryInternal(newQuery);
      onQueryChange?.(newQuery);
    },
    [onQueryChange]
  );

  // Handle opening/closing with disabled check and reset highlighted index
  const handleSetOpen = useCallback(
    (newOpen: boolean) => {
      if (disabled) return;
      setOpen(newOpen);
      // Reset highlighted index when closing
      if (!newOpen) {
        setHighlightedIndex(-1);
      }
    },
    [disabled, setOpen]
  );

  return (
    <Popover.Root open={open} onOpenChange={handleSetOpen}>
      <ComboboxProvider
        size={size}
        open={open ?? false}
        setOpen={handleSetOpen}
        value={value ?? ''}
        onValueChange={setValue}
        query={query}
        setQuery={setQuery}
        highlightedIndex={highlightedIndex}
        setHighlightedIndex={setHighlightedIndex}
        disabled={disabled}
        error={error}
      >
        {children}
      </ComboboxProvider>
    </Popover.Root>
  );
}

Combobox.displayName = 'Combobox';

// ============================================================================
// ComboboxTrigger
// ============================================================================

export interface ComboboxTriggerProps
  extends
    Omit<ComponentPropsWithoutRef<'div'>, 'children'>,
    Omit<ComboboxTriggerVariants, 'size' | 'error'> {
  /**
   * Size variant (overrides context if provided)
   */
  size?: ComboboxSize;
  /**
   * Content to render on the left side (prefix)
   */
  leftAddOn?: ReactNode;
  /**
   * Whether to show the clear button when a value is selected
   * @default true
   */
  showClear?: boolean;
  /**
   * Callback when the clear button is clicked
   */
  onClear?: () => void;
  /**
   * Children elements (typically ComboboxInput)
   */
  children?: ReactNode;
}

/**
 * ComboboxTrigger - The wrapper that contains the input and icons.
 */
export const ComboboxTrigger = forwardRef<HTMLDivElement, ComboboxTriggerProps>(
  (
    {
      size: propSize,
      variant = 'bordered',
      leftAddOn,
      showClear = true,
      onClear,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const contextSize = useComboboxSize();
    const { value, onValueChange, setQuery, setOpen, disabled, error } =
      useComboboxContext();
    const size = propSize ?? contextSize;
    const iconSize = size === 'lg' ? 'md' : 'sm';

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onValueChange('');
        setQuery('');
        onClear?.();
      },
      [onValueChange, setQuery, onClear]
    );

    const hasValue = value !== '';

    return (
      <Popover.Anchor asChild>
        <div
          ref={ref}
          className={cn(
            comboboxTriggerVariants({ size, variant, error }),
            className
          )}
          onClick={() => !disabled && setOpen(true)}
          {...props}
        >
          {leftAddOn && (
            <span className="flex-shrink-0 text-text-tertiary">{leftAddOn}</span>
          )}
          <span className="flex min-w-0 flex-1">{children}</span>
          {showClear && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 text-text-tertiary hover:text-text-secondary"
              aria-label="Clear selection"
            >
              <Icon icon={X} size={iconSize} aria-hidden />
            </button>
          )}
          <Icon
            icon={CaretDown}
            size={iconSize}
            className="flex-shrink-0 text-text-tertiary"
            aria-hidden
          />
        </div>
      </Popover.Anchor>
    );
  }
);

ComboboxTrigger.displayName = 'ComboboxTrigger';

// ============================================================================
// ComboboxInput
// ============================================================================

export interface ComboboxInputProps
  extends
    Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'value' | 'onChange'>,
    Omit<ComboboxInputVariants, 'size'> {
  /**
   * Size variant (overrides context if provided)
   */
  size?: ComboboxSize;
  /**
   * Options array for filtering (used for keyboard navigation)
   */
  options?: ComboboxOption[];
  /**
   * Filtered options (if providing custom filtering)
   */
  filteredOptions?: ComboboxOption[];
}

/**
 * ComboboxInput - The actual input element for the combobox.
 */
export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  (
    { size: propSize, options = [], filteredOptions, className, ...props },
    ref
  ) => {
    const contextSize = useComboboxSize();
    const inputRef = useRef<HTMLInputElement>(null);
    const {
      value,
      onValueChange,
      query,
      setQuery,
      open,
      setOpen,
      highlightedIndex,
      setHighlightedIndex,
      disabled,
    } = useComboboxContext();
    const size = propSize ?? contextSize;
    const generatedId = useId();

    // Get the display label for the current value
    const selectedOption = useMemo(
      () => options.find((opt) => opt.value === value),
      [options, value]
    );

    // Use filtered options if provided, otherwise use all options
    const activeOptions = filteredOptions ?? options;
    const enabledOptions = useMemo(
      () => activeOptions.filter((opt) => !opt.disabled),
      [activeOptions]
    );

    // Handle input value - show query when typing, else show selected label
    const inputValue = open ? query : (selectedOption?.label ?? '');

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setHighlightedIndex(0);
        if (!open) {
          setOpen(true);
        }
      },
      [setQuery, setHighlightedIndex, open, setOpen]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            if (!open) {
              setOpen(true);
            } else {
              setHighlightedIndex(
                Math.min(highlightedIndex + 1, enabledOptions.length - 1)
              );
            }
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (open) {
              setHighlightedIndex(Math.max(highlightedIndex - 1, 0));
            }
            break;
          case 'Enter':
            e.preventDefault();
            if (
              open &&
              highlightedIndex >= 0 &&
              enabledOptions[highlightedIndex]
            ) {
              onValueChange(enabledOptions[highlightedIndex].value);
              setQuery('');
              setOpen(false);
            }
            break;
          case 'Escape':
            e.preventDefault();
            setQuery('');
            setOpen(false);
            break;
          case 'Tab':
            setOpen(false);
            break;
        }
      },
      [
        open,
        setOpen,
        highlightedIndex,
        setHighlightedIndex,
        enabledOptions,
        onValueChange,
        setQuery,
      ]
    );

    const handleFocus = useCallback(() => {
      if (!disabled) {
        setOpen(true);
        // Clear query to show all options when focusing
        if (selectedOption) {
          setQuery('');
        }
      }
    }, [disabled, setOpen, setQuery, selectedOption]);

    // Merge refs
    const mergeRefs = useCallback(
      (node: HTMLInputElement | null) => {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
          node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    return (
      <input
        ref={mergeRefs}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${generatedId}-listbox`}
        aria-activedescendant={
          highlightedIndex >= 0
            ? `${generatedId}-option-${highlightedIndex}`
            : undefined
        }
        aria-autocomplete="list"
        disabled={disabled}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        className={cn(comboboxInputVariants({ size }), className)}
        {...props}
      />
    );
  }
);

ComboboxInput.displayName = 'ComboboxInput';

// ============================================================================
// ComboboxContent
// ============================================================================

export interface ComboboxContentProps extends Omit<
  ComboboxContentVariants,
  'size'
> {
  /**
   * Size variant (overrides context if provided)
   */
  size?: ComboboxSize;
  /**
   * Distance in pixels from the trigger
   * @default 4
   */
  sideOffset?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Children elements (ComboboxItem components)
   */
  children: ReactNode;
}

/**
 * ComboboxContent - The dropdown content container.
 */
export const ComboboxContent = forwardRef<HTMLDivElement, ComboboxContentProps>(
  ({ size: propSize, className, children, sideOffset = 4 }, ref) => {
    const contextSize = useComboboxSize();
    const size = propSize ?? contextSize;
    const generatedId = useId();

    return (
      <Popover.Portal>
        <Popover.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            comboboxContentVariants({ size }),
            'w-[var(--radix-popover-trigger-width)] min-w-[var(--radix-popover-trigger-width)]',
            className
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div
            id={`${generatedId}-listbox`}
            role="listbox"
            className={cn(
              'overflow-y-auto p-1',
              // Custom scrollbar styling
              '[&::-webkit-scrollbar]:w-3',
              '[&::-webkit-scrollbar-track]:bg-transparent',
              '[&::-webkit-scrollbar-thumb]:rounded',
              '[&::-webkit-scrollbar-thumb]:bg-background-tertiary',
              '[&::-webkit-scrollbar-thumb]:border-4',
              '[&::-webkit-scrollbar-thumb]:border-transparent',
              '[&::-webkit-scrollbar-thumb]:bg-clip-padding'
            )}
          >
            {children}
          </div>
        </Popover.Content>
      </Popover.Portal>
    );
  }
);

ComboboxContent.displayName = 'ComboboxContent';

// ============================================================================
// ComboboxItem
// ============================================================================

export interface ComboboxItemProps
  extends
    Omit<ComponentPropsWithoutRef<'div'>, 'children'>,
    Omit<ComboboxItemVariants, 'size'> {
  /**
   * Size variant (overrides context if provided)
   */
  size?: ComboboxSize;
  /**
   * The value of this option
   */
  value: string;
  /**
   * Whether this option is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * The index of this item (for keyboard navigation highlighting)
   */
  index?: number;
  /**
   * Children elements (the option label)
   */
  children: ReactNode;
}

/**
 * ComboboxItem - An individual selectable option.
 */
export const ComboboxItem = forwardRef<HTMLDivElement, ComboboxItemProps>(
  (
    {
      size: propSize,
      value: itemValue,
      disabled = false,
      index,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const contextSize = useComboboxSize();
    const {
      value,
      onValueChange,
      setQuery,
      setOpen,
      highlightedIndex,
      setHighlightedIndex,
    } = useComboboxContext();
    const size = propSize ?? contextSize;
    const generatedId = useId();

    const isSelected = value === itemValue;
    const isHighlighted = index !== undefined && index === highlightedIndex;

    const handleSelect = useCallback(() => {
      if (disabled) return;
      onValueChange(itemValue);
      setQuery('');
      setOpen(false);
    }, [disabled, onValueChange, itemValue, setQuery, setOpen]);

    const handleMouseEnter = useCallback(() => {
      if (index !== undefined && !disabled) {
        setHighlightedIndex(index);
      }
    }, [index, disabled, setHighlightedIndex]);

    return (
      <div
        ref={ref}
        id={`${generatedId}-option-${index}`}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        data-state={isSelected ? 'checked' : 'unchecked'}
        data-disabled={disabled || undefined}
        data-highlighted={isHighlighted || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={handleSelect}
        onMouseEnter={handleMouseEnter}
        className={cn(comboboxItemVariants({ size }), className)}
        {...props}
      >
        <span className="flex-1 truncate text-text-primary">{children}</span>
      </div>
    );
  }
);

ComboboxItem.displayName = 'ComboboxItem';

// ============================================================================
// ComboboxEmpty
// ============================================================================

export interface ComboboxEmptyProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Children elements (the empty message)
   */
  children?: ReactNode;
}

/**
 * ComboboxEmpty - Message displayed when no options match the filter.
 */
export const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  ({ className, children = 'No results found', ...props }, ref) => {
    const size = useComboboxSize();

    return (
      <div
        ref={ref}
        className={cn(
          'py-3 text-center text-text-tertiary',
          size === 'lg' ? 'text-base' : 'text-sm',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ComboboxEmpty.displayName = 'ComboboxEmpty';

// ============================================================================
// Exports
// ============================================================================

export {
  comboboxContentVariants,
  comboboxInputVariants,
  comboboxItemVariants,
  comboboxTriggerVariants,
};
