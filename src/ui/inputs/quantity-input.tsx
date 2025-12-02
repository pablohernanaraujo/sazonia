import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  forwardRef,
  type KeyboardEvent,
  type RefObject,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { ErrorMessage } from './error-message';
import { Hint } from './hint';
import { InputLabel } from './input-label';
import { QuantityInputButton } from './quantity-input-button';

// ============================================================================
// Utility Functions (extracted to reduce component complexity)
// ============================================================================

/**
 * Get current numeric value from the input element.
 */
function getCurrentInputValue(
  inputRef: RefObject<HTMLInputElement | null>
): number {
  const input = inputRef.current;
  if (!input) return 0;
  const val = Number.parseFloat(input.value);
  return Number.isNaN(val) ? 0 : val;
}

/**
 * Clamp value to min/max bounds.
 */
function clampValue(val: number, min?: number, max?: number): number {
  let result = val;
  if (min !== undefined && result < min) result = min;
  if (max !== undefined && result > max) result = max;
  return result;
}

/**
 * Round to avoid floating point precision issues based on step.
 */
function roundToStep(val: number, step: number): number {
  const precision = step.toString().split('.')[1]?.length || 0;
  return Number(val.toFixed(precision));
}

/**
 * Trigger a synthetic change event on input element.
 */
function dispatchInputChange(input: HTMLInputElement, newValue: number): void {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set;

  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, String(newValue));
  }

  const event = new Event('input', { bubbles: true });
  input.dispatchEvent(event);
}

// ============================================================================
// Custom Hook for Quantity Input Logic
// ============================================================================

interface UseQuantityInputHandlersOptions {
  inputRef: RefObject<HTMLInputElement | null>;
  min?: number;
  max?: number;
  step: number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: number | string;
}

interface UseQuantityInputHandlersReturn {
  internalValue: number;
  handleIncrement: () => void;
  handleDecrement: () => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function useQuantityInputHandlers({
  inputRef,
  min,
  max,
  step,
  onChange,
  defaultValue,
}: UseQuantityInputHandlersOptions): UseQuantityInputHandlersReturn {
  const [internalValue, setInternalValue] = useState<number>(() => {
    if (defaultValue !== undefined) return Number(defaultValue);
    if (min !== undefined) return min;
    return 0;
  });

  const triggerChange = useCallback(
    (newValue: number) => {
      const input = inputRef.current;
      if (!input) return;

      const clampedValue = clampValue(roundToStep(newValue, step), min, max);
      setInternalValue(clampedValue);
      dispatchInputChange(input, clampedValue);
    },
    [inputRef, min, max, step]
  );

  const handleIncrement = useCallback(() => {
    const current = getCurrentInputValue(inputRef);
    triggerChange(current + step);
  }, [inputRef, step, triggerChange]);

  const handleDecrement = useCallback(() => {
    const current = getCurrentInputValue(inputRef);
    triggerChange(current - step);
  }, [inputRef, step, triggerChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handleIncrement();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleDecrement();
          break;
        case 'Home':
          if (min !== undefined) {
            e.preventDefault();
            triggerChange(min);
          }
          break;
        case 'End':
          if (max !== undefined) {
            e.preventDefault();
            triggerChange(max);
          }
          break;
      }
    },
    [handleIncrement, handleDecrement, triggerChange, min, max]
  );

  const handleBlur = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;

    const val = Number.parseFloat(input.value);
    if (Number.isNaN(val) || input.value === '') {
      triggerChange(min ?? 0);
    } else {
      triggerChange(val);
    }
  }, [inputRef, min, triggerChange]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = Number.parseFloat(e.target.value);
      if (!Number.isNaN(val)) {
        setInternalValue(val);
      }
      onChange?.(e);
    },
    [onChange]
  );

  return {
    internalValue,
    handleIncrement,
    handleDecrement,
    handleKeyDown,
    handleBlur,
    handleChange,
  };
}

// ============================================================================
// Accessibility Helpers (extracted to reduce component complexity)
// ============================================================================

interface AccessibilityIds {
  inputId: string;
  hintId: string | undefined;
  errorId: string | undefined;
  computedAriaDescribedBy: string | undefined;
}

interface AccessibilityIdsOptions {
  providedId: string | undefined;
  generatedId: string;
  hint: string | undefined;
  error: boolean;
  errorMessage: string | undefined;
  ariaDescribedBy: string | undefined;
}

function computeAccessibilityIds(
  options: AccessibilityIdsOptions
): AccessibilityIds {
  const { providedId, generatedId, hint, error, errorMessage, ariaDescribedBy } =
    options;
  const inputId = providedId ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error && errorMessage ? `${inputId}-error` : undefined;

  const describedByParts = [ariaDescribedBy, hintId, errorId].filter(Boolean);
  const computedAriaDescribedBy =
    describedByParts.length > 0 ? describedByParts.join(' ') : undefined;

  return { inputId, hintId, errorId, computedAriaDescribedBy };
}

interface ButtonStates {
  canIncrement: boolean;
  canDecrement: boolean;
  effectiveValue: number;
}

interface ButtonStatesOptions {
  value: number | string | undefined;
  internalValue: number;
  disabled: boolean | undefined;
  min: number | undefined;
  max: number | undefined;
}

function computeButtonStates(options: ButtonStatesOptions): ButtonStates {
  const { value, internalValue, disabled, min, max } = options;
  const effectiveValue = value !== undefined ? Number(value) : internalValue;
  const canIncrement = !disabled && (max === undefined || effectiveValue < max);
  const canDecrement = !disabled && (min === undefined || effectiveValue > min);
  return { canIncrement, canDecrement, effectiveValue };
}

function computeAriaInvalid(
  ariaInvalid: boolean | 'true' | 'false' | 'grammar' | 'spelling' | undefined,
  error: boolean
): boolean | undefined {
  if (ariaInvalid !== undefined) return ariaInvalid as boolean;
  return error ? true : undefined;
}

/**
 * QuantityInput wrapper variants for the container that holds buttons and input.
 *
 * Size variants:
 * - `sm`: Small (h-8, input width 40px)
 * - `md`: Medium (h-10, input width 48px)
 * - `lg`: Large (h-12, input width 64px) - default
 */
const quantityInputWrapperVariants = cva(
  [
    'inline-flex items-center',
    'transition-colors duration-150',
    // Focus-within for when input inside is focused
    'focus-within:ring-2 focus-within:ring-primary/20',
  ],
  {
    variants: {
      size: {
        sm: 'h-8',
        md: 'h-10',
        lg: 'h-12',
      },
      error: {
        true: 'focus-within:ring-destructive/20',
        false: '',
      },
    },
    defaultVariants: {
      size: 'lg',
      error: false,
    },
  }
);

/**
 * QuantityInput inner input element variants.
 *
 * Handles typography and width based on size:
 * - `sm`: 14px (text-sm), 40px width
 * - `md`: 14px (text-sm), 48px width
 * - `lg`: 16px (text-base), 64px width
 */
const quantityInputInputVariants = cva(
  [
    'text-center',
    'bg-background',
    'border-y border-border',
    'outline-none',
    'text-text-primary',
    'placeholder:text-text-tertiary',
    'transition-colors duration-150',
    // Hover state
    'hover:border-border-hover',
    // Disabled state
    'disabled:cursor-not-allowed disabled:bg-background-secondary disabled:text-text-tertiary',
    // Hide native number input spinners
    '[appearance:textfield]',
    '[&::-webkit-outer-spin-button]:appearance-none',
    '[&::-webkit-inner-spin-button]:appearance-none',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 w-10 text-sm leading-5',
        md: 'h-10 w-12 text-sm leading-5',
        lg: 'h-12 w-16 text-base leading-6',
      },
      error: {
        true: 'border-destructive hover:border-destructive',
        false: '',
      },
    },
    defaultVariants: {
      size: 'lg',
      error: false,
    },
  }
);

export type QuantityInputWrapperVariants = VariantProps<
  typeof quantityInputWrapperVariants
>;
export type QuantityInputVariants = VariantProps<
  typeof quantityInputInputVariants
>;

export interface QuantityInputProps
  extends
    Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type' | 'onChange'>,
    Omit<QuantityInputWrapperVariants, 'error'> {
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
   * Minimum allowed value
   */
  min?: number;

  /**
   * Maximum allowed value
   */
  max?: number;

  /**
   * Step value for increment/decrement
   * @default 1
   */
  step?: number;

  /**
   * Current value (controlled mode)
   */
  value?: number | string;

  /**
   * Default value (uncontrolled mode)
   */
  defaultValue?: number | string;

  /**
   * Callback when value changes
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;

  /**
   * Label text for the input
   */
  label?: string;

  /**
   * Shows required indicator (red asterisk) in label
   * @default false
   */
  required?: boolean;

  /**
   * Shows help icon next to label
   * @default false
   */
  showLabelIcon?: boolean;

  /**
   * Description text below the label
   */
  labelDescription?: string;

  /**
   * Hint text displayed below the input (hidden when in error state)
   */
  hint?: string;

  /**
   * Error message displayed when error is true
   */
  errorMessage?: string;

  /**
   * Additional CSS classes for the wrapper element
   */
  wrapperClassName?: string;

  /**
   * Aria-label for the minus button
   * @default "Decrease quantity"
   */
  decreaseAriaLabel?: string;

  /**
   * Aria-label for the plus button
   * @default "Increase quantity"
   */
  increaseAriaLabel?: string;
}

/**
 * Size mapping for child components
 * QuantityInput Size -> InputLabel/Hint/ErrorMessage Size
 */
const labelSizeMap = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

// ============================================================================
// Layout Component (extracted to reduce main component complexity)
// ============================================================================

interface QuantityInputLayoutProps {
  label?: string;
  required: boolean;
  showLabelIcon: boolean;
  labelDescription?: string;
  inputId: string;
  childSize: 'sm' | 'md';
  size: 'sm' | 'md' | 'lg';
  error: boolean;
  hint?: string;
  hintId?: string;
  errorId?: string;
  errorMessage?: string;
  wrapperClassName?: string;
  decreaseButton: React.ReactNode;
  increaseButton: React.ReactNode;
  children: React.ReactNode;
}

function QuantityInputLayout({
  label,
  required,
  showLabelIcon,
  labelDescription,
  inputId,
  childSize,
  size,
  error,
  hint,
  hintId,
  errorId,
  errorMessage,
  wrapperClassName,
  decreaseButton,
  increaseButton,
  children,
}: QuantityInputLayoutProps): React.ReactElement {
  const showHint = hint && !error;
  const showError = error && errorMessage;

  return (
    <div className={cn('flex flex-col', wrapperClassName)}>
      {label && (
        <InputLabel
          label={label}
          required={required}
          showIcon={showLabelIcon}
          description={labelDescription}
          htmlFor={inputId}
          size={childSize}
        />
      )}

      <div className={quantityInputWrapperVariants({ size, error })}>
        {decreaseButton}
        {children}
        {increaseButton}
      </div>

      {showHint && (
        <Hint id={hintId} size={childSize}>
          {hint}
        </Hint>
      )}

      {showError && (
        <ErrorMessage id={errorId} size={childSize} text={errorMessage} />
      )}
    </div>
  );
}

/**
 * QuantityInput - A specialized form control for adjusting numeric quantities.
 *
 * Combines a centered text input with flanking minus/plus buttons for intuitive
 * quantity adjustment. Supports controlled and uncontrolled modes, keyboard
 * navigation, and integrates with the form field system (label, hint, error).
 *
 * This is a **molecule** component that composes atoms: QuantityInputButton,
 * InputLabel, Hint, and ErrorMessage.
 *
 * @example
 * ```tsx
 * import { QuantityInput } from '@/ui/inputs';
 *
 * // Basic usage
 * <QuantityInput defaultValue={1} min={0} max={99} />
 *
 * // With label and hint
 * <QuantityInput
 *   label="Quantity"
 *   hint="Maximum 10 items per order"
 *   min={1}
 *   max={10}
 * />
 *
 * // With error state
 * <QuantityInput
 *   label="Quantity"
 *   error
 *   errorMessage="Quantity exceeds available stock"
 * />
 *
 * // Controlled mode
 * const [qty, setQty] = useState(1);
 * <QuantityInput
 *   value={qty}
 *   onChange={(e) => setQty(Number(e.target.value))}
 * />
 * ```
 */
export const QuantityInput = forwardRef<HTMLInputElement, QuantityInputProps>(
  (
    {
      size = 'lg',
      error = false,
      min,
      max,
      step = 1,
      value,
      defaultValue,
      onChange,
      label,
      required = false,
      showLabelIcon = false,
      labelDescription,
      hint,
      errorMessage,
      wrapperClassName,
      className,
      disabled,
      id: providedId,
      decreaseAriaLabel = 'Decrease quantity',
      increaseAriaLabel = 'Increase quantity',
      'aria-invalid': ariaInvalid,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const generatedId = useId();

    // Forward ref to internal ref
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    // Use extracted hook for all handlers
    const {
      internalValue,
      handleIncrement,
      handleDecrement,
      handleKeyDown,
      handleBlur,
      handleChange,
    } = useQuantityInputHandlers({
      inputRef: internalRef,
      min,
      max,
      step,
      onChange,
      defaultValue,
    });

    // Compute accessibility IDs and aria-describedby
    const { inputId, hintId, errorId, computedAriaDescribedBy } =
      computeAccessibilityIds({
        providedId,
        generatedId,
        hint,
        error,
        errorMessage,
        ariaDescribedBy,
      });

    // Button state calculations
    const { canIncrement, canDecrement, effectiveValue } = computeButtonStates({
      value,
      internalValue,
      disabled,
      min,
      max,
    });

    // Map size to label/hint/error size
    const childSize = labelSizeMap[size];

    // Compute aria-invalid
    const computedAriaInvalid = computeAriaInvalid(ariaInvalid, error);

    return (
      <QuantityInputLayout
        label={label}
        required={required}
        showLabelIcon={showLabelIcon}
        labelDescription={labelDescription}
        inputId={inputId}
        childSize={childSize}
        size={size}
        error={error}
        hint={hint}
        hintId={hintId}
        errorId={errorId}
        errorMessage={errorMessage}
        wrapperClassName={wrapperClassName}
        decreaseButton={
          <QuantityInputButton
            type="minus"
            size={size}
            disabled={!canDecrement}
            aria-label={decreaseAriaLabel}
            onClick={handleDecrement}
          />
        }
        increaseButton={
          <QuantityInputButton
            type="plus"
            size={size}
            disabled={!canIncrement}
            aria-label={increaseAriaLabel}
            onClick={handleIncrement}
          />
        }
      >
        <input
          ref={internalRef}
          id={inputId}
          type="number"
          role="spinbutton"
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          aria-invalid={computedAriaInvalid}
          aria-valuenow={effectiveValue}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-describedby={computedAriaDescribedBy}
          className={cn(quantityInputInputVariants({ size, error }), className)}
          {...props}
        />
      </QuantityInputLayout>
    );
  }
);

QuantityInput.displayName = 'QuantityInput';

export { quantityInputInputVariants, quantityInputWrapperVariants };
