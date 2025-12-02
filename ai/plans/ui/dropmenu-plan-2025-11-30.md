# Ui: Dropmenu

**Architectural Evaluation Score: 9.2/10** ✅ APPROVED FOR IMPLEMENTATION

## Component Description

The Dropmenu component is a composite dropdown menu container that orchestrates its atomic sub-components (DropmenuHeader, DropmenuOption, DropmenuFooter, DropmenuDivider) into a cohesive, reusable dropdown panel. It provides a structured container with consistent styling (border, shadow, rounded corners) and handles the layout arrangement of menu sections.

The component supports three size variants (SM, MD, LG) that propagate to all child components, ensuring visual consistency across the entire dropdown. It serves as the main building block for contextual menus, action menus, user profile dropdowns, and settings panels throughout the application.

## User Story

As a developer
I want to use a pre-configured dropdown menu container
So that I can quickly build consistent dropdown menus without manually composing sub-components and styling the container

## Problem Statement

Currently, the codebase has individual atomic components for dropdown menus (DropmenuHeader, DropmenuOption, DropmenuFooter, DropmenuDivider) but lacks a composite container component that:

1. Provides consistent container styling (border, shadow, rounded corners)
2. Propagates size variants to all children automatically
3. Handles proper layout and spacing between sections
4. Offers a simple API for common dropdown patterns (default list, action menu, share menu, user profile menu)

Developers must manually wrap these atoms in a styled container, leading to inconsistent implementations across the codebase.

## Solution Statement

Create a Dropmenu organism component that:

1. Composes existing DropmenuHeader, DropmenuOption, DropmenuFooter, and DropmenuDivider atoms
2. Provides a consistent container with border, shadow, and rounded corners
3. Supports three size variants (SM, MD, LG) that propagate to children via React context
4. Uses the compound component pattern for flexible content composition
5. Is fully accessible with proper ARIA roles (menu, menuitem)

## Atomic Design Classification

**Component Type**: Organism

**Reasoning**: The Dropmenu is an organism because it:

1. Composes multiple molecules and atoms (DropmenuHeader, DropmenuOption, DropmenuFooter, DropmenuDivider) into a complete, functional unit
2. Provides a specific UI pattern (dropdown menu) that can be reused across different parts of the application
3. Has its own visual identity and behavior beyond its constituent parts
4. Manages the coordination and layout of its child components

**Composition Requirements**:

- **Required Atoms**:
  - `DropmenuHeader` from `@/ui/dropmenus/dropmenu-header` - Section headers
  - `DropmenuOption` from `@/ui/dropmenus/dropmenu-option` - Menu items
  - `DropmenuFooter` from `@/ui/dropmenus/dropmenu-footer` - Footer section
  - `DropmenuDivider` from `@/ui/dropmenus/dropmenu-divider` - Visual separators
  - Typography atoms (`TextSm`, `TextXs`) via composed components

## Component Location

**Location**: `src/ui/dropmenus/dropmenu.tsx`

**Category**: `dropmenus`

**Reasoning**: The component belongs in the existing `dropmenus` category alongside its atomic sub-components. This maintains a clear organizational structure where all dropdown-related components are co-located.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/dropmenus/dropmenu.tsx
export { Dropmenu, DropmenuContent, dropmenuVariants };
export type { DropmenuProps, DropmenuContentProps };

// 2. Update category barrel: src/ui/dropmenus/index.ts
export * from './dropmenu';

// 3. Import usage (recommended):
import { Dropmenu, DropmenuContent } from '@/ui';

// 4. Import usage (alternative):
import { Dropmenu, DropmenuContent } from '@/ui/dropmenus';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/dropmenus/dropmenu-header.tsx`** - Header atom to compose within Dropmenu
  - Provides section headers with size variants (sm, md)
  - Uses CVA for variant styling

- **`src/ui/dropmenus/dropmenu-option.tsx`** - Option atom to compose within Dropmenu
  - Menu item with left/right add-ons, size variants (sm, md, lg)
  - Handles interactive states (hover, pressed, focus, disabled)

- **`src/ui/dropmenus/dropmenu-footer.tsx`** - Footer atom to compose within Dropmenu
  - Footer section with size variants (sm, md)
  - Uses Typography atoms internally

- **`src/ui/dropmenus/dropmenu-divider.tsx`** - Divider atom for visual separation
  - Simple 1px horizontal line

- **`src/ui/dropmenus/index.ts`** - Barrel export file to update

- **`src/stories/dropmenus/dropmenu-option.stories.tsx`** - Reference for story patterns
  - Comprehensive examples including ActionMenuExample, SettingsMenuExample, UserMenuExample

- **`src/ui/buttons/button.tsx`** - Reference for CVA patterns and compound components

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/dropmenus/dropmenu.tsx` (REQUIRED)
2. **Test file**: `src/ui/dropmenus/__tests__/dropmenu.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/dropmenus/dropmenu.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required - Full functionality
- **Tablet (md: 768px - 1023px)**: Required - Same as desktop
- **Mobile (< 768px)**: Required - Same as desktop (dropdown menus are typically triggered by touch)

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2439-187664&m=dev
- Screenshot: Captured from Figma showing all size variants and template types

**Design Specifications**:

#### Container Styling

- Background: `bg-background` (white #ffffff)
- Border: 1px solid `border-secondary` (#e6e8eb)
- Border radius: `rounded-sm` (6px)
- Shadow: `shadow-lg` for dropdown effect
- Overflow: `overflow-clip` with `rounded-[inherit]` for inner content

#### Size Variants

Based on Figma analysis:

| Size | Container Width | Header Padding | Option Padding | Footer Padding |
| ---- | --------------- | -------------- | -------------- | -------------- |
| SM   | 220px           | 12px           | 12px h, 6px v  | 12px h, 8px v  |
| MD   | 240px           | 12px           | 12px h, 10px v | 12px h, 8px v  |
| LG   | 260px           | 16px           | 16px h, 12px v | 16px h, 8px v  |

#### Typography

- Header: Medium weight, secondary color
  - SM/MD: 12px/18px (TextXs)
  - LG: 14px/20px (TextSm)
- Option label: Regular weight, primary color
  - SM/MD: 14px/20px (TextSm)
  - LG: 16px/24px (TextMd)
- Footer: Regular weight, secondary color
  - SM/MD: 12px/18px (TextXs)
  - LG: 14px/20px (TextSm)

#### Templates from Figma

1. **Default list** - Header + multiple options + Footer
2. **Share** - Header ("Share") + social options (Facebook, Twitter, Telegram, Copy link)
3. **Message Action** - Options only (Response, Copy text, Forward, Select, Delete)
4. **Actions** - Options with icons + shortcuts + dividers
5. **Avatar Menu** - User profile section + navigation + settings + logout

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/dropmenus/dropmenu.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic Dropmenu with header, options, and footer
2. **Size Stories**:
   - `SizeSmall` - SM variant (220px width)
   - `SizeMedium` - MD variant (240px width)
   - `SizeLarge` - LG variant (260px width, default)
3. **Template Stories**:
   - `DefaultListTemplate` - Header + options + footer
   - `ShareMenuTemplate` - Share actions with social icons
   - `ActionMenuTemplate` - Edit/copy/delete with shortcuts
   - `UserProfileTemplate` - Avatar, name, navigation, settings, logout
4. **Comparison Stories**:
   - `AllSizes` - Side-by-side comparison of SM, MD, LG
   - `AllTemplates` - Grid showing all template variations

**Story Requirements**:

- Use `satisfies Meta<typeof Dropmenu>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` for size prop
- Set `parameters.layout: "centered"`
- Create interactive controls for size variant
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. Create React context for size propagation (`DropmenuContext`)
2. Define CVA variants for the container component
3. Set up compound component pattern with `Dropmenu` as root and `DropmenuContent` as container

### Phase 2: Core Implementation

1. Implement `Dropmenu` root component:
   - Accepts `size` prop (sm | md | lg)
   - Creates context provider with size value
   - Renders children with context

2. Implement `DropmenuContent` component:
   - Consumes size from context
   - Applies container styling (bg, border, shadow, rounded corners)
   - Renders children within styled container

3. Update existing atoms to consume context:
   - `DropmenuHeader` - use context size if no explicit size prop
   - `DropmenuOption` - use context size if no explicit size prop
   - `DropmenuFooter` - use context size if no explicit size prop
   - Note: This is optional and can be done in a follow-up if needed

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add exports to `src/ui/dropmenus/index.ts`
- Ensure proper TypeScript types are exported

**Storybook Documentation (REQUIRED):**

- Story file: `src/stories/dropmenus/dropmenu.stories.tsx`
- All size variant stories
- All template pattern stories (Default, Share, Action, User Profile)
- Interactive controls for size prop
- Real-world usage examples demonstrating composition with atoms

## Step by Step Tasks

### 1. Create DropmenuContext for size propagation

- Create `src/ui/dropmenus/dropmenu-context.tsx`
- Define `DropmenuSize` type: `'sm' | 'md' | 'lg'`
- Create `DropmenuContext` with **null default** (not 'lg') for better developer warnings
- Export `DropmenuProvider` and `useDropmenuSize` hook
- **Enhancement from evaluation**: Add development warning if used outside Dropmenu:

  ```typescript
  const DropmenuContext = createContext<DropmenuContextValue | null>(null);

  function useDropmenuSize(): DropmenuSize {
    const context = useContext(DropmenuContext);
    if (!context) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('useDropmenuSize must be used within a Dropmenu component');
      }
      return 'lg'; // safe default fallback
    }
    return context.size;
  }
  ```

### 2. Implement Dropmenu root component

- Create `src/ui/dropmenus/dropmenu.tsx`
- Define `DropmenuProps` interface with:
  - `size?: 'sm' | 'md' | 'lg'` (default: 'lg')
  - `children: ReactNode`
  - `className?: string`
- Implement `Dropmenu` component that wraps children with `DropmenuProvider`

### 3. Implement DropmenuContent container component

- Add `DropmenuContent` component to `dropmenu.tsx`
- Define CVA variants for container:
  ```typescript
  const dropmenuContentVariants = cva(
    'flex flex-col overflow-clip rounded-sm border border-border-secondary bg-background shadow-lg',
    {
      variants: {
        size: {
          sm: 'w-[220px] max-w-[calc(100vw-2rem)]',
          md: 'w-[240px] max-w-[calc(100vw-2rem)]',
          lg: 'w-[260px] max-w-[calc(100vw-2rem)]',
        },
      },
      defaultVariants: {
        size: 'lg',
      },
    }
  );
  ```
- Consume size from context
- Apply container styles
- **Enhancement from evaluation**: Add `aria-orientation="vertical"` for full ARIA compliance:
  ```typescript
  <div
    ref={ref}
    role="menu"
    aria-orientation="vertical"
    className={cn(dropmenuContentVariants({ size }), className)}
    {...props}
  >
    {children}
  </div>
  ```
- **Enhancement from evaluation**: Add responsive width constraint `max-w-[calc(100vw-2rem)]` to prevent overflow on small screens

### 4. Create unit tests for Dropmenu

- Create `src/ui/dropmenus/__tests__/dropmenu.test.tsx`
- Test cases:
  - Renders with default size (lg)
  - Renders with sm size
  - Renders with md size
  - Applies correct width for each size
  - Renders children correctly
  - Applies custom className
  - Forwards ref correctly
  - Context provides correct size to children
  - Has correct ARIA role="menu"
  - **Enhancement from evaluation**: Has correct `aria-orientation="vertical"`
  - **Enhancement from evaluation**: Context fallback warning in development (console.warn test)
  - **Enhancement from evaluation**: Child components can override context size with explicit prop

### 5. Create Storybook stories (REQUIRED)

- Create `src/stories/dropmenus/dropmenu.stories.tsx`
- Implement all required stories:
  - Default
  - SizeSmall, SizeMedium, SizeLarge
  - DefaultListTemplate
  - ShareMenuTemplate
  - ActionMenuTemplate
  - UserProfileTemplate
  - AllSizes comparison
  - AllTemplates comparison

### 6. Update barrel exports

- Update `src/ui/dropmenus/index.ts`:
  ```typescript
  export * from './dropmenu';
  export * from './dropmenu-context';
  ```

### 7. Run Validation Commands

- Execute all validation commands to ensure zero errors

## Testing Strategy

### Unit Tests

1. **Rendering tests**:
   - Component renders without crashing
   - Renders children correctly
   - Applies default size (lg) when not specified

2. **Size variant tests**:
   - SM variant applies correct width (220px)
   - MD variant applies correct width (240px)
   - LG variant applies correct width (260px)

3. **Context tests**:
   - Context provides correct size to nested components
   - Context defaults to 'lg' when no provider

4. **Styling tests**:
   - Container has correct border styles
   - Container has correct shadow
   - Container has correct border-radius
   - Custom className is applied

5. **Accessibility tests**:
   - Has role="menu" on container
   - Children with role="menuitem" are properly nested

6. **Ref forwarding tests**:
   - Refs are forwarded to DOM elements correctly

### Edge Cases

- Empty children (no options)
- Single option only
- Header only (no options or footer)
- Options only (no header or footer)
- Very long option labels (truncation)
- Many options (scrollability consideration)
- Nested dropmenus (not supported, should warn)

## Acceptance Criteria

### Functional Requirements

- ✅ Dropmenu component implemented in `src/ui/dropmenus/` with proper TypeScript types
- ✅ Three size variants work correctly (SM: 220px, MD: 240px, LG: 260px)
- ✅ Component forwards refs correctly
- ✅ Component composes with existing atoms (DropmenuHeader, DropmenuOption, DropmenuFooter, DropmenuDivider)
- ✅ Component follows design system patterns (CVA, semantic tokens)
- ✅ Context propagates size to child components

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/dropmenus/dropmenu.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **ALL size variant stories implemented (SM, MD, LG)**
- ✅ **ALL template stories implemented (Default, Share, Action, User Profile)**
- ✅ **Real-world examples (minimum 4 practical usage scenarios)**
- ✅ **Comparison story showing all sizes together**
- ✅ **Interactive controls configured for size prop**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/dropmenus/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { Dropmenu, DropmenuContent } from '@/ui'`

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

3. **Run component tests**: `npm test -- dropmenu`
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

### Design Decisions

1. **Compound component pattern**: Using `Dropmenu` + `DropmenuContent` allows flexibility while maintaining the context provider. This pattern is consistent with Radix UI and allows for future expansion (e.g., `DropmenuTrigger`, `DropmenuPortal`).

2. **Context for size propagation**: Rather than requiring size props on every child, the context approach reduces boilerplate and ensures consistency.

3. **Fixed widths**: The Figma design specifies fixed widths (220px, 240px, 260px) rather than fluid widths. This is intentional for dropdown menus to maintain predictable dimensions.

### Future Considerations

1. **Integration with Radix UI DropdownMenu**: The component is designed to work alongside or eventually integrate with Radix UI's DropdownMenu for trigger, portal, and positioning behavior.

2. **Animation support**: Consider adding enter/exit animations via `tw-animate-css` or Framer Motion.

3. **Max height and scrolling**: For menus with many items, consider adding `max-h-*` and `overflow-y-auto`.

4. **Keyboard navigation**: The current implementation focuses on visual structure. Full keyboard navigation should be added in conjunction with Radix UI integration.

### Dependencies

No new libraries required. Uses existing:

- `class-variance-authority` for variants
- `@/lib/utils` for `cn()` utility
- React context for size propagation

---

## Evaluation Applied

**Evaluation Document:** `/ai/agents/evaluations/dropmenu-plan-2025-11-30.md`

### Pre-Implementation Requirements (COMPLETED)

- [x] **Updated DropmenuHeader** to support `size="lg"` variant
- [x] **Updated DropmenuFooter** to support `size="lg"` variant

### Enhancements Incorporated into Plan

1. **Context Fallback with Developer Warnings** (Priority 2)
   - Context now uses `null` default instead of 'lg'
   - `useDropmenuSize` hook logs warning in development if used outside Dropmenu
   - Graceful fallback to 'lg' for safety

2. **Full ARIA Compliance** (Priority 2)
   - Added `aria-orientation="vertical"` to DropmenuContent
   - Proper role="menu" on container
   - Children maintain role="menuitem" from existing atoms

3. **Responsive Width Constraints** (Priority 2)
   - Added `max-w-[calc(100vw-2rem)]` to all size variants
   - Prevents overflow on mobile/small screens
   - Fixed widths preserved as per Figma design

4. **Size Override Documentation** (Priority 1)
   - Child components can override context size with explicit prop
   - Pattern: `const size = propSize ?? contextSize.size`
   - Added test case for override behavior

### Future Considerations (Not in Initial Implementation)

- Radix UI integration for trigger, portal, positioning
- `createSizeContext()` utility for reusable pattern
- Enter/exit animations via tw-animate-css

### Architectural Score Breakdown

| Category                     | Score |
| ---------------------------- | ----- |
| Atomic Design Classification | 10/10 |
| Component Composition        | 10/10 |
| CVA Pattern Compliance       | 10/10 |
| TypeScript Conventions       | 10/10 |
| Design System Integration    | 9/10  |
| Context-Based Propagation    | 10/10 |
| Accessibility                | 9/10  |
| Testing Strategy             | 10/10 |
| Documentation                | 10/10 |
| Future-Proofing              | 9/10  |

**Overall: 9.2/10** ✅ APPROVED FOR IMPLEMENTATION
