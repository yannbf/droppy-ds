import type { ComponentProps } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'

import type { BreadcrumbProps } from './Breadcrumb'
import { Breadcrumb } from './Breadcrumb'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof BreadcrumbProps>) =>
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

/** `items` is the trail. A crumb with no `href` and no `render` renders as text. */
export const Items: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: {
    items: [
      { label: 'home', href: '/' },
      { label: 'categories', href: '/categories' },
      { label: 'asian', href: '/categories/asian' },
      { label: 'sushi' },
    ],
  },
}

/** A single crumb is the current page on its own — no separator is rendered. */
export const SingleCrumb: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { items: [{ label: 'restaurants' }] },
}

/**
 * Item `render` swaps the default `<a>` for a router-aware link, cloned with
 * the crumb's class and — on the last item — `aria-current`.
 */
export const ItemRender: Story = {
  tags: ['api-ref', 'highlight'],
  argTypes: hide('className'),
  args: {
    items: [
      { label: 'categories', render: <RouterLink to="/categories" /> },
      { label: 'sushi', render: <RouterLink to="/categories/sushi" /> },
    ],
  },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  args: {
    className: 'breadcrumb-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.breadcrumb-demo-inset { margin: 1rem; }`}</style>
      <Breadcrumb {...args} />
    </>
  ),
}

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
