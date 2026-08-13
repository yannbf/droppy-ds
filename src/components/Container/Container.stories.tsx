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
  tags: ['infra'],
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
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/**
 * TODO — real content lands in the dedicated examples session.
 *
 * Mined from Mealdrop (`agentic-reference/droppy`): no direct import — the app
 * still styles page width with its global `.container` / `.container-desktop`
 * classes, which this component was built to replace (see
 * docs/MEALDROP-PARITY.md). The story to write is therefore a DropBoard one:
 * a back-office page shell — wordmark header, a bounded content column of
 * order rows, and a full-bleed tinted band breaking out of the bound — showing
 * what the two `.container` classes were doing, with `desktopOnly` covering
 * the second.
 */
export const DropBoardPageWidth: Story = {
  tags: ['examples'],
  render: () => <>TODO</>,
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
