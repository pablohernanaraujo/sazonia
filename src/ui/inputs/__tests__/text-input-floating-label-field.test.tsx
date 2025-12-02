import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TextInputFloatingLabelField } from '../text-input-floating-label-field';

describe('TextInputFloatingLabelField', () => {
  describe('Composition', () => {
    it('renders TextInputFloatingLabel component', () => {
      render(<TextInputFloatingLabelField label="Email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('passes props to underlying input', () => {
      render(
        <TextInputFloatingLabelField
          label="Email"
          placeholder="you@example.com"
          type="email"
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders hint when provided', () => {
      render(
        <TextInputFloatingLabelField
          label="Email"
          hint="We'll never share your email"
        />
      );
      expect(
        screen.getByText("We'll never share your email")
      ).toBeInTheDocument();
    });

    it('renders error message when provided', () => {
      render(
        <TextInputFloatingLabelField
          label="Email"
          errorMessage="Please enter a valid email"
        />
      );
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
    });

    it('error message replaces hint when both provided', () => {
      render(
        <TextInputFloatingLabelField
          label="Email"
          hint="We'll never share your email"
          errorMessage="Please enter a valid email"
        />
      );
      expect(
        screen.queryByText("We'll never share your email")
      ).not.toBeInTheDocument();
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
    });

    it('shows hint when no error message', () => {
      render(
        <TextInputFloatingLabelField
          label="Email"
          hint="We'll never share your email"
        />
      );
      expect(
        screen.getByText("We'll never share your email")
      ).toBeInTheDocument();
    });
  });

  describe('Error state propagation', () => {
    it('applies error state to input when errorMessage is provided', () => {
      const { container } = render(
        <TextInputFloatingLabelField label="Email" errorMessage="Error" />
      );
      const wrapper = container.querySelector('.border-destructive');
      expect(wrapper).toBeInTheDocument();
    });

    it('applies error state when error prop is explicitly passed', () => {
      const { container } = render(
        <TextInputFloatingLabelField label="Email" error />
      );
      const wrapper = container.querySelector('.border-destructive');
      expect(wrapper).toBeInTheDocument();
    });

    it('error message has role="alert"', () => {
      render(
        <TextInputFloatingLabelField label="Email" errorMessage="Error message" />
      );
      expect(screen.getByRole('alert')).toHaveTextContent('Error message');
    });
  });

  describe('ARIA wiring', () => {
    it('input has aria-describedby pointing to hint', () => {
      render(
        <TextInputFloatingLabelField
          label="Email"
          hint="Hint text"
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      const hintId = input.getAttribute('aria-describedby');
      expect(hintId).toBeTruthy();
      expect(document.getElementById(hintId!)).toHaveTextContent('Hint text');
    });

    it('input has aria-describedby pointing to error when error present', () => {
      render(
        <TextInputFloatingLabelField
          label="Email"
          hint="Hint text"
          errorMessage="Error message"
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      const errorId = input.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(document.getElementById(errorId!)).toHaveTextContent(
        'Error message'
      );
    });

    it('respects provided aria-describedby', () => {
      render(
        <TextInputFloatingLabelField
          label="Email"
          hint="Hint text"
          aria-describedby="custom-describedby"
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-describedby',
        'custom-describedby'
      );
    });

    it('no aria-describedby when no hint or error', () => {
      render(<TextInputFloatingLabelField label="Email" data-testid="input" />);
      expect(screen.getByTestId('input')).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('ID management', () => {
    it('generates unique IDs for input, hint, and error', () => {
      const { rerender } = render(
        <TextInputFloatingLabelField
          label="Email 1"
          hint="Hint 1"
          data-testid="input1"
        />
      );
      const input1Id = screen.getByTestId('input1').id;

      rerender(
        <>
          <TextInputFloatingLabelField
            label="Email 1"
            hint="Hint 1"
            data-testid="input1"
          />
          <TextInputFloatingLabelField
            label="Email 2"
            hint="Hint 2"
            data-testid="input2"
          />
        </>
      );

      const input2Id = screen.getByTestId('input2').id;
      expect(input1Id).not.toBe(input2Id);
    });

    it('uses provided id when given', () => {
      render(
        <TextInputFloatingLabelField
          label="Email"
          id="custom-id"
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toHaveAttribute('id', 'custom-id');
    });

    it('hint id is derived from input id', () => {
      render(
        <TextInputFloatingLabelField
          label="Email"
          id="custom-id"
          hint="Hint text"
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      const describedById = input.getAttribute('aria-describedby');
      expect(describedById).toBe('custom-id-hint');
    });

    it('error id is derived from input id', () => {
      render(
        <TextInputFloatingLabelField
          label="Email"
          id="custom-id"
          errorMessage="Error"
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      const describedById = input.getAttribute('aria-describedby');
      expect(describedById).toBe('custom-id-error');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<TextInputFloatingLabelField label="Email" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLInputElement>();
      render(
        <TextInputFloatingLabelField
          label="Email"
          ref={ref}
          data-testid="input"
        />
      );
      ref.current?.focus();
      expect(screen.getByTestId('input')).toHaveFocus();
    });
  });

  describe('Props forwarding', () => {
    it('forwards all input props to TextInputFloatingLabel', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <TextInputFloatingLabelField
          label="Email"
          onChange={handleChange}
          required
          disabled={false}
          data-testid="input"
        />
      );

      await user.type(screen.getByTestId('input'), 'test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('forwards leftAddOn and rightAddOn', () => {
      render(
        <TextInputFloatingLabelField
          label="Price"
          leftAddOn={<span data-testid="left">$</span>}
          rightAddOn={<span data-testid="right">USD</span>}
        />
      );
      expect(screen.getByTestId('left')).toBeInTheDocument();
      expect(screen.getByTestId('right')).toBeInTheDocument();
    });

    it('forwards wrapperClassName', () => {
      const { container } = render(
        <TextInputFloatingLabelField
          label="Email"
          wrapperClassName="custom-wrapper"
        />
      );
      expect(container.querySelector('.custom-wrapper')).toBeInTheDocument();
    });
  });

  describe('containerClassName', () => {
    it('applies containerClassName to field container', () => {
      const { container } = render(
        <TextInputFloatingLabelField
          label="Email"
          containerClassName="field-container"
        />
      );
      expect(container.firstChild).toHaveClass('field-container');
    });

    it('container has flex column layout by default', () => {
      const { container } = render(<TextInputFloatingLabelField label="Email" />);
      expect(container.firstChild).toHaveClass('flex', 'flex-col');
    });
  });

  describe('Hint and Error props forwarding', () => {
    it('forwards hintProps to Hint component', () => {
      render(
        <TextInputFloatingLabelField
          label="Email"
          hint="Hint text"
          hintProps={{ className: 'custom-hint-class' }}
        />
      );
      expect(screen.getByText('Hint text')).toHaveClass('custom-hint-class');
    });

    it('forwards errorProps to ErrorMessage component', () => {
      render(
        <TextInputFloatingLabelField
          label="Email"
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
        <TextInputFloatingLabelField
          label="Email"
          hint="Enter your email address"
          required
          onChange={handleChange}
          data-testid="input"
        />
      );

      // Initially empty - label in placeholder position
      const input = screen.getByTestId('input');
      expect(input).toHaveValue('');

      // Can see hint
      expect(screen.getByText('Enter your email address')).toBeInTheDocument();

      // Type in input
      await user.type(input, 'test@example.com');
      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue('test@example.com');
    });

    it('error state workflow', async () => {
      const user = userEvent.setup();

      const { rerender } = render(
        <TextInputFloatingLabelField
          label="Email"
          hint="Enter your email"
          data-testid="input"
        />
      );

      // Initially shows hint
      expect(screen.getByText('Enter your email')).toBeInTheDocument();

      // Type invalid value
      await user.type(screen.getByTestId('input'), 'invalid');

      // Rerender with error
      rerender(
        <TextInputFloatingLabelField
          label="Email"
          hint="Enter your email"
          errorMessage="Invalid email format"
          data-testid="input"
        />
      );

      // Now shows error instead of hint
      expect(screen.queryByText('Enter your email')).not.toBeInTheDocument();
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles empty hint string', () => {
      render(
        <TextInputFloatingLabelField label="Email" hint="" data-testid="input" />
      );
      // Empty hint should not render Hint component
      expect(screen.getByTestId('input')).not.toHaveAttribute('aria-describedby');
    });

    it('handles empty errorMessage string', () => {
      render(
        <TextInputFloatingLabelField
          label="Email"
          errorMessage=""
          data-testid="input"
        />
      );
      // Empty errorMessage should not render ErrorMessage component
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('handles both error prop and errorMessage', () => {
      const { container } = render(
        <TextInputFloatingLabelField
          label="Email"
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
        <TextInputFloatingLabelField
          label="Email"
          hint="Hint text"
          disabled
          defaultValue="test@example.com"
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toBeDisabled();
      expect(screen.getByText('Hint text')).toBeInTheDocument();
    });
  });
});
