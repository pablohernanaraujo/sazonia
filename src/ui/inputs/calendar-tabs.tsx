import { forwardRef, useCallback, useId, useMemo, useRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { CalendarTab } from './calendar-tab';

/**
 * CalendarTabs container variant styles using Class Variance Authority (CVA).
 *
 * NOTE: This is the first vertical container in the design system.
 * Unlike ButtonGroup (horizontal), this uses:
 * - flex-col instead of inline-flex
 * - gap-1 (4px) instead of -ml-px border overlap
 * - ArrowUp/ArrowDown navigation instead of ArrowLeft/Right
 * - Data-driven items prop instead of children composition
 *
 * @see ButtonGroup for horizontal container pattern reference
 */
const calendarTabsVariants = cva('flex items-start', {
  variants: {
    orientation: {
      vertical: 'flex-col gap-1',
      horizontal: 'flex-row gap-1',
    },
    spacing: {
      compact: 'gap-0.5',
      default: 'gap-1',
      relaxed: 'gap-2',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    spacing: 'default',
  },
});

export type CalendarTabsVariants = VariantProps<typeof calendarTabsVariants>;

/**
 * Configuration for a single tab item in CalendarTabs.
 */
export interface CalendarTabItem {
  /** Unique identifier for the tab, used for selection state */
  value: string;
  /** Display text for the tab */
  label: string;
  /** Whether this specific tab is disabled */
  disabled?: boolean;
}

export interface CalendarTabsProps extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'role'
> {
  /** Array of tab items to render */
  items: CalendarTabItem[];
  /** Currently selected tab value (controlled mode) */
  value?: string;
  /** Callback fired when selection changes */
  onValueChange?: (value: string) => void;
  /** Initial selected value (uncontrolled mode) */
  defaultValue?: string;
  /** Disable all tabs in the group */
  disabled?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /** Accessible label for the tablist */
  'aria-label'?: string;
  /**
   * Layout orientation of the tabs
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
}

/**
 * CalendarTabs - Vertical container component for preset date range selection
 *
 * NOTE: This is the first vertical container in the design system.
 * Unlike ButtonGroup (horizontal), this uses:
 * - flex-col instead of inline-flex
 * - gap-1 (4px) instead of -ml-px border overlap
 * - ArrowUp/ArrowDown navigation instead of ArrowLeft/Right
 * - Data-driven items prop instead of children composition
 *
 * @see ButtonGroup for horizontal container pattern reference
 *
 * @accessibility
 * - Uses role="tablist" for the container
 * - Implements roving tabIndex for keyboard navigation
 * - ArrowUp/ArrowDown to navigate between tabs
 * - Home/End to jump to first/last enabled tab
 * - Enter/Space to select the focused tab
 * - Skips disabled tabs during navigation
 *
 * @example Basic usage
 * ```tsx
 * const items = [
 *   { value: 'today', label: 'Today' },
 *   { value: 'yesterday', label: 'Yesterday' },
 *   { value: 'last-week', label: 'Last week' },
 * ];
 *
 * <CalendarTabs
 *   items={items}
 *   onValueChange={(v) => console.log(v)}
 *   aria-label="Date range presets"
 * />
 * ```
 *
 * @example Controlled mode
 * ```tsx
 * const [value, setValue] = useState('today');
 *
 * <CalendarTabs
 *   items={items}
 *   value={value}
 *   onValueChange={setValue}
 * />
 * ```
 *
 * @example With disabled items
 * ```tsx
 * const items = [
 *   { value: 'today', label: 'Today' },
 *   { value: 'custom', label: 'Custom', disabled: true },
 * ];
 *
 * <CalendarTabs items={items} defaultValue="today" />
 * ```
 */
export const CalendarTabs = forwardRef<HTMLDivElement, CalendarTabsProps>(
  (
    {
      items,
      value: controlledValue,
      onValueChange,
      defaultValue,
      disabled = false,
      className,
      'aria-label': ariaLabel,
      orientation = 'vertical',
      ...props
    },
    ref
  ) => {
    // Warn in development if duplicate values are provided
    if (process.env.NODE_ENV !== 'production') {
      const values = items.map((item) => item.value);
      const uniqueValues = new Set(values);
      if (uniqueValues.size !== values.length) {
        console.warn(
          'CalendarTabs: Duplicate values detected in items. Each item should have a unique value.'
        );
      }
    }

    // Generate unique IDs for tabs
    const baseId = useId();

    // Refs for programmatic focus management
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = useState<string | undefined>(
      defaultValue
    );

    // Determine if we're in controlled mode
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    // Track focused index for roving tabIndex
    const [focusedIndex, setFocusedIndex] = useState<number>(() => {
      // Initialize focus to the selected item, or first enabled item
      if (currentValue) {
        const selectedIndex = items.findIndex(
          (item) => item.value === currentValue
        );
        if (selectedIndex !== -1 && !items[selectedIndex].disabled && !disabled) {
          return selectedIndex;
        }
      }
      // Find first enabled item
      return items.findIndex((item) => !item.disabled && !disabled);
    });

    // Get list of enabled tab indices
    const enabledIndices = useMemo(
      () =>
        items
          .map((item, index) => (!item.disabled && !disabled ? index : -1))
          .filter((index) => index !== -1),
      [items, disabled]
    );

    // Handle value change
    const handleValueChange = useCallback(
      (newValue: string) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange]
    );

    // Handle tab click
    const handleTabClick = useCallback(
      (item: CalendarTabItem, index: number) => {
        if (item.disabled || disabled) return;
        setFocusedIndex(index);
        handleValueChange(item.value);
      },
      [disabled, handleValueChange]
    );

    // Calculate next index for forward navigation
    const getNextIndex = useCallback(
      (currentPosition: number) => {
        if (currentPosition === -1) return enabledIndices[0];
        const nextPosition = (currentPosition + 1) % enabledIndices.length;
        return enabledIndices[nextPosition];
      },
      [enabledIndices]
    );

    // Calculate previous index for backward navigation
    const getPrevIndex = useCallback(
      (currentPosition: number) => {
        if (currentPosition === -1) {
          return enabledIndices[enabledIndices.length - 1];
        }
        const prevPosition =
          (currentPosition - 1 + enabledIndices.length) % enabledIndices.length;
        return enabledIndices[prevPosition];
      },
      [enabledIndices]
    );

    // Handle selection via Enter/Space
    const handleSelection = useCallback(() => {
      if (
        focusedIndex !== -1 &&
        items[focusedIndex] &&
        !items[focusedIndex].disabled
      ) {
        handleValueChange(items[focusedIndex].value);
      }
    }, [focusedIndex, handleValueChange, items]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (enabledIndices.length === 0) return;

        const currentPosition = enabledIndices.indexOf(focusedIndex);
        const isVertical = orientation === 'vertical';
        const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
        const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';

        const keyActions: Record<string, () => number | undefined> = {
          [nextKey]: () => getNextIndex(currentPosition),
          [prevKey]: () => getPrevIndex(currentPosition),
          Home: () => enabledIndices[0],
          End: () => enabledIndices[enabledIndices.length - 1],
        };

        // Handle selection keys
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleSelection();
          return;
        }

        // Handle navigation keys
        const action = keyActions[event.key];
        if (!action) return;

        event.preventDefault();
        const nextIndex = action();
        if (nextIndex !== undefined) {
          setFocusedIndex(nextIndex);
          tabRefs.current[nextIndex]?.focus();
        }
      },
      [
        enabledIndices,
        focusedIndex,
        getNextIndex,
        getPrevIndex,
        handleSelection,
        orientation,
      ]
    );

    // Handle focus on individual tab (for click-to-focus)
    const handleTabFocus = useCallback((index: number) => {
      setFocusedIndex(index);
    }, []);

    // Empty items - render empty tablist
    if (items.length === 0) {
      return (
        <div
          ref={ref}
          role="tablist"
          aria-orientation={orientation}
          aria-label={ariaLabel}
          className={cn(calendarTabsVariants({ orientation }), className)}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        aria-label={ariaLabel}
        className={cn(calendarTabsVariants({ orientation }), className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {items.map((item, index) => {
          const isActive = item.value === currentValue;
          const isDisabled = item.disabled || disabled;
          const isFocusable = focusedIndex === index;
          const tabId = `${baseId}-tab-${index}`;

          return (
            <CalendarTab
              key={item.value}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={tabId}
              active={isActive}
              disabled={isDisabled}
              tabIndex={isFocusable && !isDisabled ? 0 : -1}
              onClick={() => handleTabClick(item, index)}
              onFocus={() => handleTabFocus(index)}
            >
              {item.label}
            </CalendarTab>
          );
        })}
      </div>
    );
  }
);

CalendarTabs.displayName = 'CalendarTabs';

export { calendarTabsVariants };
