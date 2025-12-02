import { createRef } from 'react';
import { House, Star } from '@phosphor-icons/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DropmenuItem } from '../dropmenu-item';

describe('DropmenuItem', () => {
  describe('Rendering', () => {
    it('renders with required label prop', () => {
      render(<DropmenuItem label="Option" />);
      expect(screen.getByText('Option')).toBeInTheDocument();
    });

    it('renders as div element with role="option"', () => {
      render(<DropmenuItem label="Option" />);
      const container = screen.getByRole('option');
      expect(container).toBeInTheDocument();
      expect(container.tagName).toBe('DIV');
    });

    it('renders label text correctly', () => {
      render(<DropmenuItem label="United States" />);
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    it('renders with all size variants', () => {
      const { rerender } = render(<DropmenuItem label="Option" size="sm" />);
      expect(screen.getByRole('option')).toBeInTheDocument();

      rerender(<DropmenuItem label="Option" size="md" />);
      expect(screen.getByRole('option')).toBeInTheDocument();

      rerender(<DropmenuItem label="Option" size="lg" />);
      expect(screen.getByRole('option')).toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('applies LG size by default', () => {
      render(<DropmenuItem label="Option" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass(
        'px-4',
        'py-3',
        'gap-3',
        'text-base',
        'leading-6'
      );
    });

    it('applies SM size variant', () => {
      render(<DropmenuItem label="Option" size="sm" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass(
        'px-3',
        'py-1.5',
        'gap-2.5',
        'text-sm',
        'leading-5'
      );
    });

    it('applies MD size variant', () => {
      render(<DropmenuItem label="Option" size="md" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass(
        'px-3',
        'py-2.5',
        'gap-3',
        'text-sm',
        'leading-5'
      );
    });

    it('applies LG size variant explicitly', () => {
      render(<DropmenuItem label="Option" size="lg" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass(
        'px-4',
        'py-3',
        'gap-3',
        'text-base',
        'leading-6'
      );
    });
  });

  describe('Visual state variants', () => {
    it('applies default state (no additional class)', () => {
      render(<DropmenuItem label="Option" visualState="default" />);
      const container = screen.getByRole('option');
      expect(container).not.toHaveClass('bg-background-secondary');
      expect(container).not.toHaveClass('bg-background-tertiary');
    });

    it('applies hovered state', () => {
      render(<DropmenuItem label="Option" visualState="hovered" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass('bg-background-secondary');
    });

    it('applies pressed state', () => {
      render(<DropmenuItem label="Option" visualState="pressed" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass('bg-background-tertiary');
    });

    it('applies focus state', () => {
      render(<DropmenuItem label="Option" visualState="focus" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass(
        'ring-2',
        'ring-border-brand',
        'ring-offset-2'
      );
    });
  });

  describe('Selection state', () => {
    it('applies selected styling when selected', () => {
      render(<DropmenuItem label="Option" selected />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass(
        'border-l-[3px]',
        'border-info-500',
        'bg-info-50'
      );
    });

    it('does not apply selected styling when not selected', () => {
      render(<DropmenuItem label="Option" selected={false} />);
      const container = screen.getByRole('option');
      expect(container).not.toHaveClass('border-l-[3px]');
      expect(container).not.toHaveClass('bg-info-50');
    });

    it('sets aria-selected when selected', () => {
      render(<DropmenuItem label="Option" selected />);
      const container = screen.getByRole('option');
      expect(container).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-selected to false when not selected', () => {
      render(<DropmenuItem label="Option" selected={false} />);
      const container = screen.getByRole('option');
      expect(container).toHaveAttribute('aria-selected', 'false');
    });

    it('applies hover brand background when selected and hovered', () => {
      render(<DropmenuItem label="Option" selected visualState="hovered" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass('bg-info-100');
    });
  });

  describe('Checkbox', () => {
    it('does not render checkbox by default', () => {
      render(<DropmenuItem label="Option" />);
      const container = screen.getByRole('option');
      // No checkbox element rendered
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });

    it('renders checkbox when showCheckbox is true', () => {
      render(<DropmenuItem label="Option" showCheckbox />);
      const container = screen.getByRole('option');
      // Checkbox container is rendered
      expect(container.children.length).toBeGreaterThan(1);
    });

    it('shows checked checkbox when selected', () => {
      render(<DropmenuItem label="Option" showCheckbox selected />);
      const container = screen.getByRole('option');
      // Check icon should be rendered
      const checkIcon = container.querySelector('svg');
      expect(checkIcon).toBeInTheDocument();
    });

    it('shows unchecked checkbox when not selected', () => {
      render(<DropmenuItem label="Option" showCheckbox selected={false} />);
      const container = screen.getByRole('option');
      // Should have checkbox container but no check icon
      const checkIcon = container.querySelector('svg');
      expect(checkIcon).not.toBeInTheDocument();
    });

    it('applies checked styling to checkbox when selected', () => {
      render(<DropmenuItem label="Option" showCheckbox selected />);
      const container = screen.getByRole('option');
      const checkboxContainer = container.querySelector('[aria-hidden="true"]');
      expect(checkboxContainer).toHaveClass('bg-info-500');
    });

    it('applies unchecked styling to checkbox when not selected', () => {
      render(<DropmenuItem label="Option" showCheckbox selected={false} />);
      const container = screen.getByRole('option');
      const checkboxContainer = container.querySelector('[aria-hidden="true"]');
      expect(checkboxContainer).toHaveClass(
        'border',
        'border-border',
        'bg-background'
      );
    });

    it('sets aria-checked when showCheckbox is true', () => {
      render(<DropmenuItem label="Option" showCheckbox selected />);
      const container = screen.getByRole('option');
      expect(container).toHaveAttribute('aria-checked', 'true');
    });

    it('does not set aria-checked when showCheckbox is false', () => {
      render(<DropmenuItem label="Option" selected />);
      const container = screen.getByRole('option');
      expect(container).not.toHaveAttribute('aria-checked');
    });

    it('checkbox is aria-hidden', () => {
      render(<DropmenuItem label="Option" showCheckbox />);
      const container = screen.getByRole('option');
      const checkboxContainer = container.firstChild;
      expect(checkboxContainer).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Caption', () => {
    it('does not render caption when not provided', () => {
      render(<DropmenuItem label="Option" />);
      const container = screen.getByRole('option');
      // Only label should be present
      expect(container.textContent).toBe('Option');
    });

    it('renders caption when provided', () => {
      render(<DropmenuItem label="Option" caption="Description text" />);
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('renders both label and caption', () => {
      render(<DropmenuItem label="React" caption="JavaScript library" />);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('JavaScript library')).toBeInTheDocument();
    });

    it('caption has secondary text color', () => {
      render(<DropmenuItem label="Option" caption="Description" />);
      const caption = screen.getByText('Description');
      expect(caption).toHaveClass('text-text-secondary');
    });

    it('reduces padding when caption is present - SM size', () => {
      render(<DropmenuItem label="Option" caption="Desc" size="sm" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass('py-1');
    });

    it('reduces padding when caption is present - MD size', () => {
      render(<DropmenuItem label="Option" caption="Desc" size="md" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass('py-1.5');
    });

    it('reduces padding when caption is present - LG size', () => {
      render(<DropmenuItem label="Option" caption="Desc" size="lg" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass('py-1.5');
    });
  });

  describe('Disabled state', () => {
    it('applies disabled styling', () => {
      render(<DropmenuItem label="Option" disabled />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass('pointer-events-none', 'text-text-tertiary');
    });

    it('sets aria-disabled when disabled', () => {
      render(<DropmenuItem label="Option" disabled />);
      const container = screen.getByRole('option');
      expect(container).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not set aria-disabled when not disabled', () => {
      render(<DropmenuItem label="Option" />);
      const container = screen.getByRole('option');
      expect(container).not.toHaveAttribute('aria-disabled');
    });

    it('applies muted text color to label when disabled', () => {
      render(<DropmenuItem label="Option" disabled />);
      const label = screen.getByText('Option');
      expect(label).toHaveClass('text-text-tertiary');
    });

    it('applies muted text color to caption when disabled', () => {
      render(<DropmenuItem label="Option" caption="Description" disabled />);
      const caption = screen.getByText('Description');
      expect(caption).toHaveClass('text-text-tertiary');
    });

    it('sets tabIndex to -1 when disabled', () => {
      render(<DropmenuItem label="Option" disabled />);
      const container = screen.getByRole('option');
      expect(container).toHaveAttribute('tabindex', '-1');
    });

    it('sets tabIndex to 0 when not disabled', () => {
      render(<DropmenuItem label="Option" />);
      const container = screen.getByRole('option');
      expect(container).toHaveAttribute('tabindex', '0');
    });

    it('applies disabled checkbox styling when disabled', () => {
      render(<DropmenuItem label="Option" showCheckbox disabled />);
      const container = screen.getByRole('option');
      const checkboxContainer = container.querySelector('[aria-hidden="true"]');
      expect(checkboxContainer).toHaveClass('bg-background-tertiary');
    });

    it('applies disabled selected checkbox styling', () => {
      render(<DropmenuItem label="Option" showCheckbox selected disabled />);
      const container = screen.getByRole('option');
      const checkboxContainer = container.querySelector('[aria-hidden="true"]');
      expect(checkboxContainer).toHaveClass('bg-info-300');
    });
  });

  describe('Left add-on', () => {
    it('does not render left add-on by default', () => {
      render(<DropmenuItem label="Option" leftIcon={House} />);
      const container = screen.getByRole('option');
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBe(0);
    });

    it('renders left add-on when showLeftAddOn is true', () => {
      render(<DropmenuItem label="Option" showLeftAddOn leftIcon={House} />);
      const container = screen.getByRole('option');
      // Icon component renders an svg
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBe(1);
    });

    it('does not render left icon when showLeftAddOn is false', () => {
      render(
        <DropmenuItem label="Option" showLeftAddOn={false} leftIcon={House} />
      );
      const container = screen.getByRole('option');
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBe(0);
    });

    it('renders custom left add-on instead of icon', () => {
      render(
        <DropmenuItem
          label="Option"
          showLeftAddOn
          leftIcon={House}
          leftAddOn={<span data-testid="custom-left">Custom</span>}
        />
      );
      expect(screen.getByTestId('custom-left')).toBeInTheDocument();
      // Icon should not be rendered when custom add-on is provided
      const container = screen.getByRole('option');
      expect(container.querySelectorAll('svg')).toHaveLength(0);
    });

    it('applies muted styling to icon when disabled', () => {
      render(
        <DropmenuItem label="Option" showLeftAddOn leftIcon={House} disabled />
      );
      const icon = screen.getByRole('option').querySelector('svg');
      expect(icon).toHaveClass('text-text-tertiary');
    });

    it('icon is aria-hidden', () => {
      render(<DropmenuItem label="Option" showLeftAddOn leftIcon={House} />);
      const icon = screen.getByRole('option').querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Right add-on', () => {
    it('does not render right add-on by default', () => {
      render(<DropmenuItem label="Option" rightText="⌘C" />);
      expect(screen.queryByText('⌘C')).not.toBeInTheDocument();
    });

    it('renders right add-on when showRightAddOn is true', () => {
      render(<DropmenuItem label="Option" showRightAddOn rightText="⌘C" />);
      expect(screen.getByText('⌘C')).toBeInTheDocument();
    });

    it('does not render right text when showRightAddOn is false', () => {
      render(
        <DropmenuItem label="Option" showRightAddOn={false} rightText="⌘C" />
      );
      expect(screen.queryByText('⌘C')).not.toBeInTheDocument();
    });

    it('renders custom right add-on instead of text', () => {
      render(
        <DropmenuItem
          label="Option"
          showRightAddOn
          rightText="⌘C"
          rightAddOn={<span data-testid="custom-right">Custom</span>}
        />
      );
      expect(screen.getByTestId('custom-right')).toBeInTheDocument();
      expect(screen.queryByText('⌘C')).not.toBeInTheDocument();
    });

    it('applies muted color to right text', () => {
      render(<DropmenuItem label="Option" showRightAddOn rightText="⌘C" />);
      const rightText = screen.getByText('⌘C');
      expect(rightText).toHaveClass('text-text-secondary');
    });
  });

  describe('Both add-ons', () => {
    it('renders both add-ons simultaneously', () => {
      render(
        <DropmenuItem
          label="Option"
          showLeftAddOn
          leftIcon={House}
          showRightAddOn
          rightText="12"
        />
      );
      const container = screen.getByRole('option');
      expect(container.querySelector('svg')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('renders without any add-ons', () => {
      render(<DropmenuItem label="Option" />);
      const container = screen.getByRole('option');
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });

    it('renders checkbox and left icon together', () => {
      render(
        <DropmenuItem label="Option" showCheckbox showLeftAddOn leftIcon={Star} />
      );
      const container = screen.getByRole('option');
      // Checkbox container + Icon
      const elements = container.children;
      expect(elements.length).toBeGreaterThan(1);
    });
  });

  describe('Composition', () => {
    it('merges custom className correctly', () => {
      render(<DropmenuItem label="Option" className="custom-class mt-4" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass('custom-class', 'mt-4');
    });

    it('allows className to override base styles', () => {
      render(<DropmenuItem label="Option" className="px-8" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass('px-8');
    });

    it('forwards ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(<DropmenuItem label="Option" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('ref points to the root div element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<DropmenuItem label="Option" ref={ref} />);
      const container = screen.getByRole('option');
      expect(ref.current).toBe(container);
    });

    it('passes through additional props', () => {
      render(<DropmenuItem label="Option" data-testid="custom-item" />);
      expect(screen.getByTestId('custom-item')).toBeInTheDocument();
    });
  });

  describe('Base styles', () => {
    it('applies flex layout', () => {
      render(<DropmenuItem label="Option" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass('flex', 'items-center');
    });

    it('applies full width', () => {
      render(<DropmenuItem label="Option" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass('w-full');
    });

    it('applies cursor-pointer', () => {
      render(<DropmenuItem label="Option" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass('cursor-pointer');
    });

    it('applies transition', () => {
      render(<DropmenuItem label="Option" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass('transition-colors', 'duration-150');
    });

    it('applies rounded corners', () => {
      render(<DropmenuItem label="Option" />);
      const container = screen.getByRole('option');
      expect(container).toHaveClass('rounded-sm');
    });
  });

  describe('Label styles', () => {
    it('label has truncate class for overflow', () => {
      render(<DropmenuItem label="Very long label text that should truncate" />);
      const label = screen.getByText('Very long label text that should truncate');
      expect(label).toHaveClass('truncate');
    });

    it('label has primary text color by default', () => {
      render(<DropmenuItem label="Option" />);
      const label = screen.getByText('Option');
      expect(label).toHaveClass('text-text-primary');
    });
  });

  describe('Accessibility', () => {
    it('has role="option"', () => {
      render(<DropmenuItem label="Option" />);
      expect(screen.getByRole('option')).toBeInTheDocument();
    });

    it('label text is accessible to screen readers', () => {
      render(<DropmenuItem label="Select this option" />);
      expect(screen.getByText('Select this option')).toBeVisible();
    });

    it('disabled option has aria-disabled', () => {
      render(<DropmenuItem label="Option" disabled />);
      const option = screen.getByRole('option');
      expect(option).toHaveAttribute('aria-disabled', 'true');
    });

    it('selected option has aria-selected', () => {
      render(<DropmenuItem label="Option" selected />);
      const option = screen.getByRole('option');
      expect(option).toHaveAttribute('aria-selected', 'true');
    });

    it('checkbox option has aria-checked', () => {
      render(<DropmenuItem label="Option" showCheckbox selected />);
      const option = screen.getByRole('option');
      expect(option).toHaveAttribute('aria-checked', 'true');
    });

    it('icon is aria-hidden', () => {
      render(<DropmenuItem label="Option" showLeftAddOn leftIcon={House} />);
      const icon = screen.getByRole('option').querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Edge cases', () => {
    it('handles very long label text', () => {
      const longLabel = 'A'.repeat(200);
      render(<DropmenuItem label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles very long caption text', () => {
      const longCaption = 'B'.repeat(200);
      render(<DropmenuItem label="Option" caption={longCaption} />);
      expect(screen.getByText(longCaption)).toBeInTheDocument();
    });

    it('handles special characters in label', () => {
      const specialLabel = '<script>alert("xss")</script> & "quotes"';
      render(<DropmenuItem label={specialLabel} />);
      expect(screen.getByText(specialLabel)).toBeInTheDocument();
    });

    it('handles special characters in caption', () => {
      const specialCaption = '<div>HTML & entities "test"</div>';
      render(<DropmenuItem label="Option" caption={specialCaption} />);
      expect(screen.getByText(specialCaption)).toBeInTheDocument();
    });

    it('handles unicode characters in label', () => {
      const unicodeLabel = '设置 • 옵션 • パラメータ';
      render(<DropmenuItem label={unicodeLabel} />);
      expect(screen.getByText(unicodeLabel)).toBeInTheDocument();
    });

    it('handles unicode characters in caption', () => {
      const unicodeCaption = '说明文字 • 설명 • 説明';
      render(<DropmenuItem label="Option" caption={unicodeCaption} />);
      expect(screen.getByText(unicodeCaption)).toBeInTheDocument();
    });

    it('handles empty right text', () => {
      render(<DropmenuItem label="Option" showRightAddOn rightText="" />);
      const container = screen.getByRole('option');
      expect(container).toBeInTheDocument();
    });

    it('handles special characters in right text', () => {
      render(<DropmenuItem label="Option" showRightAddOn rightText="⌘⇧P" />);
      expect(screen.getByText('⌘⇧P')).toBeInTheDocument();
    });

    it('renders with minimal props (only label)', () => {
      render(<DropmenuItem label="Minimal" />);
      const container = screen.getByRole('option');
      expect(container).toBeInTheDocument();
      // Should have default LG size classes
      expect(container).toHaveClass('px-4', 'py-3', 'text-base');
    });

    it('handles all props enabled simultaneously', () => {
      render(
        <DropmenuItem
          label="Full option"
          caption="With all features"
          size="lg"
          visualState="hovered"
          selected
          showCheckbox
          showLeftAddOn
          leftIcon={Star}
          showRightAddOn
          rightText="99+"
        />
      );
      const container = screen.getByRole('option');
      expect(container).toBeInTheDocument();
      expect(screen.getByText('Full option')).toBeInTheDocument();
      expect(screen.getByText('With all features')).toBeInTheDocument();
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('renders empty caption as no caption', () => {
      render(<DropmenuItem label="Option" caption="" />);
      const container = screen.getByRole('option');
      // Empty string caption should not render caption element
      expect(container.textContent).toBe('Option');
    });
  });
});
