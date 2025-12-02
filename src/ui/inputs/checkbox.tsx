import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { Check, Minus } from '@phosphor-icons/react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

/**
 * Icon size mapping to match Icon component's size variants.
 * Maps checkbox sizes to appropriate icon sizes.
 */
const checkboxIconSizeMap = {
  sm: 'xs',
  md: 'sm',
  lg: 'sm',
} as const;

type IconSize = (typeof checkboxIconSizeMap)[keyof typeof checkboxIconSizeMap];

/**
 * Checkbox variant styles using Class Variance Authority (CVA).
 *
 * Implements all variants from the Glow UI Figma design:
 * - Sizes: sm (16px), md (20px), lg (24px)
 * - States: Default, Hovered, Focused, Pressed, Disabled, Error
 * - Checked states: unchecked, checked, indeterminate
 */
const checkboxVariants = cva(
  [
    // Base styles
    'inline-flex items-center justify-center',
    'shrink-0',
    'rounded-xs',
    'border',
    'transition-colors duration-150',
    'cursor-pointer',
    // Focus state (keyboard navigation)
    'focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none',
    // Disabled state
    'disabled:cursor-not-allowed disabled:opacity-52',
    // Unchecked default state
    'border-border bg-background',
    // Unchecked hover
    'hover:border-border-hover hover:bg-background-secondary',
    // Pressed/active state (box-shadow for mouse/touch)
    'active:shadow-[0px_0px_0px_3px_#e6e8eb]',
    // Checked/indeterminate states
    'data-[state=checked]:border-fill-primary data-[state=checked]:bg-fill-primary',
    'data-[state=indeterminate]:border-fill-primary data-[state=indeterminate]:bg-fill-primary',
    // Checked/indeterminate hover
    'data-[state=checked]:hover:border-fill-primary-hover data-[state=checked]:hover:bg-fill-primary-hover',
    'data-[state=indeterminate]:hover:border-fill-primary-hover data-[state=indeterminate]:hover:bg-fill-primary-hover',
    // Checked/indeterminate active (pressed with box-shadow)
    'data-[state=checked]:active:shadow-[0px_0px_0px_3px_#d9e2fc]',
    'data-[state=indeterminate]:active:shadow-[0px_0px_0px_3px_#d9e2fc]',
    // Disabled checked/indeterminate
    'data-[state=checked]:disabled:border-fill-primary-disabled data-[state=checked]:disabled:bg-fill-primary-disabled',
    'data-[state=indeterminate]:disabled:border-fill-primary-disabled data-[state=indeterminate]:disabled:bg-fill-primary-disabled',
    // Disabled unchecked
    'disabled:border-border-disabled disabled:bg-background-tertiary',
  ],
  {
    variants: {
      size: {
        sm: 'size-4', // 16px
        md: 'size-5', // 20px
        lg: 'size-6', // 24px
      },
      error: {
        true: [
          // Error unchecked
          'border-destructive',
          'hover:border-destructive-hover',
          // Error checked/indeterminate
          'data-[state=checked]:border-destructive data-[state=checked]:bg-destructive',
          'data-[state=indeterminate]:border-destructive data-[state=indeterminate]:bg-destructive',
          'data-[state=checked]:hover:border-destructive-hover data-[state=checked]:hover:bg-destructive-hover',
          'data-[state=indeterminate]:hover:border-destructive-hover data-[state=indeterminate]:hover:bg-destructive-hover',
        ],
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
    },
  }
);

type CheckboxVariantProps = VariantProps<typeof checkboxVariants>;

export interface CheckboxProps
  extends
    Omit<ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'children'>,
    CheckboxVariantProps {
  /**
   * Whether the checkbox is in an indeterminate state.
   * This is typically used for "select all" checkboxes where
   * some but not all items are selected.
   */
  indeterminate?: boolean;
}

/**
 * Checkbox - A form control that allows users to select one or more options.
 *
 * Supports three visual states:
 * - **Unchecked**: Empty checkbox
 * - **Checked**: Checkbox with checkmark icon
 * - **Indeterminate**: Checkbox with minus icon (for partial selections)
 *
 * Built on Radix UI's Checkbox primitive for accessibility and keyboard support.
 *
 * @example
 * ```tsx
 * import { Checkbox } from '@/ui';
 *
 * // Basic usage
 * <Checkbox />
 *
 * // Controlled checkbox
 * const [checked, setChecked] = useState(false);
 * <Checkbox checked={checked} onCheckedChange={setChecked} />
 *
 * // With size variants
 * <Checkbox size="sm" />
 * <Checkbox size="md" />
 * <Checkbox size="lg" />
 *
 * // Indeterminate state (for "select all" scenarios)
 * <Checkbox checked="indeterminate" />
 *
 * // Error state
 * <Checkbox error />
 *
 * // Disabled state
 * <Checkbox disabled />
 * ```
 */
export const Checkbox = forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    { className, size, error, indeterminate, checked, disabled, ...props },
    ref
  ) => {
    // Handle indeterminate state by converting to Radix's expected format
    const checkedState = indeterminate ? 'indeterminate' : checked;
    const iconSize: IconSize = checkboxIconSizeMap[size ?? 'md'];

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        checked={checkedState}
        disabled={disabled}
        className={cn(checkboxVariants({ size, error }), className)}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-text-overlay-white">
          {checkedState === 'indeterminate' ? (
            <Icon
              icon={Minus}
              size={iconSize}
              weight="bold"
              color={null}
              aria-hidden
            />
          ) : (
            <Icon
              icon={Check}
              size={iconSize}
              weight="bold"
              color={null}
              aria-hidden
            />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { checkboxVariants };
