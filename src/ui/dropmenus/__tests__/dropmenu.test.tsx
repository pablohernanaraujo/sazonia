import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Dropmenu, DropmenuContent } from '../dropmenu';
import { useDropmenuSize } from '../dropmenu-context';

// Test component that exposes context value
function ContextConsumer(): React.ReactElement {
  const size = useDropmenuSize();
  return <div data-testid="context-consumer">{size}</div>;
}

describe('Dropmenu', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(
        <Dropmenu>
          <DropmenuContent>
            <div data-testid="child">Child content</div>
          </DropmenuContent>
        </Dropmenu>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders with default size (lg)', () => {
      render(
        <Dropmenu>
          <ContextConsumer />
        </Dropmenu>
      );
      expect(screen.getByTestId('context-consumer')).toHaveTextContent('lg');
    });

    it('applies custom className to wrapper', () => {
      render(
        <Dropmenu className="custom-class">
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      expect(document.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('propagates SM size to context', () => {
      render(
        <Dropmenu size="sm">
          <ContextConsumer />
        </Dropmenu>
      );
      expect(screen.getByTestId('context-consumer')).toHaveTextContent('sm');
    });

    it('propagates MD size to context', () => {
      render(
        <Dropmenu size="md">
          <ContextConsumer />
        </Dropmenu>
      );
      expect(screen.getByTestId('context-consumer')).toHaveTextContent('md');
    });

    it('propagates LG size to context', () => {
      render(
        <Dropmenu size="lg">
          <ContextConsumer />
        </Dropmenu>
      );
      expect(screen.getByTestId('context-consumer')).toHaveTextContent('lg');
    });
  });
});

describe('DropmenuContent', () => {
  describe('Rendering', () => {
    it('renders as div element', () => {
      render(
        <Dropmenu>
          <DropmenuContent data-testid="content">Content</DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByTestId('content');
      expect(content.tagName).toBe('DIV');
    });

    it('renders children correctly', () => {
      render(
        <Dropmenu>
          <DropmenuContent>
            <span data-testid="inner">Inner content</span>
          </DropmenuContent>
        </Dropmenu>
      );
      expect(screen.getByTestId('inner')).toBeInTheDocument();
    });

    it('has role="menu"', () => {
      render(
        <Dropmenu>
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('has aria-orientation="vertical"', () => {
      render(
        <Dropmenu>
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      expect(screen.getByRole('menu')).toHaveAttribute(
        'aria-orientation',
        'vertical'
      );
    });
  });

  describe('Size variants', () => {
    it('applies SM width (220px) from context', () => {
      render(
        <Dropmenu size="sm">
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByRole('menu');
      expect(content).toHaveClass('w-[220px]');
    });

    it('applies MD width (240px) from context', () => {
      render(
        <Dropmenu size="md">
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByRole('menu');
      expect(content).toHaveClass('w-[240px]');
    });

    it('applies LG width (260px) from context', () => {
      render(
        <Dropmenu size="lg">
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByRole('menu');
      expect(content).toHaveClass('w-[260px]');
    });

    it('applies LG width by default', () => {
      render(
        <Dropmenu>
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByRole('menu');
      expect(content).toHaveClass('w-[260px]');
    });

    it('allows size override via explicit prop', () => {
      render(
        <Dropmenu size="lg">
          <DropmenuContent size="sm">Content</DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByRole('menu');
      expect(content).toHaveClass('w-[220px]');
    });

    it('applies max-width constraint for responsive design', () => {
      render(
        <Dropmenu size="lg">
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByRole('menu');
      expect(content).toHaveClass('max-w-[calc(100vw-2rem)]');
    });
  });

  describe('Container styling', () => {
    it('applies flex column layout', () => {
      render(
        <Dropmenu>
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByRole('menu');
      expect(content).toHaveClass('flex', 'flex-col');
    });

    it('applies background color', () => {
      render(
        <Dropmenu>
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByRole('menu');
      expect(content).toHaveClass('bg-background');
    });

    it('applies border styling', () => {
      render(
        <Dropmenu>
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByRole('menu');
      expect(content).toHaveClass('border', 'border-border-secondary');
    });

    it('applies rounded corners', () => {
      render(
        <Dropmenu>
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByRole('menu');
      expect(content).toHaveClass('rounded-sm');
    });

    it('applies shadow', () => {
      render(
        <Dropmenu>
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByRole('menu');
      expect(content).toHaveClass('shadow-lg');
    });

    it('applies overflow clip', () => {
      render(
        <Dropmenu>
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByRole('menu');
      expect(content).toHaveClass('overflow-clip');
    });
  });

  describe('Composition', () => {
    it('merges custom className correctly', () => {
      render(
        <Dropmenu>
          <DropmenuContent className="custom-class mt-4">Content</DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByRole('menu');
      expect(content).toHaveClass('custom-class', 'mt-4');
    });

    it('forwards ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Dropmenu>
          <DropmenuContent ref={ref}>Content</DropmenuContent>
        </Dropmenu>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('ref points to the root div element', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Dropmenu>
          <DropmenuContent ref={ref}>Content</DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByRole('menu');
      expect(ref.current).toBe(content);
    });

    it('forwards additional props', () => {
      render(
        <Dropmenu>
          <DropmenuContent data-custom="test" id="test-id">
            Content
          </DropmenuContent>
        </Dropmenu>
      );
      const content = screen.getByRole('menu');
      expect(content).toHaveAttribute('data-custom', 'test');
      expect(content).toHaveAttribute('id', 'test-id');
    });
  });

  describe('Context fallback', () => {
    it('uses default lg size when used outside Dropmenu', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<DropmenuContent>Content</DropmenuContent>);
      const content = screen.getByRole('menu');
      expect(content).toHaveClass('w-[260px]');

      consoleSpy.mockRestore();
    });

    it('warns in development when used outside Dropmenu', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<DropmenuContent>Content</DropmenuContent>);

      expect(consoleSpy).toHaveBeenCalledWith(
        'useDropmenuSize must be used within a Dropmenu component'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('has role menu', () => {
      render(
        <Dropmenu>
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('has aria-orientation vertical', () => {
      render(
        <Dropmenu>
          <DropmenuContent>Content</DropmenuContent>
        </Dropmenu>
      );
      expect(screen.getByRole('menu')).toHaveAttribute(
        'aria-orientation',
        'vertical'
      );
    });
  });

  describe('Edge cases', () => {
    it('handles empty children', () => {
      render(
        <Dropmenu>
          <DropmenuContent>{null}</DropmenuContent>
        </Dropmenu>
      );
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('handles multiple children', () => {
      render(
        <Dropmenu>
          <DropmenuContent>
            <div data-testid="child1">Child 1</div>
            <div data-testid="child2">Child 2</div>
            <div data-testid="child3">Child 3</div>
          </DropmenuContent>
        </Dropmenu>
      );
      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
      expect(screen.getByTestId('child3')).toBeInTheDocument();
    });

    it('handles nested content', () => {
      render(
        <Dropmenu>
          <DropmenuContent>
            <div>
              <span data-testid="nested">Nested content</span>
            </div>
          </DropmenuContent>
        </Dropmenu>
      );
      expect(screen.getByTestId('nested')).toBeInTheDocument();
    });
  });
});
