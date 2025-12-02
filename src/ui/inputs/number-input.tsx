import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  forwardRef,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

/**
 * NumberInput wrapper variants for the container that holds add-ons, input, and stepper.
 *
 * Size variants:
 * - `sm`: Small (py-1.5 pl-3 pr-1, gap-2)
 * - `md`: Medium (py-2.5 pl-3.5 pr-1, gap-2.5)
 * - `lg`: Large (py-3 pl-4 pr-1, gap-3) - default
 */
const numberInputWrapperVariants = cva(
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
        sm: 'gap-2 py-1.5 pr-1 pl-3',
        md: 'gap-2.5 py-2.5 pr-1 pl-3.5',
        lg: 'gap-3 py-3 pr-1 pl-4',
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
 * NumberInput inner input element variants.
 *
 * Handles typography based on size:
 * - `sm`/`md`: 14px (text-sm), 20px line-height
 * - `lg`: 16px (text-base), 24px line-height
 */
const numberInputVariants = cva(
  [
    'w-full min-w-0 flex-1',
    'bg-transparent',
    'border-none outline-none',
    'text-text-primary',
    'placeholder:text-text-tertiary',
    'disabled:cursor-not-allowed disabled:text-text-tertiary',
    // Hide native number input spinners
    '[appearance:textfield]',
    '[&::-webkit-outer-spin-button]:appearance-none',
    '[&::-webkit-inner-spin-button]:appearance-none',
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
 * Stepper button variants for increment/decrement buttons.
 */
const stepperButtonVariants = cva(
  [
    'flex items-center justify-center',
    'text-text-secondary',
    'transition-colors',
    'hover:bg-fill-tertiary',
    'active:bg-fill-tertiary-hover',
    'focus-visible:outline-none',
    'focus-visible:bg-fill-tertiary',
    'disabled:opacity-52',
    'disabled:cursor-not-allowed',
    'disabled:hover:bg-transparent',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-6',
        md: 'h-5 w-6',
        lg: 'h-6 w-7',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

export type NumberInputWrapperVariants = VariantProps<
  typeof numberInputWrapperVariants
>;
export type NumberInputVariants = VariantProps<typeof numberInputVariants>;

interface StepperProps {
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  canIncrement: boolean;
  canDecrement: boolean;
}

/**
 * Internal stepper component for increment/decrement buttons.
 * Not exported - internal use only.
 */
function NumberInputStepper({
  size,
  disabled,
  onIncrement,
  onDecrement,
  canIncrement,
  canDecrement,
}: StepperProps): React.JSX.Element {
  return (
    <div className="flex flex-col border-l border-border">
      <button
        type="button"
        className={cn(stepperButtonVariants({ size }), 'rounded-tr-xs')}
        onClick={onIncrement}
        disabled={disabled || !canIncrement}
        aria-label="Increment value"
        tabIndex={-1}
      >
        <Icon icon={CaretUp} size="xs" color={null} />
      </button>
      <button
        type="button"
        className={cn(
          stepperButtonVariants({ size }),
          'rounded-br-xs border-t border-border'
        )}
        onClick={onDecrement}
        disabled={disabled || !canDecrement}
        aria-label="Decrement value"
        tabIndex={-1}
      >
        <Icon icon={CaretDown} size="xs" color={null} />
      </button>
    </div>
  );
}

export interface NumberInputProps
  extends
    Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type' | 'onChange'>,
    Omit<NumberInputWrapperVariants, 'error'> {
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
   * Content to render on the left side of the input (prefix)
   * Can be an icon, text, or any ReactNode
   */
  leftAddOn?: ReactNode;

  /**
   * Additional CSS classes for the wrapper element
   */
  wrapperClassName?: string;

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
}

/**
 * NumberInput - A standalone form number input component with stepper controls.
 *
 * Provides a styled number input field with increment/decrement buttons,
 * support for add-ons (prefix), and handles multiple visual states
 * (hover, focus, disabled, error).
 *
 * This is the **standalone** input component. For a complete form field with label,
 * hint, and error message, use `NumberInputField` instead.
 *
 * @example
 * ```tsx
 * import { NumberInput } from '@/ui/inputs';
 *
 * // Basic usage
 * <NumberInput placeholder="0" />
 *
 * // With min/max bounds
 * <NumberInput min={0} max={100} step={5} />
 *
 * // With size variant
 * <NumberInput size="sm" placeholder="0" />
 *
 * // With error state
 * <NumberInput error placeholder="0" aria-invalid />
 *
 * // With left add-on (text prefix)
 * <NumberInput
 *   leftAddOn={<span className="text-text-tertiary">Qty:</span>}
 *   placeholder="0"
 * />
 *
 * // Controlled mode
 * const [value, setValue] = useState(0);
 * <NumberInput
 *   value={value}
 *   onChange={(e) => setValue(Number(e.target.value))}
 * />
 * ```
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      size = 'lg',
      error = false,
      leftAddOn,
      wrapperClassName,
      className,
      disabled,
      min,
      max,
      step = 1,
      value,
      defaultValue,
      onChange,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);

    // Forward ref to internal ref
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    /**
     * Get current numeric value from the input.
     */
    const getCurrentValue = useCallback((): number => {
      const input = internalRef.current;
      if (!input) return 0;
      const val = Number.parseFloat(input.value);
      return Number.isNaN(val) ? 0 : val;
    }, []);

    /**
     * Clamp value to min/max bounds.
     */
    const clampValue = useCallback(
      (val: number): number => {
        let result = val;
        if (min !== undefined && result < min) result = min;
        if (max !== undefined && result > max) result = max;
        return result;
      },
      [min, max]
    );

    /**
     * Round to avoid floating point precision issues.
     */
    const roundToStep = useCallback(
      (val: number): number => {
        const precision = step.toString().split('.')[1]?.length || 0;
        return Number(val.toFixed(precision));
      },
      [step]
    );

    /**
     * Trigger a synthetic change event to support both controlled and uncontrolled modes.
     */
    const triggerChange = useCallback(
      (newValue: number) => {
        const input = internalRef.current;
        if (!input) return;

        const clampedValue = clampValue(roundToStep(newValue));
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;

        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(input, String(clampedValue));
        }

        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
      },
      [clampValue, roundToStep]
    );

    /**
     * Handle increment button click.
     */
    const handleIncrement = useCallback(() => {
      const current = getCurrentValue();
      triggerChange(current + step);
    }, [getCurrentValue, step, triggerChange]);

    /**
     * Handle decrement button click.
     */
    const handleDecrement = useCallback(() => {
      const current = getCurrentValue();
      triggerChange(current - step);
    }, [getCurrentValue, step, triggerChange]);

    /**
     * Handle keyboard navigation.
     */
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
          case 'PageUp':
            e.preventDefault();
            triggerChange(getCurrentValue() + step * 10);
            break;
          case 'PageDown':
            e.preventDefault();
            triggerChange(getCurrentValue() - step * 10);
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
      [
        handleIncrement,
        handleDecrement,
        triggerChange,
        getCurrentValue,
        step,
        min,
        max,
      ]
    );

    // Calculate stepper button states based on controlled value or props
    const numericValue =
      value !== undefined
        ? Number(value)
        : defaultValue !== undefined
          ? Number(defaultValue)
          : undefined;
    const canIncrementValue =
      max === undefined || numericValue === undefined || numericValue < max;
    const canDecrementValue =
      min === undefined || numericValue === undefined || numericValue > min;

    return (
      <div
        className={cn(
          numberInputWrapperVariants({ size, error }),
          wrapperClassName
        )}
      >
        {leftAddOn && (
          <span className="shrink-0 text-text-tertiary">{leftAddOn}</span>
        )}
        <input
          ref={internalRef}
          type="number"
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          aria-invalid={ariaInvalid ?? (error ? true : undefined)}
          className={cn(numberInputVariants({ size }), className)}
          {...props}
        />
        <NumberInputStepper
          size={size}
          disabled={disabled}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          canIncrement={canIncrementValue}
          canDecrement={canDecrementValue}
        />
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { numberInputVariants, numberInputWrapperVariants };
