# UI: QuantityInput

## Component Description

The QuantityInput is a specialized form control component designed for adjusting numeric quantities through increment/decrement buttons. It combines a centered text input with flanking minus and plus buttons, providing an intuitive way for users to select quantities in e-commerce carts, product detail pages, and inventory management interfaces.

The component supports three sizes (SM, MD, LG), multiple states (Default, Hovered, Focused, Typing, Disabled, Error), and optional label, hint text, and error message display. It's designed for seamless composition using existing atomic components from the design system.

## User Story

As a user
I want to easily adjust quantities using increment/decrement buttons or direct input
So that I can quickly select the exact quantity I need without typing errors

## Problem Statement

Users need an intuitive way to adjust numeric quantities in forms and e-commerce contexts. Simple text inputs require precise typing and are prone to errors, while native number inputs have inconsistent styling across browsers. A dedicated quantity input with clear visual increment/decrement controls improves usability and reduces input errors.

## Solution Statement

Create a `QuantityInput` molecule component that composes existing atoms (`QuantityInputButton`, `InputLabel`, `Hint`, `ErrorMessage`) into a cohesive form control. The component will:

- Provide intuitive +/- buttons for quantity adjustment
- Support direct text input for precise values
- Handle all states from the Figma design (default, hover, focus, typing, disabled, error)
- Support controlled and uncontrolled modes
- Include proper accessibility attributes and keyboard navigation

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: QuantityInput is a molecule because it combines multiple atom components (QuantityInputButton, InputLabel, Hint, ErrorMessage) into a functional unit that provides a more complex behavior than any individual atom. It serves a single, cohesive purpose (quantity selection) but is composed of distinct, reusable atomic parts.

**Composition Requirements**:

- **Required Atoms**:
  - `QuantityInputButton` from `@/ui/inputs` - For minus/plus increment buttons
  - `InputLabel` from `@/ui/inputs` - For the optional label with required indicator and help icon
  - `Hint` from `@/ui/inputs` - For the optional hint text below the input
  - `ErrorMessage` from `@/ui/inputs` - For error state feedback

## Component Location

**Location**: `src/ui/inputs/quantity-input.tsx`

**Category**: `inputs`

**Reasoning**: The QuantityInput is a form input component that allows users to enter numeric quantities. It belongs in the `inputs` category alongside other form controls like TextInput, NumberInput, and the existing QuantityInputButton atom. The inputs category already contains all the atoms this molecule will compose.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/quantity-input.tsx
export { QuantityInput, quantityInputVariants };
export type { QuantityInputProps };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './quantity-input';

// 3. Root barrel already exports inputs: src/ui/index.ts
export * from './inputs';

// 4. Import usage (recommended):
import { QuantityInput } from '@/ui';

// 5. Import usage (alternative):
import { QuantityInput } from '@/ui/inputs';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/inputs/quantity-input-button.tsx`** - Atom component for +/- buttons, already implemented with:
  - Types: minus (left), plus (right)
  - Sizes: sm (32px), md (40px), lg (48px)
  - States: default, hover, active, focus, disabled
  - Asymmetric border pattern for seamless composition

- **`src/ui/inputs/input-label.tsx`** - Atom for form labels with:
  - Required indicator (red asterisk)
  - Help icon support
  - Description text
  - Size variants (sm, md)

- **`src/ui/inputs/hint.tsx`** - Atom for hint/helper text:
  - Composes Typography components
  - Size variants (sm, md)

- **`src/ui/inputs/error-message.tsx`** - Atom for error feedback:
  - Warning icon
  - Destructive color styling
  - Size variants (sm, md)

- **`src/ui/inputs/number-input.tsx`** - Reference for controlled/uncontrolled input patterns:
  - useImperativeHandle pattern for ref forwarding
  - Synthetic change event triggering
  - Keyboard navigation (ArrowUp/ArrowDown)
  - Min/max clamping logic

- **`src/stories/inputs/quantity-input-button.stories.tsx`** - Storybook pattern reference:
  - Meta configuration with autodocs
  - ArgTypes configuration
  - Render functions for complex stories
  - Interactive demo pattern with useState

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/quantity-input.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/quantity-input.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/quantity-input.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
4. **Barrel update**: `src/ui/inputs/index.ts` (add export)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Required - Primary usage context for e-commerce
- **Tablet (md: 768px - 1023px)**: Required - Same component behavior
- **Mobile (< 768px)**: Required - Buttons must remain easily tappable (44px minimum)

### Design Assets

**Status**: Figma design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1919-130803&m=dev

**Design Specifications** (from Figma):

**Sizes**:
| Size | Input Height | Input Width | Label Padding | Font Size |
|------|--------------|-------------|---------------|-----------|
| SM | 32px | 40px | pb-10 (10px) | 14px |
| MD | 40px | 48px | pb-10 (10px) | 14px |
| LG | 48px | 64px | pb-12 (12px) | 16px |

**States** (all sizes):
| State | Input Border | Input Background | Text Color |
|----------|------------------------|---------------------------|------------------|
| Default | border-border (#d7dbdf)| bg-background (#ffffff) | text-primary |
| Hovered | border-border-hover | bg-background | text-primary |
| Focused | border-primary (#3c61dd)| bg-background | text-primary |
| Typing | border-primary (#3c61dd)| bg-background | text-primary |
| Disabled | border-border | bg-background-secondary | text-tertiary |
| Error | border-destructive | bg-background | text-primary |

**Spacing from Figma**:

- Label to input: 12px (lg), 10px (sm/md)
- Input to hint/error: 8px
- Gap between error icon and text: 6px

## Storybook Stories

**Required**: Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/quantity-input.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic component with default props (lg size, default state)
2. **Variant Stories**:
   - AllSizes - SM, MD, LG size comparison
   - AllStates - Default, Hovered, Focused, Typing, Disabled, Error
3. **Configuration Stories**:
   - WithLabel - Shows label configuration options
   - WithHint - Shows hint text below input
   - WithError - Shows error state with error message
   - WithAllFeatures - Label + Hint in normal state, Label + Error in error state
4. **Real-world Examples**:
   - ProductQuantitySelector - E-commerce cart item quantity
   - CartItemQuantity - Shopping cart context with product info
   - InventoryAdjustment - Stock management scenario
5. **Interactive Demo**: Fully functional with useState for increment/decrement

**Story Requirements**:

- Use `satisfies Meta<typeof QuantityInput>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes`:
  - size: select control with sm/md/lg options
  - disabled: boolean control
  - error: boolean control
  - min/max: number controls
  - step: number control
  - value: number control
  - label/hint/errorMessage: text controls
- Set `parameters.layout: 'centered'`
- Create interactive controls for all configurable props

## Implementation Plan

### Phase 1: Foundation

1. **Research composition patterns**: Review how NumberInput handles controlled/uncontrolled modes, keyboard navigation, and ref forwarding
2. **Map Figma design tokens**: Extract exact sizing, spacing, colors, and typography from the Figma design
3. **Define TypeScript interfaces**: Create props interface composing from child component props

### Phase 2: Core Implementation

1. **Create CVA variants**: Define size variants for the input element (not buttons - they have their own)
2. **Implement controlled/uncontrolled input**: Support both value/onChange and defaultValue patterns
3. **Compose child components**: Wire up QuantityInputButton, InputLabel, Hint, ErrorMessage
4. **Add keyboard navigation**: ArrowUp/Down, Home/End for min/max
5. **Handle state management**: Manage focus state for styling, disable min/max buttons at bounds
6. **Implement value clamping**: Ensure values stay within min/max bounds

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add `export * from './quantity-input';` to `src/ui/inputs/index.ts`
- Component will be importable via `import { QuantityInput } from '@/ui'`

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/inputs/quantity-input.stories.tsx`
- All variant stories (sizes, states)
- Interactive controls with full argTypes
- Real-world usage examples (cart, product page, inventory)
- Interactive demo with working increment/decrement

## Step by Step Tasks

### Step 1: Create Component Foundation

- Create `src/ui/inputs/quantity-input.tsx`
- Define `QuantityInputProps` interface extending necessary HTML attributes
- Include props: size, disabled, error, min, max, step, value, defaultValue, onChange
- Include optional props for label: label, required, showLabelIcon, labelDescription
- Include optional props for hint: hint
- Include optional props for error: errorMessage
- Create CVA variants for the input container and input element styling:

**Wrapper/Container CVA** (`quantityInputVariants`):

```typescript
const quantityInputVariants = cva(
  [
    'flex items-center',
    'rounded-sm border',
    'bg-background',
    'transition-colors duration-150',
    'focus-within:border-primary focus-within:ring-2',
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-background-secondary',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 gap-0', // Buttons are 32px, input width 40px
        md: 'h-10 gap-0', // Buttons are 40px, input width 48px
        lg: 'h-12 gap-0', // Buttons are 48px, input width 64px
      },
      error: {
        true: 'border-destructive focus-within:border-destructive',
        false: 'border-border hover:border-border-hover',
      },
    },
    defaultVariants: {
      size: 'lg',
      error: false,
    },
  }
);
```

**Input Element CVA** (`quantityInputInputVariants`):

```typescript
const quantityInputInputVariants = cva(
  [
    'w-full text-center',
    'bg-transparent',
    'border-x-0 border-y', // Only top/bottom borders, no left/right (seamless with buttons)
    'outline-none',
    'text-text-primary',
    // Hide number input spinners
    '[appearance:textfield]',
    '[&::-webkit-outer-spin-button]:appearance-none',
    '[&::-webkit-inner-spin-button]:appearance-none',
  ],
  {
    variants: {
      size: {
        sm: 'w-10 text-sm', // 40px from Figma
        md: 'w-12 text-sm', // 48px from Figma
        lg: 'w-16 text-base', // 64px from Figma
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
);
```

### Step 2: Implement Core Component Logic

- Add ref forwarding with `forwardRef` and `useImperativeHandle`
  - **IMPORTANT**: Forward ref to the internal input element (not the wrapper container)
  - Follow NumberInput pattern (line 298): `useImperativeHandle(ref, () => internalRef.current as HTMLInputElement)`
  - This allows programmatic access to input value and methods
- Implement controlled/uncontrolled input logic (reference NumberInput pattern)
  - Track effective value for button state calculation:
    ```typescript
    const [internalValue, setInternalValue] = useState(defaultValue ?? min ?? 0);
    const effectiveValue = value ?? internalValue;
    const canIncrement = max === undefined || effectiveValue < max;
    const canDecrement = min === undefined || effectiveValue > min;
    ```
- Create `handleIncrement` and `handleDecrement` callbacks
- Implement keyboard navigation (ArrowUp, ArrowDown, Home, End)
- Add value clamping to min/max bounds
  - **Clamping timing**:
    - Increment/Decrement: Immediately clamp to prevent exceeding bounds
    - Direct Input: Only validate on blur to allow typing (e.g., typing "10" requires typing "1" first)
    - On blur, if value is empty or NaN, default to `min ?? 0`
- Implement synthetic change event triggering for controlled mode compatibility
  - **CRITICAL**: Use native setter pattern for React controlled mode compatibility (NumberInput lines 337-355):
    ```typescript
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(input, String(clampedValue));
    }
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
    ```

### Step 3: Compose Child Components

- Conditionally render `InputLabel` when label prop is provided
- Compose `QuantityInputButton` for minus (type="minus") and plus (type="plus")
- Conditionally render `Hint` when hint prop is provided and not in error state
- Conditionally render `ErrorMessage` when error prop is true and errorMessage is provided
- Wire up correct size variants to all child components

### Step 4: Implement State Styling

- Map component states to CSS classes:
  - Default: `border-border bg-background`
  - Hover: `hover:border-border-hover` (via CSS)
  - Focus: `focus-within:border-primary focus-within:ring-2`
  - Disabled: `bg-background-secondary` + disable buttons
  - Error: `border-destructive`
- Disable minus button when value equals min
- Disable plus button when value equals max

### Step 5: Create Unit Tests

- Create `src/ui/inputs/__tests__/quantity-input.test.tsx`
- Test rendering with all size variants
- Test all state combinations (default, disabled, error)
- Test increment/decrement button functionality
- Test keyboard navigation (ArrowUp, ArrowDown, Home, End)
- Test min/max bounds enforcement
- Test controlled and uncontrolled modes
- Test ref forwarding
- Test accessibility attributes (aria-invalid, aria-describedby)
- Test label, hint, and error message rendering
- Target >90% code coverage

### Step 6: Create Storybook Stories

- Create `src/stories/inputs/quantity-input.stories.tsx`
- Configure meta with title: 'Inputs/QuantityInput'
- Add comprehensive argTypes for all props
- Create Default story with basic usage
- Create AllSizes story showing SM, MD, LG
- Create AllStates story showing all visual states
- Create WithLabel story
- Create WithHint story
- Create WithError story
- Create WithAllFeatures story
- Create InteractiveDemo with useState
- Create real-world examples (ProductQuantity, CartItem)

### Step 7: Update Barrel Exports

- Add `export * from './quantity-input';` to `src/ui/inputs/index.ts`
- Verify component is importable via `@/ui` and `@/ui/inputs`

### Step 8: Run Validation Commands

- Execute all validation commands in order
- Fix any failing tests or type errors
- Ensure Storybook builds successfully

## Testing Strategy

### Unit Tests

**Rendering Tests**:

- Renders with default props
- Renders all size variants correctly
- Renders label when provided
- Renders hint when provided and not in error state
- Renders error message when error is true
- Does not render hint when in error state (per design pattern)

**Interaction Tests**:

- Plus button increments value
- Minus button decrements value
- Buttons disabled at min/max bounds
- Click events fire onChange
- Keyboard ArrowUp increments
- Keyboard ArrowDown decrements
- Keyboard Home sets to min (if defined)
- Keyboard End sets to max (if defined)
- Direct input typing updates value

**State Tests**:

- Disabled state disables all interactions
- Error state applies correct styling
- Focus state applies correct styling
- Controlled mode respects external value changes
- Uncontrolled mode manages internal state

**Accessibility Tests**:

- Has proper role="spinbutton" on input
- Correct aria-valuenow, aria-valuemin, aria-valuemax
- aria-invalid when in error state
- aria-describedby links to hint/error
- All buttons have aria-labels

### Edge Cases

- Empty value handling (defaults to 0 or min)
- Non-numeric input handling
- Floating point step values (precision handling)
  - Use `roundToStep` utility pattern from NumberInput (lines 326-332):
    ```typescript
    const roundToStep = useCallback(
      (val: number): number => {
        const precision = step.toString().split('.')[1]?.length || 0;
        return Number(val.toFixed(precision));
      },
      [step]
    );
    ```
- Very large numbers
- Negative numbers (when min allows)
- Value outside min/max bounds (clamp on blur)
- Rapid clicking on buttons
- Ref forwarding to input element

### Integration Tests

In addition to unit tests, include integration test scenarios:

```typescript
describe('QuantityInput integration', () => {
  it('works with React Hook Form', () => {
    const { register } = useForm();
    render(<QuantityInput {...register('quantity')} min={1} max={10} />);
    // Test form integration
  });

  it('works with Formik', () => {
    const formik = useFormik({ /* ... */ });
    render(<QuantityInput {...formik.getFieldProps('quantity')} />);
    // Test Formik integration
  });

  it('syncs with parent state (controlled)', () => {
    const Parent = () => {
      const [qty, setQty] = useState(5);
      return (
        <>
          <QuantityInput value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          <button onClick={() => setQty(10)}>Set to 10</button>
        </>
      );
    };
    // Test external state updates
  });
});
```

## Acceptance Criteria

### Functional Requirements

- Component implemented in `src/ui/inputs/quantity-input.tsx` with proper TypeScript types
- All component variants (SM, MD, LG sizes) work correctly
- All states (default, hover, focus, typing, disabled, error) render correctly
- Component forwards refs correctly to the input element
- Increment/decrement buttons function correctly
- Keyboard navigation works (ArrowUp/Down, Home/End)
- Min/max bounds are enforced
- Controlled and uncontrolled modes both work

### Testing Requirements

- Comprehensive unit tests with >90% coverage
- All edge cases tested
- All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- **Storybook stories file created: `src/stories/inputs/quantity-input.stories.tsx`**
- **Meta configuration with comprehensive argTypes**
- **Default story implemented**
- **All size variant stories (SM, MD, LG)**
- **All state stories (Default, Hover, Focus, Typing, Disabled, Error)**
- **Real-world examples (minimum 2-3 practical usage scenarios)**
- **Interactive demo story with working increment/decrement**
- **Interactive controls configured for all props**
- **Storybook builds successfully: `npm run build-storybook`**
- **All stories render correctly in Storybook UI**

### Integration Requirements

- Exported through category barrel (`src/ui/inputs/index.ts`)
- Exported through root barrel (`src/ui/index.ts`)
- Component can be imported via `import { QuantityInput } from '@/ui'`

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

3. **Run component tests**: `npm test -- quantity-input`
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

### Composition Pattern

The QuantityInput follows the molecule composition pattern where atoms are assembled into a cohesive unit:

```
┌─────────────────────────────────────────────┐
│ InputLabel (optional atom)                  │
├───────────┬───────────────────┬─────────────┤
│ Quantity  │    Input Field    │  Quantity   │
│ Button    │   (internal)      │  Button     │
│ (minus)   │                   │  (plus)     │
├───────────┴───────────────────┴─────────────┤
│ Hint OR ErrorMessage (conditional atoms)    │
└─────────────────────────────────────────────┘
```

### Border Alignment

The QuantityInputButton atoms have asymmetric borders designed for this composition:

- Minus button: No right border (border-r-0)
- Plus button: No left border (border-l-0)
- Input field: Full border, sits between buttons

This creates a seamless visual appearance when composed.

### Size Mapping

Ensure child components receive correct size variants:

| QuantityInput Size | QuantityInputButton Size | InputLabel Size | Hint Size | ErrorMessage Size |
| ------------------ | ------------------------ | --------------- | --------- | ----------------- |
| sm                 | sm (32px)                | sm              | sm        | sm                |
| md                 | md (40px)                | sm              | sm        | sm                |
| lg                 | lg (48px)                | md              | md        | md                |

### State Considerations

- **Hint vs Error**: Per design patterns, show hint OR error message, not both
- **Button disabling**: Minus disabled at min, Plus disabled at max, both disabled when component disabled
- **Focus ring**: Apply to entire container, not individual elements
