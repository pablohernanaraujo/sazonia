# Ui: TextareaFloatingLabel

## Component Description

TextareaFloatingLabel is an enhanced multi-line text input component that features a floating label animation pattern. When the textarea is empty, the label appears as placeholder text inside the field. Upon focus or when the textarea has a value, the label smoothly animates to float above the input border, creating a modern and elegant form experience.

This component mirrors the existing `TextInputFloatingLabel` pattern but applies it to multi-line text areas. It maintains visual consistency across the form system while providing the appropriate multi-line editing capabilities.

## User Story

As a form user
I want to see clear labels that animate elegantly when I interact with multi-line text fields
So that I understand what information is required and have a modern, polished form experience

## Problem Statement

The current design system has `TextInputFloatingLabel` for single-line inputs and `Textarea` for multi-line inputs, but lacks a multi-line textarea with the floating label animation pattern. Users who need to enter longer text content (comments, descriptions, messages) don't have access to the same elegant floating label UX as single-line inputs.

## Solution Statement

Create a `TextareaFloatingLabel` component that combines the floating label animation behavior from `TextInputFloatingLabel` with the multi-line capabilities of `Textarea`. The component will support all the same states (Empty, Hovered, Focused, Typing, Filled, Disabled, Disabled-Filled, Error, Error-Filled) and include optional required indicator, hint text support, and error message handling through a companion `TextareaFloatingLabelField` wrapper.

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: TextareaFloatingLabel is a molecule because it combines multiple atomic elements (label, textarea) into a single, functional unit with coordinated behavior. The floating label animation pattern requires the label and textarea to work together in a way that an atom cannot achieve alone.

**Composition Requirements**:

- **Required Atoms**:
  - `Hint` from `@/ui/inputs` - For hint text display in the Field wrapper
  - `ErrorMessage` from `@/ui/inputs` - For error message display in the Field wrapper
- **Internal Elements**:
  - Native `<textarea>` element (styled internally)
  - Native `<label>` element with floating animation (styled internally)

- **Status**: Molecule composing internal elements with coordinated behavior

## Component Location

**Location**: `src/ui/inputs/textarea-floating-label.tsx`

**Category**: `inputs`

**Reasoning**: This component belongs in the `inputs` category alongside other form input components (`TextInputFloatingLabel`, `Textarea`, `TextInput`). It provides text input functionality with enhanced UX patterns, fitting naturally with existing input components.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/textarea-floating-label.tsx
export {
  TextareaFloatingLabel,
  textareaFloatingLabelWrapperVariants,
  textareaFloatingLabelVariants,
};
export type { TextareaFloatingLabelProps };

// 2. Create field wrapper: src/ui/inputs/textarea-floating-label-field.tsx
export { TextareaFloatingLabelField };
export type { TextareaFloatingLabelFieldProps };

// 3. Update category barrel: src/ui/inputs/index.ts
export * from './textarea-floating-label';
export * from './textarea-floating-label-field';

// 4. Import usage (recommended):
import { TextareaFloatingLabel, TextareaFloatingLabelField } from '@/ui';

// 5. Import usage (alternative):
import { TextareaFloatingLabel, TextareaFloatingLabelField } from '@/ui/inputs';
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/inputs/text-input-floating-label.tsx`** - Primary reference for floating label behavior
  - Contains the floating label animation logic with `shouldFloat` calculation
  - Shows CVA pattern for wrapper and label variants with compound variants
  - Demonstrates autofill detection pattern
  - Shows how to handle controlled vs uncontrolled modes

- **`src/ui/inputs/text-input-floating-label-field.tsx`** - Reference for Field wrapper pattern
  - Shows composition with Hint and ErrorMessage atoms
  - Demonstrates ARIA attribute handling for accessibility
  - Shows ID generation pattern with useId()

- **`src/ui/inputs/textarea.tsx`** - Reference for textarea-specific patterns
  - Contains textarea wrapper and element variants
  - Shows resize behavior handling
  - Demonstrates size variant pattern (md/lg)

- **`src/ui/inputs/textarea-field.tsx`** - Reference for textarea Field wrapper
  - Shows label composition with labelProps
  - Demonstrates size mapping between field and atoms

- **`src/ui/inputs/hint.tsx`** - Hint atom for hint text display
- **`src/ui/inputs/error-message.tsx`** - ErrorMessage atom for error display

- **`src/stories/inputs/text-input-floating-label.stories.tsx`** - Story patterns for floating label
  - Comprehensive story structure with AllStates, WithAddons, FormIntegration
  - Shows argTypes configuration for floating label props

- **`src/stories/inputs/textarea.stories.tsx`** - Story patterns for textarea
  - Shows size comparisons, state grids, form integration examples

- **`src/ui/inputs/__tests__/text-input-floating-label.test.tsx`** - Test patterns
  - Comprehensive test coverage for floating label behavior
  - Tests for label color states, edge cases, controlled/uncontrolled modes

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/textarea-floating-label.tsx` (REQUIRED)
2. **Field wrapper file**: `src/ui/inputs/textarea-floating-label-field.tsx` (REQUIRED)
3. **Test file**: `src/ui/inputs/__tests__/textarea-floating-label.test.tsx` (REQUIRED)
4. **Test file**: `src/ui/inputs/__tests__/textarea-floating-label-field.test.tsx` (REQUIRED)
5. **Story file**: `src/stories/inputs/textarea-floating-label.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required - Standard full-width behavior within container
- **Tablet (md: 768px - 1023px)**: Required - Same as desktop, responsive width
- **Mobile (< 768px)**: Required - Full-width with appropriate touch targets

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2031-146022&m=dev

**Design Specifications** (from Figma):

**States** (9 total):

1. **Empty** - Label acts as placeholder, gray border (#d7dbdf), label in tertiary color (#889096)
2. **Hovered** - Darker border (#c1c8cd)
3. **Focused** - Blue border (2px, #3c61dd), label floats up, label text turns blue (#3c61dd), shows placeholder/cursor
4. **Typing** - Same as focused with text visible
5. **Filled** - Label floating, gray label (#889096), gray border (1px)
6. **Disabled** - Gray background (#f9fafb), muted label
7. **Disabled - Filled** - Gray background, floating label, muted text
8. **Error** - Red border (2px, #e54d2e), red label text
9. **Error - Filled** - Red border, red floating label, error message below

**Measurements**:

- Default width: 320px
- Default height: ~118px (including hint/error space)
- Border radius: 6px (`rounded-sm`)
- Padding: 16px horizontal, 14px vertical
- Floating label: positioned at top left (12px from left), with 4px horizontal padding
- Font sizes: 16px for input text, 12px for floating label, 14px for hint/error
- Required indicator: red asterisk (\*) in 14px

**Colors** (from Figma design tokens):

- Border default: `--border-base-primary` (#d7dbdf)
- Border hover: `--border-base-primary_hover` (#c1c8cd)
- Border focus/typing: `--border-brand-solid` (#3c61dd) - 2px
- Border error: `--border-danger-solid` (#e54d2e) - 2px
- Background: `--bg-surface-base-primary` (#ffffff)
- Background disabled: `--bg-surface-base-secondary` (#f9fafb)
- Label default/placeholder: `--text-base-tertiary` (#889096)
- Label focused: `--text-brand` (#3c61dd)
- Label error: `--text-danger` (#e54d2e)
- Text primary: `--text-base-primary` (#11181c)
- Required asterisk: `--text-danger` (#e54d2e)

**Typography**:

- Input text: Inter Regular, 16px, line-height 24px
- Floating label: Inter Medium, 12px, line-height 18px
- Hint text: Inter Regular, 14px, line-height 20px
- Error text: Inter Medium, 14px, line-height 20px

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/textarea-floating-label.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic TextareaFloatingLabel in empty state
2. **AllStates Story**: Grid showing all 9 visual states from Figma (Empty, Hovered, Focused, Typing, Filled, Disabled, Disabled-Filled, Error, Error-Filled)
3. **Sizes Story**: Comparison of MD and LG size variants (if implementing sizes)
4. **WithHint Story**: TextareaFloatingLabelField with hint text
5. **WithError Story**: TextareaFloatingLabelField with error state showing error message
6. **FormIntegration Story**: Real-world form example using TextareaFloatingLabelField
7. **Controlled Story**: Demonstrates controlled vs uncontrolled patterns
8. **StandaloneVsField Story**: Side-by-side comparison showing when to use each variant
9. **AnimationDemo Story**: Interactive demo highlighting the floating label animation
10. **AllCombinations Story**: Comprehensive grid showing all state combinations

**Story Requirements**:

- Use `satisfies Meta<typeof TextareaFloatingLabel>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props:
  - `label`: text control, "The floating label text"
  - `required`: boolean control, "Shows required indicator (\*)"
  - `error`: boolean control, "Error state - applies destructive styling"
  - `disabled`: boolean control, "Disabled state"
  - `placeholder`: text control, "Placeholder text (only visible when label is floating)"
  - `rows`: number control, "Number of visible text rows"
  - `wrapperClassName`: text control, "Additional CSS classes for the wrapper element"
- Set `parameters.layout: "centered"`
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

**Example Structure**:

```typescript
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextareaFloatingLabel, TextareaFloatingLabelField } from '@/ui/inputs';

const meta = {
  title: 'Inputs/TextareaFloatingLabel',
  component: TextareaFloatingLabel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The floating label text',
    },
    required: {
      control: 'boolean',
      description: 'Shows required indicator (*)',
      table: { defaultValue: { summary: 'false' } },
    },
    error: {
      control: 'boolean',
      description: 'Error state - applies destructive styling',
      table: { defaultValue: { summary: 'false' } },
    },
    // ... more argTypes
  },
} satisfies Meta<typeof TextareaFloatingLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter your description...',
    rows: 4,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="grid w-[700px] grid-cols-2 gap-6">
      {/* All 9 states */}
    </div>
  ),
};
```

## Implementation Plan

### Phase 1: Foundation

1. Study the existing `TextInputFloatingLabel` implementation thoroughly to understand:
   - Floating label animation logic (`shouldFloat` state)
   - Autofill detection mechanism
   - Controlled vs uncontrolled input handling
   - CVA variant patterns for wrapper and label

2. Study the existing `Textarea` implementation to understand:
   - Textarea-specific styling (resize behavior)
   - Size variant pattern (md/lg)

### Phase 2: Core Implementation

1. Create `TextareaFloatingLabel` component (`src/ui/inputs/textarea-floating-label.tsx`):
   - Adapt `textInputFloatingLabelWrapperVariants` for textarea context
   - Reuse `floatingLabelVariants` pattern from TextInputFloatingLabel
   - Create `textareaFloatingLabelVariants` for the textarea element itself
   - Implement floating label logic with focus/value detection
   - Support `required` prop with asterisk indicator
   - Support `error` and `disabled` states
   - Support `rows` prop for textarea height
   - Forward ref to textarea element

2. Create `TextareaFloatingLabelField` wrapper (`src/ui/inputs/textarea-floating-label-field.tsx`):
   - Compose TextareaFloatingLabel with Hint and ErrorMessage atoms
   - Generate unique IDs with useId()
   - Handle aria-describedby for accessibility
   - Support hint/errorMessage props

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add exports to `src/ui/inputs/index.ts`:
  - `export * from './textarea-floating-label';`
  - `export * from './textarea-floating-label-field';`

**Storybook Documentation (REQUIRED):**

- Create `src/stories/inputs/textarea-floating-label.stories.tsx`
- Story file location: `src/stories/inputs/textarea-floating-label.stories.tsx`
- Stories to be created:
  - Default, AllStates, WithHint, WithError
  - FormIntegration with real-world form example
  - Controlled vs Uncontrolled patterns
  - StandaloneVsField comparison
  - AllCombinations comprehensive grid
- Interactive controls and argTypes configuration for all props
- Responsive behavior demonstrations

## Step by Step Tasks

### 1. Research and Planning

- [x] Read and understand `TextInputFloatingLabel` implementation
- [x] Read and understand `Textarea` implementation
- [x] Study the Figma design for all states and specifications
- [x] Review existing test and story patterns

### 2. Create TextareaFloatingLabel Component

- Create `src/ui/inputs/textarea-floating-label.tsx`
- Define `textareaFloatingLabelWrapperVariants` with CVA:
  - Base styles: relative positioning, flex, rounded-sm, border, transition
  - Error variant: border-2 border-destructive
  - Disabled variant: cursor-not-allowed, bg-background-secondary
- Reuse/adapt `floatingLabelVariants` from TextInputFloatingLabel:
  - Floating vs non-floating position
  - Error/focused/disabled color states
- Define `textareaFloatingLabelVariants` for textarea element:
  - Size variants if needed (can skip initially)
  - Base typography and spacing
- Implement the component with:
  - `forwardRef` for textarea element
  - `useState` for `isFocused` and `internalHasValue`
  - `useId` for label-textarea association
  - Floating label logic: `shouldFloat = isFocused || hasValue`
  - Required indicator with screen reader text
  - Event handlers: onFocus, onBlur, onChange
  - aria-invalid and aria-required attributes

### 3. Create TextareaFloatingLabelField Wrapper

- Create `src/ui/inputs/textarea-floating-label-field.tsx`
- Define `TextareaFloatingLabelFieldProps` extending TextareaFloatingLabelProps:
  - `hint?: string`
  - `errorMessage?: string`
  - `hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>`
  - `errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>`
  - `containerClassName?: string`
- Implement component:
  - Generate IDs with useId()
  - Compose TextareaFloatingLabel with Hint/ErrorMessage
  - Handle aria-describedby correctly
  - Error takes precedence over hint

### 4. Create Unit Tests

- Create `src/ui/inputs/__tests__/textarea-floating-label.test.tsx`
- Test categories based on TextInputFloatingLabel patterns:
  - **Rendering**: renders with label, as textarea element, with value, rows attribute
  - **Floating label behavior**: starts in placeholder position, floats on focus, floats when has value, returns on blur if empty, stays floated on blur if has value
  - **Placeholder behavior**: only shows when label is floating
  - **Error state**: applies error styles, label color, aria-invalid
  - **Disabled state**: disabled attribute, background, label color, cursor
  - **Ref forwarding**: forwards ref to textarea
  - **Event handling**: onChange, onFocus, onBlur
  - **Controlled and uncontrolled modes**: works with defaultValue, works with value+onChange
  - **className merging**: custom className, wrapperClassName
  - **Label-textarea association**: htmlFor/id, uses provided id, generates unique id
  - **Accessibility**: aria-describedby, aria-required, sr-only text
  - **Label color states**: tertiary when not floating, primary when focused, error when error
  - **Edge cases**: empty placeholder, long label, disabled with error, disabled with value

- Create `src/ui/inputs/__tests__/textarea-floating-label-field.test.tsx`
- Test Field wrapper:
  - Renders hint when provided
  - Renders error message when provided
  - Error replaces hint when both provided
  - Generates unique IDs
  - Sets aria-describedby correctly
  - Passes through props to TextareaFloatingLabel

### 5. Create Storybook Stories (REQUIRED)

- Create `src/stories/inputs/textarea-floating-label.stories.tsx`
- Implement meta configuration with comprehensive argTypes
- Create required stories:
  1. **Default**: Basic empty state with placeholder
  2. **AllStates**: 9-state grid (Empty, Hovered, Focused, Typing, Filled, Disabled, Disabled-Filled, Error, Error-Filled)
  3. **WithHint**: TextareaFloatingLabelField with hint text
  4. **WithError**: TextareaFloatingLabelField with error message
  5. **FormIntegration**: Real contact form example with character counter
  6. **Controlled**: Demonstrates controlled vs uncontrolled patterns
  7. **StandaloneVsField**: Side-by-side comparison with use case descriptions
  8. **AnimationDemo**: Interactive demo to test the floating animation
  9. **AllCombinations**: Comprehensive grid of all combinations

### 6. Update Barrel Exports

- Update `src/ui/inputs/index.ts`:
  - Add `export * from './textarea-floating-label';`
  - Add `export * from './textarea-floating-label-field';`

### 7. Run Validation Commands

- Execute all validation commands in order
- Fix any issues that arise
- Ensure 100% pass rate on all commands

## Testing Strategy

### Unit Tests

**TextareaFloatingLabel Tests:**

- Rendering: label, textarea element, value, rows, required indicator
- Floating label behavior: position states, focus/blur transitions
- Placeholder: visibility based on floating state
- Error state: styles, label color, aria-invalid
- Disabled state: attribute, background, label color, cursor
- Ref forwarding
- Event handling: onChange, onFocus, onBlur
- Controlled/uncontrolled modes
- className merging (input and wrapper)
- Label-textarea association (htmlFor/id)
- Accessibility: aria-describedby, aria-required, sr-only
- Label color states based on focus/error/floating

**TextareaFloatingLabelField Tests:**

- Hint rendering and hiding on error
- Error message rendering
- ID generation and aria-describedby
- Props passthrough to TextareaFloatingLabel

### Edge Cases

- Empty placeholder string
- Very long label text
- Disabled + error combination
- Disabled + filled combination
- Whitespace-only value (should still float label)
- Rapid focus/blur transitions
- Controlled mode with external value changes
- Maximum rows configuration
- Resize behavior interaction with floating label

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/inputs/textarea-floating-label.tsx` with proper TypeScript types
- ✅ Field wrapper implemented in `src/ui/inputs/textarea-floating-label-field.tsx`
- ✅ All 9 visual states work correctly (Empty, Hovered, Focused, Typing, Filled, Disabled, Disabled-Filled, Error, Error-Filled)
- ✅ Floating label animation: label moves from placeholder position to floating position on focus or when value present
- ✅ Label returns to placeholder position on blur if textarea is empty
- ✅ Required indicator (\*) displays correctly with screen reader text
- ✅ Error state applies red border, red label text, and shows error message
- ✅ Disabled state applies gray background and muted styling
- ✅ Component forwards refs correctly to textarea element
- ✅ Supports controlled and uncontrolled modes
- ✅ Textarea is resizable (vertical by default)

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/textarea-floating-label.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **AllStates story showing all 9 visual states**
- ✅ **WithHint story implemented**
- ✅ **WithError story implemented**
- ✅ **FormIntegration story with real-world example**
- ✅ **Controlled story demonstrating both modes**
- ✅ **StandaloneVsField comparison story**
- ✅ **AllCombinations comprehensive grid**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`) - via inputs barrel
- ✅ Component can be imported via `import { TextareaFloatingLabel, TextareaFloatingLabelField } from '@/ui'`

### Code Quality

- ✅ Zero TypeScript errors: `npm run type-check`
- ✅ Zero ESLint warnings: `npm run lint`
- ✅ Build succeeds: `npm run build`

## Validation Commands

**Required Validation Commands for ALL Components** (execute in order):

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- textarea-floating-label`
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

### Implementation Notes

1. **Reuse from TextInputFloatingLabel**: The floating label animation logic, autofill detection approach, and CVA variant patterns should be closely modeled after the existing TextInputFloatingLabel component for consistency.

2. **Autofill Consideration**: Unlike text inputs, textareas typically don't get autofilled by browsers, so the autofill detection logic may be simplified or omitted for this component.

3. **Resize Handle**: The Figma design shows a resize handle in the bottom-right corner. This is the native browser resize handle for textareas. Ensure the component uses `resize-y` (vertical resize only) to maintain layout consistency.

4. **Scrollbar**: The Figma design shows a scrollbar in some states. This will appear naturally when content overflows. No special implementation needed.

5. **Height**: Unlike TextInputFloatingLabel which has fixed height, TextareaFloatingLabel height is determined by the `rows` prop. Default should be 3-4 rows.

### Design System Consistency

- Follow the same dual API pattern (standalone molecule + Field wrapper organism) as TextInputFloatingLabel and Textarea
- Use the same color tokens from the design system for consistency
- Maintain the same animation timing (150ms transition) as TextInputFloatingLabel

### Future Considerations

- Size variants (md/lg) could be added later to match Textarea if needed
- Character counter could be added as an optional feature in the Field wrapper
- Auto-grow functionality (auto-resize based on content) could be a future enhancement
