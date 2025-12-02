import {
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const textVariants = cva('font-sans', {
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

type TextVariantProps = VariantProps<typeof textVariants>;

interface BaseTextProps extends TextVariantProps {
  className?: string;
  as?: ElementType;
  asChild?: boolean;
}

export type TextXsProps = BaseTextProps & ComponentPropsWithoutRef<'p'>;
export type TextSmProps = BaseTextProps & ComponentPropsWithoutRef<'p'>;
export type TextMdProps = BaseTextProps & ComponentPropsWithoutRef<'p'>;

/**
 * TextXs - Extra small text (12px/18px)
 */
export const TextXs = forwardRef<HTMLParagraphElement, TextXsProps>(
  ({ className, weight, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'p';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-xs leading-[18px]',
          textVariants({ weight, color }),
          className
        )}
        {...props}
      />
    );
  }
);
TextXs.displayName = 'TextXs';

/**
 * TextSm - Small text (14px/20px)
 */
export const TextSm = forwardRef<HTMLParagraphElement, TextSmProps>(
  ({ className, weight, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'p';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-sm leading-5',
          textVariants({ weight, color }),
          className
        )}
        {...props}
      />
    );
  }
);
TextSm.displayName = 'TextSm';

/**
 * TextMd - Medium/base text (16px/24px)
 */
export const TextMd = forwardRef<HTMLParagraphElement, TextMdProps>(
  ({ className, weight, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'p';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-base leading-6',
          textVariants({ weight, color }),
          className
        )}
        {...props}
      />
    );
  }
);
TextMd.displayName = 'TextMd';

export { textVariants };
