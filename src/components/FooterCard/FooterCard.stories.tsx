import type { ComponentProps } from 'react'
import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import type { FooterCardProps } from './FooterCard'
import { FooterCard } from './FooterCard'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof FooterCardProps | 'children'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

// Stands in for a router's own link component (e.g. react-router's `Link`).
const RouterLink = ({ to, children, ...rest }: { to: string } & ComponentProps<'a'>) => (
  <a href={to} data-router-link="" {...rest}>
    {children}
  </a>
)

const meta = {
  title: 'Navigation/FooterCard',
  component: FooterCard,
  args: {
    title: 'Discover us',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Categories', href: '/categories' },
      { name: 'About', href: '/about' },
    ],
  },
  argTypes: {
    title: { control: 'text', description: 'Column heading, rendered as an `h2`.' },
    links: {
      control: 'object',
      description:
        'The link list, as `{ name, href?, external?, render? }`. Empty renders no list.',
    },
    children: {
      control: false,
      description: 'Arbitrary content below the list — app badges, a paragraph.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-FooterCard` class.',
    },
  },
  decorators: [
    // FooterCard's text color assumes a dark footer surface — this decorator
    // renders every story against the canonical token for that surface
    // rather than a guessed color, so the contrast claim is demonstrable.
    (Story) => (
      <div
        style={{
          background: 'var(--ds-color-surface-inverse)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FooterCard>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One column of a page footer. Title and links are both set below, so the
 * controls start populated — edit the list to add or remove entries.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: {
    title: 'Discover us',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Categories', href: '/categories' },
      { name: 'About', href: '/about' },
    ],
  },
  argTypes: hide('children', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `title` is the column heading, rendered as an `h2`. */
export const Title: Story = {
  tags: ['api-ref'],
  argTypes: hide('links', 'children', 'className'),
  args: { title: 'Our social media' },
}

/** `links` is the list. Omitted or empty, no `<ul>` is rendered at all. */
export const Links: Story = {
  tags: ['api-ref'],
  argTypes: hide('children', 'className'),
  args: {
    links: [
      { name: 'Home', href: '/' },
      { name: 'Categories', href: '/categories' },
    ],
  },
}

/** Item `external` opens in a new tab with `rel="noopener noreferrer"`. */
export const ExternalLinks: Story = {
  tags: ['api-ref', 'highlight'],
  argTypes: hide('children', 'className'),
  args: {
    title: 'Our social media',
    links: [
      { name: 'Facebook', href: 'https://facebook.com', external: true },
      { name: 'Instagram', href: 'https://instagram.com', external: true },
    ],
  },
}

/** Item `render` swaps the default `<a>` for a router-aware link, per item. */
export const ItemRender: Story = {
  tags: ['api-ref', 'highlight'],
  argTypes: hide('children', 'className'),
  args: {
    links: [
      { name: 'Home', render: <RouterLink to="/" /> },
      { name: 'Categories', render: <RouterLink to="/categories" /> },
    ],
  },
}

/** `children` render below the list — app store badges, a short paragraph. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('links', 'className'),
  args: { title: 'Check our apps', links: [] },
  render: (args) => (
    <FooterCard {...args}>
      {/* No color set here — it inherits FooterCard's own on-dark text color. */}
      <p style={{ margin: 0 }}>Available on iOS and Android.</p>
    </FooterCard>
  ),
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('links', 'children'),
  args: { className: 'footercard-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.footercard-demo-inset { margin: 1rem; }`}</style>
      <FooterCard {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The column, its heading, and the list of links inside it. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('title', 'links', 'children', 'className'),
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The column: heading above, list below.' },
        { id: 'title', name: 'Title', description: 'The `h2` column heading.' },
        { id: 'list', name: 'List', description: 'The `<ul>`; absent when `links` is empty.' },
        { id: 'item', name: 'Item', description: 'One `<li>` per entry.' },
        {
          id: 'link',
          name: 'Link',
          description: 'The `Link` inside it — an `<a>`, or whatever `render` supplies.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** Mealdrop's footer link columns. */
export const MealdropFooterRow: Story = {
  tags: ['examples'],
  argTypes: hide('title', 'links', 'children', 'className'),
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
      <FooterCard
        title="Discover us"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Categories', href: '/categories' },
          { name: 'About', href: '/about' },
        ]}
      />

      <FooterCard
        title="Our social media"
        links={[
          { name: 'Facebook', href: 'https://facebook.com', external: true },
          { name: 'Instagram', href: 'https://instagram.com', external: true },
          { name: 'Twitter', href: 'https://twitter.com', external: true },
        ]}
      />

      <FooterCard title="Check our apps">
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <img src="https://placehold.co/120x40?text=App+Store" alt="Download on the App Store" />
          <img src="https://placehold.co/120x40?text=Google+Play" alt="Get it on Google Play" />
        </div>
      </FooterCard>
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestLinksResolve: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Categories' })).toHaveAttribute(
      'href',
      '/categories'
    )
  },
}

export const TestExternalLinksAreSafe: Story = {
  tags: ['tests'],
  args: {
    links: [{ name: 'Facebook', href: 'https://facebook.com', external: true }],
  },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Facebook' })

    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  },
}

export const TestEmptyLinksRendersNoList: Story = {
  tags: ['tests'],
  args: { links: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('list')).not.toBeInTheDocument()
    await expect(canvas.getByRole('heading', { level: 2 })).toBeInTheDocument()
  },
}

export const TestItemRenderKeepsItsDestination: Story = {
  tags: ['tests'],
  args: { links: [{ name: 'Categories', render: <RouterLink to="/categories" /> }] },
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('[data-router-link]')

    await expect(link).toHaveAttribute('href', '/categories')
  },
}

export const Empty: Story = {
  tags: ['empty'],
  args: { title: 'Discover us' },
}
