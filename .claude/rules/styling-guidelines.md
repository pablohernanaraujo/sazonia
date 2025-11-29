# Styling Guidelines

This document outlines the Tailwind CSS 4 styling conventions, design system tokens, and CSS architecture used in sazonia-web.

## Tailwind CSS 4 Setup

### Configuration

Tailwind CSS 4 uses CSS-based configuration instead of JavaScript config files.

```css
/* src/app/globals.css */
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Theme configuration */
}
```

**Key principles:**

- No `tailwind.config.js` file
- Configuration lives in CSS using `@theme` directive
- Import Tailwind and plugins via CSS `@import`
- Custom variants defined with `@custom-variant`

### Plugin Integration

```css
/* prettier configuration for Tailwind */
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/app/globals.css",
  "tailwindFunctions": ["cva", "cn"]
}
```

**Key principles:**

- Use `prettier-plugin-tailwindcss` for automatic class sorting
- Configure stylesheet path for Tailwind 4
- Include custom functions like `cva` and `cn` for sorting

## Tailwind CSS 4 Advanced Features

### Custom Variants

Create reusable custom variants for specific use cases:

#### Accessibility Variants

```css
/* globals.css */
@custom-variant dark (&:is(.dark *));
@custom-variant motion-safe (&:where(@media (prefers-reduced-motion: no-preference)));
@custom-variant motion-reduce (&:where(@media (prefers-reduced-motion: reduce)));
@custom-variant high-contrast (&:where(@media (prefers-contrast: high)));
```

**Usage:**

```tsx
<div className="animate-fadeIn motion-reduce:animate-none motion-reduce:transition-none">
  Respects user motion preferences
</div>
```

#### State-Based Variants

```css
@custom-variant loading (&:is([data-loading="true"], [aria-busy="true"]));
@custom-variant invalid (&:is([data-invalid="true"], [aria-invalid="true"]));
@custom-variant active (&:is([data-active="true"], [aria-current="page"]));
```

**Usage:**

```tsx
<button
  data-loading={isLoading}
  className="bg-primary-500 loading:bg-neutral-300 loading:cursor-wait loading:pointer-events-none"
>
  Submit
</button>
```

#### Parent-State Variants

```css
@custom-variant group-loading (.group[data-loading="true"] &);
@custom-variant group-disabled (.group:disabled &);
@custom-variant group-expanded (.group[data-state="open"] &);
```

**Usage:**

```tsx
<div className="group" data-loading={isLoading}>
  <button>Action</button>
  <span className="group-loading:opacity-50">Status</span>
</div>
```

### Custom Utilities

Define reusable utility patterns:

#### Layout Utilities

```css
@utility flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@utility flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@utility absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**Usage:**

```tsx
<div className="flex-center min-h-screen">
  <div className="absolute-center w-full max-w-md">Centered modal</div>
</div>
```

#### Truncation Utilities

```css
@utility line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

@utility line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

@utility line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
```

#### Visual Effects Utilities

```css
@utility glass-morphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@utility text-gradient-primary {
  background: linear-gradient(135deg, var(--purple-500), var(--purple-700));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Container Queries

Enable component-based responsive design:

```css
/* globals.css */
@layer utilities {
  .container-query {
    container-type: inline-size;
  }
}
```

**Usage:**

```tsx
<div className="container-query">
  <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3">
    {/* Responsive based on container, not viewport */}
  </div>
</div>
```

**Card Example:**

```tsx
<Card className="container-query">
  <div className="flex flex-col @md:flex-row @md:items-center">
    <Avatar className="@md:mr-4" />
    <div className="@md:flex-1">
      <h3>User Name</h3>
      <p className="hidden @sm:block">Description</p>
    </div>
  </div>
</Card>
```

### Advanced Variant Composition

Combine multiple variants for complex states:

```css
@custom-variant group-hover-focus (
  .group:is(:hover, :focus-visible) &
);

@custom-variant peer-checked-disabled (
  .peer:is(:checked:disabled) ~ &
);
```

**Usage:**

```tsx
<div className="group">
  <button>Hover or focus</button>
  <div className="group-hover-focus:opacity-100 opacity-0 transition-opacity">
    Tooltip
  </div>
</div>
```

### CSS Nesting Patterns

Leverage native CSS nesting in Tailwind 4:

```css
@layer components {
  .card {
    @apply rounded-lg border bg-white p-6 shadow;

    & .card-header {
      @apply mb-4 border-b pb-4;
    }

    & .card-title {
      @apply text-xl font-semibold;
    }

    & .card-footer {
      @apply mt-4 border-t pt-4;

      & button {
        @apply mr-2;

        &:last-child {
          @apply mr-0;
        }
      }
    }
  }
}
```

### Theme Function Usage

Access theme values in custom CSS:

```css
@utility custom-shadow {
  box-shadow:
    0 0 0 1px theme('colors.border'),
    0 4px 6px -1px theme('colors.black / 10%'),
    0 2px 4px -2px theme('colors.black / 5%');
}

@utility brand-gradient {
  background: linear-gradient(
    135deg,
    theme('colors.primary.500'),
    theme('colors.secondary.500')
  );
}
```

### Arbitrary Properties with Theme

```tsx
<div className="[background:linear-gradient(135deg,theme(colors.primary.500),theme(colors.secondary.500))] [box-shadow:0_4px_6px_-1px_theme(colors.black/10%)]">
  Custom gradient and shadow
</div>
```

### Plugin Integration Best Practices

```css
/* globals.css */
@import 'tailwindcss';

/* Animation library */
@import 'tw-animate-css';

/* Custom plugins */
@import '@tailwindcss/forms';
@import '@tailwindcss/typography';
@import '@tailwindcss/container-queries';

/* Custom variants */
@custom-variant dark (&:is(.dark *));
@custom-variant motion-safe (@media (prefers-reduced-motion: no-preference));

/* Theme configuration */
@theme inline {
  /* ... */
}
```

**Key Principles:**

- Import order matters: core first, plugins second, custom last
- Use `@custom-variant` for reusable state patterns
- Prefer `@utility` over `@layer utilities` for single-purpose utilities
- Leverage theme functions for consistency
- Document all custom variants and utilities

## Design Token System

### Color Palette

Sazonia uses a semantic color system with a 50-900 scale:

#### Primary Colors (Purple - Brand)

```css
--purple-50: #f9f5ff;
--purple-100: #f1e5ff;
--purple-200: #dfc7ff;
--purple-300: #bf8fff;
--purple-400: #a057ff;
--purple-500: #6400e6; /* Base brand color */
--purple-600: #5b00d1;
--purple-700: #5000b8;
--purple-800: #3e008f;
--purple-900: #330075;
```

#### Secondary Colors (Orange-Red - Accent)

```css
--orange-red-50: #fff1eb;
--orange-red-100: #fedfd2;
--orange-red-200: #fdc2aa;
--orange-red-300: #fca17d;
--orange-red-400: #fb8456;
--orange-red-500: #fa652a; /* Base accent color */
--orange-red-600: #e54505;
--orange-red-700: #a93304;
--orange-red-800: #732203;
--orange-red-900: #371001;
```

#### Neutral Colors (Gray)

```css
--gray-50: #f5f5f5;
--gray-100: #f0f0f0;
--gray-200: #d9d9d9;
--gray-300: #bfbfbf;
--gray-400: #8c8c8c;
--gray-500: #595959; /* Base neutral */
--gray-600: #454545;
--gray-700: #262626;
--gray-800: #1f1f1f;
--gray-900: #141414;
```

#### Semantic Colors

```css
/* Success (Green) */
--green-500: #23ad0e;

/* Destructive/Error (Red) */
--red-500: #e60000;

/* Warning (Orange) */
--orange-500: #f27b0c;

/* Info (Blue) */
--blue-500: #006ae6;
```

### Semantic Token Mapping

Map raw colors to semantic intents:

```css
@theme inline {
  /* PRIMARY - Purple */
  --color-primary-50: var(--purple-50);
  --color-primary-100: var(--purple-100);
  --color-primary-200: var(--purple-200);
  --color-primary-300: var(--purple-300);
  --color-primary-400: var(--purple-400);
  --color-primary-500: var(--purple-500);
  --color-primary-600: var(--purple-600);
  --color-primary-700: var(--purple-700);
  --color-primary-800: var(--purple-800);
  --color-primary-900: var(--purple-900);

  /* SECONDARY - Orange-red */
  --color-secondary-50: var(--orange-red-50);
  --color-secondary-500: var(--orange-red-500);
  /* ... */

  /* NEUTRAL - Gray */
  --color-neutral-50: var(--gray-50);
  --color-neutral-500: var(--gray-500);
  /* ... */

  /* DESTRUCTIVE - Red */
  --color-destructive-50: var(--red-50);
  --color-destructive-500: var(--red-500);
  /* ... */

  /* SUCCESS - Green */
  --color-success-50: var(--green-50);
  --color-success-500: var(--green-500);
  /* ... */

  /* WARNING - Orange */
  --color-warning-50: var(--orange-50);
  --color-warning-500: var(--orange-500);
  /* ... */

  /* INFO - Blue */
  --color-info-50: var(--blue-50);
  --color-info-500: var(--blue-500);
  /* ... */
}
```

**Key principles:**

- Never use raw color variables (`--purple-500`) directly in code
- Always use semantic tokens (`--color-primary-500`)
- Allows rebranding by changing color mappings
- Provides consistent intent-based naming

### Using Semantic Colors

```tsx
// ✅ CORRECT - Use semantic color classes
<div className="bg-primary-500 text-white">Primary</div>
<div className="bg-secondary-500 text-white">Secondary</div>
<div className="bg-neutral-100 text-neutral-700">Neutral</div>
<div className="bg-destructive-500 text-white">Error</div>
<div className="bg-success-500 text-white">Success</div>

// ❌ WRONG - Don't use raw Tailwind colors
<div className="bg-purple-500">Primary</div>
<div className="bg-orange-500">Secondary</div>
<div className="bg-gray-100">Neutral</div>
```

### Color Usage Guidelines

**Primary (Purple)**

- Primary actions (main CTAs, links)
- Brand elements (logo, headers)
- Focus states

**Secondary (Orange-red)**

- Secondary actions
- Accent elements
- Highlights

**Neutral (Gray)**

- Backgrounds
- Borders
- Text (non-interactive)
- Disabled states

**Destructive (Red)**

- Error messages
- Delete actions
- Warnings of permanent actions

**Success (Green)**

- Success messages
- Completed states
- Positive actions

**Warning (Orange)**

- Warning messages
- Caution states
- Non-critical alerts

**Info (Blue)**

- Informational messages
- Help text
- Tips and guides

## State-Based Color Progression

Use the color scale for interactive states:

```tsx
// Button states
<button className="
  bg-primary-500           // Base state
  hover:bg-primary-700     // Hover (darker)
  active:bg-primary-900    // Active/pressed (darkest)
  disabled:bg-neutral-100  // Disabled (light gray)
  disabled:text-neutral-300
">
  Click me
</button>

// Subtle variant states
<button className="
  bg-primary-50            // Base (very light)
  hover:bg-primary-100     // Hover (light)
  active:bg-primary-200    // Active (medium light)
">
  Subtle button
</button>
```

**State progression:**

- **Base:** `500` (or `50` for subtle)
- **Hover:** `700` (or `100` for subtle)
- **Active:** `900` (or `200` for subtle)
- **Disabled:** `neutral-100` background, `neutral-300` text
- **Focus:** Ring with `ring-primary`

## System Colors

Special tokens for common UI elements:

```css
:root {
  --foreground: var(--gray-700); /* Main text color */
  --muted-foreground: var(--gray-400); /* Secondary text */
  --background: var(--white); /* Page background */
  --border: var(--gray-200); /* Default borders */
  --input: var(--color-neutral-200); /* Form inputs */
}
```

**Usage:**

```tsx
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">Secondary text</p>
  <div className="border-border border">Bordered box</div>
</div>
```

## Dark Mode

**Note:** Sazonia does not currently require dark mode support. The design system uses light mode exclusively.

If dark mode is needed in the future, the infrastructure is in place:

```css
/* globals.css */
@custom-variant dark (&:is(.dark *));

.dark {
  --foreground: var(--white);
  --background: var(--black);
  --muted-foreground: var(--gray-600);
  --border: var(--gray-600);
  --input: var(--color-neutral-700);
}
```

For now, focus on semantic color tokens that work in light mode.

## Typography System

### Font Configuration

```typescript
// src/app/layout.tsx
import { Rubik } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={rubik.className}>
        {children}
      </body>
    </html>
  );
}
```

### Text Scales

Use Tailwind's default text sizes:

- `text-xs` - 0.75rem (12px)
- `text-sm` - 0.875rem (14px)
- `text-base` - 1rem (16px) - Default
- `text-lg` - 1.125rem (18px)
- `text-xl` - 1.25rem (20px)
- `text-2xl` - 1.5rem (24px)
- `text-3xl` - 1.875rem (30px)
- `text-4xl` - 2.25rem (36px)

### Font Weights

- `font-normal` - 400 (body text)
- `font-medium` - 500 (emphasis)
- `font-bold` - 700 (headings)

### Typography Components

Use Text component for consistent typography:

```tsx
import { Text } from "@/components/ui/text";

<Text as="h1">Heading 1</Text>
<Text as="h2">Heading 2</Text>
<Text as="p">Paragraph</Text>
<Text as="span">Inline text</Text>
```

**Text component classes:**

```typescript
{
  h1: "text-4xl leading-tight font-bold text-foreground",
  h2: "text-3xl leading-snug font-semibold text-foreground",
  h3: "text-2xl leading-snug font-semibold text-foreground",
  h4: "text-xl leading-snug font-medium text-foreground",
  h5: "text-lg leading-snug font-medium text-foreground",
  h6: "text-base leading-snug font-medium text-foreground",
  p: "text-base leading-relaxed text-foreground",
}
```

## Spacing System

Use Tailwind's default spacing scale (based on 0.25rem/4px):

```tsx
// Padding
<div className="p-4">   {/* 1rem = 16px */}
<div className="px-6">  {/* 1.5rem = 24px */}
<div className="py-8">  {/* 2rem = 32px */}

// Margin
<div className="m-2">   {/* 0.5rem = 8px */}
<div className="mt-4">  {/* 1rem = 16px */}
<div className="mb-6">  {/* 1.5rem = 24px */}

// Gap
<div className="gap-2">  {/* 0.5rem = 8px */}
<div className="gap-3">  {/* 0.75rem = 12px */}
```

**Common spacing values:**

- `0` - 0px
- `1` - 0.25rem (4px)
- `2` - 0.5rem (8px)
- `3` - 0.75rem (12px)
- `4` - 1rem (16px)
- `6` - 1.5rem (24px)
- `8` - 2rem (32px)
- `12` - 3rem (48px)

## Performance & Optimization

### CSS Bundle Size Strategy

#### Production Build Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },
};

export default config;
```

#### CSS Layer Organization

Organize CSS layers for optimal cascade and specificity:

```css
/* globals.css */
@import 'tailwindcss';

/* Define layer order explicitly */
@layer base, components, utilities;

@layer base {
  /* Global resets and defaults */
  * {
    @apply border-border outline-ring/50;
  }

  html {
    @apply border-primary bg-primary border-b-6;
  }

  body {
    @apply min-h-screen bg-background text-foreground;
  }
}

@layer components {
  /* Component-specific styles that should override base but not utilities */
  .card {
    @apply rounded-lg border bg-white p-6 shadow;
  }

  .btn {
    @apply inline-flex items-center justify-center rounded-lg px-5 py-3;
  }
}

@layer utilities {
  /* Custom utilities that should have highest priority */
  .px-edge-to-edge {
    @apply px-4 sm:px-6 lg:px-8;
  }
}
```

**Key Principles:**

- Base layer: Global styles, resets, element defaults
- Components layer: Reusable component patterns
- Utilities layer: Single-purpose utility classes (highest specificity)

### Critical CSS Extraction

#### Above-the-Fold Optimization

Identify critical CSS for initial render:

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Critical CSS for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Only styles needed for initial paint */
              .hero { /* ... */ }
              .nav { /* ... */ }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Automated Critical CSS:**

Use build-time extraction for large projects:

```bash
# Install critical CSS tool
npm install -D critters
```

```typescript
// next.config.ts
const config: NextConfig = {
  experimental: {
    optimizeCss: true,
    craCompat: true, // Enable critical CSS extraction
  },
};
```

### CSS Purging & Tree Shaking

#### Automatic Purging

Next.js 15 automatically purges unused CSS in production. Verify purging:

```bash
# Build production bundle
npm run build

# Analyze CSS size
npx @next/bundle-analyzer
```

#### Manual Purge Configuration

For complex patterns, configure content sources:

```css
/* globals.css - Document content sources for purging */

/*
  Tailwind scans these patterns for classes:
  - src/app/**/*.{ts,tsx}
  - src/ui/**/*.{ts,tsx}
  - src/stories/**/*.{ts,tsx}
*/

@import "tailwindcss";
```

**Safelist Dynamic Classes:**

```typescript
// For dynamic class generation
const intentClasses = {
  primary: 'bg-primary-500 text-white',
  secondary: 'bg-secondary-500 text-white',
  // These classes will be preserved in production
};
```

### Font Optimization

#### Next.js Font Loading

```typescript
// app/layout.tsx
import { Rubik } from 'next/font/google';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap', // FOIT prevention
  preload: true,
  adjustFontFallback: true, // Reduce layout shift
  fallback: ['system-ui', 'arial'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={rubik.className}>
      <body>{children}</body>
    </html>
  );
}
```

#### Font Subsetting

Load only required character sets:

```typescript
const rubik = Rubik({
  subsets: ['latin'], // Only Latin characters (reduce bundle by ~70%)
  // Add more subsets only if needed:
  // subsets: ['latin', 'latin-ext'] for accented characters
});
```

#### Font Display Strategies

```typescript
// Option 1: swap (RECOMMENDED) - Shows fallback, then swaps to web font
display: 'swap',

// Option 2: optional - Use web font only if cached
display: 'optional',

// Option 3: fallback - Balance between swap and optional
display: 'fallback',
```

**Performance Impact:**

- `swap`: Best for UX, prevents invisible text (FOIT)
- `optional`: Best for performance, avoids layout shift
- `fallback`: Compromise between the two

### Animation Performance

#### GPU-Accelerated Animations

Only animate GPU-accelerated properties:

```tsx
// ✅ GOOD - GPU accelerated
<div className="
  transition-transform
  hover:scale-105
  hover:translate-x-2
">
  Uses transform (GPU)
</div>

// ✅ GOOD - GPU accelerated
<div className="
  transition-opacity
  hover:opacity-75
">
  Uses opacity (GPU)
</div>

// ❌ BAD - Causes repaints
<div className="
  transition-all
  hover:w-64
  hover:h-64
">
  Animating width/height (CPU)
</div>
```

**GPU-Accelerated Properties:**

- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (blur, brightness, etc.)

**Avoid Animating:**

- `width`, `height` (causes layout)
- `margin`, `padding` (causes layout)
- `top`, `left` (use `transform: translate` instead)
- `color`, `background-color` (use opacity overlays instead)

#### Will-Change Optimization

```tsx
// Add will-change for complex animations
<div className="transition-transform [will-change:transform] hover:scale-105">
  Optimized for animation
</div>
```

**Important:** Only use `will-change` on elements that will definitely animate. Remove it after animation completes.

#### Reduced Motion Support

```tsx
<div className="transition-all duration-300 motion-reduce:transition-none motion-reduce:duration-0">
  Respects user preferences
</div>
```

### Performance Budgets

#### CSS Size Budgets

Target CSS sizes for optimal performance:

- **Critical CSS:** < 14KB (gzipped)
- **Total CSS (First Page):** < 50KB (gzipped)
- **Total CSS (Full App):** < 150KB (gzipped)

#### Measuring CSS Size

```bash
# Build production bundle
npm run build

# Check CSS size in build output
# Look for .css files in .next/static/css/
ls -lh .next/static/css/*.css
```

#### Monitoring Performance

```typescript
// Add performance monitoring
export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric);

  // Track CSS load time
  if (metric.name === 'FCP') {
    console.log('First Contentful Paint:', metric.value);
  }
}
```

### Code Splitting Strategies

#### Route-Based Splitting

Next.js automatically code-splits by route:

```typescript
// app/dashboard/page.tsx
// CSS for this page is automatically split
import { DashboardCard } from './dashboard-card';

export default function DashboardPage() {
  return <DashboardCard />;
}
```

#### Component-Based Splitting

Use dynamic imports for heavy components:

```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy component with styles
const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
  loading: () => <Skeleton />,
  ssr: false, // Skip server rendering if not needed
});

export default function AnalyticsPage() {
  return (
    <div>
      <HeavyChart /> {/* Loads CSS only when rendered */}
    </div>
  );
}
```

### CSS-in-JS Performance Considerations

#### When to Use CSS-in-JS

```tsx
// ✅ GOOD - Dynamic styles based on runtime props
const Button = ({ color }: { color: string }) => {
  return (
    <button style={{ backgroundColor: color }} className="rounded-lg px-4 py-2">
      Dynamic color
    </button>
  );
};

// ❌ BAD - Static styles should use Tailwind
const Button = () => {
  return (
    <button style={{ padding: '8px 16px', borderRadius: '8px' }}>
      Use Tailwind instead
    </button>
  );
};
```

**Key Principles:**

- Use Tailwind for static styles
- Use inline styles for truly dynamic values (from database, user input)
- Avoid CSS-in-JS libraries (styled-components, emotion) for static styles

### Third-Party CSS Integration

#### Importing External Stylesheets

```tsx
// app/layout.tsx
import 'external-library/dist/styles.css';
import '@/app/globals.css'; // Import after to allow overrides
```

#### Layer Third-Party CSS

```css
/* globals.css */
@import 'tailwindcss';

@layer vendor {
  /* Import third-party CSS in a separate layer */
  @import 'external-library/dist/styles.css';
}

/* Control cascade order */
@layer vendor, base, components, utilities;
```

### Performance Checklist

Before deploying to production, verify:

- ✅ CSS bundle < 150KB (gzipped)
- ✅ Critical CSS < 14KB (gzipped)
- ✅ Fonts use `display: swap`
- ✅ Animations use GPU-accelerated properties
- ✅ Reduced motion support enabled
- ✅ Unused CSS purged in production build
- ✅ CSS split by route
- ✅ Heavy components lazy loaded
- ✅ Third-party CSS in vendor layer
- ✅ No CSS-in-JS for static styles

### Monitoring & Debugging

#### Browser DevTools

**Check CSS Size:**

1. Open DevTools → Network tab
2. Filter by CSS
3. Check size of loaded stylesheets

**Check Unused CSS:**

1. Open DevTools → Coverage tab
2. Reload page
3. Analyze unused CSS percentage

**Check Animation Performance:**

1. Open DevTools → Performance tab
2. Record animation
3. Look for layout recalculations (should be minimal)

#### Lighthouse Audits

```bash
# Run Lighthouse for performance insights
npx lighthouse http://localhost:3000 --view
```

**Target Metrics:**

- Performance Score: > 90
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## CSS Architecture & Cascade Management

### Cascade Layers Strategy

Tailwind CSS 4 uses cascade layers for predictable specificity:

```css
/* globals.css */
@import 'tailwindcss';

/* Define layer order explicitly */
@layer vendor, base, components, utilities;
```

**Layer Hierarchy (lowest to highest priority):**

1. **vendor** - Third-party CSS
2. **base** - Global resets, element defaults
3. **components** - Reusable component patterns
4. **utilities** - Single-purpose utility classes

#### Vendor Layer

Isolate third-party CSS to prevent conflicts:

```css
@layer vendor {
  /* Import external libraries */
  @import 'external-library/styles.css';
  @import 'another-plugin/theme.css';
}
```

**Why:** Third-party CSS won't override your component or utility styles.

#### Base Layer

Global styles and element defaults:

```css
@layer base {
  /* Global resets */
  * {
    @apply border-border outline-ring/50;
  }

  /* Element defaults */
  html {
    @apply border-primary bg-primary border-b-6;
  }

  body {
    @apply min-h-screen bg-background text-foreground;
  }

  /* Typography defaults */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-bold text-foreground;
  }

  a {
    @apply text-primary-500 hover:underline;
  }

  /* Form defaults */
  button {
    @apply cursor-pointer;
  }

  input,
  textarea,
  select {
    @apply border-input;
  }
}
```

#### Components Layer

Reusable component patterns that need consistent styling:

```css
@layer components {
  /* Card pattern */
  .card {
    @apply rounded-lg border bg-white p-6 shadow;

    & .card-header {
      @apply mb-4 border-b pb-4;
    }

    & .card-footer {
      @apply mt-4 border-t pt-4;
    }
  }

  /* Badge pattern */
  .badge {
    @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium;

    &.badge-primary {
      @apply bg-primary-100 text-primary-700;
    }

    &.badge-secondary {
      @apply bg-secondary-100 text-secondary-700;
    }
  }

  /* Alert pattern */
  .alert {
    @apply rounded-lg border p-4;

    &.alert-success {
      @apply border-success-500 bg-success-50 text-success-700;
    }

    &.alert-error {
      @apply border-destructive-500 bg-destructive-50 text-destructive-700;
    }
  }
}
```

**When to use components layer:**

- ✅ Patterns used in 3+ places
- ✅ Complex multi-class combinations
- ✅ Semantic patterns (`.card`, `.alert`)
- ❌ Single-use patterns (use utilities)
- ❌ Simple utilities (use utilities layer)

#### Utilities Layer

Single-purpose utility classes:

```css
@layer utilities {
  /* Layout utilities */
  .flex-center {
    @apply flex items-center justify-center;
  }

  .flex-between {
    @apply flex items-center justify-between;
  }

  /* Spacing utilities */
  .px-edge-to-edge {
    @apply px-4 sm:px-6 lg:px-8;
  }

  /* Visual utilities */
  .glass-morphism {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}
```

### Specificity Management

#### Utility-First Approach

Always prefer utilities over custom CSS:

```tsx
// ✅ GOOD - Utilities
<div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow">
  Content
</div>

// ❌ BAD - Custom CSS
<div className="my-custom-card">
  Content
</div>

/* styles.css */
.my-custom-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-radius: 0.5rem;
  background: white;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

#### When to Use Custom CSS

Only create custom CSS when:

1. **Complex, multi-element patterns**

   ```css
   .card {
     @apply rounded-lg border bg-white p-6;

     & .card-header {
       @apply mb-4 border-b pb-4;
     }

     & .card-body {
       @apply space-y-2;
     }

     & .card-footer {
       @apply mt-4 flex justify-end gap-2;
     }
   }
   ```

2. **Third-party library overrides**

   ```css
   @layer components {
     /* Override Radix Dialog */
     [data-sonner-toaster] {
       /* ... custom styles ... */
     }
   }
   ```

3. **Complex animations or pseudo-elements**
   ```css
   @layer components {
     .loading-spinner::after {
       content: '';
       display: block;
       width: 20px;
       height: 20px;
       border: 2px solid currentColor;
       border-top-color: transparent;
       border-radius: 50%;
       animation: spin 1s linear infinite;
     }
   }
   ```

#### Avoiding Specificity Wars

```tsx
// ✅ GOOD - Utilities win with cascade layers
<div className="card bg-primary-50">
  {/* bg-primary-50 overrides .card bg-white */}
</div>

// ❌ BAD - Specificity conflict
<div className="my-custom-card bg-primary-50">
  {/* Might not work if .my-custom-card has higher specificity */}
</div>
```

**Key principle:** Utilities in the `utilities` layer always win over components layer.

### Custom Layer Creation

Create custom layers for specific needs:

```css
@import 'tailwindcss';

/* Define custom layers */
@layer vendor, base, layouts, components, utilities, overrides;

@layer layouts {
  /* Layout-specific patterns */
  .page-container {
    @apply px-edge-to-edge mx-auto max-w-7xl;
  }

  .sidebar-layout {
    @apply grid gap-6 lg:grid-cols-[250px_1fr];
  }
}

@layer overrides {
  /* Final overrides (use sparingly) */
  .force-visible {
    display: block !important;
  }
}
```

### Nesting Best Practices

Tailwind CSS 4 supports native CSS nesting:

```css
@layer components {
  .card {
    @apply rounded-lg border bg-white p-6;

    /* Nested selectors */
    & .card-header {
      @apply mb-4 border-b pb-4;

      /* Further nesting */
      & h2 {
        @apply text-xl font-semibold;
      }
    }

    /* Pseudo-classes */
    &:hover {
      @apply shadow-lg;
    }

    /* Pseudo-elements */
    &::before {
      content: '';
      @apply from-primary-50 absolute inset-0 -z-10 bg-gradient-to-br to-transparent;
    }

    /* Modifier classes */
    &.card-elevated {
      @apply shadow-2xl;
    }

    /* State-based nesting */
    &[data-state='loading'] {
      @apply pointer-events-none opacity-50;
    }
  }
}
```

**Nesting Guidelines:**

- Max 3 levels deep
- Prefer flat structure when possible
- Use nesting for element relationships, not just convenience

### Cascade Layer Debugging

Use browser DevTools to inspect layer order:

```css
/* Add this temporarily to see layer application */
@layer vendor {
  * {
    outline: 1px solid blue;
  }
}

@layer base {
  * {
    outline: 1px solid green;
  }
}

@layer components {
  * {
    outline: 1px solid yellow;
  }
}

@layer utilities {
  * {
    outline: 1px solid red;
  }
}
```

### Architecture Anti-Patterns

#### ❌ Don't Override Tailwind Defaults Globally

```css
/* BAD - Breaks utility classes */
@layer base {
  button {
    padding: 1rem; /* Now px-4 won't work */
  }
}
```

**Fix:** Use component layer for specific patterns:

```css
@layer components {
  .btn-default {
    @apply px-4 py-2;
  }
}
```

#### ❌ Don't Use `!important` in Utilities

```css
/* BAD - Defeats cascade layers */
@layer utilities {
  .force-visible {
    display: block !important;
  }
}
```

**Fix:** Use higher-priority layer or inline styles:

```tsx
<div style={{ display: 'block' }}>Always visible</div>
```

#### ❌ Don't Mix Inline Styles with Utilities

```tsx
// BAD - Confusing and unmaintainable
<div className="flex items-center" style={{ justifyContent: 'center' }}>
  Mixed approaches
</div>
```

**Fix:** Choose one approach:

```tsx
<div className="flex items-center justify-center">Utilities only</div>
```

### Migration Path for Legacy CSS

If migrating from custom CSS to Tailwind:

1. **Audit existing styles**

   ```bash
   # Find all custom CSS
   find src -name "*.css" -not -path "*/node_modules/*"
   ```

2. **Move to components layer**

   ```css
   @layer components {
     /* Existing custom CSS patterns */
     .legacy-card {
       /* ... */
     }
   }
   ```

3. **Gradually replace with utilities**

   ```tsx
   // Before
   <div className="legacy-card">...</div>

   // After
   <div className="rounded-lg border bg-white p-6 shadow">...</div>
   ```

4. **Remove custom CSS when fully migrated**

## Responsive Design

Use mobile-first breakpoints:

```tsx
<div className="// Mobile: 1rem // Small: 1.5rem // Large: 2rem px-4 sm:px-6 lg:px-8">
  Responsive padding
</div>
```

**Breakpoints:**

- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px
- `2xl:` - 1536px

### Edge-to-Edge Utility

Custom utility for consistent horizontal padding:

```css
@layer utilities {
  .px-edge-to-edge {
    @apply px-4 sm:px-6 lg:px-8;
  }
}
```

**Usage:**

```tsx
<div className="px-edge-to-edge">Responsive horizontal padding</div>
```

## Border Radius

Use Tailwind's default border radius scale:

```tsx
<div className="rounded">     {/* 0.25rem = 4px */}
<div className="rounded-md">  {/* 0.375rem = 6px */}
<div className="rounded-lg">  {/* 0.5rem = 8px */}
<div className="rounded-xl">  {/* 0.75rem = 12px */}
<div className="rounded-full"> {/* 9999px - Circle */}
```

## Shadows

Use Tailwind's default shadow scale:

```tsx
<div className="shadow-sm">   {/* Subtle */}
<div className="shadow">      {/* Default */}
<div className="shadow-md">   {/* Medium */}
<div className="shadow-lg">   {/* Large */}
```

## Custom Utilities

### Scrollbar Hidden

Hide scrollbar while keeping scrolling:

```css
@utility scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
}
```

**Usage:**

```tsx
<div className="scrollbar-hidden overflow-x-auto">
  Content with hidden scrollbar
</div>
```

## Advanced Animation Patterns

### Animation Architecture

Sazonia uses a layered animation system:

1. **Micro-animations** - Single-element, single-property (button hover, icon pop)
2. **Choreographed animations** - Multiple elements, sequential (list stagger, card reveal)
3. **State transitions** - Complex multi-step animations (modal open/close, page transitions)
4. **Gesture-driven** - User interaction animations (drag, swipe, scroll-triggered)

### Basic Animations (Micro)

#### Single Property Animations

```tsx
// Hover scale
<button className="
  transition-transform
  duration-200
  hover:scale-105
  active:scale-95
">
  Hover me
</button>

// Fade in/out
<div className="
  transition-opacity
  duration-300
  opacity-0
  data-[visible=true]:opacity-100
">
  Fade content
</div>
```

#### Custom Keyframe Animations

```css
/* globals.css */
@theme inline {
  --animate-like-pop: like-pop 0.3s ease-in-out;
  --animate-slide-up: slide-up 0.4s ease-out;
  --animate-shake: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);

  @keyframes like-pop {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.15);
    }
  }

  @keyframes slide-up {
    0% {
      transform: translateY(20px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-10px);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateX(10px);
    }
  }
}
```

**Usage:**

```tsx
<button className="animate-[like-pop]">Like</button>
<div className="animate-[slide-up]">Slide up</div>
<form className="data-[error=true]:animate-[shake]">Form</form>
```

### Choreographed Animations

#### Staggered List Animations

```tsx
// Parent container
<div className="space-y-2">
  {items.map((item, index) => (
    <div
      key={item.id}
      className="animate-[slide-up] opacity-0"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {item.name}
    </div>
  ))}
</div>
```

**Custom Stagger Utility:**

```css
@layer utilities {
  .stagger-children > * {
    animation: slide-up 0.4s ease-out forwards;
    opacity: 0;
  }

  .stagger-children > *:nth-child(1) {
    animation-delay: 0ms;
  }
  .stagger-children > *:nth-child(2) {
    animation-delay: 50ms;
  }
  .stagger-children > *:nth-child(3) {
    animation-delay: 100ms;
  }
  .stagger-children > *:nth-child(4) {
    animation-delay: 150ms;
  }
  .stagger-children > *:nth-child(5) {
    animation-delay: 200ms;
  }
  /* ... up to 20 items */
}
```

**Usage:**

```tsx
<ul className="stagger-children">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

#### Multi-Element Choreography

```tsx
// Card reveal with multiple elements
<div
  data-state={isOpen ? 'open' : 'closed'}
  className="overflow-hidden transition-all duration-500 data-[state=closed]:max-h-0 data-[state=open]:max-h-96"
>
  {/* Header - enters first */}
  <div className="transition-all delay-100 duration-300 data-[state=closed]:translate-y-4 data-[state=closed]:opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100">
    <h3>Card Title</h3>
  </div>

  {/* Body - enters second */}
  <div className="transition-all delay-200 duration-300 data-[state=closed]:translate-y-4 data-[state=closed]:opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100">
    <p>Card content</p>
  </div>

  {/* Footer - enters last */}
  <div className="transition-all delay-300 duration-300 data-[state=closed]:translate-y-4 data-[state=closed]:opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100">
    <button>Action</button>
  </div>
</div>
```

### State-Based Animation Transitions

#### Modal Open/Close Animation

```tsx
import { Dialog, DialogContent, DialogOverlay } from '@/ui/dialogs';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  {/* Overlay fade */}
  <DialogOverlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-300" />

  {/* Content scale + fade */}
  <DialogContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-300">
    Modal content
  </DialogContent>
</Dialog>;
```

#### Multi-Step Form Transitions

```tsx
const [step, setStep] = useState(1);

<div className="relative overflow-hidden">
  {/* Step 1 */}
  <div
    className={cn(
      'transition-all duration-500',
      step === 1
        ? 'translate-x-0 opacity-100'
        : 'absolute inset-0 translate-x-full opacity-0'
    )}
  >
    Step 1 content
  </div>

  {/* Step 2 */}
  <div
    className={cn(
      'transition-all duration-500',
      step === 2
        ? 'translate-x-0 opacity-100'
        : step > 2
          ? 'absolute inset-0 -translate-x-full opacity-0'
          : 'absolute inset-0 translate-x-full opacity-0'
    )}
  >
    Step 2 content
  </div>

  {/* Step 3 */}
  <div
    className={cn(
      'transition-all duration-500',
      step === 3
        ? 'translate-x-0 opacity-100'
        : 'absolute inset-0 -translate-x-full opacity-0'
    )}
  >
    Step 3 content
  </div>
</div>;
```

### Gesture-Driven Animations

#### Drag-to-Dismiss

```tsx
'use client';

import { useState } from 'react';

export function DismissibleCard({ children }: { children: React.ReactNode }) {
  const [isDragging, setIsDragging] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  return (
    <div
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => {
        setIsDragging(false);
        if (Math.abs(translateX) > 100) {
          // Dismiss
        } else {
          setTranslateX(0);
        }
      }}
      className={cn(
        'transition-transform',
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      )}
      style={{ transform: `translateX(${translateX}px)` }}
    >
      {children}
    </div>
  );
}
```

#### Scroll-Triggered Animations

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export function RevealOnScroll({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      )}
    >
      {children}
    </div>
  );
}
```

### Animation Composability with CVA

Create reusable animation variants:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const animatedCardVariants = cva(
  "transition-all duration-300",
  {
    variants: {
      animation: {
        fade: "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
        slide: "data-[state=open]:translate-y-0 data-[state=closed]:translate-y-4",
        scale: "data-[state=open]:scale-100 data-[state=closed]:scale-95",
        slideScale: "data-[state=open]:translate-y-0 data-[state=open]:scale-100 data-[state=closed]:translate-y-4 data-[state=closed]:scale-95",
      },
      timing: {
        fast: "duration-150",
        normal: "duration-300",
        slow: "duration-500",
      },
      easing: {
        linear: "ease-linear",
        in: "ease-in",
        out: "ease-out",
        inOut: "ease-in-out",
        bounce: "ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
      },
    },
    defaultVariants: {
      animation: "fade",
      timing: "normal",
      easing: "out",
    },
  }
);

export type AnimatedCardProps = VariantProps<typeof animatedCardVariants> & {
  state: 'open' | 'closed';
  children: React.ReactNode;
};

export function AnimatedCard({ animation, timing, easing, state, children }: AnimatedCardProps) {
  return (
    <div
      data-state={state}
      className={cn(animatedCardVariants({ animation, timing, easing }))}
    >
      {children}
    </div>
  );
}
```

**Usage:**

```tsx
<AnimatedCard
  state={isOpen ? 'open' : 'closed'}
  animation="slideScale"
  timing="slow"
  easing="bounce"
>
  Animated content
</AnimatedCard>
```

### Accessibility: Reduced Motion

**Always respect user preferences:**

```css
/* globals.css */
@custom-variant motion-safe (@media (prefers-reduced-motion: no-preference));
@custom-variant motion-reduce (@media (prefers-reduced-motion: reduce));
```

**Usage:**

```tsx
<div className="motion-safe:animate-[slide-up] motion-safe:transition-all motion-safe:duration-300 motion-reduce:animate-none motion-reduce:transition-none">
  Respects user motion preferences
</div>
```

**Global Motion Reduction:**

```css
@layer base {
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

### Animation Performance Best Practices

1. **Use GPU-accelerated properties only**
   - ✅ `transform`, `opacity`, `filter`
   - ❌ `width`, `height`, `top`, `left`, `margin`

2. **Add `will-change` for complex animations**

   ```tsx
   <div className="transition-transform [will-change:transform]">
     Animated element
   </div>
   ```

3. **Remove animations on low-end devices**

   ```tsx
   const prefersReducedMotion = window.matchMedia(
     '(prefers-reduced-motion: reduce)'
   ).matches;
   const isLowEndDevice = navigator.hardwareConcurrency <= 4;

   const shouldAnimate = !prefersReducedMotion && !isLowEndDevice;
   ```

4. **Use `requestAnimationFrame` for JavaScript animations**

   ```typescript
   function animate() {
     // Update animation
     requestAnimationFrame(animate);
   }
   requestAnimationFrame(animate);
   ```

5. **Debounce scroll-triggered animations**
   ```typescript
   const handleScroll = debounce(() => {
     // Trigger animation
   }, 100);
   ```

### Animation Library Integration (tw-animate-css)

```tsx
// Fade animations
<div className="animate-fadeIn">Fade in</div>
<div className="animate-fadeOut">Fade out</div>
<div className="animate-fadeInUp">Fade in from bottom</div>
<div className="animate-fadeInDown">Fade in from top</div>

// Slide animations
<div className="animate-slideInLeft">Slide from left</div>
<div className="animate-slideInRight">Slide from right</div>
<div className="animate-slideInUp">Slide from bottom</div>
<div className="animate-slideInDown">Slide from top</div>

// Zoom animations
<div className="animate-zoomIn">Zoom in</div>
<div className="animate-zoomOut">Zoom out</div>

// Bounce animations
<div className="animate-bounce">Bounce</div>
<div className="animate-bounceIn">Bounce in</div>

// Rotate animations
<div className="animate-rotateIn">Rotate in</div>
<div className="animate-rotateOut">Rotate out</div>
```

**Customize Duration:**

```tsx
<div className="animate-fadeIn duration-1000">Slow fade</div>
<div className="animate-slideInLeft duration-300">Fast slide</div>
```

**Animation Delays:**

```tsx
<div className="animate-fadeIn delay-100">Delayed fade</div>
<div className="animate-fadeIn delay-200">More delayed</div>
```

### Common Animation Patterns

#### Loading States

```tsx
<button disabled={isLoading} className="relative disabled:opacity-50">
  <span className={cn(isLoading && 'invisible')}>Submit</span>

  {isLoading && (
    <span className="absolute inset-0 flex items-center justify-center">
      <svg className="size-5 animate-spin" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </span>
  )}
</button>
```

#### Skeleton Loading

```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 w-3/4 rounded bg-neutral-200" />
  <div className="h-4 w-1/2 rounded bg-neutral-200" />
  <div className="h-4 w-5/6 rounded bg-neutral-200" />
</div>
```

#### Toast Notifications

```tsx
// Using Sonner with custom animations
import { toast } from 'sonner';

toast.success('Item added to cart', {
  className: 'animate-[slide-up]',
  duration: 3000,
});
```

#### Page Transitions

```tsx
// app/template.tsx (applies to all routes)
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-[fade-in] duration-300">{children}</div>;
}
```

## Focus States

Always include focus states for accessibility:

```tsx
<button className="focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
  Accessible button
</button>
```

**Key principles:**

- Use `focus-visible:` instead of `focus:` to avoid mouse focus styling
- Ring color: `ring-ring` (uses `--color-ring` = primary)
- Include `outline-none` to remove default outline
- Add ring offset for better visibility

## Hover States

Smooth transitions on interactive elements:

```tsx
<button className="hover:bg-primary-700 transition-all hover:scale-105">
  Hover me
</button>
```

## Disabled States

Consistent disabled styling:

```tsx
<button className="disabled:pointer-events-none disabled:bg-neutral-100 disabled:text-neutral-300">
  Disabled button
</button>
```

## Selection Styling

Custom text selection color:

```css
@layer base {
  ::selection {
    @apply bg-primary-100;
  }
}
```

## Toast Notifications (Sonner)

Custom toast styling using data attributes:

```css
[data-sonner-toaster] {
  [data-sonner-toast][data-styled='true'] {
    --normal-bg: var(--color-white);
    --normal-text: var(--color-black);
    --normal-border: var(--color-border);

    &[data-type='success'] {
      --normal-bg: var(--color-success-50);
      --normal-text: var(--color-success-foreground);
      --normal-border: var(--color-success-foreground);
    }

    &[data-type='error'] {
      --normal-bg: var(--color-destructive-50);
      --normal-text: var(--color-destructive-foreground);
      --normal-border: var(--color-destructive-foreground);
    }

    &[data-type='warning'] {
      --normal-bg: var(--color-warning-50);
      --normal-text: var(--color-warning-foreground);
      --normal-border: var(--color-warning-foreground);
    }

    &[data-type='info'] {
      --normal-bg: var(--color-info-50);
      --normal-text: var(--color-info-foreground);
      --normal-border: var(--color-info-foreground);
    }
  }
}
```

## Base Layer Styles

Global base styles applied to all elements:

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  html {
    @apply border-primary bg-primary border-b-6;
  }

  body {
    @apply min-h-screen bg-background text-foreground;
  }
}
```

**Key principles:**

- All elements get default border and outline colors
- HTML has brand-colored bottom border
- Body has minimum full-screen height
- Background and text use semantic tokens

## Utility Composition with cn()

Use `cn()` utility for conditional classes:

```typescript
import { cn } from "@/lib/utils";

export function Button({ className, variant, isActive, ...props }) {
  return (
    <button
      className={cn(
        // Base classes
        "rounded-lg px-4 py-2",
        // Variant classes
        variant === "primary" && "bg-primary-500 text-white",
        variant === "secondary" && "bg-secondary-500 text-white",
        // Conditional classes
        isActive && "ring-2 ring-primary",
        // Allow overrides
        className
      )}
      {...props}
    />
  );
}
```

**Key principles:**

- Import `cn` from `@/lib/utils`
- Base classes first
- Variant/conditional classes next
- User className last (allows overrides)
- `cn()` merges classes intelligently (via tailwind-merge)

## Class Organization

Order classes for readability:

1. Layout (display, position)
2. Box model (width, height, padding, margin)
3. Typography (font, text)
4. Visual (color, background, border)
5. Effects (shadow, opacity, transform)
6. Interactive (cursor, pointer-events)
7. Pseudo-classes (hover, focus, disabled)
8. Responsive modifiers (sm:, md:, lg:)

```tsx
// ✅ GOOD - Organized
<div className="
  flex items-center justify-between
  w-full px-4 py-2 gap-2
  text-base font-medium
  bg-white border border-gray-200 rounded-lg shadow
  cursor-pointer
  hover:bg-gray-50
  sm:px-6
">

// ❌ BAD - Random order
<div className="
  hover:bg-gray-50 text-base rounded-lg
  w-full sm:px-6 cursor-pointer
  border flex px-4 font-medium
">
```

**Note:** Prettier with `prettier-plugin-tailwindcss` automatically sorts classes for you.

## Container Patterns

### Max-Width Container

```tsx
<div className="px-edge-to-edge container mx-auto max-w-7xl">{/* Content */}</div>
```

### Full-Width with Edge Padding

```tsx
<div className="px-edge-to-edge w-full">{/* Content */}</div>
```

## Grid Layouts

```tsx
// Responsive grid
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {items.map((item) => (
    <div key={item.id}>{item.name}</div>
  ))}
</div>
```

## Flexbox Layouts

```tsx
// Centered content
<div className="flex items-center justify-center min-h-screen">
  <div>Centered content</div>
</div>

// Space between
<div className="flex items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>

// Column stack
<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## Common Patterns

### Card

```tsx
<div className="border-border rounded-lg border bg-white p-6 shadow-sm">
  Card content
</div>
```

### Button

```tsx
<button className="bg-primary-500 hover:bg-primary-700 active:bg-primary-900 focus-visible:ring-ring inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-base font-medium text-white transition-all focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:bg-neutral-100 disabled:text-neutral-300">
  Button
</button>
```

### Input

```tsx
<input className="border-input placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-lg border bg-white px-3 py-2 text-base focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" />
```

## Best Practices

1. **Use semantic color tokens** - Never use raw color classes
2. **Mobile-first responsive** - Start with mobile, add larger breakpoints
3. **Consistent spacing** - Use spacing scale (4, 6, 8, 12)
4. **Focus states** - Always include for accessibility
5. **Transitions** - Add smooth transitions to interactive elements
6. **Composition** - Build complex UIs from simple utility classes
7. **cn() utility** - Use for conditional and merged classes
8. **Prettier plugin** - Let Prettier sort your classes
9. **Custom utilities** - Create reusable utilities for common patterns
10. **Dark mode ready** - Use semantic tokens that work with dark mode
