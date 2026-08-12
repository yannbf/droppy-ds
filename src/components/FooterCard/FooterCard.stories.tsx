import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { FooterCard } from './FooterCard'

// Stands in for a router's own link component (e.g. react-router's `Link`) to
// demonstrate the `render` escape hatch without adding a router dependency to
// the design system's stories.
const RouterLink = ({ to, children, ...rest }: { to: string } & ComponentProps<'a'>) => (
  <a href={to} data-router-link="" {...rest}>
    {children}
  </a>
)

const meta = {
  title: 'Navigation/FooterCard',
  component: FooterCard,
  args: {
    title: 'Discover us',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Categories', href: '/categories' },
      { name: 'About', href: '/about' },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '0.5rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FooterCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['showcase'],
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Categories' })

    await expect(link).toHaveAttribute('href', '/categories')
  },
}

/** External links open in a new tab with `rel="noopener noreferrer"`. */
export const ExternalLinks: Story = {
  tags: ['api-ref'],
  args: {
    title: 'Our social media',
    links: [
      { name: 'Facebook', href: 'https://facebook.com', external: true },
      { name: 'Instagram', href: 'https://instagram.com', external: true },
      { name: 'Twitter', href: 'https://twitter.com', external: true },
    ],
  },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Facebook' })

    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  },
}

/** `render` swaps the default `<a>` for a router-aware link per item — a
 *  stand-in here for `react-router`'s `Link`. */
export const WithRouterLinks: Story = {
  tags: ['highlight'],
  args: {
    links: [
      { name: 'Home', render: <RouterLink to="/" /> },
      { name: 'Categories', render: <RouterLink to="/categories" /> },
    ],
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-router-link]')).toHaveLength(2)
  },
}

/** Arbitrary content — app store badges, a short paragraph — instead of (or
 *  alongside) a link list. */
export const WithChildren: Story = {
  tags: ['api-ref'],
  args: { title: 'Check our apps', links: [] },
  render: (args) => (
    <FooterCard {...args}>
      <p style={{ margin: 0 }}>Available on iOS and Android.</p>
    </FooterCard>
  ),
}
