import type { Meta, StoryObj } from '@storybook/react-vite'

import { Breadcrumb } from './Breadcrumb'

// Stands in for a router's own link component (e.g. react-router's `Link`) to
// demonstrate the `render` escape hatch without adding a router dependency to
// the design system's stories.

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  args: { items: [{ label: 'categories', href: '/categories' }, { label: 'sushi' }] },
  argTypes: {
    items: {
      control: 'object',
      description:
        'The trail, as `{ label, href?, render? }`. The last item is the current page and never links out.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Breadcrumb` class.',
    },
  },
} satisfies Meta<typeof Breadcrumb>

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

export const Empty: Story = {
  tags: ['empty'],
  args: { items: [{ label: 'parent', href: '/parent' }, { label: 'current page' }] },
}
