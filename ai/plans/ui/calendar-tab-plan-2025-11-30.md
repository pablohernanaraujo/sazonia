# Ui: CalendarTab

## Component Description

The CalendarTab component is a navigation/selection element designed specifically for calendar interfaces. It serves as a tab-style control for switching between different views or time periods within calendar widgets, such as toggling between day/week/month views or selecting year/month modes. Based on the Figma design, it displays text content with multiple interactive states including Default, Hover, Focus, Active, Active + Focus, and Pressed states.

## User Story

As a user of the calendar component
I want to have clearly visible and interactive tabs to switch between calendar views or select time periods
So that I can easily navigate through different calendar perspectives with clear visual feedback

## Problem Statement

Calendar interfaces often require navigation controls to switch between views (day, week, month, year) or to select specific time periods. These controls need consistent styling, clear state feedback, and seamless integration with the broader calendar component system.

## Solution Statement

Create a CalendarTab atom component that implements all six states from the Figma design (Default, Hover, Focus, Active, Active + Focus, Pressed) with proper CVA variants, accessibility support, and composition capabilities. The component will use the existing design system tokens and follow established patterns in the codebase.

## Atomic Design Classification

**Component Type**: Atom

**Reasoning**: CalendarTab is a simple, single-purpose UI element that displays text and handles interactive states. It follows the same pattern as CalendarDay and ButtonGroupItem - button-like elements that use inline typography classes in CVA base styles rather than composing other atoms. The component cannot be broken down further and serves as a building block for larger calendar molecules and organisms.

**Composition Requirements**:

- **None** - Uses inline typography classes in CVA base styles
- Pattern follows ButtonGroupItem and CalendarDay approaches where typography is defined directly in the CVA configuration

- **Status**: This is a base atom with self-contained styling. Typography is handled through Tailwind classes in the CVA definition, not through composition of TextSm.

## Component Location

**Location**: `src/ui/inputs/calendar-tab.tsx`

**Category**: `inputs`

**Reasoning**: Calendar-related components (CalendarDay, CalendarHeader) are located in the `inputs` category. CalendarTab follows the same pattern as it is part of the calendar component family and is used for input/selection purposes within calendar widgets.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/calendar-tab.tsx
export { CalendarTab, calendarTabVariants };
export type { CalendarTabProps };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './calendar-tab';

// 3. Root barrel already exports inputs: src/ui/index.ts
export * from './inputs';

// 4. Import usage (recommended):
import { CalendarTab } from '@/ui';

// 5. Import usage (alternative):
import { CalendarTab } from '@/ui/inputs';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/buttons/button-group-item.tsx`** - For similar interactive element patterns (PRIMARY REFERENCE)
  - Study state handling patterns (selected, hover, focus, pressed)
  - Reference CVA compound variants for state combinations

- **`src/ui/inputs/calendar-day.tsx`** - For calendar-specific component patterns
  - Study the dayType and state variant approach
  - Reference accessibility patterns for calendar elements

- **`src/stories/buttons/button.stories.tsx`** - For comprehensive story structure
  - Study argTypes configuration for interactive controls
  - Reference story organization (Default, AllVariants, States, Examples)

- **`src/stories/inputs/calendar-day.stories.tsx`** - For calendar-specific story patterns
  - Study how calendar components document states
  - Reference real-world example implementations

- **`.claude/rules/styling-guidelines.md`** - For design tokens and styling conventions
  - Reference semantic color tokens
  - Study state-based color progression patterns

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/calendar-tab.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/calendar-tab.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/calendar-tab.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required - Standard tab styling
- **Tablet (md: 768px - 1023px)**: Yes - Same styling
- **Mobile (< 768px)**: Yes - Same styling (fixed height component)

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=48616-24972&m=dev

**Design Specifications from Figma**:

| Property       | Value                        |
| -------------- | ---------------------------- |
| Height         | 32px                         |
| Padding        | 8px horizontal, 6px vertical |
| Gap            | 6px                          |
| Border Radius  | 6px (rounded-sm)             |
| Typography     | Inter Medium, 14px/20px      |
| Letter Spacing | 0px                          |

**State Colors (from Figma)**:

| State          | Background                     | Text Color                     |
| -------------- | ------------------------------ | ------------------------------ |
| Default        | transparent                    | text-tertiary (#889096)        |
| Hover          | transparent                    | text-tertiary_hover (#7d868c)  |
| Focus          | bg-surface-base-primary (#fff) | text-tertiary (#889096) + ring |
| Pressed        | bg-surface-base-primary (#fff) | text-tertiary_active (#697177) |
| Active         | bg-surface-base-primary (#fff) | text-brand (#3c61dd)           |
| Active + Focus | bg-surface-base-primary (#fff) | text-brand (#3c61dd) + ring    |

**Focus Ring**: `box-shadow: 0px 0px 0px 3px #d9e2fc` (primary-300)

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/calendar-tab.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic CalendarTab with default props
2. **All States Story**: Visual comparison of Default, Hover, Focus, Pressed, Active, Active+Focus states
3. **Active State Story**: Focused view of active/selected state
4. **Focus States Story**: Showing focus ring behavior
5. **Disabled State Story**: Disabled interaction state
6. **In Calendar Context Story**: Real-world example showing tabs in a calendar header
7. **View Switcher Example**: Month/Year toggle example
8. **Complete Matrix Story**: All state combinations in a grid

**Story Requirements**:

- Use `satisfies Meta<typeof CalendarTab>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` for text, state, active, disabled props
- Set `parameters.layout: "centered"`
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. Research existing calendar component patterns in `src/ui/inputs/`
2. Review typography component for consistent text rendering approach
3. Analyze ButtonGroupItem for state handling patterns
4. Map Figma design tokens to existing design system tokens

### Phase 2: Core Implementation

1. Create CalendarTab component with CVA variants
2. Implement all 6 states: default, hover, focus, pressed, active, active-focus
3. Add disabled state support
4. Implement proper ref forwarding
5. Add accessibility attributes (role, aria-selected, aria-pressed)

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add export to `src/ui/inputs/index.ts` barrel file
- Component will be accessible via `import { CalendarTab } from '@/ui'`

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/inputs/calendar-tab.stories.tsx`
- All state stories (Default, Hover, Focus, Pressed, Active, Active+Focus)
- Disabled state story
- Interactive controls for text, state, active, disabled props
- Real-world usage examples showing calendar header context
- Complete state matrix for visual comparison

## Step by Step Tasks

### Step 1: Research and Setup

- Review `src/ui/inputs/calendar-day.tsx` for calendar component patterns
- Review `src/ui/buttons/button-group-item.tsx` for state variant patterns
- Review `src/ui/typography/text.tsx` for typography integration
- Confirm design token mappings from Figma to codebase

### Step 2: Create CalendarTab Component

- Create `src/ui/inputs/calendar-tab.tsx`
- Define `calendarTabVariants` using CVA with:
  - Base styles: height, padding, gap, border-radius, **inline typography** (text-sm, leading-5, font-medium)
  - **Use CSS pseudo-classes** for hover, focus, active (pressed) states - NOT explicit state variants
  - Boolean `active` variant: `true | false` for selected state
  - Disabled styles in base: `disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-52`
- Implement compound variants for active + focus combination
- Add forwardRef with proper typing
- Add accessibility attributes:
  - `role="tab"` for tab semantics
  - `aria-selected` for active state
  - `aria-disabled` for disabled state
  - `tabIndex` management

**CVA Structure (Corrected following ButtonGroupItem pattern):**

```typescript
const calendarTabVariants = cva(
  [
    'inline-flex items-center justify-center',
    'h-8 gap-1.5 px-2 py-1.5',
    'rounded-sm',
    'text-sm leading-5 font-medium', // Typography INLINE - no TextSm composition
    'transition-colors duration-150',
    // Pseudo-class states (not explicit variants)
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
        className: 'focus-visible:bg-background focus-visible:text-primary',
      },
    ],
    defaultVariants: {
      active: false,
    },
  }
);
```

### Step 3: Implement CalendarTab Props Interface

```typescript
interface CalendarTabProps {
  children: React.ReactNode;
  active?: boolean; // For selected state - NOT explicit hover/focus/pressed states
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}
```

**Note:** Hover, focus, and pressed states are handled via CSS pseudo-classes, NOT through props. This follows the ButtonGroupItem pattern.

### Step 4: Create Unit Tests

- Create `src/ui/inputs/__tests__/calendar-tab.test.tsx`
- Test rendering with default props
- Test all state variants visually (via class assertions)
- Test active state styling
- Test disabled state behavior
- Test click handler functionality
- Test accessibility attributes (role, aria-selected, aria-disabled)
- Test ref forwarding
- Test className merging

### Step 5: Create Storybook Stories (REQUIRED)

- Create `src/stories/inputs/calendar-tab.stories.tsx`
- Configure meta with comprehensive argTypes
- Implement required stories:
  - Default
  - AllStates (visual comparison)
  - ActiveState
  - FocusStates
  - DisabledState
  - InCalendarContext (real-world example)
  - ViewSwitcherExample
  - CompleteMatrix

### Step 6: Update Barrel Exports

- Add export to `src/ui/inputs/index.ts`:
  ```typescript
  export * from './calendar-tab';
  ```

### Step 7: Run Validation Commands

Execute all validation commands to ensure zero regressions.

## Testing Strategy

### Unit Tests

1. **Rendering Tests**
   - Renders with default props
   - Renders children content correctly
   - Applies custom className

2. **State Tests**
   - Default state has correct styling classes
   - Active state has correct styling classes
   - Disabled state prevents interaction and applies disabled styles
   - Focus state applies focus ring styles

3. **Interaction Tests**
   - Click handler is called when clicked
   - Click handler is NOT called when disabled
   - Keyboard navigation works (Enter/Space)

4. **Accessibility Tests**
   - Has role="tab" attribute
   - aria-selected reflects active state
   - aria-disabled reflects disabled state
   - Focus is manageable via keyboard

5. **Ref Tests**
   - Ref is forwarded to button element

### Edge Cases

- Empty children (should warn in dev mode)
- Very long text content (should handle gracefully)
- Rapid active state toggling
- Focus during disabled state
- Active + disabled combination

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/inputs/calendar-tab.tsx` with proper TypeScript types
- ✅ All 6 states work correctly (default, hover, focus, pressed, active, active+focus)
- ✅ Disabled state prevents interaction
- ✅ Component forwards refs correctly
- ✅ Component follows design system patterns (CVA, semantic tokens)
- ✅ Design matches Figma specifications (32px height, 8px padding, 6px radius, Inter Medium 14px)

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/calendar-tab.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **All state stories implemented (default, hover, focus, pressed, active, active+focus)**
- ✅ **Disabled state story implemented**
- ✅ **Real-world examples (minimum 2-3 practical usage scenarios)**
- ✅ **Complete state matrix showing all combinations**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { CalendarTab } from '@/ui'`

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

3. **Run component tests**: `npm test -- calendar-tab`
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

### Design Token Mapping

Based on Figma analysis, the following token mappings are required:

| Figma Token                                                                | Codebase Token                          |
| -------------------------------------------------------------------------- | --------------------------------------- |
| `--context/text/base/tertiary/text-base-tertiary` (#889096)                | `text-text-tertiary`                    |
| `--context/text/base/tertiary/text-base-tertiary_hover` (#7d868c)          | Need to verify or create hover variant  |
| `--context/text/base/tertiary/text-base-tertiary_active` (#697177)         | Need to verify or create active variant |
| `--context/text/brand/text-brand` (#3c61dd)                                | `text-primary`                          |
| `--context/background/surface/base/primary/bg-surface-base-primary` (#fff) | `bg-background` or `bg-white`           |
| `--theme/brand/300` (#d9e2fc)                                              | `ring-primary-300`                      |
| `--radius-sm` (6px)                                                        | `rounded-sm`                            |
| `--spacing-md` (8px)                                                       | `px-2`                                  |
| `--spacing-sm` (6px)                                                       | `py-1.5` or `gap-1.5`                   |

### State Interaction Pattern (CORRECTED per Architectural Evaluation)

**Critical:** States are handled through CSS pseudo-classes, NOT through explicit state props:

- `:hover` for hover state (automatic via CSS)
- `:focus-visible` for focus state (automatic via CSS)
- `:active` for pressed state (automatic via CSS)
- `active` boolean prop + `aria-selected` for selected/active state (controlled via prop)

**Why This Matters:**

- Follows ButtonGroupItem and CalendarDay established patterns
- Browser handles focus states natively for accessibility
- Simplifies API - only manage selected/active state, not transient interaction states
- CSS pseudo-classes provide native performance and accessibility benefits

### Future Considerations

- CalendarTab may be composed into a CalendarTabGroup molecule for grouped navigation
- Consider adding size variants (sm, md, lg) if needed by future calendar designs
- May need to support icons in future iterations (left/right icon like ButtonGroupItem)

---

## Architectural Evaluation Applied

**Evaluation Date:** 2025-11-30
**Evaluation Document:** `ai/agents/evaluations/calendar-tab-plan-2025-11-30.md`

### Changes Applied from Evaluation

1. **Composition Strategy (CRITICAL):**
   - ❌ Removed: TextSm composition requirement
   - ✅ Added: Inline typography classes in CVA (`text-sm leading-5 font-medium`)
   - **Reason:** ButtonGroupItem and CalendarDay use inline typography, not atom composition

2. **State Management (MODERATE):**
   - ❌ Removed: Explicit state variants (`hover | focus | pressed | active | activeFocus`)
   - ✅ Added: CSS pseudo-classes for transient states + boolean `active` prop
   - **Reason:** Matches ButtonGroupItem pattern; CSS handles hover/focus/pressed natively

3. **CVA Structure:**
   - ✅ Added: Complete CVA example with corrected pattern
   - ✅ Added: Compound variants for active + focus combination
   - ✅ Added: Disabled styles in base classes

4. **Classification Clarification:**
   - Maintained as Atom (component doesn't compose other atoms)
   - Updated reasoning to explain inline typography approach

### Evaluation Score: 7/10 → Expected 9/10 after corrections

**Remaining verification needed during implementation:**

- Verify `text-text-tertiary-hover` and `text-text-tertiary-active` tokens exist
- Test active + disabled combination behavior
