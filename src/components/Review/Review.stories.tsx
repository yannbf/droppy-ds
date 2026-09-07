import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { ReviewProps } from './Review'
import { Review } from './Review'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ReviewProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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
