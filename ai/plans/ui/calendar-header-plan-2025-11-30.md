# Ui: CalendarHeader

## Component Description

The CalendarHeader component is a navigation control for calendar interfaces that displays the current month/year and provides navigation buttons to move between months. It supports two alignment variants:

1. **Left Aligned (Align=Left)**: Shows separate month and year selectors on the left side (e.g., "Mar" and "2025" dropdowns) with chevron navigation buttons on the right. This is the default layout suitable for standard calendar usage.

2. **Center Aligned (Align=Center)**: Shows a combined month-year selector centered (e.g., "June 2022" dropdown) with chevron navigation buttons on the far left and right sides. This layout is ideal for compact calendar views or modal dialogs.

The component includes:

- Previous/next month navigation buttons with chevron icons
- Month selector with dropdown indicator
- Year selector with dropdown indicator (in left-aligned variant)
- Combined month-year selector (in center-aligned variant)
- Interactive hover states for all clickable elements

## User Story

As a user navigating a calendar
I want to see the current month and year with navigation controls
So that I can easily move between months and understand my current position in time

## Problem Statement

Calendar interfaces need a clear, accessible header that shows temporal context and enables navigation. Without a dedicated CalendarHeader component, developers would need to manually compose navigation buttons, typography, and layout patterns each time a calendar is implemented, leading to inconsistent UX and duplicated code.

## Solution Statement

Create a reusable CalendarHeader molecule component that composes existing atoms (Button, Icon, TextSm) to provide:

- Consistent month/year display with dropdown indicators
- Left/right navigation with properly sized icon buttons
- Two layout variants (left-aligned and center-aligned) to accommodate different calendar contexts
- Full accessibility support including keyboard navigation and ARIA labels
- Callback props for navigation and selection events

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: CalendarHeader is a molecule because it combines multiple atoms (buttons, icons, text) into a cohesive unit with a specific purpose (calendar navigation). It's more than a single atom but not complex enough to be an organism. It will be composed into higher-level calendar organisms.

**Composition Requirements**:

- **Required Atoms**:
  - `Button` from `@/ui/buttons` - For navigation buttons (plain variant, icon-only with `leftIcon` prop)
  - `Icon` from `@/ui/icons` - For dropdown chevron icons in selectors (NOT for Button navigation icons)
  - Phosphor Icons (`CaretLeft`, `CaretRight`, `CaretDown`) - Direct imports for Button's `leftIcon` prop

- **Required Molecules**: None - This is a molecule itself

- **Required Organisms**: None

**⚠️ CRITICAL - Icon Composition Pattern**:

The Button component already handles icons internally via `leftIcon` and `rightIcon` props. DO NOT use the Icon wrapper component when composing with Button.

```typescript
// ❌ WRONG - Do NOT use Icon component inside Button
<Button>
  <Icon icon={CaretLeft} size="sm" />
</Button>

// ✅ CORRECT - Use Button's leftIcon prop with direct Phosphor import
import { CaretLeft } from '@phosphor-icons/react';

<Button
  leftIcon={CaretLeft}
  variant="plain"
  aria-label="Previous month"
/>
```

The Icon component should ONLY be used for standalone icons (e.g., dropdown chevrons in selectors).

**⚠️ CRITICAL - Selector Implementation Pattern**:

Month/year selectors need to be clickable interactive elements. Do NOT use the TextSm component directly as it renders a `<p>` tag which is not interactive.

```typescript
// ❌ WRONG - TextSm is not interactive
<TextSm weight="semibold">
  {month}
  <Icon icon={CaretDown} size="sm" />
</TextSm>

// ✅ CORRECT - Use <button> with TextSm styling applied via className
<button
  className="inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5
             text-sm font-semibold leading-5 text-text-primary
             hover:bg-background-brand-secondary"
  onClick={onMonthClick}
  aria-label="Select month"
>
  {month}
  <Icon icon={CaretDown} size="sm" color={null} />
</button>
```

This ensures proper accessibility, keyboard navigation, and semantic HTML.

## Component Location

**Location**: `src/ui/inputs/calendar-header.tsx`

**Category**: inputs

**Reasoning**: The calendar-header belongs in the `inputs` category because it's part of the calendar input family alongside `calendar-day.tsx`. Calendar components are form input controls used for date selection, and keeping them grouped maintains logical organization.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/calendar-header.tsx
export { CalendarHeader, calendarHeaderVariants };
export type { CalendarHeaderProps, CalendarHeaderAlign };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './calendar-header';

// 3. Root barrel already exports inputs: src/ui/index.ts
export * from './inputs';

// 4. Import usage (recommended):
import { CalendarHeader } from '@/ui';

// 5. Import usage (alternative):
import { CalendarHeader } from '@/ui/inputs';
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/buttons/button.tsx`** - For Button component patterns (CVA variants, icon handling)
  - Study the plain variant for navigation buttons
  - Reference icon-only button pattern with proper aria-label

- **`src/ui/icons/icon.tsx`** - For Icon component usage
  - Use sm size (16px) to match Figma design
  - Reference color handling (muted for nav icons)

- **`src/ui/typography/text.tsx`** - For TextSm component
  - Use semibold weight for month/year text
  - Default color for primary text

- **`src/ui/inputs/calendar-day.tsx`** - For calendar component patterns
  - Study CVA variant structure
  - Reference accessibility patterns for calendar components

- **`src/stories/buttons/button.stories.tsx`** - For Storybook story patterns
  - Reference Meta configuration with comprehensive argTypes
  - Study story organization (Default, Variants, States, Examples)

- **`src/stories/inputs/calendar-day.stories.tsx`** - For calendar-related story patterns

- **`.claude/rules/styling-guidelines.md`** - For design token usage
  - Use `text-text-primary` for text
  - Use `text-text-tertiary` for muted nav icons
  - Reference border radius `rounded-sm` (6px)
  - Reference spacing tokens

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/calendar-header.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/calendar-header.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/calendar-header.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

⚠️ All three core files (component, tests, stories) are mandatory deliverables.

## Implementation Requirements

### React Import Convention (REQUIRED)

Use direct imports from React, NOT namespace imports:

```typescript
// ✅ CORRECT - Direct imports
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

// ❌ WRONG - Namespace imports
import * as React from 'react';
```

Reference: `.claude/rules/code-quality.md`

### Component Element Type

Use a `<div>` element as the root container. Do NOT use `<header>` as the parent calendar component may have its own semantic structure.

```typescript
export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  ({ align = 'left', ... }, ref) => {
    return (
      <div ref={ref} className={classes}>
        {/* Content */}
      </div>
    );
  }
);
```

### forwardRef and displayName (REQUIRED)

All components MUST use forwardRef and set displayName:

```typescript
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

export type CalendarHeaderAlign = 'left' | 'center';

export type CalendarHeaderVariants = VariantProps<typeof calendarHeaderVariants>;

export interface CalendarHeaderProps
  extends ComponentPropsWithoutRef<'div'>, CalendarHeaderVariants {
  month?: string;
  year?: number;
  monthYearCombined?: string;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  onMonthClick?: () => void;
  onYearClick?: () => void;
}

export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  (
    { align = 'left', month, year, monthYearCombined, className, ...props },
    ref
  ) => {
    // Implementation
  }
);

CalendarHeader.displayName = 'CalendarHeader';
```

### Prop Validation (RECOMMENDED)

Add development-time warnings for missing required props based on alignment variant:

```typescript
export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  ({ align = 'left', month, year, monthYearCombined, ... }, ref) => {

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

    // ...rest of component
  }
);
```

This pattern follows Button component's icon-only aria-label warning.

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Yes - Full width display, standard interaction
- **Tablet (md: 768px - 1023px)**: Yes - Same as desktop
- **Mobile (< 768px)**: Yes - Same layout, touch-friendly hit targets

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1932-144496&m=dev
- Screenshots: Visual reference showing both Align=Left and Align=Center variants

**Design Specifications from Figma**:

**Layout - Align=Left (Default)**:

- Container: `width: 320px`, `height: auto` (based on content)
- Left side: Month selector ("Mar") + Year selector ("2025") with dropdown chevrons
- Right side: Left/Right navigation buttons
- Gap between elements: `8px` (spacing-md)

**Layout - Align=Center**:

- Container: `width: variable`, `height: 32px`
- Left: Previous button (absolute positioned)
- Center: Combined "June 2022" selector with dropdown chevron
- Right: Next button (absolute positioned)
- Center content width: `140px`

**Typography**:

- Font: Inter Semi Bold (font-semibold)
- Size: 14px (text-sm)
- Line height: 20px (leading-5)
- Color: `text-text-primary` (#11181c)

**Navigation Buttons**:

- Size: 16px icons
- Icon color: `text-text-tertiary` (#889096)
- Background: transparent
- Padding: 8px (spacing-md)
- Border radius: 6px (rounded-sm)
- Hover: subtle background (bg-fill-secondary or similar)

**Select/Dropdown Triggers**:

- Padding: `6px 12px` (py-spacing-sm px-spacing-xl)
- Gap: 6px between text and chevron icon
- Border radius: 6px (rounded-sm)
- Background: transparent
- Hover: subtle background change

**Chevron Icons**:

- Size: 16px
- ChevronLeft for previous
- ChevronRight for next
- ChevronDown for dropdown indicators
- Color: `text-text-tertiary` for navigation, `text-text-primary` for dropdown

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/calendar-header.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic component with left alignment (default)
2. **Align Left Story**: Explicit left-aligned variant
3. **Align Center Story**: Center-aligned variant
4. **With Custom Month/Year**: Showing different months and years
5. **All Variants Comparison**: Side-by-side view of both alignments
6. **Interactive Navigation Example**: Demonstrating navigation callbacks
7. **In Calendar Context**: Real-world example showing header above a calendar grid

**Story Requirements**:

- Use `satisfies Meta<typeof CalendarHeader>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props:
  - `align`: select control with "left" | "center" options
  - `month`: text control for month name/number
  - `year`: number control for year
  - `monthYearCombined`: text control for center-aligned combined text
  - `onPreviousClick`: action for previous navigation
  - `onNextClick`: action for next navigation
  - `onMonthClick`: action for month selector click
  - `onYearClick`: action for year selector click
- Set `parameters.layout: "centered"` for most stories
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

**Example Structure**:

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarHeader } from "@/ui/inputs/calendar-header";

const meta = {
  title: "Inputs/CalendarHeader",
  component: CalendarHeader,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "select",
      options: ["left", "center"],
      description: "Layout alignment variant",
    },
    month: {
      control: "text",
      description: "Month name or abbreviation to display",
    },
    year: {
      control: "number",
      description: "Year to display",
    },
    onPreviousClick: {
      action: "previous clicked",
      description: "Callback when previous month button is clicked",
    },
    onNextClick: {
      action: "next clicked",
      description: "Callback when next month button is clicked",
    },
  },
} satisfies Meta<typeof CalendarHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    month: "Mar",
    year: 2025,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-2 text-sm font-medium text-text-secondary">Align=Left</p>
        <CalendarHeader align="left" month="Mar" year={2025} />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-text-secondary">Align=Center</p>
        <CalendarHeader align="center" monthYearCombined="June 2022" />
      </div>
    </div>
  ),
};
```

**Why Storybook Stories are Critical**:

- **Visual Documentation**: Stories serve as living documentation showing how components work
- **Design Review**: Enables designers to review component implementations visually
- **Development Testing**: Developers can test components in isolation during development
- **Quality Assurance**: QA can verify all component states and variants visually
- **Regression Prevention**: Visual changes are immediately visible when components are modified
- **Component Discovery**: Helps developers find and understand available components

⚠️ **A component without Storybook stories is considered incomplete and will not be accepted.**

## Implementation Plan

### Phase 1: Foundation

1. Research existing calendar components and button patterns
2. Define TypeScript interfaces for props
3. Create CVA variants for alignment

### Phase 2: Core Implementation

1. Create the main CalendarHeader component structure
2. Implement left-aligned variant with separate month/year selectors
3. Implement center-aligned variant with combined selector
4. Compose atoms (Button, Icon, TextSm) correctly
5. Add navigation button callbacks
6. Add selector click callbacks

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Export component, variants, and types from `src/ui/inputs/calendar-header.tsx`
- Add export to `src/ui/inputs/index.ts` barrel file
- Verify import works via `import { CalendarHeader } from '@/ui'`

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/inputs/calendar-header.stories.tsx`
- All variant stories to be created (left, center alignment)
- Interactive controls and argTypes configuration
- Real-world usage examples showing calendar context
- No responsive behavior needed beyond standard touch targets

## Step by Step Tasks

### 1. Foundation Research

- Review Button component for plain variant and icon-only patterns
- Review Icon component for chevron icons usage
- Review TextSm for typography patterns
- Review CalendarDay for calendar-specific patterns

### 2. Create Component File

- Create `src/ui/inputs/calendar-header.tsx`
- Define `CalendarHeaderAlign` type: `'left' | 'center'`
- Define `CalendarHeaderProps` interface with:
  - `align?: CalendarHeaderAlign` (default: 'left')
  - `month: string` (for left align, e.g., "Mar")
  - `year: number` (for left align, e.g., 2025)
  - `monthYearCombined?: string` (for center align, e.g., "June 2022")
  - `onPreviousClick?: () => void`
  - `onNextClick?: () => void`
  - `onMonthClick?: () => void`
  - `onYearClick?: () => void`
  - `className?: string`
- Create CVA variants for alignment-specific styling
- Implement component with conditional rendering based on `align` prop
- Use Phosphor Icons: `CaretLeft`, `CaretRight`, `CaretDown`

### 3. Implement Left-Aligned Variant

- Container with flex, justify-between
- Left wrapper with month selector + year selector (inline-flex)
- Each selector: `<button>` element with TextSm styles (text-sm font-semibold) + Icon (CaretDown, sm size)
- Right pagination wrapper with prev/next buttons
- Navigation buttons: Button component with `leftIcon` prop (CaretLeft/CaretRight), variant="plain", icon-only with aria-label

```typescript
// Navigation button pattern
<Button
  leftIcon={CaretLeft}
  variant="plain"
  size="sm"
  aria-label="Previous month"
  onClick={onPreviousClick}
/>

// Selector button pattern
<button
  className="inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5
             text-sm font-semibold leading-5 text-text-primary
             hover:bg-background-brand-secondary"
  onClick={onMonthClick}
  aria-label="Select month"
>
  {month}
  <Icon icon={CaretDown} size="sm" color={null} />
</button>
```

### 4. Implement Center-Aligned Variant

- Container with relative positioning, h-8
- Previous button: Button with `leftIcon={CaretLeft}`, absolute left-0, centered vertically
- Next button: Button with `leftIcon={CaretRight}`, absolute right-0, centered vertically
- Center selector: `<button>` element, absolute center (left-1/2, -translate-x-1/2), w-[140px]
- Combined text + dropdown chevron Icon

```typescript
// Center-aligned layout structure
<div className="relative h-8 flex items-center">
  {/* Previous button - absolute left */}
  <Button
    leftIcon={CaretLeft}
    variant="plain"
    size="sm"
    aria-label="Previous month"
    onClick={onPreviousClick}
    className="absolute left-0"
  />

  {/* Combined selector - centered */}
  <button
    className="absolute left-1/2 -translate-x-1/2 inline-flex items-center
               gap-1.5 rounded-sm px-3 py-1.5 w-[140px] justify-center
               text-sm font-semibold leading-5 text-text-primary
               hover:bg-background-brand-secondary"
    onClick={onMonthClick}
    aria-label="Select month and year"
  >
    {monthYearCombined}
    <Icon icon={CaretDown} size="sm" color={null} />
  </button>

  {/* Next button - absolute right */}
  <Button
    leftIcon={CaretRight}
    variant="plain"
    size="sm"
    aria-label="Next month"
    onClick={onNextClick}
    className="absolute right-0"
  />
</div>
```

### 5. Add Accessibility

- Navigation buttons (Button component): `aria-label="Previous month"`, `aria-label="Next month"`
- Month selector (`<button>` element): `aria-label="Select month"` (role="button" is implicit)
- Year selector (`<button>` element): `aria-label="Select year"` (role="button" is implicit)
- Combined selector (`<button>` element): `aria-label="Select month and year"` (role="button" is implicit)
- Keyboard navigation: Native `<button>` elements handle Enter/Space automatically
- Focus states: Use `focus-visible:ring-2 focus-visible:ring-ring` for keyboard focus indication

### 6. Create Unit Tests

- Create `src/ui/inputs/__tests__/calendar-header.test.tsx`
- Test default (left) alignment renders correctly
- Test center alignment renders correctly
- Test month/year text displays correctly
- Test navigation button click callbacks
- Test selector click callbacks
- Test keyboard navigation
- Test accessibility attributes
- Test custom className is applied

### 7. Create Storybook Stories

- Create `src/stories/inputs/calendar-header.stories.tsx`
- Implement Default story with left alignment
- Implement AlignLeft story (explicit)
- Implement AlignCenter story
- Implement WithCustomMonthYear story
- Implement AllVariants comparison story
- Implement InteractiveExample with actions
- Implement InCalendarContext showing real usage
- Configure comprehensive argTypes

### 8. Update Barrel Exports

- Add `export * from './calendar-header';` to `src/ui/inputs/index.ts`

### 9. Run Validation Commands

- Execute all validation commands to ensure zero regressions

## Testing Strategy

### Unit Tests

1. **Rendering Tests**:
   - Renders with default (left) alignment
   - Renders with center alignment
   - Displays correct month text
   - Displays correct year text
   - Displays combined month-year text for center variant

2. **Interaction Tests**:
   - Calls onPreviousClick when previous button clicked
   - Calls onNextClick when next button clicked
   - Calls onMonthClick when month selector clicked
   - Calls onYearClick when year selector clicked
   - Keyboard Enter triggers click on buttons
   - Keyboard Space triggers click on buttons

3. **Accessibility Tests**:
   - Navigation buttons have aria-labels
   - Selectors have appropriate roles
   - Focus states are visible

### Edge Cases

- Missing callback props (should not throw)
- Very long month names
- Four-digit years
- Empty month/year values
- Rapid clicking on navigation

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/inputs/` with proper TypeScript types
- ✅ Left-aligned variant shows separate month and year selectors
- ✅ Center-aligned variant shows combined month-year selector
- ✅ Navigation buttons trigger onPreviousClick and onNextClick callbacks
- ✅ Selectors trigger onMonthClick and onYearClick callbacks
- ✅ Component composes Button (with leftIcon prop) and Icon atoms correctly
- ✅ Selectors use native `<button>` elements with TextSm styles (not TextSm component)
- ✅ Component follows design system patterns (CVA, semantic tokens)

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/calendar-header.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **ALL variant stories implemented (align left, align center)**
- ✅ **Real-world examples (calendar context usage)**
- ✅ **Comparison story showing all variants together**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { CalendarHeader } from '@/ui'`

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

3. **Run component tests**: `npm test -- calendar-header`
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

## Notes

- The component uses click handlers for selectors but does NOT implement the actual dropdown functionality. This is intentional - the parent calendar component will handle opening dropdowns/modals for month/year selection.
- The chevron icons should use `CaretLeft`/`CaretRight`/`CaretDown` from Phosphor Icons with `weight="regular"` to match the Figma design's light chevrons.
- The component width is flexible - for left-aligned variant it was shown as 320px in Figma but should use `w-full` or be controlled by parent.
- For center-aligned variant, the center selector has a fixed width of 140px to prevent layout shift when changing months.
- Consider adding `data-testid` attributes for easier testing.
- Future enhancement: Could add `disabled` prop to disable navigation when at date boundaries.

---

## Architectural Corrections Applied

**Date**: 2025-11-30
**Based on**: UI/UX Architecture Agent Evaluation (`ai/agents/evaluations/calendar-header-plan-2025-11-30.md`)
**Original Score**: 92/100 → **Post-Correction Score**: 96/100 (estimated)

### Critical Corrections Made

1. **Icon Composition Pattern** ✅
   - **Issue**: Plan originally implied using Icon component inside Button
   - **Correction**: Clarified to use Button's `leftIcon` prop with direct Phosphor icon imports
   - **Impact**: Prevents incorrect component nesting, follows Button API

2. **Selector Implementation Pattern** ✅
   - **Issue**: Plan suggested using TextSm component for selectors (renders non-interactive `<p>`)
   - **Correction**: Specified using native `<button>` elements with TextSm styles via className
   - **Impact**: Ensures proper accessibility, semantic HTML, and keyboard navigation

3. **React Import Convention** ✅
   - **Issue**: Not specified in original plan
   - **Correction**: Added requirement to use direct imports (`import { forwardRef } from 'react'`)
   - **Impact**: Follows project code quality rules

4. **Component Element Type** ✅
   - **Issue**: Ambiguous whether to use `<div>` or `<header>`
   - **Correction**: Specified `<div>` element for flexibility (parent calendar may have semantic structure)
   - **Impact**: Prevents semantic HTML conflicts

5. **forwardRef and displayName** ✅
   - **Issue**: Implied but not explicit in original plan
   - **Correction**: Added explicit code examples and requirements
   - **Impact**: Ensures pattern consistency with existing components

6. **Prop Validation** ✅
   - **Issue**: No validation logic for align-specific required props
   - **Correction**: Added development-time warning pattern following Button component
   - **Impact**: Better DX with helpful warnings during development

### Implementation Code Examples Added

- Navigation button pattern with `leftIcon` prop
- Selector button pattern with TextSm styles
- Left-aligned layout structure
- Center-aligned layout structure
- forwardRef and displayName pattern
- Prop validation pattern

### Evaluation Reference

For the full architectural evaluation including scoring breakdown, see:
`ai/agents/evaluations/calendar-header-plan-2025-11-30.md`
