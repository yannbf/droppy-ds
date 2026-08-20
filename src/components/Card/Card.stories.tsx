import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { CardProps } from './Card'
import { Card } from './Card'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof CardProps | 'children'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const meta = {
  title: 'Media & content/Card',
  component: Card,
  args: { children: 'Card content' },
  argTypes: {
    children: { control: 'text', description: 'Whatever the card groups — no slots.' },
    interactive: {
      control: 'boolean',
      description: 'Hover dim + pointer cursor. Appearance only — wire your own click handling.',
    },
    padded: {
      control: 'boolean',
      description: 'Adds `--ds-space-sm` padding on all sides. Bare by default.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Card` class.',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A rounded, clipped surface for grouping content. Both variant props are set
 * below, so the controls start populated — flip `padded` or `interactive`.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { children: 'Card content', padded: true, interactive: false },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/** An edge-to-edge image clips to the card's own corner radius instead of squaring off past it. */
export const WithImage: Story = {
  tags: ['highlight'],
  argTypes: hide('children', 'interactive', 'padded', 'className'),
  render: (args) => (
    <Card {...args} style={{ width: '16rem' }}>
      <img
        src="https://placehold.co/320x180"
        alt=""
        style={{ display: 'block', width: '100%', height: '10rem', objectFit: 'cover' }}
      />
      <div style={{ padding: '1rem' }}>Restaurant name</div>
    </Card>
  ),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: one `<div>` providing the surface, with children in normal flow. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'interactive', 'padded', 'className'),
  args: { padded: true },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The surface: background, radius, and the clipping that keeps images in.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
