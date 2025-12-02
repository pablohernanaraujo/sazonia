# Ui: DropmenuItem (Input Dropdown Item)

## Component Description

The `DropmenuItem` component is a selectable menu item element specifically designed for input-related dropdown menus (select boxes, comboboxes, autocomplete). Unlike the action-focused `DropmenuOption`, this component supports:

- **Selection states**: Visual indication when an item is selected (blue left border, brand background)
- **Optional checkbox**: Can show a checkbox for multi-select scenarios
- **Caption text**: Secondary descriptive text below the main label
- **Left and right add-ons**: Flexible slots for icons, text, or custom content
- **Three sizes**: SM, MD, LG with appropriate spacing and typography
- **Interactive states**: Default, hovered, pressed, disabled with distinct visual styling

This component is essential for building rich, accessible dropdown menus in forms where users need to select from a list of options with additional context.

## Architectural Decision: Component Category and Naming

> **Decision**: Move to `inputs` category (Option A from evaluation)

**Rationale**:

- Aligns with functional intent (form input dropdowns)
- Co-locates with related form components (TextInput, NumberInput, FileInput)
- Clear naming in inputs category (no "Input" prefix needed)
- Follows existing pattern: TextInput, NumberInput, FileInput, **DropmenuItem**

**Component Decision: DropmenuItem vs DropmenuOption**:

| Aspect               | DropmenuOption (dropmenus/)           | DropmenuItem (inputs/)                           |
| -------------------- | ------------------------------------- | ------------------------------------------------ |
| **Purpose**          | Action menus (Edit, Delete, Settings) | Input dropdowns (Select, Combobox, Autocomplete) |
| **Selection state**  | No                                    | Yes (brand border + background)                  |
| **Checkbox support** | No                                    | Yes (for multi-select)                           |
| **Caption text**     | No                                    | Yes (additional context)                         |
| **Use cases**        | Context menus, navigation dropdowns   | Form selects, multi-select, autocomplete         |

## User Story

As a user selecting from a dropdown menu
I want to see clear visual feedback for selection state and have additional context (captions, icons)
So that I can quickly identify and select the right option from a list

## Problem Statement

Current dropdown menus in the application need a standardized, accessible component for selectable items that supports:

- Multi-select with checkboxes
- Rich content with captions and icons
- Clear selection state visual feedback
- Consistent sizing across the design system

The existing `DropmenuOption` component is designed for action menus (edit, delete, etc.) but doesn't support selection states or checkboxes needed for input dropdowns.

## Solution Statement

Create a new `DropmenuItem` component in the `inputs` category that extends the dropdown item pattern with:

- Selection-aware styling (brand border and background when selected)
- Optional checkbox integration
- Caption text support for additional context
- Consistent CVA-based variant system matching existing components
- Full accessibility support with proper ARIA attributes

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: `DropmenuItem` combines multiple atomic elements (typography, checkbox, icons) into a cohesive, reusable component that serves a single purpose: representing a selectable item in an input dropdown.

**Composition Requirements**:

- **Required Atoms**:
  - `TextMd`, `TextSm`, `TextXs` from `@/ui/typography` - For label and caption text
  - `Icon` from `@/ui/icons` - For left add-on icons
- **Required Molecules**: None (this is a molecule itself)

## Component Location

**Location**: `src/ui/inputs/dropmenu-item.tsx`

**Category**: `inputs`

**Reasoning**: This component belongs in the `inputs` category alongside `TextInput`, `NumberInput`, `FileInput`, and other form-related components. It's specifically for input dropdown contexts (Select, Combobox, Autocomplete) and follows the naming pattern of existing input components.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/dropmenu-item.tsx
export { DropmenuItem, dropmenuItemVariants };
export type { DropmenuItemProps, DropmenuItemVariants };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './dropmenu-item';

// 3. Root barrel already exports inputs: src/ui/index.ts
// No changes needed - exports all from './inputs'

// 4. Import usage (recommended):
import { DropmenuItem } from '@/ui';

// 5. Import usage (alternative):
import { DropmenuItem } from '@/ui/inputs';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/dropmenus/dropmenu-option.tsx`** - Primary reference for component structure
  - CVA variants pattern for size and visual state
  - Add-on slot architecture (left/right)
  - Icon size mapping per component size
  - Disabled state handling

- **`src/ui/dropmenus/__tests__/dropmenu-option.test.tsx`** - Test structure reference
  - Comprehensive test categories (rendering, variants, states, accessibility)
  - Edge case testing patterns

- **`src/stories/dropmenus/dropmenu-option.stories.tsx`** - Story structure reference
  - Meta configuration with argTypes
  - Story organization (Default, Sizes, States, Add-ons, Examples, Comparisons)
  - Real-world usage examples

- **`src/ui/inputs/index.ts`** - Barrel export pattern

- **`src/ui/typography/text.tsx`** - Typography components for label/caption

- **`src/ui/icons/icon.tsx`** - Icon component for add-ons

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/dropmenu-item.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/dropmenu-item.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/dropmenu-item.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: No - Component width is determined by parent container
- **Tablet (md: 768px - 1023px)**: No - Same styling across breakpoints
- **Mobile (< 768px)**: No - Touch targets are adequate at all sizes (minimum 32px SM)

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2320-167268

**Design Specifications from Figma**:

#### Size Variants

| Size | Padding (py/px)              | Gap  | Font Size | Line Height | Checkbox Size | Icon Size |
| ---- | ---------------------------- | ---- | --------- | ----------- | ------------- | --------- |
| SM   | 6px/12px (4px with caption)  | 10px | 14px      | 20px        | 16px          | 16px      |
| MD   | 10px/12px (6px with caption) | 12px | 14px      | 20px        | 16px          | 16px      |
| LG   | 12px/16px (6px with caption) | 12px | 16px      | 24px        | 20px          | 20px      |

#### Caption Typography

| Size | Font Size | Line Height |
| ---- | --------- | ----------- |
| SM   | 12px      | 18px        |
| MD   | 12px      | 18px        |
| LG   | 14px      | 20px        |

#### State Colors

| State                 | Background                                   | Border                                  |
| --------------------- | -------------------------------------------- | --------------------------------------- |
| Default (unselected)  | `bg-surface-base-primary` (#ffffff)          | None                                    |
| Hovered (unselected)  | `bg-surface-base-primary_hover` (#f9fafb)    | None                                    |
| Pressed (unselected)  | `bg-surface-base-primary_active` (#f0f2f4)   | None                                    |
| Disabled (unselected) | `bg-surface-base-primary` (#ffffff)          | None                                    |
| Selected              | `bg-surface-brand-secondary` (#fafbff)       | 3px left `border-brand-solid` (#3c61dd) |
| Selected + Hovered    | `bg-surface-brand-secondary_hover` (#f0f4ff) | 3px left `border-brand-solid` (#3c61dd) |

#### Text Colors

| Element      | Default                         | Disabled                       |
| ------------ | ------------------------------- | ------------------------------ |
| Label        | `text-base-primary` (#11181c)   | `text-base-tertiary` (#889096) |
| Caption      | `text-base-secondary` (#697177) | `text-base-tertiary` (#889096) |
| Right add-on | `text-base-tertiary` (#889096)  | `text-base-tertiary` (#889096) |

#### Checkbox States

| State              | Background                                 | Border                                   |
| ------------------ | ------------------------------------------ | ---------------------------------------- |
| Unchecked          | `bg-surface-base-primary`                  | `border-base-primary` (#d7dbdf)          |
| Checked            | `bg-fill-brand-primary` (#3c61dd)          | None                                     |
| Disabled unchecked | `bg-surface-base-primary_active` (#f0f2f4) | `border-base-primary_disabled` (#e0e3e6) |
| Disabled checked   | `bg-fill-brand-primary_disabled` (#a3b3e8) | None                                     |

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/dropmenu-item.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic component with default props
2. **Size Stories**: SM, MD, LG variants
3. **State Stories**: Default, Hovered, Pressed, Disabled
4. **Selection Stories**: Selected vs Unselected in each state
5. **Caption Stories**: With and without caption text
6. **Checkbox Stories**: With and without checkbox
7. **Add-on Stories**: Left icon, right text, both, neither
8. **Real-world Examples**:
   - Country selector with flags
   - User selector with avatars
   - Category selector with icons
9. **Comparison Stories**: All sizes grid, all states grid, all variants matrix

**Story Requirements**:

- Use `satisfies Meta<typeof DropmenuItem>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` for all props
- Set `parameters.layout: "centered"`
- Create interactive controls for all configurable props
- Include JSDoc-style documentation

## Implementation Plan

### Phase 1: Foundation

1. Analyze Figma design specifications for exact spacing, colors, and typography values
2. Map Figma design tokens to existing Tailwind semantic color classes
3. Plan CVA variant structure based on DropmenuOption pattern

### Phase 2: Core Implementation

1. Create `DropmenuItem` component with CVA variants
2. Implement all size variants (SM, MD, LG)
3. Implement selection state styling (brand border and background)
4. Implement checkbox rendering (checked/unchecked states)
5. Implement caption text with appropriate typography
6. Implement left and right add-on slots
7. Implement interactive states (default, hovered, pressed, disabled)
8. Add proper ARIA attributes for accessibility

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add export to `src/ui/inputs/index.ts`
- Verify re-export through `src/ui/index.ts`

**Storybook Documentation (REQUIRED):**

- Create comprehensive story file at `src/stories/inputs/dropmenu-item.stories.tsx`
- Implement all required stories (default, sizes, states, selections, captions, add-ons, examples)
- Configure argTypes for interactive controls
- Create comparison matrices for visual testing

## Technical Specification

### CVA Variants Structure

```typescript
const dropmenuItemVariants = cva(
  [
    'flex w-full cursor-pointer items-center rounded-sm transition-colors duration-150',
    // Natural browser states
    'hover:bg-background-secondary active:bg-background-tertiary',
    'focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2',
    'focus-visible:outline-none',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2.5 px-3 py-1.5 text-sm leading-5',
        md: 'gap-3 px-3 py-2.5 text-sm leading-5',
        lg: 'gap-3 px-4 py-3 text-base leading-6',
      },
      visualState: {
        default: '',
        hovered: 'bg-background-secondary',
        pressed: 'bg-background-tertiary',
        focus: 'ring-2 ring-border-brand ring-offset-2',
      },
      selected: {
        true: 'border-info-500 bg-info-50 border-l-[3px]',
        false: '',
      },
      hasCaption: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Caption reduces vertical padding
      { size: 'sm', hasCaption: true, className: 'py-1' },
      { size: 'md', hasCaption: true, className: 'py-1.5' },
      { size: 'lg', hasCaption: true, className: 'py-1.5' },
      // Selected + hovered = darker background
      { selected: true, visualState: 'hovered', className: 'bg-info-100' },
    ],
    defaultVariants: {
      size: 'lg',
      visualState: 'default',
      selected: false,
      hasCaption: false,
    },
  }
);
```

### Props Interface

```typescript
export interface DropmenuItemProps
  extends
    Omit<ComponentPropsWithoutRef<'div'>, 'children'>,
    Omit<DropmenuItemVariants, 'hasCaption'> {
  /**
   * The option label text
   */
  label: string;

  /**
   * Whether this item is selected
   * @default false
   */
  selected?: boolean;

  /**
   * Whether to show a checkbox (for multi-select)
   * @default false
   */
  showCheckbox?: boolean;

  /**
   * Optional caption text below the label
   */
  caption?: string;

  /**
   * Whether to show the left add-on slot
   * @default false
   */
  showLeftAddOn?: boolean;

  /**
   * Whether to show the right add-on slot
   * @default false
   */
  showRightAddOn?: boolean;

  /**
   * Custom left add-on React node (overrides leftIcon)
   */
  leftAddOn?: ReactNode;

  /**
   * Custom right add-on React node (overrides rightText)
   */
  rightAddOn?: ReactNode;

  /**
   * Left icon component (from @phosphor-icons/react)
   */
  leftIcon?: React.ComponentType<PhosphorIconProps>;

  /**
   * Right text content
   */
  rightText?: string;

  /**
   * Whether the option is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Visual state override (for Storybook visualization only)
   * In production, states are handled via CSS pseudo-classes
   * @default 'default'
   */
  visualState?: 'default' | 'hovered' | 'pressed' | 'focus';
}
```

### Icon Size Mapping

```typescript
const sizeToIconSize: Record<
  'sm' | 'md' | 'lg',
  NonNullable<IconVariants['size']>
> = {
  sm: 'sm', // 16px
  md: 'sm', // 16px
  lg: 'md', // 20px
};
```

### Typography Mapping

| Component Size | Label Component         | Caption Component |
| -------------- | ----------------------- | ----------------- |
| SM             | Direct span (text-sm)   | TextXs            |
| MD             | Direct span (text-sm)   | TextXs            |
| LG             | Direct span (text-base) | TextSm            |

**Implementation Note**: Main label uses direct `<span>` with Tailwind classes (performance), while caption uses Typography components (semantic consistency). This follows the DropmenuOption pattern.

## Step by Step Tasks

### Step 1: Create Component File Structure

- Create `src/ui/inputs/dropmenu-item.tsx`
- Define TypeScript interfaces for props
- Set up CVA variants structure based on DropmenuOption pattern

### Step 2: Implement CVA Variants

- Create `dropmenuItemVariants` with size variants (sm, md, lg)
- Add visualState variants (default, hovered, pressed, focus)
- Add hasCaption variant for padding adjustment
- Map Figma spacing values to Tailwind classes:
  - SM: `gap-2.5 px-3 py-1.5` (with caption: `py-1`)
  - MD: `gap-3 px-3 py-2.5` (with caption: `py-1.5`)
  - LG: `gap-3 px-4 py-3` (with caption: `py-1.5`)

### Step 3: Implement Selection State Styling

- Add selected variant in CVA:
  - Background: `bg-info-50` (maps to brand secondary)
  - Border: `border-l-[3px] border-info-500` (maps to brand solid)
- Add compound variant for selected + hovered combination (`bg-info-100`)

### Step 4: Implement Checkbox

- Create inline checkbox using conditional rendering
- Size mapping: SM/MD → 16px (size-4), LG → 20px (size-5)
- Style checked state with brand fill color (`bg-info-500`)
- Style unchecked state with border (`border border-border bg-background`)
- Handle disabled checkbox state (`bg-background-tertiary`)
- Add `aria-hidden` to checkbox (parent has role="option")

### Step 5: Implement Caption Text

- Add optional caption prop
- Use hasCaption variant to adjust vertical padding
- Apply appropriate typography:
  - SM/MD: TextXs (12px/18px)
  - LG: TextSm (14px/20px)
- Apply muted text color

### Step 6: Implement Add-on Slots

- Left add-on: Icon component with size mapping
- Right add-on: Typography component with muted color
- Custom add-on override support (leftAddOn, rightAddOn props)
- Icon size mapping: SM/MD → sm (16px), LG → md (20px)

### Step 7: Implement Disabled State

- Apply tertiary text color to label (`text-text-tertiary`)
- Apply disabled checkbox styling
- Prevent pointer events (`pointer-events-none`)
- Set aria-disabled attribute
- Use `disabled && 'text-text-tertiary'` pattern (matches DropmenuOption)

### Step 8: Add Accessibility Attributes

- `role="option"` for listbox context
- `aria-selected` for selection state
- `aria-disabled` for disabled state
- `aria-checked` for checkbox (when showCheckbox is true)
- `tabIndex={disabled ? -1 : 0}` for keyboard navigation
- Focus visible ring styling with `ring-offset-2`

### Step 9: Create Unit Tests

- Create `src/ui/inputs/__tests__/dropmenu-item.test.tsx`
- Test rendering with required props
- Test all size variants
- Test all visual state variants
- Test selection state styling
- Test checkbox rendering and states
- Test caption rendering
- Test add-on slots (left, right, both, custom)
- Test disabled state
- Test accessibility attributes
- Test ref forwarding
- Test className merging
- Test edge cases

### Step 10: Create Storybook Stories

- Create `src/stories/inputs/dropmenu-item.stories.tsx`
- Configure meta with comprehensive argTypes
- Implement Default story
- Implement size variant stories (SM, MD, LG)
- Implement state stories (Default, Hovered, Pressed, Disabled)
- Implement selection stories (Selected, Unselected)
- Implement caption stories
- Implement checkbox stories
- Implement add-on stories
- Create real-world examples (country selector, user selector, category selector)
- Create comparison grids (AllSizes, AllStates, AllVariants)

### Step 11: Update Barrel Exports

- Add `export * from './dropmenu-item';` to `src/ui/inputs/index.ts`
- Verify component is accessible via `import { DropmenuItem } from '@/ui'`

### Step 12: Run Validation Commands

- Execute all validation commands to ensure zero regressions
- Fix any TypeScript, ESLint, or test failures
- Verify Storybook build succeeds

## Testing Strategy

### Unit Tests

1. **Rendering Tests**
   - Renders with required label prop
   - Renders as div element with role="option"
   - Renders all size variants correctly

2. **Size Variant Tests**
   - SM applies correct padding, gap, typography classes
   - MD applies correct padding, gap, typography classes
   - LG applies correct padding, gap, typography classes

3. **Visual State Tests**
   - Default state applies no background
   - Hovered state applies hover background
   - Pressed state applies active background
   - Focus state applies focus ring

4. **Selection State Tests**
   - Selected state applies brand border and background
   - Selected + hovered applies hover brand background
   - Unselected has no border

5. **Checkbox Tests**
   - Checkbox not rendered when showCheckbox is false
   - Checkbox rendered when showCheckbox is true
   - Checkbox shows checked state when selected
   - Checkbox disabled when component disabled

6. **Caption Tests**
   - Caption not rendered when caption prop is undefined
   - Caption rendered with correct text when caption is provided
   - Caption has correct typography styling per size
   - Vertical padding reduced when caption is present

7. **Add-on Tests**
   - Left add-on not rendered by default
   - Left add-on rendered when showLeftAddOn is true
   - Custom leftAddOn overrides default icon
   - Right add-on not rendered by default
   - Right add-on rendered when showRightAddOn is true
   - Custom rightAddOn overrides default text

8. **Disabled State Tests**
   - Disabled styling applied correctly (text-text-tertiary)
   - aria-disabled attribute set
   - pointer-events-none applied
   - tabIndex set to -1

9. **Accessibility Tests**
   - Has role="option"
   - aria-selected set based on selected prop
   - aria-disabled set when disabled
   - aria-checked set when showCheckbox is true
   - Icon is aria-hidden
   - Checkbox is aria-hidden

10. **Composition Tests**
    - Merges custom className correctly
    - Forwards ref correctly
    - Passes through additional props

### Edge Cases

- Very long label text (truncation)
- Very long caption text (truncation)
- Special characters in label and caption
- Unicode characters
- Empty caption text
- Multiple add-ons combinations
- All props enabled simultaneously

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/inputs/dropmenu-item.tsx`
- ✅ Three size variants (SM, MD, LG) with correct spacing and typography
- ✅ Four visual states (default, hovered, pressed, focus)
- ✅ Selection state with brand border and background
- ✅ Optional checkbox with checked/unchecked/disabled states
- ✅ Optional caption text with correct typography per size
- ✅ Caption presence adjusts vertical padding via compound variants
- ✅ Left and right add-on slots with custom override support
- ✅ Component forwards refs correctly
- ✅ Component follows CVA pattern matching DropmenuOption

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/dropmenu-item.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **ALL size variant stories (SizeSmall, SizeMedium, SizeLarge)**
- ✅ **ALL state stories (StateDefault, StateHovered, StatePressed, StateDisabled)**
- ✅ **Selection state stories (Selected, Unselected)**
- ✅ **Caption stories (WithCaption, WithoutCaption)**
- ✅ **Checkbox stories (WithCheckbox, WithoutCheckbox)**
- ✅ **Add-on stories (WithLeftIcon, WithRightText, WithBothAddOns)**
- ✅ **Real-world examples (minimum 3: country selector, user selector, category selector)**
- ✅ **Comparison stories (AllSizes, AllStates, AllVariants matrix)**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { DropmenuItem } from '@/ui'`

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

3. **Run component tests**: `npm test -- dropmenu-item`
   - Expected: All component tests pass
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

**All 6 commands MUST pass before the component is considered complete.**

## Notes

### Design Token Mapping

The Figma design uses custom design tokens that need to be mapped to the existing Tailwind semantic color system:

| Figma Token                        | Tailwind Class                |
| ---------------------------------- | ----------------------------- |
| `bg-surface-base-primary`          | `bg-white` or `bg-background` |
| `bg-surface-base-primary_hover`    | `bg-background-secondary`     |
| `bg-surface-base-primary_active`   | `bg-background-tertiary`      |
| `bg-surface-brand-secondary`       | `bg-info-50`                  |
| `bg-surface-brand-secondary_hover` | `bg-info-100`                 |
| `border-brand-solid`               | `border-info-500`             |
| `bg-fill-brand-primary`            | `bg-info-500`                 |
| `text-base-primary`                | `text-text-primary`           |
| `text-base-secondary`              | `text-text-secondary`         |
| `text-base-tertiary`               | `text-text-tertiary`          |
| `border-base-primary`              | `border-border`               |

### Checkbox Implementation

Instead of creating a separate Checkbox component, the checkbox will be implemented inline within DropmenuItem using:

- A styled div with conditional background and border
- A checkmark SVG icon when checked (Check from @phosphor-icons/react)
- Size mapped to component size (16px for SM/MD, 20px for LG)
- `aria-hidden` attribute (parent role="option" handles semantics)

### Expected Parent Context (Accessibility Documentation)

This component provides `role="option"` and expects a parent with `role="listbox"`.

**Designed for use within**:

- Select dropdowns (parent: `role="listbox"`)
- Combobox autocomplete (parent: `role="combobox"` + `role="listbox"`)
- Multi-select (parent: `role="listbox" aria-multiselectable="true"`)

**Usage Examples**:

```tsx
// Single select
<div role="listbox" aria-labelledby="country-label">
  <DropmenuItem label="United States" selected />
  <DropmenuItem label="Canada" />
</div>

// Multi-select
<div role="listbox" aria-multiselectable="true">
  <DropmenuItem label="Option 1" selected showCheckbox />
  <DropmenuItem label="Option 2" showCheckbox />
</div>
```

### Usage Documentation

**When to use DropmenuItem (inputs/) vs DropmenuOption (dropmenus/)**:

```typescript
// ✅ Use DropmenuItem (src/ui/inputs/) for:
// - Select dropdowns
<Select>
  <DropmenuItem label="Option 1" selected />
  <DropmenuItem label="Option 2" />
</Select>

// - Multi-select
<MultiSelect>
  <DropmenuItem label="Item 1" selected showCheckbox />
  <DropmenuItem label="Item 2" showCheckbox />
</MultiSelect>

// - Autocomplete/Combobox
<Combobox>
  <DropmenuItem
    label="React"
    caption="JavaScript library"
    selected
  />
</Combobox>

// ✅ Use DropmenuOption (src/ui/dropmenus/) for:
// - Action menus
<ContextMenu>
  <DropmenuOption label="Edit" leftIcon={Pencil} />
  <DropmenuOption label="Delete" leftIcon={Trash} />
</ContextMenu>

// - Navigation dropdowns
<NavigationMenu>
  <DropmenuOption label="Settings" leftIcon={Gear} />
  <DropmenuOption label="Logout" leftIcon={SignOut} />
</NavigationMenu>
```

### Future Considerations

- This component could be extended to support indeterminate checkbox state
- Integration with Radix UI Select/Combobox primitives for full dropdown functionality
- Keyboard navigation support when used in a listbox context
- Consider adding `asChild` pattern for Radix UI integration:
  ```tsx
  <Select.Item value="us" asChild>
    <DropmenuItem label="United States" leftIcon={FlagUS} />
  </Select.Item>
  ```
- If similar selection features are needed in DropmenuOption in the future, consider extracting shared logic to a hook (`useDropmenuItem`)
