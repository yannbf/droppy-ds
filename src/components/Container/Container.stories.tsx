import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { ContainerProps } from './Container'
import { Container } from './Container'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ContainerProps | 'children'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const tinted = { background: 'var(--ds-color-surface-highlight)' }

const meta = {
  title: 'Layout & structure/Container',
  component: Container,
  args: { children: 'Page content' },
  argTypes: {
    children: { control: 'text', description: 'The page content the wrapper bounds.' },
    desktopOnly: {
      control: 'boolean',
      description:
        'Applies the max-width and side padding from the desktop breakpoint (1024px) up, rather than immediately.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Container` class.',
    },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The page-width wrapper, tinted here so the bound is visible. Both props are
 * set below — toggle `desktopOnly` and resize to see where the constraint
 * starts applying.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { children: 'Page content', desktopOnly: false },
  argTypes: hide('className'),
  render: (args) => <Container {...args} style={tinted} />,
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: one `<div>` that bounds width and adds side padding. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'desktopOnly', 'className'),
  render: (args) => <Container {...args} style={tinted} />,
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `<div>` carrying the max-width bound and the side padding.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
