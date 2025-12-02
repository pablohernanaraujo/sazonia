import React from 'react';
import {
  Calendar,
  ChartLine,
  GridFour,
  List,
  ListBullets,
  Rows,
  SquaresFour,
  Table,
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ButtonGroup, ButtonGroupItem } from '@/ui/buttons';

/**
 * ButtonGroup is a container component that groups multiple `ButtonGroupItem`
 * components into a cohesive segmented control. It automatically handles:
 *
 * - **Position detection**: First, middle, last, or only
 * - **Border overlap**: Proper `-ml-px` classes for seamless borders
 * - **Size cascading**: Pass size once to apply to all children
 * - **Width behavior**: Hug content (default) or fill container
 *
 * ## Features
 * - **3 Size Variants**: sm (32px), md (40px), lg (48px)
 * - **2 Width Modes**: hug=true (content width), hug=false (full width)
 * - **Automatic positioning**: No need to manually set position props
 * - **Size inheritance**: Group size applies to all children unless overridden
 *
 * ## Accessibility
 * - Use `role="group"` for generic grouping (default)
 * - Use `role="radiogroup"` for mutually exclusive selections
 * - Use `role="toolbar"` for editor toolbars
 * - Always provide `aria-label` for screen readers
 */
const meta = {
  title: 'Buttons/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      description: 'Size variant for all items in the group',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'undefined' },
      },
    },
    hug: {
      description: 'Whether to hug content (true) or fill container (false)',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    role: {
      description: 'ARIA role for the group container',
      control: 'select',
      options: ['group', 'radiogroup', 'toolbar'],
      table: {
        defaultValue: { summary: 'group' },
      },
    },
    'aria-label': {
      description: 'Accessible label for the group (required for screen readers)',
      control: 'text',
    },
    orientation: {
      description: 'Orientation hint (currently only horizontal is supported)',
      control: 'select',
      options: ['horizontal', 'vertical'],
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    className: {
      description: 'Additional CSS classes for the container',
      control: 'text',
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default ButtonGroup with three options.
 * Position is automatically detected and applied.
 */
export const Default: Story = {
  args: {
    'aria-label': 'Alignment options',
    children: null as unknown as React.ReactNode, // Placeholder for Storybook
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem>Left</ButtonGroupItem>
      <ButtonGroupItem>Center</ButtonGroupItem>
      <ButtonGroupItem>Right</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * All size variants displayed together: sm (32px), md (40px), lg (48px).
 * Size is passed to ButtonGroup and cascades to all children.
 */
export const AllSizes: Story = {
  args: {
    'aria-label': 'Size demo',
    children: null as unknown as React.ReactNode,
  },
  render: () => (
    <div className="flex flex-col items-start gap-8">
      <div>
        <p className="mb-2 text-sm text-text-subtle">Small (32px)</p>
        <ButtonGroup size="sm" aria-label="Small size options">
          <ButtonGroupItem>One</ButtonGroupItem>
          <ButtonGroupItem>Two</ButtonGroupItem>
          <ButtonGroupItem>Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-subtle">Medium (40px) - Default</p>
        <ButtonGroup size="md" aria-label="Medium size options">
          <ButtonGroupItem>One</ButtonGroupItem>
          <ButtonGroupItem>Two</ButtonGroupItem>
          <ButtonGroupItem>Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-subtle">Large (48px)</p>
        <ButtonGroup size="lg" aria-label="Large size options">
          <ButtonGroupItem>One</ButtonGroupItem>
          <ButtonGroupItem>Two</ButtonGroupItem>
          <ButtonGroupItem>Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
    </div>
  ),
};

/**
 * Demonstrates the hug prop behavior:
 * - `hug=true` (default): Group hugs its content (inline-flex)
 * - `hug=false`: Group fills container width, children distributed equally
 */
export const HugBehavior: Story = {
  args: {
    'aria-label': 'Hug behavior demo',
    children: null as unknown as React.ReactNode,
  },
  render: () => (
    <div className="w-[500px] space-y-8">
      <div>
        <p className="mb-2 text-sm text-text-subtle">
          hug=true (default) - Content width
        </p>
        <div className="rounded-sm border border-dashed border-border p-4">
          <ButtonGroup hug aria-label="Hug true options">
            <ButtonGroupItem>Option A</ButtonGroupItem>
            <ButtonGroupItem>Option B</ButtonGroupItem>
            <ButtonGroupItem>Option C</ButtonGroupItem>
          </ButtonGroup>
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-subtle">
          hug=false - Full width, equal distribution
        </p>
        <div className="rounded-sm border border-dashed border-border p-4">
          <ButtonGroup hug={false} aria-label="Hug false options">
            <ButtonGroupItem>Option A</ButtonGroupItem>
            <ButtonGroupItem>Option B</ButtonGroupItem>
            <ButtonGroupItem>Option C</ButtonGroupItem>
          </ButtonGroup>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * ButtonGroup with icon+text items.
 */
export const WithIcons: Story = {
  args: {
    'aria-label': 'View options',
    children: null as unknown as React.ReactNode,
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem leftIcon={List}>List</ButtonGroupItem>
      <ButtonGroupItem leftIcon={GridFour}>Grid</ButtonGroupItem>
      <ButtonGroupItem leftIcon={Table}>Table</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * ButtonGroup with icon-only items.
 * Each item requires an `aria-label` for accessibility.
 */
export const IconOnly: Story = {
  args: {
    'aria-label': 'View mode',
    children: null as unknown as React.ReactNode,
  },
  render: (args) => (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm text-text-subtle">Small</p>
        <ButtonGroup {...args} size="sm">
          <ButtonGroupItem leftIcon={ListBullets} aria-label="List view" />
          <ButtonGroupItem leftIcon={SquaresFour} aria-label="Grid view" />
          <ButtonGroupItem leftIcon={Rows} aria-label="Row view" />
        </ButtonGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-subtle">Medium</p>
        <ButtonGroup {...args} size="md">
          <ButtonGroupItem leftIcon={ListBullets} aria-label="List view" />
          <ButtonGroupItem leftIcon={SquaresFour} aria-label="Grid view" />
          <ButtonGroupItem leftIcon={Rows} aria-label="Row view" />
        </ButtonGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-subtle">Large</p>
        <ButtonGroup {...args} size="lg">
          <ButtonGroupItem leftIcon={ListBullets} aria-label="List view" />
          <ButtonGroupItem leftIcon={SquaresFour} aria-label="Grid view" />
          <ButtonGroupItem leftIcon={Rows} aria-label="Row view" />
        </ButtonGroup>
      </div>
    </div>
  ),
};

/**
 * Demonstrates selection state within a ButtonGroup.
 * Selection is controlled via the `selected` prop on individual items.
 */
export const SelectedState: Story = {
  args: {
    'aria-label': 'Selection demo',
    children: null as unknown as React.ReactNode,
  },
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm text-text-subtle">First item selected</p>
        <ButtonGroup aria-label="View options">
          <ButtonGroupItem selected>List</ButtonGroupItem>
          <ButtonGroupItem>Grid</ButtonGroupItem>
          <ButtonGroupItem>Table</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-subtle">Middle item selected</p>
        <ButtonGroup aria-label="View options">
          <ButtonGroupItem>List</ButtonGroupItem>
          <ButtonGroupItem selected>Grid</ButtonGroupItem>
          <ButtonGroupItem>Table</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-subtle">Last item selected</p>
        <ButtonGroup aria-label="View options">
          <ButtonGroupItem>List</ButtonGroupItem>
          <ButtonGroupItem>Grid</ButtonGroupItem>
          <ButtonGroupItem selected>Table</ButtonGroupItem>
        </ButtonGroup>
      </div>
    </div>
  ),
};

/**
 * Shows disabled items within a ButtonGroup.
 * Disabled items have reduced opacity and no interaction.
 */
export const DisabledState: Story = {
  args: {
    'aria-label': 'Disabled demo',
    children: null as unknown as React.ReactNode,
  },
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm text-text-subtle">Individual item disabled</p>
        <ButtonGroup aria-label="Options">
          <ButtonGroupItem>Available</ButtonGroupItem>
          <ButtonGroupItem disabled>Disabled</ButtonGroupItem>
          <ButtonGroupItem>Available</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-subtle">
          Selected + Disabled (e.g., current value in read-only mode)
        </p>
        <ButtonGroup aria-label="Read-only options">
          <ButtonGroupItem disabled>Option A</ButtonGroupItem>
          <ButtonGroupItem selected disabled>
            Current
          </ButtonGroupItem>
          <ButtonGroupItem disabled>Option C</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-subtle">With icons</p>
        <ButtonGroup aria-label="View mode">
          <ButtonGroupItem leftIcon={List} disabled>
            List
          </ButtonGroupItem>
          <ButtonGroupItem leftIcon={GridFour} selected>
            Grid
          </ButtonGroupItem>
          <ButtonGroupItem leftIcon={Table}>Table</ButtonGroupItem>
        </ButtonGroup>
      </div>
    </div>
  ),
};

/**
 * Common pattern: binary toggle with two options.
 * Position is automatically set to "first" and "last".
 */
export const TwoOptions: Story = {
  args: {
    'aria-label': 'Binary toggle',
    children: null as unknown as React.ReactNode,
  },
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm text-text-subtle">Yes/No toggle</p>
        <ButtonGroup aria-label="Confirmation">
          <ButtonGroupItem selected>Yes</ButtonGroupItem>
          <ButtonGroupItem>No</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-subtle">View toggle</p>
        <ButtonGroup aria-label="View mode">
          <ButtonGroupItem leftIcon={ListBullets} aria-label="List view" />
          <ButtonGroupItem
            leftIcon={SquaresFour}
            aria-label="Grid view"
            selected
          />
        </ButtonGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-subtle">Labeled view toggle</p>
        <ButtonGroup aria-label="View mode">
          <ButtonGroupItem leftIcon={List} selected>
            List
          </ButtonGroupItem>
          <ButtonGroupItem leftIcon={GridFour}>Grid</ButtonGroupItem>
        </ButtonGroup>
      </div>
    </div>
  ),
};

/**
 * Shows a ButtonGroup with four options.
 * Middle items automatically receive proper positioning.
 */
export const FourOptions: Story = {
  args: {
    'aria-label': 'Multiple options',
    children: null as unknown as React.ReactNode,
  },
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm text-text-subtle">Text alignment</p>
        <ButtonGroup role="toolbar" aria-label="Text alignment">
          <ButtonGroupItem
            leftIcon={TextAlignLeft}
            aria-label="Align left"
            selected
          />
          <ButtonGroupItem leftIcon={TextAlignCenter} aria-label="Align center" />
          <ButtonGroupItem leftIcon={TextAlignRight} aria-label="Align right" />
          <ButtonGroupItem leftIcon={TextAlignJustify} aria-label="Justify" />
        </ButtonGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-subtle">Four labeled options</p>
        <ButtonGroup aria-label="Quarter selection">
          <ButtonGroupItem>Q1</ButtonGroupItem>
          <ButtonGroupItem selected>Q2</ButtonGroupItem>
          <ButtonGroupItem>Q3</ButtonGroupItem>
          <ButtonGroupItem>Q4</ButtonGroupItem>
        </ButtonGroup>
      </div>
    </div>
  ),
};

/**
 * Real-world example: text formatting toolbar.
 * Uses `role="toolbar"` for proper accessibility semantics.
 */
export const RealWorldToolbar: Story = {
  args: {
    role: 'toolbar',
    'aria-label': 'Text formatting',
    children: null as unknown as React.ReactNode,
  },
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm text-text-subtle">Text alignment toolbar</p>
        <ButtonGroup role="toolbar" aria-label="Text alignment">
          <ButtonGroupItem
            leftIcon={TextAlignLeft}
            aria-label="Align left"
            selected
          />
          <ButtonGroupItem leftIcon={TextAlignCenter} aria-label="Align center" />
          <ButtonGroupItem leftIcon={TextAlignRight} aria-label="Align right" />
          <ButtonGroupItem leftIcon={TextAlignJustify} aria-label="Justify" />
        </ButtonGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-subtle">With labels</p>
        <ButtonGroup role="toolbar" aria-label="Text alignment">
          <ButtonGroupItem leftIcon={TextAlignLeft} selected>
            Left
          </ButtonGroupItem>
          <ButtonGroupItem leftIcon={TextAlignCenter}>Center</ButtonGroupItem>
          <ButtonGroupItem leftIcon={TextAlignRight}>Right</ButtonGroupItem>
        </ButtonGroup>
      </div>
    </div>
  ),
};

/**
 * Real-world example: view mode toggle (list/grid/table).
 * Common pattern in data-heavy applications.
 */
export const RealWorldViewToggle: Story = {
  args: {
    'aria-label': 'View mode',
    children: null as unknown as React.ReactNode,
  },
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm text-text-subtle">Icon-only view toggle</p>
        <ButtonGroup aria-label="View mode">
          <ButtonGroupItem leftIcon={ListBullets} aria-label="List view" />
          <ButtonGroupItem
            leftIcon={SquaresFour}
            aria-label="Grid view"
            selected
          />
        </ButtonGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-subtle">Data view options</p>
        <ButtonGroup aria-label="Data view">
          <ButtonGroupItem leftIcon={Table} selected>
            Table
          </ButtonGroupItem>
          <ButtonGroupItem leftIcon={ChartLine}>Chart</ButtonGroupItem>
          <ButtonGroupItem leftIcon={Calendar}>Calendar</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-text-subtle">Full-width view toggle</p>
        <div className="w-[400px]">
          <ButtonGroup hug={false} aria-label="View mode">
            <ButtonGroupItem leftIcon={List}>List</ButtonGroupItem>
            <ButtonGroupItem leftIcon={GridFour} selected>
              Grid
            </ButtonGroupItem>
            <ButtonGroupItem leftIcon={Table}>Table</ButtonGroupItem>
          </ButtonGroup>
        </div>
      </div>
    </div>
  ),
};

/**
 * Interactive component demonstrating stateful selection.
 */
function LiveInteractionDemo(): React.ReactElement {
  const [selected, setSelected] = React.useState('grid');

  return (
    <div className="space-y-4">
      <ButtonGroup aria-label="View options">
        <ButtonGroupItem
          leftIcon={List}
          selected={selected === 'list'}
          onClick={() => setSelected('list')}
        >
          List
        </ButtonGroupItem>
        <ButtonGroupItem
          leftIcon={GridFour}
          selected={selected === 'grid'}
          onClick={() => setSelected('grid')}
        >
          Grid
        </ButtonGroupItem>
        <ButtonGroupItem
          leftIcon={Table}
          selected={selected === 'table'}
          onClick={() => setSelected('table')}
        >
          Table
        </ButtonGroupItem>
      </ButtonGroup>
      <p className="text-sm text-text-subtle">
        Current view: <strong className="capitalize">{selected}</strong>
      </p>
    </div>
  );
}

/**
 * Interactive demo with state management.
 * Click items to see selection state change in real-time.
 */
export const LiveInteraction: Story = {
  args: {
    'aria-label': 'Live interaction demo',
    children: null as unknown as React.ReactNode,
  },
  render: () => <LiveInteractionDemo />,
};

/**
 * Complete matrix showing all size and state combinations.
 * Useful for visual regression testing and design review.
 */
export const CompleteMatrix: Story = {
  args: {
    'aria-label': 'Complete matrix',
    children: null as unknown as React.ReactNode,
  },
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div className="space-y-12">
      {/* Sizes */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">All Sizes</h3>
        <div className="flex flex-wrap items-end gap-8">
          <div>
            <p className="mb-2 text-sm text-text-subtle">Small (32px)</p>
            <ButtonGroup size="sm" aria-label="Small options">
              <ButtonGroupItem>One</ButtonGroupItem>
              <ButtonGroupItem selected>Two</ButtonGroupItem>
              <ButtonGroupItem>Three</ButtonGroupItem>
            </ButtonGroup>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Medium (40px)</p>
            <ButtonGroup size="md" aria-label="Medium options">
              <ButtonGroupItem>One</ButtonGroupItem>
              <ButtonGroupItem selected>Two</ButtonGroupItem>
              <ButtonGroupItem>Three</ButtonGroupItem>
            </ButtonGroup>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Large (48px)</p>
            <ButtonGroup size="lg" aria-label="Large options">
              <ButtonGroupItem>One</ButtonGroupItem>
              <ButtonGroupItem selected>Two</ButtonGroupItem>
              <ButtonGroupItem>Three</ButtonGroupItem>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* Width modes */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Width Modes</h3>
        <div className="w-[500px] space-y-4">
          <div>
            <p className="mb-2 text-sm text-text-subtle">
              hug=true (content width)
            </p>
            <div className="rounded-sm border border-dashed border-border p-2">
              <ButtonGroup hug aria-label="Hug true">
                <ButtonGroupItem selected>Short</ButtonGroupItem>
                <ButtonGroupItem>Medium Text</ButtonGroupItem>
                <ButtonGroupItem>Longer Option</ButtonGroupItem>
              </ButtonGroup>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">
              hug=false (full width)
            </p>
            <div className="rounded-sm border border-dashed border-border p-2">
              <ButtonGroup hug={false} aria-label="Hug false">
                <ButtonGroupItem selected>Short</ButtonGroupItem>
                <ButtonGroupItem>Medium Text</ButtonGroupItem>
                <ButtonGroupItem>Longer Option</ButtonGroupItem>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </section>

      {/* States */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">States</h3>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="mb-2 text-sm text-text-subtle">Default</p>
            <ButtonGroup aria-label="Default state">
              <ButtonGroupItem>One</ButtonGroupItem>
              <ButtonGroupItem>Two</ButtonGroupItem>
              <ButtonGroupItem>Three</ButtonGroupItem>
            </ButtonGroup>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">With selection</p>
            <ButtonGroup aria-label="With selection">
              <ButtonGroupItem>One</ButtonGroupItem>
              <ButtonGroupItem selected>Two</ButtonGroupItem>
              <ButtonGroupItem>Three</ButtonGroupItem>
            </ButtonGroup>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Partially disabled</p>
            <ButtonGroup aria-label="Partially disabled">
              <ButtonGroupItem>One</ButtonGroupItem>
              <ButtonGroupItem disabled>Two</ButtonGroupItem>
              <ButtonGroupItem>Three</ButtonGroupItem>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* Item counts */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Item Counts</h3>
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-sm text-text-subtle">Single item</p>
            <ButtonGroup aria-label="Single option">
              <ButtonGroupItem selected>Only Option</ButtonGroupItem>
            </ButtonGroup>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Two items</p>
            <ButtonGroup aria-label="Two options">
              <ButtonGroupItem selected>First</ButtonGroupItem>
              <ButtonGroupItem>Second</ButtonGroupItem>
            </ButtonGroup>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Three items</p>
            <ButtonGroup aria-label="Three options">
              <ButtonGroupItem>First</ButtonGroupItem>
              <ButtonGroupItem selected>Second</ButtonGroupItem>
              <ButtonGroupItem>Third</ButtonGroupItem>
            </ButtonGroup>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Four items</p>
            <ButtonGroup aria-label="Four options">
              <ButtonGroupItem>First</ButtonGroupItem>
              <ButtonGroupItem selected>Second</ButtonGroupItem>
              <ButtonGroupItem>Third</ButtonGroupItem>
              <ButtonGroupItem>Fourth</ButtonGroupItem>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* Icon variations */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">Icon Variations</h3>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="mb-2 text-sm text-text-subtle">Text only</p>
            <ButtonGroup aria-label="Text options">
              <ButtonGroupItem selected>List</ButtonGroupItem>
              <ButtonGroupItem>Grid</ButtonGroupItem>
            </ButtonGroup>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Icon + text</p>
            <ButtonGroup aria-label="Icon text options">
              <ButtonGroupItem leftIcon={List} selected>
                List
              </ButtonGroupItem>
              <ButtonGroupItem leftIcon={GridFour}>Grid</ButtonGroupItem>
            </ButtonGroup>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Icon only</p>
            <ButtonGroup aria-label="Icon only options">
              <ButtonGroupItem leftIcon={List} aria-label="List view" selected />
              <ButtonGroupItem leftIcon={GridFour} aria-label="Grid view" />
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* ARIA roles */}
      <section>
        <h3 className="mb-4 text-lg font-semibold">ARIA Roles</h3>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="mb-2 text-sm text-text-subtle">
              role=&quot;group&quot; (default)
            </p>
            <ButtonGroup role="group" aria-label="Group role example">
              <ButtonGroupItem selected>One</ButtonGroupItem>
              <ButtonGroupItem>Two</ButtonGroupItem>
            </ButtonGroup>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">
              role=&quot;radiogroup&quot;
            </p>
            <ButtonGroup role="radiogroup" aria-label="Radio group example">
              <ButtonGroupItem selected>One</ButtonGroupItem>
              <ButtonGroupItem>Two</ButtonGroupItem>
            </ButtonGroup>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">
              role=&quot;toolbar&quot;
            </p>
            <ButtonGroup role="toolbar" aria-label="Toolbar example">
              <ButtonGroupItem
                leftIcon={TextAlignLeft}
                aria-label="Left"
                selected
              />
              <ButtonGroupItem leftIcon={TextAlignCenter} aria-label="Center" />
            </ButtonGroup>
          </div>
        </div>
      </section>
    </div>
  ),
};
