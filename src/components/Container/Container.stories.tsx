import type { Meta, StoryObj } from '@storybook/react-vite'
import { Container } from './Container'

const meta = {
  title: 'Layout & structure/Container',
  component: Container,
  args: { children: 'Page content' },
  argTypes: {
    children: { control: 'text', description: 'The page content the wrapper bounds.' },
    desktopOnly: {
      control: 'boolean',
      description:
        'Applies the max-width and side padding from the desktop breakpoint (1024px) up, rather than immediately.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Container` class.',
    },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */

export const Empty: Story = { tags: ['empty'] }
