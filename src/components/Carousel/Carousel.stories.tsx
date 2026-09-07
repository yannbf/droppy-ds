import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '../Card'

import type { CarouselProps } from './Carousel'
import { Carousel } from './Carousel'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof CarouselProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

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

/** `children` become the slides — one wrapper is added per child. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('slidesToScroll', 'className'),
  args: { children: Array.from({ length: 4 }, (_, i) => <Tile key={i} label={`Card ${i + 1}`} />) },
}

/** `itemsPerView` sets how many fit per breakpoint. Fractions show a sliver of the next. */
export const ItemsPerView: Story = {
  tags: ['api-ref'],
  argTypes: hide('slidesToScroll', 'className'),
  args: { itemsPerView: { mobile: 1, tablet: 2, desktop: 3 } },
}

/** `slidesToScroll` advances more than one item per arrow click. */
export const SlidesToScroll: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { slidesToScroll: { desktop: 4 } },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('slidesToScroll'),
  args: { className: 'carousel-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.carousel-demo-inset { margin: 1rem; }`}</style>
      <Carousel {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The rail, its viewport and track, one wrapper per slide, and the arrows. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'itemsPerView', 'slidesToScroll', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'Carries the per-breakpoint item counts as CSS custom properties.',
        },
        { id: 'viewport', name: 'Viewport', description: 'The clipped window Embla drives.' },
        { id: 'container', name: 'Container', description: 'The track that slides horizontally.' },
        {
          id: 'slide',
          name: 'Slide',
          description: 'One wrapper per child; dims when not almost fully in view.',
        },
        {
          id: 'nav',
          name: 'Nav',
          description: 'Previous/next arrows. Only mounted when that direction can scroll.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
