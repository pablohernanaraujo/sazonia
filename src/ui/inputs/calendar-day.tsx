import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Day type variants for CalendarDay component.
 *
 * - `default`: Standard day in current month
 * - `today`: Today's date (brand colored text)
 * - `previousMonth`: Day from previous month (grayed out)
 * - `nextMonth`: Day from next month (grayed out)
 * - `dayOfWeek`: Day-of-week header (Mo, Tu, etc.)
 * - `empty`: Empty placeholder cell
 */
export type CalendarDayType =
  | 'default'
  | 'today'
  | 'previousMonth'
  | 'nextMonth'
  | 'dayOfWeek'
  | 'empty';

/**
 * Interactive state variants for CalendarDay component.
 *
 * - `default`: Normal state
 * - `hovered`: Mouse hover state (managed via CSS)
 * - `selected`: Single selection state
 * - `multiSelectStart`: Start of date range selection
 * - `multiSelectCenter`: Middle of date range selection
 * - `multiSelectEnd`: End of date range selection
 * - `disabled`: Non-interactive state
 */
export type CalendarDayState =
  | 'default'
  | 'hovered'
  | 'selected'
  | 'multiSelectStart'
  | 'multiSelectCenter'
  | 'multiSelectEnd'
  | 'disabled';

/**
 * CalendarDay variant styles using Class Variance Authority (CVA).
 *
 * Implements all visual states from the Glow UI Figma design:
 * - Fixed 34x34px size
 * - Various day types with appropriate text colors
 * - Interactive states with backgrounds and borders
 * - Multi-selection states with directional border-radius
 */
const calendarDayVariants = cva(
  [
    'font-sans',
    'size-[34px]',
    'flex items-center justify-center',
    'text-center text-xs leading-[18px]',
    'select-none',
    'transition-colors duration-150',
  ],
  {
    variants: {
      dayType: {
        default: 'font-normal text-text-primary',
        today: 'font-normal text-primary',
        previousMonth: 'font-normal text-text-tertiary',
        nextMonth: 'font-normal text-text-tertiary',
        dayOfWeek: 'rounded-full font-medium text-text-tertiary',
        empty: '',
      },
      state: {
        default: '',
        hovered:
          'rounded-sm border border-border-brand bg-background-brand-secondary',
        selected: 'rounded-sm bg-fill-primary text-text-overlay-white',
        multiSelectStart:
          'rounded-l-sm rounded-r-none bg-fill-primary text-text-overlay-white',
        multiSelectCenter: 'rounded-none bg-background-brand-tertiary',
        multiSelectEnd:
          'rounded-l-none rounded-r-sm bg-fill-primary text-text-overlay-white',
        disabled: 'cursor-not-allowed text-text-secondary',
      },
    },
    compoundVariants: [
      // Today + Hovered
      {
        dayType: 'today',
        state: 'hovered',
        className:
          'border border-border-brand bg-background-brand-secondary text-primary',
      },
      // Today + Selected
      {
        dayType: 'today',
        state: 'selected',
        className: 'bg-fill-primary text-text-overlay-white',
      },
      // Today + Multi-select Center (keeps brand text)
      {
        dayType: 'today',
        state: 'multiSelectCenter',
        className: 'bg-background-brand-tertiary text-primary',
      },
      // Today + Multi-select Start
      {
        dayType: 'today',
        state: 'multiSelectStart',
        className: 'bg-fill-primary text-text-overlay-white',
      },
      // Today + Multi-select End
      {
        dayType: 'today',
        state: 'multiSelectEnd',
        className: 'bg-fill-primary text-text-overlay-white',
      },
      // Today + Disabled
      {
        dayType: 'today',
        state: 'disabled',
        className: 'text-text-secondary',
      },
      // Previous/Next Month + Disabled (extra muted)
      {
        dayType: 'previousMonth',
        state: 'disabled',
        className: 'text-text-secondary',
      },
      {
        dayType: 'nextMonth',
        state: 'disabled',
        className: 'text-text-secondary',
      },
      // Default interactive states (add hover capability and rounded-sm)
      {
        dayType: 'default',
        state: 'default',
        className:
          'cursor-pointer rounded-sm hover:border hover:border-border-brand hover:bg-background-brand-secondary',
      },
      {
        dayType: 'today',
        state: 'default',
        className:
          'cursor-pointer rounded-sm hover:border hover:border-border-brand hover:bg-background-brand-secondary',
      },
      {
        dayType: 'previousMonth',
        state: 'default',
        className:
          'cursor-pointer rounded-sm hover:border hover:border-border-brand hover:bg-background-brand-secondary',
      },
      {
        dayType: 'nextMonth',
        state: 'default',
        className:
          'cursor-pointer rounded-sm hover:border hover:border-border-brand hover:bg-background-brand-secondary',
      },
      // Disabled state for interactive types needs rounded-sm
      {
        dayType: 'default',
        state: 'disabled',
        className: 'rounded-sm',
      },
      {
        dayType: 'today',
        state: 'disabled',
        className: 'rounded-sm',
      },
      {
        dayType: 'previousMonth',
        state: 'disabled',
        className: 'rounded-sm',
      },
      {
        dayType: 'nextMonth',
        state: 'disabled',
        className: 'rounded-sm',
      },
    ],
    defaultVariants: {
      dayType: 'default',
      state: 'default',
    },
  }
);

export type CalendarDayVariants = VariantProps<typeof calendarDayVariants>;

export interface CalendarDayProps
  extends
    Omit<ComponentPropsWithoutRef<'button'>, 'children'>,
    CalendarDayVariants {
  /**
   * The day number or text to display (1-31 for days, Mo/Tu/etc for headers)
   */
  day?: number | string;

  /**
   * Whether this day is today's date
   * @default false
   */
  isToday?: boolean;

  /**
   * Click handler for day selection
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
}

/**
 * Determines the element type based on day type.
 * Empty and dayOfWeek cells are non-interactive (div).
 * All other day types are interactive (button).
 */
function isInteractive(dayType: CalendarDayType | null | undefined): boolean {
  return dayType !== 'empty' && dayType !== 'dayOfWeek';
}

/**
 * Determines if the day is in a selected state (single or multi-select).
 */
function isSelected(state: CalendarDayState | null | undefined): boolean {
  return (
    state === 'selected' ||
    state === 'multiSelectStart' ||
    state === 'multiSelectCenter' ||
    state === 'multiSelectEnd'
  );
}

/**
 * Resolves the effective day type based on isToday prop.
 */
function getEffectiveDayType(
  dayType: CalendarDayType,
  isToday: boolean
): CalendarDayType {
  return isToday && dayType === 'default' ? 'today' : dayType;
}

/**
 * Resolves the effective state based on disabled prop.
 */
function getEffectiveState(
  state: CalendarDayState,
  disabled: boolean | undefined
): CalendarDayState {
  return disabled ? 'disabled' : state;
}

/**
 * Gets aria-current value for the day.
 */
function getAriaCurrent(
  isToday: boolean,
  effectiveDayType: CalendarDayType
): 'date' | undefined {
  return isToday || effectiveDayType === 'today' ? 'date' : undefined;
}

/**
 * CalendarDay - A foundational building block for calendar interfaces.
 *
 * Represents an individual day cell within a calendar grid, supporting
 * multiple visual states and day types for rich date selection experiences.
 *
 * ## Day Types
 * - **default**: Standard day in current month
 * - **today**: Today's date with brand-colored text
 * - **previousMonth/nextMonth**: Adjacent month days (grayed out)
 * - **dayOfWeek**: Header cells (Mo, Tu, We, etc.)
 * - **empty**: Placeholder cells
 *
 * ## States
 * - **default**: Normal interactive state
 * - **hovered**: CSS hover state (handled automatically)
 * - **selected**: Single date selection
 * - **multiSelectStart/Center/End**: Range selection
 * - **disabled**: Non-interactive
 *
 * @example
 * ```tsx
 * import { CalendarDay } from '@/ui';
 *
 * // Basic day
 * <CalendarDay day={15} />
 *
 * // Today's date
 * <CalendarDay day={20} dayType="today" isToday />
 *
 * // Selected day
 * <CalendarDay day={15} state="selected" />
 *
 * // Day from previous month
 * <CalendarDay day={28} dayType="previousMonth" />
 *
 * // Day of week header
 * <CalendarDay day="Mo" dayType="dayOfWeek" />
 *
 * // Date range selection
 * <CalendarDay day={10} state="multiSelectStart" />
 * <CalendarDay day={11} state="multiSelectCenter" />
 * <CalendarDay day={12} state="multiSelectEnd" />
 *
 * // Disabled day
 * <CalendarDay day={5} state="disabled" disabled />
 * ```
 */
export const CalendarDay = forwardRef<
  HTMLButtonElement | HTMLDivElement,
  CalendarDayProps
>(
  (
    {
      day,
      dayType = 'default',
      state = 'default',
      isToday = false,
      disabled,
      onClick,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const resolvedDayType = dayType ?? 'default';
    const resolvedState = state ?? 'default';
    const effectiveDayType = getEffectiveDayType(resolvedDayType, isToday);
    const effectiveState = getEffectiveState(resolvedState, disabled);
    const interactive = isInteractive(effectiveDayType);
    const isDisabledState = effectiveState === 'disabled';

    const classes = cn(
      calendarDayVariants({
        dayType: effectiveDayType,
        state: interactive ? effectiveState : undefined,
      }),
      className
    );

    const handleClick = (
      event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
    ): void => {
      if (!interactive || isDisabledState) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    const handleKeyDown = (
      event: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>
    ): void => {
      if (!interactive || isDisabledState) {
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick?.(
          event as unknown as React.MouseEvent<HTMLButtonElement | HTMLDivElement>
        );
      }
    };

    const ariaAttributes = {
      'aria-selected': isSelected(effectiveState) || undefined,
      'aria-disabled': isDisabledState || undefined,
      'aria-current': getAriaCurrent(isToday, effectiveDayType),
      'aria-label': ariaLabel,
    };

    // Render as div for non-interactive cells (empty, dayOfWeek)
    if (!interactive) {
      const role = effectiveDayType === 'dayOfWeek' ? 'columnheader' : undefined;

      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={classes}
          role={role}
          {...ariaAttributes}
          {...(props as ComponentPropsWithoutRef<'div'>)}
        >
          {effectiveDayType !== 'empty' ? day : null}
        </div>
      );
    }

    // Render as button for interactive cells
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={classes}
        disabled={isDisabledState}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="gridcell"
        tabIndex={isDisabledState ? -1 : 0}
        {...ariaAttributes}
        {...(props as ComponentPropsWithoutRef<'button'>)}
      >
        {day}
      </button>
    );
  }
);

CalendarDay.displayName = 'CalendarDay';

export { calendarDayVariants };
