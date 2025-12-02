import { createRef } from 'react';
import { GridFour, List, Rows } from '@phosphor-icons/react';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ButtonGroup } from '../button-group';
import { ButtonGroupItem } from '../button-group-item';

describe('ButtonGroup', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>Option 1</ButtonGroupItem>
          <ButtonGroupItem>Option 2</ButtonGroupItem>
        </ButtonGroup>
      );

      const group = screen.getByRole('group');
      expect(group).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('renders all children correctly', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>One</ButtonGroupItem>
          <ButtonGroupItem>Two</ButtonGroupItem>
          <ButtonGroupItem>Three</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByText('One')).toBeInTheDocument();
      expect(screen.getByText('Two')).toBeInTheDocument();
      expect(screen.getByText('Three')).toBeInTheDocument();
    });

    it('applies inline-flex by default (hug=true)', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>Option</ButtonGroupItem>
        </ButtonGroup>
      );

      const group = screen.getByRole('group');
      expect(group).toHaveClass('inline-flex');
      expect(group).not.toHaveClass('w-full');
    });
  });

  describe('Hug Behavior', () => {
    it('applies hug=true styles (inline-flex, no w-full)', () => {
      render(
        <ButtonGroup hug aria-label="Test group">
          <ButtonGroupItem>Option</ButtonGroupItem>
        </ButtonGroup>
      );

      const group = screen.getByRole('group');
      expect(group).toHaveClass('inline-flex');
      expect(group).not.toHaveClass('w-full');
    });

    it('applies hug=false styles (w-full)', () => {
      render(
        <ButtonGroup hug={false} aria-label="Test group">
          <ButtonGroupItem>Option</ButtonGroupItem>
        </ButtonGroup>
      );

      const group = screen.getByRole('group');
      expect(group).toHaveClass('inline-flex', 'w-full');
    });

    it('applies flex-1 to children when hug=false', () => {
      render(
        <ButtonGroup hug={false} aria-label="Test group">
          <ButtonGroupItem>Option 1</ButtonGroupItem>
          <ButtonGroupItem>Option 2</ButtonGroupItem>
        </ButtonGroup>
      );

      const buttons = screen.getAllByRole('button');
      for (const button of buttons) {
        expect(button).toHaveClass('flex-1');
      }
    });

    it('does not apply flex-1 when hug=true', () => {
      render(
        <ButtonGroup hug aria-label="Test group">
          <ButtonGroupItem>Option 1</ButtonGroupItem>
          <ButtonGroupItem>Option 2</ButtonGroupItem>
        </ButtonGroup>
      );

      const buttons = screen.getAllByRole('button');
      for (const button of buttons) {
        expect(button).not.toHaveClass('flex-1');
      }
    });
  });

  describe('Size Prop Cascading', () => {
    it('passes size prop to children', () => {
      render(
        <ButtonGroup size="lg" aria-label="Test group">
          <ButtonGroupItem>Option</ButtonGroupItem>
        </ButtonGroup>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12'); // lg size
    });

    it('child size prop overrides group size prop', () => {
      render(
        <ButtonGroup size="lg" aria-label="Test group">
          <ButtonGroupItem size="sm">Small item</ButtonGroupItem>
        </ButtonGroup>
      );

      const button = screen.getByText('Small item');
      expect(button).toHaveClass('h-8'); // sm size overrides lg
    });

    it('children without size prop use group size', () => {
      render(
        <ButtonGroup size="sm" aria-label="Test group">
          <ButtonGroupItem>First</ButtonGroupItem>
          <ButtonGroupItem size="lg">Second</ButtonGroupItem>
          <ButtonGroupItem>Third</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByText('First')).toHaveClass('h-8'); // sm from group
      expect(screen.getByText('Second')).toHaveClass('h-12'); // lg override
      expect(screen.getByText('Third')).toHaveClass('h-8'); // sm from group
    });

    it('applies all size variants correctly', () => {
      const { rerender } = render(
        <ButtonGroup size="sm" aria-label="Test group">
          <ButtonGroupItem>Option</ButtonGroupItem>
        </ButtonGroup>
      );
      expect(screen.getByRole('button')).toHaveClass('h-8');

      rerender(
        <ButtonGroup size="md" aria-label="Test group">
          <ButtonGroupItem>Option</ButtonGroupItem>
        </ButtonGroup>
      );
      expect(screen.getByRole('button')).toHaveClass('h-10');

      rerender(
        <ButtonGroup size="lg" aria-label="Test group">
          <ButtonGroupItem>Option</ButtonGroupItem>
        </ButtonGroup>
      );
      expect(screen.getByRole('button')).toHaveClass('h-12');
    });
  });

  describe('Position Detection', () => {
    it('applies position="first" to first child', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>First</ButtonGroupItem>
          <ButtonGroupItem>Middle</ButtonGroupItem>
          <ButtonGroupItem>Last</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByText('First')).toHaveClass('rounded-l-sm');
    });

    it('applies position="middle" to middle children', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>First</ButtonGroupItem>
          <ButtonGroupItem>Middle</ButtonGroupItem>
          <ButtonGroupItem>Last</ButtonGroupItem>
        </ButtonGroup>
      );

      const middle = screen.getByText('Middle');
      expect(middle).not.toHaveClass('rounded-l-sm');
      expect(middle).not.toHaveClass('rounded-r-sm');
      expect(middle).not.toHaveClass('rounded-sm');
    });

    it('applies position="last" to last child', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>First</ButtonGroupItem>
          <ButtonGroupItem>Middle</ButtonGroupItem>
          <ButtonGroupItem>Last</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByText('Last')).toHaveClass('rounded-r-sm');
    });

    it('applies position="only" to single child', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>Only</ButtonGroupItem>
        </ButtonGroup>
      );

      const button = screen.getByText('Only');
      expect(button).toHaveClass('rounded-sm');
    });

    it('handles two children correctly (first and last)', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>First</ButtonGroupItem>
          <ButtonGroupItem>Last</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByText('First')).toHaveClass('rounded-l-sm');
      expect(screen.getByText('Last')).toHaveClass('rounded-r-sm');
    });

    it('handles four children correctly', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>One</ButtonGroupItem>
          <ButtonGroupItem>Two</ButtonGroupItem>
          <ButtonGroupItem>Three</ButtonGroupItem>
          <ButtonGroupItem>Four</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByText('One')).toHaveClass('rounded-l-sm');
      expect(screen.getByText('Two')).not.toHaveClass(
        'rounded-l-sm',
        'rounded-r-sm'
      );
      expect(screen.getByText('Three')).not.toHaveClass(
        'rounded-l-sm',
        'rounded-r-sm'
      );
      expect(screen.getByText('Four')).toHaveClass('rounded-r-sm');
    });
  });

  describe('Border Overlap Classes', () => {
    it('first child does not have -ml-px', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>First</ButtonGroupItem>
          <ButtonGroupItem>Second</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByText('First')).not.toHaveClass('-ml-px');
    });

    it('non-first children have -ml-px', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>First</ButtonGroupItem>
          <ButtonGroupItem>Second</ButtonGroupItem>
          <ButtonGroupItem>Third</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByText('First')).not.toHaveClass('-ml-px');
      expect(screen.getByText('Second')).toHaveClass('-ml-px');
      expect(screen.getByText('Third')).toHaveClass('-ml-px');
    });

    it('single child does not have -ml-px', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>Only</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByText('Only')).not.toHaveClass('-ml-px');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to container div', () => {
      const ref = createRef<HTMLDivElement>();

      render(
        <ButtonGroup ref={ref} aria-label="Test group">
          <ButtonGroupItem>Option</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwarded ref has correct role', () => {
      const ref = createRef<HTMLDivElement>();

      render(
        <ButtonGroup ref={ref} aria-label="Test group">
          <ButtonGroupItem>Option</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(ref.current?.getAttribute('role')).toBe('group');
    });
  });

  describe('ARIA Attributes', () => {
    it('applies role="group" by default', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>Option</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('accepts custom role="radiogroup"', () => {
      render(
        <ButtonGroup role="radiogroup" aria-label="Selection options">
          <ButtonGroupItem>Option</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('accepts custom role="toolbar"', () => {
      render(
        <ButtonGroup role="toolbar" aria-label="Formatting tools">
          <ButtonGroupItem>Option</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('applies aria-label to container', () => {
      render(
        <ButtonGroup aria-label="View options">
          <ButtonGroupItem>List</ButtonGroupItem>
          <ButtonGroupItem>Grid</ButtonGroupItem>
        </ButtonGroup>
      );

      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('aria-label', 'View options');
    });

    it('applies aria-orientation to container', () => {
      render(
        <ButtonGroup orientation="horizontal" aria-label="Test group">
          <ButtonGroupItem>Option</ButtonGroupItem>
        </ButtonGroup>
      );

      const group = screen.getByRole('group');
      expect(group).toHaveAttribute('aria-orientation', 'horizontal');
    });
  });

  describe('className Merging', () => {
    it('merges custom className on container', () => {
      render(
        <ButtonGroup className="custom-class mt-4" aria-label="Test group">
          <ButtonGroupItem>Option</ButtonGroupItem>
        </ButtonGroup>
      );

      const group = screen.getByRole('group');
      expect(group).toHaveClass('custom-class', 'mt-4', 'inline-flex');
    });

    it('preserves child className', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem className="child-class">Option</ButtonGroupItem>
        </ButtonGroup>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('child-class');
    });

    it('child className is preserved alongside injected classes', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem className="child-class">First</ButtonGroupItem>
          <ButtonGroupItem className="another-class">Second</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByText('First')).toHaveClass('child-class');
      expect(screen.getByText('Second')).toHaveClass('another-class', '-ml-px');
    });
  });

  describe('Child Type Validation', () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('warns when non-ButtonGroupItem children are provided', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>Valid</ButtonGroupItem>
          <div>Invalid</div>
        </ButtonGroup>
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('invalid child')
      );
    });

    it('warns with correct count of invalid children', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>Valid</ButtonGroupItem>
          <span>Invalid 1</span>
          <p>Invalid 2</p>
        </ButtonGroup>
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('2 invalid child')
      );
    });

    it('does not warn when all children are valid', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>Option 1</ButtonGroupItem>
          <ButtonGroupItem>Option 2</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('filters out invalid children and only renders valid ones', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>Valid 1</ButtonGroupItem>
          <div data-testid="invalid">Invalid</div>
          <ButtonGroupItem>Valid 2</ButtonGroupItem>
        </ButtonGroup>
      );

      // Valid children should be rendered
      expect(screen.getByText('Valid 1')).toBeInTheDocument();
      expect(screen.getByText('Valid 2')).toBeInTheDocument();

      // Invalid children should not be rendered
      expect(screen.queryByTestId('invalid')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(<ButtonGroup aria-label="Empty group">{[]}</ButtonGroup>);

      const group = screen.getByRole('group');
      expect(group).toBeInTheDocument();
      expect(group).toBeEmptyDOMElement();
    });

    it('handles null children', () => {
      render(
        <ButtonGroup aria-label="Test group">
          {null}
          <ButtonGroupItem>Valid</ButtonGroupItem>
          {null}
        </ButtonGroup>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
    });

    it('handles undefined children', () => {
      render(
        <ButtonGroup aria-label="Test group">
          {undefined}
          <ButtonGroupItem>Valid</ButtonGroupItem>
          {undefined}
        </ButtonGroup>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
    });

    it('handles false children (conditional rendering)', () => {
      const showExtra = false;
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>Always</ButtonGroupItem>
          {showExtra && <ButtonGroupItem>Conditional</ButtonGroupItem>}
        </ButtonGroup>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
      expect(screen.getByText('Always')).toHaveClass('rounded-sm'); // 'only' position
    });

    it('recalculates positions when children change', () => {
      const { rerender } = render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>First</ButtonGroupItem>
          <ButtonGroupItem>Second</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByText('First')).toHaveClass('rounded-l-sm');
      expect(screen.getByText('Second')).toHaveClass('rounded-r-sm');

      rerender(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>Only</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByText('Only')).toHaveClass('rounded-sm');
    });
  });

  describe('Integration with ButtonGroupItem Props', () => {
    it('preserves selected prop on children', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem selected>Selected</ButtonGroupItem>
          <ButtonGroupItem>Not Selected</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByText('Selected')).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      expect(screen.getByText('Not Selected')).not.toHaveAttribute(
        'aria-pressed'
      );
    });

    it('preserves disabled prop on children', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem disabled>Disabled</ButtonGroupItem>
          <ButtonGroupItem>Enabled</ButtonGroupItem>
        </ButtonGroup>
      );

      expect(screen.getByText('Disabled')).toBeDisabled();
      expect(screen.getByText('Enabled')).not.toBeDisabled();
    });

    it('preserves icons on children', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem leftIcon={List}>List</ButtonGroupItem>
          <ButtonGroupItem leftIcon={GridFour}>Grid</ButtonGroupItem>
          <ButtonGroupItem leftIcon={Rows}>Rows</ButtonGroupItem>
        </ButtonGroup>
      );

      const buttons = screen.getAllByRole('button');
      for (const button of buttons) {
        expect(button.querySelector('svg')).toBeInTheDocument();
      }
    });

    it('works with icon-only items', () => {
      render(
        <ButtonGroup aria-label="View mode">
          <ButtonGroupItem leftIcon={List} aria-label="List view" />
          <ButtonGroupItem leftIcon={GridFour} aria-label="Grid view" />
        </ButtonGroup>
      );

      expect(
        screen.getByRole('button', { name: 'List view' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Grid view' })
      ).toBeInTheDocument();
    });
  });

  describe('isolate Stacking Context', () => {
    it('applies isolate class for z-index stacking', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <ButtonGroupItem>Option</ButtonGroupItem>
        </ButtonGroup>
      );

      const group = screen.getByRole('group');
      expect(group).toHaveClass('isolate');
    });
  });
});
