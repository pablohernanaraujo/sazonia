import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  ErrorMessage,
  Hint,
  InputLabel,
  Textarea,
  TextareaField,
} from '@/ui/inputs';

/**
 * Textarea is a standalone form multi-line text input component that provides styled
 * textarea fields with support for multiple visual states.
 *
 * ## Dual API Approach
 *
 * This package provides two components:
 *
 * 1. **Textarea** (standalone) - For maximum flexibility and custom layouts
 * 2. **TextareaField** (wrapper) - For convenience in standard forms
 *
 * ## Features
 *
 * - **Size variants**: MD (compact), LG (comfortable - default)
 * - **Visual states**: Default, Hover, Focus, Disabled, Error
 * - **Resizable**: Native browser resize handle preserved
 * - **Composition**: Works with InputLabel, Hint, ErrorMessage atoms
 *
 * ## When to Use Textarea vs TextareaField
 *
 * Use **Textarea** when:
 * - You need custom layout (e.g., label with character counter on the right)
 * - You're building a comment box without label
 * - You need fine-grained control over composition
 *
 * Use **TextareaField** when:
 * - You have a standard form field with label, hint, and/or error
 * - You want automatic ID generation and ARIA associations
 * - You want the convenience of a single component
 *
 * ## When to Use Textarea vs TextInput
 *
 * Use **Textarea** when:
 * - User needs to enter multi-line text (comments, descriptions, messages)
 * - Content may exceed 100 characters
 * - Line breaks are meaningful in the content
 *
 * Use **TextInput** when:
 * - Single-line input is sufficient (name, email, URL)
 * - You need add-ons (leftAddOn, rightAddOn) - Textarea doesn't support these
 */
const meta = {
  title: 'Inputs/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['md', 'lg'],
      description: 'Size variant of the textarea',
      table: {
        defaultValue: { summary: 'lg' },
      },
    },
    error: {
      control: 'boolean',
      description: 'Error state - applies destructive border styling',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    rows: {
      control: 'number',
      description: 'Number of visible text rows',
    },
    wrapperClassName: {
      control: 'text',
      description: 'Additional CSS classes for the wrapper element',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the textarea element',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Textarea with LG size and placeholder text.
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
    size: 'lg',
  },
};

/**
 * Comparison of MD and LG size variants.
 */
export const Sizes: Story = {
  args: {
    placeholder: 'Size comparison',
  },
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Medium (md)</p>
        <Textarea size="md" placeholder="Medium textarea" rows={3} />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Large (lg) - Default</p>
        <Textarea size="lg" placeholder="Large textarea" rows={3} />
      </div>
    </div>
  ),
};

/**
 * Grid showing all visual states: Empty, Filled, Disabled, Disabled with value,
 * Error, and Error with value.
 */
export const AllStates: Story = {
  args: {
    placeholder: 'All states',
  },
  render: () => (
    <div className="grid w-[640px] grid-cols-2 gap-6">
      {/* Empty State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Empty (hover to see hover state)
        </p>
        <Textarea placeholder="Enter text..." rows={3} />
      </div>

      {/* Filled State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Filled</p>
        <Textarea
          defaultValue="This is some filled content in the textarea that shows how text appears."
          rows={3}
        />
      </div>

      {/* Disabled Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (empty)</p>
        <Textarea disabled placeholder="Disabled textarea" rows={3} />
      </div>

      {/* Disabled Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (filled)</p>
        <Textarea
          disabled
          defaultValue="Disabled textarea with content"
          rows={3}
        />
      </div>

      {/* Error Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (empty)</p>
        <Textarea error placeholder="Error state" rows={3} />
      </div>

      {/* Error Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (filled)</p>
        <Textarea error defaultValue="Invalid content" rows={3} />
      </div>
    </div>
  ),
};

/**
 * Demonstrates manual composition with InputLabel, Hint, and ErrorMessage atoms.
 * This pattern provides maximum flexibility for custom layouts.
 */
export const ManualComposition: Story = {
  args: {
    placeholder: 'Manual composition',
  },
  render: () => (
    <div className="flex w-[320px] flex-col gap-8">
      {/* Basic with label */}
      <div>
        <p className="mb-3 text-xs text-text-tertiary">Basic composition</p>
        <InputLabel label="Description" htmlFor="desc-basic" />
        <Textarea id="desc-basic" placeholder="Enter description..." rows={3} />
      </div>

      {/* With hint */}
      <div>
        <p className="mb-3 text-xs text-text-tertiary">With hint</p>
        <InputLabel label="Message" htmlFor="msg-hint" required />
        <Textarea
          id="msg-hint"
          placeholder="Enter your message..."
          aria-describedby="msg-hint-text"
          rows={4}
        />
        <Hint id="msg-hint-text">Maximum 500 characters</Hint>
      </div>

      {/* With error */}
      <div>
        <p className="mb-3 text-xs text-text-tertiary">With error</p>
        <InputLabel label="Feedback" htmlFor="feedback-error" required />
        <Textarea
          id="feedback-error"
          placeholder="Enter feedback..."
          error
          aria-invalid
          aria-describedby="feedback-error-text"
          defaultValue=""
          rows={3}
        />
        <ErrorMessage id="feedback-error-text" text="This field is required" />
      </div>
    </div>
  ),
};

// =============================================
// TextareaField Stories (Convenience Wrapper)
// =============================================

/**
 * TextareaField default example with label.
 */
export const FieldDefault: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <TextareaField
        label="Description"
        placeholder="Enter a description..."
        rows={4}
      />
    </div>
  ),
};

/**
 * TextareaField with hint text.
 */
export const FieldWithHint: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <TextareaField
        label="Bio"
        hint="Tell us about yourself (max 500 characters)"
        placeholder="Enter your bio..."
        rows={4}
      />
    </div>
  ),
};

/**
 * TextareaField with error state. Notice how the error replaces the hint.
 */
export const FieldWithError: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <TextareaField
        label="Message"
        hint="Required field"
        error="Please enter a message"
        placeholder="Enter message..."
        defaultValue=""
        rows={4}
      />
    </div>
  ),
};

/**
 * TextareaField with all features: required indicator, help icon, and hint text.
 */
export const FieldFullFeatured: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <TextareaField
        label="Feedback"
        labelProps={{
          required: true,
          showIcon: true,
          helpIconAriaLabel: 'Feedback guidelines',
        }}
        hint="Your honest feedback helps us improve"
        placeholder="Share your thoughts..."
        rows={5}
      />
    </div>
  ),
};

/**
 * TextareaField showing both sizes and how they map to InputLabel sizes.
 */
export const FieldAllSizes: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-8">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Medium (md) - Label: sm, Hint: sm
        </p>
        <TextareaField
          size="md"
          label="Medium field"
          labelProps={{ required: true }}
          hint="Medium hint text"
          placeholder="Medium textarea"
          rows={3}
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Large (lg) - Label: md, Hint: md
        </p>
        <TextareaField
          size="lg"
          label="Large field"
          labelProps={{ required: true }}
          hint="Large hint text"
          placeholder="Large textarea"
          rows={3}
        />
      </div>
    </div>
  ),
};

/**
 * Demonstrates the native resize behavior of textarea.
 */
export const Resizable: Story = {
  args: {},
  render: () => (
    <div className="w-[320px]">
      <p className="mb-3 text-xs text-text-tertiary">
        Drag the bottom-right corner to resize
      </p>
      <TextareaField
        label="Resizable textarea"
        placeholder="Try resizing me..."
        hint="The textarea can be resized vertically by default"
        rows={4}
      />
    </div>
  ),
};

/**
 * Demonstrates different rows configurations.
 */
export const WithRowsConfiguration: Story = {
  args: {},
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">2 rows (compact)</p>
        <Textarea rows={2} placeholder="Two rows..." />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">4 rows (default)</p>
        <Textarea rows={4} placeholder="Four rows..." />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">8 rows (expanded)</p>
        <Textarea rows={8} placeholder="Eight rows..." />
      </div>
    </div>
  ),
};

/**
 * Real-world form example using TextareaField for convenience.
 */
export const FormIntegration: Story = {
  args: {},
  render: function FormExample() {
    const [feedback, setFeedback] = useState('');
    const maxLength = 500;

    return (
      <form className="w-[400px] space-y-5 rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold">Contact Form</h3>

        <TextareaField
          label="Subject"
          labelProps={{ required: true }}
          placeholder="What is this about?"
          rows={1}
        />

        <TextareaField
          label="Message"
          labelProps={{ required: true }}
          hint={`${feedback.length}/${maxLength} characters`}
          placeholder="Tell us more..."
          rows={6}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value.slice(0, maxLength))}
          maxLength={maxLength}
        />

        <TextareaField
          label="Additional notes"
          hint="Optional - any extra details"
          placeholder="Anything else you'd like to add?"
          rows={3}
        />

        <button
          type="submit"
          className="w-full rounded-sm bg-primary py-2.5 text-white hover:bg-primary-hover"
          onClick={(e) => e.preventDefault()}
        >
          Send Message
        </button>
      </form>
    );
  },
};

/**
 * Comprehensive grid showing all size/state combinations.
 */
export const AllCombinations: Story = {
  args: {},
  render: () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-sm font-medium text-text-primary">
        All Size/State Combinations
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Medium column */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Medium (md)</p>
          <Textarea size="md" placeholder="Empty" rows={2} />
          <Textarea size="md" defaultValue="Filled" rows={2} />
          <Textarea size="md" disabled placeholder="Disabled" rows={2} />
          <Textarea size="md" disabled defaultValue="Disabled filled" rows={2} />
          <Textarea size="md" error placeholder="Error" rows={2} />
          <Textarea size="md" error defaultValue="Error filled" rows={2} />
        </div>

        {/* Large column */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Large (lg)</p>
          <Textarea size="lg" placeholder="Empty" rows={2} />
          <Textarea size="lg" defaultValue="Filled" rows={2} />
          <Textarea size="lg" disabled placeholder="Disabled" rows={2} />
          <Textarea size="lg" disabled defaultValue="Disabled filled" rows={2} />
          <Textarea size="lg" error placeholder="Error" rows={2} />
          <Textarea size="lg" error defaultValue="Error filled" rows={2} />
        </div>
      </div>
    </div>
  ),
};

/**
 * Side-by-side comparison showing when to use Textarea vs TextareaField.
 */
export const WhenToUseWhich: Story = {
  args: {},
  render: () => (
    <div className="grid w-[700px] grid-cols-2 gap-8">
      {/* Textarea side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">Textarea (Standalone)</h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for custom layouts or textareas without labels
        </p>

        <div className="space-y-4">
          {/* Comment box example */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">
              Comment box (no label)
            </p>
            <Textarea placeholder="Write a comment..." rows={3} />
          </div>

          {/* Custom layout */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">Custom label layout</p>
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm font-medium">Description</span>
              <span className="text-xs text-text-tertiary">0/200</span>
            </div>
            <Textarea placeholder="Enter description..." rows={3} />
          </div>
        </div>
      </div>

      {/* TextareaField side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">TextareaField (Wrapper)</h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for standard form fields with labels
        </p>

        <div className="space-y-4">
          {/* Standard field */}
          <TextareaField
            label="Bio"
            labelProps={{ required: true }}
            hint="Tell us about yourself"
            placeholder="Enter your bio..."
            rows={3}
          />

          {/* Field with error */}
          <TextareaField
            label="Message"
            labelProps={{ required: true }}
            error="This field is required"
            placeholder="Enter message..."
            defaultValue=""
            rows={3}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Demonstrates both controlled and uncontrolled textarea patterns.
 */
export const ControlledVsUncontrolled: Story = {
  args: {},
  render: function ControlledExample() {
    const [controlled, setControlled] = useState('');

    return (
      <div className="flex w-[320px] flex-col gap-8">
        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Uncontrolled (uses defaultValue)
          </p>
          <TextareaField
            label="Uncontrolled textarea"
            defaultValue="Initial value"
            hint="Type to change - value managed internally"
            rows={3}
          />
        </div>

        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Controlled (uses value + onChange)
          </p>
          <TextareaField
            label="Controlled textarea"
            value={controlled}
            onChange={(e) => setControlled(e.target.value)}
            placeholder="Type here..."
            hint={`Current value: "${controlled.slice(0, 30)}${controlled.length > 30 ? '...' : ''}"`}
            rows={3}
          />
        </div>
      </div>
    );
  },
};
