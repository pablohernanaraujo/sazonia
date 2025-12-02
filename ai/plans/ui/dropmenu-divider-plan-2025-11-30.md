# Ui: Dropmenu Divider

## Component Description

The Dropmenu Divider is a visual separator component designed specifically for use within dropdown menus and similar contexts. It provides a subtle horizontal line that visually separates groups of menu items, helping users quickly scan and understand the organization of menu options. The component consists of a 1px horizontal line with a light tertiary fill color (`#ebedef`) centered within a container that includes vertical padding for proper spacing.

## User Story

As a **user navigating dropdown menus**
I want to **see clear visual separations between groups of menu items**
So that **I can quickly understand the menu structure and find related options grouped together**

## Problem Statement

Dropdown menus often contain multiple groups of related actions (e.g., "Edit", "Copy", "Paste" in one group and "Delete" in another). Without visual separators, users must rely solely on reading each item to understand the menu organization. This increases cognitive load and slows down navigation.

## Solution Statement

Create a simple, accessible Dropmenu Divider component that renders a horizontal line with appropriate spacing. The component will be lightweight, use semantic colors from the design system, and follow existing project patterns for consistency. It will be placed in a new `dropmenus` category to house future dropdown-related components.

## Atomic Design Classification

**Component Type**: Atom

**Reasoning**: The Dropmenu Divider is a fundamental building block with no internal logic or composed children. It is purely presentational - a simple horizontal line with styling. It cannot be broken down further and will be used to compose higher-level molecules and organisms like dropdown menus, context menus, and similar navigation components.

**Composition Requirements**:

- **Status**: Base atom - no composition dependencies

The component is purely CSS-based and does not require any lower-level components. It renders a simple `<div>` element styled as a horizontal separator.

## Component Location

**Location**: `src/ui/dropmenus/dropmenu-divider.tsx`

**Category**: `dropmenus`

**Reasoning**: This component is specifically designed for dropdown menu contexts. Creating a dedicated `dropmenus` category allows for future expansion with related components (e.g., DropmenuItem, DropmenuHeader, DropmenuContent) while keeping the design system organized by context/purpose.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/dropmenus/dropmenu-divider.tsx
export { DropmenuDivider };
export type { DropmenuDividerProps };

// 2. Create category barrel: src/ui/dropmenus/index.ts
export * from './dropmenu-divider';

// 3. Update root barrel: src/ui/index.ts
export * from './dropmenus';

// 4. Import usage (recommended):
import { DropmenuDivider } from '@/ui';

// 5. Import usage (alternative):
import { DropmenuDivider } from '@/ui/dropmenus';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/inputs/hint.tsx`** - Reference for simple atom component pattern with forwardRef, TypeScript types, and cn() usage
- **`src/ui/inputs/__tests__/hint.test.tsx`** - Reference for comprehensive test patterns including ref forwarding, props passthrough, and accessibility
- **`src/stories/inputs/hint.stories.tsx`** - Reference for story structure with autodocs, argTypes, and multiple story variants
- **`src/app/globals.css`** - Contains design tokens including `--color-fill-tertiary: #ebedef` which matches the Figma divider line color
- **`.claude/rules/styling-guidelines.md`** - Styling patterns and design system usage

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/dropmenus/dropmenu-divider.tsx` (REQUIRED)
2. **Test file**: `src/ui/dropmenus/__tests__/dropmenu-divider.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/dropmenus/dropmenu-divider.stories.tsx` (REQUIRED)
4. **Category barrel**: `src/ui/dropmenus/index.ts` (REQUIRED - new category)
5. **Update root barrel**: `src/ui/index.ts` (add export for dropmenus)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: No specific desktop styles needed - component is context-agnostic
- **Tablet (md: 768px - 1023px)**: No specific tablet styles needed
- **Mobile (< 768px)**: No specific mobile styles needed

The component inherits its width from its parent container and has no responsive behavior requirements.

### Design Assets

**Status**: Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2439-184729&m=dev
- Screenshot: Visual shows a thin horizontal line (1px height) with subtle gray color

**Design Specifications from Figma**:

| Property             | Value                               | Notes                                |
| -------------------- | ----------------------------------- | ------------------------------------ |
| Container Width      | `240px` (default)                   | Inherits from parent in actual usage |
| Container Padding    | `2px` vertical                      | Creates spacing above and below line |
| Container Background | `#ffffff` (bg-surface-base-primary) | Maps to `bg-background`              |
| Line Height          | `1px`                               | The actual divider line              |
| Line Color           | `#ebedef` (bg-fill-base-tertiary)   | Maps to `bg-fill-tertiary`           |
| Line Width           | `100%`                              | Full width of container              |

**Implementation Notes**:

- The Figma uses a rotated approach for the line, but we'll simplify this to a straightforward 1px height div with full width
- The container provides 2px padding on top and bottom for spacing
- Background colors use semantic tokens from the design system

## Storybook Stories

**Required**: Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/dropmenus/dropmenu-divider.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic divider with default width
2. **Width Variations**: Show divider in different container widths (160px, 240px, 320px)
3. **In Menu Context**: Real-world example showing divider between menu items
4. **Multiple Dividers**: Show multiple dividers separating groups
5. **Custom Styling**: Demonstrate className customization
6. **Dark Background**: Show divider on dark background to verify visibility

**Story Requirements**:

- Use `satisfies Meta<typeof DropmenuDivider>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define `argTypes` with descriptions for className prop
- Set `parameters.layout: 'centered'`
- Include JSDoc-style comments explaining each story's purpose

**Example Structure**:

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DropmenuDivider } from "@/ui/dropmenus";

const meta = {
  title: "Dropmenus/DropmenuDivider",
  component: DropmenuDivider,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    className: {
      description: "Additional CSS classes for customization",
      control: "text",
    },
  },
} satisfies Meta<typeof DropmenuDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-60">
      <DropmenuDivider />
    </div>
  ),
};
```

## Implementation Plan

### Phase 1: Foundation

1. Create the `src/ui/dropmenus/` directory structure
2. Create the category barrel file `src/ui/dropmenus/index.ts`
3. Update root barrel `src/ui/index.ts` to export from dropmenus

### Phase 2: Core Implementation

1. Create `dropmenu-divider.tsx` with:
   - TypeScript interface for props (className only, plus HTML div attributes)
   - forwardRef for ref forwarding
   - Simple div structure with semantic Tailwind classes
   - cn() for className merging

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Export component and types from `src/ui/dropmenus/index.ts`
- Add `export * from './dropmenus';` to `src/ui/index.ts`

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/dropmenus/dropmenu-divider.stories.tsx`
- Stories to create:
  - Default - basic usage
  - WidthVariations - different container widths
  - InMenuContext - realistic dropdown menu usage
  - MultipleDividers - showing grouping pattern
  - CustomStyling - className override example
  - DarkBackground - visibility verification

## Step by Step Tasks

### Step 1: Create Directory Structure

- Create directory `src/ui/dropmenus/`
- Create directory `src/ui/dropmenus/__tests__/`
- Create directory `src/stories/dropmenus/`

### Step 2: Create Category Barrel File

Create `src/ui/dropmenus/index.ts`:

```typescript
export * from './dropmenu-divider';
```

### Step 3: Update Root Barrel

Update `src/ui/index.ts` to add:

```typescript
export * from './dropmenus';
```

### Step 4: Implement Component

Create `src/ui/dropmenus/dropmenu-divider.tsx` with:

- `DropmenuDividerProps` interface extending `ComponentPropsWithoutRef<'div'>`
- `DropmenuDivider` component using `forwardRef`
- Semantic Tailwind classes matching Figma design:
  - Container: `bg-background py-0.5 w-full` (2px = 0.5 in Tailwind's 4px scale)
  - Line: `h-px w-full bg-fill-tertiary`
- Export component and types

### Step 5: Create Unit Tests

Create `src/ui/dropmenus/__tests__/dropmenu-divider.test.tsx` with tests for:

- Default rendering (renders as div with correct structure)
- Styling (verifies correct Tailwind classes applied)
- className merging (custom classes merge correctly)
- Ref forwarding (ref points to outer div)
- Props passthrough (data-testid, aria-\* attributes)
- Accessibility (role="separator" support)

### Step 6: Create Storybook Stories

Create `src/stories/dropmenus/dropmenu-divider.stories.tsx` with:

- Meta configuration with autodocs and argTypes
- Default story
- WidthVariations story
- InMenuContext story (realistic usage)
- MultipleDividers story
- CustomStyling story
- DarkBackground story (on dark container)

### Step 7: Run Validation Commands

Execute all validation commands to ensure zero regressions:

1. `npm run type-check`
2. `npm run lint`
3. `npm test -- dropmenu-divider`
4. `npm run test:run`
5. `npm run build`
6. `npm run build-storybook`

## Testing Strategy

### Unit Tests

| Test Category     | Test Cases                                                             |
| ----------------- | ---------------------------------------------------------------------- |
| Default rendering | Renders as div, contains inner line div, correct structure             |
| Styling           | Container has `bg-background py-0.5`, line has `h-px bg-fill-tertiary` |
| className merging | Custom className merges with defaults via cn()                         |
| Ref forwarding    | Ref attaches to outer container div                                    |
| Props passthrough | data-testid, data-_, aria-_ attributes pass through                    |
| Accessibility     | Supports role="separator" for screen readers                           |

### Edge Cases

- Empty render (component renders correctly with no props)
- Custom width via className override
- Multiple instances on same page
- Integration within a parent flex/grid container

## Acceptance Criteria

### Functional Requirements

- Component implemented in `src/ui/dropmenus/dropmenu-divider.tsx`
- Component renders a 1px horizontal line with `bg-fill-tertiary` color
- Component has 2px vertical padding (py-0.5)
- Component forwards refs correctly
- Component accepts and merges custom className

### Testing Requirements

- Comprehensive unit tests with >90% coverage
- All edge cases tested
- All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- Storybook stories file created: `src/stories/dropmenus/dropmenu-divider.stories.tsx`
- Meta configuration with comprehensive argTypes
- Default story implemented
- Width variation stories implemented
- Real-world menu context example implemented
- Multiple dividers story implemented
- Custom styling story implemented
- Storybook builds successfully: `npm run build-storybook`
- All stories render correctly in Storybook UI

### Integration Requirements

- Exported through category barrel (`src/ui/dropmenus/index.ts`)
- Exported through root barrel (`src/ui/index.ts`)
- Component can be imported via `import { DropmenuDivider } from '@/ui'`

### Code Quality

- Zero TypeScript errors: `npm run type-check`
- Zero ESLint warnings: `npm run lint`
- Build succeeds: `npm run build`

## Validation Commands

Execute EVERY command below. All must pass with zero errors.

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- dropmenu-divider`
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

## Notes

- **Design Token Mapping**: The Figma uses `--context/background/fill/base/tertiary/bg-fill-base-tertiary` which maps to `--color-fill-tertiary: #ebedef` in our design system. Use `bg-fill-tertiary` Tailwind class.
- **Container Background**: The Figma shows `#ffffff` background which maps to `bg-background` in our design system.
- **Simplified Implementation**: The Figma uses a rotated 90-degree line approach, but we simplify this to a straightforward `h-px` (1px height) div with full width.
- **New Category**: This creates the `dropmenus` category which can house future components like DropmenuItem, DropmenuHeader, DropmenuGroup, etc.
- **Accessibility**: Consider adding `role="separator"` by default or as an option for proper screen reader announcement.
- **Future Considerations**: May want to add orientation prop (horizontal/vertical) if vertical dividers are needed in the future.
