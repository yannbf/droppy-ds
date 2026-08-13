import type { ComponentProps } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import type { LinkProps } from './Link'
import { Link } from './Link'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof LinkProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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
  argTypes: {
    children: { control: 'text', description: 'The link text.' },
    href: {
      control: 'text',
      description: 'Destination for the default `<a>`. Ignored when `render` is set.',
    },
    render: {
      control: false,
      description:
        'Escape hatch for a router-aware link — cloned with this link’s class and props.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Link` class.',
    },
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A plain sentence link. Text and destination are set below, so the controls
 * start populated.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { children: 'Order again', href: '/orders' },
  argTypes: hide('render', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` is the link text — keep it descriptive out of context. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('render', 'className'),
  args: { children: 'Track your order' },
}

/** `href` is the destination for the default `<a>`. */
export const Href: Story = {
  tags: ['api-ref'],
  argTypes: hide('render', 'className'),
  args: { href: 'https://droppy.example/help', children: 'Visit the help centre' },
}

/**
 * `render` swaps the `<a>` for a router-aware link — a stand-in here for
 * `react-router`'s `Link`. The passed element owns its own destination, so
 * `href` is dropped rather than spread on top of it.
 */
export const Render: Story = {
  tags: ['api-ref', 'highlight'],
  argTypes: hide('href', 'className'),
  args: { href: undefined, render: <RouterLink to="/orders" /> },
}

/** `className` merges with the component's own class rather than replacing it. */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('render'),
  args: { className: 'link-demo-quiet' },
  render: (args) => (
    <>
      <style>{`.link-demo-quiet { text-decoration: none; }`}</style>
      <Link {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/** Inline inside a sentence, inheriting the surrounding text's font. */
export const Inline: Story = {
  tags: ['highlight'],
  argTypes: hide('render', 'className'),
  render: (args) => (
    <p>
      Your order is on its way. <Link {...args}>Track it</Link> or view the receipt.
    </p>
  ),
}

/**
 * On a dark surface, `Link` inherits `currentColor` from the wrapping context
 * rather than fighting it with a hard-coded light-mode token.
 */
export const OnDarkSurface: Story = {
  tags: ['highlight'],
  argTypes: hide('render', 'className'),
  render: (args) => (
    <div
      style={{ background: '#1a1a1a', color: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }}
    >
      <Link {...args} style={{ color: 'inherit' }} />
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part, whose tag is the `<a>` — or whatever `render` supplies. */
export const Anatomy: Story = {
  tags: ['infra'],
  argTypes: hide('children', 'href', 'render', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `<a>` — or the element `render` supplies, cloned with this class.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/**
 * TODO — real content lands in the dedicated examples session.
 *
 * Mined from Mealdrop (`agentic-reference/droppy`): no direct import — the app
 * routes with `react-router`'s `Link` directly, and `FooterCard` owns its own
 * link list. That absence is the story: an order-confirmation paragraph with
 * an inline `Link` for 'Track it', shown twice — once as a plain `href`, once
 * with `render={<RouterLink to="…" />}` — so the escape hatch that keeps the
 * design system router-free is the thing on display.
 */
export const MealdropOrderConfirmationLink: Story = {
  tags: ['examples'],
  render: () => <>TODO</>,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestRendersAnAnchor: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Order again' })).toHaveAttribute(
      'href',
      '/orders'
    )
  },
}

export const TestRenderKeepsItsOwnDestination: Story = {
  tags: ['tests'],
  args: { href: undefined, render: <RouterLink to="/orders" /> },
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('[data-router-link]')

    // `href` is omitted rather than spread as undefined, which would clobber
    // the destination the router element computes from `to`.
    await expect(link).toHaveAttribute('href', '/orders')
  },
}

export const TestMergesClassName: Story = {
  tags: ['tests'],
  args: { className: 'link-demo-custom' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Order again' })

    await expect(link).toHaveClass('droppy-Link')
    await expect(link).toHaveClass('link-demo-custom')
  },
}
