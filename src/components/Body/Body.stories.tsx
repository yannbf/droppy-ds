import type { Meta, StoryObj } from '@storybook/react-vite'
import { Body } from './Body'

const meta = {
  title: 'Typography/Body',
  component: Body,
  args: { children: 'The kitchen closes at 10pm, last orders 9:30.' },
  argTypes: {
    children: { control: 'text', description: 'The text, or any nodes to render inside.' },
    size: {
      control: 'radio',
      options: [undefined, 'S', 'XS', 'XXS'],
      description: 'Visual size step. Absent renders the base body size.',
    },
    fontWeight: {
      control: 'radio',
      options: ['regular', 'medium', 'bold', 'black'],
      description: 'Font weight, independent of `size` and `type`.',
    },
    type: {
      control: 'radio',
      options: ['p', 'span', 'label', 'figcaption'],
      description: 'The rendered element.',
    },
    color: {
      control: 'text',
      description: 'Overrides the text color inline. Unset, follows the primary text token.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Body` class.',
    },
  },
} satisfies Meta<typeof Body>

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
  args: { children: 'Body text' },
}
