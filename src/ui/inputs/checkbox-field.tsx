import { forwardRef, useId } from 'react';

import { cn } from '@/lib/utils';

import { Checkbox, type CheckboxProps } from './checkbox';
import { ErrorMessage, type ErrorMessageProps } from './error-message';
import { Hint, type HintProps } from './hint';

/**
 * Size mapping for checkbox label typography.
 * Maps CheckboxField sizes to label styling.
 */
const CHECKBOX_LABEL_SIZE_MAP = {
  sm: { gap: 'gap-3', fontSize: 'text-sm', lineHeight: 'leading-5' },
  md: { gap: 'gap-3', fontSize: 'text-base', lineHeight: 'leading-6' },
  lg: { gap: 'gap-3', fontSize: 'text-base', lineHeight: 'leading-6' },
} as const;

/**
 * Size mapping for hint/error messages.
 * Maps CheckboxField sizes to Hint/ErrorMessage sizes.
 */
const CHECKBOX_HINT_SIZE_MAP = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const;

/**
 * Builds the aria-describedby value based on error/hint state.
 */
function buildAriaDescribedBy(
  providedAriaDescribedBy: string | undefined,
  hasError: boolean,
  hasHint: boolean,
  errorId: string,
  hintId: string
): string | undefined {
  if (providedAriaDescribedBy) return providedAriaDescribedBy;
  if (hasError) return errorId;
  if (hasHint) return hintId;
  return undefined;
}

export interface CheckboxFieldProps extends Omit<CheckboxProps, 'error'> {
  /**
   * Label text displayed next to the checkbox.
   */
  label: string;

  /**
   * Additional CSS classes for the label element.
   */
  labelClassName?: string;

  /**
   * Hint text displayed below the checkbox.
   * Hidden when an error message is present.
   */
  hint?: string;

  /**
   * Additional props to pass to the Hint component.
   * Excludes `children` and `id` which are handled internally.
   */
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;

  /**
   * Error message displayed below the checkbox.
   * When provided, replaces the hint text.
   */
  error?: string;

  /**
   * Additional props to pass to the ErrorMessage component.
   * Excludes `text` and `id` which are handled internally.
   */
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;

  /**
   * Shows required indicator (red asterisk) in the label.
   * Also sets aria-required on the checkbox.
   */
  required?: boolean;

  /**
   * Additional CSS classes for the field container.
   */
  containerClassName?: string;
}

/**
 * CheckboxField - A complete checkbox form field with label, hint, and error message.
 *
 * Follows the established `-field` composition pattern used by TextInputField,
 * SelectField, and other form field components.
 *
 * @example
 * // Basic usage
 * <CheckboxField label="Accept terms" />
 *
 * // With hint
 * <CheckboxField
 *   label="Subscribe to newsletter"
 *   hint="You can unsubscribe at any time"
 * />
 *
 * // With error
 * <CheckboxField
 *   label="Accept terms"
 *   required
 *   error="You must accept the terms"
 * />
 */
export const CheckboxField = forwardRef<
  React.ComponentRef<typeof Checkbox>,
  CheckboxFieldProps
>(
  (
    {
      label,
      labelClassName,
      hint,
      hintProps,
      error,
      errorProps,
      required = false,
      containerClassName,
      size = 'md',
      id: providedId,
      disabled,
      'aria-describedby': providedAriaDescribedBy,
      ...checkboxProps
    },
    ref
  ) => {
    // Generate unique IDs
    const generatedId = useId();
    const checkboxId = providedId ?? generatedId;
    const hintId = `${checkboxId}-hint`;
    const errorId = `${checkboxId}-error`;

    // Determine which ID to use for aria-describedby
    const hasError = Boolean(error);
    const hasHint = Boolean(hint) && !hasError;

    // Build aria-describedby value
    const ariaDescribedBy = buildAriaDescribedBy(
      providedAriaDescribedBy,
      hasError,
      hasHint,
      errorId,
      hintId
    );

    // Get sizes for current checkbox size (size is guaranteed to be 'sm' | 'md' | 'lg' due to default)
    const resolvedSize = size ?? 'md';
    const labelStyles = CHECKBOX_LABEL_SIZE_MAP[resolvedSize];
    const hintSize = CHECKBOX_HINT_SIZE_MAP[resolvedSize];

    return (
      <div className={cn('flex flex-col', containerClassName)}>
        {/* Checkbox + Label Row */}
        <div className={cn('flex items-center', labelStyles.gap)}>
          <Checkbox
            ref={ref}
            id={checkboxId}
            size={size}
            disabled={disabled}
            error={hasError}
            aria-describedby={ariaDescribedBy}
            aria-invalid={hasError || undefined}
            aria-required={required || undefined}
            {...checkboxProps}
          />
          <label
            htmlFor={checkboxId}
            className={cn(
              'cursor-pointer font-sans font-normal text-text-primary',
              disabled && 'cursor-not-allowed text-text-secondary',
              labelStyles.fontSize,
              labelStyles.lineHeight,
              labelClassName
            )}
          >
            {label}
            {required && (
              <span
                className="ml-0.5 text-sm leading-5 text-destructive"
                aria-hidden="true"
              >
                *
              </span>
            )}
          </label>
        </div>

        {/* Hint or Error Message */}
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

CheckboxField.displayName = 'CheckboxField';

export { CHECKBOX_HINT_SIZE_MAP, CHECKBOX_LABEL_SIZE_MAP };
