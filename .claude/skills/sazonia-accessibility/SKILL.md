---
name: sazonia-accessibility
description: Implement WCAG 2.1 AA accessibility standards with ARIA attributes, keyboard navigation, and screen reader support. Use when ensuring accessibility, creating inclusive components, meeting WCAG standards, implementing keyboard navigation, or adding ARIA attributes.
---

# Sazonia Accessibility Patterns

This Skill helps you implement WCAG 2.1 AA accessibility standards in sazonia-web, ensuring your application is usable by everyone, including people with disabilities.

## When to Use This Skill

- Implementing accessible components
- Adding ARIA attributes
- Implementing keyboard navigation
- Supporting screen readers
- Meeting WCAG 2.1 AA standards
- Creating inclusive forms

## Core Principles

### 1. WCAG 2.1 AA Standards

**Four Principles (POUR):**

- **Perceivable**: Information must be presentable to users
- **Operable**: UI must be operable by all users
- **Understandable**: Information must be understandable
- **Robust**: Content must work with assistive technologies

### 2. Semantic HTML First

Always prefer semantic HTML over ARIA:

- Use `<button>` instead of `<div role="button">`
- Use `<nav>` instead of `<div role="navigation">`
- Use `<main>` instead of `<div role="main">`

## Button Accessibility

### Pattern 1: Accessible Button

**Good Button:**

```typescript
import { forwardRef, type ComponentProps } from "react";

export interface ButtonProps extends ComponentProps<"button"> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="sr-only">Loading...</span>
            <Spinner aria-hidden="true" />
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
```

**Icon-Only Button:**

```typescript
import { X } from "@phosphor-icons/react";

export function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      aria-label="Close dialog"
      className="p-2"
    >
      <X className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}
```

## Form Accessibility

### Pattern 2: Accessible Form Input

**Input with Label:**

```typescript
import { forwardRef, type ComponentProps } from "react";

export interface InputProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random()}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div>
        <label htmlFor={inputId} className="block text-sm font-medium">
          {label}
        </label>

        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          {...props}
        />

        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);
```

### Pattern 3: Required Field Indicator

**Required Field:**

```typescript
export function RequiredInput({ label, ...props }: InputProps & { required: boolean }) {
  return (
    <div>
      <label htmlFor={props.id}>
        {label}
        {props.required && (
          <>
            <span className="text-destructive" aria-hidden="true"> *</span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>
      <input {...props} aria-required={props.required} />
    </div>
  );
}
```

## Dialog/Modal Accessibility

### Pattern 4: Accessible Dialog

**Modal with Focus Management:**

```typescript
"use client";

import { useEffect, useRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, title, description, children }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />

        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6"
          aria-describedby={description ? "dialog-description" : undefined}
        >
          <DialogPrimitive.Title className="text-xl font-bold mb-2">
            {title}
          </DialogPrimitive.Title>

          {description && (
            <DialogPrimitive.Description id="dialog-description" className="text-sm text-muted-foreground mb-4">
              {description}
            </DialogPrimitive.Description>
          )}

          {children}

          <DialogPrimitive.Close
            className="absolute top-4 right-4"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
```

## Keyboard Navigation

### Pattern 5: Keyboard-Accessible Dropdown

**Dropdown with Keyboard Support:**

```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

export function Dropdown({ items }: { items: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % items.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSelect(items[focusedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
    }
  };

  const handleSelect = (item: string) => {
    console.log("Selected:", item);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        Select Option
      </button>

      {isOpen && (
        <ul role="listbox" className="mt-2">
          {items.map((item, index) => (
            <li
              key={item}
              role="option"
              aria-selected={index === focusedIndex}
              onClick={() => handleSelect(item)}
              className={index === focusedIndex ? "bg-accent" : ""}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Pattern 6: Skip Links

**Skip to Main Content:**

```typescript
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>

        <Header />

        <main id="main-content" tabIndex={-1}>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
```

## Screen Reader Support

### Pattern 7: Screen Reader Only Text

**SR-Only Utility:**

```css
/* globals.css */
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

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

**Usage:**

```typescript
export function FavoriteButton({ itemId }: { itemId: string }) {
  return (
    <button aria-label="Add to favorites">
      <Heart className="w-5 h-5" aria-hidden="true" />
      <span className="sr-only">Add to favorites</span>
    </button>
  );
}
```

### Pattern 8: Live Regions

**Announce Dynamic Content:**

```typescript
"use client";

import { useState } from "react";

export function SearchResults() {
  const [results, setResults] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isLoading && "Loading results..."}
        {!isLoading && `${results.length} results found`}
      </div>

      <div aria-label="Search results">
        {results.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
```

## Color and Contrast

### Pattern 9: Accessible Color Contrast

**Check Contrast Ratios:**

```typescript
// Ensure text has sufficient contrast
// WCAG AA: 4.5:1 for normal text, 3:1 for large text

// ✅ Good contrast
<p className="text-foreground bg-background">  // High contrast

// ❌ Poor contrast
<p className="text-gray-400 bg-gray-300">  // Low contrast
```

### Pattern 10: Don't Rely on Color Alone

**Use Multiple Indicators:**

```typescript
export function StatusBadge({ status }: { status: "success" | "error" | "warning" }) {
  const config = {
    success: {
      icon: CheckCircle,
      label: "Success",
      className: "bg-green-100 text-green-800",
    },
    error: {
      icon: XCircle,
      label: "Error",
      className: "bg-red-100 text-red-800",
    },
    warning: {
      icon: Warning,
      label: "Warning",
      className: "bg-yellow-100 text-yellow-800",
    },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <span className={className}>
      <Icon className="w-4 h-4" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
```

## Focus Management

### Pattern 11: Focus Indicators

**Visible Focus Styles:**

```css
/* globals.css */
/* Ensure all interactive elements have visible focus */
*:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

/* Remove default focus for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### Pattern 12: Focus Trap in Modal

**Trap Focus:**

```typescript
"use client";

import { useEffect, useRef } from "react";

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Get all focusable elements
    const focusableElements = modalElement.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modalElement.addEventListener("keydown", handleTab);
    return () => modalElement.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
```

## Accessibility Checklist

When implementing accessible components:

- [ ] Use semantic HTML elements
- [ ] Provide text alternatives for non-text content
- [ ] Ensure keyboard navigation works
- [ ] Provide visible focus indicators
- [ ] Use sufficient color contrast (4.5:1 minimum)
- [ ] Don't rely on color alone
- [ ] Label all form inputs
- [ ] Provide error messages with ARIA
- [ ] Use ARIA attributes when needed
- [ ] Test with screen reader
- [ ] Support keyboard shortcuts
- [ ] Manage focus appropriately
- [ ] Provide skip links
- [ ] Use live regions for dynamic content
- [ ] Test with keyboard only

## Best Practices

1. **Semantic HTML First**: Prefer semantic elements over ARIA
2. **Keyboard Navigation**: All interactive elements must be keyboard accessible
3. **Screen Readers**: Test with NVDA, JAWS, or VoiceOver
4. **Color Contrast**: Use WCAG AA contrast ratios
5. **Focus Management**: Clear focus indicators and proper focus flow
6. **ARIA Labels**: Use when semantic HTML isn't enough
7. **Alternative Text**: Provide for all images

## Anti-Patterns to Avoid

❌ **div as button**

```typescript
<div onClick={handleClick}>Click me</div>  // Not keyboard accessible
```

❌ **Missing labels**

```typescript
<input type="email" />  // No label
```

❌ **Poor color contrast**

```typescript
<p className="text-gray-400 bg-gray-300">Low contrast</p>
```

❌ **No focus indicators**

```css
*:focus { outline: none; }  // Don't remove without replacement
```

## Additional Resources

For more details:

- See `.claude/rules/accessibility-patterns.md` for complete patterns
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM: https://webaim.org/
- a11y Project: https://www.a11yproject.com/
