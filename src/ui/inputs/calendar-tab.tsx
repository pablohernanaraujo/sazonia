import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * CalendarTab variant styles using Class Variance Authority (CVA).
 *
 * Implements all visual states from the Glow UI Figma design:
 * - Fixed 32px height with 8px horizontal, 6px vertical padding
 * - 6px border radius
 * - Typography: Inter Medium 14px/20px
 *
 * States are handled through CSS pseudo-classes for transient states
 * (hover, focus, pressed) and a boolean `active` prop for selected state.
 */
const calendarTabVariants = cva(
  [
    'inline-flex items-center justify-center',
    'h-8 gap-1.5 px-2 py-1.5',
    'rounded-sm',
    'text-sm leading-5 font-medium',
    'transition-colors duration-150',
    'cursor-pointer select-none',
    // Pseudo-class states
    'hover:text-text-tertiary-hover',
    'focus-visible:ring-primary-300 focus-visible:bg-background focus-visible:ring-2 focus-visible:outline-none',
    'active:text-text-tertiary-active active:bg-background',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-52',
  ],
  {
    variants: {
      active: {
        true: 'bg-background text-primary',
        false: 'text-text-tertiary',
      },
    },
    compoundVariants: [
      {
        active: true,
        className: 'hover:text-primary focus-visible:text-primary',
      },
    ],
    defaultVariants: {
      active: false,
    },
  }
);

export type CalendarTabVariants = VariantProps<typeof calendarTabVariants>;

export interface CalendarTabProps
  extends
    Omit<ComponentPropsWithoutRef<'button'>, 'children'>,
    CalendarTabVariants {
  /**
   * The text content to display in the tab
   */
  children: React.ReactNode;

  /**
   * Whether the tab is in the active/selected state
   * @default false
   */
  active?: boolean;
}

/**
 * CalendarTab - A navigation/selection element for calendar interfaces.
 *
 * Serves as a tab-style control for switching between different views or
 * time periods within calendar widgets, such as toggling between day/week/month
 * views or selecting year/month modes.
 *
 * ## States
 * - **Default**: Tertiary text color, transparent background
 * - **Hover**: Darker tertiary text (via CSS :hover)
 * - **Focus**: White background with primary ring (via CSS :focus-visible)
 * - **Pressed**: White background with active text (via CSS :active)
 * - **Active**: White background with primary/brand text color
 * - **Active + Focus**: White background with primary text and focus ring
 * - **Disabled**: Reduced opacity, non-interactive
 *
 * @example
 * ```tsx
 * import { CalendarTab } from '@/ui';
 *
 * // Basic tab
 * <CalendarTab>Month</CalendarTab>
 *
 * // Active/selected tab
 * <CalendarTab active>2024</CalendarTab>
 *
 * // Tab group for view switching
 * <div className="inline-flex gap-1 bg-fill-secondary rounded-md p-1">
 *   <CalendarTab active>Month</CalendarTab>
 *   <CalendarTab>Year</CalendarTab>
 * </div>
 *
 * // Disabled tab
 * <CalendarTab disabled>Unavailable</CalendarTab>
 * ```
 */
export const CalendarTab = forwardRef<HTMLButtonElement, CalendarTabProps>(
  ({ className, active = false, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="tab"
      disabled={disabled}
      className={cn(calendarTabVariants({ active }), className)}
      aria-selected={active}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children}
    </button>
  )
);

CalendarTab.displayName = 'CalendarTab';

export { calendarTabVariants };
