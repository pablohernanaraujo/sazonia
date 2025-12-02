# FileInputButton Component Plan - Architectural Evaluation

**Evaluation Date:** 2025-11-30
**Component:** FileInputButton
**Plan Location:** `/Users/pabloaraujo/Documents/projects/sazonia/sazonia-web/ai/plans/ui/file-input-button-plan-2025-11-30.md`
**Figma Reference:** https://www.figma.com/design/3qSWXi5pH0JqQ4ThvkZMQp/Glow-UI-%E2%80%94-Pro-1.8?node-id=1053-46498

## Overall Assessment

**Architectural Alignment Score: 9.5/10**

The FileInputButton plan demonstrates excellent architectural alignment with the sazonia-web design system patterns. The plan correctly identifies this as an atom-level component, properly applies CVA patterns, and follows established conventions for input-adjacent components. The component is well-positioned to integrate seamlessly with the existing codebase.

---

## 1. Atomic Design Classification

### Evaluation: CORRECT ✅

**Classification:** Atom

**Rationale:**
The plan correctly classifies FileInputButton as an **Atom** for the following reasons:

1. **No Internal Composition:** The component renders a single `<button>` element with styling - it does not compose other UI components internally
2. **Primitive Building Block:** Like `QuantityInputButton`, this is a specialized button designed to be composed into higher-level components
3. **Single Responsibility:** The component has one clear purpose - to serve as the clickable trigger for file selection
4. **Composition Target:** Explicitly designed to be consumed by a future `FileInput` molecule (TextInput + FileInputButton)

**Comparison with Similar Components:**

- `QuantityInputButton` (Atom) - Similar pattern: specialized button for composition ✅
- `Button` (Atom) - Base button primitive ✅
- `TextInput` (Atom) - Input primitive that this will compose with ✅

**Verdict:** The atomic classification is architecturally sound and consistent with the codebase patterns.

---

## 2. Component Composition Strategy

### Evaluation: EXCELLENT ✅

**Strengths:**

1. **Clear Composition Intent:**
   - Plan explicitly states: "This component will be consumed by a future `FileInput` molecule that combines `TextInput` + `FileInputButton`"
   - Demonstrates understanding of the composition hierarchy

2. **Proper Primitive Design:**
   - No internal dependencies on other UI components
   - Uses only native HTML `<button>` element
   - Leverages Tailwind CSS via CVA
   - Uses `cn` utility for class merging

3. **Integration Points Well-Defined:**
   - Sized to match `TextInput` variants (sm, md, lg)
   - Border strategy designed for seamless attachment (no left border, right-side radius only)
   - Typography aligned with input components

**Reference Pattern Validation:**

The plan follows the exact pattern established by `QuantityInputButton`:

```typescript
// QuantityInputButton pattern (existing)
const quantityInputButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'cursor-pointer',
    // ... states
  ],
  {
    variants: {
      type: { minus: '...', plus: '...' },
      size: { sm: '...', md: '...', lg: '...' },
    },
  }
);

// FileInputButton pattern (planned) - MATCHES ✅
// Base classes, variants for size, no internal composition
```

**Potential Concern:** None identified. The composition strategy is sound.

---

## 3. Architectural Alignment with Project Patterns

### Evaluation: EXCELLENT ✅

**CVA Pattern Compliance:**

✅ **Base Classes:** Plan includes proper base classes (flex, items-center, cursor-pointer, font-medium, transition-colors)

✅ **Variant Structure:** Correctly plans for:

- Size variants: `sm`, `md`, `lg`
- Error variant: `true`/`false`
- Default variants specified

✅ **Compound Variants:** Not needed for this component (appropriate decision)

**forwardRef Pattern:**

✅ **Planned Implementation:**

```typescript
export const FileInputButton = forwardRef<
  HTMLButtonElement,
  FileInputButtonProps
>(({ size, disabled, error, className, children, ...props }, ref) => {
  // Implementation
});
```

This matches the established pattern from `Button` and `QuantityInputButton`.

**TypeScript Type Safety:**

✅ **Proper Type Composition:**

```typescript
export interface FileInputButtonProps
  extends
    ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof fileInputButtonVariants> {
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: boolean;
  className?: string;
  children?: ReactNode;
}
```

This follows the exact pattern from existing components:

- Extends `ComponentPropsWithoutRef<'button'>` ✅
- Extends `VariantProps<typeof variants>` ✅
- Explicit prop documentation ✅
- Proper optional/required prop handling ✅

**displayName:**

✅ **Planned:** `FileInputButton.displayName = 'FileInputButton';`

**React Import Convention:**

✅ **Direct Imports (Not Namespace):**
The plan implicitly follows the correct pattern by referencing `ComponentPropsWithoutRef`, `forwardRef`, and `ReactNode` - these should be imported directly:

```typescript
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react';
```

This matches the established convention from existing components.

**Code Quality Compliance:**

✅ **Kebab-case Filename:** `file-input-button.tsx`

✅ **Single Quotes:** Plan references follow this pattern

✅ **Max Params:** Interface design avoids parameter explosion (uses props object)

✅ **Arrow Functions:** CVA definitions use concise body

---

## 4. Design System Integration

### Evaluation: EXCELLENT ✅

**Design Token Mapping:**

The plan provides comprehensive token mapping that aligns with the design system:

| Design Spec             | Tailwind Class | Status     |
| ----------------------- | -------------- | ---------- |
| Padding X (sm): 10px    | `px-2.5`       | ✅ Correct |
| Padding X (md): 12px    | `px-3`         | ✅ Correct |
| Padding X (lg): 14px    | `px-3.5`       | ✅ Correct |
| Padding Y (sm): 6px     | `py-1.5`       | ✅ Correct |
| Padding Y (md): 10px    | `py-2.5`       | ✅ Correct |
| Padding Y (lg): 12px    | `py-3`         | ✅ Correct |
| Font size (sm/md): 14px | `text-sm`      | ✅ Correct |
| Font size (lg): 16px    | `text-base`    | ✅ Correct |
| Border radius: 6px      | `rounded-sm`   | ✅ Correct |

**Border Strategy:**

✅ **Asymmetric Border Pattern:**

- Plan specifies: `border-t border-r border-b border-l-0`
- Right corners only: `rounded-tr-sm rounded-br-sm`
- Matches the pattern from `QuantityInputButton` (which uses `border-t border-r-0 border-b border-l` for minus type)

**State Color Mapping:**

✅ **Comprehensive State Coverage:**

The plan maps all required states:

- Default: `bg-background`, `border-border`, `text-text-tertiary`
- Hover: `bg-background-secondary`, `border-border-hover`, `text-text-tertiary`
- Pressed: `bg-background-tertiary`, `border-border-hover`, `text-text-subtle`
- Disabled: `bg-background-secondary`, `border-border-disabled`, `text-text-secondary`
- Error: `bg-background`, `border-destructive`, `text-text-tertiary`

These align with the design system's semantic color tokens.

**Consistency with Input Components:**

✅ **Size Alignment:** sm, md, lg matches `TextInput`, `NumberInput`, `QuantityInputButton`

✅ **Error State Pattern:** Uses `error` boolean prop, applies `border-destructive` - matches `TextInput` pattern

✅ **Typography:** Uses Inter Medium (font-medium), matching input ecosystem

**Minor Observation:**

The Figma design shows slightly different hover text colors (`text-base-tertiary_hover: #7d868c`) vs pressed (`text-base-tertiary_active: #697177`). The plan should ensure these subtle differences are captured in the CVA variants using CSS state selectors (`:hover`, `:active`).

**Recommendation:** Add specific hover/active state styling:

```typescript
// In CVA base classes
'hover:bg-background-secondary hover:border-border-hover hover:text-[#7d868c]',
'active:bg-background-tertiary active:text-text-subtle',
```

---

## 5. Testing Strategy Completeness

### Evaluation: EXCELLENT ✅

**Test Coverage Categories:**

✅ **Rendering Tests:**

- Default render with props ✅
- Children (text) rendering ✅
- Custom className merging ✅
- Default `type="button"` ✅

✅ **Variant Tests:**

- Size variants (sm, md, lg) with correct classes ✅
- Error state applies destructive border ✅

✅ **State Tests:**

- Disabled state handling ✅
- aria-disabled attribute ✅
- Error state styling ✅

✅ **Interaction Tests:**

- onClick handler fires ✅
- onClick blocked when disabled ✅
- Keyboard interaction (Enter, Space) ✅
- Keyboard blocked when disabled ✅

✅ **Accessibility Tests:**

- Button role ✅
- aria-disabled when disabled ✅
- Focus ring presence ✅
- Focusable when enabled ✅

✅ **Edge Cases:**

- Long text handling ✅
- Empty children ✅
- Multiple className merging ✅
- Ref forwarding ✅
- State transitions ✅

**Comparison with Existing Test Patterns:**

The planned test structure matches `QuantityInputButton` and `Button` test patterns:

- Uses `describe` blocks for organization ✅
- Tests user interactions with `fireEvent` ✅
- Validates accessibility attributes ✅
- Checks class application for variants ✅

**Test File Location:**

✅ **Correct:** `src/ui/inputs/__tests__/file-input-button.test.tsx`

Follows the established pattern of co-locating tests with components.

**Missing Test (Minor):**

Consider adding a test for composition with `TextInput` to validate the seamless border integration:

```typescript
it('should integrate seamlessly with TextInput (no double borders)', () => {
  render(
    <div className="inline-flex">
      <TextInput wrapperClassName="rounded-r-none" />
      <FileInputButton>Browse</FileInputButton>
    </div>
  );
  // Validate border integration
});
```

This isn't critical but would document the intended composition pattern.

---

## 6. Storybook Stories Completeness

### Evaluation: EXCELLENT ✅

**Required Stories:**

✅ **1. Default Story:** Basic component with default props (lg size, default state)

✅ **2. AllSizes Story:** Visual comparison of sm, md, lg sizes side by side

✅ **3. AllStates Story:** All interaction states (default, hover, pressed, disabled, error)

✅ **4. DisabledState Story:** Isolated disabled variant

✅ **5. ErrorState Story:** Isolated error variant

✅ **6. WithTextInput Story:** Real-world example showing button attached to TextInput

✅ **7. FileUploadPattern Story:** Complete file upload pattern example

✅ **8. CompleteMatrix Story:** Grid showing all size × state combinations

**Story Configuration:**

✅ **Meta Configuration:**

```typescript
const meta = {
  title: 'Inputs/FileInputButton',
  component: FileInputButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    children: { control: 'text' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof FileInputButton>;
```

This matches the pattern from `quantity-input-button.stories.tsx`.

✅ **Type Safety:** Uses `satisfies Meta<typeof FileInputButton>`

✅ **Autodocs:** Includes `tags: ['autodocs']`

✅ **Interactive Controls:** Comprehensive argTypes with descriptions

**Story Completeness Comparison:**

Comparing to `QuantityInputButton` stories (9 stories):

- Default ✅
- AllTypes (N/A for FileInputButton - only one type)
- AllSizes ✅
- AllStates ✅
- Disabled ✅
- TypeComparison (N/A)
- WithQuantityInput ✅ (equivalent to WithTextInput)
- InteractiveDemo - **MISSING** ⚠️
- AccessibilityExample - **MISSING** ⚠️

**Recommendations:**

1. **Add InteractiveDemo Story:**

```typescript
export const InteractiveDemo: Story = {
  render: function InteractiveDemoRender() {
    const [fileName, setFileName] = useState('');

    const handleClick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        setFileName(file?.name || '');
      };
      input.click();
    };

    return (
      <div className="inline-flex">
        <TextInput
          value={fileName}
          placeholder="No file selected"
          readOnly
          wrapperClassName="rounded-r-none border-r-0"
        />
        <FileInputButton onClick={handleClick}>Browse</FileInputButton>
      </div>
    );
  },
};
```

2. **Add AccessibilityExample Story:**
   Document proper aria-label usage and screen reader announcements.

**Story File Location:**

✅ **Correct:** `src/stories/inputs/file-input-button.stories.tsx`

---

## 7. Potential Architectural Issues & Improvements

### Issues Identified

#### ISSUE 1: Children Prop vs Icon Prop (Minor)

**Current Plan:**

```typescript
children?: ReactNode
```

**Observation:**
The Figma design shows a text label ("Button" by default), but most file input buttons in real applications display icons (e.g., Phosphor's `UploadSimple`, `Folder`, `File`).

**Recommendation:**
Consider adding optional icon support similar to the `Button` component:

```typescript
export interface FileInputButtonProps
  extends
    ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof fileInputButtonVariants> {
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: boolean;
  className?: string;
  children?: ReactNode;
  leftIcon?: ComponentType<PhosphorIconProps>; // Optional
  rightIcon?: ComponentType<PhosphorIconProps>; // Optional
}
```

**Rationale:**

- Provides flexibility for icon-based file upload UIs
- Maintains consistency with `Button` component API
- Still supports text-only usage via `children`

**Impact:** Low priority - can be added in future iteration if needed.

---

#### ISSUE 2: Border Implementation Detail (Minor)

**Current Plan:**

```
border-t border-r border-b border-l-0
```

**Alternative Approach:**

```typescript
// More explicit with arbitrary values
'border border-l-0';
```

**Observation:**
Both approaches work, but `border border-l-0` is more concise and follows the pattern used in `QuantityInputButton`.

**Recommendation:**
Use `border border-l-0` for consistency with existing codebase patterns.

---

#### ISSUE 3: Hidden File Input Integration (Documentation Gap)

**Current Plan:**
The plan focuses on the button component but doesn't fully document how it integrates with the actual `<input type="file">` element.

**Typical Pattern:**

```tsx
<label className="inline-flex">
  <input type="file" className="sr-only" onChange={handleFileChange} />
  <TextInput
    value={fileName}
    readOnly
    wrapperClassName="rounded-r-none border-r-0"
  />
  <FileInputButton as="span">Browse</FileInputButton>
</label>
```

Or using click handler:

```tsx
const fileInputRef = useRef<HTMLInputElement>(null);

<input
  ref={fileInputRef}
  type="file"
  className="sr-only"
  onChange={handleFileChange}
/>
<div className="inline-flex">
  <TextInput value={fileName} readOnly wrapperClassName="rounded-r-none border-r-0" />
  <FileInputButton onClick={() => fileInputRef.current?.click()}>
    Browse
  </FileInputButton>
</div>
```

**Recommendation:**
Add a section to the plan's "Implementation Notes" documenting the recommended integration pattern with hidden file inputs. This will help future developers understand the intended usage.

**Impact:** Documentation improvement - doesn't affect component architecture.

---

#### ISSUE 4: Focus State Specification (Minor)

**Current Plan:**
Mentions focus ring styling but doesn't specify the exact focus-visible implementation.

**Recommendation:**
Ensure the CVA base classes include:

```typescript
'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none',
```

This matches the `Button` and `QuantityInputButton` patterns.

**Impact:** Low - likely already planned but should be explicit.

---

### Positive Patterns Observed

✅ **1. Excellent Documentation:**
The plan includes comprehensive JSDoc examples, clear user stories, and detailed implementation steps.

✅ **2. Design Token Rigor:**
Explicit mapping of Figma tokens to Tailwind classes demonstrates attention to design system consistency.

✅ **3. Future-Proofing:**
The plan anticipates the future `FileInput` molecule and designs the atom accordingly.

✅ **4. Accessibility-First:**
Proper handling of disabled states, aria-disabled, focus indicators, and button role semantics.

✅ **5. Validation Commands:**
Comprehensive validation checklist with all 6 required commands (type-check, lint, test, test:run, build, build-storybook).

✅ **6. Export Pattern:**
Correctly plans for barrel exports through `src/ui/inputs/index.ts` → `src/ui/index.ts`.

✅ **7. Error State Handling:**
Proper error prop with destructive border styling, matching input component patterns.

---

## Recommendations Summary

### Critical (Must Address)

None identified. The plan is architecturally sound.

### Important (Should Address)

1. **Add Interactive Storybook Demo:**
   Create an `InteractiveDemo` story showing functional file selection.

2. **Add Accessibility Storybook Example:**
   Document aria-label usage and screen reader announcements.

3. **Clarify Hover/Active Text Colors:**
   Ensure CVA captures the subtle color differences from Figma:
   - Hover: `#7d868c`
   - Active: `#697177`

### Optional (Nice to Have)

4. **Consider Icon Prop Support:**
   Add optional `leftIcon`/`rightIcon` props for flexibility.

5. **Document File Input Integration:**
   Add implementation notes for hidden file input pattern.

6. **Border Implementation:**
   Use `border border-l-0` for consistency with existing patterns.

---

## Code Examples

### Recommended CVA Implementation

```typescript
const fileInputButtonVariants = cva(
  [
    // Layout
    'inline-flex items-center justify-center',
    'cursor-pointer',

    // Typography
    'font-medium',

    // Border (3 sides only)
    'border border-l-0',
    'rounded-tr-sm rounded-br-sm',

    // Default state
    'bg-background',
    'border-border',
    'text-text-tertiary',

    // Transitions
    'transition-colors duration-150',

    // Hover state
    'hover:bg-background-secondary',
    'hover:border-border-hover',
    'hover:text-[#7d868c]',

    // Active state
    'active:bg-background-tertiary',
    'active:text-text-subtle',

    // Focus state
    'focus-visible:ring-2 focus-visible:ring-primary',
    'focus-visible:ring-offset-2 focus-visible:outline-none',

    // Disabled state
    'disabled:bg-background-secondary',
    'disabled:border-border-disabled',
    'disabled:text-text-secondary',
    'disabled:cursor-not-allowed',
    'disabled:opacity-52',
  ],
  {
    variants: {
      size: {
        sm: 'gap-1.5 px-2.5 py-1.5 text-sm leading-5',
        md: 'gap-2 px-3 py-2.5 text-sm leading-5',
        lg: 'gap-2 px-3.5 py-3 text-base leading-6',
      },
      error: {
        true: 'border-destructive hover:border-destructive focus-visible:ring-destructive',
        false: '',
      },
    },
    defaultVariants: {
      size: 'lg',
      error: false,
    },
  }
);
```

### Recommended Component Implementation

```typescript
export const FileInputButton = forwardRef<
  HTMLButtonElement,
  FileInputButtonProps
>(
  (
    { size = 'lg', error = false, disabled, className, children, ...props },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={cn(fileInputButtonVariants({ size, error }), className)}
      {...props}
    >
      {children}
    </button>
  )
);

FileInputButton.displayName = 'FileInputButton';
```

---

## Final Verdict

### Architectural Compliance: EXCELLENT ✅

The FileInputButton plan demonstrates:

- ✅ Correct atomic design classification
- ✅ Proper composition strategy aligned with existing patterns
- ✅ Full compliance with CVA, forwardRef, and TypeScript conventions
- ✅ Comprehensive design token mapping
- ✅ Thorough testing strategy (with minor enhancement opportunities)
- ✅ Complete Storybook documentation (with 2 recommended additions)
- ✅ No critical architectural issues

### Implementation Readiness: 95%

The plan is ready for implementation with only minor enhancements recommended (interactive story, accessibility example, hover color refinement).

### Component Category Alignment: CORRECT

`src/ui/inputs/file-input-button.tsx` is the correct location. The component belongs in the `inputs` category as it:

1. Is designed for file input scenarios
2. Will compose with `TextInput`
3. Follows input sizing conventions
4. Shares visual language with input-adjacent components

---

## Evaluation Metadata

- **Evaluator:** UI/UX Architecture Agent
- **Evaluation Framework:** Sazonia UI Component Architecture Standards
- **Reference Patterns:** Button, QuantityInputButton, TextInput
- **Code Quality Standards:** `.claude/rules/code-quality.md`
- **Component Patterns:** `.claude/skills/sazonia-ui-components/SKILL.md`
- **Storybook Patterns:** `.claude/skills/sazonia-storybook/SKILL.md`
