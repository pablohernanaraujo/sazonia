import { forwardRef } from 'react';
import { Question } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

/**
 * InputLabel size variants:
 * - `sm`: Small (14px label, 10px bottom padding)
 * - `md`: Medium (16px label, 12px bottom padding)
 */
const inputLabelVariants = cva('flex flex-col', {
  variants: {
    size: {
      sm: 'pb-2.5', // 10px bottom padding
      md: 'pb-3', // 12px bottom padding
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type InputLabelVariants = VariantProps<typeof inputLabelVariants>;

export interface InputLabelProps extends InputLabelVariants {
  /**
   * The label text content
   */
  label: string;
  /**
   * Shows required indicator (red asterisk)
   * @default false
   */
  required?: boolean;
  /**
   * Shows help icon for tooltips
   * @default false
   */
  showIcon?: boolean;
  /**
   * Custom aria-label for the help icon
   * @default "Help for {label}"
   */
  helpIconAriaLabel?: string;
  /**
   * Optional description text below the label
   */
  description?: string;
  /**
   * ID of the associated input element for accessibility
   */
  htmlFor?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * InputLabel - A form label component with optional required indicator, help icon, and description.
 *
 * Provides consistent labeling for input fields with support for two sizes (SM and MD),
 * required field indicators, help icons, and description text.
 *
 * @example
 * ```tsx
 * import { InputLabel } from '@/ui/inputs';
 *
 * // Basic usage
 * <InputLabel label="Email address" htmlFor="email" />
 *
 * // With required indicator
 * <InputLabel label="Email address" required htmlFor="email" />
 *
 * // With help icon
 * <InputLabel label="Password" showIcon htmlFor="password" />
 *
 * // With description
 * <InputLabel
 *   label="Password"
 *   description="Must be at least 8 characters"
 *   htmlFor="password"
 * />
 *
 * // Full featured
 * <InputLabel
 *   size="sm"
 *   label="Email"
 *   required
 *   showIcon
 *   helpIconAriaLabel="Email format requirements"
 *   description="We'll never share your email"
 *   htmlFor="email"
 * />
 * ```
 */
export const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
  (
    {
      size = 'md',
      label,
      required = false,
      showIcon = false,
      helpIconAriaLabel,
      description,
      htmlFor,
      className,
    },
    ref
  ) => {
    const descriptionId = htmlFor ? `${htmlFor}-description` : undefined;

    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn(inputLabelVariants({ size }), className)}
      >
        {/* Label row with text, required indicator, and help icon */}
        <span className="flex items-center gap-2">
          <span
            className={cn(
              'font-sans font-medium text-text-primary',
              size === 'sm' ? 'text-sm leading-5' : 'text-base leading-6'
            )}
          >
            {label}
            {required && (
              <span
                className="ml-0.5 text-sm leading-5 text-destructive"
                aria-hidden="true"
              >
                *
              </span>
            )}
          </span>
          {showIcon && (
            <Icon
              icon={Question}
              size="sm"
              color="muted"
              aria-label={helpIconAriaLabel ?? `Help for ${label}`}
            />
          )}
        </span>

        {/* Description text */}
        {description && (
          <span
            id={descriptionId}
            className="pt-1 font-sans text-sm leading-5 font-normal text-text-secondary"
          >
            {description}
          </span>
        )}
      </label>
    );
  }
);

InputLabel.displayName = 'InputLabel';

export { inputLabelVariants };
