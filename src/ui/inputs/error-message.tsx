import { forwardRef } from 'react';
import { WarningCircle } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

/**
 * ErrorMessage size variants:
 * - `sm`: Small (12px text, 18px line-height)
 * - `md`: Medium (14px text, 20px line-height)
 */
const errorMessageVariants = cva('flex items-start gap-1.5 pt-2', {
  variants: {
    size: {
      sm: '', // text classes applied to span
      md: '', // text classes applied to span
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type ErrorMessageVariants = VariantProps<typeof errorMessageVariants>;

export interface ErrorMessageProps extends ErrorMessageVariants {
  /**
   * The error message text content
   */
  text: string;
  /**
   * Shows the alert circle icon
   * @default true
   */
  showIcon?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Optional ID for ARIA associations (aria-describedby pattern)
   */
  id?: string;
}

/**
 * ErrorMessage - A form feedback component that displays error messages with optional icon.
 *
 * Provides visual feedback for form validation errors with destructive styling.
 * Supports two size variants (SM and MD) to align with the form input sizing system.
 *
 * @example
 * ```tsx
 * import { ErrorMessage } from '@/ui/inputs';
 *
 * // Basic usage
 * <ErrorMessage text="This field is required" />
 *
 * // Small size
 * <ErrorMessage size="sm" text="Invalid email format" />
 *
 * // Without icon
 * <ErrorMessage text="Password too short" showIcon={false} />
 *
 * // With ARIA association
 * <input
 *   aria-invalid="true"
 *   aria-describedby="email-error"
 * />
 * <ErrorMessage id="email-error" text="Email is required" />
 * ```
 */
export const ErrorMessage = forwardRef<HTMLDivElement, ErrorMessageProps>(
  ({ size = 'md', text, showIcon = true, className, id }, ref) => (
    <div
      ref={ref}
      id={id}
      role="alert"
      className={cn(errorMessageVariants({ size }), className)}
    >
      {showIcon && (
        <span className="py-0.5">
          <Icon
            icon={WarningCircle}
            size="sm"
            weight="fill"
            color="destructive"
            className={size === 'sm' ? 'size-[14px]' : undefined}
            aria-hidden
          />
        </span>
      )}
      <span
        className={cn(
          'font-medium text-destructive',
          size === 'sm' ? 'text-xs leading-[18px]' : 'text-sm leading-5'
        )}
      >
        {text}
      </span>
    </div>
  )
);

ErrorMessage.displayName = 'ErrorMessage';

export { errorMessageVariants };
