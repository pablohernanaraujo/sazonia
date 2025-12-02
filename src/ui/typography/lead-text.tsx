import {
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const leadTextVariants = cva('font-sans', {
  variants: {
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
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
    weight: 'regular',
    color: 'default',
  },
});

type LeadTextVariantProps = VariantProps<typeof leadTextVariants>;

interface BaseLeadTextProps extends LeadTextVariantProps {
  className?: string;
  as?: ElementType;
  asChild?: boolean;
}

export type LeadTextXsProps = BaseLeadTextProps & ComponentPropsWithoutRef<'p'>;
export type LeadTextSmProps = BaseLeadTextProps & ComponentPropsWithoutRef<'p'>;
export type LeadTextMdProps = BaseLeadTextProps & ComponentPropsWithoutRef<'p'>;

/**
 * LeadTextXs - Extra small lead text (18px/26px)
 */
export const LeadTextXs = forwardRef<HTMLParagraphElement, LeadTextXsProps>(
  ({ className, weight, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'p';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-lg leading-[26px]',
          leadTextVariants({ weight, color }),
          className
        )}
        {...props}
      />
    );
  }
);
LeadTextXs.displayName = 'LeadTextXs';

/**
 * LeadTextSm - Small lead text (20px/28px)
 */
export const LeadTextSm = forwardRef<HTMLParagraphElement, LeadTextSmProps>(
  ({ className, weight, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'p';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-xl leading-7',
          leadTextVariants({ weight, color }),
          className
        )}
        {...props}
      />
    );
  }
);
LeadTextSm.displayName = 'LeadTextSm';

/**
 * LeadTextMd - Medium lead text (24px/32px)
 */
export const LeadTextMd = forwardRef<HTMLParagraphElement, LeadTextMdProps>(
  ({ className, weight, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'p';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-2xl leading-8',
          leadTextVariants({ weight, color }),
          className
        )}
        {...props}
      />
    );
  }
);
LeadTextMd.displayName = 'LeadTextMd';

export { leadTextVariants };
