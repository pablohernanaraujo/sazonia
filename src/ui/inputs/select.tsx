'use client';

import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type ReactNode,
  useContext,
} from 'react';
import { CaretDown, Check } from '@phosphor-icons/react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

/**
 * Context for propagating size through Select compound components.
 */
type SelectSize = 'sm' | 'md' | 'lg';

const SelectSizeContext = createContext<SelectSize>('lg');

function useSelectSize(): SelectSize {
  return useContext(SelectSizeContext);
}

/**
 * SelectTrigger wrapper variants for the button that opens the dropdown.
 *
 * Size variants:
 * - `sm`: Small (32px height, py-1.5 px-3)
 * - `md`: Medium (40px height, py-2.5 px-3.5)
 * - `lg`: Large (48px height, py-3 px-4) - default
 *
 * Style variants:
 * - `bordered`: With border (default)
 * - `borderless`: Without border
 */
const selectTriggerVariants = cva(
  [
    'flex w-full items-center justify-between',
    'rounded-sm',
    'bg-background',
    'transition-colors duration-150',
    'focus:ring-2 focus:ring-primary/20 focus:outline-none',
    'disabled:cursor-not-allowed disabled:bg-background-secondary disabled:text-text-tertiary',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 gap-3 px-3 py-1.5',
        md: 'h-10 gap-3 px-3.5 py-2.5',
        lg: 'h-12 gap-3 px-4 py-3',
      },
      variant: {
        bordered: 'border',
        borderless: '',
      },
      error: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Bordered + no error
      {
        variant: 'bordered',
        error: false,
        className: 'border-border hover:border-border-hover focus:border-primary',
      },
      // Bordered + error
      {
        variant: 'bordered',
        error: true,
        className:
          'border-destructive hover:border-destructive focus:border-destructive focus:ring-destructive/20',
      },
    ],
    defaultVariants: {
      size: 'lg',
      variant: 'bordered',
      error: false,
    },
  }
);

/**
 * SelectTrigger text variants for value/placeholder sizing.
 */
const selectTriggerTextVariants = cva('truncate text-left', {
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
});

/**
 * SelectContent container variants mirroring InputDropmenuContent styling.
 */
const selectContentVariants = cva(
  [
    'overflow-hidden rounded-sm border border-border-secondary bg-background shadow-lg',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  ],
  {
    variants: {
      size: {
        sm: 'max-h-[240px]',
        md: 'max-h-[288px]',
        lg: 'max-h-[344px]',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

/**
 * SelectItem variants matching DropmenuItem styling.
 */
const selectItemVariants = cva(
  [
    'relative flex w-full cursor-pointer items-center rounded-sm transition-colors duration-150 select-none',
    'outline-none',
    'hover:bg-background-secondary',
    'focus:bg-background-secondary',
    'data-[disabled]:pointer-events-none data-[disabled]:text-text-tertiary',
    'data-[state=checked]:border-info-500 data-[state=checked]:bg-info-50 data-[state=checked]:border-l-[3px]',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2.5 px-3 py-1.5 text-sm leading-5',
        md: 'gap-3 px-3 py-2.5 text-sm leading-5',
        lg: 'gap-3 px-4 py-3 text-base leading-6',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

export type SelectTriggerVariants = VariantProps<typeof selectTriggerVariants>;
export type SelectContentVariants = VariantProps<typeof selectContentVariants>;
export type SelectItemVariants = VariantProps<typeof selectItemVariants>;

// ============================================================================
// Select Root
// ============================================================================

export interface SelectProps extends SelectPrimitive.SelectProps {
  /**
   * Size variant for all Select components
   * @default 'lg'
   */
  size?: SelectSize;
  /**
   * Children elements
   */
  children: ReactNode;
}

/**
 * Select - Root component that provides context for the select dropdown.
 *
 * @example
 * ```tsx
 * <Select size="lg">
 *   <SelectTrigger>
 *     <SelectValue placeholder="Select an option" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="option1">Option 1</SelectItem>
 *     <SelectItem value="option2">Option 2</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
export function Select({
  size = 'lg',
  children,
  ...props
}: SelectProps): React.ReactElement {
  return (
    <SelectSizeContext.Provider value={size}>
      <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>
    </SelectSizeContext.Provider>
  );
}

Select.displayName = 'Select';

// ============================================================================
// SelectTrigger
// ============================================================================

export interface SelectTriggerProps
  extends
    Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>, 'children'>,
    Omit<SelectTriggerVariants, 'size'> {
  /**
   * Size variant (overrides context if provided)
   */
  size?: SelectSize;
  /**
   * Content to render on the left side (prefix)
   */
  leftAddOn?: ReactNode;
  /**
   * Additional CSS classes for the wrapper
   */
  className?: string;
  /**
   * Children elements (typically SelectValue)
   */
  children?: ReactNode;
}

/**
 * SelectTrigger - The button that opens the select dropdown.
 */
export const SelectTrigger = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(
  (
    {
      size: propSize,
      variant = 'bordered',
      error = false,
      leftAddOn,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const contextSize = useSelectSize();
    const size = propSize ?? contextSize;
    const iconSize = size === 'lg' ? 'md' : 'sm';

    return (
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn(selectTriggerVariants({ size, variant, error }), className)}
        {...props}
      >
        <span className="flex min-w-0 flex-1 items-center gap-3">
          {leftAddOn && (
            <span className="flex-shrink-0 text-text-tertiary">{leftAddOn}</span>
          )}
          <span className={cn(selectTriggerTextVariants({ size }), 'flex-1')}>
            {children}
          </span>
        </span>
        <SelectPrimitive.Icon asChild>
          <Icon
            icon={CaretDown}
            size={iconSize}
            className="flex-shrink-0 text-text-tertiary"
            aria-hidden
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    );
  }
);

SelectTrigger.displayName = 'SelectTrigger';

// ============================================================================
// SelectValue
// ============================================================================

export type SelectValueProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Value
>;

/**
 * SelectValue - Displays the selected value or placeholder.
 */
export const SelectValue = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  SelectValueProps
>((props, ref) => (
  <SelectPrimitive.Value
    ref={ref}
    className="text-text-primary data-[placeholder]:text-text-tertiary"
    {...props}
  />
));

SelectValue.displayName = 'SelectValue';

// ============================================================================
// SelectContent
// ============================================================================

export interface SelectContentProps
  extends
    ComponentPropsWithoutRef<typeof SelectPrimitive.Content>,
    Omit<SelectContentVariants, 'size'> {
  /**
   * Size variant (overrides context if provided)
   */
  size?: SelectSize;
}

/**
 * SelectContent - The dropdown content container.
 */
export const SelectContent = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(
  (
    {
      size: propSize,
      className,
      children,
      position = 'popper',
      sideOffset = 4,
      ...props
    },
    ref
  ) => {
    const contextSize = useSelectSize();
    const size = propSize ?? contextSize;

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          position={position}
          sideOffset={sideOffset}
          className={cn(
            selectContentVariants({ size }),
            position === 'popper' &&
              'w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]',
            className
          )}
          {...props}
        >
          <SelectPrimitive.Viewport
            className={cn(
              'p-1',
              // Custom scrollbar styling
              '[&::-webkit-scrollbar]:w-3',
              '[&::-webkit-scrollbar-track]:bg-transparent',
              '[&::-webkit-scrollbar-thumb]:rounded',
              '[&::-webkit-scrollbar-thumb]:bg-background-tertiary',
              '[&::-webkit-scrollbar-thumb]:border-4',
              '[&::-webkit-scrollbar-thumb]:border-transparent',
              '[&::-webkit-scrollbar-thumb]:bg-clip-padding'
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  }
);

SelectContent.displayName = 'SelectContent';

// ============================================================================
// SelectItem
// ============================================================================

export interface SelectItemProps
  extends
    ComponentPropsWithoutRef<typeof SelectPrimitive.Item>,
    Omit<SelectItemVariants, 'size'> {
  /**
   * Size variant (overrides context if provided)
   */
  size?: SelectSize;
}

/**
 * SelectItem - An individual selectable option.
 */
export const SelectItem = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ size: propSize, className, children, ...props }, ref) => {
  const contextSize = useSelectSize();
  const size = propSize ?? contextSize;
  const checkSize = size === 'lg' ? 'md' : 'sm';

  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(selectItemVariants({ size }), className)}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex-1 truncate text-text-primary">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <Icon
          icon={Check}
          size={checkSize}
          className="text-info-500"
          aria-hidden
        />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});

SelectItem.displayName = 'SelectItem';

// ============================================================================
// SelectGroup
// ============================================================================

export type SelectGroupProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Group
>;

/**
 * SelectGroup - Groups related options together.
 */
export const SelectGroup = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Group>,
  SelectGroupProps
>((props, ref) => <SelectPrimitive.Group ref={ref} {...props} />);

SelectGroup.displayName = 'SelectGroup';

// ============================================================================
// SelectLabel
// ============================================================================

export type SelectLabelProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Label
>;

/**
 * SelectLabel - A label for a group of options.
 */
export const SelectLabel = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  SelectLabelProps
>(({ className, ...props }, ref) => {
  const size = useSelectSize();

  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cn(
        'px-3 py-1.5 font-medium text-text-secondary',
        size === 'lg' ? 'text-sm' : 'text-xs',
        className
      )}
      {...props}
    />
  );
});

SelectLabel.displayName = 'SelectLabel';

// ============================================================================
// SelectSeparator
// ============================================================================

export type SelectSeparatorProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Separator
>;

/**
 * SelectSeparator - Visual separator between groups.
 */
export const SelectSeparator = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  SelectSeparatorProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('my-1 h-px bg-border', className)}
    {...props}
  />
));

SelectSeparator.displayName = 'SelectSeparator';

// ============================================================================
// Exports
// ============================================================================

export {
  selectContentVariants,
  selectItemVariants,
  selectTriggerTextVariants,
  selectTriggerVariants,
};
