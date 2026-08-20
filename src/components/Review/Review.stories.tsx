import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'

import type { ReviewProps } from './Review'
import { Review } from './Review'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ReviewProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A wrapper and the text line inside it. */
export const Anatomy: Story = {
  tags: ['anatomy'],
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

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
