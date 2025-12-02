import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TextMd, TextSm, TextXs } from '../text';

describe('TextXs', () => {
  it('renders with default props', () => {
    render(<TextXs>Test content</TextXs>);
    const element = screen.getByText('Test content');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('P');
  });

  it('applies correct size classes (12px/18px)', () => {
    render(<TextXs>Test</TextXs>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-xs', 'leading-[18px]');
  });

  it('applies regular weight by default', () => {
    render(<TextXs>Test</TextXs>);
    expect(screen.getByText('Test')).toHaveClass('font-normal');
  });

  it('applies weight variants', () => {
    const { rerender } = render(<TextXs weight="medium">Test</TextXs>);
    expect(screen.getByText('Test')).toHaveClass('font-medium');

    rerender(<TextXs weight="semibold">Test</TextXs>);
    expect(screen.getByText('Test')).toHaveClass('font-semibold');

    rerender(<TextXs weight="bold">Test</TextXs>);
    expect(screen.getByText('Test')).toHaveClass('font-bold');
  });

  it('applies color variants', () => {
    const { rerender } = render(<TextXs color="muted">Test</TextXs>);
    expect(screen.getByText('Test')).toHaveClass('text-text-secondary');

    rerender(<TextXs color="primary">Test</TextXs>);
    expect(screen.getByText('Test')).toHaveClass('text-primary');

    rerender(<TextXs color="destructive">Test</TextXs>);
    expect(screen.getByText('Test')).toHaveClass('text-destructive');
  });

  it('renders as different element with as prop', () => {
    render(<TextXs as="span">Test</TextXs>);
    expect(screen.getByText('Test').tagName).toBe('SPAN');
  });

  it('renders child element with asChild prop', () => {
    render(
      <TextXs asChild>
        <a href="/test">Test link</a>
      </TextXs>
    );
    const element = screen.getByText('Test link');
    expect(element.tagName).toBe('A');
    expect(element).toHaveAttribute('href', '/test');
    expect(element).toHaveClass('text-xs');
  });

  it('merges custom className', () => {
    render(<TextXs className="custom-class mt-4">Test</TextXs>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('custom-class', 'mt-4', 'text-xs');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<TextXs ref={ref}>Test</TextXs>);
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });
});

describe('TextSm', () => {
  it('renders with default props', () => {
    render(<TextSm>Test content</TextSm>);
    const element = screen.getByText('Test content');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('P');
  });

  it('applies correct size classes (14px/20px)', () => {
    render(<TextSm>Test</TextSm>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-sm', 'leading-5');
  });

  it('applies weight variants', () => {
    const { rerender } = render(<TextSm weight="medium">Test</TextSm>);
    expect(screen.getByText('Test')).toHaveClass('font-medium');

    rerender(<TextSm weight="bold">Test</TextSm>);
    expect(screen.getByText('Test')).toHaveClass('font-bold');
  });

  it('applies color variants', () => {
    render(<TextSm color="success">Test</TextSm>);
    expect(screen.getByText('Test')).toHaveClass('text-success');
  });

  it('renders as different element with as prop', () => {
    render(<TextSm as="label">Test</TextSm>);
    expect(screen.getByText('Test').tagName).toBe('LABEL');
  });

  it('renders child element with asChild prop', () => {
    render(
      <TextSm asChild>
        <button type="button">Test button</button>
      </TextSm>
    );
    const element = screen.getByText('Test button');
    expect(element.tagName).toBe('BUTTON');
    expect(element).toHaveClass('text-sm');
  });
});

describe('TextMd', () => {
  it('renders with default props', () => {
    render(<TextMd>Test content</TextMd>);
    const element = screen.getByText('Test content');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('P');
  });

  it('applies correct size classes (16px/24px)', () => {
    render(<TextMd>Test</TextMd>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-base', 'leading-6');
  });

  it('applies weight variants', () => {
    const { rerender } = render(<TextMd weight="regular">Test</TextMd>);
    expect(screen.getByText('Test')).toHaveClass('font-normal');

    rerender(<TextMd weight="semibold">Test</TextMd>);
    expect(screen.getByText('Test')).toHaveClass('font-semibold');
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

    const { rerender } = render(<TextMd color="default">Test</TextMd>);

    for (const { color, expected } of colors) {
      rerender(<TextMd color={color}>Test</TextMd>);
      expect(screen.getByText('Test')).toHaveClass(expected);
    }
  });

  it('handles empty children', () => {
    render(<TextMd data-testid="empty"></TextMd>);
    expect(screen.getByTestId('empty')).toBeInTheDocument();
  });

  it('handles long text content', () => {
    const longText = 'A'.repeat(1000);
    render(<TextMd>{longText}</TextMd>);
    expect(screen.getByText(longText)).toBeInTheDocument();
  });
});
