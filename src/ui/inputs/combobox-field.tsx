'use client';

import { forwardRef, type ReactNode, useId, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  type ComboboxOption,
  type ComboboxProps,
  ComboboxTrigger,
  type ComboboxTriggerProps,
} from './combobox';
import { HINT_SIZE_MAP, INPUT_LABEL_SIZE_MAP } from './constants';
import { ErrorMessage, type ErrorMessageProps } from './error-message';
import { Hint, type HintProps } from './hint';
import { InputLabel, type InputLabelProps } from './input-label';

export interface ComboboxFieldProps
  extends
    Omit<ComboboxProps, 'children'>,
    Pick<ComboboxTriggerProps, 'variant' | 'leftAddOn' | 'showClear'> {
  /**
   * Label text for the combobox field.
   * When provided, renders an InputLabel above the combobox.
   */
  label?: string;

  /**
   * Additional props to pass to the InputLabel component.
   * Excludes `label` and `htmlFor` which are handled internally.
   */
  labelProps?: Partial<Omit<InputLabelProps, 'label' | 'htmlFor'>>;

  /**
   * Hint text displayed below the combobox.
   * Hidden when an error message is present.
   */
  hint?: string;

  /**
   * Additional props to pass to the Hint component.
   * Excludes `children` and `id` which are handled internally.
   */
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;

  /**
   * Error message displayed below the combobox.
   * When provided, replaces the hint text and applies error styling.
   */
  errorMessage?: string;

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
  options: ComboboxOption[];

  /**
   * Custom filter function for options.
   * If not provided, default case-insensitive label matching is used.
   */
  filterOptions?: (options: ComboboxOption[], query: string) => ComboboxOption[];

  /**
   * Additional CSS classes for the field container.
   */
  containerClassName?: string;

  /**
   * Additional CSS classes for the trigger.
   */
  triggerClassName?: string;

  /**
   * Custom render function for options.
   * If not provided, options are rendered as simple text.
   */
  renderOption?: (option: ComboboxOption) => ReactNode;

  /**
   * Empty state message when no options match the filter
   * @default 'No results found'
   */
  emptyMessage?: string;
}

/**
 * Default filter function - case-insensitive label matching
 */
const defaultFilterOptions = (
  options: ComboboxOption[],
  query: string
): ComboboxOption[] => {
  if (!query) return options;
  const lowerQuery = query.toLowerCase();
  return options.filter((opt) => opt.label.toLowerCase().includes(lowerQuery));
};

/**
 * Compute aria-describedby value based on error/hint state
 */
const getAriaDescribedBy = (
  hasError: boolean,
  hasHint: boolean,
  errorId: string,
  hintId: string
): string | undefined => {
  if (hasError) return errorId;
  if (hasHint) return hintId;
  return undefined;
};

/**
 * ComboboxField - A convenience wrapper that composes Combobox with InputLabel, Hint, and ErrorMessage.
 *
 * Use this component for standard form fields where you need a label, combobox, and optional hint/error.
 * For custom layouts or complex dropdowns, use `Combobox` directly with the individual components.
 *
 * @example
 * ```tsx
 * import { ComboboxField } from '@/ui/inputs';
 *
 * // Basic with label
 * <ComboboxField
 *   label="Country"
 *   placeholder="Search countries..."
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' },
 *     { value: 'mx', label: 'Mexico' },
 *   ]}
 * />
 *
 * // With required indicator
 * <ComboboxField
 *   label="Country"
 *   labelProps={{ required: true }}
 *   placeholder="Search countries..."
 *   options={countries}
 * />
 *
 * // With hint text
 * <ComboboxField
 *   label="Category"
 *   hint="Type to search or select from the list"
 *   placeholder="Search categories..."
 *   options={categories}
 * />
 *
 * // With error message (replaces hint)
 * <ComboboxField
 *   label="Status"
 *   hint="Select the current status"
 *   errorMessage="Please select a status"
 *   placeholder="Search statuses..."
 *   options={statuses}
 * />
 *
 * // Controlled
 * const [value, setValue] = useState<string>('');
 * <ComboboxField
 *   label="Priority"
 *   value={value}
 *   onValueChange={setValue}
 *   options={priorities}
 * />
 * ```
 */
export const ComboboxField = forwardRef<HTMLDivElement, ComboboxFieldProps>(
  (
    {
      // Field-level props
      label,
      labelProps,
      hint,
      hintProps,
      errorMessage,
      errorProps,
      containerClassName,
      triggerClassName,
      // Combobox props
      size = 'lg',
      variant,
      leftAddOn,
      showClear,
      placeholder,
      options,
      filterOptions = defaultFilterOptions,
      disabled,
      error,
      renderOption,
      emptyMessage = 'No results found',
      onQueryChange,
      ...comboboxProps
    },
    ref
  ) => {
    // Generate unique IDs
    const generatedId = useId();
    const inputId = `combobox-input-${generatedId}`;
    const hintId = `combobox-hint-${generatedId}`;
    const errorId = `combobox-error-${generatedId}`;

    // Internal query state for filtering
    const [internalQuery, setInternalQuery] = useState('');

    // Handle query changes
    const handleQueryChange = (query: string): void => {
      setInternalQuery(query);
      onQueryChange?.(query);
    };

    // Apply filtering
    const filteredOptions = useMemo(
      () => filterOptions(options, internalQuery),
      [filterOptions, options, internalQuery]
    );

    // Determine which ID to use for aria-describedby
    const hasError = Boolean(errorMessage) || Boolean(error);
    const hasHint = Boolean(hint) && !hasError;
    const ariaDescribedBy = getAriaDescribedBy(
      hasError,
      hasHint,
      errorId,
      hintId
    );

    // Map Combobox size to InputLabel/Hint/ErrorMessage size
    const labelSize = INPUT_LABEL_SIZE_MAP[size];
    const hintSize = HINT_SIZE_MAP[size];

    return (
      <div ref={ref} className={cn('flex flex-col', containerClassName)}>
        {label && (
          <InputLabel
            label={label}
            htmlFor={inputId}
            size={labelSize}
            {...labelProps}
          />
        )}

        <Combobox
          size={size}
          disabled={disabled}
          error={hasError}
          onQueryChange={handleQueryChange}
          {...comboboxProps}
        >
          <ComboboxTrigger
            variant={variant}
            leftAddOn={leftAddOn}
            showClear={showClear}
            className={triggerClassName}
          >
            <ComboboxInput
              id={inputId}
              placeholder={placeholder}
              options={options}
              filteredOptions={filteredOptions}
              aria-describedby={ariaDescribedBy}
              aria-invalid={hasError || undefined}
              aria-required={labelProps?.required || undefined}
            />
          </ComboboxTrigger>
          <ComboboxContent>
            {filteredOptions.length === 0 ? (
              <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
            ) : (
              filteredOptions.map((option, index) => (
                <ComboboxItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  index={index}
                >
                  {renderOption ? renderOption(option) : option.label}
                </ComboboxItem>
              ))
            )}
          </ComboboxContent>
        </Combobox>

        {hasHint && (
          <Hint id={hintId} size={hintSize} {...hintProps}>
            {hint}
          </Hint>
        )}

        {hasError && errorMessage && (
          <ErrorMessage
            id={errorId}
            text={errorMessage}
            size={hintSize}
            {...errorProps}
          />
        )}
      </div>
    );
  }
);

ComboboxField.displayName = 'ComboboxField';
