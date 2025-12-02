import { forwardRef, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import {
  InputDropmenuProvider,
  type InputDropmenuSize,
  useInputDropmenuSize,
} from './input-dropmenu-context';

/**
 * InputDropmenuContent container variants using CVA.
 *
 * Provides consistent container styling with size-based height variants:
 * - SM: 240px height
 * - MD: 288px height
 * - LG: 344px height (default)
 *
 * All sizes have a fixed width of 320px with responsive max-width constraint.
 */
const inputDropmenuContentVariants = cva(
  'flex flex-col overflow-clip rounded-sm border border-border-secondary bg-background shadow-lg',
  {
    variants: {
      size: {
        sm: 'h-[240px] w-[320px] max-w-[calc(100vw-2rem)]',
        md: 'h-[288px] w-[320px] max-w-[calc(100vw-2rem)]',
        lg: 'h-[344px] w-[320px] max-w-[calc(100vw-2rem)]',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

export type InputDropmenuContentVariants = VariantProps<
  typeof inputDropmenuContentVariants
>;

export interface InputDropmenuProps {
  /**
   * Size variant that propagates to all children
   * @default 'lg'
   */
  size?: InputDropmenuSize;
  /**
   * Child elements (typically InputDropmenuContent with InputDropmenuSearch and InputDropmenuOptions)
   */
  children: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * InputDropmenu - A composite dropdown container for form input scenarios.
 *
 * Combines a search input with a scrollable list of selectable options,
 * providing a cohesive user experience for selecting values from a filtered list.
 *
 * Unlike the general-purpose `Dropmenu` component (used for action menus),
 * the InputDropmenu is optimized for selection scenarios in forms.
 *
 * @example
 * ```tsx
 * import {
 *   InputDropmenu,
 *   InputDropmenuContent,
 *   InputDropmenuSearch,
 *   InputDropmenuOptions,
 *   DropmenuItem
 * } from '@/ui';
 *
 * // Basic usage
 * <InputDropmenu size="lg">
 *   <InputDropmenuContent>
 *     <InputDropmenuSearch placeholder="Search countries..." />
 *     <InputDropmenuOptions>
 *       <DropmenuItem label="United States" />
 *       <DropmenuItem label="Canada" />
 *     </InputDropmenuOptions>
 *   </InputDropmenuContent>
 * </InputDropmenu>
 * ```
 */
export function InputDropmenu({
  size = 'lg',
  children,
  className,
}: InputDropmenuProps): React.ReactElement {
  return (
    <InputDropmenuProvider size={size}>
      <div className={className}>{children}</div>
    </InputDropmenuProvider>
  );
}

InputDropmenu.displayName = 'InputDropmenu';

export interface InputDropmenuContentProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Size variant for the container. If not provided, uses size from InputDropmenu context.
   */
  size?: InputDropmenuSize;
  /**
   * Child elements (InputDropmenuSearch and InputDropmenuOptions)
   */
  children: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * InputDropmenuContent - Container component with size variants.
 *
 * Renders the dropdown content with proper sizing, border, and shadow styling.
 * Receives size from InputDropmenu context.
 *
 * @param props - Component props
 * @param props.children - Content to render (search and options)
 * @param props.className - Additional CSS classes
 */
export const InputDropmenuContent = forwardRef<
  HTMLDivElement,
  InputDropmenuContentProps
>(({ size: propSize, children, className, ...props }, ref) => {
  const contextSize = useInputDropmenuSize();
  const size = propSize ?? contextSize;

  return (
    <div
      ref={ref}
      role="listbox"
      aria-orientation="vertical"
      className={cn(inputDropmenuContentVariants({ size }), className)}
      {...props}
    >
      {children}
    </div>
  );
});

InputDropmenuContent.displayName = 'InputDropmenuContent';

export interface InputDropmenuOptionsProps extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * Child elements (DropmenuItem components)
   */
  children: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * InputDropmenuOptions - Scrollable container for option items.
 *
 * Provides a scrollable area with custom scrollbar styling for the options list.
 *
 * @param props - Component props
 * @param props.children - DropmenuItem components to render
 * @param props.className - Additional CSS classes
 */
export const InputDropmenuOptions = forwardRef<
  HTMLDivElement,
  InputDropmenuOptionsProps
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    className={cn(
      // Base styles
      'flex-1 overflow-y-auto py-1',
      // Custom scrollbar styling (12px container, 4px visible thumb)
      '[&::-webkit-scrollbar]:w-3',
      '[&::-webkit-scrollbar-track]:bg-transparent',
      '[&::-webkit-scrollbar-thumb]:rounded',
      '[&::-webkit-scrollbar-thumb]:bg-background-tertiary',
      '[&::-webkit-scrollbar-thumb]:border-4',
      '[&::-webkit-scrollbar-thumb]:border-transparent',
      '[&::-webkit-scrollbar-thumb]:bg-clip-padding',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

InputDropmenuOptions.displayName = 'InputDropmenuOptions';

export { inputDropmenuContentVariants };
