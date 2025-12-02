import React, { forwardRef, useId } from 'react';

import { cn } from '@/lib/utils';

import { HINT_SIZE_MAP, INPUT_LABEL_SIZE_MAP } from './constants';
import { ErrorMessage, type ErrorMessageProps } from './error-message';
import { Hint, type HintProps } from './hint';
import { InputLabel, type InputLabelProps } from './input-label';
import { TextInput, type TextInputProps } from './text-input';

interface AriaDescribedByParams {
  provided: string | undefined;
  hasError: boolean;
  hasHint: boolean;
  errorId: string;
  hintId: string;
}

function buildAriaDescribedBy(params: AriaDescribedByParams): string | undefined {
  if (params.provided) return params.provided;
  if (params.hasError) return params.errorId;
  if (params.hasHint) return params.hintId;
  return undefined;
}

interface RenderLabelParams {
  label: string | undefined;
  inputId: string;
  labelSize: 'sm' | 'md';
  labelProps?: Partial<Omit<InputLabelProps, 'label' | 'htmlFor'>>;
}

function renderLabel(params: RenderLabelParams): React.ReactNode {
  if (!params.label) return null;
  return (
    <InputLabel
      label={params.label}
      htmlFor={params.inputId}
      size={params.labelSize}
      {...params.labelProps}
    />
  );
}

interface RenderFeedbackParams {
  hasHint: boolean;
  hasError: boolean;
  hint: string | undefined;
  error: string | undefined;
  hintId: string;
  errorId: string;
  hintSize: 'sm' | 'md';
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;
}

function renderFeedback(params: RenderFeedbackParams): React.ReactNode {
  if (params.hasError && params.error) {
    return (
      <ErrorMessage
        id={params.errorId}
        text={params.error}
        size={params.hintSize}
        {...params.errorProps}
      />
    );
  }
  if (params.hasHint && params.hint) {
    return (
      <Hint id={params.hintId} size={params.hintSize} {...params.hintProps}>
        {params.hint}
      </Hint>
    );
  }
  return null;
}

export interface TextInputFieldProps extends Omit<TextInputProps, 'error'> {
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
 * TextInputField - A convenience wrapper that composes TextInput with InputLabel, Hint, and ErrorMessage.
 *
 * Use this component for standard form fields where you need a label, input, and optional hint/error.
 * For custom layouts (e.g., label with "Forgot password?" link), use `TextInput` directly with
 * the individual atom components.
 *
 * @example
 * ```tsx
 * import { TextInputField } from '@/ui/inputs';
 *
 * // Basic with label
 * <TextInputField
 *   label="Email address"
 *   placeholder="you@example.com"
 * />
 *
 * // With required indicator
 * <TextInputField
 *   label="Email address"
 *   labelProps={{ required: true }}
 *   placeholder="you@example.com"
 * />
 *
 * // With hint text
 * <TextInputField
 *   label="Email address"
 *   hint="We'll never share your email with anyone."
 *   placeholder="you@example.com"
 * />
 *
 * // With error message (replaces hint)
 * <TextInputField
 *   label="Email address"
 *   hint="We'll never share your email."
 *   error="Please enter a valid email address."
 *   placeholder="you@example.com"
 * />
 *
 * // Full featured
 * <TextInputField
 *   label="Password"
 *   labelProps={{ required: true, showIcon: true }}
 *   hint="At least 8 characters"
 *   placeholder="Enter password"
 * />
 * ```
 */
export const TextInputField = forwardRef<HTMLInputElement, TextInputFieldProps>(
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
      // TextInput props
      size = 'lg',
      id: providedId,
      'aria-describedby': providedAriaDescribedBy,
      ...inputProps
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = providedId ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const hasError = Boolean(error);
    const hasHint = Boolean(hint) && !hasError;

    const ariaDescribedBy = buildAriaDescribedBy({
      provided: providedAriaDescribedBy,
      hasError,
      hasHint,
      errorId,
      hintId,
    });

    const labelSize = INPUT_LABEL_SIZE_MAP[size];
    const hintSize = HINT_SIZE_MAP[size];

    return (
      <div className={cn('flex flex-col', containerClassName)}>
        {renderLabel({ label, inputId, labelSize, labelProps })}

        <TextInput
          ref={ref}
          id={inputId}
          size={size}
          error={hasError}
          aria-describedby={ariaDescribedBy}
          aria-invalid={hasError || undefined}
          aria-required={labelProps?.required || undefined}
          {...inputProps}
        />

        {renderFeedback({
          hasHint,
          hasError,
          hint,
          error,
          hintId,
          errorId,
          hintSize,
          hintProps,
          errorProps,
        })}
      </div>
    );
  }
);

TextInputField.displayName = 'TextInputField';
