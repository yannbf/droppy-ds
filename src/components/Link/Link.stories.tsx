import type { Meta, StoryObj } from '@storybook/react-vite'
import { Link } from './Link'

// Stands in for a router's own link component (e.g. react-router's `Link`) to
// demonstrate the `render` escape hatch without adding a router dependency to
// the design system's stories.

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

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

export const Empty: Story = { tags: ['empty'] }
