import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'

import { ScrollArea } from './ScrollArea'

const paragraphs = [
  `Vernacular architecture is building done outside any academic tradition, and without
  professional guidance. It is not a particular architectural movement or style, but rather a
  broad category encompassing a wide range of building types, with differing methods of
  construction, from around the world, both historical and modern.`,
  `This type of architecture usually serves immediate, local needs, is constrained by the
  materials available in its particular region and reflects local traditions and cultural
  practices. More recently it has been examined by designers and the building industry in an
  effort to be more energy conscious with contemporary design and construction.`,
  `Vernacular architecture constitutes the majority of the world's built environment, as
  measured against the small percentage of new buildings every year designed by architects
  and built by engineers.`,
]

const meta = {
  title: 'Layout & structure/ScrollArea',
  component: ScrollArea,
  args: {
    children: paragraphs.map((text, index) => <p key={index}>{text}</p>),
  },
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

/** A fixed-height panel of long text content with a single vertical
 *  scrollbar, revealed on hover or while scrolling. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    // The scrollbar renders after Base UI's overflow measurement effect runs,
    // so it isn't present on first paint — re-query inside waitFor.
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-orientation="vertical"]')).not.toBeNull()
    })
  },
}

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    children: (
      <div style={{ display: 'flex', gap: '1rem' }}>
        {Array.from({ length: 12 }, (_, index) => (
          <div
            key={index}
            style={{
              flex: '0 0 auto',
              width: '8rem',
              height: '4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--ds-color-border-subtle)',
            }}
          >
            Card {index + 1}
          </div>
        ))}
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-orientation="horizontal"]')).not.toBeNull()
    })
  },
}

/** Content overflowing both axes renders a scrollbar on each, plus the corner
 *  where the two tracks would otherwise intersect. */
export const BothAxes: Story = {
  args: {
    orientation: 'both',
    children: (
      <ul
        style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 4rem)', margin: 0, padding: 0 }}
      >
        {Array.from({ length: 100 }, (_, index) => (
          <li key={index} style={{ listStyle: 'none', padding: '0.5rem' }}>
            {index + 1}
          </li>
        ))}
      </ul>
    ),
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-orientation="vertical"]')).not.toBeNull()
      expect(canvasElement.querySelector('[data-orientation="horizontal"]')).not.toBeNull()
    })
  },
}
