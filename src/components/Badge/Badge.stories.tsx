import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Badge } from './Badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { text: 'vegan' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Positive: Story = {
  args: { text: 'new', variant: 'positive' },
}

export const LongerText: Story = {
  args: { text: 'gluten free' },
}

/** Text renders capitalized regardless of casing, and `positive` swaps the
 *  background/text tokens rather than only adding weight. */
export const Comparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Badge text="vegan" />
      <Badge text="new" variant="positive" />
    </div>
  ),
  play: async ({ canvas }) => {
    const neutral = canvas.getByText('vegan')
    const positive = canvas.getByText('new')

    await expect(getComputedStyle(neutral).textTransform).toBe('capitalize')
    await expect(getComputedStyle(neutral).backgroundColor).not.toBe(
      getComputedStyle(positive).backgroundColor
    )
  },
}
