import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  ReactElement,
  ReactNode,
  useId,
  useRef,
} from 'react';
import { CircleNotch } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icon } from '@/ui/icons';

import { ErrorMessage } from './error-message';
import { FileInputButton } from './file-input-button';
import { Hint } from './hint';
import { InputLabel, type InputLabelProps } from './input-label';

/**
 * FileInput display area variants for the container that shows file name/placeholder.
 *
 * Size variants match TextInput sizing:
 * - `sm`: Small (py-1.5 px-3, text-sm)
 * - `md`: Medium (py-2.5 px-3, text-sm)
 * - `lg`: Large (py-3 px-4, text-base) - default
 */
const fileInputDisplayVariants = cva(
  [
    'flex flex-1 items-center',
    'min-w-0',
    'rounded-l-sm',
    'border border-r-0',
    'bg-background',
    'transition-colors duration-150',
    // Truncate long file names
    'overflow-hidden',
  ],
  {
    variants: {
      size: {
        sm: 'gap-2 rounded-l-xs px-3 py-1.5 text-sm leading-5',
        md: 'gap-2.5 px-3 py-2.5 text-sm leading-5',
        lg: 'gap-3 px-4 py-3 text-base leading-6',
      },
      error: {
        true: 'border-destructive shadow-[0px_0px_0px_3px_#fdd8d3]',
        false: 'border-border group-hover:border-border-hover',
      },
      disabled: {
        true: 'cursor-not-allowed bg-background-secondary',
        false: '',
      },
      focused: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        focused: true,
        error: false,
        className: 'border-primary ring-2 ring-primary/20',
      },
      {
        focused: true,
        error: true,
        className: 'border-destructive ring-2 ring-destructive/20',
      },
    ],
    defaultVariants: {
      size: 'lg',
      error: false,
      disabled: false,
      focused: false,
    },
  }
);

export type FileInputDisplayVariants = VariantProps<
  typeof fileInputDisplayVariants
>;

/**
 * Value type for controlled file input state
 */
export interface FileInputValue {
  /** File name to display */
  name: string;
  /** File size to display (formatted string like "2.5 MB") */
  size?: string;
  /** Upload progress percentage (0-100) for uploading state */
  progress?: number;
}

/**
 * Visual state of the file input
 */
export type FileInputState = 'empty' | 'uploading' | 'uploaded';

// Helper functions extracted to reduce component complexity

/** Get display text based on state and value */
function getDisplayText(
  state: FileInputState,
  value: FileInputValue | null | undefined,
  placeholder: string
): string {
  if (state === 'empty' || !value) {
    return placeholder;
  }
  if (value.size) {
    return `${value.name} (${value.size})`;
  }
  return value.name;
}

/** Button configuration options */
interface ButtonConfigOptions {
  state: FileInputState;
  value: FileInputValue | null | undefined;
  onCancel?: () => void;
  onRemove?: () => void;
}

/** Button config result type */
interface ButtonConfig {
  text: string;
  actionType: 'cancel' | 'remove' | 'browse';
  action?: () => void;
  ariaLabel: string;
}

/** Get button configuration based on state */
function getButtonConfig(options: ButtonConfigOptions): ButtonConfig {
  const { state, value, onCancel, onRemove } = options;
  if (state === 'uploading') {
    return {
      text: 'Cancel',
      actionType: 'cancel',
      action: onCancel,
      ariaLabel: 'Cancel upload',
    };
  }
  if (state === 'uploaded' && value) {
    return {
      text: 'Remove',
      actionType: 'remove',
      action: onRemove,
      ariaLabel: 'Remove file',
    };
  }
  return {
    text: 'Browse',
    actionType: 'browse',
    action: undefined,
    ariaLabel: 'Browse for file',
  };
}

/** Build aria-describedby string */
function buildDescribedBy(
  ariaDescribedBy: string | undefined,
  hintId: string | undefined,
  errorId: string | undefined
): string {
  return [ariaDescribedBy, hintId, errorId].filter(Boolean).join(' ');
}

/** Get size mappings for label and hint */
function getSizeMappings(size: 'sm' | 'md' | 'lg'): {
  labelSize: 'sm' | 'md';
  hintSize: 'sm' | 'md';
} {
  const mappedSize = size === 'sm' ? 'sm' : 'md';
  return { labelSize: mappedSize, hintSize: mappedSize };
}

/** Create ref callback for forwarding refs */
function createRefCallback(
  forwardedRef: ForwardedRef<HTMLInputElement>,
  internalRef: MutableRefObject<HTMLInputElement | null>
): (node: HTMLInputElement | null) => void {
  return (node: HTMLInputElement | null): void => {
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
    internalRef.current = node;
  };
}

/** Get display text class name */
function getDisplayTextClassName(
  isPlaceholder: boolean,
  disabled: boolean | undefined
): string {
  return cn(
    'truncate',
    isPlaceholder ? 'text-text-tertiary' : 'text-text-primary',
    disabled && 'opacity-52'
  );
}

/** Label render options */
interface LabelRenderOptions {
  label: string | undefined;
  htmlFor: string;
  size: 'sm' | 'md';
  labelProps?: Omit<InputLabelProps, 'label' | 'htmlFor' | 'size'>;
}

/** Conditionally render the label */
function renderLabel(options: LabelRenderOptions): ReactNode {
  const { label, htmlFor, size, labelProps } = options;
  if (!label) return null;
  return (
    <InputLabel label={label} htmlFor={htmlFor} size={size} {...labelProps} />
  );
}

/** Hint render options */
interface HintRenderOptions {
  show: boolean;
  id: string;
  size: 'sm' | 'md';
  hint: string | undefined;
}

/** Conditionally render the hint */
function renderHint(options: HintRenderOptions): ReactNode {
  const { show, id, size, hint } = options;
  if (!show) return null;
  return (
    <Hint id={id} size={size}>
      {hint}
    </Hint>
  );
}

/** Error render options */
interface ErrorRenderOptions {
  show: boolean;
  id: string;
  size: 'sm' | 'md';
  errorMessage: string | undefined;
}

/** Conditionally render the error message */
function renderError(options: ErrorRenderOptions): ReactNode {
  const { show, id, size, errorMessage } = options;
  if (!show || !errorMessage) return null;
  return <ErrorMessage id={id} text={errorMessage} size={size} />;
}

/** Display area sub-component props */
interface FileInputDisplayAreaProps {
  className: string;
  isClickable: boolean;
  isUploading: boolean;
  displayText: string;
  displayTextClassName: string;
  onDisplayClick: () => void;
}

/** Display area sub-component to reduce main component complexity */
function FileInputDisplayArea({
  className,
  isClickable,
  isUploading,
  displayText,
  displayTextClassName,
  onDisplayClick,
}: FileInputDisplayAreaProps): ReactElement {
  return (
    <div
      className={className}
      onClick={isClickable ? onDisplayClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? -1 : undefined}
      aria-label={isClickable ? 'Click to select file' : undefined}
    >
      {isUploading && (
        <Icon
          icon={CircleNotch}
          size="sm"
          color="muted"
          className="shrink-0 animate-spin"
          aria-label="Uploading"
        />
      )}
      <span className={displayTextClassName}>{displayText}</span>
    </div>
  );
}

export interface FileInputProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'size' | 'value' | 'onChange' | 'type'
> {
  /**
   * Size variant of the input
   * - `sm`: Small (compact)
   * - `md`: Medium
   * - `lg`: Large (default)
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Error state - applies destructive border color
   * @default false
   */
  error?: boolean;

  /**
   * Error message to display below the input
   */
  errorMessage?: string;

  /**
   * Visual state of the file input
   * - `empty`: No file selected, shows placeholder
   * - `uploading`: File being uploaded, shows spinner and Cancel button
   * - `uploaded`: File selected/uploaded, shows file info and Remove button
   * @default 'empty'
   */
  state?: FileInputState;

  /**
   * File value for controlled mode (file info object)
   */
  value?: FileInputValue | null;

  /**
   * Placeholder text when no file is selected
   * @default 'No file chosen'
   */
  placeholder?: string;

  /**
   * Label text for the input
   */
  label?: string;

  /**
   * Props to pass to the InputLabel component
   */
  labelProps?: Omit<InputLabelProps, 'label' | 'htmlFor' | 'size'>;

  /**
   * Hint text to display below the input
   */
  hint?: string;

  /**
   * Called when a file is selected via the native file input
   */
  onChange?: (file: File | null, event: ChangeEvent<HTMLInputElement>) => void;

  /**
   * Called when the Remove button is clicked (uploaded state)
   */
  onRemove?: () => void;

  /**
   * Called when the Cancel button is clicked (uploading state)
   */
  onCancel?: () => void;

  /**
   * Additional CSS classes for the wrapper element
   */
  wrapperClassName?: string;

  /**
   * Additional CSS classes for the display area
   */
  displayClassName?: string;
}

/**
 * FileInput - A composite form component for file selection.
 *
 * Combines a text display area (showing file name, placeholder, or upload progress),
 * an action button (Browse/Remove/Cancel), and supporting elements (label, hint, error message).
 * Supports multiple states including empty, uploading, uploaded, disabled, and error states.
 *
 * This is a **molecule-level** component that composes several existing atoms:
 * TextInput (display area styling), FileInputButton, InputLabel, Hint, and ErrorMessage.
 *
 * @example
 * ```tsx
 * import { FileInput } from '@/ui/inputs';
 *
 * // Basic usage (uncontrolled)
 * <FileInput
 *   label="Upload Resume"
 *   onChange={(file) => handleFileSelect(file)}
 * />
 *
 * // With hint and validation
 * <FileInput
 *   label="Document"
 *   hint="PDF files only, max 5MB"
 *   error={!!fileError}
 *   errorMessage={fileError}
 *   accept=".pdf"
 * />
 *
 * // Controlled mode with upload state
 * <FileInput
 *   label="Upload Resume"
 *   value={{ name: 'resume.pdf', size: '2.5 MB' }}
 *   state="uploaded"
 *   onRemove={() => clearFile()}
 * />
 *
 * // Uploading state with progress
 * <FileInput
 *   label="Uploading..."
 *   value={{ name: 'document.pdf', progress: 45 }}
 *   state="uploading"
 *   onCancel={() => cancelUpload()}
 * />
 * ```
 */
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      size = 'lg',
      error = false,
      errorMessage,
      state = 'empty',
      value,
      placeholder = 'No file chosen',
      label,
      labelProps,
      hint,
      onChange,
      onRemove,
      onCancel,
      wrapperClassName,
      displayClassName,
      className,
      disabled,
      id: providedId,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;
    const internalInputRef = useRef<HTMLInputElement>(null);

    // Get size mappings using helper
    const { labelSize, hintSize } = getSizeMappings(size);

    // Pre-compute state flags
    const isUploading = state === 'uploading';
    const isPlaceholder = state === 'empty' || !value;
    const isDisplayClickable = !disabled && state === 'empty';
    const showHint = Boolean(hint && !error);
    const showError = Boolean(error && errorMessage);

    // Get display text and button config using helper functions
    const displayText = getDisplayText(state, value, placeholder);
    const buttonConfig = getButtonConfig({ state, value, onCancel, onRemove });

    // Build aria-describedby
    const describedBy = buildDescribedBy(
      ariaDescribedBy,
      showHint ? hintId : undefined,
      showError ? errorId : undefined
    );

    // Trigger file browser
    const triggerFileBrowse = (): void => {
      internalInputRef.current?.click();
    };

    // Handle file input change
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
      const file = event.target.files?.[0] ?? null;
      onChange?.(file, event);
    };

    // Handle button click - calls browse, cancel, or remove based on state
    const handleButtonClick = (): void => {
      if (disabled) return;
      const action =
        buttonConfig.actionType === 'browse'
          ? triggerFileBrowse
          : buttonConfig.action;
      action?.();
    };

    // Ref callback to handle both forwarded ref and internal ref
    const setRefs = createRefCallback(
      ref,
      internalInputRef as MutableRefObject<HTMLInputElement | null>
    );

    // Pre-compute class names
    const displayTextClassName = getDisplayTextClassName(isPlaceholder, disabled);

    const displayAreaClassName = cn(
      fileInputDisplayVariants({
        size,
        error,
        disabled: !!disabled,
      }),
      displayClassName
    );

    // Pre-compute aria attributes to avoid inline conditionals
    const ariaInvalid = error || undefined;
    const ariaDescribedByValue = describedBy || undefined;

    return (
      <div className={cn('flex flex-col', wrapperClassName)}>
        {renderLabel({ label, htmlFor: id, size: labelSize, labelProps })}

        {/* Input row */}
        <div className="group inline-flex">
          {/* Hidden native file input */}
          <input
            ref={setRefs}
            type="file"
            id={id}
            disabled={disabled}
            className="sr-only"
            onChange={handleFileChange}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedByValue}
            {...props}
          />

          {/* Display area */}
          <FileInputDisplayArea
            className={displayAreaClassName}
            isClickable={isDisplayClickable}
            isUploading={isUploading}
            displayText={displayText}
            displayTextClassName={displayTextClassName}
            onDisplayClick={triggerFileBrowse}
          />

          {/* Action button */}
          <FileInputButton
            size={size}
            error={error}
            disabled={disabled}
            onClick={handleButtonClick}
            aria-label={buttonConfig.ariaLabel}
          >
            {buttonConfig.text}
          </FileInputButton>
        </div>

        {renderHint({ show: showHint, id: hintId, size: hintSize, hint })}
        {renderError({
          show: showError,
          id: errorId,
          size: hintSize,
          errorMessage,
        })}
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';

export { fileInputDisplayVariants };
