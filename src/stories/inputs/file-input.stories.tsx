import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { FileInput, type FileInputValue } from '@/ui/inputs';

/**
 * The FileInput is a composite form component for file selection that combines
 * a text display area, action button, and supporting elements (label, hint, error).
 *
 * ## Features
 * - **3 Size Variants**: sm, md, lg
 * - **Multiple States**: empty, uploading, uploaded, disabled, error
 * - **Composed from atoms**: InputLabel, Hint, ErrorMessage, FileInputButton
 * - **Full accessibility**: ARIA attributes, keyboard navigation, screen reader support
 *
 * ## Usage Patterns
 *
 * **Uncontrolled mode** (simple):
 * ```tsx
 * <FileInput
 *   label="Upload Resume"
 *   onChange={(file) => handleFileSelect(file)}
 * />
 * ```
 *
 * **Controlled mode** (full control):
 * ```tsx
 * <FileInput
 *   label="Upload Resume"
 *   value={{ name: 'resume.pdf', size: '2.5 MB' }}
 *   state="uploaded"
 *   onRemove={() => clearFile()}
 * />
 * ```
 *
 * ## Accessibility
 * - Hidden native file input with sr-only
 * - Label association via htmlFor/id
 * - ARIA descriptions for hints and errors
 * - Keyboard navigation support
 */
const meta = {
  title: 'Inputs/FileInput',
  component: FileInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant affecting height, padding, and typography',
    },
    state: {
      control: 'select',
      options: ['empty', 'uploading', 'uploaded'],
      description: 'Visual state of the file input',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input interaction',
    },
    error: {
      control: 'boolean',
      description: 'Error state - applies destructive styling',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display below the input',
    },
    label: {
      control: 'text',
      description: 'Label text for the input',
    },
    hint: {
      control: 'text',
      description: 'Hint text to display below the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no file is selected',
    },
    accept: {
      control: 'text',
      description: 'File types to accept (e.g., ".pdf,.jpg")',
    },
  },
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default FileInput with placeholder text.
 */
export const Default: Story = {
  args: {
    placeholder: 'No file chosen',
  },
};

/**
 * Comparison of all three sizes: SM, MD, LG.
 */
export const AllSizes: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-subtle">SM</p>
        <FileInput size="sm" placeholder="No file chosen" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-subtle">MD</p>
        <FileInput size="md" placeholder="No file chosen" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-subtle">LG (default)</p>
        <FileInput size="lg" placeholder="No file chosen" />
      </div>
    </div>
  ),
};

/**
 * Visual demonstration of all states: Empty, Uploading, Uploaded.
 */
export const AllStates: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-subtle">Empty</p>
        <FileInput state="empty" placeholder="No file chosen" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-subtle">Uploading</p>
        <FileInput
          state="uploading"
          value={{ name: 'document.pdf', progress: 45 }}
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-subtle">Uploaded</p>
        <FileInput
          state="uploaded"
          value={{ name: 'document.pdf', size: '2.5 MB' }}
        />
      </div>
    </div>
  ),
};

/**
 * FileInput with label integration.
 */
export const WithLabel: Story = {
  args: {
    label: 'Upload Document',
    placeholder: 'Choose a file',
  },
};

/**
 * FileInput with hint text.
 */
export const WithHint: Story = {
  args: {
    label: 'Resume',
    hint: 'PDF or Word document, max 5MB',
    placeholder: 'Select your resume',
  },
};

/**
 * FileInput with error state and message.
 */
export const WithError: Story = {
  args: {
    label: 'Required Document',
    error: true,
    errorMessage: 'This field is required',
    placeholder: 'No file chosen',
  },
};

/**
 * FileInput showing uploading state with spinner and Cancel button.
 */
export const UploadingState: Story = {
  args: {
    label: 'Uploading File',
    state: 'uploading',
    value: { name: 'report-2024.pdf', progress: 67 },
  },
};

/**
 * FileInput showing uploaded state with file info and Remove button.
 */
export const UploadedState: Story = {
  args: {
    label: 'Uploaded File',
    state: 'uploaded',
    value: { name: 'annual-report.pdf', size: '3.2 MB' },
  },
};

/**
 * Disabled state variations.
 */
export const DisabledStates: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-subtle">Disabled (Empty)</p>
        <FileInput disabled label="Upload File" placeholder="No file chosen" />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-subtle">Disabled (With File)</p>
        <FileInput
          disabled
          label="Upload File"
          state="uploaded"
          value={{ name: 'locked-document.pdf', size: '1.5 MB' }}
        />
      </div>
    </div>
  ),
};

/**
 * Error state variations.
 */
export const ErrorStates: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs text-text-subtle">Error (Empty)</p>
        <FileInput
          error
          errorMessage="Please select a file"
          label="Required Document"
          placeholder="No file chosen"
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-text-subtle">Error (With File)</p>
        <FileInput
          error
          errorMessage="Invalid file type. Please select a PDF file."
          label="Required Document"
          state="uploaded"
          value={{ name: 'image.exe', size: '4.2 MB' }}
        />
      </div>
    </div>
  ),
};

/**
 * Complete matrix showing all size × state combinations.
 */
export const CompleteMatrix: Story = {
  args: {},
  render: () => (
    <div className="overflow-auto">
      <table className="text-sm">
        <thead>
          <tr>
            <th className="p-3 text-left text-text-subtle">Size</th>
            <th className="p-3 text-center text-text-subtle">Empty</th>
            <th className="p-3 text-center text-text-subtle">Uploading</th>
            <th className="p-3 text-center text-text-subtle">Uploaded</th>
            <th className="p-3 text-center text-text-subtle">Error</th>
            <th className="p-3 text-center text-text-subtle">Disabled</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 text-text-subtle">SM</td>
            <td className="p-3">
              <FileInput size="sm" />
            </td>
            <td className="p-3">
              <FileInput
                size="sm"
                state="uploading"
                value={{ name: 'file.pdf' }}
              />
            </td>
            <td className="p-3">
              <FileInput
                size="sm"
                state="uploaded"
                value={{ name: 'file.pdf', size: '1 MB' }}
              />
            </td>
            <td className="p-3">
              <FileInput size="sm" error />
            </td>
            <td className="p-3">
              <FileInput size="sm" disabled />
            </td>
          </tr>
          <tr>
            <td className="p-3 text-text-subtle">MD</td>
            <td className="p-3">
              <FileInput size="md" />
            </td>
            <td className="p-3">
              <FileInput
                size="md"
                state="uploading"
                value={{ name: 'file.pdf' }}
              />
            </td>
            <td className="p-3">
              <FileInput
                size="md"
                state="uploaded"
                value={{ name: 'file.pdf', size: '1 MB' }}
              />
            </td>
            <td className="p-3">
              <FileInput size="md" error />
            </td>
            <td className="p-3">
              <FileInput size="md" disabled />
            </td>
          </tr>
          <tr>
            <td className="p-3 text-text-subtle">LG</td>
            <td className="p-3">
              <FileInput size="lg" />
            </td>
            <td className="p-3">
              <FileInput
                size="lg"
                state="uploading"
                value={{ name: 'file.pdf' }}
              />
            </td>
            <td className="p-3">
              <FileInput
                size="lg"
                state="uploaded"
                value={{ name: 'file.pdf', size: '1 MB' }}
              />
            </td>
            <td className="p-3">
              <FileInput size="lg" error />
            </td>
            <td className="p-3">
              <FileInput size="lg" disabled />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

/**
 * Functional file selection demo with actual state management.
 */
export const InteractiveDemo: Story = {
  args: {},
  render: function InteractiveDemoRender() {
    const [fileValue, setFileValue] = useState<FileInputValue | null>(null);
    const [state, setState] = useState<'empty' | 'uploading' | 'uploaded'>(
      'empty'
    );
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (file: File | null) => {
      if (!file) return;

      // Validate file type
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please select PDF, PNG, or JPEG.');
        setFileValue({ name: file.name });
        setState('uploaded');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('File too large. Maximum size is 5MB.');
        setFileValue({ name: file.name });
        setState('uploaded');
        return;
      }

      setError(null);

      // Simulate upload
      setFileValue({ name: file.name, progress: 0 });
      setState('uploading');

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
          clearInterval(interval);
          setFileValue({
            name: file.name,
            size: formatFileSize(file.size),
          });
          setState('uploaded');
        } else {
          setFileValue({ name: file.name, progress });
        }
      }, 200);
    };

    const handleRemove = () => {
      setFileValue(null);
      setState('empty');
      setError(null);
    };

    const handleCancel = () => {
      setFileValue(null);
      setState('empty');
      setError(null);
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
      <div className="w-[400px] space-y-4">
        <FileInput
          label="Upload Document"
          hint="Accepts PDF, PNG, JPEG. Max 5MB."
          state={state}
          value={fileValue}
          error={!!error}
          errorMessage={error ?? undefined}
          onChange={handleFileChange}
          onRemove={handleRemove}
          onCancel={handleCancel}
          accept=".pdf,.png,.jpg,.jpeg"
        />
        <div className="rounded bg-background-secondary p-3 text-xs">
          <p>
            <strong>Current state:</strong> {state}
          </p>
          <p>
            <strong>File value:</strong>{' '}
            {fileValue ? JSON.stringify(fileValue) : 'null'}
          </p>
          <p>
            <strong>Error:</strong> {error ?? 'none'}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Real-world form integration example with validation.
 */
export const FormIntegration: Story = {
  args: {},
  render: function FormIntegrationRender() {
    const [resume, setResume] = useState<File | null>(null);
    const [coverLetter, setCoverLetter] = useState<File | null>(null);
    const [resumeError, setResumeError] = useState<string | null>(null);

    const formatSize = (bytes: number) =>
      `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!resume) {
        setResumeError('Resume is required');
        return;
      }

      alert(
        `Form submitted!\nResume: ${resume.name}\nCover Letter: ${coverLetter?.name ?? 'Not provided'}`
      );
    };

    return (
      <form onSubmit={handleSubmit} className="w-[400px] space-y-6">
        <h3 className="text-lg font-semibold">Job Application</h3>

        <FileInput
          label="Resume"
          labelProps={{ required: true }}
          hint="PDF only, max 10MB"
          state={resume ? 'uploaded' : 'empty'}
          value={
            resume ? { name: resume.name, size: formatSize(resume.size) } : null
          }
          error={!!resumeError}
          errorMessage={resumeError ?? undefined}
          accept=".pdf"
          onChange={(file) => {
            setResume(file);
            setResumeError(null);
          }}
          onRemove={() => setResume(null)}
        />

        <FileInput
          label="Cover Letter"
          hint="Optional. PDF or Word document."
          state={coverLetter ? 'uploaded' : 'empty'}
          value={
            coverLetter
              ? { name: coverLetter.name, size: formatSize(coverLetter.size) }
              : null
          }
          accept=".pdf,.doc,.docx"
          onChange={(file) => setCoverLetter(file)}
          onRemove={() => setCoverLetter(null)}
        />

        <button
          type="submit"
          className="w-full rounded-sm bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Submit Application
        </button>
      </form>
    );
  },
};

/**
 * Documents accessibility features and keyboard navigation.
 */
export const AccessibilityExample: Story = {
  args: {},
  render: () => (
    <div className="max-w-[500px] space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          1. Label Association
        </h3>
        <div className="rounded border border-border bg-background-secondary p-4">
          <FileInput
            id="a11y-demo"
            label="Upload Profile Photo"
            hint="The label is properly associated with the hidden file input"
          />
          <p className="mt-3 text-xs text-text-subtle">
            The label element has <code>htmlFor</code> pointing to the input{' '}
            <code>id</code>.
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          2. ARIA Descriptions
        </h3>
        <div className="rounded border border-border bg-background-secondary p-4">
          <FileInput
            label="Document with Error"
            error
            errorMessage="File type not supported"
          />
          <p className="mt-3 text-xs text-text-subtle">
            The input has <code>aria-invalid=&quot;true&quot;</code> and{' '}
            <code>aria-describedby</code> pointing to the error message. The error
            message has <code>role=&quot;alert&quot;</code>.
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          3. Button States
        </h3>
        <div className="space-y-4 rounded border border-border bg-background-secondary p-4">
          <div>
            <p className="mb-2 text-xs text-text-subtle">
              Browse (aria-label: &quot;Browse for file&quot;)
            </p>
            <FileInput />
          </div>
          <div>
            <p className="mb-2 text-xs text-text-subtle">
              Cancel (aria-label: &quot;Cancel upload&quot;)
            </p>
            <FileInput state="uploading" value={{ name: 'file.pdf' }} />
          </div>
          <div>
            <p className="mb-2 text-xs text-text-subtle">
              Remove (aria-label: &quot;Remove file&quot;)
            </p>
            <FileInput state="uploaded" value={{ name: 'file.pdf' }} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          4. Keyboard Navigation
        </h3>
        <div className="rounded border border-border bg-background-secondary p-4">
          <ul className="list-disc pl-4 text-sm text-text-subtle">
            <li>
              <code className="rounded bg-background px-1">Tab</code> - Navigate
              to the Browse button
            </li>
            <li>
              <code className="rounded bg-background px-1">Enter</code> or{' '}
              <code className="rounded bg-background px-1">Space</code> - Opens
              file picker
            </li>
            <li>Focus ring indicates keyboard focus (focus-visible)</li>
            <li>
              Clicking the display area also opens file picker (empty state only)
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-subtle">
          5. Screen Reader Experience
        </h3>
        <div className="rounded border border-border bg-background-secondary p-4">
          <p className="text-sm text-text-subtle">
            Screen readers will announce:
          </p>
          <ul className="mt-2 list-disc pl-4 text-sm text-text-subtle">
            <li>Label text when focusing the input</li>
            <li>Current file name if one is selected</li>
            <li>
              Error messages via role=&quot;alert&quot; (announced immediately)
            </li>
            <li>Hint text via aria-describedby</li>
            <li>Button purpose via aria-label</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};

/**
 * Shows different file type configurations.
 */
export const FileTypeExamples: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-6">
      <FileInput
        label="Image Upload"
        hint="Accepts: PNG, JPG, GIF, WebP"
        accept="image/png,image/jpeg,image/gif,image/webp"
        placeholder="Select an image"
      />
      <FileInput
        label="Document Upload"
        hint="Accepts: PDF, Word, Excel"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        placeholder="Select a document"
      />
      <FileInput
        label="Any File"
        hint="All file types accepted"
        placeholder="Select any file"
      />
    </div>
  ),
};

/**
 * Long file name handling.
 */
export const LongFileName: Story = {
  args: {
    label: 'Document',
    state: 'uploaded',
    value: {
      name: 'this-is-a-very-long-filename-that-should-be-truncated-properly-in-the-display-area.pdf',
      size: '2.3 MB',
    },
    wrapperClassName: 'w-[300px]',
  },
};
