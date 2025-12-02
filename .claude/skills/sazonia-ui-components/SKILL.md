---
name: sazonia-ui-components
description: Create UI components following CVA patterns, Radix UI integration, and barrel export conventions. Use when building new UI components, creating design system components, working with typography, buttons, dialogs, layouts, or implementing variants with Class Variance Authority.
---

# Sazonia UI Components

This Skill helps you create UI components following sazonia-web's design system patterns, using Class Variance Authority (CVA) for variants, Radix UI for accessible primitives, and proper barrel exports for clean imports.

## When to Use This Skill

- Creating new UI components for the design system
- Building components with multiple variants (size, color, state)
- Integrating Radix UI primitives
- Setting up component categories (typography, buttons, dialogs, etc.)
- Implementing accessible, composable components

## Core Principles

### 1. Component Location

All UI components live in `src/ui/` organized by category:

```
src/ui/
├── index.ts                  # Root barrel export
├── typography/
│   ├── index.ts             # Category barrel export
│   ├── heading1.tsx
│   ├── body-medium.tsx
│   └── types.ts             # Shared types
├── buttons/
│   ├── index.ts
│   ├── button.tsx
│   └── icon-button.tsx
├── dialogs/
│   ├── index.ts
│   ├── dialog.tsx
│   └── alert-dialog.tsx
└── layouts/
    ├── index.ts
    ├── flex.tsx
    └── grid.tsx
```

### 2. Import Patterns

**All UI components use named exports with barrel files:**

```typescript
// ✅ Import from root (recommended)
import { Heading1, BodyMedium, Button, Dialog } from '@/ui';

// ✅ Import from category (also valid)
import { Heading1, BodyMedium } from '@/ui/typography';
import { Button } from '@/ui/buttons';
```

**Tree-shaking:** Fully supported with Next.js 15's optimized bundling.

### 3. React Import Conventions

**IMPORTANT:** All UI components must use direct imports from React, NOT namespace imports.

**EXCEPTION:** Barrel export files (`index.ts`) can use namespace imports when re-exporting Radix UI primitives.

**✅ Correct (Component Files):**

```typescript
import { forwardRef, type ComponentProps } from 'react';
```

**✅ Correct (Barrel Exports):**

```typescript
// src/ui/dialogs/index.ts
import * as DialogPrimitive from '@radix-ui/react-dialog';
```

**❌ Wrong (Component Files):**

```typescript
import * as React from 'react';
```

## Component Creation Steps

### Step 1: Choose Component Category

Determine which category your component belongs to:

- **typography/** - Text components (headings, body text, labels)
- **buttons/** - Interactive buttons and button-like components
- **inputs/** - Form inputs (text fields, checkboxes, selects)
- **dialogs/** - Modal dialogs and overlays
- **layouts/** - Layout containers (flex, grid, stack)
- **cards/** - Card components and containers
- **navigation/** - Navigation components (tabs, breadcrumbs)
- **feedback/** - Toasts, alerts, loading states
- **indicators/** - Badges, avatars, progress indicators

### Step 2: Create Component File

Use kebab-case for file names:

```bash
# Create component file
touch src/ui/buttons/primary-button.tsx
```

### Step 3: Implement Component with CVA

**Basic Component Pattern:**

```typescript
// src/ui/buttons/button.tsx
import { forwardRef, type ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles (always applied)
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
```

**Key Elements:**

1. **CVA Definition**: Define variants with `cva()`
2. **Props Interface**: Extend `ComponentProps` and `VariantProps`
3. **forwardRef**: Always use `forwardRef` for ref forwarding
4. **displayName**: Set `displayName` for debugging
5. **cn() utility**: Merge className props with variants

### Step 4: Add Compound Variants (Optional)

For complex variant combinations:

```typescript
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground bg-primary',
        outline: 'border-input border bg-background',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: '',
      },
    },
    compoundVariants: [
      // Special case: outline + small
      {
        variant: 'outline',
        size: 'sm',
        className: 'border-2',
      },
      // Disabled state overrides
      {
        disabled: true,
        className: 'hover:bg-transparent',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      disabled: false,
    },
  }
);
```

### Step 5: Update Barrel Exports

**Category barrel export:**

```typescript
// src/ui/buttons/index.ts
export { Button, type ButtonProps } from './button';
export { IconButton, type IconButtonProps } from './icon-button';
```

**Root barrel export:**

```typescript
// src/ui/index.ts
export * from './buttons';
export * from './typography';
export * from './dialogs';
// ... other categories
```

## Component Patterns

### Pattern 1: Simple Typography Component

```typescript
// src/ui/typography/body-medium.tsx
import { forwardRef, type ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bodyMediumVariants = cva("text-base leading-relaxed", {
  variants: {
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      accent: "text-accent-foreground",
    },
  },
  defaultVariants: {
    weight: "normal",
    color: "default",
  },
});

export interface BodyMediumProps
  extends ComponentProps<"p">,
    VariantProps<typeof bodyMediumVariants> {
  asChild?: boolean;
}

export const BodyMedium = forwardRef<HTMLParagraphElement, BodyMediumProps>(
  ({ className, weight, color, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(bodyMediumVariants({ weight, color, className }))}
        {...props}
      >
        {children}
      </p>
    );
  }
);

BodyMedium.displayName = "BodyMedium";
```

### Pattern 2: Radix UI Integration

```typescript
// src/ui/dialogs/dialog.tsx
import { forwardRef, type ComponentProps } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// Dialog Root (no styling needed)
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

// Dialog Overlay with variants
const dialogOverlayVariants = cva(
  "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
);

export const DialogOverlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentProps<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(dialogOverlayVariants(), className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Dialog Content with variants
const dialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface DialogContentProps
  extends ComponentProps<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {}

export const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, size, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants({ size, className }))}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;
```

### Pattern 3: Polymorphic Component with asChild

```typescript
// src/ui/buttons/button.tsx
import { forwardRef, type ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
```

Usage with `asChild`:

```typescript
// Renders as an anchor tag
<Button asChild variant="ghost">
  <a href="/profile">Go to Profile</a>
</Button>

// Renders as a Next.js Link
<Button asChild>
  <Link href="/dashboard">Dashboard</Link>
</Button>
```

### Pattern 4: Composite Component

```typescript
// src/ui/cards/card.tsx
import { forwardRef, type ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Card Root
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        outlined: "border-2",
        elevated: "shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

// Card Header
export const CardHeader = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

// Card Title
export const CardTitle = forwardRef<HTMLHeadingElement, ComponentProps<"h3">>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

// Card Content
export const CardContent = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";
```

Usage:

```typescript
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

## Component Token Integration

Every UI component should use the **3-layer token architecture** for themeable styling. See `.claude/rules/styling-guidelines.md` for full architecture details.

### Step 1: Create Component Token File

Create a token file for your component in `src/styles/tokens/components/`:

```css
/* src/styles/tokens/components/card.css */
:root {
  /* Card background */
  --card-bg: var(--surface-primary);
  --card-bg-hover: var(--surface-secondary);

  /* Card border */
  --card-border: var(--border-default);
  --card-border-radius: var(--radius-md);

  /* Card shadow */
  --card-shadow: var(--shadow-sm);
  --card-shadow-hover: var(--shadow-md);

  /* Card spacing */
  --card-padding: var(--spacing-4);
}
```

**Naming convention:** `--{component}-{property}[-{variant}][-{state}]`

### Step 2: Import Token File

Add the import to `src/styles/index.css` in the **Component Tokens** section:

```css
/* LAYER 3: Component Tokens (references Layer 2) */
@import './tokens/components/button.css';
@import './tokens/components/card.css'; /* Add your component */
```

### Step 3: Use Tokens in CVA

Reference component tokens using Tailwind's arbitrary value syntax:

```typescript
const cardVariants = cva(
  [
    // Use component tokens for themeable properties
    'bg-[var(--card-bg)]',
    'border border-[var(--card-border)]',
    'rounded-[var(--card-border-radius)]',
    'shadow-[var(--card-shadow)]',
    'p-[var(--card-padding)]',
    // Non-themeable properties use regular Tailwind
    'transition-shadow duration-200',
  ],
  {
    variants: {
      variant: {
        default: '',
        elevated: 'shadow-[var(--card-shadow-hover)]',
        interactive:
          'hover:bg-[var(--card-bg-hover)] hover:shadow-[var(--card-shadow-hover)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
```

### Token Architecture Rules

| Use Tokens For            | Use Regular Tailwind For                     |
| ------------------------- | -------------------------------------------- |
| Colors (bg, text, border) | Layout (flex, grid, positioning)             |
| Spacing (padding, gap)    | Typography (font-size via tokens or classes) |
| Border radius             | Transitions and animations                   |
| Shadows                   | Display and visibility                       |
| Heights/widths for sizes  | Responsive breakpoints                       |

### Anti-Patterns

```typescript
// ❌ BAD: Hardcoded color values
className = 'bg-[#3c61dd] hover:bg-[#385bcc]';

// ❌ BAD: Referencing core tokens directly (skip semantic layer)
className = 'bg-[var(--bg-fill-brand-primary)]';

// ❌ BAD: Referencing semantic tokens directly (skip component layer)
className = 'bg-[var(--brand-fill)]';

// ✅ GOOD: Using component tokens
className = 'bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)]';
```

## Component Checklist

When creating or reviewing UI components:

**Structure & Setup:**

- [ ] Component is in correct category (`src/ui/[category]/`)
- [ ] File name is kebab-case
- [ ] Uses direct React imports (not namespace)
- [ ] Uses `forwardRef` for ref forwarding
- [ ] Sets `displayName` for debugging

**TypeScript:**

- [ ] Props extend `ComponentProps<"element">`
- [ ] Props include `VariantProps<typeof variants>`
- [ ] TypeScript types exported
- [ ] No `any` types used

**CVA & Variants:**

- [ ] Variants defined with CVA
- [ ] Uses `cn()` to merge className
- [ ] Default variants specified

**Token Architecture:**

- [ ] Component token file created (`src/styles/tokens/components/<name>.css`)
- [ ] Token file imported in `src/styles/index.css`
- [ ] CVA uses component tokens for themeable properties
- [ ] No hardcoded color/spacing values in component

**Exports:**

- [ ] Added to category barrel export
- [ ] Added to root barrel export

**Accessibility:**

- [ ] Accessible (ARIA attributes when needed)

## Variant Design Guidelines

### Size Variants

```typescript
variants: {
  size: {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
    xl: "h-14 px-8 text-xl",
  }
}
```

### Color/Variant Variants

```typescript
variants: {
  variant: {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-input bg-transparent",
    ghost: "bg-transparent hover:bg-accent",
  }
}
```

### State Variants

```typescript
variants: {
  state: {
    default: "",
    active: "bg-accent",
    disabled: "opacity-50 cursor-not-allowed",
    loading: "opacity-70 pointer-events-none",
  }
}
```

## Best Practices

1. **Composability**: Design components to be composed together
2. **Accessibility**: Use Radix UI for complex interactive patterns
3. **Responsiveness**: Use Tailwind's responsive classes
4. **Type Safety**: Export and use proper TypeScript types
5. **Variants**: Use CVA for predictable, type-safe variants
6. **Defaults**: Always specify `defaultVariants`
7. **Flexibility**: Support `className` override via `cn()`
8. **Refs**: Always forward refs with `forwardRef`

## Anti-Patterns to Avoid

❌ **Using namespace imports in component files**

```typescript
import * as React from 'react'; // Wrong!
```

❌ **Not forwarding refs**

```typescript
export const Button = ({ ...props }) => {  // Missing forwardRef
  return <button {...props} />;
};
```

❌ **Hardcoding styles without variants**

```typescript
<button className="bg-blue-500 px-4 py-2">  // No CVA variants
```

❌ **Missing displayName**

```typescript
export const Button = forwardRef(...);
// Missing: Button.displayName = "Button";
```

❌ **Direct exports without barrel**

```typescript
import { Button } from '@/ui/buttons/button'; // Wrong!
// Should be: import { Button } from "@/ui";
```

## Additional Resources

For more details:

- See `.claude/rules/component-patterns.md` for complete component patterns
- See `.claude/rules/styling-guidelines.md` for styling conventions
- See `.claude/rules/accessibility-patterns.md` for accessibility requirements
- See `.claude/rules/code-quality.md` for ESLint, Prettier, and code quality standards
