import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { ProgressBar } from './ProgressBar'

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  args: { value: 1, max: 3, label: 'Checkout progress' },
  render: (args) => (
    <div style={{ width: '16rem' }}>
      <ProgressBar {...args} />
    </div>
  ),
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: { value: 0 },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Checkout progress' })

    await expect(bar).toHaveAttribute('aria-valuenow', '0')
    await expect(bar).toHaveAttribute('aria-valuemin', '0')
    await expect(bar).toHaveAttribute('aria-valuemax', '3')
  },
}

export const Mid: Story = {
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Checkout progress' })

    await expect(bar).toHaveAttribute('aria-valuenow', '1')
  },
}

export const Full: Story = {
  args: { value: 3 },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Checkout progress' })

    await expect(bar).toHaveAttribute('aria-valuenow', '3')
  },
}

/** A value past `max` clamps rather than overflowing the track. */
export const OverMaxClamps: Story = {
  args: { value: 9 },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Checkout progress' })

    await expect(bar).toHaveAttribute('aria-valuenow', '3')
  },
}
