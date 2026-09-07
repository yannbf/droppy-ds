import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { iconNames } from '../Icon'

import type { IconButtonProps } from './IconButton'
import { IconButton } from './IconButton'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof IconButtonProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const meta = {
  title: 'Actions/IconButton',
  component: IconButton,
  args: { name: 'arrow-right', 'aria-label': 'next', onClick: fn() },
  argTypes: {
    name: { control: 'select', options: iconNames, description: 'Which icon to render.' },
    small: { control: 'boolean', description: 'Renders the 3rem variant instead of 4rem.' },
    onClick: { description: 'Fired on click.' },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-IconButton` class.',
    },
  },
} satisfies Meta<typeof IconButton>

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

export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('name', 'small', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The circular `<button>`: fixed size, radius, and focus ring.',
        },
        {
          id: 'icon',
          name: 'Icon',
          description: 'The glyph, sized from `small` and coloured independently of the theme.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
