import {
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const displayColorVariants = cva('font-sans font-normal', {
  variants: {
    color: {
      default: 'text-text-primary',
      muted: 'text-text-secondary',
      primary: 'text-primary',
      secondary: 'text-secondary',
      destructive: 'text-destructive',
      success: 'text-success',
      warning: 'text-warning',
      info: 'text-info',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

type DisplayColorVariantProps = VariantProps<typeof displayColorVariants>;

interface BaseDisplayProps extends DisplayColorVariantProps {
  className?: string;
  as?: ElementType;
  asChild?: boolean;
}

export type DisplayXxlProps = BaseDisplayProps & ComponentPropsWithoutRef<'span'>;
export type DisplayXlProps = BaseDisplayProps & ComponentPropsWithoutRef<'span'>;
export type DisplayLgProps = BaseDisplayProps & ComponentPropsWithoutRef<'span'>;
export type DisplayMdProps = BaseDisplayProps & ComponentPropsWithoutRef<'span'>;
export type DisplaySmProps = BaseDisplayProps & ComponentPropsWithoutRef<'span'>;
export type DisplayXsProps = BaseDisplayProps & ComponentPropsWithoutRef<'span'>;

/**
 * DisplayXxl - Extra extra large display text (80px/100px, regular)
 */
export const DisplayXxl = forwardRef<HTMLSpanElement, DisplayXxlProps>(
  ({ className, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'span';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-[80px] leading-[100px]',
          displayColorVariants({ color }),
          className
        )}
        {...props}
      />
    );
  }
);
DisplayXxl.displayName = 'DisplayXxl';

/**
 * DisplayXl - Extra large display text (72px/90px, regular)
 */
export const DisplayXl = forwardRef<HTMLSpanElement, DisplayXlProps>(
  ({ className, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'span';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-[72px] leading-[90px]',
          displayColorVariants({ color }),
          className
        )}
        {...props}
      />
    );
  }
);
DisplayXl.displayName = 'DisplayXl';

/**
 * DisplayLg - Large display text (64px/80px, regular)
 */
export const DisplayLg = forwardRef<HTMLSpanElement, DisplayLgProps>(
  ({ className, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'span';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-[64px] leading-[80px]',
          displayColorVariants({ color }),
          className
        )}
        {...props}
      />
    );
  }
);
DisplayLg.displayName = 'DisplayLg';

/**
 * DisplayMd - Medium display text (56px/70px, regular)
 */
export const DisplayMd = forwardRef<HTMLSpanElement, DisplayMdProps>(
  ({ className, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'span';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-[56px] leading-[70px]',
          displayColorVariants({ color }),
          className
        )}
        {...props}
      />
    );
  }
);
DisplayMd.displayName = 'DisplayMd';

/**
 * DisplaySm - Small display text (48px/60px, regular)
 */
export const DisplaySm = forwardRef<HTMLSpanElement, DisplaySmProps>(
  ({ className, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'span';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-[48px] leading-[60px]',
          displayColorVariants({ color }),
          className
        )}
        {...props}
      />
    );
  }
);
DisplaySm.displayName = 'DisplaySm';

/**
 * DisplayXs - Extra small display text (40px/50px, regular)
 */
export const DisplayXs = forwardRef<HTMLSpanElement, DisplayXsProps>(
  ({ className, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'span';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-[40px] leading-[50px]',
          displayColorVariants({ color }),
          className
        )}
        {...props}
      />
    );
  }
);
DisplayXs.displayName = 'DisplayXs';

export { displayColorVariants };
