# Ui: ButtonGroupItem

## Component Description

The `ButtonGroupItem` is an individual interactive element designed to be used within a `ButtonGroup` container. It represents a single selectable option in a segmented control pattern, commonly used for toggling between views, filtering options, or selecting mutually exclusive choices.

Based on the Glow UI Figma design (node `2222:155803`), the component supports:

- **3 Size variants**: sm (32px), md (40px), lg (48px)
- **6 States**: default, hovered, active, focused, selected, disabled
- **3 Position variants (hierarchy)**: first, middle, last - controlling border radius
- **Icon support**: With text + icons, or icon-only mode

The component uses a subtle, outline-style appearance with a light border and white background, darkening on selection. It's designed to be grouped horizontally with adjacent items sharing borders.

## User Story

As a **developer building a UI**
I want to **use segmented button controls for toggling between options**
So that **users can make selections in a visually cohesive, grouped interface element**

## Problem Statement

The design system needs a segmented button control where multiple options are visually grouped together. Currently, there's no component that handles:

- Adjacent buttons with shared borders (no double borders)
- Position-aware border radius (rounded only on outer edges)
- Selection state within a group context
- Consistent sizing and styling matching the Glow UI design system

## Solution Statement

Create a `ButtonGroupItem` component that:

1. Implements CVA variants for size (sm/md/lg), state management, and position (first/middle/last)
2. Uses semantic color tokens matching the Glow UI design
3. Supports icons (left, right, or icon-only with aria-label)
4. Handles all interactive states (hover, focus, active, selected, disabled)
5. Is designed to be composed within a future `ButtonGroup` container component
6. Follows the established Button component patterns for consistency

## Atomic Design Classification

**Component Type**: Atom

**Reasoning**: `ButtonGroupItem` is a fundamental, self-contained interactive element that cannot be decomposed further into smaller functional units. While it may contain icons, it serves as a building block that will be composed into a `ButtonGroup` molecule. It's similar in atomic level to the existing `Button` atom. The name "ButtonGroupItem" indicates its **intended use context**, not its atomic classification - it remains an atom designed for group composition.

**Composition Requirements**:

- **Required Atoms**:
  - `Icon` from `@/ui/icons` - for rendering optional left/right icons

- **Status**: Base atom with minimal composition dependencies (only uses Icon atom for icon rendering)

## Component Location

**Location**: `src/ui/buttons/button-group-item.tsx`

**Category**: `buttons`

**Reasoning**: The `ButtonGroupItem` belongs in the `buttons` category as it's a button-like interactive control. It shares the same category as `Button` and will eventually be used alongside a `ButtonGroup` container. Grouping related button components together maintains logical organization in the design system.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/buttons/button-group-item.tsx
export { ButtonGroupItem, buttonGroupItemVariants };
export type { ButtonGroupItemProps };

// 2. Update category barrel: src/ui/buttons/index.ts
export * from './button';
export * from './button-group-item';

// 3. Root barrel already exports buttons: src/ui/index.ts
export * from './buttons';

// 4. Import usage (recommended):
import { ButtonGroupItem } from '@/ui';

// 5. Import usage (alternative):
import { ButtonGroupItem } from '@/ui/buttons';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/buttons/button.tsx`** - Primary reference for component patterns
  - CVA variant structure with compound variants
  - Icon rendering with Phosphor icons
  - Size mapping (sm/md/lg)
  - Disabled and loading state handling
  - TypeScript types for icon-only vs text buttons
  - `forwardRef` usage pattern

- **`src/ui/buttons/__tests__/button.test.tsx`** - Testing patterns
  - Variant testing structure
  - State testing (disabled, loading)
  - Icon rendering tests
  - Accessibility tests
  - Keyboard interaction tests

- **`src/stories/buttons/button.stories.tsx`** - Storybook patterns
  - Meta configuration with `satisfies Meta<typeof Component>`
  - Comprehensive argTypes definitions
  - Story organization (Default, AllVariants, States, Examples)
  - Real-world usage examples

- **`src/ui/icons/icon.tsx`** - Icon component for composition
  - Size variants matching button sizes
  - Color inheritance pattern

- **`src/app/globals.css`** - Design tokens
  - Semantic color mappings
  - Border, background, and text colors
  - Border radius tokens

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/buttons/button-group-item.tsx` (REQUIRED)
2. **Test file**: `src/ui/buttons/__tests__/button-group-item.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/buttons/button-group-item.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
4. **Category barrel update**: `src/ui/buttons/index.ts` (update existing)

## Style & Design Requirements

### Design Specifications from Figma

Based on the Figma design context retrieved:

**Colors (from Figma CSS variables):**

- Background (default): `#ffffff` (white surface)
- Background (selected): `#ebedef` (light gray fill)
- Border (default): `#d7dbdf`
- Border (hover): `#c1c8cd`
- Border (disabled): `#e0e3e6`
- Text (default): `#889096` (tertiary text)
- Text (hover): `#7d868c`
- Text (selected/active): `#697177`
- Text (disabled): `#c1c8cd`
- Icon colors follow text colors

**Sizing:**

- **LG (48px height)**: `px-[16px] py-[12px]`, icon: 24px (lg), gap: 8px, text: 16px/24px line-height
- **MD (40px height)**: `px-[14px] py-[10px]`, icon: 20px (md), gap: 8px, text: 16px/24px line-height
- **SM (32px height)**: `px-[12px] py-[8px]`, icon: 16px (sm), gap: 8px, text: 14px/20px line-height
- Icon-only uses equal padding (14px for LG, 10px for MD, 8px for SM)

**Border Radius (CRITICAL - only in position variants, NOT in base styles):**

- First position: `rounded-l-sm` (6px on left corners only)
- Middle position: no border radius
- Last position: `rounded-r-sm` (6px on right corners only)

**Typography:**

- Font: Inter Medium (weight 500)
- Size: 16px (md/lg), 14px (sm)
- Line height: 24px (md/lg), 20px (sm)

### Responsive Design

- **Desktop (lg: 1024px+)**: No - component sizing is explicit via size prop
- **Tablet (md: 768px - 1023px)**: No - same as desktop
- **Mobile (< 768px)**: No - same sizing, but parent container handles responsive layout

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2222-155803&m=dev
- Screenshots: Component matrix showing all states and sizes
- Design specifications: Extracted from Figma design context

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/buttons/button-group-item.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic button group item with default props
2. **AllSizes Story**: sm, md, lg sizes displayed together
3. **AllPositions Story**: first, middle, last hierarchy positions
4. **AllStates Story**: default, hover, focus, active, selected, disabled
5. **WithLeftIcon Story**: Items with left-side icons
6. **WithRightIcon Story**: Items with right-side icons
7. **WithBothIcons Story**: Items with icons on both sides
8. **IconOnly Story**: Icon-only items (requires aria-label)
9. **SelectedState Story**: Selected state demonstration
10. **DisabledState Story**: Disabled items in various configurations
11. **GroupedExample Story**: Multiple items shown together simulating a group
12. **RealWorldToolbar Story**: Toolbar-like grouping (e.g., text alignment: left, center, right)
13. **RealWorldViewToggle Story**: View toggle example (e.g., grid/list view)
14. **LiveGroupSimulation Story**: Interactive group with stateful selection (NEW - per architectural review)
15. **CompleteMatrix Story**: All combinations grid

**Story Requirements**:

- Use `satisfies Meta<typeof ButtonGroupItem>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` for size, position, selected, disabled, icons
- Set `parameters.layout: "centered"`
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. **Research and understand existing patterns**
   - Study `button.tsx` for CVA structure, icon handling, and TypeScript patterns
   - Review design tokens in `globals.css` for color mappings
   - Analyze Figma specifications for exact styling requirements

2. **Define TypeScript interfaces**
   - `ButtonGroupItemProps` with variant props
   - Icon-only vs text button type discrimination using discriminated unions (same pattern as Button)
   - Position type: `'first' | 'middle' | 'last'`

### Phase 2: Core Implementation

1. **Create CVA variants (CRITICAL: follow architectural recommendations)**

   **Base styles (NO border-radius here):**

   ```typescript
   const buttonGroupItemVariants = cva(
     [
       'inline-flex items-center justify-center gap-2',
       'cursor-pointer',
       'font-medium',
       'border border-border',
       'bg-background',
       'text-text-tertiary',
       'transition-colors duration-150',
       'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
       // NOTE: NO 'rounded-sm' here - only in position variants
     ],
     {
       variants: {
         size: {
           sm: 'h-8 px-3 py-2 text-sm',
           md: 'h-10 px-3.5 py-2.5 text-base',
           lg: 'h-12 px-4 py-3 text-base',
         },
         position: {
           first: 'rounded-l-sm', // Left corners only
           middle: '', // No rounding
           last: 'rounded-r-sm', // Right corners only
         },
         selected: {
           true: 'bg-fill-tertiary text-text-subtle',
           false: '',
         },
       },
       compoundVariants: [
         // Hover states (not selected)
         {
           selected: false,
           className: 'hover:border-border-hover hover:text-text-subtle',
         },
         // Disabled state overrides
         {
           className:
             'disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-background disabled:text-text-secondary disabled:opacity-52',
         },
       ],
       defaultVariants: {
         size: 'md',
         position: 'middle',
         selected: false,
       },
     }
   );
   ```

2. **Implement icon rendering (CRITICAL: use color={null} for inheritance)**

   ```typescript
   // Icon size mapping - same pattern as Button
   const buttonGroupItemIconSizeMap = {
     sm: 'sm',  // 16px
     md: 'md',  // 20px
     lg: 'lg',  // 24px
   } as const;

   // Icon rendering helper
   function renderIcon(
     IconComponent: ComponentType<PhosphorIconProps> | undefined,
     size: IconSize
   ): React.ReactElement | null {
     if (!IconComponent) return null;
     // Pass color={null} to allow icons to inherit button text color via currentColor
     return <Icon icon={IconComponent} size={size} color={null} aria-hidden />;
   }
   ```

3. **Implement component structure**
   - Use `forwardRef` for ref forwarding with explicit return type `React.ReactElement`
   - Button element with proper type="button"
   - Icon rendering via Icon component with `color={null}`
   - Accessibility attributes (aria-pressed for selected, aria-label for icon-only)
   - Set `displayName` for debugging

4. **Handle state management**
   - Selected state via `selected` prop (controlled)
   - Disabled state via `disabled` prop
   - Focus-visible ring styling

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add export to `src/ui/buttons/index.ts`
- Component available via `import { ButtonGroupItem } from '@/ui'`

**Storybook Documentation (REQUIRED):**

- Create comprehensive stories file at `src/stories/buttons/button-group-item.stories.tsx`
- Document all variants, states, and positions
- Include real-world usage examples (toolbar, view toggle)
- Include LiveGroupSimulation story with stateful selection
- Interactive controls for all props

## Step by Step Tasks

### Step 1: Create ButtonGroupItem Component

- Create `src/ui/buttons/button-group-item.tsx`
- Define `buttonGroupItemVariants` with CVA
- **CRITICAL**: Base styles must NOT include `rounded-sm` - only position variants have border radius
- Implement base styles matching Figma specifications
- Add size variants (sm, md, lg) with correct heights and padding
- Add position variants (first, middle, last) for border radius only
- Add selected variant (true/false) for background and text changes
- Add compound variants for hover and disabled states
- Implement component with forwardRef and explicit `React.ReactElement` return type
- Set `displayName = 'ButtonGroupItem'`
- Add icon support (leftIcon, rightIcon) using `color={null}` for currentColor inheritance
- Implement icon size mapping: sm→sm (16px), md→md (20px), lg→lg (24px)
- Add icon-only mode with `aspect-square px-0` styles
- Add proper TypeScript discriminated union types (IconOnlyProps vs TextButtonProps)

### Step 2: Add Development Warning for Icon-Only Accessibility

- Implement `warnIfMissingAriaLabel` helper (same pattern as Button)
- Warn in development mode if icon-only without aria-label:
  ```typescript
  function warnIfMissingAriaLabel(
    children: ReactNode,
    ariaLabel: string | undefined
  ): void {
    if (process.env.NODE_ENV !== 'production' && !children && !ariaLabel) {
      console.warn(
        'ButtonGroupItem: Icon-only buttons require an aria-label for accessibility'
      );
    }
  }
  ```

### Step 3: Update Barrel Exports

- Update `src/ui/buttons/index.ts` to export `ButtonGroupItem`:
  ```typescript
  export * from './button';
  export * from './button-group-item';
  ```
- Verify import works via `import { ButtonGroupItem } from '@/ui'`

### Step 4: Create Unit Tests

- Create `src/ui/buttons/__tests__/button-group-item.test.tsx`
- Test rendering with default props
- Test all size variants (sm, md, lg)
- Test all position variants (first, middle, last) - verify border radius classes
- Test selected state and aria-pressed="true" attribute
- Test disabled state (opacity, pointer-events, aria-disabled)
- Test icon rendering (left, right, both, icon-only)
- **NEW**: Test icon color inheritance (verify currentColor works)
- Test click handler functionality
- Test click handlers don't fire when disabled
- Test focus management (focus-visible ring)
- Test accessibility (aria-label warning, accessible name)
- Test keyboard interactions (Enter, Space)
- Test className merging with cn()
- Test forwardRef works correctly

### Step 5: Create Storybook Stories

- Create `src/stories/buttons/button-group-item.stories.tsx`
- Configure meta with comprehensive argTypes
- Implement Default story
- Implement AllSizes story
- Implement AllPositions story
- Implement AllStates story
- Implement WithLeftIcon story
- Implement WithRightIcon story
- Implement WithBothIcons story
- Implement IconOnly story
- Implement SelectedState story
- Implement DisabledState story
- Implement GroupedExample story (simulating button group with `-ml-px` for border overlap)
- Implement RealWorldToolbar story (text alignment: left, center, right)
- Implement RealWorldViewToggle story (grid/list view)
- **NEW**: Implement LiveGroupSimulation story with React state for interactive selection:
  ```typescript
  export const LiveGroupSimulation: Story = {
    render: () => {
      const [selected, setSelected] = React.useState('middle');
      return (
        <div className="inline-flex">
          <ButtonGroupItem
            position="first"
            selected={selected === 'left'}
            onClick={() => setSelected('left')}
          >
            Left
          </ButtonGroupItem>
          <ButtonGroupItem
            position="middle"
            selected={selected === 'middle'}
            onClick={() => setSelected('middle')}
            className="-ml-px"
          >
            Center
          </ButtonGroupItem>
          <ButtonGroupItem
            position="last"
            selected={selected === 'right'}
            onClick={() => setSelected('right')}
            className="-ml-px"
          >
            Right
          </ButtonGroupItem>
        </div>
      );
    },
  };
  ```
- Implement CompleteMatrix story

### Step 6: Run Validation Commands

- Run `npm run type-check` - verify zero TypeScript errors
- Run `npm run lint` - verify zero ESLint errors
- Run `npm test -- button-group-item` - verify all tests pass
- Run `npm run test:run` - verify no regressions
- Run `npm run build` - verify production build succeeds
- Run `npm run build-storybook` - verify Storybook builds successfully
- **NEW**: Visual verification in Storybook matches Figma design
- **NEW**: Verify import works via `import { ButtonGroupItem } from '@/ui'`

## Testing Strategy

### Unit Tests

**Rendering Tests:**

- Renders with default props
- Renders children correctly
- Applies correct default variant classes

**Variant Tests:**

- Size variants (sm, md, lg) apply correct classes
- Position variants (first, middle, last) apply correct border radius
- **CRITICAL**: Position variants only - base styles have NO border radius
- Selected state applies correct background and aria-pressed
- Disabled state applies correct styles and disables interaction

**Icon Tests:**

- Renders left icon correctly
- Renders right icon correctly
- Renders both icons correctly
- Renders icon-only with aspect-square
- Icon size matches component size (sm→sm, md→md, lg→lg)
- **NEW**: Icon color inherits from button text color via currentColor

**State Tests:**

- Click handlers fire correctly
- Click handlers don't fire when disabled
- Selected state is properly communicated
- Focus-visible ring appears on keyboard focus

**Accessibility Tests:**

- Warns for icon-only without aria-label
- Has accessible name from children
- Has accessible name from aria-label
- aria-pressed reflects selected state

**Keyboard Interaction Tests:**

- Triggers click on Enter key press
- Triggers click on Space key press
- Does not trigger click when disabled

### Edge Cases

- Long text content handling
- Merging custom className
- State transitions (selected toggle)
- Position changes at runtime
- Missing children with no icon (should warn)

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/buttons/button-group-item.tsx`
- ✅ All size variants work correctly (sm: 32px, md: 40px, lg: 48px)
- ✅ All position variants work correctly (first, middle, last border radius)
- ✅ **CRITICAL**: Border radius ONLY in position variants, NOT in base styles
- ✅ Selected state shows correct background and sets aria-pressed="true"
- ✅ Disabled state reduces opacity and prevents interaction
- ✅ Component forwards refs correctly
- ✅ Component supports leftIcon and rightIcon props
- ✅ **CRITICAL**: Icons use `color={null}` for currentColor inheritance
- ✅ Icon sizes match component sizes (sm→sm, md→md, lg→lg)
- ✅ Icon-only mode works with required aria-label

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All variant combinations tested
- ✅ All state transitions tested
- ✅ Accessibility scenarios tested
- ✅ **NEW**: Icon color inheritance tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ Storybook stories file created: `src/stories/buttons/button-group-item.stories.tsx`
- ✅ Meta configuration with comprehensive argTypes
- ✅ Default story implemented
- ✅ ALL size stories implemented (sm, md, lg)
- ✅ ALL position stories implemented (first, middle, last)
- ✅ ALL state stories implemented (default, hover, focus, selected, disabled)
- ✅ Icon variation stories implemented
- ✅ Real-world examples (toolbar, view toggle) - minimum 2
- ✅ **NEW**: LiveGroupSimulation story with stateful selection
- ✅ CompleteMatrix story showing all variants together
- ✅ Interactive controls configured for all props
- ✅ Storybook builds successfully: `npm run build-storybook`
- ✅ All stories render correctly in Storybook UI

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/buttons/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`) - already exports buttons
- ✅ Component can be imported via `import { ButtonGroupItem } from '@/ui'`

### Code Quality

- ✅ Zero TypeScript errors: `npm run type-check`
- ✅ Zero ESLint warnings: `npm run lint`
- ✅ Build succeeds: `npm run build`

## Validation Commands

**Required Validation Commands for ALL Components** (execute in order):

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- button-group-item`
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

7. **Visual verification** (REQUIRED): Open Storybook and verify components match Figma design

8. **Import verification** (REQUIRED): Verify `import { ButtonGroupItem } from '@/ui'` works

**All validation commands MUST pass before the component is considered complete.**

## Notes

### Design Token Mapping

Map Figma tokens to existing semantic tokens:

| Figma Token                              | Tailwind Class           | Notes                               |
| ---------------------------------------- | ------------------------ | ----------------------------------- |
| `bg-surface-base-primary (#ffffff)`      | `bg-background`          | Default background                  |
| `bg-fill-base-tertiary (#ebedef)`        | `bg-fill-tertiary`       | Selected background                 |
| `border-base-primary (#d7dbdf)`          | `border-border`          | Default border                      |
| `border-base-primary_hover (#c1c8cd)`    | `border-border-hover`    | Hover border                        |
| `border-base-primary_disabled (#e0e3e6)` | `border-border-disabled` | Disabled border                     |
| `text-base-tertiary (#889096)`           | `text-text-tertiary`     | Default text                        |
| `text-base-tertiary_hover (#7d868c)`     | `text-text-subtle`       | Hover text (closest existing token) |
| `text-base-tertiary_active (#697177)`    | `text-text-subtle`       | Selected/active text                |
| `text-base-tertiary_disabled (#c1c8cd)`  | `text-text-secondary`    | Disabled text                       |

### Critical Implementation Notes (from Architectural Review)

1. **Border Radius**: Do NOT include `rounded-sm` in CVA base styles - ONLY in position variants:
   - `first: 'rounded-l-sm'` (left corners only)
   - `middle: ''` (no rounding)
   - `last: 'rounded-r-sm'` (right corners only)

2. **Icon Color Inheritance**: Pass `color={null}` to Icon component to allow icons to inherit the button's text color via `currentColor`

3. **Icon Size Mapping**: Use the same size map as Button:

   ```typescript
   const buttonGroupItemIconSizeMap = {
     sm: 'sm', // 16px
     md: 'md', // 20px
     lg: 'lg', // 24px
   } as const;
   ```

4. **Border Handling**: Keep borders on all sides for now. The future `ButtonGroup` molecule will handle border overlap via negative margins (`-ml-px`) on middle and last items.

5. **No Loading State**: Unlike Button, ButtonGroupItem does NOT have a loading state. It's a simpler toggle control, not an action button.

### Future Considerations

- **ButtonGroup Container**: A future `ButtonGroup` component will wrap multiple `ButtonGroupItem` components and handle:
  - Automatic position assignment (first/middle/last)
  - Single selection vs multi-selection modes
  - Keyboard navigation between items (arrow keys)
  - ARIA role="group" with accessible label
  - Border overlap via `-ml-px` on middle/last items

- **Controlled vs Uncontrolled**: Currently designed as controlled component (selected prop from parent). Consider adding uncontrolled mode with internal state.

- **Orientation**: Current implementation is horizontal. Vertical orientation could be added later via an `orientation` prop affecting border radius direction.

### Accessibility Considerations

- Use `aria-pressed` for toggle button semantics (selected state)
- Icon-only buttons require `aria-label` for screen reader support
- Focus ring must be visible on keyboard navigation
- Consider `role="group"` on future ButtonGroup container
- Ensure sufficient color contrast for all states (WCAG 2.1 AA)

### Pre-Implementation Checklist (from Architectural Review)

Before starting implementation, ensure:

- [ ] Do NOT include `rounded-sm` in CVA base styles (only in position variants)
- [ ] Pass `color={null}` to Icon components for currentColor inheritance
- [ ] Use icon size mapping: sm→sm, md→md, lg→lg
- [ ] Implement discriminated union types for icon-only vs text buttons
- [ ] Add development warning for icon-only without aria-label
- [ ] Use `aria-pressed` for selected state
- [ ] Follow Button.tsx structure for helper functions and rendering logic
- [ ] Export component, variants, and types from component file
- [ ] Update `src/ui/buttons/index.ts` barrel export
- [ ] Create comprehensive tests with >90% coverage
- [ ] Create comprehensive Storybook stories including LiveGroupSimulation
