# Ui: ButtonGroup

## Component Description

The ButtonGroup component is a container that groups multiple `ButtonGroupItem` components into a cohesive segmented control. It serves as a structural wrapper that manages the layout, spacing, and width behavior of grouped button items. ButtonGroup is commonly used for:

- View mode toggles (list/grid/table)
- Text alignment controls (left/center/right/justify)
- Data filtering options
- Tab-like navigation for mutually exclusive choices

The component handles the visual grouping by arranging items horizontally with proper border overlap, while delegating individual item rendering and state management to `ButtonGroupItem`.

## User Story

As a developer
I want to use a ButtonGroup container component
So that I can easily create segmented controls with consistent styling, proper border handling, and configurable width behavior

## Problem Statement

Currently, developers must manually wrap `ButtonGroupItem` components in a `div` with `inline-flex` and apply `-ml-px` classes manually to each middle and last item for proper border overlap. This approach is:

- Error-prone (easy to forget `-ml-px` or use wrong position values)
- Not DRY (requires repetitive className boilerplate)
- Inconsistent (no standardized width behavior options)
- Missing automatic position detection

## Solution Statement

Create a `ButtonGroup` container component that:

1. Automatically wraps children in the correct flex layout
2. Supports `hug` prop for width behavior (hug content vs fill container)
3. Supports `size` prop that can be passed down to children via React Context or cloneElement
4. Automatically calculates and applies position (first/middle/last/only) and `-ml-px` classes to children
5. Follows existing CVA patterns for consistent variant management
6. Validates children in development mode and warns about invalid child types
7. Provides comprehensive accessibility support with role and aria-label props

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: ButtonGroup is a molecule because it combines multiple atoms/molecules (ButtonGroupItem) into a cohesive functional unit. It doesn't function on its own but provides structure and behavior for its child items. It's a composition layer that groups interactive elements.

**Composition Requirements**:

- **Required Atoms**: None directly - uses existing molecules
- **Required Molecules**: `ButtonGroupItem from @/ui/buttons` - ButtonGroup wraps and manages ButtonGroupItem children

**Status**: Molecule that composes ButtonGroupItem molecules

## Component Location

**Location**: `src/ui/buttons/button-group.tsx`

**Category**: buttons

**Reasoning**: ButtonGroup belongs in the `buttons` category because it's directly related to `ButtonGroupItem` and `Button` components. It serves as a container for button-like interactive elements and shares the same domain (button interactions and controls).

**Export Pattern**:

```typescript
// 1. Create component: src/ui/buttons/button-group.tsx
export { ButtonGroup, buttonGroupVariants };
export type { ButtonGroupProps };

// 2. Update category barrel: src/ui/buttons/index.ts
export * from './button-group';

// 3. Root barrel already exports buttons: src/ui/index.ts
// (no changes needed)

// 4. Import usage (recommended):
import { ButtonGroup, ButtonGroupItem } from '@/ui';

// 5. Import usage (alternative):
import { ButtonGroup, ButtonGroupItem } from '@/ui/buttons';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/buttons/button-group-item.tsx`** - The item component that ButtonGroup will wrap
  - Provides position variant (first/middle/last)
  - Provides size variant (sm/md/lg)
  - ButtonGroup should automatically set these props on children

- **`src/ui/buttons/button.tsx`** - Reference for CVA patterns and component structure
  - Shows how to use class-variance-authority
  - Shows forwardRef pattern
  - Shows TypeScript prop typing patterns

- **`src/stories/buttons/button-group-item.stories.tsx`** - Reference for story patterns
  - GroupedExample story shows manual grouping approach
  - LiveGroupSimulation shows interactive selection state
  - All patterns should work identically with ButtonGroup

- **`src/ui/buttons/__tests__/button-group-item.test.tsx`** - Reference for testing patterns
  - Group Simulation tests show expected behavior
  - Tests for multiple items rendering together

- **`src/lib/utils.ts`** - Contains `cn` utility for class merging

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/buttons/button-group.tsx` (REQUIRED)
2. **Test file**: `src/ui/buttons/__tests__/button-group.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/buttons/button-group.stories.tsx` (REQUIRED)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Yes - Full width mode (`hug=false`) should expand to fill container
- **Tablet (md: 768px - 1023px)**: Yes - Same behavior as desktop
- **Mobile (< 768px)**: Yes - Both hug and full-width modes should work correctly

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1902-167618&m=dev
- Design specifications extracted from Figma

**Design Specifications from Figma**:

| Variant            | Size        | Hug   | Width Behavior                       |
| ------------------ | ----------- | ----- | ------------------------------------ |
| Size=LG, Hug=True  | 48px height | true  | Content width (inline-flex)          |
| Size=LG, Hug=False | 48px height | false | Full width (w-full, flex-1 children) |
| Size=MD, Hug=True  | 40px height | true  | Content width (inline-flex)          |
| Size=MD, Hug=False | 40px height | false | Full width (w-full, flex-1 children) |
| Size=SM, Hug=True  | 32px height | true  | Content width (inline-flex)          |
| Size=SM, Hug=False | 32px height | false | Full width (w-full, flex-1 children) |

**Key Visual Specifications**:

- Border: `border-border` (gray-200)
- Border radius: `rounded-sm` (6px) on first (left) and last (right) items only
- Background (default): `bg-background` (white)
- Background (selected): `bg-fill-tertiary` (gray-100)
- Text color: `text-text-tertiary` (gray-500)
- Icon size: 20px for LG/MD, 16px for SM
- Gap between icon and text: 8px
- Padding: Varies by size (see ButtonGroupItem)
- Border overlap: `-ml-px` on all items except first

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/buttons/button-group.stories.tsx`

**Required Stories**:

1. **Default**: Basic three-option ButtonGroup with default props
2. **AllSizes**: Shows SM, MD, LG sizes side by side
3. **HugBehavior**: Demonstrates hug=true vs hug=false width behavior
4. **WithIcons**: Groups with icon+text items
5. **IconOnly**: Groups with icon-only items
6. **SelectedState**: Demonstrates selection state within group
7. **DisabledState**: Shows disabled items within group
8. **TwoOptions**: Common binary toggle pattern
9. **FourOptions**: Shows group with 4 items
10. **RealWorldToolbar**: Text alignment toolbar example
11. **RealWorldViewToggle**: List/Grid/Table view toggle
12. **LiveInteraction**: Interactive demo with state management
13. **CompleteMatrix**: All variants and combinations

**Story Requirements**:

- Use `satisfies Meta<typeof ButtonGroup>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` for all props
- Set `parameters.layout: "centered"` for most stories
- Include decorators for full-width stories

**Example Structure**:

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ButtonGroup, ButtonGroupItem } from "@/ui/buttons";

const meta = {
  title: "Buttons/ButtonGroup",
  component: ButtonGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant for all items in the group",
    },
    hug: {
      control: "boolean",
      description: "Whether to hug content (true) or fill container (false)",
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem>Left</ButtonGroupItem>
      <ButtonGroupItem>Center</ButtonGroupItem>
      <ButtonGroupItem>Right</ButtonGroupItem>
    </ButtonGroup>
  ),
};
```

## Implementation Plan

### Phase 1: Foundation

1. Create the `ButtonGroup` component file structure
2. Define TypeScript interfaces for props
3. Implement CVA variants for hug behavior
4. Set up React Context for passing size to children (optional approach)

### Phase 2: Core Implementation

1. Implement the component with automatic position detection
2. Use `React.Children.map` to clone children with position props
3. Apply `-ml-px` automatically to non-first items
4. Pass size prop down to children
5. Handle edge cases (single child, no children)

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add `export * from './button-group';` to `src/ui/buttons/index.ts`
- Component will be available via `import { ButtonGroup } from '@/ui'`

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/buttons/button-group.stories.tsx`
- All 13 stories as described above
- Interactive controls for size and hug props
- Real-world usage examples (toolbar, view toggle)
- Responsive behavior demonstrations

## Step by Step Tasks

### 1. Create ButtonGroup Component Foundation

- Create `src/ui/buttons/button-group.tsx`
- Define `ButtonGroupProps` interface with:
  - `size?: 'sm' | 'md' | 'lg'`
  - `hug?: boolean` (default: true)
  - `orientation?: 'horizontal' | 'vertical'` (for future extensibility, type only initially)
  - `children: ReactNode`
  - `className?: string`
  - `role?: 'group' | 'radiogroup' | 'toolbar'` (default: 'group')
  - `'aria-label'?: string`
- Define CVA variants for container styles:
  ```typescript
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
  ```
- Add child type validation helper:

  ```typescript
  import { isValidElement } from 'react';

  function isButtonGroupItem(
    child: React.ReactNode
  ): child is React.ReactElement {
    return (
      isValidElement(child) &&
      (child.type === ButtonGroupItem ||
        (child.type as any)?.displayName === 'ButtonGroupItem')
    );
  }
  ```

### 2. Implement Child Position Detection

- Use `React.Children.toArray` to get array of children
- Filter children using `isButtonGroupItem` helper
- Add development-mode warning for invalid children:
  ```typescript
  if (process.env.NODE_ENV !== 'production') {
    const invalidCount = React.Children.count(children) - validChildren.length;
    if (invalidCount > 0) {
      console.warn(
        `ButtonGroup: Expected only ButtonGroupItem children, found ${invalidCount} invalid child(ren).`
      );
    }
  }
  ```
- Calculate total count and each child's index
- Map position using `getPosition` helper:

  ```typescript
  type Position = 'first' | 'middle' | 'last' | 'only';

  const getPosition = (index: number, total: number): Position => {
    if (total === 1) return 'only';
    if (index === 0) return 'first';
    if (index === total - 1) return 'last';
    return 'middle';
  };
  ```

- Single child receives `position='only'` for complete border radius

### 3. Implement Child Cloning with Props

- Use `React.cloneElement` to inject:
  - `position` prop based on calculated position (first/middle/last/only)
  - `className` with `-ml-px` for non-first items
  - `size` prop if provided to ButtonGroup (child size prop should override group size)
- For `hug=false`, also add `flex-1` class to children
- Implementation pattern:
  ```typescript
  return cloneElement(child, {
    position,
    size: child.props.size ?? size, // Child prop overrides group prop
    className: cn(index > 0 && '-ml-px', !hug && 'flex-1', child.props.className),
  });
  ```

### 4. Update ButtonGroupItem for 'only' Position

- Add 'only' position variant to ButtonGroupItem CVA:
  ```typescript
  position: {
    first: 'rounded-l-sm',
    middle: '',
    last: 'rounded-r-sm',
    only: 'rounded-sm', // Both sides rounded
  }
  ```
- (Optional) Add hover z-index for middle/last positions:
  ```typescript
  compoundVariants: [
    {
      position: ['middle', 'last'],
      className: 'hover:z-10', // Appear above left neighbor on hover
    },
  ],
  ```

### 5. Add Ref Forwarding

- Use `forwardRef` to forward ref to the container div
- Properly type the ref as `HTMLDivElement`
- Apply role and aria attributes to container:
  ```typescript
  <div
    ref={ref}
    role={role ?? 'group'}
    aria-label={ariaLabel}
    aria-orientation={orientation}
    className={buttonGroupVariants({ hug, className })}
  >
  ```

### 6. Create Unit Tests

- Create `src/ui/buttons/__tests__/button-group.test.tsx`
- Test rendering with default props
- Test size variants passed to children
- Test hug behavior (inline vs full-width)
- Test automatic position detection (first/middle/last/only)
- Test border overlap classes (-ml-px)
- Test single child edge case with 'only' position
- Test ref forwarding
- Test className merging
- Test empty children handling
- Test null/undefined children filtering
- **Test child type validation warning:**

  ```typescript
  it('warns when non-ButtonGroupItem children are provided', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation();

    render(
      <ButtonGroup>
        <ButtonGroupItem>Valid</ButtonGroupItem>
        <div>Invalid</div>
      </ButtonGroup>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('invalid child')
    );
  });
  ```

- **Test size prop precedence (child overrides group):**

  ```typescript
  it('child size prop overrides group size prop', () => {
    const { getByText } = render(
      <ButtonGroup size="lg">
        <ButtonGroupItem size="sm">Small item</ButtonGroupItem>
      </ButtonGroup>
    );

    const item = getByText('Small item');
    expect(item).toHaveClass('h-8'); // sm size
  });
  ```

- **Test ref forwarding with role:**

  ```typescript
  it('forwards ref to container div', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <ButtonGroup ref={ref}>
        <ButtonGroupItem>Item</ButtonGroupItem>
      </ButtonGroup>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute('role')).toBe('group');
  });
  ```

- **Test ARIA attributes:**

  ```typescript
  it('applies aria-label to container', () => {
    const { getByRole } = render(
      <ButtonGroup aria-label="View options">
        <ButtonGroupItem>List</ButtonGroupItem>
        <ButtonGroupItem>Grid</ButtonGroupItem>
      </ButtonGroup>
    );

    const group = getByRole('group');
    expect(group).toHaveAttribute('aria-label', 'View options');
  });
  ```

### 7. Create Storybook Stories

- Create `src/stories/buttons/button-group.stories.tsx`
- Implement all 13 required stories:
  1. Default
  2. AllSizes
  3. HugBehavior
  4. WithIcons
  5. IconOnly
  6. SelectedState
  7. DisabledState
  8. TwoOptions
  9. FourOptions
  10. RealWorldToolbar
  11. RealWorldViewToggle
  12. LiveInteraction
  13. CompleteMatrix
- Configure comprehensive argTypes including role and aria-label
- Add interactive controls
- Add accessibility documentation to meta

### 8. Update Barrel Exports

- Add `export * from './button-group';` to `src/ui/buttons/index.ts`

### 9. Run Validation Commands

- Run `npm run type-check` - ensure zero errors
- Run `npm run lint` - ensure zero warnings
- Run `npm test -- button-group` - ensure all tests pass
- Run `npm run test:run` - ensure no regressions
- Run `npm run build` - ensure build succeeds
- Run `npm run build-storybook` - ensure stories build
- Verify all stories render correctly in Storybook UI
- Test keyboard navigation
- Test with screen reader (optional)

## Testing Strategy

### Unit Tests

**Core Functionality Tests**:

- Renders children correctly
- Applies hug=true styles (inline-flex)
- Applies hug=false styles (w-full, flex-1 on children)
- Passes size prop to children

**Position Detection Tests**:

- First child gets position="first"
- Middle children get position="middle"
- Last child gets position="last"
- Single child gets position="only"

**Border Overlap Tests**:

- First child has no -ml-px
- Middle and last children have -ml-px

**Ref Forwarding Tests**:

- Ref is forwarded to container div
- Container has correct role attribute

**ClassName Merging Tests**:

- Custom className is merged correctly

**Child Type Validation Tests**:

- Warns in development when non-ButtonGroupItem children are provided
- Filters out invalid children

**Size Prop Precedence Tests**:

- Child size prop overrides group size prop
- Group size prop applies when child has no size

**Accessibility Tests**:

- Applies role="group" by default
- Accepts custom role (toolbar, radiogroup)
- Applies aria-label when provided

### Edge Cases

1. **Empty children**: Should render empty container gracefully
2. **Single child**: Should receive position="only" for complete border radius
3. **Dynamic children**: Should recalculate positions when children change
4. **Non-ButtonGroupItem children**: Should filter out and warn in development mode
5. **Null/undefined children**: Should filter out and not count as items
6. **Mixed valid/invalid children**: Should only render valid ButtonGroupItem children

## Acceptance Criteria

### Functional Requirements

- ✅ ButtonGroup renders children in a horizontal flex container
- ✅ `hug=true` (default) renders as inline-flex (content width)
- ✅ `hug=false` renders as full-width with flex-1 children
- ✅ `size` prop is passed down to all ButtonGroupItem children (child prop overrides)
- ✅ Position (first/middle/last/only) is automatically calculated and applied
- ✅ Border overlap is handled automatically with -ml-px classes
- ✅ Single child receives `position='only'` for complete border radius
- ✅ Component forwards ref correctly to container div
- ✅ Component follows design system patterns (CVA, polymorphic components, semantic tokens)
- ✅ Child type validation with development-mode warnings
- ✅ Accessibility: `role` prop with default 'group'
- ✅ Accessibility: `aria-label` prop support

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested (empty, single child, null children, invalid children)
- ✅ All tests passing with zero regressions
- ✅ Child type validation warning tests
- ✅ Size prop precedence tests
- ✅ Accessibility attribute tests

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/buttons/button-group.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **ALL size variant stories implemented (sm, md, lg)**
- ✅ **Hug behavior story showing both modes**
- ✅ **Real-world examples (minimum 3: toolbar, view toggle, live interaction)**
- ✅ **Comparison story showing all variants together (CompleteMatrix)**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/buttons/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { ButtonGroup } from '@/ui'`

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

3. **Run component tests**: `npm test -- button-group`
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

### Implementation Considerations

1. **Child Cloning vs Context**: Two approaches are possible:
   - `cloneElement`: Directly inject props into children (simpler, chosen approach)
   - `Context`: Create ButtonGroupContext for size (more flexible but complex)

   Recommendation: Use `cloneElement` for simplicity. Context can be added later if needed.

2. **Type Safety for Children**: Use the `isButtonGroupItem` type guard to validate children. Filter invalid children and warn in development mode.

3. **Single Child Edge Case**: When only one child, use `position='only'` variant:
   - Cleaner than applying both `rounded-l-sm` and `rounded-r-sm`
   - Requires adding 'only' variant to ButtonGroupItem CVA

4. **Size Prop Precedence**: Child size prop should override group size prop. This allows individual items to have different sizes if needed.

5. **Accessibility**: ButtonGroup should use `role="group"` with `aria-label` for screen readers:
   ```tsx
   <div role="group" aria-label="View options">
   ```

### Accessibility Documentation (JSDoc)

Add comprehensive JSDoc to component:

```typescript
/**
 * ButtonGroup - Container for grouped button items
 *
 * @accessibility
 * - Use `role="group"` for generic grouping (default)
 * - Use `role="radiogroup"` for mutually exclusive selections
 * - Use `role="toolbar"` for editor toolbars
 * - Provide `aria-label` or `aria-labelledby` for screen readers
 * - Individual ButtonGroupItem components handle keyboard interactions
 *
 * @example View toggle group
 * <ButtonGroup role="group" aria-label="View options">
 *   <ButtonGroupItem selected>List</ButtonGroupItem>
 *   <ButtonGroupItem>Grid</ButtonGroupItem>
 * </ButtonGroup>
 *
 * @example Text alignment toolbar
 * <ButtonGroup role="toolbar" aria-label="Text alignment">
 *   <ButtonGroupItem leftIcon={AlignLeft} aria-label="Align left" />
 *   <ButtonGroupItem leftIcon={AlignCenter} aria-label="Align center" />
 *   <ButtonGroupItem leftIcon={AlignRight} aria-label="Align right" />
 * </ButtonGroup>
 */
```

### Keyboard Navigation

ButtonGroup should document expected keyboard behavior:

- **Tab:** Moves focus into/out of group
- **Arrow keys:** Navigate between items (optional, depends on use case)
- **Space/Enter:** Activate focused item

### Future Considerations

1. **Vertical Orientation**: Current design is horizontal only. Future versions could support `orientation: 'horizontal' | 'vertical'`. The prop type is included in the interface for forward compatibility.

2. **Controlled Selection**: Currently selection state is managed by individual items. Future versions could add `value`/`onChange` props for controlled single-select behavior.

3. **Radio Group Semantics**: For mutually exclusive options, consider adding `role="radiogroup"` with `role="radio"` on items and proper ARIA attributes.

4. **Polymorphic Support**: Future versions could add `as` prop for semantic HTML (e.g., `<nav>` for navigation groups).

5. **Distribution Variant**: For `hug=false`, could add a `distribution` variant:
   - `equal`: flex-1 on all children (current default)
   - `auto`: Children size based on content

---

## Implementation Checklist

Use this checklist during implementation:

### Component Implementation

- [ ] Create `src/ui/buttons/button-group.tsx`
- [ ] Define `ButtonGroupProps` interface with all props (size, hug, orientation, role, aria-label, className)
- [ ] Implement CVA variants with `isolate` class
- [ ] Add `isButtonGroupItem` type guard helper
- [ ] Add child type validation with dev-mode warnings
- [ ] Implement position detection logic with 'only' case
- [ ] Implement size prop cascading (child overrides group)
- [ ] Implement `-ml-px` border overlap for non-first items
- [ ] Implement `flex-1` for children when `hug=false`
- [ ] Add forwardRef for container div
- [ ] Apply role and aria attributes to container
- [ ] Export component, variants, and types

### ButtonGroupItem Updates

- [ ] Add 'only' position variant to CVA
- [ ] Test single-child rendering with new variant
- [ ] (Optional) Add `hover:z-10` to middle/last positions

### Testing

- [ ] Create `src/ui/buttons/__tests__/button-group.test.tsx`
- [ ] Test rendering with default props
- [ ] Test all size variants
- [ ] Test hug behavior (true/false)
- [ ] Test position detection (first, middle, last, only)
- [ ] Test border overlap classes
- [ ] Test single child edge case
- [ ] Test empty children handling
- [ ] Test null/undefined children filtering
- [ ] Test ref forwarding
- [ ] Test className merging
- [ ] Test child type validation warnings
- [ ] Test size prop cascading and overrides
- [ ] Test ARIA attributes (role, aria-label)
- [ ] Achieve >90% coverage

### Storybook Stories

- [ ] Create `src/stories/buttons/button-group.stories.tsx`
- [ ] Configure meta with comprehensive argTypes
- [ ] Implement Default story
- [ ] Implement AllSizes story
- [ ] Implement HugBehavior story
- [ ] Implement WithIcons story
- [ ] Implement IconOnly story
- [ ] Implement SelectedState story
- [ ] Implement DisabledState story
- [ ] Implement TwoOptions story
- [ ] Implement FourOptions story
- [ ] Implement RealWorldToolbar story
- [ ] Implement RealWorldViewToggle story
- [ ] Implement LiveInteraction story (with state)
- [ ] Implement CompleteMatrix story
- [ ] Add accessibility documentation to meta

### Documentation

- [ ] Add comprehensive JSDoc to component
- [ ] Document accessibility considerations
- [ ] Add usage examples for all scenarios
- [ ] Document size prop cascading behavior
- [ ] Document child type requirements

### Integration

- [ ] Add `export * from './button-group'` to `src/ui/buttons/index.ts`
- [ ] Verify import works: `import { ButtonGroup } from '@/ui'`
- [ ] Verify import works: `import { ButtonGroup } from '@/ui/buttons'`

### Validation

- [ ] Run `npm run type-check` - zero errors
- [ ] Run `npm run lint` - zero warnings
- [ ] Run `npm test -- button-group` - all tests pass
- [ ] Run `npm run test:run` - no regressions
- [ ] Run `npm run build` - build succeeds
- [ ] Run `npm run build-storybook` - stories build successfully
- [ ] Verify all stories render correctly in Storybook UI
- [ ] Test keyboard navigation
- [ ] Test with screen reader (optional)

---

**Plan updated:** 2025-11-30
**Evaluation applied:** Based on UI/UX Architecture Agent review (92/100)
**Status:** Ready for implementation
