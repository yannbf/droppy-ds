import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { SeparatorProps } from './Separator'
import { Separator } from './Separator'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SeparatorProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const meta = {
  title: 'Layout & structure/Separator',
  component: Separator,
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Sets `aria-orientation` and `data-orientation` together.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Separator` class.',
    },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A divider between two stacked blocks. `orientation` is set below, so the
 * controls start populated — flip it to vertical and the demo lays out
 * horizontally to match.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { orientation: 'horizontal' },
  argTypes: hide('className'),
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: args.orientation === 'vertical' ? 'row' : 'column',
        alignItems: args.orientation === 'vertical' ? 'center' : undefined,
        gap: '1rem',
        height: args.orientation === 'vertical' ? '2rem' : undefined,
      }}
    >
      <span>Section one</span>
      <Separator {...args} />
      <span>Section two</span>
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: one `<div>` with `role="separator"` and no children. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('orientation', 'className'),
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <span>Above</span>
      <Separator {...args} />
      <span>Below</span>
    </div>
  ),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The `role="separator"` line, carrying `aria-orientation` and `data-orientation`.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
