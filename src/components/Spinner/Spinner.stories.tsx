import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import type { SpinnerProps } from './Spinner'
import { Spinner } from './Spinner'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SpinnerProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

const meta = {
  title: 'Feedback & status/Spinner',
  component: Spinner,
  argTypes: {
    label: {
      control: 'text',
      description:
        'Accessible name announced while the spinner is visible. The graphic itself is decorative.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Spinner` class.',
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

/**
 * An indeterminate wait. `label` is set below so the controls start populated —
 * change it to hear what a screen reader would announce.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { label: 'Loading' },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `label` becomes the accessible name on the `status` role. */
export const Label: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { label: 'Loading your order' },
}

/** `className` merges with the component's own class rather than replacing it. */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('label'),
  args: { className: 'spinner-demo-large' },
  render: (args) => (
    <>
      <style>{`.spinner-demo-large { width: 5rem; }`}</style>
      <Spinner {...args} />
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The graphic is `aria-hidden`, and the name rides on `aria-label` rather than
 * visually-hidden text — `role="status"` doesn't take its name from its
 * content the way a button or heading does.
 */
export const AccessibleName: Story = {
  tags: ['highlight'],
  argTypes: hide('className'),
  args: { label: 'Finding restaurants near you' },
}

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

/**
 * Three dots and two arcs run on CSS keyframes at 1.2s. Under
 * `prefers-reduced-motion` the animation is slowed to 4.8s rather than
 * removed: the motion is what communicates "loading", so stopping it would
 * leave a static graphic that says nothing.
 */
export const SpinAnimation: Story = {
  tags: ['animation'],
  argTypes: hide('label', 'className'),
  play: async ({ canvasElement }) => {
    const dot = canvasElement.querySelector('.droppy-Spinner-dot') as HTMLElement
    const arc = canvasElement.querySelector('.droppy-Spinner-arc--a') as HTMLElement

    await expect(getComputedStyle(dot).animationName).toBe('droppy-spinner-dot')
    await expect(getComputedStyle(dot).animationIterationCount).toBe('infinite')
    await expect(getComputedStyle(arc).animationName).toBe('droppy-spinner-arc-a')
  },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The status wrapper, the decorative graphic, and the shapes inside it. */
export const Anatomy: Story = {
  tags: ['infra'],
  argTypes: hide('label', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `role="status"` wrapper carrying the accessible name.',
        },
        {
          id: 'graphic',
          name: 'Graphic',
          description: 'The `aria-hidden` `<svg>`; nothing inside it is announced.',
        },
        {
          id: 'dot',
          name: 'Dot',
          description: 'Three circles on the same keyframes, staggered by `animation-delay`.',
        },
        { id: 'arc', name: 'Arc', description: 'The two sweeping wedges behind the dots.' },
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
 * Mined from Mealdrop (`agentic-reference/droppy`): no direct import; the app
 * shows loading with `Skeleton` placeholders instead. Per the brand guidelines
 * the spinner is one of only two places teal appears in DropBoard (the other
 * being the wordmark), so the story to write is a DropBoard one: the payouts
 * panel mid-fetch — a centred spinner labelled 'Loading payouts' — paired with
 * the same panel resolved, to make the point that a spinner is for waits whose
 * shape you can't predict, where `Skeleton` is for waits whose layout you can.
 */
export const DropBoardPayoutsLoading: Story = {
  tags: ['examples'],
  render: () => <>TODO</>,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestAnnouncesLoading: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  },
}

export const TestGraphicIsDecorative: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    const graphic = canvasElement.querySelector('.droppy-Spinner-graphic')

    await expect(graphic).toHaveAttribute('aria-hidden', 'true')
    await expect(graphic).toHaveAttribute('focusable', 'false')
  },
}

export const TestLabelOverridesName: Story = {
  tags: ['tests'],
  args: { label: 'Loading your order' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status', { name: 'Loading your order' })).toBeInTheDocument()
    await expect(canvas.queryByRole('status', { name: 'Loading' })).not.toBeInTheDocument()
  },
}
