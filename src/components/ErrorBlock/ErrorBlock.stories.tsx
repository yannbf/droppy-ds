import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { ErrorBlock } from './ErrorBlock'

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

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
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
  args: {
    title: 'Title',
    body: 'Body',
    buttonText: 'Click me',
    onButtonClick: fn(),
  },
}
