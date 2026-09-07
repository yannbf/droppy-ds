import type { ComponentProps } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

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

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
