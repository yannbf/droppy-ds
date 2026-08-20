import type { Meta, StoryObj } from '@storybook/react-vite'
import { FooterCard } from './FooterCard'

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

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
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
  args: { title: 'Legal mentions' },
}
