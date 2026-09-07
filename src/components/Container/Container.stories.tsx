import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

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

export const Default: Story = {
  tags: ['showcase'],
  args: { children: 'Page content', desktopOnly: false },
  argTypes: hide('className'),
  render: (args) => <Container {...args} style={tinted} />,
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

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

export const DesktopOnly: Story = {
  tags: ['api-ref'],
  argTypes: hide('children', 'className'),
  args: { desktopOnly: true },
  render: (args) => <Container {...args} style={tinted} />,
}

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
/* ------------------------------------------------------------------ */

export const TestBoundsPageWidth: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByText('Page content')).maxWidth).toBe('1600px')
  },
}

export const TestMergesClassName: Story = {
  tags: ['tests'],
  args: { className: 'container-demo-custom' },
  play: async ({ canvas }) => {
    const root = canvas.getByText('Page content')

    await expect(root).toHaveClass('droppy-Container')
    await expect(root).toHaveClass('container-demo-custom')
  },
}
