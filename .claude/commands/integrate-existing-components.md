# Components Integration Planning

Create a new plan in ai/plans/components/\*.md to integrate existing UI components into a specific feature using the exact specified markdown `Plan Format`. Follow the `Instructions` to create the plan use the `Relevant Files` to focus on the right files.

## Instructions

### ⚠️ CRITICAL RULES - READ FIRST ⚠️

1. **NO COMPONENT CREATION**: DO NOT create, design, or implement ANY new UI components. This command is ONLY for integrating existing components.
2. **FEATURE SCOPE ONLY**: Work EXCLUSIVELY on the specific feature mentioned in the `Integration Request`. DO NOT modify other features or create new ones.
3. **USE EXISTING COMPONENTS ONLY**: All components MUST come from `src/ui/` - Use named exports: `import { Component } from '@/ui'`

### Planning Guidelines

- IMPORTANT: You're writing a plan to INTEGRATE existing UI components into a specific feature based on the `Integration Request`.
- IMPORTANT: The `Integration Request` describes which existing components should be integrated into which feature files, but remember we're NOT implementing the integration, we're creating the plan that will be used to implement the integration based on the `Plan Format` below.
- Create the plan in the `ai/plans/components/<feature-name>-integration.md` file. Name it appropriately based on the feature.
- Use the `Plan Format` below to create the plan.
- Research the codebase to understand:
  - Existing UI components available in `src/ui/` (ONLY use these - DO NOT create new ones)
  - The specific feature files mentioned in the request that need to be updated (ONLY modify these files)
  - Current implementation patterns in the feature
  - Existing patterns, architecture, and conventions
- IMPORTANT: Replace every <placeholder> in the `Plan Format` with the requested value. Add as much detail as needed to implement the integration successfully.
- Use your reasoning model: THINK HARD about which existing components to use, how to integrate them, and the migration strategy.
- Follow existing patterns and conventions in the codebase. Don't reinvent the wheel.
- Design for consistency and maintainability.
- Respect requested files in the `Relevant Files` section.
- Start your research by reading the `README.md` file.

## Relevant Files

Focus on the following files:

- `README.md` - Contains the project overview and instructions.
- `.claude/rules/component-patterns.md` - Component architecture patterns using Class Variance Authority (CVA), Radix UI wrappers, polymorphic components with Slot, semantic color system, and TypeScript patterns for building composable, type-safe UI components.
- `.claude/rules/styling-guidelines.md` - Tailwind CSS 4 setup and configuration, design token system with semantic colors (primary/secondary/neutral/destructive), typography system using Rubik font, spacing/responsive design patterns, and custom utilities.
- `.claude/rules/testing-patterns.md` - Testing patterns with Vitest 3.x and React Testing Library 16.x, including unit testing utilities, hook testing with renderHook, component testing strategies, mocking patterns for Next.js/Clerk/Axios, and accessibility testing.
- `.claude/rules/typescript-conventions.md` - TypeScript strict mode configuration, type checking with `npm run type-check`, import conventions with path aliases, component props typing patterns (ComponentPropsWithoutRef, CVA VariantProps), function typing with explicit returns, Zod schema validation patterns, utility types, type guards, discriminated unions, and best practices for type-safe React development.
- `.claude/rules/accessibility-patterns.md` - WCAG AA compliance guidelines, ARIA attributes (roles, labels, descriptions, states), keyboard navigation and focus management, screen reader support with semantic HTML and live regions, color contrast requirements (4.5:1 for text, 3:1 for UI), color-blind considerations, automated testing with axe-core, manual testing checklists, and accessible component patterns for modals, forms, and navigation.
- `.claude/rules/project-structure.md` - Feature-based architecture within Next.js 15 App Router, directory organization patterns (routes/, components/, services/, queries/, hooks/), shared vs feature-specific code organization, naming conventions for files and directories, import path guidelines using @/ alias, service/hook/query file patterns, configuration file organization, centralized API integration with Axios, provider patterns, and utility organization in lib/ directory.
- `src/**` - Contains the codebase.

Ignore all other files in the codebase.

## Plan Format

````md
# Components Integration: <feature name> - <brief component list>

## Feature Context

<describe the feature that will receive the component integration and why this integration is needed>

## Existing Components to Integrate

⚠️ CRITICAL: ALL components listed here MUST already exist in src/ui/. DO NOT create new components.

<list each EXISTING UI component that will be integrated, where it's located, and why it's being used>

1. **<Component Name>** (src/ui/<category>/<component>): <why this component is being integrated>
2. **<Component Name>** (src/ui/<category>/<component>): <why this component is being integrated>
   ...

## User Story

As a <type of user>
I want to <action/goal>
So that <benefit/value>

## Problem Statement

<clearly define the specific problem that this integration addresses - typically inconsistent styling, raw HTML usage, or missing design system patterns>

## Solution Statement

<describe the proposed integration approach - replacing raw HTML/inline styles with existing UI components from the design system>

## Relevant Files

### Existing UI Components

<list the existing UI component files that will be used>

- **src/ui/<category>/<component>.tsx** - <description of what this component provides>
- ...

**Import pattern:**

```typescript
// All UI components use named exports from @/ui
import { Heading1, BodyMedium, Button, Dialog } from '@/ui';

// Or import from specific category
import { Heading1, BodyMedium } from '@/ui/typography';
import { Button } from '@/ui/buttons';
```
````

### Feature Files to Update

⚠️ CRITICAL: ONLY modify the specific feature files mentioned in the Integration Request. DO NOT create new features or modify other features.

<list ONLY the feature files mentioned in the request that need to be updated to use the existing components>

- **src/features/<feature>/<file>.tsx** - <what needs to be updated in this file>
- ...

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
- Interaction patterns and states (default, hover, focus, active, disabled, loading) if clickable
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

## Component Integration Details

<For each existing component being integrated, create a section describing how it will be used:>

### <Component Name>

**Purpose**: <what this existing component provides>

**Current Usage in Feature**: <describe what raw HTML/inline styles are currently being used that this component will replace>

**Props to Use**:
<list which props from the existing component will be used in the integration>

**Replacement Strategy**:
<describe the step-by-step approach to replace current implementation with this component>

**Integration Points**:
<describe which feature files will import and use this component>

## Implementation Plan

### Phase 1: Preparation

⚠️ SCOPE REMINDER: Work ONLY on the specific feature mentioned in the Integration Request.

<describe the preparation work needed before integrating components - identifying all instances of raw HTML/inline styles that need to be replaced IN THE SPECIFIED FEATURE ONLY, understanding component APIs of EXISTING components from src/ui/>

### Phase 2: Component Integration

⚠️ NO NEW COMPONENTS: Use ONLY existing components from src/ui/. DO NOT create any new components.

<describe the main integration work - replacing raw HTML/inline styles with existing UI components in each feature file OF THE SPECIFIED FEATURE ONLY, maintaining visual consistency>

### Phase 3: Validation

<describe how to validate the integration - visual regression testing, ensuring no breaking changes, verifying responsive behavior>

## Step by Step Tasks

IMPORTANT: Execute every step in order, top to bottom.

<list step by step tasks as h3 headers plus bullet points. use as many h3 headers as needed to integrate all components into the feature. Order matters:

⚠️ CRITICAL REMINDERS:

- ONLY work on the specific feature mentioned in the Integration Request
- ONLY use existing components from src/ui/ - DO NOT create new components
- DO NOT modify other features or create new features

1. Start with identifying existing components to use (ONLY from src/ui/ - these MUST already exist)
2. Update imports in the SPECIFIC feature files mentioned in the request
3. Replace raw HTML/inline styles with component usage IN THE SPECIFIED FEATURE ONLY
4. Verify visual consistency (manual inspection or visual comparison)
5. Update existing feature tests ONLY if they broke due to DOM/class changes (DO NOT create new component tests)
   Your last step should be running the `Validation Commands` to validate the integration works correctly with zero regressions.>

## Testing Strategy

### Existing Feature Tests

<IF the feature already has tests, describe which tests need to be updated due to component integration (e.g., CSS class selectors that changed, DOM structure changes). If the feature has no tests, state: "No existing tests to update.">

### Validation Approach

<describe how to validate that the integration works correctly - running existing test suite, visual inspection, responsive testing. DO NOT create new component tests since the UI components already have their own tests.>

## Acceptance Criteria

<list specific, measurable criteria that must be met for the integration to be considered complete:

- All raw HTML/inline styles replaced with existing UI components
- No visual regressions (appearance matches original)
- All existing tests still passing (no broken tests)
- Type checking passes
- Linting passes
- Production build successful
- Consistent usage of design system components throughout the feature>

## Validation Commands

Execute every command to validate the integration works correctly with zero regressions.

<list commands you'll use to validate with 100% confidence the integration is implemented correctly with zero regressions. Focus on:

- Running the full test suite to ensure no existing tests broke
- Type checking to ensure imports and props are correct
- Linting to ensure code quality
- Building to ensure no runtime errors
  DO NOT include commands to test individual components (they already have their own tests).>

Example commands:

- `npm run test:run` - Run all existing tests to validate no regressions
- `npm run type-check` - Ensure TypeScript types are correct
- `npm run lint` - Ensure code quality standards
- `npm run build` - Ensure production bundle is successful

## Notes

<optionally list any additional notes, migration considerations, or context that are relevant to the integration that will be helpful to the developer>

```

## Integration Request

$ARGUMENTS

## Report

- Summarize the work you've just done in a concise bullet point list.
- Include a path to the plan you created in the `ai/plans/components/<feature-name>-integration.md` file.
```
