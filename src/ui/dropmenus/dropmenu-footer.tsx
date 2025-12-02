import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { TextSm, TextXs } from '@/ui/typography';

/**
 * DropmenuFooter size variants:
 * - `sm`: Small (12px font via TextXs, 12px padding)
 * - `md`: Medium (14px font via TextSm, 16px/8px padding)
 * - `lg`: Large (14px font via TextSm, 16px/8px padding, matches Dropmenu lg variant)
 */
export interface DropmenuFooterProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'color'
> {
  /**
   * Size variant - determines typography and padding
   * @default 'lg'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Footer content - required as empty footers are meaningless
   */
  children: ReactNode;
}

/**
 * DropmenuFooter - A footer element for dropdown menus.
 *
 * Composes TextXs/TextSm typography atoms within a styled container
 * to provide dropdown-specific footer semantics. Supports two size
 * variants (SM and MD) to match the overall dropdown menu size.
 *
 * @example
 * ```tsx
 * import { DropmenuFooter } from '@/ui/dropmenus';
 *
 * // Basic usage
 * <DropmenuFooter>Footer text</DropmenuFooter>
 *
 * // Small size
 * <DropmenuFooter size="sm">Footer text</DropmenuFooter>
 *
 * // With custom className
 * <DropmenuFooter className="my-custom-class">Footer</DropmenuFooter>
 * ```
 */
export const DropmenuFooter = forwardRef<HTMLDivElement, DropmenuFooterProps>(
  ({ size = 'lg', children, className, ...props }, ref) => {
    const TextComponent = size === 'sm' ? TextXs : TextSm;
    const paddingClasses = size === 'sm' ? 'px-3' : 'pl-4 pr-2';
    // lg and md use the same styling (TextSm, pl-4 pr-2)

    return (
      <div
        ref={ref}
        className={cn(
          'w-[200px] bg-background-secondary py-2',
          paddingClasses,
          className
        )}
        {...props}
      >
        <TextComponent as="span" color="muted">
          {children}
        </TextComponent>
      </div>
    );
  }
);

DropmenuFooter.displayName = 'DropmenuFooter';
