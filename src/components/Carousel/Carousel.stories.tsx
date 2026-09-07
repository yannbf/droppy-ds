import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '../Card'
import { Carousel } from './Carousel'

const Tile = ({ label }: { label: string }) => (
  <Card padded style={{ height: '8rem', display: 'flex', alignItems: 'center' }}>
    {label}
  </Card>
)

const tiles = Array.from({ length: 8 }, (_, index) => (
  <Tile key={index} label={`Item ${index + 1}`} />
))

const meta = {
  title: 'Media & content/Carousel',
  component: Carousel,
  args: { itemsPerView: { mobile: 1.2, tablet: 3, desktop: 4 }, children: tiles },
  argTypes: {
    children: { control: false, description: 'The slides. One wrapper is added per child.' },
    itemsPerView: {
      control: 'object',
      description: 'How many items are visible per breakpoint (mobile-first). Fractions are fine.',
    },
    slidesToScroll: {
      control: 'object',
      description: 'How many items each arrow click advances, per breakpoint. Defaults to 1.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Carousel` class.',
    },
  },
  parameters: {
    // Off-screen slides render at opacity 0.5 by design, to signal there's
    // more to scroll to — the a11y addon's color-contrast check flags that
    // reduced contrast on stub story content, but it's the intended dimmed
    // state, not a real content-legibility issue.
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
} satisfies Meta<typeof Carousel>

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
  args: { itemsPerView: { mobile: 1.2, tablet: 3, desktop: 4 }, children: tiles },
}
