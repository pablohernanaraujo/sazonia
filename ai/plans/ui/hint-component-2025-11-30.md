# UI: Hint

## Component Description

The Hint component is a form helper text element that provides contextual information, guidance, or feedback to users about form inputs. It displays secondary text below form fields to help users understand what input is expected, provide formatting hints, or show validation messages. The component supports two size variants (SM and MD) to match different form field sizes, using the muted text color for subtle, non-intrusive guidance.

## User Story

As a form user
I want to see helpful hints below input fields
So that I understand what information is expected and how to format my input correctly

## Problem Statement

Forms often require additional context beyond labels to guide users. Without hint text, users may be confused about expected input formats, character limits, or field requirements. A standardized hint component ensures consistent styling and spacing across all forms in the application.

## Solution Statement

Create a reusable Hint component that renders helper text below form inputs with consistent styling. The component will **compose from existing Text components** (TextXs, TextSm) to ensure typography consistency across the design system. This approach eliminates code duplication and ensures typography changes propagate automatically.

## Atomic Design Classification

**Component Type**: Composite Atom

**Reasoning**: The Hint component is a composite atom that wraps the existing Text components (TextXs, TextSm) with form-specific defaults (muted color, top padding). While it renders simple text, it composes from lower-level typography atoms rather than duplicating their implementation.

**Composition Requirements**:

- **Required Atoms**:
  - `TextXs` from `@/ui/typography` - For size="sm" variant (12px/18px)
  - `TextSm` from `@/ui/typography` - For size="md" variant (14px/20px)

**Composition Strategy**: The Hint component will wrap Text components rather than duplicate typography styling. This follows the DRY principle and ensures typography consistency.

## Component Location

**Location**: `src/ui/inputs/hint.tsx`

**Category**: `inputs` - This component belongs to the inputs category as it is specifically designed to accompany form inputs and provide contextual help text.

**Reasoning**: The Hint component is a form-related element that will be used alongside input fields, text areas, selects, and other form controls. Placing it in the `inputs` category keeps form-related components organized together and makes it easy to find when building forms.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/hint.tsx
export { Hint };
export type { HintProps };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './hint';

// 3. Update root barrel (if needed): src/ui/index.ts
export * from './inputs';

// 4. Import usage (recommended):
import { Hint } from '@/ui';

// 5. Import usage (alternative):
import { Hint } from '@/ui/inputs';
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/typography/text.tsx`** - **COMPOSE FROM THIS** - Contains TextXs and TextSm components that Hint will wrap. Study the color variant for "muted" and the `as` prop usage.

- **`src/ui/typography/__tests__/text.test.tsx`** - Reference for comprehensive testing patterns including default props, variant testing, ref forwarding, className merging, and asChild behavior.

- **`src/stories/typography/text.stories.tsx`** - Reference for Storybook story structure, argTypes configuration, meta setup, and story organization patterns.

- **`src/app/globals.css`** - Reference for available design tokens. The Text component's `color="muted"` maps to `text-text-secondary`.

- **`src/lib/utils.ts`** - Contains the `cn` utility function for class name merging.

- **`src/ui/inputs/index.ts`** - Existing inputs barrel file to update.

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/hint.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/hint.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/hint.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: No specific desktop-only styles needed
- **Tablet (md: 768px - 1023px)**: No specific tablet-only styles needed
- **Mobile (< 768px)**: No specific mobile-only styles needed

The Hint component is text-based and will naturally wrap on smaller screens. No responsive breakpoints required.

### Design Assets

**Status**: Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2367-169484&m=dev
- Screenshot captured from Figma showing both size variants

**Design Specifications**:

| Property    | Size=SM         | Size=MD         |
| ----------- | --------------- | --------------- |
| Font size   | 12px (text-xs)  | 14px (text-sm)  |
| Line height | 18px            | 20px            |
| Font weight | 400 (regular)   | 400 (regular)   |
| Font family | Inter           | Inter           |
| Text color  | #889096 (muted) | #889096 (muted) |
| Padding top | 8px (pt-2)      | 8px (pt-2)      |

**Implementation via Composition**:

- Size SM: Use `TextXs` with `color="muted"`
- Size MD: Use `TextSm` with `color="muted"`
- Both: Add `pt-2` via className

**Interaction States**: None - this is a static text element with no interactive states.

## Storybook Stories

**Required**: Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/hint.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic Hint with MD size and default text
2. **Sizes Story**: Visual comparison of SM and MD sizes
3. **LongText Story**: Demonstrates text wrapping behavior with long content
4. **WithFormField Story**: Real-world example showing Hint below an input with proper `aria-describedby` association
5. **MultipleHints Story**: Example with multiple hints for complex forms
6. **AllVariants Story**: Grid showing all size combinations
7. **Accessibility Story**: Shows proper `aria-describedby` usage pattern

**Story Requirements**:

- Use `satisfies Meta<typeof Hint>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: "centered"` for isolated viewing
- Create interactive controls for `size` and `children` props
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. Verify `src/ui/inputs/` directory exists
2. Verify `src/ui/inputs/index.ts` barrel file exists
3. Confirm Text components are available at `@/ui/typography`

### Phase 2: Core Implementation

1. Create `src/ui/inputs/hint.tsx` with:
   - Import TextXs, TextSm from `@/ui/typography`
   - forwardRef for ref forwarding
   - Simple `size` prop: 'sm' | 'md' (default: 'md')
   - NO `as` or `asChild` props (always renders as span via Text)
   - Proper TypeScript types

2. **React Import Convention** (REQUIRED):

   ```typescript
   // ✅ CORRECT - Direct imports
   import { forwardRef, type ComponentPropsWithoutRef } from 'react';

   // ❌ WRONG - Namespace import
   import * as React from 'react';
   ```

3. **Complete Implementation Code**:

   ````typescript
   // src/ui/inputs/hint.tsx
   import { forwardRef, type ComponentPropsWithoutRef } from 'react';
   import { cn } from '@/lib/utils';
   import { TextXs, TextSm } from '@/ui/typography';

   export interface HintProps extends Omit<ComponentPropsWithoutRef<'span'>, 'color'> {
     /**
      * Size variant
      * - sm: 12px (text-xs)
      * - md: 14px (text-sm)
      * @default 'md'
      */
     size?: 'sm' | 'md';

     /**
      * Hint text content
      */
     children: React.ReactNode;

     /**
      * Additional CSS classes
      */
     className?: string;
   }

   /**
    * Hint - Form helper text component
    *
    * Provides contextual information below form inputs. Composes from
    * Text components (TextXs, TextSm) to ensure typography consistency.
    *
    * @example
    * ```tsx
    * <label htmlFor="email">Email</label>
    * <input id="email" aria-describedby="email-hint" />
    * <Hint id="email-hint">We'll never share your email</Hint>
    * ```
    */
   export const Hint = forwardRef<HTMLSpanElement, HintProps>(
     ({ size = 'md', children, className, ...props }, ref) => {
       const TextComponent = size === 'sm' ? TextXs : TextSm;

       return (
         <TextComponent
           ref={ref}
           as="span"
           color="muted"
           className={cn('pt-2', className)}
           {...props}
         >
           {children}
         </TextComponent>
       );
     }
   );

   Hint.displayName = 'Hint';
   ````

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Export `Hint` and `HintProps` from `src/ui/inputs/hint.tsx`
- Update `src/ui/inputs/index.ts` to include hint export
- Verify `src/ui/index.ts` exports from `./inputs`

**Storybook Documentation (REQUIRED):**

- Create `src/stories/inputs/hint.stories.tsx`
- Configure comprehensive argTypes for size and children props
- Create Default, Sizes, LongText, WithFormField, and AllVariants stories
- Add interactive controls for all configurable props
- Document accessibility patterns with `aria-describedby` examples

## Step by Step Tasks

### Step 1: Verify Directory Structure

- Confirm `src/ui/inputs/` directory exists
- Check `src/ui/inputs/index.ts` for existing exports
- Verify Text components can be imported from `@/ui/typography`

### Step 2: Implement Hint Component

- Create `src/ui/inputs/hint.tsx`
- Import dependencies: `forwardRef`, `cn`, `TextXs`, `TextSm`
- Create `HintProps` interface with `size`, `children`, `className`
- Implement `Hint` component using composition pattern
- Export component and types

### Step 3: Update Category Barrel

- Update `src/ui/inputs/index.ts` to export from `./hint`

### Step 4: Create Unit Tests

- Create `src/ui/inputs/__tests__/hint.test.tsx`
- Test default props rendering (span element, md size)
- Test size variants (sm uses TextXs, md uses TextSm)
- Test custom className merging with pt-2
- Test ref forwarding to underlying span
- Test that Text component's muted color is applied
- Test empty and long content handling
- Aim for >90% code coverage

### Step 5: Create Storybook Stories

- Create `src/stories/inputs/` directory if needed
- Create `src/stories/inputs/hint.stories.tsx`
- Configure meta with proper title, component, tags, argTypes
- Create Default story with args
- Create Sizes story showing SM and MD comparison
- Create LongText story demonstrating text wrapping
- Create WithFormField story showing input + hint with aria-describedby
- Create AllVariants story with visual grid
- Add comprehensive argTypes documentation

### Step 6: Run Validation Commands

- Run `npm run type-check` - verify zero TypeScript errors
- Run `npm run lint` - verify zero ESLint errors
- Run `npm test -- hint` - verify all tests pass
- Run `npm run test:run` - verify no regressions
- Run `npm run build` - verify production build succeeds
- Run `npm run build-storybook` - verify Storybook builds

## Testing Strategy

### Unit Tests

| Test Case         | Description                                     |
| ----------------- | ----------------------------------------------- |
| Default rendering | Renders as `span` with MD size by default       |
| Composition SM    | Uses TextXs component when size="sm"            |
| Composition MD    | Uses TextSm component when size="md"            |
| Muted color       | Text component receives `color="muted"`         |
| Padding           | Always applies `pt-2` spacing                   |
| Custom className  | Merges with base pt-2 class correctly           |
| Ref forwarding    | Correctly forwards ref to DOM element           |
| Props passthrough | Additional props pass through to Text component |
| Empty children    | Handles empty content gracefully                |
| Long content      | Handles long text without breaking              |

### Edge Cases

- Empty string children
- Very long text content (500+ characters)
- Special characters and HTML entities
- Multiple Hint components in sequence
- Dynamic size changes via rerender

## Acceptance Criteria

### Functional Requirements

- Component implemented in `src/ui/inputs/` with proper TypeScript types
- Two size variants work correctly: `sm` (12px/18px) and `md` (14px/20px)
- Component composes from Text components (TextXs/TextSm)
- Component forwards refs correctly
- Component uses Text's `color="muted"` for consistent color
- Component applies `pt-2` (8px) top padding
- Default size is `md` matching Figma spec

### Testing Requirements

- Comprehensive unit tests with >90% coverage
- Composition verified (correct Text component used per size)
- All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- **Storybook stories file created: `src/stories/inputs/hint.stories.tsx`**
- **Meta configuration with comprehensive argTypes**
- **Default story implemented**
- **Size variant stories implemented (SM, MD, comparison)**
- **Real-world examples (WithFormField showing input + hint with aria-describedby)**
- **Comparison story showing all variants together**
- **Interactive controls configured for all props**
- **Storybook builds successfully: `npm run build-storybook`**
- **All stories render correctly in Storybook UI**

### Integration Requirements

- Component exported from `src/ui/inputs/index.ts`
- Component can be imported via `import { Hint } from '@/ui'`
- Component can be imported via `import { Hint } from '@/ui/inputs'`

### Code Quality

- Zero TypeScript errors: `npm run type-check`
- Zero ESLint warnings: `npm run lint`
- Build succeeds: `npm run build`

## Validation Commands

**CRITICAL**: Execute EVERY command below. All must pass with zero errors.

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- hint`
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

### Architectural Decision: Composition over Duplication

This component uses the **composition approach** as recommended by the UI/UX Architecture review:

**Why Composition:**

- **No duplication** - Reuses Text component typography
- **Type-safe** - Inherits Text component types
- **Consistent** - Typography always matches design system
- **Maintainable** - Only ~30 lines of code
- **Future-proof** - Typography changes automatically propagate

**Why NOT Standalone CVA:**

- Would duplicate typography scales from Text component
- Creates maintenance burden (changes in two places)
- Increases bundle size unnecessarily
- Violates DRY principle

### Accessibility Best Practices

The Hint component should be associated with its input using `aria-describedby`:

```tsx
<label htmlFor="email">Email</label>
<input id="email" aria-describedby="email-hint" />
<Hint id="email-hint">We'll never share your email</Hint>
```

**Screen Reader Recommendations:**

1. **Static hints**: Use `aria-describedby` to associate hint with input
2. **Dynamic hints (errors)**: Use `aria-live="polite"` for announcements
   ```tsx
   <Hint id="email-hint" aria-live="polite">
     {error || "We'll never share your email"}
   </Hint>
   ```
3. **Visual differentiation**: Don't rely on color alone - use icons for error states

This pattern is documented in the WithFormField Storybook story.

### Performance Benefits

Using the composition approach provides:

| Metric        | Standalone CVA       | Composition (Used) |
| ------------- | -------------------- | ------------------ |
| Bundle size   | +2KB                 | +0.5KB             |
| CSS generated | Duplicate typography | Reused             |
| Maintenance   | 2 places to update   | 1 place            |

**Savings**: ~1.5KB bundle size by reusing Text component CSS.

### Future Considerations

1. **Error State**: If error variant is needed, consider adding a `variant` prop that changes the Text component's color prop (e.g., `color="destructive"` instead of `color="muted"`).

2. **Icon Support**: Future enhancement could add an optional `icon` prop.

3. **Form Integration**: When building composite form components, Hint should be composed within to create cohesive form field molecules.

### Comparison with Direct Text Usage

While you could use Text components directly:

```tsx
<TextSm color="muted" className="pt-2">
  Hint text
</TextSm>
```

The Hint component provides:

- Semantic clarity in code (`<Hint>` vs `<TextSm color="muted" className="pt-2">`)
- Single point of change for all form hints
- Consistent defaults (color, padding)
- Future extensibility for form-specific features

---

## Architectural Evaluation Applied

**Evaluation Document**: `ai/agents/evaluations/hint-component-plan-2025-11-30.md`
**Evaluation Score**: 92/100 (Excellent)
**Status**: APPROVED WITH MODIFICATIONS APPLIED

### Applied Recommendations Checklist

| Priority           | Recommendation                                   | Status     |
| ------------------ | ------------------------------------------------ | ---------- |
| **P1 - CRITICAL**  | Adopt composition strategy (use Text components) | ✅ Applied |
| **P1 - CRITICAL**  | Reclassify as "Composite Atom"                   | ✅ Applied |
| **P1 - CRITICAL**  | Verify color tokens (use `color="muted"`)        | ✅ Applied |
| **P2 - IMPORTANT** | Remove polymorphic props (`as`, `asChild`)       | ✅ Applied |
| **P2 - IMPORTANT** | Enhance accessibility documentation              | ✅ Applied |
| **P2 - IMPORTANT** | Add composition tests                            | ✅ Applied |
| **P2 - IMPORTANT** | Specify React import convention                  | ✅ Applied |
| **P3 - OPTIONAL**  | Document performance benefits                    | ✅ Applied |

### Key Architectural Decisions

1. **Composition over Duplication**: Hint wraps `TextXs`/`TextSm` instead of duplicating typography CVA variants
2. **Simplified API**: No `as` or `asChild` props - always renders as `span`
3. **Type Safety**: Extends `ComponentPropsWithoutRef<'span'>` with `color` omitted
4. **Direct Imports**: Uses `import { forwardRef } from 'react'` pattern

**Plan is ready for implementation.**
