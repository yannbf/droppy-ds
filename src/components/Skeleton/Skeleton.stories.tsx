import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Badge } from '../Badge'
import { Body } from '../Body'
import { Card } from '../Card'
import { Heading } from '../Heading'
import { Review } from '../Review'

import type { SkeletonProps } from './Skeleton'
import { Skeleton } from './Skeleton'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SkeletonProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const meta = {
  title: 'Feedback & status/Skeleton',
  component: Skeleton,
  argTypes: {
    width: {
      control: 'text',
      description: 'Numbers are treated as pixels; strings pass through. Defaults to `100%`.',
    },
    height: {
      control: 'text',
      description: 'Numbers are treated as pixels; strings pass through. Defaults to `1em`.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Skeleton` class.',
    },
    style: { control: false, description: 'Merged after the computed width and height.' },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A placeholder line inside a paragraph, taking the height of the surrounding
 * font. Both dimensions are set below, so the controls start populated.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { width: '100%', height: '1em' },
  argTypes: hide('className', 'style'),
  render: (args) => (
    <p style={{ margin: 0, fontSize: '1.5rem' }}>
      <Skeleton {...args} />
    </p>
  ),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `width` takes a number of pixels or any CSS length. */
export const Width: Story = {
  tags: ['api-ref'],
  argTypes: hide('width', 'className', 'style'),
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.5rem', maxWidth: 320 }}>
      <Skeleton {...args} width="100%" />
      <Skeleton {...args} width="60%" />
      <Skeleton {...args} width={120} />
    </div>
  ),
}

/** `height` defaults to `1em`, so a bare skeleton matches its text context. */
export const Height: Story = {
  tags: ['api-ref'],
  argTypes: hide('height', 'className', 'style'),
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.5rem', maxWidth: 320 }}>
      <Skeleton {...args} height="1em" />
      <Skeleton {...args} height={40} />
      <Skeleton {...args} height="6rem" />
    </div>
  ),
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('style'),
  args: {
    className: 'skeleton-demo-inset',
    width: 200,
    height: 24,
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.skeleton-demo-inset { margin: 1rem; }`}</style>
      <Skeleton {...args} />
    </>
  ),
}

/** `style` is merged after the computed width and height, so it can add anything else. */
export const Style: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { width: '100%', height: 200, style: { borderRadius: '4px 4px 0 0' } },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Skeleton {...args} />
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * A card's text column while it loads: each width fixed to the shape it stands
 * in for, so the layout doesn't jump once the real copy arrives. The loading
 * container owns the announcement — the placeholders underneath are hidden.
 */
export const TextBlock: Story = {
  tags: ['highlight'],
  argTypes: hide('width', 'height', 'className', 'style'),
  render: (args) => (
    <div role="status" aria-label="Loading restaurant details" style={{ maxWidth: 320 }}>
      <div aria-hidden="true">
        <Heading level={2}>
          <Skeleton {...args} width="50%" />
        </Heading>
        <p style={{ margin: '0.5rem 0' }}>
          <Skeleton {...args} width="35%" />
        </p>
        <p style={{ margin: '0.5rem 0' }}>
          <Skeleton {...args} />
        </p>
        <p style={{ margin: 0 }}>
          <Skeleton {...args} width="25%" height="23px" style={{ marginTop: 24 }} />
        </p>
      </div>
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

/**
 * The shimmer is a gradient swept by CSS keyframes, entirely from
 * `Skeleton.css`. Unlike Spinner, it is removed outright under
 * `prefers-reduced-motion` — a placeholder still reads as a placeholder when
 * it holds still, so nothing is lost by stopping it.
 */
export const ShimmerAnimation: Story = {
  tags: ['animation'],
  argTypes: hide('width', 'height', 'className', 'style'),
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('.droppy-Skeleton') as HTMLElement
    const computed = getComputedStyle(skeleton)

    await expect(computed.animationName).toBe('droppy-skeleton-shimmer')
    await expect(computed.backgroundImage).toContain('gradient')
  },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: one `aria-hidden` `<span>` with no children. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('width', 'height', 'className', 'style'),
  args: { width: 200, height: 24 },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The `aria-hidden` `<span>` carrying the computed size and the shimmer gradient.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** A restaurant tile loading, beside the tile it becomes. */
export const MealdropRestaurantCardLoading: Story = {
  tags: ['examples'],
  argTypes: hide('width', 'height', 'className', 'style'),
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
      <div role="status" aria-label="Loading restaurants">
        <Card aria-hidden style={{ width: '18rem' }}>
          <Skeleton height={160} />
          <div style={{ display: 'grid', gap: '0.5rem', padding: '1.5rem' }}>
            <Heading level={2} size={4}>
              <Skeleton width="60%" />
            </Heading>
            <Body size="S">
              <Skeleton width="45%" />
            </Body>
            <Body size="S">
              <Skeleton width="80%" />
            </Body>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Skeleton width={72} height={24} />
              <Skeleton width={104} height={24} />
            </div>
          </div>
        </Card>
      </div>

      <Card style={{ width: '18rem' }}>
        <img
          src="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1003&q=20"
          alt=""
          style={{ display: 'block', height: 160, width: '100%', objectFit: 'cover' }}
        />
        <div style={{ display: 'grid', gap: '0.5rem', padding: '1.5rem' }}>
          <Heading level={2} size={4}>
            Burger Kingdom
          </Heading>
          <Review rating={4.2} />
          <Body size="S">Nicest place for burgers</Body>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Badge text="burgers" />
            <Badge text="comfort food" />
          </div>
        </div>
      </Card>
    </div>
  ),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestHiddenFromAssistiveTech: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.droppy-Skeleton')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
  },
}

export const TestNumbersBecomePixels: Story = {
  tags: ['tests'],
  args: { width: 120, height: 40 },
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('.droppy-Skeleton') as HTMLElement

    await expect(skeleton.style.width).toBe('120px')
    await expect(skeleton.style.height).toBe('40px')
  },
}

export const TestStringsPassThrough: Story = {
  tags: ['tests'],
  args: { width: '50%', height: '2rem' },
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('.droppy-Skeleton') as HTMLElement

    await expect(skeleton.style.width).toBe('50%')
    await expect(skeleton.style.height).toBe('2rem')
  },
}

export const Empty: Story = {
  tags: ['empty'],
}
