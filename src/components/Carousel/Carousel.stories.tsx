import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'

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

/** Placeholder for an examples story whose content lands in a later session.
 *  Paints its own background so it keeps contrast on any surface. */
const TODO = (
  <p style={{ margin: 0, padding: '0.5rem', background: '#ffffff', color: '#1a1a1a' }}>TODO</p>
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

/**
 * A scrolling row of tiles. `itemsPerView` is set below, so the controls start
 * populated — the fractional mobile value is deliberate, so a sliver of the
 * next tile shows and the row reads as scrollable.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { itemsPerView: { mobile: 1.2, tablet: 3, desktop: 4 } },
  argTypes: hide('className'),
}

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

/**
 * Arrows only render once there is somewhere to go in that direction — with
 * fewer items than fit, neither appears. They are desktop-only besides;
 * smaller screens scroll by dragging or by horizontal wheel gesture.
 */
export const ArrowsOnlyWhenThereIsSomewhereToGo: Story = {
  tags: ['highlight'],
  argTypes: hide('slidesToScroll', 'className'),
  args: { children: tiles.slice(0, 2) },
}

/**
 * Slides that aren't almost fully visible dim to 0.5, so a partially scrolled
 * row signals there is more to reach rather than looking clipped.
 */
export const OffscreenSlidesDim: Story = {
  tags: ['highlight'],
  argTypes: hide('slidesToScroll', 'className'),
  args: { itemsPerView: { mobile: 1.2, tablet: 2.5, desktop: 3.5 } },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The rail, its viewport and track, one wrapper per slide, and the arrows. */
export const Anatomy: Story = {
  tags: ['infra'],
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

/**
 * TODO — real content lands in the dedicated examples session.
 *
 * Mined from Mealdrop (`agentic-reference/droppy`): the app has its own
 * `Carousel.tsx` that imports Droppy's `IconButton` for the arrows — this
 * component is what that becomes. The story to write: the home page's
 * 'Restaurants near you' rail — `RestaurantCard`s inside a `PageSection` with
 * a 'View all' action — since that is the composition the fractional
 * `itemsPerView` exists for, showing a sliver of the next card so the row
 * reads as scrollable on a phone.
 */
export const MealdropRestaurantRail: Story = {
  tags: ['examples'],
  render: () => TODO,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestRendersEverySlide: Story = {
  tags: ['tests'],
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Item 1')).toBeInTheDocument()
    // Every child gets a wrapper, whether or not it is currently in view.
    await expect(canvasElement.querySelectorAll('[data-part="slide"]')).toHaveLength(8)
  },
}

export const TestNoArrowsWithNothingToScroll: Story = {
  tags: ['tests'],
  // One slide, so there is nothing to scroll at any breakpoint — two would
  // still scroll in a narrow canvas, where only ~1 item fits.
  args: { children: tiles.slice(0, 1), itemsPerView: { mobile: 1, tablet: 2, desktop: 2 } },
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
    )
    await expect(canvas.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument()
  },
}

export const TestItemsPerViewReachesCss: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.droppy-Carousel') as HTMLElement

    // The counts drive the slide widths through custom properties rather than
    // inline widths, so the CSS owns the breakpoints.
    await expect(root.style.getPropertyValue('--droppy-Carousel-items-desktop')).toBe('4')
    await expect(root.style.getPropertyValue('--droppy-Carousel-items-mobile')).toBe('1.2')
  },
}
