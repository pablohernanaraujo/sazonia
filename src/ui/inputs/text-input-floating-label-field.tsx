import { forwardRef, useId } from 'react';

import { cn } from '@/lib/utils';

import { ErrorMessage, type ErrorMessageProps } from './error-message';
import { Hint, type HintProps } from './hint';
import {
  TextInputFloatingLabel,
  type TextInputFloatingLabelProps,
} from './text-input-floating-label';

export interface TextInputFloatingLabelFieldProps extends TextInputFloatingLabelProps {
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
 * TextInputFloatingLabelField - A convenience wrapper that composes TextInputFloatingLabel
 * with Hint and ErrorMessage atoms.
 *
 * Use this component for standard form fields where you need a floating label input with
 * optional hint/error. For custom layouts, use `TextInputFloatingLabel` directly.
 *
 * @example
 * ```tsx
 * import { TextInputFloatingLabelField } from '@/ui/inputs';
 *
 * // Basic with hint
 * <TextInputFloatingLabelField
 *   label="Email address"
 *   hint="We'll never share your email with anyone."
 *   placeholder="you@example.com"
 * />
 *
 * // With required indicator
 * <TextInputFloatingLabelField
 *   label="Email address"
 *   required
 *   hint="Required field"
 * />
 *
 * // With error message (replaces hint)
 * <TextInputFloatingLabelField
 *   label="Email address"
 *   hint="We'll never share your email."
 *   errorMessage="Please enter a valid email address."
 *   placeholder="you@example.com"
 * />
 *
 * // Full featured
 * <TextInputFloatingLabelField
 *   label="Password"
 *   required
 *   hint="At least 8 characters"
 *   placeholder="Enter password"
 *   type="password"
 * />
 * ```
 */
export const TextInputFloatingLabelField = forwardRef<
  HTMLInputElement,
  TextInputFloatingLabelFieldProps
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
        <TextInputFloatingLabel
          ref={ref}
          id={inputId}
          error={hasError || inputProps.error}
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

TextInputFloatingLabelField.displayName = 'TextInputFloatingLabelField';
