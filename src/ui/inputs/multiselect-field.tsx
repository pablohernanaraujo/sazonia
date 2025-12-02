'use client';

import { forwardRef, type ReactNode, useId } from 'react';

import { cn } from '@/lib/utils';

import { HINT_SIZE_MAP, INPUT_LABEL_SIZE_MAP } from './constants';
import { ErrorMessage, type ErrorMessageProps } from './error-message';
import { Hint, type HintProps } from './hint';
import { InputLabel, type InputLabelProps } from './input-label';
import {
  Multiselect,
  type MultiselectOption,
  MultiselectOptions,
  MultiselectPopoverContent,
  type MultiselectProps,
  MultiselectSearch,
  MultiselectTrigger,
  type MultiselectTriggerProps,
  MultiselectValue,
  type MultiselectValueProps,
} from './multiselect';

/**
 * Computes the aria-describedby value based on error/hint state
 */
function getAriaDescribedBy(options: {
  hasError: boolean;
  hasHint: boolean;
  errorId: string;
  hintId: string;
}): string | undefined {
  if (options.hasError) return options.errorId;
  if (options.hasHint) return options.hintId;
  return undefined;
}

export interface MultiselectFieldProps
  extends
    Omit<MultiselectProps, 'children'>,
    Pick<MultiselectTriggerProps, 'variant' | 'leftAddOn'>,
    Pick<MultiselectValueProps, 'maxDisplayTags' | 'displayMode'> {
  /**
   * Label text for the multiselect field.
   * When provided, renders an InputLabel above the multiselect.
   */
  label?: string;

  /**
   * Additional props to pass to the InputLabel component.
   * Excludes `label` and `htmlFor` which are handled internally.
   */
  labelProps?: Partial<Omit<InputLabelProps, 'label' | 'htmlFor'>>;

  /**
   * Hint text displayed below the multiselect.
   * Hidden when an error message is present.
   */
  hint?: string;

  /**
   * Additional props to pass to the Hint component.
   * Excludes `children` and `id` which are handled internally.
   */
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;

  /**
   * Error message displayed below the multiselect.
   * When provided, replaces the hint text and applies error styling.
   */
  error?: string;

  /**
   * Additional props to pass to the ErrorMessage component.
   * Excludes `text` and `id` which are handled internally.
   */
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;

  /**
   * Placeholder text shown when no values are selected.
   */
  placeholder?: string;

  /**
   * Whether to show a search input in the dropdown
   * @default true
   */
  showSearch?: boolean;

  /**
   * Placeholder text for the search input
   * @default 'Search...'
   */
  searchPlaceholder?: string;

  /**
   * Text to display when no options match the search
   * @default 'No options found'
   */
  emptyText?: string;

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
   * If not provided, options are rendered as simple text with checkboxes.
   */
  renderOption?: (option: MultiselectOption, isSelected: boolean) => ReactNode;
}

/**
 * MultiselectField - A convenience wrapper that composes Multiselect with InputLabel, Hint, and ErrorMessage.
 *
 * Use this component for standard form fields where you need a label, multiselect, and optional hint/error.
 * For custom layouts or complex dropdowns, use `Multiselect` directly with the individual components.
 *
 * @example
 * ```tsx
 * import { MultiselectField } from '@/ui/inputs';
 *
 * // Basic with label
 * <MultiselectField
 *   label="Countries"
 *   placeholder="Select countries"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' },
 *     { value: 'mx', label: 'Mexico' },
 *   ]}
 * />
 *
 * // With required indicator
 * <MultiselectField
 *   label="Countries"
 *   labelProps={{ required: true }}
 *   placeholder="Select countries"
 *   options={countries}
 * />
 *
 * // With hint text
 * <MultiselectField
 *   label="Categories"
 *   hint="Choose all categories that apply"
 *   placeholder="Select categories"
 *   options={categories}
 * />
 *
 * // With error message (replaces hint)
 * <MultiselectField
 *   label="Tags"
 *   hint="Select at least one tag"
 *   error="Please select at least one tag"
 *   placeholder="Select tags"
 *   options={tags}
 * />
 *
 * // Controlled
 * const [values, setValues] = useState<string[]>([]);
 * <MultiselectField
 *   label="Skills"
 *   value={values}
 *   onValueChange={setValues}
 *   options={skills}
 * />
 * ```
 */
export const MultiselectField = forwardRef<
  HTMLButtonElement,
  MultiselectFieldProps
>(
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
      // Multiselect props
      size = 'lg',
      variant,
      leftAddOn,
      placeholder,
      options,
      disabled,
      showSearch = true,
      searchPlaceholder = 'Search...',
      emptyText = 'No options found',
      renderOption,
      // Value display props
      maxDisplayTags,
      displayMode,
      ...multiselectProps
    },
    ref
  ) => {
    // Generate unique IDs
    const generatedId = useId();
    const triggerId = `multiselect-trigger-${generatedId}`;
    const hintId = `multiselect-hint-${generatedId}`;
    const errorId = `multiselect-error-${generatedId}`;

    // Determine which ID to use for aria-describedby
    const hasError = Boolean(error);
    const hasHint = Boolean(hint) && !hasError;

    // Build aria-describedby value
    const ariaDescribedBy = getAriaDescribedBy({
      hasError,
      hasHint,
      errorId,
      hintId,
    });

    // Map Multiselect size to InputLabel/Hint/ErrorMessage size
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

        <Multiselect
          size={size}
          options={options}
          disabled={disabled}
          {...multiselectProps}
        >
          <MultiselectTrigger
            ref={ref}
            id={triggerId}
            variant={variant}
            error={hasError}
            leftAddOn={leftAddOn}
            className={triggerClassName}
            aria-describedby={ariaDescribedBy}
            aria-invalid={hasError || undefined}
            aria-required={labelProps?.required || undefined}
          >
            <MultiselectValue
              placeholder={placeholder}
              maxDisplayTags={maxDisplayTags}
              displayMode={displayMode}
            />
          </MultiselectTrigger>

          <MultiselectPopoverContent>
            {showSearch && <MultiselectSearch placeholder={searchPlaceholder} />}
            <MultiselectOptions
              renderOption={renderOption}
              emptyText={emptyText}
            />
          </MultiselectPopoverContent>
        </Multiselect>

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

MultiselectField.displayName = 'MultiselectField';
