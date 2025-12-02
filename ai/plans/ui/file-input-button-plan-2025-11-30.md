# Ui: FileInputButton

## Component Description

The FileInputButton is a specialized button component designed to serve as the trigger portion of a file input field. It is styled to visually attach to the right side of a text input, creating a seamless composite input pattern where users can either type a filename or click the button to trigger file selection.

This component features:

- **Three size variants** (sm, md, lg) matching the text input sizes
- **Five visual states** (default, hover, pressed, disabled, error)
- **Right-side attachment styling** with rounded corners only on the right (top-right, bottom-right)
- **Left border omission** to seamlessly integrate with an adjacent input field
- **Consistent typography** matching the design system's Inter font family

The FileInputButton is an essential building block for file upload interfaces, providing accessible and consistent file selection triggers.

## User Story

As a user
I want to click a clearly visible button to select files
So that I can easily upload files through a familiar input pattern

## Problem Statement

File inputs require a visually distinct trigger that:

1. Clearly indicates the file selection action
2. Integrates seamlessly with adjacent text inputs showing the selected filename
3. Provides appropriate visual feedback for all interaction states (hover, pressed, disabled, error)
4. Maintains accessibility standards
5. Follows the design system's established patterns

## Solution Statement

Create a `FileInputButton` component that:

1. Implements all size variants (sm, md, lg) using CVA for consistent styling
2. Handles all visual states through CSS state management (hover, active) and props (disabled, error)
3. Uses right-side-only border radius to integrate with adjacent inputs
4. Follows the project's established component patterns (forwardRef, TypeScript types, CVA)
5. Provides proper accessibility attributes (aria-disabled, button role semantics)

## Atomic Design Classification

**Component Type**: Atom

**Reasoning**: The FileInputButton is a fundamental UI element that cannot be decomposed further into smaller functional components. It represents a single, atomic piece of the interface - a button with specific styling for file input scenarios. It does not compose other components internally and serves as a building block for molecules like `FileInput` (which would combine this button with a text input).

**Composition Requirements**:

- **Status**: Base atom - no composition dependencies

The component is self-contained and uses only:

- Native HTML `<button>` element
- Tailwind CSS classes via CVA
- `cn` utility for class merging

Note: This component will be consumed by a future `FileInput` molecule that combines `TextInput` + `FileInputButton`.

## Component Location

**Location**: `src/ui/inputs/file-input-button.tsx`

**Category**: `inputs`

**Reasoning**: The FileInputButton belongs in the `inputs` category because:

1. It is specifically designed for file input scenarios
2. It will be composed with `TextInput` to create file input fields
3. It follows the same sizing conventions as other input components (sm, md, lg)
4. It shares visual language with input-adjacent elements (borders, states)

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/file-input-button.tsx
export { FileInputButton, fileInputButtonVariants };
export type { FileInputButtonProps };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './file-input-button';

// 3. Root barrel already exports from inputs: src/ui/index.ts
// (no changes needed if inputs is already exported)

// 4. Import usage (recommended):
import { FileInputButton } from '@/ui';

// 5. Import usage (alternative):
import { FileInputButton } from '@/ui/inputs';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/buttons/button.tsx`** - Primary reference for:
  - CVA variant structure and compound variants
  - forwardRef pattern with TypeScript types
  - Disabled state handling with `aria-disabled`
  - Focus ring styling patterns

- **`src/ui/inputs/text-input.tsx`** - Reference for:
  - Size variant naming (sm, md, lg)
  - Error state styling with destructive border
  - Hover/focus state patterns for inputs
  - Typography sizes per variant

- **`src/ui/inputs/quantity-input-button.tsx`** - Closely related pattern:
  - Button attached to input styling approach
  - Size consistency with input components

- **`src/stories/buttons/button.stories.tsx`** - Reference for:
  - Storybook meta configuration pattern
  - argTypes configuration for controls
  - Story organization (Default, variants, states, examples)

- **`src/ui/buttons/__tests__/button.test.tsx`** - Reference for:
  - Test organization with describe blocks
  - Testing click handlers, states, keyboard interaction
  - Accessibility testing patterns
  - Edge case coverage

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/file-input-button.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/file-input-button.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/file-input-button.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
4. **Category barrel update**: `src/ui/inputs/index.ts` (add export)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: No specific desktop-only styles - component is size-agnostic
- **Tablet (md: 768px - 1023px)**: No specific tablet-only styles
- **Mobile (< 768px)**: No specific mobile-only styles

The component inherits responsive behavior from parent containers.

### Design Assets

**Status**: Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1053-46498&m=dev

**Design Specifications**:

#### Size Variants

| Size   | Height | Padding X     | Padding Y     | Font Size        | Line Height | Gap |
| ------ | ------ | ------------- | ------------- | ---------------- | ----------- | --- |
| **lg** | auto   | 14px (px-3.5) | 12px (py-3)   | 16px (text-base) | 24px        | 8px |
| **md** | auto   | 12px (px-3)   | 10px (py-2.5) | 14px (text-sm)   | 20px        | 6px |
| **sm** | auto   | 10px (px-2.5) | 6px (py-1.5)  | 14px (text-sm)   | 20px        | 6px |

#### State Styling

| State        | Background                          | Border                             | Text Color                          |
| ------------ | ----------------------------------- | ---------------------------------- | ----------------------------------- |
| **Default**  | `bg-background` (#fff)              | `border-border` (#d7dbdf)          | `text-text-tertiary` (#889096)      |
| **Hovered**  | `bg-background-secondary` (#f9fafb) | `border-border-hover` (#c1c8cd)    | `hover:text-[#7d868c]` (#7d868c)    |
| **Pressed**  | `bg-background-tertiary` (#f0f2f4)  | `border-border-hover` (#c1c8cd)    | `active:text-text-subtle` (#697177) |
| **Disabled** | `bg-background-secondary` (#f9fafb) | `border-border-disabled` (#e0e3e6) | `text-text-secondary` (#c1c8cd)     |
| **Error**    | `bg-background` (#fff)              | `border-destructive` (#e54d2e)     | `text-text-tertiary` (#889096)      |

#### Border Styling

- **Border Implementation**: Use `border border-l-0` pattern (more concise than `border-t border-r border-b border-l-0`)
- **Border Width**: 1px on top, right, bottom; 0px on left (for seamless attachment)
- **Border Radius**: `rounded-tr-sm rounded-br-sm` (6px on right corners only)
- **Left border**: Omitted to attach seamlessly to adjacent input

#### Focus State Styling

- **Focus Ring**: `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none`
- **Error Focus**: `focus-visible:ring-destructive` (replaces primary ring color when error=true)
- **Implementation**: Use `focus-visible` pseudo-class to avoid focus ring on mouse clicks

#### Typography

- **Font Family**: Inter Medium (500 weight)
- **Font Weight**: `font-medium`
- **Tracking**: Normal (0px letter-spacing)

### Figma Token Mapping to Tailwind

| Figma Token               | Tailwind Class      |
| ------------------------- | ------------------- |
| `--spacing-sm` (6px)      | `gap-1.5`, `py-1.5` |
| `--spacing-md` (8px)      | `gap-2`             |
| `--spacing-lg` (10px)     | `px-2.5`, `py-2.5`  |
| `--spacing-xl` (12px)     | `px-3`, `py-3`      |
| `--spacing-xxl` (14px)    | `px-3.5`            |
| `--radius-sm` (6px)       | `rounded-sm`        |
| `--font-size-sm` (14px)   | `text-sm`           |
| `--font-size-md` (16px)   | `text-base`         |
| `--line-height-sm` (20px) | `leading-5`         |
| `--line-height-md` (24px) | `leading-6`         |

## Storybook Stories

**Required**: Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/file-input-button.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic component with default props (lg size, default state)
2. **AllSizes Story**: Visual comparison of sm, md, lg sizes side by side
3. **AllStates Story**: All interaction states (default, hover, pressed, disabled, error)
4. **DisabledState Story**: Isolated disabled variant demonstration
5. **ErrorState Story**: Isolated error variant demonstration
6. **WithTextInput Story**: Real-world example showing button attached to TextInput
7. **FileUploadPattern Story**: Complete file upload pattern example
8. **CompleteMatrix Story**: Grid showing all size × state combinations
9. **InteractiveDemo Story**: Functional file selection demo with state management showing actual file picker integration
10. **AccessibilityExample Story**: Documents proper aria-label usage, keyboard navigation, and screen reader considerations

**Story Requirements**:

- Use `satisfies Meta<typeof FileInputButton>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: "centered"` for default layout
- Create interactive controls for `size`, `disabled`, `error` props
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. **Analyze design tokens** - Map Figma design specifications to existing Tailwind tokens
2. **Study existing patterns** - Review `button.tsx` and `text-input.tsx` for implementation patterns
3. **Define TypeScript types** - Create prop interfaces with proper documentation

### Phase 2: Core Implementation

1. **Create CVA variants** - Define size and state variants matching Figma specs
2. **Implement component** - Build FileInputButton with forwardRef, proper types
3. **Add state handling** - Implement hover, active, disabled, error states
4. **Style border integration** - Configure right-side-only corners, omit left border

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

1. Export component, variants, and types from `file-input-button.tsx`
2. Add export to `src/ui/inputs/index.ts` barrel file
3. Verify component accessible via `import { FileInputButton } from '@/ui'`

**Storybook Documentation (REQUIRED):**

- Story file: `src/stories/inputs/file-input-button.stories.tsx`
- Stories to create:
  - Default (interactive playground)
  - AllSizes (sm, md, lg comparison)
  - AllStates (default, hover, pressed, disabled, error)
  - DisabledState (isolated)
  - ErrorState (isolated)
  - WithTextInput (real-world composition)
  - FileUploadPattern (complete example)
  - CompleteMatrix (all combinations grid)
  - InteractiveDemo (functional file selection)
  - AccessibilityExample (aria and keyboard docs)

## Step by Step Tasks

### Step 1: Research and Planning

- Review `src/ui/buttons/button.tsx` for CVA patterns and TypeScript types
- Review `src/ui/inputs/text-input.tsx` for size naming and input styling conventions
- Review `src/ui/inputs/quantity-input-button.tsx` for adjacent button patterns
- Verify design token mappings in `src/app/globals.css`

### Step 2: Create Component File

- Create `src/ui/inputs/file-input-button.tsx`
- Define `FileInputButtonProps` interface:
  - `size?: 'sm' | 'md' | 'lg'` (default: 'lg')
  - `disabled?: boolean` (default: false)
  - `error?: boolean` (default: false)
  - `className?: string`
  - `children?: ReactNode`
  - Extend `ComponentPropsWithoutRef<'button'>`
- Create `fileInputButtonVariants` CVA function with:
  - Base classes: flex, items-center, justify-center, cursor-pointer, font-medium, transition-colors, border styling (top, right, bottom only), rounded-tr-sm, rounded-br-sm
  - Size variants: lg, md, sm with appropriate padding and typography
  - Error variant: true/false for destructive border
  - Default variants: size='lg', error=false

**Recommended CVA Implementation:**

```typescript
const fileInputButtonVariants = cva(
  [
    // Layout
    'inline-flex items-center justify-center',
    'cursor-pointer',

    // Typography
    'font-medium',

    // Border (3 sides only)
    'border border-l-0',
    'rounded-tr-sm rounded-br-sm',

    // Default state
    'bg-background',
    'border-border',
    'text-text-tertiary',

    // Transitions
    'transition-colors duration-150',

    // Hover state
    'hover:bg-background-secondary',
    'hover:border-border-hover',
    'hover:text-[#7d868c]',

    // Active state
    'active:bg-background-tertiary',
    'active:text-text-subtle',

    // Focus state
    'focus-visible:ring-2 focus-visible:ring-primary',
    'focus-visible:ring-offset-2 focus-visible:outline-none',

    // Disabled state
    'disabled:bg-background-secondary',
    'disabled:border-border-disabled',
    'disabled:text-text-secondary',
    'disabled:cursor-not-allowed',
    'disabled:opacity-52',
  ],
  {
    variants: {
      size: {
        sm: 'gap-1.5 px-2.5 py-1.5 text-sm leading-5',
        md: 'gap-2 px-3 py-2.5 text-sm leading-5',
        lg: 'gap-2 px-3.5 py-3 text-base leading-6',
      },
      error: {
        true: 'border-destructive hover:border-destructive focus-visible:ring-destructive',
        false: '',
      },
    },
    defaultVariants: {
      size: 'lg',
      error: false,
    },
  }
);
```

- Implement `FileInputButton` component with:
  - forwardRef pattern
  - Spread remaining props to button
  - Apply variants via cn()
  - Set `type="button"` as default
  - Handle disabled state properly

**Recommended Component Implementation:**

```typescript
export const FileInputButton = forwardRef<
  HTMLButtonElement,
  FileInputButtonProps
>(
  (
    { size = 'lg', error = false, disabled, className, children, ...props },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={cn(fileInputButtonVariants({ size, error }), className)}
      {...props}
    >
      {children}
    </button>
  )
);

FileInputButton.displayName = 'FileInputButton';
```

### Step 3: Create Unit Tests

- Create `src/ui/inputs/__tests__/file-input-button.test.tsx`
- Test categories:
  - **Rendering**: Default render, children render, custom className
  - **Size variants**: Verify classes for sm, md, lg
  - **State tests**: Disabled state, error state
  - **Click handlers**: onClick fires, doesn't fire when disabled
  - **Keyboard interaction**: Enter/Space triggers click
  - **Accessibility**: Button role, aria-disabled when disabled
  - **Ref forwarding**: Ref is properly forwarded
  - **Edge cases**: Long text, className merging

### Step 4: Create Storybook Stories

- Create `src/stories/inputs/file-input-button.stories.tsx`
- Configure meta object:
  ```typescript
  const meta = {
    title: 'Inputs/FileInputButton',
    component: FileInputButton,
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
    argTypes: {
      size: { control: 'select', options: ['sm', 'md', 'lg'] },
      disabled: { control: 'boolean' },
      error: { control: 'boolean' },
      children: { control: 'text' },
      onClick: { action: 'clicked' },
    },
  } satisfies Meta<typeof FileInputButton>;
  ```
- Implement all required stories:
  - Default
  - AllSizes
  - AllStates
  - DisabledState
  - ErrorState
  - WithTextInput (composition example)
  - FileUploadPattern
  - CompleteMatrix
  - InteractiveDemo (functional file selection with state)
  - AccessibilityExample (aria-label, keyboard navigation docs)

### Step 5: Update Barrel Exports

- Update `src/ui/inputs/index.ts`:
  ```typescript
  export * from './file-input-button';
  ```
- Verify import works: `import { FileInputButton } from '@/ui'`

### Step 6: Run Validation Commands

- Execute all validation commands in order:
  1. `npm run type-check` - Zero TypeScript errors
  2. `npm run lint` - Zero ESLint errors
  3. `npm test -- file-input-button` - All tests pass
  4. `npm run test:run` - Full suite passes
  5. `npm run build` - Build succeeds
  6. `npm run build-storybook` - Storybook builds successfully

## Testing Strategy

### Unit Tests

1. **Rendering Tests**
   - Component renders with default props
   - Children (text) renders correctly
   - Custom className is merged properly
   - Button has `type="button"` by default

2. **Variant Tests**
   - Size 'sm' applies correct classes (px-2.5, py-1.5, text-sm)
   - Size 'md' applies correct classes (px-3, py-2.5, text-sm)
   - Size 'lg' applies correct classes (px-3.5, py-3, text-base)
   - Error state applies destructive border class

3. **State Tests**
   - Disabled state disables button
   - Disabled state sets aria-disabled="true"
   - Disabled state applies disabled styling classes
   - Error state applies error border styling

4. **Interaction Tests**
   - onClick handler fires on click
   - onClick doesn't fire when disabled
   - Enter key triggers click
   - Space key triggers click
   - Keyboard doesn't work when disabled

5. **Accessibility Tests**
   - Button has correct role
   - aria-disabled present when disabled
   - Button is focusable when not disabled
   - Focus ring classes are present

### Edge Cases

- Very long button text doesn't break layout
- Empty children renders valid button
- Multiple class names merge correctly
- Ref forwarding works correctly
- State transitions (enabled to disabled) work

## Acceptance Criteria

### Functional Requirements

- Component implemented in `src/ui/inputs/file-input-button.tsx` with proper TypeScript types
- All size variants (sm, md, lg) render correctly with proper dimensions
- All states (default, hover, pressed, disabled, error) display correctly
- Component forwards refs correctly
- onClick handlers work correctly and are blocked when disabled
- Border styling correctly shows only top, right, bottom borders
- Border radius only on right corners (tr, br)

### Testing Requirements

- Comprehensive unit tests with >90% coverage
- All edge cases tested
- All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- **Storybook stories file created: `src/stories/inputs/file-input-button.stories.tsx`**
- **Meta configuration with comprehensive argTypes**
- **Default story implemented**
- **AllSizes story showing sm, md, lg**
- **AllStates story showing all interaction states**
- **DisabledState story implemented**
- **ErrorState story implemented**
- **WithTextInput composition example**
- **FileUploadPattern real-world example**
- **CompleteMatrix showing all combinations**
- **InteractiveDemo functional file selection story**
- **AccessibilityExample story with aria-label and keyboard docs**
- **Interactive controls configured for all props**
- **Storybook builds successfully: `npm run build-storybook`**
- **All stories render correctly in Storybook UI**

### Integration Requirements

- Exported through category barrel (`src/ui/inputs/index.ts`)
- Exported through root barrel (`src/ui/index.ts`)
- Component can be imported via `import { FileInputButton } from '@/ui'`

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

3. **Run component tests**: `npm test -- file-input-button`
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

### Design Considerations

- The FileInputButton is designed to be used alongside TextInput to create a file input pattern
- The omitted left border and right-only border radius create a seamless visual connection with the adjacent input
- Typography and sizing align with TextInput variants for visual consistency

### Future Considerations

- A `FileInput` molecule component will be created to combine TextInput + FileInputButton
- Consider adding an `icon` prop for adding a file/upload icon in the future
- The component could be extended to support file type indicators

### Implementation Notes

- Use CSS custom properties for state-based hover/active colors where Tailwind classes don't exist
- Use `border border-l-0` pattern for three-sided border (more concise than `border-t border-r border-b border-l-0`)
- Default button text should be "Browse" or similar - but this is controlled by consumers via children

### Hidden File Input Integration Patterns

The FileInputButton is designed to work with hidden file inputs. Here are the recommended integration patterns:

**Pattern 1: Using Label Wrapper (Recommended)**

```tsx
<label className="inline-flex">
  <input type="file" className="sr-only" onChange={handleFileChange} />
  <TextInput
    value={fileName}
    readOnly
    wrapperClassName="rounded-r-none border-r-0"
  />
  <FileInputButton as="span">Browse</FileInputButton>
</label>
```

**Pattern 2: Using Click Handler with Ref**

```tsx
const fileInputRef = useRef<HTMLInputElement>(null);

<input
  ref={fileInputRef}
  type="file"
  className="sr-only"
  onChange={handleFileChange}
/>
<div className="inline-flex">
  <TextInput value={fileName} readOnly wrapperClassName="rounded-r-none border-r-0" />
  <FileInputButton onClick={() => fileInputRef.current?.click()}>
    Browse
  </FileInputButton>
</div>
```

**Pattern 3: Programmatic File Selection**

```tsx
const handleClick = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    setFileName(file?.name || '');
  };
  input.click();
};

<FileInputButton onClick={handleClick}>Browse</FileInputButton>;
```

### Accessibility Notes

- Button should have proper focus indicators
- When used with file input, ensure proper labeling of the overall file input group
- aria-disabled should be used alongside the disabled attribute for maximum compatibility
