import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Hint } from '../hint';

describe('Hint', () => {
  describe('Default rendering', () => {
    it('renders with default props', () => {
      render(<Hint>Test hint</Hint>);
      const element = screen.getByText('Test hint');
      expect(element).toBeInTheDocument();
      expect(element.tagName).toBe('SPAN');
    });

    it('renders as span element (always)', () => {
      render(<Hint>Test</Hint>);
      expect(screen.getByText('Test').tagName).toBe('SPAN');
    });

    it('applies md size by default', () => {
      render(<Hint>Test</Hint>);
      const element = screen.getByText('Test');
      // TextSm uses text-sm and leading-5
      expect(element).toHaveClass('text-sm', 'leading-5');
    });
  });

  describe('Size variants', () => {
    it('uses TextXs styles when size="sm"', () => {
      render(<Hint size="sm">Test</Hint>);
      const element = screen.getByText('Test');
      expect(element).toHaveClass('text-xs', 'leading-[18px]');
    });

    it('uses TextSm styles when size="md"', () => {
      render(<Hint size="md">Test</Hint>);
      const element = screen.getByText('Test');
      expect(element).toHaveClass('text-sm', 'leading-5');
    });

    it('switches correctly between sizes on rerender', () => {
      const { rerender } = render(<Hint size="sm">Test</Hint>);
      expect(screen.getByText('Test')).toHaveClass('text-xs');

      rerender(<Hint size="md">Test</Hint>);
      expect(screen.getByText('Test')).toHaveClass('text-sm');
    });
  });

  describe('Styling', () => {
    it('applies muted color (text-text-secondary)', () => {
      render(<Hint>Test</Hint>);
      expect(screen.getByText('Test')).toHaveClass('text-text-secondary');
    });

    it('always applies pt-2 padding', () => {
      render(<Hint>Test</Hint>);
      expect(screen.getByText('Test')).toHaveClass('pt-2');
    });

    it('applies pt-2 for sm size', () => {
      render(<Hint size="sm">Test</Hint>);
      expect(screen.getByText('Test')).toHaveClass('pt-2');
    });

    it('applies pt-2 for md size', () => {
      render(<Hint size="md">Test</Hint>);
      expect(screen.getByText('Test')).toHaveClass('pt-2');
    });
  });

  describe('className merging', () => {
    it('merges custom className with base pt-2 class', () => {
      render(<Hint className="custom-class">Test</Hint>);
      const element = screen.getByText('Test');
      expect(element).toHaveClass('pt-2', 'custom-class');
    });

    it('merges multiple custom classes', () => {
      render(<Hint className="class-1 class-2 mt-4">Test</Hint>);
      const element = screen.getByText('Test');
      expect(element).toHaveClass('pt-2', 'class-1', 'class-2', 'mt-4');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = createRef<HTMLSpanElement>();
      render(<Hint ref={ref}>Test</Hint>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it('ref points to the span element', () => {
      const ref = createRef<HTMLSpanElement>();
      render(<Hint ref={ref}>Test</Hint>);
      expect(ref.current?.tagName).toBe('SPAN');
    });
  });

  describe('Props passthrough', () => {
    it('passes id prop through', () => {
      render(<Hint id="email-hint">Test</Hint>);
      expect(screen.getByText('Test')).toHaveAttribute('id', 'email-hint');
    });

    it('passes data-testid prop through', () => {
      render(<Hint data-testid="my-hint">Test</Hint>);
      expect(screen.getByTestId('my-hint')).toBeInTheDocument();
    });

    it('passes aria-live prop through', () => {
      render(<Hint aria-live="polite">Test</Hint>);
      expect(screen.getByText('Test')).toHaveAttribute('aria-live', 'polite');
    });

    it('passes role prop through', () => {
      render(<Hint role="alert">Test</Hint>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Content handling', () => {
    it('handles empty children gracefully', () => {
      render(<Hint data-testid="empty">{''}</Hint>);
      expect(screen.getByTestId('empty')).toBeInTheDocument();
    });

    it('handles long text content', () => {
      const longText = 'A'.repeat(500);
      render(<Hint>{longText}</Hint>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles special characters', () => {
      const specialText = '<>&"\'`special chars';
      render(<Hint>{specialText}</Hint>);
      expect(screen.getByText(specialText)).toBeInTheDocument();
    });

    it('handles React nodes as children', () => {
      render(
        <Hint>
          Text with <strong>bold</strong> content
        </Hint>
      );
      expect(screen.getByText('bold')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('can be associated with input via aria-describedby', () => {
      render(
        <>
          <input aria-describedby="hint-id" />
          <Hint id="hint-id">Helper text</Hint>
        </>
      );
      const input = screen.getByRole('textbox');
      const hint = screen.getByText('Helper text');
      expect(input).toHaveAttribute('aria-describedby', 'hint-id');
      expect(hint).toHaveAttribute('id', 'hint-id');
    });
  });
});
