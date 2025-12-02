# Ui: TextInput

## Component Description

The TextInput component is a comprehensive form text input element from the Glow UI design system. It provides a styled text input field with support for labels, hints, error messages, and add-ons (prefix/suffix elements). The component handles multiple interactive states (empty, hovered, focused, typing, filled, disabled, error) and comes in three sizes (SM, MD, LG). It's designed to compose with existing InputLabel, Hint, and ErrorMessage atoms for a complete form input experience.

## User Story

As a developer building forms
I want to use a consistent, well-designed text input component
So that I can create accessible, visually consistent forms that match our design system

## Problem Statement

Forms require text input fields that handle various states (focus, error, disabled) while maintaining visual consistency with the design system. Currently, there's no reusable TextInput component that integrates with the existing InputLabel, Hint, and ErrorMessage components, forcing developers to manually wire these together for each form field.

## Solution Statement

Create a **dual API** TextInput implementation:

1. **TextInput** - A standalone input component (input field only) that handles visual states, add-ons, and ref forwarding
2. **TextInputField** - An optional convenience wrapper that composes TextInput with InputLabel, Hint, and ErrorMessage

This dual approach follows React's composition philosophy by:

- Providing **flexibility** for custom layouts (TextInput standalone)
- Providing **convenience** for simple forms (TextInputField wrapper)
- Avoiding API bloat from prop drilling
- Maintaining consistency with existing atom patterns

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: TextInput is a molecule because it composes multiple atoms (InputLabel, Hint, ErrorMessage, Icon) together with a base input element to create a higher-level, reusable form component. It's not complex enough to be an organism but does represent a meaningful grouping of smaller components.

**Composition Requirements**:

- **Required Atoms**:
  - `InputLabel` from `@/ui/inputs` - For the label text, required indicator, and help icon
  - `Hint` from `@/ui/inputs` - For helper text below the input
  - `ErrorMessage` from `@/ui/inputs` - For validation error messages
  - `Icon` from `@/ui/icons` - For any add-on icons
- **Required Molecules**: None
- **Required Organisms**: None

## Component Location

**Location**:

- `src/ui/inputs/text-input.tsx` - Standalone input component
- `src/ui/inputs/text-input-field.tsx` - Convenience wrapper (optional)

**Category**: `inputs` - This is a form input component that belongs with other input-related components like InputLabel, Hint, and ErrorMessage.

**Reasoning**: The inputs category already contains InputLabel, Hint, and ErrorMessage components. TextInput naturally belongs in this category as it represents the actual input field that these support components are designed to work with.

**Export Pattern**:

```typescript
// 1. Create standalone component: src/ui/inputs/text-input.tsx
export { TextInput, textInputVariants };
export type { TextInputProps };

// 2. Create convenience wrapper: src/ui/inputs/text-input-field.tsx
export { TextInputField };
export type { TextInputFieldProps };

// 3. Update category barrel: src/ui/inputs/index.ts
export * from './text-input';
export * from './text-input-field';

// 4. Import usage (standalone - for custom layouts):
import { TextInput } from '@/ui';

// 5. Import usage (convenience wrapper - for simple forms):
import { TextInputField } from '@/ui';

// 6. Import both (common pattern):
import { TextInput, TextInputField } from '@/ui/inputs';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/inputs/input-label.tsx`** - InputLabel atom that will be composed into TextInput
  - Pattern for size variants (sm, md)
  - Required indicator and help icon patterns
  - CVA variant structure

- **`src/ui/inputs/hint.tsx`** - Hint atom for helper text
  - Typography integration pattern (TextXs, TextSm)
  - Size variants matching input sizes

- **`src/ui/inputs/error-message.tsx`** - ErrorMessage atom for validation feedback
  - Error icon and text styling
  - Accessibility patterns (role="alert")

- **`src/ui/buttons/button.tsx`** - Reference for CVA patterns
  - Complex variant system with compound variants
  - Icon integration patterns
  - Loading state patterns

- **`src/stories/inputs/input-label.stories.tsx`** - Storybook patterns
  - Meta configuration with comprehensive argTypes
  - Story organization (Default, Sizes, AllCombinations, FormIntegration)
  - Real-world example patterns

- **`src/ui/inputs/__tests__/input-label.test.tsx`** - Testing patterns for input components

- **`src/app/globals.css`** - Design tokens reference
  - Border colors: `--color-border`, `--color-border-hover`
  - Background colors: `--color-background`, `--color-background-secondary`
  - Focus/brand colors: `--color-primary`
  - Error colors: `--color-destructive`

### New Files (ALL are REQUIRED)

1. **Standalone component**: `src/ui/inputs/text-input.tsx` (REQUIRED)
2. **Convenience wrapper**: `src/ui/inputs/text-input-field.tsx` (REQUIRED)
3. **Test file (standalone)**: `src/ui/inputs/__tests__/text-input.test.tsx` (REQUIRED)
4. **Test file (wrapper)**: `src/ui/inputs/__tests__/text-input-field.test.tsx` (REQUIRED)
5. **Story file**: `src/stories/inputs/text-input.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
6. **Category barrel update**: `src/ui/inputs/index.ts` (add exports)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: No - Component is fluid-width, adapts to container
- **Tablet (md: 768px - 1023px)**: No - Same as desktop
- **Mobile (< 768px)**: No - Same as desktop (full-width in containers)

The component is designed to be responsive by default through its fluid-width nature. It fills its container and can be sized via parent containers or explicit width classes.

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1985-109501&m=dev
- Screenshot: Reviewed (showing all state/size combinations)

**Design Specifications**:

**Sizes**:
| Size | Height | Padding X | Padding Y | Gap | Font Size | Line Height | Border Radius |
|------|--------|-----------|-----------|-----|-----------|-------------|---------------|
| SM | auto | 12px | 6px | 8px | 14px | 20px | 6px |
| MD | auto | 14px | 10px | 10px| 14px | 20px | 6px |
| LG | auto | 16px | 12px | 12px| 16px | 24px | 6px |

**States**:
| State | Border Color | Background | Text Color |
|-----------------|--------------------------------|------------------------|-----------------|
| Empty | border (#d7dbdf) | white (#ffffff) | tertiary |
| Hovered | border-hover (#c1c8cd) | white (#ffffff) | tertiary |
| Focused | primary (#3c61dd) | white (#ffffff) | primary |
| Typing | primary (#3c61dd) | white (#ffffff) | primary |
| Filled | border (#d7dbdf) | white (#ffffff) | primary |
| Disabled | border (#d7dbdf) | secondary (#f9fafb) | tertiary |
| Disabled-Filled | border (#d7dbdf) | secondary (#f9fafb) | primary |
| Error | destructive (#e54d2e) | white (#ffffff) | tertiary |
| Error-Filled | destructive (#e54d2e) | white (#ffffff) | primary |

**Label Spacing** (from label to input):

- SM: 10px (pb-2.5)
- MD: 10px (pb-2.5)
- LG: 12px (pb-3)

**Hint/Error Spacing** (from input to hint/error):

- All sizes: 8px (pt-2)

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/text-input.stories.tsx`

**Required Stories**:

**TextInput (Standalone) Stories:**

1. **Default Story**: Basic TextInput with default props (LG size, empty state)
2. **Sizes Story**: Comparison of SM, MD, LG sizes side by side
3. **All States Story**: Grid showing all 9 states (Empty, Hovered, Focused, Typing, Filled, Disabled, Disabled-Filled, Error, Error-Filled)
4. **With Add-ons Story**: Input with left and/or right add-ons (text, icons)
5. **Manual Composition Story**: TextInput with manually composed InputLabel, Hint, ErrorMessage (demonstrates flexibility)
6. **Custom Layout Story**: TextInput in complex layouts (e.g., label with "Forgot password?" link)

**TextInputField (Convenience Wrapper) Stories:** 7. **Field Default Story**: Basic TextInputField with label 8. **Field With Hint Story**: TextInputField with hint text 9. **Field With Error Story**: TextInputField in error state 10. **Field Full Featured Story**: TextInputField with label, required indicator, hint text 11. **Field All Sizes Story**: Comparison showing size mapping to child components

**Integration Stories:** 12. **Form Integration Story**: Real-world form example using both TextInput and TextInputField 13. **Controlled vs Uncontrolled Story**: Demonstrating both patterns 14. **All Combinations Story**: Grid showing all size/state combinations 15. **When To Use Which Story**: Side-by-side comparison of TextInput vs TextInputField use cases

**Story Requirements**:

- Use `satisfies Meta<typeof TextInput>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout` to "centered" for most stories
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. Research and understand the exact styling from Figma design context
2. Identify all CVA variants needed (size, state combinations handled via props)
3. Plan the dual component API and TypeScript types
4. Define size mapping constant for InputLabel integration

### Phase 2: TextInput (Standalone Component)

1. Create the textInputVariants CVA configuration with size variants
2. Create textInputWrapperVariants for add-on container
3. Implement the base TextInput component with:
   - Native input element with proper ref forwarding
   - Size variants (sm, md, lg)
   - Error boolean prop (visual state only)
   - Left and right add-on slots (ReactNode)
   - aria-invalid attribute support
4. Handle visual states via CSS (hover, focus via pseudo-classes)
5. Handle disabled and error states via props

### Phase 3: TextInputField (Convenience Wrapper)

1. Create TextInputField component that composes:
   - TextInput (base input)
   - InputLabel (optional, based on label prop)
   - Hint (optional, based on hint prop)
   - ErrorMessage (optional, based on error prop)
2. Implement useId() for automatic ID generation
3. Implement INPUT_LABEL_SIZE_MAP constant for size mapping:
   ```typescript
   const INPUT_LABEL_SIZE_MAP = {
     sm: 'sm',
     md: 'sm',
     lg: 'md',
   } as const;
   ```
4. Wire up aria-describedby to hint/error IDs
5. Pass through props via labelProps, hintProps, errorProps

### Phase 4: Design System Integration & Documentation

**Export Configuration:**

- Add exports to `src/ui/inputs/index.ts`
- Verify imports work via `import { TextInput, TextInputField } from '@/ui'`

**Storybook Documentation (REQUIRED):**

- Create comprehensive story file at `src/stories/inputs/text-input.stories.tsx`
- Include all required stories for both TextInput and TextInputField
- Document when to use each component
- Show manual composition examples for custom layouts
- Demonstrate accessibility features

## Step by Step Tasks

### 1. Create TextInput Component (Standalone)

- [ ] Create `src/ui/inputs/text-input.tsx`
- [ ] Define TextInputProps interface:
  ```typescript
  interface TextInputProps
    extends
      Omit<ComponentPropsWithoutRef<'input'>, 'size'>,
      VariantProps<typeof textInputVariants> {
    leftAddOn?: ReactNode;
    rightAddOn?: ReactNode;
  }
  ```
- [ ] Create textInputWrapperVariants with CVA for container
- [ ] Create textInputVariants with CVA for input field
- [ ] Implement forwardRef to native input element
- [ ] Add displayName for debugging

### 2. Implement Size Variants

- [ ] Add SM size (py-1.5 px-3, text-sm leading-5, gap-2)
- [ ] Add MD size (py-2.5 px-3.5, text-sm leading-5, gap-2.5)
- [ ] Add LG size (py-3 px-4, text-base leading-6, gap-3)
- [ ] Ensure border radius is consistent (rounded-sm / 6px)
- [ ] Set default variant to 'lg'

### 3. Implement State Handling (CSS Pseudo-classes)

- [ ] Default/Empty state (border-border, bg-background)
- [ ] Hover state via hover: pseudo-class (hover:border-border-hover)
- [ ] Focus state via focus: pseudo-class (focus:border-primary focus:ring-2 focus:ring-primary)
- [ ] Disabled state via disabled: pseudo-class (disabled:bg-background-secondary disabled:cursor-not-allowed)
- [ ] Error state via error variant (border-destructive focus:border-destructive focus:ring-destructive)
- [ ] Implement placeholder styling (placeholder:text-text-tertiary)
- [ ] Implement filled text styling (text-text-primary)

### 4. Implement Add-on Slots

- [ ] Add leftAddOn prop (ReactNode) for prefix content
- [ ] Add rightAddOn prop (ReactNode) for suffix content
- [ ] Style add-ons with proper spacing and alignment
- [ ] Add-on container should use text-text-tertiary color
- [ ] Add-ons render inside wrapper, alongside input

### 5. Create TextInputField Component (Convenience Wrapper)

- [ ] Create `src/ui/inputs/text-input-field.tsx`
- [ ] Define INPUT_LABEL_SIZE_MAP constant:
  ```typescript
  const INPUT_LABEL_SIZE_MAP = {
    sm: 'sm',
    md: 'sm',
    lg: 'md',
  } as const;
  ```
- [ ] Define TextInputFieldProps interface:
  ```typescript
  interface TextInputFieldProps extends Omit<TextInputProps, 'error'> {
    label?: string;
    labelProps?: Partial<Omit<InputLabelProps, 'label' | 'htmlFor'>>;
    hint?: string;
    hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;
    error?: string;
    errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;
  }
  ```
- [ ] Import useId from React for automatic ID generation
- [ ] Generate inputId, hintId, errorId from useId()
- [ ] Conditionally render InputLabel when label prop provided
- [ ] Map TextInput size to InputLabel size using INPUT_LABEL_SIZE_MAP
- [ ] Conditionally render Hint when hint prop provided (and no error)
- [ ] Conditionally render ErrorMessage when error prop provided
- [ ] Wire aria-describedby to point to hintId or errorId
- [ ] Wire aria-invalid when error is present
- [ ] Wire aria-required from labelProps.required
- [ ] Add displayName for debugging

### 6. Accessibility Implementation

**TextInput (standalone):**

- [ ] Forward ref to native input element
- [ ] Set aria-invalid when error prop is true
- [ ] Accept standard aria-\* attributes via spread

**TextInputField (wrapper):**

- [ ] Use useId() to generate unique IDs when not provided
- [ ] Set aria-describedby pointing to hint or error message ID
- [ ] Ensure label htmlFor connects to input id
- [ ] Pass aria-required from labelProps.required

### 7. Create Unit Tests for TextInput (Standalone)

- [ ] Create `src/ui/inputs/__tests__/text-input.test.tsx`
- [ ] Test rendering with default props
- [ ] Test all size variants (sm, md, lg)
- [ ] Test error state applies correct classes
- [ ] Test disabled state
- [ ] Test left/right add-ons render correctly
- [ ] Test ref forwarding works
- [ ] Test aria-invalid when error is true
- [ ] Test className merging
- [ ] Test controlled and uncontrolled modes
- [ ] Aim for >90% coverage

### 8. Create Unit Tests for TextInputField (Wrapper)

- [ ] Create `src/ui/inputs/__tests__/text-input-field.test.tsx`
- [ ] Test rendering with label
- [ ] Test rendering with hint
- [ ] Test rendering with error (hides hint)
- [ ] Test size mapping to InputLabel (lg->md, md->sm, sm->sm)
- [ ] Test ID generation with useId()
- [ ] Test aria-describedby points to correct element
- [ ] Test labelProps passthrough
- [ ] Test hintProps passthrough
- [ ] Test errorProps passthrough
- [ ] Test ref forwarding to underlying input
- [ ] Aim for >90% coverage

### 9. Create Storybook Stories (REQUIRED)

- [ ] Create `src/stories/inputs/text-input.stories.tsx`
- [ ] Configure meta with comprehensive argTypes for TextInput
- [ ] Implement Default story (TextInput standalone)
- [ ] Implement Sizes comparison story
- [ ] Implement AllStates grid story
- [ ] Implement WithAddons story
- [ ] Implement ManualComposition story (demonstrates flexibility)
- [ ] Implement CustomLayout story (label with "Forgot password?" link)
- [ ] Configure secondary meta for TextInputField
- [ ] Implement FieldDefault story
- [ ] Implement FieldWithHint story
- [ ] Implement FieldWithError story
- [ ] Implement FieldFullFeatured story
- [ ] Implement FieldAllSizes story (shows size mapping)
- [ ] Implement FormIntegration story (real-world form)
- [ ] Implement WhenToUseWhich story (comparison guide)
- [ ] Implement ControlledVsUncontrolled story
- [ ] Implement AllCombinations comprehensive grid

### 10. Export Configuration

- [ ] Update `src/ui/inputs/index.ts` to export TextInput
- [ ] Update `src/ui/inputs/index.ts` to export TextInputField
- [ ] Verify export works via `import { TextInput } from '@/ui'`
- [ ] Verify export works via `import { TextInputField } from '@/ui'`

### 11. Run Validation Commands

- [ ] Run `npm run type-check` - expect zero errors
- [ ] Run `npm run lint` - expect zero errors
- [ ] Run `npm test -- text-input` - expect all tests pass
- [ ] Run `npm run test:run` - expect no regressions
- [ ] Run `npm run build` - expect successful build
- [ ] Run `npm run build-storybook` - expect successful Storybook build

## Testing Strategy

### Unit Tests for TextInput (Standalone)

- **Rendering tests**: Verify component renders with all prop combinations
- **Size variant tests**: Verify correct classes applied for sm/md/lg
- **Error state tests**: Verify error prop applies correct border/ring classes
- **Disabled state tests**: Verify disabled prop applies correct classes
- **Add-on tests**: Verify left/right add-ons render in correct positions
- **Ref forwarding test**: Verify ref properly forwards to native input
- **Accessibility tests**: Verify aria-invalid when error is true
- **Event tests**: Verify onChange, onBlur, onFocus work correctly
- **className merging**: Verify custom className merges with variants

### Unit Tests for TextInputField (Wrapper)

- **Label rendering**: Verify InputLabel renders when label prop provided
- **Hint rendering**: Verify Hint renders when hint prop provided
- **Error rendering**: Verify ErrorMessage renders when error prop provided
- **Error precedence**: Verify error hides hint when both provided
- **Size mapping tests**: Verify INPUT_LABEL_SIZE_MAP works correctly:
  - sm → InputLabel sm
  - md → InputLabel sm
  - lg → InputLabel md
- **ID generation**: Verify useId() generates unique IDs
- **ID association**: Verify label htmlFor matches input id
- **aria-describedby**: Verify points to hintId when hint present
- **aria-describedby**: Verify points to errorId when error present
- **aria-invalid**: Verify set when error is present
- **Props passthrough**: Verify labelProps, hintProps, errorProps pass through
- **Ref forwarding**: Verify ref forwards to underlying TextInput

### Edge Cases

**TextInput (standalone):**

- Input with only add-ons (no wrapper needed)
- Disabled input with filled value
- Error state with filled value
- Controlled input with undefined value
- Uncontrolled input with defaultValue
- Very long placeholder text
- Add-on with complex ReactNode (icon + text)

**TextInputField (wrapper):**

- Empty label (should not render InputLabel)
- Empty hint (should not render Hint)
- Both error and hint provided (error should take precedence, hint hidden)
- Very long label text
- Long error message text
- Label with required indicator
- Custom ID provided vs auto-generated ID
- All three: label + hint + error (error shown, hint hidden)

## Acceptance Criteria

### Functional Requirements

**TextInput (Standalone):**

- ✅ Component implemented in `src/ui/inputs/text-input.tsx` with proper TypeScript types
- ✅ All size variants work correctly (sm, md, lg)
- ✅ All visual states work correctly (empty, hover, focus, disabled, error)
- ✅ Component forwards refs correctly to native input
- ✅ Left and right add-on slots work correctly
- ✅ error prop is boolean (visual state only)
- ✅ Component follows design system patterns (CVA, semantic tokens)

**TextInputField (Wrapper):**

- ✅ Component implemented in `src/ui/inputs/text-input-field.tsx` with proper TypeScript types
- ✅ Composes TextInput with InputLabel, Hint, ErrorMessage atoms
- ✅ Uses useId() for automatic ID generation
- ✅ Size mapping works correctly (INPUT_LABEL_SIZE_MAP)
- ✅ error prop is string (renders ErrorMessage when present)
- ✅ Error takes precedence over hint (hint hidden when error present)
- ✅ aria-describedby wired correctly to hint/error IDs
- ✅ Passes through labelProps, hintProps, errorProps

### Testing Requirements

- ✅ Comprehensive unit tests for TextInput with >90% coverage
- ✅ Comprehensive unit tests for TextInputField with >90% coverage
- ✅ All edge cases tested for both components
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/text-input.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes for both components**
- ✅ **TextInput stories: Default, Sizes, AllStates, WithAddons, ManualComposition, CustomLayout**
- ✅ **TextInputField stories: FieldDefault, FieldWithHint, FieldWithError, FieldFullFeatured, FieldAllSizes**
- ✅ **Integration stories: FormIntegration, WhenToUseWhich, ControlledVsUncontrolled, AllCombinations**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ TextInput exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ TextInputField exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Both components can be imported via `import { TextInput, TextInputField } from '@/ui'`

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

3. **Run component tests**: `npm test -- text-input`
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

### API Design Decisions - DUAL API APPROACH

Following the architectural review, the implementation uses a **dual API approach**:

**1. TextInput (Standalone - for flexibility):**

```typescript
// Props focus on the input itself only
interface TextInputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean; // Visual state only
  leftAddOn?: ReactNode; // Prefix slot
  rightAddOn?: ReactNode; // Suffix slot
}
```

**Usage - Manual composition for custom layouts:**

```typescript
<div className="flex justify-between">
  <InputLabel label="Password" required />
  <Link href="/forgot">Forgot password?</Link>
</div>
<TextInput size="lg" error={!!errors.password} aria-describedby="password-error" />
{errors.password && <ErrorMessage id="password-error" text={errors.password} />}
```

**2. TextInputField (Wrapper - for convenience):**

```typescript
// Props include composition helpers
interface TextInputFieldProps extends Omit<TextInputProps, 'error'> {
  label?: string;
  labelProps?: Partial<Omit<InputLabelProps, 'label' | 'htmlFor'>>;
  hint?: string;
  hintProps?: Partial<Omit<HintProps, 'children' | 'id'>>;
  error?: string; // String renders ErrorMessage
  errorProps?: Partial<Omit<ErrorMessageProps, 'text' | 'id'>>;
}
```

**Usage - Simple forms:**

```typescript
<TextInputField
  label="Email"
  labelProps={{ required: true }}
  hint="We'll never share your email"
  error={errors.email}
/>
```

### Size Mapping

TextInput has 3 sizes, InputLabel/Hint/ErrorMessage have 2 sizes. The mapping:

| TextInput Size | InputLabel Size | Hint/Error Size |
| -------------- | --------------- | --------------- |
| sm             | sm              | sm              |
| md             | sm              | sm              |
| lg             | md              | md              |

### State Management Notes

Visual states like hover and focus will be handled via CSS pseudo-classes rather than React state. Only error and disabled states require props since they come from external validation logic.

The components support both controlled (value + onChange) and uncontrolled (defaultValue) patterns to work seamlessly with form libraries like React Hook Form.

### Why Dual API?

1. **Follows React composition philosophy** - TextInput can be composed externally
2. **Provides convenience** - TextInputField for simple, standard forms
3. **No prop drilling/bloat** - labelProps passes through instead of labelRequired, labelShowIcon, etc.
4. **Consistent with codebase** - Existing atoms (InputLabel, Hint, ErrorMessage) are standalone
5. **Maximum flexibility** - Custom layouts remain possible

### Future Considerations

- Password input variant with visibility toggle
- Number input variant with increment/decrement buttons
- Search input variant with clear button
- Textarea variant (may be separate component)
- Character count indicator
- Input masks for formatted input (phone, credit card, etc.)
