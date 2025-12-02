import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InputDropmenuSearch } from '../input-dropmenu-search';

describe('InputDropmenuSearch', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<InputDropmenuSearch placeholder="Search" />);
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    it('renders as input element', () => {
      render(<InputDropmenuSearch data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input.tagName).toBe('INPUT');
    });

    it('renders with placeholder', () => {
      render(<InputDropmenuSearch placeholder="Search options..." />);
      expect(
        screen.getByPlaceholderText('Search options...')
      ).toBeInTheDocument();
    });

    it('renders with value', () => {
      render(<InputDropmenuSearch defaultValue="United States" />);
      expect(screen.getByDisplayValue('United States')).toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('applies LG size by default', () => {
      render(<InputDropmenuSearch data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('text-base', 'leading-6');
    });

    it('applies SM size variant', () => {
      render(<InputDropmenuSearch size="sm" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('text-sm', 'leading-5');
    });

    it('applies MD size variant', () => {
      render(<InputDropmenuSearch size="md" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('text-sm', 'leading-5');
    });

    it('applies LG size variant explicitly', () => {
      render(<InputDropmenuSearch size="lg" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('text-base', 'leading-6');
    });

    it('wrapper has correct padding for SM size', () => {
      const { container } = render(<InputDropmenuSearch size="sm" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('py-2', 'px-3', 'gap-2.5');
    });

    it('wrapper has correct padding for MD size', () => {
      const { container } = render(<InputDropmenuSearch size="md" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('py-2', 'px-3', 'gap-3');
    });

    it('wrapper has correct padding for LG size', () => {
      const { container } = render(<InputDropmenuSearch size="lg" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('py-3', 'px-4', 'gap-3');
    });

    it('wrapper has bottom border only', () => {
      const { container } = render(<InputDropmenuSearch />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('border-b', 'border-border-secondary');
    });
  });

  describe('Search icon', () => {
    it('shows search icon by default', () => {
      const { container } = render(<InputDropmenuSearch />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('hides search icon when showIcon=false', () => {
      const { container } = render(<InputDropmenuSearch showIcon={false} />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });

    it('icon has correct size based on component size (all use sm)', () => {
      const { container } = render(<InputDropmenuSearch size="lg" />);
      const svg = container.querySelector('svg');
      // Icon component with size="sm" renders with size-4 (16px)
      expect(svg).toHaveClass('size-4');
    });

    it('icon has muted color styling', () => {
      const { container } = render(<InputDropmenuSearch />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-text-secondary');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<InputDropmenuSearch ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('ref allows focus programmatically', () => {
      const ref = createRef<HTMLInputElement>();
      render(<InputDropmenuSearch ref={ref} data-testid="input" />);
      ref.current?.focus();
      expect(screen.getByTestId('input')).toHaveFocus();
    });
  });

  describe('Event handling', () => {
    it('calls onChange when value changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<InputDropmenuSearch onChange={handleChange} data-testid="input" />);

      await user.type(screen.getByTestId('input'), 'hello');
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<InputDropmenuSearch onFocus={handleFocus} data-testid="input" />);

      await user.click(screen.getByTestId('input'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<InputDropmenuSearch onBlur={handleBlur} data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('calls onKeyDown for keyboard events', async () => {
      const user = userEvent.setup();
      const handleKeyDown = vi.fn();
      render(
        <InputDropmenuSearch onKeyDown={handleKeyDown} data-testid="input" />
      );

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('{Enter}');
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe('Controlled and uncontrolled modes', () => {
    it('works as uncontrolled with defaultValue', async () => {
      const user = userEvent.setup();
      render(<InputDropmenuSearch defaultValue="initial" data-testid="input" />);

      const input = screen.getByTestId('input');
      expect(input).toHaveValue('initial');

      await user.clear(input);
      await user.type(input, 'updated');
      expect(input).toHaveValue('updated');
    });

    it('works as controlled with value and onChange', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      const { rerender } = render(
        <InputDropmenuSearch
          value="controlled"
          onChange={handleChange}
          data-testid="input"
        />
      );

      expect(screen.getByTestId('input')).toHaveValue('controlled');

      await user.type(screen.getByTestId('input'), 'x');
      expect(handleChange).toHaveBeenCalled();

      // Value doesn't change without rerender in controlled mode
      rerender(
        <InputDropmenuSearch
          value="new value"
          onChange={handleChange}
          data-testid="input"
        />
      );
      expect(screen.getByTestId('input')).toHaveValue('new value');
    });
  });

  describe('className merging', () => {
    it('merges custom className on input', () => {
      render(
        <InputDropmenuSearch className="custom-class" data-testid="input" />
      );
      expect(screen.getByTestId('input')).toHaveClass('custom-class');
    });

    it('merges wrapperClassName on wrapper', () => {
      const { container } = render(
        <InputDropmenuSearch wrapperClassName="wrapper-class" />
      );
      expect(container.firstChild).toHaveClass('wrapper-class');
    });

    it('preserves default classes when merging', () => {
      render(
        <InputDropmenuSearch className="custom-class" data-testid="input" />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('custom-class');
      expect(input).toHaveClass('bg-transparent');
    });
  });

  describe('Accessibility', () => {
    it('has type="search" on input element', () => {
      render(<InputDropmenuSearch data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'search');
    });

    it('has role="searchbox" on input element', () => {
      render(<InputDropmenuSearch data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('role', 'searchbox');
    });

    it('accepts and applies aria-label', () => {
      render(
        <InputDropmenuSearch aria-label="Search countries" data-testid="input" />
      );
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-label',
        'Search countries'
      );
    });

    it('accepts aria-describedby', () => {
      render(
        <InputDropmenuSearch aria-describedby="help-text" data-testid="input" />
      );
      expect(screen.getByTestId('input')).toHaveAttribute(
        'aria-describedby',
        'help-text'
      );
    });

    it('icon has aria-hidden={true} (decorative)', () => {
      const { container } = render(<InputDropmenuSearch />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Edge cases', () => {
    it('handles empty placeholder string', () => {
      render(<InputDropmenuSearch placeholder="" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('placeholder', '');
    });

    it('handles very long placeholder text', () => {
      const longPlaceholder = 'A'.repeat(200);
      render(<InputDropmenuSearch placeholder={longPlaceholder} />);
      expect(screen.getByPlaceholderText(longPlaceholder)).toBeInTheDocument();
    });

    it('handles very long input value', async () => {
      const user = userEvent.setup();
      const longValue = 'A'.repeat(200);
      render(<InputDropmenuSearch data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.type(input, longValue);
      expect(input).toHaveValue(longValue);
    });

    it('handles special characters in value', async () => {
      const user = userEvent.setup();
      render(<InputDropmenuSearch data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.type(input, '<script>alert("xss")</script>');
      expect(input).toHaveValue('<script>alert("xss")</script>');
    });

    it('passes through additional HTML attributes', () => {
      render(
        <InputDropmenuSearch
          data-testid="input"
          name="search"
          autoComplete="off"
          maxLength={100}
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('name', 'search');
      expect(input).toHaveAttribute('autocomplete', 'off');
      expect(input).toHaveAttribute('maxlength', '100');
    });

    it('component has correct structure with icon', () => {
      const { container } = render(
        <InputDropmenuSearch placeholder="Search" data-testid="input" />
      );
      const wrapper = container.firstChild;
      const children = wrapper?.childNodes;

      // Should have icon and input
      expect(children?.length).toBe(2);
    });

    it('component has correct structure without icon', () => {
      const { container } = render(
        <InputDropmenuSearch
          showIcon={false}
          placeholder="Search"
          data-testid="input"
        />
      );
      const wrapper = container.firstChild;
      const children = wrapper?.childNodes;

      // Should have only input
      expect(children?.length).toBe(1);
    });
  });
});
