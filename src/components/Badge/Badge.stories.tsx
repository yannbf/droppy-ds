import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { BadgeProps } from './Badge'
import { Badge } from './Badge'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof BadgeProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const meta = {
  title: 'Feedback & status/Badge',
  component: Badge,
  args: { text: 'vegan' },
  argTypes: {
    text: {
      control: 'text',
      description: 'The label. Rendered capitalized regardless of the casing passed in.',
    },
    variant: {
      control: 'radio',
      options: ['neutral', 'positive'],
      description: '`positive` matches the look of an affirmative flag, e.g. "new".',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Badge` class.',
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A dietary tag on a menu item. Both props are set below, so the controls
 * start populated — edit the text or flip the variant to see the two looks.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { text: 'vegan', variant: 'neutral' },
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

/** A single part: `Badge` renders one `<span>` and nothing inside it. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('text', 'variant', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `<span>` carrying the pill background, radius, and capitalization.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

// Mealdrop's own listings (`src/stub/restaurants.ts`) — one rated, one newly listed.

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
