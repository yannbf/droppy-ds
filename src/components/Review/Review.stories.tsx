import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Review } from './Review'

const meta = {
  title: 'Feedback & status/Review',
  component: Review,
  args: { rating: 4.5 },
} satisfies Meta<typeof Review>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('★ 4.5 Very good')).toBeInTheDocument()
  },
}

export const VeryPoor: Story = {
  args: { rating: 1 },
}

export const Adequate: Story = {
  args: { rating: 3 },
}

export const Excellent: Story = {
  args: { rating: 5 },
}

/** No `rating` renders a plain fallback line instead of a star score. */
export const NoReviews: Story = {
  args: { rating: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No reviews yet')).toBeInTheDocument()
  },
}

/** `color` overrides the default low-contrast review token — for a caller
 *  (like Mealdrop's own restaurant tiles) that wants a specific look. */
export const CustomColor: Story = {
  args: { rating: 4.2, color: '#0a7d32' },
}
