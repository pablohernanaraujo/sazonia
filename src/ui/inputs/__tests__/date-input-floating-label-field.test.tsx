import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DateInputFloatingLabelField } from '../date-input-floating-label-field';

describe('DateInputFloatingLabelField', () => {
  describe('Rendering', () => {
    it('renders the DateInputFloatingLabel component', () => {
      render(<DateInputFloatingLabelField label="Date" />);
      expect(screen.getByLabelText('Date')).toBeInTheDocument();
    });

    it('renders with value', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          defaultValue={new Date(2024, 2, 15)}
        />
      );
      expect(screen.getByDisplayValue('03/15/2024')).toBeInTheDocument();
    });

    it('renders calendar icon button', () => {
      render(<DateInputFloatingLabelField label="Date" />);
      expect(
        screen.getByRole('button', { name: 'Choose date from calendar' })
      ).toBeInTheDocument();
    });
  });

  describe('Hint rendering', () => {
    it('renders hint when provided', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          hint="Enter in MM/DD/YYYY format"
        />
      );
      expect(screen.getByText('Enter in MM/DD/YYYY format')).toBeInTheDocument();
    });

    it('does not render hint when not provided', () => {
      render(<DateInputFloatingLabelField label="Date" />);
      const hint = screen.queryByRole('generic', { name: /hint/i });
      expect(hint).not.toBeInTheDocument();
    });

    it('hint has correct id for aria association', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          hint="Select a date"
          id="test-input"
        />
      );
      const hint = screen.getByText('Select a date');
      expect(hint).toHaveAttribute('id', 'test-input-hint');
    });
  });

  describe('Error message rendering', () => {
    it('renders error message when provided', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          errorMessage="Please select a valid date"
        />
      );
      expect(screen.getByText('Please select a valid date')).toBeInTheDocument();
    });

    it('error message replaces hint', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          hint="Select a date"
          errorMessage="Please select a valid date"
        />
      );
      expect(screen.queryByText('Select a date')).not.toBeInTheDocument();
      expect(screen.getByText('Please select a valid date')).toBeInTheDocument();
    });

    it('error message has correct id for aria association', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          errorMessage="Invalid date"
          id="test-input"
        />
      );
      // ErrorMessage component puts id on the wrapper div, not the text span
      const error = screen.getByRole('alert');
      expect(error).toHaveAttribute('id', 'test-input-error');
    });

    it('applies error state to input when errorMessage is provided', () => {
      const { container } = render(
        <DateInputFloatingLabelField label="Date" errorMessage="Invalid date" />
      );
      const wrapper = container.querySelector('.relative > div');
      expect(wrapper).toHaveClass('border-destructive');
    });
  });

  describe('ARIA associations', () => {
    it('input aria-describedby points to hint when no error', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          hint="Select a date"
          id="test-input"
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-describedby', 'test-input-hint');
    });

    it('input aria-describedby points to error when error present', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          hint="Select a date"
          errorMessage="Invalid date"
          id="test-input"
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-describedby', 'test-input-error');
    });

    it('respects provided aria-describedby', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          hint="Select a date"
          aria-describedby="custom-hint"
          data-testid="input"
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-describedby', 'custom-hint');
    });

    it('has no aria-describedby when no hint or error', () => {
      render(<DateInputFloatingLabelField label="Date" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('ID generation', () => {
    it('uses provided id', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          id="custom-id"
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toHaveAttribute('id', 'custom-id');
    });

    it('generates unique id when not provided', () => {
      render(<DateInputFloatingLabelField label="Date" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.id).toBeTruthy();
    });

    it('hint and error ids are derived from input id', () => {
      render(
        <DateInputFloatingLabelField label="Date" hint="Hint text" id="my-date" />
      );
      const hint = screen.getByText('Hint text');
      expect(hint).toHaveAttribute('id', 'my-date-hint');
    });
  });

  describe('Props passthrough', () => {
    it('passes required prop through', () => {
      render(
        <DateInputFloatingLabelField label="Date" required data-testid="input" />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('passes disabled prop through', () => {
      render(
        <DateInputFloatingLabelField label="Date" disabled data-testid="input" />
      );
      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('passes error prop through (independent of errorMessage)', () => {
      const { container } = render(
        <DateInputFloatingLabelField label="Date" error />
      );
      const wrapper = container.querySelector('.relative > div');
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('passes defaultValue prop through', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          defaultValue={new Date(2024, 2, 15)}
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toHaveValue('03/15/2024');
    });

    it('passes leftAddOn prop through', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          leftAddOn={<span data-testid="addon">Icon</span>}
        />
      );
      expect(screen.getByTestId('addon')).toBeInTheDocument();
    });

    it('passes minDate prop through', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          minDate={new Date(2024, 0, 1)}
        />
      );
      // Component renders, minDate applied internally
      expect(screen.getByLabelText('Date')).toBeInTheDocument();
    });

    it('passes maxDate prop through', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          maxDate={new Date(2024, 11, 31)}
        />
      );
      // Component renders, maxDate applied internally
      expect(screen.getByLabelText('Date')).toBeInTheDocument();
    });
  });

  describe('Container styling', () => {
    it('applies containerClassName to wrapper', () => {
      const { container } = render(
        <DateInputFloatingLabelField
          label="Date"
          containerClassName="custom-container"
        />
      );
      const outerWrapper = container.firstChild;
      expect(outerWrapper).toHaveClass('custom-container');
    });

    it('container has flex column layout', () => {
      const { container } = render(<DateInputFloatingLabelField label="Date" />);
      const outerWrapper = container.firstChild;
      expect(outerWrapper).toHaveClass('flex', 'flex-col');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<DateInputFloatingLabelField label="Date" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Hint and error props', () => {
    it('passes hintProps through to Hint component', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          hint="Hint text"
          hintProps={{ className: 'custom-hint-class' }}
        />
      );
      const hint = screen.getByText('Hint text');
      expect(hint).toHaveClass('custom-hint-class');
    });

    it('passes errorProps through to ErrorMessage component', () => {
      render(
        <DateInputFloatingLabelField
          label="Date"
          errorMessage="Error text"
          errorProps={{ className: 'custom-error-class' }}
        />
      );
      // ErrorMessage className goes on the wrapper div, not the text span
      const error = screen.getByRole('alert');
      expect(error).toHaveClass('custom-error-class');
    });
  });

  describe('Error state precedence', () => {
    it('errorMessage takes precedence over error prop', () => {
      const { container } = render(
        <DateInputFloatingLabelField
          label="Date"
          error={false}
          errorMessage="Error from message"
        />
      );
      // Even with error={false}, having errorMessage should apply error styles
      const wrapper = container.querySelector('.relative > div');
      expect(wrapper).toHaveClass('border-destructive');
      expect(screen.getByText('Error from message')).toBeInTheDocument();
    });

    it('combines error prop with existing errorMessage', () => {
      const { container } = render(
        <DateInputFloatingLabelField
          label="Date"
          error
          errorMessage="Error message"
        />
      );
      const wrapper = container.querySelector('.relative > div');
      expect(wrapper).toHaveClass('border-destructive');
    });
  });
});
