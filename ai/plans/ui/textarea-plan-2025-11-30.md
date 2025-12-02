# Ui: Textarea

**Architectural Evaluation Score:** 95/100 - EXCELLENT ✅ APPROVED

---

## Component Description

The Textarea component is a multi-line text input field for forms, allowing users to enter longer text content such as comments, descriptions, messages, or any freeform text. It provides visual feedback for different states (empty, hovered, focused, typing, filled, disabled, and error) and supports two sizes (MD and LG) to match the design system's sizing conventions.

The Textarea follows the same dual-API pattern established by TextInput - providing both a standalone `Textarea` component for maximum flexibility and a `TextareaField` wrapper for convenient form field composition with label, hint, and error message.

## User Story

As a **developer building forms**
I want to **use a styled, accessible multi-line text input component**
So that **I can collect longer text input from users with consistent styling across the application**

## Problem Statement

The application needs a multi-line text input component that:

1. Follows the established design system patterns from Glow UI Figma
2. Maintains consistency with existing input components (TextInput, NumberInput)
3. Supports multiple visual states and sizes
4. Composes with existing form atoms (InputLabel, Hint, ErrorMessage)
5. Is fully accessible with proper ARIA attributes

## Solution Statement

Create a Textarea component following the established TextInput patterns:

1. **Textarea** (standalone) - A styled `<textarea>` element with wrapper for consistent styling
2. **TextareaField** (wrapper) - A convenience component that composes Textarea with InputLabel, Hint, and ErrorMessage

The component will use CVA for variant management, support ref forwarding, and integrate seamlessly with the existing form input ecosystem.

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: The Textarea is a molecule because:

1. It composes from atoms (typography styles for text)
2. It has multiple visual states and variants
3. It serves as a building block for larger form organisms
4. The TextareaField wrapper creates an even larger molecule by composing multiple atoms (InputLabel, Hint, ErrorMessage)

**Composition Requirements**:

- **Required Atoms**:
  - Typography tokens from `@/ui/typography` (inherited through CSS)
  - `InputLabel` from `@/ui/inputs` (for TextareaField)
  - `Hint` from `@/ui/inputs` (for TextareaField)
  - `ErrorMessage` from `@/ui/inputs` (for TextareaField)

## Component Location

**Location**: `src/ui/inputs/textarea.tsx` and `src/ui/inputs/textarea-field.tsx`

**Category**: `inputs`

**Reasoning**: The Textarea belongs in the `inputs` category alongside TextInput, NumberInput, and other form input components. It follows the same patterns and will be used in the same contexts.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/textarea.tsx
export { Textarea, textareaVariants, textareaWrapperVariants };
export type { TextareaProps };

// 2. Create field component: src/ui/inputs/textarea-field.tsx
export { TextareaField };
export type { TextareaFieldProps };

// 3. Update category barrel: src/ui/inputs/index.ts
export * from './textarea';
export * from './textarea-field';

// 4. Import usage (recommended):
import { Textarea, TextareaField } from '@/ui';

// 5. Import usage (alternative):
import { Textarea, TextareaField } from '@/ui/inputs';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/inputs/text-input.tsx`** - Primary reference for CVA patterns, prop structure, wrapper approach, and TypeScript types. The Textarea should follow this exact pattern.

- **`src/ui/inputs/text-input-field.tsx`** - Reference for how to compose the field wrapper with InputLabel, Hint, ErrorMessage, and size mapping.

- **`src/ui/inputs/input-label.tsx`** - Existing atom to compose with for labels.

- **`src/ui/inputs/hint.tsx`** - Existing atom to compose with for hint text.

- **`src/ui/inputs/error-message.tsx`** - Existing atom to compose with for error messages.

- **`src/stories/inputs/text-input.stories.tsx`** - Reference for story structure, argTypes configuration, and comprehensive story coverage.

- **`src/ui/inputs/__tests__/text-input.test.tsx`** - Reference for testing patterns (if exists).

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/textarea.tsx` (REQUIRED)
   - Standalone Textarea component with CVA variants

2. **Field component file**: `src/ui/inputs/textarea-field.tsx` (REQUIRED)
   - Convenience wrapper composing Textarea with InputLabel, Hint, ErrorMessage

3. **Test file**: `src/ui/inputs/__tests__/textarea.test.tsx` (REQUIRED)
   - Comprehensive unit tests for Textarea component

4. **Field test file**: `src/ui/inputs/__tests__/textarea-field.test.tsx` (REQUIRED)
   - Tests for TextareaField composition and accessibility

5. **Story file**: `src/stories/inputs/textarea.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
   - Comprehensive Storybook documentation

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required - Default behavior, full width support
- **Tablet (md: 768px - 1023px)**: Required - Maintains full functionality
- **Mobile (< 768px)**: Required - Touch-friendly sizing, responsive width

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2031-145826&m=dev
- Screenshot reviewed showing all states

**Design Specifications from Figma**:

#### States (9 total):

1. **Empty** - Placeholder text visible, default border
2. **Hovered** - Slightly darker border
3. **Focused** - Primary (brand) border color with ring
4. **Typing** - Primary border, user input with cursor
5. **Filled** - Default border, filled text
6. **Disabled** - Light gray background, no interactions
7. **Disabled - Filled** - Light gray background with filled text
8. **Error** - Red destructive border
9. **Error - Filled** - Red destructive border with filled text

#### Sizes (2 total):

- **MD (Medium)**: Smaller padding and typography (14px text)
- **LG (Large)**: Larger padding and typography (16px text) - Default

#### Styling Details from Figma:

- **Container width**: 320px (in design, but component should be full-width)
- **Border radius**: 6px (rounded-sm)
- **Default border**: `#d7dbdf` (border-base-primary)
- **Hover border**: `#c1c8cd` (border-base-primary_hover)
- **Focus border**: `#3c61dd` (border-brand-solid / primary)
- **Error border**: `#e54d2e` (border-danger-solid / destructive)
- **Disabled background**: `#f9fafb` (bg-surface-base-secondary)
- **Normal background**: `#ffffff` (bg-surface-base-primary)
- **Placeholder text color**: `#889096` (text-base-tertiary)
- **Filled text color**: `#11181c` (text-base-primary)

#### Size-specific styling:

**LG (Large)**:

- Padding: 16px horizontal, 12px vertical (px-4 py-3)
- Text size: 16px (text-base)
- Line height: 24px (leading-6)
- Label bottom padding: 12px

**MD (Medium)**:

- Padding: 12px horizontal, 10px vertical (px-3 py-2.5)
- Text size: 14px (text-sm)
- Line height: 20px (leading-5)
- Label bottom padding: 10px

#### Textarea-specific features:

- Resizable (native browser resize handle)
- Min-height based on container (flexible)
- Scrollbar visible when content overflows

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/textarea.stories.tsx`

**Required Stories**:

1. **Default** - Basic Textarea with LG size and placeholder
2. **Sizes** - Comparison of MD and LG sizes
3. **AllStates** - Grid showing Empty, Filled, Disabled, Disabled-Filled, Error, Error-Filled
4. **ManualComposition** - Using Textarea with InputLabel, Hint, ErrorMessage manually
5. **FieldDefault** - TextareaField basic usage
6. **FieldWithHint** - TextareaField with hint text
7. **FieldWithError** - TextareaField showing error state
8. **FieldFullFeatured** - TextareaField with required, icon, hint
9. **FieldAllSizes** - Both sizes with full field composition
10. **Resizable** - Demonstrating resize behavior
11. **WithRowsConfiguration** - Different rows configurations
12. **FormIntegration** - Real-world form example with TextareaField
13. **AllCombinations** - Comprehensive grid of all size/state combinations
14. **WhenToUseWhich** - Side-by-side comparison of Textarea vs TextareaField

**Story Requirements**:

- Use `satisfies Meta<typeof Textarea>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: 'centered'`
- Create interactive controls for all configurable props

## Implementation Plan

### Phase 1: Foundation

1. Research existing TextInput implementation patterns
2. Identify shared utilities and types to reuse
3. Plan CVA variants matching Figma specifications

### Phase 1.5: Extract Shared Constants (RECOMMENDED)

Before implementing, extract shared constants to reduce duplication:

1. Create `src/ui/inputs/constants.ts` with:

   ```typescript
   export const INPUT_LABEL_SIZE_MAP = {
     sm: 'sm',
     md: 'sm',
     lg: 'md',
   } as const;

   export const HINT_SIZE_MAP = {
     sm: 'sm',
     md: 'sm',
     lg: 'md',
   } as const;

   export type InputSize = keyof typeof INPUT_LABEL_SIZE_MAP;
   ```

2. Update `src/ui/inputs/text-input-field.tsx` to import from `./constants`

3. Update `src/ui/inputs/index.ts` to export constants:
   ```typescript
   export * from './constants';
   ```

### Phase 2: Core Implementation

1. Create `textarea.tsx` with:
   - `textareaWrapperVariants` CVA for container styling
   - `textareaVariants` CVA for textarea element styling
   - `Textarea` component with forwardRef
   - Props interface matching TextInput pattern

2. Create `textarea-field.tsx` with:
   - `TextareaField` component composing atoms
   - Size mapping (similar to TextInputField)
   - Automatic ID generation and ARIA associations

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add exports to `src/ui/inputs/index.ts`
- Components available via `import { Textarea, TextareaField } from '@/ui'`

**Storybook Documentation (REQUIRED):**

- Story file: `src/stories/inputs/textarea.stories.tsx`
- All 14+ stories covering variants, states, composition
- Interactive controls and comprehensive argTypes
- Real-world usage examples

## Step by Step Tasks

### 1. Create Textarea Standalone Component

- Create `src/ui/inputs/textarea.tsx`
- Define `textareaWrapperVariants` with CVA:
  - Size variants: `md`, `lg` (default: `lg`)
  - Error variant: `true`, `false` (default: `false`)
  - Base classes: flex, rounded-sm, border, bg-background, transitions
  - Focus-within states for border and ring
  - Disabled states via `has-[:disabled]`
- Define `textareaVariants` with CVA:
  - Size variants for typography (text-sm vs text-base)
  - Base classes: w-full, bg-transparent, border-none, outline-none
  - Placeholder and disabled styling
- Create `TextareaProps` interface:
  - Extends `ComponentPropsWithoutRef<'textarea'>`
  - Custom props: `size`, `error`, `wrapperClassName`
- Implement `Textarea` component with `forwardRef`
- Add JSDoc documentation with usage examples

### 2. Create TextareaField Composition Component

- Create `src/ui/inputs/textarea-field.tsx`
- Define `TextareaFieldProps` interface:
  - `label`, `labelProps` for InputLabel
  - `hint`, `hintProps` for Hint
  - `error`, `errorProps` for ErrorMessage
  - `containerClassName` for wrapper
- Use size mapping from TextInput (INPUT_LABEL_SIZE_MAP, HINT_SIZE_MAP)
- Implement with `useId()` for automatic ID generation
- Build `aria-describedby` for accessibility
- Add JSDoc documentation with usage examples

### 3. Update Barrel Exports

- Add to `src/ui/inputs/index.ts`:
  ```typescript
  export * from './textarea';
  export * from './textarea-field';
  ```

### 4. Create Unit Tests for Textarea

- Create `src/ui/inputs/__tests__/textarea.test.tsx`
- Test cases:
  - Renders with default props
  - Applies size variants correctly (md, lg)
  - Shows error styling when error=true
  - Forwards ref to textarea element
  - Passes additional props to textarea
  - Handles disabled state
  - Applies custom className and wrapperClassName
  - Placeholder text renders correctly
  - Value/defaultValue works correctly

### 5. Create Unit Tests for TextareaField

- Create `src/ui/inputs/__tests__/textarea-field.test.tsx`
- Test cases:
  - Renders label when provided
  - Renders hint when provided (no error)
  - Renders error message when provided (hides hint)
  - Generates unique IDs with useId
  - Sets aria-describedby correctly
  - Sets aria-invalid when error present
  - Size mapping works correctly
  - Passes labelProps, hintProps, errorProps

### 6. Create Storybook Stories (REQUIRED)

- Create `src/stories/inputs/textarea.stories.tsx`
- Implement meta configuration with argTypes:
  - `size`: select control with options ['md', 'lg']
  - `error`: boolean control
  - `disabled`: boolean control
  - `placeholder`: text control
  - `rows`: number control
- Implement all required stories:
  - Default
  - Sizes
  - AllStates
  - ManualComposition
  - FieldDefault
  - FieldWithHint
  - FieldWithError
  - FieldFullFeatured
  - FieldAllSizes
  - Resizable
  - WithRowsConfiguration
  - FormIntegration
  - AllCombinations
  - WhenToUseWhich

### 7. Run Validation Commands

- Execute all validation commands to ensure zero regressions

## Testing Strategy

### Unit Tests

**Textarea Component:**

- Rendering with default props
- Size variant application (md, lg)
- Error state styling
- Disabled state handling
- Ref forwarding
- Custom className support
- wrapperClassName support
- Placeholder rendering
- Value handling (controlled/uncontrolled)

**TextareaField Component:**

- Label rendering and association
- Hint rendering when no error
- Error message rendering (replaces hint)
- ARIA attribute generation
- ID generation with useId
- Size mapping to child components
- Props forwarding to child components

### Edge Cases

- Empty value with placeholder
- Very long text content (scrolling)
- Disabled with filled value
- Error with filled value
- No label provided
- No hint or error provided
- Custom rows attribute
- Resize behavior testing
- Required field indicator

## Acceptance Criteria

### Functional Requirements

- ✅ Textarea component implemented in `src/ui/inputs/textarea.tsx` with proper TypeScript types
- ✅ TextareaField component implemented in `src/ui/inputs/textarea-field.tsx`
- ✅ All size variants work correctly (md, lg)
- ✅ All state variants work correctly (default, hover, focus, disabled, error)
- ✅ Component forwards refs correctly to textarea element
- ✅ Component follows design system patterns (CVA, semantic tokens)
- ✅ Placeholder text displays correctly with proper color
- ✅ Native resize functionality works as expected

### Testing Requirements

- ✅ Comprehensive unit tests for Textarea with >90% coverage
- ✅ Comprehensive unit tests for TextareaField with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/textarea.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **Size stories implemented (MD, LG comparison)**
- ✅ **ALL state stories implemented (empty, filled, disabled, error)**
- ✅ **Manual composition examples showing atom composition**
- ✅ **TextareaField stories (default, hint, error, full-featured)**
- ✅ **Real-world form integration example**
- ✅ **Comparison story showing all combinations**
- ✅ **WhenToUseWhich story comparing Textarea vs TextareaField**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts` - already exports from inputs)
- ✅ Component can be imported via `import { Textarea, TextareaField } from '@/ui'`

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

3. **Run component tests**: `npm test -- textarea`
   - Expected: All Textarea and TextareaField tests pass with >90% coverage
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

## Migration Guide

### When to Use Textarea

Replace TextInput with Textarea when:

- ✅ User needs to enter multi-line text (comments, descriptions, messages)
- ✅ Content may exceed 100 characters
- ✅ Line breaks are meaningful in the content
- ✅ User should see multiple lines at once

Keep TextInput when:

- ❌ Single-line input is sufficient (name, email, URL)
- ❌ Validation requires specific format (no line breaks)
- ❌ Add-ons (leftAddOn, rightAddOn) are needed (Textarea doesn't support these)

### Migration Examples

**Before (TextInput for long content - not ideal):**

```tsx
<TextInputField label="Description" placeholder="Enter description..." />
```

**After (Textarea - better UX for long content):**

```tsx
<TextareaField label="Description" placeholder="Enter description..." rows={4} />
```

**Choosing Between Textarea and TextareaField:**

| Use Case                       | Component                       | Reasoning                           |
| ------------------------------ | ------------------------------- | ----------------------------------- |
| Standard form field with label | `TextareaField`                 | Convenience, accessibility built-in |
| Custom layout needed           | `Textarea`                      | Maximum flexibility                 |
| Complex label component        | `Textarea` + manual composition | Full control over atoms             |
| Quick prototyping              | `TextareaField`                 | Works out-of-box                    |

---

## Notes

### Design Decisions

1. **Dual API pattern** - Following TextInput's approach with both standalone and field wrapper components provides maximum flexibility for developers.

2. **No resize restrictions** - The native browser resize handle is preserved. If specific resize behavior is needed, it can be controlled via CSS (`resize: none`, `resize: vertical`, etc.).

3. **Size mapping** - The same INPUT_LABEL_SIZE_MAP and HINT_SIZE_MAP from TextInputField are reused to maintain consistency.

4. **No min-height enforcement** - The component allows the `rows` attribute to control initial height, giving developers full control.

### Future Considerations

1. **Character counter** - Could add optional character count display with max length indicator
2. **Auto-resize** - Could add variant that auto-grows with content
3. **Markdown preview** - Could add optional markdown preview pane

### Accessibility Notes

- Native `<textarea>` element ensures screen reader compatibility
- Labels associated via `htmlFor`/`id` attributes
- Error messages associated via `aria-describedby`
- Invalid state communicated via `aria-invalid`
- Required state communicated via `aria-required`

### Accessibility Edge Cases

#### Character Count Announcements

If implementing a character counter in the future:

```tsx
<TextareaField
  label="Bio"
  hint={`${value.length}/${maxLength} characters`}
  aria-describedby={`bio-hint bio-char-count`}
  aria-live="polite" // Announces count changes
  maxLength={maxLength}
/>
```

#### Screen Reader Testing Checklist

- ✅ Label announces on focus
- ✅ Hint announces after label (via aria-describedby)
- ✅ Error announces and replaces hint
- ✅ Required state announces (via aria-required)
- ✅ Character limits announce (via aria-live) - if implemented

#### Keyboard Navigation

- ✅ Tab: Move focus to textarea
- ✅ Shift+Tab: Move focus away
- ✅ Ctrl+A: Select all text (native)
- ✅ Ctrl+Z: Undo (native)
- ✅ No custom keyboard handlers needed (native element handles all)
