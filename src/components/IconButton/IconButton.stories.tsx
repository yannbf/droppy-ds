import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { iconNames } from '../Icon'

import { IconButton } from './IconButton'

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

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

export const Empty: Story = {
  tags: ['empty'],
  args: { name: 'arrow-right' },
}
