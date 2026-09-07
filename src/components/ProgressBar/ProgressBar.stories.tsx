import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'

import type { ProgressBarProps } from './ProgressBar'
import { ProgressBar } from './ProgressBar'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ProgressBarProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

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
  tags: ['anatomy'],
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
/* tests — assertions only, one behaviour each                         */
