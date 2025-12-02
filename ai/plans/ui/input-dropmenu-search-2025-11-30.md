# Ui: InputDropmenuSearch

## Component Description

The InputDropmenuSearch is a specialized search input component designed specifically for use within dropdown menus. It provides a clean, borderless search interface with a search icon, placeholder text, and subtle bottom border separator. This component enables users to quickly filter and search through dropdown options, commonly used in autocomplete, combobox, and select components.

The component features:

- Search icon on the left
- Placeholder text with cursor indicator
- Bottom border separator (instead of full border)
- Three size variants (SM, MD, LG)
- Two states: empty (placeholder) and filled (with value)
- Clean, minimal aesthetic designed to blend with dropdown menus

## User Story

As a user interacting with a dropdown component
I want to have a search input field at the top of the dropdown menu
So that I can quickly filter and find options without scrolling through a long list

## Problem Statement

Dropdown menus with many options can be overwhelming and slow to navigate. Users need a quick way to filter options by typing a search query. A dedicated search input component designed specifically for dropdown contexts ensures a consistent, accessible, and visually cohesive experience.

## Solution Statement

Create a dedicated InputDropmenuSearch component that:

1. Provides a minimal, borderless search field optimized for dropdown menus
2. Supports three size variants that align with dropdown menu sizing
3. Includes a search icon for clear visual affordance
4. Uses a subtle bottom border to separate from menu options
5. Supports both empty (placeholder) and filled states
6. Composes from existing atoms (Icon) - **standalone molecule, NOT extending TextInput**

**IMPORTANT ARCHITECTURAL DECISION**: This component is a **standalone molecule** with its own simplified feature set. It does NOT extend or compose from TextInput because:

- Different context: Optimized for dropdown menus, not general forms
- Simpler styling: Only bottom border, no full border or error states
- Reduced feature set: No left/right add-ons, no error states
- Tighter integration: Designed to blend seamlessly within dropdown menus

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: This component combines multiple atoms (Icon for the search icon, implicit Typography for text) into a cohesive, single-purpose element. It's more complex than a simple atom but doesn't orchestrate multiple molecules like an organism would. It's designed to be composed into larger organisms like Combobox or Autocomplete.

**Composition Requirements**:

- **Required Atoms**:
  - `Icon` from `@/ui/icons` - For the search icon (MagnifyingGlass from Phosphor)
  - Typography (implicitly via text classes) - For placeholder and input text styling

- **Status**: Molecule composing existing atoms

## Component Location

**Location**: `src/ui/inputs/input-dropmenu-search.tsx`

**Category**: `inputs`

**Reasoning**: This component is a specialized input variant designed for use within dropdown/dropmenu contexts. The `inputs` category already contains related components like `DropmenuItem`, `TextInput`, and various form input elements. Placing it here maintains consistency and discoverability.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/input-dropmenu-search.tsx
export {
  InputDropmenuSearch,
  inputDropmenuSearchWrapperVariants,
  inputDropmenuSearchInputVariants,
};
export type { InputDropmenuSearchProps };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './input-dropmenu-search';

// 3. Root barrel already exports from inputs: src/ui/index.ts
// No changes needed if already exporting from './inputs'

// 4. Import usage (recommended):
import { InputDropmenuSearch } from '@/ui';

// 5. Import usage (alternative):
import { InputDropmenuSearch } from '@/ui/inputs';
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/inputs/text-input.tsx`** - Reference for (PATTERNS ONLY, do NOT extend):
  - CVA variant structure for sizes
  - Ref forwarding pattern
  - Size variant naming conventions (sm, md, lg)
  - Wrapper vs input styling separation
  - **NOTE**: Do NOT use add-on pattern or error states from TextInput

- **`src/ui/inputs/dropmenu-item.tsx`** - Reference for:
  - Size-to-icon mapping pattern (REQUIRED to implement)
  - Gap and padding values for dropdown contexts
  - How components in dropdown contexts are styled

- **`src/ui/icons/icon.tsx`** - Reference for:
  - Icon component usage and props
  - Icon size variants and color options

- **`src/stories/inputs/text-input.stories.tsx`** - Reference for:
  - Story structure and organization
  - ArgTypes configuration
  - Controlled vs uncontrolled patterns
  - All sizes/states comparison stories

- **`src/ui/inputs/__tests__/text-input.test.tsx`** - Reference for:
  - Test organization (describe blocks by feature)
  - Testing size variants
  - Testing event handling
  - Testing ref forwarding
  - Edge case coverage

- **Figma design** - Provided at `https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2416-173932&m=dev`

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/input-dropmenu-search.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/input-dropmenu-search.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/input-dropmenu-search.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required - Primary usage context
- **Tablet (md: 768px - 1023px)**: Not required - Component width is container-dependent
- **Mobile (< 768px)**: Not required - Component width is container-dependent

The component is width-flexible and will adapt to its container (typically 320px in dropdowns as shown in Figma).

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2416-173932&m=dev

**Design Specifications (from Figma analysis)**:

#### Size Variants

| Size | Container Padding      | Icon Size | Gap  | Font Size | Line Height |
| ---- | ---------------------- | --------- | ---- | --------- | ----------- |
| LG   | py-3 px-4 (12px, 16px) | 16px      | 12px | 16px      | 24px        |
| MD   | py-2 px-3 (8px, 12px)  | 16px      | 12px | 14px      | 20px        |
| SM   | py-2 px-3 (8px, 12px)  | 16px      | 10px | 14px      | 20px        |

#### Colors

- Border: `#e6e8eb` (border-base-secondary) - bottom border only
- Search icon: `#889096` (text-tertiary/muted)
- Placeholder text: `#889096` (text-tertiary)
- Filled text: `#11181c` (text-primary)
- Input cursor (pipe character): `#11181c` (text-primary)

#### Layout

- Horizontal layout: search icon → input field
- Bottom border only (0px 0px 1px 0px border-solid)
- Full width within container (w-full)
- Icon fixed size, text area flex-grows

#### States

1. **Empty (Filled=False)**: Shows placeholder text with cursor
2. **Filled (Filled=True)**: Shows entered/selected value

### Size-to-Icon Mapping (REQUIRED)

```typescript
// MUST implement this mapping pattern from DropmenuItem
const sizeToIconSize: Record<
  'sm' | 'md' | 'lg',
  NonNullable<IconVariants['size']>
> = {
  sm: 'sm', // 16px icon
  md: 'sm', // 16px icon
  lg: 'sm', // 16px icon (Figma shows 16px for all sizes)
};
```

### Interaction Patterns

- Focus: Standard input focus behavior with `focus-within:border-primary` on wrapper
- Hover: No special hover styling defined
- Input: Standard text input behavior
- No disabled state defined in Figma (not needed for dropdown search context)

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/input-dropmenu-search.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic component with LG size and placeholder
2. **AllSizes Story**: Comparison of SM, MD, LG sizes
3. **EmptyState Story**: Showing placeholder text
4. **FilledState Story**: Showing entered value
5. **AllCombinations Story**: Grid of all size × filled combinations
6. **WithinDropmenu Story**: Real-world example showing the component within a dropdown context ⭐ CRITICAL
7. **ControlledExample Story**: Demonstrating controlled input pattern
8. **NoIcon Story**: Variant without the search icon
9. **FocusedState Story**: Shows focus styling (border-primary on focus)
10. **AccessibilityDemo Story**: Demonstrates ARIA attributes (type="search", role="searchbox", aria-label)

**Story Requirements**:

- Use `satisfies Meta<typeof InputDropmenuSearch>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` for all props:
  - size: select control with sm/md/lg options
  - placeholder: text control
  - value/defaultValue: text controls
  - showIcon: boolean control
- Set `parameters.layout: 'centered'`
- Create interactive controls for all configurable props
- Document size variants with visual comparison
- Include at least 2-3 real-world usage examples

**Example Structure**:

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InputDropmenuSearch } from "@/ui/inputs/input-dropmenu-search";

const meta = {
  title: "Inputs/InputDropmenuSearch",
  component: InputDropmenuSearch,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant of the search input",
      table: { defaultValue: { summary: "lg" } },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text when empty",
    },
    showIcon: {
      control: "boolean",
      description: "Whether to show the search icon",
      table: { defaultValue: { summary: "true" } },
    },
  },
} satisfies Meta<typeof InputDropmenuSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Search" },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-4">
      <InputDropmenuSearch size="sm" placeholder="Search (SM)" />
      <InputDropmenuSearch size="md" placeholder="Search (MD)" />
      <InputDropmenuSearch size="lg" placeholder="Search (LG)" />
    </div>
  ),
};
```

## Implementation Plan

### Phase 1: Foundation

1. **Analyze Figma design thoroughly**
   - Extract exact spacing, colors, and typography values
   - Map Figma tokens to existing design system tokens
   - Document any discrepancies or new tokens needed

2. **Set up component file structure**
   - Create the component file with proper imports
   - Define TypeScript interfaces
   - Set up CVA variants structure

### Phase 2: Core Implementation

1. **Implement CVA variants**
   - Define `inputDropmenuSearchWrapperVariants` (size, with bottom border styling)
   - Define `inputDropmenuSearchInputVariants` (font sizes by size)
   - Implement `sizeToIconSize` mapping constant

2. **Build component structure**
   - Wrapper container with bottom border only (`border-b border-border-secondary`)
   - Focus state: `focus-within:border-primary`
   - Search icon with `aria-hidden={true}` (decorative)
   - Input element with `type="search"` and `role="searchbox"`
   - Ref forwarding for focus management

3. **Implement simplified prop interface**
   - `size` variant (sm, md, lg) - default 'lg'
   - `showIcon` toggle - default true
   - `wrapperClassName` for wrapper customization
   - Standard input props passthrough (placeholder, value, onChange, etc.)
   - **DO NOT INCLUDE**: leftAddOn, rightAddOn, error (not needed)

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add export to `src/ui/inputs/index.ts`
- Verify root barrel exports from inputs

**Storybook Documentation (REQUIRED):**

- Create comprehensive stories file
- Document all variants and states
- Create real-world usage examples
- Configure argTypes for all props

## Step by Step Tasks

### 1. Create Component File Structure

- Create `src/ui/inputs/input-dropmenu-search.tsx`
- Set up imports: React, CVA, cn utility, Icon component, Phosphor icons
- Define TypeScript interfaces for props and variants

### 2. Implement CVA Variants

- Create `inputDropmenuSearchWrapperVariants` with:
  ```typescript
  const inputDropmenuSearchWrapperVariants = cva(
    [
      // Base styles
      'flex w-full items-center',
      'border-b border-border-secondary',
      'bg-transparent',
      'transition-colors duration-150',
      'focus-within:border-primary',
    ],
    {
      variants: {
        size: {
          sm: 'gap-2.5 px-3 py-2', // 10px gap, 12px px, 8px py
          md: 'gap-3 px-3 py-2', // 12px gap, 12px px, 8px py
          lg: 'gap-3 px-4 py-3', // 12px gap, 16px px, 12px py
        },
      },
      defaultVariants: {
        size: 'lg',
      },
    }
  );
  ```
- Create `inputDropmenuSearchInputVariants` with:
  ```typescript
  const inputDropmenuSearchInputVariants = cva(
    [
      'w-full min-w-0 flex-1',
      'bg-transparent',
      'border-none outline-none',
      'text-text-primary',
      'placeholder:text-text-tertiary',
    ],
    {
      variants: {
        size: {
          sm: 'text-sm leading-5', // 14px/20px
          md: 'text-sm leading-5', // 14px/20px
          lg: 'text-base leading-6', // 16px/24px
        },
      },
      defaultVariants: {
        size: 'lg',
      },
    }
  );
  ```
- Implement `sizeToIconSize` mapping:
  ```typescript
  const sizeToIconSize: Record<
    'sm' | 'md' | 'lg',
    NonNullable<IconVariants['size']>
  > = {
    sm: 'sm',
    md: 'sm',
    lg: 'sm', // 16px for all sizes per Figma
  };
  ```

### 3. Implement Component Logic

```typescript
export interface InputDropmenuSearchProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  /**
   * Size variant of the search input
   * @default 'lg'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether to show the search icon
   * @default true
   */
  showIcon?: boolean;

  /**
   * Additional CSS classes for the wrapper element
   */
  wrapperClassName?: string;
}

export const InputDropmenuSearch = forwardRef<HTMLInputElement, InputDropmenuSearchProps>(
  ({ size = 'lg', showIcon = true, wrapperClassName, className, ...props }, ref) => {
    const iconSize = sizeToIconSize[size];

    return (
      <div className={cn(inputDropmenuSearchWrapperVariants({ size }), wrapperClassName)}>
        {showIcon && (
          <Icon
            icon={MagnifyingGlass}
            size={iconSize}
            color="muted"
            aria-hidden={true} // Decorative icon
          />
        )}
        <input
          ref={ref}
          type="search"
          role="searchbox"
          className={cn(inputDropmenuSearchInputVariants({ size }), className)}
          {...props}
        />
      </div>
    );
  }
);
```

### 4. Create Unit Tests

- Create `src/ui/inputs/__tests__/input-dropmenu-search.test.tsx`
- Test rendering with default props
- Test all size variants (sm, md, lg)
- Test showIcon prop toggle
- Test placeholder and value handling
- Test ref forwarding
- Test event handling (onChange, onFocus, onBlur)
- Test controlled vs uncontrolled modes
- Test className merging
- Test accessibility (aria attributes):
  - **Test `type="search"`** (REQUIRED)
  - **Test `role="searchbox"`** (REQUIRED)
  - **Test `aria-label` acceptance** (REQUIRED)
  - **Test icon `aria-hidden={true}`** (REQUIRED)
- Test edge cases

### 5. Create Storybook Stories (REQUIRED)

- Create `src/stories/inputs/input-dropmenu-search.stories.tsx`
- Implement Default story
- Implement AllSizes comparison story
- Implement EmptyState and FilledState stories
- Implement AllCombinations grid story
- Implement WithinDropmenu real-world example ⭐ CRITICAL
- Implement ControlledExample story
- Implement NoIcon story
- **Implement FocusedState story** (shows focus styling)
- **Implement AccessibilityDemo story** (demonstrates ARIA attributes)
- Configure comprehensive argTypes
- Add JSDoc comments explaining each story

### 6. Update Barrel Exports

- Add export to `src/ui/inputs/index.ts`:
  ```typescript
  export * from './input-dropmenu-search';
  ```

### 7. Run Validation Commands

- Execute all validation commands to ensure zero regressions
- Fix any TypeScript, ESLint, or test failures
- Verify Storybook builds successfully

## Testing Strategy

### Unit Tests

**Describe blocks organization:**

1. **Rendering**
   - Renders with default props
   - Renders as input element
   - Renders with placeholder
   - Renders with value

2. **Size variants**
   - Applies LG size by default
   - Applies SM size variant with correct styles
   - Applies MD size variant with correct styles
   - Wrapper has correct padding for each size
   - Correct gap values for each size

3. **Search icon**
   - Shows search icon by default
   - Hides search icon when showIcon=false
   - Icon has correct size based on component size
   - Icon has correct color styling

4. **Ref forwarding**
   - Forwards ref to input element
   - Ref allows focus programmatically

5. **Event handling**
   - Calls onChange when value changes
   - Calls onFocus when focused
   - Calls onBlur when blurred
   - Calls onKeyDown for keyboard events

6. **Controlled and uncontrolled modes**
   - Works as uncontrolled with defaultValue
   - Works as controlled with value and onChange

7. **className merging**
   - Merges custom className on input
   - Merges wrapperClassName on wrapper

8. **Accessibility** (REQUIRED - WCAG 2.1 AA)
   - Has `type="search"` on input element
   - Has `role="searchbox"` on input element
   - Accepts and applies `aria-label`
   - Accepts `aria-describedby`
   - Icon has `aria-hidden={true}` (decorative)

### Edge Cases

- Empty placeholder string
- Very long placeholder text
- Very long input value
- Rapid typing performance
- Special characters in value
- RTL text direction (if applicable)
- Component within various container widths

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/inputs/` with proper TypeScript types
- ✅ All three size variants (sm, md, lg) work correctly with correct styling
- ✅ Component forwards refs correctly to input element
- ✅ Search icon can be shown/hidden via showIcon prop
- ✅ Bottom border styling (not full border) matches Figma design
- ✅ Placeholder and filled states render correctly
- ✅ Component supports controlled and uncontrolled modes
- ✅ Component follows design system patterns (CVA, semantic tokens)

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/input-dropmenu-search.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **AllSizes variant story implemented**
- ✅ **EmptyState and FilledState stories implemented**
- ✅ **AllCombinations grid story showing all variants**
- ✅ **WithinDropmenu story showing component in dropdown context** ⭐ CRITICAL
- ✅ **FocusedState story showing focus styling**
- ✅ **AccessibilityDemo story demonstrating ARIA attributes**
- ✅ **Real-world examples (minimum 2-3 practical usage scenarios)**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Component can be imported via `import { InputDropmenuSearch } from '@/ui'`
- ✅ Component can be imported via `import { InputDropmenuSearch } from '@/ui/inputs'`

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

3. **Run component tests**: `npm test -- input-dropmenu-search`
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

From Figma analysis, map tokens to existing design system:

| Figma Token                       | Design System Token                          | Usage                |
| --------------------------------- | -------------------------------------------- | -------------------- |
| `#e6e8eb` (border-base-secondary) | `border-border-secondary` or `border-border` | Bottom border        |
| `#889096` (text-tertiary)         | `text-text-tertiary`                         | Icon and placeholder |
| `#11181c` (text-primary)          | `text-text-primary`                          | Filled text value    |

### Future Considerations

1. **Integration with Combobox/Autocomplete**: This component is designed to be composed into larger dropdown components. Consider creating a `Combobox` or `Autocomplete` organism that uses this molecule.

2. **Disabled state**: The Figma design doesn't show a disabled state, but one may be needed. Consider adding for completeness.

3. **Clear button**: Some search inputs have a clear (X) button. This could be added as an optional feature.

4. **Loading state**: For async search, a loading indicator could be useful.

5. **Keyboard navigation**: When integrated into dropdowns, ensure proper keyboard navigation support (arrow keys, Enter, Escape).

### Related Components

- `DropmenuItem` - Used together in dropdown lists
- `Dropmenu` - Parent container component
- Future: `Combobox`, `Autocomplete`, `Select` organisms

---

## Architectural Evaluation Applied

**Evaluation Document**: `ai/agents/evaluations/input-dropmenu-search-plan-2025-11-30.md`
**Score**: 8.5/10 → Expected 10/10 after modifications
**Status**: APPROVED WITH MODIFICATIONS (Applied)

### Modifications Applied from Evaluation

#### Critical Changes (APPLIED)

1. ✅ **Standalone Component**: Clarified that this is NOT extending TextInput - it's a standalone molecule
2. ✅ **Size-to-Icon Mapping**: Added required `sizeToIconSize` constant mapping
3. ✅ **Simplified Prop Interface**: Removed unnecessary props (leftAddOn, rightAddOn, error)
4. ✅ **Accessibility Attributes**: Added `type="search"`, `role="searchbox"` requirements
5. ✅ **Icon Accessibility**: Added `aria-hidden={true}` for decorative icon

#### Recommended Changes (APPLIED)

6. ✅ **Updated Test Coverage**: Added accessibility tests for type, role, aria-label, aria-hidden
7. ✅ **Added FocusedState Story**: Shows focus styling with border-primary
8. ✅ **Added AccessibilityDemo Story**: Demonstrates ARIA attributes
9. ✅ **Clarified Border Styling**: Documented bottom border only approach
10. ✅ **CVA Implementation Details**: Added complete code examples for variants

### Architecture Compliance Checklist

- [x] Standalone molecule (not extending TextInput)
- [x] CVA pattern with wrapper and input variants
- [x] Size-to-icon mapping constant
- [x] Simplified prop interface (size, showIcon, wrapperClassName)
- [x] Accessibility: type="search", role="searchbox", aria-hidden on icon
- [x] Ref forwarding for focus management
- [x] Controlled component pattern (no internal state)
- [x] Semantic tokens usage
- [x] Barrel export pattern
- [x] Comprehensive test coverage including accessibility
- [x] Complete Storybook documentation with 10 stories
