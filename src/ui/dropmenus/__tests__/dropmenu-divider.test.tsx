import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DropmenuDivider } from '../dropmenu-divider';

describe('DropmenuDivider', () => {
  describe('Default rendering', () => {
    it('renders as a div element', () => {
      render(<DropmenuDivider data-testid="divider" />);
      const element = screen.getByTestId('divider');
      expect(element).toBeInTheDocument();
      expect(element.tagName).toBe('DIV');
    });

    it('contains an inner line div', () => {
      render(<DropmenuDivider data-testid="divider" />);
      const container = screen.getByTestId('divider');
      const line = container.querySelector('div');
      expect(line).toBeInTheDocument();
    });

    it('renders with correct structure', () => {
      render(<DropmenuDivider data-testid="divider" />);
      const container = screen.getByTestId('divider');
      expect(container.children).toHaveLength(1);
    });
  });

  describe('Styling', () => {
    it('applies container background class', () => {
      render(<DropmenuDivider data-testid="divider" />);
      const element = screen.getByTestId('divider');
      expect(element).toHaveClass('bg-background');
    });

    it('applies vertical padding class', () => {
      render(<DropmenuDivider data-testid="divider" />);
      const element = screen.getByTestId('divider');
      expect(element).toHaveClass('py-0.5');
    });

    it('applies full width class to container', () => {
      render(<DropmenuDivider data-testid="divider" />);
      const element = screen.getByTestId('divider');
      expect(element).toHaveClass('w-full');
    });

    it('applies 1px height to inner line', () => {
      render(<DropmenuDivider data-testid="divider" />);
      const container = screen.getByTestId('divider');
      const line = container.querySelector('div');
      expect(line).toHaveClass('h-px');
    });

    it('applies tertiary fill color to inner line', () => {
      render(<DropmenuDivider data-testid="divider" />);
      const container = screen.getByTestId('divider');
      const line = container.querySelector('div');
      expect(line).toHaveClass('bg-fill-tertiary');
    });

    it('applies full width to inner line', () => {
      render(<DropmenuDivider data-testid="divider" />);
      const container = screen.getByTestId('divider');
      const line = container.querySelector('div');
      expect(line).toHaveClass('w-full');
    });
  });

  describe('className merging', () => {
    it('merges custom className with base classes', () => {
      render(<DropmenuDivider data-testid="divider" className="custom-class" />);
      const element = screen.getByTestId('divider');
      expect(element).toHaveClass(
        'bg-background',
        'py-0.5',
        'w-full',
        'custom-class'
      );
    });

    it('merges multiple custom classes', () => {
      render(
        <DropmenuDivider data-testid="divider" className="class-1 class-2 mt-4" />
      );
      const element = screen.getByTestId('divider');
      expect(element).toHaveClass('class-1', 'class-2', 'mt-4');
    });

    it('allows overriding default styles', () => {
      render(<DropmenuDivider data-testid="divider" className="py-2" />);
      const element = screen.getByTestId('divider');
      expect(element).toHaveClass('py-2');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(<DropmenuDivider ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('ref points to the outer container div', () => {
      const ref = createRef<HTMLDivElement>();
      render(<DropmenuDivider ref={ref} data-testid="divider" />);
      expect(ref.current?.tagName).toBe('DIV');
      expect(ref.current).toHaveClass('bg-background');
    });
  });

  describe('Props passthrough', () => {
    it('passes data-testid prop through', () => {
      render(<DropmenuDivider data-testid="my-divider" />);
      expect(screen.getByTestId('my-divider')).toBeInTheDocument();
    });

    it('passes id prop through', () => {
      render(<DropmenuDivider id="divider-id" data-testid="divider" />);
      expect(screen.getByTestId('divider')).toHaveAttribute('id', 'divider-id');
    });

    it('passes aria-hidden prop through', () => {
      render(<DropmenuDivider aria-hidden="true" data-testid="divider" />);
      expect(screen.getByTestId('divider')).toHaveAttribute(
        'aria-hidden',
        'true'
      );
    });

    it('passes custom data attributes through', () => {
      render(<DropmenuDivider data-custom="value" data-testid="divider" />);
      expect(screen.getByTestId('divider')).toHaveAttribute(
        'data-custom',
        'value'
      );
    });
  });

  describe('Accessibility', () => {
    it('supports role="separator" for screen readers', () => {
      render(<DropmenuDivider role="separator" data-testid="divider" />);
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('supports aria-orientation prop', () => {
      render(
        <DropmenuDivider
          role="separator"
          aria-orientation="horizontal"
          data-testid="divider"
        />
      );
      expect(screen.getByTestId('divider')).toHaveAttribute(
        'aria-orientation',
        'horizontal'
      );
    });
  });

  describe('Edge cases', () => {
    it('renders correctly with no props', () => {
      const { container } = render(<DropmenuDivider />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles multiple instances on same page', () => {
      render(
        <>
          <DropmenuDivider data-testid="divider-1" />
          <DropmenuDivider data-testid="divider-2" />
          <DropmenuDivider data-testid="divider-3" />
        </>
      );
      expect(screen.getByTestId('divider-1')).toBeInTheDocument();
      expect(screen.getByTestId('divider-2')).toBeInTheDocument();
      expect(screen.getByTestId('divider-3')).toBeInTheDocument();
    });

    it('works within flex container', () => {
      render(
        <div className="flex flex-col">
          <div>Item 1</div>
          <DropmenuDivider data-testid="divider" />
          <div>Item 2</div>
        </div>
      );
      expect(screen.getByTestId('divider')).toBeInTheDocument();
    });
  });
});
