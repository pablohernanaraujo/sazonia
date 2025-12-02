import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  DisplayLg,
  DisplayMd,
  DisplaySm,
  DisplayXl,
  DisplayXs,
  DisplayXxl,
} from '../display';

describe('DisplayXxl', () => {
  it('renders with default props', () => {
    render(<DisplayXxl>Display XXL</DisplayXxl>);
    const element = screen.getByText('Display XXL');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('SPAN');
  });

  it('applies correct size classes (80px/100px)', () => {
    render(<DisplayXxl>Test</DisplayXxl>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-[80px]', 'leading-[100px]');
  });

  it('applies regular weight by default', () => {
    render(<DisplayXxl>Test</DisplayXxl>);
    expect(screen.getByText('Test')).toHaveClass('font-normal');
  });

  it('applies color variants', () => {
    const { rerender } = render(<DisplayXxl color="muted">Test</DisplayXxl>);
    expect(screen.getByText('Test')).toHaveClass('text-text-secondary');

    rerender(<DisplayXxl color="primary">Test</DisplayXxl>);
    expect(screen.getByText('Test')).toHaveClass('text-primary');
  });

  it('renders as different element with as prop', () => {
    render(<DisplayXxl as="h1">Test</DisplayXxl>);
    expect(screen.getByText('Test').tagName).toBe('H1');
  });

  it('renders child element with asChild prop', () => {
    render(
      <DisplayXxl asChild>
        <h1>Hero Title</h1>
      </DisplayXxl>
    );
    const element = screen.getByText('Hero Title');
    expect(element.tagName).toBe('H1');
    expect(element).toHaveClass('text-[80px]');
  });

  it('merges custom className', () => {
    render(<DisplayXxl className="text-center">Test</DisplayXxl>);
    expect(screen.getByText('Test')).toHaveClass('text-center');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<DisplayXxl ref={ref}>Test</DisplayXxl>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});

describe('DisplayXl', () => {
  it('renders with default props', () => {
    render(<DisplayXl>Display XL</DisplayXl>);
    const element = screen.getByText('Display XL');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('SPAN');
  });

  it('applies correct size classes (72px/90px)', () => {
    render(<DisplayXl>Test</DisplayXl>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-[72px]', 'leading-[90px]');
  });

  it('applies regular weight by default', () => {
    render(<DisplayXl>Test</DisplayXl>);
    expect(screen.getByText('Test')).toHaveClass('font-normal');
  });
});

describe('DisplayLg', () => {
  it('renders with default props', () => {
    render(<DisplayLg>Display LG</DisplayLg>);
    const element = screen.getByText('Display LG');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('SPAN');
  });

  it('applies correct size classes (64px/80px)', () => {
    render(<DisplayLg>Test</DisplayLg>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-[64px]', 'leading-[80px]');
  });

  it('applies regular weight by default', () => {
    render(<DisplayLg>Test</DisplayLg>);
    expect(screen.getByText('Test')).toHaveClass('font-normal');
  });
});

describe('DisplayMd', () => {
  it('renders with default props', () => {
    render(<DisplayMd>Display MD</DisplayMd>);
    const element = screen.getByText('Display MD');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('SPAN');
  });

  it('applies correct size classes (56px/70px)', () => {
    render(<DisplayMd>Test</DisplayMd>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-[56px]', 'leading-[70px]');
  });

  it('applies regular weight by default', () => {
    render(<DisplayMd>Test</DisplayMd>);
    expect(screen.getByText('Test')).toHaveClass('font-normal');
  });
});

describe('DisplaySm', () => {
  it('renders with default props', () => {
    render(<DisplaySm>Display SM</DisplaySm>);
    const element = screen.getByText('Display SM');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('SPAN');
  });

  it('applies correct size classes (48px/60px)', () => {
    render(<DisplaySm>Test</DisplaySm>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-[48px]', 'leading-[60px]');
  });

  it('applies regular weight by default', () => {
    render(<DisplaySm>Test</DisplaySm>);
    expect(screen.getByText('Test')).toHaveClass('font-normal');
  });
});

describe('DisplayXs', () => {
  it('renders with default props', () => {
    render(<DisplayXs>Display XS</DisplayXs>);
    const element = screen.getByText('Display XS');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('SPAN');
  });

  it('applies correct size classes (40px/50px)', () => {
    render(<DisplayXs>Test</DisplayXs>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-[40px]', 'leading-[50px]');
  });

  it('applies regular weight by default', () => {
    render(<DisplayXs>Test</DisplayXs>);
    expect(screen.getByText('Test')).toHaveClass('font-normal');
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

    const { rerender } = render(<DisplayXs color="default">Test</DisplayXs>);

    for (const { color, expected } of colors) {
      rerender(<DisplayXs color={color}>Test</DisplayXs>);
      expect(screen.getByText('Test')).toHaveClass(expected);
    }
  });

  it('renders child element with asChild prop', () => {
    render(
      <DisplayXs asChild>
        <a href="/test">Link text</a>
      </DisplayXs>
    );
    const element = screen.getByText('Link text');
    expect(element.tagName).toBe('A');
    expect(element).toHaveClass('text-[40px]');
  });
});

describe('Display size progression', () => {
  it('renders all display sizes in order', () => {
    render(
      <div>
        <DisplayXxl data-testid="xxl">XXL</DisplayXxl>
        <DisplayXl data-testid="xl">XL</DisplayXl>
        <DisplayLg data-testid="lg">LG</DisplayLg>
        <DisplayMd data-testid="md">MD</DisplayMd>
        <DisplaySm data-testid="sm">SM</DisplaySm>
        <DisplayXs data-testid="xs">XS</DisplayXs>
      </div>
    );

    expect(screen.getByTestId('xxl')).toHaveClass('text-[80px]');
    expect(screen.getByTestId('xl')).toHaveClass('text-[72px]');
    expect(screen.getByTestId('lg')).toHaveClass('text-[64px]');
    expect(screen.getByTestId('md')).toHaveClass('text-[56px]');
    expect(screen.getByTestId('sm')).toHaveClass('text-[48px]');
    expect(screen.getByTestId('xs')).toHaveClass('text-[40px]');
  });
});
