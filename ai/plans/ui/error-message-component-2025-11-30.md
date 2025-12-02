# Ui: ErrorMessage

## Component Description

The ErrorMessage component is a form feedback element that displays error messages with optional icon support. It provides visual feedback for form validation errors, showing a danger-styled message with an alert circle icon. The component supports two size variants (SM and MD) to align with the form input sizing system used across the application.

This component is essential for form validation UI, providing consistent error messaging that matches the Glow UI design system. It complements the existing InputLabel component to create a complete form field experience.

## User Story

As a user filling out a form
I want to see clear, visually distinct error messages when validation fails
So that I can quickly identify and fix issues with my input

## Problem Statement

Forms require clear, consistent error feedback to guide users in correcting their input. Currently, the design system lacks a dedicated error message component that follows the Glow UI design patterns, making it difficult to implement consistent error states across form fields.

## Solution Statement

Create an ErrorMessage component in the inputs category that:

- Displays error text with destructive/danger styling
- Optionally shows an alert circle icon (filled variant)
- Supports SM (12px text) and MD (14px text) size variants
- Uses semantic color tokens for danger/destructive states
- Follows existing CVA and component patterns from the design system
- Composes with existing Icon atom for the alert icon
- Includes `role="alert"` for proper screen reader announcements
- Supports optional `id` prop for ARIA association patterns (`aria-describedby`)

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: ErrorMessage is a molecule because it combines multiple atoms (Typography/Text and Icon) to create a focused, reusable form feedback component. It's more than a simple text display but not complex enough to be an organism.

**Composition Requirements**:

- **Required Atoms**:
  - `Icon` from `@/ui/icons` - For the alert-circle icon display
  - Typography patterns from `@/ui/typography` - For consistent text styling (will use direct classes following Text patterns)

- **Required Molecules**: None - This is a simple molecule

## Component Location

**Location**: `src/ui/inputs/error-message.tsx`

**Category**: `inputs` - This component provides error feedback for form inputs and logically belongs with other input-related components like InputLabel.

**Reasoning**: The ErrorMessage component is part of the form/input ecosystem. Placing it in the `inputs` category maintains consistency with InputLabel and future input-related components (Hint, input fields, etc.).

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/error-message.tsx
export { ErrorMessage, errorMessageVariants };
export type { ErrorMessageProps, ErrorMessageVariants };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './error-message';

// 3. Import usage (recommended):
import { ErrorMessage } from '@/ui';

// 4. Import usage (alternative):
import { ErrorMessage } from '@/ui/inputs';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/inputs/input-label.tsx`** - Primary reference for component structure, CVA patterns, size variants (SM/MD), and prop patterns for the inputs category
- **`src/ui/inputs/__tests__/input-label.test.tsx`** - Testing patterns for input-related components
- **`src/stories/inputs/input-label.stories.tsx`** - Storybook patterns for input components
- **`src/ui/icons/icon.tsx`** - Icon component to compose with for alert circle icon
- **`src/ui/typography/text.tsx`** - Text styling patterns and color variants
- **`src/app/globals.css`** - Semantic color tokens (`--color-destructive`, `text-destructive`)

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/error-message.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/error-message.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/error-message.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
4. **Update barrel**: `src/ui/inputs/index.ts` - Add export for error-message

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: No specific responsive changes needed
- **Tablet (md: 768px - 1023px)**: No specific responsive changes needed
- **Mobile (< 768px)**: No specific responsive changes needed

The component is inherently responsive as it uses relative text sizing and flexible layout.

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2367-169487&m=dev

**Design Specifications from Figma**:

1. **Layout**:
   - Horizontal flex container with gap of 6px (`gap-1.5`)
   - Padding top of 8px (`pt-2`) for both sizes
   - Align items at start

2. **Icon**:
   - Alert circle solid (filled) icon from Phosphor Icons (`WarningCircle` with `fill` weight)
   - Size MD: 16px icon (use Icon `size="sm"`)
   - Size SM: 14px icon (use Icon `size="sm"` with custom `className="size-[14px]"` override)
   - Color: `#e54d2e` (destructive color)
   - Icon wrapper with 2px vertical padding to align with text
   - Note: Icon component lacks 14px variant, so SM size requires className override

3. **Typography**:
   - Font: Inter Medium (font-weight: 500)
   - Size MD: 14px text, 20px line-height (`text-sm leading-5`)
   - Size SM: 12px text, 18px line-height (`text-xs leading-[18px]`)
   - Color: `#e54d2e` (destructive - `text-destructive`)

4. **States**:
   - Default (visible error message)
   - Icon shown/hidden

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/error-message.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic error message with icon (MD size)
2. **Sizes Story**: Comparison of SM and MD sizes
3. **WithIcon Story**: Error message with icon displayed
4. **WithoutIcon Story**: Error message without icon
5. **AllCombinations Story**: Grid showing all size/icon combinations
6. **FormIntegration Story**: Real-world example with form inputs
7. **LongText Story**: Handling of long error messages
8. **MultipleErrors Story**: Multiple error messages in a form context

**Story Requirements**:

- Use `satisfies Meta<typeof ErrorMessage>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: 'centered'`
- Create interactive controls for all configurable props

## Implementation Plan

### Phase 1: Foundation

1. Study the InputLabel component structure as the primary reference
2. Identify the Phosphor icon to use (`WarningCircle` with `fill` weight)
3. Map Figma design specifications to Tailwind classes

### Phase 2: Core Implementation

1. Create `error-message.tsx` with CVA variants
2. Implement size variants (SM/MD) following InputLabel patterns
3. Add showIcon prop with Icon component composition
4. Apply destructive color styling for text and icon
5. Implement proper accessibility attributes

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add export to `src/ui/inputs/index.ts`
- Ensure proper TypeScript types exported

**Storybook Documentation (REQUIRED):**

- Create comprehensive stories showing all variants
- Document accessibility considerations
- Show real-world form integration examples

## Step by Step Tasks

### 1. Research and Preparation

- Review InputLabel component implementation for patterns
- Confirm WarningCircle icon exists in Phosphor Icons
- Verify destructive color token availability

### 2. Create Component File

- Create `src/ui/inputs/error-message.tsx`
- Implement CVA variants for size (sm, md)
- Add showIcon prop with default true
- Implement text prop for error message content
- Add optional `id` prop for ARIA associations
- Compose with Icon component for alert icon
- Add forwardRef support
- Add `role="alert"` attribute for accessibility
- Add proper TypeScript types and JSDoc comments

**React Import Convention (CRITICAL):**

```typescript
// ✅ CORRECT - Use direct imports
import { forwardRef } from 'react';

// ❌ WRONG - Do NOT use namespace imports
import * as React from 'react';
```

### 3. Implement Component Styling

- Apply flex layout with gap-1.5 (6px)
- Add padding-top pt-2 (8px)
- Style text with destructive color and Inter Medium font
- Size MD: text-sm (14px), leading-5 (20px)
- Size SM: text-xs (12px), leading-[18px]
- Icon wrapper with py-0.5 for vertical alignment
- Icon size mapping:
  - Size MD: `<Icon size="sm" />` (16px)
  - Size SM: `<Icon size="sm" className="size-[14px]" />` (14px custom override)

### 4. Create Unit Tests

- Create `src/ui/inputs/__tests__/error-message.test.tsx`
- Test default rendering with text prop
- Test size variants (sm, md)
- Test icon visibility (showIcon true/false)
- Test accessibility attributes (`role="alert"`)
- Test ref forwarding
- Test className merging
- Test `id` prop passthrough for ARIA associations
- Test edge cases (long text, empty text)

### 5. Create Storybook Stories

- Create `src/stories/inputs/error-message.stories.tsx`
- Implement Default story
- Implement Sizes comparison story
- Implement WithIcon and WithoutIcon stories
- Implement AllCombinations grid story
- Implement FormIntegration real-world example
- Implement LongText edge case story
- Implement MultipleErrors form context story
- Configure comprehensive argTypes

### 6. Update Barrel Export

- Update `src/ui/inputs/index.ts` to export error-message

### 7. Run Validation Commands

- Execute all validation commands to ensure quality

## Testing Strategy

### Unit Tests

1. **Rendering Tests**
   - Renders with required text prop
   - Renders as span/div container element
   - Handles empty text gracefully

2. **Size Variant Tests**
   - Applies MD size by default
   - Applies SM size when specified
   - Correct typography classes for each size

3. **Icon Tests**
   - Shows icon by default (showIcon=true)
   - Hides icon when showIcon=false
   - Icon has correct color (destructive)
   - Icon is decorative (aria-hidden)

4. **Styling Tests**
   - Text has destructive color class
   - Correct font weight (medium)
   - Correct spacing classes

5. **Accessibility Tests**
   - Has `role="alert"` attribute for screen reader announcements
   - Icon is hidden from screen readers (`aria-hidden`)
   - Supports `id` prop for `aria-describedby` associations

6. **Composition Tests**
   - Merges custom className
   - Forwards ref correctly

### Edge Cases

- Very long error message text
- Empty text prop
- Multiple ErrorMessage components
- Integration with form inputs

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/inputs/error-message.tsx`
- ✅ Both SM and MD size variants work correctly
- ✅ showIcon prop controls icon visibility (default: true)
- ✅ Text displays in destructive color (#e54d2e)
- ✅ Icon displays in destructive color
- ✅ Component follows CVA patterns from design system
- ✅ Component composes with existing Icon atom

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ Storybook stories file created: `src/stories/inputs/error-message.stories.tsx`
- ✅ Meta configuration with comprehensive argTypes
- ✅ Default story implemented
- ✅ ALL variant stories implemented (Sizes, WithIcon, WithoutIcon)
- ✅ Real-world examples (FormIntegration, MultipleErrors)
- ✅ Comparison story showing all variants together (AllCombinations)
- ✅ Interactive controls configured for all props
- ✅ Storybook builds successfully: `npm run build-storybook`
- ✅ All stories render correctly in Storybook UI

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Component can be imported via `import { ErrorMessage } from '@/ui'` or `import { ErrorMessage } from '@/ui/inputs'`

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

3. **Run component tests**: `npm test -- error-message`
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

## Implementation Reference

**Props Interface:**

```typescript
export interface ErrorMessageProps extends VariantProps<
  typeof errorMessageVariants
> {
  text: string;
  showIcon?: boolean;
  className?: string;
  id?: string; // For aria-describedby associations
}
```

**Component Structure:**

```typescript
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { WarningCircle } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

const errorMessageVariants = cva(
  'flex items-start gap-1.5 pt-2',
  {
    variants: {
      size: {
        sm: '', // text classes applied to span
        md: '', // text classes applied to span
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export const ErrorMessage = forwardRef<HTMLDivElement, ErrorMessageProps>(
  ({ size = 'md', text, showIcon = true, className, id }, ref) => {
    return (
      <div
        ref={ref}
        id={id}
        role="alert"
        className={cn(errorMessageVariants({ size }), className)}
      >
        {showIcon && (
          <Icon
            icon={WarningCircle}
            size="sm"
            weight="fill"
            color="destructive"
            className={size === 'sm' ? 'size-[14px]' : undefined}
            aria-hidden
          />
        )}
        <span
          className={cn(
            'font-medium text-destructive',
            size === 'sm' ? 'text-xs leading-[18px]' : 'text-sm leading-5'
          )}
        >
          {text}
        </span>
      </div>
    );
  }
);

ErrorMessage.displayName = 'ErrorMessage';
```

**ARIA Association Usage Example:**

```tsx
<input
  aria-invalid="true"
  aria-describedby="email-error"
/>
<ErrorMessage
  id="email-error"
  text="Email is required"
/>
```

## Notes

- The ErrorMessage component is designed to work alongside InputLabel to create complete form field compositions
- Future consideration: This component could be extended to support different severity levels (warning, info) if needed
- The component uses the Phosphor Icons `WarningCircle` icon with `fill` weight for the filled alert circle appearance shown in Figma
- Color `#e54d2e` maps to the existing `--color-destructive` token in the design system
- Consider creating a FormField compound component in the future that combines InputLabel, input element, and ErrorMessage

## Architectural Evaluation Applied

This plan incorporates recommendations from `ai/agents/evaluations/error-message-plan-2025-11-30.md`:

1. ✅ **HIGH PRIORITY** - Added `role="alert"` for accessibility
2. ✅ **MEDIUM PRIORITY** - Icon size mapping with custom className for SM variant (14px)
3. ✅ **LOW PRIORITY** - Added optional `id` prop for ARIA associations
4. ✅ **DOCUMENTATION** - React import conventions documented

**Architectural Score: 95/100** - APPROVED for implementation
