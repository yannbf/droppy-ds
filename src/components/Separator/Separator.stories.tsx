import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Separator } from './Separator'

const meta = {
  title: 'Components/Separator',
  component: Separator,
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <span>Section one</span>
      <Separator {...args} />
      <span>Section two</span>
    </div>
  ),
  play: async ({ canvas }) => {
    const separator = canvas.getByRole('separator')

    await expect(separator).toHaveAttribute('aria-orientation', 'horizontal')
    await expect(separator).toHaveAttribute('data-orientation', 'horizontal')
  },
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '2rem' }}>
      <span>Left</span>
      <Separator {...args} />
      <span>Right</span>
    </div>
  ),
  play: async ({ canvas }) => {
    const separator = canvas.getByRole('separator')

    await expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    await expect(separator).toHaveAttribute('data-orientation', 'vertical')
  },
}
