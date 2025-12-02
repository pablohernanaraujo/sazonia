import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Radio variant styles using Class Variance Authority (CVA).
 *
 * Implements all variants from the Glow UI Figma design:
 * - Sizes: sm (16px), md (20px), lg (24px)
 * - States: Default, Hovered, Focused, Pressed, Disabled, Error
 * - Checked states: unchecked, checked
 */
const radioVariants = cva(
  [
    // Base styles
    'inline-flex items-center justify-center',
    'shrink-0',
    'rounded-full',
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
    // Checked states (using Radix data attributes)
    'data-[state=checked]:border-fill-primary data-[state=checked]:bg-fill-primary',
    // Checked hover
    'data-[state=checked]:hover:border-fill-primary-hover data-[state=checked]:hover:bg-fill-primary-hover',
    // Checked active (pressed with box-shadow)
    'data-[state=checked]:active:shadow-[0px_0px_0px_3px_#d9e2fc]',
    // Disabled checked
    'data-[state=checked]:disabled:border-fill-primary-disabled data-[state=checked]:disabled:bg-fill-primary-disabled',
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
          // Error checked
          'data-[state=checked]:border-destructive data-[state=checked]:bg-destructive',
          'data-[state=checked]:hover:border-destructive-hover data-[state=checked]:hover:bg-destructive-hover',
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

type RadioVariantProps = VariantProps<typeof radioVariants>;

export interface RadioProps
  extends
    Omit<ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'children'>,
    RadioVariantProps {}

/**
 * Radio - A form control that allows users to select one option from a set.
 *
 * Radio buttons are used when only one option can be selected from a group.
 * They must be used within a RadioGroup component.
 *
 * Built on Radix UI's Radio Group primitive for accessibility and keyboard support.
 *
 * @example
 * ```tsx
 * import { Radio, RadioGroup } from '@/ui';
 *
 * // Basic usage
 * <RadioGroup defaultValue="option1">
 *   <Radio value="option1" />
 *   <Radio value="option2" />
 * </RadioGroup>
 *
 * // Controlled
 * const [value, setValue] = useState('option1');
 * <RadioGroup value={value} onValueChange={setValue}>
 *   <Radio value="option1" />
 *   <Radio value="option2" />
 * </RadioGroup>
 *
 * // With labels
 * <RadioGroup defaultValue="option1">
 *   <label className="flex items-center gap-2">
 *     <Radio value="option1" />
 *     Option 1
 *   </label>
 *   <label className="flex items-center gap-2">
 *     <Radio value="option2" />
 *     Option 2
 *   </label>
 * </RadioGroup>
 * ```
 */
export const Radio = forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioProps
>(({ className, size, error, disabled, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    disabled={disabled}
    className={cn(radioVariants({ size, error }), className)}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <div className="size-1/3 rounded-full bg-text-overlay-white" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));

Radio.displayName = 'Radio';

export interface RadioGroupProps extends ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
> {
  /**
   * Whether all radios in the group are in error state.
   * Individual Radio components can also specify error state.
   */
  error?: boolean;
}

/**
 * RadioGroup - A container component for managing a group of Radio buttons.
 *
 * Provides state management for radio selection and ensures only one option
 * can be selected at a time.
 *
 * @example
 * ```tsx
 * import { Radio, RadioGroup } from '@/ui';
 *
 * // Uncontrolled with defaultValue
 * <RadioGroup defaultValue="option1" name="my-radio-group">
 *   <Radio value="option1" />
 *   <Radio value="option2" />
 * </RadioGroup>
 *
 * // Controlled
 * const [value, setValue] = useState('option1');
 * <RadioGroup value={value} onValueChange={setValue}>
 *   <Radio value="option1" />
 *   <Radio value="option2" />
 * </RadioGroup>
 *
 * // Horizontal layout
 * <RadioGroup orientation="horizontal" defaultValue="option1">
 *   <Radio value="option1" />
 *   <Radio value="option2" />
 * </RadioGroup>
 * ```
 */
export const RadioGroup = forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex',
      orientation === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-2',
      className
    )}
    {...props}
  />
));

RadioGroup.displayName = 'RadioGroup';

export { radioVariants };
