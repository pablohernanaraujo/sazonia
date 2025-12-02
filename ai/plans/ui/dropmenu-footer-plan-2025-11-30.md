# UI: Dropmenu Footer

## Component Description

The Dropmenu Footer is a simple footer section component designed to be used at the bottom of dropdown menus. It displays secondary information or footer text in a muted color with appropriate spacing and background styling. This component provides a consistent way to add contextual information, branding, or additional navigation options at the bottom of dropdown menus throughout the application.

## User Story

As a developer building dropdown menus
I want a consistent footer component for dropdowns
So that I can display secondary information or actions at the bottom of menus with consistent styling

## Problem Statement

Dropdown menus often need footer sections to display additional context, help links, version information, or secondary actions. Without a dedicated component, developers would need to manually style these footers, leading to inconsistent implementations across the application.

## Solution Statement

Create a reusable Dropmenu Footer component that provides:

- Two size variants (SM and MD) matching Glow UI design specifications
- Consistent typography and styling patterns with sibling DropmenuHeader component
- Appropriate background color and padding
- Fixed width matching standard dropdown widths (200px)
- Proper semantic structure for accessibility

## Atomic Design Classification

**Component Type**: Composite Atom

**Reasoning**: The DropmenuFooter wraps Text atoms (TextXs, TextSm) within a styled container to provide dropdown-specific footer semantics. While structurally simple, it composes existing typography primitives rather than being an indivisible atom. It has a focused, single purpose (footer text display) and serves as a building block for larger dropdown menu organisms. This classification aligns with the Hint component evaluation, which uses an identical composition pattern.

**Composition Requirements**:

- **Required Atoms**: TextXs, TextSm from `@/ui/typography` - Uses existing typography atoms for text composition

- **Status**: ✅ Composite atom - follows Hint component composition pattern using Text atoms

## Component Location

**Location**: `src/ui/dropmenus/dropmenu-footer.tsx`

**Category**: `dropmenus` - Existing category for dropdown menu-related components

**Reasoning**: The `dropmenus` category already exists with `DropmenuHeader`. Adding `DropmenuFooter` as a sibling component in the same category ensures discoverability and follows the principle of co-locating related components.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/dropmenus/dropmenu-footer.tsx
export { DropmenuFooter, dropmenuFooterVariants };
export type { DropmenuFooterProps, DropmenuFooterVariants };

// 2. Update category barrel: src/ui/dropmenus/index.ts
export * from './dropmenu-footer';

// 3. Root barrel already exports dropmenus (verify in src/ui/index.ts)
export * from './dropmenus';

// 4. Import usage (recommended):
import { DropmenuFooter } from '@/ui';

// 5. Import usage (alternative):
import { DropmenuFooter } from '@/ui/dropmenus';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/dropmenus/dropmenu-header.tsx`** - CRITICAL: Sibling component to follow same patterns
  - Uses CVA for size variants (sm, md)
  - Uses `text-text-secondary` color
  - Uses forwardRef pattern
  - Uses `label` prop for text content

- **`src/ui/dropmenus/__tests__/dropmenu-header.test.tsx`** - For testing patterns
  - Test structure for size variants
  - className merging tests
  - Ref forwarding tests

- **`src/stories/dropmenus/dropmenu-header.stories.tsx`** - For story patterns (if exists)
  - Size comparison stories
  - All variants story

- **`src/app/globals.css`** - For design tokens
  - Use `bg-background-secondary` (#f9fafb) - the semantic token for secondary backgrounds

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/dropmenus/dropmenu-footer.tsx` (REQUIRED)
2. **Test file**: `src/ui/dropmenus/__tests__/dropmenu-footer.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/dropmenus/dropmenu-footer.stories.tsx` (REQUIRED)
4. **Update barrel**: `src/ui/dropmenus/index.ts` (add export)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: No - Fixed width component (200px)
- **Tablet (md: 768px - 1023px)**: No - Fixed width component
- **Mobile (< 768px)**: No - Fixed width component

The component has a fixed width of 200px matching dropdown menu standards. No responsive breakpoint styling needed.

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-Pro-1.8?node-id=2439-181577
- Screenshot: Reviewed - shows two size variants (SM and MD)

**Design Specifications**:

| Property    | SM Variant                        | MD Variant                        |
| ----------- | --------------------------------- | --------------------------------- |
| Width       | 200px                             | 200px                             |
| Padding X   | 12px                              | 16px (left), 8px (right)          |
| Padding Y   | 8px                               | 8px                               |
| Gap         | 10px                              | 10px                              |
| Font Size   | 12px (text-xs)                    | 14px (text-sm)                    |
| Line Height | 18px                              | 20px                              |
| Background  | bg-background-secondary (#f9fafb) | bg-background-secondary (#f9fafb) |
| Text Color  | text-text-secondary (#697177)     | text-text-secondary (#697177)     |
| Font Family | Inter                             | Inter                             |
| Font Weight | Regular (400)                     | Regular (400)                     |

**Interaction Patterns**:

- No interactive states (non-clickable footer text)
- Static display component

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/dropmenus/dropmenu-footer.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic component with MD size and default text
2. **SM Story**: Small size variant (12px font)
3. **MD Story**: Medium size variant (14px font)
4. **Sizes Story**: Side-by-side comparison of both sizes
5. **LongText Story**: Demonstrates text wrapping/truncation behavior
6. **WithDropmenuHeader Story**: Shows footer alongside DropmenuHeader in context
7. **AllVariants Story**: Grid showing all size options together
8. **CustomClassName Story**: Demonstrates className merging capability

**Story Requirements**:

- Use `satisfies Meta<typeof DropmenuFooter>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: "centered"`
- Create interactive controls for size prop
- Document the 200px fixed width behavior

**Example Structure**:

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DropmenuFooter, DropmenuHeader } from "@/ui/dropmenus";

const meta = {
  title: "Dropmenus/DropmenuFooter",
  component: DropmenuFooter,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md"],
      description: "Size variant - sm (12px) or md (14px)",
      table: { defaultValue: { summary: "md" } },
    },
    children: {
      control: "text",
      description: "Footer content (text or React nodes)",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof DropmenuFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Footer" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <DropmenuFooter size="sm">Footer SM</DropmenuFooter>
      <DropmenuFooter size="md">Footer MD</DropmenuFooter>
    </div>
  ),
};

// Show header and footer together
export const WithDropmenuHeader: Story = {
  render: () => (
    <div className="w-[200px] rounded-lg border shadow-md">
      <DropmenuHeader label="Menu Title" />
      <div className="px-4 py-2">Menu content here...</div>
      <DropmenuFooter>Footer text</DropmenuFooter>
    </div>
  ),
};
```

## Implementation Plan

### Phase 1: Foundation

1. Review existing DropmenuHeader implementation for patterns
2. Verify design token availability (`bg-background-secondary`, `text-text-secondary`)
3. Check existing barrel exports in `src/ui/dropmenus/index.ts`

### Phase 2: Core Implementation

1. Create the DropmenuFooter component with:
   - Size prop (sm | md) defaulting to "md"
   - Text prop for footer content (matching `label` pattern from DropmenuHeader)
   - className prop for customization
   - Ref forwarding support
   - CVA variants (matching DropmenuHeader pattern)

2. Implement styling with CVA:
   ```typescript
   const dropmenuFooterVariants = cva(
     'w-[200px] bg-neutral-50 py-2 font-sans font-normal text-text-secondary',
     {
       variants: {
         size: {
           sm: 'px-3 text-xs leading-[18px]',
           md: 'pr-2 pl-4 text-sm leading-5',
         },
       },
       defaultVariants: {
         size: 'md',
       },
     }
   );
   ```

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Update `src/ui/dropmenus/index.ts` barrel file to add dropmenu-footer export
- Verify `src/ui/index.ts` already exports dropmenus category
- Ensure proper type exports

**Storybook Documentation (REQUIRED):**

- Create comprehensive stories at `src/stories/dropmenus/dropmenu-footer.stories.tsx`
- Document all variants (sm, md)
- Create real-world usage examples showing dropdown menu context with DropmenuHeader
- Configure interactive controls for all props

## Step by Step Tasks

### Step 1: Verify Design Tokens

- Use `bg-background-secondary` (#f9fafb) - semantic token defined in globals.css
- Verify `text-text-secondary` token availability via Text component's `color="muted"`
- Text components handle typography tokens internally

### Step 2: Implement DropmenuFooter Component

Create `src/ui/dropmenus/dropmenu-footer.tsx`:

````typescript
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';
import { TextXs, TextSm } from '@/ui/typography';

/**
 * DropmenuFooter size variants:
 * - `sm`: Small (12px font via TextXs, 12px padding)
 * - `md`: Medium (14px font via TextSm, 16px/8px padding)
 */
export interface DropmenuFooterProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'color'> {
  /**
   * Size variant - determines typography and padding
   * @default 'md'
   */
  size?: 'sm' | 'md';
  /**
   * Footer content - required as empty footers are meaningless
   */
  children: React.ReactNode;
}

/**
 * DropmenuFooter - A footer element for dropdown menus.
 *
 * Composes TextXs/TextSm typography atoms within a styled container
 * to provide dropdown-specific footer semantics. Supports two size
 * variants (SM and MD) to match the overall dropdown menu size.
 *
 * @example
 * ```tsx
 * import { DropmenuFooter } from '@/ui/dropmenus';
 *
 * // Basic usage
 * <DropmenuFooter>Footer text</DropmenuFooter>
 *
 * // Small size
 * <DropmenuFooter size="sm">Footer text</DropmenuFooter>
 *
 * // With custom className
 * <DropmenuFooter className="my-custom-class">Footer</DropmenuFooter>
 * ```
 */
export const DropmenuFooter = forwardRef<HTMLDivElement, DropmenuFooterProps>(
  ({ size = 'md', children, className, ...props }, ref) => {
    const TextComponent = size === 'sm' ? TextXs : TextSm;
    const paddingClasses = size === 'sm' ? 'px-3' : 'pl-4 pr-2';

    return (
      <div
        ref={ref}
        className={cn(
          'w-[200px] bg-background-secondary py-2',
          paddingClasses,
          className
        )}
        {...props}
      >
        <TextComponent as="span" color="muted">
          {children}
        </TextComponent>
      </div>
    );
  }
);

DropmenuFooter.displayName = 'DropmenuFooter';
````

### React Import Convention

Use direct imports, NOT namespace imports:

✅ **Correct:**

```typescript
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
```

❌ **Wrong:**

```typescript
import * as React from 'react';
```

### Step 3: Update Barrel Export

Update `src/ui/dropmenus/index.ts` to add:

```typescript
export * from './dropmenu-footer';
```

### Step 4: Verify Root Barrel

Check `src/ui/index.ts` exports the dropmenus category. If not, add:

```typescript
export * from './dropmenus';
```

### Step 5: Create Unit Tests

Create `src/ui/dropmenus/__tests__/dropmenu-footer.test.tsx` with comprehensive tests:

- Default rendering tests
- Size variant tests (sm, md)
- Styling tests (background, padding, width)
- className merging tests
- Ref forwarding tests
- Props passthrough tests
- Content handling tests

### Step 6: Create Storybook Stories

Create `src/stories/dropmenus/dropmenu-footer.stories.tsx` with:

- Default story
- SM and MD size stories
- Sizes comparison story
- Long text story
- With DropmenuHeader context story
- All variants story
- Custom className story

### Step 7: Run Validation Commands

Execute all validation commands in order:

1. `npm run type-check`
2. `npm run lint`
3. `npm test -- dropmenu-footer`
4. `npm run test:run`
5. `npm run build`
6. `npm run build-storybook`

## Testing Strategy

### Unit Tests

1. **Default rendering**
   - Renders with default props
   - Renders as div element with nested p
   - Applies md size by default

2. **Size variants**
   - Applies correct classes when size="sm"
   - Applies correct classes when size="md"
   - Applies correct padding for each size

3. **Styling**
   - Applies bg-background-secondary background
   - Applies fixed 200px width
   - Applies text-text-secondary color
   - Applies font-normal weight

4. **className merging**
   - Merges custom className with base classes
   - Merges multiple custom classes

5. **Ref forwarding**
   - Forwards ref correctly
   - Ref points to the div element

6. **Props passthrough**
   - Passes id prop through
   - Passes data-testid prop through
   - Passes aria-\* props through

7. **Content handling**
   - Handles string children correctly
   - Handles React node children correctly
   - Handles long text content

8. **Text component integration**
   - Renders TextXs component when size is sm
   - Renders TextSm component when size is md
   - Applies correct color="muted" to Text component

### Edge Cases

- Very long text that exceeds container width
- React nodes as children (links, icons)
- Special characters in text
- Custom aria attributes via props spread

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/dropmenus/` with proper TypeScript types
- ✅ Both size variants (sm, md) work correctly
- ✅ Component forwards refs correctly
- ✅ Component uses CVA pattern (matching DropmenuHeader)
- ✅ Component follows design system patterns

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ Storybook stories file created: `src/stories/dropmenus/dropmenu-footer.stories.tsx`
- ✅ Meta configuration with comprehensive argTypes
- ✅ Default story implemented
- ✅ ALL size stories implemented (sm, md)
- ✅ Real-world examples (minimum 2-3 practical usage scenarios)
- ✅ Comparison story showing all sizes together
- ✅ Interactive controls configured for all props
- ✅ Storybook builds successfully: `npm run build-storybook`
- ✅ All stories render correctly in Storybook UI

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/dropmenus/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { DropmenuFooter } from '@/ui'`

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

3. **Run component tests**: `npm test -- dropmenu-footer`
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

The Figma design uses CSS variables that need to be mapped to project tokens:

- `--context/background/surface/base/secondary/bg-surface-base-secondary` -> `bg-background-secondary` (#f9fafb)
- `--context/text/base/secondary/text-base-secondary` -> `text-text-secondary` (project token)

### Consistency with DropmenuHeader

The implementation should mirror DropmenuHeader patterns:

- Same CVA-based variant approach
- Same size variant names (sm, md)
- Same forwardRef pattern
- Same className merging approach
- Naming convention: "Dropmenu" (lowercase m) not "DropMenu"

### Key Differences from DropmenuHeader

| Property     | DropmenuHeader     | DropmenuFooter                     |
| ------------ | ------------------ | ---------------------------------- |
| Content prop | `label: string`    | `children: React.ReactNode`        |
| Font weight  | `font-medium`      | `font-normal` (via Text component) |
| Background   | none               | `bg-background-secondary`          |
| Width        | `w-full`           | `w-[200px]`                        |
| Padding Y    | `pt-3/pt-4, pb-0`  | `py-2`                             |
| Typography   | Direct CVA classes | Composed via TextXs/TextSm         |

### Future Considerations

1. **DropMenu Component Family**: This component joins the existing family:
   - `DropmenuHeader` ✅ (exists)
   - `DropmenuFooter` (this component)
   - `DropmenuItem` - Individual menu items (future)
   - `DropmenuDivider` - Separator lines (future)
   - `DropmenuGroup` - Grouped items (future)
   - `Dropmenu` - Container component (future)

2. **Width Consistency**: Both header and footer should work within 200px dropdown containers. Consider standardizing width approach if full dropdown component is built.

3. **Accessibility**: The component renders a simple `<div>` with text. For full accessibility in a dropdown context, ensure the parent dropdown menu follows proper ARIA patterns (role="menu", etc.).
