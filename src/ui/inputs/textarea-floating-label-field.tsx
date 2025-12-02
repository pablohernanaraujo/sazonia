import { forwardRef, useId } from 'react';

import { cn } from '@/lib/utils';

import { ErrorMessage, type ErrorMessageProps } from './error-message';
import { Hint, type HintProps } from './hint';
import {
  TextareaFloatingLabel,
  type TextareaFloatingLabelProps,
} from './textarea-floating-label';

export interface TextareaFloatingLabelFieldProps extends TextareaFloatingLabelProps {
  /**
   * Hint text displayed below the textarea.
   * Hidden when an error message is present.
   */
  hint?: string;

  /**
   * Error message displayed below the textarea.
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
 * TextareaFloatingLabelField - A convenience wrapper that composes TextareaFloatingLabel
 * with Hint and ErrorMessage atoms.
 *
 * Use this component for standard form fields where you need a floating label textarea with
 * optional hint/error. For custom layouts, use `TextareaFloatingLabel` directly.
 *
 * @example
 * ```tsx
 * import { TextareaFloatingLabelField } from '@/ui/inputs';
 *
 * // Basic with hint
 * <TextareaFloatingLabelField
 *   label="Description"
 *   hint="Provide a detailed description."
 *   placeholder="Enter description..."
 * />
 *
 * // With required indicator
 * <TextareaFloatingLabelField
 *   label="Comments"
 *   required
 *   hint="Required field"
 * />
 *
 * // With error message (replaces hint)
 * <TextareaFloatingLabelField
 *   label="Message"
 *   hint="Enter your message."
 *   errorMessage="Please enter a valid message."
 *   placeholder="Enter message..."
 * />
 *
 * // Full featured
 * <TextareaFloatingLabelField
 *   label="Feedback"
 *   required
 *   hint="Maximum 500 characters"
 *   placeholder="Share your feedback..."
 *   rows={6}
 * />
 * ```
 */
export const TextareaFloatingLabelField = forwardRef<
  HTMLTextAreaElement,
  TextareaFloatingLabelFieldProps
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
      ...textareaProps
    },
    ref
  ) => {
    // Generate unique IDs using useId()
    const generatedId = useId();
    const textareaId = providedId ?? generatedId;
    const hintId = `${textareaId}-hint`;
    const errorId = `${textareaId}-error`;

    // Determine which ID to use for aria-describedby
    const hasError = Boolean(errorMessage);
    const hasHint = Boolean(hint) && !hasError;

    // Build aria-describedby value
    const ariaDescribedBy =
      providedAriaDescribedBy ??
      (hasError ? errorId : hasHint ? hintId : undefined);

    return (
      <div className={cn('flex flex-col', containerClassName)}>
        <TextareaFloatingLabel
          ref={ref}
          id={textareaId}
          error={hasError || textareaProps.error}
          aria-describedby={ariaDescribedBy}
          {...textareaProps}
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

TextareaFloatingLabelField.displayName = 'TextareaFloatingLabelField';
