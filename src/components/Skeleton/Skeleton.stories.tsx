import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Heading } from '../Heading'

import type { SkeletonProps } from './Skeleton'
import { Skeleton } from './Skeleton'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SkeletonProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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

/** `className` merges with the component's own class rather than replacing it. */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('style'),
  args: { className: 'skeleton-demo-round', height: 48, width: 48 },
  render: (args) => (
    <>
      <style>{`.skeleton-demo-round { border-radius: 50%; }`}</style>
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
  tags: ['infra'],
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

/**
 * TODO — real content lands in the dedicated examples session.
 *
 * Mined from Mealdrop (`agentic-reference/droppy`): imported by
 * `RestaurantCard`, which renders a skeleton twin of itself while the
 * restaurant list loads. The story to write: that card's loading state, a
 * `Skeleton` photo block above skeleton lines matching the real title,
 * `Review`, and category rows — wrapped in one `role="status"` labelled
 * 'Loading restaurants' with the placeholders `aria-hidden` beneath it. Worth
 * showing beside the resolved card so the widths visibly line up. Mealdrop
 * needed a `<SkeletonTheme>` wrapper around `react-loading-skeleton` to colour
 * it; Droppy's reads the skeleton tokens directly, so the wrapper and the
 * dependency both disappear (docs/MEALDROP-PARITY.md).
 */
export const MealdropRestaurantCardLoading: Story = {
  tags: ['examples'],
  render: () => <>TODO</>,
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
