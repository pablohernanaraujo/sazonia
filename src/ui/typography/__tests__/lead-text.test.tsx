import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LeadTextMd, LeadTextSm, LeadTextXs } from '../lead-text';

describe('LeadTextXs', () => {
  it('renders with default props', () => {
    render(<LeadTextXs>Test content</LeadTextXs>);
    const element = screen.getByText('Test content');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('P');
  });

  it('applies correct size classes (18px/26px)', () => {
    render(<LeadTextXs>Test</LeadTextXs>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-lg', 'leading-[26px]');
  });

  it('applies regular weight by default', () => {
    render(<LeadTextXs>Test</LeadTextXs>);
    expect(screen.getByText('Test')).toHaveClass('font-normal');
  });

  it('applies weight variants', () => {
    const { rerender } = render(<LeadTextXs weight="medium">Test</LeadTextXs>);
    expect(screen.getByText('Test')).toHaveClass('font-medium');

    rerender(<LeadTextXs weight="semibold">Test</LeadTextXs>);
    expect(screen.getByText('Test')).toHaveClass('font-semibold');

    rerender(<LeadTextXs weight="bold">Test</LeadTextXs>);
    expect(screen.getByText('Test')).toHaveClass('font-bold');
  });

  it('applies color variants', () => {
    const { rerender } = render(<LeadTextXs color="muted">Test</LeadTextXs>);
    expect(screen.getByText('Test')).toHaveClass('text-text-secondary');

    rerender(<LeadTextXs color="primary">Test</LeadTextXs>);
    expect(screen.getByText('Test')).toHaveClass('text-primary');
  });

  it('renders as different element with as prop', () => {
    render(<LeadTextXs as="div">Test</LeadTextXs>);
    expect(screen.getByText('Test').tagName).toBe('DIV');
  });

  it('renders child element with asChild prop', () => {
    render(
      <LeadTextXs asChild>
        <a href="/test">Test link</a>
      </LeadTextXs>
    );
    const element = screen.getByText('Test link');
    expect(element.tagName).toBe('A');
    expect(element).toHaveClass('text-lg');
  });

  it('merges custom className', () => {
    render(<LeadTextXs className="custom-class">Test</LeadTextXs>);
    expect(screen.getByText('Test')).toHaveClass('custom-class', 'text-lg');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<LeadTextXs ref={ref}>Test</LeadTextXs>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });
});

describe('LeadTextSm', () => {
  it('renders with default props', () => {
    render(<LeadTextSm>Test content</LeadTextSm>);
    const element = screen.getByText('Test content');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('P');
  });

  it('applies correct size classes (20px/28px)', () => {
    render(<LeadTextSm>Test</LeadTextSm>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-xl', 'leading-7');
  });

  it('applies weight variants', () => {
    const { rerender } = render(<LeadTextSm weight="medium">Test</LeadTextSm>);
    expect(screen.getByText('Test')).toHaveClass('font-medium');

    rerender(<LeadTextSm weight="bold">Test</LeadTextSm>);
    expect(screen.getByText('Test')).toHaveClass('font-bold');
  });

  it('applies color variants', () => {
    render(<LeadTextSm color="warning">Test</LeadTextSm>);
    expect(screen.getByText('Test')).toHaveClass('text-warning');
  });

  it('renders as different element with as prop', () => {
    render(<LeadTextSm as="span">Test</LeadTextSm>);
    expect(screen.getByText('Test').tagName).toBe('SPAN');
  });
});

describe('LeadTextMd', () => {
  it('renders with default props', () => {
    render(<LeadTextMd>Test content</LeadTextMd>);
    const element = screen.getByText('Test content');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('P');
  });

  it('applies correct size classes (24px/32px)', () => {
    render(<LeadTextMd>Test</LeadTextMd>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-2xl', 'leading-8');
  });

  it('applies all weight variants', () => {
    const weights = [
      { weight: 'regular' as const, expected: 'font-normal' },
      { weight: 'medium' as const, expected: 'font-medium' },
      { weight: 'semibold' as const, expected: 'font-semibold' },
      { weight: 'bold' as const, expected: 'font-bold' },
    ];

    const { rerender } = render(<LeadTextMd weight="regular">Test</LeadTextMd>);

    for (const { weight, expected } of weights) {
      rerender(<LeadTextMd weight={weight}>Test</LeadTextMd>);
      expect(screen.getByText('Test')).toHaveClass(expected);
    }
  });

  it('applies all color variants', () => {
    const colors = [
      { color: 'default' as const, expected: 'text-text-primary' },
      { color: 'muted' as const, expected: 'text-text-secondary' },
      { color: 'primary' as const, expected: 'text-primary' },
      { color: 'secondary' as const, expected: 'text-secondary' },
      { color: 'destructive' as const, expected: 'text-destructive' },
      { color: 'success' as const, expected: 'text-success' },
      { color: 'warning' as const, expected: 'text-warning' },
      { color: 'info' as const, expected: 'text-info' },
    ];

    const { rerender } = render(<LeadTextMd color="default">Test</LeadTextMd>);

    for (const { color, expected } of colors) {
      rerender(<LeadTextMd color={color}>Test</LeadTextMd>);
      expect(screen.getByText('Test')).toHaveClass(expected);
    }
  });

  it('renders child element with asChild prop', () => {
    render(
      <LeadTextMd asChild>
        <blockquote>Quote text</blockquote>
      </LeadTextMd>
    );
    const element = screen.getByText('Quote text');
    expect(element.tagName).toBe('BLOCKQUOTE');
    expect(element).toHaveClass('text-2xl');
  });

  it('handles empty children', () => {
    render(<LeadTextMd data-testid="empty"></LeadTextMd>);
    expect(screen.getByTestId('empty')).toBeInTheDocument();
  });
});
