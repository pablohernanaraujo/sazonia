# Ui: InputLabel

## Component Description

The InputLabel component is a form label element that provides consistent labeling for input fields. It displays a label text with optional required indicator (red asterisk), an optional help icon with tooltip capability, and an optional description text below the label. The component supports two sizes (SM and MD) to accommodate different input field contexts.

This component is essential for form accessibility and user experience, providing clear identification of form fields while indicating required status and offering additional context through descriptions.

## User Story

As a user filling out a form
I want to clearly see what each input field requires
So that I can provide accurate information and understand when fields are mandatory

## Problem Statement

Forms need consistent, accessible labels that:

- Clearly identify what information is expected
- Indicate when fields are required
- Provide additional help or context when needed
- Maintain visual consistency across different input sizes

## Solution Statement

Create an InputLabel component that composes existing Typography components (TextSm, TextMd) and the Icon component to provide:

- Size-responsive label text (SM: 14px, MD: 16px)
- Required field indicator (red asterisk)
- Optional help icon for tooltips
- Optional description text for additional context
- Proper accessibility with htmlFor attribute support

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: InputLabel is a molecule because it combines multiple atoms (Text components, Icon) into a cohesive, reusable unit. It has a specific purpose (labeling form inputs) and provides more functionality than individual atoms but isn't complex enough to be an organism.

**Composition Requirements**:

- **Required Atoms**:
  - `TextSm` from `@/ui/typography` - For SM size label and description
  - `TextMd` from `@/ui/typography` - For MD size label
  - `Icon` from `@/ui/icons` - For the help/tooltip icon

- **Status**: Molecule composing existing atoms

## Component Location

**Location**: `src/ui/inputs/input-label.tsx`

**Category**: `inputs` - This component belongs to the inputs category as it's specifically designed for form input labeling and will be used alongside input fields, textareas, selects, etc.

**Reasoning**: Creating a new `inputs` category is appropriate because:

1. This is the first form-related component in the design system
2. Future input components (Input, Select, Textarea, etc.) will be grouped here
3. It follows the pattern of organizing components by domain/function

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/input-label.tsx
export { InputLabel, inputLabelVariants };
export type { InputLabelProps };

// 2. Create category barrel: src/ui/inputs/index.ts
export * from './input-label';

// 3. Update root barrel: src/ui/index.ts
export * from './inputs';

// 4. Import usage (recommended):
import { InputLabel } from '@/ui';

// 5. Import usage (alternative):
import { InputLabel } from '@/ui/inputs';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/typography/text.tsx`** - For understanding Text component patterns (TextSm, TextMd) that will be composed in InputLabel
  - Study CVA patterns and variant structure
  - Understand polymorphic rendering with `as` and `asChild`
  - Reference color variants for consistent semantic colors

- **`src/ui/icons/icon.tsx`** - For understanding Icon component usage
  - Reference size and color variant patterns
  - Understand accessibility props (aria-label, aria-hidden)

- **`src/stories/typography/text.stories.tsx`** - For Storybook story patterns
  - Reference argTypes configuration
  - Study story organization (Default, Variants, States)
  - Understand render function patterns

- **`src/ui/typography/__tests__/text.test.tsx`** - For testing patterns
  - Reference test structure and assertions
  - Understand variant testing approach
  - Study ref forwarding tests

- **`src/ui/index.ts`** - Root barrel file to update with new category export

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/input-label.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/input-label.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/input-label.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
4. **Category barrel**: `src/ui/inputs/index.ts` (REQUIRED - new category)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: No - Component uses same styling
- **Tablet (md: 768px - 1023px)**: No - Component uses same styling
- **Mobile (< 768px)**: No - Component uses same styling

The component is responsive through its size variants (SM/MD) which are selected by the parent context, not viewport.

### Design Assets

**Status**: Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2367-169485&m=dev

**Design Specifications from Figma**:

**Size Variants**:

- **SM (Small)**:
  - Label: 14px, font-weight medium (500), line-height 20px
  - Description: 14px, font-weight regular (400), line-height 20px
  - Required asterisk: 14px, destructive/danger color
  - Bottom padding: 10px (--spacing-lg)
  - Icon gap from label: 8px

- **MD (Medium)**:
  - Label: 16px, font-weight medium (500), line-height 24px
  - Description: 14px, font-weight regular (400), line-height 20px
  - Required asterisk: 14px, destructive/danger color
  - Bottom padding: 12px (--spacing-xl)
  - Icon gap from label: 8px

**Colors**:

- Label text: `text-base-primary` (#11181C) -> maps to `text-text-primary`
- Required asterisk: `text-danger` (#E54D2E) -> maps to `text-destructive`
- Description text: `text-base-secondary` (#697177) -> maps to `text-text-secondary`
- Icon color: Secondary/muted (#889096)

**Icon**:

- Size: 16x16px
- Icon: Question circle (help icon)
- Used for tooltips/additional information

**Spacing**:

- Gap between label and icon: 8px (gap-2)
- Gap between label and required asterisk: 2px (gap-0.5)
- Description padding top: 4px (pt-1)

## Storybook Stories

**Required**: Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/input-label.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic InputLabel with default props (MD size, with required indicator)
2. **Sizes Story**: Visual comparison of SM and MD sizes
3. **Required Story**: Label with and without required indicator
4. **WithIcon Story**: Label with help icon displayed
5. **WithDescription Story**: Label with description text
6. **FullFeatures Story**: Label with all features enabled (required, icon, description)
7. **AllCombinations Story**: Grid showing all possible combinations
8. **FormIntegration Story**: Real-world example showing InputLabel with input elements
9. **Accessibility Story**: Demonstrating proper htmlFor/id association

**Story Requirements**:

- Use `satisfies Meta<typeof InputLabel>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: "centered"` for focused component display
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

**Example Structure**:

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Question } from "@phosphor-icons/react";
import { InputLabel } from "@/ui/inputs";

const meta = {
  title: "Inputs/InputLabel",
  component: InputLabel,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
      description: "Size variant of the label",
    },
    label: {
      control: "text",
      description: "The label text content",
    },
    required: {
      control: "boolean",
      description: "Shows required indicator (asterisk)",
    },
    showIcon: {
      control: "boolean",
      description: "Shows help icon",
    },
    helpIconAriaLabel: {
      control: "text",
      description: "Custom aria-label for the help icon (default: 'Help for {label}')",
    },
    description: {
      control: "text",
      description: "Optional description text below label",
    },
    htmlFor: {
      control: "text",
      description: "ID of the associated input element",
    },
  },
} satisfies Meta<typeof InputLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Email address",
    required: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <InputLabel size="sm" label="Small Label" required />
      <InputLabel size="md" label="Medium Label" required />
    </div>
  ),
};
```

**Why Storybook Stories are Critical**:

- **Visual Documentation**: Stories serve as living documentation showing how components work
- **Design Review**: Enables designers to review component implementations visually
- **Development Testing**: Developers can test components in isolation during development
- **Quality Assurance**: QA can verify all component states and variants visually
- **Regression Prevention**: Visual changes are immediately visible when components are modified
- **Component Discovery**: Helps developers find and understand available components

## Implementation Plan

### Phase 1: Foundation

1. Create the `inputs` category directory structure
2. Research Phosphor Icons for an appropriate help/question circle icon
3. Set up the component file with CVA variants

### Phase 2: Core Implementation

1. Implement InputLabel component with:
   - Size variants (sm, md)
   - Required indicator (asterisk)
   - Help icon support
   - Description text support
   - Proper label semantics (renders as `<label>`)
   - htmlFor prop for accessibility

2. Component should compose:
   - TextSm/TextMd for label text based on size
   - TextSm for description text
   - Icon component with Question icon for help

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

1. Create `src/ui/inputs/index.ts` barrel file
2. Update `src/ui/index.ts` to export the inputs category

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/inputs/input-label.stories.tsx`
- All variant stories to be created:
  - Default, Sizes, Required, WithIcon, WithDescription, FullFeatures, AllCombinations
- Interactive controls for: size, label, required, showIcon, description, htmlFor
- Real-world usage examples: Form field labeling, required vs optional fields
- Accessibility demonstrations with proper label-input association

## Step by Step Tasks

### 1. Create inputs directory structure

- Create `src/ui/inputs/` directory
- Create `src/ui/inputs/index.ts` barrel file

### 2. Implement InputLabel component

- Create `src/ui/inputs/input-label.tsx`
- Define CVA variants for size (sm, md)
- Implement props interface:
  - `size: 'sm' | 'md'` (default: 'md')
  - `label: string` (required)
  - `required?: boolean` (default: false)
  - `showIcon?: boolean` (default: false)
  - `helpIconAriaLabel?: string` - For screen reader accessibility (default: "Help for {label}")
  - `description?: string`
  - `htmlFor?: string`
  - `className?: string`
- Compose TextSm/TextMd based on size
- Add required asterisk with destructive color
- Add Icon component with Question icon
- Add description with TextSm and muted color
- Generate description ID for aria-describedby pattern (`${htmlFor}-description`)
- **Ref Forwarding (REQUIRED)**:
  - Use `forwardRef<HTMLLabelElement, InputLabelProps>` pattern
  - Forward ref to the root `<label>` element
  - Set `displayName = 'InputLabel'` for debugging
- **React Import Convention (REQUIRED)**:
  - Use direct imports: `import { forwardRef } from 'react'`
  - Do NOT use namespace imports: `import * as React from 'react'`
- **Component Rendering Constraint**:
  - Must always render as `<label>` element (no polymorphic rendering)
  - No `asChild` prop - labels have fixed semantics

### 3. Create unit tests

- Create `src/ui/inputs/__tests__/input-label.test.tsx`
- Test default rendering
- Test size variants (sm, md)
- Test required indicator display
- Test icon display
- Test description display
- Test htmlFor attribute
- Test className merging
- Test ref forwarding
- Test accessibility (label role)

### 4. Create Storybook stories (REQUIRED & NON-NEGOTIABLE)

- Create `src/stories/inputs/` directory
- Create `src/stories/inputs/input-label.stories.tsx`
- Implement all required stories:
  - Default: Basic usage
  - Sizes: SM vs MD comparison
  - Required: With/without required indicator
  - WithIcon: Help icon display
  - WithDescription: Description text
  - FullFeatures: All features enabled
  - AllCombinations: Visual grid of all combinations
  - FormIntegration: Real-world form example
  - Accessibility: htmlFor demonstration
- Configure comprehensive argTypes
- Add autodocs tags

### 5. Update barrel exports

- Export from `src/ui/inputs/index.ts`
- Update `src/ui/index.ts` to include inputs category

### 6. Run validation commands

Execute all validation commands to ensure zero regressions.

## Testing Strategy

### Unit Tests

1. **Rendering tests**:
   - Renders with default props
   - Renders as label element
   - Renders label text correctly

2. **Size variant tests**:
   - SM size applies correct typography (text-sm, leading-5)
   - MD size applies correct typography (text-base, leading-6)
   - Default size is MD

3. **Required indicator tests**:
   - Shows asterisk when required=true
   - Hides asterisk when required=false (default)
   - Asterisk has destructive color class

4. **Icon tests**:
   - Shows icon when showIcon=true
   - Hides icon when showIcon=false (default)
   - Icon has correct size and muted color
   - Icon has appropriate aria-label when helpIconAriaLabel is provided
   - Icon uses default aria-label ("Help for {label}") when helpIconAriaLabel is not provided

5. **Description tests**:
   - Shows description when provided
   - Hides description container when not provided
   - Description has muted color
   - Description has correct ID for aria-describedby pattern (`${htmlFor}-description`)

6. **Accessibility tests**:
   - htmlFor prop is passed to label element
   - Can associate with input by id

7. **Composition tests**:
   - className is merged correctly
   - ref is forwarded correctly

### Edge Cases

- Empty label string (should still render container)
- Very long label text (should wrap appropriately)
- Very long description text (should wrap appropriately)
- All props enabled simultaneously
- No optional props provided
- Custom className overrides

## Acceptance Criteria

### Functional Requirements

- Component implemented in `src/ui/inputs/` with proper TypeScript types
- All component variants work correctly (sm, md sizes)
- Required indicator displays red asterisk when `required=true`
- Help icon displays when `showIcon=true`
- Description displays below label when provided
- Component renders as semantic `<label>` element
- htmlFor prop properly associates label with input
- Component composes TextSm/TextMd and Icon from existing atoms

### Testing Requirements

- Comprehensive unit tests with >90% coverage
- All edge cases tested
- All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- Storybook stories file created: `src/stories/inputs/input-label.stories.tsx`
- Meta configuration with comprehensive argTypes
- Default story implemented
- ALL size stories implemented (sm, md)
- Required indicator stories implemented
- Icon display stories implemented
- Description stories implemented
- Real-world examples (minimum 2-3 practical usage scenarios)
- Comparison story showing all variants together
- Interactive controls configured for all props
- Storybook builds successfully: `npm run build-storybook`
- All stories render correctly in Storybook UI

### Integration Requirements

- Exported through category barrel (`src/ui/inputs/index.ts`)
- Exported through root barrel (`src/ui/index.ts`)
- Component can be imported via `import { InputLabel } from '@/ui'`

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

3. **Run component tests**: `npm test -- input-label`
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

### Design Token Mapping

The Figma design uses Glow UI tokens that map to Sazonia tokens:

- `--context/text/base/primary/text-base-primary` -> `text-text-primary`
- `--context/text/danger/text-danger` -> `text-destructive`
- `--context/text/base/secondary/text-base-secondary` -> `text-text-secondary`
- `--spacing-lg` (10px) -> Tailwind `pb-2.5`
- `--spacing-xl` (12px) -> Tailwind `pb-3`

### Tailwind Spacing Reference

Exact Tailwind spacing values for this component:

- `pb-2.5` = 0.625rem = 10px (SM size bottom padding)
- `pb-3` = 0.75rem = 12px (MD size bottom padding)
- `gap-2` = 0.5rem = 8px (gap between label and icon)
- `gap-0.5` = 0.125rem = 2px (gap between label and required asterisk)
- `pt-1` = 0.25rem = 4px (description padding top)

### Phosphor Icon Selection

Use `Question` or `QuestionMark` icon from `@phosphor-icons/react` for the help icon. The design shows a question mark in a circle - `Question` with weight="regular" should match.

### Future Considerations

- This component establishes the `inputs` category which will contain:
  - Input (text input)
  - Textarea
  - Select
  - Checkbox
  - Radio
  - Switch
- Consider creating an InputWrapper component that combines InputLabel with error messages and helper text
- Tooltip functionality for the icon can be added later using a Tooltip component

### Accessibility Notes

- Always use `htmlFor` to associate label with input
- The `<label>` element is clickable and focuses the associated input
- Required indicator is visual - also use `aria-required="true"` on the input
- Help icon should have tooltip with additional information (future enhancement)

### Accessibility: Consuming Component Guidance

The InputLabel component provides visual and semantic accessibility features, but consuming components must also implement proper ARIA attributes:

**Required Fields:**

```tsx
// InputLabel provides visual indicator (red asterisk)
<InputLabel label="Email" required={true} htmlFor="email" />
// Consuming component must add aria-required
<input id="email" aria-required="true" />
```

**Description Association:**

```tsx
// InputLabel generates description ID automatically
<InputLabel
  label="Password"
  htmlFor="password"
  description="Must be at least 8 characters"
/>
// Consuming component should use aria-describedby
<input id="password" aria-describedby="password-description" />
```

**Help Icon:**

```tsx
// Use helpIconAriaLabel for custom screen reader text
<InputLabel
  label="Phone"
  showIcon={true}
  helpIconAriaLabel="Phone number format help"
  htmlFor="phone"
/>
// Default aria-label is "Help for {label}" if not provided
```

**Complete Accessible Form Field:**

```tsx
<InputLabel
  label="Email"
  required={true}
  showIcon={true}
  helpIconAriaLabel="Email format requirements"
  description="We'll never share your email"
  htmlFor="email"
/>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-description"
/>
```
