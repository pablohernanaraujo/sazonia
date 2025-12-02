# Ui: DropmenuOption

## Component Description

The DropmenuOption component is a menu item element for dropdown menus that displays an option label with optional left and right add-ons (icons or text). It provides visual feedback for interactive states (default, hovered, pressed, focus, disabled) and supports three size variants (SM, MD, LG). This component is essential for building consistent dropdown menu interactions across the application, allowing users to select actions or options from contextual menus.

## User Story

As a user
I want to see clearly styled menu options in dropdowns with visual state feedback
So that I can easily navigate and select options from contextual menus with confidence

## Problem Statement

The design system needs a consistent, reusable dropdown menu option component that provides proper visual feedback for interactive states and supports flexible content through optional left/right add-ons (icons or text). Without this component, dropdown menus would have inconsistent styling and behavior across the application.

## Solution Statement

Create a `DropmenuOption` component using CVA (Class Variance Authority) that:

- Supports three sizes (SM, MD, LG) with appropriate typography and spacing
- Handles five interactive states (default, hovered, pressed, focus, disabled)
- Allows optional left and right add-ons (icons or secondary text)
- Integrates with existing Icon and Typography components
- Uses semantic color tokens from the design system
- Provides proper accessibility through keyboard navigation and ARIA attributes

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: DropmenuOption is a molecule because it combines multiple atoms (Icon, Typography) into a meaningful menu item element. It's not a simple atom like a button or icon, but rather a composed element that serves a specific purpose in dropdown menus. It will be used within organisms like complete dropdown menus or context menus.

**Composition Requirements**:

- **Required Atoms**:
  - `Icon` from `@/ui/icons` - For left/right icon add-ons (required for size mapping consistency)
  - `TextSm`, `TextMd` from `@/ui/typography` - For right add-on text only (semantic color variants)

- **Required Molecules**: None (this is a molecule itself)

**Typography Usage Clarification**:

- **Main label**: Use direct `<span>` with Tailwind classes (optimal performance, avoids component overhead)
- **Right add-on text**: Use `TextSm`/`TextMd` Typography component with `color="muted"` (semantic consistency)
- **Icons**: Use `Icon` component (required for size/color management)

## Component Location

**Location**: `src/ui/dropmenus/dropmenu-option.tsx`

**Category**: `dropmenus`

**Reasoning**: This component belongs in the `dropmenus` category alongside existing components like `DropmenuHeader`, `DropmenuDivider`, and `DropmenuFooter`. Together these components form a complete dropdown menu system.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/dropmenus/dropmenu-option.tsx
export { DropmenuOption, dropmenuOptionVariants };
export type { DropmenuOptionProps };

// 2. Update category barrel: src/ui/dropmenus/index.ts
export * from './dropmenu-option';

// 3. Import usage (recommended):
import { DropmenuOption } from '@/ui';

// 4. Import usage (alternative):
import { DropmenuOption } from '@/ui/dropmenus';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/dropmenus/dropmenu-header.tsx`** - Primary reference for dropmenu component patterns
  - Study CVA pattern, prop structures, and TypeScript types
  - Reference size variant naming (sm, md) and styling approach

- **`src/ui/dropmenus/__tests__/dropmenu-header.test.tsx`** - Test pattern reference
  - Comprehensive test coverage structure
  - Size variant testing approach

- **`src/stories/dropmenus/dropmenu-header.stories.tsx`** - Storybook story patterns
  - Meta configuration and argTypes
  - Story organization and real-world examples

- **`src/ui/icons/icon.tsx`** - Icon component for add-on icons
  - Size variants mapping (xs: 12px, sm: 16px, md: 20px)
  - Color variants for icon styling

- **`src/ui/typography/text.tsx`** - Typography components for labels
  - TextSm (14px/20px) and TextMd (16px/24px)
  - Weight and color variants

- **`src/app/globals.css`** - Design token reference
  - Background colors: `--color-background`, `--color-background-secondary`, `--color-background-tertiary`
  - Text colors: `--color-text-primary`, `--color-text-secondary`
  - Border colors: `--color-border-brand` for focus state

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/dropmenus/dropmenu-option.tsx` (REQUIRED)
2. **Test file**: `src/ui/dropmenus/__tests__/dropmenu-option.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/dropmenus/dropmenu-option.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: No - Component has fixed behavior
- **Tablet (md: 768px - 1023px)**: No - Component has fixed behavior
- **Mobile (< 768px)**: No - Component has fixed behavior

The component width is determined by its parent container (typically `w-full` or a fixed width dropdown container). Internal spacing and typography are size-variant specific, not responsive.

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2437-173288&m=dev
- Screenshots: Figma screenshot captured showing all state/size variants

**Design Specifications from Figma**:

#### Size Variants

| Size | Padding X | Padding Y | Gap  | Font Size | Line Height | Icon Size |
| ---- | --------- | --------- | ---- | --------- | ----------- | --------- |
| SM   | 12px      | 6px       | 10px | 14px      | 20px        | 16px      |
| MD   | 12px      | 10px      | 12px | 14px      | 20px        | 16px      |
| LG   | 16px      | 12px      | 12px | 16px      | 24px        | 20px      |

#### State Backgrounds

| State    | Background Color                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------- |
| Default  | `bg-background` (#ffffff)                                                                            |
| Hovered  | `bg-background-secondary` (#f9fafb)                                                                  |
| Pressed  | `bg-background-tertiary` (#f0f2f4)                                                                   |
| Focus    | `bg-background` + `focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2` |
| Disabled | `bg-background` + muted text (`text-text-tertiary`)                                                  |

#### Text Colors

| State    | Text Color                     |
| -------- | ------------------------------ |
| Default  | `text-text-primary` (#11181c)  |
| Disabled | `text-text-tertiary` (#889096) |

#### Add-on Text Colors

- Right add-on text: `text-text-subtle` (#697177)

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/dropmenus/dropmenu-option.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic component usage with default props (LG size, default state)
2. **Variant Stories**:
   - `SizeSmall`: SM size variant
   - `SizeMedium`: MD size variant
   - `SizeLarge`: LG size variant
3. **State Stories**:
   - `StateDefault`: Default state
   - `StateHovered`: Hovered state
   - `StatePressed`: Pressed state
   - `StateFocus`: Focus state with ring
   - `StateDisabled`: Disabled state with muted colors
4. **Add-on Stories**:
   - `WithLeftIcon`: With left icon add-on
   - `WithRightText`: With right text add-on
   - `WithBothAddOns`: With both left icon and right text
   - `WithoutAddOns`: Without any add-ons
5. **Real-world Examples**:
   - `ActionMenuExample`: Context menu with edit/delete/copy actions
   - `SettingsMenuExample`: Settings dropdown with icons and shortcuts
   - `UserMenuExample`: User profile dropdown with account options
6. **Comparison Stories**:
   - `AllSizes`: Grid showing SM, MD, LG sizes
   - `AllStates`: Grid showing all five interactive states
   - `AllVariants`: Complete grid of all size/state combinations

**Story Requirements**:

- Use `satisfies Meta<typeof DropmenuOption>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` for: size, visualState, label, showLeftAddOn, showRightAddOn, leftIcon, rightText, disabled, className
- Set `parameters.layout: "centered"`
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. **Research existing patterns**:
   - Analyze `dropmenu-header.tsx` for CVA structure and prop patterns
   - Review Figma design for exact spacing, colors, and states
   - Understand how Icon and Typography components are used

2. **Define TypeScript interfaces**:
   - `DropmenuOptionProps` extending CVA variants
   - Support for `size`, `visualState`, `disabled`, `showLeftAddOn`, `showRightAddOn`
   - `visualState` prop for Storybook visualization (not for production state management)
   - Slots for custom `leftAddOn` and `rightAddOn` React nodes
   - Standard HTML div props through `ComponentPropsWithoutRef<'div'>`

### Phase 2: Core Implementation

1. **Create CVA variants**:
   - Base styles: `flex items-center w-full cursor-pointer rounded-sm transition-colors duration-150`
   - Natural browser states: `hover:bg-background-secondary active:bg-background-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand`
   - Size variants: SM (px-3 py-1.5 gap-2.5), MD (px-3 py-2.5 gap-3), LG (px-4 py-3 gap-3)
   - `visualState` variants for Storybook override: default (''), hovered, pressed, focus
   - Disabled: `disabled:pointer-events-none disabled:text-text-tertiary`

2. **Build component structure**:

   ```tsx
   <div className={cn(dropmenuOptionVariants({ size, visualState }), className)}>
     {/* Left add-on: Use Icon component for icons */}
     {showLeftAddOn &&
       (leftAddOn || (leftIcon && <Icon icon={leftIcon} size={iconSize} />))}

     {/* Main label: Direct span with Tailwind (optimal performance) */}
     <span className="flex-1 overflow-hidden text-ellipsis text-text-primary">
       {label}
     </span>

     {/* Right add-on: Use Typography component for text */}
     {showRightAddOn &&
       (rightAddOn || (
         <TextComponent color="muted" className="ml-auto">
           {rightText}
         </TextComponent>
       ))}
   </div>
   ```

3. **Implement add-on system**:
   - Default left add-on: Icon placeholder with appropriate size
   - Default right add-on: Text placeholder with secondary color
   - Allow custom React nodes for both positions

4. **Handle interactive states**:
   - Use `visualState` prop for Storybook/testing visualization only
   - Apply natural browser states via Tailwind pseudo-classes (`hover:`, `active:`, `focus-visible:`)
   - Explicit `visualState` overrides for documentation: `'default' | 'hovered' | 'pressed' | 'focus'`
   - Ensure disabled state prevents pointer events with `pointer-events-none`
   - Production usage relies on natural pseudo-classes; `visualState` is for controlled visualization

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Export component, variants, and types from `src/ui/dropmenus/dropmenu-option.tsx`
- Update `src/ui/dropmenus/index.ts` barrel file to include new exports

**Storybook Documentation (REQUIRED):**

- Create `src/stories/dropmenus/dropmenu-option.stories.tsx`
- All variant stories (sizes, states)
- Interactive controls for all props
- Real-world usage examples (action menu, settings menu, user menu)
- Comparison story showing all variants in a grid

## Step by Step Tasks

### Step 1: Research and Setup

- Review `src/ui/dropmenus/dropmenu-header.tsx` for component pattern
- Review `src/ui/icons/icon.tsx` for Icon component API
- Review `src/ui/typography/text.tsx` for Typography component API
- Map Figma design tokens to Tailwind classes

### Step 2: Create Component File

- Create `src/ui/dropmenus/dropmenu-option.tsx`
- Define `dropmenuOptionVariants` with CVA:
  - Base classes: `flex items-center w-full cursor-pointer transition-colors`
  - Size variants (sm, md, lg) with padding, gap, and typography
  - Compound variants for state-based background colors
- Define `DropmenuOptionProps` interface
- Implement `DropmenuOption` component with forwardRef
- Handle left/right add-on rendering
- Apply disabled state styling

### Step 3: Create Unit Tests

- Create `src/ui/dropmenus/__tests__/dropmenu-option.test.tsx`
- Test rendering with required props
- Test all size variants (sm, md, lg)
- Test all state variants (default, hovered, pressed, focus, disabled)
- Test add-on visibility (showLeftAddOn, showRightAddOn)
- Test custom add-on rendering
- Test ref forwarding
- Test className merging
- Test accessibility attributes
- Test edge cases (long text, special characters)

### Step 4: Create Storybook Stories

- Create `src/stories/dropmenus/dropmenu-option.stories.tsx`
- Configure meta with comprehensive argTypes
- Create Default story
- Create size variant stories (SizeSmall, SizeMedium, SizeLarge)
- Create state stories (Default, Hovered, Pressed, Focus, Disabled)
- Create add-on stories (WithLeftIcon, WithRightText, WithBothAddOns, WithoutAddOns)
- Create real-world examples (ActionMenu, SettingsMenu, UserMenu)
- Create comparison stories (AllSizes, AllStates, AllVariants)

### Step 5: Update Barrel Exports

- Update `src/ui/dropmenus/index.ts` to export new component
- Verify import works via `@/ui/dropmenus` and `@/ui`

### Step 6: Run Validation Commands

- Run `npm run type-check` - ensure zero TypeScript errors
- Run `npm run lint` - ensure zero ESLint errors
- Run `npm test -- dropmenu-option` - ensure all tests pass
- Run `npm run test:run` - ensure no regressions
- Run `npm run build` - ensure build succeeds
- Run `npm run build-storybook` - ensure Storybook builds

## Testing Strategy

### Unit Tests

**Rendering Tests:**

- Renders with required `label` prop
- Renders as a div element
- Renders label text correctly
- Renders with all size variants

**Size Variant Tests:**

- SM size applies correct padding (px-3 py-1.5) and typography (text-sm)
- MD size applies correct padding (px-3 py-2.5) and typography (text-sm)
- LG size applies correct padding (px-4 py-3) and typography (text-base)
- Default size is LG

**State Variant Tests:**

- Default state applies correct background
- Hovered state applies hover background
- Pressed state applies active background
- Focus state applies focus ring
- Disabled state applies muted styling and disables pointer events

**Add-on Tests:**

- Left add-on renders when `showLeftAddOn={true}`
- Left add-on hidden when `showLeftAddOn={false}`
- Right add-on renders when `showRightAddOn={true}`
- Right add-on hidden when `showRightAddOn={false}`
- Custom left add-on renders correctly
- Custom right add-on renders correctly

**Composition Tests:**

- Merges custom className correctly
- Forwards ref to root element
- Allows className to override base styles

**Accessibility Tests:**

- Disabled option has `aria-disabled="true"`
- Label text is accessible to screen readers
- Focus state is visible

### Edge Cases

- Very long label text (200+ characters)
- Special characters and HTML entities in label
- Unicode characters in label
- Empty add-on slots
- Both add-ons visible simultaneously
- Rapid state changes

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/dropmenus/` with proper TypeScript types
- ✅ All three size variants (sm, md, lg) render correctly with proper spacing
- ✅ All five state variants (default, hovered, pressed, focus, disabled) render correctly
- ✅ Left and right add-ons can be shown/hidden independently
- ✅ Custom add-ons can be passed as React nodes
- ✅ Component forwards refs correctly
- ✅ Component follows design system patterns (CVA, semantic tokens)
- ✅ Disabled state prevents user interaction

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All size variants tested
- ✅ All state variants tested
- ✅ Add-on visibility tested
- ✅ Edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ Storybook stories file created: `src/stories/dropmenus/dropmenu-option.stories.tsx`
- ✅ Meta configuration with comprehensive argTypes
- ✅ Default story implemented
- ✅ ALL size variant stories implemented (sm, md, lg)
- ✅ ALL state stories implemented (default, hovered, pressed, focus, disabled)
- ✅ Add-on stories implemented
- ✅ Real-world examples (minimum 3 practical usage scenarios)
- ✅ Comparison story showing all variants together
- ✅ Interactive controls configured for all props
- ✅ Storybook builds successfully: `npm run build-storybook`
- ✅ All stories render correctly in Storybook UI

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/dropmenus/index.ts`)
- ✅ Component can be imported via `import { DropmenuOption } from '@/ui/dropmenus'`

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

3. **Run component tests**: `npm test -- dropmenu-option`
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

- The Figma design shows `rightAddOnLg`, `rightAddOnMd`, `rightAddOnSm` as separate props per size - the implementation should simplify this to a single `rightAddOn` prop that adapts based on size
- Focus state uses semantic `focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2` pattern for consistency with other interactive components
- The component should work both as a standalone interactive element AND as a child of Radix UI dropdown primitives
- Consider adding `asChild` pattern in future for Radix UI integration
- The `visualState` prop is for Storybook visualization only; in production, states are handled via CSS pseudo-classes (`:hover`, `:focus-visible`, `:active`) and the `disabled` prop. This separation ensures natural browser behavior remains functional while allowing explicit state override for documentation/testing
