import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  CHECKBOX_HINT_SIZE_MAP,
  CHECKBOX_LABEL_SIZE_MAP,
  CheckboxField,
} from '../checkbox-field';

describe('CheckboxField', () => {
  describe('Rendering', () => {
    it('renders checkbox element', () => {
      render(<CheckboxField label="Accept terms" />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders label text', () => {
      render(<CheckboxField label="Accept terms and conditions" />);
      expect(screen.getByText('Accept terms and conditions')).toBeInTheDocument();
    });

    it('renders without hint when not provided', () => {
      render(<CheckboxField label="Accept terms" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toHaveAttribute('aria-describedby');
    });

    it('renders without error when not provided', () => {
      render(<CheckboxField label="Accept terms" />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Label rendering', () => {
    it('label is associated with checkbox via htmlFor/id', () => {
      render(<CheckboxField label="Accept terms" />);
      const label = screen.getByText('Accept terms').closest('label');
      const checkbox = screen.getByRole('checkbox');

      expect(label).toHaveAttribute('for');
      expect(checkbox).toHaveAttribute('id');
      expect(label?.getAttribute('for')).toBe(checkbox.getAttribute('id'));
    });

    it('uses provided id for label association', () => {
      render(<CheckboxField label="Accept terms" id="custom-id" />);
      const label = screen.getByText('Accept terms').closest('label');
      const checkbox = screen.getByRole('checkbox');

      expect(label).toHaveAttribute('for', 'custom-id');
      expect(checkbox).toHaveAttribute('id', 'custom-id');
    });

    it('clicking label toggles checkbox', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <CheckboxField label="Accept terms" onCheckedChange={handleChange} />
      );

      const label = screen.getByText('Accept terms');
      await user.click(label);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('applies labelClassName to label element', () => {
      render(
        <CheckboxField label="Accept terms" labelClassName="custom-label-class" />
      );
      const label = screen.getByText('Accept terms').closest('label');
      expect(label).toHaveClass('custom-label-class');
    });
  });

  describe('Required indicator', () => {
    it('renders required indicator when required is true', () => {
      render(<CheckboxField label="Accept terms" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('required indicator has aria-hidden', () => {
      render(<CheckboxField label="Accept terms" required />);
      const asterisk = screen.getByText('*');
      expect(asterisk).toHaveAttribute('aria-hidden', 'true');
    });

    it('sets aria-required when required is true', () => {
      render(<CheckboxField label="Accept terms" required />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });

    it('does not set aria-required when required is false', () => {
      render(<CheckboxField label="Accept terms" />);
      expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-required');
    });
  });

  describe('Size mapping', () => {
    it('applies sm size styles', () => {
      render(<CheckboxField label="Label" size="sm" />);
      const label = screen.getByText('Label').closest('label');
      expect(label).toHaveClass('text-sm', 'leading-5');
    });

    it('applies md size styles', () => {
      render(<CheckboxField label="Label" size="md" />);
      const label = screen.getByText('Label').closest('label');
      expect(label).toHaveClass('text-base', 'leading-6');
    });

    it('applies lg size styles', () => {
      render(<CheckboxField label="Label" size="lg" />);
      const label = screen.getByText('Label').closest('label');
      expect(label).toHaveClass('text-base', 'leading-6');
    });

    it('exports CHECKBOX_LABEL_SIZE_MAP constant', () => {
      expect(CHECKBOX_LABEL_SIZE_MAP).toEqual({
        sm: { gap: 'gap-3', fontSize: 'text-sm', lineHeight: 'leading-5' },
        md: { gap: 'gap-3', fontSize: 'text-base', lineHeight: 'leading-6' },
        lg: { gap: 'gap-3', fontSize: 'text-base', lineHeight: 'leading-6' },
      });
    });

    it('exports CHECKBOX_HINT_SIZE_MAP constant', () => {
      expect(CHECKBOX_HINT_SIZE_MAP).toEqual({
        sm: 'sm',
        md: 'sm',
        lg: 'md',
      });
    });
  });

  describe('Hint rendering', () => {
    it('renders Hint when hint prop is provided', () => {
      render(<CheckboxField label="Accept" hint="Helper text" />);
      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });

    it('hint has correct ID for aria-describedby', () => {
      render(
        <CheckboxField label="Accept" hint="Helper text" id="my-checkbox" />
      );
      const hint = screen.getByText('Helper text');
      expect(hint).toHaveAttribute('id', 'my-checkbox-hint');
    });

    it('checkbox has aria-describedby pointing to hint', () => {
      render(
        <CheckboxField label="Accept" hint="Helper text" id="my-checkbox" />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby', 'my-checkbox-hint');
    });

    it('passes through hintProps', () => {
      render(
        <CheckboxField
          label="Accept"
          hint="Helper text"
          hintProps={{ className: 'custom-hint-class' }}
        />
      );
      const hint = screen.getByText('Helper text');
      expect(hint).toHaveClass('custom-hint-class');
    });
  });

  describe('Error rendering', () => {
    it('renders ErrorMessage when error prop is provided', () => {
      render(<CheckboxField label="Accept" error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('error has correct ID for aria-describedby', () => {
      render(
        <CheckboxField label="Accept" error="Error text" id="my-checkbox" />
      );
      const error = screen.getByRole('alert');
      expect(error).toHaveAttribute('id', 'my-checkbox-error');
    });

    it('checkbox has aria-describedby pointing to error', () => {
      render(
        <CheckboxField label="Accept" error="Error text" id="my-checkbox" />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby', 'my-checkbox-error');
    });

    it('checkbox has aria-invalid when error is present', () => {
      render(<CheckboxField label="Accept" error="Error text" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    });

    it('passes through errorProps', () => {
      render(
        <CheckboxField
          label="Accept"
          error="Error text"
          errorProps={{ showIcon: false }}
        />
      );
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  describe('Error/Hint precedence', () => {
    it('hides hint when error is present', () => {
      render(
        <CheckboxField label="Accept" hint="Helper text" error="Error text" />
      );
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
      expect(screen.getByText('Error text')).toBeInTheDocument();
    });

    it('shows hint when error is empty string', () => {
      render(<CheckboxField label="Accept" hint="Helper text" error="" />);
      expect(screen.getByText('Helper text')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('aria-describedby points to error when both hint and error provided', () => {
      render(
        <CheckboxField
          label="Accept"
          hint="Helper text"
          error="Error text"
          id="my-checkbox"
        />
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby', 'my-checkbox-error');
    });
  });

  describe('Disabled state', () => {
    it('checkbox is disabled when disabled prop is true', () => {
      render(<CheckboxField label="Accept terms" disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('label has disabled styling when disabled', () => {
      render(<CheckboxField label="Accept terms" disabled />);
      const label = screen.getByText('Accept terms').closest('label');
      expect(label).toHaveClass('cursor-not-allowed', 'text-text-secondary');
    });

    it('label is not clickable when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <CheckboxField
          label="Accept terms"
          disabled
          onCheckedChange={handleChange}
        />
      );

      const label = screen.getByText('Accept terms');
      await user.click(label);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to underlying checkbox element', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<CheckboxField label="Accept terms" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toBe(screen.getByRole('checkbox'));
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<CheckboxField label="Accept terms" ref={ref} />);
      ref.current?.focus();
      expect(screen.getByRole('checkbox')).toHaveFocus();
    });
  });

  describe('Props passthrough', () => {
    it('passes checked prop to Checkbox', () => {
      render(<CheckboxField label="Accept" checked />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'data-state',
        'checked'
      );
    });

    it('passes indeterminate prop to Checkbox', () => {
      render(<CheckboxField label="Accept" indeterminate />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'data-state',
        'indeterminate'
      );
    });

    it('passes defaultChecked prop to Checkbox', () => {
      render(<CheckboxField label="Accept" defaultChecked />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'data-state',
        'checked'
      );
    });
  });

  describe('containerClassName', () => {
    it('applies containerClassName to wrapper div', () => {
      const { container } = render(
        <CheckboxField label="Accept" containerClassName="custom-container" />
      );
      expect(container.firstChild).toHaveClass('custom-container');
    });

    it('preserves default flex-col class', () => {
      const { container } = render(
        <CheckboxField label="Accept" containerClassName="custom-container" />
      );
      expect(container.firstChild).toHaveClass('flex', 'flex-col');
    });
  });

  describe('ID generation', () => {
    it('generates unique ID when not provided', () => {
      render(<CheckboxField label="Field 1" />);
      render(<CheckboxField label="Field 2" />);

      const checkboxes = screen.getAllByRole('checkbox');
      const ids = checkboxes.map((checkbox) => checkbox.getAttribute('id'));

      // Both should have IDs
      expect(ids[0]).toBeTruthy();
      expect(ids[1]).toBeTruthy();

      // IDs should be different
      expect(ids[0]).not.toBe(ids[1]);
    });

    it('uses provided ID over generated one', () => {
      render(<CheckboxField label="Accept" id="custom-id" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Custom aria-describedby', () => {
    it('uses provided aria-describedby over generated one', () => {
      render(
        <CheckboxField
          label="Accept"
          hint="Helper text"
          aria-describedby="custom-description"
        />
      );
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'aria-describedby',
        'custom-description'
      );
    });
  });

  describe('Event handling', () => {
    it('calls onCheckedChange when checked state changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<CheckboxField label="Accept" onCheckedChange={handleChange} />);

      await user.click(screen.getByRole('checkbox'));
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('toggles checkbox when clicked', async () => {
      const user = userEvent.setup();
      render(<CheckboxField label="Accept" />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('data-state', 'unchecked');

      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('data-state', 'checked');

      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    });

    it('toggles checkbox with Space key', async () => {
      const user = userEvent.setup();
      render(<CheckboxField label="Accept" />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();

      await user.keyboard(' ');
      expect(checkbox).toHaveAttribute('data-state', 'checked');
    });
  });

  describe('Edge cases', () => {
    it('handles very long label text', () => {
      const longLabel = 'A'.repeat(200);
      render(<CheckboxField label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles very long error text', () => {
      const longError = 'B'.repeat(500);
      render(<CheckboxField label="Accept" error={longError} />);
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it('renders all features together', () => {
      render(
        <CheckboxField
          label="Accept terms and conditions"
          hint="Please read the terms before accepting"
          required
          size="lg"
        />
      );

      expect(screen.getByText('Accept terms and conditions')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(
        screen.getByText('Please read the terms before accepting')
      ).toBeInTheDocument();
    });

    it('handles error state with all features', () => {
      render(
        <CheckboxField
          label="Accept terms"
          hint="Hidden hint"
          error="You must accept the terms"
          required
        />
      );

      expect(screen.getByText('Accept terms')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.queryByText('Hidden hint')).not.toBeInTheDocument();
      expect(screen.getByText('You must accept the terms')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('handles combining disabled + error states', () => {
      render(
        <CheckboxField
          label="Accept terms"
          error="You must accept the terms"
          disabled
        />
      );

      expect(screen.getByRole('checkbox')).toBeDisabled();
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
      expect(screen.getByText('You must accept the terms')).toBeInTheDocument();
    });

    it('handles indeterminate state with label', () => {
      render(<CheckboxField label="Select all" indeterminate />);
      expect(screen.getByRole('checkbox')).toHaveAttribute(
        'data-state',
        'indeterminate'
      );
    });
  });
});
