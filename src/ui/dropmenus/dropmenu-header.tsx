import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * DropmenuHeader size variants:
 * - `sm`: Small (12px font, 12px padding)
 * - `md`: Medium (14px font, 16px padding)
 * - `lg`: Large (14px font, 16px padding, same as md but matches Dropmenu lg variant)
 */
const dropmenuHeaderVariants = cva(
  'w-full pb-0 font-sans font-medium text-text-secondary',
  {
    variants: {
      size: {
        sm: 'px-3 pt-3 text-xs leading-[18px]', // 12px padding, 12px/18px font
        md: 'px-4 pt-4 text-sm leading-5', // 16px padding, 14px/20px font
        lg: 'px-4 pt-4 text-sm leading-5', // 16px padding, 14px/20px font (matches Dropmenu lg)
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

export type DropmenuHeaderVariants = VariantProps<typeof dropmenuHeaderVariants>;

export interface DropmenuHeaderProps extends DropmenuHeaderVariants {
  /**
   * The header label text
   */
  label: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * DropmenuHeader - A header element for dropdown menus.
 *
 * Provides section headers within dropdown lists to help users understand
 * the context or grouping of menu items. Supports two size variants (SM and MD)
 * to match the overall dropdown menu size.
 *
 * @example
 * ```tsx
 * import { DropmenuHeader } from '@/ui/dropmenus';
 *
 * // Basic usage
 * <DropmenuHeader label="Actions" />
 *
 * // Small size
 * <DropmenuHeader size="sm" label="Settings" />
 *
 * // With custom className
 * <DropmenuHeader label="Options" className="my-custom-class" />
 * ```
 */
export const DropmenuHeader = forwardRef<HTMLDivElement, DropmenuHeaderProps>(
  ({ size = 'lg', label, className }, ref) => (
    <div ref={ref} className={cn(dropmenuHeaderVariants({ size }), className)}>
      <p>{label}</p>
    </div>
  )
);

DropmenuHeader.displayName = 'DropmenuHeader';

export { dropmenuHeaderVariants };
