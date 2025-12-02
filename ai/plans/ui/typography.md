# Ui: Typography

## Component Description

The Typography system provides a comprehensive, type-safe set of **individual components** for rendering text throughout the Sazonia application. Each typography style has its own dedicated component:

**Plain Text Components**: `TextXs`, `TextSm`, `TextMd` - For body text with weight variants
**Lead Text Components**: `LeadTextXs`, `LeadTextSm`, `LeadTextMd` - For emphasized paragraph text
**Heading Components**: `H1`, `H2`, `H3`, `H4`, `H5`, `H6`, `Subtitle` - Semantic headings with bold weight
**Display Components**: `DisplayXxl`, `DisplayXl`, `DisplayLg`, `DisplayMd`, `DisplaySm`, `DisplayXs` - Hero/marketing text

Each component supports weight variants (where applicable), color variants, polymorphic `as` prop, and `asChild` pattern for composition.

## User Story

As a **developer building UI features**
I want to **use dedicated typography components with clear, semantic names**
So that **code is self-documenting, import statements indicate intent, and the application maintains visual consistency**

## Problem Statement

Currently, Sazonia lacks a centralized typography system. Developers must manually apply Tailwind classes for font sizes, weights, line heights, and colors, leading to:

- Inconsistent text styling across the application
- No enforcement of proper heading hierarchy for accessibility
- Repetitive code for common text patterns
- Difficulty maintaining design system consistency when styles change
- No type-safe API for typography variants

## Solution Statement

Create a comprehensive Typography component system with **individual named components**:

1. Provides a dedicated component for each typography style from the Figma design system
2. Uses CVA (Class Variance Authority) for type-safe weight and color variants
3. Supports polymorphic rendering via `as` prop and `asChild` pattern for composition
4. Enforces semantic HTML elements by default while allowing overrides
5. Integrates with the existing Tailwind CSS 4 design token system
6. Follows the Inter font family configuration (400, 500, 600, 700 weights)

## Atomic Design Classification

**Component Type**: Atom

**Reasoning**: Typography components are foundational primitive elements that cannot be broken down further. They serve as building blocks for all other components in the design system. Molecules like Buttons, Cards, and form fields will compose Typography atoms.

**Composition Requirements**:

- **Status**: Base atoms - no composition dependencies
- These are foundational atoms that other components will consume
- Uses only Tailwind CSS utility classes and design tokens

## Component Location

**Location**: `src/ui/typography/`

**Category**: `typography`

**Reasoning**: Typography is a core design system primitive that deserves its own category. Components will be imported and used throughout the application by all other components.

**Export Pattern**:

```typescript
// 1. Create components: src/ui/typography/
//    - text.tsx (TextXs, TextSm, TextMd)
//    - lead-text.tsx (LeadTextXs, LeadTextSm, LeadTextMd)
//    - headings.tsx (H1, H2, H3, H4, H5, H6, Subtitle)
//    - display.tsx (DisplayXxl, DisplayXl, DisplayLg, DisplayMd, DisplaySm, DisplayXs)

// 2. Create category barrel: src/ui/typography/index.ts
export * from './text';
export * from './lead-text';
export * from './headings';
export * from './display';

// 3. Update root barrel: src/ui/index.ts
export * from './typography';

// 4. Import usage (recommended):
import { H1, TextMd, LeadTextSm } from '@/ui';

// 5. Import usage (alternative):
import { H1, TextMd } from '@/ui/typography';
```

## Relevant Files

### Existing Files to Reference

- **`.claude/rules/styling-guidelines.md`** - Contains the complete typography system specifications:
  - Font: Inter (400, 500, 600, 700 weights)
  - Text scales: xs (12px), sm (14px), md/base (16px), lg (18px), xl (20px), 2xl (24px), 3xl (30px), 4xl (36px)
  - Line heights and font weights
  - Semantic color tokens for text (foreground, muted-foreground)

- **`src/components/Button/Button.tsx`** - Reference for basic component structure
- **`src/components/Button/Button.stories.tsx`** - Reference for Storybook story patterns
- **`src/app/globals.css`** - Current Tailwind CSS 4 configuration

### New Files (ALL are REQUIRED)

**Component Files:**

1. `src/ui/typography/text.tsx` - TextXs, TextSm, TextMd components
2. `src/ui/typography/lead-text.tsx` - LeadTextXs, LeadTextSm, LeadTextMd components
3. `src/ui/typography/headings.tsx` - H1, H2, H3, H4, H5, H6, Subtitle components
4. `src/ui/typography/display.tsx` - DisplayXxl through DisplayXs components

**Infrastructure Files:** 5. `src/ui/typography/index.ts` - Category barrel export 6. `src/ui/index.ts` - Root barrel export 7. `src/lib/utils.ts` - cn() utility function

**Test Files:** 8. `src/ui/typography/__tests__/text.test.tsx` 9. `src/ui/typography/__tests__/lead-text.test.tsx` 10. `src/ui/typography/__tests__/headings.test.tsx` 11. `src/ui/typography/__tests__/display.test.tsx`

**Storybook Files:** 12. `src/stories/typography/text.stories.tsx` 13. `src/stories/typography/lead-text.stories.tsx` 14. `src/stories/typography/headings.stories.tsx` 15. `src/stories/typography/display.stories.tsx`

## Style & Design Requirements

### Typography Scale (from Figma)

Based on the Figma design context, the typography system includes:

#### Plain Text (TextXs, TextSm, TextMd)

| Component | Size | Line Height | Weights Available               |
| --------- | ---- | ----------- | ------------------------------- |
| TextXs    | 12px | 18px        | regular, medium, semibold, bold |
| TextSm    | 14px | 20px        | regular, medium, semibold, bold |
| TextMd    | 16px | 24px        | regular, medium, semibold, bold |

#### Lead Text (LeadTextXs, LeadTextSm, LeadTextMd)

| Component  | Size | Line Height | Weights Available               |
| ---------- | ---- | ----------- | ------------------------------- |
| LeadTextXs | 18px | 26px        | regular, medium, semibold, bold |
| LeadTextSm | 20px | 28px        | regular, medium, semibold, bold |
| LeadTextMd | 24px | 32px        | regular, medium, semibold, bold |

#### Headings (H1-H6, Subtitle)

| Component | Size | Line Height | Weight                    | HTML Element |
| --------- | ---- | ----------- | ------------------------- | ------------ |
| H1        | 40px | 50px        | bold (700)                | h1           |
| H2        | 32px | 40px        | bold (700)                | h2           |
| H3        | 24px | 32px        | bold (700)                | h3           |
| H4        | 20px | 28px        | bold (700)                | h4           |
| H5        | 18px | 26px        | bold (700)                | h5           |
| H6        | 16px | 24px        | bold (700)                | h6           |
| Subtitle  | 14px | 20px        | semibold (600), uppercase | span         |

**Note:** Heading components do NOT support weight variants - they enforce bold weight for semantic consistency.

#### Display (DisplayXxl through DisplayXs)

| Component  | Size | Line Height | Weight        |
| ---------- | ---- | ----------- | ------------- |
| DisplayXxl | 80px | 100px       | regular (400) |
| DisplayXl  | 72px | 90px        | regular (400) |
| DisplayLg  | 64px | 80px        | regular (400) |
| DisplayMd  | 56px | 70px        | regular (400) |
| DisplaySm  | 48px | 60px        | regular (400) |
| DisplayXs  | 40px | 50px        | regular (400) |

### Font Family Configuration

**Font**: Inter (local variable font)
**Available Weights**: 100-900 (variable font supports all weights)
**Commonly Used Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Note**: Inter is already configured in `src/app/layout.tsx` as a local variable font:

```typescript
import localFont from 'next/font/local';

const inter = localFont({
  src: [
    {
      path: './fonts/InterVariable.woff2',
      style: 'normal',
    },
    {
      path: './fonts/InterVariable-Italic.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});
```

Font files are located in `src/app/fonts/`:

- `InterVariable.woff2` - Variable font (all weights)
- `InterVariable-Italic.woff2` - Variable font italic (all weights)

### Color Variants

All typography components support color variants:

- `default` - text-foreground (primary text color)
- `muted` - text-muted-foreground (secondary/subtle text)
- `primary` - text-primary (brand color)
- `secondary` - text-secondary
- `destructive` - text-destructive (error/danger)
- `success` - text-success
- `warning` - text-warning
- `info` - text-info

### Responsive Design

- **Desktop (lg: 1024px+)**: Yes - Full typography scale
- **Tablet (md: 768px - 1023px)**: Yes - Same scale, consumers apply responsive overrides
- **Mobile (< 768px)**: Yes - Same scale, consumers can apply responsive overrides via className

### Design Assets

**Status**: Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI (Typography styles node: 22264:15035)
- Typography variables node: 41903:77150
- Inter typeface info node: 2473:178094

## Pre-Implementation Requirements (BLOCKERS)

Before implementing the components, these critical infrastructure items MUST be completed:

### 1. Install Dependencies

```bash
npm install class-variance-authority @radix-ui/react-slot clsx tailwind-merge
```

### 2. Create cn() Utility Function

Create `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 3. Font Configuration (ALREADY DONE)

Inter font is already configured in `src/app/layout.tsx` as a local variable font with `--font-inter` CSS variable. No additional font configuration needed.

## Component API Specifications

### Shared Props (All Components)

```typescript
interface BaseTypographyProps {
  children: React.ReactNode;
  className?: string;
  color?:
    | 'default'
    | 'muted'
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'info';
  as?: React.ElementType;
  asChild?: boolean;
}
```

### Text Components (TextXs, TextSm, TextMd)

```typescript
interface TextProps extends BaseTypographyProps {
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

// Usage examples:
<TextXs>Extra small text</TextXs>
<TextSm weight="medium">Small medium text</TextSm>
<TextMd weight="bold" color="primary">Bold primary text</TextMd>
<TextMd as="span">Inline text</TextMd>
<TextMd asChild><Link href="/">Link styled as text</Link></TextMd>
```

### Lead Text Components (LeadTextXs, LeadTextSm, LeadTextMd)

```typescript
interface LeadTextProps extends BaseTypographyProps {
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

// Usage examples:
<LeadTextXs>Small lead text</LeadTextXs>
<LeadTextSm weight="medium">Medium lead text</LeadTextSm>
<LeadTextMd>Large lead text for emphasis</LeadTextMd>
```

### Heading Components (H1-H6, Subtitle)

```typescript
// Headings do NOT support weight variant - always bold
interface HeadingProps extends Omit<BaseTypographyProps, 'weight'> {}

// Subtitle has semibold weight, uppercase
interface SubtitleProps extends Omit<BaseTypographyProps, 'weight'> {}

// Usage examples:
<H1>Main Page Title</H1>
<H2>Section Title</H2>
<H3 color="muted">Subsection</H3>
<H1 as="h2">Styled as H1, semantic H2</H1>
<Subtitle>Section subtitle</Subtitle>
```

### Display Components (DisplayXxl through DisplayXs)

```typescript
// Display text - always regular weight for visual impact
interface DisplayProps extends Omit<BaseTypographyProps, 'weight'> {}

// Usage examples:
<DisplayXxl>Hero Title</DisplayXxl>
<DisplayLg>Marketing Headline</DisplayLg>
<DisplaySm color="primary">Call to Action</DisplaySm>
```

## Implementation Plan

### Phase 1: Infrastructure Setup

1. Install required dependencies
2. Create `src/lib/utils.ts` with `cn()` function
3. Verify Inter font configuration (already done)
4. Create directory structure:
   - `src/ui/`
   - `src/ui/typography/`
   - `src/ui/typography/__tests__/`
   - `src/stories/typography/`

### Phase 2: Core Component Implementation

#### Step 2.1: Text Components (`text.tsx`)

Create `TextXs`, `TextSm`, `TextMd` with shared CVA for weight and color:

```typescript
// src/ui/typography/text.tsx
import { forwardRef, type ElementType, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const textVariants = cva('font-sans', {
  variants: {
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      destructive: 'text-destructive',
      success: 'text-success',
      warning: 'text-warning',
      info: 'text-info',
    },
  },
  defaultVariants: {
    weight: 'regular',
    color: 'default',
  },
});

// TextXs: 12px/18px
export const TextXs = forwardRef<HTMLParagraphElement, TextXsProps>(
  ({ className, weight, color, as, asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'p';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-xs leading-[18px]',
          textVariants({ weight, color }),
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
TextXs.displayName = 'TextXs';

// Similar for TextSm (14px/20px) and TextMd (16px/24px)
```

#### Step 2.2: Lead Text Components (`lead-text.tsx`)

Create `LeadTextXs`, `LeadTextSm`, `LeadTextMd` following same pattern with larger sizes.

#### Step 2.3: Heading Components (`headings.tsx`)

Create `H1`-`H6` and `Subtitle` with enforced weights:

```typescript
// src/ui/typography/headings.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const headingColorVariants = cva('font-sans', {
  variants: {
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      // ... other colors
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

// H1: 40px/50px, bold
export const H1 = forwardRef<HTMLHeadingElement, H1Props>(
  ({ className, color, as, asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'h1';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-[40px] leading-[50px] font-bold',
          headingColorVariants({ color }),
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
H1.displayName = 'H1';

// Subtitle: 14px/20px, semibold, uppercase
export const Subtitle = forwardRef<HTMLSpanElement, SubtitleProps>(
  ({ className, color, as, asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'span';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-sm leading-5 font-semibold uppercase tracking-wide',
          headingColorVariants({ color }),
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Subtitle.displayName = 'Subtitle';
```

#### Step 2.4: Display Components (`display.tsx`)

Create `DisplayXxl` through `DisplayXs` with regular weight:

```typescript
// src/ui/typography/display.tsx
// DisplayXxl: 80px/100px, regular
export const DisplayXxl = forwardRef<HTMLSpanElement, DisplayProps>(
  ({ className, color, as, asChild, children, ...props }, ref) => {
    const Comp = asChild ? Slot : as || 'span';
    return (
      <Comp
        ref={ref}
        className={cn(
          'text-[80px] leading-[100px] font-normal',
          displayColorVariants({ color }),
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
DisplayXxl.displayName = 'DisplayXxl';

// Continue for DisplayXl, DisplayLg, DisplayMd, DisplaySm, DisplayXs
```

### Phase 3: Barrel Exports

#### `src/ui/typography/index.ts`

```typescript
export * from './text';
export * from './lead-text';
export * from './headings';
export * from './display';
```

#### `src/ui/index.ts`

```typescript
export * from './typography';
```

### Phase 4: Unit Tests

Create comprehensive tests for each component file:

- `src/ui/typography/__tests__/text.test.tsx`
- `src/ui/typography/__tests__/lead-text.test.tsx`
- `src/ui/typography/__tests__/headings.test.tsx`
- `src/ui/typography/__tests__/display.test.tsx`

### Phase 5: Storybook Stories

Create stories for each category:

- `src/stories/typography/text.stories.tsx`
- `src/stories/typography/lead-text.stories.tsx`
- `src/stories/typography/headings.stories.tsx`
- `src/stories/typography/display.stories.tsx`

## Step by Step Tasks

### Step 1: Pre-Implementation Setup

- [ ] Run `npm install class-variance-authority @radix-ui/react-slot clsx tailwind-merge`
- [ ] Create `src/lib/utils.ts` with cn() function
- [ ] Verify Inter font is configured in `src/app/layout.tsx` (already done)

### Step 2: Create Directory Structure

- [ ] Create `src/ui/` directory
- [ ] Create `src/ui/typography/` directory
- [ ] Create `src/ui/typography/__tests__/` directory
- [ ] Create `src/stories/typography/` directory

### Step 3: Implement Text Components

- [ ] Create `src/ui/typography/text.tsx` with TextXs, TextSm, TextMd
- [ ] Export all components and types
- [ ] Create `src/ui/typography/__tests__/text.test.tsx`
- [ ] Create `src/stories/typography/text.stories.tsx`

### Step 4: Implement Lead Text Components

- [ ] Create `src/ui/typography/lead-text.tsx` with LeadTextXs, LeadTextSm, LeadTextMd
- [ ] Export all components and types
- [ ] Create `src/ui/typography/__tests__/lead-text.test.tsx`
- [ ] Create `src/stories/typography/lead-text.stories.tsx`

### Step 5: Implement Heading Components

- [ ] Create `src/ui/typography/headings.tsx` with H1-H6, Subtitle
- [ ] Enforce bold weight for H1-H6, semibold for Subtitle
- [ ] Export all components and types
- [ ] Create `src/ui/typography/__tests__/headings.test.tsx`
- [ ] Create `src/stories/typography/headings.stories.tsx`

### Step 6: Implement Display Components

- [ ] Create `src/ui/typography/display.tsx` with DisplayXxl through DisplayXs
- [ ] Enforce regular weight for all display components
- [ ] Export all components and types
- [ ] Create `src/ui/typography/__tests__/display.test.tsx`
- [ ] Create `src/stories/typography/display.stories.tsx`

### Step 7: Create Barrel Exports

- [ ] Create `src/ui/typography/index.ts` exporting all components
- [ ] Create `src/ui/index.ts` exporting typography module

### Step 8: Run Validation Commands

- [ ] Run `npm run type-check` - verify zero TypeScript errors
- [ ] Run `npm run lint` - verify zero ESLint errors
- [ ] Run `npm test -- typography` - verify all tests pass
- [ ] Run `npm run test:run` - verify no regressions
- [ ] Run `npm run build` - verify production build works
- [ ] Run `npm run build-storybook` - verify Storybook builds

## Testing Strategy

### Unit Tests

1. **Component Rendering Tests** (for each component):
   - Renders with default props
   - Renders correct HTML element by default
   - Applies correct size/line-height classes
   - Applies correct default weight

2. **Weight Variant Tests** (Text and LeadText only):
   - Regular weight applies font-normal
   - Medium weight applies font-medium
   - Semibold weight applies font-semibold
   - Bold weight applies font-bold

3. **Color Variant Tests**:
   - Each color variant applies correct text color class
   - Default color is text-foreground

4. **Polymorphic Rendering Tests**:
   - `as` prop changes rendered element
   - Custom components receive all props

5. **AsChild Tests**:
   - Child element receives all styles when `asChild={true}`
   - Props merge correctly with child

6. **ClassName Merge Tests**:
   - Custom className is merged with variant classes
   - Conflicting classes are resolved correctly

### Edge Cases

- Empty children
- Very long text content
- Special characters and RTL text
- Nested typography components
- className with conflicting Tailwind classes

## Storybook Stories

### text.stories.tsx

- **Default**: TextMd with default props
- **Sizes**: All three sizes (TextXs, TextSm, TextMd) side by side
- **Weights**: All weight variants demonstrated
- **Colors**: All color variants demonstrated
- **AsChild**: Composition with Link component

### lead-text.stories.tsx

- **Default**: LeadTextMd with default props
- **Sizes**: All three sizes side by side
- **Weights**: All weight variants
- **Colors**: All color variants
- **Usage Example**: Real paragraph with emphasis

### headings.stories.tsx

- **Default**: H1 with default props
- **Hierarchy**: All headings H1-H6 in order
- **Subtitle**: Subtitle component usage
- **Colors**: Color variants on headings
- **Semantic Override**: Using `as` prop for visual vs semantic mismatch
- **Accessibility**: Proper heading hierarchy example

### display.stories.tsx

- **Default**: DisplayMd with default props
- **Sizes**: All display sizes (Xxl to Xs)
- **Colors**: Color variants on display text
- **Hero Example**: Display text in hero section context

## Acceptance Criteria

### Functional Requirements

- All 19 typography components implemented:
  - TextXs, TextSm, TextMd (3)
  - LeadTextXs, LeadTextSm, LeadTextMd (3)
  - H1, H2, H3, H4, H5, H6, Subtitle (7)
  - DisplayXxl, DisplayXl, DisplayLg, DisplayMd, DisplaySm, DisplayXs (6)
- Weight variants work for Text and LeadText components
- Color variants work for all components
- Polymorphic `as` prop works for all components
- `asChild` pattern works for all components
- Components forward refs correctly
- className prop merges correctly using tailwind-merge

### Testing Requirements

- Unit tests for all components with >90% coverage
- All variant combinations tested
- Polymorphic rendering tested
- asChild composition tested
- All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- 4 story files created (text, lead-text, headings, display)
- Meta configuration with comprehensive argTypes
- Default stories implemented
- Size comparison stories implemented
- Weight variant stories for applicable components
- Color variant stories implemented
- AsChild composition stories implemented
- Accessibility example story for headings
- Storybook builds successfully

### Integration Requirements

- Exported through category barrel (`src/ui/typography/index.ts`)
- Exported through root barrel (`src/ui/index.ts`)
- Components can be imported via `import { H1, TextMd } from '@/ui'`
- Components can be imported via `import { H1 } from '@/ui/typography'`

### Code Quality

- Zero TypeScript errors: `npm run type-check`
- Zero ESLint warnings: `npm run lint`
- Build succeeds: `npm run build`

## Validation Commands

Execute EVERY command below. All must pass with zero errors.

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across components, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- typography`
   - Expected: All typography tests pass with >90% coverage
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

**All 6 commands MUST pass before the components are considered complete.**

## Component Summary

| Component  | Size | Line Height | Weight   | Default Element |
| ---------- | ---- | ----------- | -------- | --------------- |
| TextXs     | 12px | 18px        | variants | p               |
| TextSm     | 14px | 20px        | variants | p               |
| TextMd     | 16px | 24px        | variants | p               |
| LeadTextXs | 18px | 26px        | variants | p               |
| LeadTextSm | 20px | 28px        | variants | p               |
| LeadTextMd | 24px | 32px        | variants | p               |
| H1         | 40px | 50px        | bold     | h1              |
| H2         | 32px | 40px        | bold     | h2              |
| H3         | 24px | 32px        | bold     | h3              |
| H4         | 20px | 28px        | bold     | h4              |
| H5         | 18px | 26px        | bold     | h5              |
| H6         | 16px | 24px        | bold     | h6              |
| Subtitle   | 14px | 20px        | semibold | span            |
| DisplayXxl | 80px | 100px       | regular  | span            |
| DisplayXl  | 72px | 90px        | regular  | span            |
| DisplayLg  | 64px | 80px        | regular  | span            |
| DisplayMd  | 56px | 70px        | regular  | span            |
| DisplaySm  | 48px | 60px        | regular  | span            |
| DisplayXs  | 40px | 50px        | regular  | span            |

## Notes

### Architecture Decision: Individual Components vs Single Variant Component

**Choice**: Individual named components (H1, TextMd, etc.)

**Rationale**:

- Self-documenting imports: `import { H1, TextMd }` clearly indicates intent
- Better IDE autocomplete experience
- Smaller component API per component
- More aligned with semantic HTML concepts
- Easier to enforce constraints (e.g., no weight prop on headings)
- Type inference is simpler per component

**Trade-offs**:

- More files to maintain (4 vs 1)
- More exports to manage
- Slightly more code duplication

### Dependencies

- `@radix-ui/react-slot` - For asChild polymorphic pattern
- `class-variance-authority` - For type-safe variants
- `clsx` - For class name composition
- `tailwind-merge` - For Tailwind class conflict resolution

### Future Considerations

1. **Responsive Typography**: Consider adding responsive variant utilities for automatic size scaling
2. **Theme Support**: Components use semantic tokens, ready for dark mode
3. **Animation**: Consider adding text animation utilities
4. **Truncation**: Consider adding truncate variants with line-clamp support
