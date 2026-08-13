import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import type { ReviewProps } from './Review'
import { Review } from './Review'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ReviewProps>) =>
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

const meta = {
  title: 'Feedback & status/Review',
  component: Review,
  args: { rating: 4.5 },
  argTypes: {
    rating: {
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
      description: 'Average out of 5. Unset or falsy renders “No reviews yet”.',
    },
    color: {
      control: 'text',
      description: 'Overrides the quiet review text token (`--ds-color-text-review`).',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Review` class.',
    },
  },
} satisfies Meta<typeof Review>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A restaurant's score line. Drag the rating control across the bands to watch
 * the label change — and past zero to see the empty state.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { rating: 4.5 },
  argTypes: hide('color', 'className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `rating` drives both the number and the word beside it. */
export const Rating: Story = {
  tags: ['api-ref'],
  argTypes: hide('rating', 'color', 'className'),
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.25rem' }}>
      {[1, 3, 4.5, 5].map((rating) => (
        <Review {...args} key={rating} rating={rating} />
      ))}
      <Review {...args} rating={undefined} />
    </div>
  ),
}

/** `color` overrides the deliberately quiet default token. */
export const Color: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { rating: 4.2, color: '#0a7d32' },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('color'),
  args: {
    className: 'review-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.review-demo-inset { margin: 1rem; }`}</style>
      <Review {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The bands are fixed: under 2 is "Very poor", 2–4 "Adequate", 4–5 "Very
 * good", and exactly 5 "Excellent". The number is always shown to one decimal,
 * so 4 and 4.0 read the same.
 */
export const RatingBands: Story = {
  tags: ['highlight'],
  argTypes: hide('rating', 'color', 'className'),
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.25rem' }}>
      {[1, 1.9, 2, 3.9, 4, 4.9, 5].map((rating) => (
        <Review {...args} key={rating} rating={rating} />
      ))}
    </div>
  ),
}

/** No rating renders a plain fallback line instead of a zero-star score. */
export const NoReviews: Story = {
  tags: ['highlight'],
  argTypes: hide('color', 'className'),
  args: { rating: undefined },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A wrapper and the text line inside it. */
export const Anatomy: Story = {
  tags: ['infra'],
  argTypes: hide('rating', 'color', 'className'),
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The wrapper the caller positions.' },
        {
          id: 'text',
          name: 'Text',
          description: 'The score line — star, number, and band label as one string.',
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
 * Mined from Mealdrop (`agentic-reference/droppy`): `Review.tsx` wraps it for
 * the restaurant tiles, passing its own colour. The story to write: the
 * restaurant card row it lives in — 'Burger Kingdom' with `rating={4.2}`
 * beside its categories — next to a newly-listed restaurant with no rating at
 * all, since the empty state is the case the tile has to survive. The colour
 * override belongs in that story too: Mealdrop's tiles set their own, which is
 * exactly what `color` exists for.
 */
export const MealdropRestaurantScores: Story = {
  tags: ['examples'],
  render: () => TODO,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestFormatsTheScoreLine: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('★ 4.5 Very good')).toBeInTheDocument()
  },
}

export const TestBandBoundaries: Story = {
  tags: ['tests'],
  render: () => (
    <>
      <Review rating={1.9} />
      <Review rating={2} />
      <Review rating={3.9} />
      <Review rating={4} />
      <Review rating={5} />
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('★ 1.9 Very poor')).toBeInTheDocument()
    await expect(canvas.getByText('★ 2.0 Adequate')).toBeInTheDocument()
    await expect(canvas.getByText('★ 3.9 Adequate')).toBeInTheDocument()
    await expect(canvas.getByText('★ 4.0 Very good')).toBeInTheDocument()
    await expect(canvas.getByText('★ 5.0 Excellent')).toBeInTheDocument()
  },
}

export const TestNoReviewsFallback: Story = {
  tags: ['tests'],
  args: { rating: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No reviews yet')).toBeInTheDocument()
  },
}
