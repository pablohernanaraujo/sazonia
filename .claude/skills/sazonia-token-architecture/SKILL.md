---
name: sazonia-token-architecture
description: Create and manage design tokens following the 3-layer architecture (core, semantic, component). Use when creating component tokens, adding new semantic tokens, migrating existing components to token architecture, or setting up dark mode theming.
---

# Sazonia Token Architecture

This Skill helps you create and manage design tokens following sazonia-web's 3-layer token architecture for scalable theming and component consistency.

## When to Use This Skill

- Creating tokens for a new UI component
- Adding new semantic tokens (intents like "accent", "success-muted")
- Migrating existing components from hardcoded values to tokens
- Setting up dark mode or brand theming
- Troubleshooting token resolution issues
- Understanding which layer a token belongs to

## Token Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: Component Tokens                                  │
│  src/styles/tokens/components/*.css                         │
│  --button-bg, --card-border, --input-focus-ring             │
│  References → Semantic Tokens                               │
├─────────────────────────────────────────────────────────────┤
│  LAYER 2: Semantic Tokens                                   │
│  src/styles/tokens/semantic/*.css                           │
│  --brand-fill, --surface-primary, --text-default            │
│  References → Core Tokens                                   │
├─────────────────────────────────────────────────────────────┤
│  LAYER 1: Core/Primitive Tokens                             │
│  src/styles/*.css (colors, spacing, radius, shadows, blur)  │
│  --bg-fill-brand-primary, --text-base-primary, --radius-md  │
│  Raw values from Glow UI design system                      │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/styles/
├── index.css                    # Aggregator - imports ALL layers in order
├── colors.css                   # Layer 1: Core color primitives
├── spacing.css                  # Layer 1: Core spacing scale
├── border-radius.css            # Layer 1: Core radius scale
├── shadows.css                  # Layer 1: Core shadow effects
├── blur.css                     # Layer 1: Core blur effects
└── tokens/
    ├── semantic/
    │   ├── theme-light.css      # Layer 2: Light theme semantic mappings
    │   └── theme-dark.css       # Layer 2: Dark theme (future)
    └── components/
        ├── button.css           # Layer 3: Button tokens
        ├── input.css            # Layer 3: Input tokens
        └── card.css             # Layer 3: Card tokens
```

## Creating Component Tokens

### Step 1: Identify Themeable Properties

Determine which properties should be tokenized:

| Tokenize (Themeable)     | Don't Tokenize (Fixed) |
| ------------------------ | ---------------------- |
| Background colors        | Flex/grid layout       |
| Text colors              | Display properties     |
| Border colors            | Position properties    |
| Border radius            | Transitions/animations |
| Shadows                  | Z-index                |
| Spacing (padding, gap)   | Overflow               |
| Heights/widths for sizes | Transform              |

### Step 2: Create Token File

```css
/* src/styles/tokens/components/<component>.css */

/**
 * <Component> Component Tokens
 * References semantic tokens for consistent theming.
 */

:root {
  /* ============================================
   * <COMPONENT> - Layout tokens
   * ============================================ */
  --<component>-border-radius: var(--radius-md);
  --<component>-padding: var(--spacing-4);
  --<component>-gap: var(--spacing-2);

  /* ============================================
   * <COMPONENT> - Size tokens
   * ============================================ */
  --<component>-height-sm: 2rem;
  --<component>-height-md: 2.5rem;
  --<component>-height-lg: 3rem;

  /* ============================================
   * <COMPONENT> PRIMARY - Main variant
   * ============================================ */
  --<component>-primary-bg: var(--brand-fill);
  --<component>-primary-bg-hover: var(--brand-fill-hover);
  --<component>-primary-bg-active: var(--brand-fill-active);
  --<component>-primary-text: var(--text-overlay-white);

  /* ============================================
   * <COMPONENT> SECONDARY - Neutral variant
   * ============================================ */
  --<component>-secondary-bg: var(--secondary-fill);
  --<component>-secondary-bg-hover: var(--secondary-fill-hover);
  --<component>-secondary-text: var(--text-primary);

  /* ============================================
   * <COMPONENT> - Focus ring
   * ============================================ */
  --<component>-focus-ring: var(--focus-ring-brand);

  /* ============================================
   * <COMPONENT> - Disabled state
   * ============================================ */
  --<component>-disabled-opacity: 0.52;
}
```

### Step 3: Add Import to Index

Add the import to `src/styles/index.css` in the **correct section**:

```css
/* ============================================
 * LAYER 3: Component Tokens
 * ============================================ */
@import './tokens/components/button.css';
@import './tokens/components/<component>.css'; /* ADD HERE */
```

### Step 4: Use in Component with CVA

```typescript
const componentVariants = cva(
  [
    // Tokenized properties
    'rounded-[var(--component-border-radius)]',
    'p-[var(--component-padding)]',
    'gap-[var(--component-gap)]',
    // Non-tokenized properties
    'inline-flex items-center justify-center',
    'transition-colors duration-150',
  ],
  {
    variants: {
      variant: {
        primary: '',
        secondary: '',
      },
      size: {
        sm: 'h-[var(--component-height-sm)]',
        md: 'h-[var(--component-height-md)]',
        lg: 'h-[var(--component-height-lg)]',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        className: [
          'bg-[var(--component-primary-bg)]',
          'text-[var(--component-primary-text)]',
          'hover:bg-[var(--component-primary-bg-hover)]',
          'active:bg-[var(--component-primary-bg-active)]',
        ].join(' '),
      },
      {
        variant: 'secondary',
        className: [
          'bg-[var(--component-secondary-bg)]',
          'text-[var(--component-secondary-text)]',
          'hover:bg-[var(--component-secondary-bg-hover)]',
        ].join(' '),
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
```

## Token Naming Convention

```
--{component}-{property}[-{variant}][-{state}]
```

### Examples

| Token                       | Description                        |
| --------------------------- | ---------------------------------- |
| `--button-bg`               | Button background (default)        |
| `--button-primary-bg`       | Button primary variant background  |
| `--button-primary-bg-hover` | Button primary variant hover state |
| `--button-height-sm`        | Button small size height           |
| `--button-focus-ring`       | Button focus ring color            |
| `--card-border-radius`      | Card border radius                 |
| `--input-error-border`      | Input error state border           |

## Adding Semantic Tokens

When you need a new intent that doesn't exist:

```css
/* src/styles/tokens/semantic/theme-light.css */

:root {
  /* Add new semantic token */
  --accent-fill: var(--bg-fill-accent-primary);
  --accent-fill-hover: var(--bg-fill-accent-primary-hover);
  --accent-text: var(--text-semantic-accent);
}
```

**Available semantic categories:**

- `--brand-*`: Primary brand colors
- `--secondary-*`: Neutral/secondary colors
- `--tertiary-*`: Subtle/tertiary colors
- `--danger-*`: Destructive/error colors
- `--surface-*`: Background surfaces
- `--text-*`: Text colors
- `--border-*`: Border colors
- `--focus-ring-*`: Focus indicators

## Adding Dark Mode

### Step 1: Create Dark Theme File

```css
/* src/styles/tokens/semantic/theme-dark.css */

[data-theme='dark'] {
  /* Override semantic tokens for dark mode */
  --surface-primary: var(--bg-surface-dark-primary);
  --surface-secondary: var(--bg-surface-dark-secondary);

  --text-primary: var(--text-dark-primary);
  --text-secondary: var(--text-dark-secondary);

  --brand-fill: var(--bg-fill-brand-dark-primary);
  --brand-fill-hover: var(--bg-fill-brand-dark-hover);

  --border-default: var(--border-dark-primary);
}
```

### Step 2: Import After Light Theme

```css
/* src/styles/index.css */

/* LAYER 2: Semantic Tokens */
@import './tokens/semantic/theme-light.css';
@import './tokens/semantic/theme-dark.css'; /* Must be after light */
```

### Step 3: Toggle Theme in App

```typescript
// Set theme on document
document.documentElement.setAttribute('data-theme', 'dark');
```

## Migrating Existing Components

### Before (Hardcoded)

```typescript
const buttonVariants = cva(
  'rounded-sm bg-fill-primary text-white hover:bg-fill-primary-hover'
  // ...
);
```

### After (Tokenized)

1. Create token file with current values mapped
2. Update CVA to use tokens
3. Test visual parity

```typescript
const buttonVariants = cva(
  [
    'bg-[var(--button-filled-primary-bg)]',
    'text-[var(--button-filled-primary-text)]',
    'hover:bg-[var(--button-filled-primary-bg-hover)]',
    'rounded-[var(--button-border-radius)]',
  ].join(' ')
  // ...
);
```

## Troubleshooting

### Token Not Resolving

**Symptoms:** CSS variable shows as empty or undefined

**Causes & Solutions:**

1. **Import order wrong** - Ensure core → semantic → component order in `index.css`
2. **Typo in token name** - Check spelling matches exactly
3. **Missing import** - Verify token file is imported in `index.css`
4. **Wrong selector** - Use `:root` for global tokens

### Token Shows Raw Value

**Symptoms:** `var(--brand-fill)` shows as `var(--brand-fill)` instead of color

**Solution:** The referenced token doesn't exist. Check Layer 2 semantic tokens.

### Tailwind Not Picking Up Token

**Symptoms:** Class like `bg-[var(--token)]` doesn't apply

**Solutions:**

1. Ensure no spaces in arbitrary value: `bg-[var(--token)]` not `bg-[ var(--token) ]`
2. Restart dev server after adding new tokens
3. Check that `globals.css` imports `src/styles/index.css`

## Anti-Patterns

```css
/* ❌ BAD: Component token referencing core token directly */
--button-bg: var(--bg-fill-brand-primary); /* Skips semantic layer */

/* ✅ GOOD: Component token referencing semantic token */
--button-bg: var(--brand-fill); /* Uses semantic layer */
```

```css
/* ❌ BAD: Hardcoded value in token */
--button-bg: #3c61dd;

/* ✅ GOOD: Reference to semantic token */
--button-bg: var(--brand-fill);
```

```typescript
// ❌ BAD: Mixing tokens and hardcoded values
className = 'bg-[var(--button-bg)] text-white';

// ✅ GOOD: All themeable properties use tokens
className = 'bg-[var(--button-bg)] text-[var(--button-text)]';
```

## Quick Reference

### Layer 1 (Core) Files

- `src/styles/colors.css` - Color primitives
- `src/styles/spacing.css` - Spacing scale
- `src/styles/border-radius.css` - Radius scale
- `src/styles/shadows.css` - Shadow effects
- `src/styles/blur.css` - Blur effects

### Layer 2 (Semantic) Files

- `src/styles/tokens/semantic/theme-light.css` - Light theme

### Layer 3 (Component) Files

- `src/styles/tokens/components/*.css` - One per component

### Common Semantic Tokens

- `--brand-fill`, `--brand-fill-hover`, `--brand-fill-active`
- `--secondary-fill`, `--secondary-fill-hover`
- `--tertiary-fill`, `--tertiary-fill-hover`
- `--danger-fill`, `--danger-fill-hover`
- `--surface-primary`, `--surface-secondary`
- `--text-primary`, `--text-secondary`, `--text-overlay-white`
- `--border-default`, `--border-brand`
- `--focus-ring-brand`, `--focus-ring-secondary`

## Additional Resources

- See `.claude/rules/styling-guidelines.md` for complete token architecture documentation
- See `.claude/skills/sazonia-ui-components/SKILL.md` for component creation with tokens
- See `src/styles/tokens/components/button.css` for reference implementation
