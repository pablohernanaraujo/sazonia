import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DropmenuHeader } from '../dropmenu-header';

describe('DropmenuHeader', () => {
  describe('Rendering', () => {
    it('renders with required label prop', () => {
      render(<DropmenuHeader label="Header" />);
      expect(screen.getByText('Header')).toBeInTheDocument();
    });

    it('renders as div element', () => {
      render(<DropmenuHeader label="Header" />);
      const container = screen.getByText('Header').closest('div');
      expect(container).toBeInTheDocument();
      expect(container?.tagName).toBe('DIV');
    });

    it('renders label text inside a p element', () => {
      render(<DropmenuHeader label="Header" />);
      const paragraph = screen.getByText('Header');
      expect(paragraph.tagName).toBe('P');
    });

    it('renders empty label when label is empty string', () => {
      render(<DropmenuHeader label="" />);
      const container = document.querySelector('div');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('applies MD size by default', () => {
      render(<DropmenuHeader label="Header" />);
      const container = screen.getByText('Header').closest('div');
      expect(container).toHaveClass('px-4', 'pt-4', 'text-sm', 'leading-5');
    });

    it('applies SM size variant', () => {
      render(<DropmenuHeader label="Header" size="sm" />);
      const container = screen.getByText('Header').closest('div');
      expect(container).toHaveClass('px-3', 'pt-3', 'text-xs');
    });

    it('applies MD size variant explicitly', () => {
      render(<DropmenuHeader label="Header" size="md" />);
      const container = screen.getByText('Header').closest('div');
      expect(container).toHaveClass('px-4', 'pt-4', 'text-sm', 'leading-5');
    });

    it('applies correct typography for SM size', () => {
      render(<DropmenuHeader label="Header" size="sm" />);
      const container = screen.getByText('Header').closest('div');
      expect(container).toHaveClass('text-xs', 'leading-[18px]');
    });

    it('applies correct typography for MD size', () => {
      render(<DropmenuHeader label="Header" size="md" />);
      const container = screen.getByText('Header').closest('div');
      expect(container).toHaveClass('text-sm', 'leading-5');
    });

    it('applies zero bottom padding for both sizes', () => {
      render(<DropmenuHeader label="Header" />);
      const container = screen.getByText('Header').closest('div');
      expect(container).toHaveClass('pb-0');
    });
  });

  describe('Base styles', () => {
    it('applies font-medium weight', () => {
      render(<DropmenuHeader label="Header" />);
      const container = screen.getByText('Header').closest('div');
      expect(container).toHaveClass('font-medium');
    });

    it('applies secondary text color', () => {
      render(<DropmenuHeader label="Header" />);
      const container = screen.getByText('Header').closest('div');
      expect(container).toHaveClass('text-text-secondary');
    });

    it('applies font-sans', () => {
      render(<DropmenuHeader label="Header" />);
      const container = screen.getByText('Header').closest('div');
      expect(container).toHaveClass('font-sans');
    });

    it('applies full width', () => {
      render(<DropmenuHeader label="Header" />);
      const container = screen.getByText('Header').closest('div');
      expect(container).toHaveClass('w-full');
    });
  });

  describe('Composition', () => {
    it('merges custom className correctly', () => {
      render(<DropmenuHeader label="Header" className="custom-class mt-4" />);
      const container = screen.getByText('Header').closest('div');
      expect(container).toHaveClass('custom-class', 'mt-4');
    });

    it('allows className to override base styles', () => {
      render(<DropmenuHeader label="Header" className="px-8" />);
      const container = screen.getByText('Header').closest('div');
      expect(container).toHaveClass('px-8');
    });

    it('forwards ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(<DropmenuHeader label="Header" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('ref points to the root div element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<DropmenuHeader label="Header" ref={ref} />);
      const container = screen.getByText('Header').closest('div');
      expect(ref.current).toBe(container);
    });
  });

  describe('Edge cases', () => {
    it('handles very long label text', () => {
      const longLabel = 'A'.repeat(200);
      render(<DropmenuHeader label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles special characters in label', () => {
      const specialLabel = '<script>alert("xss")</script> & "quotes"';
      render(<DropmenuHeader label={specialLabel} />);
      expect(screen.getByText(specialLabel)).toBeInTheDocument();
    });

    it('handles unicode characters in label', () => {
      const unicodeLabel = '设置 • 옵션 • パラメータ';
      render(<DropmenuHeader label={unicodeLabel} />);
      expect(screen.getByText(unicodeLabel)).toBeInTheDocument();
    });

    it('handles label with only whitespace', () => {
      render(<DropmenuHeader label="   " />);
      const paragraph = document.querySelector('p');
      expect(paragraph?.textContent).toBe('   ');
    });

    it('renders with minimal props (only label)', () => {
      render(<DropmenuHeader label="Minimal" />);
      const container = screen.getByText('Minimal').closest('div');
      expect(container).toBeInTheDocument();
      // Should have default MD size classes
      expect(container).toHaveClass('px-4', 'pt-4', 'text-sm');
    });
  });

  describe('Accessibility', () => {
    it('label text is accessible to screen readers', () => {
      render(<DropmenuHeader label="Section Header" />);
      // Text content is visible and accessible
      expect(screen.getByText('Section Header')).toBeVisible();
    });

    it('has semantic structure with div and p elements', () => {
      render(<DropmenuHeader label="Header" />);
      const container = screen.getByText('Header').closest('div');
      const paragraph = container?.querySelector('p');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph?.textContent).toBe('Header');
    });
  });
});
