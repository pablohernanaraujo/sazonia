import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type FocusEvent,
  forwardRef,
  RefObject,
  useCallback,
  useId,
  useRef,
  useState,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

interface UseFloatingLabelStateOptions {
  value: string | number | readonly string[] | undefined;
  defaultValue: string | number | readonly string[] | undefined;
  placeholder: string | undefined;
  onFocus?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

interface UseFloatingLabelStateReturn {
  isFocused: boolean;
  shouldFloat: boolean;
  handleFocus: (e: FocusEvent<HTMLTextAreaElement>) => void;
  handleBlur: (e: FocusEvent<HTMLTextAreaElement>) => void;
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

/**
 * Custom hook to manage floating label state for textarea.
 * Extracts focus, value tracking, and float calculation logic.
 */
function useFloatingLabelState(
  options: UseFloatingLabelStateOptions
): UseFloatingLabelStateReturn {
  const { value, defaultValue, placeholder, onFocus, onBlur, onChange } = options;
  const [isFocused, setIsFocused] = useState(false);
  const [internalHasValue, setInternalHasValue] = useState(
    Boolean(value || defaultValue)
  );

  const hasValue = value !== undefined ? Boolean(value) : internalHasValue;
  const shouldFloat = isFocused || hasValue || Boolean(placeholder && isFocused);

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInternalHasValue(Boolean(e.target.value));
      onChange?.(e);
    },
    [onChange]
  );

  return {
    isFocused,
    shouldFloat,
    handleFocus,
    handleBlur,
    handleChange,
  };
}

/**
 * TextareaFloatingLabel wrapper variants for the container.
 *
 * Handles border colors, background, and focus states.
 */
const textareaFloatingLabelWrapperVariants = cva(
  ['relative flex', 'rounded-sm border', 'transition-colors duration-150'],
  {
    variants: {
      error: {
        true: 'border-2 border-destructive focus-within:border-destructive',
        false: [
          'border border-border',
          'hover:border-border-hover',
          'focus-within:border-2 focus-within:border-primary',
        ],
      },
      disabled: {
        true: 'cursor-not-allowed bg-background-secondary',
        false: 'bg-background',
      },
    },
    defaultVariants: {
      error: false,
      disabled: false,
    },
  }
);

/**
 * Floating label variants for textarea with compound variants for state-based styling.
 *
 * Handles position, scale, and color based on:
 * - floating: Whether label is in floating position (above) or inline (placeholder)
 * - error: Whether textarea is in error state
 * - focused: Whether textarea is currently focused
 * - disabled: Whether textarea is disabled
 */
const textareaFloatingLabelVariants = cva(
  [
    'absolute left-3 px-1',
    'transition-all duration-150 ease-out',
    'pointer-events-none',
    'origin-left',
  ],
  {
    variants: {
      floating: {
        true: 'top-0 -translate-y-1/2 scale-75 bg-background text-xs font-medium',
        false: 'top-3.5 scale-100 bg-transparent text-base font-normal',
      },
      error: {
        true: '',
        false: '',
      },
      focused: {
        true: '',
        false: '',
      },
      disabled: {
        true: 'text-text-tertiary',
        false: '',
      },
    },
    compoundVariants: [
      // Error state always takes precedence (regardless of focus)
      {
        error: true,
        className: 'text-destructive',
      },
      // Floating + focused (not error) = brand color
      {
        floating: true,
        focused: true,
        error: false,
        disabled: false,
        className: 'text-primary',
      },
      // Floating + not focused + not error = tertiary color
      {
        floating: true,
        focused: false,
        error: false,
        disabled: false,
        className: 'text-text-tertiary',
      },
      // Not floating + not error + not disabled = tertiary color (placeholder appearance)
      {
        floating: false,
        error: false,
        disabled: false,
        className: 'text-text-tertiary',
      },
    ],
    defaultVariants: {
      floating: false,
      error: false,
      focused: false,
      disabled: false,
    },
  }
);

export type TextareaFloatingLabelWrapperVariants = VariantProps<
  typeof textareaFloatingLabelWrapperVariants
>;

export type TextareaFloatingLabelLabelVariants = VariantProps<
  typeof textareaFloatingLabelVariants
>;

export interface TextareaFloatingLabelProps
  extends
    Omit<ComponentPropsWithoutRef<'textarea'>, 'size'>,
    Omit<TextareaFloatingLabelWrapperVariants, 'error' | 'disabled'> {
  /**
   * The floating label text
   */
  label: string;

  /**
   * Shows required indicator (*)
   * @default false
   */
  required?: boolean;

  /**
   * Error state - applies destructive styling
   * @default false
   */
  error?: boolean;

  /**
   * Additional CSS classes for the wrapper element
   */
  wrapperClassName?: string;
}

/**
 * TextareaFloatingLabel - A multi-line text input with floating label animation.
 *
 * When the textarea is empty and unfocused, the label appears as placeholder text inside
 * the textarea field. Upon focus or when the textarea has a value, the label smoothly
 * animates to float above the textarea border.
 *
 * This is the **standalone** molecule component. For a complete form field with
 * hint and error message, use `TextareaFloatingLabelField` instead.
 *
 * @example
 * ```tsx
 * import { TextareaFloatingLabel } from '@/ui/inputs';
 *
 * // Basic usage
 * <TextareaFloatingLabel label="Description" />
 *
 * // With required indicator
 * <TextareaFloatingLabel label="Description" required />
 *
 * // With error state
 * <TextareaFloatingLabel label="Description" error />
 *
 * // With placeholder (only visible when label is floating)
 * <TextareaFloatingLabel
 *   label="Description"
 *   placeholder="Enter your description..."
 * />
 *
 * // With custom rows
 * <TextareaFloatingLabel label="Comments" rows={6} />
 * ```
 */
export const TextareaFloatingLabel = forwardRef<
  HTMLTextAreaElement,
  TextareaFloatingLabelProps
>(
  (
    {
      label,
      required,
      error = false,
      disabled,
      wrapperClassName,
      className,
      id: providedId,
      value,
      defaultValue,
      placeholder,
      rows = 4,
      onFocus,
      onBlur,
      onChange,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef =
      (ref as RefObject<HTMLTextAreaElement | null>) || internalRef;
    const generatedId = useId();
    const textareaId = providedId ?? generatedId;

    const { isFocused, shouldFloat, handleFocus, handleBlur, handleChange } =
      useFloatingLabelState({
        value,
        defaultValue,
        placeholder,
        onFocus,
        onBlur,
        onChange,
      });

    return (
      <div
        className={cn(
          textareaFloatingLabelWrapperVariants({ error, disabled }),
          wrapperClassName
        )}
      >
        {/* Floating Label */}
        <label
          htmlFor={textareaId}
          className={cn(
            textareaFloatingLabelVariants({
              floating: shouldFloat,
              error,
              focused: isFocused,
              disabled,
            })
          )}
        >
          {label}
          {required && (
            <>
              <span aria-hidden="true" className="ml-0.5 text-destructive">
                *
              </span>
              <span className="sr-only">required</span>
            </>
          )}
        </label>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id={textareaId}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          rows={rows}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={shouldFloat ? placeholder : undefined}
          className={cn(
            'w-full min-w-0 flex-1',
            'bg-transparent',
            'border-none outline-none',
            'text-base leading-6 text-text-primary',
            'placeholder:text-text-tertiary',
            'disabled:cursor-not-allowed disabled:text-text-tertiary',
            'resize-y',
            'px-4 py-3.5',
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-required={required ? true : undefined}
          {...props}
        />
      </div>
    );
  }
);

TextareaFloatingLabel.displayName = 'TextareaFloatingLabel';

export { textareaFloatingLabelVariants, textareaFloatingLabelWrapperVariants };
