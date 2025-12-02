import {
  Children,
  cloneElement,
  type ComponentPropsWithoutRef,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { ButtonGroupItem } from './button-group-item';

/**
 * ButtonGroup container variant styles using Class Variance Authority (CVA).
 *
 * Implements layout behavior from the Glow UI Figma design:
 * - hug=true: inline-flex (content width)
 * - hug=false: w-full with flex-1 children (full container width)
 *
 * Uses `isolate` to create a stacking context for proper z-index handling
 * when items have hover states that need to overlap neighbors.
 */
const buttonGroupVariants = cva('isolate inline-flex', {
  variants: {
    hug: {
      true: '',
      false: 'w-full',
    },
  },
  defaultVariants: {
    hug: true,
  },
});

type ButtonGroupVariantProps = VariantProps<typeof buttonGroupVariants>;

/**
 * Position type for ButtonGroupItem children
 */
type Position = 'first' | 'middle' | 'last' | 'only';

/**
 * Calculates the position variant for a child based on its index and total count
 */
function getPosition(index: number, total: number): Position {
  if (total === 1) return 'only';
  if (index === 0) return 'first';
  if (index === total - 1) return 'last';
  return 'middle';
}

/**
 * Type guard to check if a child is a valid ButtonGroupItem element
 */
function isButtonGroupItem(child: ReactNode): child is ReactElement<{
  position?: Position;
  size?: string;
  className?: string;
}> {
  return (
    isValidElement(child) &&
    (child.type === ButtonGroupItem ||
      (child.type as { displayName?: string })?.displayName === 'ButtonGroupItem')
  );
}

export interface ButtonGroupProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'role'>, ButtonGroupVariantProps {
  /**
   * Size variant to pass down to all ButtonGroupItem children.
   * Individual item size props will override this group-level size.
   * @default undefined (children use their own default)
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether to hug content (true) or fill container width (false).
   * When false, children receive `flex-1` class for equal distribution.
   * @default true
   */
  hug?: boolean;

  /**
   * Orientation hint for future vertical support.
   * Currently only horizontal is implemented.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * ARIA role for the group container.
   * - 'group': Generic grouping (default)
   * - 'radiogroup': Mutually exclusive selections
   * - 'toolbar': Editor toolbars
   * @default 'group'
   */
  role?: 'group' | 'radiogroup' | 'toolbar';

  /**
   * Accessible label for the group (required for screen readers).
   */
  'aria-label'?: string;

  /**
   * ButtonGroupItem children
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ButtonGroup - Container for grouped button items
 *
 * A structural wrapper that groups multiple `ButtonGroupItem` components into
 * a cohesive segmented control. Automatically handles:
 * - Position detection (first/middle/last/only)
 * - Border overlap with `-ml-px` classes
 * - Size prop cascading to children
 * - Width behavior (hug content vs fill container)
 *
 * @accessibility
 * - Use `role="group"` for generic grouping (default)
 * - Use `role="radiogroup"` for mutually exclusive selections
 * - Use `role="toolbar"` for editor toolbars
 * - Provide `aria-label` or `aria-labelledby` for screen readers
 * - Individual ButtonGroupItem components handle keyboard interactions
 *
 * @example View toggle group
 * ```tsx
 * <ButtonGroup aria-label="View options">
 *   <ButtonGroupItem selected>List</ButtonGroupItem>
 *   <ButtonGroupItem>Grid</ButtonGroupItem>
 * </ButtonGroup>
 * ```
 *
 * @example Text alignment toolbar
 * ```tsx
 * <ButtonGroup role="toolbar" aria-label="Text alignment">
 *   <ButtonGroupItem leftIcon={AlignLeft} aria-label="Align left" />
 *   <ButtonGroupItem leftIcon={AlignCenter} aria-label="Align center" />
 *   <ButtonGroupItem leftIcon={AlignRight} aria-label="Align right" />
 * </ButtonGroup>
 * ```
 *
 * @example Full-width with size prop
 * ```tsx
 * <ButtonGroup size="lg" hug={false} aria-label="Options">
 *   <ButtonGroupItem>Option A</ButtonGroupItem>
 *   <ButtonGroupItem>Option B</ButtonGroupItem>
 *   <ButtonGroupItem>Option C</ButtonGroupItem>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      className,
      size,
      hug = true,
      orientation = 'horizontal',
      role = 'group',
      'aria-label': ariaLabel,
      children,
      ...props
    },
    ref
  ) => {
    // Convert children to array and filter for valid ButtonGroupItem elements
    const childArray = Children.toArray(children);
    const validChildren = childArray.filter(isButtonGroupItem);
    const totalCount = validChildren.length;

    // Warn in development if invalid children are provided
    if (process.env.NODE_ENV !== 'production') {
      const invalidCount = childArray.length - validChildren.length;
      if (invalidCount > 0) {
        console.warn(
          `ButtonGroup: Expected only ButtonGroupItem children, found ${invalidCount} invalid child(ren).`
        );
      }
    }

    // Clone children with calculated position, size, and className props
    const enhancedChildren = validChildren.map((child, index) => {
      const position = getPosition(index, totalCount);

      return cloneElement(child, {
        position,
        // Child size prop overrides group size prop
        size: child.props.size ?? size,
        className: cn(
          // Apply -ml-px for border overlap on all items except first
          index > 0 && '-ml-px',
          // Apply flex-1 for equal distribution when hug=false
          !hug && 'flex-1',
          // Preserve child's existing className
          child.props.className
        ),
      });
    });

    return (
      <div
        ref={ref}
        role={role}
        aria-label={ariaLabel}
        aria-orientation={orientation}
        className={cn(buttonGroupVariants({ hug }), className)}
        {...props}
      >
        {enhancedChildren}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

export { buttonGroupVariants };
