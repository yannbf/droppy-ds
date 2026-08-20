import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import type { ErrorBlockProps } from './ErrorBlock'
import { ErrorBlock } from './ErrorBlock'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ErrorBlockProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const sushiIllustration = (
  <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
    <circle cx="60" cy="60" r="56" fill="var(--ds-color-surface-sunken)" />
    <circle cx="60" cy="60" r="34" fill="var(--ds-palette-neutral-0)" />
    <circle cx="60" cy="60" r="14" fill="var(--ds-palette-brand-200)" />
  </svg>
)

const meta = {
  title: 'Feedback & status/ErrorBlock',
  component: ErrorBlock,
  args: {
    title: 'This is not the food you’re looking for.',
    body: 'There seems that there are no restaurants in this category yet. Try to come back later?',
    buttonText: 'See all restaurants',
    onButtonClick: fn(),
  },
  argTypes: {
    title: { control: 'text', description: 'Rendered as an `h2` at the top of the block.' },
    body: { control: 'text', description: 'The explanation, as body copy.' },
    buttonText: { control: 'text', description: 'Label for the single recovery action.' },
    onButtonClick: { description: 'Fired by that action.' },
    illustration: {
      control: false,
      description:
        'Optional slot — an inline SVG, an image, or an animation the caller drives itself.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-ErrorBlock` class.',
    },
  },
} satisfies Meta<typeof ErrorBlock>

export default meta
type Story = StoryObj<typeof meta>

/**
 * An empty category with a way out. Title, body, and action are all set below,
 * so the controls start populated.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { illustration: sushiIllustration },
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

/** Title, optional illustration, body, and one action — in that DOM order. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('title', 'body', 'buttonText', 'illustration', 'className'),
  args: { illustration: sushiIllustration },
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The centred column holding the whole message.' },
        { id: 'title', name: 'Title', description: 'The `h2`, first in the DOM.' },
        {
          id: 'illustration',
          name: 'Illustration',
          description: 'The optional slot; absent, nothing is rendered in its place.',
        },
        { id: 'body', name: 'Body', description: 'The explanation copy.' },
        { id: 'action', name: 'Action', description: 'The single recovery Button.' },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
