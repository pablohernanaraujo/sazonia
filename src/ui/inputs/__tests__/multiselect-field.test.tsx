import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { MultiselectOption } from '../multiselect';
import { MultiselectField } from '../multiselect-field';

const mockOptions: MultiselectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', disabled: true },
];

describe('MultiselectField', () => {
  describe('Rendering', () => {
    it('renders with placeholder', () => {
      render(
        <MultiselectField placeholder="Select options" options={mockOptions} />
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Select options')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(
        <MultiselectField
          label="Categories"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByText('Categories')).toBeInTheDocument();
    });

    it('renders with hint', () => {
      render(
        <MultiselectField
          label="Categories"
          hint="Choose your categories"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByText('Choose your categories')).toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(
        <MultiselectField
          label="Categories"
          error="Please select at least one category"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(
        screen.getByText('Please select at least one category')
      ).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('error replaces hint', () => {
      render(
        <MultiselectField
          label="Categories"
          hint="Choose your categories"
          error="Please select at least one"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByText('Please select at least one')).toBeInTheDocument();
      expect(
        screen.queryByText('Choose your categories')
      ).not.toBeInTheDocument();
    });
  });

  describe('Label Props', () => {
    it('shows required indicator', () => {
      render(
        <MultiselectField
          label="Categories"
          labelProps={{ required: true }}
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('shows help icon', () => {
      render(
        <MultiselectField
          label="Categories"
          labelProps={{ showIcon: true }}
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByLabelText('Help for Categories')).toBeInTheDocument();
    });

    it('passes custom aria label to help icon', () => {
      render(
        <MultiselectField
          label="Categories"
          labelProps={{ showIcon: true, helpIconAriaLabel: 'Category info' }}
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByLabelText('Category info')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies SM size', () => {
      render(
        <MultiselectField
          size="sm"
          label="Categories"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('button')).toHaveClass('min-h-8');
    });

    it('applies MD size', () => {
      render(
        <MultiselectField
          size="md"
          label="Categories"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('button')).toHaveClass('min-h-10');
    });

    it('applies LG size by default', () => {
      render(
        <MultiselectField
          label="Categories"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('button')).toHaveClass('min-h-12');
    });

    it('maps SM input size to SM label size', () => {
      render(
        <MultiselectField
          size="sm"
          label="Categories"
          placeholder="Select"
          options={mockOptions}
        />
      );
      // SM label has pb-2.5
      const label = screen.getByText('Categories').closest('label');
      expect(label).toHaveClass('pb-2.5');
    });

    it('maps LG input size to MD label size', () => {
      render(
        <MultiselectField
          size="lg"
          label="Categories"
          placeholder="Select"
          options={mockOptions}
        />
      );
      // MD label has pb-3
      const label = screen.getByText('Categories').closest('label');
      expect(label).toHaveClass('pb-3');
    });
  });

  describe('Style Variants', () => {
    it('applies bordered variant by default', () => {
      render(<MultiselectField placeholder="Select" options={mockOptions} />);
      expect(screen.getByRole('button')).toHaveClass('border');
    });

    it('applies borderless variant', () => {
      render(
        <MultiselectField
          variant="borderless"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('button')).not.toHaveClass('border');
    });
  });

  describe('Error State', () => {
    it('applies error styling', () => {
      render(
        <MultiselectField
          error="Error message"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('button')).toHaveClass('border-destructive');
    });

    it('sets aria-invalid when error is present', () => {
      render(
        <MultiselectField
          error="Error message"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('button')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not set aria-invalid without error', () => {
      render(<MultiselectField placeholder="Select" options={mockOptions} />);
      expect(screen.getByRole('button')).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('Disabled State', () => {
    it('applies disabled attribute', () => {
      render(
        <MultiselectField disabled placeholder="Select" options={mockOptions} />
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Left Add-on', () => {
    it('renders left add-on', () => {
      render(
        <MultiselectField
          leftAddOn={<span data-testid="addon">$</span>}
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByTestId('addon')).toBeInTheDocument();
    });
  });

  describe('Search', () => {
    it('shows search input by default', async () => {
      const user = userEvent.setup();
      render(<MultiselectField placeholder="Select" options={mockOptions} />);

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('searchbox')).toBeInTheDocument();
      });
    });

    it('hides search input when showSearch is false', async () => {
      const user = userEvent.setup();
      render(
        <MultiselectField
          placeholder="Select"
          options={mockOptions}
          showSearch={false}
        />
      );

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    });

    it('uses custom search placeholder', async () => {
      const user = userEvent.setup();
      render(
        <MultiselectField
          placeholder="Select"
          options={mockOptions}
          searchPlaceholder="Find options..."
        />
      );

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText('Find options...')
        ).toBeInTheDocument();
      });
    });

    it('filters options based on search', async () => {
      const user = userEvent.setup();
      render(<MultiselectField placeholder="Select" options={mockOptions} />);

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'Option 1');

      expect(
        screen.getByRole('option', { name: /Option 1/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('option', { name: /Option 2/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Options', () => {
    it('renders all options', async () => {
      const user = userEvent.setup();
      render(<MultiselectField placeholder="Select" options={mockOptions} />);

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(
        screen.getByRole('option', { name: /Option 1/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: /Option 2/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: /Option 3/i })
      ).toBeInTheDocument();
    });

    it('marks disabled options', async () => {
      const user = userEvent.setup();
      render(<MultiselectField placeholder="Select" options={mockOptions} />);

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      expect(screen.getByRole('option', { name: /Option 3/i })).toHaveAttribute(
        'aria-disabled',
        'true'
      );
    });

    it('shows empty text when no options match', async () => {
      const user = userEvent.setup();
      render(
        <MultiselectField
          placeholder="Select"
          options={mockOptions}
          emptyText="Nothing found"
        />
      );

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'zzzzz');

      expect(screen.getByText('Nothing found')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('calls onValueChange when option is selected', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <MultiselectField
          placeholder="Select"
          options={mockOptions}
          onValueChange={handleChange}
        />
      );

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: /Option 1/i }));

      expect(handleChange).toHaveBeenCalledWith(['option1']);
    });

    it('displays selected values as tags', async () => {
      const user = userEvent.setup();
      render(<MultiselectField placeholder="Select" options={mockOptions} />);

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('option', { name: /Option 1/i }));
      await user.click(screen.getByRole('option', { name: /Option 2/i }));

      // Close dropdown
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });
    });

    it('works with controlled value', () => {
      render(
        <MultiselectField
          value={['option1', 'option2']}
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('works with defaultValue', () => {
      render(
        <MultiselectField
          defaultValue={['option1']}
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  describe('Value Display Options', () => {
    it('respects maxDisplayTags', () => {
      render(
        <MultiselectField
          defaultValue={['option1', 'option2']}
          placeholder="Select"
          options={mockOptions}
          maxDisplayTags={1}
        />
      );
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('+1 more')).toBeInTheDocument();
    });

    it('shows count when displayMode is count', () => {
      render(
        <MultiselectField
          defaultValue={['option1', 'option2']}
          placeholder="Select"
          options={mockOptions}
          displayMode="count"
        />
      );
      expect(screen.getByText('2 selected')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to trigger', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <MultiselectField ref={ref} placeholder="Select" options={mockOptions} />
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Accessibility', () => {
    it('associates label with trigger via htmlFor', () => {
      render(
        <MultiselectField
          label="Categories"
          placeholder="Select"
          options={mockOptions}
        />
      );
      const trigger = screen.getByRole('button');
      const label = screen.getByText('Categories').closest('label');
      expect(label).toHaveAttribute('for', trigger.id);
    });

    it('associates error with trigger via aria-describedby', () => {
      render(
        <MultiselectField
          error="Error message"
          placeholder="Select"
          options={mockOptions}
        />
      );
      const trigger = screen.getByRole('button');
      const errorId = trigger.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(screen.getByRole('alert')).toHaveAttribute('id', errorId);
    });

    it('associates hint with trigger via aria-describedby', () => {
      render(
        <MultiselectField
          hint="Help text"
          placeholder="Select"
          options={mockOptions}
        />
      );
      const trigger = screen.getByRole('button');
      const describedBy = trigger.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(screen.getByText('Help text')).toHaveAttribute('id', describedBy);
    });

    it('sets aria-required when required', () => {
      render(
        <MultiselectField
          label="Categories"
          labelProps={{ required: true }}
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('button')).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('className Merging', () => {
    it('merges containerClassName', () => {
      const { container } = render(
        <MultiselectField
          containerClassName="custom-container"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(container.firstChild).toHaveClass('custom-container');
    });

    it('merges triggerClassName', () => {
      render(
        <MultiselectField
          triggerClassName="custom-trigger"
          placeholder="Select"
          options={mockOptions}
        />
      );
      expect(screen.getByRole('button')).toHaveClass('custom-trigger');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', async () => {
      const user = userEvent.setup();
      render(<MultiselectField placeholder="Select" options={[]} />);

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText('No options found')).toBeInTheDocument();
      });
    });

    it('handles options with special characters', async () => {
      const user = userEvent.setup();
      render(
        <MultiselectField
          placeholder="Select"
          options={[{ value: 'special', label: '<script>alert("xss")</script>' }]}
        />
      );

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Should render as text, not execute
      expect(
        screen.getByRole('option', { name: '<script>alert("xss")</script>' })
      ).toBeInTheDocument();
    });
  });
});
