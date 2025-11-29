# UI Component Implementation Planning from Design

Create a new plan in ai/plans/ui/component/\*.md to implement a feature based on design assets (images, mockups, etc.) using the exact specified markdown `Plan Format`. Follow the `Instructions` to create the plan and use the `Relevant Files` to focus on the right files.

## Instructions

- ⚠️ **CRITICAL**: This command analyzes design assets (desktop/mobile images) and creates an implementation plan that PRIMARILY uses existing components from `src/ui/`.
- ⚠️ **CRITICAL**: You are NOT implementing the feature. You are ONLY creating a plan document in `ai/plans/ui-component/*.md` that describes HOW to build the feature.
- ⚠️ **CRITICAL**: DO NOT create new UI components unless absolutely necessary. First, attempt to use existing components from `src/ui/` and only propose new components if no suitable alternatives exist.
- ⚠️ **IMPORTANT**: Design assets (images, Figma links, or mockups) are REQUIRED for this command. If no design assets are provided, request them from the user before proceeding.
- ⚠️ **IMPORTANT**: Follow the existing structure pattern from `features/sales` as a reference for folder organization, routing, and component structure.
- Create the plan in the `ai/plans/ui-component/*.md` file. Name it appropriately based on the feature.
- Use the `Plan Format` below to create the plan.
- Research the codebase to understand existing UI components, patterns, architecture, and conventions before planning.
- IMPORTANT: Replace every <placeholder> in the `Plan Format` with the requested value. Add as much detail as needed to implement the feature successfully.
- Use your reasoning model: THINK HARD about component mapping, reusability, and implementation approach.
- Follow existing patterns and conventions in the codebase. Don't reinvent the wheel.
- Design for extensibility and maintainability.
- If you need a new library, use `npm install` and be sure to report it in the `Notes` section of the `Plan Format`.
- Respect requested files in the `Relevant Files` section.
- Start your research by reading the `README.md` file.

## Relevant Files

Focus on the following files:

- `README.md` - Contains the project overview and instructions.
- `.claude/rules/**` - Contains project conventions and patterns for API design, component architecture, routing, styling, authentication, TypeScript usage, and overall project structure.
- `src/ui/**` - **CRITICAL**: Existing UI components library. Research thoroughly to identify reusable components.
- `src/features/sales/**` - Reference structure for feature organization (pages, components, types).
- `src/app/profile/(routes)/sales/**` - Reference structure for routing and page organization.
- `src/**` - Contains the codebase.

Ignore all other files in the codebase.

## Plan Format

````md
# Feature: <feature name>

## Feature Description

<describe the feature in detail, including its purpose and value to users>

## User Story

As a <type of user>
I want to <action/goal>
So that <benefit/value>

## Problem Statement

<clearly define the specific problem or opportunity this feature addresses>

## Solution Statement

<describe the proposed solution approach and how it solves the problem>

## Design Assets Analysis

⚠️ **REQUIRED**: Design assets must be provided for this command to proceed.

**Status**: <✅ Design assets provided | ⚠️ No design assets provided>

**Provided Assets**:

- Desktop design: <image path or Figma link>
- Mobile design: <image path or Figma link>
- Tablet design (optional): <image path or Figma link>
- Additional specifications: <any other design documents>

### Design Breakdown

<Analyze the provided design assets and break down into visual components. For each screen/view:>

**Desktop View Analysis:**
<Describe the layout, components, and interactions visible in the desktop design>

**Mobile View Analysis:**
<Describe the layout, components, and interactions visible in the mobile design>

**Tablet View Analysis (if applicable):**
<Describe the layout, components, and interactions visible in the tablet design>

## Component Mapping Strategy

⚠️ **CRITICAL**: This section maps design elements to existing UI components. ALWAYS prioritize using existing components over creating new ones.

### Existing Components to Use

<For each visual element in the design, map it to existing components from `src/ui/`. Be specific about which components to use and how.>

Example format:

- **Header section**:
  - Use `Heading1` from `@/ui/typography` for title
  - Use `BodyMedium` from `@/ui/typography` for description
  - Use `HStack` from `@/ui/layouts` for horizontal layout

- **Action buttons**:
  - Use `Button` variant="primary" from `@/ui/buttons` for CTA
  - Use `ButtonLink` from `@/ui/buttons` for navigation links

- **Cards/Lists**:
  - Use `ProductCard` from `@/ui/cards` for product displays
  - Use `DataTable` from `@/ui/table` for tabular data
  - Use `SimpleGrid` from `@/ui/layouts` for grid layouts

- **Form elements**:
  - Use `Input` from `@/ui/form` for text inputs
  - Use `Checkbox` from `@/ui/form` for checkboxes
  - Use `Radio` from `@/ui/form` for radio buttons

- **Layout components**:
  - **Page container**: ALWAYS use `ContentWrapper` from `@/ui/layouts` (NOT "Container" - it doesn't exist)
    - Use `maxWidth` prop for content width constraints (sm, md, lg, xl, 2xl, full)
    - Use `paddingX/paddingY` props for responsive padding: `{ base: "lg", lg: "4xl" }`
    - Use `fullWidth` prop for edge-to-edge layouts
    - Use `header/footer` props for structured sections
  - **Vertical stacking**: Use `VStack` from `@/ui/layouts` with `gap` prop
  - **Horizontal layouts**: Use `HStack` from `@/ui/layouts` with `gap` and `align` props
  - **Responsive grids**: Use `SimpleGrid` from `@/ui/layouts` with responsive `columns` prop

  **CRITICAL:** Never create custom "Container" components or use raw divs with "container" classes. Always use `ContentWrapper` for page-level containers.

### Missing Components Analysis

<Identify any design elements that CANNOT be implemented with existing UI components>

**Components that need to be created:**
<List components that don't exist in `src/ui/` and MUST be created>

1. **ComponentName**: <Why it's needed, what it does>
   - **Reason**: <Explain why no existing component can be used>
   - **Location**: `src/ui/<category>/<component-name>.tsx`
   - **Alternative options**: <If there are ways to compose existing components instead, list them here>

**Components that could be adapted:**
<List components that exist but might need variants or modifications>

1. **ExistingComponent**: <What adaptations are needed>
   - **Current location**: `src/ui/<category>/<component>.tsx`
   - **Proposed changes**: <Describe variant additions or prop extensions>
   - **Alternative approach**: <If you can work around it without changes, explain how>

### Component Composition Strategy

<Describe how existing components will be composed together to build the feature>

Example:

```tsx
// Feature page structure using existing components
<ContentWrapper>
  <VStack gap="lg">
    <HStack justify="between">
      <Heading1>Page Title</Heading1>
      <Button variant="primary">Action</Button>
    </HStack>
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }}>
      {items.map((item) => (
        <ProductCard key={item.id} {...item} />
      ))}
    </SimpleGrid>
  </VStack>
</ContentWrapper>
```
````

## Feature Structure (Following Sales Pattern)

<Define the folder structure following the `features/sales` pattern>

### Routing Structure (App Directory)

**Base route**: `src/app/profile/(routes)/<feature-name>/`

**Pages to create**:

- `src/app/profile/(routes)/<feature-name>/page.tsx` - Main feature page
- `src/app/profile/(routes)/<feature-name>/<sub-route>/page.tsx` - Sub-pages if needed
- `src/app/profile/(routes)/<feature-name>/loading.tsx` - Loading state (optional)

**Pattern reference**: Follow the same structure as `src/app/profile/(routes)/sales/`

### Feature Directory Structure

**Base path**: `src/features/<feature-name>/`

**Files to create**:

```
src/features/<feature-name>/
├── <feature-name>-page.tsx              # Main page component
├── <sub-feature>/                       # Sub-feature folders (if needed)
│   ├── <sub-feature>-page.tsx
│   └── components/
│       └── <sub-feature>-*.tsx
└── components/                          # Feature-specific components
    ├── <component>.tsx
    ├── types.ts
    └── __tests__/
        └── <component>.test.tsx
```

**Pattern reference**: Follow the same structure as `src/features/sales/`

### Navigation Integration

<Describe how the feature integrates with existing navigation>

- Menu items to add
- Breadcrumb configuration
- Link destinations
- Active state handling

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

**UI Components** (to use in implementation):
<List specific components from `src/ui/` that will be used, with their import paths>

**Sales Feature Reference** (for structure patterns):

- `src/features/sales/sales-page.tsx` - Page component pattern
- `src/features/sales/components/` - Feature components organization
- `src/app/profile/(routes)/sales/page.tsx` - Route integration pattern

**Project Patterns**:

- `.claude/rules/component-patterns.md` - Component architecture and composition
- `.claude/rules/routing-and-paths.md` - Routing conventions
- `.claude/rules/styling-guidelines.md` - Styling patterns with Tailwind CSS
- `.claude/rules/project-structure.md` - Overall project organization

### New Files

<List all new files that need to be created for this feature>

**App Routes** (following Next.js App Router):

- `src/app/profile/(routes)/<feature>/page.tsx`
- `src/app/profile/(routes)/<feature>/<sub-route>/page.tsx` (if needed)

**Feature Components**:

- `src/features/<feature>/<feature>-page.tsx`
- `src/features/<feature>/components/<component>.tsx`
- `src/features/<feature>/components/types.ts`
- `src/features/<feature>/components/__tests__/<component>.test.tsx`

**New UI Components** (ONLY if absolutely necessary):

- `src/ui/<category>/<new-component>.tsx` (if no existing alternative)
- `src/ui/<category>/__tests__/<new-component>.test.tsx`
- `src/stories/<category>/<new-component>.stories.tsx`

## Style & Design Requirements

### Responsive Design

Determine which device breakpoints require specific styling based on the design assets:

- **Desktop (lg: 1024px+)**: <Required? Yes/No - Describe desktop-specific styles from design>
- **Tablet (md: 768px - 1023px)**: <Required? Yes/No - Describe tablet-specific styles from design>
- **Mobile (< 768px)**: <Required? Yes/No - Describe mobile-specific styles from design>

### Design System Alignment

<Ensure the design aligns with existing design tokens and patterns>

**Colors**: <List semantic color tokens to use: primary, secondary, neutral, destructive, etc.>
**Typography**: <List typography components from `@/ui/typography` to use>
**Spacing**: <Define spacing patterns using Tailwind tokens: xs, sm, md, lg, xl>
**Layouts**: <Define layout patterns using components from `@/ui/layouts`>

### Design Specifications

**Status**: ✅ Design assets provided

**Assets**:

- Desktop design: <path or link>
- Mobile design: <path or link>
- Design specifications: <details about spacing, colors, typography, interactions>

## Implementation Plan

### Phase 1: Foundation & Component Analysis

<Describe the research and analysis work needed>

1. **Analyze existing UI components** in `src/ui/` to identify reusable components
2. **Review design assets** to break down visual elements
3. **Map design to components** from the component library
4. **Identify gaps** where new components are truly necessary
5. **Review sales feature structure** as a reference pattern

### Phase 2: Core Implementation

<Describe the main implementation work>

1. **Set up routing structure** following sales pattern
2. **Create feature pages** using existing UI components
3. **Build feature-specific components** (only those unique to this feature)
4. **Implement responsive layouts** using layout components from `@/ui/layouts`
5. **Add navigation integration** to connect feature to app

### Phase 3: Integration & Polish

<Describe integration and refinement>

1. **Connect to existing navigation**
2. **Add loading and error states**
3. **Implement accessibility features**
4. **Test responsive behavior** across breakpoints
5. **Verify component composition** works correctly

## Step by Step Tasks

⚠️ **CRITICAL**: Execute every step in order, top to bottom.

### Research & Analysis

- Read `README.md` to understand project setup
- Research all components in `src/ui/` by category:
  - Typography components in `src/ui/typography/`
  - Button components in `src/ui/buttons/`
  - Form components in `src/ui/form/`
  - Layout components in `src/ui/layouts/`
  - Card components in `src/ui/cards/`
  - Table components in `src/ui/table/`
  - Other categories as relevant
- Review design assets (desktop/mobile images)
- Map each design element to existing UI components
- Document components that are missing or need creation
- Review `src/features/sales/` structure as reference
- Review `src/app/profile/(routes)/sales/` routing pattern

### Create Feature Structure

- Create feature folder: `src/features/<feature-name>/`
- Create app route folder: `src/app/profile/(routes)/<feature-name>/`
- Set up initial folder structure following sales pattern
- Create types file if needed: `src/features/<feature-name>/components/types.ts`

### Implement Pages (Using Existing Components)

- Create main page component: `src/features/<feature-name>/<feature-name>-page.tsx`
  - Import and compose UI components from `@/ui`
  - Use layout components for structure
  - Use typography components for text
  - Use button/form components as needed
- Create app route: `src/app/profile/(routes)/<feature-name>/page.tsx`
  - Import and render feature page component
- Implement responsive behavior using existing layout components
- Add loading state if needed

### Build Feature-Specific Components

<Only create components that are truly specific to this feature and can't be handled by existing UI components>

- Create feature component: `src/features/<feature-name>/components/<component>.tsx`
- Compose using existing UI components from `@/ui`
- Add component tests: `src/features/<feature-name>/components/__tests__/<component>.test.tsx`

### Create New UI Components (ONLY IF NECESSARY)

<Only execute if truly new UI components are needed that can't be composed from existing ones>

- Create UI component: `src/ui/<category>/<component>.tsx`
- Create tests: `src/ui/<category>/__tests__/<component>.test.tsx`
- Create Storybook stories: `src/stories/<category>/<component>.stories.tsx`
- Update barrel exports: `src/ui/<category>/index.ts`
- Update root barrel: `src/ui/index.ts` (if new category)

### Navigation Integration

- Add navigation menu items if needed
- Configure routing and links
- Test navigation flow

### Testing & Validation

- Run all validation commands (see `Validation Commands` section)
- Test responsive behavior on all breakpoints
- Verify component composition works correctly
- Ensure zero regressions

## Testing Strategy

### Unit Tests

<Describe unit tests needed for feature-specific components>

- Test feature page component renders correctly
- Test feature-specific components behavior
- Test props and variants
- Test edge cases

### Integration Tests

<Describe integration tests for the feature>

- Test navigation to feature pages
- Test data flow through components
- Test responsive behavior
- Test user interactions

### Visual Testing

- Verify design matches provided assets (desktop/mobile)
- Test all breakpoints
- Verify component composition looks correct
- Check accessibility compliance

### Edge Cases

<List edge cases that need to be tested>

- Empty states
- Loading states
- Error states
- Long content
- Missing data
- Various screen sizes

## Acceptance Criteria

<List specific, measurable criteria that must be met for the feature to be considered complete>

### Functional Requirements

- ✅ Feature pages created following sales structure pattern
- ✅ Routing configured in app directory
- ✅ All design elements implemented using appropriate components
- ✅ Responsive design working on desktop, tablet, and mobile
- ✅ Navigation integrated correctly

### Component Usage Requirements

- ✅ Maximum reuse of existing UI components from `src/ui/`
- ✅ New UI components created ONLY when no alternative exists
- ✅ All component composition follows design system patterns
- ✅ Proper imports from `@/ui` using barrel exports

### Design Fidelity

- ✅ Desktop design matches provided assets
- ✅ Mobile design matches provided assets
- ✅ Tablet design implemented (if provided)
- ✅ Design system tokens used correctly (colors, typography, spacing)
- ✅ Responsive breakpoints work as designed

### Code Quality

- ✅ Zero TypeScript errors: `npm run type-check`
- ✅ Zero ESLint warnings: `npm run lint`
- ✅ Build succeeds: `npm run build`
- ✅ All tests pass: `npm run test:run`

### Testing Requirements

- ✅ Feature-specific components have tests with >80% coverage
- ✅ All edge cases tested
- ✅ Accessibility tested
- ✅ Responsive behavior verified

## Validation Commands

⚠️ **CRITICAL**: Execute EVERY command below. All must pass with zero errors.

**Required Validation Commands** (execute in order):

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across all components

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run feature tests**: `npm test -- <feature-name>`
   - Expected: All feature tests pass
   - Validates: Feature functionality works correctly

4. **Run full test suite**: `npm run test:run`
   - Expected: All tests pass with zero regressions
   - Validates: No breaking changes to existing code

5. **Build verification**: `npm run build`
   - Expected: Build completes successfully
   - Validates: Production bundle compatibility

6. **Visual verification** (manual):
   - Expected: Design matches provided assets on all breakpoints
   - Validates: Design fidelity and responsive behavior

**All commands MUST pass before the feature is considered complete.**

## Notes

<List any additional notes, decisions, or context>

**Component Reuse Decisions**:
<Document which existing components were used and why>

**New Components Justification**:
<If new UI components were created, explain why existing components couldn't be used>

**Design Deviations**:
<Document any deviations from the provided design and the reasons>

**Future Considerations**:
<List potential improvements or extensions for the future>

**Dependencies**:
<List any new libraries or dependencies added>

```

## Design Assets

$ARGUMENTS

## Report

After creating the plan, provide a summary that includes:

- Confirmation that design assets were analyzed
- Path to the plan file created in `ai/plans/ui-component/*.md`
- List of existing UI components that will be used
- List of new components that need to be created (if any)
- Alternatives suggested for missing components
- Summary of the feature structure (routes and components)
- Reminder about following the sales pattern for structure

Example:
```

✅ Plan created: ai/plans/ui-component/<feature-name>.md

Design Analysis:

- Desktop design analyzed: <path>
- Mobile design analyzed: <path>

Existing UI Components to Use:

- Heading1, Heading2, BodyMedium from @/ui/typography
- Button, ButtonLink from @/ui/buttons
- ContentWrapper, VStack, HStack from @/ui/layouts
- ProductCard from @/ui/cards
- DataTable from @/ui/table

New Components Needed:

- <ComponentName> in src/ui/<category>/ (no existing alternative)
- OR: No new UI components needed - all can be composed from existing

Feature Structure:

- Route: src/app/profile/(routes)/<feature>/page.tsx
- Page: src/features/<feature>/<feature>-page.tsx
- Components: src/features/<feature>/components/

Pattern: Following src/features/sales/ structure

All validation commands must pass.

```

```
