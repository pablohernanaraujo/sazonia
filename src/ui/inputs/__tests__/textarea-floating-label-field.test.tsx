import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TextareaFloatingLabelField } from '../textarea-floating-label-field';

describe('TextareaFloatingLabelField', () => {
  describe('Composition', () => {
    it('renders TextareaFloatingLabel component', () => {
      render(<TextareaFloatingLabelField label="Description" />);
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('passes props to underlying textarea', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          placeholder="Enter description..."
          rows={6}
          data-testid="textarea"
        />
      );
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveAttribute('rows', '6');
    });

    it('renders hint when provided', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          hint="Maximum 500 characters"
        />
      );
      expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument();
    });

    it('renders error message when provided', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          errorMessage="Please enter a description"
        />
      );
      expect(screen.getByText('Please enter a description')).toBeInTheDocument();
    });

    it('error message replaces hint when both provided', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          hint="Maximum 500 characters"
          errorMessage="Please enter a description"
        />
      );
      expect(
        screen.queryByText('Maximum 500 characters')
      ).not.toBeInTheDocument();
      expect(screen.getByText('Please enter a description')).toBeInTheDocument();
    });

    it('shows hint when no error message', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          hint="Maximum 500 characters"
        />
      );
      expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument();
    });
  });

  describe('Error state propagation', () => {
    it('applies error state to textarea when errorMessage is provided', () => {
      const { container } = render(
        <TextareaFloatingLabelField label="Description" errorMessage="Error" />
      );
      const wrapper = container.querySelector('.border-destructive');
      expect(wrapper).toBeInTheDocument();
    });

    it('applies error state when error prop is explicitly passed', () => {
      const { container } = render(
        <TextareaFloatingLabelField label="Description" error />
      );
      const wrapper = container.querySelector('.border-destructive');
      expect(wrapper).toBeInTheDocument();
    });

    it('error message has role="alert"', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          errorMessage="Error message"
        />
      );
      expect(screen.getByRole('alert')).toHaveTextContent('Error message');
    });
  });

  describe('ARIA wiring', () => {
    it('textarea has aria-describedby pointing to hint', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          hint="Hint text"
          data-testid="textarea"
        />
      );
      const textarea = screen.getByTestId('textarea');
      const hintId = textarea.getAttribute('aria-describedby');
      expect(hintId).toBeTruthy();
      expect(document.getElementById(hintId!)).toHaveTextContent('Hint text');
    });

    it('textarea has aria-describedby pointing to error when error present', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          hint="Hint text"
          errorMessage="Error message"
          data-testid="textarea"
        />
      );
      const textarea = screen.getByTestId('textarea');
      const errorId = textarea.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(document.getElementById(errorId!)).toHaveTextContent(
        'Error message'
      );
    });

    it('respects provided aria-describedby', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          hint="Hint text"
          aria-describedby="custom-describedby"
          data-testid="textarea"
        />
      );
      expect(screen.getByTestId('textarea')).toHaveAttribute(
        'aria-describedby',
        'custom-describedby'
      );
    });

    it('no aria-describedby when no hint or error', () => {
      render(
        <TextareaFloatingLabelField label="Description" data-testid="textarea" />
      );
      expect(screen.getByTestId('textarea')).not.toHaveAttribute(
        'aria-describedby'
      );
    });
  });

  describe('ID management', () => {
    it('generates unique IDs for textarea, hint, and error', () => {
      const { rerender } = render(
        <TextareaFloatingLabelField
          label="Description 1"
          hint="Hint 1"
          data-testid="textarea1"
        />
      );
      const textarea1Id = screen.getByTestId('textarea1').id;

      rerender(
        <>
          <TextareaFloatingLabelField
            label="Description 1"
            hint="Hint 1"
            data-testid="textarea1"
          />
          <TextareaFloatingLabelField
            label="Description 2"
            hint="Hint 2"
            data-testid="textarea2"
          />
        </>
      );

      const textarea2Id = screen.getByTestId('textarea2').id;
      expect(textarea1Id).not.toBe(textarea2Id);
    });

    it('uses provided id when given', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          id="custom-id"
          data-testid="textarea"
        />
      );
      expect(screen.getByTestId('textarea')).toHaveAttribute('id', 'custom-id');
    });

    it('hint id is derived from textarea id', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          id="custom-id"
          hint="Hint text"
          data-testid="textarea"
        />
      );
      const textarea = screen.getByTestId('textarea');
      const describedById = textarea.getAttribute('aria-describedby');
      expect(describedById).toBe('custom-id-hint');
    });

    it('error id is derived from textarea id', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          id="custom-id"
          errorMessage="Error"
          data-testid="textarea"
        />
      );
      const textarea = screen.getByTestId('textarea');
      const describedById = textarea.getAttribute('aria-describedby');
      expect(describedById).toBe('custom-id-error');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to textarea element', () => {
      const ref = createRef<HTMLTextAreaElement>();
      render(<TextareaFloatingLabelField label="Description" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLTextAreaElement>();
      render(
        <TextareaFloatingLabelField
          label="Description"
          ref={ref}
          data-testid="textarea"
        />
      );
      ref.current?.focus();
      expect(screen.getByTestId('textarea')).toHaveFocus();
    });
  });

  describe('Props forwarding', () => {
    it('forwards all textarea props to TextareaFloatingLabel', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <TextareaFloatingLabelField
          label="Description"
          onChange={handleChange}
          required
          disabled={false}
          data-testid="textarea"
        />
      );

      await user.type(screen.getByTestId('textarea'), 'test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('forwards wrapperClassName', () => {
      const { container } = render(
        <TextareaFloatingLabelField
          label="Description"
          wrapperClassName="custom-wrapper"
        />
      );
      expect(container.querySelector('.custom-wrapper')).toBeInTheDocument();
    });

    it('forwards rows prop', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          rows={8}
          data-testid="textarea"
        />
      );
      expect(screen.getByTestId('textarea')).toHaveAttribute('rows', '8');
    });
  });

  describe('containerClassName', () => {
    it('applies containerClassName to field container', () => {
      const { container } = render(
        <TextareaFloatingLabelField
          label="Description"
          containerClassName="field-container"
        />
      );
      expect(container.firstChild).toHaveClass('field-container');
    });

    it('container has flex column layout by default', () => {
      const { container } = render(
        <TextareaFloatingLabelField label="Description" />
      );
      expect(container.firstChild).toHaveClass('flex', 'flex-col');
    });
  });

  describe('Hint and Error props forwarding', () => {
    it('forwards hintProps to Hint component', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          hint="Hint text"
          hintProps={{ className: 'custom-hint-class' }}
        />
      );
      expect(screen.getByText('Hint text')).toHaveClass('custom-hint-class');
    });

    it('forwards errorProps to ErrorMessage component', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          errorMessage="Error text"
          errorProps={{ showIcon: false }}
        />
      );
      // When showIcon is false, there should be no icon in the error message
      const errorContainer = screen.getByRole('alert');
      expect(errorContainer.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('Integration tests', () => {
    it('complete form field workflow', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <TextareaFloatingLabelField
          label="Description"
          hint="Enter your description"
          required
          onChange={handleChange}
          data-testid="textarea"
        />
      );

      // Initially empty - label in placeholder position
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveValue('');

      // Can see hint
      expect(screen.getByText('Enter your description')).toBeInTheDocument();

      // Type in textarea
      await user.type(textarea, 'This is my description');
      expect(handleChange).toHaveBeenCalled();
      expect(textarea).toHaveValue('This is my description');
    });

    it('error state workflow', async () => {
      const user = userEvent.setup();

      const { rerender } = render(
        <TextareaFloatingLabelField
          label="Description"
          hint="Enter your description"
          data-testid="textarea"
        />
      );

      // Initially shows hint
      expect(screen.getByText('Enter your description')).toBeInTheDocument();

      // Type invalid value
      await user.type(screen.getByTestId('textarea'), 'too short');

      // Rerender with error
      rerender(
        <TextareaFloatingLabelField
          label="Description"
          hint="Enter your description"
          errorMessage="Description must be at least 50 characters"
          data-testid="textarea"
        />
      );

      // Now shows error instead of hint
      expect(
        screen.queryByText('Enter your description')
      ).not.toBeInTheDocument();
      expect(
        screen.getByText('Description must be at least 50 characters')
      ).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles empty hint string', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          hint=""
          data-testid="textarea"
        />
      );
      // Empty hint should not render Hint component
      expect(screen.getByTestId('textarea')).not.toHaveAttribute(
        'aria-describedby'
      );
    });

    it('handles empty errorMessage string', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          errorMessage=""
          data-testid="textarea"
        />
      );
      // Empty errorMessage should not render ErrorMessage component
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('handles both error prop and errorMessage', () => {
      const { container } = render(
        <TextareaFloatingLabelField
          label="Description"
          error
          errorMessage="Error message"
        />
      );
      // Should apply error styling
      expect(container.querySelector('.border-destructive')).toBeInTheDocument();
      // Should show error message
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('handles disabled state with all features', () => {
      render(
        <TextareaFloatingLabelField
          label="Description"
          hint="Hint text"
          disabled
          defaultValue="Some content"
          data-testid="textarea"
        />
      );
      expect(screen.getByTestId('textarea')).toBeDisabled();
      expect(screen.getByText('Hint text')).toBeInTheDocument();
    });

    it('handles multi-line content', async () => {
      const user = userEvent.setup();
      render(
        <TextareaFloatingLabelField
          label="Description"
          rows={6}
          data-testid="textarea"
        />
      );

      const textarea = screen.getByTestId('textarea');
      await user.type(textarea, 'Line 1{enter}Line 2{enter}Line 3');

      expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3');
    });
  });
});
