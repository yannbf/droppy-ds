import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'

import type { CardProps } from './Card'
import { Card } from './Card'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof CardProps | 'children'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

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

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` compose freely — `Card` provides the surface and nothing else. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('interactive', 'padded', 'className'),
  args: {
    padded: true,
    children: (
      <>
        <strong>Burger Kingdom</strong>
        <p style={{ margin: '0.25rem 0 0' }}>Nicest place for burgers</p>
      </>
    ),
  },
}

/** `padded` adds uniform padding, for children that don't own their own. */
export const Padded: Story = {
  tags: ['api-ref'],
  argTypes: hide('interactive', 'className'),
  args: { padded: true },
}

/** `interactive` is appearance only: hover dim and a pointer cursor. */
export const Interactive: Story = {
  tags: ['api-ref'],
  argTypes: hide('padded', 'className'),
  args: { interactive: true, padded: true, children: 'Hover me' },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('interactive', 'padded'),
  args: {
    className: 'card-demo-inset',
    children: 'Card content',
    padded: true,
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.card-demo-inset { margin: 1rem; }`}</style>
      <Card {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

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
