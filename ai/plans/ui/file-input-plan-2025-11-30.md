# Ui: FileInput

## Component Description

The FileInput is a composite form component that enables users to select files from their device. It combines a text display area (showing file name, placeholder, or upload progress), an action button (Browse/Remove/Cancel), and supporting elements (label, hint, error message). The component supports multiple states including empty, uploading, uploaded, disabled, and error states across three sizes.

This is a **molecule-level** component that composes several existing atoms: TextInput (display area styling), FileInputButton, InputLabel, Hint, and ErrorMessage. It provides a complete, accessible file selection experience with visual feedback for all interaction states.

## User Story

As a user filling out a form
I want to select files from my device with clear visual feedback
So that I can upload documents, images, or other files with confidence about what I've selected and its validation status

## Problem Statement

Currently there is no unified FileInput component that combines the file display area with the browse button, label, hint, and error messaging. The existing FileInputButton is a standalone atom that must be manually composed with TextInput and other elements. This requires developers to repeatedly implement the same composition pattern with proper accessibility attributes, state management, and visual consistency.

## Solution Statement

Create a FileInput molecule component that:

1. Composes existing atoms (InputLabel, Hint, ErrorMessage, FileInputButton) with a styled display area
2. Manages visual states automatically based on props (empty, uploading, uploaded, disabled, error)
3. Provides consistent sizing (sm, md, lg) that aligns with the design system
4. Includes proper accessibility with ARIA attributes and screen reader support
5. Supports both controlled and uncontrolled usage patterns
6. Handles the native file input internally with proper ref forwarding

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: FileInput is a molecule because it composes multiple atoms (InputLabel, Hint, ErrorMessage, FileInputButton) along with styled input elements into a cohesive, reusable form field. It represents a single, functional unit in the UI that serves a specific purpose (file selection) but is built from lower-level atomic components.

**Composition Requirements**:

- **Required Atoms**:
  - `InputLabel` from `@/ui/inputs` - For form field labeling
  - `Hint` from `@/ui/inputs` - For helper text display
  - `ErrorMessage` from `@/ui/inputs` - For validation error display
  - `FileInputButton` from `@/ui/inputs` - For the action button (Browse/Remove/Cancel)

## Component Location

**Location**: `src/ui/inputs/file-input.tsx`

**Category**: `inputs`

**Reasoning**: The FileInput is a form input component that belongs in the inputs category alongside related components like TextInput, NumberInput, and QuantityInput. It follows the same pattern of providing a complete form field with optional label, hint, and error messaging.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/file-input.tsx
export { FileInput, fileInputVariants };
export type { FileInputProps };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './file-input';

// 3. Import usage (recommended):
import { FileInput } from '@/ui';

// 4. Import usage (alternative):
import { FileInput } from '@/ui/inputs';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/inputs/file-input-button.tsx`** - The action button atom, already implements size variants (sm, md, lg) and states (default, disabled, error). Understanding its API is critical for proper composition.

- **`src/ui/inputs/text-input.tsx`** - Reference for wrapper styling patterns, focus-within handling, and size-based padding/typography. The display area will follow similar patterns.

- **`src/ui/inputs/input-label.tsx`** - The label atom with required indicator, help icon, and description support. Needs to be properly integrated.

- **`src/ui/inputs/hint.tsx`** - Helper text atom that composes typography components. Shows spacing pattern (pt-2).

- **`src/ui/inputs/error-message.tsx`** - Error display atom with icon and destructive styling. Shows ARIA pattern (role="alert").

- **`src/stories/inputs/file-input-button.stories.tsx`** - Reference for story structure, interactive demo patterns, and composition examples.

- **`src/ui/inputs/__tests__/file-input-button.test.tsx`** - Reference for test organization, accessibility testing, and state testing patterns.

- **`.claude/rules/styling-guidelines.md`** - Design tokens, spacing, colors, and styling patterns.

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/file-input.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/file-input.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/file-input.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Design Specifications from Figma

Based on the Figma design analysis (node 2020:170817), the FileInput has the following specifications:

**Size Variants**:

- **LG (Large - Default)**:
  - Input padding: px-4 (16px), py-3 (12px)
  - Typography: text-base (16px), leading-6 (24px)
  - Label bottom padding: pb-3 (12px)
  - Gap: 12px between input and button
  - Border radius: rounded-sm (6px)

- **MD (Medium)**:
  - Input padding: px-3 (12px), py-2.5 (10px)
  - Typography: text-sm (14px), leading-5 (20px)
  - Label bottom padding: pb-2.5 (10px)
  - Gap: 10px between input and button
  - Border radius: rounded-sm (6px)

- **SM (Small)**:
  - Input padding: px-3 (12px), py-1.5 (6px)
  - Typography: text-sm (14px), leading-5 (20px)
  - Label bottom padding: pb-2.5 (10px)
  - Gap: 8px between input and button
  - Border radius: rounded-xs (4px)

**States**:

1. **Empty**: Placeholder text "No file chosen", Browse button
2. **Hovered**: Darker border (border-border-hover)
3. **Focused**: Primary border color with ring
4. **Uploading**: File name with spinner, Cancel button
5. **Uploaded**: File name + size, Remove button
6. **Disabled**: Gray background, disabled styling on all elements
7. **Disabled - Uploaded**: Shows file but disabled
8. **Error**: Destructive border with error shadow, error message below
9. **Error - Uploaded**: Shows file with error state

**Colors** (from Figma):

- Border default: `border-border` (#d7dbdf)
- Border hover: `border-border-hover` (#c1c8cd)
- Border focus: `border-primary` (#3c61dd)
- Border error: `border-destructive` (#e54d2e)
- Error shadow: `shadow-[0px_0px_0px_3px_#fdd8d3]`
- Background: `bg-background` (#ffffff)
- Background disabled: `bg-background-secondary` (#f9fafb)
- Placeholder text: `text-text-tertiary` (#889096)
- File name text: `text-text-primary` (#11181c)
- Disabled text: `text-text-tertiary` with reduced opacity

### Responsive Design

- **Desktop (lg: 1024px+)**: Yes - Default width of 320px (configurable via className)
- **Tablet (md: 768px - 1023px)**: No specific tablet styling required
- **Mobile (< 768px)**: No specific mobile styling required - component is inherently responsive via width classes

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2020-170817&m=dev
- All state variants documented in Figma including: Empty, Hovered, Focused, Uploading, Uploaded, Disabled, Disabled-Uploaded, Error, Error-Uploaded

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/file-input.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic FileInput with placeholder
2. **AllSizes Story**: SM, MD, LG size comparison
3. **AllStates Story**: Visual overview of all states (Empty, Uploading, Uploaded, Disabled, Error)
4. **WithLabel Story**: FileInput with InputLabel integration
5. **WithHint Story**: FileInput with helper text
6. **WithError Story**: FileInput with error message
7. **UploadingState Story**: Shows spinner and Cancel button
8. **UploadedState Story**: Shows file name and Remove button
9. **DisabledStates Story**: Disabled empty and disabled with file
10. **ErrorStates Story**: Error empty and error with file
11. **CompleteMatrix Story**: Size × State grid showing all combinations
12. **InteractiveDemo Story**: Functional file selection with state management
13. **FormIntegration Story**: Real-world form usage with validation
14. **AccessibilityExample Story**: Documents keyboard navigation and ARIA

**Story Requirements**:

- Use `satisfies Meta<typeof FileInput>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: 'centered'`
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. **Research and setup**:
   - Review Figma design specifications for all states and sizes
   - Study existing atom components (FileInputButton, InputLabel, Hint, ErrorMessage)
   - Understand the composition patterns used in similar molecules (TextInputField, NumberInputField)

2. **Define TypeScript interfaces**:
   - Create `FileInputProps` interface extending relevant base types
   - Define state types: `'empty' | 'uploading' | 'uploaded' | 'disabled' | 'error'`
   - Include props for: size, label, hint, error, disabled, value (file info), placeholder

### Phase 2: Core Implementation

1. **Create CVA variants**:
   - `fileInputWrapperVariants`: Main container styling with size and error variants
   - `fileInputDisplayVariants`: Display area styling matching TextInput patterns

2. **Implement FileInput component**:
   - Compose InputLabel when label prop provided
   - Create display area with proper border handling (rounded-l-\*, no right border)
   - Integrate FileInputButton with matching size and error state
   - Show Hint or ErrorMessage based on state
   - Handle native file input with sr-only pattern
   - Forward ref to the native input element

3. **State management**:
   - Support controlled mode via `value` prop (file info object)
   - Support callback props: `onChange`, `onRemove`, `onCancel`
   - Visual state derived from props (disabled, error, value)

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Export component and variants from `src/ui/inputs/file-input.tsx`
- Add to barrel export in `src/ui/inputs/index.ts`
- Verify import works via `import { FileInput } from '@/ui'`

**Storybook Documentation (REQUIRED):**

- Create comprehensive stories in `src/stories/inputs/file-input.stories.tsx`
- Document all props with argTypes descriptions
- Include interactive examples demonstrating file selection flow
- Show accessibility features and keyboard navigation

## Step by Step Tasks

### Step 1: Create Component Foundation

- Create `src/ui/inputs/file-input.tsx`
- Define TypeScript interfaces:
  - `FileInputValue` type for file information (name, size, progress)
  - `FileInputProps` interface with all supported props
- Create CVA variants for wrapper and display area styles
- Implement base component structure with forwardRef

### Step 2: Implement Visual States

- Implement size variants (sm, md, lg) for:
  - Display area padding and typography
  - Border radius adjustments
  - Label size mapping
- Implement state styling:
  - Empty state with placeholder
  - Uploading state with file name
  - Uploaded state with file name + size
  - Error state with destructive border and shadow
  - Disabled state with background color change
- Ensure seamless border between display area and button

### Step 3: Compose Atom Components

- Integrate InputLabel with conditional rendering
- Connect FileInputButton with proper size and error prop mapping
- Button text logic: "Browse" (empty), "Cancel" (uploading), "Remove" (uploaded)
- Add Hint below input when provided
- Add ErrorMessage below input when error prop provided

### Step 4: Implement Accessibility

- Add hidden native file input with sr-only
- Connect button click to trigger file input
- Add aria-describedby linking to hint/error
- Add aria-invalid when error state
- Ensure focus management and keyboard support
- Add proper labeling via InputLabel htmlFor

### Step 5: Create Unit Tests

- Create `src/ui/inputs/__tests__/file-input.test.tsx`
- Test rendering with default props
- Test all size variants (sm, md, lg)
- Test all states (empty, uploading, uploaded, disabled, error)
- Test InputLabel integration
- Test Hint integration
- Test ErrorMessage integration
- Test FileInputButton text changes based on state
- Test click handlers (onChange, onRemove, onCancel)
- Test disabled prevents interaction
- Test accessibility attributes
- Test ref forwarding
- Test className merging

### Step 6: Create Storybook Stories

- Create `src/stories/inputs/file-input.stories.tsx`
- Implement Default story
- Implement AllSizes story with SM, MD, LG comparison
- Implement AllStates story showing all visual states
- Implement WithLabel, WithHint, WithError stories
- Implement UploadingState and UploadedState stories
- Implement DisabledStates story
- Implement ErrorStates story
- Implement CompleteMatrix story (size × state grid)
- Implement InteractiveDemo with actual file selection
- Implement FormIntegration example
- Implement AccessibilityExample documenting a11y features

### Step 7: Update Barrel Exports

- Add `export * from './file-input';` to `src/ui/inputs/index.ts`
- Verify component can be imported from `@/ui`
- Verify component can be imported from `@/ui/inputs`

### Step 8: Run Validation Commands

- Run `npm run type-check` - expect zero errors
- Run `npm run lint` - expect zero errors
- Run `npm test -- file-input` - expect all tests pass
- Run `npm run test:run` - expect zero regressions
- Run `npm run build` - expect success
- Run `npm run build-storybook` - expect success

## Testing Strategy

### Unit Tests

**Rendering Tests**:

- Renders with default props
- Renders with label prop
- Renders with hint prop
- Renders with error prop and message
- Renders placeholder in empty state
- Renders file name in uploaded state
- Renders file name with progress in uploading state

**Size Variant Tests**:

- Applies sm size classes correctly
- Applies md size classes correctly
- Applies lg size classes (default) correctly
- Label size matches input size

**State Tests**:

- Empty state shows placeholder and Browse button
- Uploading state shows file name and Cancel button
- Uploaded state shows file name + size and Remove button
- Disabled state disables all interactions
- Error state shows destructive styling and error message

**Interaction Tests**:

- Browse button triggers file input click
- onChange fires when file selected
- onRemove fires when Remove clicked (uploaded state)
- onCancel fires when Cancel clicked (uploading state)
- Disabled prevents all interactions

**Accessibility Tests**:

- Has proper role and ARIA attributes
- Label associates with input via htmlFor
- Error message linked via aria-describedby
- Hint linked via aria-describedby
- aria-invalid set when error
- Focus management works correctly
- Keyboard navigation works

**Ref and Integration Tests**:

- Forwards ref to native input element
- Custom className merges properly
- Wrapper className applies correctly

### Edge Cases

- Empty value prop renders empty state
- Null/undefined value renders empty state
- Very long file names truncate properly
- File size formats correctly (KB, MB, GB)
- Multiple state props handled correctly (disabled + error)
- Re-renders correctly when props change
- Handles file input change event correctly

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/inputs/file-input.tsx` with proper TypeScript types
- ✅ All three size variants work correctly (sm, md, lg)
- ✅ All nine states render correctly (empty, hovered, focused, uploading, uploaded, disabled, disabled-uploaded, error, error-uploaded)
- ✅ Component composes InputLabel, Hint, ErrorMessage, FileInputButton atoms
- ✅ Component forwards ref to native file input element
- ✅ Button text changes based on state (Browse/Cancel/Remove)
- ✅ Border styling creates seamless appearance between display and button

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/file-input.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **AllSizes story showing sm, md, lg variants**
- ✅ **AllStates story showing all visual states**
- ✅ **WithLabel, WithHint, WithError stories**
- ✅ **UploadingState and UploadedState stories**
- ✅ **DisabledStates story**
- ✅ **ErrorStates story**
- ✅ **CompleteMatrix story (size × state grid)**
- ✅ **InteractiveDemo with actual file selection**
- ✅ **FormIntegration story**
- ✅ **AccessibilityExample story**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`) - if exists
- ✅ Component can be imported via `import { FileInput } from '@/ui/inputs'`

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

3. **Run component tests**: `npm test -- file-input`
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

### API Design Decisions

The component will support two usage patterns:

1. **Uncontrolled mode** (simple): Just provide callbacks

   ```tsx
   <FileInput label="Upload Resume" onChange={(file) => handleFileSelect(file)} />
   ```

2. **Controlled mode** (full control): Manage state externally
   ```tsx
   <FileInput
     label="Upload Resume"
     value={{ name: 'resume.pdf', size: '2.5 MB' }}
     state="uploaded"
     onRemove={() => clearFile()}
   />
   ```

### Future Considerations

- **Multiple file support**: Current design is single file, could extend to multiple
- **Drag and drop**: Could add a dropzone variant in the future
- **File preview**: For images, could show thumbnail preview
- **Progress bar**: For uploading state, could show actual progress bar instead of spinner
- **File type icons**: Could show different icons based on file type

### Dependencies

No new dependencies required. Uses existing:

- `class-variance-authority` for styling variants
- `@/lib/utils` for cn utility
- Existing atom components from `@/ui/inputs`
