import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './Card'

const meta = {
  title: 'Media & content/Card',
  component: Card,
  args: { children: 'Card content' },
  argTypes: {
    children: { control: 'text', description: 'Whatever the card groups — no slots.' },
    interactive: {
      control: 'boolean',
      description: 'Hover dim + pointer cursor. Appearance only — wire your own click handling.',
    },
    padded: {
      control: 'boolean',
      description: 'Adds `--ds-space-sm` padding on all sides. Bare by default.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Card` class.',
    },
  },
} satisfies Meta<typeof Card>

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
