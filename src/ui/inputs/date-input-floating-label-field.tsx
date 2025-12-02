import { forwardRef, useId } from 'react';

import { cn } from '@/lib/utils';

import {
  DateInputFloatingLabel,
  type DateInputFloatingLabelProps,
} from './date-input-floating-label';
import { ErrorMessage, type ErrorMessageProps } from './error-message';
import { Hint, type HintProps } from './hint';

export interface DateInputFloatingLabelFieldProps extends DateInputFloatingLabelProps {
  /**
   * Hint text displayed below the input.
   * Hidden when an error message is present.
   */
  hint?: string;

  /**
   * Error message displayed below the input.
   * When provided, replaces the hint text and applies error styling.
   */
  errorMessage?: string;

  /**
   * Additional props to pass to the Hint component.
   * Excludes `children` and `id` which are handled internally.
   */
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;

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
 * DateInputFloatingLabelField - A convenience wrapper that composes DateInputFloatingLabel
 * with Hint and ErrorMessage atoms.
 *
 * Use this component for standard form fields where you need a floating label date input with
 * optional hint/error. For custom layouts, use `DateInputFloatingLabel` directly.
 *
 * @example
 * ```tsx
 * import { DateInputFloatingLabelField } from '@/ui/inputs';
 *
 * // Basic with hint
 * <DateInputFloatingLabelField
 *   label="Date of birth"
 *   hint="Enter in MM/DD/YYYY format"
 * />
 *
 * // With required indicator
 * <DateInputFloatingLabelField
 *   label="Event date"
 *   required
 *   hint="Required field"
 * />
 *
 * // With error message (replaces hint)
 * <DateInputFloatingLabelField
 *   label="Date"
 *   hint="Select a valid date"
 *   errorMessage="Please select a date within the allowed range"
 * />
 *
 * // With constraints
 * <DateInputFloatingLabelField
 *   label="Appointment date"
 *   required
 *   hint="Select a future date"
 *   minDate={new Date()}
 * />
 * ```
 */
export const DateInputFloatingLabelField = forwardRef<
  HTMLInputElement,
  DateInputFloatingLabelFieldProps
>(
  (
    {
      hint,
      errorMessage,
      hintProps,
      errorProps,
      containerClassName,
      id: providedId,
      'aria-describedby': providedAriaDescribedBy,
      error: errorProp,
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
    const hasError = Boolean(errorMessage);
    const hasHint = Boolean(hint) && !hasError;

    // Build aria-describedby value
    const ariaDescribedBy =
      providedAriaDescribedBy ??
      (hasError ? errorId : hasHint ? hintId : undefined);

    return (
      <div className={cn('flex flex-col', containerClassName)}>
        <DateInputFloatingLabel
          ref={ref}
          id={inputId}
          error={hasError || errorProp}
          aria-describedby={ariaDescribedBy}
          {...inputProps}
        />

        {hasHint && (
          <Hint id={hintId} {...hintProps}>
            {hint}
          </Hint>
        )}

        {hasError && errorMessage && (
          <ErrorMessage id={errorId} text={errorMessage} {...errorProps} />
        )}
      </div>
    );
  }
);

DateInputFloatingLabelField.displayName = 'DateInputFloatingLabelField';
