import { type ComponentPropsWithoutRef, forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface DropmenuDividerProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Additional CSS classes for customization
   */
  className?: string;
}

/**
 * DropmenuDivider - Visual separator for dropdown menus
 *
 * Renders a 1px horizontal line to visually separate groups of menu items.
 * Helps users quickly scan and understand menu organization.
 *
 * @example
 * ```tsx
 * <DropmenuItem>Edit</DropmenuItem>
 * <DropmenuItem>Copy</DropmenuItem>
 * <DropmenuDivider />
 * <DropmenuItem>Delete</DropmenuItem>
 * ```
 */
export const DropmenuDivider = forwardRef<HTMLDivElement, DropmenuDividerProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('w-full bg-background py-0.5', className)}
      {...props}
    >
      <div className="h-px w-full bg-fill-tertiary" />
    </div>
  )
);

DropmenuDivider.displayName = 'DropmenuDivider';
