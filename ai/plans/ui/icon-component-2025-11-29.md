# UI: Icon Component Enhancement

---

## Architectural Evaluation Summary

**Evaluation Date**: 2025-11-29
**Evaluator**: UI/UX Architecture Agent
**Full Evaluation**: `ai/agents/evaluations/icon-component-plan-2025-11-29.md`

### Overall Rating: ⭐⭐⭐⭐☆ (4/5) - PROCEED WITH MODIFICATIONS

### Critical Issues to Address Before Implementation

| Issue                                 | Severity  | Recommendation                                                     |
| ------------------------------------- | --------- | ------------------------------------------------------------------ |
| **Span wrapper violates composition** | 🔴 HIGH   | Remove span wrapper - apply CVA classes directly to icon component |
| **`renderIcon` utility anti-pattern** | 🔴 HIGH   | Remove utility - handle rendering logic inline within component    |
| **Ref forwarding type mismatch**      | 🔴 HIGH   | Fix ref type to match actual rendered element (SVG, not span)      |
| **`as` prop naming conflict**         | 🟡 MEDIUM | Keep `icon` prop or use `iconSource` instead of `as`               |
| **Size scale breaking changes**       | 🟡 MEDIUM | Extend existing scale (keep xs, md) rather than replace            |

### What's Excellent (Keep These)

- ✅ Atomic Design classification (Atom) is correct
- ✅ CVA integration and extended size scale concept
- ✅ Backward compatibility strategy
- ✅ Comprehensive accessibility approach
- ✅ Thorough testing strategy
- ✅ Exemplary Storybook documentation plan

### Revised Architecture (Recommended)

```typescript
// ❌ REJECTED: Span wrapper approach
<span className={cn(iconVariants(...))}>{renderIcon(icon)}</span>

// ✅ APPROVED: Direct rendering (maintains existing pattern)
<IconComponent
  ref={ref}
  className={cn(iconVariants({ size, intent }), className)}
  {...phosphorProps}
  {...accessibilityProps}
/>
```

---

## Component Description

The Icon component is a standardized wrapper for rendering icons from multiple sources (Phosphor Icons, Lucide React, custom React components, or ReactNode) with consistent sizing, coloring, and accessibility attributes. This enhancement extends the existing Icon component to support polymorphic icon rendering with inline type detection, allowing greater flexibility in icon source while maintaining design system consistency.

**⚠️ ARCHITECTURAL NOTE**: Based on the evaluation, this plan has been updated to:

1. Remove the span wrapper pattern
2. Remove the `renderIcon` utility function
3. Handle icon type detection inline within the component
4. Maintain the existing direct rendering pattern

## User Story

As a developer building UI components
I want a flexible Icon component that accepts icons from multiple sources
So that I can use Phosphor Icons, Lucide icons, custom SVGs, or any ReactNode with consistent styling across the application

## Problem Statement

The current Icon component only supports Phosphor Icons directly through the `icon` prop. There's a need for a more flexible approach that can:

1. Accept icons from multiple libraries (Phosphor, Lucide)
2. Accept custom React components as icons
3. Accept ReactNode elements (inline SVGs, emojis)
4. Automatically detect and apply Phosphor-specific props like `weight`
5. Maintain consistent sizing and semantic color intent across all icon types

## Solution Statement

Enhance the Icon component with **inline type detection** (no external utilities) that:

- Detects Phosphor Icons and applies `weight` and `size` props automatically
- Renders custom React components directly with CVA classes
- Maintains the existing direct rendering pattern (NO span wrapper)

**Revised Approach** (per architectural evaluation):

- Apply CVA classes directly to the icon component
- Use inline type guard (`isPhosphorIcon`) within the component
- Forward refs correctly to the SVG element
- Extend the existing size scale without breaking changes

## Atomic Design Classification

**Component Type**: Atom

**Reasoning**: The Icon component is a fundamental building block with no dependencies on other UI components. It's used to compose higher-level molecules (buttons with icons, badges) and organisms (navigation bars, cards).

**Composition Requirements**:

- **Status**: ✅ Base atom - no composition dependencies

## Component Location

**Location**: `src/ui/icons/icon.tsx` (enhancement of existing file)

**Category**: icons

**Reasoning**: The icons category already exists with the current Icon implementation. This enhancement maintains the existing structure while expanding capabilities.

**Export Pattern**:

```typescript
// 1. Update component: src/ui/icons/icon.tsx
export { Icon, iconVariants };
export type { IconProps };

// 2. Category barrel already exists: src/ui/icons/index.ts
export * from './icon';

// 3. Root barrel already exports icons: src/ui/index.ts
export * from './icons';

// 4. Import usage (recommended):
import { Icon } from '@/ui';

// 5. Import usage (alternative):
import { Icon } from '@/ui/icons';
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/icons/icon.tsx`** - Current Icon implementation with Phosphor-only support
  - Review existing CVA patterns, size mapping, accessibility props
  - Understand current TypeScript types and props interface

- **`src/ui/icons/index.ts`** - Category barrel exports
  - Review re-export patterns for Phosphor icons

- **`src/stories/icons/icons.stories.tsx`** - Existing comprehensive stories
  - Reference story patterns, argTypes configuration
  - Understand real-world examples already documented

- **`src/ui/typography/text.tsx`** - Reference for polymorphic component patterns
  - Study CVA usage, color variants, asChild pattern

- **`src/lib/utils.ts`** - cn() utility for class merging

### New Files

**⚠️ REVISED** (per architectural evaluation - utility files removed):

1. ~~**Utility files**~~ ❌ REMOVED - Type detection handled inline in component
   - ~~`src/lib/isPhosphorIcon.ts`~~ → Inline type guard in component
   - ~~`src/lib/isReactComponent.ts`~~ → Not needed
   - ~~`src/lib/renderIcon.tsx`~~ → Anti-pattern, logic handled inline

2. **Component file**: `src/ui/icons/icon.tsx` (ENHANCEMENT - not new)

3. **Test file**: `src/ui/icons/__tests__/icon.test.tsx` (REQUIRED)

4. **Story file**: `src/stories/icons/icon.stories.tsx` (UPDATE existing icons.stories.tsx)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: No - Icons are size-consistent across breakpoints
- **Tablet (md: 768px - 1023px)**: No - Same as desktop
- **Mobile (< 768px)**: No - Same as desktop

Icons maintain fixed sizes regardless of viewport; responsive behavior is handled by parent components.

### Design Assets

**Status**: ✅ Design provided via code specification

**Assets**:

- User provided complete component implementation with:
  - Size scale: sm (12px), default (16px), lg (20px), xl (24px), 2xl (28px), 3xl (32px), 4xl (36px), 5xl (40px)
  - Intent colors: default, muted, primary, secondary, neutral, destructive, success, warning, info, white
  - Weight variants: thin, light, regular, bold (default), fill, duotone
  - Accessibility: aria-hidden default true for decorative icons

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/icons/icon.stories.tsx` (enhance existing icons.stories.tsx)

**Required Stories**:

1. **Default Story**: Basic icon with default props
2. **AllSizes Story**: Grid showing sm through 5xl sizes
3. **AllIntents Story**: Grid showing all semantic color intents
4. **AllWeights Story**: Grid showing all Phosphor weight variants
5. **PolymorphicUsage Story**: Examples with Phosphor, Lucide, custom components, ReactNode
6. **WithReactComponent Story**: Custom React component as icon
7. **WithReactNode Story**: Inline SVG and emoji as icons
8. **Accessibility Story**: Decorative vs semantic icons with proper ARIA
9. **RealWorldExamples Story**: Icons in buttons, form inputs, status indicators
10. **ColorInheritance Story**: Icons inheriting color from parent

**Story Requirements**:

- Use `satisfies Meta<typeof Icon>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: "centered"`
- Create interactive controls for size, intent, weight props
- Document the `as` prop with various icon sources

## Implementation Plan

**⚠️ REVISED** (per architectural evaluation):

### Phase 1: Core Implementation - Icon Component Enhancement

Enhance the existing Icon component with inline type detection:

1. **Extend CVA size variants**: Add `2xl` (36px) and `3xl` (40px) to existing scale
   - Keep existing: `xs`, `sm`, `md`, `lg`, `xl`
   - Add new: `2xl`, `3xl`

2. **Add `intent` variant** with backward-compatible `color` prop:
   - Add `intent` as the new semantic prop
   - Keep `color` prop with deprecation warning
   - Resolve: `const resolvedIntent = intent || color || 'default'`

3. **Inline type guard for Phosphor icons**:

   ```typescript
   function isPhosphorIcon(icon: any): icon is PhosphorIcon {
     return (
       typeof icon === 'function' &&
       'displayName' in icon &&
       typeof icon.displayName === 'string'
     );
   }
   ```

4. **Keep `icon` prop** (don't add `as` prop to avoid naming conflict):
   - Extend `icon` prop type to accept custom components
   - `icon: PhosphorIcon | ComponentType<{ className?: string }>`

5. **Maintain direct rendering** (NO span wrapper):

   ```typescript
   return (
     <IconComponent
       ref={ref}
       className={cn(iconVariants({ size, intent: resolvedIntent }), className)}
       {...phosphorProps}
       {...accessibilityProps}
       {...props}
     />
   );
   ```

6. **Update default weight** to `bold` per user specification

### Phase 2: Design System Integration & Documentation

**Export Configuration:**

- Update `src/ui/icons/index.ts` barrel exports with new types
- Ensure all exports work through `@/ui` import

**Storybook Documentation (REQUIRED):**

- Story file: `src/stories/icons/icon.stories.tsx`
- All variant stories for sizes and intents
- Polymorphic usage examples (Phosphor, custom components)
- Interactive controls for all props
- Real-world usage examples in UI patterns

## Step by Step Tasks

**⚠️ REVISED** (per architectural evaluation):

### Step 1: Research and Analysis

- [x] Read existing Icon component implementation
- [x] Review existing Storybook stories
- [x] Understand project CVA patterns from typography components
- [x] Review styling guidelines for semantic color system
- [x] **NEW**: Review architectural evaluation recommendations

### ~~Step 2: Create Utility Functions~~ ❌ REMOVED

~~Per architectural evaluation, utility files are NOT needed:~~

- ~~`src/lib/isPhosphorIcon.ts`~~ → Inline type guard
- ~~`src/lib/isReactComponent.ts`~~ → Not needed
- ~~`src/lib/renderIcon.tsx`~~ → Anti-pattern, removed

### Step 2: Enhance Icon Component (Revised)

- Update `src/ui/icons/icon.tsx`
  - **Extend size variants** (don't replace):
    - Keep existing: `xs` (12px), `sm` (16px), `md` (20px), `lg` (24px), `xl` (32px)
    - Add new: `2xl` (36px), `3xl` (40px)
  - **Add `intent` variant** alongside `color`:
    - Add new `intent` prop
    - Keep `color` prop with deprecation warning
    - Resolve: `intent || color || 'default'`
  - **Add inline type guard** for Phosphor detection:
    ```typescript
    function isPhosphorIcon(icon: any): icon is PhosphorIcon {
      return typeof icon === 'function' && 'displayName' in icon;
    }
    ```
  - **Keep `icon` prop** (don't add `as` to avoid naming conflict)
  - **Maintain direct rendering** (NO span wrapper)
  - **Update default weight** to `bold`
  - Ensure ref forwarding to SVG element
  - Update TypeScript types for extended props

### Step 3: Create Unit Tests

- Create `src/ui/icons/__tests__/icon.test.tsx`
  - Test default rendering
  - Test all size variants (xs, sm, md, lg, xl, 2xl, 3xl)
  - Test all intent variants
  - Test all weight variants (Phosphor only)
  - Test with Phosphor icon
  - Test with custom React component
  - Test accessibility props (aria-hidden, aria-label)
  - Test ref forwarding to SVG element
  - Test className merging
  - Test backward compatibility with `color` prop (deprecated)
  - Test deprecation warning in development mode

### Step 4: Update Storybook Stories

- Update `src/stories/icons/icon.stories.tsx`
  - Update meta configuration with new argTypes (`intent` instead of `color`)
  - Add AllSizes story with extended scale (xs through 3xl)
  - Add AllIntents story (rename from Colors)
  - Update Weights story
  - Add WithCustomComponent story
  - Update Accessibility story
  - Update UseCases/RealWorldExamples
  - Add ColorInheritance story

### Step 5: Update Barrel Exports

- Update `src/ui/icons/index.ts`
  - Export new IconProps type with updated structure
  - Ensure backward compatibility exports

### Step 6: Run Validation Commands

Execute all validation commands to ensure zero regressions.

## Testing Strategy

**⚠️ REVISED** (per architectural evaluation):

### Unit Tests

**File**: `src/ui/icons/__tests__/icon.test.tsx`

Tests to implement:

1. **Rendering Tests**
   - Renders with default props
   - Renders Phosphor icon correctly
   - Renders custom React component

2. **Size Variant Tests**
   - Applies correct classes for each size (xs through 3xl)
   - Uses default size (`md`) when not specified

3. **Intent Variant Tests**
   - Applies correct text color classes for each intent
   - Uses default intent when not specified
   - **NEW**: Tests backward compatibility with deprecated `color` prop

4. **Weight Tests**
   - Passes weight to Phosphor icons
   - Does not pass weight to non-Phosphor components
   - Uses default weight (`bold`) when not specified

5. **Accessibility Tests**
   - Sets aria-hidden="true" by default
   - Allows aria-hidden="false" override
   - Supports aria-label for semantic icons

6. **Integration Tests**
   - **REVISED**: Forwards ref to SVG element (not span)
   - Merges className properly
   - Passes additional props to icon component

7. **Deprecation Tests** (NEW)
   - Warns when using deprecated `color` prop in development
   - Resolves `intent || color` correctly

### Edge Cases

- Invalid component type
- Weight prop with non-Phosphor icon (should be ignored)
- Custom className overriding intent colors
- Both `intent` and `color` provided (intent takes precedence)

## Acceptance Criteria

**⚠️ REVISED** (per architectural evaluation):

### Functional Requirements

- ✅ Component accepts Phosphor icons via `icon` prop
- ✅ Component accepts custom React components via `icon` prop
- ✅ Phosphor icons receive weight prop automatically
- ✅ All size variants render correctly (xs through 3xl)
- ✅ All intent variants render correct colors
- ✅ **REVISED**: Component forwards refs correctly to SVG element (not span)
- ✅ **REVISED**: Backward compatibility maintained with deprecated `color` prop
- ✅ Deprecation warning shown in development when using `color` prop
- ✅ Component follows design system patterns (CVA, semantic tokens)
- ✅ **NEW**: Direct rendering pattern maintained (NO span wrapper)

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file updated: `src/stories/icons/icon.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **AllSizes story showing xs through 3xl** (revised scale)
- ✅ **AllIntents story showing all semantic colors**
- ✅ **AllWeights story for Phosphor weight variants**
- ✅ **WithCustomComponent story showing custom React components**
- ✅ **Accessibility story with decorative/semantic examples**
- ✅ **Real-world examples (buttons, forms, status indicators)**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/icons/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { Icon } from '@/ui'`

### Code Quality

- ✅ Zero TypeScript errors: `npm run type-check`
- ✅ Zero ESLint warnings: `npm run lint`
- ✅ Build succeeds: `npm run build`

## Validation Commands

⚠️ **CRITICAL**: Execute EVERY command below. All must pass with zero errors.

**⚠️ REVISED** (per architectural evaluation - utility tests removed):

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- icon`
   - Expected: All Icon tests pass with >90% coverage
   - Validates: Component functionality and edge cases

4. ~~**Run utility tests**~~ ❌ REMOVED - No external utilities

5. **Run full test suite**: `npm run test:run`
   - Expected: All tests pass with zero regressions
   - Validates: No breaking changes to existing components

6. **Build verification**: `npm run build`
   - Expected: Build completes successfully
   - Validates: Production bundle compatibility

7. **Storybook build** (REQUIRED): `npm run build-storybook`
   - Expected: Storybook builds successfully, all stories compile
   - Validates: Visual documentation is complete and error-free
   - Verify: Stories appear in build output with correct paths

**All 6 commands MUST pass before the component is considered complete.**

## Notes

### Implementation Decision: Enhancement vs Replacement

**⚠️ REVISED** (per architectural evaluation):

The user's provided code differs from the existing implementation in several ways:

| Aspect         | Current     | User's Code  | **Revised (Approved)**       |
| -------------- | ----------- | ------------ | ---------------------------- |
| Icon Source    | `icon` prop | `as` prop    | **`icon` prop** (keep)       |
| Wrapper        | Direct SVG  | Span wrapper | **Direct SVG** (keep)        |
| Size Scale     | xs-xl (5)   | sm-5xl (8)   | **xs-3xl (7)** (extend)      |
| Color Prop     | `color`     | `intent`     | **Both** (deprecate `color`) |
| Default Weight | `regular`   | `bold`       | **`bold`** (change)          |
| Default Size   | `md`        | `default`    | **`md`** (keep)              |

**Approved Implementation Strategy**:

1. ✅ Keep `icon` prop (don't add `as` to avoid naming conflict)
2. ✅ Keep direct rendering (NO span wrapper)
3. ✅ Add `intent` prop alongside `color` (deprecate `color`)
4. ✅ Extend size scale: keep xs-xl, add 2xl, 3xl
5. ✅ Update default weight to `bold`
6. ✅ Inline type guard (no external utilities)

### ~~renderIcon Utility Dependencies~~ ❌ REMOVED

~~Per architectural evaluation, utility files are anti-patterns:~~

- ~~`isPhosphorIcon`~~ → Inline type guard in component
- ~~`isReactComponent`~~ → Not needed
- ~~`renderIcon`~~ → Anti-pattern, logic handled inline

### Revised Implementation Example

```typescript
// src/ui/icons/icon.tsx (simplified)
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, size = 'md', weight = 'bold', intent, color, className, ...props }, ref) => {
    // Resolve intent (backward compatible)
    const resolvedIntent = intent || color || 'default';

    // Deprecation warning (dev only)
    if (process.env.NODE_ENV === 'development' && color && !intent) {
      console.warn('Icon: The `color` prop is deprecated. Use `intent` instead.');
    }

    // Inline type guard
    const phosphorProps = isPhosphorIcon(IconComponent)
      ? { weight, size: sizeMap[size] }
      : {};

    // Direct rendering (NO wrapper)
    return (
      <IconComponent
        ref={ref}
        className={cn(iconVariants({ size, intent: resolvedIntent }), className)}
        {...phosphorProps}
        {...accessibilityProps}
        {...props}
      />
    );
  }
);
```

### Lucide Icons Support

Lucide icons work as regular React components and don't need special handling. They'll receive CVA classes but not Phosphor-specific props (weight, size).

### Tree Shaking

The current approach of re-exporting Phosphor icons from `@/ui/icons` should be maintained for tree shaking benefits. Users should continue to import directly from `@phosphor-icons/react` when possible.

---

## Architectural Evaluation Reference

**Full Evaluation Document**: `ai/agents/evaluations/icon-component-plan-2025-11-29.md`

**Key Decisions Made**:

1. ❌ Rejected span wrapper approach
2. ❌ Rejected renderIcon utility
3. ❌ Rejected `as` prop naming
4. ✅ Approved extending existing size scale
5. ✅ Approved `intent` with `color` deprecation
6. ✅ Approved inline type guard pattern
7. ✅ Approved direct rendering pattern
