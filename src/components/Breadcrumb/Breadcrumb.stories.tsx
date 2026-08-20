import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { BreadcrumbProps } from './Breadcrumb'
import { Breadcrumb } from './Breadcrumb'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof BreadcrumbProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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

/**
 * The trail above a category page. Edit the items in the controls to add or
 * remove crumbs — the last one is always the current page.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { items: [{ label: 'categories', href: '/categories' }, { label: 'sushi' }] },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The landmark, the list, and one crumb per item with its separator. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('items', 'className'),
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The `<nav aria-label="breadcrumb">` landmark.' },
        { id: 'list', name: 'List', description: 'The `<ol>` — crumb order is document order.' },
        {
          id: 'item',
          name: 'Item',
          description: 'One `<li>` per crumb, holding it and its separator.',
        },
        { id: 'link', name: 'Link', description: 'A crumb with a destination, rendered as `<a>`.' },
        {
          id: 'text',
          name: 'Text',
          description: 'A crumb with no destination, rendered as `<span>` — usually the last one.',
        },
        {
          id: 'separator',
          name: 'Separator',
          description: 'The `aria-hidden` slash between crumbs; never announced.',
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
