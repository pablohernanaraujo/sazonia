'use client';

import {
  ChangeEvent,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  createContext,
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  ReactElement,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  CaretDown,
  Check,
  MagnifyingGlass,
  X,
} from '@phosphor-icons/react/dist/ssr';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';
import { TextSm, TextXs } from '@/ui/typography';

// ============================================================================
// Types
// ============================================================================

export type MultiselectSize = 'sm' | 'md' | 'lg';

export interface MultiselectOption {
  /**
   * The value of the option (used for selection)
   */
  value: string;
  /**
   * The display label for the option
   */
  label: string;
  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
}

// ============================================================================
// Context
// ============================================================================

interface MultiselectContextValue {
  size: MultiselectSize;
  value: string[];
  onValueChange: (value: string[]) => void;
  disabled: boolean;
  options: MultiselectOption[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleOption: (optionValue: string) => void;
  removeOption: (optionValue: string) => void;
  clearAll: () => void;
}

const MultiselectContext = createContext<MultiselectContextValue | null>(null);

function useMultiselectContext(): MultiselectContextValue {
  const context = useContext(MultiselectContext);
  if (!context) {
    throw new Error(
      'Multiselect compound components must be used within a Multiselect'
    );
  }
  return context;
}

/**
 * Hook to get size from context for compound components
 */
export function useMultiselectSize(): MultiselectSize {
  const context = useContext(MultiselectContext);
  return context?.size ?? 'lg';
}

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * MultiselectTrigger wrapper variants for the button that opens the dropdown.
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
const multiselectTriggerVariants = cva(
  [
    'flex w-full items-center justify-between',
    'rounded-sm',
    'bg-background',
    'transition-colors duration-150',
    'focus:ring-2 focus:ring-primary/20 focus:outline-none',
    'disabled:cursor-not-allowed disabled:bg-background-secondary disabled:text-text-tertiary',
  ],
  {
    variants: {
      size: {
        sm: 'min-h-8 gap-2 px-3 py-1.5',
        md: 'min-h-10 gap-2.5 px-3.5 py-2',
        lg: 'min-h-12 gap-3 px-4 py-2.5',
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
        className: 'border-border hover:border-border-hover focus:border-primary',
      },
      // Bordered + error
      {
        variant: 'bordered',
        error: true,
        className:
          'border-destructive hover:border-destructive focus:border-destructive focus:ring-destructive/20',
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
 * MultiselectPopoverContent container variants.
 */
const multiselectPopoverContentVariants = cva(
  [
    'flex flex-col overflow-hidden rounded-sm border border-border-secondary bg-background shadow-lg',
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
 * MultiselectOption item variants matching DropmenuItem styling.
 */
const multiselectOptionVariants = cva(
  [
    'relative flex w-full cursor-pointer items-center rounded-sm transition-colors duration-150 select-none',
    'outline-none',
    'hover:bg-background-secondary',
    'focus:bg-background-secondary',
    'data-[disabled]:pointer-events-none data-[disabled]:text-text-tertiary',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2.5 px-3 py-1.5 text-sm leading-5',
        md: 'gap-3 px-3 py-2.5 text-sm leading-5',
        lg: 'gap-3 px-4 py-3 text-base leading-6',
      },
      selected: {
        true: 'border-info-500 bg-info-50 border-l-[3px]',
        false: '',
      },
    },
    defaultVariants: {
      size: 'lg',
      selected: false,
    },
  }
);

/**
 * Tag size variants for selected items display.
 */
const multiselectSelectedTagVariants = cva(
  [
    'flex max-w-full items-center gap-1 rounded-full bg-background-tertiary transition-colors',
    'focus-within:ring-2 focus-within:ring-border-brand',
  ],
  {
    variants: {
      size: {
        sm: 'px-1.5 py-0.5',
        md: 'px-2 py-0.5',
        lg: 'px-2 py-0.5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Checkbox size variants
 */
const sizeToCheckboxSize: Record<MultiselectSize, string> = {
  sm: 'size-4',
  md: 'size-4',
  lg: 'size-5',
};

export type MultiselectTriggerVariants = VariantProps<
  typeof multiselectTriggerVariants
>;
export type MultiselectPopoverContentVariants = VariantProps<
  typeof multiselectPopoverContentVariants
>;
export type MultiselectOptionVariants = VariantProps<
  typeof multiselectOptionVariants
>;

// ============================================================================
// Multiselect Root
// ============================================================================

export interface MultiselectProps {
  /**
   * Size variant for all Multiselect components
   * @default 'lg'
   */
  size?: MultiselectSize;
  /**
   * Array of available options
   */
  options: MultiselectOption[];
  /**
   * Currently selected values (controlled)
   */
  value?: string[];
  /**
   * Default selected values (uncontrolled)
   */
  defaultValue?: string[];
  /**
   * Callback when selection changes
   */
  onValueChange?: (value: string[]) => void;
  /**
   * Whether the multiselect is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the dropdown is open (controlled)
   */
  open?: boolean;
  /**
   * Default open state (uncontrolled)
   */
  defaultOpen?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Children elements
   */
  children: ReactNode;
}

/**
 * Multiselect - Root component that provides context for the multiselect dropdown.
 *
 * @example
 * ```tsx
 * <Multiselect
 *   size="lg"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' },
 *   ]}
 *   value={selected}
 *   onValueChange={setSelected}
 * >
 *   <MultiselectTrigger>
 *     <MultiselectValue placeholder="Select countries" />
 *   </MultiselectTrigger>
 *   <MultiselectPopoverContent>
 *     <MultiselectSearch placeholder="Search..." />
 *     <MultiselectOptions />
 *   </MultiselectPopoverContent>
 * </Multiselect>
 * ```
 */
export function Multiselect({
  size = 'lg',
  options,
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  disabled = false,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: MultiselectProps): ReactElement {
  // State management
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [searchQuery, setSearchQuery] = useState('');

  // Determine if controlled
  const isValueControlled = controlledValue !== undefined;
  const isOpenControlled = controlledOpen !== undefined;

  const value = isValueControlled ? controlledValue : internalValue;
  const open = isOpenControlled ? controlledOpen : internalOpen;

  const handleValueChange = useCallback(
    (newValue: string[]) => {
      if (!isValueControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isValueControlled, onValueChange]
  );

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!isOpenControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
      // Clear search when closing
      if (!newOpen) {
        setSearchQuery('');
      }
    },
    [isOpenControlled, onOpenChange]
  );

  const toggleOption = useCallback(
    (optionValue: string) => {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      handleValueChange(newValue);
    },
    [value, handleValueChange]
  );

  const removeOption = useCallback(
    (optionValue: string) => {
      handleValueChange(value.filter((v) => v !== optionValue));
    },
    [value, handleValueChange]
  );

  const clearAll = useCallback(() => {
    handleValueChange([]);
  }, [handleValueChange]);

  const contextValue = useMemo(
    (): MultiselectContextValue => ({
      size,
      value,
      onValueChange: handleValueChange,
      disabled,
      options,
      searchQuery,
      setSearchQuery,
      open,
      setOpen: handleOpenChange,
      toggleOption,
      removeOption,
      clearAll,
    }),
    [
      size,
      value,
      handleValueChange,
      disabled,
      options,
      searchQuery,
      open,
      handleOpenChange,
      toggleOption,
      removeOption,
      clearAll,
    ]
  );

  return (
    <MultiselectContext.Provider value={contextValue}>
      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        {children}
      </PopoverPrimitive.Root>
    </MultiselectContext.Provider>
  );
}

Multiselect.displayName = 'Multiselect';

// ============================================================================
// MultiselectTrigger
// ============================================================================

export interface MultiselectTriggerProps
  extends
    Omit<ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>, 'children'>,
    Omit<MultiselectTriggerVariants, 'size'> {
  /**
   * Size variant (overrides context if provided)
   */
  size?: MultiselectSize;
  /**
   * Content to render on the left side (prefix)
   */
  leftAddOn?: ReactNode;
  /**
   * Additional CSS classes for the wrapper
   */
  className?: string;
  /**
   * Children elements (typically MultiselectValue)
   */
  children?: ReactNode;
}

/**
 * MultiselectTrigger - The button that opens the multiselect dropdown.
 */
export const MultiselectTrigger = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Trigger>,
  MultiselectTriggerProps
>(
  (
    {
      size: propSize,
      variant = 'bordered',
      error = false,
      leftAddOn,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const context = useMultiselectContext();
    const size = propSize ?? context.size;
    const iconSize = size === 'lg' ? 'md' : 'sm';

    const handleClearAll = (e: MouseEvent): void => {
      e.stopPropagation();
      context.clearAll();
    };

    return (
      <PopoverPrimitive.Trigger
        ref={ref}
        disabled={context.disabled}
        className={cn(
          multiselectTriggerVariants({ size, variant, error }),
          className
        )}
        {...props}
      >
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {leftAddOn && (
            <span className="shrink-0 text-text-tertiary">{leftAddOn}</span>
          )}
          {children}
        </span>

        <span className="flex shrink-0 items-center gap-1">
          {/* Clear all button */}
          {context.value.length > 0 && !context.disabled && (
            <button
              type="button"
              aria-label="Clear all selections"
              onClick={handleClearAll}
              className="flex items-center justify-center rounded-full p-0.5 transition-colors hover:bg-background-secondary"
            >
              <Icon
                icon={X}
                size="sm"
                className="text-text-tertiary"
                aria-hidden
              />
            </button>
          )}

          {/* Chevron */}
          <Icon
            icon={CaretDown}
            size={iconSize}
            className={cn(
              'shrink-0 text-text-tertiary transition-transform duration-150',
              context.open && 'rotate-180'
            )}
            aria-hidden
          />
        </span>
      </PopoverPrimitive.Trigger>
    );
  }
);

MultiselectTrigger.displayName = 'MultiselectTrigger';

// ============================================================================
// MultiselectValue
// ============================================================================

export interface MultiselectValueProps extends Omit<
  ComponentPropsWithoutRef<'span'>,
  'children'
> {
  /**
   * Placeholder text when no items are selected
   */
  placeholder?: string;
  /**
   * Maximum number of tags to display before showing "+N more"
   * @default 3
   */
  maxDisplayTags?: number;
  /**
   * Whether to show tags or just a count
   * @default 'tags'
   */
  displayMode?: 'tags' | 'count';
}

/**
 * MultiselectValue - Displays the selected values or placeholder.
 */
export const MultiselectValue = forwardRef<
  HTMLSpanElement,
  MultiselectValueProps
>(
  (
    {
      placeholder = 'Select...',
      maxDisplayTags = 3,
      displayMode = 'tags',
      className,
      ...props
    },
    ref
  ) => {
    const context = useMultiselectContext();
    const size = context.size;

    const selectedOptions = context.options.filter((opt) =>
      context.value.includes(opt.value)
    );

    const LabelComponent = size === 'sm' ? TextXs : TextSm;
    const tagSize = size === 'lg' ? 'md' : 'sm';

    // Handle tag removal
    const handleRemoveTag = (e: MouseEvent, optionValue: string): void => {
      e.stopPropagation();
      context.removeOption(optionValue);
    };

    if (selectedOptions.length === 0) {
      return (
        <span
          ref={ref}
          className={cn('text-text-tertiary', className)}
          {...props}
        >
          {placeholder}
        </span>
      );
    }

    if (displayMode === 'count') {
      return (
        <span ref={ref} className={cn('text-text-primary', className)} {...props}>
          {selectedOptions.length} selected
        </span>
      );
    }

    const visibleTags = selectedOptions.slice(0, maxDisplayTags);
    const remainingCount = selectedOptions.length - maxDisplayTags;

    return (
      <span
        ref={ref}
        className={cn('flex flex-wrap items-center gap-1', className)}
        {...props}
      >
        {visibleTags.map((option) => (
          <span
            key={option.value}
            className={cn(
              multiselectSelectedTagVariants({ size: tagSize }),
              context.disabled && 'opacity-50'
            )}
          >
            <LabelComponent
              as="span"
              weight="medium"
              className={cn(
                'truncate text-text-primary',
                context.disabled && 'text-text-tertiary'
              )}
            >
              {option.label}
            </LabelComponent>
            {!context.disabled && (
              <span
                role="button"
                tabIndex={0}
                aria-label={`Remove ${option.label}`}
                onClick={(e) => handleRemoveTag(e, option.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRemoveTag(e as unknown as MouseEvent, option.value);
                  }
                }}
                className="flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-background-secondary focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:outline-none"
              >
                <Icon
                  icon={X}
                  size="sm"
                  weight="light"
                  className="text-text-primary"
                  aria-hidden
                />
              </span>
            )}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="px-1 text-sm text-text-secondary">
            +{remainingCount} more
          </span>
        )}
      </span>
    );
  }
);

MultiselectValue.displayName = 'MultiselectValue';

// ============================================================================
// MultiselectPopoverContent
// ============================================================================

export interface MultiselectPopoverContentProps
  extends
    ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    Omit<MultiselectPopoverContentVariants, 'size'> {
  /**
   * Size variant (overrides context if provided)
   */
  size?: MultiselectSize;
}

/**
 * MultiselectPopoverContent - The dropdown content container.
 */
export const MultiselectPopoverContent = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Content>,
  MultiselectPopoverContentProps
>(
  (
    {
      size: propSize,
      className,
      children,
      sideOffset = 4,
      align = 'start',
      ...props
    },
    ref
  ) => {
    const context = useMultiselectContext();
    const size = propSize ?? context.size;

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          align={align}
          className={cn(
            multiselectPopoverContentVariants({ size }),
            'w-(--radix-popover-trigger-width) min-w-(--radix-popover-trigger-width)',
            className
          )}
          {...props}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  }
);

MultiselectPopoverContent.displayName = 'MultiselectPopoverContent';

// ============================================================================
// MultiselectSearch
// ============================================================================

export interface MultiselectSearchProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'size'
> {
  /**
   * Size variant (overrides context if provided)
   */
  size?: MultiselectSize;
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
 * MultiselectSearch - Search input for filtering options.
 */
export const MultiselectSearch = forwardRef<
  HTMLInputElement,
  MultiselectSearchProps
>(
  (
    {
      size: propSize,
      showIcon = true,
      wrapperClassName,
      className,
      placeholder = 'Search...',
      ...props
    },
    ref
  ) => {
    const context = useMultiselectContext();
    const size = propSize ?? context.size;
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when dropdown opens
    useEffect(() => {
      if (context.open) {
        // Small delay to ensure the popover is rendered
        const timer = setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
        return () => clearTimeout(timer);
      }
    }, [context.open]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
      context.setSearchQuery(e.target.value);
      props.onChange?.(e);
    };

    const wrapperPadding = {
      sm: 'gap-2.5 px-3 py-2',
      md: 'gap-3 px-3 py-2',
      lg: 'gap-3 px-4 py-3',
    };

    const inputTypography = {
      sm: 'text-sm leading-5',
      md: 'text-sm leading-5',
      lg: 'text-base leading-6',
    };

    return (
      <div
        className={cn(
          'flex w-full items-center border-b border-border-secondary bg-transparent transition-colors duration-150 focus-within:border-primary',
          wrapperPadding[size],
          wrapperClassName
        )}
      >
        {showIcon && (
          <Icon
            icon={MagnifyingGlass}
            size="sm"
            color="muted"
            aria-hidden={true}
          />
        )}
        <input
          ref={(node) => {
            // Merge refs
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            (inputRef as RefObject<HTMLInputElement | null>).current = node;
          }}
          type="search"
          role="searchbox"
          value={context.searchQuery}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'w-full min-w-0 flex-1 border-none bg-transparent text-text-primary outline-none placeholder:text-text-tertiary',
            inputTypography[size],
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

MultiselectSearch.displayName = 'MultiselectSearch';

// ============================================================================
// MultiselectOptions
// ============================================================================

export interface MultiselectOptionsProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Custom render function for options
   */
  renderOption?: (option: MultiselectOption, isSelected: boolean) => ReactNode;
  /**
   * Text to display when no options match the search
   */
  emptyText?: string;
}

/**
 * MultiselectOptions - Scrollable container with option items.
 */
export const MultiselectOptions = forwardRef<
  HTMLDivElement,
  MultiselectOptionsProps
>(
  (
    {
      renderOption,
      emptyText = 'No options found',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const context = useMultiselectContext();
    const size = context.size;
    const checkboxSize = sizeToCheckboxSize[size];

    // Filter options based on search query
    const filteredOptions = useMemo(() => {
      if (!context.searchQuery) return context.options;
      const query = context.searchQuery.toLowerCase();
      return context.options.filter((option) =>
        option.label.toLowerCase().includes(query)
      );
    }, [context.options, context.searchQuery]);

    const handleKeyDown = (
      e: KeyboardEvent<HTMLDivElement>,
      option: MultiselectOption
    ): void => {
      if (option.disabled) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        context.toggleOption(option.value);
      }
    };

    if (filteredOptions.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex-1 overflow-y-auto p-4 text-center text-text-tertiary',
            size === 'lg' ? 'text-base' : 'text-sm',
            className
          )}
          {...props}
        >
          {emptyText}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="listbox"
        aria-multiselectable="true"
        className={cn(
          'flex-1 overflow-y-auto py-1',
          // Custom scrollbar styling
          '[&::-webkit-scrollbar]:w-3',
          '[&::-webkit-scrollbar-track]:bg-transparent',
          '[&::-webkit-scrollbar-thumb]:rounded',
          '[&::-webkit-scrollbar-thumb]:bg-background-tertiary',
          '[&::-webkit-scrollbar-thumb]:border-4',
          '[&::-webkit-scrollbar-thumb]:border-transparent',
          '[&::-webkit-scrollbar-thumb]:bg-clip-padding',
          className
        )}
        {...props}
      >
        {children ||
          filteredOptions.map((option) => {
            const isSelected = context.value.includes(option.value);

            if (renderOption) {
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  tabIndex={option.disabled ? -1 : 0}
                  onClick={() =>
                    !option.disabled && context.toggleOption(option.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, option)}
                  className="cursor-pointer"
                >
                  {renderOption(option, isSelected)}
                </div>
              );
            }

            return (
              <div
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                aria-checked={isSelected}
                tabIndex={option.disabled ? -1 : 0}
                onClick={() =>
                  !option.disabled && context.toggleOption(option.value)
                }
                onKeyDown={(e) => handleKeyDown(e, option)}
                className={cn(
                  multiselectOptionVariants({ size, selected: isSelected }),
                  option.disabled && 'pointer-events-none text-text-tertiary'
                )}
              >
                {/* Checkbox */}
                <span
                  aria-hidden
                  className={cn(
                    'flex shrink-0 items-center justify-center rounded-sm transition-colors',
                    checkboxSize,
                    isSelected
                      ? option.disabled
                        ? 'bg-info-300'
                        : 'bg-info-500'
                      : option.disabled
                        ? 'border border-border bg-background-tertiary'
                        : 'border border-border bg-background'
                  )}
                >
                  {isSelected && (
                    <Check
                      weight="bold"
                      className={cn(
                        size === 'lg' ? 'size-3.5' : 'size-3',
                        'text-white'
                      )}
                    />
                  )}
                </span>

                {/* Label */}
                <span
                  className={cn(
                    'flex-1 truncate font-sans',
                    option.disabled ? 'text-text-tertiary' : 'text-text-primary'
                  )}
                >
                  {option.label}
                </span>
              </div>
            );
          })}
      </div>
    );
  }
);

MultiselectOptions.displayName = 'MultiselectOptions';

// ============================================================================
// MultiselectOptionItem (for custom implementations)
// ============================================================================

export interface MultiselectOptionItemProps
  extends
    Omit<ComponentPropsWithoutRef<'div'>, 'children'>,
    Omit<MultiselectOptionVariants, 'size' | 'selected'> {
  /**
   * The option value
   */
  value: string;
  /**
   * Size variant (overrides context if provided)
   */
  size?: MultiselectSize;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Whether to show a checkbox
   * @default true
   */
  showCheckbox?: boolean;
  /**
   * Children elements
   */
  children: ReactNode;
}

/**
 * MultiselectOptionItem - Individual selectable option (for custom implementations).
 */
export const MultiselectOptionItem = forwardRef<
  HTMLDivElement,
  MultiselectOptionItemProps
>(
  (
    {
      value,
      size: propSize,
      disabled = false,
      showCheckbox = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const context = useMultiselectContext();
    const size = propSize ?? context.size;
    const isSelected = context.value.includes(value);
    const checkboxSize = sizeToCheckboxSize[size];

    const handleClick = (): void => {
      if (!disabled) {
        context.toggleOption(value);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
      if (disabled) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        context.toggleOption(value);
      }
    };

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        aria-checked={showCheckbox ? isSelected : undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          multiselectOptionVariants({ size, selected: isSelected }),
          disabled && 'pointer-events-none text-text-tertiary',
          className
        )}
        {...props}
      >
        {showCheckbox && (
          <span
            aria-hidden
            className={cn(
              'flex shrink-0 items-center justify-center rounded-sm transition-colors',
              checkboxSize,
              isSelected
                ? disabled
                  ? 'bg-info-300'
                  : 'bg-info-500'
                : disabled
                  ? 'border border-border bg-background-tertiary'
                  : 'border border-border bg-background'
            )}
          >
            {isSelected && (
              <Check
                weight="bold"
                className={cn(
                  size === 'lg' ? 'size-3.5' : 'size-3',
                  'text-white'
                )}
              />
            )}
          </span>
        )}

        <span
          className={cn(
            'flex-1 truncate font-sans',
            disabled ? 'text-text-tertiary' : 'text-text-primary'
          )}
        >
          {children}
        </span>
      </div>
    );
  }
);

MultiselectOptionItem.displayName = 'MultiselectOptionItem';

// ============================================================================
// Exports
// ============================================================================

export {
  multiselectOptionVariants,
  multiselectPopoverContentVariants,
  multiselectSelectedTagVariants,
  multiselectTriggerVariants,
};
