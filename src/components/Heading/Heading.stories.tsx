import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading } from './Heading'

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  args: { children: 'Best food in town' },
  argTypes: {
    children: { control: 'text', description: 'The heading text.' },
    level: {
      control: 'radio',
      options: [1, 2, 3, 4, 5],
      description: 'The rendered tag (`h1`–`h5`). Also the size step when `size` is unset.',
    },
    size: {
      control: 'radio',
      options: [undefined, 1, 2, 3, 4, 5],
      description: 'Visual size step, independent of `level`. Defaults to `level`.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Heading` class.',
    },
  },
} satisfies Meta<typeof Heading>

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

export const Empty: Story = { tags: ['empty'] }
