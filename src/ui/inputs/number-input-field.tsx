import { forwardRef, useId } from 'react';

import { cn } from '@/lib/utils';

import { ErrorMessage, type ErrorMessageProps } from './error-message';
import { Hint, type HintProps } from './hint';
import { InputLabel, type InputLabelProps } from './input-label';
import { NumberInput, type NumberInputProps } from './number-input';

/**
 * Size mapping from NumberInput sizes to InputLabel sizes.
 *
 * NumberInput has 3 sizes (sm, md, lg), while InputLabel has 2 sizes (sm, md).
 * This mapping ensures visual harmony between the input and its label.
 */
const INPUT_LABEL_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

/**
 * Size mapping from NumberInput sizes to Hint/ErrorMessage sizes.
 */
const HINT_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

export interface NumberInputFieldProps extends Omit<NumberInputProps, 'error'> {
  /**
   * Label text for the input field.
   * When provided, renders an InputLabel above the input.
   */
  label?: string;

  /**
   * Additional props to pass to the InputLabel component.
   * Excludes `label` and `htmlFor` which are handled internally.
   */
  labelProps?: Partial<Omit<InputLabelProps, 'label' | 'htmlFor'>>;

  /**
   * Hint text displayed below the input.
   * Hidden when an error message is present.
   */
  hint?: string;

  /**
   * Additional props to pass to the Hint component.
   * Excludes `children` and `id` which are handled internally.
   */
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;

  /**
   * Error message displayed below the input.
   * When provided, replaces the hint text and applies error styling.
   */
  error?: string;

  /**
   * Additional props to pass to the ErrorMessage component.
   * Excludes `text` and `id` which are handled internally.
   */
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;

  /**
   * Additional CSS classes for the field container.
   */
  containerClassName?: string;
}

/**
 * NumberInputField - A convenience wrapper that composes NumberInput with InputLabel, Hint, and ErrorMessage.
 *
 * Use this component for standard form fields where you need a label, input, and optional hint/error.
 * For custom layouts, use `NumberInput` directly with the individual atom components.
 *
 * @example
 * ```tsx
 * import { NumberInputField } from '@/ui/inputs';
 *
 * // Basic with label
 * <NumberInputField
 *   label="Quantity"
 *   placeholder="0"
 * />
 *
 * // With required indicator
 * <NumberInputField
 *   label="Quantity"
 *   labelProps={{ required: true }}
 *   placeholder="0"
 * />
 *
 * // With hint text
 * <NumberInputField
 *   label="Quantity"
 *   hint="Enter a value between 1 and 100"
 *   placeholder="0"
 *   min={1}
 *   max={100}
 * />
 *
 * // With error message (replaces hint)
 * <NumberInputField
 *   label="Quantity"
 *   hint="Enter a value between 1 and 100"
 *   error="Value must be at least 1"
 *   placeholder="0"
 * />
 *
 * // Full featured with prefix
 * <NumberInputField
 *   label="Price"
 *   labelProps={{ required: true }}
 *   hint="Enter price in dollars"
 *   leftAddOn={<span className="text-text-tertiary">$</span>}
 *   placeholder="0.00"
 *   step={0.01}
 *   min={0}
 * />
 * ```
 */
export const NumberInputField = forwardRef<
  HTMLInputElement,
  NumberInputFieldProps
>(
  (
    {
      // Field-level props
      label,
      labelProps,
      hint,
      hintProps,
      error,
      errorProps,
      containerClassName,
      // NumberInput props
      size = 'lg',
      id: providedId,
      'aria-describedby': providedAriaDescribedBy,
      ...inputProps
    },
    ref
  ) => {
    // Generate unique IDs using useId()
    const generatedId = useId();
    const inputId = providedId ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    // Determine which ID to use for aria-describedby
    const hasError = Boolean(error);
    const hasHint = Boolean(hint) && !hasError;

    // Build aria-describedby value
    const ariaDescribedBy =
      providedAriaDescribedBy ??
      (hasError ? errorId : hasHint ? hintId : undefined);

    // Map NumberInput size to InputLabel/Hint/ErrorMessage size
    const labelSize = INPUT_LABEL_SIZE_MAP[size];
    const hintSize = HINT_SIZE_MAP[size];

    return (
      <div className={cn('flex flex-col', containerClassName)}>
        {label && (
          <InputLabel
            label={label}
            htmlFor={inputId}
            size={labelSize}
            {...labelProps}
          />
        )}

        <NumberInput
          ref={ref}
          id={inputId}
          size={size}
          error={hasError}
          aria-describedby={ariaDescribedBy}
          aria-invalid={hasError || undefined}
          aria-required={labelProps?.required || undefined}
          {...inputProps}
        />

        {hasHint && (
          <Hint id={hintId} size={hintSize} {...hintProps}>
            {hint}
          </Hint>
        )}

        {hasError && error && (
          <ErrorMessage
            id={errorId}
            text={error}
            size={hintSize}
            {...errorProps}
          />
        )}
      </div>
    );
  }
);

NumberInputField.displayName = 'NumberInputField';
