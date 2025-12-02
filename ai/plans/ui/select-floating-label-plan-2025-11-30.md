# Ui: SelectFloatingLabel

## Component Description

SelectFloatingLabel is an enhanced select/dropdown component that features a floating label animation pattern, combining the functionality of the existing Select component with the visual elegance of the TextInputFloatingLabel pattern.

When the select is empty (no value selected), the label appears as placeholder text inside the trigger. Upon focus or when a value is selected, the label smoothly animates to float above the input border, similar to the TextInputFloatingLabel component. This provides a clean, modern form input experience that saves vertical space while maintaining clear labeling.

The component supports all the visual states from the Figma design:

- **Empty**: Label shows as placeholder inside trigger
- **Hovered**: Border color changes on hover
- **Focused - Open**: Label floats with brand color, dropdown opens
- **Selected - Open**: Label floats with brand color, value displayed, dropdown open
- **Selected**: Label floats in tertiary color, value displayed
- **Disabled**: Grayed out, non-interactive
- **Disabled - Selected**: Grayed out with selected value displayed
- **Error**: Destructive border with floating label in error color
- **Error - Selected**: Destructive border with value and error-colored label

## User Story

As a **form designer**
I want to **use select inputs with floating labels**
So that **my forms have a consistent, space-efficient, and modern appearance matching the text input floating label pattern**

## Problem Statement

Currently, the application has a Select component and TextInputFloatingLabel component, but lacks a select input that uses the floating label pattern. This creates visual inconsistency when forms need both text inputs and select inputs - the text inputs have the elegant floating label animation while selects use a traditional label-above pattern.

The Figma design system (Glow UI) provides a SelectFloatingLabel component that fills this gap, and it needs to be implemented to maintain design system consistency.

## Solution Statement

Create a SelectFloatingLabel component that:

1. Combines Radix UI's Select primitive with the floating label animation pattern
2. Reuses the existing Hint, ErrorMessage, and Icon components
3. Follows the same CVA pattern used by TextInputFloatingLabel and Select
4. Provides both a standalone molecule (SelectFloatingLabel) and a convenience field organism (SelectFloatingLabelField)
5. Supports all visual states: Empty, Hovered, Focused-Open, Selected-Open, Selected, Disabled, Disabled-Selected, Error, Error-Selected

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: SelectFloatingLabel is a molecule because it combines multiple atoms (typography, icons, dropdown indicator) into a single, functional form input with complex interactive behavior. The SelectFloatingLabelField variant elevates to an organism by composing the molecule with Hint and ErrorMessage atoms.

**Composition Requirements**:

- **Required Atoms**:
  - `Icon` from `@/ui/icons` - For the chevron dropdown indicator
  - `Hint` from `@/ui/inputs` - For helper text (in Field variant)
  - `ErrorMessage` from `@/ui/inputs` - For error feedback (in Field variant)

- **Required Molecules**:
  - This component will leverage patterns from `Select` and `TextInputFloatingLabel`
  - Uses `@radix-ui/react-select` for the accessible dropdown primitive

## Component Location

**Location**: `src/ui/inputs/select-floating-label.tsx`

**Category**: `inputs`

**Reasoning**: This component belongs in the inputs category because it's a form input element that allows users to select from a list of options. It follows the same pattern as other input components like TextInputFloatingLabel and Select that already exist in this category.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/select-floating-label.tsx
export {
  SelectFloatingLabel,
  selectFloatingLabelWrapperVariants,
  floatingLabelSelectVariants,
};
export type { SelectFloatingLabelProps };

// 2. Create field component: src/ui/inputs/select-floating-label-field.tsx
export { SelectFloatingLabelField };
export type { SelectFloatingLabelFieldProps };

// 3. Update category barrel: src/ui/inputs/index.ts
export * from './select-floating-label';
export * from './select-floating-label-field';

// 4. Import usage:
import { SelectFloatingLabel, SelectFloatingLabelField } from '@/ui/inputs';
import { SelectFloatingLabel, SelectFloatingLabelField } from '@/ui';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/inputs/text-input-floating-label.tsx`** - Primary reference for floating label animation logic
  - Study the `floatingLabelVariants` CVA configuration
  - Understand focus/blur state management with `isFocused` state
  - Reference the `shouldFloat` logic for determining label position
  - Copy the wrapper variant pattern for border/focus states

- **`src/ui/inputs/select.tsx`** - Reference for Radix Select integration
  - Study the SelectSizeContext for propagating size through compound components
  - Reference the selectTriggerVariants for trigger styling
  - Understand how SelectContent and SelectItem work with Radix primitives
  - Leverage the existing variant patterns for consistency

- **`src/ui/inputs/hint.tsx`** - Atom for helper text below input
  - Compose into SelectFloatingLabelField

- **`src/ui/inputs/error-message.tsx`** - Atom for error feedback
  - Compose into SelectFloatingLabelField for error state display

- **`src/ui/icons/icon.tsx`** - Icon component wrapper
  - Use for the chevron dropdown indicator (CaretDown from Phosphor)

- **`src/stories/inputs/select.stories.tsx`** - Story patterns for select components
  - Reference for comprehensive story structure
  - Copy argTypes configuration approach
  - Study the state comparison stories

- **`src/stories/inputs/text-input-floating-label.stories.tsx`** - Story patterns for floating label
  - Reference for demonstrating floating animation
  - Study the AllStates and AllCombinations story patterns

- **`src/ui/inputs/__tests__/select.test.tsx`** - Test patterns for select (if exists)
  - Reference for comprehensive accessibility testing

- **`src/ui/inputs/__tests__/text-input-floating-label.test.tsx`** - Test patterns for floating label
  - Reference for testing focus/blur states
  - Study controlled vs uncontrolled testing patterns

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/select-floating-label.tsx` (REQUIRED)
   - Main SelectFloatingLabel molecule component

2. **Field component file**: `src/ui/inputs/select-floating-label-field.tsx` (REQUIRED)
   - SelectFloatingLabelField organism wrapper with hint/error

3. **Test file**: `src/ui/inputs/__tests__/select-floating-label.test.tsx` (REQUIRED)
   - Comprehensive unit tests for molecule component

4. **Field test file**: `src/ui/inputs/__tests__/select-floating-label-field.test.tsx` (REQUIRED)
   - Unit tests for the field wrapper

5. **Story file**: `src/stories/inputs/select-floating-label.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
   - Comprehensive Storybook documentation

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Yes - Standard 320px width container
- **Tablet (md: 768px - 1023px)**: Yes - Same behavior, may need width adjustments
- **Mobile (< 768px)**: Yes - Full width behavior within containers

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2010-153127&m=dev
- Design specifications extracted from Figma API

**Design Specifications from Figma**:

**Dimensions & Spacing:**

- Container width: 320px (default, full width when in form)
- Border radius: `rounded-sm` (6px per design tokens)
- Padding: px-4 (16px), py-3.5 (14px)
- Gap between elements: 10px (gap-2.5)
- Floating label left offset: 12px with px-1 padding

**Colors (per state):**

- **Empty/Default border**: `border-border` (#d7dbdf)
- **Hover border**: `border-border-hover` (#c1c8cd)
- **Focused border**: `border-2 border-primary` (#3c61dd)
- **Error border**: `border-2 border-destructive` (#e54d2e)
- **Disabled background**: `bg-background-secondary` (#f9fafb)
- **Placeholder/label text**: `text-text-tertiary` (#889096)
- **Value text**: `text-text-primary` (#11181c)
- **Floating label (focused)**: `text-primary` (#3c61dd)
- **Floating label (selected unfocused)**: `text-text-tertiary`
- **Floating label (error)**: `text-destructive` (#e54d2e)
- **Required indicator**: `text-destructive` (#e54d2e)

**Typography:**

- Label (inline): text-base (16px), leading-6 (24px), font-normal
- Label (floating): text-xs (12px), leading-[18px], font-medium
- Value text: text-base (16px), leading-6 (24px), font-normal
- Required asterisk: text-sm (14px), font-medium

**Floating Label Animation:**

- Transition: `transition-all duration-150 ease-out`
- Default position: `top-1/2 -translate-y-1/2` (vertically centered)
- Floating position: `top-0 -translate-y-1/2 scale-75` (above border)
- Origin: `origin-left` for scaling from left

**Icon:**

- Chevron size: 20px (size="md" for lg size, "sm" for sm/md sizes)
- Chevron color: `text-text-tertiary`

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/select-floating-label.stories.tsx`

**Required Stories**:

1. **Default**: Basic SelectFloatingLabel with label and placeholder
2. **AllStates**: Grid showing all 9 visual states (Empty, Hovered, Focused-Open, Selected-Open, Selected, Disabled, Disabled-Selected, Error, Error-Selected)
3. **WithLeftAddOn**: SelectFloatingLabel with left icon/text prefix
4. **WithHint**: SelectFloatingLabelField with hint text
5. **WithError**: SelectFloatingLabelField with error state
6. **WithManyOptions**: Demonstrates scroll behavior
7. **ControlledVsUncontrolled**: Both patterns demonstrated
8. **FormIntegration**: Real-world form example
9. **AllCombinations**: Comprehensive grid of all variants
10. **StandaloneVsField**: Comparison of molecule vs organism usage

**Story Requirements**:

- Use `satisfies Meta<typeof SelectFloatingLabel>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: "centered"`
- Create interactive controls for all configurable props
- Include JSDoc-style component description explaining dual API (molecule vs field)

## Implementation Plan

### Phase 1: Foundation

1. **Study existing patterns thoroughly**
   - Read TextInputFloatingLabel implementation for floating label logic
   - Read Select implementation for Radix integration patterns
   - Understand the CVA variant composition approach

2. **Design the component architecture**
   - Plan state management (open, focused, hasValue)
   - Design the floating label animation logic
   - Plan the prop interface combining Select + floating label needs

### Phase 2: Core Implementation

1. **Create SelectFloatingLabel molecule** (`select-floating-label.tsx`)
   - Implement wrapper variants (border, focus, error states)
   - Implement floating label variants (position, color states)
   - Integrate with Radix Select primitive
   - Handle open state for floating label
   - Support left add-on slot
   - Support required indicator

2. **Create SelectFloatingLabelField organism** (`select-floating-label-field.tsx`)
   - Compose SelectFloatingLabel with Hint and ErrorMessage
   - Handle error state propagation
   - Support options array for convenience
   - Auto-generate IDs for ARIA associations

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Add exports to `src/ui/inputs/index.ts`
- Verify imports work from `@/ui/inputs` and `@/ui`

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/inputs/select-floating-label.stories.tsx`
- All variant stories demonstrating every state
- Interactive controls for label, placeholder, required, error, disabled
- Real-world usage examples (profile settings, form integration)
- Responsive behavior demonstrations

## Step by Step Tasks

### Step 1: Research & Setup

- [ ] Read `src/ui/inputs/text-input-floating-label.tsx` thoroughly
- [ ] Read `src/ui/inputs/select.tsx` thoroughly
- [ ] Understand the focus/value detection logic in TextInputFloatingLabel
- [ ] Plan the state variables needed (isOpen, hasValue)

### Step 2: Create SelectFloatingLabel Component

- [ ] Create `src/ui/inputs/select-floating-label.tsx`
- [ ] Define `selectFloatingLabelWrapperVariants` CVA for wrapper styling
- [ ] Define `floatingLabelSelectVariants` CVA for label animation states
- [ ] Create `SelectFloatingLabelProps` interface
- [ ] Implement SelectFloatingLabel component with:
  - Radix Select.Root, Trigger, Portal, Content, Viewport
  - Floating label element with animation
  - Left add-on support
  - Required indicator
  - Chevron icon
  - Open state detection via `onOpenChange`
  - Value state detection via `value` and `onValueChange`
- [ ] Export component and variants

### Step 3: Verify SelectItem Compatibility

- [ ] Verify existing SelectItem from `select.tsx` renders correctly within SelectFloatingLabel
- [ ] Confirm dropdown item styling matches Figma design (no custom SelectFloatingLabelItem needed)
- [ ] Document in component JSDoc that SelectItem should be imported from `@/ui/inputs`

### Step 4: Create SelectFloatingLabelField Component

- [ ] Create `src/ui/inputs/select-floating-label-field.tsx`
- [ ] Define `SelectFloatingLabelFieldProps` interface
- [ ] Implement SelectFloatingLabelField composing:
  - SelectFloatingLabel
  - Hint (when hint prop provided and no error)
  - ErrorMessage (when error prop provided)
- [ ] Handle error state propagation to SelectFloatingLabel
- [ ] Support options array for convenience API
- [ ] Auto-generate IDs for ARIA associations
- [ ] Export component

### Step 5: Update Barrel Exports

- [ ] Add export for select-floating-label in `src/ui/inputs/index.ts`
- [ ] Add export for select-floating-label-field in `src/ui/inputs/index.ts`

### Step 6: Create Unit Tests for SelectFloatingLabel

- [ ] Create `src/ui/inputs/__tests__/select-floating-label.test.tsx`
- [ ] Test default rendering
- [ ] Test floating label animation:
  - Label not floating when empty and closed
  - Label floating when open
  - Label floating when value selected
- [ ] Test left add-on rendering
- [ ] Test required indicator
- [ ] Test disabled state (non-interactive)
- [ ] Test error state styling
- [ ] Test keyboard navigation
- [ ] Test screen reader accessibility (roles, aria attributes)
- [ ] Test controlled vs uncontrolled patterns

### Step 7: Create Unit Tests for SelectFloatingLabelField

- [ ] Create `src/ui/inputs/__tests__/select-floating-label-field.test.tsx`
- [ ] Test hint rendering
- [ ] Test error message rendering (replaces hint)
- [ ] Test ARIA associations (describedby)
- [ ] Test options array rendering
- [ ] Test ID auto-generation

### Step 8: Create Storybook Stories

- [ ] Create `src/stories/inputs/select-floating-label.stories.tsx`
- [ ] Configure meta with comprehensive argTypes
- [ ] Create Default story
- [ ] Create AllStates story showing all 9 visual states
- [ ] Create WithLeftAddOn story
- [ ] Create WithHint story (using SelectFloatingLabelField)
- [ ] Create WithError story (using SelectFloatingLabelField)
- [ ] Create WithManyOptions story
- [ ] Create ControlledVsUncontrolled story
- [ ] Create FormIntegration story
- [ ] Create AllCombinations story
- [ ] Create StandaloneVsField story

### Step 9: Run Validation Commands

- [ ] Run `npm run type-check` - expect zero errors
- [ ] Run `npm run lint` - expect zero errors/warnings
- [ ] Run `npm test -- select-floating-label` - expect all tests pass
- [ ] Run `npm run test:run` - expect zero regressions
- [ ] Run `npm run build` - expect successful build
- [ ] Run `npm run build-storybook` - expect successful build

## Testing Strategy

### Unit Tests

**SelectFloatingLabel Tests:**

- Renders with label text
- Label starts inline (not floating) when empty
- Label floats when dropdown opens
- Label floats when value is selected and dropdown closes
- Label stays inline when dropdown closes and no value
- Renders left add-on when provided
- Renders required indicator when required prop is true
- Applies error styling when error prop is true
- Applies disabled styling when disabled prop is true
- Chevron icon renders correctly
- Supports controlled value
- Supports uncontrolled defaultValue
- Calls onValueChange when selection changes
- Calls onOpenChange when open state changes
- Keyboard navigation works (Enter to open, Escape to close, arrows to navigate)
- Has correct ARIA attributes (role="combobox", aria-expanded, aria-haspopup)

**SelectFloatingLabelField Tests:**

- Renders hint when hint prop provided
- Renders error message when error prop provided
- Error message replaces hint
- Error prop propagates to SelectFloatingLabel
- Options array renders SelectItem components
- Auto-generates ID for input
- ARIA describedby links to hint/error
- Supports all SelectFloatingLabel props passthrough

### Edge Cases

- Very long label text (should truncate or scale appropriately)
- Very long option labels (should truncate with ellipsis)
- Many options (50+) - should scroll smoothly
- Empty options array - should show empty dropdown
- Label with special characters
- RTL text support
- Browser autofill scenarios (may not apply to select)
- Rapid open/close toggling
- Screen reader announces selection changes
- Focus trap within dropdown

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/inputs/` with proper TypeScript types
- ✅ Floating label animation works correctly (floats on open or when value selected)
- ✅ All 9 visual states render correctly (Empty, Hovered, Focused-Open, Selected-Open, Selected, Disabled, Disabled-Selected, Error, Error-Selected)
- ✅ Component forwards refs correctly
- ✅ Component works as both controlled and uncontrolled
- ✅ Component follows design system patterns (CVA, semantic tokens)
- ✅ SelectFloatingLabelField composes with Hint and ErrorMessage correctly

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/select-floating-label.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **AllStates story showing all 9 visual states**
- ✅ **Real-world examples (minimum 2-3 practical usage scenarios)**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Component can be imported via `import { SelectFloatingLabel, SelectFloatingLabelField } from '@/ui'`

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

3. **Run component tests**: `npm test -- select-floating-label`
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

### Size Handling Strategy

**Decision**: SelectFloatingLabel uses a **fixed size** matching the Figma design specifications.

**Rationale**:

1. The Figma design specifies exact dimensions (px-4 py-3.5) without size variants
2. Floating label animation timing and positioning is optimized for this specific size
3. Keeping a fixed size ensures design fidelity and consistent user experience
4. If size variants are needed in the future, they can be added as a non-breaking enhancement

**Implementation**:

```typescript
// SelectFloatingLabel uses fixed dimensions - no size prop
const selectFloatingLabelWrapperVariants = cva([
  'relative flex items-center',
  'px-4 py-3.5', // Fixed padding from Figma
  'rounded-sm border',
  // ... other styles
]);
```

**Note**: Unlike the base Select component which has sm/md/lg sizes via SelectSizeContext, SelectFloatingLabel intentionally omits size variants to match the Figma design. This is a conscious architectural decision.

### Design Patterns to Follow

1. **State Management**: The component needs to track two pieces of state:
   - `isOpen` - Whether the dropdown is open (for floating label)
   - `hasValue` - Whether a value is selected (for floating label persistence)

2. **Floating Logic**: `shouldFloat = isOpen || hasValue`
   - Label floats when dropdown is open OR when a value is selected
   - Label returns to inline when dropdown closes AND no value selected

3. **CVA Pattern**: Follow the same compound variant pattern as TextInputFloatingLabel:

   ```typescript
   compoundVariants: [
     { floating: true, focused: true, error: false, className: 'text-primary' },
     {
       floating: true,
       focused: false,
       error: false,
       className: 'text-text-tertiary',
     },
     { error: true, className: 'text-destructive' },
   ];
   ```

4. **Radix Integration**: Use `onOpenChange` callback to track open state for floating label logic

### SelectItem Reuse Strategy

**Decision**: SelectFloatingLabel will **reuse SelectItem from the existing Select component** (DRY principle).

**Rationale**:

1. SelectItem styling and behavior is identical across all Select variants
2. Reusing SelectItem maintains consistency and reduces maintenance burden
3. Any improvements to SelectItem automatically benefit all Select variants
4. No visual differences in dropdown items between Select and SelectFloatingLabel per Figma

**Implementation**:

```typescript
// In select-floating-label.tsx - NO SelectFloatingLabelItem component
// Users import SelectItem from the existing Select module

// Usage example:
import { SelectFloatingLabel } from '@/ui/inputs';
import { SelectItem } from '@/ui/inputs';  // From existing Select

<SelectFloatingLabel label="Country">
  <SelectItem value="us">United States</SelectItem>
  <SelectItem value="ca">Canada</SelectItem>
</SelectFloatingLabel>
```

**Alternative Considered**: Creating a SelectFloatingLabelItem wrapper was considered but rejected as it would violate DRY and create maintenance overhead without any benefit.

### Autofill Handling

**Decision**: Autofill detection is **NOT implemented** for SelectFloatingLabel.

**Rationale**:

1. Radix Select uses a custom trigger (button element), not a native `<select>` element
2. Browsers do not autofill custom select implementations - they only autofill native form elements
3. The autofill detection logic from TextInputFloatingLabel is specific to native `<input>` elements
4. If form pre-population is needed, it should be handled via controlled `value` prop at the form library level (e.g., React Hook Form default values)

**Why This Differs from TextInputFloatingLabel**:

- TextInputFloatingLabel wraps a native `<input>` which browsers DO autofill
- TextInputFloatingLabel needs autofill detection to float the label when browser autofills
- SelectFloatingLabel wraps Radix Select (custom button) which browsers DON'T autofill
- Therefore, autofill detection is unnecessary and would add dead code

### Future Considerations

- Multi-select variant (would require different implementation)
- Searchable/filterable select (could combine with InputDropmenu patterns)
- Async options loading
- Virtualized options for very large lists

### Dependencies

- `@radix-ui/react-select` - Already installed for existing Select component
- `@phosphor-icons/react` - For CaretDown chevron icon
- `class-variance-authority` - For CVA variants
- No new dependencies required
