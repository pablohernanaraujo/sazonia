'use client';

import { forwardRef, type ReactNode, useId } from 'react';

import { cn } from '@/lib/utils';

import { HINT_SIZE_MAP, INPUT_LABEL_SIZE_MAP } from './constants';
import { ErrorMessage, type ErrorMessageProps } from './error-message';
import { Hint, type HintProps } from './hint';
import { InputLabel, type InputLabelProps } from './input-label';
import {
  Select,
  SelectContent,
  SelectItem,
  type SelectProps,
  SelectTrigger,
  type SelectTriggerProps,
  SelectValue,
} from './select';

interface AriaDescribedByParams {
  hasError: boolean;
  hasHint: boolean;
  errorId: string;
  hintId: string;
}

/**
 * Computes aria-describedby value based on error/hint state
 */
function getAriaDescribedBy(params: AriaDescribedByParams): string | undefined {
  if (params.hasError) return params.errorId;
  if (params.hasHint) return params.hintId;
  return undefined;
}

/**
 * Returns aria-invalid attribute value
 */
function getAriaInvalid(hasError: boolean): true | undefined {
  return hasError || undefined;
}

/**
 * Returns aria-required attribute value
 */
function getAriaRequired(required?: boolean): true | undefined {
  return required || undefined;
}

export interface SelectOption {
  /**
   * The value of the option (used for selection)
   */
  value: string;
  /**
   * The display label for the option
   */
  label: string;
  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
}

export interface SelectFieldProps
  extends
    Omit<SelectProps, 'children'>,
    Pick<SelectTriggerProps, 'variant' | 'leftAddOn'> {
  /**
   * Label text for the select field.
   * When provided, renders an InputLabel above the select.
   */
  label?: string;

  /**
   * Additional props to pass to the InputLabel component.
   * Excludes `label` and `htmlFor` which are handled internally.
   */
  labelProps?: Partial<Omit<InputLabelProps, 'label' | 'htmlFor'>>;

  /**
   * Hint text displayed below the select.
   * Hidden when an error message is present.
   */
  hint?: string;

  /**
   * Additional props to pass to the Hint component.
   * Excludes `children` and `id` which are handled internally.
   */
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;

  /**
   * Error message displayed below the select.
   * When provided, replaces the hint text and applies error styling.
   */
  error?: string;

  /**
   * Additional props to pass to the ErrorMessage component.
   * Excludes `text` and `id` which are handled internally.
   */
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;

  /**
   * Placeholder text shown when no value is selected.
   */
  placeholder?: string;

  /**
   * Array of options to display in the dropdown.
   */
  options: SelectOption[];

  /**
   * Additional CSS classes for the field container.
   */
  containerClassName?: string;

  /**
   * Additional CSS classes for the trigger.
   */
  triggerClassName?: string;

  /**
   * Whether the select is disabled.
   */
  disabled?: boolean;

  /**
   * Custom render function for options.
   * If not provided, options are rendered as simple text.
   */
  renderOption?: (option: SelectOption) => ReactNode;
}

/**
 * SelectField - A convenience wrapper that composes Select with InputLabel, Hint, and ErrorMessage.
 *
 * Use this component for standard form fields where you need a label, select, and optional hint/error.
 * For custom layouts or complex dropdowns, use `Select` directly with the individual components.
 *
 * @example
 * ```tsx
 * import { SelectField } from '@/ui/inputs';
 *
 * // Basic with label
 * <SelectField
 *   label="Country"
 *   placeholder="Select a country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' },
 *     { value: 'mx', label: 'Mexico' },
 *   ]}
 * />
 *
 * // With required indicator
 * <SelectField
 *   label="Country"
 *   labelProps={{ required: true }}
 *   placeholder="Select a country"
 *   options={countries}
 * />
 *
 * // With hint text
 * <SelectField
 *   label="Category"
 *   hint="Choose the category that best describes your item"
 *   placeholder="Select category"
 *   options={categories}
 * />
 *
 * // With error message (replaces hint)
 * <SelectField
 *   label="Status"
 *   hint="Select the current status"
 *   error="Please select a status"
 *   placeholder="Select status"
 *   options={statuses}
 * />
 *
 * // Controlled
 * const [value, setValue] = useState<string>('');
 * <SelectField
 *   label="Priority"
 *   value={value}
 *   onValueChange={setValue}
 *   options={priorities}
 * />
 * ```
 */
export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
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
      triggerClassName,
      // Select props
      size = 'lg',
      variant,
      leftAddOn,
      placeholder,
      options,
      disabled,
      renderOption,
      ...selectProps
    },
    ref
  ) => {
    // Generate unique IDs
    const generatedId = useId();
    const triggerId = `select-trigger-${generatedId}`;
    const hintId = `select-hint-${generatedId}`;
    const errorId = `select-error-${generatedId}`;

    // Determine which ID to use for aria-describedby
    const hasError = Boolean(error);
    const hasHint = Boolean(hint) && !hasError;

    // Compute aria attributes using helper functions
    const ariaDescribedBy = getAriaDescribedBy({
      hasError,
      hasHint,
      errorId,
      hintId,
    });
    const ariaInvalid = getAriaInvalid(hasError);
    const ariaRequired = getAriaRequired(labelProps?.required);

    // Map Select size to InputLabel/Hint/ErrorMessage size
    const labelSize = INPUT_LABEL_SIZE_MAP[size];
    const hintSize = HINT_SIZE_MAP[size];

    return (
      <div className={cn('flex flex-col', containerClassName)}>
        {label && (
          <InputLabel
            label={label}
            htmlFor={triggerId}
            size={labelSize}
            {...labelProps}
          />
        )}

        <Select size={size} disabled={disabled} {...selectProps}>
          <SelectTrigger
            ref={ref}
            id={triggerId}
            variant={variant}
            error={hasError}
            leftAddOn={leftAddOn}
            className={triggerClassName}
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            aria-required={ariaRequired}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {renderOption ? renderOption(option) : option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

SelectField.displayName = 'SelectField';
