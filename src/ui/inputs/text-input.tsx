import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * TextInput wrapper variants for the container that holds add-ons and input.
 *
 * Size variants:
 * - `sm`: Small (py-1.5 px-3, gap-2)
 * - `md`: Medium (py-2.5 px-3.5, gap-2.5)
 * - `lg`: Large (py-3 px-4, gap-3) - default
 */
const textInputWrapperVariants = cva(
  [
    'flex w-full items-center',
    'rounded-sm border',
    'bg-background',
    'transition-colors duration-150',
    // Focus-within for when input inside is focused
    'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
    // Disabled state handled via group
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-background-secondary',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2 px-3 py-1.5',
        md: 'gap-2.5 px-3.5 py-2.5',
        lg: 'gap-3 px-4 py-3',
      },
      error: {
        true: 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20',
        false: 'border-border hover:border-border-hover',
      },
    },
    defaultVariants: {
      size: 'lg',
      error: false,
    },
  }
);

/**
 * TextInput inner input element variants.
 *
 * Handles typography based on size:
 * - `sm`/`md`: 14px (text-sm), 20px line-height
 * - `lg`: 16px (text-base), 24px line-height
 */
const textInputVariants = cva(
  [
    'w-full min-w-0 flex-1',
    'bg-transparent',
    'border-none outline-none',
    'text-text-primary',
    'placeholder:text-text-tertiary',
    'disabled:cursor-not-allowed disabled:text-text-tertiary',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm leading-5',
        md: 'text-sm leading-5',
        lg: 'text-base leading-6',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

export type TextInputWrapperVariants = VariantProps<
  typeof textInputWrapperVariants
>;
export type TextInputVariants = VariantProps<typeof textInputVariants>;

export interface TextInputProps
  extends
    Omit<ComponentPropsWithoutRef<'input'>, 'size'>,
    Omit<TextInputWrapperVariants, 'error'> {
  /**
   * Size variant of the input
   * - `sm`: Small (compact)
   * - `md`: Medium
   * - `lg`: Large (default)
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Error state - applies destructive border color
   * @default false
   */
  error?: boolean;

  /**
   * Content to render on the left side of the input (prefix)
   * Can be an icon, text, or any ReactNode
   */
  leftAddOn?: ReactNode;

  /**
   * Content to render on the right side of the input (suffix)
   * Can be an icon, text, or any ReactNode
   */
  rightAddOn?: ReactNode;

  /**
   * Additional CSS classes for the wrapper element
   */
  wrapperClassName?: string;
}

/**
 * TextInput - A standalone form text input component.
 *
 * Provides a styled text input field with support for add-ons (prefix/suffix elements)
 * and handles multiple visual states (hover, focus, disabled, error).
 *
 * This is the **standalone** input component. For a complete form field with label,
 * hint, and error message, use `TextInputField` instead.
 *
 * @example
 * ```tsx
 * import { TextInput } from '@/ui/inputs';
 * import { MagnifyingGlass, Eye } from '@phosphor-icons/react';
 * import { Icon } from '@/ui/icons';
 *
 * // Basic usage
 * <TextInput placeholder="Enter your email" />
 *
 * // With size variant
 * <TextInput size="sm" placeholder="Small input" />
 *
 * // With error state
 * <TextInput error placeholder="Invalid input" aria-invalid />
 *
 * // With left add-on (icon)
 * <TextInput
 *   leftAddOn={<Icon icon={MagnifyingGlass} size="sm" color="muted" />}
 *   placeholder="Search..."
 * />
 *
 * // With right add-on (icon)
 * <TextInput
 *   type="password"
 *   rightAddOn={<Icon icon={Eye} size="sm" color="muted" />}
 *   placeholder="Enter password"
 * />
 *
 * // With text add-on
 * <TextInput
 *   leftAddOn={<span className="text-text-tertiary">https://</span>}
 *   placeholder="example.com"
 * />
 *
 * // Manual composition with InputLabel
 * <InputLabel label="Email" htmlFor="email" />
 * <TextInput id="email" placeholder="Enter email" />
 * ```
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      size = 'lg',
      error = false,
      leftAddOn,
      rightAddOn,
      wrapperClassName,
      className,
      disabled,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => (
    <div
      className={cn(textInputWrapperVariants({ size, error }), wrapperClassName)}
    >
      {leftAddOn && (
        <span className="flex-shrink-0 text-text-tertiary">{leftAddOn}</span>
      )}
      <input
        ref={ref}
        disabled={disabled}
        aria-invalid={ariaInvalid ?? (error ? true : undefined)}
        className={cn(textInputVariants({ size }), className)}
        {...props}
      />
      {rightAddOn && (
        <span className="flex-shrink-0 text-text-tertiary">{rightAddOn}</span>
      )}
    </div>
  )
);

TextInput.displayName = 'TextInput';

export { textInputVariants, textInputWrapperVariants };
