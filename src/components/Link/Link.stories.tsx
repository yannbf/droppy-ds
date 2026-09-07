import type { ComponentProps } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Body } from '../Body'
import { Card } from '../Card'
import { Heading } from '../Heading'

import type { LinkProps } from './Link'
import { Link } from './Link'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof LinkProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

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

export const Default: Story = {
  tags: ['showcase'],
  args: { children: 'Order again', href: '/orders' },
  argTypes: hide('render', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('render', 'className'),
  args: { children: 'Track your order' },
}

export const Href: Story = {
  tags: ['api-ref'],
  argTypes: hide('render', 'className'),
  args: { href: 'https://droppy.example/help', children: 'Visit the help centre' },
}

export const Render: Story = {
  tags: ['api-ref', 'highlight'],
  argTypes: hide('href', 'className'),
  args: { href: undefined, render: <RouterLink to="/orders" /> },
}

export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('render'),
  args: {
    className: 'link-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.link-demo-inset { margin: 1rem; }`}</style>
      <Link {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

export const Inline: Story = {
  tags: ['highlight'],
  argTypes: hide('render', 'className'),
  render: (args) => (
    <p>
      Your order is on its way. <Link {...args}>Track it</Link> or view the receipt.
    </p>
  ),
}

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

export const Anatomy: Story = {
  tags: ['anatomy'],
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

export const MealdropOrderConfirmationLink: Story = {
  tags: ['examples'],
  argTypes: hide('href', 'render', 'children', 'className'),
  render: () => (
    <Card padded style={{ maxWidth: '28rem' }}>
      <Heading level={3} size={4}>
        Thanks, your order is on its way
      </Heading>

      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        <Body size="S">
          Burger Kingdom is preparing order DB-2291.{' '}
          <Link href="https://example.com/orders/DB-2291">Track it</Link> on the courier&apos;s
          site.
        </Body>

        <Body size="S">
          Or follow it in the app —{' '}
          <Link render={<RouterLink to="/orders/DB-2291" />}>track it here</Link> without leaving
          Mealdrop.
        </Body>
      </div>
    </Card>
  ),
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
