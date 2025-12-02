import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FileInput } from '../file-input';

describe('FileInput', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<FileInput />);
      expect(screen.getByText('Browse')).toBeInTheDocument();
      expect(screen.getByText('No file chosen')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      render(<FileInput placeholder="Select a file" />);
      expect(screen.getByText('Select a file')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<FileInput label="Upload Document" />);
      expect(screen.getByText('Upload Document')).toBeInTheDocument();
    });

    it('renders with hint', () => {
      render(<FileInput hint="Max file size: 5MB" />);
      expect(screen.getByText('Max file size: 5MB')).toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(<FileInput error errorMessage="File is required" />);
      expect(screen.getByText('File is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders placeholder in empty state', () => {
      render(<FileInput state="empty" placeholder="Choose file" />);
      expect(screen.getByText('Choose file')).toBeInTheDocument();
    });

    it('renders file name in uploaded state', () => {
      render(<FileInput state="uploaded" value={{ name: 'document.pdf' }} />);
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
    });

    it('renders file name with size in uploaded state', () => {
      render(
        <FileInput
          state="uploaded"
          value={{ name: 'document.pdf', size: '2.5 MB' }}
        />
      );
      expect(screen.getByText('document.pdf (2.5 MB)')).toBeInTheDocument();
    });

    it('renders file name in uploading state', () => {
      render(<FileInput state="uploading" value={{ name: 'uploading.pdf' }} />);
      expect(screen.getByText('uploading.pdf')).toBeInTheDocument();
    });

    it('hides hint when error is shown', () => {
      render(<FileInput hint="Helper text" error errorMessage="Error message" />);
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies sm size classes correctly', () => {
      render(<FileInput size="sm" />);
      const displayArea = screen.getByText('No file chosen').parentElement;
      expect(displayArea).toHaveClass('px-3');
      expect(displayArea).toHaveClass('py-1.5');
      expect(displayArea).toHaveClass('text-sm');
    });

    it('applies md size classes correctly', () => {
      render(<FileInput size="md" />);
      const displayArea = screen.getByText('No file chosen').parentElement;
      expect(displayArea).toHaveClass('px-3');
      expect(displayArea).toHaveClass('py-2.5');
      expect(displayArea).toHaveClass('text-sm');
    });

    it('applies lg size classes correctly (default)', () => {
      render(<FileInput />);
      const displayArea = screen.getByText('No file chosen').parentElement;
      expect(displayArea).toHaveClass('px-4');
      expect(displayArea).toHaveClass('py-3');
      expect(displayArea).toHaveClass('text-base');
    });

    it('passes size to FileInputButton', () => {
      render(<FileInput size="sm" />);
      const button = screen.getByRole('button', { name: /browse/i });
      expect(button).toHaveClass('px-2.5');
      expect(button).toHaveClass('py-1.5');
    });
  });

  describe('State Tests', () => {
    it('empty state shows placeholder and Browse button', () => {
      render(<FileInput state="empty" />);
      expect(screen.getByText('No file chosen')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /browse/i })).toBeInTheDocument();
    });

    it('uploading state shows file name and Cancel button', () => {
      render(<FileInput state="uploading" value={{ name: 'file.pdf' }} />);
      expect(screen.getByText('file.pdf')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('uploading state shows spinner', () => {
      render(<FileInput state="uploading" value={{ name: 'file.pdf' }} />);
      expect(screen.getByLabelText('Uploading')).toBeInTheDocument();
    });

    it('uploaded state shows file name and Remove button', () => {
      render(
        <FileInput
          state="uploaded"
          value={{ name: 'document.pdf', size: '1.2 MB' }}
        />
      );
      expect(screen.getByText('document.pdf (1.2 MB)')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    });

    it('disabled state disables the button', () => {
      render(<FileInput disabled />);
      const button = screen.getByRole('button', { name: /browse/i });
      expect(button).toBeDisabled();
    });

    it('disabled state applies disabled styling to display area', () => {
      render(<FileInput disabled />);
      const displayArea = screen.getByText('No file chosen').parentElement;
      expect(displayArea).toHaveClass('bg-background-secondary');
      expect(displayArea).toHaveClass('cursor-not-allowed');
    });

    it('disabled state applies opacity to text', () => {
      render(<FileInput disabled />);
      const text = screen.getByText('No file chosen');
      expect(text).toHaveClass('opacity-52');
    });

    it('error state shows destructive border', () => {
      render(<FileInput error />);
      const displayArea = screen.getByText('No file chosen').parentElement;
      expect(displayArea).toHaveClass('border-destructive');
    });

    it('error state shows error shadow', () => {
      render(<FileInput error />);
      const displayArea = screen.getByText('No file chosen').parentElement;
      expect(displayArea).toHaveClass('shadow-[0px_0px_0px_3px_#fdd8d3]');
    });

    it('error passes to FileInputButton', () => {
      render(<FileInput error />);
      const button = screen.getByRole('button', { name: /browse/i });
      expect(button).toHaveClass('border-destructive');
    });
  });

  describe('Interaction Tests', () => {
    it('Browse button triggers file input click', async () => {
      const user = userEvent.setup();
      render(<FileInput />);

      const fileInput = document.querySelector('input[type="file"]');
      const clickSpy = vi.spyOn(fileInput as HTMLInputElement, 'click');

      await user.click(screen.getByRole('button', { name: /browse/i }));
      expect(clickSpy).toHaveBeenCalled();
    });

    it('onChange fires when file selected', async () => {
      const handleChange = vi.fn();
      render(<FileInput onChange={handleChange} />);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = new File(['hello'], 'test.txt', { type: 'text/plain' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(file, expect.any(Object));
    });

    it('onRemove fires when Remove clicked (uploaded state)', async () => {
      const handleRemove = vi.fn();
      const user = userEvent.setup();

      render(
        <FileInput
          state="uploaded"
          value={{ name: 'file.pdf' }}
          onRemove={handleRemove}
        />
      );

      await user.click(screen.getByRole('button', { name: /remove/i }));
      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('onCancel fires when Cancel clicked (uploading state)', async () => {
      const handleCancel = vi.fn();
      const user = userEvent.setup();

      render(
        <FileInput
          state="uploading"
          value={{ name: 'file.pdf' }}
          onCancel={handleCancel}
        />
      );

      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    it('disabled prevents button interaction', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<FileInput disabled onChange={handleChange} />);

      await user.click(screen.getByRole('button', { name: /browse/i }));

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      expect(fileInput).toBeDisabled();
    });

    it('clicking display area triggers file input in empty state', async () => {
      const user = userEvent.setup();
      render(<FileInput />);

      const fileInput = document.querySelector('input[type="file"]');
      const clickSpy = vi.spyOn(fileInput as HTMLInputElement, 'click');

      const displayArea = screen.getByText('No file chosen').parentElement!;
      await user.click(displayArea);

      expect(clickSpy).toHaveBeenCalled();
    });

    it('clicking display area does nothing when disabled', async () => {
      const user = userEvent.setup();
      render(<FileInput disabled />);

      const fileInput = document.querySelector('input[type="file"]');
      const clickSpy = vi.spyOn(fileInput as HTMLInputElement, 'click');

      const displayArea = screen.getByText('No file chosen').parentElement!;
      await user.click(displayArea);

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Tests', () => {
    it('has proper hidden file input', () => {
      render(<FileInput />);
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toHaveClass('sr-only');
    });

    it('label associates with input via htmlFor', () => {
      render(<FileInput label="Upload File" id="test-file" />);
      const label = screen.getByText('Upload File').closest('label');
      expect(label).toHaveAttribute('for', 'test-file');
    });

    it('error message linked via aria-describedby', () => {
      render(<FileInput error errorMessage="Error" id="file-input" />);
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('aria-describedby', 'file-input-error');
    });

    it('hint linked via aria-describedby', () => {
      render(<FileInput hint="Help text" id="file-input" />);
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('aria-describedby', 'file-input-hint');
    });

    it('aria-invalid set when error', () => {
      render(<FileInput error />);
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('aria-invalid', 'true');
    });

    it('aria-invalid not set when no error', () => {
      render(<FileInput />);
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).not.toHaveAttribute('aria-invalid');
    });

    it('button has proper aria-label for browse state', () => {
      render(<FileInput />);
      expect(
        screen.getByRole('button', { name: /browse for file/i })
      ).toBeInTheDocument();
    });

    it('button has proper aria-label for remove state', () => {
      render(<FileInput state="uploaded" value={{ name: 'file.pdf' }} />);
      expect(
        screen.getByRole('button', { name: /remove file/i })
      ).toBeInTheDocument();
    });

    it('button has proper aria-label for cancel state', () => {
      render(<FileInput state="uploading" value={{ name: 'file.pdf' }} />);
      expect(
        screen.getByRole('button', { name: /cancel upload/i })
      ).toBeInTheDocument();
    });

    it('generates unique id when not provided', () => {
      render(<FileInput label="Test" />);
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('id');
      expect(fileInput?.getAttribute('id')).toBeTruthy();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to native input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<FileInput ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('file');
    });

    it('ref provides access to native input methods', () => {
      const ref = createRef<HTMLInputElement>();
      render(<FileInput ref={ref} />);
      expect(ref.current?.click).toBeDefined();
      expect(ref.current?.files).toBeDefined();
    });
  });

  describe('Styling Tests', () => {
    it('merges custom wrapperClassName', () => {
      render(<FileInput wrapperClassName="custom-wrapper mt-4" />);
      const wrapper = screen
        .getByText('No file chosen')
        .closest('.flex.flex-col');
      expect(wrapper).toHaveClass('custom-wrapper');
      expect(wrapper).toHaveClass('mt-4');
    });

    it('merges custom displayClassName', () => {
      render(<FileInput displayClassName="custom-display" />);
      const displayArea = screen.getByText('No file chosen').parentElement;
      expect(displayArea).toHaveClass('custom-display');
    });

    it('display area has correct border styling for seamless attachment', () => {
      render(<FileInput />);
      const displayArea = screen.getByText('No file chosen').parentElement;
      expect(displayArea).toHaveClass('rounded-l-sm');
      expect(displayArea).toHaveClass('border');
      expect(displayArea).toHaveClass('border-r-0');
    });

    it('placeholder text has tertiary color', () => {
      render(<FileInput />);
      const placeholder = screen.getByText('No file chosen');
      expect(placeholder).toHaveClass('text-text-tertiary');
    });

    it('file name text has primary color', () => {
      render(<FileInput state="uploaded" value={{ name: 'file.pdf' }} />);
      const fileName = screen.getByText('file.pdf');
      expect(fileName).toHaveClass('text-text-primary');
    });
  });

  describe('Edge Cases', () => {
    it('empty value prop renders empty state', () => {
      render(<FileInput value={null} state="uploaded" />);
      expect(screen.getByText('No file chosen')).toBeInTheDocument();
    });

    it('undefined value renders empty state', () => {
      render(<FileInput value={undefined} state="uploaded" />);
      expect(screen.getByText('No file chosen')).toBeInTheDocument();
    });

    it('very long file names truncate properly', () => {
      render(
        <FileInput
          state="uploaded"
          value={{
            name: 'this-is-a-very-long-filename-that-should-be-truncated.pdf',
          }}
        />
      );
      const fileName = screen.getByText(
        'this-is-a-very-long-filename-that-should-be-truncated.pdf'
      );
      expect(fileName).toHaveClass('truncate');
    });

    it('handles multiple state props correctly (disabled + error)', () => {
      render(<FileInput disabled error errorMessage="Error" />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('border-destructive');

      const displayArea = screen.getByText('No file chosen').parentElement;
      expect(displayArea).toHaveClass('bg-background-secondary');
      expect(displayArea).toHaveClass('border-destructive');
    });

    it('re-renders correctly when props change', () => {
      const { rerender } = render(<FileInput state="empty" />);
      expect(screen.getByText('No file chosen')).toBeInTheDocument();

      rerender(<FileInput state="uploaded" value={{ name: 'new-file.pdf' }} />);
      expect(screen.getByText('new-file.pdf')).toBeInTheDocument();
    });

    it('handles file input change event correctly', () => {
      const handleChange = vi.fn();
      render(<FileInput onChange={handleChange} />);

      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      // Test with empty files
      fireEvent.change(fileInput, { target: { files: [] } });
      expect(handleChange).toHaveBeenCalledWith(null, expect.any(Object));
    });

    it('passes accept attribute to native input', () => {
      render(<FileInput accept=".pdf,.jpg" />);
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('accept', '.pdf,.jpg');
    });

    it('passes multiple attribute to native input', () => {
      render(<FileInput multiple />);
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('multiple');
    });

    it('uses provided id for associations', () => {
      render(<FileInput id="custom-id" label="Label" hint="Hint" />);
      const fileInput = document.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('id', 'custom-id');

      const label = screen.getByText('Label').closest('label');
      expect(label).toHaveAttribute('for', 'custom-id');
    });
  });

  describe('Label Props', () => {
    it('passes labelProps to InputLabel', () => {
      render(
        <FileInput
          label="Upload"
          labelProps={{ required: true, showIcon: true }}
        />
      );
      // Required indicator
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('size sm uses sm label size', () => {
      render(<FileInput size="sm" label="Small Label" />);
      const label = screen.getByText('Small Label').closest('label');
      expect(label).toHaveClass('pb-2.5');
    });

    it('size lg uses md label size', () => {
      render(<FileInput size="lg" label="Large Label" />);
      const label = screen.getByText('Large Label').closest('label');
      expect(label).toHaveClass('pb-3');
    });
  });
});
