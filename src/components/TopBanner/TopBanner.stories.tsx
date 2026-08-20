import type { Meta, StoryObj } from '@storybook/react-vite'
import { TopBanner } from './TopBanner'

// A tiny inline gradient standing in for a restaurant photo, so the story has
// no network dependency.

const meta = {
  title: 'Media & content/TopBanner',
  component: TopBanner,
  args: { title: 'Categories' },
  argTypes: {
    title: { control: 'text', description: 'Rendered as an `h2`. Omitted, the banner is bare.' },
    photoUrl: {
      control: 'text',
      description: 'Background image. Present, the heading switches to its on-photo treatment.',
    },
    onBackClick: {
      control: false,
      description:
        'Accepted for call-site parity with Mealdrop’s `TopBanner`. No control is rendered, so it is never invoked.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-TopBanner` class.',
    },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TopBanner>

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
}
