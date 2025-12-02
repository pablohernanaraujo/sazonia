'use client';

import {
  forwardRef,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { CaretDown } from '@phosphor-icons/react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

import { SelectContent, SelectItem } from './select';

interface UseSelectFloatingLabelStateOptions {
  value: string | undefined;
  defaultValue: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
  onOpenChange: ((open: boolean) => void) | undefined;
}

interface UseSelectFloatingLabelStateReturn {
  isOpen: boolean;
  shouldFloat: boolean;
  handleOpenChange: (open: boolean) => void;
  handleValueChange: (newValue: string) => void;
  rootProps: {
    value: string | undefined;
    defaultValue: string | undefined;
  };
}

/**
 * Hook to manage SelectFloatingLabel state (open state and value).
 * Extracts complexity from the main component.
 */
function useSelectFloatingLabelState(
  options: UseSelectFloatingLabelStateOptions
): UseSelectFloatingLabelStateReturn {
  const { value, defaultValue, onValueChange, onOpenChange } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = Boolean(currentValue);
  const shouldFloat = isOpen || hasValue;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange]
  );

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  const rootProps = useMemo(
    () => ({
      value: isControlled ? value : undefined,
      defaultValue: !isControlled ? defaultValue : undefined,
    }),
    [isControlled, value, defaultValue]
  );

  return {
    isOpen,
    shouldFloat,
    handleOpenChange,
    handleValueChange,
    rootProps,
  };
}

/**
 * SelectFloatingLabel wrapper variants for the container.
 *
 * Handles border colors, background, and focus states.
 */
const selectFloatingLabelWrapperVariants = cva(
  [
    'relative flex items-center',
    'rounded-sm border',
    'transition-colors duration-150',
    'cursor-pointer',
  ],
  {
    variants: {
      error: {
        true: 'border-2 border-destructive',
        false: ['border border-border', 'hover:border-border-hover'],
      },
      disabled: {
        true: 'cursor-not-allowed bg-background-secondary',
        false: 'bg-background',
      },
      open: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Open + no error = primary border
      {
        open: true,
        error: false,
        disabled: false,
        className: 'border-2 border-primary',
      },
    ],
    defaultVariants: {
      error: false,
      disabled: false,
      open: false,
    },
  }
);

/**
 * Floating label variants with compound variants for state-based styling.
 *
 * Handles position, scale, and color based on:
 * - floating: Whether label is in floating position (above) or inline (placeholder)
 * - error: Whether input is in error state
 * - open: Whether dropdown is currently open
 * - disabled: Whether select is disabled
 */
const floatingLabelSelectVariants = cva(
  [
    'absolute left-3 px-1',
    'transition-all duration-150 ease-out',
    'pointer-events-none',
    'origin-left',
  ],
  {
    variants: {
      floating: {
        true: 'top-0 -translate-y-1/2 scale-75 bg-background text-xs font-medium',
        false:
          'top-1/2 -translate-y-1/2 scale-100 bg-transparent text-base font-normal',
      },
      error: {
        true: '',
        false: '',
      },
      open: {
        true: '',
        false: '',
      },
      disabled: {
        true: 'text-text-tertiary',
        false: '',
      },
    },
    compoundVariants: [
      // Error state always takes precedence (regardless of open state)
      {
        error: true,
        className: 'text-destructive',
      },
      // Floating + open (not error) = brand color
      {
        floating: true,
        open: true,
        error: false,
        disabled: false,
        className: 'text-primary',
      },
      // Floating + not open + not error = tertiary color
      {
        floating: true,
        open: false,
        error: false,
        disabled: false,
        className: 'text-text-tertiary',
      },
      // Not floating + not error + not disabled = tertiary color (placeholder appearance)
      {
        floating: false,
        error: false,
        disabled: false,
        className: 'text-text-tertiary',
      },
    ],
    defaultVariants: {
      floating: false,
      error: false,
      open: false,
      disabled: false,
    },
  }
);

export type SelectFloatingLabelWrapperVariants = VariantProps<
  typeof selectFloatingLabelWrapperVariants
>;

export type FloatingLabelSelectVariants = VariantProps<
  typeof floatingLabelSelectVariants
>;

export interface SelectFloatingLabelProps extends Omit<
  SelectPrimitive.SelectProps,
  'children'
> {
  /**
   * The floating label text
   */
  label: string;

  /**
   * Shows required indicator (*)
   * @default false
   */
  required?: boolean;

  /**
   * Error state - applies destructive styling
   * @default false
   */
  error?: boolean;

  /**
   * Left add-on element (icon, text, etc.)
   */
  leftAddOn?: ReactNode;

  /**
   * Additional CSS classes for the wrapper element
   */
  wrapperClassName?: string;

  /**
   * Additional CSS classes for the trigger element
   */
  className?: string;

  /**
   * Children elements (typically SelectItem components)
   */
  children?: ReactNode;

  /**
   * ARIA describedby for associating with hint/error
   */
  'aria-describedby'?: string;
}

/**
 * SelectFloatingLabel - A select dropdown with floating label animation.
 *
 * When the select is empty (no value selected), the label appears as placeholder text
 * inside the trigger. Upon open or when the select has a value, the label smoothly
 * animates to float above the trigger border.
 *
 * This is the **standalone** molecule component. For a complete form field with
 * hint and error message, use `SelectFloatingLabelField` instead.
 *
 * **Important**: Use `SelectItem` from `@/ui/inputs` for dropdown options.
 *
 * @example
 * ```tsx
 * import { SelectFloatingLabel, SelectItem } from '@/ui/inputs';
 * import { Globe } from '@phosphor-icons/react';
 * import { Icon } from '@/ui/icons';
 *
 * // Basic usage
 * <SelectFloatingLabel label="Country">
 *   <SelectItem value="us">United States</SelectItem>
 *   <SelectItem value="ca">Canada</SelectItem>
 *   <SelectItem value="mx">Mexico</SelectItem>
 * </SelectFloatingLabel>
 *
 * // With required indicator
 * <SelectFloatingLabel label="Country" required>
 *   <SelectItem value="us">United States</SelectItem>
 * </SelectFloatingLabel>
 *
 * // With error state
 * <SelectFloatingLabel label="Country" error>
 *   <SelectItem value="us">United States</SelectItem>
 * </SelectFloatingLabel>
 *
 * // With left add-on (icon)
 * <SelectFloatingLabel
 *   label="Country"
 *   leftAddOn={<Icon icon={Globe} size="sm" color="muted" />}
 * >
 *   <SelectItem value="us">United States</SelectItem>
 * </SelectFloatingLabel>
 *
 * // Controlled
 * <SelectFloatingLabel
 *   label="Country"
 *   value={country}
 *   onValueChange={setCountry}
 * >
 *   <SelectItem value="us">United States</SelectItem>
 * </SelectFloatingLabel>
 * ```
 */
export const SelectFloatingLabel = forwardRef<
  HTMLButtonElement,
  SelectFloatingLabelProps
>(
  (
    {
      label,
      required,
      error = false,
      disabled,
      leftAddOn,
      wrapperClassName,
      className,
      children,
      value,
      defaultValue,
      onValueChange,
      onOpenChange,
      open: controlledOpen,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const {
      isOpen,
      shouldFloat,
      handleOpenChange,
      handleValueChange,
      rootProps,
    } = useSelectFloatingLabelState({
      value,
      defaultValue,
      onValueChange,
      onOpenChange,
    });

    return (
      <SelectPrimitive.Root
        {...rootProps}
        onValueChange={handleValueChange}
        onOpenChange={handleOpenChange}
        open={controlledOpen}
        disabled={disabled}
        {...props}
      >
        <div
          className={cn(
            selectFloatingLabelWrapperVariants({
              error,
              disabled,
              open: isOpen,
            }),
            wrapperClassName
          )}
        >
          {/* Floating Label */}
          <span
            className={cn(
              floatingLabelSelectVariants({
                floating: shouldFloat,
                error,
                open: isOpen,
                disabled,
              }),
              // Adjust left position when leftAddOn is present
              leftAddOn && 'left-10'
            )}
          >
            {label}
            {required && (
              <>
                <span aria-hidden="true" className="ml-0.5 text-destructive">
                  *
                </span>
                <span className="sr-only">required</span>
              </>
            )}
          </span>

          {/* Select Trigger */}
          <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
              'flex w-full items-center gap-2.5 px-4 py-3.5',
              'bg-transparent',
              'border-none outline-none',
              'text-base leading-6 text-text-primary',
              'disabled:cursor-not-allowed disabled:text-text-tertiary',
              className
            )}
            aria-invalid={error ? true : undefined}
            aria-required={required ? true : undefined}
            aria-describedby={ariaDescribedBy}
          >
            {leftAddOn && (
              <span className="flex-shrink-0 text-text-tertiary">
                {leftAddOn}
              </span>
            )}
            <span className="min-w-0 flex-1 truncate text-left">
              <SelectPrimitive.Value />
            </span>
            <SelectPrimitive.Icon asChild>
              <Icon
                icon={CaretDown}
                size="md"
                className="flex-shrink-0 text-text-tertiary"
                aria-hidden
              />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
        </div>

        {/* Dropdown Content */}
        <SelectContent>{children}</SelectContent>
      </SelectPrimitive.Root>
    );
  }
);

SelectFloatingLabel.displayName = 'SelectFloatingLabel';

export {
  floatingLabelSelectVariants,
  // Re-export SelectItem for convenience
  SelectContent as SelectFloatingLabelContent,
  SelectItem as SelectFloatingLabelItem,
  selectFloatingLabelWrapperVariants,
};
