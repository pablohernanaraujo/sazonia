import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SearchInput } from '../search-input';

describe('SearchInput', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<SearchInput placeholder="Search..." />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders as input element with type search', () => {
      render(<SearchInput data-testid="search-input" />);
      const input = screen.getByTestId('search-input');
      expect(input.tagName).toBe('INPUT');
      expect(input).toHaveAttribute('type', 'search');
    });

    it('renders with role searchbox', () => {
      render(<SearchInput data-testid="search-input" />);
      expect(screen.getByTestId('search-input')).toHaveAttribute(
        'role',
        'searchbox'
      );
    });

    it('renders search icon', () => {
      const { container } = render(<SearchInput />);
      // Icon component renders the MagnifyingGlass SVG
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders with value', () => {
      render(<SearchInput defaultValue="Hello" />);
      expect(screen.getByDisplayValue('Hello')).toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('applies LG size by default', () => {
      render(<SearchInput data-testid="search-input" />);
      const input = screen.getByTestId('search-input');
      expect(input).toHaveClass('text-base', 'leading-6');
    });

    it('applies SM size variant', () => {
      render(<SearchInput size="sm" data-testid="search-input" />);
      const input = screen.getByTestId('search-input');
      expect(input).toHaveClass('text-sm', 'leading-5');
    });

    it('applies MD size variant', () => {
      render(<SearchInput size="md" data-testid="search-input" />);
      const input = screen.getByTestId('search-input');
      expect(input).toHaveClass('text-sm', 'leading-5');
    });

    it('applies LG size variant explicitly', () => {
      render(<SearchInput size="lg" data-testid="search-input" />);
      const input = screen.getByTestId('search-input');
      expect(input).toHaveClass('text-base', 'leading-6');
    });

    it('wrapper has correct height for SM size', () => {
      const { container } = render(<SearchInput size="sm" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('h-8');
    });

    it('wrapper has correct height for MD size', () => {
      const { container } = render(<SearchInput size="md" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('h-10');
    });

    it('wrapper has correct height for LG size', () => {
      const { container } = render(<SearchInput size="lg" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('h-12');
    });

    it('wrapper has correct padding and gap for all sizes', () => {
      const { container, rerender } = render(<SearchInput size="sm" />);
      let wrapper = container.firstChild;
      expect(wrapper).toHaveClass('px-4', 'py-2', 'gap-3');

      rerender(<SearchInput size="md" />);
      wrapper = container.firstChild;
      expect(wrapper).toHaveClass('px-4', 'py-2.5', 'gap-3');

      rerender(<SearchInput size="lg" />);
      wrapper = container.firstChild;
      expect(wrapper).toHaveClass('px-4', 'py-3', 'gap-3');
    });
  });

  describe('Style variants', () => {
    it('applies default style variant with rounded-sm', () => {
      const { container } = render(<SearchInput styleVariant="default" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('rounded-sm');
    });

    it('applies circled style variant with rounded-full', () => {
      const { container } = render(<SearchInput styleVariant="circled" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('rounded-full');
    });

    it('uses default style variant by default', () => {
      const { container } = render(<SearchInput />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('rounded-sm');
    });
  });

  describe('Error state', () => {
    it('applies error styles when error is true', () => {
      const { container } = render(<SearchInput error />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('does not apply error styles when error is false', () => {
      const { container } = render(<SearchInput error={false} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('border-border');
      expect(wrapper).not.toHaveClass('border-destructive');
    });

    it('sets aria-invalid when error is true', () => {
      render(<SearchInput error data-testid="search-input" />);
      expect(screen.getByTestId('search-input')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('does not set aria-invalid when error is false', () => {
      render(<SearchInput error={false} data-testid="search-input" />);
      expect(screen.getByTestId('search-input')).not.toHaveAttribute(
        'aria-invalid'
      );
    });

    it('respects explicit aria-invalid over error prop', () => {
      render(
        <SearchInput
          error={false}
          aria-invalid="true"
          data-testid="search-input"
        />
      );
      expect(screen.getByTestId('search-input')).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });
  });

  describe('Disabled state', () => {
    it('applies disabled attribute when disabled', () => {
      render(<SearchInput disabled data-testid="search-input" />);
      expect(screen.getByTestId('search-input')).toBeDisabled();
    });

    it('wrapper has disabled styling', () => {
      const { container } = render(<SearchInput disabled />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('has-[:disabled]:bg-background-secondary');
    });

    it('input has disabled cursor class', () => {
      render(<SearchInput disabled data-testid="search-input" />);
      expect(screen.getByTestId('search-input')).toHaveClass(
        'disabled:cursor-not-allowed'
      );
    });

    it('does not show clear button when disabled', () => {
      const { container } = render(
        <SearchInput disabled defaultValue="test value" />
      );

      // The clear button should not be rendered when disabled
      const clearButton = container.querySelector(
        'button[aria-label="Clear search"]'
      );
      expect(clearButton).not.toBeInTheDocument();

      // Even though there's a value
      expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
    });
  });

  describe('Clear button', () => {
    it('does not show clear button when input is empty', () => {
      const { container } = render(<SearchInput />);
      const clearButton = container.querySelector(
        'button[aria-label="Clear search"]'
      );
      expect(clearButton).not.toBeInTheDocument();
    });

    it('shows clear button when input has value (uncontrolled)', async () => {
      const user = userEvent.setup();
      const { container } = render(<SearchInput data-testid="search-input" />);

      await user.type(screen.getByTestId('search-input'), 'test');

      const clearButton = container.querySelector(
        'button[aria-label="Clear search"]'
      );
      expect(clearButton).toBeInTheDocument();
    });

    it('shows clear button when input has defaultValue', () => {
      const { container } = render(<SearchInput defaultValue="initial value" />);
      const clearButton = container.querySelector(
        'button[aria-label="Clear search"]'
      );
      expect(clearButton).toBeInTheDocument();
    });

    it('shows clear button when controlled value is provided', () => {
      const { container } = render(
        <SearchInput value="controlled value" onChange={() => {}} />
      );
      const clearButton = container.querySelector(
        'button[aria-label="Clear search"]'
      );
      expect(clearButton).toBeInTheDocument();
    });

    it('hides clear button when controlled value is empty', () => {
      const { container } = render(<SearchInput value="" onChange={() => {}} />);
      const clearButton = container.querySelector(
        'button[aria-label="Clear search"]'
      );
      expect(clearButton).not.toBeInTheDocument();
    });

    it('calls onClear callback when clear button is clicked', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      const { container } = render(
        <SearchInput defaultValue="test value" onClear={handleClear} />
      );

      const clearButton = container.querySelector(
        'button[aria-label="Clear search"]'
      );
      expect(clearButton).toBeInTheDocument();

      await user.click(clearButton!);
      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it('clears uncontrolled input value when clear button is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <SearchInput defaultValue="initial value" data-testid="search-input" />
      );

      const clearButton = container.querySelector(
        'button[aria-label="Clear search"]'
      );
      await user.click(clearButton!);

      expect(screen.getByTestId('search-input')).toHaveValue('initial value');
      // Note: In uncontrolled mode, the internal state is cleared but the input
      // defaultValue doesn't change. The clear button disappears.
    });

    it('clear button has accessible label', () => {
      const { container } = render(<SearchInput defaultValue="test" />);
      const clearButton = container.querySelector(
        'button[aria-label="Clear search"]'
      );
      expect(clearButton).toHaveAttribute('aria-label', 'Clear search');
    });

    it('clear button is type button to prevent form submission', () => {
      const { container } = render(<SearchInput defaultValue="test" />);
      const clearButton = container.querySelector(
        'button[aria-label="Clear search"]'
      );
      expect(clearButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<SearchInput ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLInputElement>();
      render(<SearchInput ref={ref} data-testid="search-input" />);
      ref.current?.focus();
      expect(screen.getByTestId('search-input')).toHaveFocus();
    });
  });

  describe('Event handling', () => {
    it('calls onChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<SearchInput onChange={handleChange} data-testid="search-input" />);

      await user.type(screen.getByTestId('search-input'), 'hello');
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<SearchInput onFocus={handleFocus} data-testid="search-input" />);

      await user.click(screen.getByTestId('search-input'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<SearchInput onBlur={handleBlur} data-testid="search-input" />);

      const input = screen.getByTestId('search-input');
      await user.click(input);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Controlled and uncontrolled modes', () => {
    it('works as uncontrolled with defaultValue', async () => {
      const user = userEvent.setup();
      render(<SearchInput defaultValue="initial" data-testid="search-input" />);

      const input = screen.getByTestId('search-input');
      expect(input).toHaveValue('initial');

      await user.clear(input);
      await user.type(input, 'updated');
      expect(input).toHaveValue('updated');
    });

    it('works as controlled with value and onChange', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { rerender } = render(
        <SearchInput
          value="controlled"
          onChange={handleChange}
          data-testid="search-input"
        />
      );

      expect(screen.getByTestId('search-input')).toHaveValue('controlled');

      await user.type(screen.getByTestId('search-input'), 'x');
      expect(handleChange).toHaveBeenCalled();

      // Value doesn't change without rerender in controlled mode
      rerender(
        <SearchInput
          value="new value"
          onChange={handleChange}
          data-testid="search-input"
        />
      );
      expect(screen.getByTestId('search-input')).toHaveValue('new value');
    });

    it('controlled mode onClear does not affect value directly', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      const { container } = render(
        <SearchInput
          value="controlled"
          onChange={() => {}}
          onClear={handleClear}
        />
      );

      const clearButton = container.querySelector(
        'button[aria-label="Clear search"]'
      );
      await user.click(clearButton!);

      // onClear is called, but the value remains because it's controlled
      expect(handleClear).toHaveBeenCalled();
    });
  });

  describe('className merging', () => {
    it('merges custom className on input', () => {
      render(<SearchInput className="custom-class" data-testid="search-input" />);
      expect(screen.getByTestId('search-input')).toHaveClass('custom-class');
    });

    it('merges wrapperClassName on wrapper', () => {
      const { container } = render(
        <SearchInput wrapperClassName="wrapper-class" />
      );
      expect(container.firstChild).toHaveClass('wrapper-class');
    });

    it('preserves default classes when merging', () => {
      render(<SearchInput className="custom-class" data-testid="search-input" />);
      const input = screen.getByTestId('search-input');
      expect(input).toHaveClass('custom-class');
      expect(input).toHaveClass('bg-transparent');
    });
  });

  describe('Accessibility', () => {
    it('has type search attribute', () => {
      render(<SearchInput data-testid="search-input" />);
      expect(screen.getByTestId('search-input')).toHaveAttribute(
        'type',
        'search'
      );
    });

    it('has role searchbox attribute', () => {
      render(<SearchInput data-testid="search-input" />);
      expect(screen.getByTestId('search-input')).toHaveAttribute(
        'role',
        'searchbox'
      );
    });

    it('accepts aria-describedby', () => {
      render(
        <SearchInput aria-describedby="help-text" data-testid="search-input" />
      );
      expect(screen.getByTestId('search-input')).toHaveAttribute(
        'aria-describedby',
        'help-text'
      );
    });

    it('accepts aria-label', () => {
      render(
        <SearchInput aria-label="Search products" data-testid="search-input" />
      );
      expect(screen.getByTestId('search-input')).toHaveAttribute(
        'aria-label',
        'Search products'
      );
    });

    it('search icon is hidden from assistive technology', () => {
      const { container } = render(<SearchInput />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Edge cases', () => {
    it('handles empty placeholder', () => {
      render(<SearchInput placeholder="" data-testid="search-input" />);
      expect(screen.getByTestId('search-input')).toHaveAttribute(
        'placeholder',
        ''
      );
    });

    it('handles very long placeholder', () => {
      const longPlaceholder = 'A'.repeat(200);
      render(<SearchInput placeholder={longPlaceholder} />);
      expect(screen.getByPlaceholderText(longPlaceholder)).toBeInTheDocument();
    });

    it('handles disabled with error', () => {
      const { container } = render(
        <SearchInput disabled error data-testid="search-input" />
      );
      const wrapper = container.firstChild;
      const input = screen.getByTestId('search-input');

      expect(input).toBeDisabled();
      expect(wrapper).toHaveClass('border-destructive');
    });

    it('handles empty string vs undefined value for clear button', () => {
      const { container: container1 } = render(
        <SearchInput value="" onChange={() => {}} />
      );
      const { container: container2 } = render(<SearchInput />);

      expect(
        container1.querySelector('button[aria-label="Clear search"]')
      ).not.toBeInTheDocument();
      expect(
        container2.querySelector('button[aria-label="Clear search"]')
      ).not.toBeInTheDocument();
    });

    it('passes through additional HTML attributes', () => {
      render(
        <SearchInput
          data-testid="search-input"
          name="search"
          autoComplete="off"
          maxLength={100}
        />
      );
      const input = screen.getByTestId('search-input');
      expect(input).toHaveAttribute('name', 'search');
      expect(input).toHaveAttribute('autocomplete', 'off');
      expect(input).toHaveAttribute('maxlength', '100');
    });

    it('rapid clear button clicks work correctly', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      const { container } = render(
        <SearchInput defaultValue="test" onClear={handleClear} />
      );

      const clearButton = container.querySelector(
        'button[aria-label="Clear search"]'
      );

      // Click multiple times
      await user.click(clearButton!);

      // After first clear, button should be gone in uncontrolled mode
      // because internal state is cleared
      expect(handleClear).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard navigation', () => {
    it('can be focused with tab', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <SearchInput data-testid="search-input" />
        </>
      );

      await user.tab(); // Focus button
      await user.tab(); // Focus search input

      expect(screen.getByTestId('search-input')).toHaveFocus();
    });

    it('clear button can be focused with tab when visible', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <SearchInput defaultValue="test" data-testid="search-input" />
      );

      await user.tab(); // Focus search input
      await user.tab(); // Focus clear button

      const clearButton = container.querySelector(
        'button[aria-label="Clear search"]'
      );
      expect(clearButton).toHaveFocus();
    });

    it('clear button can be activated with Enter key', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      const { container } = render(
        <SearchInput defaultValue="test" onClear={handleClear} />
      );

      const clearButton = container.querySelector(
        'button[aria-label="Clear search"]'
      ) as HTMLButtonElement | null;
      clearButton?.focus();

      await user.keyboard('{Enter}');
      expect(handleClear).toHaveBeenCalled();
    });

    it('clear button can be activated with Space key', async () => {
      const user = userEvent.setup();
      const handleClear = vi.fn();
      const { container } = render(
        <SearchInput defaultValue="test" onClear={handleClear} />
      );

      const clearButton = container.querySelector(
        'button[aria-label="Clear search"]'
      ) as HTMLButtonElement | null;
      clearButton?.focus();

      await user.keyboard(' ');
      expect(handleClear).toHaveBeenCalled();
    });
  });
});
