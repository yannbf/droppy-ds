import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { PageSection } from './PageSection'

const meta = {
  title: 'Layout & structure/PageSection',
  component: PageSection,
  args: {
    title: 'Asian',
    children: <p>Restaurant cards go here.</p>,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PageSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Asian' })).toBeInTheDocument()
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
  },
}

export const WithAction: Story = {
  args: {
    topButtonLabel: 'View all categories',
    onTopButtonClick: fn(),
  },
}
