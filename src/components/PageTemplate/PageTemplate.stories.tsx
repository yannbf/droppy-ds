import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { PageTemplate } from './PageTemplate'

const Header = () => <header style={{ padding: '1rem', background: '#f5f5f5' }}>Site header</header>

const Footer = () => (
  <footer style={{ padding: '1rem', background: '#1a1a1a', color: '#fff' }}>Site footer</footer>
)

const meta = {
  title: 'Components/PageTemplate',
  component: PageTemplate,
  args: {
    header: <Header />,
    footer: <Footer />,
    children: <div style={{ padding: '1rem' }}>Page content</div>,
  },
} satisfies Meta<typeof PageTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Site header')).toBeInTheDocument()
    await expect(canvas.getByText('Page content')).toBeInTheDocument()
    await expect(canvas.getByText('Site footer')).toBeInTheDocument()
    await expect(canvasElement.querySelector('main')).toBeInTheDocument()
  },
}

/** No `header` or `footer` — just the content area, semantically a `<main>`
 *  on its own. */
export const ContentOnly: Story = {
  args: { header: undefined, footer: undefined },
}
