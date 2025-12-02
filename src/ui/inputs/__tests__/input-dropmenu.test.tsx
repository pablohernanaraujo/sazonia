import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DropmenuItem } from '../dropmenu-item';
import {
  InputDropmenu,
  InputDropmenuContent,
  InputDropmenuOptions,
} from '../input-dropmenu';
import {
  InputDropmenuProvider,
  useInputDropmenuSize,
} from '../input-dropmenu-context';
import { InputDropmenuSearch } from '../input-dropmenu-search';

// Helper component to test context value
function ContextConsumer() {
  const size = useInputDropmenuSize();
  return <div data-testid="context-size">{size}</div>;
}

describe('InputDropmenuContext', () => {
  describe('InputDropmenuProvider', () => {
    it('provides size to children', () => {
      render(
        <InputDropmenuProvider size="md">
          <ContextConsumer />
        </InputDropmenuProvider>
      );
      expect(screen.getByTestId('context-size')).toHaveTextContent('md');
    });

    it('provides sm size correctly', () => {
      render(
        <InputDropmenuProvider size="sm">
          <ContextConsumer />
        </InputDropmenuProvider>
      );
      expect(screen.getByTestId('context-size')).toHaveTextContent('sm');
    });

    it('provides lg size correctly', () => {
      render(
        <InputDropmenuProvider size="lg">
          <ContextConsumer />
        </InputDropmenuProvider>
      );
      expect(screen.getByTestId('context-size')).toHaveTextContent('lg');
    });
  });

  describe('useInputDropmenuSize', () => {
    it('returns lg as default when used outside provider', () => {
      // Suppress console.warn for this test
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<ContextConsumer />);
      expect(screen.getByTestId('context-size')).toHaveTextContent('lg');

      consoleSpy.mockRestore();
    });

    it('logs warning when used outside provider in development', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(<ContextConsumer />);

      expect(consoleSpy).toHaveBeenCalledWith(
        'useInputDropmenuSize must be used within an InputDropmenu component'
      );

      consoleSpy.mockRestore();
    });
  });
});

describe('InputDropmenu', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(
        <InputDropmenu>
          <div data-testid="child">Child content</div>
        </InputDropmenu>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('applies className to wrapper div', () => {
      render(
        <InputDropmenu className="custom-class">
          <div>Content</div>
        </InputDropmenu>
      );
      expect(document.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('provides default lg size to context', () => {
      render(
        <InputDropmenu>
          <ContextConsumer />
        </InputDropmenu>
      );
      expect(screen.getByTestId('context-size')).toHaveTextContent('lg');
    });

    it('provides custom size to context', () => {
      render(
        <InputDropmenu size="sm">
          <ContextConsumer />
        </InputDropmenu>
      );
      expect(screen.getByTestId('context-size')).toHaveTextContent('sm');
    });
  });

  describe('Size context propagation', () => {
    it('passes sm size to context', () => {
      render(
        <InputDropmenu size="sm">
          <ContextConsumer />
        </InputDropmenu>
      );
      expect(screen.getByTestId('context-size')).toHaveTextContent('sm');
    });

    it('passes md size to context', () => {
      render(
        <InputDropmenu size="md">
          <ContextConsumer />
        </InputDropmenu>
      );
      expect(screen.getByTestId('context-size')).toHaveTextContent('md');
    });

    it('passes lg size to context', () => {
      render(
        <InputDropmenu size="lg">
          <ContextConsumer />
        </InputDropmenu>
      );
      expect(screen.getByTestId('context-size')).toHaveTextContent('lg');
    });
  });
});

describe('InputDropmenuContent', () => {
  describe('Rendering', () => {
    it('renders as div with role listbox', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const content = screen.getByRole('listbox');
      expect(content).toBeInTheDocument();
      expect(content.tagName).toBe('DIV');
    });

    it('renders children correctly', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <div data-testid="content-child">Child</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      expect(screen.getByTestId('content-child')).toBeInTheDocument();
    });

    it('has aria-orientation vertical', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      expect(screen.getByRole('listbox')).toHaveAttribute(
        'aria-orientation',
        'vertical'
      );
    });
  });

  describe('Size variants', () => {
    it('applies SM size from context (240px height)', () => {
      render(
        <InputDropmenu size="sm">
          <InputDropmenuContent>
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('h-[240px]', 'w-[320px]');
    });

    it('applies MD size from context (288px height)', () => {
      render(
        <InputDropmenu size="md">
          <InputDropmenuContent>
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('h-[288px]', 'w-[320px]');
    });

    it('applies LG size from context (344px height)', () => {
      render(
        <InputDropmenu size="lg">
          <InputDropmenuContent>
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('h-[344px]', 'w-[320px]');
    });

    it('defaults to LG size when no size provided', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('h-[344px]');
    });

    it('allows prop size to override context size', () => {
      render(
        <InputDropmenu size="lg">
          <InputDropmenuContent size="sm">
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('h-[240px]');
    });
  });

  describe('Base styles', () => {
    it('applies flex column layout', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('flex', 'flex-col');
    });

    it('applies border styles', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('border', 'border-border-secondary');
    });

    it('applies background style', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('bg-background');
    });

    it('applies shadow', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('shadow-lg');
    });

    it('applies rounded corners', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('rounded-sm');
    });

    it('applies overflow clip', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('overflow-clip');
    });

    it('applies responsive max-width', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('max-w-[calc(100vw-2rem)]');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <InputDropmenu>
          <InputDropmenuContent ref={ref}>
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('ref points to the listbox element', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <InputDropmenu>
          <InputDropmenuContent ref={ref}>
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const listbox = screen.getByRole('listbox');
      expect(ref.current).toBe(listbox);
    });
  });

  describe('Composition', () => {
    it('merges custom className correctly', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent className="custom-class mt-4">
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('custom-class', 'mt-4');
    });

    it('passes through additional props', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent
            data-testid="custom-content"
            aria-label="Select option"
          >
            <div>Content</div>
          </InputDropmenuContent>
        </InputDropmenu>
      );
      const content = screen.getByTestId('custom-content');
      expect(content).toHaveAttribute('aria-label', 'Select option');
    });
  });
});

describe('InputDropmenuOptions', () => {
  describe('Rendering', () => {
    it('renders as div with role group', () => {
      render(
        <InputDropmenuOptions>
          <div>Options</div>
        </InputDropmenuOptions>
      );
      const options = screen.getByRole('group');
      expect(options).toBeInTheDocument();
      expect(options.tagName).toBe('DIV');
    });

    it('renders children correctly', () => {
      render(
        <InputDropmenuOptions>
          <div data-testid="option-1">Option 1</div>
          <div data-testid="option-2">Option 2</div>
        </InputDropmenuOptions>
      );
      expect(screen.getByTestId('option-1')).toBeInTheDocument();
      expect(screen.getByTestId('option-2')).toBeInTheDocument();
    });
  });

  describe('Scrolling styles', () => {
    it('applies flex-1 for growth', () => {
      render(
        <InputDropmenuOptions>
          <div>Options</div>
        </InputDropmenuOptions>
      );
      const options = screen.getByRole('group');
      expect(options).toHaveClass('flex-1');
    });

    it('applies overflow-y-auto for scrolling', () => {
      render(
        <InputDropmenuOptions>
          <div>Options</div>
        </InputDropmenuOptions>
      );
      const options = screen.getByRole('group');
      expect(options).toHaveClass('overflow-y-auto');
    });

    it('applies vertical padding', () => {
      render(
        <InputDropmenuOptions>
          <div>Options</div>
        </InputDropmenuOptions>
      );
      const options = screen.getByRole('group');
      expect(options).toHaveClass('py-1');
    });

    it('applies custom scrollbar width class', () => {
      render(
        <InputDropmenuOptions>
          <div>Options</div>
        </InputDropmenuOptions>
      );
      const options = screen.getByRole('group');
      expect(options).toHaveClass('[&::-webkit-scrollbar]:w-3');
    });

    it('applies custom scrollbar track class', () => {
      render(
        <InputDropmenuOptions>
          <div>Options</div>
        </InputDropmenuOptions>
      );
      const options = screen.getByRole('group');
      expect(options).toHaveClass('[&::-webkit-scrollbar-track]:bg-transparent');
    });

    it('applies custom scrollbar thumb classes', () => {
      render(
        <InputDropmenuOptions>
          <div>Options</div>
        </InputDropmenuOptions>
      );
      const options = screen.getByRole('group');
      expect(options).toHaveClass(
        '[&::-webkit-scrollbar-thumb]:rounded',
        '[&::-webkit-scrollbar-thumb]:bg-background-tertiary'
      );
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <InputDropmenuOptions ref={ref}>
          <div>Options</div>
        </InputDropmenuOptions>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('ref points to the group element', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <InputDropmenuOptions ref={ref}>
          <div>Options</div>
        </InputDropmenuOptions>
      );
      const group = screen.getByRole('group');
      expect(ref.current).toBe(group);
    });
  });

  describe('Composition', () => {
    it('merges custom className correctly', () => {
      render(
        <InputDropmenuOptions className="custom-class">
          <div>Options</div>
        </InputDropmenuOptions>
      );
      const options = screen.getByRole('group');
      expect(options).toHaveClass('custom-class');
    });

    it('passes through additional props', () => {
      render(
        <InputDropmenuOptions
          data-testid="custom-options"
          aria-label="Options list"
        >
          <div>Options</div>
        </InputDropmenuOptions>
      );
      const options = screen.getByTestId('custom-options');
      expect(options).toHaveAttribute('aria-label', 'Options list');
    });
  });
});

describe('Integration tests', () => {
  describe('Full composition', () => {
    it('renders complete dropdown with search and options', () => {
      render(
        <InputDropmenu size="lg">
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." />
            <InputDropmenuOptions>
              <DropmenuItem label="Option 1" />
              <DropmenuItem label="Option 2" />
              <DropmenuItem label="Option 3" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      );

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('renders with selected option', () => {
      render(
        <InputDropmenu size="lg">
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search countries..." />
            <InputDropmenuOptions>
              <DropmenuItem label="United States" selected />
              <DropmenuItem label="Canada" />
              <DropmenuItem label="United Kingdom" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      );

      const selectedOption = screen
        .getByText('United States')
        .closest('[role="option"]');
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    });

    it('renders with disabled options', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." />
            <InputDropmenuOptions>
              <DropmenuItem label="Active option" />
              <DropmenuItem label="Disabled option" disabled />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      );

      const disabledOption = screen
        .getByText('Disabled option')
        .closest('[role="option"]');
      expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
    });

    it('renders with multi-select checkboxes', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." />
            <InputDropmenuOptions>
              <DropmenuItem label="Option 1" showCheckbox selected />
              <DropmenuItem label="Option 2" showCheckbox selected />
              <DropmenuItem label="Option 3" showCheckbox />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      );

      const option1 = screen.getByText('Option 1').closest('[role="option"]');
      const option2 = screen.getByText('Option 2').closest('[role="option"]');
      const option3 = screen.getByText('Option 3').closest('[role="option"]');

      expect(option1).toHaveAttribute('aria-checked', 'true');
      expect(option2).toHaveAttribute('aria-checked', 'true');
      expect(option3).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Size consistency', () => {
    it('SM size renders with correct container dimensions', () => {
      render(
        <InputDropmenu size="sm">
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." size="sm" />
            <InputDropmenuOptions>
              <DropmenuItem label="Option" size="sm" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      );

      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('h-[240px]', 'w-[320px]');
    });

    it('MD size renders with correct container dimensions', () => {
      render(
        <InputDropmenu size="md">
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." size="md" />
            <InputDropmenuOptions>
              <DropmenuItem label="Option" size="md" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      );

      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('h-[288px]', 'w-[320px]');
    });

    it('LG size renders with correct container dimensions', () => {
      render(
        <InputDropmenu size="lg">
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." size="lg" />
            <InputDropmenuOptions>
              <DropmenuItem label="Option" size="lg" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      );

      const content = screen.getByRole('listbox');
      expect(content).toHaveClass('h-[344px]', 'w-[320px]');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA roles structure', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." />
            <InputDropmenuOptions>
              <DropmenuItem label="Option" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      );

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
      expect(screen.getByRole('group')).toBeInTheDocument();
      expect(screen.getByRole('option')).toBeInTheDocument();
    });

    it('options are accessible to screen readers', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent aria-label="Select a country">
            <InputDropmenuSearch placeholder="Search countries..." />
            <InputDropmenuOptions>
              <DropmenuItem label="United States" />
              <DropmenuItem label="Canada" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      );

      expect(screen.getByRole('listbox')).toHaveAttribute(
        'aria-label',
        'Select a country'
      );
      expect(screen.getByText('United States')).toBeVisible();
      expect(screen.getByText('Canada')).toBeVisible();
    });
  });
});

describe('Edge cases', () => {
  describe('Empty options list', () => {
    it('renders empty container gracefully', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." />
            <InputDropmenuOptions>{null}</InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      );

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByRole('group')).toBeInTheDocument();
    });
  });

  describe('Single option', () => {
    it('renders single option correctly', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." />
            <InputDropmenuOptions>
              <DropmenuItem label="Only option" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      );

      expect(screen.getByText('Only option')).toBeInTheDocument();
    });
  });

  describe('Many options', () => {
    it('renders many options correctly', () => {
      const options = Array.from({ length: 50 }, (_, i) => `Option ${i + 1}`);

      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <InputDropmenuSearch placeholder="Search..." />
            <InputDropmenuOptions>
              {options.map((label) => (
                <DropmenuItem key={label} label={label} />
              ))}
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 50')).toBeInTheDocument();
    });
  });

  describe('No search input', () => {
    it('works without InputDropmenuSearch', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <InputDropmenuOptions>
              <DropmenuItem label="Option 1" />
              <DropmenuItem label="Option 2" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      );

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  describe('Custom content', () => {
    it('accepts arbitrary children in options', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <InputDropmenuOptions>
              <div data-testid="custom-1">Custom content 1</div>
              <div data-testid="custom-2">Custom content 2</div>
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      );

      expect(screen.getByTestId('custom-1')).toBeInTheDocument();
      expect(screen.getByTestId('custom-2')).toBeInTheDocument();
    });
  });

  describe('Unicode and special characters', () => {
    it('handles unicode characters in options', () => {
      render(
        <InputDropmenu>
          <InputDropmenuContent>
            <InputDropmenuOptions>
              <DropmenuItem label="日本語オプション" />
              <DropmenuItem label="한국어 옵션" />
              <DropmenuItem label="Émojis 🎉🚀" />
            </InputDropmenuOptions>
          </InputDropmenuContent>
        </InputDropmenu>
      );

      expect(screen.getByText('日本語オプション')).toBeInTheDocument();
      expect(screen.getByText('한국어 옵션')).toBeInTheDocument();
      expect(screen.getByText('Émojis 🎉🚀')).toBeInTheDocument();
    });
  });
});
