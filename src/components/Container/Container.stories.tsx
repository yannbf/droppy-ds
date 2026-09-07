import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'

import type { ContainerProps } from './Container'
import { Container } from './Container'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ContainerProps | 'children'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

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

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` render in normal flow — the wrapper only bounds the width. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('desktopOnly', 'className'),
  args: {
    children: (
      <>
        <h2 style={{ margin: 0 }}>Restaurants near you</h2>
        <p>Everything inside keeps the page's max width and side padding.</p>
      </>
    ),
  },
  render: (args) => <Container {...args} style={tinted} />,
}

/** `desktopOnly` defers the constraint until the desktop breakpoint. */
export const DesktopOnly: Story = {
  tags: ['api-ref'],
  argTypes: hide('children', 'className'),
  args: { desktopOnly: true },
  render: (args) => <Container {...args} style={tinted} />,
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('desktopOnly', 'children'),
  args: {
    className: 'container-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.container-demo-inset { margin: 1rem; }`}</style>
      <Container {...args} style={tinted} />
    </>
  ),
}

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
