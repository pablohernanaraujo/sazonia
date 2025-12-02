import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * FileInputButton variant styles using Class Variance Authority (CVA).
 *
 * Implements all variants from the Glow UI Figma design:
 * - Sizes: sm, md, lg
 * - States: default, hover, pressed, disabled, error
 * - Designed to attach seamlessly to the right side of a TextInput
 */
const fileInputButtonVariants = cva(
  [
    // Layout
    'inline-flex items-center justify-center',
    'cursor-pointer',

    // Typography
    'font-medium',

    // Border (3 sides only - no left border for seamless attachment)
    'border border-l-0',
    'rounded-tr-sm rounded-br-sm',

    // Default state
    'bg-background',
    'border-border',
    'text-text-tertiary',

    // Transitions
    'transition-colors duration-150',

    // Hover state
    'hover:bg-background-secondary',
    'hover:border-border-hover',
    'hover:text-[#7d868c]',

    // Active state
    'active:bg-background-tertiary',
    'active:text-text-subtle',

    // Focus state
    'focus-visible:ring-2 focus-visible:ring-primary',
    'focus-visible:ring-offset-2 focus-visible:outline-none',

    // Disabled state
    'disabled:bg-background-secondary',
    'disabled:border-border-disabled',
    'disabled:text-text-secondary',
    'disabled:cursor-not-allowed',
    'disabled:opacity-52',
  ],
  {
    variants: {
      size: {
        sm: 'gap-1.5 px-2.5 py-1.5 text-sm leading-5',
        md: 'gap-2 px-3 py-2.5 text-sm leading-5',
        lg: 'gap-2 px-3.5 py-3 text-base leading-6',
      },
      error: {
        true: 'border-destructive hover:border-destructive focus-visible:ring-destructive',
        false: '',
      },
    },
    defaultVariants: {
      size: 'lg',
      error: false,
    },
  }
);

export type FileInputButtonVariants = VariantProps<
  typeof fileInputButtonVariants
>;

export interface FileInputButtonProps
  extends
    Omit<ComponentPropsWithoutRef<'button'>, 'children'>,
    Omit<FileInputButtonVariants, 'error'> {
  /**
   * Size variant of the button
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
   * Button content (typically "Browse" text)
   */
  children?: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * FileInputButton - A specialized button for triggering file selection.
 *
 * Designed to be attached to the right side of a TextInput to create a seamless
 * file input pattern. Features:
 * - Right-side-only border radius for seamless attachment
 * - No left border to connect with adjacent inputs
 * - Matching size variants with TextInput (sm, md, lg)
 * - All interaction states (hover, pressed, disabled, error)
 *
 * @example
 * ```tsx
 * import { FileInputButton, TextInput } from '@/ui/inputs';
 *
 * // Basic usage
 * <FileInputButton>Browse</FileInputButton>
 *
 * // With size variant
 * <FileInputButton size="sm">Browse</FileInputButton>
 *
 * // With error state
 * <FileInputButton error>Browse</FileInputButton>
 *
 * // Composed with TextInput (file input pattern)
 * <div className="inline-flex">
 *   <TextInput
 *     value={fileName}
 *     readOnly
 *     wrapperClassName="rounded-r-none border-r-0"
 *   />
 *   <FileInputButton onClick={() => fileInputRef.current?.click()}>
 *     Browse
 *   </FileInputButton>
 * </div>
 *
 * // With hidden file input using ref
 * const fileInputRef = useRef<HTMLInputElement>(null);
 *
 * <input
 *   ref={fileInputRef}
 *   type="file"
 *   className="sr-only"
 *   onChange={handleFileChange}
 * />
 * <FileInputButton onClick={() => fileInputRef.current?.click()}>
 *   Browse
 * </FileInputButton>
 * ```
 */
export const FileInputButton = forwardRef<
  HTMLButtonElement,
  FileInputButtonProps
>(
  (
    { size = 'lg', error = false, disabled, className, children, ...props },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={cn(fileInputButtonVariants({ size, error }), className)}
      {...props}
    >
      {children}
    </button>
  )
);

FileInputButton.displayName = 'FileInputButton';

export { fileInputButtonVariants };
