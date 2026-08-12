import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Container } from './Container'

const meta = {
  title: 'Layout & structure/Container',
  component: Container,
  args: { children: 'Page content' },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['showcase'],
  render: (args) => (
    <Container {...args} style={{ background: 'var(--ds-color-surface-highlight)' }} />
  ),
  play: async ({ canvas }) => {
    const content = canvas.getByText('Page content')

    await expect(getComputedStyle(content).maxWidth).toBe('1600px')
  },
}

export const DesktopOnly: Story = {
  tags: ['api-ref'],
  args: { desktopOnly: true },
  render: (args) => (
    <Container {...args} style={{ background: 'var(--ds-color-surface-highlight)' }} />
  ),
}
