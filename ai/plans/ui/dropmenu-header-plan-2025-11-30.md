# Ui: DropmenuHeader

## Component Description

The DropmenuHeader component is a header element designed for use within dropdown menus. It provides a simple, consistent way to display section headers within dropdown lists, helping users understand the context or grouping of menu items. The component displays a label text with appropriate typography styling and spacing, supporting two size variants (SM and MD) to match the overall dropdown menu size.

## User Story

As a user
I want to see clearly labeled sections within dropdown menus
So that I can quickly understand and navigate grouped options

## Problem Statement

Dropdown menus often contain grouped items that need visual separation and context. Without proper section headers, users may struggle to understand the organization of menu items or miss important groupings, leading to confusion and slower navigation.

## Solution Statement

Create a simple, reusable DropmenuHeader component that renders a styled label within dropdown menus. The component will support two size variants (SM and MD) with appropriate typography and padding to integrate seamlessly with dropdown menu implementations.

## Atomic Design Classification

**Component Type**: Atom

**Reasoning**: The DropmenuHeader is a fundamental, single-purpose UI element that displays styled text. It does not contain any other components and serves as a basic building block. While it's designed to be used within dropdown menus (organisms), the component itself is simple text presentation without composition requirements.

**Composition Requirements**:

- **Status**: ✅ Base atom - no composition dependencies

The component uses only native HTML elements (`div`, `p`) with Tailwind CSS styling. It does not require other UI components from the design system.

## Component Location

**Location**: `src/ui/dropmenus/dropmenu-header.tsx`

**Category**: `dropmenus` - A new category for dropdown menu related components

**Reasoning**: This component is specifically designed for dropdown menu contexts. Creating a dedicated `dropmenus` category allows for future expansion with related components (DropmenuItem, DropmenuSeparator, Dropmenu container) while maintaining clear organizational structure. This follows the pattern established for other component categories like `buttons`, `inputs`, and `typography`.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/dropmenus/dropmenu-header.tsx
export { DropmenuHeader, dropmenuHeaderVariants };
export type { DropmenuHeaderProps };

// 2. Create category barrel: src/ui/dropmenus/index.ts
export * from './dropmenu-header';

// 3. Update root barrel: src/ui/index.ts
export * from './dropmenus';

// 4. Import usage (recommended):
import { DropmenuHeader } from '@/ui';

// 5. Import usage (alternative):
import { DropmenuHeader } from '@/ui/dropmenus';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/typography/text.tsx`** - Reference for typography patterns, CVA setup, and text size/weight variants
- **`src/ui/inputs/input-label.tsx`** - Reference for similar label component structure with size variants
- **`src/stories/inputs/input-label.stories.tsx`** - Reference for Storybook story structure, argTypes configuration, and comprehensive story examples
- **`src/ui/inputs/hint.tsx`** - Reference for simple text display component patterns
- **`.claude/rules/styling-guidelines.md`** - Design token system and Tailwind CSS 4 patterns

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/dropmenus/dropmenu-header.tsx` (REQUIRED)
2. **Test file**: `src/ui/dropmenus/__tests__/dropmenu-header.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/dropmenus/dropmenu-header.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
4. **Category barrel**: `src/ui/dropmenus/index.ts` (REQUIRED - new category)
5. **Update root barrel**: `src/ui/index.ts` (REQUIRED - add dropmenus export)

⚠️ All files above are mandatory deliverables.

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Not Required - Component width is determined by parent dropdown container
- **Tablet (md: 768px - 1023px)**: Not Required - Same as desktop
- **Mobile (< 768px)**: Not Required - Same styling, width adapts to parent

The component is inherently responsive as it uses relative units and percentage widths. No breakpoint-specific styles needed.

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2439-181582&m=dev
- Screenshot: Provided showing MD and SM variants with "Header" label

**Design Specifications from Figma**:

| Property           | Size=MD                       | Size=SM                       |
| ------------------ | ----------------------------- | ----------------------------- |
| Container width    | 200px (default, flexible)     | 200px (default, flexible)     |
| Padding top        | 16px                          | 12px                          |
| Padding horizontal | 16px                          | 12px                          |
| Padding bottom     | 0                             | 0                             |
| Font family        | Inter                         | Inter                         |
| Font weight        | Medium (500)                  | Medium (500)                  |
| Font size          | 14px                          | 12px                          |
| Line height        | 20px                          | 18px                          |
| Text color         | text-base-secondary (#697177) | text-base-secondary (#697177) |

**Color Token Mapping**:

- `#697177` (text-base-secondary) → `text-text-secondary` in the design system

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/dropmenus/dropmenu-header.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic component usage with MD size and "Header" label
2. **Sizes Story**: Comparison of SM and MD size variants side by side
3. **Custom Labels Story**: Examples with different label text lengths
4. **In Dropdown Context Story**: Component shown within a simulated dropdown container
5. **All Variants Story**: Grid showing all size variants with various labels

**Story Requirements**:

- Use `satisfies Meta<typeof DropmenuHeader>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: "centered"` for visual consistency
- Create interactive controls for `size` and `label` props
- Include JSDoc-style comments explaining each story's purpose

**Example Structure**:

```typescript
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DropmenuHeader } from '@/ui/dropmenus';

const meta = {
  title: 'Dropmenus/DropmenuHeader',
  component: DropmenuHeader,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant affecting padding and typography',
      table: { defaultValue: { summary: 'md' } },
    },
    label: {
      control: 'text',
      description: 'Header label text',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof DropmenuHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Header' },
};
```

**Why Storybook Stories are Critical**:

- **Visual Documentation**: Stories serve as living documentation showing how the component works in dropdown contexts
- **Design Review**: Enables designers to verify component matches Figma specifications
- **Development Testing**: Developers can test component in isolation during development
- **Quality Assurance**: QA can verify all size variants and edge cases visually
- **Regression Prevention**: Visual changes are immediately visible when components are modified

⚠️ **A component without Storybook stories is considered incomplete and will not be accepted.**

## Implementation Plan

### Phase 1: Foundation

1. Create the `src/ui/dropmenus/` directory structure
2. Create the category barrel file `src/ui/dropmenus/index.ts`
3. Update the root barrel `src/ui/index.ts` to export dropmenus

### Phase 2: Core Implementation

1. Implement the `DropmenuHeader` component with:
   - CVA variants for size (sm, md)
   - Proper TypeScript types and props interface
   - forwardRef for ref forwarding
   - Appropriate default values
2. Create comprehensive unit tests covering:
   - Rendering with default props
   - Size variant styling
   - Custom labels
   - Custom className support
   - Ref forwarding
   - Accessibility requirements

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Component exported from `src/ui/dropmenus/dropmenu-header.tsx`
- Re-exported through `src/ui/dropmenus/index.ts`
- Re-exported through `src/ui/index.ts`

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/dropmenus/dropmenu-header.stories.tsx`
- All size variant stories (SM, MD)
- Interactive controls and argTypes configuration
- Real-world usage examples demonstrating dropdown context
- Visual comparison grid of all variants

## Step by Step Tasks

### Step 1: Create Directory Structure

- Create `src/ui/dropmenus/` directory
- Create `src/ui/dropmenus/__tests__/` directory
- Create `src/stories/dropmenus/` directory

### Step 2: Create Category Barrel File

- Create `src/ui/dropmenus/index.ts` with initial export placeholder
- This will be updated after component creation

### Step 3: Update Root Barrel

- Add `export * from './dropmenus';` to `src/ui/index.ts`

### Step 4: Implement DropmenuHeader Component

- Create `src/ui/dropmenus/dropmenu-header.tsx`
- Implement CVA variants for size (sm, md)
- Define TypeScript interface `DropmenuHeaderProps`
- Use forwardRef for ref forwarding
- Apply design specifications:
  - MD: pt-4 px-4, text-sm leading-5 font-medium text-text-secondary
  - SM: pt-3 px-3, text-xs leading-[18px] font-medium text-text-secondary
- Export component, variants, and types

### Step 5: Update Category Barrel

- Update `src/ui/dropmenus/index.ts` to export from dropmenu-header

### Step 6: Create Unit Tests

- Create `src/ui/dropmenus/__tests__/dropmenu-header.test.tsx`
- Test cases:
  - Renders with default props (MD size)
  - Renders with SM size
  - Applies custom label text
  - Applies custom className
  - Forwards ref correctly
  - Has correct accessibility attributes (role, aria)
  - Applies correct styling for each size

### Step 7: Create Storybook Stories

- Create `src/stories/dropmenus/dropmenu-header.stories.tsx`
- Implement stories:
  - Default: MD size with "Header" label
  - Sizes: Comparison of SM and MD
  - CustomLabels: Various label text examples
  - InDropdownContext: Simulated dropdown container
  - AllVariants: Grid comparison

### Step 8: Run Validation Commands

- Execute all validation commands to verify implementation
- Fix any errors or warnings
- Ensure all tests pass with >90% coverage

## Testing Strategy

### Unit Tests

1. **Rendering Tests**
   - Component renders without errors
   - Displays label text correctly
   - Applies default MD size when no size prop provided

2. **Size Variant Tests**
   - MD size applies correct padding (pt-4 px-4)
   - MD size applies correct typography (text-sm leading-5)
   - SM size applies correct padding (pt-3 px-3)
   - SM size applies correct typography (text-xs leading-[18px])

3. **Props Tests**
   - Custom label prop renders correctly
   - Custom className is merged with base styles
   - All props are passed through correctly

4. **Ref Forwarding Tests**
   - Ref is forwarded to the root element
   - Ref provides access to DOM element

5. **Accessibility Tests**
   - Component has appropriate semantic structure
   - Text is readable by screen readers

### Edge Cases

- Empty label string
- Very long label text (truncation behavior)
- Special characters in label
- Custom className overriding base styles

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/dropmenus/` with proper TypeScript types
- ✅ Both size variants (SM, MD) work correctly
- ✅ Component forwards refs correctly
- ✅ Component follows design system patterns (CVA, semantic tokens)
- ✅ Default size is MD when no size prop provided

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/dropmenus/dropmenu-header.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **ALL size variant stories implemented (SM, MD)**
- ✅ **Real-world examples (minimum 2-3 practical usage scenarios)**
- ✅ **Comparison story showing all variants together**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/dropmenus/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { DropmenuHeader } from '@/ui'`

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

3. **Run component tests**: `npm test -- dropmenu-header`
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

- **New Category**: This plan creates a new `dropmenus` category in the UI component library. This category can be expanded with related components like `DropmenuItem`, `DropmenuSeparator`, `DropmenuGroup`, etc.

- **Width Behavior**: The component uses `w-[200px]` in the Figma design, but this should be flexible in implementation. Consider using `w-full` or allowing width to be controlled by the parent dropdown container.

- **Color Token**: The design uses `#697177` for text color, which maps to `text-text-secondary` in the design system's semantic color tokens.

- **Future Integration**: This component is designed to work with Radix UI's DropdownMenu primitive. When creating higher-level dropdown components, the DropmenuHeader can be used with `DropdownMenu.Label` for proper accessibility.

- **No New Dependencies**: This component does not require any new npm packages. It uses existing project dependencies (CVA, cn utility).
