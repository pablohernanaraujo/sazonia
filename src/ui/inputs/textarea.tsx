import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Textarea wrapper variants for the container that holds the textarea.
 *
 * Size variants:
 * - `md`: Medium (py-2.5 px-3, gap-2.5)
 * - `lg`: Large (py-3 px-4, gap-3) - default
 */
const textareaWrapperVariants = cva(
  [
    'flex w-full',
    'rounded-sm border',
    'bg-background',
    'transition-colors duration-150',
    // Focus-within for when textarea inside is focused
    'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
    // Disabled state handled via group
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-background-secondary',
  ],
  {
    variants: {
      size: {
        md: 'gap-2.5 px-3 py-2.5',
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
 * Textarea inner element variants.
 *
 * Handles typography based on size:
 * - `md`: 14px (text-sm), 20px line-height
 * - `lg`: 16px (text-base), 24px line-height
 */
const textareaVariants = cva(
  [
    'w-full min-w-0 flex-1',
    'bg-transparent',
    'border-none outline-none',
    'text-text-primary',
    'placeholder:text-text-tertiary',
    'disabled:cursor-not-allowed disabled:text-text-tertiary',
    'resize-y',
  ],
  {
    variants: {
      size: {
        md: 'text-sm leading-5',
        lg: 'text-base leading-6',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

export type TextareaWrapperVariants = VariantProps<
  typeof textareaWrapperVariants
>;
export type TextareaVariants = VariantProps<typeof textareaVariants>;

export interface TextareaProps
  extends
    Omit<ComponentPropsWithoutRef<'textarea'>, 'size'>,
    Omit<TextareaWrapperVariants, 'error'> {
  /**
   * Size variant of the textarea
   * - `md`: Medium
   * - `lg`: Large (default)
   */
  size?: 'md' | 'lg';

  /**
   * Error state - applies destructive border color
   * @default false
   */
  error?: boolean;

  /**
   * Additional CSS classes for the wrapper element
   */
  wrapperClassName?: string;
}

/**
 * Textarea - A standalone form multi-line text input component.
 *
 * Provides a styled textarea field with support for multiple visual states
 * (hover, focus, disabled, error) and two size variants.
 *
 * This is the **standalone** textarea component. For a complete form field with label,
 * hint, and error message, use `TextareaField` instead.
 *
 * @example
 * ```tsx
 * import { Textarea } from '@/ui/inputs';
 *
 * // Basic usage
 * <Textarea placeholder="Enter your message" />
 *
 * // With size variant
 * <Textarea size="md" placeholder="Medium textarea" />
 *
 * // With error state
 * <Textarea error placeholder="Invalid input" aria-invalid />
 *
 * // With custom rows
 * <Textarea rows={6} placeholder="Enter description..." />
 *
 * // Manual composition with InputLabel
 * <InputLabel label="Message" htmlFor="message" />
 * <Textarea id="message" placeholder="Enter message" />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'lg',
      error = false,
      wrapperClassName,
      className,
      disabled,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => (
    <div
      className={cn(textareaWrapperVariants({ size, error }), wrapperClassName)}
    >
      <textarea
        ref={ref}
        disabled={disabled}
        aria-invalid={ariaInvalid ?? (error ? true : undefined)}
        className={cn(textareaVariants({ size }), className)}
        {...props}
      />
    </div>
  )
);

Textarea.displayName = 'Textarea';

export { textareaVariants, textareaWrapperVariants };
