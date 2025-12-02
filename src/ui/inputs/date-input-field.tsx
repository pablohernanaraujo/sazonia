import { forwardRef, useId } from 'react';

import { cn } from '@/lib/utils';

import { HINT_SIZE_MAP, INPUT_LABEL_SIZE_MAP } from './constants';
import { DateInput, type DateInputProps } from './date-input';
import { ErrorMessage, type ErrorMessageProps } from './error-message';
import { Hint, type HintProps } from './hint';
import { InputLabel, type InputLabelProps } from './input-label';

export interface DateInputFieldProps extends Omit<DateInputProps, 'error'> {
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
 * DateInputField - A convenience wrapper that composes DateInput with InputLabel, Hint, and ErrorMessage.
 *
 * Use this component for standard form fields where you need a label, input, and optional hint/error.
 * For custom layouts, use `DateInput` directly with the individual atom components.
 *
 * @example
 * ```tsx
 * import { DateInputField } from '@/ui/inputs';
 *
 * // Basic with label
 * <DateInputField
 *   label="Date of birth"
 *   placeholder="MM/DD/YYYY"
 * />
 *
 * // With required indicator
 * <DateInputField
 *   label="Start date"
 *   labelProps={{ required: true }}
 *   placeholder="MM/DD/YYYY"
 * />
 *
 * // With hint text
 * <DateInputField
 *   label="Event date"
 *   hint="Select a date within the next 30 days"
 *   placeholder="MM/DD/YYYY"
 * />
 *
 * // With error message (replaces hint)
 * <DateInputField
 *   label="Date of birth"
 *   hint="Enter your birth date"
 *   error="Please enter a valid date"
 *   placeholder="MM/DD/YYYY"
 * />
 *
 * // With date constraints
 * <DateInputField
 *   label="Appointment date"
 *   labelProps={{ required: true }}
 *   hint="Choose an available date"
 *   minDate={new Date()}
 *   maxDate={new Date(2025, 11, 31)}
 * />
 * ```
 */
export const DateInputField = forwardRef<HTMLInputElement, DateInputFieldProps>(
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
      // DateInput props
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

    // Map DateInput size to InputLabel/Hint/ErrorMessage size
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

        <DateInput
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

DateInputField.displayName = 'DateInputField';
