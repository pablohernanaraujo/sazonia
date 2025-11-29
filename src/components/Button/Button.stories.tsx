import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';

import { Button } from './Button';

/**
 * The Button component is a basic interactive element that allows users
 * to trigger actions. It supports disabled state and custom click handlers.
 *
 * ## Accessibility
 *
 * - Uses native `<button>` element for built-in keyboard support
 * - Supports `disabled` attribute for indicating non-interactive state
 * - Receives focus in tab order when not disabled
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'The content to display inside the button',
      control: 'text',
    },
    disabled: {
      description: 'Whether the button is disabled',
      control: 'boolean',
    },
    onClick: {
      description: 'Callback function when the button is clicked',
      action: 'clicked',
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button state with basic text content.
 */
export const Default: Story = {
  args: {
    children: 'Click me',
  },
};

/**
 * Disabled button that cannot be interacted with.
 * The button will not respond to click events when disabled.
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

/**
 * Button with click handler demonstration.
 * Click the button to see the action logged in the Actions panel.
 */
export const WithOnClick: Story = {
  args: {
    children: 'Click to see action',
    onClick: fn(),
  },
};
