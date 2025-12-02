# Ui: SearchInput

## Component Description

SearchInput is a standalone search field component designed for search functionality across the application. It provides a styled text input optimized for search scenarios with a search icon prefix, optional clear button, and support for dropdown suggestions. Unlike the general-purpose TextInput, SearchInput is specifically designed for search contexts with built-in search icon, clearable value, and two style variants (default with rounded corners and circled/pill-shaped).

The component integrates with the existing design system and follows the patterns established by TextInput while providing search-specific features.

## User Story

As a user
I want to use a search input field to find content quickly
So that I can efficiently locate specific items, filter data, or navigate to search results

## Problem Statement

The application needs a dedicated search input component that provides a consistent search experience across different contexts. While TextInput can be used with a search icon add-on, a dedicated SearchInput component offers:

1. **Built-in search icon** - No need to manually add the icon for every search usage
2. **Clear button** - One-click clearing of search value when typing
3. **Style variants** - Default (rounded corners) and Circled (pill-shaped) styles per design system
4. **Search semantics** - Proper `type="search"` and `role="searchbox"` for accessibility
5. **Optional dropdown integration** - Can show search suggestions/results in a dropdown

## Solution Statement

Create a SearchInput molecule component that:

1. Extends the visual patterns of TextInput while adding search-specific features
2. Supports three sizes (sm, md, lg) matching the design system scale
3. Provides two style variants: `default` (rounded-sm corners) and `circled` (pill-shaped/rounded-full)
4. Includes built-in search icon (MagnifyingGlass from Phosphor)
5. Shows a clear button (X icon) when there is input value
6. Supports controlled and uncontrolled modes
7. Handles all interactive states: empty, hovered, focused, typing, filled, disabled

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: SearchInput is a molecule because it combines multiple atoms (Icon, Typography/text styling) into a single reusable component with specific behavior. It's more than a simple styled element but not complex enough to be an organism.

**Composition Requirements**:

- **Required Atoms**:
  - `Icon` from `@/ui/icons` - For search icon (MagnifyingGlass) and clear icon (X)
- **Required Molecules**: None (this is a standalone molecule)
- **Required Organisms**: None

## Component Location

**Location**: `src/ui/inputs/search-input.tsx`

**Category**: `inputs` - The component is a form input element specifically designed for search functionality, fitting naturally alongside TextInput, NumberInput, and other input components.

**Reasoning**: The inputs category houses all form input components. SearchInput is a specialized text input for search scenarios, making it a logical fit in this category.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/inputs/search-input.tsx
export { SearchInput, searchInputVariants, searchInputWrapperVariants };
export type { SearchInputProps };

// 2. Update category barrel: src/ui/inputs/index.ts
export * from './search-input';

// 3. Import usage (recommended):
import { SearchInput } from '@/ui';

// 4. Import usage (alternative):
import { SearchInput } from '@/ui/inputs';
```

## Relevant Files

Use these files to implement the feature:

### Existing Files to Reference

- **`src/ui/inputs/text-input.tsx`** - Primary reference for CVA patterns, wrapper variants, input variants, size props, and overall component structure. SearchInput will follow similar patterns.

- **`src/ui/inputs/input-dropmenu-search.tsx`** - Reference for search-specific input patterns including the search icon integration and typography per size.

- **`src/ui/icons/icon.tsx`** - Icon component for rendering MagnifyingGlass and X icons with proper sizing and colors.

- **`src/stories/inputs/text-input.stories.tsx`** - Reference for story structure, argTypes configuration, and story organization patterns.

- **`src/ui/inputs/__tests__/text-input.test.tsx`** - Reference for testing patterns including ref forwarding, state testing, and accessibility testing.

- **`src/lib/utils.ts`** - The `cn()` utility for class merging.

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/inputs/search-input.tsx` (REQUIRED)
2. **Test file**: `src/ui/inputs/__tests__/search-input.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/inputs/search-input.stories.tsx` (REQUIRED & NON-NEGOTIABLE)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Yes - Component works at all sizes, no specific desktop adjustments needed
- **Tablet (md: 768px - 1023px)**: Yes - Same as desktop
- **Mobile (< 768px)**: Yes - Component is fully responsive, width is determined by parent container

### Design Assets

**Status**: ✅ Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=2264-159014&m=dev
- Screenshot: Reviewed Figma design showing all states and sizes

**Design Specifications from Figma**:

#### Sizes

| Size | Height | Padding                 | Gap  | Font Size | Line Height | Icon Size |
| ---- | ------ | ----------------------- | ---- | --------- | ----------- | --------- |
| SM   | 32px   | py-2 px-4 (8px/16px)    | 12px | 14px      | 20px        | 16px      |
| MD   | 40px   | py-2.5 px-4 (10px/16px) | 12px | 14px      | 20px        | 16px      |
| LG   | 48px   | py-3 px-4 (12px/16px)   | 12px | 16px      | 24px        | 16px      |

#### Style Variants

| Style   | Border Radius            |
| ------- | ------------------------ |
| Default | rounded-sm (6px)         |
| Circled | rounded-full (99px/pill) |

#### States

1. **Empty**: Border `border-base-primary` (#D7DBDF), placeholder text `text-base-tertiary` (#889096)
2. **Hovered**: Border darkens slightly (hover state)
3. **Focused - Open**: Border `primary` color, ring effect, cursor in input
4. **Typing - Open**: Border `primary`, user text visible, clear button appears
5. **Filled**: User text displayed, clear button visible (X icon)
6. **Disabled**: Background `bg-surface-base-primary`, text and icons muted, cursor not-allowed

#### Colors

- Background: `bg-background` (#FFFFFF)
- Border default: `border-border` (#D7DBDF)
- Border focus: `border-primary`
- Text primary: `text-text-primary`
- Text placeholder: `text-text-tertiary` (#889096)
- Icon color: `text-text-secondary` (muted) for search icon
- Clear button: `text-text-tertiary`, hover: `text-text-primary`

## Storybook Stories

**Required**: ✅ Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/inputs/search-input.stories.tsx`

**Required Stories**:

1. **Default**: Basic SearchInput with LG size and default style
2. **Sizes**: Comparison of SM, MD, LG sizes
3. **StyleVariants**: Default vs Circled style comparison
4. **AllStates**: Empty, Hovered, Focused, Typing, Filled, Disabled states
5. **WithClearButton**: Demonstrates clear functionality (controlled input)
6. **WithDropmenuIntegration**: Shows SearchInput triggering a dropdown
7. **AllCombinations**: Grid showing all size/style/state combinations
8. **ControlledVsUncontrolled**: Demonstrates both input patterns
9. **RealWorldSearchBar**: Practical navbar search bar example
10. **RealWorldFilterSearch**: Table filter search example

**Story Requirements**:

- Use `satisfies Meta<typeof SearchInput>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: "centered"` for most stories
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

## Implementation Plan

### Phase 1: Foundation

1. **Create the component file** with proper TypeScript types and exports
2. **Define CVA variants** for wrapper (size, style, error) and input (size)
3. **Set up the component structure** with forwardRef for ref forwarding

### Phase 2: Core Implementation

1. **Implement wrapper variants** with:
   - Size variants: sm, md, lg (padding, gap, height)
   - Style variants: default (rounded-sm), circled (rounded-full)
   - State styling: focus-within, disabled, hover

2. **Implement input variants** with:
   - Size variants for typography (text-sm for sm/md, text-base for lg)
   - Proper line heights per size

3. **Implement search icon** using Icon component with MagnifyingGlass

4. **Implement clear button**:
   - Only visible when input has value
   - X icon button
   - Hover state styling
   - onClick clears input value
   - Accessible button with aria-label

5. **Handle controlled/uncontrolled modes**:
   - Support both value/onChange (controlled) and defaultValue (uncontrolled)
   - Internal state tracking for clear button visibility in uncontrolled mode

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

- Export component, variants, and types from `search-input.tsx`
- Add export to `src/ui/inputs/index.ts` barrel file
- Verify export through `src/ui/index.ts` root barrel

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/inputs/search-input.stories.tsx`
- All variant stories: Default, Circled, SM, MD, LG
- State stories: Empty, Hover, Focus, Typing, Filled, Disabled
- Interactive controls: size, styleVariant, placeholder, disabled, onClear
- Real-world examples: Navbar search, Table filter, Command palette trigger

## Step by Step Tasks

### Step 1: Create SearchInput Component Foundation

- Create `src/ui/inputs/search-input.tsx`
- Define TypeScript interfaces: `SearchInputProps`
- Define CVA variants for wrapper and input
- Set up forwardRef structure
- Import dependencies: `cn`, `cva`, `Icon`, Phosphor icons

### Step 2: Implement Wrapper Variants

- Create `searchInputWrapperVariants` with CVA
- Add size variants: sm (py-2 px-4 gap-3), md (py-2.5 px-4 gap-3), lg (py-3 px-4 gap-3)
- Add style variants: default (rounded-sm), circled (rounded-full)
- Add state classes: border, focus-within, hover, disabled

### Step 3: Implement Input Variants

- Create `searchInputVariants` with CVA
- Add size variants for typography
- Style: transparent background, no border, proper placeholder color

### Step 4: Implement Core Component Logic

- Render wrapper div with variants
- Add search icon (MagnifyingGlass) with proper size and color
- Add input element with proper attributes (type="search", role="searchbox")
- Handle value/onChange for controlled mode
- Track internal value for uncontrolled clear button

### Step 5: Implement Clear Button

- Create ClearButton with X icon
- Only show when input has value (controlled or uncontrolled)
- Handle onClick to clear value
- Add proper hover states
- Add aria-label for accessibility

### Step 6: Create Unit Tests

- Create `src/ui/inputs/__tests__/search-input.test.tsx`
- Test rendering with default props
- Test all size variants
- Test both style variants
- Test disabled state
- Test controlled input mode
- Test uncontrolled input mode
- Test clear button visibility
- Test clear button onClick behavior
- Test ref forwarding
- Test keyboard navigation
- Test accessibility attributes

### Step 7: Create Storybook Stories

- Create `src/stories/inputs/search-input.stories.tsx`
- Add meta configuration with argTypes
- Implement Default story
- Implement Sizes story (SM, MD, LG comparison)
- Implement StyleVariants story (Default vs Circled)
- Implement AllStates story (all interactive states)
- Implement WithClearButton story (controlled)
- Implement AllCombinations story (grid view)
- Implement ControlledVsUncontrolled story
- Implement RealWorldSearchBar example
- Implement RealWorldFilterSearch example

### Step 8: Update Barrel Exports

- Add export to `src/ui/inputs/index.ts`
- Verify import works from `@/ui` and `@/ui/inputs`

### Step 9: Run Validation Commands

- Run `npm run type-check` - verify zero TypeScript errors
- Run `npm run lint` - verify zero ESLint warnings
- Run `npm test -- search-input` - verify all tests pass
- Run `npm run test:run` - verify no regressions
- Run `npm run build` - verify build succeeds
- Run `npm run build-storybook` - verify Storybook builds

## Testing Strategy

### Unit Tests

1. **Rendering Tests**
   - Renders with default props
   - Renders with each size variant (sm, md, lg)
   - Renders with each style variant (default, circled)
   - Renders search icon
   - Renders placeholder text

2. **State Tests**
   - Disabled state disables input
   - Focus state applies correct styling
   - Clear button appears when input has value
   - Clear button hidden when input empty

3. **Interaction Tests**
   - onChange fires when typing
   - onClear callback fires when clear button clicked
   - Clear button resets input value
   - Enter key behavior (if applicable)

4. **Ref Tests**
   - Ref is forwarded to input element
   - Can programmatically focus via ref

5. **Accessibility Tests**
   - Has type="search" attribute
   - Has role="searchbox" attribute
   - Clear button has aria-label
   - Supports aria-label on input
   - Supports aria-describedby

### Edge Cases

- Empty string vs undefined value
- Very long placeholder text
- Very long input value (overflow handling)
- Rapid clear button clicks
- Focus management after clearing
- Controlled mode with external value updates

## Acceptance Criteria

### Functional Requirements

- ✅ Component implemented in `src/ui/inputs/search-input.tsx` with proper TypeScript types
- ✅ Three size variants work correctly: sm (32px), md (40px), lg (48px)
- ✅ Two style variants work correctly: default (rounded-sm), circled (rounded-full)
- ✅ Search icon (MagnifyingGlass) renders on the left
- ✅ Clear button (X) appears when input has value
- ✅ Clear button clears input and calls onClear callback
- ✅ Component forwards refs correctly to input element
- ✅ Controlled mode works with value/onChange
- ✅ Uncontrolled mode works with defaultValue
- ✅ Disabled state styling and functionality correct
- ✅ Focus state styling with border and ring
- ✅ Hover state styling on wrapper

### Testing Requirements

- ✅ Comprehensive unit tests with >90% coverage
- ✅ All edge cases tested
- ✅ All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- ✅ **Storybook stories file created: `src/stories/inputs/search-input.stories.tsx`**
- ✅ **Meta configuration with comprehensive argTypes**
- ✅ **Default story implemented**
- ✅ **ALL size stories implemented (SM, MD, LG)**
- ✅ **ALL style stories implemented (Default, Circled)**
- ✅ **ALL state stories implemented (empty, hover, focus, typing, filled, disabled)**
- ✅ **Real-world examples (minimum 2-3 practical usage scenarios)**
- ✅ **Comparison story showing all variants together**
- ✅ **Interactive controls configured for all props**
- ✅ **Storybook builds successfully: `npm run build-storybook`**
- ✅ **All stories render correctly in Storybook UI**

### Integration Requirements

- ✅ Exported through category barrel (`src/ui/inputs/index.ts`)
- ✅ Exported through root barrel (`src/ui/index.ts`)
- ✅ Component can be imported via `import { SearchInput } from '@/ui'`

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

3. **Run component tests**: `npm test -- search-input`
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

1. **Relationship to TextInput**: SearchInput is a specialized variant of text input, but implemented as a separate component rather than extending TextInput. This keeps the API cleaner and avoids complexity in TextInput.

2. **Clear Button Behavior**: The clear button should:
   - Only appear when there's a value (not on focus alone)
   - Clear the input AND call the optional `onClear` callback
   - Not submit any forms
   - Keep focus on the input after clearing

3. **Dropdown Integration**: While the Figma shows search inputs with dropdowns, the SearchInput component itself doesn't include dropdown logic. The dropdown would be implemented separately and composed with SearchInput, similar to how InputDropmenu works with InputDropmenuSearch.

4. **Icon Sizing**: Per Figma, all sizes use 16px icons (Icon size="sm"). This maintains visual consistency across sizes.

### Future Considerations

1. **SearchInputField**: Similar to TextInputField, consider creating a SearchInputField wrapper that includes label, hint, and error message composition.

2. **Keyboard Shortcuts**: Consider adding support for common search shortcuts (Escape to clear, etc.)

3. **Loading State**: May want to add a loading indicator for async search operations.

4. **Voice Search**: Future enhancement could include voice input button for accessibility.
