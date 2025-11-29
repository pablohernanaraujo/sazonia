# Accessibility Patterns

This document outlines accessibility best practices and patterns for sazonia-web, ensuring our application is usable by everyone, including people with disabilities.

## Core Principles

- **Perceivable** - Information and UI must be presentable to users in ways they can perceive
- **Operable** - UI and navigation must be operable by all users
- **Understandable** - Information and UI operation must be understandable
- **Robust** - Content must work with current and future assistive technologies

---

## ARIA Attributes

ARIA (Accessible Rich Internet Applications) attributes provide semantic information to assistive technologies when native HTML semantics are insufficient.

### When to Use ARIA

**Rule #1: No ARIA is better than bad ARIA**

```typescript
// ❌ WRONG - Unnecessary ARIA on semantic HTML
<button role="button" aria-label="Click me">Click me</button>

// ✅ CORRECT - Let semantic HTML do the work
<button>Click me</button>
```

**Use ARIA when:**

- Native HTML semantics don't exist for your use case
- You need to convey dynamic state changes
- You're building custom interactive widgets
- You need to provide additional context not visible on screen

**Don't use ARIA when:**

- Native HTML elements provide the same semantics
- The information is already visible in the UI
- You're duplicating native element behavior

---

### Roles

Roles define what an element is or does. Prefer semantic HTML over ARIA roles.

#### Common ARIA Roles

```typescript
// ❌ AVOID - Use semantic HTML instead
<div role="button" onClick={handleClick}>Click me</div>
<div role="navigation">...</div>
<div role="main">...</div>

// ✅ CORRECT - Semantic HTML
<button onClick={handleClick}>Click me</button>
<nav>...</nav>
<main>...</main>
```

#### When ARIA Roles Are Necessary

**Dialog/Modal:**

```typescript
import * as DialogPrimitive from "@radix-ui/react-dialog";

const DialogContent = forwardRef<...>(({ ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    role="dialog"  // Radix handles this automatically
    aria-modal="true"
    {...props}
  />
));
```

**Tabs:**

```typescript
<div role="tablist" aria-label="Profile sections">
  <button role="tab" aria-selected={activeTab === 'info'} aria-controls="info-panel">
    Info
  </button>
  <button role="tab" aria-selected={activeTab === 'orders'} aria-controls="orders-panel">
    Orders
  </button>
</div>

<div role="tabpanel" id="info-panel" aria-labelledby="info-tab">
  {/* Tab content */}
</div>
```

**Alert/Status:**

```typescript
// Alert for errors (interrupts user)
<div role="alert" className="text-destructive-500">
  {errorMessage}
</div>

// Status for non-critical updates (doesn't interrupt)
<div role="status" aria-live="polite">
  {savedMessage}
</div>
```

**Combobox/Autocomplete:**

```typescript
<div role="combobox" aria-expanded={isOpen} aria-controls="listbox">
  <input
    type="text"
    aria-autocomplete="list"
    aria-controls="listbox"
    aria-activedescendant={activeOptionId}
  />
</div>
<ul role="listbox" id="listbox">
  <li role="option" id="option-1">Option 1</li>
  <li role="option" id="option-2">Option 2</li>
</ul>
```

---

### Labels

Labels provide accessible names for interactive elements.

#### `aria-label`

Use when visible text isn't sufficient or doesn't exist.

```typescript
// Icon-only buttons MUST have aria-label
import { IconButton } from "@/ui/buttons";
import { X } from "@phosphor-icons/react";

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      icon={X}
      onClick={onClick}
      aria-label="Close dialog"  // Required for screen readers
      intent="neutral"
    />
  );
}
```

**Common use cases:**

```typescript
// Navigation icons
<IconButton icon={Home} aria-label="Go to home page" />
<IconButton icon={ShoppingCart} aria-label="View shopping cart" />
<IconButton icon={User} aria-label="View profile" />

// Actions without visible text
<IconButton icon={Share} aria-label="Share this product" />
<IconButton icon={Heart} aria-label="Add to favorites" />
<IconButton icon={Trash} aria-label="Delete item" />

// Close/dismiss buttons
<IconButton icon={X} aria-label="Close notification" />
<IconButton icon={X} aria-label="Dismiss banner" />
```

**When NOT to use aria-label:**

```typescript
// ❌ WRONG - Duplicating visible text
<button aria-label="Submit">Submit</button>

// ✅ CORRECT - Text is already visible
<button>Submit</button>

// ❌ WRONG - Button has visible text
<button aria-label="Click here">
  <span>Submit Form</span>
</button>

// ✅ CORRECT
<button>Submit Form</button>
```

#### `aria-labelledby`

Use to reference existing visible text as the label.

```typescript
<div>
  <h2 id="dialog-title">Confirm Delete</h2>
  <div role="dialog" aria-labelledby="dialog-title">
    {/* Dialog content */}
  </div>
</div>
```

**Form sections:**

```typescript
<section aria-labelledby="shipping-heading">
  <h2 id="shipping-heading">Shipping Information</h2>
  <form>
    {/* Form fields */}
  </form>
</section>
```

#### `aria-describedby`

Use to reference descriptive text that provides additional context.

```typescript
import { Input } from "@/ui/inputs";

export function PasswordInput() {
  return (
    <div>
      <label htmlFor="password">Password</label>
      <Input
        id="password"
        type="password"
        aria-describedby="password-requirements"
      />
      <p id="password-requirements" className="text-sm text-neutral-500">
        Must be at least 8 characters with one number and one special character.
      </p>
    </div>
  );
}
```

**Error messages:**

```typescript
export function InputField({ error, ...props }: InputFieldProps) {
  const errorId = `${props.id}-error`;

  return (
    <div>
      <Input
        {...props}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} className="text-sm text-destructive-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

---

### Descriptions

Provide context and additional information for complex UI elements.

#### Dialog Descriptions

```typescript
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/ui/dialogs";

export function ConfirmDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog>
      <DialogContent>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the product
          from your store.
        </DialogDescription>
        <Button onClick={onConfirm} intent="destructive">
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  );
}
```

**IMPORTANT:** Radix automatically connects `DialogTitle` and `DialogDescription` with proper ARIA attributes. Never omit these components.

#### Form Field Descriptions

```typescript
<div>
  <label htmlFor="email">Email Address</label>
  <Input
    id="email"
    type="email"
    aria-describedby="email-description"
  />
  <p id="email-description" className="text-sm text-neutral-500">
    We'll never share your email with anyone else.
  </p>
</div>
```

---

### States

Communicate dynamic state changes to assistive technologies.

#### `aria-expanded`

For expandable/collapsible UI elements.

```typescript
"use client";

import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";

export function Accordion({ title, children }: AccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="accordion-content"
      >
        {title}
        <CaretDown className={isExpanded ? "rotate-180" : ""} />
      </button>
      <div
        id="accordion-content"
        hidden={!isExpanded}
        role="region"
      >
        {children}
      </div>
    </div>
  );
}
```

**Dropdown menus:**

```typescript
<button
  aria-expanded={isOpen}
  aria-controls="menu"
  aria-haspopup="true"
>
  Menu
</button>
<div id="menu" hidden={!isOpen} role="menu">
  {/* Menu items */}
</div>
```

#### `aria-selected`

For selectable items (tabs, options, etc.).

```typescript
<div role="tablist">
  <button
    role="tab"
    aria-selected={activeTab === 'profile'}
    aria-controls="profile-panel"
    className={activeTab === 'profile' ? 'bg-primary-50' : ''}
  >
    Profile
  </button>
  <button
    role="tab"
    aria-selected={activeTab === 'settings'}
    aria-controls="settings-panel"
    className={activeTab === 'settings' ? 'bg-primary-50' : ''}
  >
    Settings
  </button>
</div>
```

#### `aria-checked`

For custom checkboxes/switches (not needed for native inputs).

```typescript
<button
  role="checkbox"
  aria-checked={isChecked}
  onClick={() => setIsChecked(!isChecked)}
>
  {isChecked ? <CheckSquare /> : <Square />}
  Enable notifications
</button>
```

**Better alternative - use native input:**

```typescript
// ✅ PREFERRED - Native checkbox
<label>
  <input type="checkbox" checked={isChecked} onChange={handleChange} />
  Enable notifications
</label>
```

#### `aria-disabled`

For disabled interactive elements (in addition to `disabled` attribute).

```typescript
import { Button } from "@/ui/buttons";

<Button
  disabled={isLoading}
  aria-disabled={isLoading}
  onClick={handleSubmit}
>
  {isLoading ? "Submitting..." : "Submit"}
</Button>
```

#### `aria-invalid` and `aria-required`

For form validation.

```typescript
<Input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-invalid={!!emailError}
  aria-describedby={emailError ? "email-error" : undefined}
/>
{emailError && (
  <p id="email-error" role="alert" className="text-destructive-500">
    {emailError}
  </p>
)}
```

#### `aria-current`

For indicating the current item in navigation.

```typescript
<nav aria-label="Main navigation">
  <a
    href="/products"
    aria-current={pathname === '/products' ? 'page' : undefined}
    className={pathname === '/products' ? 'font-bold' : ''}
  >
    Products
  </a>
  <a
    href="/about"
    aria-current={pathname === '/about' ? 'page' : undefined}
    className={pathname === '/about' ? 'font-bold' : ''}
  >
    About
  </a>
</nav>
```

---

## Keyboard Navigation

All interactive elements must be keyboard accessible. Users should be able to navigate and use the entire application without a mouse.

### Focus Management

#### Focus Visibility

**CRITICAL:** Never remove focus outlines without providing an alternative.

```typescript
// ❌ WRONG - Removes focus indicators completely
<button className="outline-none focus:outline-none">
  Click me
</button>

// ✅ CORRECT - Custom focus indicator
<button className="focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Click me
</button>

// ✅ CORRECT - Use Tailwind's focus-visible (only shows on keyboard)
<button className="focus-visible:ring-2 focus-visible:ring-primary-500">
  Click me
</button>
```

**Default focus styles in components:**

```typescript
// All interactive components should include focus states
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
  {
    variants: { ... },
  }
);
```

#### Programmatic Focus

**Moving focus to new content:**

```typescript
"use client";

import { useRef, useEffect } from "react";

export function Modal({ isOpen }: { isOpen: boolean }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Move focus to close button when modal opens
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div role="dialog" aria-modal="true">
      <button ref={closeButtonRef} aria-label="Close">
        ×
      </button>
      {/* Modal content */}
    </div>
  );
}
```

**Returning focus after interaction:**

```typescript
export function ConfirmDialog({ isOpen, onClose }: DialogProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    onClose();
    // Return focus to the element that opened the dialog
    triggerRef.current?.focus();
  };

  return (
    <>
      <button ref={triggerRef} onClick={() => setIsOpen(true)}>
        Delete
      </button>
      {isOpen && (
        <Dialog onClose={handleClose}>
          {/* Dialog content */}
        </Dialog>
      )}
    </>
  );
}
```

**Skip focus on non-interactive elements:**

```typescript
// ❌ WRONG - Decorative image is focusable
<img src="/hero.jpg" alt="Hero image" tabIndex={0} />

// ✅ CORRECT - Remove from tab order
<img src="/hero.jpg" alt="" tabIndex={-1} />

// ✅ EVEN BETTER - Decorative images don't need alt
<img src="/hero.jpg" alt="" />
```

---

### Tab Order

Ensure logical tab order matches visual order.

#### Natural Tab Order

**Let DOM order define tab order:**

```typescript
// ✅ CORRECT - Tab order follows visual order
<form>
  <Input id="name" />      {/* Tab order: 1 */}
  <Input id="email" />     {/* Tab order: 2 */}
  <Input id="phone" />     {/* Tab order: 3 */}
  <Button type="submit">Submit</Button>  {/* Tab order: 4 */}
</form>
```

#### Avoid Manual Tab Order

```typescript
// ❌ WRONG - Manual tabindex creates confusion
<form>
  <Input id="email" tabIndex={2} />
  <Input id="name" tabIndex={1} />
  <Input id="phone" tabIndex={3} />
</form>

// ✅ CORRECT - Rearrange DOM order instead
<form>
  <Input id="name" />
  <Input id="email" />
  <Input id="phone" />
</form>
```

#### Remove from Tab Order

Use `tabIndex={-1}` to remove elements from keyboard navigation:

```typescript
// Programmatically focusable but not in tab order
<div tabIndex={-1} ref={containerRef}>
  {content}
</div>

// Decorative interactive elements
<button tabIndex={-1} aria-hidden="true" className="decorative-only">
  ✨
</button>
```

#### Complex Tab Order Example

**Data table with keyboard navigation:**

```typescript
"use client";

import { useRef, type KeyboardEvent } from "react";

export function DataTable({ data }: { data: any[] }) {
  const tableRef = useRef<HTMLTableElement>(null);

  const handleKeyDown = (e: KeyboardEvent, rowIndex: number, colIndex: number) => {
    const table = tableRef.current;
    if (!table) return;

    const rows = table.querySelectorAll('tr');
    const currentRow = rows[rowIndex];
    const cells = currentRow.querySelectorAll('td, th');

    let newRow = rowIndex;
    let newCol = colIndex;

    switch (e.key) {
      case 'ArrowDown':
        newRow = Math.min(rowIndex + 1, rows.length - 1);
        break;
      case 'ArrowUp':
        newRow = Math.max(rowIndex - 1, 0);
        break;
      case 'ArrowRight':
        newCol = Math.min(colIndex + 1, cells.length - 1);
        break;
      case 'ArrowLeft':
        newCol = Math.max(colIndex - 1, 0);
        break;
      default:
        return;
    }

    e.preventDefault();
    const targetCell = rows[newRow].querySelectorAll('td, th')[newCol] as HTMLElement;
    targetCell?.focus();
  };

  return (
    <table ref={tableRef}>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.cells.map((cell: any, colIndex: number) => (
              <td
                key={colIndex}
                tabIndex={rowIndex === 0 && colIndex === 0 ? 0 : -1}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

### Keyboard Shortcuts

Provide keyboard shortcuts for common actions.

#### Common Keyboard Patterns

```typescript
'use client';

import { useEffect } from 'react';

export function SearchShortcut() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearchModal();
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        closeAllModals();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
}
```

**Announce shortcuts to users:**

```typescript
<button aria-label="Search (Ctrl+K)">
  <MagnifyingGlass />
</button>

<button aria-keyshortcuts="Control+K" aria-label="Search">
  <MagnifyingGlass />
</button>
```

#### Common Shortcuts

- **`Escape`** - Close modal/dialog
- **`Enter`** - Activate button/link
- **`Space`** - Activate button/checkbox
- **`Arrow keys`** - Navigate lists/menus/tabs
- **`Home/End`** - Jump to first/last item
- **`Ctrl/Cmd + K`** - Open search
- **`Tab`** - Move focus forward
- **`Shift + Tab`** - Move focus backward

---

### Focus Trapping

Trap focus within modals and dialogs to prevent users from tabbing outside.

**Radix UI handles this automatically:**

```typescript
import { Dialog, DialogContent } from "@/ui/dialogs";

// ✅ Radix automatically traps focus
<Dialog>
  <DialogContent>
    {/* Focus is trapped inside here */}
    <Input />
    <Button>Submit</Button>
  </DialogContent>
</Dialog>
```

**Manual focus trap (avoid if possible):**

```typescript
"use client";

import { useEffect, useRef } from "react";

export function FocusTrap({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown as any);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown as any);
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
```

---

## Screen Reader Support

Make content understandable for screen reader users.

### Semantic HTML

Use semantic HTML elements that convey meaning.

#### Structural Elements

```typescript
// ✅ CORRECT - Semantic structure
<header>
  <nav aria-label="Main navigation">
    <a href="/">Home</a>
    <a href="/products">Products</a>
  </nav>
</header>

<main>
  <article>
    <h1>Product Title</h1>
    <section aria-labelledby="description-heading">
      <h2 id="description-heading">Description</h2>
      <p>Product description...</p>
    </section>
  </article>

  <aside aria-label="Related products">
    <h2>You might also like</h2>
    {/* Related products */}
  </aside>
</main>

<footer>
  <nav aria-label="Footer navigation">
    {/* Footer links */}
  </nav>
</footer>
```

```typescript
// ❌ WRONG - Div soup with no semantics
<div className="header">
  <div className="nav">
    <div className="link">Home</div>
    <div className="link">Products</div>
  </div>
</div>

<div className="main">
  <div className="article">
    <div className="title">Product Title</div>
    <div className="description">Product description...</div>
  </div>
</div>
```

#### Heading Hierarchy

**CRITICAL:** Use proper heading levels (h1-h6) in order.

```typescript
// ✅ CORRECT - Logical heading hierarchy
<article>
  <h1>Product Name</h1>                  {/* Page title */}

  <section>
    <h2>Description</h2>                 {/* Main section */}
    <p>...</p>
  </section>

  <section>
    <h2>Reviews</h2>                     {/* Main section */}
    <div>
      <h3>Customer Review</h3>           {/* Subsection */}
      <p>...</p>
    </div>
  </section>
</article>

// ❌ WRONG - Skipped levels
<h1>Product Name</h1>
<h3>Description</h3>  {/* Skipped h2 */}
<h5>Details</h5>      {/* Skipped h3, h4 */}
```

**Use typography components with semantic headings:**

```typescript
import { Heading1, Heading2, Heading3, BodyMedium } from "@/ui/typography";

<article>
  <Heading1>Product Name</Heading1>

  <section>
    <Heading2>Description</Heading2>
    <BodyMedium>Product description text...</BodyMedium>
  </section>

  <section>
    <Heading2>Reviews</Heading2>
    <Heading3>John Doe</Heading3>
    <BodyMedium>Great product!</BodyMedium>
  </section>
</article>
```

#### Lists

```typescript
// ✅ CORRECT - Semantic lists
<ul>
  <li>Free shipping</li>
  <li>30-day returns</li>
  <li>1-year warranty</li>
</ul>

<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li aria-current="page">T-Shirt</li>
  </ol>
</nav>

// ❌ WRONG - Fake lists
<div>
  <div>• Free shipping</div>
  <div>• 30-day returns</div>
  <div>• 1-year warranty</div>
</div>
```

---

### Live Regions

Announce dynamic content changes to screen readers.

#### `aria-live` Levels

- **`polite`** - Announce when user is idle (preferred)
- **`assertive`** - Announce immediately (use sparingly)
- **`off`** - Don't announce (default)

#### Polite Announcements

```typescript
"use client";

import { useState } from "react";

export function AddToCart({ productId }: { productId: string }) {
  const [status, setStatus] = useState("");

  const handleAddToCart = async () => {
    setStatus("Adding to cart...");
    await addToCart(productId);
    setStatus("Added to cart successfully!");

    // Clear message after 3 seconds
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div>
      <Button onClick={handleAddToCart}>Add to Cart</Button>

      {/* Announced politely to screen readers */}
      <div
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {status}
      </div>
    </div>
  );
}
```

#### Assertive Announcements

Use sparingly for critical errors:

```typescript
export function FormError({ error }: { error: string | null }) {
  if (!error) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="text-destructive-500"
    >
      {error}
    </div>
  );
}
```

#### Loading States

```typescript
export function LoadingSpinner({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading...</span>
      <div className="animate-spin" aria-hidden="true">⏳</div>
    </div>
  );
}
```

---

### Announcements

Screen reader-only announcements for dynamic updates.

#### Screen Reader Only Class

```css
/* Add to globals.css */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

#### Usage Examples

```typescript
// Form submission feedback
<button type="submit">
  Submit
  <span className="sr-only">form</span>
</button>

// Icon with context
<IconButton icon={Heart} intent="primary">
  <span className="sr-only">Add to favorites</span>
</IconButton>

// Dynamic count updates
<button>
  <ShoppingCart />
  <span className="badge">{cartCount}</span>
  <span className="sr-only">{cartCount} items in cart</span>
</button>

// Loading states
<div>
  <Spinner aria-hidden="true" />
  <span className="sr-only">Loading products...</span>
</div>
```

---

### Hidden Content

Control what's hidden from assistive technologies.

#### Visual vs. Assistive Technology Hiding

```typescript
// ✅ Hidden visually AND from screen readers
<div hidden>This is completely hidden</div>
<div className="hidden">This is completely hidden</div>

// ✅ Hidden visually but available to screen readers
<span className="sr-only">Additional context for screen readers</span>

// ✅ Visible but hidden from screen readers
<div aria-hidden="true">Decorative content</div>

// ❌ WRONG - display:none but aria-hidden=false creates confusion
<div style={{ display: 'none' }} aria-hidden="false">
  Conflicting signals
</div>
```

#### Decorative Content

```typescript
// Decorative icons (hidden from screen readers)
<Button>
  Save
  <FloppyDisk aria-hidden="true" />
</Button>

// Decorative images
<img src="/background-pattern.svg" alt="" aria-hidden="true" />

// Decorative separators
<div role="separator" aria-hidden="true" className="border-t" />
```

#### Conditionally Hidden

```typescript
export function Accordion({ isOpen }: { isOpen: boolean }) {
  return (
    <div>
      <button
        aria-expanded={isOpen}
        aria-controls="content"
      >
        Toggle
      </button>

      {/* Use hidden attribute for collapsible content */}
      <div id="content" hidden={!isOpen}>
        Content
      </div>
    </div>
  );
}
```

---

## Color & Contrast

Ensure sufficient color contrast for readability.

### WCAG AA Compliance

**Minimum contrast ratios:**

- **Normal text** (< 24px): 4.5:1
- **Large text** (≥ 24px or ≥ 19px bold): 3:1
- **UI components** (buttons, inputs, etc.): 3:1
- **Non-text** (icons, borders): 3:1

#### Design System Compliance

Our semantic color tokens are WCAG AA compliant:

```typescript
// ✅ COMPLIANT - Primary button
className = 'bg-primary-500 text-white';
// Purple (#6400e6) on white = 6.2:1 ratio ✓

// ✅ COMPLIANT - Secondary button
className = 'bg-secondary-500 text-white';
// Orange-red (#fa652a) on white = 4.8:1 ratio ✓

// ✅ COMPLIANT - Destructive button
className = 'bg-destructive-500 text-white';
// Red (#e60000) on white = 5.5:1 ratio ✓

// ❌ NON-COMPLIANT - Custom colors
className = 'bg-yellow-200 text-white';
// Fails contrast requirements
```

#### Text Contrast

```typescript
// ✅ COMPLIANT
<BodyMedium className="text-neutral-900">
  High contrast body text
</BodyMedium>

<BodySmall className="text-neutral-500">
  Medium contrast secondary text (still meets 4.5:1)
</BodySmall>

// ⚠️ USE CAREFULLY - Lower contrast for large text only
<Heading1 className="text-neutral-400">
  Large heading with 3:1 contrast (AA for large text)
</Heading1>

// ❌ NON-COMPLIANT
<BodySmall className="text-neutral-300">
  Too low contrast for small text
</BodySmall>
```

#### Interactive Element Contrast

```typescript
// ✅ COMPLIANT - Button states maintain contrast
const buttonVariants = cva('...', {
  compoundVariants: [
    {
      variant: 'solid',
      intent: 'primary',
      class: 'bg-primary-500 hover:bg-primary-700 text-white',
      // Base: 6.2:1 ✓
      // Hover: 8.1:1 ✓
    },
    {
      variant: 'outline',
      intent: 'primary',
      class: 'border-primary-500 text-primary-500 hover:bg-primary-50',
      // Text: 6.2:1 ✓
      // Border: 3.2:1 ✓
    },
  ],
});

// ❌ NON-COMPLIANT - Border too light
className = 'border border-neutral-200 text-neutral-900';
// Border doesn't meet 3:1 against white background
```

---

### Color Blind Considerations

Don't rely on color alone to convey information.

#### Add Visual Indicators

```typescript
// ❌ BAD - Color only
<div className="text-destructive-500">Error</div>
<div className="text-success-500">Success</div>

// ✅ GOOD - Color + icon
<div className="flex items-center gap-2 text-destructive-500">
  <WarningCircle weight="fill" />
  <span>Error: Invalid email format</span>
</div>

<div className="flex items-center gap-2 text-success-500">
  <CheckCircle weight="fill" />
  <span>Success: Form submitted</span>
</div>
```

#### Form Validation

```typescript
// ❌ BAD - Red border only
<Input className={error ? "border-destructive-500" : "border-neutral-300"} />

// ✅ GOOD - Icon + color + text
<div>
  <div className="relative">
    <Input
      className={error ? "border-destructive-500 pr-10" : "border-neutral-300"}
      aria-invalid={!!error}
      aria-describedby="email-error"
    />
    {error && (
      <WarningCircle
        className="absolute right-3 top-3 text-destructive-500"
        aria-hidden="true"
      />
    )}
  </div>
  {error && (
    <p id="email-error" className="mt-1 flex items-center gap-1 text-sm text-destructive-500">
      <span>{error}</span>
    </p>
  )}
</div>
```

#### Status Indicators

```typescript
// ✅ Status with icon + text + color
export function OrderStatus({ status }: { status: string }) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-warning-500",
      label: "Pending",
    },
    shipped: {
      icon: Package,
      color: "text-info-500",
      label: "Shipped",
    },
    delivered: {
      icon: CheckCircle,
      color: "text-success-500",
      label: "Delivered",
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 ${config.color}`}>
      <config.icon weight="fill" aria-hidden="true" />
      <span>{config.label}</span>
    </div>
  );
}
```

#### Data Visualization

```typescript
// ❌ BAD - Color-coded chart only
<div className="h-4 w-full bg-success-500" />
<div className="h-4 w-full bg-warning-500" />
<div className="h-4 w-full bg-destructive-500" />

// ✅ GOOD - Patterns + labels + color
<div>
  <div className="flex items-center gap-2">
    <div className="h-4 w-full bg-success-500 pattern-dots" />
    <span>Completed: 75%</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="h-4 w-full bg-warning-500 pattern-stripes" />
    <span>In Progress: 20%</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="h-4 w-full bg-destructive-500 pattern-cross" />
    <span>Failed: 5%</span>
  </div>
</div>
```

---

### High Contrast Mode

Support Windows High Contrast Mode and forced colors.

```css
/* Add to component CSS or globals.css */

/* High contrast mode detection */
@media (prefers-contrast: high) {
  .button {
    border: 2px solid currentColor;
  }
}

/* Forced colors mode (Windows HCM) */
@media (forced-colors: active) {
  .button {
    border: 1px solid;
  }

  .icon {
    forced-color-adjust: auto;
  }
}
```

**Component example:**

```typescript
// Ensure borders visible in high contrast
const buttonVariants = cva(
  'border-2 border-transparent focus-visible:border-current',
  {
    variants: {
      variant: {
        solid: 'bg-primary-500 hover:bg-primary-700 text-white',
        outline: 'border-primary-500 text-primary-500 bg-transparent',
      },
    },
  }
);
```

---

## Testing

Test accessibility regularly throughout development.

### Manual Testing Checklist

#### Keyboard Navigation

- [ ] All interactive elements focusable with Tab
- [ ] Focus order matches visual order
- [ ] Focus indicators visible
- [ ] Can activate buttons with Enter/Space
- [ ] Can close modals with Escape
- [ ] Can navigate menus with arrow keys
- [ ] No keyboard traps (except intentional focus trapping)

#### Screen Reader

- [ ] Page has descriptive `<title>`
- [ ] Headings in logical order (h1 → h2 → h3)
- [ ] All images have appropriate alt text
- [ ] Form inputs have associated labels
- [ ] Buttons have descriptive text or aria-label
- [ ] Error messages announced
- [ ] Dynamic content changes announced

#### Visual

- [ ] Text meets 4.5:1 contrast (normal) or 3:1 (large)
- [ ] Interactive elements meet 3:1 contrast
- [ ] Color not sole indicator of information
- [ ] Text resizable to 200% without loss of content
- [ ] Content readable in high contrast mode

#### Forms

- [ ] All inputs have labels
- [ ] Required fields marked with aria-required
- [ ] Errors linked with aria-describedby
- [ ] Error messages descriptive
- [ ] Success messages announced

---

### Automated Testing (axe-core)

Use `@axe-core/react` for automated accessibility testing.

#### Setup

```bash
npm install --save-dev @axe-core/react
```

```typescript
// src/app/layout.tsx (development only)
if (process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}
```

#### Component Testing

```typescript
// src/ui/buttons/__tests__/button.test.tsx
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Button } from "../button";

expect.extend(toHaveNoViolations);

describe("Button Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have no violations with icon", async () => {
    const { container } = render(
      <Button>
        Save
        <FloppyDisk aria-hidden="true" />
      </Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have accessible name when icon-only", async () => {
    const { container } = render(
      <IconButton icon={X} aria-label="Close dialog" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

#### Integration Testing

```typescript
// Test full pages
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import ProfilePage from "../page";

it("profile page should have no accessibility violations", async () => {
  const { container } = render(<ProfilePage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

### Screen Reader Testing

Test with actual screen readers to catch issues automated tools miss.

#### macOS - VoiceOver

**Activation:**

- `Cmd + F5` - Toggle VoiceOver

**Basic commands:**

- `VO + Right/Left Arrow` - Navigate forward/backward
- `VO + Space` - Activate element
- `VO + A` - Start reading
- `VO + U` - Open rotor (navigation menu)
- `VO + Cmd + H` - Navigate by heading

#### Windows - NVDA (Free)

**Activation:**

- Download from https://www.nvaccess.org/
- `Ctrl + Alt + N` - Start NVDA

**Basic commands:**

- `Insert + Down Arrow` - Read next item
- `Insert + Up Arrow` - Read previous item
- `Insert + Space` - Toggle browse/focus mode
- `H` - Navigate by heading
- `B` - Navigate by button

#### Testing Checklist

- [ ] All content announced in logical order
- [ ] Headings navigable with heading shortcuts
- [ ] Forms navigable and fillable
- [ ] Buttons clearly identified and activatable
- [ ] Images have descriptive alt text
- [ ] Dynamic content changes announced
- [ ] Modals trap focus appropriately
- [ ] No confusing or redundant announcements

---

## Common Accessibility Patterns

### Accessible Modal

```typescript
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/ui/dialogs";
import { Button } from "@/ui/buttons";
import { X } from "@phosphor-icons/react";

export function AccessibleModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Modal</Button>
      </DialogTrigger>

      <DialogContent>
        {/* Title required for accessibility */}
        <DialogTitle>Confirm Action</DialogTitle>

        {/* Description provides context */}
        <DialogDescription>
          Are you sure you want to proceed? This action cannot be undone.
        </DialogDescription>

        {/* Close button with accessible label */}
        <DialogClose asChild>
          <IconButton
            icon={X}
            aria-label="Close dialog"
            className="absolute right-4 top-4"
          />
        </DialogClose>

        <div className="mt-6 flex gap-3">
          <Button intent="destructive">Confirm</Button>
          <DialogClose asChild>
            <Button variant="outline" intent="neutral">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### Accessible Form

```typescript
export function AccessibleForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Name field */}
      <div className="space-y-2">
        <label htmlFor="name">
          Full Name
          <span className="text-destructive-500" aria-label="required">*</span>
        </label>
        <Input
          id="name"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="text-sm text-destructive-500">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email field */}
      <div className="space-y-2">
        <label htmlFor="email">Email Address</label>
        <Input
          id="email"
          type="email"
          aria-describedby="email-help"
          aria-invalid={!!errors.email}
        />
        <p id="email-help" className="text-sm text-neutral-500">
          We'll never share your email.
        </p>
        {errors.email && (
          <p role="alert" className="text-sm text-destructive-500">
            {errors.email}
          </p>
        )}
      </div>

      {/* Submit button with loading state */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
        <span className="sr-only">form</span>
      </Button>

      {/* Status message */}
      {submitStatus && (
        <div role="status" aria-live="polite" className="sr-only">
          {submitStatus}
        </div>
      )}
    </form>
  );
}
```

### Accessible Navigation

```typescript
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function MainNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav aria-label="Main navigation">
      <ul className="flex gap-4">
        {links.map((link) => {
          const isCurrent = pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isCurrent ? "page" : undefined}
                className={isCurrent ? "font-bold underline" : ""}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools Browser Extension](https://www.deque.com/axe/devtools/)
- [Radix UI Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)
