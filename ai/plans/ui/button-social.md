# Ui: ButtonSocial

## Component Description

The ButtonSocial component is a specialized authentication button designed for social login flows. It provides pre-styled buttons for popular OAuth providers including Google, Apple, Facebook, Twitter, GitHub, and Microsoft. Each provider has its own branded styling with support for both filled (branded colors) and outline (neutral) variants. The component supports full-width buttons with text labels as well as icon-only compact versions, making it versatile for various authentication UI layouts.

## User Story

As a user
I want to easily identify and click on social login buttons
So that I can quickly authenticate using my preferred OAuth provider

## Problem Statement

Authentication pages require consistent, recognizable social login buttons that follow each provider's branding guidelines. Building these buttons from scratch for each provider is time-consuming and error-prone. A standardized component ensures visual consistency, proper accessibility, and correct brand representation across the application.

## Solution Statement

Create a ButtonSocial component that encapsulates all social provider button variants using CVA for variant management. The component will support 6 OAuth providers (Google, Apple, Facebook, Twitter, GitHub, Microsoft) with 2 style variants (filled, outline), proper interactive states (default, hover, focus), and an icon-only mode. All provider logos will be embedded as SVG components for optimal performance and styling flexibility.

## Atomic Design Classification

**Component Type**: Molecule

**Reasoning**: ButtonSocial is a molecule because it combines multiple atoms (icon/logo + text) to form a single interactive unit with specific meaning. It is more complex than a basic button (atom) because it includes provider-specific branding, logos, and semantic context for authentication flows.

**Composition Requirements**:

- **Required Atoms**:
  - `Icon` from `@/ui/icons` (for loading spinner - uses `CircleNotch` with `animate-spin`)
  - Brand logos from `@/ui/icons/brand-logos` (centralized logo management)
  - Typography utilities (inherited from button text styles)

- **Provider Logos Architecture**: Provider logos are implemented as dedicated SVG components in `src/ui/icons/brand-logos/` directory. This approach:
  - Maintains architectural consistency with the existing Icon system
  - Enables logo reuse across the application (e.g., "Connected Accounts" in user profile)
  - Centralizes SVG asset management
  - Provides better discoverability for developers
  - Allows multi-color logos (Google's 4-color, Microsoft's Windows logo) while keeping centralized management

## Component Location

**Location**: `src/ui/buttons/button-social.tsx`

**Category**: `buttons`

**Reasoning**: This component is a specialized button variant, making the `buttons` category the appropriate location. It complements the existing Button, ButtonGroup, and FAB components in this category.

**Export Pattern**:

```typescript
// 1. Create component: src/ui/buttons/button-social.tsx
export { ButtonSocial, buttonSocialVariants };
export type { ButtonSocialProps, SocialProvider };

// 2. Update category barrel: src/ui/buttons/index.ts
export * from './button-social';

// 3. Root barrel already exports buttons (no update needed)
// src/ui/index.ts already has: export * from './buttons';

// 4. Import usage (recommended):
import { ButtonSocial } from '@/ui';

// 5. Import usage (alternative):
import { ButtonSocial } from '@/ui/buttons';
```

## Relevant Files

### Existing Files to Reference

- **`src/ui/buttons/button.tsx`** - Primary reference for:
  - CVA pattern implementation with compound variants
  - forwardRef pattern with proper typing
  - Loading state with spinner
  - Interactive state handling (hover, focus, disabled)
  - Accessibility patterns (aria-label, aria-busy, aria-disabled)

- **`src/ui/icons/icon.tsx`** - Reference for:
  - Icon wrapper patterns
  - Size variant system
  - Accessibility props for icons

- **`src/stories/buttons/button.stories.tsx`** - Reference for:
  - Story structure with `satisfies Meta<typeof Component>`
  - argTypes configuration patterns
  - Comprehensive story organization (Default, AllVariants, States, etc.)
  - Real-world usage examples
  - Complete matrix stories

- **`src/ui/buttons/__tests__/button.test.tsx`** - Reference for:
  - Test organization with describe blocks
  - Rendering, variant, state, and accessibility tests
  - userEvent and fireEvent patterns
  - Edge case testing

- **`src/app/globals.css`** - Reference for:
  - Semantic color tokens
  - Design system tokens
  - Focus ring patterns

### New Files (ALL are REQUIRED)

1. **Component file**: `src/ui/buttons/button-social.tsx` (REQUIRED)
2. **Test file**: `src/ui/buttons/__tests__/button-social.test.tsx` (REQUIRED)
3. **Story file**: `src/stories/buttons/button-social.stories.tsx` (REQUIRED & NON-NEGOTIABLE)
4. **Category barrel update**: `src/ui/buttons/index.ts` (add export)

## Style & Design Requirements

### Responsive Design

- **Desktop (lg: 1024px+)**: Yes - Full-width buttons (280px as per Figma) work well on desktop
- **Tablet (md: 768px - 1023px)**: Yes - Same as desktop
- **Mobile (< 768px)**: Yes - Buttons should be full-width on mobile, icon-only variant useful for compact layouts

### Design Assets

**Status**: Design assets provided

**Assets**:

- Figma link: https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1915-109095&m=dev

**Design Specifications**:

#### Providers & Colors

| Provider  | Filled Background     | Text Color (Filled) |
| --------- | --------------------- | ------------------- |
| Google    | `#4285f4`             | White               |
| Apple     | `#11181c` (dark gray) | White               |
| Facebook  | `#1877f2`             | White               |
| Twitter   | `#1da1f2`             | White               |
| GitHub    | `#11181c` (dark gray) | White               |
| Microsoft | `#11181c` (dark gray) | White               |

#### States

| State   | Outline Style                                                                                | Filled Style                          |
| ------- | -------------------------------------------------------------------------------------------- | ------------------------------------- |
| Default | `bg-white`, `border-border-primary`                                                          | Provider brand color                  |
| Hover   | `bg-fill-secondary`, `border-border-hover`                                                   | Precomputed darker color per provider |
| Focus   | Same as default + `focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring` | Same focus ring pattern               |

**Hover Colors (Precomputed)**:
| Provider | Base Color | Hover Color |
|----------|-----------|-------------|
| Google | `#4285f4` | `#3367d6` |
| Apple | `#11181c` | `#000000` |
| Facebook | `#1877f2` | `#166fe5` |
| Twitter | `#1da1f2` | `#1a91da` |
| GitHub | `#11181c` | `#000000` |
| Microsoft | `#11181c` | `#000000` |

#### Dimensions

- **Full button width**: 280px (can be overridden)
- **Padding**: 16px horizontal, 12px vertical
- **Icon size**: 22px (with text), 24px (icon-only)
- **Gap between icon and text**: 10px
- **Border radius**: 6px (`rounded-sm`)
- **Icon-only padding**: 12px all sides

#### Typography

- **Font family**: Inter
- **Font weight**: Medium (500)
- **Font size**: 16px
- **Line height**: 24px
- **Text**: "Continue with {Provider}"

## Storybook Stories

**Required**: Every UI component MUST have Storybook stories for visual documentation and testing

**Story File**: `src/stories/buttons/button-social.stories.tsx`

**Required Stories**:

1. **Default Story**: Google button with filled style
2. **All Providers (Filled)**: All 6 providers with filled style
3. **All Providers (Outline)**: All 6 providers with outline style
4. **All States (Filled)**: Default, hover, focus states for filled
5. **All States (Outline)**: Default, hover, focus states for outline
6. **Icon Only**: All providers as icon-only buttons
7. **Loading State**: Button with loading spinner
8. **Disabled State**: Disabled buttons for both styles
9. **Full Width**: Button stretching to container width
10. **Login Form Example**: Real-world usage in a login form layout
11. **Complete Matrix**: All provider × style combinations

**Story Requirements**:

- Use `satisfies Meta<typeof ButtonSocial>` pattern
- Include `tags: ["autodocs"]` for automatic documentation
- Define comprehensive `argTypes` with descriptions for all props
- Set `parameters.layout: "centered"` for most stories
- Create interactive controls for all configurable props
- Include JSDoc-style comments explaining each story's purpose

**Example Structure**:

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ButtonSocial } from "@/ui/buttons";

const meta = {
  title: "Buttons/ButtonSocial",
  component: ButtonSocial,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    provider: {
      control: "select",
      options: ["google", "apple", "facebook", "twitter", "github", "microsoft"],
      description: "The OAuth provider for branding",
    },
    variant: {
      control: "select",
      options: ["filled", "outline"],
      description: "Visual style variant",
    },
    iconOnly: {
      control: "boolean",
      description: "Show only the provider icon without text",
    },
    loading: {
      control: "boolean",
      description: "Shows loading spinner and disables interaction",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
    },
  },
} satisfies Meta<typeof ButtonSocial>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    provider: "google",
    variant: "filled",
  },
};

export const AllProviders: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ButtonSocial provider="google" />
      <ButtonSocial provider="apple" />
      <ButtonSocial provider="facebook" />
      <ButtonSocial provider="twitter" />
      <ButtonSocial provider="github" />
      <ButtonSocial provider="microsoft" />
    </div>
  ),
};
```

## Implementation Plan

### Phase 1: Foundation

1. Create provider logo SVG components in `src/ui/icons/brand-logos/`:

**Directory Structure:**

```
src/ui/icons/
├── index.ts
├── icon.tsx
└── brand-logos/
    ├── index.ts
    ├── google-logo.tsx
    ├── apple-logo.tsx
    ├── facebook-logo.tsx
    ├── twitter-logo.tsx
    ├── github-logo.tsx
    └── microsoft-logo.tsx
```

**Logo Component Template:**

```typescript
// src/ui/icons/brand-logos/google-logo.tsx
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export const GoogleLogo = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<'svg'>>(
  ({ width = 20, height = 20, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      {/* Google logo paths with multi-color fills */}
    </svg>
  )
);

GoogleLogo.displayName = 'GoogleLogo';
```

**Barrel Export:**

```typescript
// src/ui/icons/brand-logos/index.ts
export { GoogleLogo } from './google-logo';
export { AppleLogo } from './apple-logo';
export { FacebookLogo } from './facebook-logo';
export { TwitterLogo } from './twitter-logo';
export { GitHubLogo } from './github-logo';
export { MicrosoftLogo } from './microsoft-logo';

export const brandLogos = {
  google: GoogleLogo,
  apple: AppleLogo,
  facebook: FacebookLogo,
  twitter: TwitterLogo,
  github: GitHubLogo,
  microsoft: MicrosoftLogo,
} as const;

export type BrandProvider = keyof typeof brandLogos;
```

**Provider logos:**

- Google (multi-color logo with 4 colors)
- Apple (monochrome, uses currentColor)
- Facebook (blue/white "f" logo)
- Twitter (classic bird logo per Figma design)
- GitHub (Invertocat silhouette, uses currentColor)
- Microsoft (4-color Windows logo)

2. Define TypeScript types for:
   - `SocialProvider` union type
   - `ButtonSocialVariant` type
   - `ButtonSocialProps` interface with conditional aria-label enforcement

### Phase 2: Core Implementation

1. Create CVA variants for button styling:
   - Base styles (layout, typography, transitions)
   - Variant styles (filled, outline)
   - Provider-specific compound variants for filled buttons
   - State styles (hover, focus, disabled)

2. Implement ButtonSocial component:
   - forwardRef pattern for ref forwarding
   - Provider-specific logo rendering
   - Text label with "Continue with {Provider}"
   - Icon-only mode support
   - Loading state with spinner
   - Click handler integration
   - Accessibility attributes

### Phase 3: Design System Integration & Documentation

**Export Configuration:**

Update `src/ui/buttons/index.ts` to include:

```typescript
export * from './button-social';
```

**Storybook Documentation (REQUIRED):**

- Story file location: `src/stories/buttons/button-social.stories.tsx`
- Stories for each provider (Google, Apple, Facebook, Twitter, GitHub, Microsoft)
- Stories for each variant (filled, outline)
- Stories for each state (default, hover, focus, disabled, loading)
- Stories for icon-only mode
- Real-world login form example
- Complete matrix showing all combinations

## Step by Step Tasks

### 1. Create Provider Logo Components

Create SVG components in `src/ui/icons/brand-logos/` directory:

- Create `src/ui/icons/brand-logos/` directory
- Google: Multi-color logo with proper viewBox and paths (4 colors: #4285f4, #34a853, #fbbc05, #ea4335)
- Apple: Monochrome logo that inherits currentColor for theme adaptation
- Facebook: Facebook "f" logo with brand blue (#1877f2)
- Twitter: Classic Twitter bird logo (per Figma design, not X rebranding)
- GitHub: GitHub Invertocat silhouette, uses currentColor
- Microsoft: 4-color Windows logo (#f25022, #7fba00, #00a4ef, #ffb900)
- Create barrel export `src/ui/icons/brand-logos/index.ts` with `brandLogos` map
- Update `src/ui/icons/index.ts` to re-export brand-logos

### 2. Define Types and Interfaces

```typescript
export type SocialProvider =
  | 'google'
  | 'apple'
  | 'facebook'
  | 'twitter'
  | 'github'
  | 'microsoft';

// Provider display names mapping
export const providerNames: Record<SocialProvider, string> = {
  google: 'Google',
  apple: 'Apple',
  facebook: 'Facebook',
  twitter: 'Twitter', // Using classic branding per Figma design
  github: 'GitHub', // Note: capital H
  microsoft: 'Microsoft',
};

// Conditional types to enforce aria-label for icon-only buttons
type BaseProps = {
  provider: SocialProvider;
  loading?: boolean;
} & Omit<ComponentPropsWithoutRef<'button'>, 'children'> &
  VariantProps<typeof buttonSocialVariants>;

type IconOnlyProps = BaseProps & {
  iconOnly: true;
  'aria-label': string; // Required for accessibility
};

type FullButtonProps = BaseProps & {
  iconOnly?: false;
  'aria-label'?: string; // Optional when text is present
};

export type ButtonSocialProps = IconOnlyProps | FullButtonProps;
```

**Development Warning**: Add console warning for missing `aria-label` on icon-only buttons:

```typescript
if (process.env.NODE_ENV === 'development') {
  if (iconOnly && !props['aria-label']) {
    console.warn(
      `ButtonSocial: Icon-only button for "${provider}" requires an aria-label for accessibility`
    );
  }
}
```

### 3. Implement CVA Variants

```typescript
const buttonSocialVariants = cva(
  [
    'inline-flex items-center justify-center gap-2.5',
    'font-medium text-base leading-6',
    'rounded-sm',
    'transition-all duration-150',
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring',
    'disabled:pointer-events-none disabled:opacity-52',
  ],
  {
    variants: {
      variant: {
        filled: '',
        outline: 'border bg-white border-border-primary hover:bg-fill-secondary hover:border-border-hover',
      },
      iconOnly: {
        true: 'p-3',
        false: 'px-4 py-3 w-[280px]',
      },
    },
    defaultVariants: {
      variant: 'filled',
      iconOnly: false,
    },
  }
);

// Provider-specific styles for filled variant (outside CVA for dynamic provider)
const providerFilledStyles: Record<SocialProvider, string> = {
  google: 'bg-[#4285f4] text-white hover:bg-[#3367d6]',
  apple: 'bg-[#11181c] text-white hover:bg-[#000000]',
  facebook: 'bg-[#1877f2] text-white hover:bg-[#166fe5]',
  twitter: 'bg-[#1da1f2] text-white hover:bg-[#1a91da]',
  github: 'bg-[#11181c] text-white hover:bg-[#000000]',
  microsoft: 'bg-[#11181c] text-white hover:bg-[#000000]',
};

// Usage in component:
className={cn(
  buttonSocialVariants({ variant, iconOnly }),
  variant === 'filled' && providerFilledStyles[provider],
  className
)}
```

### 4. Implement ButtonSocial Component

- Create component with forwardRef pattern
- Import brand logos from `@/ui/icons/brand-logos`
- Map provider to logo component using `brandLogos[provider]`
- Map provider to display name using `providerNames[provider]`
- Handle variant-specific styling with `providerFilledStyles`
- Implement focus ring using semantic tokens (`focus-visible:ring-ring`)
- Add loading state with `CircleNotch` icon and `animate-spin` class
- Add proper accessibility attributes:
  - `aria-busy` during loading
  - `aria-disabled` when disabled
  - `aria-label` (required for icon-only, optional otherwise)
- Add development warning for missing aria-label on icon-only buttons
- Icon sizes: 20px with text (`size="md"`), 24px icon-only (`size="lg"`)

### 5. Create Unit Tests

Create comprehensive tests in `src/ui/buttons/__tests__/button-social.test.tsx`:

- Rendering tests for each provider (all 6 providers)
- Variant tests (filled, outline)
- State tests (loading, disabled)
- Icon-only mode tests
- Click handler tests
- Accessibility tests (aria-label, aria-busy, aria-disabled, keyboard navigation)
- Focus management tests

**Additional tests per architectural review:**

- **Ref forwarding test:**

```typescript
it('forwards ref to button element', () => {
  const ref = React.createRef<HTMLButtonElement>();
  render(<ButtonSocial provider="google" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  expect(ref.current?.tagName).toBe('BUTTON');
});
```

- **className merging test:**

```typescript
it('merges custom className with variant classes', () => {
  const { container } = render(
    <ButtonSocial provider="google" className="custom-class" />
  );
  const button = container.querySelector('button');
  expect(button).toHaveClass('custom-class');
  expect(button).toHaveClass('inline-flex'); // Base class from CVA
});
```

- **Provider color test (loop through all providers):**

```typescript
const providers: SocialProvider[] = ['google', 'apple', 'facebook', 'twitter', 'github', 'microsoft'];

providers.forEach(provider => {
  it(`renders ${provider} provider with correct logo and branding`, () => {
    const { container } = render(<ButtonSocial provider={provider} />);
    // Verify logo SVG is present
    // Verify correct text: "Continue with {Provider}"
  });
});
```

### 6. Create Storybook Stories

Create `src/stories/buttons/button-social.stories.tsx`:

- Default story with Google/filled
- AllProvidersFilled story
- AllProvidersOutline story
- IconOnly story
- LoadingState story
- DisabledState story
- AllStates story (hover states shown via pseudo-states addon)
- LoginFormExample story
- CompleteMatrix story

### 7. Update Barrel Exports

Add export to `src/ui/buttons/index.ts`:

```typescript
export * from './button-social';
```

### 8. Run Validation Commands

Execute all validation commands to ensure zero regressions.

## Testing Strategy

### Unit Tests

1. **Rendering Tests**
   - Each provider renders correctly with proper logo
   - Filled and outline variants apply correct classes
   - Icon-only mode renders without text
   - Loading state shows spinner (CircleNotch with animate-spin)

2. **Interaction Tests**
   - Click handlers fire correctly
   - Disabled buttons don't trigger handlers
   - Loading buttons don't trigger handlers

3. **Accessibility Tests**
   - Proper button role
   - aria-label works for icon-only
   - aria-busy during loading
   - aria-disabled when disabled
   - Focus management
   - Keyboard navigation (Tab, Enter, Space)

4. **State Tests**
   - Default state styling
   - Hover state classes present
   - Focus ring visible on focus
   - Disabled state styling

5. **Ref Forwarding Tests** (Added per architectural review)
   - Forwards ref to button element correctly
   - Ref.current is HTMLButtonElement instance
   - Ref.current.tagName equals 'BUTTON'

6. **className Merging Tests** (Added per architectural review)
   - Custom className merges with variant classes
   - Base CVA classes remain after custom className added
   - Provider-specific classes applied correctly

7. **Provider-Specific Tests** (Added per architectural review)
   - Each provider applies correct brand color in filled variant
   - Each provider applies correct hover color
   - Provider logos render with correct dimensions (20px with text, 24px icon-only)

### Edge Cases

- Very long provider names (shouldn't happen with fixed providers)
- Rapid clicking during loading state
- Tab navigation through multiple social buttons
- Provider prop validation (TypeScript handles this)
- Full-width override with className
- Ref forwarding with forwardRef pattern

## Acceptance Criteria

### Functional Requirements

- All 6 providers render with correct branding
- Filled variant shows provider brand colors
- Outline variant shows neutral styling
- Icon-only mode shows only the provider logo
- Loading state shows spinner and disables interaction
- Disabled state shows reduced opacity
- Hover state shows appropriate background change
- Focus state shows 3px ring around button
- Click handlers work correctly
- Component forwards refs properly

### Testing Requirements

- Comprehensive unit tests with >90% coverage
- All provider variants tested
- All state combinations tested
- All edge cases tested
- All tests passing with zero regressions

### Storybook Requirements (NON-NEGOTIABLE)

- Storybook stories file created: `src/stories/buttons/button-social.stories.tsx`
- Meta configuration with comprehensive argTypes
- Default story implemented
- AllProvidersFilled story implemented
- AllProvidersOutline story implemented
- IconOnly story implemented
- LoadingState story implemented
- DisabledState story implemented
- LoginFormExample story implemented
- CompleteMatrix story implemented
- Interactive controls configured for all props
- Storybook builds successfully: `npm run build-storybook`
- All stories render correctly in Storybook UI

### Integration Requirements

- Exported through category barrel (`src/ui/buttons/index.ts`)
- Exported through root barrel (`src/ui/index.ts`)
- Component can be imported via `import { ButtonSocial } from '@/ui'`

### Code Quality

- Zero TypeScript errors: `npm run type-check`
- Zero ESLint warnings: `npm run lint`
- Build succeeds: `npm run build`

## Validation Commands

Execute EVERY command below. All must pass with zero errors.

1. **Type check**: `npm run type-check`
   - Expected: Zero TypeScript errors
   - Validates: Type safety across component, tests, and stories

2. **Lint check**: `npm run lint`
   - Expected: Zero ESLint errors or warnings
   - Validates: Code quality and style conformance

3. **Run component tests**: `npm test -- button-social`
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

### Provider Logo Implementation

Provider logos are implemented as dedicated SVG components in `src/ui/icons/brand-logos/` directory. This approach (updated per architectural review):

- **Maintains architectural consistency** with the existing Icon system
- **Enables logo reuse** across the application (e.g., "Connected Accounts" in user profile)
- **Centralizes SVG asset management** for better maintainability
- **Provides better discoverability** - developers can find logos in the Icon directory
- Allows proper styling integration (currentColor for monochrome logos like Apple, GitHub)
- Ensures logos are always available without network requests
- Provides optimal performance with no external dependencies

### Brand Compliance

Each provider has specific branding guidelines:

- **Google**: Multi-color logo, white circular background in filled variant
- **Apple**: Solid color, works well in both variants
- **Facebook**: Blue "f" on white, or white "f" on blue
- **Twitter**: Classic bird logo (old branding per Figma design)
- **GitHub**: Invertocat logo
- **Microsoft**: 4-color Windows logo

### Accessibility Considerations

- Icon-only buttons require `aria-label` prop
- Text buttons use "Continue with {Provider}" as accessible name
- Loading state sets `aria-busy="true"`
- Focus rings meet WCAG 2.1 AA contrast requirements

### Future Considerations

- Additional providers (LinkedIn, Slack, Discord, etc.)
- Size variants (sm, md, lg) if needed
- Compact text variant ("Sign in" instead of "Continue with")
- Support for custom OAuth providers
