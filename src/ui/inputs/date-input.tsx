import {
  ChangeEvent,
  type ComponentPropsWithoutRef,
  FocusEvent,
  forwardRef,
  KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CalendarBlank } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

import {
  Calendar,
  type CalendarSingleValue,
  type CalendarValue,
} from './calendar';

// ============================================================================
// Date Utility Functions
// ============================================================================

/**
 * Parse MM/DD/YYYY string to Date object
 * @returns Date object or null if invalid
 */
function parseMMDDYYYY(value: string): Date | null {
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;

  const [, month, day, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  // Validate the parsed date is actually valid (handles edge cases like 02/31)
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }

  return date;
}

/**
 * Format Date object to MM/DD/YYYY string
 */
function formatMMDDYYYY(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${month}/${day}/${year}`;
}

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * DateInput wrapper variants for the container that holds add-ons and input.
 *
 * Size variants:
 * - `sm`: Small (py-1.5 px-3, gap-2)
 * - `md`: Medium (py-2.5 px-3.5, gap-2.5)
 * - `lg`: Large (py-3 px-4, gap-3) - default
 */
const dateInputWrapperVariants = cva(
  [
    'flex w-full items-center',
    'rounded-sm border',
    'bg-background',
    'transition-colors duration-150',
    // Focus-within for when input inside is focused
    'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
    // Disabled state handled via group
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-background-secondary',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2 px-3 py-1.5',
        md: 'gap-2.5 px-3.5 py-2.5',
        lg: 'gap-3 px-4 py-3',
      },
      error: {
        true: 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20',
        false: 'border-border hover:border-border-hover',
      },
    },
    defaultVariants: {
      size: 'lg',
      error: false,
    },
  }
);

/**
 * DateInput inner input element variants.
 *
 * Handles typography based on size:
 * - `sm`/`md`: 14px (text-sm), 20px line-height
 * - `lg`: 16px (text-base), 24px line-height
 */
const dateInputVariants = cva(
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

export type DateInputWrapperVariants = VariantProps<
  typeof dateInputWrapperVariants
>;
export type DateInputVariants = VariantProps<typeof dateInputVariants>;

// ============================================================================
// Props Interface
// ============================================================================

export interface DateInputProps
  extends
    Omit<
      ComponentPropsWithoutRef<'input'>,
      'size' | 'value' | 'defaultValue' | 'onChange' | 'type'
    >,
    Omit<DateInputWrapperVariants, 'error'> {
  /**
   * Size variant of the input
   * - `sm`: Small (compact)
   * - `md`: Medium
   * - `lg`: Large (default)
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Error state - applies destructive border color
   * @default false
   */
  error?: boolean;

  /**
   * Date value (controlled mode)
   */
  value?: Date | null;

  /**
   * Default date value (uncontrolled mode)
   */
  defaultValue?: Date | null;

  /**
   * Change handler - receives Date object or null
   */
  onChange?: (date: Date | null) => void;

  /**
   * Popover control (controlled)
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Disabled dates - array or function
   */
  disabledDates?: Date[] | ((date: Date) => boolean);

  /**
   * Content to render on the left side of the input (prefix)
   * Can be an icon, text, or any ReactNode
   */
  leftAddOn?: ReactNode;

  /**
   * Additional CSS classes for the wrapper element
   */
  wrapperClassName?: string;
}

// ============================================================================
// Icon Size Mapping
// ============================================================================

const ICON_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

interface DateConstraints {
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[] | ((date: Date) => boolean);
}

/**
 * Checks if a date is disabled based on constraints
 */
function isDateDisabled(date: Date, constraints: DateConstraints): boolean {
  const { minDate, maxDate, disabledDates } = constraints;
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  if (!disabledDates) return false;

  if (Array.isArray(disabledDates)) {
    return disabledDates.some((d) => d.toDateString() === date.toDateString());
  }
  return disabledDates(date);
}

/**
 * Creates a ref callback that handles both internal ref and forwarded ref
 */
function createRefCallback<T>(
  internalRef: React.MutableRefObject<T | null>,
  forwardedRef: React.ForwardedRef<T>
): (node: T | null) => void {
  return (node: T | null) => {
    internalRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };
}

interface DateInputStateReturn {
  currentValue: Date | null;
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  isValueControlled: boolean;
  setInternalValue: React.Dispatch<React.SetStateAction<Date | null>>;
  updateValue: (newValue: Date | null) => void;
}

/**
 * Hook to manage controlled/uncontrolled date state with input text sync
 */
function useDateInputState(
  controlledValue: Date | null | undefined,
  defaultValue: Date | null | undefined,
  onChange: ((date: Date | null) => void) | undefined
): DateInputStateReturn {
  const isValueControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<Date | null>(
    defaultValue ?? null
  );
  const currentValue = isValueControlled ? controlledValue : internalValue;

  // Input text state (allows typing invalid strings)
  const [inputText, setInputText] = useState<string>(
    currentValue ? formatMMDDYYYY(currentValue) : ''
  );

  // Track previous controlled value for sync detection
  const [prevControlledValue, setPrevControlledValue] = useState(controlledValue);

  // Sync input text when controlled value changes externally
  if (isValueControlled && controlledValue !== prevControlledValue) {
    setPrevControlledValue(controlledValue);
    const newText = controlledValue ? formatMMDDYYYY(controlledValue) : '';
    if (newText !== inputText) {
      setInputText(newText);
    }
  }

  const updateValue = useCallback(
    (newValue: Date | null) => {
      if (!isValueControlled) {
        setInternalValue(newValue);
      }
      setInputText(newValue ? formatMMDDYYYY(newValue) : '');
      onChange?.(newValue);
    },
    [isValueControlled, onChange]
  );

  return {
    currentValue,
    inputText,
    setInputText,
    isValueControlled,
    setInternalValue,
    updateValue,
  };
}

interface OpenStateReturn {
  isOpen: boolean;
  updateOpen: (open: boolean) => void;
}

/**
 * Hook to manage controlled/uncontrolled open state
 */
function useOpenState(
  controlledOpen: boolean | undefined,
  onOpenChange: ((open: boolean) => void) | undefined
): OpenStateReturn {
  const isOpenControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isOpenControlled ? controlledOpen : internalOpen;

  const updateOpen = useCallback(
    (newOpen: boolean) => {
      if (!isOpenControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isOpenControlled, onOpenChange]
  );

  return { isOpen, updateOpen };
}

// ============================================================================
// Component
// ============================================================================

/**
 * DateInput - A standalone form date input component with calendar picker.
 *
 * Provides a styled date input field that combines a text input with a calendar popover.
 * Users can either type a date in MM/DD/YYYY format or select a date from the calendar.
 *
 * This is the **standalone** input component. For a complete form field with label,
 * hint, and error message, use `DateInputField` instead.
 *
 * @example
 * ```tsx
 * import { DateInput } from '@/ui/inputs';
 *
 * // Basic usage
 * <DateInput placeholder="Select date" />
 *
 * // With controlled value
 * <DateInput
 *   value={selectedDate}
 *   onChange={setSelectedDate}
 * />
 *
 * // With constraints
 * <DateInput
 *   minDate={new Date()}
 *   maxDate={new Date(2025, 11, 31)}
 * />
 *
 * // With error state
 * <DateInput error placeholder="Invalid date" />
 *
 * // With left add-on (text prefix)
 * <DateInput
 *   leftAddOn={<span className="text-text-tertiary">Text</span>}
 *   placeholder="MM/DD/YYYY"
 * />
 * ```
 */
export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      size = 'lg',
      error = false,
      value: controlledValue,
      defaultValue,
      onChange,
      open: controlledOpen,
      onOpenChange,
      minDate,
      maxDate,
      disabledDates,
      leftAddOn,
      wrapperClassName,
      className,
      disabled,
      placeholder = 'MM/DD/YYYY',
      'aria-invalid': ariaInvalid,
      onFocus,
      onBlur,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    // ========================================================================
    // Refs & IDs
    // ========================================================================
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const calendarId = useId();

    // ========================================================================
    // State Management
    // ========================================================================

    const {
      currentValue,
      inputText,
      setInputText,
      isValueControlled,
      setInternalValue,
      updateValue,
    } = useDateInputState(controlledValue, defaultValue, onChange);

    const { isOpen, updateOpen } = useOpenState(controlledOpen, onOpenChange);

    // ========================================================================
    // Handlers
    // ========================================================================

    /**
     * Handles text input change
     */
    const handleInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setInputText(text);

        // Try to parse the date
        const parsed = parseMMDDYYYY(text);
        if (!parsed) return;

        // Check constraints
        if (isDateDisabled(parsed, { minDate, maxDate, disabledDates })) return;

        if (!isValueControlled) {
          setInternalValue(parsed);
        }
        onChange?.(parsed);
      },
      [
        setInputText,
        minDate,
        maxDate,
        disabledDates,
        isValueControlled,
        setInternalValue,
        onChange,
      ]
    );

    /**
     * Handles input focus
     */
    const handleFocus = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        if (!disabled) {
          updateOpen(true);
        }
        onFocus?.(e);
      },
      [disabled, updateOpen, onFocus]
    );

    /**
     * Handles input blur
     */
    const handleBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        // Format on blur if valid
        const parsed = parseMMDDYYYY(inputText);
        if (parsed) {
          setInputText(formatMMDDYYYY(parsed));
        }
        onBlur?.(e);
      },
      [inputText, setInputText, onBlur]
    );

    /**
     * Handles keyboard events
     */
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
          updateOpen(false);
        } else if (e.key === 'Enter') {
          const parsed = parseMMDDYYYY(inputText);
          if (parsed) {
            updateOpen(false);
          }
        }
        onKeyDown?.(e);
      },
      [inputText, updateOpen, onKeyDown]
    );

    /**
     * Handles calendar icon click
     */
    const handleIconClick = useCallback(() => {
      if (!disabled) {
        inputRef.current?.focus();
        updateOpen(!isOpen);
      }
    }, [disabled, isOpen, updateOpen]);

    /**
     * Handles calendar date selection
     */
    const handleCalendarChange = useCallback(
      (value: CalendarValue) => {
        // Calendar in single mode returns CalendarSingleValue (Date | null)
        const date = value as CalendarSingleValue;
        updateValue(date);
        updateOpen(false);
        inputRef.current?.focus();
      },
      [updateValue, updateOpen]
    );

    /**
     * Click outside handler
     */
    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event: MouseEvent): void => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          updateOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, updateOpen]);

    // ========================================================================
    // Computed Values
    // ========================================================================

    const iconSize = ICON_SIZE_MAP[size];

    // Calendar value for display
    const calendarValue = useMemo<CalendarSingleValue>(() => {
      const parsed = parseMMDDYYYY(inputText);
      return parsed ?? currentValue ?? null;
    }, [inputText, currentValue]);

    // ========================================================================
    // Render
    // ========================================================================

    return (
      <div ref={wrapperRef} className="relative">
        <div
          className={cn(
            dateInputWrapperVariants({ size, error }),
            wrapperClassName
          )}
        >
          {leftAddOn && (
            <span className="shrink-0 text-text-tertiary">{leftAddOn}</span>
          )}
          <input
            ref={createRefCallback(inputRef, ref)}
            type="text"
            role="combobox"
            disabled={disabled}
            placeholder={placeholder}
            value={inputText}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            aria-invalid={ariaInvalid ?? (error ? true : undefined)}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={calendarId}
            aria-autocomplete="none"
            className={cn(dateInputVariants({ size }), className)}
            {...props}
          />
          <button
            type="button"
            aria-label="Choose date from calendar"
            aria-expanded={isOpen}
            tabIndex={-1}
            onClick={handleIconClick}
            disabled={disabled}
            className={cn(
              'shrink-0 cursor-pointer',
              'text-text-tertiary hover:text-text-secondary',
              'transition-colors duration-150',
              'disabled:cursor-not-allowed disabled:text-text-tertiary disabled:hover:text-text-tertiary'
            )}
          >
            <Icon icon={CalendarBlank} size={iconSize} />
          </button>
        </div>

        {/* Calendar Popover */}
        {isOpen && !disabled && (
          <div
            id={calendarId}
            role="dialog"
            aria-modal="false"
            aria-label="Choose date"
            className={cn(
              'absolute top-[calc(100%+8px)] left-0 z-50',
              'animate-in fade-in-0 zoom-in-95'
            )}
          >
            <Calendar
              mode="single"
              hideActions
              view="single-month"
              value={calendarValue}
              onChange={handleCalendarChange}
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={disabledDates}
            />
          </div>
        )}
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

export { dateInputVariants, dateInputWrapperVariants };
