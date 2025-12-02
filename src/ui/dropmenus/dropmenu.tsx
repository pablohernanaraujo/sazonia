import { forwardRef, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import {
  DropmenuProvider,
  type DropmenuSize,
  useDropmenuSize,
} from './dropmenu-context';

/**
 * DropmenuContent container variants using CVA.
 *
 * Provides consistent container styling with size-based width variants:
 * - SM: 220px width
 * - MD: 240px width
 * - LG: 260px width (default)
 *
 * All sizes include responsive width constraint to prevent overflow on small screens.
 */
const dropmenuContentVariants = cva(
  'flex flex-col overflow-clip rounded-sm border border-border-secondary bg-background shadow-lg',
  {
    variants: {
      size: {
        sm: 'w-[220px] max-w-[calc(100vw-2rem)]',
        md: 'w-[240px] max-w-[calc(100vw-2rem)]',
        lg: 'w-[260px] max-w-[calc(100vw-2rem)]',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

export type DropmenuContentVariants = VariantProps<
  typeof dropmenuContentVariants
>;

export interface DropmenuProps {
  /**
   * Size variant that propagates to all children
   * @default 'lg'
   */
  size?: DropmenuSize;
  /**
   * Child elements (typically DropmenuContent with DropmenuHeader, DropmenuOption, etc.)
   */
  children: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Dropmenu - A composite dropdown menu container component.
 *
 * Provides a context-based size propagation system for consistent sizing
 * across all child dropdown menu components (DropmenuHeader, DropmenuOption,
 * DropmenuFooter, DropmenuDivider).
 *
 * Use with DropmenuContent to create a styled dropdown container.
 *
 * @example
 * ```tsx
 * import {
 *   Dropmenu,
 *   DropmenuContent,
 *   DropmenuHeader,
 *   DropmenuOption,
 *   DropmenuDivider,
 *   DropmenuFooter,
 * } from '@/ui/dropmenus';
 *
 * // Basic usage
 * <Dropmenu size="md">
 *   <DropmenuContent>
 *     <DropmenuHeader label="Actions" />
 *     <DropmenuOption label="Edit" />
 *     <DropmenuOption label="Delete" />
 *     <DropmenuDivider />
 *     <DropmenuFooter>More options...</DropmenuFooter>
 *   </DropmenuContent>
 * </Dropmenu>
 * ```
 */
export function Dropmenu({
  size = 'lg',
  children,
  className,
}: DropmenuProps): React.ReactElement {
  return (
    <DropmenuProvider size={size}>
      <div className={className}>{children}</div>
    </DropmenuProvider>
  );
}

Dropmenu.displayName = 'Dropmenu';

export interface DropmenuContentProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Size variant for the container. If not provided, uses size from Dropmenu context.
   */
  size?: DropmenuSize;
  /**
   * Child elements (DropmenuHeader, DropmenuOption, DropmenuFooter, DropmenuDivider)
   */
  children: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * DropmenuContent - The styled container for dropdown menu items.
 *
 * Provides consistent styling with border, shadow, and rounded corners.
 * Size is automatically inherited from the parent Dropmenu context,
 * but can be overridden with an explicit size prop.
 *
 * @example
 * ```tsx
 * <Dropmenu size="md">
 *   <DropmenuContent>
 *     <DropmenuOption label="Option 1" />
 *     <DropmenuOption label="Option 2" />
 *   </DropmenuContent>
 * </Dropmenu>
 *
 * // Override size for specific content
 * <Dropmenu size="lg">
 *   <DropmenuContent size="sm">
 *     <DropmenuOption label="Compact option" />
 *   </DropmenuContent>
 * </Dropmenu>
 * ```
 */
export const DropmenuContent = forwardRef<HTMLDivElement, DropmenuContentProps>(
  ({ size: propSize, children, className, ...props }, ref) => {
    const contextSize = useDropmenuSize();
    const size = propSize ?? contextSize;

    return (
      <div
        ref={ref}
        role="menu"
        aria-orientation="vertical"
        className={cn(dropmenuContentVariants({ size }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropmenuContent.displayName = 'DropmenuContent';

export { dropmenuContentVariants };
