import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Breadcrumb } from './Breadcrumb'

// Stands in for a router's own link component (e.g. react-router's `Link`) to
// demonstrate the `render` escape hatch without adding a router dependency to
// the design system's stories.
const RouterLink = ({ to, children, ...rest }: { to: string } & ComponentProps<'a'>) => (
  <a href={to} data-router-link="" {...rest}>
    {children}
  </a>
)

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: [{ label: 'categories', href: '/categories' }, { label: 'sushi' }],
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  tags: ['showcase'],
}

export const SingleCrumb: Story = {
  tags: ['highlight'],
  args: { items: [{ label: 'restaurants' }] },
}

/** The last crumb carries `aria-current="page"`, whether it renders as a
 *  link or as plain text. */
export const CurrentPageIsMarked: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    const current = canvas.getByText('sushi')

    await expect(current).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByText('categories')).not.toHaveAttribute('aria-current')
  },
}

/** `render` swaps the default `<a>` for a router-aware link — here a stand-in
 *  for `react-router`'s `Link`, cloned with the crumb's class and, on the
 *  last item, `aria-current`. */
export const WithRouterLink: Story = {
  tags: ['highlight'],
  args: {
    items: [
      { label: 'categories', render: <RouterLink to="/categories" /> },
      { label: 'sushi', render: <RouterLink to="/categories/sushi" /> },
    ],
  },
  play: async ({ canvas, canvasElement }) => {
    const current = canvas.getByText('sushi')

    await expect(current).toHaveAttribute('aria-current', 'page')
    await expect(canvasElement.querySelectorAll('[data-router-link]')).toHaveLength(2)
  },
}
