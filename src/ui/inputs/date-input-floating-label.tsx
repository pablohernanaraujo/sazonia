import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CalendarBlankIcon } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

import {
  Calendar,
  type CalendarSingleValue,
  type CalendarValue,
} from './calendar';

// ============================================================================
// Custom Hooks
// ============================================================================

/**
 * Hook to detect browser autofill on an input element
 */
function useAutofillDetection(
  inputRef: React.RefObject<HTMLInputElement | null>
): boolean {
  const [isAutofilled, setIsAutofilled] = useState(false);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const checkAutofill = (): void => {
      try {
        const matches = input.matches(':-webkit-autofill');
        setIsAutofilled(matches);
      } catch {
        // Firefox doesn't support :-webkit-autofill
        setIsAutofilled(false);
      }
    };

    // Check immediately
    checkAutofill();

    // Check after browsers typically autofill (on page load)
    const timer = setTimeout(checkAutofill, 500);

    // Listen for animation (some browsers fire this on autofill)
    const handleAnimationStart = (e: AnimationEvent): void => {
      if (e.animationName === 'onAutoFillStart') {
        setIsAutofilled(true);
      }
      if (e.animationName === 'onAutoFillCancel') {
        setIsAutofilled(false);
      }
    };

    input.addEventListener('animationstart', handleAnimationStart);

    return () => {
      clearTimeout(timer);
      input.removeEventListener('animationstart', handleAnimationStart);
    };
  }, [inputRef]);

  // Also check for value changes to update autofill state
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    // If user clears input, reset autofill state
    const handleInput = (): void => {
      if (!input.value) {
        setIsAutofilled(false);
      }
    };

    input.addEventListener('input', handleInput);
    return () => input.removeEventListener('input', handleInput);
  }, [inputRef]);

  return isAutofilled;
}

/**
 * Hook to handle click outside detection
 */
function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void
): void {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, isOpen, onClose]);
}

interface UseDateInputStateOptions {
  controlledValue?: Date | null;
  defaultValue?: Date | null;
  controlledOpen?: boolean;
  onChange?: (date: Date | null) => void;
  onOpenChange?: (open: boolean) => void;
}

interface DateInputState {
  isValueControlled: boolean;
  isOpenControlled: boolean;
  currentValue: Date | null;
  isOpen: boolean;
  inputText: string;
  internalHasValue: boolean;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  setInternalValue: React.Dispatch<React.SetStateAction<Date | null>>;
  setInternalHasValue: React.Dispatch<React.SetStateAction<boolean>>;
  updateOpen: (newOpen: boolean) => void;
  onChange?: (date: Date | null) => void;
}

/**
 * Hook to manage date input state (controlled/uncontrolled patterns)
 */
function useDateInputState(options: UseDateInputStateOptions): DateInputState {
  const {
    controlledValue,
    defaultValue,
    controlledOpen,
    onChange,
    onOpenChange,
  } = options;

  // Determine if value is controlled
  const isValueControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<Date | null>(
    defaultValue ?? null
  );
  const currentValue = isValueControlled ? controlledValue : internalValue;

  // Determine if open is controlled
  const isOpenControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isOpenControlled ? controlledOpen : internalOpen;

  // Input text state
  const [inputText, setInputText] = useState<string>(
    currentValue ? formatMMDDYYYY(currentValue) : ''
  );

  // Track internal has value for uncontrolled mode
  const [internalHasValue, setInternalHasValue] = useState(
    Boolean(currentValue || defaultValue)
  );

  // Update open state
  const updateOpen = useCallback(
    (newOpen: boolean): void => {
      if (!isOpenControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isOpenControlled, onOpenChange]
  );

  return {
    isValueControlled,
    isOpenControlled,
    currentValue,
    isOpen,
    inputText,
    internalHasValue,
    setInputText,
    setInternalValue,
    setInternalHasValue,
    updateOpen,
    onChange,
  };
}

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

interface DateConstraints {
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[] | ((date: Date) => boolean);
}

interface DisplayedTextOptions {
  isValueControlled: boolean;
  isFocused: boolean;
  inputText: string;
  controlledValue: Date | null | undefined;
}

/**
 * Compute the displayed text for the input based on controlled/uncontrolled state
 */
function computeDisplayedText(options: DisplayedTextOptions): string {
  const { isValueControlled, isFocused, inputText, controlledValue } = options;
  if (!isValueControlled) return inputText;
  if (!isFocused) {
    return controlledValue ? formatMMDDYYYY(controlledValue) : '';
  }
  return inputText;
}

/**
 * Compute the calendar value from input text or current value
 */
function computeCalendarValue(
  inputText: string,
  currentValue: Date | null
): Date | null {
  const parsed = parseMMDDYYYY(inputText);
  return parsed ?? currentValue ?? null;
}

interface FloatingLabelState {
  isValueControlled: boolean;
  currentValue: Date | null;
  internalHasValue: boolean;
  displayedText: string;
  isFocused: boolean;
  isAutofilled: boolean;
}

/**
 * Determine if the floating label should be in floating position
 */
function computeShouldFloat(state: FloatingLabelState): boolean {
  const {
    isValueControlled,
    currentValue,
    internalHasValue,
    displayedText,
    isFocused,
    isAutofilled,
  } = state;
  const hasValue = isValueControlled
    ? Boolean(currentValue)
    : internalHasValue || Boolean(displayedText);
  return isFocused || hasValue || isAutofilled;
}

/**
 * Check if a date is disabled by constraints
 */
function isDateDisabled(date: Date, constraints: DateConstraints): boolean {
  const { minDate, maxDate, disabledDates } = constraints;
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  if (disabledDates) {
    if (Array.isArray(disabledDates)) {
      return disabledDates.some((d) => d.toDateString() === date.toDateString());
    }
    return disabledDates(date);
  }
  return false;
}

// ============================================================================
// CVA Variants
// ============================================================================

/**
 * DateInputFloatingLabel wrapper variants for the container.
 *
 * Handles border colors, background, and focus states.
 */
const dateInputFloatingLabelWrapperVariants = cva(
  [
    'relative flex items-center',
    'rounded-sm border',
    'transition-colors duration-150',
  ],
  {
    variants: {
      error: {
        true: 'border-2 border-destructive focus-within:border-destructive',
        false: [
          'border border-border',
          'hover:border-border-hover',
          'focus-within:border-2 focus-within:border-primary',
        ],
      },
      disabled: {
        true: 'cursor-not-allowed bg-background-secondary',
        false: 'bg-background',
      },
    },
    defaultVariants: {
      error: false,
      disabled: false,
    },
  }
);

/**
 * Floating label variants with compound variants for state-based styling.
 *
 * Handles position, scale, and color based on:
 * - floating: Whether label is in floating position (above) or inline (placeholder)
 * - error: Whether input is in error state
 * - focused: Whether input is currently focused
 * - disabled: Whether input is disabled
 */
const dateInputFloatingLabelVariants = cva(
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
      focused: {
        true: '',
        false: '',
      },
      disabled: {
        true: 'text-text-tertiary',
        false: '',
      },
    },
    compoundVariants: [
      // Error state always takes precedence (regardless of focus)
      {
        error: true,
        className: 'text-destructive',
      },
      // Floating + focused (not error) = brand color
      {
        floating: true,
        focused: true,
        error: false,
        disabled: false,
        className: 'text-primary',
      },
      // Floating + not focused + not error = tertiary color
      {
        floating: true,
        focused: false,
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
      focused: false,
      disabled: false,
    },
  }
);

export type DateInputFloatingLabelWrapperVariants = VariantProps<
  typeof dateInputFloatingLabelWrapperVariants
>;

export type DateInputFloatingLabelLabelVariants = VariantProps<
  typeof dateInputFloatingLabelVariants
>;

// ============================================================================
// Props Interface
// ============================================================================

export interface DateInputFloatingLabelProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'size' | 'value' | 'defaultValue' | 'onChange' | 'type'
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
   * Left add-on element (icon, text, etc.)
   *
   * @remarks
   * Unlike TextInputFloatingLabel, this component does NOT support `rightAddOn`.
   * The calendar icon button permanently occupies the right slot.
   */
  leftAddOn?: React.ReactNode;

  /**
   * Additional CSS classes for the wrapper element
   */
  wrapperClassName?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * DateInputFloatingLabel - A date input with floating label animation.
 *
 * When the input is empty and unfocused, the label appears as placeholder text inside
 * the input field. Upon focus or when the input has a value, the label smoothly
 * animates to float above the input border. Users can either type a date in MM/DD/YYYY
 * format or select a date from the calendar popover.
 *
 * @remarks
 * Unlike TextInputFloatingLabel, this component does NOT support `rightAddOn`.
 * The calendar icon button permanently occupies the right slot.
 * Use `leftAddOn` for additional icons or content.
 *
 * This is the **standalone** molecule component. For a complete form field with
 * hint and error message, use `DateInputFloatingLabelField` instead.
 *
 * @example
 * ```tsx
 * import { DateInputFloatingLabel } from '@/ui/inputs';
 *
 * // Basic usage
 * <DateInputFloatingLabel label="Date" />
 *
 * // With controlled value
 * <DateInputFloatingLabel
 *   label="Date"
 *   value={selectedDate}
 *   onChange={setSelectedDate}
 * />
 *
 * // With error state
 * <DateInputFloatingLabel label="Date" error />
 *
 * // With constraints
 * <DateInputFloatingLabel
 *   label="Date"
 *   minDate={new Date()}
 *   maxDate={new Date(2025, 11, 31)}
 * />
 * ```
 */
export const DateInputFloatingLabel = forwardRef<
  HTMLInputElement,
  DateInputFloatingLabelProps
>(
  (
    {
      label,
      required,
      error = false,
      disabled,
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
      id: providedId,
      placeholder = 'MM/DD/YYYY',
      onFocus,
      onBlur,
      onKeyDown,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    // ========================================================================
    // Refs
    // ========================================================================
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // ========================================================================
    // IDs
    // ========================================================================
    const generatedId = useId();
    const inputId = providedId ?? generatedId;
    const calendarId = `${inputId}-calendar`;

    // ========================================================================
    // State Management (via custom hook)
    // ========================================================================

    const dateInputState = useDateInputState({
      controlledValue,
      defaultValue,
      controlledOpen,
      onChange,
      onOpenChange,
    });

    const {
      isValueControlled,
      currentValue,
      isOpen,
      inputText,
      internalHasValue,
      setInputText,
      setInternalValue,
      setInternalHasValue,
      updateOpen,
    } = dateInputState;

    // Focus state for floating label
    const [isFocused, setIsFocused] = useState(false);

    // Autofill detection via custom hook
    const isAutofilled = useAutofillDetection(inputRef);

    // Compute displayed text: in controlled mode, prefer controlled value format
    // unless user is actively typing (focused with different text)
    const displayedText = useMemo(
      () =>
        computeDisplayedText({
          isValueControlled,
          isFocused,
          inputText,
          controlledValue,
        }),
      [isValueControlled, controlledValue, isFocused, inputText]
    );

    // ========================================================================
    // Computed Values
    // ========================================================================

    // Determine if label should float
    const shouldFloat = computeShouldFloat({
      isValueControlled,
      currentValue,
      internalHasValue,
      displayedText,
      isFocused,
      isAutofilled,
    });

    // Calendar value for display
    const calendarValue = useMemo<CalendarSingleValue>(
      () => computeCalendarValue(inputText, currentValue),
      [inputText, currentValue]
    );

    // ========================================================================
    // Effects
    // ========================================================================

    // Click outside detection via custom hook
    const handleClose = useCallback(() => updateOpen(false), [updateOpen]);
    useClickOutside(wrapperRef, isOpen, handleClose);

    // ========================================================================
    // More Handlers
    // ========================================================================

    /**
     * Updates the date value
     */
    const updateValue = useCallback(
      (newValue: Date | null) => {
        if (!isValueControlled) {
          setInternalValue(newValue);
          setInternalHasValue(Boolean(newValue));
        }
        setInputText(newValue ? formatMMDDYYYY(newValue) : '');
        onChange?.(newValue);
      },
      [
        isValueControlled,
        onChange,
        setInputText,
        setInternalHasValue,
        setInternalValue,
      ]
    );

    /**
     * Handles text input change
     */
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setInputText(text);
        setInternalHasValue(Boolean(text));

        // Try to parse and validate the date
        const parsed = parseMMDDYYYY(text);
        const constraints = { minDate, maxDate, disabledDates };
        if (parsed && !isDateDisabled(parsed, constraints)) {
          if (!isValueControlled) {
            setInternalValue(parsed);
          }
          onChange?.(parsed);
        }
      },
      [
        minDate,
        maxDate,
        disabledDates,
        isValueControlled,
        onChange,
        setInputText,
        setInternalHasValue,
        setInternalValue,
      ]
    );

    /**
     * Handles input focus
     */
    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
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
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        // Format on blur if valid
        const parsed = parseMMDDYYYY(inputText);
        if (parsed) {
          setInputText(formatMMDDYYYY(parsed));
        }
        onBlur?.(e);
      },
      [inputText, onBlur, setInputText]
    );

    /**
     * Handles keyboard events
     */
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
          updateOpen(false);
          inputRef.current?.focus();
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

    // ========================================================================
    // Render
    // ========================================================================

    return (
      <div ref={wrapperRef} className="relative">
        <div
          className={cn(
            dateInputFloatingLabelWrapperVariants({ error, disabled }),
            wrapperClassName
          )}
        >
          {/* Floating Label */}
          <label
            htmlFor={inputId}
            className={cn(
              dateInputFloatingLabelVariants({
                floating: shouldFloat,
                error,
                focused: isFocused,
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
          </label>

          {/* Input Container */}
          <div className="flex w-full items-center gap-2.5 px-4 py-3.5">
            {leftAddOn && (
              <span className="shrink-0 text-text-tertiary">{leftAddOn}</span>
            )}
            <input
              ref={(node) => {
                inputRef.current = node;
                // Handle forwarded ref
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
              }}
              id={inputId}
              type="text"
              role="combobox"
              disabled={disabled}
              value={displayedText}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              // Only show placeholder when floating
              placeholder={shouldFloat ? placeholder : undefined}
              aria-invalid={error ? true : undefined}
              aria-required={required ? true : undefined}
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              aria-controls={calendarId}
              aria-describedby={ariaDescribedBy}
              aria-autocomplete="none"
              className={cn(
                'min-w-0 flex-1',
                'bg-transparent',
                'border-none outline-none',
                'text-base leading-6 text-text-primary',
                'placeholder:text-text-tertiary',
                'disabled:cursor-not-allowed disabled:text-text-tertiary',
                className
              )}
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
              <Icon icon={CalendarBlankIcon} size="md" />
            </button>
          </div>
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

DateInputFloatingLabel.displayName = 'DateInputFloatingLabel';

export { dateInputFloatingLabelVariants, dateInputFloatingLabelWrapperVariants };
