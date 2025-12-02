import { forwardRef, useId } from 'react';

import { cn } from '@/lib/utils';

import { HINT_SIZE_MAP, INPUT_LABEL_SIZE_MAP } from './constants';
import { ErrorMessage, type ErrorMessageProps } from './error-message';
import { Hint, type HintProps } from './hint';
import { InputLabel, type InputLabelProps } from './input-label';
import { Textarea, type TextareaProps } from './textarea';

interface FieldIds {
  hintId: string;
  errorId: string;
}

interface FieldState {
  hasError: boolean;
  hasHint: boolean;
}

/**
 * Computes the aria-describedby value based on field state.
 */
function getAriaDescribedBy(
  providedAriaDescribedBy: string | undefined,
  state: FieldState,
  ids: FieldIds
): string | undefined {
  if (providedAriaDescribedBy) return providedAriaDescribedBy;
  if (state.hasError) return ids.errorId;
  if (state.hasHint) return ids.hintId;
  return undefined;
}

/**
 * Computes field state flags from props.
 */
function getFieldState(
  error: string | undefined,
  hint: string | undefined
): FieldState {
  const hasError = Boolean(error);
  return {
    hasError,
    hasHint: Boolean(hint) && !hasError,
  };
}

export interface TextareaFieldProps extends Omit<TextareaProps, 'error'> {
  /**
   * Label text for the textarea field.
   * When provided, renders an InputLabel above the textarea.
   */
  label?: string;

  /**
   * Additional props to pass to the InputLabel component.
   * Excludes `label` and `htmlFor` which are handled internally.
   */
  labelProps?: Partial<Omit<InputLabelProps, 'label' | 'htmlFor'>>;

  /**
   * Hint text displayed below the textarea.
   * Hidden when an error message is present.
   */
  hint?: string;

  /**
   * Additional props to pass to the Hint component.
   * Excludes `children` and `id` which are handled internally.
   */
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;

  /**
   * Error message displayed below the textarea.
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
 * TextareaField - A convenience wrapper that composes Textarea with InputLabel, Hint, and ErrorMessage.
 *
 * Use this component for standard form fields where you need a label, textarea, and optional hint/error.
 * For custom layouts, use `Textarea` directly with the individual atom components.
 *
 * @example
 * ```tsx
 * import { TextareaField } from '@/ui/inputs';
 *
 * // Basic with label
 * <TextareaField
 *   label="Description"
 *   placeholder="Enter a description..."
 * />
 *
 * // With required indicator
 * <TextareaField
 *   label="Description"
 *   labelProps={{ required: true }}
 *   placeholder="Enter a description..."
 * />
 *
 * // With hint text
 * <TextareaField
 *   label="Bio"
 *   hint="Tell us about yourself (max 500 characters)"
 *   placeholder="Enter your bio..."
 *   rows={4}
 * />
 *
 * // With error message (replaces hint)
 * <TextareaField
 *   label="Message"
 *   hint="Required field"
 *   error="Please enter a message"
 *   placeholder="Enter message..."
 * />
 *
 * // Full featured
 * <TextareaField
 *   label="Feedback"
 *   labelProps={{ required: true, showIcon: true }}
 *   hint="Your feedback helps us improve"
 *   placeholder="Share your thoughts..."
 *   rows={6}
 * />
 * ```
 */
export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
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
      // Textarea props
      size = 'lg',
      id: providedId,
      'aria-describedby': providedAriaDescribedBy,
      ...textareaProps
    },
    ref
  ) => {
    // Generate unique IDs using useId()
    const generatedId = useId();
    const textareaId = providedId ?? generatedId;
    const ids: FieldIds = {
      hintId: `${textareaId}-hint`,
      errorId: `${textareaId}-error`,
    };

    // Determine field state
    const state = getFieldState(error, hint);

    // Map Textarea size to InputLabel/Hint/ErrorMessage size
    const labelSize = INPUT_LABEL_SIZE_MAP[size];
    const hintSize = HINT_SIZE_MAP[size];

    // Build aria-describedby value
    const ariaDescribedBy = getAriaDescribedBy(
      providedAriaDescribedBy,
      state,
      ids
    );

    return (
      <div className={cn('flex flex-col', containerClassName)}>
        {label && (
          <InputLabel
            label={label}
            htmlFor={textareaId}
            size={labelSize}
            {...labelProps}
          />
        )}

        <Textarea
          ref={ref}
          id={textareaId}
          size={size}
          error={state.hasError}
          aria-describedby={ariaDescribedBy}
          aria-invalid={state.hasError || undefined}
          aria-required={labelProps?.required || undefined}
          {...textareaProps}
        />

        {state.hasHint && (
          <Hint id={ids.hintId} size={hintSize} {...hintProps}>
            {hint}
          </Hint>
        )}

        {state.hasError && error && (
          <ErrorMessage
            id={ids.errorId}
            text={error}
            size={hintSize}
            {...errorProps}
          />
        )}
      </div>
    );
  }
);

TextareaField.displayName = 'TextareaField';
