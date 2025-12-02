# UI: NumberInput

## Component Description

NumberInput is a specialized form input component for numeric data entry with increment/decrement controls. It provides a styled number input field with stepper buttons (up/down chevrons), add-on support (prefix/suffix), and multiple visual states. The component enhances the standard HTML number input with a visually integrated stepper control that aligns with the Glow UI design system.

Based on the Figma design, the NumberInput features:

- A text prefix area (e.g., "Text") on the left side
- A numeric input field in the center
- A compact stepper control with up/down chevrons on the right side
- Support for label, hint text, and error messages
- Three size variants (SM, MD, LG) matching the existing input system

## User Story

As a user filling out a form,
I want to enter numeric values using both direct input and stepper controls,
So that I can quickly and accurately input quantities, prices, or other numeric data.

## Problem Statement

Currently, the application lacks a dedicated number input component with stepper controls. While the existing TextInput can handle `type="number"`, it doesn't provide the polished stepper UI shown in the Figma design. Users need a component that:

- Provides visual stepper buttons for increment/decrement
- Maintains consistent styling with other form inputs
- Supports all standard input states (hover, focus, disabled, error)
- Allows text prefixes for context (e.g., "$", "Text", "Qty")

## Solution Statement

Create a NumberInput component that extends the existing input patterns (using TextInput as architectural reference) with:

- A dedicated stepper control with up/down chevron icons
- Built-in increment/decrement functionality with customizable step values
- Support for min/max bounds
- Full keyboard accessibility (arrow keys, page up/down)
- Integration with the existing InputLabel, Hint, and ErrorMessage atoms
- A convenience wrapper (NumberInputField) following the TextInputField pattern

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: NumberInput is a molecule because it composes multiple atoms (Icon, InputLabel, Hint, ErrorMessage) into a more complex, reusable form control. It provides specific functionality (numeric input with stepper) that atoms alone cannot achieve.

**Composition Requirements**:

- **Required Atoms**:
  - `Icon` from `@/ui/icons` - For chevron up/down icons in stepper
  - `InputLabel` from `@/ui/inputs` - For field labels
  - `Hint` from `@/ui/inputs` - For helper text
  - `ErrorMessage` from `@/ui/inputs` - For error state messages

- **Required Icons**:
  - `CaretUp` from `@phosphor-icons/react` - Stepper increment button
  - `CaretDown` from `@phosphor-icons/react` - Stepper decrement button

## Component Location

**Location**: `src/ui/inputs/number-input.tsx`

**Category**: `inputs` - This component belongs in the inputs category as it's a form control for user data entry, alongside TextInput, InputLabel, Hint, and ErrorMessage.

**Reasoning**: The inputs category already contains related form components (TextInput, TextInputField, InputLabel, Hint, ErrorMessage). NumberInput follows the same architectural patterns and shares composition with these atoms.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/number-input.tsx
export { NumberInput, numberInputVariants };
export type { NumberInputProps };

// 2. Create convenience wrapper: src/ui/inputs/number-input-field.tsx
export { NumberInputField };
export type { NumberInputFieldProps };

// 3. Update category barrel: src/ui/inputs/index.ts
export * from './number-input';
export * from './number-input-field';

// 4. Import usage (recommended):
import { NumberInput, NumberInputField } from '@/ui';

// 5. Import usage (alternative):
import { NumberInput, NumberInputField } from '@/ui/inputs';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/inputs/text-input.tsx`** - Primary reference for component architecture
  - CVA variants pattern for wrapper and input elements
  - Add-on (left/right) slot implementation
  - Error state handling
  - Size variants (sm, md, lg)
  - TypeScript types and interfaces

- **`src/ui/inputs/text-input-field.tsx`** - Reference for convenience wrapper pattern
  - Composition of label, input, hint, and error
  - Automatic ID generation
  - ARIA associations
  - Size mapping logic

- **`src/ui/inputs/input-label.tsx`** - Label atom to compose
  - Size variants and required indicator

- **`src/ui/inputs/hint.tsx`** - Hint atom to compose
  - Size variants and typography

- **`src/ui/inputs/error-message.tsx`** - Error atom to compose
  - Icon and message display

- **`src/ui/icons/icon.tsx`** - Icon atom for stepper chevrons
  - Size variants and color props

- **`src/ui/buttons/button.tsx`** - Reference for interactive element patterns
  - Focus states and accessibility

- **`src/stories/inputs/text-input.stories.tsx`** - Reference for Storybook patterns
  - Story organization and argTypes
  - State demonstrations
  - Real-world examples

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/number-input.tsx` (REQUIRED)
   - Standalone NumberInput component with stepper

2. **Wrapper file**: `src/ui/inputs/number-input-field.tsx` (REQUIRED)
   - Convenience wrapper with label, hint, error

3. **Test file**: `src/ui/inputs/__tests__/number-input.test.tsx` (REQUIRED)
   - Unit tests for NumberInput

4. **Test file**: `src/ui/inputs/__tests__/number-input-field.test.tsx` (REQUIRED)
   - Unit tests for NumberInputField

5. **Story file**: `src/stories/inputs/number-input.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
   - Comprehensive Storybook stories

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required - Primary design target with full stepper controls
- **Tablet (md: 768px - 1023px)**: Required - Same design, touch-friendly stepper buttons
- **Mobile (< 768px)**: Required - Same design, ensure stepper buttons are easily tappable (minimum 44px touch target)

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1988-114662&m=dev
- Screenshot captured showing all states and sizes

**Design Specifications**:

#### Structure (from Figma)

- Label at top (InputLabel component)
- Input container with border and rounded corners
- Left add-on: Text prefix (e.g., "Text") in tertiary color
- Center: Number value or placeholder
- Right add-on: Stepper control with up/down chevrons
- Bottom: Hint text OR Error message

#### Colors (Semantic Tokens)

- **Container Background**: `bg-background` (white - #ffffff)
- **Container Border (default)**: `border-border` (#d7dbdf)
- **Container Border (hover)**: `border-border-hover`
- **Container Border (focus)**: `border-primary` with ring
- **Container Border (error)**: `border-destructive` (#e54d2e)
- **Text (value)**: `text-text-primary` (#11181c)
- **Text (placeholder)**: `text-text-tertiary` (#889096)
- **Text (prefix)**: `text-text-tertiary` (#889096)
- **Label**: `text-text-primary` (#11181c)
- **Hint**: `text-text-tertiary` (#889096)
- **Error**: `text-destructive` (#e54d2e)

#### Stepper Control (from Figma)

- Border: `border-border` (#d7dbdf)
- Background: `bg-background` (white)
- Border radius: 4px (rounded-xs)
- Chevron icon size: 10px
- Chevron color: `text-text-secondary` (#697177)
- Padding: 1px
- Stacked vertically (up on top, down on bottom)

#### Spacing (from Figma)

- **LG Size**:
  - Container padding: 16px horizontal, 12px vertical (px-4 py-3)
  - Gap between elements: 12px (gap-3)
  - Label bottom padding: 12px (pb-3)
  - Hint/Error top padding: 8px (pt-2)
  - Input height: ~48px total

- **MD Size**:
  - Container padding: 16px horizontal, 12px vertical (px-4 py-3)
  - Gap between elements: 12px (gap-3)
  - Label bottom padding: 10px (pb-2.5)
  - Hint/Error top padding: 8px (pt-2)
  - Input height: ~44px total

- **SM Size**:
  - Container padding: 12px horizontal, 8px vertical (px-3 py-2)
  - Gap between elements: 10px (gap-2.5)
  - Label bottom padding: 10px (pb-2.5)
  - Hint/Error top padding: 8px (pt-2)
  - Input height: ~36px total

#### Typography

- **Label (LG)**: 16px, medium weight, 24px line-height
- **Label (SM/MD)**: 14px, medium weight, 20px line-height
- **Value (LG)**: 16px, regular weight, 24px line-height
- **Value (SM/MD)**: 14px, regular weight, 20px line-height
- **Placeholder**: Same as value, tertiary color
- **Hint (LG)**: 14px, regular weight, 20px line-height
- **Hint (SM/MD)**: 12px, regular weight, 18px line-height
- **Error**: 14px, medium weight, 20px line-height

#### States

1. **Empty**: Default state with placeholder
2. **Hovered**: Border color change on hover
3. **Focused**: Primary border color with ring
4. **Typing**: Active input with cursor
5. **Filled**: Shows numeric value
6. **Disabled**: Reduced opacity, no pointer events
7. **Disabled Filled**: Disabled with value
8. **Error**: Destructive border color
9. **Error Filled**: Error state with value

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/number-input.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic NumberInput with LG size and placeholder
2. **Sizes Story**: Comparison of SM, MD, LG sizes
3. **AllStates Story**: Grid showing Empty, Hovered, Focused, Disabled, Disabled Filled, Error, Error Filled
4. **WithPrefix Story**: Input with text prefix (e.g., "Price:", "Qty:", "$")
5. **MinMaxBounds Story**: Demonstrate min/max constraints
6. **StepValues Story**: Custom step values (1, 0.1, 10)
7. **ManualComposition Story**: Using NumberInput with InputLabel, Hint, ErrorMessage
8. **FieldDefault Story**: NumberInputField basic example
9. **FieldWithHint Story**: NumberInputField with hint text
10. **FieldWithError Story**: NumberInputField with error state
11. **FieldFullFeatured Story**: All features combined
12. **FormIntegration Story**: Real-world form example
13. **AllCombinations Story**: Grid of all size/state combinations
14. **KeyboardNavigation Story**: Interactive demo of keyboard controls

**Story Requirements**:

- Use `satisfies Meta<typeof NumberInput>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: 'centered'`
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. **Research and Setup**
   - Review Figma design specifications in detail
   - Confirm color tokens and spacing values
   - Verify Phosphor icons availability (CaretUp, CaretDown)

2. **Create Stepper Control Sub-component**
   - Build the stepper button container
   - Implement up/down chevron buttons
   - Handle click events for increment/decrement
   - Style hover and active states
   - Ensure proper accessibility (aria-label, keyboard support)

### Phase 2: Core Implementation

3. **Create NumberInput Component**
   - Follow TextInput architecture pattern
   - Implement CVA variants for wrapper and input
   - Add stepper control as right add-on
   - Support left add-on (text prefix)
   - Implement controlled and uncontrolled modes
   - Handle min/max/step props
   - Add keyboard navigation (ArrowUp, ArrowDown, PageUp, PageDown)

4. **Create NumberInputField Wrapper**
   - Compose InputLabel, NumberInput, Hint, ErrorMessage
   - Implement automatic ID generation
   - Setup ARIA associations (aria-describedby)
   - Map sizes appropriately

### Phase 3: Design System Integration & Documentation

5. **Export Configuration**
   - Add exports to `src/ui/inputs/index.ts`
   - Verify imports work via `@/ui` and `@/ui/inputs`

6. **Storybook Documentation**
   - Create `src/stories/inputs/number-input.stories.tsx`
   - Implement all required stories (14 stories)
   - Add comprehensive argTypes
   - Include interactive examples

## Step by Step Tasks

### 1. Research and Verify Dependencies

- [ ] Confirm CaretUp and CaretDown icons exist in Phosphor Icons
- [ ] Review TextInput implementation for patterns to follow
- [ ] Verify existing semantic color tokens match Figma design

### 2. Create NumberInput Component

- [ ] Create `src/ui/inputs/number-input.tsx`
- [ ] Define `numberInputWrapperVariants` CVA with size/error variants
- [ ] Define `numberInputVariants` CVA for the input element
- [ ] Create `NumberInputStepper` internal component for up/down buttons
- [ ] Implement `NumberInputProps` interface extending appropriate input props
- [ ] Build `NumberInput` component with:
  - forwardRef for ref forwarding
  - Wrapper div with variants
  - Optional left add-on slot
  - Number input element (hide native spinner with CSS)
  - Stepper control with accessible buttons
- [ ] Implement increment/decrement logic with min/max/step support
- [ ] Add keyboard event handlers (ArrowUp, ArrowDown, PageUp, PageDown, Home, End)
- [ ] Ensure proper ARIA attributes (aria-valuemin, aria-valuemax, aria-valuenow)

### 3. Create NumberInputField Wrapper

- [ ] Create `src/ui/inputs/number-input-field.tsx`
- [ ] Define `NumberInputFieldProps` interface
- [ ] Implement composition of InputLabel, NumberInput, Hint/ErrorMessage
- [ ] Add automatic ID generation using useId
- [ ] Setup aria-describedby for hint/error association
- [ ] Map field size to appropriate sub-component sizes

### 4. Update Barrel Exports

- [ ] Add `export * from './number-input';` to `src/ui/inputs/index.ts`
- [ ] Add `export * from './number-input-field';` to `src/ui/inputs/index.ts`

### 5. Create Unit Tests for NumberInput

- [ ] Create `src/ui/inputs/__tests__/number-input.test.tsx`
- [ ] Test rendering with default props
- [ ] Test all size variants (sm, md, lg)
- [ ] Test error state styling
- [ ] Test disabled state
- [ ] Test left add-on rendering
- [ ] Test increment button click
- [ ] Test decrement button click
- [ ] Test min/max boundary enforcement
- [ ] Test step value changes
- [ ] Test keyboard navigation (ArrowUp, ArrowDown)
- [ ] Test keyboard navigation (PageUp, PageDown for larger steps)
- [ ] Test Home/End keys for min/max
- [ ] Test controlled vs uncontrolled behavior
- [ ] Test onChange callback firing
- [ ] Test ref forwarding
- [ ] Test aria attributes

### 6. Create Unit Tests for NumberInputField

- [ ] Create `src/ui/inputs/__tests__/number-input-field.test.tsx`
- [ ] Test rendering with label only
- [ ] Test rendering with label and hint
- [ ] Test rendering with label and error
- [ ] Test error replaces hint behavior
- [ ] Test automatic ID generation
- [ ] Test aria-describedby associations
- [ ] Test required indicator
- [ ] Test size mapping
- [ ] Test pass-through props to NumberInput

### 7. Create Storybook Stories

- [ ] Create `src/stories/inputs/number-input.stories.tsx`
- [ ] Setup meta with comprehensive argTypes
- [ ] Implement Default story
- [ ] Implement Sizes story (SM, MD, LG comparison)
- [ ] Implement AllStates story (all visual states grid)
- [ ] Implement WithPrefix story (text prefixes)
- [ ] Implement MinMaxBounds story
- [ ] Implement StepValues story
- [ ] Implement ManualComposition story
- [ ] Implement FieldDefault story
- [ ] Implement FieldWithHint story
- [ ] Implement FieldWithError story
- [ ] Implement FieldFullFeatured story
- [ ] Implement FormIntegration story
- [ ] Implement AllCombinations story
- [ ] Implement KeyboardNavigation story

### 8. Run Validation Commands

- [ ] Run `npm run type-check` - Fix any TypeScript errors
- [ ] Run `npm run lint` - Fix any ESLint warnings
- [ ] Run `npm test -- number-input` - Ensure all tests pass
- [ ] Run `npm run test:run` - Ensure no regressions
- [ ] Run `npm run build` - Verify production build
- [ ] Run `npm run build-storybook` - Verify Storybook builds

## Testing Strategy

### Unit Tests

1. **Rendering Tests**
   - Component renders without crashing
   - All size variants render correctly
   - Error state applies correct styling
   - Disabled state disables interaction
   - Left add-on renders when provided
   - Stepper buttons render with correct icons

2. **Interaction Tests**
   - Increment button increases value by step
   - Decrement button decreases value by step
   - Value stays within min/max bounds
   - Double-click doesn't exceed bounds
   - Click on disabled button has no effect

3. **Keyboard Navigation Tests**
   - ArrowUp increments by step
   - ArrowDown decrements by step
   - PageUp increments by step \* 10
   - PageDown decrements by step \* 10
   - Home sets value to min
   - End sets value to max
   - Keyboard works when input is focused

4. **Accessibility Tests**
   - Stepper buttons have aria-labels
   - Input has aria-valuemin, aria-valuemax, aria-valuenow
   - Input is keyboard focusable
   - Focus visible styles appear
   - Screen reader announces value changes

5. **Integration Tests**
   - NumberInputField renders all sub-components
   - Error replaces hint text
   - aria-describedby points to correct element
   - Label htmlFor matches input id

### Edge Cases

- Value of 0 (falsy but valid)
- Negative numbers when allowed
- Decimal values with step=0.1
- Very large numbers
- Empty input (null/undefined value)
- Paste non-numeric characters
- Min > Max (should handle gracefully)
- Step larger than (max - min)
- Programmatic value change via props

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/inputs/` with proper TypeScript types
- ✅ All size variants (sm, md, lg) work correctly
- ✅ All states work correctly (empty, filled, hover, focus, disabled, error)
- ✅ Increment/decrement buttons work with click
- ✅ Keyboard navigation works (Arrow keys, Page keys, Home, End)
- ✅ Min/max boundaries enforced
- ✅ Step value respected
- ✅ Left add-on (text prefix) renders correctly
- ✅ Component forwards refs correctly
- ✅ Component supports both controlled and uncontrolled modes
- ✅ NumberInputField composes label, input, hint, error correctly

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/number-input.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **Size variant stories implemented**
- ✅ **All state stories implemented**
- ✅ **Real-world examples (minimum 2-3 practical usage scenarios)**
- ✅ **All combinations comparison story**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { NumberInput, NumberInputField } from '@/ui'`

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

3. **Run component tests**: `npm test -- number-input`
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

### Implementation Considerations

1. **Native Number Input Spinner Hiding**
   - Use CSS to hide the native browser spinner controls
   - `appearance: textfield` and `::-webkit-inner-spin-button` / `::-webkit-outer-spin-button` pseudo-elements

2. **Touch Accessibility**
   - Ensure stepper buttons meet minimum 44px touch target on mobile
   - Consider adding press-and-hold for continuous increment/decrement

3. **Value Formatting**
   - Initial implementation uses raw number values
   - Future enhancement could add formatting (currency, percentages)

4. **International Number Formats**
   - Consider locale-specific decimal separators in future iterations
   - Initial implementation uses standard JavaScript number handling

5. **Form Library Integration**
   - Component should work seamlessly with React Hook Form
   - Ensure onChange and onBlur callbacks match expected signatures

### Design System Alignment

- Follows existing TextInput architecture for consistency
- Uses same semantic color tokens
- Matches spacing and typography system
- Stepper control is unique to NumberInput but styled consistently

### Future Enhancements (Out of Scope)

- Currency formatting
- Percentage formatting
- Unit suffixes (kg, lbs, etc.)
- Slider integration
- Virtual keyboard with numpad layout

---

## Architectural Review

**Review Date:** 2025-11-30
**Reviewer:** UI/UX Architecture Agent
**Overall Score:** 9.5/10

### Executive Summary

The NumberInput component plan demonstrates exceptional architectural planning with near-perfect alignment to established project patterns. The plan correctly follows the dual API approach (NumberInput + NumberInputField) established by TextInput, properly classifies the component as a molecule, and shows excellent understanding of CVA variants, accessibility, and design system integration.

### Critical Architectural Decision: Stepper Control Implementation

**IMPORTANT:** The stepper control should be implemented as an **internal component** with dedicated wrapper variants, NOT as a `rightAddOn` prop to TextInput.

**Rationale:**

- TextInput's `rightAddOn` is designed for simple text/icons, not complex interactive controls with borders
- Stepper needs interactive buttons with click handlers
- Stepper needs internal border between up/down buttons
- Stepper needs unique styling (border-radius, padding)

**Recommended Architecture:**

```typescript
// ✅ Recommended: Create dedicated wrapper variants
const numberInputWrapperVariants = cva(
  [
    'flex w-full items-center',
    'rounded-sm border',
    'bg-background',
    'transition-colors duration-150',
    'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-background-secondary',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2 pl-3 pr-1',    // Reduced right padding for stepper
        md: 'gap-2.5 pl-3.5 pr-1',
        lg: 'gap-3 pl-4 pr-1',
      },
      error: {
        true: 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20',
        false: 'border-border hover:border-border-hover',
      },
    },
    defaultVariants: {
      size: 'lg',
      error: false,
    },
  }
);

// Input variants with native spinner hiding
const numberInputVariants = cva(
  [
    'w-full min-w-0 flex-1',
    'bg-transparent',
    'border-none outline-none',
    'text-text-primary',
    'placeholder:text-text-tertiary',
    'disabled:cursor-not-allowed disabled:text-text-tertiary',
    // Hide native number input spinners
    '[appearance:textfield]',
    '[&::-webkit-outer-spin-button]:appearance-none',
    '[&::-webkit-inner-spin-button]:appearance-none',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm leading-5',
        md: 'text-sm leading-5',
        lg: 'text-base leading-6',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

// Stepper button variants
const stepperButtonVariants = cva(
  [
    'flex items-center justify-center',
    'text-text-secondary',
    'transition-colors',
    'hover:bg-fill-tertiary',
    'active:bg-fill-tertiary-hover',
    'focus-visible:outline-none',
    'focus-visible:bg-fill-tertiary',
    'disabled:opacity-52',
    'disabled:cursor-not-allowed',
    'disabled:hover:bg-transparent',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-6',
        md: 'h-5 w-6',
        lg: 'h-6 w-7',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);

// Internal stepper component (NOT exported)
function NumberInputStepper({
  size,
  disabled,
  onIncrement,
  onDecrement,
  canIncrement,
  canDecrement,
}: StepperProps) {
  return (
    <div className="flex flex-col border-l border-border">
      <button
        type="button"
        className={cn(stepperButtonVariants({ size }))}
        onClick={onIncrement}
        disabled={disabled || !canIncrement}
        aria-label="Increment value"
        tabIndex={-1} // Prevent tab focus, use arrow keys instead
      >
        <Icon icon={CaretUp} size="xs" color={null} />
      </button>
      <button
        type="button"
        className={cn(stepperButtonVariants({ size }), 'border-t border-border')}
        onClick={onDecrement}
        disabled={disabled || !canDecrement}
        aria-label="Decrement value"
        tabIndex={-1}
      >
        <Icon icon={CaretDown} size="xs" color={null} />
      </button>
    </div>
  );
}
```

### Pattern Conformance Scorecard

| Pattern                       | Conformance    | Notes                                           |
| ----------------------------- | -------------- | ----------------------------------------------- |
| Atomic Design                 | ✅ Excellent   | Correctly classified as molecule                |
| Dual API (Standalone + Field) | ✅ Excellent   | NumberInput + NumberInputField pattern          |
| CVA Variants                  | ✅ Excellent   | Matches TextInput, adds stepperButtonVariants   |
| forwardRef                    | ✅ Excellent   | Correct ref forwarding planned                  |
| TypeScript                    | ✅ Excellent   | ComponentPropsWithoutRef, VariantProps          |
| Barrel Exports                | ✅ Excellent   | Named exports, category barrel                  |
| Accessibility                 | ✅ Exceptional | ARIA attributes, keyboard nav exceeds standards |
| State Management              | ✅ Excellent   | Controlled/uncontrolled support                 |
| Composition                   | ✅ Excellent   | External composition via NumberInputField       |
| Design Tokens                 | ✅ Excellent   | Semantic tokens throughout                      |
| Storybook                     | ✅ Excellent   | 14 comprehensive stories planned                |

### Must Implement (Critical)

1. **Create Dedicated Wrapper Variants** - Do NOT reuse TextInput wrapper
2. **Stepper as Internal Component** - Keep `NumberInputStepper` internal, not exported
3. **Hide Native Spinners** - Add CSS `[appearance:textfield]` and webkit selectors
4. **Keyboard Event Handlers** - ArrowUp/Down, PageUp/Down, Home/End with preventDefault
5. **Stepper Button tabIndex={-1}** - Prevent keyboard trap, use arrow keys for increment

### Additional Test Cases to Consider

```typescript
// Stepper button disabled states
test('increment button disabled when value equals max', () => {
  render(<NumberInput value={100} max={100} />);
  const incrementButton = screen.getByLabelText('Increment value');
  expect(incrementButton).toBeDisabled();
});

// Floating point precision
test('handles decimal step values correctly', () => {
  const handleChange = jest.fn();
  render(<NumberInput value={0.1} step={0.1} onChange={handleChange} />);
  // Verify 0.1 + 0.1 = 0.2, not 0.20000000000000001
});

// Synthetic event structure for React Hook Form compatibility
test('stepper click triggers onChange with correct event structure', () => {
  const handleChange = jest.fn();
  render(<NumberInput value={5} onChange={handleChange} />);
  fireEvent.click(screen.getByLabelText('Increment value'));
  expect(handleChange).toHaveBeenCalledWith(
    expect.objectContaining({
      target: expect.objectContaining({ value: '6' }),
    })
  );
});
```

### Recommended Storybook Enhancement

Add a story demonstrating stepper control visual states:

```typescript
export const StepperStates: StoryObj<typeof NumberInput> = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-text-tertiary mb-2">Normal</p>
        <NumberInput value={5} min={0} max={10} />
      </div>
      <div>
        <p className="text-sm text-text-tertiary mb-2">At Min (decrement disabled)</p>
        <NumberInput value={0} min={0} max={10} />
      </div>
      <div>
        <p className="text-sm text-text-tertiary mb-2">At Max (increment disabled)</p>
        <NumberInput value={10} min={0} max={10} />
      </div>
    </div>
  ),
};
```

### Conclusion

With the stepper architecture clarification implemented, this plan achieves **10/10 architectural compliance** and serves as an excellent example of molecule composition with interactive controls.

**Recommended Path Forward:**

1. Create `numberInputWrapperVariants` (dedicated, not reusing TextInput)
2. Create `NumberInputStepper` as internal component (not exported)
3. Implement keyboard handlers (ArrowUp/Down, PageUp/Down, Home/End)
4. Hide native spinners with CSS
5. Create NumberInputField following TextInputField pattern exactly
6. Create comprehensive Storybook stories (14+ stories)
7. Write unit tests with >90% coverage
