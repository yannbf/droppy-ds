import type { ComponentProps } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Body } from '../Body'
import { Card } from '../Card'
import { Heading } from '../Heading'

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

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part, whose tag is the `<a>` — or whatever `render` supplies. */
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

/** An order-confirmation paragraph with an inline link. */
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
