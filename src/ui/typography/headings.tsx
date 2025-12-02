import {
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const headingColorVariants = cva('font-sans', {
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

type HeadingColorVariantProps = VariantProps<typeof headingColorVariants>;

interface BaseHeadingProps extends HeadingColorVariantProps {
  className?: string;
  as?: ElementType;
  asChild?: boolean;
}

export type H1Props = BaseHeadingProps & ComponentPropsWithoutRef<'h1'>;
export type H2Props = BaseHeadingProps & ComponentPropsWithoutRef<'h2'>;
export type H3Props = BaseHeadingProps & ComponentPropsWithoutRef<'h3'>;
export type H4Props = BaseHeadingProps & ComponentPropsWithoutRef<'h4'>;
export type H5Props = BaseHeadingProps & ComponentPropsWithoutRef<'h5'>;
export type H6Props = BaseHeadingProps & ComponentPropsWithoutRef<'h6'>;
export type SubtitleProps = BaseHeadingProps & ComponentPropsWithoutRef<'span'>;

/**
 * H1 - Heading 1 (40px/50px, bold)
 */
export const H1 = forwardRef<HTMLHeadingElement, H1Props>(
  ({ className, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'h1';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-[40px] leading-[50px] font-bold',
          headingColorVariants({ color }),
          className
        )}
        {...props}
      />
    );
  }
);
H1.displayName = 'H1';

/**
 * H2 - Heading 2 (32px/40px, bold)
 */
export const H2 = forwardRef<HTMLHeadingElement, H2Props>(
  ({ className, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'h2';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-[32px] leading-10 font-bold',
          headingColorVariants({ color }),
          className
        )}
        {...props}
      />
    );
  }
);
H2.displayName = 'H2';

/**
 * H3 - Heading 3 (24px/32px, bold)
 */
export const H3 = forwardRef<HTMLHeadingElement, H3Props>(
  ({ className, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'h3';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-2xl leading-8 font-bold',
          headingColorVariants({ color }),
          className
        )}
        {...props}
      />
    );
  }
);
H3.displayName = 'H3';

/**
 * H4 - Heading 4 (20px/28px, bold)
 */
export const H4 = forwardRef<HTMLHeadingElement, H4Props>(
  ({ className, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'h4';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-xl leading-7 font-bold',
          headingColorVariants({ color }),
          className
        )}
        {...props}
      />
    );
  }
);
H4.displayName = 'H4';

/**
 * H5 - Heading 5 (18px/26px, bold)
 */
export const H5 = forwardRef<HTMLHeadingElement, H5Props>(
  ({ className, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'h5';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-lg leading-[26px] font-bold',
          headingColorVariants({ color }),
          className
        )}
        {...props}
      />
    );
  }
);
H5.displayName = 'H5';

/**
 * H6 - Heading 6 (16px/24px, bold)
 */
export const H6 = forwardRef<HTMLHeadingElement, H6Props>(
  ({ className, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'h6';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-base leading-6 font-bold',
          headingColorVariants({ color }),
          className
        )}
        {...props}
      />
    );
  }
);
H6.displayName = 'H6';

/**
 * Subtitle - Subtitle text (14px/20px, semibold, uppercase)
 */
export const Subtitle = forwardRef<HTMLSpanElement, SubtitleProps>(
  ({ className, color, as, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'span';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-sm leading-5 font-semibold tracking-wide uppercase',
          headingColorVariants({ color }),
          className
        )}
        {...props}
      />
    );
  }
);
Subtitle.displayName = 'Subtitle';

export { headingColorVariants };
