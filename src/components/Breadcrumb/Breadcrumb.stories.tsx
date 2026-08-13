import type { ComponentProps } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import type { BreadcrumbProps } from './Breadcrumb'
import { Breadcrumb } from './Breadcrumb'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof BreadcrumbProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** Placeholder for an examples story whose content lands in a later session.
 *  Paints its own background so it keeps contrast on any surface. */
const TODO = (
  <p style={{ margin: 0, padding: '0.5rem', background: '#ffffff', color: '#1a1a1a' }}>TODO</p>
)

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

/**
 * The last crumb carries `aria-current="page"` whether it renders as a link or
 * as plain text, and the whole trail sits in a `<nav aria-label="breadcrumb">`
 * landmark — the semantics Mealdrop's `div`/`p` version had none of.
 */
export const CurrentPageIsMarked: Story = {
  tags: ['highlight'],
  argTypes: hide('className'),
  args: {
    items: [
      { label: 'categories', href: '/categories' },
      { label: 'sushi', href: '/categories/sushi' },
    ],
  },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The landmark, the list, and one crumb per item with its separator. */
export const Anatomy: Story = {
  tags: ['infra'],
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

/**
 * TODO — real content lands in the dedicated examples session.
 *
 * Mined from Mealdrop (`agentic-reference/droppy`): one import, in
 * `CategoryDetailPage.tsx`, where the trail sits under the `TopBanner` on a
 * category page. The story to write: that page header — `TopBanner` with the
 * category photo, the breadcrumb 'categories / sushi' beneath it — with the
 * crumbs using `render={<RouterLink …/>}`, since Mealdrop had `react-router`'s
 * `Link` baked into the component before the escape hatch replaced it
 * (docs/MEALDROP-PARITY.md).
 */
export const MealdropCategoryTrail: Story = {
  tags: ['examples'],
  render: () => TODO,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestCurrentPageIsMarked: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('sushi')).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByText('categories')).not.toHaveAttribute('aria-current')
  },
}

export const TestLandmarkIsLabelled: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument()
  },
}

export const TestRenderKeepsItsOwnDestination: Story = {
  tags: ['tests'],
  args: {
    items: [
      { label: 'categories', render: <RouterLink to="/categories" /> },
      { label: 'sushi', render: <RouterLink to="/categories/sushi" /> },
    ],
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-router-link]')).toHaveLength(2)
    await expect(canvas.getByText('sushi')).toHaveAttribute('aria-current', 'page')
  },
}

export const TestSeparatorIsNotAnnounced: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    const separator = canvasElement.querySelector('.droppy-Breadcrumb-separator')

    await expect(separator).toHaveAttribute('aria-hidden', 'true')
  },
}
