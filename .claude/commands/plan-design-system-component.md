# Feature ui Planning

Create a new plan in ai/plans/\*.md to implement the `Ui` using the exact specified markdown `Plan Format`. Follow the `Instructions` to create the plan use the `Relevant Files` to focus on the right files.

## Instructions

- ⚠️ **CRITICAL**: This command is ONLY for creating the plan to build a UI component in `src/ui/<category>/`. DO NOT implement the component in any other part of the application (pages, features, etc.). The component belongs ONLY in the `src/ui/` design system.
- ⚠️ **CRITICAL**: You are NOT implementing the component. You are ONLY creating a plan document in `ai/plans/ui/*.md` that describes HOW to build the component.
- ⚠️ **CRITICAL**: The plan should focus EXCLUSIVELY on creating the component in `src/ui/<category>/` with its tests. DO NOT include integration steps with pages, features, or other parts of the application.
- ⚠️ **CRITICAL**: Every UI component plan MUST include comprehensive Storybook stories. Stories are NOT optional - they are a required part of the component deliverable for visual documentation and testing.
- ⚠️ **ATOMIC DESIGN**: Follow Atomic Design principles. Identify if the component is an **atom**, **molecule**, **organism**, **template**, or **page**. Components MUST compose from existing lower-level components:
  - **Molecules** must use existing **atoms** (e.g., buttons use typography)
  - **Organisms** must use existing **molecules** and **atoms**
  - **Templates** must use existing **organisms**, **molecules**, and **atoms**
  - Research existing components in `src/ui/` before planning to identify reusable atoms and molecules
- IMPORTANT: All new UI components should be created in `src/ui/<category>/` as part of the design system with barrel exports for named imports.
- Create the plan in the `ai/plans/ui/*.md` file. Name it appropriately based on the `Ui`.
- Use the `Plan Format` below to create the plan.
- Research the codebase to understand existing patterns, architecture, and conventions before planning the feature.
- IMPORTANT: Replace every <placeholder> in the `Plan Format` with the requested value. Add as much detail as needed to implement the feature successfully.
- Use your reasoning model: THINK HARD about the feature requirements, design, and implementation approach.
- Follow existing patterns and conventions in the codebase. Don't reinvent the wheel.
- Design for extensibility and maintainability.
- If you need a new library, use `npm install` and be sure to report it in the `Notes` section of the `Plan Format`.
- Respect requested files in the `Relevant Files` section.
- Start your research by reading the `README.md` file.

## Relevant Files

Focus on the following files:

- `README.md` - Contains the project overview and instructions.
- `.claude/rules/code-quality.md` - ESLint and Prettier configuration with import sorting rules, code complexity limits (max-depth, max-params), TypeScript rules, React hooks rules, and file naming conventions (kebab-case).
- `.claude/rules/component-patterns.md` - Component architecture patterns using Class Variance Authority (CVA), Radix UI wrappers, polymorphic components with Slot, semantic color system, and TypeScript patterns for building composable, type-safe UI components.
- `.claude/rules/styling-guidelines.md` - Tailwind CSS 4 setup and configuration, design token system with semantic colors (primary/secondary/neutral/destructive), typography system using Inter font, spacing/responsive design patterns, and custom utilities.
- `.claude/rules/testing-patterns.md` - Testing patterns with Vitest 3.x and React Testing Library 16.x, including unit testing utilities, hook testing with renderHook, component testing strategies, mocking patterns for Next.js/Clerk/Axios, and accessibility testing.
- `src/ui/**` - Existing UI components to reference for patterns and composition.
- `src/stories/**/*.stories.tsx` - Existing Storybook stories to reference for story patterns and structure.
- `src/**` - Contains the codebase.

Ignore all other files in the codebase.

## Plan Format

````md
# Ui: <component name>

## Component Description

<describe the component in detail, including its purpose and value to users>

## User Story

As a <type of user>
I want to <action/goal>
So that <benefit/value>

## Problem Statement

<clearly define the specific problem or opportunity this component addresses>

## Solution Statement

<describe the proposed solution approach and how it solves the problem>

## Atomic Design Classification

**Component Type**: <Specify: Atom | Molecule | Organism | Template | Page>

**Reasoning**: <Explain why this component belongs to this atomic level>

**Composition Requirements**:

<Identify which existing components from lower levels this component should use. List specific components with their import paths.>

- **Required Atoms**: <List atoms needed, e.g., "Typography from @/ui/typography">
- **Required Molecules**: <If organism or higher, list molecules needed>
- **Required Organisms**: <If template or higher, list organisms needed>

<If this is a base atom with no dependencies, state:>

- **Status**: ✅ Base atom - no composition dependencies

## Component Location

<Determine where the new component should be created and which category it belongs to:>

**Location**: `src/ui/<category>/<component-name>.tsx`

**Category**: <Specify the category: typography, buttons, forms, dialogs, layouts, indicators, etc.>

**Reasoning**: <Explain why this category is appropriate for this component and how it fits into the design system.>

**Export Pattern**:

```typescript
// 1. Create component: src/ui/<category>/<component>.tsx
export { Component, componentVariants };
export type { ComponentProps };

// 2. Update category barrel: src/ui/<category>/index.ts
export * from './<component>';

// 3. Update root barrel (if new category): src/ui/index.ts
export * from './<category>';

// 4. Import usage (recommended):
import { Component } from '@/ui';

// 5. Import usage (alternative):
import { Component } from '@/ui/<category>';
```
````

## Relevant Files

Use these files to implement the feature:

<find and list the files that are relevant to the feature describe why they are relevant in bullet points. Include existing Storybook stories as references for story patterns. If there are new files that need to be created to implement the feature, list them in an h3 'New Files' section.>

### Existing Files to Reference

- **Existing UI components in `src/ui/`** - For component patterns and composition
  - Study similar components to understand CVA patterns, prop structures, and TypeScript types
  - Identify lower-level components to compose from (atoms, molecules)

- **Existing Storybook stories in `src/stories/`** (CRITICAL REFERENCE)
  - Review stories from similar components for structure and patterns
  - Study argTypes configuration examples
  - Understand story organization (Default, Variants, States, Examples)
  - Reference real-world example patterns

- **Related test files in `src/ui/**/**tests**/`\*\* - For testing patterns
  - Review comprehensive test coverage examples
  - Understand edge case testing approaches

### New Files (ALL are REQUIRED)

<list all new files that need to be created, including:>

1. **Component token file**: `src/styles/tokens/components/<component>.css` (REQUIRED)
2. **Component file**: `src/ui/<category>/<component>.tsx` (REQUIRED)
3. **Test file**: `src/ui/<category>/__tests__/<component>.test.tsx` (REQUIRED)
4. **Story file**: `src/stories/<category>/<component>.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
5. **Category barrel** (if new category): `src/ui/<category>/index.ts`

⚠️ All four core files (tokens, component, tests, stories) are mandatory deliverables.

## Style & Design Requirements

### Responsive Design

Determine which device breakpoints require specific styling:

- **Desktop (lg: 1024px+)**: <Required? Yes/No - Describe desktop-specific styles if needed>
- **Tablet (md: 768px - 1023px)**: <Required? Yes/No - Describe tablet-specific styles if needed>
- **Mobile (< 768px)**: <Required? Yes/No - Describe mobile-specific styles if needed>

### Design Assets

<IMPORTANT: If design assets (Figma, mockups, or screenshots) were NOT provided, explicitly state:>

**Status**: ⚠️ No design assets provided

**Required Information**:

- Figma link or screenshots needed for accurate implementation
- Specific style requirements (colors, spacing, typography, layout)
- Interaction patterns and states (default, hover, focus, active, disabled, loading) if clickeable
- Responsive behavior for each breakpoint

**Action Required**: Request design assets from the user before proceeding with implementation. Ask specific questions about:

- Layout preferences for each device size
- Component variants and states
- Brand colors and typography to use
- Spacing and sizing requirements

<If design assets WERE provided, document them:>

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: <link>
- Screenshots: <list>
- Design specifications: <details>

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

<Create comprehensive Storybook stories that demonstrate all component variants, states, and use cases:>

**Story File**: `src/stories/<category>/<component-name>.stories.tsx`

**Required Stories**:

1. **Default Story**: Basic component usage with default props
2. **Variant Stories**: One story per variant (if component has variants)
3. **State Stories**: Interactive states (hover, focus, active, disabled, loading, error, etc.)
4. **Size Stories**: Different sizes if applicable (sm, md, lg, etc.)
5. **Real-world Examples**: 2-3 practical usage examples showing the component in realistic scenarios
6. **Comparison Stories**: Visual comparison of all options (e.g., "All Variants" grid showing every combination)

**Story Requirements**:

- Use `satisfies Meta<typeof Component>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set appropriate `parameters.layout` (centered, padded, fullscreen)
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

**Example Structure**:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { Component } from "@/ui/<category>/<component>";

const meta = {
  title: "<Category>/<Component>",
  component: Component,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description: "Visual style variant",
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Default" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Component variant="primary">Primary</Component>
      <Component variant="secondary">Secondary</Component>
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

⚠️ **A component without Storybook stories is considered incomplete and will not be accepted.**

## Implementation Plan

### Phase 1: Foundation & Token Architecture

<describe the foundational work needed before implementing the main component>

**Token Creation (REQUIRED):**

1. Create component token file: `src/styles/tokens/components/<component>.css`
2. Define all themeable properties as CSS custom properties:
   - Background colors and hover states
   - Text colors for different states
   - Border colors and radius
   - Spacing (padding, gap, margins)
   - Shadows and effects
   - Size variants (height, width)
3. Reference semantic tokens (Layer 2) NOT core tokens (Layer 1)
4. Add import to `src/styles/index.css` in the Component Tokens section

**Token Naming Convention:** `--{component}-{property}[-{variant}][-{state}]`

**Example token file structure:**

```css
/* src/styles/tokens/components/<component>.css */
:root {
  /* Layout tokens */
  --<component>-border-radius: var(--radius-md);
  --<component>-padding: var(--spacing-4);
  --<component>-gap: var(--spacing-2);

  /* Primary variant */
  --<component>-primary-bg: var(--brand-fill);
  --<component>-primary-bg-hover: var(--brand-fill-hover);
  --<component>-primary-text: var(--text-overlay-white);

  /* Secondary variant */
  --<component>-secondary-bg: var(--secondary-fill);
  --<component>-secondary-bg-hover: var(--secondary-fill-hover);
  --<component>-secondary-text: var(--text-primary);
}
```

### Phase 2: Core Implementation

<describe the main implementation work for the component, ensuring CVA variants use component tokens>

**Token Usage in CVA (REQUIRED):**

- Use `bg-[var(--component-token)]` syntax for all themeable properties
- Regular Tailwind classes for non-themeable properties (layout, transitions)
- See `.claude/rules/styling-guidelines.md` for token architecture details

### Phase 3: Design System Integration & Documentation

**Export Configuration:**
<describe how the component will be exported through barrel files and made available in the design system>

**Storybook Documentation (REQUIRED):**
<describe the Storybook stories that will be created, including:>

- Story file location: `src/stories/<category>/<component>.stories.tsx`
- All variant stories to be created
- Interactive controls and argTypes configuration
- Real-world usage examples to demonstrate
- Responsive behavior demonstrations (if applicable)

**Important**: DO NOT describe integration with pages, features, or other parts of the application - ONLY focus on proper exports from src/ui and Storybook documentation.

## Step by Step Tasks

⚠️ **CRITICAL**: Execute every step in order, top to bottom. ALL sections are REQUIRED.

<list step by step tasks as h3 headers plus bullet points. use as many h3 headers as needed to implement the component. Order matters, start with the foundational shared changes required then move on to the specific implementation. Include creating tests AND Storybook stories throughout the implementation process. Your last step should be running the `Validation Commands` to validate the component works correctly with zero regressions.>

**Required Task Sections** (ALL are mandatory):

1. **Foundation/Setup tasks** - Research and planning
2. **Token creation** (REQUIRED & NON-NEGOTIABLE)
   - Create `src/styles/tokens/components/<component>.css`
   - Define tokens for all themeable properties (colors, spacing, radius, shadows)
   - Reference semantic tokens (Layer 2), NOT core tokens (Layer 1)
   - Add import to `src/styles/index.css`
3. **Component implementation** - Core component development using component tokens
4. **Unit tests creation** - Comprehensive test coverage (>90%)
5. **Storybook stories creation** (REQUIRED & NON-NEGOTIABLE)
   - Create `src/stories/<category>/<component>.stories.tsx`
   - Configure comprehensive argTypes for all props
   - Implement stories for ALL variants and states
   - Create real-world usage examples (minimum 2-3)
   - Add interactive controls for all configurable props
   - Document responsive behavior (if applicable)
6. **Barrel exports and integration** - Export configuration
7. **Validation commands execution** - Run ALL validation commands

## Testing Strategy

### Unit Tests

<describe unit tests needed for the component>

### Edge Cases

<list edge cases that need to be tested>

## Acceptance Criteria

<list specific, measurable criteria that must be met for the component to be considered complete>

**Required Criteria for ALL Components**:

### Token Architecture Requirements (NON-NEGOTIABLE)

- ✅ **Component token file created: `src/styles/tokens/components/<component>.css`**
- ✅ **Token file imported in `src/styles/index.css`**
- ✅ **All themeable properties defined as tokens** (colors, spacing, radius, shadows)
- ✅ **Tokens reference semantic layer (Layer 2)**, NOT core layer (Layer 1)
- ✅ **Token naming follows convention:** `--{component}-{property}[-{variant}][-{state}]`
- ✅ **CVA uses component tokens** via `bg-[var(--component-token)]` syntax
- ✅ **No hardcoded color/spacing values** in component file

### Functional Requirements

- ✅ Component implemented in `src/ui/<category>/` with proper TypeScript types
- ✅ All component variants work correctly
- ✅ Component forwards refs correctly (if applicable)
- ✅ Component supports polymorphic rendering with asChild (if applicable)
- ✅ Component follows design system patterns (CVA, polymorphic components, component tokens)

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/<category>/<component>.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **ALL variant stories implemented (one per variant)**
- ✅ **ALL state stories implemented (hover, focus, disabled, loading, etc.)**
- ✅ **Real-world examples (minimum 2-3 practical usage scenarios)**
- ✅ **Comparison story showing all variants together**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/<category>/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { Component } from '@/ui'`

### Code Quality

- ✅ Zero TypeScript errors: `npm run type-check`
- ✅ Zero ESLint warnings: `npm run lint`
- ✅ Build succeeds: `npm run build`

## Validation Commands

⚠️ **CRITICAL**: Execute EVERY command below. All must pass with zero errors.

<list commands you'll use to validate with 100% confidence the component is implemented correctly with zero regressions. every command must execute without errors so be specific about what you want to run to validate the component works as expected. Include commands to test the component.>

**Required Validation Commands for ALL Components** (execute in order):

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- <component-name>` or `npm test -- <category>`
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

<optionally list any additional notes, future considerations, or context that are relevant to the component that will be helpful to the developer>

```

## Component

$ARGUMENTS

## Report

After creating the plan, provide a summary that includes:

- Confirmation that the plan includes ALL required sections (especially Storybook stories)
- Path to the plan file created in `ai/plans/ui/*.md`
- List of key deliverables:
  - Component file location
  - Test file location
  - **Storybook stories file location** (REQUIRED)
  - Barrel export updates needed
- Reminder that Storybook stories are NON-NEGOTIABLE and must be implemented
- Summary of validation commands that will be run

Example:
```

✅ Plan created: ai/plans/ui/component-name.md

Key deliverables:

- Component: src/ui/<category>/<component>.tsx
- Tests: src/ui/<category>/**tests**/<component>.test.tsx
- **Storybook Stories: src/stories/<category>/<component>.stories.tsx** (REQUIRED)
- Exports: src/ui/<category>/index.ts

⚠️ Storybook stories are mandatory and must include:

- Default, variant, and state stories
- Real-world usage examples
- Interactive controls

All validation commands must pass including `npm run build-storybook`.

```

## Architectural Review

⚠️ **CRITICAL**: After creating the plan, you MUST invoke the `ui-ux-architecture` agent to review the plan for architectural compliance.

**Instructions:**
1. Use the Task tool with `subagent_type='ui-ux-architecture'`
2. Provide the agent with the path to the created plan file
3. Ask the agent to review the plan and evaluate:
   - Atomic design classification correctness
   - Component composition strategy
   - Architectural alignment with project patterns
   - Design system integration approach
   - Any potential architectural issues or improvements

4. The agent will create an evaluation file in `ai/agents/evaluations/{component-name}-plan-{YYYY-MM-DD}.md`

**Example Task Invocation:**
```

Please review the UI component plan I just created at ai/plans/ui/component-name.md and evaluate it for architectural compliance. Create an evaluation documenting your findings in ai/agents/evaluations/.

```

This architectural review ensures the plan follows best practices BEFORE implementation begins, preventing costly refactoring later.
```
