import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { CaretDown, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Button } from '@/ui/buttons';
import { Icon } from '@/ui/icons';

/**
 * Alignment variants for CalendarHeader component.
 *
 * - `left`: Month and year selectors on left, navigation on right (default)
 * - `center`: Navigation buttons on sides, month-year selector centered
 */
export type CalendarHeaderAlign = 'left' | 'center';

/**
 * CalendarHeader variant styles using Class Variance Authority (CVA).
 *
 * Implements layout variants for different calendar header alignments:
 * - Left: Flexbox with justify-between for selector/nav separation
 * - Center: Relative positioning for centered selector with absolute nav buttons
 */
const calendarHeaderVariants = cva('flex items-center', {
  variants: {
    align: {
      left: 'justify-between',
      center: 'relative h-8 justify-center',
    },
  },
  defaultVariants: {
    align: 'left',
  },
});

export type CalendarHeaderVariants = VariantProps<typeof calendarHeaderVariants>;

export interface CalendarHeaderProps
  extends ComponentPropsWithoutRef<'div'>, CalendarHeaderVariants {
  /**
   * Month name or abbreviation to display (for left alignment)
   * @example "Mar", "March"
   */
  month?: string;

  /**
   * Year to display (for left alignment)
   * @example 2025
   */
  year?: number;

  /**
   * Combined month and year text (for center alignment)
   * @example "June 2022"
   */
  monthYearCombined?: string;

  /**
   * Callback when previous month button is clicked
   */
  onPreviousClick?: () => void;

  /**
   * Callback when next month button is clicked
   */
  onNextClick?: () => void;

  /**
   * Callback when month selector is clicked
   */
  onMonthClick?: () => void;

  /**
   * Callback when year selector is clicked
   */
  onYearClick?: () => void;
}

/**
 * Selector button styles shared between month and year selectors.
 */
const selectorButtonStyles = cn(
  'inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5',
  'text-sm leading-5 font-semibold text-text-primary',
  'hover:bg-background-brand-secondary',
  'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none',
  'transition-colors duration-150'
);

/**
 * CalendarHeader - Navigation control for calendar interfaces.
 *
 * Displays the current month/year and provides navigation buttons to move
 * between months. Supports two layout variants for different use cases.
 *
 * ## Alignment Variants
 * - **left** (default): Month/year selectors on left, navigation on right
 * - **center**: Centered month-year selector with navigation on sides
 *
 * ## Features
 * - Month and year selectors with dropdown indicators
 * - Previous/next navigation buttons
 * - Full keyboard and screen reader accessibility
 * - Click handlers for all interactive elements
 *
 * @example
 * ```tsx
 * import { CalendarHeader } from '@/ui';
 *
 * // Left-aligned (default)
 * <CalendarHeader
 *   month="Mar"
 *   year={2025}
 *   onPreviousClick={() => {}}
 *   onNextClick={() => {}}
 * />
 *
 * // Center-aligned
 * <CalendarHeader
 *   align="center"
 *   monthYearCombined="June 2022"
 *   onPreviousClick={() => {}}
 *   onNextClick={() => {}}
 * />
 * ```
 */
export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  (
    {
      align = 'left',
      month,
      year,
      monthYearCombined,
      onPreviousClick,
      onNextClick,
      onMonthClick,
      onYearClick,
      className,
      ...props
    },
    ref
  ) => {
    // Development-time validation
    if (process.env.NODE_ENV !== 'production') {
      if (align === 'left' && (!month || year === undefined)) {
        console.warn(
          'CalendarHeader: "month" and "year" props are required when align="left"'
        );
      }
      if (align === 'center' && !monthYearCombined) {
        console.warn(
          'CalendarHeader: "monthYearCombined" prop is required when align="center"'
        );
      }
    }

    const classes = cn(calendarHeaderVariants({ align }), className);

    // Render left-aligned variant
    if (align === 'left') {
      return (
        <div ref={ref} className={classes} {...props}>
          {/* Month and Year selectors */}
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              className={selectorButtonStyles}
              onClick={onMonthClick}
              aria-label="Select month"
            >
              {month}
              <Icon icon={CaretDown} size="sm" color={null} aria-hidden />
            </button>
            <button
              type="button"
              className={selectorButtonStyles}
              onClick={onYearClick}
              aria-label="Select year"
            >
              {year}
              <Icon icon={CaretDown} size="sm" color={null} aria-hidden />
            </button>
          </div>

          {/* Navigation buttons */}
          <div className="inline-flex items-center gap-1">
            <Button
              leftIcon={CaretLeft}
              variant="plain"
              color="secondary"
              size="sm"
              aria-label="Previous month"
              onClick={onPreviousClick}
            />
            <Button
              leftIcon={CaretRight}
              variant="plain"
              color="secondary"
              size="sm"
              aria-label="Next month"
              onClick={onNextClick}
            />
          </div>
        </div>
      );
    }

    // Render center-aligned variant
    return (
      <div ref={ref} className={classes} {...props}>
        {/* Previous button - absolute left */}
        <Button
          leftIcon={CaretLeft}
          variant="plain"
          color="secondary"
          size="sm"
          aria-label="Previous month"
          onClick={onPreviousClick}
          className="absolute left-0"
        />

        {/* Combined selector - centered */}
        <button
          type="button"
          className={cn(selectorButtonStyles, 'w-[140px] justify-center')}
          onClick={onMonthClick}
          aria-label="Select month and year"
        >
          {monthYearCombined}
          <Icon icon={CaretDown} size="sm" color={null} aria-hidden />
        </button>

        {/* Next button - absolute right */}
        <Button
          leftIcon={CaretRight}
          variant="plain"
          color="secondary"
          size="sm"
          aria-label="Next month"
          onClick={onNextClick}
          className="absolute right-0"
        />
      </div>
    );
  }
);

CalendarHeader.displayName = 'CalendarHeader';

export { calendarHeaderVariants };
