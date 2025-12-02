import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { H1, H2, H3, H4, H5, H6, Subtitle } from '../headings';

describe('H1', () => {
  it('renders with default props', () => {
    render(<H1>Heading 1</H1>);
    const element = screen.getByText('Heading 1');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('H1');
  });

  it('applies correct size classes (40px/50px)', () => {
    render(<H1>Test</H1>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-[40px]', 'leading-[50px]');
  });

  it('applies bold weight by default', () => {
    render(<H1>Test</H1>);
    expect(screen.getByText('Test')).toHaveClass('font-bold');
  });

  it('applies color variants', () => {
    const { rerender } = render(<H1 color="muted">Test</H1>);
    expect(screen.getByText('Test')).toHaveClass('text-text-secondary');

    rerender(<H1 color="primary">Test</H1>);
    expect(screen.getByText('Test')).toHaveClass('text-primary');
  });

  it('renders as different element with as prop', () => {
    render(<H1 as="h2">Test</H1>);
    expect(screen.getByText('Test').tagName).toBe('H2');
  });

  it('renders child element with asChild prop', () => {
    render(
      <H1 asChild>
        <a href="/test">Test link</a>
      </H1>
    );
    const element = screen.getByText('Test link');
    expect(element.tagName).toBe('A');
    expect(element).toHaveClass('text-[40px]', 'font-bold');
  });

  it('merges custom className', () => {
    render(<H1 className="custom-class mb-8">Test</H1>);
    expect(screen.getByText('Test')).toHaveClass('custom-class', 'mb-8');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<H1 ref={ref}>Test</H1>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });
});

describe('H2', () => {
  it('renders with default props', () => {
    render(<H2>Heading 2</H2>);
    const element = screen.getByText('Heading 2');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('H2');
  });

  it('applies correct size classes (32px/40px)', () => {
    render(<H2>Test</H2>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-[32px]', 'leading-10');
  });

  it('applies bold weight by default', () => {
    render(<H2>Test</H2>);
    expect(screen.getByText('Test')).toHaveClass('font-bold');
  });
});

describe('H3', () => {
  it('renders with default props', () => {
    render(<H3>Heading 3</H3>);
    const element = screen.getByText('Heading 3');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('H3');
  });

  it('applies correct size classes (24px/32px)', () => {
    render(<H3>Test</H3>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-2xl', 'leading-8');
  });

  it('applies bold weight by default', () => {
    render(<H3>Test</H3>);
    expect(screen.getByText('Test')).toHaveClass('font-bold');
  });
});

describe('H4', () => {
  it('renders with default props', () => {
    render(<H4>Heading 4</H4>);
    const element = screen.getByText('Heading 4');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('H4');
  });

  it('applies correct size classes (20px/28px)', () => {
    render(<H4>Test</H4>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-xl', 'leading-7');
  });

  it('applies bold weight by default', () => {
    render(<H4>Test</H4>);
    expect(screen.getByText('Test')).toHaveClass('font-bold');
  });
});

describe('H5', () => {
  it('renders with default props', () => {
    render(<H5>Heading 5</H5>);
    const element = screen.getByText('Heading 5');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('H5');
  });

  it('applies correct size classes (18px/26px)', () => {
    render(<H5>Test</H5>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-lg', 'leading-[26px]');
  });

  it('applies bold weight by default', () => {
    render(<H5>Test</H5>);
    expect(screen.getByText('Test')).toHaveClass('font-bold');
  });
});

describe('H6', () => {
  it('renders with default props', () => {
    render(<H6>Heading 6</H6>);
    const element = screen.getByText('Heading 6');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('H6');
  });

  it('applies correct size classes (16px/24px)', () => {
    render(<H6>Test</H6>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-base', 'leading-6');
  });

  it('applies bold weight by default', () => {
    render(<H6>Test</H6>);
    expect(screen.getByText('Test')).toHaveClass('font-bold');
  });
});

describe('Subtitle', () => {
  it('renders with default props', () => {
    render(<Subtitle>Subtitle text</Subtitle>);
    const element = screen.getByText('Subtitle text');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('SPAN');
  });

  it('applies correct size classes (14px/20px)', () => {
    render(<Subtitle>Test</Subtitle>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('text-sm', 'leading-5');
  });

  it('applies semibold weight and uppercase', () => {
    render(<Subtitle>Test</Subtitle>);
    const element = screen.getByText('Test');
    expect(element).toHaveClass('font-semibold', 'uppercase', 'tracking-wide');
  });

  it('applies color variants', () => {
    const colors = [
      { color: 'default' as const, expected: 'text-text-primary' },
      { color: 'muted' as const, expected: 'text-text-secondary' },
      { color: 'primary' as const, expected: 'text-primary' },
    ];

    const { rerender } = render(<Subtitle color="default">Test</Subtitle>);

    for (const { color, expected } of colors) {
      rerender(<Subtitle color={color}>Test</Subtitle>);
      expect(screen.getByText('Test')).toHaveClass(expected);
    }
  });

  it('renders as different element with as prop', () => {
    render(<Subtitle as="h6">Test</Subtitle>);
    expect(screen.getByText('Test').tagName).toBe('H6');
  });

  it('renders child element with asChild prop', () => {
    render(
      <Subtitle asChild>
        <label htmlFor="test">Label text</label>
      </Subtitle>
    );
    const element = screen.getByText('Label text');
    expect(element.tagName).toBe('LABEL');
    expect(element).toHaveClass('text-sm', 'font-semibold', 'uppercase');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Subtitle ref={ref}>Test</Subtitle>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});

describe('Heading hierarchy', () => {
  it('renders all headings in proper hierarchy', () => {
    render(
      <article>
        <H1>Main Title</H1>
        <H2>Section</H2>
        <H3>Subsection</H3>
        <H4>Topic</H4>
        <H5>Subtopic</H5>
        <H6>Detail</H6>
      </article>
    );

    expect(screen.getByText('Main Title').tagName).toBe('H1');
    expect(screen.getByText('Section').tagName).toBe('H2');
    expect(screen.getByText('Subsection').tagName).toBe('H3');
    expect(screen.getByText('Topic').tagName).toBe('H4');
    expect(screen.getByText('Subtopic').tagName).toBe('H5');
    expect(screen.getByText('Detail').tagName).toBe('H6');
  });
});
