import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Badge } from '../Badge'
import { Body } from '../Body'
import { Heading } from '../Heading'
import { Review } from '../Review'
import { Card } from './Card'

const meta = {
  title: 'Media & content/Card',
  component: Card,
  args: { children: 'Card content' },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    const card = canvas.getByText('Card content')

    await expect(getComputedStyle(card).borderRadius).toBe('8px')
    // Flat at rest by design — elevation is the consumer's choice to add.
    await expect(getComputedStyle(card).boxShadow).toBe('none')
  },
}

export const Padded: Story = {
  tags: ['api-ref'],
  args: { padded: true },
}

export const Interactive: Story = {
  tags: ['api-ref'],
  args: { interactive: true, children: 'Hover me' },
}

/** An edge-to-edge image clips to the card's own corner radius instead of
 *  poking past it. */
export const WithImage: Story = {
  tags: ['highlight'],
  render: () => (
    <Card style={{ width: '16rem' }}>
      <img
        src="https://placehold.co/320x180"
        alt=""
        style={{ display: 'block', width: '100%', height: '10rem', objectFit: 'cover' }}
      />
      <div style={{ padding: '1rem' }}>Restaurant name</div>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('.droppy-Card') as HTMLElement

    await expect(getComputedStyle(card).overflow).toBe('hidden')
  },
}

/** The composition Mealdrop's restaurant tiles are built from: an interactive
 *  `Card` holding an edge-to-edge photo, then a padded block of `Heading`,
 *  `Review`, `Body`, and `Badge` children. The tile wires its own click
 *  handling and elevation at the call site. */
export const RestaurantTile: Story = {
  tags: ['examples'],
  render: () => (
    <Card interactive style={{ width: '18rem' }}>
      <img
        src="https://placehold.co/320x180"
        alt=""
        style={{ display: 'block', width: '100%', height: '10rem', objectFit: 'cover' }}
      />
      <div style={{ padding: 'var(--ds-space-sm)' }}>
        <Heading level={2} size={4}>
          Burger Kingdom
        </Heading>
        <Review rating={4.4} />
        <Body type="p" size="S">
          The best burgers in town
        </Body>
        <Badge text="burgers" />
      </div>
    </Card>
  ),
}
