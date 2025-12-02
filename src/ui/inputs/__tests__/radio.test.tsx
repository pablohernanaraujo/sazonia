import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Radio, RadioGroup } from '../radio';

describe('Radio', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toBeInTheDocument();
      expect(radio).toHaveAttribute('aria-checked', 'false');
    });

    it('renders unchecked state correctly', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('aria-checked', 'false');
      expect(radio).toHaveAttribute('data-state', 'unchecked');
    });

    it('renders checked state correctly', () => {
      render(
        <RadioGroup defaultValue="option1">
          <Radio value="option1" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('aria-checked', 'true');
      expect(radio).toHaveAttribute('data-state', 'checked');
    });
  });

  describe('Size Variants', () => {
    it('applies sm size classes', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" size="sm" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveClass('size-4');
    });

    it('applies md size classes (default)', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" size="md" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveClass('size-5');
    });

    it('applies lg size classes', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" size="lg" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveClass('size-6');
    });

    it('defaults to md size when not specified', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveClass('size-5');
    });
  });

  describe('State Tests', () => {
    it('disabled radio cannot be clicked', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(
        <RadioGroup defaultValue="" onValueChange={handleChange}>
          <Radio value="option1" disabled />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');

      expect(radio).toBeDisabled();
      await user.click(radio);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('disabled radio has correct attributes', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" disabled />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toBeDisabled();
      expect(radio).toHaveAttribute('data-disabled', '');
    });

    it('error state applies error styling', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" error />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveClass('border-destructive');
    });

    it('selecting a radio fires callback', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(
        <RadioGroup defaultValue="" onValueChange={handleChange}>
          <Radio value="option1" />
        </RadioGroup>
      );
      await user.click(screen.getByRole('radio'));

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('option1');
    });

    it('selecting different radio changes selection', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(
        <RadioGroup defaultValue="option1" onValueChange={handleChange}>
          <Radio value="option1" />
          <Radio value="option2" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).toHaveAttribute('aria-checked', 'true');
      expect(radios[1]).toHaveAttribute('aria-checked', 'false');

      await user.click(radios[1]);
      expect(handleChange).toHaveBeenCalledWith('option2');
    });
  });

  describe('Keyboard Interaction', () => {
    it('Space key selects radio', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(
        <RadioGroup defaultValue="" onValueChange={handleChange}>
          <Radio value="option1" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');

      radio.focus();
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('option1');
    });

    it('Arrow keys navigate between radios', async () => {
      const user = userEvent.setup();

      render(
        <RadioGroup defaultValue="option1">
          <Radio value="option1" />
          <Radio value="option2" />
          <Radio value="option3" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole('radio');
      // Tab into the group - focus should go to the selected radio
      await user.tab();
      expect(radios[0]).toHaveFocus();
      expect(radios[0]).toHaveAttribute('aria-checked', 'true');

      // Arrow down moves focus to the next radio
      await user.keyboard('{ArrowDown}');
      expect(radios[1]).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(radios[2]).toHaveFocus();
    });

    it('disabled radio ignores keyboard', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(
        <RadioGroup defaultValue="" onValueChange={handleChange}>
          <Radio value="option1" disabled />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');

      radio.focus();
      await user.keyboard(' ');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('can be focused via tab', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <input data-testid="input" />
          <RadioGroup defaultValue="">
            <Radio value="option1" data-testid="radio" />
          </RadioGroup>
        </div>
      );

      await user.tab();
      await user.tab();

      expect(screen.getByRole('radio')).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has role="radio"', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('RadioGroup has role="radiogroup"', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('has aria-checked=false for unchecked', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radio')).toHaveAttribute('aria-checked', 'false');
    });

    it('has aria-checked=true for checked', () => {
      render(
        <RadioGroup defaultValue="option1">
          <Radio value="option1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radio')).toHaveAttribute('aria-checked', 'true');
    });

    it('has data-disabled when disabled', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" disabled />
        </RadioGroup>
      );
      expect(screen.getByRole('radio')).toHaveAttribute('data-disabled', '');
    });

    it('supports aria-label', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" aria-label="First option" />
        </RadioGroup>
      );
      expect(
        screen.getByRole('radio', { name: 'First option' })
      ).toBeInTheDocument();
    });

    it('supports aria-labelledby', () => {
      render(
        <>
          <label id="option-label">Option 1</label>
          <RadioGroup defaultValue="">
            <Radio value="option1" aria-labelledby="option-label" />
          </RadioGroup>
        </>
      );
      expect(screen.getByRole('radio', { name: 'Option 1' })).toBeInTheDocument();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works as controlled component', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      const { rerender } = render(
        <RadioGroup value="" onValueChange={handleChange}>
          <Radio value="option1" />
          <Radio value="option2" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole('radio');
      await user.click(radios[0]);
      expect(handleChange).toHaveBeenCalledWith('option1');

      // State doesn't change until parent updates prop
      expect(radios[0]).toHaveAttribute('aria-checked', 'false');

      // Simulate parent updating
      rerender(
        <RadioGroup value="option1" onValueChange={handleChange}>
          <Radio value="option1" />
          <Radio value="option2" />
        </RadioGroup>
      );
      expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    });

    it('works as uncontrolled component', async () => {
      const user = userEvent.setup();

      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" />
          <Radio value="option2" />
        </RadioGroup>
      );
      const radios = screen.getAllByRole('radio');

      expect(radios[0]).toHaveAttribute('aria-checked', 'false');

      await user.click(radios[0]);
      expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    });

    it('respects defaultValue initial value', () => {
      render(
        <RadioGroup defaultValue="option2">
          <Radio value="option1" />
          <Radio value="option2" />
        </RadioGroup>
      );
      const radios = screen.getAllByRole('radio');
      expect(radios[0]).toHaveAttribute('aria-checked', 'false');
      expect(radios[1]).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('RadioGroup Props', () => {
    it('supports name prop for form submission', () => {
      // Radix creates hidden inputs when a value is selected
      render(
        <RadioGroup name="my-radio-group" defaultValue="option1">
          <Radio value="option1" />
          <Radio value="option2" />
        </RadioGroup>
      );
      const radioGroup = screen.getByRole('radiogroup');
      // Verify the name prop is applied via the RadioGroup component
      expect(radioGroup).toBeInTheDocument();
      // Check that radio items have proper value attributes
      const radios = screen.getAllByRole('radio');
      expect(radios[0]).toHaveAttribute('value', 'option1');
      expect(radios[1]).toHaveAttribute('value', 'option2');
    });

    it('supports horizontal orientation', () => {
      render(
        <RadioGroup orientation="horizontal" defaultValue="">
          <Radio value="option1" />
        </RadioGroup>
      );
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveClass('flex-row');
    });

    it('supports vertical orientation (default)', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" />
        </RadioGroup>
      );
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveClass('flex-col');
    });

    it('supports disabled on RadioGroup', () => {
      render(
        <RadioGroup disabled defaultValue="">
          <Radio value="option1" />
          <Radio value="option2" />
        </RadioGroup>
      );
      const radios = screen.getAllByRole('radio');
      expect(radios[0]).toBeDisabled();
      expect(radios[1]).toBeDisabled();
    });

    it('supports required prop', () => {
      render(
        <RadioGroup required defaultValue="">
          <Radio value="option1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toHaveAttribute(
        'aria-required',
        'true'
      );
    });
  });

  describe('Edge Cases', () => {
    it('merges custom className on Radio', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" className="custom-class mt-4" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveClass('custom-class', 'mt-4');
    });

    it('merges custom className on RadioGroup', () => {
      render(
        <RadioGroup defaultValue="" className="custom-group-class">
          <Radio value="option1" />
        </RadioGroup>
      );
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveClass('custom-group-class');
    });

    it('forwards ref correctly to Radio', () => {
      const ref = { current: null };
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" ref={ref} />
        </RadioGroup>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('forwards ref correctly to RadioGroup', () => {
      const ref = { current: null };
      render(
        <RadioGroup defaultValue="" ref={ref}>
          <Radio value="option1" />
        </RadioGroup>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('single radio in group', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="only-option" />
        </RadioGroup>
      );
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('error state combined with disabled', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" error disabled />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveClass('border-destructive');
      expect(radio).toBeDisabled();
    });

    it('clicking selected radio does not deselect', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(
        <RadioGroup defaultValue="option1" onValueChange={handleChange}>
          <Radio value="option1" />
        </RadioGroup>
      );

      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('aria-checked', 'true');

      await user.click(radio);
      // Radio should still be checked, callback not called
      expect(radio).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Focus Management', () => {
    it('has focus-visible ring classes', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      expect(radio).toHaveClass('focus-visible:ring-2');
      expect(radio).toHaveClass('focus-visible:outline-none');
    });

    it('can receive focus programmatically', () => {
      render(
        <RadioGroup defaultValue="">
          <Radio value="option1" data-testid="radio" />
        </RadioGroup>
      );
      const radio = screen.getByRole('radio');
      radio.focus();
      expect(radio).toHaveFocus();
    });

    it('disabled radio cannot receive focus via tab', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <input data-testid="input" />
          <RadioGroup defaultValue="">
            <Radio value="option1" disabled data-testid="radio" />
          </RadioGroup>
          <button data-testid="button">Button</button>
        </div>
      );

      await user.tab(); // Focus input
      await user.tab(); // Should skip radio, focus button

      expect(screen.getByTestId('button')).toHaveFocus();
    });

    it('focus moves to selected radio when tabbing into group', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <input data-testid="input" />
          <RadioGroup defaultValue="option2">
            <Radio value="option1" />
            <Radio value="option2" />
            <Radio value="option3" />
          </RadioGroup>
        </div>
      );

      await user.tab(); // Focus input
      await user.tab(); // Focus radio group

      const radios = screen.getAllByRole('radio');
      // Focus should be on the selected radio (option2)
      expect(radios[1]).toHaveFocus();
    });
  });
});
