import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Link } from './Link'

// Stands in for a router's own link component (e.g. react-router's `Link`) to
// demonstrate the `render` escape hatch without adding a router dependency to
// the design system's stories.
const RouterLink = ({ to, children, ...rest }: { to: string } & ComponentProps<'a'>) => (
  <a href={to} data-router-link="" {...rest}>
    {children}
  </a>
)

const meta = {
  title: 'Actions/Link',
  component: Link,
  args: { children: 'Order again', href: '/orders' },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['showcase'],
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Order again' })

    await expect(link).toHaveAttribute('href', '/orders')
  },
}

/** Inline inside a sentence, inheriting the surrounding text's font. */
export const Inline: Story = {
  tags: ['highlight'],
  render: (args) => (
    <p>
      Your order is on its way. <Link {...args}>Track it</Link> or view the receipt.
    </p>
  ),
}

/** `render` swaps the default `<a>` for a router-aware link — here a stand-in
 *  for `react-router`'s `Link`. */
export const WithRouterLink: Story = {
  tags: ['highlight'],
  args: {
    href: undefined,
    render: <RouterLink to="/orders" />,
  },
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('[data-router-link]')

    await expect(link).toHaveAttribute('href', '/orders')
  },
}

/** On a dark surface, `Link` inherits `currentColor` from the wrapping
 *  context rather than fighting it with a hardcoded light-mode token. */
export const OnDarkSurface: Story = {
  tags: ['highlight'],
  render: (args) => (
    <div
      style={{
        background: '#1a1a1a',
        color: '#fff',
        padding: '1.5rem',
        borderRadius: '0.5rem',
      }}
    >
      <Link {...args} style={{ color: 'inherit' }} />
    </div>
  ),
}
