import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { InputLabel } from '../input-label';

describe('InputLabel', () => {
  describe('Rendering', () => {
    it('renders with required label prop', () => {
      render(<InputLabel label="Email address" />);
      expect(screen.getByText('Email address')).toBeInTheDocument();
    });

    it('renders as label element', () => {
      render(<InputLabel label="Email" />);
      const labelElement = screen.getByText('Email').closest('label');
      expect(labelElement).toBeInTheDocument();
      expect(labelElement?.tagName).toBe('LABEL');
    });

    it('renders empty container when label is empty string', () => {
      render(<InputLabel label="" data-testid="empty-label" />);
      const labelElement = document.querySelector('label');
      expect(labelElement).toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('applies MD size by default', () => {
      render(<InputLabel label="Email" />);
      const labelElement = screen.getByText('Email').closest('label');
      expect(labelElement).toHaveClass('pb-3');
    });

    it('applies SM size variant', () => {
      render(<InputLabel label="Email" size="sm" />);
      const labelElement = screen.getByText('Email').closest('label');
      expect(labelElement).toHaveClass('pb-2.5');
    });

    it('applies MD size variant explicitly', () => {
      render(<InputLabel label="Email" size="md" />);
      const labelElement = screen.getByText('Email').closest('label');
      expect(labelElement).toHaveClass('pb-3');
    });

    it('applies correct typography for SM size', () => {
      render(<InputLabel label="Email" size="sm" />);
      const textSpan = screen.getByText('Email');
      expect(textSpan).toHaveClass('text-sm', 'leading-5');
    });

    it('applies correct typography for MD size', () => {
      render(<InputLabel label="Email" size="md" />);
      const textSpan = screen.getByText('Email');
      expect(textSpan).toHaveClass('text-base', 'leading-6');
    });
  });

  describe('Required indicator', () => {
    it('hides asterisk by default (required=false)', () => {
      render(<InputLabel label="Email" />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('shows asterisk when required=true', () => {
      render(<InputLabel label="Email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('asterisk has destructive color class', () => {
      render(<InputLabel label="Email" required />);
      const asterisk = screen.getByText('*');
      expect(asterisk).toHaveClass('text-destructive');
    });

    it('asterisk is hidden from screen readers', () => {
      render(<InputLabel label="Email" required />);
      const asterisk = screen.getByText('*');
      expect(asterisk).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Help icon', () => {
    it('hides icon by default (showIcon=false)', () => {
      render(<InputLabel label="Email" />);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('shows icon when showIcon=true', () => {
      render(<InputLabel label="Email" showIcon />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('icon has default aria-label "Help for {label}"', () => {
      render(<InputLabel label="Email" showIcon />);
      expect(screen.getByRole('img')).toHaveAttribute(
        'aria-label',
        'Help for Email'
      );
    });

    it('icon uses custom aria-label when helpIconAriaLabel is provided', () => {
      render(
        <InputLabel
          label="Email"
          showIcon
          helpIconAriaLabel="Email format requirements"
        />
      );
      expect(screen.getByRole('img')).toHaveAttribute(
        'aria-label',
        'Email format requirements'
      );
    });
  });

  describe('Description', () => {
    it('hides description container when not provided', () => {
      render(<InputLabel label="Email" htmlFor="email" />);
      expect(screen.queryByText(/must be|never share/i)).not.toBeInTheDocument();
    });

    it('shows description when provided', () => {
      render(
        <InputLabel
          label="Email"
          description="We'll never share your email"
          htmlFor="email"
        />
      );
      expect(
        screen.getByText("We'll never share your email")
      ).toBeInTheDocument();
    });

    it('description has muted color', () => {
      render(
        <InputLabel label="Email" description="Help text" htmlFor="email" />
      );
      const description = screen.getByText('Help text');
      expect(description).toHaveClass('text-text-secondary');
    });

    it('description has correct ID for aria-describedby pattern', () => {
      render(
        <InputLabel label="Email" description="Help text" htmlFor="email" />
      );
      const description = screen.getByText('Help text');
      expect(description).toHaveAttribute('id', 'email-description');
    });

    it('description ID is undefined when htmlFor is not provided', () => {
      render(<InputLabel label="Email" description="Help text" />);
      const description = screen.getByText('Help text');
      expect(description).not.toHaveAttribute('id');
    });
  });

  describe('Accessibility', () => {
    it('htmlFor prop is passed to label element', () => {
      render(<InputLabel label="Email" htmlFor="email-input" />);
      const labelElement = screen.getByText('Email').closest('label');
      expect(labelElement).toHaveAttribute('for', 'email-input');
    });

    it('can associate with input by id', () => {
      render(
        <>
          <InputLabel label="Email" htmlFor="email-input" />
          <input id="email-input" type="email" />
        </>
      );
      const input = screen.getByRole('textbox');
      const labelElement = screen.getByText('Email').closest('label');
      expect(labelElement).toHaveAttribute('for', 'email-input');
      expect(input).toHaveAttribute('id', 'email-input');
    });
  });

  describe('Composition', () => {
    it('merges custom className correctly', () => {
      render(<InputLabel label="Email" className="custom-class mt-4" />);
      const labelElement = screen.getByText('Email').closest('label');
      expect(labelElement).toHaveClass('custom-class', 'mt-4');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<InputLabel label="Email" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });
  });

  describe('Edge cases', () => {
    it('handles very long label text', () => {
      const longLabel = 'A'.repeat(200);
      render(<InputLabel label={longLabel} />);
      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it('handles very long description text', () => {
      const longDescription = 'B'.repeat(500);
      render(
        <InputLabel label="Email" description={longDescription} htmlFor="email" />
      );
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it('renders with all props enabled', () => {
      render(
        <InputLabel
          size="sm"
          label="Email"
          required
          showIcon
          helpIconAriaLabel="Custom help"
          description="Description text"
          htmlFor="email-input"
          className="custom-class"
        />
      );

      // Label text
      expect(screen.getByText('Email')).toBeInTheDocument();
      // Required asterisk
      expect(screen.getByText('*')).toBeInTheDocument();
      // Help icon
      expect(screen.getByRole('img')).toHaveAttribute(
        'aria-label',
        'Custom help'
      );
      // Description
      expect(screen.getByText('Description text')).toBeInTheDocument();
      // htmlFor
      const labelElement = screen.getByText('Email').closest('label');
      expect(labelElement).toHaveAttribute('for', 'email-input');
      // className
      expect(labelElement).toHaveClass('custom-class');
      // Size
      expect(labelElement).toHaveClass('pb-2.5');
    });

    it('renders with only required label prop', () => {
      render(<InputLabel label="Minimal" />);
      const labelElement = screen.getByText('Minimal').closest('label');
      expect(labelElement).toBeInTheDocument();
      expect(screen.queryByText('*')).not.toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });
});
