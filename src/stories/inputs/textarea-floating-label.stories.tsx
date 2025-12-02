import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextareaFloatingLabel, TextareaFloatingLabelField } from '@/ui/inputs';

/**
 * TextareaFloatingLabel is an enhanced multi-line text input component that features
 * a floating label animation pattern. When the textarea is empty, the label appears
 * as placeholder text inside the field. Upon focus or when the textarea has a value,
 * the label smoothly animates to float above the textarea border.
 *
 * ## Dual API Approach
 *
 * This package provides two components:
 *
 * 1. **TextareaFloatingLabel** (molecule) - Standalone textarea with floating label
 * 2. **TextareaFloatingLabelField** (organism) - Wrapper with hint/error composition
 *
 * ## Features
 *
 * - **Floating label animation**: Label smoothly transitions from placeholder to floating position
 * - **Visual states**: Empty, Hovered, Focused, Typing, Filled, Disabled, Error
 * - **Multi-line input**: Supports multiple rows of text
 * - **Resizable**: Native browser resize handle preserved (vertical only)
 *
 * ## When to Use TextareaFloatingLabel vs TextareaFloatingLabelField
 *
 * Use **TextareaFloatingLabel** when:
 * - You need custom layout (e.g., textarea alongside other elements)
 * - You want to compose hint/error manually
 * - You need the textarea without additional wrapper elements
 *
 * Use **TextareaFloatingLabelField** when:
 * - You have a standard form field with hint and/or error
 * - You want automatic ID generation and ARIA associations
 * - You want the convenience of a single component
 */
const meta = {
  title: 'Inputs/TextareaFloatingLabel',
  component: TextareaFloatingLabel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The floating label text',
    },
    required: {
      control: 'boolean',
      description: 'Shows required indicator (*)',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: 'boolean',
      description: 'Error state - applies destructive styling',
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
      description: 'Placeholder text (only visible when label is floating)',
    },
    rows: {
      control: 'number',
      description: 'Number of visible text rows',
      table: {
        defaultValue: { summary: '4' },
      },
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
} satisfies Meta<typeof TextareaFloatingLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default TextareaFloatingLabel in empty state.
 * Click the textarea to see the label float animation.
 */
export const Default: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter your description...',
    rows: 4,
  },
};

/**
 * Grid showing all 9 visual states from the Figma design:
 * Empty, Hovered, Focused, Typing, Filled, Disabled, Disabled-Filled, Error, Error-Filled
 */
export const AllStates: Story = {
  args: {
    label: 'All states',
  },
  render: () => (
    <div className="grid w-[700px] grid-cols-2 gap-6">
      {/* Empty State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Empty (hover to see hover state)
        </p>
        <TextareaFloatingLabel
          label="Description"
          placeholder="Enter description..."
          rows={3}
        />
      </div>

      {/* Focused State - Simulated with description */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">
          Focused (click textarea to see)
        </p>
        <TextareaFloatingLabel
          label="Description"
          placeholder="Enter description..."
          rows={3}
        />
      </div>

      {/* Filled State */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Filled</p>
        <TextareaFloatingLabel
          label="Description"
          defaultValue="This is some filled content in the textarea that demonstrates the filled state."
          rows={3}
        />
      </div>

      {/* Disabled Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (empty)</p>
        <TextareaFloatingLabel label="Description" disabled rows={3} />
      </div>

      {/* Disabled Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Disabled (filled)</p>
        <TextareaFloatingLabel
          label="Description"
          disabled
          defaultValue="Disabled textarea with content"
          rows={3}
        />
      </div>

      {/* Error Empty */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (empty)</p>
        <TextareaFloatingLabel label="Description" error rows={3} />
      </div>

      {/* Error Filled */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Error (filled)</p>
        <TextareaFloatingLabel
          label="Description"
          error
          defaultValue="Invalid content"
          rows={3}
        />
      </div>

      {/* With Required Indicator */}
      <div>
        <p className="mb-2 text-xs text-text-tertiary">Required</p>
        <TextareaFloatingLabel label="Description" required rows={3} />
      </div>
    </div>
  ),
};

// =============================================
// TextareaFloatingLabelField Stories (Organism)
// =============================================

/**
 * TextareaFloatingLabelField with hint text.
 * The hint provides additional context below the textarea.
 */
export const WithHint: Story = {
  args: {
    label: 'Description',
  },
  render: () => (
    <div className="w-[320px]">
      <TextareaFloatingLabelField
        label="Description"
        hint="Provide a detailed description of your request."
        placeholder="Enter description..."
        rows={4}
      />
    </div>
  ),
};

/**
 * TextareaFloatingLabelField with error state.
 * Notice how the error message replaces the hint and applies error styling.
 */
export const WithError: Story = {
  args: {
    label: 'Description',
  },
  render: () => (
    <div className="w-[320px]">
      <TextareaFloatingLabelField
        label="Description"
        hint="Provide a detailed description."
        errorMessage="Description must be at least 50 characters."
        defaultValue="Too short"
        rows={4}
      />
    </div>
  ),
};

/**
 * Real-world form example using TextareaFloatingLabelField components.
 * Demonstrates a typical contact form with floating labels and character counting.
 */
export const FormIntegration: Story = {
  args: {
    label: 'Form example',
  },
  render: function FormExample() {
    const [message, setMessage] = useState('');
    const maxLength = 500;

    return (
      <form className="w-[400px] space-y-5 rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold">Contact Form</h3>

        <TextareaFloatingLabelField
          label="Subject"
          required
          placeholder="What is this about?"
          rows={1}
        />

        <TextareaFloatingLabelField
          label="Message"
          required
          hint={`${message.length}/${maxLength} characters`}
          placeholder="Tell us more..."
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
          maxLength={maxLength}
        />

        <TextareaFloatingLabelField
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
 * Demonstrates both controlled and uncontrolled textarea patterns.
 */
export const Controlled: Story = {
  args: {
    label: 'Controlled example',
  },
  render: function ControlledExample() {
    const [controlled, setControlled] = useState('');

    return (
      <div className="flex w-[320px] flex-col gap-8">
        <div>
          <p className="mb-3 text-xs text-text-tertiary">
            Uncontrolled (uses defaultValue)
          </p>
          <TextareaFloatingLabelField
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
          <TextareaFloatingLabelField
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

/**
 * Comprehensive grid showing all combinations of states.
 */
export const AllCombinations: Story = {
  args: {
    label: 'All combinations',
  },
  render: () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-sm font-medium text-text-primary">
        All State Combinations
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Standard States */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">Standard</p>
          <TextareaFloatingLabel label="Empty" rows={2} />
          <TextareaFloatingLabel label="Filled" defaultValue="Value" rows={2} />
          <TextareaFloatingLabel label="Required" required rows={2} />
          <TextareaFloatingLabel label="Disabled" disabled rows={2} />
          <TextareaFloatingLabel
            label="Disabled Filled"
            disabled
            defaultValue="Value"
            rows={2}
          />
          <TextareaFloatingLabel label="Error" error rows={2} />
          <TextareaFloatingLabel
            label="Error Filled"
            error
            defaultValue="Invalid"
            rows={2}
          />
        </div>

        {/* With Field Wrapper */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-text-tertiary">
            With Field Wrapper
          </p>
          <TextareaFloatingLabelField
            label="With Hint"
            hint="Hint text"
            rows={2}
          />
          <TextareaFloatingLabelField
            label="With Error"
            errorMessage="Error message"
            rows={2}
          />
          <TextareaFloatingLabelField
            label="Required"
            required
            hint="Required field"
            rows={2}
          />
          <TextareaFloatingLabelField
            label="Filled"
            defaultValue="Some value"
            hint="Has value"
            rows={2}
          />
          <TextareaFloatingLabelField
            label="Error + Filled"
            errorMessage="Invalid"
            defaultValue="Bad value"
            rows={2}
          />
          <TextareaFloatingLabelField
            label="Disabled"
            disabled
            hint="Cannot edit"
            rows={2}
          />
          <TextareaFloatingLabelField
            label="Disabled + Filled"
            disabled
            defaultValue="Read only"
            hint="Read only value"
            rows={2}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Side-by-side comparison showing when to use TextareaFloatingLabel vs TextareaFloatingLabelField.
 */
export const StandaloneVsField: Story = {
  args: {
    label: 'Standalone vs Field',
  },
  render: () => (
    <div className="grid w-[700px] grid-cols-2 gap-8">
      {/* TextareaFloatingLabel side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">
          TextareaFloatingLabel (Standalone)
        </h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for custom layouts or when composing manually
        </p>

        <div className="space-y-4">
          {/* Comment box example */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">
              Standalone comment box
            </p>
            <TextareaFloatingLabel
              label="Comment"
              placeholder="Write a comment..."
              rows={3}
            />
          </div>

          {/* Custom layout example */}
          <div>
            <p className="mb-2 text-xs text-text-tertiary">
              Custom composition (with character count)
            </p>
            <div className="flex flex-col gap-1">
              <TextareaFloatingLabel
                label="Bio"
                placeholder="Tell us about yourself..."
                rows={4}
              />
              <div className="flex justify-end">
                <span className="text-xs text-text-tertiary">0/200</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TextareaFloatingLabelField side */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-sm font-semibold">
          TextareaFloatingLabelField (Wrapper)
        </h3>
        <p className="mb-4 text-xs text-text-tertiary">
          Use for standard form fields with hint/error
        </p>

        <div className="space-y-4">
          {/* Standard field */}
          <TextareaFloatingLabelField
            label="Description"
            required
            hint="Provide a detailed description"
            placeholder="Enter description..."
            rows={3}
          />

          {/* Field with error */}
          <TextareaFloatingLabelField
            label="Feedback"
            required
            errorMessage="Feedback is required"
            defaultValue=""
            rows={3}
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Demonstrates the floating label animation in action.
 * Click each textarea to see the label animate to the floating position.
 */
export const AnimationDemo: Story = {
  args: {
    label: 'Animation demo',
  },
  render: function AnimationDemoComponent() {
    return (
      <div className="flex w-[320px] flex-col gap-6">
        <div>
          <p className="mb-2 text-sm text-text-primary">
            Click each textarea to see the floating label animation
          </p>
        </div>

        <TextareaFloatingLabel
          label="Short description"
          placeholder="Brief summary..."
          rows={2}
        />

        <TextareaFloatingLabel
          label="Detailed message"
          placeholder="Tell us more about your request..."
          rows={4}
        />

        <TextareaFloatingLabel
          label="Additional comments"
          placeholder="Any other information..."
          rows={3}
        />
      </div>
    );
  },
};

/**
 * Demonstrates different rows configurations.
 */
export const RowsConfiguration: Story = {
  args: {
    label: 'Rows configuration',
  },
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-tertiary">2 rows (compact)</p>
        <TextareaFloatingLabel
          label="Short note"
          placeholder="Quick note..."
          rows={2}
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">4 rows (default)</p>
        <TextareaFloatingLabel
          label="Description"
          placeholder="Enter description..."
          rows={4}
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-tertiary">8 rows (expanded)</p>
        <TextareaFloatingLabel
          label="Long form content"
          placeholder="Write your detailed content here..."
          rows={8}
        />
      </div>
    </div>
  ),
};
