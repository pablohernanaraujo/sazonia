import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Custom hook to detect browser autofill on input elements.
 * Handles webkit-autofill detection and animation-based detection for cross-browser support.
 */
function useAutofillDetection(
  inputRef: React.RefObject<HTMLInputElement | null>
): boolean {
  const [isAutofilled, setIsAutofilled] = useState(false);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const checkAutofill = (): void => {
      try {
        const matches = input.matches(':-webkit-autofill');
        setIsAutofilled(matches);
      } catch {
        // Firefox doesn't support :-webkit-autofill
        setIsAutofilled(false);
      }
    };

    // Check immediately
    checkAutofill();

    // Check after browsers typically autofill (on page load)
    const timer = setTimeout(checkAutofill, 500);

    // Listen for animation (some browsers fire this on autofill)
    const handleAnimationStart = (e: AnimationEvent): void => {
      if (e.animationName === 'onAutoFillStart') {
        setIsAutofilled(true);
      }
      if (e.animationName === 'onAutoFillCancel') {
        setIsAutofilled(false);
      }
    };

    input.addEventListener('animationstart', handleAnimationStart);

    return () => {
      clearTimeout(timer);
      input.removeEventListener('animationstart', handleAnimationStart);
    };
  }, [inputRef]);

  // Also check for value changes to update autofill state
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    // If user clears input, reset autofill state
    const handleInput = (): void => {
      if (!input.value) {
        setIsAutofilled(false);
      }
    };

    input.addEventListener('input', handleInput);
    return () => input.removeEventListener('input', handleInput);
  }, [inputRef]);

  return isAutofilled;
}

interface FloatingLabelInputState {
  isFocused: boolean;
  shouldFloat: boolean;
  handleFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface UseFloatingLabelStateOptions {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string | number | readonly string[] | undefined;
  defaultValue: string | number | readonly string[] | undefined;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Custom hook to manage floating label input state.
 */
function useFloatingLabelState(
  options: UseFloatingLabelStateOptions
): FloatingLabelInputState {
  const { inputRef, value, defaultValue, onFocus, onBlur, onChange } = options;

  const [isFocused, setIsFocused] = useState(false);
  const [internalHasValue, setInternalHasValue] = useState(
    Boolean(value || defaultValue)
  );
  const isAutofilled = useAutofillDetection(inputRef);

  const hasValue = value !== undefined ? Boolean(value) : internalHasValue;
  const shouldFloat = isFocused || hasValue || isAutofilled;

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalHasValue(Boolean(e.target.value));
      onChange?.(e);
    },
    [onChange]
  );

  return { isFocused, shouldFloat, handleFocus, handleBlur, handleChange };
}

/**
 * TextInputFloatingLabel wrapper variants for the container.
 *
 * Handles border colors, background, and focus states.
 */
const textInputFloatingLabelWrapperVariants = cva(
  [
    'relative flex items-center',
    'rounded-sm border',
    'transition-colors duration-150',
  ],
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
 * Floating label variants with compound variants for state-based styling.
 *
 * Handles position, scale, and color based on:
 * - floating: Whether label is in floating position (above) or inline (placeholder)
 * - error: Whether input is in error state
 * - focused: Whether input is currently focused
 * - disabled: Whether input is disabled
 */
const floatingLabelVariants = cva(
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
        false:
          'top-1/2 -translate-y-1/2 scale-100 bg-transparent text-base font-normal',
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

export type TextInputFloatingLabelWrapperVariants = VariantProps<
  typeof textInputFloatingLabelWrapperVariants
>;

export type FloatingLabelVariants = VariantProps<typeof floatingLabelVariants>;

/**
 * Add-on wrapper component for consistent styling.
 */
function AddOn({ children }: { children: React.ReactNode }): React.ReactNode {
  return <span className="shrink-0 text-text-tertiary">{children}</span>;
}

/**
 * Required indicator component for labels.
 */
function RequiredIndicator(): React.ReactNode {
  return (
    <>
      <span aria-hidden="true" className="ml-0.5 text-destructive">
        *
      </span>
      <span className="sr-only">required</span>
    </>
  );
}

const INPUT_CLASS_BASE = [
  'min-w-0 flex-1',
  'bg-transparent',
  'border-none outline-none',
  'text-base leading-6 text-text-primary',
  'placeholder:text-text-tertiary',
  'disabled:cursor-not-allowed disabled:text-text-tertiary',
];

/**
 * Hook to resolve input ref (forwarded or internal).
 */
function useInputRef(
  forwardedRef: React.ForwardedRef<HTMLInputElement>
): React.RefObject<HTMLInputElement | null> {
  const internalRef = useRef<HTMLInputElement>(null);
  return (
    (forwardedRef as React.RefObject<HTMLInputElement | null>) || internalRef
  );
}

export interface TextInputFloatingLabelProps
  extends
    Omit<ComponentPropsWithoutRef<'input'>, 'size'>,
    Omit<TextInputFloatingLabelWrapperVariants, 'error' | 'disabled'> {
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
   * Left add-on element (icon, text, etc.)
   */
  leftAddOn?: React.ReactNode;

  /**
   * Right add-on element (icon, text, etc.)
   */
  rightAddOn?: React.ReactNode;

  /**
   * Additional CSS classes for the wrapper element
   */
  wrapperClassName?: string;
}

/**
 * TextInputFloatingLabel - A text input with floating label animation.
 *
 * When the input is empty and unfocused, the label appears as placeholder text inside
 * the input field. Upon focus or when the input has a value, the label smoothly
 * animates to float above the input border.
 *
 * This is the **standalone** molecule component. For a complete form field with
 * hint and error message, use `TextInputFloatingLabelField` instead.
 *
 * @example
 * ```tsx
 * import { TextInputFloatingLabel } from '@/ui/inputs';
 * import { EnvelopeSimple } from '@phosphor-icons/react';
 * import { Icon } from '@/ui/icons';
 *
 * // Basic usage
 * <TextInputFloatingLabel label="Email" />
 *
 * // With required indicator
 * <TextInputFloatingLabel label="Email" required />
 *
 * // With error state
 * <TextInputFloatingLabel label="Email" error />
 *
 * // With left add-on (icon)
 * <TextInputFloatingLabel
 *   label="Email"
 *   leftAddOn={<Icon icon={EnvelopeSimple} size="sm" color="muted" />}
 * />
 *
 * // With placeholder (only visible when label is floating)
 * <TextInputFloatingLabel
 *   label="Email"
 *   placeholder="you@example.com"
 * />
 * ```
 */
export const TextInputFloatingLabel = forwardRef<
  HTMLInputElement,
  TextInputFloatingLabelProps
>(function TextInputFloatingLabel(
  {
    label,
    required,
    error = false,
    disabled,
    leftAddOn,
    rightAddOn,
    wrapperClassName,
    className,
    id: providedId,
    value,
    defaultValue,
    placeholder,
    onFocus,
    onBlur,
    onChange,
    ...props
  },
  ref
) {
  const inputRef = useInputRef(ref);
  const generatedId = useId();
  const inputId = providedId ?? generatedId;

  // Use custom hook for floating label state management
  const { isFocused, shouldFloat, handleFocus, handleBlur, handleChange } =
    useFloatingLabelState({
      inputRef,
      value,
      defaultValue,
      onFocus,
      onBlur,
      onChange,
    });

  // Compute derived values outside JSX
  const labelClassName = cn(
    floatingLabelVariants({
      floating: shouldFloat,
      error,
      focused: isFocused,
      disabled,
    }),
    Boolean(leftAddOn) && 'left-10'
  );

  const inputClassName = cn(INPUT_CLASS_BASE, className);

  const wrapperClass = cn(
    textInputFloatingLabelWrapperVariants({ error, disabled }),
    wrapperClassName
  );

  const computedPlaceholder = shouldFloat ? placeholder : undefined;

  return (
    <div className={wrapperClass}>
      {/* Floating Label */}
      <label htmlFor={inputId} className={labelClassName}>
        {label}
        {required && <RequiredIndicator />}
      </label>

      {/* Input Container */}
      <div className="flex w-full items-center gap-2.5 px-4 py-3.5">
        {leftAddOn && <AddOn>{leftAddOn}</AddOn>}
        <input
          ref={inputRef}
          id={inputId}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={computedPlaceholder}
          className={inputClassName}
          aria-invalid={error ? true : undefined}
          aria-required={required ? true : undefined}
          {...props}
        />
        {rightAddOn && <AddOn>{rightAddOn}</AddOn>}
      </div>
    </div>
  );
});

export { floatingLabelVariants, textInputFloatingLabelWrapperVariants };
