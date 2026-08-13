import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { IconButton } from './IconButton'

const meta = {
  title: 'Actions/IconButton',
  component: IconButton,
  args: {
    name: 'arrow-right',
    'aria-label': 'next',
    onClick: fn(),
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Small: Story = {
  args: { small: true },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <IconButton {...args} aria-label="previous" name="arrow-left" />
      <IconButton {...args} small aria-label="previous, small" name="arrow-left" />
    </div>
  ),
}

export const ClickHandling: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'next' }))

    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}
