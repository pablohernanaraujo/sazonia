import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { FileInputButton, TextInput } from '@/ui/inputs';

/**
 * The FileInputButton is a specialized button component designed to serve as
 * the trigger portion of a file input field. It is styled to visually attach
 * to the right side of a text input, creating a seamless composite input pattern.
 *
 * ## Features
 * - **3 Size Variants**: sm, md, lg
 * - **5 States**: default, hover, pressed, disabled, error
 * - **Right-side attachment styling**: rounded corners only on right (tr, br)
 * - **Left border omission**: seamlessly integrates with adjacent input field
 * - **Consistent typography**: Inter font family with font-medium weight
 *
 * ## Design Pattern
 * This component is designed to be composed with TextInput to create a file
 * input field:
 * ```
 * [TextInput (shows filename)][FileInputButton]
 *     ↑                              ↑
 * No right border/radius    No left border, right radius only
 * ```
 *
 * ## Accessibility
 * - Proper `type="button"` to prevent form submission
 * - Focus indicators with primary color ring (destructive when error)
 * - `aria-disabled` attribute when disabled
 * - Designed to work with hidden file inputs for full accessibility
 */
const meta = {
  title: 'Inputs/FileInputButton',
  component: FileInputButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Button text content (typically "Browse")',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant affecting height, padding, and typography',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button interaction',
    },
    error: {
      control: 'boolean',
      description: 'Error state - applies destructive border color',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    onClick: {
      action: 'clicked',
      description: 'Click event handler',
    },
  },
} satisfies Meta<typeof FileInputButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button with large size and "Browse" text.
 */
export const Default: Story = {
  args: {
    children: 'Browse',
    size: 'lg',
  },
};

/**
 * Comparison of all three sizes: SM, MD, LG.
 */
export const AllSizes: Story = {
  args: {
    children: 'Browse',
  },
  render: () => (
    <div className="flex items-end gap-4">
      <div className="text-center">
        <FileInputButton size="sm">Browse</FileInputButton>
        <p className="mt-2 text-xs text-text-subtle">SM</p>
      </div>
      <div className="text-center">
        <FileInputButton size="md">Browse</FileInputButton>
        <p className="mt-2 text-xs text-text-subtle">MD</p>
      </div>
      <div className="text-center">
        <FileInputButton size="lg">Browse</FileInputButton>
        <p className="mt-2 text-xs text-text-subtle">LG (default)</p>
      </div>
    </div>
  ),
};

/**
 * Visual demonstration of all interactive states.
 * Note: Hover and Active states can be seen by interacting with the buttons.
 */
export const AllStates: Story = {
  args: {
    children: 'Browse',
  },
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-20 text-sm text-text-subtle">Default</div>
        <FileInputButton>Browse</FileInputButton>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-20 text-sm text-text-subtle">Disabled</div>
        <FileInputButton disabled>Browse</FileInputButton>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-20 text-sm text-text-subtle">Error</div>
        <FileInputButton error>Browse</FileInputButton>
      </div>
      <p className="mt-4 text-xs text-text-secondary">
        * Hover, Active, and Focus states can be observed by interacting with the
        Default button
      </p>
    </div>
  ),
};

/**
 * Disabled state demonstration.
 */
export const DisabledState: Story = {
  args: {
    children: 'Browse',
    disabled: true,
  },
  render: () => (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="text-center">
          <FileInputButton size="sm" disabled>
            Browse
          </FileInputButton>
          <p className="mt-2 text-xs text-text-subtle">SM Disabled</p>
        </div>
        <div className="text-center">
          <FileInputButton size="md" disabled>
            Browse
          </FileInputButton>
          <p className="mt-2 text-xs text-text-subtle">MD Disabled</p>
        </div>
        <div className="text-center">
          <FileInputButton size="lg" disabled>
            Browse
          </FileInputButton>
          <p className="mt-2 text-xs text-text-subtle">LG Disabled</p>
        </div>
      </div>
      <p className="text-xs text-text-secondary">
        Disabled buttons have reduced opacity and cursor-not-allowed
      </p>
    </div>
  ),
};

/**
 * Error state demonstration.
 */
export const ErrorState: Story = {
  args: {
    children: 'Browse',
    error: true,
  },
  render: () => (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="text-center">
          <FileInputButton size="sm" error>
            Browse
          </FileInputButton>
          <p className="mt-2 text-xs text-text-subtle">SM Error</p>
        </div>
        <div className="text-center">
          <FileInputButton size="md" error>
            Browse
          </FileInputButton>
          <p className="mt-2 text-xs text-text-subtle">MD Error</p>
        </div>
        <div className="text-center">
          <FileInputButton size="lg" error>
            Browse
          </FileInputButton>
          <p className="mt-2 text-xs text-text-subtle">LG Error</p>
        </div>
      </div>
      <p className="text-xs text-text-secondary">
        Error state shows destructive border color and changes focus ring to
        destructive
      </p>
    </div>
  ),
};

/**
 * Real-world example showing button attached to TextInput.
 * Demonstrates the intended composition pattern with seamless borders.
 */
export const WithTextInput: Story = {
  args: {
    children: 'Browse',
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">Large Size</h3>
        <div className="inline-flex">
          <TextInput
            placeholder="No file selected"
            readOnly
            size="lg"
            wrapperClassName="rounded-r-none border-r-0"
          />
          <FileInputButton size="lg">Browse</FileInputButton>
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">Medium Size</h3>
        <div className="inline-flex">
          <TextInput
            placeholder="No file selected"
            readOnly
            size="md"
            wrapperClassName="rounded-r-none border-r-0"
          />
          <FileInputButton size="md">Browse</FileInputButton>
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">Small Size</h3>
        <div className="inline-flex">
          <TextInput
            placeholder="No file selected"
            readOnly
            size="sm"
            wrapperClassName="rounded-r-none border-r-0"
          />
          <FileInputButton size="sm">Browse</FileInputButton>
        </div>
      </div>
    </div>
  ),
};

/**
 * Complete file upload pattern example with error state.
 */
export const FileUploadPattern: Story = {
  args: {
    children: 'Browse',
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Default File Input
        </h3>
        <div className="inline-flex">
          <TextInput
            value="document.pdf"
            readOnly
            size="lg"
            wrapperClassName="rounded-r-none border-r-0"
          />
          <FileInputButton size="lg">Browse</FileInputButton>
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Error State (Invalid File)
        </h3>
        <div className="inline-flex">
          <TextInput
            value="invalid-file.exe"
            readOnly
            size="lg"
            error
            wrapperClassName="rounded-r-none border-r-0"
          />
          <FileInputButton size="lg" error>
            Browse
          </FileInputButton>
        </div>
        <p className="mt-2 text-sm text-destructive">
          File type not allowed. Please select a PDF or image file.
        </p>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Disabled State
        </h3>
        <div className="inline-flex">
          <TextInput
            value="locked-document.pdf"
            readOnly
            disabled
            size="lg"
            wrapperClassName="rounded-r-none border-r-0"
          />
          <FileInputButton size="lg" disabled>
            Browse
          </FileInputButton>
        </div>
        <p className="mt-2 text-sm text-text-subtle">
          File selection is disabled
        </p>
      </div>
    </div>
  ),
};

/**
 * Complete matrix showing all size × state combinations.
 */
export const CompleteMatrix: Story = {
  args: {
    children: 'Browse',
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Size × State Matrix</h3>
        <div className="overflow-auto">
          <table className="text-sm">
            <thead>
              <tr>
                <th className="p-3 text-left text-text-subtle">Size</th>
                <th className="p-3 text-center text-text-subtle">Default</th>
                <th className="p-3 text-center text-text-subtle">Error</th>
                <th className="p-3 text-center text-text-subtle">Disabled</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 text-text-subtle">SM</td>
                <td className="p-3 text-center">
                  <FileInputButton size="sm">Browse</FileInputButton>
                </td>
                <td className="p-3 text-center">
                  <FileInputButton size="sm" error>
                    Browse
                  </FileInputButton>
                </td>
                <td className="p-3 text-center">
                  <FileInputButton size="sm" disabled>
                    Browse
                  </FileInputButton>
                </td>
              </tr>
              <tr>
                <td className="p-3 text-text-subtle">MD</td>
                <td className="p-3 text-center">
                  <FileInputButton size="md">Browse</FileInputButton>
                </td>
                <td className="p-3 text-center">
                  <FileInputButton size="md" error>
                    Browse
                  </FileInputButton>
                </td>
                <td className="p-3 text-center">
                  <FileInputButton size="md" disabled>
                    Browse
                  </FileInputButton>
                </td>
              </tr>
              <tr>
                <td className="p-3 text-text-subtle">LG</td>
                <td className="p-3 text-center">
                  <FileInputButton size="lg">Browse</FileInputButton>
                </td>
                <td className="p-3 text-center">
                  <FileInputButton size="lg" error>
                    Browse
                  </FileInputButton>
                </td>
                <td className="p-3 text-center">
                  <FileInputButton size="lg" disabled>
                    Browse
                  </FileInputButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ),
};

/**
 * Functional file selection demo with state management showing actual
 * file picker integration.
 */
export const InteractiveDemo: Story = {
  args: {
    children: 'Browse',
  },
  render: function InteractiveDemoRender() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const isValidType = [
          'application/pdf',
          'image/png',
          'image/jpeg',
        ].includes(file.type);
        setFileName(file.name);
        setError(!isValidType);
      }
    };

    const handleBrowseClick = () => {
      fileInputRef.current?.click();
    };

    const handleClear = () => {
      setFileName('');
      setError(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    return (
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          onChange={handleFileChange}
          accept=".pdf,.png,.jpg,.jpeg"
        />
        <div className="inline-flex">
          <TextInput
            value={fileName}
            placeholder="No file selected"
            readOnly
            size="lg"
            error={error}
            wrapperClassName="rounded-r-none border-r-0 min-w-[250px]"
          />
          <FileInputButton size="lg" error={error} onClick={handleBrowseClick}>
            Browse
          </FileInputButton>
        </div>
        {error && (
          <p className="text-sm text-destructive">
            Invalid file type. Please select a PDF or image file.
          </p>
        )}
        {fileName && !error && (
          <p className="text-sm text-text-subtle">
            Selected: {fileName}
            <button
              onClick={handleClear}
              className="ml-2 text-primary hover:underline"
            >
              Clear
            </button>
          </p>
        )}
        <p className="text-xs text-text-secondary">
          Click &quot;Browse&quot; to select a file. Accepts: PDF, PNG, JPEG
        </p>
      </div>
    );
  },
};

/**
 * Documents proper aria-label usage, keyboard navigation, and screen reader
 * considerations.
 */
export const AccessibilityExample: Story = {
  args: {
    children: 'Browse',
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Pattern 1: Using Label with Hidden File Input
        </h3>
        <div className="rounded border border-border bg-background-secondary p-4">
          <div className="mb-3 inline-flex">
            <TextInput
              placeholder="No file selected"
              readOnly
              size="lg"
              wrapperClassName="rounded-r-none border-r-0"
              aria-label="Selected file name"
            />
            <FileInputButton size="lg" aria-label="Browse for file to upload">
              Browse
            </FileInputButton>
          </div>
          <div className="text-xs text-text-subtle">
            <strong>Accessibility features:</strong>
            <ul className="mt-1 list-disc pl-4">
              <li>Button has aria-label for clear screen reader announcement</li>
              <li>Input has aria-label describing its purpose</li>
              <li>Focus ring indicates keyboard focus</li>
              <li>Tab navigation works naturally</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Pattern 2: With Form Field Label
        </h3>
        <div className="rounded border border-border bg-background-secondary p-4">
          <label className="mb-2 block text-sm font-medium" htmlFor="resume">
            Resume Upload
          </label>
          <div className="mb-3 inline-flex">
            <TextInput
              id="resume"
              placeholder="Choose your resume file"
              readOnly
              size="lg"
              wrapperClassName="rounded-r-none border-r-0"
            />
            <FileInputButton size="lg" aria-label="Browse for resume file">
              Browse
            </FileInputButton>
          </div>
          <div className="text-xs text-text-subtle">
            <strong>Accessibility features:</strong>
            <ul className="mt-1 list-disc pl-4">
              <li>Label element associated with input via htmlFor/id</li>
              <li>Button has contextual aria-label</li>
              <li>Screen readers announce full context</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          Keyboard Navigation
        </h3>
        <div className="rounded border border-border bg-background-secondary p-4">
          <p className="mb-3 text-sm">
            The FileInputButton supports full keyboard navigation:
          </p>
          <ul className="list-disc pl-4 text-sm text-text-subtle">
            <li>
              <code className="rounded bg-background px-1">Tab</code> - Focus the
              button
            </li>
            <li>
              <code className="rounded bg-background px-1">Enter</code> or{' '}
              <code className="rounded bg-background px-1">Space</code> - Activate
              the button
            </li>
            <li>
              Focus ring appears only on keyboard navigation (focus-visible)
            </li>
            <li>Disabled state prevents keyboard activation</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};
