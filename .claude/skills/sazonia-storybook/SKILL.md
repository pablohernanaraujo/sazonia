---
name: sazonia-storybook
description: Create Storybook stories for UI components with multiple variants, controls, and documentation. Use when documenting components, creating design system stories, building component libraries, showcasing component variants, or creating interactive component documentation.
---

# Sazonia Storybook Documentation

This Skill helps you create comprehensive Storybook stories for UI components in sazonia-web, showcasing variants, states, and interactive controls.

## When to Use This Skill

- Documenting new UI components
- Creating component galleries
- Showcasing component variants
- Building interactive documentation
- Testing component props visually
- Creating design system documentation

## Core Principles

### 1. Story Location

Stories live in `src/stories/` organized by category:

```
src/stories/
├── buttons/
│   └── button.stories.tsx
├── typography/
│   └── heading1.stories.tsx
├── forms/
│   └── input.stories.tsx
└── layouts/
    └── flex.stories.tsx
```

### 2. Story Structure

Every story file has:

1. Meta configuration
2. Default export (meta)
3. Named exports (stories)
4. Args for controls
5. ArgTypes for documentation

## Story Patterns

### Pattern 1: Basic Component Story

**Simple Button Story:**

```typescript
// src/stories/buttons/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/ui/buttons/button';

const meta = {
  title: 'UI/Buttons/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
};

// Variant stories
export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
};

// Size variations
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

// State variations
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading...',
    disabled: true,
  },
};
```

### Pattern 2: Component with Complex Props

**Input Field Story:**

```typescript
// src/stories/forms/input.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/ui/forms/input';

const meta = {
  title: 'UI/Forms/Input',
  component: Input,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
      description: 'The HTML input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    type: 'email',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
    error: 'Invalid email address',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Username',
    placeholder: 'johndoe',
    helperText: 'Choose a unique username',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot edit',
    disabled: true,
  },
};
```

### Pattern 3: Composite Component Story

**Card with Multiple Parts:**

```typescript
// src/stories/cards/card.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/ui/cards/card";
import { Button } from "@/ui/buttons/button";

const meta = {
  title: "UI/Cards/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Card className="w-[350px]">
      <div className="h-48 bg-gray-200" />
      <CardHeader>
        <CardTitle>Product Name</CardTitle>
        <CardDescription>$99.99</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Product description goes here.</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  ),
};
```

### Pattern 4: Interactive Story with Actions

**Button with Click Handler:**

```typescript
// src/stories/buttons/button-with-actions.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "@/ui/buttons/button";

const meta = {
  title: "UI/Buttons/Interactive",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onClick: fn(),  // Track clicks in Actions panel
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Clickable: Story = {
  args: {
    children: "Click Me",
  },
};

export const WithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <span>❤️</span>
      <span>Favorite</span>
    </Button>
  ),
  args: {
    children: undefined,
  },
};
```

### Pattern 5: Multiple Variants Showcase

**All Variants Together:**

```typescript
// src/stories/buttons/button-variants.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/ui/buttons/button";

const meta = {
  title: "UI/Buttons/Variants",
  component: Button,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};
```

### Pattern 6: Layout Story

**Flex Layout Story:**

```typescript
// src/stories/layouts/flex.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "@/ui/layouts/flex";

const meta = {
  title: "UI/Layouts/Flex",
  component: Flex,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["row", "column"],
    },
    gap: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch"],
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "between", "around"],
    },
  },
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-blue-100 p-4 rounded">{children}</div>
);

export const Row: Story = {
  args: {
    direction: "row",
    gap: "md",
    children: (
      <>
        <Box>Item 1</Box>
        <Box>Item 2</Box>
        <Box>Item 3</Box>
      </>
    ),
  },
};

export const Column: Story = {
  args: {
    direction: "column",
    gap: "md",
    children: (
      <>
        <Box>Item 1</Box>
        <Box>Item 2</Box>
        <Box>Item 3</Box>
      </>
    ),
  },
};

export const CenteredContent: Story = {
  args: {
    direction: "row",
    align: "center",
    justify: "center",
    className: "h-64 border",
    children: <Box>Centered</Box>,
  },
};
```

## Story Best Practices

### ArgTypes Documentation

**Comprehensive ArgTypes:**

```typescript
argTypes: {
  variant: {
    control: "select",
    options: ["default", "destructive", "outline"],
    description: "The visual style variant",
    table: {
      type: { summary: "string" },
      defaultValue: { summary: "default" },
    },
  },
  size: {
    control: "radio",
    options: ["sm", "md", "lg"],
    description: "Component size",
  },
  disabled: {
    control: "boolean",
    description: "Disables the component",
  },
  onClick: {
    action: "clicked",
    description: "Click event handler",
  },
}
```

### Story Naming Conventions

**Good Names:**

- `Default` - Base example
- `WithLabel` - Variant with specific feature
- `Error` - Error state
- `Loading` - Loading state
- `AllVariants` - Showcase all options

**Bad Names:**

- `Story1`, `Story2` - Not descriptive
- `Test` - Too vague
- `Example` - Not specific enough

## Storybook Configuration

### Meta Configuration

**Common Meta Settings:**

```typescript
const meta = {
  title: "UI/Category/Component",  // Navigation path
  component: Component,
  parameters: {
    layout: "centered",  // or "padded" or "fullscreen"
    docs: {
      description: {
        component: "Component description for docs",
      },
    },
  },
  tags: ["autodocs"],  // Auto-generate docs
  argTypes: {
    // ... prop controls
  },
  decorators: [
    // Wrap stories in providers if needed
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Component>;
```

## Story Checklist

When creating Storybook stories:

- [ ] Story file in correct category
- [ ] Meta configuration complete
- [ ] Title follows hierarchy pattern
- [ ] Component imported correctly
- [ ] ArgTypes defined for all props
- [ ] Default story created
- [ ] Variant stories for each variant
- [ ] State stories (disabled, loading, error)
- [ ] Size variations documented
- [ ] Interactive examples with actions
- [ ] Complex usage examples
- [ ] Autodocs tag added

## Best Practices

1. **One Component Per File**: Each story file for one component
2. **Comprehensive ArgTypes**: Document all props
3. **Show All Variants**: Create stories for each variant
4. **Interactive Examples**: Use actions for event handlers
5. **Real Content**: Use realistic content in examples
6. **Responsive Examples**: Show responsive behavior
7. **Accessibility**: Ensure stories are accessible

## Anti-Patterns to Avoid

❌ **No ArgTypes**

```typescript
const meta = {
  component: Button,
  // Missing argTypes
};
```

❌ **Vague titles**

```typescript
title: 'Components/Stuff'; // Not organized
```

❌ **Only one story**

```typescript
export const Default: Story = {};
// Missing variant, state, and size stories
```

❌ **Unrealistic content**

```typescript
children: 'Lorem ipsum dolor sit'; // Use real content
```

## Additional Resources

For more details:

- See existing stories in `src/stories/` for examples
- Storybook documentation: https://storybook.js.org/docs
- Component-driven development: https://componentdriven.org/
