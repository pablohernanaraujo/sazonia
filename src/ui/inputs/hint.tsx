import { type ComponentPropsWithoutRef, forwardRef } from 'react';

import { cn } from '@/lib/utils';
import { TextSm, TextXs } from '@/ui/typography';

export interface HintProps extends Omit<
  ComponentPropsWithoutRef<'span'>,
  'color'
> {
  /**
   * Size variant
   * - sm: 12px (text-xs)
   * - md: 14px (text-sm)
   * @default 'md'
   */
  size?: 'sm' | 'md';

  /**
   * Hint text content
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Hint - Form helper text component
 *
 * Provides contextual information below form inputs. Composes from
 * Text components (TextXs, TextSm) to ensure typography consistency.
 *
 * @example
 * ```tsx
 * <label htmlFor="email">Email</label>
 * <input id="email" aria-describedby="email-hint" />
 * <Hint id="email-hint">We'll never share your email</Hint>
 * ```
 */
export const Hint = forwardRef<HTMLSpanElement, HintProps>(
  ({ size = 'md', children, className, ...props }, ref) => {
    const TextComponent = size === 'sm' ? TextXs : TextSm;

    return (
      <TextComponent
        ref={ref as React.Ref<HTMLParagraphElement>}
        as="span"
        color="muted"
        className={cn('pt-2', className)}
        {...props}
      >
        {children}
      </TextComponent>
    );
  }
);

Hint.displayName = 'Hint';
