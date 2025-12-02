# Ui: Input Dropmenu

## Component Description

The Input Dropmenu is a composite dropdown container component specifically designed for form input scenarios such as select fields, comboboxes, and autocomplete inputs. It combines a search input with a scrollable list of selectable options, providing a cohesive user experience for selecting values from a filtered list.

Unlike the general-purpose `Dropmenu` component (used for action menus), the Input Dropmenu is optimized for:

- **Selection scenarios**: Choosing values for form inputs
- **Search/Filter functionality**: Built-in search input at the top
- **Multiple templates**: Options, Users (with avatars), Countries (with flags), Languages
- **Three size variants**: SM, MD, LG with consistent sizing across all child components

## User Story

As a **form user**
I want to **search and select options from a dropdown menu**
So that **I can quickly find and choose the correct value for form inputs**

## Problem Statement

Currently, the codebase has separate components (`InputDropmenuSearch` and `DropmenuItem`) but lacks a composite container component that:

1. Combines search input with option list in a cohesive unit
2. Provides consistent sizing through context propagation
3. Includes a scrollbar indicator for overflow content
4. Offers multiple templates for different use cases (simple options, users, countries, languages)

## Solution Statement

Create an `InputDropmenu` composite component that:

1. Uses a context-based size propagation system (similar to existing `Dropmenu`)
2. Composes existing atoms: `InputDropmenuSearch`, `DropmenuItem`
3. Provides three size variants: SM (320x240), MD (320x288), LG (320x344)
4. Includes proper scrolling with visual scrollbar thumb indicator
5. Follows established CVA patterns for variants

## Atomic Design Classification

**Component Type**: Organism

**Reasoning**: The Input Dropmenu is an organism because it:

- Combines multiple molecules (`InputDropmenuSearch`, `DropmenuItem`) into a functional unit
- Has complex behavior (search filtering, selection management)
- Represents a distinct section of the UI that could stand alone
- Contains its own context provider for state management

**Composition Requirements**:

- **Required Atoms**:
  - `Icon` from `@/ui/icons` (used by child components)
  - Typography components from `@/ui/typography` (used by child components)

- **Required Molecules**:
  - `InputDropmenuSearch` from `@/ui/inputs` - Search input at the top
  - `DropmenuItem` from `@/ui/inputs` - Individual selectable options

## Component Location

**Location**: `src/ui/inputs/input-dropmenu.tsx`

**Category**: `inputs` - This belongs in the inputs category because:

- It's designed for form input scenarios (select, combobox, autocomplete)
- It builds upon existing input-related components (`InputDropmenuSearch`, `DropmenuItem`)
- It serves as the dropdown content for select-type form controls

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/input-dropmenu.tsx
export {
  InputDropmenu,
  InputDropmenuContent,
  InputDropmenuOptions,
  inputDropmenuContentVariants,
};
export type {
  InputDropmenuProps,
  InputDropmenuContentProps,
  InputDropmenuOptionsProps,
  InputDropmenuSize,
};

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './input-dropmenu';

// 3. Import usage (recommended):
import { InputDropmenu, InputDropmenuContent, InputDropmenuOptions } from '@/ui';

// 4. Import usage (alternative):
import {
  InputDropmenu,
  InputDropmenuContent,
  InputDropmenuOptions,
} from '@/ui/inputs';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/inputs/input-dropmenu-search.tsx`** - Search input molecule to compose
  - Study CVA pattern, size variants, props structure
  - Understand the wrapper/input separation pattern

- **`src/ui/inputs/dropmenu-item.tsx`** - Selectable option molecule to compose
  - Study selection states, checkbox, add-ons pattern
  - Understand size-to-icon mapping

- **`src/ui/dropmenus/dropmenu.tsx`** - Reference for context-based size propagation
  - Study `DropmenuProvider` and `useDropmenuSize` patterns
  - Understand composite component structure

- **`src/ui/dropmenus/dropmenu-context.tsx`** - Reference for context implementation
  - Study React context pattern for size propagation

- **`src/stories/inputs/dropmenu-item.stories.tsx`** - Storybook story patterns
  - Study argTypes configuration
  - Understand story organization (Default, Variants, States, Examples)

- **`src/ui/inputs/__tests__/dropmenu-item.test.tsx`** - Test patterns
  - Study testing approach for composite components

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/input-dropmenu.tsx` (REQUIRED)
2. **Context file**: `src/ui/inputs/input-dropmenu-context.tsx` (REQUIRED)
3. **Test file**: `src/ui/inputs/__tests__/input-dropmenu.test.tsx` (REQUIRED)
4. **Story file**: `src/stories/inputs/input-dropmenu.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required - Full-width dropdown with fixed width (320px)
- **Tablet (md: 768px - 1023px)**: Required - Same as desktop
- **Mobile (< 768px)**: Required - May need max-width constraint for small screens

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2321-164317&m=dev

**Design Specifications from Figma**:

#### Container (InputDropmenuContent)

- Width: 320px for all sizes
- Height: SM=240px, MD=288px, LG=344px
- Background: `bg-background` (white #FFFFFF)
- Border: `border border-border-secondary` (#E6E8EB)
- Border radius: `rounded-sm` (6px)
- Overflow: clip/hidden

#### Search Section (InputDropmenuSearch - existing component)

- Bottom border: `border-b border-border-secondary`
- Padding: SM/MD=py-2 px-3, LG=py-3 px-4
- Gap: SM=10px, MD/LG=12px
- Search icon: 16px, color `text-text-tertiary` (#889096)
- Placeholder text: 16px, `text-text-tertiary`

#### Options Section (InputDropmenuOptions)

- Vertical padding: py-1 (4px top and bottom)
- Overflow: scroll (vertical)
- Max height: Calculated based on container size minus search height

#### Option Items (DropmenuItem - existing component)

- Already implemented with correct sizing and states

#### Scrollbar

- Width: 12px container, 4px thumb
- Thumb background: `bg-background-tertiary` (#D7DBDF)
- Thumb border radius: 4px
- Container padding: 4px

### Size Specifications

| Size | Container Height | Search Padding | Option Padding | Font Size |
| ---- | ---------------- | -------------- | -------------- | --------- |
| SM   | 240px            | py-2 px-3      | py-1.5 px-3    | 14px      |
| MD   | 288px            | py-2 px-3      | py-2.5 px-3    | 14px      |
| LG   | 344px            | py-3 px-4      | py-3 px-4      | 16px      |

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/input-dropmenu.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic InputDropmenu with LG size and simple options
2. **Size Stories**:
   - `SizeSmall` - SM variant (240px height)
   - `SizeMedium` - MD variant (288px height)
   - `SizeLarge` - LG variant (344px height, default)
3. **Template Stories**:
   - `TemplateOptions` - Simple text options
   - `TemplateUsers` - User avatars with names and emails
   - `TemplateCountry` - Country flags with names and codes
   - `TemplateLanguages` - Language names
4. **State Stories**:
   - `WithSelectedItem` - With an item pre-selected
   - `WithMultipleSelected` - Multi-select mode with checkboxes
   - `WithDisabledItems` - Some items disabled
   - `WithSearch` - Interactive search filtering
5. **Real-world Examples**:
   - `CountrySelectorExample` - Complete country selector
   - `UserSelectorExample` - User picker with avatars
   - `LanguageSelectorExample` - Language picker
   - `CategorySelectorExample` - Category picker with counts
6. **Comparison Stories**:
   - `AllSizes` - Side-by-side size comparison
   - `AllTemplates` - All template types in a grid

**Story Requirements**:

- Use `satisfies Meta<typeof InputDropmenu>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions
- Set `parameters.layout: "centered"`

**Example Structure**:

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  InputDropmenu,
  InputDropmenuContent,
  InputDropmenuOptions,
  InputDropmenuSearch,
  DropmenuItem
} from "@/ui/inputs";

const meta = {
  title: "Inputs/InputDropmenu",
  component: InputDropmenu,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant affecting height and child component sizing",
    },
  },
} satisfies Meta<typeof InputDropmenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InputDropmenu size="lg">
      <InputDropmenuContent>
        <InputDropmenuSearch placeholder="Search..." />
        <InputDropmenuOptions>
          <DropmenuItem label="Option 1" />
          <DropmenuItem label="Option 2" />
          <DropmenuItem label="Option 3" />
        </InputDropmenuOptions>
      </InputDropmenuContent>
    </InputDropmenu>
  ),
};
```

## Implementation Plan

### Size Propagation Strategy

**Chosen Approach**: Option A - Explicit Prop Passing (Recommended)

The `InputDropmenuContent` component will receive the size from context and pass it explicitly to child components as props. This approach was chosen because:

1. **No modification to existing molecules** - `InputDropmenuSearch` and `DropmenuItem` remain unchanged
2. **Clear, explicit size passing** - Easy to understand and debug
3. **Lower refactoring risk** - No circular import risks

**Implementation Pattern**:

```typescript
// InputDropmenuContent receives size from context and passes to children
export const InputDropmenuContent = forwardRef<HTMLDivElement, InputDropmenuContentProps>(
  ({ children, className, ...props }, ref) => {
    const contextSize = useInputDropmenuSize();

    return (
      <div ref={ref} className={cn(inputDropmenuContentVariants({ size: contextSize }), className)} {...props}>
        {children}
      </div>
    );
  }
);

// Usage: Developer passes size prop to children explicitly
<InputDropmenu size="lg">
  <InputDropmenuContent>
    <InputDropmenuSearch size="lg" placeholder="Search..." />
    <InputDropmenuOptions>
      <DropmenuItem size="lg" label="Option 1" />
    </InputDropmenuOptions>
  </InputDropmenuContent>
</InputDropmenu>
```

**Note**: In future iterations, consider making molecules context-aware (Option B) if this pattern is repeated across multiple composite components.

### React Import Pattern

**REQUIRED**: All components must use direct imports from React, NOT namespace imports.

```typescript
// ✅ CORRECT - Use this pattern
import {
  forwardRef,
  createContext,
  useContext,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';

// ❌ WRONG - DO NOT use this pattern
import * as React from 'react';
```

### Phase 1: Foundation

1. **Create context for size propagation** (`input-dropmenu-context.tsx`)
   - Define `InputDropmenuSize` type ('sm' | 'md' | 'lg')
   - Create `InputDropmenuContext` with size value
   - Create `InputDropmenuProvider` component
   - Create `useInputDropmenuSize` hook with safe fallback pattern

2. **Study existing components**
   - Review `Dropmenu` and `DropmenuContent` patterns
   - Review `InputDropmenuSearch` and `DropmenuItem` APIs
   - Identify integration points

### Phase 2: Core Implementation

1. **Create main component file** (`input-dropmenu.tsx`)
   - `InputDropmenu` - Context provider wrapper
   - `InputDropmenuContent` - Styled container with CVA variants
   - `InputDropmenuOptions` - Scrollable options container

2. **Implement CVA variants**

   ```typescript
   const inputDropmenuContentVariants = cva(
     'flex flex-col overflow-clip rounded-sm border border-border-secondary bg-background shadow-lg',
     {
       variants: {
         size: {
           sm: 'h-[240px] w-[320px]',
           md: 'h-[288px] w-[320px]',
           lg: 'h-[344px] w-[320px]',
         },
       },
       defaultVariants: {
         size: 'lg',
       },
     }
   );
   ```

   **Note**: `shadow-lg` added for consistency with `DropmenuContent` pattern.

3. **Implement scrollbar styling**
   - Custom scrollbar track and thumb
   - Match Figma design (4px thumb, 12px container)

   **Scrollbar Implementation Details**:
   Use Tailwind arbitrary classes for custom scrollbar styling:

   ```typescript
   // InputDropmenuOptions scrollbar classes
   const scrollbarClasses = [
     'overflow-y-auto',
     '[&::-webkit-scrollbar]:w-3', // 12px width
     '[&::-webkit-scrollbar-track]:bg-transparent',
     '[&::-webkit-scrollbar-thumb]:rounded',
     '[&::-webkit-scrollbar-thumb]:bg-background-tertiary',
     '[&::-webkit-scrollbar-thumb]:border-4',
     '[&::-webkit-scrollbar-thumb]:border-transparent',
     '[&::-webkit-scrollbar-thumb]:bg-clip-padding',
   ].join(' ');
   ```

   This creates a 4px visible thumb inside a 12px container, matching Figma specs.

### Accessibility Implementation

**Required ARIA Attributes**:

The component must implement proper ARIA roles and attributes for screen reader accessibility:

```typescript
// InputDropmenuContent should have:
<div
  role="listbox"
  aria-orientation="vertical"
  aria-label="Select an option"
>
  <InputDropmenuSearch
    role="searchbox"
    aria-label="Search options"
    aria-controls="options-list-id"
  />
  <InputDropmenuOptions id="options-list-id" role="group">
    <DropmenuItem role="option" aria-selected={isSelected} />
  </InputDropmenuOptions>
</div>
```

**Accessibility Checklist**:

- ✅ `role="listbox"` on content container
- ✅ `role="searchbox"` on search input (already in InputDropmenuSearch)
- ✅ `role="option"` on items (already in DropmenuItem)
- ✅ `aria-selected` state on selected options
- ✅ `aria-orientation="vertical"` for vertical list
- ✅ `aria-label` for context when no visible label

**Future Enhancement**: Keyboard navigation (arrow keys, Enter, Escape) noted in Future Considerations section.

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add exports to `src/ui/inputs/index.ts`:
  ```typescript
  export * from './input-dropmenu';
  export * from './input-dropmenu-context';
  ```

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/inputs/input-dropmenu.stories.tsx`
- All size variant stories (SM, MD, LG)
- All template stories (Options, Users, Country, Languages)
- Interactive controls for size, with example options
- Real-world usage examples (Country selector, User picker, etc.)
- Responsive behavior demonstrations

## Step by Step Tasks

### Step 1: Create Context for Size Propagation

- Create `src/ui/inputs/input-dropmenu-context.tsx`
- Define `InputDropmenuSize` type
- Create `InputDropmenuContext` using React.createContext
- Create `InputDropmenuProvider` component
- Create `useInputDropmenuSize` hook with default fallback
- Export all types and hooks

### Step 2: Create Main Component File

- Create `src/ui/inputs/input-dropmenu.tsx`
- Import context provider and hook
- Define `inputDropmenuContentVariants` with CVA
- Implement `InputDropmenu` wrapper component with provider
- Implement `InputDropmenuContent` container with size variants
- Implement `InputDropmenuOptions` scrollable container with custom scrollbar
- Add proper TypeScript types and JSDoc documentation
- Export all components, variants, and types

**Required JSDoc Documentation**:

Each component must have JSDoc comments following this pattern:

````typescript
/**
 * InputDropmenu - A composite dropdown container for form input scenarios.
 *
 * Combines a search input with a scrollable list of selectable options,
 * providing a cohesive user experience for selecting values from a filtered list.
 *
 * Unlike the general-purpose `Dropmenu` component (used for action menus),
 * the InputDropmenu is optimized for selection scenarios in forms.
 *
 * @example
 * ```tsx
 * import {
 *   InputDropmenu,
 *   InputDropmenuContent,
 *   InputDropmenuSearch,
 *   InputDropmenuOptions,
 *   DropmenuItem
 * } from '@/ui';
 *
 * // Basic usage
 * <InputDropmenu size="lg">
 *   <InputDropmenuContent>
 *     <InputDropmenuSearch placeholder="Search countries..." />
 *     <InputDropmenuOptions>
 *       <DropmenuItem label="United States" />
 *       <DropmenuItem label="Canada" />
 *     </InputDropmenuOptions>
 *   </InputDropmenuContent>
 * </InputDropmenu>
 * ```
 */

/**
 * InputDropmenuContent - Container component with size variants.
 *
 * Renders the dropdown content with proper sizing, border, and shadow styling.
 * Receives size from InputDropmenu context.
 *
 * @param props - Component props
 * @param props.children - Content to render (search and options)
 * @param props.className - Additional CSS classes
 */

/**
 * InputDropmenuOptions - Scrollable container for option items.
 *
 * Provides a scrollable area with custom scrollbar styling for the options list.
 *
 * @param props - Component props
 * @param props.children - DropmenuItem components to render
 * @param props.className - Additional CSS classes
 */
````

### Step 3: Create Comprehensive Unit Tests

- Create `src/ui/inputs/__tests__/input-dropmenu.test.tsx`
- Test `InputDropmenu` renders without crashing
- Test size context propagation works correctly
- Test `InputDropmenuContent` applies correct size classes
- Test `InputDropmenuOptions` renders children correctly
- Test scrollbar styling is applied
- Test accessibility attributes (role, aria-\*)
- Test integration with `InputDropmenuSearch` and `DropmenuItem`
- Aim for >90% coverage

### Step 4: Create Storybook Stories (REQUIRED & NON-NEGOTIABLE)

- Create `src/stories/inputs/input-dropmenu.stories.tsx`
- Configure meta with comprehensive argTypes
- Create `Default` story with basic usage
- Create `SizeSmall`, `SizeMedium`, `SizeLarge` stories
- Create `TemplateOptions`, `TemplateUsers`, `TemplateCountry`, `TemplateLanguages` stories
- Create `WithSelectedItem`, `WithMultipleSelected`, `WithDisabledItems` stories
- Create `CountrySelectorExample`, `UserSelectorExample`, `LanguageSelectorExample` real-world examples
- Create `AllSizes`, `AllTemplates` comparison stories
- Add interactive controls for all configurable props

### Step 5: Update Barrel Exports

- Update `src/ui/inputs/index.ts` to export:
  - `export * from './input-dropmenu';`
  - `export * from './input-dropmenu-context';`
- Verify exports work correctly with test import

### Step 6: Run Validation Commands

- Execute all validation commands in order
- Fix any issues that arise
- Ensure all tests pass
- Verify Storybook builds successfully

## Testing Strategy

### Unit Tests

1. **Context Tests**
   - Provider provides correct default size
   - Children receive size from context
   - Hook throws error outside provider (or returns default)

2. **InputDropmenu Tests**
   - Renders children within provider
   - Accepts className prop
   - Forwards ref correctly

3. **InputDropmenuContent Tests**
   - Applies correct size classes for each variant
   - Uses context size when prop not provided
   - Prop size overrides context size
   - Has correct accessibility attributes

4. **InputDropmenuOptions Tests**
   - Renders children correctly
   - Has overflow-auto for scrolling
   - Custom scrollbar classes applied

5. **Integration Tests**
   - Full composition with InputDropmenuSearch and DropmenuItem
   - Size propagates to child components correctly

### Edge Cases

1. **Empty options list** - Should render empty container gracefully
2. **Single option** - Should not show scrollbar
3. **Many options** - Should show scrollbar with correct styling
4. **Very long option text** - Should truncate with ellipsis
5. **No search input** - Should work without InputDropmenuSearch
6. **Custom content** - Should accept arbitrary children

## Acceptance Criteria

### Functional Requirements

- ✅ `InputDropmenu` provides size context to all children
- ✅ `InputDropmenuContent` renders with correct dimensions for each size (SM: 240px, MD: 288px, LG: 344px)
- ✅ `InputDropmenuOptions` is scrollable with custom styled scrollbar
- ✅ Component composes correctly with `InputDropmenuSearch` and `DropmenuItem`
- ✅ Size context propagates to child components
- ✅ Component forwards refs correctly
- ✅ Component follows CVA patterns established in codebase

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested (empty, single, many options)
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/input-dropmenu.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **ALL size variant stories implemented (SM, MD, LG)**
- ✅ **ALL template stories implemented (Options, Users, Country, Languages)**
- ✅ **State stories implemented (selected, multi-select, disabled)**
- ✅ **Real-world examples (minimum 3 practical usage scenarios)**
- ✅ **Comparison stories showing all sizes and templates together**
- ✅ **Interactive controls configured for size prop**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { InputDropmenu } from '@/ui'`

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

3. **Run component tests**: `npm test -- input-dropmenu`
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

### Design System Alignment

- This component follows the same composite pattern as `Dropmenu` but is specialized for input scenarios
- The context-based size propagation ensures consistent sizing without prop drilling
- The scrollbar styling matches Figma design specifications

### Future Considerations

1. **Keyboard Navigation**: Future enhancement to add arrow key navigation through options
2. **Virtual Scrolling**: For very long lists (100+ items), consider react-window integration
3. **Loading State**: Add skeleton loading state for async option loading
4. **Empty State**: Add configurable empty state message when no options match search

### Relationship to Other Components

| Component             | Purpose                     | Used In                         |
| --------------------- | --------------------------- | ------------------------------- |
| `InputDropmenu`       | Container with size context | Select, Combobox, Autocomplete  |
| `Dropmenu`            | Action menu container       | Context menus, Action dropdowns |
| `InputDropmenuSearch` | Search input molecule       | InputDropmenu                   |
| `DropmenuItem`        | Selectable option molecule  | InputDropmenu                   |
| `DropmenuOption`      | Action option molecule      | Dropmenu                        |
