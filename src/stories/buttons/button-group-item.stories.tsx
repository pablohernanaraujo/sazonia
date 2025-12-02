import React from 'react';
import {
  ArrowsHorizontal,
  Calendar,
  CaretLeft,
  CaretRight,
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

import { ButtonGroupItem } from '@/ui/buttons';

/**
 * ButtonGroupItem is an individual interactive element designed to be used
 * within a ButtonGroup container. It represents a single selectable option
 * in a segmented control pattern.
 *
 * ## Features
 * - **3 Size Variants**: sm (32px), md (40px), lg (48px)
 * - **3 Position Variants**: first, middle, last (controls border radius)
 * - **Icon Support**: left, right, or icon-only
 * - **Selected State**: Toggle selection with `aria-pressed`
 *
 * ## Usage
 * ButtonGroupItem is designed to be used in groups with adjacent items
 * sharing borders via negative margin (`-ml-px`).
 *
 * ## Accessibility
 * - Focus indicators with ring styling
 * - Icon-only buttons require `aria-label`
 * - Selected state uses `aria-pressed="true"`
 * - Disabled state sets proper `disabled` and `aria-disabled` attributes
 */
const meta = {
  title: 'Buttons/ButtonGroupItem',
  component: ButtonGroupItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      description: 'Button text content',
      control: 'text',
    },
    size: {
      description: 'Size variant affecting height and padding',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    position: {
      description: 'Position in group (controls border radius)',
      control: 'select',
      options: ['first', 'middle', 'last'],
    },
    selected: {
      description: 'Whether the item is currently selected',
      control: 'boolean',
    },
    disabled: {
      description: 'Disables the button interaction',
      control: 'boolean',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
    'aria-label': {
      description: 'Accessible label (required for icon-only buttons)',
      control: 'text',
    },
  },
} satisfies Meta<typeof ButtonGroupItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default ButtonGroupItem with middle position.
 */
export const Default: Story = {
  args: {
    children: 'Option',
  },
};

/**
 * All size variants displayed together: sm (32px), md (40px), lg (48px).
 */
export const AllSizes: Story = {
  args: { children: 'Option' },
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      <div className="text-center">
        <ButtonGroupItem size="sm" position="first">
          Small
        </ButtonGroupItem>
        <p className="mt-2 text-xs text-text-subtle">32px</p>
      </div>
      <div className="text-center">
        <ButtonGroupItem size="md" position="first">
          Medium
        </ButtonGroupItem>
        <p className="mt-2 text-xs text-text-subtle">40px</p>
      </div>
      <div className="text-center">
        <ButtonGroupItem size="lg" position="first">
          Large
        </ButtonGroupItem>
        <p className="mt-2 text-xs text-text-subtle">48px</p>
      </div>
    </div>
  ),
};

/**
 * All position variants: first (rounded left), middle (no rounding), last (rounded right).
 */
export const AllPositions: Story = {
  args: { children: 'Option' },
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-subtle">
          Position: First (rounded left)
        </h4>
        <ButtonGroupItem position="first">First</ButtonGroupItem>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-subtle">
          Position: Middle (no rounding)
        </h4>
        <ButtonGroupItem position="middle">Middle</ButtonGroupItem>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-subtle">
          Position: Last (rounded right)
        </h4>
        <ButtonGroupItem position="last">Last</ButtonGroupItem>
      </div>
    </div>
  ),
};

/**
 * All interactive states: default, hover (interactive), focus (keyboard), selected, disabled.
 */
export const AllStates: Story = {
  args: { children: 'Option' },
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="text-center">
          <ButtonGroupItem position="first">Default</ButtonGroupItem>
          <p className="mt-2 text-xs text-text-subtle">Default</p>
        </div>
        <div className="text-center">
          <ButtonGroupItem position="first" selected>
            Selected
          </ButtonGroupItem>
          <p className="mt-2 text-xs text-text-subtle">Selected</p>
        </div>
        <div className="text-center">
          <ButtonGroupItem position="first" disabled>
            Disabled
          </ButtonGroupItem>
          <p className="mt-2 text-xs text-text-subtle">Disabled</p>
        </div>
        <div className="text-center">
          <ButtonGroupItem position="first" selected disabled>
            Both
          </ButtonGroupItem>
          <p className="mt-2 text-xs text-text-subtle">Selected + Disabled</p>
        </div>
      </div>
      <p className="text-xs text-text-subtle">
        Hover and focus states are interactive - try hovering or tabbing to the
        buttons.
      </p>
    </div>
  ),
};

/**
 * ButtonGroupItem with icon on the left side.
 */
export const WithLeftIcon: Story = {
  args: { children: 'Option' },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ButtonGroupItem leftIcon={List} position="first">
        List
      </ButtonGroupItem>
      <ButtonGroupItem leftIcon={GridFour} position="first">
        Grid
      </ButtonGroupItem>
      <ButtonGroupItem leftIcon={Rows} position="first">
        Rows
      </ButtonGroupItem>
    </div>
  ),
};

/**
 * ButtonGroupItem with icon on the right side.
 */
export const WithRightIcon: Story = {
  args: { children: 'Option' },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ButtonGroupItem rightIcon={CaretRight} position="first">
        Next
      </ButtonGroupItem>
      <ButtonGroupItem rightIcon={ArrowsHorizontal} position="first">
        Resize
      </ButtonGroupItem>
    </div>
  ),
};

/**
 * ButtonGroupItem with icons on both sides.
 */
export const WithBothIcons: Story = {
  args: { children: 'Option' },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ButtonGroupItem
        leftIcon={CaretLeft}
        rightIcon={CaretRight}
        position="first"
      >
        Navigate
      </ButtonGroupItem>
    </div>
  ),
};

/**
 * Icon-only buttons require `aria-label` for accessibility.
 */
export const IconOnly: Story = {
  args: { leftIcon: List, 'aria-label': 'List view' },
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <ButtonGroupItem
          leftIcon={List}
          aria-label="List view"
          position="first"
          size="sm"
        />
        <ButtonGroupItem
          leftIcon={GridFour}
          aria-label="Grid view"
          position="first"
          size="md"
        />
        <ButtonGroupItem
          leftIcon={Rows}
          aria-label="Row view"
          position="first"
          size="lg"
        />
      </div>
      <p className="text-xs text-text-subtle">
        Icon-only buttons use square aspect ratio and require aria-label for
        screen readers.
      </p>
    </div>
  ),
};

/**
 * Selected state demonstration with visual feedback.
 */
export const SelectedState: Story = {
  args: { children: 'Option' },
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-subtle">
          Text Buttons
        </h4>
        <div className="flex flex-wrap gap-4">
          <ButtonGroupItem position="first">Not Selected</ButtonGroupItem>
          <ButtonGroupItem position="first" selected>
            Selected
          </ButtonGroupItem>
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-subtle">With Icons</h4>
        <div className="flex flex-wrap gap-4">
          <ButtonGroupItem leftIcon={List} position="first">
            Not Selected
          </ButtonGroupItem>
          <ButtonGroupItem leftIcon={GridFour} position="first" selected>
            Selected
          </ButtonGroupItem>
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-subtle">Icon Only</h4>
        <div className="flex flex-wrap gap-4">
          <ButtonGroupItem
            leftIcon={List}
            aria-label="List view"
            position="first"
          />
          <ButtonGroupItem
            leftIcon={GridFour}
            aria-label="Grid view"
            position="first"
            selected
          />
        </div>
      </div>
    </div>
  ),
};

/**
 * Disabled state with reduced opacity and no interaction.
 */
export const DisabledState: Story = {
  args: { children: 'Option' },
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <ButtonGroupItem position="first" disabled>
          Disabled
        </ButtonGroupItem>
        <ButtonGroupItem leftIcon={List} position="first" disabled>
          With Icon
        </ButtonGroupItem>
        <ButtonGroupItem
          leftIcon={GridFour}
          aria-label="Grid view"
          position="first"
          disabled
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <ButtonGroupItem position="first" selected disabled>
          Selected + Disabled
        </ButtonGroupItem>
        <ButtonGroupItem leftIcon={List} position="first" selected disabled>
          With Icon
        </ButtonGroupItem>
      </div>
    </div>
  ),
};

/**
 * Multiple items shown together simulating a button group with proper border handling.
 */
export const GroupedExample: Story = {
  args: { children: 'Option' },
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-subtle">
          Three Options
        </h4>
        <div className="inline-flex">
          <ButtonGroupItem position="first">Left</ButtonGroupItem>
          <ButtonGroupItem position="middle" className="-ml-px">
            Center
          </ButtonGroupItem>
          <ButtonGroupItem position="last" className="-ml-px">
            Right
          </ButtonGroupItem>
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-subtle">Two Options</h4>
        <div className="inline-flex">
          <ButtonGroupItem position="first">Yes</ButtonGroupItem>
          <ButtonGroupItem position="last" className="-ml-px">
            No
          </ButtonGroupItem>
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-subtle">
          Four Options
        </h4>
        <div className="inline-flex">
          <ButtonGroupItem position="first">One</ButtonGroupItem>
          <ButtonGroupItem position="middle" className="-ml-px">
            Two
          </ButtonGroupItem>
          <ButtonGroupItem position="middle" className="-ml-px">
            Three
          </ButtonGroupItem>
          <ButtonGroupItem position="last" className="-ml-px">
            Four
          </ButtonGroupItem>
        </div>
      </div>
      <p className="text-xs text-text-subtle">
        Border overlap is handled with <code>-ml-px</code> on middle and last
        items.
      </p>
    </div>
  ),
};

/**
 * Real-world toolbar pattern: text alignment controls.
 */
export const RealWorldToolbar: Story = {
  args: { children: 'Option' },
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-subtle">
          Text Alignment
        </h4>
        <div className="inline-flex">
          <ButtonGroupItem
            leftIcon={TextAlignLeft}
            aria-label="Align left"
            position="first"
            selected
          />
          <ButtonGroupItem
            leftIcon={TextAlignCenter}
            aria-label="Align center"
            position="middle"
            className="-ml-px"
          />
          <ButtonGroupItem
            leftIcon={TextAlignRight}
            aria-label="Align right"
            position="middle"
            className="-ml-px"
          />
          <ButtonGroupItem
            leftIcon={TextAlignJustify}
            aria-label="Justify"
            position="last"
            className="-ml-px"
          />
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-subtle">With Labels</h4>
        <div className="inline-flex">
          <ButtonGroupItem leftIcon={TextAlignLeft} position="first" selected>
            Left
          </ButtonGroupItem>
          <ButtonGroupItem
            leftIcon={TextAlignCenter}
            position="middle"
            className="-ml-px"
          >
            Center
          </ButtonGroupItem>
          <ButtonGroupItem
            leftIcon={TextAlignRight}
            position="last"
            className="-ml-px"
          >
            Right
          </ButtonGroupItem>
        </div>
      </div>
    </div>
  ),
};

/**
 * Real-world view toggle pattern: grid/list view selector.
 */
export const RealWorldViewToggle: Story = {
  args: { children: 'Option' },
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-subtle">
          View Mode Toggle
        </h4>
        <div className="inline-flex">
          <ButtonGroupItem
            leftIcon={ListBullets}
            aria-label="List view"
            position="first"
          />
          <ButtonGroupItem
            leftIcon={SquaresFour}
            aria-label="Grid view"
            position="last"
            className="-ml-px"
            selected
          />
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium text-text-subtle">
          Data View Toggle
        </h4>
        <div className="inline-flex">
          <ButtonGroupItem leftIcon={Table} position="first" selected>
            Table
          </ButtonGroupItem>
          <ButtonGroupItem
            leftIcon={ChartLine}
            position="middle"
            className="-ml-px"
          >
            Chart
          </ButtonGroupItem>
          <ButtonGroupItem leftIcon={Calendar} position="last" className="-ml-px">
            Calendar
          </ButtonGroupItem>
        </div>
      </div>
    </div>
  ),
};

/**
 * Interactive group simulation component with stateful selection.
 */
function LiveGroupSimulationDemo(): React.ReactElement {
  const [selected, setSelected] = React.useState('center');
  return (
    <div className="space-y-4">
      <div className="inline-flex">
        <ButtonGroupItem
          position="first"
          selected={selected === 'left'}
          onClick={() => setSelected('left')}
        >
          Left
        </ButtonGroupItem>
        <ButtonGroupItem
          position="middle"
          selected={selected === 'center'}
          onClick={() => setSelected('center')}
          className="-ml-px"
        >
          Center
        </ButtonGroupItem>
        <ButtonGroupItem
          position="last"
          selected={selected === 'right'}
          onClick={() => setSelected('right')}
          className="-ml-px"
        >
          Right
        </ButtonGroupItem>
      </div>
      <p className="text-xs text-text-subtle">
        Click on items to change selection. Currently selected:{' '}
        <strong>{selected}</strong>
      </p>
    </div>
  );
}

/**
 * Interactive group simulation with stateful selection.
 * Click items to see selection state change.
 */
export const LiveGroupSimulation: Story = {
  args: { children: 'Option' },
  render: () => <LiveGroupSimulationDemo />,
};

/**
 * Interactive icon-only view toggle component with stateful selection.
 */
function LiveViewToggleDemo(): React.ReactElement {
  const [view, setView] = React.useState<'list' | 'grid'>('grid');
  return (
    <div className="space-y-4">
      <div className="inline-flex">
        <ButtonGroupItem
          leftIcon={ListBullets}
          aria-label="List view"
          position="first"
          selected={view === 'list'}
          onClick={() => setView('list')}
        />
        <ButtonGroupItem
          leftIcon={SquaresFour}
          aria-label="Grid view"
          position="last"
          className="-ml-px"
          selected={view === 'grid'}
          onClick={() => setView('grid')}
        />
      </div>
      <p className="text-xs text-text-subtle">
        Current view: <strong>{view}</strong>
      </p>
    </div>
  );
}

/**
 * Interactive icon-only view toggle with stateful selection.
 */
export const LiveViewToggle: Story = {
  args: { leftIcon: ListBullets, 'aria-label': 'List view' },
  render: () => <LiveViewToggleDemo />,
};

/**
 * Complete variant matrix showing all size and position combinations.
 */
export const CompleteMatrix: Story = {
  args: { children: 'Option' },
  render: () => (
    <div className="space-y-8">
      {/* Sizes */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">All Sizes</h3>
        <div className="flex flex-wrap items-end gap-4">
          <div className="text-center">
            <ButtonGroupItem size="sm" position="first">
              Small
            </ButtonGroupItem>
            <p className="mt-1 text-xs text-text-subtle">32px</p>
          </div>
          <div className="text-center">
            <ButtonGroupItem size="md" position="first">
              Medium
            </ButtonGroupItem>
            <p className="mt-1 text-xs text-text-subtle">40px</p>
          </div>
          <div className="text-center">
            <ButtonGroupItem size="lg" position="first">
              Large
            </ButtonGroupItem>
            <p className="mt-1 text-xs text-text-subtle">48px</p>
          </div>
        </div>
      </div>

      {/* Positions */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">All Positions</h3>
        <div className="flex flex-wrap gap-4">
          <div className="text-center">
            <ButtonGroupItem position="first">First</ButtonGroupItem>
            <p className="mt-1 text-xs text-text-subtle">rounded-l-sm</p>
          </div>
          <div className="text-center">
            <ButtonGroupItem position="middle">Middle</ButtonGroupItem>
            <p className="mt-1 text-xs text-text-subtle">no rounding</p>
          </div>
          <div className="text-center">
            <ButtonGroupItem position="last">Last</ButtonGroupItem>
            <p className="mt-1 text-xs text-text-subtle">rounded-r-sm</p>
          </div>
        </div>
      </div>

      {/* States */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">States</h3>
        <div className="flex flex-wrap gap-4">
          <ButtonGroupItem position="first">Default</ButtonGroupItem>
          <ButtonGroupItem position="first" selected>
            Selected
          </ButtonGroupItem>
          <ButtonGroupItem position="first" disabled>
            Disabled
          </ButtonGroupItem>
        </div>
      </div>

      {/* With Icons */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">With Icons</h3>
        <div className="flex flex-wrap gap-4">
          <ButtonGroupItem leftIcon={List} position="first">
            Left Icon
          </ButtonGroupItem>
          <ButtonGroupItem rightIcon={CaretRight} position="first">
            Right Icon
          </ButtonGroupItem>
          <ButtonGroupItem
            leftIcon={CaretLeft}
            rightIcon={CaretRight}
            position="first"
          >
            Both Icons
          </ButtonGroupItem>
          <ButtonGroupItem
            leftIcon={GridFour}
            aria-label="Grid"
            position="first"
          />
        </div>
      </div>

      {/* Complete Group Example */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Complete Group</h3>
        <div className="inline-flex">
          <ButtonGroupItem leftIcon={List} position="first" selected>
            List
          </ButtonGroupItem>
          <ButtonGroupItem
            leftIcon={SquaresFour}
            position="middle"
            className="-ml-px"
          >
            Grid
          </ButtonGroupItem>
          <ButtonGroupItem leftIcon={Table} position="last" className="-ml-px">
            Table
          </ButtonGroupItem>
        </div>
      </div>

      {/* All Sizes in Group */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">All Sizes in Groups</h3>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm text-text-subtle">Small (32px)</p>
            <div className="inline-flex">
              <ButtonGroupItem size="sm" position="first" selected>
                One
              </ButtonGroupItem>
              <ButtonGroupItem size="sm" position="middle" className="-ml-px">
                Two
              </ButtonGroupItem>
              <ButtonGroupItem size="sm" position="last" className="-ml-px">
                Three
              </ButtonGroupItem>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Medium (40px)</p>
            <div className="inline-flex">
              <ButtonGroupItem size="md" position="first" selected>
                One
              </ButtonGroupItem>
              <ButtonGroupItem size="md" position="middle" className="-ml-px">
                Two
              </ButtonGroupItem>
              <ButtonGroupItem size="md" position="last" className="-ml-px">
                Three
              </ButtonGroupItem>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm text-text-subtle">Large (48px)</p>
            <div className="inline-flex">
              <ButtonGroupItem size="lg" position="first" selected>
                One
              </ButtonGroupItem>
              <ButtonGroupItem size="lg" position="middle" className="-ml-px">
                Two
              </ButtonGroupItem>
              <ButtonGroupItem size="lg" position="last" className="-ml-px">
                Three
              </ButtonGroupItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
