import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { TopBanner } from './TopBanner'

// A tiny inline gradient standing in for a restaurant photo, so the story has
// no network dependency.
const photoDataUri = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="240">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#4cc8c0"/><stop offset="1" stop-color="#22aca7"/>' +
    '</linearGradient></defs>' +
    '<rect width="800" height="240" fill="url(#g)"/></svg>'
)}`

const meta = {
  title: 'Media & content/TopBanner',
  component: TopBanner,
  args: { title: 'Categories' },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TopBanner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithImage: Story = {
  args: { photoUrl: photoDataUri },
  play: async ({ canvas }) => {
    const banner = canvas.getByRole('heading', { level: 2, name: 'Categories' })
      .parentElement as HTMLElement

    await expect(getComputedStyle(banner).backgroundImage).toContain('url(')
  },
}
