'use client';

import { forwardRef, useId } from 'react';

import { cn } from '@/lib/utils';

import { ErrorMessage, type ErrorMessageProps } from './error-message';
import { Hint, type HintProps } from './hint';
import { SelectItem } from './select';
import { type SelectOption } from './select-field';
import {
  SelectFloatingLabel,
  type SelectFloatingLabelProps,
} from './select-floating-label';

export interface SelectFloatingLabelFieldProps extends Omit<
  SelectFloatingLabelProps,
  'children'
> {
  /**
   * Hint text displayed below the select.
   * Hidden when an error message is present.
   */
  hint?: string;

  /**
   * Error message displayed below the select.
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

  /**
   * Array of options to render as SelectItem components.
   * Alternative to passing children directly.
   */
  options?: SelectOption[];

  /**
   * Children elements (typically SelectItem components).
   * Use this when you need custom SelectItem configurations.
   */
  children?: React.ReactNode;

  /**
   * ID for the select trigger, used for ARIA associations.
   * Auto-generated if not provided.
   */
  id?: string;

  /**
   * ARIA describedby override.
   */
  'aria-describedby'?: string;
}

/**
 * SelectFloatingLabelField - A convenience wrapper that composes SelectFloatingLabel
 * with Hint and ErrorMessage atoms.
 *
 * Use this component for standard form fields where you need a floating label select with
 * optional hint/error. For custom layouts, use `SelectFloatingLabel` directly.
 *
 * @example
 * ```tsx
 * import { SelectFloatingLabelField } from '@/ui/inputs';
 *
 * // Using options array (convenient)
 * <SelectFloatingLabelField
 *   label="Country"
 *   hint="Select your country of residence"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' },
 *     { value: 'mx', label: 'Mexico' },
 *   ]}
 * />
 *
 * // With required indicator
 * <SelectFloatingLabelField
 *   label="Country"
 *   required
 *   hint="Required field"
 *   options={countryOptions}
 * />
 *
 * // With error message (replaces hint)
 * <SelectFloatingLabelField
 *   label="Country"
 *   hint="Select your country"
 *   errorMessage="Please select a country"
 *   options={countryOptions}
 * />
 *
 * // Using children for custom rendering
 * <SelectFloatingLabelField label="Country" hint="Select your country">
 *   <SelectItem value="us">United States</SelectItem>
 *   <SelectItem value="ca">Canada</SelectItem>
 * </SelectFloatingLabelField>
 * ```
 */
export const SelectFloatingLabelField = forwardRef<
  HTMLButtonElement,
  SelectFloatingLabelFieldProps
>(
  (
    {
      hint,
      errorMessage,
      hintProps,
      errorProps,
      containerClassName,
      options,
      children,
      id: providedId,
      'aria-describedby': providedAriaDescribedBy,
      ...selectProps
    },
    ref
  ) => {
    // Generate unique IDs using useId()
    const generatedId = useId();
    const selectId = providedId ?? generatedId;
    const hintId = `${selectId}-hint`;
    const errorId = `${selectId}-error`;

    // Determine which ID to use for aria-describedby
    const hasError = Boolean(errorMessage);
    const hasHint = Boolean(hint) && !hasError;

    // Build aria-describedby value
    const ariaDescribedBy =
      providedAriaDescribedBy ??
      (hasError ? errorId : hasHint ? hintId : undefined);

    // Render options from array or use children
    const renderOptions = (): React.ReactNode => {
      if (options && options.length > 0) {
        return options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ));
      }
      return children;
    };

    return (
      <div className={cn('flex flex-col', containerClassName)}>
        <SelectFloatingLabel
          ref={ref}
          error={hasError || selectProps.error}
          aria-describedby={ariaDescribedBy}
          {...selectProps}
        >
          {renderOptions()}
        </SelectFloatingLabel>

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

SelectFloatingLabelField.displayName = 'SelectFloatingLabelField';
