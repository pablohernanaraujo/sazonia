import '../src/app/globals.css';

import React from 'react';
import type { Preview, ReactRenderer } from '@storybook/react';
import type { DecoratorFunction } from 'storybook/internal/types';

/**
 * Font decorator that applies Geist font CSS variables
 * Mimics the font configuration from src/app/layout.tsx
 */
const withFonts: DecoratorFunction<ReactRenderer> = (Story) => (
  <div
    style={{
      fontFamily: 'var(--font-geist-sans, ui-sans-serif, system-ui, sans-serif)',
    }}
  >
    <Story />
  </div>
);

const preview: Preview = {
  decorators: [withFonts],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
        },
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
