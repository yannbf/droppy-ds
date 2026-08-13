import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Card } from '../Card'
import { Carousel } from './Carousel'

const Tile = ({ label }: { label: string }) => (
  <Card padded style={{ height: '8rem', display: 'flex', alignItems: 'center' }}>
    {label}
  </Card>
)

const tiles = Array.from({ length: 8 }, (_, index) => (
  <Tile key={index} label={`Item ${index + 1}`} />
))

const meta = {
  title: 'Media & content/Carousel',
  component: Carousel,
  args: {
    itemsPerView: { mobile: 1.2, tablet: 3, desktop: 4 },
    children: tiles,
  },
  parameters: {
    // Off-screen slides render at opacity 0.5 by design, to signal there's
    // more to scroll to — the a11y addon's color-contrast check flags that
    // reduced contrast on stub story content, but it's the intended dimmed
    // state, not a real content-legibility issue.
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Item 1')).toBeInTheDocument()
  },
}

/** Fewer items than fit in the viewport — no arrows render since there's
 *  nowhere to scroll. */
export const FewerItemsThanFitInView: Story = {
  args: {
    children: tiles.slice(0, 2),
  },
}

/** Arrow clicks advance by more than one slide at a time on desktop. */
export const AdvanceByPage: Story = {
  args: {
    slidesToScroll: { desktop: 4 },
  },
}
