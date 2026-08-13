import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import type { ProgressBarProps } from './ProgressBar'
import { ProgressBar } from './ProgressBar'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ProgressBarProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** Placeholder for an examples story whose content lands in a later session.
 *  Paints its own background so it keeps contrast on any surface. */
const TODO = (
  <p style={{ margin: 0, padding: '0.5rem', background: '#ffffff', color: '#1a1a1a' }}>TODO</p>
)

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = (Story) => (
  <div style={{ border: '1px dashed var(--ds-color-border-subtle)' }}>
    <Story />
  </div>
)

const meta = {
  title: 'Feedback & status/ProgressBar',
  component: ProgressBar,
  args: { value: 1, max: 3, label: 'Checkout progress' },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 5, step: 1 },
      description: 'How far along the track the fill sits. Clamped to 0–`max` before the DOM.',
    },
    max: { control: 'number', description: 'Upper bound `value` is measured against.' },
    label: {
      control: 'text',
      description: 'Accessible name. The visible copy around the bar is the caller’s own markup.',
    },
    className: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-ProgressBar` class.',
    },
  },
  render: (args) => (
    <div style={{ width: '16rem' }}>
      <ProgressBar {...args} />
    </div>
  ),
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Step two of a three-step checkout. Drag `value` past `max` in the controls —
 * the fill clamps rather than overflowing.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { value: 1, max: 3, label: 'Checkout progress' },
  argTypes: hide('className'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `value` positions the fill, from empty through to full. */
export const Value: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'className'),
  render: (args) => (
    <div style={{ display: 'grid', gap: '0.75rem', width: '16rem' }}>
      {[0, 1, 2, 3].map((value) => (
        <ProgressBar {...args} key={value} value={value} />
      ))}
    </div>
  ),
}

/** `max` is the upper bound — step counts, not just percentages. */
export const Max: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { value: 30, max: 40, label: 'Upload progress' },
}

/** `label` is the accessible name; nothing visible is rendered from it. */
export const Label: Story = {
  tags: ['api-ref'],
  argTypes: hide('className'),
  args: { label: 'Order preparation' },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  args: {
    className: 'progressbar-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => (
    <>
      <style>{`.progressbar-demo-inset { margin: 1rem; }`}</style>
      <div style={{ width: '16rem' }}>
        <ProgressBar {...args} />
      </div>
    </>
  ),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * A value past `max` clamps rather than overflowing the track, so a caller
 * that counts one step too far still renders a full bar instead of a broken
 * one — and `aria-valuenow` reports the clamped number, not the raw one.
 */
export const OverMaxClamps: Story = {
  tags: ['highlight'],
  argTypes: hide('className'),
  args: { value: 9, max: 3 },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The track carries the ARIA; the fill is a decorative sibling underneath it. */
export const Anatomy: Story = {
  tags: ['infra'],
  argTypes: hide('value', 'max', 'label', 'className'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The track: `role="progressbar"` with `aria-valuenow`/`-min`/`-max` and the name.',
        },
        {
          id: 'fill',
          name: 'Fill',
          description: 'The width-driven bar. Purely visual — it carries no ARIA of its own.',
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
 * Mined from Mealdrop (`agentic-reference/droppy`): no direct import — the
 * checkout is a single page there rather than a stepped flow. The story to
 * write is a DropBoard one: an order's kitchen progress — 'Received',
 * 'Preparing', 'Out for delivery', 'Delivered' as a four-step bar with the
 * step names as the caller's own markup above it, since the component renders
 * no visible label of its own. Worth contrasting with `Progress`, which owns
 * its label and value parts and can go indeterminate; `ProgressBar` cannot.
 */
export const DropBoardOrderSteps: Story = {
  tags: ['examples'],
  render: () => TODO,
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestReportsItsRange: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Checkout progress' })

    await expect(bar).toHaveAttribute('aria-valuenow', '1')
    await expect(bar).toHaveAttribute('aria-valuemin', '0')
    await expect(bar).toHaveAttribute('aria-valuemax', '3')
  },
}

export const TestClampsOverMax: Story = {
  tags: ['tests'],
  args: { value: 9 },
  play: async ({ canvas, canvasElement }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Checkout progress' })
    const fill = canvasElement.querySelector('.droppy-ProgressBar-fill') as HTMLElement

    await expect(bar).toHaveAttribute('aria-valuenow', '3')
    await expect(fill.style.width).toBe('100%')
  },
}

export const TestClampsBelowZero: Story = {
  tags: ['tests'],
  args: { value: -4 },
  play: async ({ canvas, canvasElement }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Checkout progress' })
    const fill = canvasElement.querySelector('.droppy-ProgressBar-fill') as HTMLElement

    await expect(bar).toHaveAttribute('aria-valuenow', '0')
    await expect(fill.style.width).toBe('0%')
  },
}

export const TestFillIsNotAnnounced: Story = {
  tags: ['tests'],
  play: async ({ canvas, canvasElement }) => {
    // Exactly one progressbar in the tree: the fill is a plain div.
    await expect(canvas.getAllByRole('progressbar')).toHaveLength(1)
    await expect(canvasElement.querySelector('.droppy-ProgressBar-fill')).not.toHaveAttribute(
      'role'
    )
  },
}
