# Ui: CalendarTabs

## Component Description

CalendarTabs is a container component that groups multiple `CalendarTab` components into a cohesive vertical list for quick date range selection. It provides preset time period options (Today, Yesterday, Last week, Last month, Last year, All time) commonly used in date pickers, analytics dashboards, and reporting interfaces.

The component automatically manages:

- **Vertical layout**: Stacks CalendarTab items with consistent 4px gap
- **Selection state**: Tracks which preset is currently active
- **Keyboard navigation**: Arrow key navigation between tabs
- **ARIA attributes**: Proper tablist/tab semantics for accessibility

## Architectural Context: First Vertical Container Component

> **IMPORTANT**: CalendarTabs is the **first vertical container component** in the design system. This establishes precedent for future vertical layouts.

### Vertical vs Horizontal Container Differences

| Aspect            | ButtonGroup (Horizontal)          | CalendarTabs (Vertical)        |
| ----------------- | --------------------------------- | ------------------------------ |
| Layout            | `inline-flex`                     | `flex flex-col`                |
| Spacing           | `-ml-px` (border overlap)         | `gap-1` (4px gap)              |
| Keyboard Nav      | ArrowLeft/ArrowRight              | ArrowUp/ArrowDown              |
| Position Variants | `first`, `middle`, `last`, `only` | Not needed (no border overlap) |

### Design System Implications

1. **New Pattern**: This component introduces the vertical container pattern to the design system
2. **Future Reference**: Future vertical containers should follow this implementation as reference
3. **Not ButtonGroup Extension**: While inspired by ButtonGroup, this is a separate pattern due to fundamental layout differences

### JSDoc Documentation Required

```typescript
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
 */
```

## User Story

As a user interacting with a date picker or analytics dashboard
I want to quickly select common date ranges from a preset list
So that I can filter data without manually selecting start/end dates

## Problem Statement

Users often need to filter data by common time periods (today, yesterday, last week, etc.). Manually selecting date ranges is time-consuming and error-prone. A preset list of common date ranges provides a faster, more intuitive way to filter data while maintaining consistency across the application.

## Solution Statement

Create a CalendarTabs container component that renders a vertical stack of CalendarTab items with preset date range options. The component will manage selection state, keyboard navigation, and accessibility attributes, providing a cohesive and accessible date range selection interface.

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: CalendarTabs is a molecule because it composes multiple CalendarTab atoms into a functional unit. It takes individual tab atoms and arranges them in a specific layout with managed state, creating a more complex interactive element. It's not an organism because it doesn't compose other molecules - it only uses CalendarTab atoms.

**Architectural Clarification**: Unlike the manual composition pattern shown in existing CalendarTab stories (where developers create tab groups with wrapper divs), CalendarTabs provides a structured, opinionated container that reduces boilerplate. This is an architectural improvement that encapsulates layout, state management, and accessibility concerns.

**Composition Requirements**:

- **Required Atoms**:
  - `CalendarTab` from `@/ui/inputs/calendar-tab` - Individual tab items for each date preset (internally rendered)

**Composition Pattern**: CalendarTabs uses a **data-driven composition** approach where items are passed as a configuration array, and the component internally renders CalendarTab atoms. This differs from ButtonGroup's children composition pattern but is architecturally superior for preset selection UIs.

**Composition Strategy Decision**:

| Approach                 | Pros                                                  | Cons                                     | Best For               |
| ------------------------ | ----------------------------------------------------- | ---------------------------------------- | ---------------------- |
| **Data-Driven (Chosen)** | Type-safe, less boilerplate, easier preset management | Less flexible for custom content         | Fixed sets of options  |
| Children Composition     | Maximum flexibility, familiar React pattern           | More boilerplate, type safety challenges | Dynamic/custom content |

**Rationale**: Since CalendarTabs explicitly handles "preset time period options" with 6 fixed presets (Today, Yesterday, Last week, Last month, Last year, All time), the data-driven approach is architecturally superior.

## Component Location

**Location**: `src/ui/inputs/calendar-tabs.tsx`

**Category**: `inputs` - This component is part of the inputs category alongside CalendarTab, CalendarHeader, CalendarDay, and other date/time input-related components.

**Reasoning**: The component belongs in the inputs category because:

1. It's used for date/time selection (user input)
2. It complements existing calendar components (CalendarTab, CalendarDay, CalendarHeader)
3. It follows the existing pattern where container components live alongside their item components

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/calendar-tabs.tsx
export { CalendarTabs, calendarTabsVariants };
export type { CalendarTabsProps, CalendarTabItem };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './calendar-tabs';

// 3. Import usage (recommended):
import { CalendarTabs, type CalendarTabItem } from '@/ui';

// 4. Import usage (alternative):
import { CalendarTabs, type CalendarTabItem } from '@/ui/inputs';

// 5. Example usage:
const items: CalendarTabItem[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
];
<CalendarTabs items={items} onValueChange={(v) => console.log(v)} />
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/inputs/calendar-tab.tsx`** - The CalendarTab atom component to compose
  - Study the CalendarTabProps interface
  - Understand the active prop for selection state
  - Review accessibility attributes (role="tab", aria-selected)

- **`src/ui/buttons/button-group.tsx`** - Reference for container component patterns
  - Study how ButtonGroup manages children
  - Understand props cascading patterns
  - Review ARIA role handling for groups

- **`src/stories/inputs/calendar-tab.stories.tsx`** - Existing stories showing CalendarTab in context
  - Lines 161-188: InCalendarContext example shows tab group pattern
  - Lines 421-441: Shows vertical tab list container styling

- **`src/stories/buttons/button-group.stories.tsx`** - Reference for container component stories
  - Study story structure for container components
  - Reference interactive demo patterns

- **`src/ui/inputs/__tests__/calendar-tab.test.tsx`** - Testing patterns for calendar components
  - Review accessibility testing patterns
  - Study keyboard interaction tests

- **`src/lib/utils.ts`** - cn utility for class merging
  - Use for className composition

- **Figma Design Reference**: `https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=48622-5342&m=dev`
  - Shows vertical list of 6 preset tabs
  - 4px gap between items
  - Content width (hug behavior)

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/calendar-tabs.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/calendar-tabs.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/calendar-tabs.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required - Component displays at natural content width
- **Tablet (md: 768px - 1023px)**: No specific styling - Same as desktop
- **Mobile (< 768px)**: No specific styling - Same as desktop (component is naturally responsive due to content-based width)

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: `https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=48622-5342&m=dev`
- Screenshot: Shows vertical stack of 6 tabs (Today, Yesterday, Last week, Last month, Last year, All time)

**Design Specifications from Figma**:

```
Container (_Calendar Tabs):
- Layout: Flex column
- Gap: 4px (gap-1)
- Alignment: items-start (left-aligned)
- Width: Content (hug)

Individual CalendarTab items:
- Height: 32px (h-8)
- Padding: 8px horizontal, 6px vertical (px-2 py-1.5)
- Border radius: 6px (rounded-sm)
- Typography: Inter Medium 14px/20px (text-sm leading-5 font-medium)
- Text color: #889096 (text-text-tertiary)
```

**Interaction Patterns**:

- Single selection: Only one tab can be active at a time
- Click to select: Clicking a tab makes it active
- Keyboard navigation: Arrow keys to navigate, Enter/Space to select
- Focus visible: Ring style on focus

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/calendar-tabs.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic CalendarTabs with preset options, no selection
2. **With Selection**: CalendarTabs with a pre-selected value
3. **Custom Items**: CalendarTabs with custom tab labels (not date presets)
4. **Controlled State**: Interactive story with state management showing selection changes
5. **Disabled Items**: CalendarTabs with some disabled options
6. **All Disabled**: Entire component disabled
7. **Real-world Example: Date Range Picker**: CalendarTabs integrated with date display showing selected range
8. **Real-world Example: Analytics Filter**: CalendarTabs in context of an analytics dashboard
9. **Accessibility Demo**: Focus and keyboard navigation demonstration
10. **Complete Matrix**: All state combinations for visual regression testing

**Story Requirements**:

- Use `satisfies Meta<typeof CalendarTabs>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` for all props (value, onValueChange, items, disabled, orientation)
- Set `parameters.layout: "centered"` for most stories
- Create interactive controls for configurable props
- Include JSDoc-style comments explaining each story's purpose

**Example Structure**:

```typescript
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CalendarTabs, type CalendarTabItem } from '@/ui/inputs';

/** Default preset items for date range selection */
const defaultPresetItems: CalendarTabItem[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last-week', label: 'Last week' },
  { value: 'last-month', label: 'Last month' },
  { value: 'last-year', label: 'Last year' },
  { value: 'all-time', label: 'All time' },
];

const meta = {
  title: 'Inputs/CalendarTabs',
  component: CalendarTabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of tab items to render',
      control: 'object',
    },
    value: {
      control: 'select',
      options: [
        undefined,
        'today',
        'yesterday',
        'last-week',
        'last-month',
        'last-year',
        'all-time',
      ],
      description: 'Currently selected tab value (controlled mode)',
    },
    defaultValue: {
      control: 'select',
      options: [
        undefined,
        'today',
        'yesterday',
        'last-week',
        'last-month',
        'last-year',
        'all-time',
      ],
      description: 'Initial selected value (uncontrolled mode)',
    },
    onValueChange: {
      description: 'Callback fired when selection changes',
      action: 'valueChanged',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all tabs',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the tablist',
    },
  },
  args: {
    items: defaultPresetItems,
  },
} satisfies Meta<typeof CalendarTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithSelection: Story = {
  args: {
    value: 'today',
  },
};

export const CustomItems: Story = {
  args: {
    items: [
      { value: 'q1', label: 'Q1 2024' },
      { value: 'q2', label: 'Q2 2024' },
      { value: 'q3', label: 'Q3 2024' },
      { value: 'q4', label: 'Q4 2024' },
    ],
    defaultValue: 'q1',
  },
};
```

## Implementation Plan

### Phase 1: Foundation

1. **Research existing patterns**: Review ButtonGroup implementation for container component patterns
2. **Define TypeScript interfaces**: Create CalendarTabsProps, CalendarTabItem interfaces with proper typing
3. **Create CVA variants**: Define container layout variants for future extensibility

**CVA Variants Specification**:

```typescript
const calendarTabsVariants = cva(
  'flex items-start', // Base styles
  {
    variants: {
      orientation: {
        vertical: 'flex-col gap-1',
        horizontal: 'flex-row gap-1', // Future support
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
  }
);
```

**v1 Implementation**: Only `orientation: 'vertical'` and `spacing: 'default'` will be implemented. Other variants are defined for future extensibility but not exposed in the public API until needed.

### Phase 2: Core Implementation

1. **Create CalendarTabs component**:
   - Implement container with flex column layout
   - Add 4px gap between items
   - Handle value/onValueChange controlled pattern
   - Pass active state to CalendarTab children
   - Forward ref to container element

2. **Add accessibility**:
   - Set role="tablist" on container
   - Add aria-orientation="vertical"
   - Add aria-label support
   - Implement keyboard navigation (ArrowUp/ArrowDown)

3. **Handle edge cases**:
   - Empty children
   - Single child
   - All disabled
   - Controlled vs uncontrolled modes

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Export CalendarTabs and calendarTabsVariants from component file
- Export types: CalendarTabsProps
- Add to src/ui/inputs/index.ts barrel export
- Verify import works via `import { CalendarTabs } from '@/ui'`

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/inputs/calendar-tabs.stories.tsx`
- All variant stories: Default, WithSelection, CustomItems, Disabled states
- Interactive controls: value, onValueChange, disabled, aria-label
- Real-world usage examples: Date range picker, Analytics filter
- Accessibility demonstration showing keyboard navigation

## Step by Step Tasks

### Task 1: Create Component Foundation

- [ ] Create `src/ui/inputs/calendar-tabs.tsx` file
- [ ] Define CalendarTabItem type:
  ```typescript
  /**
   * Configuration for a single tab item in CalendarTabs.
   */
  interface CalendarTabItem {
    /** Unique identifier for the tab, used for selection state */
    value: string;
    /** Display text for the tab */
    label: string;
    /** Whether this specific tab is disabled */
    disabled?: boolean;
  }
  ```
- [ ] Define CalendarTabsProps interface (data-driven approach):
  ```typescript
  interface CalendarTabsProps {
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
  }
  ```
- [ ] Implement base CalendarTabs component with forwardRef
- [ ] Add flex column layout with gap-1 (4px)
- [ ] Add role="tablist" and aria-orientation="vertical"
- [ ] Internally render CalendarTab components from items array

### Task 2: Implement Selection Logic

- [ ] Add controlled/uncontrolled value state handling using internal state hook
- [ ] Map over items array to render CalendarTab components with active prop
- [ ] Pass onClick handler to each CalendarTab for selection
- [ ] Handle disabled state: combine global disabled with item-level disabled
- [ ] Compute active state: `item.value === currentValue`

### Task 3: Add Keyboard Navigation with Roving TabIndex

**Focus Management Strategy**: Implement **roving tabIndex** pattern (WAI-ARIA best practice)

- [ ] Track focused index with `useState` (separate from selected value)
- [ ] Only the focused tab has `tabIndex={0}`, all others have `tabIndex={-1}`
- [ ] Implement useCallback for keyboard handler:

  ```typescript
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const enabledIndices = items
        .map((item, i) => (!item.disabled && !disabled ? i : -1))
        .filter((i) => i !== -1);

      switch (event.key) {
        case 'ArrowDown':
          // Move to next enabled tab (wrap around)
          break;
        case 'ArrowUp':
          // Move to previous enabled tab (wrap around)
          break;
        case 'Home':
          // Move to first enabled tab
          break;
        case 'End':
          // Move to last enabled tab
          break;
        case 'Enter':
        case ' ':
          // Select currently focused tab
          event.preventDefault();
          break;
      }
    },
    [items, disabled, focusedIndex]
  );
  ```

- [ ] Update tabIndex on each CalendarTab based on focusedIndex
- [ ] Move focus programmatically when arrow keys pressed
- [ ] Skip disabled tabs in navigation
- [ ] Wrap navigation at boundaries (ArrowDown on last goes to first)

### Task 4: Create Unit Tests

- [ ] Create `src/ui/inputs/__tests__/calendar-tabs.test.tsx`
- [ ] Test rendering with items array
- [ ] Test CalendarTab components rendered for each item
- [ ] Test labels rendered from items configuration
- [ ] Test selection state (controlled with value prop)
- [ ] Test selection state (uncontrolled with defaultValue prop)
- [ ] Test onValueChange callback with correct value
- [ ] Test global disabled state
- [ ] Test item-level disabled state
- [ ] Test roving tabIndex (only focused has tabIndex=0)
- [ ] Test keyboard navigation (ArrowUp, ArrowDown)
- [ ] Test keyboard navigation (Home, End)
- [ ] Test keyboard selection (Enter, Space)
- [ ] Test disabled tabs skipped in navigation
- [ ] Test navigation wrap-around
- [ ] Test accessibility attributes (role, aria-orientation, aria-label)
- [ ] Test ref forwarding
- [ ] Test className merging
- [ ] Test edge cases (empty items, single item, all disabled)

### Task 5: Create Storybook Stories

- [ ] Create `src/stories/inputs/calendar-tabs.stories.tsx`
- [ ] Configure meta with argTypes for all props
- [ ] Create Default story
- [ ] Create WithSelection story
- [ ] Create CustomItems story with non-date labels
- [ ] Create ControlledState interactive story with useState
- [ ] Create DisabledItems story showing partial disabled
- [ ] Create AllDisabled story
- [ ] Create RealWorldDatePicker story
- [ ] Create RealWorldAnalyticsFilter story
- [ ] Create AccessibilityDemo story with instructions
- [ ] Create CompleteMatrix story for visual regression

### Task 6: Update Exports

- [ ] Add export to `src/ui/inputs/index.ts`:
  ```typescript
  export * from './calendar-tabs';
  ```
- [ ] Verify import works: `import { CalendarTabs } from '@/ui'`

### Task 7: Run Validation Commands

- [ ] Execute `npm run type-check` - verify zero TypeScript errors
- [ ] Execute `npm run lint` - verify zero ESLint errors
- [ ] Execute `npm test -- calendar-tabs` - verify all tests pass
- [ ] Execute `npm run test:run` - verify no regressions
- [ ] Execute `npm run build` - verify build succeeds
- [ ] Execute `npm run build-storybook` - verify stories compile

## Testing Strategy

### Unit Tests

1. **Rendering Tests**
   - Renders container with role="tablist"
   - Renders CalendarTab for each item in items array
   - Renders correct labels from items configuration
   - Applies className to container
   - Forwards ref to container element

2. **Selection State Tests**
   - Controlled mode: value prop sets active tab
   - Uncontrolled mode: defaultValue sets initial active tab
   - Clicking tab triggers onValueChange with correct value
   - Active tab receives active=true prop
   - Only one tab can be active at a time

3. **Disabled State Tests**
   - Global disabled prop disables all tabs
   - Item-level disabled disables specific tabs
   - Disabled tabs don't trigger onValueChange
   - Disabled tabs skipped in keyboard navigation
   - Combination: global disabled + item disabled

4. **Keyboard Navigation Tests (Roving TabIndex)**
   - Only focused tab has tabIndex={0}
   - Non-focused tabs have tabIndex={-1}
   - ArrowDown moves focus to next enabled tab
   - ArrowUp moves focus to previous enabled tab
   - Home moves focus to first enabled tab
   - End moves focus to last enabled tab
   - Enter/Space selects currently focused tab
   - Navigation wraps around at boundaries
   - Disabled tabs are skipped during navigation

5. **Accessibility Tests**
   - Has role="tablist"
   - Has aria-orientation="vertical"
   - Accepts and applies aria-label prop
   - Each CalendarTab has role="tab" and aria-selected

### Edge Cases

- Empty items array (renders empty tablist)
- Single item (no navigation needed)
- All items disabled (no selection possible, no keyboard nav)
- Mixed disabled/enabled items
- Rapid selection changes (no race conditions)
- Long text content in labels
- Items with duplicate values (should warn in dev)
- Value that doesn't match any item (no selection)

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/inputs/calendar-tabs.tsx` with proper TypeScript types
- ✅ Accepts `items: CalendarTabItem[]` prop for data-driven rendering
- ✅ Renders vertical stack of CalendarTab items with 4px gap (gap-1)
- ✅ Supports controlled (value/onValueChange) and uncontrolled (defaultValue) modes
- ✅ Correctly sets active state on CalendarTab based on current value
- ✅ Supports global disabled state and item-level disabled
- ✅ Implements roving tabIndex for keyboard navigation
- ✅ Forwards refs correctly to container element
- ✅ Merges custom className with default styles
- ✅ Exports CalendarTabItem type for consumer use

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/calendar-tabs.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **WithSelection story implemented**
- ✅ **CustomItems story implemented**
- ✅ **Controlled/Interactive story with state management**
- ✅ **DisabledItems and AllDisabled stories implemented**
- ✅ **Real-world examples (minimum 2)**
- ✅ **AccessibilityDemo story with keyboard navigation instructions**
- ✅ **CompleteMatrix story showing all state combinations**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { CalendarTabs } from '@/ui'`

### Code Quality

- ✅ Zero TypeScript errors: `npm run type-check`
- ✅ Zero ESLint warnings: `npm run lint`
- ✅ Build succeeds: `npm run build`

## Validation Commands

⚠️ **CRITICAL**: Execute EVERY command below. All must pass with zero errors.

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- calendar-tabs`
   - Expected: All component tests pass with >90% coverage
   - Validates: Component functionality and edge cases

4. **Run full test suite**: `npm run test:run`
   - Expected: All tests pass with zero regressions
   - Validates: No breaking changes to existing components

5. **Build verification**: `npm run build`
   - Expected: Build completes successfully
   - Validates: Production bundle compatibility

6. **Storybook build** (REQUIRED): `npm run build-storybook`
   - Expected: Storybook builds successfully, all stories compile
   - Validates: Visual documentation is complete and error-free
   - Verify: Stories appear in build output with correct paths

**All 6 commands MUST pass before the component is considered complete.**

## Component Relationships

### Calendar System Hierarchy

```
DatePicker (future organism)
├── CalendarTabs (molecule) - Preset selection
├── CalendarHeader (molecule) - Month/year navigation
└── CalendarDay[] (atoms) - Individual dates
```

### Integration Points

1. **CalendarTabs → CalendarHeader**:
   - When a preset is selected, CalendarHeader can update to show the corresponding date range
   - One-way data flow via parent state management
   - No direct coupling between components

2. **CalendarTabs as Standalone**:
   - Can be used independently for quick date range filtering
   - Common use cases: analytics dashboards, reporting interfaces, data export filters
   - Does not require CalendarHeader or other calendar components

3. **Future DatePicker Organism**:
   - Will compose CalendarTabs, CalendarHeader, and CalendarDay components
   - CalendarTabs provides quick preset selection
   - CalendarHeader + CalendarDay provide custom date selection
   - Parent organism manages coordination between sub-components

### Data Flow Pattern

```
┌─────────────────────────────────────────────────┐
│              Parent Component                    │
│  ┌─────────────────────────────────────────┐    │
│  │ selectedRange: { start: Date, end: Date }│    │
│  └─────────────────────────────────────────┘    │
│         │                        │              │
│         ▼                        ▼              │
│  ┌─────────────┐         ┌─────────────────┐   │
│  │ CalendarTabs │         │ CalendarHeader  │   │
│  │ onValueChange│         │ onDateChange    │   │
│  └─────────────┘         └─────────────────┘   │
└─────────────────────────────────────────────────┘
```

## State Management Decision

**Decision**: CalendarTabs manages selection state internally (controlled/uncontrolled pattern)

**Rationale**:

1. Calendar tabs are always single-selection (unlike button groups which can have multiple selected)
2. Matches native form control patterns (`<select>`, `<input type="radio">`)
3. Prevents invalid UI states (multiple presets selected simultaneously)
4. Simpler API for the 95% use case

**Trade-off Accepted**:

- Diverges from ButtonGroup (structural only) pattern
- CalendarTabs is more opinionated about behavior
- This is intentional: preset selection inherently requires single-choice state logic

**Alternative Considered and Rejected**:
Manual selection management (like ButtonGroup) was rejected because calendar preset selection is inherently single-choice and benefits from encapsulated state logic. Exposing selection management to consumers would add unnecessary boilerplate without providing meaningful flexibility.

## Notes

### Default Preset Items

The component accepts any items configuration. The standard date preset pattern is:

```typescript
const defaultDatePresets: CalendarTabItem[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last-week', label: 'Last week' },
  { value: 'last-month', label: 'Last month' },
  { value: 'last-year', label: 'Last year' },
  { value: 'all-time', label: 'All time' },
];
```

Consider exporting this as a helper constant for common use cases.

### Future Considerations

1. **Horizontal orientation**: The current design is vertical, but a horizontal variant could be added in the future using the CVA orientation variant (already defined, not exposed in v1).

2. **Date calculation utility**: A future utility could map preset values to actual date ranges:

   ```typescript
   const getDateRange = (preset: string): { start: Date; end: Date } => { ... }
   ```

3. **Integration with CalendarHeader**: See "Component Relationships" section for architectural guidance.

4. **Presets constant export**: Consider exporting `DEFAULT_DATE_PRESETS` for common use case.

### Keyboard Navigation Notes

Based on WAI-ARIA practices for vertical tablists:

- **ArrowUp/ArrowDown**: Navigate between tabs (with wrap-around)
- **Home/End**: Jump to first/last enabled tab
- **Tab**: Exit the tablist entirely
- **Enter/Space**: Select the currently focused tab
- **Roving tabIndex**: Only focused tab has tabIndex=0
