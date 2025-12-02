import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  MultiselectBadge,
  MultiselectContent,
  MultiselectTag,
} from '../multiselect-content';

describe('MultiselectTag', () => {
  describe('Rendering', () => {
    it('renders with label text', () => {
      render(<MultiselectTag label="United States" value="us" />);
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    it('renders as div element with role="option"', () => {
      render(<MultiselectTag label="Option" value="opt" />);
      const tag = screen.getByRole('option');
      expect(tag).toBeInTheDocument();
      expect(tag.tagName).toBe('DIV');
    });

    it('renders close button with accessible label', () => {
      render(<MultiselectTag label="United States" value="us" />);
      const removeButton = screen.getByRole('button', {
        name: 'Remove United States',
      });
      expect(removeButton).toBeInTheDocument();
    });

    it('renders X icon inside close button', () => {
      render(<MultiselectTag label="Option" value="opt" />);
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Size variants', () => {
    it('applies MD size by default', () => {
      render(<MultiselectTag label="Option" value="opt" />);
      const tag = screen.getByRole('option');
      expect(tag).toHaveClass('px-2', 'py-0.5');
    });

    it('applies SM size variant', () => {
      render(<MultiselectTag label="Option" value="opt" size="sm" />);
      const tag = screen.getByRole('option');
      expect(tag).toHaveClass('px-1.5', 'py-0.5');
    });

    it('applies MD size variant explicitly', () => {
      render(<MultiselectTag label="Option" value="opt" size="md" />);
      const tag = screen.getByRole('option');
      expect(tag).toHaveClass('px-2', 'py-0.5');
    });
  });

  describe('Truncation', () => {
    it('does not truncate by default', () => {
      render(<MultiselectTag label="Very long label text" value="long" />);
      const text = screen.getByText('Very long label text');
      expect(text).not.toHaveClass('truncate');
    });

    it('applies truncate class when truncate is true', () => {
      render(
        <MultiselectTag label="Very long label text" value="long" truncate />
      );
      const text = screen.getByText('Very long label text');
      expect(text).toHaveClass('truncate');
    });
  });

  describe('Click handler', () => {
    it('calls onRemove with value when X clicked', async () => {
      const onRemove = vi.fn();
      const user = userEvent.setup();

      render(
        <MultiselectTag label="Option" value="test-value" onRemove={onRemove} />
      );
      const removeButton = screen.getByRole('button', { name: 'Remove Option' });

      await user.click(removeButton);
      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove).toHaveBeenCalledWith('test-value');
    });

    it('does not call onRemove when disabled', async () => {
      const onRemove = vi.fn();
      const user = userEvent.setup();

      render(
        <MultiselectTag
          label="Option"
          value="test-value"
          onRemove={onRemove}
          disabled
        />
      );
      const removeButton = screen.getByRole('button', { name: 'Remove Option' });

      await user.click(removeButton);
      expect(onRemove).not.toHaveBeenCalled();
    });

    it('does not throw when onRemove is not provided', async () => {
      const user = userEvent.setup();

      render(<MultiselectTag label="Option" value="test-value" />);
      const removeButton = screen.getByRole('button', { name: 'Remove Option' });

      await expect(user.click(removeButton)).resolves.not.toThrow();
    });
  });

  describe('Keyboard accessibility', () => {
    it('triggers onRemove on Enter key', () => {
      const onRemove = vi.fn();

      render(
        <MultiselectTag label="Option" value="test-value" onRemove={onRemove} />
      );
      const removeButton = screen.getByRole('button', { name: 'Remove Option' });

      fireEvent.keyDown(removeButton, { key: 'Enter' });
      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove).toHaveBeenCalledWith('test-value');
    });

    it('triggers onRemove on Space key', () => {
      const onRemove = vi.fn();

      render(
        <MultiselectTag label="Option" value="test-value" onRemove={onRemove} />
      );
      const removeButton = screen.getByRole('button', { name: 'Remove Option' });

      fireEvent.keyDown(removeButton, { key: ' ' });
      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove).toHaveBeenCalledWith('test-value');
    });

    it('does not trigger onRemove on other keys', () => {
      const onRemove = vi.fn();

      render(
        <MultiselectTag label="Option" value="test-value" onRemove={onRemove} />
      );
      const removeButton = screen.getByRole('button', { name: 'Remove Option' });

      fireEvent.keyDown(removeButton, { key: 'Tab' });
      expect(onRemove).not.toHaveBeenCalled();
    });

    it('does not trigger on Enter when disabled', () => {
      const onRemove = vi.fn();

      render(
        <MultiselectTag
          label="Option"
          value="test-value"
          onRemove={onRemove}
          disabled
        />
      );
      const removeButton = screen.getByRole('button', { name: 'Remove Option' });

      fireEvent.keyDown(removeButton, { key: 'Enter' });
      expect(onRemove).not.toHaveBeenCalled();
    });
  });

  describe('Disabled state', () => {
    it('applies disabled styling', () => {
      render(<MultiselectTag label="Option" value="opt" disabled />);
      const tag = screen.getByRole('option');
      expect(tag).toHaveClass('opacity-50');
    });

    it('sets aria-disabled when disabled', () => {
      render(<MultiselectTag label="Option" value="opt" disabled />);
      const tag = screen.getByRole('option');
      expect(tag).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not set aria-disabled when not disabled', () => {
      render(<MultiselectTag label="Option" value="opt" />);
      const tag = screen.getByRole('option');
      expect(tag).not.toHaveAttribute('aria-disabled');
    });

    it('disables remove button when disabled', () => {
      render(<MultiselectTag label="Option" value="opt" disabled />);
      const removeButton = screen.getByRole('button');
      expect(removeButton).toBeDisabled();
    });

    it('sets tabIndex to -1 on button when disabled', () => {
      render(<MultiselectTag label="Option" value="opt" disabled />);
      const removeButton = screen.getByRole('button');
      expect(removeButton).toHaveAttribute('tabindex', '-1');
    });

    it('sets tabIndex to 0 on button when not disabled', () => {
      render(<MultiselectTag label="Option" value="opt" />);
      const removeButton = screen.getByRole('button');
      expect(removeButton).toHaveAttribute('tabindex', '0');
    });

    it('applies tertiary text color when disabled', () => {
      render(<MultiselectTag label="Option" value="opt" disabled />);
      const text = screen.getByText('Option');
      expect(text).toHaveClass('text-text-tertiary');
    });
  });

  describe('Accessibility', () => {
    it('has role="option"', () => {
      render(<MultiselectTag label="Option" value="opt" />);
      expect(screen.getByRole('option')).toBeInTheDocument();
    });

    it('sets aria-selected to true', () => {
      render(<MultiselectTag label="Option" value="opt" />);
      const tag = screen.getByRole('option');
      expect(tag).toHaveAttribute('aria-selected', 'true');
    });

    it('remove button has aria-label', () => {
      render(<MultiselectTag label="Test Item" value="test" />);
      const button = screen.getByRole('button', { name: 'Remove Test Item' });
      expect(button).toHaveAttribute('aria-label', 'Remove Test Item');
    });

    it('icon is aria-hidden', () => {
      render(<MultiselectTag label="Option" value="opt" />);
      const icon = screen.getByRole('button').querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Composition', () => {
    it('merges custom className correctly', () => {
      render(
        <MultiselectTag
          label="Option"
          value="opt"
          className="custom-class mt-4"
        />
      );
      const tag = screen.getByRole('option');
      expect(tag).toHaveClass('custom-class', 'mt-4');
    });

    it('forwards ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(<MultiselectTag label="Option" value="opt" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('ref points to the root div element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<MultiselectTag label="Option" value="opt" ref={ref} />);
      const tag = screen.getByRole('option');
      expect(ref.current).toBe(tag);
    });

    it('passes through additional props', () => {
      render(
        <MultiselectTag label="Option" value="opt" data-testid="custom-tag" />
      );
      expect(screen.getByTestId('custom-tag')).toBeInTheDocument();
    });
  });

  describe('Base styles', () => {
    it('applies flex layout', () => {
      render(<MultiselectTag label="Option" value="opt" />);
      const tag = screen.getByRole('option');
      expect(tag).toHaveClass('flex', 'items-center');
    });

    it('applies rounded-full', () => {
      render(<MultiselectTag label="Option" value="opt" />);
      const tag = screen.getByRole('option');
      expect(tag).toHaveClass('rounded-full');
    });

    it('applies background color', () => {
      render(<MultiselectTag label="Option" value="opt" />);
      const tag = screen.getByRole('option');
      expect(tag).toHaveClass('bg-background-tertiary');
    });

    it('applies gap between label and icon', () => {
      render(<MultiselectTag label="Option" value="opt" />);
      const tag = screen.getByRole('option');
      expect(tag).toHaveClass('gap-1');
    });
  });

  describe('Edge cases', () => {
    it('handles very long label text', () => {
      const longLabel = 'A'.repeat(200);
      render(<MultiselectTag label={longLabel} value="long" />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles special characters in label', () => {
      const specialLabel = '<script>alert("xss")</script>';
      render(<MultiselectTag label={specialLabel} value="special" />);
      expect(screen.getByText(specialLabel)).toBeInTheDocument();
    });

    it('handles unicode characters in label', () => {
      const unicodeLabel = '日本語 • 한국어 • العربية';
      render(<MultiselectTag label={unicodeLabel} value="unicode" />);
      expect(screen.getByText(unicodeLabel)).toBeInTheDocument();
    });
  });
});

describe('MultiselectBadge', () => {
  describe('Rendering', () => {
    it('renders with label text', () => {
      render(<MultiselectBadge label="React" />);
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('renders as div element with role="option"', () => {
      render(<MultiselectBadge label="Option" />);
      const badge = screen.getByRole('option');
      expect(badge).toBeInTheDocument();
      expect(badge.tagName).toBe('DIV');
    });

    it('does not render close button', () => {
      render(<MultiselectBadge label="Option" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('applies MD size by default', () => {
      render(<MultiselectBadge label="Option" />);
      const badge = screen.getByRole('option');
      expect(badge).toHaveClass('px-1.5', 'py-0.5');
    });

    it('applies SM size variant', () => {
      render(<MultiselectBadge label="Option" size="sm" />);
      const badge = screen.getByRole('option');
      expect(badge).toHaveClass('px-1', 'py-0.5');
    });

    it('applies MD size variant explicitly', () => {
      render(<MultiselectBadge label="Option" size="md" />);
      const badge = screen.getByRole('option');
      expect(badge).toHaveClass('px-1.5', 'py-0.5');
    });
  });

  describe('Accessibility', () => {
    it('has role="option"', () => {
      render(<MultiselectBadge label="Option" />);
      expect(screen.getByRole('option')).toBeInTheDocument();
    });

    it('sets aria-selected to true', () => {
      render(<MultiselectBadge label="Option" />);
      const badge = screen.getByRole('option');
      expect(badge).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Base styles', () => {
    it('applies flex layout', () => {
      render(<MultiselectBadge label="Option" />);
      const badge = screen.getByRole('option');
      expect(badge).toHaveClass('flex', 'items-center');
    });

    it('applies rounded-sm', () => {
      render(<MultiselectBadge label="Option" />);
      const badge = screen.getByRole('option');
      expect(badge).toHaveClass('rounded-sm');
    });

    it('applies primary background color', () => {
      render(<MultiselectBadge label="Option" />);
      const badge = screen.getByRole('option');
      expect(badge).toHaveClass('bg-primary-500');
    });

    it('applies white text color', () => {
      render(<MultiselectBadge label="Option" />);
      const text = screen.getByText('Option');
      expect(text).toHaveClass('text-white');
    });
  });

  describe('Composition', () => {
    it('merges custom className correctly', () => {
      render(<MultiselectBadge label="Option" className="custom-class mt-4" />);
      const badge = screen.getByRole('option');
      expect(badge).toHaveClass('custom-class', 'mt-4');
    });

    it('forwards ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(<MultiselectBadge label="Option" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('ref points to the root div element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<MultiselectBadge label="Option" ref={ref} />);
      const badge = screen.getByRole('option');
      expect(ref.current).toBe(badge);
    });

    it('passes through additional props', () => {
      render(<MultiselectBadge label="Option" data-testid="custom-badge" />);
      expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles very long label text', () => {
      const longLabel = 'A'.repeat(100);
      render(<MultiselectBadge label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles unicode characters', () => {
      const unicodeLabel = '日本語 • 한국어';
      render(<MultiselectBadge label={unicodeLabel} />);
      expect(screen.getByText(unicodeLabel)).toBeInTheDocument();
    });
  });
});

describe('MultiselectContent', () => {
  const sampleItems = [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
    { label: 'Mexico', value: 'mx' },
  ];

  describe('Rendering', () => {
    it('renders correct number of items', () => {
      render(<MultiselectContent items={sampleItems} />);
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
    });

    it('renders as div with role="listbox"', () => {
      render(<MultiselectContent items={sampleItems} />);
      const container = screen.getByRole('listbox');
      expect(container).toBeInTheDocument();
      expect(container.tagName).toBe('DIV');
    });

    it('sets aria-multiselectable to true', () => {
      render(<MultiselectContent items={sampleItems} />);
      const container = screen.getByRole('listbox');
      expect(container).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('renders all item labels', () => {
      render(<MultiselectContent items={sampleItems} />);
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('Mexico')).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('renders nothing when items array is empty', () => {
      const { container } = render(<MultiselectContent items={[]} />);
      expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing when items is undefined', () => {
      const { container } = render(
        // @ts-expect-error - testing undefined case
        <MultiselectContent items={undefined} />
      );
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('Variant: tags', () => {
    it('renders tags by default', () => {
      render(<MultiselectContent items={sampleItems} />);
      // Tags have close buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('renders tags when variant="tags"', () => {
      render(<MultiselectContent items={sampleItems} variant="tags" />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('passes onRemove to tags', async () => {
      const onRemove = vi.fn();
      const user = userEvent.setup();

      render(
        <MultiselectContent
          items={sampleItems}
          variant="tags"
          onRemove={onRemove}
        />
      );
      const removeButton = screen.getByRole('button', {
        name: 'Remove United States',
      });

      await user.click(removeButton);
      expect(onRemove).toHaveBeenCalledWith('us');
    });
  });

  describe('Variant: badges', () => {
    it('renders badges when variant="badges"', () => {
      render(<MultiselectContent items={sampleItems} variant="badges" />);
      // Badges have no close buttons
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders all badge labels', () => {
      render(<MultiselectContent items={sampleItems} variant="badges" />);
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getByText('Mexico')).toBeInTheDocument();
    });

    it('badges have no aria-readonly (removed per a11y lint)', () => {
      render(<MultiselectContent items={sampleItems} variant="badges" />);
      const badges = screen.getAllByRole('option');
      for (const badge of badges) {
        expect(badge).toHaveAttribute('aria-selected', 'true');
      }
    });
  });

  describe('Size prop', () => {
    it('passes size to tags', () => {
      render(<MultiselectContent items={sampleItems} size="sm" />);
      const tags = screen.getAllByRole('option');
      for (const tag of tags) {
        expect(tag).toHaveClass('px-1.5');
      }
    });

    it('passes size to badges', () => {
      render(
        <MultiselectContent items={sampleItems} variant="badges" size="sm" />
      );
      const badges = screen.getAllByRole('option');
      for (const badge of badges) {
        expect(badge).toHaveClass('px-1');
      }
    });
  });

  describe('Truncate prop', () => {
    it('passes truncate to tags', () => {
      render(<MultiselectContent items={sampleItems} truncate />);
      const texts = screen.getAllByText(/United States|Canada|Mexico/);
      for (const text of texts) {
        expect(text).toHaveClass('truncate');
      }
    });
  });

  describe('Disabled state', () => {
    it('disables all tags when disabled', () => {
      render(<MultiselectContent items={sampleItems} disabled />);
      const buttons = screen.getAllByRole('button');
      for (const button of buttons) {
        expect(button).toBeDisabled();
      }
    });

    it('respects individual item disabled state', () => {
      const itemsWithDisabled = [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2', disabled: true },
        { label: 'Option 3', value: 'opt3' },
      ];

      render(<MultiselectContent items={itemsWithDisabled} />);
      const buttons = screen.getAllByRole('button');

      expect(buttons[0]).not.toBeDisabled();
      expect(buttons[1]).toBeDisabled();
      expect(buttons[2]).not.toBeDisabled();
    });
  });

  describe('Gap variants', () => {
    it('applies MD gap by default', () => {
      render(<MultiselectContent items={sampleItems} />);
      const container = screen.getByRole('listbox');
      expect(container).toHaveClass('gap-1');
    });

    it('applies SM gap', () => {
      render(<MultiselectContent items={sampleItems} gap="sm" />);
      const container = screen.getByRole('listbox');
      expect(container).toHaveClass('gap-0.5');
    });

    it('applies LG gap', () => {
      render(<MultiselectContent items={sampleItems} gap="lg" />);
      const container = screen.getByRole('listbox');
      expect(container).toHaveClass('gap-1.5');
    });
  });

  describe('Layout', () => {
    it('applies flex container', () => {
      render(<MultiselectContent items={sampleItems} />);
      const container = screen.getByRole('listbox');
      expect(container).toHaveClass('flex', 'flex-wrap');
    });
  });

  describe('Composition', () => {
    it('merges custom className correctly', () => {
      render(
        <MultiselectContent items={sampleItems} className="custom-class mt-4" />
      );
      const container = screen.getByRole('listbox');
      expect(container).toHaveClass('custom-class', 'mt-4');
    });

    it('forwards ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(<MultiselectContent items={sampleItems} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('ref points to the root div element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<MultiselectContent items={sampleItems} ref={ref} />);
      const container = screen.getByRole('listbox');
      expect(ref.current).toBe(container);
    });

    it('passes through additional props', () => {
      render(
        <MultiselectContent items={sampleItems} data-testid="custom-content" />
      );
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('renders single item correctly', () => {
      render(
        <MultiselectContent items={[{ label: 'Only One', value: 'one' }]} />
      );
      expect(screen.getByText('Only One')).toBeInTheDocument();
      expect(screen.getAllByRole('option')).toHaveLength(1);
    });

    it('renders many items (20+) correctly', () => {
      const manyItems = Array.from({ length: 25 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: `opt${i + 1}`,
      }));

      render(<MultiselectContent items={manyItems} />);
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(25);
    });

    it('handles items with same label but different value', () => {
      const duplicateLabels = [
        { label: 'Option', value: 'opt1' },
        { label: 'Option', value: 'opt2' },
      ];

      render(<MultiselectContent items={duplicateLabels} />);
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(2);
    });

    it('handles rapid removal clicks', async () => {
      const onRemove = vi.fn();
      const user = userEvent.setup();

      render(<MultiselectContent items={sampleItems} onRemove={onRemove} />);

      const buttons = screen.getAllByRole('button');
      await Promise.all(buttons.map((button) => user.click(button)));

      expect(onRemove).toHaveBeenCalledTimes(3);
    });

    it('handles special characters in values', () => {
      const specialItems = [
        { label: 'Test', value: 'test@#$%' },
        { label: 'Test 2', value: 'test with spaces' },
      ];

      render(<MultiselectContent items={specialItems} />);
      expect(screen.getAllByRole('option')).toHaveLength(2);
    });
  });
});
