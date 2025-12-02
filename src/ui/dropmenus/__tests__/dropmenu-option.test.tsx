import { createRef } from 'react';
import { House } from '@phosphor-icons/react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DropmenuOption } from '../dropmenu-option';

describe('DropmenuOption', () => {
  describe('Rendering', () => {
    it('renders with required label prop', () => {
      render(<DropmenuOption label="Edit" />);
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    it('renders as div element', () => {
      render(<DropmenuOption label="Edit" />);
      const container = screen.getByRole('menuitem');
      expect(container).toBeInTheDocument();
      expect(container.tagName).toBe('DIV');
    });

    it('renders label text correctly', () => {
      render(<DropmenuOption label="Delete" />);
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('renders with all size variants', () => {
      const { rerender } = render(<DropmenuOption label="Option" size="sm" />);
      expect(screen.getByRole('menuitem')).toBeInTheDocument();

      rerender(<DropmenuOption label="Option" size="md" />);
      expect(screen.getByRole('menuitem')).toBeInTheDocument();

      rerender(<DropmenuOption label="Option" size="lg" />);
      expect(screen.getByRole('menuitem')).toBeInTheDocument();
    });

    it('has role="menuitem"', () => {
      render(<DropmenuOption label="Edit" />);
      expect(screen.getByRole('menuitem')).toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('applies LG size by default', () => {
      render(<DropmenuOption label="Option" />);
      const container = screen.getByRole('menuitem');
      expect(container).toHaveClass(
        'px-4',
        'py-3',
        'gap-3',
        'text-base',
        'leading-6'
      );
    });

    it('applies SM size variant', () => {
      render(<DropmenuOption label="Option" size="sm" />);
      const container = screen.getByRole('menuitem');
      expect(container).toHaveClass(
        'px-3',
        'py-1.5',
        'gap-2.5',
        'text-sm',
        'leading-5'
      );
    });

    it('applies MD size variant', () => {
      render(<DropmenuOption label="Option" size="md" />);
      const container = screen.getByRole('menuitem');
      expect(container).toHaveClass(
        'px-3',
        'py-2.5',
        'gap-3',
        'text-sm',
        'leading-5'
      );
    });

    it('applies LG size variant explicitly', () => {
      render(<DropmenuOption label="Option" size="lg" />);
      const container = screen.getByRole('menuitem');
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
      render(<DropmenuOption label="Option" visualState="default" />);
      const container = screen.getByRole('menuitem');
      expect(container).not.toHaveClass('bg-background-secondary');
      expect(container).not.toHaveClass('bg-background-tertiary');
    });

    it('applies hovered state', () => {
      render(<DropmenuOption label="Option" visualState="hovered" />);
      const container = screen.getByRole('menuitem');
      expect(container).toHaveClass('bg-background-secondary');
    });

    it('applies pressed state', () => {
      render(<DropmenuOption label="Option" visualState="pressed" />);
      const container = screen.getByRole('menuitem');
      expect(container).toHaveClass('bg-background-tertiary');
    });

    it('applies focus state', () => {
      render(<DropmenuOption label="Option" visualState="focus" />);
      const container = screen.getByRole('menuitem');
      expect(container).toHaveClass(
        'ring-2',
        'ring-border-brand',
        'ring-offset-2'
      );
    });
  });

  describe('Disabled state', () => {
    it('applies disabled styling', () => {
      render(<DropmenuOption label="Option" disabled />);
      const container = screen.getByRole('menuitem');
      expect(container).toHaveClass('pointer-events-none', 'text-text-tertiary');
    });

    it('sets aria-disabled when disabled', () => {
      render(<DropmenuOption label="Option" disabled />);
      const container = screen.getByRole('menuitem');
      expect(container).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not set aria-disabled when not disabled', () => {
      render(<DropmenuOption label="Option" />);
      const container = screen.getByRole('menuitem');
      expect(container).not.toHaveAttribute('aria-disabled');
    });

    it('applies muted text color to label when disabled', () => {
      render(<DropmenuOption label="Option" disabled />);
      const label = screen.getByText('Option');
      expect(label).toHaveClass('text-text-tertiary');
    });
  });

  describe('Left add-on', () => {
    it('does not render left add-on by default', () => {
      render(<DropmenuOption label="Option" leftIcon={House} />);
      const container = screen.getByRole('menuitem');
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });

    it('renders left add-on when showLeftAddOn is true', () => {
      render(<DropmenuOption label="Option" showLeftAddOn leftIcon={House} />);
      const container = screen.getByRole('menuitem');
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('does not render left icon when showLeftAddOn is false', () => {
      render(
        <DropmenuOption label="Option" showLeftAddOn={false} leftIcon={House} />
      );
      const container = screen.getByRole('menuitem');
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });

    it('renders custom left add-on instead of icon', () => {
      render(
        <DropmenuOption
          label="Option"
          showLeftAddOn
          leftIcon={House}
          leftAddOn={<span data-testid="custom-left">Custom</span>}
        />
      );
      expect(screen.getByTestId('custom-left')).toBeInTheDocument();
      // Icon should not be rendered when custom add-on is provided
      const container = screen.getByRole('menuitem');
      expect(container.querySelectorAll('svg')).toHaveLength(0);
    });

    it('applies muted styling to icon when disabled', () => {
      render(
        <DropmenuOption label="Option" showLeftAddOn leftIcon={House} disabled />
      );
      const icon = screen.getByRole('menuitem').querySelector('svg');
      expect(icon).toHaveClass('text-text-tertiary');
    });
  });

  describe('Right add-on', () => {
    it('does not render right add-on by default', () => {
      render(<DropmenuOption label="Option" rightText="⌘C" />);
      expect(screen.queryByText('⌘C')).not.toBeInTheDocument();
    });

    it('renders right add-on when showRightAddOn is true', () => {
      render(<DropmenuOption label="Option" showRightAddOn rightText="⌘C" />);
      expect(screen.getByText('⌘C')).toBeInTheDocument();
    });

    it('does not render right text when showRightAddOn is false', () => {
      render(
        <DropmenuOption label="Option" showRightAddOn={false} rightText="⌘C" />
      );
      expect(screen.queryByText('⌘C')).not.toBeInTheDocument();
    });

    it('renders custom right add-on instead of text', () => {
      render(
        <DropmenuOption
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
      render(<DropmenuOption label="Option" showRightAddOn rightText="⌘C" />);
      const rightText = screen.getByText('⌘C');
      expect(rightText).toHaveClass('text-text-secondary');
    });
  });

  describe('Both add-ons', () => {
    it('renders both add-ons simultaneously', () => {
      render(
        <DropmenuOption
          label="Copy"
          showLeftAddOn
          leftIcon={House}
          showRightAddOn
          rightText="⌘C"
        />
      );
      const container = screen.getByRole('menuitem');
      expect(container.querySelector('svg')).toBeInTheDocument();
      expect(screen.getByText('⌘C')).toBeInTheDocument();
    });

    it('renders without any add-ons', () => {
      render(<DropmenuOption label="Option" />);
      const container = screen.getByRole('menuitem');
      expect(container.querySelector('svg')).not.toBeInTheDocument();
      expect(container.children).toHaveLength(1); // Only the label span
    });
  });

  describe('Composition', () => {
    it('merges custom className correctly', () => {
      render(<DropmenuOption label="Option" className="custom-class mt-4" />);
      const container = screen.getByRole('menuitem');
      expect(container).toHaveClass('custom-class', 'mt-4');
    });

    it('allows className to override base styles', () => {
      render(<DropmenuOption label="Option" className="px-8" />);
      const container = screen.getByRole('menuitem');
      expect(container).toHaveClass('px-8');
    });

    it('forwards ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(<DropmenuOption label="Option" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('ref points to the root div element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<DropmenuOption label="Option" ref={ref} />);
      const container = screen.getByRole('menuitem');
      expect(ref.current).toBe(container);
    });
  });

  describe('Base styles', () => {
    it('applies flex layout', () => {
      render(<DropmenuOption label="Option" />);
      const container = screen.getByRole('menuitem');
      expect(container).toHaveClass('flex', 'items-center');
    });

    it('applies full width', () => {
      render(<DropmenuOption label="Option" />);
      const container = screen.getByRole('menuitem');
      expect(container).toHaveClass('w-full');
    });

    it('applies cursor-pointer', () => {
      render(<DropmenuOption label="Option" />);
      const container = screen.getByRole('menuitem');
      expect(container).toHaveClass('cursor-pointer');
    });

    it('applies transition', () => {
      render(<DropmenuOption label="Option" />);
      const container = screen.getByRole('menuitem');
      expect(container).toHaveClass('transition-colors', 'duration-150');
    });

    it('applies rounded corners', () => {
      render(<DropmenuOption label="Option" />);
      const container = screen.getByRole('menuitem');
      expect(container).toHaveClass('rounded-sm');
    });
  });

  describe('Label styles', () => {
    it('label has truncate class for overflow', () => {
      render(
        <DropmenuOption label="Very long label text that should truncate" />
      );
      const label = screen.getByText('Very long label text that should truncate');
      expect(label).toHaveClass('truncate');
    });

    it('label has flex-1 for flexible width', () => {
      render(<DropmenuOption label="Option" />);
      const label = screen.getByText('Option');
      expect(label).toHaveClass('flex-1');
    });

    it('label has primary text color by default', () => {
      render(<DropmenuOption label="Option" />);
      const label = screen.getByText('Option');
      expect(label).toHaveClass('text-text-primary');
    });
  });

  describe('Accessibility', () => {
    it('has role menuitem', () => {
      render(<DropmenuOption label="Edit" />);
      expect(screen.getByRole('menuitem')).toBeInTheDocument();
    });

    it('label text is accessible to screen readers', () => {
      render(<DropmenuOption label="Edit file" />);
      expect(screen.getByText('Edit file')).toBeVisible();
    });

    it('disabled option has aria-disabled', () => {
      render(<DropmenuOption label="Edit" disabled />);
      const option = screen.getByRole('menuitem');
      expect(option).toHaveAttribute('aria-disabled', 'true');
    });

    it('icon is aria-hidden', () => {
      render(<DropmenuOption label="Edit" showLeftAddOn leftIcon={House} />);
      const icon = screen.getByRole('menuitem').querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Edge cases', () => {
    it('handles very long label text', () => {
      const longLabel = 'A'.repeat(200);
      render(<DropmenuOption label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles special characters in label', () => {
      const specialLabel = '<script>alert("xss")</script> & "quotes"';
      render(<DropmenuOption label={specialLabel} />);
      expect(screen.getByText(specialLabel)).toBeInTheDocument();
    });

    it('handles unicode characters in label', () => {
      const unicodeLabel = '设置 • 옵션 • パラメータ';
      render(<DropmenuOption label={unicodeLabel} />);
      expect(screen.getByText(unicodeLabel)).toBeInTheDocument();
    });

    it('handles empty right text', () => {
      render(<DropmenuOption label="Option" showRightAddOn rightText="" />);
      const container = screen.getByRole('menuitem');
      expect(container).toBeInTheDocument();
    });

    it('handles special characters in right text', () => {
      render(<DropmenuOption label="Option" showRightAddOn rightText="⌘⇧P" />);
      expect(screen.getByText('⌘⇧P')).toBeInTheDocument();
    });

    it('renders with minimal props (only label)', () => {
      render(<DropmenuOption label="Minimal" />);
      const container = screen.getByRole('menuitem');
      expect(container).toBeInTheDocument();
      // Should have default LG size classes
      expect(container).toHaveClass('px-4', 'py-3', 'text-base');
    });
  });
});
