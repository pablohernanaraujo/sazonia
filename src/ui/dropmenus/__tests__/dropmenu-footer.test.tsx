import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DropmenuFooter } from '../dropmenu-footer';

describe('DropmenuFooter', () => {
  describe('Rendering', () => {
    it('renders with children content', () => {
      render(<DropmenuFooter>Footer</DropmenuFooter>);
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('renders as div element', () => {
      render(<DropmenuFooter>Footer</DropmenuFooter>);
      const container = screen.getByText('Footer').closest('div');
      expect(container).toBeInTheDocument();
      expect(container?.tagName).toBe('DIV');
    });

    it('renders content inside a span element via Text component', () => {
      render(<DropmenuFooter>Footer</DropmenuFooter>);
      const span = screen.getByText('Footer');
      expect(span.tagName).toBe('SPAN');
    });

    it('renders React node children correctly', () => {
      render(
        <DropmenuFooter>
          <strong>Bold</strong> footer
        </DropmenuFooter>
      );
      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText(/footer/)).toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('applies MD size by default', () => {
      render(<DropmenuFooter>Footer</DropmenuFooter>);
      const container = screen.getByText('Footer').closest('div');
      expect(container).toHaveClass('pl-4', 'pr-2');
    });

    it('applies SM size variant', () => {
      render(<DropmenuFooter size="sm">Footer</DropmenuFooter>);
      const container = screen.getByText('Footer').closest('div');
      expect(container).toHaveClass('px-3');
    });

    it('applies MD size variant explicitly', () => {
      render(<DropmenuFooter size="md">Footer</DropmenuFooter>);
      const container = screen.getByText('Footer').closest('div');
      expect(container).toHaveClass('pl-4', 'pr-2');
    });

    it('renders TextXs component when size is sm', () => {
      render(<DropmenuFooter size="sm">Footer</DropmenuFooter>);
      const textElement = screen.getByText('Footer');
      expect(textElement).toHaveClass('text-xs', 'leading-[18px]');
    });

    it('renders TextSm component when size is md', () => {
      render(<DropmenuFooter size="md">Footer</DropmenuFooter>);
      const textElement = screen.getByText('Footer');
      expect(textElement).toHaveClass('text-sm', 'leading-5');
    });
  });

  describe('Base styles', () => {
    it('applies background-secondary background', () => {
      render(<DropmenuFooter>Footer</DropmenuFooter>);
      const container = screen.getByText('Footer').closest('div');
      expect(container).toHaveClass('bg-background-secondary');
    });

    it('applies fixed 200px width', () => {
      render(<DropmenuFooter>Footer</DropmenuFooter>);
      const container = screen.getByText('Footer').closest('div');
      expect(container).toHaveClass('w-[200px]');
    });

    it('applies vertical padding py-2', () => {
      render(<DropmenuFooter>Footer</DropmenuFooter>);
      const container = screen.getByText('Footer').closest('div');
      expect(container).toHaveClass('py-2');
    });

    it('applies text-text-secondary color via muted color prop', () => {
      render(<DropmenuFooter>Footer</DropmenuFooter>);
      const textElement = screen.getByText('Footer');
      expect(textElement).toHaveClass('text-text-secondary');
    });

    it('applies font-normal weight via Text component', () => {
      render(<DropmenuFooter>Footer</DropmenuFooter>);
      const textElement = screen.getByText('Footer');
      expect(textElement).toHaveClass('font-normal');
    });
  });

  describe('Composition', () => {
    it('merges custom className correctly', () => {
      render(
        <DropmenuFooter className="custom-class mt-4">Footer</DropmenuFooter>
      );
      const container = screen.getByText('Footer').closest('div');
      expect(container).toHaveClass('custom-class', 'mt-4');
    });

    it('allows className to override base styles', () => {
      render(<DropmenuFooter className="w-[300px]">Footer</DropmenuFooter>);
      const container = screen.getByText('Footer').closest('div');
      expect(container).toHaveClass('w-[300px]');
    });

    it('forwards ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(<DropmenuFooter ref={ref}>Footer</DropmenuFooter>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('ref points to the root div element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<DropmenuFooter ref={ref}>Footer</DropmenuFooter>);
      const container = screen.getByText('Footer').closest('div');
      expect(ref.current).toBe(container);
    });
  });

  describe('Props passthrough', () => {
    it('passes id prop through', () => {
      render(<DropmenuFooter id="footer-id">Footer</DropmenuFooter>);
      const container = screen.getByText('Footer').closest('div');
      expect(container).toHaveAttribute('id', 'footer-id');
    });

    it('passes data-testid prop through', () => {
      render(<DropmenuFooter data-testid="footer-test">Footer</DropmenuFooter>);
      expect(screen.getByTestId('footer-test')).toBeInTheDocument();
    });

    it('passes aria-label prop through', () => {
      render(<DropmenuFooter aria-label="Footer section">Footer</DropmenuFooter>);
      const container = screen.getByText('Footer').closest('div');
      expect(container).toHaveAttribute('aria-label', 'Footer section');
    });

    it('passes role prop through', () => {
      render(<DropmenuFooter role="contentinfo">Footer</DropmenuFooter>);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles very long text content', () => {
      const longText = 'A'.repeat(200);
      render(<DropmenuFooter>{longText}</DropmenuFooter>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles special characters in content', () => {
      const specialContent = '<script>alert("xss")</script> & "quotes"';
      render(<DropmenuFooter>{specialContent}</DropmenuFooter>);
      expect(screen.getByText(specialContent)).toBeInTheDocument();
    });

    it('handles unicode characters in content', () => {
      const unicodeContent = 'Footer: 设置 • 옵션 • パラメータ';
      render(<DropmenuFooter>{unicodeContent}</DropmenuFooter>);
      expect(screen.getByText(unicodeContent)).toBeInTheDocument();
    });

    it('handles only whitespace content', () => {
      render(<DropmenuFooter> </DropmenuFooter>);
      const container = document.querySelector('div');
      expect(container).toBeInTheDocument();
    });

    it('handles complex React node children', () => {
      render(
        <DropmenuFooter>
          <a href="/help">Help</a> | <a href="/privacy">Privacy</a>
        </DropmenuFooter>
      );
      expect(screen.getByText('Help')).toBeInTheDocument();
      expect(screen.getByText('Privacy')).toBeInTheDocument();
    });

    it('handles emoji content', () => {
      render(<DropmenuFooter>Footer text 🎉</DropmenuFooter>);
      expect(screen.getByText(/Footer text/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('content is accessible to screen readers', () => {
      render(<DropmenuFooter>Footer information</DropmenuFooter>);
      expect(screen.getByText('Footer information')).toBeVisible();
    });

    it('has semantic structure with div and span elements', () => {
      render(<DropmenuFooter>Footer</DropmenuFooter>);
      const container = screen.getByText('Footer').closest('div');
      const span = container?.querySelector('span');
      expect(span).toBeInTheDocument();
      expect(span?.textContent).toBe('Footer');
    });

    it('supports custom aria attributes', () => {
      render(
        <DropmenuFooter aria-describedby="desc" aria-live="polite">
          Footer
        </DropmenuFooter>
      );
      const container = screen.getByText('Footer').closest('div');
      expect(container).toHaveAttribute('aria-describedby', 'desc');
      expect(container).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Text component integration', () => {
    it('uses TextXs for sm size with correct props', () => {
      render(<DropmenuFooter size="sm">Footer</DropmenuFooter>);
      const textElement = screen.getByText('Footer');
      // TextXs applies text-xs and leading-[18px]
      expect(textElement).toHaveClass('text-xs', 'leading-[18px]');
      // Color muted applies text-text-secondary
      expect(textElement).toHaveClass('text-text-secondary');
      // Weight regular applies font-normal
      expect(textElement).toHaveClass('font-normal');
    });

    it('uses TextSm for md size with correct props', () => {
      render(<DropmenuFooter size="md">Footer</DropmenuFooter>);
      const textElement = screen.getByText('Footer');
      // TextSm applies text-sm and leading-5
      expect(textElement).toHaveClass('text-sm', 'leading-5');
      // Color muted applies text-text-secondary
      expect(textElement).toHaveClass('text-text-secondary');
      // Weight regular applies font-normal
      expect(textElement).toHaveClass('font-normal');
    });
  });
});
