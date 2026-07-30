import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Heading } from '../Heading'

import { Skeleton } from './Skeleton'

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

/** Bare, inside a line of text: an inline-block that takes the height of the
 *  surrounding font and fills the available width. */
export const Default: Story = {
  render: (args) => (
    <p style={{ margin: 0, fontSize: '1.5rem' }}>
      <Skeleton {...args} />
    </p>
  ),
}

/** The image shape a card places above its text — both dimensions explicit,
 *  and `style` still passes through for a corner radius the tokens don't
 *  cover. */
export const SizedBlock: Story = {
  render: (args) => (
    <Skeleton {...args} height={200} width="100%" style={{ borderRadius: '4px 4px 0 0' }} />
  ),
}

/** A card's text column while it loads: a heading line, a couple of narrower
 *  lines, and a trailing detail, each width fixed to the shape it stands in
 *  for so the layout doesn't jump once the real copy arrives. */
export const TextBlock: Story = {
  render: (args) => (
    // A skeleton heading has no accessible name of its own — the loading
    // container is what announces the busy state, so it carries the label
    // and hides the placeholder markup underneath it from assistive tech.
    <div role="status" aria-label="Loading restaurant details" style={{ maxWidth: 320 }}>
      <div aria-hidden="true">
        <Heading level={2}>
          <Skeleton {...args} width="50%" />
        </Heading>
        <p style={{ margin: '0.5rem 0' }}>
          <Skeleton {...args} width="35%" />
        </p>
        <p style={{ margin: '0.5rem 0' }}>
          <Skeleton {...args} />
        </p>
        <p style={{ margin: 0 }}>
          <Skeleton {...args} width="25%" height="23px" style={{ marginTop: 24 }} />
        </p>
      </div>
    </div>
  ),
}

/** A placeholder announces nothing — the loading state belongs to whatever
 *  container renders it, not to the `Skeleton` itself. */
export const HiddenFromAssistiveTech: Story = {
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.querySelector('.droppy-Skeleton')

    await expect(canvas).toHaveAttribute('aria-hidden', 'true')
  },
}

/** The shimmer comes entirely from `Skeleton.css` — this proves the
 *  stylesheet loaded rather than trusting the visual sweep in the canvas. */
export const UsesShimmerTokens: Story = {
  play: async ({ canvasElement }) => {
    const canvas = canvasElement.querySelector('.droppy-Skeleton')
    const computed = window.getComputedStyle(canvas as Element)

    await expect(computed.animationName).toBe('droppy-skeleton-shimmer')
    await expect(computed.backgroundImage).toContain('gradient')
  },
}
