import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { FooterCardProps } from './FooterCard'
import { FooterCard } from './FooterCard'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof FooterCardProps | 'children'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

// Stands in for a router's own link component (e.g. react-router's `Link`).

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
    (Story) => (
      <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '0.5rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FooterCard>

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
